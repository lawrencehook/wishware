# Music Ideas

Feature ideas tailored to the Wishware music catalog (758 timed, multi-voice scores, synced engraved measure boxes, and offline sampled playback across 21 composers).

## Implemented

### Live Keyboard & Harmony Lens (`piece.html`)
- **Status:** Implemented
- **Idea:** An optional toggleable panel below the piano roll in `piece.html` showing a compact 88-key keyboard (keys lighting up in voice colors as notes strike, with register markers and live chord readout) paired with a live Circle of Fifths pitch-class wheel. Using the key signature from `measures.js`, the wheel highlights the 7 diatonic notes of the current key as a contiguous arc and draws the active harmonic polygon + recent 2-beat trail so modulations, chromaticism, and whole-tone passages become visible in real time (and while scrubbing).

### Composer Timeline & Sound Map (`atlas.html`)
- **Status:** Implemented
- **Idea:** An exploratory overview page pairing two views of the entire catalog:
  1. An interactive **lifespan timeline** (1685–1953) showing all 21 composers, overlapping contemporaries at any scrubbed year, and click-to-filter integration with the map below.
  2. A **758-piece 2D Sound Map** plotted from build-time score metrics (`music/build.js` → `music/composers/atlas.js`): note density, chromaticism, pitch span, mean pitch, duration, and composer birth year—with preset views, search/composer/sheet-music filters, on-demand 4-second Salamander piano previews, and direct links into `piece.html`.

## Backlog

### Clickable Sheet Music & A–B Practice Loop
- **Status:** Idea
- **Idea:** `engrave.py` and `typeset.py` already store the pixel bounds `(x, width, y, h)` and beat starts of every printed measure. Making engraved measures clickable to seek immediately—and allowing Shift-click or drag selection of two bars to loop a passage at ½ or ¾ speed with an optional metronome click—would turn every piece with sheet music into a focused practice tool with no additional data pipeline changes.

### “Drop the Needle” Listening Game
- **Status:** Idea
- **Idea:** A static listening quiz (`music/quiz.html` or under `games/`) that picks a random 8–12 second excerpt from the catalog (with a *Famous works* mode drawn from each composer's `featured` list and a *Deep cuts* mode across all works), plays it on the sampled piano while drawing an anonymized piano roll, and asks the player to guess the composer or era. On reveal, show the piece's brief, portrait, and a direct link into `piece.html` at that exact beat.

### Transposition-Invariant Motif Search
- **Status:** Idea
- **Idea:** Pre-index upper-voice semitone-interval sequences across all works in `music/build.js` into a compact static search index. Let listeners tap a few notes on a small on-screen keyboard (or pick famous seeds like `B–A–C–H` or *Dies Irae*) to find matching melodic contours across composers regardless of key, and jump directly to the matching measure in `piece.html`.
