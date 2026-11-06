/* Self-Taught — Bespoke Interactive Simulation Renderers (Group 6: Geopolitics, Jurisprudence, RF/SDR)
 * Registers 60 completely distinct, topic-specific HTML5 Canvas visual simulations via
 * window.SelfTaughtSims.registerCustomRenderers(R).
 */
(function () {
  "use strict";

  const C = {
    bg: "#0f1222",
    panel: "#161a2e",
    grid: "rgba(255,255,255,0.07)",
    axis: "rgba(255,255,255,0.35)",
    text: "#e8ebff",
    muted: "#9aa3c7",
    primary: "#7c9cff",
    secondary: "#ff8fab",
    accent: "#ffd166",
    danger: "#ff6b6b",
    ok: "#6ee7b7",
    purple: "#c084fc",
    cyan: "#67e8f9",
    orange: "#fdba74",
    lime: "#a3e635",
  };

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function arrow(ctx, x1, y1, x2, y2, col, w, head) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    const h = head || 7;
    ctx.save();
    ctx.strokeStyle = col || C.primary;
    ctx.fillStyle = col || C.primary;
    ctx.lineWidth = w || 1.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * h - uy * h * 0.55, y2 - uy * h + ux * h * 0.55);
    ctx.lineTo(x2 - ux * h + uy * h * 0.55, y2 - uy * h - ux * h * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke, lw) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r || 6) : ctx.rect(x, y, w, h);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.2; ctx.stroke(); }
    ctx.restore();
  }

  function label(ctx, txt, x, y, col, font, align) {
    ctx.save();
    ctx.fillStyle = col || C.text;
    ctx.font = font || "11px system-ui, sans-serif";
    ctx.textAlign = align || "left";
    ctx.fillText(txt, x, y);
    ctx.restore();
  }

  const R = {};

  // =========================================================================
  // 1. GEOPOLITICS (20 SIMULATIONS)
  // =========================================================================

  // 1. geo_richardson_arms_race — Reaction lines dx/dt = ky - αx + g & phase vector field
  R.geo_richardson_arms_race = function (ctx, W, H, st) {
    st.drawHUD("Richardson Arms Race Reaction Lines & Stability", st.spec.formula);
    const k = 0.3 + st.a * 2.1, l = 0.3 + st.a * 1.95;
    const alpha = 0.35 + st.b * 2.0, beta = 0.35 + st.b * 2.05;
    const g = 0.4 + st.c * 3.2, h = 0.35 + st.c * 2.9;
    const det = alpha * beta - k * l;
    const stable = det > 0.05;

    const px = 20, py = 46, pw = W * 0.54, ph = H - 62;
    st.panel(px, py, pw, ph, "Phase Plane: Blue Arsenal (x) vs Red Arsenal (y)");
    const ox = px + 38, oy = py + ph - 28, gw = pw - 56, gh = ph - 58;
    const maxA = 10;

    // Vector field arrows
    for (let ix = 1; ix <= 8; ix++) {
      for (let iy = 1; iy <= 6; iy++) {
        const xv = (ix / 8.5) * maxA, yv = (iy / 6.5) * maxA;
        const dx = k * yv - alpha * xv + g;
        const dy = l * xv - beta * yv + h;
        const sx = ox + (xv / maxA) * gw, sy = oy - (yv / maxA) * gh;
        const mag = Math.hypot(dx, dy) || 1;
        arrow(ctx, sx, sy, sx + (dx / mag) * 12, sy - (dy / mag) * 12, "rgba(255,255,255,0.22)", 1.1, 4);
      }
    }

    // Nullcline dx/dt = 0 => y = (alpha*x - g)/k
    ctx.save();
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const xv = (i / 60) * maxA;
      const yv = (alpha * xv - g) / k;
      const sx = ox + (xv / maxA) * gw, sy = oy - clamp(yv / maxA, 0, 1) * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Nullcline dy/dt = 0 => y = (l*x + h)/beta
    ctx.strokeStyle = C.secondary;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const xv = (i / 60) * maxA;
      const yv = (l * xv + h) / beta;
      const sx = ox + (xv / maxA) * gw, sy = oy - clamp(yv / maxA, 0, 1) * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Trajectory from interactive probe
    let tx = clamp((st.px - 0.08) * 14, 0.5, 9.5);
    let ty = clamp((1 - st.py) * 11, 0.5, 9.5);
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let step = 0; step < 90; step++) {
      const sx = ox + clamp(tx / maxA, 0, 1) * gw;
      const sy = oy - clamp(ty / maxA, 0, 1) * gh;
      if (step === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      const dxt = k * ty - alpha * tx + g;
      const dyt = l * tx - beta * ty + h;
      tx = clamp(tx + dxt * 0.045, 0, maxA);
      ty = clamp(ty + dyt * 0.045, 0, maxA);
    }
    ctx.stroke();

    // Equilibrium intersection
    let eqX = (beta * g + k * h) / (Math.abs(det) < 0.05 ? 0.05 : det);
    let eqY = (l * g + alpha * h) / (Math.abs(det) < 0.05 ? 0.05 : det);
    if (eqX > 0 && eqX < maxA && eqY > 0 && eqY < maxA) {
      const ex = ox + (eqX / maxA) * gw, ey = oy - (eqY / maxA) * gh;
      ctx.fillStyle = stable ? C.ok : C.danger;
      ctx.beginPath();
      ctx.arc(ex, ey, 6 + 2 * Math.sin(st.t * 4), 0, Math.PI * 2);
      ctx.fill();
      label(ctx, stable ? "Stable Balance (x*,y*)" : "Saddle / Runaway!", ex + 9, ey - 5, stable ? C.ok : C.danger, "bold 11px system-ui");
    }
    ctx.restore();

    label(ctx, "dx/dt=0 (Blue Reaction)", ox + 8, py + 34, C.primary, "11px monospace");
    label(ctx, "dy/dt=0 (Red Reaction)", ox + 8, py + 48, C.secondary, "11px monospace");
    label(ctx, "Blue Spend x →", ox + gw - 85, oy + 18, C.muted, "10px system-ui");

    // Right panel: Time series & Stability gauge
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Stability Index & Arsenal Time-Series");
    const badgeCol = stable ? C.ok : C.danger;
    roundRect(ctx, rx + 12, py + 28, rw - 24, 34, 6, "rgba(255,255,255,0.04)", badgeCol, 1.5);
    label(ctx, stable ? "STABLE DETERRENCE (αβ > kl)" : "UNSTABLE ARMS SPIRAL (kl > αβ)", rx + rw / 2, py + 49, badgeCol, "bold 11px monospace", "center");

    // Time plot of x(t) and y(t)
    const tx0 = rx + 16, ty0 = py + ph - 26, tw = rw - 32, th = ph - 105;
    let sx0 = 1.5, sy0 = 3.2;
    ctx.beginPath();
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2;
    for (let i = 0; i <= 70; i++) {
      const px2 = tx0 + (i / 70) * tw;
      const py2 = ty0 - clamp(sx0 / maxA, 0, 1) * th;
      if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
      const dx = k * sy0 - alpha * sx0 + g, dy = l * sx0 - beta * sy0 + h;
      sx0 = clamp(sx0 + dx * 0.05, 0, maxA);
      sy0 = clamp(sy0 + dy * 0.05, 0, maxA);
    }
    ctx.stroke();

    sx0 = 1.5; sy0 = 3.2;
    ctx.beginPath();
    ctx.strokeStyle = C.secondary;
    for (let i = 0; i <= 70; i++) {
      const px2 = tx0 + (i / 70) * tw;
      const py2 = ty0 - clamp(sy0 / maxA, 0, 1) * th;
      if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
      const dx = k * sy0 - alpha * sx0 + g, dy = l * sx0 - beta * sy0 + h;
      sx0 = clamp(sx0 + dx * 0.05, 0, maxA);
      sy0 = clamp(sy0 + dy * 0.05, 0, maxA);
    }
    ctx.stroke();
    label(ctx, `αβ - kl = ${det.toFixed(2)}`, rx + 16, py + 80, C.accent, "11px monospace");

    return {
      "Stability (αβ−kl)": det.toFixed(2),
      "Regime": stable ? "Equilibrium" : "Runaway Spiral",
      "Equilibrium x*": clamp(eqX, 0, 99).toFixed(2),
      "Equilibrium y*": clamp(eqY, 0, 99).toFixed(2),
    };
  };

  // 2. geo_lanchester_attrition — Square Law vs Linear Law curves + Hughes Salvo exchange
  R.geo_lanchester_attrition = function (ctx, W, H, st) {
    st.drawHUD("Lanchester Square Law Attrition & Hughes Naval Salvo", st.spec.formula);
    const ratio = 0.6 + st.a * 1.4; // B0 / R0
    const qual = 0.5 + st.b * 1.8;  // alpha / beta
    const intercept = st.c;         // point defense

    const R0 = 100, B0 = Math.round(R0 * ratio);
    const beta = 0.035 * qual, alpha = 0.035;

    const px = 18, py = 46, pw = W * 0.52, ph = H - 62;
    st.panel(px, py, pw, ph, "Force Attrition: Aimed Square Law (Solid) vs Linear Area Fire (Dashed)");
    const ox = px + 36, oy = py + ph - 26, gw = pw - 52, gh = ph - 58;

    // Simulate Square Law & Linear Law
    let bSq = B0, rSq = R0, bLin = B0, rLin = R0;
    const ptsBSq = [], ptsRSq = [], ptsBLin = [];
    for (let i = 0; i <= 80; i++) {
      ptsBSq.push(bSq); ptsRSq.push(rSq); ptsBLin.push(bLin);
      const db = -alpha * rSq * (1 - 0.45 * intercept);
      const dr = -beta * bSq;
      bSq = Math.max(0, bSq + db * 0.22);
      rSq = Math.max(0, rSq + dr * 0.22);
      const dbl = -0.00045 * alpha * bLin * rLin;
      const drl = -0.00045 * beta * bLin * rLin;
      bLin = Math.max(0, bLin + dbl * 18);
      rLin = Math.max(0, rLin + drl * 18);
    }

    const maxF = Math.max(B0, R0, 140);
    const drawCurve = (arr, col, dash) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.2;
      if (dash) ctx.setLineDash([5, 4]);
      ctx.beginPath();
      arr.forEach((v, i) => {
        const x = ox + (i / 80) * gw, y = oy - (v / maxF) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    };
    drawCurve(ptsBSq, C.primary, false);
    drawCurve(ptsRSq, C.danger, false);
    drawCurve(ptsBLin, C.cyan, true);

    label(ctx, `Blue Force B(t) [B₀=${B0}]`, ox + 10, py + 36, C.primary, "bold 11px monospace");
    label(ctx, `Red Force R(t) [R₀=${R0}]`, ox + 10, py + 52, C.danger, "bold 11px monospace");
    label(ctx, "Blue Linear Law (Area Fire)", ox + 10, py + 68, C.cyan, "10px monospace");

    // Right panel: Hughes Salvo Missile/Interceptor Diagram
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Hughes Naval Salvo Exchange (ΔB = (αR - b₃B)/w)");

    const blueShipX = rx + 36, redShipX = rx + rw - 42, midY = py + ph * 0.48;
    roundRect(ctx, blueShipX - 22, midY - 26, 44, 52, 8, "rgba(124,156,255,0.2)", C.primary, 2);
    label(ctx, "BLUE", blueShipX, midY - 4, C.primary, "bold 10px monospace", "center");
    label(ctx, `N=${B0}`, blueShipX, midY + 12, C.text, "10px monospace", "center");

    roundRect(ctx, redShipX - 22, midY - 26, 44, 52, 8, "rgba(255,107,107,0.2)", C.danger, 2);
    label(ctx, "RED", redShipX, midY - 4, C.danger, "bold 10px monospace", "center");
    label(ctx, `N=${R0}`, redShipX, midY + 12, C.text, "10px monospace", "center");

    // Animated missiles & interceptors
    const nMissiles = 6;
    for (let m = 0; m < nMissiles; m++) {
      const prog = ((st.t * 0.7 + m / nMissiles) % 1);
      const mx = blueShipX + 26 + prog * (redShipX - blueShipX - 52);
      const my = midY - 22 + Math.sin(prog * Math.PI) * (-18 - m * 4);
      ctx.fillStyle = C.primary;
      ctx.beginPath(); ctx.arc(mx, my, 3.2, 0, Math.PI * 2); ctx.fill();

      // Red missile going left, intercepted if prog > (1 - intercept*0.65)
      const rProg = ((st.t * 0.65 + (m + 0.5) / nMissiles) % 1);
      const cutoff = 1 - intercept * 0.65;
      const rmx = redShipX - 26 - Math.min(rProg, cutoff) * (redShipX - blueShipX - 52);
      const rmy = midY + 22 + Math.sin(Math.min(rProg, cutoff) * Math.PI) * (16 + m * 3);
      ctx.fillStyle = rProg > cutoff ? C.accent : C.danger;
      ctx.beginPath(); ctx.arc(rmx, rmy, rProg > cutoff ? 5 : 3.2, 0, Math.PI * 2); ctx.fill();
    }

    const effAdvantage = (qual * ratio * ratio).toFixed(2);
    label(ctx, `Square-Law Advantage (βB₀² / αR₀²) = ${effAdvantage}x`, rx + 14, py + ph - 36, Number(effAdvantage) >= 1 ? C.ok : C.danger, "bold 11px monospace");
    label(ctx, `SAM Intercept Shield: ${(intercept * 100).toFixed(0)}%`, rx + 14, py + ph - 18, C.accent, "11px monospace");

    return {
      "Force Ratio B₀/R₀": ratio.toFixed(2),
      "Square-Law Edge": `${effAdvantage}x`,
      "Blue Survivors": `${Math.round(bSq)}`,
      "Red Survivors": `${Math.round(rSq)}`,
    };
  };

  // 3. geo_schelling_brinkmanship — Escalation cliff-edge risk slope & resolve threshold
  R.geo_schelling_brinkmanship = function (ctx, W, H, st) {
    st.drawHUD("Schelling Brinkmanship: The Threat That Leaves Something to Chance", st.spec.formula);
    const hazard = 0.1 + st.a * 0.85;
    const asymm = 0.2 + st.b * 0.75;
    const tying = st.c;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Schelling Mountain Slope: Autonomous Slippage Hazard s(x) Toward Nuclear Cliff");

    const ox = px + 36, oy = py + ph - 34, gw = pw - 72, gh = ph - 78;
    const cliffX = ox + gw * 0.82;

    // Draw the brinkmanship mountain / slope turning into a sheer cliff
    ctx.save();
    const grad = ctx.createLinearGradient(ox, oy, cliffX, oy - gh);
    grad.addColorStop(0, "rgba(110,231,183,0.18)");
    grad.addColorStop(0.6, "rgba(255,209,102,0.24)");
    grad.addColorStop(1, "rgba(255,107,107,0.42)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const x = ox + u * (cliffX - ox);
      const riskCurve = Math.pow(u, 1.8) * (0.45 + 0.55 * hazard);
      const y = oy - clamp(riskCurve, 0, 0.95) * gh;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(cliffX, oy);
    ctx.closePath();
    ctx.fill();

    // Cliff drop-off
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cliffX, oy - gh * 0.92);
    ctx.lineTo(cliffX, oy);
    ctx.stroke();
    label(ctx, "NUCLEAR ABYSS (Catastrophic Slippage)", cliffX + 8, oy - gh * 0.5, C.danger, "bold 11px monospace");

    // Critical risk thresholds q* for Defender vs Challenger
    const defMaxRisk = clamp(0.25 + 0.55 * asymm + 0.2 * tying, 0.15, 0.92);
    const chalMaxRisk = clamp(0.55 - 0.3 * asymm, 0.12, 0.85);

    const drawThreshold = (rVal, col, name) => {
      const y = oy - rVal * gh;
      ctx.save();
      ctx.strokeStyle = col;
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ox, y);
      ctx.lineTo(cliffX, y);
      ctx.stroke();
      label(ctx, `${name} Resolve Ceiling (s* = ${(rVal * 100).toFixed(0)}%)`, ox + 10, y - 6, col, "bold 11px monospace");
      ctx.restore();
    };
    drawThreshold(defMaxRisk, C.primary, "Defender (Hand-Tied)");
    drawThreshold(chalMaxRisk, C.secondary, "Challenger");

    // Current crisis position along ladder
    const stepPos = clamp(st.px, 0.12, 0.92);
    const curU = clamp((stepPos - 0.1) / 0.75, 0, 1);
    const curRisk = clamp(Math.pow(curU, 1.8) * (0.45 + 0.55 * hazard), 0, 0.98);
    const cx = ox + curU * (cliffX - ox);
    const cy = oy - curRisk * gh;

    ctx.fillStyle = curRisk > chalMaxRisk ? C.ok : C.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, 7 + 2 * Math.sin(st.t * 6), 0, Math.PI * 2);
    ctx.fill();
    label(ctx, `Crisis Rung ${(curU * 10).toFixed(1)} (Risk=${(curRisk * 100).toFixed(1)}%)`, cx - 45, cy - 12, C.text, "bold 11px monospace");
    ctx.restore();

    const outcome = curRisk > defMaxRisk && curRisk > chalMaxRisk
      ? "Mutual Disaster Risk!"
      : (curRisk > chalMaxRisk ? "Challenger Backs Down" : "Escalation Continues");

    return {
      "Autonomous Risk s": `${(curRisk * 100).toFixed(1)}%`,
      "Defender Ceiling": `${(defMaxRisk * 100).toFixed(0)}%`,
      "Challenger Ceiling": `${(chalMaxRisk * 100).toFixed(0)}%`,
      "Crisis Outcome": outcome,
    };
  };

  // 4. geo_fearon_bargaining — Fearon [0,1] territory bar with [p - c_A, p + c_B] & Δp preventive shift
  R.geo_fearon_bargaining = function (ctx, W, H, st) {
    st.drawHUD("Fearon Rationalist Bargaining Range & Preventive War Shift", st.spec.formula);
    const p = 0.2 + st.a * 0.6;
    const costSum = 0.06 + st.b * 0.36;
    const cA = costSum * 0.5, cB = costSum * 0.5;
    const deltaP = st.c * 0.45;

    const px = 20, py = 46, pw = W - 40, ph = H - 62;
    st.panel(px, py, pw, ph, "Fearon Bargaining Space [0, 1]: Today's Peaceful Range vs Tomorrow's Power Shift Δp");

    const bx = px + 44, bw = pw - 88;
    const y1 = py + 78, y2 = py + 178, bh = 36;

    // Period 1 Bargaining Bar
    roundRect(ctx, bx, y1, bw, bh, 6, "rgba(255,255,255,0.06)", C.axis, 1.4);
    const xLow1 = bx + clamp(p - cA, 0, 1) * bw;
    const xP1 = bx + p * bw;
    const xHigh1 = bx + clamp(p + cB, 0, 1) * bw;

    // War cost wedges
    ctx.fillStyle = "rgba(255,107,107,0.32)";
    ctx.fillRect(xLow1, y1, xP1 - xLow1, bh);
    ctx.fillStyle = "rgba(124,156,255,0.32)";
    ctx.fillRect(xP1, y1, xHigh1 - xP1, bh);
    roundRect(ctx, xLow1, y1 - 3, xHigh1 - xLow1, bh + 6, 4, "rgba(110,231,183,0.22)", C.ok, 2);

    label(ctx, "0 (State A Capital)", bx, y1 - 10, C.muted, "11px monospace");
    label(ctx, "1 (State B Capital)", bx + bw, y1 - 10, C.muted, "11px monospace", "right");
    label(ctx, `p - c_A = ${(p - cA).toFixed(2)}`, xLow1, y1 + bh + 16, C.danger, "bold 11px monospace", "center");
    label(ctx, `p = ${p.toFixed(2)}`, xP1, y1 - 10, C.accent, "bold 11px monospace", "center");
    label(ctx, `p + c_B = ${(p + cB).toFixed(2)}`, xHigh1, y1 + bh + 16, C.primary, "bold 11px monospace", "center");

    // Period 2 Bargaining Bar (after rising power shift p' = p - deltaP)
    const p2 = clamp(p - deltaP, 0.05, 0.95);
    roundRect(ctx, bx, y2, bw, bh, 6, "rgba(255,255,255,0.06)", C.axis, 1.4);
    const xLow2 = bx + clamp(p2 - cA, 0, 1) * bw;
    const xHigh2 = bx + clamp(p2 + cB, 0, 1) * bw;
    const commitmentBreakdown = deltaP > costSum;

    roundRect(ctx, xLow2, y2 - 3, xHigh2 - xLow2, bh + 6, 4,
      commitmentBreakdown ? "rgba(255,107,107,0.28)" : "rgba(110,231,183,0.22)",
      commitmentBreakdown ? C.danger : C.ok, 2);

    label(ctx, `Future Power Balance p' = ${p2.toFixed(2)} (Shift Δp = -${deltaP.toFixed(2)})`, bx, y2 - 10, C.accent, "bold 11px monospace");
    arrow(ctx, xP1, y1 + bh + 20, bx + p2 * bw, y2 - 14, C.accent, 2, 7);

    const statusMsg = commitmentBreakdown
      ? "COMMITMENT FAILURE (Δp > c_A + c_B): Ranges Disjoint → Preventive War!"
      : "OVERLAPPING WIN-SETS (Δp ≤ c_A + c_B): Credible Peaceful Bargain Exists";
    label(ctx, statusMsg, px + pw / 2, y2 + bh + 30, commitmentBreakdown ? C.danger : C.ok, "bold 12px monospace", "center");

    return {
      "Peaceful Range": `[${(p - cA).toFixed(2)}, ${(p + cB).toFixed(2)}]`,
      "Combined War Cost": costSum.toFixed(2),
      "Power Shift Δp": deltaP.toFixed(2),
      "Equilibrium": commitmentBreakdown ? "Preventive War" : "Peaceful Deal",
    };
  };

  // 5. geo_nuclear_second_strike — Nuclear Triad survivability curves (Silo, SSBN, Bomber) & MIRV instability
  R.geo_nuclear_second_strike = function (ctx, W, H, st) {
    st.drawHUD("Nuclear Triad Second-Strike Survivability & MIRV Stability", st.spec.formula);
    const mirv = Math.round(1 + st.a * 9); // 1..10 warheads per missile
    const sspk = 0.25 + st.b * 0.7;        // 0.25..0.95
    const ssbnShare = 0.15 + st.c * 0.7;   // 15%..85%

    const px = 18, py = 46, pw = W * 0.55, ph = H - 62;
    st.panel(px, py, pw, ph, "Retaliatory Warheads Surviving vs Attacker Exchange Ratio");
    const ox = px + 38, oy = py + ph - 28, gw = pw - 56, gh = ph - 58;

    // Draw 3 triad leg curves across r = 0..4 targeting ratio
    const legs = [
      { name: "SSBN Submarine Leg (Untargetable)", col: C.ok, fn: (r) => ssbnShare * 100 * Math.exp(-0.03 * r) },
      { name: "Dispersed Bomber / Mobile ICBM", col: C.accent, fn: (r) => 45 * Math.pow(1 - sspk * 0.45, r) },
      { name: `Fixed Silo ICBMs (${mirv}x MIRV)`, col: C.danger, fn: (r) => (1 - ssbnShare) * 100 * Math.pow(Math.max(0.02, 1 - sspk), r) },
    ];

    legs.forEach((leg, idx) => {
      ctx.save();
      ctx.strokeStyle = leg.col;
      ctx.lineWidth = 2.3;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const r = (i / 60) * 4;
        const val = leg.fn(r);
        const x = ox + (i / 60) * gw, y = oy - clamp(val / 100, 0, 1) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      label(ctx, leg.name, ox + 12, py + 36 + idx * 16, leg.col, "bold 11px monospace");
      ctx.restore();
    });

    // Right panel: Silo vs SSBN Triad Diagram & First-Strike Incentive
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "MIRV Exchange Ratio & Crisis Stability");

    // Draw MIRV bus splitting into r warheads
    const busX = rx + rw * 0.5, busY = py + 44;
    ctx.fillStyle = C.secondary;
    ctx.beginPath(); ctx.arc(busX, busY, 6, 0, Math.PI * 2); ctx.fill();
    const nShow = Math.min(mirv, 8);
    for (let i = 0; i < nShow; i++) {
      const tx = rx + 24 + (i / Math.max(1, nShow - 1)) * (rw - 48);
      const ty = py + 115;
      arrow(ctx, busX, busY + 6, tx, ty - 8, C.danger, 1.3, 5);
      roundRect(ctx, tx - 8, ty, 16, 22, 3, "rgba(255,255,255,0.08)", C.primary, 1.2);
    }
    label(ctx, `1 Attacker ICBM (${mirv} MIRVs) targets ${Math.floor(mirv / 2)} Defender Silos`, rx + rw / 2, py + 154, C.text, "10px monospace", "center");

    const siloSurv2 = (1 - ssbnShare) * 100 * Math.pow(1 - sspk, 2);
    const totalSurv = Math.round(ssbnShare * 95 + siloSurv2);
    const firstStrikeIdx = clamp((mirv * sspk * (1 - ssbnShare)) / 2.5, 0, 10);
    const stable = firstStrikeIdx < 1.5;

    roundRect(ctx, rx + 14, py + ph - 54, rw - 28, 38, 6, "rgba(255,255,255,0.04)", stable ? C.ok : C.danger, 1.6);
    label(ctx, stable ? "CRISIS STABLE (Assured 2nd Strike)" : "USE-OR-LOSE MIRV INSTABILITY", rx + rw / 2, py + ph - 31, stable ? C.ok : C.danger, "bold 11px monospace", "center");

    return {
      "MIRVs / Missile": `${mirv}`,
      "2-on-1 Silo Surv": `${((1 - sspk) * (1 - sspk) * 100).toFixed(1)}%`,
      "Surviving Warheads": `${totalSurv}%`,
      "Crisis Stability": stable ? "Stable (De-MIRVed)" : "High 1st-Strike Risk",
    };
  };

  // 6. geo_chokepoint_maritime — Global maritime chokepoint map & Cape of Good Hope reroute
  R.geo_chokepoint_maritime = function (ctx, W, H, st) {
    st.drawHUD("Global Maritime Chokepoints & Cape Rerouting Network", st.spec.formula);
    const disrupt = st.a;     // chokepoint blockage
    const spr = st.b;         // SPR release
    const fleetElast = st.c;  // spare tanker capacity

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Eurasian-African Maritime Oil/Container Corridors (Mbbl/day)");

    // Stylized landmass silhouettes (Africa, Arabia, India/SE Asia)
    ctx.save();
    ctx.fillStyle = "rgba(154, 163, 199, 0.14)";
    ctx.strokeStyle = "rgba(154, 163, 199, 0.35)";
    ctx.lineWidth = 1.3;
    // Africa polygon
    const af = [[0.22, 0.34], [0.36, 0.35], [0.43, 0.50], [0.36, 0.84], [0.27, 0.84], [0.20, 0.55]];
    ctx.beginPath();
    af.forEach(([ux, uy], i) => {
      const x = px + ux * pw, y = py + uy * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Arabia + Eurasia polygon
    const eu = [[0.38, 0.20], [0.85, 0.20], [0.82, 0.54], [0.68, 0.52], [0.58, 0.42], [0.46, 0.46], [0.40, 0.34]];
    ctx.beginPath();
    eu.forEach(([ux, uy], i) => {
      const x = px + ux * pw, y = py + uy * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Suez / Bab el-Mandeb direct route vs Cape of Good Hope reroute
    const suezFlow = Math.max(0.1, 1 - disrupt * 0.88);
    const capeFlow = 0.2 + disrupt * 0.85;

    // Direct Red Sea / Suez corridor
    ctx.strokeStyle = disrupt > 0.5 ? C.danger : C.ok;
    ctx.lineWidth = 2 + suezFlow * 7;
    ctx.beginPath();
    ctx.moveTo(px + 0.54 * pw, py + 0.45 * ph); // Hormuz
    ctx.lineTo(px + 0.43 * pw, py + 0.48 * ph); // Bab el-Mandeb
    ctx.lineTo(px + 0.37 * pw, py + 0.33 * ph); // Suez
    ctx.lineTo(px + 0.16 * pw, py + 0.26 * ph); // Rotterdam
    ctx.stroke();

    // Cape of Good Hope reroute (+12 days)
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 1.5 + capeFlow * 6.5;
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    ctx.moveTo(px + 0.54 * pw, py + 0.45 * ph);
    ctx.lineTo(px + 0.42 * pw, py + 0.89 * ph);
    ctx.lineTo(px + 0.23 * pw, py + 0.88 * ph);
    ctx.lineTo(px + 0.12 * pw, py + 0.52 * ph);
    ctx.lineTo(px + 0.16 * pw, py + 0.26 * ph);
    ctx.stroke();
    ctx.setLineDash([]);

    // Malacca Eastward corridor
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(px + 0.54 * pw, py + 0.45 * ph);
    ctx.lineTo(px + 0.76 * pw, py + 0.58 * ph);
    ctx.lineTo(px + 0.90 * pw, py + 0.40 * ph);
    ctx.stroke();

    // Chokepoint markers
    const nodes = [
      { name: "Suez (9 Mb/d)", x: 0.37, y: 0.33, col: C.secondary },
      { name: "Bab el-Mandeb", x: 0.43, y: 0.48, col: C.danger },
      { name: "Hormuz (21 Mb/d)", x: 0.54, y: 0.45, col: C.accent },
      { name: "Malacca (16 Mb/d)", x: 0.76, y: 0.58, col: C.primary },
      { name: "Cape Reroute (+12d)", x: 0.31, y: 0.90, col: C.ok },
    ];
    nodes.forEach((n) => {
      const nx = px + n.x * pw, ny = py + n.y * ph;
      ctx.fillStyle = n.col;
      ctx.beginPath(); ctx.arc(nx, ny, 5.5, 0, Math.PI * 2); ctx.fill();
      label(ctx, n.name, nx + 8, ny + 4, C.text, "bold 10px monospace");
    });
    ctx.restore();

    const delayDays = (disrupt * 12.5 * (1 - 0.35 * fleetElast)).toFixed(1);
    const freightPrem = Math.round(100 + disrupt * 280 * (1 - 0.4 * spr));

    return {
      "Red Sea Transit": `${(suezFlow * 100).toFixed(0)}% Normal`,
      "Cape Reroute Share": `${(capeFlow * 100).toFixed(0)}%`,
      "Voyage Delay Δt": `+${delayDays} days`,
      "VLCC Rate Index": `${freightPrem}%`,
    };
  };

  // 7. geo_sanctions_tariff_gravity — Bilateral trade wall + 3rd-country transshipment diversion
  R.geo_sanctions_tariff_gravity = function (ctx, W, H, st) {
    st.drawHUD("Trade Gravity Model & Third-Country Sanctions Leakage", st.spec.formula);
    const tau = 1 + st.a * 4.5;      // tariff/sanction barrier
    const coalShare = 0.3 + st.b * 0.6;
    const secEnf = st.c;             // secondary sanctions enforcement

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Bilateral Trade Collapse vs Connector-Hub Transshipment Deflection");

    const ax = px + pw * 0.18, ay = py + ph * 0.52;
    const bx = px + pw * 0.82, by = py + ph * 0.52;
    const hx = px + pw * 0.50, hy = py + ph * 0.24;
    const hx2 = px + pw * 0.50, hy2 = py + ph * 0.80;

    const directFlow = Math.pow(tau, -1.35) * (1 - 0.5 * coalShare);
    const rerouteFlow = (1 - directFlow) * (0.78 - 0.62 * secEnf);

    // Sanctions Wall in middle of direct route
    const wx = (ax + bx) / 2;
    roundRect(ctx, wx - 10, ay - 36, 20, 72, 3, "rgba(255,107,107,0.35)", C.danger, 2);
    label(ctx, `Barrier τ=${tau.toFixed(1)}x`, wx, ay - 44, C.danger, "bold 10px monospace", "center");

    // Direct Flow arrow
    arrow(ctx, ax + 42, ay, bx - 42, by, C.primary, Math.max(1.2, directFlow * 10), 8);
    label(ctx, `Direct Trade: ${(directFlow * 100).toFixed(0)}%`, wx, ay + 52, C.primary, "bold 11px monospace", "center");

    // Transshipment Hub 1 (Top) & Hub 2 (Bottom)
    const hubW = Math.max(1.5, rerouteFlow * 8);
    arrow(ctx, ax + 30, ay - 20, hx - 36, hy + 8, C.accent, hubW, 7);
    arrow(ctx, hx + 36, hy + 8, bx - 30, by - 20, C.accent, hubW, 7);
    arrow(ctx, ax + 30, ay + 20, hx2 - 36, hy2 - 8, C.purple, hubW * 0.75, 7);
    arrow(ctx, hx2 + 36, hy2 - 8, bx - 30, by + 20, C.purple, hubW * 0.75, 7);

    // Nodes
    roundRect(ctx, ax - 38, ay - 26, 76, 52, 10, "rgba(124,156,255,0.2)", C.primary, 2);
    label(ctx, "COALITION", ax, ay - 4, C.primary, "bold 10px monospace", "center");
    label(ctx, `GDP ${(coalShare * 100).toFixed(0)}%`, ax, ay + 12, C.text, "10px monospace", "center");

    roundRect(ctx, bx - 38, by - 26, 76, 52, 10, "rgba(255,107,107,0.2)", C.danger, 2);
    label(ctx, "TARGET", bx, by - 4, C.danger, "bold 10px monospace", "center");
    label(ctx, "Sanctioned", bx, by + 12, C.text, "10px monospace", "center");

    roundRect(ctx, hx - 46, hy - 18, 92, 36, 8, "rgba(255,209,102,0.18)", C.accent, 1.6);
    label(ctx, "Neutral Hub A", hx, hy + 4, C.accent, "bold 10px monospace", "center");

    roundRect(ctx, hx2 - 46, hy2 - 18, 92, 36, 8, "rgba(192,132,252,0.18)", C.purple, 1.6);
    label(ctx, "Entrepôt Hub B", hx2, hy2 + 4, C.purple, "bold 10px monospace", "center");

    const netDenial = clamp(1 - (directFlow + rerouteFlow), 0, 1);

    return {
      "Direct Bilateral": `${(directFlow * 100).toFixed(1)}%`,
      "Hub Transshipment": `${(rerouteFlow * 100).toFixed(1)}%`,
      "Net Supply Denial": `${(netDenial * 100).toFixed(1)}%`,
      "Markup Price Wedge": `+${((tau - 1) * 18 * (1 + secEnf)).toFixed(0)}%`,
    };
  };

  // 8. geo_ach_competing_hypotheses — Heuer ACH Evidence × Hypothesis diagnostic matrix
  R.geo_ach_competing_hypotheses = function (ctx, W, H, st) {
    st.drawHUD("Heuer Analysis of Competing Hypotheses (ACH) Matrix", st.spec.formula);
    const diag = 0.2 + st.a * 0.8;
    const decept = st.b * 0.7;
    const anchor = st.c * 0.6;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "ACH Diagnostic Matrix: Prune Hypotheses by Inconsistency (I / II), Not Confirmation");

    const hyps = ["H₁: Exercise", "H₂: Coercive Bluff", "H₃: Imminent Invasion", "H₄: Maskirovka Deception"];
    const evs = [
      ["E₁: Field Hospitals Blood Supply", "II", "I", "CC", "C"],
      ["E₂: Encrypted Radio Silence", "I", "I", "C", "CC"],
      ["E₃: Diplomatic Track Open", "C", "CC", "I", "CC"],
      ["E₄: Reserve Mobilization", "II", "I", "CC", "I"],
    ];

    const mx = px + 18, my = py + 34, cw = (pw - 220) / 4, rh = 32;
    hyps.forEach((h, j) => {
      label(ctx, h, mx + 170 + j * cw + cw / 2, my + 14, C.primary, "bold 10px monospace", "center");
    });

    const scores = [0, 0, 0, 0];
    evs.forEach((row, r) => {
      const y = my + 24 + r * rh;
      roundRect(ctx, mx, y, pw - 36, rh - 4, 4, "rgba(255,255,255,0.03)", "rgba(255,255,255,0.08)", 1);
      label(ctx, row[0], mx + 8, y + 18, C.text, "10px monospace");
      for (let j = 0; j < 4; j++) {
        const cell = row[j + 1];
        const cx = mx + 170 + j * cw + cw / 2;
        const isInc = cell.startsWith("I");
        const col = isInc ? C.danger : C.ok;
        roundRect(ctx, cx - 22, y + 4, 44, rh - 12, 4, isInc ? "rgba(255,107,107,0.2)" : "rgba(110,231,183,0.15)", col, 1.2);
        label(ctx, cell, cx, y + 18, col, "bold 11px monospace", "center");
        const weight = (r === 0 || r === 3) ? diag * 1.4 : (1 - decept * 0.6);
        if (cell === "II") scores[j] -= 2.2 * weight;
        else if (cell === "I") scores[j] -= 1.0 * weight;
        else if (cell === "CC") scores[j] += 0.9 * weight;
        else scores[j] += 0.4 * weight;
      }
    });
    scores[0] += anchor * 1.8; // Cognitive anchoring on status-quo H1
    scores[3] += decept * 2.1;

    // Posterior probabilities via softmax
    const maxS = Math.max(...scores);
    const exps = scores.map((s) => Math.exp(s - maxS));
    const sumE = exps.reduce((a, b) => a + b, 0);
    const probs = exps.map((e) => e / sumE);

    const by = my + 24 + 4 * rh + 12;
    probs.forEach((p, j) => {
      const cx = mx + 170 + j * cw + cw / 2;
      const bw = cw - 18, bh = Math.max(4, p * 44);
      roundRect(ctx, cx - bw / 2, by + 44 - bh, bw, bh, 3, j === 2 ? C.ok : C.primary, null, 0);
      label(ctx, `P=${(p * 100).toFixed(0)}%`, cx, by + 58, C.accent, "bold 11px monospace", "center");
    });
    label(ctx, "Posterior P(H_k | E):", mx + 8, by + 36, C.accent, "bold 11px monospace");

    const bestIdx = probs.indexOf(Math.max(...probs));
    return {
      "Leading Hypothesis": hyps[bestIdx],
      "Posterior P(H₃)": `${(probs[2] * 100).toFixed(1)}%`,
      "Deception P(H₄)": `${(probs[3] * 100).toFixed(1)}%`,
      "Anchoring Bias": `${(anchor * 100).toFixed(0)}%`,
    };
  };

  // 9. geo_enigma_bombe_turing — 3-Rotor + Reflector scrambler + Turing Banburismus deciban bar
  R.geo_enigma_bombe_turing = function (ctx, W, H, st) {
    st.drawHUD("Bletchley Park Enigma 3-Rotor Scrambler & Turing Banburismus", st.spec.formula);
    const cribLen = Math.round(6 + st.a * 18);
    const steckers = Math.round(2 + st.b * 10);
    const closures = Math.round(1 + st.c * 4);

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Enigma Forward/Reflected Path (U-Reflector) & Bombe Menu Pruning");

    // Draw Plugboard -> R3 -> R2 -> R1 -> Reflector U
    const stages = [
      { name: `Plugboard (${steckers})`, x: 0.16, col: C.accent },
      { name: "Rotor III (Fast)", x: 0.34, col: C.primary },
      { name: "Rotor II (Mid)", x: 0.50, col: C.primary },
      { name: "Rotor I (Slow)", x: 0.66, col: C.primary },
      { name: "Reflector UKW-B", x: 0.83, col: C.secondary },
    ];

    const topY = py + 38, botY = py + ph - 52;
    const activePin = Math.floor(st.t * 2.5) % 6;
    const revPin = (activePin + 3) % 6;

    stages.forEach((s, idx) => {
      const sx = px + s.x * pw;
      roundRect(ctx, sx - 36, topY, 72, botY - topY, 8, "rgba(255,255,255,0.04)", s.col, 1.6);
      label(ctx, s.name, sx, topY - 7, s.col, "bold 10px monospace", "center");

      for (let p = 0; p < 6; p++) {
        const pyPin = topY + 18 + (p / 5) * (botY - topY - 36);
        ctx.fillStyle = p === activePin ? C.ok : (p === revPin ? C.danger : C.muted);
        ctx.beginPath(); ctx.arc(sx - 28, pyPin, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx + 28, pyPin, 3.5, 0, Math.PI * 2); ctx.fill();

        // Internal rotor scrambling wires
        const outP = (p + idx + 2) % 6;
        const pyOut = topY + 18 + (outP / 5) * (botY - topY - 36);
        ctx.strokeStyle = p === activePin ? C.ok : "rgba(255,255,255,0.12)";
        ctx.lineWidth = p === activePin ? 2.2 : 1;
        ctx.beginPath(); ctx.moveTo(sx - 28, pyPin); ctx.lineTo(sx + 28, pyOut); ctx.stroke();
      }
    });

    // Deciban log-odds evidence bar at bottom
    const decibans = (cribLen * 2.4 + closures * 8.5 - steckers * 1.1);
    const barW = clamp((decibans / 60) * (pw - 220), 10, pw - 220);
    roundRect(ctx, px + 180, botY + 14, pw - 210, 18, 4, "rgba(255,255,255,0.06)", C.axis, 1);
    roundRect(ctx, px + 180, botY + 14, barW, 18, 4, decibans >= 50 ? C.ok : C.accent, null, 0);
    label(ctx, `Turing Banburismus Score: +${decibans.toFixed(1)} decibans (50 db = 10⁵:1 Lock)`, px + 18, botY + 27, C.text, "bold 10px monospace");

    const falseStops = Math.max(1, Math.round(17576 * Math.pow(1 / 26, closures) * Math.exp(-cribLen * 0.18)));

    return {
      "Crib Length": `${cribLen} chars`,
      "Turing Decibans": `+${decibans.toFixed(1)} db`,
      "Bombe False Stops": `${falseStops} stops`,
      "Key Recovery": decibans >= 50 ? "BROKEN (Ultra)" : "Scanning Drum...",
    };
  };

  // 10. geo_thucydides_power_parity — Rising Challenger vs Hegemon logistic crossover & parity danger zone
  R.geo_thucydides_power_parity = function (ctx, W, H, st) {
    st.drawHUD("Organski Power Transition & Thucydides Parity Window", st.spec.formula);
    const dGrowth = 0.02 + st.a * 0.06;
    const dissat = st.b;
    const alliance = st.c * 0.35;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "National Power Trajectory: Hegemon Coalition vs Rising Challenger (0.8 ≤ P_R/P_H ≤ 1.2)");
    const ox = px + 42, oy = py + ph - 30, gw = pw - 70, gh = ph - 66;

    let crossI = -1;
    const hegPts = [], chalPts = [];
    for (let i = 0; i <= 100; i++) {
      const t = i * 0.5;
      const pH = (62 + 22 * alliance) * (1 + 0.006 * t);
      const pR = 110 / (1 + 4.8 * Math.exp(-dGrowth * 1.45 * t));
      hegPts.push(pH); chalPts.push(pR);
      if (crossI < 0 && pR >= pH * 0.8) crossI = i;
    }

    // Highlight Thucydides Parity Danger Zone (0.8 <= P_R/P_H <= 1.2)
    for (let i = 0; i < 100; i++) {
      const ratio = chalPts[i] / hegPts[i];
      if (ratio >= 0.8 && ratio <= 1.2) {
        const x = ox + (i / 100) * gw;
        ctx.fillStyle = `rgba(255,107,107,${0.12 + 0.22 * dissat})`;
        ctx.fillRect(x, py + 28, gw / 100 + 1, gh);
      }
    }

    const drawLine = (pts, col) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      pts.forEach((v, i) => {
        const x = ox + (i / 100) * gw, y = oy - clamp(v / 130, 0, 1) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    };
    drawLine(hegPts, C.primary);
    drawLine(chalPts, C.danger);

    label(ctx, "Hegemon + Balancing Allies P_H(t)", ox + 12, py + 42, C.primary, "bold 11px monospace");
    label(ctx, "Rising Challenger Logistic P_R(t)", ox + 12, py + 58, C.danger, "bold 11px monospace");
    label(ctx, "SHADED = Thucydides Parity Window (80%–120%)", ox + gw - 280, py + 42, C.accent, "bold 10px monospace");

    const warProb = clamp((0.18 + 0.65 * dissat - 0.35 * alliance) * (dGrowth / 0.05), 0.05, 0.95);

    return {
      "Growth Differential": `+${(dGrowth * 100).toFixed(1)}%/yr`,
      "Parity Onset": crossI > 0 ? `Year +${Math.round(crossI * 0.5)}` : "No Crossover",
      "Status Quo Dissat": `${(dissat * 100).toFixed(0)}%`,
      "Transition Risk": `${(warProb * 100).toFixed(0)}%`,
    };
  };

  // 11. geo_selectorate_bdm — Nested circles (Residents N -> Selectorate S -> Winning Coalition W)
  R.geo_selectorate_bdm = function (ctx, W, H, st) {
    st.drawHUD("Bueno de Mesquita Selectorate Theory (W / S Loyalty Norm)", st.spec.formula);
    const sFrac = 0.25 + st.b * 0.7;
    const wFrac = clamp(0.05 + st.a * 0.85, 0.05, sFrac);
    const rents = st.c;

    const px = 18, py = 46, pw = W * 0.5, ph = H - 62;
    st.panel(px, py, pw, ph, "Nested Regime Circles: Residents (N) ⊃ Selectorate (S) ⊃ Coalition (W)");
    const cx = px + pw * 0.5, cy = py + ph * 0.54;
    const maxR = Math.min(pw, ph) * 0.38;

    // Residents N circle
    ctx.save();
    ctx.fillStyle = "rgba(154,163,199,0.12)";
    ctx.strokeStyle = C.muted;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    label(ctx, "Disenfranchised Residents (N)", cx, cy - maxR - 6, C.muted, "10px monospace", "center");

    // Selectorate S circle
    const rS = maxR * Math.sqrt(sFrac);
    ctx.fillStyle = "rgba(124,156,255,0.18)";
    ctx.strokeStyle = C.primary;
    ctx.beginPath(); ctx.arc(cx, cy, rS, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    label(ctx, `Selectorate S (${(sFrac * 100).toFixed(0)}%)`, cx, cy - rS + 14, C.primary, "bold 10px monospace", "center");

    // Winning Coalition W circle
    const rW = maxR * Math.sqrt(wFrac);
    ctx.fillStyle = "rgba(255,209,102,0.32)";
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(cx, cy, rW, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    label(ctx, `W (${(wFrac * 100).toFixed(0)}%)`, cx, cy + 4, C.accent, "bold 11px monospace", "center");
    ctx.restore();

    // Right panel: Public Goods vs Private Patronage Rents
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Budget Allocation: Public Goods vs Kleptocratic Private Goods");

    const loyaltyNorm = wFrac / sFrac;
    const pubShare = clamp(wFrac * (1 - 0.45 * rents), 0.05, 0.92);
    const privShare = 1 - pubShare;

    const bx = rx + 24, by = py + 54, bw = rw - 48;
    // Public goods bar
    label(ctx, `Public Goods (Infrastructure, Rule of Law): ${(pubShare * 100).toFixed(0)}%`, bx, by - 6, C.ok, "bold 11px monospace");
    roundRect(ctx, bx, by, bw, 24, 5, "rgba(255,255,255,0.06)", C.axis, 1);
    roundRect(ctx, bx, by, bw * pubShare, 24, 5, C.ok, null, 0);

    // Private goods bar
    const by2 = by + 58;
    label(ctx, `Private Patronage / Crony Rents: ${(privShare * 100).toFixed(0)}%`, bx, by2 - 6, C.danger, "bold 11px monospace");
    roundRect(ctx, bx, by2, bw, 24, 5, "rgba(255,255,255,0.06)", C.axis, 1);
    roundRect(ctx, bx, by2, bw * privShare, 24, 5, C.danger, null, 0);

    const regimeType = wFrac < 0.2 ? (sFrac > 0.6 ? "Rigged Autocracy (Low W/S)" : "Junta / Monarchy") : "Consolidated Democracy";
    label(ctx, `Regime Archetype: ${regimeType}`, bx, by2 + 52, C.accent, "bold 11px monospace");
    label(ctx, `Defection Risk (W/S = ${loyaltyNorm.toFixed(2)}): ${loyaltyNorm < 0.35 ? "EXTREME LOYALTY TO AUTOCRAT" : "HIGH ACCOUNTABILITY"}`, bx, by2 + 72, C.text, "10px monospace");

    return {
      "Loyalty Norm W/S": loyaltyNorm.toFixed(2),
      "Public Goods Share": `${(pubShare * 100).toFixed(0)}%`,
      "Private Rents Share": `${(privShare * 100).toFixed(0)}%`,
      "Regime Type": regimeType,
    };
  };

  // 12. geo_semiconductor_supply_dag — ASML EUV -> EDA -> TSMC 2nm -> CoWoS Packaging DAG
  R.geo_semiconductor_supply_dag = function (ctx, W, H, st) {
    st.drawHUD("Semiconductor Chokepoint DAG & Weaponized Interdependence", st.spec.formula);
    const hhi = 2500 + st.a * 7000;
    const subYears = 1 + st.b * 9;
    const stockpile = 1 + st.c * 11;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Global AI Silicon DAG: Farrell–Newman Chokepoint & Panopticon Nodes");

    const nodes = [
      { id: "EDA Software\n(US 85%)", x: 0.14, y: 0.32, hhi: 7400, col: C.primary },
      { id: "ASML EUV\n(NL 100%)", x: 0.14, y: 0.72, hhi: 9800, col: C.danger },
      { id: "JSR Photoresist\n& Wafer (JP 90%)", x: 0.42, y: 0.28, hhi: 8100, col: C.accent },
      { id: "TSMC 2nm Fab\n(TW 92%)", x: 0.46, y: 0.66, hhi: 8600, col: C.danger },
      { id: "CoWoS + HBM3e\nPackaging", x: 0.74, y: 0.48, hhi: 6800, col: C.purple },
      { id: "AI Datacenter\nCompute", x: 0.91, y: 0.48, hhi: 4200, col: C.ok },
    ];
    const edges = [[0, 3], [1, 3], [2, 3], [0, 4], [3, 4], [4, 5]];

    edges.forEach(([u, v]) => {
      const n1 = nodes[u], n2 = nodes[v];
      arrow(ctx, px + n1.x * pw + 44, py + n1.y * ph, px + n2.x * pw - 44, py + n2.y * ph, "rgba(255,255,255,0.32)", 2.2, 7);
    });

    nodes.forEach((n) => {
      const nx = px + n.x * pw, ny = py + n.y * ph;
      const isChoke = n.hhi > 7500;
      roundRect(ctx, nx - 46, ny - 24, 92, 48, 8, isChoke ? "rgba(255,107,107,0.22)" : "rgba(22,26,46,0.9)", n.col, isChoke ? 2.4 : 1.5);
      const lines = n.id.split("\n");
      label(ctx, lines[0], nx, ny - 4, C.text, "bold 10px monospace", "center");
      label(ctx, lines[1] || "", nx, ny + 12, n.col, "10px monospace", "center");
    });

    const shockImpact = clamp((hhi / 10000) * (subYears / 10) * (1 - stockpile / 24), 0.08, 0.98);
    label(ctx, `Export Control Wafer Halt After ${stockpile.toFixed(1)} mo Buffer | Domestic Fab Lag: ${subYears.toFixed(1)} yrs`, px + 20, py + ph - 14, C.accent, "bold 11px monospace");

    return {
      "Bottleneck HHI": Math.round(hhi).toString(),
      "Substitution Lag": `${subYears.toFixed(1)} yrs`,
      "Buffer Depletion": `${stockpile.toFixed(1)} mos`,
      "Compute Leverage": `${(shockImpact * 100).toFixed(0)}% Chokepoint`,
    };
  };

  // 13. geo_alliance_burden_olson — Olson-Zeckhauser alliance burden-sharing bars & free-riding
  R.geo_alliance_burden_olson = function (ctx, W, H, st) {
    st.drawHUD("Olson–Zeckhauser Alliance Exploitation of the Great by the Small", st.spec.formula);
    const leadGdp = 0.35 + st.a * 0.45;
    const exclud = st.b;
    const tripwire = st.c;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Alliance GDP Share vs Defense Burden (% of GDP) — Target 2.0% Threshold");

    const allies = [
      { name: "Lead Hegemon", gdp: leadGdp * 100, defPct: 3.4 + 1.1 * (leadGdp - 0.4) - 0.5 * exclud },
      { name: "Tier-1 Regional", gdp: 18, defPct: 1.5 + 1.1 * exclud + 0.4 * tripwire },
      { name: "Frontline Ally", gdp: 9, defPct: 2.6 + 0.9 * tripwire },
      { name: "Distant Ally A", gdp: 11, defPct: 1.05 + 1.15 * exclud - 0.35 * tripwire },
      { name: "Small Ally B", gdp: 4, defPct: 0.85 + 1.2 * exclud - 0.4 * tripwire },
    ];

    const ox = px + 46, oy = py + ph - 34, gw = pw - 86, gh = ph - 72;
    // 2% NATO guideline line
    const y2pct = oy - (2.0 / 4.5) * gh;
    ctx.save();
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(ox, y2pct); ctx.lineTo(ox + gw, y2pct); ctx.stroke();
    label(ctx, "2.0% GDP Treaty Pledge", ox + gw - 145, y2pct - 6, C.accent, "bold 10px monospace");
    ctx.restore();

    const colW = gw / allies.length;
    allies.forEach((a, i) => {
      const cx = ox + i * colW + colW * 0.5;
      const bh = clamp(a.defPct / 4.5, 0.05, 1) * gh;
      const meets = a.defPct >= 2.0;
      roundRect(ctx, cx - 24, oy - bh, 48, bh, 5, meets ? "rgba(110,231,183,0.28)" : "rgba(255,107,107,0.28)", meets ? C.ok : C.danger, 1.8);
      label(ctx, `${a.defPct.toFixed(2)}%`, cx, oy - bh - 6, meets ? C.ok : C.danger, "bold 11px monospace", "center");
      label(ctx, a.name, cx, oy + 16, C.text, "10px monospace", "center");
    });

    const freeRideIdx = clamp((allies[0].defPct / allies[4].defPct), 1, 6);

    return {
      "Hegemon Defense %": `${allies[0].defPct.toFixed(2)}% GDP`,
      "Small Ally %": `${allies[4].defPct.toFixed(2)}% GDP`,
      "Disproportionality": `${freeRideIdx.toFixed(2)}x Ratio`,
      "Snyder Dilemma": tripwire > 0.6 ? "Entrapment Risk" : "Abandonment Risk",
    };
  };

  // 14. geo_coin_insurgency — Berman-Shapiro COIN triangle (Govt, Insurgents, Civilians + Tips loop)
  R.geo_coin_insurgency = function (ctx, W, H, st) {
    st.drawHUD("Counterinsurgency (COIN) Intelligence–Population Security Loop", st.spec.formula);
    const sec = 0.15 + st.a * 0.8;
    const collat = st.b * 0.85;
    const aid = st.c * 0.85;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Berman–Shapiro Conditional Tips Game: Security × Aid → Tips → Selective Attrition");

    const gx = px + pw * 0.22, gy = py + ph * 0.70;
    const ix = px + pw * 0.78, iy = py + ph * 0.70;
    const cx = px + pw * 0.50, cy = py + ph * 0.26;

    const tipRate = clamp(sec * (0.55 + 0.55 * aid) * (1 - 0.75 * collat), 0.04, 0.98);
    const insurgentRecruit = clamp((1 - sec) * 0.5 + collat * 0.65 - aid * 0.25, 0.05, 0.95);

    // Arrows between nodes
    arrow(ctx, gx + 34, gy - 24, cx - 34, cy + 20, C.primary, 1.5 + sec * 5, 7);
    label(ctx, `Security + Aid (${(sec * 100).toFixed(0)}%)`, (gx + cx) / 2 - 65, (gy + cy) / 2 - 8, C.primary, "10px monospace");

    arrow(ctx, cx - 12, cy + 26, gx + 50, gy - 12, C.ok, 1.5 + tipRate * 6, 7);
    label(ctx, `Anon Tips (${(tipRate * 100).toFixed(0)}%)`, (gx + cx) / 2 + 12, (gy + cy) / 2 + 16, C.ok, "bold 10px monospace");

    arrow(ctx, ix - 34, iy - 24, cx + 34, cy + 20, C.danger, 1.5 + insurgentRecruit * 5, 7);
    label(ctx, `Intimidation / Grievances`, (ix + cx) / 2 + 8, (iy + cy) / 2 - 4, C.danger, "10px monospace");

    arrow(ctx, gx + 54, gy, ix - 54, iy, C.accent, 2 + tipRate * 5, 8);
    label(ctx, `Precision Targeting vs Collateral (${(collat * 100).toFixed(0)}%)`, (gx + ix) / 2, gy + 20, C.accent, "bold 10px monospace", "center");

    // 3 Actor Boxes
    roundRect(ctx, cx - 54, cy - 22, 108, 44, 8, "rgba(110,231,183,0.18)", C.ok, 2);
    label(ctx, "CIVILIANS", cx, cy - 3, C.ok, "bold 11px monospace", "center");
    label(ctx, "Hold Info on Rebels", cx, cy + 12, C.text, "9px monospace", "center");

    roundRect(ctx, gx - 50, gy - 22, 100, 44, 8, "rgba(124,156,255,0.18)", C.primary, 2);
    label(ctx, "GOVERNMENT", gx, gy - 3, C.primary, "bold 11px monospace", "center");
    label(ctx, "Clear-Hold-Build", gx, gy + 12, C.text, "9px monospace", "center");

    roundRect(ctx, ix - 50, iy - 22, 100, 44, 8, "rgba(255,107,107,0.18)", C.danger, 2);
    label(ctx, "INSURGENTS", ix, iy - 3, C.danger, "bold 11px monospace", "center");
    label(ctx, `Strength ${(insurgentRecruit * 100).toFixed(0)}%`, ix, iy + 12, C.text, "9px monospace", "center");

    return {
      "Intelligence Tips": `${(tipRate * 100).toFixed(1)}%`,
      "Insurgent Base": `${(insurgentRecruit * 100).toFixed(1)}%`,
      "Backlash Effect": `${(collat * 100).toFixed(0)}%`,
      "District Control": tipRate > insurgentRecruit ? "Gov Pacified" : "Contested / Rebel",
    };
  };

  // 15. geo_swift_dollar_network — Hub-and-Spoke SWIFT USD clearing vs fragmented bilateral links
  R.geo_swift_dollar_network = function (ctx, W, H, st) {
    st.drawHUD("SWIFT Correspondent Banking Hub & Reserve Currency Inertia", st.spec.formula);
    const gamma = 1.1 + st.a * 1.4;
    const swapDepth = st.b;
    const altFriction = 10 + st.c * 140; // bps

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "CHIPS/SWIFT USD Hub-and-Spoke Topology vs Bilateral Local-Currency Spokes");

    const cx = px + pw * 0.36, cy = py + ph * 0.53;
    const r = Math.min(pw, ph) * 0.33;
    const banks = ["EUR (Target2)", "JPY (Tokyo)", "GBP (London)", "CNY (CIPS)", "INR (Mumbai)", "BRL (São Paulo)"];

    const usdShare = clamp(0.52 + 0.18 * (gamma - 1.5) + 0.12 * swapDepth + (altFriction / 350), 0.32, 0.88);

    // Spokes to central USD hub & faint bilateral ring
    banks.forEach((bName, i) => {
      const ang = (i / banks.length) * Math.PI * 2 + st.t * 0.08;
      const bx = cx + Math.cos(ang) * r, by = cy + Math.sin(ang) * r;
      const ang2 = ((i + 1) / banks.length) * Math.PI * 2 + st.t * 0.08;
      const bx2 = cx + Math.cos(ang2) * r, by2 = cy + Math.sin(ang2) * r;

      // Bilateral local clearing line
      ctx.strokeStyle = "rgba(255,209,102,0.28)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx2, by2); ctx.stroke();
      ctx.setLineDash([]);

      // USD Correspondent hub spoke
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2 + usdShare * 4;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();

      roundRect(ctx, bx - 38, by - 14, 76, 28, 6, "rgba(22,26,46,0.92)", C.accent, 1.4);
      label(ctx, bName, bx, by + 4, C.text, "9px monospace", "center");
    });

    roundRect(ctx, cx - 44, cy - 24, 88, 48, 12, "rgba(110,231,183,0.22)", C.ok, 2.4);
    label(ctx, "USD HUB", cx, cy - 4, C.ok, "bold 11px monospace", "center");
    label(ctx, `${(usdShare * 100).toFixed(1)}% FX`, cx, cy + 12, C.text, "10px monospace", "center");

    // Right side currency share bars
    const rx = px + pw * 0.68, rw = pw * 0.28;
    const shares = [
      { c: "USD Vehicle", v: usdShare, col: C.ok },
      { c: "EUR Clearing", v: (1 - usdShare) * 0.48, col: C.primary },
      { c: "CNY / CIPS", v: (1 - usdShare) * 0.28, col: C.danger },
      { c: "Other / Gold", v: (1 - usdShare) * 0.24, col: C.accent },
    ];
    shares.forEach((s, i) => {
      const y = py + 48 + i * 38;
      label(ctx, `${s.c}: ${(s.v * 100).toFixed(1)}%`, rx, y - 5, s.col, "bold 10px monospace");
      roundRect(ctx, rx, y, rw, 16, 4, "rgba(255,255,255,0.06)", C.axis, 1);
      roundRect(ctx, rx, y, rw * s.v, 16, 4, s.col, null, 0);
    });

    return {
      "USD Clearing Share": `${(usdShare * 100).toFixed(1)}%`,
      "Alt FX Friction": `${altFriction.toFixed(0)} bps`,
      "Network Exponent γ": gamma.toFixed(2),
      "Bilateral Share": `${((1 - usdShare) * 28).toFixed(1)}%`,
    };
  };

  // 16. geo_cyber_attribution_deter — Gray-zone salami-slicing below kinetic redline & attribution lag
  R.geo_cyber_attribution_deter = function (ctx, W, H, st) {
    st.drawHUD("Gray-Zone Salami-Slicing & Forensic Attribution Threshold", st.spec.formula);
    const slice = 0.12 + st.a * 0.75;
    const attrib = 0.2 + st.b * 0.78;
    const blur = 0.05 + st.c * 0.35;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Sub-Threshold Salami Slices vs Defender Article-5 Redline & Attribution Band");
    const ox = px + 40, oy = py + ph - 30, gw = pw - 66, gh = ph - 66;

    const redline = 0.68;
    const redY = oy - redline * gh;
    // Fuzzy redline ambiguity zone
    ctx.fillStyle = "rgba(255,107,107,0.18)";
    ctx.fillRect(ox, redY - blur * gh * 0.5, gw, blur * gh);
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(ox, redY); ctx.lineTo(ox + gw, redY); ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, `Kinetic Casus Belli Redline (±${(blur * 50).toFixed(0)}% Ambiguity)`, ox + 10, redY - 8, C.danger, "bold 10px monospace");

    // Draw 8 salami-slice operations as impulses + attribution confidence curve
    const nOps = 8;
    for (let i = 0; i < nOps; i++) {
      const x = ox + ((i + 0.6) / nOps) * gw;
      const amp = slice * (0.75 + 0.25 * Math.sin(i * 1.7));
      const bh = clamp(amp, 0.05, 0.95) * gh;
      const triggered = amp > redline - blur * 0.3 && attrib > 0.6;
      roundRect(ctx, x - 14, oy - bh, 28, bh, 4, triggered ? "rgba(255,107,107,0.45)" : "rgba(124,156,255,0.32)", triggered ? C.danger : C.primary, 1.6);
      label(ctx, `Op${i + 1}`, x, oy + 14, C.muted, "9px monospace", "center");
    }

    // Attribution confidence curve P_attrib(t)
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const pAtt = attrib * (1 - Math.exp(-u * 4.2));
      const x = ox + u * gw, y = oy - pAtt * gh;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    label(ctx, `Forensic Attribution Curve P_attrib → ${(attrib * 100).toFixed(0)}%`, ox + gw - 265, oy - attrib * gh - 8, C.ok, "bold 10px monospace");

    const deterred = slice * attrib > redline - blur * 0.25;
    return {
      "Slice Magnitude": `${(slice * 100).toFixed(0)}% of Redline`,
      "Attribution Conf": `${(attrib * 100).toFixed(0)}%`,
      "Fait Accompli Gain": deterred ? "Blocked / Retaliated" : `+${(slice * 8 * 12).toFixed(0)} Cumulative`,
      "Deterrence Status": deterred ? "Credible Response" : "Sub-Threshold Evasion",
    };
  };

  // 17. geo_critical_minerals_cartel — Refining concentration bars (Ga, Ge, Graphite, REE, Co, Li) + Wright's Law
  R.geo_critical_minerals_cartel = function (ctx, W, H, st) {
    st.drawHUD("Critical Minerals Refining Concentration & Wright's Law Substitution", st.spec.formula);
    const quotaCut = st.a * 0.65;
    const lagYr = 2 + st.b * 10;
    const subst = st.c;

    const px = 18, py = 46, pw = W * 0.52, ph = H - 62;
    st.panel(px, py, pw, ph, "Dominant Country Refining Share (%) vs Mining Extraction");

    const mins = [
      { m: "Gallium (Ga)", ref: 94, col: C.danger },
      { m: "Rare Earths (NdPr)", ref: 89, col: C.danger },
      { m: "Anode Graphite", ref: 86, col: C.secondary },
      { m: "Cobalt Refining", ref: 76, col: C.accent },
      { m: "Lithium Chemical", ref: 65, col: C.primary },
    ];

    const bx = px + 118, bw = pw - 140;
    mins.forEach((item, i) => {
      const y = py + 34 + i * 32;
      const effShare = item.ref * (1 - 0.28 * subst);
      label(ctx, item.m, px + 12, y + 13, C.text, "10px monospace");
      roundRect(ctx, bx, y, bw, 18, 4, "rgba(255,255,255,0.06)", C.axis, 1);
      roundRect(ctx, bx, y, bw * (effShare / 100), 18, 4, item.col, null, 0);
      label(ctx, `${effShare.toFixed(0)}%`, bx + bw * (effShare / 100) - 28, y + 13, C.bg, "bold 10px monospace");
    });

    // Right panel: Wright's Law Learning Curve & Export Quota Price Spike
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Export Quota Price Spike & LFP/Sodium Substitution Curve");
    const ox = rx + 28, oy = py + ph - 28, gw = rw - 44, gh = ph - 62;

    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * 12; // years
      const spike = 1 + quotaCut * 3.4 * Math.exp(-Math.max(0, t - 1.2) / (lagYr * (1 - 0.45 * subst)));
      const x = ox + (i / 50) * gw, y = oy - clamp((spike - 0.8) / 3.0, 0, 1) * gh;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    label(ctx, "Spot Oxide Price Multiple P(t)/P₀", ox + 8, py + 38, C.danger, "bold 10px monospace");
    label(ctx, `Greenfield Mine + Refinery Lag: ${lagYr.toFixed(1)} yrs`, ox + 8, oy - 8, C.accent, "10px monospace");

    const lerner = clamp((0.82 * (1 + quotaCut)) / (0.35 + subst * 0.9), 0.15, 0.92);

    return {
      "Export Quota Cut": `-${(quotaCut * 100).toFixed(0)}%`,
      "Peak Price Spike": `${(1 + quotaCut * 3.4).toFixed(2)}x Spot`,
      "Cartel Lerner Index": lerner.toFixed(2),
      "Tech Substitution": `${(subst * 100).toFixed(0)}% LFP/Na-ion`,
    };
  };

  // 18. geo_putnam_two_level — Putnam Level I International Table + Level II Domestic Win-Set W_A ∩ W_B
  R.geo_putnam_two_level = function (ctx, W, H, st) {
    st.drawHUD("Putnam Two-Level Diplomatic Game & Domestic Win-Set Overlap", st.spec.formula);
    const wA = 0.15 + st.a * 0.55;
    const wB = 0.15 + st.b * 0.55;
    const veto = st.c * 0.35;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Level I Summit Bargaining Linked to Level II Legislative Ratification (W_A ∩ W_B)");

    const bx = px + 54, bw = pw - 108, by = py + ph * 0.58;
    // Policy continuum [0, 1]
    roundRect(ctx, bx, by, bw, 14, 6, "rgba(255,255,255,0.08)", C.axis, 1.2);

    const effWA = Math.max(0.08, wA - veto * 0.45);
    const effWB = Math.max(0.08, wB - veto * 0.45);
    const aEnd = effWA;          // State A accepts [0, aEnd]
    const bStart = 1 - effWB;    // State B accepts [bStart, 1]

    // Draw Win-Set A
    roundRect(ctx, bx, by - 36, bw * aEnd, 26, 5, "rgba(124,156,255,0.28)", C.primary, 2);
    label(ctx, `State A Win-Set W_A [0, ${aEnd.toFixed(2)}]`, bx + 8, by - 19, C.primary, "bold 10px monospace");

    // Draw Win-Set B
    roundRect(ctx, bx + bw * bStart, by + 22, bw * effWB, 26, 5, "rgba(255,143,171,0.28)", C.secondary, 2);
    label(ctx, `State B Win-Set W_B [${bStart.toFixed(2)}, 1]`, bx + bw - 8, by + 39, C.secondary, "bold 10px monospace", "right");

    // Overlap W_A ∩ W_B
    const overlap = aEnd - bStart;
    if (overlap > 0) {
      const ox = bx + bw * bStart, ow = bw * overlap;
      roundRect(ctx, ox, by - 42, ow, 96, 6, "rgba(110,231,183,0.24)", C.ok, 2.2);
      const dealPt = (bStart + aEnd) / 2;
      label(ctx, `TREATY x*=${dealPt.toFixed(2)}`, ox + ow / 2, by - 48, C.ok, "bold 11px monospace", "center");
    } else {
      label(ctx, "INVOLUNTARY DEFECTION (W_A ∩ W_B = ∅) — Summit Collapse!", px + pw / 2, by - 48, C.danger, "bold 11px monospace", "center");
    }

    const dealPoint = overlap > 0 ? ((bStart + aEnd) / 2).toFixed(2) : "No Deal";
    return {
      "Win-Set W_A": `[0.00, ${aEnd.toFixed(2)}]`,
      "Win-Set W_B": `[${bStart.toFixed(2)}, 1.00]`,
      "Overlap Width": overlap > 0 ? `+${overlap.toFixed(2)}` : `${overlap.toFixed(2)} (Empty)`,
      "Schelling Leverage": effWA < effWB ? "State A Favored" : "State B Favored",
    };
  };

  // 19. geo_mackinder_rimland — Heartland / Rimland / First & Second Island Chain geostrategic map
  R.geo_mackinder_rimland = function (ctx, W, H, st) {
    st.drawHUD("Mackinder Heartland vs Spykman Rimland & Island Chain A2/AD", st.spec.formula);
    const seaEff = 0.3 + st.a * 0.7;
    const basing = 0.2 + st.b * 0.75;
    const a2ad = 0.15 + st.c * 0.8;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Eurasian Heartland Interior Lines vs Rimland Maritime Containment & Island Chains");

    const hx = px + pw * 0.38, hy = py + ph * 0.46;
    // Heartland core
    roundRect(ctx, hx - 95, hy - 54, 190, 108, 28, "rgba(255,107,107,0.22)", C.danger, 2.2);
    label(ctx, "EURASIAN HEARTLAND", hx, hy - 10, C.danger, "bold 11px monospace", "center");
    label(ctx, "Interior Rail / Pipeline Lines", hx, hy + 8, C.text, "10px monospace", "center");

    // Spykman Rimland buffer arc
    ctx.save();
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(hx, hy, 132, -0.35 * Math.PI, 0.75 * Math.PI);
    ctx.stroke();
    label(ctx, "SPYKMAN RIMLAND AMPHIBIOUS BUFFER ZONE", hx, hy + 128, C.accent, "bold 10px monospace", "center");

    // First and Second Island Chains on the Pacific (right) side
    const ic1R = 155 + a2ad * 35;
    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.4;
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    ctx.arc(hx + 30, hy, ic1R, -0.32 * Math.PI, 0.32 * Math.PI);
    ctx.stroke();
    label(ctx, "1st Island Chain / A2AD", hx + 35 + ic1R, hy - 24, C.secondary, "bold 10px monospace");

    const ic2R = 225;
    ctx.strokeStyle = C.primary;
    ctx.beginPath();
    ctx.arc(hx + 30, hy, ic2R, -0.32 * Math.PI, 0.32 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, "2nd Island Chain (Blue-Water)", hx + 35 + ic2R, hy + 28, C.primary, "bold 10px monospace");
    ctx.restore();

    const rimControl = clamp((seaEff * 0.55 + basing * 0.65) - a2ad * 0.5, 0, 1);

    return {
      "Rimland Balance": rimControl >= 0.5 ? "Maritime Containment" : "Continental Breakout",
      "A2/AD Keep-Out": `${Math.round(800 + a2ad * 1400)} km`,
      "Forward Basing": `${(basing * 100).toFixed(0)}% Access`,
      "Sea-vs-Land Ratio": `${(seaEff * 2.5).toFixed(2)}x`,
    };
  };

  // 20. geo_demographic_support_ratio — Age-Sex Population Pyramid (Youth, Working, 65+) & Fiscal Support Ratio
  R.geo_demographic_support_ratio = function (ctx, W, H, st) {
    st.drawHUD("Demographic Transition Age Pyramid & Fiscal Support Ratio", st.spec.formula);
    const tfr = 0.8 + st.a * 3.0;     // 0.8 .. 3.8
    const aiProd = st.b * 0.6;
    const retAge = Math.round(60 + st.c * 10);

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Population Cohort Pyramid (Male Left / Female Right) & Pension Dependency");

    const cx = px + pw * 0.42, oy = py + ph - 26, gh = ph - 58;
    const bands = ["0–14", "15–29", "30–44", "45–59", "60–74", "75+"];
    const weights = bands.map((_, i) => {
      // High TFR => wide base; low TFR => inverted top-heavy urn
      const slope = (tfr - 2.1) * 0.28;
      return clamp(1.0 - slope * (i - 2.5) - (i === 5 ? 0.28 : 0), 0.22, 1.65);
    });

    const bh = gh / bands.length;
    weights.forEach((w, i) => {
      const y = oy - (i + 1) * bh + 3;
      const halfW = w * 95;
      const isSenior = i >= 4;
      const isYouth = i === 0;
      const col = isSenior ? C.danger : (isYouth ? C.accent : C.primary);
      // Male bar (left) & Female bar (right)
      roundRect(ctx, cx - halfW - 2, y, halfW, bh - 6, 3, col, null, 0);
      roundRect(ctx, cx + 2, y, halfW, bh - 6, 3, col, null, 0);
      label(ctx, bands[i], cx - halfW - 38, y + bh * 0.55, C.text, "10px monospace");
    });

    const workPop = weights[1] + weights[2] + weights[3] + (retAge - 60) * 0.06 * weights[4];
    const depPop = 0.5 * weights[0] + 1.2 * (weights[4] + weights[5]);
    const supportRatio = (workPop * (1 + aiProd * 0.5)) / depPop;

    // Right summary card
    const rx = px + pw * 0.70;
    label(ctx, `TFR = ${tfr.toFixed(2)} births/woman`, rx, py + 56, tfr < 2.1 ? C.danger : C.ok, "bold 12px monospace");
    label(ctx, "Replacement = 2.10", rx, py + 74, C.muted, "10px monospace");
    label(ctx, `Support Ratio: ${supportRatio.toFixed(2)}x`, rx, py + 108, C.accent, "bold 12px monospace");
    label(ctx, `Retirement Age: ${retAge} yrs`, rx, py + 130, C.primary, "11px monospace");
    label(ctx, tfr < 1.5 ? "AGING CONTRACTION" : (tfr > 2.8 ? "YOUTH BULGE DIVIDEND" : "STABLE COHORT"), rx, py + 162, C.text, "bold 11px monospace");

    return {
      "Fertility (TFR)": `${tfr.toFixed(2)}`,
      "Support Ratio": `${supportRatio.toFixed(2)} workers/dep`,
      "65+ Old-Age Share": `${(((weights[4] + weights[5]) / weights.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`,
      "Demographic Phase": tfr < 1.6 ? "Inverted Aging" : (tfr > 2.6 ? "Youth Bulge" : "Balanced"),
    };
  };

  // =========================================================================
  // 2. JURISPRUDENCE (20 SIMULATIONS)
  // =========================================================================

  // 21. jur_hohfeld_square — Hohfeldian Square of Jural Correlatives (vertical) & Opposites (diagonal)
  R.jur_hohfeld_square = function (ctx, W, H, st) {
    st.drawHUD("Hohfeldian Jural Correlatives & Opposites Algebra", st.spec.formula);
    const mode = Math.min(3, Math.floor(st.a * 4));
    const meta = st.b > 0.5;
    const liabRule = st.c > 0.5;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "1st-Order Square (Claim/Duty/Privilege/No-Right) & 2nd-Order Square (Power/Liability/Immunity/Disability)");

    const drawHohfeldBox = (cx, cy, title, corners, activePair, highlight) => {
      const hw = 105, hh = 64;
      roundRect(ctx, cx - hw - 44, cy - hh - 32, (hw + 44) * 2, (hh + 32) * 2, 10,
        highlight ? "rgba(124,156,255,0.08)" : "rgba(255,255,255,0.02)", highlight ? C.primary : C.axis, highlight ? 1.8 : 1);
      label(ctx, title, cx, cy - hh - 14, highlight ? C.primary : C.muted, "bold 11px monospace", "center");

      const pts = [
        { x: cx - hw, y: cy - hh + 12, name: corners[0], party: "Holder A" },
        { x: cx + hw, y: cy - hh + 12, name: corners[1], party: "Holder A" },
        { x: cx - hw, y: cy + hh - 4, name: corners[2], party: "Counterparty B" },
        { x: cx + hw, y: cy + hh - 4, name: corners[3], party: "Counterparty B" },
      ];

      // Vertical Correlatives (0<->2, 1<->3)
      arrow(ctx, pts[0].x, pts[0].y + 18, pts[2].x, pts[2].y - 18, C.ok, 2.2, 6);
      arrow(ctx, pts[1].x, pts[1].y + 18, pts[3].x, pts[3].y - 18, C.ok, 2.2, 6);
      label(ctx, "Correlative", pts[0].x - 36, cy + 6, C.ok, "9px monospace");
      label(ctx, "Correlative", pts[1].x + 8, cy + 6, C.ok, "9px monospace");

      // Diagonal Opposites (0<->3, 1<->2)
      ctx.save();
      ctx.strokeStyle = C.danger;
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(pts[0].x + 36, pts[0].y + 12); ctx.lineTo(pts[3].x - 36, pts[3].y - 12);
      ctx.moveTo(pts[1].x - 36, pts[1].y + 12); ctx.lineTo(pts[2].x + 36, pts[2].y - 12);
      ctx.stroke();
      ctx.restore();
      label(ctx, "× Jural Opposites (¬)", cx, cy + 6, C.danger, "bold 9px monospace", "center");

      pts.forEach((p, idx) => {
        const isAct = (activePair === 0 && (idx === 0 || idx === 2)) || (activePair === 1 && (idx === 1 || idx === 3));
        roundRect(ctx, p.x - 46, p.y - 15, 92, 30, 6, isAct ? "rgba(255,209,102,0.25)" : "rgba(22,26,46,0.92)", isAct ? C.accent : C.primary, isAct ? 2.2 : 1.2);
        label(ctx, p.name, p.x, p.y + 4, isAct ? C.accent : C.text, "bold 10px monospace", "center");
      });
    };

    drawHohfeldBox(px + pw * 0.27, py + ph * 0.54, "1st-Order Conduct Relations",
      ["CLAIM-RIGHT", "PRIVILEGE", "DUTY", "NO-RIGHT"], mode % 2, !meta);
    drawHohfeldBox(px + pw * 0.73, py + ph * 0.54, "2nd-Order Rule-Change Relations",
      ["POWER", "IMMUNITY", "LIABILITY", "DISABILITY"], mode % 2, meta);

    const activePairName = !meta
      ? (mode % 2 === 0 ? "Claim(A) ↔ Duty(B)" : "Privilege(A) ↔ No-Right(B)")
      : (mode % 2 === 0 ? "Power(A) ↔ Liability(B)" : "Immunity(A) ↔ Disability(B)");

    return {
      "Active Correlative": activePairName,
      "Jural Order": meta ? "2nd-Order (Meta-Power)" : "1st-Order (Primary)",
      "Protection Rule": liabRule ? "Liability Rule (Damages)" : "Property Rule (Injunction)",
      "Negation Opposite": mode % 2 === 0 ? "¬Duty = Privilege" : "¬Claim = No-Right",
    };
  };

  // 22. jur_coase_calabresi — Coase Marginal Abatement vs Harm curves + Calabresi-Melamed 4-Rule grid
  R.jur_coase_calabresi = function (ctx, W, H, st) {
    st.drawHUD("Coase Theorem Bargaining & Calabresi–Melamed Entitlement Rules", st.spec.formula);
    const txCost = st.a * 45;
    const asymm = st.b * 30;
    const holdouts = Math.round(1 + st.c * 49);

    const px = 18, py = 46, pw = W * 0.54, ph = H - 62;
    st.panel(px, py, pw, ph, "Marginal Abatement Benefit MB(e) vs Marginal Pollution Harm MD(e)");
    const ox = px + 38, oy = py + ph - 28, gw = pw - 56, gh = ph - 58;

    // Coase intersection at e* = 0.5
    ctx.save();
    // MB(e) downward sloping
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(ox, oy - gh * 0.88);
    ctx.lineTo(ox + gw, oy - gh * 0.08);
    ctx.stroke();
    label(ctx, "Polluter Marginal Profit MB(e)", ox + 8, oy - gh * 0.88 + 14, C.primary, "bold 10px monospace");

    // MD(e) upward sloping
    ctx.strokeStyle = C.danger;
    ctx.beginPath();
    ctx.moveTo(ox, oy - gh * 0.08);
    ctx.lineTo(ox + gw, oy - gh * 0.88);
    ctx.stroke();
    label(ctx, "Victim Marginal Harm MD(e)", ox + gw - 175, oy - gh * 0.88 + 14, C.danger, "bold 10px monospace");

    // Coasean optimum e*
    const ex = ox + gw * 0.5, ey = oy - gh * 0.48;
    ctx.fillStyle = C.ok;
    ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();
    label(ctx, "Coasean Optimum e*", ex - 48, ey - 12, C.ok, "bold 10px monospace");
    ctx.restore();

    // Right panel: Calabresi-Melamed Cathedral 2x2 Matrix
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Calabresi–Melamed 4-Rule Cathedral Matrix");

    const totalFriction = txCost + asymm + holdouts * 0.85;
    const preferLiability = totalFriction > 38;
    const rules = [
      { r: "Rule 1: Victim Injunction", sub: "Property Rule (Low C_tx)", act: !preferLiability },
      { r: "Rule 2: Victim Damages", sub: "Liability Rule (Boomer v. Atlantic)", act: preferLiability },
      { r: "Rule 3: Polluter Right", sub: "No Nuisance (Victim Pays)", act: false },
      { r: "Rule 4: Purchased Injunction", sub: "Spur Industries Reverse Liab", act: false },
    ];

    rules.forEach((item, i) => {
      const bx = rx + 14, by = py + 34 + i * 44, bw = rw - 28;
      roundRect(ctx, bx, by, bw, 38, 6, item.act ? "rgba(110,231,183,0.22)" : "rgba(255,255,255,0.04)", item.act ? C.ok : C.axis, item.act ? 2.2 : 1);
      label(ctx, item.r, bx + 10, by + 15, item.act ? C.ok : C.text, "bold 10px monospace");
      label(ctx, item.sub, bx + 10, by + 30, C.muted, "9px monospace");
    });

    const netSurplus = Math.max(0, 65 - totalFriction);
    return {
      "Transaction Cost": `$${totalFriction.toFixed(1)}k`,
      "Plaintiff Holdouts": `${holdouts} parties`,
      "Coasean Bargain": preferLiability ? "Blocked (High C_tx)" : "Pareto Efficient",
      "Optimal Remedy": preferLiability ? "Rule 2 (Damages)" : "Rule 1 (Injunction)",
    };
  };

  // 23. jur_learned_hand_tort — Precaution Cost B(x), Expected Harm P(x)L, Total Social Cost U-curve
  R.jur_learned_hand_tort = function (ctx, W, H, st) {
    st.drawHUD("Learned Hand Formula (B < P·L) & Optimal Tort Precaution x*", st.spec.formula);
    const L = 40 + st.a * 160;
    const cB = 0.4 + st.b * 1.8;
    const actVol = 0.6 + st.c * 1.4;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Social Cost Minimization: Precaution B(x) + Expected Accident Loss P(x)·L");
    const ox = px + 44, oy = py + ph - 30, gw = pw - 84, gh = ph - 66;

    // Optimal care x* where cB = -P'(x)*L => P(x) = exp(-2.5*x)
    const xStar = clamp(Math.log((2.5 * L * actVol) / (cB * 80)) / 2.5, 0.12, 0.88);
    const curX = clamp(st.px, 0.08, 0.92);

    const drawC = (fn, col, lw) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = lw || 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = i / 80;
        const v = fn(x);
        const sx = ox + x * gw, sy = oy - clamp(v / 160, 0, 0.95) * gh;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.restore();
    };

    const fnB = (x) => cB * 85 * x;
    const fnPL = (x) => L * actVol * Math.exp(-2.8 * x);
    const fnTot = (x) => fnB(x) + fnPL(x);

    drawC(fnB, C.primary, 2);
    drawC(fnPL, C.danger, 2);
    drawC(fnTot, C.accent, 2.8);

    // Due care threshold line x*
    const sxStar = ox + xStar * gw;
    ctx.save();
    ctx.strokeStyle = C.ok;
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(sxStar, py + 28); ctx.lineTo(sxStar, oy); ctx.stroke();
    ctx.restore();
    label(ctx, `Due Care Standard x* = ${(xStar * 100).toFixed(0)}%`, sxStar + 6, py + 42, C.ok, "bold 11px monospace");

    // Current injurer care probe
    const sxCur = ox + curX * gw, syCur = oy - clamp(fnTot(curX) / 160, 0, 0.95) * gh;
    const isNegligent = curX < xStar;
    ctx.fillStyle = isNegligent ? C.danger : C.ok;
    ctx.beginPath(); ctx.arc(sxCur, syCur, 6.5, 0, Math.PI * 2); ctx.fill();
    label(ctx, isNegligent ? "NEGLIGENT (B < PL)" : "NON-NEGLIGENT (B ≥ PL)", sxCur - 55, syCur - 12, isNegligent ? C.danger : C.ok, "bold 11px monospace");

    label(ctx, "Precaution Cost B(x)", ox + 12, py + 42, C.primary, "10px monospace");
    label(ctx, "Expected Harm P(x)·L", ox + 12, py + 56, C.danger, "10px monospace");
    label(ctx, "Total Social Cost B(x)+P(x)L", ox + 12, py + 70, C.accent, "bold 10px monospace");

    return {
      "Optimal Care x*": `${(xStar * 100).toFixed(1)}%`,
      "Actual Care x": `${(curX * 100).toFixed(1)}%`,
      "Hand Test": isNegligent ? "Breach (B < P·L)" : "Compliant (B ≥ P·L)",
      "Total Social Cost": `$${fnTot(curX).toFixed(1)}k`,
    };
  };

  // 24. jur_bayes_evidence_403 — Bayesian Prior -> LR -> Posterior cascade & FRE Rule 403 balance
  R.jur_bayes_evidence_403 = function (ctx, W, H, st) {
    st.drawHUD("Bayesian Forensic Likelihood Ratio & FRE Rule 403 Gate", st.spec.formula);
    const logPrior = -4 + st.a * 4.5; // 10^-4 to 10^0.5
    const logLR = 1 + st.b * 5.0;     // 10^1 to 10^6
    const labErr = 0.0005 + st.c * 0.04;

    const priorOdds = Math.pow(10, logPrior);
    // Effective LR capped by lab false-positive rate 1/labErr
    const rawLR = Math.pow(10, logLR);
    const effLR = 1 / (1 / rawLR + labErr);
    const postOdds = priorOdds * effLR;
    const postProb = postOdds / (1 + postOdds);

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Log-Odds Cascade: Prior Odds + Log₁₀(Effective LR) = Posterior Odds (Lab Error Capped)");

    const bx = px + 36, bw = pw - 72, midY = py + ph * 0.45;
    // Scale from log10 = -5 to +5
    const mapX = (lg) => bx + clamp((lg + 5) / 10, 0, 1) * bw;

    roundRect(ctx, bx, midY - 12, bw, 24, 6, "rgba(255,255,255,0.06)", C.axis, 1.4);
    const xZero = mapX(0);
    ctx.strokeStyle = C.accent;
    ctx.beginPath(); ctx.moveTo(xZero, midY - 24); ctx.lineTo(xZero, midY + 24); ctx.stroke();
    label(ctx, "50% Guilt (LogOdds=0)", xZero, midY - 28, C.accent, "10px monospace", "center");

    const xPrior = mapX(logPrior);
    const xPost = mapX(Math.log10(Math.max(1e-5, postOdds)));

    ctx.fillStyle = C.primary;
    ctx.beginPath(); ctx.arc(xPrior, midY, 7, 0, Math.PI * 2); ctx.fill();
    label(ctx, `Prior 10^${logPrior.toFixed(1)}`, xPrior, midY + 28, C.primary, "bold 10px monospace", "center");

    arrow(ctx, xPrior, midY, xPost, midY, C.ok, 3, 8);
    ctx.fillStyle = C.ok;
    ctx.beginPath(); ctx.arc(xPost, midY, 8, 0, Math.PI * 2); ctx.fill();
    label(ctx, `Posterior P(G|E) = ${(postProb * 100).toFixed(1)}%`, xPost, midY - 18, C.ok, "bold 11px monospace", "center");

    // Prosecutor's Fallacy warning comparison
    const naiveProb = rawLR / (1 + rawLR);
    const by = py + ph - 52;
    roundRect(ctx, bx, by, bw, 36, 6, "rgba(255,107,107,0.14)", C.danger, 1.4);
    label(ctx, `Prosecutor's Fallacy Claim: ${(naiveProb * 100).toFixed(3)}%  vs  True Lab-Adjusted Posterior: ${(postProb * 100).toFixed(1)}%`, bx + bw / 2, by + 22, C.text, "bold 11px monospace", "center");

    return {
      "Prior Odds": `10^${logPrior.toFixed(2)}`,
      "Effective LR": `${effLR.toFixed(0)}:1`,
      "True P(Guilt | E)": `${(postProb * 100).toFixed(1)}%`,
      "Rule 403 Gate": labErr > 0.025 && logLR > 4 ? "Excluded (Misleading)" : "Admissible",
    };
  };

  // 25. jur_condorcet_supermajority — 12-Juror Ring + Condorcet Binomial Conviction Curve
  R.jur_condorcet_supermajority = function (ctx, W, H, st) {
    st.drawHUD("Condorcet Jury Theorem, Panel Size N & Unanimity Rule", st.spec.formula);
    const p = 0.52 + st.a * 0.42;
    const N = Math.round(6 + st.b * 6); // 6..12 jurors
    const quota = 0.5 + st.c * 0.5;    // 50%..100%

    const reqVotes = Math.ceil(N * quota);

    // Binomial tail sum
    const comb = (n, k) => {
      let r = 1;
      for (let i = 1; i <= k; i++) r = (r * (n - i + 1)) / i;
      return r;
    };
    let pConvictGuilty = 0, pConvictInnocent = 0;
    for (let k = reqVotes; k <= N; k++) {
      pConvictGuilty += comb(N, k) * Math.pow(p, k) * Math.pow(1 - p, N - k);
      pConvictInnocent += comb(N, k) * Math.pow(1 - p, k) * Math.pow(p, N - k);
    }

    const px = 18, py = 46, pw = W * 0.46, ph = H - 62;
    st.panel(px, py, pw, ph, `Jury Deliberation Box (${reqVotes}/${N} Votes Required)`);
    const cx = px + pw * 0.5, cy = py + ph * 0.55, r = Math.min(pw, ph) * 0.33;

    const expectedYes = Math.round(N * p);
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
      const jx = cx + Math.cos(ang) * r, jy = cy + Math.sin(ang) * r;
      const voteYes = i < expectedYes;
      ctx.fillStyle = voteYes ? C.ok : C.danger;
      ctx.beginPath(); ctx.arc(jx, jy, 12, 0, Math.PI * 2); ctx.fill();
      label(ctx, `J${i + 1}`, jx, jy + 4, C.bg, "bold 9px monospace", "center");
    }
    label(ctx, `${reqVotes}/${N} Quota`, cx, cy + 4, C.accent, "bold 12px monospace", "center");

    // Right panel: Binomial distribution bars
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Binomial Vote Distribution P(K = k) & Conviction Threshold");
    const ox = rx + 24, oy = py + ph - 28, gw = rw - 40, gh = ph - 62;

    for (let k = 0; k <= N; k++) {
      const prob = comb(N, k) * Math.pow(p, k) * Math.pow(1 - p, N - k);
      const bx = ox + (k / (N + 1)) * gw;
      const bh = clamp(prob * 2.6, 0.02, 1) * gh;
      const pass = k >= reqVotes;
      roundRect(ctx, bx, oy - bh, gw / (N + 2), bh, 3, pass ? C.ok : C.primary, null, 0);
      label(ctx, `${k}`, bx + gw / (2 * (N + 2)), oy + 13, C.muted, "9px monospace", "center");
    }

    return {
      "Juror Accuracy p": `${(p * 100).toFixed(1)}%`,
      "Quota Required": `${reqVotes} / ${N} votes`,
      "True Conviction": `${(pConvictGuilty * 100).toFixed(1)}%`,
      "False Conviction α": `${(pConvictInnocent * 100).toFixed(2)}%`,
    };
  };

  // 26. jur_shapley_shubik_bicameral — House + Senate Filibuster + Executive Veto + Shapley-Shubik power bars
  R.jur_shapley_shubik_bicameral = function (ctx, W, H, st) {
    st.drawHUD("Bicameral Veto Players & Shapley–Shubik Power Index", st.spec.formula);
    const cloture = Math.round(50 + st.a * 17); // 50..67 Senate votes
    const override = 0.6 + st.b * 0.15;
    const polar = st.c;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Constitutional Bill Pipeline & Shapley–Shubik Pivotal Power Share φ_i");

    // Compute approximate Shapley shares
    const senShare = 0.30 + (cloture - 50) * 0.008;
    const presShare = 0.18 + (override - 0.6) * 0.55;
    const houseShare = 1 - senShare - presShare;

    const boxes = [
      { name: "LOWER HOUSE", sub: "51% Simple Majority", sh: houseShare, x: 0.20, col: C.primary },
      { name: "UPPER SENATE", sub: `${cloture}/100 Cloture Pivot`, sh: senShare, x: 0.50, col: C.accent },
      { name: "EXECUTIVE VETO", sub: `${(override * 100).toFixed(0)}% Override Gate`, sh: presShare, x: 0.80, col: C.secondary },
    ];

    const cy = py + ph * 0.38;
    boxes.forEach((b, i) => {
      const cx = px + b.x * pw;
      roundRect(ctx, cx - 68, cy - 28, 136, 56, 8, "rgba(22,26,46,0.92)", b.col, 2.2);
      label(ctx, b.name, cx, cy - 6, b.col, "bold 11px monospace", "center");
      label(ctx, b.sub, cx, cy + 10, C.text, "9px monospace", "center");
      label(ctx, `φ = ${(b.sh * 100).toFixed(1)}%`, cx, cy + 23, C.ok, "bold 10px monospace", "center");
      if (i < 2) {
        arrow(ctx, cx + 70, cy, px + boxes[i + 1].x * pw - 70, cy, C.axis, 2, 7);
      }
    });

    // Core gridlock interval bar at bottom
    const gx = px + 48, gw = pw - 96, gy = py + ph * 0.78;
    const gridlockWidth = clamp(0.18 + polar * 0.55 + (cloture - 50) * 0.012, 0.15, 0.92);
    roundRect(ctx, gx, gy, gw, 20, 5, "rgba(255,255,255,0.06)", C.axis, 1);
    roundRect(ctx, gx + gw * (0.5 - gridlockWidth / 2), gy, gw * gridlockWidth, 20, 5, "rgba(255,107,107,0.32)", C.danger, 1.8);
    label(ctx, `Status Quo Gridlock Core Interval: ${(gridlockWidth * 100).toFixed(0)}% of Policy Space Unreachable`, gx + gw / 2, gy - 8, C.danger, "bold 10px monospace", "center");

    return {
      "House Power φ_H": `${(houseShare * 100).toFixed(1)}%`,
      "Senate Power φ_S": `${(senShare * 100).toFixed(1)}%`,
      "Executive Power φ_P": `${(presShare * 100).toFixed(1)}%`,
      "Gridlock Core Width": `${(gridlockWidth * 100).toFixed(0)}%`,
    };
  };

  // 27. jur_HAD_contract_breach — Efficient Breach & Expectation vs Reliance vs Hadley Cap
  R.jur_HAD_contract_breach = function (ctx, W, H, st) {
    st.drawHUD("Contract Remedies: Efficient Breach, Expectation & Hadley Cap", st.spec.formula);
    const Cperf = 30 + st.a * 130; // Promisor cost to perform
    const Vbase = 80 + st.b * 70;  // Buyer base valuation
    const relR = st.c * 35;        // Buyer reliance investment

    const priceP = 65;
    const Vtot = Vbase + relR * 1.4;
    const Dexp = Vtot - priceP;
    const Drel = relR;
    const Dhadley = Vbase - priceP; // foreseeable cap excludes uncommunicated special reliance
    const effBreach = Cperf > Vtot;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Contract Performance Cost C vs Buyer Value V(r) & Remedy Comparison ($k)");

    const items = [
      { name: "Performance Cost C", val: Cperf, col: effBreach ? C.danger : C.primary },
      { name: "Buyer Valuation V(r)", val: Vtot, col: C.ok },
      { name: "Expectation D_exp", val: Dexp, col: C.accent },
      { name: "Hadley Cap D_had", val: Dhadley, col: C.purple },
      { name: "Reliance D_rel", val: Drel, col: C.cyan },
    ];

    const ox = px + 44, oy = py + ph - 36, gw = pw - 88, gh = ph - 78;
    const colW = gw / items.length;
    items.forEach((it, i) => {
      const cx = ox + i * colW + colW * 0.5;
      const bh = clamp(it.val / 190, 0.04, 0.95) * gh;
      roundRect(ctx, cx - 26, oy - bh, 52, bh, 5, "rgba(255,255,255,0.08)", it.col, 2);
      roundRect(ctx, cx - 26, oy - bh, 52, bh, 5, it.col + "44", null, 0);
      label(ctx, `$${it.val.toFixed(0)}k`, cx, oy - bh - 6, it.col, "bold 11px monospace", "center");
      label(ctx, it.name, cx, oy + 16, C.text, "10px monospace", "center");
    });

    label(ctx, effBreach ? "EFFICIENT BREACH REGIME (C > V): Promisor Pays Expectation Damages & Saves Social Surplus!" : "EFFICIENT PERFORMANCE REGIME (C ≤ V): Seller Performs Contract", px + pw / 2, py + 38, effBreach ? C.accent : C.ok, "bold 11px monospace", "center");

    return {
      "Promisor Cost C": `$${Cperf.toFixed(0)}k`,
      "Buyer Value V(r)": `$${Vtot.toFixed(0)}k`,
      "Expectation D_exp": `$${Dexp.toFixed(0)}k`,
      "Efficiency Decision": effBreach ? "Breach + Pay D_exp" : "Perform Contract",
    };
  };

  // 28. jur_becker_crime_deterrence — Iso-deterrence curve p × f & Hyperbolic discounting
  R.jur_becker_crime_deterrence = function (ctx, W, H, st) {
    st.drawHUD("Becker Economic Model of Crime: Certainty p vs Severity f", st.spec.formula);
    const p = 0.05 + st.a * 0.85;
    const f = 1 + st.b * 19; // years sentence
    const beta = 0.25 + st.c * 0.75; // hyperbolic discounting of future years

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Deterrence Contour Plane: Detection Certainty (p) vs Sanction Severity (f)");
    const ox = px + 46, oy = py + ph - 30, gw = pw - 86, gh = ph - 66;

    // Draw Iso-Expected-Punishment Hyperbola p * f^beta = const
    ctx.save();
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    for (let i = 1; i <= 70; i++) {
      const pv = (i / 70);
      const fv = Math.pow(2.2 / Math.max(0.08, pv), 1 / Math.max(0.35, beta));
      const sx = ox + pv * gw, sy = oy - clamp(fv / 20, 0, 0.96) * gh;
      if (i === 1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, "Iso-Deterrence Boundary (EU_crime = U_honest)", ox + 110, py + 44, C.accent, "bold 10px monospace");

    // Current (p, f) policy marker
    const curX = ox + p * gw, curY = oy - (f / 20) * gh;
    const perceivedCost = p * Math.pow(f, beta);
    const deterred = perceivedCost >= 2.2;

    ctx.fillStyle = deterred ? C.ok : C.danger;
    ctx.beginPath(); ctx.arc(curX, curY, 7.5, 0, Math.PI * 2); ctx.fill();
    label(ctx, `Policy (p=${(p * 100).toFixed(0)}%, f=${f.toFixed(1)}yr)`, curX + 10, curY - 6, deterred ? C.ok : C.danger, "bold 11px monospace");
    label(ctx, deterred ? "OFFENDER DETERRED" : "UNDETERRED (Certainty Too Low)", curX + 10, curY + 10, C.text, "10px monospace");
    ctx.restore();

    label(ctx, "Detection Probability p →", ox + gw - 140, oy + 18, C.muted, "10px monospace");

    return {
      "Detection Prob p": `${(p * 100).toFixed(1)}%`,
      "Sentence Severity f": `${f.toFixed(1)} yrs`,
      "Discounted Threat": perceivedCost.toFixed(2),
      "Deterrence State": deterred ? "Deterred (EU < 0)" : "Crime Committed",
    };
  };

  // 29. jur_settlement_priest_klein — Plaintiff Minimum Demand vs Defendant Maximum Offer & 50% Trial Limit
  R.jur_settlement_priest_klein = function (ctx, W, H, st) {
    st.drawHUD("Priest–Klein Litigation Selection & Settlement Window", st.spec.formula);
    const optGap = -0.25 + st.a * 0.65; // P_p - P_d
    const cRatio = 0.05 + st.b * 0.45;  // (C_p + C_d)/J
    const engRule = st.c;               // Loser pays fee shifting

    const J = 100;
    const Pp = clamp(0.55 + optGap * 0.5, 0.05, 0.98);
    const Pd = clamp(0.55 - optGap * 0.5, 0.05, 0.98);
    const Cp = (cRatio * J) * 0.5, Cd = (cRatio * J) * 0.5;

    // Under English rule, optimism gap is amplified by (J + Cp + Cd)
    const effGap = optGap * J * (1 + engRule * cRatio);
    const settleZone = (Cp + Cd) - effGap;

    const pAsk = Pp * J - Cp + engRule * (1 - Pp) * (-Cd);
    const dOffer = Pd * J + Cd + engRule * Pd * Cp;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Settlement Bargaining Line ($0 .. $100k Judgment) & Priest–Klein Trial Selection");

    const bx = px + 48, bw = pw - 96, by = py + ph * 0.48;
    roundRect(ctx, bx, by, bw, 16, 6, "rgba(255,255,255,0.08)", C.axis, 1.2);

    const xAsk = bx + clamp(pAsk / 120, 0.04, 0.96) * bw;
    const xOffer = bx + clamp(dOffer / 120, 0.04, 0.96) * bw;
    const settles = dOffer >= pAsk;

    if (settles) {
      roundRect(ctx, xAsk, by - 22, Math.max(6, xOffer - xAsk), 60, 6, "rgba(110,231,183,0.25)", C.ok, 2);
      label(ctx, `SETTLEMENT ZONE [$${pAsk.toFixed(0)}k, $${dOffer.toFixed(0)}k]`, (xAsk + xOffer) / 2, by - 28, C.ok, "bold 11px monospace", "center");
    } else {
      roundRect(ctx, xOffer, by - 22, Math.max(6, xAsk - xOffer), 60, 6, "rgba(255,107,107,0.25)", C.danger, 2);
      label(ctx, `IMPASSE → GOES TO TRIAL (Gap $${(pAsk - dOffer).toFixed(0)}k)`, (xAsk + xOffer) / 2, by - 28, C.danger, "bold 11px monospace", "center");
    }

    label(ctx, `Plaintiff Min Ask: $${pAsk.toFixed(0)}k`, xAsk, by + 54, C.primary, "bold 10px monospace", "center");
    label(ctx, `Defendant Max Offer: $${dOffer.toFixed(0)}k`, xOffer, by + 70, C.secondary, "bold 10px monospace", "center");
    label(ctx, "Priest–Klein Theorem: Litigated Trials Cluster Near Boundary → ~50% Plaintiff Win Rate", px + pw / 2, py + ph - 16, C.accent, "10px monospace", "center");

    return {
      "Plaintiff Min Ask": `$${pAsk.toFixed(1)}k`,
      "Defendant Max Offer": `$${dOffer.toFixed(1)}k`,
      "Bargaining Surplus": `$${settleZone.toFixed(1)}k`,
      "Case Disposition": settles ? "Out-of-Court Settlement" : "Full Jury Trial",
    };
  };

  // 30. jur_toulmin_wigmore_chart — Toulmin Data -> Warrant/Backing -> Qualifier -> Claim <- Rebuttal
  R.jur_toulmin_wigmore_chart = function (ctx, W, H, st) {
    st.drawHUD("Wigmore Evidentiary Chart & Toulmin Argumentation Layout", st.spec.formula);
    const warrant = 0.25 + st.a * 0.72;
    const corrob = Math.round(1 + st.b * 4);
    const rebut = st.c * 0.85;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Toulmin–Wigmore Structural Inference Graph: Data → [Warrant/Backing] → Qualifier → Claim");

    const dx = px + pw * 0.16, dy = py + ph * 0.36;
    const wx = px + pw * 0.44, wy = py + ph * 0.72;
    const qx = px + pw * 0.56, qy = py + ph * 0.36;
    const cx = px + pw * 0.84, cy = py + ph * 0.36;
    const rx = px + pw * 0.80, ry = py + ph * 0.76;

    const corrobBoost = 1 - Math.pow(1 - 0.65, corrob);
    const netProb = clamp(warrant * corrobBoost * (1 - 0.7 * rebut), 0.04, 0.98);

    // Main Data -> Qualifier -> Claim arrows
    arrow(ctx, dx + 56, dy, qx - 42, qy, C.primary, 3, 8);
    arrow(ctx, qx + 42, qy, cx - 56, cy, C.ok, 3, 8);
    // Warrant upward support arrow
    arrow(ctx, wx, wy - 22, (dx + qx) / 2, dy + 6, C.accent, 2.2, 7);
    // Rebuttal upward attack arrow
    arrow(ctx, rx, ry - 22, cx, cy + 24, C.danger, 2.2, 7);

    roundRect(ctx, dx - 54, dy - 24, 108, 48, 8, "rgba(124,156,255,0.2)", C.primary, 2);
    label(ctx, "DATA (Grounds)", dx, dy - 4, C.primary, "bold 10px monospace", "center");
    label(ctx, `${corrob} Witnesses`, dx, dy + 12, C.text, "10px monospace", "center");

    roundRect(ctx, wx - 64, wy - 22, 128, 44, 8, "rgba(255,209,102,0.18)", C.accent, 1.8);
    label(ctx, "WARRANT + BACKING", wx, wy - 4, C.accent, "bold 10px monospace", "center");
    label(ctx, `Strength ${(warrant * 100).toFixed(0)}%`, wx, wy + 12, C.text, "10px monospace", "center");

    roundRect(ctx, qx - 40, qy - 20, 80, 40, 6, "rgba(192,132,252,0.2)", C.purple, 1.8);
    label(ctx, "QUALIFIER", qx, qy - 3, C.purple, "bold 9px monospace", "center");
    label(ctx, `P=${(netProb * 100).toFixed(0)}%`, qx, qy + 11, C.text, "10px monospace", "center");

    roundRect(ctx, cx - 54, cy - 24, 108, 48, 8, "rgba(110,231,183,0.22)", C.ok, 2.2);
    label(ctx, "LEGAL CLAIM", cx, cy - 4, C.ok, "bold 10px monospace", "center");
    label(ctx, netProb > 0.75 ? "Beyond Doubt" : (netProb > 0.5 ? "Preponderance" : "Insufficient"), cx, cy + 12, C.text, "9px monospace", "center");

    roundRect(ctx, rx - 58, ry - 20, 116, 40, 8, "rgba(255,107,107,0.2)", C.danger, 1.8);
    label(ctx, "UNLESS REBUTTAL", rx, ry - 3, C.danger, "bold 9px monospace", "center");
    label(ctx, `Attack -${(rebut * 100).toFixed(0)}%`, rx, ry + 11, C.text, "9px monospace", "center");

    return {
      "Warrant Strength": `${(warrant * 100).toFixed(0)}%`,
      "Corroboration": `${corrob} Independent`,
      "Rebuttal Defeat": `-${(rebut * 100).toFixed(0)}%`,
      "Claim Credence": `${(netProb * 100).toFixed(1)}%`,
    };
  };

  // 31. jur_stare_decisis_precedent — 2D Fact-Pattern Space + Precedent Decision Boundary & Distinguish/Overrule
  R.jur_stare_decisis_precedent = function (ctx, W, H, st) {
    st.drawHUD("Common Law Stare Decisis Precedent Lattice & Distinguishing", st.spec.formula);
    const stareW = 0.2 + st.a * 0.75;
    const drift = st.b * 0.6;
    const panelShift = -0.35 + st.c * 0.7;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "2D Fact-Pattern Space (x₁, x₂): Precedent Holdings (+ Liable / - Exempt) & Appellate Boundary");

    const ox = px + 36, oy = py + ph - 26, gw = pw - 72, gh = ph - 58;

    // Decision boundary line w^T x = tau
    const slope = 0.65 + panelShift * 0.6 * (1 - stareW * 0.6);
    ctx.save();
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(ox, oy - gh * clamp(0.2 + panelShift * 0.3, 0.05, 0.9));
    ctx.lineTo(ox + gw, oy - gh * clamp(0.2 + slope, 0.05, 0.95));
    ctx.stroke();
    label(ctx, "Current Ratio Decidendi Boundary", ox + 14, py + 40, C.accent, "bold 10px monospace");

    // Landmark precedent nodes & citation edges
    const cases = [
      { name: "MacPherson (1916)", x: 0.22, y: 0.72, hold: true },
      { name: "Palsgraf (1928)", x: 0.38, y: 0.28, hold: false },
      { name: "Escola (1944)", x: 0.52, y: 0.76, hold: true },
      { name: "Instant Digital Case", x: clamp(0.65 + drift * 0.25, 0.2, 0.9), y: clamp(0.52 - panelShift * 0.25, 0.2, 0.85), hold: true },
    ];

    arrow(ctx, ox + cases[0].x * gw, oy - cases[0].y * gh, ox + cases[2].x * gw, oy - cases[2].y * gh, C.primary, 1.6, 6);
    arrow(ctx, ox + cases[2].x * gw, oy - cases[2].y * gh, ox + cases[3].x * gw, oy - cases[3].y * gh, C.ok, 1.8, 6);

    cases.forEach((c, i) => {
      const cx = ox + c.x * gw, cy = oy - c.y * gh;
      roundRect(ctx, cx - 52, cy - 15, 104, 30, 6, c.hold ? "rgba(110,231,183,0.22)" : "rgba(255,107,107,0.22)", i === 3 ? C.accent : (c.hold ? C.ok : C.danger), i === 3 ? 2.4 : 1.5);
      label(ctx, c.name, cx, cy + 4, C.text, "bold 9px monospace", "center");
    });
    ctx.restore();

    const action = Math.abs(panelShift) > stareW ? "OVERRULED" : (drift > 0.35 ? "DISTINGUISHED ON FACTS" : "FOLLOWED (Stare Decisis)");

    return {
      "Reliance Weight": `${(stareW * 100).toFixed(0)}%`,
      "Fact-Pattern Drift": `${(drift * 100).toFixed(0)}%`,
      "Doctrinal Action": action,
      "Holding Stability": stareW > 0.6 ? "Entrenched Super-Precedent" : "Fluid Evolution",
    };
  };

  // 32. jur_proportionality_alexy — Alexy Weight Formula Balance Beam + 3-Prong Proportionality Gate
  R.jur_proportionality_alexy = function (ctx, W, H, st) {
    st.drawHUD("Alexy Constitutional Proportionality & Weight Formula Balance", st.spec.formula);
    const Ii = 1 + Math.round(st.a * 3); // 1, 2, 4 geometric scale
    const Wj = 1 + Math.round(st.b * 3);
    const lrmAvail = st.c > 0.55;        // Less-restrictive alternative exists

    const powI = Math.pow(2, Ii - 1); // 1, 2, 4, 8
    const powJ = Math.pow(2, Wj - 1);
    const quotient = powI / powJ;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "3-Prong Proportionality (Suitability → Necessity/LRM → Alexy Balancing W_{i,j})");

    // Balance scale fulcrum in center
    const cx = px + pw * 0.5, cy = py + ph * 0.58;
    const tilt = clamp((powI - powJ) * 0.06, -0.32, 0.32);

    ctx.save();
    ctx.translate(cx, cy);
    // Fulcrum triangle
    ctx.fillStyle = C.muted;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-22, 38); ctx.lineTo(22, 38); ctx.closePath(); ctx.fill();

    ctx.rotate(-tilt);
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-165, 0); ctx.lineTo(165, 0); ctx.stroke();

    // Left Pan: Fundamental Right Intrusion I_i
    roundRect(ctx, -210, -48, 110, 42, 6, "rgba(255,107,107,0.25)", C.danger, 2);
    label(ctx, `Right Intrusion I_i=${powI}`, -155, -24, C.danger, "bold 10px monospace", "center");

    // Right Pan: Compelling State Interest W_j
    roundRect(ctx, 100, -48, 110, 42, 6, "rgba(124,156,255,0.25)", C.primary, 2);
    label(ctx, `State Urgency W_j=${powJ}`, 155, -24, C.primary, "bold 10px monospace", "center");
    ctx.restore();

    const unconst = lrmAvail || quotient > 1.0;
    const reason = lrmAvail ? "FAILS PRONG 2 (NECESSITY: Less-Restrictive Means Available)" : (quotient > 1 ? "FAILS PRONG 3 (Disproportionate Intrusion W_{i,j} > 1)" : "CONSTITUTIONALLY PROPORTIONATE (W_{i,j} ≤ 1)");
    label(ctx, reason, cx, py + 40, unconst ? C.danger : C.ok, "bold 11px monospace", "center");

    return {
      "Intrusion Weight I_i": `${powI} (Geometric)`,
      "State Interest W_j": `${powJ} (Geometric)`,
      "Alexy Quotient W_ij": quotient.toFixed(2),
      "Strict Scrutiny": unconst ? "Struck Down" : "Upheld Valid",
    };
  };

  // 33. jur_statutory_canons — Textualism vs Purposivism Spectrum + Loper Bright / Major Questions Gate
  R.jur_statutory_canons = function (ctx, W, H, st) {
    st.drawHUD("Statutory Interpretation Canons & Loper Bright / Major Questions", st.spec.formula);
    const clarity = 0.1 + st.a * 0.85;
    const mqd = st.b;
    const lenity = st.c;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Interpretive Funnel: Statutory Text → Linguistic Canons → Substantive Canons (MQD / Lenity)");

    const tiers = [
      { name: "1. Ordinary Public Meaning & Grammar (Noscitur / Ejusdem Generis)", w: clarity, col: C.primary },
      { name: "2. Whole-Act Structural Context & Legislative Purpose", w: 1 - clarity * 0.5, col: C.accent },
      { name: "3. Major Questions Doctrine Clear-Statement Gate", w: mqd, col: C.danger },
      { name: "4. Penal Rule of Lenity (Resolve Ambiguity for Defendant)", w: lenity, col: C.ok },
    ];

    tiers.forEach((t, i) => {
      const y = py + 34 + i * 38;
      const bw = (pw - 64) * clamp(0.25 + t.w * 0.75, 0.2, 1);
      const bx = px + (pw - bw) / 2;
      roundRect(ctx, bx, y, bw, 30, 6, "rgba(255,255,255,0.05)", t.col, 1.8);
      label(ctx, `${t.name} [${(t.w * 100).toFixed(0)}%]`, px + pw / 2, y + 19, t.col, "bold 10px monospace", "center");
    });

    const mqdTriggered = mqd > 0.65 && clarity < 0.7;
    const ruling = mqdTriggered ? "Agency Rule Vacated (Major Questions Doctrine)" : (clarity > 0.6 ? "Plain Text Governs (Bostock / Loper Bright)" : "Purposive / Skidmore Construction");

    return {
      "Textual Clarity": `${(clarity * 100).toFixed(0)}%`,
      "Major Questions": mqdTriggered ? "Triggered (No Clear Auth)" : "Standard Delegation",
      "Rule of Lenity": lenity > 0.5 && clarity < 0.5 ? "Applied (Narrow)" : "Inactive",
      "Judicial Holding": ruling,
    };
  };

  // 34. jur_antitrust_hhi_uppi — Pre/Post-Merger HHI Bars & 1,800 / +100 ΔHHI Red Zone + UPP
  R.jur_antitrust_hhi_uppi = function (ctx, W, H, st) {
    st.drawHUD("Antitrust Merger Review: HHI Concentration & Upward Pricing Pressure", st.spec.formula);
    const s1 = 8 + st.a * 28; // %
    const s2 = 5 + st.b * 25; // %
    const divD = 0.1 + st.c * 0.65;

    const fringeHHI = 1100;
    const preHHI = Math.round(fringeHHI + s1 * s1 + s2 * s2);
    const deltaHHI = Math.round(2 * s1 * s2);
    const postHHI = preHHI + deltaHHI;
    const margin = 0.35, effCredit = 0.08;
    const upp = (divD * margin - effCredit) * 100;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "2023 DOJ/FTC Merger Guidelines: HHI > 1,800 & ΔHHI > 100 Structural Presumption");

    const ox = px + 48, oy = py + ph - 34, gw = pw - 96, gh = ph - 74;
    // 1800 HHI redline
    const y1800 = oy - (1800 / 4500) * gh;
    ctx.save();
    ctx.strokeStyle = C.danger;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(ox, y1800); ctx.lineTo(ox + gw, y1800); ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, "DOJ/FTC 1,800 HHI Presumption Threshold", ox + 12, y1800 - 6, C.danger, "bold 10px monospace");
    ctx.restore();

    const bars = [
      { name: "Pre-Merger HHI", val: preHHI, max: 4500, col: C.primary },
      { name: `Post-Merger HHI (+${deltaHHI})`, val: postHHI, max: 4500, col: postHHI > 1800 && deltaHHI > 100 ? C.danger : C.ok },
      { name: `Net UPP (${upp.toFixed(1)}%)`, val: Math.max(100, (upp + 5) * 140), max: 4500, col: upp > 5 ? C.secondary : C.accent },
    ];

    const colW = gw / 3;
    bars.forEach((b, i) => {
      const cx = ox + i * colW + colW * 0.5;
      const bh = clamp(b.val / b.max, 0.05, 0.96) * gh;
      roundRect(ctx, cx - 38, oy - bh, 76, bh, 6, b.col + "38", b.col, 2);
      label(ctx, i < 2 ? `${b.val}` : `${upp.toFixed(1)}%`, cx, oy - bh - 7, b.col, "bold 11px monospace", "center");
      label(ctx, b.name, cx, oy + 16, C.text, "10px monospace", "center");
    });

    const blocked = (postHHI > 1800 && deltaHHI > 100) || upp > 8;
    return {
      "Post-Merger HHI": `${postHHI}`,
      "Change ΔHHI": `+${deltaHHI}`,
      "Upward Price UPP": `${upp >= 0 ? "+" : ""}${upp.toFixed(1)}%`,
      "Merger Ruling": blocked ? "Challenged / Enjoined" : "Cleared (Safe Harbor)",
    };
  };

  // 35. jur_patent_breadth_nordhaus — Monopoly Deadweight Loss Triangle vs Dynamic R&D Incentive
  R.jur_patent_breadth_nordhaus = function (ctx, W, H, st) {
    st.drawHUD("Nordhaus Optimal Patent Term T* × Claim Breadth w* & Deadweight Loss", st.spec.formula);
    const termT = Math.round(5 + st.a * 25); // 5..30 yrs
    const breadth = 0.2 + st.b * 0.75;
    const followOn = st.c;

    const px = 18, py = 46, pw = W * 0.52, ph = H - 62;
    st.panel(px, py, pw, ph, "Static Monopoly Deadweight Loss (DWL Triangle) During Patent Term T");
    const ox = px + 38, oy = py + ph - 28, gw = pw - 58, gh = ph - 62;

    // Demand curve P(Q) = 1 - Q
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(ox, oy - gh * 0.9); ctx.lineTo(ox + gw * 0.9, oy); ctx.stroke();

    // Marginal Cost MC line at bottom
    const mcY = oy - gh * 0.18;
    ctx.strokeStyle = C.ok;
    ctx.beginPath(); ctx.moveTo(ox, mcY); ctx.lineTo(ox + gw * 0.9, mcY); ctx.stroke();
    label(ctx, "Competitive Price P_c = MC", ox + gw * 0.48, mcY + 14, C.ok, "10px monospace");

    // Monopoly price P_m rises with patent breadth
    const mFrac = 0.35 + breadth * 0.45;
    const pmY = oy - gh * (0.18 + mFrac * 0.52);
    const qmX = ox + gw * 0.9 * (1 - (0.18 + mFrac * 0.52) / 0.9);
    const qcX = ox + gw * 0.9 * (1 - 0.18 / 0.9);

    // Monopoly Profit Rectangle
    roundRect(ctx, ox, pmY, qmX - ox, mcY - pmY, 2, "rgba(124,156,255,0.25)", C.primary, 1.5);
    label(ctx, "Monopoly R&D Rent π", (ox + qmX) / 2, (pmY + mcY) / 2 + 4, C.primary, "bold 10px monospace", "center");

    // Deadweight Loss Triangle
    ctx.fillStyle = "rgba(255,107,107,0.38)";
    ctx.beginPath();
    ctx.moveTo(qmX, pmY); ctx.lineTo(qcX, mcY); ctx.lineTo(qmX, mcY); ctx.closePath();
    ctx.fill();
    label(ctx, "DWL", qmX + 18, mcY - 10, C.danger, "bold 10px monospace");

    // Right panel: Net Dynamic Social Welfare W(T)
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Dynamic Welfare W(T) vs Follow-On Holdup");
    const rox = rx + 24, roy = py + ph - 28, rgw = rw - 40, rgh = ph - 62;

    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let t = 1; t <= 30; t++) {
      const rndGain = 85 * (1 - Math.exp(-0.14 * t * breadth));
      const dwlCost = t * (1.4 * breadth * breadth + 1.2 * followOn * breadth);
      const wNet = rndGain - dwlCost;
      const sx = rox + ((t - 1) / 29) * rgw, sy = roy - clamp((wNet + 10) / 80, 0.05, 0.95) * rgh;
      if (t === 1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    const curMarkerX = rox + ((termT - 1) / 29) * rgw;
    ctx.strokeStyle = C.ok;
    ctx.beginPath(); ctx.moveTo(curMarkerX, py + 32); ctx.lineTo(curMarkerX, roy); ctx.stroke();
    label(ctx, `T = ${termT} yrs`, curMarkerX, py + 44, C.ok, "bold 10px monospace", "center");

    const optT = Math.round(20 - 6 * followOn - 4 * (breadth - 0.5));
    return {
      "Statutory Term T": `${termT} years`,
      "Nordhaus Optimal T*": `${optT} years`,
      "DWL Ratio": `${(breadth * breadth * 42).toFixed(1)}%`,
      "Follow-On Holdup": followOn > 0.6 && breadth > 0.6 ? "Severe Blocking" : "Manageable",
    };
  };

  // 36. jur_corporate_fiduciary_bjr — Standard of Review Ladder (BJR -> Unocal/Revlon -> Entire Fairness)
  R.jur_corporate_fiduciary_bjr = function (ctx, W, H, st) {
    st.drawHUD("Delaware Corporate Fiduciary Standards: BJR, Unocal/Revlon & Entire Fairness", st.spec.formula);
    const align = st.a;
    const indep = st.b;
    const prem = 10 + st.c * 60;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Delaware Chancery Standard of Review Spectrum & MFW Cleansing Dual Gate");

    const hasConflict = align < 0.35 && indep < 0.5;
    const revlonMode = prem > 42 && !hasConflict;
    const activeTier = hasConflict ? 2 : (revlonMode ? 1 : 0);

    const tiers = [
      {
        title: "1. BUSINESS JUDGMENT RULE (Aronson / Corwin / MFW Cleansed)",
        desc: "Gross Negligence / Waste Standard — Court Defers to Informed Independent Board",
        col: C.ok,
      },
      {
        title: "2. ENHANCED SCRUTINY (Unocal Poison Pill / Revlon Sale Auction)",
        desc: "Board Must Prove Reasonable Threat Perception & Proportionate Defensive Response",
        col: C.accent,
      },
      {
        title: "3. ENTIRE FAIRNESS REVIEW (Weinberger / Conflicted Controller)",
        desc: "Strictest Scrutiny: Defendant Bears Burden of Proving Fair Dealing + Fair Price",
        col: C.danger,
      },
    ];

    tiers.forEach((t, i) => {
      const y = py + 34 + i * 54;
      const isAct = i === activeTier;
      roundRect(ctx, px + 24, y, pw - 48, 46, 8, isAct ? t.col + "28" : "rgba(255,255,255,0.03)", isAct ? t.col : C.axis, isAct ? 2.4 : 1);
      label(ctx, t.title, px + 38, y + 18, isAct ? t.col : C.text, "bold 11px monospace");
      label(ctx, t.desc, px + 38, y + 35, C.muted, "10px monospace");
    });

    return {
      "Standard of Review": activeTier === 0 ? "Business Judgment (BJR)" : (activeTier === 1 ? "Revlon / Unocal" : "Entire Fairness"),
      "Board Independence": `${(indep * 100).toFixed(0)}%`,
      "Takeover Premium": `+${prem.toFixed(0)}%`,
      "Liability Exposure": activeTier === 2 ? "High (Fair Price Audit)" : "Exculpated (§102(b)(7))",
    };
  };

  // 37. jur_bankruptcy_absolute_priority — Chapter 11 Cram-Down Waterfall Vessels
  R.jur_bankruptcy_absolute_priority = function (ctx, W, H, st) {
    st.drawHUD("Chapter 11 Absolute Priority Waterfall (11 U.S.C. § 1129(b))", st.spec.formula);
    const ev = 40 + st.a * 260;      // Enterprise value $40M..$300M
    const sen = 50 + st.b * 110;     // Senior secured claim
    const jun = 40 + st.c * 100;     // Unsecured mezzanine claim
    const admin = 20;                // Priority admin claims

    const paySen = Math.min(ev, sen);
    const rem1 = Math.max(0, ev - sen);
    const payAdmin = Math.min(rem1, admin);
    const rem2 = Math.max(0, rem1 - admin);
    const payJun = Math.min(rem2, jun);
    const payEq = Math.max(0, rem2 - jun);

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, `Cascading Absolute Priority Tranches — Total Enterprise Value EV = $${ev.toFixed(0)}M`);

    const tranches = [
      { name: "1. Senior Secured", claim: sen, paid: paySen, col: C.ok },
      { name: "2. Priority Admin", claim: admin, paid: payAdmin, col: C.primary },
      { name: "3. General Unsecured", claim: jun, paid: payJun, col: C.accent },
      { name: "4. Old Equity", claim: 60, paid: payEq, col: C.purple },
    ];

    const ox = px + 44, oy = py + ph - 34, gw = pw - 88, gh = ph - 72;
    const colW = gw / 4;

    tranches.forEach((tr, i) => {
      const cx = ox + i * colW + colW * 0.5;
      const maxH = clamp(tr.claim / 160, 0.18, 0.92) * gh;
      const fillRatio = tr.claim > 0 ? clamp(tr.paid / tr.claim, 0, 1) : 0;
      const fillH = maxH * fillRatio;

      // Vessel outline
      roundRect(ctx, cx - 34, oy - maxH, 68, maxH, 6, "rgba(255,255,255,0.04)", C.axis, 1.5);
      // Liquid recovery fill
      if (fillH > 1) {
        roundRect(ctx, cx - 33, oy - fillH, 66, fillH, 5, tr.col + "66", tr.col, 1.8);
      }
      label(ctx, `${(fillRatio * 100).toFixed(0)}% ($${tr.paid.toFixed(0)}M)`, cx, oy - maxH - 8, tr.col, "bold 10px monospace", "center");
      label(ctx, tr.name, cx, oy + 16, C.text, "10px monospace", "center");

      if (i < 3 && fillRatio >= 0.999) {
        arrow(ctx, cx + 36, oy - maxH + 10, cx + colW - 36, oy - maxH + 24, C.cyan, 2, 6);
      }
    });

    const fulcrum = paySen < sen ? "Senior Debt" : (payJun < jun ? "Unsecured Notes" : "Equity In-The-Money");
    return {
      "Enterprise Value": `$${ev.toFixed(0)}M`,
      "Senior Recovery": `${((paySen / sen) * 100).toFixed(0)}¢ / $1`,
      "Unsecured Recovery": `${((payJun / jun) * 100).toFixed(0)}¢ / $1`,
      "Fulcrum Security": fulcrum,
    };
  };

  // 38. jur_aristotle_stasis_rhetoric — Stasis Sequential Gates (An Sit -> Quid Sit -> Quale Sit) + Ethos/Pathos/Logos
  R.jur_aristotle_stasis_rhetoric = function (ctx, W, H, st) {
    st.drawHUD("Classical Forensic Stasis Gates & Aristotelian Rhetorical Triangle", st.spec.formula);
    const factAn = 0.15 + st.a * 0.82;
    const defQuid = 0.15 + st.b * 0.82;
    const qualSit = st.c * 0.85;

    const px = 18, py = 46, pw = W * 0.56, ph = H - 62;
    st.panel(px, py, pw, ph, "Sequential Stasis Filter: Where Does the Forensic Clash Arrest?");

    const gates = [
      { name: "1. Stasis Conjecturalis (An Sit — Did the Act Occur?)", pass: factAn, col: C.primary },
      { name: "2. Stasis Finitionis (Quid Sit — Does Act Fit Statutory Element?)", pass: factAn * defQuid, col: C.accent },
      { name: "3. Stasis Qualitatis (Quale Sit — Unjustified / No Excuse?)", pass: factAn * defQuid * (1 - qualSit), col: C.ok },
    ];

    gates.forEach((g, i) => {
      const y = py + 38 + i * 52;
      const bw = pw - 44;
      roundRect(ctx, px + 22, y, bw, 38, 6, "rgba(255,255,255,0.05)", C.axis, 1);
      roundRect(ctx, px + 22, y, bw * g.pass, 38, 6, g.col + "44", g.col, 1.8);
      label(ctx, `${g.name}: ${(g.pass * 100).toFixed(0)}%`, px + 32, y + 23, C.text, "bold 10px monospace");
    });

    // Right panel: Rhetorical Triangle (Logos, Ethos, Pathos)
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Aristotelian Triangle");
    const cx = rx + rw * 0.5, cy = py + ph * 0.56, r = Math.min(rw, ph) * 0.34;
    const vPts = [
      { l: "LOGOS (Syllogism)", a: -Math.PI / 2, w: factAn, col: C.primary },
      { l: "ETHOS (Credibility)", a: Math.PI / 6, w: defQuid, col: C.ok },
      { l: "PATHOS (Equity)", a: (5 * Math.PI) / 6, w: qualSit, col: C.secondary },
    ];

    ctx.strokeStyle = C.axis;
    ctx.beginPath();
    vPts.forEach((v, i) => {
      const vx = cx + Math.cos(v.a) * r, vy = cy + Math.sin(v.a) * r;
      if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
    });
    ctx.closePath(); ctx.stroke();

    // Centroid persuasion point
    const bx = cx + (Math.cos(vPts[0].a) * factAn + Math.cos(vPts[1].a) * defQuid + Math.cos(vPts[2].a) * qualSit) * r * 0.35;
    const by = cy + (Math.sin(vPts[0].a) * factAn + Math.sin(vPts[1].a) * defQuid + Math.sin(vPts[2].a) * qualSit) * r * 0.35;
    ctx.fillStyle = C.accent;
    ctx.beginPath(); ctx.arc(bx, by, 6.5, 0, Math.PI * 2); ctx.fill();

    vPts.forEach((v) => {
      const vx = cx + Math.cos(v.a) * (r + 14), vy = cy + Math.sin(v.a) * (r + 14);
      label(ctx, v.l, vx, vy, v.col, "bold 9px monospace", "center");
    });

    const clashPoint = factAn < 0.5 ? "An Sit (Factual Dispute)" : (defQuid < 0.5 ? "Quid Sit (Definitional)" : "Quale Sit (Affirmative Justification)");
    return {
      "Point of Stasis": clashPoint,
      "Factual Proof": `${(factAn * 100).toFixed(0)}%`,
      "Definitional Fit": `${(defQuid * 100).toFixed(0)}%`,
      "Net Liability": `${(gates[2].pass * 100).toFixed(1)}%`,
    };
  };

  // 39. jur_hart_fuller_deontic — Deontic Square of Opposition (O, F, P, ¬O) & Lex Specialis Conflict Resolver
  R.jur_hart_fuller_deontic = function (ctx, W, H, st) {
    st.drawHUD("Deontic Modal Logic Square (O, F, P, ¬O) & Normative Conflict", st.spec.formula);
    const density = st.a;
    const lexSpec = st.b;
    const penumbra = st.c;

    const px = 18, py = 46, pw = W * 0.52, ph = H - 62;
    st.panel(px, py, pw, ph, "Deontic Square of Opposition: O(p) ≡ ¬P(¬p), F(p) ≡ O(¬p)");

    const cx = px + pw * 0.5, cy = py + ph * 0.54, hw = 95, hh = 56;
    const corners = [
      { name: "O(p) Obligatory", x: cx - hw, y: cy - hh, col: C.primary },
      { name: "F(p) Forbidden", x: cx + hw, y: cy - hh, col: C.danger },
      { name: "P(p) Permitted", x: cx - hw, y: cy + hh, col: C.ok },
      { name: "¬O(p) Omissible", x: cx + hw, y: cy + hh, col: C.accent },
    ];

    // Contraries (top), Subcontraries (bottom), Implication (vertical), Contradictories (diagonal)
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(corners[0].x + 48, corners[0].y); ctx.lineTo(corners[1].x - 48, corners[1].y); ctx.stroke();
    label(ctx, "Contraries ¬(O∧F)", cx, cy - hh - 8, C.danger, "bold 9px monospace", "center");

    arrow(ctx, corners[0].x, corners[0].y + 18, corners[2].x, corners[2].y - 18, C.ok, 2, 6);
    arrow(ctx, corners[1].x, corners[1].y + 18, corners[3].x, corners[3].y - 18, C.ok, 2, 6);

    corners.forEach((c) => {
      roundRect(ctx, c.x - 52, c.y - 16, 104, 32, 6, "rgba(22,26,46,0.92)", c.col, 1.8);
      label(ctx, c.name, c.x, c.y + 4, c.col, "bold 10px monospace", "center");
    });

    // Right panel: Hart's Core of Certainty vs Penumbra of Doubt + Lex Specialis
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Hart's Core vs Penumbra & Meta-Rule Resolution");
    const rcx = rx + rw * 0.5, rcy = py + ph * 0.52;
    const rOuter = Math.min(rw, ph) * 0.34 * (0.55 + penumbra * 0.45);
    const rCore = Math.min(rw, ph) * 0.18;

    ctx.fillStyle = "rgba(255,209,102,0.16)";
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.arc(rcx, rcy, rOuter, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, "Penumbra of Open Texture", rcx, rcy - rOuter - 8, C.accent, "10px monospace", "center");

    ctx.fillStyle = "rgba(110,231,183,0.28)";
    ctx.strokeStyle = C.ok;
    ctx.beginPath(); ctx.arc(rcx, rcy, rCore, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    label(ctx, "Core Meaning", rcx, rcy + 4, C.ok, "bold 10px monospace", "center");

    const rawConflicts = Math.round(density * 14);
    const unresolved = Math.max(0, Math.round(rawConflicts * (1 - lexSpec * 0.85)));

    return {
      "Raw Antinomies": `${rawConflicts} O(p)∧F(p)`,
      "Unresolved Conflicts": `${unresolved}`,
      "Meta-Rule Priority": lexSpec > 0.5 ? "Lex Specialis Active" : "Lex Posterior",
      "Penumbral Zone": `${(penumbra * 100).toFixed(0)}% Open Texture`,
    };
  };

  // 40. jur_takings_michelman — Michelman Takings Formula (Efficiency B, Demoralization D, Settlement S)
  R.jur_takings_michelman = function (ctx, W, H, st) {
    st.drawHUD("Regulatory Takings: Penn Central, Lucas & Michelman Formula", st.spec.formula);
    const dimVal = st.a * 100;       // 0..100% parcel value loss
    const settleS = 10 + st.b * 70;  // Administrative settlement cost $k
    const recip = st.c * 45;         // Reciprocity of advantage offset

    const effGainB = 85;
    const demoralD = Math.max(0, dimVal * 1.15 - recip);
    const isLucasPerSe = dimVal >= 95;
    const compensate = isLucasPerSe || demoralD > settleS;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Michelman Utilitarian Takings Test & Lucas 100% Wipeout Threshold");

    const bars = [
      { name: "Public Benefit (B)", val: effGainB, col: C.ok },
      { name: "Demoralization (D)", val: demoralD, col: C.danger },
      { name: "Settlement Cost (S)", val: settleS, col: C.primary },
      { name: "Value Wipeout (%)", val: dimVal, col: dimVal >= 95 ? C.danger : C.accent },
    ];

    const ox = px + 48, oy = py + ph - 34, gw = pw - 96, gh = ph - 74;
    const colW = gw / 4;
    bars.forEach((b, i) => {
      const cx = ox + i * colW + colW * 0.5;
      const bh = clamp(b.val / 120, 0.05, 0.95) * gh;
      roundRect(ctx, cx - 30, oy - bh, 60, bh, 5, b.col + "38", b.col, 2);
      label(ctx, i === 3 ? `${b.val.toFixed(0)}%` : `$${b.val.toFixed(0)}k`, cx, oy - bh - 7, b.col, "bold 11px monospace", "center");
      label(ctx, b.name, cx, oy + 16, C.text, "10px monospace", "center");
    });

    const ruleMsg = isLucasPerSe
      ? "LUCAS CATEGORICAL TAKING (≥95% Value Wipeout) → Mandatory Just Compensation!"
      : (compensate ? "COMPENSABLE TAKING (Demoralization D > Settlement Cost S)" : "NON-COMPENSABLE POLICE POWER REGULATION (S ≥ D)");
    label(ctx, ruleMsg, px + pw / 2, py + 38, compensate ? C.danger : C.ok, "bold 11px monospace", "center");

    return {
      "Parcel Diminution": `-${dimVal.toFixed(1)}%`,
      "Demoralization D": `$${demoralD.toFixed(0)}k`,
      "Settlement Cost S": `$${settleS.toFixed(0)}k`,
      "5th Amend Holding": compensate ? "Just Compensation Due" : "No Taking (Penn Central)",
    };
  };

  // =========================================================================
  // 3. RF & SOFTWARE-DEFINED RADIO (20 SIMULATIONS)
  // =========================================================================

  // 41. rf_smith_chart_matching — Smith Chart r-circles & x-arcs + L-Network matching trajectory Z_L -> Z_0
  R.rf_smith_chart_matching = function (ctx, W, H, st) {
    st.drawHUD("Smith Chart Complex Reflection Γ(Z) & L-Network Matching", st.spec.formula);
    const Rl = 10 + st.a * 190;       // 10..200 Ohm
    const Xl = -120 + st.b * 240;     // -120..+120 Ohm
    const matchProg = st.c;           // Matching stub/element progress 0..1

    const Z0 = 50;
    const rN = Rl / Z0, xN = Xl / Z0;
    const denom = (rN + 1) * (rN + 1) + xN * xN;
    const gRe = (rN * rN + xN * xN - 1) / denom;
    const gIm = (2 * xN) / denom;
    const magG = Math.hypot(gRe, gIm) * (1 - 0.88 * matchProg);
    const vswr = (1 + magG) / Math.max(0.02, 1 - magG);
    const rlDb = -20 * Math.log10(Math.max(0.005, magG));

    const px = 18, py = 46, pw = W * 0.56, ph = H - 62;
    st.panel(px, py, pw, ph, "Normalized Smith Chart (Z₀ = 50 Ω): Constant-r Circles & Reactance Arcs");
    const cx = px + pw * 0.5, cy = py + ph * 0.54, Rchart = Math.min(pw, ph) * 0.39;

    ctx.save();
    // Outer |Γ| = 1 circle
    ctx.strokeStyle = C.axis;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(cx, cy, Rchart, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Real axis
    ctx.beginPath(); ctx.moveTo(cx - Rchart, cy); ctx.lineTo(cx + Rchart, cy); ctx.stroke();

    // Constant resistance circles r = 0.5, 1.0, 2.0
    [0.5, 1.0, 2.0].forEach((rVal) => {
      const cCenter = rVal / (rVal + 1);
      const cRad = 1 / (rVal + 1);
      ctx.strokeStyle = rVal === 1.0 ? "rgba(110,231,183,0.42)" : "rgba(255,255,255,0.14)";
      ctx.lineWidth = rVal === 1.0 ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(cx + cCenter * Rchart, cy, cRad * Rchart, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Reactance arcs clipped inside unit circle
    ctx.beginPath(); ctx.arc(cx, cy, Rchart, 0, Math.PI * 2); ctx.clip();
    [0.5, 1.0, 2.0, -0.5, -1.0, -2.0].forEach((xVal) => {
      ctx.strokeStyle = "rgba(124,156,255,0.18)";
      ctx.beginPath();
      ctx.arc(cx + Rchart, cy - (1 / xVal) * Rchart, Math.abs(1 / xVal) * Rchart, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Trajectory from Z_L (gRe, gIm) curved along L-network arc to center (0, 0)
    const lx = cx + gRe * Rchart, ly = cy - gIm * Rchart;
    const midX = cx + gRe * 0.35 * Rchart, midY = cy - (gIm * 0.65 + 0.25) * Rchart;
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(midX, midY, cx + (1 - matchProg) * (lx - cx) * 0.15, cy + (1 - matchProg) * (ly - cy) * 0.15);
    ctx.stroke();

    // Load point Z_L and Matched point
    ctx.fillStyle = C.danger;
    ctx.beginPath(); ctx.arc(lx, ly, 6, 0, Math.PI * 2); ctx.fill();
    const curX = cx + gRe * (1 - 0.88 * matchProg) * Rchart;
    const curY = cy - gIm * (1 - 0.88 * matchProg) * Rchart;
    ctx.fillStyle = C.ok;
    ctx.beginPath(); ctx.arc(curX, curY, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    label(ctx, `Z_L = ${Rl.toFixed(0)}${Xl >= 0 ? "+" : ""}j${Xl.toFixed(0)} Ω`, px + 14, py + 36, C.danger, "bold 10px monospace");
    label(ctx, "Matched 50 Ω Center", cx + 8, cy + 14, C.ok, "10px monospace");

    // Right panel: L-Network Schematic & VSWR/Return Loss
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "L-Network Reactive Match & Standing Wave Ratio");
    label(ctx, `|Γ| = ${magG.toFixed(3)}`, rx + 16, py + 48, C.primary, "bold 12px monospace");
    label(ctx, `VSWR = ${vswr.toFixed(2)} : 1`, rx + 16, py + 74, vswr < 1.5 ? C.ok : C.accent, "bold 12px monospace");
    label(ctx, `Return Loss = ${rlDb.toFixed(1)} dB`, rx + 16, py + 100, C.cyan, "bold 12px monospace");
    label(ctx, `Mismatch Loss = ${(-10 * Math.log10(1 - magG * magG)).toFixed(2)} dB`, rx + 16, py + 126, C.text, "11px monospace");

    return {
      "Reflection |Γ|": magG.toFixed(3),
      "VSWR": `${vswr.toFixed(2)} : 1`,
      "Return Loss": `${rlDb.toFixed(1)} dB`,
      "Load Z_L": `${Rl.toFixed(0)}${Xl >= 0 ? "+" : ""}j${Xl.toFixed(0)} Ω`,
    };
  };

  // 42. rf_telegrapher_tdr — CW Standing Wave Envelope V(z) + TDR Step Reflection Echo
  R.rf_telegrapher_tdr = function (ctx, W, H, st) {
    st.drawHUD("Transmission Line Standing Wave & Time-Domain Reflectometry (TDR)", st.spec.formula);
    const Zl = 5 + st.a * 245;        // 5..250 Ohm termination
    const loss = st.b * 0.45;         // attenuation
    const freqScale = 1 + st.c * 3.0;

    const Z0 = 50;
    const gamma = (Zl - Z0) / (Zl + Z0);
    const vswr = (1 + Math.abs(gamma)) / Math.max(0.04, 1 - Math.abs(gamma));

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Top: CW Standing-Wave Voltage Envelope |V(z)|  •  Bottom: TDR Step-Pulse Reflection");

    const ox = px + 36, gw = pw - 72;
    const topY = py + ph * 0.34, topH = ph * 0.22;

    // Standing wave envelope |e^{-az} + Gamma e^{+az} e^{-2j beta z}|
    ctx.save();
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const z = i / 100;
      const att = Math.exp(-loss * z);
      const env = att + Math.abs(gamma) * Math.exp(-loss * (2 - z)) * Math.cos(2 * Math.PI * freqScale * (1 - z));
      const x = ox + z * gw, y = topY - env * topH * 0.48;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Instantaneous traveling + reflected wave V(z, t)
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const z = i / 100;
      const w = 2 * Math.PI * freqScale;
      const vInc = Math.exp(-loss * z) * Math.cos(w * z - st.t * 4);
      const vRef = gamma * Math.exp(-loss * (2 - z)) * Math.cos(w * (2 - z) - st.t * 4);
      const x = ox + z * gw, y = topY - (vInc + vRef) * topH * 0.45;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Bottom TDR trace: step launched at t=0, reflection arrives at t = 2*T_prop
    const botY = py + ph * 0.82, botH = ph * 0.24;
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const vTdr = u < 0.15 ? 0 : (u < 0.55 ? 1.0 : 1.0 + gamma * Math.exp(-loss * 1.4));
      const x = ox + u * gw, y = botY - vTdr * botH * 0.55;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    label(ctx, `CW Standing Wave (VSWR = ${vswr.toFixed(2)})`, ox + 8, py + 34, C.primary, "bold 10px monospace");
    label(ctx, `TDR Step Echo: 1 + Γ = ${(1 + gamma).toFixed(2)} V (Z_L = ${Zl.toFixed(0)} Ω)`, ox + 8, py + ph * 0.56, C.ok, "bold 10px monospace");

    return {
      "Reflection Γ": `${gamma >= 0 ? "+" : ""}${gamma.toFixed(3)}`,
      "Line VSWR": `${vswr.toFixed(2)} : 1`,
      "TDR Plateau": `${(1 + gamma).toFixed(2)} V`,
      "Fault Diagnosis": Zl > 120 ? "High-Z / Open" : (Zl < 25 ? "Low-Z / Short" : "Near-Matched 50Ω"),
    };
  };

  // 43. rf_phased_array_beam — Polar Array Factor AF(θ) with electronic steering & grating lobes
  R.rf_phased_array_beam = function (ctx, W, H, st) {
    st.drawHUD("Uniform Linear Phased Array Beamforming & Grating Lobes", st.spec.formula);
    const N = Math.round(4 + st.a * 12);        // 4..16 elements
    const steerDeg = -60 + st.b * 120;          // -60..+60 deg
    const dLambda = 0.25 + st.c * 0.95;         // 0.25..1.20 wavelengths

    const theta0 = (steerDeg * Math.PI) / 180;
    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, `Polar Radiation Pattern |AF(θ)| (N=${N}, θ₀=${steerDeg.toFixed(0)}°, d/λ=${dLambda.toFixed(2)})`);

    const cx = px + pw * 0.48, cy = py + ph * 0.82, maxR = Math.min(pw * 0.42, ph * 0.68);

    // Polar angle grid semicircles
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    [0.33, 0.66, 1.0].forEach((f) => {
      ctx.beginPath(); ctx.arc(cx, cy, maxR * f, Math.PI, 0); ctx.stroke();
    });

    // Plot Array Factor AF(theta) for theta in [-90, +90] deg
    const hasGrating = dLambda >= 1 / (1 + Math.abs(Math.sin(theta0)));
    ctx.fillStyle = hasGrating ? "rgba(255,107,107,0.24)" : "rgba(110,231,183,0.24)";
    ctx.strokeStyle = hasGrating ? C.danger : C.ok;
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (let deg = -90; deg <= 90; deg += 1) {
      const th = (deg * Math.PI) / 180;
      const psi = Math.PI * dLambda * (Math.sin(th) - Math.sin(theta0));
      const af = Math.abs(psi) < 1e-4 ? 1.0 : Math.abs(Math.sin(N * psi) / (N * Math.sin(psi)));
      const r = clamp(af, 0, 1) * maxR;
      const x = cx + Math.sin(th) * r, y = cy - Math.cos(th) * r;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw N antenna elements along baseline
    for (let k = 0; k < N; k++) {
      const ex = cx + (k - (N - 1) / 2) * 14;
      ctx.fillStyle = C.accent;
      ctx.fillRect(ex - 2.5, cy + 4, 5, 10);
    }
    ctx.restore();

    const hpbw = (50.8 / (N * dLambda * Math.max(0.3, Math.cos(theta0)))).toFixed(1);
    label(ctx, hasGrating ? "WARNING: Spatial Aliasing Grating Lobe Active (d/λ Too Large)!" : "Clean Unambiguous Main Lobe", px + 18, py + 38, hasGrating ? C.danger : C.ok, "bold 11px monospace");

    return {
      "Array Elements N": `${N}`,
      "Steer Angle θ₀": `${steerDeg.toFixed(1)}°`,
      "Half-Power BW": `${hpbw}°`,
      "Grating Lobes": hasGrating ? "Present (Spatial Alias)" : "None (d/λ Safe)",
    };
  };

  // 44. rf_iq_qam_constellation — 16-QAM I/Q Constellation with AWGN + LO Phase Noise Arcs + EVM
  R.rf_iq_qam_constellation = function (ctx, W, H, st) {
    st.drawHUD("SDR 16-QAM I/Q Constellation, Phase Jitter & EVM", st.spec.formula);
    const ebn0 = 4 + st.a * 24;        // 4..28 dB
    const phiDeg = st.b * 14;          // 0..14 deg phase jitter
    const iqSkew = st.c * 0.22;        // I/Q gain/quadrature skew

    const px = 18, py = 46, pw = W * 0.56, ph = H - 62;
    st.panel(px, py, pw, ph, "16-QAM Complex Baseband Plane (I = In-Phase, Q = Quadrature)");
    const cx = px + pw * 0.5, cy = py + ph * 0.54, scale = Math.min(pw, ph) * 0.11;

    ctx.strokeStyle = C.axis;
    ctx.beginPath();
    ctx.moveTo(px + 20, cy); ctx.lineTo(px + pw - 20, cy);
    ctx.moveTo(cx, py + 28); ctx.lineTo(cx, py + ph - 14);
    ctx.stroke();

    const noiseStd = Math.pow(10, -ebn0 / 20) * 1.4;
    const phiRad = (phiDeg * Math.PI) / 180;
    const levels = [-3, -1, 1, 3];

    levels.forEach((I0) => {
      levels.forEach((Q0) => {
        // Ideal reference cross
        const ix = cx + I0 * scale, iy = cy - Q0 * scale;
        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        ctx.moveTo(ix - 4, iy); ctx.lineTo(ix + 4, iy);
        ctx.moveTo(ix, iy - 4); ctx.lineTo(ix, iy + 4);
        ctx.stroke();

        // Noisy + phase-rotated cloud of 5 points per symbol
        for (let k = 0; k < 5; k++) {
          const seed = (I0 * 7 + Q0 * 13 + k * 31) + st.t * 2.5;
          const n1 = Math.sin(seed * 12.9898) * noiseStd;
          const n2 = Math.cos(seed * 78.233) * noiseStd;
          const dPhi = Math.sin(seed * 3.7) * phiRad;
          const Ir = (I0 * (1 + iqSkew)) * Math.cos(dPhi) - Q0 * Math.sin(dPhi) + n1;
          const Qr = (I0 * (1 + iqSkew)) * Math.sin(dPhi) + Q0 * Math.cos(dPhi) + Q0 * iqSkew * 0.4 + n2;
          ctx.fillStyle = C.cyan;
          ctx.beginPath();
          ctx.arc(cx + Ir * scale, cy - Qr * scale, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    const evmPct = clamp(Math.hypot(noiseStd * 0.45, phiRad * 1.1, iqSkew) * 100, 1.2, 65);
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Error Vector Magnitude (EVM)");
    label(ctx, `EVM_rms = ${evmPct.toFixed(1)}%`, rx + 16, py + 54, evmPct < 8 ? C.ok : (evmPct < 16 ? C.accent : C.danger), "bold 13px monospace");
    label(ctx, `Eb/N0 = ${ebn0.toFixed(1)} dB`, rx + 16, py + 82, C.primary, "11px monospace");
    label(ctx, `LO Phase Noise = ${phiDeg.toFixed(1)}° rms`, rx + 16, py + 106, C.secondary, "11px monospace");
    label(ctx, `I/Q Imbalance = ${(iqSkew * 100).toFixed(1)}%`, rx + 16, py + 130, C.accent, "11px monospace");

    return {
      "RMS EVM": `${evmPct.toFixed(1)}% (${(20 * Math.log10(evmPct / 100)).toFixed(1)} dB)`,
      "Channel Eb/N0": `${ebn0.toFixed(1)} dB`,
      "Phase Jitter σ_φ": `${phiDeg.toFixed(1)}°`,
      "3GPP 16-QAM Spec": evmPct <= 12.5 ? "PASS (<12.5%)" : "FAIL (Symbol Errors)",
    };
  };

  // 45. rf_costas_pll_carrier — Costas Loop Phase Error e_φ(t) Transient + Loop Block Diagram
  R.rf_costas_pll_carrier = function (ctx, W, H, st) {
    st.drawHUD("Costas Loop Carrier Recovery & Phase Error Transient", st.spec.formula);
    const dfKhz = 2 + st.a * 48;
    const bwLoop = 0.2 + st.b * 0.8;
    const zeta = 0.25 + st.c * 1.4;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Costas I×Q Phase Error Transient φ_e(t) Pulling Carrier Offset Δf to Lock");

    const ox = px + 42, oy = py + ph * 0.56, gw = pw - 76, gh = ph * 0.34;
    ctx.strokeStyle = C.axis;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke();

    const pullInSuccess = dfKhz < bwLoop * 55;
    ctx.strokeStyle = pullInSuccess ? C.ok : C.danger;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * 10;
      const wn = 0.9 + bwLoop * 1.8;
      let err;
      if (pullInSuccess) {
        err = Math.exp(-zeta * wn * t) * Math.cos(wn * Math.sqrt(Math.max(0.1, 1 - zeta * zeta)) * t);
      } else {
        // Cycle slipping sawtooth
        err = 0.85 * Math.sin(t * 2.8 - st.t * 3);
      }
      const x = ox + (i / 100) * gw, y = oy - err * gh;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Bottom Costas Loop Block Diagram
    const by = py + ph - 36;
    const blocks = ["I/Q Mixers", "LPF Arms", "Phase Det I·Q", "PI Loop Filter", "NCO / VCO"];
    blocks.forEach((b, i) => {
      const bx = ox + i * (gw / 5) + 4;
      roundRect(ctx, bx, by - 14, gw / 5 - 14, 26, 5, "rgba(124,156,255,0.16)", C.primary, 1.4);
      label(ctx, b, bx + (gw / 5 - 14) / 2, by + 3, C.text, "bold 9px monospace", "center");
    });

    const lockTimeUs = (4.2 / (zeta * (0.9 + bwLoop * 1.8)) * 10).toFixed(1);
    return {
      "Carrier Offset Δf": `${dfKhz.toFixed(1)} kHz`,
      "Damping Factor ζ": zeta.toFixed(2),
      "Settling Time": pullInSuccess ? `${lockTimeUs} µs` : "Cycle Slipping!",
      "PLL Lock State": pullInSuccess ? "Phase Locked (0°)" : "Out of Lock",
    };
  };

  // 46. rf_ofdm_cyclic_prefix — Orthogonal Sinc Subcarriers + Cyclic Prefix Guard Interval vs Multipath
  R.rf_ofdm_cyclic_prefix = function (ctx, W, H, st) {
    st.drawHUD("OFDM Orthogonal Subcarriers & Cyclic Prefix ISI Guard", st.spec.formula);
    const tauMax = 0.5 + st.a * 7.5; // us multipath spread
    const tcp = 0.5 + st.b * 7.5;    // us CP length
    const ibo = 2 + st.c * 10;       // PA backoff dB

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Top: Orthogonal Sinc Subcarriers in Frequency  •  Bottom: Cyclic Prefix vs Multipath Delay τ_max");

    const ox = px + 36, gw = pw - 72, topY = py + ph * 0.45, topH = ph * 0.28;
    const cols = [C.primary, C.ok, C.accent, C.secondary, C.purple, C.cyan];

    // Draw 6 overlapping sinc subcarriers
    for (let k = 0; k < 6; k++) {
      const centerU = 0.18 + k * 0.128;
      ctx.strokeStyle = cols[k];
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        const xArg = (u - centerU) * 7.8 * Math.PI;
        const sinc = Math.abs(xArg) < 1e-3 ? 1 : Math.sin(xArg) / xArg;
        const sx = ox + u * gw, sy = topY - sinc * topH;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    // Bottom: Cyclic Prefix guard bar vs Multipath Echo Spread
    const by = py + ph - 48;
    const cpW = (tcp / 10) * (gw * 0.45);
    const mpW = (tauMax / 10) * (gw * 0.45);
    const isiFree = tcp >= tauMax;

    roundRect(ctx, ox, by, cpW, 26, 4, "rgba(110,231,183,0.28)", C.ok, 2);
    label(ctx, `CP Guard T_CP=${tcp.toFixed(1)}µs`, ox + cpW / 2, by + 17, C.ok, "bold 10px monospace", "center");

    roundRect(ctx, ox + cpW + 4, by, gw - cpW - 4, 26, 4, "rgba(124,156,255,0.2)", C.primary, 1.6);
    label(ctx, "FFT Useful Symbol Window T_u (64-pt IFFT)", ox + cpW + (gw - cpW) / 2, by + 17, C.primary, "bold 10px monospace", "center");

    // Multipath delay wedge
    roundRect(ctx, ox, by - 14, mpW, 10, 3, isiFree ? C.accent : C.danger, null, 0);
    label(ctx, `Multipath Delay Spread τ_max = ${tauMax.toFixed(1)}µs → ${isiFree ? "ABSORBED INSIDE CP (Zero ISI)" : "SPILLS INTO FFT WINDOW (ISI + ICI!)"}`, ox, by - 20, isiFree ? C.ok : C.danger, "bold 10px monospace");

    return {
      "Delay Spread τ_max": `${tauMax.toFixed(1)} µs`,
      "Cyclic Prefix T_CP": `${tcp.toFixed(1)} µs`,
      "Orthogonality": isiFree ? "Preserved (1-Tap EQ)" : "Broken (ISI + ICI)",
      "CP Overhead": `${((tcp / (tcp + 16)) * 100).toFixed(1)}%`,
    };
  };

  // 47. rf_fmcw_chirp_radar — Sawtooth TX/RX Chirp Beat Frequency + 2D Range-Doppler Map
  R.rf_fmcw_chirp_radar = function (ctx, W, H, st) {
    st.drawHUD("FMCW Sawtooth Chirp Radar & 2D Range–Doppler FFT Map", st.spec.formula);
    const bwGhz = 0.5 + st.a * 3.5;     // 0.5..4.0 GHz
    const vel = -45 + st.b * 90;        // -45..+45 m/s
    const cfar = 8 + st.c * 18;         // dB threshold

    const rangeResCm = (3e8 / (2 * bwGhz * 1e9)) * 100;
    const px = 18, py = 46, pw = W * 0.52, ph = H - 62;
    st.panel(px, py, pw, ph, "FMCW Sawtooth f(t): Solid = TX Chirp, Dashed = Delayed RX Echo (f_beat)");
    const ox = px + 34, oy = py + ph - 28, gw = pw - 52, gh = ph - 62;

    // Draw 3 sawtooth chirps for TX and delayed RX
    const drawSaw = (delayU, col, dash) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.2;
      if (dash) ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const saw = ((u * 3 - delayU + 3) % 1);
        const x = ox + u * gw, y = oy - saw * gh * 0.85;
        if (i === 0 || saw < 0.04) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };
    drawSaw(0, C.primary, false);
    drawSaw(0.16, C.danger, true);
    label(ctx, "TX Linear FM Ramp", ox + 8, py + 36, C.primary, "bold 10px monospace");
    label(ctx, "RX Delayed Echo (Δf = f_beat)", ox + 8, py + 52, C.danger, "bold 10px monospace");

    // Right panel: 2D Range-Doppler Matrix
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "2D Range–Doppler FFT Heatmap");
    const gx = rx + 24, gy = py + 34, mw = rw - 40, mh = ph - 62;
    roundRect(ctx, gx, gy, mw, mh, 6, "rgba(10,14,28,0.95)", C.axis, 1.4);

    // Center zero-Doppler line
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath(); ctx.moveTo(gx + mw / 2, gy); ctx.lineTo(gx + mw / 2, gy + mh); ctx.stroke();

    // Target blip position
    const tx = gx + clamp(0.5 + (vel / 100), 0.1, 0.9) * mw;
    const ty = gy + (1 - st.px * 0.7 - 0.15) * mh;
    const grad = ctx.createRadialGradient(tx, ty, 2, tx, ty, 24);
    grad.addColorStop(0, C.ok);
    grad.addColorStop(0.45, "rgba(255,209,102,0.55)");
    grad.addColorStop(1, "rgba(255,209,102,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(tx, ty, 24, 0, Math.PI * 2); ctx.fill();
    label(ctx, `Target (v=${vel.toFixed(0)}m/s)`, tx, ty - 14, C.ok, "bold 10px monospace", "center");

    return {
      "Sweep Bandwidth B": `${bwGhz.toFixed(2)} GHz`,
      "Range Resolution ΔR": `${rangeResCm.toFixed(1)} cm`,
      "Radial Velocity v_r": `${vel.toFixed(1)} m/s`,
      "CA-CFAR Margin": `+${cfar.toFixed(1)} dB`,
    };
  };

  // 48. rf_friis_link_budget — Satellite Link Budget Waterfall Chart + Friis Cascaded LNA Noise Figure
  R.rf_friis_link_budget = function (ctx, W, H, st) {
    st.drawHUD("Satellite RF Link Budget Waterfall & Friis Noise Cascade", st.spec.formula);
    const nf1 = 0.5 + st.a * 4.5;     // dB LNA NF
    const g1 = 8 + st.b * 24;         // dB LNA Gain
    const rain = st.c * 14;           // dB rain fade

    // Friis cascaded noise factor with 2nd stage NF2 = 10 dB (F2 = 10)
    const F1 = Math.pow(10, nf1 / 10), G1 = Math.pow(10, g1 / 10), F2 = 10;
    const Ftot = F1 + (F2 - 1) / G1;
    const NFtot = 10 * Math.log10(Ftot);

    const eirp = 54;       // dBW
    const fspl = -196;     // dB
    const rxAntG = 38;     // dBi
    const ebn0 = 18 - rain - NFtot + (g1 * 0.12);

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Ku-Band Downlink Power Waterfall (EIRP → Path Loss → Rain Fade → LNA G/T → Eb/N0)");

    const stages = [
      { name: "Sat EIRP", val: "+54 dBW", h: 0.78, col: C.primary },
      { name: "Free-Space Loss", val: "-196 dB", h: 0.22, col: C.danger },
      { name: "Rain Fade", val: `-${rain.toFixed(1)} dB`, h: clamp(0.22 - rain * 0.008, 0.08, 0.22), col: C.secondary },
      { name: "Dish Gain + LNA", val: `+${(rxAntG + g1).toFixed(0)} dB`, h: 0.64, col: C.accent },
      { name: "Demod Eb/N0", val: `${ebn0.toFixed(1)} dB`, h: clamp(ebn0 / 25, 0.1, 0.9), col: ebn0 >= 10 ? C.ok : C.danger },
    ];

    const ox = px + 44, oy = py + ph - 34, gw = pw - 88, gh = ph - 74;
    const colW = gw / stages.length;
    stages.forEach((s, i) => {
      const cx = ox + i * colW + colW * 0.5;
      const bh = s.h * gh;
      roundRect(ctx, cx - 32, oy - bh, 64, bh, 5, s.col + "38", s.col, 2);
      label(ctx, s.val, cx, oy - bh - 7, s.col, "bold 10px monospace", "center");
      label(ctx, s.name, cx, oy + 16, C.text, "10px monospace", "center");
      if (i < stages.length - 1) {
        arrow(ctx, cx + 34, oy - bh * 0.6, cx + colW - 34, oy - stages[i + 1].h * gh * 0.6, C.axis, 1.5, 5);
      }
    });

    return {
      "LNA Stage-1 NF₁": `${nf1.toFixed(2)} dB`,
      "Cascaded Total NF": `${NFtot.toFixed(2)} dB`,
      "Rain Attenuation": `-${rain.toFixed(1)} dB`,
      "Link Margin (Eb/N0)": `${ebn0.toFixed(1)} dB (${ebn0 >= 9.5 ? "LOCKED" : "DROPPED"})`,
    };
  };

  // 49. rf_fir_polyphase_ddc — Kaiser-Windowed Sinc Impulse h[n] & Magnitude Response |H(e^jω)| dB
  R.rf_fir_polyphase_ddc = function (ctx, W, H, st) {
    st.drawHUD("Digital Down-Converter (DDC) & Polyphase FIR Filter Designer", st.spec.formula);
    const M = Math.round(15 + st.a * 50);       // Filter taps
    const wc = 0.15 + st.b * 0.55;              // Cutoff omega_c / pi
    const beta = st.c * 9.0;                    // Kaiser window beta

    const px = 18, py = 46, pw = W * 0.46, ph = H - 62;
    st.panel(px, py, pw, ph, `Windowed-Sinc Impulse Response h[n] (${M} Taps)`);
    const ox = px + 24, oy = py + ph * 0.62, gw = pw - 44, gh = ph * 0.36;

    ctx.strokeStyle = C.axis;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke();

    const nShow = 25;
    for (let k = -12; k <= 12; k++) {
      const u = (k + 12) / (nShow - 1);
      const x = ox + u * gw;
      const sinc = k === 0 ? 1 : Math.sin(Math.PI * wc * k) / (Math.PI * wc * k);
      const win = Math.exp(-0.015 * beta * k * k);
      const hVal = sinc * win;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy - hVal * gh); ctx.stroke();
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(x, oy - hVal * gh, 2.8, 0, Math.PI * 2); ctx.fill();
    }

    // Right panel: Log-Magnitude Frequency Response |H(f)| in dB
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Frequency Response |H(e^{jω})| (dB) & Aliasing Stopband");
    const rox = rx + 30, roy = py + ph - 28, rgw = rw - 44, rgh = ph - 62;

    const stopAtten = -(22 + beta * 6.8);
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const f = i / 90;
      const transW = 2.8 / M;
      let db;
      if (f < wc - transW) db = -0.2 * Math.sin(f * 35);
      else if (f < wc + transW) db = ((f - (wc - transW)) / (2 * transW)) * stopAtten;
      else db = stopAtten + 8 * Math.abs(Math.sin((f - wc) * M * 1.4));
      const sx = rox + f * rgw, sy = roy - clamp((db + 100) / 105, 0.04, 0.96) * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    label(ctx, `Stopband Attenuation: ${stopAtten.toFixed(1)} dB`, rox + 12, py + 42, C.ok, "bold 10px monospace");

    return {
      "FIR Tap Order M": `${M} taps`,
      "Passband Cutoff": `${wc.toFixed(2)} × f_Nyq`,
      "Stopband Rejection": `${stopAtten.toFixed(1)} dB`,
      "Polyphase MACs": `${Math.ceil(M / 4)} ops/out`,
    };
  };

  // 50. rf_viterbi_ldpc_turbo — 4-State Viterbi Trellis Survivor Path + Waterfall BER Curve
  R.rf_viterbi_ldpc_turbo = function (ctx, W, H, st) {
    st.drawHUD("Viterbi Convolutional Trellis & LDPC Coding Gain Waterfall", st.spec.formula);
    const ebn0 = 0.5 + st.a * 9.5;
    const rate = 0.33 + st.b * 0.5;
    const iters = Math.round(1 + st.c * 29);

    const px = 18, py = 46, pw = W * 0.56, ph = H - 62;
    st.panel(px, py, pw, ph, "4-State Viterbi Decoder Trellis (States 00, 01, 10, 11) & Minimum-Metric Survivor Path");

    const states = ["S₀ (00)", "S₁ (01)", "S₂ (10)", "S₃ (11)"];
    const stages = 5;
    const ox = px + 54, gw = pw - 82, topY = py + 42, gh = ph - 68;
    const survPath = [0, 2, 1, 2, 0];

    for (let t = 0; t < stages; t++) {
      const x1 = ox + (t / (stages - 1)) * gw;
      const x2 = ox + ((t + 1) / (stages - 1)) * gw;
      for (let s = 0; s < 4; s++) {
        const y1 = topY + (s / 3) * gh;
        if (t === 0) label(ctx, states[s], ox - 46, y1 + 4, C.muted, "10px monospace");
        if (t < stages - 1) {
          // Two outgoing branches from state s
          const next0 = (s >> 1);
          const next1 = (s >> 1) | 2;
          [next0, next1].forEach((ns) => {
            const y2 = topY + (ns / 3) * gh;
            const isSurv = survPath[t] === s && survPath[t + 1] === ns;
            ctx.strokeStyle = isSurv ? C.ok : "rgba(255,255,255,0.14)";
            ctx.lineWidth = isSurv ? 3.0 : 1.1;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          });
        }
        ctx.fillStyle = survPath[t] === s ? C.ok : C.primary;
        ctx.beginPath(); ctx.arc(x1, y1, survPath[t] === s ? 5.5 : 4, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Right panel: Uncoded vs Viterbi vs LDPC BER
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Coding Gain vs Uncoded BPSK");
    const codingGainDb = (3.8 + (1 - rate) * 3.2 + Math.log10(iters) * 1.4);
    const effSnr = ebn0 + codingGainDb;
    const berLog = clamp(-0.45 * Math.pow(effSnr, 1.35), -12, -0.5);

    label(ctx, `Channel Eb/N0: ${ebn0.toFixed(1)} dB`, rx + 14, py + 48, C.primary, "bold 11px monospace");
    label(ctx, `Net Coding Gain: +${codingGainDb.toFixed(1)} dB`, rx + 14, py + 74, C.ok, "bold 11px monospace");
    label(ctx, `Decoded BER: 10^(${berLog.toFixed(1)})`, rx + 14, py + 100, C.accent, "bold 11px monospace");
    label(ctx, `LDPC Sum-Product: ${iters} iters`, rx + 14, py + 126, C.text, "10px monospace");

    return {
      "Channel Eb/N0": `${ebn0.toFixed(1)} dB`,
      "Coding Gain": `+${codingGainDb.toFixed(2)} dB`,
      "Post-FEC BER": `10^(${berLog.toFixed(1)})`,
      "Code Rate R": rate.toFixed(2),
    };
  };

  // 51. rf_superhet_image_ip3 — Two-Tone IMD3 Spurs (2f1-f2, 2f2-f1) + P_out vs P_in IIP3 Intercept
  R.rf_superhet_image_ip3 = function (ctx, W, H, st) {
    st.drawHUD("Superheterodyne Image Rejection & Third-Order Intercept (IIP3)", st.spec.formula);
    const pin = -35 + st.a * 35;      // -35..0 dBm
    const iip3 = 5 + st.b * 30;       // +5..+35 dBm
    const fIf = 10 + st.c * 90;       // MHz

    const imd3 = 3 * pin - 2 * iip3;
    const noiseFloor = -110;
    const sfdr = (2 / 3) * (iip3 - noiseFloor);

    const px = 18, py = 46, pw = W * 0.52, ph = H - 62;
    st.panel(px, py, pw, ph, "Two-Tone Output Spectrum: Fundamentals (f₁, f₂) vs 3rd-Order IMD3 Spurs");
    const ox = px + 34, oy = py + ph - 28, gw = pw - 56, gh = ph - 62;

    // Noise floor line
    ctx.strokeStyle = C.axis;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke();

    const tones = [
      { name: "2f₁−f₂ (IMD3)", u: 0.24, dbm: imd3, col: C.danger },
      { name: "f₁ Tone", u: 0.42, dbm: pin, col: C.primary },
      { name: "f₂ Tone", u: 0.58, dbm: pin, col: C.primary },
      { name: "2f₂−f₁ (IMD3)", u: 0.76, dbm: imd3, col: C.danger },
    ];
    tones.forEach((t) => {
      const tx = ox + t.u * gw;
      const h = clamp((t.dbm - noiseFloor) / 115, 0.04, 0.95) * gh;
      arrow(ctx, tx, oy, tx, oy - h, t.col, 3, 7);
      label(ctx, `${t.dbm.toFixed(0)}dBm`, tx, oy - h - 8, t.col, "bold 9px monospace", "center");
      label(ctx, t.name, tx, oy + 15, C.text, "9px monospace", "center");
    });

    // Right panel: Fundamental (1:1 slope) vs IMD3 (3:1 slope) intersecting at IIP3
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "1 dB/dB Fundamental vs 3 dB/dB IMD3 Extrapolation");
    const rox = rx + 26, roy = py + ph - 28, rgw = rw - 42, rgh = ph - 62;

    // Fundamental line
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rox, roy - rgh * 0.15); ctx.lineTo(rox + rgw * 0.85, roy - rgh * 0.85); ctx.stroke();

    // IMD3 3x slope line intersecting at IIP3
    ctx.strokeStyle = C.danger;
    ctx.beginPath(); ctx.moveTo(rox + rgw * 0.22, roy); ctx.lineTo(rox + rgw * 0.85, roy - rgh * 0.85); ctx.stroke();

    ctx.fillStyle = C.accent;
    ctx.beginPath(); ctx.arc(rox + rgw * 0.85, roy - rgh * 0.85, 6, 0, Math.PI * 2); ctx.fill();
    label(ctx, `IIP3 = +${iip3.toFixed(1)} dBm`, rox + rgw * 0.85 - 45, roy - rgh * 0.85 - 10, C.accent, "bold 10px monospace");

    return {
      "Input Tone P_in": `${pin.toFixed(1)} dBm`,
      "IMD3 Spur Level": `${imd3.toFixed(1)} dBm`,
      "Spurious-Free SFDR": `${sfdr.toFixed(1)} dB`,
      "Image Freq f_img": `f_RF + ${(2 * fIf).toFixed(0)} MHz`,
    };
  };

  // 52. rf_yagi_maxwell_fdtd — Yagi-Uda Reflector/Driven/Directors + Propagating E-field Wavefronts
  R.rf_yagi_maxwell_fdtd = function (ctx, W, H, st) {
    st.drawHUD("2D FDTD Maxwell Wave Propagation & Yagi-Uda Endfire Array", st.spec.formula);
    const omega = 1 + st.a * 2.5;
    const er = 1 + st.b * 8;
    const sigma = st.c;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Yagi-Uda Parasitic Array (Reflector + Driven Dipole + 4 Directors) & E_z Wavefronts");

    const ax = px + pw * 0.28, ay = py + ph * 0.54;
    // Boom line
    ctx.strokeStyle = C.muted;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax - 45, ay); ctx.lineTo(ax + 155, ay); ctx.stroke();

    // Reflector (longest), Driven (red), 4 Directors (shorter)
    const els = [
      { dx: -36, h: 64, col: C.primary, name: "Reflector" },
      { dx: 0, h: 54, col: C.danger, name: "Driven λ/2" },
      { dx: 34, h: 46, col: C.accent, name: "Dir 1" },
      { dx: 68, h: 44, col: C.accent, name: "Dir 2" },
      { dx: 102, h: 42, col: C.accent, name: "Dir 3" },
      { dx: 136, h: 40, col: C.accent, name: "Dir 4" },
    ];
    els.forEach((e) => {
      ctx.strokeStyle = e.col;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(ax + e.dx, ay - e.h); ctx.lineTo(ax + e.dx, ay + e.h); ctx.stroke();
    });

    // Propagating directional E-field wavefront arcs toward right dielectric slab
    for (let w = 0; w < 7; w++) {
      const r = (((st.t * 45 * omega) + w * 38) % 260) + 20;
      const alpha = clamp(1 - r / 280, 0.1, 0.85);
      ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(ax + 20, ay, r, -0.38 * Math.PI, 0.38 * Math.PI);
      ctx.stroke();
    }

    // Dielectric / Conductor slab on right
    const sx = px + pw * 0.76;
    roundRect(ctx, sx, py + 38, 64, ph - 58, 6, "rgba(192,132,252,0.2)", C.purple, 2);
    label(ctx, `Slab ε_r=${er.toFixed(1)}`, sx + 32, py + 58, C.purple, "bold 10px monospace", "center");
    const skinUm = (25 / Math.sqrt(omega * (0.2 + sigma * 4))).toFixed(1);
    label(ctx, `Skin δ=${skinUm}µm`, sx + 32, py + 76, C.text, "9px monospace", "center");

    return {
      "Forward Gain": `${(11.8 + omega * 0.6).toFixed(1)} dBi`,
      "Front-to-Back": "18.4 dB",
      "Dielectric λ_g": `λ₀ / ${Math.sqrt(er).toFixed(2)}`,
      "Skin Depth δ": `${skinUm} µm`,
    };
  };

  // 53. rf_mimo_svd_waterfilling — SVD Parallel Eigenchannels σ_i & Water-Filling Power Vessel
  R.rf_mimo_svd_waterfilling = function (ctx, W, H, st) {
    st.drawHUD("Massive MIMO SVD Eigenmodes & Shannon Water-Filling", st.spec.formula);
    const rankN = Math.round(2 + st.a * 6);     // 2..8 spatial streams
    const snrDb = 2 + st.b * 26;                // dB
    const corr = st.c * 0.88;                   // spatial correlation

    const snrLin = Math.pow(10, snrDb / 10);
    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, `Shannon Water-Filling Vessel: Inverse Noise Floor (1/σ_i²) + Allocated Power P_i = (μ − 1/σ_i²)⁺`);

    const ox = px + 48, oy = py + ph - 34, gw = pw - 96, gh = ph - 74;
    const waterLine = 0.78;
    const waterY = oy - waterLine * gh;

    let capSum = 0, activeStreams = 0;
    const colW = gw / rankN;

    for (let i = 0; i < rankN; i++) {
      // High spatial correlation crushes weaker singular values
      const sigma2 = Math.pow(1 - corr * 0.85, i * 1.4) * (1.2 / (i + 1));
      const invNoise = clamp((1 / (sigma2 * snrLin * 0.35)), 0.08, 0.95);
      const pAlloc = Math.max(0, waterLine - invNoise);
      if (pAlloc > 0) {
        activeStreams++;
        capSum += Math.log2(1 + (pAlloc / invNoise));
      }

      const bx = ox + i * colW + 6, bw = colW - 12;
      const floorH = invNoise * gh;
      const waterH = pAlloc * gh;

      // Solid rock step (1 / sigma_i^2 noise floor)
      roundRect(ctx, bx, oy - floorH, bw, floorH, 3, "rgba(255,107,107,0.32)", C.danger, 1.5);
      // Blue water fill (Allocated transmit power P_i)
      if (waterH > 1) {
        roundRect(ctx, bx, oy - floorH - waterH, bw, waterH, 3, "rgba(103,232,249,0.38)", C.cyan, 1.8);
      }
      label(ctx, `λ_${i + 1}`, bx + bw / 2, oy + 15, C.text, "10px monospace", "center");
    }

    // Water level dashed line μ
    ctx.save();
    ctx.strokeStyle = C.cyan;
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox, waterY); ctx.lineTo(ox + gw, waterY); ctx.stroke();
    ctx.restore();
    label(ctx, "Lagrange Water Level μ (Power Budget)", ox + 10, waterY - 7, C.cyan, "bold 10px monospace");

    return {
      "Active Eigenmodes": `${activeStreams} / ${rankN} streams`,
      "Spectral Efficiency": `${capSum.toFixed(2)} bps/Hz`,
      "Spatial Correlation": `ρ = ${corr.toFixed(2)}`,
      "Total SNR": `${snrDb.toFixed(1)} dB`,
    };
  };

  // 54. rf_chirp_lora_css — LoRa Up-Chirp Spectrogram + Conjugate De-Chirp FFT Spike Below Noise
  R.rf_chirp_lora_css = function (ctx, W, H, st) {
    st.drawHUD("LoRa Chirp Spread Spectrum (CSS) & Sub-Noise De-Chirp FFT", st.spec.formula);
    const sf = Math.round(7 + st.a * 5);       // SF7 .. SF12
    const snrIn = -22 + st.b * 26;             // -22 .. +4 dB
    const jammer = st.c * 15;

    const procGainDb = 10 * Math.log10(Math.pow(2, sf));
    const postFftSnr = snrIn + procGainDb - jammer * 0.35;

    const px = 18, py = 46, pw = W * 0.5, ph = H - 62;
    st.panel(px, py, pw, ph, `LoRa CSS Cyclic Up-Chirp Spectrogram (SF${sf} = ${Math.pow(2, sf)} Chips)`);
    const ox = px + 30, oy = py + ph - 28, gw = pw - 48, gh = ph - 62;

    // Draw wrapping symbol up-chirp f(t) = (f0 + k*t) mod BW
    const symOffset = 0.36;
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const fWrap = (u + symOffset) % 1.0;
      const x = ox + u * gw, y = oy - fWrap * gh;
      if (i === 0 || Math.abs(u + symOffset - 1.0) < 0.015) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    label(ctx, "Cyclic Frequency Wrap at BW Edge", ox + 10, py + 40, C.ok, "bold 10px monospace");

    // Right panel: De-chirped FFT Bin Correlation Peak rising out of thermal noise
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "De-Chirped FFT Magnitude (s(t) × c*(t))");
    const rox = rx + 26, roy = py + ph - 28, rgw = rw - 42, rgh = ph - 62;

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const isPeak = Math.abs(u - symOffset) < 0.03;
      const mag = isPeak ? clamp((postFftSnr + 12) / 35, 0.25, 0.95) : 0.14 + 0.08 * Math.abs(Math.sin(i * 7.3 + st.t * 4));
      const sx = rox + u * rgw, sy = roy - mag * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    label(ctx, `Processing Gain G_p = +${procGainDb.toFixed(1)} dB`, rox + 8, py + 40, C.accent, "bold 10px monospace");

    return {
      "Spreading Factor": `SF${sf} (${Math.pow(2, sf)} chips)`,
      "Processing Gain": `+${procGainDb.toFixed(1)} dB`,
      "Input Channel SNR": `${snrIn.toFixed(1)} dB`,
      "Post-Dechirp SNR": `${postFftSnr.toFixed(1)} dB (${postFftSnr >= 6 ? "DECODED" : "BELOW THRES"})`,
    };
  };

  // 55. rf_kalman_music_doa — MUSIC Super-Resolution Pseudospectrum P_MUSIC(θ) vs Beamformer
  R.rf_kalman_music_doa = function (ctx, W, H, st) {
    st.drawHUD("MUSIC Subspace Super-Resolution Direction-of-Arrival (DoA)", st.spec.formula);
    const sepDeg = 2 + st.a * 28;              // 2..30 deg separation
    const snaps = Math.round(10 + st.b * 290); // 10..300 snapshots
    const snrDb = 0 + st.c * 25;

    const th1 = -sepDeg / 2, th2 = sepDeg / 2;
    const sharpness = (snaps / 60) * Math.pow(10, snrDb / 25);

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, `MUSIC Pseudospectrum P_MUSIC(θ) (Solid) vs Conventional Bartlett Beamformer (Dashed)`);
    const ox = px + 44, oy = py + ph - 30, gw = pw - 84, gh = ph - 66;

    // Conventional Bartlett spectrum (wide Rayleigh limit lobe)
    ctx.save();
    ctx.strokeStyle = C.muted;
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const deg = -45 + (i / 120) * 90;
      const bVal = 0.55 * (Math.exp(-Math.pow((deg - th1) / 14, 2)) + Math.exp(-Math.pow((deg - th2) / 14, 2)));
      const x = ox + (i / 120) * gw, y = oy - clamp(bVal, 0.05, 0.9) * gh;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // MUSIC sharp noise-subspace null peaks
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 160; i++) {
      const deg = -45 + (i / 160) * 90;
      const null1 = Math.pow((deg - th1) / 18, 2);
      const null2 = Math.pow((deg - th2) / 18, 2);
      const denom = null1 * null2 + (1 / (8 + sharpness * 45));
      const pDb = clamp(10 * Math.log10(1 / denom) / 38, 0.05, 0.96);
      const x = ox + (i / 160) * gw, y = oy - pDb * gh;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    const resolved = sepDeg * Math.sqrt(sharpness) > 5.5;
    label(ctx, `Emitter 1 (${th1.toFixed(1)}°) & Emitter 2 (+${th2.toFixed(1)}°)`, ox + 12, py + 40, C.ok, "bold 11px monospace");
    label(ctx, "Dashed = Bartlett Diffraction Limit", ox + 12, py + 56, C.muted, "10px monospace");

    return {
      "Angular Separation": `Δθ = ${sepDeg.toFixed(1)}°`,
      "Covariance Snaps K": `${snaps}`,
      "Subspace Resolution": resolved ? "Two Distinct Peaks" : "Merged (Sub-CRLB)",
      "Peak-to-Floor": `${(14 + 6 * Math.log10(sharpness + 1)).toFixed(1)} dB`,
    };
  };

  // 56. rf_class_e_doherty_pa — AM/AM Compression + DPD Inverse + Doherty Dual-Peak PAE Curve
  R.rf_class_e_doherty_pa = function (ctx, W, H, st) {
    st.drawHUD("Doherty Power Amplifier Efficiency & Digital Predistortion (DPD)", st.spec.formula);
    const boDb = st.a * 12;                     // 0..12 dB input backoff
    const dpdOrder = Math.round(1 + st.b * 6);  // 1..7 polynomial order
    const peakBias = 0.35 + st.c * 0.35;

    const px = 18, py = 46, pw = W * 0.5, ph = H - 62;
    st.panel(px, py, pw, ph, "AM/AM Gain Compression: Raw PA + DPD Pre-Inverse = Linear Output");
    const ox = px + 34, oy = py + ph - 28, gw = pw - 52, gh = ph - 62;

    const drawCurve = (fn, col, dash) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.2;
      if (dash) ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const u = i / 60;
        const v = fn(u);
        const x = ox + u * gw, y = oy - clamp(v, 0, 1) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };
    // Raw PA compression (Rapp model)
    drawCurve((u) => (1.35 * u) / Math.pow(1 + Math.pow(1.35 * u, 4), 0.25), C.danger, false);
    // DPD predistorted inverse expansion
    drawCurve((u) => Math.min(1, u * (1 + 0.32 * Math.pow(u, 3))), C.accent, true);
    // Linearized cascade
    drawCurve((u) => u * 0.92, C.ok, false);

    label(ctx, "Raw PA Compression", ox + 8, py + 38, C.danger, "10px monospace");
    label(ctx, "DPD Inverse Expansion", ox + 8, py + 52, C.accent, "10px monospace");
    label(ctx, "Linearized Cascade", ox + 8, py + 66, C.ok, "bold 10px monospace");

    // Right panel: Doherty PAE vs Class-B PAE across backoff
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "Doherty 6-dB Backoff Efficiency Plateau vs Class-B");
    const rox = rx + 28, roy = py + ph - 28, rgw = rw - 44, rgh = ph - 62;

    // Class-B efficiency
    ctx.strokeStyle = C.muted;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const eff = 0.785 * u;
      const sx = rox + u * rgw, sy = roy - eff * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Doherty dual-peak efficiency curve
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const eff = u < peakBias
        ? 0.76 * (u / peakBias)
        : 0.76 - 0.14 * Math.sin(((u - peakBias) / (1 - peakBias)) * Math.PI);
      const sx = rox + u * rgw, sy = roy - clamp(eff, 0, 0.9) * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    label(ctx, "Doherty Dual-Peak PAE (76%)", rox + 8, py + 40, C.primary, "bold 10px monospace");

    const aclR = -(34 + dpdOrder * 3.1 + boDb * 0.6);
    return {
      "Doherty Backoff PAE": "64.8% (at -6 dB)",
      "Adjacent ACLR": `${aclR.toFixed(1)} dBc`,
      "DPD Poly Order K": `K = ${dpdOrder}`,
      "Input Backoff IBO": `-${boDb.toFixed(1)} dB`,
    };
  };

  // 57. rf_pll_fractional_n_dds — Fractional-N ΔΣ PLL Phase Noise Mask L(Δf) (dBc/Hz)
  R.rf_pll_fractional_n_dds = function (ctx, W, H, st) {
    st.drawHUD("Fractional-N ΔΣ Synthesizer & Phase Noise Mask L(Δf)", st.spec.formula);
    const fnKhz = 20 + st.a * 480;              // Loop BW 20..500 kHz
    const mashM = Math.round(1 + st.b * 3);     // MASH order 1..4
    const vcoQ = 20 + st.c * 180;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "Single-Sideband Phase Noise Spectrum L(Δf) [dBc/Hz] vs Log₁₀ Offset Frequency");
    const ox = px + 46, oy = py + ph - 30, gw = pw - 86, gh = ph - 66;

    const bwNorm = Math.log10(fnKhz) / 3.0; // ~0.4 to 0.9

    const plotComponent = (fn, col, dash, lw) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = lw || 1.8;
      if (dash) ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const db = fn(u);
        const x = ox + u * gw, y = oy - clamp((db + 150) / 90, 0.04, 0.96) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    // In-band reference + charge-pump flat plateau low-pass filtered at loop BW
    const fnRef = (u) => -96 - 40 * Math.max(0, u - bwNorm);
    // Free-running VCO 1/f^3 + 1/f^2 high-pass filtered inside loop BW
    const fnVco = (u) => -72 - (vcoQ / 12) - 55 * u + 35 * Math.max(0, bwNorm - u);
    // MASH Delta-Sigma high-pass shaped quantization noise filtered by loop pole
    const fnMash = (u) => -138 + (u - bwNorm) * (20 * mashM) - 55 * Math.max(0, u - bwNorm - 0.08);
    // Total composite phase noise
    const fnTot = (u) => 10 * Math.log10(Math.pow(10, fnRef(u) / 10) + Math.pow(10, fnVco(u) / 10) + Math.pow(10, fnMash(u) / 10));

    plotComponent(fnRef, C.primary, true, 1.5);
    plotComponent(fnVco, C.danger, true, 1.5);
    plotComponent(fnMash, C.purple, true, 1.5);
    plotComponent(fnTot, C.ok, false, 2.8);

    // Loop BW marker
    const bx = ox + clamp(bwNorm, 0.15, 0.85) * gw;
    ctx.strokeStyle = C.accent;
    ctx.beginPath(); ctx.moveTo(bx, py + 30); ctx.lineTo(bx, oy); ctx.stroke();
    label(ctx, `Loop BW f_n = ${fnKhz.toFixed(0)} kHz`, bx + 6, py + 42, C.accent, "bold 10px monospace");

    label(ctx, "In-Band N²·S_ref (Blue) | VCO 1/f² (Red) | ΔΣ MASH (Purple) | Composite L(Δf) (Green)", ox + 10, oy + 18, C.muted, "10px monospace");

    const rmsJitterFs = (180 / Math.sqrt(vcoQ * 0.25) * (1 + Math.abs(bwNorm - 0.65))).toFixed(0);
    return {
      "Loop Bandwidth f_n": `${fnKhz.toFixed(0)} kHz`,
      "ΔΣ MASH Order": `MASH-${mashM} (${20 * mashM} dB/dec)`,
      "L(100 kHz Offset)": `${fnTot(0.6).toFixed(1)} dBc/Hz`,
      "Integrated Jitter": `${rmsJitterFs} fs rms`,
    };
  };

  // 58. rf_s_param_vna_filter — VNA 2-Port Chebyshev Filter |S21| Insertion Loss & |S11| Return Loss Equiripple
  R.rf_s_param_vna_filter = function (ctx, W, H, st) {
    st.drawHUD("VNA 2-Port S-Parameters (|S₂₁|, |S₁₁|) & Chebyshev Filter", st.spec.formula);
    const orderN = Math.round(3 + st.a * 6);    // N = 3..9 poles
    const rippleDb = 0.05 + st.b * 0.95;        // 0.05..1.0 dB
    const qu = 500 + st.c * 4500;

    const eps = Math.sqrt(Math.pow(10, rippleDb / 10) - 1);
    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, `Chebyshev Coupled-Resonator Bandpass Response (Order n=${orderN}, Ripple=${rippleDb.toFixed(2)} dB)`);
    const ox = px + 44, oy = py + ph - 30, gw = pw - 84, gh = ph - 66;

    const chebT = (n, x) => {
      if (Math.abs(x) <= 1) return Math.cos(n * Math.acos(x));
      return Math.cosh(n * Math.acosh(Math.abs(x)));
    };

    const drawS = (isS21, col) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const w = -1.8 + (i / 140) * 3.6; // normalized frequency -1.8 .. +1.8
        const tn = chebT(orderN, w);
        const s21Sq = 1 / (1 + eps * eps * tn * tn);
        const s11Sq = Math.max(1e-5, 1 - s21Sq);
        const db = 10 * Math.log10(isS21 ? s21Sq : s11Sq) - (isS21 ? (1200 / qu) : 0);
        const sx = ox + (i / 140) * gw, sy = oy - clamp((db + 50) / 52, 0.02, 0.98) * gh;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.restore();
    };

    drawS(true, C.ok);      // |S21| Transmission
    drawS(false, C.danger); // |S11| Reflection zeros

    const rlPassDb = -10 * Math.log10(eps * eps / (1 + eps * eps));
    label(ctx, `|S₂₁| Insertion Loss (Green)  •  |S₁₁| Equiripple Return Loss (${orderN} Reflection Zeros, Red)`, ox + 12, py + 40, C.text, "bold 10px monospace");

    return {
      "Resonator Order n": `${orderN} poles`,
      "Passband |S₁₁| RL": `-${rlPassDb.toFixed(1)} dB`,
      "Midband |S₂₁| Loss": `-${(1200 / qu).toFixed(2)} dB`,
      "Stopband Slope": `${(6 * orderN).toFixed(0)} dB/oct`,
    };
  };

  // 59. rf_gnss_prn_correlator — GPS C/A Autocorrelation Triangle R(τ) + Early-Prompt-Late Discriminator
  R.rf_gnss_prn_correlator = function (ctx, W, H, st) {
    st.drawHUD("GPS L1 C/A Gold-Code DLL & Early–Prompt–Late Correlator", st.spec.formula);
    const spacingD = 0.2 + st.a * 0.8;          // 0.2 .. 1.0 chip E-L spacing
    const cn0 = 28 + st.b * 22;                 // dB-Hz
    const mp = st.c * 0.55;                     // specular multipath amplitude

    const px = 18, py = 46, pw = W * 0.54, ph = H - 62;
    st.panel(px, py, pw, ph, "PRN Autocorrelation Triangle R(τ) (±1 Chip) & Early / Prompt / Late Taps");
    const ox = px + 36, oy = py + ph - 30, gw = pw - 56, gh = ph - 66;

    const tri = (tau) => Math.max(0, 1 - Math.abs(tau));
    const corrFn = (tau) => tri(tau) + mp * tri(tau - 0.45);

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const tau = -1.6 + (i / 100) * 3.2;
      const rVal = corrFn(tau);
      const sx = ox + (i / 100) * gw, sy = oy - clamp(rVal / 1.35, 0, 0.96) * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Early (-d/2), Prompt (0), Late (+d/2) correlator pins
    const taps = [
      { name: "E", tau: -spacingD / 2, col: C.accent },
      { name: "P", tau: 0, col: C.ok },
      { name: "L", tau: +spacingD / 2, col: C.secondary },
    ];
    taps.forEach((t) => {
      const u = (t.tau + 1.6) / 3.2;
      const sx = ox + u * gw, sy = oy - (corrFn(t.tau) / 1.35) * gh;
      ctx.strokeStyle = t.col;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx, oy); ctx.lineTo(sx, sy); ctx.stroke();
      ctx.fillStyle = t.col;
      ctx.beginPath(); ctx.arc(sx, sy, 5.5, 0, Math.PI * 2); ctx.fill();
      label(ctx, t.name, sx, sy - 10, t.col, "bold 11px monospace", "center");
    });

    // Right panel: DLL S-Curve Discriminator D_EL(τ) = |E| - |L|
    const rx = px + pw + 12, rw = W - rx - 16;
    st.panel(rx, py, rw, ph, "DLL S-Curve Discriminator |E| − |L|");
    const rox = rx + 26, roy = py + ph * 0.56, rgw = rw - 42, rgh = ph * 0.36;

    ctx.strokeStyle = C.axis;
    ctx.beginPath(); ctx.moveTo(rox, roy); ctx.lineTo(rox + rgw, roy); ctx.stroke();

    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const tau = -1.4 + (i / 80) * 2.8;
      const disc = corrFn(tau - spacingD / 2) - corrFn(tau + spacingD / 2);
      const sx = rox + (i / 80) * rgw, sy = roy - disc * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    const mpBiasM = (mp * spacingD * 18.5).toFixed(2);
    label(ctx, `Multipath Pseudorange Bias: +${mpBiasM} m`, rx + 14, py + ph - 18, mp > 0.25 ? C.danger : C.ok, "bold 10px monospace");

    return {
      "E–L Spacing d": `${spacingD.toFixed(2)} chips`,
      "Carrier C/N₀": `${cn0.toFixed(1)} dB-Hz`,
      "Multipath Bias": `+${mpBiasM} meters`,
      "DLL Tracking": spacingD < 0.4 ? "Narrow Correlator" : "Standard 1-Chip",
    };
  };

  // 60. rf_sigma_delta_adc_nyquist — ΔΣ Noise Shaping Spectrum NTF(f) + Decimation Filter + Jitter Limit
  R.rf_sigma_delta_adc_nyquist = function (ctx, W, H, st) {
    st.drawHUD("ΔΣ Oversampling ADC Noise Shaping & Aperture Jitter Limit", st.spec.formula);
    const bits = Math.round(4 + st.a * 12);     // 4..16 bits
    const osr = Math.round(4 + st.b * 60);      // OSR 4..64
    const jitterFs = 20 + st.c * 480;           // 20..500 fs

    const snrQuant = 6.02 * bits + 1.76 + 10 * Math.log10(osr) + 14; // with ΔΣ shaping boost
    const snrJitter = -20 * Math.log10(2 * Math.PI * 0.45e9 * (jitterFs * 1e-15));
    const snrTotal = -10 * Math.log10(Math.pow(10, -snrQuant / 10) + Math.pow(10, -snrJitter / 10));
    const enob = (snrTotal - 1.76) / 6.02;

    const px = 18, py = 46, pw = W - 36, ph = H - 62;
    st.panel(px, py, pw, ph, "ΔΣ Modulator Noise Transfer Function |NTF(f)| Pushing Quantization Noise Out of Passband");
    const ox = px + 44, oy = py + ph - 30, gw = pw - 84, gh = ph - 66;

    // Passband Decimation Low-Pass Filter Box [0 .. f_s/(2*OSR)]
    const pbFrac = clamp(1 / Math.sqrt(osr), 0.14, 0.55);
    roundRect(ctx, ox, py + 32, gw * pbFrac, gh, 4, "rgba(110,231,183,0.14)", C.ok, 1.8);
    label(ctx, `Decimation Passband (OSR=${osr}x)`, ox + 8, py + 48, C.ok, "bold 10px monospace");

    // Flat Nyquist quantization noise floor vs Shaped ΔΣ (1 - z^-1)^L curve
    ctx.save();
    ctx.strokeStyle = C.muted;
    ctx.setLineDash([5, 4]);
    const flatY = oy - gh * 0.42;
    ctx.beginPath(); ctx.moveTo(ox, flatY); ctx.lineTo(ox + gw, flatY); ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, "Unshaped Nyquist Quantization Floor", ox + gw - 235, flatY - 6, C.muted, "10px monospace");

    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const shaped = 0.06 + 0.84 * Math.pow(Math.sin((u * Math.PI) / 2), 2.2);
      const sx = ox + u * gw, sy = oy - shaped * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    label(ctx, "ΔΣ High-Pass Shaped Quantization Noise |1 − z⁻¹|^L", ox + gw * 0.48, py + 54, C.danger, "bold 10px monospace");

    // Desired Signal Tone inside Passband
    const toneX = ox + gw * pbFrac * 0.45;
    arrow(ctx, toneX, oy, toneX, oy - gh * 0.88, C.primary, 3.2, 8);
    label(ctx, "Desired RF/IF Tone", toneX, oy - gh * 0.88 - 8, C.primary, "bold 10px monospace", "center");
    ctx.restore();

    return {
      "Effective ENOB": `${enob.toFixed(2)} bits`,
      "Total SNR": `${snrTotal.toFixed(1)} dB`,
      "Jitter Ceiling": `${snrJitter.toFixed(1)} dB (${jitterFs.toFixed(0)} fs)`,
      "Oversampling OSR": `${osr}x`,
    };
  };

  if (window.SelfTaughtSims && typeof window.SelfTaughtSims.registerCustomRenderers === "function") {
    window.SelfTaughtSims.registerCustomRenderers(R);
  }
})();
