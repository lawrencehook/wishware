# Missing pieces

Well-known pieces that are not on a composer's page yet, to be searched for one at a time. A piece counts as found when there is a score the importer can read (`tools/midi.py`: MIDI, MusicXML, Humdrum `.krn`, a DCML corpus) that we are free to use. An orchestral or vocal piece counts if a piano version exists.

"Most viewed" means it tops YouTube's most-viewed results for the composer's name (checked 2026-11-26); "editorial" means it is in the top five of uDiscover Music's "10 essential pieces" list, or BBC Music Magazine's for Satie. Where something was tried, it is noted, so the next search can start elsewhere.

Sources already searched for everything below: Mutopia (by composer and by title), the ASAP dataset, Craig Sapp's Humdrum editions, the DCML corpora, Knute Snortum's LilyPond editions, the Vivace Music library (PDMX scores), and piano-midi.de.

IMSLP often has a MIDI or engraving file for these, noted below by file number. Its downloads sit behind a disclaimer page and a script-driven redirect, so they need a real browser; a fetched file goes in `tools/files/` and is named in `tools/imports.json`.

Found since this list was started: Mendelssohn's Spring Song (an accordion-quartet arrangement on IMSLP, read by `tools/mscx.py` and played on piano); Scarlatti's K. 380 (an IMSLP MIDI, fetched through a browser and kept in `tools/files/`); Liszt's Hungarian Rhapsody No. 2 and Grieg's To Spring (piano-midi.de), Chopin's Polonaise-Fantaisie (the Chopin Institute's first-editions corpus, which holds all of Chopin).

## Most viewed, not found

| Composer | Piece | Notes |
|---|---|---|
| Handel | Zadok the Priest | choral |
| Handel | Lascia ch'io pianga (Rinaldo) | aria |
| Haydn | Trumpet Concerto in E-flat | |
| Haydn | "Farewell" Symphony No. 45 | |
| Haydn | Cello Concerto No. 1 in C | |
| Mozart | Queen of the Night aria (The Magic Flute, No. 14) | Mutopia has it for voice and orchestra only |
| Schubert | Piano Trio No. 2, D. 929: Andante con moto | Vivace has it for trio; not tried as an ensemble piece |
| Mendelssohn | Violin Concerto in E minor | |
| Mendelssohn | The Hebrides Overture | |
| Schumann | Piano Concerto in A minor | |
| Tchaikovsky | 1812 Overture | |
| Tchaikovsky | Valse sentimentale, Op. 51 No. 6 | solo piano. IMSLP's Op. 51 page has no MIDI or engraving file |
| Grieg | Solveig's Song | |
| Grieg | Piano Concerto in A minor | Vivace has a two-piano version; not tried |
| Satie | Gnossiennes Nos. 4–6 | Mutopia has only Nos. 1–3. IMSLP's MuseScore files (#944589, #944592) are accordion arrangements of No. 1, not these |
| Rachmaninoff | Piano Concerto No. 2 (beyond its theme) | |
| Rachmaninoff | Piano Concerto No. 3 | |
| Rachmaninoff | Rhapsody on a Theme of Paganini, Variation 18 | |
| Ravel | Boléro | public domain in the United States since 2024. github.com/nsceaux/Ravel_Bolero is a CC0 LilyPond score of the full orchestra; it would need LilyPond installed to produce MIDI, and an ensemble treatment |
| Holst | Mars, the Bringer of War (The Planets) | not on Mutopia, Vivace or IMSLP (which has only PDFs of The Planets); paid arrangements only |
| Holst | First Suite in E-flat and Second Suite in F for military band | |
| Holst | Venus and Saturn (The Planets) | |
| Prokofiev | Dance of the Knights (Romeo and Juliet) | still in copyright in the United States; left alone |
| Prokofiev | Peter and the Wolf | still in copyright in the United States; left alone |

## Here only in part or simplified

