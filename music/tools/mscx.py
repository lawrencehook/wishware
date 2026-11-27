"""Read a MuseScore file (.mscz or .mscx, MuseScore 2 to 4) for midi.py.

read(data) returns (MIDI bytes of the score played once through, options), where options may
hold the "pickup" that midi.py takes for a movement. One track is written per staff of the main
score. Notes, ties, tuplets, grace notes (played short), time signatures and tempo marks are
read; repeats and voltas are not.

Needs: Python with mido.
"""
import io
import re
import xml.etree.ElementTree as ET
import zipfile
from fractions import Fraction

import mido

TICKS = 480
LENGTHS = {'long': 16, 'breve': 8, 'whole': 4, 'half': 2, 'quarter': 1, 'eighth': Fraction(1, 2), '16th': Fraction(1, 4),
           '32nd': Fraction(1, 8), '64th': Fraction(1, 16), '128th': Fraction(1, 32)}
GRACE = ('acciaccatura', 'appoggiatura', 'grace4', 'grace8after', 'grace16', 'grace16after', 'grace32', 'grace32after')


def read(data):
    if data[:2] == b'PK':
        archive = zipfile.ZipFile(io.BytesIO(data))
        data = archive.read(next(name for name in archive.namelist() if name.endswith('.mscx') and '/' not in name))
    root = ET.fromstring(data)
    score = root.find('Score') if root.tag != 'Score' else root
    staves = [staff for staff in score.findall('Staff') if staff.find('Measure') is not None]

    division = int(score.findtext('Division') or 480)
    meters, tempos, tracks, pickup, tuplets = {}, {}, [], 0, {}
    for index, staff in enumerate(staves):
        notes, held, start = [], {}, Fraction(0)
        nominal = Fraction(4)
        for number, measure in enumerate(staff.findall('Measure')):
            longest = Fraction(0)
            # MuseScore 3 and 4 wrap each voice; MuseScore 2 lists everything in the measure and
            # moves back with <tick> for a further voice.
            for voice in measure.findall('voice') or [measure]:
                at, ratio = start, Fraction(1)
                for element in voice:
                    if element.tag == 'TimeSig':
                        nominal = Fraction(int(element.findtext('sigN')) * 4, int(element.findtext('sigD')))
                        meters[start] = (int(element.findtext('sigN')), int(element.findtext('sigD')))
                    elif element.tag == 'Tempo':
                        tempos[at] = float(element.findtext('tempo')) * 60
                    elif element.tag == 'tick':
                        at = Fraction(int(element.text), division)
                    elif element.tag == 'Tuplet' and element.get('id'):
                        tuplets[element.get('id')] = Fraction(int(element.findtext('normalNotes')), int(element.findtext('actualNotes')))
                    elif element.tag == 'Tuplet':
                        ratio = Fraction(int(element.findtext('normalNotes')), int(element.findtext('actualNotes')))
                    elif element.tag == 'endTuplet':
                        ratio = Fraction(1)
                    elif element.tag == 'location':
                        moved = element.findtext('fractions')
                        if moved:
                            at += Fraction(moved) * 4
                    elif element.tag in ('Chord', 'Rest'):
                        kind = element.findtext('durationType')
                        scale = tuplets.get(element.findtext('Tuplet'), ratio)
                        if kind == 'measure':
                            length = Fraction(element.findtext('duration')) * 4 if element.findtext('duration') else nominal
                        else:
                            length = LENGTHS[kind] * (2 - Fraction(1, 2 ** int(element.findtext('dots') or 0))) * scale
                        grace = any(element.find(tag) is not None for tag in GRACE)
                        if element.tag == 'Chord':
                            for note in element.findall('Note'):
                                pitch = int(note.findtext('pitch'))
                                ties = [spanner for spanner in note.findall('Spanner') if spanner.get('type') == 'Tie']
                                tied_from = any(spanner.find('prev') is not None for spanner in ties) or note.find('endSpanner') is not None
                                tied_on = any(spanner.find('next') is not None for spanner in ties) or note.find('Tie') is not None
                                sounding = Fraction(1, 8) if grace else length
                                if tied_from and pitch in held:
                                    held[pitch][1] += sounding
                                else:
                                    held[pitch] = [at, sounding, pitch]
                                    notes.append(held[pitch])
                                if not tied_on:
                                    held.pop(pitch, None)
                        if not grace:
                            at += length
                longest = max(longest, at - start)
            actual = Fraction(measure.get('len')) * 4 if measure.get('len') else (longest or nominal)
            if index == 0 and number == 0 and actual < nominal:
                pickup = float(actual)
            start += actual
        tracks.append(notes)

    midi = mido.MidiFile(ticks_per_beat=TICKS)
    tick = lambda beat: round(beat * TICKS)
    events = [(tick(beat), mido.MetaMessage('time_signature', numerator=n, denominator=d)) for beat, (n, d) in meters.items()]
    events += [(tick(beat), mido.MetaMessage('set_tempo', tempo=round(60e6 / bpm))) for beat, bpm in tempos.items()]
    if not any(beat == 0 for beat in tempos):
        events.append((0, mido.MetaMessage('set_tempo', tempo=500000)))
    lists = [events] + [[event for onset, length, pitch in notes for event in (
        (tick(onset), mido.Message('note_on', note=pitch, velocity=80)),
        (max(tick(onset) + 1, tick(onset + length)), mido.Message('note_off', note=pitch, velocity=0)))] for notes in tracks]
    for events in lists:
        track, now = mido.MidiTrack(), 0
        for when, message in sorted(events, key=lambda event: (event[0], event[1].type != 'note_off')):
            track.append(message.copy(time=when - now))
            now = when
        midi.tracks.append(track)
    out = io.BytesIO()
    midi.save(file=out)
    return out.getvalue(), ({'pickup': pickup} if pickup else {})
