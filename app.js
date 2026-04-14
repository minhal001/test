// ============================================================
//  Kodak Vision 2383 Film Converter
//  Core application logic
// ============================================================

const state = {
    photos: [],        // { file, name, originalImg, processedCanvas, thumb }
    selectedIdx: -1,
    showBefore: false,
    view: 'loupe',     // 'loupe' | 'grid'
    zoom: 'fit',
    debounceTimer: null,
    params: {
        // Tone
        exposure:    0,
        contrast:    0,
        highlights:  0,
        shadows:     0,
        whites:      0,
        blacks:      0,
        // Color
        temperature: 0,
        tint:        0,
        vibrance:    0,
        saturation:  0,
        // Kodak 2383
        blackLift:   30,
        orangeBase:  25,
        shadowTint:  50,
        hlWarm:      50,
        halation:    20,
        grainAmount: 20,
        grainSize:   3,
        // Toggles (read from DOM each render)
        effectEnabled: true,
        grainEnabled:  true,
    },
};

// ============================================================
//  File Import
// ============================================================

function handleFileImport(event) {
    const files = Array.from(event.target.files).filter(f => f.type.startsWith('image/'));
    event.target.value = '';
    if (files.length) loadFiles(files);
}

function loadFiles(files) {
    if (!files.length) return;
    showProcessing(true, `Loading ${files.length} photo${files.length > 1 ? 's' : ''}…`);

    let loaded = 0;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                state.photos.push({
                    file,
                    name: file.name,
                    originalImg: img,
                    processedCanvas: null,
                    thumb: makeThumb(img),
                });
                loaded++;
                refreshFileList();
                refreshFilmstrip();

                if (loaded === files.length) {
                    showProcessing(false);
                    if (state.selectedIdx === -1) selectPhoto(0);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function makeThumb(img) {
    const SIZE = 120;
    const c = document.createElement('canvas');
    c.width = SIZE;
    c.height = SIZE;
    const ctx = c.getContext('2d');
    const s = Math.max(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
    return c.toDataURL('image/jpeg', 0.72);
}

// ============================================================
//  Photo Selection & Processing
// ============================================================

function selectPhoto(idx) {
    if (idx < 0 || idx >= state.photos.length) return;
    state.selectedIdx = idx;
    state.showBefore = false;
    syncBeforeAfterBtns();
    refreshFileList();
    refreshFilmstrip();
    processAndDisplay();
}

function processAndDisplay() {
    if (state.selectedIdx < 0) return;
    const photo = state.photos[state.selectedIdx];

    showProcessing(true, 'Applying Kodak Vision 2383…');
    requestAnimationFrame(() => {
        setTimeout(() => {
            readToggles();
            photo.processedCanvas = applyKodak2383(photo.originalImg, state.params);
            showProcessing(false);
            renderMainView(photo);
            updateNavigator(photo);
            updateHistogram(photo);
            refreshFileList();
            refreshFilmstrip();
        }, 16);
    });
}

function readToggles() {
    state.params.effectEnabled = document.getElementById('effectEnabled').checked;
    state.params.grainEnabled  = document.getElementById('grainEnabled').checked;
}

// ============================================================
//  Kodak Vision 2383 Emulation
// ============================================================

function applyKodak2383(img, p) {
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    if (!p.effectEnabled) return canvas;

    const imgData = ctx.getImageData(0, 0, W, H);
    const data    = imgData.data;
    const len     = data.length;

    // --- Normalise parameters ---
    const blackLift  = p.blackLift  / 100;   // 0–1
    const orangeBase = p.orangeBase / 100;
    const shadowTint = p.shadowTint / 100;
    const hlWarm     = p.hlWarm     / 100;
    const halation   = p.halation   / 100;

    const exposure   = p.exposure   / 100;   // –1 … +1
    const contrast   = p.contrast   / 100;
    const highlights = p.highlights / 100;
    const shadows_   = p.shadows    / 100;
    const whites_    = p.whites     / 100;
    const blacks_    = p.blacks     / 100;
    const temperature= p.temperature/ 100;
    const tint_      = p.tint       / 100;
    const vibrance   = p.vibrance   / 100;
    const saturation = p.saturation / 100;

    // --- Build per-channel LUTs (256 entries) ---
    const lutR = new Uint8Array(256);
    const lutG = new Uint8Array(256);
    const lutB = new Uint8Array(256);

    for (let i = 0; i < 256; i++) {
        let t = i / 255;

        // 1. Lift blacks — characteristic print-film toe
        t = t * (1 - blackLift * 0.32) + blackLift * 0.075;

        // 2. Exposure (stops)
        t = t * Math.pow(2, exposure * 2.2);

        // 3. Print-film contrast curve (slightly softer than digital)
        const cm = 0.78 + contrast * 0.14;
        t = (t - 0.5) * cm + 0.5;

        // 4. Shadows / highlights roll-off
        if (t < 0.5) {
            t += shadows_ * 0.22 * Math.pow(1 - t * 2, 1.4);
        } else {
            t += highlights * 0.22 * Math.pow((t - 0.5) * 2, 0.6) * (1 - (t - 0.5) * 2);
        }

        // 5. Whites / blacks
        t += whites_ * 0.12 * t * t;
        t += blacks_ * 0.10 * (1 - (1 - t) * (1 - t));

        t = Math.max(0, Math.min(1, t));

        let r = t, g = t, b = t;

        // 6. White balance — temperature & tint
        r += temperature * 0.09;
        b -= temperature * 0.09;
        g += tint_ * 0.07;

        // 7. Kodak 2383 split-toning
        //    Shadows  → blue-teal crossover
        const sAmt = Math.pow(Math.max(0, 1 - t * 2.2), 1.6);
        r -= sAmt * shadowTint * 0.20;
        g -= sAmt * shadowTint * 0.05;
        b += sAmt * shadowTint * 0.28;

        //    Highlights → warm amber
        const hAmt = Math.pow(Math.max(0, t * 2 - 1), 1.2);
        r += hAmt * hlWarm * 0.22;
        g += hAmt * hlWarm * 0.09;
        b -= hAmt * hlWarm * 0.14;

        // 8. Overall orange base (print-film dye base)
        r += orangeBase * 0.14;
        g += orangeBase * 0.04;
        b -= orangeBase * 0.10;

        // 9. Halation — red/orange bloom in bright areas
        if (t > 0.65) {
            const halo = ((t - 0.65) / 0.35);
            r += halo * halation * 0.14;
            g += halo * halation * 0.03;
        }

        lutR[i] = Math.round(Math.max(0, Math.min(1, r)) * 255);
        lutG[i] = Math.round(Math.max(0, Math.min(1, g)) * 255);
        lutB[i] = Math.round(Math.max(0, Math.min(1, b)) * 255);
    }

    // --- Apply LUTs + vibrance / saturation ---
    const satMult = 1 + (saturation + vibrance * 0.6) * 0.9;

    for (let i = 0; i < len; i += 4) {
        let r = lutR[data[i]];
        let g = lutG[data[i + 1]];
        let b = lutB[data[i + 2]];

        if (satMult !== 1) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            r = lum + (r - lum) * satMult;
            g = lum + (g - lum) * satMult;
            b = lum + (b - lum) * satMult;
        }

        data[i]     = r < 0 ? 0 : r > 255 ? 255 : r;
        data[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
        data[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }

    ctx.putImageData(imgData, 0, 0);

    // --- Film grain ---
    if (p.grainEnabled && p.grainAmount > 0) {
        addFilmGrain(ctx, W, H, p.grainAmount / 100, p.grainSize);
    }

    return canvas;
}

function addFilmGrain(ctx, W, H, amount, size) {
    // Create noise canvas at reduced resolution for performance, then scale up
    const scale   = Math.max(1, Math.round(size * 0.8));
    const nW      = Math.ceil(W / scale);
    const nH      = Math.ceil(H / scale);
    const nc      = document.createElement('canvas');
    nc.width  = nW;
    nc.height = nH;
    const nCtx = nc.getContext('2d');
    const nd   = nCtx.createImageData(nW, nH);
    const d    = nd.data;

    for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() - 0.5) * amount * 255 * 1.4;
        d[i] = d[i + 1] = d[i + 2] = 128 + v;
        d[i + 3] = Math.min(255, Math.abs(v) * 2.2);
    }
    nCtx.putImageData(nd, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.38;
    // Scale noise up to fill the canvas
    ctx.drawImage(nc, 0, 0, W, H);
    ctx.restore();
}

// ============================================================
//  Render helpers
// ============================================================

function renderMainView(photo) {
    const canvas     = document.getElementById('mainCanvas');
    const emptyState = document.getElementById('emptyState');
    const baBar      = document.getElementById('baBar');

    emptyState.style.display = 'none';
    canvas.style.display     = 'block';
    baBar.style.display      = 'flex';

    const src = state.showBefore ? photo.originalImg : photo.processedCanvas;
    canvas.width  = src.width  || src.naturalWidth;
    canvas.height = src.height || src.naturalHeight;
    canvas.getContext('2d').drawImage(src, 0, 0);

    applyZoom(canvas);

    document.getElementById('imageInfo').textContent =
        `${photo.name}  —  ${photo.originalImg.naturalWidth} × ${photo.originalImg.naturalHeight}`;

    // Refresh grid if visible
    if (state.view === 'grid') renderGridView();
}

function applyZoom(canvas) {
    if (state.zoom === 'fit') {
        canvas.style.maxWidth  = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.width     = '';
        canvas.style.height    = '';
    } else {
        canvas.style.maxWidth  = 'none';
        canvas.style.maxHeight = 'none';
        canvas.style.width     = canvas.width  + 'px';
        canvas.style.height    = canvas.height + 'px';
    }
}

function updateNavigator(photo) {
    const nc  = document.getElementById('navigatorCanvas');
    const src = photo.processedCanvas || photo.originalImg;
    nc.getContext('2d').drawImage(src, 0, 0, nc.width, nc.height);
}

function updateHistogram(photo) {
    const src = photo.processedCanvas || photo.originalImg;
    const tmp = document.createElement('canvas');
    const maxDim = 400; // sample at reduced size for speed
    const scale  = Math.min(1, maxDim / Math.max(src.width || src.naturalWidth, src.height || src.naturalHeight));
    tmp.width  = Math.round((src.width  || src.naturalWidth)  * scale);
    tmp.height = Math.round((src.height || src.naturalHeight) * scale);
    const tc   = tmp.getContext('2d');
    tc.drawImage(src, 0, 0, tmp.width, tmp.height);

    const d = tc.getImageData(0, 0, tmp.width, tmp.height).data;
    const r = new Uint32Array(256);
    const g = new Uint32Array(256);
    const b = new Uint32Array(256);
    const l = new Uint32Array(256);

    for (let i = 0; i < d.length; i += 4) {
        r[d[i]]++;
        g[d[i + 1]]++;
        b[d[i + 2]]++;
        l[Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])]++;
    }

    let peak = 1;
    for (let i = 1; i < 256; i++) peak = Math.max(peak, r[i], g[i], b[i]);

    const hc   = document.getElementById('histogramCanvas');
    const hCtx = hc.getContext('2d');
    const W    = hc.width;
    const H    = hc.height;

    hCtx.clearRect(0, 0, W, H);
    hCtx.fillStyle = '#111';
    hCtx.fillRect(0, 0, W, H);

    function drawCh(bins, color, alpha) {
        hCtx.beginPath();
        hCtx.strokeStyle = color;
        hCtx.lineWidth   = 1;
        hCtx.globalAlpha = alpha;
        for (let i = 0; i < 256; i++) {
            const x = (i / 255) * (W - 1);
            const y = H - (bins[i] / peak) * (H - 2) - 1;
            i === 0 ? hCtx.moveTo(x, y) : hCtx.lineTo(x, y);
        }
        hCtx.stroke();
        hCtx.globalAlpha = 1;
    }

    drawCh(r, '#ff5555', 0.55);
    drawCh(g, '#55ee55', 0.55);
    drawCh(b, '#5599ff', 0.55);
    drawCh(l, '#cccccc', 0.85);
}

// ============================================================
//  UI: File list & filmstrip
// ============================================================

function refreshFileList() {
    const list = document.getElementById('fileList');
    const cnt  = document.getElementById('fileCount');
    cnt.textContent = `${state.photos.length} photo${state.photos.length !== 1 ? 's' : ''}`;

    if (!state.photos.length) {
        list.innerHTML = '<div class="empty-list-msg">Import photos to begin</div>';
        return;
    }

    list.innerHTML = state.photos.map((p, i) => `
        <div class="file-item ${i === state.selectedIdx ? 'active' : ''}" onclick="selectPhoto(${i})">
            <img class="file-item-thumb" src="${p.thumb}" alt="">
            <div class="file-item-info">
                <div class="file-item-name" title="${p.name}">${p.name}</div>
                <div class="file-item-status ${p.processedCanvas ? 'done' : ''}">
                    ${p.processedCanvas ? '&#10003; Processed' : 'Pending'}
                </div>
            </div>
        </div>
    `).join('');
}

function refreshFilmstrip() {
    const strip = document.getElementById('filmstrip');

    if (!state.photos.length) {
        strip.innerHTML = '<div class="filmstrip-empty">No photos — import to begin</div>';
        return;
    }

    strip.innerHTML = state.photos.map((p, i) => `
        <div class="filmstrip-item ${i === state.selectedIdx ? 'active' : ''}" onclick="selectPhoto(${i})" title="${p.name}">
            <img src="${p.thumb}" alt="${p.name}">
            ${p.processedCanvas ? '<div class="fs-badge">2383</div>' : ''}
        </div>
    `).join('');
}

// ============================================================
//  Controls
// ============================================================

function sliderChanged(el, param, valId) {
    const v = Number(el.value);
    state.params[param] = v;
    document.getElementById(valId).textContent = v;
    scheduleUpdate();
}

function scheduleUpdate() {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => processAndDisplay(), 160);
}

