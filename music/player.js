// The piano roll, playback and sheet-music highlight behind piece.html.
// The page turns its data into one `piece` and calls startPlayer(piece):
//
//   title        named in the sheet music's label
//   voices       [[{t, length, pitches, level}]]: beats, ascending; level (0–1) is optional
//   groups       for each voice, the index of the toggle and colour it belongs to
//   names        one per toggle;  colors: one per toggle
//   instruments  one per voice: piano, organ, violin, viola, cello, harpsichord, flute, soloViolin, contrabass
//   tempoMap     [{beat, seconds, secondsPerBeat}], ascending
//   totalBeats   where the piece ends
//   bars         beat at which each measure heard begins (may be empty: then the clock is shown)
//   label        index of a measure heard → 'm. 12' or 'Pickup';  lastLabel: what follows the slash
//   sheet        null, or {width, left, viewWidth, bars: [{file, imageHeight, y, h, x, width}],
//                printed: index of a measure heard → index in bars}
//   span         beats the roll shows on a wide screen;  dotScale, dotMax: size of its dots
//   gain         master volume;  seating: optional {instrument: stereo position}
//   legato       optional (voice, note) → whether the note is bowed on from the one before
//   bpm          for the length of that bowing
//   onPlay       optional, called as playback starts
//
// It returns {change, stop, seekTo, isRunning} for a page's own controls.
function startPlayer(piece) {
const {voices, groups, names, colors, instruments, tempoMap, totalBeats, bars, sheet} = piece;
const measures = bars.length;
const enabled = names.map(() => true);
const pitches = voices.flat().flatMap(n => n.pitches);
const lowest = Math.min(...pitches), highest = Math.max(...pitches);
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),play=document.querySelector('#play'),seek=document.querySelector('#seek'),speed=document.querySelector('#speed'),bar=document.querySelector('#bar');
seek.max = totalBeats;

function scoreSeconds(beat) {
    const segment = tempoMap.findLast(entry => entry.beat <= beat) ?? tempoMap[0];
    return segment.seconds + (beat - segment.beat) * segment.secondsPerBeat;
}
function scoreBeat(seconds) {
    const segment = tempoMap.findLast(entry => entry.seconds <= seconds) ?? tempoMap[0];
    return segment.beat + (seconds - segment.seconds) / segment.secondsPerBeat;
}

let audio, master, clock, outputs;
function connectOutputs(context) {
    master = context.createGain();
    master.gain.value = piece.gain;
    master.connect(context.destination);
    if (!piece.seating) return;
    // Keep the players distinct on headphones.
    outputs = {};
    for (const [instrument, pan] of Object.entries(piece.seating)) {
        const seat = context.createStereoPanner();
        seat.pan.value = pan;
        seat.connect(master);
        outputs[instrument] = seat;
    }
}
// Resolve the sample once per instrument and pitch, before the playback clock starts.
const samples = new Map();
const sampleLibraries = {
    piano: {file: 'piano', read: () => ({piano: PIANO_SAMPLES})},
    ensemble: {file: 'ensemble-samples', read: () => ENSEMBLE_SAMPLES},
    concerto: {file: 'concerto-samples', read: () => CONCERTO_SAMPLES}
};
const libraryFor = {
    piano: 'piano', organ: 'ensemble', violin: 'ensemble', viola: 'ensemble', cello: 'ensemble',
    harpsichord: 'concerto', flute: 'concerto', soloViolin: 'concerto', contrabass: 'concerto'
};
const banks = {};
async function loadBank(name) {
    if (banks[name]) return;
    const library = sampleLibraries[name];
    const script = document.createElement('script');
    script.src = 'bach-data/' + library.file + '.js';
    await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => { script.remove(); reject(new Error('Sample bank unavailable')); };
        document.head.append(script);
    });
    banks[name] = library.read();
}
let running = false, offset = 0, start = 0;
let startSeconds = 0, playbackSpeed = 1;
let nextNote = [];
const playing = new Set();

