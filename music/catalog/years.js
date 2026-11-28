// Composition (or first publication, where composition date is uncertain) year for each work folder.
// Used by music/build.js to power the "Year composed" and "Composer's age" axes in music/atlas.html.
// Multi-year collections map movement index -> year (with optional `all` fallback).
// Collections whose individual dates are historically unknown (e.g. Scarlatti K. 31–555, Handel Aylesford Pieces)
// are intentionally omitted rather than guessed.
module.exports = {
    // Johann Sebastian Bach (1685–1750)
    'bach-brandenburg-concerto-no-5': 1721,
    'bach-toccata-and-fugue-bwv-565': 1708,
    'bach-air-bwv-1068': 1730,
    'bach-cello-suite-no-1': 1720,
    'bach-inventions': 1723,
    'bach-sinfonias': 1723,
    'bach-well-tempered-clavier-1': 1722,

    // Domenico Scarlatti (1685–1757) — Essercizi per gravicembalo (K. 1–30), published in London 1738
    'scarlatti-sonata-k-1': 1738,
    'scarlatti-sonata-k-9': 1738,
    'scarlatti-sonata-k-11': 1738,
    'scarlatti-sonata-k-13': 1738,
    'scarlatti-sonata-k-20': 1738,
    'scarlatti-sonata-k-25': 1738,
    'scarlatti-sonata-k-27': 1738,

    // George Frideric Handel (1685–1759)
    'handel-harmonious-blacksmith-hwv-430': 1720,
    'handel-sarabande-hwv-437': 1705,
    'handel-passacaglia-hwv-432': 1720,
    'handel-sonatina-hwv-585': 1722,
    'handel-ombra-mai-fu': 1738,
    'handel-arrival-of-the-queen-of-sheba': 1749,
    'handel-hallelujah-chorus': 1741,

    // Joseph Haydn (1732–1809)
    'haydn-sonata-hob-xvi-6': 1760,
    'haydn-sonata-hob-xvi-7': 1760,
    'haydn-sonata-hob-xvi-8': 1760,
    'haydn-sonata-hob-xvi-9': 1760,
    'haydn-sonata-hob-xvi-27': 1776,
    'haydn-sonata-hob-xvi-28': 1776,
    'haydn-sonata-hob-xvi-31': 1776,
    'haydn-sonata-hob-xvi-32': 1776,
    'haydn-sonata-hob-xvi-33': 1778,
    'haydn-sonata-hob-xvi-35': 1780,
    'haydn-sonata-hob-xvi-39': 1780,
    'haydn-sonata-hob-xvi-40': 1784,
    'haydn-sonata-hob-xvi-43': 1773,
    'haydn-sonata-hob-xvi-46': 1768,
    'haydn-sonata-hob-xvi-48': 1789,
    'haydn-sonata-hob-xvi-49': 1790,
    'haydn-sonata-hob-xvi-50': 1794,
    'haydn-surprise-symphony-andante': 1791,
    'haydn-emperor-hymn': 1797,

    // Wolfgang Amadeus Mozart (1756–1791)
    'mozart-sonata-k-279': 1774,
    'mozart-sonata-k-280': 1774,
    'mozart-sonata-k-281': 1774,
    'mozart-sonata-k-282': 1774,
    'mozart-sonata-k-283': 1774,
    'mozart-sonata-k-284': 1775,
    'mozart-sonata-k-309': 1777,
    'mozart-sonata-k-310': 1778,
    'mozart-sonata-k-311': 1777,
    'mozart-sonata-k-330': 1783,
    'mozart-piano-sonatas': 1783, // K. 331
    'mozart-sonata-k-332': 1783,
    'mozart-sonata-k-333': 1783,
    'mozart-sonata-k-457': 1784,
    'mozart-sonata-k-545': 1788,
    'mozart-sonata-k-570': 1789,
    'mozart-sonata-k-576': 1789,
    'mozart-variations-on-ah-vous-dirai-je-maman-k-265': 1781,
    'mozart-fantasia-in-d-minor-k-397': 1782,
    'mozart-fantasia-in-c-minor-k-475': 1785,
    'mozart-eine-kleine-nachtmusik': 1787,
    'mozart-symphony-no-40-theme': 1788,
    'mozart-piano-concerto-no-21-andante': 1785,
    'mozart-lacrimosa': 1791,

    // Ludwig van Beethoven (1770–1827)
    'beethoven-sonata-1': 1795,
    'beethoven-sonata-2': 1795,
    'beethoven-sonata-3': 1795,
    'beethoven-sonata-4': 1797,
    'beethoven-sonata-5': 1798,
    'beethoven-sonata-6': 1798,
    'beethoven-sonata-7': 1798,
    'beethoven-piano-sonatas': 1798, // Op. 13, Pathétique
    'beethoven-sonata-9': 1798,
    'beethoven-sonata-10': 1799,
    'beethoven-sonata-11': 1800,
    'beethoven-sonata-12': 1801,
    'beethoven-sonata-13': 1801,
    'beethoven-sonata-14': 1801,
    'beethoven-sonata-15': 1801,
    'beethoven-sonata-16': 1802,
    'beethoven-sonata-17': 1802,
    'beethoven-sonata-18': 1802,
    'beethoven-sonata-19': 1797,
    'beethoven-sonata-20': 1796,
    'beethoven-sonata-21': 1804,
    'beethoven-sonata-22': 1804,
    'beethoven-sonata-23': 1805,
    'beethoven-sonata-24': 1809,
    'beethoven-sonata-25': 1809,
    'beethoven-sonata-26': 1810,
    'beethoven-sonata-27': 1814,
    'beethoven-sonata-28': 1816,
    'beethoven-sonata-29': 1818,
    'beethoven-sonata-30': 1820,
    'beethoven-sonata-31': 1821,
    'beethoven-sonata-32': 1822,
    'beethoven-symphony-no-5-piano': 1808,
    'beethoven-ode-to-joy': 1824,
    'beethoven-fur-elise-woo-59': 1810,
    'beethoven-6-bagatelles-op-126': 1824,
    'beethoven-rage-over-a-lost-penny-op-129': 1795,

    // Franz Schubert (1797–1828)
    'schubert-four-impromptus-d-899': 1827,
    'schubert-impromptus-d-935-nos-1-and-3': 1827,
    'schubert-impromptu-d-935-no-2': 1827,
    'schubert-impromptu-d-935-no-4': 1827,
    'schubert-piano-sonata-in-a-d-664': 1819,
    'schubert-piano-sonata-d-960': 1828,
    'schubert-piano-sonata-d-850': 1825,
    'schubert-piano-sonata-d-784': 1823,
    'schubert-moment-musical-no-1-d-780': 1828,
    'schubert-moment-musical-no-2-d-780': 1828,
    'schubert-moment-musical-no-3-d-780': 1823,
    'schubert-moment-musical-no-4-d-780': 1828,
    'schubert-moment-musical-no-5-d-780': 1828,
    'schubert-moment-musical-no-6-d-780': 1824,
    'schubert-erlkonig-d-328': 1815,
    'schubert-standchen-d-957': 1828,
    'schubert-wanderer-fantasy-d-760': 1822,
    'schubert-piano-sonata-in-g-d-894': 1826,
    'schubert-ave-maria-d-839': 1825,

    // Felix Mendelssohn (1809–1847)
    'mendelssohn-song-without-words-op-19-no-1': 1830,
    'mendelssohn-song-without-words-op-19-no-2': 1830,
    'mendelssohn-song-without-words-op-19-no-3': 1830,
    'mendelssohn-song-without-words-op-19-no-4': 1829,
    'mendelssohn-lieder-ohne-worte-songs-without-words': {
        0: 1830, // Op. 19 No. 5
        1: 1830, // Op. 19 No. 6
        2: 1834, // Op. 30 No. 6
        3: 1841, // Op. 53 No. 5
        4: 1834, // Op. 85 No. 1
        5: 1845, // Op. 102 No. 3
    },
    'mendelssohn-song-without-words-op-30-no-1': 1834,
    'mendelssohn-song-without-words-op-30-no-2': 1830,
    'mendelssohn-song-without-words-op-30-no-3': 1834,
    'mendelssohn-song-without-words-op-30-no-4': 1834,
    'mendelssohn-song-without-words-op-30-no-5': 1833,
    'mendelssohn-song-without-words-op-62-no-3': 1843,
    'mendelssohn-song-without-words-op-62-no-4': 1843,
    'mendelssohn-song-without-words-op-62-no-5': 1842,
    'mendelssohn-spring-song-op-62-no-6': 1842,
    'mendelssohn-scherzo-op-16-no-2': 1829,
    'mendelssohn-wedding-march': 1842,

    // Frédéric Chopin (1810–1849)
    'chopin-four-ballades': { 0: 1835, 1: 1839, 2: 1841, 3: 1842 },
    'chopin-scherzos-nos-13': { 0: 1832, 1: 1837, 2: 1839 },
    'chopin-piano-sonata-no-2-op-35': 1839,
    'chopin-three-nocturnes-op-9': 1832,
    'chopin-etudes-op-10-selections': {
        0: 1830, // Op. 10 No. 1
        1: 1830, // Op. 10 No. 2
        2: 1832, // Op. 10 No. 3
        3: 1832, // Op. 10 No. 4
        4: 1830, // Op. 10 No. 5
        5: 1832, // Op. 10 No. 7
        6: 1829, // Op. 10 No. 8
        7: 1829, // Op. 10 No. 10
        8: 1831, // Op. 10 No. 12
    },
    'chopin-etudes-op-25-selections': {
        0: 1836, // Op. 25 No. 1
        1: 1836, // Op. 25 No. 2
        2: 1834, // Op. 25 No. 4
        3: 1834, // Op. 25 No. 5
        4: 1834, // Op. 25 No. 8
        5: 1834, // Op. 25 No. 10
        6: 1836, // Op. 25 No. 11
        7: 1836, // Op. 25 No. 12
    },
    'chopin-24-preludes-op-28': 1839,
    'chopin-polonaise-fantaisie-op-61': 1846,
    'chopin-nocturne-in-c-sharp-minor-op-posth': 1830,
    'chopin-mazurkas': 1833, // Op. 17 No. 4
    'chopin-heroic-polonaise-op-53': 1842,
    'chopin-berceuse-op-57': 1844,
    'chopin-barcarolle-op-60': 1846,
    'chopin-minute-waltz-op-64-no-1': 1847,
    'chopin-fantaisie-impromptu-op-66': 1834,

    // Robert Schumann (1810–1856)
    'schumann-kinderszenen': 1838,
    'schumann-kreisleriana-selections': 1838,
    'schumann-kreisleriana-no-8': 1838,
    'schumann-widmung-op-25-no-1': 1840,
    'schumann-toccata-op-7': 1832,
    'robert-schumann-fantasiestucke-op-12': 1837,
    'schumann-arabeske-op-18': 1839,
    'schumann-romanze-op-28-no-2': 1839,
    'robert-schumann-album-fur-die-jugend-op-68': 1848,
    'schumann-abegg-variations-op-1': 1830,
    'schumann-the-happy-farmer-op-68-no-10': 1848,
    'schumann-knecht-ruprecht-op-68-no-12': 1848,

    // Franz Liszt (1811–1886)
    'liszt-transcendental-etudes-selections': 1851,
    'liszt-wilde-jagd': 1851,
    'liszt-concert-etudes-s-145': 1862,
    'liszt-hungarian-rhapsody-no-2': 1847,
    'liszt-la-campanella': 1851,
    'liszt-paganini-etude-no-1': 1851,
    'liszt-paganini-etude-no-2': 1851,
    'liszt-paganini-etude-no-4': 1851,
    'liszt-paganini-etude-no-5': 1851,
    'liszt-paganini-etude-no-6': 1851,
    'liszt-gondoliera': 1859,
    'liszt-ballade-no-2': 1853,
    'liszt-consolation-no-1': 1850,
    'liszt-consolations-s-172': 1850,
    'liszt-consolation-no-4': 1850,
    'liszt-sonata-in-b-minor': 1853,
    'liszt-hungarian-rhapsody-no-6': 1847,
    'liszt-hungarian-rhapsody-no-9': 1847,
    'liszt-hungarian-rhapsody-no-10': 1847,
    'liszt-hungarian-rhapsody-no-12': 1853,
    'liszt-hungarian-rhapsody-no-15': 1851,
    'liszt-mephisto-waltz-no-1': 1860,
    'liszt-liebestraume-s-541': 1850,
    'liszt-reminiscences-de-don-juan': 1841,

    // Johannes Brahms (1833–1897)
    'brahms-piano-sonata-no-1': 1853,
    'brahms-ballade-op-10-no-1': 1854,
    'brahms-waltzes-op-39': 1865,
    'brahms-wiegenlied-op-49-no-4': 1868,
    'brahms-hungarian-dance-no-1': 1869,
    'brahms-hungarian-dance-no-5': 1869,
    'brahms-rhapsody-op-79-no-1': 1879,
    'brahms-intermezzo-op-116-no-2': 1892,
    'brahms-intermezzo-op-116-no-5': 1892,
    'brahms-intermezzo-op-116-no-6': 1892,
    'brahms-intermezzo-op-117-no-1': 1892,
    'brahms-intermezzo-op-117-no-2': 1892,
    'brahms-intermezzo-in-a-op-118-no-2': 1893,
    'brahms-rhapsody-op-119-no-4': 1893,

    // Modest Mussorgsky (1839–1881)
    'mussorgsky-pictures-at-an-exhibition': 1874,

    // Pyotr Ilyich Tchaikovsky (1840–1893)
    'tchaikovsky-piano-concerto-no-1-theme': 1875,
    'tchaikovsky-the-seasons-op-37a': 1876,
    'tchaikovsky-swan-lake-theme': 1876,
    'tchaikovsky-dance-of-the-little-swans': 1876,
    'tchaikovsky-children-s-album-op-39': 1878,
    'tchaikovsky-dumka-op-59': 1886,
    'tchaikovsky-dance-of-the-sugar-plum-fairy': 1892,
    'tchaikovsky-nutcracker-march': 1892,
    'tchaikovsky-nutcracker-pas-de-deux': 1892,
    'tchaikovsky-waltz-of-the-flowers': 1892,

    // Edvard Grieg (1843–1907)
    'grieg-lyric-pieces': 1867, // Book I, Op. 12
    'grieg-peer-gynt-suite-no-1': 1875,
    'grieg-anitras-dance': 1875,
    'grieg-morning-mood': 1875,
    'grieg-berceuse-op-38-no-1': 1883,
    'grieg-halling-op-38-no-4': 1883,
    'grieg-butterfly-op-43-no-1': 1886,
    'grieg-solitary-traveller-op-43-no-2': 1886,
    'grieg-little-bird-op-43-no-4': 1886,
    'grieg-to-spring-op-43-no-6': 1886,
    'grieg-album-leaf-op-47-no-2': 1888,
    'grieg-norwegian-march-op-54-no-2': 1891,
    'grieg-march-of-the-trolls-op-54-no-3': 1891,
    'grieg-brooklet-op-62-no-4': 1895,
    'grieg-wedding-day-at-troldhaugen-op-65-no-6': 1896,
    'grieg-once-upon-a-time-op-71-no-1': 1901,
    'grieg-puck-op-71-no-3': 1901,
    'grieg-mountaineers-song-op-73-no-7': 1905,

    // Claude Debussy (1862–1918)
    'debussy-premiere-arabesque': 1888,
    'debussy-deuxieme-arabesque': 1891,
    'debussy-reverie': 1890,
    'debussy-suite-bergamasque': 1890,
    'debussy-prelude-from-pour-le-piano': 1901,
    'debussy-estampes-cd-108': 1903,
    'debussy-reflets-dans-leau': 1905,
    'debussy-children-s-corner-cd-119': 1908,
    'debussy-preludes-livre-1-cd-125': 1910,
    'debussy-la-plus-que-lente': 1910,
    'debussy-preludes-livre-2-cd-131': 1913,

    // Erik Satie (1866–1925)
    'satie-gymnopedie-no-1': 1888,
    'satie-gymnopedie-no-2': 1888,
    'satie-gymnopedie-no-3': 1888,
    'satie-gnossiennes-nos-13': 1890,

    // Sergei Rachmaninoff (1873–1943)
    'rachmaninoff-morceaux-de-fantaisie-op-3': 1892,
    'rachmaninoff-piano-concerto-no-2-theme': 1901,
    'rachmaninoff-preludes-op-23': {
        0: 1903, // Op. 23 No. 1
        1: 1903, // Op. 23 No. 2
        2: 1903, // Op. 23 No. 3
        3: 1903, // Op. 23 No. 4
        4: 1901, // Op. 23 No. 5
        5: 1903, // Op. 23 No. 6
        6: 1903, // Op. 23 No. 8
        7: 1903, // Op. 23 No. 9
        8: 1903, // Op. 23 No. 10
    },
    'rachmaninoff-prelude-op-32-no-1': 1910,
    'rachmaninoff-preludes-op-32-nos-5-and-10': 1910,
    'rachmaninoff-prelude-op-32-no-13': 1910,
    'rachmaninoff-etude-tableau-op-33-no-5': 1911,
    'rachmaninoff-etude-tableau-op-33-no-6': 1911,
    'rachmaninoff-etude-tableau-op-33-no-8': 1911,

    // Gustav Holst (1874–1934)
    'holst-in-the-bleak-midwinter': 1906,
    'holst-jupiter': 1914,
    'holst-i-vow-to-thee-my-country': 1921,

    // Maurice Ravel (1875–1937)
    'ravel-pavane-pour-une-infante-defunte': 1899,
    'ravel-jeux-d-eau-m-30': 1901,
    'ravel-sonatine-m-40': 1905,
    'ravel-noctuelles': 1905,
    'ravel-miroirs-nos-3-and-4': 1905,
    'ravel-ondine': 1908,
    'ravel-gaspard-de-la-nuit-m-55': 1908,
    'ravel-le-gibet': 1908,
    'ravel-scarbo': 1908,
    'ravel-le-tombeau-de-couperin-m-68': 1917,

    // Sergei Prokofiev (1891–1953)
    'prokofiev-toccata-op-11': 1912,
    'prokofiev-visions-fugitives-op-22': 1917,
};
