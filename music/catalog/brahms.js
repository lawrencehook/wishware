// See ../catalog.js for the format.
module.exports = {
    name: 'Johannes Brahms',
    years: '1833–1897',
    about:
        'Johannes Brahms (1833–1897) was a German composer and pianist who spent most of his career in Vienna. ' +
        'Robert Schumann hailed him as a genius when he was 20, and he remained close to Clara Schumann for the rest of his life. ' +
        'He wrote four symphonies, two piano concertos, a violin concerto, A German Requiem and a large body of chamber music, holding to Classical forms in a Romantic age. ' +
        'His last piano works, the short intermezzos and other pieces of Opp. 116 to 119, are among his most intimate.',
    wikipedia: 'https://en.wikipedia.org/wiki/Johannes_Brahms',
    sources: require('./sources/brahms.json'),
    featured: [
        ['brahms-hungarian-dance-no-5', 0, 'Hungarian Dances', 'Hungarian Dance No. 5', 'WoO 1 No. 5'],
        ['brahms-intermezzo-in-a-op-118-no-2', 0, 'Six Pieces, Op. 118 · A major', 'Intermezzo in A major', 'Op. 118 No. 2'],
        ['brahms-wiegenlied-op-49-no-4', 0, 'Five Songs, Op. 49 · Lullaby', 'Wiegenlied', 'Op. 49 No. 4'],
        ['brahms-waltzes-op-39', 1, 'Sixteen Waltzes, Op. 39 · A-flat major', 'Waltz in A-flat major', 'Op. 39 No. 15'],
    ],
    sections: [
        {
            title: 'Six Pieces, Op. 118',
            count: '1 of 6',
            rows: [['brahms-intermezzo-in-a-op-118-no-2', 'Intermezzo in A major', 'Op. 118 No. 2']],
        },
        {
            title: 'Sixteen Waltzes, Op. 39',
            count: '2 of 16',
            piece: 'Waltz',
            from: 'brahms-waltzes-op-39',
            rows: [['G major', 'Op. 39 No. 10', 10], ['A-flat major', 'Op. 39 No. 15', 15]],
        },
        {
            title: 'Songs',
            rows: [['brahms-wiegenlied-op-49-no-4', 'Wiegenlied (Lullaby)', 'Op. 49 No. 4 · voice and piano, one verse']],
        },
        {
            title: 'Hungarian Dances',
            rows: [
                ['brahms-hungarian-dance-no-1', 'Hungarian Dance No. 1', 'WoO 1 No. 1'],
                ['brahms-hungarian-dance-no-5', 'Hungarian Dance No. 5', 'WoO 1 No. 5'],
            ],
        },
    ],
};
