// A continuous, seekable score. Times in the edition files are seconds at normal speed.
(() => {
    const player = document.querySelector('[data-score-player]');
    if (!player) return;
    const get = (name) => player.querySelector('[data-' + name + ']');
    const play = get('play'),
        seek = get('position'),
        speed = get('speed');
    const clock = get('clock'),
        status = get('status'),
        chapters = get('movements');
    const canvas = get('roll'),
        g = canvas.getContext('2d');
    const showMeasure = createMeasureView(canvas);
    let edition = [];
    const colors = ['#b7e6ca', '#f2ca8a', '#a7c3f2', '#ebaaa1'];
    const library = typeof score === 'undefined' ? [] : score.movements;
    const take = typeof score === 'undefined' ? null : score.take;
    const recording = document.querySelector('audio[data-take]');
    const compare = document.querySelector('[data-compare]');
    let usingTake = Boolean(take),
        lastSound = 'recording';
    let timeline = [],
        movements = [],
        duration = 0,
        cursor = 0,
        rate = 1;
    let context,
        master,
        ready,
        origin,
        next,
        frame,
        timer,
        active = false,
        request = 0;
    let pitches = [],
        minPitch,
        maxPitch,
        maxLength,
        groupIds;
    const voices = new Set(),
        samples = new Map(),
        decoded = new Map();
    const continuo = player.dataset.instrument === 'continuo';
    const strings = continuo || player.dataset.instrument === 'strings';
    const format = (t) =>
        Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');

    function useEdition(parts) {
        pause();
        edition = parts;
        timeline = [];
        duration = 0;
        movements = [];
        chapters.replaceChildren();
        for (const part of parts) {
            const begin = duration;
            movements.push(begin);
            chapters.add(new Option(part.name, begin));
            for (const [time, pitch, length, group, velocity] of part.notes) {
                timeline.push({
                    time: begin + time,
                    pitch,
                    length,
                    group,
                    velocity: velocity ?? 82,
                });
                duration = Math.max(duration, begin + time + length);
            }
            duration += 0.45;
        }
        timeline.sort((a, b) => a.time - b.time);
        groupIds = [...new Set(timeline.map((n) => n.group))].sort(
            (a, b) => a - b,
        );
        pitches = [...new Set(timeline.map((n) => n.pitch))];
        minPitch = Math.min(...pitches) - 1;
        maxPitch = Math.max(...pitches) + 1;
        maxLength = timeline.reduce((m, n) => Math.max(m, n.length), 0);
        chapters.parentElement.hidden = parts.length < 2;
        get('transport').hidden = canvas.hidden = !parts.length;
        seek.max = duration;
        cursor = 0;
        render();
    }
    function atTime(t) {
        let lo = 0,
            hi = timeline.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (timeline[mid].time < t) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
    function position() {
        return active
            ? Math.max(
                  cursor,
                  Math.min(duration, (context.currentTime - origin) * rate),
              )
            : cursor;
    }
    function render() {
        const t = position(),
            span = 12 * rate,
            left = Math.floor(t / span) * span;
        clock.textContent = format(t) + ' / ' + format(duration);
        seek.value = t;
        const chapter = movements.findLastIndex((v) => v <= t);
        if (chapter >= 0) chapters.selectedIndex = chapter;
        showMeasure(edition[chapter], t - (movements[chapter] ?? 0));
        if (canvas.hidden) return;
        const width = canvas.width,
            height = canvas.height;
        g.fillStyle = '#192b28';
        g.fillRect(0, 0, width, height);
        const row = (height - 36) / Math.max(1, maxPitch - minPitch + 1);
        for (let p = minPitch; p <= maxPitch; p++) {
            const y = 8 + (maxPitch - p) * row;
            if (p % 12 === 0) {
                g.fillStyle = '#384942';
                g.fillRect(0, y, width, 1);
            }
        }
        for (let j = atTime(left - maxLength); j < timeline.length; j++) {
            const n = timeline[j];
            if (n.time >= left + span) break;
            if (n.time + n.length <= left) continue;
            const x = ((n.time - left) / span) * width;
            g.fillStyle = colors[groupIds.indexOf(n.group) % colors.length];
            g.fillRect(
                x,
                8 + (maxPitch - n.pitch) * row,
                Math.max(2, (n.length / span) * width - 1),
                Math.max(2, row * 0.83),
            );
        }
        g.fillStyle = '#fdf5d8';
        g.fillRect(((t - left) / span) * width, 0, 2, height - 24);
        g.font = '16px system-ui';
        g.fillText(format(left), 8, height - 5);
        g.fillText(
            format(Math.min(left + span, duration)),
            width - 55,
            height - 5,
        );
    }

    function pause() {
        request++;
        if (active) cursor = position();
        active = false;
        clearInterval(timer);
        cancelAnimationFrame(frame);
        for (const source of voices) {
            try {
                source.stop();
            } catch {}
        }
        voices.clear();
        play.textContent = 'Play';
        render();
    }
    async function loadBankFile(name) {
        const script = document.createElement('script');
        script.src = '../../music/bach-data/' + name + '.js';
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(Error('The instrument samples could not load.'));
            };
            document.head.append(script);
        });
    }
    function instrument(group) {
        if (!strings) return 'piano';
        const names = continuo
            ? ['violin', 'violin', 'cello', 'harpsichord']
            : ['violin', 'violin', 'viola', 'cello'];
        return names[Math.min(groupIds.indexOf(group), 3)];
    }
    async function prepare() {
        ready ??= Promise.all(
            (continuo
                ? ['ensemble-samples', 'concerto-samples']
                : [strings ? 'ensemble-samples' : 'piano']
            ).map(loadBankFile),
        ).catch((error) => {
            ready = null;
            throw error;
        });
        await ready;
        const unique = new Set(
            timeline.map((n) => instrument(n.group) + ':' + n.pitch),
        );
        await Promise.all(
            [...unique].map(async (key) => {
                if (samples.has(key)) return;
                const [name, p] = key.split(':');
                const bank =
                    name === 'harpsichord'
                        ? CONCERTO_SAMPLES[name]
                        : strings
                          ? ENSEMBLE_SAMPLES[name]
                          : PIANO_SAMPLES;
                const roots = Object.keys(bank).map(Number);
                const root = roots.reduce((best, r) =>
                    Math.abs(r - p) < Math.abs(best - p) ? r : best,
                );
                const item = bank[root],
                    id = name + root;
                if (!decoded.has(id)) {
                    const bytes = Uint8Array.from(
                        atob(item.data ?? item),
                        (c) => c.charCodeAt(0),
                    );
                    decoded.set(
                        id,
                        context.decodeAudioData(bytes.buffer).catch((e) => {
                            decoded.delete(id);
                            throw e;
                        }),
                    );
                }
                samples.set(key, {
                    buffer: await decoded.get(id),
                    root,
                    start: item.loopStart,
                    end: item.loopEnd,
                });
            }),
        );
    }
    function sound(n, now) {
        const sample = samples.get(instrument(n.group) + ':' + n.pitch);
        const start = Math.max(now, origin + n.time / rate);
        const finish = origin + (n.time + n.length) / rate;
        if (finish <= start) return;
        const source = context.createBufferSource(),
            gain = context.createGain();
        source.buffer = sample.buffer;
        const transpose = 2 ** ((n.pitch - sample.root) / 12);
        source.playbackRate.value = transpose;
        let skip = Math.max(0, (start - origin - n.time / rate) * transpose);
        if (sample.end > sample.start) {
            source.loop = true;
            source.loopStart = sample.start;
            source.loopEnd = sample.end;
            if (skip >= sample.end)
                skip =
                    sample.start +
                    ((skip - sample.start) % (sample.end - sample.start));
        } else if (skip >= source.buffer.duration) return;
        const velocity = get('expression')?.checked === false ? 82 : n.velocity;
        const level = 0.57 * (velocity / 100) ** 1.6;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(
            Math.max(0.001, level),
            Math.min(finish, start + 0.007),
        );
        gain.gain.setValueAtTime(Math.max(0.001, level), finish);
        gain.gain.exponentialRampToValueAtTime(0.0001, finish + 0.18);
        source.connect(gain).connect(master);
        voices.add(source);
        source.onended = () => {
            voices.delete(source);
            source.disconnect();
            gain.disconnect();
        };
        source.start(start, skip);
        source.stop(finish + 0.2);
    }
    function schedule() {
        const now = context.currentTime,
            t = (now - origin) * rate;
        while (next < timeline.length && timeline[next].time < t + 0.25 * rate)
            sound(timeline[next++], now);
        if (t >= duration) {
            pause();
            cursor = duration;
            render();
        }
    }
    async function start() {
        if (!timeline.length) return;
        document.dispatchEvent(new Event('scoreplay'));
        if (compare && usingTake) {
            lastSound = 'score';
            compare.textContent = 'Hear this point in the recording';
        }
        const id = ++request;
        if (cursor >= duration - 0.01) cursor = 0;
        try {
            context ??= new AudioContext();
            if (!master) {
                master = context.createDynamicsCompressor();
                master.connect(context.destination);
            }
            status.textContent = 'Loading instrument…';
            play.textContent = 'Cancel';
            await context.resume();
            await prepare();
            if (id !== request) return;
            status.textContent = '';
            active = true;
            play.textContent = 'Pause';
            origin = context.currentTime + 0.035 - cursor / rate;
            next = atTime(cursor - maxLength);
            schedule();
            timer = setInterval(schedule, 65);
            function animate() {
                render();
                if (active) frame = requestAnimationFrame(animate);
            }
            animate();
        } catch (e) {
            if (id === request) {
                pause();
                status.textContent = 'Could not play this score. ' + e.message;
            }
        }
    }
    function move(value, resume) {
        pause();
        cursor = Math.max(0, Math.min(duration, value));
        render();
        if (resume) start();
    }
    play.onclick = () => {
        if (active || play.textContent === 'Cancel') {
            pause();
            status.textContent = '';
        } else start();
    };
    let resumeSeek = false;
    seek.addEventListener('input', () => {
        const value = +seek.value;
        if (usingTake && take?.downbeats && lastSound === 'recording' &&
            Number.isFinite(recording.duration)) {
            recording.currentTime = Math.min(recording.duration, value);
        }
        resumeSeek ||= active;
        move(value, false);
    });
    seek.addEventListener('change', () => {
        if (resumeSeek) start();
        resumeSeek = false;
    });
    speed.onchange = () => {
        const resume = active;
        pause();
        rate = +speed.value;
        render();
        if (resume) start();
    };
    chapters.onchange = () => move(+chapters.value, active);
    document.addEventListener('performanceplay', () => {
        pause();
        status.textContent = '';
    });
    window.addEventListener('pagehide', pause);
    const file = get('file');
    let loadId = 0;
    file.onchange = async () => {
        const selected = file.files[0];
        if (!selected) return;
        const id = ++loadId;
        try {
            if (selected.size > 8 * 1024 * 1024)
                throw Error('Choose a MIDI file under 8 MB.');
            const imported = readMidi(await selected.arrayBuffer());
            if (id !== loadId) return;
            usingTake = false;
            if (editions) editions.selectedIndex = -1;
            useEdition([{ name: selected.name, ...imported }]);
            status.textContent = selected.name;
            get('edition-name').textContent = selected.name;
        } catch (e) {
            if (id === loadId) status.textContent = e.message;
        }
    };
    const editions = get('editions');
    if (editions)
        editions.onchange = () => {
            usingTake = editions.selectedIndex === 0;
            useEdition(usingTake ? [take] : library);
            get('edition-name').textContent = usingTake
                ? take.name
                : library[0].name;
            lastSound = 'recording';
            compare.textContent = 'Hear this point on sampled piano';
        };
    if (compare && take) {
        recording.addEventListener('play', () => {
            if (take.downbeats && !usingTake) {
                usingTake = true;
                if (editions) editions.selectedIndex = 0;
                useEdition([take]);
                get('edition-name').textContent = take.name;
            }
            lastSound = 'recording';
            compare.textContent = 'Hear this point on sampled piano';
        });
        if (take.downbeats) {
            const followRecording = () => {
                if (!usingTake || active || lastSound !== 'recording') return;
                cursor = Math.min(duration, recording.currentTime);
                render();
            };
            for (const event of ['play', 'timeupdate', 'seeked', 'pause'])
                recording.addEventListener(event, followRecording);
        }
        compare.onclick = async () => {
            if (lastSound === 'score' && usingTake) {
                const t = position();
                pause();
                recording.currentTime = t;
                try {
                    await recording.play();
                } catch {
                    status.textContent =
                        'Press play on the recording to continue.';
                }
            } else {
                const t = recording.currentTime;
                recording.pause();
                if (!usingTake) {
                    usingTake = true;
                    if (editions) editions.selectedIndex = 0;
                    useEdition([take]);
                    get('edition-name').textContent = take.name;
                }
                move(t, true);
            }
        };
    }
    document.querySelectorAll('[data-cue]').forEach((button) => {
        button.onclick = () => {
            const index = library.findIndex(
                (part) => part.name === button.dataset.cue,
            );
            if (index < 0) return;
            useEdition(library);
            get('edition-name').textContent = library[index].name;
            move(movements[index], true);
        };
    });
    useEdition(take ? [take] : library);
})();
