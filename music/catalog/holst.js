// See ../catalog.js for the format.
module.exports = {
    name: 'Gustav Holst',
    years: '1874–1934',
    about:
        'Gustav Holst (1874–1934) was an English composer and teacher, born in Cheltenham to a family of Swedish and German descent. ' +
        'He earned his living as a trombonist and then for nearly thirty years as director of music at St Paul’s Girls’ School in London, composing at weekends and in the holidays. ' +
        'His orchestral suite The Planets, written between 1914 and 1917, made him famous; the big tune from “Jupiter” became the hymn “I Vow to Thee, My Country”. ' +
        'He also wrote two suites for military band that are cornerstones of that repertoire, the St Paul’s Suite for strings, and the carol “In the Bleak Midwinter”.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gustav_Holst',
    sources: require('./sources/holst.json'),
    featured: [
        ['holst-jupiter', 0, 'The Planets · arranged for piano', 'Jupiter, the Bringer of Jollity', 'Op. 32 No. 4'],
        ['holst-i-vow-to-thee-my-country', 0, 'Hymn · “Thaxted”', 'I Vow to Thee, My Country', 'from Jupiter'],
        ['holst-in-the-bleak-midwinter', 0, 'Carol · “Cranham”', 'In the Bleak Midwinter', 'H. 73 No. 1'],
    ],
    sections: [
        {
            title: 'Hymns and carols',
            rows: [
                ['holst-i-vow-to-thee-my-country', 'I Vow to Thee, My Country', '“Thaxted”, the hymn from Jupiter · simplified'],
                ['holst-in-the-bleak-midwinter', 'In the Bleak Midwinter', '“Cranham” · carol, arranged for piano'],
            ],
        },
        {
            title: 'The Planets, Op. 32',
            rows: [
                ['holst-jupiter', 'Jupiter, the Bringer of Jollity', 'The Planets, Op. 32 No. 4 · arranged for piano'],
            ],
        },
    ],
};