async function prepareInstrument() {
    if (!audio) {
        audio = new AudioContext();
        connectOutputs(audio);
    }
    await audio.resume();
    if (samples.size) return;
    const neededBanks = new Set(instruments.map(instrument => libraryFor[instrument]));
    await Promise.all([...neededBanks].map(loadBank));
    const decoded = new Map();
    const notes = new Map();
    for (const [voice, part] of voices.entries()) {
        const instrument = instruments[voice];
        const bank = banks[libraryFor[instrument]][instrument];
        const roots = Object.keys(bank).map(Number);
        for (const pitch of new Set(part.flatMap(n => n.pitches))) {
            const root = roots.reduce((best, r) => Math.abs(pitch-r) < Math.abs(pitch-best) ? r : best);
            const key = instrument + root;
            const sample = bank[root];
            if (!decoded.has(key)) {
                const bytes = Uint8Array.from(atob(sample.data || sample), char => char.charCodeAt(0));
                decoded.set(key, audio.decodeAudioData(bytes.buffer));
            }
            notes.set(instrument + pitch, {key, root, loopStart:sample.loopStart, loopEnd:sample.loopEnd});
        }
    }
    await Promise.all(decoded.values());
    for (const [key, note] of notes) {
        samples.set(key, {...note, buffer: await decoded.get(note.key)});
    }
}

// Join adjacent pitches of a bowed phrase.
function bowOverlap(left, right, voice) {
    if (!left || !right || !piece.legato?.(voice, right)) return 0;
    if (left.pitches.length !== 1 || right.pitches.length !== 1 ||
        left.pitches[0] === right.pitches[0]) return 0;
    // The MIDI engraving leaves gaps of up to one tick around ornaments.
    if (Math.abs(right.t - left.t - left.length) > .003) return 0;
    const beatsPerSecond = piece.bpm / 60 * playbackSpeed;
    return Math.min(.07, left.length / beatsPerSecond / 3, right.length / beatsPerSecond / 3);
}

function sound(pitch, when, duration, age, instrument, level, fadeIn, fadeOut) {
    const sample = samples.get(instrument + pitch);
    const source = audio.createBufferSource();
    source.buffer = sample.buffer;
    const transpose = 2 ** ((pitch - sample.root) / 12);
    source.playbackRate.value = transpose;
    // A connected bow is already sounding. Enter at the recorded sustain.
    let skip = age * transpose + (fadeIn ? sample.loopStart : 0);
    if (sample.loopEnd > sample.loopStart) {
        source.loop = true;
        source.loopStart = sample.loopStart;
        source.loopEnd = sample.loopEnd;
        if (skip >= source.loopEnd) {
            skip = source.loopStart + (skip - source.loopStart) % (source.loopEnd - source.loopStart);
        }
    } else if (skip >= source.buffer.duration) return;
    const envelope = audio.createGain();
    const end = when + duration;
    const releaseSeconds = fadeOut || (instrument === 'harpsichord' ? .075 : instrument === 'piano' ? .22 : .14);
    const attack = Math.min(duration, fadeIn && age < .001 ? fadeIn : .004);
    envelope.gain.setValueAtTime(0, when);
    if (fadeIn) envelope.gain.linearRampToValueAtTime(level * Math.SQRT1_2, when + attack / 2);
    envelope.gain.linearRampToValueAtTime(level, when + attack);
    envelope.gain.setValueAtTime(level, end);
    if (fadeOut) {
        envelope.gain.linearRampToValueAtTime(level * Math.SQRT1_2, end + releaseSeconds / 2);
        envelope.gain.linearRampToValueAtTime(0, end + releaseSeconds);
    } else {
        envelope.gain.exponentialRampToValueAtTime(.0001, end + releaseSeconds);
    }
    source.connect(envelope).connect(outputs?.[instrument] || master);
    const note = {source, envelope};
    playing.add(note);
    source.onended = () => {
        playing.delete(note);
        source.disconnect();
        envelope.disconnect();
    };
    source.start(when, skip);
    source.stop(end + releaseSeconds + .01);
}

