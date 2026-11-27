# Music

[`index.html`](index.html) is a directory of composers. Each composer has a page with a short note, selected works and a catalog, and each work has a player page: a piano roll that plays in the browser, engraved sheet music that follows along where an edition matches, and a recording on YouTube.

## How it is built

- **Composer pages** share one template: `composer.html?c=<id>` reads `composers/<id>.js`, which `node music/build.js` generates. Rerun the build after changing a catalog, a source or a score. The directory lists composers oldest first.
- **Catalogs** are written by hand in `catalog/<id>.js` (format in `catalog.js`), with score credits and recordings in `catalog/sources/<id>.json`. A recording can carry the second at which the piece starts in a video of a whole set.
- **Piece pages** are `piece.html?c=<id>&p=<folder>&m=<movement>`, playing `pieces/<folder>/notes.js` and `measures.js`.
- **Sheet music** in `notation/<folder>/` is cut by `engrave.py` from the Mutopia PDF named in the sources (see the notes at the top of that script). A piece whose printed measures cannot be matched shows none.
- **The player** itself is `player.js`: the piano roll, playback and sheet-music highlight. `piece.html` turns a piece’s data into the description it takes (documented at the top of that file).
- **Bach** was the first composer here and once had a player of his own. His pieces were converted from that player’s data, so their movements also name their written voices and, for the four ensemble pieces, their instruments, seating and bowing; their sheet-music files in `notation/bach-*/` were converted from that player’s measure positions rather than made by `engrave.py`. `bach-data/` now holds only the instrument samples.

## Known gaps

- Tempos come from the source files and few have been checked by ear. `tools/imports.json` records the ones corrected by hand (`speed`, `tempo`); Chopin’s Ballade No. 4 was also rescaled by 1.5 in place, because its marks count dotted quarters.
- Mutopia MIDI plays each printed measure once. Where the sheet music matches, `engrave.py --repeats` reads the repeat signs and first and second endings off the print and `tools/midi.py` unfolds the notes (the plan is the movement’s `order` in `tools/imports.json`; a da capo is added there by hand). Pieces whose sheet music does not match still play once through.
- Pieces from the ASAP and DCML datasets have no engraved edition, so no sheet music.
- Bach’s Goldberg Variations are still in the sandbox.

## Other collections

Four earlier collections remain in this folder but are not linked from the site for now.

| Collection | Scope and playback |
| --- | --- |
| [Guqin](guqin/index.html) | All 64 titles in Zhu Quan’s 1425 handbook, with a facsimile and a playable demonstration of the opening gestures of entry 44. |
| [Korean jeongganbo](jeongganbo/index.html) | Seven columns of *Cheongsanbyeolgok* with a cursor on the historical facsimile. Four further Jeonggan editions pair local piano and janggu playback with synchronized grid notation. Original editable scores and instrument credits ship with the player. |
| [Carnatic kṛtis](carnatic/index.html) | Dīkṣitar’s five-element group, with lyrics and notation in the external Malayalam edition and timestamped performances by D. K. Jayaraman. All five entries include offline piano readings of the opening notes. The full vocal recordings and edition require internet access. |
| [Ottoman saz semâîsi](ottoman/index.html) | 39 complete timed transcriptions across 29 makams, playable offline with section navigation and 64 pages of locally bundled sheet music. The SymbTr-derived scores carry the source collection’s CC BY-NC-SA 4.0 license. |

## Composer list

The composers to showcase, in the order they were added. The list favors keyboard music, because that is what the player and the engraved editions handle best; composers known mainly for opera or orchestral work (Wagner, Verdi, Puccini, Mahler, Vivaldi) are left out for now. Counts are as of 2026-11-25.

To add a composer: `tools/survey.py` lists what each sandbox folder holds, `tools/sources.py` writes `catalog/sources/<id>.json` from the credits and recordings on the sandbox pages, you write `catalog/<id>.js` and add the id to `catalog.js`, `tools/migrate.py` moves the note data to `pieces/` and retires the sandbox pages, then run `engrave.py` and `build.js`. Run the tools from the repo root.

