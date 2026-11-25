// Hand-edited catalogs for composers whose pieces live in pieces/<folder>/.
// build.js adds durations, links and portraits from each piece's notes.js.
//
// about: three to five sentences on the composer; wikipedia: their article
// featured: [folder, movement index, eyebrow, title, catalog number]
// section with `from`: one row per listed movement, in order: [title, detail, number?]
//   (number defaults to the row's position; use it when a set has gaps)
//   `piece` names one row on its own page: 'Ballade' + 'G minor' → “Ballade in G minor”
// section without `from`: [folder, title, detail], each the first movement of its folder
//
// sources: folder → {score, recording}; each is one entry for every movement in the folder, or
//   a list with an entry per movement.
//   score: [credit, licence, link to the edition, PDF of the engraved edition if there is one]
//          (engrave.py cuts the sheet music from that PDF)
//   recording: [YouTube id, performer, what the video holds when it is more than this piece]
const mutopia = (path, typesetter, licence) => [
    'Mutopia · ' + typesetter,
    licence,
    'https://github.com/MutopiaProject/MutopiaProject/tree/master/ftp/ChopinFF/' + path,
    'https://www.mutopiaproject.org/ftp/ChopinFF/' + path + '/' + path.split('/').pop() + '-a4.pdf',
];
const asap = (path) => [
    'ASAP dataset · Foscarin et al.',
    'CC BY-NC-SA 4.0',
    'https://github.com/fosfrancesco/asap-dataset/tree/master/Chopin/' + path,
];
const preludeTypesetter = (number) =>
    number === 1 ? ['Donald Axel', 'CC BY-SA 4.0']
    : number === 2 ? ['Donald Axel', 'CC BY-SA 3.0']
    : [4, 6, 7, 15, 20].includes(number) ? ['Magnus Lewis-Smith', 'Public Domain']
    : ['Knute Snortum', 'CC BY-SA 4.0'];

