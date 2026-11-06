/* Self-Taught — Robotics simulations
 * Registers: pid_controller, robot_arm, differential_drive, path_planning, kalman_filter, state_machine
 * Built against static/sims/core.js (see docs/CONTRACTS.md §3). Vanilla JS, no dependencies.
 */
(function () {
  "use strict";
  if (!window.SelfTaughtSims) { console.error("[robotics sims] core.js must be loaded first"); return; }
  const S = window.SelfTaughtSims;
  const TAU = Math.PI * 2;

  // ======================= shared helpers =======================
  function makeRng(seed) { let a = (seed >>> 0) || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function gauss(rand) { let u = 0, v = 0; while (u === 0) u = rand(); while (v === 0) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (Number.isFinite(+v) ? +v : (d || 0));
  const fx = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 2 : d) : "—");
  const deg = (r) => r * 180 / Math.PI;
  const wrapAngle = (a) => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };
  function text(ctx, s, x, y, color, o) { o = o || {}; ctx.fillStyle = color; ctx.font = (o.bold ? "700 " : "") + (o.size || 11) + "px system-ui, sans-serif"; ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic"; ctx.fillText(String(s), x, y); }
  function clearCanvas(ctx, w, h, C) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }
  function circle(ctx, x, y, r, fill, stroke, lw) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
  function arrow(ctx, x1, y1, x2, y2, color, lw) { const a = Math.atan2(y2 - y1, x2 - x1), hl = 8; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw || 1.5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - hl * Math.cos(a - 0.4), y2 - hl * Math.sin(a - 0.4)); ctx.lineTo(x2 - hl * Math.cos(a + 0.4), y2 - hl * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill(); }
  function polyline(ctx, pts, color, lw, dash) { if (pts.length < 2) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1.5; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
  /** Line-plot helper: draws grid + frame for box {x,y,w,h} over ranges xr/yr and returns series painters. */
  function plot(ctx, C, box, xr, yr, o) {
    o = o || {};
    const dx = (xr[1] - xr[0]) || 1, dy = (yr[1] - yr[0]) || 1;
    const sx = (x) => box.x + ((x - xr[0]) / dx) * box.w, sy = (y) => box.y + box.h - ((y - yr[0]) / dy) * box.h;
    const nx = o.nx || 6, ny = o.ny || 4;
    ctx.save(); ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= nx; i++) { const x = box.x + (i / nx) * box.w; ctx.beginPath(); ctx.moveTo(x, box.y); ctx.lineTo(x, box.y + box.h); ctx.stroke(); }
    for (let i = 0; i <= ny; i++) { const y = box.y + (i / ny) * box.h; ctx.beginPath(); ctx.moveTo(box.x, y); ctx.lineTo(box.x + box.w, y); ctx.stroke(); }
    ctx.strokeStyle = C.axis; ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
    text(ctx, fx(yr[1], o.yd), box.x - 4, box.y + 4, C.muted, { align: "right", size: 10 });
    text(ctx, fx(yr[0], o.yd), box.x - 4, box.y + box.h, C.muted, { align: "right", size: 10 });
    if (o.xl) text(ctx, o.xl, box.x + box.w, box.y + box.h + 12, C.muted, { align: "right", size: 10 });
    if (o.title) text(ctx, o.title, box.x + 4, box.y + 12, C.text, { size: 11, bold: true });
    ctx.restore();
    const clip = () => { ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip(); };
    return {
      sx, sy,
      line(pts, color, lw, dash) { clip(); ctx.strokeStyle = color; ctx.lineWidth = lw || 1.5; ctx.setLineDash(dash || []); ctx.beginPath(); let on = false; for (const p of pts) { if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) { on = false; continue; } if (on) ctx.lineTo(sx(p[0]), sy(p[1])); else { ctx.moveTo(sx(p[0]), sy(p[1])); on = true; } } ctx.stroke(); ctx.restore(); },
      dots(pts, color, r) { clip(); ctx.fillStyle = color; for (const p of pts) { if (!Number.isFinite(p[1])) continue; ctx.beginPath(); ctx.arc(sx(p[0]), sy(p[1]), r || 2, 0, TAU); ctx.fill(); } ctx.restore(); },
      band(pts, color) { if (pts.length < 2) return; clip(); ctx.fillStyle = color; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(sx(p[0]), sy(p[2])) : ctx.moveTo(sx(p[0]), sy(p[2])))); for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(sx(pts[i][0]), sy(pts[i][1])); ctx.closePath(); ctx.fill(); ctx.restore(); },
      hline(y, color, dash) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash(dash || [4, 4]); ctx.beginPath(); ctx.moveTo(box.x, sy(y)); ctx.lineTo(box.x + box.w, sy(y)); ctx.stroke(); ctx.restore(); },
      vline(x, color, dash) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash(dash || [2, 3]); ctx.beginPath(); ctx.moveTo(sx(x), box.y); ctx.lineTo(sx(x), box.y + box.h); ctx.stroke(); ctx.restore(); },
      legend(items) { let x = box.x + box.w - 6; ctx.font = "10px system-ui, sans-serif"; for (let i = items.length - 1; i >= 0; i--) { const w = ctx.measureText(items[i][0]).width; x -= w; text(ctx, items[i][0], x, box.y + 12, items[i][1], { size: 10 }); x -= 14; } },
    };
  }

  // ======================= 1. PID controller =======================
  const PLANTS = {
    drone: { name: "Drone altitude", unit: "m", scale: 1, horizon: 12, umin: 0, umax: 30, uname: "thrust", uunit: "N", dt: 0.005 },
    motor: { name: "DC motor speed", unit: "rad/s", scale: 10, horizon: 6, umin: -12, umax: 12, uname: "voltage", uunit: "V", dt: 0.005 },
    heater: { name: "Heater ΔT (1.5 s dead time)", unit: "°C", scale: 10, horizon: 60, umin: 0, umax: 10, uname: "power", uunit: "kW", dt: 0.02 },
  };
  S.register({
    id: "pid_controller",
    name: "PID Controller Lab",
    domains: ["robotics"],
    description: "Tune P, I and D gains on three honest plants — a hovering drone (gravity is a constant load), a first-order DC motor and a slow heater with dead time — and read off overshoot, rise time, settling time and steady-state error.",
    params: [
      { key: "plant", label: "Plant", type: "select", value: "drone", options: [
        { value: "drone", label: "Drone altitude (m) — double integrator + gravity" },
        { value: "motor", label: "DC motor speed (×10 rad/s) — first order" },
        { value: "heater", label: "Heater ΔT (×10 °C) — slow, with dead time" }] },
      { key: "setpoint", label: "Setpoint (plant units — see readout)", type: "range", min: 0, max: 10, step: 0.1, value: 5 },
      { key: "kp", label: "Kp — proportional gain", type: "range", min: 0, max: 20, step: 0.1, value: 6 },
      { key: "ki", label: "Ki — integral gain", type: "range", min: 0, max: 10, step: 0.05, value: 0 },
      { key: "kd", label: "Kd — derivative gain (on measurement)", type: "range", min: 0, max: 10, step: 0.05, value: 4 },
      { key: "speed", label: "Simulation speed ×", type: "range", min: 1, max: 8, step: 1, value: 2 },
      { key: "noise", label: "Sensor noise", type: "toggle", value: false },
      { key: "antiwindup", label: "Anti-windup (freeze integrator when saturated)", type: "toggle", value: false },
    ],
    actions: [
      { label: "Step setpoint", fn: (h) => h.step() },
      { label: "Disturbance 💥", fn: (h) => h.disturb() },
      { label: "Restart run", fn: (h) => h.restart() },
    ],
    challenges: [
      { id: "kill_ss_error", xp: 15, text: "Drone with Ki = 0: it hovers below the setpoint because gravity is a constant load. Add just enough Ki to remove the steady-state error. Why can P alone never fix it?" },
      { id: "tight_tune", xp: 25, text: "Tune the drone so a setpoint step of ≥ 2 m (use the Step setpoint button) has ≤ 5 % overshoot and a 10–90 % rise time under 1.5 s." },
      { id: "windup_tamed", xp: 20, text: "With Ki > 0 and anti-windup off, make a saturated climb overshoot by more than 30 %. Then switch anti-windup on, step again, and cut that overshoot by at least 30 %." },
      { id: "heater_limit", xp: 20, text: "Switch to the heater and raise Kp until the dead time makes it oscillate without decaying — that is the ultimate gain that Ziegler–Nichols tuning starts from." },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, rand = makeRng(7), P = api.params;
      let st, hist, tNow, acc, stepInfo, metrics = {}, frame = 0;
      const flags = { sawPError: false, sawWindup: false, windupOS: 0 };
      const plant = () => PLANTS[P.plant] || PLANTS.drone;
      function newStep(extra) { const r = num(P.setpoint, 5); stepInfo = Object.assign({ t0: tNow, y0: st.y, r, big: Math.abs(r - st.y) >= 2, aw: !!P.antiwindup }, extra || {}); }
      function reset() { st = { y: 0, v: 0, I: 0, yf: 0, u: 0, delay: [], distT: 0 }; hist = []; tNow = 0; acc = 0; metrics = {}; newStep(); }
      reset();

      function physics(dt, u) {
        if (P.plant === "motor") { const load = st.distT > 0 ? 3 : 0; st.y += ((u - st.y - load) / 0.4) * dt; }                       // τ ω' = K u − ω − load
        else if (P.plant === "heater") { st.delay.push(u); const L = Math.round(1.5 / dt); while (st.delay.length > L) st.delay.shift(); const ud = st.delay.length >= L ? st.delay[0] : 0; st.y += ((ud - st.y) / 8) * dt; } // τ T' = u(t−L) − T
        else { st.v += ((u - 9.81) - 0.3 * st.v) * dt; st.y += st.v * dt; if (st.y < 0) { st.y = 0; st.v = Math.max(0, st.v); } }      // m z'' = u − m g − c ż  (m = 1 kg)
        if (st.distT > 0) st.distT -= dt;
        if (!Number.isFinite(st.y) || Math.abs(st.y) > 1e6) { reset(); api.setStatus("Numerical blow-up — these gains destabilise the plant. Run restarted."); }
      }
      function control(dt) {
        const pl = plant(), r = num(P.setpoint, 5), ym = st.y + (P.noise ? 0.04 * gauss(rand) : 0), e = r - ym;
        const a = dt / (0.05 + dt), yf = st.yf + a * (ym - st.yf), dy = (yf - st.yf) / dt; st.yf = yf;      // low-pass filtered derivative of the measurement
        const Pt = num(P.kp) * e, Dt = -num(P.kd) * dy, uRaw = Pt + st.I + Dt;
        const windingUp = (uRaw > pl.umax && e > 0) || (uRaw < pl.umin && e < 0);
        if (!(P.antiwindup && windingUp)) st.I = clamp(st.I + num(P.ki) * e * dt, -1e4, 1e4);
        st.u = clamp(Pt + st.I + Dt, pl.umin, pl.umax);
        return [r, ym];
      }
      function computeMetrics() {
        const r = stepInfo.r, d = r - stepInfo.y0, ad = Math.abs(d), pl = plant(), pts = [];
        for (let i = hist.length - 1; i >= 0 && hist[i][0] >= stepInfo.t0; i--) pts.push(hist[i]);
        pts.reverse();
        const m = { overshoot: NaN, rise: NaN, settle: NaN, ss: NaN, settled: false };
        if (pts.length > 5) {
          let ymax = -Infinity, ymin = Infinity, t10 = NaN, t90 = NaN, lastOut = stepInfo.t0; const tol = Math.max(0.02 * ad, 0.02);
          for (const h of pts) {
            const y = h[2]; if (y > ymax) ymax = y; if (y < ymin) ymin = y;
            if (ad > 0.05) { const f = (y - stepInfo.y0) / d; if (isNaN(t10) && f >= 0.1) t10 = h[0]; if (isNaN(t90) && f >= 0.9) t90 = h[0]; }
            if (Math.abs(y - r) > tol) lastOut = h[0];
          }
          m.settled = pts[pts.length - 1][0] - lastOut >= Math.max(0.6, 0.05 * pl.horizon);
          if (ad > 0.05) { m.overshoot = Math.max(0, (d > 0 ? ymax - r : r - ymin) / ad) * 100; if (!isNaN(t10) && !isNaN(t90)) m.rise = t90 - t10; }
          if (m.settled) m.settle = lastOut - stepInfo.t0;
          const n = Math.max(1, Math.floor(pts.length * 0.1)); let s = 0; for (let i = pts.length - n; i < pts.length; i++) s += pts[i][2]; m.ss = r - s / n;
        }
        metrics = m; checkChallenges(m);
      }
      function checkChallenges(m) {
        if (P.plant === "drone" && m.settled) {
          if (num(P.ki) === 0 && Math.abs(m.ss) > 0.3) flags.sawPError = true;
          if (flags.sawPError && num(P.ki) > 0 && Math.abs(m.ss) < 0.05) api.award("kill_ss_error");
          if (stepInfo.big && Number.isFinite(m.rise) && m.overshoot <= 5 && m.rise <= 1.5 && Math.abs(m.ss) < 0.1) api.award("tight_tune");
          if (!stepInfo.aw && num(P.ki) > 0 && m.overshoot > 30) { flags.sawWindup = true; flags.windupOS = Math.max(flags.windupOS, m.overshoot); }
          if (stepInfo.aw && flags.sawWindup && stepInfo.big && m.overshoot < flags.windupOS * 0.7) api.award("windup_tamed");
        }
        if (P.plant === "heater" && hist.length > 150) { // sustained (non-decaying) oscillation around the setpoint
          const r = stepInfo.r, n = hist.length; let cross = 0, prev = 0, aMid = 0, aEnd = 0;
          for (let i = 0; i < n; i++) { const e = hist[i][2] - r, s = Math.sign(e), a = Math.abs(e); if (prev && s && s !== prev) cross++; if (s) prev = s; if (i > n * 0.33 && i < n * 0.66) aMid = Math.max(aMid, a); if (i >= n * 0.66) aEnd = Math.max(aEnd, a); }
          if (cross >= 6 && aEnd > 0.5 && aEnd > 0.7 * aMid) api.award("heater_limit");
        }
      }
      api.loop((dtReal) => {
        const pl = plant(), dt = pl.dt, steps = Math.min(600, Math.round((dtReal * num(P.speed, 2)) / dt)), every = pl.horizon / 500;
        for (let i = 0; i < steps; i++) { const [r, ym] = control(dt); physics(dt, st.u); tNow += dt; acc += dt; if (acc >= every) { acc = 0; hist.push([tNow, r, st.y, ym, st.u]); } }
        const cut = tNow - pl.horizon - 1; while (hist.length && hist[0][0] < cut) hist.shift();
        computeMetrics(); draw(); if ((frame++ % 6) === 0) readout();
      });
      function draw() {
        const w = cv.width, h = cv.height, pl = plant(); clearCanvas(ctx, w, h, C);
        const t1 = Math.max(pl.horizon, tNow), t0 = t1 - pl.horizon, r = num(P.setpoint, 5);
        let ymax = Math.max(10, r * 1.2), ymin = 0;
        for (let i = Math.max(0, hist.length - 500); i < hist.length; i++) { const y = hist[i][2]; if (y > ymax) ymax = y; if (y < ymin) ymin = y; }
        ymax = Math.min(ymax * 1.05, 1e6); ymin = Math.max(ymin * 1.05, -1e6);
        const top = { x: 46, y: 18, w: w - 58, h: Math.round(h * 0.54) }, bot = { x: 46, y: top.y + top.h + 26, w: w - 58, h: h - top.h - 64 };
        const p1 = plot(ctx, C, top, [t0, t1], [ymin, ymax], { title: pl.name + " — output vs setpoint (plot units ×" + pl.scale + " = " + pl.unit + ")", yd: 1, xl: "t (s)" });
        p1.line(hist.map((q) => [q[0], q[1]]), C.accent, 1.5, [6, 4]);
        if (P.noise) p1.dots(hist.filter((_, i) => i % 2 === 0).map((q) => [q[0], q[3]]), "rgba(255,255,255,0.25)", 1.5);
        p1.line(hist.map((q) => [q[0], q[2]]), C.primary, 2);
        if (stepInfo.t0 > t0) p1.vline(stepInfo.t0, C.muted);
        p1.legend([["setpoint", C.accent], ["output", C.primary]]);
        const span = pl.umax - pl.umin, p2 = plot(ctx, C, bot, [t0, t1], [pl.umin - 0.1 * span, pl.umax + 0.1 * span], { title: "control effort — " + pl.uname + " (" + pl.uunit + ")", yd: 0, ny: 2 });
        p2.hline(pl.umax, C.danger, [2, 4]); p2.hline(pl.umin, C.danger, [2, 4]);
        p2.line(hist.map((q) => [q[0], q[4]]), C.secondary, 1.5);
        if (metrics.settled) text(ctx, "settled", top.x + top.w - 6, top.y + top.h - 6, C.ok, { align: "right", size: 10 });
      }
      function readout() {
        const pl = plant(), sc = pl.scale, m = metrics, r = num(P.setpoint, 5);
        api.readout({
          "Setpoint": fx(r * sc, 1) + " " + pl.unit, "Output": fx(st.y * sc, 2) + " " + pl.unit,
          "Overshoot": Number.isFinite(m.overshoot) ? fx(m.overshoot, 1) + " %" : "— (step too small)",
          "Rise time (10→90 %)": Number.isFinite(m.rise) ? fx(m.rise, 2) + " s" : "—",
          "Settling time (±2 %)": Number.isFinite(m.settle) ? fx(m.settle, 2) + " s" : (m.settled ? "0 s" : "not settled yet"),
          "Steady-state error": Number.isFinite(m.ss) ? fx(m.ss * sc, 2) + " " + pl.unit + (m.settled ? "" : " (settling…)") : "—",
          "Control effort": fx(st.u, 2) + " " + pl.uunit + (st.u >= pl.umax - 1e-9 || st.u <= pl.umin + 1e-9 ? " (saturated!)" : ""),
          "Integral term": fx(st.I, 2),
        });
      }
      api.onParam((k) => {
        if (k === "plant") { reset(); api.setStatus(plant().name + ": state reset. " + (P.plant === "heater" ? "Dead time 1.5 s, time constant 8 s — patience, and watch what Kd can and cannot do." : P.plant === "motor" ? "First-order plant: with P only, where does it settle and why?" : "Gravity acts like a constant disturbance of 9.81 N.")); }
        else if (k === "setpoint") newStep();
      });
      api.setStatus("Drone hovering with P-D only. Notice the gap below the setpoint — then try Ki, Step setpoint and a disturbance.");
      return {
        step() { api.setParam("setpoint", num(P.setpoint, 5) >= 5 ? 2.5 : 7.5); },
        disturb() { if (P.plant === "motor") st.distT = 2; else if (P.plant === "heater") st.y -= 2.5; else st.v -= 3; newStep({ big: false }); api.setStatus(P.plant === "motor" ? "Load torque applied for 2 s — watch the speed sag and recover." : P.plant === "heater" ? "A door opened: sudden heat loss of 25 °C." : "Downdraft gust: −3 m/s vertical speed."); },
        restart() { reset(); },
        destroy() {},
      };
    },
  });

  // ======================= 2. Robot arm (inverse kinematics) =======================
  S.register({
    id: "robot_arm",
    name: "Planar Robot Arm — Inverse Kinematics",
    domains: ["robotics"],
    description: "Drag the target: a 2-link arm solves inverse kinematics analytically (two elbow solutions, a donut-shaped workspace, singular at full stretch). Add a third link and watch an iterative Jacobian-transpose solver converge instead.",
    params: [
      { key: "l1", label: "Link 1 length (m)", type: "range", min: 0.3, max: 2, step: 0.05, value: 1.2 },
      { key: "l2", label: "Link 2 length (m)", type: "range", min: 0.3, max: 2, step: 0.05, value: 0.9 },
      { key: "elbow", label: "Elbow up (off = elbow down)", type: "toggle", value: true },
      { key: "third", label: "3-link arm (Jacobian-transpose IK)", type: "toggle", value: false },
      { key: "l3", label: "Link 3 length (m)", type: "range", min: 0.2, max: 1.5, step: 0.05, value: 0.6 },
      { key: "jointSpeed", label: "Joint speed limit (rad/s)", type: "range", min: 0.5, max: 12, step: 0.5, value: 3 },
      { key: "trace", label: "Trace end-effector path", type: "toggle", value: true },
    ],
    actions: [{ label: "Demo: trace a circle", fn: (h) => h.demo() }, { label: "Clear trace", fn: (h) => h.clearTrace() }],
    challenges: [
      { id: "two_solutions", xp: 10, text: "Park the target somewhere reachable and flip Elbow up/down a few times: same hand position, different joint angles. Why does 2-link IK have exactly two answers — and where does it have only one?" },
      { id: "singularity", xp: 15, text: "Drag the target to the outer rim of the workspace and watch manipulability fall towards 0. What happens to the joint speeds needed for a small hand motion there?" },
      { id: "donut_hole", xp: 15, text: "Make L1 at least 0.3 m longer than L2 and try to touch the base: the inner hole of the annulus is unreachable. What sets its radius?" },
      { id: "redundant", xp: 20, text: "Enable the 3rd link and drag the target around: now infinitely many joint solutions exist. What decides which one the iterative solver lands on?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, P = api.params;
      let target = { x: 1.2, y: 0.9 }, cur = [0.4, 1.2, 0.3], goal = cur.slice(), trail = [], dragging = false, demoT = 0, demoOn = true, frame = 0;
      const info = { reach: true, why: "", manip: 1, tx: 0, ty: 0, other: null, elbowFlips: 0, dragged: 0 };
      const lens = () => [num(P.l1, 1.2), num(P.l2, 0.9), P.third ? num(P.l3, 0.6) : 0];
      const geom = () => { const L = lens(), Rm = L[0] + L[1] + L[2], s = Math.min(cv.width, cv.height) * 0.46 / Rm; return { L, Rm, s, cx: cv.width / 2, cy: cv.height * 0.56 }; };
      function fk(t, L) { const pts = [{ x: 0, y: 0 }]; let a = 0, x = 0, y = 0; for (let i = 0; i < L.length && L[i] > 0; i++) { a += t[i]; x += L[i] * Math.cos(a); y += L[i] * Math.sin(a); pts.push({ x, y }); } return pts; }
      function jacobian(t, L) { const pts = fk(t, L), e = pts[pts.length - 1]; return pts.slice(0, -1).map((p) => [-(e.y - p.y), e.x - p.x]); } // column i = ∂(end effector)/∂θi
      function ik2(x, y, l1, l2, up) {
        const r = Math.hypot(x, y), rmin = Math.abs(l1 - l2), rmax = l1 + l2; let reach = true, why = "", tx = x, ty = y;
        if (r > rmax) { reach = false; why = "too far — clamped to the outer rim"; tx = x * rmax / r; ty = y * rmax / r; }
        else if (r < rmin) { reach = false; why = "inside the inner hole — clamped to the inner rim"; if (r > 1e-9) { tx = x * rmin / r; ty = y * rmin / r; } else { tx = rmin; ty = 0; } }
        const D = clamp((tx * tx + ty * ty - l1 * l1 - l2 * l2) / (2 * l1 * l2), -1, 1);
        const sols = [1, -1].map((sgn) => { const t2 = sgn * Math.acos(D), t1 = Math.atan2(ty, tx) - Math.atan2(l2 * Math.sin(t2), l1 + l2 * Math.cos(t2)); return { t: [t1, t2, 0], ey: l1 * Math.sin(t1) }; });
        sols.sort((a, b) => b.ey - a.ey); // sols[0] has the higher elbow
        return { t: (up ? sols[0] : sols[1]).t, other: (up ? sols[1] : sols[0]).t, reach, why, tx, ty };
      }
      function ikJT(x, y, L, iters) { // Jacobian-transpose iterations starting from the current configuration
        const t = cur.slice(), rmax = L[0] + L[1] + L[2], r = Math.hypot(x, y); let reach = true, why = "";
        if (r > rmax) { reach = false; why = "too far — clamped to the outer rim"; x *= rmax / r; y *= rmax / r; }
        for (let k = 0; k < iters; k++) {
          const pts = fk(t, L), e = pts[pts.length - 1], ex = x - e.x, ey = y - e.y; if (ex * ex + ey * ey < 1e-8) break;
          const J = jacobian(t, L), g = J.map((c) => c[0] * ex + c[1] * ey); // Jᵀ e
          let jx = 0, jy = 0; J.forEach((c, i) => { jx += c[0] * g[i]; jy += c[1] * g[i]; }); // J Jᵀ e
          const den = jx * jx + jy * jy, alpha = den > 1e-12 ? (ex * jx + ey * jy) / den : 0.05;
          for (let i = 0; i < 3; i++) t[i] += alpha * g[i];
        }
        return { t, other: null, reach, why, tx: x, ty: y };
      }
      function manip(t, L) { const J = jacobian(t, L); let a = 0, b = 0, c = 0; J.forEach((col) => { a += col[0] * col[0]; b += col[0] * col[1]; c += col[1] * col[1]; }); const norm = L.length > 2 && L[2] > 0 ? L[0] * L[1] + L[1] * L[2] + L[0] * L[2] : L[0] * L[1]; return Math.sqrt(Math.max(0, a * c - b * b)) / (norm || 1); }
      api.loop((dt) => {
        const { L, Rm } = geom();
        if (demoOn) { demoT += dt; target = { x: Rm * 0.08 + Rm * 0.42 * Math.cos(demoT * 0.8), y: 0.15 * Rm + Rm * 0.32 * Math.sin(demoT * 0.8) }; }
        const sol = P.third ? ikJT(target.x, target.y, L, 25) : ik2(target.x, target.y, L[0], L[1], !!P.elbow);
        goal = sol.t; info.other = sol.other; info.reach = sol.reach; info.why = sol.why; info.tx = sol.tx; info.ty = sol.ty;
        const maxStep = num(P.jointSpeed, 3) * dt;
        for (let i = 0; i < 3; i++) cur[i] += clamp(wrapAngle((goal[i] || 0) - cur[i]), -maxStep, maxStep);
        info.manip = manip(cur, L);
        const pts = fk(cur, L), e = pts[pts.length - 1];
        if (P.trace) { trail.push([e.x, e.y]); if (trail.length > 700) trail.shift(); }
        if (info.dragged > 0) {
          if (!P.third && info.reach && info.manip < 0.08 && Math.hypot(target.x, target.y) > 0.9 * (L[0] + L[1])) api.award("singularity");
          if (!P.third && !info.reach && /inner/.test(info.why) && Math.abs(L[0] - L[1]) >= 0.3) api.award("donut_hole");
          if (P.third && info.dragged > 2) api.award("redundant");
        }
        draw(pts); if ((frame++ % 6) === 0) readout(L, pts);
      });
      function draw(pts) {
        const { L, Rm, s, cx, cy } = geom(), w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C);
        const X = (x) => cx + x * s, Y = (y) => cy - y * s;
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
        for (let g = -Math.ceil(Rm) - 1; g <= Math.ceil(Rm) + 1; g++) { ctx.beginPath(); ctx.moveTo(X(g), 0); ctx.lineTo(X(g), h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, Y(g)); ctx.lineTo(w, Y(g)); ctx.stroke(); }
        const rmin = P.third ? 0 : Math.abs(L[0] - L[1]);
        ctx.beginPath(); ctx.arc(cx, cy, Rm * s, 0, TAU); if (rmin > 0) ctx.arc(cx, cy, rmin * s, 0, TAU, true); ctx.fillStyle = "rgba(124,156,255,0.10)"; ctx.fill("evenodd");
        circle(ctx, cx, cy, Rm * s, null, C.axis); if (rmin > 0) circle(ctx, cx, cy, rmin * s, null, C.axis);
        text(ctx, P.third ? "reachable disc: r ≤ L1+L2+L3 (3 links)" : "reachable annulus: |L1−L2| ≤ r ≤ L1+L2", 10, 16, C.muted);
        if (trail.length > 1) polyline(ctx, trail.map((p) => [X(p[0]), Y(p[1])]), C.accent, 1.5);
        if (!P.third && info.other) { const g = fk(info.other, L); ctx.lineCap = "round"; polyline(ctx, g.map((p) => [X(p.x), Y(p.y)]), "rgba(255,255,255,0.15)", 7); text(ctx, "other elbow solution", X(g[1].x) + 8, Y(g[1].y) - 8, "rgba(255,255,255,0.35)", { size: 10 }); }
        ctx.lineCap = "round";
        for (let i = 1; i < pts.length; i++) { ctx.strokeStyle = C.series[i - 1]; ctx.lineWidth = 11 - 2 * i; ctx.beginPath(); ctx.moveTo(X(pts[i - 1].x), Y(pts[i - 1].y)); ctx.lineTo(X(pts[i].x), Y(pts[i].y)); ctx.stroke(); }
        pts.forEach((p, i) => circle(ctx, X(p.x), Y(p.y), i === 0 ? 7 : 5, C.bg, C.text, 2));
        const e = pts[pts.length - 1];
        { // manipulability (velocity) ellipse = eigen-decomposition of J Jᵀ
          const J = jacobian(cur, L); let a = 0, b = 0, c = 0; J.forEach((col) => { a += col[0] * col[0]; b += col[0] * col[1]; c += col[1] * col[1]; });
          const tr = (a + c) / 2, dd = Math.sqrt(Math.max(0, ((a - c) / 2) ** 2 + b * b)), l1 = tr + dd, l2 = Math.max(0, tr - dd), ang = Math.atan2(l1 - a, b);
          ctx.save(); ctx.strokeStyle = C.ok; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.ellipse(X(e.x), Y(e.y), Math.max(1, 0.22 * Math.sqrt(l1) * s), Math.max(1, 0.22 * Math.sqrt(l2) * s), -ang, 0, TAU); ctx.stroke(); ctx.restore();
        }
        const tc = info.reach ? C.ok : C.danger; ctx.strokeStyle = tc; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X(target.x) - 10, Y(target.y)); ctx.lineTo(X(target.x) + 10, Y(target.y)); ctx.moveTo(X(target.x), Y(target.y) - 10); ctx.lineTo(X(target.x), Y(target.y) + 10); ctx.stroke(); circle(ctx, X(target.x), Y(target.y), 6, null, tc, 2);
        if (!info.reach) { circle(ctx, X(info.tx), Y(info.ty), 4, C.danger); text(ctx, "⚠ unreachable target: " + info.why, 10, h - 10, C.danger); }
        else text(ctx, demoOn ? "demo running — drag the target to take over" : "drag the target · dashed ellipse = velocity manipulability", 10, h - 10, C.muted);
      }
      function readout(L, pts) {
        const e = pts[pts.length - 1], o = { "θ1 shoulder": fx(deg(wrapAngle(cur[0])), 1) + "°", "θ2 elbow": fx(deg(wrapAngle(cur[1])), 1) + "°" };
        if (P.third) o["θ3 wrist"] = fx(deg(wrapAngle(cur[2])), 1) + "°";
        o["End effector (x, y)"] = fx(e.x, 2) + ", " + fx(e.y, 2) + " m"; o["Target (x, y)"] = fx(target.x, 2) + ", " + fx(target.y, 2) + " m";
        o["Target status"] = info.reach ? "reachable ✓" : "✗ " + info.why;
        o["Workspace radii"] = (P.third ? "0" : fx(Math.abs(L[0] - L[1]), 2)) + " … " + fx(L[0] + L[1] + L[2], 2) + " m";
        o["Manipulability (0 = singular)"] = fx(info.manip, 3); o["IK method"] = P.third ? "Jacobian transpose, 25 it/frame" : "analytic (law of cosines)";
        api.readout(o);
      }
      function setTargetFromPx(q) { const { s, cx, cy } = geom(); target = { x: (q.x - cx) / s, y: (cy - q.y) / s }; }
      api.pointer(cv.canvas, {
        down: (q) => { dragging = true; demoOn = false; setTargetFromPx(q); info.dragged += 0.01; },
        move: (q) => { if (!dragging) return; const o = target; setTargetFromPx(q); info.dragged += Math.hypot(target.x - o.x, target.y - o.y); },
        up: () => { dragging = false; },
      });
      api.onParam((k) => { if (k === "elbow" && info.reach && !P.third) { info.elbowFlips++; if (info.elbowFlips >= 2) api.award("two_solutions"); } if (k === "trace" && !P.trace) trail = []; if (k === "third") trail = []; });
      api.setStatus("Analytic IK: cos θ2 = (x² + y² − L1² − L2²) / (2 L1 L2). Drag the target anywhere — including outside the workspace.");
      return { demo() { demoOn = true; trail = []; }, clearTrace() { trail = []; }, destroy() {} };
    },
  });

  // ======================= 3. Differential drive =======================
  S.register({
    id: "differential_drive",
    name: "Differential-Drive Robot",
    domains: ["robotics"],
    description: "Drive a two-wheeled robot with independent wheel speeds (sliders, or arrow keys after clicking the canvas). See the instantaneous centre of curvature and turning radius, dead-reckoning drift, and a pure-pursuit autopilot chasing waypoints.",
    params: [
      { key: "vl", label: "Left wheel speed vL (m/s)", type: "range", min: -1, max: 1, step: 0.05, value: 0.5 },
      { key: "vr", label: "Right wheel speed vR (m/s)", type: "range", min: -1, max: 1, step: 0.05, value: 0.8 },
      { key: "L", label: "Wheelbase L (m)", type: "range", min: 0.2, max: 1, step: 0.05, value: 0.4 },
      { key: "autopilot", label: "Pure-pursuit autopilot", type: "toggle", value: false },
      { key: "lookahead", label: "Lookahead distance (m)", type: "range", min: 0.2, max: 3, step: 0.1, value: 1 },
      { key: "slip", label: "Wheel slip (show odometry drift)", type: "toggle", value: false },
    ],
    actions: [{ label: "Stop", fn: (h) => h.stop() }, { label: "Reset pose", fn: (h) => h.reset() }, { label: "New waypoints", fn: (h) => h.newCourse() }],
    challenges: [
      { id: "spin_in_place", xp: 10, text: "Make the robot spin on the spot for a full second. Which wheel speeds give turning radius R = 0?" },
      { id: "predict_radius", xp: 15, text: "Set vL = 0.3, vR = 0.6, L = 0.4 and compute the turning radius R = (L/2)·(vR + vL)/(vR − vL) before checking the readout." },
      { id: "course_manual", xp: 20, text: "Reach all four waypoints by hand (sliders or arrow keys) with the autopilot off." },
      { id: "pursuit_lookahead", xp: 20, text: "Let the autopilot finish the course twice (Reset pose in between): once with a tiny lookahead, once with a huge one. Which setting cuts corners and which one weaves?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, rand = makeRng(11), P = api.params;
      const W = 10, H = W * 9 / 16; // arena in metres
      let pose, odo, trail, otrail, course, path, prog, reached, finished, manualOnly, spinT = 0, frame = 0, tick = 0;
      const autoFinishes = [];
      function reset() { pose = { x: 1.5, y: H / 2, th: 0, dist: 0 }; odo = { x: 1.5, y: H / 2, th: 0, dist: 0 }; trail = []; otrail = []; reached = course.map(() => false); path = [{ x: pose.x, y: pose.y }].concat(course); prog = { seg: 0, t: 0 }; finished = false; manualOnly = !P.autopilot; }
      function newCourse() { course = []; let x = 1.5, y = H / 2; for (let i = 0; i < 4; i++) { let nx, ny, tries = 0; do { nx = 1 + rand() * (W - 2); ny = 0.8 + rand() * (H - 1.6); tries++; } while (Math.hypot(nx - x, ny - y) < 2.5 && tries < 60); course.push({ x: nx, y: ny }); x = nx; y = ny; } reset(); }
      newCourse();
      function move(q, vl, vr, L, dt) { // exact arc integration about the ICC
        const v = (vl + vr) / 2, w = (vr - vl) / L;
        if (Math.abs(w) < 1e-6) { q.x += v * Math.cos(q.th) * dt; q.y += v * Math.sin(q.th) * dt; }
        else { const R = v / w, icx = q.x - R * Math.sin(q.th), icy = q.y + R * Math.cos(q.th), th2 = q.th + w * dt; q.x = icx + R * Math.sin(th2); q.y = icy - R * Math.cos(th2); q.th = th2; }
        q.dist += Math.abs(v) * dt;
      }
      function lookaheadPoint(Ld) { // project onto the path (forward only), then walk Ld along it
        let best = null;
        for (let i = prog.seg; i < Math.min(path.length - 1, prog.seg + 2); i++) {
          const a = path[i], b = path[i + 1], abx = b.x - a.x, aby = b.y - a.y, l2 = abx * abx + aby * aby || 1e-9;
          let t = clamp(((pose.x - a.x) * abx + (pose.y - a.y) * aby) / l2, 0, 1); if (i === prog.seg) t = Math.max(t, prog.t);
          const d = Math.hypot(a.x + abx * t - pose.x, a.y + aby * t - pose.y); if (!best || d < best.d - 1e-9) best = { d, i, t };
        }
        if (best) prog = { seg: best.i, t: best.t };
        let rem = Ld, i = prog.seg, t = prog.t;
        while (i < path.length - 1) {
          const a = path[i], b = path[i + 1], len = Math.hypot(b.x - a.x, b.y - a.y) || 1e-9, left = len * (1 - t);
          if (rem <= left) { const tt = t + rem / len; return { x: a.x + (b.x - a.x) * tt, y: a.y + (b.y - a.y) * tt }; }
          rem -= left; i++; t = 0;
        }
        return path[path.length - 1];
      }
      function pursuit(L) {
        if (finished) return [0, 0];
        const tp = lookaheadPoint(num(P.lookahead, 1)), dx = tp.x - pose.x, dy = tp.y - pose.y, d = Math.max(0.05, Math.hypot(dx, dy));
        const alpha = wrapAngle(Math.atan2(dy, dx) - pose.th), kappa = 2 * Math.sin(alpha) / d, v = Math.abs(alpha) > 1.8 ? 0.2 : 0.7, w = v * kappa;
        let vl = v - w * L / 2, vr = v + w * L / 2; const m = Math.max(1, Math.abs(vl), Math.abs(vr)); return [vl / m, vr / m];
      }
      let quiet = false;
      api.loop((dt) => {
        const L = Math.max(0.05, num(P.L, 0.4)); let vl = num(P.vl), vr = num(P.vr);
        if (P.autopilot) { [vl, vr] = pursuit(L); manualOnly = false; if ((tick++ % 8) === 0) { quiet = true; api.setParam("vl", Math.round(vl * 20) / 20); api.setParam("vr", Math.round(vr * 20) / 20); quiet = false; } }
        const kl = P.slip ? 1.03 + 0.06 * gauss(rand) : 1, kr = P.slip ? 0.97 + 0.06 * gauss(rand) : 1;
        move(pose, vl * kl, vr * kr, L, dt); move(odo, vl, vr, L, dt);
        pose.x = clamp(pose.x, 0.3, W - 0.3); pose.y = clamp(pose.y, 0.3, H - 0.3);
        if ((frame % 3) === 0) { trail.push([pose.x, pose.y]); otrail.push([odo.x, odo.y]); if (trail.length > 1500) { trail.shift(); otrail.shift(); } }
        const next = reached.indexOf(false);
        if (next >= 0 && Math.hypot(course[next].x - pose.x, course[next].y - pose.y) < 0.35) {
          reached[next] = true;
          if (next === course.length - 1) { finished = true; if (manualOnly) { api.award("course_manual"); api.setStatus("Course complete by hand! 🎉 Press New waypoints for another."); } else { autoFinishes.push(num(P.lookahead, 1)); if (Math.max(...autoFinishes) - Math.min(...autoFinishes) >= 1.5) api.award("pursuit_lookahead"); api.setStatus("Autopilot finished with lookahead " + fx(num(P.lookahead, 1), 1) + " m. Reset pose, change the lookahead and compare the track."); } }
        }
        if (Math.abs(vl + vr) < 0.02 && Math.abs(vr - vl) >= 0.3) { spinT += dt; if (spinT > 1) api.award("spin_in_place"); } else spinT = 0;
        draw(L, vl, vr); if ((frame++ % 6) === 0) readout(L, vl, vr);
      });
      function drawRobot(q, L, s, X, Y, ghost) {
        ctx.save(); ctx.translate(X(q.x), Y(q.y)); ctx.rotate(-q.th); ctx.globalAlpha = ghost ? 0.45 : 1;
        const hw = (L / 2) * s, bl = Math.max(10, 0.3 * s);
        ctx.fillStyle = ghost ? C.secondary : C.primary; ctx.beginPath(); ctx.moveTo(bl, 0); ctx.lineTo(-bl * 0.7, hw * 0.9); ctx.lineTo(-bl * 0.7, -hw * 0.9); ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.text; ctx.fillRect(-bl * 0.45, hw - 3, bl * 0.6, 6); ctx.fillRect(-bl * 0.45, -hw - 3, bl * 0.6, 6);
        ctx.restore();
      }
      function draw(L, vl, vr) {
        const w = cv.width, h = cv.height, s = w / W; clearCanvas(ctx, w, h, C);
        const X = (x) => x * s, Y = (y) => h - y * s;
        ctx.strokeStyle = C.grid; for (let g = 0; g <= W; g++) { ctx.beginPath(); ctx.moveTo(X(g), 0); ctx.lineTo(X(g), h); ctx.stroke(); } for (let g = 0; g <= H; g++) { ctx.beginPath(); ctx.moveTo(0, Y(g)); ctx.lineTo(w, Y(g)); ctx.stroke(); }
        polyline(ctx, path.map((p) => [X(p.x), Y(p.y)]), "rgba(255,255,255,0.15)", 1, [4, 6]);
        course.forEach((p, i) => { circle(ctx, X(p.x), Y(p.y), 0.35 * s, reached[i] ? "rgba(110,231,183,0.25)" : "rgba(255,209,102,0.15)", reached[i] ? C.ok : C.accent, 1.5); text(ctx, i + 1, X(p.x), Y(p.y) + 4, C.text, { align: "center", bold: true }); });
        polyline(ctx, trail.map((p) => [X(p[0]), Y(p[1])]), C.primary, 1.5); if (P.slip) polyline(ctx, otrail.map((p) => [X(p[0]), Y(p[1])]), C.secondary, 1.5, [3, 3]);
        const v = (vl + vr) / 2, om = (vr - vl) / L;
        if (Math.abs(om) > 1e-3 && Math.abs(v / om) < 60) {
          const R = v / om, icx = pose.x - R * Math.sin(pose.th), icy = pose.y + R * Math.cos(pose.th);
          ctx.save(); ctx.setLineDash([3, 4]); circle(ctx, X(icx), Y(icy), Math.abs(R) * s, null, "rgba(255,209,102,0.5)"); ctx.restore();
          ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(icx), Y(icy)); ctx.lineTo(X(pose.x), Y(pose.y)); ctx.stroke(); circle(ctx, X(icx), Y(icy), 4, C.accent);
          text(ctx, "ICC · R = " + fx(Math.abs(R), 2) + " m", X(icx) + 8, Y(icy) - 6, C.accent);
        }
        if (P.autopilot && !finished) { const tp = lookaheadPoint(num(P.lookahead, 1)); circle(ctx, X(tp.x), Y(tp.y), 5, C.ok); ctx.save(); ctx.setLineDash([2, 3]); circle(ctx, X(pose.x), Y(pose.y), num(P.lookahead, 1) * s, null, "rgba(110,231,183,0.4)"); ctx.restore(); }
        if (P.slip) drawRobot(odo, L, s, X, Y, true);
        drawRobot(pose, L, s, X, Y, false);
        text(ctx, "click the canvas, then ↑ ↓ ← → to drive · space = stop" + (P.slip ? " · pink ghost = where odometry thinks the robot is" : ""), 10, h - 8, C.muted);
      }
      function readout(L, vl, vr) {
        const v = (vl + vr) / 2, om = (vr - vl) / L, R = Math.abs(om) > 1e-6 ? v / om : Infinity;
        api.readout({
          "Linear velocity v": fx(v, 2) + " m/s", "Angular velocity ω": fx(om, 2) + " rad/s (" + fx(deg(om), 0) + "°/s)",
          "Turning radius R": !Number.isFinite(R) ? "∞ (straight line)" : Math.abs(R) < 1e-3 ? "0 (spin in place)" : fx(Math.abs(R), 2) + " m",
          "Pose (x, y, θ)": fx(pose.x, 2) + ", " + fx(pose.y, 2) + " m, " + fx(deg(wrapAngle(pose.th)), 0) + "°",
          "Distance travelled": fx(pose.dist, 1) + " m",
          "Odometry drift": P.slip ? fx(Math.hypot(odo.x - pose.x, odo.y - pose.y), 2) + " m" : "off (enable wheel slip)",
          "Waypoints reached": reached.filter(Boolean).length + " / " + reached.length,
          "Control": P.autopilot ? "autopilot — pure pursuit" : "manual",
        });
      }
      cv.canvas.tabIndex = 0; cv.canvas.style.outline = "none";
      const onKey = (e) => {
        let dl = 0, dr = 0;
        if (e.key === "ArrowUp") { dl = dr = 0.1; } else if (e.key === "ArrowDown") { dl = dr = -0.1; } else if (e.key === "ArrowLeft") { dl = -0.1; dr = 0.1; } else if (e.key === "ArrowRight") { dl = 0.1; dr = -0.1; }
        else if (e.key === " ") { e.preventDefault(); api.setParam("vl", 0); api.setParam("vr", 0); return; } else return;
        e.preventDefault(); if (P.autopilot) api.setParam("autopilot", false);
        api.setParam("vl", clamp(Math.round((num(P.vl) + dl) * 20) / 20, -1, 1)); api.setParam("vr", clamp(Math.round((num(P.vr) + dr) * 20) / 20, -1, 1));
      };
      cv.canvas.addEventListener("keydown", onKey);
      api.pointer(cv.canvas, { down: () => { try { cv.canvas.focus(); } catch (e) { /* ignore */ } } });
      api.onParam((k) => { if (quiet) return; if (k === "autopilot") { if (P.autopilot) { manualOnly = false; if (finished) reset(); api.setStatus("Pure pursuit: steer with curvature κ = 2 sin α / d towards a point a lookahead distance ahead on the path."); } } });
      api.setStatus("Unequal wheel speeds make the robot circle around the ICC. Try vL = −vR, then chase the numbered waypoints.");
      return {
        stop() { api.setParam("autopilot", false); api.setParam("vl", 0); api.setParam("vr", 0); },
        reset() { reset(); api.setStatus("Pose reset."); },
        newCourse() { newCourse(); api.setStatus("New waypoints laid out."); },
        destroy() { cv.canvas.removeEventListener("keydown", onKey); },
      };
    },
  });

  // ======================= 4. Path planning =======================
  const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], D8 = D4.concat([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  function Heap() {
    const a = [], less = (i, j) => a[i].f < a[j].f || (a[i].f === a[j].f && (a[i].h < a[j].h || (a[i].h === a[j].h && a[i].seq < a[j].seq)));
    const swap = (i, j) => { const t = a[i]; a[i] = a[j]; a[j] = t; };
    return {
      get size() { return a.length; },
      push(n) { a.push(n); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (less(i, p)) { swap(i, p); i = p; } else break; } },
      pop() { const top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && less(l, m)) m = l; if (r < a.length && less(r, m)) m = r; if (m === i) break; swap(i, m); i = m; } } return top; },
    };
  }
  S.register({
    id: "path_planning",
    name: "Path Planning Playground",
    domains: ["robotics", "ai"],
    description: "Paint obstacles, then watch BFS, Dijkstra, A* and greedy best-first expand their frontiers cell by cell — or grow a rapidly-exploring random tree. Compare nodes expanded against path cost and the true optimum.",
    params: [
      { key: "algo", label: "Algorithm", type: "select", value: "astar", options: [
        { value: "bfs", label: "Breadth-first search (FIFO)" }, { value: "dijkstra", label: "Dijkstra (uniform cost)" }, { value: "astar", label: "A*  f = g + h" }, { value: "greedy", label: "Greedy best-first  f = h" }, { value: "rrt", label: "RRT (continuous sampling)" }] },
      { key: "heuristic", label: "Heuristic (A*, greedy)", type: "select", value: "manhattan", options: [
        { value: "manhattan", label: "Manhattan (octile when diagonal)" }, { value: "euclidean", label: "Euclidean √(dx²+dy²)" }, { value: "euclid2", label: "Euclidean × 2 (inadmissible)" }] },
      { key: "diag", label: "Diagonal moves (8-connected, cost √2)", type: "toggle", value: false },
      { key: "mode", label: "Click / drag on the map", type: "select", value: "wall", options: [{ value: "wall", label: "paints walls" }, { value: "erase", label: "erases walls" }, { value: "start", label: "moves the start" }, { value: "goal", label: "moves the goal" }] },
      { key: "speed", label: "Expansions per frame", type: "range", min: 1, max: 60, step: 1, value: 4 },
    ],
    actions: [{ label: "▶ Run", fn: (h) => h.run() }, { label: "Step", fn: (h) => h.step() }, { label: "❚❚ Pause", fn: (h) => h.pause() }, { label: "Random map", fn: (h) => h.randomMap() }, { label: "Clear walls", fn: (h) => h.clearWalls() }],
    challenges: [
      { id: "greedy_trap", xp: 15, text: "Build (or keep) a U-shaped pocket that opens towards the start and run Greedy best-first: it dives in and comes out with a path ≥ 15 % longer than optimal. Then run A* on the same map." },
      { id: "heuristic_speed", xp: 15, text: "Run Dijkstra and then A* (Manhattan or Euclidean) on the same map: A* expands under 70 % of the nodes yet finds the same optimal cost. Why does an admissible heuristic guarantee this?" },
      { id: "bfs_diag", xp: 15, text: "Turn on diagonal moves and run BFS: its path costs more than Dijkstra's. Why does BFS stop being optimal as soon as step costs differ?" },
      { id: "rrt_variance", xp: 20, text: "Run RRT three times on the same map (press ▶ Run again after it finishes). The path changes every time — what does RRT guarantee, and what doesn't it?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, P = api.params, rand = makeRng(3);
      const COLS = 32, ROWS = 18, N = COLS * ROWS, walls = new Uint8Array(N);
      let start = { x: 2, y: 9 }, goal = { x: 29, y: 9 }, SS = null, running = false, painting = false, lastCell = null, silent = false, frame = 0, optCost = NaN, results = {}, rrtCosts = [];
      const idx = (x, y) => y * COLS + x, inB = (x, y) => x >= 0 && y >= 0 && x < COLS && y < ROWS;
      const algoName = () => ({ bfs: "BFS", dijkstra: "Dijkstra", astar: "A* (" + P.heuristic + ")", greedy: "Greedy (" + P.heuristic + ")", rrt: "RRT" })[P.algo] || P.algo;
      function heuristic(x, y) {
        const dx = Math.abs(x - goal.x), dy = Math.abs(y - goal.y);
        if (P.heuristic === "euclidean") return Math.hypot(dx, dy); if (P.heuristic === "euclid2") return 2 * Math.hypot(dx, dy);
        return P.diag ? Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy) : dx + dy; // octile keeps "Manhattan" admissible on 8-connected grids
      }
      const key = (algo, g, h, depth) => (algo === "bfs" ? depth : algo === "dijkstra" ? g : algo === "greedy" ? h : g + h);
      function initSearch(algo) {
        algo = algo || P.algo;
        if (algo === "rrt") { SS = { algo, nodes: [{ x: start.x + 0.5, y: start.y + 0.5, parent: -1, cost: 0 }], samples: 0, expanded: 1, done: false, found: false, path: [], cost: NaN }; return; }
        const g = new Float64Array(N).fill(Infinity), parent = new Int32Array(N).fill(-1), closed = new Uint8Array(N), inOpen = new Uint8Array(N), open = Heap(), s0 = idx(start.x, start.y), h0 = heuristic(start.x, start.y);
        g[s0] = 0; open.push({ i: s0, f: key(algo, 0, h0, 0), h: h0, seq: 0, depth: 0 }); inOpen[s0] = 1;
        SS = { algo, g, parent, closed, inOpen, open, seq: 1, expanded: 0, done: false, found: false, path: [], cost: NaN, maxg: 1 };
      }
      function stepSearch() {
        const s = SS; if (!s || s.done) return; if (s.algo === "rrt") return stepRRT();
        if (!s.open.size) { s.done = true; onDone(); return; }
        const cur = s.open.pop(); if (s.closed[cur.i]) return; s.closed[cur.i] = 1; s.inOpen[cur.i] = 0; s.expanded++;
        const cx = cur.i % COLS, cy = (cur.i / COLS) | 0;
        if (cx === goal.x && cy === goal.y) { s.done = true; s.found = true; s.cost = s.g[cur.i]; for (let i = cur.i; i >= 0; i = s.parent[i]) s.path.push(i); s.path.reverse(); onDone(); return; }
        for (const [dx, dy] of (P.diag ? D8 : D4)) {
          const nx = cx + dx, ny = cy + dy; if (!inB(nx, ny) || walls[idx(nx, ny)]) continue;
          if (dx && dy && (walls[idx(cx + dx, cy)] || walls[idx(cx, cy + dy)])) continue; // no corner cutting
          const ni = idx(nx, ny); if (s.closed[ni]) continue;
          const ng = s.g[cur.i] + (dx && dy ? Math.SQRT2 : 1);
          if (s.algo === "bfs") { if (s.inOpen[ni]) continue; } else if (ng >= s.g[ni] - 1e-12) continue;
          s.g[ni] = ng; s.parent[ni] = cur.i; s.inOpen[ni] = 1; const hh = heuristic(nx, ny);
          s.open.push({ i: ni, f: key(s.algo, ng, hh, cur.depth + 1), h: hh, seq: s.seq++, depth: cur.depth + 1 }); if (ng > s.maxg) s.maxg = ng;
        }
      }
      function segFree(x1, y1, x2, y2) { const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 0.25) + 1; for (let k = 0; k <= n; k++) { const t = k / n, cx = Math.floor(x1 + (x2 - x1) * t), cy = Math.floor(y1 + (y2 - y1) * t); if (!inB(cx, cy) || walls[idx(cx, cy)]) return false; } return true; }
      function stepRRT() {
        const s = SS; if (s.nodes.length > 4000 || s.samples > 20000) { s.done = true; onDone(); return; }
        s.samples++; const gb = rand() < 0.08, sx = gb ? goal.x + 0.5 : rand() * COLS, sy = gb ? goal.y + 0.5 : rand() * ROWS;
        let bi = 0, bd = Infinity; for (let i = 0; i < s.nodes.length; i++) { const n = s.nodes[i], d = (n.x - sx) ** 2 + (n.y - sy) ** 2; if (d < bd) { bd = d; bi = i; } }
        const near = s.nodes[bi], d = Math.sqrt(bd) || 1e-9, step = Math.min(1.5, d), nx = near.x + (sx - near.x) / d * step, ny = near.y + (sy - near.y) / d * step;
        if (!segFree(near.x, near.y, nx, ny)) return;
        const node = { x: nx, y: ny, parent: bi, cost: near.cost + step }; s.nodes.push(node); s.expanded = s.nodes.length;
        const gx = goal.x + 0.5, gy = goal.y + 0.5, dg = Math.hypot(nx - gx, ny - gy);
        if (dg < 1 && segFree(nx, ny, gx, gy)) { s.done = true; s.found = true; s.cost = node.cost + dg; const pts = [{ x: gx, y: gy }]; for (let i = s.nodes.length - 1; i >= 0; i = s.nodes[i].parent) pts.push(s.nodes[i]); s.path = pts.reverse(); onDone(); }
      }
      function computeOptimal() { const saved = SS; silent = true; initSearch("dijkstra"); let guard = 0; while (!SS.done && guard++ < N * 4) stepSearch(); optCost = SS.found ? SS.cost : NaN; silent = false; SS = saved; }
      function onDone() {
        if (silent) return; const s = SS, k = s.algo + (s.algo === "astar" || s.algo === "greedy" ? ":" + P.heuristic : "");
        results[k] = { cost: s.cost, expanded: s.expanded, found: s.found };
        if (s.found) {
          if (s.algo === "greedy" && s.cost > optCost * 1.15 + 1e-9) api.award("greedy_trap");
          if (s.algo === "bfs" && P.diag && s.cost > optCost + 1e-9) api.award("bfs_diag");
          const dj = results.dijkstra, as = results["astar:manhattan"] || results["astar:euclidean"];
          if (dj && as && as.expanded < 0.7 * dj.expanded && Math.abs(as.cost - dj.cost) < 1e-9) api.award("heuristic_speed");
          if (s.algo === "rrt") { rrtCosts.push(s.cost.toFixed(3)); if (rrtCosts.length >= 3 && new Set(rrtCosts).size >= 2) api.award("rrt_variance"); }
          const extra = Number.isFinite(optCost) ? (s.cost > optCost + 1e-9 ? ` — ${fx((s.cost / optCost - 1) * 100, 1)} % longer than optimal (${fx(optCost, 2)})` : " — optimal ✓") : "";
          api.setStatus(`${algoName()}: path cost ${fx(s.cost, 2)} after ${s.expanded} ${s.algo === "rrt" ? "tree nodes" : "expansions"}${extra}`);
        } else api.setStatus(algoName() + ": no path exists" + (s.algo === "rrt" ? " (sampling budget exhausted)" : "") + ".");
      }
      function onMapChange() { walls[idx(start.x, start.y)] = 0; walls[idx(goal.x, goal.y)] = 0; results = {}; rrtCosts = []; computeOptimal(); initSearch(); running = true; }
      function defaultMap() {
        walls.fill(0); for (let y = 4; y <= 13; y++) walls[idx(18, y)] = 1; for (let x = 12; x <= 18; x++) { walls[idx(x, 4)] = 1; walls[idx(x, 13)] = 1; }
        for (let i = 0; i < 45; i++) { const x = 1 + Math.floor(rand() * (COLS - 2)), y = Math.floor(rand() * ROWS); if (Math.abs(x - start.x) + Math.abs(y - start.y) > 2 && Math.abs(x - goal.x) + Math.abs(y - goal.y) > 2 && !(x > 11 && x < 19 && y > 3 && y < 14)) walls[idx(x, y)] = 1; }
        onMapChange();
      }
      function cellAt(q) { const cs = cv.width / COLS; return { x: Math.floor(q.x / cs), y: Math.floor(q.y / cs) }; }
      function paint(c) {
        if (!inB(c.x, c.y)) return; const i = idx(c.x, c.y), isS = c.x === start.x && c.y === start.y, isG = c.x === goal.x && c.y === goal.y;
        if (P.mode === "start") { if (!walls[i] && !isG) start = { x: c.x, y: c.y }; else return; }
        else if (P.mode === "goal") { if (!walls[i] && !isS) goal = { x: c.x, y: c.y }; else return; }
        else { if (isS || isG) return; const v = P.mode === "wall" ? 1 : 0; if (walls[i] === v) return; walls[i] = v; }
        onMapChange();
      }
      api.pointer(cv.canvas, { down: (q) => { painting = true; lastCell = cellAt(q); paint(lastCell); }, move: (q) => { if (!painting) return; const c = cellAt(q); if (!lastCell || c.x !== lastCell.x || c.y !== lastCell.y) { lastCell = c; paint(c); } }, up: () => { painting = false; lastCell = null; } });
      api.loop(() => { if (running && SS && !SS.done) { const n = Math.round(num(P.speed, 4)); for (let i = 0; i < n && !SS.done; i++) stepSearch(); if (SS.done) running = false; } draw(); if ((frame++ % 6) === 0) readout(); });
      function draw() {
        const w = cv.width, h = cv.height, cs = w / COLS, s = SS; clearCanvas(ctx, w, h, C);
        for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
          const i = idx(x, y); let fill = null;
          if (walls[i]) fill = "#3a4160";
          else if (s && s.algo !== "rrt") { if (s.closed[i]) fill = `rgba(124,156,255,${(0.16 + 0.4 * Math.min(1, s.g[i] / (s.maxg || 1))).toFixed(3)})`; else if (s.inOpen[i]) fill = "rgba(255,209,102,0.5)"; }
          if (fill) { ctx.fillStyle = fill; ctx.fillRect(x * cs, y * cs, cs, cs); }
        }
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1; for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * cs, 0); ctx.lineTo(x * cs, ROWS * cs); ctx.stroke(); } for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * cs); ctx.lineTo(w, y * cs); ctx.stroke(); }
        if (s && s.algo === "rrt") { ctx.strokeStyle = "rgba(124,156,255,0.55)"; ctx.lineWidth = 1; ctx.beginPath(); for (const n of s.nodes) { if (n.parent < 0) continue; const p = s.nodes[n.parent]; ctx.moveTo(p.x * cs, p.y * cs); ctx.lineTo(n.x * cs, n.y * cs); } ctx.stroke(); }
        if (s && s.path.length) { ctx.lineJoin = "round"; polyline(ctx, s.path.map((p) => (s.algo === "rrt" ? [p.x * cs, p.y * cs] : [((p % COLS) + 0.5) * cs, (((p / COLS) | 0) + 0.5) * cs])), C.ok, 3); }
        circle(ctx, (start.x + 0.5) * cs, (start.y + 0.5) * cs, cs * 0.38, C.ok); text(ctx, "S", (start.x + 0.5) * cs, (start.y + 0.5) * cs + 4, C.bg, { align: "center", bold: true });
        circle(ctx, (goal.x + 0.5) * cs, (goal.y + 0.5) * cs, cs * 0.38, C.danger); text(ctx, "G", (goal.x + 0.5) * cs, (goal.y + 0.5) * cs + 4, C.bg, { align: "center", bold: true });
      }
      function readout() {
        const s = SS || {}, sub = Number.isFinite(s.cost) && optCost > 0 ? (s.cost / optCost - 1) * 100 : NaN;
        api.readout({
          "Algorithm": algoName(), "Status": !s.algo ? "—" : s.done ? (s.found ? "path found ✓" : "no path ✗") : running ? "searching…" : "paused — Step or ▶ Run",
          "Nodes expanded": s.algo === "rrt" ? `${s.expanded} tree nodes · ${s.samples} samples` : String(s.expanded || 0),
          "Frontier size": s.open ? String(s.open.size) : "—", "Path cost": fx(s.cost, 2), "Path length (steps)": s.path && s.path.length ? String(s.path.length - 1) : "—",
          "Optimal cost (Dijkstra)": fx(optCost, 2), "Suboptimality": Number.isFinite(sub) ? "+" + fx(sub, 1) + " %" : "—",
        });
      }
      api.html(`<div style="font-size:.8rem;color:${C.muted}"><span style="color:${C.primary}">■</span> visited (darker = cheaper g) &nbsp; <span style="color:${C.accent}">■</span> frontier &nbsp; <span style="color:${C.ok}">■</span> path &nbsp; ■ wall. ` +
        `BFS ignores step costs (optimal only when every step costs the same); Dijkstra orders by g; A* by g + h and stays optimal when h never overestimates; greedy trusts h alone and can be lured into dead ends; RRT samples the continuous space and is probabilistically complete but not optimal.</div>`);
      api.onParam((k) => { if (k === "algo" || k === "heuristic") { initSearch(); running = true; } else if (k === "diag") onMapChange(); });
      defaultMap();
      api.setStatus("A* is expanding from S towards G. Paint walls while it runs — the search restarts live.");
      return {
        run() { if (!SS || SS.done) initSearch(); running = true; },
        step() { if (!SS || SS.done) initSearch(); running = false; stepSearch(); },
        pause() { running = false; },
        randomMap() { walls.fill(0); for (let i = 0; i < 6; i++) { const x = 3 + Math.floor(rand() * (COLS - 6)), y0 = Math.floor(rand() * ROWS), len = 3 + Math.floor(rand() * 8), vert = rand() < 0.6; for (let k = 0; k < len; k++) { const cx = vert ? x : x + k, cy = vert ? y0 + k : y0; if (inB(cx, cy)) walls[idx(cx, cy)] = 1; } } for (let i = 0; i < 50; i++) walls[idx(Math.floor(rand() * COLS), Math.floor(rand() * ROWS))] = 1; onMapChange(); },
        clearWalls() { walls.fill(0); onMapChange(); },
        destroy() {},
      };
    },
  });

  // ======================= 5. Kalman filter =======================
  S.register({
    id: "kalman_filter",
    name: "Kalman Filter Tracker",
    domains: ["robotics", "ai"],
    description: "A constant-velocity Kalman filter tracks a maneuvering target through noisy, sometimes missing measurements. Tune the process noise q and sensor noise R and watch the ±2σ belief band breathe.",
    params: [
      { key: "dims", label: "View", type: "select", value: "1d", options: [{ value: "1d", label: "1-D: position & velocity vs time" }, { value: "2d", label: "2-D: plan view" }] },
      { key: "logq", label: "Filter process noise log₁₀ q", type: "range", min: -3, max: 2, step: 0.1, value: -1.5 },
      { key: "r", label: "Sensor noise σ (m) — true and assumed", type: "range", min: 0.1, max: 5, step: 0.1, value: 1.5 },
      { key: "dropout", label: "Measurement dropout probability", type: "range", min: 0, max: 0.9, step: 0.05, value: 0.1 },
      { key: "maneuver", label: "Target maneuvers (random accelerations)", type: "toggle", value: true },
      { key: "speed", label: "Simulation speed ×", type: "range", min: 0.5, max: 4, step: 0.5, value: 1 },
    ],
    actions: [{ label: "Restart", fn: (h) => h.restart() }],
    challenges: [
      { id: "beat_sensor", xp: 15, text: "Tune q so the filter's RMSE drops below half of the raw sensor's RMSE while the target is maneuvering." },
      { id: "lag_sweet_spot", xp: 20, text: "Set log q ≤ −2 and watch the estimate lag behind every turn; set log q ≥ 1 and it just copies the noise. Then find the sweet spot in between (RMSE < 60 % of the sensor's)." },
      { id: "dropout_breathing", xp: 15, text: "Push dropout to 0.7 or more: the ±2σ band grows during prediction-only steps and snaps shut on each measurement. Why does uncertainty keep growing without data?" },
      { id: "gain_meaning", xp: 10, text: "Make σ huge: the Kalman gain → 0 and the filter trusts only its motion model. Make σ tiny: K → 1 and it copies the sensor. Explain both regimes in your own words." },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 }), ctx = cv.ctx, P = api.params, rand = makeRng(5);
      const DT = 0.1, BOX = [20, 11];
      let truth, filt, hist, t, acc, manT, manA, stats, frame = 0, seenLow = false, seenHigh = false;
      const newKF = (p) => ({ x: [p, 0], P: [[4, 0], [0, 4]], K: 0 });
      function reset() { truth = { p: [2, BOX[1] / 2], v: [1.5, 0.4] }; filt = [newKF(truth.p[0]), newKF(truth.p[1])]; hist = []; t = 0; acc = 0; manT = 0; manA = [0, 0]; stats = { n: 0, nm: 0, sex: 0, sey: 0, smx: 0, smy: 0, drops: 0, total: 0 }; }
      reset();
      function predict(kf, q) { // F = [[1,dt],[0,1]], Q = q·[[dt⁴/4, dt³/2],[dt³/2, dt²]]
        const x = kf.x, Pm = kf.P, d = DT;
        kf.x = [x[0] + d * x[1], x[1]];
        kf.P = [[Pm[0][0] + d * (Pm[1][0] + Pm[0][1]) + d * d * Pm[1][1] + q * d ** 4 / 4, Pm[0][1] + d * Pm[1][1] + q * d ** 3 / 2], [Pm[1][0] + d * Pm[1][1] + q * d ** 3 / 2, Pm[1][1] + q * d * d]];
      }
      function update(kf, z, R) { // H = [1 0]
        const Pm = kf.P, Sv = Pm[0][0] + R, K0 = Pm[0][0] / Sv, K1 = Pm[1][0] / Sv, y = z - kf.x[0];
        kf.x = [kf.x[0] + K0 * y, kf.x[1] + K1 * y]; kf.P = [[(1 - K0) * Pm[0][0], (1 - K0) * Pm[0][1]], [Pm[1][0] - K1 * Pm[0][0], Pm[1][1] - K1 * Pm[0][1]]]; kf.K = K0;
      }
      function stepTruth() {
        manT -= DT; if (manT <= 0) { manT = 2 + rand() * 3; manA = P.maneuver ? [(rand() - 0.5) * 3, (rand() - 0.5) * 3] : [0, 0]; }
        for (let k = 0; k < 2; k++) {
          truth.v[k] = clamp(truth.v[k] + manA[k] * DT + 0.05 * gauss(rand) * Math.sqrt(DT), -3, 3); truth.p[k] += truth.v[k] * DT;
          if (truth.p[k] < 0.5 || truth.p[k] > BOX[k] - 0.5) { truth.v[k] *= -1; manA[k] *= -1; truth.p[k] = clamp(truth.p[k], 0.5, BOX[k] - 0.5); }
        }
      }
      function step() {
        stepTruth(); const q = Math.pow(10, num(P.logq, -1.5)), sig = num(P.r, 1.5), R = sig * sig, drop = rand() < num(P.dropout, 0);
        stats.total++; if (drop) stats.drops++;
        const z = drop ? null : [truth.p[0] + sig * gauss(rand), truth.p[1] + sig * gauss(rand)];
        for (let k = 0; k < 2; k++) { predict(filt[k], q); if (z) update(filt[k], z[k], R); }
        t += DT;
        const ex = filt[0].x[0] - truth.p[0], ey = filt[1].x[0] - truth.p[1];
        stats.n++; stats.sex += ex * ex; stats.sey += ey * ey; if (z) { stats.nm++; stats.smx += (z[0] - truth.p[0]) ** 2; stats.smy += (z[1] - truth.p[1]) ** 2; }
        if (stats.n > 400) { for (const k of ["n", "nm", "sex", "sey", "smx", "smy"]) stats[k] *= 0.995; } // exponential forgetting → running RMSE
        hist.push({ t, tx: truth.p[0], ty: truth.p[1], tvx: truth.v[0], z, ex: filt[0].x[0], ey: filt[1].x[0], evx: filt[0].x[1], sx: Math.sqrt(Math.max(0, filt[0].P[0][0])), sy: Math.sqrt(Math.max(0, filt[1].P[0][0])) });
        if (hist.length > 400) hist.shift();
      }
      api.loop((dt) => { acc += dt * num(P.speed, 1); let n = 0; while (acc >= 0.05 && n < 20) { acc -= 0.05; step(); n++; } draw(); if ((frame++ % 6) === 0) { readout(); checks(); } });
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C); if (!hist.length) return;
        if (P.dims === "2d") return draw2D(w, h);
        const t1 = hist[hist.length - 1].t, xr = t1 < 30 ? [0, 30] : [t1 - 30, t1];
        const top = { x: 46, y: 18, w: w - 58, h: Math.round(h * 0.54) }, bot = { x: 46, y: top.y + top.h + 26, w: w - 58, h: h - top.h - 64 };
        const p1 = plot(ctx, C, top, xr, [-2, BOX[0] + 2], { title: "position x (m)", yd: 0, xl: "t (s)" });
        p1.band(hist.map((q) => [q.t, q.ex - 2 * q.sx, q.ex + 2 * q.sx]), "rgba(124,156,255,0.18)");
        p1.line(hist.map((q) => [q.t, q.tx]), C.accent, 1.5);
        p1.dots(hist.filter((q) => q.z).map((q) => [q.t, q.z[0]]), "rgba(255,255,255,0.45)", 1.8);
        p1.line(hist.map((q) => [q.t, q.ex]), C.primary, 2);
        p1.legend([["truth", C.accent], ["measurements", "rgba(255,255,255,0.7)"], ["KF estimate ± 2σ", C.primary]]);
        const p2 = plot(ctx, C, bot, xr, [-3.5, 3.5], { title: "velocity vx (m/s) — never measured, only inferred", yd: 1, ny: 2 });
        p2.hline(0, C.axis, [2, 4]); p2.line(hist.map((q) => [q.t, q.tvx]), C.accent, 1.5); p2.line(hist.map((q) => [q.t, q.evx]), C.primary, 2);
      }
      function draw2D(w, h) {
        const m = 24, s = Math.min((w - 2 * m) / BOX[0], (h - 2 * m) / BOX[1]), ox = (w - BOX[0] * s) / 2, oy = (h - BOX[1] * s) / 2, X = (x) => ox + x * s, Y = (y) => oy + (BOX[1] - y) * s;
        ctx.strokeStyle = C.grid; for (let g = 1; g < BOX[0]; g++) { ctx.beginPath(); ctx.moveTo(X(g), oy); ctx.lineTo(X(g), oy + BOX[1] * s); ctx.stroke(); } for (let g = 1; g < BOX[1]; g++) { ctx.beginPath(); ctx.moveTo(ox, Y(g)); ctx.lineTo(ox + BOX[0] * s, Y(g)); ctx.stroke(); }
        ctx.strokeStyle = C.axis; ctx.strokeRect(ox, oy, BOX[0] * s, BOX[1] * s);
        polyline(ctx, hist.map((q) => [X(q.tx), Y(q.ty)]), C.accent, 1.5);
        ctx.fillStyle = "rgba(255,255,255,0.45)"; hist.forEach((q) => { if (q.z) { ctx.beginPath(); ctx.arc(X(q.z[0]), Y(q.z[1]), 1.8, 0, TAU); ctx.fill(); } });
        polyline(ctx, hist.map((q) => [X(q.ex), Y(q.ey)]), C.primary, 2);
        const last = hist[hist.length - 1]; ctx.strokeStyle = C.primary; ctx.fillStyle = "rgba(124,156,255,0.18)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(X(last.ex), Y(last.ey), Math.max(1, 2 * last.sx * s), Math.max(1, 2 * last.sy * s), 0, 0, TAU); ctx.fill(); ctx.stroke();
        circle(ctx, X(last.tx), Y(last.ty), 5, C.accent); circle(ctx, X(last.ex), Y(last.ey), 4, C.primary);
        text(ctx, "truth (yellow) · measurements (dots) · KF estimate (blue) with 2σ ellipse", ox + 6, oy + 14, C.muted);
      }
      function rmse() { const two = P.dims === "2d"; return [Math.sqrt((two ? stats.smx + stats.smy : stats.smx) / Math.max(1e-9, stats.nm)), Math.sqrt((two ? stats.sex + stats.sey : stats.sex) / Math.max(1e-9, stats.n))]; }
      function readout() {
        const [rmM, rmE] = rmse();
        api.readout({
          "RMSE — raw measurements": stats.nm > 5 ? fx(rmM, 3) + " m" : "—", "RMSE — Kalman estimate": fx(rmE, 3) + " m", "Improvement": stats.nm > 10 ? fx((1 - rmE / rmM) * 100, 0) + " %" : "—",
          "Kalman gain K (position)": fx(filt[0].K, 3), "Estimate σ (position)": fx(Math.sqrt(filt[0].P[0][0]), 3) + " m",
          "Velocity: estimate / true": fx(filt[0].x[1], 2) + " / " + fx(truth.v[0], 2) + " m/s", "Measurements dropped": `${stats.drops} / ${stats.total}`,
          "Model": "constant velocity · q = " + Math.pow(10, num(P.logq, -1.5)).toExponential(1),
        });
      }
      function checks() {
        const lq = num(P.logq, -1.5); if (lq <= -2) seenLow = true; if (lq >= 1) seenHigh = true;
        const [rmM, rmE] = rmse();
        if (stats.n > 200 && stats.nm > 50) { if (P.maneuver && rmE < 0.5 * rmM) api.award("beat_sensor"); if (seenLow && seenHigh && lq > -2 && lq < 1 && rmE < 0.6 * rmM) api.award("lag_sweet_spot"); }
        if (num(P.dropout) >= 0.7 && stats.total > 150 && stats.drops / stats.total > 0.5) api.award("dropout_breathing");
      }
      api.setStatus("q is small: the filter trusts its constant-velocity model and lags on every turn. Raise log q and watch the trade-off.");
      return { restart() { reset(); }, destroy() {} };
    },
  });

  // ======================= 6. Robot behaviour state machine =======================
  const SM_STATES = ["Idle", "Explore", "AvoidObstacle", "ReturnToDock", "Charging", "Error"];
  const SM_EVENTS = ["bump", "low_battery", "docked", "charged", "timeout", "fault"];
  S.register({
    id: "state_machine",
    name: "Robot Behaviour State Machine",
    domains: ["robotics", "ai"],
    description: "A vacuum robot driven by a finite-state machine. Edit the transition table, inject sensor events, and watch what happens when an event arrives that no transition handles — the robustness lesson every robot learns the hard way.",
    params: [
      { key: "auto", label: "Sensors & timers generate events", type: "toggle", value: true },
      { key: "history", label: "AvoidObstacle returns to the previous state (history)", type: "toggle", value: false },
      { key: "drain", label: "Battery drain while moving (% per s)", type: "range", min: 0.5, max: 10, step: 0.5, value: 3 },
      { key: "glitch", label: "Random fault events", type: "toggle", value: false },
      { key: "speed", label: "Simulation speed ×", type: "range", min: 0.5, max: 4, step: 0.5, value: 1 },
    ],
    actions: SM_EVENTS.map((e) => ({ label: "⚡ " + e, fn: (h) => h.inject(e) })).concat([{ label: "Reset table", fn: (h) => h.resetTable() }]),
    challenges: [
      { id: "fault_everywhere", xp: 15, text: "Inject a fault while Charging: nothing happens, because that table cell is empty. Make every state except Error handle fault → Error." },
      { id: "stuck_returning", xp: 20, text: "Let the battery run low (or inject low_battery), then watch the robot hit an obstacle on its way home: bump has no transition from ReturnToDock, so it grinds in place. Add one." },
      { id: "history_state", xp: 20, text: "After your fix the robot dodges the obstacle but then forgets it was heading home. Turn on the history option so AvoidObstacle returns to the previous state — the problem hierarchical state machines solve." },
      { id: "ignored_events", xp: 10, text: "Review every empty cell: for each, decide whether ignoring the event is safe (e.g. charged while Exploring) or a latent bug. Which cells would you fill, and with what?" },
    ],
    mount(el, api) {
      const C = api.colors, cv = api.createCanvas({ aspect: 16 / 9, maxHeight: 480 }), ctx = cv.ctx, P = api.params, rand = makeRng(21);
      const SI = {}, EI = {}; SM_STATES.forEach((s, i) => { SI[s] = i; }); SM_EVENTS.forEach((e, i) => { EI[e] = i; });
      const TIMEOUT = { Idle: 4, Explore: 40, AvoidObstacle: 1.2, ReturnToDock: 0, Charging: 0, Error: 6 };
      const ROOM = { w: 10, h: 6 }, OBST = [{ x: 3, y: 1, w: 1.2, h: 2 }, { x: 6.5, y: 3.2, w: 2, h: 1 }, { x: 4.8, y: 4.3, w: 1.2, h: 1.2 }], DOCK = { x: 0.5, y: 3 }, RR = 0.3;
      let table, state, prev, timeIn, robot, battery, lowSent, log, unhandled, transitions, lastEvent, flash, stuckT, detourT, bumpCd, glitchT, frame = 0, bumpIgnoredReturning = 0;
      function defaultTable() {
        table = SM_STATES.map(() => SM_EVENTS.map(() => -1)); const set = (s, e, t) => { table[SI[s]][EI[e]] = SI[t]; };
        set("Idle", "timeout", "Explore"); set("Idle", "low_battery", "ReturnToDock"); set("Idle", "fault", "Error");
        set("Explore", "bump", "AvoidObstacle"); set("Explore", "low_battery", "ReturnToDock"); set("Explore", "fault", "Error"); set("Explore", "timeout", "Idle");
        set("AvoidObstacle", "timeout", "Explore"); set("AvoidObstacle", "low_battery", "ReturnToDock"); set("AvoidObstacle", "fault", "Error");
        set("ReturnToDock", "docked", "Charging"); set("ReturnToDock", "fault", "Error");
        set("Charging", "charged", "Idle");
        set("Error", "timeout", "Idle");
      }
      function reset() { defaultTable(); state = SI.Idle; prev = SI.Idle; timeIn = 3.2; robot = { x: 1.6, y: 3, th: 0 }; battery = 55; lowSent = false; log = []; unhandled = 0; transitions = 0; lastEvent = "—"; flash = null; stuckT = 0; detourT = 0; bumpCd = 0; glitchT = 12; }
      reset();
      const collides = (x, y) => x < RR || y < RR || x > ROOM.w - RR || y > ROOM.h - RR || OBST.some((o) => x > o.x - RR && x < o.x + o.w + RR && y > o.y - RR && y < o.y + o.h + RR);
      const atDock = () => Math.hypot(robot.x - DOCK.x, robot.y - DOCK.y) < 0.5;
      function fire(ev, src) {
        const e = EI[ev]; if (e == null) return; lastEvent = ev + " (" + src + ")";
        let target = table[state][e], viaHistory = false;
        if (ev === "timeout" && state === SI.AvoidObstacle && P.history && target >= 0 && prev !== SI.AvoidObstacle) { target = prev; viaHistory = true; }
        if (target < 0) {
          unhandled++; if (state === SI.ReturnToDock && ev === "bump") bumpIgnoredReturning++;
          log.unshift(`⚠ ${SM_STATES[state]} ignored "${ev}" (${src})`); if (log.length > 8) log.pop();
          api.setStatus(`"${ev}" has no transition from ${SM_STATES[state]} — silently ignored. Is that safe here?`); renderTable(); return;
        }
        const from = state; if (target !== from) prev = from;
        state = target; timeIn = 0; transitions++; flash = { from, to: target, t: 1 };
        log.unshift(`${SM_STATES[from]} —${ev}${viaHistory ? " (history)" : ""}→ ${SM_STATES[target]}`); if (log.length > 8) log.pop();
        if (target === SI.Explore) robot.th = rand() * TAU; if (target === SI.AvoidObstacle) detourT = 0;
        if (target === SI.ReturnToDock && from === SI.AvoidObstacle) detourT = 1.5;
        if (viaHistory && target === SI.ReturnToDock) api.award("history_state");
        api.setStatus(`${SM_STATES[from]} → ${SM_STATES[target]} on "${ev}" (${src}).`); renderTable();
      }
      function update(dt) {
        timeIn += dt; const moving = state === SI.Explore || state === SI.AvoidObstacle || state === SI.ReturnToDock;
        if (bumpCd > 0) bumpCd -= dt;
        if (moving) battery = Math.max(0, battery - num(P.drain, 3) * dt);
        if (state === SI.Charging && atDock()) { battery = Math.min(100, battery + 12 * dt); if (battery >= 100 && P.auto) fire("charged", "sensor"); }
        if (battery <= 20 && !lowSent && P.auto) { lowSent = true; fire("low_battery", "sensor"); } if (battery > 30) lowSent = false;
        if (battery <= 0 && moving && P.auto && timeIn > 0.5) fire("fault", "battery dead");
        let vx = 0, vy = 0;
        if (state === SI.Explore) { if (rand() < dt * 0.4) robot.th += (rand() - 0.5) * 1.6; vx = Math.cos(robot.th) * 1.2; vy = Math.sin(robot.th) * 1.2; }
        else if (state === SI.AvoidObstacle) { if (timeIn < 0.5) { vx = -Math.cos(robot.th) * 0.8; vy = -Math.sin(robot.th) * 0.8; } else robot.th += 2.5 * dt; }
        else if (state === SI.ReturnToDock) {
          const dx = DOCK.x - robot.x, dy = DOCK.y - robot.y, d = Math.hypot(dx, dy);
          if (d < 0.4) { if (P.auto) fire("docked", "sensor"); }
          else if (detourT > 0) { detourT -= dt; vx = Math.cos(robot.th) * 1.0; vy = Math.sin(robot.th) * 1.0; }
          else { robot.th = Math.atan2(dy, dx); vx = dx / d * 1.2; vy = dy / d * 1.2; }
        }
        if (vx || vy) {
          const nx = robot.x + vx * dt, ny = robot.y + vy * dt;
          if (collides(nx, ny)) { if (P.auto && bumpCd <= 0) { bumpCd = 0.6; fire("bump", "sensor"); } if (state === SI.ReturnToDock) stuckT += dt; }
          else { robot.x = nx; robot.y = ny; stuckT = 0; }
        } else if (state !== SI.ReturnToDock) stuckT = 0;
        if (stuckT > 2.5 && (frame % 60) === 0) api.setStatus(`⚠ Stuck for ${fx(stuckT, 0)} s: ReturnToDock drives straight at the dock and nothing handles "bump".`);
        const to = TIMEOUT[SM_STATES[state]]; if (to > 0 && timeIn >= to && P.auto) fire("timeout", "timer");
        if (P.glitch) { glitchT -= dt; if (glitchT <= 0) { glitchT = 10 + rand() * 20; fire("fault", "random glitch"); } }
        if (flash) { flash.t -= dt * 1.2; if (flash.t <= 0) flash = null; }
      }
      api.loop((dt) => { let rem = dt * num(P.speed, 1); while (rem > 1e-6) { const h = Math.min(0.05, rem); update(h); rem -= h; } draw(); if ((frame++ % 6) === 0) readout(); });
      function nodePos(i, w, h) { const cx = w * 0.23, cy = h * 0.5, R = Math.min(w * 0.17, h * 0.36), a = -Math.PI / 2 + (i / SM_STATES.length) * TAU; return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; }
      function draw() {
        const w = cv.width, h = cv.height; clearCanvas(ctx, w, h, C);
        // --- state diagram (left) ---
        const pos = SM_STATES.map((_, i) => nodePos(i, w, h)), NR = Math.max(16, Math.min(28, w * 0.035)), edges = {};
        table.forEach((row, s) => row.forEach((t, e) => { if (t < 0) return; const k = s + ">" + t; (edges[k] = edges[k] || { s, t, ev: [] }).ev.push(SM_EVENTS[e]); }));
        Object.values(edges).forEach((ed) => {
          const a = pos[ed.s], b = pos[ed.t], hot = flash && flash.from === ed.s && flash.to === ed.t, col = hot ? C.accent : "rgba(255,255,255,0.35)";
          if (ed.s === ed.t) { circle(ctx, a.x, a.y - NR - 8, 9, null, col, hot ? 2.5 : 1.2); text(ctx, ed.ev.join(","), a.x, a.y - NR - 22, col, { align: "center", size: 9 }); return; }
          const ang = Math.atan2(b.y - a.y, b.x - a.x), both = edges[ed.t + ">" + ed.s], off = both ? 7 : 0, ox = -Math.sin(ang) * off, oy = Math.cos(ang) * off;
          const x1 = a.x + Math.cos(ang) * NR + ox, y1 = a.y + Math.sin(ang) * NR + oy, x2 = b.x - Math.cos(ang) * (NR + 2) + ox, y2 = b.y - Math.sin(ang) * (NR + 2) + oy;
          arrow(ctx, x1, y1, x2, y2, col, hot ? 2.5 : 1.2);
          const lx = x1 + (x2 - x1) * 0.42 + ox * 1.6, ly = y1 + (y2 - y1) * 0.42 + oy * 1.6; text(ctx, ed.ev.join(", "), lx, ly - 3, hot ? C.accent : C.muted, { align: "center", size: 9 });
        });
        SM_STATES.forEach((s, i) => { const p = pos[i], cur = i === state, err = s === "Error"; circle(ctx, p.x, p.y, NR, cur ? (err ? C.danger : C.primary) : C.bg, cur ? C.text : (err ? C.danger : C.axis), cur ? 2.5 : 1.5); text(ctx, s === "AvoidObstacle" ? "Avoid" : s === "ReturnToDock" ? "Return" : s, p.x, p.y + 4, cur ? C.bg : C.text, { align: "center", bold: cur, size: 11 }); });
        text(ctx, "FSM — current state highlighted; edges labelled by event", 10, 16, C.muted);
        // --- room (right) ---
        const rx = w * 0.47, ry = 30, rs = Math.min((w - rx - 12) / ROOM.w, (h - ry - 12) / ROOM.h), X = (x) => rx + x * rs, Y = (y) => ry + y * rs;
        ctx.fillStyle = "#141830"; ctx.fillRect(X(0), Y(0), ROOM.w * rs, ROOM.h * rs); ctx.strokeStyle = C.axis; ctx.strokeRect(X(0), Y(0), ROOM.w * rs, ROOM.h * rs);
        OBST.forEach((o) => { ctx.fillStyle = "#3a4160"; ctx.fillRect(X(o.x), Y(o.y), o.w * rs, o.h * rs); });
        ctx.fillStyle = "rgba(110,231,183,0.25)"; ctx.fillRect(X(0), Y(DOCK.y - 0.5), 0.9 * rs, 1 * rs); text(ctx, "DOCK", X(0.05), Y(DOCK.y - 0.6), C.ok, { size: 9 });
        const col = state === SI.Error ? (Math.floor(frame / 15) % 2 ? C.danger : "#7a2d2d") : state === SI.Charging ? C.ok : state === SI.ReturnToDock ? C.accent : state === SI.AvoidObstacle ? C.secondary : state === SI.Idle ? C.muted : C.primary;
        circle(ctx, X(robot.x), Y(robot.y), RR * rs, col, C.text, 1.5); ctx.strokeStyle = C.bg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(robot.x), Y(robot.y)); ctx.lineTo(X(robot.x + Math.cos(robot.th) * RR), Y(robot.y + Math.sin(robot.th) * RR)); ctx.stroke();
        if (stuckT > 1) text(ctx, "stuck!", X(robot.x), Y(robot.y) - RR * rs - 4, C.danger, { align: "center", bold: true, size: 10 });
        const bw = ROOM.w * rs; ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(X(0), ry - 18, bw, 10); ctx.fillStyle = battery < 20 ? C.danger : battery < 50 ? C.accent : C.ok; ctx.fillRect(X(0), ry - 18, bw * battery / 100, 10);
        text(ctx, "battery " + fx(battery, 0) + " %", X(0) + bw, ry - 20, C.muted, { align: "right", size: 10 });
        text(ctx, "room — " + SM_STATES[state] + (state === SI.Charging && !atDock() ? " (but not at the dock: no current flows!)" : ""), X(0), Y(ROOM.h) + 12, C.muted, { size: 10 });
      }
      function readout() { api.readout({ "Current state": SM_STATES[state], "Time in state": fx(timeIn, 1) + " s", "Battery": fx(battery, 0) + " %", "Last event": lastEvent, "Unhandled events": String(unhandled), "Transitions taken": String(transitions), "Stuck time": stuckT > 0.5 ? fx(stuckT, 1) + " s ⚠" : "—", "Position": fx(robot.x, 1) + ", " + fx(robot.y, 1) }); }
      const extra = api.html("");
      function renderTable() {
        const cell = (i, j) => { const t = table[i][j]; return `<td><button type="button" data-s="${i}" data-e="${j}" style="background:${t >= 0 ? "rgba(124,156,255,0.18)" : "transparent"};color:${t >= 0 ? C.text : C.muted};border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:2px 6px;cursor:pointer;font-size:.76rem;min-width:52px">${t >= 0 ? SM_STATES[t] : "—"}</button></td>`; };
        let html = `<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start"><table style="width:auto"><tr><th>state ╲ event</th>${SM_EVENTS.map((e) => `<th>${e}</th>`).join("")}</tr>`;
        SM_STATES.forEach((s, i) => { html += `<tr><td style="color:${i === state ? C.accent : C.text};font-weight:${i === state ? 700 : 400}">${s}</td>${SM_EVENTS.map((_, j) => cell(i, j)).join("")}</tr>`; });
        html += `</table><div style="min-width:220px;max-width:380px;font-size:.8rem;color:${C.muted}"><b style="color:${C.text}">Event log</b><br>${log.join("<br>") || "—"}<br><br>Click a cell to cycle its target state (— = event ignored in that state).</div></div>`;
        api.html(html);
      }
      const onClick = (ev) => { const b = ev.target && ev.target.closest ? ev.target.closest("button[data-s]") : null; if (!b) return; const i = +b.dataset.s, j = +b.dataset.e; table[i][j] = table[i][j] >= SM_STATES.length - 1 ? -1 : table[i][j] + 1; renderTable(); checkTable(); };
      extra.addEventListener("click", onClick);
      function checkTable() {
        if (SM_STATES.every((s, i) => s === "Error" || table[i][EI.fault] === SI.Error)) api.award("fault_everywhere");
        if (bumpIgnoredReturning > 0 && table[SI.ReturnToDock][EI.bump] >= 0 && table[SI.ReturnToDock][EI.bump] !== SI.ReturnToDock) api.award("stuck_returning");
      }
      api.onParam((k) => { if (k === "history" && P.history) api.setStatus("History on: when AvoidObstacle times out, the robot resumes whatever it was doing before the bump."); });
      renderTable();
      api.setStatus("Idle for a moment, then the timer fires timeout → Explore. Inject events with the ⚡ buttons; edit the table below.");
      return { inject(e) { fire(e, "injected"); }, resetTable() { defaultTable(); renderTable(); api.setStatus("Transition table reset to the (deliberately incomplete) default."); }, destroy() { extra.removeEventListener("click", onClick); } };
    },
  });
})();
