// See ../catalog.js for the format.
module.exports = {
    name: 'Wolfgang Amadeus Mozart',
    years: '1756–1791',
    about:
        'Wolfgang Amadeus Mozart (1756–1791) was an Austrian composer of the Classical era, born in Salzburg. ' +
        'A child prodigy who toured the courts of Europe as a keyboard player and violinist, he settled in Vienna in 1781 as a freelance composer, performer and teacher. ' +
        'He wrote more than 600 works, among them the operas The Marriage of Figaro, Don Giovanni and The Magic Flute, 27 piano concertos, and his last three symphonies. ' +
        'He died in Vienna at 35, leaving his Requiem unfinished.',
    wikipedia: 'https://en.wikipedia.org/wiki/Wolfgang_Amadeus_Mozart',
    sources: require('./sources/mozart.json'),
    featured: [
        ['mozart-piano-sonatas', 2, 'Piano Sonata No. 11 · A major', 'Rondo alla turca', 'K. 331'],
        ['mozart-eine-kleine-nachtmusik', 0, 'Serenade No. 13 · G major', 'Eine kleine Nachtmusik: I. Allegro', 'K. 525 · string quartet, played on piano'],
        ['mozart-lacrimosa', 0, 'Requiem', 'Lacrimosa', 'Requiem, K. 626'],
        ['mozart-sonata-k-545', 0, 'Piano Sonata No. 16 · C major', 'Sonata facile', 'K. 545 · I'],
        ['mozart-variations-on-ah-vous-dirai-je-maman-k-265', 0, 'Variations · C major', '“Ah, vous dirai-je, Maman”', 'K. 265'],
        ['mozart-fantasia-in-d-minor-k-397', 0, 'Fantasia · D minor', 'Fantasia in D minor', 'K. 397'],
        ['mozart-sonata-k-310', 0, 'Piano Sonata No. 8 · A minor', 'Sonata in A minor', 'K. 310 · I'],
        ['mozart-fantasia-in-c-minor-k-475', 0, 'Fantasia · C minor', 'Fantasia in C minor', 'K. 475'],
    ],
    sections: [
        {
            title: 'Piano Sonata No. 1 in C major, K. 279',
            count: '3 movements',
            from: 'mozart-sonata-k-279',
            rows: [
                ['Allegro', 'First movement'],
                ['Andante', 'Second movement'],
                ['Allegro', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 2 in F major, K. 280',
            count: '3 movements',
            from: 'mozart-sonata-k-280',
            rows: [
                ['Allegro assai', 'First movement'],
                ['Adagio', 'Second movement'],
                ['Presto', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 3 in B-flat major, K. 281',
            count: '3 movements',
            from: 'mozart-sonata-k-281',
            rows: [
                ['Allegro', 'First movement'],
                ['Andante amoroso', 'Second movement'],
                ['Rondo: Allegro', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 4 in E-flat major, K. 282',
            count: '3 movements',
            from: 'mozart-sonata-k-282',
            rows: [
                ['Allegro', 'First movement'],
                ['Menuetto I and II', 'Second movement'],
                ['Allegro', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 5 in G major, K. 283',
            count: '3 movements',
            from: 'mozart-sonata-k-283',
            rows: [
                ['Allegro', 'First movement'],
                ['Andante', 'Second movement'],
                ['Presto', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 6 in D major, K. 284, “Dürnitz”',
            count: '15 movements',
            from: 'mozart-sonata-k-284',
            rows: [
                ['Allegro', 'First movement'],
                ['Rondeau en polonaise: Andante', 'Second movement'],
                ['Thema', 'Third movement · theme and variations'],
                ['Variation 1', 'Third movement · theme and variations'],
                ['Variation 2', 'Third movement · theme and variations'],
                ['Variation 3', 'Third movement · theme and variations'],
                ['Variation 4', 'Third movement · theme and variations'],
                ['Variation 5', 'Third movement · theme and variations'],
                ['Variation 6', 'Third movement · theme and variations'],
                ['Variation 7: Minore', 'Third movement · theme and variations'],
                ['Variation 8: Maggiore', 'Third movement · theme and variations'],
                ['Variation 9', 'Third movement · theme and variations'],
                ['Variation 10', 'Third movement · theme and variations'],
                ['Variation 11: Adagio cantabile', 'Third movement · theme and variations'],
                ['Variation 12: Allegro', 'Third movement · theme and variations'],
            ],
        },
        {
            title: 'Piano Sonata No. 7 in C major, K. 309',
            count: '3 movements',
            from: 'mozart-sonata-k-309',
            rows: [
                ['Allegro con spirito', 'First movement'],
                ['Andante un poco adagio', 'Second movement'],
                ['Rondo: Allegretto grazioso', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 8 in A minor, K. 310',
            count: '3 movements',
            from: 'mozart-sonata-k-310',
            rows: [
                ['Allegro maestoso', 'First movement'],
                ['Andante cantabile con espressione', 'Second movement'],
                ['Presto', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 9 in D major, K. 311',
            count: '3 movements',
            from: 'mozart-sonata-k-311',
            rows: [
                ['Allegro con spirito', 'First movement'],
                ['Andante con espressione', 'Second movement'],
                ['Rondo: Allegro', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 10 in C major, K. 330',
            count: '3 movements',
            from: 'mozart-sonata-k-330',
            rows: [
                ['Allegro moderato', 'First movement'],
                ['Andante cantabile', 'Second movement'],
                ['Allegretto', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 11 in A major, K. 331',
            count: '3 movements',
            from: 'mozart-piano-sonatas',
            rows: [
                ['Andante grazioso', 'First movement'],
                ['Menuetto', 'Second movement'],
                ['Alla turca', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 12 in F major, K. 332',
            count: '3 movements',
            from: 'mozart-sonata-k-332',
            rows: [
                ['Allegro', 'First movement'],
                ['Adagio', 'Second movement'],
                ['Allegro assai', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 13 in B-flat major, K. 333',
            count: '3 movements',
            from: 'mozart-sonata-k-333',
            rows: [
                ['Allegro', 'First movement'],
                ['Andante cantabile', 'Second movement'],
                ['Allegro grazioso', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 14 in C minor, K. 457',
            count: '3 movements',
            from: 'mozart-sonata-k-457',
            rows: [
                ['Molto allegro', 'First movement'],
                ['Adagio', 'Second movement'],
                ['Allegro assai', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 16 in C major, K. 545, “Sonata facile”',
            count: '3 movements',
            from: 'mozart-sonata-k-545',
            rows: [
                ['Allegro', 'First movement'],
                ['Andante', 'Second movement'],
                ['Rondo: Allegretto', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 17 in B-flat major, K. 570',
            count: '3 movements',
            from: 'mozart-sonata-k-570',
            rows: [
                ['Allegro', 'First movement'],
                ['Adagio', 'Second movement'],
                ['Allegretto', 'Third movement'],
            ],
        },
        {
            title: 'Piano Sonata No. 18 in D major, K. 576',
            count: '3 movements',
            from: 'mozart-sonata-k-576',
            rows: [
                ['Allegro', 'First movement'],
                ['Adagio', 'Second movement'],
                ['Allegretto', 'Third movement'],
            ],
        },
        {
            title: 'Other works',
            rows: [
                ['mozart-variations-on-ah-vous-dirai-je-maman-k-265', 'Twelve Variations on “Ah, vous dirai-je, Maman”', 'K. 265 · C major'],
                ['mozart-fantasia-in-d-minor-k-397', 'Fantasia in D minor', 'K. 397'],
                ['mozart-fantasia-in-c-minor-k-475', 'Fantasia in C minor', 'K. 475'],
            ],
        },
        {
            title: 'Arranged for piano',
            rows: [
                ['mozart-eine-kleine-nachtmusik', 'Eine kleine Nachtmusik: I. Allegro', 'K. 525 · string quartet, played on piano'],
                ['mozart-symphony-no-40-theme', 'Symphony No. 40: opening theme', 'K. 550 · G minor'],
                ['mozart-piano-concerto-no-21-andante', 'Andante', 'Piano Concerto No. 21, K. 467'],
                ['mozart-lacrimosa', 'Lacrimosa', 'Requiem, K. 626'],
            ],
        },
    ],
};
