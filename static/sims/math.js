/* Self-Taught — Mathematics simulations (vanilla JS + canvas). Contract: docs/CONTRACTS.md §3.
 * Registers: function_plotter, derivative_explorer, riemann_sum, taylor_series, matrix_transform,
 *            distribution_explorer, regression_fit, fourier_series, phase_portrait, graph_theory, modular_clock
 */
(function () {
  "use strict";
  if (!window.SelfTaughtSims) { console.error("[math sims] static/sims/core.js must be loaded first"); return; }
  const Sims = window.SelfTaughtSims;
  const PI = Math.PI, TAU = 2 * Math.PI;
  const FONT = "12px system-ui, -apple-system, 'Segoe UI', sans-serif";

  /* ============================== shared helpers ============================== */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const fin = (v) => typeof v === "number" && Number.isFinite(v);
  const num = (v, d) => { const x = typeof v === "string" ? parseFloat(v) : v; return fin(x) ? x : d; };
  const SUB = "₀₁₂₃₄₅₆₇₈₉", SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sub = (k) => String(k).replace(/\d/g, (d) => SUB[+d]);
  const sup = (k) => String(k).replace(/\d/g, (d) => SUP[+d]).replace("-", "⁻");
  function fmt(v, d) {
    if (!fin(v)) return "—";
    if (d == null) d = 3;
    const a = Math.abs(v);
    if (a < 1e-12) return "0";
    if (a < 1e-4 || a >= 1e7) return v.toExponential(2);
    return String(parseFloat(v.toFixed(d)));
  }
  const tick = (x) => String(parseFloat(x.toPrecision(6)));
  function gcd(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { const t = a % b; a = b; b = t; } return a; }
  function lgamma(z) { /* Lanczos (g = 7) with reflection for z < 0.5 */
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(PI / Math.abs(Math.sin(PI * z))) - lgamma(1 - z);
    z -= 1; let x = c[0]; for (let i = 1; i < 9; i++) x += c[i] / (z + i);
    const t = z + 7.5; return 0.5 * Math.log(TAU) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  const deriv = (f, x, h) => { h = h || 1e-4; return (f(x + h) - f(x - h)) / (2 * h); };
  function simpson(f, a, b, n) { n = Math.max(2, 2 * Math.ceil(n / 2)); const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; }
  function rk4(f, y, h) { /* one classical Runge–Kutta step for the autonomous system y' = f(y); y is an array */
    const n = y.length, k1 = f(y), y2 = new Array(n), y3 = new Array(n), y4 = new Array(n), out = new Array(n);
    for (let i = 0; i < n; i++) y2[i] = y[i] + 0.5 * h * k1[i];
    const k2 = f(y2); for (let i = 0; i < n; i++) y3[i] = y[i] + 0.5 * h * k2[i];
    const k3 = f(y3); for (let i = 0; i < n; i++) y4[i] = y[i] + h * k3[i];
    const k4 = f(y4); for (let i = 0; i < n; i++) out[i] = y[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    return out;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  /* ---- Tiny SAFE expression parser (no eval / new Function). Recursive descent → closures.
   * Grammar: + - * / ^ ( ) , unary ±, implicit multiplication (2x, 3sin(x), x(x+1)), constants pi e tau,
   * variables x a b c t y, functions sin cos tan asin acos atan sinh cosh tanh exp ln log log2 sqrt abs floor ceil round sign, min max pow atan2 mod */
  const FN1 = { sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    exp: Math.exp, ln: Math.log, log: Math.log10, log10: Math.log10, log2: Math.log2, sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign };
  const FN2 = { min: Math.min, max: Math.max, pow: Math.pow, atan2: Math.atan2, mod: (p, q) => p - q * Math.floor(p / q) };
  const CONST = { pi: PI, e: Math.E, tau: TAU };
  const VARS = ["x", "a", "b", "c", "t", "y"];
  function tokenize(src) {
    const toks = []; let i = 0;
    while (i < src.length) {
      const ch = src[i], rest = src.slice(i); let m;
      if (/\s/.test(ch)) { i++; continue; }
      if ((m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(rest))) { toks.push({ t: "num", v: parseFloat(m[0]) }); i += m[0].length; continue; }
      if ((m = /^[a-zA-Z_][a-zA-Z0-9_]*/.exec(rest))) { toks.push({ t: "id", v: m[0].toLowerCase() }); i += m[0].length; continue; }
      if ("+-*/^(),".indexOf(ch) >= 0) { toks.push({ t: ch }); i++; continue; }
      if (ch === "−") { toks.push({ t: "-" }); i++; continue; }
      if (ch === "×" || ch === "·") { toks.push({ t: "*" }); i++; continue; }
      if (ch === "²") { toks.push({ t: "^" }, { t: "num", v: 2 }); i++; continue; }
      if (ch === "³") { toks.push({ t: "^" }, { t: "num", v: 3 }); i++; continue; }
      if (ch === "π") { toks.push({ t: "id", v: "pi" }); i++; continue; }
      throw new Error("unexpected character '" + ch + "'");
    }
    return toks;
  }
  function parseExpression(src) {
    const toks = tokenize(src); let p = 0;
    const peek = () => toks[p], next = () => toks[p++];
    const expect = (t) => { const k = next(); if (!k || k.t !== t) throw new Error("expected '" + t + "'"); return k; };
    function atom() {
      const k = next();
      if (!k) throw new Error("unexpected end of expression");
      if (k.t === "num") { const v = k.v; return () => v; }
      if (k.t === "(") { const e = add(); expect(")"); return e; }
      if (k.t === "id") {
        const name = k.v;
        if (FN1[name] || FN2[name]) {
          if (!peek() || peek().t !== "(") throw new Error(name + " needs parentheses, e.g. " + name + "(x)");
          next(); const args = [add()]; while (peek() && peek().t === ",") { next(); args.push(add()); } expect(")");
          if (FN1[name]) { if (args.length !== 1) throw new Error(name + " takes one argument"); const f = FN1[name], a0 = args[0]; return (s) => f(a0(s)); }
          if (args.length !== 2) throw new Error(name + " takes two arguments"); const g = FN2[name], b0 = args[0], b1 = args[1]; return (s) => g(b0(s), b1(s));
        }
        if (name in CONST) { const v = CONST[name]; return () => v; }
        if (VARS.indexOf(name) >= 0) return (s) => s[name];
        throw new Error("unknown name '" + name + "' (use x, a, b, c, pi, e)");
      }
      throw new Error("unexpected '" + k.t + "'");
    }
    function power() { const base = atom(); if (peek() && peek().t === "^") { next(); const ex = unary(); return (s) => Math.pow(base(s), ex(s)); } return base; }
    function unary() { const k = peek(); if (k && k.t === "-") { next(); const u = unary(); return (s) => -u(s); } if (k && k.t === "+") { next(); return unary(); } return power(); }
    function mul() {
      let l = unary();
      for (;;) {
        const k = peek(); if (!k) break;
        if (k.t === "*" || k.t === "/") { next(); const r = unary(), a = l; l = k.t === "*" ? (s) => a(s) * r(s) : (s) => a(s) / r(s); }
        else if (k.t === "num" || k.t === "id" || k.t === "(") { const r = unary(), a = l; l = (s) => a(s) * r(s); } /* implicit × */
        else break;
      }
      return l;
    }
    function add() {
      let l = mul();
      for (;;) {
        const k = peek(); if (!k || (k.t !== "+" && k.t !== "-")) break;
        next(); const r = mul(), a = l; l = k.t === "+" ? (s) => a(s) + r(s) : (s) => a(s) - r(s);
      }
      return l;
    }
    if (!toks.length) throw new Error("empty expression");
    const fn = add();
    if (p < toks.length) { const k = toks[p]; throw new Error("unexpected '" + (k.v != null ? k.v : k.t) + "'"); }
    return fn;
  }
  /** compile(src) → { f(x, {a,b,c,t,y}) → finite number or NaN, error, src }. Never throws. */
  function compile(src) {
    src = String(src == null ? "" : src);
    try {
      const fn = parseExpression(src), scope = { x: 0, a: 0, b: 0, c: 0, t: 0, y: 0 };
      const f = (x, extra) => {
        scope.x = x;
        if (extra) { scope.a = num(extra.a, 0); scope.b = num(extra.b, 0); scope.c = num(extra.c, 0); scope.t = num(extra.t, 0); scope.y = num(extra.y, 0); }
        const v = fn(scope); return Number.isFinite(v) ? v : NaN;
      };
      f(0.5); return { f, error: null, src };
    } catch (e) { return { f: null, error: e && e.message ? e.message : String(e), src }; }
  }

  /* ---- 2-D viewport: maths coordinates ↔ CSS pixels, nice axes, robust function plotting */
  function makeView(cv, xmin, xmax, ymin, ymax, pad) {
    const P = Object.assign({ l: 0, r: 0, t: 0, b: 0 }, pad || {});
    const W = cv.width || 600, H = cv.height || 340;
    if (!(xmax > xmin)) xmax = xmin + 1; if (!(ymax > ymin)) ymax = ymin + 1;
    const pw = Math.max(1, W - P.l - P.r), ph = Math.max(1, H - P.t - P.b);
    return { xmin, xmax, ymin, ymax, W, H, pad: P,
      px: (x) => P.l + (x - xmin) / (xmax - xmin) * pw, py: (y) => P.t + (ymax - y) / (ymax - ymin) * ph,
      mx: (px) => xmin + (px - P.l) / pw * (xmax - xmin), my: (py) => ymax - (py - P.t) / ph * (ymax - ymin) };
  }
  function niceStep(range, target) {
    if (!(range > 0) || !fin(range)) return 1;
    const raw = range / Math.max(1, target), p = Math.pow(10, Math.floor(Math.log10(raw))), r = raw / p;
    return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * p;
  }
  function drawAxes(ctx, v, C, opts) {
    opts = opts || {};
    ctx.save(); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, v.W, v.H); ctx.font = FONT; ctx.lineWidth = 1;
    const sx = niceStep(v.xmax - v.xmin, opts.xticks || Math.max(4, v.W / 70)), sy = niceStep(v.ymax - v.ymin, opts.yticks || Math.max(3, v.H / 50));
    const x0 = clamp(v.px(0), 0, v.W), y0 = clamp(v.py(0), 0, v.H);
    const i0 = Math.ceil(v.xmin / sx), i1 = Math.floor(v.xmax / sx), j0 = Math.ceil(v.ymin / sy), j1 = Math.floor(v.ymax / sy);
    if (i1 - i0 < 400) for (let i = i0; i <= i1; i++) {
      const x = i * sx, px = v.px(x); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, v.H); ctx.stroke();
      if (i !== 0 && opts.labels !== false) { ctx.fillStyle = C.muted; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(tick(x), px, clamp(y0 + 3, 2, v.H - 14)); }
    }
    if (j1 - j0 < 400) for (let j = j0; j <= j1; j++) {
      const y = j * sy, py = v.py(y); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(v.W, py); ctx.stroke();
      if (j !== 0 && opts.labels !== false) { ctx.fillStyle = C.muted; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(tick(y), clamp(x0 - 4, 28, v.W - 2), py); }
    }
    ctx.strokeStyle = C.axis; ctx.lineWidth = 1.2; ctx.beginPath();
    if (v.ymin <= 0 && v.ymax >= 0) { ctx.moveTo(0, y0); ctx.lineTo(v.W, y0); }
    if (v.xmin <= 0 && v.xmax >= 0) { ctx.moveTo(x0, 0); ctx.lineTo(x0, v.H); }
    ctx.stroke();
    ctx.fillStyle = C.muted;
    if (opts.xlabel) { ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(opts.xlabel, v.W - 6, y0 - 4); }
    if (opts.ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(opts.ylabel, x0 + 6, 4); }
    ctx.restore();
  }
  /** Plot y = f(x) across the view; skips NaN, clamps huge values and breaks the path at jump discontinuities / poles. */
  function plotFn(ctx, v, f, color, opts) {
    opts = opts || {};
    const n = opts.samples || Math.max(300, Math.round(v.W * 1.5)), span = v.ymax - v.ymin, lim = 20 * span;
    const xa = opts.xmin != null ? opts.xmin : v.xmin, xb = opts.xmax != null ? opts.xmax : v.xmax;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = opts.width || 2; if (opts.dash) ctx.setLineDash(opts.dash); if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    ctx.beginPath(); let pen = false, prev = NaN, prev2 = NaN;
    for (let i = 0; i <= n; i++) {
      const x = xa + (xb - xa) * i / n, y = f(x);
      if (!fin(y)) { pen = false; prev = prev2 = NaN; continue; }
      const brk = pen && fin(prev2) && Math.abs(y - prev) > 2 * span && (y - prev) * (prev - prev2) < 0;
      const px = v.px(x), py = v.py(clamp(y, v.ymin - lim, v.ymax + lim));
      if (!pen || brk) { ctx.moveTo(px, py); pen = true; prev2 = NaN; } else { ctx.lineTo(px, py); prev2 = prev; }
      prev = y;
    }
    ctx.stroke(); ctx.restore();
  }
  function text(ctx, s, x, y, color, align, base, font) { ctx.save(); ctx.font = font || FONT; ctx.fillStyle = color; ctx.textAlign = align || "left"; ctx.textBaseline = base || "alphabetic"; ctx.fillText(String(s), x, y); ctx.restore(); }
  function dot(ctx, x, y, r, color) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = color; ctx.fill(); ctx.restore(); }
  function line(ctx, x0, y0, x1, y1, color, w, dash) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w || 1; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); }
  function arrow(ctx, x0, y0, x1, y1, color, w) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (!(L > 1e-6)) return;
    const ux = dx / L, uy = dy / L, hs = Math.min(10, L * 0.45);
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w || 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * hs * 0.6, y1 - uy * hs * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - ux * hs - uy * hs * 0.45, y1 - uy * hs + ux * hs * 0.45); ctx.lineTo(x1 - ux * hs + uy * hs * 0.45, y1 - uy * hs - ux * hs * 0.45); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function onWheel(canvas, fn) { const h = (e) => { e.preventDefault(); fn(e); }; canvas.addEventListener("wheel", h, { passive: false }); return () => canvas.removeEventListener("wheel", h); }
  function bisect(f, lo, hi) { let flo = f(lo); for (let i = 0; i < 40; i++) { const m = 0.5 * (lo + hi), fm = f(m); if (!fin(fm)) break; if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } } return 0.5 * (lo + hi); }

  /* ============================== 1. function_plotter ============================== */
  Sims.register({
    id: "function_plotter", name: "Function Plotter", domains: ["mathematics"],
    description: "Type any f(x) with parameters a, b, c. Pan and zoom, mark zeros and extrema, and overlay the numerical derivative f′(x).",
    params: [
      { key: "expr", label: "f(x) =", type: "text", value: "a*sin(b*x) - x^2/10 + c" },
      { key: "a", label: "a", type: "range", min: -5, max: 5, step: 0.1, value: 1 },
      { key: "b", label: "b", type: "range", min: -5, max: 5, step: 0.1, value: 1 },
      { key: "c", label: "c", type: "range", min: -5, max: 5, step: 0.1, value: 1 },
      { key: "markers", label: "Mark zeros ● and extrema ◆", type: "toggle", value: true },
      { key: "deriv", label: "Overlay f′(x) (numerical)", type: "toggle", value: false },
    ],
    actions: [{ label: "Reset view", fn: (h) => h.resetView() }],
    challenges: [
      { id: "double_root", text: "With a = b = 1, slide c until the two outer zeros merge into a single touching point (a double root). What is f′ there?", xp: 15 },
      { id: "deriv_sign", text: "Overlay f′(x): check that every maximum of f sits where f′ crosses zero from + to −, and every minimum where it crosses from − to +.", xp: 10 },
      { id: "domain_gaps", text: "Type a formula using ln, sqrt or 1/(x−a). Explain every gap and asymptote in the picture from the domain of f.", xp: 15 },
      { id: "local_linear", text: "Zoom in (mouse wheel) on any smooth point until the curve looks like a straight line — local linearity is why derivatives work.", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx;
      const HOME = { xmin: -10, xmax: 10, ymin: -6, ymax: 6 };
      let view = Object.assign({}, HOME), compiled = compile(api.params.expr), hover = null, drag = null;
      const cleanups = [];
      const F = () => { const s = { a: num(api.params.a, 1), b: num(api.params.b, 1), c: num(api.params.c, 1) }, f = compiled.f; return f ? (x) => f(x, s) : () => NaN; };
      function features(f, v) { /* approximate zeros & extrema inside the view: sign changes refined by bisection */
        const zeros = [], ext = [], N = 600, dx = (v.xmax - v.xmin) / N, g = (x) => deriv(f, x, dx * 0.05), span = v.ymax - v.ymin;
        let px = v.xmin, pf = f(px), pg = g(px);
        for (let i = 1; i <= N && zeros.length + ext.length < 60; i++) {
          const x = v.xmin + i * dx, fx = f(x), gx = g(x);
          if (fin(pf) && fin(fx) && pf * fx < 0) zeros.push(bisect(f, px, x)); else if (fx === 0) zeros.push(x);
          if (fin(pg) && fin(gx) && (pg * gx < 0 || (gx === 0 && pg !== 0))) { const xe = gx === 0 ? x : bisect(g, px, x), ye = f(xe); if (fin(ye) && Math.abs(ye - fx) < 0.5 * span && Math.abs(g(xe)) < 0.5 * Math.max(Math.abs(pg), Math.abs(gx))) ext.push({ x: xe, y: ye, max: pg > 0 }); }
          px = x; pf = fx; pg = gx;
        }
        return { zeros, ext };
      }
      function draw() {
        const v = makeView(cv, view.xmin, view.xmax, view.ymin, view.ymax);
        drawAxes(ctx, v, C, { xlabel: "x", ylabel: "y" });
        if (!compiled.f) { text(ctx, "Parse error: " + compiled.error, 12, 24, C.danger); api.setStatus("Parse error: " + compiled.error); api.readout({ "f(x)": compiled.src, Status: "cannot parse — check the formula" }); return; }
        const f = F(), ro = { "f(x)": compiled.src, Window: `x ∈ [${fmt(v.xmin, 2)}, ${fmt(v.xmax, 2)}],  y ∈ [${fmt(v.ymin, 2)}, ${fmt(v.ymax, 2)}]` };
        if (api.params.deriv) plotFn(ctx, v, (x) => deriv(f, x, (v.xmax - v.xmin) * 1e-4), C.secondary, { dash: [6, 4], width: 1.5 });
        plotFn(ctx, v, f, C.primary);
        if (api.params.markers) {
          const ft = features(f, v);
          ft.zeros.forEach((z) => dot(ctx, v.px(z), v.py(0), 4.5, C.accent));
          ft.ext.forEach((e) => { ctx.save(); ctx.translate(v.px(e.x), v.py(e.y)); ctx.rotate(PI / 4); ctx.fillStyle = e.max ? C.ok : C.danger; ctx.fillRect(-4.5, -4.5, 9, 9); ctx.restore(); });
          ro["Zeros in view"] = ft.zeros.length ? ft.zeros.slice(0, 6).map((z) => fmt(z, 3)).join(", ") + (ft.zeros.length > 6 ? " …" : "") : "none";
          ro["Extrema in view"] = ft.ext.length ? ft.ext.slice(0, 4).map((e) => (e.max ? "max" : "min") + ` (${fmt(e.x, 2)}, ${fmt(e.y, 2)})`).join("; ") + (ft.ext.length > 4 ? " …" : "") : "none";
        }
        if (hover) { const y = f(hover.x); if (fin(y)) dot(ctx, v.px(hover.x), v.py(y), 4, C.text); ro.Cursor = `x = ${fmt(hover.x, 3)},  f(x) = ${fmt(y, 4)},  f′(x) ≈ ${fmt(deriv(f, hover.x, (v.xmax - v.xmin) * 1e-4), 4)}`; }
        text(ctx, "f(x)", v.W - 12, 16, C.primary, "right"); if (api.params.deriv) text(ctx, "f′(x)", v.W - 12, 32, C.secondary, "right");
        api.readout(ro);
        if (v.xmax - v.xmin < 0.05) api.award("local_linear");
      }
      api.pointer(cv.canvas, {
        down: (p) => { drag = { x: p.x, y: p.y, v: Object.assign({}, view) }; },
        move: (p) => {
          if (drag) {
            const dx = (p.x - drag.x) / Math.max(1, cv.width) * (drag.v.xmax - drag.v.xmin), dy = (p.y - drag.y) / Math.max(1, cv.height) * (drag.v.ymax - drag.v.ymin);
            view = { xmin: drag.v.xmin - dx, xmax: drag.v.xmax - dx, ymin: drag.v.ymin + dy, ymax: drag.v.ymax + dy };
          }
          const v = makeView(cv, view.xmin, view.xmax, view.ymin, view.ymax); hover = { x: v.mx(p.x), y: v.my(p.y) }; draw();
        },
        up: () => { drag = null; },
      });
      cleanups.push(onWheel(cv.canvas, (e) => {
        const v = makeView(cv, view.xmin, view.xmax, view.ymin, view.ymax), r = cv.canvas.getBoundingClientRect();
        const mx = v.mx(e.clientX - r.left), my = v.my(e.clientY - r.top), k = clamp(Math.exp(e.deltaY * 0.0015), 0.5, 2), span = (view.xmax - view.xmin) * k;
        if (span < 1e-7 || span > 1e7) return;
        view = { xmin: mx - (mx - view.xmin) * k, xmax: mx + (view.xmax - mx) * k, ymin: my - (my - view.ymin) * k, ymax: my + (view.ymax - my) * k }; draw();
      }));
      api.onParam((k) => { if (k === "expr") { compiled = compile(api.params.expr); if (compiled.f) api.setStatus("Drag to pan · wheel to zoom · a, b, c are live sliders."); } draw(); });
      api.onResize(draw);
      api.setStatus("Drag to pan · wheel to zoom. Use a, b, c in the formula; functions: sin cos tan exp ln log sqrt abs, constants pi e.");
      draw();
      return { resetView() { view = Object.assign({}, HOME); draw(); }, destroy() { cleanups.forEach((f) => f()); } };
    },
  });

  /* ============================== 2. derivative_explorer ============================== */
  const DX_PRESETS = { cubic: "x^3 - 3*x", square: "x^2", sin: "sin(x)", exp: "exp(x)", ln: "ln(x)", abs: "abs(x)", sqrt: "sqrt(x)" };
  Sims.register({
    id: "derivative_explorer", name: "Derivative Explorer", domains: ["mathematics"],
    description: "Watch the secant through x₀ and x₀ + h become the tangent as h → 0, and compare the difference quotient with f′(x₀).",
    params: [
      { key: "preset", label: "f(x)", type: "select", value: "cubic", options: [
        { value: "cubic", label: "x³ − 3x" }, { value: "square", label: "x²" }, { value: "sin", label: "sin x" }, { value: "exp", label: "eˣ" },
        { value: "ln", label: "ln x" }, { value: "abs", label: "|x|" }, { value: "sqrt", label: "√x" }, { value: "custom", label: "custom (type below)" }] },
      { key: "custom", label: "custom f(x)", type: "text", value: "x*sin(2*x)" },
      { key: "x0", label: "Point x₀", type: "range", min: -4, max: 4, step: 0.05, value: 1 },
      { key: "logh", label: "Step h = 10^(slider)", type: "range", min: -4, max: 0.5, step: 0.05, value: 0 },
      { key: "mode", label: "Difference quotient", type: "select", value: "forward", options: [
        { value: "forward", label: "forward  [f(x₀+h) − f(x₀)] / h" }, { value: "backward", label: "backward  [f(x₀) − f(x₀−h)] / h" }, { value: "central", label: "central  [f(x₀+h) − f(x₀−h)] / 2h" }] },
    ],
    challenges: [
      { id: "h_to_zero", text: "For x³ − 3x at x₀ = 1 (where f′ = 0), slide h toward 0 until the forward quotient is within 0.01 of f′. Roughly which h did it take?", xp: 15 },
      { id: "central_faster", text: "Switch to the central quotient and repeat: the error now falls like h² instead of h. Read the slope off the log–log inset.", xp: 15 },
      { id: "abs_kink", text: "Choose |x| with x₀ = 0: forward gives +1, backward −1, central 0. Explain why no tangent line exists there.", xp: 20 },
      { id: "exp_height", text: "For eˣ, verify at several x₀ that the tangent slope equals the height f(x₀).", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx;
      let compiled = compile(DX_PRESETS.cubic);
      const refresh = () => { const p = api.params.preset; compiled = compile(p === "custom" ? api.params.custom : (DX_PRESETS[p] || DX_PRESETS.cubic)); };
      const dqAt = (f, x0, h, mode) => mode === "forward" ? (f(x0 + h) - f(x0)) / h : mode === "backward" ? (f(x0) - f(x0 - h)) / h : (f(x0 + h) - f(x0 - h)) / (2 * h);
      const richardson = (f, x) => { const h = 1e-3, d1 = (f(x + h) - f(x - h)) / (2 * h), d2 = (f(x + h / 2) - f(x - h / 2)) / h; return (4 * d2 - d1) / 3; };
      function inset(f, x0, fp, mode, h) { /* log|error| versus log h */
        const iw = Math.min(210, cv.width * 0.34), ih = iw * 0.6, ox = cv.width - iw - 10, oy = cv.height - ih - 10;
        ctx.save(); ctx.fillStyle = "rgba(15,18,34,0.88)"; ctx.fillRect(ox, oy, iw, ih); ctx.strokeStyle = C.axis; ctx.strokeRect(ox, oy, iw, ih);
        const lx = (lh) => ox + (lh + 4) / 4.5 * iw, ly = (le) => oy + ih - (le + 10) / 11 * ih;
        ctx.strokeStyle = C.secondary; ctx.lineWidth = 1.5; ctx.beginPath(); let pen = false;
        for (let i = 0; i <= 80; i++) {
          const lh = -4 + 4.5 * i / 80, e = Math.abs(dqAt(f, x0, Math.pow(10, lh), mode) - fp);
          if (!fin(e)) { pen = false; continue; }
          const X = lx(lh), Y = ly(clamp(Math.log10(Math.max(e, 1e-10)), -10, 1)); if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();
        const ec = Math.abs(dqAt(f, x0, h, mode) - fp); if (fin(ec)) dot(ctx, lx(Math.log10(h)), ly(clamp(Math.log10(Math.max(ec, 1e-10)), -10, 1)), 4, C.accent);
        text(ctx, "log₁₀|quotient − f′|  vs  log₁₀ h", ox + 6, oy + 13, C.muted); text(ctx, "h → 0", ox + 4, oy + ih - 4, C.muted); text(ctx, "h = 3", ox + iw - 4, oy + ih - 4, C.muted, "right");
        ctx.restore();
      }
      function draw() {
        const W = cv.width, H = cv.height, f0 = compiled.f, f = f0 ? (x) => f0(x) : () => NaN;
        const x0 = num(api.params.x0, 1), h = Math.pow(10, num(api.params.logh, 0)), mode = api.params.mode || "forward";
        const v = makeView(cv, -5, 5, -4, 4);
        drawAxes(ctx, v, C, { xlabel: "x", ylabel: "y" });
        if (!f0) { text(ctx, "Parse error: " + compiled.error, 12, 20, C.danger); api.readout({ Error: compiled.error }); return; }
        plotFn(ctx, v, f, C.primary);
        const X1 = mode === "forward" ? x0 : x0 - h, X2 = mode === "backward" ? x0 : x0 + h, Y1 = f(X1), Y2 = f(X2), y0 = f(x0);
        const dq = dqAt(f, x0, h, mode), fp = richardson(f, x0);
        const dl = (f(x0) - f(x0 - 1e-6)) / 1e-6, dr = (f(x0 + 1e-6) - f(x0)) / 1e-6, kink = fin(dl) && fin(dr) && Math.abs(dl - dr) > 0.02 * (1 + Math.abs(dl) + Math.abs(dr));
        if (fin(dq) && fin(Y1)) plotFn(ctx, v, (x) => Y1 + dq * (x - X1), C.accent, { width: 1.5 });
        if (!kink && fin(fp) && fin(y0)) plotFn(ctx, v, (x) => y0 + fp * (x - x0), C.ok, { width: 2, dash: [8, 5] });
        if (fin(Y1) && fin(Y2)) {
          line(ctx, v.px(X1), v.py(Y1), v.px(X2), v.py(Y1), C.muted, 1, [3, 3]); line(ctx, v.px(X2), v.py(Y1), v.px(X2), v.py(Y2), C.muted, 1, [3, 3]);
          text(ctx, mode === "central" ? "Δx = 2h" : "Δx = h", v.px(0.5 * (X1 + X2)), v.py(Y1) + 14, C.muted, "center"); text(ctx, "Δy", v.px(X2) + 6, v.py(0.5 * (Y1 + Y2)), C.muted);
          dot(ctx, v.px(X1), v.py(Y1), 5, C.accent); dot(ctx, v.px(X2), v.py(Y2), 5, C.accent);
        }
        if (fin(y0)) { dot(ctx, v.px(x0), v.py(y0), 5, C.ok); text(ctx, "x₀", v.px(x0), v.py(0) - 6, C.ok, "center"); }
        text(ctx, "secant (difference quotient)", W - 12, 16, C.accent, "right"); text(ctx, kink ? "no tangent at x₀ (corner)" : "tangent, slope f′(x₀)", W - 12, 32, kink ? C.danger : C.ok, "right");
        inset(f, x0, fp, mode, h);
        const err = Math.abs(dq - fp);
        api.readout({ "f(x)": compiled.src, "x₀": fmt(x0, 3), h: fmt(h, 5), "f(x₀)": fmt(y0, 4), "Difference quotient": fmt(dq, 5),
          "f′(x₀) (Richardson estimate)": kink ? `undefined — left slope ${fmt(dl, 3)}, right slope ${fmt(dr, 3)}` : fmt(fp, 5), "|quotient − f′|": kink ? "—" : fmt(err, 6) });
        api.setStatus(kink ? "Left and right slopes disagree: f is not differentiable at x₀." : mode === "central" ? "Central differences: error ∝ h² (second order)." : "One-sided differences: error ∝ h (first order).");
        if (api.params.preset === "cubic" && Math.abs(x0 - 1) < 1e-9 && mode === "forward" && fin(err) && err < 0.01) api.award("h_to_zero");
      }
      api.onParam((k) => { if (k === "preset" || k === "custom") refresh(); draw(); });
      api.onResize(draw); refresh(); draw();
      return { destroy() {} };
    },
  });

  /* ============================== 3. riemann_sum ============================== */
  const RS_PRESETS = { square: "x^2", sin: "sin(x)", gauss: "exp(-x^2)", sqrt: "sqrt(x)", inv: "1/x", cubic: "x^3 - x" };
  const RS_NAMES = { left: "Left endpoint", right: "Right endpoint", mid: "Midpoint", trap: "Trapezoid", simpson: "Simpson" };
  Sims.register({
    id: "riemann_sum", name: "Riemann Sums & Numerical Integration", domains: ["mathematics"],
    description: "Approximate ∫ₐᵇ f(x) dx with left, right, midpoint, trapezoid or Simpson rules and watch how fast each error shrinks as n grows.",
    params: [
      { key: "preset", label: "f(x)", type: "select", value: "square", options: [
        { value: "square", label: "x²" }, { value: "sin", label: "sin x" }, { value: "gauss", label: "e^(−x²)" }, { value: "sqrt", label: "√x" },
        { value: "inv", label: "1/x" }, { value: "cubic", label: "x³ − x" }, { value: "custom", label: "custom (type below)" }] },
      { key: "custom", label: "custom f(x)", type: "text", value: "sin(x) + x/3" },
      { key: "a", label: "a (lower limit)", type: "range", min: -5, max: 5, step: 0.1, value: 0 },
      { key: "b", label: "b (upper limit)", type: "range", min: -5, max: 5, step: 0.1, value: 3 },
      { key: "n", label: "n subintervals", type: "range", min: 1, max: 200, step: 1, value: 8 },
      { key: "method", label: "Rule", type: "select", value: "left", options: [
        { value: "left", label: "Left endpoint" }, { value: "right", label: "Right endpoint" }, { value: "mid", label: "Midpoint" }, { value: "trap", label: "Trapezoid" }, { value: "simpson", label: "Simpson (parabolas)" }] },
    ],
    challenges: [
      { id: "double_n", text: "Double n and watch the error: it roughly halves for left/right, quarters for midpoint/trapezoid and drops ~16× for Simpson. Confirm with the Error(n)/Error(2n) readout.", xp: 15 },
      { id: "mid_vs_trap", text: "On x² the midpoint error is about half the trapezoid error and has the opposite sign. Explain both facts with concavity.", xp: 15 },
      { id: "simpson_cubic", text: "Simpson's rule is exact for cubics: choose x³ − x with n = 2 and check the error is (numerically) zero.", xp: 15 },
      { id: "improper", text: "Choose 1/x with a = −1, b = 1. Why can no n rescue the estimate — what kind of integral is this?", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx;
      let compiled = compile(RS_PRESETS.square);
      const refresh = () => { const p = api.params.preset; compiled = compile(p === "custom" ? api.params.custom : (RS_PRESETS[p] || RS_PRESETS.square)); };
      function estimate(f, a, b, n, method) {
        if (method === "simpson") n = Math.max(2, 2 * Math.ceil(n / 2));
        const h = (b - a) / n; let s = 0;
        for (let i = 0; i < n; i++) {
          const x0 = a + i * h, x1 = x0 + h;
          if (method === "left") s += f(x0) * h; else if (method === "right") s += f(x1) * h; else if (method === "mid") s += f(0.5 * (x0 + x1)) * h;
          else if (method === "trap") s += 0.5 * (f(x0) + f(x1)) * h; else if (i % 2 === 0) s += (f(x0) + 4 * f(x1) + f(x1 + h)) * h / 3;
        }
        return s;
      }
      function draw() {
        const H = cv.height, f0 = compiled.f, f = f0 ? (x) => f0(x) : () => NaN, method = RS_NAMES[api.params.method] ? api.params.method : "left";
        let a = num(api.params.a, 0), b = num(api.params.b, 3); const n = clamp(Math.round(num(api.params.n, 8)), 1, 400), sign = b < a ? -1 : 1;
        if (b < a) { const t = a; a = b; b = t; }
        const span = Math.max(1, b - a); let lo = 0, hi = 0;
        for (let i = 0; i <= 200; i++) { const y = f(a + (b - a) * i / 200); if (fin(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
        lo = Math.max(lo, -40); hi = Math.min(hi, 40); const yr = Math.max(1, hi - lo);
        const v = makeView(cv, a - 0.3 * span, b + 0.3 * span, lo - 0.15 * yr, hi + 0.25 * yr);
        drawAxes(ctx, v, C, { xlabel: "x", ylabel: "y" });
        if (!f0) { text(ctx, "Parse error: " + compiled.error, 12, 20, C.danger); api.readout({ Error: compiled.error }); return; }
        const nn = method === "simpson" ? Math.max(2, 2 * Math.ceil(n / 2)) : n, h = (b - a) / nn;
        ctx.save(); ctx.lineWidth = 1;
        for (let i = 0; i < nn; i++) {
          const x0 = a + i * h, x1 = x0 + h, col = C.series[i % 2 ? 0 : 5]; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.globalAlpha = 0.28;
          if (method === "simpson") {
            if (i % 2) continue; const x2 = x1 + h, y0 = f(x0), y1 = f(x1), y2 = f(x2); if (!fin(y0) || !fin(y1) || !fin(y2)) continue;
            ctx.beginPath(); ctx.moveTo(v.px(x0), v.py(0));
            for (let k = 0; k <= 16; k++) { const t = 2 * k / 16, y = y0 * (t - 1) * (t - 2) / 2 - y1 * t * (t - 2) + y2 * t * (t - 1) / 2; ctx.lineTo(v.px(x0 + t * h), v.py(y)); }
            ctx.lineTo(v.px(x2), v.py(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.9; ctx.stroke(); continue;
          }
          let yl, yr2; if (method === "left") yl = yr2 = f(x0); else if (method === "right") yl = yr2 = f(x1); else if (method === "mid") yl = yr2 = f(0.5 * (x0 + x1)); else { yl = f(x0); yr2 = f(x1); }
          if (!fin(yl) || !fin(yr2)) continue;
          ctx.beginPath(); ctx.moveTo(v.px(x0), v.py(0)); ctx.lineTo(v.px(x0), v.py(yl)); ctx.lineTo(v.px(x1), v.py(yr2)); ctx.lineTo(v.px(x1), v.py(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.9; ctx.stroke();
          if (method === "mid") dot(ctx, v.px(0.5 * (x0 + x1)), v.py(yl), 2.5, col);
        }
        ctx.restore();
        plotFn(ctx, v, f, C.primary);
        line(ctx, v.px(a), 0, v.px(a), H, C.muted, 1, [4, 4]); line(ctx, v.px(b), 0, v.px(b), H, C.muted, 1, [4, 4]);
        text(ctx, "a = " + fmt(a, 2), v.px(a) + 4, 14, C.muted); text(ctx, "b = " + fmt(b, 2), v.px(b) + 4, 14, C.muted);
        /* numbers: estimate at n and 2n, high-resolution reference integral (two Simpson resolutions must agree) */
        const est = sign * estimate(f, a, b, n, method), est2 = sign * estimate(f, a, b, 2 * n, method);
        let ref = b > a ? NaN : 0, bad = false;
        for (let i = 0; i <= 60; i++) if (!fin(f(a + (b - a) * (i + 0.5) / 61))) bad = true;
        if (!bad && b > a) { const r1 = simpson(f, a, b, 2000), r2 = simpson(f, a, b, 4000); ref = sign * r2; if (!fin(r1) || !fin(r2) || Math.abs(r1 - r2) > 1e-3 * (1 + Math.abs(r2))) bad = true; }
        const err = est - ref, err2 = est2 - ref;
        const ro = { "f(x)": compiled.src, Rule: RS_NAMES[method] + (method === "simpson" && nn !== n ? ` (n rounded up to ${nn}, must be even)` : ""), n: String(nn), Estimate: fmt(est, 6) };
        if (bad || !fin(ref)) { ro["Reference ∫"] = "undefined or divergent on [a, b]"; api.setStatus("f is singular or undefined somewhere in [a, b] — the sums cannot converge to a finite value."); }
        else {
          ro["Reference ∫ (Simpson, 4000 slices)"] = fmt(ref, 6); ro.Error = fmt(err, 6);
          ro["Error(n) / Error(2n)"] = fin(err2) && Math.abs(err2) > 1e-12 ? fmt(err / err2, 2) + "   (≈2 first-order, ≈4 second-order, ≈16 fourth-order)" : "exact to machine precision";
          api.setStatus(method === "left" || method === "right" ? "Endpoint rules: error ∝ 1/n — sign tells you whether f is increasing or decreasing." : method === "simpson" ? "Simpson fits a parabola through each pair of slices: error ∝ 1/n⁴ (exact for cubics)." : "Midpoint & trapezoid: error ∝ 1/n² with opposite signs when f is convex or concave.");
          text(ctx, `${RS_NAMES[method]}, n = ${nn}:  ${fmt(est, 5)}   (∫ ≈ ${fmt(ref, 5)})`, 12, H - 10, C.text);
        }
        api.readout(ro);
      }
      api.onParam((k) => { if (k === "preset" || k === "custom") refresh(); draw(); });
      api.onResize(draw); refresh(); draw();
      return { destroy() {} };
    },
  });

  /* ============================== 4. taylor_series ============================== */
  Sims.register({
    id: "taylor_series", name: "Taylor Series Explorer", domains: ["mathematics"],
    description: "Build Taylor polynomials of growing degree about a centre a, and see where they converge to f — and where no degree will ever help.",
    params: [
      { key: "fn", label: "f(x)", type: "select", value: "sin", options: [
        { value: "sin", label: "sin x" }, { value: "cos", label: "cos x" }, { value: "exp", label: "eˣ" }, { value: "ln1p", label: "ln(1 + x)" }, { value: "geom", label: "1 / (1 − x)" }, { value: "atan", label: "arctan x" }] },
      { key: "a", label: "Centre a", type: "range", min: -2, max: 2, step: 0.1, value: 0 },
      { key: "n", label: "Degree n", type: "range", min: 0, max: 30, step: 1, value: 5 },
      { key: "showR", label: "Show interval of convergence", type: "toggle", value: true },
    ],
    actions: [{ label: "▶ Animate 0 → n", fn: (h) => h.animate() }],
    challenges: [
      { id: "ln_radius", text: "Pick ln(1 + x) at a = 0 and push n to 30. Why does Tₙ track f only on (−1, 1] no matter how large n gets?", xp: 15 },
      { id: "geometric_wall", text: "For 1/(1 − x), move the centre a: the convergence interval always ends at x = 1. Explain it with the distance to the singularity.", xp: 15 },
      { id: "arctan_hidden", text: "arctan has no real singularity, yet its series at a = 0 fails beyond |x| = 1. What limits it? (Think complex plane: ±i.)", xp: 20 },
      { id: "even_odd", text: "sin at a = 0 uses only odd powers, cos only even. Check the coefficient readout and relate it to the symmetry of each function.", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx;
      const fact = (k) => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
      const FNS = {
        sin: { f: Math.sin, coef: (a, n) => { const c = []; for (let k = 0; k <= n; k++) c.push(Math.sin(a + k * PI / 2) / fact(k)); return c; }, R: () => Infinity },
        cos: { f: Math.cos, coef: (a, n) => { const c = []; for (let k = 0; k <= n; k++) c.push(Math.cos(a + k * PI / 2) / fact(k)); return c; }, R: () => Infinity },
        exp: { f: Math.exp, coef: (a, n) => { const c = [], ea = Math.exp(a); for (let k = 0; k <= n; k++) c.push(ea / fact(k)); return c; }, R: () => Infinity },
        ln1p: { f: (x) => Math.log(1 + x), coef: (a, n) => { const c = [Math.log(1 + a)]; for (let k = 1; k <= n; k++) c.push((k % 2 ? 1 : -1) / (k * Math.pow(1 + a, k))); return c; }, R: (a) => 1 + a, dom: (a) => a > -1 },
        geom: { f: (x) => 1 / (1 - x), coef: (a, n) => { const c = []; for (let k = 0; k <= n; k++) c.push(1 / Math.pow(1 - a, k + 1)); return c; }, R: (a) => Math.abs(1 - a), dom: (a) => Math.abs(a - 1) > 1e-9 },
        atan: { f: Math.atan, R: (a) => Math.sqrt(1 + a * a), coef: (a, n) => { /* 1/(1+x²) expanded about a via (α+βu+u²)Σdₖuᵏ = 1, then integrate term-wise */
          const al = 1 + a * a, be = 2 * a, d = [1 / al]; for (let k = 1; k <= n; k++) d.push(-(be * d[k - 1] + (k >= 2 ? d[k - 2] : 0)) / al);
          const c = [Math.atan(a)]; for (let k = 1; k <= n; k++) c.push(d[k - 1] / k); return c; } },
      };
      const poly = (c, a) => (x) => { let s = 0, u = x - a, p = 1; for (let k = 0; k < c.length; k++) { s += c[k] * p; p *= u; } return s; };
      let shown = null, anim = null;
      function termStr(ck, k, a) { const base = Math.abs(a) < 1e-9 ? "x" : `(x ${a < 0 ? "+" : "−"} ${fmt(Math.abs(a), 2)})`; return (k === 0 ? fmt(ck, 4) : (Math.abs(Math.abs(ck) - 1) < 1e-12 ? (ck < 0 ? "−" : "") : fmt(ck, 4) + "·") + base + (k > 1 ? sup(k) : "")); }
      function draw() {
        const W = cv.width, H = cv.height, key = FNS[api.params.fn] ? api.params.fn : "sin", F = FNS[key];
        const a = num(api.params.a, 0), nMax = clamp(Math.round(num(api.params.n, 5)), 0, 60), n = shown == null ? nMax : Math.min(shown, nMax);
        const v = makeView(cv, -6, 6, -4, 4);
        drawAxes(ctx, v, C, { xlabel: "x", ylabel: "y" });
        if (F.dom && !F.dom(a)) { text(ctx, "f is not defined at this centre — move a.", 12, 20, C.danger); api.readout({ Centre: fmt(a), Status: "f undefined at the centre" }); api.setStatus(key === "ln1p" ? "ln(1 + x) needs a > −1: there is a singularity at x = −1." : "1/(1 − x) has a pole at x = 1 — no Taylor series exists there."); return; }
        const R = F.R(a), c = F.coef(a, n), T = poly(c, a);
        if (api.params.showR && fin(R)) {
          ctx.save(); ctx.fillStyle = C.ok; ctx.globalAlpha = 0.08; ctx.fillRect(v.px(a - R), 0, v.px(a + R) - v.px(a - R), H); ctx.restore();
          line(ctx, v.px(a - R), 0, v.px(a - R), H, C.ok, 1, [5, 4]); line(ctx, v.px(a + R), 0, v.px(a + R), H, C.ok, 1, [5, 4]);
          text(ctx, "a − R", v.px(a - R) + 4, H - 8, C.ok); text(ctx, "a + R", v.px(a + R) + 4, H - 8, C.ok);
        }
        plotFn(ctx, v, F.f, C.primary, { width: 2.5 });
        plotFn(ctx, v, T, C.accent, { width: 2 });
        line(ctx, v.px(a), 0, v.px(a), H, C.secondary, 1, [2, 4]); if (fin(F.f(a))) dot(ctx, v.px(a), v.py(F.f(a)), 5, C.secondary);
        text(ctx, "f(x)", W - 12, 16, C.primary, "right"); text(ctx, "T" + sub(n) + "(x)", W - 12, 32, C.accent, "right");
        const xin = fin(R) ? a + 0.5 * R : a + 1, xout = fin(R) ? a + 1.5 * R : a + 3, eIn = Math.abs(F.f(xin) - T(xin)), eOut = Math.abs(F.f(xout) - T(xout));
        const terms = c.map((ck, k) => ({ ck, k })).filter((t) => Math.abs(t.ck) > 1e-12).slice(0, 6);
        let series = terms.map((t, i) => (i && t.ck > 0 ? "+ " : i ? "− " : "") + termStr(i ? Math.abs(t.ck) : t.ck, t.k, a)).join(" ");
        if (c.filter((ck) => Math.abs(ck) > 1e-12).length > 6) series += " + …";
        api.readout({ "Degree shown": String(n) + (shown != null && shown < nMax ? `  (animating → ${nMax})` : ""), "Radius of convergence R": fin(R) ? fmt(R, 3) + " (distance to nearest singularity)" : "∞",
          "Converges for": fin(R) ? `|x − a| < ${fmt(R, 3)}` : "every real x", [`|f − Tₙ| at x = ${fmt(xin, 2)} (inside)`]: fmt(eIn, 6), [`|f − Tₙ| at x = ${fmt(xout, 2)} (${fin(R) ? "outside" : "far"})`]: fmt(eOut, 4),
          "Tₙ(x)": series || "0" });
        api.setStatus(fin(R) ? "Inside |x − a| < R the error → 0 as n grows; outside, higher degree makes it worse." : "Entire function: the Taylor series converges everywhere (but slowly far from a).");
      }
      api.onParam(() => { shown = null; draw(); }); api.onResize(draw); draw();
      return {
        animate() { if (anim) anim.stop(); shown = 0; let acc = 0; draw(); anim = api.loop((dt) => { acc += dt; if (acc < 0.4) return true; acc = 0; const nMax = clamp(Math.round(num(api.params.n, 5)), 0, 60); if (shown == null || shown >= nMax) { shown = null; draw(); return false; } shown++; draw(); return true; }); },
        destroy() { if (anim) anim.stop(); },
      };
    },
  });

  /* ============================== 5. matrix_transform ============================== */
  const MT_PRESETS = { identity: [1, 0, 0, 1], rot45: [0.7071, -0.7071, 0.7071, 0.7071], rot90: [0, -1, 1, 0], shear: [1, 1, 0, 1], scale: [2, 0, 0, 0.5], reflectx: [1, 0, 0, -1], reflectdiag: [0, 1, 1, 0], project: [1, 0, 0, 0], symmetric: [2, 1, 1, 2], saddle: [1.5, 0, 0, -1] };
  Sims.register({
    id: "matrix_transform", name: "2×2 Matrix Transformations", domains: ["mathematics", "ai"],
    description: "See a 2×2 matrix act on the plane: transformed grid, unit square, basis vectors, eigenvectors with eigenvalues and the determinant as signed area.",
    params: [
      { key: "preset", label: "Preset", type: "select", value: "symmetric", options: [
        { value: "custom", label: "custom (sliders)" }, { value: "identity", label: "Identity" }, { value: "rot45", label: "Rotation 45°" }, { value: "rot90", label: "Rotation 90°" }, { value: "shear", label: "Shear" },
        { value: "scale", label: "Scaling 2 × ½" }, { value: "reflectx", label: "Reflection in x-axis" }, { value: "reflectdiag", label: "Reflection in y = x" }, { value: "project", label: "Projection onto x-axis" }, { value: "symmetric", label: "Symmetric [[2,1],[1,2]]" }, { value: "saddle", label: "Stretch & flip" }] },
      { key: "m11", label: "a₁₁", type: "range", min: -3, max: 3, step: 0.05, value: 2 },
      { key: "m12", label: "a₁₂", type: "range", min: -3, max: 3, step: 0.05, value: 1 },
      { key: "m21", label: "a₂₁", type: "range", min: -3, max: 3, step: 0.05, value: 1 },
      { key: "m22", label: "a₂₂", type: "range", min: -3, max: 3, step: 0.05, value: 2 },
      { key: "t", label: "Interpolate I → A  (t)", type: "range", min: 0, max: 1, step: 0.01, value: 1 },
      { key: "eig", label: "Show eigenvectors", type: "toggle", value: true },
    ],
    actions: [{ label: "▶ Animate I → A", fn: (h) => h.animate() }],
    challenges: [
      { id: "det_zero", text: "Make det A = 0 (e.g. the projection preset). What happens to the grid, and why can the map not be undone?", xp: 15 },
      { id: "eigen_shear", text: "A shear has a single eigenvector direction. Find it on screen and explain why λ = 1 appears twice but gives only one direction.", xp: 15 },
      { id: "rotation_complex", text: "Rotation by 45° shows no real eigenvectors. Animate I → A: is there any direction that is never turned?", xp: 15 },
      { id: "symmetric_orthogonal", text: "For the symmetric matrix [[2,1],[1,2]] the eigenvectors are perpendicular. Nudge one slider to make A non-symmetric — does that survive?", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10 }), ctx = cv.ctx;
      let applying = false, anim = null;
      const mat = () => [num(api.params.m11, 1), num(api.params.m12, 0), num(api.params.m21, 0), num(api.params.m22, 1)];
      function eigen2(A) {
        const tr = A[0] + A[3], det = A[0] * A[3] - A[1] * A[2], disc = tr * tr - 4 * det;
        if (disc < -1e-12) return { real: false, tr, det, re: tr / 2, im: Math.sqrt(-disc) / 2 };
        const s = Math.sqrt(Math.max(0, disc)), vals = [(tr + s) / 2, (tr - s) / 2];
        const vec = (l) => { let u; if (Math.abs(A[1]) > 1e-9) u = [A[1], l - A[0]]; else if (Math.abs(A[2]) > 1e-9) u = [l - A[3], A[2]]; else u = Math.abs(A[0] - l) <= Math.abs(A[3] - l) ? [1, 0] : [0, 1]; const nn = Math.hypot(u[0], u[1]) || 1; return [u[0] / nn, u[1] / nn]; };
        const repeated = s < 1e-9, offdiag = Math.abs(A[1]) > 1e-9 || Math.abs(A[2]) > 1e-9;
        const vecs = repeated ? (offdiag ? [vec(vals[0])] : [[1, 0], [0, 1]]) : [vec(vals[0]), vec(vals[1])];
        return { real: true, tr, det, vals, vecs, repeated, defective: repeated && offdiag, scalar: repeated && !offdiag };
      }
      function draw() {
        const W = cv.width, H = cv.height, unit = Math.min(W, H) / 8.5;
        const v = makeView(cv, -W / 2 / unit, W / 2 / unit, -H / 2 / unit, H / 2 / unit);
        const A = mat(), t = clamp(num(api.params.t, 1), 0, 1), M = [1 + t * (A[0] - 1), t * A[1], t * A[2], 1 + t * (A[3] - 1)];
        const ap = (x, y) => [M[0] * x + M[1] * y, M[2] * x + M[3] * y];
        drawAxes(ctx, v, C, { labels: false });
        ctx.save(); ctx.strokeStyle = C.primary; ctx.globalAlpha = 0.4; ctx.lineWidth = 1;
        for (let i = -10; i <= 10; i++) {
          let p = ap(i, -10), q = ap(i, 10); ctx.beginPath(); ctx.moveTo(v.px(p[0]), v.py(p[1])); ctx.lineTo(v.px(q[0]), v.py(q[1])); ctx.stroke();
          p = ap(-10, i); q = ap(10, i); ctx.beginPath(); ctx.moveTo(v.px(p[0]), v.py(p[1])); ctx.lineTo(v.px(q[0]), v.py(q[1])); ctx.stroke();
        }
        ctx.restore();
        const det = M[0] * M[3] - M[1] * M[2], detA = A[0] * A[3] - A[1] * A[2], sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map((p) => ap(p[0], p[1]));
        ctx.save(); ctx.beginPath(); sq.forEach((p, i) => { if (i) ctx.lineTo(v.px(p[0]), v.py(p[1])); else ctx.moveTo(v.px(p[0]), v.py(p[1])); }); ctx.closePath();
        ctx.fillStyle = det < 0 ? C.danger : C.accent; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = det < 0 ? C.danger : C.accent; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
        const cx = sq.reduce((s, p) => s + p[0], 0) / 4, cy = sq.reduce((s, p) => s + p[1], 0) / 4;
        text(ctx, "area = |det| = " + fmt(Math.abs(det), 2), v.px(cx), v.py(cy), C.text, "center", "middle");
        const e1 = ap(1, 0), e2 = ap(0, 1);
        arrow(ctx, v.px(0), v.py(0), v.px(e1[0]), v.py(e1[1]), C.series[6], 3); text(ctx, "A î", v.px(e1[0]) + 6, v.py(e1[1]) - 6, C.series[6]);
        arrow(ctx, v.px(0), v.py(0), v.px(e2[0]), v.py(e2[1]), C.secondary, 3); text(ctx, "A ĵ", v.px(e2[0]) + 6, v.py(e2[1]) - 6, C.secondary);
        const eg = eigen2(A), ro = { A: `[[${fmt(A[0], 2)}, ${fmt(A[1], 2)}], [${fmt(A[2], 2)}, ${fmt(A[3], 2)}]]`, "det A (signed area factor)": fmt(detA, 3) + (detA < 0 ? "  — orientation flipped" : Math.abs(detA) < 1e-9 ? "  — plane collapses to a line/point" : "  — orientation preserved"), "trace A": fmt(eg.tr, 3) };
        if (eg.real) {
          if (api.params.eig) eg.vecs.forEach((u, i) => {
            line(ctx, v.px(-u[0] * 20), v.py(-u[1] * 20), v.px(u[0] * 20), v.py(u[1] * 20), C.ok, 1.2, [8, 6]);
            const lam = eg.vals[Math.min(i, eg.vals.length - 1)]; arrow(ctx, v.px(0), v.py(0), v.px(u[0] * lam), v.py(u[1] * lam), C.ok, 2.5);
            text(ctx, `λ${sub(i + 1)} = ${fmt(lam, 2)}`, v.px(u[0] * 2.6) + 4, v.py(u[1] * 2.6) - 4, C.ok);
          });
          ro.Eigenvalues = eg.repeated ? `λ = ${fmt(eg.vals[0], 3)} (repeated)` : `λ₁ = ${fmt(eg.vals[0], 3)},  λ₂ = ${fmt(eg.vals[1], 3)}`;
          ro.Eigenvectors = eg.scalar ? "every direction (scalar matrix)" : eg.defective ? `only one direction: (${fmt(eg.vecs[0][0], 2)}, ${fmt(eg.vecs[0][1], 2)}) — defective` : eg.vecs.map((u) => `(${fmt(u[0], 2)}, ${fmt(u[1], 2)})`).join("  and  ");
          if (!eg.scalar && !eg.defective) ro["Angle between eigenvectors"] = fmt(Math.acos(clamp(Math.abs(eg.vecs[0][0] * eg.vecs[1][0] + eg.vecs[0][1] * eg.vecs[1][1]), 0, 1)) * 180 / PI, 1) + "°";
        } else { ro.Eigenvalues = `complex: ${fmt(eg.re, 3)} ± ${fmt(eg.im, 3)}i  (no real eigenvectors — rotation-like)`; }
        ro["Interpolation t"] = fmt(t, 2) + "   M(t) = (1 − t)·I + t·A";
        text(ctx, "A î", 12, 16, C.series[6]); text(ctx, "A ĵ", 44, 16, C.secondary); text(ctx, "eigen-directions", 76, 16, C.ok); text(ctx, "unit square → parallelogram", 12, 32, C.accent);
        api.readout(ro);
      }
      api.onParam((k) => {
        if (k === "preset" && MT_PRESETS[api.params.preset]) { applying = true; const P = MT_PRESETS[api.params.preset]; ["m11", "m12", "m21", "m22"].forEach((key, i) => api.setParam(key, P[i])); applying = false; }
        else if (k[0] === "m" && !applying && api.params.preset !== "custom") { applying = true; api.setParam("preset", "custom"); applying = false; }
        draw();
      });
      api.onResize(draw); draw();
      api.setStatus("Slide t to morph the identity into A. Eigenvectors are the directions A only stretches (by λ).");
      return {
        animate() { if (anim) anim.stop(); let tt = 0; api.setParam("t", 0); anim = api.loop((dt) => { tt = Math.min(1, tt + dt / 2.2); api.setParam("t", Math.round(tt * 100) / 100); return tt < 1; }); },
        destroy() { if (anim) anim.stop(); },
      };
    },
  });

  /* ============================== 6. distribution_explorer ============================== */
  Sims.register({
    id: "distribution_explorer", name: "Probability Distribution Explorer", domains: ["mathematics", "ai"],
    description: "Shape classic distributions, draw random samples, and watch the Central Limit Theorem turn means of skewed data into a bell curve.",
    params: [
      { key: "dist", label: "Distribution", type: "select", value: "normal", options: [
        { value: "normal", label: "Normal(μ, σ)" }, { value: "binomial", label: "Binomial(n, p)" }, { value: "poisson", label: "Poisson(λ)" }, { value: "exponential", label: "Exponential(rate λ)" },
        { value: "uniform", label: "Uniform(a, b)" }, { value: "beta", label: "Beta(α, β)" }, { value: "t", label: "Student t(ν)" }] },
      { key: "p1", label: "Parameter slider 1 (meaning in status line)", type: "range", min: 0, max: 1, step: 0.01, value: 0.5 },
      { key: "p2", label: "Parameter slider 2", type: "range", min: 0, max: 1, step: 0.01, value: 0.3 },
      { key: "nSamp", label: "Samples to draw", type: "range", min: 10, max: 5000, step: 10, value: 500 },
      { key: "clt", label: "CLT mode: histogram of sample means", type: "toggle", value: false },
      { key: "k", label: "k = draws averaged per mean (CLT)", type: "range", min: 1, max: 100, step: 1, value: 25 },
    ],
    actions: [{ label: "🎲 Sample", fn: (h) => h.sample() }, { label: "Clear samples", fn: (h) => h.clear() }],
    challenges: [
      { id: "clt_shape", text: "Pick the (very skewed) exponential, switch on CLT mode and raise k. From what k on do the sample means look bell-shaped?", xp: 15 },
      { id: "binomial_normal", text: "Binomial with large n: for which p does the pmf look normal, and when does it look like a Poisson instead?", xp: 15 },
      { id: "t_tails", text: "Compare Student t with ν = 1 against the normal and sample repeatedly: why does the sample variance never settle down?", xp: 20 },
      { id: "sd_shrinks", text: "In CLT mode compare the predicted σ/√k with the observed spread of the means for k = 1, 4, 16 and 64.", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, R = api.random;
      const randn = () => { let u = 0; while (u === 0) u = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * R()); };
      function randGamma(sh) { /* Marsaglia–Tsang, shape sh, scale 1 */
        if (sh < 1) return randGamma(sh + 1) * Math.pow(Math.max(R(), 1e-12), 1 / sh);
        const d = sh - 1 / 3, c = 1 / Math.sqrt(9 * d);
        for (let i = 0; i < 200; i++) { let x, w; do { x = randn(); w = 1 + c * x; } while (w <= 0); w = w * w * w; const u = R(); if (u < 1 - 0.0331 * x * x * x * x || Math.log(u) < 0.5 * x * x + d * (1 - w + Math.log(w))) return d * w; }
        return d;
      }
      const lchoose = (n, k) => lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
      function model() {
        const p1 = clamp(num(api.params.p1, 0.5), 0, 1), p2 = clamp(num(api.params.p2, 0.3), 0, 1);
        switch (api.params.dist) {
          case "binomial": { const n = 1 + Math.round(49 * p1), p = 0.02 + 0.96 * p2; return { label: `Binomial(n = ${n}, p = ${fmt(p, 2)})`, map: "slider 1 → n ∈ [1, 50], slider 2 → p ∈ [0.02, 0.98]", discrete: true, lo: -0.5, hi: n + 0.5, mean: n * p, vari: n * p * (1 - p),
            pdf: (k) => (k < 0 || k > n ? 0 : Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p))), draw: () => { let s = 0; for (let i = 0; i < n; i++) if (R() < p) s++; return s; } }; }
          case "poisson": { const lam = 0.2 + 19.8 * p1; return { label: `Poisson(λ = ${fmt(lam, 2)})`, map: "slider 1 → λ ∈ [0.2, 20]  (slider 2 unused)", discrete: true, lo: -0.5, hi: Math.ceil(lam + 4 * Math.sqrt(lam) + 2) + 0.5, mean: lam, vari: lam,
            pdf: (k) => (k < 0 ? 0 : Math.exp(k * Math.log(lam) - lam - lgamma(k + 1))), draw: () => { const L = Math.exp(-lam); let k = 0, p = R(); while (p > L && k < 1000) { k++; p *= R(); } return k; } }; }
          case "exponential": { const lam = 0.1 + 2.9 * p1; return { label: `Exponential(rate λ = ${fmt(lam, 2)})`, map: "slider 1 → λ ∈ [0.1, 3]  (slider 2 unused)", discrete: false, lo: -0.3 / lam, hi: 6 / lam, mean: 1 / lam, vari: 1 / (lam * lam),
            pdf: (x) => (x < 0 ? 0 : lam * Math.exp(-lam * x)), draw: () => -Math.log(1 - R()) / lam }; }
          case "uniform": { const a = -4 + 4 * p1, w = 0.5 + 7.5 * p2, b = a + w; return { label: `Uniform(a = ${fmt(a, 2)}, b = ${fmt(b, 2)})`, map: "slider 1 → a ∈ [−4, 0], slider 2 → width b − a ∈ [0.5, 8]", discrete: false, lo: a - 0.25 * w, hi: b + 0.25 * w, mean: (a + b) / 2, vari: w * w / 12,
            pdf: (x) => (x >= a && x <= b ? 1 / w : 0), draw: () => a + w * R() }; }
          case "beta": { const al = 0.3 + 9.7 * p1, be = 0.3 + 9.7 * p2, lb = lgamma(al) + lgamma(be) - lgamma(al + be); return { label: `Beta(α = ${fmt(al, 2)}, β = ${fmt(be, 2)})`, map: "slider 1 → α, slider 2 → β  (both in [0.3, 10])", discrete: false, lo: -0.05, hi: 1.05, mean: al / (al + be), vari: al * be / ((al + be) * (al + be) * (al + be + 1)),
            pdf: (x) => (x <= 0 || x >= 1 ? 0 : Math.exp((al - 1) * Math.log(x) + (be - 1) * Math.log(1 - x) - lb)), draw: () => { const g1 = randGamma(al), g2 = randGamma(be); return g1 / (g1 + g2); } }; }
          case "t": { const nu = 1 + Math.round(29 * p1), lc = lgamma((nu + 1) / 2) - lgamma(nu / 2) - 0.5 * Math.log(nu * PI); return { label: `Student t(ν = ${nu})`, map: "slider 1 → ν ∈ [1, 30]  (slider 2 unused)", discrete: false, lo: -8, hi: 8, mean: nu > 1 ? 0 : NaN, vari: nu > 2 ? nu / (nu - 2) : Infinity,
            pdf: (x) => Math.exp(lc - (nu + 1) / 2 * Math.log(1 + x * x / nu)), draw: () => randn() / Math.sqrt(2 * randGamma(nu / 2) / nu) }; }
          default: { const mu = -4 + 8 * p1, sg = 0.1 + 3 * p2; return { label: `Normal(μ = ${fmt(mu, 2)}, σ = ${fmt(sg, 2)})`, map: "slider 1 → μ ∈ [−4, 4], slider 2 → σ ∈ [0.1, 3.1]", discrete: false, lo: mu - 4.5 * sg, hi: mu + 4.5 * sg, mean: mu, vari: sg * sg,
            pdf: (x) => Math.exp(-0.5 * Math.pow((x - mu) / sg, 2)) / (sg * Math.sqrt(TAU)), draw: () => mu + sg * randn() }; }
        }
      }
      let samples = [], sampleK = 1, sampleCLT = false;
      function draw() {
        const W = cv.width, H = cv.height, M = model(), clt = !!api.params.clt, k = clamp(Math.round(num(api.params.k, 25)), 1, 1000);
        const sd = Math.sqrt(M.vari), sdMean = fin(sd) ? sd / Math.sqrt(k) : NaN;
        let lo = M.lo, hi = M.hi;
        if (clt && fin(M.mean) && fin(sdMean) && k > 1) { const half = Math.max(4.5 * sdMean, (M.hi - M.lo) * 0.02); lo = M.mean - half; hi = M.mean + half; }
        let ymax = 1e-9;
        if (clt && fin(sdMean) && sdMean > 0) ymax = 1 / (sdMean * Math.sqrt(TAU));
        else if (M.discrete) { for (let i = Math.max(0, Math.ceil(lo)); i <= hi; i++) ymax = Math.max(ymax, M.pdf(i)); }
        else for (let i = 0; i <= 400; i++) { const y = M.pdf(lo + (hi - lo) * i / 400); if (fin(y)) ymax = Math.max(ymax, Math.min(y, 50)); }
        const v = makeView(cv, lo, hi, -0.05 * ymax * 1.25, ymax * 1.25, { l: 8, r: 8, t: 8, b: 8 });
        drawAxes(ctx, v, C, { xlabel: clt ? "sample mean" : "x", ylabel: M.discrete && !clt ? "probability" : "density" });
        /* histogram of samples (density-normalised) */
        const ro = { Distribution: M.label, "Mean (theory)": fmt(M.mean, 4), "Variance (theory)": fin(M.vari) ? fmt(M.vari, 4) + "   SD = " + fmt(sd, 4) : (M.vari === Infinity ? "infinite" : "undefined") };
        if (samples.length) {
          const n = samples.length, mean = samples.reduce((s, x) => s + x, 0) / n, vari = samples.reduce((s, x) => s + (x - mean) * (x - mean), 0) / Math.max(1, n - 1);
          const integerBins = M.discrete && !sampleCLT; const B = integerBins ? Math.round(hi - lo) : clamp(Math.round(Math.sqrt(n)), 10, 60), bw = (hi - lo) / B, counts = new Array(B).fill(0);
          samples.forEach((x) => { const i = Math.floor((x - lo) / bw); if (i >= 0 && i < B) counts[i]++; });
          ctx.save(); ctx.fillStyle = sampleCLT ? C.series[4] : C.series[3]; ctx.globalAlpha = 0.45;
          counts.forEach((c, i) => { const d = c / (n * bw), x0 = v.px(lo + i * bw), x1 = v.px(lo + (i + 1) * bw); ctx.fillRect(x0 + 0.5, v.py(d), Math.max(1, x1 - x0 - 1), v.py(0) - v.py(d)); });
          ctx.restore();
          ro[sampleCLT ? `Means drawn (each of k = ${sampleK})` : "Samples drawn"] = String(n); ro["Sample mean"] = fmt(mean, 4); ro["Sample variance"] = fmt(vari, 4) + "   SD = " + fmt(Math.sqrt(vari), 4);
          if (sampleCLT) { ro["Predicted SD of mean σ/√k"] = fin(sd) ? fmt(sd / Math.sqrt(sampleK), 4) : "undefined (infinite variance → CLT fails)"; ro["Observed SD of means"] = fmt(Math.sqrt(vari), 4); }
        }
        /* theoretical pdf / pmf */
        if (M.discrete && !clt) { ctx.save(); ctx.fillStyle = C.primary; ctx.globalAlpha = 0.75; for (let i = Math.max(0, Math.ceil(lo)); i <= hi; i++) { const p = M.pdf(i), w = Math.max(2, (v.px(1) - v.px(0)) * 0.5); ctx.fillRect(v.px(i) - w / 2, v.py(p), w, v.py(0) - v.py(p)); } ctx.restore(); }
        else plotFn(ctx, v, M.pdf, C.primary, { width: 2, samples: 800, alpha: clt ? 0.5 : 1 });
        if (clt && fin(sdMean) && sdMean > 0) { plotFn(ctx, v, (x) => Math.exp(-0.5 * Math.pow((x - M.mean) / sdMean, 2)) / (sdMean * Math.sqrt(TAU)), C.accent, { width: 2, dash: [7, 5] }); text(ctx, "CLT prediction: Normal(μ, σ/√k)", W - 12, 32, C.accent, "right"); }
        if (clt && !(fin(sdMean) && sdMean > 0)) text(ctx, "variance infinite/undefined — the CLT does not apply", W - 12, 32, C.danger, "right");
        text(ctx, M.discrete && !clt ? "pmf" : "pdf of " + M.label, W - 12, 16, C.primary, "right");
        if (samples.length) text(ctx, sampleCLT ? "histogram of sample means" : "histogram of samples", W - 12, 48, sampleCLT ? C.series[4] : C.series[3], "right");
        api.readout(ro); api.setStatus(M.map + (clt ? "  ·  CLT mode: each sample is the mean of k draws." : "  ·  Press Sample to draw random values."));
      }
      api.onParam((key) => { if (["dist", "p1", "p2", "clt", "k"].indexOf(key) >= 0) samples = []; draw(); });
      api.onResize(draw); draw();
      return {
        sample() { const M = model(), n = clamp(Math.round(num(api.params.nSamp, 500)), 1, 20000), clt = !!api.params.clt, k = clamp(Math.round(num(api.params.k, 25)), 1, 1000);
          samples = []; sampleCLT = clt; sampleK = k;
          for (let i = 0; i < n; i++) { if (clt) { let s = 0; for (let j = 0; j < k; j++) s += M.draw(); samples.push(s / k); } else samples.push(M.draw()); }
          samples = samples.filter(fin); draw(); },
        clear() { samples = []; draw(); },
        destroy() {},
      };
    },
  });

  /* ============================== 7. regression_fit ============================== */
  Sims.register({
    id: "regression_fit", name: "Least-Squares Regression Lab", domains: ["mathematics", "ai"],
    description: "Click to place points, drag to move them. Fit polynomials by least squares and watch residuals, R², RMSE — and catch overfitting with leave-one-out error.",
    params: [
      { key: "degree", label: "Polynomial degree", type: "range", min: 1, max: 5, step: 1, value: 1 },
      { key: "resid", label: "Show residuals", type: "toggle", value: true },
      { key: "pattern", label: "Generate: pattern", type: "select", value: "linear", options: [
        { value: "linear", label: "linear trend" }, { value: "quadratic", label: "parabola" }, { value: "sine", label: "sine wave" }, { value: "outlier", label: "linear + one outlier" }] },
      { key: "noise", label: "Generate: noise σ", type: "range", min: 0, max: 2, step: 0.05, value: 0.5 },
      { key: "count", label: "Generate: number of points", type: "range", min: 4, max: 60, step: 1, value: 12 },
    ],
    actions: [{ label: "🎲 Generate data", fn: (h) => h.generate() }, { label: "Undo last point", fn: (h) => h.undo() }, { label: "Clear", fn: (h) => h.clear() }],
    challenges: [
      { id: "overfit", text: "With ~8 noisy points raise the degree to 5: training RMSE falls but leave-one-out RMSE rises — overfitting. Which degree minimises the LOO error?", xp: 20 },
      { id: "leverage", text: "Add one far-away point and drag it around. How much does a degree-1 line pivot? Which points have the most leverage, and why?", xp: 15 },
      { id: "r2_blind", text: "Generate the parabola pattern and fit degree 1: R² is near 0 despite an obvious pattern. What does R² actually measure?", xp: 15 },
      { id: "resid_zero", text: "Check in the readout that the residuals of any least-squares fit with an intercept sum to zero. Why must that happen?", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10 }), ctx = cv.ctx, R = api.random;
      const randn = () => { let u = 0; while (u === 0) u = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * R()); };
      const PAD = { l: 34, r: 12, t: 10, b: 22 }, view = () => makeView(cv, -0.5, 10.5, -0.5, 10.5, PAD);
      let pts = [], dragging = null;
      function solve(G, n) { /* Gaussian elimination with partial pivoting on an augmented n×(n+1) matrix */
        for (let c = 0; c < n; c++) {
          let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(G[r][c]) > Math.abs(G[p][c])) p = r;
          if (Math.abs(G[p][c]) < 1e-12) return null; const tmp = G[c]; G[c] = G[p]; G[p] = tmp;
          for (let r = 0; r < n; r++) if (r !== c) { const f = G[r][c] / G[c][c]; for (let k = c; k <= n; k++) G[r][k] -= f * G[c][k]; }
        }
        return G.map((row, i) => row[n] / row[i]);
      }
      function fit(data, deg) { /* normal equations in the scaled variable u = (x − 5)/5, then expanded back to powers of x */
        deg = Math.min(deg, data.length - 1); if (deg < 0) return null;
        const G = []; for (let i = 0; i <= deg; i++) G.push(new Array(deg + 2).fill(0));
        data.forEach((p) => { const u = (p.x - 5) / 5, pw = [1]; for (let k = 1; k <= deg; k++) pw.push(pw[k - 1] * u);
          for (let i = 0; i <= deg; i++) { for (let j = 0; j <= deg; j++) G[i][j] += pw[i] * pw[j]; G[i][deg + 1] += pw[i] * p.y; } });
        const bu = solve(G, deg + 1); if (!bu) return null;
        let coef = [bu[deg]];
        for (let k = deg - 1; k >= 0; k--) { const nc = new Array(coef.length + 1).fill(0); coef.forEach((cv2, i) => { nc[i] += cv2 * (-1); nc[i + 1] += cv2 / 5; }); nc[0] += bu[k]; coef = nc; }
        const f = (x) => { let r = 0; for (let k = coef.length - 1; k >= 0; k--) r = r * x + coef[k]; return r; };
        return { coef, f, deg };
      }
      function metrics(data, F) {
        const n = data.length, ybar = data.reduce((s, p) => s + p.y, 0) / n; let sse = 0, sst = 0, sum = 0;
        data.forEach((p) => { const r = p.y - F.f(p.x); sse += r * r; sst += (p.y - ybar) ** 2; sum += r; });
        let loo = NaN; if (n - 1 > F.deg + 0) { let s = 0, m = 0; data.forEach((p, i) => { const g = fit(data.filter((_, j) => j !== i), F.deg); if (g) { s += (p.y - g.f(p.x)) ** 2; m++; } }); loo = m ? Math.sqrt(s / m) : NaN; }
        return { sse, sst, r2: sst > 1e-12 ? 1 - sse / sst : NaN, rmse: Math.sqrt(sse / n), sum, loo };
      }
      function eqn(F) { return "ŷ = " + F.coef.map((c, k) => (k === 0 ? fmt(c, 3) : (c < 0 ? "− " : "+ ") + fmt(Math.abs(c), 3) + "·x" + (k > 1 ? sup(k) : ""))).join(" "); }
      function draw() {
        const v = view(), deg = clamp(Math.round(num(api.params.degree, 1)), 1, 5);
        drawAxes(ctx, v, C, { xlabel: "x", ylabel: "y" });
        const F = pts.length >= 2 ? fit(pts, deg) : null;
        if (F) {
          plotFn(ctx, v, F.f, C.accent, { xmin: 0, xmax: 10, width: 2.2, samples: 400 });
          if (api.params.resid) pts.forEach((p) => line(ctx, v.px(p.x), v.py(p.y), v.px(p.x), v.py(F.f(p.x)), C.danger, 1.5));
        }
        pts.forEach((p, i) => { dot(ctx, v.px(p.x), v.py(p.y), i === dragging ? 7 : 5, C.primary); });
        text(ctx, F ? eqn(F) : pts.length < 2 ? "add at least 2 points" : "need points with distinct x values", v.W - 12, 16, C.accent, "right");
        if (!F) { api.readout({ Points: String(pts.length), Hint: "click on the canvas to add points" }); api.setStatus("Click to add points, drag to move them, or press Generate data."); return; }
        const m = metrics(pts, F), ro = { Points: String(pts.length), "Fitted degree": String(F.deg) + (F.deg < deg ? ` (reduced: need > ${deg} points for degree ${deg})` : ""), Equation: eqn(F) };
        if (F.deg === 1) { ro.Slope = fmt(F.coef[1], 4); ro.Intercept = fmt(F.coef[0], 4); }
        ro["R² (fraction of variance explained)"] = fmt(m.r2, 4); ro["RMSE (training)"] = fmt(m.rmse, 4); ro["LOO-CV RMSE (held-out)"] = fin(m.loo) ? fmt(m.loo, 4) : "— (need more points)"; ro["Σ residuals"] = fmt(m.sum, 6);
        api.readout(ro);
        api.setStatus(fin(m.loo) && m.rmse > 1e-6 && m.loo > 1.5 * m.rmse && F.deg > 1 ? "Held-out error ≫ training error: the polynomial is fitting noise (overfitting)." : "Least squares minimises Σ(residual)². Drag points to feel their leverage.");
      }
      function generate() {
        const n = clamp(Math.round(num(api.params.count, 12)), 2, 200), sg = num(api.params.noise, 0.5), pat = api.params.pattern; pts = [];
        for (let i = 0; i < n; i++) { const x = 0.5 + 9 * R(); let y = pat === "quadratic" ? 9 - 0.33 * (x - 5) ** 2 : pat === "sine" ? 5 + 3 * Math.sin(x) : 1.5 + 0.7 * x; y += sg * randn(); pts.push({ x, y: clamp(y, 0, 10) }); }
        if (pat === "outlier") pts.push({ x: 9.2, y: 0.6 });
        pts.sort((p, q) => p.x - q.x); draw();
      }
      api.pointer(cv.canvas, {
        down(p) { const v = view(); let best = -1, bd = 14; pts.forEach((q, i) => { const d = Math.hypot(v.px(q.x) - p.x, v.py(q.y) - p.y); if (d < bd) { bd = d; best = i; } });
          if (best >= 0) dragging = best; else if (pts.length < 200) { pts.push({ x: clamp(v.mx(p.x), 0, 10), y: clamp(v.my(p.y), 0, 10) }); dragging = pts.length - 1; } draw(); },
        move(p) { if (dragging == null) return; const v = view(); pts[dragging] = { x: clamp(v.mx(p.x), 0, 10), y: clamp(v.my(p.y), 0, 10) }; draw(); },
        up() { dragging = null; draw(); },
      });
      api.onParam(draw); api.onResize(draw); generate();
      return { generate, undo() { pts.pop(); draw(); }, clear() { pts = []; draw(); }, destroy() {} };
    },
  });

  /* ============================== 8. fourier_series ============================== */
  Sims.register({
    id: "fourier_series", name: "Fourier Series & Epicycles", domains: ["mathematics", "physics"],
    description: "Add harmonics one at a time: rotating epicycles trace the partial sum of a square, sawtooth, triangle or pulse wave. Watch Gibbs ringing and Parseval's energy count.",
    params: [
      { key: "wave", label: "Target waveform", type: "select", value: "square", options: [
        { value: "square", label: "Square" }, { value: "sawtooth", label: "Sawtooth" }, { value: "triangle", label: "Triangle" }, { value: "pulse", label: "Pulse (25 % duty)" }] },
      { key: "N", label: "Harmonics N", type: "range", min: 1, max: 50, step: 1, value: 5 },
      { key: "speed", label: "Rotation speed", type: "range", min: 0, max: 3, step: 0.1, value: 1 },
      { key: "epi", label: "Show epicycles", type: "toggle", value: true },
    ],
    challenges: [
      { id: "gibbs_persist", text: "Raise N for the square wave: the ringing gets narrower but the overshoot stays ≈ 9 % of the jump. That is the Gibbs phenomenon — why doesn't it vanish?", xp: 15 },
      { id: "decay_rates", text: "Compare the coefficient bars: square and sawtooth amplitudes decay like 1/n, the triangle like 1/n². Which feature of f sets the rate?", xp: 15 },
      { id: "parseval", text: "How many harmonics does the triangle need to capture 99 % of the energy? And the square wave? (Parseval readout.)", xp: 15 },
      { id: "odd_only", text: "Why does the square wave contain only odd harmonics? Switch to the pulse and watch even harmonics appear.", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx;
      const wrap = (x) => { x = (x + PI) % TAU; if (x < 0) x += TAU; return x - PI; };
      const WAVES = { /* period 2π; a0 is the mean; ms = mean square (1/2π)∫f²; jump = size of the discontinuity */
        square: { f: (x) => (wrap(x) >= 0 ? 1 : -1), a0: 0, an: () => 0, bn: (n) => (n % 2 ? 4 / (n * PI) : 0), ms: 1, jump: 2, hi: 1 },
        sawtooth: { f: (x) => wrap(x) / PI, a0: 0, an: () => 0, bn: (n) => 2 * (n % 2 ? 1 : -1) / (n * PI), ms: 1 / 3, jump: 2, hi: 1 },
        triangle: { f: (x) => 1 - 2 * Math.abs(wrap(x)) / PI, a0: 0, an: (n) => (n % 2 ? 8 / (n * n * PI * PI) : 0), bn: () => 0, ms: 1 / 3, jump: 0, hi: 1 },
        pulse: { f: (x) => (Math.abs(wrap(x)) < PI / 4 ? 1 : 0), a0: 0.25, an: (n) => 2 * Math.sin(n * PI / 4) / (n * PI), bn: () => 0, ms: 0.25, jump: 1, hi: 1 },
      };
      let theta = 0, info = null;
      function coefs() { const Wv = WAVES[api.params.wave] || WAVES.square, N = clamp(Math.round(num(api.params.N, 5)), 1, 60), terms = []; for (let n = 1; n <= N; n++) { const a = Wv.an(n), b = Wv.bn(n); terms.push({ n, a, b, r: Math.hypot(a, b), psi: Math.atan2(a, b) }); } return { Wv, N, terms }; }
      function partial(cf, x) { let s = cf.Wv.a0; for (let i = 0; i < cf.terms.length; i++) { const t = cf.terms[i]; s += t.a * Math.cos(t.n * x) + t.b * Math.sin(t.n * x); } return s; }
      function analyse(cf) {
        let mx = -Infinity; for (let i = 0; i < 4000; i++) mx = Math.max(mx, partial(cf, -PI + TAU * i / 4000));
        const over = cf.Wv.jump > 0 ? Math.max(0, mx - cf.Wv.hi) / cf.Wv.jump * 100 : 0;
        let energy = cf.Wv.a0 * cf.Wv.a0; cf.terms.forEach((t) => { energy += 0.5 * t.r * t.r; });
        return { over, mx, energy: energy / cf.Wv.ms * 100, next: Math.hypot(cf.Wv.an(cf.N + 1), cf.Wv.bn(cf.N + 1)) };
      }
      function refresh() {
        const cf = coefs(), an = analyse(cf); info = { cf, an };
        const nz = cf.terms.filter((t) => t.r > 1e-12).map((t) => t.n);
        api.readout({ Waveform: String(api.params.wave), "Harmonics N": String(cf.N), "Max of partial sum": fmt(an.mx, 4),
          "Overshoot beyond the jump": cf.Wv.jump > 0 ? fmt(an.over, 2) + " % of the jump   (Gibbs limit ≈ 8.95 %)" : "none — the target is continuous",
          "Energy captured (Parseval)": fmt(an.energy, 2) + " %", ["Next omitted amplitude r" + sub(cf.N + 1)]: fmt(an.next, 4),
          "Harmonics present": nz.slice(0, 8).join(", ") + (nz.length > 8 ? ", …" : "") });
        api.setStatus(cf.Wv.jump > 0 ? "Discontinuous target: the overshoot never dies out (≈ 9 % of the jump) — it only gets narrower as N grows." : "Continuous target: amplitudes decay like 1/n², so the partial sums converge uniformly (no Gibbs ringing).");
      }
      function draw() {
        const W = cv.width, H = cv.height, cf = info.cf, an = info.an;
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        const barH = Math.min(96, H * 0.26), plotH = H - barH, showEpi = !!api.params.epi, epiW = showEpi ? Math.min(plotH, W * 0.38) : 0;
        const cx = epiW / 2, cy = plotH / 2 + 6, scale = plotH * 0.3;
        let x = cx, y = cy - scale * cf.Wv.a0;
        if (showEpi) {
          ctx.save(); ctx.lineWidth = 1;
          cf.terms.forEach((t) => {
            if (t.r < 1e-12) return; const ang = t.n * theta + t.psi, nx = x + scale * t.r * Math.cos(ang), ny = y - scale * t.r * Math.sin(ang);
            ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(x, y, scale * t.r, 0, TAU); ctx.stroke();
            ctx.globalAlpha = 1; ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke(); x = nx; y = ny;
          });
          ctx.restore(); dot(ctx, x, y, 3.5, C.accent); text(ctx, "epicycles: radius rₙ, angular speed n", 10, 16, C.muted);
        }
        const x0 = epiW + 24, pw = Math.max(40, W - x0 - 12), span = 2.5 * TAU, sx = (s) => x0 + s / span * pw, sy = (val) => cy - scale * val;
        line(ctx, x0, cy, W - 12, cy, C.axis, 1); line(ctx, x0, cy - 1.4 * scale, x0, cy + 1.4 * scale, C.axis, 1);
        text(ctx, "+1", x0 - 18, cy - scale + 4, C.muted); text(ctx, "−1", x0 - 18, cy + scale + 4, C.muted); text(ctx, "← time (newest at left)", W - 14, cy + 1.4 * scale + 14, C.muted, "right");
        ctx.save(); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); let prevVal = NaN;
        for (let i = 0; i <= 500; i++) { const s = span * i / 500, val = cf.Wv.f(theta - s), X = sx(s), Y = sy(val); if (i === 0 || Math.abs(val - prevVal) > 0.5) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); prevVal = val; }
        ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = C.primary; ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i <= 700; i++) { const s = span * i / 700, X = sx(s), Y = sy(partial(cf, theta - s)); if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
        ctx.stroke(); ctx.restore();
        const yNow = sy(partial(cf, theta)); if (showEpi) line(ctx, x, y, x0, yNow, C.accent, 1, [3, 3]); dot(ctx, x0, yNow, 4, C.primary);
        text(ctx, "target f", W - 14, 16, C.muted, "right"); text(ctx, "partial sum S" + sub(cf.N), W - 14, 32, C.primary, "right");
        if (cf.Wv.jump > 0) { line(ctx, x0, sy(an.mx), W - 12, sy(an.mx), C.danger, 1, [2, 4]); text(ctx, "peak " + fmt(an.mx, 3) + " → overshoot " + fmt(an.over, 1) + " % of jump", x0 + 6, sy(an.mx) - 5, C.danger); }
        const by = H - 14, bw = Math.max(2, Math.min(18, (W - 70) / cf.N - 3)), rmax = Math.max(1e-9, ...cf.terms.map((t) => t.r));
        text(ctx, "amplitude rₙ = √(aₙ² + bₙ²) of harmonic n", 48, H - barH + 12, C.muted);
        cf.terms.forEach((t, i) => { const h = (t.r / rmax) * (barH - 30), X = 48 + i * (bw + 3); ctx.fillStyle = t.r > 1e-12 ? C.series[2] : C.grid; ctx.fillRect(X, by - Math.max(1, h), bw, Math.max(1, h)); if (cf.N <= 25 || i % 5 === 4) text(ctx, String(t.n), X + bw / 2, H - 3, C.muted, "center", "bottom"); });
      }
      api.onParam(() => { refresh(); draw(); }); api.onResize(draw); refresh(); draw();
      const loop = api.loop((dt) => { theta += dt * clamp(num(api.params.speed, 1), 0, 10); if (theta > 1e6) theta -= 1e6; draw(); return true; });
      return { destroy() { loop.stop(); } };
    },
  });

  /* ============================== 9. phase_portrait ============================== */
  Sims.register({
    id: "phase_portrait", name: "Phase Portrait Lab", domains: ["mathematics", "physics", "robotics"],
    description: "Vector field, nullclines and RK4 trajectories for classic 2-D autonomous systems. Click anywhere to launch a trajectory from that initial condition.",
    params: [
      { key: "sys", label: "System", type: "select", value: "lv", options: [
        { value: "lv", label: "Predator–prey (Lotka–Volterra)" }, { value: "pend", label: "Damped pendulum" }, { value: "vdp", label: "van der Pol oscillator" }, { value: "lin", label: "Linear x′ = A x (matrix sliders)" }] },
      { key: "p1", label: "p₁ = α prey growth · c damping · μ", type: "range", min: 0, max: 3, step: 0.05, value: 1 },
      { key: "p2", label: "p₂ = γ predator death · g/L", type: "range", min: 0.1, max: 3, step: 0.05, value: 1 },
      { key: "m11", label: "A₁₁ (linear system)", type: "range", min: -2, max: 2, step: 0.1, value: 0.5 },
      { key: "m12", label: "A₁₂", type: "range", min: -2, max: 2, step: 0.1, value: 1 },
      { key: "m21", label: "A₂₁", type: "range", min: -2, max: 2, step: 0.1, value: 1 },
      { key: "m22", label: "A₂₂", type: "range", min: -2, max: 2, step: 0.1, value: -0.5 },
      { key: "nullc", label: "Show nullclines", type: "toggle", value: true },
      { key: "field", label: "Show vector field", type: "toggle", value: true },
    ],
    actions: [{ label: "Seed examples", fn: (h) => h.seed() }, { label: "Clear trajectories", fn: (h) => h.clear() }],
    challenges: [
      { id: "lv_cycles", text: "Predator–prey: every click gives a closed loop around (γ, α). The linearisation only says 'centre' — use the conserved H = x − γ·ln x + y − α·ln y to argue the loops really close.", xp: 20 },
      { id: "pendulum_basins", text: "Damped pendulum: click near θ = π (inverted). Which starts fall to θ = 0 and which to θ = 2π? Sketch the separatrix between the basins.", xp: 15 },
      { id: "vdp_limit", text: "van der Pol: start inside and outside the loop — both trajectories end on the same limit cycle. Change μ and describe how its shape changes.", xp: 15 },
      { id: "linear_zoo", text: "Linear system: use the matrix sliders to produce a saddle, a centre and a stable spiral; relate each to the trace/determinant readout.", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10 }), ctx = cv.ctx;
      const SYS = {
        lv: { eq: "x′ = x(α − y),   y′ = y(x − γ)", box: [0, 4, 0, 4], T: 30, f: (p) => (s) => [s[0] * (p.p1 - s[1]), s[1] * (s[0] - p.p2)], eqs: (p) => [[0, 0], [p.p2, p.p1]], seeds: (p) => [[p.p2 + 0.4, p.p1 + 0.4], [p.p2 + 1, p.p1 + 1], [p.p2 + 1.6, p.p1 + 1.6], [0.3, 0.3]] },
        pend: { eq: "θ′ = ω,   ω′ = −(g/L)·sin θ − c·ω", box: [-7, 7, -4, 4], T: 25, f: (p) => (s) => [s[1], -p.p2 * Math.sin(s[0]) - p.p1 * s[1]], eqs: () => [[0, 0], [PI, 0], [-PI, 0]], seeds: () => [[-6.5, 3.6], [6.5, -3.6], [-3, 0], [3, 0], [0, 2.5], [PI + 0.15, 0], [PI - 0.15, 0]] },
        vdp: { eq: "x′ = y,   y′ = μ(1 − x²)y − x", box: [-4, 4, -4, 4], T: 30, f: (p) => (s) => [s[1], p.p1 * (1 - s[0] * s[0]) * s[1] - s[0]], eqs: () => [[0, 0]], seeds: () => [[0.1, 0.1], [3.5, 3.5], [-3.5, 1]] },
        lin: { eq: "x′ = a₁₁x + a₁₂y,   y′ = a₂₁x + a₂₂y", box: [-3, 3, -3, 3], T: 12, f: (p) => (s) => [p.m11 * s[0] + p.m12 * s[1], p.m21 * s[0] + p.m22 * s[1]], eqs: () => [[0, 0]], seeds: () => [[2.5, 2.5], [-2.5, 2.5], [2.5, -2.5], [-2.5, -2.5], [0.3, 2.5], [-0.3, -2.5], [2.5, 0.3], [-2.5, -0.3]] },
      };
      const P = () => ({ p1: num(api.params.p1, 1), p2: num(api.params.p2, 1), m11: num(api.params.m11, 0.5), m12: num(api.params.m12, 1), m21: num(api.params.m21, 1), m22: num(api.params.m22, -0.5) });
      const cur = () => SYS[api.params.sys] || SYS.lv;
      const view = () => { const b = cur().box; return makeView(cv, b[0], b[1], b[2], b[3]); };
      let trajs = [], time = 0, bgDirty = true; const bg = document.createElement("canvas");
      function integrate(x0, y0) {
        const S = cur(), F = S.f(P()), b = S.box, h = 0.01, margin = Math.max(b[1] - b[0], b[3] - b[2]); let s = [x0, y0]; const pts = [s];
        for (let i = 0, n = Math.round(S.T / h); i < n; i++) { s = rk4(F, s, h); if (!fin(s[0]) || !fin(s[1]) || s[0] < b[0] - margin || s[0] > b[1] + margin || s[1] < b[2] - margin || s[1] > b[3] + margin) break; pts.push(s); }
        return pts;
      }
      function contour(g, b, N, M) { /* marching squares: zero-level segments of g(x, y) over the box */
        const segs = [], dx = (b[1] - b[0]) / N, dy = (b[3] - b[2]) / M, val = [];
        for (let j = 0; j <= M; j++) { const row = []; for (let i = 0; i <= N; i++) { const z = g(b[0] + i * dx, b[2] + j * dy); row.push(fin(z) ? z : NaN); } val.push(row); }
        for (let j = 0; j < M; j++) for (let i = 0; i < N; i++) {
          const c = [[b[0] + i * dx, b[2] + j * dy, val[j][i]], [b[0] + (i + 1) * dx, b[2] + j * dy, val[j][i + 1]], [b[0] + (i + 1) * dx, b[2] + (j + 1) * dy, val[j + 1][i + 1]], [b[0] + i * dx, b[2] + (j + 1) * dy, val[j + 1][i]]];
          if (!fin(c[0][2]) || !fin(c[1][2]) || !fin(c[2][2]) || !fin(c[3][2])) continue;
          const pts = [];
          for (let k = 0; k < 4; k++) { const A = c[k], B = c[(k + 1) % 4]; if ((A[2] < 0) !== (B[2] < 0)) { const t = A[2] / (A[2] - B[2]); pts.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]); } }
          if (pts.length >= 2) segs.push([pts[0], pts[1]]); if (pts.length === 4) segs.push([pts[2], pts[3]]);
        }
        return segs;
      }
      function classify(J) {
        const tr = J[0] + J[3], det = J[0] * J[3] - J[1] * J[2], disc = tr * tr - 4 * det; let type;
        if (Math.abs(det) < 1e-9) type = "degenerate (det = 0, non-isolated)"; else if (det < 0) type = "saddle (unstable)";
        else if (disc < -1e-9) type = Math.abs(tr) < 1e-9 ? "centre (linearisation: pure imaginary λ)" : tr < 0 ? "stable spiral" : "unstable spiral";
        else type = (tr < 0 ? "stable " : "unstable ") + (disc < 1e-9 ? "degenerate/star node" : "node");
        return { tr, det, disc, type };
      }
      const jac = (F, x, y) => { const h = 1e-5, a = F([x + h, y]), b = F([x - h, y]), c = F([x, y + h]), d = F([x, y - h]); return [(a[0] - b[0]) / (2 * h), (c[0] - d[0]) / (2 * h), (a[1] - b[1]) / (2 * h), (c[1] - d[1]) / (2 * h)]; };
      function renderBackground() {
        const W = cv.width, H = cv.height, dpr = Math.min(2, window.devicePixelRatio || 1), g = bg.getContext("2d");
        bg.width = Math.max(1, Math.round(W * dpr)); bg.height = Math.max(1, Math.round(H * dpr)); g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const v = view(), S = cur(), F = S.f(P()), b = S.box, pend = api.params.sys === "pend";
        drawAxes(g, v, C, { xlabel: pend ? "θ" : "x", ylabel: pend ? "ω" : "y" });
        if (api.params.field) {
          const nx = 24, ny = Math.max(6, Math.round(nx * H / W)), arr = []; let vmax = 1e-9;
          for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const x = b[0] + (b[1] - b[0]) * (i + 0.5) / nx, y = b[2] + (b[3] - b[2]) * (j + 0.5) / ny, d = F([x, y]); if (fin(d[0]) && fin(d[1])) { const m = Math.hypot(d[0], d[1]); vmax = Math.max(vmax, m); arr.push({ x, y, d, m }); } }
          const L = Math.min(26, (v.px(b[1]) - v.px(b[0])) / nx) * 0.75;
          arr.forEach((a) => { if (a.m < 1e-9) return; const ux = a.d[0] / a.m, uy = a.d[1] / a.m; g.globalAlpha = 0.25 + 0.75 * Math.sqrt(a.m / vmax); arrow(g, v.px(a.x) - ux * L / 2, v.py(a.y) + uy * L / 2, v.px(a.x) + ux * L / 2, v.py(a.y) - uy * L / 2, C.muted, 1); });
          g.globalAlpha = 1;
        }
        if (api.params.nullc) {
          [[(x, y) => F([x, y])[0], C.series[5], "x′ = 0 nullcline"], [(x, y) => F([x, y])[1], C.series[6], "y′ = 0 nullcline"]].forEach((it, k) => {
            contour(it[0], b, 90, 70).forEach((sg) => line(g, v.px(sg[0][0]), v.py(sg[0][1]), v.px(sg[1][0]), v.py(sg[1][1]), it[1], 1.5)); text(g, it[2], W - 10, 16 + 16 * k, it[1], "right"); });
        }
        trajs.forEach((t) => { g.save(); g.strokeStyle = t.color; g.lineWidth = 1.8; g.beginPath(); t.pts.forEach((p, i) => { if (i) g.lineTo(v.px(p[0]), v.py(p[1])); else g.moveTo(v.px(p[0]), v.py(p[1])); }); g.stroke(); g.restore(); dot(g, v.px(t.pts[0][0]), v.py(t.pts[0][1]), 3.5, t.color); });
        S.eqs(P()).forEach((e) => { g.save(); g.strokeStyle = C.accent; g.lineWidth = 2; g.beginPath(); g.arc(v.px(e[0]), v.py(e[1]), 6, 0, TAU); g.stroke(); g.restore(); });
        text(g, "○ equilibria  ·  click to launch a trajectory", 10, H - 8, C.muted);
        bgDirty = false;
      }
      function readouts() {
        const S = cur(), F = S.f(P()), ro = { System: S.eq, Trajectories: String(trajs.length) };
        S.eqs(P()).forEach((e) => { const cl = classify(jac(F, e[0], e[1])); ro[`Equilibrium (${fmt(e[0], 2)}, ${fmt(e[1], 2)})`] = `${cl.type}   [tr J = ${fmt(cl.tr, 2)}, det J = ${fmt(cl.det, 2)}]`; });
        if (api.params.sys === "lin") { const p = P(), cl = classify([p.m11, p.m12, p.m21, p.m22]); ro.Eigenvalues = cl.disc >= 0 ? `${fmt((cl.tr + Math.sqrt(cl.disc)) / 2, 3)},  ${fmt((cl.tr - Math.sqrt(cl.disc)) / 2, 3)}` : `${fmt(cl.tr / 2, 3)} ± ${fmt(Math.sqrt(-cl.disc) / 2, 3)}·i`; }
        api.readout(ro);
        api.setStatus({ lv: "Nonlinear centre: the linearisation is inconclusive, but a conserved quantity makes every orbit a closed loop.", pend: "θ = 0 is a stable spiral for c > 0; θ = ±π are saddles. Try c = 0 for the undamped (conservative) case.",
          vdp: "Unstable equilibrium at the origin plus an attracting limit cycle — a relaxation oscillator for large μ.", lin: "Trace–determinant plane: det < 0 saddle · det > 0 & tr < 0 stable · tr² < 4·det spirals · tr = 0 centre." }[api.params.sys] || "");
      }
      function add(x, y) { if (trajs.length >= 14) trajs.shift(); trajs.push({ pts: integrate(x, y), color: C.series[trajs.length % C.series.length], phase: Math.floor(api.random() * 500) }); bgDirty = true; readouts(); }
      function seed() { trajs = []; const b = cur().box; cur().seeds(P()).forEach((s) => add(clamp(s[0], b[0], b[1]), clamp(s[1], b[2], b[3]))); }
      function frame() { if (bgDirty) renderBackground(); ctx.drawImage(bg, 0, 0, cv.width, cv.height); const v = view(); trajs.forEach((t) => { const n = t.pts.length; if (n < 2) return; const p = t.pts[Math.floor((time * 100 + t.phase) % n)]; dot(ctx, v.px(p[0]), v.py(p[1]), 4.5, t.color); }); }
      api.pointer(cv.canvas, { down(p) { const v = view(); add(v.mx(p.x), v.my(p.y)); frame(); } });
      api.onParam((k) => { if (k === "sys") seed(); else { trajs = trajs.map((t) => Object.assign({}, t, { pts: integrate(t.pts[0][0], t.pts[0][1]) })); bgDirty = true; readouts(); } frame(); });
      api.onResize(() => { bgDirty = true; frame(); });
      seed(); frame();
      const loop = api.loop((dt) => { time += dt; frame(); return true; });
      return { seed() { seed(); frame(); }, clear() { trajs = []; bgDirty = true; readouts(); frame(); }, destroy() { loop.stop(); } };
    },
  });

  /* ============================== 10. graph_theory ============================== */
  Sims.register({
    id: "graph_theory", name: "Graph Algorithms Visualiser", domains: ["mathematics", "ai"],
    description: "Step through BFS, DFS, Dijkstra, Prim's MST and topological sort on random or preset graphs. Click nodes to choose the source and the target.",
    params: [
      { key: "preset", label: "Graph", type: "select", value: "random8", options: [
        { value: "random8", label: "Random (8 nodes)" }, { value: "random12", label: "Random (12 nodes)" }, { value: "grid", label: "Grid 3 × 4" }, { value: "wheel", label: "Wheel W₇" }, { value: "dag", label: "DAG (layered, directed)" }] },
      { key: "algo", label: "Algorithm", type: "select", value: "dijkstra", options: [
        { value: "bfs", label: "Breadth-first search" }, { value: "dfs", label: "Depth-first search" }, { value: "dijkstra", label: "Dijkstra shortest paths" }, { value: "prim", label: "Prim minimum spanning tree" }, { value: "topo", label: "Topological sort (Kahn)" }] },
      { key: "weights", label: "Show edge weights", type: "toggle", value: true },
      { key: "pickTarget", label: "Click picks the target (off: source)", type: "toggle", value: false },
      { key: "speed", label: "Auto-play steps per second", type: "range", min: 0.5, max: 6, step: 0.5, value: 1.5 },
    ],
    actions: [{ label: "Step ▸", fn: (h) => h.step() }, { label: "▶ Play / ❚❚ Pause", fn: (h) => h.toggle() }, { label: "↺ Restart run", fn: (h) => h.restart() }, { label: "🎲 New graph", fn: (h) => h.regen() }],
    challenges: [
      { id: "bfs_vs_dijkstra", text: "Find a source/target pair where BFS (fewest edges) and Dijkstra (least total weight) choose different routes. Why can both be called 'shortest'?", xp: 15 },
      { id: "prim_sources", text: "Run Prim from two different sources: the total MST weight is identical. Is the tree itself always identical? When could it differ?", xp: 15 },
      { id: "dfs_predict", text: "Before stepping, predict the DFS visit order from the drawing (lowest-numbered neighbour first). Were you right?", xp: 10 },
      { id: "topo_unique", text: "On the DAG, is the topological order unique? Find two nodes that could be swapped and explain where Kahn's algorithm had a free choice.", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10 }), ctx = cv.ctx, R = api.random;
      let G = null, frames = [], fi = 0, src = 0, dst = 0, playing = false, acc = 0;
      const ukey = (u, w) => (u < w ? u + "-" + w : w + "-" + u);
      function build(preset) {
        const nodes = [], edges = [], seen = new Set(), directed = preset === "dag";
        const addEdge = (u, w, wt) => { if (u === w) return; const k = directed ? u + ">" + w : ukey(u, w); if (seen.has(k)) return; seen.add(k); edges.push({ u, v: w, w: wt || 1 + Math.floor(R() * 9) }); };
        if (preset === "grid") { for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) nodes.push({ x: 0.12 + c * 0.76 / 3, y: 0.15 + r * 0.7 / 2 }); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const i = r * 4 + c; if (c < 3) addEdge(i, i + 1); if (r < 2) addEdge(i, i + 4); } }
        else if (preset === "wheel") { nodes.push({ x: 0.5, y: 0.5 }); for (let i = 0; i < 6; i++) nodes.push({ x: 0.5 + 0.3 * Math.cos(i * PI / 3), y: 0.5 + 0.42 * Math.sin(i * PI / 3) }); for (let i = 1; i <= 6; i++) { addEdge(0, i); addEdge(i, i % 6 + 1); } }
        else if (preset === "dag") {
          const L = []; let id = 0; [2, 3, 3, 2].forEach((cnt, li) => { const ids = []; for (let j = 0; j < cnt; j++) { nodes.push({ x: 0.1 + li * 0.8 / 3, y: (j + 1) / (cnt + 1) }); ids.push(id++); } L.push(ids); });
          for (let li = 0; li < 3; li++) { L[li].forEach((u) => addEdge(u, L[li + 1][Math.floor(R() * L[li + 1].length)])); L[li + 1].forEach((w) => addEdge(L[li][Math.floor(R() * L[li].length)], w)); }
          for (let k = 0; k < 3; k++) { const li = Math.floor(R() * 2); addEdge(L[li][Math.floor(R() * L[li].length)], L[li + 2][Math.floor(R() * L[li + 2].length)]); }
        } else {
          const n = preset === "random12" ? 12 : 8; let guard = 0;
          while (nodes.length < n && guard++ < 4000) { const p = { x: 0.07 + 0.86 * R(), y: 0.08 + 0.84 * R() }; if (nodes.every((q) => Math.hypot(q.x - p.x, (q.y - p.y) * 0.75) > (n > 8 ? 0.15 : 0.2))) nodes.push(p); }
          while (nodes.length < n) nodes.push({ x: 0.1 + 0.8 * R(), y: 0.1 + 0.8 * R() });
          const d2 = (i, j) => Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          for (let i = 1; i < n; i++) { let best = 0; for (let j = 1; j < i; j++) if (d2(i, j) < d2(i, best)) best = j; addEdge(i, best); }
          for (let k = 0; k < n + 2; k++) { const u = Math.floor(R() * n); let best = -1; for (let j = 0; j < n; j++) if (j !== u && !seen.has(ukey(u, j)) && (best < 0 || d2(u, j) < d2(u, best))) best = j; if (best >= 0 && d2(u, best) < 0.5) addEdge(u, best); }
        }
        const adj = nodes.map(() => []); edges.forEach((e, i) => { adj[e.u].push({ to: e.v, w: e.w, i }); if (!directed) adj[e.v].push({ to: e.u, w: e.w, i }); }); adj.forEach((a) => a.sort((p, q) => p.to - q.to));
        return { nodes, edges, adj, directed, n: nodes.length };
      }
      const edgeIdx = (a, b) => G.edges.findIndex((e) => (e.u === a && e.v === b) || (!G.directed && e.u === b && e.v === a));
      const treeEdges = (par) => par.map((p, u) => (p >= 0 ? edgeIdx(p, u) : -1)).filter((i) => i >= 0);
      const pathEdges = (par, t) => { const out = []; let guard = 0; while (par[t] >= 0 && guard++ < 1000) { out.push(edgeIdx(par[t], t)); t = par[t]; } return out; };
      function run() {
        frames = []; fi = 0; playing = false; const algo = api.params.algo, n = G.n, order = [], par = new Array(n).fill(-1), dist = new Array(n).fill(Infinity);
        const snap = (o) => frames.push(Object.assign({ visited: order.slice(), frontier: [], tree: [], cur: -1, dist: null, msg: "" }, o));
        if (algo === "topo") {
          if (!G.directed) { snap({ msg: "Topological sort needs a directed acyclic graph — pick the DAG preset." }); return; }
          const indeg = new Array(n).fill(0); G.edges.forEach((e) => indeg[e.v]++); let q = []; for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
          snap({ frontier: q.slice(), msg: "Nodes with in-degree 0 are ready: " + q.join(", ") }); const removed = [];
          while (q.length) { q.sort((a, b) => a - b); const u = q.shift(); order.push(u); G.adj[u].forEach((e) => { indeg[e.to]--; removed.push(e.i); if (indeg[e.to] === 0) q.push(e.to); });
            snap({ frontier: q.slice(), cur: u, tree: removed.slice(), msg: `Output ${u}, delete its out-edges. Ready now: ${q.slice().sort((a, b) => a - b).join(", ") || "none"}` }); }
          snap({ tree: removed.slice(), msg: order.length === n ? "Topological order: " + order.join(" → ") : "Cycle detected — some nodes never reached in-degree 0.", total: null }); return;
        }
        if (algo === "bfs" || algo === "dfs") {
          const done = new Set(), bag = [[src, -1]]; snap({ frontier: [src], msg: `Start at ${src}` });
          while (bag.length) {
            const it = algo === "bfs" ? bag.shift() : bag.pop(), u = it[0]; if (done.has(u)) continue; done.add(u); par[u] = it[1]; dist[u] = it[1] < 0 ? 0 : dist[it[1]] + 1; order.push(u);
            const nb = G.adj[u].filter((e) => !done.has(e.to)); if (algo === "dfs") nb.reverse(); nb.forEach((e) => bag.push([e.to, u]));
            const fr = Array.from(new Set(bag.map((b) => b[0]).filter((x) => !done.has(x))));
            snap({ frontier: fr, cur: u, tree: treeEdges(par), dist: algo === "bfs" ? dist.slice() : null, msg: `${algo === "bfs" ? "Dequeue" : "Pop"} ${u}` + (algo === "bfs" ? ` at depth ${dist[u]}` : "") + `; ${algo === "bfs" ? "queue" : "stack"} → [${Array.from(new Set(bag.map((b) => b[0]))).join(", ")}]` });
          }
          snap({ tree: treeEdges(par), dist: algo === "bfs" ? dist.slice() : null, path: algo === "bfs" ? pathEdges(par, dst) : [], msg: "Done. Visit order: " + order.join(" → ") }); return;
        }
        if (algo === "dijkstra") {
          const done = new Array(n).fill(false); dist[src] = 0; snap({ frontier: [src], dist: dist.slice(), msg: `Start: dist(${src}) = 0, every other node ∞` });
          for (let it = 0; it < n; it++) {
            let u = -1; for (let i = 0; i < n; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i; if (u < 0) break; done[u] = true; order.push(u);
            const relaxed = []; G.adj[u].forEach((e) => { if (!done[e.to] && dist[u] + e.w < dist[e.to]) { dist[e.to] = dist[u] + e.w; par[e.to] = u; relaxed.push(`${e.to}→${dist[e.to]}`); } });
            snap({ frontier: dist.map((d, i) => (!done[i] && d < Infinity ? i : -1)).filter((i) => i >= 0), cur: u, tree: treeEdges(par), dist: dist.slice(), path: done[dst] ? pathEdges(par, dst) : [], msg: `Settle ${u} (dist ${dist[u]})` + (relaxed.length ? "; relax " + relaxed.join(", ") : "") + (u === dst && dst !== src ? "  ← target reached" : "") });
          }
          snap({ tree: treeEdges(par), dist: dist.slice(), path: pathEdges(par, dst), msg: dist[dst] < Infinity ? `Done. dist(${src} → ${dst}) = ${dist[dst]}` : `Done. ${dst} is unreachable from ${src}` }); return;
        }
        /* Prim (graph treated as undirected) */
        const inT = new Array(n).fill(false); inT[src] = true; order.push(src); let total = 0; const tree = []; snap({ msg: `Grow the tree from ${src}` });
        for (let it = 1; it < n; it++) {
          let best = null; G.edges.forEach((e, i) => { if (inT[e.u] !== inT[e.v] && (!best || e.w < best.w)) best = { i, w: e.w, to: inT[e.u] ? e.v : e.u }; });
          if (!best) { snap({ tree: tree.slice(), msg: "No crossing edge left — the graph is disconnected." }); break; }
          inT[best.to] = true; order.push(best.to); tree.push(best.i); total += best.w;
          snap({ cur: best.to, tree: tree.slice(), cand: G.edges.map((e, i) => (inT[e.u] !== inT[e.v] ? i : -1)).filter((i) => i >= 0), msg: `Cheapest crossing edge ${G.edges[best.i].u}–${G.edges[best.i].v} (w = ${best.w}); tree weight ${total}` });
        }
        snap({ tree: tree.slice(), total, msg: `MST complete: ${tree.length} edges, total weight ${total}` });
      }
      function readouts() {
        const f = frames[fi] || {}, algo = api.params.algo, ro = { Algorithm: String(algo), Source: String(src), Target: String(dst), Step: `${fi} / ${Math.max(0, frames.length - 1)}`, "Visited order": (f.visited || []).join(" → ") || "—" };
        if (f.dist && fin(f.dist[dst])) ro[algo === "bfs" ? "Hops to target" : "Distance to target"] = f.dist[dst] < Infinity ? String(f.dist[dst]) : "∞ (not yet reached)";
        if (f.total != null) ro["MST weight"] = String(f.total); if (f.tree && f.tree.length) ro["Tree edges"] = String(f.tree.length);
        ro["Edges / weights"] = `${G.edges.length} edges${G.directed ? " (directed)" : ""}, total weight ${G.edges.reduce((s, e) => s + e.w, 0)}`;
        api.readout(ro);
      }
      function draw() {
        const W = cv.width, H = cv.height, f = frames[fi] || { visited: [], frontier: [], tree: [], cur: -1 };
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        const px = (p) => ({ x: 30 + p.x * (W - 60), y: 26 + p.y * (H - 60) });
        const vis = new Set(f.visited), fr = new Set(f.frontier), tree = new Set(f.tree), path = new Set(f.path || []), cand = new Set(f.cand || []);
        G.edges.forEach((e, i) => {
          const a = px(G.nodes[e.u]), b = px(G.nodes[e.v]), col = path.has(i) ? C.accent : tree.has(i) ? C.ok : cand.has(i) ? C.secondary : C.axis, w = path.has(i) ? 4 : tree.has(i) ? 3 : 1.5;
          if (G.directed) { const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; arrow(ctx, a.x + dx / L * 14, a.y + dy / L * 14, b.x - dx / L * 14, b.y - dy / L * 14, col, w); } else line(ctx, a.x, a.y, b.x, b.y, col, w);
          if (api.params.weights) { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; ctx.save(); ctx.fillStyle = C.bg; ctx.globalAlpha = 0.85; ctx.fillRect(mx - 8, my - 7, 16, 14); ctx.restore(); text(ctx, String(e.w), mx, my, C.text, "center", "middle"); }
        });
        G.nodes.forEach((p, i) => {
          const q = px(p), lit = i === f.cur || vis.has(i) || fr.has(i), fill = i === f.cur ? C.secondary : vis.has(i) ? C.primary : fr.has(i) ? C.accent : (C.panel || "#161a2e");
          ctx.save(); ctx.beginPath(); ctx.arc(q.x, q.y, 13, 0, TAU); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = i === src || i === dst ? 3 : 1.2; ctx.strokeStyle = i === src ? C.ok : i === dst ? C.danger : C.axis; ctx.stroke(); ctx.restore();
          text(ctx, String(i), q.x, q.y, lit ? C.bg : C.text, "center", "middle", "bold 12px system-ui, sans-serif");
          if (f.dist && f.dist[i] < Infinity) text(ctx, String(f.dist[i]), q.x + 15, q.y - 11, C.accent);
        });
        text(ctx, f.msg || "", 10, H - 8, C.text); text(ctx, `step ${fi} / ${Math.max(0, frames.length - 1)}${playing ? "  ▶" : ""}`, W - 10, 16, C.muted, "right");
        text(ctx, "● source", 10, 16, C.ok); text(ctx, "● target", 70, 16, C.danger); text(ctx, "● visited", 130, 16, C.primary); text(ctx, "● frontier", 192, 16, C.accent); text(ctx, "— tree / path", 258, 16, C.ok);
      }
      function reset(newGraph) { if (newGraph) { G = build(api.params.preset); src = 0; dst = G.n - 1; } run(); readouts(); draw(); }
      api.pointer(cv.canvas, { down(p) { const W = cv.width, H = cv.height; let best = -1, bd = 18; G.nodes.forEach((q, i) => { const d = Math.hypot(30 + q.x * (W - 60) - p.x, 26 + q.y * (H - 60) - p.y); if (d < bd) { bd = d; best = i; } });
        if (best >= 0) { if (api.params.pickTarget) dst = best; else src = best; run(); readouts(); draw(); } } });
      api.onParam((k) => { if (k === "preset") reset(true); else if (k === "algo") reset(false); else draw(); });
      api.onResize(draw); reset(true);
      api.setStatus("Step through the run, or press Play. Click a node to move the source (toggle to move the target).");
      const loop = api.loop((dt) => { if (playing) { acc += dt; const per = 1 / clamp(num(api.params.speed, 1.5), 0.1, 20); if (acc >= per) { acc = 0; if (fi < frames.length - 1) { fi++; readouts(); draw(); } else { playing = false; draw(); } } } return true; });
      return {
        step() { playing = false; if (fi < frames.length - 1) fi++; else fi = 0; readouts(); draw(); },
        toggle() { if (fi >= frames.length - 1) fi = 0; playing = !playing; acc = 0; readouts(); draw(); },
        restart() { fi = 0; playing = false; readouts(); draw(); },
        regen() { reset(true); },
        destroy() { loop.stop(); },
      };
    },
  });

  /* ============================== 11. modular_clock ============================== */
  Sims.register({
    id: "modular_clock", name: "Modular Arithmetic Clock", domains: ["mathematics"],
    description: "Residues mod n on a circle: step through multiples or powers of a to reveal cycles, gcd structure, units, inverses and primes.",
    params: [
      { key: "n", label: "Modulus n", type: "range", min: 2, max: 30, step: 1, value: 12 },
      { key: "a", label: "a", type: "range", min: 0, max: 30, step: 1, value: 5 },
      { key: "orbit", label: "Orbit to trace", type: "select", value: "mult", options: [{ value: "mult", label: "multiples  0, a, 2a, 3a, … (mod n)" }, { value: "pow", label: "powers  1, a, a², a³, … (mod n)" }] },
      { key: "table", label: "Table", type: "select", value: "mul", options: [{ value: "none", label: "none" }, { value: "add", label: "addition" }, { value: "mul", label: "multiplication" }] },
      { key: "animate", label: "Animate the orbit", type: "toggle", value: true },
      { key: "units", label: "Highlight units (gcd(k, n) = 1)", type: "toggle", value: true },
    ],
    challenges: [
      { id: "gcd_cycle", text: "Set n = 12. For which a do the multiples of a visit every point? Relate the number of points hit to gcd(a, 12).", xp: 15 },
      { id: "prime_field", text: "Choose a prime n: every non-zero residue is a unit and the multiplication table has no zeros inside. Why does primality force this?", xp: 15 },
      { id: "order_divides", text: "With n = 13, record the multiplicative order of several units a. Check that each one divides φ(13) = 12 (Lagrange's theorem).", xp: 20 },
      { id: "primitive_root", text: "Find a primitive root mod 13: an a whose powers visit all 12 units. How many primitive roots does 13 have?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10, maxHeight: 440 }), ctx = cv.ctx;
      let step = 0, acc = 0, tableKey = "";
      const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
      const state = () => {
        const n = clamp(Math.round(num(api.params.n, 12)), 2, 60), a = ((Math.round(num(api.params.a, 5)) % n) + n) % n, g = gcd(a, n), unit = g === 1;
        let phi = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) phi++;
        let ord = null, inv = null; if (unit) { let v = 1; for (let k = 1; k <= n; k++) { v = (v * a) % n; if (v === 1) { ord = k; break; } } for (let b = 0; b < n; b++) if ((a * b) % n === 1 % n) { inv = b; break; } }
        const seq = [], seen = new Map(); let back = 0;
        if (api.params.orbit === "pow") { let v = 1 % n; while (!seen.has(v) && seq.length <= n) { seen.set(v, seq.length); seq.push(v); v = (v * a) % n; } back = seen.get(v); }
        else { let v = 0; do { seq.push(v); v = (v + a) % n; } while (v !== 0 && seq.length <= n); }
        return { n, a, g, unit, phi, ord, inv, seq, back, pow: api.params.orbit === "pow", prime: isPrime(n) };
      };
      function draw() {
        const W = cv.width, H = cv.height, S = state(), cx = W / 2, cy = H / 2 + 6, r = Math.min(W, H) * 0.38, shown = api.params.animate ? Math.min(step, S.seq.length) : S.seq.length;
        ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        const pos = (k) => { const t = -PI / 2 + TAU * k / S.n; return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) }; };
        ctx.save(); ctx.strokeStyle = S.prime ? C.accent : C.axis; ctx.lineWidth = S.prime ? 2.5 : 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.restore();
        const col = S.pow ? C.secondary : C.primary;
        for (let i = 0; i < shown; i++) { /* chords: seq[i] → seq[i+1]; the last multiple closes back to 0, the last power jumps back into the cycle */
          const from = S.seq[i], to = i + 1 < S.seq.length ? S.seq[i + 1] : (S.pow ? S.seq[S.back] : 0), A = pos(from), B = pos(to);
          ctx.save(); ctx.globalAlpha = 0.9; arrow(ctx, A.x, A.y, B.x, B.y, col, 1.6); ctx.restore();
        }
        for (let k = 0; k < S.n; k++) {
          const p = pos(k), isUnit = gcd(k, S.n) === 1, hit = S.seq.indexOf(k) >= 0 && S.seq.indexOf(k) < shown;
          ctx.save(); ctx.beginPath(); ctx.arc(p.x, p.y, S.n > 20 ? 10 : 12, 0, TAU); ctx.fillStyle = hit ? col : (api.params.units && isUnit ? "rgba(110,231,183,0.25)" : (C.panel || "#161a2e")); ctx.fill();
          ctx.lineWidth = k === S.a ? 3 : 1.2; ctx.strokeStyle = k === S.a ? C.accent : (api.params.units && isUnit ? C.ok : C.axis); ctx.stroke(); ctx.restore();
          text(ctx, String(k), p.x, p.y, hit ? C.bg : C.text, "center", "middle", "bold 11px system-ui, sans-serif");
        }
        const i = Math.max(0, Math.min(shown, S.seq.length) - 1), vNow = S.seq[i];
        text(ctx, S.pow ? `a${sup(i)} = ${S.a}${sup(i)} ≡ ${vNow} (mod ${S.n})` : `${i}·a = ${i}·${S.a} ≡ ${vNow} (mod ${S.n})`, cx, cy - 8, C.text, "center", "middle", "bold 14px system-ui, sans-serif");
        text(ctx, S.pow ? (S.unit ? `returns to 1 after ${S.ord} steps` : `never returns to 1 (a is not a unit)`) : `cycle of ${S.seq.length} points = n / gcd(a, n)`, cx, cy + 12, C.muted, "center", "middle");
        text(ctx, S.prime ? `n = ${S.n} is prime` : `n = ${S.n} is composite`, 10, 16, S.prime ? C.accent : C.muted); if (api.params.units) text(ctx, "● units (invertible residues)", 10, 32, C.ok);
        text(ctx, `shown: ${shown} / ${S.seq.length} steps`, W - 10, 16, C.muted, "right");
      }
      function readouts() {
        const S = state();
        api.readout({ "a mod n": `${S.a}  (mod ${S.n})`, "gcd(a, n)": String(S.g), "a is a unit?": S.unit ? `yes — inverse a⁻¹ ≡ ${S.inv}` : "no (shares a factor with n)",
          "Additive order (points hit by multiples)": `${S.n / S.g} = n / gcd(a, n)`, "Multiplicative order (least k with aᵏ ≡ 1)": S.unit ? `${S.ord}  (divides φ(n) = ${S.phi})` : "— (undefined: a is not a unit)",
          "φ(n) = number of units": String(S.phi), "n prime?": S.prime ? "yes — ℤ/nℤ is a field" : "no — zero divisors exist (see table)", "Generator?": S.unit && S.ord === S.phi ? "yes — a is a primitive root mod n" : "no" });
        api.setStatus(S.pow ? "Powers of a unit cycle through a subgroup of (ℤ/nℤ)ˣ whose size divides φ(n)." : "Multiples of a hit exactly n / gcd(a, n) residues — the subgroup generated by a in ℤ/nℤ.");
        const tk = `${S.n}|${S.a}|${api.params.table}`;
        if (tk !== tableKey) {
          tableKey = tk; const mode = api.params.table;
          if (mode !== "add" && mode !== "mul") { api.html(""); return; }
          const cell = "display:inline-block;width:1.9em;height:1.9em;line-height:1.9em;text-align:center;font:11px ui-monospace,monospace;border-radius:3px;margin:1px;";
          let h = `<div style="overflow:auto;padding:6px 0"><div style="color:${C.muted};font-size:12px;margin-bottom:4px">${mode === "add" ? "Addition" : "Multiplication"} table mod ${S.n} — row/column of a = ${S.a} outlined${mode === "mul" ? ", zero divisors (non-zero × non-zero ≡ 0) in red" : ""}.</div><div style="white-space:nowrap">`;
          h += `<span style="${cell}color:${C.muted}">${mode === "add" ? "+" : "×"}</span>`; for (let j = 0; j < S.n; j++) h += `<span style="${cell}color:${C.accent}">${j}</span>`; h += "<br>";
          for (let i = 0; i < S.n; i++) { h += `<span style="${cell}color:${C.accent}">${i}</span>`;
            for (let j = 0; j < S.n; j++) { const v = mode === "add" ? (i + j) % S.n : (i * j) % S.n, zd = mode === "mul" && v === 0 && i && j, hl = i === S.a || j === S.a;
              h += `<span style="${cell}background:${zd ? "rgba(255,107,107,0.55)" : `hsl(${Math.round(360 * v / S.n)},45%,${v === 0 ? 18 : 32}%)`};color:${C.text};${hl ? "outline:1px solid " + C.accent + ";" : ""}">${v}</span>`; }
            h += "<br>"; }
          api.html(h + "</div></div>");
        }
      }
      api.onParam((k) => { if (k !== "animate" && k !== "units") { step = 0; acc = 0; } readouts(); draw(); });
      api.onResize(draw); readouts(); draw();
      const loop = api.loop((dt) => { if (!api.params.animate) return true; acc += dt; const len = state().seq.length; if (acc > (step >= len ? 1.6 : 0.55)) { acc = 0; step = step >= len ? 0 : step + 1; draw(); } return true; });
      return { destroy() { loop.stop(); } };
    },
  });
})();
