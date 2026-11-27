// See ../catalog.js for the format.
module.exports = {
    name: 'Felix Mendelssohn',
    years: '1809–1847',
    about:
        'Felix Mendelssohn (1809–1847) was a German composer, pianist and conductor of the early Romantic era. ' +
        'A prodigy from a cultured Berlin family, he wrote his Octet at 16 and the overture to A Midsummer Night’s Dream at 17. ' +
        'His works include the “Scottish” and “Italian” symphonies, the Violin Concerto in E minor, the oratorio Elijah, and eight books of Songs Without Words for piano. ' +
        'He conducted the Leipzig Gewandhaus Orchestra, founded the Leipzig Conservatory, and led the 1829 performance of the St Matthew Passion that revived interest in Bach.',
    wikipedia: 'https://en.wikipedia.org/wiki/Felix_Mendelssohn',
    sources: require('./sources/mendelssohn.json'),
    featured: [
        ['mendelssohn-lieder-ohne-worte-songs-without-words', 1, 'Songs Without Words · G minor', 'Venetian Gondola Song', 'Op. 19 No. 6'],
        ['mendelssohn-spring-song-op-62-no-6', 0, 'Songs Without Words · A major', 'Spring Song', 'Songs Without Words, Op. 62 No. 6 · from an ensemble arrangement'],
        ['mendelssohn-wedding-march', 0, 'A Midsummer Night’s Dream', 'Wedding March', 'A Midsummer Night’s Dream, Op. 61'],
        ['mendelssohn-lieder-ohne-worte-songs-without-words', 2, 'Songs Without Words · F-sharp minor', 'Venetian Gondola Song', 'Op. 30 No. 6'],
        ['mendelssohn-scherzo-op-16-no-2', 0, 'Three Fantasies or Caprices · E minor', 'Scherzo in E minor', 'Op. 16 No. 2'],
    ],
    sections: [
        {
            title: 'Songs Without Words',
            count: '6 of 48',
            from: 'mendelssohn-lieder-ohne-worte-songs-without-words',
            rows: [
                ['Piano agitato', 'Op. 19 No. 5 · F-sharp minor'],
                ['Venetian Gondola Song', 'Op. 19 No. 6 · G minor'],
                ['Venetian Gondola Song', 'Op. 30 No. 6 · F-sharp minor'],
                ['Volkslied', 'Op. 53 No. 5 · A minor'],
                ['Andante espressivo', 'Op. 85 No. 1 · F major'],
                ['Presto', 'Op. 102 No. 3 · C major'],
            ],
        },
        {
            title: 'More Songs Without Words',
            rows: [
                ['mendelssohn-song-without-words-op-19-no-1', 'Andante con moto', 'Op. 19 No. 1 · E major'],
                ['mendelssohn-song-without-words-op-19-no-2', 'Andante espressivo', 'Op. 19 No. 2 · A minor'],
                ['mendelssohn-song-without-words-op-19-no-3', 'Hunting Song', 'Op. 19 No. 3 · A major'],
                ['mendelssohn-song-without-words-op-19-no-4', 'Moderato', 'Op. 19 No. 4 · A major'],
                ['mendelssohn-song-without-words-op-30-no-1', 'Andante espressivo', 'Op. 30 No. 1 · E-flat major'],
                ['mendelssohn-song-without-words-op-30-no-2', 'Allegro di molto', 'Op. 30 No. 2 · B-flat minor'],
                ['mendelssohn-song-without-words-op-30-no-3', 'Adagio non troppo', 'Op. 30 No. 3 · E major'],
                ['mendelssohn-song-without-words-op-30-no-4', 'Agitato e con fuoco', 'Op. 30 No. 4 · B minor'],
                ['mendelssohn-song-without-words-op-30-no-5', 'Andante grazioso', 'Op. 30 No. 5 · D major'],
                ['mendelssohn-song-without-words-op-62-no-3', 'Funeral March', 'Op. 62 No. 3 · E minor'],
                ['mendelssohn-song-without-words-op-62-no-4', 'Morning Song', 'Op. 62 No. 4 · G major'],
                ['mendelssohn-song-without-words-op-62-no-5', 'Venetian Gondola Song', 'Op. 62 No. 5 · A minor'],
            ],
        },
        {
            title: 'Other works',
            rows: [
                ['mendelssohn-spring-song-op-62-no-6', 'Spring Song', 'Songs Without Words, Op. 62 No. 6 · from an ensemble arrangement'],
                ['mendelssohn-scherzo-op-16-no-2', 'Scherzo in E minor', 'Three Fantasies or Caprices, Op. 16 No. 2'],
            ],
        },
        {
            title: 'Arranged for piano',
            rows: [
                ['mendelssohn-wedding-march', 'Wedding March', 'A Midsummer Night’s Dream, Op. 61'],
            ],
        },
    ],
};
