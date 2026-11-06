/* Self-Taught — Psychology simulations (part A)
 * Registers: psych_stroop, psych_signal_detection, psych_rescorla_wagner, psych_operant_schedules,
 *            psych_serial_position, psych_forgetting_curve, psych_psychophysics, psych_visual_search,
 *            psych_mental_rotation, psych_prospect_theory
 * Built against static/sims/core.js (see docs/CONTRACTS.md §3). Vanilla JS, no dependencies.
 * Games measure real reaction times with performance.now(); all timers are cancelled in destroy().
 */
(function () {
  "use strict";
  if (!window.SelfTaughtSims) { console.error("[psychology_a sims] core.js must be loaded first"); return; }
  const S = window.SelfTaughtSims;
  const TAU = Math.PI * 2;

  // ======================= shared helpers =======================
  function makeRng(seed) { let a = (seed >>> 0) || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (Number.isFinite(+v) ? +v : (d || 0));
  const fx = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 2 : d) : "—");
  const pct = (v, d) => (Number.isFinite(v) ? (v * 100).toFixed(d == null ? 1 : d) + " %" : "—");
  const ms = (v) => (Number.isFinite(v) ? Math.round(v) + " ms" : "—");
  const sgn = (v, d) => (Number.isFinite(v) ? (v >= 0 ? "+" : "") + v.toFixed(d == null ? 0 : d) : "—");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const mean = (a) => (a && a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);
  const randInt = (n, rng) => Math.floor((rng || Math.random)() * n);
  function shuffle(a, rng) { rng = rng || Math.random; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gauss(rng) { rng = rng || Math.random; let u = 0; while (u === 0) u = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rng()); }
  function erf(x) { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
  const Phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
  const phi = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(TAU);
  /** Inverse standard-normal CDF (Acklam's rational approximation, |error| < 1.2e-9). */
  function zinv(p) {
    p = clamp(p, 1e-9, 1 - 1e-9);
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pl = 0.02425; let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p <= 1 - pl) { q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  /** Ordinary least squares y = a + b·x; returns {a, b, r, n}. Safe for degenerate input. */
  function linfit(xs, ys) {
    const n = Math.min(xs.length, ys.length); if (n < 2) return { a: NaN, b: NaN, r: NaN, n };
    let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; } mx /= n; my /= n;
    let sxx = 0, sxy = 0, syy = 0; for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxx += dx * dx; sxy += dx * dy; syy += dy * dy; }
    if (sxx <= 1e-12) return { a: my, b: NaN, r: NaN, n };
    const b = sxy / sxx; return { a: my - b * mx, b, r: syy > 1e-12 ? sxy / Math.sqrt(sxx * syy) : NaN, n };
  }
  /** Standard RT cleaning used by every RT game here: (1) drop anticipations (RT < RT_MIN = 150 ms, faster than a genuine
   *  stimulus-driven response); (2) within each condition cell (groupKey) with ≥ 6 RTs, drop an RT lying more than 2.5 SD from
   *  the mean of the OTHER RTs in its cell (leave-one-out; with the ordinary sample SD an outlier inflates the SD so much that
   *  a 2.5-SD cut can never fire for n ≤ 8, since the largest possible z is (n−1)/√n). Returns the kept trials. */
  const RT_MIN = 150, RT_SD = 2.5;
  function trimRT(trs, groupKey) {
    const ok = trs.filter((t) => t.rt != null && Number.isFinite(t.rt) && t.rt >= RT_MIN), groups = {};
    ok.forEach((t) => { const k = groupKey ? groupKey(t) : "all"; (groups[k] = groups[k] || []).push(t); });
    const keep = new Set();
    Object.keys(groups).forEach((k) => {
      const g = groups[k], n = g.length;
      if (n < 6) { g.forEach((t) => keep.add(t)); return; }
      const s1 = g.reduce((s, t) => s + t.rt, 0), s2 = g.reduce((s, t) => s + t.rt * t.rt, 0);
      g.forEach((t) => {
        const m = (s1 - t.rt) / (n - 1), v = Math.max(0, (s2 - t.rt * t.rt - (n - 1) * m * m) / (n - 2)), sd = Math.sqrt(v);
        if (!(sd > 0) || Math.abs(t.rt - m) <= RT_SD * sd) keep.add(t);
      });
    });
    return ok.filter((t) => keep.has(t));
  }
  const RT_NOTE = "RTs are timed with <code>performance.now()</code> from stimulus onset to response (± about one display frame). Only correct trials are analysed; anticipations (&lt; 150 ms), timeouts, and outliers (more than 2.5 SD from the mean of the other trials in the same condition, applied to cells with ≥ 6 trials) are excluded.";
  function timers() {
    const set = new Set();
    return {
      after(msec, fn) { const id = setTimeout(() => { set.delete(id); try { fn(); } catch (e) { console.error(e); } }, Math.max(0, msec)); set.add(id); return id; },
      every(msec, fn) { const id = setInterval(() => { try { fn(); } catch (e) { console.error(e); } }, Math.max(16, msec)); set.add(id); return id; },
      clear() { set.forEach((id) => { clearTimeout(id); clearInterval(id); }); set.clear(); },
    };
  }
  /** Global keyboard helper; ignores keystrokes aimed at form fields and unmounted widgets. fn returns true to preventDefault. */
  function keys(api, fn) {
    const h = (e) => {
      const t = e.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (api.root && api.root.isConnected === false) return;
      try { if (fn(e) === true) e.preventDefault(); } catch (err) { console.error(err); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }
  function text(ctx, s, x, y, color, o) { o = o || {}; ctx.fillStyle = color; ctx.font = (o.bold ? "700 " : "") + (o.size || 11) + "px " + (o.mono ? "ui-monospace, monospace" : "system-ui, sans-serif"); ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic"; ctx.fillText(String(s), x, y); }
  function clearCanvas(ctx, w, h, C) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }
  function roundRect(ctx, x, y, w, h, r, fill, stroke, lw) { r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
  function polyline(ctx, pts, color, lw, dash) { if (!pts || pts.length < 2) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1.5; ctx.setLineDash(dash || []); ctx.beginPath(); let started = false; pts.forEach((p) => { if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) { started = false; return; } if (!started) { ctx.moveTo(p[0], p[1]); started = true; } else ctx.lineTo(p[0], p[1]); }); ctx.stroke(); ctx.restore(); }
  function dot(ctx, x, y, r, fill, stroke) { if (!Number.isFinite(x) || !Number.isFinite(y)) return; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); } }
  function vline(ctx, x, y0, y1, color, dash, lw) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore(); }
  function hline(ctx, y, x0, x1, color, dash, lw) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }
  const tick = (v) => { const a = Math.abs(v); return a >= 100 || Number.isInteger(v) ? String(Math.round(v)) : a >= 10 ? v.toFixed(0) : a >= 1 ? v.toFixed(1) : v.toFixed(2); };
  /** Plot frame with grid, ticks, labels; returns data↔pixel transforms. */
  function axes(ctx, C, box, xr, yr, o) {
    o = o || {};
    const dx = (xr[1] - xr[0]) || 1, dy = (yr[1] - yr[0]) || 1;
    const sx = (x) => box.x + ((x - xr[0]) / dx) * box.w, sy = (y) => box.y + box.h - ((y - yr[0]) / dy) * box.h;
    const nx = o.nx || 4, ny = o.ny || 4, fs = o.fs || 10, xf = o.xfmt || tick, yf = o.yfmt || tick;
    ctx.save(); ctx.lineWidth = 1;
    for (let i = 0; i <= ny; i++) { const v = yr[0] + (dy * i) / ny, y = sy(v); hline(ctx, y, box.x, box.x + box.w, C.grid); text(ctx, yf(v), box.x - 4, y + 3, C.muted, { align: "right", size: fs }); }
    for (let i = 0; i <= nx; i++) { const v = xr[0] + (dx * i) / nx, x = sx(v); vline(ctx, x, box.y, box.y + box.h, C.grid); text(ctx, xf(v), x, box.y + box.h + fs + 3, C.muted, { align: "center", size: fs }); }
    ctx.strokeStyle = C.axis; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
    if (o.title) text(ctx, o.title, box.x, box.y - 7, C.text, { bold: true, size: fs + 1 });
    if (o.xlabel) text(ctx, o.xlabel, box.x + box.w / 2, box.y + box.h + 2 * fs + 8, C.muted, { align: "center", size: fs });
    if (o.ylabel) { ctx.save(); ctx.translate(box.x - (o.ylabelOffset || 34), box.y + box.h / 2); ctx.rotate(-Math.PI / 2); text(ctx, o.ylabel, 0, 0, C.muted, { align: "center", size: fs }); ctx.restore(); }
    ctx.restore();
    return { sx, sy, ix: (px) => xr[0] + ((px - box.x) / box.w) * dx, iy: (py) => yr[0] + ((box.y + box.h - py) / box.h) * dy };
  }
  /** Canvas buttons (hit-tested through api.pointer). */
  function Buttons() {
    let list = [];
    return {
      reset() { list = []; },
      add(b) { list.push(b); return b; },
      draw(ctx, C) {
        list.forEach((b) => {
          const dim = !!b.disabled;
          roundRect(ctx, b.x, b.y, b.w, b.h, 8, dim ? "rgba(255,255,255,0.04)" : (b.fill || "rgba(124,156,255,0.18)"), dim ? "rgba(255,255,255,0.1)" : (b.stroke || C.axis), 1);
          const fs = b.size || clamp(Math.min(b.h * 0.36, b.w / Math.max(4, String(b.label).length) * 1.5), 9, 15);
          let tx = b.x + b.w / 2, fsz = fs;
          if (b.swatch) {
            const s = Math.min(b.h * 0.4, 14); ctx.globalAlpha = dim ? 0.35 : 1; roundRect(ctx, b.x + 7, b.y + b.h / 2 - s / 2, s, s, 3, b.swatch); ctx.globalAlpha = 1;
            const avail = b.w - s - 14; tx = b.x + s + 10 + avail / 2;
            ctx.font = "700 " + fsz + "px system-ui, sans-serif"; const tw = ctx.measureText(String(b.label)).width; if (tw > avail - 4 && tw > 0) fsz = Math.max(8, fsz * (avail - 4) / tw);
          }
          text(ctx, b.label, tx, b.y + b.h / 2 + 1, dim ? C.muted : (b.color || C.text), { align: "center", base: "middle", size: fsz, bold: true });
        });
      },
      hit(x, y) { for (let i = list.length - 1; i >= 0; i--) { const b = list[i]; if (!b.disabled && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b; } return null; },
    };
  }
  function legend(ctx, C, x, y, items, fs) {
    fs = fs || 10; let yy = y;
    items.forEach((it) => { ctx.save(); ctx.strokeStyle = it.color; ctx.lineWidth = 2; ctx.setLineDash(it.dash || []); ctx.beginPath(); ctx.moveTo(x, yy - 3); ctx.lineTo(x + 16, yy - 3); ctx.stroke(); ctx.restore(); text(ctx, it.label, x + 21, yy, C.muted, { size: fs }); yy += fs + 5; });
  }
  const tbl = (head, rows) => `<table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;

  // ======================= 1. Stroop task =======================
  const STROOP_COLORS = [
    { name: "RED", ink: "#ff4d4d" },
    { name: "GREEN", ink: "#3ddc6f" },
    { name: "BLUE", ink: "#4d8dff" },
    { name: "YELLOW", ink: "#ffd93d" },
  ];
  const NEUTRAL_WORDS = ["TABLE", "HORSE", "CHAIR", "PLANT", "BREAD", "CLOUD", "SHOE", "LAMP"];
  const NEUTRAL_INK = "#cfd3e6";
  S.register({
    id: "psych_stroop",
    name: "Stroop Task Lab",
    domains: ["psychology", "neuroscience"],
    description: "Play the classic Stroop task (Stroop, 1935): click the INK colour of each word as fast as you can. Your reaction times are measured per trial and split into congruent, neutral and incongruent trials to reveal the interference effect — automatic reading you cannot switch off.",
    params: [
      { key: "trials", label: "Trials per block", type: "range", min: 8, max: 72, step: 4, value: 24 },
      { key: "pCong", label: "Proportion congruent", type: "range", min: 0, max: 1, step: 0.05, value: 0.35 },
      { key: "neutral", label: "Include neutral trials", type: "toggle", value: true },
      { key: "mode", label: "Task", type: "select", value: "ink", options: [{ value: "ink", label: "Name the INK colour (Stroop)" }, { value: "word", label: "Read the WORD (reverse Stroop)" }] },
    ],
    actions: [
      { label: "▶ Start block", fn: (h) => h.start() },
      { label: "■ Stop", fn: (h) => h.stop() },
      { label: "Clear data", fn: (h) => h.clearData() },
    ],
    challenges: [
      { id: "stroop_effect", xp: 15, text: "Complete a colour-naming block with ≥ 80 % accuracy that shows a positive interference effect (incongruent slower than congruent)." },
      { id: "stroop_reverse", xp: 15, text: "Also run a word-reading block. Is interference much smaller when you just read the word? Why would that be?" },
      { id: "stroop_pc", xp: 20, text: "Proportion-congruent effect: run colour-naming blocks at ≥ 75 % and ≤ 25 % congruent and compare interference." },
      { id: "stroop_fast", xp: 15, text: "Get a mean incongruent RT under 750 ms while staying ≥ 90 % accurate in a colour-naming block." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx;
      const T = timers(), B = Buttons();
      let phase = "idle", seq = [], idx = -1, cur = null, t0 = 0, fb = null, block = [], blockMode = "ink";
      const blocks = [];
      const answerOf = (tr) => (blockMode === "ink" ? tr.inkI : tr.wordI);
      function buildSeq() {
        const n = clamp(Math.round(num(P.trials, 24)), 4, 200), pc = clamp(num(P.pCong, 0.35), 0, 1);
        const nC = Math.round(n * pc), rest = n - nC, nN = P.neutral ? Math.round(rest / 2) : 0, nI = rest - nN;
        const types = [];
        for (let i = 0; i < nC; i++) types.push("congruent");
        for (let i = 0; i < nN; i++) types.push("neutral");
        for (let i = 0; i < nI; i++) types.push("incongruent");
        shuffle(types);
        return types.map((type) => {
          const a = randInt(4);
          if (type === "congruent") return { type, inkI: a, wordI: a, word: STROOP_COLORS[a].name };
          if (type === "incongruent") { const w = (a + 1 + randInt(3)) % 4; return { type, inkI: a, wordI: w, word: STROOP_COLORS[w].name }; }
          // neutral: colour-naming → non-colour word in colour ink; word-reading → colour word in neutral grey ink
          if (blockMode === "ink") return { type, inkI: a, wordI: -1, word: NEUTRAL_WORDS[randInt(NEUTRAL_WORDS.length)] };
          return { type, inkI: -1, wordI: a, word: STROOP_COLORS[a].name };
        });
      }
      function start() {
        T.clear(); blockMode = P.mode === "word" ? "word" : "ink"; seq = buildSeq(); idx = -1; block = []; fb = null;
        api.setStatus(blockMode === "ink" ? "Click the button matching the INK colour (keys 1–4 or R G B Y)." : "Click the button matching the WORD you read (keys 1–4 or R G B Y).");
        next();
      }
      function stop() { T.clear(); if (phase !== "idle" && phase !== "done") { phase = block.length ? "done" : "idle"; api.setStatus("Block stopped."); } draw(); readout(); }
      function next() {
        idx++;
        if (idx >= seq.length) { finish(); return; }
        cur = seq[idx]; phase = "fix"; draw();
        T.after(400 + Math.random() * 300, () => {
          phase = "stim"; draw(); t0 = performance.now();
          T.after(3000, () => { if (phase === "stim") respond(-1); });
        });
      }
      function respond(i) {
        if (phase !== "stim" || !cur) return;
        T.clear();
        const rt = performance.now() - t0, ok = i >= 0 && i === answerOf(cur);
        block.push({ type: cur.type, rt: i < 0 ? null : rt, correct: ok });
        fb = { ok, rt, timeout: i < 0 }; phase = "fb"; draw(); readout();
        T.after(ok ? 250 : 700, next);
      }
      function stats(trs) {
        const out = {}, kept = trimRT(trs.filter((t) => t.correct), (t) => t.type);
        ["congruent", "neutral", "incongruent"].forEach((k) => {
          const all = trs.filter((t) => t.type === k), ok = kept.filter((t) => t.type === k);
          out[k] = { n: all.length, mean: ok.length ? mean(ok.map((t) => t.rt)) : NaN, err: all.length ? 1 - all.filter((t) => t.correct).length / all.length : NaN };
        });
        out.acc = trs.length ? trs.filter((t) => t.correct).length / trs.length : NaN;
        out.interf = out.incongruent.mean - out.congruent.mean;
        out.facil = out.neutral.mean - out.congruent.mean;
        out.inhib = out.incongruent.mean - out.neutral.mean;
        return out;
      }
      function finish() {
        phase = "done"; const s = stats(block);
        blocks.push({ mode: blockMode, pc: num(P.pCong), n: block.length, s });
        if (blockMode === "ink" && s.acc >= 0.8 && s.interf > 0) api.award("stroop_effect");
        const good = blocks.filter((b) => b.s.acc >= 0.7);
        if (good.some((b) => b.mode === "ink") && good.some((b) => b.mode === "word")) api.award("stroop_reverse");
        const ink = good.filter((b) => b.mode === "ink");
        if (ink.some((b) => b.pc >= 0.75 - 1e-9) && ink.some((b) => b.pc <= 0.25 + 1e-9)) api.award("stroop_pc");
        if (blockMode === "ink" && s.acc >= 0.9 && s.incongruent.mean < 750) api.award("stroop_fast");
        api.setStatus(`Block done: interference ${sgn(s.interf)} ms, accuracy ${pct(s.acc, 0)}. Press ▶ Start block for another.`);
        draw(); readout(); renderHtml();
      }
      function drawChart(box) {
        const has = block.length > 0, s = has ? stats(block) : null;
        const typical = [650, 680, 750]; // illustrative only (≈ 100 ms key-press interference), not a specific dataset
        const vals = has ? [s.congruent.mean, s.neutral.mean, s.incongruent.mean] : typical;
        const maxV = Math.max(1000, ...vals.filter(Number.isFinite).map((v) => v * 1.15));
        const A = axes(ctx, C, box, [0, 3], [0, maxV], { nx: 1, ny: 4, xfmt: () => "", title: has ? "Your mean correct RT" : "Typical adult RTs (illustrative)", ylabel: "RT (ms)", ylabelOffset: 32 });
        const labels = ["Congruent", "Neutral", "Incongr."], cols = [C.ok, C.muted, C.danger], keysT = ["congruent", "neutral", "incongruent"];
        for (let i = 0; i < 3; i++) {
          const v = vals[i], x0 = A.sx(i + 0.18), x1 = A.sx(i + 0.82);
          if (Number.isFinite(v)) {
            const y = A.sy(v);
            if (has) { ctx.fillStyle = cols[i]; ctx.globalAlpha = 0.75; ctx.fillRect(x0, y, x1 - x0, A.sy(0) - y); ctx.globalAlpha = 1; }
            else { ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = cols[i]; ctx.strokeRect(x0, y, x1 - x0, A.sy(0) - y); ctx.restore(); }
            text(ctx, Math.round(v), (x0 + x1) / 2, y - 4, C.text, { align: "center", size: 10, bold: true });
          }
          text(ctx, labels[i], (x0 + x1) / 2, box.y + box.h + 13, cols[i], { align: "center", size: 10 });
          if (has) text(ctx, `err ${pct(s[keysT[i]].err, 0)} · n=${s[keysT[i]].n}`, (x0 + x1) / 2, box.y + box.h + 25, C.muted, { align: "center", size: 9 });
        }
        const interf = has ? s.interf : typical[2] - typical[0];
        text(ctx, `Interference (I − C): ${sgn(interf)} ms`, box.x + 4, box.y + 14, C.accent, { size: 11, bold: true });
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); B.reset();
        const Lw = Math.round(w * 0.6), cx = Lw / 2, cy = h * 0.42, fs = clamp(Lw / 7, 26, 72);
        vline(ctx, Lw, 10, h - 10, C.grid);
        const modeNow = phase === "idle" ? (P.mode === "word" ? "word" : "ink") : blockMode;
        text(ctx, modeNow === "ink" ? "Respond to the INK colour" : "Respond to the WORD", 16, 22, C.muted, { size: 12, bold: true });
        if (seq.length && phase !== "idle") {
          const frac = clamp((idx + (phase === "fb" || phase === "done" ? 1 : 0)) / seq.length, 0, 1);
          roundRect(ctx, 16, 30, Lw - 32, 5, 2, "rgba(255,255,255,0.08)"); roundRect(ctx, 16, 30, (Lw - 32) * frac, 5, 2, C.primary);
          text(ctx, `${Math.min(seq.length, idx + 1)} / ${seq.length}`, Lw - 16, 22, C.muted, { size: 11, align: "right" });
        }
        if (phase === "idle" || phase === "done") {
          text(ctx, "BLUE", cx, cy, STROOP_COLORS[0].ink, { size: fs, bold: true, align: "center", base: "middle" });
          text(ctx, phase === "done" ? "Block complete — click here or ▶ Start block to go again" : "Click here or ▶ Start block. (Answer for the sample: RED)", cx, cy + fs * 0.85, C.muted, { size: 12, align: "center" });
        } else if (phase === "fix") text(ctx, "+", cx, cy, C.text, { size: fs * 0.7, align: "center", base: "middle" });
        else if (phase === "stim" && cur) text(ctx, cur.word, cx, cy, cur.inkI >= 0 ? STROOP_COLORS[cur.inkI].ink : NEUTRAL_INK, { size: fs, bold: true, align: "center", base: "middle" });
        else if (phase === "fb" && fb) text(ctx, fb.timeout ? "too slow!" : fb.ok ? `✓ ${Math.round(fb.rt)} ms` : "✗ wrong", cx, cy, fb.ok ? C.ok : C.danger, { size: fs * 0.5, bold: true, align: "center", base: "middle" });
        const bh = clamp(h * 0.12, 30, 48), by = h - bh - 14, bw = (Lw - 32 - 24) / 4;
        STROOP_COLORS.forEach((c, i) => B.add({ id: i, x: 16 + i * (bw + 8), y: by, w: bw, h: bh, label: `${i + 1} ${c.name}`, swatch: c.ink, disabled: phase !== "stim" }));
        B.draw(ctx, C);
        drawChart({ x: Lw + 46, y: 30, w: Math.max(60, w - Lw - 62), h: Math.max(60, h - 80) });
      }
      function readout() {
        const s = stats(block);
        api.readout({
          "Task": (phase === "idle" ? P.mode : blockMode) === "word" ? "word reading" : "colour naming",
          "Trial": seq.length ? `${Math.min(seq.length, idx + 1)} / ${seq.length}` : "—",
          "Mean RT congruent": ms(s.congruent.mean), "Mean RT neutral": ms(s.neutral.mean), "Mean RT incongruent": ms(s.incongruent.mean),
          "Interference (I − C)": Number.isFinite(s.interf) ? sgn(s.interf) + " ms" : "—",
          "Facilitation (N − C)": Number.isFinite(s.facil) ? sgn(s.facil) + " ms" : "—",
          "Accuracy": pct(s.acc, 0),
        });
      }
      function renderHtml() {
        const rows = blocks.map((b, i) => [i + 1, b.mode === "ink" ? "colour naming" : "word reading", pct(b.pc, 0), b.n, ms(b.s.congruent.mean), ms(b.s.neutral.mean), ms(b.s.incongruent.mean), `<b style="color:${C.accent}">${Number.isFinite(b.s.interf) ? sgn(b.s.interf) + " ms" : "—"}</b>`, pct(1 - b.s.acc, 0)]);
        api.html((rows.length ? tbl(["#", "Task", "% congruent", "n", "Cong.", "Neutral", "Incong.", "Interference", "Errors"], rows) : "") +
          `<div style="color:${C.muted};font-size:.82rem;margin-top:6px">${RT_NOTE} The dashed "typical" bars shown before you play are illustrative values, not data from a specific study. Classic findings (review: MacLeod, 1991): incongruent colour naming is slowed by very roughly 50–150 ms with key-press responses (vocal naming usually shows more); word reading suffers far less from the ink colour, because reading is the more automatic process. Making congruent trials common raises interference — the proportion-congruent effect (Logan &amp; Zbrodoff, 1979, in a spatial Stroop-like task; Lowe &amp; Mitterer, 1982, with colour words) — as attention relaxes onto the word.</div>`);
      }
      api.pointer(cv.canvas, {
        down(p) {
          if (phase === "stim") { const b = B.hit(p.x, p.y); if (b) respond(b.id); }
          else if ((phase === "idle" || phase === "done") && p.x < cv.width * 0.6) start();
        },
      });
      const unkey = keys(api, (e) => {
        if (phase !== "stim") return false;
        const k = String(e.key || "").toLowerCase(), map = { "1": 0, "2": 1, "3": 2, "4": 3, r: 0, g: 1, b: 2, y: 3 };
        if (k in map) { respond(map[k]); return true; }
        return false;
      });
      api.onParam(() => { if (phase === "idle" || phase === "done") draw(); readout(); });
      api.onResize(draw);
      draw(); readout(); renderHtml();
      api.setStatus("Click the canvas or ▶ Start block. Respond to the INK colour, ignoring what the word says.");
      return {
        start, stop,
        clearData() { T.clear(); blocks.length = 0; block = []; seq = []; idx = -1; phase = "idle"; draw(); readout(); renderHtml(); },
        destroy() { T.clear(); unkey(); },
      };
    },
  });

  // ======================= 2. Signal detection theory =======================
  S.register({
    id: "psych_signal_detection",
    name: "Signal Detection Theory Lab",
    domains: ["psychology", "neuroscience", "statistics"],
    description: "Equal-variance Gaussian signal detection: drag the criterion across the noise and signal+noise distributions to trade hits against false alarms, watch the operating point slide along the ROC curve, and compute d′, c and β. Then switch to Play mode and judge noisy flashes yourself — your own d′ and bias are measured.",
    params: [
      { key: "dprime", label: "Sensitivity d′", type: "range", min: 0, max: 4, step: 0.05, value: 1.5 },
      { key: "crit", label: "Criterion k (noise-SD units)", type: "range", min: -2, max: 5, step: 0.05, value: 1.2 },
      { key: "pSignal", label: "P(signal) — base rate", type: "range", min: 0.1, max: 0.9, step: 0.05, value: 0.5 },
      { key: "mode", label: "Mode", type: "select", value: "explore", options: [{ value: "explore", label: "Explore the model" }, { value: "play", label: "Play: detect the flash" }] },
      { key: "strength", label: "Play: signal contrast (%)", type: "range", min: 0, max: 40, step: 1, value: 10 },
    ],
    actions: [
      { label: "▶ Play 40 trials", fn: (h) => h.startPlay() },
      { label: "Snap to β-optimal", fn: (h) => h.snapOptimal() },
      { label: "Reset play data", fn: (h) => h.resetPlay() },
    ],
    challenges: [
      { id: "sdt_unbiased", xp: 10, text: "Drag the criterion to make the observer unbiased (c ≈ 0, β ≈ 1). Where does that sit relative to the two distributions?" },
      { id: "sdt_optimal", xp: 15, text: "Set P(signal) ≤ 0.2 and place the criterion within 0.1 of the β-optimal point. Why does a rare signal make the ideal observer conservative?" },
      { id: "sdt_chance", xp: 10, text: "Set d′ = 0. What happens to the ROC curve, and why can no criterion help?" },
      { id: "sdt_play", xp: 20, text: "Play a 40-trial session and reach d′ ≥ 1.0 with your own eyes." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx;
      const T = timers(), B = Buttons(), rng = Math.random, G = 18;
      let drag = false, distBox = null, distA = null;
      const play = { active: false, phase: "idle", n: 0, target: 40, hits: 0, miss: 0, fa: 0, cr: 0, signal: false, cells: null, fb: null };
      function model() {
        const d = clamp(num(P.dprime, 1.5), 0, 6), k = num(P.crit, 1), p = clamp(num(P.pSignal, 0.5), 0.01, 0.99);
        const H = 1 - Phi(k - d), F = 1 - Phi(k), c = k - d / 2, lnb = d * c;
        const kopt = d > 0.02 ? d / 2 + Math.log((1 - p) / p) / d : NaN;
        return { d, k, p, H, F, c, lnb, beta: Math.exp(lnb), kopt, acc: p * H + (1 - p) * (1 - F) };
      }
      function playStats() {
        const nS = play.hits + play.miss, nN = play.fa + play.cr;
        const H = (play.hits + 0.5) / (nS + 1), F = (play.fa + 0.5) / (nN + 1); // log-linear correction (Hautus, 1995)
        const zH = zinv(H), zF = zinv(F);
        return { nS, nN, H, F, rawH: nS ? play.hits / nS : NaN, rawF: nN ? play.fa / nN : NaN, d: zH - zF, c: -(zH + zF) / 2, n: nS + nN };
      }
      function makeCells(signal) {
        const s = clamp(num(P.strength, 10), 0, 100) / 100, sig = 2.6, mid = (G - 1) / 2, cells = new Float32Array(G * G);
        for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
          const r2 = (i - mid) * (i - mid) + (j - mid) * (j - mid);
          cells[i * G + j] = 0.45 + 0.13 * gauss(rng) + (signal ? s * Math.exp(-r2 / (2 * sig * sig)) : 0);
        }
        return cells;
      }
      function startPlay() {
        T.clear();
        if (P.mode !== "play") api.setParam("mode", "play");
        Object.assign(play, { active: true, n: 0, hits: 0, miss: 0, fa: 0, cr: 0, fb: null });
        api.setStatus("Watch the centre of the noise patch. Was there a faint bright blob? Answer Yes / No (keys Y / N).");
        nextTrial();
      }
      function nextTrial() {
        if (play.n >= play.target) { finishPlay(); return; }
        play.phase = "fix"; play.cells = null; draw();
        T.after(500, () => {
          play.signal = rng() < clamp(num(P.pSignal, 0.5), 0.01, 0.99);
          play.cells = makeCells(play.signal); play.phase = "stim"; draw();
          T.after(250, () => { play.cells = makeCells(false); play.phase = "mask"; draw(); T.after(150, () => { play.cells = null; play.phase = "resp"; draw(); }); });
        });
      }
      function answer(yes) {
        if (!play.active || (play.phase !== "resp" && play.phase !== "mask")) return;
        T.clear();
        if (play.signal) { if (yes) play.hits++; else play.miss++; } else { if (yes) play.fa++; else play.cr++; }
        play.n++; play.fb = { ok: yes === play.signal, signal: play.signal }; play.phase = "fb"; draw(); readout();
        T.after(450, nextTrial);
      }
      function finishPlay() {
        play.active = false; play.phase = "done"; const s = playStats();
        if (s.n >= 40 && s.d >= 1) api.award("sdt_play");
        api.setStatus(`Session done: your d′ = ${fx(s.d)}, c = ${fx(s.c)} (${s.c > 0.1 ? "conservative" : s.c < -0.1 ? "liberal" : "≈ unbiased"}). Change the contrast or base rate and play again.`);
        draw(); readout();
      }
      function checks(user) {
        const m = model();
        if (user && Math.abs(m.c) < 0.03 && m.d > 0.2) api.award("sdt_unbiased");
        if (m.p <= 0.2 + 1e-9 && Number.isFinite(m.kopt) && Math.abs(m.k - m.kopt) <= 0.1 && m.d > 0.2) api.award("sdt_optimal");
        if (m.d <= 1e-6) api.award("sdt_chance");
      }
      function drawDistributions(box, m) {
        const xmax = clamp(m.d + 3.5, 4, 9.5), xr = [-3.5, xmax];
        const A = axes(ctx, C, box, xr, [0, 0.45], { nx: 5, ny: 3, title: "Internal response distributions", xlabel: "internal evidence (noise-SD units)" });
        distA = A;
        const N = 160, kx = A.sx(clamp(m.k, xr[0], xr[1]));
        const shade = (mu, color) => {
          ctx.beginPath(); ctx.moveTo(kx, A.sy(0));
          for (let i = 0; i <= N; i++) { const x = m.k + (i / N) * (xr[1] - m.k); if (x < xr[0]) continue; ctx.lineTo(A.sx(x), A.sy(phi(x - mu))); }
          ctx.lineTo(A.sx(xr[1]), A.sy(0)); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
        };
        if (m.k < xr[1]) { shade(0, "rgba(255,143,171,0.35)"); shade(m.d, "rgba(124,156,255,0.35)"); }
        const curve = (mu) => { const pts = []; for (let i = 0; i <= N; i++) { const x = xr[0] + (i / N) * (xr[1] - xr[0]); pts.push([A.sx(x), A.sy(phi(x - mu))]); } return pts; };
        polyline(ctx, curve(0), C.secondary, 2); polyline(ctx, curve(m.d), C.primary, 2);
        text(ctx, "noise", A.sx(-1.3) - 4, A.sy(phi(1.3)), C.secondary, { align: "right", size: 11, bold: true });
        text(ctx, "signal + noise", A.sx(m.d + 1.3) + 4, A.sy(phi(1.3)), C.primary, { align: "left", size: 11, bold: true });
        if (Number.isFinite(m.kopt) && m.kopt > xr[0] && m.kopt < xr[1]) { vline(ctx, A.sx(m.kopt), box.y, box.y + box.h, C.ok, [3, 4], 1.5); text(ctx, "β-optimal", A.sx(m.kopt) + 3, box.y + 26, C.ok, { size: 10 }); }
        vline(ctx, kx, box.y, box.y + box.h, C.accent, [], 2.5);
        roundRect(ctx, kx - 7, box.y + box.h - 22, 14, 18, 4, C.accent);
        text(ctx, "say “yes” →", kx + 6, box.y + 12, C.accent, { size: 10, bold: true });
        text(ctx, "drag", kx, box.y + box.h - 28, C.accent, { size: 9, align: "center" });
      }
      function drawPatch(box) {
        const size = Math.min(box.w * 0.7, box.h - 90), x0 = box.x + (box.w - size) / 2, y0 = box.y + 22, cs = size / G;
        text(ctx, play.active ? `Trial ${Math.min(play.target, play.n + 1)} / ${play.target}` : "Detection game", box.x + box.w / 2, box.y + 10, C.text, { align: "center", size: 12, bold: true });
        roundRect(ctx, x0 - 4, y0 - 4, size + 8, size + 8, 6, null, C.axis);
        if (play.cells) {
          for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) { const g = Math.round(clamp(play.cells[i * G + j], 0, 1) * 255); ctx.fillStyle = `rgb(${g},${g},${g})`; ctx.fillRect(x0 + j * cs, y0 + i * cs, Math.ceil(cs), Math.ceil(cs)); }
        } else {
          ctx.fillStyle = "rgb(115,115,115)"; ctx.fillRect(x0, y0, size, size);
          const msg = play.phase === "fix" ? "+" : play.phase === "resp" ? "Signal present?" : play.phase === "fb" && play.fb ? (play.fb.ok ? "✓ correct" : "✗ wrong") + (play.fb.signal ? " (signal)" : " (noise)") : play.phase === "done" ? "Session complete" : "Press ▶ Play 40 trials";
          text(ctx, msg, x0 + size / 2, y0 + size / 2, play.phase === "fb" && play.fb ? (play.fb.ok ? "#0b3d2a" : "#5c0b16") : "#1b1f33", { align: "center", base: "middle", size: play.phase === "fix" ? 30 : 13, bold: true });
        }
        const bw = Math.min(120, box.w * 0.35), bh = 34, by = y0 + size + 14, can = play.active && (play.phase === "resp" || play.phase === "mask");
        B.add({ id: "yes", x: box.x + box.w / 2 - bw - 6, y: by, w: bw, h: bh, label: "Y · Yes", disabled: !can, fill: "rgba(110,231,183,0.2)" });
        B.add({ id: "no", x: box.x + box.w / 2 + 6, y: by, w: bw, h: bh, label: "N · No", disabled: !can, fill: "rgba(255,107,107,0.18)" });
        B.draw(ctx, C);
      }
      function drawROC(box, m) {
        const A = axes(ctx, C, box, [0, 1], [0, 1], { nx: 4, ny: 4, title: "ROC curve", xlabel: "false-alarm rate F", ylabel: "hit rate H", ylabelOffset: 30 });
        polyline(ctx, [[A.sx(0), A.sy(0)], [A.sx(1), A.sy(1)]], C.axis, 1, [4, 4]);
        const roc = (d) => { const pts = []; for (let k = -6; k <= 10; k += 0.08) pts.push([A.sx(1 - Phi(k)), A.sy(1 - Phi(k - d))]); return pts; };
        [0.5, 1, 2, 3].forEach((d) => polyline(ctx, roc(d), "rgba(255,255,255,0.12)", 1));
        if (P.mode !== "play") {
          polyline(ctx, roc(m.d), C.primary, 2);
          dot(ctx, A.sx(m.F), A.sy(m.H), 6, C.accent, C.bg);
          text(ctx, `d′ = ${fx(m.d)}`, A.sx(0.55), A.sy(0.12), C.primary, { size: 11, bold: true });
        } else {
          const s = playStats();
          if (s.n > 0) {
            polyline(ctx, roc(Math.max(0, s.d)), C.ok, 1.5, [5, 3]);
            dot(ctx, A.sx(s.F), A.sy(s.H), 7, C.ok, C.bg);
            text(ctx, `you: d′ = ${fx(s.d)}, c = ${fx(s.c)}`, A.sx(0.3), A.sy(0.08), C.ok, { size: 11, bold: true });
          } else text(ctx, "your point appears here", A.sx(0.5), A.sy(0.1), C.muted, { size: 10, align: "center" });
        }
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); B.reset();
        const m = model(), Lw = Math.round(w * 0.58);
        distBox = { x: 40, y: 28, w: Lw - 56, h: h - 74 };
        if (P.mode === "play") { distA = null; drawPatch({ x: 10, y: 10, w: Lw - 20, h: h - 20 }); }
        else drawDistributions(distBox, m);
        const side = Math.max(80, Math.min(w - Lw - 60, h - 76));
        drawROC({ x: Lw + 40, y: 28, w: side, h: side }, m);
      }
      function readout() {
        if (P.mode === "play") {
          const s = playStats();
          api.readout({ "Trials": `${s.n} / ${play.target}`, "Hits / misses": `${play.hits} / ${play.miss}`, "False alarms / CRs": `${play.fa} / ${play.cr}`, "Your hit rate": pct(s.rawH), "Your FA rate": pct(s.rawF), "Your d′": s.n ? fx(s.d) : "—", "Your criterion c": s.n ? fx(s.c) : "—", "Your β": s.n ? fx(Math.exp(s.d * s.c)) : "—" });
          return;
        }
        const m = model();
        api.readout({ "Hit rate H": pct(m.H), "False-alarm rate F": pct(m.F), "Miss rate": pct(1 - m.H), "Correct-rejection rate": pct(1 - m.F), "d′ = z(H) − z(F)": fx(m.d), "c = −(zH + zF)/2": fx(m.c), "β = f(k|S)/f(k|N)": fx(m.beta), "β-optimal k*": fx(m.kopt), "Expected accuracy": pct(m.acc) });
      }
      function setCritFromX(px) {
        if (!distA) return;
        const v = clamp(Math.round(distA.ix(px) / 0.05) * 0.05, -2, 5);
        api.setParam("crit", Number(v.toFixed(2)));
      }
      api.pointer(cv.canvas, {
        down(p) {
          if (P.mode === "play") { const b = B.hit(p.x, p.y); if (b) answer(b.id === "yes"); return; }
          if (distBox && p.x >= distBox.x - 10 && p.x <= distBox.x + distBox.w + 10 && p.y >= distBox.y && p.y <= distBox.y + distBox.h + 10) { drag = true; setCritFromX(p.x); }
        },
        move(p) { if (drag) setCritFromX(p.x); },
        up() { drag = false; },
      });
      const unkey = keys(api, (e) => {
        if (!play.active) return false; const k = String(e.key || "").toLowerCase();
        if (k === "y") { answer(true); return true; } if (k === "n") { answer(false); return true; } return false;
      });
      api.onParam((key) => {
        if (key === "mode" && P.mode !== "play" && play.active) { T.clear(); play.active = false; play.phase = "idle"; }
        checks(key === "crit" || key === "dprime" || key === "pSignal"); draw(); readout();
      });
      api.onResize(draw);
      draw(); readout(); checks(false);
      api.setStatus("Drag the yellow criterion. Everything right of it is a “yes” response: blue area = hits, pink area = false alarms.");
      api.html(`<div style="color:${C.muted};font-size:.84rem">Equal-variance Gaussian model: noise ~ N(0,1), signal+noise ~ N(d′,1). H = 1 − Φ(k − d′), F = 1 − Φ(k), d′ = z(H) − z(F), c = k − d′/2, ln β = d′·c. The ideal (accuracy-maximising) criterion — assuming all correct responses are worth the same and all errors cost the same — satisfies β* = P(noise)/P(signal), i.e. k* = d′/2 + ln[P(noise)/P(signal)]/d′; rare signals push it right. In Play mode rates use the log-linear correction H = (hits + 0.5)/(n<sub>signal</sub> + 1), F = (FAs + 0.5)/(n<sub>noise</sub> + 1) (Hautus, 1995) so d′ stays finite with perfect or zero scores; the raw rates are shown in the readout.</div>`);
      return {
        startPlay,
        snapOptimal() { const m = model(); if (Number.isFinite(m.kopt)) { if (P.mode === "play") api.setParam("mode", "explore"); api.setParam("crit", Number(clamp(Math.round(m.kopt / 0.05) * 0.05, -2, 5).toFixed(2))); if (m.kopt < -2 || m.kopt > 5) api.setStatus(`The β-optimal criterion k* = ${fx(m.kopt)} lies outside the slider range (−2…5); the criterion was set to the nearest end. Raise d′ or move P(signal) towards 0.5.`); } else api.setStatus("With d′ = 0 there is no informative criterion — every rule lies on the chance diagonal."); },
        resetPlay() { T.clear(); Object.assign(play, { active: false, phase: "idle", n: 0, hits: 0, miss: 0, fa: 0, cr: 0, fb: null, cells: null }); draw(); readout(); },
        destroy() { T.clear(); unkey(); },
      };
    },
  });

  // ======================= 3. Rescorla–Wagner =======================
  const rep = (t, n) => Array.from({ length: Math.max(0, n) }, () => Object.assign({}, t));
  const inter = (a, b, n) => { const out = []; for (let i = 0; i < n; i++) { out.push(Object.assign({}, a)); out.push(Object.assign({}, b)); } return out; };
  const Ap = { c: "A", r: 1 }, Am = { c: "A", r: 0 }, Bp = { c: "B", r: 1 }, ABp = { c: "AB", r: 1 }, ABm = { c: "AB", r: 0 }, Xp = { c: "X", r: 1 }, NONE = { c: "", r: 0 };
  const RW_DESIGNS = {
    acq_ext: { name: "Acquisition → extinction", phases: (n) => [{ label: "A+", list: rep(Ap, n) }, { label: "A−", list: rep(Am, n) }],
      note: "Acquisition is negatively accelerated: each trial closes a fixed fraction αβ of the remaining gap to λ. In extinction λ = 0 and V_A decays back. (Pure RW treats extinction as unlearning — it cannot explain spontaneous recovery or renewal.)" },
    blocking: { name: "Blocking (Kamin, 1969)", phases: (n) => [{ label: "A+", list: rep(Ap, n) }, { label: "AB+", list: rep(ABp, n) }], ctrl: (n) => [{ label: "X+", list: rep(Xp, n) }, { label: "AB+", list: rep(ABp, n) }], ctrlCue: "B", ctrlLabel: "V_B in control group (no A pre-training)",
      note: "A already predicts the US, so on AB+ trials ΣV ≈ λ and the prediction error is ≈ 0 — B learns almost nothing. Surprise, not mere pairing, drives learning." },
    overshadow: { name: "Overshadowing (Pavlov, 1927)", phases: (n) => [{ label: "AB+", list: rep(ABp, 2 * n) }], ctrl: (n) => [{ label: "B+", list: rep(Bp, 2 * n) }], ctrlCue: "B", ctrlLabel: "V_B when B is trained alone",
      note: "A and B share one prediction error, so they split λ in proportion to their saliences α. A salient cue overshadows a weak one." },
    inhibition: { name: "Conditioned inhibition", phases: (n) => [{ label: "A+", list: rep(Ap, n) }, { label: "A+ / AB−", list: inter(Ap, ABm, n) }],
      note: "On AB− trials A predicts the US but none arrives: negative prediction error drives V_B below zero (towards −λ as V_A → λ). B becomes a conditioned inhibitor (a 'safety signal'). Known limitation: RW also predicts that presenting B alone (B−) would extinguish its inhibition back to 0, which does not happen in practice (Zimmer-Hart & Rescorla, 1974)." },
    latent: { name: "Latent inhibition — NOT predicted by RW", phases: (n) => [{ label: "A− pre-exposure", list: rep(Am, n) }, { label: "A+", list: rep(Ap, n) }], ctrl: (n) => [{ label: "no pre-exposure", list: rep(NONE, n) }, { label: "A+", list: rep(Ap, n) }], ctrlCue: "A", ctrlLabel: "V_A control (no pre-exposure)", salience: true,
      note: "Honest caveat: latent inhibition (Lubow & Moore, 1959) — slower conditioning after the CS is pre-exposed alone — is something pure Rescorla–Wagner does NOT predict: with V = 0 and λ = 0 the error is 0, so pre-exposure changes nothing (dotted grey line = pure RW, identical to the control). The solid line only shows LI because an ad-hoc attentional rule outside RW is bolted on (in the spirit of Pearce & Hall, 1980): α_A shrinks by 8 % on every un-reinforced pre-exposure trial." },
    overexpect: { name: "Overexpectation", phases: (n) => [{ label: "A+ / B+", list: inter(Ap, Bp, n) }, { label: "AB+", list: rep(ABp, n) }],
      note: "A and B are each trained to ≈ λ separately. Together they predict ≈ 2λ but only λ arrives, so the compound is reinforced yet both cues LOSE strength — a striking RW prediction confirmed by Kremer (1978)." },
  };
  function rwRun(design, aA, aB, beta, lam, n, salience, useCtrl) {
    const D = RW_DESIGNS[design] || RW_DESIGNS.acq_ext, phases = (useCtrl ? D.ctrl : D.phases)(n);
    const V = { A: 0, B: 0, X: 0 }, al = { A: aA, B: aB, X: 0.3 }, out = [{ A: 0, B: 0, sum: 0, err: 0 }], bounds = [];
    let t = 0;
    phases.forEach((ph) => {
      const start = t;
      ph.list.forEach((tr) => {
        const cues = tr.c.split("").filter(Boolean), sum = cues.reduce((s, c) => s + V[c], 0), err = (tr.r ? lam : 0) - sum;
        cues.forEach((c) => { V[c] += al[c] * beta * err; });
        if (salience && !tr.r && cues.includes("A")) al.A *= 0.92;
        t++; out.push({ A: V.A, B: V.B, sum: V.A + V.B, err, cues: tr.c, r: tr.r });
      });
      bounds.push({ start, end: t, label: ph.label });
    });
    return { out, bounds, alphaA: al.A };
  }
  S.register({
    id: "psych_rescorla_wagner",
    name: "Rescorla–Wagner Conditioning Model",
    domains: ["psychology", "neuroscience", "ai"],
    description: "Pavlovian learning as error correction: ΔV = αβ(λ − ΣV) (Rescorla & Wagner, 1972). Pick a classic experimental design — acquisition/extinction, blocking, overshadowing, conditioned inhibition, overexpectation, or latent inhibition (a well-known failure of the pure model) — and watch the associative strengths of cues A and B evolve trial by trial.",
    params: [
      { key: "design", label: "Design", type: "select", value: "blocking", options: Object.keys(RW_DESIGNS).map((k) => ({ value: k, label: RW_DESIGNS[k].name })) },
      { key: "alphaA", label: "Salience α_A", type: "range", min: 0.05, max: 1, step: 0.05, value: 0.3 },
      { key: "alphaB", label: "Salience α_B", type: "range", min: 0.05, max: 1, step: 0.05, value: 0.3 },
      { key: "beta", label: "US learning rate β", type: "range", min: 0.05, max: 1, step: 0.05, value: 0.5 },
      { key: "lambda", label: "US magnitude λ", type: "range", min: 0.2, max: 2, step: 0.1, value: 1 },
      { key: "n", label: "Trials per phase", type: "range", min: 5, max: 60, step: 1, value: 20 },
    ],
    actions: [
      { label: "▶ Animate trials", fn: (h) => h.animate() },
      { label: "Show all", fn: (h) => h.showAll() },
    ],
    challenges: [
      { id: "rw_blocking", xp: 15, text: "In the blocking design, get V_B below 0.1·λ at the end while the control group's V_B exceeds 0.3·λ." },
      { id: "rw_inhibitor", xp: 15, text: "Create a conditioned inhibitor: make V_B fall below −0.3·λ." },
      { id: "rw_overshadow", xp: 15, text: "Overshadowing: tune the saliences so that V_A ends more than 3× larger than V_B." },
      { id: "rw_overexpect", xp: 20, text: "Overexpectation: show that reinforcing the AB compound makes ΣV drop by more than 0.1·λ." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 440 }), ctx = cv.ctx;
      let R = null, ctrl = null, pure = null, shown = 0, animating = false, dirty = true;
      function compute(user) {
        const aA = clamp(num(P.alphaA, 0.3), 0.01, 1), aB = clamp(num(P.alphaB, 0.3), 0.01, 1), be = clamp(num(P.beta, 0.5), 0.01, 1), lam = clamp(num(P.lambda, 1), 0.05, 5), n = clamp(Math.round(num(P.n, 20)), 1, 200);
        const D = RW_DESIGNS[P.design] || RW_DESIGNS.acq_ext;
        R = rwRun(P.design, aA, aB, be, lam, n, !!D.salience, false);
        ctrl = D.ctrl ? rwRun(P.design, aA, aB, be, lam, n, !!D.salience, true) : null;
        pure = D.salience ? rwRun(P.design, aA, aB, be, lam, n, false, false) : null;
        R.lam = lam; R.D = D;
        if (!animating) shown = R.out.length - 1;
        if (user) checks(); dirty = true; readout(); renderHtml();
      }
      function checks() {
        const last = R.out[R.out.length - 1], lam = R.lam;
        if (P.design === "blocking" && ctrl && last.B < 0.1 * lam && ctrl.out[ctrl.out.length - 1].B > 0.3 * lam) api.award("rw_blocking");
        if (R.out.some((o) => o.B < -0.3 * lam)) api.award("rw_inhibitor");
        if (P.design === "overshadow" && last.B > 1e-6 && last.A > 3 * last.B) api.award("rw_overshadow");
        if (P.design === "overexpect" && R.bounds.length > 1) { const s0 = R.out[R.bounds[1].start].sum; if (s0 - last.sum > 0.1 * lam) api.award("rw_overexpect"); }
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); if (!R) return;
        const N = R.out.length - 1, lam = R.lam;
        let lo = 0, hi = lam;
        [R, ctrl, pure].forEach((r) => r && r.out.forEach((o) => { lo = Math.min(lo, o.A, o.B); hi = Math.max(hi, o.A, o.B, P.design === "overexpect" ? o.sum : 0); }));
        lo = Math.min(-0.1 * lam, lo - 0.08 * lam); hi = hi + 0.12 * lam;
        const box = { x: 54, y: 30, w: w - 54 - 170, h: h - 30 - 66 };
        const A = axes(ctx, C, box, [0, Math.max(1, N)], [lo, hi], { nx: Math.min(8, Math.max(1, N)), ny: 5, title: `Associative strength V — ${R.D.name}`, xlabel: "trial", ylabel: "V", ylabelOffset: 38 });
        R.bounds.forEach((b, i) => {
          if (i % 2 === 1) { ctx.fillStyle = "rgba(255,255,255,0.035)"; ctx.fillRect(A.sx(b.start), box.y, A.sx(b.end) - A.sx(b.start), box.h); }
          if (i > 0) vline(ctx, A.sx(b.start), box.y, box.y + box.h, C.axis, [4, 3]);
          text(ctx, b.label, (A.sx(b.start) + A.sx(b.end)) / 2, box.y + 14, C.accent, { align: "center", size: 11, bold: true });
        });
        hline(ctx, A.sy(lam), box.x, box.x + box.w, C.accent, [6, 4]); text(ctx, "λ", box.x + box.w + 4, A.sy(lam) + 4, C.accent, { size: 12, bold: true });
        hline(ctx, A.sy(0), box.x, box.x + box.w, C.axis);
        const upto = clamp(Math.floor(shown), 0, N);
        const ser = (r, key) => r.out.slice(0, upto + 1).map((o, i) => [A.sx(i), A.sy(o[key])]);
        const leg = [];
        if (ctrl) { polyline(ctx, ser(ctrl, R.D.ctrlCue), C.series[R.D.ctrlCue === "A" ? 2 : 3], 2, [6, 4]); leg.push({ color: C.series[R.D.ctrlCue === "A" ? 2 : 3], dash: [6, 4], label: R.D.ctrlLabel }); }
        if (pure) { polyline(ctx, ser(pure, "A"), C.muted, 1.5, [2, 3]); leg.push({ color: C.muted, dash: [2, 3], label: "V_A, pure RW (no LI)" }); }
        if (P.design === "overexpect") { polyline(ctx, ser(R, "sum"), C.accent, 1.5, [3, 3]); leg.push({ color: C.accent, dash: [3, 3], label: "ΣV = V_A + V_B" }); }
        polyline(ctx, ser(R, "A"), C.series[0], 2.5); leg.unshift({ color: C.series[0], label: R.D.salience ? "V_A + ad-hoc α decay" : "V_A" });
        if (P.design !== "acq_ext" && P.design !== "latent") { polyline(ctx, ser(R, "B"), C.series[1], 2.5); leg.splice(1, 0, { color: C.series[1], label: "V_B" }); }
        const lastO = R.out[upto]; dot(ctx, A.sx(upto), A.sy(lastO.A), 4, C.series[0]);
        if (P.design !== "acq_ext" && P.design !== "latent") dot(ctx, A.sx(upto), A.sy(lastO.B), 4, C.series[1]);
        // trial-type strip
        const sy0 = box.y + box.h + 30, cw = box.w / Math.max(1, N);
        for (let i = 1; i <= upto; i++) { const o = R.out[i]; if (!o.cues) continue; ctx.fillStyle = o.r ? C.ok : C.danger; ctx.globalAlpha = 0.7; ctx.fillRect(A.sx(i - 1) + 0.5, sy0, Math.max(1, cw - 1), 6); ctx.globalAlpha = 1; }
        text(ctx, "trial: green = US (λ), red = no US (λ = 0)", box.x, sy0 + 18, C.muted, { size: 9 });
        // legend & equation
        const lx = box.x + box.w + 18; legend(ctx, C, lx, box.y + 26, leg.map((l) => ({ color: l.color, dash: l.dash, label: l.label.length > 26 ? l.label.slice(0, 25) + "…" : l.label })), 10);
        text(ctx, "ΔV = αβ(λ − ΣV)", lx, box.y + box.h - 30, C.text, { size: 12, bold: true });
        text(ctx, `trial ${upto}: error ${fx(lastO.err)}`, lx, box.y + box.h - 12, C.muted, { size: 10 });
      }
      function readout() {
        const last = R.out[R.out.length - 1];
        const o = { "Design": R.D.name, "Final V_A": fx(last.A, 3), "Final V_B": fx(last.B, 3), "Final ΣV": fx(last.sum, 3), "Last prediction error": fx(last.err, 3) };
        if (ctrl) o["Control " + (R.D.ctrlCue === "A" ? "V_A" : "V_B")] = fx(ctrl.out[ctrl.out.length - 1][R.D.ctrlCue], 3);
        if (R.D.salience) o["α_A after pre-exposure"] = fx(R.alphaA, 3);
        api.readout(o);
      }
      function renderHtml() {
        api.html(`<div style="font-size:.86rem"><b style="color:${C.accent}">${esc(R.D.name)}</b> — phases: ${R.bounds.map((b) => `<code>${esc(b.label)}</code> ×${b.end - b.start}`).join(" → ")}${ctrl ? ` &nbsp;|&nbsp; control: ${(R.D.ctrl(1)).map((p) => `<code>${esc(p.label)}</code>`).join(" → ")}` : ""}<div style="color:${C.muted};margin-top:6px">${esc(R.D.note)}</div><div style="color:${C.muted};margin-top:6px;font-size:.8rem">Notation: A+ = cue A followed by the US; AB− = compound without US. Each present cue i updates V_i ← V_i + α_i β (λ − ΣV_present). Rescorla &amp; Wagner (1972).</div></div>`);
      }
      api.loop((dt) => {
        if (animating && R) { const N = R.out.length - 1; shown = Math.min(N, shown + dt * Math.max(6, N / 5)); if (shown >= N) animating = false; dirty = true; }
        if (dirty) { dirty = false; draw(); }
      });
      api.onParam(() => compute(true));
      api.onResize(() => { dirty = true; draw(); });
      compute(); draw();
      api.setStatus("Pick a design and vary the saliences; press ▶ Animate to watch learning unfold trial by trial.");
      return {
        animate() { shown = 0; animating = true; dirty = true; },
        showAll() { animating = false; if (R) shown = R.out.length - 1; dirty = true; },
        destroy() { animating = false; },
      };
    },
  });

  // ======================= 4. Operant schedules of reinforcement =======================
  const SCHED_NAMES = { FR: "Fixed ratio", VR: "Variable ratio", FI: "Fixed interval", VI: "Variable interval" };
  S.register({
    id: "psych_operant_schedules",
    name: "Schedules of Reinforcement — Cumulative Recorder",
    domains: ["psychology", "neuroscience"],
    description: "A simulated lever-pressing rat on FR, VR, FI and VI schedules (Ferster & Skinner, 1957), drawn as a classic cumulative record: slope = response rate, ticks = reinforcers. See FR break-and-run with post-reinforcement pauses, FI scallops, steady VR/VI responding, and the extinction burst when reinforcement stops.",
    params: [
      { key: "schedule", label: "Schedule", type: "select", value: "FR", options: [{ value: "FR", label: "FR — fixed ratio" }, { value: "VR", label: "VR — variable ratio" }, { value: "FI", label: "FI — fixed interval" }, { value: "VI", label: "VI — variable interval" }] },
      { key: "value", label: "Ratio N (responses) or interval T (s)", type: "range", min: 1, max: 120, step: 1, value: 20 },
      { key: "speed", label: "Simulation speed (× real time)", type: "range", min: 1, max: 40, step: 1, value: 8 },
      { key: "extinction", label: "Extinction (no reinforcement)", type: "toggle", value: false },
    ],
    actions: [
      { label: "⏯ Pause / resume", fn: (h) => h.toggle() },
      { label: "New sheet", fn: (h) => h.newSheet() },
      { label: "Reset organism", fn: (h) => h.reset() },
    ],
    challenges: [
      { id: "op_scallop", xp: 15, text: "Run a Fixed-Interval schedule until ≥ 5 reinforcers have been earned and spot the 'scallop' — a pause, then accelerating responding." },
      { id: "op_ratio_interval", xp: 15, text: "Run VR and VI for ≥ 120 s each (sim time). Which produces the higher response rate, and why does a ratio schedule reward speed?" },
      { id: "op_burst", xp: 20, text: "Switch on extinction after training and catch the extinction burst before responding dies out." },
      { id: "op_prp", xp: 15, text: "Raise the FR ratio until the mean post-reinforcement pause exceeds 8 s." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx;
      const rng = api.random, SHEET = 600, YMAX = 600, MAXPTS = 40000;
      let st, paused = false, burstSeen = false, lastUi = 0, lastHtml = 0;
      const stats = {};
      const val = () => clamp(Math.round(num(P.value, 20)), 1, 1000);
      const sched = () => (SCHED_NAMES[P.schedule] ? P.schedule : "FR");
      const label = () => `${sched()} ${val()}${sched() === "FI" || sched() === "VI" ? " s" : ""}`;
      const statOf = () => (stats[label()] = stats[label()] || { time: 0, resp: 0, sr: 0, prps: [] });
      function fresh() { return { t: 0, cum: 0, lastSR: 0, count: 0, req: 1, due: 1, pause: 0, S: 1, B: 0, burstFired: false, extStart: 0, awaitPRP: false, sheetStart: 0, sheetCum: 0, pts: [[0, 0]], srs: [], marks: [], recent: [] }; }
      function arm() {
        const v = val(), s = sched();
        if (s === "FR") st.req = v;
        else if (s === "VR") st.req = 1 + Math.floor(rng() * (2 * v - 1)); // uniform 1…2N−1, mean N
        else if (s === "FI") st.due = v;
        else st.due = -v * Math.log(1 - rng() * 0.999); // constant-probability VI: exponential, mean T
      }
      function setPause() {
        const v = val(), s = sched();
        st.pause = s === "FR" ? Math.min(90, (0.8 + 0.09 * v) * (0.6 + 0.8 * rng())) : s === "FI" ? v * (0.3 + 0.3 * rng()) : s === "VR" ? 0.4 : 0.6;
      }
      function rate() {
        const since = st.t - st.lastSR, v = val(), s = sched();
        let base;
        if (since < st.pause) base = 0.01;
        else if (s === "FR") base = 3.2;
        else if (s === "VR") base = 2.8;
        else if (s === "FI") { const f = clamp((since - st.pause) / Math.max(1, v - st.pause), 0, 1); base = 0.12 + 2.2 * Math.pow(f, 1.8); }
        else { const R = 60 / v; base = 2.2 * R / (R + 0.7); } // Herrnstein hyperbola, R in reinforcers/min
        return Math.min(6, base * st.S * (1 + st.B));
      }
      function newSheet() { st.sheetStart = st.t; st.sheetCum = st.cum; st.pts = [[st.t, st.cum]]; st.srs = []; st.marks = st.marks.filter((m) => m.t >= st.t); }
      function respond() {
        st.cum++; st.count++; const so = statOf(); so.resp++;
        st.recent.push(st.t); if (st.recent.length > 600) st.recent.shift();
        if (st.awaitPRP) { so.prps.push(st.t - st.lastSR); if (so.prps.length > 200) so.prps.shift(); st.awaitPRP = false; }
        if (P.extinction) st.S = Math.max(0.02, st.S * 0.996);
        const s = sched(), since = st.t - st.lastSR;
        const earned = !P.extinction && ((s === "FR" || s === "VR") ? st.count >= st.req : since >= st.due);
        if (earned) {
          st.srs.push([st.t, st.cum]); st.lastSR = st.t; st.count = 0; arm(); setPause();
          st.S = Math.min(1, st.S + 0.25 * (1 - st.S)); so.sr++; st.awaitPRP = true;
        }
        if (st.pts.length < MAXPTS) st.pts.push([st.t, st.cum]);
      }
      function step(h) {
        st.t += h; statOf().time += h; st.B *= Math.exp(-h / 25);
        if (P.extinction) {
          st.S = Math.max(0.02, st.S * Math.exp(-h / 500));
          if (!st.burstFired) {
            const s = sched(), v = val();
            const exceeded = (s === "FR" || s === "VR") ? st.count > 1.6 * v + 2 : st.t - st.lastSR > 2 * v + 2;
            if (exceeded) { st.B = 1.0; st.burstFired = true; burstSeen = true; }
          }
        }
        if (rng() < rate() * h) respond();
        if (st.t - st.sheetStart > SHEET) newSheet();
      }
      function advance(simDt, cap) { let left = Math.min(simDt, cap || 5); while (left > 1e-9) { const h = Math.min(0.05, left); step(h); left -= h; } }
      function reset() { st = fresh(); Object.keys(stats).forEach((k) => delete stats[k]); arm(); burstSeen = false; advance(240, 300); }
      function recentRate() { const t0 = st.t - 30; let n = 0; for (let i = st.recent.length - 1; i >= 0 && st.recent[i] >= t0; i--) n++; return (n / Math.min(30, Math.max(1e-6, st.t))) * 60; }
      function checks() {
        const sum = (pre, f) => Object.keys(stats).filter((k) => k.startsWith(pre + " ")).reduce((s, k) => s + stats[k][f], 0);
        if (sum("FI", "sr") >= 5) api.award("op_scallop");
        if (sum("VR", "time") >= 120 && sum("VI", "time") >= 120) api.award("op_ratio_interval");
        if (burstSeen && P.extinction && st.S < 0.35) api.award("op_burst");
        const so = stats[label()];
        if (sched() === "FR" && so && so.prps.length >= 3 && mean(so.prps) > 8) api.award("op_prp");
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C);
        const box = { x: 54, y: 30, w: w - 54 - 16, h: h - 30 - 46 };
        const A = axes(ctx, C, box, [0, SHEET], [0, YMAX], { nx: 10, ny: 6, xfmt: (v) => Math.round(v + st.sheetStart), title: `Cumulative record — ${label()}${P.extinction ? " · EXTINCTION" : ""}`, xlabel: "time (s)", ylabel: "cumulative responses (pen resets every 600)", ylabelOffset: 38 });
        // reference slope fan (bottom-right)
        const fx0 = box.x + box.w - 120, fy0 = box.y + box.h - 8;
        [0.5, 1, 2, 3].forEach((r) => { const dx = A.sx(40) - A.sx(0), dy = A.sy(0) - A.sy(r * 40); polyline(ctx, [[fx0, fy0], [fx0 + dx, fy0 - dy]], "rgba(255,255,255,0.18)", 1); text(ctx, r + "/s", fx0 + dx + 2, fy0 - dy + 3, C.muted, { size: 9 }); });
        st.marks.forEach((m) => { if (m.t < st.sheetStart) return; const x = A.sx(m.t - st.sheetStart); vline(ctx, x, box.y, box.y + box.h, m.color, [4, 4]); text(ctx, m.text, x + 3, box.y + 12, m.color, { size: 10, bold: true }); });
        // record (pen wraps at YMAX)
        ctx.save(); ctx.strokeStyle = C.primary; ctx.lineWidth = 1.6; ctx.beginPath();
        let prevY = null;
        for (let i = 0; i < st.pts.length; i++) {
          const p = st.pts[i], yv = (p[1] - st.sheetCum) % YMAX, x = A.sx(p[0] - st.sheetStart), y = A.sy(yv);
          if (prevY === null || yv < prevY) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          prevY = yv;
        }
        const lastY = A.sy((st.cum - st.sheetCum) % YMAX), nowX = A.sx(st.t - st.sheetStart);
        if (prevY !== null) ctx.lineTo(nowX, lastY);
        ctx.stroke(); ctx.restore();
        st.srs.forEach((s) => { const x = A.sx(s[0] - st.sheetStart), y = A.sy((s[1] - st.sheetCum) % YMAX); polyline(ctx, [[x, y], [x + 6, y + 7]], C.accent, 2); });
        dot(ctx, nowX, lastY, 3.5, P.extinction ? C.danger : C.ok);
        legend(ctx, C, box.x + 10, box.y + 26, [{ color: C.primary, label: "responses (slope = rate)" }, { color: C.accent, label: "reinforcer delivered" }], 10);
      }
      function readout() {
        const so = statOf();
        api.readout({
          "Schedule": `${label()} (${SCHED_NAMES[sched()]})`, "Sim time": fx(st.t, 0) + " s", "Total responses": st.cum,
          "Current rate (last 30 s)": fx(recentRate(), 0) + " resp/min",
          "Reinforcers / hour (this schedule)": so.time > 1 ? fx(so.sr / so.time * 3600, 0) : "—",
          "Mean post-reinforcement pause": so.prps.length ? fx(mean(so.prps), 1) + " s" : "—",
          "Response strength": fx(st.S, 2) + (st.B > 0.05 ? `  (burst ×${fx(1 + st.B, 2)})` : ""),
          "Status": paused ? "paused" : P.extinction ? "extinction" : "reinforcing",
        });
      }
      function renderHtml() {
        const rows = Object.keys(stats).filter((k) => stats[k].time > 1).map((k) => { const s = stats[k]; return [`<b>${esc(k)}</b>`, fx(s.time, 0) + " s", s.resp, fx(s.resp / s.time * 60, 0), fx(s.sr / s.time * 3600, 0), s.prps.length ? fx(mean(s.prps), 1) + " s" : "—"]; });
        api.html(tbl(["Schedule", "Sim time", "Responses", "Rate (resp/min)", "Reinforcers/hr", "Mean PRP"], rows) + `<div style="color:${C.muted};font-size:.8rem;margin-top:6px">Model: responses are a Poisson process whose rate depends on the schedule state — a post-reinforcement pause that grows with FR size, a fixed high run rate on ratios, an accelerating rate through each FI (≈ 30–60 % of T paused), and Herrnstein's hyperbola r = k·R/(R + R₀) on VI (Herrnstein, 1970). In extinction response strength decays and, when the expected reinforcer fails to arrive, a transient burst (set here to double the rate) precedes the decline. Simulated organism with illustrative parameters — qualitative, not fitted to a particular rat.</div>`);
      }
      api.loop((dt) => {
        if (!paused) advance(dt * clamp(num(P.speed, 8), 0.1, 100));
        draw();
        const now = performance.now();
        if (now - lastUi > 250) { lastUi = now; readout(); checks(); }
        if (now - lastHtml > 1200) { lastHtml = now; renderHtml(); }
      });
      api.onParam((key) => {
        if (key === "schedule" || key === "value") { st.lastSR = st.t; st.count = 0; st.pause = 0; st.awaitPRP = false; arm(); st.marks.push({ t: st.t, text: label(), color: C.muted }); }
        if (key === "extinction") { st.extStart = st.t; st.burstFired = false; st.marks.push({ t: st.t, text: P.extinction ? "EXT on" : "EXT off", color: P.extinction ? C.danger : C.ok }); if (!P.extinction) { st.lastSR = st.t; st.count = 0; arm(); } }
        draw(); readout();
      });
      api.onResize(draw);
      reset(); draw(); readout(); renderHtml();
      api.setStatus("FR 20: note the flat pauses after each reinforcer, then a steep run. Try FI, VR, VI — then switch on extinction.");
      return {
        toggle() { paused = !paused; readout(); },
        newSheet() { newSheet(); draw(); },
        reset() { reset(); draw(); readout(); renderHtml(); },
        destroy() { paused = true; },
      };
    },
  });

  // ======================= 5. Serial position / free recall =======================
  const WORDS = ["APPLE", "BRIDGE", "CANDLE", "DONKEY", "ENGINE", "FOREST", "GARDEN", "HAMMER", "ISLAND", "JACKET", "KETTLE", "LADDER", "MIRROR", "NAPKIN", "ORANGE", "PENCIL", "RABBIT", "SADDLE", "TICKET", "VALLEY", "WAGON", "BASKET", "CARPET", "DRAGON", "FEATHER", "GUITAR", "HELMET", "LEMON", "MARBLE", "NEEDLE", "PEPPER", "ROCKET", "SILVER", "TOMATO", "WINDOW", "ANCHOR", "BUTTON", "CASTLE", "DOCTOR", "FINGER", "GOBLET", "HONEY", "KITTEN", "LIZARD", "MONKEY", "OCEAN", "PARROT", "RIVER", "SPIDER", "TURTLE", "VIOLIN", "WALRUS", "BOTTLE", "CAMERA", "DESERT", "FLOWER", "GLOVE", "HORSE", "IGLOO", "JUNGLE", "KNIGHT", "LAMP", "MEADOW", "NOODLE", "PIANO", "QUEEN", "SALMON", "TABLE", "UMBRELLA", "VOLCANO", "WHISTLE", "BREAD", "CHERRY", "DIAMOND", "EAGLE", "FROG", "GHOST", "HARBOR", "JEWEL", "KITE", "LION", "MOON", "NEST", "OWL", "PILLOW", "ROBOT", "SHELL", "TIGER", "WIZARD", "ZEBRA"];
  /** Two-store (Atkinson–Shiffrin style) Monte-Carlo: rehearsal buffer of r slots with random displacement; LTS strength accrues
   * while an item sits in the buffer, shared among the buffer's occupants; a distractor delay empties the buffer. */
  function twoStore(N, rateMs, delayS, r, lists, seed) {
    const rng = makeRng(seed || 7), rec = new Array(N).fill(0), secs = clamp(rateMs, 100, 10000) / 1000, theta = 1.0, gamma = 0.35, loss = 0.15, rho = 0.2;
    r = clamp(Math.round(r), 1, 12);
    for (let L = 0; L < lists; L++) {
      let buf = []; const str = new Array(N).fill(0);
      for (let i = 0; i < N; i++) {
        if (buf.length >= r) buf.splice(Math.floor(rng() * buf.length), 1);
        buf.push(i);
        const share = theta * secs / buf.length; buf.forEach((j) => { str[j] += share; });
      }
      // distractor: each second, items still lingering in STS get a little residual rehearsal (rho), then may be displaced
      for (let s = 0; s < delayS; s++) { if (buf.length) { const sh = rho / buf.length; buf.forEach((j) => { str[j] += sh; }); } buf = buf.filter(() => rng() > loss); }
      const out = new Set();
      buf.forEach((j) => { if (rng() < 0.95) out.add(j); });
      for (let j = 0; j < N; j++) if (!out.has(j) && rng() < 1 - Math.exp(-gamma * str[j])) out.add(j);
      out.forEach((j) => { rec[j]++; });
    }
    return rec.map((c) => c / Math.max(1, lists));
  }
  S.register({
    id: "psych_serial_position",
    name: "Serial Position & Free Recall",
    domains: ["psychology", "neuroscience"],
    description: "Study a list of words shown one at a time, then recall as many as you can in any order. Your recall by list position builds a serial-position curve — primacy and recency — compared against a two-store memory model. Add a distractor delay to replicate Glanzer & Cunitz (1966), or switch to simulate mode to explore the model.",
    params: [
      { key: "mode", label: "Mode", type: "select", value: "play", options: [{ value: "play", label: "Play: memorise & recall" }, { value: "sim", label: "Simulate the two-store model" }] },
      { key: "N", label: "List length", type: "range", min: 6, max: 20, step: 1, value: 12 },
      { key: "rate", label: "Presentation time per word (ms)", type: "range", min: 500, max: 3000, step: 250, value: 1000 },
      { key: "delay", label: "Distractor delay before recall", type: "select", value: 0, options: [{ value: 0, label: "none (immediate recall)" }, { value: 10, label: "10 s counting backward" }, { value: 30, label: "30 s counting backward" }] },
      { key: "buffer", label: "Model: rehearsal-buffer size r", type: "range", min: 2, max: 7, step: 1, value: 4 },
    ],
    actions: [
      { label: "▶ New list", fn: (h) => h.startList() },
      { label: "Score recall", fn: (h) => h.score() },
      { label: "Clear my data", fn: (h) => h.clearData() },
    ],
    challenges: [
      { id: "sp_play3", xp: 15, text: "Study and recall 3 lists, then compare your curve with the model's." },
      { id: "sp_recency", xp: 15, text: "Show recency in your own data: after ≥ 3 immediate-recall lists, recall the last item better than the middle items." },
      { id: "sp_delay", xp: 15, text: "In simulate mode add a 30-s distractor. Which end of the curve vanishes, and what does that say about short-term memory?" },
      { id: "sp_rate", xp: 15, text: "In simulate mode compare fast (≤ 750 ms) and slow (≥ 2500 ms) presentation. Which part of the curve does rate affect?" },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx;
      const T = timers(), B = Buttons();
      let phase = "idle", list = [], pool = [], sel = new Set(), si = -1, blank = false, delayLeft = 0, countFrom = 0, last = null, model = [], alt = [];
      const seen = { fast: false, slow: false };
      const data = {};
      const Nn = () => clamp(Math.round(num(P.N, 12)), 3, 30), Dl = () => clamp(Math.round(num(P.delay, 0)), 0, 60), keyOf = (n, d) => `${n}|${d}`;
      function computeModel() {
        const N = Nn(), d = Dl();
        model = twoStore(N, num(P.rate, 1000), d, num(P.buffer, 4), 800, 11);
        alt = twoStore(N, num(P.rate, 1000), d > 0 ? 0 : 30, num(P.buffer, 4), 800, 11);
        if (P.mode === "sim") {
          if (d >= 30) api.award("sp_delay");
          if (num(P.rate) <= 750) seen.fast = true; if (num(P.rate) >= 2500) seen.slow = true;
          if (seen.fast && seen.slow) api.award("sp_rate");
        }
      }
      function startList() {
        T.clear(); if (P.mode !== "play") api.setParam("mode", "play");
        const N = Nn(), words = shuffle(WORDS.slice());
        list = words.slice(0, N); pool = shuffle(words.slice(0, Math.min(words.length, 2 * N)));
        sel = new Set(); si = -1; phase = "study"; last = null; renderHtml();
        api.setStatus("Memorise the words. Don't write them down!");
        showNext();
      }
      function showNext() {
        si++;
        if (si >= list.length) {
          if (Dl() > 0) { phase = "delay"; delayLeft = Dl(); countFrom = 300 + randInt(600); draw(); api.setStatus("Count backward by 3s ALOUD from the number shown — this blocks rehearsal."); T.after(1000, tickDelay); }
          else beginRecall();
          return;
        }
        blank = false; draw();
        const r = clamp(num(P.rate, 1000), 200, 10000);
        T.after(r * 0.85, () => { blank = true; draw(); T.after(r * 0.15, showNext); });
      }
      function tickDelay() { delayLeft--; draw(); if (delayLeft <= 0) beginRecall(); else T.after(1000, tickDelay); }
      function beginRecall() { phase = "recall"; draw(); renderHtml(); api.setStatus("Type every word you remember in the box below (true free recall) — or click them in the grid (easier: closer to recognition) — then press Done / Score recall."); }
      function score() {
        if (phase !== "recall") return;
        const box = api.root && api.root.querySelector ? api.root.querySelector("#psp-typed") : null;
        const typed = box ? Array.from(new Set(String(box.value || "").toUpperCase().split(/[^A-Z]+/).filter(Boolean))) : [];
        const N = list.length, hit = new Array(N).fill(0); let fa = 0;
        sel.forEach((w) => { const i = list.indexOf(w); if (i >= 0) hit[i] = 1; else fa++; });
        typed.forEach((w) => { const i = list.indexOf(w); if (i >= 0) hit[i] = 1; else if (!sel.has(w)) fa++; });
        const k = keyOf(N, Dl()), d = (data[k] = data[k] || { lists: 0, hits: new Array(N).fill(0), fa: 0 });
        d.lists++; d.fa += fa; hit.forEach((v, i) => { d.hits[i] += v; });
        last = { n: hit.reduce((s, v) => s + v, 0), N, fa, hit };
        phase = "scored";
        const total = Object.keys(data).reduce((s, kk) => s + data[kk].lists, 0);
        if (total >= 3) api.award("sp_play3");
        const d0 = data[keyOf(N, 0)];
        if (d0 && d0.lists >= 3) { const p = d0.hits.map((h) => h / d0.lists), lo = Math.floor(N / 3), hi = Math.ceil(2 * N / 3); const mid = mean(p.slice(lo, hi)); if (p[N - 1] > mid + 0.1) api.award("sp_recency"); }
        api.setStatus(`You recalled ${last.n} / ${N} (${fa} intrusion${fa === 1 ? "" : "s"}). Press ▶ New list to add another list to your curve.`);
        draw(); readout(); renderHtml();
      }
      function drawCurve(box) {
        const N = Nn(), d = data[keyOf(N, Dl())];
        const A = axes(ctx, C, box, [1, N], [0, 1], { nx: Math.min(N - 1, 10), ny: 4, xfmt: (v) => Math.round(v), yfmt: (v) => Math.round(v * 100) + "%", title: P.mode === "sim" ? "Two-store model: serial-position curve" : "Serial-position curve", xlabel: "serial position", ylabel: "P(recall)", ylabelOffset: 34 });
        const pts = (arr) => arr.map((v, i) => [A.sx(i + 1), A.sy(v)]);
        const leg = [];
        polyline(ctx, pts(alt), C.series[2], 1.5, [3, 4]); leg.push({ color: C.series[2], dash: [3, 4], label: `model, ${Dl() > 0 ? "no delay" : "30 s distractor"}` });
        polyline(ctx, pts(model), C.series[0], P.mode === "sim" ? 2.5 : 1.8, P.mode === "sim" ? [] : [6, 4]); leg.push({ color: C.series[0], dash: P.mode === "sim" ? [] : [6, 4], label: `model, ${Dl() ? Dl() + " s distractor" : "immediate"}` });
        if (P.mode === "play" && d && d.lists) { const p = d.hits.map((h) => h / d.lists); polyline(ctx, pts(p), C.series[1], 2.5); p.forEach((v, i) => dot(ctx, A.sx(i + 1), A.sy(v), 3.5, C.series[1])); leg.push({ color: C.series[1], label: `you (${d.lists} list${d.lists > 1 ? "s" : ""})` }); }
        legend(ctx, C, box.x + box.w * 0.3, box.y + 16, leg, 10);
      }
      function drawTask(box) {
        const cx = box.x + box.w / 2, cy = box.y + box.h * 0.42, fs = clamp(box.w / 9, 20, 46);
        if (phase === "study") {
          text(ctx, `word ${si + 1} / ${list.length}`, box.x + 12, box.y + 18, C.muted, { size: 11 });
          if (!blank && list[si]) text(ctx, list[si], cx, cy, C.text, { size: fs, bold: true, align: "center", base: "middle" });
        } else if (phase === "delay") {
          text(ctx, "Count backward by 3s, aloud, from", cx, cy - fs, C.muted, { size: 13, align: "center" });
          text(ctx, countFrom, cx, cy, C.accent, { size: fs, bold: true, align: "center", base: "middle" });
          text(ctx, `${delayLeft} s left`, cx, cy + fs, C.muted, { size: 12, align: "center" });
        } else if (phase === "recall" || phase === "scored") {
          B.reset();
          const cols = pool.length > 24 ? 5 : 4, rows = Math.ceil(pool.length / cols), gap = 6, bh = 36;
          const cw = (box.w - 24 - gap * (cols - 1)) / cols, chH = clamp((box.h - 30 - bh - 16 - gap * rows) / Math.max(1, rows), 14, 34);
          text(ctx, phase === "recall" ? "Click the words that were on the list:" : `Scored: ${last ? last.n : 0}/${list.length} — green = studied, red = lure you picked`, box.x + 12, box.y + 16, C.muted, { size: 11 });
          pool.forEach((wd, i) => {
            const r = Math.floor(i / cols), c = i % cols, x = box.x + 12 + c * (cw + gap), y = box.y + 26 + r * (chH + gap), on = sel.has(wd), inList = list.includes(wd);
            let fill = on ? "rgba(124,156,255,0.45)" : "rgba(255,255,255,0.05)", stroke = on ? C.primary : "rgba(255,255,255,0.12)";
            if (phase === "scored") { if (inList) { fill = on ? "rgba(110,231,183,0.45)" : "rgba(110,231,183,0.12)"; stroke = C.ok; } else if (on) { fill = "rgba(255,107,107,0.4)"; stroke = C.danger; } }
            B.add({ id: "w:" + wd, x, y, w: cw, h: chH, label: wd, fill, stroke, size: clamp(chH * 0.42, 8, 12), disabled: phase !== "recall" });
          });
          B.add({ id: "done", x: box.x + 12, y: box.y + box.h - bh - 6, w: box.w - 24, h: bh, label: phase === "recall" ? "✓ Done — score my recall" : "▶ Next list", fill: "rgba(255,209,102,0.22)" });
          B.draw(ctx, C);
          // re-draw disabled scored chips with their colours visible
          if (phase === "scored") pool.forEach((wd, i) => { const r = Math.floor(i / cols), c = i % cols, x = box.x + 12 + c * (cw + gap), y = box.y + 26 + r * (chH + gap), on = sel.has(wd), inList = list.includes(wd); if (!inList && !on) return; roundRect(ctx, x, y, cw, chH, 8, inList ? (on ? "rgba(110,231,183,0.45)" : "rgba(110,231,183,0.12)") : "rgba(255,107,107,0.4)", inList ? C.ok : C.danger); text(ctx, wd, x + cw / 2, y + chH / 2 + 1, C.text, { align: "center", base: "middle", size: clamp(chH * 0.42, 8, 12), bold: true }); });
        } else {
          text(ctx, "Free-recall game", cx, cy - 30, C.text, { size: 18, bold: true, align: "center" });
          text(ctx, `${Nn()} words · ${num(P.rate)} ms each · ${Dl() ? Dl() + " s distractor" : "immediate recall"}`, cx, cy, C.muted, { size: 12, align: "center" });
          text(ctx, "Click here or ▶ New list to start", cx, cy + 26, C.accent, { size: 13, align: "center", bold: true });
        }
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); B.reset();
        if (P.mode === "sim") { drawCurve({ x: 56, y: 30, w: w - 56 - 24, h: h - 30 - 46 }); return; }
        const Lw = Math.round(w * 0.55); vline(ctx, Lw, 10, h - 10, C.grid);
        drawTask({ x: 0, y: 4, w: Lw, h: h - 8 });
        drawCurve({ x: Lw + 46, y: 30, w: w - Lw - 62, h: h - 30 - 46 });
      }
      function readout() {
        const N = Nn(), lo = Math.floor(N / 3), hi = Math.ceil(2 * N / 3);
        const o = { "Mode": P.mode === "sim" ? "simulate" : "play", "Model P(first)": pct(model[0], 0), "Model P(middle)": pct(mean(model.slice(lo, hi)), 0), "Model P(last)": pct(model[N - 1], 0) };
        const d = data[keyOf(N, Dl())];
        if (P.mode === "play") {
          o["Phase"] = phase;
          if (d && d.lists) { const p = d.hits.map((x) => x / d.lists); o["Your lists (this condition)"] = d.lists; o["Your P(first)"] = pct(p[0], 0); o["Your P(middle)"] = pct(mean(p.slice(lo, hi)), 0); o["Your P(last)"] = pct(p[N - 1], 0); o["Intrusions / list"] = fx(d.fa / d.lists, 1); }
        }
        api.readout(o);
      }
      function renderHtml() {
        const info = `<div style="color:${C.muted};font-size:.82rem;margin-top:6px">Simulated two-store model (in the spirit of Atkinson &amp; Shiffrin, 1968; illustrative parameters, 800 simulated lists): each new word enters a rehearsal buffer of r slots (random displacement when full). While in the buffer an item gains long-term strength at a rate shared among the buffer's occupants, so early items — rehearsed with less competition — gain the most (<b>primacy</b>). Items still in the buffer at test are output first (<b>recency</b>). A distractor task empties the buffer (items linger a few seconds, getting a little residual rehearsal, before being displaced), removing recency but leaving primacy (Glanzer &amp; Cunitz, 1966, used 0-, 10- and 30-s delays filled with counting); slower presentation boosts primacy and middle items but not recency (Glanzer &amp; Cunitz, 1966; Murdock, 1962). Recall from LTS: P = 1 − e^(−0.35·strength). Note: typing words from memory is true free recall; picking them from the word grid (which contains lures) is closer to a recognition test and usually gives flatter curves.</div>`;
        if (P.mode === "play" && phase === "recall") {
          const elx = api.html(`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label style="font-size:.85rem">Type recalled words (any order):</label><input id="psp-typed" type="text" autocomplete="off" style="flex:1;min-width:180px;background:#0f1222;color:#e8ebff;border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:6px 8px"><button class="sim-btn" type="button" id="psp-score">Score</button></div>` + info);
          const inp = elx.querySelector("#psp-typed"), btn = elx.querySelector("#psp-score");
          if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); score(); } });
          if (btn) btn.addEventListener("click", () => score());
          return;
        }
        const rows = Object.keys(data).map((k) => { const [n, d] = k.split("|"), D = data[k]; return [n + " words", d === "0" ? "immediate" : d + " s distractor", D.lists, pct(D.hits.reduce((s, v) => s + v, 0) / (D.lists * Number(n)), 0), fx(D.fa / D.lists, 1)]; });
        api.html((rows.length ? tbl(["List", "Recall", "Lists", "Mean recall", "Intrusions/list"], rows) : "") + info);
      }
      api.pointer(cv.canvas, {
        down(p) {
          if (P.mode !== "play") return;
          if (phase === "recall" || phase === "scored") {
            const b = B.hit(p.x, p.y); if (!b) return;
            if (b.id === "done") { if (phase === "recall") score(); else startList(); return; }
            const wd = b.id.slice(2); if (sel.has(wd)) sel.delete(wd); else sel.add(wd); draw();
          } else if (phase === "idle" && p.x < cv.width * 0.55) startList();
        },
      });
      api.onParam((key) => {
        if ((key === "N" || key === "rate" || key === "delay" || key === "mode") && (phase === "study" || phase === "delay")) { T.clear(); phase = "idle"; api.setStatus("Settings changed — list aborted. Press ▶ New list."); }
        if (key === "mode") { if (P.mode === "sim" && phase === "recall") phase = "idle"; renderHtml(); }
        computeModel(); draw(); readout();
      });
      api.onResize(draw);
      computeModel(); draw(); readout(); renderHtml();
      api.setStatus("Press ▶ New list (or click the left panel). The dashed line is what the two-store model predicts for these settings.");
      return {
        startList, score,
        clearData() { Object.keys(data).forEach((k) => delete data[k]); draw(); readout(); renderHtml(); },
        destroy() { T.clear(); },
      };
    },
  });

  // ======================= 6. Forgetting curve & spacing =======================
  /** Review-time presets (days). */
  function fcPreset(name, n, H) {
    const out = [];
    if (name === "massed") for (let k = 1; k <= n; k++) out.push(0.05 * k);
    else if (name === "cram") for (let k = 0; k < n; k++) out.push(Math.max(0.05, H - 1 + 0.05 * k));
    else if (name === "uniform") for (let k = 1; k <= n; k++) out.push((k * H) / (n + 1));
    else if (name === "expanding") { const g = (0.8 * H) / Math.max(1, Math.pow(2, n) - 1); for (let k = 1; k <= n; k++) out.push(g * (Math.pow(2, k) - 1)); }
    return out;
  }
  /** Illustrative stability model. Each review at time t: R = e^(−Δt/S); S ← S·(1 + G·(0.1 + (1 − R))).
   *  Lower R at review → bigger boost (spacing / desirable difficulty). Returns study events [{t, S, R}]. */
  function fcRun(revs, S0, G) {
    S0 = clamp(num(S0, 1), 0.05, 100); G = clamp(num(G, 2), 0, 20);
    let Sv = S0, last = 0; const ev = [{ t: 0, S: Sv, R: 1 }];
    revs.filter((t) => Number.isFinite(t) && t > 0).sort((a, b) => a - b).forEach((t) => { const R = Math.exp(-(t - last) / Sv); Sv = Math.min(1e6, Sv * (1 + G * (0.1 + (1 - R)))); last = t; ev.push({ t, S: Sv, R }); });
    return ev;
  }
  /** Retention at time t given study events. */
  function fcR(ev, t) { let e = ev[0]; for (const x of ev) { if (x.t <= t) e = x; else break; } return Math.exp(-Math.max(0, t - e.t) / Math.max(1e-9, e.S)); }
  S.register({
    id: "psych_forgetting_curve",
    name: "Forgetting Curve & Spaced Review",
    domains: ["psychology", "education"],
    description: "The forgetting curve, first measured by Ebbinghaus (1885) with his savings method, modelled here with the common exponential approximation R = e^(−t/S): retention decays with memory stability S. (Ebbinghaus's own fit was a different, logarithmic savings formula.) In this illustrative model every review boosts S — and more so when some forgetting has happened first (the spacing effect). Compare massed, cram, uniform and expanding schedules, or click the timeline to design your own.",
    params: [
      { key: "schedule", label: "Review schedule", type: "select", value: "expanding", options: [{ value: "expanding", label: "Expanding spaced (gaps double)" }, { value: "uniform", label: "Uniform spaced" }, { value: "massed", label: "Massed (all on day 0)" }, { value: "cram", label: "Cram (night before test)" }, { value: "none", label: "No reviews" }, { value: "custom", label: "Custom (click the timeline)" }] },
      { key: "n", label: "Number of reviews (presets)", type: "range", min: 0, max: 8, step: 1, value: 4 },
      { key: "S0", label: "Initial stability S₀ (days)", type: "range", min: 0.2, max: 5, step: 0.1, value: 1 },
      { key: "G", label: "Stability gain per review", type: "range", min: 0.5, max: 4, step: 0.1, value: 2 },
      { key: "H", label: "Test day", type: "range", min: 7, max: 60, step: 1, value: 30 },
    ],
    actions: [
      { label: "Clear custom reviews", fn: (h) => h.clearCustom() },
      { label: "Copy preset → custom", fn: (h) => h.copyToCustom() },
    ],
    challenges: [
      { id: "fc_spacing", xp: 15, text: "With the same number (≥ 2) of reviews, show that expanding spaced reviews beat massed day-0 reviews by ≥ 30 points on test day." },
      { id: "fc_custom", xp: 20, text: "Click the timeline to build a custom schedule with at most 4 reviews that gives ≥ 80 % retention on test day AND still ≥ 45 % 30 days after the test (default S₀ and gain; the expanding preset only manages ≈ 39 %)." },
      { id: "fc_cram", xp: 10, text: "Try cramming the night before. Test-day retention looks fine — but what is left 30 days after the test?" },
      { id: "fc_halflife", xp: 10, text: "Set the initial stability so that the one-shot half-life (S₀·ln 2) is ≈ 1 day." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 440 }), ctx = cv.ctx;
      let custom = [3, 10, 21], A = null, box = null;
      const Hd = () => clamp(Math.round(num(P.H, 30)), 1, 365), nR = () => clamp(Math.round(num(P.n, 4)), 0, 12);
      const preset = fcPreset;
      const reviewsOf = (name) => (name === "custom" ? custom.slice().sort((a, b) => a - b) : preset(name, nR(), Hd()));
      const run = (revs) => fcRun(revs, num(P.S0, 1), num(P.G, 2));
      const Rat = fcR;
      function summary(name) { const ev = run(reviewsOf(name).filter((t) => t <= Hd())), H = Hd(); return { ev, test: Rat(ev, H), after: Rat(ev, H + 30), S: ev[ev.length - 1].S, n: ev.length - 1 }; }
      function checks() {
        const s = summary(P.schedule);
        if (nR() >= 2 && P.schedule === "expanding" && s.test - summary("massed").test >= 0.3) api.award("fc_spacing");
        if (P.schedule === "custom" && s.n >= 1 && s.n <= 4 && s.test >= 0.8 && s.after >= 0.45 && num(P.G) <= 2 + 1e-9 && num(P.S0) <= 1 + 1e-9) api.award("fc_custom");
        if (P.schedule === "cram" && nR() >= 1) api.award("fc_cram");
        if (Math.abs(num(P.S0) * Math.LN2 - 1) < 0.04) api.award("fc_halflife");
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C);
        const H = Hd(), xmax = H + 30;
        box = { x: 52, y: 30, w: w - 52 - 20, h: h - 30 - 52 };
        A = axes(ctx, C, box, [0, xmax], [0, 1], { nx: 6, ny: 4, yfmt: (v) => Math.round(v * 100) + "%", title: "Retention, exponential model R = e^(−Δt/S)", xlabel: "days since first learning" + (P.schedule === "custom" ? "  ·  click to add / remove a review" : "  ·  click to start a custom schedule"), ylabel: "retention", ylabelOffset: 34 });
        ctx.fillStyle = "rgba(255,255,255,0.03)"; ctx.fillRect(A.sx(H), box.y, A.sx(xmax) - A.sx(H), box.h);
        const curve = (ev, color, lw, dash) => {
          const pts = [];
          for (let i = 0; i < ev.length; i++) {
            const t0 = ev[i].t, t1 = i + 1 < ev.length ? ev[i + 1].t : xmax, steps = Math.max(2, Math.ceil(((t1 - t0) / xmax) * 300));
            for (let k = 0; k <= steps; k++) { const t = t0 + ((t1 - t0) * k) / steps; pts.push([A.sx(t), A.sy(Math.exp(-(t - t0) / ev[i].S))]); }
          }
          polyline(ctx, pts, color, lw, dash);
        };
        curve(run([]), C.muted, 1.2, [2, 4]);
        if (P.schedule !== "massed") curve(run(preset("massed", nR(), H)), "rgba(255,143,171,0.55)", 1.2, [6, 4]);
        const ev = run(reviewsOf(P.schedule).filter((t) => t <= H)); // same events the readouts use (reviews after the test don't count)
        curve(ev, C.primary, 2.4);
        ev.slice(1).forEach((e) => { const x = A.sx(e.t); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(x, box.y + box.h); ctx.lineTo(x - 5, box.y + box.h + 8); ctx.lineTo(x + 5, box.y + box.h + 8); ctx.closePath(); ctx.fill(); });
        vline(ctx, A.sx(H), box.y, box.y + box.h, C.accent, [5, 3], 1.5);
        const s = summary(P.schedule);
        // labels (y clamped inside the plot) and their bounding boxes, used to keep the legend clear of them
        const testTxt = `test: ${pct(s.test, 0)}`, afterTxt = `+30 d: ${pct(s.after, 0)}`;
        const ty = clamp(A.sy(s.test) - 6, box.y + 12, box.y + box.h - 4), ay = clamp(A.sy(s.after) - 8, box.y + 12, box.y + box.h - 4);
        ctx.font = "700 11px system-ui, sans-serif"; const tw = ctx.measureText(testTxt).width;
        ctx.font = "10px system-ui, sans-serif"; const aw = ctx.measureText(afterTxt).width;
        const rects = [{ x: A.sx(H) - 6, y: ty - 12, w: tw + 14, h: 16 }, { x: A.sx(H + 30) - 4 - aw - 2, y: ay - 11, w: aw + 4, h: 15 }];
        dot(ctx, A.sx(H), A.sy(s.test), 5, C.accent, C.bg);
        text(ctx, testTxt, A.sx(H) + 6, ty, C.accent, { size: 11, bold: true });
        dot(ctx, A.sx(H + 30), A.sy(s.after), 4, C.secondary);
        text(ctx, afterTxt, A.sx(H + 30) - 4, ay, C.secondary, { size: 10, align: "right" });
        const items = [{ color: C.primary, label: `this schedule (${P.schedule})` }, { color: "rgba(255,143,171,0.8)", dash: [6, 4], label: "massed, same # reviews" }, { color: C.muted, dash: [2, 4], label: "no review" }];
        ctx.font = "10px system-ui, sans-serif";
        const lw = 21 + Math.max(...items.map((it) => ctx.measureText(it.label).width)) + 6, lh = items.length * 15 + 4;
        const hits = (L) => rects.some((r) => L.x < r.x + r.w && L.x + L.w > r.x && L.y < r.y + r.h && L.y + L.h > r.y);
        const inside = (L) => L.x >= box.x + 2 && L.x + L.w <= box.x + box.w - 2;
        const cands = [
          { x: A.sx(H) - 14 - lw, y: box.y + box.h - lh - 4 }, { x: A.sx(H) - 14 - lw, y: box.y + 4 },
          { x: A.sx(H) + 8, y: box.y + 4 }, { x: A.sx(H) + 8, y: box.y + box.h - lh - 4 },
          { x: box.x + box.w - lw - 6, y: box.y + 4 }, { x: box.x + box.w - lw - 6, y: box.y + box.h - lh - 4 },
        ].map((c) => ({ x: c.x, y: c.y, w: lw, h: lh }));
        const L = cands.find((c) => inside(c) && !hits(c)) || cands.find((c) => !hits(c)) || cands[0];
        ctx.save(); ctx.globalAlpha = 0.6; roundRect(ctx, L.x - 4, L.y, L.w, L.h, 5, C.bg); ctx.restore();
        legend(ctx, C, L.x, L.y + 13, items, 10);
      }
      function readout() {
        const s = summary(P.schedule), S0 = num(P.S0, 1);
        api.readout({ "Schedule": P.schedule, "Reviews before test": s.n, "Retention on test day": pct(s.test, 1), "Retention 30 d after test": pct(s.after, 1), "Final stability S": fx(s.S, 1) + " d", "Half-life after last review": fx(s.S * Math.LN2, 1) + " d", "One-shot half-life S₀·ln2": fx(S0 * Math.LN2, 2) + " d" });
      }
      function renderHtml() {
        const names = ["none", "massed", "cram", "uniform", "expanding", "custom"];
        const rows = names.map((nm) => { const s = summary(nm); return [nm === P.schedule ? `<b style="color:${C.accent}">${nm}</b>` : nm, s.n, pct(s.test, 0), pct(s.after, 0), fx(s.S, 1) + " d"]; });
        api.html(tbl(["Schedule", "Reviews", "Test day", "30 d later", "Final S"], rows) + `<div style="color:${C.muted};font-size:.8rem;margin-top:6px">Model (illustrative, not fitted to data): R(t) = e^(−Δt/S) since the last study event — a common modern approximation (power functions often fit forgetting data better; Wixted &amp; Ebbesen, 1991). Ebbinghaus (1885) himself measured <i>savings</i> in relearning nonsense syllables and fitted b = 100k / ((log t)^c + k), with t in minutes, k ≈ 1.84, c ≈ 1.25. A review at retention R multiplies stability by 1 + G·(0.1 + (1 − R)), so reviewing just after learning (R ≈ 1) helps little, while letting memory fade a bit first helps a lot — a simplified version of the spacing/retrieval-difficulty effect used by spaced-repetition systems. Reviews are assumed to succeed. Presets use the 'Number of reviews' slider; custom uses your clicks (max 12, up to test day).</div>`);
      }
      function refresh(user) { if (user !== false) checks(); draw(); readout(); renderHtml(); }
      api.pointer(cv.canvas, {
        down(p) {
          if (!A || !box || p.x < box.x || p.x > box.x + box.w || p.y < box.y || p.y > box.y + box.h + 10) return;
          const t = clamp(A.ix(p.x), 0.05, Hd());
          if (P.schedule !== "custom") { custom = reviewsOf(P.schedule).slice(0, 12); custom.push(t); api.setParam("schedule", "custom"); return; }
          const near = custom.findIndex((c) => Math.abs(A.sx(c) - p.x) < 8);
          if (near >= 0) custom.splice(near, 1); else if (custom.length < 12) custom.push(t);
          refresh();
        },
      });
      api.onParam(() => refresh(true));
      api.onResize(draw);
      refresh(false);
      api.setStatus("Expanding reviews (yellow triangles) keep the curve high with few sessions. Click the timeline to design your own schedule.");
      return {
        clearCustom() { custom = []; if (P.schedule !== "custom") api.setParam("schedule", "custom"); else refresh(); },
        copyToCustom() { custom = reviewsOf(P.schedule).slice(0, 12); if (P.schedule !== "custom") api.setParam("schedule", "custom"); else refresh(); },
        destroy() {},
      };
    },
  });

  // ======================= 7. Psychophysics: Weber, Fechner, Stevens =======================
  const STEVENS = { brightness: 0.33, loudness: 0.67, length: 1.0, heaviness: 1.45, shock: 3.5 };
  S.register({
    id: "psych_psychophysics",
    name: "Psychophysics: Weber's Law & JND Staircase",
    domains: ["psychology", "neuroscience", "physics"],
    description: "Measure your own just-noticeable difference: which line (or patch) is bigger? A 1-up/2-down adaptive staircase homes in on the difference you detect 70.7 % of the time, giving your Weber fraction k = ΔI/I. Then compare Fechner's logarithmic law with Stevens' power law across sensory continua.",
    params: [
      { key: "modality", label: "JND stimulus", type: "select", value: "length", options: [{ value: "length", label: "Line length (px)" }, { value: "brightness", label: "Patch brightness (grey level)" }] },
      { key: "standard", label: "Standard magnitude I (px or grey level)", type: "range", min: 40, max: 220, step: 10, value: 120 },
      { key: "reversals", label: "Reversals to finish", type: "range", min: 6, max: 16, step: 1, value: 10 },
      { key: "preset", label: "Stevens continuum", type: "select", value: "brightness", options: [{ value: "brightness", label: "Brightness, 5° target in dark (a = 0.33)" }, { value: "loudness", label: "Loudness, 3000-Hz tone (a = 0.67)" }, { value: "length", label: "Visual length (a = 1.0)" }, { value: "heaviness", label: "Heaviness, lifted weights (a = 1.45)" }, { value: "shock", label: "Electric shock, 60 Hz (a = 3.5)" }, { value: "custom", label: "Custom (use slider)" }] },
      { key: "exponent", label: "Stevens exponent a", type: "range", min: 0.1, max: 3.5, step: 0.01, value: 0.33 },
    ],
    actions: [
      { label: "▶ Start staircase", fn: (h) => h.start() },
      { label: "■ Stop", fn: (h) => h.stop() },
      { label: "Clear results", fn: (h) => h.clearResults() },
    ],
    challenges: [
      { id: "pp_staircase", xp: 15, text: "Run a staircase to completion and read off your Weber fraction." },
      { id: "pp_weber", xp: 20, text: "Test Weber's law: measure k at two standards at least 2× apart (same stimulus type) and get Weber fractions within a factor of 1.5." },
      { id: "pp_shock", xp: 10, text: "Set the exponent to electric shock (3.5): doubling the current multiplies felt intensity by about 11. Why might that be adaptive?" },
      { id: "pp_fechner", xp: 15, text: "Find the Stevens exponent whose power curve best mimics Fechner's log law over I = 1…100." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 470 }), ctx = cv.ctx;
      const T = timers(), B = Buttons();
      let sc = null, phase = "idle", cur = null, fb = null, syncing = false;
      const results = [];
      const minD = (std) => 1 / Math.max(1, std), maxD = (std, mod) => (mod === "brightness" ? Math.max(minD(std), 255 / std - 1) : 1.0);
      function newSc() { const std = clamp(Math.round(num(P.standard, 120)), 10, 250); return { delta: 0.3, nC: 0, dir: 0, revs: [], track: [], std, mod: P.modality === "brightness" ? "brightness" : "length", target: clamp(Math.round(num(P.reversals, 10)), 4, 30), done: false }; }
      function estimate(s) { if (!s || s.revs.length < 2) return NaN; const use = s.revs.length >= 6 ? s.revs.slice(4) : s.revs.slice(2); if (!use.length) return NaN; return Math.exp(mean(use.map((v) => Math.log(Math.max(1e-6, v))))); }
      function makeTrial() {
        const std = sc.std, d = clamp(sc.delta, minD(std), maxD(std, sc.mod));
        let cvv = Math.max(std + 1, Math.round(std * (1 + d))); if (sc.mod === "brightness") cvv = Math.min(255, cvv);
        return { sv: std, cvv, eff: (cvv - std) / std, cmpLeft: Math.random() < 0.5, j: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5] };
      }
      function start() { T.clear(); sc = newSc(); fb = null; api.setStatus("Which stimulus is BIGGER (longer / brighter)? Click ← Left or Right → (or use the arrow keys)."); nextTrial(); }
      function stop() { T.clear(); if (phase !== "idle" && phase !== "done") phase = "idle"; draw(); readout(); }
      function nextTrial() {
        if (!sc || sc.done) return;
        phase = "fix"; cur = null; draw();
        T.after(400, () => { cur = makeTrial(); phase = "stim"; draw(); T.after(800, () => { if (phase === "stim") { phase = "resp"; draw(); } }); });
      }
      function answer(left) {
        if (!sc || !cur || (phase !== "stim" && phase !== "resp")) return;
        T.clear();
        const correct = left === cur.cmpLeft, f = sc.revs.length < 4 ? 1.4 : 1.15, std = sc.std;
        let rev = false;
        if (correct) { sc.nC++; if (sc.nC >= 2) { sc.nC = 0; if (sc.dir === 1) { sc.revs.push(cur.eff); rev = true; } sc.dir = -1; sc.delta = clamp(sc.delta / f, minD(std), maxD(std, sc.mod)); } }
        else { sc.nC = 0; if (sc.dir === -1) { sc.revs.push(cur.eff); rev = true; } sc.dir = 1; sc.delta = clamp(sc.delta * f, minD(std), maxD(std, sc.mod)); }
        sc.track.push({ d: cur.eff, correct, rev });
        if (sc.revs.length >= sc.target || sc.track.length >= 150) { finish(); return; }
        fb = { correct }; phase = "fb"; draw(); readout();
        T.after(350, nextTrial);
      }
      function finish() {
        sc.done = true; phase = "done"; const k = estimate(sc);
        if (Number.isFinite(k)) {
          results.push({ mod: sc.mod, std: sc.std, k, jnd: k * sc.std, trials: sc.track.length });
          api.award("pp_staircase");
          for (let i = 0; i < results.length; i++) for (let j = i + 1; j < results.length; j++) {
            const a = results[i], b = results[j];
            if (a.mod === b.mod && Math.max(a.std, b.std) / Math.min(a.std, b.std) >= 2 && Math.max(a.k, b.k) / Math.min(a.k, b.k) <= 1.5) api.award("pp_weber");
          }
          api.setStatus(`Done: Weber fraction k ≈ ${pct(k, 1)} → JND ≈ ${fx(k * sc.std, 1)} ${sc.mod === "length" ? "px" : "grey levels"} at I = ${sc.std}. Try a different standard to test Weber's law.`);
        }
        draw(); readout(); renderHtml();
      }
      function fechnerFit(a) { let s = 0, n = 0; for (let I = 1; I <= 100; I += 1) { const f = (100 * Math.log(I)) / Math.log(100), st = 100 * Math.pow(I / 100, a); s += (f - st) * (f - st); n++; } return Math.sqrt(s / n); }
      let bestA = 0.3, bestRms = Infinity;
      for (let a = 0.05; a <= 1.5001; a += 0.01) { const r = fechnerFit(a); if (r < bestRms) { bestRms = r; bestA = a; } }
      function drawGame(box) {
        const cx = box.x + box.w / 2, cy = box.y + box.h * 0.42;
        text(ctx, "Which is bigger?", box.x + 14, box.y + 18, C.text, { size: 13, bold: true });
        if (sc) text(ctx, `trial ${sc.track.length + (phase === "fb" || phase === "done" ? 0 : 1)} · reversals ${sc.revs.length}/${sc.target} · Δ = ${pct(sc.delta, 1)}`, box.x + box.w - 12, box.y + 18, C.muted, { size: 10, align: "right" });
        if (phase === "stim" && cur) {
          const lv = cur.cmpLeft ? cur.cvv : cur.sv, rv = cur.cmpLeft ? cur.sv : cur.cvv;
          if (sc.mod === "length") {
            const scale = Math.min(1, (box.w / 2 - 24) / (2 * sc.std));
            const draw1 = (xc, len, jx, jy) => { const L = len * scale, x = xc + jx * 16 - L / 2, y = cy + jy * box.h * 0.3; ctx.strokeStyle = C.text; ctx.lineWidth = 4; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L, y); ctx.stroke(); };
            draw1(box.x + box.w * 0.27, lv, cur.j[0], cur.j[1]); draw1(box.x + box.w * 0.73, rv, cur.j[2], cur.j[3]);
          } else {
            const s = Math.min(box.w * 0.3, box.h * 0.38);
            const patch = (xc, g) => { ctx.fillStyle = `rgb(${g},${g},${g})`; ctx.fillRect(xc - s / 2, cy - s / 2, s, s); };
            patch(box.x + box.w * 0.27, lv); patch(box.x + box.w * 0.73, rv);
          }
        } else {
          const msg = phase === "fix" ? "+" : phase === "resp" ? "Left or right — which was bigger?" : phase === "fb" && fb ? (fb.correct ? "✓" : "✗") : phase === "done" ? `Threshold: k ≈ ${pct(estimate(sc), 1)}` : "Press ▶ Start staircase (or click here)";
          text(ctx, msg, cx, cy, phase === "fb" && fb ? (fb.correct ? C.ok : C.danger) : phase === "fix" ? C.text : C.muted, { size: phase === "fix" || phase === "fb" ? 30 : 13, bold: true, align: "center", base: "middle" });
        }
        const bw = Math.min(140, box.w * 0.38), bh = 36, by = box.y + box.h - bh - 8, can = phase === "stim" || phase === "resp";
        B.add({ id: "L", x: cx - bw - 8, y: by, w: bw, h: bh, label: "← Left", disabled: !can });
        B.add({ id: "R", x: cx + 8, y: by, w: bw, h: bh, label: "Right →", disabled: !can });
        B.draw(ctx, C);
      }
      function drawStair(box) {
        const tr = sc ? sc.track : [], n = Math.max(20, tr.length), maxY = Math.max(35, ...tr.map((t) => t.d * 100 * 1.1));
        const A = axes(ctx, C, box, [0, n], [0, maxY], { nx: 4, ny: 3, title: "Staircase (1-up / 2-down → 70.7 %)", ylabel: "Δ (%)", ylabelOffset: 30, fs: 9 });
        polyline(ctx, tr.map((t, i) => [A.sx(i + 1), A.sy(t.d * 100)]), "rgba(255,255,255,0.35)", 1);
        tr.forEach((t, i) => { dot(ctx, A.sx(i + 1), A.sy(t.d * 100), 3, t.correct ? C.ok : C.danger); if (t.rev) dot(ctx, A.sx(i + 1), A.sy(t.d * 100), 6, null, C.accent); });
        const k = estimate(sc); if (Number.isFinite(k)) { hline(ctx, A.sy(k * 100), box.x, box.x + box.w, C.accent, [5, 3]); text(ctx, `k ≈ ${pct(k, 1)}`, box.x + box.w - 4, A.sy(k * 100) - 4, C.accent, { size: 10, align: "right", bold: true }); }
      }
      function drawLaws(box) {
        const a = clamp(num(P.exponent, 0.33), 0.05, 5);
        const A = axes(ctx, C, box, [0, 100], [0, 100], { nx: 4, ny: 2, title: "Perceived magnitude vs intensity", xlabel: "physical intensity I (relative)", ylabel: "sensation", ylabelOffset: 30, fs: 9 });
        const f = [], s = [], lin = [];
        for (let I = 1; I <= 100; I += 1) { f.push([A.sx(I), A.sy((100 * Math.log(I)) / Math.log(100))]); s.push([A.sx(I), A.sy(100 * Math.pow(I / 100, a))]); lin.push([A.sx(I), A.sy(I)]); }
        polyline(ctx, lin, "rgba(255,255,255,0.15)", 1, [3, 3]);
        polyline(ctx, f, C.series[4], 2); polyline(ctx, s, C.series[3], 2.2);
        legend(ctx, C, box.x + 8, box.y + 14, [{ color: C.series[4], label: "Fechner: S = k·ln(I/I₀)" }, { color: C.series[3], label: `Stevens: S = c·I^${fx(a, 2)}` }], 9);
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); B.reset();
        const Lw = Math.round(w * 0.55); vline(ctx, Lw, 10, h - 10, C.grid);
        drawGame({ x: 0, y: 4, w: Lw, h: h - 8 });
        const rx = Lw + 44, rw = w - rx - 14, hh = (h - 30) / 2;
        drawStair({ x: rx, y: 22, w: rw, h: hh - 36 });
        drawLaws({ x: rx, y: 22 + hh + 4, w: rw, h: hh - 40 });
      }
      function readout() {
        const a = clamp(num(P.exponent, 0.33), 0.05, 5), k = estimate(sc);
        api.readout({
          "Stimulus": (sc ? sc.mod : P.modality) === "length" ? "line length" : "brightness", "Standard I": sc ? sc.std : num(P.standard),
          "Trials": sc ? sc.track.length : 0, "Reversals": sc ? `${sc.revs.length} / ${sc.target}` : "—", "Current Δ": sc ? pct(sc.delta, 1) : "—",
          "Weber fraction k = ΔI/I": pct(k, 1), "JND = k·I": Number.isFinite(k) && sc ? fx(k * sc.std, 1) + ((sc.mod === "length") ? " px" : " grey lv") : "—",
          "Stevens a": fx(a, 2), "Doubling I multiplies S by": "× " + fx(Math.pow(2, a), 2), "Best Fechner-like a": fx(bestA, 2),
        });
      }
      function renderHtml() {
        const rows = results.map((r, i) => [i + 1, r.mod === "length" ? "line length" : "brightness", r.std, `<b style="color:${C.accent}">${pct(r.k, 1)}</b>`, fx(r.jnd, 1), r.trials]);
        api.html((rows.length ? tbl(["#", "Stimulus", "Standard I", "Weber k", "JND", "Trials"], rows) : "") + `<div style="color:${C.muted};font-size:.8rem;margin-top:6px">Weber's law: ΔI = k·I, so the JND grows in proportion to the standard (approximate textbook Weber fractions, e.g. Teghtsoonian, 1971: visual length ≈ 3 %, brightness ≈ 8 % — values depend strongly on method and conditions, and grey levels on a monitor are not luminance). The staircase makes Δ smaller after 2 consecutive correct answers and larger after 1 error, so it converges on the stimulus level answered correctly 70.7 % of the time (√0.5 = 0.707; Levitt, 1971 — a 1-up/3-down rule would target 79.4 %). Steps are multiplicative (×1.4 until 4 reversals, then ×1.15); the threshold is the geometric mean of the reversal levels after the first four (after the first two if the 150-trial cap stops a run with fewer than 6 reversals). Fechner integrated Weber's law into S = k·ln(I/I₀); Stevens' magnitude estimation instead found power laws S = c·I^a (Stevens, 1957, 1975) with a &lt; 1 (compressive: brightness of a 5° target in the dark ≈ 0.33, loudness of a 3000-Hz tone ≈ 0.67), a ≈ 1 for visual length, or a &gt; 1 (expansive: lifted weights ≈ 1.45, 60-Hz electric shock ≈ 3.5). Display caveats: lengths are rounded to whole pixels and grey levels to 0–255 (monitor gamma makes grey levels non-linear in luminance).</div>`);
      }
      function checks(key) {
        const a = num(P.exponent);
        if (a >= 3.4) api.award("pp_shock");
        if (key === "exponent" && fechnerFit(a) <= bestRms + 1.5) api.award("pp_fechner");
      }
      api.pointer(cv.canvas, {
        down(p) {
          const b = B.hit(p.x, p.y); if (b) { answer(b.id === "L"); return; }
          if ((phase === "idle" || phase === "done") && p.x < cv.width * 0.55) start();
        },
      });
      const unkey = keys(api, (e) => {
        if (phase !== "stim" && phase !== "resp") return false;
        const k = String(e.key || "");
        if (k === "ArrowLeft" || k === "f" || k === "F") { answer(true); return true; }
        if (k === "ArrowRight" || k === "j" || k === "J") { answer(false); return true; }
        return false;
      });
      api.onParam((key) => {
        if (syncing) return;
        if (key === "preset" && STEVENS[P.preset] != null) { syncing = true; api.setParam("exponent", STEVENS[P.preset]); syncing = false; checks("preset"); }
        else if (key === "exponent") { checks("exponent"); if (P.preset !== "custom" && STEVENS[P.preset] != null && Math.abs(STEVENS[P.preset] - num(P.exponent)) > 1e-9) { syncing = true; api.setParam("preset", "custom"); syncing = false; } }
        if ((key === "modality" || key === "standard") && sc && !sc.done && phase !== "idle") { T.clear(); phase = "idle"; api.setStatus("Stimulus changed — press ▶ Start staircase to measure at the new standard."); }
        draw(); readout();
      });
      api.onResize(draw);
      draw(); readout(); renderHtml();
      api.setStatus("Press ▶ Start staircase. Two lines flash for 0.8 s — pick the longer one. It gets harder as you succeed.");
      return { start, stop, clearResults() { results.length = 0; renderHtml(); }, destroy() { T.clear(); unkey(); } };
    },
  });

  // ======================= 8. Visual search (Treisman) =======================
  S.register({
    id: "psych_visual_search",
    name: "Visual Search: Feature vs Conjunction",
    domains: ["psychology", "neuroscience"],
    description: "Is there a red vertical bar? A simplified version of Treisman & Gelade's (1980) search paradigm (they used coloured letters and shapes). In feature search the target differs by colour alone and 'pops out'; in conjunction search it shares colour with some distractors and orientation with others. Your RT × set-size slopes (ms/item) reveal efficient (parallel-like) vs inefficient (serial-like) search.",
    params: [
      { key: "cond", label: "Search type", type: "select", value: "conjunction", options: [{ value: "feature", label: "Feature (red among green)" }, { value: "conjunction", label: "Conjunction (red vertical among green vertical + red horizontal)" }] },
      { key: "trials", label: "Trials per block", type: "range", min: 16, max: 96, step: 8, value: 40 },
      { key: "sizes", label: "Set sizes", type: "select", value: "large", options: [{ value: "large", label: "4, 8, 16, 32" }, { value: "small", label: "3, 6, 12, 24" }] },
      { key: "typical", label: "Show illustrative typical slopes", type: "toggle", value: true },
    ],
    actions: [
      { label: "▶ Start block", fn: (h) => h.start() },
      { label: "■ Stop", fn: (h) => h.stop() },
      { label: "Clear data", fn: (h) => h.clearData() },
    ],
    challenges: [
      { id: "vs_blocks", xp: 15, text: "Complete one feature block and one conjunction block." },
      { id: "vs_popout", xp: 15, text: "Show pop-out: get a feature-search target-present slope below 10 ms/item (≥ 12 correct present trials)." },
      { id: "vs_serial", xp: 20, text: "Show serial search: conjunction target-present slope above 10 ms/item, with the target-absent slope steeper still." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 470 }), ctx = cv.ctx;
      const T = timers(), B = Buttons(), COLS = 8, ROWS = 5, RED = "#ff4d4d", GREEN = "#3ddc6f";
      let phase = "idle", seq = [], idx = -1, items = [], cur = null, t0 = 0, fb = null, blockCond = "conjunction";
      const trials = [], blocksDone = { feature: 0, conjunction: 0 };
      const sizes = () => (P.sizes === "small" ? [3, 6, 12, 24] : [4, 8, 16, 32]);
      function buildSeq() {
        const n = clamp(Math.round(num(P.trials, 40)), 4, 400), ss = sizes(), out = [];
        for (let i = 0; i < n; i++) out.push({ n: ss[i % ss.length], present: Math.floor(i / ss.length) % 2 === 0 });
        return shuffle(out);
      }
      function makeItems(tr) {
        const cells = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i)).slice(0, Math.min(tr.n, COLS * ROWS));
        // conjunction: distractors split as evenly as possible between green-vertical (G) and red-horizontal (H), random remainder
        const nD = cells.length - (tr.present ? 1 : 0), dTypes = [];
        for (let i = 0; i < nD; i++) dTypes.push(blockCond === "feature" ? "G" : i < Math.floor(nD / 2) ? "G" : i < 2 * Math.floor(nD / 2) ? "H" : (Math.random() < 0.5 ? "G" : "H"));
        shuffle(dTypes);
        return cells.map((c, i) => ({ col: c % COLS, row: Math.floor(c / COLS), jx: (Math.random() - 0.5) * 0.5, jy: (Math.random() - 0.5) * 0.5, type: tr.present && i === 0 ? "T" : dTypes[tr.present ? i - 1 : i] }));
      }
      function start() { T.clear(); blockCond = P.cond === "feature" ? "feature" : "conjunction"; seq = buildSeq(); idx = -1; fb = null; api.setStatus("Is there a RED VERTICAL bar? Present = J / →, Absent = F / ←. Be fast but accurate."); next(); }
      function stop() { T.clear(); if (phase !== "idle" && phase !== "done") phase = "idle"; draw(); readout(); }
      function next() {
        idx++;
        if (idx >= seq.length) { finish(); return; }
        cur = seq[idx]; items = []; phase = "fix"; draw();
        T.after(500, () => { items = makeItems(cur); phase = "stim"; draw(); t0 = performance.now(); T.after(5000, () => { if (phase === "stim") respond(null); }); });
      }
      function respond(saysPresent) {
        if (phase !== "stim") return;
        T.clear();
        const rt = performance.now() - t0, correct = saysPresent !== null && saysPresent === cur.present;
        trials.push({ cond: blockCond, n: cur.n, present: cur.present, rt: saysPresent === null ? null : rt, correct });
        fb = { correct, rt, timeout: saysPresent === null, present: cur.present }; phase = "fb"; items = []; draw(); readout();
        T.after(correct ? 300 : 800, next);
      }
      function series(cond, present) {
        const ok = trimRT(trials.filter((t) => t.cond === cond && t.present === present && t.correct), (t) => t.n);
        const fit = linfit(ok.map((t) => t.n), ok.map((t) => t.rt));
        const byN = {}; ok.forEach((t) => { (byN[t.n] = byN[t.n] || []).push(t.rt); });
        return { n: ok.length, fit, means: Object.keys(byN).map((k) => [Number(k), mean(byN[k])]).sort((a, b) => a[0] - b[0]), distinct: Object.keys(byN).length };
      }
      function finish() {
        phase = "done"; blocksDone[blockCond]++;
        if (blocksDone.feature && blocksDone.conjunction) api.award("vs_blocks");
        const fP = series("feature", true), cP = series("conjunction", true), cA = series("conjunction", false);
        if (fP.n >= 12 && fP.distinct >= 2 && fP.fit.b < 10) api.award("vs_popout");
        if (cP.n >= 12 && cA.n >= 12 && cP.distinct >= 2 && cA.distinct >= 2 && cP.fit.b > 10 && cA.fit.b > cP.fit.b) api.award("vs_serial");
        const blk = trials.slice(-seq.length), acc = blk.length ? blk.filter((t) => t.correct).length / blk.length : NaN;
        api.setStatus(`Block done (${blockCond}): accuracy ${pct(acc, 0)}. Present slope ${fx(series(blockCond, true).fit.b, 1)} ms/item. Switch search type and run another block.`);
        draw(); readout(); renderHtml();
      }
      function drawBar(x, y, len, th, type) {
        ctx.fillStyle = type === "G" ? GREEN : RED;
        if (type === "H") ctx.fillRect(x - len / 2, y - th / 2, len, th); else ctx.fillRect(x - th / 2, y - len / 2, th, len);
      }
      function drawDisplay(box) {
        const cw = box.w / COLS, ch = box.h / ROWS, len = Math.min(cw, ch) * 0.55, th = Math.max(3, len * 0.26);
        if (phase === "stim") items.forEach((it) => drawBar(box.x + (it.col + 0.5 + it.jx) * cw, box.y + (it.row + 0.5 + it.jy) * ch, len, th, it.type));
        else {
          const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
          if (phase === "fix") text(ctx, "+", cx, cy, C.text, { size: 30, align: "center", base: "middle" });
          else if (phase === "fb" && fb) text(ctx, fb.timeout ? "too slow" : (fb.correct ? `✓ ${Math.round(fb.rt)} ms` : "✗ wrong") + ` — target was ${fb.present ? "present" : "absent"}`, cx, cy, fb.correct ? C.ok : C.danger, { size: 15, bold: true, align: "center", base: "middle" });
          else {
            text(ctx, "Find the target:", cx - 40, cy - 40, C.muted, { size: 13, align: "right", base: "middle" }); drawBar(cx - 20, cy - 40, 26, 7, "T");
            text(ctx, (P.cond === "feature" ? "among:" : "among:"), cx + 10, cy - 40, C.muted, { size: 13, base: "middle" }); drawBar(cx + 70, cy - 40, 26, 7, "G"); if (P.cond !== "feature") drawBar(cx + 100, cy - 40, 26, 7, "H");
            text(ctx, phase === "done" ? "Block complete — click to run another" : "Click here or ▶ Start block", cx, cy + 10, C.accent, { size: 13, bold: true, align: "center" });
          }
        }
      }
      function drawPlot(box) {
        const ss = sizes(), maxN = ss[ss.length - 1];
        const S4 = [["feature", true, C.series[3], [], "feature · present"], ["feature", false, C.series[5], [5, 3], "feature · absent"], ["conjunction", true, C.series[1], [], "conj. · present"], ["conjunction", false, C.series[2], [5, 3], "conj. · absent"]];
        const typ = { "feature|true": [450, 1], "feature|false": [480, 2], "conjunction|true": [500, 22], "conjunction|false": [530, 45] };
        const data = S4.map((s) => series(s[0], s[1]));
        let ymax = 1500; data.forEach((d) => d.means.forEach((m) => { ymax = Math.max(ymax, m[1] * 1.1); })); if (P.typical) ymax = Math.max(ymax, 530 + 45 * maxN + 50);
        ymax = Math.min(ymax, 6000);
        const A = axes(ctx, C, box, [0, maxN], [200, ymax], { nx: 4, ny: 4, title: "RT vs set size", xlabel: "set size (items)", ylabel: "RT (ms)", ylabelOffset: 34, fs: 9 });
        S4.forEach((s, i) => {
          const d = data[i], key = s[0] + "|" + s[1];
          if (d.n >= 2 && Number.isFinite(d.fit.b)) polyline(ctx, [[A.sx(0), A.sy(d.fit.a)], [A.sx(maxN), A.sy(d.fit.a + d.fit.b * maxN)]], s[2], 2, s[3]);
          else if (P.typical) { const t = typ[key]; polyline(ctx, [[A.sx(0), A.sy(t[0])], [A.sx(maxN), A.sy(t[0] + t[1] * maxN)]], s[2], 1.2, [2, 4]); }
          d.means.forEach((m) => dot(ctx, A.sx(m[0]), A.sy(m[1]), 3.5, s[2]));
        });
        legend(ctx, C, box.x + 6, box.y + 14, S4.map((s, i) => ({ color: s[2], dash: s[3], label: `${s[4]}: ${Number.isFinite(data[i].fit.b) ? fx(data[i].fit.b, 1) + " ms/item" : (P.typical ? "illustr. " + typ[s[0] + "|" + s[1]][1] : "—")}` })), 9);
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); B.reset();
        const Lw = Math.round(w * 0.6); vline(ctx, Lw, 10, h - 10, C.grid);
        const bh = clamp(h * 0.1, 28, 40);
        text(ctx, `${(phase === "idle" ? P.cond : blockCond) === "feature" ? "Feature" : "Conjunction"} search`, 14, 18, C.text, { size: 12, bold: true });
        if (seq.length && phase !== "idle") text(ctx, `${Math.min(seq.length, idx + 1)} / ${seq.length}`, Lw - 14, 18, C.muted, { size: 11, align: "right" });
        drawDisplay({ x: 14, y: 28, w: Lw - 28, h: h - 28 - bh - 22 });
        const bw = (Lw - 28 - 10) / 2;
        B.add({ id: "absent", x: 14, y: h - bh - 10, w: bw, h: bh, label: "← F · Absent", disabled: phase !== "stim", fill: "rgba(255,107,107,0.18)" });
        B.add({ id: "present", x: 24 + bw, y: h - bh - 10, w: bw, h: bh, label: "Present · J →", disabled: phase !== "stim", fill: "rgba(110,231,183,0.2)" });
        B.draw(ctx, C);
        drawPlot({ x: Lw + 46, y: 26, w: w - Lw - 60, h: h - 26 - 44 });
      }
      function readout() {
        const blk = idx >= 0 ? trials.slice(-Math.max(1, Math.min(trials.length, idx + (phase === "done" ? 0 : 1)))) : [];
        const o = { "Search type": (phase === "idle" ? P.cond : blockCond), "Trial": seq.length ? `${Math.min(seq.length, idx + 1)} / ${seq.length}` : "—", "Accuracy (block)": pct(blk.length ? blk.filter((t) => t.correct).length / blk.length : NaN, 0) };
        [["feature", true, "Feature present slope"], ["feature", false, "Feature absent slope"], ["conjunction", true, "Conj. present slope"], ["conjunction", false, "Conj. absent slope"]].forEach((s) => { const d = series(s[0], s[1]); o[s[2]] = Number.isFinite(d.fit.b) ? `${fx(d.fit.b, 1)} ms/item (n=${d.n})` : "—"; });
        api.readout(o);
      }
      function renderHtml() {
        const rows = [["feature", true], ["feature", false], ["conjunction", true], ["conjunction", false]].map(([c, p]) => { const d = series(c, p); return [c, p ? "present" : "absent", d.n, ms(d.fit.a), Number.isFinite(d.fit.b) ? fx(d.fit.b, 1) + " ms/item" : "—", d.means.map((m) => `${m[0]}: ${Math.round(m[1])}`).join(" · ") || "—"]; });
        api.html(tbl(["Search", "Target", "Correct trials", "Intercept", "Slope", "Mean RT by set size (ms)"], rows) + `<div style="color:${C.muted};font-size:.8rem;margin-top:6px">Feature Integration Theory (Treisman &amp; Gelade, 1980): single features are registered in parallel, so a uniquely coloured target pops out (slope ≈ 0–10 ms/item). Finding a conjunction requires focused attention to bind colour and orientation item by item — RT rises roughly linearly with set size (often ≈ 20–30 ms/item when the target is present), and absent trials (exhaustive search) are about twice as steep as present trials (self-terminating search). The dotted "typical" lines (feature ≈ 1–2, conjunction ≈ 22 / 45 ms/item) are illustrative values, not a specific dataset. Slopes are least-squares fits over your correct trials. ${RT_NOTE} Later work (Wolfe's Guided Search) shows the feature/conjunction split is a continuum, and many conjunction searches are more efficient than FIT originally predicted.</div>`);
      }
      api.pointer(cv.canvas, {
        down(p) {
          if (phase === "stim") { const b = B.hit(p.x, p.y); if (b) respond(b.id === "present"); }
          else if ((phase === "idle" || phase === "done") && p.x < cv.width * 0.6 && p.y < cv.height * 0.8) start();
        },
      });
      const unkey = keys(api, (e) => {
        if (phase !== "stim") return false; const k = String(e.key || "");
        if (k === "j" || k === "J" || k === "ArrowRight" || k === "p" || k === "P") { respond(true); return true; }
        if (k === "f" || k === "F" || k === "ArrowLeft" || k === "a" || k === "A") { respond(false); return true; }
        return false;
      });
      api.onParam(() => { draw(); readout(); });
      api.onResize(draw);
      draw(); readout(); renderHtml();
      api.setStatus("Press ▶ Start block. Dotted lines show illustrative typical slopes; your fitted lines replace them as data comes in.");
      return { start, stop, clearData() { T.clear(); trials.length = 0; blocksDone.feature = blocksDone.conjunction = 0; seq = []; idx = -1; phase = "idle"; draw(); readout(); renderHtml(); }, destroy() { T.clear(); unkey(); } };
    },
  });

  // ======================= 9. Mental rotation =======================
  const MR_CANDIDATES = [
    [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],           // F
    [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],           // L
    [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]],           // N
    [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]],           // P
    [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]],           // Y
    [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [3, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [1, 3], [0, 3]],
    [[0, 1], [1, 1], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2], [3, 2], [3, 3]],
    [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3], [1, 0]],
  ];
  const mrNorm = (cells) => { const mx = Math.min(...cells.map((c) => c[0])), my = Math.min(...cells.map((c) => c[1])); return cells.map((c) => [c[0] - mx, c[1] - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((c) => c.join(",")).join(";"); };
  const mrChiral = (cells) => { const m = mrNorm(cells.map(([x, y]) => [-x, y])); let r = cells; for (let i = 0; i < 4; i++) { if (mrNorm(r) === m) return false; r = r.map(([x, y]) => [-y, x]); } return true; };
  // A shape with 2- or 4-fold rotational symmetry would make the angular disparity ambiguous (e.g. 180° ≡ 0°): exclude it too.
  const mrRotSym = (cells) => { const n0 = mrNorm(cells); let r = cells; for (let i = 1; i < 4; i++) { r = r.map(([x, y]) => [-y, x]); if (mrNorm(r) === n0) return true; } return false; };
  const MR_SHAPES = MR_CANDIDATES.filter((c) => mrChiral(c) && !mrRotSym(c));
  S.register({
    id: "psych_mental_rotation",
    name: "Mental Rotation (Shepard & Metzler)",
    domains: ["psychology", "neuroscience"],
    description: "Are the two shapes the same object rotated, or mirror images? Answer as fast as you can. Shepard & Metzler (1971), using 3-D block figures, found reaction time grows linearly with the angle between them — as if you rotate a mental image at a constant speed. Here you judge flat 2-D shapes rotated in the picture plane (as in Cooper & Shepard, 1973); your RT = a + b·angle fit gives your own rotation rate in degrees per second.",
    params: [
      { key: "trials", label: "Trials per block", type: "range", min: 12, max: 72, step: 4, value: 28 },
      { key: "step", label: "Angle steps", type: "select", value: 45, options: [{ value: 45, label: "0°, 45°, … 180°" }, { value: 30, label: "0°, 30°, … 180°" }, { value: 60, label: "0°, 60°, … 180°" }] },
      { key: "pMirror", label: "Proportion mirror trials", type: "range", min: 0, max: 1, step: 0.05, value: 0.5 },
      { key: "complexity", label: "Shapes", type: "select", value: "simple", options: [{ value: "simple", label: "Pentominoes (5 squares)" }, { value: "complex", label: "Complex (6–7 squares)" }] },
    ],
    actions: [
      { label: "▶ Start block", fn: (h) => h.start() },
      { label: "■ Stop", fn: (h) => h.stop() },
      { label: "Clear data", fn: (h) => h.clearData() },
    ],
    challenges: [
      { id: "mr_block", xp: 15, text: "Complete a block with ≥ 80 % accuracy." },
      { id: "mr_linear", xp: 20, text: "Show the linear angle effect: positive slope with r ≥ 0.7 across your angle means (≥ 4 angles)." },
      { id: "mr_mirror", xp: 15, text: "Compare: are your correct 'mirror' responses slower than 'same' responses? (≥ 5 of each)" },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 470 }), ctx = cv.ctx;
      const T = timers(), B = Buttons();
      let phase = "idle", seq = [], idx = -1, cur = null, t0 = 0, fb = null;
      const trials = [], demo = { cells: MR_SHAPES[0] || MR_CANDIDATES[0], base: 0, rot: 90, mirror: false };
      const pool = () => { const s = MR_SHAPES.filter((c) => (P.complexity === "complex" ? c.length > 5 : c.length === 5)); return s.length ? s : (MR_SHAPES.length ? MR_SHAPES : MR_CANDIDATES); };
      function buildSeq() {
        const n = clamp(Math.round(num(P.trials, 28)), 2, 300), st = clamp(Math.round(num(P.step, 45)), 15, 90), angles = []; for (let a = 0; a <= 180; a += st) angles.push(a);
        const pm = clamp(num(P.pMirror, 0.5), 0, 1), nM = Math.round(n * pm), ps = pool(), out = [];
        for (let i = 0; i < n; i++) out.push({ cells: ps[randInt(ps.length)], angle: angles[i % angles.length], mirror: i < nM, base: 90 * randInt(4), sign: Math.random() < 0.5 ? -1 : 1 });
        // decorrelate mirror flag from angle
        const flags = shuffle(out.map((o) => o.mirror)); out.forEach((o, i) => { o.mirror = flags[i]; });
        return shuffle(out);
      }
      function start() { T.clear(); seq = buildSeq(); idx = -1; fb = null; api.setStatus("Same object (S / F) or mirror image (M / J)? Answer as fast as you can while staying accurate."); next(); }
      function stop() { T.clear(); if (phase !== "idle" && phase !== "done") phase = "idle"; draw(); readout(); }
      function next() {
        idx++;
        if (idx >= seq.length) { finish(); return; }
        cur = seq[idx]; phase = "fix"; draw();
        T.after(500, () => { phase = "stim"; draw(); t0 = performance.now(); T.after(8000, () => { if (phase === "stim") respond(null); }); });
      }
      function respond(saysMirror) {
        if (phase !== "stim") return;
        T.clear();
        const rt = performance.now() - t0, correct = saysMirror !== null && saysMirror === cur.mirror;
        trials.push({ angle: cur.angle, mirror: cur.mirror, rt: saysMirror === null ? null : rt, correct });
        fb = { correct, rt, timeout: saysMirror === null, mirror: cur.mirror }; phase = "fb"; draw(); readout();
        T.after(correct ? 300 : 900, next);
      }
      function analysis() {
        const kept = trimRT(trials.filter((t) => t.correct), (t) => (t.mirror ? "m" : "s") + t.angle);
        const same = kept.filter((t) => !t.mirror), mir = kept.filter((t) => t.mirror);
        const fit = linfit(same.map((t) => t.angle), same.map((t) => t.rt));
        const byA = (arr) => { const m = {}; arr.forEach((t) => { (m[t.angle] = m[t.angle] || []).push(t.rt); }); return Object.keys(m).map((k) => [Number(k), mean(m[k])]).sort((a, b) => a[0] - b[0]); };
        const sMeans = byA(same), mMeans = byA(mir), meanFit = linfit(sMeans.map((m) => m[0]), sMeans.map((m) => m[1]));
        return { same, mir, fit, sMeans, mMeans, meanFit, acc: trials.length ? trials.filter((t) => t.correct).length / trials.length : NaN };
      }
      function finish() {
        phase = "done"; const blk = trials.slice(-seq.length), acc = blk.length ? blk.filter((t) => t.correct).length / blk.length : NaN, an = analysis();
        if (acc >= 0.8) api.award("mr_block");
        if (an.sMeans.length >= 4 && an.meanFit.b >= 0.5 && an.meanFit.r >= 0.7) api.award("mr_linear");
        if (an.same.length >= 5 && an.mir.length >= 5) api.award("mr_mirror");
        const mDiff = an.same.length >= 5 && an.mir.length >= 5 ? mean(an.mir.map((t) => t.rt)) - mean(an.same.map((t) => t.rt)) : NaN;
        api.setStatus(`Block done: accuracy ${pct(acc, 0)}; slope ${fx(an.fit.b, 2)} ms/deg${an.fit.b > 0.05 ? ` → ≈ ${fx(1000 / an.fit.b, 0)} °/s` : ""}${Number.isFinite(mDiff) ? `; mirror − same = ${sgn(mDiff)} ms` : ""}.`);
        draw(); readout(); renderHtml();
      }
      function drawShape(cells, cx, cy, size, rotDeg, mirror, color) {
        const n = cells.length, gx = cells.reduce((s, c) => s + c[0] + 0.5, 0) / n, gy = cells.reduce((s, c) => s + c[1] + 0.5, 0) / n;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate((rotDeg * Math.PI) / 180); if (mirror) ctx.scale(-1, 1);
        cells.forEach(([x, y]) => { const px = (x - gx) * size, py = (y - gy) * size; ctx.fillStyle = color; ctx.fillRect(px, py, size, size); ctx.strokeStyle = C.bg; ctx.lineWidth = 2; ctx.strokeRect(px, py, size, size); });
        ctx.restore();
      }
      function drawTask(box) {
        const size = Math.min(box.w / 12, box.h / 7.5), cy = box.y + box.h * 0.45, xl = box.x + box.w * 0.27, xr = box.x + box.w * 0.73;
        if (phase === "stim" && cur) {
          drawShape(cur.cells, xl, cy, size, cur.base, false, C.primary);
          drawShape(cur.cells, xr, cy, size, cur.base + cur.sign * cur.angle, cur.mirror, C.primary);
        } else if (phase === "fix") text(ctx, "+", box.x + box.w / 2, cy, C.text, { size: 30, align: "center", base: "middle" });
        else if (phase === "fb" && fb) text(ctx, fb.timeout ? "too slow" : (fb.correct ? `✓ ${Math.round(fb.rt)} ms` : "✗ wrong") + ` — it was ${fb.mirror ? "a mirror image" : "the same shape"}`, box.x + box.w / 2, cy, fb.correct ? C.ok : C.danger, { size: 14, bold: true, align: "center", base: "middle" });
        else {
          drawShape(demo.cells, xl, cy, size * 0.8, demo.base, false, "rgba(124,156,255,0.55)");
          drawShape(demo.cells, xr, cy, size * 0.8, demo.base + demo.rot, demo.mirror, "rgba(124,156,255,0.55)");
          text(ctx, "Example: same shape rotated 90°", box.x + box.w / 2, cy + size * 3.2, C.muted, { size: 11, align: "center" });
          text(ctx, phase === "done" ? "Block complete — click to run another" : "Click here or ▶ Start block", box.x + box.w / 2, box.y + 22, C.accent, { size: 13, bold: true, align: "center" });
        }
      }
      function drawPlot(box) {
        const an = analysis();
        let ymax = 2500; an.sMeans.concat(an.mMeans).forEach((m) => { ymax = Math.max(ymax, m[1] * 1.1); }); ymax = Math.min(ymax, 9000);
        const A = axes(ctx, C, box, [0, 180], [0, ymax], { nx: 4, ny: 5, xfmt: (v) => Math.round(v) + "°", title: "RT vs angular disparity", xlabel: "rotation angle", ylabel: "RT (ms)", ylabelOffset: 34, fs: 9 });
        if (Number.isFinite(an.fit.b)) polyline(ctx, [[A.sx(0), A.sy(an.fit.a)], [A.sx(180), A.sy(an.fit.a + an.fit.b * 180)]], C.series[0], 2);
        else polyline(ctx, [[A.sx(0), A.sy(700)], [A.sx(180), A.sy(700 + 4 * 180)]], C.series[0], 1, [2, 4]);
        an.sMeans.forEach((m) => dot(ctx, A.sx(m[0]), A.sy(m[1]), 4, C.series[0]));
        an.mMeans.forEach((m) => dot(ctx, A.sx(m[0]), A.sy(m[1]), 3.5, null, C.series[1]));
        legend(ctx, C, box.x + 6, box.y + 14, [{ color: C.series[0], label: Number.isFinite(an.fit.b) ? `same: RT = ${Math.round(an.fit.a)} + ${fx(an.fit.b, 2)}·θ` : "illustrative: 700 + 4 ms/°" }, { color: C.series[1], label: "mirror trials (means)" }], 9);
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); B.reset();
        const Lw = Math.round(w * 0.58), bh = clamp(h * 0.1, 28, 40); vline(ctx, Lw, 10, h - 10, C.grid);
        text(ctx, "Same or mirror?", 14, 18, C.text, { size: 12, bold: true });
        if (seq.length && phase !== "idle") text(ctx, `${Math.min(seq.length, idx + 1)} / ${seq.length}`, Lw - 14, 18, C.muted, { size: 11, align: "right" });
        drawTask({ x: 0, y: 24, w: Lw, h: h - 24 - bh - 20 });
        const bw = (Lw - 38) / 2;
        B.add({ id: "same", x: 14, y: h - bh - 10, w: bw, h: bh, label: "S / F · Same", disabled: phase !== "stim", fill: "rgba(110,231,183,0.2)" });
        B.add({ id: "mirror", x: 24 + bw, y: h - bh - 10, w: bw, h: bh, label: "Mirror · M / J", disabled: phase !== "stim", fill: "rgba(255,143,171,0.2)" });
        B.draw(ctx, C);
        drawPlot({ x: Lw + 46, y: 26, w: w - Lw - 60, h: h - 26 - 44 });
      }
      function readout() {
        const an = analysis();
        api.readout({ "Trial": seq.length ? `${Math.min(seq.length, idx + 1)} / ${seq.length}` : "—", "Accuracy (all)": pct(an.acc, 0), "Correct same trials": an.same.length, "Intercept a": ms(an.fit.a), "Slope b": Number.isFinite(an.fit.b) ? fx(an.fit.b, 2) + " ms/deg" : "—", "Rotation rate 1000/b": an.fit.b > 0.05 ? fx(1000 / an.fit.b, 0) + " °/s" : "—", "Fit r (trials)": fx(an.fit.r, 2), "Mean RT same / mirror": `${ms(mean(an.same.map((t) => t.rt)))} / ${ms(mean(an.mir.map((t) => t.rt)))}` });
      }
      function renderHtml() {
        const an = analysis();
        const rows = an.sMeans.map((m) => { const mm = an.mMeans.find((x) => x[0] === m[0]); return [m[0] + "°", ms(m[1]), mm ? ms(mm[1]) : "—"]; });
        api.html((rows.length ? tbl(["Angle", "Mean RT same", "Mean RT mirror"], rows) : "") + `<div style="color:${C.muted};font-size:.8rem;margin-top:6px">Shepard &amp; Metzler (1971) used pairs of 3-D block figures and found RT rising linearly with angle at ≈ 60 °/s, for picture-plane and depth rotations alike. This game uses flat 2-D polyominoes rotated in the picture plane; such shapes and familiar letters are usually rotated considerably faster (Cooper &amp; Shepard, 1973, with letters — whose RT function was also somewhat curved near 0°). The dotted 700 + 4 ms/° line shown before you play is illustrative only. Only correct 'same' trials enter the fit, as in the classic analysis — mirror trials have no well-defined rotation angle (you must rotate and then still detect a mismatch). Angles are the shortest rotation (0–180°), presented clockwise or anticlockwise at random. ${RT_NOTE}</div>`);
      }
      api.pointer(cv.canvas, {
        down(p) {
          if (phase === "stim") { const b = B.hit(p.x, p.y); if (b) respond(b.id === "mirror"); }
          else if ((phase === "idle" || phase === "done") && p.x < cv.width * 0.58 && p.y < cv.height * 0.8) start();
        },
      });
      const unkey = keys(api, (e) => {
        if (phase !== "stim") return false; const k = String(e.key || "").toLowerCase();
        if (k === "s" || k === "f") { respond(false); return true; }
        if (k === "m" || k === "j") { respond(true); return true; }
        return false;
      });
      api.onParam(() => { draw(); readout(); });
      api.onResize(draw);
      draw(); readout(); renderHtml();
      api.setStatus("Press ▶ Start block. Decide whether the right shape is the left one rotated (same) or its mirror image.");
      return { start, stop, clearData() { T.clear(); trials.length = 0; seq = []; idx = -1; phase = "idle"; draw(); readout(); renderHtml(); }, destroy() { T.clear(); unkey(); } };
    },
  });

  // ======================= 10. Prospect theory =======================
  const PT_PROBLEMS = {
    asian_gain: { name: "Asian disease — gain frame", text: "An unusual disease is expected to kill 600 people. Two programmes have been proposed.", unit: "lives", ref: "Outcomes coded as lives SAVED (reference point: 600 die).",
      A: { desc: "Programme A: 200 people will be saved.", out: [[200, 1]] }, B: { desc: "Programme B: 1/3 probability that 600 people will be saved, 2/3 probability that nobody will be saved.", out: [[600, 1 / 3], [0, 2 / 3]] } },
    asian_loss: { name: "Asian disease — loss frame", text: "An unusual disease is expected to kill 600 people. Two programmes have been proposed.", unit: "lives", ref: "Outcomes coded as lives LOST (reference point: nobody dies).",
      A: { desc: "Programme C: 400 people will die.", out: [[-400, 1]] }, B: { desc: "Programme D: 1/3 probability that nobody will die, 2/3 probability that 600 people will die.", out: [[0, 1 / 3], [-600, 2 / 3]] } },
    certainty: { name: "Certainty effect", text: "Choose between:", unit: "$", ref: "Outcomes in dollars relative to current wealth. Kahneman & Tversky (1979, Problem 3, in Israeli pounds): 80 % chose the sure option.",
      A: { desc: "A: $3,000 for sure.", out: [[3000, 1]] }, B: { desc: "B: 80 % chance of $4,000, otherwise nothing.", out: [[4000, 0.8], [0, 0.2]] } },
    mixed: { name: "Mixed gamble (loss aversion)", text: "Would you accept a coin-flip bet?", unit: "$", ref: "Gains and losses relative to current wealth.",
      A: { desc: "A: Decline the bet (nothing happens).", out: [[0, 1]] }, B: { desc: "B: 50 % win $150, 50 % lose $100.", out: [[150, 0.5], [-100, 0.5]] } },
    lottery: { name: "Long-shot lottery", text: "Choose between:", unit: "$", ref: "Low-probability gain.",
      A: { desc: "A: $5 for sure.", out: [[5, 1]] }, B: { desc: "B: 0.1 % chance of $5,000, otherwise nothing.", out: [[5000, 0.001], [0, 0.999]] } },
    insurance: { name: "Insurance", text: "Choose between:", unit: "$", ref: "Low-probability loss.",
      A: { desc: "A: Pay a $5 premium for sure.", out: [[-5, 1]] }, B: { desc: "B: 0.1 % chance of losing $5,000, otherwise nothing.", out: [[-5000, 0.001], [0, 0.999]] } },
  };
  const ptV = (x, a, b, l) => (x >= 0 ? Math.pow(x, a) : -l * Math.pow(-x, b));
  const ptW = (p, g) => { if (p <= 0) return 0; if (p >= 1) return 1; const pg = Math.pow(p, g); return pg / Math.pow(pg + Math.pow(1 - p, g), 1 / g); };
  S.register({
    id: "psych_prospect_theory",
    name: "Prospect Theory & Framing",
    domains: ["psychology", "economics"],
    description: "Kahneman & Tversky's prospect theory (1979; cumulative version, Tversky & Kahneman, 1992): outcomes are valued as gains or losses from a reference point with an S-shaped value function (concave for gains, convex and steeper for losses), and probabilities are distorted by a weighting function. Defaults are the 1992 median estimates (α = β = 0.88, λ = 2.25, γ = 0.61, δ = 0.69). Make the choices yourself — including the famous Asian-disease framing problem (Tversky & Kahneman, 1981) — and compare with the model's predictions and expected value.",
    params: [
      { key: "problem", label: "Choice problem", type: "select", value: "asian_gain", options: Object.keys(PT_PROBLEMS).map((k) => ({ value: k, label: PT_PROBLEMS[k].name })) },
      { key: "alpha", label: "α — gain curvature", type: "range", min: 0.2, max: 1, step: 0.01, value: 0.88 },
      { key: "beta", label: "β — loss curvature", type: "range", min: 0.2, max: 1, step: 0.01, value: 0.88 },
      { key: "lambda", label: "λ — loss aversion", type: "range", min: 1, max: 4, step: 0.05, value: 2.25 },
      { key: "gamma", label: "γ — probability weighting (gains)", type: "range", min: 0.3, max: 1, step: 0.01, value: 0.61 },
      { key: "delta", label: "δ — probability weighting (losses)", type: "range", min: 0.3, max: 1, step: 0.01, value: 0.69 },
    ],
    actions: [
      { label: "Tversky–Kahneman 1992 values", fn: (h) => h.tk92() },
      { label: "Expected-value maximiser", fn: (h) => h.neutral() },
      { label: "Next problem", fn: (h) => h.nextProblem() },
    ],
    challenges: [
      { id: "pt_framing", xp: 15, text: "Answer both Asian-disease frames yourself. The options are numerically identical — did your choice flip with the wording?" },
      { id: "pt_neutral", xp: 10, text: "Turn the model into an expected-value maximiser (α = β = λ = γ = δ = 1). What happens to the framing effect?" },
      { id: "pt_lossav", xp: 20, text: "In the mixed gamble, find the loss aversion λ at which the model is just indifferent between accepting and declining." },
      { id: "pt_fourfold", xp: 15, text: "Fourfold pattern: show the model is risk-seeking for the long-shot lottery but risk-averse (buys insurance) for the small-probability loss." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 420 }), ctx = cv.ctx;
      const answers = {}, seen = { lottery: false, insurance: false };
      const prm = () => ({ a: clamp(num(P.alpha, 0.88), 0.05, 1.5), b: clamp(num(P.beta, 0.88), 0.05, 1.5), l: clamp(num(P.lambda, 2.25), 0.1, 10), g: clamp(num(P.gamma, 0.61), 0.2, 1.5), d: clamp(num(P.delta, 0.69), 0.2, 1.5) });
      const prob = () => PT_PROBLEMS[P.problem] || PT_PROBLEMS.asian_gain;
      // For prospects with at most one gain and one loss outcome, CPT reduces to Σ w±(p)·v(x).
      const value = (out, m) => out.reduce((s, [x, p]) => s + (x > 0 ? ptW(p, m.g) : x < 0 ? ptW(p, m.d) : 0) * ptV(x, m.a, m.b, m.l), 0);
      const ev = (out) => out.reduce((s, [x, p]) => s + x * p, 0);
      function evaluate() {
        const pr = prob(), m = prm(), VA = value(pr.A.out, m), VB = value(pr.B.out, m), scale = Math.max(1e-9, ...pr.A.out.concat(pr.B.out).map(([x]) => Math.abs(ptV(x, m.a, m.b, 1))));
        const diff = VA - VB, pred = Math.abs(diff) < 1e-6 * scale ? "indifferent" : diff > 0 ? "A" : "B";
        return { pr, m, VA, VB, EA: ev(pr.A.out), EB: ev(pr.B.out), pred, scale, diff };
      }
      function checks(user) {
        const E = evaluate(), m = E.m;
        if (user && [m.a, m.b, m.l, m.g, m.d].every((v) => Math.abs(v - 1) < 1e-9)) api.award("pt_neutral");
        if (P.problem === "mixed" && Math.abs(E.diff) < 0.02 * ptV(150, m.a, m.b, m.l)) api.award("pt_lossav");
        if (P.problem === "lottery" && E.pred === "B") seen.lottery = true;
        if (P.problem === "insurance" && E.pred === "A") seen.insurance = true;
        if (seen.lottery && seen.insurance) api.award("pt_fourfold");
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C);
        const E = evaluate(), m = E.m, outs = E.pr.A.out.concat(E.pr.B.out);
        const X = Math.max(10, ...outs.map(([x]) => Math.abs(x))) * 1.1;
        const ymax = Math.max(ptV(X, m.a, m.b, m.l), X * 0.15), ymin = Math.min(ptV(-X, m.a, m.b, m.l), -X * 0.15);
        const Lw = Math.round(w * 0.56);
        const b1 = { x: 56, y: 28, w: Lw - 70, h: h - 28 - 46 };
        const A = axes(ctx, C, b1, [-X, X], [ymin, ymax], { nx: 4, ny: 4, title: "Value function v(x)", xlabel: `outcome x (${E.pr.unit}) relative to reference point`, ylabel: "subjective value", ylabelOffset: 40, fs: 9 });
        vline(ctx, A.sx(0), b1.y, b1.y + b1.h, C.axis); hline(ctx, A.sy(0), b1.x, b1.x + b1.w, C.axis);
        const lin = [], vf = [];
        for (let i = 0; i <= 200; i++) { const x = -X + (2 * X * i) / 200; vf.push([A.sx(x), A.sy(ptV(x, m.a, m.b, m.l))]); if (x >= ymin && x <= ymax) lin.push([A.sx(x), A.sy(x)]); else lin.push([NaN, NaN]); }
        polyline(ctx, lin, "rgba(255,255,255,0.18)", 1, [4, 4]);
        polyline(ctx, vf, C.primary, 2.5);
        E.pr.A.out.forEach(([x]) => { if (x !== 0) dot(ctx, A.sx(x), A.sy(ptV(x, m.a, m.b, m.l)), 5, C.series[3], C.bg); });
        E.pr.B.out.forEach(([x]) => { if (x !== 0) dot(ctx, A.sx(x), A.sy(ptV(x, m.a, m.b, m.l)), 5, C.series[1], C.bg); });
        text(ctx, "gains", b1.x + b1.w - 6, A.sy(0) - 6, C.muted, { size: 10, align: "right" }); text(ctx, "losses", b1.x + 6, A.sy(0) + 14, C.muted, { size: 10 });
        legend(ctx, C, b1.x + 8, b1.y + 14, [{ color: C.primary, label: `v = x^${fx(m.a, 2)} (gains), −${fx(m.l, 2)}·(−x)^${fx(m.b, 2)} (losses)` }, { color: "rgba(255,255,255,0.4)", dash: [4, 4], label: "v = x (risk-neutral)" }], 9);
        const side = Math.max(80, Math.min(w - Lw - 60, h - 74));
        const b2 = { x: Lw + 44, y: 28, w: side, h: side };
        const W = axes(ctx, C, b2, [0, 1], [0, 1], { nx: 4, ny: 4, title: "Probability weighting w(p)", xlabel: "objective probability p", ylabel: "decision weight", ylabelOffset: 32, fs: 9 });
        polyline(ctx, [[W.sx(0), W.sy(0)], [W.sx(1), W.sy(1)]], "rgba(255,255,255,0.18)", 1, [4, 4]);
        const wp = [], wn = []; for (let i = 0; i <= 100; i++) { const p = i / 100; wp.push([W.sx(p), W.sy(ptW(p, m.g))]); wn.push([W.sx(p), W.sy(ptW(p, m.d))]); }
        polyline(ctx, wn, C.secondary, 1.6, [5, 3]); polyline(ctx, wp, C.accent, 2.2);
        outs.forEach(([x, p]) => { if (x !== 0 && p < 1) dot(ctx, W.sx(p), W.sy(ptW(p, x > 0 ? m.g : m.d)), 4.5, x > 0 ? C.accent : C.secondary, C.bg); });
        legend(ctx, C, b2.x + 6, b2.y + 14, [{ color: C.accent, label: `gains, γ = ${fx(m.g, 2)}` }, { color: C.secondary, dash: [5, 3], label: `losses, δ = ${fx(m.d, 2)}` }], 9);
      }
      function readout() {
        const E = evaluate(), m = E.m;
        api.readout({ "v(+100)": fx(ptV(100, m.a, m.b, m.l), 1), "v(−100)": fx(ptV(-100, m.a, m.b, m.l), 1), "w(0.01) / w(0.99)": `${fx(ptW(0.01, m.g), 3)} / ${fx(ptW(0.99, m.g), 3)}`, "EV of A / B": `${fx(E.EA, 1)} / ${fx(E.EB, 1)}`, "Prospect value A / B": `${fx(E.VA, 1)} / ${fx(E.VB, 1)}`, "Model predicts": E.pred === "indifferent" ? "indifferent" : `option ${E.pred}`, "EV-maximiser picks": Math.abs(E.EA - E.EB) < 1e-9 ? "indifferent (equal EV)" : E.EA > E.EB ? "option A" : "option B", "You chose": answers[P.problem] ? `option ${answers[P.problem]}` : "—" });
      }
      function renderHtml() {
        const E = evaluate(), pr = E.pr, you = answers[P.problem];
        const card = (k, o, V, EVv) => `<div style="flex:1;min-width:200px;border:1px solid ${E.pred === k ? C.accent : "rgba(255,255,255,.12)"};border-radius:10px;padding:8px 10px;background:${you === k ? "rgba(124,156,255,.12)" : "transparent"}"><div style="font-weight:600">${esc(o.desc)}</div><div style="color:${C.muted};font-size:.8rem;margin:4px 0">EV = ${fx(EVv, 1)} ${esc(pr.unit)} · prospect value V = ${fx(V, 1)}${E.pred === k ? ` · <b style="color:${C.accent}">model's choice</b>` : ""}</div><button class="sim-btn" type="button" data-choice="${k}">${you === k ? "✓ Chosen" : "I choose " + k}</button></div>`;
        let msg = "";
        if (answers.asian_gain && answers.asian_loss) {
          const flip = answers.asian_gain === "A" && answers.asian_loss === "B";
          msg = `<div style="margin-top:6px;color:${flip ? C.accent : C.ok}">${flip ? "You showed the classic framing reversal: safe when outcomes are described as lives saved, risky when described as lives lost — exactly as prospect theory predicts. Tversky &amp; Kahneman (1981) found 72 % chose A (vs 28 % B) in the gain frame, but 78 % chose D (vs 22 % C) in the loss frame." : answers.asian_gain === answers.asian_loss ? "You were frame-consistent: the same choice in both descriptions (A ≡ C and B ≡ D)." : "Interesting — you reversed in the opposite direction to the typical pattern."}</div>`;
        }
        const elx = api.html(`<div style="font-size:.88rem"><b style="color:${C.accent}">${esc(pr.name)}</b> — ${esc(pr.text)} <span style="color:${C.muted}">(${esc(pr.ref)})</span><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">${card("A", pr.A, E.VA, E.EA)}${card("B", pr.B, E.VB, E.EB)}</div>${msg}<div style="color:${C.muted};font-size:.8rem;margin-top:6px">V = Σ w(p)·v(x) with v(x) = x^α for gains and −λ(−x)^β for losses, and w(p) = p^γ / (p^γ + (1−p)^γ)^(1/γ) (Tversky &amp; Kahneman, 1992; δ replaces γ for losses). With at most one gain and one loss per option this equals cumulative prospect theory. Answered: ${Object.keys(answers).map((k) => `${esc(PT_PROBLEMS[k].name)} → ${answers[k]}`).join("; ") || "none yet"}.</div></div>`);
        elx.querySelectorAll("[data-choice]").forEach((b) => b.addEventListener("click", () => {
          answers[P.problem] = b.getAttribute("data-choice");
          if (answers.asian_gain && answers.asian_loss) api.award("pt_framing");
          renderHtml(); readout();
        }));
      }
      function refresh(user) { checks(user); draw(); readout(); renderHtml(); }
      api.onParam(() => refresh(true));
      api.onResize(draw);
      refresh(false);
      api.setStatus("Make your own choice below, then compare it with the model. Switch to the loss frame next.");
      return {
        tk92() { [["alpha", 0.88], ["beta", 0.88], ["lambda", 2.25], ["gamma", 0.61], ["delta", 0.69]].forEach(([k, v]) => api.setParam(k, v)); },
        neutral() { ["alpha", "beta", "lambda", "gamma", "delta"].forEach((k) => api.setParam(k, 1)); },
        nextProblem() { const ks = Object.keys(PT_PROBLEMS), i = ks.indexOf(P.problem); api.setParam("problem", ks[(i + 1) % ks.length]); },
        destroy() {},
      };
    },
  });

  // Pure model functions exposed read-only for headless numeric tests (no effect on the UI).
  try {
    Object.defineProperty(S, "_psychologyA", { value: Object.freeze({ zinv, Phi, erf, linfit, trimRT, rwRun, RW_DESIGNS, twoStore, fcPreset, fcRun, fcR, ptV, ptW, STEVENS, MR_SHAPES, mrChiral, mrRotSym }), configurable: true });
  } catch (e) { /* ignore */ }
})();
