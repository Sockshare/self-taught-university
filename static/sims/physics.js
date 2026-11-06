/* Self-Taught — physics simulation widgets (vanilla JS, canvas).
 * Registers: projectile, pendulum, spring_mass, collisions, orbit, wave_superposition,
 *            electric_field, ideal_gas, relativity, quantum_well, blackbody.
 * Widget API: docs/CONTRACTS.md §3 + static/sims/core.js (SelfTaughtSims.register / api object).
 */
(function () {
  "use strict";
  const S = window.SelfTaughtSims;
  if (!S || typeof S.register !== "function") { console.error("[physics sims] core.js must be loaded first"); return; }

  /* ════════════════════════════ shared helpers ════════════════════════════ */
  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (typeof v === "number" && isFinite(v) ? v : d);

  /** Number formatting that never prints NaN and switches to exponent notation for extreme values. */
  function fmt(v, d) {
    if (typeof v !== "number" || !isFinite(v)) return v === Infinity ? "∞" : v === -Infinity ? "−∞" : "—";
    d = d == null ? 2 : d;
    const a = Math.abs(v);
    return a !== 0 && (a >= 1e6 || a < 1e-3) ? v.toExponential(d) : v.toFixed(d);
  }
  const unit = (v, u, d) => fmt(v, d) + (u ? " " + u : "");

  /** "Nice" tick spacing (1/2/5 × 10ⁿ) giving about `target` ticks over `span`. */
  function niceStep(span, target) {
    if (!(span > 0) || !isFinite(span)) return 1;
    const raw = span / (target || 5), mag = Math.pow(10, Math.floor(Math.log10(raw))), r = raw / mag;
    return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * mag;
  }
  function tickLabel(v, step) {
    const d = clamp(-Math.floor(Math.log10(step)), 0, 6), s = v.toFixed(d);
    return /^-0\.?0*$/.test(s) ? s.slice(1) : s;
  }
  function clear(ctx, w, h, C) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }
  function text(ctx, s, x, y, o) {
    o = o || {};
    ctx.fillStyle = o.color || "#e8ebff";
    ctx.font = (o.bold ? "600 " : "") + (o.size || 11) + "px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic";
    ctx.fillText(String(s), x, y);
  }
  function arrow(ctx, x1, y1, x2, y2, color, w) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (!(L > 0.5)) return;
    const ux = dx / L, uy = dy / L, hs = Math.min(9, L * 0.45);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w || 1.5; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ux * hs, y2 - uy * hs); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * hs - uy * hs * 0.5, y2 - uy * hs + ux * hs * 0.5);
    ctx.lineTo(x2 - ux * hs + uy * hs * 0.5, y2 - uy * hs - ux * hs * 0.5);
    ctx.closePath(); ctx.fill();
  }
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
  /** fn(dt) → true once every `interval` seconds (throttles DOM readouts). */
  function every(interval) { let acc = interval; return (dt) => { acc += dt; if (acc >= interval) { acc = 0; return true; } return false; }; }
  /** api.loop with a sanitised dt: headless or background tabs can deliver negative / NaN frame deltas. */
  const safeLoop = (api, fn) => api.loop((dt) => fn(clamp(num(dt, 0), 0, 0.05)));

  /** Plot helper: data→pixel mapping inside `box` for `range`, grid/axes/ticks, clipped lines, markers, legend. */
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
        const sx = niceStep(xmax - xmin, o.nx || Math.max(2, Math.round(w / 90)));
        const sy = niceStep(ymax - ymin, o.ny || Math.max(2, Math.round(h / 40)));
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath();
        for (let v = Math.ceil(xmin / sx - 1e-9) * sx; v <= xmax + 1e-9; v += sx) {
          const px = X(v); ctx.moveTo(px, y); ctx.lineTo(px, y + h);
          if (!o.noXTicks) text(ctx, tickLabel(v, sx), px, y + h + 12, { color: C.muted, align: "center", size: 10 });
        }
        for (let v = Math.ceil(ymin / sy - 1e-9) * sy; v <= ymax + 1e-9; v += sy) {
          const py = Y(v); ctx.moveTo(x, py); ctx.lineTo(x + w, py);
          if (!o.noYTicks) text(ctx, tickLabel(v, sy), x - 4, py + 3, { color: C.muted, align: "right", size: 10 });
        }
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
        for (let i = 0; i < pts.length; i++) {
          const px = X(pts[i][0]), py = Y(pts[i][1]);
          if (!isFinite(px) || !isFinite(py)) { pen = false; continue; }
          if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; }
        }
        ctx.stroke(); ctx.restore();
      },
      curve(f, color, width, n, dash) { const pts = []; n = n || 200; for (let i = 0; i <= n; i++) { const vx = xmin + ((xmax - xmin) * i) / n; pts.push([vx, f(vx)]); } P.line(pts, color, width, dash); },
      fill(pts, color) {
        if (!pts.length) return;
        ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = color; ctx.beginPath();
        ctx.moveTo(X(pts[0][0]), Y(clamp(0, ymin, ymax))); pts.forEach((p) => ctx.lineTo(X(p[0]), Y(p[1]))); ctx.lineTo(X(pts[pts.length - 1][0]), Y(clamp(0, ymin, ymax)));
        ctx.closePath(); ctx.fill(); ctx.restore();
      },
      dot(vx, vy, r, color) { const px = X(vx), py = Y(vy); if (!isFinite(px) || !isFinite(py)) return; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, r || 4, 0, TAU); ctx.fill(); },
      vline(vx, color, dash) { P.line([[vx, ymin], [vx, ymax]], color, 1, dash || [4, 4]); },
      hline(vy, color, dash) { P.line([[xmin, vy], [xmax, vy]], color, 1, dash || [4, 4]); },
      legend(items, px, py) { px = px == null ? x + 8 : px; py = py == null ? y + 14 : py; items.forEach((it, i) => { ctx.fillStyle = it[1]; ctx.fillRect(px, py + i * 14 - 5, 12, 3); text(ctx, it[0], px + 16, py + i * 14, { color: C.text, size: 10 }); }); },
    };
    return P;
  }
  /** Simple vertical bar chart with labels under the bars and optional value text above. */
  function bars(ctx, C, x, y, w, h, items, max) {
    const n = items.length, bw = w / Math.max(1, n); max = max > 0 ? max : 1;
    ctx.strokeStyle = C.axis; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x, y + h + 0.5); ctx.lineTo(x + w, y + h + 0.5); ctx.stroke();
    items.forEach((it, i) => {
      const bh = clamp(num(it.value, 0) / max, 0, 1) * h;
      ctx.fillStyle = it.color; ctx.fillRect(x + i * bw + bw * 0.15, y + h - bh, bw * 0.7, bh);
      text(ctx, it.label, x + i * bw + bw / 2, y + h + 13, { color: C.muted, align: "center", size: 10 });
      if (it.text) text(ctx, it.text, x + i * bw + bw / 2, y + h - bh - 4, { color: C.text, align: "center", size: 10 });
    });
  }
  const PLANETS = { earth: 9.81, moon: 1.62, mars: 3.71, jupiter: 24.79 };
  const PLANET_OPTS = Object.keys(PLANETS).map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) + " (g = " + PLANETS[k] + " m/s²)" }));
  const gOf = (k) => PLANETS[k] || 9.81;

  /* ════════════════════════════ projectile ════════════════════════════ */
  S.register({
    id: "projectile", name: "Projectile Launcher", domains: ["physics"],
    description: "Launch a projectile and see how speed, angle, gravity and quadratic air drag shape the trajectory. Trails persist so launches can be compared.",
    params: [
      { key: "speed", label: "Launch speed v₀ (m/s)", type: "range", min: 1, max: 100, step: 1, value: 30 },
      { key: "angle", label: "Launch angle θ (°)", type: "range", min: 0, max: 90, step: 1, value: 45 },
      { key: "planet", label: "Planet", type: "select", value: "earth", options: PLANET_OPTS },
      { key: "drag", label: "Quadratic air drag (a = −k|v|v)", type: "toggle", value: false },
      { key: "k", label: "Drag constant k = ½ρC_dA/m (1/m)", type: "range", min: 0.001, max: 0.05, step: 0.001, value: 0.008 },
    ],
    actions: [{ label: "Launch", fn: (h) => h.launch() }, { label: "Clear trails", fn: (h) => h.clear() }, { label: "New target", fn: (h) => h.newTarget() }],
    challenges: [
      { id: "hit_target", text: "Hit the target flag — land within 3 % of its distance.", xp: 20 },
      { id: "complementary", text: "Without drag, fire two complementary angles (e.g. 30° and 60°) at the same speed: they share a range.", xp: 15 },
      { id: "moon_hang", text: "Repeat the same launch on a different planet: how do hang time and range scale with g?", xp: 10 },
      { id: "drag_optimum", text: "Switch drag on: is 45° still the best angle for range? Find the new optimum.", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      let shots = [], flying = [], target = 0, viewMax = 0, lastShot = null;
      const gNow = () => gOf(P().planet);
      const ratio = () => (cv.width - 60) / Math.max(1, cv.height - 46);
      function analytic(v, th, G) { th *= DEG; return { R: (v * v * Math.sin(2 * th)) / G, T: (2 * v * Math.sin(th)) / G, H: (v * v * Math.sin(th) ** 2) / (2 * G) }; }
      function fit() {
        const a = analytic(P().speed, P().angle, gNow());
        let m = Math.max(20, a.R * 1.08, a.H * 1.15 * ratio(), target * 1.15);
        shots.forEach((s) => { m = Math.max(m, s.maxX * 1.08, s.maxY * 1.15 * ratio()); });
        viewMax = Math.max(viewMax, m);
      }
      function refresh() { if (!shots.length) viewMax = 0; fit(); draw(); readouts(); }
      function newTarget() { target = Math.round((0.25 + 0.6 * api.random()) * (P().speed ** 2 / gNow())); refresh(); }
      function launch() {
        if (flying.length >= 6) return;
        const v = P().speed, th = P().angle, G = gNow(), a = analytic(v, th, G);
        const s = { pts: [[0, 0]], x: 0, y: 0, vx: v * Math.cos(th * DEG), vy: v * Math.sin(th * DEG), t: 0, maxX: 0, maxY: 0, done: false,
          speed: v, angle: th, planet: P().planet, drag: !!P().drag, k: P().k, g: G, warp: Math.max(1, a.T / 6), color: C.series[shots.length % C.series.length] };
        shots.push(s); flying.push(s); lastShot = s;
        if (shots.length > 10) shots.shift();
        fit(); api.setStatus("Flying…");
      }
      function step(s, dt) {
        const k = s.drag ? s.k : 0, G = s.g;
        const f = (t, u) => { const sp = Math.hypot(u[2], u[3]); return [u[2], u[3], -k * sp * u[2], -G - k * sp * u[3]]; };
        let u = [s.x, s.y, s.vx, s.vy];
        const n = 6, h = dt / n;
        for (let i = 0; i < n && !s.done; i++) {
          const nu = rk4(f, u, s.t, h);
          if (nu[1] < 0) { // touched down inside this step → interpolate to y = 0
            const fr = u[1] / Math.max(1e-12, u[1] - nu[1]);
            for (let j = 0; j < 4; j++) nu[j] = u[j] + (nu[j] - u[j]) * fr;
            nu[1] = 0; s.t += h * fr; s.done = true;
          } else s.t += h;
          u = nu;
        }
        s.x = u[0]; s.y = u[1]; s.vx = u[2]; s.vy = u[3];
        s.maxX = Math.max(s.maxX, s.x); s.maxY = Math.max(s.maxY, s.y);
        s.pts.push([s.x, s.y]); if (s.pts.length > 3000) s.pts = s.pts.filter((_, i) => i % 2 === 0);
      }
      function landed(s) {
        if (target > 0 && Math.abs(s.x - target) <= 0.03 * target) { api.award("hit_target"); api.setStatus("🎯 Direct hit at " + fmt(s.x, 1) + " m!"); }
        else api.setStatus("Landed at " + fmt(s.x, 1) + " m after " + fmt(s.t, 2) + " s" + (target ? " (target " + target + " m)." : "."));
        shots.forEach((o) => {
          if (o === s || !o.done) return;
          if (!o.drag && !s.drag && o.planet === s.planet && o.speed === s.speed && Math.abs(o.angle + s.angle - 90) < 0.5 && Math.abs(o.angle - s.angle) > 1) api.award("complementary");
          if (o.planet !== s.planet && o.speed === s.speed && o.angle === s.angle && o.drag === s.drag) api.award("moon_hang");
        });
      }
      function readouts() {
        const a = analytic(P().speed, P().angle, gNow()), s = lastShot;
        const r = { "No-drag range v₀²sin2θ/g": unit(a.R, "m", 1), "No-drag flight time 2v₀sinθ/g": unit(a.T, "s", 2), "No-drag max height": unit(a.H, "m", 1), "Target distance": unit(target, "m", 0) };
        if (s) { r["Last shot"] = s.speed + " m/s @ " + s.angle + "° · g = " + s.g + (s.drag ? " · drag k = " + s.k : ""); r["Last range"] = unit(s.x, "m", 1); r["Last flight time"] = unit(s.t, "s", 2); r["Last max height"] = unit(s.maxY, "m", 1); }
        api.readout(r);
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const box = { x: 46, y: 14, w: W - 60, h: H - 46 }, ymax = (viewMax * box.h) / box.w;
        const Pl = makePlot(ctx, C, box, { xmin: 0, xmax: viewMax, ymin: 0, ymax });
        Pl.frame("distance (m)", "height (m)");
        const v = P().speed, th = P().angle * DEG, G = gNow();
        if (th < 89.9 * DEG) Pl.curve((x) => Math.tan(th) * x - (G * x * x) / (2 * v * v * Math.cos(th) ** 2), C.muted, 1, 120, [3, 5]);
        ctx.fillStyle = "rgba(110,231,183,0.3)"; ctx.fillRect(box.x, Pl.Y(0) - 2, box.w, 3);
        if (target > 0) {
          const tx = Pl.X(target), ty = Pl.Y(0);
          ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty - 22); ctx.stroke();
          ctx.fillStyle = C.danger; ctx.beginPath(); ctx.moveTo(tx, ty - 22); ctx.lineTo(tx + 14, ty - 17); ctx.lineTo(tx, ty - 12); ctx.closePath(); ctx.fill();
          text(ctx, target + " m", tx, ty - 26, { color: C.accent, align: "center", size: 10 });
        }
        shots.forEach((s) => { Pl.line(s.pts, s.color, 2); Pl.dot(s.x, s.y, s.done ? 3 : 5, s.color); });
        const ox = Pl.X(0), oy = Pl.Y(0), len = 24 + v * 0.3;
        arrow(ctx, ox, oy, ox + len * Math.cos(th), oy - len * Math.sin(th), C.accent, 3);
        text(ctx, "v₀ = " + v + " m/s   θ = " + P().angle + "°   g = " + G + " m/s²" + (P().drag ? "   drag k = " + P().k + " 1/m (dashed = no-drag parabola)" : ""), box.x + 8, box.y + 14, { color: C.text });
      }
      safeLoop(api, (dt) => {
        if (!flying.length) return true;
        flying.forEach((s) => step(s, dt * s.warp));
        const still = []; flying.forEach((s) => { if (s.done) landed(s); else still.push(s); }); flying = still;
        fit(); draw(); readouts(); return true;
      });
      api.onParam(refresh); api.onResize(draw);
      api.setStatus("Adjust speed/angle, then Launch. Trails persist for comparison.");
      newTarget(); launch();
      return { launch, newTarget, clear() { shots = []; flying = []; lastShot = null; refresh(); }, destroy() {} };
    },
  });

  /* ════════════════════════════ pendulum ════════════════════════════ */
  S.register({
    id: "pendulum", name: "Nonlinear Pendulum", domains: ["physics"],
    description: "θ̈ = −(g/L)·sin θ − b·θ̇ integrated with RK4 — no small-angle approximation. Drag the bob to set the release angle; a ghost bob follows the small-angle solution.",
    params: [
      { key: "L", label: "Length L (m)", type: "range", min: 0.2, max: 5, step: 0.1, value: 1.5 },
      { key: "g", label: "Gravity g (m/s²)", type: "range", min: 1, max: 25, step: 0.01, value: 9.81 },
      { key: "theta0", label: "Release angle θ₀ (°)", type: "range", min: 1, max: 179, step: 1, value: 60 },
      { key: "b", label: "Damping b (1/s)", type: "range", min: 0, max: 2, step: 0.01, value: 0 },
      { key: "m", label: "Bob mass m (kg)", type: "range", min: 0.1, max: 5, step: 0.1, value: 1 },
      { key: "ghost", label: "Show small-angle ghost", type: "toggle", value: true },
    ],
    actions: [{ label: "Release", fn: (h) => h.release() }, { label: "Pause / resume", fn: (h) => h.toggle() }],
    challenges: [
      { id: "period_amplitude", text: "Measure the period at θ₀ ≤ 15° and again at θ₀ ≥ 150°. How far off is 2π√(L/g) for the big swing?", xp: 15 },
      { id: "length_double", text: "Double the length (1 m → 2 m): by what factor does the period change? Why √2?", xp: 10 },
      { id: "measure_g", text: "Run it as a lab: from L and your measured small-angle period, compute g and compare with the slider.", xp: 20 },
      { id: "damped", text: "Add damping: as the amplitude decays, does the period drift? In which direction and why?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      let th = 0, om = 0, t = 0, tg = 0, th0 = 0, running = true, dragging = false, suppress = false;
      let measured = NaN, lastCross = NaN, maxAbs = 0, sawBig = false, sawSmall = false, Emax = 1;
      const rhs = (tt, s) => [s[1], -(P().g / P().L) * Math.sin(s[0]) - P().b * s[1]];
      const T0 = () => TAU * Math.sqrt(P().L / P().g);
      function exactT(a0) { // T = 4√(L/g)·K(k), K via the arithmetic–geometric mean
        const k = Math.sin(a0 / 2); let a = 1, b = Math.sqrt(Math.max(1e-300, 1 - k * k));
        for (let i = 0; i < 40 && Math.abs(a - b) > 1e-13; i++) { const an = (a + b) / 2; b = Math.sqrt(a * b); a = an; }
        return T0() / a;
      }
      function ghostAngle(tt) { // exact small-angle solution with θ(0)=θ₀, θ̇(0)=0 (under/critically/over-damped)
        const w0 = Math.sqrt(P().g / P().L), hh = P().b / 2, d = hh * hh - w0 * w0, e = Math.exp(-hh * tt);
        if (d < -1e-12) { const w = Math.sqrt(-d); return th0 * e * (Math.cos(w * tt) + (hh / w) * Math.sin(w * tt)); }
        if (d > 1e-12) { const s = Math.sqrt(d); return (th0 / 2) * ((1 + hh / s) * Math.exp((s - hh) * tt) + (1 - hh / s) * Math.exp(-(s + hh) * tt)); }
        return th0 * e * (1 + hh * tt);
      }
      function release(angle) {
        th = angle == null ? P().theta0 * DEG : angle; th0 = th; om = 0; t = 0; tg = 0; measured = NaN; lastCross = NaN; maxAbs = Math.abs(th); running = true;
        Emax = Math.max(1e-9, P().m * P().g * P().L * (1 - Math.cos(th)));
      }
      function geom() { const W = cv.width, H = cv.height, L = P().L, px = W * 0.36, py = 34, sc = ((H - 70) * 0.95) / Math.max(2.4, L); return { W, H, px, py, sc, bx: px + L * sc * Math.sin(th), by: py + L * sc * Math.cos(th) }; }
      const tick = every(0.15);
      function readouts() {
        const L = P().L, g = P().g, m = P().m, KE = 0.5 * m * L * L * om * om, PE = m * g * L * (1 - Math.cos(th)), Te = exactT(P().theta0 * DEG);
        api.readout({ "Measured period": isFinite(measured) ? unit(measured, "s", 3) : "… (needs two upward crossings)", "Small-angle T₀ = 2π√(L/g)": unit(T0(), "s", 3), "Exact T(θ₀) via elliptic K": unit(Te, "s", 3), "T(θ₀)/T₀": fmt(Te / T0(), 4), "θ": unit(th / DEG, "°", 1), "ω": unit(om, "rad/s", 2), "Energy KE + PE": unit(KE + PE, "J", 3) });
      }
      function draw() {
        const g = geom(), { W, H, px, py, sc } = g; clear(ctx, W, H, C);
        const L = P().L, m = P().m, G = P().g;
        ctx.fillStyle = C.muted; ctx.fillRect(px - 50, py - 8, 100, 5);
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + L * sc + 24); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(px, py, 30, Math.PI / 2, Math.PI / 2 - th, th > 0); ctx.stroke();
        text(ctx, "θ = " + fmt(th / DEG, 1) + "°", px + 36, py + 44, { color: C.accent, size: 10 });
        if (P().ghost) {
          const a = ghostAngle(tg), gx = px + L * sc * Math.sin(a), gy = py + L * sc * Math.cos(a);
          ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(gx, gy); ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.arc(gx, gy, 10, 0, TAU); ctx.fill();
          text(ctx, "ghost = small-angle solution", 10, 30, { color: C.muted, size: 10 });
        }
        ctx.strokeStyle = C.text; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(g.bx, g.by); ctx.stroke();
        ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(g.bx, g.by, 8 + 4 * Math.cbrt(m), 0, TAU); ctx.fill();
        const vt = L * om; arrow(ctx, g.bx, g.by, g.bx + Math.cos(th) * vt * 12, g.by - Math.sin(th) * vt * 12, C.ok, 2);
        const KE = 0.5 * m * L * L * om * om, PE = m * G * L * (1 - Math.cos(th)); Emax = Math.max(Emax, KE + PE);
        text(ctx, "Energy (J)", W * 0.85, 22, { color: C.text, align: "center", bold: true });
        bars(ctx, C, W * 0.74, 34, W * 0.22, H * 0.55, [{ label: "KE", value: KE, color: C.ok, text: fmt(KE, 2) }, { label: "PE", value: PE, color: C.secondary, text: fmt(PE, 2) }, { label: "total", value: KE + PE, color: C.accent, text: fmt(KE + PE, 2) }], Emax);
        text(ctx, "drag the bob to set θ₀ · t = " + fmt(t, 1) + " s", 10, 16, { color: C.muted, size: 10 });
        text(ctx, "L = " + L + " m   g = " + G + " m/s²   b = " + P().b + " 1/s" + (running ? "" : "   ⏸ paused"), 10, H - 10, { color: C.muted, size: 10 });
      }
      api.pointer(cv.canvas, {
        down(p) { const g = geom(); if (Math.hypot(p.x - g.bx, p.y - g.by) < 30) { dragging = true; running = false; } },
        move(p) { if (!dragging) return; const g = geom(); th = Math.atan2(p.x - g.px, p.y - g.py); om = 0; draw(); },
        up() {
          if (!dragging) return; dragging = false;
          const deg = clamp(Math.round(Math.abs(th) / DEG), 1, 179);
          suppress = true; api.setParam("theta0", deg); suppress = false;
          release(Math.sign(th || 1) * deg * DEG);
        },
      });
      safeLoop(api, (dt) => {
        if (running && !dragging) {
          const n = 8, h = dt / n;
          for (let i = 0; i < n; i++) {
            const prev = th, s = rk4(rhs, [th, om], t, h); th = s[0]; om = s[1]; t += h; tg += h;
            maxAbs = Math.max(maxAbs, Math.abs(th));
            if (prev < 0 && th >= 0) {
              const tc = t - (h * th) / Math.max(1e-12, th - prev);
              if (isFinite(lastCross)) {
                measured = tc - lastCross;
                if (maxAbs >= 150 * DEG) sawBig = true; if (maxAbs <= 15 * DEG) sawSmall = true;
                if (sawBig && sawSmall) api.award("period_amplitude");
              }
              lastCross = tc; maxAbs = 0;
            }
          }
        }
        draw(); if (tick(dt)) readouts(); return true;
      });
      api.onParam((k) => { if (suppress) return; if (k === "theta0") release(); else if (k === "L" || k === "g") { measured = NaN; lastCross = NaN; } draw(); readouts(); });
      api.onResize(draw);
      api.setStatus("Period is measured between successive upward crossings of θ = 0.");
      release(); draw(); readouts();
      return { release() { release(); }, toggle() { running = !running; }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ spring_mass ════════════════════════════ */
  S.register({
    id: "spring_mass", name: "Driven Spring–Mass Oscillator", domains: ["physics"],
    description: "m·ẍ = −k·x − c·ẋ + F₀·cos(2πf_d·t). Natural frequency, damping ratio, resonance and phase lag with a live x(t) trace and the resonance curve.",
    params: [
      { key: "k", label: "Spring constant k (N/m)", type: "range", min: 1, max: 200, step: 1, value: 20 },
      { key: "m", label: "Mass m (kg)", type: "range", min: 0.1, max: 10, step: 0.1, value: 1 },
      { key: "c", label: "Damping c (N·s/m)", type: "range", min: 0, max: 10, step: 0.05, value: 0.4 },
      { key: "driven", label: "Periodic driving force", type: "toggle", value: true },
      { key: "F0", label: "Drive amplitude F₀ (N)", type: "range", min: 0, max: 20, step: 0.5, value: 4 },
      { key: "fd", label: "Drive frequency f_d (Hz)", type: "range", min: 0, max: 3, step: 0.01, value: 0.5 },
      { key: "x0", label: "Initial displacement x₀ (m)", type: "range", min: -1, max: 1, step: 0.05, value: 0.5 },
    ],
    actions: [{ label: "Restart", fn: (h) => h.restart() }, { label: "Pause / resume", fn: (h) => h.toggle() }],
    challenges: [
      { id: "find_resonance", text: "Tune f_d to the natural frequency f₀ = √(k/m)/2π and hold it there: watch the amplitude grow.", xp: 15 },
      { id: "critical_damping", text: "Turn driving off and set c so that ζ = c/(2√(km)) = 1: the mass returns with no overshoot.", xp: 15 },
      { id: "phase_lag", text: "Drive far above resonance (f_d > 2f₀): the mass moves opposite to the force — phase lag → 180°.", xp: 10 },
      { id: "quality", text: "Lower c and watch the resonance curve: how do peak height and width relate to Q = √(km)/c?", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      let x = 0, v = 0, t = 0, running = true, hist = [], timers = { res: 0, crit: 0, lag: 0 };
      const force = (tt) => (P().driven ? P().F0 * Math.cos(TAU * P().fd * tt) : 0);
      const rhs = (tt, s) => [s[1], (-P().k * s[0] - P().c * s[1] + force(tt)) / P().m];
      const ampAt = (f) => { const w = TAU * f, k = P().k, m = P().m, c = P().c; return P().F0 / Math.max(1e-9, Math.sqrt((k - m * w * w) ** 2 + (c * w) ** 2)); };
      const derived = () => { const k = P().k, m = P().m, c = P().c, w = TAU * P().fd; return { f0: Math.sqrt(k / m) / TAU, zeta: c / (2 * Math.sqrt(k * m)), Q: Math.sqrt(k * m) / Math.max(c, 1e-9), A: ampAt(P().fd), phi: Math.atan2(c * w, k - m * w * w) }; };
      function restart() { x = P().x0; v = 0; t = 0; hist = []; running = true; timers = { res: 0, crit: 0, lag: 0 }; }
      const tick = every(0.15);
      function readouts() {
        const d = derived();
        api.readout({ "Natural frequency f₀": unit(d.f0, "Hz", 3), "Damping ratio ζ": fmt(d.zeta, 3) + (d.zeta < 0.98 ? " (under-damped)" : d.zeta > 1.02 ? " (over-damped)" : " (critical)"), "Quality factor Q": fmt(d.Q, 1), "Steady-state amplitude": P().driven ? unit(d.A, "m", 3) : "— (free)", "Phase lag φ": P().driven ? unit(d.phi / DEG, "°", 0) : "—", "x(t)": unit(x, "m", 3), "Energy ½kx² + ½mv²": unit(0.5 * P().k * x * x + 0.5 * P().m * v * v, "J", 3) });
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const d = derived(), topW = W * 0.62, topH = H * 0.42, wallX = 24, eqX = topW * 0.5, yC = topH * 0.55, scale = topW * 0.22;
        const mx = eqX + clamp(x, -2, 2) * scale;
        ctx.fillStyle = C.muted; ctx.fillRect(wallX - 6, yC - 44, 6, 88);
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(eqX, yC - 50); ctx.lineTo(eqX, yC + 50); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "x = 0", eqX, yC + 62, { color: C.muted, align: "center", size: 10 });
        const coils = 14, sx1 = mx - 20; ctx.strokeStyle = C.primary; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wallX, yC);
        for (let i = 1; i < coils * 2; i++) ctx.lineTo(wallX + ((sx1 - wallX) * i) / (coils * 2), yC + (i % 2 ? 10 : -10));
        ctx.lineTo(sx1, yC); ctx.stroke();
        ctx.fillStyle = C.accent; ctx.fillRect(mx - 20, yC - 20, 40, 40); text(ctx, P().m + " kg", mx, yC + 4, { color: "#0f1222", align: "center", size: 10, bold: true });
        const F = force(t); if (P().driven && Math.abs(F) > 0.05) arrow(ctx, mx, yC - 30, mx + clamp(F * 6, -120, 120), yC - 30, C.secondary, 2.5);
        text(ctx, (P().driven ? "pink arrow = drive force F(t)" : "free oscillation") + (running ? "" : "   ⏸ paused"), 8, 14, { color: C.muted, size: 10 });
        let peak = 1e-6; for (let f = 0; f <= 3; f += 0.01) peak = Math.max(peak, ampAt(f)); peak = Math.min(peak, 50);
        const rp = makePlot(ctx, C, { x: W * 0.69, y: 16, w: W * 0.28, h: H * 0.32 }, { xmin: 0, xmax: 3, ymin: 0, ymax: peak * 1.05 });
        rp.frame("drive frequency (Hz)", "A (m)", { ny: 3 });
        rp.curve((f) => ampAt(f), C.ok, 2, 240); rp.vline(d.f0, C.muted); if (P().driven) rp.dot(P().fd, d.A, 4, C.secondary);
        text(ctx, "resonance curve A(f_d)", rp.box.x + 4, rp.box.y - 4, { color: C.muted, size: 10 });
        const tmax = Math.max(20, t), tmin = tmax - 20; let ymax = 0.1; for (const p of hist) ymax = Math.max(ymax, Math.abs(p[1]));
        const bp = makePlot(ctx, C, { x: 46, y: H * 0.52, w: W - 60, h: H * 0.38 }, { xmin: tmin, xmax: tmax, ymin: -ymax * 1.1, ymax: ymax * 1.1 });
        bp.frame("time (s)", "x (m)");
        if (P().driven && P().F0 > 0) bp.line(hist.map((p) => [p[0], (p[2] / P().F0) * ymax * 0.5]), C.secondary, 1, [3, 3]);
        bp.line(hist, C.primary, 2);
        bp.legend([["x(t)", C.primary], ["F(t), scaled", C.secondary]], bp.box.x + bp.box.w - 100);
      }
      safeLoop(api, (dt) => {
        if (running) {
          const n = 16, h = dt / n;
          for (let i = 0; i < n; i++) { const s = rk4(rhs, [x, v], t, h); x = s[0]; v = s[1]; t += h; }
          if (!isFinite(x) || Math.abs(x) > 1e6) { x = P().x0; v = 0; }
          hist.push([t, x, force(t)]); if (hist.length > 1500) hist.shift();
          const d = derived(), drv = P().driven && P().F0 > 0;
          timers.res = drv && Math.abs(P().fd - d.f0) < 0.02 + 0.03 * d.f0 ? timers.res + dt : 0; if (timers.res > 3) api.award("find_resonance");
          timers.crit = !P().driven && Math.abs(d.zeta - 1) < 0.05 ? timers.crit + dt : 0; if (timers.crit > 1) api.award("critical_damping");
          timers.lag = drv && P().fd > 2 * d.f0 ? timers.lag + dt : 0; if (timers.lag > 3) api.award("phase_lag");
        }
        draw(); if (tick(dt)) readouts(); return true;
      });
      api.onParam((k) => { if (k === "x0") restart(); readouts(); }); api.onResize(draw);
      api.setStatus("Steady-state amplitude A = F₀ / √((k − mω²)² + (cω)²), ω = 2πf_d.");
      restart(); readouts();
      return { restart, toggle() { running = !running; }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ collisions ════════════════════════════ */
  S.register({
    id: "collisions", name: "Collision Carts", domains: ["physics"],
    description: "Two carts on a frictionless track. Set masses, velocities and the coefficient of restitution e, then compare momentum and kinetic energy before and after the collision.",
    params: [
      { key: "m1", label: "Mass m₁ (kg)", type: "range", min: 0.1, max: 10, step: 0.1, value: 2 },
      { key: "v1", label: "Velocity v₁ (m/s)", type: "range", min: -5, max: 5, step: 0.1, value: 3 },
      { key: "m2", label: "Mass m₂ (kg)", type: "range", min: 0.1, max: 10, step: 0.1, value: 1 },
      { key: "v2", label: "Velocity v₂ (m/s)", type: "range", min: -5, max: 5, step: 0.1, value: -1 },
      { key: "e", label: "Restitution e (0 = sticky … 1 = elastic)", type: "range", min: 0, max: 1, step: 0.05, value: 1 },
      { key: "walls", label: "Bouncy walls at the track ends", type: "toggle", value: true },
    ],
    actions: [{ label: "Run", fn: (h) => h.run() }, { label: "Pause / resume", fn: (h) => h.toggle() }],
    challenges: [
      { id: "elastic_equal", text: "Equal masses, e = 1, one cart at rest: the carts swap velocities.", xp: 10 },
      { id: "perfectly_inelastic", text: "Set e = 0: the carts stick together. How much KE is lost, and where does it go?", xp: 15 },
      { id: "heavy_wall", text: "Make the target cart ≥ 8× heavier and at rest: the light cart rebounds at almost its incoming speed.", xp: 15 },
      { id: "ke_vs_p", text: "Verify: momentum is conserved for every e, kinetic energy only when e = 1.", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params, TRACK = 10;
      let st = null, running = true, rec = null;
      const width = (m) => 0.5 + 0.3 * Math.cbrt(m);
      const pk = (s) => ({ p: s.m1 * s.u1 + s.m2 * s.u2, K: 0.5 * s.m1 * s.u1 ** 2 + 0.5 * s.m2 * s.u2 ** 2, rel: Math.abs(s.u1 - s.u2) });
      function run() { st = { x1: 2.5, x2: 7.5, u1: P().v1, u2: P().v2, m1: P().m1, m2: P().m2, e: P().e, t: 0, hits: 0 }; rec = null; running = true; api.setStatus("Running… (carts collide when they touch)"); }
      function collide(s) {
        const before = pk(s), M = s.m1 + s.m2, init = { u1: s.u1, u2: s.u2 };
        const u1 = (before.p + s.m2 * s.e * (s.u2 - s.u1)) / M, u2 = (before.p + s.m1 * s.e * (s.u1 - s.u2)) / M;
        s.u1 = u1; s.u2 = u2; s.hits++;
        const after = pk(s);
        if (rec) return;
        rec = { before, after };
        if (Math.abs(s.m1 - s.m2) < 1e-9 && s.e >= 0.999 && (Math.abs(init.u1) < 1e-9 || Math.abs(init.u2) < 1e-9)) api.award("elastic_equal");
        if (s.e === 0) api.award("perfectly_inelastic");
        if (s.e >= 0.9 && ((s.m2 / s.m1 >= 8 && Math.abs(init.u2) < 1e-9) || (s.m1 / s.m2 >= 8 && Math.abs(init.u1) < 1e-9))) api.award("heavy_wall");
        api.setStatus("Collision! Δp = " + fmt(after.p - before.p, 3) + " kg·m/s,  ΔKE = " + fmt(after.K - before.K, 3) + " J");
      }
      function step(dt) {
        const s = st, w1 = width(s.m1), w2 = width(s.m2), n = 4, h = dt / n;
        for (let i = 0; i < n; i++) {
          s.x1 += s.u1 * h; s.x2 += s.u2 * h; s.t += h;
          const gap = s.x2 - s.x1 - (w1 + w2) / 2;
          if (gap <= 0 && s.u1 - s.u2 > 1e-9) { collide(s); s.x1 += gap / 2; s.x2 -= gap / 2; }
          if (P().walls) {
            if (s.x1 - w1 / 2 < 0 && s.u1 < 0) { s.u1 = -s.u1; s.x1 = w1 / 2; }
            if (s.x2 + w2 / 2 > TRACK && s.u2 > 0) { s.u2 = -s.u2; s.x2 = TRACK - w2 / 2; }
          }
        }
        if (!P().walls && (s.x1 < -3 || s.x1 > TRACK + 3) && (s.x2 < -3 || s.x2 > TRACK + 3)) { running = false; api.setStatus("Both carts left the track — press Run to repeat."); }
      }
      function hbars(x, y, w, h, title, rows) {
        text(ctx, title, x, y - 4, { color: C.text, bold: true });
        let mx = 1e-9; rows.forEach((r) => { mx = Math.max(mx, Math.abs(r[1])); });
        const zero = x + w / 2, rh = h / rows.length;
        ctx.strokeStyle = C.axis; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(zero, y); ctx.lineTo(zero, y + h); ctx.stroke();
        rows.forEach((r, i) => { const len = (r[1] / mx) * (w / 2 - 4); ctx.fillStyle = r[2]; ctx.fillRect(Math.min(zero, zero + len), y + i * rh + rh * 0.25, Math.abs(len), rh * 0.5); text(ctx, r[0] + ": " + fmt(r[1], 2), x, y + i * rh + rh * 0.6, { color: C.muted, size: 10 }); });
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const s = st, sc = (W - 40) / TRACK, X = (v) => 20 + v * sc, yT = H * 0.4, hC = 40;
        ctx.fillStyle = C.axis; ctx.fillRect(X(0), yT, X(TRACK) - X(0), 3);
        if (P().walls) { ctx.fillStyle = C.muted; ctx.fillRect(X(0) - 6, yT - 62, 6, 65); ctx.fillRect(X(TRACK), yT - 62, 6, 65); }
        for (let i = 0; i <= TRACK; i += 2) text(ctx, i + " m", X(i), yT + 16, { color: C.muted, align: "center", size: 10 });
        const cart = (xc, m, u, color, label) => {
          const w = width(m) * sc, cx = X(xc);
          ctx.fillStyle = color; ctx.fillRect(cx - w / 2, yT - hC, w, hC);
          ctx.fillStyle = "#0f1222"; ctx.beginPath(); ctx.arc(cx - w / 4, yT - 1, 5, 0, TAU); ctx.arc(cx + w / 4, yT - 1, 5, 0, TAU); ctx.fill();
          text(ctx, label + " " + m + " kg", cx, yT - hC / 2 + 4, { color: "#0f1222", align: "center", size: 10, bold: true });
          if (Math.abs(u) > 0.01) arrow(ctx, cx, yT - hC - 16, cx + u * 18, yT - hC - 16, color, 2.5);
          text(ctx, fmt(u, 2) + " m/s", cx, yT - hC - 24, { color, align: "center", size: 10 });
        };
        cart(s.x1, s.m1, s.u1, C.primary, "m₁"); cart(s.x2, s.m2, s.u2, C.secondary, "m₂");
        const xcm = (s.m1 * s.x1 + s.m2 * s.x2) / (s.m1 + s.m2);
        ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(X(xcm), yT + 4); ctx.lineTo(X(xcm) - 6, yT + 14); ctx.lineTo(X(xcm) + 6, yT + 14); ctx.fill();
        text(ctx, "CM", X(xcm), yT + 26, { color: C.accent, align: "center", size: 10 });
        const now = pk(s), b = rec ? rec.before : now, a = rec ? rec.after : now, by = H * 0.62, bh = H * 0.28, bw = (W - 80) / 2;
        hbars(40, by, bw - 20, bh, "Momentum (kg·m/s)", [["before", b.p, C.primary], ["after", a.p, C.ok]]);
        hbars(60 + bw, by, bw - 20, bh, "Kinetic energy (J)", [["before", b.K, C.primary], ["after", a.K, C.ok]]);
        if (!rec) text(ctx, "waiting for the carts to collide…", W / 2, by - 18, { color: C.muted, align: "center", size: 10 });
        text(ctx, "e = " + s.e + "   t = " + fmt(s.t, 1) + " s" + (running ? "" : "   ⏸"), 10, 16, { color: C.muted, size: 10 });
      }
      const tick = every(0.15);
      function readouts() {
        const s = st, now = pk(s), r = { "v_CM (never changes)": unit((s.m1 * s.u1 + s.m2 * s.u2) / (s.m1 + s.m2), "m/s", 3), "Momentum now": unit(now.p, "kg·m/s", 3), "KE now": unit(now.K, "J", 3), "Collisions": String(s.hits) };
        if (rec) { r["p before → after"] = fmt(rec.before.p, 3) + " → " + fmt(rec.after.p, 3); r["KE before → after"] = fmt(rec.before.K, 3) + " → " + fmt(rec.after.K, 3) + " J"; r["KE lost"] = unit(100 * (1 - rec.after.K / Math.max(1e-12, rec.before.K)), "%", 1); r["Measured e = |Δv′|/|Δv|"] = fmt(rec.after.rel / Math.max(1e-12, rec.before.rel), 3); }
        api.readout(r);
      }
      api.html("<small>v₁′ = (m₁v₁ + m₂v₂ + m₂e(v₂ − v₁))/(m₁ + m₂), v₂′ = (m₁v₁ + m₂v₂ + m₁e(v₁ − v₂))/(m₁ + m₂). Wall bounces are elastic; the before/after readouts refer to the first cart–cart collision.</small>");
      safeLoop(api, (dt) => { if (running && st) step(dt); draw(); if (tick(dt)) readouts(); return true; });
      api.onParam((k) => { if (k !== "walls") run(); draw(); readouts(); }); api.onResize(draw);
      run(); draw(); readouts();
      return { run, toggle() { running = !running; }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ orbit ════════════════════════════ */
  const GM_E = 3.986004418e14, R_E = 6.371e6;
  S.register({
    id: "orbit", name: "Orbit Designer", domains: ["physics"],
    description: "A satellite around Earth integrated with velocity-Verlet (symplectic). Explore circular, elliptical and escape trajectories, Kepler's laws and orbital energy.",
    params: [
      { key: "r0", label: "Start distance from Earth's centre (×1000 km)", type: "range", min: 6.6, max: 60, step: 0.1, value: 10 },
      { key: "v0", label: "Start speed, tangential (km/s)", type: "range", min: 0.5, max: 12, step: 0.05, value: 7.5 },
      { key: "warp", label: "Time warp (simulated s per real s)", type: "range", min: 100, max: 6000, step: 100, value: 1500 },
      { key: "sweep", label: "Shade equal-time swept areas (Kepler II)", type: "toggle", value: true },
    ],
    actions: [{ label: "Restart", fn: (h) => h.restart() }, { label: "Set circular speed", fn: (h) => h.circular() }, { label: "Pause / resume", fn: (h) => h.toggle() }],
    challenges: [
      { id: "circular", text: "Find the speed that makes the orbit circular (e < 0.02) at your chosen distance. Compare with √(GM/r).", xp: 15 },
      { id: "escape", text: "Raise the speed until the satellite escapes. Compare the threshold with √(2GM/r) = √2 × circular speed.", xp: 20 },
      { id: "kepler3", text: "Complete a lap on two orbits with different semi-major axes: check that T²/a³ stays constant.", xp: 15 },
      { id: "kepler2", text: "On an eccentric orbit compare the two shaded sweeps: equal areas in equal times — where is the satellite fastest?", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      let s = null, running = true, laps = [];
      function restart() {
        const r = P().r0 * 1e6, v = P().v0 * 1e3;
        s = { x: r, y: 0, vx: 0, vy: v, t: 0, trail: [], rmax: r, phi: 0, lastAng: 0, lapStart: 0, Tmeas: NaN, crashed: false, escaped: false, sweep0: null, sweepNow: [], r0: r };
        running = true; api.setStatus("Orbiting… Restart applies a new r₀ / v₀.");
      }
      function circular() { api.setParam("v0", Math.round(Math.sqrt(GM_E / (P().r0 * 1e6)) / 10) / 100); }
      function elements() {
        const r = Math.hypot(s.x, s.y), v2 = s.vx * s.vx + s.vy * s.vy, eps = v2 / 2 - GM_E / r, a = -GM_E / (2 * eps), rv = s.x * s.vx + s.y * s.vy;
        const ex = ((v2 - GM_E / r) * s.x - rv * s.vx) / GM_E, ey = ((v2 - GM_E / r) * s.y - rv * s.vy) / GM_E, e = Math.hypot(ex, ey), bound = eps < 0;
        return { r, v: Math.sqrt(v2), eps, a, e, bound, T: bound ? TAU * Math.sqrt(a ** 3 / GM_E) : NaN, rp: bound ? a * (1 - e) : r, ra: bound ? a * (1 + e) : Infinity };
      }
      const sector = (pts) => { let A = 0; for (let i = 1; i < pts.length; i++) A += pts[i - 1][0] * pts[i][1] - pts[i][0] * pts[i - 1][1]; return Math.abs(A) / 2; };
      function integrate(dt) {
        const e0 = elements(), h = clamp(0.003 * TAU * Math.sqrt(Math.min(e0.r, 1e9) ** 3 / GM_E), 0.5, 120), n = Math.min(3000, Math.ceil((dt * P().warp) / h));
        const win = isFinite(e0.T) ? e0.T / 10 : 3600;
        for (let i = 0; i < n; i++) {
          let r = Math.hypot(s.x, s.y); const ax = (-GM_E * s.x) / r ** 3, ay = (-GM_E * s.y) / r ** 3;
          s.x += s.vx * h + 0.5 * ax * h * h; s.y += s.vy * h + 0.5 * ay * h * h;
          r = Math.hypot(s.x, s.y); const bx = (-GM_E * s.x) / r ** 3, by = (-GM_E * s.y) / r ** 3;
          s.vx += 0.5 * (ax + bx) * h; s.vy += 0.5 * (ay + by) * h; s.t += h;
          if (r < R_E) { s.crashed = true; running = false; api.setStatus("💥 Impact after " + fmt(s.t / 60, 1) + " min — more speed needed to clear the planet."); break; }
          const ang = Math.atan2(s.y, s.x); let d = ang - s.lastAng; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; s.phi += d; s.lastAng = ang;
          if (s.phi >= TAU) { s.Tmeas = s.t - s.lapStart; s.lapStart = s.t; s.phi -= TAU; laps.push({ a: elements().a, T: s.Tmeas }); if (laps.some((L) => Math.abs(L.a - laps[laps.length - 1].a) / L.a > 0.3)) api.award("kepler3"); }
          s.rmax = Math.max(s.rmax, r);
        }
        s.trail.push([s.x, s.y, s.t]); if (s.trail.length > 2500) s.trail.shift();
        if (!s.sweep0 && s.t >= win) s.sweep0 = s.trail.filter((p) => p[2] <= win);
        s.sweepNow = s.trail.filter((p) => p[2] >= s.t - win);
        const e = elements();
        if (!e.bound && e.r > 3 * s.r0) { if (!s.escaped) { api.award("escape"); api.setStatus("🚀 Escaped: ε = v²/2 − GM/r ≥ 0, the trajectory is a hyperbola/parabola."); } s.escaped = true; }
        if (e.bound && e.e < 0.02 && s.t > e.T * 0.5) api.award("circular");
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const e = elements(), fitR = Math.max(s.rmax, s.r0, e.bound && e.ra < 50 * s.r0 ? e.ra : 0) * 1.12, sc = Math.min(W, H) / 2 / fitR, cx = W / 2, cy = H / 2;
        const X = (x) => cx + x * sc, Y = (y) => cy - y * sc, ring = niceStep(fitR, 3);
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.setLineDash([]);
        for (let r = ring; r <= fitR * 1.6; r += ring) { ctx.beginPath(); ctx.arc(cx, cy, r * sc, 0, TAU); ctx.stroke(); text(ctx, fmt(r / 1e6, 0) + "k km", cx + r * sc * 0.72 + 2, cy - r * sc * 0.7, { color: C.muted, size: 9 }); }
        if (P().sweep) { const poly = (pts, col) => { if (!pts || pts.length < 2) return; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx, cy); pts.forEach((p) => ctx.lineTo(X(p[0]), Y(p[1]))); ctx.closePath(); ctx.fill(); }; poly(s.sweep0, "rgba(255,209,102,0.28)"); poly(s.sweepNow, "rgba(110,231,183,0.28)"); }
        ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(cx, cy, Math.max(3, R_E * sc), 0, TAU); ctx.fill();
        ctx.strokeStyle = C.primary; ctx.lineWidth = 1.5; ctx.beginPath(); s.trail.forEach((p, i) => { if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); }); ctx.stroke();
        if (e.bound && e.e > 0.01 && e.e < 1) { // apsides along the eccentricity vector direction
          const v2 = e.v * e.v, rv = s.x * s.vx + s.y * s.vy, ex = ((v2 - GM_E / e.r) * s.x - rv * s.vx) / GM_E / e.e, ey = ((v2 - GM_E / e.r) * s.y - rv * s.vy) / GM_E / e.e;
          ctx.fillStyle = C.secondary; ctx.beginPath(); ctx.arc(X(ex * e.rp), Y(ey * e.rp), 3, 0, TAU); ctx.arc(X(-ex * e.ra), Y(-ey * e.ra), 3, 0, TAU); ctx.fill();
          text(ctx, "perigee", X(ex * e.rp) + 5, Y(ey * e.rp) - 5, { color: C.secondary, size: 9 }); text(ctx, "apogee", X(-ex * e.ra) + 5, Y(-ey * e.ra) - 5, { color: C.secondary, size: 9 });
        }
        const sx = X(s.x), sy = Y(s.y); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(sx, sy, 5, 0, TAU); ctx.fill();
        arrow(ctx, sx, sy, sx + (s.vx / 1e3) * 6, sy - (s.vy / 1e3) * 6, C.ok, 2);
        text(ctx, "t = " + fmt(s.t / 3600, 2) + " h   warp ×" + P().warp + (running ? "" : "   ⏸"), 10, 16, { color: C.text });
        text(ctx, e.bound ? (e.e < 0.02 ? "≈ circular orbit" : "elliptical orbit, e = " + fmt(e.e, 3)) : "unbound trajectory (ε ≥ 0)", 10, 32, { color: C.muted, size: 10 });
        if (P().sweep) text(ctx, "yellow = first Δt sweep, green = latest Δt sweep (Δt = T/10)", 10, H - 10, { color: C.muted, size: 10 });
        if (s.crashed) text(ctx, "IMPACT", cx, cy - 24, { color: C.danger, align: "center", size: 18, bold: true });
      }
      const tick = every(0.2);
      function readouts() {
        const e = elements(), km = (v) => unit(v / 1e3, "km", 0);
        const r = { "Altitude": km(e.r - R_E), "Speed": unit(e.v / 1e3, "km/s", 3), "Eccentricity e": fmt(e.e, 3), "Semi-major axis a": e.bound ? km(e.a) : "— (unbound)",
          "Period, Kepler III 2π√(a³/GM)": e.bound ? unit(e.T / 60, "min", 1) : "—", "Period, measured": isFinite(s.Tmeas) ? unit(s.Tmeas / 60, "min", 1) : "— (finish a lap)",
          "Perigee / apogee altitude": e.bound ? fmt((e.rp - R_E) / 1e3, 0) + " / " + fmt((e.ra - R_E) / 1e3, 0) + " km" : fmt((e.rp - R_E) / 1e3, 0) + " km / ∞",
          "Circular / escape speed here": fmt(Math.sqrt(GM_E / e.r) / 1e3, 2) + " / " + fmt(Math.sqrt((2 * GM_E) / e.r) / 1e3, 2) + " km/s",
          "Specific energy ε": unit(e.eps / 1e6, "MJ/kg", 3), "T²/a³ vs 4π²/GM": e.bound ? fmt(e.T ** 2 / e.a ** 3, 3) + " vs " + fmt((4 * Math.PI ** 2) / GM_E, 3) + " s²/m³" : "—" };
        if (s.sweep0) r["Area swept, first / latest Δt"] = fmt(sector(s.sweep0) / 1e12, 2) + " / " + fmt(sector(s.sweepNow) / 1e12, 2) + " ×10⁶ km²";
        api.readout(r);
      }
      safeLoop(api, (dt) => { if (running) integrate(dt); draw(); if (tick(dt)) readouts(); return true; });
      api.onParam((k) => { if (k === "r0" || k === "v0") restart(); draw(); readouts(); }); api.onResize(draw);
      restart(); draw(); readouts();
      return { restart, circular, toggle() { if (!s.crashed) running = !running; }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ wave_superposition ════════════════════════════ */
  S.register({
    id: "wave_superposition", name: "Wave Superposition", domains: ["physics"],
    description: "Two sinusoidal waves and their sum. Same-direction waves show beats; counter-propagating waves build standing waves with nodes λ/2 apart. Click the canvas to move the probe.",
    params: [
      { key: "A1", label: "Amplitude A₁ (m)", type: "range", min: 0, max: 2, step: 0.1, value: 1 },
      { key: "f1", label: "Frequency f₁ (Hz)", type: "range", min: 0.2, max: 5, step: 0.05, value: 1 },
      { key: "A2", label: "Amplitude A₂ (m)", type: "range", min: 0, max: 2, step: 0.1, value: 1 },
      { key: "f2", label: "Frequency f₂ (Hz)", type: "range", min: 0.2, max: 5, step: 0.05, value: 1.2 },
      { key: "phi", label: "Phase of wave 2, φ (°)", type: "range", min: 0, max: 360, step: 5, value: 0 },
      { key: "v", label: "Wave speed v (m/s)", type: "range", min: 1, max: 10, step: 0.5, value: 4 },
      { key: "mode", label: "Directions", type: "select", value: "same", options: [{ value: "same", label: "Same direction (→ →)" }, { value: "counter", label: "Opposite directions (→ ←)" }] },
      { key: "parts", label: "Show component waves", type: "toggle", value: true },
    ],
    actions: [{ label: "Pause / resume", fn: (h) => h.toggle() }, { label: "Beats preset", fn: (h) => h.preset("beats") }, { label: "Standing-wave preset", fn: (h) => h.preset("standing") }],
    challenges: [
      { id: "beats", text: "Same direction, |f₁ − f₂| ≤ 0.3 Hz: count the beats at the probe — the beat frequency is |f₁ − f₂|.", xp: 15 },
      { id: "standing", text: "Opposite directions with equal A and f: find the nodes and compare their spacing with λ/2.", xp: 15 },
      { id: "cancel", text: "Same direction, equal A and f, φ = 180°: complete destructive interference.", xp: 10 },
      { id: "partial", text: "Opposite directions, unequal amplitudes: a partially standing wave. Relate envelope max/min to the SWR.", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params, LEN = 10;
      let t = 0, running = true, probeX = 5, probe = [], tBeat = 0, tStand = 0;
      const ph1 = (x, tt) => TAU * (P().f1 / P().v) * x - TAU * P().f1 * tt;
      const ph2 = (x, tt) => (P().mode === "counter" ? TAU * (P().f2 / P().v) * x + TAU * P().f2 * tt : TAU * (P().f2 / P().v) * x - TAU * P().f2 * tt) + P().phi * DEG;
      const w1 = (x, tt) => P().A1 * Math.sin(ph1(x, tt)), w2 = (x, tt) => P().A2 * Math.sin(ph2(x, tt));
      const env = (x, tt) => Math.sqrt(Math.max(0, P().A1 ** 2 + P().A2 ** 2 + 2 * P().A1 * P().A2 * Math.cos(ph1(x, tt) - ph2(x, tt))));
      function preset(kind) {
        const vals = kind === "beats" ? { mode: "same", f1: 1, f2: 1.1, A1: 1, A2: 1, phi: 0 } : { mode: "counter", f1: 1, f2: 1, A1: 1, A2: 1, phi: 0 };
        Object.keys(vals).forEach((k) => api.setParam(k, vals[k])); probe = [];
      }
      const sameF = () => Math.abs(P().f1 - P().f2) < 1e-9;
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const amp = Math.max(0.1, P().A1 + P().A2), parts = P().parts, rows = parts ? 3 : 1, rowH = (H * 0.66) / rows, left = 40, pw = W - 56;
        const panels = parts ? [["wave 1", (x) => w1(x, t), C.primary], ["wave 2", (x) => w2(x, t), C.secondary], ["sum y₁ + y₂", (x) => w1(x, t) + w2(x, t), C.accent]] : [["sum y₁ + y₂", (x) => w1(x, t) + w2(x, t), C.accent]];
        panels.forEach((pn, i) => {
          const pl = makePlot(ctx, C, { x: left, y: 8 + i * rowH, w: pw, h: rowH - 16 }, { xmin: 0, xmax: LEN, ymin: -amp * 1.05, ymax: amp * 1.05 });
          pl.frame(i === rows - 1 ? "x (m)" : "", "", { ny: 2, noXTicks: i !== rows - 1 });
          if (i === rows - 1 && P().mode === "counter" && sameF()) { // standing-wave envelope is time independent
            pl.curve((x) => env(x, 0), C.muted, 1, 200, [3, 3]); pl.curve((x) => -env(x, 0), C.muted, 1, 200, [3, 3]);
          }
          pl.curve(pn[1], pn[2], 2, 320);
          text(ctx, pn[0], left + 6, 8 + i * rowH + 12, { color: pn[2], size: 10, bold: true });
          pl.vline(probeX, C.ok, [2, 3]);
        });
        const tp = makePlot(ctx, C, { x: left, y: H * 0.71, w: pw, h: H * 0.22 }, { xmin: t - 10, xmax: t, ymin: -amp * 1.05, ymax: amp * 1.05 });
        tp.frame("time (s) — displacement at the probe, x = " + fmt(probeX, 2) + " m (click to move)", "", { ny: 2 });
        if (!sameF()) { tp.curve((tt) => env(probeX, tt), C.muted, 1, 200, [3, 3]); tp.curve((tt) => -env(probeX, tt), C.muted, 1, 200, [3, 3]); }
        tp.line(probe, C.ok, 1.5);
        if (!running) text(ctx, "⏸ paused", W - 60, 16, { color: C.muted, size: 10 });
      }
      const tick = every(0.2);
      function readouts() {
        const A1 = P().A1, A2 = P().A2, lam1 = P().v / P().f1, lam2 = P().v / P().f2, fb = Math.abs(P().f1 - P().f2);
        const r = { "λ₁ = v/f₁": unit(lam1, "m", 3), "λ₂ = v/f₂": unit(lam2, "m", 3), "Beat frequency |f₁ − f₂|": fb > 1e-9 ? unit(fb, "Hz", 3) + " (period " + fmt(1 / fb, 2) + " s)" : "0 — no beats" };
        if (sameF() && P().mode === "same") r["Resultant amplitude √(A₁²+A₂²+2A₁A₂cos φ)"] = unit(Math.sqrt(Math.max(0, A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(P().phi * DEG))), "m", 3);
        if (sameF() && P().mode === "counter") { r["Node spacing λ/2"] = unit(lam1 / 2, "m", 3); r["Envelope max / min"] = fmt(A1 + A2, 2) + " / " + fmt(Math.abs(A1 - A2), 2) + " m"; r["SWR (A₁+A₂)/|A₁−A₂|"] = Math.abs(A1 - A2) < 1e-9 ? "∞ (pure standing wave)" : fmt((A1 + A2) / Math.abs(A1 - A2), 2); }
        api.readout(r);
      }
      function checkAwards(dt) {
        const same = P().mode === "same", eqA = Math.abs(P().A1 - P().A2) < 1e-9 && P().A1 > 0, fb = Math.abs(P().f1 - P().f2);
        tBeat = same && fb > 1e-9 && fb <= 0.3 ? tBeat + dt : 0; if (tBeat > 4) api.award("beats");
        tStand = !same && eqA && sameF() ? tStand + dt : 0; if (tStand > 2) api.award("standing");
        if (same && eqA && sameF() && P().phi === 180) api.award("cancel");
      }
      api.pointer(cv.canvas, { down(p) { probeX = clamp(((p.x - 40) / (cv.width - 56)) * LEN, 0, LEN); probe = []; draw(); readouts(); } });
      safeLoop(api, (dt) => { if (running) { t += dt; probe.push([t, w1(probeX, t) + w2(probeX, t)]); if (probe.length > 900) probe.shift(); checkAwards(dt); } draw(); if (tick(dt)) readouts(); return true; });
      api.onParam(() => { probe = []; draw(); readouts(); }); api.onResize(draw);
      api.setStatus("y = A·sin(kx ∓ ωt + φ) with k = 2πf/v. Dashed = envelope.");
      draw(); readouts();
      return { preset, toggle() { running = !running; }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ electric_field ════════════════════════════ */
  S.register({
    id: "electric_field", name: "Electric Field & Potential", domains: ["physics"],
    description: "Click to place point charges (drag to move them). Field lines follow E = kΣq·r̂/r², equipotentials are contours of V = kΣq/r. Hover anywhere to read |E| and V.",
    params: [
      { key: "sign", label: "Next charge sign", type: "select", value: 1, options: [{ value: 1, label: "+ positive" }, { value: -1, label: "− negative" }] },
      { key: "q", label: "Next charge magnitude (nC)", type: "range", min: 0.5, max: 5, step: 0.5, value: 2 },
      { key: "show", label: "Field display", type: "select", value: "lines", options: [{ value: "lines", label: "Field lines" }, { value: "vectors", label: "Vector grid" }, { value: "both", label: "Lines + vectors" }] },
      { key: "equi", label: "Equipotential contours", type: "toggle", value: true },
    ],
    actions: [{ label: "Undo", fn: (h) => h.undo() }, { label: "Clear", fn: (h) => h.clear() }, { label: "Dipole preset", fn: (h) => h.preset("dipole") }, { label: "Two + charges", fn: (h) => h.preset("like") }],
    challenges: [
      { id: "dipole", text: "Build a dipole (equal and opposite charges). Why are the equipotentials perpendicular to the field lines everywhere?", xp: 15 },
      { id: "null_point", text: "Two like charges: hover to find the point where |E| ≈ 0. Where does it sit when the charges are unequal?", xp: 15 },
      { id: "unequal", text: "Place +2 nC and −1 nC: count the lines — how many leave the + charge without reaching the − charge, and where do they go?", xp: 20 },
      { id: "quadrupole", text: "Arrange + − + − on a square (a quadrupole). Hovering, compare how fast |E| falls with distance vs. a dipole.", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params, K = 8.9875517923e9, WORLD = 2.0;
      let charges = [{ x: 1.0, y: 0.56, q: 2e-9 }], dragIdx = -1, hover = null, quick = false, lastRO = 0;
      const scale = () => cv.width / WORLD, toPx = (m) => m * scale(), toM = (p) => p / scale();
      function field(x, y) {
        let ex = 0, ey = 0, V = 0;
        for (const c of charges) { const dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy + 1e-6, r = Math.sqrt(r2), f = (K * c.q) / (r2 * r); ex += f * dx; ey += f * dy; V += (K * c.q) / r; }
        return { ex, ey, V, E: Math.hypot(ex, ey) };
      }
      function traceLine(x, y, dir) {
        const pts = [[x, y]], ds = 2.5 / scale(), maxY = toM(cv.height); let end = null;
        for (let i = 0; i < 1500; i++) {
          let f = field(x, y); if (f.E < 1e-9) break;
          const mx = x + (dir * f.ex * ds) / (2 * f.E), my = y + (dir * f.ey * ds) / (2 * f.E);
          f = field(mx, my); if (f.E < 1e-9) break;
          x += (dir * f.ex * ds) / f.E; y += (dir * f.ey * ds) / f.E; pts.push([x, y]);
          if (x < -0.2 || x > WORLD + 0.2 || y < -0.2 || y > maxY + 0.2) break;
          const hit = charges.find((c) => Math.hypot(c.x - x, c.y - y) < 7 / scale());
          if (hit) { end = hit; pts.push([hit.x, hit.y]); break; }
        }
        return { pts, end };
      }
      function drawLines() {
        ctx.lineWidth = 1; ctx.setLineDash([]);
        for (const c of charges) {
          const n = clamp(Math.round((6 * Math.abs(c.q)) / 1e-9), 4, 32), dir = c.q > 0 ? 1 : -1, r0 = 8 / scale();
          for (let i = 0; i < n; i++) {
            const a = (TAU * (i + 0.5)) / n, L = traceLine(c.x + r0 * Math.cos(a), c.y + r0 * Math.sin(a), dir);
            if (dir < 0 && L.end && L.end.q > 0) continue; // already drawn starting from the positive charge
            ctx.strokeStyle = "rgba(255,209,102,0.7)"; ctx.beginPath();
            L.pts.forEach((p, j) => { if (j) ctx.lineTo(toPx(p[0]), toPx(p[1])); else ctx.moveTo(toPx(p[0]), toPx(p[1])); }); ctx.stroke();
            if (L.pts.length > 12) { // arrowhead at mid-line, pointing along E
              const k = Math.floor(L.pts.length / 2), m = L.pts[k], nx = L.pts[k + 1]; let dx = nx[0] - m[0], dy = nx[1] - m[1]; const len = Math.hypot(dx, dy) || 1; dx = (dx / len) * dir; dy = (dy / len) * dir;
              const ax = toPx(m[0]), ay = toPx(m[1]); ctx.fillStyle = "rgba(255,209,102,0.9)"; ctx.beginPath(); ctx.moveTo(ax + dx * 5, ay + dy * 5); ctx.lineTo(ax - dx * 3 - dy * 3.5, ay - dy * 3 + dx * 3.5); ctx.lineTo(ax - dx * 3 + dy * 3.5, ay - dy * 3 - dx * 3.5); ctx.closePath(); ctx.fill();
            }
          }
        }
      }
      function drawVectors() {
        const step = 28, E0 = (K * 1e-9) / 0.09; // reference field: 1 nC at 30 cm
        for (let px = step / 2; px < cv.width; px += step) for (let py = step / 2; py < cv.height; py += step) {
          const f = field(toM(px), toM(py)); if (f.E < 1e-9) continue;
          const len = clamp(6 + 6 * Math.log10(1 + f.E / E0), 4, 20), ux = f.ex / f.E, uy = f.ey / f.E;
          ctx.globalAlpha = clamp(0.3 + 0.3 * Math.log10(1 + f.E / E0), 0.3, 1);
          arrow(ctx, px - (ux * len) / 2, py - (uy * len) / 2, px + (ux * len) / 2, py + (uy * len) / 2, C.ok, 1.2);
        }
        ctx.globalAlpha = 1;
      }
      function drawEquipotentials() { // marching squares on a coarse grid
        const nx = 80, ny = Math.max(4, Math.round((nx * cv.height) / cv.width)), dx = cv.width / nx, dy = cv.height / ny, g = new Float64Array((nx + 1) * (ny + 1));
        for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) g[j * (nx + 1) + i] = field(toM(i * dx), toM(j * dy)).V;
        const V0 = (K * 1e-9) / 0.5, levels = []; for (let e = -2; e <= 6; e++) { levels.push(V0 * 2 ** e); levels.push(-V0 * 2 ** e); }
        ctx.lineWidth = 1; ctx.setLineDash([]);
        levels.forEach((lv) => {
          ctx.strokeStyle = lv > 0 ? "rgba(255,107,107,0.5)" : "rgba(103,232,249,0.5)"; ctx.beginPath();
          for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
            const a = g[j * (nx + 1) + i] - lv, b = g[j * (nx + 1) + i + 1] - lv, c = g[(j + 1) * (nx + 1) + i + 1] - lv, d = g[(j + 1) * (nx + 1) + i] - lv;
            const idx = (a > 0 ? 8 : 0) | (b > 0 ? 4 : 0) | (c > 0 ? 2 : 0) | (d > 0 ? 1 : 0); if (idx === 0 || idx === 15) continue;
            const x0 = i * dx, y0 = j * dy, top = [x0 + (dx * a) / (a - b), y0], right = [x0 + dx, y0 + (dy * b) / (b - c)], bottom = [x0 + (dx * d) / (d - c), y0 + dy], left = [x0, y0 + (dy * a) / (a - d)];
            const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
            switch (idx) {
              case 1: case 14: seg(left, bottom); break; case 2: case 13: seg(bottom, right); break; case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break; case 5: seg(left, top); seg(bottom, right); break; case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break; case 10: seg(top, right); seg(left, bottom); break;
            }
          }
          ctx.stroke();
        });
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        if (!charges.length) { text(ctx, "Click anywhere to place a charge", W / 2, H / 2, { color: C.muted, align: "center", size: 14 }); return; }
        if (P().equi) drawEquipotentials();
        const show = P().show; if (show !== "lines" || quick) drawVectors(); if (show !== "vectors" && !quick) drawLines();
        charges.forEach((c) => { const px = toPx(c.x), py = toPx(c.y); ctx.fillStyle = c.q > 0 ? C.danger : C.primary; ctx.beginPath(); ctx.arc(px, py, 8 + Math.abs(c.q) / 1e-9, 0, TAU); ctx.fill(); text(ctx, (c.q > 0 ? "+" : "−") + fmt(Math.abs(c.q) / 1e-9, 1), px, py + 4, { color: "#0f1222", align: "center", size: 10, bold: true }); });
        text(ctx, "canvas width = 2 m · click = add " + (P().sign > 0 ? "+" : "−") + P().q + " nC · drag = move · red/cyan = ± equipotentials", 8, H - 8, { color: C.muted, size: 10 });
        if (hover) { ctx.strokeStyle = C.ok; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(toPx(hover.x), toPx(hover.y), 5, 0, TAU); ctx.stroke(); }
      }
      function readouts() {
        const net = charges.reduce((a, c) => a + c.q, 0), r = { "Charges": String(charges.length) + " (max 12)", "Net charge": unit(net / 1e-9, "nC", 1) };
        if (charges.length >= 2 && Math.abs(net) < 1e-15) { let px = 0, py = 0; charges.forEach((c) => { px += c.q * c.x; py += c.q * c.y; }); r["Dipole moment |p| = |Σqᵢrᵢ|"] = unit(Math.hypot(px, py) / 1e-9, "nC·m", 3); }
        if (hover) {
          const f = field(hover.x, hover.y); r["Cursor (x, y)"] = "(" + fmt(hover.x, 2) + ", " + fmt(hover.y, 2) + ") m";
          r["|E| at cursor"] = f.E >= 1000 ? unit(f.E / 1e3, "kV/m", 2) : unit(f.E, "V/m", 1); r["V at cursor"] = unit(f.V, "V", 1);
          let dn = Infinity, qn = 0; charges.forEach((c) => { const d = Math.hypot(c.x - hover.x, c.y - hover.y); if (d < dn) { dn = d; qn = Math.abs(c.q); } });
          if (charges.length >= 2 && dn > 0.03 && f.E < (0.25 * K * qn) / (dn * dn)) { r["Note"] = "field nearly cancels here"; api.award("null_point"); }
        }
        api.readout(r);
      }
      function checkAwards() {
        if (charges.length === 2) {
          const [a, b] = charges; if (Math.abs(a.q + b.q) < 1e-15 && a.q !== 0) api.award("dipole");
          const qs = [a.q, b.q].map((q) => Math.round(q / 1e-10) / 10).sort(); if (qs[0] === -1 && qs[1] === 2) api.award("unequal");
        }
      }
      function preset(kind) { charges = kind === "dipole" ? [{ x: 0.7, y: 0.56, q: 2e-9 }, { x: 1.3, y: 0.56, q: -2e-9 }] : [{ x: 0.7, y: 0.56, q: 2e-9 }, { x: 1.3, y: 0.56, q: 2e-9 }]; checkAwards(); draw(); readouts(); }
      api.pointer(cv.canvas, {
        down(p) {
          const x = toM(p.x), y = toM(p.y), hit = charges.findIndex((c) => Math.hypot(toPx(c.x - x), toPx(c.y - y)) < 16);
          if (hit >= 0) { dragIdx = hit; quick = true; } else if (charges.length < 12) { charges.push({ x, y, q: P().sign * P().q * 1e-9 }); checkAwards(); }
          draw(); readouts();
        },
        move(p) {
          hover = { x: toM(p.x), y: toM(p.y) };
          if (dragIdx >= 0) { charges[dragIdx].x = hover.x; charges[dragIdx].y = hover.y; draw(); }
          const now = performance.now(); if (now - lastRO > 80) { lastRO = now; readouts(); }
        },
        up() { if (dragIdx >= 0) { dragIdx = -1; quick = false; draw(); } },
      });
      api.onParam(draw); api.onResize(draw);
      api.setStatus("k = 8.99×10⁹ N·m²/C². Lines leave + charges and end on − charges or at infinity.");
      draw(); readouts();
      return { undo() { charges.pop(); draw(); readouts(); }, clear() { charges = []; draw(); readouts(); }, preset, destroy() {} };
    },
  });

  /* ════════════════════════════ ideal_gas ════════════════════════════ */
  const KB_SIM = 8.31446e-3; // Boltzmann constant in amu·nm²·ps⁻²·K⁻¹
  S.register({
    id: "ideal_gas", name: "Ideal Gas in a Box", domains: ["physics", "chemistry"],
    description: "Hard-disc molecules in a 2-D box (nm, ps, amu units). Pressure is measured from wall impulses, temperature from the mean kinetic energy, and the speed histogram is compared with the 2-D Maxwell–Boltzmann distribution.",
    params: [
      { key: "N", label: "Molecules N", type: "range", min: 10, max: 400, step: 10, value: 150 },
      { key: "T", label: "Temperature set-point (K)", type: "range", min: 50, max: 1000, step: 10, value: 300 },
      { key: "width", label: "Box width (fraction of 100 nm) — moves a piston", type: "range", min: 0.3, max: 1, step: 0.05, value: 0.8 },
      { key: "gas", label: "Gas", type: "select", value: "Ar", options: [{ value: "He", label: "Helium (4 u)" }, { value: "Ne", label: "Neon (20 u)" }, { value: "Ar", label: "Argon (40 u)" }, { value: "Xe", label: "Xenon (131 u)" }] },
      { key: "thermostat", label: "Thermostat (hold T at the set-point)", type: "toggle", value: true },
    ],
    actions: [{ label: "Reset", fn: (h) => h.reset() }, { label: "Pause / resume", fn: (h) => h.toggle() }],
    challenges: [
      { id: "boyle", text: "Thermostat on: halve the box width — does the measured pressure double? (Boyle: PV = const at fixed T)", xp: 15 },
      { id: "gay_lussac", text: "Fixed volume: double T — the pressure doubles too (Gay-Lussac). Check that PV/NkT stays ≈ 1.", xp: 10 },
      { id: "adiabatic", text: "Thermostat off: compress the box. Why does the gas heat up? (The moving piston does work on the molecules.)", xp: 15 },
      { id: "nonideal", text: "Pack N = 400 molecules into the narrowest box: PV/NkT climbs above 1. Which ideal-gas assumption fails?", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      const MASS = { He: 4.0026, Ne: 20.18, Ar: 39.948, Xe: 131.29 }, LY = 60, LMAX = 100, RAD = 0.5, MAXN = 400;
      const px = new Float64Array(MAXN), py = new Float64Array(MAXN), vx = new Float64Array(MAXN), vy = new Float64Array(MAXN);
      let n = 0, Lx = 80, wallTarget = 80, mass = MASS.Ar, impulse = 0, tWin = 0, pressure = NaN, running = true, denseT = 0, compressFrom = null, simT = 0;
      const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-12, api.random()))) * Math.cos(TAU * api.random());
      const kinetic = () => { let k = 0; for (let i = 0; i < n; i++) k += vx[i] * vx[i] + vy[i] * vy[i]; return 0.5 * mass * k; };
      const tempNow = () => (n ? kinetic() / (n * KB_SIM) : 0); // 2-D equipartition: <½mv²> = k_B T
      function scaleVel(f) { for (let i = 0; i < n; i++) { vx[i] *= f; vy[i] *= f; } }
      function setTemperature(T) { const cur = tempNow(); if (cur > 0) scaleVel(Math.sqrt(T / cur)); }
      function reset() {
        n = clamp(Math.round(P().N), 1, MAXN); mass = MASS[P().gas] || 39.948; Lx = LMAX * P().width; wallTarget = Lx;
        const cols = Math.max(1, Math.ceil(Math.sqrt((n * Lx) / LY))), rows = Math.ceil(n / cols), sig = Math.sqrt((KB_SIM * P().T) / mass);
        for (let i = 0; i < n; i++) { px[i] = ((i % cols) + 0.5) * (Lx / cols); py[i] = (Math.floor(i / cols) + 0.5) * (LY / rows); vx[i] = sig * gauss(); vy[i] = sig * gauss(); }
        let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += vx[i]; my += vy[i]; } for (let i = 0; i < n; i++) { vx[i] -= mx / n; vy[i] -= my / n; }
        setTemperature(P().T); impulse = 0; tWin = 0; pressure = NaN; running = true; compressFrom = null; simT = 0;
      }
      function stepPhysics(h) {
        const u = 0.05; let uw = 0; // piston speed (nm/ps)
        if (Math.abs(wallTarget - Lx) > 1e-9) { const d = clamp(wallTarget - Lx, -u * h, u * h); Lx += d; uw = Math.sign(d) * u; }
        for (let i = 0; i < n; i++) {
          px[i] += vx[i] * h; py[i] += vy[i] * h;
          if (px[i] < RAD) { px[i] = RAD; if (vx[i] < 0) { impulse += 2 * mass * -vx[i]; vx[i] = -vx[i]; } }
          if (px[i] > Lx - RAD) { px[i] = Lx - RAD; if (vx[i] > uw) { impulse += 2 * mass * Math.abs(vx[i] - uw); vx[i] = 2 * uw - vx[i]; } }
          if (py[i] < RAD) { py[i] = RAD; if (vy[i] < 0) { impulse += 2 * mass * -vy[i]; vy[i] = -vy[i]; } }
          if (py[i] > LY - RAD) { py[i] = LY - RAD; if (vy[i] > 0) { impulse += 2 * mass * vy[i]; vy[i] = -vy[i]; } }
        }
        const D = 2 * RAD, D2 = D * D;
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          const dx = px[j] - px[i], dy = py[j] - py[i]; if (dx > D || dx < -D || dy > D || dy < -D) continue;
          const r2 = dx * dx + dy * dy; if (r2 >= D2 || r2 < 1e-12) continue;
          const r = Math.sqrt(r2), nx = dx / r, ny = dy / r, rel = (vx[i] - vx[j]) * nx + (vy[i] - vy[j]) * ny; if (rel <= 0) continue;
          vx[i] -= rel * nx; vy[i] -= rel * ny; vx[j] += rel * nx; vy[j] += rel * ny; // equal-mass elastic exchange of normal components
          const ov = (D - r) / 2 + 1e-6; px[i] -= nx * ov; py[i] -= ny * ov; px[j] += nx * ov; py[j] += ny * ov;
        }
        tWin += h; simT += h;
        if (tWin >= 3) { const p = impulse / (tWin * 2 * (Lx + LY)); pressure = isFinite(pressure) ? 0.7 * pressure + 0.3 * p : p; impulse = 0; tWin = 0; }
      }
      const speedColor = (v, vr) => { const f = clamp(v / (2 * vr), 0, 1); return "hsl(" + (220 - 220 * f) + ",85%,62%)"; };
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const s = (W * 0.6 - 40) / LMAX, bx = 20, by = (H - LY * s) / 2, T = tempNow(), vr = Math.sqrt((2 * KB_SIM * Math.max(T, 1)) / mass);
        ctx.fillStyle = "rgba(255,255,255,0.03)"; ctx.fillRect(bx, by, Lx * s, LY * s);
        ctx.strokeStyle = C.axis; ctx.lineWidth = 1; ctx.setLineDash([]); ctx.strokeRect(bx, by, Lx * s, LY * s);
        ctx.fillStyle = C.accent; ctx.fillRect(bx + Lx * s - 2, by - 4, 6, LY * s + 8); text(ctx, "piston", bx + Lx * s + 8, by + 12, { color: C.accent, size: 10 });
        const rp = Math.max(2, RAD * s);
        for (let i = 0; i < n; i++) { ctx.fillStyle = speedColor(Math.hypot(vx[i], vy[i]), vr); ctx.beginPath(); ctx.arc(bx + px[i] * s, by + py[i] * s, rp, 0, TAU); ctx.fill(); }
        text(ctx, fmt(Lx, 0) + " nm × " + LY + " nm · t = " + fmt(simT, 0) + " ps" + (running ? "" : "  ⏸"), bx, by - 8, { color: C.muted, size: 10 });
        // speed histogram + Maxwell–Boltzmann (2-D) curve
        const bins = 24, vmax = 3.2 * Math.sqrt((2 * KB_SIM * P().T) / mass), counts = new Array(bins).fill(0);
        for (let i = 0; i < n; i++) { const b = Math.floor((Math.hypot(vx[i], vy[i]) / vmax) * bins); if (b >= 0 && b < bins) counts[b]++; }
        const bw = vmax / bins, mb = (v) => n * ((mass * v) / (KB_SIM * Math.max(T, 1))) * Math.exp((-mass * v * v) / (2 * KB_SIM * Math.max(T, 1))) * bw;
        let ymax = 1; for (let i = 0; i < bins; i++) ymax = Math.max(ymax, counts[i]); ymax = Math.max(ymax, mb(Math.sqrt((KB_SIM * Math.max(T, 1)) / mass))) * 1.15;
        const hp = makePlot(ctx, C, { x: W * 0.66, y: 24, w: W * 0.31, h: H * 0.5 }, { xmin: 0, xmax: vmax * 1000, ymin: 0, ymax });
        hp.frame("speed (m/s)", "molecules", { ny: 3 });
        for (let i = 0; i < bins; i++) { ctx.fillStyle = "rgba(124,156,255,0.55)"; const x0 = hp.X(i * bw * 1000), x1 = hp.X((i + 1) * bw * 1000); ctx.fillRect(x0 + 1, hp.Y(counts[i]), Math.max(1, x1 - x0 - 2), hp.Y(0) - hp.Y(counts[i])); }
        hp.curve((v) => mb(v / 1000), C.accent, 2, 120);
        text(ctx, "speed distribution vs 2-D Maxwell–Boltzmann", hp.box.x, 14, { color: C.text, size: 10, bold: true });
        const ratio = isFinite(pressure) ? (pressure * Lx * LY) / (n * KB_SIM * Math.max(T, 1)) : NaN;
        text(ctx, "PV/NkT = " + fmt(ratio, 2), W * 0.66, H * 0.5 + 60, { color: isFinite(ratio) && Math.abs(ratio - 1) > 0.15 ? C.danger : C.ok, size: 14, bold: true });
        text(ctx, "T(measured) = " + fmt(T, 0) + " K    P = " + fmt(pressure * 1.66054e-3, 4) + " N/m", W * 0.66, H * 0.5 + 80, { color: C.muted, size: 10 });
      }
      const tick = every(0.25);
      function readouts() {
        const T = tempNow(), vr = Math.sqrt((2 * KB_SIM * T) / mass), ratio = isFinite(pressure) ? (pressure * Lx * LY) / (n * KB_SIM * Math.max(T, 1)) : NaN;
        api.readout({ "Pressure (2-D, force/length)": unit(pressure * 1.66054e-3, "N/m", 4), "Ideal prediction NkT/A": unit(((n * KB_SIM * T) / (Lx * LY)) * 1.66054e-3, "N/m", 4), "PV/NkT": fmt(ratio, 3), "T from mean KE": unit(T, "K", 0),
          "v_rms = √(2kT/m)": unit(vr * 1000, "m/s", 0), "Most probable speed √(kT/m)": unit(Math.sqrt((KB_SIM * T) / mass) * 1000, "m/s", 0), "Mean free path 1/(2√2·r·n)": unit(1 / (2 * Math.SQRT2 * RAD * (n / (Lx * LY))), "nm", 1), "Area fraction covered": unit((100 * n * Math.PI * RAD * RAD) / (Lx * LY), "%", 1) });
      }
      safeLoop(api, (dt) => {
        if (running) {
          for (let k = 0; k < 3; k++) stepPhysics(0.2);
          const T = tempNow();
          if (P().thermostat && T > 0) scaleVel(Math.sqrt(clamp(1 + (dt / 0.5) * (P().T / T - 1), 0.8, 1.25)));
          denseT = n >= 350 && P().width <= 0.35 ? denseT + dt : 0; if (denseT > 2) api.award("nonideal");
          if (!P().thermostat && wallTarget < Lx - 1e-9 && compressFrom == null) compressFrom = T;
          if (compressFrom != null && Math.abs(wallTarget - Lx) < 1e-9) { if (tempNow() > 1.15 * compressFrom) api.award("adiabatic"); compressFrom = null; }
        }
        draw(); if (tick(dt)) readouts(); return true;
      });
      api.onParam((k) => { if (k === "N" || k === "gas") reset(); else if (k === "T") setTemperature(P().T); else if (k === "width") wallTarget = LMAX * P().width; draw(); readouts(); });
      api.onResize(draw);
      api.setStatus("2-D ideal gas: P·A = N·k·T with P = impulse per time per wall length. Colour = speed.");
      reset(); draw(); readouts();
      return { reset, toggle() { running = !running; }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ relativity ════════════════════════════ */
  S.register({
    id: "relativity", name: "Special Relativity Lab", domains: ["physics"],
    description: "A light clock aboard a moving ship: time dilation and length contraction follow from the invariance of c. The Minkowski diagram shows the ship's tilted axes and lines of simultaneity.",
    params: [
      { key: "beta", label: "Speed β = v/c", type: "range", min: 0, max: 0.99, step: 0.01, value: 0.6 },
      { key: "L0", label: "Ship proper length L₀ (m)", type: "range", min: 20, max: 200, step: 10, value: 100 },
      { key: "view", label: "View", type: "select", value: "both", options: [{ value: "both", label: "Light clock + spacetime diagram" }, { value: "clock", label: "Light clock only" }, { value: "diagram", label: "Spacetime diagram only" }] },
    ],
    actions: [{ label: "Pause / resume", fn: (h) => h.toggle() }, { label: "Reset clocks", fn: (h) => h.reset() }],
    challenges: [
      { id: "gamma2", text: "Find the speed at which γ = 2, so the ship's clock ticks at half the ground rate.", xp: 10 },
      { id: "muon", text: "Push β to 0.98+: a muon (lifetime 2.2 µs) could only travel 660 m classically — read how far it gets with time dilation.", xp: 15 },
      { id: "simultaneity", text: "Events A and B are simultaneous for the ground (same ct). Which happens first for the ship, and why?", xp: 15 },
      { id: "invariant", text: "Check that (ct)² − x² of the ship's current event equals (cτ)² — the same interval in every frame.", xp: 20 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params, c0 = 299792458;
      let t = 0, running = true;
      const gamma = () => 1 / Math.sqrt(1 - P().beta ** 2);
      function drawClock(x0, y0, w, h) {
        const b = P().beta, g = gamma(), tau = t / g, ph = tau % 1, half = h / 2, gap = half * 0.5, baseY = y0 + half * 0.8;
        const yPh = (base) => base - (ph < 0.5 ? ph * 2 : (1 - ph) * 2) * gap;
        const clock = (cx, base, label, len, col) => {
          ctx.fillStyle = col; ctx.fillRect(cx - len / 2, base - gap - 14, len, 6); ctx.fillRect(cx - len / 2, base + 4, len, 6);
          ctx.fillStyle = C.text; ctx.fillRect(cx - 12, base - gap - 3, 24, 3); ctx.fillRect(cx - 12, base, 24, 3);
          ctx.strokeStyle = C.grid; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, base - gap); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(cx, yPh(base), 5, 0, TAU); ctx.fill();
          text(ctx, label, cx, base + 24, { color: C.muted, align: "center", size: 10 });
        };
        text(ctx, "Ship frame — clock at rest, ticks τ = " + fmt(tau, 2) + " s", x0 + 8, y0 + 14, { color: C.text, bold: true });
        clock(x0 + w / 2, baseY, "mirrors " + "· proper length L₀ = " + P().L0 + " m", w * 0.5 * (P().L0 / 200) + 40, C.secondary);
        const gy = y0 + half, base2 = gy + half * 0.8, shipLen = (w * 0.5 * (P().L0 / 200) + 40) / g, cx2 = x0 + 30 + ((b * t * gap * 2 + w * 0.3) % (w - 60));
        text(ctx, "Ground frame — ship passes at β = " + b + ", ground time t = " + fmt(t, 2) + " s", x0 + 8, gy + 14, { color: C.text, bold: true });
        ctx.strokeStyle = "rgba(255,209,102,0.5)"; ctx.setLineDash([]); ctx.beginPath(); // photon's zig-zag over the last tick in the ground frame
        for (let k = 0; k <= 40; k++) { const tt = t - g * 0.5 + (g * 0.5 * k) / 40, xx = x0 + 30 + ((b * tt * gap * 2 + w * 0.3) % (w - 60)), pp = (tt / g) % 1, yy = base2 - (pp < 0.5 ? pp * 2 : (1 - pp) * 2) * gap; if (k && Math.abs(xx - prevX) < w / 2) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); var prevX = xx; }
        ctx.stroke();
        clock(cx2, base2, "contracted to L₀/γ = " + fmt(P().L0 / g, 1) + " m", shipLen, C.primary);
        arrow(ctx, cx2 + shipLen / 2 + 6, base2 - gap / 2, cx2 + shipLen / 2 + 16 + b * 50, base2 - gap / 2, C.ok, 2);
        text(ctx, "light path per tick is longer here, yet c is the same → the moving clock ticks slower (γ = " + fmt(g, 3) + ")", x0 + 8, y0 + h - 8, { color: C.muted, size: 10 });
      }
      function drawDiagram(x0, y0, w, h) {
        const b = P().beta, g = gamma(), box = { x: x0 + 44, y: y0 + 14, w: w - 60, h: h - 44 }, xr = 4, ymax = (2 * xr * box.h) / box.w;
        const pl = makePlot(ctx, C, box, { xmin: -xr, xmax: xr, ymin: 0, ymax });
        pl.frame("x (light-seconds)", "ct (light-seconds)");
        pl.line([[-ymax, ymax], [0, 0], [ymax, ymax]], C.accent, 1, [4, 4]);
        pl.line([[0, 0], [b * ymax, ymax]], C.secondary, 2);
        pl.line([[-xr, -xr * b], [xr, xr * b]], C.secondary, 1, [2, 3]);
        for (let k = 1; k * g <= ymax; k++) { const ex = g * b * k, ey = g * k; pl.line([[ex - 8, ey - 8 * b], [ex + 8, ey + 8 * b]], "rgba(255,143,171,0.35)", 1); pl.dot(ex, ey, 3, C.secondary); text(ctx, "τ = " + k, pl.X(ex) + 6, pl.Y(ey) - 4, { color: C.secondary, size: 9 }); }
        for (let k = 1; k <= ymax; k++) { pl.dot(0, k, 2.5, C.primary); text(ctx, "t = " + k, pl.X(0) - 28, pl.Y(k) + 3, { color: C.primary, size: 9 }); }
        const tt = t % ymax; pl.line([[b * tt - 8, tt - 8 * b], [b * tt + 8, tt + 8 * b]], C.accent, 1.5, [3, 3]); pl.dot(b * tt, tt, 5, C.accent);
        const tA = Math.min(3, ymax * 0.6); pl.line([[-2, tA], [2, tA]], C.ok, 1, [2, 2]); pl.dot(-2, tA, 4, C.ok); pl.dot(2, tA, 4, C.ok);
        text(ctx, "A", pl.X(-2) - 10, pl.Y(tA) - 6, { color: C.ok, bold: true }); text(ctx, "B", pl.X(2) + 6, pl.Y(tA) - 6, { color: C.ok, bold: true });
        pl.legend([["ship worldline & x′ axis (slope β)", C.secondary], ["ground ticks", C.primary], ["light cone", C.accent], ["ship's 'now' through current event", C.accent]], box.x + 6, box.y + 14);
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const v = P().view;
        if (v === "both") { drawClock(0, 0, W * 0.5, H); drawDiagram(W * 0.5, 0, W * 0.5, H); } else if (v === "clock") drawClock(0, 0, W, H); else drawDiagram(0, 0, W, H);
        if (!running) text(ctx, "⏸ paused", W - 54, 14, { color: C.muted, size: 10 });
      }
      const tick = every(0.2);
      function readouts() {
        const b = P().beta, g = gamma(), tau = t / g, tA = 3;
        api.readout({ "γ = 1/√(1 − β²)": fmt(g, 4), "Ground clock t": unit(t, "s", 2), "Ship clock τ = t/γ": unit(tau, "s", 2), "Ship length from the ground L₀/γ": unit(P().L0 / g, "m", 1), "1 s on the ship lasts": unit(g, "s on the ground", 3),
          "Muon range γβcτ₀ (τ₀ = 2.2 µs)": unit(g * b * c0 * 2.2e-6, "m", 0) + " (classical " + fmt(b * c0 * 2.2e-6, 0) + " m)", "Kinetic energy per kg, (γ − 1)c²": unit(((g - 1) * c0 * c0) / 1e15, "PJ/kg", 3),
          "Ship time of A / B, t′ = γ(t − βx/c)": fmt(g * (tA + 2 * b), 2) + " s / " + fmt(g * (tA - 2 * b), 2) + " s", "Interval (ct)² − x² of ship event": fmt(t * t * (1 - b * b), 2) + " = (cτ)² = " + fmt(tau * tau, 2) });
        if (b >= 0.86 && b <= 0.87) api.award("gamma2"); if (b >= 0.98) api.award("muon");
      }
      safeLoop(api, (dt) => { if (running) t += dt * 0.5; draw(); if (tick(dt)) readouts(); return true; });
      api.onParam(() => { draw(); readouts(); }); api.onResize(draw);
      api.setStatus("Diagram units: light-seconds; the ship's clock ticks lie γ ground-seconds apart along its worldline.");
      draw(); readouts();
      return { toggle() { running = !running; }, reset() { t = 0; }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ quantum_well ════════════════════════════ */
  S.register({
    id: "quantum_well", name: "Particle in a Box", domains: ["physics", "chemistry"],
    description: "An electron in an infinite square well: ψₙ = √(2/L)·sin(nπx/L), Eₙ = n²h²/(8mL²). Superpose two states and watch |ψ|² slosh as the phases rotate at different rates.",
    params: [
      { key: "n", label: "State n", type: "range", min: 1, max: 6, step: 1, value: 1 },
      { key: "m", label: "Second state m (0 = none)", type: "range", min: 0, max: 6, step: 1, value: 2 },
      { key: "w", label: "Weight of second state |c₂|²", type: "range", min: 0, max: 1, step: 0.05, value: 0.5 },
      { key: "L", label: "Well width L (nm)", type: "range", min: 0.5, max: 3, step: 0.1, value: 1 },
      { key: "speed", label: "Playback (fs of physics per real s)", type: "range", min: 0.1, max: 5, step: 0.1, value: 1 },
      { key: "reim", label: "Show Re ψ and Im ψ", type: "toggle", value: true },
    ],
    actions: [{ label: "Pause / resume", fn: (h) => h.toggle() }, { label: "Reset t = 0", fn: (h) => h.reset() }],
    challenges: [
      { id: "nodes", text: "Show n = 4 alone (weight 0 or m = 0): count the nodes inside the well — always n − 1.", xp: 10 },
      { id: "sloshing", text: "Mix n = 1 and m = 2 with equal weight: ⟨x⟩ oscillates with period h/(E₂ − E₁). Check it against the readout.", xp: 15 },
      { id: "scaling", text: "Halve L: by what factor do all energies change? Why does confinement cost energy?", xp: 15 },
      { id: "stationary", text: "With one state, |ψ|² is frozen while Re ψ and Im ψ rotate — explain why it is called a stationary state.", xp: 10 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      const HBAR = 1.054571817e-34, ME = 9.1093837015e-31, EV = 1.602176634e-19, HP = 6.62607015e-34;
      let t = 0, running = true, slosh = 0;
      const E = (k) => (k * k * Math.PI ** 2 * HBAR ** 2) / (2 * ME * (P().L * 1e-9) ** 2);
      const coef = () => (P().m === 0 || P().m === P().n ? { c1: 1, c2: 0 } : { c1: Math.sqrt(1 - P().w), c2: Math.sqrt(P().w) });
      function psi(x, tt) { // x in nm → [Re, Im] in nm^-1/2
        const L = P().L, { c1, c2 } = coef(), a = Math.sqrt(2 / L), p1 = (-E(P().n) * tt) / HBAR, s1 = a * Math.sin((P().n * Math.PI * x) / L);
        let re = c1 * s1 * Math.cos(p1), im = c1 * s1 * Math.sin(p1);
        if (c2 > 0) { const p2 = (-E(P().m) * tt) / HBAR, s2 = a * Math.sin((P().m * Math.PI * x) / L); re += c2 * s2 * Math.cos(p2); im += c2 * s2 * Math.sin(p2); }
        return [re, im];
      }
      function sample() {
        const L = P().L, N = 240, out = { xs: [], dens: [], re: [], im: [], xm: 0, left: 0 }; let norm = 0;
        for (let i = 0; i <= N; i++) { const x = (L * i) / N, p = psi(x, t * 1e-15), d = p[0] * p[0] + p[1] * p[1]; out.xs.push(x); out.dens.push(d); out.re.push(p[0]); out.im.push(p[1]); norm += d; out.xm += x * d; if (x < L / 2) out.left += d; }
        out.xm /= norm || 1; out.left /= norm || 1; return out;
      }
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const L = P().L, s = sample(), { c1, c2 } = coef(), dmax = ((2 / L) * (c1 + c2) ** 2) * 1.05, reim = P().reim;
        const main = { x: 46, y: 14, w: W * 0.66 - 46, h: reim ? H * 0.46 : H - 54 };
        const p1 = makePlot(ctx, C, main, { xmin: 0, xmax: L, ymin: 0, ymax: dmax });
        p1.frame(reim ? "" : "x (nm)", "|ψ|² (nm⁻¹)", { noXTicks: reim, ny: 3 });
        p1.fill(s.xs.map((x, i) => [x, s.dens[i]]), "rgba(124,156,255,0.25)"); p1.line(s.xs.map((x, i) => [x, s.dens[i]]), C.primary, 2);
        p1.vline(s.xm, C.accent, [4, 3]); text(ctx, "⟨x⟩", p1.X(s.xm) + 4, main.y + 12, { color: C.accent, size: 10 });
        if (reim) {
          const amax = Math.sqrt(2 / L) * (c1 + c2) * 1.05, p2 = makePlot(ctx, C, { x: 46, y: H * 0.56, w: main.w, h: H * 0.34 }, { xmin: 0, xmax: L, ymin: -amax, ymax: amax });
          p2.frame("x (nm)", "ψ (nm⁻½)", { ny: 2 }); p2.line(s.xs.map((x, i) => [x, s.re[i]]), C.secondary, 2); p2.line(s.xs.map((x, i) => [x, s.im[i]]), C.ok, 2);
          p2.legend([["Re ψ", C.secondary], ["Im ψ", C.ok]], p2.box.x + p2.box.w - 56);
        }
        ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fillRect(main.x - 10, main.y, 10, H - main.y - 40); ctx.fillRect(main.x + main.w, main.y, 10, H - main.y - 40);
        text(ctx, "V = ∞", main.x - 5, main.y - 3, { color: C.muted, align: "center", size: 9 }); text(ctx, "V = ∞", main.x + main.w + 5, main.y - 3, { color: C.muted, align: "center", size: 9 });
        const ex = W * 0.72, ew = W * 0.25, ey0 = H - 44, eh = H - 70, Emax = (E(6) / EV) * 1.08;
        text(ctx, "Energy levels (eV)", ex, 14, { color: C.text, bold: true });
        ctx.strokeStyle = C.axis; ctx.setLineDash([]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ex, ey0); ctx.lineTo(ex, ey0 - eh); ctx.stroke();
        for (let k = 1; k <= 6; k++) {
          const yk = ey0 - ((E(k) / EV) / Emax) * eh, on = k === P().n || (k === P().m && c2 > 0);
          ctx.strokeStyle = on ? C.accent : C.muted; ctx.lineWidth = on ? 3 : 1; ctx.beginPath(); ctx.moveTo(ex + 4, yk); ctx.lineTo(ex + ew * 0.5, yk); ctx.stroke();
          text(ctx, "n=" + k + ": " + fmt(E(k) / EV, 2), ex + ew * 0.53, yk + 4, { color: on ? C.accent : C.muted, size: 10 });
        }
        text(ctx, "t = " + fmt(t, 1) + " fs" + (running ? "" : "  ⏸"), ex, H - 14, { color: C.muted, size: 10 });
      }
      const tick = every(0.2);
      function readouts() {
        const s = sample(), { c2 } = coef(), En = E(P().n), Em = c2 > 0 ? E(P().m) : NaN, dE = Math.abs(En - Em);
        api.readout({ ["E_" + P().n]: unit(En / EV, "eV", 3), ["E_" + (c2 > 0 ? P().m : "m")]: c2 > 0 ? unit(Em / EV, "eV", 3) : "— (single state)", "ΔE": c2 > 0 ? unit(dE / EV, "eV", 3) : "—", "|ψ|² oscillation period h/ΔE": c2 > 0 && dE > 0 ? unit((HP / dE) * 1e15, "fs", 2) : "— (stationary)",
          "⟨x⟩": unit(s.xm, "nm", 3) + " (" + fmt(s.xm / P().L, 3) + " L)", "P(x < L/2)": fmt(s.left, 3), "de Broglie λₙ = 2L/n": unit((2 * P().L) / P().n, "nm", 3), "Nodes inside the well": String(P().n - 1) + (c2 > 0 ? " / " + (P().m - 1) : "") });
        if (P().n === 4 && c2 === 0) api.award("nodes");
      }
      safeLoop(api, (dt) => {
        if (running) { t += dt * P().speed; const { c2 } = coef(); slosh = c2 > 0 && Math.min(P().n, P().m) === 1 && Math.max(P().n, P().m) === 2 && Math.abs(P().w - 0.5) < 0.051 ? slosh + dt : 0; if (slosh > 2) api.award("sloshing"); }
        draw(); if (tick(dt)) readouts(); return true;
      });
      api.onParam(() => { draw(); readouts(); }); api.onResize(draw);
      api.setStatus("ψ(x,t) = c₁ψₙe^(−iEₙt/ħ) + c₂ψₘe^(−iEₘt/ħ); the pattern repeats every h/ΔE.");
      draw(); readouts();
      return { toggle() { running = !running; }, reset() { t = 0; draw(); }, destroy() { running = false; } };
    },
  });

  /* ════════════════════════════ blackbody ════════════════════════════ */
  S.register({
    id: "blackbody", name: "Blackbody Radiation", domains: ["physics", "chemistry"],
    description: "Planck's law for one or two temperatures, with Wien's peak marker, the visible band and the Stefan–Boltzmann total power.",
    params: [
      { key: "T1", label: "Temperature T₁ (K)", type: "range", min: 1000, max: 12000, step: 50, value: 5000 },
      { key: "compare", label: "Compare with a second temperature", type: "toggle", value: true },
      { key: "T2", label: "Temperature T₂ (K)", type: "range", min: 1000, max: 12000, step: 50, value: 3000 },
      { key: "scale", label: "Axes", type: "select", value: "linear", options: [{ value: "linear", label: "Linear" }, { value: "log", label: "Log–log" }] },
    ],
    challenges: [
      { id: "sun", text: "Set T₁ = 5800 K (the Sun's photosphere): where does the peak fall relative to the visible band? Coincidence?", xp: 10 },
      { id: "fourth_power", text: "Make T₂ exactly twice T₁ and compare the total powers: the ratio should be 2⁴ = 16.", xp: 15 },
      { id: "red_hot", text: "Find the lowest temperature at which more than 0.1 % of the power is visible — the onset of 'red hot'.", xp: 15 },
      { id: "cmb", text: "The cosmic microwave background is a 2.7 K blackbody. Use Wien's law to predict its peak wavelength (in mm).", xp: 15 },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9 }), ctx = cv.ctx, P = () => api.params;
      const h = 6.62607015e-34, c = 299792458, kB = 1.380649e-23, SIG = 5.670374419e-8, WIEN = 2.897771955e-3;
      const planck = (lam, T) => { const x = (h * c) / (lam * kB * T); return x > 700 ? 0 : ((2 * Math.PI * h * c * c) / (lam ** 5 * Math.expm1(x))) * 1e-9; }; // spectral exitance, W m⁻² nm⁻¹
      const visFrac = (T) => { let s = 0; for (let l = 380; l < 750; l += 2) s += planck((l + 1) * 1e-9, T) * 2; return s / (SIG * T ** 4); };
      function tempColor(T) { // Tanner Helland's sRGB approximation of blackbody colour
        const tt = clamp(T, 1000, 40000) / 100;
        const r = tt <= 66 ? 255 : clamp(329.698727446 * Math.pow(tt - 60, -0.1332047592), 0, 255);
        const g = tt <= 66 ? clamp(99.4708025861 * Math.log(tt) - 161.1195681661, 0, 255) : clamp(288.1221695283 * Math.pow(tt - 60, -0.0755148492), 0, 255);
        const b = tt >= 66 ? 255 : tt <= 19 ? 0 : clamp(138.5177312231 * Math.log(tt - 10) - 305.0447927307, 0, 255);
        return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
      }
      const temps = () => (P().compare ? [P().T1, P().T2] : [P().T1]);
      function draw() {
        const W = cv.width, H = cv.height; clear(ctx, W, H, C);
        const Ts = temps(), log = P().scale === "log", box = { x: 60, y: 16, w: W - 76, h: H - 56 }, peakL = Ts.map((T) => WIEN / T);
        let pk = 0; Ts.forEach((T, i) => { pk = Math.max(pk, planck(peakL[i], T)); });
        const pl = log ? makePlot(ctx, C, box, { xmin: -1, xmax: 2, ymin: Math.log10(pk) - 7, ymax: Math.log10(pk) + 0.4 }) : makePlot(ctx, C, box, { xmin: 0, xmax: clamp(Math.max(...peakL) * 5e6, 1.5, 30), ymin: 0, ymax: pk * 1.12 });
        const tx = (um) => (log ? Math.log10(um) : um);
        pl.frame(log ? "" : "wavelength λ (µm)", log ? "log₁₀ spectral exitance" : "spectral exitance (W m⁻² nm⁻¹)", { noXTicks: log });
        if (log) [0.1, 0.3, 1, 3, 10, 30, 100].forEach((um) => text(ctx, um + " µm", pl.X(Math.log10(um)), box.y + box.h + 12, { color: C.muted, align: "center", size: 10 }));
        const vis = ctx.createLinearGradient(pl.X(tx(0.38)), 0, pl.X(tx(0.75)), 0);
        [["#8b5cf6", 0], ["#3b82f6", 0.2], ["#22c55e", 0.42], ["#eab308", 0.6], ["#f97316", 0.78], ["#ef4444", 1]].forEach((s) => vis.addColorStop(s[1], s[0]));
        ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = vis; ctx.fillRect(pl.X(tx(0.38)), box.y, pl.X(tx(0.75)) - pl.X(tx(0.38)), box.h); ctx.restore();
        text(ctx, "visible", pl.X(tx(0.56)), box.y + box.h - 6, { color: C.text, align: "center", size: 10 });
        Ts.forEach((T, i) => {
          const col = i ? C.secondary : C.accent, lp = peakL[i] * 1e6;
          pl.curve((u) => { const v = planck((log ? 10 ** u : u) * 1e-6, T); return log ? (v > 0 ? Math.log10(v) : NaN) : v; }, col, 2, 400);
          pl.vline(tx(lp), col, [3, 3]);
          text(ctx, fmt(T, 0) + " K   λₘₐₓ = " + fmt(lp * 1000, 0) + " nm   σT⁴ = " + fmt(SIG * T ** 4 / 1e6, 2) + " MW/m²", box.x + 10, box.y + 16 + i * 15, { color: col, size: 10, bold: true });
          ctx.fillStyle = tempColor(T); ctx.beginPath(); ctx.arc(box.x + box.w - 26 - i * 44, box.y + 26, 14, 0, TAU); ctx.fill();
        });
        text(ctx, "approx. colour", box.x + box.w - 26 - (Ts.length - 1) * 22, box.y + 52, { color: C.muted, align: "center", size: 9 });
      }
      function readouts() {
        const Ts = temps(), r = {};
        Ts.forEach((T, i) => { const tag = i ? "T₂" : "T₁", lp = WIEN / T; r[tag + " Wien peak b/T"] = unit(lp * 1e9, "nm", 0); r[tag + " total σT⁴"] = unit(SIG * T ** 4 / 1e6, "MW/m²", 3); r[tag + " peak spectral exitance"] = unit(planck(lp, T), "W m⁻² nm⁻¹", 2); r[tag + " power in 380–750 nm"] = unit(100 * visFrac(T), "%", 2); r[tag + " photon energy at peak hc/λ"] = unit((h * c) / lp / 1.602176634e-19, "eV", 2); });
        if (Ts.length === 2) { r["Power ratio (T₁/T₂)⁴"] = fmt((Ts[0] / Ts[1]) ** 4, 3); r["Peak ratio λ₂/λ₁ = T₁/T₂"] = fmt(Ts[0] / Ts[1], 3); }
        api.readout(r);
        if (Math.abs(P().T1 - 5800) < 1) api.award("sun");
        if (P().compare && (Math.abs(P().T2 - 2 * P().T1) < 1 || Math.abs(P().T1 - 2 * P().T2) < 1)) api.award("fourth_power");
      }
      api.onParam(() => { draw(); readouts(); }); api.onResize(draw);
      api.setStatus("M_λ = 2πhc²/λ⁵ · 1/(e^(hc/λkT) − 1). Wien: λₘₐₓT = 2.898×10⁻³ m·K. Stefan–Boltzmann: M = σT⁴.");
      draw(); readouts();
      return { destroy() {} };
    },
  });
})();