const FILM_DEFAULTS = {
    blackLift:   30,
    orangeBase:  25,
    shadowTint:  50,
    hlWarm:      50,
    halation:    20,
    grainAmount: 20,
    grainSize:   3,
};

function resetFilmParams() {
    Object.entries(FILM_DEFAULTS).forEach(([k, v]) => {
        state.params[k] = v;
        const slider = document.getElementById('slider' + k[0].toUpperCase() + k.slice(1));
        const valEl  = document.getElementById('val'    + k[0].toUpperCase() + k.slice(1));
        if (slider) slider.value = v;
        if (valEl)  valEl.textContent = v;
    });
    scheduleUpdate();
}

// ============================================================
//  View / Before-After
// ============================================================

function setView(view) {
    state.view = view;
    document.getElementById('btnLoupe').classList.toggle('active', view === 'loupe');
    document.getElementById('btnGrid').classList.toggle('active', view === 'grid');

    const mc      = document.getElementById('mainCanvas');
    const gv      = document.getElementById('gridView');
    const baBar   = document.getElementById('baBar');
    const isEmpty = document.getElementById('emptyState');

    if (view === 'grid') {
        mc.style.display    = 'none';
        baBar.style.display = 'none';
        isEmpty.style.display = 'none';
        gv.style.display    = 'grid';
        renderGridView();
    } else {
        gv.style.display = 'none';
        if (state.selectedIdx >= 0) {
            mc.style.display    = 'block';
            baBar.style.display = 'flex';
            renderMainView(state.photos[state.selectedIdx]);
        } else {
            isEmpty.style.display = 'flex';
        }
    }
}

