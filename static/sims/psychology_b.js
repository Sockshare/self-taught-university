/* Self-Taught — Psychology simulations (set B)
 * Registers: psych_drift_diffusion, psych_asch_conformity, psych_big_five, psych_power_replication, psych_habituation,
 *            psych_exposure_therapy, psych_hicks_law, psych_muller_lyer, psych_nback, psych_sleep_two_process
 * Built against static/sims/core.js (see docs/CONTRACTS.md §3). Vanilla JS, no dependencies, no eval.
 */
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.SelfTaughtSims) { if (typeof console !== "undefined") console.error("[psychology_b sims] core.js must be loaded first"); return; }
  const S = window.SelfTaughtSims;
  const TAU = Math.PI * 2;

  // ======================= shared helpers =======================
  function makeRng(seed) { let a = (seed >>> 0) || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (Number.isFinite(+v) ? +v : (d || 0));
  const fx = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 2 : d) : "—");
  const pct = (v, d) => (Number.isFinite(v) ? (v * 100).toFixed(d == null ? 1 : d) + " %" : "—");
  const ms = (v) => (Number.isFinite(v) ? Math.round(v) + " ms" : "—");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const mean = (a) => (a && a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
  function variance(a) { if (!a || a.length < 2) return NaN; const m = mean(a); let s = 0; for (const x of a) s += (x - m) * (x - m); return s / (a.length - 1); }
  function gauss(rng) { let u = 0; while (u <= 1e-12) u = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rng()); }
  function text(ctx, s, x, y, color, o) { o = o || {}; ctx.fillStyle = color; ctx.font = (o.bold ? "700 " : "") + (o.size || 11) + "px system-ui, sans-serif"; ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic"; ctx.fillText(String(s), x, y); }
  function clearCanvas(ctx, w, h, C) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }
  function circle(ctx, x, y, r, fill, stroke, lw) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
  function line(ctx, x1, y1, x2, y2, color, lw, dash) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
  function polyline(ctx, pts, color, lw, dash) { if (!pts || pts.length < 2) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1.5; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  function roundRect(ctx, x, y, w, h, r, fill, stroke, lw) { r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
  function niceStep(range, count) { const raw = Math.abs(range) / Math.max(1, count); if (!(raw > 0) || !Number.isFinite(raw)) return 1; const p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; }
  /** Draws axes in box {x,y,w,h} for ranges xr=[min,max], yr=[min,max]; returns mapping {X, Y}. */
  function axes(ctx, C, box, xr, yr, o) {
    o = o || {};
    const x0 = xr[0], x1 = xr[1] === xr[0] ? xr[0] + 1 : xr[1], y0 = yr[0], y1 = yr[1] === yr[0] ? yr[0] + 1 : yr[1];
    const X = (v) => box.x + ((v - x0) / (x1 - x0)) * box.w, Y = (v) => box.y + box.h - ((v - y0) / (y1 - y0)) * box.h;
    ctx.save();
    const xs = o.xstep || niceStep(x1 - x0, o.xticks || 6), ys = o.ystep || niceStep(y1 - y0, o.yticks || 4);
    ctx.lineWidth = 1;
    for (let v = Math.ceil(y0 / ys - 1e-9) * ys; v <= y1 + 1e-9; v += ys) { ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(box.x, Y(v)); ctx.lineTo(box.x + box.w, Y(v)); ctx.stroke(); text(ctx, o.yfmt ? o.yfmt(v) : +v.toFixed(6), box.x - 4, Y(v) + 3, C.muted, { align: "right", size: 9 }); }
    for (let v = Math.ceil(x0 / xs - 1e-9) * xs; v <= x1 + 1e-9; v += xs) { ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(X(v), box.y); ctx.lineTo(X(v), box.y + box.h); ctx.stroke(); text(ctx, o.xfmt ? o.xfmt(v) : +v.toFixed(6), X(v), box.y + box.h + 11, C.muted, { align: "center", size: 9 }); }
    ctx.strokeStyle = C.axis; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
    if (o.xlabel) text(ctx, o.xlabel, box.x + box.w / 2, box.y + box.h + 24, C.muted, { align: "center", size: 10 });
    if (o.ylabel) { ctx.save(); ctx.translate(box.x - (o.ylabelOffset || 30), box.y + box.h / 2); ctx.rotate(-Math.PI / 2); text(ctx, o.ylabel, 0, 0, C.muted, { align: "center", size: 10 }); ctx.restore(); }
    if (o.title) text(ctx, o.title, box.x, box.y - 6, C.text, { bold: true, size: 11 });
    ctx.restore();
    return { X, Y };
  }
  // ---- statistics
  function erf(x) { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
  const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
  /** Inverse standard-normal CDF (Acklam's rational approximation, |error| < 1.2e-9). */
  function PhiInv(p) {
    if (!(p > 0)) return -8.3; if (!(p < 1)) return 8.3;
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425; let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  function lgamma(x) {
    const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1; let a = c[0]; const t = x + g + 0.5; for (let i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(TAU) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function betacf(a, b, x) {
    const FPMIN = 1e-300; const qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 3e-14) break;
    }
    return h;
  }
  /** Regularized incomplete beta I_x(a, b). */
  function ibeta(x, a, b) {
    if (!(x > 0)) return 0; if (!(x < 1)) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  /** Two-sided p for Student t with df degrees of freedom: p = I_{df/(df+t²)}(df/2, 1/2). */
  function tTwoP(t, df) { if (Number.isNaN(t) || !(df > 0)) return 1; if (!Number.isFinite(t)) return 0; return clamp(ibeta(df / (df + t * t), df / 2, 0.5), 0, 1); }
  /** Critical |t| for a two-sided test at level alpha (bisection on tTwoP). */
  function tCrit(alpha, df) { let lo = 0, hi = 60; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (tTwoP(m, df) > alpha) lo = m; else hi = m; } return (lo + hi) / 2; }
  /** Pooled-variance two-sample t-test. Returns {t, df, p, d}. */
  function tTest(a, b) {
    const n1 = a.length, n2 = b.length; if (n1 < 2 || n2 < 2) return { t: 0, df: 1, p: 1, d: 0 };
    const m1 = mean(a), m2 = mean(b), v1 = variance(a), v2 = variance(b), df = n1 + n2 - 2;
    const sp = Math.sqrt(Math.max(1e-12, ((n1 - 1) * v1 + (n2 - 1) * v2) / df)), t = (m2 - m1) / (sp * Math.sqrt(1 / n1 + 1 / n2));
    return { t, df, p: tTwoP(t, df), d: (m2 - m1) / sp };
  }
  function linfit(xs, ys) {
    const n = Math.min(xs.length, ys.length); if (n < 2) return null; const mx = mean(xs), my = mean(ys); let sxx = 0, sxy = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); syy += (ys[i] - my) ** 2; }
    if (sxx < 1e-12) return null; const b = sxy / sxx, a = my - b * mx; const r2 = syy > 1e-12 ? (sxy * sxy) / (sxx * syy) : 0; return { a, b, r2 };
  }
  /** Cyclic Jacobi eigenvalue algorithm for a symmetric matrix; returns eigenvalues sorted descending. */
  function jacobiEigen(A0) {
    const n = A0.length, A = A0.map((r) => r.slice());
    for (let sweep = 0; sweep < 80; sweep++) {
      let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
      if (off < 1e-14) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        const apq = A[p][q]; if (Math.abs(apq) < 1e-15) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * apq), t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      }
    }
    return A.map((r, i) => r[i]).sort((x, y) => y - x);
  }
  function corrMatrix(data, k) {
    const n = data.length, m = new Array(k).fill(0), sd = new Array(k).fill(0);
    for (const row of data) for (let j = 0; j < k; j++) m[j] += row[j];
    for (let j = 0; j < k; j++) m[j] /= Math.max(1, n);
    for (const row of data) for (let j = 0; j < k; j++) sd[j] += (row[j] - m[j]) ** 2;
    for (let j = 0; j < k; j++) sd[j] = Math.sqrt(sd[j]) || 1e-9;
    const R = []; for (let i = 0; i < k; i++) { R.push(new Array(k).fill(0)); }
    for (let i = 0; i < k; i++) for (let j = i; j < k; j++) { let s = 0; for (const row of data) s += (row[i] - m[i]) * (row[j] - m[j]); const r = i === j ? 1 : clamp(s / (sd[i] * sd[j]), -1, 1); R[i][j] = r; R[j][i] = r; }
    return R;
  }
  /** Delegated key listener scoped to a widget; ignores typing in form controls. Returns an unsubscribe fn. */
  function onKeys(handler) {
    if (typeof window === "undefined" || !window.addEventListener) return () => {};
    const fn = (e) => { const tg = e.target && e.target.tagName; if (tg === "INPUT" || tg === "SELECT" || tg === "TEXTAREA") return; try { if (handler(e) === true && e.preventDefault) e.preventDefault(); } catch (err) { console.error(err); } };
    window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn);
  }
  const now = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

  // ======================= 1. Drift-diffusion model =======================
  S.register({
    id: "psych_drift_diffusion",
    name: "Drift-Diffusion Decision Lab",
    domains: ["psychology", "neuroscience", "statistics"],
    description: "Ratcliff's (1978) drift-diffusion model of two-choice decisions (all data simulated). Evidence follows a Wiener process dX = v·dt + s·dW (Euler–Maruyama, dt = 1 ms; s = 0.1 is Ratcliff's scaling convention) from start point z·a (measured from the lower boundary) until it hits the upper boundary (defined as the 'correct' response) or the lower ('error') one; RT = decision time + non-decision time Ter. Closed forms: P(upper) = (1 − e^(−2v·za/s²)) / (1 − e^(−2v·a/s²)) and E[DT] = (a·P(upper) − za)/v. A negative v models a stimulus that favours the lower response. Trials unfinished after 10 s are counted as timeouts.",
    params: [
      { key: "v", label: "Drift rate v (evidence quality, units/s)", type: "range", min: -0.5, max: 0.5, step: 0.01, value: 0.25 },
      { key: "a", label: "Boundary separation a (caution)", type: "range", min: 0.04, max: 0.24, step: 0.005, value: 0.12 },
      { key: "z", label: "Start point z (fraction of a; 0.5 = unbiased)", type: "range", min: 0.1, max: 0.9, step: 0.01, value: 0.5 },
      { key: "s", label: "Within-trial noise s", type: "range", min: 0.05, max: 0.2, step: 0.005, value: 0.1 },
      { key: "ter", label: "Non-decision time Ter (ms)", type: "range", min: 100, max: 600, step: 10, value: 300 },
      { key: "speed", label: "Animation speed (× real time)", type: "range", min: 0.1, max: 2, step: 0.1, value: 0.5 },
    ],
    actions: [
      { label: "Run 1000 trials instantly", fn: (h) => h.batch(1000) },
      { label: "Pause / resume", fn: (h) => h.toggle() },
      { label: "Speed instructions (a = 0.07)", fn: (h) => h.preset("speed") },
      { label: "Accuracy instructions (a = 0.16)", fn: (h) => h.preset("acc") },
      { label: "Clear data", fn: (h) => h.clear() },
    ],
    challenges: [
      { id: "sat", xp: 20, text: "Speed–accuracy tradeoff: changing ONLY the boundary separation a (same v, z, s, Ter), collect ≥200 trials at a cautious boundary and ≥200 at a hasty one so accuracy differs by ≥8 points and mean RT by ≥80 ms (sessions are saved when you change a parameter)." },
      { id: "equal_rt", xp: 15, text: "With an unbiased start (z ≈ 0.5), show that correct and error RTs have the same mean (within 25 ms, ≥100 errors). Lower the drift to get errors faster." },
      { id: "fast_errors", xp: 15, text: "Produce 'fast errors' (error RT ≥40 ms faster than correct RT, ≥30 errors, positive drift) by moving only the start point. Which way must z move?" },
      { id: "chance", xp: 10, text: "Set the drift to 0: show that P(upper response) then equals the start point z (≥300 trials, within 6 points)." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 470 }), ctx = cv.ctx, rng = api.random;
      const DT = 0.001, TMAX = 10.0, MAXACTIVE = 6, XMAX = 1500;
      let corr = [], err = [], timeouts = 0, active = [], done = [], paused = false, sessions = [], lastChk = 0;
      const pr = () => ({ a: clamp(num(P.a, 0.12), 0.01, 1), s: Math.max(0.01, num(P.s, 0.1)), v: num(P.v, 0), z: clamp(num(P.z, 0.5), 0.01, 0.99), ter: Math.max(0, num(P.ter, 300)) });
      function predicted() {
        const { a, s, v, z, ter } = pr(), x0 = z * a; let pu, et;
        if (Math.abs(v) < 1e-6) { pu = z; et = x0 * (a - x0) / (s * s); }
        else { const k = -2 * v / (s * s); pu = k * a > 600 ? Math.exp(k * (x0 - a)) : Math.expm1(k * x0) / Math.expm1(k * a); pu = clamp(pu, 0, 1); et = (a * pu - x0) / v; }
        return { acc: pu, rt: et * 1000 + ter };
      }
      function newPath() { const { a, z } = pr(); return { x: z * a - a / 2, t: 0, pts: [[0, z * a - a / 2]], resp: null }; }
      function stepPath(p, steps) {
        const { a, s, v } = pr(), sq = s * Math.sqrt(DT), hb = a / 2;
        for (let i = 0; i < steps; i++) {
          p.x += v * DT + sq * gauss(rng); p.t += DT;
          if ((Math.round(p.t / DT) % 4) === 0) p.pts.push([p.t, p.x]);
          if (p.x >= hb) { p.x = hb; p.resp = 1; break; }
          if (p.x <= -hb) { p.x = -hb; p.resp = 0; break; }
          if (p.t >= TMAX) { p.resp = -1; break; }
        }
        if (p.resp !== null) p.pts.push([p.t, p.x]);
      }
      function record(p) { const rt = p.t * 1000 + pr().ter; if (p.resp === 1) corr.push(rt); else if (p.resp === 0) err.push(rt); else timeouts++; }
      function stats() { const n = corr.length + err.length; return { n, acc: n ? corr.length / n : NaN, mc: mean(corr), me: mean(err), all: mean(corr.concat(err)) }; }
      function checks() {
        const st = stats(), { v, z } = pr();
        if (Math.abs(z - 0.5) <= 0.021 && err.length >= 100 && corr.length >= 100 && Math.abs(st.mc - st.me) < 25) api.award("equal_rt");
        // start-point bias produces fast errors only when z sits nearer the error (lower) boundary and v > 0
        if (v > 0 && z < 0.5 && err.length >= 30 && corr.length >= 30 && st.me <= st.mc - 40) api.award("fast_errors");
        if (Math.abs(v) <= 0.005 && st.n >= 300 && Math.abs(st.acc - z) < 0.06) api.award("chance");
        const cur = pr(), cand = sessions.slice(); if (st.n >= 200) cand.push({ v, a: cur.a, s: cur.s, z: cur.z, ter: cur.ter, acc: st.acc, rt: st.all });
        const same = (A, B) => Math.abs(A.v - B.v) <= 0.011 && Math.abs(A.s - B.s) < 1e-9 && Math.abs(A.z - B.z) < 1e-9 && Math.abs(A.ter - B.ter) < 1e-9;
        for (let i = 0; i < cand.length; i++) for (let j = 0; j < cand.length; j++) {
          const A = cand[i], B = cand[j]; if (i === j || !same(A, B) || !(A.a > B.a)) continue; // only a may differ
          if (A.acc - B.acc >= 0.08 && A.rt - B.rt >= 80) api.award("sat");
        }
      }
      function saveSession() { const st = stats(), c = pr(); if (st.n >= 200) { sessions.push({ v: c.v, a: c.a, s: c.s, z: c.z, ter: c.ter, acc: st.acc, rt: st.all }); if (sessions.length > 12) sessions.shift(); } }
      function clearData() { corr = []; err = []; timeouts = 0; active = []; done = []; }
      function batch(n) { for (let i = 0; i < n; i++) { const p = newPath(); p.pts = null; const { a, s, v } = pr(), sq = s * Math.sqrt(DT), hb = a / 2; while (true) { p.x += v * DT + sq * gauss(rng); p.t += DT; if (p.x >= hb) { p.resp = 1; break; } if (p.x <= -hb) { p.resp = 0; break; } if (p.t >= TMAX) { p.resp = -1; break; } } record(p); } checks(); draw(); }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H) return; clearCanvas(ctx, W, H, C);
        const { a, z, ter } = pr(), L = 78, R = Math.max(W * 0.66, W - 250), top = 22, bot = H - 30, hh = (bot - top) * 0.26, mid = { y: top + hh, h: (bot - top) - 2 * hh };
        const X = (t) => L + (t / XMAX) * (R - L), hb = a / 2, Ym = (x) => mid.y + mid.h / 2 - (x / Math.max(1e-9, hb)) * (mid.h / 2);
        // Ter band
        ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(L, top, X(ter) - L, bot - top);
        text(ctx, "Ter " + Math.round(ter) + " ms", L + 4, mid.y + mid.h / 2 + 4, C.muted, { size: 10 });
        // grid + time axis
        for (let t = 0; t <= XMAX; t += 250) { line(ctx, X(t), top, X(t), bot, C.grid); text(ctx, t, X(t), bot + 12, C.muted, { align: "center", size: 9 }); }
        text(ctx, "response time (ms)", (L + R) / 2, bot + 25, C.muted, { align: "center", size: 10 });
        // boundaries
        line(ctx, L, Ym(hb), R, Ym(hb), C.ok, 2); line(ctx, L, Ym(-hb), R, Ym(-hb), C.danger, 2);
        line(ctx, X(ter), Ym(z * a - hb), R, Ym(z * a - hb), C.axis, 1, [3, 4]);
        text(ctx, "upper: correct", L - 4, Ym(hb) + 3, C.ok, { align: "right", size: 9 }); text(ctx, "lower: error", L - 4, Ym(-hb) + 3, C.danger, { align: "right", size: 9 }); text(ctx, "z", X(ter) - 4, Ym(z * a - hb) + 3, C.axis, { align: "right", size: 10 });
        // histograms
        const bw = 30, nb = Math.ceil(XMAX / bw), hc = new Array(nb).fill(0), he = new Array(nb).fill(0);
        corr.forEach((r) => { const b = Math.floor(r / bw); if (b >= 0 && b < nb) hc[b]++; }); err.forEach((r) => { const b = Math.floor(r / bw); if (b >= 0 && b < nb) he[b]++; });
        const mx = Math.max(1, ...hc, ...he);
        for (let b = 0; b < nb; b++) {
          const x = X(b * bw), w = Math.max(1, X((b + 1) * bw) - x - 1);
          if (hc[b]) { const h = (hc[b] / mx) * (hh - 6); ctx.fillStyle = "rgba(110,231,183,0.7)"; ctx.fillRect(x, mid.y - 2 - h, w, h); }
          if (he[b]) { const h = (he[b] / mx) * (hh - 6); ctx.fillStyle = "rgba(255,107,107,0.7)"; ctx.fillRect(x, mid.y + mid.h + 2, w, h); }
        }
        const st = stats();
        if (Number.isFinite(st.mc)) line(ctx, X(st.mc), top, X(st.mc), mid.y, C.ok, 1.5, [4, 3]);
        if (Number.isFinite(st.me)) line(ctx, X(st.me), mid.y + mid.h, X(st.me), bot, C.danger, 1.5, [4, 3]);
        text(ctx, "correct RTs (" + corr.length + ")", R - 4, top + 10, C.ok, { align: "right", size: 10 });
        text(ctx, "error RTs (" + err.length + ")", R - 4, bot - 4, C.danger, { align: "right", size: 10 });
        // paths
        ctx.save(); ctx.beginPath(); ctx.rect(L, mid.y - 1, R - L, mid.h + 2); ctx.clip();
        done.forEach((p, i) => polyline(ctx, p.pts.map((q) => [X(q[0] * 1000 + ter), Ym(q[1])]), p.resp === 1 ? "rgba(110,231,183," + (0.15 + 0.5 * i / Math.max(1, done.length)) + ")" : "rgba(255,107,107," + (0.2 + 0.6 * i / Math.max(1, done.length)) + ")", 1));
        active.forEach((p, i) => polyline(ctx, p.pts.concat([[p.t, p.x]]).map((q) => [X(q[0] * 1000 + ter), Ym(q[1])]), C.series[i % C.series.length], 1.6));
        ctx.restore();
        // right panel: SAT plot
        const bx = { x: R + 52, y: top + 18, w: W - R - 64, h: (bot - top) * 0.55 };
        if (bx.w > 60) {
          const m = axes(ctx, C, bx, [300, 1100], [0.4, 1], { title: "Speed–accuracy (sessions)", xlabel: "mean RT (ms)", ylabel: "accuracy", yfmt: (v) => Math.round(v * 100) + "%", xstep: 200, ystep: 0.2 });
          const pts = sessions.map((s2) => [m.X(clamp(s2.rt, 300, 1100)), m.Y(clamp(s2.acc, 0.4, 1))]);
          sessions.forEach((s2, i) => circle(ctx, pts[i][0], pts[i][1], 4, C.series[4], null));
          if (st.n >= 20) circle(ctx, m.X(clamp(st.all, 300, 1100)), m.Y(clamp(st.acc, 0.4, 1)), 5, C.accent, C.text, 1);
          const pd = predicted(); circle(ctx, m.X(clamp(pd.rt, 300, 1100)), m.Y(clamp(pd.acc, 0.4, 1)), 5, null, C.accent, 1.5);
          let y = bx.y + bx.h + 40; text(ctx, "● current   ○ predicted", bx.x, y, C.accent, { size: 10 }); y += 14;
          text(ctx, "● saved sessions", bx.x, y, C.series[4], { size: 10 }); y += 18;
          text(ctx, paused ? "⏸ paused" : "▶ simulating", bx.x, y, C.muted, { size: 10 });
        }
        const pd = predicted();
        api.readout({ "Simulated trials": st.n + (timeouts ? ` (+${timeouts} timeouts >10 s, excluded)` : ""), "P(upper = correct): sim / closed form": pct(st.acc) + " / " + pct(pd.acc), "Mean RT correct": ms(st.mc), "Mean RT error": ms(st.me), "Mean RT (closed form)": ms(pd.rt), "Saved sessions": sessions.length });
      }
      api.onParam((k) => { if (k === "speed") return; saveSession(); clearData(); draw(); });
      api.onResize(draw);
      api.loop((dt) => {
        if (!paused) {
          const steps = Math.max(1, Math.min(400, Math.round((dt * clamp(num(P.speed, 0.5), 0.05, 5)) / DT)));
          while (active.length < MAXACTIVE) active.push(newPath());
          active.forEach((p) => stepPath(p, steps));
          active = active.filter((p) => { if (p.resp !== null) { record(p); if (p.resp >= 0) { done.push(p); if (done.length > 14) done.shift(); } return false; } return true; });
          if (now() - lastChk > 250) { lastChk = now(); checks(); }
        }
        draw();
      });
      api.setStatus("Simulated observer. Green = upper (correct) boundary, red = lower (error). Press 'Run 1000 trials' to fill the RT histograms quickly.");
      batch(400);
      return {
        batch(n) { batch(n); },
        toggle() { paused = !paused; draw(); },
        clear() { clearData(); draw(); },
        preset(kind) { api.setParam("a", kind === "speed" ? 0.07 : 0.16); batch(600); },
        destroy() {},
      };
    },
  });

  // ======================= 2. Asch conformity =======================
  // % conforming (erroneous) responses on critical trials vs majority size. APPROXIMATE values compiled from Asch (1951, 1955, 1956);
  // reports differ slightly (e.g. majority of 3: 31.8% in Asch 1955 vs ≈33% in the 1951 table). x = 16 stands for Asch's largest majorities.
  const ASCH = [[1, 3.6], [2, 13.6], [3, 31.8], [4, 35.1], [8, 32.0], [16, 31.2]];
  S.register({
    id: "psych_asch_conformity",
    name: "Asch Conformity: Line Judgement & Social Impact",
    domains: ["psychology", "game_theory"],
    description: "Take part in a simulated Asch (1951, 1956) line-judgement study: computer 'confederates' answer before you and, on 12 of 18 trials, they are unanimously wrong. Then switch to 'Population model' to fit Latané's (1981) social impact law I = s·N^t (t < 1; t ≈ 0.5 is a commonly cited estimate) against approximate Asch conformity-vs-majority-size data. Model curves and the cohort are simulated, not data.",
    params: [
      { key: "mode", label: "Mode", type: "select", value: "play", options: [{ value: "play", label: "Play: line judgement" }, { value: "population", label: "Population model (social impact)" }] },
      { key: "n", label: "Number of confederates N", type: "range", min: 1, max: 15, step: 1, value: 6 },
      { key: "dissenter", label: "One confederate dissents (true partner)", type: "toggle", value: false },
      { key: "t", label: "Impact exponent t (Latané: t < 1, often ≈ 0.5)", type: "range", min: 0.05, max: 1.2, step: 0.05, value: 0.5 },
      { key: "s", label: "Impact strength s", type: "range", min: 0.2, max: 12, step: 0.1, value: 2 },
      { key: "mu", label: "Mean resistance threshold μ", type: "range", min: 0, max: 14, step: 0.1, value: 4 },
      { key: "indep", label: "Resolute independents (never yield, %)", type: "range", min: 0, max: 80, step: 5, value: 25 },
    ],
    actions: [
      { label: "Start / restart session", fn: (h) => h.restart() },
      { label: "Answer A", fn: (h) => h.answer(0) },
      { label: "Answer B", fn: (h) => h.answer(1) },
      { label: "Answer C", fn: (h) => h.answer(2) },
      { label: "Re-run simulated cohort", fn: (h) => h.cohort() },
    ],
    challenges: [
      { id: "play_full", xp: 15, text: "Complete all 18 trials of the line-judgement session (12 are critical)." },
      { id: "fit_asch", xp: 20, text: "Population model: tune t, s, μ and independents until the model fits the (approximate) Asch data with RMSE ≤ 5 percentage points." },
      { id: "dissenter_effect", xp: 15, text: "Population model with N ≥ 3: switch on a single dissenter and make modelled conformity collapse to ≤ 12% from ≥ 25% (Asch 1955: a truthful partner cut errors to about a quarter, ≈ 5.5%)." },
      { id: "diminishing", xp: 10, text: "Find settings where going from 4 to 15 confederates adds less than 5 points of conformity (diminishing marginal impact)." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 470 }), ctx = cv.ctx, rng = api.random;
      const CRIT = new Set([2, 3, 5, 6, 8, 9, 10, 11, 13, 14, 16, 17]), NTRIALS = 18, REVEAL = 0.45;
      let g = null, cohortRes = null, clock = 0, hit = [];
      const N = () => clamp(Math.round(num(P.n, 6)), 1, 15);
      function makeTrial(i) {
        const L = 6 + rng() * 16, others = [L * (0.72 + rng() * 0.1), L * (1.18 + rng() * 0.14)], lines = [L, others[0], others[1]];
        for (let k = 2; k > 0; k--) { const j = Math.floor(rng() * (k + 1)); [lines[k], lines[j]] = [lines[j], lines[k]]; }
        const correct = lines.indexOf(L), wrongs = [0, 1, 2].filter((k) => k !== correct), crit = CRIT.has(i);
        const groupAns = crit ? wrongs[Math.floor(rng() * 2)] : correct;
        const n = N(), answers = []; for (let c = 0; c < n; c++) answers.push(crit && P.dissenter && c === 0 ? correct : groupAns);
        return { L, lines, correct, crit, groupAns, answers, shown: 0, t: 0, you: null, phase: "reveal", resultT: 0 };
      }
      function restart() { g = { i: 0, trial: makeTrial(0), log: [], finished: false }; clock = 0; draw(); }
      function answer(k) {
        if (P.mode !== "play" || !g || g.finished) return; const tr = g.trial; if (tr.phase !== "answer") return;
        tr.you = k; tr.phase = "result"; tr.resultT = 0;
        g.log.push({ crit: tr.crit, correct: k === tr.correct, conformed: tr.crit && k === tr.groupAns, dissent: !!P.dissenter, n: tr.answers.length });
        draw();
      }
      function playStats() { const crit = g ? g.log.filter((r) => r.crit) : []; const conf = crit.filter((r) => r.conformed).length; const neutralErr = g ? g.log.filter((r) => !r.crit && !r.correct).length : 0; return { crit: crit.length, conf, rate: crit.length ? conf / crit.length : NaN, neutralErr }; }
      // ---- population model
      function model(n, dissent) { const t = num(P.t, 0.5), s = num(P.s, 2), mu = num(P.mu, 4), f = clamp(num(P.indep, 25) / 100, 0, 1), U = dissent ? 0.25 : 1; return (1 - f) * Phi((s * U * Math.pow(n, t) - mu) / Math.SQRT2); }
      function rmse() { let e = 0; ASCH.forEach(([n, p]) => { e += (100 * model(n, false) - p) ** 2; }); return Math.sqrt(e / ASCH.length); }
      function cohort() {
        // 123 simulated participants (Asch 1956) × 12 critical trials; threshold θ_i ~ N(μ, 1), trial noise ε ~ N(0, 1).
        const t = num(P.t, 0.5), s = num(P.s, 2), mu = num(P.mu, 4), f = clamp(num(P.indep, 25) / 100, 0, 1), n = N(), U = P.dissenter ? 0.25 : 1, imp = s * U * Math.pow(n, t);
        let yields = 0, never = 0, total = 0; const r = makeRng(Math.floor(rng() * 1e9));
        for (let i = 0; i < 123; i++) { const indep = r() < f, th = mu + gauss(r); let y = 0; for (let k = 0; k < 12; k++) { total++; if (!indep && imp + gauss(r) > th) { y++; yields++; } } if (!y) never++; }
        cohortRes = { rate: yields / total, never: never / 123, n, dissent: !!P.dissenter };
      }
      function checks() {
        if (P.mode !== "population") return;
        if (rmse() <= 5) api.award("fit_asch");
        if (P.dissenter && N() >= 3 && model(N(), true) <= 0.12 && model(N(), false) >= 0.25) api.award("dissenter_effect");
        if (model(15, false) - model(4, false) < 0.05 && model(4, false) > 0.1) api.award("diminishing");
      }
      function drawPlay(W, H) {
        if (!g) restart(); const tr = g.trial, n = tr.answers.length;
        text(ctx, `Trial ${Math.min(g.i + 1, NTRIALS)} / ${NTRIALS}` + (g.finished ? " — session complete" : ""), 14, 20, C.text, { bold: true, size: 13 });
        // seats
        const seats = n + 1, sw = Math.min(56, (W - 40) / seats);
        for (let c = 0; c < seats; c++) {
          const x = 20 + sw * (c + 0.5), y = 56, you = c === n, ans = you ? tr.you : (c < tr.shown ? tr.answers[c] : null);
          circle(ctx, x, y, Math.min(14, sw * 0.32), you ? C.accent : (P.dissenter && c === 0 ? C.series[3] : C.series[0]), null);
          text(ctx, you ? "You" : "C" + (c + 1), x, y + 26, you ? C.accent : C.muted, { align: "center", size: 9 });
          if (ans !== null && ans !== undefined) { roundRect(ctx, x - 10, y - 36, 20, 16, 4, "rgba(255,255,255,0.9)"); text(ctx, "ABC"[ans], x, y - 24, "#0f1222", { align: "center", bold: true, size: 11 }); }
        }
        // card
        const cy = 100, ch = H - cy - 34, cw = W - 40; roundRect(ctx, 20, cy, cw, ch, 10, "#f4f1e8"); const unit = (ch - 50) / 30, base = cy + ch - 26;
        const sx = 20 + cw * 0.2; line(ctx, sx, base, sx, base - tr.L * unit, "#111", 5); text(ctx, "Standard", sx, base + 16, "#333", { align: "center", size: 11, bold: true });
        hit = [];
        tr.lines.forEach((L, k) => {
          const x = 20 + cw * (0.5 + k * 0.17), sel = tr.you === k, showRes = tr.phase === "result" || g.finished;
          if (sel) roundRect(ctx, x - 24, base - L * unit - 10, 48, L * unit + 34, 6, "rgba(124,156,255,0.25)");
          line(ctx, x, base, x, base - L * unit, showRes && k === tr.correct ? "#0a7d4f" : "#111", 5);
          text(ctx, "ABC"[k], x, base + 16, "#333", { align: "center", size: 13, bold: true });
          hit.push({ x0: x - 30, x1: x + 30, y0: cy, y1: cy + ch, k });
        });
        const st = playStats();
        if (tr.phase === "answer") text(ctx, "Your turn: which line matches the standard? Click it (or press A/B/C).", W / 2, H - 12, C.accent, { align: "center", size: 12, bold: true });
        else if (tr.phase === "reveal") text(ctx, "The group is answering…", W / 2, H - 12, C.muted, { align: "center", size: 12 });
        else if (!g.finished) text(ctx, tr.you === tr.correct ? (tr.crit ? "You resisted the majority ✔" : "Correct ✔") : (tr.crit && tr.you === tr.groupAns ? "You went with the majority" : "Incorrect"), W / 2, H - 12, tr.you === tr.correct ? C.ok : C.secondary, { align: "center", size: 12, bold: true });
        if (g.finished) { roundRect(ctx, W / 2 - 190, cy + 20, 380, 74, 10, "rgba(15,18,34,0.92)"); text(ctx, `Conformed on ${st.conf} of ${st.crit} critical trials (${pct(st.rate, 0)})`, W / 2, cy + 48, C.accent, { align: "center", bold: true, size: 14 }); text(ctx, "Asch (1956, N = 123): ≈37% of critical responses conformed (≈32% often quoted);", W / 2, cy + 68, C.text, { align: "center", size: 11 }); text(ctx, "≈25% never conformed; ≈75% conformed at least once.", W / 2, cy + 84, C.text, { align: "center", size: 11 }); }
      }
      function drawPop(W, H) {
        const box = { x: 58, y: 34, w: W - 300, h: H - 80 }, m = axes(ctx, C, box, [0, 16], [0, 1], { title: "Conformity rate on critical trials vs. majority size", xlabel: "number of confederates N", ylabel: "% conforming responses", yfmt: (v) => Math.round(v * 100) + "%", xstep: 2, ystep: 0.2 });
        const pts = [], ptsD = []; for (let n = 1; n <= 16; n += 0.25) { pts.push([m.X(n), m.Y(model(n, false))]); ptsD.push([m.X(n), m.Y(model(n, true))]); }
        polyline(ctx, pts, C.primary, 2.5); polyline(ctx, ptsD, C.series[3], 2, [6, 4]);
        ASCH.forEach(([n, p]) => { circle(ctx, m.X(n), m.Y(p / 100), 5, C.accent, "#000", 1); });
        if (cohortRes) circle(ctx, m.X(cohortRes.n), m.Y(cohortRes.rate), 6, null, cohortRes.dissent ? C.series[3] : C.secondary, 2.5);
        line(ctx, m.X(N()), box.y, m.X(N()), box.y + box.h, C.axis, 1, [2, 4]);
        const lx = box.x + box.w + 18; let y = box.y + 8;
        const leg = [[C.primary, "model: unanimous majority"], [C.series[3], "model: one dissenter (impact ×0.25, assumed)"], [C.accent, "Asch data 1951–56 (approx.)"], [C.secondary, "simulated cohort (123 virtual people)"]];
        leg.forEach(([c, l]) => { ctx.fillStyle = c; ctx.fillRect(lx, y - 8, 12, 4); text(ctx, l, lx + 18, y - 3, C.text, { size: 10 }); y += 18; });
        y += 8; text(ctx, "P(yield) = (1−f)·Φ((s·N^t − μ)/√2)", lx, y, C.muted, { size: 10 }); y += 16;
        text(ctx, "RMSE vs Asch: " + fx(rmse(), 1) + " pp", lx, y, rmse() <= 5 ? C.ok : C.text, { size: 12, bold: true }); y += 18;
        if (cohortRes) { text(ctx, `Cohort at N=${cohortRes.n}: ${pct(cohortRes.rate, 0)} yields`, lx, y, C.text, { size: 10 }); y += 14; text(ctx, `never yielded: ${pct(cohortRes.never, 0)} (Asch ≈ 25%)`, lx, y, C.text, { size: 10 }); y += 14; text(ctx, "(simulated, not data)", lx, y, C.muted, { size: 9 }); }
      }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H) return; clearCanvas(ctx, W, H, C);
        if (P.mode === "population") drawPop(W, H); else drawPlay(W, H);
        const st = playStats(), n = N();
        api.readout(P.mode === "population"
          ? { "Model @ N": pct(model(n, !!P.dissenter), 1), "Model @ N=1 / 3 / 15": `${pct(model(1, false), 0)} / ${pct(model(3, false), 0)} / ${pct(model(15, false), 0)}`, "RMSE vs Asch (approx. data)": fx(rmse(), 1) + " pp", "Simulated cohort never yielded": cohortRes ? pct(cohortRes.never, 0) : "—" }
          : { "Critical trials done": st.crit + " / 12", "Conformed": st.conf, "Your conformity rate": pct(st.rate, 0), "Errors on neutral trials": st.neutralErr, "Asch mean (approx.)": "≈32–37 %" });
      }
      api.pointer(cv.canvas, { down(pt) { if (P.mode !== "play") return; const h = hit.find((b) => pt.x >= b.x0 && pt.x <= b.x1 && pt.y >= b.y0 && pt.y <= b.y1); if (h) answer(h.k); } });
      const offKeys = onKeys((e) => { const k = String(e.key || "").toLowerCase(); const idx = { a: 0, b: 1, c: 2, "1": 0, "2": 1, "3": 2 }[k]; if (idx !== undefined && P.mode === "play" && g && g.trial.phase === "answer") { answer(idx); return true; } return false; });
      api.onParam((k) => { if (k === "n" || (k === "dissenter" && P.mode === "play")) { if (g && !g.finished && g.trial.phase === "reveal" && g.trial.shown === 0) g.trial = makeTrial(g.i); } cohort(); checks(); draw(); });
      api.onResize(draw);
      api.loop((dt) => {
        clock += dt;
        if (P.mode === "play" && g && !g.finished) {
          const tr = g.trial; tr.t += dt;
          if (tr.phase === "reveal") { tr.shown = Math.min(tr.answers.length, Math.floor(tr.t / REVEAL)); if (tr.shown >= tr.answers.length && tr.t > REVEAL * (tr.answers.length + 0.5)) tr.phase = "answer"; }
          else if (tr.phase === "result") { tr.resultT += dt; if (tr.resultT > 1.1) { g.i++; if (g.i >= NTRIALS) { g.finished = true; api.award("play_full"); api.emit("asch_session", playStats()); } else g.trial = makeTrial(g.i); } }
        }
        draw();
      });
      restart(); cohort(); draw();
      api.setStatus("Play mode: confederates answer first; then it's your turn. Switch Mode to explore the social-impact model.");
      return { restart() { api.setParam("mode", "play"); restart(); }, answer, cohort() { cohort(); draw(); }, destroy() { offKeys(); } };
    },
  });

  // ======================= 3. Big Five psychometrics =======================
  const OCEAN = ["O", "C", "E", "A", "N"], OCEAN_NAMES = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"];
  const TIPI = [ // Gosling, Rentfrow & Swann (2003) Ten-Item Personality Inventory: [text, factor index, reversed]
    ["Extraverted, enthusiastic", 2, false], ["Critical, quarrelsome", 3, true], ["Dependable, self-disciplined", 1, false], ["Anxious, easily upset", 4, false], ["Open to new experiences, complex", 0, false],
    ["Reserved, quiet", 2, true], ["Sympathetic, warm", 3, false], ["Disorganized, careless", 1, true], ["Calm, emotionally stable", 4, true], ["Conventional, uncreative", 0, true]];
  // Approximate means from Gosling, Rentfrow & Swann (2003; US student sample): O 5.38, C 5.40, E 4.44, A 5.23, Emotional Stability 4.83.
  // TIPI measures Emotional Stability (items 4R, 9); this widget displays its inverse, Neuroticism = 8 − ES, to keep the OCEAN labels.
  const TIPI_NORMS = [5.38, 5.40, 4.44, 5.23, 8 - 4.83];
  S.register({
    id: "psych_big_five",
    name: "Big Five Psychometrics Lab",
    domains: ["psychology", "statistics"],
    description: "Simulated respondents answer a hypothetical 20-item Big Five (OCEAN) inventory (1–5 scale) generated from true factor loadings plus noise. Inspect the item correlation heatmap, the scree plot (Jacobi eigenvalues of the correlation matrix, with Kaiser's eigenvalue > 1 rule and Horn's parallel analysis) and Cronbach's α = k/(k−1)·(1 − Σσ²ᵢ/σ²_total) per scale (reverse-keyed items rescored as 6 − x). Then take the published 10-item TIPI (Gosling, Rentfrow & Swann 2003; 7-point scale, items 2, 4, 6, 8, 10 reverse-scored as 8 − x) and see your radar profile.",
    params: [
      { key: "n", label: "Respondents N", type: "range", min: 30, max: 2000, step: 10, value: 400 },
      { key: "noise", label: "Item noise (unique SD)", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 0.8 },
      { key: "rev", label: "Reverse-keyed items (of 20)", type: "range", min: 0, max: 10, step: 1, value: 5 },
      { key: "rescore", label: "Reverse-score keyed items before α", type: "toggle", value: true },
      { key: "factcorr", label: "Modest factor intercorrelations (illustrative)", type: "toggle", value: true },
      { key: "view", label: "Canvas", type: "select", value: "psychometrics", options: [{ value: "psychometrics", label: "Heatmap + scree + α" }, { value: "profile", label: "My TIPI profile (radar)" }] },
    ],
    actions: [{ label: "New sample", fn: (h) => h.resample() }, { label: "Show my profile", fn: (h) => h.profile() }],
    challenges: [
      { id: "five_factors", xp: 15, text: "Get a clean solution: exactly 5 eigenvalues > 1 (Kaiser) and every scale α ≥ 0.70." },
      { id: "reverse_trap", xp: 15, text: "Turn off reverse-scoring with ≥2 reverse-keyed items per scale and watch α collapse below 0.40 for some scale." },
      { id: "noise_breaks", xp: 10, text: "Raise the item noise (above the default 0.8) until parallel analysis retains fewer than 5 factors." },
      { id: "quiz_done", xp: 10, text: "Answer all 10 TIPI items and view your radar profile against the norms." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 480 }), ctx = cv.ctx;
      const K = 20; let seed = 7, R = null; const quiz = new Array(10).fill(4), touched = new Set();
      const loadings = (() => { const r = makeRng(99); return Array.from({ length: K }, () => 0.55 + 0.3 * r()); })();
      const FC = [[1, 0, 0.2, 0.1, -0.1], [0, 1, 0.1, 0.2, -0.25], [0.2, 0.1, 1, 0.1, -0.2], [0.1, 0.2, 0.1, 1, -0.2], [-0.1, -0.25, -0.2, -0.2, 1]];
      function chol(M) { const n = M.length, L = M.map(() => new Array(n).fill(0)); for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) { let s = M[i][j]; for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k]; L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-9)) : s / L[j][j]; } return L; }
      const LC = chol(FC);
      function revSet(r) { const order = []; for (const pos of [3, 1, 2, 0]) for (let f = 0; f < 5; f++) order.push(f * 4 + pos); return new Set(order.slice(0, clamp(Math.round(r), 0, 10))); }
      function compute() {
        const n = clamp(Math.round(num(P.n, 400)), 10, 5000), noise = clamp(num(P.noise, 0.8), 0.01, 10), rv = revSet(num(P.rev, 5)), rng = makeRng(seed);
        const data = [];
        for (let i = 0; i < n; i++) {
          const zf = OCEAN.map(() => gauss(rng)), F = P.factcorr ? LC.map((row) => row.reduce((s, l, k) => s + l * zf[k], 0)) : zf, row = new Array(K);
          for (let j = 0; j < K; j++) { const f = Math.floor(j / 4), sg = rv.has(j) ? -1 : 1, lat = sg * loadings[j] * F[f] + noise * gauss(rng); row[j] = clamp(Math.round(3 + 1.1 * lat / Math.sqrt(loadings[j] ** 2 + noise * noise)), 1, 5); }
          data.push(row);
        }
        const Rm = corrMatrix(data, K), eig = jacobiEigen(Rm);
        // parallel analysis (Horn 1965): retain factors whose observed eigenvalue exceeds the MEAN eigenvalue of the same rank
        // from 3 random-normal datasets of identical n × k (a small number of replications, for speed)
        const pa = new Array(K).fill(0), pr = makeRng(seed + 1000);
        for (let rep = 0; rep < 3; rep++) { const rd = []; for (let i = 0; i < n; i++) { const r = new Array(K); for (let j = 0; j < K; j++) r[j] = gauss(pr); rd.push(r); } jacobiEigen(corrMatrix(rd, K)).forEach((e, j) => { pa[j] += e / 3; }); }
        const alpha = OCEAN.map((_, f) => {
          const items = [0, 1, 2, 3].map((q) => f * 4 + q), cols = items.map((j) => data.map((r) => (P.rescore && rv.has(j) ? 6 - r[j] : r[j])));
          const tot = data.map((_, i) => cols.reduce((s, c) => s + c[i], 0)), sv = cols.reduce((s, c) => s + (variance(c) || 0), 0), tv = variance(tot);
          return tv > 1e-9 ? (4 / 3) * (1 - sv / tv) : NaN;
        });
        let kaiser = eig.filter((e) => e > 1).length, par = 0; while (par < K && eig[par] > pa[par]) par++;
        R = { Rm, eig, pa, alpha, kaiser, par, rv, n };
        const revPerScale = OCEAN.map((_, f) => [0, 1, 2, 3].filter((q) => rv.has(f * 4 + q)).length);
        if (kaiser === 5 && alpha.every((a) => a >= 0.7)) api.award("five_factors");
        if (!P.rescore && alpha.some((a, f) => revPerScale[f] >= 2 && a < 0.4)) api.award("reverse_trap");
        if (par < 5 && noise > 0.8 + 1e-9) api.award("noise_breaks");
        draw();
      }
      function quizScores() { const s = [0, 0, 0, 0, 0]; TIPI.forEach(([, f, r], i) => { s[f] += (r ? 8 - quiz[i] : quiz[i]) / 2; }); return s; }
      function drawPsy(W, H) {
        const hs = Math.min(H - 70, W * 0.44), cell = hs / K, ox = 40, oy = 34;
        text(ctx, "Item correlation matrix (raw responses)", ox, oy - 14, C.text, { bold: true });
        for (let i = 0; i < K; i++) for (let j = 0; j < K; j++) {
          const r = R.Rm[i][j], a = Math.min(1, Math.abs(r)); ctx.fillStyle = r >= 0 ? `rgba(124,156,255,${a})` : `rgba(255,143,171,${a})`; ctx.fillRect(ox + j * cell, oy + i * cell, cell - 0.5, cell - 0.5);
        }
        for (let f = 0; f < 5; f++) { ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.strokeRect(ox + f * 4 * cell + 0.5, oy + f * 4 * cell + 0.5, 4 * cell, 4 * cell); text(ctx, OCEAN[f], ox - 6, oy + (f * 4 + 2) * cell + 4, C.series[f], { align: "right", bold: true, size: 11 }); }
        for (let j = 0; j < K; j++) if (R.rv.has(j)) text(ctx, "R", ox + (j + 0.5) * cell, oy + hs + 10, C.secondary, { align: "center", size: 8 });
        text(ctx, "blue r>0 · pink r<0 · R = reverse-keyed", ox, oy + hs + 24, C.muted, { size: 9 });
        const rx = ox + hs + 70, rw = W - rx - 16;
        if (rw < 80) return;
        const sbox = { x: rx, y: oy, w: rw, h: (H - oy) * 0.46 };
        const m = axes(ctx, C, sbox, [0.5, 10.5], [0, Math.max(4, Math.ceil(R.eig[0]))], { title: "Scree plot (first 10 eigenvalues)", ylabel: "eigenvalue", xstep: 1, yticks: 4, ylabelOffset: 24 });
        line(ctx, sbox.x, m.Y(1), sbox.x + sbox.w, m.Y(1), C.danger, 1, [4, 4]); text(ctx, "Kaiser = 1", sbox.x + sbox.w - 4, m.Y(1) - 3, C.danger, { align: "right", size: 9 });
        polyline(ctx, R.pa.slice(0, 10).map((e, i) => [m.X(i + 1), m.Y(e)]), C.series[3], 1.5, [5, 3]);
        polyline(ctx, R.eig.slice(0, 10).map((e, i) => [m.X(i + 1), m.Y(e)]), C.primary, 2);
        R.eig.slice(0, 10).forEach((e, i) => circle(ctx, m.X(i + 1), m.Y(e), 3.5, i < R.par ? C.accent : C.primary));
        text(ctx, "— parallel analysis", sbox.x + sbox.w - 4, sbox.y + 12, C.series[3], { align: "right", size: 9 });
        const ay = sbox.y + sbox.h + 40; text(ctx, "Cronbach's α per scale (4 items each)", rx, ay, C.text, { bold: true });
        OCEAN.forEach((f, i) => {
          const y = ay + 14 + i * ((H - ay - 20) / 5), a = R.alpha[i], bx0 = rx + 104, bw = Math.max(20, rw - 140);
          text(ctx, OCEAN_NAMES[i], rx, y + 9, C.series[i], { size: 10 }); ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fillRect(bx0, y, bw, 10);
          if (Number.isFinite(a) && a > 0) { ctx.fillStyle = a >= 0.7 ? C.ok : a >= 0.5 ? C.accent : C.danger; ctx.fillRect(bx0, y, bw * clamp(a, 0, 1), 10); }
          line(ctx, bx0 + bw * 0.7, y - 2, bx0 + bw * 0.7, y + 12, C.text, 1, [2, 2]); text(ctx, fx(a, 2), bx0 + bw + 4, y + 9, C.text, { size: 10 });
        });
      }
      function drawProfile(W, H) {
        const s = quizScores(), cx = W * 0.4, cy = H / 2 + 8, r = Math.min(W * 0.3, H * 0.38);
        text(ctx, "Your TIPI profile (1–7) vs. approximate norms (Gosling et al. 2003)", 16, 22, C.text, { bold: true, size: 13 });
        const ang = (i) => -Math.PI / 2 + i * TAU / 5, P2 = (i, v) => [cx + Math.cos(ang(i)) * r * (v - 1) / 6, cy + Math.sin(ang(i)) * r * (v - 1) / 6];
        for (let lv = 1; lv <= 7; lv++) { const pts = [0, 1, 2, 3, 4, 0].map((i) => P2(i, lv)); polyline(ctx, pts, C.grid, 1); }
        for (let i = 0; i < 5; i++) { const e = P2(i, 7); line(ctx, cx, cy, e[0], e[1], C.grid); const l = P2(i, 7.9); text(ctx, OCEAN_NAMES[i], l[0], l[1] + 4, C.series[i], { align: "center", bold: true, size: 11 }); }
        const poly = (vals, fill, stroke, dash) => { ctx.save(); ctx.beginPath(); vals.forEach((v, i) => { const p = P2(i, clamp(v, 1, 7)); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.setLineDash(dash || []); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); };
        poly(TIPI_NORMS, null, C.muted, [5, 4]); poly(s, "rgba(255,209,102,0.25)", C.accent);
        const lx = W * 0.74; let y = 60; text(ctx, "Scale scores", lx, y, C.text, { bold: true }); y += 18;
        s.forEach((v, i) => { text(ctx, `${OCEAN_NAMES[i]}: ${fx(v, 1)}  (norm ${fx(TIPI_NORMS[i], 1)})`, lx, y, C.series[i], { size: 11 }); y += 16; });
        y += 10; text(ctx, `${touched.size}/10 items answered`, lx, y, touched.size === 10 ? C.ok : C.muted, { size: 10 }); y += 14;
        text(ctx, "2 items per scale → low α by design;", lx, y, C.muted, { size: 10 }); y += 13; text(ctx, "TIPI trades reliability for brevity.", lx, y, C.muted, { size: 10 }); y += 13;
        text(ctx, "TIPI scores Emotional Stability;", lx, y, C.muted, { size: 10 }); y += 13; text(ctx, "shown here as Neuroticism = 8 − ES.", lx, y, C.muted, { size: 10 });
      }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H || !R) return; clearCanvas(ctx, W, H, C);
        if (P.view === "profile") drawProfile(W, H); else drawPsy(W, H);
        api.readout({ "Simulated respondents": R.n, "Eigenvalues > 1 (Kaiser)": R.kaiser, "Factors (parallel analysis)": R.par, "λ1 / λ5 / λ6": `${fx(R.eig[0], 2)} / ${fx(R.eig[4], 2)} / ${fx(R.eig[5], 2)}`, "Mean α": fx(mean(R.alpha.filter(Number.isFinite)), 2), "Variance of first 5 components": pct(R.eig.slice(0, 5).reduce((a, b) => a + b, 0) / K, 0) });
      }
      // quiz panel (rendered once; inputs keep their state)
      const opts = (sel) => [1, 2, 3, 4, 5, 6, 7].map((v) => `<option value="${v}"${v === sel ? " selected" : ""}>${v}</option>`).join("");
      const panel = api.html(`<div style="font-weight:700;margin-bottom:4px">Ten-Item Personality Inventory (TIPI) — "I see myself as…" (1 = disagree strongly, 7 = agree strongly)</div>
        <table>${TIPI.map((t, i) => `<tr><td>${i + 1}. ${esc(t[0])}</td><td><select data-tipi="${i}" style="background:#0f1222;color:#e8ebff;border:1px solid rgba(255,255,255,.15);border-radius:6px">${opts(4)}</select></td></tr>`).join("")}</table>
        <div style="color:${C.muted};font-size:.8rem;margin-top:4px">Items as published by Gosling, Rentfrow &amp; Swann (2003), J. Research in Personality 37, 504–528. Scoring: E = 1, 6R; A = 2R, 7; C = 3, 8R; Emotional Stability = 4R, 9; O = 5, 10R (R = 8 − x). Educational demo only — not a clinical assessment.</div>`);
      const onChange = (e) => { const t = e.target; if (!t || !t.getAttribute) return; const i = t.getAttribute("data-tipi"); if (i === null) return; quiz[+i] = clamp(parseInt(t.value, 10) || 4, 1, 7); touched.add(+i); if (touched.size === 10) api.award("quiz_done"); if (P.view !== "profile") api.setParam("view", "profile"); else draw(); };
      if (panel && panel.addEventListener) panel.addEventListener("change", onChange);
      api.onParam((k) => { if (k === "view") draw(); else compute(); });
      api.onResize(draw);
      api.setStatus("Each block of 4 items loads on one factor. Watch what noise and reverse-keying do to the correlations and α.");
      compute();
      return { resample() { seed = (seed * 16807 + 11) % 2147483647; compute(); }, profile() { api.setParam("view", "profile"); }, destroy() { if (panel && panel.removeEventListener) panel.removeEventListener("change", onChange); } };
    },
  });

  // ======================= 4. Power & replication crisis =======================
  S.register({
    id: "psych_power_replication",
    name: "Replication Crisis Lab: Power, p-Hacking & Publication Bias",
    domains: ["psychology", "statistics"],
    description: "Simulate thousands of two-group experiments (pooled-variance Student t-tests, df = n₁ + n₂ − 2, exact p-values from the regularized incomplete beta function). See how true effect size d, sample size and α determine power (e.g. d = 0.5 needs ≈ 64 per group for 80% power at α = .05); switch on p-hacking practices to watch the false-positive rate inflate (Simmons, Nelson & Simonsohn 2011 found up to ≈ 61% when four practices were combined); add publication bias and inspect the funnel plot and the winner's curse. All studies are simulated.",
    params: [
      { key: "d", label: "True effect size d (Cohen's d)", type: "range", min: 0, max: 1.2, step: 0.05, value: 0.3 },
      { key: "n", label: "Participants per group n", type: "range", min: 5, max: 200, step: 1, value: 20 },
      { key: "alpha", label: "Significance level α", type: "select", value: 0.05, options: [{ value: 0.005, label: "0.005" }, { value: 0.01, label: "0.01" }, { value: 0.05, label: "0.05" }, { value: 0.1, label: "0.10" }] },
      { key: "stop", label: "p-hack: optional stopping (add 10/group, up to 3 extra looks)", type: "toggle", value: false },
      { key: "dvs", label: "p-hack: 3 correlated DVs, report any", type: "toggle", value: false },
      { key: "outliers", label: "p-hack: try excluding |z|>2 or >2.5 outliers", type: "toggle", value: false },
      { key: "pubbias", label: "Publication bias (only p<α & d>0 published)", type: "toggle", value: false },
      { key: "varyn", label: "Studies vary in size (n/2 – 2n, log-uniform)", type: "toggle", value: true },
    ],
    actions: [{ label: "Run 1000 more studies", fn: (h) => h.more(1000) }, { label: "Restart", fn: (h) => h.reset() }, { label: "Null world (d = 0)", fn: (h) => h.nullWorld() }],
    challenges: [
      { id: "fpr_nominal", xp: 10, text: "With d = 0 and no p-hacking, run ≥1000 studies and confirm the false-positive rate ≈ α (within 1.5 points of 5%)." },
      { id: "hack_fpr", xp: 20, text: "With d = 0, combine ≥2 p-hacking practices to push the false-positive rate to ≥12% (Simmons, Nelson & Simonsohn 2011)." },
      { id: "power80", xp: 15, text: "Choose n so that a true d = 0.5 is detected with ≥80% observed power (≥500 studies, α = .05, no hacking). Tip: switch off 'Studies vary in size' to test one n exactly." },
      { id: "winners_curse", xp: 15, text: "Winner's curse: with publication bias, a small true effect (0 < d ≤ 0.3) and n ≤ 30, get a mean published d at least twice the true d." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 470 }), ctx = cv.ctx, rng = api.random;
      const CAP = 4000; let studies = [], target = 2000, lastChk = 0;
      const pa = () => ({ d: clamp(num(P.d, 0.3), -3, 3), n: clamp(Math.round(num(P.n, 20)), 3, 1000), alpha: clamp(num(P.alpha, 0.05), 1e-4, 0.5) });
      const hacking = () => !!(P.stop || P.dvs || P.outliers);
      function excl(arr, zc) { const m = mean(arr), s = Math.sqrt(variance(arr)) || 1; return arr.filter((x) => Math.abs((x - m) / s) <= zc); }
      function oneStudy() {
        const { d, alpha } = pa(), n = P.varyn ? clamp(Math.round(pa().n * Math.pow(2, 2 * rng() - 1)), 4, 1000) : pa().n, extra = P.stop ? 30 : 0, nd = P.dvs ? 3 : 1, N = n + extra, A = [], B = [];
        for (let j = 0; j < nd; j++) { A.push([]); B.push([]); }
        for (let i = 0; i < N; i++) {
          const ca = gauss(rng), cb = gauss(rng);
          for (let j = 0; j < nd; j++) { // DVs correlate r = .5 via a shared component
            const ua = gauss(rng), ub = gauss(rng); A[j].push(nd > 1 ? Math.SQRT1_2 * ca + Math.SQRT1_2 * ua : ua); B[j].push(d + (nd > 1 ? Math.SQRT1_2 * cb + Math.SQRT1_2 * ub : ub));
          }
        }
        let first = null;
        const looks = P.stop ? [n, n + 10, n + 20, n + 30] : [n];
        for (const m of looks) {
          for (let j = 0; j < nd; j++) {
            const a = A[j].slice(0, m), b = B[j].slice(0, m), variants = [[a, b]];
            if (P.outliers) { variants.push([excl(a, 2), excl(b, 2)]); variants.push([excl(a, 2.5), excl(b, 2.5)]); }
            for (const [va, vb] of variants) {
              const r = tTest(va, vb), res = { d: r.d, p: r.p, n: Math.round((va.length + vb.length) / 2), n1: va.length, n2: vb.length };
              if (!first) first = res;
              if (r.p < alpha && (!hacking() || r.d > 0)) return finish(res, alpha);
            }
          }
        }
        return finish(first, alpha);
      }
      function finish(r, alpha) { const n1 = Math.max(2, r.n1), n2 = Math.max(2, r.n2); r.se = Math.sqrt((n1 + n2) / (n1 * n2) + (r.d * r.d) / (2 * (n1 + n2))); r.sig = r.p < alpha; r.pub = P.pubbias ? (r.sig && r.d > 0) : true; return r; }
      // Normal approximation to the noncentral-t power: P(T > t_crit) ≈ Φ(δ − t_crit) + Φ(−δ − t_crit), δ = d·√(n/2). (d = 0.5, n = 64 → ≈ 0.80)
      function analyticPower() { const { d, n, alpha } = pa(), df = 2 * n - 2, tc = tCrit(alpha, df), delta = d * Math.sqrt(n / 2); return Phi(delta - tc) + Phi(-delta - tc); }
      function st() {
        const k = studies.length, sig = studies.filter((s) => s.sig).length, pub = studies.filter((s) => s.pub);
        return { k, rate: k ? sig / k : NaN, pubN: pub.length, pubD: mean(pub.map((s) => s.d)), allD: mean(studies.map((s) => s.d)) };
      }
      function checks() {
        const s = st(), { d, n, alpha } = pa(), nh = (P.stop ? 1 : 0) + (P.dvs ? 1 : 0) + (P.outliers ? 1 : 0);
        if (d === 0 && nh === 0 && s.k >= 1000 && Math.abs(alpha - 0.05) < 1e-9 && Math.abs(s.rate - 0.05) <= 0.015) api.award("fpr_nominal");
        if (d === 0 && nh >= 2 && s.k >= 500 && s.rate >= 0.12) api.award("hack_fpr");
        if (Math.abs(d - 0.5) < 0.026 && nh === 0 && Math.abs(alpha - 0.05) < 1e-9 && s.k >= 500 && s.rate >= 0.8) api.award("power80");
        if (P.pubbias && d > 0 && d <= 0.3 + 1e-9 && n <= 30 && s.pubN >= 30 && s.pubD >= 2 * d) api.award("winners_curse");
      }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H) return; clearCanvas(ctx, W, H, C);
        const { d } = pa(), s = st(), half = W / 2;
        // histogram of observed effects
        const hb = { x: 48, y: 30, w: half - 70, h: H - 76 }, lo = -1.5, hi = 2.5, bw = 0.05, nb = Math.round((hi - lo) / bw), hs = new Array(nb).fill(0), hn = new Array(nb).fill(0);
        studies.forEach((r) => { const b = Math.floor((r.d - lo) / bw); if (b >= 0 && b < nb) { if (r.sig) hs[b]++; else hn[b]++; } });
        let mx = 1; for (let b = 0; b < nb; b++) mx = Math.max(mx, hs[b] + hn[b]);
        const m = axes(ctx, C, hb, [lo, hi], [0, mx], { title: "Observed effect sizes", xlabel: "observed d", ylabel: "studies", xstep: 0.5, yticks: 4 });
        for (let b = 0; b < nb; b++) {
          const x = m.X(lo + b * bw), w = Math.max(1, m.X(lo + (b + 1) * bw) - x - 0.5);
          if (hn[b]) { ctx.fillStyle = "rgba(154,163,199,0.45)"; ctx.fillRect(x, m.Y(hn[b]), w, hb.y + hb.h - m.Y(hn[b])); }
          if (hs[b]) { ctx.fillStyle = "rgba(255,209,102,0.85)"; ctx.fillRect(x, m.Y(hn[b] + hs[b]), w, m.Y(hn[b]) - m.Y(hn[b] + hs[b])); }
        }
        line(ctx, m.X(d), hb.y, m.X(d), hb.y + hb.h, C.ok, 2); text(ctx, "true d", m.X(d) + 3, hb.y + 12, C.ok, { size: 10 });
        if (Number.isFinite(s.pubD)) { line(ctx, m.X(clamp(s.pubD, lo, hi)), hb.y, m.X(clamp(s.pubD, lo, hi)), hb.y + hb.h, C.secondary, 2, [5, 3]); text(ctx, "mean published", m.X(clamp(s.pubD, lo, hi)) + 3, hb.y + 26, C.secondary, { size: 10 }); }
        text(ctx, "■ p < α   ■ n.s.", hb.x + hb.w - 4, hb.y + 12, C.accent, { align: "right", size: 10 });
        // funnel plot
        const fb = { x: half + 40, y: 30, w: half - 56, h: H - 76 }, seMax = Math.max(0.2, ...studies.slice(-1500).map((r) => r.se)) * 1.05;
        const fx0 = -1.5, fx1 = 2.5, X = (v) => fb.x + ((clamp(v, fx0, fx1) - fx0) / (fx1 - fx0)) * fb.w, Y = (se) => fb.y + (se / seMax) * fb.h;
        ctx.strokeStyle = C.axis; ctx.strokeRect(fb.x + 0.5, fb.y + 0.5, fb.w, fb.h);
        text(ctx, "Funnel plot (simulated)" + (P.pubbias ? " (faint = file drawer)" : ""), fb.x, fb.y - 6, C.text, { bold: true });
        for (let v = -1; v <= 2; v += 1) { line(ctx, X(v), fb.y, X(v), fb.y + fb.h, C.grid); text(ctx, v, X(v), fb.y + fb.h + 11, C.muted, { align: "center", size: 9 }); }
        for (let se = 0; se <= seMax; se += 0.1) text(ctx, se.toFixed(1), fb.x - 4, Y(se) + 3, C.muted, { align: "right", size: 9 });
        text(ctx, "observed d", fb.x + fb.w / 2, fb.y + fb.h + 24, C.muted, { align: "center", size: 10 });
        ctx.save(); ctx.translate(fb.x - 28, fb.y + fb.h / 2); ctx.rotate(-Math.PI / 2); text(ctx, "standard error (0 at top; small studies lower)", 0, 0, C.muted, { align: "center", size: 10 }); ctx.restore();
        polyline(ctx, [[X(d - 1.96 * seMax), Y(seMax)], [X(d), Y(0)], [X(d + 1.96 * seMax), Y(seMax)]], C.ok, 1, [4, 4]);
        const zc = PhiInv(1 - pa().alpha / 2); polyline(ctx, [[X(-zc * seMax), Y(seMax)], [X(0), Y(0)], [X(zc * seMax), Y(seMax)]], C.danger, 1, [2, 3]);
        ctx.save(); ctx.beginPath(); ctx.rect(fb.x, fb.y, fb.w, fb.h); ctx.clip();
        studies.slice(-1500).forEach((r) => { ctx.fillStyle = r.pub ? (r.sig ? "rgba(255,209,102,0.8)" : "rgba(124,156,255,0.6)") : "rgba(154,163,199,0.13)"; ctx.fillRect(X(r.d) - 1.5, Y(r.se) - 1.5, 3, 3); });
        ctx.restore();
        text(ctx, "red dotted: significance boundary", fb.x + fb.w - 4, fb.y + fb.h - 6, C.danger, { align: "right", size: 9 });
        const ap = analyticPower();
        api.readout({ "Simulated studies": s.k, [d === 0 ? "False-positive rate" : "Observed power"]: pct(s.rate), [P.varyn ? "Analytic power at nominal n (approx.)" : "Analytic power, no hacking (approx.)"]: d === 0 ? pct(pa().alpha) + " (= α)" : pct(ap), "Published studies": s.pubN, "Mean published d": fx(s.pubD, 3), "Inflation (published / true)": d > 0 && Number.isFinite(s.pubD) ? fx(s.pubD / d, 2) + "×" : "—" });
      }
      function reset() { studies = []; target = 2000; dirty = true; draw(); }
      api.onParam(() => reset());
      api.onResize(draw);
      let dirty = true;
      api.loop(() => {
        if (studies.length < Math.min(target, CAP)) {
          const { n } = pa(), per = clamp(Math.round(4000 / (n * (P.dvs ? 3 : 1) * (P.outliers ? 3 : 1) * (P.stop ? 2 : 1))), 2, 40);
          for (let i = 0; i < per && studies.length < CAP; i++) studies.push(oneStudy());
          if (now() - lastChk > 300) { lastChk = now(); checks(); }
          dirty = true; draw();
        } else if (dirty) { dirty = false; checks(); draw(); }
      });
      api.setStatus("Yellow = significant studies. Try d = 0 with p-hacking, then d = 0.2 with publication bias.");
      draw();
      return {
        more(k) { target = Math.min(CAP, studies.length + k); },
        reset() { reset(); },
        nullWorld() { api.setParam("d", 0); },
        destroy() {},
      };
    },
  });

  // ======================= 5. Infant habituation =======================
  S.register({
    id: "psych_habituation",
    name: "Infant Habituation & Dishabituation",
    domains: ["psychology", "neuroscience"],
    description: "A simulated infant-controlled habituation procedure (Horowitz et al. 1972; Horowitz 1974). Looking time to a repeated stimulus declines as the infant builds an internal representation (Sokolov's 1963 comparator model: the orienting response is driven by mismatch between input and the stored model). Once the mean of 3 consecutive trials falls below criterion (commonly 50% of the first 3 trials), test trials show recovery to a novel stimulus — or, in the violation-of-expectation framing of Baillargeon, Spelke & Wasserman (1985, 5-month-olds, rotating-screen 'drawbridge'), longer looking at an 'impossible' event. That interpretation is debated: Bogartz et al. (1997) and Rivera, Wakeley & Langer (1999) argued that perceptual/familiarity preferences can explain the effect (infants looked longer at the 180° rotation even with no box). Looking times here are model output, not data.",
    params: [
      { key: "framing", label: "Paradigm", type: "select", value: "novelty", options: [{ value: "novelty", label: "Habituation → novel stimulus" }, { value: "voe", label: "Violation of expectation (drawbridge, Baillargeon et al. 1985)" }] },
      { key: "beta", label: "Encoding (decay) rate per trial β", type: "range", min: 0.05, max: 0.6, step: 0.01, value: 0.15 },
      { key: "crit", label: "Habituation criterion (% of first 3 trials)", type: "range", min: 30, max: 70, step: 5, value: 50 },
      { key: "sim", label: "Test stimulus similarity to familiar (0–1)", type: "range", min: 0, max: 1, step: 0.05, value: 0.5 },
      { key: "surprise", label: "VoE: expectation-violation weight", type: "range", min: 0, max: 1, step: 0.05, value: 0.5 },
      { key: "noise", label: "Trial-to-trial noise (log SD)", type: "range", min: 0, max: 0.5, step: 0.05, value: 0.15 },
    ],
    actions: [{ label: "New infant", fn: (h) => h.newInfant() }, { label: "Replay", fn: (h) => h.replay() }, { label: "Test a group of 16 infants", fn: (h) => h.group() }],
    challenges: [
      { id: "fast_hab", xp: 10, text: "Make an infant reach the habituation criterion within 6 trials (the earliest possible: 3 baseline + 3 criterion trials)." },
      { id: "no_dishab", xp: 15, text: "Make the novel stimulus so similar (≥0.9) that recovery is under 1 s — a null result that does NOT prove infants can't tell them apart." },
      { id: "strong_dishab", xp: 10, text: "Produce a novelty preference ≥ 70% (novel / (novel + familiar) looking)." },
      { id: "voe", xp: 20, text: "Violation of expectation (model): get the 'impossible' event looked at ≥2 s longer than the 'possible' one, even though it is perceptually MORE similar to the habituation event. Then ask: what non-'knowledge' explanation could critics offer?" },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx;
      const L0 = 14, FLOOR = 0.12, MAXT = 20; let seed = 3, R = null, shown = 0, tAcc = 0, groupRes = null;
      function runInfant(sd) {
        const r = makeRng(sd), beta = clamp(num(P.beta, 0.25), 0.001, 1), crit = clamp(num(P.crit, 50), 1, 100) / 100, nz = clamp(num(P.noise, 0.15), 0, 2), sim = clamp(num(P.sim, 0.3), 0, 1), w = clamp(num(P.surprise, 0.5), 0, 2);
        const base = L0 * Math.exp(0.2 * gauss(r)), look = (mm) => clamp(base * (FLOOR + (1 - FLOOR) * mm) * Math.exp(nz * gauss(r)), 0.5, 60);
        let M = 0; const trials = []; let habAt = -1, b3 = NaN;
        for (let t = 0; t < MAXT; t++) {
          trials.push(look(1 - M)); M += beta * (1 - M);
          if (t === 2) b3 = mean(trials.slice(0, 3));
          if (t >= 5 && mean(trials.slice(t - 2, t + 1)) <= crit * b3) { habAt = t; break; }
        }
        let tests;
        if (P.framing === "voe") tests = [{ label: "possible (112°)", v: look(1 - sim * M), kind: "possible" }, { label: "impossible (180°)", v: look(Math.min(1.5, (1 - 0.95 * M) + w)), kind: "impossible" }];
        else tests = [{ label: "familiar", v: look(1 - M), kind: "familiar" }, { label: "novel", v: look(1 - sim * M), kind: "novel" }];
        return { trials, habAt, b3, crit: crit * b3, tests, M };
      }
      function compute() {
        R = runInfant(seed);
        const t0 = R.tests[0].v, t1 = R.tests[1].v;
        if (R.habAt >= 0 && R.habAt + 1 <= 6) api.award("fast_hab");
        if (P.framing === "novelty" && R.habAt >= 0) { if (num(P.sim) >= 0.9 && t1 - t0 < 1) api.award("no_dishab"); if (t1 / (t0 + t1) >= 0.7) api.award("strong_dishab"); }
        if (P.framing === "voe" && R.habAt >= 0 && t1 - t0 >= 2) api.award("voe");
      }
      function group() {
        const a = [], b = []; let excluded = 0;
        for (let i = 0; i < 16 + excluded && i < 60; i++) { const r = runInfant(seed * 31 + i * 7919 + 1); if (r.habAt < 0) { excluded++; continue; } a.push(r.tests[0].v); b.push(r.tests[1].v); }
        const diff = a.map((x, i) => b[i] - x), md = mean(diff), sd = Math.sqrt(variance(diff)) || 1e-9, t = md / (sd / Math.sqrt(Math.max(1, diff.length))), p = tTwoP(t, diff.length - 1);
        groupRes = { n: diff.length, excluded, ma: mean(a), mb: mean(b), md, t, p, labels: R.tests.map((x) => x.label) };
        api.html(`<b>Group of ${groupRes.n} habituated infants</b> (${excluded} excluded for failing to habituate within ${MAXT} trials)<table><tr><th>${esc(groupRes.labels[0])}</th><th>${esc(groupRes.labels[1])}</th><th>mean difference</th><th>paired t(${groupRes.n - 1})</th><th>p</th></tr><tr><td>${fx(groupRes.ma, 1)} s</td><td>${fx(groupRes.mb, 1)} s</td><td>${fx(groupRes.md, 1)} s</td><td>${fx(groupRes.t, 2)}</td><td>${groupRes.p < 0.001 ? "&lt; .001" : fx(groupRes.p, 3)}</td></tr></table>`);
      }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H || !R) return; clearCanvas(ctx, W, H, C);
        const nHab = R.trials.length, total = nHab + 3, box = { x: 50, y: 34, w: W - 70, h: H - 92 };
        const ymax = Math.max(20, ...R.trials, ...R.tests.map((t) => t.v)) * 1.1;
        const m = axes(ctx, C, box, [0, total], [0, ymax], { title: P.framing === "voe" ? "Looking time: habituation to a 180° drawbridge, then test events" : "Looking time per trial (infant-controlled habituation)", ylabel: "looking time (s)", xstep: 100, yticks: 5 });
        const bw = Math.min(28, box.w / total * 0.7);
        if (Number.isFinite(R.b3)) { ctx.fillStyle = "rgba(124,156,255,0.08)"; ctx.fillRect(m.X(0), box.y, m.X(3) - m.X(0), box.h); text(ctx, "baseline (first 3)", m.X(1.5), box.y + 12, C.muted, { align: "center", size: 9 }); line(ctx, box.x, m.Y(R.crit), m.X(nHab), m.Y(R.crit), C.accent, 1.5, [5, 4]); text(ctx, `criterion ${Math.round(num(P.crit))}% = ${fx(R.crit, 1)} s`, m.X(nHab) - 2, m.Y(R.crit) - 4, C.accent, { align: "right", size: 9 }); }
        for (let i = 0; i < Math.min(shown, nHab); i++) { const x = m.X(i + 0.5) - bw / 2; ctx.fillStyle = C.primary; ctx.fillRect(x, m.Y(R.trials[i]), bw, m.Y(0) - m.Y(R.trials[i])); text(ctx, i + 1, x + bw / 2, box.y + box.h + 11, C.muted, { align: "center", size: 9 }); }
        if (shown > nHab) {
          if (R.habAt >= 0) { line(ctx, m.X(nHab + 0.5), box.y, m.X(nHab + 0.5), box.y + box.h, C.axis, 1, [3, 3]); text(ctx, "test", m.X(nHab + 0.6), box.y + 12, C.text, { size: 10 }); }
          R.tests.forEach((t, k) => {
            if (shown <= nHab + k) return; const x = m.X(nHab + 1 + k + 0.5) - bw / 2, col = k === 0 ? C.series[3] : C.secondary;
            ctx.fillStyle = col; ctx.fillRect(x, m.Y(t.v), bw, m.Y(0) - m.Y(t.v)); text(ctx, t.label, x + bw / 2, box.y + box.h + 11 + (k ? 11 : 0), col, { align: "center", size: 9 });
            text(ctx, fx(t.v, 1) + " s", x + bw / 2, m.Y(t.v) - 4, col, { align: "center", size: 9 });
          });
        }
        text(ctx, "trial", box.x + box.w / 2, H - 22, C.muted, { align: "center", size: 10 });
        // stimulus icons (top right)
        const ix = W - 150, iy = 70, sim = clamp(num(P.sim), 0, 1);
        if (P.framing === "voe") {
          ctx.save(); ctx.translate(ix, iy); [0, 1].forEach((k) => { const x0 = k * 70, ang = k ? Math.PI : (112 / 180) * Math.PI; ctx.strokeStyle = k ? C.secondary : C.series[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + 26 * Math.cos(Math.PI - ang), -26 * Math.sin(Math.PI - ang)); ctx.stroke(); ctx.fillStyle = C.accent; ctx.fillRect(x0 + 8, -8, 8, 8); }); ctx.restore();
          text(ctx, "box lies behind the screen", ix + 35, iy + 18, C.muted, { align: "center", size: 9 });
        } else {
          const sides = Math.round(12 - sim * 9); circle(ctx, ix, iy, 16, C.series[3]);
          ctx.beginPath(); for (let i = 0; i <= sides; i++) { const a = -Math.PI / 2 + (i * TAU) / sides, rr = 16 + (1 - sim) * (i % 2 ? -6 : 4); const px = ix + 60 + Math.cos(a) * rr, py = iy + Math.sin(a) * rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.fillStyle = C.secondary; ctx.fill();
          text(ctx, "familiar", ix, iy + 30, C.muted, { align: "center", size: 9 }); text(ctx, "novel", ix + 60, iy + 30, C.muted, { align: "center", size: 9 });
        }
        if (R.habAt < 0 && shown >= nHab) text(ctx, `Did not habituate within ${MAXT} trials → infant would be excluded`, box.x + box.w / 2, box.y + 30, C.danger, { align: "center", bold: true, size: 12 });
        const t0 = R.tests[0].v, t1 = R.tests[1].v;
        api.readout({ "Trials to criterion": R.habAt >= 0 ? R.habAt + 1 : "not reached", "Baseline (first 3)": fx(R.b3, 1) + " s", "Last 3 trials": fx(mean(R.trials.slice(-3)), 1) + " s", [R.tests[0].label]: fx(t0, 1) + " s", [R.tests[1].label]: fx(t1, 1) + " s", "Recovery": fx(t1 - t0, 1) + " s", "Preference": pct(t1 / (t0 + t1), 0) });
      }
      function replay() { shown = 0; tAcc = 0; }
      api.onParam(() => { compute(); shown = R.trials.length + 2; groupRes = null; api.html(""); draw(); });
      api.onResize(draw);
      api.loop((dt) => { if (R && shown < R.trials.length + 3) { tAcc += dt; if (tAcc > 0.35) { tAcc = 0; shown++; } } draw(); });
      compute(); shown = R.trials.length + 3;
      api.setStatus("Simulated infant. Bars = looking time on each trial; dashed line = habituation criterion. Longer looking shows discrimination, not by itself 'knowledge'.");
      return { newInfant() { seed = (seed * 48271 + 7) % 2147483647; compute(); replay(); }, replay() { replay(); }, group() { group(); }, destroy() {} };
    },
  });

  // ======================= 6. Exposure therapy =======================
  S.register({
    id: "psych_exposure_therapy",
    name: "Exposure Therapy: Habituation, Extinction & Avoidance",
    domains: ["psychology", "neuroscience"],
    description: "An illustrative computational sketch (not a validated clinical model) of exposure in the spirit of inhibitory-learning theory (Craske et al. 2008, 2014). Fear (SUDS 0–100) = threat association E × (1 − inhibitory learning I) × exposure intensity. While the person stays in the situation and the feared outcome does not occur, I grows with the expectancy violation (expected threat ∝ intensity·E·(1−I), a Rescorla–Wagner-style prediction error). Within-session fear decline (the habituation time constant) changes how sessions feel but is NOT required for long-term success — in line with Craske et al.'s finding that within-session habituation does not predict outcome. Escaping early is negatively reinforced and leaves the threat belief unchallenged; safety behaviours let the person credit the behaviour rather than the situation, reducing learning. Follow-up probes spontaneous recovery (time) and renewal (a context other than the therapy context; reinstatement is not modelled).",
    params: [
      { key: "strategy", label: "Strategy", type: "select", value: "graded", options: [{ value: "graded", label: "Graded exposure hierarchy" }, { value: "flooding", label: "Flooding (top of hierarchy)" }, { value: "avoidance", label: "Avoidance / escape" }] },
      { key: "sessions", label: "Sessions", type: "range", min: 2, max: 12, step: 1, value: 8 },
      { key: "len", label: "Session length (min)", type: "range", min: 10, max: 120, step: 5, value: 60 },
      { key: "tau", label: "Within-session habituation time constant (min)", type: "range", min: 3, max: 60, step: 1, value: 15 },
      { key: "eta", label: "Inhibitory learning rate η", type: "range", min: 0.01, max: 0.4, step: 0.01, value: 0.12 },
      { key: "safety", label: "Safety behaviours during exposure", type: "toggle", value: false },
      { key: "spont", label: "Spontaneous recovery (1-month delay)", type: "toggle", value: true },
      { key: "renewal", label: "Follow-up outside the therapy context (renewal)", type: "toggle", value: false },
    ],
    actions: [{ label: "Replay sessions", fn: (h) => h.replay() }, { label: "Compare: safety behaviours on/off", fn: (h) => h.compareSafety() }],
    challenges: [
      { id: "avoidance_trap", xp: 10, text: "Run avoidance for ≥6 sessions: escaping brings quick relief, yet fear at follow-up is as high as ever." },
      { id: "graded_success", xp: 15, text: "With graded exposure (no safety behaviours), get follow-up peak SUDS below 40 (hint: more sessions or a faster inhibitory-learning rate η)." },
      { id: "safety_cost", xp: 15, text: "Show that safety behaviours undermine exposure: follow-up SUDS ≥15 points higher with them than without." },
      { id: "renewal", xp: 15, text: "Renewal: after successful exposure, test in a new context and see fear return by ≥20 SUDS relative to the final session." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 480 }), ctx = cv.ctx;
      const HIER = [0.3, 0.45, 0.6, 0.8, 1.0], FLOOR = 0.15, ESCAPE = 55, PROBE = 20;
      let sims = {}, reveal = 0;
      function simulate(strategy, over) {
        const o = Object.assign({ safety: !!P.safety, spont: !!P.spont, renewal: !!P.renewal }, over || {});
        const ns = clamp(Math.round(num(P.sessions, 8)), 1, 30), len = clamp(Math.round(num(P.len, 60)), 5, 240), tau = Math.max(0.5, num(P.tau, 15)), eta = clamp(num(P.eta, 0.12), 0, 1);
        let E = 0.95, I = 0, step = 0, escapes = 0; const sessions = [];
        const curveFor = (peak, minutes, escapeAt) => { const c = []; let esc = -1; for (let mnt = 0; mnt < minutes; mnt++) { let s; if (esc >= 0) s = c[esc] * Math.exp(-(mnt - esc) / 1.5) + 8 * (1 - Math.exp(-(mnt - esc) / 1.5)); else s = mnt < 2 ? peak * (mnt + 1) / 2 : peak * (FLOOR + (1 - FLOOR) * Math.exp(-(mnt - 1) / tau)); /* 2-min rise to the peak, then within-session decline (τ) */ c.push(clamp(s, 0, 100)); if (esc < 0 && escapeAt && s >= escapeAt) esc = mnt; } return { c, esc }; };
        for (let k = 0; k < ns; k++) {
          const inten = strategy === "graded" ? HIER[step] : 1, peak = 100 * inten * E * (1 - I);
          const { c, esc } = curveFor(peak, len, strategy === "avoidance" ? ESCAPE : 0);
          if (esc >= 0) { escapes++; E = Math.min(1, E + 0.04 * (1 - E) + 0.01); } // relief negatively reinforces avoidance; threat belief never disconfirmed
          else { for (let mnt = 0; mnt < c.length; mnt++) { const pe = inten * E * (1 - I); I = Math.min(1, I + eta * pe / 15 * (o.safety ? 0.3 : 1)); } } // expectancy violation; independent of within-session SUDS decline
          sessions.push({ c, peak: Math.max(...c), end: c[c.length - 1], esc, inten });
          if (strategy === "graded" && esc < 0 && step < HIER.length - 1) step++; // planned progression up the hierarchy; no 'wait until SUDS drops' rule
          I *= o.spont ? 0.9 : 0.98; // forgetting of inhibitory learning between sessions
        }
        const If = I * (o.spont ? 0.7 : 0.97) * (o.renewal ? 0.45 : 1), fpk = 100 * E * (1 - If), probe = curveFor(fpk, PROBE, 0).c;
        return { sessions, followup: { c: probe, peak: Math.max(...probe) }, E, I, escapes };
      }
      function compute() {
        sims = {}; ["graded", "flooding", "avoidance"].forEach((s) => { sims[s] = simulate(s); });
        const cur = sims[P.strategy] || sims.graded, last = cur.sessions[cur.sessions.length - 1];
        if (P.strategy === "avoidance" && cur.sessions.length >= 6 && cur.followup.peak >= 75) api.award("avoidance_trap");
        if (P.strategy === "graded" && !P.safety && cur.followup.peak < 40) api.award("graded_success");
        if (P.strategy !== "avoidance" && P.safety) { const off = simulate(P.strategy, { safety: false }); if (cur.followup.peak - off.followup.peak >= 15) api.award("safety_cost"); }
        if (P.strategy !== "avoidance" && P.renewal && last && cur.followup.peak - last.peak >= 20) api.award("renewal");
      }
      function draw() {
        const W = cv.width, H = cv.height, cur = sims[P.strategy] || sims.graded; if (!W || !H || !cur) return; clearCanvas(ctx, W, H, C);
        const ns = cur.sessions.length, len = cur.sessions[0].c.length, segW = (W - 90) / (ns + 0.6), top = { x: 50, y: 30, w: W - 70, h: H * 0.48 };
        text(ctx, "SUDS during each session (" + (P.strategy === "graded" ? "graded exposure" : P.strategy) + ") + follow-up probe", top.x, top.y - 10, C.text, { bold: true });
        const Y = (s) => top.y + top.h - (s / 100) * top.h;
        for (let s = 0; s <= 100; s += 25) { line(ctx, top.x, Y(s), top.x + top.w, Y(s), C.grid); text(ctx, s, top.x - 4, Y(s) + 3, C.muted, { align: "right", size: 9 }); }
        ctx.save(); ctx.translate(top.x - 30, top.y + top.h / 2); ctx.rotate(-Math.PI / 2); text(ctx, "SUDS (0–100)", 0, 0, C.muted, { align: "center", size: 10 }); ctx.restore();
        let shownMin = reveal;
        cur.sessions.forEach((ses, k) => {
          const x0 = top.x + k * segW, xs = (i) => x0 + 4 + (i / Math.max(1, len - 1)) * (segW - 8);
          ctx.fillStyle = k % 2 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.045)"; ctx.fillRect(x0, top.y, segW, top.h);
          const upto = clamp(Math.floor(shownMin), 0, len); shownMin -= len;
          if (upto > 1) polyline(ctx, ses.c.slice(0, upto).map((s, i) => [xs(i), Y(s)]), ses.esc >= 0 ? C.danger : C.primary, 1.8);
          if (ses.esc >= 0 && upto > ses.esc) text(ctx, "escape", xs(ses.esc), Y(ses.c[ses.esc]) - 6, C.danger, { align: "center", size: 9 });
          text(ctx, "S" + (k + 1), x0 + segW / 2, top.y + top.h + 12, C.muted, { align: "center", size: 9 });
          if (P.strategy === "graded") text(ctx, Math.round(ses.inten * 100) + "%", x0 + segW / 2, top.y + top.h + 23, C.series[2], { align: "center", size: 8 });
        });
        if (shownMin > 0) {
          const x0 = top.x + ns * segW + 6, fw = segW * 0.6 - 6, fu = cur.followup.c;
          ctx.fillStyle = "rgba(255,143,171,0.08)"; ctx.fillRect(x0, top.y, fw, top.h);
          polyline(ctx, fu.map((s, i) => [x0 + 2 + (i / Math.max(1, fu.length - 1)) * (fw - 4), Y(s)]), C.secondary, 2);
          text(ctx, P.renewal ? "new ctx" : "1 mo", x0 + fw / 2, top.y + top.h + 12, C.secondary, { align: "center", size: 9 });
        }
        // comparison panel: peak SUDS per session for all strategies
        const cb = { x: 50, y: top.y + top.h + 50, w: W - 260, h: H - (top.y + top.h + 50) - 30 };
        const m = axes(ctx, C, cb, [0.5, ns + 1.5], [0, 100], { title: "Peak SUDS per session (F = follow-up)", ystep: 25, xstep: 1, xfmt: (v) => (v === ns + 1 ? "F" : v), ylabelOffset: 26 });
        const cols = { graded: C.ok, flooding: C.accent, avoidance: C.danger };
        Object.keys(sims).forEach((s) => { const pk = sims[s].sessions.map((x, i) => [m.X(i + 1), m.Y(x.peak)]); pk.push([m.X(ns + 1), m.Y(sims[s].followup.peak)]); polyline(ctx, pk, cols[s], s === P.strategy ? 3 : 1.2, s === P.strategy ? [] : [4, 3]); pk.forEach((p) => circle(ctx, p[0], p[1], s === P.strategy ? 3.5 : 2, cols[s])); });
        let ly = cb.y + 10; const lx = cb.x + cb.w + 20; [["graded", "graded exposure"], ["flooding", "flooding"], ["avoidance", "avoidance / escape"]].forEach(([k, l]) => { ctx.fillStyle = cols[k]; ctx.fillRect(lx, ly - 7, 14, 4); text(ctx, l + "  → F " + Math.round(sims[k].followup.peak), lx + 20, ly - 2, k === P.strategy ? C.text : C.muted, { size: 10, bold: k === P.strategy }); ly += 17; });
        text(ctx, "E = threat association, I = inhibitory", lx, ly + 8, C.muted, { size: 9 }); text(ctx, "(safety) learning; fear ∝ E·(1−I)", lx, ly + 20, C.muted, { size: 9 });
        api.readout({ "Peak SUDS session 1": Math.round(cur.sessions[0].peak), "Peak SUDS last session": Math.round(cur.sessions[ns - 1].peak), "Follow-up peak SUDS": Math.round(cur.followup.peak), "Early escapes": cur.escapes, "Threat association E": fx(cur.E, 2), "Inhibitory learning I": fx(cur.I, 2) });
      }
      api.onParam(() => { compute(); const cur = sims[P.strategy]; reveal = cur ? cur.sessions.length * cur.sessions[0].c.length + 1 : 0; draw(); });
      api.onResize(draw);
      api.loop((dt) => { const cur = sims[P.strategy]; if (!cur) return; const total = cur.sessions.length * cur.sessions[0].c.length + 1; if (reveal < total) { reveal += dt * total / 4; draw(); } });
      compute(); reveal = Infinity; draw();
      api.setStatus("Each band is one session. Red = the person escaped once SUDS passed " + ESCAPE + ". Try changing the habituation time constant: sessions look different, follow-up barely changes. Educational model, not clinical advice.");
      return {
        replay() { reveal = 0; },
        compareSafety() { const s = P.strategy === "avoidance" ? "graded" : P.strategy, a = simulate(s, { safety: false }), b = simulate(s, { safety: true }); api.html(`<b>${esc(s)}</b>: follow-up peak SUDS without safety behaviours <b>${Math.round(a.followup.peak)}</b> vs with safety behaviours <b>${Math.round(b.followup.peak)}</b>. Safety behaviours let the person attribute 'nothing bad happened' to the behaviour rather than to the situation being safe, so less inhibitory learning occurs.`); },
        destroy() {},
      };
    },
  });

  // ======================= 7. Hick's law (and Fitts' law) =======================
  S.register({
    id: "psych_hicks_law",
    name: "Hick–Hyman Choice Reaction Time Game",
    domains: ["psychology", "neuroscience", "computer_science"],
    description: "Play a choice reaction-time task: after a random 0.6–1.8 s foreperiod one of N equiprobable targets lights up — hit it as fast as you can (keys 1–8 are best; mouse clicks add movement time). RT is timed with performance.now() from the animation frame that draws the target (display lag of ~1 frame is not corrected); responses during the foreperiod are false starts, RTs < 100 ms are excluded as anticipations and > 3 s as lapses. Mean RTs are fitted to the Hick–Hyman law in Hick's (1952) form RT = a + b·log2(N + 1), where the +1 reflects uncertainty about whether/when a stimulus occurs (Hyman 1953 used log2 N, the stimulus information). Fitts mode uses MacKenzie's (1992) Shannon formulation MT = a + b·log2(D/W + 1) (Fitts' 1954 original: log2(2D/W)).",
    params: [
      { key: "mode", label: "Mode", type: "select", value: "hick", options: [{ value: "hick", label: "Hick–Hyman choice RT" }, { value: "fitts", label: "Fitts' law pointing" }] },
      { key: "n", label: "Number of choices N", type: "range", min: 1, max: 8, step: 1, value: 2 },
      { key: "cycle", label: "Auto-advance N after 8 trials", type: "toggle", value: true },
    ],
    actions: [{ label: "Start / next trial", fn: (h) => h.start() }, { label: "Clear data", fn: (h) => h.clear() }],
    challenges: [
      { id: "three_sets", xp: 10, text: "Collect ≥5 valid trials at each of 3 different set sizes N." },
      { id: "hick_fit", xp: 20, text: "With ≥4 set sizes, get a Hick–Hyman fit with positive slope and R² ≥ 0.8 (on the mean RTs)." },
      { id: "simple_rt", xp: 10, text: "Simple reaction time: mean RT under 350 ms at N = 1 (≥5 trials)." },
      { id: "fitts", xp: 15, text: "Fitts mode: ≥12 hits across ≥3 indices of difficulty with R² ≥ 0.7 (fit to the mean MT per ID, as is conventional)." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, rng = api.random;
      let phase = "idle", target = -1, onset = 0, fore = 0, phaseT = 0, msg = "Press Start, click the canvas, or hit Space", msgCol = C.muted, hick = [], fitts = [], errors = 0, falseStarts = 0, fmiss = 0, blockCount = 0, buttons = [], ftrial = null;
      const N = () => clamp(Math.round(num(P.n, 2)), 1, 8);
      function layoutButtons() { const W = cv.width, H = cv.height, n = N(), area = W * 0.56, r = Math.min(26, area / (n * 2.6)), y = H * 0.5; buttons = []; for (let i = 0; i < n; i++) buttons.push({ x: 24 + area * (i + 0.5) / n, y, r }); }
      function start() {
        if (P.mode === "fitts") { startFitts(); return; }
        layoutButtons(); phase = "wait"; target = -1; fore = 600 + rng() * 1200; phaseT = now(); msg = "Wait for it…"; msgCol = C.muted;
      }
      function respond(i) {
        if (phase === "wait") { falseStarts++; phase = "fb"; phaseT = now(); msg = "Too soon! (false start – not recorded)"; msgCol = C.danger; return; }
        if (phase !== "go") return;
        const rt = now() - onset; phase = "fb"; phaseT = now();
        if (i !== target) { errors++; msg = "Wrong target"; msgCol = C.danger; return; }
        if (rt < 100 || rt > 3000) { msg = rt < 100 ? "Anticipation (<100 ms) – not recorded" : "Too slow (>3 s) – not recorded"; msgCol = C.accent; return; }
        hick.push({ n: N(), rt }); msg = Math.round(rt) + " ms"; msgCol = C.ok; blockCount++;
        if (P.cycle && blockCount >= 8) { blockCount = 0; api.setParam("n", N() % 8 + 1); }
        checks();
      }
      function startFitts() { const W = cv.width, H = cv.height, Ds = [0.2, 0.35, 0.5, 0.65].map((f) => f * W * 0.6), Ws = [12, 24, 48]; ftrial = { sx: 40, sy: H / 2, D: Ds[Math.floor(rng() * Ds.length)], Wd: Ws[Math.floor(rng() * Ws.length)], started: false, t0: 0 }; phase = "fitts"; msg = "Click the green start circle, then the target bar"; msgCol = C.muted; }
      function fittsClick(pt) {
        if (!ftrial) { startFitts(); return; }
        if (!ftrial.started) { if (Math.hypot(pt.x - ftrial.sx, pt.y - ftrial.sy) <= 16) { ftrial.started = true; ftrial.t0 = now(); msg = "Go!"; } return; }
        const tx = ftrial.sx + ftrial.D, mt = now() - ftrial.t0;
        if (Math.abs(pt.x - tx) <= ftrial.Wd / 2) { const id = Math.log2(ftrial.D / ftrial.Wd + 1); fitts.push({ id, mt }); msg = `${Math.round(mt)} ms (ID ${id.toFixed(2)} bits)`; msgCol = C.ok; checks(); } else { fmiss++; msg = "Missed the target"; msgCol = C.danger; }
        startFitts();
      }
      function hickFit() {
        const by = {}; hick.forEach((d) => { (by[d.n] = by[d.n] || []).push(d.rt); });
        const ns = Object.keys(by).map(Number).sort((a, b) => a - b), means = ns.map((n) => mean(by[n]));
        return { by, ns, means, fit: linfit(ns.map((n) => Math.log2(n + 1)), means) };
      }
      function fittsFit() { const by = {}; fitts.forEach((d) => { const k = d.id.toFixed(2); (by[k] = by[k] || []).push(d.mt); }); const ids = Object.keys(by).map(Number).sort((a, b) => a - b); const means = ids.map((k) => mean(by[k.toFixed(2)])); return { ids, means, fit: linfit(ids, means) }; }
      function checks() {
        const h = hickFit(), full = h.ns.filter((n) => h.by[n].length >= 5);
        if (full.length >= 3) api.award("three_sets");
        if (h.ns.length >= 4 && h.fit && h.fit.b > 0 && h.fit.r2 >= 0.8) api.award("hick_fit");
        if (h.by[1] && h.by[1].length >= 5 && mean(h.by[1]) < 350) api.award("simple_rt");
        const f = fittsFit(); if (fitts.length >= 12 && f.ids.length >= 3 && f.fit && f.fit.b > 0 && f.fit.r2 >= 0.7) api.award("fitts");
      }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H) return; clearCanvas(ctx, W, H, C);
        const pw = W * 0.6;
        if (P.mode === "fitts") {
          if (ftrial) {
            circle(ctx, ftrial.sx, ftrial.sy, 14, ftrial.started ? "rgba(110,231,183,0.3)" : C.ok);
            const tx = ftrial.sx + ftrial.D; ctx.fillStyle = ftrial.started ? C.accent : "rgba(255,209,102,0.35)"; ctx.fillRect(tx - ftrial.Wd / 2, 40, ftrial.Wd, H - 80);
            text(ctx, `D = ${Math.round(ftrial.D)} px, W = ${ftrial.Wd} px`, 20, H - 16, C.muted, { size: 10 });
          } else text(ctx, "Click anywhere to begin", pw / 2, H / 2, C.text, { align: "center", size: 14 });
        } else {
          if (!buttons.length || buttons.length !== N()) layoutButtons();
          buttons.forEach((b, i) => { const lit = phase === "go" && i === target; circle(ctx, b.x, b.y, b.r, lit ? C.accent : "rgba(255,255,255,0.08)", lit ? "#fff" : C.axis, lit ? 3 : 1.5); text(ctx, i + 1, b.x, b.y + b.r + 16, C.muted, { align: "center", size: 11 }); });
          text(ctx, `N = ${N()} choices · ${Math.log2(N() + 1).toFixed(2)} bits (log2(N+1))`, 20, 24, C.text, { bold: true, size: 12 });
        }
        text(ctx, msg, pw / 2, H * 0.82, msgCol, { align: "center", bold: true, size: 15 });
        // fit plot
        const box = { x: pw + 44, y: 34, w: W - pw - 60, h: H - 84 };
        if (box.w < 60) return;
        if (P.mode === "fitts") {
          const f = fittsFit(), ymax = Math.max(800, ...fitts.map((d) => d.mt)) * 1.1, m = axes(ctx, C, box, [0, 6], [0, ymax], { title: "Fitts' law", xlabel: "ID = log2(D/W + 1) (bits)", ylabel: "movement time (ms)", xstep: 1, yticks: 4 });
          fitts.forEach((d) => circle(ctx, m.X(d.id), m.Y(Math.min(d.mt, ymax)), 2.5, "rgba(124,156,255,0.6)"));
          f.ids.forEach((id, i) => circle(ctx, m.X(id), m.Y(Math.min(f.means[i], ymax)), 4.5, C.secondary, "#000", 1));
          if (f.fit) { line(ctx, m.X(0), m.Y(f.fit.a), m.X(6), m.Y(f.fit.a + 6 * f.fit.b), C.accent, 2); text(ctx, `MT = ${Math.round(f.fit.a)} + ${Math.round(f.fit.b)}·ID   R² (means) = ${f.fit.r2.toFixed(2)}`, box.x + 4, box.y + 14, C.accent, { size: 10 }); }
        } else {
          const h = hickFit(), ymax = Math.max(700, ...hick.map((d) => d.rt)) * 1.1, m = axes(ctx, C, box, [0.8, 3.4], [0, ymax], { title: "Hick–Hyman law", xlabel: "log2(N + 1) (bits)", ylabel: "reaction time (ms)", xstep: 0.5, yticks: 4 });
          hick.forEach((d) => circle(ctx, m.X(Math.log2(d.n + 1)), m.Y(Math.min(d.rt, ymax)), 2.5, "rgba(124,156,255,0.5)"));
          h.ns.forEach((n, i) => { circle(ctx, m.X(Math.log2(n + 1)), m.Y(Math.min(h.means[i], ymax)), 5, C.secondary, "#000", 1); text(ctx, "N=" + n, m.X(Math.log2(n + 1)), m.Y(Math.min(h.means[i], ymax)) - 8, C.muted, { align: "center", size: 8 }); });
          if (h.fit) { line(ctx, m.X(0.8), m.Y(h.fit.a + 0.8 * h.fit.b), m.X(3.4), m.Y(h.fit.a + 3.4 * h.fit.b), C.accent, 2); text(ctx, `RT = ${Math.round(h.fit.a)} + ${Math.round(h.fit.b)}·log2(N+1)`, box.x + 4, box.y + 14, C.accent, { size: 10 }); text(ctx, `R² (means) = ${h.fit.r2.toFixed(2)}`, box.x + 4, box.y + 27, C.accent, { size: 10 }); }
        }
        const h = hickFit(), cur = h.by[N()];
        api.readout(P.mode === "fitts" ? { "Hits": fitts.length, "Misses": fmiss, "Fit slope b": fittsFit().fit ? Math.round(fittsFit().fit.b) + " ms/bit" : "—" }
          : { "Valid trials": hick.length, "Mean RT at this N": cur ? ms(mean(cur)) + ` (n=${cur.length})` : "—", "Intercept a": h.fit ? ms(h.fit.a) : "—", "Slope b": h.fit ? Math.round(h.fit.b) + " ms/bit" : "—", "Wrong-target errors / false starts": `${errors} / ${falseStarts}` });
      }
      api.pointer(cv.canvas, {
        down(pt) {
          if (P.mode === "fitts") { fittsClick(pt); return; }
          if (phase === "idle" || phase === "fb") { if (phase === "fb" && now() - phaseT < 250) return; start(); return; }
          const i = buttons.findIndex((b) => Math.hypot(pt.x - b.x, pt.y - b.y) <= b.r * 1.3);
          respond(i);
        },
      });
      const offKeys = onKeys((e) => {
        if (P.mode !== "hick") return false;
        if (e.key === " " || e.code === "Space") { if (phase === "idle" || phase === "fb") start(); else if (phase === "wait") respond(-1); return true; }
        const d = parseInt(e.key, 10); if (d >= 1 && d <= 8 && (phase === "go" || phase === "wait")) { respond(d - 1); return true; }
        return false;
      });
      api.onParam((k) => { if (k === "mode") { phase = "idle"; ftrial = null; msg = P.mode === "fitts" ? "Click anywhere to begin" : "Press Start, click the canvas, or hit Space"; msgCol = C.muted; } if (k === "n") { layoutButtons(); if (phase === "go" || phase === "wait") phase = "idle"; } draw(); });
      api.onResize(() => { layoutButtons(); draw(); });
      api.loop(() => {
        const t = now();
        if (phase === "wait" && t - phaseT >= fore) { target = Math.floor(rng() * N()); onset = t; phase = "go"; msg = "GO!"; msgCol = C.accent; }
        else if (phase === "go" && t - onset > 3000) { phase = "fb"; phaseT = t; msg = "Too slow (>3 s) – not recorded"; msgCol = C.accent; }
        else if (phase === "fb" && t - phaseT > 700 && P.mode === "hick") start();
        draw();
      });
      api.setStatus("Keyboard: Space to start, keys 1–8 = targets left→right. Trials auto-continue; switch tabs to pause.");
      draw();
      return { start() { start(); }, clear() { hick = []; fitts = []; errors = 0; falseStarts = 0; fmiss = 0; blockCount = 0; draw(); }, destroy() { offKeys(); } };
    },
  });

  // ======================= 8. Müller-Lyer (method of adjustment) =======================
  S.register({
    id: "psych_muller_lyer",
    name: "Visual Illusions: Method of Adjustment",
    domains: ["psychology", "neuroscience"],
    description: "Psychophysics by the method of adjustment: drag the comparison until it looks equal to the standard, then submit (trials alternate ascending/descending starts). Your point of subjective equality (PSE) gives the illusion magnitude in %. Müller-Lyer: outward fins (tails) lengthen and arrowheads shorten the shaft; typical magnitudes are roughly 10–30% depending on fin length and angle, larger with more acute fins. Ponzo: of two equal lines between converging rails, the one nearer the apex looks longer. Ebbinghaus: a centre circle surrounded by large circles looks smaller, by small circles larger.",
    params: [
      { key: "illusion", label: "Illusion", type: "select", value: "ml", options: [{ value: "ml", label: "Müller-Lyer" }, { value: "ponzo", label: "Ponzo" }, { value: "ebb", label: "Ebbinghaus" }] },
      { key: "angle", label: "Müller-Lyer fin angle (° from shaft)", type: "range", min: 15, max: 165, step: 5, value: 30 },
      { key: "context", label: "Context strength (fin length / rail tilt / inducer size)", type: "range", min: 0, max: 1, step: 0.05, value: 0.5 },
    ],
    actions: [
      { label: "Submit match", fn: (h) => h.submit() },
      { label: "Shorter −", fn: (h) => h.nudge(-2) },
      { label: "Longer +", fn: (h) => h.nudge(2) },
      { label: "Next fin angle", fn: (h) => h.nextAngle() },
      { label: "Clear data", fn: (h) => h.clear() },
    ],
    challenges: [
      { id: "three_angles", xp: 15, text: "Measure the Müller-Lyer PSE at ≥3 fin angles, including one below 60° and one above 120°." },
      { id: "reversal", xp: 15, text: "Show the illusion reverses sign: positive mean error for outward fins (<90°) and negative for arrowheads (>90°)." },
      { id: "null90", xp: 10, text: "At 90° (perpendicular fins) get a mean illusion within ±5% (≥2 matches)." },
      { id: "others", xp: 10, text: "Record at least one match in both the Ponzo and the Ebbinghaus illusion." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, rng = api.random;
      const data = { ml: [], ponzo: [], ebb: [] }; let cmp = 0, offset = 0, dragging = false, geo = null, ascending = true, flash = 0;
      const ANGLES = [15, 30, 45, 60, 90, 120, 135, 150, 165];
      const kind = () => (data[P.illusion] ? P.illusion : "ml");
      function stdLen() { const W = cv.width || 600, H = cv.height || 340; return kind() === "ebb" ? Math.min(W * 0.09, H * 0.16) : W * 0.2; }
      function newTrial() { const L = stdLen(); ascending = !ascending; cmp = L * (ascending ? 0.7 + rng() * 0.15 : 1.15 + rng() * 0.15); offset = (rng() - 0.5) * 0.08 * (cv.width || 600); }
      function xValue() { const k = kind(); return k === "ml" ? Math.round(num(P.angle, 30)) : k === "ponzo" ? Math.round(num(P.context, 0.5) * 30) : +(0.3 + 1.5 * num(P.context, 0.5)).toFixed(2); }
      function submit() {
        const L = stdLen(); if (!(L > 0)) return; const err = (cmp - L) / L * 100;
        data[kind()].push({ x: xValue(), err }); flash = 1; api.emit("illusion_match", { illusion: kind(), x: xValue(), err }); checks(); newTrial(); draw();
      }
      function meanAt(k, x) { const a = data[k].filter((d) => d.x === x).map((d) => d.err); return { m: mean(a), n: a.length }; }
      function checks() {
        const ml = data.ml, xs = [...new Set(ml.map((d) => d.x))];
        if (xs.length >= 3 && xs.some((x) => x < 60) && xs.some((x) => x > 120)) api.award("three_angles");
        const out = ml.filter((d) => d.x < 90).map((d) => d.err), inn = ml.filter((d) => d.x > 90).map((d) => d.err);
        if (out.length && inn.length && mean(out) > 0 && mean(inn) < 0) api.award("reversal");
        const n90 = meanAt("ml", 90); if (n90.n >= 2 && Math.abs(n90.m) <= 5) api.award("null90");
        if (data.ponzo.length && data.ebb.length) api.award("others");
      }
      function drawML(x0, y, L, ang, finLen, plain) {
        line(ctx, x0, y, x0 + L, y, C.text, 3);
        if (plain) return; const a = (ang * Math.PI) / 180;
        [[x0 + L, 1], [x0, -1]].forEach(([px, dir]) => { [1, -1].forEach((sg) => line(ctx, px, y, px + dir * Math.cos(a) * finLen, y + sg * Math.sin(a) * finLen, C.text, 3)); });
      }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H) return; clearCanvas(ctx, W, H, C);
        const k = kind(), dw = W * 0.6, L = stdLen(), ctxS = clamp(num(P.context, 0.5), 0, 1);
        ctx.fillStyle = flash > 0 ? `rgba(110,231,183,${0.15 * flash})` : "rgba(255,255,255,0.02)"; ctx.fillRect(0, 0, dw, H);
        text(ctx, k === "ml" ? "Make the lower plain line look as long as the upper shaft" : k === "ponzo" ? "Make the lower line look as long as the upper line" : "Make the right circle look as big as the left centre circle", 14, 22, C.text, { bold: true, size: 12 });
        if (k === "ml") {
          const sx = dw / 2 - L / 2, sy = H * 0.34; drawML(sx, sy, L, num(P.angle, 30), L * (0.15 + 0.35 * ctxS), false);
          const cx = dw / 2 - L / 2 + offset, cy = H * 0.68; drawML(cx, cy, cmp, 90, 0, true); circle(ctx, cx + cmp, cy, 6, C.accent);
          geo = { x0: cx, y: cy, type: "len" };
        } else if (k === "ponzo") {
          const tilt = (ctxS * 30 * Math.PI) / 180, apexY = 40, baseY = H - 30, cxm = dw / 2;
          [-1, 1].forEach((sg) => line(ctx, cxm + sg * 30, apexY, cxm + sg * (30 + Math.tan(tilt) * (baseY - apexY)), baseY, C.muted, 3));
          const sy = H * 0.32, cy = H * 0.74; line(ctx, cxm - L / 2, sy, cxm + L / 2, sy, C.accent, 4);
          line(ctx, cxm - cmp / 2, cy, cxm + cmp / 2, cy, C.accent, 4); circle(ctx, cxm + cmp / 2, cy, 6, C.text);
          geo = { x0: cxm - cmp / 2, cx: cxm, y: cy, type: "sym" };
        } else {
          const ratio = 0.3 + 1.5 * ctxS, sx = dw * 0.28, sy = H * 0.55, r = L / 2, ir = r * ratio, ring = r + ir + 6, cnt = clamp(Math.round((TAU * ring) / (2 * ir + 6)), 4, 14);
          circle(ctx, sx, sy, r, C.secondary); for (let i = 0; i < cnt; i++) { const a = (i * TAU) / cnt; circle(ctx, sx + Math.cos(a) * ring, sy + Math.sin(a) * ring, ir, "rgba(154,163,199,0.55)"); }
          const cx = dw * 0.76 + offset * 0.3; circle(ctx, cx, sy, cmp / 2, C.secondary); circle(ctx, cx + cmp / 2, sy, 5, C.accent);
          geo = { cx, y: sy, type: "rad" };
        }
        text(ctx, "drag the yellow handle · ←/→ keys fine-tune · Enter submits", 14, H - 10, C.muted, { size: 10 });
        // plot
        const box = { x: dw + 46, y: 34, w: W - dw - 60, h: H - 84 };
        if (box.w > 60) {
          const xr = k === "ml" ? [0, 180] : k === "ponzo" ? [0, 30] : [0.2, 1.9], ds = data[k], ext = Math.max(30, ...ds.map((d) => Math.abs(d.err))) * 1.1;
          const m = axes(ctx, C, box, xr, [-ext, ext], { title: "Illusion magnitude (PSE error)", xlabel: k === "ml" ? "fin angle (°)" : k === "ponzo" ? "rail tilt (°)" : "inducer / target size", ylabel: "% over-/under-estimation", xstep: k === "ml" ? 45 : k === "ponzo" ? 10 : 0.5, yticks: 4, ylabelOffset: 30 });
          line(ctx, box.x, m.Y(0), box.x + box.w, m.Y(0), C.axis, 1);
          if (k === "ml") { const ref = []; for (let a = 15; a <= 165; a += 5) ref.push([m.X(a), m.Y(25 * Math.cos((a * Math.PI) / 180))]); polyline(ctx, ref, C.muted, 1.2, [4, 4]); text(ctx, "illustrative pattern (not data)", box.x + box.w - 4, box.y + 12, C.muted, { align: "right", size: 9 }); line(ctx, m.X(num(P.angle)), box.y, m.X(num(P.angle)), box.y + box.h, C.grid, 1, [2, 3]); }
          ds.forEach((d) => circle(ctx, m.X(d.x), m.Y(clamp(d.err, -ext, ext)), 3, "rgba(124,156,255,0.6)"));
          const xs = [...new Set(ds.map((d) => d.x))].sort((a, b) => a - b), mp = xs.map((x) => [m.X(x), m.Y(clamp(meanAt(k, x).m, -ext, ext))]);
          polyline(ctx, mp, C.accent, 2); mp.forEach((p) => circle(ctx, p[0], p[1], 4.5, C.accent, "#000", 1));
        }
        const cur = meanAt(k, xValue()), last = data[k][data[k].length - 1];
        api.readout({ "Matches (this illusion)": data[k].length, "Last PSE error": last ? fx(last.err, 1) + " %" : "—", "Mean at this setting": cur.n ? fx(cur.m, 1) + ` % (n=${cur.n})` : "—" });
      }
      api.pointer(cv.canvas, {
        down(pt) { dragging = !!geo && pt.x < cv.width * 0.6; if (dragging) this.move(pt); },
        move(pt) {
          if (!dragging || !geo) return; const L = stdLen(), mx = L * 2.2, mn = L * 0.3;
          if (geo.type === "len") cmp = clamp(pt.x - geo.x0, mn, mx); else if (geo.type === "sym") cmp = clamp(2 * Math.abs(pt.x - geo.cx), mn, mx); else cmp = clamp(2 * Math.abs(pt.x - geo.cx), mn, mx);
          draw();
        },
        up() { dragging = false; },
      });
      const offKeys = onKeys((e) => { if (e.key === "ArrowLeft") { cmp = Math.max(stdLen() * 0.3, cmp - 1); draw(); return true; } if (e.key === "ArrowRight") { cmp = Math.min(stdLen() * 2.2, cmp + 1); draw(); return true; } if (e.key === "Enter") { submit(); return true; } return false; });
      api.onParam((k) => { if (k === "illusion") newTrial(); draw(); });
      api.onResize(() => { newTrial(); draw(); });
      api.loop((dt) => { if (flash > 0) { flash = Math.max(0, flash - dt * 2); draw(); } });
      newTrial(); draw();
      api.setStatus("Judge by eye, then Submit (or press Enter). Each new trial starts too short or too long, alternating.");
      return {
        submit() { submit(); },
        nudge(d) { cmp = clamp(cmp + d, stdLen() * 0.3, stdLen() * 2.2); draw(); },
        nextAngle() { const a = num(P.angle, 30), i = ANGLES.findIndex((x) => x > a); api.setParam("illusion", "ml"); api.setParam("angle", ANGLES[i < 0 ? 0 : i]); },
        clear() { data.ml = []; data.ponzo = []; data.ebb = []; draw(); },
        destroy() { offKeys(); },
      };
    },
  });

  // ======================= 9. N-back =======================
  const NB_LETTERS = "CHKLQRST";
  S.register({
    id: "psych_nback",
    name: "N-Back Working-Memory Task",
    domains: ["psychology", "neuroscience"],
    description: "Play the n-back task: respond 'Match' whenever the current item (a letter or a grid position) is the same as the one n steps back. 30% of scored trials are targets. Performance is scored with signal-detection theory: d′ = z(H) − z(FA) using the log-linear correction (Hautus 1995: add 0.5 to hits and false alarms and 1 to the numbers of signal and noise trials). Note that percent correct is inflated by the 70% non-targets (never responding scores ≈ 70%), which is why d′ is preferred. Adaptive mode raises n when accuracy ≥ 80% and d′ ≥ 1.",
    params: [
      { key: "n", label: "n (items back)", type: "range", min: 1, max: 3, step: 1, value: 1 },
      { key: "stim", label: "Stimuli", type: "select", value: "letters", options: [{ value: "letters", label: "Letters" }, { value: "positions", label: "Positions (3×3 grid)" }] },
      { key: "isi", label: "Trial duration (ms)", type: "range", min: 1500, max: 3500, step: 100, value: 2500 },
      { key: "adaptive", label: "Adaptive n (↑ at ≥80% & d′ ≥ 1, ↓ below 50%)", type: "toggle", value: true },
      { key: "feedback", label: "Immediate feedback", type: "toggle", value: true },
    ],
    actions: [{ label: "Start block", fn: (h) => h.start() }, { label: "MATCH!", fn: (h) => h.match() }, { label: "Stop", fn: (h) => h.stop() }],
    challenges: [
      { id: "block1", xp: 10, text: "Complete a full block." },
      { id: "dprime2", xp: 15, text: "Reach d′ ≥ 2 in a block." },
      { id: "two_back", xp: 20, text: "Score ≥80% accuracy with d′ ≥ 1 at n ≥ 2 (d′ stops you winning by never responding)." },
      { id: "three_back", xp: 25, text: "Complete a 3-back block with d′ ≥ 1." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 440 }), ctx = cv.ctx, rng = api.random;
      const STIM_MS = 500; let blk = null, history = [], fb = null, internalSet = false;
      const N = () => clamp(Math.round(num(P.n, 1)), 1, 3);
      // Exactly 30% of the scorable trials (i ≥ n) are targets, at random positions; non-targets never repeat the item n back.
      function makeSeq(n, len) {
        const seq = [], tg = [], k = P.stim === "positions" ? 9 : NB_LETTERS.length, pos = []; for (let i = n; i < len; i++) pos.push(i);
        for (let i = pos.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [pos[i], pos[j]] = [pos[j], pos[i]]; }
        const isT = new Set(pos.slice(0, Math.round(0.3 * pos.length)));
        for (let i = 0; i < len; i++) { let v; if (isT.has(i)) v = seq[i - n]; else { do { v = Math.floor(rng() * k); } while (i >= n && v === seq[i - n]); } seq.push(v); tg.push(isT.has(i)); }
        return { seq, tg };
      }
      function start() { const n = N(), len = 20 + n, s = makeSeq(n, len); blk = { n, len, seq: s.seq, tg: s.tg, stim: P.stim, i: -1, t0: now(), resp: new Array(len).fill(false), hits: 0, misses: 0, fa: 0, cr: 0 }; fb = null; nextTrial(); }
      function nextTrial() { blk.i++; blk.ts = now(); if (blk.i >= blk.len) endBlock(); }
      function score(i) { if (i < blk.n) return; const t = blk.tg[i], r = blk.resp[i]; if (t && r) blk.hits++; else if (t) blk.misses++; else if (r) blk.fa++; else blk.cr++; }
      function sdt(b) { const T = b.hits + b.misses, F = b.fa + b.cr, H = (b.hits + 0.5) / (T + 1), FA = (b.fa + 0.5) / (F + 1); return { H, FA, d: PhiInv(H) - PhiInv(FA), acc: (b.hits + b.cr) / Math.max(1, T + F), c: -0.5 * (PhiInv(H) + PhiInv(FA)) }; }
      function endBlock() {
        const r = sdt(blk), res = { n: blk.n, d: r.d, acc: r.acc, hits: blk.hits, fa: blk.fa, misses: blk.misses, cr: blk.cr };
        history.push(res); if (history.length > 30) history.shift();
        api.award("block1"); if (r.d >= 2) api.award("dprime2"); if (blk.n >= 2 && r.acc >= 0.8 && r.d >= 1) api.award("two_back"); if (blk.n === 3 && r.d >= 1) api.award("three_back");
        api.emit("nback_block", res);
        let msg = `Block done: accuracy ${pct(r.acc, 0)}, d′ = ${fx(r.d, 2)}`;
        if (P.adaptive) { const nn = r.acc >= 0.8 && r.d >= 1 ? Math.min(3, blk.n + 1) : r.acc < 0.5 ? Math.max(1, blk.n - 1) : blk.n; if (nn !== blk.n) { internalSet = true; api.setParam("n", nn); internalSet = false; msg += ` → n = ${nn}`; } }
        blk.done = true; blk.msg = msg; api.setStatus(msg + ". Press Start block for the next one.");
      }
      function match() {
        if (!blk || blk.done || blk.i < 0 || blk.i >= blk.len || blk.resp[blk.i]) return;
        blk.resp[blk.i] = true; if (P.feedback) fb = { ok: blk.tg[blk.i], t: now() };
      }
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H) return; clearCanvas(ctx, W, H, C);
        const sw = W * 0.58, cx = sw / 2, cy = H * 0.48, size = Math.min(sw * 0.6, H * 0.6);
        let col = "rgba(255,255,255,0.04)"; if (fb && now() - fb.t < 300) col = fb.ok ? "rgba(110,231,183,0.25)" : "rgba(255,107,107,0.25)";
        roundRect(ctx, cx - size / 2, cy - size / 2, size, size, 12, col, C.axis, 1);
        if (blk && !blk.done && blk.i >= 0 && blk.i < blk.len) {
          const on = now() - blk.ts < STIM_MS, v = blk.seq[blk.i];
          if (blk.stim === "positions") { const c = size / 3; for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const x = cx - size / 2 + q * c, y = cy - size / 2 + r * c; ctx.strokeStyle = C.grid; ctx.strokeRect(x + 3, y + 3, c - 6, c - 6); if (on && r * 3 + q === v) roundRect(ctx, x + 6, y + 6, c - 12, c - 12, 8, C.primary); } }
          else if (on) text(ctx, NB_LETTERS[v], cx, cy, C.text, { align: "center", base: "middle", bold: true, size: Math.round(size * 0.45) });
          text(ctx, `${blk.n}-back · trial ${blk.i + 1}/${blk.len}`, cx, cy + size / 2 + 20, C.muted, { align: "center", size: 11 });
          ctx.fillStyle = C.primary; ctx.fillRect(cx - size / 2, cy + size / 2 + 28, size * (blk.i / blk.len), 4);
        } else {
          text(ctx, blk && blk.done ? blk.msg : `${N()}-back: press Start block`, cx, cy, C.text, { align: "center", base: "middle", bold: true, size: 14 });
          text(ctx, "Press MATCH (button, Space, M, or click the canvas) when the item equals the one " + N() + " back", cx, cy + 24, C.muted, { align: "center", size: 10 });
        }
        // history chart
        const box = { x: sw + 44, y: 34, w: W - sw - 60, h: H - 84 };
        if (box.w > 60) {
          const m = axes(ctx, C, box, [0.5, Math.max(6, history.length) + 0.5], [-1, 4.5], { title: "d′ per block (dot colour = n)", xlabel: "block", ylabel: "d′", xstep: Math.max(1, Math.ceil(Math.max(6, history.length) / 6)), ystep: 1, ylabelOffset: 24 });
          line(ctx, box.x, m.Y(0), box.x + box.w, m.Y(0), C.axis, 1, [3, 3]);
          polyline(ctx, history.map((h, i) => [m.X(i + 1), m.Y(clamp(h.d, -1, 4.5))]), C.muted, 1.2);
          history.forEach((h, i) => circle(ctx, m.X(i + 1), m.Y(clamp(h.d, -1, 4.5)), 5, C.series[h.n - 1]));
          [1, 2, 3].forEach((n, i) => { circle(ctx, box.x + 10 + i * 46, box.y + 12, 4, C.series[n - 1]); text(ctx, n + "-back", box.x + 17 + i * 46, box.y + 15, C.muted, { size: 9 }); });
        }
        const b = blk || { hits: 0, misses: 0, fa: 0, cr: 0 }, r = sdt(b);
        api.readout({ "n": blk && !blk.done ? blk.n : N(), "Hits / misses": `${b.hits} / ${b.misses}`, "False alarms / correct rejections": `${b.fa} / ${b.cr}`, "Hit rate / FA rate (corrected)": `${pct(r.H, 0)} / ${pct(r.FA, 0)}`, "d′": fx(r.d, 2), "Accuracy": pct(r.acc, 0) });
      }
      api.pointer(cv.canvas, { down() { if (blk && !blk.done) match(); else start(); } });
      const offKeys = onKeys((e) => { const k = String(e.key || "").toLowerCase(); if (k === " " || k === "m") { if (blk && !blk.done) match(); else if (k === " ") start(); return true; } return false; });
      api.onParam((k) => { if (internalSet) return; if (k === "n" || k === "stim") { if (blk && !blk.done) { blk = null; api.setStatus("Block cancelled because the settings changed."); } } draw(); });
      api.onResize(draw);
      api.loop(() => { if (blk && !blk.done && blk.i >= 0 && now() - blk.ts >= clamp(num(P.isi, 2500), 800, 10000)) { score(blk.i); nextTrial(); } draw(); });
      api.setStatus("Press Start block. 30% of scored trials (6 of 20) are targets.");
      draw();
      return { start() { start(); }, match() { match(); }, stop() { if (blk && !blk.done) { blk = null; api.setStatus("Stopped."); } }, destroy() { offKeys(); } };
    },
  });

  // ======================= 10. Two-process model of sleep =======================
  S.register({
    id: "psych_sleep_two_process",
    name: "Two-Process Model of Sleep Regulation",
    domains: ["psychology", "neuroscience", "biology"],
    description: "Borbély's (1982) two-process model as formalised by Daan, Beersma & Borbély (1984): homeostatic sleep pressure S rises exponentially toward an upper asymptote during wake (τ ≈ 18.2 h) and decays during sleep (τ ≈ 4.2 h), while circadian Process C (here a pure 24 h sinusoid; the original used a skewed waveform) modulates the upper (sleep-onset) and lower (waking) thresholds (illustrative values 0.60 and 0.17 ± 0.12). Explore sleep deprivation, chronotype and caffeine. Caffeine is an adenosine A1/A2A receptor antagonist with a half-life of ≈ 5 h in adults (≈ 3–7 h typical); here it is modelled — as a deliberate simplification — by subtracting a saturating term from 'felt' S while true S keeps rising. The alertness index is a relative, illustrative quantity.",
    params: [
      { key: "wake", label: "Alarm / wake time (h)", type: "range", min: 4, max: 11, step: 0.25, value: 7 },
      { key: "dur", label: "Planned sleep duration (h)", type: "range", min: 4, max: 10, step: 0.25, value: 8 },
      { key: "dep", label: "Sleep deprivation on night 1 (extra hours awake)", type: "range", min: 0, max: 24, step: 1, value: 0 },
      { key: "phase", label: "Chronotype phase shift (h, + = owl)", type: "range", min: -3, max: 3, step: 0.25, value: 0 },
      { key: "caf", label: "Caffeine per day (mg; t½ = 5 h model)", type: "range", min: 0, max: 400, step: 25, value: 0 },
      { key: "caft", label: "Caffeine time (clock h)", type: "range", min: 6, max: 22, step: 0.5, value: 8 },
      { key: "alarm", label: "Alarm clock (off = wake naturally)", type: "toggle", value: true },
    ],
    actions: [{ label: "All-nighter (24 h)", fn: (h) => h.preset("allnighter") }, { label: "Night owl, early alarm", fn: (h) => h.preset("owl") }, { label: "Reset to rested", fn: (h) => h.preset("rested") }],
    challenges: [
      { id: "all_nighter", xp: 10, text: "Pull an all-nighter (≥20 h extra) and see S rise above the sleep threshold — sleep propensity is then very high and microsleeps become more likely." },
      { id: "caffeine_mask", xp: 15, text: "After ≥12 h of deprivation, use ≥200 mg caffeine to raise the (model) alertness index by ≥10 points at some waking moment — then notice that, in this simplified masking model, S itself keeps rising unchanged." },
      { id: "social_jetlag", xp: 15, text: "Make the alarm cut sleep short by ≥1.5 h compared with waking naturally (hint: an owl chronotype with an early alarm)." },
      { id: "recovery", xp: 15, text: "With the alarm off, show that recovery sleep after ≥16 h deprivation lasts ≥1 h longer than your planned sleep." },
    ],
    mount(el, api) {
      const C = api.colors, P = api.params, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 480 }), ctx = cv.ctx;
      // τ_rise / τ_decay from Daan et al. (1984); thresholds and caffeine Emax/EC50 are illustrative. One-compartment oral PK: k_a = 2 /h, k_e = ln2 / 5 h.
      const TR = 18.2, TD = 4.2, HU = 0.6, HL = 0.17, AMP = 0.12, DT = 0.05, KA = 2.0, KE = Math.LN2 / 5, EMAX = 0.15, EC50 = 100;
      let R = null, cursor = 39;
      function simulate(over) {
        const o = Object.assign({ W: num(P.wake, 7), dur: clamp(num(P.dur, 8), 1, 16), D: clamp(num(P.dep, 0), 0, 48), ph: num(P.phase, 0), caf: Math.max(0, num(P.caf, 0)), cafT: num(P.caft, 8), alarm: !!P.alarm }, over || {});
        const Cf = (t) => Math.sin((TAU * (t - 12 - o.ph)) / 24) /* peaks 18:00 + phase shift */, Hp = (t) => HU + AMP * Cf(t), Hm = (t) => HL + AMP * Cf(t);
        const beds = [], alarms = [], doses = [];
        for (let k = -4; k <= 3; k++) { beds.push(o.W + 24 * k + (24 - o.dur) + (k === 0 ? o.D : 0)); alarms.push(o.W + 24 * k); if (o.caf > 0) doses.push(o.cafT + 24 * k); }
        let t = -96, S = 0.1, asleep = true, sleepStart = -100, alarmT = alarms.find((a) => a > t), nextBed = Infinity, taken = new Set();
        const out = { t: [], S: [], Se: [], Hp: [], Hm: [], C: [], asleep: [], caf: [], sleeps: [] }; let cur = null;
        const effDose = (t2) => { let c = 0; for (const td of doses) if (taken.has(td)) { const tau = t2 - td; if (tau > 0) c += o.caf * (KA / (KA - KE)) * (Math.exp(-KE * tau) - Math.exp(-KA * tau)); } return c; };
        while (t < 72 + 1e-9) {
          for (const td of doses) if (!asleep && td <= t && td > t - DT && !taken.has(td)) taken.add(td); // only taken when awake
          const c = effDose(t), Se = S - EMAX * c / (c + EC50);
          if (asleep) {
            const wakeNat = Se <= Hm(t) && t - sleepStart >= 1, wakeAlarm = o.alarm && alarmT !== undefined && t >= alarmT;
            if (wakeNat || wakeAlarm) { asleep = false; nextBed = beds.find((b) => b > t + 1); if (nextBed === undefined) nextBed = Infinity; if (cur) { cur.end = t; cur.why = wakeAlarm && !wakeNat ? "alarm" : "natural"; cur = null; } }
          } else if (t >= nextBed) { asleep = true; sleepStart = t; alarmT = alarms.find((a) => a > t + 1); if (t >= -1) { cur = { start: t, end: 72, why: "" }; out.sleeps.push(cur); } }
          if (t >= 0) { out.t.push(t); out.S.push(S); out.Se.push(Se); out.Hp.push(Hp(t)); out.Hm.push(Hm(t)); out.C.push(Cf(t)); out.asleep.push(asleep); out.caf.push(c); }
          if (t >= -1 && t < 0 && asleep && !cur) { cur = { start: Math.max(0, sleepStart), end: 72, why: "" }; out.sleeps.push(cur); }
          S = asleep ? S * Math.exp(-DT / TD) : 1 - (1 - S) * Math.exp(-DT / TR);
          t += DT;
        }
        out.alert = out.t.map((_, i) => clamp(50 + 50 * (out.Hp[i] - out.Se[i]) / (HU - HL), 0, 100));
        return out;
      }
      function idx(t) { return clamp(Math.round(t / DT), 0, R.t.length - 1); }
      function summary(r, o) {
        const nights = r.sleeps.filter((s) => s.end - s.start > 0.5 && s.end < 72 - DT).map((s) => ({ start: s.start, len: s.end - s.start, why: s.why }));
        let over = 0, minA = 100; r.t.forEach((t, i) => { if (!r.asleep[i]) { if (r.Se[i] >= r.Hp[i]) over += DT; if (t >= 24 && t < 48) minA = Math.min(minA, r.alert[i]); } });
        return { nights, over, minA };
      }
      function compute() {
        R = simulate(); R.sum = summary(R);
        const D = num(P.dep, 0), dur = num(P.dur, 8);
        if (D >= 20 && R.sum.over > 0.25) api.award("all_nighter");
        if (D >= 12 && num(P.caf) >= 200) { const b = simulate({ caf: 0 }); let gain = 0; R.t.forEach((_, i) => { if (!R.asleep[i] && !b.asleep[i]) gain = Math.max(gain, R.alert[i] - b.alert[i]); }); if (gain >= 10) api.award("caffeine_mask"); }
        if (P.alarm) { const nat = simulate({ alarm: false }); const a2 = R.sum.nights.find((s) => s.start > 12 && s.start < 40), n2 = summary(nat).nights.find((s) => s.start > 12 && s.start < 40); if (a2 && n2 && n2.len - a2.len >= 1.5) api.award("social_jetlag"); }
        if (!P.alarm && D >= 16 && R.sum.nights.some((s) => s.start > 12 && s.len >= dur + 1)) api.award("recovery");
      }
      const clock = (t) => { const h = ((t % 24) + 24) % 24, hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `Day ${Math.floor(t / 24) + 1} ${String(hh).padStart(2, "0")}:${String(mm === 60 ? 0 : mm).padStart(2, "0")}`; };
      function draw() {
        const W = cv.width, H = cv.height; if (!W || !H || !R) return; clearCanvas(ctx, W, H, C);
        const box = { x: 50, y: 30, w: W - 70, h: H * 0.55 }, ab = { x: 50, y: box.y + box.h + 34, w: W - 70, h: H - (box.y + box.h + 34) - 30 };
        const X = (t) => box.x + (t / 72) * box.w, Y = (v) => box.y + box.h - ((v + 0.05) / 1.05) * box.h;
        R.sleeps.forEach((s) => { const a = Math.max(0, s.start), b = Math.min(72, s.end); if (b <= a) return; ctx.fillStyle = "rgba(124,156,255,0.12)"; ctx.fillRect(X(a), box.y, X(b) - X(a), box.h); ctx.fillRect(X(a), ab.y, X(b) - X(a), ab.h); });
        for (let i = 0; i < R.t.length; i++) if (!R.asleep[i] && R.Se[i] >= R.Hp[i]) { ctx.fillStyle = "rgba(255,107,107,0.25)"; ctx.fillRect(X(R.t[i]), box.y, Math.max(1, X(DT) - X(0)), box.h); }
        for (let t = 0; t <= 72; t += 6) { line(ctx, X(t), box.y, X(t), box.y + box.h, t % 24 === 0 ? C.axis : C.grid); line(ctx, X(t), ab.y, X(t), ab.y + ab.h, t % 24 === 0 ? C.axis : C.grid); text(ctx, String(t % 24).padStart(2, "0") + ":00", X(t), ab.y + ab.h + 12, C.muted, { align: "center", size: 9 }); }
        for (let d = 0; d < 3; d++) text(ctx, "Day " + (d + 1), X(d * 24 + 12), box.y - 6, C.text, { align: "center", bold: true, size: 11 });
        for (let v = 0; v <= 1; v += 0.25) text(ctx, v.toFixed(2), box.x - 4, Y(v) + 3, C.muted, { align: "right", size: 9 });
        ctx.strokeStyle = C.axis; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
        const ser = (arr, f) => arr.map((v, i) => [X(R.t[i]), f(v)]);
        polyline(ctx, ser(R.Hp, Y), C.danger, 1.5, [6, 4]); polyline(ctx, ser(R.Hm, Y), C.ok, 1.5, [6, 4]);
        polyline(ctx, ser(R.C, (v) => Y(0.05 + 0.08 * v)), C.series[4], 1.2);
        if (num(P.caf) > 0) polyline(ctx, ser(R.Se, Y), C.accent, 1.5, [3, 3]);
        polyline(ctx, ser(R.S, Y), C.primary, 2.5);
        let lx = box.x + 8; [[C.primary, "Process S"], [C.accent, "S with caffeine"], [C.danger, "sleep threshold H+"], [C.ok, "wake threshold H−"], [C.series[4], "Process C"]].forEach(([c, l]) => { ctx.fillStyle = c; ctx.fillRect(lx, box.y + 8, 12, 3); text(ctx, l, lx + 16, box.y + 12, C.text, { size: 9 }); lx += 20 + ctx.measureText(l).width + 10; });
        // alertness strip
        text(ctx, "Alertness index (relative, illustrative 0–100)", ab.x, ab.y - 6, C.text, { bold: true, size: 10 });
        ctx.strokeStyle = C.axis; ctx.strokeRect(ab.x + 0.5, ab.y + 0.5, ab.w, ab.h);
        const AY = (v) => ab.y + ab.h - (v / 100) * ab.h;
        let seg = []; R.alert.forEach((v, i) => { if (R.asleep[i]) { polyline(ctx, seg, C.accent, 1.8); seg = []; } else seg.push([X(R.t[i]), AY(v)]); }); polyline(ctx, seg, C.accent, 1.8);
        // cursor
        const i = idx(cursor); line(ctx, X(cursor), box.y, X(cursor), ab.y + ab.h, C.text, 1, [2, 3]);
        if (num(P.caf) > 0) R.t.forEach((t, j) => { if (j % 10 === 0 && R.caf[j] > 5) { const h = Math.min(18, R.caf[j] / 20); ctx.fillStyle = "rgba(253,186,116,0.5)"; ctx.fillRect(X(t), box.y + box.h - h, 2, h); } });
        const nights = R.sum.nights.map((s) => fx(s.len, 1) + " h" + (s.why === "alarm" ? "⏰" : "")).join(", ");
        api.readout({ "Cursor": clock(cursor) + (R.asleep[i] ? " (asleep)" : " (awake)"), "Sleep pressure S": fx(R.S[i], 2) + (num(P.caf) > 0 ? ` (felt ${fx(R.Se[i], 2)})` : ""), "Process C": fx(R.C[i], 2), "Alertness index": Math.round(R.alert[i]), "Sleep episodes": nights || "—", "Awake above sleep threshold": fx(R.sum.over, 1) + " h" });
      }
      const setCursor = (pt) => { const t = ((pt.x - 50) / Math.max(1, cv.width - 70)) * 72; if (t >= 0 && t <= 72) { cursor = t; draw(); } };
      api.pointer(cv.canvas, { down: setCursor, move: setCursor });
      api.onParam(() => { compute(); draw(); });
      api.onResize(draw);
      compute(); draw();
      api.setStatus("Hover/drag over the plot to read values. Blue bands = sleep; red = awake while S exceeds the sleep threshold.");
      return {
        preset(k) {
          if (k === "allnighter") { api.setParam("dep", 24); api.setParam("alarm", false); }
          else if (k === "owl") { api.setParam("phase", 2.5); api.setParam("wake", 6.5); api.setParam("dur", 7.5); api.setParam("alarm", true); api.setParam("dep", 0); }
          else { api.setParam("dep", 0); api.setParam("phase", 0); api.setParam("caf", 0); api.setParam("wake", 7); api.setParam("dur", 8); api.setParam("alarm", true); }
        },
        destroy() {},
      };
    },
  });
})();
