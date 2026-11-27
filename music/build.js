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
    const seconds = Math.round(Math.max(...notes.map(([time, , length]) => time + length)));
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
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
for (const [id, build] of Object.entries(composers)) {
    const composer = build();
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