module.exports = {
    chopin: {
        name: 'Frédéric Chopin',
        about:
            'Frédéric Chopin (1810–1849) was a Polish composer and pianist of the Romantic era who wrote almost entirely for solo piano. ' +
            'Born near Warsaw, he left Poland in 1830 and settled in Paris, where he made his living by teaching, publishing and playing in salons more than in concert halls. ' +
            'His works include nocturnes, études, preludes and ballades, and the mazurkas and polonaises that draw on Polish dance. ' +
            'He died in Paris at 39, most likely of tuberculosis.',
        wikipedia: 'https://en.wikipedia.org/wiki/Fr%C3%A9d%C3%A9ric_Chopin',
        sources: {
            'chopin-four-ballades': {
                score: asap('Ballades'),
                recording: ['cV_xvsH_EDk', 'Krystian Zimerman', 'the four Ballades'],
            },
            'chopin-scherzos-nos-13': {
                score: asap('Scherzos'),
                recording: ['ET6JYiM8bh8', 'Arthur Rubinstein', 'the four Scherzos'],
            },
            'chopin-piano-sonata-no-2-op-35': {
                score: asap('Sonata_2'),
                recording: ['zc9n2SOdksE', 'Seong-Jin Cho', 'the complete sonata'],
            },
            'chopin-three-nocturnes-op-9': {
                score: [
                    mutopia('O9/nocturne_in_b-flat_minor', 'Benjamin D. Esham', 'CC BY-SA 2.5'),
                    mutopia('O9/chopin_nocturne_op9_n2', 'Renato Biolcati Rinaldi', 'CC BY-SA 3.0'),
                    mutopia('O9/chopin_nocturne_op9_n3', 'Glen Larsen', 'CC BY-SA 4.0'),
                ],
                recording: [
                    ['EKlonPJnypI', 'Claudio Arrau'],
                    ['-PaYq5Pt228', 'Vadim Chaimovich'],
                    ['t4zcHuq6WH8', 'Claudio Arrau'],
                ],
            },
            'chopin-etudes-op-10-selections': {
                score: asap('Etudes_op_10'),
                recording: [1, 2, 3, 4, 5, 7, 8, 10, 12].map((number) =>
                    number === 12
                        ? ['7VWHBHeNrg4', 'Evgeny Kissin']
                        : ['81ldf-l3-Bg', 'Louis Lortie', 'the twelve Études, Op. 10'],
                ),
            },
            'chopin-etudes-op-25-selections': {
                score: asap('Etudes_op_25'),
                recording: [1, 2, 4, 5, 8, 10, 11, 12].map((number) =>
                    number === 1
                        ? ['lccVbc05AYA', 'Daniel Barenboim']
                        : ['mUxUBf90PRU', 'Louis Lortie', 'the twelve Études, Op. 25'],
                ),
            },
            'chopin-24-preludes-op-28': {
                score: Array.from({ length: 24 }, (_, i) =>
                    mutopia('O28/Chop-28-' + (i + 1), ...preludeTypesetter(i + 1)),
                ),
                recording: ['QWFR9joxbpc', 'Seong-Jin Cho', 'the 24 Preludes'],
            },
            'chopin-mazurkas': {
                score: ['DCML Chopin mazurkas', 'CC BY-NC-SA 4.0', 'https://github.com/DCMLab/chopin_mazurkas'],
                recording: ['xW-Vb615l7Q', 'Eric Lu'],
            },
            'chopin-heroic-polonaise-op-53': {
                score: asap('Polonaises/53'),
                recording: ['j5ScGtmvSgY', 'Arthur Rubinstein'],
            },
            'chopin-berceuse-op-57': {
                score: asap('Berceuse_op_57'),
                recording: ['FZtBwlxL0Aw', 'Valentina Lisitsa'],
            },
            'chopin-barcarolle-op-60': {
                score: asap('Barcarolle'),
                recording: ['2cv7diE0ZMc', 'Krystian Zimerman'],
            },
            'chopin-minute-waltz-op-64-no-1': {
                score: mutopia('O64/chopin_valse_op64_no1', 'Magnus Lewis-Smith', 'Public Domain'),
                recording: ['OoX6ZTUd3Vo', 'Arthur Rubinstein'],
            },
            'chopin-fantaisie-impromptu-op-66': {
                score: mutopia('O66/chopin_fantaisie-impromptu', 'Guy D. Lederfein', 'Public Domain'),
                recording: ['75x6DncZDgI', 'Arthur Rubinstein'],
            },
        },
        featured: [
            ['chopin-three-nocturnes-op-9', 1, 'Nocturnes, Op. 9 · E-flat major', 'Nocturne in E-flat major', 'Op. 9 No. 2'],
            ['chopin-fantaisie-impromptu-op-66', 0, 'Impromptu · C-sharp minor', 'Fantaisie-Impromptu', 'Op. 66'],
            ['chopin-minute-waltz-op-64-no-1', 0, 'Waltz · D-flat major', '“Minute” Waltz', 'Op. 64 No. 1'],
            ['chopin-etudes-op-10-selections', 8, 'Études, Op. 10 · C minor', '“Revolutionary” Étude', 'Op. 10 No. 12'],
            ['chopin-24-preludes-op-28', 14, '24 Preludes, Op. 28 · D-flat major', '“Raindrop” Prelude', 'Op. 28 No. 15'],
            ['chopin-four-ballades', 0, 'Ballades · G minor', 'Ballade No. 1', 'Op. 23'],
        ],
        sections: [
            {
                title: 'Ballades',
                piece: 'Ballade',
                from: 'chopin-four-ballades',
                rows: [['G minor', 'Op. 23'], ['F major', 'Op. 38'], ['A-flat major', 'Op. 47'], ['F minor', 'Op. 52']],
            },
            {
                title: 'Scherzos',
                piece: 'Scherzo',
                count: '3 of 4',
                from: 'chopin-scherzos-nos-13',
                rows: [['B minor', 'Op. 20'], ['B-flat minor', 'Op. 31'], ['C-sharp minor', 'Op. 39']],
            },
            {
                title: 'Piano Sonata No. 2 in B-flat minor, Op. 35',
                count: '4 movements',
                from: 'chopin-piano-sonata-no-2-op-35',
                rows: [
                    ['Grave – Doppio movimento', 'First movement'],
                    ['Scherzo', 'Second movement'],
                    ['Marche funèbre', 'Third movement · Lento'],
                    ['Finale', 'Fourth movement · Presto'],
                ],
            },
            {
                title: 'Nocturnes, Op. 9',
                piece: 'Nocturne',
                from: 'chopin-three-nocturnes-op-9',
                rows: [['B-flat minor', 'Op. 9 No. 1'], ['E-flat major', 'Op. 9 No. 2'], ['B major', 'Op. 9 No. 3']],
            },
            {
                title: 'Études, Op. 10',
                piece: 'Étude',
                count: '9 of 12',
                from: 'chopin-etudes-op-10-selections',
                rows: [
                    ['C major', 'Op. 10 No. 1', 1],
                    ['A minor', 'Op. 10 No. 2', 2],
                    ['E major', 'Op. 10 No. 3 · “Tristesse”', 3],
                    ['C-sharp minor', 'Op. 10 No. 4', 4],
                    ['G-flat major', 'Op. 10 No. 5 · “Black Key”', 5],
                    ['C major', 'Op. 10 No. 7', 7],
                    ['F major', 'Op. 10 No. 8', 8],
                    ['A-flat major', 'Op. 10 No. 10', 10],
                    ['C minor', 'Op. 10 No. 12 · “Revolutionary”', 12],
                ],
            },
            {
                title: 'Études, Op. 25',
                piece: 'Étude',
                count: '8 of 12',
                from: 'chopin-etudes-op-25-selections',
                rows: [
                    ['A-flat major', 'Op. 25 No. 1 · “Aeolian Harp”', 1],
                    ['F minor', 'Op. 25 No. 2', 2],
                    ['A minor', 'Op. 25 No. 4', 4],
                    ['E minor', 'Op. 25 No. 5', 5],
                    ['D-flat major', 'Op. 25 No. 8', 8],
                    ['B minor', 'Op. 25 No. 10', 10],
                    ['A minor', 'Op. 25 No. 11 · “Winter Wind”', 11],
                    ['C minor', 'Op. 25 No. 12 · “Ocean”', 12],
                ],
            },
            {
                title: '24 Preludes, Op. 28',
                piece: 'Prelude',
                from: 'chopin-24-preludes-op-28',
                rows: [
                    'C major', 'A minor', 'G major', 'E minor', 'D major', 'B minor', 'A major', 'F-sharp minor',
                    'E major', 'C-sharp minor', 'B major', 'G-sharp minor', 'F-sharp major', 'E-flat minor',
                    'D-flat major', 'B-flat minor', 'A-flat major', 'F minor', 'E-flat major', 'C minor',
                    'B-flat major', 'G minor', 'F major', 'D minor',
                ].map((key, i) => [key, 'Op. 28 No. ' + (i + 1) + (i === 14 ? ' · “Raindrop”' : '')]),
            },
            {
                title: 'Other works',
                rows: [
                    ['chopin-mazurkas', 'Mazurka in A minor', 'Op. 17 No. 4'],
                    ['chopin-heroic-polonaise-op-53', '“Heroic” Polonaise', 'Op. 53 · A-flat major'],
                    ['chopin-berceuse-op-57', 'Berceuse', 'Op. 57 · D-flat major'],
                    ['chopin-barcarolle-op-60', 'Barcarolle', 'Op. 60 · F-sharp major'],
                    ['chopin-minute-waltz-op-64-no-1', '“Minute” Waltz', 'Op. 64 No. 1 · D-flat major'],
                    ['chopin-fantaisie-impromptu-op-66', 'Fantaisie-Impromptu', 'Op. 66 · C-sharp minor'],
                ],
            },
        ],
    },
};
