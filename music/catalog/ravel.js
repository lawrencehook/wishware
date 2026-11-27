// See ../catalog.js for the format.
module.exports = {
    name: 'Maurice Ravel',
    years: '1875–1937',
    about:
        'Maurice Ravel (1875–1937) was a French composer admired for his craftsmanship and his brilliance as an orchestrator. ' +
        'He studied at the Paris Conservatoire under Fauré and, with Debussy, was the leading French composer of his generation. ' +
        'His works include Boléro, the ballet Daphnis et Chloé, two piano concertos, and the orchestration of Mussorgsky’s Pictures at an Exhibition. ' +
        'Much of his orchestral music began at the piano, including the Pavane pour une infante défunte and Le tombeau de Couperin.',
    wikipedia: 'https://en.wikipedia.org/wiki/Maurice_Ravel',
    sources: require('./sources/ravel.json'),
    featured: [
        ['ravel-pavane-pour-une-infante-defunte', 0, 'Pavane · G major', 'Pavane pour une infante défunte', 'M. 19'],
        ['ravel-jeux-d-eau-m-30', 0, 'E major', 'Jeux d’eau', 'M. 30'],
        ['ravel-miroirs-nos-3-and-4', 1, 'Miroirs', 'Alborada del gracioso', 'M. 43 No. 4'],
        ['ravel-gaspard-de-la-nuit-m-55', 0, 'Gaspard de la nuit', 'Le Gibet', 'M. 55 No. 2'],
        ['ravel-sonatine-m-40', 0, 'Three movements', 'Sonatine', 'M. 40'],
        ['ravel-le-tombeau-de-couperin-m-68', 0, 'Suite in six movements', 'Le tombeau de Couperin', 'M. 68'],
    ],
    sections: [
        {
            title: 'Miroirs',
            count: '2 of 5',
            from: 'ravel-miroirs-nos-3-and-4',
            rows: [['Une barque sur l’océan', 'No. 3', 3], ['Alborada del gracioso', 'No. 4', 4]],
        },
        {
            title: 'Other works',
            rows: [
                ['ravel-le-gibet', 'Le gibet', 'Gaspard de la nuit, M. 55 No. 2'],
                ['ravel-pavane-pour-une-infante-defunte', 'Pavane pour une infante défunte', 'M. 19 · G major'],
                ['ravel-jeux-d-eau-m-30', 'Jeux d’eau', 'M. 30 · E major'],
                ['ravel-sonatine-m-40', 'Sonatine', 'M. 40 · played through'],
                ['ravel-gaspard-de-la-nuit-m-55', 'Le Gibet', 'Gaspard de la nuit, M. 55 No. 2'],
                ['ravel-le-tombeau-de-couperin-m-68', 'Le tombeau de Couperin', 'M. 68 · played through'],
                ['ravel-ondine', 'Ondine', 'Gaspard de la nuit, M. 55 No. 1'],
                ['ravel-scarbo', 'Scarbo', 'Gaspard de la nuit, M. 55 No. 3'],
                ['ravel-noctuelles', 'Noctuelles', 'Miroirs, M. 43 No. 1'],
            ],
        },
    ],
};
