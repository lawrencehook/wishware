// See ../catalog.js for the format.
module.exports = {
    name: 'Domenico Scarlatti',
    years: '1685–1757',
    about:
        'Domenico Scarlatti (1685–1757) was an Italian composer born in Naples in the same year as Bach and Handel, the son of the opera composer Alessandro Scarlatti. ' +
        'He spent the second half of his life in Portugal and Spain as music master to Maria Barbara, the Portuguese princess who became Queen of Spain. ' +
        'For her he wrote 555 keyboard sonatas, almost all in a single movement in two halves. ' +
        'They are full of hand-crossings, wide leaps, repeated notes and echoes of Spanish guitar and dance, and they changed what players thought a keyboard could do.',
    wikipedia: 'https://en.wikipedia.org/wiki/Domenico_Scarlatti',
    sources: require('./sources/scarlatti.json'),
    featured: [
        ['scarlatti-sonata-k-455', 0, 'Keyboard Sonata · G major', 'Sonata in G major', 'K. 455'],
        ['scarlatti-sonata-k-11', 0, 'Keyboard Sonata · C minor', 'Sonata in C minor', 'K. 11'],
        ['scarlatti-sonata-k-491', 0, 'Keyboard Sonata · D major', 'Sonata in D major', 'K. 491'],
    ],
    sections: [
        {
            title: 'Keyboard Sonatas',
            count: '4 of 555',
            rows: [
                ['scarlatti-sonata-k-11', 'Sonata in C minor', 'K. 11'],
                ['scarlatti-sonata-k-455', 'Sonata in G major', 'K. 455'],
                ['scarlatti-sonata-k-491', 'Sonata in D major', 'K. 491'],
                ['domenico-scarlatti-keyboard-sonatas', 'Sonata in C major', 'K. 514'],
            ],
        },
    ],
};
