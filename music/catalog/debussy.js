// See ../catalog.js for the format.
const book = (number, titles) => titles.map((title, i) => [title, 'Book ' + number + ', No. ' + (i + 1)]);
module.exports = {
    name: 'Claude Debussy',
    years: '1862–1918',
    about:
        'Claude Debussy (1862–1918) was a French composer whose harmony and sense of colour changed the direction of music at the turn of the twentieth century. ' +
        'Trained at the Paris Conservatoire, he won the Prix de Rome in 1884 and made his name with Prélude à l’après-midi d’un faune and the opera Pelléas et Mélisande. ' +
        'His piano music, including the Suite bergamasque, Estampes, Images and two books of Préludes, treats the instrument in terms of resonance and texture as much as melody. ' +
        'He is often called an Impressionist, a label he disliked.',
    wikipedia: 'https://en.wikipedia.org/wiki/Claude_Debussy',
    sources: require('./sources/debussy.json'),
    featured: [
        ['debussy-suite-bergamasque', 2, 'Suite bergamasque · D-flat major', 'Clair de lune', 'L. 75 No. 3'],
        ['debussy-premiere-arabesque', 0, 'Deux Arabesques · E major', 'Arabesque No. 1', 'L. 66 No. 1'],
        ['debussy-preludes-livre-1-cd-125', 7, 'Préludes, Book I', 'La fille aux cheveux de lin', 'Book I, No. 8'],
        ['debussy-children-s-corner-cd-119', 5, 'Children’s Corner', 'Golliwogg’s Cakewalk', 'L. 113 No. 6'],
        ['debussy-preludes-livre-1-cd-125', 9, 'Préludes, Book I', 'La cathédrale engloutie', 'Book I, No. 10'],
        ['debussy-reflets-dans-leau', 0, 'Images, Book I', 'Reflets dans l’eau', 'L. 110 No. 1'],
    ],
    sections: [
        {
            title: 'Suite bergamasque',
            count: '4 movements',
            from: 'debussy-suite-bergamasque',
            rows: [['Prélude', 'First movement'], ['Menuet', 'Second movement'], ['Clair de lune', 'Third movement'], ['Passepied', 'Fourth movement']],
        },
        {
            title: 'Deux Arabesques',
            rows: [
                ['debussy-premiere-arabesque', 'Arabesque No. 1', 'E major'],
                ['debussy-deuxieme-arabesque', 'Arabesque No. 2', 'G major'],
            ],
        },
        {
            title: 'Children’s Corner',
            count: '6 pieces',
            from: 'debussy-children-s-corner-cd-119',
            rows: ['Doctor Gradus ad Parnassum', 'Jimbo’s Lullaby', 'Serenade for the Doll', 'The Snow Is Dancing', 'The Little Shepherd', 'Golliwogg’s Cakewalk'].map((title, i) => [title, 'No. ' + (i + 1)]),
        },
        {
            title: 'Estampes',
            count: '3 pieces',
            from: 'debussy-estampes-cd-108',
            rows: [['Pagodes', 'No. 1'], ['La soirée dans Grenade', 'No. 2'], ['Jardins sous la pluie', 'No. 3']],
        },
        {
            title: 'Préludes, Book I',
            count: '12 preludes',
            from: 'debussy-preludes-livre-1-cd-125',
            rows: book('I', [
                'Danseuses de Delphes', 'Voiles', 'Le vent dans la plaine', 'Les sons et les parfums tournent dans l’air du soir',
                'Les collines d’Anacapri', 'Des pas sur la neige', 'Ce qu’a vu le vent d’ouest', 'La fille aux cheveux de lin',
                'La sérénade interrompue', 'La cathédrale engloutie', 'La danse de Puck', 'Minstrels',
            ]),
        },
        {
            title: 'Préludes, Book II',
            count: '12 preludes',
            from: 'debussy-preludes-livre-2-cd-131',
            rows: book('II', [
                'Brouillards', 'Feuilles mortes', 'La puerta del Vino', 'Les fées sont d’exquises danseuses', 'Bruyères',
                'Général Lavine – eccentric', 'La terrasse des audiences du clair de lune', 'Ondine',
                'Hommage à S. Pickwick Esq. P.P.M.P.C.', 'Canope', 'Les tierces alternées', 'Feux d’artifice',
            ]),
        },
        {
            title: 'Other works',
            rows: [
                ['debussy-prelude-from-pour-le-piano', 'Prélude', 'Pour le piano, No. 1'],
                ['debussy-reflets-dans-leau', 'Reflets dans l’eau', 'Images, Book I, No. 1'],
            ],
        },
    ],
};
