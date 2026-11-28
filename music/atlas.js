// Composer Lifespan Timeline & 758-Piece Sound Map (music/atlas.html).
(() => {
    if (typeof MUSIC_ATLAS === 'undefined') return;

    const { composers, pieces } = MUSIC_ATLAS;
    const TOTAL = pieces.length;

    const ERAS = ['Baroque', 'Classical', 'Romantic', 'Late Romantic & Modern'];
    const ERA_COLORS = {
        light: {
            'Baroque': '#a87212',
            'Classical': '#1a7a6c',
            'Romantic': '#a83854',
            'Late Romantic & Modern': '#355aa3',
        },
        dark: {
            'Baroque': '#e6bd64',
            'Classical': '#5cc4b3',
            'Romantic': '#e87a96',
            'Late Romantic & Modern': '#7ca6f2',
        },
    };

    const METRICS = [
        {
            id: 'density',
            label: 'Note density (notes/s)',
            short: 'Density',
            get: (p) => p[6],
            fmt: (v) => v.toFixed(2) + ' /s',
            tick: (v) => v.toFixed(1),
        },
        {
            id: 'chromaticism',
            label: 'Chromaticism (%)',
            short: 'Chromaticism',
            get: (p) => p[9],
            fmt: (v) => v.toFixed(1) + '%',
            tick: (v) => Math.round(v) + '%',
        },
        {
            id: 'span',
            label: 'Pitch span (semitones)',
            short: 'Pitch span',
            get: (p) => p[7],
            fmt: (v) => Math.round(v) + ' st',
            tick: (v) => Math.round(v) + ' st',
        },
        {
            id: 'meanPitch',
            label: 'Mean pitch (MIDI)',
            short: 'Mean pitch',
            get: (p) => p[8],
            fmt: (v) => midiName(Math.round(v)) + ' (' + v.toFixed(1) + ')',
            tick: (v) => midiName(Math.round(v)),
        },
        {
            id: 'durMin',
            label: 'Duration (minutes)',
            short: 'Duration',
            get: (p) => p[5] / 60,
            fmt: (v) => formatClock(Math.round(v * 60)),
            tick: (v) => (v < 10 ? v.toFixed(1) : Math.round(v)) + 'm',
        },
        {
            id: 'year',
            label: 'Year composed',
            short: 'Year',
            get: (p) => p[11] ?? null,
            fmt: (v) => String(Math.round(v)),
            tick: (v) => String(Math.round(v)),
            nullable: true,
        },
        {
            id: 'age',
            label: 'Composer’s age when written',
            short: 'Age',
            get: (p) => (p[11] != null ? p[11] - composers[p[0]].birth : null),
            fmt: (v) => Math.round(v) + ' yrs',
            tick: (v) => Math.round(v) + 'y',
            nullable: true,
        },
        {
            id: 'composer',
            label: 'Composer (chronological)',
            short: 'Composer',
            get: (p) => p[0],
            fmt: (v) => composers[Math.round(v)]?.name ?? '',
            tick: (v) => composers[Math.round(v)]?.short ?? '',
            categorical: true,
        },
        {
            id: 'birth',
            label: 'Composer birth year',
            short: 'Birth year',
            get: (p) => composers[p[0]].birth,
            fmt: (v) => String(Math.round(v)),
            tick: (v) => String(Math.round(v)),
            discrete: true,
        },
    ];
    const metricById = Object.fromEntries(METRICS.map((m) => [m.id, m]));

    const PRESETS = [
        { id: 'texture', label: 'Density vs. Chromaticism', x: 'density', y: 'chromaticism', color: 'era' },
        { id: 'by-composer', label: 'Composer vs. Chromaticism', x: 'composer', y: 'chromaticism', color: 'era' },
        { id: 'time-chrom', label: 'Chromaticism Over Time', x: 'year', y: 'chromaticism', color: 'era' },
        { id: 'time-span', label: 'Keyboard Span Over Time', x: 'year', y: 'span', color: 'era' },
        { id: 'age-dur', label: 'Age vs. Duration', x: 'age', y: 'durMin', color: 'era' },
    ];

    const NOTE_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
    function midiName(midi) {
        const oct = Math.floor(midi / 12) - 1;
        return NOTE_NAMES[((midi % 12) + 12) % 12] + oct;
    }
    function formatClock(seconds) {
        const s = Math.max(0, Math.round(seconds));
        return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }
    function isLight() {
        return document.documentElement.dataset.theme === 'light';
    }
    function themeTokens() {
        const light = isLight();
        return {
            light,
            bg: light ? '#ecf0f2' : '#0b1012',
            surface: light ? '#e3e9e9' : '#141c1b',
            ink: light ? '#2e2c1c' : '#efede0',
            muted: light ? '#4c554e' : '#a8b4ac',
            rule: light ? '#c1c9c6' : '#313d39',
            grid: light ? 'rgba(46,44,28,0.10)' : 'rgba(239,237,224,0.10)',
            gold: light ? '#836b26' : '#e9ce80',
            era: ERA_COLORS[light ? 'light' : 'dark'],
            sheetYes: light ? '#836b26' : '#e9ce80',
            sheetNo: light ? 'rgba(76,85,78,0.38)' : 'rgba(180,190,182,0.34)',
        };
    }
    function composerHue(ci, light) {
        const hue = (ci * 137.508) % 360;
        return light ? `hsl(${hue.toFixed(0)}, 56%, 38%)` : `hsl(${hue.toFixed(0)}, 68%, 67%)`;
    }
    // Deterministic jitter in [-1, 1] so discrete axes (birth year) fan out cleanly.
    function hashJitter(index) {
        const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
        return (x - Math.floor(x)) * 2 - 1;
    }

    // State
    const state = {
        xMetric: 'density',
        yMetric: 'chromaticism',
        colorBy: 'era',
        selectedComposer: null, // composer index or null
        selectedEra: null, // era string or null
        sheetOnly: false,
        search: '',
        hoverYear: 1820,
        hoverComposer: null,
        lockedPiece: findDefaultPiece(),
        hoveredPiece: null,
        visibleIndices: [],
        omittedUndated: 0,
        screenPoints: [], // { idx, sx, sy, r, color }
    };

    function findDefaultPiece() {
        // Pre-select a familiar, evocative work (Chopin Nocturne Op. 9 No. 2) so the inspector is alive on load.
        const idx = pieces.findIndex((p) => p[3] === 'chopin-three-nocturnes-op-9' && p[4] === 1);
        return idx >= 0 ? idx : 0;
    }

    // DOM references
    const timelineCanvas = document.getElementById('timeline-canvas');
    const timelineCtx = timelineCanvas.getContext('2d');
    const mapCanvas = document.getElementById('sound-map');
    const mapCtx = mapCanvas.getContext('2d');
    const eraLegendEl = document.getElementById('era-legend');
    const readoutYearEl = document.getElementById('readout-year');
    const readoutAliveEl = document.getElementById('readout-alive');
    const readoutHintEl = document.getElementById('readout-hint');
    const presetsEl = document.getElementById('presets');
    const xSelect = document.getElementById('x-axis');
    const ySelect = document.getElementById('y-axis');
    const colorSelect = document.getElementById('color-by');
    const searchInput = document.getElementById('search-input');
    const sheetOnlyInput = document.getElementById('sheet-only');
    const filterTagsEl = document.getElementById('filter-tags');
    const matchCountEl = document.getElementById('match-count');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const mapLegendNoteEl = document.getElementById('map-legend-note');
    const inspBadgesEl = document.getElementById('insp-badges');
    const inspComposerEl = document.getElementById('insp-composer');
    const inspTitleEl = document.getElementById('insp-title');
    const inspSubEl = document.getElementById('insp-sub');
    const inspMetricsEl = document.getElementById('insp-metrics');
    const previewBtn = document.getElementById('preview-btn');
    const openPieceLink = document.getElementById('open-piece-link');
    const randomBtn = document.getElementById('random-btn');
    const inspStatusEl = document.getElementById('insp-status');
    const footerStatsEl = document.getElementById('atlas-footer-stats');

    const sheetCount = pieces.reduce((acc, p) => acc + p[10], 0);
    footerStatsEl.textContent = `${composers.length} composers · ${TOTAL} works · ${sheetCount} with synchronized sheet music`;

    // Build era legend buttons
    const eraButtons = new Map();
    for (const era of ERAS) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'era-chip';
        btn.setAttribute('aria-pressed', 'false');
        const dot = document.createElement('span');
        dot.className = 'era-dot';
        const label = document.createElement('span');
        label.textContent = era;
        btn.append(dot, label);
        btn.addEventListener('click', () => {
            state.selectedEra = state.selectedEra === era ? null : era;
            if (state.selectedEra && state.selectedComposer !== null && composers[state.selectedComposer].era !== state.selectedEra) {
                state.selectedComposer = null;
            }
            refreshAll();
        });
        eraLegendEl.append(btn);
        eraButtons.set(era, { btn, dot });
    }

    // Build axis selects
    for (const m of METRICS) {
        const ox = document.createElement('option');
        ox.value = m.id;
        ox.textContent = m.label;
        const oy = ox.cloneNode(true);
        xSelect.append(ox);
        ySelect.append(oy);
    }
    xSelect.value = state.xMetric;
    ySelect.value = state.yMetric;

    // Build preset buttons
    const presetButtons = new Map();
    for (const preset of PRESETS) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'preset-btn';
        btn.textContent = preset.label;
        btn.addEventListener('click', () => {
            state.xMetric = preset.x;
            state.yMetric = preset.y;
            state.colorBy = preset.color;
            xSelect.value = preset.x;
            ySelect.value = preset.y;
            colorSelect.value = preset.color;
            updatePresets();
            refreshAll();
        });
        presetsEl.append(btn);
        presetButtons.set(preset.id, btn);
    }

    function updatePresets() {
        for (const preset of PRESETS) {
            const active = state.xMetric === preset.x && state.yMetric === preset.y;
            presetButtons.get(preset.id).setAttribute('aria-pressed', String(active));
        }
    }

    // Filtering
    function computeVisible() {
        const q = state.search.trim().toLowerCase();
        const xm = metricById[state.xMetric];
        const ym = metricById[state.yMetric];
        const out = [];
        let omittedUndated = 0;
        for (let i = 0; i < TOTAL; i++) {
            const p = pieces[i];
            const comp = composers[p[0]];
            if (state.selectedComposer !== null && p[0] !== state.selectedComposer) continue;
            if (state.selectedEra !== null && comp.era !== state.selectedEra) continue;
            if (state.sheetOnly && !p[10]) continue;
            if (q) {
                const hay = (p[1] + ' ' + p[2] + ' ' + comp.name).toLowerCase();
                if (!hay.includes(q)) continue;
            }
            if (xm.get(p) == null || ym.get(p) == null) {
                omittedUndated++;
                continue;
            }
            out.push(i);
        }
        state.visibleIndices = out;
        state.omittedUndated = omittedUndated;
    }

    function updateFilterUI() {
        const tok = themeTokens();
        for (const [era, { btn, dot }] of eraButtons) {
            dot.style.background = tok.era[era];
            btn.setAttribute('aria-pressed', String(state.selectedEra === era));
        }

        filterTagsEl.replaceChildren();
        let anyFilter = false;

        if (state.selectedComposer !== null) {
            anyFilter = true;
            const comp = composers[state.selectedComposer];
            const pill = document.createElement('span');
            pill.className = 'filter-pill';
            const link = document.createElement('a');
            link.href = 'composer.html?c=' + comp.id;
            link.textContent = comp.name;
            const clear = document.createElement('button');
            clear.type = 'button';
            clear.setAttribute('aria-label', 'Clear composer filter');
            clear.textContent = '×';
            clear.addEventListener('click', () => {
                state.selectedComposer = null;
                refreshAll();
            });
            pill.append('Composer: ', link, ' ', clear);
            filterTagsEl.append(pill);
        }

        if (state.selectedEra !== null) {
            anyFilter = true;
            const pill = document.createElement('span');
            pill.className = 'filter-pill';
            const clear = document.createElement('button');
            clear.type = 'button';
            clear.setAttribute('aria-label', 'Clear era filter');
            clear.textContent = '×';
            clear.addEventListener('click', () => {
                state.selectedEra = null;
                refreshAll();
            });
            pill.append('Era: ' + state.selectedEra + ' ', clear);
            filterTagsEl.append(pill);
        }

        if (state.sheetOnly) {
            anyFilter = true;
            const pill = document.createElement('span');
            pill.className = 'filter-pill';
            const clear = document.createElement('button');
            clear.type = 'button';
            clear.setAttribute('aria-label', 'Clear sheet music filter');
            clear.textContent = '×';
            clear.addEventListener('click', () => {
                state.sheetOnly = false;
                sheetOnlyInput.checked = false;
                refreshAll();
            });
            pill.append('With sheet music ', clear);
            filterTagsEl.append(pill);
        }

        if (state.search.trim()) {
            anyFilter = true;
            const pill = document.createElement('span');
            pill.className = 'filter-pill';
            const clear = document.createElement('button');
            clear.type = 'button';
            clear.setAttribute('aria-label', 'Clear search');
            clear.textContent = '×';
            clear.addEventListener('click', () => {
                state.search = '';
                searchInput.value = '';
                refreshAll();
            });
            pill.append('“' + state.search.trim() + '” ', clear);
            filterTagsEl.append(pill);
        }

        if (!anyFilter) {
            const label = document.createElement('span');
            label.textContent = 'All eras & composers';
            filterTagsEl.append(label);
        }

        matchCountEl.textContent = state.omittedUndated
            ? `Showing ${state.visibleIndices.length} of ${TOTAL} works · ${state.omittedUndated} undated omitted`
            : `Showing ${state.visibleIndices.length} of ${TOTAL} works`;
        resetFiltersBtn.hidden = !anyFilter;

        if (state.colorBy === 'sheet') {
            mapLegendNoteEl.textContent = 'Gold = synchronized sheet music · Muted = piano roll only';
        } else if (state.colorBy === 'composer') {
            mapLegendNoteEl.textContent = 'Colored uniquely per composer';
        } else {
            mapLegendNoteEl.textContent = 'Colored by era (matching timeline above)';
        }
    }

    // -------------------------------------------------------------------------
    // Section 1: Composer Lifespan Timeline
    // -------------------------------------------------------------------------
    const TL_MIN = 1675;
    const TL_MAX = 1962;
    const TL_ROW_H = 21;
    const TL_TOP = 26;
    const TL_BOTTOM = 16;
    const TL_PAD_L = 132;
    const TL_PAD_R = 54;

    function timelineLayout() {
        const w = timelineCanvas.clientWidth || 800;
        const h = TL_TOP + composers.length * TL_ROW_H + TL_BOTTOM;
        const padL = w < 560 ? 96 : TL_PAD_L;
        const padR = w < 560 ? 32 : TL_PAD_R;
        const plotW = Math.max(120, w - padL - padR);
        return { w, h, padL, padR, plotW };
    }

    function yearToX(year, layout) {
        return layout.padL + ((year - TL_MIN) / (TL_MAX - TL_MIN)) * layout.plotW;
    }
    function xToYear(x, layout) {
        const raw = TL_MIN + ((x - layout.padL) / layout.plotW) * (TL_MAX - TL_MIN);
        return Math.round(Math.max(1685, Math.min(1953, raw)));
    }

    function updateTimelineReadout() {
        const y = state.hoverYear;
        readoutYearEl.textContent = String(y);
        const alive = [];
        for (const c of composers) {
            if (y >= c.birth && y <= c.death) {
                alive.push(`${c.short} (${y - c.birth})`);
            }
        }
        readoutAliveEl.textContent = alive.length
            ? alive.join(' · ')
            : 'No cataloged composers alive in this year.';
        if (state.selectedComposer !== null) {
            const sel = composers[state.selectedComposer];
            readoutHintEl.textContent = `Filtering Sound Map: ${sel.name} (${sel.works} works) — click bar again to clear`;
        } else {
            readoutHintEl.textContent = 'Click any bar to isolate that composer';
        }
    }

    function drawTimeline() {
        const tok = themeTokens();
        const layout = timelineLayout();
        const dpr = window.devicePixelRatio || 1;
        timelineCanvas.style.height = layout.h + 'px';
        timelineCanvas.width = Math.round(layout.w * dpr);
        timelineCanvas.height = Math.round(layout.h * dpr);
        timelineCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        timelineCtx.clearRect(0, 0, layout.w, layout.h);

        const { padL, plotW, h } = layout;

        // Century & half-century gridlines
        timelineCtx.font = '11px ui-monospace, monospace';
        timelineCtx.textBaseline = 'top';
        timelineCtx.textAlign = 'center';
        for (let yr = 1700; yr <= 1950; yr += 50) {
            const x = yearToX(yr, layout);
            timelineCtx.strokeStyle = tok.grid;
            timelineCtx.lineWidth = 1;
            timelineCtx.beginPath();
            timelineCtx.moveTo(x, TL_TOP - 4);
            timelineCtx.lineTo(x, h - TL_BOTTOM);
            timelineCtx.stroke();
            timelineCtx.fillStyle = tok.muted;
            timelineCtx.fillText(String(yr), x, 6);
        }

        // Hover year hairline
        if (state.hoverYear !== null) {
            const hx = yearToX(state.hoverYear, layout);
            timelineCtx.strokeStyle = tok.gold;
            timelineCtx.lineWidth = 1.25;
            timelineCtx.setLineDash([3, 3]);
            timelineCtx.beginPath();
            timelineCtx.moveTo(hx, TL_TOP - 4);
            timelineCtx.lineTo(hx, h - TL_BOTTOM);
            timelineCtx.stroke();
            timelineCtx.setLineDash([]);
        }

        // Composer bars
        for (let i = 0; i < composers.length; i++) {
            const c = composers[i];
            const rowY = TL_TOP + i * TL_ROW_H;
            const barY = rowY + 4;
            const barH = TL_ROW_H - 8;
            const x1 = yearToX(c.birth, layout);
            const x2 = yearToX(c.death, layout);
            const isSelected = state.selectedComposer === i;
            const isHovered = state.hoverComposer === i;
            const isEraMatch = state.selectedEra === null || c.era === state.selectedEra;
            const isAliveNow = state.hoverYear !== null && state.hoverYear >= c.birth && state.hoverYear <= c.death;
            const dimmed = (!isEraMatch) || (state.selectedComposer !== null && !isSelected);

            if (isHovered || isSelected) {
                timelineCtx.fillStyle = tok.light ? 'rgba(131,107,38,0.09)' : 'rgba(233,206,128,0.09)';
                timelineCtx.fillRect(0, rowY, layout.w, TL_ROW_H);
            }

            // Left label (composer surname)
            timelineCtx.font = (isSelected || isAliveNow ? '600 ' : '') + '12px "Instrument Sans", system-ui, sans-serif';
            timelineCtx.textAlign = 'right';
            timelineCtx.textBaseline = 'middle';
            timelineCtx.fillStyle = isSelected ? tok.gold : dimmed ? tok.muted : isAliveNow ? tok.ink : tok.muted;
            const labelText = layout.w < 560 ? c.short : c.short;
            timelineCtx.fillText(labelText, padL - 10, rowY + TL_ROW_H / 2);

            // Bar
            timelineCtx.globalAlpha = dimmed ? 0.25 : isAliveNow || isSelected || isHovered ? 0.96 : 0.66;
            timelineCtx.fillStyle = tok.era[c.era];
            timelineCtx.beginPath();
            timelineCtx.roundRect(x1, barY, Math.max(4, x2 - x1), barH, 3);
            timelineCtx.fill();
            timelineCtx.globalAlpha = 1;

            if (isSelected) {
                timelineCtx.strokeStyle = tok.gold;
                timelineCtx.lineWidth = 1.75;
                timelineCtx.beginPath();
                timelineCtx.roundRect(x1 - 1, barY - 1, Math.max(6, x2 - x1 + 2), barH + 2, 4);
                timelineCtx.stroke();
            }

            // Age marker dot on hairline if alive
            if (isAliveNow && !dimmed) {
                const hx = yearToX(state.hoverYear, layout);
                timelineCtx.fillStyle = tok.bg;
                timelineCtx.beginPath();
                timelineCtx.arc(hx, rowY + TL_ROW_H / 2, 3.2, 0, Math.PI * 2);
                timelineCtx.fill();
                timelineCtx.fillStyle = tok.gold;
                timelineCtx.beginPath();
                timelineCtx.arc(hx, rowY + TL_ROW_H / 2, 2, 0, Math.PI * 2);
                timelineCtx.fill();
            }

            // Diamond marker showing when the currently inspected work was composed
            const focusIdx = activePieceIndex();
            if (focusIdx !== null && pieces[focusIdx][0] === i && pieces[focusIdx][11] != null) {
                const cy = rowY + TL_ROW_H / 2;
                const cx = yearToX(pieces[focusIdx][11], layout);
                timelineCtx.save();
                timelineCtx.translate(cx, cy);
                timelineCtx.rotate(Math.PI / 4);
                timelineCtx.fillStyle = tok.gold;
                timelineCtx.strokeStyle = tok.bg;
                timelineCtx.lineWidth = 1.4;
                timelineCtx.fillRect(-4, -4, 8, 8);
                timelineCtx.strokeRect(-4, -4, 8, 8);
                timelineCtx.restore();
            }

            // Work count at right end of bar (or right margin)
            if (layout.w >= 460) {
                timelineCtx.font = '10.5px ui-monospace, monospace';
                timelineCtx.textAlign = 'left';
                timelineCtx.fillStyle = dimmed ? tok.rule : tok.muted;
                const ageSuffix = isAliveNow ? ` · age ${state.hoverYear - c.birth}` : '';
                timelineCtx.fillText(`${c.works}${ageSuffix}`, x2 + 6, rowY + TL_ROW_H / 2);
            }
        }
    }

    function timelineHit(ev) {
        const rect = timelineCanvas.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const layout = timelineLayout();
        const row = Math.floor((y - TL_TOP) / TL_ROW_H);
        const composerIndex = row >= 0 && row < composers.length ? row : null;
        const year = x >= layout.padL - 8 && x <= layout.padL + layout.plotW + 8 ? xToYear(x, layout) : null;
        return { composerIndex, year };
    }

    timelineCanvas.addEventListener('pointermove', (ev) => {
        const hit = timelineHit(ev);
        state.hoverComposer = hit.composerIndex;
        if (hit.year !== null) state.hoverYear = hit.year;
        timelineCanvas.style.cursor = hit.composerIndex !== null ? 'pointer' : 'crosshair';
        updateTimelineReadout();
        drawTimeline();
    });

    timelineCanvas.addEventListener('pointerleave', () => {
        state.hoverComposer = null;
        drawTimeline();
    });

    timelineCanvas.addEventListener('pointerdown', (ev) => {
        const hit = timelineHit(ev);
        if (hit.year !== null) state.hoverYear = hit.year;
        if (hit.composerIndex !== null) {
            state.selectedComposer = state.selectedComposer === hit.composerIndex ? null : hit.composerIndex;
            if (state.selectedComposer !== null && state.selectedEra !== null && composers[state.selectedComposer].era !== state.selectedEra) {
                state.selectedEra = null;
            }
            refreshAll();
        }
    });

    // -------------------------------------------------------------------------
    // Section 2: 758-Piece Sound Map (Scatter Plot)
    // -------------------------------------------------------------------------
    function niceDomain(values, discrete) {
        let min = Infinity, max = -Infinity;
        for (const v of values) {
            if (v < min) min = v;
            if (v > max) max = v;
        }
        if (!Number.isFinite(min)) return { min: 0, max: 1 };
        if (min === max) return { min: min - 1, max: max + 1 };
        const pad = (max - min) * (discrete ? 0.06 : 0.05);
        return { min: Math.max(0, min - pad), max: max + pad };
    }

    function drawMap() {
        const tok = themeTokens();
        const w = mapCanvas.clientWidth || 720;
        const h = mapCanvas.clientHeight || 460;
        const dpr = window.devicePixelRatio || 1;
        mapCanvas.width = Math.round(w * dpr);
        mapCanvas.height = Math.round(h * dpr);
        mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        mapCtx.clearRect(0, 0, w, h);

        const xm = metricById[state.xMetric];
        const ym = metricById[state.yMetric];

        const padL = ym.categorical ? 92 : 66;
        const padR = xm.categorical ? 22 : 20;
        const padT = 16;
        const padB = xm.categorical ? 82 : 42;
        const plotW = Math.max(80, w - padL - padR);
        const plotH = Math.max(80, h - padT - padB);

        // Compute domain over ALL dated/valid pieces so filtering highlights a subset in consistent coordinates.
        const allX = pieces.map((p) => xm.get(p)).filter((v) => v != null);
        const allY = pieces.map((p) => ym.get(p)).filter((v) => v != null);
        const domX = niceDomain(allX, xm.discrete);
        const domY = niceDomain(allY, ym.discrete);
        if (xm.id === 'birth') { domX.min = 1675; domX.max = 1905; }
        if (ym.id === 'birth') { domY.min = 1675; domY.max = 1905; }
        if (xm.id === 'year') { domX.min = 1700; domX.max = 1928; }
        if (ym.id === 'year') { domY.min = 1700; domY.max = 1928; }
        if (xm.categorical) { domX.min = -0.6; domX.max = composers.length - 0.4; }
        if (ym.categorical) { domY.min = -0.6; domY.max = composers.length - 0.4; }

        const toSX = (val) => padL + ((val - domX.min) / (domX.max - domX.min)) * plotW;
        const toSY = (val) => ym.categorical
            ? padT + ((val - domY.min) / (domY.max - domY.min)) * plotH
            : padT + plotH - ((val - domY.min) / (domY.max - domY.min)) * plotH;

        // Plot background
        mapCtx.fillStyle = tok.bg;
        mapCtx.fillRect(padL, padT, plotW, plotH);

        // Alternating categorical lane bands (helps the eye track each composer column/row)
        const stripeTint = tok.light ? 'rgba(46,44,28,0.035)' : 'rgba(239,237,224,0.035)';
        const activeLaneTint = tok.light ? 'rgba(131,107,38,0.11)' : 'rgba(233,206,128,0.09)';
        const focusIdx = activePieceIndex();
        const focusComp = focusIdx !== null ? pieces[focusIdx][0] : null;
        if (xm.categorical) {
            const laneW = plotW / (domX.max - domX.min);
            for (let ci = 0; ci < composers.length; ci++) {
                const cx = toSX(ci);
                if (state.selectedComposer === ci) {
                    mapCtx.fillStyle = activeLaneTint;
                    mapCtx.fillRect(cx - laneW / 2, padT, laneW, plotH);
                } else if (ci % 2 === 1) {
                    mapCtx.fillStyle = stripeTint;
                    mapCtx.fillRect(cx - laneW / 2, padT, laneW, plotH);
                }
            }
        }
        if (ym.categorical) {
            const laneH = plotH / (domY.max - domY.min);
            for (let ci = 0; ci < composers.length; ci++) {
                const cy = toSY(ci);
                if (state.selectedComposer === ci) {
                    mapCtx.fillStyle = activeLaneTint;
                    mapCtx.fillRect(padL, cy - laneH / 2, plotW, laneH);
                } else if (ci % 2 === 1) {
                    mapCtx.fillStyle = stripeTint;
                    mapCtx.fillRect(padL, cy - laneH / 2, plotW, laneH);
                }
            }
        }

        // Grid & ticks
        const xTicks = xm.categorical
            ? composers.map((_, ci) => ci)
            : xm.id === 'birth' || xm.id === 'year'
                ? [1700, 1750, 1800, 1850, 1900]
                : Array.from({ length: 6 }, (_, t) => domX.min + (t / 5) * (domX.max - domX.min));
        const yTicks = ym.categorical
            ? composers.map((_, ci) => ci)
            : ym.id === 'birth' || ym.id === 'year'
                ? [1700, 1750, 1800, 1850, 1900]
                : Array.from({ length: 6 }, (_, t) => domY.min + (t / 5) * (domY.max - domY.min));
        mapCtx.lineWidth = 1;

        for (const xv of xTicks) {
            const sx = toSX(xv);
            mapCtx.strokeStyle = tok.grid;
            mapCtx.beginPath();
            mapCtx.moveTo(sx, padT);
            mapCtx.lineTo(sx, padT + plotH);
            mapCtx.stroke();

            if (xm.categorical) {
                const ci = Math.round(xv);
                const isEmph = state.selectedComposer === ci || focusComp === ci;
                mapCtx.save();
                mapCtx.translate(sx, padT + plotH + 8);
                mapCtx.rotate(-Math.PI / 4.2);
                mapCtx.font = (isEmph ? '600 ' : '') + '11px "Instrument Sans", system-ui, sans-serif';
                mapCtx.fillStyle = state.selectedComposer === ci ? tok.gold : isEmph ? tok.ink : tok.muted;
                mapCtx.textAlign = 'right';
                mapCtx.textBaseline = 'middle';
                mapCtx.fillText(xm.tick(xv), 0, 0);
                mapCtx.restore();
            } else {
                mapCtx.font = '11px ui-monospace, monospace';
                mapCtx.fillStyle = tok.muted;
                mapCtx.textAlign = 'center';
                mapCtx.textBaseline = 'top';
                mapCtx.fillText(xm.tick(xv), sx, padT + plotH + 7);
            }
        }
        for (const yv of yTicks) {
            const sy = toSY(yv);
            mapCtx.strokeStyle = tok.grid;
            mapCtx.beginPath();
            mapCtx.moveTo(padL, sy);
            mapCtx.lineTo(padL + plotW, sy);
            mapCtx.stroke();

            if (ym.categorical) {
                const ci = Math.round(yv);
                const isEmph = state.selectedComposer === ci || focusComp === ci;
                mapCtx.font = (isEmph ? '600 ' : '') + '11px "Instrument Sans", system-ui, sans-serif';
                mapCtx.fillStyle = state.selectedComposer === ci ? tok.gold : isEmph ? tok.ink : tok.muted;
                mapCtx.textAlign = 'right';
                mapCtx.textBaseline = 'middle';
                mapCtx.fillText(ym.tick(yv), padL - 8, sy);
            } else {
                mapCtx.font = '11px ui-monospace, monospace';
                mapCtx.fillStyle = tok.muted;
                mapCtx.textAlign = 'right';
                mapCtx.textBaseline = 'middle';
                mapCtx.fillText(ym.tick(yv), padL - 8, sy);
            }
        }

        // Plot border
        mapCtx.strokeStyle = tok.rule;
        mapCtx.strokeRect(padL, padT, plotW, plotH);

        // Axis labels (omit redundant bottom/left axis title when categorical composer names already fill the margin)
        mapCtx.font = '11.5px "Instrument Sans", system-ui, sans-serif';
        mapCtx.fillStyle = tok.muted;
        if (!xm.categorical) {
            mapCtx.textAlign = 'center';
            mapCtx.textBaseline = 'bottom';
            mapCtx.fillText(xm.label, padL + plotW / 2, h - 3);
        }
        if (!ym.categorical) {
            mapCtx.save();
            mapCtx.translate(10, padT + plotH / 2);
            mapCtx.rotate(-Math.PI / 2);
            mapCtx.textAlign = 'center';
            mapCtx.textBaseline = 'top';
            mapCtx.fillText(ym.label, 0, 0);
            mapCtx.restore();
        }

        const visibleSet = new Set(state.visibleIndices);
        const filtered = state.visibleIndices.length + state.omittedUndated < TOTAL;
        const jitterX = xm.categorical ? 0.28 : xm.id === 'year' ? 0.65 : xm.id === 'age' ? 0.35 : xm.discrete ? 3.2 : 0;
        const jitterY = ym.categorical ? 0.28 : ym.id === 'year' ? 0.65 : ym.id === 'age' ? 0.35 : ym.discrete ? 3.2 : 0;

        // Draw faint backdrop dots for filtered-out pieces so context remains visible
        if (filtered) {
            mapCtx.fillStyle = tok.light ? 'rgba(46,44,28,0.08)' : 'rgba(239,237,224,0.08)';
            for (let i = 0; i < TOTAL; i++) {
                if (visibleSet.has(i)) continue;
                const p = pieces[i];
                const xv = xm.get(p), yv = ym.get(p);
                if (xv == null || yv == null) continue;
                const sx = toSX(xv + (jitterX ? hashJitter(i) * jitterX : 0));
                const sy = toSY(yv + (jitterY ? hashJitter(i + 997) * jitterY : 0));
                mapCtx.beginPath();
                mapCtx.arc(sx, sy, 2.2, 0, Math.PI * 2);
                mapCtx.fill();
            }
        }

        // Draw active dots & cache screen coordinates for O(N) pointer hit-testing
        const pts = [];
        const baseRadius = state.visibleIndices.length > 300 ? 3.8 : state.visibleIndices.length > 80 ? 4.6 : 5.4;

        for (const i of state.visibleIndices) {
            const p = pieces[i];
            const comp = composers[p[0]];
            const xv = xm.get(p), yv = ym.get(p);
            if (xv == null || yv == null) continue;
            const sx = toSX(xv + (jitterX ? hashJitter(i) * jitterX : 0));
            const sy = toSY(yv + (jitterY ? hashJitter(i + 997) * jitterY : 0));
            let color;
            if (state.colorBy === 'sheet') {
                color = p[10] ? tok.sheetYes : tok.sheetNo;
            } else if (state.colorBy === 'composer') {
                color = composerHue(p[0], tok.light);
            } else {
                color = tok.era[comp.era];
            }
            const r = p[10] && state.colorBy === 'sheet' ? baseRadius + 0.8 : baseRadius;
            pts.push({ idx: i, sx, sy, r, color });

            mapCtx.globalAlpha = state.colorBy === 'sheet' && !p[10] ? 0.45 : 0.78;
            mapCtx.fillStyle = color;
            mapCtx.beginPath();
            mapCtx.arc(sx, sy, r, 0, Math.PI * 2);
            mapCtx.fill();
        }
        mapCtx.globalAlpha = 1;
        state.screenPoints = pts;

        // Subtle smoothed trendline when plotting a numeric metric over composition year
        if (xm.id === 'year' && !ym.categorical && state.visibleIndices.length >= 25) {
            const samples = [];
            let minYr = Infinity, maxYr = -Infinity;
            for (const i of state.visibleIndices) {
                const p = pieces[i];
                const xv = xm.get(p), yv = ym.get(p);
                if (xv == null || yv == null) continue;
                samples.push([xv, yv]);
                if (xv < minYr) minYr = xv;
                if (xv > maxYr) maxYr = xv;
            }
            if (maxYr - minYr >= 25) {
                const sigma = 15;
                const steps = 72;
                mapCtx.save();
                mapCtx.strokeStyle = tok.gold;
                mapCtx.lineWidth = 2;
                mapCtx.globalAlpha = 0.85;
                mapCtx.setLineDash([5, 4]);
                mapCtx.beginPath();
                let drawing = false;
                for (let s = 0; s <= steps; s++) {
                    const yr = minYr + (s / steps) * (maxYr - minYr);
                    let wSum = 0, ySum = 0;
                    for (const [xVal, yVal] of samples) {
                        const d = (yr - xVal) / sigma;
                        const wgt = Math.exp(-0.5 * d * d);
                        wSum += wgt;
                        ySum += wgt * yVal;
                    }
                    if (wSum < 1.5) { drawing = false; continue; }
                    const sx = toSX(yr);
                    const sy = toSY(ySum / wSum);
                    if (!drawing) { mapCtx.moveTo(sx, sy); drawing = true; }
                    else mapCtx.lineTo(sx, sy);
                }
                mapCtx.stroke();
                mapCtx.restore();
            }
        }

        // Highlight locked and hovered points on top
        const drawCallout = (idx, locked) => {
            if (idx === null) return;
            const p = pieces[idx];
            const comp = composers[p[0]];
            const xv = xm.get(p), yv = ym.get(p);
            if (xv == null || yv == null) return;
            const sx = toSX(xv + (jitterX ? hashJitter(idx) * jitterX : 0));
            const sy = toSY(yv + (jitterY ? hashJitter(idx + 997) * jitterY : 0));

            // Crosshair guides
            mapCtx.strokeStyle = locked ? tok.gold : tok.rule;
            mapCtx.lineWidth = 1;
            mapCtx.setLineDash([2, 3]);
            mapCtx.beginPath();
            mapCtx.moveTo(sx, padT);
            mapCtx.lineTo(sx, padT + plotH);
            mapCtx.moveTo(padL, sy);
            mapCtx.lineTo(padL + plotW, sy);
            mapCtx.stroke();
            mapCtx.setLineDash([]);

            // Outer ring
            mapCtx.strokeStyle = locked ? tok.gold : tok.ink;
            mapCtx.lineWidth = locked ? 2.2 : 1.5;
            mapCtx.beginPath();
            mapCtx.arc(sx, sy, locked ? 8.5 : 7, 0, Math.PI * 2);
            mapCtx.stroke();

            // Solid core
            mapCtx.fillStyle = tok.era[comp.era];
            mapCtx.beginPath();
            mapCtx.arc(sx, sy, locked ? 4.8 : 4.2, 0, Math.PI * 2);
            mapCtx.fill();

            // Compact floating label near dot
            const tag = comp.short + ' · ' + p[1];
            mapCtx.font = '600 11.5px "Instrument Sans", system-ui, sans-serif';
            const textW = Math.min(240, mapCtx.measureText(tag).width);
            const label = textW >= 240 ? tag.slice(0, 34) + '…' : tag;
            const boxW = mapCtx.measureText(label).width + 14;
            const boxH = 22;
            let bx = sx + 12;
            if (bx + boxW > padL + plotW - 4) bx = sx - boxW - 12;
            let by = sy - boxH / 2;
            by = Math.max(padT + 4, Math.min(padT + plotH - boxH - 4, by));

            mapCtx.fillStyle = tok.surface;
            mapCtx.strokeStyle = locked ? tok.gold : tok.rule;
            mapCtx.lineWidth = 1;
            mapCtx.fillRect(bx, by, boxW, boxH);
            mapCtx.strokeRect(bx, by, boxW, boxH);
            mapCtx.fillStyle = tok.ink;
            mapCtx.textAlign = 'left';
            mapCtx.textBaseline = 'middle';
            mapCtx.fillText(label, bx + 7, by + boxH / 2);
        };

        if (state.lockedPiece !== null) drawCallout(state.lockedPiece, true);
        if (state.hoveredPiece !== null && state.hoveredPiece !== state.lockedPiece) {
            drawCallout(state.hoveredPiece, false);
        }

        // Empty state message
        if (!state.visibleIndices.length) {
            mapCtx.fillStyle = tok.muted;
            mapCtx.font = '14px "Instrument Sans", system-ui, sans-serif';
            mapCtx.textAlign = 'center';
            mapCtx.textBaseline = 'middle';
            mapCtx.fillText('No works match the current filters.', padL + plotW / 2, padT + plotH / 2);
        }
    }

    function nearestPoint(ev) {
        const rect = mapCanvas.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        let best = null;
        let bestDist = 18 * 18;
        for (const pt of state.screenPoints) {
            const dx = pt.sx - x;
            const dy = pt.sy - y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestDist) {
                bestDist = d2;
                best = pt.idx;
            }
        }
        return best;
    }

    mapCanvas.addEventListener('pointermove', (ev) => {
        const hit = nearestPoint(ev);
        mapCanvas.style.cursor = hit !== null ? 'pointer' : 'crosshair';
        if (hit !== state.hoveredPiece) {
            state.hoveredPiece = hit;
            drawTimeline();
            drawMap();
            updateInspector();
        }
    });

    mapCanvas.addEventListener('pointerleave', () => {
        if (state.hoveredPiece !== null) {
            state.hoveredPiece = null;
            drawTimeline();
            drawMap();
            updateInspector();
        }
    });

    mapCanvas.addEventListener('pointerdown', (ev) => {
        const hit = nearestPoint(ev);
        if (hit !== null) {
            if (state.lockedPiece !== hit) stopPreview();
            state.lockedPiece = hit;
            drawTimeline();
            drawMap();
            updateInspector();
        }
    });

    // -------------------------------------------------------------------------
    // Inspector Card
    // -------------------------------------------------------------------------
    function activePieceIndex() {
        return state.hoveredPiece !== null ? state.hoveredPiece : state.lockedPiece;
    }

    function updateInspector() {
        const idx = activePieceIndex();
        if (idx === null || !pieces[idx]) return;
        const p = pieces[idx];
        const comp = composers[p[0]];

        inspBadgesEl.replaceChildren();
        const eraBadge = document.createElement('span');
        eraBadge.className = 'insp-badge era';
        eraBadge.textContent = comp.era;
        eraBadge.title = comp.era;
        inspBadgesEl.append(eraBadge);

        if (p[10]) {
            const sheetBadge = document.createElement('span');
            sheetBadge.className = 'insp-badge sheet';
            sheetBadge.textContent = 'Sheet music';
            inspBadgesEl.append(sheetBadge);
        }
        if (state.hoveredPiece !== null && state.hoveredPiece !== state.lockedPiece) {
            const hoverBadge = document.createElement('span');
            hoverBadge.className = 'insp-badge';
            hoverBadge.textContent = 'Hovering';
            hoverBadge.title = 'Click the point to lock selection';
            inspBadgesEl.append(hoverBadge);
        }

        inspComposerEl.href = 'composer.html?c=' + comp.id;
        const yearStr = p[11] != null ? ` · ${p[11]} (age ${p[11] - comp.birth})` : ` (${comp.birth}–${comp.death})`;
        inspComposerEl.textContent = comp.name + yearStr;
        inspComposerEl.title = comp.name + yearStr;
        inspTitleEl.textContent = p[1];
        inspTitleEl.title = p[1];
        inspSubEl.textContent = p[2];
        inspSubEl.title = p[2];

        inspMetricsEl.replaceChildren();
        const cards = [
            ['Duration', formatClock(p[5]), p[5] + ' sec'],
            ['Density', p[6].toFixed(2) + ' /s', 'notes per sec'],
            ['Chromaticism', p[9].toFixed(1) + '%', 'out-of-key notes'],
            ['Register', p[7] + ' st span', 'mean ' + midiName(Math.round(p[8]))],
        ];
        for (const [label, val, sub] of cards) {
            const box = document.createElement('div');
            box.className = 'metric-box';
            const l = document.createElement('span');
            l.className = 'metric-label';
            l.textContent = label;
            const v = document.createElement('span');
            v.className = 'metric-val';
            v.textContent = val;
            const s = document.createElement('span');
            s.className = 'metric-sub';
            s.textContent = sub;
            box.append(l, v, s);
            inspMetricsEl.append(box);
        }

        openPieceLink.href = 'piece.html?c=' + comp.id + '&p=' + p[3] + '&m=' + p[4];
        updatePreviewButton(idx);
    }

    // -------------------------------------------------------------------------
    // Offline-safe Piano Audio Preview (lazy-loaded previews.js + piano.js)
    // -------------------------------------------------------------------------
    let audioCtx = null;
    let masterGain = null;
    let previewToken = 0;
    let playingPieceIndex = null;
    let activeSources = [];
    let stopTimer = null;
    const decodedRoots = new Map();
    const loadedScripts = new Map();

    function loadLocalScript(src) {
        if (loadedScripts.has(src)) return loadedScripts.get(src);
        const promise = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => {
                s.remove();
                loadedScripts.delete(src);
                reject(new Error('Could not load ' + src));
            };
            document.head.append(s);
        });
        loadedScripts.set(src, promise);
        return promise;
    }

    function updatePreviewButton(displayIdx) {
        const isPlayingThis = playingPieceIndex !== null && playingPieceIndex === (displayIdx ?? state.lockedPiece);
        previewBtn.setAttribute('aria-pressed', String(isPlayingThis));
        previewBtn.textContent = isPlayingThis ? '■ Stop preview' : '▶ Preview (4s)';
    }

    function stopPreview() {
        previewToken++;
        if (stopTimer !== null) {
            clearTimeout(stopTimer);
            stopTimer = null;
        }
        for (const src of activeSources) {
            try { src.stop(); } catch (_) {}
        }
        activeSources = [];
        playingPieceIndex = null;
        updatePreviewButton(activePieceIndex());
    }

    async function playPreview(pieceIdx) {
        if (playingPieceIndex === pieceIdx) {
            stopPreview();
            inspStatusEl.textContent = '';
            return;
        }
        stopPreview();
        const token = ++previewToken;
        state.lockedPiece = pieceIdx;
        drawMap();
        updateInspector();

        inspStatusEl.textContent = 'Loading Salamander piano samples…';
        previewBtn.textContent = 'Loading…';

        try {
            if (!audioCtx) {
                audioCtx = new AudioContext();
                const limiter = audioCtx.createDynamicsCompressor();
                limiter.connect(audioCtx.destination);
                masterGain = audioCtx.createGain();
                masterGain.gain.value = 0.55;
                masterGain.connect(limiter);
            }
            await audioCtx.resume();

            await Promise.all([
                typeof MUSIC_PREVIEWS === 'undefined' ? loadLocalScript('composers/previews.js') : Promise.resolve(),
                typeof PIANO_SAMPLES === 'undefined' ? loadLocalScript('bach-data/piano.js') : Promise.resolve(),
            ]);
            if (token !== previewToken) return;

            const snippet = MUSIC_PREVIEWS[pieceIdx];
            if (!snippet || !snippet.length) {
                inspStatusEl.textContent = 'No preview notes available for this work.';
                updatePreviewButton(pieceIdx);
                return;
            }

            const roots = Object.keys(PIANO_SAMPLES).map(Number);
            const needed = new Set();
            const resolved = snippet.map(([t, pitch, dur]) => {
                const root = roots.reduce((best, r) => (Math.abs(pitch - r) < Math.abs(pitch - best) ? r : best));
                needed.add(root);
                return { t, pitch, dur, root };
            });

            await Promise.all([...needed].map(async (root) => {
                if (decodedRoots.has(root)) return;
                const raw = PIANO_SAMPLES[root];
                const b64 = typeof raw === 'string' ? raw : raw.data;
                const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
                const buf = await audioCtx.decodeAudioData(bytes.buffer);
                decodedRoots.set(root, buf);
            }));
            if (token !== previewToken) return;

            playingPieceIndex = pieceIdx;
            updatePreviewButton(pieceIdx);
            const comp = composers[pieces[pieceIdx][0]];
            inspStatusEl.textContent = `Auditioning opening of ${comp.short} — ${pieces[pieceIdx][1]}`;

            const now = audioCtx.currentTime + 0.04;
            let maxEnd = 0;
            for (const note of resolved) {
                const buf = decodedRoots.get(note.root);
                if (!buf) continue;
                const src = audioCtx.createBufferSource();
                src.buffer = buf;
                src.playbackRate.value = Math.pow(2, (note.pitch - note.root) / 12);

                const gain = audioCtx.createGain();
                const startAt = now + note.t;
                const stopAt = startAt + note.dur + 0.35;
                gain.gain.setValueAtTime(0.001, startAt);
                gain.gain.linearRampToValueAtTime(0.32, startAt + 0.012);
                gain.gain.setValueAtTime(0.32, startAt + note.dur);
                gain.gain.exponentialRampToValueAtTime(0.0008, stopAt);

                src.connect(gain);
                gain.connect(masterGain);
                src.start(startAt);
                src.stop(stopAt + 0.02);
                activeSources.push(src);
                if (note.t + note.dur + 0.4 > maxEnd) maxEnd = note.t + note.dur + 0.4;
            }

            stopTimer = setTimeout(() => {
                if (token !== previewToken) return;
                playingPieceIndex = null;
                activeSources = [];
                updatePreviewButton(activePieceIndex());
                inspStatusEl.textContent = '';
            }, Math.ceil(maxEnd * 1000));
        } catch (err) {
            if (token !== previewToken) return;
            inspStatusEl.textContent = 'Preview failed: ' + (err && err.message ? err.message : 'audio unavailable');
            playingPieceIndex = null;
            updatePreviewButton(pieceIdx);
        }
    }

    // -------------------------------------------------------------------------
    // Controls & Events
    // -------------------------------------------------------------------------
    xSelect.addEventListener('change', () => {
        state.xMetric = xSelect.value;
        updatePresets();
        refreshAll();
    });
    ySelect.addEventListener('change', () => {
        state.yMetric = ySelect.value;
        updatePresets();
        refreshAll();
    });
    colorSelect.addEventListener('change', () => {
        state.colorBy = colorSelect.value;
        updateFilterUI();
        drawMap();
    });
    searchInput.addEventListener('input', () => {
        state.search = searchInput.value;
        refreshAll();
    });
    sheetOnlyInput.addEventListener('change', () => {
        state.sheetOnly = sheetOnlyInput.checked;
        refreshAll();
    });
    resetFiltersBtn.addEventListener('click', () => {
        state.selectedComposer = null;
        state.selectedEra = null;
        state.sheetOnly = false;
        state.search = '';
        sheetOnlyInput.checked = false;
        searchInput.value = '';
        refreshAll();
    });
    previewBtn.addEventListener('click', () => {
        const idx = state.lockedPiece !== null ? state.lockedPiece : state.visibleIndices[0];
        if (idx !== undefined && idx !== null) playPreview(idx);
    });
    randomBtn.addEventListener('click', () => {
        if (!state.visibleIndices.length) return;
        const pick = state.visibleIndices[Math.floor(Math.random() * state.visibleIndices.length)];
        stopPreview();
        state.lockedPiece = pick;
        state.hoveredPiece = null;
        drawTimeline();
        drawMap();
        updateInspector();
    });

    window.addEventListener('keydown', (ev) => {
        const tag = ev.target && ev.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A') return;
        if (ev.code === 'Space') {
            ev.preventDefault();
            const idx = activePieceIndex();
            if (idx !== null) playPreview(idx);
        } else if (ev.key === 'Escape') {
            stopPreview();
            state.hoveredPiece = null;
            drawMap();
            updateInspector();
        }
    });

    window.addEventListener('pagehide', stopPreview);

    function refreshAll() {
        computeVisible();
        if (state.visibleIndices.length && (state.lockedPiece === null || !state.visibleIndices.includes(state.lockedPiece))) {
            // Keep locked piece if it's still visible; otherwise select the first visible work.
            state.lockedPiece = state.visibleIndices[0];
        }
        updateFilterUI();
        updateTimelineReadout();
        drawTimeline();
        drawMap();
        updateInspector();
    }

    // Resize & theme observers
    const ro = new ResizeObserver(() => {
        drawTimeline();
        drawMap();
    });
    ro.observe(document.querySelector('main'));

    new MutationObserver(() => {
        updateFilterUI();
        drawTimeline();
        drawMap();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Initial render
    updatePresets();
    refreshAll();
})();
