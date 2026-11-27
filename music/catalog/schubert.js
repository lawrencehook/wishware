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
            title: 'Four Impromptus, D. 935',
            piece: 'Impromptu',
            from: 'schubert-impromptus-d-935-nos-1-and-3',
            rows: [
                ['F minor', 'D. 935 No. 1'],
                [['schubert-impromptu-d-935-no-2', 0], 'A-flat major', 'D. 935 No. 2'],
                ['B-flat major', 'D. 935 No. 3'],
                [['schubert-impromptu-d-935-no-4', 0], 'F minor', 'D. 935 No. 4'],
            ],
        },
        {
            title: 'Piano Sonata in A major, D. 664',
            count: '3 movements',
            from: 'schubert-piano-sonata-in-a-d-664',
            rows: [['Allegro moderato', 'First movement'], ['Andante', 'Second movement'], ['Allegro', 'Third movement']],
        },
        {
            title: 'Piano Sonata in B-flat major, D. 960',
            count: '4 movements',
            from: 'schubert-piano-sonata-d-960',
            rows: [
                ['Molto moderato', 'First movement'],
                ['Andante sostenuto', 'Second movement'],
                ['Scherzo: Allegro vivace con delicatezza', 'Third movement'],
                ['Allegro ma non troppo', 'Fourth movement'],
            ],
        },
        {
            title: 'Piano Sonata in D major, D. 850',
            count: '4 movements',
            from: 'schubert-piano-sonata-d-850',
            rows: [
                ['Allegro vivace', 'First movement'],
                ['Con moto', 'Second movement'],
                ['Scherzo: Allegro vivace', 'Third movement'],
                ['Rondo: Allegro moderato', 'Fourth movement'],
            ],
        },
        {
            title: 'Piano Sonata in A minor, D. 784',
            count: '3 movements',
            from: 'schubert-piano-sonata-d-784',
            rows: [
                ['Allegro giusto', 'First movement'],
                ['Andante', 'Second movement'],
                ['Allegro vivace', 'Third movement'],
            ],
        },
        {
            title: 'Six Moments musicaux, D. 780',
            rows: [
                ['schubert-moment-musical-no-1-d-780', 'Moment musical No. 1', 'D. 780 No. 1 · C major'],
                ['schubert-moment-musical-no-2-d-780', 'Moment musical No. 2', 'D. 780 No. 2 · A-flat major'],
                ['schubert-moment-musical-no-3-d-780', 'Moment musical No. 3', 'D. 780 No. 3 · F minor'],
                ['schubert-moment-musical-no-4-d-780', 'Moment musical No. 4', 'D. 780 No. 4 · C-sharp minor'],
                ['schubert-moment-musical-no-5-d-780', 'Moment musical No. 5', 'D. 780 No. 5 · F minor'],
                ['schubert-moment-musical-no-6-d-780', 'Moment musical No. 6', 'D. 780 No. 6 · A-flat major'],
            ],
        },
        {
            title: 'Other works',
            rows: [
                ['schubert-erlkonig-d-328', 'Erlkönig', 'D. 328 · transcribed by Liszt'],
                ['schubert-standchen-d-957', 'Ständchen (Serenade)', 'D. 957 No. 4 · transcribed by Liszt'],
                ['schubert-wanderer-fantasy-d-760', '“Wanderer” Fantasy', 'D. 760 · C major'],
                ['schubert-piano-sonata-in-g-d-894', 'Andante', 'Piano Sonata in G major, D. 894 · second movement'],
                ['schubert-ave-maria-d-839', 'Ave Maria', 'D. 839 · Ellens dritter Gesang, played on piano'],
            ],
        },
    ],
};