function renderGridView() {
    const gv = document.getElementById('gridView');
    if (!state.photos.length) {
        gv.innerHTML = '<div style="color:var(--text-dim);text-align:center;grid-column:1/-1;padding-top:40px;">No photos imported</div>';
        return;
    }
    gv.innerHTML = state.photos.map((p, i) => {
        const src = p.processedCanvas ? p.processedCanvas.toDataURL('image/jpeg', 0.7) : p.thumb;
        return `
            <div class="grid-item ${i === state.selectedIdx ? 'active' : ''}"
                 onclick="selectPhoto(${i}); setView('loupe')">
                <img src="${src}" alt="${p.name}">
                <div class="grid-item-label" title="${p.name}">${p.name}</div>
            </div>
        `;
    }).join('');
}

function setZoom(zoom) {
    state.zoom = zoom;
    document.getElementById('btnZoomFit').classList.toggle('active', zoom === 'fit');
    document.getElementById('btnZoom100').classList.toggle('active', zoom === '100');
    const mc = document.getElementById('mainCanvas');
    if (mc.style.display !== 'none') applyZoom(mc);
}

function setPreview(mode) {
    state.showBefore = (mode === 'before');
    syncBeforeAfterBtns();
    if (state.selectedIdx >= 0) renderMainView(state.photos[state.selectedIdx]);
}

