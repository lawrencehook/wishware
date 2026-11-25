// See ../catalog.js for the format.
// [number, key, opus, nickname, movements], and which movements pieces/beethoven-sonata-<n>/ holds.
const sonatas = [
    [1, 'F minor', 'Op. 2 No. 1', '', ['Allegro', 'Adagio', 'Menuetto: Allegretto', 'Prestissimo'], [1, 2, 3, 4]],
    [2, 'A major', 'Op. 2 No. 2', '', ['Allegro vivace', 'Largo appassionato', 'Scherzo: Allegretto', 'Rondo: Grazioso'], [1]],
    [3, 'C major', 'Op. 2 No. 3', '', ['Allegro con brio', 'Adagio', 'Scherzo: Allegro', 'Allegro assai'], [1, 2]],
    [4, 'E-flat major', 'Op. 7', '', ['Allegro molto e con brio', 'Largo, con gran espressione', 'Allegro', 'Rondo: Poco allegretto e grazioso'], [1]],
    [5, 'C minor', 'Op. 10 No. 1', '', ['Allegro molto e con brio', 'Adagio molto', 'Finale: Prestissimo'], [1, 3]],
    [6, 'F major', 'Op. 10 No. 2', '', ['Allegro', 'Allegretto', 'Presto'], [1, 2, 3]],
    [7, 'D major', 'Op. 10 No. 3', '', ['Presto', 'Largo e mesto', 'Menuetto: Allegro', 'Rondo: Allegro'], [1, 2, 3, 4]],
    [8, 'C minor', 'Op. 13', 'Pathétique', ['Grave – Allegro di molto e con brio', 'Adagio cantabile', 'Rondo: Allegro'], [1, 2, 3]],
    [9, 'E major', 'Op. 14 No. 1', '', ['Allegro', 'Allegretto (without the trio)', 'Rondo: Allegro comodo'], [1, 2, 3]],
    [10, 'G major', 'Op. 14 No. 2', '', ['Allegro', 'Andante', 'Scherzo: Allegro assai'], [1]],
    [11, 'B-flat major', 'Op. 22', '', ['Allegro con brio', 'Adagio con molta espressione', 'Menuetto', 'Rondo: Allegretto'], [1, 2, 3]],
    [12, 'A-flat major', 'Op. 26', '', ['Andante con variazioni', 'Scherzo: Allegro molto', 'Marcia funebre sulla morte d’un eroe', 'Allegro'], [1]],
    [13, 'E-flat major', 'Op. 27 No. 1', '', ['Andante – Allegro', 'Allegro molto e vivace', 'Adagio con espressione', 'Allegro vivace'], [4]],
    [14, 'C-sharp minor', 'Op. 27 No. 2', 'Moonlight', ['Adagio sostenuto', 'Allegretto', 'Presto agitato'], [1, 2, 3]],
    [15, 'D major', 'Op. 28', 'Pastoral', ['Allegro', 'Andante', 'Scherzo: Allegro vivace', 'Rondo: Allegro ma non troppo'], [1, 4]],
    [16, 'G major', 'Op. 31 No. 1', '', ['Allegro vivace', 'Adagio grazioso', 'Rondo: Allegretto'], [1, 2]],
    [17, 'D minor', 'Op. 31 No. 2', 'Tempest', ['Largo – Allegro', 'Adagio', 'Allegretto'], [1, 2, 3]],
    [18, 'E-flat major', 'Op. 31 No. 3', '', ['Allegro', 'Scherzo: Allegretto vivace', 'Menuetto: Moderato e grazioso', 'Presto con fuoco'], [1, 2, 3, 4]],
    [19, 'G minor', 'Op. 49 No. 1', '', ['Andante', 'Rondo: Allegro'], [1, 2]],
    [20, 'G major', 'Op. 49 No. 2', '', ['Allegro ma non troppo', 'Tempo di Menuetto'], [1, 2]],
    [21, 'C major', 'Op. 53', 'Waldstein', ['Allegro con brio', 'Introduzione: Adagio molto', 'Rondo: Allegretto moderato – Prestissimo'], [1, 2, 3]],
    [22, 'F major', 'Op. 54', '', ['In tempo d’un menuetto', 'Allegretto'], [1, 2]],
    [23, 'F minor', 'Op. 57', 'Appassionata', ['Allegro assai', 'Andante con moto', 'Allegro ma non troppo – Presto'], [1, 2, 3]],
    [24, 'F-sharp major', 'Op. 78', '', ['Adagio cantabile – Allegro ma non troppo', 'Allegro vivace'], [1, 2]],
    [25, 'G major', 'Op. 79', '', ['Presto alla tedesca', 'Andante', 'Vivace'], [1, 2, 3]],
    [26, 'E-flat major', 'Op. 81a', 'Les Adieux', ['Das Lebewohl: Adagio – Allegro', 'Abwesenheit: Andante espressivo', 'Das Wiedersehen: Vivacissimamente'], [1, 2, 3]],
    [27, 'E minor', 'Op. 90', '', ['Mit Lebhaftigkeit und durchaus mit Empfindung und Ausdruck', 'Nicht zu geschwind und sehr singbar vorgetragen'], [1, 2]],
    [28, 'A major', 'Op. 101', '', ['Etwas lebhaft, und mit der innigsten Empfindung', 'Lebhaft, marschmäßig', 'Langsam und sehnsuchtsvoll', 'Geschwind, doch nicht zu sehr, und mit Entschlossenheit'], [1, 2]],
    [29, 'B-flat major', 'Op. 106', 'Hammerklavier', ['Allegro', 'Scherzo: Assai vivace', 'Adagio sostenuto', 'Largo – Allegro risoluto'], [2, 3, 4]],
    [30, 'E major', 'Op. 109', '', ['Vivace ma non troppo – Adagio espressivo', 'Prestissimo', 'Andante molto cantabile ed espressivo'], [1]],
    [31, 'A-flat major', 'Op. 110', '', ['Moderato cantabile molto espressivo', 'Allegro molto', 'Adagio ma non troppo – Fuga: Allegro ma non troppo'], [1, 2, 3]],
    [32, 'C minor', 'Op. 111', '', ['Maestoso – Allegro con brio ed appassionato', 'Arietta: Adagio molto semplice e cantabile'], [1]],
];
const ordinal = ['First', 'Second', 'Third', 'Fourth'];
const folder = (number) => (number === 8 ? 'beethoven-piano-sonatas' : 'beethoven-sonata-' + number);