Pieces the sandbox never had come straight from score MIDI: list them in `tools/imports.json` and run `tools/midi.py`, which writes `pieces/<folder>/` from Mutopia editions (which also give the engraved sheet music) or the ASAP dataset. It also reads Humdrum `.krn` scores through `tools/kern.py`, which takes the upbeat, tempo and repeats from the score itself. A DCML corpus’s `.notes.tsv` goes through `tools/dcml.py` the same way, but needs a tempo given by hand. MusicXML (`.mxl`) is read too, and MuseScore files (`.mscz`) through `tools/mscx.py`, without their repeats. Add the score credit to `catalog/sources/<id>.json`; a recording is optional there.

| # | Composer | Status | Notes (sandbox folders waiting, for those not done) |
|---|---|---|---|
| 1 | Johann Sebastian Bach | Done | 82 works; 2 more to fold in from the sandbox (Goldberg Variations, keyboard repertoire) |
| 2 | Frédéric Chopin | Done | 61 works |
| 3 | Wolfgang Amadeus Mozart | Done | 70 works: 17 of the 18 piano sonatas complete (K. 533/494 is not in Sapp’s edition), and piano versions of his best-known pieces |
| 4 | Ludwig van Beethoven | Done | 107 works: all 32 piano sonatas complete; Diabelli Variations (no note data) and the string quartets stay in the sandbox |
| 5 | Franz Schubert | Done | 14 works; Erlkönig stays on the art songs page |
| 6 | Claude Debussy | Done | 41 works |
| 7 | Franz Liszt | Done | 20 works |
| 8 | Robert Schumann | Done | 25 works; Carnaval (no note data) stays in the sandbox |
| 9 | Sergei Rachmaninoff | Done | 12 works |
| 10 | Maurice Ravel | Done | 7 works |
| 11 | Erik Satie | Done | 6 works; Sports et divertissements (no note data) stays in the sandbox |
| 12 | Johannes Brahms | Done | 7 works, including Hungarian Dances Nos. 1 and 5 and the Rhapsody in B minor |
| 13 | Joseph Haydn | Done | 19 works: movements from ten sonatas, and two simplified themes |
| 14 | Felix Mendelssohn | Done | 8 works |
| 15 | Pyotr Ilyich Tchaikovsky | Done | 23 works |
| 16 | Edvard Grieg | Done | 13 works |
| 17 | Domenico Scarlatti | Done | 89 works: 64 from Craig Sapp’s Humdrum edition of the Longo sonatas (all it holds), 21 well-known ones from Knute Snortum’s LilyPond edition (K. 1–370 so far; its K. 21–30 release holds the wrong files), K. 27 from the DCML corpus, K. 466 from PDMX, 2 from Mutopia. K. 380 is in none of these yet |
| 18 | George Frideric Handel | Done | 32 works: the Aylesford Pieces, “The Harmonious Blacksmith” (DCML) and piano versions of his best-known pieces, the Passacaglia among them |
| 19 | Sergei Prokofiev | Done | 2 works |
| 20 | Dmitri Shostakovich |  | no note data, and the music is still in copyright |
| 21 | Gustav Holst | Done | 3 works: Jupiter, “I Vow to Thee, My Country” and In the Bleak Midwinter, as piano versions |

Also plausible, each with material in the sandbox: Scott Joplin (5), Béla Bartók (4), Isaac Albéniz (3), Alexander Scriabin (2), Clara Schumann (2), George Gershwin (1), Modest Mussorgsky (1), Gabriel Fauré (1).

## Most-viewed pieces

Each composer’s page should hold their best-known pieces. As a guide, this lists what tops YouTube’s most-viewed results for a search on the composer’s name (checked 2026-11-26; compilations, remixes and sleep playlists set aside), alongside the editorial top fives in uDiscover Music’s “10 essential pieces” lists. An orchestral or vocal piece counts if an open piano version exists.

