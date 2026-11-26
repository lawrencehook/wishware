// See ../catalog.js for the format.
module.exports = {
    name: 'George Frideric Handel',
    years: '1685–1759',
    about:
        'George Frideric Handel (1685–1759) was a German-born composer who spent most of his career in London and became a British subject in 1727. ' +
        'After early years in Hamburg and Italy he made his name in England with Italian operas, then turned to English oratorio when the taste for opera faded. ' +
        'His works include Messiah, Water Music, Music for the Royal Fireworks, the coronation anthem Zadok the Priest and more than forty operas. ' +
        'He was a celebrated keyboard improviser, and published two sets of harpsichord suites alongside many shorter pieces written for pupils and friends.',
    wikipedia: 'https://en.wikipedia.org/wiki/George_Frideric_Handel',
    sources: require('./sources/handel.json'),
    featured: [
        ['handel-aylesford-pieces', 15, 'Aylesford Pieces', 'Air with variations', 'No. 16'],
        ['handel-aylesford-pieces', 5, 'Aylesford Pieces', 'Impertinence', 'No. 6'],
        ['handel-sonatina-hwv-585', 0, 'Sonatina · B-flat major', 'Sonatina in B-flat major', 'HWV 585'],
    ],
    sections: [
        {
            title: 'Aylesford Pieces',
            count: '20 pieces',
            from: 'handel-aylesford-pieces',
            rows: [
                ['Ouverture', 'No. 1'],
                ['Entrée', 'No. 2'],
                ['Gavotte', 'No. 3'],
                ['Toccata', 'No. 4'],
                ['Fuga', 'No. 5'],
                ['Impertinence', 'No. 6'],
                ['Concerto', 'No. 7'],
                ['Preludio', 'No. 8'],
                ['Menuet I', 'No. 9'],
                ['Menuet II', 'No. 10'],
                ['Allegro', 'No. 11'],
                ['Menuet', 'No. 12'],
                ['Air', 'No. 13'],
                ['Menuet I', 'No. 14'],
                ['Menuet II', 'No. 15'],
                ['Air with variations', 'No. 16'],
                ['Allemande', 'No. 17'],
                ['Passepied', 'No. 18'],
                ['Menuet', 'No. 19'],
                ['Sonatina', 'No. 20'],
            ],
        },
        {
            title: 'Other works',
            rows: [
                ['handel-sonatina-hwv-585', 'Sonatina in B-flat major', 'HWV 585'],
            ],
        },
    ],
};
