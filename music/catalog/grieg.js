// See ../catalog.js for the format.
module.exports = {
    name: 'Edvard Grieg',
    years: '1843–1907',
    about:
        'Edvard Grieg (1843–1907) was a Norwegian composer and pianist, the leading musical voice of his country in the nineteenth century. ' +
        'He studied in Leipzig, then drew increasingly on Norwegian folk song and dance, which gave his music its distinctive harmony and colour. ' +
        'He is best known for the Piano Concerto in A minor and the incidental music to Ibsen’s Peer Gynt, which includes Morning Mood and In the Hall of the Mountain King. ' +
        'Across almost forty years he published 66 Lyric Pieces for piano in ten books, short character pieces that were played in homes across Europe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Edvard_Grieg',
    sources: require('./sources/grieg.json'),
    featured: [
        ['grieg-peer-gynt-suite-no-1', 1, 'Peer Gynt Suite No. 1 · piano version', 'In the Hall of the Mountain King', 'Op. 46 No. 4'],
        ['grieg-wedding-day-at-troldhaugen-op-65-no-6', 0, 'Lyric Pieces, Book VIII · D major', 'Wedding Day at Troldhaugen', 'Op. 65 No. 6'],
        ['grieg-lyric-pieces', 0, 'Lyric Pieces, Book I · E-flat major', 'Arietta', 'Op. 12 No. 1'],
        ['grieg-march-of-the-trolls-op-54-no-3', 0, 'Lyric Pieces, Book V · D minor', 'March of the Trolls', 'Op. 54 No. 3'],
        ['grieg-peer-gynt-suite-no-1', 0, 'Peer Gynt Suite No. 1 · piano version', 'Åse’s Death', 'Op. 46 No. 2'],
        ['grieg-lyric-pieces', 1, 'Lyric Pieces, Book I · A minor', 'Waltz', 'Op. 12 No. 2'],
    ],
    sections: [
        {
            title: 'Lyric Pieces, Book I, Op. 12',
            count: '8 pieces',
            from: 'grieg-lyric-pieces',
            rows: [
                ['Arietta', 'Op. 12 No. 1'],
                ['Waltz', 'Op. 12 No. 2'],
                ['Watchman’s Song', 'Op. 12 No. 3'],
                ['Fairy Dance', 'Op. 12 No. 4'],
                ['Folk Melody', 'Op. 12 No. 5'],
                ['Norwegian Melody', 'Op. 12 No. 6'],
                ['Album Leaf', 'Op. 12 No. 7'],
                ['National Song', 'Op. 12 No. 8'],
            ],
        },
        {
            title: 'Later Lyric Pieces',
            rows: [
                ['grieg-march-of-the-trolls-op-54-no-3', 'March of the Trolls', 'Book V, Op. 54 No. 3'],
                ['grieg-wedding-day-at-troldhaugen-op-65-no-6', 'Wedding Day at Troldhaugen', 'Book VIII, Op. 65 No. 6'],
                ['grieg-mountaineers-song-op-73-no-7', 'The Mountaineer’s Song', 'Moods, Op. 73 No. 7'],
            ],
        },
        {
            title: 'Peer Gynt Suite No. 1, Op. 46',
            count: '2 of 4 · piano version',
            from: 'grieg-peer-gynt-suite-no-1',
            rows: [
                ['Åse’s Death', 'Op. 46 No. 2', 2],
                ['In the Hall of the Mountain King', 'Op. 46 No. 4', 4],
            ],
        },
    ],
};