| Composer | Most viewed on YouTube | Here | Still missing |
|---|---|---|---|
| Bach | Air; Cello Suite No. 1 Prelude; Toccata and Fugue in D minor; Prelude in C | all four | editorial picks: St Matthew Passion, Fantasia and Fugue in G minor |
| Scarlatti | K. 141, K. 27, K. 1, K. 466, K. 380 | all five | — |
| Handel | Sarabande; Passacaglia (after Halvorsen); Hallelujah Chorus; Arrival of the Queen of Sheba; Ombra mai fu | all five, as piano versions; the Sarabande and Hallelujah are abridged | Zadok the Priest, Lascia ch’io pianga |
| Haydn | Trumpet Concerto; “Surprise” Symphony Andante; “Emperor” Quartet slow movement | the “Surprise” theme and the Emperor’s Hymn, both simplified | Trumpet Concerto |
| Mozart | Lacrimosa; Queen of the Night aria; Piano Concerto No. 21 Andante; Rondo alla turca; Symphony No. 40 | Lacrimosa, Andante, Rondo alla turca, Symphony No. 40 theme; also Eine kleine Nachtmusik (first movement) | Queen of the Night |
| Beethoven | “Moonlight” Sonata; Symphony No. 5; Für Elise | all three (the symphony as a piano reduction); also Ode to Joy, simplified | — |
| Schubert | Serenade (Ständchen); Ave Maria; Impromptu in G-flat; Piano Trio No. 2 Andante; Erlkönig | Serenade and Erlkönig (Liszt’s transcriptions), Ave Maria, Impromptu | Trio Andante |
| Mendelssohn | Wedding March; Violin Concerto; Hebrides Overture; Spring Song | Wedding March, Spring Song | Violin Concerto, Hebrides Overture |
| Chopin | Nocturne Op. 9 No. 2; Nocturne in C-sharp minor; Fantaisie-Impromptu; Nocturne Op. 9 No. 1 | all four, and the Polonaise-Fantaisie | — |
| Schumann | Piano Concerto; Träumerei; Kinderszenen; Widmung | Träumerei, Kinderszenen, Widmung | Piano Concerto, Carnaval |
| Liszt | Hungarian Rhapsody No. 2; La campanella; Liebestraum No. 3; Paganini Étude No. 6 | all four | — |
| Brahms | Lullaby; Hungarian Dance No. 5 | both | symphonies and concertos |
| Tchaikovsky | Waltz of the Flowers; 1812 Overture; Sugar Plum Fairy; Swan Lake theme; Dance of the Little Swans; Valse sentimentale | Waltz of the Flowers (four hands), Sugar Plum Fairy, Pas de deux, Little Swans, Swan theme (simplified), Piano Concerto No. 1 theme | 1812 Overture, Valse sentimentale |
| Grieg | In the Hall of the Mountain King; Morning Mood; Solveig’s Song; Piano Concerto | Mountain King, Morning Mood; also Anitra’s Dance and Butterfly | Solveig’s Song, Piano Concerto |
| Debussy | Clair de lune; Arabesques; Rêverie | all three | — |
| Satie | Gymnopédie No. 1; Gnossienne No. 1 | both | Gnossiennes 4–6 |
| Rachmaninoff | Piano Concerto No. 2; Prelude in C-sharp minor; Piano Concerto No. 3; Prelude in G minor | both preludes, and the concerto’s theme | the concertos proper |
| Ravel | Boléro; Pavane pour une infante défunte | Pavane | Boléro |
| Prokofiev | Toccata; Dance of the Knights; Peter and the Wolf | Toccata | the other two are still in copyright in the United States |
| Holst | Mars and Jupiter from The Planets; I Vow to Thee, My Country; First Suite in E-flat | Jupiter, I Vow to Thee (simplified); also In the Bleak Midwinter | Mars, the band suites |

What is still missing, with what has been tried, is kept in [missing-pieces.md](missing-pieces.md). A score that is published openly with no licence stated is used and credited as “licence not stated”.

The piano versions of orchestral and vocal pieces come from the Vivace Music library (vivace-music.org), which republishes CC0 and public-domain MuseScore scores from the PDMX dataset as MusicXML; `tools/midi.py` reads those directly.

## Johann Sebastian Bach

The Bach collection features the first movement of Brandenburg Concerto No. 5, Bach’s organ Toccata and Fugue, the Air from Orchestral Suite No. 3, two preludes, and the D-minor keyboard fugue. It includes all 24 prelude-and-fugue pairs from The Well-Tempered Clavier, Book I, alongside all fifteen Two-Part Inventions, BWV 772–786, and all fifteen Three-Part Sinfonias, BWV 787–801. Open the catalog in a browser to follow the upper voice, mute it, or slow the piece down and listen for the lower voice taking up its theme. The scores and instrument samples ship with the player and work offline.

