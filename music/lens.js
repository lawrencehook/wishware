// Live 88-key keyboard and Circle of Fifths harmony lens for piece.html.
// Drawn deterministically from the score at playback beat `t`, so both live
// playback and scrubbing update the keyboard, chord readout, and harmonic wheel.
function createHarmonyLens(piece, onToggle) {
    const toggle = document.querySelector('#lens-toggle');
    const panel = document.querySelector('#lens');
    const kbCanvas = document.querySelector('#keyboard');
    const wheelCanvas = document.querySelector('#harmony');
    const chordOut = document.querySelector('#lens-chord');
    const keyOut = document.querySelector('#lens-key');
    const legendOut = document.querySelector('#lens-legend');
    if (!toggle || !panel || !kbCanvas || !wheelCanvas) {
        return { draw() {}, isOpen: () => false };
    }

    const { voices, groups, names, colors, keyMap } = piece;
    const lightColors = piece.lightColors ?? colors;

    // Build legend showing voice colors + keyboard/ring markings.
    const voiceLegendItems = [];
    if (legendOut) {
        legendOut.replaceChildren();
        const addItem = (swatchClass, label, bg) => {
            const item = document.createElement('span');
            item.className = 'lens-legend-item';
            const sw = document.createElement('span');
            sw.className = 'lens-swatch ' + swatchClass;
            if (bg) sw.style.background = bg;
            item.append(sw, label);
            legendOut.append(item);
            return item;
        };
        (names ?? []).forEach((name, i) => {
            const bg = `light-dark(${lightColors[i % lightColors.length]}, ${colors[i % colors.length]})`;
            voiceLegendItems.push(addItem('dot', name, bg));
        });
        addItem('range', 'Keys used in piece');
        if (keyMap && keyMap.length) {
            addItem('arc', 'Shaded arc: 7 notes in key');
            addItem('chrom', 'Red ring: chromatic (out of key)');
        }
    }

    // Precompute per-voice max note duration (for fast lookback) and piece pitch range.
    const voiceMaxLen = voices.map(part => {
        let max = 0;
        for (const n of part) if (n.length > max) max = n.length;
        return max;
    });
    const usedPitches = new Set();
    for (const part of voices) for (const n of part) for (const p of n.pitches) usedPitches.add(p);

    // 88-key piano geometry (A0 = 21 .. C8 = 108), 52 white keys.
    const BLACK_PCS = new Set([1, 3, 6, 8, 10]);
    const whiteKeys = [];
    const blackKeys = [];
    let whiteIdx = 0;
    for (let midi = 21; midi <= 108; midi++) {
        const pc = midi % 12;
        if (BLACK_PCS.has(pc)) {
            blackKeys.push({ midi, xSlot: whiteIdx - 0.34 });
        } else {
            whiteKeys.push({ midi, xSlot: whiteIdx });
            whiteIdx++;
        }
    }

    // Circle of Fifths ordering (clockwise from 12 o'clock = C).
    const FIFTHS_PCS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
    const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
    const FLAT_NAMES  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
    const KEY_LABELS = {
        '-7': 'C♭ major / A♭ minor (7♭)', '-6': 'G♭ major / E♭ minor (6♭)',
        '-5': 'D♭ major / B♭ minor (5♭)', '-4': 'A♭ major / F minor (4♭)',
        '-3': 'E♭ major / C minor (3♭)',  '-2': 'B♭ major / G minor (2♭)',
        '-1': 'F major / D minor (1♭)',    '0': 'C major / A minor',
         '1': 'G major / E minor (1♯)',    '2': 'D major / B minor (2♯)',
         '3': 'A major / F♯ minor (3♯)',   '4': 'E major / C♯ minor (4♯)',
         '5': 'B major / G♯ minor (5♯)',   '6': 'F♯ major / D♯ minor (6♯)',
         '7': 'C♯ major / A♯ minor (7♯)',
    };

    const CHORD_TEMPLATES = [
        [[0, 4, 7], 'major'],
        [[0, 3, 7], 'minor'],
        [[0, 3, 6], 'dim'],
        [[0, 4, 8], 'aug'],
        [[0, 4, 7, 11], 'maj7'],
        [[0, 4, 7, 10], '7'],
        [[0, 3, 7, 10], 'm7'],
        [[0, 3, 6, 10], 'ø7'],
        [[0, 3, 6, 9], 'dim7'],
        [[0, 5, 7], 'sus4'],
        [[0, 2, 7], 'sus2'],
    ];

    function pitchName(midi, flat) {
        const names = flat ? FLAT_NAMES : SHARP_NAMES;
        return names[midi % 12] + (Math.floor(midi / 12) - 1);
    }

    function detectChord(activeMidis, flat) {
        if (!activeMidis.length) return '';
        const names = flat ? FLAT_NAMES : SHARP_NAMES;
        const pcs = [...new Set(activeMidis.map(m => m % 12))];
        if (pcs.length < 3) return '';
        const bassPc = Math.min(...activeMidis) % 12;
        const pcSet = new Set(pcs);
        // Check bass note as root first, then every other sounding pitch class.
        const candidates = [bassPc, ...pcs.filter(p => p !== bassPc)];
        for (const root of candidates) {
            const rel = pcs.map(p => (p - root + 12) % 12).sort((a, b) => a - b);
            for (const [pattern, label] of CHORD_TEMPLATES) {
                if (rel.length === pattern.length && pattern.every((v, i) => rel[i] === v)) {
                    const inv = root !== bassPc ? '/' + names[bassPc] : '';
                    return names[root] + (label === 'major' ? '' : label === 'minor' ? 'm' : label) + inv;
                }
            }
        }
        // Fallback: check if a 4+ note chord is a clean triad + color tone? Keep it honest—only exact matches.
        if (pcSet.size === 6 && ([0, 2, 4, 6, 8, 10].every(p => pcSet.has(p)) || [1, 3, 5, 7, 9, 11].every(p => pcSet.has(p)))) {
            return 'Whole-tone hexachord';
        }
        return '';
    }

    function currentFifths(t) {
        if (!keyMap?.length) return null;
        let lo = 0, hi = keyMap.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (keyMap[mid][0] <= t + 1e-4) lo = mid + 1;
            else hi = mid;
        }
        return keyMap[Math.max(0, lo - 1)][1];
    }

    function firstAfter(notes, time) {
        let lo = 0, hi = notes.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (notes[mid].t < time) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    function gather(t, enabled) {
        const activeKeys = new Map(); // midi -> group
        const trail = new Map();      // pc -> { weight, group, active }
        const trailWindow = 2.0;      // beats of recent harmonic memory
        const atStart = t < 0.001;
        for (let v = 0; v < voices.length; v++) {
            const group = groups[v];
            if (!enabled[group]) continue;
            const notes = voices[v];
            const lookback = t - voiceMaxLen[v] - trailWindow;
            let i = firstAfter(notes, lookback);
            for (; i < notes.length; i++) {
                const n = notes[i];
                if (n.t > t + (atStart ? 0.02 : 0.001)) break;
                const end = n.t + n.length;
                if (end < t - trailWindow) continue;
                const sounding = (n.t <= t + 0.001 && t < end) || (atStart && n.t <= 0.02);
                const weight = sounding ? 1 : Math.max(0.14, 1 - (t - end) / trailWindow);
                for (const p of n.pitches) {
                    if (sounding && !activeKeys.has(p)) activeKeys.set(p, group);
                    const pc = p % 12;
                    const prev = trail.get(pc);
                    if (!prev || weight > prev.weight || (sounding && !prev.active)) {
                        trail.set(pc, { weight, group, active: Boolean(sounding || prev?.active) });
                    }
                }
            }
        }
        return { activeKeys, trail };
    }

    function drawKeyboard(activeKeys, light, palette) {
        const w = kbCanvas.clientWidth, h = kbCanvas.clientHeight;
        if (!w || !h) return;
        const d = devicePixelRatio || 1;
        const pw = Math.round(w * d), ph = Math.round(h * d);
        if (kbCanvas.width !== pw || kbCanvas.height !== ph) { kbCanvas.width = pw; kbCanvas.height = ph; }
        const ctx = kbCanvas.getContext('2d');
        ctx.setTransform(d, 0, 0, d, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const kw = w / 52;
        const bh = Math.round(h * 0.6);
        const bw = kw * 0.64;

        // White keys
        for (const k of whiteKeys) {
            const x = k.xSlot * kw;
            const activeGroup = activeKeys.get(k.midi);
            if (activeGroup !== undefined) {
                ctx.fillStyle = palette[activeGroup % palette.length];
            } else {
                ctx.fillStyle = light ? '#f8f7f1' : '#dcdad0';
            }
            ctx.fillRect(x, 0, kw - 0.5, h);
            if (usedPitches.has(k.midi) && activeGroup === undefined) {
                ctx.fillStyle = light ? 'rgba(131,107,38,.28)' : 'rgba(233,206,128,.32)';
                ctx.fillRect(x, h - 4, kw - 0.5, 4);
            }
            ctx.strokeStyle = light ? '#b8c0bc' : '#263031';
            ctx.lineWidth = 0.75;
            ctx.strokeRect(x + 0.25, 0.25, kw - 0.75, h - 0.5);
            if (k.midi % 12 === 0 && kw >= 9) {
                const oct = Math.floor(k.midi / 12) - 1;
                ctx.fillStyle = activeGroup !== undefined ? (light ? '#fff' : '#111') : (light ? '#68706c' : '#555c58');
                ctx.font = '9px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('C' + oct, x + kw / 2, h - 7);
            }
        }

        // Black keys
        for (const k of blackKeys) {
            const x = k.xSlot * kw;
            const activeGroup = activeKeys.get(k.midi);
            if (activeGroup !== undefined) {
                ctx.fillStyle = palette[activeGroup % palette.length];
                ctx.fillRect(x, 0, bw, bh);
                ctx.strokeStyle = light ? '#1a1d1c' : '#f7f5ea';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, 0.5, bw - 1, bh - 1);
            } else {
                ctx.fillStyle = light ? '#262b2a' : '#141a1c';
                ctx.fillRect(x, 0, bw, bh);
                if (usedPitches.has(k.midi)) {
                    ctx.fillStyle = light ? 'rgba(233,206,128,.45)' : 'rgba(233,206,128,.35)';
                    ctx.fillRect(x + 1, bh - 3, bw - 2, 2.5);
                }
            }
        }
    }

    function drawWheel(trail, fifths, light, palette) {
        const w = wheelCanvas.clientWidth, h = wheelCanvas.clientHeight;
        if (!w || !h) return;
        const d = devicePixelRatio || 1;
        const pw = Math.round(w * d), ph = Math.round(h * d);
        if (wheelCanvas.width !== pw || wheelCanvas.height !== ph) { wheelCanvas.width = pw; wheelCanvas.height = ph; }
        const ctx = wheelCanvas.getContext('2d');
        ctx.setTransform(d, 0, 0, d, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2, cy = h / 2;
        const radius = Math.min(w, h) / 2 - 22;
        const flat = fifths !== null && fifths < 0;
        const labels = flat ? FLAT_NAMES : SHARP_NAMES;

        // Base ring
        ctx.strokeStyle = light ? 'rgba(46,44,28,.16)' : 'rgba(239,237,224,.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Diatonic 7-note arc for the current key signature (7 consecutive fifths).
        const diatonic = new Set();
        if (fifths !== null && fifths >= -7 && fifths <= 7) {
            const startIdx = ((fifths - 1) % 12 + 12) % 12;
            for (let k = 0; k < 7; k++) diatonic.add(FIFTHS_PCS[(startIdx + k) % 12]);
            const a0 = (startIdx / 12) * Math.PI * 2 - Math.PI / 2 - Math.PI / 18;
            const a1 = a0 + (6 / 12) * Math.PI * 2 + Math.PI / 9;
            ctx.strokeStyle = light ? 'rgba(131,107,38,.28)' : 'rgba(233,206,128,.24)';
            ctx.lineWidth = 18;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, a0, a1);
            ctx.stroke();
        }

        const coords = FIFTHS_PCS.map((pc, idx) => {
            const angle = (idx / 12) * Math.PI * 2 - Math.PI / 2;
            return { pc, idx, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
        });

        // Connect currently sounding pitch classes into a harmonic polygon.
        const activeNodes = coords.filter(c => trail.get(c.pc)?.active);
        if (activeNodes.length >= 2) {
            ctx.beginPath();
            activeNodes.forEach((n, i) => i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y));
            if (activeNodes.length >= 3) ctx.closePath();
            ctx.fillStyle = light ? 'rgba(131,107,38,.16)' : 'rgba(233,206,128,.16)';
            if (activeNodes.length >= 3) ctx.fill();
            ctx.strokeStyle = light ? 'rgba(131,107,38,.65)' : 'rgba(233,206,128,.65)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Nodes
        ctx.font = '600 11px "Instrument Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const node of coords) {
            const hit = trail.get(node.pc);
            const inKey = diatonic.size === 0 || diatonic.has(node.pc);
            if (hit) {
                const col = palette[hit.group % palette.length];
                ctx.globalAlpha = hit.active ? 1 : hit.weight * 0.65;
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(node.x, node.y, hit.active ? 12 : 9, 0, Math.PI * 2);
                ctx.fill();
                // Chromatic (outside key) ring callout
                if (hit.active && diatonic.size && !inKey) {
                    ctx.strokeStyle = light ? '#9a2d2d' : '#f29b9b';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                ctx.fillStyle = light ? '#fff' : '#0b1012';
                ctx.fillText(labels[node.pc], node.x, node.y + 0.5);
            } else {
                ctx.fillStyle = light ? '#ecf0f2' : '#0b1012';
                ctx.beginPath();
                ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = inKey
                    ? (light ? '#2e2c1c' : '#d8d6c8')
                    : (light ? 'rgba(76,85,78,.42)' : 'rgba(180,190,182,.35)');
                ctx.fillText(labels[node.pc], node.x, node.y + 0.5);
            }
        }
    }

    let lastT = 0, lastEnabled = null;
    function draw(t, enabled) {
        lastT = t;
        lastEnabled = enabled;
        if (panel.hidden) return;
        const light = document.documentElement.dataset.theme === 'light';
        const palette = light ? lightColors : colors;
        const fifths = currentFifths(t);
        const flat = fifths !== null && fifths < 0;
        const { activeKeys, trail } = gather(t, enabled);

        drawKeyboard(activeKeys, light, palette);
        drawWheel(trail, fifths, light, palette);
        if (enabled && voiceLegendItems.length) {
            voiceLegendItems.forEach((el, i) => el.classList.toggle('muted', !enabled[i]));
        }

        const activeMidis = [...activeKeys.keys()].sort((a, b) => a - b);
        const chord = detectChord(activeMidis, flat);
        const noteList = activeMidis.slice(0, 8).map(m => pitchName(m, flat)).join(' · ');
        chordOut.textContent = chord
            ? chord + (noteList ? ' — ' + noteList : '')
            : (noteList || 'No notes sounding');

        if (fifths !== null && KEY_LABELS[String(fifths)]) {
            const diatonic = new Set();
            const startIdx = ((fifths - 1) % 12 + 12) % 12;
            for (let k = 0; k < 7; k++) diatonic.add(FIFTHS_PCS[(startIdx + k) % 12]);
            const chromatic = activeMidis.some(m => !diatonic.has(m % 12));
            keyOut.textContent = KEY_LABELS[String(fifths)] + (chromatic ? ' · chromatic' : '');
        } else {
            keyOut.textContent = 'Circle of fifths';
        }
    }

    toggle.addEventListener('click', () => {
        const opening = panel.hidden;
        panel.hidden = !opening;
        toggle.setAttribute('aria-pressed', String(opening));
        if (opening) {
            if (lastEnabled) draw(lastT, lastEnabled);
            onToggle?.();
        }
    });

    new ResizeObserver(() => {
        if (!panel.hidden && lastEnabled) draw(lastT, lastEnabled);
    }).observe(panel);

    return { draw, isOpen: () => !panel.hidden };
}
