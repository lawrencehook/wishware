// See ../catalog.js for the format.
module.exports = {
    name: 'Franz Liszt',
    years: '1811–1886',
    about:
        'Franz Liszt (1811–1886) was a Hungarian composer and the most celebrated pianist of the nineteenth century. ' +
        'His concert tours of the 1830s and 1840s established the solo piano recital and a new standard of virtuosity. ' +
        'He later settled in Weimar as a conductor and composer, where he developed the symphonic poem and championed the music of Wagner and Berlioz. ' +
        'His piano works include the Sonata in B minor, the Transcendental Études, the Hungarian Rhapsodies and the Années de pèlerinage.',
    wikipedia: 'https://en.wikipedia.org/wiki/Franz_Liszt',
    sources: require('./sources/liszt.json'),
    featured: [
        ['liszt-la-campanella', 0, 'Grandes études de Paganini · G-sharp minor', 'La campanella', 'S. 141 No. 3'],
        ['liszt-hungarian-rhapsody-no-2', 0, 'Hungarian Rhapsodies · C-sharp minor', 'Hungarian Rhapsody No. 2', 'S. 244 No. 2 · C-sharp minor'],
        ['liszt-liebestraume-s-541', 0, 'Liebesträume · A-flat major', 'Liebestraum No. 3', 'S. 541 No. 3'],
        ['liszt-consolations-s-172', 0, 'Consolations · D-flat major', 'Consolation No. 3', 'S. 172 No. 3'],
        ['liszt-hungarian-rhapsody-no-6', 0, 'Hungarian Rhapsodies · D-flat major', 'Hungarian Rhapsody No. 6', 'S. 244 No. 6'],
        ['liszt-transcendental-etudes-selections', 2, 'Transcendental Études · D minor', 'Mazeppa', 'S. 139 No. 4'],
        ['liszt-sonata-in-b-minor', 0, 'Sonata', 'Sonata in B minor', 'S. 178'],
    ],
    sections: [
        {
            title: 'Transcendental Études, S. 139',
            count: '7 of 12',
            from: 'liszt-transcendental-etudes-selections',
            rows: [
                ['Preludio', 'No. 1 · C major', 1],
                ['Paysage', 'No. 3 · F major', 3],
                ['Mazeppa', 'No. 4 · D minor', 4],
                ['Feux follets', 'No. 5 · B-flat major', 5],
                ['Ricordanza', 'No. 9 · A-flat major', 9],
                ['Allegro agitato molto', 'No. 10 · F minor', 10],
                ['Harmonies du soir', 'No. 11 · D-flat major', 11],
            ],
        },
        {
            title: 'Two Concert Études, S. 145',
            from: 'liszt-concert-etudes-s-145',
            rows: [['Waldesrauschen', 'No. 1 · D-flat major'], ['Gnomenreigen', 'No. 2 · F-sharp minor']],
        },
        {
            title: 'Other works',
            rows: [
                ['liszt-hungarian-rhapsody-no-2', 'Hungarian Rhapsody No. 2', 'S. 244 No. 2 · C-sharp minor'],
                ['liszt-la-campanella', 'La campanella', 'S. 141 No. 3 · G-sharp minor'],
                ['liszt-paganini-etude-no-6', 'Paganini Étude No. 6', 'S. 141 No. 6 · A minor · theme and variations'],
                ['liszt-gondoliera', 'Gondoliera', 'Venezia e Napoli, S. 162 No. 1'],
                ['liszt-ballade-no-2', 'Ballade No. 2', 'S. 171 · B minor'],
                ['liszt-consolation-no-1', 'Consolation No. 1', 'S. 172 No. 1 · E major'],
                ['liszt-consolations-s-172', 'Consolation No. 3', 'S. 172 No. 3 · D-flat major'],
                ['liszt-consolation-no-4', 'Consolation No. 4', 'S. 172 No. 4 · D-flat major'],
                ['liszt-sonata-in-b-minor', 'Sonata in B minor', 'S. 178'],
                ['liszt-hungarian-rhapsody-no-6', 'Hungarian Rhapsody No. 6', 'S. 244 No. 6 · D-flat major'],
                ['liszt-mephisto-waltz-no-1', 'Mephisto Waltz No. 1', 'S. 514'],
                ['liszt-liebestraume-s-541', 'Liebestraum No. 3', 'S. 541 No. 3 · A-flat major'],
                ['liszt-paganini-etude-no-1', 'Paganini Étude No. 1', 'S. 141 No. 1 · G minor · “Tremolo”'],
                ['liszt-paganini-etude-no-2', 'Paganini Étude No. 2', 'S. 141 No. 2 · E-flat major'],
                ['liszt-paganini-etude-no-4', 'Paganini Étude No. 4', 'S. 141 No. 4 · E major · “Arpeggio”'],
                ['liszt-paganini-etude-no-5', 'Paganini Étude No. 5', 'S. 141 No. 5 · E major · “La Chasse”'],
                ['liszt-wilde-jagd', 'Wilde Jagd', 'Transcendental Étude, S. 139 No. 8 · C minor'],
                ['liszt-hungarian-rhapsody-no-9', 'Hungarian Rhapsody No. 9', 'S. 244 No. 9 · E-flat major · “Carnival in Pest”'],
                ['liszt-hungarian-rhapsody-no-10', 'Hungarian Rhapsody No. 10', 'S. 244 No. 10 · E major'],
                ['liszt-hungarian-rhapsody-no-12', 'Hungarian Rhapsody No. 12', 'S. 244 No. 12 · C-sharp minor'],
                ['liszt-hungarian-rhapsody-no-15', 'Hungarian Rhapsody No. 15', 'S. 244 No. 15 · A minor · “Rákóczi March”'],
                ['liszt-reminiscences-de-don-juan', 'Réminiscences de Don Juan', 'S. 418 · on themes from Mozart’s Don Giovanni'],
            ],
        },
    ],
};
