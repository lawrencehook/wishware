"""Turn score MIDI files (Mutopia, the ASAP dataset) and Humdrum scores into pieces/<folder>/notes.js and measures.js.

imports.json lists, per folder, the movements in order:
    {"<folder>": [{"name": ..., "midi": <url, or zip url + "#" + member, or the url of a .krn score>,
                   "pickup": <quarter notes>,
                   "upper": [<note tracks that are the upper hand, counted from 0>],
                   "speed": <factor, for a source whose tempo is plainly wrong>,
                   "tempo": {<quarter note where a tempo mark stands>: <corrected quarter notes per minute>},
                   "short": {<quarter note where a measure starts>: <its length, if not a full measure>},
                   "order": [[<from>, <to>], ...]}]}
pickup, upper, speed, tempo, short and order are optional. short is for a first ending that
leaves out the upbeat it repeats to. order lists the passages to play, in quarter
notes of the edition played once through (to is null at the end); ../engrave.py --repeats writes
it from the repeat signs of the print. A Mutopia MIDI does not say that it opens with a partial
measure, so without "pickup" the edition's LilyPond source is searched for \\partial. Without
"upper", tracks are sorted into hands by their names, or failing that by how high they lie.

Needs: Python with mido, and music21 for a .krn score. Usage (from the repo root):
    python music/tools/midi.py --work <scratch dir for downloads> [<folder> ...]
"""
import argparse
import io
import json
import re
import urllib.request
import zipfile
from fractions import Fraction
from pathlib import Path

import mido

HERE = Path(__file__).resolve().parent
PIECES = HERE.parent / 'pieces'
UPPER = re.compile(r'upper|right|rh\b|treble|\bup\b|droite|sopran|voice|vocal|melody|\bone\b|dessus|high|top|manod|^md|primo|mainUn', re.I)
LOWER = re.compile(r'lower|left|lh\b|bass|down|gauche|\btwo\b|low|bottom|manos|^mg|^ms|pedal|mainDeux', re.I)


def fetch(url, work):
    file = work / re.sub(r'[^A-Za-z0-9._-]+', '_', url.split('://')[1])
    if not file.exists():
        request = urllib.request.Request(url.replace(' ', '%20'), headers={'User-Agent': 'score-import'})
        file.write_bytes(urllib.request.urlopen(request, timeout=60).read())
    return file.read_bytes()


def midi_bytes(source, work):
    url, _, member = source.partition('#')
    data = fetch(url, work) if '://' in url else Path(url).read_bytes()
    if member:
        archive = zipfile.ZipFile(io.BytesIO(data))
        data = archive.read(next(name for name in archive.namelist() if name.endswith(member)))
    return data


def lilypond_pickup(source, work):
    """Quarter notes of the first \\partial in the edition's source, or 0."""
    url, _, member = source.partition('#')
    if 'mutopiaproject.org' not in url:
        return 0
    stem = re.sub(r'(-mids\.zip|\.mid)$', '', url)
    texts = []
    try:
        texts.append(fetch(stem + '.ly', work).decode('utf8', 'replace'))
    except Exception:
        try:
            archive = zipfile.ZipFile(io.BytesIO(fetch(stem + '-lys.zip', work)))
            names = [name for name in archive.namelist() if name.endswith(('.ly', '.ily'))]
            own = [name for name in names if Path(name).stem.startswith(Path(member).stem)]
            texts = [archive.read(name).decode('utf8', 'replace') for name in own or names]
        except Exception:
            return None
    found = set()
    for text in texts:
        text = re.sub(r'%.*', '', text)
        # A partial far into the music is a mid-piece upbeat, not the opening.
        for match in re.finditer(r'\\partial\s+(\d+)(\.*)(?:\s*\*\s*(\d+)(?:/(\d+))?)?', text):
            length = Fraction(4, int(match[1]))
            length *= 2 - Fraction(1, 2 ** len(match[2]))
            length *= Fraction(int(match[3] or 1), int(match[4] or 1))
            found.add(length)
            break
    return float(max(found)) if found else 0