function position() {
    if (!running) return offset;
    return Math.min(totalBeats, scoreBeat(startSeconds + Math.max(0, audio.currentTime - start) * playbackSpeed));
}

function release(note) {
    const now = audio.currentTime;
    if (note.envelope.gain.cancelAndHoldAtTime) note.envelope.gain.cancelAndHoldAtTime(now);
    else note.envelope.gain.cancelScheduledValues(now);
    note.envelope.gain.setTargetAtTime(.0001, now, .005);
    note.source.stop(now + .025);
}

function pump() {
    const deadline = audio.currentTime + .18;
    voices.forEach((notes, voice) => {
        while (nextNote[voice] < notes.length) {
            const index = nextNote[voice];
            const n = notes[index];
            const onset = start + (scoreSeconds(n.t) - startSeconds) / playbackSpeed;
            if (onset > deadline) break;
            nextNote[voice]++;
            const when = Math.max(onset, start, audio.currentTime);
            const duration = start + (scoreSeconds(n.t + n.length) - startSeconds) / playbackSpeed - when;
            if (duration <= 0 || !enabled[groups[voice]]) continue;
            const fadeIn = bowOverlap(notes[index - 1], n, voice);
            const fadeOut = bowOverlap(n, notes[index + 1], voice);
            for (const pitch of n.pitches) {
                sound(pitch, when, duration, when - onset, instruments[voice], n.level ?? 1, fadeIn, fadeOut);
            }
        }
    });
}

function stop() {
    offset = position();
    running = false;
    clearInterval(clock);
    playing.forEach(release);
    play.textContent = offset >= totalBeats ? 'Replay' : 'Play';
}

function schedule() {
    start = audio.currentTime + .025;
    startSeconds = scoreSeconds(offset);
    playbackSpeed = Number(speed.value);
    nextNote = voices.map(notes => {
        const index = notes.findIndex(n => n.t + n.length > offset);
        return index < 0 ? notes.length : index;
    });
    running = true;
    play.textContent = 'Pause';
    pump();
    clock = setInterval(pump, 40);
}

function change(fn) {
    const resume = running;
    stop();
    fn?.();
    if (resume && offset < totalBeats) schedule();
    else play.textContent = offset >= totalBeats ? 'Replay' : 'Play';
}

play.onclick = async () => {
    if (running) { stop(); return; }
    play.disabled = true;
    play.textContent = 'Loading…';
    try {
        await prepareInstrument();
        document.querySelector('#status').textContent = '';
    } catch (error) {
        play.textContent = 'Retry';
        document.querySelector('#status').textContent = 'Instrument samples could not be loaded. Please try again.';
        console.error(error);
        return;
    } finally {
        play.disabled = false;
    }
    if (offset >= totalBeats) offset = 0;
    piece.onPlay?.();
    schedule();
};
seek.oninput=()=>change(()=>offset=Number(seek.value));speed.onchange=()=>change();
names.forEach((name,v)=>{const b=document.createElement('button'),dot=document.createElement('i');dot.style.background=colors[v];b.append(dot,name);b.setAttribute('aria-pressed','true');b.title='Toggle '+name.toLowerCase()+' voice';b.onclick=()=>change(()=>{enabled[v]=!enabled[v];b.setAttribute('aria-pressed',enabled[v])});document.querySelector('.voices').append(b)});

