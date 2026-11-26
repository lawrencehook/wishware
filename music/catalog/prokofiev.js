// See ../catalog.js for the format.
module.exports = {
    name: 'Sergei Prokofiev',
    years: '1891–1953',
    about:
        'Sergei Prokofiev (1891–1953) was a Russian composer and pianist, one of the major figures of twentieth-century music. ' +
        'He made his name before the revolution as a brilliant and provocative pianist-composer, left Russia in 1918 for the United States and Paris, and returned to the Soviet Union for good in 1936. ' +
        'His works include the “Classical” Symphony, Peter and the Wolf, the ballet Romeo and Juliet, five piano concertos and nine piano sonatas. ' +
        'His early piano pieces, among them the Toccata and the Visions fugitives, show the driving rhythm and sharp harmony that made him famous.',
    wikipedia: 'https://en.wikipedia.org/wiki/Sergei_Prokofiev',
    sources: require('./sources/prokofiev.json'),
    featured: [
        ['prokofiev-toccata-op-11', 0, 'Toccata · D minor', 'Toccata', 'Op. 11'],
        ['prokofiev-visions-fugitives-op-22', 0, 'Visions fugitives', 'Ridicolosamente', 'Op. 22 No. 10'],
    ],
    sections: [
        {
            title: 'Piano works',
            rows: [
                ['prokofiev-toccata-op-11', 'Toccata', 'Op. 11 · D minor'],
                ['prokofiev-visions-fugitives-op-22', 'Ridicolosamente', 'Visions fugitives, Op. 22 No. 10'],
            ],
        },
    ],
};