function syncBeforeAfterBtns() {
    document.getElementById('btnBefore').classList.toggle('active',  state.showBefore);
    document.getElementById('btnAfter' ).classList.toggle('active', !state.showBefore);
}

// ============================================================
//  Export
// ============================================================

function exportCurrent() {
    if (state.selectedIdx < 0) return;
    const photo = state.photos[state.selectedIdx];
    if (!photo.processedCanvas) { alert('Photo not yet processed.'); return; }
    downloadCanvas(photo.processedCanvas, photo.name);
}

async function exportAll() {
    if (!state.photos.length) return;

    const prog   = document.getElementById('exportProgress');
    const fill   = document.getElementById('progressFill');
    const text   = document.getElementById('progressText');
    prog.classList.add('active');

    readToggles();

    for (let i = 0; i < state.photos.length; i++) {
        const photo = state.photos[i];
        text.textContent = `Processing ${i + 1} / ${state.photos.length}…`;
        fill.style.width = `${(i / state.photos.length) * 50}%`;

        if (!photo.processedCanvas) {
            await new Promise(resolve => setTimeout(() => {
                photo.processedCanvas = applyKodak2383(photo.originalImg, state.params);
                resolve();
            }, 10));
        }
        refreshFileList();
    }

    for (let i = 0; i < state.photos.length; i++) {
        text.textContent = `Exporting ${i + 1} / ${state.photos.length}…`;
        fill.style.width = `${50 + ((i + 1) / state.photos.length) * 50}%`;
        await new Promise(r => setTimeout(r, 80));
        downloadCanvas(state.photos[i].processedCanvas, state.photos[i].name);
    }

    fill.style.width = '100%';
    text.textContent = `Done! ${state.photos.length} photo${state.photos.length > 1 ? 's' : ''} exported.`;
    setTimeout(() => {
        prog.classList.remove('active');
        fill.style.width = '0%';
    }, 3500);
}

