// Engrave a two-staff playing reduction from the same notes as the transport.
// Bar starts are in quarter notes. Tempo anchors are [seconds, quarters, BPM].
function createMeasureView(canvas) {
    const figure = document.createElement('figure');
    figure.className = 'measure-view';
    figure.hidden = true;
    const caption = document.createElement('figcaption');
    const heading = document.createElement('strong');
    const description = document.createElement('small');
    description.textContent = 'Two-staff reduction';
    caption.append(heading, description);
    const system = document.createElement('div');
    system.className = 'measure-system';
    figure.append(caption, system);
    canvas.after(figure);

    const vendor = new URL('vendor/abcjs-basic-min.js', document.currentScript.src);
    let engraver, current, source, previous = -1, systemStart = -1;
    function load() {
        if (!engraver) {
            engraver = document.createElement('script');
            engraver.src = vendor;
            engraver.onload = () => {
                if (current?.notation) draw(previous);
            };
            engraver.onerror = () => {
                heading.textContent = 'Sheet music could not load.';
            };
            document.head.append(engraver);
        }
    }
    function floorIndex(list, value) {
        let lo = 0, hi = list.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if ((Array.isArray(list[mid]) ? list[mid][0] : list[mid]) <= value) lo = mid + 1;
            else hi = mid;
        }
        return Math.max(0, lo - 1);
    }
    function beat(part, seconds) {
        const anchors = part.notation.tempo;
        const [time, quarters, bpm] = anchors[floorIndex(anchors, seconds)];
        return quarters + (seconds - time) * bpm / 60;
    }
    const keyNames = 'Cb Gb Db Ab Eb Bb F C G D A E B F# C#'.split(' ');
    function spellPitch(midi, fifths, accidentals) {
        const letters = 'CDEFGAB';
        const naturals = [0, 2, 4, 5, 7, 9, 11];
        const altered = (fifths < 0 ? 'BEADGCF' : 'FCGDAEB').slice(0, Math.abs(fifths));
        const signatures = [...letters].map(l => altered.includes(l) ? Math.sign(fifths) : 0);
        const pc = midi % 12;
        let degree = naturals.findIndex((n, i) => (n + signatures[i] + 12) % 12 === pc);
        let accidental;
        if (degree >= 0) accidental = signatures[degree];
        else {
            degree = naturals.indexOf(pc);
            accidental = 0;
            if (degree < 0) {
                accidental = fifths < 0 ? -1 : 1;
                degree = naturals.indexOf(pc - accidental);
            }
        }
        const octave = Math.floor((midi - accidental) / 12) - 5;
        const name = letters[degree];
        const written = octave >= 1 ? name.toLowerCase() + "'".repeat(octave - 1)
            : name + ','.repeat(-octave);
        const previous = accidentals.get(written) ?? signatures[degree];
        accidentals.set(written, accidental);
        return (previous === accidental ? '' : ['_', '=', '^'][accidental + 1]) + written;
    }
    function length(ticks) {
        // ABC's unit length is a quarter. Reduce the fraction for the engraver.
        let a = ticks, b = 24;
        while (b) [a, b] = [b, a % b];
        return ticks === 24 ? '' : (ticks / a) + (a === 24 ? '' : '/' + (24 / a));
    }
    function staff(events, size, fifths, pulse) {
        const accidentals = new Map();
        const tokens = [];
        let cursor = 0;
        for (let i = 0; i < events.length; i++) {
            const [start, chord] = events[i];
            if (start > cursor) tokens.push(' z' + length(start - cursor) + ' ');
            const next = events[i + 1]?.[0] ?? size;
            const sounding = Math.max(...chord.values());
            const duration = next - start - sounding <= 2 ? next - start : sounding;
            const pitches = [...chord.keys()].sort((a, b) => a - b).map(p => spellPitch(p, fifths, accidentals));
            const symbol = pitches.length === 1 ? pitches[0] : '[' + pitches.join('') + ']';
            tokens.push((start % pulse === 0 ? ' ' : '') + symbol + length(duration));
            cursor = start + duration;
        }
        if (cursor < size) tokens.push('z' + length(size - cursor));
        return tokens.join('') + ' |';
    }
    const prepared = new WeakMap();
    function prepare(part) {
        if (prepared.has(part)) return prepared.get(part);
        let longest = 0;
        const list = part.notes.map(([t, p, d]) => {
            const start = beat(part, t), end = beat(part, t + d);
            longest = Math.max(longest, end - start);
            return [start, p, end];
        });
        list.longest = longest;
        prepared.set(part, list);
        return list;
    }
    function abc(index) {
        const bars = current.notation.bars;
        const [start, , meter, fifths = 0] = bars[index];
        const [num, den] = meter.split('/').map(Number);
        const pulse = (num >= 6 && num % 3 === 0 ? 3 : 1) * 96 / den;
        const end = bars[index + 1]?.[0] ?? start + 4 * num / den;
        const size = Math.max(1, Math.round((end - start) * 24));
        const groups = [new Map(), new Map()];
        const notes = prepare(current);
        // Source note times are rounded to milliseconds in the edition files.
        let lo = floorIndex(notes, start - notes.longest - 0.004);
        for (; lo < notes.length && notes[lo][0] < end - 0.003; lo++) {
            const [onset, midi, release] = notes[lo];
            if (release <= start + 0.003 && onset < start - 0.003) continue;
            const at = Math.min(size - 1, Math.max(0, Math.round((onset - start) * 24)));
            const group = groups[midi < 60 ? 1 : 0];
            if (!group.has(at)) group.set(at, new Map());
            group.get(at).set(midi, Math.max(1, Math.round((release - Math.max(start, onset)) * 24)));
        }
        return ['X:1','M:' + meter,'L:1/4','%%score { (RH) | (LH) }',
            'V:RH clef=treble','V:LH clef=bass','K:' + keyNames[fifths + 7],
            '[V:RH] ' + staff([...groups[0]], size, fifths, pulse),
            '[V:LH] ' + staff([...groups[1]], size, fifths, pulse)].join('\n');
    }
    function label(number) {
        return number === 0 ? 'Pickup' : 'Measure ' + number;
    }
    function draw(index) {
        if (index < 0 || !window.ABCJS) return;
        const bars = current.notation.bars;
        const first = index - index % 2;
        if (systemStart !== first) {
            systemStart = first;
            system.replaceChildren();
            for (let j = first; j < Math.min(first + 2, bars.length); j++) {
                const cell = document.createElement('div');
                const tag = document.createElement('small');
                tag.textContent = label(bars[j][1]);
                const notation = document.createElement('div');
                notation.setAttribute('aria-hidden','true');
                cell.append(tag, notation);
                system.append(cell);
                ABCJS.renderAbc(notation, abc(j), { responsive: 'resize',
                    staffwidth: 380, paddingtop: 0, paddingbottom: 4,
                    paddingleft: 4, paddingright: 4, stretchlast: true });
            }
        }
        [...system.children].forEach((cell, i) => {
            cell.classList.toggle('playing-measure', first + i === index);
        });
    }
    return (playback, seconds) => {
        const part = playback?.written ?? playback;
        if (source !== playback) {
            source = playback;
            current = part;
            previous = systemStart = -1;
            system.replaceChildren();
        }
        figure.hidden = !part;
        if (!part) return;
        if (!part.notation?.bars.length) {
            if (previous === -1) {
                previous = -2;
                heading.textContent = 'Piano roll';
                description.textContent = 'Measure timing is unavailable for this performance.';
                system.hidden = true;
            }
            return;
        }
        if (previous === -1) {
            system.hidden = false;
            description.textContent = playback.downbeats
                ? 'Two-staff reduction · aligned to this performance'
                : 'Two-staff reduction';
        }
        const bars = part.notation.bars;
        const index = playback.downbeats ? floorIndex(playback.downbeats, seconds)
            : floorIndex(bars, beat(part, seconds) + 0.00001);
        if (index === previous) return;
        previous = index;
        heading.textContent = label(bars[index][1]);
        load();
        draw(index);
    };
}
