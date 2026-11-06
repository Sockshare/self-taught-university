/* Self-Taught — Philosophy simulations
 * Registers: truth_table, trolley_lab, prisoners_dilemma, veil_of_ignorance, bayes_belief, sorites, argument_mapper
 * Built against static/sims/core.js (see docs/CONTRACTS.md §3). Vanilla JS, no dependencies, no eval.
 */
(function () {
  "use strict";
  if (!window.SelfTaughtSims) { console.error("[philosophy sims] core.js must be loaded first"); return; }
  const S = window.SelfTaughtSims;
  const TAU = Math.PI * 2;

  // ======================= shared helpers =======================
  function makeRng(seed) { let a = (seed >>> 0) || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (Number.isFinite(+v) ? +v : (d || 0));
  const fx = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 2 : d) : "—");
  const pct = (v, d) => (Number.isFinite(v) ? (v * 100).toFixed(d == null ? 1 : d) + " %" : "—");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function text(ctx, s, x, y, color, o) { o = o || {}; ctx.fillStyle = color; ctx.font = (o.bold ? "700 " : "") + (o.size || 11) + "px system-ui, sans-serif"; ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic"; ctx.fillText(String(s), x, y); }
  function clearCanvas(ctx, w, h, C) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }
  function circle(ctx, x, y, r, fill, stroke, lw) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
  function roundRect(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
  function arrow(ctx, x1, y1, x2, y2, color, lw) { const a = Math.atan2(y2 - y1, x2 - x1), hl = 8; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw || 1.5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - hl * Math.cos(a - 0.4), y2 - hl * Math.sin(a - 0.4)); ctx.lineTo(x2 - hl * Math.cos(a + 0.4), y2 - hl * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill(); }
  function polyline(ctx, pts, color, lw, dash) { if (pts.length < 2) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1.5; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  /** Horizontal bar with label and value, used by several widgets for "profile" style displays. */
  function hbar(ctx, C, x, y, w, frac, label, valueText, color) { text(ctx, label, x, y - 4, C.text, { size: 11 }); ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(x, y, w, 10); if (Number.isFinite(frac)) { ctx.fillStyle = color || C.primary; ctx.fillRect(x, y, w * clamp(frac, 0, 1), 10); } text(ctx, valueText, x + w, y - 4, C.muted, { align: "right", size: 10 }); }
  function wrapText(ctx, s, x, y, maxW, lh, color, o) { const words = String(s).split(/\s+/); let line = "", yy = y; ctx.font = ((o && o.bold) ? "700 " : "") + ((o && o.size) || 12) + "px system-ui, sans-serif"; for (const wd of words) { const tst = line ? line + " " + wd : wd; if (ctx.measureText(tst).width > maxW && line) { text(ctx, line, x, yy, color, o); line = wd; yy += lh; } else line = tst; } if (line) text(ctx, line, x, yy, color, o); return yy + lh; }

  // ======================= propositional logic: safe recursive-descent parser (no eval) =======================
  const KEYWORDS = { not: "not", and: "and", or: "or", xor: "xor", implies: "imp", iff: "iff", true: "T", false: "F" };
  const MULTI = [["<->", "iff"], ["<=>", "iff"], ["->", "imp"], ["=>", "imp"], ["&&", "and"], ["||", "or"], ["↔", "iff"], ["≡", "iff"], ["→", "imp"], ["⊃", "imp"], ["∧", "and"], ["∨", "or"], ["¬", "not"], ["⊕", "xor"], ["⊻", "xor"], ["⊤", "T"], ["⊥", "F"]];
  function tokenize(src) {
    const s = String(src == null ? "" : src), toks = []; let i = 0;
    while (i < s.length) {
      const c = s[i]; if (/\s/.test(c)) { i++; continue; }
      const m = MULTI.find((p) => s.startsWith(p[0], i)); if (m) { toks.push(m[1]); i += m[0].length; continue; }
      if ("~!".includes(c)) { toks.push("not"); i++; continue; }
      if ("&*.·".includes(c)) { toks.push("and"); i++; continue; }
      if ("|+".includes(c)) { toks.push("or"); i++; continue; }
      if (c === "^") { toks.push("xor"); i++; continue; }
      if ("()[]".includes(c)) { toks.push(c === "[" ? "(" : c === "]" ? ")" : c); i++; continue; }
      if (c === "1" || c === "0") { toks.push(c === "1" ? "T" : "F"); i++; continue; }
      if (/[A-Za-z]/.test(c)) { let j = i + 1; while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++; const w = s.slice(i, j), lw = w.toLowerCase(); i = j; if (w === "T" || w === "F") toks.push(w); else if (KEYWORDS[lw]) toks.push(KEYWORDS[lw]); else toks.push({ v: w }); continue; }
      throw new Error(`unexpected character "${c}"`);
    }
    return toks;
  }
  /** Grammar (low → high precedence): iff := imp (↔ imp)* ; imp := or (→ imp)? ; or := and ((∨|⊕) and)* ; and := not (∧ not)* ; not := ¬ not | atom */
  function parseFormula(src) {
    const toks = tokenize(src), vars = []; let k = 0; const peek = () => toks[k], next = () => toks[k++];
    const tokName = (t) => (t === undefined ? "end of formula" : typeof t === "object" ? t.v : t);
    function pIff() { let a = pImp(); while (peek() === "iff") { next(); a = { k: "bin", op: "iff", a, b: pImp() }; } return a; }
    function pImp() { const a = pOr(); if (peek() === "imp") { next(); return { k: "bin", op: "imp", a, b: pImp() }; } return a; }
    function pOr() { let a = pAnd(); while (peek() === "or" || peek() === "xor") { const op = next(); a = { k: "bin", op, a, b: pAnd() }; } return a; }
    function pAnd() { let a = pNot(); while (peek() === "and") { next(); a = { k: "bin", op: "and", a, b: pNot() }; } return a; }
    function pNot() { if (peek() === "not") { next(); return { k: "not", a: pNot() }; } return pAtom(); }
    function pAtom() {
      const t = next(); if (t === undefined) throw new Error("unexpected end of formula");
      if (t === "(") { const e = pIff(); if (next() !== ")") throw new Error("missing closing parenthesis"); return e; }
      if (t === "T" || t === "F") return { k: "const", v: t === "T" };
      if (typeof t === "object") { if (!vars.includes(t.v)) { if (vars.length >= 5) throw new Error("at most 5 variables"); vars.push(t.v); } return { k: "var", name: t.v }; }
      throw new Error(`unexpected "${tokName(t)}"`);
    }
    if (!toks.length) throw new Error("empty formula");
    const ast = pIff(); if (k < toks.length) throw new Error(`unexpected "${tokName(toks[k])}"`);
    vars.sort(); return { ast, vars };
  }
  const tryParse = (src) => { try { return parseFormula(src); } catch (e) { return { error: e.message || "parse error" }; } };
  function evalAst(n, env) {
    if (n.k === "var") return !!env[n.name]; if (n.k === "const") return n.v; if (n.k === "not") return !evalAst(n.a, env);
    const a = evalAst(n.a, env), b = evalAst(n.b, env);
    return n.op === "and" ? a && b : n.op === "or" ? a || b : n.op === "xor" ? a !== b : n.op === "imp" ? !a || b : a === b;
  }
  const OPSYM = { and: "∧", or: "∨", xor: "⊕", imp: "→", iff: "↔" }, PREC = { iff: 1, imp: 2, or: 3, xor: 3, and: 4 };
  function fmtAst(n, pp) { if (n.k === "var") return n.name; if (n.k === "const") return n.v ? "⊤" : "⊥"; if (n.k === "not") return "¬" + fmtAst(n.a, 5); const p = PREC[n.op], s = fmtAst(n.a, p) + " " + OPSYM[n.op] + " " + fmtAst(n.b, p); return pp != null && p <= pp ? "(" + s + ")" : s; }
  function varsOf(n, acc) { acc = acc || []; if (n.k === "var") { if (!acc.includes(n.name)) acc.push(n.name); } else if (n.k === "not") varsOf(n.a, acc); else if (n.k === "bin") { varsOf(n.a, acc); varsOf(n.b, acc); } return acc; }
  function usedOps(n, acc) { acc = acc || new Set(); if (n.k === "not") { acc.add("not"); usedOps(n.a, acc); } else if (n.k === "bin") { acc.add(n.op); usedOps(n.a, acc); usedOps(n.b, acc); } return acc; }
  function tableRows(vars) { const n = vars.length, rows = []; for (let i = 0; i < (1 << n); i++) { const env = {}; vars.forEach((v, j) => { env[v] = !((i >> (n - 1 - j)) & 1); }); rows.push(env); } return rows; } // textbook order: T…T first
  function subformulas(ast) { const out = [], seen = new Set(); (function walk(n) { if (n.k === "bin") { walk(n.a); walk(n.b); } else if (n.k === "not") walk(n.a); if (n.k !== "var" && n.k !== "const") { const s = fmtAst(n); if (!seen.has(s)) { seen.add(s); out.push({ s, n }); } } })(ast); return out; }
  function equiv(a, b) { const vars = varsOf(a).concat(varsOf(b)).filter((v, i, arr) => arr.indexOf(v) === i).sort(); return tableRows(vars).every((env) => evalAst(a, env) === evalAst(b, env)); }
  const parseOrNull = (s) => { const r = tryParse(s); return r.error ? null : r.ast; };

  // ======================= 1. Truth table & equivalence =======================
  S.register({
    id: "truth_table",
    name: "Truth Table & Equivalence Lab",
    domains: ["philosophy", "math", "ai"],
    description: "Type any propositional formula (¬ ∧ ∨ → ↔ ⊕, or ASCII ~ & | -> <-> ^, or the words not/and/or). Get the full truth table with sub-formula columns, a shaded Venn diagram and a Karnaugh map, and test equivalence against a second formula.",
    params: [
      { key: "f1", label: "Formula (variables p, q, r, s …)", type: "text", value: "p -> q" },
      { key: "f2", label: "Compare with (optional)", type: "text", value: "~q -> ~p" },
      { key: "view", label: "Canvas", type: "select", value: "both", options: [{ value: "both", label: "Venn diagram + Karnaugh map" }, { value: "venn", label: "Venn diagram only" }, { value: "kmap", label: "Karnaugh map only" }] },
    ],
    actions: [
      { label: "Example: De Morgan", fn: (h) => h.example("~(p & q)", "~p | ~q") },
      { label: "Example: 3-variable tautology", fn: (h) => h.example("(p -> q) & (q -> r) -> (p -> r)", "") },
      { label: "Swap formulas", fn: (h) => h.swap() },
    ],
    challenges: [
      { id: "find_tautology", xp: 15, text: "Write a tautology that uses three different variables and at least one → (hypothetical syllogism is one; find another)." },
      { id: "de_morgan", xp: 10, text: "Verify De Morgan's law ¬(p ∧ q) ≡ ¬p ∨ ¬q, then check its dual by swapping ∧ and ∨ in both formulas." },
      { id: "xor_iff", xp: 15, text: "Show that p ⊕ q is exactly the negation of p ↔ q (the readout will say 'negations of each other')." },
      { id: "arrow_only", xp: 20, text: "Build a contradiction using only → and ¬ (no ∧, ∨, ⊕ or ↔)." },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 420 }), ctx = cv.ctx, P = api.params, dm = new Set();
      let R = null;
      function compute() {
        const a = tryParse(P.f1), hasB = String(P.f2 || "").trim().length > 0, b = hasB ? tryParse(P.f2) : null;
        if (a.error) { R = { error: "Formula: " + a.error }; render(); return; }
        const bOk = b && !b.error, vars = a.vars.concat(bOk ? b.vars : []).filter((v, i, arr) => arr.indexOf(v) === i).sort(), rows = tableRows(vars);
        const v1 = rows.map((env) => evalAst(a.ast, env)), v2 = bOk ? rows.map((env) => evalAst(b.ast, env)) : null, nT = v1.filter(Boolean).length;
        const diff = v2 ? rows.map((_, i) => i).filter((i) => v1[i] !== v2[i]) : [];
        R = { error: b && b.error ? "Second formula: " + b.error : null, a, b: bOk ? b : null, vars, rows, subs: subformulas(a.ast), v1, v2, nT, cls: nT === rows.length ? "tautology" : nT === 0 ? "contradiction" : "contingent", rel: v2 ? (diff.length === 0 ? "equivalent" : diff.length === rows.length ? "negations" : "different") : null, diff };
        checks(); render();
      }
      function checks() {
        const ops = usedOps(R.a.ast);
        if (R.cls === "tautology" && R.a.vars.length >= 3 && ops.has("imp")) api.award("find_tautology");
        if (R.cls === "contradiction" && ops.has("imp") && !ops.has("and") && !ops.has("or") && !ops.has("xor") && !ops.has("iff")) api.award("arrow_only");
        if (R.b && R.rel === "equivalent") { if (equiv(R.a.ast, parseOrNull("~(p & q)"))) dm.add(1); if (equiv(R.a.ast, parseOrNull("~(p | q)"))) dm.add(2); if (dm.size === 2) api.award("de_morgan"); }
        if (R.b && R.rel === "negations") { const x = parseOrNull("p ^ q"); if (equiv(R.a.ast, x) || equiv(R.b.ast, x)) api.award("xor_iff"); }
      }
      function render() { draw(); renderHtml(); readout(); }
      function rowIndex(env) { const n = R.vars.length; let i = 0; R.vars.forEach((v, j) => { if (!env[v]) i |= 1 << (n - 1 - j); }); return i; }
      function drawVenn(box) {
        const n = R.vars.length; text(ctx, "Venn diagram — shaded where the formula is true", box.x, box.y + 12, C.text, { bold: true });
        if (n === 0 || n > 3) { text(ctx, n === 0 ? "no variables (constant formula)" : "Venn view supports ≤ 3 variables", box.x, box.y + 36, C.muted); return; }
        const cx = box.x + box.w / 2, cy = box.y + box.h / 2 + 10, r = Math.min(box.w, box.h) * (n === 1 ? 0.3 : 0.27);
        const cs = n === 1 ? [[cx, cy]] : n === 2 ? [[cx - r * 0.55, cy], [cx + r * 0.55, cy]] : [[cx - r * 0.58, cy + r * 0.33], [cx + r * 0.58, cy + r * 0.33], [cx, cy - r * 0.62]];
        R.rows.forEach((env, i) => {
          if (!R.v1[i]) return; ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y + 18, box.w, box.h - 18); ctx.clip();
          R.vars.forEach((v, j) => { ctx.beginPath(); if (env[v]) ctx.arc(cs[j][0], cs[j][1], r, 0, TAU); else { ctx.rect(box.x, box.y, box.w, box.h); ctx.arc(cs[j][0], cs[j][1], r, 0, TAU, true); } ctx.clip(); });
          ctx.fillStyle = "rgba(124,156,255,0.45)"; ctx.fillRect(box.x, box.y, box.w, box.h); ctx.restore();
        });
        ctx.strokeStyle = C.axis; ctx.strokeRect(box.x + 0.5, box.y + 18.5, box.w - 1, box.h - 19);
        cs.forEach((c, j) => { circle(ctx, c[0], c[1], r, null, C.series[j], 2); const lx = n === 3 && j === 2 ? c[0] : c[0] + (j === 0 ? -1 : 1) * r * 0.8, ly = n === 3 && j === 2 ? c[1] - r - 6 : c[1] - r * 0.85; text(ctx, R.vars[j], lx, ly, C.series[j], { bold: true, size: 13, align: "center" }); });
      }
      function drawKmap(box) {
        const n = R.vars.length; text(ctx, "Karnaugh map (Gray-code order)", box.x, box.y + 12, C.text, { bold: true });
        if (n === 0 || n > 4) { text(ctx, n === 0 ? "no variables" : "K-map supports ≤ 4 variables", box.x, box.y + 36, C.muted); return; }
        const gray = (k) => (k === 0 ? [""] : k === 1 ? ["0", "1"] : ["00", "01", "11", "10"]), nr = Math.floor(n / 2), nc = n - nr, rv = R.vars.slice(0, nr), cvars = R.vars.slice(nr);
        const rl = gray(nr), cl = gray(nc), cell = Math.min((box.w - 50) / cl.length, (box.h - 50) / rl.length, 64), ox = box.x + 44, oy = box.y + 44;
        text(ctx, (rv.join("") || "·") + " ╲ " + cvars.join(""), ox - 4, oy - 22, C.muted, { align: "right", size: 10 });
        cl.forEach((c, j) => text(ctx, c, ox + (j + 0.5) * cell, oy - 6, C.accent, { align: "center", size: 11, bold: true }));
        rl.forEach((rr, i) => text(ctx, rr || "", ox - 6, oy + (i + 0.5) * cell + 4, C.accent, { align: "right", size: 11, bold: true }));
        rl.forEach((rr, i) => cl.forEach((cc, j) => {
          const env = {}; rv.forEach((v, k) => { env[v] = rr[k] === "1"; }); cvars.forEach((v, k) => { env[v] = cc[k] === "1"; });
          const val = R.v1[rowIndex(env)], x = ox + j * cell, y = oy + i * cell;
          ctx.fillStyle = val ? "rgba(124,156,255,0.45)" : "rgba(255,255,255,0.04)"; ctx.fillRect(x, y, cell, cell); ctx.strokeStyle = C.axis; ctx.strokeRect(x + 0.5, y + 0.5, cell, cell);
          text(ctx, val ? "1" : "0", x + cell / 2, y + cell / 2 + 5, val ? C.text : C.muted, { align: "center", size: 14, bold: val });
        }));
      }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C);
        if (!R || !R.rows) { text(ctx, "⚠ " + (R ? R.error : ""), 14, 30, C.danger, { size: 13 }); return; }
        const both = P.view === "both", left = { x: 14, y: 10, w: both ? w / 2 - 22 : w - 28, h: h - 20 }, right = { x: both ? w / 2 + 8 : 14, y: 10, w: both ? w / 2 - 22 : w - 28, h: h - 20 };
        if (P.view !== "kmap") drawVenn(left); if (P.view !== "venn") drawKmap(P.view === "both" ? right : left);
      }
      function renderHtml() {
        if (!R || !R.rows) { api.html(`<div style="color:${C.danger}">${esc(R ? R.error : "")}</div>`); return; }
        const main = fmtAst(R.a.ast), cols = R.subs.filter((s) => s.s !== main).slice(0, 8);
        let h = (R.error ? `<div style="color:${C.danger};margin-bottom:6px">${esc(R.error)}</div>` : "") + `<table><tr>${R.vars.map((v) => `<th>${esc(v)}</th>`).join("")}${cols.map((c) => `<th style="color:${C.muted};font-weight:400">${esc(c.s)}</th>`).join("")}<th style="color:${C.accent}">${esc(main)}</th>${R.b ? `<th style="color:${C.secondary}">${esc(fmtAst(R.b.ast))}</th>` : ""}</tr>`;
        R.rows.forEach((env, i) => { h += `<tr${R.diff.includes(i) ? ' style="background:rgba(255,107,107,0.12)"' : ""}>${R.vars.map((v) => `<td>${env[v] ? "T" : "F"}</td>`).join("")}${cols.map((c) => `<td style="color:${C.muted}">${evalAst(c.n, env) ? "T" : "F"}</td>`).join("")}<td style="color:${R.v1[i] ? C.ok : C.danger};font-weight:700">${R.v1[i] ? "T" : "F"}</td>${R.b ? `<td style="color:${R.v2[i] ? C.ok : C.danger};font-weight:700">${R.v2[i] ? "T" : "F"}</td>` : ""}</tr>`; });
        api.html(h + "</table>" + (R.b && R.diff.length ? `<div style="color:${C.muted};font-size:.8rem;margin-top:4px">Highlighted rows are where the two formulas disagree.</div>` : ""));
      }
      function readout() {
        if (!R || !R.rows) { api.readout({ "Parse": "✗ " + (R ? R.error : "") }); api.setStatus("Fix the formula: " + (R ? R.error : "")); return; }
        const a = R.a.ast, mc = a.k === "bin" ? OPSYM[a.op] : a.k === "not" ? "¬" : "— (atom)";
        api.readout({ "Classification": R.cls, "Satisfying rows": `${R.nT} / ${R.rows.length}`, "Variables": R.vars.join(", ") || "none", "Main connective": mc, "Formula 2": !R.b ? (R.error ? "✗ parse error" : "—") : R.rel === "equivalent" ? "equivalent ✓" : R.rel === "negations" ? "negations of each other" : `differ on ${R.diff.length} row${R.diff.length > 1 ? "s" : ""}` });
        api.setStatus(R.cls === "tautology" ? "True in every row — a logical truth." : R.cls === "contradiction" ? "False in every row — unsatisfiable." : "Contingent: its truth depends on the variables.");
      }
      api.onParam((k) => { if (k === "f1" || k === "f2" || k === "view") compute(); });
      api.onResize(draw);
      compute();
      return { example(a, b) { api.setParam("f1", a); api.setParam("f2", b); }, swap() { const a = P.f1; api.setParam("f1", P.f2); api.setParam("f2", a); }, destroy() {} };
    },
  });

  /** Minimal plot frame (grid, border, y labels); returns scale functions. */
  function plotFrame(ctx, C, box, xr, yr, title, yd) {
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1; for (let i = 0; i <= 4; i++) { const y = box.y + (i / 4) * box.h; ctx.beginPath(); ctx.moveTo(box.x, y); ctx.lineTo(box.x + box.w, y); ctx.stroke(); }
    ctx.strokeStyle = C.axis; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
    if (title) text(ctx, title, box.x + 4, box.y - 6, C.text, { bold: true });
    text(ctx, fx(yr[1], yd == null ? 1 : yd), box.x - 4, box.y + 4, C.muted, { align: "right", size: 10 }); text(ctx, fx(yr[0], yd == null ? 1 : yd), box.x - 4, box.y + box.h, C.muted, { align: "right", size: 10 });
    const dx = (xr[1] - xr[0]) || 1, dy = (yr[1] - yr[0]) || 1;
    return { sx: (x) => box.x + ((x - xr[0]) / dx) * box.w, sy: (y) => box.y + box.h - ((y - yr[0]) / dy) * box.h };
  }

  // ======================= 2. Trolley lab =======================
  const DILEMMAS = [
    { id: "switch", title: "1 · The Switch", scene: "track", act: "Pull the lever", omit: "Do nothing", text: "A runaway trolley will kill five workers on the main track. You can pull a lever to divert it onto a side track, where it will kill one worker." },
    { id: "footbridge", title: "2 · The Footbridge", scene: "bridge", act: "Push him", omit: "Do nothing", text: "Same trolley, same five workers. You stand on a footbridge beside a very large stranger. Pushing him onto the track would stop the trolley — killing him and saving the five." },
    { id: "loop", title: "3 · The Loop", scene: "loop", act: "Pull the lever", omit: "Do nothing", text: "You can divert the trolley onto a side loop that rejoins the main track before the five. One heavy worker on the loop would stop it. If he weren't there, the trolley would loop round and kill the five anyway." },
    { id: "surgeon", title: "4 · The Transplant Surgeon", scene: "hospital", act: "Harvest the organs", omit: "Let the five die", text: "Five patients will die today without organ transplants. A healthy visitor is a perfect match for all five. Nobody would ever find out." },
    { id: "self", title: "5 · Self-Sacrifice", scene: "bridge_self", act: "Jump", omit: "Stay on the bridge", text: "The footbridge again — but this time only your own body is heavy enough to stop the trolley. Jumping kills you and saves the five." },
    { id: "fog", title: "6 · Fog of Uncertainty", scene: "fog", act: "Pull the lever", omit: "Do nothing", text: "Thick fog. You are told the five will scramble clear in time with 50 % probability. The one worker on the side track will certainly die if you divert." },
    { id: "numbers", title: "7 · How Many Is Enough?", scene: "track", act: "Pull the lever", omit: "Do nothing", usesN: true, text: "The classic switch — but you set how many people are on the main track with the slider. Would you divert, killing one, to save that many? Re-answer with different numbers to find your threshold." },
    { id: "kin", title: "8 · Someone You Love", scene: "track", act: "Pull the lever", omit: "Do nothing", kinSide: true, text: "The classic switch with five strangers on the main track — but the one person on the side track is your closest friend." },
  ];
  S.register({
    id: "trolley_lab",
    name: "Trolley Problem Laboratory",
    domains: ["philosophy"],
    description: "Eight variations on the trolley problem — switch, footbridge, loop, surgeon, self-sacrifice, uncertainty, numbers and loyalty. Choose, watch the consequences play out, and see which moral principles your pattern of answers fits best. There are no right answers here, only reasons.",
    params: [{ key: "N", label: "People on the main track (dilemma 7)", type: "range", min: 1, max: 50, step: 1, value: 5 }],
    actions: [
      { label: "Act", fn: (h) => h.choose(true) }, { label: "Do nothing", fn: (h) => h.choose(false) },
      { label: "◀ Previous", fn: (h) => h.go(-1) }, { label: "Next ▶", fn: (h) => h.go(1) }, { label: "Restart", fn: (h) => h.restart() },
    ],
    challenges: [
      { id: "all_eight", xp: 15, text: "Work through all eight dilemmas and read your inferred profile and the tensions it flags." },
      { id: "loop_puzzle", xp: 10, text: "If you pulled the lever in the Switch but not in the Loop (or vice versa): write down the one feature that changed your mind, and ask whether it would survive a surgeon-style case." },
      { id: "threshold", xp: 15, text: "Find your own threshold in dilemma 7: re-answer it with at least two different numbers until you locate the smallest crowd for which diverting feels right." },
      { id: "utilitarian_pass", xp: 20, text: "Restart and answer every dilemma as a strict act-utilitarian would. Which theory does the fit report, and which 'tensions' disappear?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, P = api.params;
      let idx = 0, ans = {}, anim = 1, passes = 0, frame = 0; const numTried = new Set();
      const cur = () => DILEMMAS[idx], lives = (d) => (d.usesN ? Math.round(num(P.N, 5)) : 5);
      function person(x, y, s, color, dead) {
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        if (dead) { ctx.beginPath(); ctx.moveTo(x - s * 0.7, y - s * 0.9); ctx.lineTo(x + s * 0.7, y + s * 0.1); ctx.moveTo(x + s * 0.7, y - s * 0.9); ctx.lineTo(x - s * 0.7, y + s * 0.1); ctx.stroke(); return; }
        circle(ctx, x, y - s * 1.7, s * 0.35, color); ctx.beginPath(); ctx.moveTo(x, y - s * 1.35); ctx.lineTo(x, y - s * 0.55); ctx.moveTo(x - s * 0.5, y - s * 1.05); ctx.lineTo(x + s * 0.5, y - s * 1.05); ctx.moveTo(x, y - s * 0.55); ctx.lineTo(x - s * 0.4, y); ctx.moveTo(x, y - s * 0.55); ctx.lineTo(x + s * 0.4, y); ctx.stroke();
      }
      function group(x, y, n, s, color, dead) { for (let i = 0; i < n; i++) { const r = Math.floor(i / 10), c = i % 10, inRow = Math.min(n - r * 10, 10); person(x + (c - (inRow - 1) / 2) * s * 1.3, y - r * s * 1.9, s, color, dead); } }
      function track(pts) { ctx.save(); ctx.lineJoin = "round"; ctx.strokeStyle = "#5b6487"; ctx.lineWidth = 6; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = C.bg; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.stroke(); ctx.restore(); }
      function along(pts, f) { const segs = []; let L = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; } let d = clamp(f, 0, 1) * L; for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const t = segs[i] > 0 ? clamp(d / segs[i], 0, 1) : 1; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; } d -= segs[i]; } return pts[pts.length - 1]; }
      function trolley(x, y) { roundRect(ctx, x - 16, y - 22, 32, 18, 4, C.secondary, C.text, 1); circle(ctx, x - 9, y - 3, 3.5, C.text); circle(ctx, x + 9, y - 3, 3.5, C.text); }
      function drawScene(b) {
        const d = cur(), a = ans[d.id], prog = a ? anim : 0, act = a ? a.act : null, n = a && d.usesN ? a.N : lives(d), ps = Math.max(5, Math.min(10, b.w / 60));
        const mainY = b.y + b.h * 0.7, sideY = b.y + b.h * 0.36, x0 = b.x + b.w * 0.05, x1 = b.x + b.w * 0.97, sw = b.x + b.w * 0.36;
        if (d.scene === "track" || d.scene === "loop" || d.scene === "fog") {
          const loop = d.scene === "loop", side = loop ? [[sw, mainY], [sw + b.w * 0.1, sideY], [b.x + b.w * 0.7, sideY], [b.x + b.w * 0.8, mainY]] : [[sw, mainY], [sw + b.w * 0.1, sideY], [x1, sideY]];
          const gx = b.x + b.w * (loop ? 0.9 : 0.8), ox = b.x + b.w * (loop ? 0.6 : 0.68);
          track([[x0, mainY], [x1, mainY]]); track(side);
          const pathAct = [[x0, mainY], side[0], side[1], loop ? [ox, sideY] : [x1 - 12, sideY]], pathOmit = [[x0, mainY], [gx + 20, mainY]];
          const tp = along(act ? pathAct : pathOmit, prog), hitOne = act === true && tp[1] <= sideY + 2 && tp[0] >= ox - 6;
          const escaped = d.scene === "fog" && a && a.escaped, groupDead = act === false && prog >= 0.85 && !escaped, groupSafe = (act === true && prog >= 0.85) || (escaped && prog >= 0.85);
          if (d.scene === "fog") { ctx.fillStyle = "rgba(200,200,220,0.28)"; ctx.fillRect(gx - b.w * 0.13, mainY - ps * 4, b.w * 0.26, ps * 4.6); text(ctx, "fog — 50 % chance they escape", gx, mainY - ps * 4.4, C.muted, { align: "center", size: 10 }); }
          group(gx, mainY - 4, n, ps, groupDead ? C.danger : groupSafe ? C.ok : C.text, groupDead);
          person(ox, sideY - 4, ps, hitOne ? C.danger : d.kinSide ? C.secondary : C.text, hitOne);
          if (d.kinSide) text(ctx, "your friend", ox, sideY - ps * 2.8, C.secondary, { align: "center", size: 10 });
          text(ctx, n + (n === 1 ? " person" : " people"), gx, mainY + 18, C.muted, { align: "center", size: 10 });
          circle(ctx, sw, mainY + 22, 5, act === true ? C.ok : C.muted); text(ctx, "lever", sw, mainY + 38, C.muted, { align: "center", size: 10 });
          if (escaped && prog >= 0.85) text(ctx, "they escaped!", gx, mainY + 32, C.ok, { align: "center", size: 11, bold: true });
          trolley(tp[0], tp[1]);
        } else if (d.scene === "bridge" || d.scene === "bridge_self") {
          const gx = b.x + b.w * 0.8, bx = b.x + b.w * 0.44, by = b.y + b.h * 0.33;
          track([[x0, mainY], [x1, mainY]]);
          ctx.fillStyle = "#3a4160"; ctx.fillRect(bx - b.w * 0.12, by, b.w * 0.24, 8); ctx.fillRect(bx - b.w * 0.12, by, 8, mainY - by); ctx.fillRect(bx + b.w * 0.12 - 8, by, 8, mainY - by);
          const fy = by + (mainY - 4 - by) * (act === true ? clamp(prog / 0.4, 0, 1) : 0), victimDead = act === true && prog >= 0.4, groupDead = act === false && prog >= 0.85;
          const tx = act === null ? x0 : act ? x0 + (bx - 28 - x0) * clamp(prog / 0.9, 0, 1) : x0 + (gx + 20 - x0) * prog;
          if (d.scene === "bridge") { person(bx - 16, by, ps * 0.9, C.accent, false); text(ctx, "you", bx - 16, by - ps * 2.7, C.accent, { align: "center", size: 10 }); person(bx + 10, fy, ps * 1.3, victimDead ? C.danger : C.text, victimDead); }
          else { person(bx + 4, fy, ps, victimDead ? C.danger : C.accent, victimDead); text(ctx, "you", bx + 4, Math.min(fy, by) - ps * 2.7, C.accent, { align: "center", size: 10 }); }
          group(gx, mainY - 4, 5, ps, groupDead ? C.danger : act === true && prog >= 0.9 ? C.ok : C.text, groupDead);
          trolley(tx, mainY);
        } else {
          const vx = b.x + b.w * 0.22, px = b.x + b.w * 0.72, harvested = act === true && prog >= 0.5, fiveDead = act === false && prog >= 0.85;
          ctx.fillStyle = "#1c2140"; ctx.fillRect(b.x + b.w * 0.5, b.y + 8, b.w * 0.47, b.h - 16); text(ctx, "ward — five patients awaiting organs", b.x + b.w * 0.52, b.y + 26, C.muted, { size: 10 });
          for (let i = 0; i < 5; i++) { const y = b.y + 56 + i * (b.h - 76) / 5; ctx.fillStyle = "#3a4160"; ctx.fillRect(px - 34, y + 2, 68, 8); person(px - 12, y + 4, ps * 0.8, fiveDead ? C.danger : harvested ? C.ok : C.text, fiveDead); }
          person(vx, mainY, ps * 1.3, harvested ? C.danger : C.text, harvested); text(ctx, "healthy visitor", vx, mainY + 16, C.muted, { align: "center", size: 10 });
          if (act !== null) text(ctx, act ? (harvested ? "organs harvested — five saved, one killed" : "preparing surgery…") : (fiveDead ? "the five have died" : "waiting…"), b.x + 8, b.y + b.h - 26, C.muted, { size: 11 });
        }
      }
      function profile() {
        const has = (id) => ans[id] != null, act = (id) => (has(id) ? (ans[id].act ? 1 : 0) : null), inv = (x) => (x == null ? null : 1 - x);
        const avg = (arr) => { const v = arr.filter((x) => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
        const N = has("numbers") ? ans.numbers.N : null, ln = (x) => Math.log(Math.max(1, x)) / Math.log(50);
        const cons = avg(DILEMMAS.map((d) => (!has(d.id) || (d.id === "numbers" && N <= 1) ? null : act(d.id))));
        const doing = avg([inv(act("switch")), N != null && N >= 5 ? inv(act("numbers")) : null, inv(act("fog"))]);
        const meansAct = avg([act("footbridge"), act("loop"), act("surgeon")]), means = meansAct == null ? null : clamp((act("switch") == null ? 1 : act("switch")) - meansAct, 0, 1);
        const nums = N == null ? null : ans.numbers.act ? 1 - 0.7 * ln(N) : 0.3 * (1 - ln(N));
        const theories = [
          ["Act utilitarianism (maximise lives saved)", cons],
          ["Kantian constraint (never merely as a means)", avg([inv(act("footbridge")), inv(act("loop")), inv(act("surgeon"))])],
          ["Doctrine of double effect", avg([act("switch"), act("fog"), inv(act("footbridge")), inv(act("loop")), inv(act("surgeon"))])],
          ["Partialism / ethics of care", avg([act("switch"), inv(act("kin"))])],
          ["Strict non-interference (doing ≫ allowing)", avg(DILEMMAS.map((d) => (d.id === "self" ? null : inv(act(d.id)))))],
        ].filter((t) => t[1] != null).sort((a, b) => b[1] - a[1]);
        const notes = [];
        if (act("switch") === 1 && act("loop") === 0) notes.push("Switch yes, Loop no: the outcomes are identical — only the one person's causal role differs. Is that morally relevant to you?");
        if (act("switch") === 0 && act("loop") === 1) notes.push("Loop yes, Switch no: unusual — in the Loop the one person is used as a trolley-stopper, which most people find harder to accept.");
        if (act("footbridge") === 0 && act("surgeon") === 1) notes.push("Footbridge no, Surgeon yes: both use one person's body as the means of saving five. What distinguishes them for you?");
        if (act("loop") === 1 && act("footbridge") === 0) notes.push("Loop yes, Footbridge no: both use the one person to stop the trolley; only physical contact differs. Does 'up close and personal' matter morally?");
        if (act("switch") === 0 && N != null && ans.numbers.act && N <= 5) notes.push(`You refused the classic switch but diverted to save ${N} — the same structure. Which answer do you stand by?`);
        if (act("switch") === 1 && act("kin") === 0) notes.push("You divert onto a stranger but not onto a friend: impartial theories call this bias; the ethics of care calls it fidelity.");
        if (act("self") === 1 && act("footbridge") === 0) notes.push("You would sacrifice yourself but not push a stranger — many philosophers see an agent-relative permission here, not a contradiction.");
        if (act("fog") === 1 && act("switch") === 0) notes.push("You divert under uncertainty but not with certainty? Check whether expected-value reasoning is doing the work.");
        if (act("surgeon") === 1 && act("footbridge") === 1 && act("switch") === 1) notes.push("Consistently consequentialist. Consider the rule-level objection: would you want to live in a society where surgeons may do this?");
        return { cons, doing, means, nums, theories, notes, answered: Object.keys(ans).length };
      }
      api.loop((dt) => { if (anim < 1) anim = Math.min(1, anim + dt / 2.2); draw(); if ((frame++ % 10) === 0) readout(); });
      function draw() {
        const w = cv.width, h = cv.height, d = cur(), pr = profile(), box = { x: 10, y: 28, w: w * 0.64, h: h - 40 }; clearCanvas(ctx, w, h, C);
        text(ctx, d.title, 12, 18, C.text, { bold: true, size: 13 }); ctx.strokeStyle = C.grid; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
        drawScene(box);
        const a = ans[d.id]; text(ctx, a ? "your choice: " + (a.act ? d.act : d.omit) : "choose: Act or Do nothing", box.x + 8, box.y + box.h - 8, a ? C.accent : C.muted, { size: 11, bold: !!a });
        const px = w * 0.68, pw = w * 0.3; let y = 50;
        text(ctx, "Inferred moral profile", px, 20, C.text, { bold: true, size: 12 }); text(ctx, pr.answered + " / " + DILEMMAS.length + " answered", px + pw, 20, C.muted, { align: "right", size: 10 });
        [["Consequentialist weight", pr.cons, C.primary], ["Doing / allowing distinction", pr.doing, C.secondary], ["Means vs side-effect sensitivity", pr.means, C.accent], ["Sensitivity to numbers", pr.nums, C.ok]].forEach(([l, v, c]) => { hbar(ctx, C, px, y, pw, v, l, v == null ? "?" : pct(v, 0), c); y += 38; });
        text(ctx, "Best-fitting theories", px, y + 8, C.text, { bold: true, size: 12 }); y += 24;
        if (!pr.theories.length) text(ctx, "answer a few dilemmas first", px, y, C.muted); else pr.theories.slice(0, 3).forEach((t, i) => { text(ctx, (i + 1) + ". " + t[0], px, y, i === 0 ? C.accent : C.text, { size: 10 }); text(ctx, pct(t[1], 0), px + pw, y, C.muted, { align: "right", size: 10 }); y += 15; });
      }
      function renderHtml() {
        const d = cur(), a = ans[d.id], pr = profile();
        let h = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div><b>${esc(d.title)}</b><p style="margin:4px 0 8px">${esc(d.text)}</p><div style="color:${C.muted};font-size:.82rem">Act = <b style="color:${C.text}">${esc(d.act)}</b> · Do nothing = <b style="color:${C.text}">${esc(d.omit)}</b>${d.usesN ? ` · currently ${lives(d)} on the main track (slider)` : ""}</div>`;
        if (a) h += `<div style="margin-top:6px;color:${C.accent}">You chose: ${esc(a.act ? d.act : d.omit)}.</div>${d.scene === "fog" && !a.act ? `<div style="color:${C.muted}">Coin flip: the five ${a.escaped ? "escaped" : "did not escape"}.</div>` : ""}`;
        h += `</div><div><b>Reflection</b>`;
        h += pr.notes.length ? `<ul style="margin:4px 0 0 16px;padding:0">${pr.notes.map((s) => `<li style="margin-bottom:4px">${esc(s)}</li>`).join("")}</ul>` : `<div style="color:${C.muted}">No tensions flagged yet — they appear when structurally similar cases get different answers.</div>`;
        if (pr.answered === DILEMMAS.length && pr.theories.length) h += `<p style="margin-top:8px">All eight answered. Your pattern fits <b>${esc(pr.theories[0][0])}</b> best (${pct(pr.theories[0][1], 0)}). Fit is descriptive, not a verdict — the question is whether you endorse the pattern on reflection.</p>`;
        api.html(h + "</div></div>");
      }
      function readout() { const d = cur(), a = ans[d.id], pr = profile(), n = lives(d); api.readout({ "Dilemma": `${idx + 1} / ${DILEMMAS.length}`, "Your choice": a ? (a.act ? d.act : d.omit) : "—", "Deaths if you act": d.scene === "fog" ? "1 (certain)" : "1", "Deaths if you do nothing": d.scene === "fog" ? "5 or 0 (50/50) → 2.5 expected" : String(n), "Answered": `${pr.answered} / ${DILEMMAS.length}`, "Consequentialist weight": pr.cons == null ? "?" : pct(pr.cons, 0), "Doing / allowing": pr.doing == null ? "?" : pct(pr.doing, 0), "Means / side-effect": pr.means == null ? "?" : pct(pr.means, 0), "Numbers sensitivity": pr.nums == null ? "?" : pct(pr.nums, 0), "Best fit": pr.theories.length ? pr.theories[0][0] : "—" }); }
      function show() { anim = ans[cur().id] ? 1 : 0; renderHtml(); readout(); api.setStatus(cur().title + " — " + (ans[cur().id] ? "answered; you may change your answer." : "read the case below, then choose.")); }
      api.onParam((k) => { if (k === "N" && cur().usesN) renderHtml(); });
      show();
      return {
        choose(act) {
          const d = cur(), before = Object.keys(ans).length; ans[d.id] = { act, N: lives(d), escaped: api.random() < 0.5 }; anim = 0;
          if (d.usesN) { numTried.add(lives(d)); if (numTried.size >= 2) api.award("threshold"); }
          if (before < DILEMMAS.length && Object.keys(ans).length === DILEMMAS.length) { passes++; api.award("all_eight"); if (passes >= 2 && profile().cons >= 0.99) api.award("utilitarian_pass"); }
          renderHtml(); readout(); api.setStatus(`${d.title}: ${act ? d.act : d.omit}. ${idx < DILEMMAS.length - 1 ? "Watch the outcome, then press Next ▶." : "That was the last one — see your profile."}`);
        },
        go(delta) { idx = clamp(idx + delta, 0, DILEMMAS.length - 1); show(); },
        restart() { ans = {}; idx = 0; numTried.clear(); show(); api.setStatus("Restarted. Your earlier answers were cleared — try answering from a single theory's point of view."); },
        destroy() {},
      };
    },
  });

  // ======================= 3. Prisoner's dilemma =======================
  const PD = {
    tft: { name: "Tit-for-Tat", f: (me, op) => (op.length ? op[op.length - 1] : "C") },
    gtft: { name: "Generous Tit-for-Tat", f: (me, op, I, rand) => (!op.length || op[op.length - 1] === "C" ? "C" : rand() < I.g ? "C" : "D") },
    allc: { name: "Always cooperate", f: () => "C" },
    alld: { name: "Always defect", f: () => "D" },
    grim: { name: "Grim trigger", f: (me, op, I) => (I.betrayed ? "D" : "C") },
    pavlov: { name: "Pavlov (win-stay, lose-shift)", f: (me, op, I) => (!me.length ? "C" : I.lastPay >= I.R ? me[me.length - 1] : me[me.length - 1] === "C" ? "D" : "C") },
    random: { name: "Random 50/50", f: (me, op, I, rand) => (rand() < 0.5 ? "C" : "D") },
  };
  const PD_KEYS = Object.keys(PD);
  const pdPayoff = (a, b, pay) => (a === "C" ? (b === "C" ? [pay.R, pay.R] : [pay.S, pay.T]) : (b === "C" ? [pay.T, pay.S] : [pay.P, pay.P]));
  const pdPlayer = (key) => ({ key, hist: [], pay: [], score: 0, coop: 0, betrayed: false });
  function pdMove(pl, opp, pay, rand, noise) { let m = PD[pl.key].f(pl.hist, opp.hist, { lastPay: pl.pay.length ? pl.pay[pl.pay.length - 1] : 0, R: pay.R, g: pay.g, betrayed: pl.betrayed }, rand); if (rand() < noise) m = m === "C" ? "D" : "C"; return m; }
  function pdRecord(a, b, ma, mb, pay) { const [pa, pb] = pdPayoff(ma, mb, pay); a.hist.push(ma); b.hist.push(mb); a.pay.push(pa); b.pay.push(pb); a.score += pa; b.score += pb; if (ma === "C") a.coop++; if (mb === "C") b.coop++; if (mb === "D") a.betrayed = true; if (ma === "D") b.betrayed = true; return [pa, pb]; }
  function pdMatch(ka, kb, rounds, pay, noise, rand) { const a = pdPlayer(ka), b = pdPlayer(kb); for (let r = 0; r < rounds; r++) { const ma = pdMove(a, b, pay, rand, noise), mb = pdMove(b, a, pay, rand, noise); pdRecord(a, b, ma, mb, pay); } return { a: a.score / rounds, ca: a.coop / rounds }; }
  S.register({
    id: "prisoners_dilemma",
    name: "Iterated Prisoner's Dilemma",
    domains: ["philosophy", "ai", "math"],
    description: "Play the iterated prisoner's dilemma against classic strategies, run an Axelrod-style round-robin tournament with noisy moves, and watch replicator dynamics decide which strategies survive in a population.",
    params: [
      { key: "T", label: "T — temptation (defect against a cooperator)", type: "range", min: 0, max: 10, step: 0.5, value: 5 },
      { key: "R", label: "R — reward (mutual cooperation)", type: "range", min: 0, max: 10, step: 0.5, value: 3 },
      { key: "P", label: "P — punishment (mutual defection)", type: "range", min: 0, max: 10, step: 0.5, value: 1 },
      { key: "S", label: "S — sucker's payoff (cooperate, get defected on)", type: "range", min: 0, max: 10, step: 0.5, value: 0 },
      { key: "opponent", label: "Opponent for manual play", type: "select", value: "tft", options: PD_KEYS.map((k) => ({ value: k, label: PD[k].name })) },
      { key: "noise", label: "Noise — chance a move flips", type: "range", min: 0, max: 0.3, step: 0.01, value: 0 },
      { key: "rounds", label: "Rounds per tournament match", type: "range", min: 10, max: 200, step: 10, value: 100 },
      { key: "mode", label: "View", type: "select", value: "tournament", options: [{ value: "manual", label: "Manual play" }, { value: "tournament", label: "Tournament results" }, { value: "evolution", label: "Evolutionary dynamics" }] },
    ],
    actions: [
      { label: "Cooperate", fn: (h) => h.play("C") }, { label: "Defect", fn: (h) => h.play("D") },
      { label: "Run tournament", fn: (h) => h.tournament() }, { label: "Evolve ▶ / ❚❚", fn: (h) => h.evolve() }, { label: "Reset all", fn: (h) => h.reset() },
    ],
    challenges: [
      { id: "beat_tft", xp: 15, text: "Over 20+ rounds against Tit-for-Tat, finish with a higher score than it. Then ask: did 'winning' earn you more than steady mutual cooperation would have?" },
      { id: "noise_grim", xp: 15, text: "Set noise to 8 % or more and run the tournament. Why does Grim Trigger collapse while Generous Tit-for-Tat holds up?" },
      { id: "not_dilemma", xp: 15, text: "Raise S above P (being exploited now beats mutual defection — a snowdrift / chicken game) and run the tournament. Does Always-Defect still win? Why is it no longer a dilemma?" },
      { id: "evolution_mix", xp: 20, text: "Run evolution from equal shares with 0 noise, then with ≥ 5 % noise for 30+ time units. Who takes over, and why does noise change the winner?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 440 }), ctx = cv.ctx, P = api.params, rand = makeRng(9);
      let me, opp, tour = null, evo = null, evoRunning = false, frame = 0;
      const pay = () => { const T = num(P.T, 5), R = num(P.R, 3), Pp = num(P.P, 1), Sv = num(P.S, 0); const g = clamp(Math.min(R - Sv > 1e-9 ? 1 - (T - R) / (R - Sv) : 0, T - Pp > 1e-9 ? (R - Pp) / (T - Pp) : 0), 0, 1); return { T, R, P: Pp, S: Sv, g }; };
      const validity = () => { const p = pay(); return { order: p.T > p.R && p.R > p.P && p.P > p.S, coop: 2 * p.R > p.T + p.S }; };
      function newManual() { me = pdPlayer("human"); opp = pdPlayer(P.opponent in PD ? P.opponent : "tft"); }
      function runTournament() {
        const p = pay(), rounds = Math.round(num(P.rounds, 100)), noise = num(P.noise, 0), n = PD_KEYS.length, A = PD_KEYS.map(() => new Array(n).fill(0)), coop = new Array(n).fill(0);
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const m = pdMatch(PD_KEYS[i], PD_KEYS[j], rounds, p, noise, rand); A[i][j] = m.a; coop[i] += m.ca / n; }
        tour = { A, coop, avg: A.map((row) => row.reduce((s, x) => s + x, 0) / n), rounds, noise, pay: p };
        if (noise >= 0.08) api.award("noise_grim"); if (p.S > p.P) api.award("not_dilemma");
        renderTable(); const best = PD_KEYS[tour.avg.indexOf(Math.max(...tour.avg))]; api.setStatus(`Tournament done: ${PD[best].name} scored highest on average (${fx(Math.max(...tour.avg), 2)} per round).`);
      }
      function newEvo() { if (!tour) runTournament(); const n = PD_KEYS.length; evo = { x: new Array(n).fill(1 / n), t: 0, hist: [{ t: 0, x: new Array(n).fill(1 / n) }] }; }
      function evoStep(dt) {
        const n = PD_KEYS.length, A = tour.A, x = evo.x, f = x.map((_, i) => A[i].reduce((s, a, j) => s + a * x[j], 0)), phi = x.reduce((s, xi, i) => s + xi * f[i], 0);
        for (let i = 0; i < n; i++) x[i] = Math.max(0, x[i] + x[i] * (f[i] - phi) * dt); const sum = x.reduce((s, v) => s + v, 0) || 1; for (let i = 0; i < n; i++) x[i] /= sum;
        evo.t += dt; evo.hist.push({ t: evo.t, x: x.slice() }); if (evo.hist.length > 600) evo.hist.shift();
        if (evo.t > 30 && num(P.noise, 0) >= 0.05) api.award("evolution_mix");
      }
      api.loop((dt) => { if (evoRunning && evo && tour) for (let i = 0; i < 2; i++) evoStep(Math.min(0.05, dt)); draw(); if ((frame++ % 6) === 0) readout(); });
      function drawManual(w, h) {
        const n = me.hist.length, start = Math.max(0, n - 50), cw = Math.min(22, (w - 130) / Math.max(1, Math.min(n, 50))), x0 = 110;
        text(ctx, "You", x0 - 8, 40, C.text, { align: "right", bold: true }); text(ctx, PD[opp.key].name, x0 - 8, 70, C.text, { align: "right", bold: true, size: 10 });
        for (let i = start; i < n; i++) { const x = x0 + (i - start) * cw; ctx.fillStyle = me.hist[i] === "C" ? C.ok : C.danger; ctx.fillRect(x, 28, cw - 2, 16); ctx.fillStyle = opp.hist[i] === "C" ? C.ok : C.danger; ctx.fillRect(x, 58, cw - 2, 16); text(ctx, me.pay[i], x + cw / 2 - 1, 92, C.muted, { align: "center", size: 9 }); }
        if (!n) text(ctx, "press Cooperate or Defect to play a round · green = C, red = D · numbers = your payoff", x0, 50, C.muted);
        const box = { x: 46, y: 118, w: w - 60, h: h - 140 }, maxS = Math.max(10, me.score, opp.score) * 1.05, f = plotFrame(ctx, C, box, [0, Math.max(20, n)], [0, maxS], "cumulative score", 0);
        let a = 0, b = 0; const pa = [[f.sx(0), f.sy(0)]], pb = [[f.sx(0), f.sy(0)]]; for (let i = 0; i < n; i++) { a += me.pay[i]; b += opp.pay[i]; pa.push([f.sx(i + 1), f.sy(a)]); pb.push([f.sx(i + 1), f.sy(b)]); }
        polyline(ctx, pa, C.primary, 2); polyline(ctx, pb, C.secondary, 2);
        const both = n * pay().R; polyline(ctx, [[f.sx(0), f.sy(0)], [f.sx(n), f.sy(Math.min(both, maxS))]], C.muted, 1, [4, 4]);
        text(ctx, "you", box.x + box.w - 6, box.y + 14, C.primary, { align: "right", size: 10 }); text(ctx, "opponent", box.x + box.w - 6, box.y + 26, C.secondary, { align: "right", size: 10 }); text(ctx, "dashed: if both had always cooperated", box.x + box.w - 6, box.y + 38, C.muted, { align: "right", size: 10 });
      }
      function drawTournament(w, h) {
        if (!tour) { text(ctx, "press Run tournament", 20, 40, C.muted); return; }
        const order = PD_KEYS.map((_, i) => i).sort((a, b) => tour.avg[b] - tour.avg[a]), maxAvg = Math.max(0.1, ...tour.avg), rowH = (h - 50) / order.length, bw = Math.max(60, w - 400);
        text(ctx, `Round-robin, ${tour.rounds} rounds per match, noise ${pct(tour.noise, 0)} — bar = average payoff per round, thin green bar = cooperation rate`, 14, 18, C.muted, { size: 10 });
        order.forEach((i, k) => { const y = 30 + k * rowH, bl = bw * tour.avg[i] / maxAvg; text(ctx, (k + 1) + ". " + PD[PD_KEYS[i]].name, 14, y + rowH * 0.5, C.text, { size: 11, bold: k === 0 }); ctx.fillStyle = C.series[i % C.series.length]; ctx.fillRect(230, y + 6, bl, rowH * 0.45); ctx.fillStyle = "rgba(110,231,183,0.7)"; ctx.fillRect(230, y + 9 + rowH * 0.45, bw * tour.coop[i], 4); text(ctx, fx(tour.avg[i], 2) + " / round · cooperates " + pct(tour.coop[i], 0), 236 + bl, y + rowH * 0.45, C.text, { size: 10 }); });
      }
      function drawEvo(w, h) {
        if (!evo) { text(ctx, "press Evolve ▶", 20, 40, C.muted); return; }
        const box = { x: 46, y: 28, w: w - 60, h: h - 56 }, H = evo.hist, t0 = H[0].t, t1 = Math.max(H[H.length - 1].t, t0 + 10), sx = (t) => box.x + (t - t0) / (t1 - t0) * box.w, sy = (v) => box.y + box.h - v * box.h;
        PD_KEYS.forEach((k, i) => { ctx.fillStyle = C.series[i % C.series.length]; ctx.globalAlpha = 0.85; ctx.beginPath(); H.forEach((s, j) => { let lo = 0; for (let q = 0; q < i; q++) lo += s.x[q]; if (j) ctx.lineTo(sx(s.t), sy(lo + s.x[i])); else ctx.moveTo(sx(s.t), sy(lo + s.x[i])); }); for (let j = H.length - 1; j >= 0; j--) { let lo = 0; for (let q = 0; q < i; q++) lo += H[j].x[q]; ctx.lineTo(sx(H[j].t), sy(lo)); } ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; });
        ctx.strokeStyle = C.axis; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
        text(ctx, "replicator dynamics  ẋᵢ = xᵢ (fᵢ − f̄)  ·  population share by strategy  ·  t = " + fx(evo.t, 1) + (evoRunning ? "" : "  (paused)"), box.x + 4, box.y - 8, C.muted, { size: 10 });
        const last = H[H.length - 1]; ctx.fillStyle = "rgba(15,18,34,0.75)"; ctx.fillRect(box.x + 4, box.y + 4, 190, 14 * PD_KEYS.length + 6); let ly = box.y + 16;
        PD_KEYS.forEach((k, i) => { ctx.fillStyle = C.series[i % C.series.length]; ctx.fillRect(box.x + 10, ly - 8, 10, 10); text(ctx, PD[k].name + "  " + pct(last.x[i], 0), box.x + 24, ly, C.text, { size: 10 }); ly += 14; });
      }
      function draw() { const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); if (P.mode === "manual") drawManual(w, h); else if (P.mode === "evolution") drawEvo(w, h); else drawTournament(w, h); }
      function renderTable() {
        const v = validity(), warn = (!v.order ? `<div style="color:${C.danger}">⚠ Not a prisoner's dilemma: needs T &gt; R &gt; P &gt; S.</div>` : "") + (!v.coop ? `<div style="color:${C.accent}">⚠ 2R ≤ T + S: taking turns exploiting each other beats mutual cooperation.</div>` : "");
        if (!tour) { api.html(warn); return; }
        let h = warn + `<table><tr><th>avg payoff / round</th>${PD_KEYS.map((k) => `<th style="font-weight:400;color:${C.muted}">vs ${esc(PD[k].name.split(" ")[0])}</th>`).join("")}<th>average</th><th>cooperates</th></tr>`;
        PD_KEYS.map((_, i) => i).sort((a, b) => tour.avg[b] - tour.avg[a]).forEach((i) => { h += `<tr><td style="color:${C.series[i % C.series.length]};font-weight:700">${esc(PD[PD_KEYS[i]].name)}</td>${tour.A[i].map((x) => `<td>${fx(x, 2)}</td>`).join("")}<td style="font-weight:700">${fx(tour.avg[i], 2)}</td><td>${pct(tour.coop[i], 0)}</td></tr>`; });
        api.html(h + "</table>");
      }
      function readout() {
        const p = pay(), v = validity(), o = { "Payoffs T, R, P, S": `${p.T}, ${p.R}, ${p.P}, ${p.S}` + (v.order ? " ✓" : " ✗ not a PD"), "Generous-TFT forgiveness g": fx(p.g, 2) };
        if (P.mode === "manual") { const n = me.hist.length; Object.assign(o, { "Rounds played": String(n), "Your score": fx(me.score, 1) + (n ? ` (${fx(me.score / n, 2)}/round)` : ""), [PD[opp.key].name + " score"]: fx(opp.score, 1), "Your cooperation rate": n ? pct(me.coop / n, 0) : "—", "Opponent cooperation rate": n ? pct(opp.coop / n, 0) : "—", "Last round": n ? `you ${me.hist[n - 1]}, they ${opp.hist[n - 1]}` : "—" }); }
        else if (P.mode === "tournament" && tour) { const bi = tour.avg.indexOf(Math.max(...tour.avg)), ci = tour.coop.indexOf(Math.max(...tour.coop)); Object.assign(o, { "Winner (avg payoff)": PD[PD_KEYS[bi]].name, "Most cooperative": PD[PD_KEYS[ci]].name + " " + pct(tour.coop[ci], 0), "Matches played": `${PD_KEYS.length * PD_KEYS.length} × ${tour.rounds} rounds`, "Noise used": pct(tour.noise, 0) }); }
        else if (P.mode === "evolution" && evo) { const x = evo.x, di = x.indexOf(Math.max(...x)); Object.assign(o, { "Time": fx(evo.t, 1), "Dominant strategy": PD[PD_KEYS[di]].name + " " + pct(x[di], 0), "Strategies alive (> 1 %)": String(x.filter((s) => s > 0.01).length), "Population mean payoff": fx(x.reduce((s, xi, i) => s + xi * tour.A[i].reduce((q, a, j) => q + a * x[j], 0), 0), 2) }); }
        api.readout(o);
      }
      api.onParam((k) => { if (k === "opponent") { newManual(); api.setStatus("New match against " + PD[opp.key].name + "."); } if (["T", "R", "P", "S"].includes(k)) { const v = validity(); api.setStatus(v.order ? (v.coop ? "Valid prisoner's dilemma: T > R > P > S and 2R > T + S." : "T > R > P > S holds, but 2R ≤ T + S — alternating exploitation now beats mutual cooperation.") : "⚠ Not a prisoner's dilemma any more (needs T > R > P > S). Tournament results will change character."); renderTable(); } });
      newManual(); runTournament();
      api.setStatus("Tournament with zero noise: nice-but-retaliatory strategies lead. Add noise, change payoffs, or play by hand.");
      return {
        play(m) {
          if (P.mode !== "manual") api.setParam("mode", "manual"); const p = pay(), noise = num(P.noise, 0), om = pdMove(opp, me, p, rand, noise); let mm = m; if (rand() < noise) mm = mm === "C" ? "D" : "C";
          const [pa, pb] = pdRecord(me, opp, mm, om, p); if (me.hist.length >= 20 && opp.key === "tft" && me.score > opp.score) api.award("beat_tft");
          api.setStatus(`Round ${me.hist.length}: you played ${mm}${mm !== m ? " (noise flipped it!)" : ""}, ${PD[opp.key].name} played ${om} → you +${pa}, they +${pb}.`);
        },
        tournament() { if (P.mode !== "tournament") api.setParam("mode", "tournament"); runTournament(); },
        evolve() { if (P.mode !== "evolution") api.setParam("mode", "evolution"); if (!evo) newEvo(); evoRunning = !evoRunning; api.setStatus(evoRunning ? "Evolving: each strategy's share grows when its average payoff beats the population mean." : "Evolution paused."); },
        reset() { newManual(); tour = null; evo = null; evoRunning = false; renderTable(); api.setStatus("Reset. Run a tournament or play by hand."); },
        destroy() {},
      };
    },
  });

  // ======================= 4. Veil of ignorance =======================
  S.register({
    id: "veil_of_ignorance",
    name: "Veil of Ignorance",
    domains: ["philosophy"],
    description: "Design the income distribution of a five-citizen society without knowing which citizen you will be. Compare Rawls's maximin, the utilitarian average, the Gini coefficient and log-utility — then drop the veil and find out where you landed.",
    params: [
      { key: "q1", label: "Poorest citizen's share (%)", type: "range", min: 0, max: 100, step: 1, value: 3 },
      { key: "q2", label: "2nd citizen's share (%)", type: "range", min: 0, max: 100, step: 1, value: 8 },
      { key: "q3", label: "Middle citizen's share (%)", type: "range", min: 0, max: 100, step: 1, value: 14 },
      { key: "q4", label: "4th citizen's share (%)", type: "range", min: 0, max: 100, step: 1, value: 23 },
      { key: "q5", label: "Richest citizen's share (%)", type: "range", min: 0, max: 100, step: 1, value: 52 },
      { key: "total", label: "Total income of the five (k$ / year)", type: "range", min: 50, max: 500, step: 10, value: 250 },
      { key: "eta", label: "Risk aversion η (CRRA; η = 1 is log utility)", type: "range", min: 0, max: 3, step: 0.1, value: 1 },
      { key: "weighted", label: "Birth lottery favours poorer positions (2 : 1 odds)", type: "toggle", value: false },
    ],
    actions: [
      { label: "Drop the veil 🎲", fn: (h) => h.drop() }, { label: "Preset: equal", fn: (h) => h.preset([20, 20, 20, 20, 20]) },
      { label: "Preset: US-like", fn: (h) => h.preset([3, 8, 14, 23, 52]) }, { label: "Preset: Nordic", fn: (h) => h.preset([9, 14, 18, 23, 36]) },
    ],
    challenges: [
      { id: "maximin_vs_util", xp: 15, text: "Find a distribution where the utilitarian average is high but the poorest citizen gets under 5 %. Which principle would you choose behind the veil — and does your answer change with η?" },
      { id: "gini_half", xp: 10, text: "Dial in a distribution with Gini ≈ 0.50 (± 0.02) and compare it with the US-like preset." },
      { id: "drop_ten", xp: 10, text: "Drop the veil ten times. How does your average outcome compare with the mean income — and with the middle citizen?" },
      { id: "leaky_bucket", xp: 15, text: "Okun's leaky bucket: suppose every 10 % of income you redistribute destroys 2 % of the total. Would a maximin chooser still equalise completely? Where would they stop, and why?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 420 }), ctx = cv.ctx, P = api.params, KEYS = ["q1", "q2", "q3", "q4", "q5"], LABELS = ["poorest", "2nd", "middle", "4th", "richest"];
      let quiet = false, draws = [], last = null;
      const shares = () => KEYS.map((k) => Math.max(0, num(P[k], 20)));
      function normalise(changed) { // keep the five shares summing to 100 by rescaling the untouched ones
        const s = shares(), i = KEYS.indexOf(changed), rest = 100 - s[i], others = s.reduce((a, v, j) => a + (j === i ? 0 : v), 0);
        quiet = true; KEYS.forEach((k, j) => { if (j !== i) api.setParam(k, Math.round((others > 1e-9 ? s[j] * rest / others : rest / 4) * 10) / 10); }); quiet = false;
      }
      function metrics() {
        const s = shares(), sum = s.reduce((a, v) => a + v, 0) || 1, total = num(P.total, 250), y = s.map((v) => v / sum * total).sort((a, b) => a - b), n = 5, mu = total / n;
        let g = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) g += Math.abs(y[i] - y[j]);
        const eta = num(P.eta, 1), u = (c) => { c = Math.max(c, 0.05); return Math.abs(eta - 1) < 1e-9 ? Math.log(c) : (Math.pow(c, 1 - eta) - 1) / (1 - eta); };
        const wRaw = P.weighted ? [2, 1.68, 1.41, 1.19, 1] : [1, 1, 1, 1, 1], ws = wRaw.reduce((a, v) => a + v, 0), w = wRaw.map((v) => v / ws);
        return { y, w, gini: mu > 0 ? g / (2 * n * n * mu) : 0, min: y[0], mean: mu, median: y[2], logsum: y.reduce((a, c) => a + Math.log(Math.max(c, 0.05)), 0), eu: y.reduce((a, c, i) => a + w[i] * u(c), 0), ey: y.reduce((a, c, i) => a + w[i] * c, 0), ratio: y[0] > 0 ? y[4] / y[0] : Infinity, ascending: s.every((v, i) => i === 0 || v >= s[i - 1]) };
      }
      function draw() {
        const w = cv.width, h = cv.height, m = metrics(); clearCanvas(ctx, w, h, C);
        const bx = 44, by = 30, bw = w * 0.5 - 64, bh = h - 74, maxY = Math.max(1, ...m.y) * 1.18, slot = (bw - 10) / 5, cw = slot - 10;
        text(ctx, "Income per citizen (k$ / year)", bx, 18, C.text, { bold: true });
        ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.stroke();
        m.y.forEach((v, i) => { const x = bx + 10 + i * slot, hh = v / maxY * bh, mine = last && last.i === i; ctx.fillStyle = mine ? C.accent : C.series[i]; ctx.fillRect(x, by + bh - hh, cw, hh); text(ctx, fx(v, 0), x + cw / 2, by + bh - hh - 4, C.text, { align: "center", size: 10 }); text(ctx, LABELS[i], x + cw / 2, by + bh + 14, C.muted, { align: "center", size: 10 }); if (mine) text(ctx, "YOU", x + cw / 2, by + bh - hh - 17, C.accent, { align: "center", bold: true, size: 11 }); });
        const my = by + bh - m.mean / maxY * bh; polyline(ctx, [[bx, my], [bx + bw, my]], C.muted, 1, [4, 4]); text(ctx, "mean " + fx(m.mean, 0), bx + bw, my - 4, C.muted, { align: "right", size: 10 });
        const lx = w * 0.5 + 44, ly = 30, ls = Math.min(w * 0.5 - 74, h - 74);
        text(ctx, "Lorenz curve — Gini = " + fx(m.gini, 3), lx, 18, C.text, { bold: true });
        const tot = m.y.reduce((a, v) => a + v, 0) || 1, cum = [0]; let acc = 0; m.y.forEach((v) => { acc += v / tot; cum.push(acc); });
        const pts = cum.map((c, i) => [lx + (i / 5) * ls, ly + ls - c * ls]);
        ctx.fillStyle = "rgba(255,143,171,0.22)"; ctx.beginPath(); ctx.moveTo(lx, ly + ls); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(lx + ls, ly); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = C.axis; ctx.strokeRect(lx + 0.5, ly + 0.5, ls, ls); polyline(ctx, [[lx, ly + ls], [lx + ls, ly]], C.muted, 1, [3, 3]);
        polyline(ctx, pts, C.secondary, 2); pts.forEach((p) => circle(ctx, p[0], p[1], 3, C.secondary));
        text(ctx, "cumulative share of population →", lx + ls / 2, ly + ls + 14, C.muted, { align: "center", size: 10 });
        text(ctx, "shaded area ÷ triangle = Gini", lx + ls * 0.62, ly + ls * 0.9, C.muted, { align: "center", size: 10 }); text(ctx, "perfect equality", lx + ls * 0.3, ly + ls * 0.6, C.muted, { align: "center", size: 10 });
      }
      function readout() {
        const m = metrics();
        api.readout({ "Gini coefficient": fx(m.gini, 3), "Minimum income (maximin)": fx(m.min, 1) + " k$", "Average income (utilitarian)": fx(m.mean, 1) + " k$", "Σ log utility": fx(m.logsum, 3), ["Expected CRRA utility, η = " + fx(num(P.eta, 1), 1)]: fx(m.eu, 3), "Expected income under the lottery": fx(m.ey, 1) + " k$", "Richest ÷ poorest": Number.isFinite(m.ratio) ? fx(m.ratio, 1) + "×" : "∞", "Your draw": last ? `citizen ${last.i + 1} (${LABELS[last.i]}): ${fx(last.y, 1)} k$` : "— drop the veil", "Draws so far": draws.length ? `${draws.length}, mean ${fx(draws.reduce((a, v) => a + v, 0) / draws.length, 1)} k$` : "0" });
        if (Math.abs(m.gini - 0.5) <= 0.02) api.award("gini_half");
        if (!m.ascending) api.setStatus("Shares are not in ascending order — citizens have been re-ranked by income for the metrics.");
      }
      const render = () => { draw(); readout(); };
      api.onParam((k) => { if (quiet) return; if (KEYS.includes(k)) normalise(k); last = null; render(); });
      api.onResize(draw);
      render(); api.setStatus("A US-like split. Move any slider — the others rescale to keep 100 %. Then drop the veil.");
      return {
        drop() { const m = metrics(), r = api.random(); let acc = 0, i = 0; for (; i < 4; i++) { acc += m.w[i]; if (r < acc) break; } last = { i, y: m.y[i] }; draws.push(m.y[i]); if (draws.length >= 10) api.award("drop_ten"); render(); api.setStatus(`The veil drops: you are citizen ${i + 1} of 5 (${LABELS[i]}) with ${fx(m.y[i], 1)} k$ — mean ${fx(m.mean, 1)}, median ${fx(m.median, 1)}.`); },
        preset(v) { quiet = true; KEYS.forEach((k, i) => api.setParam(k, v[i])); quiet = false; last = null; render(); api.setStatus("Preset loaded."); },
        destroy() {},
      };
    },
  });

  // ======================= 5. Bayesian belief updating =======================
  S.register({
    id: "bayes_belief",
    name: "Bayesian Belief Updating",
    domains: ["philosophy", "math", "ai"],
    description: "A medical test on 1 000 people drawn as natural frequencies: see how a rare condition turns a 'very accurate' test into mostly false positives, then add tests one at a time to watch belief update sequentially.",
    params: [
      { key: "prior", label: "Prior P(condition) (%)", type: "range", min: 0.1, max: 50, step: 0.1, value: 2 },
      { key: "sens", label: "Sensitivity P(+ | condition) (%)", type: "range", min: 50, max: 100, step: 0.5, value: 95 },
      { key: "spec", label: "Specificity P(− | no condition) (%)", type: "range", min: 50, max: 100, step: 0.5, value: 90 },
      { key: "show", label: "Population grid", type: "select", value: "all", options: [{ value: "all", label: "show everyone" }, { value: "pos", label: "dim everyone who tested negative" }] },
    ],
    actions: [{ label: "Add positive test", fn: (h) => h.add(true) }, { label: "Add negative test", fn: (h) => h.add(false) }, { label: "Clear tests", fn: (h) => h.clear() }],
    challenges: [
      { id: "base_rate", xp: 15, text: "Set prior 1 %, sensitivity 99 %, specificity 95 % and guess P(condition | positive) before reading it. Most doctors guess above 90 %." },
      { id: "two_tests", xp: 15, text: "How many independent positive tests does it take for belief to pass 99 %? Add them one at a time and watch the curve." },
      { id: "spec_vs_sens", xp: 15, text: "With a 1 % prior, which helps the posterior more: sensitivity 90 → 99 % or specificity 90 → 99 %? Test both and explain it with the grid." },
      { id: "negative_test", xp: 10, text: "After two positives, add a negative test. Does belief fall all the way back to the prior? Why not?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 440 }), ctx = cv.ctx, P = api.params; let seq = [];
      function model() {
        const pr = clamp(num(P.prior, 2) / 100, 0.0001, 0.9999), se = clamp(num(P.sens, 95) / 100, 0.001, 0.9999), sp = clamp(num(P.spec, 90) / 100, 0.001, 0.9999);
        const sick = Math.round(pr * 1000), tp = Math.round(sick * se), fn = sick - tp, fp = Math.round((1000 - sick) * (1 - sp)), tn = 1000 - sick - fp;
        const post = pr * se / (pr * se + (1 - pr) * (1 - sp)), npv = (1 - pr) * sp / ((1 - pr) * sp + pr * (1 - se)), lrp = se / (1 - sp), lrn = (1 - se) / sp;
        let odds = pr / (1 - pr); const curve = [pr]; seq.forEach((s) => { odds *= s ? lrp : lrn; curve.push(odds / (1 + odds)); });
        const need = lrp > 1 ? Math.max(0, Math.ceil(Math.log(99 * (1 - pr) / pr) / Math.log(lrp))) : Infinity;
        return { pr, se, sp, sick, tp, fn, fp, tn, post, npv, lrp, lrn, curve, need, belief: curve[curve.length - 1] };
      }
      function draw() {
        const w = cv.width, h = cv.height, m = model(); clearCanvas(ctx, w, h, C);
        const cols = 40, rows = 25, cs = Math.min((w * 0.58) / cols, (h - 56) / rows), gx = 12, gy = 34, dim = P.show === "pos";
        text(ctx, "1 000 people — natural frequencies", gx, 18, C.text, { bold: true });
        for (let i = 0; i < 1000; i++) {
          const x = gx + (i % cols) * cs, y = gy + Math.floor(i / cols) * cs; let col, alpha = 1;
          if (i < m.tp) col = C.danger; else if (i < m.sick) { col = C.danger; alpha = 0.35; } else if (i < m.sick + m.fp) col = C.accent; else { col = "#3a4160"; alpha = 0.9; }
          if (dim && (i >= m.tp && i < m.sick || i >= m.sick + m.fp)) alpha *= 0.25;
          ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.fillRect(x + 1, y + 1, Math.max(1, cs - 2), Math.max(1, cs - 2)); ctx.globalAlpha = 1;
        }
        const ly = gy + rows * cs + 14; let lx = gx;
        [[C.danger, 1, `${m.tp} true positives`], [C.danger, 0.35, `${m.fn} false negatives`], [C.accent, 1, `${m.fp} false positives`], ["#3a4160", 0.9, `${m.tn} true negatives`]].forEach(([c, a, l]) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(lx, ly - 8, 9, 9); ctx.globalAlpha = 1; text(ctx, l, lx + 13, ly, C.muted, { size: 10 }); lx += 13 + ctx.measureText(l).width + 14; });
        const box = { x: w * 0.66, y: 34, w: w * 0.32, h: h - 80 }, nT = Math.max(4, seq.length + 1), f = plotFrame(ctx, C, box, [0, nT], [0, 1], "belief after each test", 1);
        [0.5, 0.95, 0.99].forEach((g) => { polyline(ctx, [[box.x, f.sy(g)], [box.x + box.w, f.sy(g)]], "rgba(255,255,255,0.18)", 1, [3, 3]); text(ctx, pct(g, 0), box.x + box.w - 3, f.sy(g) - 2, C.muted, { align: "right", size: 9 }); });
        const pts = m.curve.map((p, i) => [f.sx(i), f.sy(p)]); polyline(ctx, pts, C.primary, 2); pts.forEach((p, i) => circle(ctx, p[0], p[1], 4, i === 0 ? C.muted : seq[i - 1] ? C.danger : C.ok));
        const lastP = m.curve[m.curve.length - 1], lo = lastP / (1 - lastP); const nxt = (lr) => { const o = lo * lr; return o / (1 + o); };
        polyline(ctx, [pts[pts.length - 1], [f.sx(m.curve.length), f.sy(nxt(m.lrp))]], C.danger, 1, [3, 3]); polyline(ctx, [pts[pts.length - 1], [f.sx(m.curve.length), f.sy(nxt(m.lrn))]], C.ok, 1, [3, 3]);
        text(ctx, "tests → (red = positive, green = negative; dashed = what the next result would do)", box.x, box.y + box.h + 14, C.muted, { size: 9 });
        text(ctx, "P(condition | +) = " + pct(m.post, 1), box.x, box.y - 6 - 12, C.accent, { bold: true, size: 12 });
      }
      function readout() {
        const m = model();
        api.readout({ "Prior": pct(m.pr, 1), "Have the condition (of 1 000)": String(m.sick), "Test positive": `${m.tp + m.fp} (${m.tp} true + ${m.fp} false)`, "P(condition | positive)": pct(m.post, 1), "P(no condition | negative)": pct(m.npv, 2), "Likelihood ratios LR+ / LR−": fx(m.lrp, 1) + " / " + fx(m.lrn, 3), "Tests added": seq.length ? seq.map((s) => (s ? "+" : "−")).join(" ") : "none", ["Belief after " + seq.length + " test" + (seq.length === 1 ? "" : "s")]: pct(m.belief, 2), "Positives needed for 99 %": Number.isFinite(m.need) ? String(m.need) : "never (LR+ ≤ 1)" });
        const pr = num(P.prior, 2), se = num(P.sens, 95), sp = num(P.spec, 90);
        if (Math.abs(pr - 1) < 0.05 && se >= 98.5 && Math.abs(sp - 95) < 0.6) api.award("base_rate");
        if (seq.length >= 2 && m.belief >= 0.99) api.award("two_tests");
        if (seq.some((s, i) => !s && seq.slice(0, i).some(Boolean))) api.award("negative_test");
        api.setStatus(`Of the ${m.tp + m.fp} people who test positive, only ${m.tp} actually have the condition → ${pct(m.post, 1)}. The rare-condition base rate dominates.`);
      }
      const render = () => { draw(); readout(); };
      api.onParam(render); api.onResize(draw); render();
      return { add(pos) { if (seq.length < 12) seq.push(!!pos); render(); }, clear() { seq = []; render(); }, destroy() {} };
    },
  });

  // ======================= 6. Sorites paradox (vagueness) =======================
  const SORITES_THEORIES = {
    epistemic: {
      name: "Epistemicism (Williamson)",
      summary: "Every statement is strictly true (1) or false (0). There IS a single sharp grain k* where a non-heap becomes a heap — we just cannot know which grain it is because small shifts fail a margin-for-error principle.",
    },
    superval: {
      name: "Supervaluationism (Fine)",
      summary: "Vague terms admit a range of admissible precisifications [L, U]. 'Heap' is super-true above U, super-false below L, and truth-value gap in between — yet classical tautologies like H(n) ∨ ¬H(n) remain super-true everywhere!",
    },
    fuzzy: {
      name: "Degree / Fuzzy Theory (Łukasiewicz / Goguen)",
      summary: "Truth comes in degrees in [0, 1]. Each inductive step 'if n is a heap, n−1 is a heap' has truth ~0.98 — almost true, but chaining 100 steps under Łukasiewicz or product logic bleeds truth down to 0.",
    },
    contextual: {
      name: "Contextualism (Raffman / Kamp)",
      summary: "No fixed boundary exists, and the boundary moves with conversational context and attention: wherever you look closely, you never see a jump between adjacent numbers (forced-march hysteresis).",
    },
  };
  S.register({
    id: "sorites",
    name: "Sorites Paradox & Vagueness Lab",
    domains: ["philosophy", "math"],
    description: "Remove grains from a heap one at a time. Compare four philosophical theories of vagueness (Epistemicism, Supervaluationism, Fuzzy/Degree theory, Contextualism) and see how each resolves the Sorites chain.",
    params: [
      { key: "grains", label: "Number of grains (n)", type: "range", min: 0, max: 100, step: 1, value: 35 },
      { key: "theory", label: "Theory of vagueness", type: "select", value: "fuzzy", options: [
        { value: "fuzzy", label: "Degree / Fuzzy truth [0,1]" },
        { value: "superval", label: "Supervaluationism (penumbra)" },
        { value: "epistemic", label: "Epistemicism (unknowable sharp cutoff)" },
        { value: "contextual", label: "Contextualism (shifting boundary)" },
      ] },
      { key: "low", label: "Borderline lower bound L", type: "range", min: 5, max: 45, step: 1, value: 20 },
      { key: "high", label: "Borderline upper bound U", type: "range", min: 30, max: 85, step: 1, value: 60 },
      { key: "tnorm", label: "Fuzzy implication / t-norm", type: "select", value: "lukasiewicz", options: [
        { value: "lukasiewicz", label: "Łukasiewicz: v(A→B) = min(1, 1−v(A)+v(B))" },
        { value: "product", label: "Goguen (product): v(A→B) = min(1, v(B)/v(A))" },
        { value: "godel", label: "Gödel (min): v(A∧B) = min(v(A), v(B))" },
      ] },
    ],
    actions: [
      { label: "−1 grain (forced march)", fn: (h) => h.step(-1) },
      { label: "+1 grain", fn: (h) => h.step(1) },
      { label: "Reveal hidden cutoff", fn: (h) => h.toggleReveal() },
    ],
    challenges: [
      { id: "penumbra_lem", xp: 15, text: "Switch to Supervaluationism and place n inside the borderline zone [L, U]. Observe that v(Heap(n)) is indeterminate while v(Heap(n) ∨ ¬Heap(n)) is still 1 (super-true)." },
      { id: "fuzzy_leak", xp: 15, text: "In Fuzzy mode with Łukasiewicz logic, widen [L, U] so each step premise H(k)→H(k−1) has truth ≥ 0.97, yet the chained argument truth from 100 down to 0 drops to 0." },
      { id: "forced_march", xp: 15, text: "Use the '−1 grain (forced march)' button at least 10 times to march across the boundary and observe contextual shift / truth erosion." },
      { id: "find_cutoff", xp: 15, text: "In Epistemicism mode, find the exact grain k* where H(k*) = 1 and H(k*−1) = 0." },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 420 }), ctx = cv.ctx, P = api.params;
      const secretCutoff = 37;
      let reveal = false, marchSteps = 0, ctxShift = 0, lastN = num(P.grains, 35);
      // precompute deterministic grain offsets for visual pile
      const rng = makeRng(4242);
      const grainPts = Array.from({ length: 100 }, (_, i) => {
        const row = Math.floor(Math.sqrt(i)), col = i - row * row, span = row * 2 + 1;
        const u = span > 1 ? (col / (span - 1)) - 0.5 : 0;
        return { u: u + (rng() - 0.5) * 0.08, layer: row, jitterY: (rng() - 0.5) * 2.5, shade: 0.78 + rng() * 0.22 };
      });

      function bounds() {
        const L = clamp(num(P.low, 20), 1, 90);
        const U = clamp(Math.max(L + 4, num(P.high, 60)), L + 4, 99);
        const kStar = clamp(Math.round((L + U) / 2) + ((secretCutoff % 5) - 2), L + 1, U - 1);
        return { L, U, kStar };
      }

      function truthAt(n, b) {
        const th = P.theory;
        if (th === "epistemic") return n >= b.kStar ? 1 : 0;
        if (th === "superval") return n >= b.U ? 1 : n < b.L ? 0 : NaN; // NaN = gap
        const effL = clamp(b.L + (th === "contextual" ? ctxShift : 0), 1, 94);
        const effU = clamp(b.U + (th === "contextual" ? ctxShift : 0), effL + 4, 99);
        if (n <= effL) return 0;
        if (n >= effU) return 1;
        return (n - effL) / (effU - effL);
      }

      function evalModel() {
        const n = clamp(Math.round(num(P.grains, 35)), 0, 100);
        const b = bounds();
        const th = P.theory;
        const vN = truthAt(n, b);
        const vPrev = truthAt(Math.max(0, n - 1), b);
        // Step conditional H(n) -> H(n-1)
        let stepPremise = 1, lem = 1, nonContra = 1, chainTruth = 1;
        if (th === "epistemic") {
          stepPremise = (n === b.kStar) ? 0 : 1;
          lem = 1; nonContra = 1; chainTruth = 0; // one false premise kills the chain
        } else if (th === "superval") {
          // Precision k in [L, U]: H(n)v~H(n) holds in every k; H(n)->H(n-1) fails only when k == n
          const numPrec = (b.U - b.L) + 1;
          const fails = (n >= b.L && n <= b.U) ? 1 : 0;
          stepPremise = fails ? (numPrec - 1) / numPrec : 1; // super-truth is 0 (not true in all), degree of super-truth shown in status
          lem = 1; nonContra = 1; chainTruth = 0;
        } else {
          const vn = Number.isFinite(vN) ? vN : 0.5;
          const vp = Number.isFinite(vPrev) ? vPrev : 0.5;
          if (P.tnorm === "lukasiewicz") {
            stepPremise = Math.min(1, 1 - vn + vp);
            lem = Math.min(1, vn + (1 - vn));
            nonContra = 1 - Math.max(0, vn + (1 - vn) - 1);
            // chain of 100 steps in Łukasiewicz: max(0, 1 - sum(1 - p_k)) = 0
            let loss = 0;
            for (let k = 100; k >= 1; k--) {
              const a = truthAt(k, b), c = truthAt(k - 1, b);
              loss += Math.max(0, a - c);
            }
            chainTruth = Math.max(0, 1 - loss);
          } else if (P.tnorm === "product") {
            stepPremise = vn <= vp ? 1 : vp / Math.max(1e-6, vn);
            lem = vn + (1 - vn) - vn * (1 - vn);
            nonContra = 1 - vn * (1 - vn);
            let prod = 1;
            for (let k = 100; k >= 1; k--) {
              const a = truthAt(k, b), c = truthAt(k - 1, b);
              if (a > c) prod *= Math.max(0, c) / a;
            }
            chainTruth = prod;
          } else {
            stepPremise = vn <= vp ? 1 : vp;
            lem = Math.max(vn, 1 - vn);
            nonContra = 1 - Math.min(vn, 1 - vn);
            chainTruth = 0;
          }
        }
        return { n, b, th, vN, vPrev, stepPremise, lem, nonContra, chainTruth };
      }

      function draw() {
        const w = cv.width, h = cv.height, m = evalModel();
        clearCanvas(ctx, w, h, C);
        // Left: sand pile visualization
        const pileCx = w * 0.23, pileBaseY = h * 0.64, maxSpread = w * 0.18;
        text(ctx, `Pile of n = ${m.n} grain${m.n === 1 ? "" : "s"}`, pileCx, 22, C.text, { align: "center", bold: true, size: 13 });
        // Ground plate
        ctx.strokeStyle = C.axis; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pileCx - maxSpread - 16, pileBaseY + 6); ctx.lineTo(pileCx + maxSpread + 16, pileBaseY + 6); ctx.stroke();
        // Draw grains
        for (let i = 0; i < m.n; i++) {
          const g = grainPts[i];
          const spread = Math.min(maxSpread, 12 + g.layer * 11);
          const gx = pileCx + g.u * spread * 2;
          const gy = pileBaseY - (g.layer * 5.2) + (Math.abs(g.u) * g.layer * 3.6) + g.jitterY;
          circle(ctx, gx, gy, 3.6, `rgba(245, 198, 105, ${g.shade.toFixed(2)})`, "rgba(90,65,20,0.6)", 0.8);
        }
        // Verdict badge under pile
        let badgeTxt = "", badgeCol = C.primary;
        if (m.th === "superval") {
          if (m.n >= m.b.U) { badgeTxt = "SUPER-TRUE (definitely a heap)"; badgeCol = C.ok; }
          else if (m.n < m.b.L) { badgeTxt = "SUPER-FALSE (definitely not a heap)"; badgeCol = C.danger; }
          else { badgeTxt = `TRUTH-VALUE GAP (true in ${m.n - m.b.L + 1} of ${m.b.U - m.b.L + 1} precisifications)`; badgeCol = C.accent; }
        } else if (m.th === "epistemic") {
          badgeTxt = (m.vN === 1 ? "TRUE (Heap)" : "FALSE (Not a heap)") + (reveal ? `  [k* = ${m.b.kStar}]` : "  [k* hidden]");
          badgeCol = m.vN === 1 ? C.ok : C.danger;
        } else {
          badgeTxt = `Degree of truth v(Heap(${m.n})) = ${fx(m.vN, 3)}`;
          badgeCol = m.vN > 0.66 ? C.ok : m.vN < 0.33 ? C.danger : C.accent;
        }
        roundRect(ctx, 16, pileBaseY + 18, w * 0.43, 28, 6, "rgba(255,255,255,0.05)", badgeCol, 1.3);
        text(ctx, badgeTxt, 16 + w * 0.215, pileBaseY + 36, badgeCol, { align: "center", bold: true, size: 11 });

        // Theory summary box bottom-left
        const info = SORITES_THEORIES[m.th] || SORITES_THEORIES.fuzzy;
        text(ctx, info.name, 16, pileBaseY + 66, C.text, { bold: true, size: 11 });
        wrapText(ctx, info.summary, 16, pileBaseY + 82, w * 0.43, 14, C.muted, { size: 10 });

        // Right: truth profile curve across n = 0..100
        const box = { x: w * 0.50, y: 30, w: w * 0.46, h: h - 78 };
        const f = plotFrame(ctx, C, box, [0, 100], [0, 1], "Truth value v(Heap(n)) vs. number of grains n", 1);
        // Penumbra shading [L, U]
        const lx = f.sx(m.b.L), ux = f.sx(m.b.U);
        ctx.fillStyle = "rgba(255, 196, 86, 0.11)";
        ctx.fillRect(lx, box.y, Math.max(2, ux - lx), box.h);
        text(ctx, `penumbra [${m.b.L}, ${m.b.U}]`, (lx + ux) / 2, box.y + 14, C.accent, { align: "center", size: 10 });

        // Curve
        if (m.th === "superval") {
          polyline(ctx, [[f.sx(0), f.sy(0)], [f.sx(m.b.L), f.sy(0)]], C.danger, 2.5);
          polyline(ctx, [[f.sx(m.b.U), f.sy(1)], [f.sx(100), f.sy(1)]], C.ok, 2.5);
          // Dashed penumbra proportion of precisifications
          polyline(ctx, [[f.sx(m.b.L), f.sy(0)], [f.sx(m.b.U), f.sy(1)]], C.accent, 1.8, [4, 4]);
          text(ctx, "super-true = 1", f.sx((m.b.U + 100) / 2), f.sy(1) + 14, C.ok, { align: "center", size: 10 });
          text(ctx, "super-false = 0", f.sx(m.b.L / 2), f.sy(0) - 6, C.danger, { align: "center", size: 10 });
        } else if (m.th === "epistemic") {
          const kx = f.sx(m.b.kStar);
          polyline(ctx, [[f.sx(0), f.sy(0)], [kx, f.sy(0)], [kx, f.sy(1)], [f.sx(100), f.sy(1)]], C.primary, 2.5);
          if (reveal) {
            text(ctx, `sharp cutoff k* = ${m.b.kStar}`, kx, box.y + box.h - 10, C.secondary, { align: "center", bold: true, size: 10 });
          } else {
            ctx.fillStyle = "rgba(18, 22, 40, 0.88)";
            ctx.fillRect(lx + 2, box.y + 22, Math.max(4, ux - lx - 4), box.h - 26);
            text(ctx, "?  margin for error hides k*  ?", (lx + ux) / 2, box.y + box.h / 2, C.muted, { align: "center", size: 11 });
          }
        } else {
          const pts = [];
          for (let k = 0; k <= 100; k++) pts.push([f.sx(k), f.sy(truthAt(k, m.b))]);
          polyline(ctx, pts, C.primary, 2.5);
          if (m.th === "contextual" && ctxShift !== 0) {
            text(ctx, `context shift: ${ctxShift > 0 ? "+" : ""}${fx(ctxShift, 1)} grains`, box.x + box.w - 6, box.y + 14, C.secondary, { align: "right", size: 10 });
          }
        }

        // Current n marker
        const curX = f.sx(m.n);
        const curY = f.sy(Number.isFinite(m.vN) ? (m.n - m.b.L) / Math.max(1, m.b.U - m.b.L) : 0);
        const plotY = f.sy(Number.isFinite(m.vN) ? m.vN : clamp((m.n - m.b.L) / Math.max(1, m.b.U - m.b.L), 0, 1));
        polyline(ctx, [[curX, box.y], [curX, box.y + box.h]], "rgba(255,255,255,0.28)", 1, [3, 3]);
        circle(ctx, curX, plotY, 5.5, C.secondary, "#fff", 1.5);
        void curY;
        text(ctx, "0 grains", box.x, box.y + box.h + 15, C.muted, { size: 10 });
        text(ctx, "50", box.x + box.w / 2, box.y + box.h + 15, C.muted, { align: "center", size: 10 });
        text(ctx, "100 grains", box.x + box.w, box.y + box.h + 15, C.muted, { align: "right", size: 10 });
      }

      function readout() {
        const m = evalModel();
        const vStr = Number.isFinite(m.vN) ? fx(m.vN, 3) : `gap (${fx((m.n - m.b.L + 1) / (m.b.U - m.b.L + 1), 2)} super-truth)`;
        const stepStr = m.th === "superval"
          ? (m.n >= m.b.L && m.n <= m.b.U ? `almost super-true (${fx(m.stepPremise, 3)})` : "1.000 (super-true)")
          : fx(m.stepPremise, 3);
        api.readout({
          "Grains (n)": String(m.n),
          "v(Heap(n))": vStr,
          "Step premise v(H(n) → H(n−1))": stepStr,
          "Excluded middle v(H(n) ∨ ¬H(n))": fx(m.lem, 3),
          "Non-contradiction v(¬(H(n) ∧ ¬H(n)))": fx(m.nonContra, 3),
          "Chained Sorites argument (100 → 0)": fx(m.chainTruth, 3),
          "Forced-march steps taken": String(marchSteps),
        });
        if (m.th === "superval" && m.n >= m.b.L && m.n < m.b.U) api.award("penumbra_lem");
        if ((m.th === "fuzzy" || m.th === "contextual") && P.tnorm === "lukasiewicz" && m.stepPremise >= 0.97 && m.chainTruth <= 0.01 && (m.b.U - m.b.L) >= 34) api.award("fuzzy_leak");
        if (marchSteps >= 10) api.award("forced_march");
        if (m.th === "epistemic" && (m.n === m.b.kStar || m.n === m.b.kStar - 1)) api.award("find_cutoff");
        api.setStatus(`${SORITES_THEORIES[m.th].name}: v(H(${m.n})→H(${Math.max(0, m.n - 1)})) = ${ fx(m.stepPremise, 3) }, chained 100→0 truth = ${ fx(m.chainTruth, 3) }.`);
      }

      const render = () => { draw(); readout(); };
      api.onParam((k) => {
        if (k === "grains") {
          const cur = num(P.grains, 35);
          if (Math.abs(cur - lastN) === 1) {
            marchSteps++;
            ctxShift = clamp(ctxShift + (cur < lastN ? -0.6 : 0.6), -8, 8);
          }
          lastN = cur;
        }
        render();
      });
      api.onResize(draw);
      render();
      return {
        step(delta) {
          const next = clamp(Math.round(num(P.grains, 35)) + delta, 0, 100);
          marchSteps++;
          ctxShift = clamp(ctxShift + (delta < 0 ? -0.7 : 0.7), -8, 8);
          lastN = next;
          api.setParam("grains", next);
        },
        toggleReveal() {
          reveal = !reveal;
          if (P.theory !== "epistemic") api.setParam("theory", "epistemic");
          else render();
        },
        destroy() {},
      };
    },
  });

  // ======================= 7. Argument mapper & Pollock/Dung defeat calculus =======================
  const ARG_SCENARIOS = {
    socrates: {
      name: "1 · Deductive & Rebutting Counter-Argument (Mortals)",
      conclusion: "C: Socrates is mortal",
      nodes: [
        { id: "P1", label: "P1: All humans are mortal", base: 0.95, x: 0.20, y: 0.78 },
        { id: "P2", label: "P2: Socrates is human", base: 0.95, x: 0.48, y: 0.78 },
        { id: "D1", label: "D1: Plato made Socrates up (fictional)", base: 0.15, x: 0.78, y: 0.78 },
        { id: "C",  label: "C: Socrates is mortal", base: 0.50, x: 0.36, y: 0.22 },
      ],
      edges: [
        { from: ["P1", "P2"], to: "C", type: "linked", weight: 0.98, label: "Modus Ponens (linked)" },
        { from: ["D1"], to: "P2", type: "rebut", weight: 0.85, label: "rebuts P2" },
      ],
    },
    red_light: {
      name: "2 · Pollock's Red Light (Undercutting Defeater)",
      conclusion: "C: The object is red",
      nodes: [
        { id: "P1", label: "P1: The object looks red to me", base: 0.90, x: 0.22, y: 0.76 },
        { id: "I1", label: "I1: Perceptual warrant (looks red ⇒ is red)", base: 0.90, x: 0.52, y: 0.54 },
        { id: "U1", label: "U1: It is illuminated by red stage lights", base: 0.80, x: 0.80, y: 0.76 },
        { id: "R1", label: "R1: The light technician says the red filter is off", base: 0.10, x: 0.80, y: 0.26 },
        { id: "C",  label: "C: The object is actually red", base: 0.50, x: 0.24, y: 0.22 },
      ],
      edges: [
        { from: ["P1", "I1"], to: "C", type: "linked", weight: 0.95, label: "defeasible perception" },
        { from: ["U1"], to: "I1", type: "undercut", weight: 0.90, label: "undercuts warrant" },
        { from: ["R1"], to: "U1", type: "rebut", weight: 0.90, label: "defeats defeater (reinstatement)" },
      ],
    },
    alibis: {
      name: "3 · Convergent Evidence vs. Rebuttal (Courtroom)",
      conclusion: "C: The suspect was at the scene",
      nodes: [
        { id: "P1", label: "P1: Witness A saw the suspect", base: 0.70, x: 0.16, y: 0.78 },
        { id: "P2", label: "P2: Security camera matched jacket", base: 0.65, x: 0.48, y: 0.78 },
        { id: "D1", label: "D1: Time-stamped train ticket alibi", base: 0.25, x: 0.82, y: 0.78 },
        { id: "C",  label: "C: Suspect was at the scene", base: 0.50, x: 0.42, y: 0.22 },
      ],
      edges: [
        { from: ["P1"], to: "C", type: "convergent", weight: 0.80, label: "independent support" },
        { from: ["P2"], to: "C", type: "convergent", weight: 0.75, label: "independent support" },
        { from: ["D1"], to: "C", type: "rebut", weight: 0.95, label: "rebuts conclusion" },
      ],
    },
    free_will: {
      name: "4 · Consequence Argument vs. Compatibilism",
      conclusion: "C: No one has free will",
      nodes: [
        { id: "P1", label: "P1: Determinism is true (past + laws entail every action)", base: 0.75, x: 0.18, y: 0.80 },
        { id: "P2", label: "P2: No one can alter the past or laws of nature", base: 0.95, x: 0.52, y: 0.80 },
        { id: "U1", label: "U1: Humean/Lewisian local-miracle compatibilism", base: 0.30, x: 0.84, y: 0.76 },
        { id: "I1", label: "I1: Transfer principle Rule β (no choice transfers across ⇒)", base: 0.85, x: 0.42, y: 0.52 },
        { id: "C",  label: "C: No one has free will", base: 0.50, x: 0.36, y: 0.20 },
      ],
      edges: [
        { from: ["P1", "P2", "I1"], to: "C", type: "linked", weight: 0.95, label: "Consequence Argument" },
        { from: ["U1"], to: "I1", type: "undercut", weight: 0.85, label: "undercuts Rule β" },
      ],
    },
  };

  S.register({
    id: "argument_mapper",
    name: "Argument Mapper & Defeat Calculus",
    domains: ["philosophy", "ai"],
    description: "Map linked vs. convergent premises, rebutting defeaters, and Pollock-style undercutting defeaters. Adjust credence in each node or click nodes on the canvas to watch support propagate to the conclusion.",
    params: [
      { key: "scenario", label: "Argument structure", type: "select", value: "red_light", options: [
        { value: "red_light", label: "2 · Pollock's Red Light (undercut + reinstatement)" },
        { value: "socrates", label: "1 · Linked Deductive Argument (Modus Ponens)" },
        { value: "alibis", label: "3 · Convergent Courtroom Evidence vs. Alibi" },
        { value: "free_will", label: "4 · Consequence Argument vs. Compatibilism" },
      ] },
      { key: "wP1", label: "Credence in P1", type: "range", min: 0, max: 1, step: 0.05, value: 0.90 },
      { key: "wP2", label: "Credence in P2 / warrant", type: "range", min: 0, max: 1, step: 0.05, value: 0.90 },
      { key: "wDef", label: "Strength of defeater (D1 / U1)", type: "range", min: 0, max: 1, step: 0.05, value: 0.80 },
      { key: "wRein", label: "Strength of counter-defeater (R1)", type: "range", min: 0, max: 1, step: 0.05, value: 0.10 },
      { key: "mode", label: "Premise combination", type: "select", value: "scenario", options: [
        { value: "scenario", label: "Use scenario structure (linked vs. convergent)" },
        { value: "force_linked", label: "Force linked (weakest link: min)" },
        { value: "force_convergent", label: "Force convergent (noisy-OR: 1 − Π(1−s))" },
      ] },
    ],
    actions: [
      { label: "Disable defeaters", fn: (h) => h.setDefeaters(0, 0) },
      { label: "Activate undercutter", fn: (h) => h.setDefeaters(0.9, 0) },
      { label: "Reinstate (defeat the defeater)", fn: (h) => h.setDefeaters(0.9, 0.95) },
    ],
    challenges: [
      { id: "undercut_red", xp: 15, text: "In Pollock's Red Light, activate the red-light undercutter (U1 ≥ 0.8, R1 ≤ 0.15) so conclusion credence drops below 0.25 even though 'looks red' (P1) stays ≥ 0.85." },
      { id: "reinstate_red", xp: 15, text: "In Pollock's Red Light, raise the counter-defeater R1 ≥ 0.85 while U1 ≥ 0.8 to reinstate the perceptual warrant and bring conclusion credence above 0.70." },
      { id: "linked_vs_conv", xp: 15, text: "Drop P2 to 0.10 while P1 is 0.90, and compare 'Force linked' vs. 'Force convergent' modes to see why linked arguments fail on their weakest premise while convergent arguments survive." },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 430 }), ctx = cv.ctx, P = api.params;
      const seenModes = new Set();
      let selectedId = null;

      function evaluate() {
        const sc = ARG_SCENARIOS[P.scenario] || ARG_SCENARIOS.red_light;
        const p1 = clamp(num(P.wP1, 0.9), 0, 1);
        const p2 = clamp(num(P.wP2, 0.9), 0, 1);
        const def = clamp(num(P.wDef, 0.8), 0, 1);
        const rein = clamp(num(P.wRein, 0.1), 0, 1);

        // Effective strengths per node id
        const val = {};
        sc.nodes.forEach((nd) => { val[nd.id] = nd.base; });
        if ("P1" in val) val.P1 = p1;
        if ("P2" in val) val.P2 = p2;
        if ("I1" in val) val.I1 = p2;
        if ("D1" in val) val.D1 = def;
        if ("U1" in val) val.U1 = def;
        if ("R1" in val) val.R1 = rein;

        // Propagate attacks on premises / warrants first (topological order: R1 -> U1/D1 -> P2/I1 -> C)
        sc.edges.forEach((e) => {
          if (e.to !== "C" && (e.type === "rebut" || e.type === "undercut")) {
            const att = Math.min(...e.from.map((id) => val[id] ?? 0)) * (e.weight ?? 1);
            val[e.to] = clamp((val[e.to] ?? 0) * (1 - att), 0, 1);
          }
        });

        // Compute pro-support and rebuttal against C
        let proSupport = 0;
        const convParts = [];
        let linkedSupport = null;
        let rebutC = 0;

        sc.edges.forEach((e) => {
          if (e.to !== "C") return;
          const effType = P.mode === "force_linked" && e.type === "convergent" ? "linked"
            : P.mode === "force_convergent" && e.type === "linked" ? "convergent"
            : e.type;
          if (effType === "linked") {
            const s = Math.min(...e.from.map((id) => val[id] ?? 0)) * (e.weight ?? 1);
            linkedSupport = linkedSupport == null ? s : Math.min(linkedSupport, s);
          } else if (effType === "convergent") {
            e.from.forEach((id) => {
              convParts.push((val[id] ?? 0) * (e.weight ?? 1));
            });
          } else if (effType === "rebut" || effType === "undercut") {
            const a = Math.min(...e.from.map((id) => val[id] ?? 0)) * (e.weight ?? 1);
            rebutC = 1 - (1 - rebutC) * (1 - a);
          }
        });

        if (convParts.length) {
          const noisyOr = 1 - convParts.reduce((acc, s) => acc * (1 - clamp(s, 0, 1)), 1);
          proSupport = linkedSupport == null ? noisyOr : Math.max(linkedSupport, noisyOr);
        } else {
          proSupport = linkedSupport ?? 0;
        }

        val.C = clamp(proSupport * (1 - rebutC), 0, 1);
        // Dung grounded status (threshold 0.5)
        const dung = {};
        sc.nodes.forEach((nd) => { dung[nd.id] = val[nd.id] >= 0.5 ? "IN" : "OUT"; });
        return { sc, val, dung, proSupport, rebutC };
      }

      function draw() {
        const w = cv.width, h = cv.height, m = evaluate();
        clearCanvas(ctx, w, h, C);
        text(ctx, m.sc.name, 14, 20, C.text, { bold: true, size: 13 });

        // Compute pixel coords for nodes
        const pos = {};
        const boxW = Math.min(200, w * 0.27), boxH = 54;
        m.sc.nodes.forEach((nd) => {
          pos[nd.id] = { x: nd.x * (w - 40) + 20, y: nd.y * (h - 46) + 24, nd };
        });

        // Draw edges
        m.sc.edges.forEach((e) => {
          const dst = pos[e.to];
          if (!dst) return;
          const isAttack = e.type === "rebut" || e.type === "undercut";
          const col = e.type === "linked" ? C.primary : e.type === "convergent" ? C.ok : e.type === "undercut" ? C.accent : C.danger;
          if (e.type === "linked" && e.from.length > 1 && P.mode !== "force_convergent") {
            // Join bar for linked premises
            const xs = e.from.map((id) => pos[id].x), ys = e.from.map((id) => pos[id].y - boxH / 2);
            const midX = xs.reduce((a, b) => a + b, 0) / xs.length;
            const joinY = (Math.min(...ys) + dst.y + boxH / 2) / 2;
            e.from.forEach((id) => {
              polyline(ctx, [[pos[id].x, pos[id].y - boxH / 2], [pos[id].x, joinY], [midX, joinY]], col, 2);
            });
            arrow(ctx, midX, joinY, dst.x, dst.y + boxH / 2 + 2, col, 2.4);
            text(ctx, e.label, midX + 8, joinY - 6, col, { size: 10, bold: true });
          } else {
            e.from.forEach((id) => {
              const src = pos[id];
              if (!src) return;
              const x1 = src.x, y1 = src.y + (dst.y < src.y ? -boxH / 2 : boxH / 2);
              const x2 = dst.x + (src.x > dst.x ? boxW / 2 : -boxW / 2) * (Math.abs(src.y - dst.y) < 50 ? 1 : 0.35);
              const y2 = Math.abs(src.y - dst.y) < 50 ? dst.y : dst.y + (src.y > dst.y ? boxH / 2 : -boxH / 2);
              if (isAttack) {
                polyline(ctx, [[x1, y1], [x2, y2]], col, 2, [5, 4]);
                circle(ctx, x2, y2, 4.5, col);
              } else {
                arrow(ctx, x1, y1, x2, y2, col, 2.2);
              }
              text(ctx, e.label, (x1 + x2) / 2, (y1 + y2) / 2 - 6, col, { align: "center", size: 10 });
            });
          }
        });

        // Draw nodes
        m.sc.nodes.forEach((nd) => {
          const p = pos[nd.id], v = m.val[nd.id] ?? 0, isIn = m.dung[nd.id] === "IN";
          const x = p.x - boxW / 2, y = p.y - boxH / 2;
          const border = nd.id === "C" ? C.secondary : isIn ? C.ok : C.danger;
          roundRect(ctx, x, y, boxW, boxH, 8, "#181d35", border, selectedId === nd.id ? 2.6 : 1.6);
          wrapText(ctx, nd.label, x + 8, y + 16, boxW - 16, 13, C.text, { size: 10, bold: nd.id === "C" });
          // Credence bar inside card
          const barY = y + boxH - 12, barW = boxW - 68;
          ctx.fillStyle = "rgba(255,255,255,0.09)"; ctx.fillRect(x + 8, barY, barW, 6);
          ctx.fillStyle = border; ctx.fillRect(x + 8, barY, barW * clamp(v, 0, 1), 6);
          text(ctx, `${pct(v, 0)} (${m.dung[nd.id]})`, x + boxW - 6, barY + 6, border, { align: "right", size: 9, bold: true });
        });

        // Legend at bottom
        text(ctx, "Solid blue = linked support (min) · Solid green = convergent support (noisy-OR) · Dashed orange/red = undercut / rebut", 14, h - 8, C.muted, { size: 10 });
      }

      function readout() {
        const m = evaluate();
        const out = {
          "Scenario": m.sc.name,
          "Pro-support for C (before rebuttal)": pct(m.proSupport, 1),
          "Direct rebuttal against C": pct(m.rebutC, 1),
          "Final credence in Conclusion C": `${pct(m.val.C, 1)} [Dung: ${m.dung.C}]`,
        };
        m.sc.nodes.forEach((nd) => {
          if (nd.id !== "C") out[nd.id] = `${pct(m.val[nd.id], 0)} (${m.dung[nd.id]})`;
        });
        api.readout(out);

        if (P.scenario === "red_light" && num(P.wP1, 0.9) >= 0.85 && num(P.wDef, 0.8) >= 0.8 && num(P.wRein, 0.1) <= 0.15 && m.val.C < 0.25) {
          api.award("undercut_red");
        }
        if (P.scenario === "red_light" && num(P.wDef, 0.8) >= 0.8 && num(P.wRein, 0.1) >= 0.85 && m.val.C >= 0.70) {
          api.award("reinstate_red");
        }
        if (num(P.wP1, 0.9) >= 0.8 && num(P.wP2, 0.9) <= 0.15) {
          if (P.mode === "force_linked") seenModes.add("linked");
          if (P.mode === "force_convergent") seenModes.add("conv");
          if (seenModes.size >= 2) api.award("linked_vs_conv");
        }
        api.setStatus(`Conclusion "${m.sc.conclusion}" credence = ${pct(m.val.C, 1)} (${m.dung.C === "IN" ? "justified / IN" : "defeated / OUT"}). Click a node on the canvas to toggle its credence.`);
      }

      const render = () => { draw(); readout(); };
      api.pointer(cv.canvas, {
        down(pt) {
          const w = cv.width, h = cv.height, sc = ARG_SCENARIOS[P.scenario] || ARG_SCENARIOS.red_light;
          const boxW = Math.min(200, w * 0.27), boxH = 54;
          for (const nd of sc.nodes) {
            const cx = nd.x * (w - 40) + 20, cy = nd.y * (h - 46) + 24;
            if (Math.abs(pt.x - cx) <= boxW / 2 && Math.abs(pt.y - cy) <= boxH / 2) {
              selectedId = nd.id;
              const mapKey = nd.id === "P1" ? "wP1" : (nd.id === "P2" || nd.id === "I1") ? "wP2" : (nd.id === "D1" || nd.id === "U1") ? "wDef" : nd.id === "R1" ? "wRein" : null;
              if (mapKey) {
                const cur = num(P[mapKey], 0.5);
                api.setParam(mapKey, cur > 0.5 ? 0.05 : 0.95);
              } else {
                render();
              }
              break;
            }
          }
        },
      });
      api.onParam(render);
      api.onResize(draw);
      render();
      return {
        setDefeaters(defVal, reinVal) {
          api.setParam("wDef", defVal);
          api.setParam("wRein", reinVal);
        },
        destroy() {},
      };
    },
  });
})();
