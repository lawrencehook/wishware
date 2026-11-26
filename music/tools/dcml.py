"""Read a score from a DCML corpus (github.com/DCMLab) for midi.py.

read(notes, measures) takes the text of a piece's notes.tsv and measures.tsv and returns
(MIDI bytes of the score played once through, options), where options may hold the "pickup"
and "order" that midi.py takes for a movement: the length of an opening partial measure and the
passages to play, following each measure's `next`. The corpora carry no tempo; give one in
imports.json as "tempo": {"0": <quarter notes per minute>}.

Needs: Python with mido.
"""
import csv
import io
from fractions import Fraction

import mido

TICKS = 480
KEYS = {0: 'C', 1: 'G', 2: 'D', 3: 'A', 4: 'E', 5: 'B', 6: 'F#', 7: 'C#', -1: 'F', -2: 'Bb', -3: 'Eb', -4: 'Ab', -5: 'Db', -6: 'Gb', -7: 'Cb'}


def rows(text):
    return list(csv.DictReader(io.StringIO(text), delimiter='\t'))


def read(notes, measures):
    # Where each measure stands, counting every ending, and what follows it.
    start, following, at = {}, {}, Fraction(0)
    marks = []  # (quarter note, time signature, key signature)
    table = rows(measures)
    for row in table:
        mc = int(row['mc'])
        start[mc] = at
        following[mc] = [int(value) for value in row['next'].split(',')]
        if not marks or marks[-1][1:] != (row['timesig'], row['keysig']):
            marks.append((at, row['timesig'], row['keysig']))
        at += Fraction(row['act_dur']) * 4
    total = at
    options = {}
    if table[0]['mn'] == '0':
        options['pickup'] = float(Fraction(table[0]['act_dur']) * 4)

    # Follow the repeats: on each visit a measure goes on to its next listed successor.
    visits, played, mc = {}, [], int(table[0]['mc'])
    while mc != -1 and len(played) < 20 * len(table):
        played.append(mc)
        choice = following[mc]
        mc = choice[min(visits.get(played[-1], 0), len(choice) - 1)]
        visits[played[-1]] = visits.get(played[-1], 0) + 1
    if played != sorted(start):
        order = []
        for mc in played:
            end = start[mc + 1] if mc + 1 in start else total
            if order and order[-1][1] == start[mc]:
                order[-1][1] = end
            else:
                order.append([start[mc], end])
        options['order'] = [[float(a), None if b == total else float(b)] for a, b in order]

    # Notes, with ties joined, one track per staff.
    staves, held = {}, {}
    for row in rows(notes):
        onset = start[int(row['mc'])] + Fraction(row['mc_onset']) * 4
        length = Fraction(row['duration_qb']) if row['duration_qb'] else Fraction(0)
        if row.get('gracenote'):
            length = Fraction(1, 8)
        key = (row['staff'], row['midi'])
        if row['tied'] in ('0', '-1') and key in held:
            held[key][1] = onset + length - held[key][0]
            if row['tied'] == '-1':
                del held[key]
            continue
        note = [onset, length, int(row['midi'])]
        staves.setdefault(int(row['staff']), []).append(note)
        if row['tied'] == '1':
            held[key] = note

    midi = mido.MidiFile(ticks_per_beat=TICKS)
    tick = lambda beat: round(beat * TICKS)
    track = mido.MidiTrack()
    events = [(0, mido.MetaMessage('set_tempo', tempo=500000))]
    for beat, timesig, keysig in marks:
        numerator, denominator = timesig.split('/')
        events.append((tick(beat), mido.MetaMessage('time_signature', numerator=int(numerator), denominator=int(denominator))))
        events.append((tick(beat), mido.MetaMessage('key_signature', key=KEYS[int(keysig)])))
    tracks = [events]
    for staff in sorted(staves):
        events = []
        for onset, length, pitch in staves[staff]:
            events.append((tick(onset), mido.Message('note_on', note=pitch, velocity=80)))
            events.append((max(tick(onset) + 1, tick(onset + length)), mido.Message('note_off', note=pitch, velocity=0)))
        tracks.append(events)
    for k, events in enumerate(tracks):
        track = mido.MidiTrack()
        if k:
            track.append(mido.MetaMessage('track_name', name='upper' if k == 1 else 'lower'))
        now = 0
        for when, message in sorted(events, key=lambda event: (event[0], event[1].type != 'note_off')):
            track.append(message.copy(time=when - now))
            now = when
        midi.tracks.append(track)
    data = io.BytesIO()
    midi.save(file=data)
    return data.getvalue(), options
