// See ../catalog.js for the format.
const keys = ['C major', 'C minor', 'D major', 'D minor', 'E-flat major', 'E major', 'E minor', 'F major', 'F minor', 'G major', 'G minor', 'A major', 'A minor', 'B-flat major', 'B minor'];
const clavier = ['C major', 'C minor', 'C-sharp major', 'C-sharp minor', 'D major', 'D minor', 'E-flat major', 'E-flat minor', 'E major', 'E minor', 'F major', 'F minor', 'F-sharp major', 'F-sharp minor', 'G major', 'G minor', 'A-flat major', 'G-sharp minor', 'A major', 'A minor', 'B-flat major', 'B-flat minor', 'B major', 'B minor'];

module.exports = {
    name: 'Johann Sebastian Bach',
    years: '1685–1750',
    about:
        'Johann Sebastian Bach (1685–1750) was a German composer and organist of the late Baroque. ' +
        'He worked as a church and court musician in Weimar and Köthen, and spent his last 27 years as cantor of St Thomas’s in Leipzig. ' +
        'His music includes the Brandenburg Concertos, The Well-Tempered Clavier, the Goldberg Variations, the St Matthew Passion and the Mass in B minor, along with some 200 surviving cantatas. ' +
        'In his lifetime he was known chiefly as an organist; a nineteenth-century revival, marked by Mendelssohn’s 1829 performance of the St Matthew Passion, made his reputation as a composer.',
    wikipedia: 'https://en.wikipedia.org/wiki/Johann_Sebastian_Bach',
    sources: require('./sources/bach.json'),
    featured: [
        ['bach-brandenburg-concerto-no-5', 0, 'I. Allegro · D major', 'Brandenburg Concerto No. 5', 'BWV 1050'],
        ['bach-toccata-and-fugue-bwv-565', 0, 'Organ · D minor', 'Toccata and Fugue', 'BWV 565'],
        ['bach-air-bwv-1068', 0, 'Orchestral Suite No. 3 · D major', 'Air', 'BWV 1068'],
        ['bach-cello-suite-no-1', 0, 'Cello Suite No. 1 · G major', 'Prelude for solo cello', 'BWV 1007'],
        ['bach-well-tempered-clavier-1', 0, 'The Well-Tempered Clavier · Book I', 'Prelude in C major', 'BWV 846'],
        ['bach-well-tempered-clavier-1', 11, 'The Well-Tempered Clavier · Book I', 'Fugue in D minor', 'BWV 851'],
    ],
    sections: [
        {
            title: 'Ensemble, organ and cello',
            rows: [
                ['bach-brandenburg-concerto-no-5', 'Brandenburg Concerto No. 5 · I. Allegro', 'BWV 1050 · D major'],
                ['bach-toccata-and-fugue-bwv-565', 'Toccata and Fugue in D minor', 'BWV 565 · organ'],
                ['bach-air-bwv-1068', 'Air', 'BWV 1068 · Orchestral Suite No. 3 in D major'],
                ['bach-cello-suite-no-1', 'Prelude', 'BWV 1007 · Cello Suite No. 1 in G major'],
            ],
        },
        {
            title: 'Two-Part Inventions',
            piece: 'Invention',
            from: 'bach-inventions',
            rows: keys.map((key, i) => [key, 'BWV ' + (772 + i), i + 1]),
        },
        {
            title: 'Three-Part Sinfonias',
            piece: 'Sinfonia',
            from: 'bach-sinfonias',
            rows: keys.map((key, i) => [key, 'BWV ' + (787 + i), i + 1]),
        },
        {
            title: 'The Well-Tempered Clavier, Book I',
            count: '24 pairs',
            pairs: ['Prelude', 'Fugue'],
            from: 'bach-well-tempered-clavier-1',
            rows: clavier.map((key, i) => [key, 'BWV ' + (846 + i)]),
        },
    ],
    credits: [
        { text: 'Bach scores from Mutopia, Project Gutenberg, and Knute Snortum' },
        { text: 'Piano recordings by Alexander Holm', href: 'bach-data/piano-credits.txt' },
        { text: 'Organ and string recordings', href: 'bach-data/ensemble-credits.txt' },
        { text: 'Concerto recordings', href: 'bach-data/concerto-credits.txt' },
    ],
};
