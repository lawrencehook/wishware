// Read metrical Standard MIDI Files, including running status and multitrack files.
function readMidi(buffer) {
    const bytes = new Uint8Array(buffer),
        data = new DataView(buffer);
    let at = 0,
        limit = bytes.length;
    const take = () => {
        if (at >= limit) throw Error('Incomplete MIDI event');
        return bytes[at++];
    };
    const tag = () => String.fromCharCode(take(), take(), take(), take());
    function variable() {
        let n = 0;
        for (let i = 0; i < 4; i++) {
            const b = take();
            n = n * 128 + (b & 127);
            if (b < 128) return n;
        }
        throw Error('Invalid event length');
    }
    if (tag() !== 'MThd' || data.getUint32(at) < 6)
        throw Error('Expected a MIDI file');
    const size = data.getUint32(at),
        format = data.getUint16(at + 4),
        tracks = data.getUint16(at + 6),
        division = data.getUint16(at + 8);
    if (format > 1 || !division || division & 0x8000)
        throw Error('Choose a format 0 or 1 file with musical beat timing');
    at += size + 4;
    const events = [],
        tempos = [[0, 500000]],
        meters = new Map([[0, [4, 4]]]),
        keys = new Map([[0, 0]]);
    for (let track = 0; track < tracks; track++) {
        limit = bytes.length;
        if (tag() !== 'MTrk') throw Error('Missing MIDI track');
        const len = data.getUint32(at);
        at += 4;
        limit = at + len;
        if (limit > bytes.length) throw Error('Incomplete MIDI track');
        let ticks = 0,
            running = 0;
        const held = new Map();
        while (at < limit) {
            ticks += variable();
            let op = take();
            if (op < 128) {
                if (!running) throw Error('Invalid running status');
                at--;
                op = running;
            }
            if (op === 255 || op === 240 || op === 247) {
                running = 0;
                const meta = op === 255 ? take() : null;
                const length = variable();
                if (meta === 81 && length === 3 && at + 3 <= limit) {
                    const tempo =
                        bytes[at] * 65536 + bytes[at + 1] * 256 + bytes[at + 2];
                    if (tempo) tempos.push([ticks, tempo]);
                }
                if (meta === 88 && length === 4 && at + 4 <= limit &&
                    bytes[at] > 0 && bytes[at + 1] <= 6) {
                    meters.set(ticks, [bytes[at], 2 ** bytes[at + 1]]);
                }
                if (meta === 89 && length === 2 && at + 2 <= limit) {
                    const fifths = data.getInt8(at);
                    if (Math.abs(fifths) <= 7) keys.set(ticks, fifths);
                }
                at += length;
                if (at > limit) throw Error('Truncated event');
                continue;
            }
            if (op >= 240) throw Error('Unsupported system event');
            running = op;
            const type = op >> 4,
                channel = op & 15,
                p = take(),
                v = type === 12 || type === 13 ? 0 : take();
            const key = channel * 128 + p;
            if (type === 9 && v) held.set(key, [ticks, v]);
            else if ((type === 8 || type === 9) && held.has(key)) {
                const [begin, velocity] = held.get(key);
                held.delete(key);
                events.push([
                    begin,
                    p,
                    Math.max(begin + 1, ticks),
                    track * 16 + channel,
                    velocity,
                ]);
                if (events.length > 150000)
                    throw Error('MIDI exceeds the 150,000-note limit');
            }
        }
    }
    if (!events.length) throw Error('No playable notes');
    tempos.sort((a, b) => a[0] - b[0]);
    let seconds = 0,
        last = 0,
        micros = 500000;
    const segments = tempos.map(([tick, tempo]) => {
        seconds += ((tick - last) * micros) / (division * 1000000);
        last = tick;
        micros = tempo;
        return { tick, seconds, scale: tempo / (division * 1000000) };
    });
    function toSeconds(tick) {
        let low = 0,
            high = segments.length;
        while (low + 1 < high) {
            const mid = (low + high) >>> 1;
            if (segments[mid].tick <= tick) low = mid;
            else high = mid;
        }
        const segment = segments[low];
        return segment.seconds + (tick - segment.tick) * segment.scale;
    }
    const end = events.reduce((last, event) => Math.max(last, event[2]), 0);
    const changes = [...meters].sort((a, b) => a[0] - b[0]);
    const signatures = [...keys].sort((a, b) => a[0] - b[0]);
    let keyIndex = 0;
    const bars = [];
    for (let i = 0; i < changes.length; i++) {
        const [start, [numerator, denominator]] = changes[i];
        const stop = changes[i + 1]?.[0] ?? end;
        const step = division * numerator * 4 / denominator;
        for (let tick = start; tick < Math.min(stop, end); tick += step) {
            if (bars.length >= 20000) throw Error('MIDI exceeds the 20,000-measure limit');
            while (keyIndex + 1 < signatures.length && signatures[keyIndex + 1][0] <= tick)
                keyIndex++;
            bars.push([tick / division, bars.length + 1, numerator + '/' + denominator, signatures[keyIndex][1]]);
        }
    }
    const tempo = segments.map(({ tick, seconds, scale }) => [
        seconds, tick / division, 60 / (scale * division),
    ]);
    const notes = events
        .map(([t, p, end, group, v]) => [
            toSeconds(t),
            p,
            toSeconds(end) - toSeconds(t),
            group,
            v,
        ])
        .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return { notes, notation: { bars, tempo } };
}
