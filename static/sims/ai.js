/* Self-Taught — AI & machine-learning simulation widgets (static/sims/ai.js)
 * Registers: gradient_descent, perceptron, nn_playground, kmeans, attention_viz,
 *            ngram_predictor, bandit, gridworld_rl, agent_sim, tokenizer
 * Vanilla JS only. Built against the SelfTaughtSims host API (static/sims/core.js, docs/CONTRACTS.md §3).
 * Every algorithm is implemented for real (manual backprop, Lloyd's algorithm, BPE training, TD control, …)
 * and work per frame is capped so the UI stays responsive on extreme settings.
 */
(function () {
  "use strict";
  const Sims = window.SelfTaughtSims;
  if (!Sims || typeof Sims.register !== "function") { console.error("[ai sims] core.js must be loaded before ai.js"); return; }

  // ═══════════════════════════════════════════════════════════════ shared helpers
  const FONT = "Inter, system-ui, sans-serif";
  function makeRng(seed) {
    let a = (Math.floor(Number(seed) || 1) >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gaussian(rand) { let u = 0; while (u === 0) u = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand()); }
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const num = (v, d) => { v = Number(v); return Number.isFinite(v) ? v : d; };
  function fmt(v, d) {
    if (typeof v !== "number" || Number.isNaN(v)) return "NaN";
    if (!Number.isFinite(v)) return v > 0 ? "∞" : "−∞";
    if (d == null) { const a = Math.abs(v); d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3; }
    return v.toFixed(d);
  }
  const pct = (v) => fmt(100 * v, 1) + " %";
  function softmax(logits, temp) {
    const t = Math.max(1e-6, num(temp, 1)); let m = -Infinity;
    for (let i = 0; i < logits.length; i++) if (logits[i] > m) m = logits[i];
    const out = new Array(logits.length); let s = 0;
    for (let i = 0; i < logits.length; i++) { out[i] = Math.exp((logits[i] - m) / t); s += out[i]; }
    for (let i = 0; i < out.length; i++) out[i] = s > 0 ? out[i] / s : 1 / out.length;
    return out;
  }
  function argmax(a) { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }
  function sampleIndex(probs, rand) { let r = rand(), acc = 0; for (let i = 0; i < probs.length; i++) { acc += probs[i]; if (r < acc) return i; } return probs.length - 1; }
  function shuffle(arr, rand) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function hexToRgb(hex) {
    if (Array.isArray(hex)) return hex;
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "")); if (!m) return [124, 156, 255];
    const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, a) { const c = hexToRgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a == null ? 1 : clamp(num(a, 1), 0, 1)})`; }
  function ramp(stops, t) {
    t = clamp(num(t, 0), 0, 1) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(t)), f = t - i, a = stops[i], b = stops[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }
  const VIRIDIS = [[30, 10, 60], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
  /** Offscreen ImageData heatmap. fn(i, j) -> [r,g,b] or [r,g,b,a]. render() recomputes; blit() redraws the cached image. */
  function makeHeatmap() {
    const off = document.createElement("canvas"); let img = null;
    function blit(ctx, x, y, w, h, smooth) {
      if (!off.width || !off.height) return;
      ctx.save(); ctx.imageSmoothingEnabled = !!smooth; ctx.drawImage(off, x, y, Math.max(1, w), Math.max(1, h)); ctx.restore();
    }
    function render(ctx, x, y, w, h, nx, ny, fn, smooth) {
      nx = clamp(nx | 0, 1, 512); ny = clamp(ny | 0, 1, 512);
      if (off.width !== nx || off.height !== ny) { off.width = nx; off.height = ny; img = null; }
      const octx = off.getContext("2d");
      if (!img) img = octx.createImageData(nx, ny);
      const d = img.data;
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const c = fn(i, j) || [0, 0, 0, 0], o = (j * nx + i) * 4;
        d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = c.length > 3 ? c[3] : 255;
      }
      octx.putImageData(img, 0, 0);
      blit(ctx, x, y, w, h, smooth);
    }
    return { render, blit };
  }
  function text(ctx, s, x, y, o) {
    o = o || {}; ctx.save(); ctx.fillStyle = o.color || "#e8ebff"; ctx.font = `${o.weight || "400"} ${o.size || 12}px ${FONT}`;
    ctx.textAlign = o.align || "left"; ctx.textBaseline = o.baseline || "alphabetic"; ctx.fillText(String(s), x, y); ctx.restore();
  }
  function dot(ctx, x, y, r, fill, stroke, lw) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, num(r, 1)), 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.lineWidth = lw || 1; ctx.strokeStyle = stroke; ctx.stroke(); } }
  function ring(ctx, x, y, r, stroke, lw) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, num(r, 1)), 0, Math.PI * 2); ctx.lineWidth = lw || 1; ctx.strokeStyle = stroke; ctx.stroke(); }
  function line(ctx, x1, y1, x2, y2, stroke, lw) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  function arrow(ctx, x1, y1, x2, y2, stroke, lw) {
    line(ctx, x1, y1, x2, y2, stroke, lw);
    const a = Math.atan2(y2 - y1, x2 - x1), h = 4 + (lw || 1) * 2;
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)); ctx.lineTo(x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)); ctx.closePath(); ctx.fillStyle = stroke; ctx.fill();
  }
  /** Maps data coords to a pixel box (y up). */
  function view(box, x0, x1, y0, y1) {
    const dx = (x1 - x0) || 1, dy = (y1 - y0) || 1;
    return {
      x: (v) => box.x + (v - x0) / dx * box.w, y: (v) => box.y + box.h - (v - y0) / dy * box.h,
      ix: (px) => x0 + (px - box.x) / box.w * dx, iy: (py) => y0 + (box.y + box.h - py) / box.h * dy,
    };
  }
  /** Minimal line chart. series: [{data: [y…] | [[x,y]…], color, label, marker, width}]; o: {title, xMin, xMax, yMin, yMax} */
  function plot(ctx, C, box, series, o) {
    o = o || {};
    const pad = { l: 38, r: 8, t: o.title ? 20 : 8, b: 18 };
    const ib = { x: box.x + pad.l, y: box.y + pad.t, w: Math.max(10, box.w - pad.l - pad.r), h: Math.max(10, box.h - pad.t - pad.b) };
    ctx.save();
    ctx.fillStyle = rgba(C.panel || "#161a2e", 0.7); ctx.fillRect(box.x, box.y, box.w, box.h);
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity, any = false;
    const pts = series.map((s) => {
      const d = (s.data || []).map((p, i) => (Array.isArray(p) ? p : [i, p])).filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
      d.forEach((p) => { any = true; if (p[0] < xmin) xmin = p[0]; if (p[0] > xmax) xmax = p[0]; if (p[1] < ymin) ymin = p[1]; if (p[1] > ymax) ymax = p[1]; });
      return d;
    });
    if (!any) { xmin = 0; xmax = 1; ymin = 0; ymax = 1; }
    if (o.xMin != null) xmin = o.xMin; if (o.xMax != null) xmax = o.xMax;
    if (o.yMin != null) ymin = o.yMin; if (o.yMax != null) ymax = o.yMax;
    if (!(xmax - xmin > 1e-9)) xmax = xmin + 1;
    if (!(ymax - ymin > 1e-9)) { ymax = ymin + 1; }
    const padY = (ymax - ymin) * 0.06; if (o.yMin == null) ymin -= padY; if (o.yMax == null) ymax += padY;
    const v = view(ib, xmin, xmax, ymin, ymax), span = Math.abs(ymax - ymin), dec = span >= 50 ? 0 : span >= 5 ? 1 : 2;
    for (let i = 0; i <= 4; i++) {
      const yy = ib.y + ib.h * i / 4; line(ctx, ib.x, yy, ib.x + ib.w, yy, C.grid);
      text(ctx, fmt(ymax - (ymax - ymin) * i / 4, dec), ib.x - 4, yy + 3, { color: C.muted, size: 9, align: "right" });
    }
    ctx.strokeStyle = C.axis; ctx.lineWidth = 1; ctx.strokeRect(ib.x + 0.5, ib.y + 0.5, ib.w, ib.h);
    text(ctx, fmt(xmin, 0), ib.x, ib.y + ib.h + 12, { color: C.muted, size: 9 });
    text(ctx, fmt(xmax, 0), ib.x + ib.w, ib.y + ib.h + 12, { color: C.muted, size: 9, align: "right" });
    if (o.title) text(ctx, o.title, box.x + 6, box.y + 13, { color: C.text, size: 11, weight: "600" });
    ctx.beginPath(); ctx.rect(ib.x, ib.y, ib.w, ib.h); ctx.clip();
    pts.forEach((d, si) => {
      const s = series[si]; if (!d.length) return;
      ctx.strokeStyle = s.color || C.primary; ctx.lineWidth = s.width || 1.5; ctx.beginPath();
      d.forEach((p, i) => { const px = v.x(p[0]), py = v.y(p[1]); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
      ctx.stroke();
      if (s.marker) d.forEach((p) => dot(ctx, v.x(p[0]), v.y(p[1]), 2.5, s.color || C.primary));
    });
    ctx.restore();
    let lx = box.x + box.w - 8; // legend, right-aligned on the title row
    series.slice().reverse().forEach((s) => {
      if (!s.label) return; ctx.save(); ctx.font = `400 10px ${FONT}`; const w = ctx.measureText(s.label).width; ctx.restore();
      text(ctx, s.label, lx, box.y + 13, { color: s.color || C.primary, size: 10, align: "right" }); lx -= w + 12;
    });
    return v;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function gammaSample(rand, a) { // Marsaglia–Tsang
    if (a < 1) return gammaSample(rand, a + 1) * Math.pow(rand(), 1 / a);
    const d = a - 1 / 3, c = 1 / Math.sqrt(9 * d);
    for (let k = 0; k < 1000; k++) {
      let x, v; do { x = gaussian(rand); v = 1 + c * x; } while (v <= 0);
      v = v * v * v; const u = rand();
      if (u < 1 - 0.0331 * x * x * x * x || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
    }
    return d;
  }
  function betaSample(rand, a, b) { const x = gammaSample(rand, a), y = gammaSample(rand, b); return x + y > 0 ? x / (x + y) : 0.5; }

  /** Tiny shared corpus (simple English about science & robots) for the n-gram model and the BPE tokeniser. */
  const CORPUS = `Robots are machines that can sense the world and act in it. A robot uses sensors to measure light, sound, distance and temperature. The robot then uses a computer to decide what to do next. Many robots move with wheels, and some robots walk on legs.
