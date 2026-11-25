"""Cut engraved piano scores into pages the player can follow measure by measure.

For each movement of pieces/<folder>/ that catalog.js gives a PDF edition (see `sources`
there), this renders the PDF, finds every staff system and barline, and writes

    music/notation/<folder>/<movement index>-<page>.webp   the rendered pages
    music/notation/<folder>/<movement index>.js            ENGRAVING = {width, pdf, pickup, systems, bars, play}

systems are {file, imageHeight, y, h} and bars are [system, x, width] in print order, all in
pixels. play lists what is heard, in order: [beat (quarter notes), index into bars], so a
repeated passage points at the same printed measures twice.

A movement is skipped, with a message, when the printed measures cannot be matched to the
measures in measures.js (one literal repeat is understood; anything else is not). Nothing is
written for it and its page shows no sheet music. --debug saves each page with the detected
systems and barlines drawn on it, next to the downloaded PDF.

Needs: Ghostscript (gs), cwebp, and Python with numpy and pillow.
Usage: python music/engrave.py --work <scratch dir for downloads> <folder> [<folder> ...]
"""
import argparse
import json
import subprocess
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent

# Where measures.js and the print disagree, keyed by (folder, movement index).
# LONG: a printed measure (index in print order, a pickup counting as 0) that measures.js
# splits into several, as it does with an unmeasured cadenza.
LONG = {
    ('chopin-three-nocturnes-op-9', 1): {32: 4},
    ('chopin-three-nocturnes-op-9', 2): {155: 8},
}
# PICKUP: quarter notes before the first barline, where measures.js starts measure 1 at the
# pickup and so draws every barline early.
PICKUP = {
    ('chopin-24-preludes-op-28', 6): 1,
}
PIECES = HERE / 'pieces'
DPI = 150


def runs(flags):
    """[start, end) of each run of True values."""
    edges = np.flatnonzero(np.diff(np.concatenate(([0], flags.astype(np.int8), [0]))))
    return list(zip(edges[::2], edges[1::2]))


