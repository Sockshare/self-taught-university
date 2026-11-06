/* Self-Taught — chemistry simulation widgets (vanilla JS, canvas).
 * Registers: atom_builder, periodic_trends, reaction_kinetics, equilibrium, titration, radioactive_decay.
 * Widget API: docs/CONTRACTS.md §3 + static/sims/core.js (SelfTaughtSims.register / api object).
 *
 * File layout
 *   1. shared helpers  — formatting, plotting, colours, regression, RK4
 *   2. element data    — symbols, names, periodic-table geometry, trend properties (Z = 1…86)
 *   3. widgets         — one S.register({...}) block each, in the order listed above
 */
(function () {
  "use strict";
  const S = window.SelfTaughtSims;
  if (!S || typeof S.register !== "function") { console.error("[chemistry sims] core.js must be loaded first"); return; }

  /* ════════════════════════════ 1. shared helpers ════════════════════════════ */
  const TAU = Math.PI * 2, LN2 = Math.LN2, R_GAS = 8.314462618, KW = 1e-14;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /** Finite number or fallback; also coerces numeric strings (select / number inputs may deliver strings). */
  const num = (v, d) => { const x = typeof v === "string" ? parseFloat(v) : v; return typeof x === "number" && isFinite(x) ? x : d; };
  /** Number formatting that never prints NaN and switches to exponent notation for extreme values. */
  function fmt(v, d) {
    if (typeof v !== "number" || !isFinite(v)) return v === Infinity ? "∞" : v === -Infinity ? "−∞" : "—";
    d = d == null ? 2 : d;
    const a = Math.abs(v);
    return a !== 0 && (a >= 1e6 || a < 1e-3) ? v.toExponential(d) : v.toFixed(d);
  }
  const unit = (v, u, d) => fmt(v, d) + (u ? " " + u : "");
  const TIME_UNITS = [["fs", 1e-15], ["ps", 1e-12], ["ns", 1e-9], ["µs", 1e-6], ["ms", 1e-3], ["s", 1], ["min", 60], ["h", 3600], ["d", 86400], ["yr", 3.15576e7], ["kyr", 3.15576e10], ["Myr", 3.15576e13], ["Gyr", 3.15576e16]];
  /** Largest time unit not exceeding `s` seconds → [name, seconds]. */
  function timeUnit(s) { if (!(s > 0) || !isFinite(s)) return TIME_UNITS[5]; let u = TIME_UNITS[0]; for (const c of TIME_UNITS) if (s >= c[1] * 0.999) u = c; return u; }
  /** Human time across 30+ orders of magnitude (fs … Gyr). */
  function fmtTime(s) { if (typeof s !== "number" || !isFinite(s)) return s === Infinity ? "∞" : "—"; if (s === 0) return "0 s"; const u = timeUnit(s), v = s / u[1]; return fmt(v, v >= 100 ? 0 : 2) + " " + u[0]; }
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = (k) => String(k).split("").map((d) => (d === "-" || d === "−" ? "⁻" : d === "+" ? "⁺" : SUP[+d] || d)).join("");
  /** "Nice" tick spacing (1/2/5 × 10ⁿ) giving about `target` ticks over `span`. */
  function niceStep(span, target) {
    if (!(span > 0) || !isFinite(span)) return 1;
    const raw = span / (target || 5), mag = Math.pow(10, Math.floor(Math.log10(raw))), r = raw / mag;
    return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * mag;
  }
  function tickLabel(v, step) { if (Math.abs(v) >= 1e7) return v.toExponential(0); const d = clamp(-Math.floor(Math.log10(step)), 0, 6), s = v.toFixed(d); return /^-0\.?0*$/.test(s) ? s.slice(1) : s; }
  function clear(ctx, w, h, C) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }
  function text(ctx, s, x, y, o) {
    o = o || {};
    ctx.fillStyle = o.color || "#e8ebff";
    ctx.font = (o.bold ? "600 " : "") + (o.size || 11) + "px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic";
    ctx.fillText(String(s), x, y);
  }
  /** fn(dt) → true once every `interval` seconds (throttles DOM readouts). */
  function every(interval) { let acc = interval; return (dt) => { acc += dt; if (acc >= interval) { acc = 0; return true; } return false; }; }
  /** Classic RK4 step for s' = f(t, s) with s an array. */
  function rk4(f, s, t, h) {
    const n = s.length, k1 = f(t, s), tmp = new Array(n);
    for (let i = 0; i < n; i++) tmp[i] = s[i] + 0.5 * h * k1[i];
    const k2 = f(t + h / 2, tmp);
    for (let i = 0; i < n; i++) tmp[i] = s[i] + 0.5 * h * k2[i];
    const k3 = f(t + h / 2, tmp);
    for (let i = 0; i < n; i++) tmp[i] = s[i] + h * k3[i];
    const k4 = f(t + h, tmp), out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = s[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    return out;
  }
  /** Least-squares line y = m·x + b through pts, with R². */
  function linfit(pts) {
    const n = pts.length; if (n < 2) return { m: 0, b: n ? pts[0][1] : 0, r2: 0 };
    let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
    for (const p of pts) { sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; syy += p[1] * p[1]; }
    const d = n * sxx - sx * sx; if (!(Math.abs(d) > 1e-300)) return { m: 0, b: sy / n, r2: 0 };
    const m = (n * sxy - sx * sy) / d, b = (sy - m * sx) / n, sst = syy - (sy * sy) / n;
    let sse = 0; for (const p of pts) { const e = p[1] - (m * p[0] + b); sse += e * e; }
    return { m, b, r2: sst > 1e-300 ? clamp(1 - sse / sst, 0, 1) : 1 };
  }
  /** Plot helper (same contract as physics.js): data→pixel mapping inside `box`, frame with ticks, clipped lines, markers, legend. */
  function makePlot(ctx, C, box, range) {
    const { x, y, w, h } = box;
    let xmin = num(range.xmin, 0), xmax = num(range.xmax, 1), ymin = num(range.ymin, 0), ymax = num(range.ymax, 1);
    if (!(xmax > xmin)) xmax = xmin + 1;
    if (!(ymax > ymin)) ymax = ymin + 1;
    const X = (v) => x + ((v - xmin) / (xmax - xmin)) * w, Y = (v) => y + h - ((v - ymin) / (ymax - ymin)) * h;
    const P = {
      box, xmin, xmax, ymin, ymax, X, Y,
      frame(xl, yl, o) {
        o = o || {};
        ctx.save(); ctx.setLineDash([]);
        ctx.fillStyle = o.fill || "rgba(255,255,255,0.025)"; ctx.fillRect(x, y, w, h);
        const sx = niceStep(xmax - xmin, o.nx || Math.max(2, Math.round(w / 90))), sy = niceStep(ymax - ymin, o.ny || Math.max(2, Math.round(h / 40)));
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath();
        for (let v = Math.ceil(xmin / sx - 1e-9) * sx; v <= xmax + 1e-9; v += sx) { const px = X(v); ctx.moveTo(px, y); ctx.lineTo(px, y + h); if (!o.noXTicks) text(ctx, tickLabel(v, sx), px, y + h + 12, { color: C.muted, align: "center", size: 10 }); }
        for (let v = Math.ceil(ymin / sy - 1e-9) * sy; v <= ymax + 1e-9; v += sy) { const py = Y(v); ctx.moveTo(x, py); ctx.lineTo(x + w, py); if (!o.noYTicks) text(ctx, tickLabel(v, sy), x - 4, py + 3, { color: C.muted, align: "right", size: 10 }); }
        ctx.stroke();
        ctx.strokeStyle = C.axis; ctx.beginPath();
        if (ymin <= 0 && ymax >= 0) { ctx.moveTo(x, Y(0)); ctx.lineTo(x + w, Y(0)); }
        if (xmin <= 0 && xmax >= 0) { ctx.moveTo(X(0), y); ctx.lineTo(X(0), y + h); }
        ctx.stroke(); ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        if (xl) text(ctx, xl, x + w / 2, y + h + 25, { color: C.muted, align: "center" });
        if (yl) { ctx.translate(x - 36, y + h / 2); ctx.rotate(-Math.PI / 2); text(ctx, yl, 0, 0, { color: C.muted, align: "center" }); }
        ctx.restore();
      },
      line(pts, color, width, dash) {
        ctx.save(); ctx.beginPath(); ctx.rect(x - 1, y - 1, w + 2, h + 2); ctx.clip();
        ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.setLineDash(dash || []); ctx.lineJoin = "round";
        ctx.beginPath(); let pen = false;
        for (let i = 0; i < pts.length; i++) { const px = X(pts[i][0]), py = Y(pts[i][1]); if (!isFinite(px) || !isFinite(py)) { pen = false; continue; } if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; } }
        ctx.stroke(); ctx.restore();
      },
      curve(f, color, width, n, dash) { const pts = []; n = n || 200; for (let i = 0; i <= n; i++) { const vx = xmin + ((xmax - xmin) * i) / n; pts.push([vx, f(vx)]); } P.line(pts, color, width, dash); },
      dot(vx, vy, r, color) { const px = X(vx), py = Y(vy); if (!isFinite(px) || !isFinite(py)) return; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, r || 4, 0, TAU); ctx.fill(); },
      vline(vx, color, dash) { P.line([[vx, ymin], [vx, ymax]], color, 1, dash || [4, 4]); },
      hline(vy, color, dash) { P.line([[xmin, vy], [xmax, vy]], color, 1, dash || [4, 4]); },
      legend(items, px, py) { px = px == null ? x + 8 : px; py = py == null ? y + 14 : py; items.forEach((it, i) => { ctx.fillStyle = it[1]; ctx.fillRect(px, py + i * 14 - 5, 12, 3); text(ctx, it[0], px + 16, py + i * 14, { color: C.text, size: 10 }); }); },
    };
    return P;
  }
  /** Blue → green → amber → red colour scale for t ∈ [0, 1] (dark-theme friendly). */
  function heat(t) { t = clamp(num(t, 0), 0, 1); return "hsl(" + Math.round(232 - 222 * t) + ", 72%, " + Math.round(34 + 26 * t) + "%)"; }
  const rgba = (c) => "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + (c[3] == null ? 1 : c[3]).toFixed(2) + ")";
  const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

  /* ════════════════════════════ 2. element data ════════════════════════════ */
  const SYMBOLS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");
  const NAMES = "Hydrogen Helium Lithium Beryllium Boron Carbon Nitrogen Oxygen Fluorine Neon Sodium Magnesium Aluminium Silicon Phosphorus Sulfur Chlorine Argon Potassium Calcium Scandium Titanium Vanadium Chromium Manganese Iron Cobalt Nickel Copper Zinc Gallium Germanium Arsenic Selenium Bromine Krypton Rubidium Strontium Yttrium Zirconium Niobium Molybdenum Technetium Ruthenium Rhodium Palladium Silver Cadmium Indium Tin Antimony Tellurium Iodine Xenon Caesium Barium Lanthanum Cerium Praseodymium Neodymium Promethium Samarium Europium Gadolinium Terbium Dysprosium Holmium Erbium Thulium Ytterbium Lutetium Hafnium Tantalum Tungsten Rhenium Osmium Iridium Platinum Gold Mercury Thallium Lead Bismuth Polonium Astatine Radon Francium Radium Actinium Thorium Protactinium Uranium Neptunium Plutonium Americium Curium Berkelium Californium Einsteinium Fermium Mendelevium Nobelium Lawrencium Rutherfordium Dubnium Seaborgium Bohrium Hassium Meitnerium Darmstadtium Roentgenium Copernicium Nihonium Flerovium Moscovium Livermorium Tennessine Oganesson".split(" ");
  const NOBLE = [2, 10, 18, 36, 54, 86, 118];
  const PT_MAX = 86; // the drawn table runs H → Rn
  /** Periodic-table cell for Z ≤ 86: rows 1–6 (La stays in group 3); Ce–Lu are drawn in a detached row 8. */
  function cellPos(Z) {
    if (Z === 1) return { row: 1, col: 1 };
    if (Z === 2) return { row: 1, col: 18 };
    if (Z <= 10) return { row: 2, col: Z <= 4 ? Z - 2 : Z + 8 };
    if (Z <= 18) return { row: 3, col: Z <= 12 ? Z - 10 : Z };
    if (Z <= 36) return { row: 4, col: Z - 18 };
    if (Z <= 54) return { row: 5, col: Z - 36 };
    if (Z <= 57) return { row: 6, col: Z - 54 };
    if (Z <= 71) return { row: 8, col: Z - 55 };
    return { row: 6, col: Z - 68 };
  }
  const PERIOD_OF = (Z) => { const r = cellPos(Z).row; return r === 8 ? 6 : r; };
  /** Trend data for Z = 1…86 (index Z − 1). null = no accepted value. Rounded reference values (CRC / standard data tables). */
  const TREND = {
    radius: {
      label: "Atomic radius (calculated, Clementi)", unit: "pm", d: 0,
      why: "Across a period the effective nuclear charge rises while electrons stay in the same shell, so the cloud is pulled in (radius ↓). Down a group each step adds a shell (radius ↑). Transition metals change little: the added d electrons shield the outer s electrons.",
      data: [53, 31, 167, 112, 87, 67, 56, 48, 42, 38, 190, 145, 118, 111, 98, 88, 79, 71, 243, 194, 184, 176, 171, 166, 161, 156, 152, 149, 145, 142, 136, 125, 114, 103, 94, 88, 265, 219, 212, 206, 198, 190, 183, 178, 173, 169, 165, 161, 156, 145, 133, 123, 115, 108, 298, 253, null, null, 247, 206,
        205, 238, 231, 233, 225, 228, 226, 226, 222, 222, 217, 208, 200, 193, 188, 185, 180, 177, 174, 171, 156, 154, 143, 135, null, 120],
    },
    ie: {
      label: "First ionisation energy", unit: "kJ/mol", d: 0,
      why: "Across a period Z_eff rises and the atom shrinks, so the outer electron is held tighter (IE ↑). Down a group it sits farther out and is better shielded (IE ↓). Dips at B/Al (first p electron is higher in energy) and at O/S (first paired p electron repels its partner).",
      data: [1312, 2372, 520, 900, 801, 1087, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 762, 760, 737, 745, 906, 579, 762, 947, 941, 1140, 1351, 403, 550, 600, 640, 652, 684, 702, 710, 720, 804, 731, 868, 558, 709, 834, 869, 1008, 1170, 376, 503, 538, 534, 527, 533,
        540, 545, 547, 593, 566, 573, 581, 589, 597, 603, 524, 659, 761, 770, 760, 840, 880, 870, 890, 1007, 589, 716, 703, 812, 899, 1037],
    },
    en: {
      label: "Electronegativity (Pauling)", unit: "", d: 2,
      why: "Electronegativity tracks Z_eff and size: it rises left → right and falls down a group, peaking at F (3.98). Noble gases have no accepted Pauling value because they rarely form bonds; across the transition metals it changes only slowly.",
      data: [2.2, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.9, 2.19, 2.58, 3.16, null, 0.82, 1.0, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.9, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, 3.0, 0.82, 0.95, 1.22, 1.33, 1.6, 2.16, 1.9, 2.2, 2.28, 2.2, 1.93, 1.69, 1.78, 1.96, 2.05, 2.1, 2.66, 2.6, 0.79, 0.89, 1.1, 1.12, 1.13, 1.14,
        1.13, 1.17, 1.2, 1.2, 1.1, 1.22, 1.23, 1.24, 1.25, 1.1, 1.27, 1.3, 1.5, 2.36, 1.9, 2.2, 2.2, 2.28, 2.54, 2.0, 1.62, 2.33, 2.02, 2.0, 2.2, 2.2],
    },
    ea: {
      label: "Electron affinity (energy released on gaining an electron)", unit: "kJ/mol", d: 0,
      why: "Halogens release the most energy; Cl (349) beats F (328) because F's tiny 2p shell is crowded, so the extra electron feels strong repulsion. Noble gases, Be/Mg (full s), N (half-filled p) and Zn/Cd/Hg (full d) have no bound anion — their values are negative (theoretical) or ≈ 0.",
      data: [73, -48, 60, -48, 27, 122, -7, 141, 328, -116, 53, -40, 42, 134, 72, 200, 349, -96, 48, 2, 18, 7, 51, 65, -50, 15, 64, 112, 119, -58, 29, 119, 78, 195, 325, -96, 47, 5, 30, 42, 88, 72, 53, 101, 110, 54, 126, -68, 37, 107, 101, 190, 295, -77, 46, 14, 45, null, null, null,
        null, null, null, null, null, null, null, null, null, null, 33, 17, 31, 79, 6, 106, 151, 205, 223, -48, 36, 35, 91, 183, 233, -68],
    },
  };

  /* ════════════════════════════ 3a. atom_builder ════════════════════════════ */
  const SUBSHELLS = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p", "8s"];
  const CAP = { s: 2, p: 6, d: 10, f: 14 }, L_OF = { s: 0, p: 1, d: 2, f: 3 };
  /** Observed ground-state exceptions to the Aufbau order for neutral atoms (subshell → occupancy overrides). */
  const EXCEPTIONS = {
    24: { "3d": 5, "4s": 1 }, 29: { "3d": 10, "4s": 1 }, 41: { "4d": 4, "5s": 1 }, 42: { "4d": 5, "5s": 1 }, 44: { "4d": 7, "5s": 1 }, 45: { "4d": 8, "5s": 1 }, 46: { "4d": 10, "5s": 0 }, 47: { "4d": 10, "5s": 1 },
    57: { "4f": 0, "5d": 1 }, 58: { "4f": 1, "5d": 1 }, 64: { "4f": 7, "5d": 1 }, 78: { "5d": 9, "6s": 1 }, 79: { "5d": 10, "6s": 1 }, 89: { "5f": 0, "6d": 1 }, 90: { "5f": 0, "6d": 2 }, 91: { "5f": 2, "6d": 1 }, 92: { "5f": 3, "6d": 1 }, 93: { "5f": 4, "6d": 1 }, 96: { "5f": 7, "6d": 1 },
  };
  function aufbau(ne) { const occ = {}; let left = ne; for (const ss of SUBSHELLS) { if (left <= 0) break; const k = Math.min(CAP[ss[1]], left); occ[ss] = k; left -= k; } return occ; }
  /** Ground-state configuration of an atom or ion: Aufbau (+ exceptions for neutral atoms); cations lose their highest-n (then highest-l) electrons first. */
  function configuration(Z, ne) {
    let occ;
    if (ne >= Z) { occ = aufbau(ne); if (ne === Z && EXCEPTIONS[Z]) Object.assign(occ, EXCEPTIONS[Z]); }
    else {
      occ = aufbau(Z); if (EXCEPTIONS[Z]) Object.assign(occ, EXCEPTIONS[Z]);
      let strip = Z - ne;
      while (strip > 0) {
        let best = null;
        for (const ss in occ) if (occ[ss] > 0 && (!best || +ss[0] > +best[0] || (+ss[0] === +best[0] && L_OF[ss[1]] > L_OF[best[1]]))) best = ss;
        if (!best) break;
        const k = Math.min(occ[best], strip); occ[best] -= k; strip -= k;
      }
    }
    const list = Object.keys(occ).filter((ss) => occ[ss] > 0).sort((a, b) => (+a[0] - +b[0]) || (L_OF[a[1]] - L_OF[b[1]]));
    const shells = [0, 0, 0, 0, 0, 0, 0, 0]; list.forEach((ss) => { shells[+ss[0] - 1] += occ[ss]; });
    let core = 0; for (const g of NOBLE) if (g < ne) core = g;
    const coreOcc = core ? aufbau(core) : {}, coreOk = core > 0 && Object.keys(coreOcc).every((ss) => occ[ss] === coreOcc[ss]);
    const shown = coreOk ? list.filter((ss) => !(ss in coreOcc)) : list;
    const txt = (coreOk ? "[" + SYMBOLS[core - 1] + "] " : "") + shown.map((ss) => ss + sup(occ[ss])).join(" ");
    return { occ, list, shells, text: ne > 0 ? txt.trim() || "—" : "(no electrons)", exception: ne === Z && !!EXCEPTIONS[Z] };
  }
  /** Stability band: real stable-isotope neutron ranges for Z ≤ 20, then the semi-empirical valley Z ≈ A/(1.98 + 0.0155·A^⅔) ± (0.5 + 0.011·A). */
  const LIGHT_STABLE = { 1: [0, 1], 2: [1, 2], 3: [3, 4], 4: [5, 5], 5: [5, 6], 6: [6, 7], 7: [7, 8], 8: [8, 10], 9: [10, 10], 10: [10, 12], 11: [12, 12], 12: [12, 14], 13: [14, 14], 14: [14, 16], 15: [16, 16], 16: [16, 20], 17: [18, 20], 18: [18, 22], 19: [20, 22], 20: [20, 28] };
  const zValley = (A) => A / (1.98 + 0.0155 * Math.pow(A, 2 / 3));
  function inBand(Z, N) { if (LIGHT_STABLE[Z]) return N >= LIGHT_STABLE[Z][0] && N <= LIGHT_STABLE[Z][1]; return Math.abs(Z - zValley(Z + N)) < 0.5 + 0.011 * (Z + N); }
  const BAND = [null]; // BAND[Z] = [N_lo, N_hi] of the band
  for (let Z = 1; Z <= 118; Z++) { let lo = -1, hi = -1; for (let N = 0; N <= 200; N++) if (inBand(Z, N)) { if (lo < 0) lo = N; hi = N; } BAND.push(lo < 0 ? null : [lo, hi]); }
  function stabilityHint(Z, N) {
    const band = BAND[Z], inside = inBand(Z, N);
    if (Z > 83) return "every isotope beyond Bi (Z = 83) is radioactive (α decay dominates)" + (inside ? " — this one lies in the valley, so it may be extremely long-lived (cf. ²³²Th, ²³⁸U)" : "");
    if (Z === 43 || Z === 61) return (Z === 43 ? "technetium" : "promethium") + " has no stable isotope at all" + (inside ? " (this one is among the longest-lived)" : "");
    if (inside) return "likely stable — inside the band of stability";
    if (band && N < band[0]) return "proton-rich (too few neutrons) → β⁺ decay or electron capture" + (N < band[0] - 4 ? "; far from the band → very short-lived or unbound" : "");
    return "neutron-rich (too many neutrons) → β⁻ decay (n → p + e⁻ + ν̄)" + (band && N > band[1] + 6 ? "; far from the band → very short-lived or beyond the neutron drip line" : "");
  }
  S.register({
    id: "atom_builder", name: "Atom Builder", domains: ["chemistry", "physics"],
    description: "Assemble a nucleus and its electron cloud: protons choose the element, neutrons the isotope, electrons the charge. Bohr shells follow the Aufbau electron configuration, and a Segrè chart shows where the nucleus sits relative to the band of stability.",
    params: [
      { key: "p", label: "Protons Z", type: "range", min: 1, max: 118, step: 1, value: 6 },
      { key: "n", label: "Neutrons N", type: "range", min: 0, max: 180, step: 1, value: 6 },
      { key: "e", label: "Electrons", type: "range", min: 0, max: 120, step: 1, value: 6 },
    ],
    actions: [{ label: "Make neutral (e = Z)", fn: (h) => h.neutral() }, { label: "Most stable N", fn: (h) => h.stableN() }, { label: "Random element", fn: (h) => h.random() }],
    challenges: [
      { id: "carbon13", text: "Build a neutral, stable carbon-13 atom (Z = 6, N = 7, 6 electrons).", xp: 10 },
      { id: "sodium_ion", text: "Make the sodium cation Na⁺ — which noble gas does its configuration match?", xp: 10 },
      { id: "noble_gas", text: "Find a noble gas: a neutral atom whose outer shell is completely filled.", xp: 10 },
      { id: "heavy_valley", text: "For an element with Z ≥ 50, find a neutron number inside the band of stability. Why do heavy nuclei need N > Z?", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      function info() {
        const Z = clamp(Math.round(num(P().p, 6)), 1, 118), N = clamp(Math.round(num(P().n, 6)), 0, 200), ne = clamp(Math.round(num(P().e, 6)), 0, 120);
        return { Z, N, ne, q: Z - ne, A: Z + N, sym: SYMBOLS[Z - 1], name: NAMES[Z - 1], cfg: configuration(Z, ne), band: BAND[Z], stable: inBand(Z, N) };
      }
      const chargeText = (q) => (q === 0 ? "" : (Math.abs(q) > 1 ? String(Math.abs(q)) : "") + (q > 0 ? "+" : "−"));
      function drawAtom(a, cx, cy, R) {
        const rNuc = 6 + 3.2 * Math.cbrt(a.A), nDraw = Math.min(a.A, 160), pDraw = Math.round((a.Z / Math.max(1, a.A)) * nDraw), dotR = a.A > 60 ? 2.4 : 3.2;
        for (let i = 0; i < nDraw; i++) { // nucleons on a sunflower spiral, protons interleaved in the right proportion
          const r = (rNuc - dotR) * Math.sqrt((i + 0.5) / nDraw), th = i * 2.399963, isP = Math.floor(((i + 1) * pDraw) / nDraw) - Math.floor((i * pDraw) / nDraw) === 1;
          ctx.fillStyle = isP ? C.danger : C.muted; ctx.beginPath(); ctx.arc(cx + r * Math.cos(th), cy + r * Math.sin(th), dotR, 0, TAU); ctx.fill();
        }
        const shells = a.cfg.shells, top = shells.reduce((m, v, i) => (v > 0 ? i + 1 : m), 0), gap = clamp((R - rNuc - 10) / Math.max(1, top), 9, 30);
        for (let k = 0; k < top; k++) {
          const r = rNuc + 10 + gap * (k + 1), cnt = shells[k], er = cnt > 18 ? 2.2 : 3;
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.setLineDash([]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
          for (let i = 0; i < cnt; i++) { const th = (TAU * i) / cnt - Math.PI / 2; ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(cx + r * Math.cos(th), cy + r * Math.sin(th), er, 0, TAU); ctx.fill(); }
          text(ctx, "n=" + (k + 1) + " (" + cnt + ")", cx + r * 0.7071 + 6, cy - r * 0.7071 - 6, { color: C.muted, size: 9 });
        }
        if (a.ne === 0) text(ctx, "bare nucleus — no electrons", cx, cy + rNuc + 18, { color: C.muted, align: "center", size: 10 });
      }
      function drawNotation(a, cx, cy) { // ᴬ₂Sym^charge with measured text widths
        ctx.font = "700 44px system-ui, -apple-system, Segoe UI, sans-serif"; const sw = ctx.measureText(a.sym).width;
        ctx.font = "600 15px system-ui, -apple-system, Segoe UI, sans-serif"; const pw = Math.max(ctx.measureText(String(a.A)).width, ctx.measureText(String(a.Z)).width);
        const x0 = cx - (pw + sw + 22) / 2;
        text(ctx, a.A, x0 + pw, cy - 16, { color: C.accent, size: 15, bold: true, align: "right" });
        text(ctx, a.Z, x0 + pw, cy + 16, { color: C.muted, size: 15, bold: true, align: "right" });
        text(ctx, a.sym, x0 + pw + 4, cy + 15, { color: C.text, size: 44, bold: true });
        if (a.q) text(ctx, chargeText(a.q), x0 + pw + 8 + sw, cy - 16, { color: a.q > 0 ? C.danger : C.primary, size: 15, bold: true });
      }
      function drawSegre(a, box) {
        const pl = makePlot(ctx, C, box, { xmin: 0, xmax: 120, ymin: 0, ymax: 185 });
        pl.frame("protons Z", "neutrons N", { nx: 4, ny: 4 });
        ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
        ctx.fillStyle = "rgba(110,231,183,0.22)"; ctx.beginPath(); let started = false;
        for (let Z = 1; Z <= 118; Z++) { const b = BAND[Z]; if (!b) continue; const px = pl.X(Z), py = pl.Y(b[1] + 0.5); if (started) ctx.lineTo(px, py); else { ctx.moveTo(px, py); started = true; } }
        for (let Z = 118; Z >= 1; Z--) { const b = BAND[Z]; if (b) ctx.lineTo(pl.X(Z), pl.Y(b[0] - 0.5)); }
        ctx.closePath(); ctx.fill(); ctx.restore();
        pl.line([[0, 0], [120, 120]], C.muted, 1, [4, 4]); text(ctx, "N = Z", pl.X(100) + 4, pl.Y(100) + 12, { color: C.muted, size: 9 });
        text(ctx, "band of stability", pl.X(52), pl.Y(150), { color: C.ok, size: 9 });
        pl.dot(a.Z, a.N, 5, a.stable ? C.ok : C.danger); ctx.strokeStyle = C.text; ctx.lineWidth = 1; ctx.setLineDash([]); ctx.beginPath(); ctx.arc(pl.X(a.Z), pl.Y(a.N), 7.5, 0, TAU); ctx.stroke();
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const a = info();
        drawAtom(a, W * 0.3, H * 0.5, Math.min(W * 0.29, H * 0.46));
        text(ctx, "red = protons · grey = neutrons · blue = electrons per shell n", 10, H - 8, { color: C.muted, size: 10 });
        drawNotation(a, W * 0.8, H * 0.16);
        text(ctx, a.name + " · " + (a.q === 0 ? "neutral atom" : a.q > 0 ? "cation" : "anion") + " · A = " + a.A, W * 0.8, H * 0.16 + 40, { color: C.text, align: "center" });
        text(ctx, a.cfg.text, W * 0.8, H * 0.16 + 56, { color: C.accent, align: "center", size: 10 });
        drawSegre(a, { x: W * 0.67, y: H * 0.4, w: W * 0.29, h: H * 0.5 });
      }
      function readouts() {
        const a = info(), b = a.band, top = a.cfg.shells.reduce((m, v, i) => (v > 0 ? i + 1 : m), 0);
        api.readout({
          "Element": a.name + " (" + a.sym + "), Z = " + a.Z,
          "Isotope": sup(a.A) + a.sym + (a.q ? sup(chargeText(a.q)) : "") + " — A = " + a.A + " (" + a.Z + " p + " + a.N + " n)",
          "Charge": (a.q > 0 ? "+" : "") + a.q + (a.q === 0 ? " (neutral)" : a.q > 0 ? " (cation: fewer e⁻ than p)" : " (anion: more e⁻ than p)"),
          "Electron configuration": a.cfg.text + (a.cfg.exception ? " (observed exception)" : ""),
          "Electrons per shell": top ? a.cfg.shells.slice(0, top).join(", ") : "—",
          "Outer shell": top ? "n = " + top + " with " + a.cfg.shells[top - 1] + " e⁻" + (NOBLE.indexOf(a.ne) >= 0 ? " — closed shell (noble-gas configuration)" : "") : "—",
          "N/Z ratio": fmt(a.N / a.Z, 2) + (b ? " · band for Z = " + a.Z + ": N = " + b[0] + "–" + b[1] + " (N/Z " + fmt(b[0] / a.Z, 2) + "–" + fmt(b[1] / a.Z, 2) + ")" : ""),
          "Stability hint": stabilityHint(a.Z, a.N),
          "Nuclear radius ≈ 1.2·A^⅓": unit(1.2 * Math.cbrt(a.A), "fm", 2),
        });
        if (a.Z === 6 && a.N === 7 && a.ne === 6) api.award("carbon13");
        if (a.Z === 11 && a.ne === 10) api.award("sodium_ion");
        if (a.q === 0 && NOBLE.indexOf(a.Z) >= 0) api.award("noble_gas");
        if (a.Z >= 50 && a.stable) api.award("heavy_valley");
      }
      api.onParam(() => { draw(); readouts(); }); api.onResize(draw);
      api.setStatus("Z picks the element, N − Z decides stability, Z − e⁻ is the charge. Try Z = 6, N = 7 first.");
      api.html("<small><b>Conventions.</b> Shell counts come from the ground-state configuration (Aufbau order 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p, with observed neutral-atom exceptions such as Cr, Cu, Ag, Au; cations lose their highest-n electrons first, so Fe³⁺ is [Ar] 3d⁵). The band of stability uses the real stable isotopes for Z ≤ 20 and the semi-empirical valley Z ≈ A/(1.98 + 0.0155·A^⅔) ± (0.5 + 0.011·A) beyond — real nuclei also care about pairing and magic numbers.</small>");
      draw(); readouts();
      return {
        neutral() { api.setParam("e", info().Z); },
        stableN() { const b = info().band; if (b) api.setParam("n", clamp(Math.round((b[0] + b[1]) / 2), 0, 180)); },
        random() { const Z = 1 + Math.floor(api.random() * PT_MAX), b = BAND[Z]; api.setParam("p", Z); api.setParam("e", Z); if (b) api.setParam("n", clamp(Math.round((b[0] + b[1]) / 2), 0, 180)); },
        destroy() {},
      };
    },
  });

  /* ════════════════════════════ 3b. periodic_trends ════════════════════════════ */
  S.register({
    id: "periodic_trends", name: "Periodic Trends Explorer", domains: ["chemistry", "physics"],
    description: "A periodic table (H → Rn) colour-coded by atomic radius, first ionisation energy, electronegativity or electron affinity. Hover for values, click to select an element and read how the property changes across its period and down its group.",
    params: [
      { key: "prop", label: "Property", type: "select", value: "radius", options: [{ value: "radius", label: "Atomic radius (pm)" }, { value: "ie", label: "First ionisation energy (kJ/mol)" }, { value: "en", label: "Electronegativity (Pauling)" }, { value: "ea", label: "Electron affinity (kJ/mol)" }] },
      { key: "guides", label: "Tint the selected period and group", type: "toggle", value: true },
      { key: "values", label: "Print values in the cells", type: "toggle", value: true },
    ],
    challenges: [
      { id: "most_electronegative", text: "Show electronegativity and click the most electronegative element.", xp: 10 },
      { id: "largest_period3", text: "Show atomic radius and click the largest atom of period 3.", xp: 15 },
      { id: "ie_dip", text: "Show ionisation energy and click N, then O: why does IE drop even though Z increases?", xp: 20 },
      { id: "ea_chlorine", text: "Show electron affinity and click the element that releases the most energy when it gains an electron (it is not fluorine!).", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 10, maxHeight: 560 }), ctx = cv.ctx, P = () => api.params;
      let hover = 0, sel = 9, ieSeen = new Set();
      const prop = () => TREND[P().prop] || TREND.radius, val = (Z) => { const v = prop().data[Z - 1]; return v == null ? null : v; };
      function stats() { let lo = Infinity, hi = -Infinity, zlo = 1, zhi = 1; prop().data.forEach((v, i) => { if (v == null) return; if (v < lo) { lo = v; zlo = i + 1; } if (v > hi) { hi = v; zhi = i + 1; } }); return { lo, hi, zlo, zhi }; }
      function geom() { const W = cv.width, H = cv.height, cell = Math.min((W - 12) / 18, (H - 64) / 8.8); return { W, H, cell, x0: (W - 18 * cell) / 2, y0: 22 }; }
      function rect(Z, g) { const p = cellPos(Z), ry = p.row === 8 ? 6.6 : p.row - 1; return { x: g.x0 + (p.col - 1) * g.cell, y: g.y0 + ry * g.cell, w: g.cell, h: g.cell }; }
      function hit(x, y) { const g = geom(); for (let Z = 1; Z <= PT_MAX; Z++) { const r = rect(Z, g); if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return Z; } return 0; }
      const periodMembers = (Z) => { const row = cellPos(Z).row, out = []; for (let z = 1; z <= PT_MAX; z++) if (cellPos(z).row === row) out.push(z); return out; };
      const groupMembers = (Z) => { const p = cellPos(Z), out = []; if (p.row === 8) return out; for (let z = 1; z <= PT_MAX; z++) { const q = cellPos(z); if (q.row !== 8 && q.col === p.col) out.push(z); } return out; };
      function seriesInfo(list) { let first = null, last = null, max = null, min = null; list.forEach((Z) => { const v = val(Z); if (v == null) return; if (first == null) first = Z; last = Z; if (max == null || v > val(max)) max = Z; if (min == null || v < val(min)) min = Z; }); return { first, last, max, min }; }
      function describe(list, arrow) {
        const s = seriesInfo(list), pr = prop(); if (s.first == null || s.first === s.last) return "— (not enough data)";
        const a = val(s.first), b = val(s.last);
        return fmt(a, pr.d) + " (" + SYMBOLS[s.first - 1] + ") " + arrow + " " + fmt(b, pr.d) + " (" + SYMBOLS[s.last - 1] + "): " + (b > a ? "rises" : b < a ? "falls" : "flat") + " · max " + SYMBOLS[s.max - 1] + ", min " + SYMBOLS[s.min - 1];
      }
      function draw() {
        const g = geom(), { W, H, cell } = g, st = stats(), pr = prop(), span = Math.max(1e-9, st.hi - st.lo); clear(ctx, W, H, C);
        text(ctx, pr.label + (pr.unit ? " (" + pr.unit + ")" : ""), g.x0, 14, { color: C.text, bold: true });
        if (P().guides && sel) { const rs = rect(sel, g); ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(g.x0, rs.y, 18 * cell, cell); if (cellPos(sel).row !== 8) ctx.fillRect(rs.x, g.y0, cell, 6 * cell); }
        for (let Z = 1; Z <= PT_MAX; Z++) {
          const r = rect(Z, g), v = val(Z), tnorm = v == null ? null : (v - st.lo) / span, col = tnorm == null ? null : heat(tnorm), tc = col ? (tnorm > 0.55 ? "#0f1222" : "#ffffff") : C.muted;
          ctx.fillStyle = col || "rgba(255,255,255,0.04)"; ctx.fillRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
          text(ctx, SYMBOLS[Z - 1], r.x + r.w / 2, r.y + r.h * (cell > 34 ? 0.5 : 0.64), { color: tc, size: clamp(cell * 0.36, 9, 15), bold: true, align: "center" });
          if (cell > 30) text(ctx, Z, r.x + 3, r.y + 9, { color: tc, size: 8 });
          if (P().values && cell > 34) text(ctx, v == null ? "n/a" : fmt(v, pr.d), r.x + r.w / 2, r.y + r.h - 4, { color: tc, size: clamp(cell * 0.2, 7, 10), align: "center" });
          if (Z === sel || Z === hover) { ctx.strokeStyle = Z === sel ? C.accent : "#ffffff"; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2); }
        }
        text(ctx, "lanthanides 58–71 ↓", g.x0 + 2 * cell, g.y0 + 6.6 * cell - 4, { color: C.muted, size: 9 });
        const lx = g.x0 + 4 * cell, ly = g.y0 + 7.8 * cell, lw = 10 * cell, lh = Math.max(8, cell * 0.28), grad = ctx.createLinearGradient(lx, 0, lx + lw, 0);
        for (let i = 0; i <= 10; i++) grad.addColorStop(i / 10, heat(i / 10));
        ctx.fillStyle = grad; ctx.fillRect(lx, ly, lw, lh);
        text(ctx, fmt(st.lo, pr.d) + " (" + SYMBOLS[st.zlo - 1] + ")", lx - 6, ly + lh - 1, { color: C.muted, size: 10, align: "right" });
        text(ctx, fmt(st.hi, pr.d) + " (" + SYMBOLS[st.zhi - 1] + ")", lx + lw + 6, ly + lh - 1, { color: C.muted, size: 10 });
        text(ctx, "grey = no accepted value · hover for values, click to select", lx + lw / 2, ly + lh + 12, { color: C.muted, size: 9, align: "center" });
        if (hover) { // tooltip
          const r = rect(hover, g), v = val(hover), s = NAMES[hover - 1] + " (" + hover + "): " + (v == null ? "no value" : fmt(v, pr.d) + (pr.unit ? " " + pr.unit : ""));
          ctx.font = "600 11px system-ui, -apple-system, Segoe UI, sans-serif"; const tw = ctx.measureText(s).width + 12;
          let tx = r.x + r.w + 6, ty = r.y - 2; if (tx + tw > W - 4) tx = r.x - tw - 6; ty = clamp(ty, 0, H - 22);
          ctx.fillStyle = "rgba(15,18,34,0.95)"; ctx.fillRect(tx, ty, tw, 20); ctx.strokeStyle = C.axis; ctx.lineWidth = 1; ctx.setLineDash([]); ctx.strokeRect(tx + 0.5, ty + 0.5, tw - 1, 19);
          text(ctx, s, tx + 6, ty + 14, { color: C.text, size: 11, bold: true });
        }
      }
      function readouts() {
        const pr = prop(), Z = sel, p = cellPos(Z), v = val(Z), per = periodMembers(Z), grp = groupMembers(Z), st = stats(), r = {};
        r["Property"] = pr.label + (pr.unit ? " (" + pr.unit + ")" : "");
        r["Selected"] = NAMES[Z - 1] + " (" + SYMBOLS[Z - 1] + "), Z = " + Z + ", period " + PERIOD_OF(Z) + (p.row === 8 ? ", f-block" : ", group " + p.col);
        r["Value"] = v == null ? "no accepted value" : fmt(v, pr.d) + (pr.unit ? " " + pr.unit : "") + (v === st.hi ? " — overall maximum" : v === st.lo ? " — overall minimum" : "");
        if (v != null) { const s = seriesInfo(per), withData = per.filter((z) => val(z) != null); r["Rank in period " + PERIOD_OF(Z)] = (Z === s.max ? "largest" : Z === s.min ? "smallest" : "#" + (withData.filter((z) => val(z) > v).length + 1)) + " of " + withData.length + " with data"; }
        r["Across period " + PERIOD_OF(Z) + " (→)"] = describe(per, "→");
        if (grp.length > 1) r["Down group " + p.col + " (↓)"] = describe(grp, "↓");
        r["Why"] = pr.why;
        api.readout(r);
        let h = "<table><tr><th>Z</th><th>Element</th><th>radius (pm)</th><th>IE₁ (kJ/mol)</th><th>χ (Pauling)</th><th>EA (kJ/mol)</th></tr>";
        per.forEach((z) => { const cell = (k) => { const x = TREND[k].data[z - 1]; return "<td>" + (x == null ? "<span style=\"color:#9aa3c7\">n/a</span>" : fmt(x, TREND[k].d)) + "</td>"; }; h += "<tr" + (z === Z ? " style=\"color:#ffd166\"" : "") + "><td>" + z + "</td><td><b>" + SYMBOLS[z - 1] + "</b> " + NAMES[z - 1] + "</td>" + cell("radius") + cell("ie") + cell("en") + cell("ea") + "</tr>"; });
        api.html("<small>Data table for period " + PERIOD_OF(Z) + (p.row === 8 ? " (lanthanides)" : "") + " — approximate reference values. Calculated radii after Clementi et al.; negative electron affinities are theoretical (no bound anion).</small>" + h + "</table>");
      }
      function select(z) {
        sel = z; draw(); readouts();
        const k = P().prop, pr = prop();
        if (k === "en" && z === 9) api.award("most_electronegative");
        if (k === "radius" && z === 11) api.award("largest_period3");
        if (k === "ea" && z === 17) api.award("ea_chlorine");
        if (k === "ie") { if (z === 7 || z === 8) ieSeen.add(z); else ieSeen.clear(); if (ieSeen.has(7) && ieSeen.has(8)) api.award("ie_dip"); }
        api.setStatus(NAMES[z - 1] + " selected — " + (val(z) == null ? "no accepted value for this property." : pr.label + " = " + fmt(val(z), pr.d) + (pr.unit ? " " + pr.unit : "")));
      }
      api.pointer(cv.canvas, { move(p) { const z = hit(p.x, p.y); if (z !== hover) { hover = z; draw(); } }, down(p) { const z = hit(p.x, p.y); if (z) select(z); } });
      const leave = () => { if (hover) { hover = 0; draw(); } }; cv.canvas.addEventListener("mouseleave", leave);
      api.onParam((k) => { if (k === "prop") ieSeen.clear(); draw(); readouts(); }); api.onResize(draw);
      api.setStatus("Hover over cells for values; click an element to select it. The challenges check the selected element.");
      draw(); readouts();
      return { destroy() { cv.canvas.removeEventListener("mouseleave", leave); } };
    },
  });

  /* ════════════════════════════ 3c. reaction_kinetics ════════════════════════════ */
  S.register({
    id: "reaction_kinetics", name: "Reaction Kinetics Lab", domains: ["chemistry"],
    description: "A → P with rate = k[A]ⁿ (n = 0, 1, 2) and k = A·e^(−Ea/RT). Watch [A](t) with the three linearised plots and the half-life, probe the Arrhenius temperature dependence, and identify the order of a hidden 'mystery sample'.",
    params: [
      { key: "order", label: "Reaction order n", type: "select", value: 1, options: [{ value: 0, label: "0 — rate = k" }, { value: 1, label: "1 — rate = k[A]" }, { value: 2, label: "2 — rate = k[A]²" }] },
      { key: "A0", label: "Initial concentration [A]₀ (mol/L)", type: "range", min: 0.05, max: 2, step: 0.05, value: 1 },
      { key: "Ea", label: "Activation energy Ea (kJ/mol)", type: "range", min: 5, max: 200, step: 1, value: 50 },
      { key: "logA", label: "log₁₀ of the pre-exponential factor A", type: "range", min: 0, max: 16, step: 0.1, value: 8.5 },
      { key: "T", label: "Temperature T (K)", type: "range", min: 200, max: 800, step: 1, value: 300 },
    ],
    actions: [
      { label: "Replay", fn: (h) => h.replay() }, { label: "Pause / resume", fn: (h) => h.toggle() }, { label: "Set reference here", fn: (h) => h.setRef() },
      { label: "Mystery sample", fn: (h) => h.mystery() }, { label: "Check order", fn: (h) => h.check() },
    ],
    challenges: [
      { id: "double_rate", text: "Changing only T, find the temperature that doubles k relative to the reference (k/k_ref = 2). Is it 10 K hotter?", xp: 15 },
      { id: "identify_order", text: "Press 'Mystery sample', pick the order whose linearised plot is straight (R² → 1), then 'Check order'.", xp: 20 },
      { id: "half_life_rule", text: "In second order, double [A]₀ and watch the half-life halve (in first order it would not change).", xp: 10 },
      { id: "catalyst", text: "At the reference temperature, lower Ea by ≥ 20 kJ/mol (a catalyst). Compare the speed-up with e^(ΔEa/RT).", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      let frac = 0, running = true, mystery = null, ref = null, a0Seen = [];
      const order = () => clamp(Math.round(num(P().order, 1)), 0, 2), A0 = () => clamp(num(P().A0, 1), 0.01, 10);
      const kAt = (T, Ea, logA) => Math.pow(10, num(logA == null ? P().logA : logA, 8)) * Math.exp((-num(Ea == null ? P().Ea : Ea, 50) * 1e3) / (R_GAS * Math.max(1, num(T == null ? P().T : T, 300))));
      const concOf = (o, a0, k, t) => (o === 0 ? Math.max(0, a0 - k * t) : o === 1 ? a0 * Math.exp(-k * t) : a0 / (1 + a0 * k * t)); // integrated rate laws
      const halfLifeOf = (o, a0, k) => (o === 0 ? a0 / (2 * k) : o === 1 ? LN2 / k : 1 / (k * a0));
      const spanOf = (o, a0, k) => halfLifeOf(o, a0, k) * (o === 0 ? 2 : o === 1 ? 5 : 8);
      const K_UNITS = ["mol L⁻¹ s⁻¹", "s⁻¹", "L mol⁻¹ s⁻¹"];
      const TRANS = [{ lab: "[A]", f: (c) => c }, { lab: "ln [A]", f: (c) => (c > 0 ? Math.log(c) : NaN) }, { lab: "1/[A]", f: (c) => (c > 0 ? 1 / c : NaN) }];
      function model() { const o = order(), k = kAt(), a0 = A0(); return { o, k, a0, hl: halfLifeOf(o, a0, k), te: mystery ? mystery.te : spanOf(o, a0, k) }; }
      function makeMystery() {
        const o = Math.floor(api.random() * 3), a0 = A0(), te = spanOf(order(), a0, kAt()), k = o === 0 ? (0.75 * a0) / te : o === 1 ? Math.log(4) / te : 3 / (a0 * te), pts = [];
        for (let i = 0; i <= 12; i++) { const t = (te * i) / 12, noise = 1 + 0.03 * (api.random() + api.random() + api.random() - 1.5); pts.push([t, Math.max(1e-6, concOf(o, a0, k, t) * noise)]); }
        mystery = { o, k, a0, te, pts };
        api.setStatus("Mystery sample loaded (dots). Which transformation puts the dots on a straight line? Choose that order and press 'Check order'.");
      }
      function fitFor(o) { // regression of the mystery data under transformation o → implied k, [A]₀ and R²
        const pts = mystery.pts.map((p) => [p[0], TRANS[o].f(p[1])]).filter((p) => isFinite(p[1])), f = linfit(pts);
        return { k: o === 2 ? f.m : -f.m, a0: o === 0 ? f.b : o === 1 ? Math.exp(f.b) : 1 / f.b, r2: f.r2, m: f.m, b: f.b };
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const m = model(), u = timeUnit(m.te), ts = 1 / u[1], te = m.te * ts, tc = frac * m.te, cNow = concOf(m.o, m.a0, m.k, tc);
        const main = makePlot(ctx, C, { x: 50, y: 28, w: W * 0.58 - 50, h: H * 0.5 }, { xmin: 0, xmax: te, ymin: 0, ymax: m.a0 * 1.08 });
        main.frame("time (" + u[0] + ")", "concentration (mol/L)");
        main.curve((x) => concOf(m.o, m.a0, m.k, x / ts), C.primary, 2, 300); main.curve((x) => m.a0 - concOf(m.o, m.a0, m.k, x / ts), C.secondary, 2, 300);
        if (m.hl * ts <= te) { main.vline(m.hl * ts, C.muted, [2, 4]); main.hline(m.a0 / 2, C.muted, [2, 4]); text(ctx, "t½", main.X(m.hl * ts) + 3, main.box.y + 12, { color: C.muted, size: 10 }); }
        if (mystery) { const fit = fitFor(m.o); mystery.pts.forEach((p) => main.dot(p[0] * ts, p[1], 3.5, C.accent)); if (fit.k > 0 && fit.a0 > 0 && isFinite(fit.a0)) main.curve((x) => concOf(m.o, fit.a0, fit.k, x / ts), C.accent, 1.5, 200, [5, 4]); }
        main.vline(tc * ts, C.ok, [3, 3]); main.dot(tc * ts, cNow, 4, C.primary); main.dot(tc * ts, m.a0 - cNow, 4, C.secondary);
        main.legend(mystery ? [["[A] model", C.primary], ["[P] = [A]₀ − [A]", C.secondary], ["mystery data + fit for order " + m.o, C.accent]] : [["[A]", C.primary], ["[P] = [A]₀ − [A]", C.secondary]], main.box.x + main.box.w - 170);
        const dots = 50, sx = (main.box.w - 10) / dots; // molecule strip
        for (let i = 0; i < dots; i++) { ctx.fillStyle = i < Math.round(clamp(cNow / m.a0, 0, 1) * dots) ? C.primary : C.secondary; ctx.beginPath(); ctx.arc(main.box.x + 5 + i * sx + sx / 2, 14, 3.5, 0, TAU); ctx.fill(); }
        text(ctx, "A → P", 8, 18, { color: C.text, size: 10, bold: true });
        const ap = makePlot(ctx, C, { x: 50, y: H * 0.67, w: W * 0.58 - 50, h: H * 0.25 }, { xmin: 1000 / 800, xmax: 1000 / 200, ymin: Math.log(kAt(200)) - 1, ymax: Math.log(kAt(800)) + 1 });
        ap.frame("1000/T (K⁻¹)", "ln k", { ny: 3 }); ap.curve((x) => Math.log(kAt(1000 / x)), C.accent, 2, 60);
        if (ref) { ap.dot(1000 / ref.T, Math.log(ref.k), 4, C.muted); text(ctx, "ref", ap.X(1000 / ref.T) + 6, ap.Y(Math.log(ref.k)) - 6, { color: C.muted, size: 9 }); }
        ap.dot(1000 / num(P().T, 300), Math.log(m.k), 5, C.danger);
        text(ctx, "Arrhenius: ln k = ln A − Ea/(RT) → slope −Ea/R = " + fmt((-num(P().Ea, 50) * 1e3) / R_GAS / 1000, 2) + " ×10³ K", ap.box.x, ap.box.y - 6, { color: C.text, size: 10, bold: true });
        const px = W * 0.66, pw = W * 0.31, ph = (H - 70) / 3; // three linearised panels
        TRANS.forEach((tr, j) => {
          const by = 24 + j * (ph + 14), straight = j === m.o, pts = mystery ? mystery.pts.map((p) => [p[0] * ts, tr.f(p[1])]).filter((p) => isFinite(p[1])) : [];
          const sample = []; for (let i = 0; i <= 60; i++) { const t = (m.te * i) / 60; sample.push([t * ts, tr.f(concOf(m.o, m.a0, m.k, t))]); }
          const ys = (mystery ? pts : sample).map((p) => p[1]).filter((v) => isFinite(v)); let lo = ys.length ? Math.min.apply(null, ys) : 0, hi = ys.length ? Math.max.apply(null, ys) : 1; if (!(hi - lo > 1e-9)) hi = lo + 1; const pad = (hi - lo) * 0.08;
          const pl = makePlot(ctx, C, { x: px, y: by, w: pw, h: ph - 22 }, { xmin: 0, xmax: te, ymin: lo - pad, ymax: hi + pad });
          pl.frame(j === 2 ? "time (" + u[0] + ")" : "", "", { nx: 3, ny: 2, noXTicks: j !== 2 });
          if (mystery) { const f = linfit(pts); pl.line([[0, f.b], [te, f.m * te + f.b]], C.muted, 1, [4, 3]); pts.forEach((p) => pl.dot(p[0], p[1], 3, C.accent)); text(ctx, "R² = " + fmt(f.r2, 4), px + pw - 4, by + 12, { color: f.r2 > 0.998 ? C.ok : C.muted, size: 10, align: "right" }); }
          else { pl.line(sample, straight ? C.ok : C.primary, 2); pl.line([sample[0], sample[sample.length - 1]], C.muted, 1, [4, 3]); }
          text(ctx, tr.lab + " vs t" + (straight && !mystery ? "  ← straight for order " + m.o : ""), px, by - 5, { color: straight && !mystery ? C.ok : C.text, size: 10, bold: true });
        });
        if (!running) text(ctx, "⏸ paused", W - 8, H - 8, { color: C.muted, size: 10, align: "right" });
      }
      function readouts() {
        const m = model(), T = num(P().T, 300), Ea = num(P().Ea, 50), tc = frac * m.te, cA = concOf(m.o, m.a0, m.k, tc), r = {
          "Rate constant k": fmt(m.k, 3) + " " + K_UNITS[m.o],
          "Half-life t½": fmtTime(m.hl) + ["  = [A]₀/2k", "  = ln 2/k (independent of [A]₀)", "  = 1/(k[A]₀)"][m.o],
          "Initial rate k[A]₀ⁿ": unit(m.k * Math.pow(m.a0, m.o), "mol L⁻¹ s⁻¹", 3),
          "Cursor": fmtTime(tc) + " · [A] = " + fmt(cA, 3) + ", [P] = " + fmt(m.a0 - cA, 3) + " mol/L",
          "Boltzmann factor e^(−Ea/RT)": fmt(Math.exp((-Ea * 1e3) / (R_GAS * T)), 3),
          "k(T + 10 K) / k(T)": fmt(kAt(T + 10) / m.k, 2),
          "ΔT that doubles k ≈ RT²·ln 2/Ea": unit((R_GAS * T * T * LN2) / (Ea * 1e3), "K", 1),
        };
        if (ref) r["k / k_ref (ref " + ref.T + " K, Ea " + ref.Ea + " kJ/mol)"] = fmt(m.k / ref.k, 3);
        if (mystery) r["Mystery sample R² (order 0 / 1 / 2)"] = [0, 1, 2].map((o) => fmt(fitFor(o).r2, 3)).join(" / ");
        api.readout(r);
      }
      function checkAwards() {
        const m = model(), T = num(P().T, 300), Ea = num(P().Ea, 50), lA = num(P().logA, 8);
        if (ref) {
          const ratio = m.k / ref.k;
          if (Ea === ref.Ea && lA === ref.logA && T !== ref.T && ratio > 1.94 && ratio < 2.06) { api.award("double_rate"); api.setStatus("k doubled at T = " + T + " K (ΔT = " + (T - ref.T) + " K). The '10 K doubles the rate' rule only holds for Ea ≈ 50 kJ/mol near room temperature."); }
          if (T === ref.T && lA === ref.logA && ref.Ea - Ea >= 20) { api.award("catalyst"); api.setStatus("Lowering Ea by " + (ref.Ea - Ea) + " kJ/mol sped the reaction up " + fmt(ratio, 1) + "× = e^(ΔEa/RT)."); }
        }
        if (m.o === 2) { if (a0Seen.indexOf(m.a0) < 0) a0Seen.push(m.a0); if (a0Seen.some((a) => a0Seen.some((b) => Math.abs(b / a - 2) < 0.02))) api.award("half_life_rule"); }
      }
      const captureRef = () => { ref = { T: num(P().T, 300), Ea: num(P().Ea, 50), logA: num(P().logA, 8), k: kAt() }; };
      api.loop((dt) => { if (running) { frac += dt / 8; if (frac > 1.03) frac = 0; draw(); } return true; });
      api.onParam(() => { checkAwards(); draw(); readouts(); }); api.onResize(draw);
      captureRef();
      api.setStatus("Integrated laws: [A] = [A]₀ − kt · [A] = [A]₀e^(−kt) · 1/[A] = 1/[A]₀ + kt. The cursor replays the reaction in 8 s.");
      api.html("<small>k = A·exp(−Ea/RT), R = 8.314 J mol⁻¹ K⁻¹. Half-lives: order 0 → [A]₀/2k, order 1 → ln 2/k, order 2 → 1/(k[A]₀). The reference point (grey dot on the Arrhenius plot) is captured at start or with 'Set reference here'; the challenges compare against it.</small>");
      checkAwards(); draw(); readouts();
      return {
        replay() { frac = 0; running = true; }, toggle() { running = !running; draw(); },
        setRef() { captureRef(); api.setStatus("Reference captured at T = " + ref.T + " K, Ea = " + ref.Ea + " kJ/mol, k = " + fmt(ref.k, 3) + "."); draw(); readouts(); },
        mystery() { makeMystery(); draw(); readouts(); },
        check() {
          if (!mystery) { api.setStatus("Load a 'Mystery sample' first."); return; }
          if (order() === mystery.o) { api.award("identify_order"); api.setStatus("✓ Correct — the data were order " + mystery.o + " with k ≈ " + fmt(mystery.k, 3) + " " + K_UNITS[mystery.o] + ". Mystery cleared."); mystery = null; }
          else api.setStatus("Not quite: for order " + order() + " the " + TRANS[order()].lab + " plot is not straight (R² = " + fmt(fitFor(order()).r2, 3) + "). Try another order.");
          draw(); readouts();
        },
        destroy() { running = false; },
      };
    },
  });

  /* ════════════════════════════ 3d. equilibrium ════════════════════════════ */
  const EQ_PRESETS = {
    generic: { title: "A + B ⇌ C", names: ["A", "B", "C"], nu: [-1, -1, 1], dH: -40 },
    haber: { title: "N₂ + 3 H₂ ⇌ 2 NH₃", names: ["N₂", "H₂", "NH₃"], nu: [-1, -3, 2], dH: -92 },
  };
  S.register({
    id: "equilibrium", name: "Chemical Equilibrium & Le Chatelier", domains: ["chemistry"],
    description: "A reversible reaction integrated from mass-action kinetics: concentrations relax until Q = K = kf/kr. Perturb the equilibrium — remove product, add reactant, compress, heat — and watch it shift the way Le Chatelier predicts.",
    params: [
      { key: "preset", label: "Reaction", type: "select", value: "generic", options: [{ value: "generic", label: "A + B ⇌ C" }, { value: "haber", label: "N₂ + 3 H₂ ⇌ 2 NH₃ (Haber)" }] },
      { key: "kf", label: "Forward rate constant kf (at 298 K)", type: "range", min: 0.01, max: 5, step: 0.01, value: 1 },
      { key: "kr", label: "Reverse rate constant kr (at 298 K)", type: "range", min: 0.01, max: 5, step: 0.01, value: 0.5 },
      { key: "A0", label: "Initial [A] / [N₂] (mol/L)", type: "range", min: 0, max: 2, step: 0.05, value: 1 },
      { key: "B0", label: "Initial [B] / [H₂] (mol/L)", type: "range", min: 0, max: 2, step: 0.05, value: 1 },
      { key: "C0", label: "Initial [C] / [NH₃] (mol/L)", type: "range", min: 0, max: 2, step: 0.05, value: 0 },
      { key: "dH", label: "Reaction enthalpy ΔH (kJ/mol)", type: "range", min: -100, max: 100, step: 1, value: -40 },
      { key: "T", label: "Temperature T (K)", type: "range", min: 250, max: 800, step: 1, value: 298 },
      { key: "speed", label: "Playback speed", type: "range", min: 0.2, max: 5, step: 0.1, value: 1 },
      { key: "guessK", label: "Your prediction for K (type it before reading K)", type: "number", min: 0, step: 0.01, value: 0 },
    ],
    actions: [
      { label: "Remove ½ of product", fn: (h) => h.removeC() }, { label: "Add 0.5 M reactant", fn: (h) => h.addA() },
      { label: "Compress (V ÷ 2)", fn: (h) => h.volume(0.5) }, { label: "Expand (V × 2)", fn: (h) => h.volume(2) },
      { label: "Heat +50 K", fn: (h) => h.heat(50) }, { label: "Cool −50 K", fn: (h) => h.heat(-50) }, { label: "Restart", fn: (h) => h.restart() },
    ],
    challenges: [
      { id: "remove_product", text: "Wait for equilibrium, then remove product: the reaction makes more of it until Q = K again.", xp: 15 },
      { id: "predict_k", text: "Change kf or kr, predict K = kf/kr and type it into the box — within 2 %.", xp: 15 },
      { id: "compress_shift", text: "At equilibrium, compress the mixture: it shifts toward the side with fewer moles (more product here).", xp: 15 },
      { id: "heat_shift", text: "With an exothermic reaction (ΔH < 0) at equilibrium, heat it: K drops and product decomposes.", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params, T_REF = 298;
      let c = [1, 1, 0], V = 1, t = 0, hist = [], marks = [], running = true, pert = null, atEq = false, lastTmark = -1, suppress = false;
      const preset = () => EQ_PRESETS[P().preset] || EQ_PRESETS.generic, Tnow = () => clamp(num(P().T, 298), 200, 1000);
      /** Arrhenius kf, kr with Ea,r − Ea,f = ΔH so that K(T) follows van 't Hoff. */
      function rates() {
        const T = Tnow(), dH = num(P().dH, 0) * 1e3, EaF = 50e3 + Math.max(0, dH), EaR = EaF - dH, boost = (Ea) => Math.exp((-Ea / R_GAS) * (1 / T - 1 / T_REF));
        return { kf: clamp(num(P().kf, 1), 1e-4, 1e4) * boost(EaF), kr: clamp(num(P().kr, 1), 1e-4, 1e4) * boost(EaR), T };
      }
      const Kc = () => { const r = rates(); return r.kf / r.kr; };
      function Qc(cc) { const nu = preset().nu; let lnq = 0, zp = false, zr = false; for (let i = 0; i < 3; i++) { if (cc[i] <= 0) { if (nu[i] > 0) zp = true; else zr = true; } else lnq += nu[i] * Math.log(cc[i]); } return zp && zr ? NaN : zp ? 0 : zr ? Infinity : Math.exp(lnq); }
      /** Equilibrium composition reachable from cc: bisection on the extent ξ (ln Q is monotonic in ξ). */
      function solveEq(cc, K) {
        const nu = preset().nu; let lo = -Infinity, hi = Infinity;
        for (let i = 0; i < 3; i++) { if (nu[i] < 0) hi = Math.min(hi, cc[i] / -nu[i]); else lo = Math.max(lo, -cc[i] / nu[i]); }
        if (!(hi > lo) || !(K > 0) || !isFinite(K)) return cc.slice();
        const at = (xi) => cc.map((v, i) => Math.max(0, v + nu[i] * xi));
        const g = (xi) => { const x = at(xi); let s = 0; for (let i = 0; i < 3; i++) s += nu[i] * Math.log(Math.max(x[i], 1e-300)); return s - Math.log(K); };
        let a = lo, b = hi; for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (g(m) > 0) b = m; else a = m; }
        return at((a + b) / 2);
      }
      function deriv(cc) { const { kf, kr } = rates(), nu = preset().nu; let rf = kf, rr = kr; for (let i = 0; i < 3; i++) { const x = Math.max(cc[i], 0); if (nu[i] < 0) rf *= Math.pow(x, -nu[i]); else rr *= Math.pow(x, nu[i]); } const r = rf - rr; return nu.map((n) => n * r); }
      function advance(dtSim) { // explicit RK4 with a stability-limited step (slows playback instead of blowing up)
        const { kf, kr } = rates(), nu = preset().nu, cmax = Math.max(1e-3, c[0], c[1], c[2]);
        let sR = 0, sP = 0; nu.forEach((n) => { if (n < 0) sR -= n; else sP += n; });
        const lam = kf * sR * sR * Math.pow(cmax, Math.max(0, sR - 1)) + kr * sP * sP * Math.pow(cmax, Math.max(0, sP - 1));
        const h0 = 0.5 / Math.max(lam, 1e-9), steps = clamp(Math.ceil(dtSim / h0), 1, 300), h = Math.min(h0, dtSim / steps), f = (tt, s) => deriv(s);
        for (let i = 0; i < steps; i++) { c = rk4(f, c, t, h).map((v) => (isFinite(v) ? Math.max(0, v) : 0)); t += h; }
      }
      function restart() { c = [num(P().A0, 1), num(P().B0, 1), num(P().C0, 0)].map((v) => clamp(v, 0, 10)); V = 1; t = 0; hist = []; marks = []; pert = null; atEq = false; running = true; }
      function perturb(type, label, mutate) {
        const wasEq = atEq; mutate(); marks.push({ t, label }); if (marks.length > 10) marks.shift();
        pert = { type, label, wasEq, nC: c[2] * V, dH: num(P().dH, 0) }; atEq = false;
        api.setStatus(label + (wasEq ? " — watch the system re-equilibrate." : " (tip: wait for equilibrium before perturbing to see a clean shift)."));
      }
      function onEquilibrium() {
        if (!pert) return;
        const nC = c[2] * V, name = preset().names[2];
        if (pert.type === "removeC" && nC > pert.nC * 1.08) { api.award("remove_product"); api.setStatus("Product removed → Q < K → net forward reaction replaced part of it: moles of " + name + " rose from " + fmt(pert.nC, 3) + " to " + fmt(nC, 3) + "."); }
        if (pert.type === "compress" && pert.wasEq && nC > pert.nC * 1.03) { api.award("compress_shift"); api.setStatus("Halving V doubled every concentration, so Q fell below K → net shift to the side with fewer moles: " + name + " " + fmt(pert.nC, 3) + " → " + fmt(nC, 3) + " mol."); }
        if (pert.type === "heat" && pert.wasEq && pert.dH < 0 && nC < pert.nC * 0.97) { api.award("heat_shift"); api.setStatus("Heating an exothermic reaction lowers K (van 't Hoff): " + name + " fell from " + fmt(pert.nC, 3) + " to " + fmt(nC, 3) + " mol."); }
        pert = null;
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const pr = preset(), K = Kc(), Q = Qc(c), eq = solveEq(c, K), cols = [C.primary, C.secondary, C.ok], tw = 30, x1 = Math.max(tw, t), x0 = x1 - tw;
        let ymax = 0.1; hist.forEach((p) => { if (p[0] >= x0) ymax = Math.max(ymax, p[1], p[2], p[3]); }); ymax = Math.max(ymax, eq[0], eq[1], eq[2]) * 1.12;
        const pl = makePlot(ctx, C, { x: 48, y: 26, w: W * 0.6 - 48, h: H * 0.54 }, { xmin: x0, xmax: x1, ymin: 0, ymax });
        pl.frame("time (s)", "concentration (mol/L)");
        for (let i = 0; i < 3; i++) { pl.hline(eq[i], cols[i], [2, 5]); pl.line(hist.map((p) => [p[0], p[i + 1]]), cols[i], 2); }
        marks.forEach((m) => { if (m.t >= x0) { pl.vline(m.t, C.accent, [3, 3]); text(ctx, m.label, pl.X(m.t) + 3, pl.box.y + pl.box.h - 6, { color: C.accent, size: 9 }); } });
        pl.legend(pr.names.map((n, i) => [n + (i === 2 ? "   (dashed = predicted equilibrium)" : ""), cols[i]]), pl.box.x + 8, pl.box.y + 14);
        text(ctx, pr.title + "   t = " + fmt(t, 1) + " s" + (running ? "" : "  ⏸"), pl.box.x, 16, { color: C.text, bold: true });
        const gx = 48, gy = H * 0.9, gw = W * 0.6 - 48, lq = Math.log10(Q / K), mx = isFinite(lq) ? gx + ((clamp(lq, -3, 3) + 3) / 6) * gw : gx + gw / 2; // Q/K gauge
        ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(gx, gy - 8, gw, 16); ctx.fillStyle = C.axis; ctx.fillRect(gx + gw / 2 - 1, gy - 12, 2, 24);
        ctx.fillStyle = atEq ? C.ok : C.accent; ctx.beginPath(); ctx.arc(mx, gy, 7, 0, TAU); ctx.fill();
        text(ctx, "Q < K → forward", gx, gy - 14, { color: C.muted, size: 10 }); text(ctx, "Q = K", gx + gw / 2, gy - 14, { color: C.muted, size: 10, align: "center" }); text(ctx, "Q > K → reverse", gx + gw, gy - 14, { color: C.muted, size: 10, align: "right" });
        text(ctx, "log₁₀(Q/K) = " + fmt(lq, 2) + (atEq ? "  — at equilibrium" : Q < K ? "  — net forward" : Q > K ? "  — net reverse" : ""), gx, gy + 24, { color: C.text, size: 10 });
        const bx = W * 0.66, bw = W * 0.31, by = 40, bh = H * 0.5, bmax = Math.max(0.1, c[0], c[1], c[2], eq[0], eq[1], eq[2]) * 1.1, sw = bw / 3; // bars
        text(ctx, "now (solid) vs equilibrium (outline)", bx, 20, { color: C.text, size: 10, bold: true });
        ctx.strokeStyle = C.axis; ctx.setLineDash([]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, by + bh + 0.5); ctx.lineTo(bx + bw, by + bh + 0.5); ctx.stroke();
        for (let i = 0; i < 3; i++) {
          const x = bx + i * sw + sw * 0.15, w = sw * 0.7, hNow = (clamp(c[i], 0, bmax) / bmax) * bh, hEq = (clamp(eq[i], 0, bmax) / bmax) * bh;
          ctx.globalAlpha = 0.75; ctx.fillStyle = cols[i]; ctx.fillRect(x, by + bh - hNow, w, hNow); ctx.globalAlpha = 1;
          ctx.strokeStyle = cols[i]; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.strokeRect(x, by + bh - hEq, w, hEq); ctx.setLineDash([]);
          text(ctx, pr.names[i], x + w / 2, by + bh + 13, { color: C.muted, size: 10, align: "center" });
          text(ctx, fmt(c[i], 3), x + w / 2, by + bh - hNow - 4, { color: C.text, size: 10, align: "center" });
        }
        text(ctx, "V = " + fmt(V, 2) + " L   T = " + Tnow() + " K", bx, by + bh + 32, { color: C.muted, size: 10 });
        text(ctx, "K = " + fmt(K, 3) + "   Q = " + fmt(Q, 3), bx, by + bh + 46, { color: C.muted, size: 10 });
      }
      function readouts() {
        const pr = preset(), r = rates(), K = r.kf / r.kr, Q = Qc(c), eq = solveEq(c, K), T = Tnow(), g = num(P().guessK, 0);
        api.readout({
          "Reaction": pr.title + " · ΔH = " + num(P().dH, 0) + " kJ/mol",
          "kf(T), kr(T)": fmt(r.kf, 3) + ", " + fmt(r.kr, 3),
          "K = kf/kr": fmt(K, 4) + " (at 298 K: " + fmt(num(P().kf, 1) / num(P().kr, 1), 3) + ")",
          "Reaction quotient Q": fmt(Q, 4),
          "Q / K": fmt(Q / K, 3) + (atEq ? " — at equilibrium" : Q < K ? " — shifts forward →" : Q > K ? " — shifts reverse ←" : ""),
          "ΔG = RT·ln(Q/K)": unit(isFinite(Q) && Q > 0 ? (R_GAS * T * Math.log(Q / K)) / 1e3 : NaN, "kJ/mol", 2),
          "Predicted equilibrium": pr.names.map((n, i) => n + " " + fmt(eq[i], 3)).join(" · ") + " mol/L",
          "Volume / moles of product": fmt(V, 2) + " L / " + fmt(c[2] * V, 3) + " mol",
          "Your K prediction": g > 0 ? fmt(g, 3) + (Math.abs(g - K) / K <= 0.02 ? " ✓" : " (K is " + fmt(K, 3) + ")") : "— type a number",
        });
      }
      const tick = every(0.15);
      api.loop((dt) => {
        if (running) {
          advance(dt * clamp(num(P().speed, 1), 0.05, 10));
          const eq = solveEq(c, Kc()), cmax = Math.max(0.05, c[0], c[1], c[2], eq[0], eq[1], eq[2]), dev = Math.max(Math.abs(c[0] - eq[0]), Math.abs(c[1] - eq[1]), Math.abs(c[2] - eq[2])) / cmax, nowEq = dev < 0.01;
          if (nowEq && !atEq) { atEq = true; onEquilibrium(); } else atEq = nowEq;
          hist.push([t, c[0], c[1], c[2]]); if (hist.length > 2400) hist = hist.filter((_, i) => i % 2 === 0);
        }
        draw(); if (tick(dt)) readouts(); return true;
      });
      api.onParam((k) => {
        if (k === "preset") { api.setParam("dH", preset().dH); restart(); }
        else if (k === "A0" || k === "B0" || k === "C0") restart();
        else if (k === "T" && !suppress) { const T = Tnow(); if (lastTmark >= 0 && t - lastTmark < 0.5 && marks.length) { marks[marks.length - 1].label = "T → " + T + " K"; } else perturb("heat", "T → " + T + " K", () => {}); lastTmark = t; }
        else if (k === "guessK") { const g = num(P().guessK, NaN), K = Kc(); if (g > 0 && Math.abs(g - K) / K <= 0.02) { api.award("predict_k"); api.setStatus("✓ K = kf/kr = " + fmt(K, 3) + " — your prediction matches."); } else if (g > 0) api.setStatus("Prediction " + fmt(g, 3) + " vs K = " + fmt(K, 3) + " — remember K = kf(T)/kr(T) at the current temperature."); }
        draw(); readouts();
      });
      api.onResize(draw);
      restart(); draw(); readouts();
      api.setStatus("Concentrations relax until Q = K = kf/kr. Predict the shift before pressing a perturbation button.");
      api.html("<small>Mass action: rate = kf·Π[reactants]^|ν| − kr·Π[products]^ν (a textbook model, not the real Haber mechanism). kf and kr follow Arrhenius with Ea,r − Ea,f = ΔH, so K(T) obeys van 't Hoff: d ln K/dT = ΔH/RT². Compression scales every concentration by the volume ratio; the system then shifts toward the side with fewer moles.</small>");
      return {
        removeC() { perturb("removeC", "removed ½ of " + preset().names[2], () => { c[2] *= 0.5; }); },
        addA() { perturb("addA", "+0.5 M " + preset().names[0], () => { c[0] += 0.5; }); },
        volume(f) { const nv = clamp(V * f, 0.25, 4); if (nv === V) { api.setStatus("Volume limit reached (0.25–4 L)."); return; } perturb(f < 1 ? "compress" : "expand", (f < 1 ? "compressed" : "expanded") + " to V = " + fmt(nv, 2) + " L", () => { c = c.map((v) => (v * V) / nv); V = nv; }); },
        heat(d) { const T = clamp(Tnow() + d, 250, 800); suppress = true; api.setParam("T", T); suppress = false; perturb("heat", (d > 0 ? "heated" : "cooled") + " to " + T + " K", () => {}); lastTmark = t; draw(); readouts(); },
        restart() { restart(); api.setStatus("Restarted from the initial concentrations (V = 1 L)."); },
        destroy() { running = false; },
      };
    },
  });

  /* ════════════════════════════ 3e. titration ════════════════════════════ */
  const INDICATORS = {
    phenolphthalein: { name: "Phenolphthalein", lo: 8.2, hi: 10.0, acid: [255, 255, 255, 0.08], base: [255, 79, 163, 0.9], names: ["colourless", "pink"] },
    methyl_orange: { name: "Methyl orange", lo: 3.1, hi: 4.4, acid: [229, 57, 53, 0.9], base: [255, 213, 79, 0.9], names: ["red", "yellow"] },
    methyl_red: { name: "Methyl red", lo: 4.4, hi: 6.2, acid: [229, 57, 53, 0.9], base: [255, 213, 79, 0.9], names: ["red", "yellow"] },
    bromothymol_blue: { name: "Bromothymol blue", lo: 6.0, hi: 7.6, acid: [255, 213, 79, 0.9], base: [30, 136, 229, 0.9], names: ["yellow", "blue"] },
  };
  S.register({
    id: "titration", name: "Titration Curves", domains: ["chemistry"],
    description: "pH versus titrant volume for strong/weak acids and bases, solved exactly from the charge balance. See the buffer region, the half-equivalence point (pH = pKa), the equivalence jump, and whether your indicator changes colour in the right place.",
    params: [
      { key: "mode", label: "Titration", type: "select", value: "wa_sb", options: [{ value: "wa_sb", label: "Weak acid + strong base (NaOH)" }, { value: "sa_sb", label: "Strong acid + strong base (NaOH)" }, { value: "wb_sa", label: "Weak base + strong acid (HCl)" }, { value: "sb_sa", label: "Strong base + strong acid (HCl)" }] },
      { key: "pKa", label: "pKa of the weak acid (or of the weak base's conjugate acid)", type: "select", value: 4.76, options: [{ value: 3.17, label: "3.17 — HF" }, { value: 3.75, label: "3.75 — formic acid" }, { value: 4.76, label: "4.76 — acetic acid" }, { value: 7.53, label: "7.53 — hypochlorous acid" }, { value: 9.25, label: "9.25 — NH₄⁺ (ammonia as the base)" }, { value: 10.64, label: "10.64 — CH₃NH₃⁺ (methylamine as the base)" }] },
      { key: "Ca", label: "Analyte concentration (mol/L)", type: "range", min: 0.01, max: 1, step: 0.01, value: 0.1 },
      { key: "Va", label: "Analyte volume (mL)", type: "range", min: 5, max: 50, step: 1, value: 25 },
      { key: "Cb", label: "Titrant concentration (mol/L)", type: "range", min: 0.01, max: 1, step: 0.01, value: 0.1 },
      { key: "Vb", label: "Titrant added (mL)", type: "range", min: 0, max: 100, step: 0.1, value: 0 },
      { key: "indicator", label: "Indicator", type: "select", value: "bromothymol_blue", options: Object.keys(INDICATORS).map((k) => ({ value: k, label: INDICATORS[k].name + " (" + INDICATORS[k].lo + "–" + INDICATORS[k].hi + ")" })) },
    ],
    actions: [{ label: "Add 1 mL", fn: (h) => h.add(1) }, { label: "Add 0.1 mL", fn: (h) => h.add(0.1) }, { label: "Auto-titrate ▶ / ⏸", fn: (h) => h.auto() }, { label: "Empty the burette reading (0 mL)", fn: (h) => h.reset() }],
    challenges: [
      { id: "find_equivalence", text: "Stop the titrant within 0.3 mL of the equivalence volume (moles of titrant = moles of analyte).", xp: 15 },
      { id: "read_pka", text: "Weak acid or base: park at half-equivalence and read pH = pKa straight off the curve.", xp: 15 },
      { id: "pick_indicator", text: "For a weak acid or weak base titration choose an indicator whose colour change lies inside the steep jump (±2 % of the equivalence volume).", xp: 20 },
      { id: "eq_ph", text: "Hit equivalence in both a weak-acid and a weak-base titration: why is one above pH 7 and the other below?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      let auto = false, vAuto = 0, dropPhase = 0, suppress = false; const eqSeen = new Set();
      const mode = () => String(P().mode || "wa_sb"), weak = () => mode() === "wa_sb" || mode() === "wb_sa", acidAnalyte = () => mode() === "wa_sb" || mode() === "sa_sb";
      const pKa = () => clamp(num(P().pKa, 4.76), -2, 16), Ka = () => Math.pow(10, -pKa());
      const Ca = () => clamp(num(P().Ca, 0.1), 1e-4, 10), Va = () => clamp(num(P().Va, 25), 0.1, 1000), Cb = () => clamp(num(P().Cb, 0.1), 1e-4, 10), Vb = () => clamp(num(P().Vb, 0), 0, 1000);
      const Veq = () => (Ca() * Va()) / Cb(), Vmax = () => clamp(2 * Veq(), 2, 100);
      const indicator = () => INDICATORS[P().indicator] || INDICATORS.bromothymol_blue;
      /** Exact pH from the charge balance (bisection on log₁₀[H⁺]; every balance below is monotonic in [H⁺]). */
      function pHAt(vb) {
        const V = Va() + vb, cA = (Ca() * Va()) / V, cT = (Cb() * vb) / V, ka = Ka(), m = mode();
        const f = m === "sa_sb" ? (h) => cT + h - cA - KW / h                          // Na⁺ + H⁺ = Cl⁻ + OH⁻
          : m === "wa_sb" ? (h) => cT + h - (cA * ka) / (ka + h) - KW / h               // Na⁺ + H⁺ = A⁻ + OH⁻
          : m === "sb_sa" ? (h) => cA + h - cT - KW / h                                 // Na⁺ + H⁺ = Cl⁻ + OH⁻
          : (h) => (cA * h) / (ka + h) + h - cT - KW / h;                               // BH⁺ + H⁺ = Cl⁻ + OH⁻
        let lo = -16, hi = 2;
        for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (f(Math.pow(10, mid)) > 0) hi = mid; else lo = mid; }
        return -(lo + hi) / 2;
      }
      function indColor(pH) { const I = indicator(), tt = clamp((pH - I.lo) / (I.hi - I.lo), 0, 1); return { css: rgba(mixc(I.acid, I.base, tt)), name: tt <= 0.1 ? I.names[0] : tt >= 0.9 ? I.names[1] : "changing (" + I.names[0] + " → " + I.names[1] + ")", I }; }
      /** Does the indicator's transition range lie inside the pH jump between 98 % and 102 % of the equivalence volume? */
      function indicatorOk() { const I = indicator(), veq = Veq(), a = pHAt(0.98 * veq), b = pHAt(1.02 * veq); return I.lo >= Math.min(a, b) && I.hi <= Math.max(a, b); }
      function region(vb, veq) { const f = vb / veq; if (vb === 0) return "initial solution"; if (f < 0.98) return weak() ? (f < 0.1 ? "early buffer region" : f < 0.9 ? "buffer region (Henderson–Hasselbalch)" : "approaching equivalence") : "before equivalence"; if (f <= 1.02) return "equivalence point"; return "excess titrant"; }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const vmax = Vmax(), veq = Veq(), vb = Vb(), pH = pHAt(vb), ind = indColor(pH), I = ind.I;
        const pl = makePlot(ctx, C, { x: 48, y: 24, w: W * 0.64 - 48, h: H - 60 }, { xmin: 0, xmax: vmax, ymin: 0, ymax: 14 });
        pl.frame("titrant volume added (mL)", "pH");
        const g = ctx.createLinearGradient(0, pl.Y(I.lo), 0, pl.Y(I.hi)); g.addColorStop(0, rgba([I.acid[0], I.acid[1], I.acid[2], 0.3])); g.addColorStop(1, rgba([I.base[0], I.base[1], I.base[2], 0.3]));
        ctx.fillStyle = g; ctx.fillRect(pl.box.x + 1, pl.Y(I.hi), pl.box.w - 2, pl.Y(I.lo) - pl.Y(I.hi));
        text(ctx, I.name + " " + I.lo + "–" + I.hi, pl.box.x + pl.box.w - 6, pl.Y(I.hi) - 3, { color: C.muted, size: 9, align: "right" });
        pl.hline(7, C.muted, [2, 6]);
        pl.curve((v) => pHAt(v), C.primary, 2, 400);
        if (veq <= vmax) { const pe = pHAt(veq); pl.vline(veq, C.accent, [4, 3]); pl.dot(veq, pe, 4, C.accent); text(ctx, "equivalence " + fmt(veq, 2) + " mL, pH " + fmt(pe, 2), pl.X(veq) + 5, pl.Y(pe) - 8, { color: C.accent, size: 10 }); }
        if (weak() && veq / 2 <= vmax) { const ph2 = pHAt(veq / 2); pl.dot(veq / 2, ph2, 4, C.secondary); text(ctx, "½ equivalence: pH = pKa = " + fmt(ph2, 2), pl.X(veq / 2) + 5, pl.Y(ph2) + 14, { color: C.secondary, size: 10 }); }
        pl.dot(vb, pH, 7, "#ffffff"); pl.dot(vb, pH, 5.5, ind.css);
        const gx = W * 0.7, gw = W * 0.26, bx = gx + gw * 0.42, bw = gw * 0.16, by = 18, bh = H * 0.34, fill = 1 - clamp(vb / vmax, 0, 1); // burette
        ctx.strokeStyle = C.axis; ctx.lineWidth = 1.5; ctx.setLineDash([]); ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = "rgba(124,156,255,0.5)"; ctx.fillRect(bx + 1, by + bh * (1 - fill), bw - 2, Math.max(0, bh * fill - 1));
        ctx.fillStyle = C.axis; ctx.fillRect(bx + bw / 2 - 2, by + bh, 4, 14);
        text(ctx, "titrant " + fmt(Cb(), 2) + " M", bx + bw / 2, by - 6, { color: C.muted, size: 9, align: "center" });
        if (auto) { ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh + 18 + (dropPhase % 1) * H * 0.16, 3, 0, TAU); ctx.fill(); }
        const fx = gx + gw / 2, fy = H - 14, fwTop = gw * 0.16, fwBot = gw * 0.44, fh = H * 0.36, neck = H * 0.08; // Erlenmeyer flask
        ctx.save(); ctx.beginPath(); ctx.moveTo(fx - fwTop / 2, fy - fh - neck); ctx.lineTo(fx - fwTop / 2, fy - fh); ctx.lineTo(fx - fwBot / 2, fy - 10); ctx.quadraticCurveTo(fx, fy + 6, fx + fwBot / 2, fy - 10); ctx.lineTo(fx + fwTop / 2, fy - fh); ctx.lineTo(fx + fwTop / 2, fy - fh - neck); ctx.closePath();
        ctx.strokeStyle = C.text; ctx.lineWidth = 1.5; ctx.stroke(); ctx.clip();
        const level = clamp((Va() + vb) / (Va() + vmax), 0.08, 1) * fh * 0.95; ctx.fillStyle = ind.css; ctx.fillRect(fx - fwBot, fy - level, fwBot * 2, level + 12);
        ctx.restore();
        text(ctx, "pH " + fmt(pH, 2), fx, fy - fh - neck - 8, { color: C.text, size: 12, bold: true, align: "center" });
        text(ctx, ind.name, fx, fy - fh * 0.45, { color: C.text, size: 10, align: "center" });
        text(ctx, fmt(Va() + vb, 1) + " mL", fx, fy - fh * 0.45 + 13, { color: C.muted, size: 9, align: "center" });
      }
      function readouts() {
        const vb = Vb(), veq = Veq(), pH = pHAt(vb), pe = pHAt(veq), ind = indColor(pH), I = ind.I, r = {
          "pH now": fmt(pH, 2) + " at " + fmt(vb, 1) + " mL (" + region(vb, veq) + ")",
          "Equivalence volume Cₐ·Vₐ/C_b": unit(veq, "mL", 2) + (veq > 100 ? " — beyond the burette! raise the titrant concentration" : ""),
          "pH at equivalence": fmt(pe, 2) + (pe > 7.3 ? " (> 7: the conjugate base hydrolyses)" : pe < 6.7 ? " (< 7: the conjugate acid hydrolyses)" : " (≈ 7: neutral salt)"),
          "Fraction titrated": unit((100 * vb) / veq, "%", 1),
          "Indicator": I.name + " → " + ind.name + (indicatorOk() ? " · ✓ changes inside the equivalence jump" : " · ✗ changes colour away from equivalence"),
          "Initial pH": fmt(pHAt(0), 2) + (weak() ? (acidAnalyte() ? " (weak acid, ≈ ½(pKa − log C))" : " (weak base)") : " (fully dissociated)"),
        };
        if (weak()) r["Half-equivalence pH (= pKa)"] = fmt(pHAt(veq / 2), 2) + " vs pKa " + pKa();
        api.readout(r);
      }
      function check(manual) {
        const vb = Vb(), veq = Veq(), tol = 0.3;
        if (manual && vb > 0 && Math.abs(vb - veq) <= tol) { api.award("find_equivalence"); eqSeen.add(mode()); if (eqSeen.has("wa_sb") && eqSeen.has("wb_sa")) api.award("eq_ph"); }
        if (manual && weak() && vb > 0 && Math.abs(vb - veq / 2) <= tol) api.award("read_pka");
        if (weak() && indicatorOk()) api.award("pick_indicator");
      }
      api.loop((dt) => {
        if (!auto) return true;
        dropPhase += dt * 2.5; const vmax = Vmax(); vAuto = Math.min(vmax, vAuto + (dt * vmax) / 20);
        suppress = true; api.setParam("Vb", Math.round(vAuto * 10) / 10); suppress = false;
        if (vAuto >= vmax) { auto = false; api.setStatus("End of the " + fmt(vmax, 1) + " mL window. Fine-tune with the slider or the buttons."); }
        return true;
      });
      api.onParam(() => { check(!suppress); draw(); readouts(); }); api.onResize(draw);
      api.setStatus("Drag 'Titrant added' or use the buttons; auto-titrate sweeps the whole curve. Challenges need manual (non-auto) positioning.");
      api.html("<small>pH is solved from the exact charge balance, e.g. weak acid + NaOH: [Na⁺] + [H⁺] = [A⁻] + [OH⁻] with [A⁻] = C·Ka/(Ka + [H⁺]). In the buffer region pH ≈ pKa + log([A⁻]/[HA]) (Henderson–Hasselbalch); at equivalence only the conjugate base/acid remains, so the pH is above/below 7.</small>");
      draw(); readouts(); check(false);
      return {
        add(v) { auto = false; api.setParam("Vb", Math.round(clamp(Vb() + v, 0, 100) * 10) / 10); },
        auto() { auto = !auto; vAuto = Vb(); api.setStatus(auto ? "Titrating… press again to pause." : "Paused at " + fmt(Vb(), 1) + " mL."); },
        reset() { auto = false; api.setParam("Vb", 0); api.setStatus("Back to 0 mL — only the analyte is in the flask."); },
        destroy() { auto = false; },
      };
    },
  });

  /* ════════════════════════════ 3f. radioactive_decay ════════════════════════════ */
  S.register({
    id: "radioactive_decay", name: "Radioactive Decay", domains: ["chemistry", "physics"],
    description: "Every nucleus decays at random with probability λ·Δt per step — the jagged count is compared with the smooth N₀e^(−λt). Switch on a decay chain (parent → daughter → stable) and watch the daughter rise, peak and fade (Bateman equations).",
    params: [
      { key: "N0", label: "Initial nuclei N₀", type: "range", min: 20, max: 2000, step: 10, value: 400 },
      { key: "halfLife", label: "Parent half-life t½ (s)", type: "range", min: 0.5, max: 30, step: 0.5, value: 5 },
      { key: "chain", label: "Decay chain (parent → daughter → stable)", type: "toggle", value: false },
      { key: "halfLife2", label: "Daughter half-life (s)", type: "range", min: 0.5, max: 30, step: 0.5, value: 2 },
      { key: "warp", label: "Time warp (simulated s per real s)", type: "range", min: 0.25, max: 10, step: 0.25, value: 1 },
      { key: "analytic", label: "Show analytic curves (dashed)", type: "toggle", value: true },
      { key: "guess", label: "Your prediction: % left after 3 half-lives", type: "number", min: 0, max: 100, step: 0.1, value: 0 },
    ],
    actions: [{ label: "Restart", fn: (h) => h.restart() }, { label: "Pause / resume", fn: (h) => h.toggle() }],
    challenges: [
      { id: "three_half_lives", text: "Type your prediction for the % remaining after 3 half-lives, then let the sample get there.", xp: 15 },
      { id: "daughter_peak", text: "Turn the chain on and watch the daughter population rise, peak and fall away again.", xp: 15 },
      { id: "small_vs_large", text: "Run a tiny sample (N₀ ≤ 100) and a big one (N₀ ≥ 1000) past 2 half-lives: which hugs the smooth curve? (noise ∝ √N)", xp: 10 },
      { id: "transient_eq", text: "Chain with a short-lived daughter (t½,D ≤ t½,P/8): after a few daughter half-lives its activity locks onto the parent's — transient equilibrium.", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      let st = null, running = true; const flags = { small: false, large: false };
      const hl1 = () => clamp(num(P().halfLife, 5), 0.1, 1e4), hl2 = () => clamp(num(P().halfLife2, 2), 0.1, 1e4), lam1 = () => LN2 / hl1(), lam2 = () => LN2 / hl2();
      function restart() { const n = clamp(Math.round(num(P().N0, 400)), 1, 2000); st = { n, state: new Uint8Array(n), flash: new Float32Array(n), t: 0, hist: [], events: [], maxD: 0, tMaxD: 0, ratio: NaN, NP: n, ND: 0, NS: 0, A1: 0, A2: 0 }; }
      /** Expected populations/activities: N_P = N₀e^(−λ₁t); Bateman daughter N_D = N₀λ₁/(λ₂−λ₁)·(e^(−λ₁t) − e^(−λ₂t)). */
      function analytic(tt) {
        const n = st.n, l1 = lam1(), l2 = lam2(), NP = n * Math.exp(-l1 * tt);
        const ND = !P().chain ? 0 : Math.abs(l2 - l1) < 1e-9 ? n * l1 * tt * Math.exp(-l1 * tt) : ((n * l1) / (l2 - l1)) * (Math.exp(-l1 * tt) - Math.exp(-l2 * tt));
        return { NP, ND, NS: n - NP - ND, A1: l1 * NP, A2: l2 * ND };
      }
      function step(dtSim) {
        const chain = !!P().chain, l1 = lam1(), l2 = lam2(), sub = clamp(Math.ceil(dtSim * Math.max(l1, chain ? l2 : 0) * 4), 1, 20), h = dtSim / sub;
        for (let s = 0; s < sub; s++) {
          const p1 = 1 - Math.exp(-l1 * h), p2 = 1 - Math.exp(-l2 * h); let d1 = 0, d2 = 0;
          for (let i = 0; i < st.n; i++) {
            const k = st.state[i];
            if (k === 0) { if (api.random() < p1) { st.state[i] = chain ? 1 : 2; st.flash[i] = 0.5; d1++; } }
            else if (k === 1 && api.random() < p2) { st.state[i] = 2; st.flash[i] = 0.5; d2++; }
          }
          st.t += h; if (d1 || d2) st.events.push([st.t, d1, d2]);
        }
        let NP = 0, ND = 0; for (let i = 0; i < st.n; i++) { if (st.state[i] === 0) NP++; else if (st.state[i] === 1) ND++; }
        st.NP = NP; st.ND = ND; st.NS = st.n - NP - ND;
        const win = clamp(hl1() / 4, 0.25, 3); let a1 = 0, a2 = 0; st.events = st.events.filter((e) => e[0] > st.t - win); st.events.forEach((e) => { a1 += e[1]; a2 += e[2]; });
        st.A1 = a1 / win; st.A2 = a2 / win; // measured activities over a trailing window
        if (ND > st.maxD) { st.maxD = ND; st.tMaxD = st.t; }
        st.hist.push([st.t, NP, ND, st.NS, st.A1, st.A2]); if (st.hist.length > 1600) st.hist = st.hist.filter((_, i) => i % 2 === 0);
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const n = st.n, chain = !!P().chain, cols = [C.primary, C.accent, "rgba(154,163,199,0.35)"];
        const fx = 10, fy = 26, fw = W * 0.44, fh = H - 44, colsN = Math.max(1, Math.ceil(Math.sqrt((n * fw) / fh))), rowsN = Math.ceil(n / colsN), cw = fw / colsN, chh = fh / rowsN, r = Math.max(1.2, Math.min(cw, chh) * 0.36);
        for (let i = 0; i < n; i++) {
          const x = fx + (i % colsN) * cw + cw / 2, y = fy + Math.floor(i / colsN) * chh + chh / 2, fl = st.flash[i];
          if (fl > 0) { ctx.fillStyle = "rgba(255,255,255," + (fl * 0.8).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(x, y, r + 6 * fl, 0, TAU); ctx.fill(); }
          ctx.fillStyle = cols[st.state[i]]; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        }
        text(ctx, "parent " + st.NP + (chain ? " · daughter " + st.ND : "") + " · stable " + st.NS + "   t = " + fmt(st.t, 1) + " s = " + fmt(st.t / hl1(), 2) + " t½" + (running ? "" : "  ⏸"), fx, 16, { color: C.text, size: 10, bold: true });
        const tmax = Math.max(6 * hl1(), st.t * 1.05), px = W * 0.56, pw = W * 0.41;
        const pN = makePlot(ctx, C, { x: px, y: 22, w: pw, h: H * 0.4 }, { xmin: 0, xmax: tmax, ymin: 0, ymax: n * 1.05 });
        pN.frame("", "nuclei", { noXTicks: true, ny: 3 });
        for (let k = 1; k <= 5; k++) if (k * hl1() <= tmax) { pN.vline(k * hl1(), C.axis, [2, 3]); pN.hline(n / Math.pow(2, k), C.axis, [2, 3]); }
        if (P().analytic) { pN.curve((tt) => analytic(tt).NP, C.primary, 1, 200, [5, 4]); if (chain) pN.curve((tt) => analytic(tt).ND, C.accent, 1, 200, [5, 4]); pN.curve((tt) => analytic(tt).NS, C.muted, 1, 200, [5, 4]); }
        pN.line(st.hist.map((p) => [p[0], p[1]]), C.primary, 2); if (chain) pN.line(st.hist.map((p) => [p[0], p[2]]), C.accent, 2); pN.line(st.hist.map((p) => [p[0], p[3]]), C.muted, 2);
        pN.legend(chain ? [["parent (solid = this run, dashed = N₀e^(−λt))", C.primary], ["daughter (dashed = Bateman)", C.accent], ["stable", C.muted]] : [["parent (solid = this run, dashed = N₀e^(−λt))", C.primary], ["stable", C.muted]], px + 10, 36);
        let Amax = lam1() * n; st.hist.forEach((p) => { Amax = Math.max(Amax, p[4], p[5]); });
        const pA = makePlot(ctx, C, { x: px, y: H * 0.52, w: pw, h: H * 0.36 }, { xmin: 0, xmax: tmax, ymin: 0, ymax: Amax * 1.1 });
        pA.frame("time (s)", "activity (Bq)", { ny: 3 });
        if (P().analytic) { pA.curve((tt) => analytic(tt).A1, C.primary, 1, 200, [5, 4]); if (chain) pA.curve((tt) => analytic(tt).A2, C.accent, 1, 200, [5, 4]); }
        pA.line(st.hist.map((p) => [p[0], p[4]]), C.primary, 1.5); if (chain) pA.line(st.hist.map((p) => [p[0], p[5]]), C.accent, 1.5);
        text(ctx, "A = λN = −dN/dt  (measured over a trailing " + fmt(clamp(hl1() / 4, 0.25, 3), 2) + " s window)", px, H * 0.52 - 6, { color: C.muted, size: 9 });
      }
      const tick = every(0.2);
      function readouts() {
        const n = st.n, th = analytic(st.t), l1 = lam1(), l2 = lam2(), chain = !!P().chain, g = num(P().guess, 0), r = {
          "Remaining parent": fmt((100 * st.NP) / n, 1) + " % (" + st.NP + " of " + n + ") · expected " + fmt((100 * th.NP) / n, 1) + " %",
          "Elapsed half-lives": fmt(st.t / hl1(), 2) + " (t = " + fmt(st.t, 1) + " s)",
          "λ = ln 2/t½ · mean lifetime τ = 1/λ": unit(l1, "s⁻¹", 4) + " · " + unit(1 / l1, "s", 2),
          "Parent activity": fmt(st.A1, 1) + " Bq measured · λN = " + fmt(l1 * st.NP, 1) + " Bq · initial λN₀ = " + fmt(l1 * n, 1) + " Bq",
          "Expected counting noise √N/N": "±" + fmt(100 / Math.sqrt(Math.max(1, st.NP)), 1) + " % of the parent count",
        };
        if (chain) {
          const tpk = Math.abs(l2 - l1) < 1e-9 ? 1 / l1 : Math.log(l2 / l1) / (l2 - l1);
          r["Daughter"] = st.ND + " now · peak so far " + st.maxD + " at " + fmt(st.tMaxD, 1) + " s · theory t_peak = ln(λ₂/λ₁)/(λ₂ − λ₁) = " + fmt(tpk, 2) + " s";
          r["Daughter activity"] = fmt(st.A2, 1) + " Bq measured · λ₂N_D = " + fmt(l2 * st.ND, 1) + " Bq" + (l2 > l1 ? " · transient-equilibrium ratio A_D/A_P → λ₂/(λ₂ − λ₁) = " + fmt(l2 / (l2 - l1), 2) : "");
        }
        r["Prediction after 3 t½"] = g > 0 ? fmt(g, 1) + " % (exact: 100/2³ = 12.5 %)" : "— type a percentage in the box";
        api.readout(r);
      }
      function checkAwards() {
        const n = st.n, tt = st.t, h1 = hl1(), g = num(P().guess, 0), chain = !!P().chain;
        if (tt >= 3 * h1 && g > 0 && Math.abs(g - 12.5) <= 1.5) api.award("three_half_lives");
        if (tt >= 2 * h1) { if (n <= 100) flags.small = true; if (n >= 1000) flags.large = true; if (flags.small && flags.large) api.award("small_vs_large"); }
        if (chain && st.maxD >= 10 && st.ND < 0.6 * st.maxD && tt > st.tMaxD) api.award("daughter_peak");
        if (chain && lam2() >= 8 * lam1() && tt >= 6 * hl2() && st.NP >= 30 && st.ND >= 3) {
          const ratio = (lam2() * st.ND) / (lam1() * st.NP); st.ratio = isFinite(st.ratio) ? 0.9 * st.ratio + 0.1 * ratio : ratio;
          if (st.ratio > 0.75 && st.ratio < 1.45) api.award("transient_eq");
        }
      }
      api.loop((dt) => {
        if (running && st.NP + st.ND > 0) { step(dt * clamp(num(P().warp, 1), 0.05, 50)); checkAwards(); }
        for (let i = 0; i < st.n; i++) if (st.flash[i] > 0) st.flash[i] = Math.max(0, st.flash[i] - dt * 2);
        draw(); if (tick(dt)) readouts(); return true;
      });
      api.onParam((k) => { if (k === "N0" || k === "halfLife" || k === "chain" || k === "halfLife2") restart(); if (k === "guess") checkAwards(); draw(); readouts(); });
      api.onResize(draw);
      restart(); draw(); readouts();
      api.setStatus("Each nucleus is tested every step with probability 1 − e^(−λΔt). The solid curve is one random history; the dashed one is the expectation.");
      api.html("<small>N(t) = N₀e^(−λt) with λ = ln 2/t½; activity A = λN (1 Bq = 1 decay per simulated second). Chain: dN_D/dt = λ₁N_P − λ₂N_D → N_D(t) = N₀λ₁/(λ₂ − λ₁)·(e^(−λ₁t) − e^(−λ₂t)), peaking at t = ln(λ₂/λ₁)/(λ₂ − λ₁). Counting noise ≈ √N, so small samples look rough.</small>");
      return { restart() { restart(); running = true; }, toggle() { running = !running; }, destroy() { running = false; } };
    },
  });
})();
