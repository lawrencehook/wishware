// See ../catalog.js for the format.
module.exports = {
    name: 'Pyotr Ilyich Tchaikovsky',
    years: '1840–1893',
    about:
        'Pyotr Ilyich Tchaikovsky (1840–1893) was a Russian composer of the Romantic era and the first from his country to win lasting international fame. ' +
        'He trained as a civil servant before entering the new St Petersburg Conservatory, and for thirteen years was supported by the patron Nadezhda von Meck, whom he never met. ' +
        'He wrote the ballets Swan Lake, The Sleeping Beauty and The Nutcracker, six symphonies, the First Piano Concerto, the Violin Concerto and the opera Eugene Onegin. ' +
        'The Seasons, twelve piano pieces written one a month for a magazine in 1876, is his best-known work for solo piano.',
    wikipedia: 'https://en.wikipedia.org/wiki/Pyotr_Ilyich_Tchaikovsky',
    sources: require('./sources/tchaikovsky.json'),
    featured: [
        ['tchaikovsky-the-seasons-op-37a', 5, 'The Seasons · June', 'Barcarolle', 'Op. 37a No. 6'],
        ['tchaikovsky-the-seasons-op-37a', 9, 'The Seasons · October', 'Autumn Song', 'Op. 37a No. 10'],
        ['tchaikovsky-the-seasons-op-37a', 10, 'The Seasons · November', 'Troika', 'Op. 37a No. 11'],
        ['tchaikovsky-children-s-album-op-39', 1, 'Children’s Album · D major', 'March of the Wooden Soldiers', 'Op. 39 No. 5'],
        ['tchaikovsky-dumka-op-59', 0, 'Russian rustic scene · C minor', 'Dumka', 'Op. 59'],
        ['tchaikovsky-the-seasons-op-37a', 3, 'The Seasons · April', 'Snowdrop', 'Op. 37a No. 4'],
    ],
    sections: [
        {
            title: 'The Seasons, Op. 37a',
            count: '12 pieces',
            from: 'tchaikovsky-the-seasons-op-37a',
            rows: [
                ['January: At the Fireside', 'Op. 37a No. 1'],
                ['February: Carnival', 'Op. 37a No. 2'],
                ['March: Song of the Lark', 'Op. 37a No. 3'],
                ['April: Snowdrop', 'Op. 37a No. 4'],
                ['May: White Nights', 'Op. 37a No. 5'],
                ['June: Barcarolle', 'Op. 37a No. 6'],
                ['July: Song of the Reaper', 'Op. 37a No. 7'],
                ['August: Harvest', 'Op. 37a No. 8'],
                ['September: The Hunt', 'Op. 37a No. 9'],
                ['October: Autumn Song', 'Op. 37a No. 10'],
                ['November: Troika', 'Op. 37a No. 11'],
                ['December: Christmas', 'Op. 37a No. 12'],
            ],
        },
        {
            title: 'Children’s Album, Op. 39',
            count: '3 of 24',
            from: 'tchaikovsky-children-s-album-op-39',
            rows: [
                ['Morning Prayer', 'Op. 39 No. 1', 1],
                ['March of the Wooden Soldiers', 'Op. 39 No. 5', 5],
                ['Old French Song', 'Op. 39 No. 16', 16],
            ],
        },
        {
            title: 'Other works',
            rows: [
                ['tchaikovsky-dumka-op-59', 'Dumka', 'Op. 59 · C minor'],
            ],
        },
    ],
};