| Composer | Piece | What is here |
|---|---|---|
| Handel | Sarabande, HWV 437 | the theme only, no variations |
| Handel | Hallelujah Chorus | an abridged piano version, about a minute |
| Haydn | "Surprise" Symphony: Andante | a simplified theme, 40 seconds |
| Haydn | "Emperor" Quartet: slow movement | the hymn tune, simplified |
| Beethoven | Ode to Joy | a simplified 16-measure version |
| Mozart | Symphony No. 40 | the opening theme, arranged |
| Tchaikovsky | Swan Lake: Scene (Swan Theme) | a simplified version |
| Tchaikovsky | Piano Concerto No. 1 | the opening theme |
| Rachmaninoff | Piano Concerto No. 2 | the theme |
| Mozart | Piano Sonata No. 15 in F major, K. 533/494 | the only sonata not in Sapp's edition |
| Bach | Goldberg Variations | in the sandbox without note data |

## Editorial picks, not found

| Composer | Piece |
|---|---|
| Bach | St Matthew Passion ("Erbarme dich") |
| Bach | Cantata No. 21 |
| Bach | Fantasia and Fugue in G minor, BWV 542 (organ) |
| Handel | Water Music (Alla Hornpipe) |
| Handel | Music for the Royal Fireworks (La réjouissance); Mutopia has it for trumpet and organ |
| Haydn | String Quartet Op. 64 No. 5, "The Lark" |
| Haydn | The Seven Last Words; Nelson Mass; The Creation |
| Mozart | Overture to The Marriage of Figaro |
| Mozart | Symphony No. 41, "Jupiter" |
| Mozart | Clarinet Quintet |
| Beethoven | Symphony No. 3, "Eroica"; Symphony No. 9 (beyond Ode to Joy) |
| Beethoven | String Quartet No. 14; Piano Concerto No. 5 (Vivace has its Adagio, not tried) |
| Schubert | "Trout" Quintet; "Unfinished" Symphony; Die schöne Müllerin; "Death and the Maiden" Quartet |
| Mendelssohn | Octet; "Scottish" and "Italian" Symphonies |
| Schumann | Carnaval, Op. 9 (the sandbox page has no note data; not on Mutopia or piano-midi.de; IMSLP has no MIDI or engraving file) |
| Schumann | Études symphoniques, Op. 13 |
| Liszt | La lugubre gondola |
| Brahms | Symphonies Nos. 1 and 4; Piano Concerto No. 1; Violin Concerto; Piano Quintet |
| Tchaikovsky | The Sleeping Beauty (Valse) |
| Grieg | Funeral March for Rikard Nordraak; Ballade, Op. 24 |
| Debussy | String Quartet (Vivace has it for ensemble, not tried); Prélude à l'après-midi d'un faune; Pelléas et Mélisande |
| Satie | Musique d'ameublement; Véritables préludes flasques; La diva de l'empire; Vexations |
| Rachmaninoff | Cello Sonata; Symphony No. 2; The Isle of the Dead |
| Ravel | Daphnis et Chloé; La valse; Rapsodie espagnole |
| Prokofiev | Piano Concerto No. 1; "Classical" Symphony; Violin Concerto No. 1; Lieutenant Kijé |

## Sheet music not matched

These play, but their printed measures could not be lined up with the notes, so no sheet music shows: five Rachmaninoff preludes (Op. 23 Nos. 1, 2, 3 and 5, and Op. 3 No. 2), twelve of the Snortum Scarlatti sonatas (K. 141 among them), Morning Mood, the Schubert Serenade, Beethoven's Fifth, the Appassionata finale, Rage Over a Lost Penny, Mozart's Fantasia in D minor and K. 309, Dumka, Wedding Day at Troldhaugen, In the Hall of the Mountain King, and the pieces printed on more than two staves (Ave Maria, Widmung, Schumann's Romanze, Le gibet).