Science is a way of asking questions about nature. A scientist makes a guess, called a hypothesis, and then tests it with an experiment. If the experiment does not agree with the guess, the scientist changes the guess. Good science depends on careful measurement.
The robot in the laboratory can pick up a red ball and place it in a blue box. The robot learned to do this by trying many times. Each time the robot dropped the ball, it adjusted the grip of its hand. After a thousand trials the robot could pick up the ball almost every time.
Water boils at one hundred degrees at sea level. When water boils, it turns into steam. Steam can push a piston, and a piston can turn a wheel. This simple idea powered the first steam engines and changed the world.
A neural network is a computer program inspired by the brain. The network learns from examples by adjusting many small numbers called weights. With enough examples, the network can recognise faces, translate languages and even control a robot arm.
The planets move around the sun because of gravity. Gravity pulls every object toward every other object. The moon moves around the earth for the same reason. Scientists use telescopes to measure the motion of the planets and the stars.
Robots can explore places that are too dangerous for people. A robot can roll across the surface of mars, dive to the bottom of the ocean, or search a burning building. Each robot carries a camera and sends pictures back to the scientists.
Energy can change from one form to another, but it can not be created or destroyed. A battery stores chemical energy. A motor turns electrical energy into motion. A robot must manage its energy carefully, or it will stop in the middle of a task.
Robots can learn from their mistakes. When a robot bumps into a wall, it can record the place and plan a new path. Over time the robot builds a map of the room. Scientists call this process learning, and it is the heart of modern robots.`;

  // ═══════════════════════════════════════════════════════════════ 1. gradient_descent
  Sims.register({
    id: "gradient_descent",
    name: "Gradient Descent Explorer",
    domains: ["ai", "math"],
    description: "Roll SGD, momentum or Adam down 2-D loss surfaces drawn as log-spaced contour heatmaps. Click anywhere on the surface to choose where the optimiser starts.",
    params: [
      { key: "surface", label: "Loss surface", type: "select", value: "ravine", options: [
        { value: "bowl", label: "Bowl  f = x² + y²" }, { value: "ravine", label: "Ravine  f = x² + 20y²" },
        { value: "saddle", label: "Saddle  f = x² − y² + 0.08y⁴" }, { value: "rosenbrock", label: "Rosenbrock valley (×0.01)" } ] },
      { key: "optimizer", label: "Optimiser", type: "select", value: "sgd", options: [
        { value: "sgd", label: "SGD (plain gradient step)" }, { value: "momentum", label: "Momentum (heavy ball)" }, { value: "adam", label: "Adam" } ] },
      { key: "lr", label: "Learning rate η", type: "range", min: 0.001, max: 1.5, step: 0.001, value: 0.04 },
      { key: "momentum", label: "Momentum β₁ (momentum & Adam)", type: "range", min: 0, max: 0.99, step: 0.01, value: 0.9 },
      { key: "noise", label: "Gradient noise σ (stochastic)", type: "range", min: 0, max: 1, step: 0.01, value: 0 },
      { key: "speed", label: "Steps per frame", type: "range", min: 1, max: 30, step: 1, value: 2 },
    ],
    actions: [
      { label: "▶ / ❚❚ Run", fn: (h) => h.toggle() },
      { label: "Step ×1", fn: (h) => h.step(1) },
      { label: "Restart path", fn: (h) => h.restart() },
      { label: "Start on saddle ridge", fn: (h) => h.ridge() },
    ],
    challenges: [
      { id: "diverge", text: "Make the optimiser diverge: raise η until the loss explodes. On the bowl, at what η does SGD blow up — and why exactly that value?", xp: 10 },
      { id: "ravine_race", text: "On the ravine, reach loss < 0.01 with plain SGD and then with momentum (same η). Which one zig-zags, and which needs fewer steps?", xp: 15 },
      { id: "saddle_stall", text: "Use “Start on saddle ridge”: SGD slides into the saddle point and stalls. Add gradient noise σ > 0 — what frees it, and why is this good news for SGD?", xp: 15 },
      { id: "rosenbrock", text: "Reach loss < 0.001 inside the curved Rosenbrock valley within 3000 steps. Compare SGD and Adam.", xp: 25 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10 }), heat = makeHeatmap(), rand = api.random;
      const SURF = {
        bowl: { f: (x, y) => x * x + y * y, g: (x, y) => [2 * x, 2 * y], box: [-3, 3, -3, 3], start: [-2.4, 2.1], mins: [[0, 0]], fmin: 0 },
        ravine: { f: (x, y) => x * x + 20 * y * y, g: (x, y) => [2 * x, 40 * y], box: [-3, 3, -3, 3], start: [-2.6, 1.6], mins: [[0, 0]], fmin: 0 },
        saddle: { f: (x, y) => x * x - y * y + 0.08 * y * y * y * y, g: (x, y) => [2 * x, -2 * y + 0.32 * y * y * y], box: [-3, 3, -3, 3], start: [-2.4, 0.35], mins: [[0, 2.5], [0, -2.5]], fmin: -3.125 },
        rosenbrock: { f: (x, y) => 0.01 * ((1 - x) * (1 - x) + 100 * (y - x * x) * (y - x * x)), g: (x, y) => [0.01 * (-2 * (1 - x) - 400 * x * (y - x * x)), 2 * (y - x * x)], box: [-2, 2, -1, 3], start: [-1.5, 2.5], mins: [[1, 1]], fmin: 0 },
      };
      let S = SURF.ravine, start = null, path = [], losses = [], step = 0, opt = null, running = true, diverged = false, dirty = true, fieldDirty = true, acc = 0;
      const reached = {};
      function layout() {
        const W = cv.width, H = cv.height, pw = clamp(W * 0.34, 110, 260);
        const box = { x: 8, y: 8, w: Math.max(40, W - pw - 24), h: Math.max(40, H - 16) };
        return { W, H, box, pbox: { x: box.x + box.w + 8, y: 8, w: pw, h: Math.max(40, H - 16) }, v: view(box, S.box[0], S.box[1], S.box[2], S.box[3]) };
      }
      function restart(from) {
        S = SURF[api.params.surface] || SURF.bowl;
        if (from) start = from;
        if (!start) start = S.start.slice();
        path = [start.slice()]; losses = [S.f(start[0], start[1])]; step = 0; diverged = false;
        opt = { v: [0, 0], m: [0, 0], s: [0, 0], t: 0 }; dirty = true; update();
      }
      function doStep() {
        if (diverged) return;
        const p = path[path.length - 1].slice(), kind = String(api.params.optimizer), g = S.g(p[0], p[1]);
        let gx = g[0], gy = g[1];
        const sig = Math.max(0, num(api.params.noise, 0));
        if (sig > 0) { gx += sig * gaussian(rand); gy += sig * gaussian(rand); }
        const lr = Math.max(0, num(api.params.lr, 0.01)), b1 = clamp(num(api.params.momentum, 0.9), 0, 0.999), o = opt;
        o.t++;
        if (kind === "momentum") { o.v[0] = b1 * o.v[0] + gx; o.v[1] = b1 * o.v[1] + gy; p[0] -= lr * o.v[0]; p[1] -= lr * o.v[1]; }
        else if (kind === "adam") {
          const b2 = 0.999, eps = 1e-8;
          o.m[0] = b1 * o.m[0] + (1 - b1) * gx; o.m[1] = b1 * o.m[1] + (1 - b1) * gy;
          o.s[0] = b2 * o.s[0] + (1 - b2) * gx * gx; o.s[1] = b2 * o.s[1] + (1 - b2) * gy * gy;
          const c1 = 1 - Math.pow(b1, o.t), c2 = 1 - Math.pow(b2, o.t);
          p[0] -= lr * (o.m[0] / c1) / (Math.sqrt(o.s[0] / c2) + eps); p[1] -= lr * (o.m[1] / c1) / (Math.sqrt(o.s[1] / c2) + eps);
        } else { p[0] -= lr * gx; p[1] -= lr * gy; }
        step++;
        const L = S.f(p[0], p[1]);
        path.push(p); losses.push(L);
        if (path.length > 4000) { path.splice(0, path.length - 4000); losses.splice(0, losses.length - 4000); }
        if (!Number.isFinite(L) || Math.abs(p[0]) > 1e6 || Math.abs(p[1]) > 1e6 || L > 1e12) {
          diverged = true; running = false; api.award("diverge");
          api.setStatus(`Diverged after ${step} steps: with η = ${fmt(lr, 3)} every step overshoots and lands higher than before (for f = x² + y² plain SGD needs η < 1, for the ravine η < 0.05).`);
          return;
        }
        const surf = String(api.params.surface);
        if (surf === "ravine" && L < 0.01) { reached[kind] = true; if (reached.sgd && reached.momentum) api.award("ravine_race"); }
        if (surf === "rosenbrock" && L < 0.001 && step <= 3000) api.award("rosenbrock");
        if (surf === "saddle" && start[1] === 0 && sig > 0 && Math.abs(p[1]) > 1) api.award("saddle_stall");
      }
      function update() {
        const p = path[path.length - 1], L = losses[losses.length - 1], g = S.g(p[0], p[1]);
        api.readout({
          "Step": step,
          "Loss f(x, y)": fmt(L, Math.abs(L) < 0.01 ? 5 : 3),
          "Position (x, y)": `(${fmt(p[0], 2)}, ${fmt(p[1], 2)})`,
          "‖∇f‖": fmt(Math.hypot(g[0], g[1]), 3),
          "Optimiser": String(api.params.optimizer).toUpperCase() + " · η = " + fmt(num(api.params.lr, 0), 3),
          "State": diverged ? "diverged 💥" : running ? "running ▶" : "paused ❚❚",
        });
      }
      function draw() {
        const L = layout(), ctx = cv.ctx, box = L.box, v = L.v, x0 = S.box[0], x1 = S.box[1], y0 = S.box[2], y1 = S.box[3];
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, L.W, L.H);
        if (fieldDirty) {
          const nx = 160, ny = clamp(Math.round(nx * box.h / box.w), 8, 400), vals = new Float32Array(nx * ny);
          let mn = Infinity, mx = -Infinity;
          for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
            const f = S.f(x0 + (i + 0.5) / nx * (x1 - x0), y1 - (j + 0.5) / ny * (y1 - y0));
            vals[j * nx + i] = f; if (f < mn) mn = f; if (f > mx) mx = f;
          }
          const den = Math.log(1 + (mx - mn)) || 1;
          heat.render(ctx, box.x, box.y, box.w, box.h, nx, ny, (i, j) => {
            const t = Math.log(1 + (vals[j * nx + i] - mn)) / den, c = ramp(VIRIDIS, t), band = t * 16, k = band - Math.floor(band) < 0.12 ? 0.55 : 1;
            return [c[0] * k, c[1] * k, c[2] * k];
          }, true);
          fieldDirty = false;
        } else heat.blit(ctx, box.x, box.y, box.w, box.h, true);
        ctx.strokeStyle = C.axis; ctx.lineWidth = 1; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
        text(ctx, `x ∈ [${x0}, ${x1}]   y ∈ [${y0}, ${y1}]   ★ = global minimum`, box.x + 6, box.y + box.h - 6, { color: C.text, size: 10 });
        ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
        S.mins.forEach((m) => text(ctx, "★", v.x(m[0]), v.y(m[1]) + 5, { color: C.ok, size: 14, align: "center" }));
        const n0 = Math.max(0, path.length - 1500);
        ctx.strokeStyle = C.accent; ctx.lineWidth = 1.5; ctx.beginPath();
        for (let i = n0; i < path.length; i++) {
          const p = path[i], px = v.x(clamp(p[0], x0 - 5, x1 + 5)), py = v.y(clamp(p[1], y0 - 5, y1 + 5));
          if (i === n0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        const s0 = path[0], pe = path[path.length - 1];
        dot(ctx, v.x(s0[0]), v.y(s0[1]), 5, C.text, C.bg, 1.5);
        dot(ctx, v.x(clamp(pe[0], x0 - 5, x1 + 5)), v.y(clamp(pe[1], y0 - 5, y1 + 5)), 6, diverged ? C.danger : C.secondary, C.bg, 1.5);
        ctx.restore();
        const series = losses.slice(-600).map((l) => Math.log10(Math.max(1e-9, l - S.fmin)));
        plot(ctx, C, L.pbox, [{ data: series, color: C.accent, label: "log₁₀(f − f*)" }], { title: "Loss vs step" });
      }
      api.loop((dt) => {
        if (running && !diverged) {
          const n = clamp(num(api.params.speed, 2) | 0, 1, 60);
          for (let i = 0; i < n && !diverged; i++) doStep();
          if (step > 30000) running = false;
          dirty = true; acc += dt; if (acc > 0.12 || diverged || !running) { acc = 0; update(); }
        }
        if (dirty) { draw(); dirty = false; }
        return true;
      });
      api.onParam((k) => {
        if (k === "surface") { start = null; fieldDirty = true; restart(); running = true; }
        else if (k === "optimizer") { restart(); running = true; }
        dirty = true; update();
      });
      api.onResize(() => { fieldDirty = true; dirty = true; });
      api.pointer(cv.canvas, { down: (p) => {
        const L = layout();
        if (p.x < L.box.x || p.x > L.box.x + L.box.w || p.y < L.box.y || p.y > L.box.y + L.box.h) return;
        restart([L.v.ix(p.x), L.v.iy(p.y)]); running = true;
      } });
      api.setStatus("Click the surface to drop the optimiser somewhere else. Dark bands are log-spaced iso-loss contours.");
      restart();
      return {
        toggle() { if (diverged) restart(); running = !running; update(); },
        step(n) { running = false; for (let i = 0; i < (n || 1); i++) doStep(); dirty = true; update(); },
        restart() { restart(); running = true; },
        ridge() {
          if (String(api.params.surface) !== "saddle") api.setParam("surface", "saddle");
          restart([2.5, 0]); running = true;
          api.setStatus("Started exactly on the ridge y = 0: ∂f/∂y is zero there, so noiseless steps never leave the ridge and SGD stalls at the saddle point (0, 0). Add gradient noise to break the symmetry.");
        },
        destroy() {},
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 2. perceptron
  Sims.register({
    id: "perceptron",
    name: "Perceptron Learning Rule",
    domains: ["ai"],
    description: "Rosenblatt's perceptron learns a linear decision boundary one mistake at a time. See why it must converge on separable data — and why XOR defeats it.",
    params: [
      { key: "dataset", label: "Data", type: "select", value: "separable", options: [
        { value: "separable", label: "Linearly separable" }, { value: "overlap", label: "Overlapping (not separable)" }, { value: "xor", label: "XOR" } ] },
      { key: "n", label: "Points", type: "range", min: 10, max: 300, step: 10, value: 80 },
      { key: "lr", label: "Learning rate η", type: "range", min: 0.01, max: 1, step: 0.01, value: 0.2 },
      { key: "speed", label: "Updates per frame", type: "range", min: 1, max: 50, step: 1, value: 2 },
      { key: "paint", label: "Click on empty space adds", type: "select", value: "1", options: [ { value: "1", label: "class +1 (blue)" }, { value: "-1", label: "class −1 (pink)" } ] },
    ],
    actions: [
      { label: "▶ / ❚❚ Train", fn: (h) => h.toggle() },
      { label: "One update", fn: (h) => h.step() },
      { label: "One epoch", fn: (h) => h.epoch() },
      { label: "Reset weights", fn: (h) => h.resetW() },
      { label: "New data", fn: (h) => h.regen() },
    ],
    challenges: [
      { id: "converge", text: "Train on the separable data until a full epoch has zero mistakes. How many epochs did it take, and what guarantees that it stops?", xp: 10 },
      { id: "xor_fail", text: "Switch to XOR and train for 200+ epochs. Why can no single line ever separate the classes?", xp: 15 },
      { id: "lr_invariance", text: "Reset weights and retrain with η = 0.01, then η = 1.0 on the same data. Does η change the epoch count or the final boundary? Explain (hint: w starts at 0).", xp: 15 },
      { id: "flip_labels", text: "Click points to flip their labels until training never converges. What is the smallest number of flips that breaks separability here?", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10 }), heat = makeHeatmap();
      let seed = 11, pts = [], w = [0, 0], b = 0, epoch = 0, idx = 0, order = [], mistakes = 0, hist = [], running = true, converged = false, flips = 0, flash = null, dirty = true, acc = 0;
      let pocket = { w: [0, 0], b: 0, acc: 0 };
      function layout() {
        const W = cv.width, H = cv.height, side = Math.max(40, Math.min(H - 16, W * 0.6)), box = { x: 8, y: (H - side) / 2, w: side, h: side };
        return { W, H, box, v: view(box, -1.1, 1.1, -1.1, 1.1) };
      }
      function gen() {
        const rand = makeRng(seed * 7919 + 13), n = clamp(num(api.params.n, 80) | 0, 4, 500), kind = String(api.params.dataset);
        const ang = rand() * Math.PI * 2, nx = Math.cos(ang), ny = Math.sin(ang), off = (rand() - 0.5) * 0.5;
        pts = [];
        let guard = 0;
        while (pts.length < n && guard++ < n * 50) {
          const x = rand() * 2 - 1, y = rand() * 2 - 1; let label;
          if (kind === "xor") { if (Math.abs(x) < 0.08 || Math.abs(y) < 0.08) continue; label = x * y > 0 ? 1 : -1; }
          else {
            const d = nx * x + ny * y - off;
            if (kind === "separable" && Math.abs(d) < 0.12) continue;
            label = d > 0 ? 1 : -1;
            if (kind === "overlap" && Math.abs(d) < 0.3 && rand() < 0.4) label = -label;
          }
          pts.push({ x, y, label });
        }
        flips = 0; resetW();
      }
      const predict = (p, ww, bb) => (ww[0] * p.x + ww[1] * p.y + bb >= 0 ? 1 : -1);
      function accuracy(ww, bb) { if (!pts.length) return 0; let c = 0; for (const p of pts) if (predict(p, ww, bb) === p.label) c++; return c / pts.length; }
      function newPass() { order = shuffle(pts.map((_, i) => i), api.random); idx = 0; mistakes = 0; }
      function resetW() { w = [0, 0]; b = 0; epoch = 0; hist = []; converged = false; flash = null; newPass(); pocket = { w: [0, 0], b: 0, acc: accuracy([0, 0], 0) }; dirty = true; update(); }
      function finishEpoch() {
        hist.push(mistakes); if (hist.length > 500) hist.shift(); epoch++;
        if (mistakes === 0) {
          converged = true; running = false;
          api.setStatus(`Converged after ${epoch} epoch${epoch === 1 ? "" : "s"}: a full pass with zero mistakes, so the weights can never change again.`);
          if (String(api.params.dataset) === "separable" && flips === 0) api.award("converge");
        } else if (String(api.params.dataset) === "xor" && epoch === 200) { api.award("xor_fail"); api.setStatus("200 epochs on XOR and still making mistakes: no line separates the diagonals, so the updates cycle forever."); }
        if (!converged && epoch >= 3000) { running = false; api.setStatus("Stopped after 3000 epochs without converging — this data is not linearly separable."); }
        newPass();
      }
      // Visit samples until one weight update happens (or the pass ends). Returns false when nothing more can happen.
      function stepUpdate() {
        if (!pts.length || converged) return false;
        for (let visits = 0; visits <= pts.length; visits++) {
          if (idx >= order.length) { finishEpoch(); return !converged; }
          const p = pts[order[idx++]];
          if (predict(p, w, b) !== p.label) {
            const lr = Math.max(0, num(api.params.lr, 0.2));
            w[0] += lr * p.label * p.x; w[1] += lr * p.label * p.y; b += lr * p.label; mistakes++; flash = { p, t: 1 };
            const a = accuracy(w, b); if (a > pocket.acc) pocket = { w: w.slice(), b, acc: a };
            return true;
          }
        }
        return true;
      }
      function update() {
        api.readout({ "Epoch": epoch, "Accuracy": pct(accuracy(w, b)), "Mistakes (this pass)": mistakes, "Best so far (pocket)": pct(pocket.acc), "Weights w": `(${fmt(w[0], 2)}, ${fmt(w[1], 2)})`, "Bias b": fmt(b, 2), "Label flips": flips });
      }
      function draw() {
        const L = layout(), ctx = cv.ctx, box = L.box, v = L.v, PR = hexToRgb(C.primary), SE = hexToRgb(C.secondary), hasW = w[0] !== 0 || w[1] !== 0;
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, L.W, L.H);
        if (hasW) {
          const G = 48;
          heat.render(ctx, box.x, box.y, box.w, box.h, G, G, (i, j) => { const c = w[0] * (-1.1 + (i + 0.5) / G * 2.2) + w[1] * (1.1 - (j + 0.5) / G * 2.2) + b >= 0 ? PR : SE; return [c[0], c[1], c[2], 48]; }, false);
        }
        for (let g = -1; g <= 1; g += 0.5) { line(ctx, v.x(g), box.y, v.x(g), box.y + box.h, C.grid); line(ctx, box.x, v.y(g), box.x + box.w, v.y(g), C.grid); }
        ctx.strokeStyle = C.axis; ctx.lineWidth = 1; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
        if (hasW) {
          ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
          const e = Math.abs(w[1]) > Math.abs(w[0]) ? [[-1.1, -(w[0] * -1.1 + b) / w[1]], [1.1, -(w[0] * 1.1 + b) / w[1]]] : [[-(w[1] * -1.1 + b) / w[0], -1.1], [-(w[1] * 1.1 + b) / w[0], 1.1]];
          line(ctx, v.x(e[0][0]), v.y(e[0][1]), v.x(e[1][0]), v.y(e[1][1]), C.accent, 2);
          const n2 = w[0] * w[0] + w[1] * w[1], ox = -b * w[0] / n2, oy = -b * w[1] / n2, nl = Math.sqrt(n2), ax = ox + 0.3 * w[0] / nl, ay = oy + 0.3 * w[1] / nl;
          arrow(ctx, v.x(ox), v.y(oy), v.x(ax), v.y(ay), C.accent, 2);
          text(ctx, "w", v.x(ax) + 6, v.y(ay) - 4, { color: C.accent, size: 11, weight: "700" });
          ctx.restore();
        }
        for (const p of pts) {
          dot(ctx, v.x(p.x), v.y(p.y), 4, p.label > 0 ? C.primary : C.secondary);
          if (predict(p, w, b) !== p.label) ring(ctx, v.x(p.x), v.y(p.y), 7, C.danger, 1.5);
        }
        if (flash && flash.t > 0) ring(ctx, v.x(flash.p.x), v.y(flash.p.y), 8 + (1 - flash.t) * 14, rgba(C.accent, flash.t), 2);
        const px = box.x + box.w + 10, pw = Math.max(40, L.W - px - 8), ty = L.H * 0.5 + 8;
        plot(ctx, C, { x: px, y: 8, w: pw, h: Math.max(40, L.H * 0.5 - 12) }, [{ data: hist.slice(-200), color: C.danger, label: "mistakes" }], { title: "Mistakes per epoch", yMin: 0 });
        text(ctx, "On each mistake (ŷ ≠ y):", px, ty + 14, { color: C.text, size: 11, weight: "700" });
        text(ctx, "w ← w + η·y·x,   b ← b + η·y", px, ty + 32, { color: C.accent, size: 12 });
        text(ctx, "prediction ŷ = sign(w·x + b)", px, ty + 50, { color: C.muted, size: 11 });
        text(ctx, `● +1 (${pts.filter((p) => p.label > 0).length})`, px, ty + 74, { color: C.primary, size: 11 });
        text(ctx, `● −1 (${pts.filter((p) => p.label < 0).length})`, px + 90, ty + 74, { color: C.secondary, size: 11 });
        text(ctx, "red ring = currently misclassified", px, ty + 92, { color: C.muted, size: 10 });
        text(ctx, "click: add point · click a point: flip its label", px, ty + 108, { color: C.muted, size: 10 });
      }
      api.loop((dt) => {
        if (flash) { flash.t -= dt * 1.5; if (flash.t <= 0) flash = null; dirty = true; }
        if (running && !converged) {
          const n = clamp(num(api.params.speed, 2) | 0, 1, 200);
          for (let i = 0; i < n; i++) if (!stepUpdate()) break;
          dirty = true; acc += dt; if (acc > 0.12 || !running || converged) { acc = 0; update(); }
        }
        if (dirty) { draw(); dirty = false; }
        return true;
      });
      api.onParam((k) => {
        if (k === "dataset" || k === "n") {
          seed++; gen(); running = true; const ds = String(api.params.dataset);
          api.setStatus(ds === "xor" ? "XOR: each class sits on one diagonal. Watch the mistakes never reach zero." : ds === "overlap" ? "Overlapping classes: the perceptron keeps cycling; the pocket readout remembers the best weights seen." : "Separable data: the perceptron convergence theorem guarantees a finite number of mistakes.");
        }
        dirty = true; update();
      });
      api.onResize(() => { dirty = true; });
      api.pointer(cv.canvas, { down: (q) => {
        const L = layout(), box = L.box, v = L.v;
        if (q.x < box.x || q.x > box.x + box.w || q.y < box.y || q.y > box.y + box.h) return;
        let best = -1, bd = 9;
        pts.forEach((p, i) => { const d = Math.hypot(v.x(p.x) - q.x, v.y(p.y) - q.y); if (d < bd) { bd = d; best = i; } });
        if (best >= 0) { pts[best].label = -pts[best].label; flips++; }
        else if (pts.length < 600) pts.push({ x: clamp(v.ix(q.x), -1, 1), y: clamp(v.iy(q.y), -1, 1), label: String(api.params.paint) === "-1" ? -1 : 1 });
        converged = false; running = true; newPass(); dirty = true; update();
      } });
      api.setStatus("Training on linearly separable data: each pass visits every point and every mistake nudges w toward the right side.");
      gen();
      return {
        toggle() { if (converged) { api.setStatus("Already converged — reset the weights, flip a label or add a point to continue."); return; } running = !running; update(); },
        step() { running = false; stepUpdate(); dirty = true; update(); },
        epoch() { running = false; if (converged) return; const target = epoch + 1; let guard = 0; while (epoch < target && !converged && guard++ < 100000) stepUpdate(); dirty = true; update(); },
        resetW() { resetW(); running = true; },
        regen() { seed++; gen(); running = true; },
        destroy() {},
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 3. nn_playground
  Sims.register({
    id: "nn_playground",
    name: "Neural Network Playground",
    domains: ["ai"],
    description: "A tiny multilayer perceptron trained live with hand-written forward and backward passes. Shape the data, the architecture and η — and watch the decision boundary form.",
    params: [
      { key: "dataset", label: "Dataset", type: "select", value: "circle", options: [
        { value: "circle", label: "Circle" }, { value: "xor", label: "XOR (checkerboard)" }, { value: "spiral", label: "Two spirals" }, { value: "gauss", label: "Two Gaussians" } ] },
      { key: "layers", label: "Hidden layers", type: "range", min: 1, max: 3, step: 1, value: 2 },
      { key: "units", label: "Units per hidden layer", type: "range", min: 2, max: 8, step: 1, value: 4 },
      { key: "act", label: "Activation", type: "select", value: "tanh", options: [ { value: "tanh", label: "tanh" }, { value: "relu", label: "ReLU" }, { value: "sigmoid", label: "sigmoid" } ] },
      { key: "lr", label: "Learning rate η", type: "range", min: 0.001, max: 0.5, step: 0.001, value: 0.03 },
      { key: "noise", label: "Noise", type: "range", min: 0, max: 0.5, step: 0.05, value: 0.1 },
      { key: "batch", label: "Mini-batch size", type: "range", min: 1, max: 50, step: 1, value: 10 },
      { key: "speed", label: "Epochs per frame", type: "range", min: 1, max: 10, step: 1, value: 2 },
    ],
    actions: [
      { label: "▶ / ❚❚ Train", fn: (h) => h.toggle() },
      { label: "1 epoch", fn: (h) => h.epochOnce() },
      { label: "Reset weights", fn: (h) => h.resetNet() },
      { label: "New data", fn: (h) => h.regen() },
    ],
    challenges: [
      { id: "xor_min", text: "Solve XOR (test accuracy ≥ 95 %) with ONE hidden layer. What is the fewest units that still works, and why does a single unit fail?", xp: 15 },
      { id: "spiral", text: "Fit the two spirals to ≥ 90 % test accuracy. Which depth / width / activation gets there fastest?", xp: 25 },
      { id: "dead_relu", text: "With ReLU, push η up until training stalls or the weights overflow. Then find the largest η that still trains. What happened to the hidden units?", xp: 15 },
      { id: "overfit", text: "Set noise to 0.5 and train for a long time: train and test accuracy separate. Which single change shrinks the gap most?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), heat = makeHeatmap();
      const ACT = {
        tanh: { f: Math.tanh, d: (y) => 1 - y * y },
        relu: { f: (x) => (x > 0 ? x : 0), d: (y) => (y > 0 ? 1 : 0) },
        sigmoid: { f: (x) => 1 / (1 + Math.exp(-x)), d: (y) => y * (1 - y) },
      };
      let data = { train: [], test: [] }, net = null, epoch = 0, lossHist = [], running = true, dirty = true, seed = 1, acc = 0, lastM = null;
      const act = () => ACT[String(api.params.act)] || ACT.tanh;
      function genData() {
        const rand = makeRng(seed * 104729 + 7), noise = clamp(num(api.params.noise, 0.1), 0, 1), kind = String(api.params.dataset), N = 240, all = [];
        for (let i = 0; i < N; i++) {
          let x, y, label; const cls = i % 2;
          if (kind === "xor") { x = rand() * 2 - 1; y = rand() * 2 - 1; x += x > 0 ? 0.1 : -0.1; y += y > 0 ? 0.1 : -0.1; label = x * y > 0 ? 1 : 0; }
          else if (kind === "spiral") { const r = i / N, t = 1.75 * r * 2 * Math.PI + cls * Math.PI; x = r * Math.sin(t); y = r * Math.cos(t); label = cls; }
          else if (kind === "gauss") { const c = cls ? 0.55 : -0.55; x = c + gaussian(rand) * 0.3; y = c + gaussian(rand) * 0.3; label = cls; }
          else { const r = cls ? rand() * 0.5 : 0.72 + rand() * 0.28, a = rand() * Math.PI * 2; x = r * Math.cos(a); y = r * Math.sin(a); label = cls; }
          x += gaussian(rand) * noise * 0.5; y += gaussian(rand) * noise * 0.5;
          all.push({ x: clamp(x, -1.2, 1.2), y: clamp(y, -1.2, 1.2), label });
        }
        shuffle(all, rand);
        const nTrain = Math.round(N * 0.75); data = { train: all.slice(0, nTrain), test: all.slice(nTrain) };
      }
      function makeNet() {
        const L = clamp(num(api.params.layers, 2) | 0, 1, 3), U = clamp(num(api.params.units, 4) | 0, 1, 16), rand = makeRng(seed * 31 + L * 1000 + U * 10 + 7);
        const sizes = [2]; for (let i = 0; i < L; i++) sizes.push(U); sizes.push(1);
        const layers = [];
        for (let l = 1; l < sizes.length; l++) {
          const nin = sizes[l - 1], nout = sizes[l], scale = Math.sqrt(2 / (nin + nout)) * (String(api.params.act) === "relu" ? 1.4 : 1), W = [], gW = [];
          for (let o = 0; o < nout; o++) { const row = []; for (let i = 0; i < nin; i++) row.push(gaussian(rand) * scale); W.push(row); gW.push(new Array(nin).fill(0)); }
          layers.push({ W, gW, b: new Array(nout).fill(0), gb: new Array(nout).fill(0), nin, nout, out: new Array(nout).fill(0), delta: new Array(nout).fill(0) });
        }
        net = { sizes, layers }; epoch = 0; lossHist = []; lastM = null; dirty = true;
      }
      function forward(x, y) {
        const Ls = net.layers, A = act(); let a = [x, y];
        for (let l = 0; l < Ls.length; l++) {
          const Ly = Ls[l], last = l === Ls.length - 1, o = Ly.out;
          for (let j = 0; j < Ly.nout; j++) { let s = Ly.b[j]; const row = Ly.W[j]; for (let i = 0; i < Ly.nin; i++) s += row[i] * a[i]; o[j] = last ? 1 / (1 + Math.exp(-s)) : A.f(s); }
          a = o;
        }
        return a[0];
      }
      function backward(x, y, label) { // accumulates gradients of binary cross-entropy; returns the sample loss
        const Ls = net.layers, A = act(), p = forward(x, y);
        Ls[Ls.length - 1].delta[0] = p - label; // d(BCE)/d(logit) for a sigmoid output unit
        for (let l = Ls.length - 2; l >= 0; l--) {
          const Ly = Ls[l], nx = Ls[l + 1];
          for (let j = 0; j < Ly.nout; j++) { let s = 0; for (let k = 0; k < nx.nout; k++) s += nx.W[k][j] * nx.delta[k]; Ly.delta[j] = s * A.d(Ly.out[j]); }
        }
        for (let l = 0; l < Ls.length; l++) {
          const Ly = Ls[l], inp = l === 0 ? [x, y] : Ls[l - 1].out;
          for (let j = 0; j < Ly.nout; j++) { const d = Ly.delta[j], g = Ly.gW[j]; Ly.gb[j] += d; for (let i = 0; i < Ly.nin; i++) g[i] += d * inp[i]; }
        }
        return -(label * Math.log(p + 1e-9) + (1 - label) * Math.log(1 - p + 1e-9));
      }
      function applyGrads(n) {
        const lr = Math.max(0, num(api.params.lr, 0.03)) / Math.max(1, n);
        for (const Ly of net.layers) for (let j = 0; j < Ly.nout; j++) {
          Ly.b[j] -= lr * Ly.gb[j]; Ly.gb[j] = 0; const g = Ly.gW[j], W = Ly.W[j];
          for (let i = 0; i < Ly.nin; i++) { W[i] -= lr * g[i]; g[i] = 0; }
        }
      }
      function metrics() {
        let tl = 0, tc = 0, vc = 0;
        for (const p of data.train) { const q = forward(p.x, p.y); tl += -(p.label * Math.log(q + 1e-9) + (1 - p.label) * Math.log(1 - q + 1e-9)); if ((q >= 0.5 ? 1 : 0) === p.label) tc++; }
        for (const p of data.test) if ((forward(p.x, p.y) >= 0.5 ? 1 : 0) === p.label) vc++;
        return { loss: tl / Math.max(1, data.train.length), trainAcc: tc / Math.max(1, data.train.length), testAcc: vc / Math.max(1, data.test.length) };
      }
      function trainEpoch() {
        const tr = data.train, B = clamp(num(api.params.batch, 10) | 0, 1, 500), ord = shuffle(tr.map((_, i) => i), api.random);
        for (let s = 0; s < ord.length; s += B) { let cnt = 0; for (let k = s; k < Math.min(ord.length, s + B); k++) { const p = tr[ord[k]]; backward(p.x, p.y, p.label); cnt++; } applyGrads(cnt); }
        epoch++;
        for (const Ly of net.layers) for (const row of Ly.W) for (const wv of row) if (!Number.isFinite(wv)) {
          makeNet(); running = false; api.setStatus("Weights overflowed to NaN — η is too high for this network. Weights were re-initialised; lower η and train again."); return null;
        }
        lastM = metrics(); lossHist.push(lastM.loss); if (lossHist.length > 600) lossHist.shift();
        const ds = String(api.params.dataset);
        if (ds === "xor" && clamp(num(api.params.layers, 2) | 0, 1, 3) === 1 && lastM.testAcc >= 0.95) api.award("xor_min");
        if (ds === "spiral" && lastM.testAcc >= 0.9) api.award("spiral");
        return lastM;
      }
      function update() {
        const m = lastM || metrics(); let params = 0; net.layers.forEach((Ly) => { params += Ly.nin * Ly.nout + Ly.nout; });
        api.readout({ "Epoch": epoch, "Train loss (BCE)": fmt(m.loss, 4), "Train accuracy": pct(m.trainAcc), "Test accuracy": pct(m.testAcc), "Trainable parameters": params, "State": running ? "training ▶" : "paused ❚❚" });
      }
      function drawNet(ctx, b) {
        const sizes = net.sizes, cols = sizes.length, colX = (i) => b.x + 18 + (b.w - 36) * i / (cols - 1);
        const nodeY = (li, j) => b.y + b.h / 2 + (j - (sizes[li] - 1) / 2) * Math.min(22, (b.h - 24) / Math.max(1, sizes[li]));
        net.layers.forEach((Ly, l) => { for (let j = 0; j < Ly.nout; j++) for (let i = 0; i < Ly.nin; i++) { const wv = Ly.W[j][i]; line(ctx, colX(l), nodeY(l, i), colX(l + 1), nodeY(l + 1, j), rgba(wv >= 0 ? C.primary : C.secondary, clamp(Math.abs(wv) / 2, 0.1, 0.9)), clamp(Math.abs(wv) * 1.2, 0.4, 4)); } });
        sizes.forEach((n, li) => { for (let j = 0; j < n; j++) dot(ctx, colX(li), nodeY(li, j), 5, li === 0 ? C.accent : li === cols - 1 ? C.ok : C.text, C.bg, 1.5); });
        text(ctx, `(x, y) → ${sizes.slice(1, -1).join(" → ")} ${String(api.params.act)} → σ`, b.x + 4, b.y + 11, { color: C.muted, size: 10 });
        text(ctx, "blue = positive weight · pink = negative · thickness = |w|", b.x + 4, b.y + b.h - 3, { color: C.muted, size: 9 });
      }
      function draw() {
        const W = cv.width, H = cv.height, ctx = cv.ctx, side = Math.max(40, Math.min(H - 16, W * 0.55)), box = { x: 8, y: (H - side) / 2, w: side, h: side }, v = view(box, -1.2, 1.2, -1.2, 1.2);
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        const STOPS = [hexToRgb(C.secondary), [24, 28, 52], hexToRgb(C.primary)], G = 56;
        heat.render(ctx, box.x, box.y, box.w, box.h, G, G, (i, j) => ramp(STOPS, forward(-1.2 + (i + 0.5) / G * 2.4, 1.2 - (j + 0.5) / G * 2.4)), true);
        ctx.strokeStyle = C.axis; ctx.lineWidth = 1; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
        for (const p of data.train) dot(ctx, v.x(p.x), v.y(p.y), 3.2, p.label ? C.primary : C.secondary, C.bg, 1);
        for (const p of data.test) ring(ctx, v.x(p.x), v.y(p.y), 3.4, p.label ? C.primary : C.secondary, 1.6);
        text(ctx, "● train  ○ test   background = P(class blue)", box.x + 6, box.y + box.h - 6, { color: C.text, size: 10 });
        const px = box.x + box.w + 10, pw = Math.max(40, W - px - 8);
        plot(ctx, C, { x: px, y: 8, w: pw, h: Math.max(40, H * 0.42) }, [{ data: lossHist, color: C.accent, label: "train loss" }], { title: "Binary cross-entropy", yMin: 0 });
        drawNet(ctx, { x: px, y: H * 0.42 + 16, w: pw, h: Math.max(40, H * 0.58 - 24) });
      }
      api.loop((dt) => {
        if (running) {
          const budget = performance.now() + 12, n = clamp(num(api.params.speed, 2) | 0, 1, 20);
          for (let i = 0; i < n && performance.now() < budget && running; i++) trainEpoch();
          dirty = true; acc += dt; if (acc > 0.15 || !running) { acc = 0; update(); }
        }
        if (dirty) { draw(); dirty = false; }
        return true;
      });
      api.onParam((k) => {
        if (k === "dataset" || k === "noise") { genData(); makeNet(); running = true; }
        else if (k === "layers" || k === "units" || k === "act") { makeNet(); running = true; }
        dirty = true; update();
      });
      api.onResize(() => { dirty = true; });
      api.setStatus("Training live. The background shows the network's P(blue) at every point; the right panel shows the loss curve and the weights.");
      genData(); makeNet(); update();
      return {
        toggle() { running = !running; update(); },
        epochOnce() { running = false; trainEpoch(); dirty = true; update(); },
        resetNet() { seed++; makeNet(); running = true; update(); },
        regen() { seed++; genData(); makeNet(); running = true; update(); },
        destroy() {},
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 4. kmeans
  Sims.register({
    id: "kmeans",
    name: "k-Means Clustering",
    domains: ["ai", "math"],
    description: "Lloyd's algorithm one half-step at a time: assign each point to its nearest centroid, then move every centroid to the mean of its members. Explore initialisation, local minima and the elbow heuristic.",
    params: [
      { key: "dataset", label: "Data", type: "select", value: "blobs", options: [ { value: "blobs", label: "Gaussian blobs (3–6 hidden)" }, { value: "moons", label: "Two moons" }, { value: "uniform", label: "Uniform noise" } ] },
      { key: "k", label: "k (number of clusters)", type: "range", min: 1, max: 10, step: 1, value: 3 },
      { key: "n", label: "Points", type: "range", min: 50, max: 600, step: 10, value: 300 },
      { key: "init", label: "Initialisation", type: "select", value: "random", options: [ { value: "random", label: "Random data points (Forgy)" }, { value: "kpp", label: "k-means++" } ] },
      { key: "voronoi", label: "Shade nearest-centroid regions", type: "toggle", value: true },
    ],
    actions: [
      { label: "Step (assign ⇄ update)", fn: (h) => h.step() },
      { label: "▶ Run to convergence", fn: (h) => h.run() },
      { label: "Re-initialise centroids", fn: (h) => h.reinit() },
      { label: "New data", fn: (h) => h.regen() },
      { label: "Elbow plot k = 1…10", fn: (h) => h.elbow() },
    ],
    challenges: [
      { id: "converge", text: "Step assign → update until the centroids stop moving. Why can the inertia never go up between half-steps?", xp: 10 },
      { id: "elbow", text: "Compute the elbow plot on the blobs, pick the k at the bend, set it and converge. Does it match the hidden number of blobs?", xp: 20 },
      { id: "local_min", text: "With random init on the blobs, re-initialise until two centroids end up sharing one blob (a local minimum). Does k-means++ avoid it?", xp: 15 },
      { id: "moons", text: "Cluster the two moons with k = 2. Why does k-means cut them the 'wrong' way — which assumption about cluster shape is violated?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), heat = makeHeatmap();
      let pts = [], cents = [], assign = [], phase = "assign", iter = 0, inertiaHist = [], converged = false, trueK = 0, seed = 5, initSeed = 1, dirty = true, elbowData = null, running = false, timer = 0, trails = [], ref = null;
      const d2 = (p, c) => { const dx = p.x - c.x, dy = p.y - c.y; return dx * dx + dy * dy; };
      function nearest(p, cs) { let b = 0, bd = Infinity; for (let j = 0; j < cs.length; j++) { const d = d2(p, cs[j]); if (d < bd) { bd = d; b = j; } } return b; }
      function genData() {
        const rand = makeRng(seed * 2654435 + 1), n = clamp(num(api.params.n, 300) | 0, 10, 2000), kind = String(api.params.dataset);
        pts = []; trueK = 0;
        if (kind === "blobs") {
          trueK = 3 + Math.floor(rand() * 4); const centers = [];
          for (let c = 0; c < trueK; c++) centers.push({ x: -0.7 + rand() * 1.4, y: -0.7 + rand() * 1.4, s: 0.07 + rand() * 0.1 });
          for (let i = 0; i < n; i++) { const c = centers[i % trueK]; pts.push({ x: c.x + gaussian(rand) * c.s, y: c.y + gaussian(rand) * c.s }); }
        } else if (kind === "moons") {
          for (let i = 0; i < n; i++) { const t = rand() * Math.PI, up = i % 2 === 0, x = up ? Math.cos(t) - 0.5 : 0.5 - Math.cos(t), y = up ? Math.sin(t) - 0.25 : 0.25 - Math.sin(t); pts.push({ x: x * 0.65 + gaussian(rand) * 0.06, y: y * 0.65 + gaussian(rand) * 0.06 }); }
        } else for (let i = 0; i < n; i++) pts.push({ x: rand() * 1.9 - 0.95, y: rand() * 1.9 - 0.95 });
        pts.forEach((p) => { p.x = clamp(p.x, -1, 1); p.y = clamp(p.y, -1, 1); });
        elbowData = null; ref = null; initCents();
      }
      function seedCents(k, rand, kpp) {
        const cs = []; if (!pts.length) return cs;
        const pick = (i) => ({ x: pts[i].x, y: pts[i].y });
        if (!kpp) { for (let j = 0; j < k; j++) cs.push(pick(Math.floor(rand() * pts.length))); return cs; }
        cs.push(pick(Math.floor(rand() * pts.length)));
        while (cs.length < k) { // k-means++: sample the next centre with probability ∝ D(x)²
          const dd = pts.map((p) => { let m = Infinity; for (const c of cs) { const d = d2(p, c); if (d < m) m = d; } return m; });
          let sum = 0; for (const d of dd) sum += d;
          if (sum <= 1e-12) { cs.push(pick(Math.floor(rand() * pts.length))); continue; }
          let r = rand() * sum, chosen = pts.length - 1;
          for (let i = 0; i < dd.length; i++) { r -= dd[i]; if (r <= 0) { chosen = i; break; } }
          cs.push(pick(chosen));
        }
        return cs;
      }
      function meanUpdate(cs, asg) {
        const sx = new Array(cs.length).fill(0), sy = new Array(cs.length).fill(0), cnt = new Array(cs.length).fill(0);
        pts.forEach((p, i) => { const j = asg[i]; if (j >= 0) { sx[j] += p.x; sy[j] += p.y; cnt[j]++; } });
        let moved = 0;
        const out = cs.map((c, j) => { if (!cnt[j]) return { x: c.x, y: c.y }; const nc = { x: sx[j] / cnt[j], y: sy[j] / cnt[j] }; moved += Math.hypot(nc.x - c.x, nc.y - c.y); return nc; });
        return { cents: out, moved };
      }
      function sse(cs, asg) { let s = 0; pts.forEach((p, i) => { if (asg[i] >= 0) s += d2(p, cs[asg[i]]); }); return s; }
      function lloyd(k, rand) { let cs = seedCents(k, rand, true), asg = []; for (let it = 0; it < 40; it++) { asg = pts.map((p) => nearest(p, cs)); const r = meanUpdate(cs, asg); cs = r.cents; if (r.moved < 1e-7) break; } return sse(cs, asg); }
      function initCents() {
        const k = clamp(num(api.params.k, 3) | 0, 1, 10);
        cents = seedCents(k, makeRng(seed * 131 + initSeed * 7 + 3), String(api.params.init) === "kpp");
        assign = new Array(pts.length).fill(-1); phase = "assign"; iter = 0; inertiaHist = []; converged = false; running = false; trails = cents.map((c) => [c]); dirty = true; update();
      }
      function onConverged() {
        api.award("converge");
        const k = cents.length, cur = inertiaHist[inertiaHist.length - 1]; let msg = `Converged after ${iter} iterations (inertia ${fmt(cur, 3)}).`;
        if (String(api.params.dataset) === "blobs") {
          if (!ref || ref.k !== k) { let best = Infinity; for (let r = 0; r < 4; r++) best = Math.min(best, lloyd(k, makeRng(seed * 977 + r * 13 + 1))); ref = { k, v: best }; }
          if (cur > ref.v * 1.25) { msg += ` That is a LOCAL minimum — the best of 4 k-means++ restarts reaches ${fmt(ref.v, 3)}.`; api.award("local_min"); }
          if (elbowData && k === trueK) api.award("elbow");
        }
        api.setStatus(msg);
      }
      function step() {
        if (converged || !cents.length) return;
        if (phase === "assign") { assign = pts.map((p) => nearest(p, cents)); phase = "update"; }
        else { const r = meanUpdate(cents, assign); cents = r.cents; cents.forEach((c, j) => trails[j].push(c)); iter++; phase = "assign"; if (r.moved < 1e-9) { converged = true; running = false; } }
        inertiaHist.push(sse(cents, assign)); if (inertiaHist.length > 400) inertiaHist.shift();
        if (converged) onConverged();
        dirty = true; update();
      }
      function update() {
        api.readout({ "Iteration": iter, "Next half-step": phase === "assign" ? "assign points" : "update centroids", "Inertia (SSE)": inertiaHist.length ? fmt(inertiaHist[inertiaHist.length - 1], 3) : "—", "Converged": converged ? "yes ✔" : "no", "k": cents.length, "Points": pts.length });
      }
      function draw() {
        const W = cv.width, H = cv.height, ctx = cv.ctx, side = Math.max(40, Math.min(H - 16, W * 0.56)), box = { x: 8, y: (H - side) / 2, w: side, h: side }, v = view(box, -1.05, 1.05, -1.05, 1.05), cols = C.series;
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        if (api.params.voronoi && cents.length) { const G = 64, rgb = cols.map(hexToRgb); heat.render(ctx, box.x, box.y, box.w, box.h, G, G, (i, j) => { const c = rgb[nearest({ x: -1.05 + (i + 0.5) / G * 2.1, y: 1.05 - (j + 0.5) / G * 2.1 }, cents) % rgb.length]; return [c[0], c[1], c[2], 42]; }, false); }
        ctx.strokeStyle = C.axis; ctx.lineWidth = 1; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
        pts.forEach((p, i) => dot(ctx, v.x(p.x), v.y(p.y), 2.6, assign[i] >= 0 ? cols[assign[i] % cols.length] : C.muted));
        trails.forEach((tr, j) => { if (tr.length < 2) return; ctx.strokeStyle = rgba(cols[j % cols.length], 0.8); ctx.lineWidth = 1.5; ctx.beginPath(); tr.forEach((c, i) => (i ? ctx.lineTo(v.x(c.x), v.y(c.y)) : ctx.moveTo(v.x(c.x), v.y(c.y)))); ctx.stroke(); });
        cents.forEach((c, j) => { dot(ctx, v.x(c.x), v.y(c.y), 8, cols[j % cols.length], C.text, 2); text(ctx, String(j + 1), v.x(c.x), v.y(c.y) + 4, { color: C.bg, size: 10, weight: "700", align: "center" }); });
        text(ctx, converged ? "converged ✔" : `next: ${phase === "assign" ? "ASSIGN each point to its nearest centroid" : "UPDATE each centroid to its members' mean"}`, box.x + 6, box.y + 14, { color: C.accent, size: 11, weight: "600" });
        const px = box.x + box.w + 10, pw = Math.max(40, W - px - 8);
        plot(ctx, C, { x: px, y: 8, w: pw, h: Math.max(40, H * 0.46) }, [{ data: inertiaHist, color: C.accent, label: "inertia", marker: true }], { title: "Inertia Σ‖x − μ‖² per half-step", yMin: 0 });
        if (elbowData) plot(ctx, C, { x: px, y: H * 0.5 + 4, w: pw, h: Math.max(40, H * 0.5 - 12) }, [{ data: elbowData, color: C.ok, label: "best of 3 runs", marker: true }, { data: [[cents.length, 0], [cents.length, elbowData[0][1]]], color: C.secondary, label: "current k" }], { title: "Elbow: inertia vs k", yMin: 0, xMin: 1, xMax: 10 });
        else text(ctx, "Press “Elbow plot” to compute inertia for k = 1…10", px, H * 0.5 + 30, { color: C.muted, size: 11 });
      }
      api.loop((dt) => {
        if (running && !converged) { timer += dt; if (timer > 0.35) { timer = 0; step(); if (iter > 200) running = false; } }
        if (dirty) { draw(); dirty = false; }
        return true;
      });
      api.onParam((k) => { if (k === "dataset" || k === "n") genData(); else if (k === "k" || k === "init") initCents(); dirty = true; });
      api.onResize(() => { dirty = true; });
      api.setStatus("Grey points are unassigned. Press Step to assign them, Step again to move the centroids — or Run to convergence.");
      genData();
      return {
        step() { step(); },
        run() { if (converged) { api.setStatus("Already converged — re-initialise the centroids or change k."); return; } running = true; },
        reinit() { initSeed++; initCents(); },
        regen() { seed++; genData(); },
        elbow() {
          if (!pts.length) return; elbowData = [];
          for (let k = 1; k <= 10; k++) { let best = Infinity; for (let r = 0; r < 3; r++) best = Math.min(best, lloyd(k, makeRng(seed * 311 + k * 17 + r))); elbowData.push([k, best]); }
          dirty = true; api.setStatus("Elbow plot: inertia always falls as k grows — look for the bend where an extra cluster stops paying off, then set k there and converge.");
        },
        destroy() {},
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 5. attention_viz
  Sims.register({
    id: "attention_viz",
    name: "Self-Attention Visualiser",
    domains: ["ai"],
    description: "Scaled dot-product self-attention over a toy sentence: hash-based token embeddings + sinusoidal positions, seeded Wq/Wk per head. Click a token to see where it looks.",
    params: [
      { key: "text", label: "Sentence", type: "text", value: "the robot picked up the red ball because it was closest" },
      { key: "heads", label: "Number of heads", type: "range", min: 1, max: 4, step: 1, value: 2 },
      { key: "view", label: "Show", type: "select", value: "1", options: [ { value: "1", label: "Head 1" }, { value: "2", label: "Head 2" }, { value: "3", label: "Head 3" }, { value: "4", label: "Head 4" }, { value: "avg", label: "Average of all heads" } ] },
      { key: "temp", label: "Temperature T", type: "range", min: 0.1, max: 5, step: 0.1, value: 1 },
      { key: "causal", label: "Causal mask (decoder-style)", type: "toggle", value: false },
      { key: "seed", label: "Weight seed", type: "range", min: 1, max: 20, step: 1, value: 3 },
    ],
    actions: [ { label: "Next query token →", fn: (h) => h.next() }, { label: "Shuffle weights", fn: (h) => h.reseed() } ],
    challenges: [
      { id: "causal", text: "Turn on the causal mask: which half of the matrix vanishes, and why must a decoder (GPT-style) train with it?", xp: 10 },
      { id: "temperature", text: "Sweep T from 0.1 to 5. Describe the rows at both extremes (one-hot vs. uniform). What role does the √d in the real formula play?", xp: 10 },
      { id: "heads", text: "Compare Head 1 and Head 2 for the same query token. Do they pick different positions? Why do transformers use several heads?", xp: 15 },
      { id: "repeat", text: "Type a sentence with a repeated word. Does a word attend strongly to its own copy? Explain using how the embeddings are built.", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), heat = makeHeatmap(), D = 16, DEFAULT = "the robot picked up the red ball because it was closest";
      const extra = api.html("");
      let toks = [], heads = [], A = [], sel = 7, loT = false, hiT = false, lay = null;
      const tokenize = (s) => (String(s || "").toLowerCase().match(/[a-z0-9']+|[^\sa-z0-9']/g) || []).slice(0, 24);
      function embed(tok, pos) { // deterministic hash-seeded token vector + sinusoidal position encoding
        const rand = makeRng(hashStr(tok) || 1), e = new Array(D);
        for (let i = 0; i < D; i++) e[i] = gaussian(rand);
        for (let i = 0; i < D; i += 2) { const w = pos / Math.pow(10000, i / D); e[i] += 0.7 * Math.sin(w); e[i + 1] += 0.7 * Math.cos(w); }
        return e;
      }
      function matrix(rand, r, c, s) { const M = []; for (let i = 0; i < r; i++) { const row = []; for (let j = 0; j < c; j++) row.push(gaussian(rand) * s); M.push(row); } return M; }
      const matVec = (M, x) => M.map((row) => { let s = 0; for (let j = 0; j < row.length; j++) s += row[j] * x[j]; return s; });
      function compute() {
        toks = tokenize(api.params.text); const n = toks.length; heads = []; A = [];
        if (!n) { api.readout({ "Tokens": 0 }); api.setStatus("Type a sentence to attend over."); panel(); draw(); return; }
        const H = clamp(num(api.params.heads, 2) | 0, 1, 4), T = clamp(num(api.params.temp, 1), 0.05, 50), causal = !!api.params.causal, sc = 1 / Math.sqrt(D);
        const X = toks.map((t, i) => embed(t, i));
        for (let h = 0; h < H; h++) {
          const rand = makeRng(num(api.params.seed, 3) * 7919 + h * 104729 + 17), Wq = matrix(rand, D, D, sc), Wn = matrix(rand, D, D, sc);
          const Wk = Wq.map((row, i) => row.map((wv, j) => 0.6 * wv + 0.8 * Wn[i][j])); // partly similarity-seeking, partly a head-specific pattern
          const Q = X.map((x) => matVec(Wq, x)), K = X.map((x) => matVec(Wk, x)), att = [];
          for (let i = 0; i < n; i++) {
            const lg = new Array(n);
            for (let j = 0; j < n; j++) { let s = 0; for (let d = 0; d < D; d++) s += Q[i][d] * K[j][d]; lg[j] = causal && j > i ? -1e9 : s * sc; }
            att.push(softmax(lg, T));
          }
          heads.push(att);
        }
        const vs = String(api.params.view);
        if (vs === "avg") A = heads[0].map((row, i) => row.map((_, j) => heads.reduce((s, hh) => s + hh[i][j], 0) / H));
        else A = heads[clamp((parseInt(vs, 10) || 1) - 1, 0, H - 1)];
        sel = clamp(sel, 0, n - 1); update(); panel(); draw();
      }
      function update() {
        if (!A.length) return;
        const row = A[sel], j = argmax(row), H = heads.length, vs = String(api.params.view); let Hb = 0; row.forEach((p) => { if (p > 1e-12) Hb -= p * Math.log2(p); });
        api.readout({ "Tokens": toks.length, "Query token": `“${toks[sel]}” (#${sel + 1})`, "Strongest key": `“${toks[j]}” (#${j + 1}) → ${fmt(row[j], 2)}`, "Row entropy": `${fmt(Hb, 2)} bits (uniform = ${fmt(Math.log2(toks.length), 2)})`, "Showing": vs === "avg" ? `average of ${H} head${H > 1 ? "s" : ""}` : `head ${clamp(parseInt(vs, 10) || 1, 1, H)} of ${H}` });
      }
      function panel() {
        if (!A.length) { api.html(""); return; }
        const row = A[sel];
        const chips = toks.map((t, i) => `<span data-i="${i}" style="display:inline-block;margin:2px;padding:3px 9px;border-radius:999px;cursor:pointer;font-size:.85em;background:${i === sel ? C.accent : rgba(C.primary, 0.12 + 0.88 * row[i])};color:${i === sel ? C.bg : C.text}">${esc(t)}</span>`).join("");
        const top = row.map((p, i) => [p, i]).sort((a, b) => b[0] - a[0]).slice(0, 5).map(([p, i]) => `<div style="display:flex;align-items:center;gap:8px;font-size:.82em;margin:2px 0"><span style="width:110px;color:${C.muted};text-align:right">${esc(toks[i])} <small>#${i + 1}</small></span><div style="flex:1;height:8px;background:${rgba(C.text, 0.08)};border-radius:4px"><div style="width:${(p * 100).toFixed(1)}%;height:8px;border-radius:4px;background:${C.primary}"></div></div><span style="width:48px;color:${C.text}">${fmt(p, 3)}</span></div>`).join("");
        api.html(`<div style="color:${C.muted};font-size:.8em;margin-bottom:4px">Click a token to make it the query. Chip shading = attention weight it receives from the current query.</div><div>${chips}</div><div style="margin-top:6px">${top}</div>`);
      }
      function draw() {
        const W = cv.width, H = cv.height, ctx = cv.ctx, n = toks.length;
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        if (!n) { text(ctx, "No tokens to attend over.", 20, 30, { color: C.muted, size: 13 }); lay = null; return; }
        const lab = Math.min(72, W * 0.12), side = Math.max(30, Math.min(H - lab - 24, W * 0.5 - lab)), box = { x: 8 + lab, y: lab + 6, w: side, h: side }, cs = side / n;
        heat.render(ctx, box.x, box.y, box.w, box.h, n, n, (i, j) => ramp(VIRIDIS, Math.pow(A[j][i], 0.6)), false);
        for (let i = 0; i <= n; i++) { line(ctx, box.x + i * cs, box.y, box.x + i * cs, box.y + box.h, rgba(C.bg, 0.7)); line(ctx, box.x, box.y + i * cs, box.x + box.w, box.y + i * cs, rgba(C.bg, 0.7)); }
        ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.strokeRect(box.x, box.y + sel * cs, box.w, cs);
        const fs = clamp(cs * 0.7, 7, 12);
        toks.forEach((t, i) => {
          text(ctx, t, box.x - 4, box.y + (i + 0.5) * cs + fs / 3, { color: i === sel ? C.accent : C.text, size: fs, align: "right" });
          ctx.save(); ctx.translate(box.x + (i + 0.5) * cs, box.y - 4); ctx.rotate(-Math.PI / 3); text(ctx, t, 0, 0, { color: C.text, size: fs }); ctx.restore();
        });
        text(ctx, "keys →", box.x, box.y - lab + 10, { color: C.muted, size: 10 });
        text(ctx, "queries ↓  (each row sums to 1)", 8, box.y + box.h + 14, { color: C.muted, size: 10 });
        const ax = box.x + box.w + 28, aw = Math.max(40, W - ax - 12), gap = aw / n, baseY = box.y + box.h * 0.78, row = A[sel];
        for (let j = 0; j < n; j++) {
          if (j === sel || row[j] < 0.01) continue;
          const x1 = ax + (sel + 0.5) * gap, x2 = ax + (j + 0.5) * gap, rx = Math.abs(x2 - x1) / 2;
          ctx.strokeStyle = rgba(C.primary, 0.15 + row[j]); ctx.lineWidth = clamp(row[j] * 10, 0.5, 8);
          ctx.beginPath(); ctx.ellipse((x1 + x2) / 2, baseY, rx, Math.min(rx, Math.max(4, baseY - box.y - 30)), 0, Math.PI, 0); ctx.stroke();
        }
        toks.forEach((t, j) => {
          const x = ax + (j + 0.5) * gap; dot(ctx, x, baseY, j === sel ? 6 : 2.5 + row[j] * 9, j === sel ? C.accent : C.primary);
          ctx.save(); ctx.translate(x, baseY + 10); ctx.rotate(Math.PI / 3); text(ctx, t, 0, 0, { color: j === sel ? C.accent : C.text, size: clamp(gap * 0.6, 7, 11) }); ctx.restore();
        });
        text(ctx, `Attention from “${toks[sel]}” — arc thickness ∝ weight`, ax, box.y - lab + 10, { color: C.text, size: 11, weight: "600" });
        text(ctx, `A = softmax(Q·Kᵀ / (√${D} · T))${api.params.causal ? " + causal mask" : ""},  T = ${fmt(num(api.params.temp, 1), 1)}`, ax, box.y - lab + 26, { color: C.muted, size: 10 });
        lay = { box, cs, ax, gap, baseY };
      }
      api.pointer(cv.canvas, { down: (p) => {
        if (!lay || !toks.length) return;
        const { box, cs, ax, gap, baseY } = lay;
        if (p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h) sel = clamp(Math.floor((p.y - box.y) / cs), 0, toks.length - 1);
        else if (p.x >= ax && Math.abs(p.y - baseY) < 40) sel = clamp(Math.floor((p.x - ax) / gap), 0, toks.length - 1);
        else return;
        update(); panel(); draw();
      } });
      const onClick = (e) => { const t = e.target && e.target.closest ? e.target.closest("[data-i]") : null; if (!t) return; sel = clamp(parseInt(t.getAttribute("data-i"), 10) || 0, 0, Math.max(0, toks.length - 1)); update(); panel(); draw(); };
      extra.addEventListener("click", onClick);
      api.onParam((k) => {
        if (k === "causal" && api.params.causal) api.award("causal");
        if (k === "temp") { const T = num(api.params.temp, 1); if (T <= 0.2) loT = true; if (T >= 4.5) hiT = true; if (loT && hiT) api.award("temperature"); }
        if (k === "text") { const tk = tokenize(api.params.text); if (String(api.params.text) !== DEFAULT && new Set(tk).size < tk.length) api.award("repeat"); }
        compute();
      });
      api.onResize(() => draw());
      api.setStatus("Rows = queries, columns = keys, bright = high weight. Click a row (or a chip below) to change the query token.");
      compute();
      return {
        next() { if (toks.length) { sel = (sel + 1) % toks.length; update(); panel(); draw(); } },
        reseed() { api.setParam("seed", (num(api.params.seed, 3) % 20) + 1); },
        destroy() { extra.removeEventListener("click", onClick); },
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 6. ngram_predictor
  Sims.register({
    id: "ngram_predictor",
    name: "n-gram Language Model",
    domains: ["ai"],
    description: "Count-based next-word prediction trained on a tiny corpus about science and robots. Change n, type a prefix, sample continuations and watch sparsity bite.",
    params: [
      { key: "n", label: "n (predicts from the previous n − 1 words)", type: "range", min: 1, max: 4, step: 1, value: 2 },
      { key: "prefix", label: "Prefix", type: "text", value: "the robot" },
      { key: "smooth", label: "Smoothing", type: "select", value: "interp", options: [ { value: "mle", label: "None (maximum likelihood)" }, { value: "addk", label: "Add-k (k = 0.1)" }, { value: "interp", label: "Interpolated back-off (λ = 0.6)" } ] },
      { key: "temp", label: "Sampling temperature", type: "range", min: 0.1, max: 2, step: 0.1, value: 0.8 },
      { key: "maxlen", label: "Max words per generation", type: "range", min: 5, max: 40, step: 1, value: 15 },
    ],
    actions: [ { label: "🎲 Generate", fn: (h) => h.generate() }, { label: "Clear generated", fn: (h) => h.clear() }, { label: "Show / hide corpus", fn: (h) => h.corpus() } ],
    challenges: [
      { id: "sparsity", text: "Set n = 4, smoothing = None, and type a 3-word prefix the corpus never contains. What does the model predict, and why is that fatal for perplexity?", xp: 10 },
      { id: "perplexity", text: "With interpolated smoothing, visit n = 1, 2, 3, 4 and compare held-out perplexity. Why doesn't a bigger n always win on a tiny corpus?", xp: 15 },
      { id: "temperature", text: "Generate at temperature 0.1 and again at 2.0. Compare fluency vs. variety — what does T do to the distribution?", xp: 10 },
      { id: "memorise", text: "At n = 4 generate from “robots can”. Does the model just copy the corpus? Explain the link between n, data size and memorisation.", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), rand = api.random, MAXN = 4, KADD = 0.1, LAMBDA = 0.6;
      const HELD = "the robot can measure the temperature of the water and send the numbers back to the scientists";
      const words = (s) => String(s || "").toLowerCase().match(/[a-z]+/g) || [];
      const sentences = CORPUS.split(/[.!?]+/).map(words).filter((s) => s.length);
      const vocab = new Set(["</s>"]); let nTokens = 0; sentences.forEach((s) => { s.forEach((w) => vocab.add(w)); nTokens += s.length + 1; });
      const vocabArr = Array.from(vocab), V = vocabArr.length, counts = [], totals = [];
      for (let n = 1; n <= MAXN; n++) {
        const m = new Map(), tot = new Map();
        sentences.forEach((s) => {
          const t = new Array(n - 1).fill("<s>").concat(s, ["</s>"]);
          for (let i = n - 1; i < t.length; i++) { const c = t.slice(i - n + 1, i).join(" "), w = t[i]; if (!m.has(c)) m.set(c, new Map()); const mm = m.get(c); mm.set(w, (mm.get(w) || 0) + 1); tot.set(c, (tot.get(c) || 0) + 1); }
        });
        counts[n] = m; totals[n] = tot;
      }
      const ctxKey = (n, hist) => (n > 1 ? hist.slice(Math.max(0, hist.length - (n - 1))).join(" ") : "");
      const cnt = (n, c, w) => { const mm = counts[n].get(c); return mm ? mm.get(w) || 0 : 0; };
      const tot = (n, c) => totals[n].get(c) || 0;
      function prob(n, hist, w, mode) {
        const c = ctxKey(n, hist), T = tot(n, c), cw = cnt(n, c, w);
        if (mode === "addk") return (cw + KADD) / (T + KADD * V);
        if (mode === "interp") { const lower = n > 1 ? prob(n - 1, hist, w, mode) : (cw + KADD) / (T + KADD * V); if (n === 1) return lower; return T > 0 ? LAMBDA * cw / T + (1 - LAMBDA) * lower : lower; }
        return T > 0 ? cw / T : 0;
      }
      const pad = (n, toks) => new Array(Math.max(0, n - 1)).fill("<s>").concat(toks);
      function perplexity(n, mode) {
        const t = pad(n, words(HELD)).concat(["</s>"]); let lp = 0, N = 0;
        for (let i = n - 1; i < t.length; i++) { const p = prob(n, t.slice(0, i), t[i], mode); if (!(p > 0)) return Infinity; lp += Math.log(p); N++; }
        return Math.exp(-lp / Math.max(1, N));
      }
      let gen = [], genLo = false, genHi = false, showCorpus = false; const visited = {};
      const order = () => clamp(num(api.params.n, 2) | 0, 1, MAXN), mode = () => String(api.params.smooth);
      function history() { const seq = words(api.params.prefix).concat(gen), cut = seq.lastIndexOf("."); return pad(order(), cut >= 0 ? seq.slice(cut + 1) : seq); }
      function distribution() { const n = order(), hist = history(), md = mode(), c = ctxKey(n, hist); return { ps: vocabArr.map((w) => prob(n, hist, w, md)), unseen: tot(n, c) === 0, ctx: c, n, md }; }
      const modeLabel = (md) => (md === "mle" ? "MLE counts" : md === "addk" ? "add-k smoothing" : "interpolated back-off");
      function refresh() {
        const d = distribution(); let Hb = 0; d.ps.forEach((p) => { if (p > 1e-12) Hb -= p * Math.log2(p); });
        const pp = perplexity(d.n, d.md);
        api.readout({ "Vocabulary |V|": V, "Corpus tokens": nTokens, "Context used": d.ctx ? `“${d.ctx}”` : "(none — unigram)", "Context seen in corpus": d.unseen ? "no ✗" : `yes (${tot(d.n, d.ctx)}×)`, "Next-word entropy": fmt(Hb, 2) + " bits", "Held-out perplexity": Number.isFinite(pp) ? fmt(pp, 1) : "∞ (a zero probability)" });
        if (d.n === 4 && d.md === "mle" && d.unseen) api.award("sparsity");
        if (d.md === "interp") { visited[d.n] = true; if (visited[1] && visited[2] && visited[3] && visited[4]) api.award("perplexity"); }
        panel(); draw(d);
      }
      function panel() {
        const pre = esc(words(api.params.prefix).join(" ")), g = gen.map((w) => `<span style="color:${C.primary}">${esc(w)}</span>`).join(" ");
        let h = `<div style="font-size:.95em;line-height:1.5"><span style="color:${C.muted};font-size:.8em">Prefix + generated:</span><br><span style="color:${C.accent};font-weight:600">${pre}</span> ${g || `<i style="color:${C.muted}">press Generate</i>`}</div>`;
        h += `<div style="color:${C.muted};font-size:.8em;margin-top:4px">Held-out sentence for perplexity (not in the corpus): “${esc(HELD)}”</div>`;
        if (showCorpus) h += `<div style="margin-top:8px;padding:8px 10px;border-radius:8px;background:${rgba(C.text, 0.05)};font-size:.82em;line-height:1.45;color:${C.text};white-space:pre-wrap">${esc(CORPUS)}</div>`;
        api.html(h);
      }
      function draw(d) {
        const W = cv.width, H = cv.height, ctx = cv.ctx; ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        const bw = Math.max(80, W * 0.62), labW = Math.min(110, bw * 0.3), rows = 14, rowH = Math.min(24, (H - 44) / rows);
        text(ctx, `P(next word | ${d.ctx ? "“" + d.ctx + "”" : "∅"})  ·  n = ${d.n}  ·  ${modeLabel(d.md)}`, 8, 18, { color: C.text, size: 12, weight: "700" });
        const items = d.ps.map((p, i) => [p, vocabArr[i]]).sort((a, b) => b[0] - a[0]).slice(0, rows), top = items.length ? items[0][0] : 0;
        if (d.unseen && d.md === "mle") {
          text(ctx, "This context never occurs in the corpus, so maximum likelihood assigns P = 0 to EVERY word.", 8, 48, { color: C.danger, size: 12 });
          text(ctx, "Sparsity: with n = 4 most 3-word contexts are unseen even in huge corpora. Smoothing or back-off fixes it.", 8, 68, { color: C.muted, size: 11 });
        } else if (top > 0) items.forEach(([p, w], i) => {
          const y = 30 + i * rowH, len = Math.max(1, (bw - labW - 54) * p / top);
          text(ctx, w, 8 + labW - 6, y + rowH * 0.72, { color: C.text, size: 11, align: "right" });
          ctx.fillStyle = i === 0 ? C.accent : C.primary; ctx.fillRect(8 + labW, y + 3, len, Math.max(2, rowH - 6));
          text(ctx, fmt(p, 3), 8 + labW + len + 4, y + rowH * 0.72, { color: C.muted, size: 10 });
        });
        const px = 8 + bw + 20, pw = Math.max(40, W - px - 8), top0 = 36, ph = Math.max(40, H - top0 - 36), pps = [1, 2, 3, 4].map((k) => perplexity(k, d.md)), finite = pps.filter(Number.isFinite), mx = finite.length ? Math.max.apply(null, finite) : 1;
        text(ctx, "Held-out perplexity vs n", px, 18, { color: C.text, size: 11, weight: "700" });
        pps.forEach((pp, i) => {
          const x = px + i * (pw / 4) + 6, w = Math.max(2, pw / 4 - 12), h = Number.isFinite(pp) ? Math.max(2, ph * pp / mx) : ph, y = top0 + ph - h;
          ctx.fillStyle = Number.isFinite(pp) ? (i + 1 === d.n ? C.accent : rgba(C.primary, 0.7)) : rgba(C.danger, 0.35); ctx.fillRect(x, y, w, h);
          text(ctx, Number.isFinite(pp) ? fmt(pp, 0) : "∞", x + w / 2, y - 4, { color: C.text, size: 10, align: "center" });
          text(ctx, `n=${i + 1}`, x + w / 2, top0 + ph + 14, { color: i + 1 === d.n ? C.accent : C.muted, size: 10, align: "center" });
        });
        text(ctx, "lower is better", px, top0 + ph + 28, { color: C.muted, size: 9 });
      }
      api.onParam(() => refresh());
      api.onResize(() => refresh());
      api.setStatus("Bars show the model's next-word distribution after the prefix. Change n and smoothing, then press Generate to sample a continuation.");
      refresh();
      return {
        generate() {
          const T = clamp(num(api.params.temp, 0.8), 0.05, 5), max = clamp(num(api.params.maxlen, 15) | 0, 1, 80), out = [], n = order(), md = mode();
          let hist = history();
          for (let s = 0; s < max; s++) {
            const ps = vocabArr.map((w) => prob(n, hist, w, md)); let sum = 0; for (const p of ps) sum += p;
            if (!(sum > 0)) { api.setStatus("Generation stopped: the context has zero counts and MLE gives no probability mass at all. Switch on smoothing."); break; }
            const q = softmax(ps.map((p) => Math.log(Math.max(p, 1e-12))), T), w = vocabArr[sampleIndex(q, rand)];
            if (w === "</s>") { out.push("."); break; }
            out.push(w); hist = hist.concat([w]);
          }
          gen = gen.concat(out); if (gen.length > 200) gen = gen.slice(-200);
          if (T <= 0.3) genLo = true; if (T >= 1.8) genHi = true; if (genLo && genHi) api.award("temperature");
          refresh();
        },
        clear() { gen = []; refresh(); },
        corpus() { showCorpus = !showCorpus; panel(); },
        destroy() {},
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 7. bandit
  Sims.register({
    id: "bandit",
    name: "Multi-Armed Bandit",
    domains: ["ai", "math"],
    description: "k slot machines with hidden payout rates. Balance exploring and exploiting with ε-greedy, UCB1 or Thompson sampling — or pull the arms yourself and compete.",
    params: [
      { key: "k", label: "Arms k", type: "range", min: 2, max: 10, step: 1, value: 5 },
      { key: "reward", label: "Reward type", type: "select", value: "bernoulli", options: [ { value: "bernoulli", label: "Bernoulli (win / lose)" }, { value: "gaussian", label: "Gaussian (σ = 1)" } ] },
      { key: "strategy", label: "Strategy", type: "select", value: "egreedy", options: [ { value: "egreedy", label: "ε-greedy" }, { value: "ucb", label: "UCB1" }, { value: "thompson", label: "Thompson sampling" } ] },
      { key: "eps", label: "ε (exploration rate)", type: "range", min: 0, max: 1, step: 0.01, value: 0.1 },
      { key: "c", label: "UCB exploration c", type: "range", min: 0, max: 3, step: 0.1, value: 1.4 },
      { key: "speed", label: "Pulls per frame", type: "range", min: 1, max: 50, step: 1, value: 3 },
      { key: "reveal", label: "Reveal true means", type: "toggle", value: false },
    ],
    actions: [ { label: "▶ / ❚❚ Auto-play", fn: (h) => h.toggle() }, { label: "+1 pull", fn: (h) => h.auto(1) }, { label: "+100 pulls", fn: (h) => h.auto(100) }, { label: "Reset stats", fn: (h) => h.reset() }, { label: "New bandit", fn: (h) => h.newBandit() } ],
    challenges: [
      { id: "hand", text: "Pull the arms by hand (click them) 30 times before any auto-play. Which arm do you think is best, and how sure are you?", xp: 10 },
      { id: "greedy_trap", text: "Set ε = 0 (pure greedy) and auto-play 500 pulls. Reveal the means: did it lock onto a sub-optimal arm? Why can it never recover?", xp: 10 },
      { id: "optimal80", text: "Reach ≥ 80 % optimal-arm pulls after 1000+ pulls with any strategy.", xp: 15 },
      { id: "compare", text: "On the same bandit run UCB1 and Thompson to 2000 pulls each (Reset stats in between). Whose regret curve flattens first, and why is regret sub-linear at all?", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), rand = api.random;
      let means = [], counts = [], sums = [], wins = [], t = 0, regret = 0, regHist = [], optHist = [], stride = 1, optPulls = 0, manual = 0, autoCount = 0, reward = 0, running = false, last = null, dirty = true, acc = 0, seed = 1;
      const isGauss = () => String(api.params.reward) === "gaussian";
      const est = (i) => (counts[i] ? sums[i] / counts[i] : 0);
      function reset() { const k = means.length; counts = new Array(k).fill(0); sums = new Array(k).fill(0); wins = new Array(k).fill(0); t = 0; regret = 0; regHist = [[0, 0]]; optHist = []; stride = 1; optPulls = 0; manual = 0; autoCount = 0; reward = 0; last = null; running = false; dirty = true; update(); }
      function newBandit() { const r = makeRng(seed * 48271 + 3), k = clamp(num(api.params.k, 5) | 0, 2, 10), g = isGauss(); means = []; for (let i = 0; i < k; i++) means.push(g ? r() * 2 - 1 : 0.1 + r() * 0.8); reset(); }
      function choose() {
        const k = means.length, s = String(api.params.strategy);
        if (s === "ucb") {
          for (let i = 0; i < k; i++) if (!counts[i]) return i;
          const c = Math.max(0, num(api.params.c, 1.4)); let b = 0, bv = -Infinity;
          for (let i = 0; i < k; i++) { const u = est(i) + c * Math.sqrt(Math.log(t + 1) / counts[i]); if (u > bv) { bv = u; b = i; } }
          return b;
        }
        if (s === "thompson") {
          let b = 0, bv = -Infinity;
          for (let i = 0; i < k; i++) { const smp = isGauss() ? est(i) + gaussian(rand) / Math.sqrt(counts[i] + 1) : betaSample(rand, 1 + wins[i], 1 + counts[i] - wins[i]); if (smp > bv) { bv = smp; b = i; } }
          return b;
        }
        if (rand() < clamp(num(api.params.eps, 0.1), 0, 1)) return Math.floor(rand() * k);
        let best = [], bv = -Infinity;
        for (let i = 0; i < k; i++) { const e = est(i); if (e > bv + 1e-12) { bv = e; best = [i]; } else if (Math.abs(e - bv) <= 1e-12) best.push(i); }
        return best[Math.floor(rand() * best.length)];
      }
      function pull(i, byHand) {
        const g = isGauss(), r = g ? means[i] + gaussian(rand) : (rand() < means[i] ? 1 : 0), best = argmax(means);
        counts[i]++; sums[i] += r; if (r > 0.5) wins[i]++; t++; reward += r; if (i === best) optPulls++; regret += means[best] - means[i];
        if (t % stride === 0) { regHist.push([t, regret]); optHist.push([t, optPulls / t]); if (regHist.length > 800) { regHist = regHist.filter((_, j) => j % 2 === 0); optHist = optHist.filter((_, j) => j % 2 === 0); stride *= 2; } }
        if (byHand) { manual++; if (manual >= 30 && autoCount === 0) api.award("hand"); } else autoCount++;
        last = { i, r, t: 1 }; dirty = true;
        if (t >= 1000 && optPulls / t >= 0.8) api.award("optimal80");
        if (String(api.params.strategy) === "egreedy" && num(api.params.eps, 0.1) === 0 && autoCount >= 500) api.award("greedy_trap");
      }
      function update() {
        api.readout({ "Pulls": t, "Total reward": fmt(reward, isGauss() ? 1 : 0), "Average reward": t ? fmt(reward / t, 3) : "—", "Cumulative regret": fmt(regret, 2), "Optimal-arm share": t ? pct(optPulls / t) : "—", "Manual pulls": manual, "Policy": String(api.params.strategy) });
      }
      function layout() { const W = cv.width, H = cv.height, box = { x: 8, y: 28, w: Math.max(60, W * 0.55), h: Math.max(60, H - 76) }; return { W, H, box, bw: box.w / Math.max(1, means.length) }; }
      function draw() {
        const L = layout(), ctx = cv.ctx, W = L.W, H = L.H, box = L.box, bw = L.bw, k = means.length, g = isGauss(), lo = g ? -1.5 : 0, hi = g ? 1.5 : 1, v = view(box, 0, k, lo, hi), zero = v.y(Math.max(lo, 0));
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        text(ctx, "bar = estimated mean · whisker = 95 % interval" + (String(api.params.strategy) === "ucb" ? " · light cap = UCB bonus" : "") + (api.params.reveal ? " · yellow tick = true mean" : ""), box.x, 16, { color: C.text, size: 10, weight: "600" });
        for (let i = 0; i <= 4; i++) { const val = lo + (hi - lo) * i / 4, y = v.y(val); line(ctx, box.x, y, box.x + box.w, y, C.grid); text(ctx, fmt(val, 2), box.x + box.w + 3, y + 3, { color: C.muted, size: 9 }); }
        for (let i = 0; i < k; i++) {
          const x0 = v.x(i) + bw * 0.15, wd = bw * 0.7, e = est(i), n = counts[i], col = C.series[i % C.series.length];
          ctx.fillStyle = rgba(col, n ? 0.85 : 0.3); ctx.fillRect(x0, Math.min(zero, v.y(e)), wd, Math.abs(zero - v.y(e)));
          let lo95, hi95;
          if (g) { const sd = 1 / Math.sqrt(n + 1); lo95 = e - 1.96 * sd; hi95 = e + 1.96 * sd; }
          else { const a = 1 + wins[i], b = 1 + n - wins[i], m = a / (a + b), sd = Math.sqrt(a * b / ((a + b) * (a + b) * (a + b + 1))); lo95 = m - 1.96 * sd; hi95 = m + 1.96 * sd; }
          line(ctx, x0 + wd / 2, v.y(clamp(lo95, lo, hi)), x0 + wd / 2, v.y(clamp(hi95, lo, hi)), C.text, 1.5);
          if (String(api.params.strategy) === "ucb" && n) { const u = clamp(e + Math.max(0, num(api.params.c, 1.4)) * Math.sqrt(Math.log(t + 1) / n), lo, hi); ctx.fillStyle = rgba(col, 0.25); ctx.fillRect(x0, v.y(u), wd, Math.max(0, v.y(clamp(e, lo, hi)) - v.y(u))); }
          if (api.params.reveal) line(ctx, x0 - 4, v.y(means[i]), x0 + wd + 4, v.y(means[i]), C.accent, 2);
          text(ctx, `#${i + 1}`, x0 + wd / 2, box.y + box.h + 14, { color: C.text, size: 11, align: "center" });
          text(ctx, `n=${n}`, x0 + wd / 2, box.y + box.h + 26, { color: C.muted, size: 9, align: "center" });
          if (last && last.i === i && last.t > 0) text(ctx, g ? fmt(last.r, 2) : last.r ? "+1 🎉" : "0", x0 + wd / 2, v.y(clamp(e, lo, hi)) - 8 - (1 - last.t) * 10, { color: last.r > 0 ? C.ok : C.danger, size: 12, weight: "700", align: "center" });
        }
        text(ctx, "click an arm to pull it yourself", box.x, box.y + box.h + 42, { color: C.muted, size: 10 });
        const px = box.x + box.w + 40, pw = Math.max(40, W - px - 8);
        plot(ctx, C, { x: px, y: 8, w: pw, h: Math.max(40, H * 0.48) }, [{ data: regHist, color: C.danger, label: "cumulative regret" }], { title: "Regret Σ(μ* − μ pulled)", yMin: 0 });
        plot(ctx, C, { x: px, y: H * 0.52, w: pw, h: Math.max(40, H * 0.48 - 8) }, [{ data: optHist, color: C.ok, label: "optimal-arm share" }], { title: "Fraction of pulls on the best arm", yMin: 0, yMax: 1 });
      }
      api.loop((dt) => {
        if (last && last.t > 0) { last.t -= dt * 1.5; dirty = true; }
        if (running) { const n = clamp(num(api.params.speed, 3) | 0, 1, 200); for (let i = 0; i < n; i++) pull(choose(), false); acc += dt; if (t > 200000) running = false; if (acc > 0.12 || !running) { acc = 0; update(); } }
        if (dirty) { draw(); dirty = false; }
        return true;
      });
      api.onParam((k) => { if (k === "k" || k === "reward") newBandit(); dirty = true; update(); });
      api.onResize(() => { dirty = true; });
      api.pointer(cv.canvas, { down: (p) => {
        const L = layout(); if (p.x < L.box.x || p.x > L.box.x + L.box.w || p.y < L.box.y - 10 || p.y > L.box.y + L.box.h + 30) return;
        pull(clamp(Math.floor((p.x - L.box.x) / L.bw), 0, means.length - 1), true); update();
      } });
      api.setStatus("Each arm pays out with a hidden rate. Pull by hand (click) to build intuition, then let a strategy play and watch the regret curve.");
      newBandit();
      return {
        toggle() { running = !running; update(); },
        auto(n) { running = false; for (let i = 0; i < (n || 1); i++) pull(choose(), false); update(); },
        reset() { reset(); },
        newBandit() { seed++; newBandit(); api.setStatus("New hidden means drawn. Stats reset."); },
        destroy() {},
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 8. gridworld_rl
  Sims.register({
    id: "gridworld_rl",
    name: "Gridworld: Q-learning vs SARSA",
    domains: ["ai", "robotics"],
    description: "Temporal-difference control on a gridworld with a cliff. Watch Q-values and the greedy policy emerge, and see why off-policy Q-learning walks the edge while on-policy SARSA plays it safe.",
    params: [
      { key: "world", label: "World", type: "select", value: "cliff", options: [ { value: "cliff", label: "Cliff walk (12×4, −100 cliff)" }, { value: "maze", label: "Walled maze (10×7)" }, { value: "open", label: "Open field (8×6)" } ] },
      { key: "algo", label: "Algorithm", type: "select", value: "qlearning", options: [ { value: "qlearning", label: "Q-learning (off-policy)" }, { value: "sarsa", label: "SARSA (on-policy)" } ] },
      { key: "alpha", label: "Learning rate α", type: "range", min: 0.01, max: 1, step: 0.01, value: 0.5 },
      { key: "gamma", label: "Discount γ", type: "range", min: 0, max: 1, step: 0.01, value: 0.95 },
      { key: "eps", label: "Exploration ε", type: "range", min: 0, max: 1, step: 0.01, value: 0.1 },
      { key: "speed", label: "Steps per frame", type: "range", min: 1, max: 300, step: 1, value: 30 },
    ],
    actions: [ { label: "▶ / ❚❚ Train", fn: (h) => h.toggle() }, { label: "1 episode", fn: (h) => h.episode() }, { label: "Show greedy path", fn: (h) => h.greedyRun() }, { label: "Reset Q", fn: (h) => h.reset() } ],
    challenges: [
      { id: "first_goal", text: "Reach the goal in at least one episode.", xp: 10 },
      { id: "cliff_compare", text: "On the cliff, train Q-learning and then SARSA (ε = 0.1) for 300 episodes each. Which greedy path hugs the cliff, which stays high — and why does on-policy learning care about ε?", xp: 25 },
      { id: "eps_zero", text: "Reset Q with ε = 0 from the start. Does the agent ever find the goal? Now set ε = 0 only after training — what changes?", xp: 15 },
      { id: "gamma", text: "Set γ = 0.3 on the maze and train. Why do cells far from the goal stay 'blind' — what does γ do to the planning horizon?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), rand = api.random, DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      const WORLDS = {
        cliff: { cols: 12, rows: 4, start: [0, 3], goal: [11, 3], cliff: (c, r) => r === 3 && c > 0 && c < 11, walls: [], stepR: -1, goalR: 0 },
        maze: { cols: 10, rows: 7, start: [0, 6], goal: [9, 0], cliff: () => false, walls: [[2, 0], [2, 1], [2, 2], [2, 3], [4, 3], [4, 4], [4, 5], [4, 6], [6, 0], [6, 1], [6, 2], [7, 2], [6, 4], [6, 5], [8, 4], [8, 5], [8, 6]], stepR: -1, goalR: 10 },
        open: { cols: 8, rows: 6, start: [0, 5], goal: [7, 0], cliff: () => false, walls: [], stepR: -1, goalR: 10 },
      };
      let Wd = WORLDS[String(api.params.world)] || WORLDS.cliff, Q = null, s = null, a = 0, steps = 0, ret = 0, returns = { qlearning: [], sarsa: [] }, epCount = { qlearning: 0, sarsa: 0 }, falls = 0, running = true, dirty = true, trail = [], lastReturn = null, acc = 0, greedyLen = null, goalsReached = 0, shownGreedy = false;
      const algo = () => (String(api.params.algo) === "sarsa" ? "sarsa" : "qlearning");
      const idx = (c, r) => (r * Wd.cols + c) * 4;
      const isWall = (c, r) => Wd.walls.some((w) => w[0] === c && w[1] === r);
      const maxQ = (c, r) => { const b = idx(c, r); return Math.max(Q[b], Q[b + 1], Q[b + 2], Q[b + 3]); };
      function greedy(st, deterministic) {
        const b = idx(st[0], st[1]); let best = [0], bv = Q[b];
        for (let k = 1; k < 4; k++) { if (Q[b + k] > bv + 1e-12) { bv = Q[b + k]; best = [k]; } else if (Math.abs(Q[b + k] - bv) <= 1e-12) best.push(k); }
        return deterministic ? best[0] : best[Math.floor(rand() * best.length)];
      }
      const policy = (st) => (rand() < clamp(num(api.params.eps, 0.1), 0, 1) ? Math.floor(rand() * 4) : greedy(st));
      function move(st, act) { const d = DIRS[act]; let c = st[0] + d[0], r = st[1] + d[1]; if (c < 0 || r < 0 || c >= Wd.cols || r >= Wd.rows || isWall(c, r)) { c = st[0]; r = st[1]; } return [c, r]; }
      function startEpisode() { s = Wd.start.slice(); steps = 0; ret = 0; trail = [s.slice()]; a = policy(s); }
      function resetQ(keepHistory) { Q = new Float64Array(Wd.cols * Wd.rows * 4); if (!keepHistory) { returns = { qlearning: [], sarsa: [] }; epCount = { qlearning: 0, sarsa: 0 }; } falls = 0; greedyLen = null; lastReturn = null; shownGreedy = false; startEpisode(); dirty = true; update(); }
      function greedyPath() { // follow argmax Q from the start without learning; stops on a revisited state (a cycle)
        let st = Wd.start.slice(); const path = [st.slice()], seen = new Set([st.join(",")]);
        for (let i = 0; i < 200; i++) {
          st = move(st, greedy(st, true)); path.push(st.slice());
          if (Wd.cliff(st[0], st[1])) return { path, result: "falls off the cliff" };
          if (st[0] === Wd.goal[0] && st[1] === Wd.goal[1]) return { path, result: `${path.length - 1} steps` };
          const key = st.join(","); if (seen.has(key)) return { path, result: `loops after ${path.length - 1} steps (Q not converged there yet)` }; seen.add(key);
        }
        return { path, result: "never reaches the goal" };
      }
      function envStep() {
        if (shownGreedy) { shownGreedy = false; startEpisode(); }
        const alpha = clamp(num(api.params.alpha, 0.5), 0, 1), gamma = clamp(num(api.params.gamma, 0.95), 0, 1), al = algo();
        let s2 = move(s, a), r = Wd.stepR, done = false;
        if (Wd.cliff(s2[0], s2[1])) { r = -100; falls++; s2 = Wd.start.slice(); }
        else if (s2[0] === Wd.goal[0] && s2[1] === Wd.goal[1]) { r += Wd.goalR; done = true; }
        const a2 = policy(s2); let target = r;
        if (!done) target += gamma * (al === "sarsa" ? Q[idx(s2[0], s2[1]) + a2] : maxQ(s2[0], s2[1]));
        const bi = idx(s[0], s[1]) + a; Q[bi] += alpha * (target - Q[bi]);
        ret += r; steps++; s = s2; a = a2; trail.push(s.slice()); if (trail.length > 80) trail.shift();
        if (done || steps >= 500) {
          if (done) { goalsReached++; api.award("first_goal"); }
          epCount[al]++; const arr = returns[al]; arr.push([epCount[al], ret]); if (arr.length > 3000) arr.shift(); lastReturn = ret;
          if (String(api.params.world) === "cliff" && epCount.qlearning >= 300 && epCount.sarsa >= 300) api.award("cliff_compare");
          greedyLen = greedyPath().result; startEpisode();
        }
      }
      function update() {
        const arr = returns[algo()], recent = arr.slice(-50), avg = recent.length ? recent.reduce((x, p) => x + p[1], 0) / recent.length : null;
        api.readout({ "Episode": epCount[algo()], "Last return": lastReturn == null ? "—" : fmt(lastReturn, 0), "Mean return (last 50)": avg == null ? "—" : fmt(avg, 1), "Steps this episode": steps, "Cliff falls": falls, "Goals reached": goalsReached, "Greedy path": greedyLen || "not yet" });
      }
      const smooth = (arr) => arr.map((p, i) => { const w = arr.slice(Math.max(0, i - 9), i + 1); return [p[0], w.reduce((x, q) => x + q[1], 0) / w.length]; });
      function draw() {
        const W = cv.width, H = cv.height, ctx = cv.ctx, gw = Math.max(60, W * 0.6), cell = Math.max(6, Math.floor(Math.min((gw - 16) / Wd.cols, (H - 44) / Wd.rows))), ox = 8, oy = 24;
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        let vmin = Infinity, vmax = -Infinity;
        for (let r = 0; r < Wd.rows; r++) for (let c = 0; c < Wd.cols; c++) { if (isWall(c, r) || Wd.cliff(c, r)) continue; const m = maxQ(c, r); if (m < vmin) vmin = m; if (m > vmax) vmax = m; }
        if (!(vmax > vmin)) vmax = vmin + 1;
        const STOPS = [hexToRgb(C.danger), [26, 30, 56], hexToRgb(C.ok)];
        for (let r = 0; r < Wd.rows; r++) for (let c = 0; c < Wd.cols; c++) {
          const x = ox + c * cell, y = oy + r * cell, wall = isWall(c, r), cliff = Wd.cliff(c, r);
          if (wall) ctx.fillStyle = "#3a3f5c"; else if (cliff) ctx.fillStyle = rgba(C.danger, 0.55); else { const col = ramp(STOPS, (maxQ(c, r) - vmin) / (vmax - vmin)); ctx.fillStyle = `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`; }
          ctx.fillRect(x, y, cell, cell); ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, cell, cell);
          if (wall || cliff) continue;
          const b = idx(c, r), vals = [Q[b], Q[b + 1], Q[b + 2], Q[b + 3]];
          if (vals.some((q) => q !== 0)) { const d = DIRS[argmax(vals)], cx = x + cell / 2, cy = y + cell / 2, Lg = cell * 0.3; arrow(ctx, cx - d[0] * Lg, cy - d[1] * Lg, cx + d[0] * Lg, cy + d[1] * Lg, rgba(C.text, 0.85), 1.5); }
          if (cell >= 40) text(ctx, fmt(maxQ(c, r), 1), x + cell - 3, y + cell - 3, { color: rgba(C.text, 0.6), size: 9, align: "right" });
        }
        text(ctx, "S", ox + Wd.start[0] * cell + 3, oy + Wd.start[1] * cell + 11, { color: C.accent, size: 11, weight: "700" });
        text(ctx, "G", ox + Wd.goal[0] * cell + 3, oy + Wd.goal[1] * cell + 11, { color: C.ok, size: 11, weight: "700" });
        ctx.strokeStyle = rgba(C.accent, 0.6); ctx.lineWidth = 2; ctx.beginPath();
        trail.forEach((p, i) => { const x = ox + (p[0] + 0.5) * cell, y = oy + (p[1] + 0.5) * cell; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke();
        dot(ctx, ox + (s[0] + 0.5) * cell, oy + (s[1] + 0.5) * cell, Math.max(4, cell * 0.22), C.accent, C.bg, 2);
        text(ctx, `${algo() === "sarsa" ? "SARSA" : "Q-learning"} · episode ${epCount[algo()]} · step ${steps} · return ${ret}`, ox, 15, { color: C.text, size: 11, weight: "600" });
        text(ctx, "cell colour = max Q (red low → green high) · arrow = greedy action · red strip = cliff", ox, oy + Wd.rows * cell + 14, { color: C.muted, size: 10 });
        const px = ox + gw + 8, pw = Math.max(40, W - px - 8);
        plot(ctx, C, { x: px, y: 8, w: pw, h: Math.max(40, H - 16) }, [{ data: smooth(returns.qlearning), color: C.primary, label: "Q-learning" }, { data: smooth(returns.sarsa), color: C.secondary, label: "SARSA" }], { title: "Return per episode (10-ep. mean)", yMin: String(api.params.world) === "cliff" ? -200 : undefined });
      }
      api.loop((dt) => {
        if (running) { const n = clamp(num(api.params.speed, 30) | 0, 1, 2000); for (let i = 0; i < n; i++) envStep(); dirty = true; acc += dt; if (acc > 0.15) { acc = 0; update(); } }
        if (dirty) { draw(); dirty = false; }
        return true;
      });
      api.onParam((k) => {
        if (k === "world") { Wd = WORLDS[api.params.world] || WORLDS.cliff; resetQ(false); running = true; }
        else if (k === "algo") { resetQ(true); running = true; api.setStatus(`Switched to ${algo() === "sarsa" ? "SARSA: the target uses the action the ε-greedy policy will actually take" : "Q-learning: the target uses the best action regardless of what will be taken"}. Q reset, the other algorithm's curve is kept for comparison.`); }
        dirty = true; update();
      });
      api.onResize(() => { dirty = true; });
      api.setStatus("Training live. Each step: take an ε-greedy action, observe r, s′, then update Q(s,a) ← Q + α[r + γ·target − Q].");
      resetQ(false);
      return {
        toggle() { running = !running; update(); },
        episode() { running = false; const start = epCount[algo()]; let guard = 0; while (epCount[algo()] === start && guard++ < 5000) envStep(); dirty = true; update(); },
        greedyRun() { running = false; const g = greedyPath(); trail = g.path.slice(-80); s = g.path[g.path.length - 1].slice(); shownGreedy = true; dirty = true; api.setStatus(`Greedy (ε = 0) rollout from S: ${g.result}.`); update(); },
        reset() { resetQ(false); running = true; },
        destroy() {},
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 9. agent_sim
  const AGENT_TOOLS = { search: "🔍 search", calculator: "🧮 calculator", code_run: "💻 code_run", file_read: "📄 file_read", ask_user: "🙋 ask_user", finish: "✅ finish" };
  const AGENT_WRONG = {
    search: "Search results: ten generic pages; nothing that advances the current step.",
    calculator: "Error: empty expression — there is nothing to compute at this step.",
    code_run: "Error: nothing to execute — no code or command is relevant here.",
    file_read: "Error: ENOENT, no such file. Which file did you mean?",
    ask_user: "User: “You already have everything you need — please keep going.” (interrupting the user costs trust and a turn)",
    finish: "Final answer rejected by the checker: required facts are missing, the task is not done.",
  };
  // Each goal is a scripted ReAct trace: t = thought, tool = the right call, obs = its observation, fact = what gets remembered.
  const AGENT_GOALS = {
    trip: { title: "Plan a 3-day Kyoto trip under $1,500", stages: [
      { t: "I need the best season and typical costs before I can plan anything. Let me search.", tool: "search", args: "best time to visit Kyoto", obs: "Late March–early April is cherry-blossom season; mild weather, prices and crowds peak.", fact: "season: early April", wrong: { ask_user: "User: “Whenever is nicest — that is your job to figure out.”" } },
      { t: "Next: a realistic flight price for those dates.", tool: "search", args: "round-trip economy fare to Kansai (KIX) in April", obs: "Typical economy round-trip from the user's home airport: $850.", fact: "flight: $850", flaky: true },
      { t: "Now accommodation for three nights.", tool: "search", args: "mid-range Kyoto hotel April price per night", obs: "Mid-range hotels near Gion: about $120 per night.", fact: "hotel: $120 × 3" },
      { t: "Does this fit the $1,500 budget? I should compute it, not guess.", tool: "calculator", args: "850 + 3*120 + 3*60", obs: "= 1390", fact: "total: $1,390 (incl. $60/day food)", wrong: { search: "Search cannot add your numbers — results are generic 'Kyoto on a budget' blog posts." } },
      { t: "$1,390 fits with $110 to spare. I have every fact I need, so I should stop and answer.", tool: "finish", args: "Fly early April ($850), 3 nights near Gion ($360), food $180 → $1,390. Day 1 Fushimi Inari, day 2 Arashiyama, day 3 Gion & Kiyomizu-dera.", obs: "User accepts the plan.", wrong: { search: "More searching adds nothing new — this is the classic 'one more search' loop." } },
    ] },
    debug: { title: "Fix the failing test in utils.py", stages: [
      { t: "A test fails but I have not seen the error yet. Run the test suite first.", tool: "code_run", args: "pytest tests/test_utils.py -q", obs: "FAILED test_mean_empty — ZeroDivisionError in utils.mean, line 12", fact: "error: ZeroDivisionError in mean()", wrong: { search: "Search: 'how to fix ZeroDivisionError' — generic advice; you still do not know which test fails." } },
      { t: "Read the code before changing it.", tool: "file_read", args: "utils.py", obs: "def mean(xs):\n    return sum(xs) / len(xs)   # line 12", fact: "code: sum(xs)/len(xs)", wrong: { code_run: "Re-running the tests prints the same traceback — you need to read the code." } },
      { t: "Empty list → division by zero. Should mean([]) return 0, None or raise? That is a product decision, so ask.", tool: "ask_user", args: "What should mean([]) return?", obs: "User: “Return 0.0 for an empty list.”", fact: "spec: mean([]) → 0.0", wrong: { code_run: "Patched to return None without asking: test_mean_empty still fails (expected 0.0). Guessing the spec wasted a step." } },
      { t: "Apply the fix and re-run the tests to verify it.", tool: "code_run", args: "patch utils.py: return sum(xs)/len(xs) if xs else 0.0; pytest -q", obs: "3 passed in 0.04 s", fact: "tests: green" },
      { t: "Tests pass and the behaviour matches the user's spec. Done.", tool: "finish", args: "Fixed ZeroDivisionError: mean([]) now returns 0.0 (per user), all tests green.", obs: "PR approved." },
    ] },
    research: { title: "How much CO₂ does one transatlantic flight emit per passenger?", stages: [
      { t: "Find a credible per-passenger emission factor first.", tool: "search", args: "CO2 per passenger-km long-haul economy flight", obs: "ICAO/IEA: long-haul economy ≈ 0.09–0.11 kg CO₂ per passenger-km.", fact: "factor ≈ 0.10 kg/pkm", flaky: true, wrong: { calculator: "Error: nothing to calculate yet — no numbers have been gathered." } },
      { t: "Now the distance of a typical transatlantic route, New York → London.", tool: "search", args: "great-circle distance JFK to LHR km", obs: "JFK–LHR great-circle distance: 5,540 km.", fact: "distance: 5,540 km" },
      { t: "Multiply distance by the factor instead of estimating in my head.", tool: "calculator", args: "5540 * 0.10", obs: "= 554", fact: "≈ 554 kg CO₂ one-way", wrong: { search: "Blog posts quote anything from 300 kg to 2 t — compute it yourself from the facts you already have." } },
      { t: "Sanity-check against an independent calculator before answering.", tool: "search", args: "myclimate flight calculator JFK LHR economy", obs: "Independent calculator: ~0.5–0.6 t CO₂ per passenger one-way.", fact: "cross-check ✓" },
      { t: "Two sources agree. Time to answer with the working shown.", tool: "finish", args: "≈ 0.55 t CO₂ per passenger one-way (5,540 km × 0.10 kg/pkm), consistent with independent calculators; roughly double counting non-CO₂ effects.", obs: "Answer accepted, with citations." },
    ] },
    robot: { title: "The robot arm stopped mid-task — get it running safely", stages: [
      { t: "Check the robot's log before touching anything.", tool: "file_read", args: "/var/log/arm/latest.log", obs: "[ERR] joint_3 overcurrent 4.2 A > limit 3.5 A → E-stop engaged", fact: "fault: joint_3 overcurrent", wrong: { code_run: "arm.reset() → E-stop re-engages immediately. You still do not know the cause." } },
      { t: "Was the joint overloaded? Compute the torque at joint 3 for the current payload.", tool: "calculator", args: "2.5 kg * 9.81 * 0.6 m", obs: "= 14.7 N·m (joint 3 is rated for 12 N·m)", fact: "torque 14.7 N·m > 12 N·m rating" },
      { t: "The payload exceeds the rating. Changing payload or reach is a safety decision — confirm with the operator.", tool: "ask_user", args: "Payload 2.5 kg at 0.6 m exceeds joint 3's rating; reduce payload or shorten reach?", obs: "User: “Shorten the reach to 0.45 m.”", fact: "decision: reach 0.45 m", wrong: { code_run: "Changed the reach without asking: the operator rejects the unapproved change and re-arms the E-stop." } },
      { t: "Update the trajectory and run a dry-run check.", tool: "code_run", args: "arm.set_reach(0.45); arm.dry_run()", obs: "dry_run OK — peak joint_3 current 2.9 A", fact: "dry run OK at 2.9 A" },
      { t: "Root cause found, fix approved and verified. Report and finish.", tool: "finish", args: "Cause: joint_3 overcurrent from a 14.7 N·m load (rating 12). Fix: reach shortened to 0.45 m (operator approved), dry run 2.9 A. E-stop cleared.", obs: "Arm back in service." },
    ] },
  };
  Sims.register({
    id: "agent_sim",
    name: "LLM Agent Loop Simulator",
    domains: ["ai"],
    description: "Step through a ReAct-style agent: Thought → Action (tool call) → Observation. Choose the tools yourself and discover how wrong calls, missing memory and no step budget turn into loops and failures.",
    params: [
      { key: "goal", label: "Goal", type: "select", value: "trip", options: [ { value: "trip", label: "Plan a trip" }, { value: "debug", label: "Debug failing code" }, { value: "research", label: "Research a question" }, { value: "robot", label: "Fix a robot" } ] },
      { key: "mode", label: "Who picks the tools?", type: "select", value: "manual", options: [ { value: "manual", label: "I do (click a tool each step)" }, { value: "auto", label: "The agent (watch it run)" } ] },
      { key: "maxSteps", label: "Step budget (termination)", type: "range", min: 3, max: 20, step: 1, value: 10 },
      { key: "retry", label: "Retry failed tool calls", type: "toggle", value: true },
      { key: "memory", label: "Scratchpad memory", type: "toggle", value: true },
    ],
    actions: [ { label: "↻ Restart episode", fn: (h) => h.restart() }, { label: "Auto-step once", fn: (h) => h.autoStep() }, { label: "Hint", fn: (h) => h.hint() } ],
    challenges: [
      { id: "clean_run", text: "Complete any goal with zero wrong tool calls. Which clue in each Thought told you the right tool?", xp: 15 },
      { id: "loop", text: "Call the same wrong tool three times in a row. What should a production agent do when it notices repeated identical actions?", xp: 10 },
      { id: "budget", text: "Set the step budget to 4 and try the research goal. Why do agents need a termination rule, and what should they return when the budget runs out?", xp: 15 },
      { id: "memory", text: "Turn scratchpad memory off on the trip goal and run it. Where does the agent break down, and how do real agents fix this (context window vs. external memory)?", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 6, maxHeight: 230 }), extra = api.html("");
      let G = AGENT_GOALS.trip, stage = 0, resume = null, steps = 0, tokens = 0, calls = 0, wrong = 0, outcome = "running", log = [], facts = [], repeat = { tool: null, stage: -1, n: 0 }, flakyHit = {}, history = [], timer = 0;
      const tok = (s) => Math.ceil(String(s).length / 4), maxSteps = () => clamp(num(api.params.maxSteps, 10) | 0, 1, 50), cur = () => G.stages[Math.min(stage, G.stages.length - 1)];
      const push = (role, text, ok) => log.push({ role, text, ok });
      function think() { const st = cur(); push("thought", st.t); tokens += tok(st.t) + 30; }
      function start() {
        G = AGENT_GOALS[api.params.goal] || AGENT_GOALS.trip; stage = 0; resume = null; steps = 0; tokens = 80; calls = 0; wrong = 0; outcome = "running"; log = []; facts = []; repeat = { tool: null, stage: -1, n: 0 }; flakyHit = {}; history = []; timer = 0;
        push("system", `🎯 Goal: ${G.title}`); think(); render(); update(); draw();
      }
      function act(tool) {
        if (outcome !== "running" || !AGENT_TOOLS[tool]) return;
        const st = cur(), correct = tool === st.tool, args = correct ? st.args : tool === "finish" ? "(premature answer)" : "…";
        steps++; calls++; tokens += tok(args) + 20; push("action", `${tool}(${args})`);
        let obs, ok = correct;
        if (correct) {
          obs = st.obs;
          if (st.flaky && !flakyHit[stage]) {
            flakyHit[stage] = true;
            if (api.params.retry) obs = `⏳ ${tool} timed out (503) → automatic retry 1/2 after 0.5 s … ✔ ${st.obs}`;
            else { obs = `⏳ ${tool} timed out (503). No retry policy, so the step is simply wasted.`; ok = false; }
          }
          if (ok && tool === "finish" && !api.params.memory) {
            const lost = facts.find((f) => steps - f.step > 3);
            if (lost) { obs = `⚠ Context overflow: the observation “${lost.text}” was truncated from the prompt ${steps - lost.step} steps ago — I no longer have it and must fetch it again.`; ok = false; facts = facts.filter((f) => f !== lost); resume = stage; stage = lost.stage; api.award("memory"); }
          }
          if (ok && st.fact) facts.push({ text: st.fact, step: steps, stage });
        } else { obs = (st.wrong && st.wrong[tool]) || AGENT_WRONG[tool]; wrong++; }
        push("obs", obs, ok); tokens += tok(obs); history.push(ok);
        if (!correct) { if (repeat.tool === tool && repeat.stage === stage) repeat.n++; else repeat = { tool, stage, n: 1 }; } else repeat = { tool: null, stage: -1, n: 0 };
        if (ok) {
          if (tool === "finish") { outcome = "success"; push("system", `✅ Task complete in ${steps} steps and ≈${tokens} tokens.${wrong === 0 ? " Flawless — every tool call was the right one." : ` ${wrong} wasted call${wrong > 1 ? "s" : ""}.`}`); if (wrong === 0) api.award("clean_run"); }
          else if (resume != null && stage !== resume) { stage = resume; resume = null; }
          else stage++;
        }
        if (outcome === "running") {
          if (repeat.n >= 3) { outcome = "fail"; push("system", `🔁 Loop detected: “${tool}” repeated ${repeat.n}× at the same step with no new information. A robust agent watches for repeated (action, observation) pairs and re-plans or stops instead of burning tokens.`); api.award("loop"); }
          else if (steps >= maxSteps()) { outcome = "fail"; push("system", `⛔ Step budget (${maxSteps()}) exhausted${!api.params.memory && facts.length ? " — without memory the agent kept re-fetching facts it had already seen" : ""}. Agents need a termination rule: return the best partial answer plus what is missing, rather than running forever.`); if (maxSteps() <= 5) api.award("budget"); }
          else think();
        }
        render(); update(); draw();
      }
      function render() {
        const base = "margin:4px 0;padding:6px 10px;border-radius:10px;max-width:94%;font-size:.86em;line-height:1.35;white-space:pre-wrap;";
        const bubble = (e) => {
          if (e.role === "thought") return `<div style="${base}background:${rgba(C.primary, 0.12)};border-left:3px solid ${C.primary}"><b style="color:${C.primary}">💭 Thought</b> — ${esc(e.text)}</div>`;
          if (e.role === "action") return `<div style="${base}margin-left:4%;background:${rgba(C.accent, 0.1)};border-left:3px solid ${C.accent};font-family:ui-monospace,monospace"><b style="color:${C.accent}">⚡ Action</b> ${esc(e.text)}</div>`;
          if (e.role === "obs") { const col = e.ok ? C.ok : C.danger; return `<div style="${base}margin-left:8%;background:${rgba(col, 0.1)};border-left:3px solid ${col}"><b style="color:${col}">👁 Observation</b> — ${esc(e.text)}</div>`; }
          return `<div style="${base}background:${rgba(C.text, 0.06)};color:${C.text}"><b>${esc(e.text)}</b></div>`;
        };
        const footer = outcome !== "running" ? `<div style="margin-top:6px;color:${C.muted};font-size:.8em">Episode over — press “Restart episode” or change the goal to try again.</div>`
          : String(api.params.mode) === "auto" ? `<div style="margin-top:6px;color:${C.muted};font-size:.8em">Auto mode: the agent picks its own tools…</div>`
          : `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span style="color:${C.muted};font-size:.8em">Your move — which tool should the agent call?</span>${Object.keys(AGENT_TOOLS).map((t) => `<button type="button" data-tool="${t}" class="sim-btn" style="padding:5px 9px">${AGENT_TOOLS[t]}</button>`).join("")}</div>`;
        const mem = `<div style="font-size:.8em;color:${C.muted};margin-top:6px">🧠 Scratchpad${api.params.memory ? "" : " (memory OFF — observations older than 3 steps fall out of context)"}: ${facts.length ? facts.map((f) => `<span style="display:inline-block;margin:2px;padding:2px 6px;border-radius:6px;background:${rgba(C.ok, 0.15)};color:${C.text}">${esc(f.text)}</span>`).join("") : "<i>empty</i>"}</div>`;
        api.html(`<div data-log style="max-height:340px;overflow:auto;padding-right:4px">${log.map(bubble).join("")}</div>${footer}${mem}`);
        const sc = extra.querySelector("[data-log]"); if (sc) sc.scrollTop = sc.scrollHeight;
      }
      function update() { api.readout({ "Steps": `${steps} / ${maxSteps()}`, "Tokens (≈)": tokens, "Tool calls": calls, "Wrong calls": wrong, "Facts in memory": facts.length, "Outcome": outcome === "running" ? "in progress…" : outcome === "success" ? "success ✅" : "failed ⛔" }); }
      function gauge(ctx, x, y, w, h, f, col) { ctx.fillStyle = rgba(C.text, 0.08); ctx.fillRect(x, y, w, h); ctx.fillStyle = col; ctx.fillRect(x, y, w * clamp(num(f, 0), 0, 1), h); }
      function draw() {
        const W = cv.width, H = cv.height, ctx = cv.ctx; ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        const cx = W * 0.27, cy = H * 0.5, R = Math.min(W * 0.17, H * 0.36), N = { think: [cx - R, cy - R * 0.45], act: [cx + R, cy - R * 0.45], observe: [cx, cy + R * 0.75] }, done = outcome !== "running";
        arrow(ctx, N.think[0] + 36, N.think[1], N.act[0] - 36, N.act[1], C.muted, 1.5);
        arrow(ctx, N.act[0] - 12, N.act[1] + 18, N.observe[0] + 26, N.observe[1] - 12, C.muted, 1.5);
        arrow(ctx, N.observe[0] - 26, N.observe[1] - 12, N.think[0] + 12, N.think[1] + 18, C.muted, 1.5);
        arrow(ctx, N.act[0] + 34, N.act[1], N.act[0] + R * 0.9, N.act[1], C.muted, 1.5);
        const node = (p, label, hot, col) => { dot(ctx, p[0], p[1], 24, hot ? col : rgba(col, 0.18), col, 2); text(ctx, label, p[0], p[1] + 4, { color: hot ? C.bg : C.text, size: 11, weight: "700", align: "center" }); };
        node(N.think, "Think", !done && log.length && log[log.length - 1].role === "thought" && String(api.params.mode) === "auto", C.primary);
        node(N.act, "Act", !done && String(api.params.mode) !== "auto", C.accent);
        node(N.observe, "Observe", false, C.ok);
        const endX = N.act[0] + R * 0.9 + 30;
        ctx.fillStyle = done ? (outcome === "success" ? C.ok : C.danger) : rgba(C.text, 0.1); ctx.fillRect(endX - 28, N.act[1] - 14, 56, 28);
        text(ctx, done ? (outcome === "success" ? "Done" : "Fail") : "Stop?", endX, N.act[1] + 4, { color: done ? C.bg : C.muted, size: 11, weight: "700", align: "center" });
        text(ctx, "ReAct loop: the LLM thinks, calls a tool, reads the result, repeats until it decides to stop", 10, H - 8, { color: C.muted, size: 9 });
        const tx = W * 0.58, tw = Math.max(40, W * 0.4);
        text(ctx, `Steps ${steps} / ${maxSteps()}`, tx, 16, { color: C.text, size: 11, weight: "600" }); gauge(ctx, tx, 22, tw, 9, steps / maxSteps(), steps >= maxSteps() - 1 ? C.danger : C.accent);
        text(ctx, `Tokens ≈ ${tokens}`, tx, 50, { color: C.text, size: 11, weight: "600" }); gauge(ctx, tx, 56, tw, 9, tokens / 2500, C.primary);
        text(ctx, `Progress: stage ${Math.min(stage + (outcome === "success" ? 1 : 0), G.stages.length)} / ${G.stages.length}`, tx, 84, { color: C.text, size: 11, weight: "600" }); gauge(ctx, tx, 90, tw, 9, (stage + (outcome === "success" ? 1 : 0)) / G.stages.length, C.ok);
        text(ctx, "Trace:", tx, 120, { color: C.muted, size: 10 });
        history.slice(-24).forEach((ok, i) => dot(ctx, tx + 44 + i * 14, 116, 5, ok ? C.ok : C.danger));
        text(ctx, `${facts.length} fact${facts.length === 1 ? "" : "s"} in scratchpad · retries ${api.params.retry ? "on" : "off"} · memory ${api.params.memory ? "on" : "off"}`, tx, 142, { color: C.muted, size: 10 });
      }
      const onClick = (e) => { const b = e.target && e.target.closest ? e.target.closest("[data-tool]") : null; if (b && String(api.params.mode) !== "auto") act(b.getAttribute("data-tool")); };
      extra.addEventListener("click", onClick);
      api.loop((dt) => { if (String(api.params.mode) === "auto" && outcome === "running") { timer += dt; if (timer > 0.9) { timer = 0; act(cur().tool); } } return true; });
      api.onParam((k) => { if (k === "goal") start(); else { render(); update(); draw(); } });
      api.onResize(() => draw());
      api.setStatus("Read the Thought, then click the tool the agent should call. Wrong tools waste steps; three identical wrong calls = a loop.");
      start();
      return {
        restart() { start(); },
        autoStep() { if (outcome === "running") act(cur().tool); },
        hint() { if (outcome !== "running") return; const st = cur(); api.setStatus(`Hint: the Thought names what is missing — the right call here is ${AGENT_TOOLS[st.tool]}${st.tool === "ask_user" ? " (it is a judgement call only the user can make)" : st.tool === "finish" ? " (all facts are in memory; more actions would just burn tokens)" : ""}.`); },
        destroy() { extra.removeEventListener("click", onClick); },
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════ 10. tokenizer
  Sims.register({
    id: "tokenizer",
    name: "Tokenizer Lab (BPE)",
    domains: ["ai"],
    description: "Train byte-pair encoding on a small corpus and watch merges turn characters into sub-words. Compare with whitespace, word and character tokenisation.",
    params: [
      { key: "text", label: "Text to tokenise", type: "text", value: "the robots unlocked the laboratory doors unexpectedly" },
      { key: "mode", label: "Tokeniser", type: "select", value: "bpe", options: [ { value: "bpe", label: "BPE (trained here)" }, { value: "char", label: "Characters" }, { value: "word", label: "Words + punctuation" }, { value: "ws", label: "Whitespace split" } ] },
      { key: "merges", label: "BPE merges applied", type: "range", min: 0, max: 200, step: 1, value: 60 },
      { key: "lower", label: "Lower-case the input", type: "toggle", value: true },
    ],
    actions: [ { label: "Show / hide merge table", fn: (h) => h.toggleMerges() }, { label: "Random corpus sentence", fn: (h) => h.corpusSample() } ],
    challenges: [
      { id: "unk", text: "Type a word with a character the corpus never saw (e.g. “café” or digits). What does each tokeniser do with it, and why is that a problem for a model?", xp: 10 },
      { id: "sweep", text: "Slide merges from 0 to 200 and watch tokens-per-character. Where do the gains flatten, and why?", xp: 10 },
      { id: "rare_word", text: "Find an English word that is still split into 4+ BPE tokens at 190+ merges. Why do rare words fragment while common ones become single tokens?", xp: 15 },
      { id: "compare_modes", text: "Compare word-level and BPE vocabulary sizes on this corpus. Which handles a brand-new word better, and at what cost?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 6, maxHeight: 240 }), DEFAULT = "the robots unlocked the laboratory doors unexpectedly", MAXM = 200, WS = "▁", SEP = "\u0001";
      const corpusWords = CORPUS.toLowerCase().match(/[a-z]+|[^\sa-z]/g) || [], freq = new Map();
      corpusWords.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
      const wsVocab = new Set(CORPUS.toLowerCase().split(/\s+/).filter(Boolean));
      const seqs = Array.from(freq.entries()).map(([w, f]) => ({ sym: [WS].concat(Array.from(w)), f })), base = new Set();
      seqs.forEach((s) => s.sym.forEach((c) => base.add(c)));
      const merges = [], corpusTokens = [seqs.reduce((a, s) => a + s.sym.length * s.f, 0)];
      for (let m = 0; m < MAXM; m++) { // BPE training: repeatedly merge the most frequent adjacent pair
        const pc = new Map(); let bestPair = null, bestCount = 0;
        seqs.forEach((s) => { for (let i = 0; i + 1 < s.sym.length; i++) { const key = s.sym[i] + SEP + s.sym[i + 1], c = (pc.get(key) || 0) + s.f; pc.set(key, c); if (c > bestCount) { bestCount = c; bestPair = key; } } });
        if (!bestPair || bestCount < 2) break;
        const [a, b] = bestPair.split(SEP), ab = a + b; let applied = 0;
        seqs.forEach((s) => { const out = []; for (let i = 0; i < s.sym.length; i++) { if (i + 1 < s.sym.length && s.sym[i] === a && s.sym[i + 1] === b) { out.push(ab); i++; applied += s.f; } else out.push(s.sym[i]); } s.sym = out; });
        merges.push({ a, b, ab, count: bestCount }); corpusTokens.push(corpusTokens[corpusTokens.length - 1] - applied);
      }
      const rank = new Map(); merges.forEach((m, i) => rank.set(m.a + SEP + m.b, i));
      const corpusChars = corpusTokens[0];
      function encodeWord(w, M) {
        const sym = [WS].concat(Array.from(w));
        for (let guard = 0; guard < 1000; guard++) {
          let bi = -1, br = Infinity;
          for (let i = 0; i + 1 < sym.length; i++) { const r = rank.get(sym[i] + SEP + sym[i + 1]); if (r != null && r < M && r < br) { br = r; bi = i; } }
          if (bi < 0) break;
          sym.splice(bi, 2, sym[bi] + sym[bi + 1]);
        }
        return sym;
      }
      let showMerges = false, seen0 = false, seen190 = false, inputCurve = [], lastText = null;
      const M = () => clamp(num(api.params.merges, 60) | 0, 0, merges.length);
      function tokenize(txt, mode, m) {
        const toks = []; let vocabSize = 0, words = [];
        if (mode === "char") { Array.from(txt).forEach((c) => toks.push({ t: c === " " ? "␣" : c, unk: c !== " " && !base.has(c) })); vocabSize = base.size; }
        else if (mode === "word") { (txt.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || []).forEach((w) => toks.push({ t: w, unk: !freq.has(w.toLowerCase()) })); vocabSize = freq.size; }
        else if (mode === "ws") { txt.split(/\s+/).filter(Boolean).forEach((w) => toks.push({ t: w, unk: !wsVocab.has(w.toLowerCase()) })); vocabSize = wsVocab.size; }
        else {
          (txt.match(/\p{L}+|[^\s\p{L}]/gu) || []).forEach((w) => { const parts = encodeWord(w, m); words.push({ w, n: parts.length }); parts.forEach((t) => toks.push({ t, unk: !Array.from(t).every((ch) => base.has(ch)) })); });
          vocabSize = base.size + m;
        }
        return { toks, vocabSize, words };
      }
      function refresh() {
        let txt = String(api.params.text == null ? "" : api.params.text); if (api.params.lower) txt = txt.toLowerCase();
        const mode = String(api.params.mode), m = M(), r = tokenize(txt, mode, m), unk = r.toks.filter((t) => t.unk).length, chars = txt.length;
        if (txt !== lastText) { inputCurve = []; for (let k = 0; k <= merges.length; k += 4) inputCurve.push([k, tokenize(txt, "bpe", k).toks.length / Math.max(1, chars)]); lastText = txt; }
        const label = { bpe: `BPE (${base.size} base symbols + ${m} merges)`, char: "characters", word: "words", ws: "whitespace" }[mode] || mode;
        api.readout({ "Tokeniser": label, "Vocabulary size": r.vocabSize, "Tokens": r.toks.length, "Characters": chars, "Chars per token": r.toks.length ? fmt(chars / r.toks.length, 2) : "—", "Unknown tokens": unk });
        if (unk > 0 && txt !== DEFAULT) api.award("unk");
        if (mode === "bpe") { if (m === 0) seen0 = true; if (m >= 190) seen190 = true; if (seen0 && seen190) api.award("sweep"); if (m >= 190 && txt !== DEFAULT && r.words.some((w) => w.n >= 4 && w.w.length >= 4 && Array.from(w.w).every((ch) => base.has(ch)))) api.award("rare_word"); }
        const chips = r.toks.map((t, i) => `<span style="display:inline-block;margin:2px;padding:3px 8px;border-radius:6px;font-family:ui-monospace,monospace;font-size:.85em;background:${t.unk ? rgba(C.danger, 0.35) : rgba(C.series[i % C.series.length], 0.28)};border:1px solid ${t.unk ? C.danger : rgba(C.series[i % C.series.length], 0.7)};color:${C.text}">${esc(t.t)}${t.unk ? " ⚠" : ""}</span>`).join("");
        let h = `<div style="color:${C.muted};font-size:.8em;margin-bottom:4px">${r.toks.length} tokens${mode === "bpe" ? " · ▁ marks the start of a word" : ""} · ⚠ = not in the vocabulary (unknown)</div><div>${chips || "<i>empty</i>"}</div>`;
        if (showMerges && mode === "bpe") h += `<div style="margin-top:8px;color:${C.muted};font-size:.8em">First ${m} merges learned from the corpus (most frequent pair first):</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;font-family:ui-monospace,monospace;font-size:.78em">${merges.slice(0, m).map((mg, i) => `<span style="padding:2px 6px;border-radius:4px;background:${rgba(C.text, 0.06)};color:${C.text}">${i + 1}. ${esc(mg.a)} + ${esc(mg.b)} → <b>${esc(mg.ab)}</b> <span style="color:${C.muted}">×${mg.count}</span></span>`).join("")}</div>`;
        api.html(h); draw(m, mode, r, chars);
      }
      function draw(m, mode, r, chars) {
        const W = cv.width, H = cv.height, ctx = cv.ctx; ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        const corpusCurve = corpusTokens.map((t, k) => [k, t / corpusChars]), pb = { x: 8, y: 8, w: Math.max(60, W * 0.62), h: H - 16 };
        const v = plot(ctx, C, pb, [{ data: corpusCurve, color: C.primary, label: "corpus" }, { data: inputCurve, color: C.accent, label: "your text" }], { title: "BPE tokens per character vs merges applied", yMin: 0, yMax: 1.05, xMin: 0, xMax: Math.max(1, merges.length) });
        if (mode === "bpe") { line(ctx, v.x(m), pb.y + 20, v.x(m), pb.y + pb.h - 18, rgba(C.secondary, 0.9), 1.5); text(ctx, `${m} merges`, v.x(m) + 4, pb.y + 32, { color: C.secondary, size: 10 }); }
        const tx = pb.x + pb.w + 14;
        text(ctx, "How BPE works", tx, 24, { color: C.text, size: 12, weight: "700" });
        ["1. start from characters (+ ▁ word marker)", "2. count adjacent symbol pairs in the corpus", "3. merge the most frequent pair everywhere", "4. repeat; each merge adds one vocab entry", "encode = apply learned merges in rank order"].forEach((s, i) => text(ctx, s, tx, 44 + i * 16, { color: C.muted, size: 10 }));
        text(ctx, `${merges.length} merges learned · base symbols ${base.size}`, tx, 136, { color: C.text, size: 10 });
        text(ctx, `corpus: ${corpusChars} chars → ${corpusTokens[Math.min(m, corpusTokens.length - 1)]} tokens at ${m} merges`, tx, 152, { color: C.text, size: 10 });
        text(ctx, `your text: ${chars} chars → ${r.toks.length} tokens (${mode})`, tx, 168, { color: C.accent, size: 10 });
      }
      api.onParam(() => refresh());
      api.onResize(() => refresh());
      api.setStatus("Coloured chips are the tokens of your text. Slide the merges to watch sub-words grow, or switch tokenisers to compare.");
      refresh();
      return {
        toggleMerges() { showMerges = !showMerges; refresh(); },
        corpusSample() { const sents = CORPUS.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean); api.setParam("text", sents[Math.floor(api.random() * sents.length)]); },
        destroy() {},
      };
    },
  });
})();
