// See ../catalog.js for the format.
module.exports = {
    name: 'Robert Schumann',
    years: '1810–1856',
    about:
        'Robert Schumann (1810–1856) was a German composer and one of the leading music critics of the Romantic era. ' +
        'A hand injury ended his hopes of a career as a pianist, and for his first ten years as a composer he wrote almost only for the piano: Carnaval, Kinderszenen, Kreisleriana and the Fantasie in C. ' +
        'In 1840 he married the pianist Clara Wieck, who gave the first performances of much of his music, and turned to song, then to symphonies and chamber music. ' +
        'He suffered from mental illness and spent his last two years in an asylum near Bonn.',
    wikipedia: 'https://en.wikipedia.org/wiki/Robert_Schumann',
    sources: require('./sources/schumann.json'),
    featured: [
        ['schumann-kinderszenen', 6, 'Kinderszenen · F major', 'Träumerei', 'Op. 15 No. 7'],
        ['schumann-kinderszenen', 0, 'Kinderszenen · G major', 'Von fremden Ländern und Menschen', 'Op. 15 No. 1'],
        ['schumann-arabeske-op-18', 0, 'Arabeske · C major', 'Arabeske', 'Op. 18'],
        ['robert-schumann-fantasiestucke-op-12', 0, 'Fantasiestücke · F minor', 'Aufschwung', 'Op. 12 No. 2'],
        ['robert-schumann-album-fur-die-jugend-op-68', 0, 'Album für die Jugend · C major', 'Melodie', 'Op. 68 No. 1'],
        ['schumann-kreisleriana-selections', 0, 'Kreisleriana · D minor', 'Kreisleriana No. 1', 'Op. 16 No. 1'],
    ],
    sections: [
        {
            title: 'Kinderszenen, Op. 15',
            count: '13 pieces',
            from: 'schumann-kinderszenen',
            rows: [
                'Von fremden Ländern und Menschen', 'Kuriose Geschichte', 'Hasche-Mann', 'Bittendes Kind', 'Glückes genug',
                'Wichtige Begebenheit', 'Träumerei', 'Am Kamin', 'Ritter vom Steckenpferd', 'Fast zu ernst',
                'Fürchtenmachen', 'Kind im Einschlummern', 'Der Dichter spricht',
            ].map((title, i) => [title, 'Op. 15 No. ' + (i + 1)]),
        },
        {
            title: 'Kreisleriana, Op. 16',
            count: '8 pieces',
            from: 'schumann-kreisleriana-selections',
            rows: [
                ['Äußerst bewegt', 'No. 1 · D minor'],
                ['Sehr innig und nicht zu rasch', 'No. 2 · B-flat major'],
                ['Sehr aufgeregt', 'No. 3 · G minor'],
                ['Sehr langsam', 'No. 4 · B-flat major'],
                ['Sehr lebhaft', 'No. 5 · G minor'],
                ['Sehr langsam', 'No. 6 · B-flat major'],
                ['Sehr rasch', 'No. 7 · C minor'],
                [['schumann-kreisleriana-no-8', 0], 'Schnell und spielend', 'No. 8 · G minor'],
            ],
        },
        {
            title: 'Other works',
            rows: [
                ['schumann-widmung-op-25-no-1', 'Widmung', 'Myrthen, Op. 25 No. 1 · voice and piano'],
                ['schumann-toccata-op-7', 'Toccata', 'Op. 7 · C major'],
                ['robert-schumann-fantasiestucke-op-12', 'Aufschwung', 'Fantasiestücke, Op. 12 No. 2'],
                ['schumann-arabeske-op-18', 'Arabeske', 'Op. 18 · C major'],
                ['schumann-romanze-op-28-no-2', 'Romanze in F-sharp major', 'Three Romances, Op. 28 No. 2'],
                ['robert-schumann-album-fur-die-jugend-op-68', 'Melodie', 'Album für die Jugend, Op. 68 No. 1'],
                ['schumann-abegg-variations-op-1', 'Abegg Variations', 'Op. 1 · F major'],
                ['schumann-the-happy-farmer-op-68-no-10', 'The Happy Farmer', 'Album für die Jugend, Op. 68 No. 10'],
                ['schumann-knecht-ruprecht-op-68-no-12', 'Knecht Ruprecht', 'Album für die Jugend, Op. 68 No. 12'],
            ],
        },
    ],
};