def convert(entry, work):
    data = midi_bytes(entry['midi'], work)
    if entry['midi'].endswith('.krn'):
        # A Humdrum score: kern.py turns it into MIDI and reads its upbeat, tempo and repeats.
        import sys
        sys.path.insert(0, str(HERE))
        import kern
        data, found = kern.read(data.decode('utf8'))
        entry = {**found, **entry}
    midi = mido.MidiFile(file=io.BytesIO(data))
    tpq = midi.ticks_per_beat
    tempos, meters, keys, tracks = [], [], [], []
    for track in midi.tracks:
        tick, sounding, notes, name = 0, {}, [], ''
        for message in track:
            tick += message.time
            if message.type == 'set_tempo':
                tempos.append((tick, message.tempo))
            elif message.type == 'time_signature':
                meters.append((tick, message.numerator, message.denominator))
            elif message.type == 'key_signature':
                keys.append((tick, message.key))
            elif message.type == 'track_name' and not name:
                name = message.name
            elif message.type in ('note_on', 'note_off'):
                key = (message.channel, message.note)
                if message.type == 'note_on' and message.velocity:
                    sounding.setdefault(key, []).append((tick, message.velocity))
                elif sounding.get(key):
                    start, velocity = sounding[key].pop(0)
                    if tick > start:
                        notes.append((start, message.note, tick - start, velocity))
        if notes:
            tracks.append((name, notes))

    retempo = {float(beat): 60e6 / bpm for beat, bpm in entry.get('tempo', {}).items()}
    tempos = sorted((tick, retempo.get(tick / tpq, tempo) / entry.get('speed', 1)) for tick, tempo in dict(tempos).items()) or [(0, 500000)]
    if tempos[0][0] > 0:
        tempos.insert(0, (0, tempos[0][1]))
    meters = sorted({tick: (n, d) for tick, n, d in meters}.items()) or [(0, (4, 4))]
    sharps = lambda name: (['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'].index(name) if name in ('C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#')
                           else -['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'].index(name))
    relative = {'A': 'C', 'E': 'G', 'B': 'D', 'F#': 'A', 'C#': 'E', 'G#': 'B', 'D#': 'F#', 'A#': 'C#',
                'D': 'F', 'G': 'Bb', 'C': 'Eb', 'F': 'Ab', 'Bb': 'Db', 'Eb': 'Gb', 'Ab': 'Cb'}
    keys = sorted({tick: sharps(relative[key[:-1]] if key.endswith('m') else key) for tick, key in keys}.items()) or [(0, 0)]

    # Hands.
    upper = entry.get('upper')
    if upper is None:
        named = [bool(UPPER.search(n)) - bool(LOWER.search(n)) for n, _ in tracks]
        if len(tracks) == 2 and 0 in named:
            upper = [0]
        elif all(named) and len(set(named)) == 2:
            upper = [i for i, side in enumerate(named) if side > 0]
        else:
            means = [sum(note[1] for note in notes) / len(notes) for _, notes in tracks]
            middle = (max(means) + min(means)) / 2
            upper = [i for i, mean in enumerate(means) if mean >= middle]
    if len(tracks) == 1:
        notes = [(start, pitch, length, 0 if pitch >= 60 else 1, velocity) for start, pitch, length, velocity in tracks[0][1]]
    else:
        notes = [(start, pitch, length, 0 if i in upper else 1, velocity)
                 for i, (_, part) in enumerate(tracks) for start, pitch, length, velocity in part]
    print('      tracks:', ', '.join('%s=%s' % (name or '?', 'upper' if i in upper else 'lower') for i, (name, _) in enumerate(tracks)))
    notes.sort()

    pickup = entry.get('pickup')
    if pickup is None:
        pickup = lilypond_pickup(entry['midi'], work)
        if pickup is None:
            print('      no LilyPond source found; assuming no pickup')
            pickup = 0

    def measures(meters, keys, end, short={}):
        """[[quarter, number, meter, key]] for the measures up to `end` quarter notes.
        `short` gives the length of a measure, by the quarter note it starts at, that is not a full one."""
        bars, number = [], 1
        if pickup:
            bars.append([0, 0, '%d/%d' % meters[0][1], keys[0][1]])
        for i, (tick, (n, d)) in enumerate(meters):
            beat = max(tick / tpq, pickup) if i == 0 else tick / tpq
            stop = meters[i + 1][0] / tpq if i + 1 < len(meters) else end
            length = n * 4 / d
            if i == 0 and not pickup and len(meters) > 1 and abs(stop - beat - length) < 1e-6 and length < meters[1][1][0] * 4 / meters[1][1][1]:
                number = 0  # a notation program writes a pickup as a short first measure
            while beat < stop - 1e-6:
                key = next(k for t, k in reversed(keys) if t / tpq <= beat + 1e-6) if keys[0][0] / tpq <= beat + 1e-6 else keys[0][1]
                bars.append([round(beat, 4), number, '%d/%d' % (n, d), key])
                number += 1
                beat += short.get(round(beat, 4), length)
        return bars

    end = max(start + length for start, _, length, _, _ in notes)
    bars = measures(meters, keys, end / tpq, {float(beat): length for beat, length in entry.get('short', {}).items()})
    linear = None
    if entry.get('order'):
        # Play the passages of the edition in the order given, as its repeat signs direct.
        spans, moved = [], 0
        for begin, finish in entry['order']:
            begin, finish = round(begin * tpq), end if finish is None else round(finish * tpq)
            if finish > begin:
                spans.append((begin, finish, moved))
                moved += finish - begin

        def marks_through(events):
            out = []
            for begin, finish, moved in spans:
                held = [value for tick, value in events if tick <= begin][-1:] or [events[0][1]]
                for tick, value in [(begin, held[0])] + [event for event in events if begin < event[0] < finish]:
                    if not out or out[-1][1] != value:
                        out.append((tick - begin + moved, value))
            return out

        once = notes
        notes = []
        for k, (begin, finish, moved) in enumerate(spans):
            joined = k + 1 < len(spans) and spans[k + 1][0] == finish
            for start, pitch, length, hand, velocity in once:
                if begin <= start < finish:
                    # A note held over a repeat sign stops there unless the music runs straight on.
                    notes.append((start - begin + moved, pitch, length if joined else min(length, finish - start), hand, velocity))
        notes.sort()
        tempos, meters, keys = marks_through(tempos), marks_through(meters), marks_through(keys)
        end = max(start + length for start, _, length, _, _ in notes)
        starts = [bar[0] for bar in bars]
        bars = measures(meters, keys, end / tpq)
        linear = []
        for bar in bars:
            begin, _, moved = next(span for span in reversed(spans) if span[2] <= round(bar[0] * tpq))
            beat = (round(bar[0] * tpq) - moved + begin) / tpq
            linear.append(max(i for i, start in enumerate(starts) if start <= beat + 1e-6))

    # Seconds at each tempo change, then seconds at any tick.
    marks, seconds = [], 0.0
    for i, (tick, tempo) in enumerate(tempos):
        if i:
            seconds += (tick - tempos[i - 1][0]) / tpq * tempos[i - 1][1] / 1e6
        marks.append((tick, seconds, tempo))

    def at(tick):
        mark = next(m for m in reversed(marks) if m[0] <= tick)
        return mark[1] + (tick - mark[0]) / tpq * mark[2] / 1e6

    rows = [[round(at(start), 3), pitch, round(at(start + length) - at(start), 3), hand, velocity]
            for start, pitch, length, hand, velocity in notes]
    tempo = [[round(s, 6), round(tick / tpq, 4), round(60e6 / t, 1)] for tick, s, t in marks]
    notation = {'bars': bars, 'tempo': tempo}
    if linear:
        notation['linear'] = linear  # for each measure heard, its number in the edition played once through
    return {'name': entry['name'], 'notes': rows}, notation


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--work', required=True, type=Path)
    parser.add_argument('folders', nargs='*')
    args = parser.parse_args()
    args.work.mkdir(parents=True, exist_ok=True)
    imports = json.loads((HERE / 'imports.json').read_text())
    for folder in args.folders or imports:
        print(folder)
        movements, notations = [], []
        for entry in imports[folder]:
            print('  ', entry['name'])
            movement, notation = convert(entry, args.work)
            seconds = max(row[0] + row[2] for row in movement['notes'])
            print('      %d notes, %d measures, %d:%02d, pickup %s' % (
                len(movement['notes']), len(notation['bars']), seconds // 60, seconds % 60, notation['bars'][0][1] == 0))
            movements.append(movement)
            notations.append(notation)
        target = PIECES / folder
        target.mkdir(exist_ok=True)
        dump = lambda value: json.dumps(value, ensure_ascii=False, separators=(',', ':'))
        (target / 'notes.js').write_text('const score = ' + dump({'movements': movements}) + ';\n')
        (target / 'measures.js').write_text(''.join(
            'score.movements[%d].notation = %s;\n' % (i, dump(notation)) for i, notation in enumerate(notations)))


if __name__ == '__main__':
    main()
