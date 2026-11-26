// See ../catalog.js for the format.
module.exports = {
    name: 'Franz Schubert',
    years: '1797–1828',
    about:
        'Franz Schubert (1797–1828) was an Austrian composer who spent almost his whole life in Vienna. ' +
        'He wrote more than 600 songs, among them Erlkönig, Ave Maria and the cycle Winterreise, and did more than anyone to make the art song a major form. ' +
        'His instrumental music includes the “Unfinished” and “Great” symphonies, the “Trout” Quintet, and the late piano sonatas and impromptus. ' +
        'Little of it was published in his lifetime; he died at 31, and much of his reputation was made after his death.',
    wikipedia: 'https://en.wikipedia.org/wiki/Franz_Schubert',
    sources: require('./sources/schubert.json'),
    featured: [
        ['schubert-ave-maria-d-839', 0, 'Song · piano realization', 'Ave Maria', 'D. 839'],
        ['schubert-standchen-d-957', 0, 'Schwanengesang · arr. Liszt', 'Ständchen (Serenade)', 'D. 957 No. 4 · transcribed by Liszt'],
        ['schubert-four-impromptus-d-899', 2, 'Impromptus, D. 899 · G-flat major', 'Impromptu in G-flat major', 'D. 899 No. 3'],
        ['schubert-moment-musical-no-3-d-780', 0, 'Moments musicaux · F minor', 'Moment musical No. 3', 'D. 780 No. 3'],
        ['schubert-four-impromptus-d-899', 1, 'Impromptus, D. 899 · E-flat major', 'Impromptu in E-flat major', 'D. 899 No. 2'],
        ['schubert-wanderer-fantasy-d-760', 0, 'Fantasy · C major', '“Wanderer” Fantasy', 'D. 760'],
        ['schubert-impromptus-d-935-nos-1-and-3', 1, 'Impromptus, D. 935 · B-flat major', 'Impromptu in B-flat major', 'D. 935 No. 3'],
    ],
    sections: [
        {
            title: 'Four Impromptus, D. 899',
            piece: 'Impromptu',
            from: 'schubert-four-impromptus-d-899',
            rows: [['C minor', 'D. 899 No. 1'], ['E-flat major', 'D. 899 No. 2'], ['G-flat major', 'D. 899 No. 3'], ['A-flat major', 'D. 899 No. 4']],
        },
        {
            title: 'Impromptus, D. 935',
            count: '2 of 4',
            piece: 'Impromptu',
            from: 'schubert-impromptus-d-935-nos-1-and-3',
            rows: [['F minor', 'D. 935 No. 1', 1], ['B-flat major', 'D. 935 No. 3', 3]],
        },
        {
            title: 'Piano Sonata in A major, D. 664',
            count: '3 movements',
            from: 'schubert-piano-sonata-in-a-d-664',
            rows: [['Allegro moderato', 'First movement'], ['Andante', 'Second movement'], ['Allegro', 'Third movement']],
        },
        {
            title: 'Other works',
            rows: [
                ['schubert-erlkonig-d-328', 'Erlkönig', 'D. 328 · transcribed by Liszt'],
                ['schubert-standchen-d-957', 'Ständchen (Serenade)', 'D. 957 No. 4 · transcribed by Liszt'],
                ['schubert-wanderer-fantasy-d-760', '“Wanderer” Fantasy', 'D. 760 · C major'],
                ['schubert-moment-musical-no-1-d-780', 'Moment musical No. 1', 'D. 780 No. 1 · C major'],
                ['schubert-moment-musical-no-3-d-780', 'Moment musical No. 3', 'D. 780 No. 3 · F minor'],
                ['schubert-piano-sonata-in-g-d-894', 'Andante', 'Piano Sonata in G major, D. 894 · second movement'],
                ['schubert-ave-maria-d-839', 'Ave Maria', 'D. 839 · Ellens dritter Gesang, played on piano'],
            ],
        },
    ],
};
