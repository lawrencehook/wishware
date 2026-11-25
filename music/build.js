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

const composers = {
    bach() {
        const files = ['scores', 'sinfonias', 'preludes', 'organ-work', 'air-work', 'brandenburg', 'wtc1', 'library'];
        const source = files.map((name) => fs.readFileSync(path.join(HERE, 'bach-data', name + '.js'), 'utf8')).join('\n');
        const data = new Function(
            source + '\nreturn {library, clavierPairs, INVENTIONS, SINFONIAS, FUGUE, voiceGroups, durationText, playerLink};'
        )();
        const { library, clavierPairs, INVENTIONS, SINFONIAS, FUGUE, voiceGroups, durationText, playerLink } = data;
        const draw = (piece, featured) =>
            portrait(piece.score, voiceGroups(piece), featured && piece === FUGUE ? 60 : 0, featured ? 62 : 52);
        const featured = [
            [1050, 'I. Allegro · D major', 'Brandenburg Concerto No. 5'],
            [565, 'Organ · D minor', 'Toccata and Fugue'],
            [1068, 'Orchestral Suite No. 3 · D major', 'Air'],
            [1007, 'Cello Suite No. 1 · G major', 'Prelude for solo cello'],
            [846, 'The Well-Tempered Clavier · Book I', 'Prelude in C major'],
            [851, 'The Well-Tempered Clavier · Book I', 'Fugue in D minor'],
        ].map(([bwv, eyebrow, title]) => {
            const piece = library.find((work) => work.bwv === bwv);
            return {
                eyebrow,
                title,
                meta: 'BWV ' + bwv + ' · ' + durationText(piece),
                href: playerLink(piece),
                portrait: draw(piece, true),
            };
        });
        const works = (pieces) =>
            pieces.map((piece) => ({
                title: piece.key,
                meta: 'BWV ' + piece.bwv,
                time: durationText(piece),
                href: playerLink(piece),
                label: piece.title + ' in ' + piece.key + ', BWV ' + piece.bwv,
                portrait: draw(piece),
            }));
        const pairs = clavierPairs.map((pair, index) => ({
            title: index + 1 + '. ' + pair[0].key,
            meta: 'BWV ' + pair[0].bwv,
            links: pair.map((piece, i) => {
                const label = i ? 'Fugue' : 'Prelude';
                return {
                    label,
                    detail: (i ? new Set(voiceGroups(piece)).size + ' voices · ' : '') + durationText(piece),
                    href: playerLink(piece),
                    aria: label + ' in ' + piece.key + ', BWV ' + piece.bwv,
                    portrait: draw(piece),
                };
            }),
        }));
        return {
            name: 'Johann Sebastian Bach',
            years: '1685–1750',
            about:
                'Johann Sebastian Bach (1685–1750) was a German composer and organist of the late Baroque. ' +
                'He worked as a church and court musician in Weimar and Köthen, and spent his last 27 years as cantor of St Thomas’s in Leipzig. ' +
                'His music includes the Brandenburg Concertos, The Well-Tempered Clavier, the Goldberg Variations, the St Matthew Passion and the Mass in B minor, along with some 200 surviving cantatas. ' +
                'In his lifetime he was known chiefly as an organist; a nineteenth-century revival, marked by Mendelssohn’s 1829 performance of the St Matthew Passion, made his reputation as a composer.',
            wikipedia: 'https://en.wikipedia.org/wiki/Johann_Sebastian_Bach',
            featured,
            sections: [
                { title: 'Two-Part Inventions', count: INVENTIONS.length + ' works', works: works(INVENTIONS) },
                { title: 'Three-Part Sinfonias', count: SINFONIAS.length + ' works', works: works(SINFONIAS) },
                { title: 'The Well-Tempered Clavier, Book I', count: '24 pairs', pairs },
            ],
            credits: [
                { text: 'Bach scores from Mutopia, Project Gutenberg, and Knute Snortum' },
                { text: 'Piano recordings by Alexander Holm', href: 'bach-data/piano-credits.txt' },
                { text: 'Organ and string recordings', href: 'bach-data/ensemble-credits.txt' },
                { text: 'Concerto recordings', href: 'bach-data/concerto-credits.txt' },
            ],
        };
    },
};

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
    composers[id] = () => ({
        name: entry.name,
        years: entry.years,
        about: entry.about,
        wikipedia: entry.wikipedia,
        featured: entry.featured.map(([folder, index, eyebrow, title, number]) => {
            const notes = movement(folder, index);
            return {
                eyebrow,
                title,
                meta: number + ' · ' + clock(notes),
                href: link(folder, index),
                portrait: piecePortrait(notes, 56),
            };
        }),
        sections: entry.sections.map((section) => ({
            title: section.title,
            count: section.count ?? section.rows.length + ' works',
            works: section.rows.map((row, i) => {
                const [folder, index, title, meta, number] = section.from ? [section.from, i, ...row] : [row[0], 0, row[1], row[2]];
                const notes = movement(folder, index);
                return {
                    number,
                    title,
                    meta,
                    time: clock(notes),
                    href: link(folder, index),
                    label: section.title + ': ' + title + ', ' + meta,
                    heading: section.piece ? section.piece + ' in ' + title : title,
                    sub: (section.from ? section.title + ' · ' : '') + meta,
                    ...credits(entry.sources[folder], index),
                    portrait: piecePortrait(notes, 48),
                };
            }),
        })),
        credits: [{ text: 'Editions, recordings and instrument samples are credited on each piece’s page' }],
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
// The directory page lists every composer with the opening of their first selected work.
fs.writeFileSync(
    path.join(HERE, 'composers', 'index.js'),
    '// Generated by music/build.js. Do not edit.\nconst COMPOSER_INDEX = ' + JSON.stringify(directory) + ';\n'
);
