// Hand-edited catalogs for composers whose pieces live in pieces/<folder>/, one file per
// composer in catalog/. Bach's catalog comes from bach-data/ and is built in build.js.
// build.js adds durations, links and portraits from each piece's notes.js.
//
// years: birth–death; about: three to five sentences on the composer; wikipedia: their article
// featured: [folder, movement index, eyebrow, title, catalog number]
// section with `from`: one row per listed movement, in order: [title, detail, number?]
//   (number defaults to the row's position; use it when a set has gaps)
//   `piece` names one row on its own page: 'Ballade' + 'G minor' → “Ballade in G minor”
// section without `from`: [folder, title, detail], each the first movement of its folder
// in either kind, a row may open with [folder, movement index] to come from another folder:
//   [[folder, index], title, detail, number?]
//
// sources: folder → {score, recording}; each is one entry for every movement in the folder, or
//   a list with an entry per movement.
//   score: [credit, licence, link to the edition, PDF of the engraved edition if there is one]
//          (engrave.py cuts the sheet music from that PDF)
//   recording: [YouTube id, performer, what the video holds when it is more than this piece,
//               second at which this piece starts in such a video]
//   A score entry may leave the licence empty when the credit already states it.
//   Most composers keep `sources` in catalog/sources/<id>.json.

// catalog/briefs.js holds a few sentences of background for the pieces that warrant them.

// Composers in the order the directory lists them, after Bach.
const order = ['bach', 'chopin', 'mozart', 'beethoven', 'schubert', 'debussy', 'liszt', 'schumann', 'rachmaninoff', 'ravel', 'satie', 'brahms', 'haydn', 'mendelssohn', 'tchaikovsky', 'grieg', 'scarlatti', 'handel', 'prokofiev', 'holst', 'mussorgsky'];
module.exports = Object.fromEntries(order.map((id) => [id, require('./catalog/' + id + '.js')]));
