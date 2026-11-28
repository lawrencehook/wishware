// Builds the small per-composer files that composer.html reads, so a composer page
// does not have to load every full score just to draw its catalog.
// Usage: node music/build.js      Output: music/composers/<id>.js
const fs = require('fs');
const path = require('path');
const HERE = __dirname;

// The opening of a score, reduced to what a portrait draws:
// {span, parts: [[colorIndex, [time, length, ...pitches], ...], ...]}
function portrait(parts, colors, start, span) {
    return {
        span,
        parts: parts
            .map((part, i) => [
                colors[i],
                ...part
                    .filter(([tick]) => tick >= start && tick < start + span)
                    .map(([tick, ...rest]) => [tick - start, ...rest]),
            ])
            .filter((part) => part.length > 1),
    };
}

// Catalog pieces: pieces/<folder>/notes.js holds {movements: [{name, notes: [[seconds, pitch, length, hand], ...]}]}.
const PIECES = path.join(HERE, 'pieces');
const pieces = new Map();
function movement(folder, index) {
    if (!pieces.has(folder)) {
        const source = fs.readFileSync(path.join(PIECES, folder, 'notes.js'), 'utf8');
        pieces.set(folder, new Function(source + '\nreturn score;')().movements);
    }
    const found = pieces.get(folder)[index];
    if (!found) throw new Error(folder + ' has no movement ' + index);
    return found.notes;
}
function clock(notes) {
    let maxEnd = 0;
    for (const [time, , length] of notes) {
        const end = time + length;
        if (end > maxEnd) maxEnd = end;
    }
    const seconds = Math.round(maxEnd);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

// Score metrics for the Sound Map (atlas.html): duration, note density, pitch range,
// mean pitch, and chromaticism (% of notes outside the best-fitting 7-note diatonic scale).
const DIATONIC_MASKS = Array.from({ length: 12 }, (_, root) => {
    let mask = 0;
    for (const step of [0, 2, 4, 5, 7, 9, 11]) mask |= 1 << ((root + step) % 12);
    return mask;
});
function pieceStats(notes) {
    let maxEnd = 0, minP = 127, maxP = 0, sumP = 0;
    const hist = new Array(12).fill(0);
    for (const [time, pitch, length] of notes) {
        const end = time + length;
        if (end > maxEnd) maxEnd = end;
        if (pitch < minP) minP = pitch;
        if (pitch > maxP) maxP = pitch;
        sumP += pitch;
        hist[pitch % 12]++;
    }
    const count = notes.length;
    const dur = Math.max(1, maxEnd);
    let bestInKey = 0;
    for (const mask of DIATONIC_MASKS) {
        let inKey = 0;
        for (let pc = 0; pc < 12; pc++) if (mask & (1 << pc)) inKey += hist[pc];
        if (inKey > bestInKey) bestInKey = inKey;
    }
    return {
        dur: Math.round(dur),
        density: Math.round((count / dur) * 100) / 100,
        span: maxP - minP,
        meanPitch: Math.round((sumP / Math.max(1, count)) * 10) / 10,
        chromaticism: Math.round(((count - bestInKey) / Math.max(1, count)) * 1000) / 10,
    };
}

function composerEra(birth) {
    if (birth < 1720) return 'Baroque';
    if (birth < 1795) return 'Classical';
    if (birth < 1855) return 'Romantic';
    return 'Late Romantic & Modern';
}
// Tempos vary too much for a fixed number of seconds, so the window is the first `onsets` attacks.
function piecePortrait(notes, onsets) {
    const times = [...new Set(notes.map(([time]) => time))].sort((a, b) => a - b);
    const start = times[0];
    const last = times[Math.min(onsets, times.length) - 1];
    const span = Math.max(4, (last - start) * 1.02);
    const hands = [...new Set(notes.map((note) => note[3]))].sort((a, b) => a - b);
    const parts = hands.map((hand) => {
        const chords = new Map();
        for (const [time, pitch, length, group] of notes) {
            if (group !== hand || time < start || time >= start + span) continue;
            const at = Math.round((time - start) * 100) / 100;
            const chord = chords.get(at) ?? [at, 0];
            chord[1] = Math.max(chord[1], Math.round(length * 100) / 100);
            chord.push(pitch);
            chords.set(at, chord);
        }
        return [...chords.values()].sort((a, b) => a[0] - b[0]);
    });
    return portrait(parts, hands.map((_, i) => i), 0, Math.round(span * 100) / 100);
}

// A few sentences about a piece, where catalog/briefs.js has them.
const BRIEFS = require('./catalog/briefs.js');
for (const folder of Object.keys(BRIEFS)) if (!fs.existsSync(path.join(PIECES, folder))) throw new Error('briefs.js: no piece ' + folder);
const brief = (folder, index) => (typeof BRIEFS[folder] === 'string' ? BRIEFS[folder] : BRIEFS[folder]?.[index] ?? BRIEFS[folder]?.all);

// Composition years, where catalog/years.js has them.
const YEARS = require('./catalog/years.js');
for (const folder of Object.keys(YEARS)) if (!fs.existsSync(path.join(PIECES, folder))) throw new Error('years.js: no piece ' + folder);
const composedYear = (folder, index) => {
    const entry = YEARS[folder];
    if (typeof entry === 'number') return entry;
    if (entry && typeof entry === 'object') return entry[index] ?? entry.all ?? null;
    return null;
};

const composers = {};
for (const [id, entry] of Object.entries(require('./catalog.js'))) {
    // piece.html looks its own heading up by this link, so keep the parameter order.
    const link = (folder, index) => 'piece.html?c=' + id + '&p=' + folder + '&m=' + index;
    // One source entry serves the whole folder unless there is a list with one per movement.
    const pick = (value, index) => (Array.isArray(value[0]) || value[0] === null ? value[index] : value);
    const credits = (source, index) => {
        const [credit, licence, edition] = pick(source.score, index);
        // A recording is optional; the piece page leaves the section out without one.
        // `start` is where this piece begins, in seconds, in a video that holds a whole set.
        const [video, performer, holds, start] = (source.recording && pick(source.recording, index)) ?? [];
        return {
            score: { text: 'Score · ' + credit + (licence ? ' · ' + licence : ''), href: edition },
            ...(video && { recording: { video, start, text: performer + (holds ? ' · ' + holds : '') } }),
        };
    };
    // What a piece page needs to know about the piece a catalog entry leads to.
    const work = (folder, index, heading, sub, onsets) => {
        const notes = movement(folder, index);
        return { notes, time: clock(notes), href: link(folder, index), heading, sub, brief: brief(folder, index), ...credits(entry.sources[folder], index), portrait: piecePortrait(notes, onsets) };
    };
    composers[id] = () => ({
        name: entry.name,
        years: entry.years,
        about: entry.about,
        wikipedia: entry.wikipedia,
        featured: [
            ...entry.featured.map(([folder, index, eyebrow, title, number]) => {
                const notes = movement(folder, index);
                return {
                    eyebrow,
                    title,
                    meta: number + ' · ' + clock(notes),
                    href: link(folder, index),
                    portrait: piecePortrait(notes, 56),
                };
            }),
        ],
        sections: entry.sections.map((section) => {
            const count = section.count ?? section.rows.length + ' works';
            // `pairs` names the two movements that each row of the section holds, as in a book of preludes and fugues.
            if (section.pairs) {
                return {
                    title: section.title,
                    count,
                    pairs: section.rows.map(([title, meta], i) => ({
                        title: i + 1 + '. ' + title,
                        meta,
                        links: section.pairs.map((label, k) => {
                            const { notes, time, ...rest } = work(section.from, 2 * i + k, label + ' in ' + title, section.title + ' · ' + meta, 48);
                            // Written voices that share a staff line count once.
                            const groups = pieces.get(section.from)[2 * i + k].voices?.groups;
                            const voices = new Set(notes.map((note) => (groups ? groups[note[3]] : note[3]))).size;
                            return { label, detail: (k ? voices + ' voices · ' : '') + time, aria: label + ' in ' + title + ', ' + meta, ...rest };
                        }),
                    })),
                };
            }
            let next = 0;
            return {
                title: section.title,
                count,
                works: section.rows.map((row) => {
                    // A row that opens with [folder, index] comes from there; the rest of a `from` section follows that folder's movements in order.
                    const own = Array.isArray(row[0]);
                    const [folder, index, title, meta, number] = own ? [...row[0], ...row.slice(1)] : section.from ? [section.from, next++, ...row] : [row[0], 0, row[1], row[2]];
                    const { notes, ...rest } = work(folder, index, section.piece ? section.piece + ' in ' + title : title, (section.from || own ? section.title + ' · ' : '') + meta, 48);
                    return { number, title, meta, label: section.title + ': ' + title + ', ' + meta, ...rest };
                }),
            };
        }),
        credits: entry.credits ?? [{ text: 'Editions, recordings and instrument samples are credited on each piece’s page' }],
    });
}

fs.mkdirSync(path.join(HERE, 'composers'), { recursive: true });
const directory = [];
const builtComposers = new Map();
for (const [id, build] of Object.entries(composers)) {
    const composer = build();
    builtComposers.set(id, composer);
    const file = path.join(HERE, 'composers', id + '.js');
    fs.writeFileSync(
        file,
        '// Generated by music/build.js. Do not edit.\n(window.COMPOSERS ??= {})[' +
            JSON.stringify(id) +
            '] = ' +
            JSON.stringify(composer) +
            ';\n'
    );
    const works = composer.sections.reduce((sum, section) => sum + (section.works?.length ?? 2 * section.pairs.length), 0);
    directory.push({ id, name: composer.name, years: composer.years, works, portrait: composer.featured[0].portrait });
    console.log(path.relative(process.cwd(), file), Math.round(fs.statSync(file).size / 1024) + ' KB', works + ' works');
}
// The directory page lists every composer, oldest first, with the opening of their first selected work.
directory.sort((a, b) => parseInt(a.years) - parseInt(b.years));
fs.writeFileSync(
    path.join(HERE, 'composers', 'index.js'),
    '// Generated by music/build.js. Do not edit.\nconst COMPOSER_INDEX = ' + JSON.stringify(directory) + ';\n'
);

// Timeline & 758-piece Sound Map dataset (music/atlas.html).
const NOTATION = path.join(HERE, 'notation');
const atlasComposers = directory.map((d) => {
    const [birth, death] = d.years.split(/[–-]/).map(Number);
    const parts = d.name.split(' ');
    return { id: d.id, name: d.name, short: parts[parts.length - 1], birth, death, era: composerEra(birth), works: d.works };
});
const atlasPieces = [];
const atlasPreviews = [];
let datedCount = 0;
atlasComposers.forEach((comp, ci) => {
    const data = builtComposers.get(comp.id);
    const items = data.sections.flatMap((s) => s.works ?? s.pairs.flatMap((p) => p.links));
    for (const item of items) {
        const params = new URLSearchParams(item.href.split('?')[1]);
        const folder = params.get('p');
        const m = Number(params.get('m'));
        const notes = movement(folder, m);
        const st = pieceStats(notes);
        const hasSheet = fs.existsSync(path.join(NOTATION, folder, m + '.js')) ? 1 : 0;
        const year = composedYear(folder, m);
        if (year !== null) {
            if (year < comp.birth || year > comp.death) {
                throw new Error(`years.js: ${folder} #${m} year ${year} outside ${comp.name} (${comp.birth}-${comp.death})`);
            }
            datedCount++;
        }
        // [composerIndex, heading, sub, folder, movementIndex, durSec, density, span, meanPitch, chromaticism, hasSheet, year]
        atlasPieces.push([ci, item.heading, item.sub, folder, m, st.dur, st.density, st.span, st.meanPitch, st.chromaticism, hasSheet, year]);
        // Short 4-second audio preview snippet (first <=48 notes from initial onset) for offline-safe auditioning.
        const t0 = notes.length ? notes.reduce((min, n) => (n[0] < min ? n[0] : min), notes[0][0]) : 0;
        const snippet = [];
        for (const [time, pitch, length] of notes) {
            const rel = time - t0;
            if (rel < 0 || rel >= 4) continue;
            snippet.push([
                Math.round(rel * 100) / 100,
                pitch,
                Math.round(Math.min(2.2, Math.max(0.08, length)) * 100) / 100,
            ]);
            if (snippet.length >= 48) break;
        }
        snippet.sort((a, b) => a[0] - b[0]);
        atlasPreviews.push(snippet);
    }
});
fs.writeFileSync(
    path.join(HERE, 'composers', 'atlas.js'),
    '// Generated by music/build.js. Do not edit.\nconst MUSIC_ATLAS = ' +
        JSON.stringify({ composers: atlasComposers, pieces: atlasPieces }) +
        ';\n'
);
fs.writeFileSync(
    path.join(HERE, 'composers', 'previews.js'),
    '// Generated by music/build.js. Do not edit.\nconst MUSIC_PREVIEWS = ' +
        JSON.stringify(atlasPreviews) +
        ';\n'
);
console.log(path.relative(process.cwd(), path.join(HERE, 'composers', 'atlas.js')), Math.round(fs.statSync(path.join(HERE, 'composers', 'atlas.js')).size / 1024) + ' KB', atlasPieces.length + ' pieces (' + datedCount + ' dated)');
console.log(path.relative(process.cwd(), path.join(HERE, 'composers', 'previews.js')), Math.round(fs.statSync(path.join(HERE, 'composers', 'previews.js')).size / 1024) + ' KB', atlasPreviews.length + ' previews');
