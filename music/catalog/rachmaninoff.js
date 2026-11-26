// See ../catalog.js for the format.
module.exports = {
    name: 'Sergei Rachmaninoff',
    years: '1873–1943',
    about:
        'Sergei Rachmaninoff (1873–1943) was a Russian composer, conductor and one of the great pianists of the twentieth century. ' +
        'He trained at the Moscow Conservatory and was famous by 19 for his Prelude in C-sharp minor. ' +
        'His Second and Third Piano Concertos and the Rhapsody on a Theme of Paganini are among the most performed works for piano and orchestra. ' +
        'He left Russia after the 1917 revolution and spent the rest of his life touring as a pianist, mostly in the United States, where he died.',
    wikipedia: 'https://en.wikipedia.org/wiki/Sergei_Rachmaninoff',
    sources: require('./sources/rachmaninoff.json'),
    featured: [
        ['rachmaninoff-morceaux-de-fantaisie-op-3', 0, 'Morceaux de fantaisie · C-sharp minor', 'Prelude in C-sharp minor', 'Op. 3 No. 2'],
        ['rachmaninoff-preludes-op-23', 4, 'Preludes, Op. 23 · G minor', 'Prelude in G minor', 'Op. 23 No. 5'],
        ['rachmaninoff-preludes-op-32-nos-5-and-10', 0, 'Preludes, Op. 32 · G major', 'Prelude in G major', 'Op. 32 No. 5'],
        ['rachmaninoff-preludes-op-23', 3, 'Preludes, Op. 23 · D major', 'Prelude in D major', 'Op. 23 No. 4'],
    ],
    sections: [
        {
            title: 'Morceaux de fantaisie, Op. 3',
            count: '1 of 5',
            rows: [['rachmaninoff-morceaux-de-fantaisie-op-3', 'Prelude in C-sharp minor', 'Op. 3 No. 2']],
        },
        {
            title: 'Preludes, Op. 23',
            count: '9 of 10',
            piece: 'Prelude',
            from: 'rachmaninoff-preludes-op-23',
            rows: [
                ['F-sharp minor', 'Op. 23 No. 1', 1],
                ['B-flat major', 'Op. 23 No. 2', 2],
                ['D minor', 'Op. 23 No. 3', 3],
                ['D major', 'Op. 23 No. 4', 4],
                ['G minor', 'Op. 23 No. 5', 5],
                ['E-flat major', 'Op. 23 No. 6', 6],
                ['A-flat major', 'Op. 23 No. 8', 8],
                ['E-flat minor', 'Op. 23 No. 9', 9],
                ['G-flat major', 'Op. 23 No. 10', 10],
            ],
        },
        {
            title: 'Preludes, Op. 32',
            count: '2 of 13',
            piece: 'Prelude',
            from: 'rachmaninoff-preludes-op-32-nos-5-and-10',
            rows: [['G major', 'Op. 32 No. 5', 5], ['B minor', 'Op. 32 No. 10', 10]],
        },
        {
            title: 'Arranged for piano',
            rows: [
                ['rachmaninoff-piano-concerto-no-2-theme', 'Piano Concerto No. 2: theme', 'Op. 18 · C minor'],
            ],
        },
    ],
};