function downloadCanvas(canvas, originalName) {
    const fmt    = document.getElementById('exportFormat').value;
    const qual   = parseInt(document.getElementById('sliderQuality').value) / 100;
    const mime   = fmt === 'png' ? 'image/png' : fmt === 'webp' ? 'image/webp' : 'image/jpeg';
    const ext    = fmt === 'png' ? '.png'       : fmt === 'webp' ? '.webp'       : '.jpg';
    const base   = originalName.replace(/\.[^.]+$/, '');
    const a      = document.createElement('a');
    a.href       = canvas.toDataURL(mime, qual);
    a.download   = `${base}_2383${ext}`;
    a.click();
}

// ============================================================
//  Panel collapsing
// ============================================================

function initCollapsibles() {
    document.querySelectorAll('.collapsible').forEach(el => {
        el.style.maxHeight = el.scrollHeight + 'px';
    });
}

function toggleSection(bodyId) {
    const body   = document.getElementById(bodyId);
    const header = body.previousElementSibling;
    const isOpen = !body.classList.contains('collapsed');

    if (isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(() => {
            body.classList.add('collapsed');
            header.classList.add('collapsed');
        });
    } else {
        body.classList.remove('collapsed');
        header.classList.remove('collapsed');
        body.style.maxHeight = body.scrollHeight + 400 + 'px';
    }
}

function toggleRPSection(bodyId) {
    toggleSection(bodyId);
}

// ============================================================
//  UI helpers
// ============================================================

function showProcessing(show, msg = 'Processing…') {
    const el = document.getElementById('processingIndicator');
    el.classList.toggle('active', show);
    if (show) document.getElementById('processingText').textContent = msg;
}

// ============================================================
//  Drag & Drop
// ============================================================

document.body.addEventListener('dragover', e => {
    e.preventDefault();
    document.getElementById('dropZone').classList.add('dragover');
});

document.body.addEventListener('dragleave', e => {
    if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
        document.getElementById('dropZone').classList.remove('dragover');
    }
});

document.body.addEventListener('drop', e => {
    e.preventDefault();
    document.getElementById('dropZone').classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) loadFiles(files);
});

// ============================================================
//  Init
// ============================================================
initCollapsibles();