The catalog combines two independently reusable resources. Mutopia volunteers encoded the notes and their timing. Alexander Holm recorded individual notes on a Yamaha C5 grand piano. The player can therefore change the tempo or isolate a written voice while retaining the sound of a recorded instrument. Each piece links to its edition, and the instrument recordings carry their own credits. The organ, solo cello line, and orchestral strings use CC0 Versilian samples. [Mutopia](https://www.mutopiaproject.org/) · [Piano sample credits](bach-data/piano-credits.txt) · [Organ and string credits](bach-data/ensemble-credits.txt)

## Where to look next

Collection sizes below are approximate as of November 2026. A song, a movement, a scanned edition, and a manuscript catalog record represent different amounts of playable music. Collections also cover some of the same works.

| Collection | Material and reuse | What it makes possible |
| --- | --- | --- |
| Mutopia | 2,124 pieces with editable LilyPond, printable scores, and MIDI. Each edition identifies its public-domain status or license. [Collection and formats](https://www.mutopiaproject.org/) | Extend the existing player into the canons or cello suites. Inspect the encoded voices before assigning colors: a keyboard staff can contain multiple independent melodies. |
| OpenScore | Roughly 1,500 songs, 700 movements across 200 string quartets, and 100 orchestral movements, under CC0. [OpenScore collections](https://fourscoreandmore.org/openscore/) | Follow four named instruments through a quartet, or investigate what the piano does under a particular word in a song. |
| Kimiko Ishizaka's open Bach projects | The Goldberg Variations and Book I of The Well-Tempered Clavier have public-domain scores and studio performances. [Open Goldberg Variations](https://opengoldbergvariations.org/) · [Open Well-Tempered Clavier](https://welltemperedclavier.org/kimiko-ishizaka-releases-open-well-tempered-clavier.html) | Pair the existing D-minor fugue with Ishizaka's interpretation. Mapping beats to timestamps would let a listener switch versions at the same phrase. |
| Annotated Beethoven Corpus | Expert harmonic analyses of all Beethoven string quartets, with machine-readable notes, keys, and chords. CC BY-NC-SA 4.0. [Dataset and license](https://github.com/DCMLab/ABC) | Build a noncommercial listening guide in which selecting a labeled modulation plays its musical context. |
| MAESTRO | About 200 hours of piano audio aligned to performed MIDI within roughly 3 milliseconds, including key velocities and pedal positions. CC BY-NC-SA 4.0. [Dataset and license](https://magenta.tensorflow.org/datasets/maestro) | Use the performed notes to compare timing, dynamics, or pedaling while changing one element at a time. |
| IMSLP | Over 260,000 works and 890,000 scores at the time of research. Many files are scanned pages. Reuse depends on the edition, file, and jurisdiction. [IMSLP library](https://imslp.org/wiki/Main_Page) | Locate a historical edition and compare it against a transcription. Budget for transcription and proofreading when the source is a scan. |
| RISM | Over 1.5 million records describing musical sources. The catalog data is CC BY 3.0. Some records include an encoded opening melody, called an incipit. [Data services](https://rism.info/community/data-services.html) · [Incipit search API](https://rism.online/docs/api/incipit-search/) | Search a short melodic opening and trace the surviving manuscript sources. Check the holding library's terms for any images. |

## What can travel with the player?

Track the **composition, digital edition, annotations, and recorded sound** separately. Bach's composition is in the public domain. The volunteer who typeset a particular edition and the pianist who recorded it may each have chosen different terms.

CC0 and public-domain materials are good starting points for a redistributable catalog. CC BY permits commercial reuse with attribution. CC BY-SA also permits commercial use and requires shared adaptations of the licensed material to retain the applicable license. NC collections are a separate option for noncommercial projects. For a new piece, keep the edition URL, contributor, license, and a description of the conversion alongside its note data. [Creative Commons license guide](https://creativecommons.org/cc-licenses/)

Four Invention editions in this catalog credit jeff covey under CC BY-SA 3.0 (BWV 772, 777, 780, and 783). Their converted score data retain that license. The other included Invention editions and the Stelios Samelis fugue edition are marked public domain. Catalog playback uses Holm's sampled instrument. Ishizaka's complete performances are a possible future addition. [Invention edition records](catalog/sources/bach.json) · [Fugue edition](https://www.mutopiaproject.org/ftp/BachJS/BWV851/bwv851_fugue06/bwv851_fugue06.ly)

## Listening experiments to try

1. **Follow a motif.** Select six notes in an Invention. Search both voices for the same sequence of pitch intervals and relative durations, so a move to another key still matches. Play the original and each match back to back with measure and voice labels. Start here because the existing scores are enough to test whether the discoveries are interesting. Later, let the listener try rhythmic changes or an inversion.
2. **Sit inside a quartet.** Introduce the viola alone for two bars, then fade the other players back in. At a handoff, let the listener switch focus to the instrument that finishes the phrase. Start with one OpenScore movement and mark a few handoffs by ear.
3. **Hear a pianist's decision.** Align one cadence in Ishizaka's BWV 851 with its printed beats. Play the evenly timed score and the studio recording, then replay the sampled instrument using the pianist's timing to isolate the effect of timing from tone. Validate the beat alignment by listening before extending it to the whole work.

The Sinfonias use Olivier Vermersch’s public-domain Mutopia editions. Playback preserves the three melodic voices across staff changes. Each player links to its LilyPond source and the corresponding engraved PDF.

## Sheet music

The player shows one printed staff system at a time and highlights the current measure. The Brandenburg engraving comes from the same MusicXML as the player. The Mutopia images in `notation/bach/` are cropped, losslessly compressed reproductions of the same Mutopia A4 editions credited on each player page, under their respective edition licenses. The full-score PDF link opens the original engraving. The highlight follows both repeats in BWV 777 and the opening pickup in BWV 774.

## Selected works

The “Selected works” section includes three familiar instrumental colors: organ, strings, and piano. ChartMasters lists individual recordings of the G-major Cello Suite Prelude and C-major keyboard Prelude at the top of its Bach streaming table. Multiple recordings can represent one composition, so the shelf is an editorial selection. [ChartMasters Bach dashboard](https://chartmasters.org/artist/bach-baroque/)

Both featured preludes are complete movements. BWV 1007 uses Andreas Scherer's public-domain cello edition, played with recorded cello samples. BWV 846 uses the public-domain keyboard edition maintained by Tobias Erbsland. The catalog's BWV 851 fugue belongs to Book I of The Well-Tempered Clavier. The familiar organ Toccata and Fugue in D minor is a separate work, BWV 565. [Cello edition](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=517) · [Keyboard edition](https://www.mutopiaproject.org/ftp/BachJS/BWV846/wtk1-prelude1/wtk1-prelude1.ly)

The complete BWV 565 follows the timing of the Mutopia MIDI edition (quarter note = 60). The three paths correspond to right hand, left hand, and pedal. The Air uses jeff covey’s CC BY-SA 3.0 edition, including the printed repeats and alternate endings. Its two violins, viola, and continuo bass can be muted independently. The local staff images are cropped reproductions of the credited editions. [Organ edition](https://www.mutopiaproject.org/ftp/BachJS/BWV565/ToccataFugue/ToccataFugue.ly) · [Air edition](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=242)

## Brandenburg Concerto No. 5

The opening Allegro uses Geof Pawlicki’s public-domain MusicXML edition. Playback follows the edition’s 120 quarter notes per minute. Trills and mordents are shown in the notation and left unembellished in playback. Seven controls cover flute, solo violin, ripieno violin, viola, cello, violone, and the two harpsichord staves. The violone line uses a modern contrabass sample. Measure 154 starts the harpsichord cadenza, and the ensemble returns in measure 219. [Score edition](https://www.gutenberg.org/ebooks/5190) · [Concerto sample credits](bach-data/concerto-credits.txt)


## The Well-Tempered Clavier, Book I

The catalog lists BWV 846–869 in the order of the book, with a separate player for each movement. The C-major Prelude and D-minor Fugue retain their Mutopia editions and original links. The other 46 movements use Knute Snortum’s LilyPond edition, release v0.3. Each player links to the individual source and full engraved PDF. [Edition and releases](https://github.com/ksnortum/bach-well-tempered-1/releases/tag/v0.3)

The timing and pitch arrays, now in `pieces/bach-well-tempered-clavier-1/`, were compiled from the edition’s written parts on separate MIDI tracks. Playback uses the edition’s tempo changes and the local sampled piano. Written-out ornaments play as encoded. Ornament symbols and dynamic markings remain visible in the engraving. The score images in `notation/bach/wtc1/` are cropped reproductions of the individual PDFs. The new score data and engraving crops are adaptations of Knute Snortum’s work, distributed under CC BY-SA 4.0. [Source and license statement](https://github.com/ksnortum/bach-well-tempered-1/tree/v0.3#license) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