def find_systems(dark):
    """Pairs of five-line staves on one page: [(top line, bottom line, rows of all ten lines), ...]."""
    height, width = dark.shape
    ink = dark.sum(axis=1)
    # Staff lines are by far the longest runs of ink; busy rows of ledger lines reach about half.
    lines = [(a + b - 1) / 2 for a, b in runs(ink > max(width * 0.4, ink.max() * 0.7))]
    # Keep only runs of five evenly spaced lines; long beams and hairpins are not staves.
    gaps = sorted(lines[i + 1] - lines[i] for i in range(len(lines) - 1))
    space = gaps[len(gaps) // 3] if gaps else 0
    staves, i = [], 0
    while i + 4 < len(lines):
        steps = [lines[i + k + 1] - lines[i + k] for k in range(4)]
        if all(abs(step - space) <= space * 0.25 for step in steps):
            staves.append(lines[i:i + 5])
            i += 5
        else:
            i += 1
    if len(staves) % 2:
        raise ValueError('expected two staves per system, found %d staves' % len(staves))
    return [(int(staves[i][0]), int(round(staves[i + 1][4])) + 1, staves[i] + staves[i + 1])
            for i in range(0, len(staves), 2)]


def find_barlines(dark, top, bottom, lines, accepted=()):
    """Columns inked from the top staff line to the bottom one; close pairs (double bars) merge.

    Returns the positions, the right end of the staff, whether the last barline closes the
    system (a long measure, such as a cadenza, can run on into the next system), and the
    doubtful columns as [(column, score)]. Text can interrupt a barline, so a column inked for
    most of the height may be one; but so may two stems that happen to line up. The lower the
    score, the less ink touches the column. A doubtful column counts only if listed in `accepted`.
    """
    band = dark[top:bottom]
    height = bottom - top
    inked = band.sum(axis=0)
    space = height / 30  # roughly one staff space
    between = np.ones(height, dtype=bool)
    for line in lines:
        between[max(0, int(line) - top - 2):int(line) - top + 3] = False
    left, right = np.flatnonzero(dark[top])[[0, -1]]
    marks, doubtful = [], []
    for a, b in runs(inked >= height * 0.86):
        if inked[a:b].max() < height * 0.97:
            beside = np.concatenate((band[between, max(0, a - 4):max(0, a - 1)], band[between, b + 1:b + 4]), axis=1)
            # Nothing but the system's own lines stands at either end of the staff.
            if a - left > space * 2 and right - b > space * 2 and int(a) not in accepted:
                doubtful.append((int(a), float(beside.mean())))
                continue
        if marks and a - marks[-1][1] < space * 2:
            marks[-1][1] = b
        else:
            marks.append([a, b])
    if not marks:
        marks = [[left, left + 1]]
    return [int((a + b) // 2) for a, b in marks], right, right - marks[-1][1] < space * 2, doubtful


def signatures(notes, tempo, bars):
    """What sounds in each measure, for spotting a repeat: a set of (position, pitch)."""
    def beat(seconds):
        at = [anchor for anchor in tempo if anchor[0] <= seconds][-1]
        return at[1] + (seconds - at[0]) * at[2] / 60
    starts = [bar[0] for bar in bars]
    found = [set() for _ in bars]
    for seconds, pitch, *_ in notes:
        position = beat(seconds)
        index = max(0, int(np.searchsorted(starts, position + 0.01)) - 1)
        found[index].add((round((position - starts[index]) * 12), pitch))
    return [frozenset(notes) for notes in found]


def unfold(heard, printed, long):
    """Printed measure for each measure heard.

    `long` maps a printed measure to the number of heard measures it spans. Beyond that, one
    literal repeat is understood, with or without a first ending.
    """
    spans = [index for index in range(printed) for _ in range(long.get(index, 1))]
    count = len(heard)
    if count == len(spans):
        return spans
    length = count - printed
    if length >= 4 and not long:  # a shorter match is more likely a missed barline than a repeat
        for gap in range(length, count - length + 1):
            for a in range(count - gap - length + 1):
                if heard[a:a + length] == heard[a + gap:a + gap + length] and all(heard[a:a + length]):
                    again = a + gap
                    return [i if i < again else a + i - again if i < again + length else i - length
                            for i in range(count)]
    raise ValueError('found %d printed measures for the %d heard' % (printed, count))


def engrave(folder, index, url, notes, notation, work, debug):
    pdf = work / folder / (str(index) + '.pdf')
    pdf.parent.mkdir(parents=True, exist_ok=True)
    if not pdf.exists():
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        pdf.write_bytes(urllib.request.urlopen(request).read())
    for old in pdf.parent.glob('%d-*.png' % index):
        old.unlink()
    subprocess.run(['gs', '-q', '-dSAFER', '-dNOPAUSE', '-dBATCH', '-sDEVICE=pnggray', '-r%d' % DPI,
                    '-dTextAlphaBits=4', '-dGraphicsAlphaBits=4',
                    '-sOutputFile=' + str(pdf.parent / ('%d-%%d.png' % index)), str(pdf)], check=True)
    pages = sorted(pdf.parent.glob('%d-*.png' % index), key=lambda p: int(p.stem.split('-')[1]))

    long = LONG.get((folder, index), {})
    if (folder, index) in PICKUP:
        # Redraw the barlines of measures.js one pickup later.
        old = notation['bars']
        pickup, length = PICKUP[(folder, index)], old[1][0] - old[0][0]
        starts = np.arange(pickup, old[-1][0] + length - 0.001, length)
        notation = dict(notation, bars=[[0.0, 0] + old[0][2:]] + [[float(start), k + 1] + old[0][2:]
                                                                 for k, start in enumerate(starts)])
    heard = len(notation['bars']) - sum(count - 1 for count in long.values())
    accepted = {}  # (page, top of system) -> doubtful columns to count as barlines
    for attempt in range(2):
        systems, bars, images, doubtful = [], [], [], []
        open_measure = False
        for page_number, page in enumerate(pages, 1):
            image = Image.open(page).convert('L')
            dark = np.asarray(image) < 150
            faint = np.asarray(image) < 215  # a hairline barline can fall between two pixel columns
            found = find_systems(dark)
            if not found:
                continue
            gaps = [found[i + 1][0] - found[i][1] for i in range(len(found) - 1)]
            margin = int(0.55 * (min(gaps) if gaps else found[0][1] - found[0][0]))
            # Cut between systems along the emptiest row, as near the middle of the gap as possible.
            ink = dark.sum(axis=1)
            cuts = []
            for (_, above, _), (below, _, _) in zip(found, found[1:]):
                rows = np.arange(above, below)
                cuts.append(int(rows[np.lexsort((np.abs(rows - (above + below) / 2), ink[above:below]))[0]]))
            sketch = image.convert('RGB') if debug else None
            for i, (top, bottom, lines) in enumerate(found):
                y0 = cuts[i - 1] if i else max(0, top - int(margin * 1.8))  # room for a tempo marking
                y1 = cuts[i] if i + 1 < len(found) else min(image.height, bottom + margin)
                key = (page_number, top)
                x, end, closed, maybe = find_barlines(faint, top, bottom, lines, accepted.get(key, ()))
                doubtful += [(score, key, column) for column, score in maybe]
                edges = x if closed else x + [int(end)]
                for k in range(len(edges) - 1):
                    # The rest of a measure left open by the previous system is not a new measure.
                    if not (k == 0 and open_measure):
                        bars.append([len(systems), edges[k], edges[k + 1] - edges[k]])
                open_measure = not closed
                systems.append({'file': '%s/%d-%d.webp' % (folder, index, page_number),
                                'imageHeight': image.height, 'y': int(y0), 'h': int(y1 - y0)})
                if sketch:
                    from PIL import ImageDraw
                    draw = ImageDraw.Draw(sketch)
                    draw.rectangle([2, y0, image.width - 3, y1], outline=(0, 140, 255))
                    for position in x:
                        draw.line([position, top - 12, position, bottom + 12], fill=(255, 0, 0), width=3)
            if sketch:
                sketch.save(page.with_name('debug-' + page.name))
            images.append((page_number, page, image.width))
        # Fewer barlines than measures heard: the cleanest doubtful columns make up the difference.
        missing = heard - len(bars)
        best = sorted(doubtful)[:max(0, missing)]
        if attempt or missing <= 0 or len(best) < missing or best[-1][0] > 0.07:
            break
        for _, key, column in best:
            accepted.setdefault(key, set()).add(column)

    order = unfold(signatures(notes, notation['tempo'], notation['bars']), len(bars), long)
    play = [[bar[0], printed] for bar, printed in zip(notation['bars'], order)]

    out = HERE / 'notation' / folder
    out.mkdir(parents=True, exist_ok=True)
    for page_number, page, _ in images:
        subprocess.run(['cwebp', '-quiet', '-lossless', str(page), '-o',
                        str(out / ('%d-%d.webp' % (index, page_number)))], check=True)
    data = {'width': images[0][2], 'pdf': url, 'pickup': notation['bars'][0][1] == 0,
            'systems': systems, 'bars': bars, 'play': play}
    (out / ('%d.js' % index)).write_text(
        '// Generated by music/engrave.py from the edition at `pdf`. Do not edit.\n'
        'const ENGRAVING = ' + json.dumps(data, separators=(',', ':')) + ';\n', encoding='utf-8')
    return len(bars), len(images), len(play) - len(bars)


def movements(folder):
    """[(name, notes, notation)] from notes.js and measures.js, read with node."""
    script = ('const fs=require("fs");const d=process.argv[1]+"/";'
              'const m=fs.existsSync(d+"measures.js")?fs.readFileSync(d+"measures.js","utf8"):"";'
              'const score=new Function(fs.readFileSync(d+"notes.js","utf8")+";"+m+";return score")();'
              'console.log(JSON.stringify(score.movements.map(p=>[p.name,p.notes,p.notation??null])))')
    return json.loads(subprocess.run(['node', '-e', script, str(PIECES / folder)],
                                     check=True, capture_output=True, text=True).stdout)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--work', required=True, type=Path)
    parser.add_argument('--debug', action='store_true')
    parser.add_argument('folders', nargs='+')
    args = parser.parse_args()
    # {folder: {movement index: PDF}} from the score entries of catalog.js.
    script = ('const out={};for(const c of Object.values(require(process.argv[1])))'
              'for(const [f,s] of Object.entries(c.sources??{})){out[f]={};'
              '(Array.isArray(s.score[0])?s.score:[s.score]).forEach((e,i,a)=>{if(e[3])out[f][i]=e[3]});'
              'if(!Array.isArray(s.score[0])&&s.score[3])out[f].all=s.score[3]}'
              'console.log(JSON.stringify(out))')
    found = json.loads(subprocess.run(['node', '-e', script, str(HERE / 'catalog.js')],
                                      check=True, capture_output=True, text=True).stdout)
    pdfs = {folder: {int(k): v for k, v in entry.items() if k != 'all'} | (
        {0: entry['all']} if 'all' in entry else {}) for folder, entry in found.items()}
    for folder in args.folders:
        parts = movements(folder)
        for index, (name, notes, notation) in enumerate(parts):
            url = pdfs.get(folder, {}).get(index)
            label = '%s %d (%s)' % (folder, index, name)
            if not url or not notation:
                print('skip  ' + label + ': ' + ('no measure data' if url else 'no PDF edition in catalog.js'))
                continue
            try:
                found, count, repeated = engrave(folder, index, url, notes, notation, args.work, args.debug)
                print('ok    %s: %d measures on %d pages%s' % (
                    label, found, count, ', %d more heard than printed' % repeated if repeated else ''))
            except ValueError as error:
                print('FAIL  ' + label + ': ' + str(error))


main()
