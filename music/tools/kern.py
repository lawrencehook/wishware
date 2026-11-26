"""Read a Humdrum **kern score for midi.py: its notes as MIDI, and what MIDI cannot carry.

read(text) returns (MIDI bytes of the score played once through, options), where options may
hold the "pickup", "tempo" and "order" that midi.py takes for a movement (see its notes): the
length of an opening partial measure, the tempo of the first *MM mark, and the passages to
play as the score's own expansion list (*>[A,A,B,B]) directs.

Needs: Python with music21.
"""
import re
import tempfile
from fractions import Fraction
from pathlib import Path


def duration(token):
    """Quarter notes that one kern note or rest lasts; 0 for a grace note or anything else."""
    longest = Fraction(0)
    for note in token.split(' '):
        match = re.search(r'(\d+)(?:%(\d+))?(\.*)', note)
        if not match or 'q' in note.lower():
            continue
        length = Fraction(8) if match[1] == '00' else Fraction(4) * 2 if match[1] == '0' else Fraction(4 * int(match[2] or 1), int(match[1]))
        longest = max(longest, length * (2 - Fraction(1, 2 ** len(match[3]))))
    return longest


def timeline(text):
    """(quarter note at which each line of the file stands, total length)."""
    times, now, left = [], Fraction(0), None
    for line in text.split('\n'):
        times.append(now)
        tokens = line.split('\t')
        if not line or line.startswith('!') or line.startswith('='):
            continue
        if line.startswith('*'):
            if left is None:
                left = [Fraction(0)] * len(tokens)
            elif any(token in ('*^', '*v', '*-', '*+', '*x') for token in tokens):
                # Spines split and join; a voice carries on what it was holding.
                after, i = [], 0
                while i < len(tokens):
                    if tokens[i] == '*^':
                        after += [left[i], left[i]]
                    elif tokens[i] == '*v':
                        j = i
                        while j + 1 < len(tokens) and tokens[j + 1] == '*v':
                            j += 1
                        after.append(max(left[i:j + 1]))
                        i = j
                    elif tokens[i] != '*-':
                        after.append(left[i])
                    i += 1
                left = after
            continue
        for i, token in enumerate(tokens):
            if token != '.' and i < len(left):
                left[i] = duration(token)
        step = min((value for value in left if value > 0), default=Fraction(0))
        left = [max(Fraction(0), value - step) for value in left]
        now += step
    return times, now


def read(text):
    from music21 import bar, converter

    lines = text.split('\n')
    times, total = timeline(text)
    options = {}
    first = next((i for i, line in enumerate(lines) if re.match(r'=\d', line)), None)
    if first is not None and 0 < times[first] and re.match(r'=1\b', lines[first]):
        options['pickup'] = float(times[first])
    tempo = re.search(r'^\*MM(\d+(?:\.\d+)?)', text, re.M)
    if tempo:
        options['tempo'] = {'0': float(tempo[1])}

    # Sections (*>A) and the order to play them in (*>[A,A,B,B]); a bare list wins over a named one.
    labels = [(i, match[1]) for i, line in enumerate(lines) if (match := re.match(r'\*>([^\[\]\t]+)(\t|$)', line))]
    listing = re.search(r'^\*>\[([^\]]*)\]', text, re.M)
    if labels and listing:
        spans = {}
        for k, (i, name) in enumerate(labels):
            end = times[labels[k + 1][0]] if k + 1 < len(labels) else None
            spans.setdefault(name, [float(times[i]), None if end is None else float(end)])
        order = [spans[name] for name in listing[1].split(',') if name in spans]
        if len(order) > len(spans):
            options['order'] = order

    # MIDI of the score as written, once through: music21 would otherwise expand what repeats it understands.
    score = converter.parseData(text, format='humdrum')
    for measure in score.recurse().getElementsByClass('Measure'):
        for side in ('leftBarline', 'rightBarline'):
            if isinstance(getattr(measure, side), bar.Repeat):
                setattr(measure, side, None)
    with tempfile.TemporaryDirectory() as folder:
        file = Path(folder) / 'score.mid'
        score.write('midi', fp=str(file))
        return file.read_bytes(), options


def read_musicxml(data):
    """The same for a MusicXML file (.mxl or .musicxml, as bytes): (MIDI bytes, options).
    The tempo comes through in the MIDI; only an opening partial measure is reported."""
    from music21 import bar, converter

    with tempfile.TemporaryDirectory() as folder:
        source = Path(folder) / ('score.mxl' if data[:2] == b'PK' else 'score.musicxml')
        source.write_bytes(data)
        score = converter.parse(str(source))
        options = {}
        first = score.parts[0].getElementsByClass('Measure')[0]
        if 0 < first.duration.quarterLength < first.barDuration.quarterLength:
            options['pickup'] = float(first.duration.quarterLength)
        for measure in score.recurse().getElementsByClass('Measure'):
            for side in ('leftBarline', 'rightBarline'):
                if isinstance(getattr(measure, side), bar.Repeat):
                    setattr(measure, side, None)
        file = Path(folder) / 'score.mid'
        score.write('midi', fp=str(file))
        return file.read_bytes(), options