module.exports = {
    name: 'Ludwig van Beethoven',
    years: '1770–1827',
    about:
        'Ludwig van Beethoven (1770–1827) was a German composer and pianist whose work spans the Classical and Romantic eras. ' +
        'Born in Bonn, he moved to Vienna at 21, studied briefly with Haydn, and first made his name as a pianist and improviser. ' +
        'His nine symphonies, 32 piano sonatas and 16 string quartets became central to the concert repertoire. ' +
        'He began to lose his hearing before he was 30 and was almost completely deaf when he wrote his late works, including the Ninth Symphony.',
    wikipedia: 'https://en.wikipedia.org/wiki/Ludwig_van_Beethoven',
    sources: require('./sources/beethoven.json'),
    featured: [
        [folder(14), 0, 'Piano Sonata No. 14 · C-sharp minor', '“Moonlight” Sonata', 'Op. 27 No. 2 · I'],
        ['beethoven-fur-elise-woo-59', 0, 'Bagatelle · A minor', 'Für Elise', 'WoO 59'],
        [folder(8), 1, 'Piano Sonata No. 8 · C minor', '“Pathétique” Sonata', 'Op. 13 · II'],
        [folder(17), 2, 'Piano Sonata No. 17 · D minor', '“Tempest” Sonata', 'Op. 31 No. 2 · III'],
        [folder(21), 0, 'Piano Sonata No. 21 · C major', '“Waldstein” Sonata', 'Op. 53 · I'],
        [folder(23), 2, 'Piano Sonata No. 23 · F minor', '“Appassionata” Sonata', 'Op. 57 · III'],
    ],
    sections: [
        ...sonatas.map(([number, key, opus, nickname, movements, held]) => ({
            title: 'Piano Sonata No. ' + number + ' in ' + key + ', ' + opus + (nickname ? ', “' + nickname + '”' : ''),
            count: held.length === movements.length ? held.length + ' movements' : held.length + ' of ' + movements.length + ' movements',
            from: folder(number),
            rows: held.map((m) => [movements[m - 1], ordinal[m - 1] + ' movement']),
        })),
        {
            title: 'Other works',
            rows: [
                ['beethoven-fur-elise-woo-59', 'Für Elise', 'WoO 59 · Bagatelle in A minor'],
                ['beethoven-6-bagatelles-op-126', 'Six Bagatelles', 'Op. 126 · played through'],
                ['beethoven-rage-over-a-lost-penny-op-129', '“Rage Over a Lost Penny”', 'Op. 129 · Rondo a capriccio in G major'],
            ],
        },
    ],
};
