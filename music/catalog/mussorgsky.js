// See ../catalog.js for the format.
module.exports = {
    name: 'Modest Mussorgsky',
    years: '1839–1881',
    about:
        'Modest Mussorgsky (1839–1881) was a Russian composer, one of the group known as “The Five” who set out to write a distinctly Russian music. ' +
        'An army officer and then a civil servant, he was largely self-taught as a composer and left much of his work unfinished or in rough form. ' +
        'His opera Boris Godunov, the tone poem Night on Bald Mountain and the song cycle Songs and Dances of Death are among his best-known works. ' +
        'Pictures at an Exhibition, written for piano in 1874 in memory of his friend the artist Viktor Hartmann, became famous in Ravel’s orchestration.',
    wikipedia: 'https://en.wikipedia.org/wiki/Modest_Mussorgsky',
    sources: require('./sources/mussorgsky.json'),
    featured: [
        ['mussorgsky-pictures-at-an-exhibition', 0, 'Pictures at an Exhibition', 'Promenade – Gnomus', 'Nos. 1–2'],
        ['mussorgsky-pictures-at-an-exhibition', 7, 'Pictures at an Exhibition', 'The Great Gate of Kiev', 'Nos. 15–16 · after Baba Yaga'],
        ['mussorgsky-pictures-at-an-exhibition', 1, 'Pictures at an Exhibition', 'The Old Castle', 'Nos. 3–4 · after a Promenade'],
    ],
    sections: [
        {
            title: 'Pictures at an Exhibition',
            count: '8 parts',
            from: 'mussorgsky-pictures-at-an-exhibition',
            rows: [
                ['Promenade – Gnomus', 'Nos. 1–2'],
                ['Promenade – The Old Castle', 'Nos. 3–4'],
                ['Promenade – Tuileries', 'Nos. 5–6'],
                ['Bydło', 'No. 7'],
                ['Promenade – Ballet of the Unhatched Chicks', 'Nos. 8–9'],
                ['“Samuel” Goldenberg and “Schmuÿle”', 'No. 10'],
                ['Promenade – Limoges – Catacombs', 'Nos. 11–14 · with “Con mortuis in lingua mortua”'],
                ['The Hut on Fowl’s Legs – The Great Gate of Kiev', 'Nos. 15–16'],
            ],
        },
    ],
};