function clockText(seconds) {
    return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
}
const staff = document.querySelector('#staff');
const paper = document.querySelector('.paper');
const engraving = document.querySelector('#engraving');
const highlight = document.querySelector('#measure-highlight');
document.querySelector('.sheet:not(.recording)').hidden = !sheet;
if (sheet) engraving.setAttribute('width', sheet.width);
let imageFile, lastMeasure = -1;
function showMeasure(t) {
    if (!measures) {
        bar.textContent = clockText(scoreSeconds(t)) + ' / ' + clockText(scoreSeconds(totalBeats));
        return;
    }
    const index = Math.max(0, bars.findLastIndex(beat => beat <= t));
    if (index === lastMeasure) return;
    lastMeasure = index;
    const label = piece.label(index);
    bar.textContent = label + ' / ' + piece.lastLabel;
    if (!sheet) return;
    const {file, imageHeight, y, h, x, width} = sheet.bars[sheet.printed(index)];
    if (file !== imageFile) {
        imageFile = file;
        engraving.setAttribute('href', file);
        engraving.setAttribute('height', imageHeight);
    }
    staff.setAttribute('viewBox', [sheet.left, y, sheet.viewWidth, h].join(' '));
    staff.setAttribute('aria-label', piece.title + ', ' + label);
    highlight.setAttribute('x', x);
    highlight.setAttribute('y', y);
    highlight.setAttribute('width', width);
    highlight.setAttribute('height', h);
    const scale = staff.clientWidth / sheet.viewWidth;
    const left = (x - sheet.left) * scale, right = (x - sheet.left + width) * scale;
    if (left < paper.scrollLeft || right > paper.scrollLeft + paper.clientWidth) {
        paper.scrollLeft = (left + right - paper.clientWidth) / 2;
    }
}

function draw(){
 const t=Math.max(0,position());if(running&&t>=totalBeats)stop();if(document.activeElement!==seek||running)seek.value=t;showMeasure(t);
 const w=canvas.clientWidth,h=canvas.clientHeight,d=devicePixelRatio;if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d)}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
 const span=w<600?piece.span/2:piece.span,left=Math.max(0,Math.min(totalBeats-span,t-span*.38)),x=b=>12+(b-left)*(w-24)/span,y=p=>h-44-(p-lowest)*(h-80)/(highest-lowest||1);
 for(let i=0;i<measures;i++){const xx=x(bars[i]);if(xx<0)continue;if(xx>w)break;ctx.fillStyle='#647371';ctx.font='11px monospace';ctx.fillText(piece.label(i).replace('m. ', ''),xx+4,h-12);ctx.fillStyle='#1d2929';ctx.fillRect(xx,18,1,h-48)}
 voices.forEach((notes,v)=>{
    const group=groups[v];
    ctx.strokeStyle=ctx.fillStyle=colors[group];
    ctx.lineWidth=1.5;
    let prev;
    for(const n of notes){
        const xx=x(n.t);
        if(xx>w+25) break;
        if(xx < -30){ prev=n; continue; }
        const active=running && t>=n.t && t<n.t+n.length;
        n.pitches.forEach((pitch,i)=>{
            const yy=y(pitch);
            if(prev && Math.abs(prev.t+prev.length-n.t)<.004){
                const last=prev.pitches[Math.min(i,prev.pitches.length-1)];
                ctx.globalAlpha=enabled[group] ? .68 : .09;
                ctx.beginPath();ctx.moveTo(x(prev.t),y(last));ctx.lineTo(xx,yy);ctx.stroke();
            }
            ctx.globalAlpha=enabled[group] ? (active ? 1 : .65) : .12;
            ctx.beginPath();ctx.arc(xx,yy,Math.min(piece.dotMax,3+Math.sqrt(n.length)*4)*piece.dotScale,0,Math.PI*2);
            if(n.t>=t||active)ctx.fill();else ctx.stroke();
            if(active&&enabled[group]){
                ctx.globalAlpha=.22;ctx.beginPath();ctx.arc(xx,yy,14,0,Math.PI*2);ctx.fill();
            }
        });
        prev=n;
    }
 });ctx.globalAlpha=.5;ctx.fillStyle='#eeeedd';ctx.fillRect(x(t),15,1,h-47);ctx.globalAlpha=1;requestAnimationFrame(draw)
}draw();

return {change, stop, seekTo: beat => change(() => { offset = beat; }), isRunning: () => running};
}
