// See ../catalog.js for the format.
module.exports = {
    name: 'Erik Satie',
    years: '1866–1925',
    about:
        'Erik Satie (1866–1925) was a French composer and pianist who spent much of his life on the margins of Parisian musical life. ' +
        'He worked for years as a cabaret pianist in Montmartre, and his spare, slow piano pieces, the Gymnopédies and Gnossiennes, ran against the grand Romantic style of his day. ' +
        'He gave his scores odd titles and playing directions, and went back to school at 39 to study counterpoint. ' +
        'Debussy and Ravel championed him, and later minimalist and ambient composers claimed him as a forerunner.',
    wikipedia: 'https://en.wikipedia.org/wiki/Erik_Satie',
    sources: require('./sources/satie.json'),
    featured: [
        ['satie-gymnopedie-no-1', 0, 'Trois Gymnopédies', 'Gymnopédie No. 1', 'Lent et douloureux'],
        ['satie-gnossiennes-nos-13', 0, 'Gnossiennes', 'Gnossienne No. 1', 'Lent'],
        ['satie-gymnopedie-no-3', 0, 'Trois Gymnopédies', 'Gymnopédie No. 3', 'Lent et grave'],
    ],
    sections: [
        {
            title: 'Trois Gymnopédies',
            rows: [
                ['satie-gymnopedie-no-1', 'Gymnopédie No. 1', 'Lent et douloureux'],
                ['satie-gymnopedie-no-2', 'Gymnopédie No. 2', 'Lent et triste'],
                ['satie-gymnopedie-no-3', 'Gymnopédie No. 3', 'Lent et grave'],
            ],
        },
        {
            title: 'Gnossiennes',
            count: '3 of 6',
            from: 'satie-gnossiennes-nos-13',
            rows: [['Gnossienne No. 1', 'Lent'], ['Gnossienne No. 2', 'Avec étonnement'], ['Gnossienne No. 3', 'Lent']],
        },
    ],
};
