// See ../catalog.js for the format.
module.exports = {
    name: 'Joseph Haydn',
    years: '1732–1809',
    about:
        'Joseph Haydn (1732–1809) was an Austrian composer of the Classical era, often called the father of the symphony and of the string quartet. ' +
        'He spent nearly thirty years as music director to the Esterházy family, composing in relative isolation at their estates, which he said forced him to become original. ' +
        'He wrote 104 numbered symphonies, 68 string quartets, the oratorios The Creation and The Seasons, and more than fifty keyboard sonatas. ' +
        'He was a friend of Mozart and a teacher of Beethoven, and two visits to London in the 1790s made him the most celebrated composer in Europe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Joseph_Haydn',
    sources: require('./sources/haydn.json'),
    featured: [
        ['haydn-sonata-hob-xvi-50', 0, 'Keyboard Sonata · C major', 'Sonata in C major', 'Hob. XVI:50 · I'],
        ['haydn-sonata-hob-xvi-49', 0, 'Keyboard Sonata · E-flat major', 'Sonata in E-flat major', 'Hob. XVI:49 · I'],
        ['haydn-sonata-hob-xvi-32', 0, 'Keyboard Sonata · B minor', 'Sonata in B minor', 'Hob. XVI:32 · I'],
    ],
    sections: [
        {
            title: 'Keyboard Sonata in G major, Hob. XVI:6',
            count: '1 of 4 movements',
            from: 'haydn-sonata-hob-xvi-6',
            rows: [
                ['Allegro', 'First movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in G major, Hob. XVI:27',
            count: '3 movements',
            from: 'haydn-sonata-hob-xvi-27',
            rows: [
                ['Allegro con brio', 'First movement'],
                ['Menuetto', 'Second movement'],
                ['Presto', 'Third movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in E-flat major, Hob. XVI:28',
            count: '3 movements',
            from: 'haydn-sonata-hob-xvi-28',
            rows: [
                ['Allegro moderato', 'First movement'],
                ['Menuetto', 'Second movement'],
                ['Presto', 'Third movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in E major, Hob. XVI:31',
            count: '1 of 3 movements',
            from: 'haydn-sonata-hob-xvi-31',
            rows: [
                ['Moderato', 'First movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in B minor, Hob. XVI:32',
            count: '1 of 3 movements',
            from: 'haydn-sonata-hob-xvi-32',
            rows: [
                ['Allegro moderato', 'First movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in G major, Hob. XVI:39',
            count: '3 movements',
            from: 'haydn-sonata-hob-xvi-39',
            rows: [
                ['Allegro con brio', 'First movement'],
                ['Adagio', 'Second movement'],
                ['Prestissimo', 'Third movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in A-flat major, Hob. XVI:46',
            count: '1 of 3 movements',
            from: 'haydn-sonata-hob-xvi-46',
            rows: [
                ['Allegro moderato', 'First movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in C major, Hob. XVI:48',
            count: '2 movements',
            from: 'haydn-sonata-hob-xvi-48',
            rows: [
                ['Andante con espressione', 'First movement'],
                ['Rondo: Presto', 'Second movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in E-flat major, Hob. XVI:49',
            count: '1 of 3 movements',
            from: 'haydn-sonata-hob-xvi-49',
            rows: [
                ['Allegro', 'First movement'],
            ],
        },
        {
            title: 'Keyboard Sonata in C major, Hob. XVI:50',
            count: '1 of 3 movements',
            from: 'haydn-sonata-hob-xvi-50',
            rows: [
                ['Allegro', 'First movement'],
            ],
        },
    ],
};
