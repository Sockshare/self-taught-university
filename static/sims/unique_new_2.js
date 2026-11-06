/* 60 Bespoke Interactive Canvas Simulations for Aerospace, Quantum Computing & Synthetic Biology */
(function () {
  "use strict";
  if (!window.SelfTaughtSims || !window.SelfTaughtSims.registerCustomRenderers) return;

  const R = {};

  // =========================================================================
  // 1–20: AEROSPACE ENGINEERING (20 Bespoke Simulations)
  // =========================================================================

  // 1. aero_joukowski_airfoil
  R.aero_joukowski_airfoil = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Joukowski Conformal Airfoil — Potential Streamlines, Kutta Condition & Cp(x/c)", st.spec.formula);
    const alphaDeg = -4 + st.a * 20 + (st.py - 0.5) * 6;
    const camber = 0.01 + st.b * 0.14;
    const thick = 0.06 + st.c * 0.18;
    const alpha = (alphaDeg * Math.PI) / 180;

    // Left: Wind-tunnel airfoil & streamlines
    const lx = 14, ly = 44, lw = W * 0.56 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Wind-Tunnel Streamlines & Kutta Trailing-Edge Circulation");
    const cx = lx + lw * 0.48, cy = ly + lh * 0.54;
    const chord = lw * 0.52;

    const cl = 2 * Math.PI * (alpha + camber * 1.15);
    const gamma = cl * 0.5;

    // Animated streamlines
    for (let s = -6; s <= 6; s++) {
      if (s === 0) continue;
      const y0 = s * (lh * 0.055);
      ctx.strokeStyle = s < 0 ? "rgba(103,232,249,0.55)" : "rgba(124,156,255,0.45)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const u = (i / 60) * 2 - 1; // -1..1 across box
        const xRel = u * lw * 0.46;
        const r2 = xRel * xRel + y0 * y0 + 220;
        const upwash = -gamma * 38 * (xRel / r2) + (thick * 900 * y0) / (r2 + 300);
        const camberShift = Math.exp(-(xRel * xRel) / (chord * chord * 0.35)) * (-camber * 160 - alpha * 42 * Math.sign(s));
        const px = cx + xRel;
        const py = cy + y0 + upwash + camberShift * (1 / (1 + Math.abs(s) * 0.45));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Animated tracer particles along streamline
      const phase = ((st.t * (s < 0 ? 0.48 : 0.34) + Math.abs(s) * 0.17) % 1);
      const uP = phase * 2 - 1;
      const xP = uP * lw * 0.46;
      const r2P = xP * xP + y0 * y0 + 220;
      const pyP = cy + y0 - gamma * 38 * (xP / r2P) + (thick * 900 * y0) / (r2P + 300);
      ctx.fillStyle = s < 0 ? C.accent : C.primary;
      ctx.beginPath();
      ctx.arc(cx + xP, pyP, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Joukowski Airfoil rotated by alpha
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-alpha);
    ctx.fillStyle = "rgba(124,156,255,0.28)";
    ctx.strokeStyle = C.text;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2;
      const x = 0.5 * chord * Math.cos(th);
      const env = Math.sin(th / 2);
      const yCamber = -camber * chord * Math.sin(th) * Math.sin(th);
      const yThick = thick * chord * 0.65 * Math.sin(th) * (1 - 0.45 * Math.cos(th));
      const y = yCamber + yThick * Math.pow(Math.abs(Math.sin(th * 0.5)), 0.4);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Leading edge stagnation & trailing edge Kutta arrow
    ctx.fillStyle = C.danger;
    ctx.beginPath();
    ctx.arc(-0.48 * chord, alpha * 22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.ok;
    ctx.beginPath();
    ctx.arc(0.5 * chord, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = C.muted;
    ctx.font = "10px monospace";
    ctx.fillText(`α = ${alphaDeg.toFixed(1)}°  |  Leading Stagnation (red)  |  Kutta TE (green)`, lx + 10, ly + lh - 8);

    // Right: Upper & Lower Surface Cp(x/c) plot
    const rx = W * 0.56, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Surface Pressure Distribution −Cp(x/c)");
    const gx = rx + 30, gy = ry + 28, gw = rw - 42, gh = rh - 48;
    ctx.strokeStyle = C.axis;
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh * 0.65);
    ctx.lineTo(gx + gw, gy + gh * 0.65);
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.stroke();

    // Upper surface suction (-Cp)
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const xc = i / 50;
      const cpUpper = -(1.4 * Math.sin(alpha * 2.5 + 0.15) * Math.pow(1 - xc, 0.65) / Math.sqrt(xc + 0.04) + camber * 4 * xc * (1 - xc));
      const px = gx + xc * gw;
      const py = gy + gh * 0.65 + cpUpper * gh * 0.18;
      if (i === 0) ctx.moveTo(px, Math.max(gy + 4, py));
      else ctx.lineTo(px, Math.max(gy + 4, py));
    }
    ctx.stroke();

    // Lower surface Cp
    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const xc = i / 50;
      const cpLower = 0.75 * Math.sin(alpha * 2 + 0.08) * Math.pow(1 - xc, 0.7) / Math.sqrt(xc + 0.06) - camber * 2 * xc * (1 - xc);
      const px = gx + xc * gw;
      const py = gy + gh * 0.65 + cpLower * gh * 0.18;
      if (i === 0) ctx.moveTo(px, Math.min(gy + gh - 4, py));
      else ctx.lineTo(px, Math.min(gy + gh - 4, py));
    }
    ctx.stroke();

    ctx.fillStyle = "#67e8f9";
    ctx.fillText("Upper Surface (Suction)", gx + 8, gy + 14);
    ctx.fillStyle = C.secondary;
    ctx.fillText("Lower Surface (Pressure)", gx + 8, gy + 28);
    ctx.fillStyle = C.muted;
    ctx.fillText("x/c → 1.0", gx + gw - 52, gy + gh - 4);

    return {
      "Lift Coeff C_L": cl.toFixed(3),
      "Kutta Circulation Γ": (gamma * 2.4).toFixed(3) + " m²/s",
      "Angle of Attack α": alphaDeg.toFixed(1) + "°",
      "Peak Suction −Cp_min": (1.2 + Math.abs(cl) * 1.45).toFixed(2),
    };
  };

  // 2. aero_prandtl_lifting_line
  R.aero_prandtl_lifting_line = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Prandtl Lifting-Line Theory — Horseshoe Vortices, Γ(y) & Induced Drag", st.spec.formula);
    const AR = 4 + st.a * 12;
    const taper = 0.2 + st.b * 0.8;
    const cl = 0.3 + st.c * 1.2;
    const eSpan = 0.99 - Math.pow(taper - 0.45, 2) * 0.38 - 0.004 * AR;
    const cdi = (cl * cl) / (Math.PI * AR * Math.max(0.5, eSpan));

    // Left: 3D Finite Wing Planform + Wingtip Vortex Spirals
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Finite Wing Planform & Trailing Wingtip Horseshoe Vortices");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.36;
    const spanPx = Math.min(lw * 0.82, 95 + AR * 9.5);
    const rootChord = Math.max(18, (spanPx / AR) * 1.35);
    const tipChord = rootChord * taper;

    // Wing planform polygon
    ctx.fillStyle = "rgba(124,156,255,0.28)";
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - rootChord * 0.5);
    ctx.lineTo(cx + spanPx * 0.5, cy - tipChord * 0.35);
    ctx.lineTo(cx + spanPx * 0.5, cy + tipChord * 0.65);
    ctx.lineTo(cx, cy + rootChord * 0.5);
    ctx.lineTo(cx - spanPx * 0.5, cy + tipChord * 0.65);
    ctx.lineTo(cx - spanPx * 0.5, cy - tipChord * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Quarter-chord bound vortex line
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cx - spanPx * 0.5, cy);
    ctx.lineTo(cx + spanPx * 0.5, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Trailing horseshoe vortex sheet + wingtip spiral cores
    for (const side of [-1, 1]) {
      const tipX = cx + side * spanPx * 0.5;
      ctx.strokeStyle = side > 0 ? C.secondary : "#67e8f9";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let k = 0; k <= 60; k++) {
        const u = k / 60;
        const rad = (4 + u * 18) * (cl * 0.75);
        const ang = u * 14 - st.t * 5 * side;
        const vx = tipX + Math.cos(ang) * rad;
        const vy = cy + tipChord * 0.5 + u * (lh * 0.5) + Math.sin(ang) * rad * 0.38;
        if (k === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }

    // Downwash arrows across span
    for (let i = -5; i <= 5; i++) {
      const eta = i / 5.5;
      const wx = cx + eta * spanPx * 0.5;
      const wiLen = 12 + cl * 16 * (1 + 0.5 * Math.pow(eta, 2) * Math.abs(taper - 0.45));
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(wx, cy + rootChord * 0.55);
      ctx.lineTo(wx, cy + rootChord * 0.55 + wiLen);
      ctx.stroke();
    }
    ctx.fillStyle = C.muted;
    ctx.font = "10px monospace";
    ctx.fillText(`AR = ${AR.toFixed(1)}  |  Taper λ = ${taper.toFixed(2)}  |  Green: Downwash w_i(y)`, lx + 10, ly + lh - 8);

    // Right: Spanwise Circulation Γ(y) vs Elliptical Ideal
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Spanwise Circulation Γ(y/b) vs Elliptical Ideal");
    const gx = rx + 26, gy = ry + 30, gw = rw - 40, gh = rh - 52;
    ctx.strokeStyle = C.axis;
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh);
    ctx.moveTo(gx + gw * 0.5, gy);
    ctx.lineTo(gx + gw * 0.5, gy + gh);
    ctx.stroke();

    // Elliptical ideal (dashed)
    ctx.strokeStyle = "rgba(255,209,102,0.7)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const eta = (i / 60) * 2 - 1;
      const gEllip = Math.sqrt(Math.max(0, 1 - eta * eta));
      const px = gx + ((eta + 1) * 0.5) * gw;
      const py = gy + gh - gEllip * gh * 0.82 * (cl / 1.5);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Actual circulation distribution
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const eta = (i / 60) * 2 - 1;
      const th = Math.acos(Math.max(-1, Math.min(1, eta)));
      const a3 = (taper - 0.45) * 0.28;
      const gActual = Math.sin(th) + a3 * Math.sin(3 * th);
      const px = gx + ((eta + 1) * 0.5) * gw;
      const py = gy + gh - Math.max(0, gActual) * gh * 0.82 * (cl / 1.5);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = C.primary;
    ctx.fillText("Actual Wing Γ(y)", gx + 8, gy + 14);
    ctx.fillStyle = C.accent;
    ctx.fillText("Elliptical Ideal (e = 1.0)", gx + 8, gy + 28);

    return {
      "Oswald Factor e": eSpan.toFixed(3),
      "Induced Drag C_Di": cdi.toFixed(4),
      "Aspect Ratio AR": AR.toFixed(1),
      "Downwash Angle α_i": ((cl / (Math.PI * AR * eSpan)) * (180 / Math.PI)).toFixed(2) + "°",
    };
  };

  // 3. aero_oblique_shock_theta_beta
  R.aero_oblique_shock_theta_beta = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Supersonic Oblique Shock θ–β–M & Prandtl–Meyer Expansion Fan", st.spec.formula);
    const M1 = 1.35 + st.a * 3.65;
    const thetaDeg = 3 + st.b * 34;
    const gamma = 1.3 + st.c * 0.36;

    // Helper for theta(beta, M1)
    function thetaFromBeta(betaRad) {
      const s = Math.sin(betaRad);
      if (M1 * s <= 1.0001) return 0;
      const num = 2 * (1 / Math.tan(betaRad)) * (M1 * M1 * s * s - 1);
      const den = M1 * M1 * (gamma + Math.cos(2 * betaRad)) + 2;
      return Math.atan(num / den);
    }

    const mu = Math.asin(1 / M1);
    let thetaMax = 0, betaAtMax = mu;
    let betaWeak = mu;
    const thetaRad = (thetaDeg * Math.PI) / 180;
    for (let i = 1; i <= 120; i++) {
      const bRad = mu + (i / 120) * (Math.PI / 2 - mu);
      const th = thetaFromBeta(bRad);
      if (th > thetaMax) {
        thetaMax = th;
        betaAtMax = bRad;
      }
      if (bRad <= betaAtMax && Math.abs(th - thetaRad) < 0.025) {
        betaWeak = bRad;
      }
    }
    const detached = thetaRad > thetaMax;
    const Mn1 = M1 * Math.sin(detached ? Math.PI / 2 : betaWeak);
    const Mn2 = Math.sqrt((1 + 0.5 * (gamma - 1) * Mn1 * Mn1) / (gamma * Mn1 * Mn1 - 0.5 * (gamma - 1)));
    const M2 = detached ? Mn2 : Mn2 / Math.sin(Math.max(0.08, betaWeak - thetaRad));

    // Left: Supersonic Wedge + Shock + Prandtl-Meyer Corner
    const lx = 14, ly = 44, lw = W * 0.53 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, detached ? "DETACHED BOW SHOCK (θ > θ_max)" : "Attached Oblique Shock & Expansion Fan");
    const apexX = lx + lw * 0.34, apexY = ly + lh * 0.68;
    const shoulderX = apexX + lw * 0.34;
    const shoulderY = apexY - lw * 0.34 * Math.tan(Math.min(0.65, thetaRad));

    // Wedge body
    ctx.fillStyle = "rgba(154,163,199,0.28)";
    ctx.strokeStyle = C.text;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(shoulderX, shoulderY);
    ctx.lineTo(lx + lw - 12, shoulderY);
    ctx.lineTo(lx + lw - 12, apexY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shock wave
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (detached) {
      for (let i = -30; i <= 30; i++) {
        const sy = apexY + (i / 30) * (lh * 0.45);
        const sx = apexX - 18 + Math.pow(i / 30, 2) * 85;
        if (i === -30) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
    } else {
      ctx.moveTo(apexX, apexY);
      ctx.lineTo(apexX + lw * 0.55 * Math.cos(betaWeak), apexY - lw * 0.55 * Math.sin(betaWeak));
    }
    ctx.stroke();

    // Prandtl-Meyer expansion fan rays at shoulder
    if (!detached) {
      for (let f = 0; f < 6; f++) {
        const fanAng = betaWeak - thetaRad * 0.5 + f * 0.08;
        ctx.strokeStyle = "rgba(110,231,183,0.45)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(shoulderX + 85 * Math.cos(fanAng), shoulderY - 85 * Math.sin(fanAng));
        ctx.stroke();
      }
    }

    // Supersonic streamlines bending across shock
    for (let s = 1; s <= 5; s++) {
      const sy = apexY - s * 22;
      const hitX = detached ? apexX - 14 : apexX + (apexY - sy) / Math.tan(betaWeak);
      ctx.strokeStyle = "#67e8f9";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(lx + 10, sy);
      ctx.lineTo(Math.min(lx + lw - 14, hitX), sy);
      if (hitX < shoulderX) {
        const len2 = Math.max(0, shoulderX - hitX);
        ctx.lineTo(hitX + len2, sy - len2 * Math.tan(Math.min(0.55, thetaRad)));
      }
      ctx.stroke();
    }

    // Right: θ-β-M Polar Diagram
    const rx = W * 0.53, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Oblique Shock θ–β–M Polar Diagram");
    const gx = rx + 28, gy = ry + 26, gw = rw - 42, gh = rh - 44;
    ctx.strokeStyle = C.axis;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh);
    ctx.stroke();

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const bDeg = (mu * 180) / Math.PI + (i / 90) * (90 - (mu * 180) / Math.PI);
      const thDeg = (thetaFromBeta((bDeg * Math.PI) / 180) * 180) / Math.PI;
      const px = gx + (thDeg / 45) * gw;
      const py = gy + gh - (bDeg / 90) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Operating point
    const opX = gx + (thetaDeg / 45) * gw;
    const opY = gy + gh - (((detached ? 90 : (betaWeak * 180) / Math.PI)) / 90) * gh;
    ctx.fillStyle = detached ? C.danger : C.ok;
    ctx.beginPath();
    ctx.arc(Math.min(gx + gw - 4, opX), opY, 5, 0, Math.PI * 2);
    ctx.fill();

    return {
      "Upstream Mach M₁": M1.toFixed(2),
      "Shock Angle β": detached ? "90.0° (Detached)" : ((betaWeak * 180) / Math.PI).toFixed(1) + "°",
      "Downstream Mach M₂": M2.toFixed(2),
      "Max Deflection θ_max": ((thetaMax * 180) / Math.PI).toFixed(1) + "°",
    };
  };

  // 4. aero_de_laval_nozzle
  R.aero_de_laval_nozzle = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("De Laval Rocket Nozzle — Converging-Diverging Contour & Normal Shock", st.spec.formula);
    const eps = 1.8 + st.a * 6.2;
    const paPc = 0.02 + st.b * 0.85;
    const Tc = 2200 + st.c * 1600;

    // Shock location if over-expanded
    const shockInside = paPc > 0.28 && paPc < 0.78;
    const subsonicAll = paPc >= 0.78;
    const shockXNorm = shockInside ? 0.45 + (0.78 - paPc) * 0.95 : 1.2;

    // Left: Converging-Diverging Nozzle Cutaway with Mach Heatmap
    const lx = 14, ly = 44, lw = W * 0.55 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Converging–Diverging Rocket Nozzle Contour & Mach Field");
    const cy = ly + lh * 0.52;
    const xStart = lx + 18, xEnd = lx + lw - 24, nLen = xEnd - xStart;

    function nozzleHalfH(u) {
      // throat at u = 0.35
      if (u < 0.35) {
        return 22 + 28 * Math.pow((0.35 - u) / 0.35, 1.5);
      }
      const s = (u - 0.35) / 0.65;
      return 22 + (Math.sqrt(eps) - 1) * 18 * Math.sin(s * Math.PI * 0.5);
    }

    function machAt(u) {
      if (subsonicAll) return 0.25 + 0.55 * Math.exp(-Math.pow((u - 0.35) / 0.22, 2));
      if (u <= 0.35) return 0.2 + 0.8 * (u / 0.35);
      if (u < shockXNorm) return 1.0 + (u - 0.35) * (1.2 + Math.sqrt(eps) * 0.85);
      return 0.45 - (u - shockXNorm) * 0.25;
    }

    // Color bands inside nozzle
    for (let i = 0; i < 65; i++) {
      const u = i / 65;
      const px = xStart + u * nLen;
      const hh = nozzleHalfH(u);
      const M = machAt(u);
      const hue = Math.max(0, 220 - M * 65);
      ctx.fillStyle = `hsla(${hue}, 85%, 54%, 0.52)`;
      ctx.fillRect(px, cy - hh, nLen / 65 + 1, hh * 2);
    }

    // Nozzle walls
    ctx.strokeStyle = C.text;
    ctx.lineWidth = 2.5;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      for (let i = 0; i <= 65; i++) {
        const u = i / 65;
        const px = xStart + u * nLen;
        const py = cy + dir * nozzleHalfH(u);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Sonic throat line M=1
    const throatX = xStart + 0.35 * nLen;
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(throatX, cy - 24);
    ctx.lineTo(throatX, cy + 24);
    ctx.stroke();
    ctx.setLineDash([]);

    // Normal shock line if inside nozzle
    if (shockInside) {
      const sx = xStart + shockXNorm * nLen;
      const sh = nozzleHalfH(shockXNorm);
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx, cy - sh);
      ctx.lineTo(sx, cy + sh);
      ctx.stroke();
    }

    // Right: M(x) and P(x)/P_c curves
    const rx = W * 0.55, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Axial Mach Number M(x) & Pressure Ratio P(x)/P_c");
    const gx = rx + 26, gy = ry + 28, gw = rw - 40, gh = rh - 48;

    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const M = machAt(u);
      const px = gx + u * gw;
      const py = gy + gh - (M / 4.0) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const M = machAt(u);
      const pRatio = Math.pow(1 + 0.2 * M * M, -3.5);
      const px = gx + u * gw;
      const py = gy + gh - pRatio * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const mExit = machAt(1.0);
    return {
      "Exit Mach M_e": mExit.toFixed(2),
      "Expansion Ratio ε": eps.toFixed(2),
      "Flow Regime": subsonicAll ? "Subsonic Venturi" : (shockInside ? "Normal Shock Inside" : "Supersonic Exhaust"),
      "Exhaust Vel v_e": Math.round(mExit * Math.sqrt(1.4 * 350 * Tc / (1 + 0.2 * mExit * mExit))) + " m/s",
    };
  };

  // 5. aero_tsiolkovsky_staging
  R.aero_tsiolkovsky_staging = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Multistage Tsiolkovsky Δv Budget & Gravity-Turn Ascent Profile", st.spec.formula);
    const isp2 = 310 + st.a * 155;
    const zeta = 0.72 + st.b * 0.21;
    const kickDeg = 1.5 + st.c * 8.5;

    const g0 = 9.80665;
    const dv1 = 305 * g0 * Math.log(1 / (1 - zeta * 0.74));
    const dv2 = isp2 * g0 * Math.log(1 / (1 - zeta * 0.88));
    const gravLoss = 1150 + Math.abs(kickDeg - 4.2) * 115;
    const netDv = dv1 + dv2 - gravLoss;

    // Left: Two-stage rocket stack with mass fraction bars
    const lx = 14, ly = 44, lw = W * 0.42 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "2-Stage Launch Vehicle Stack");
    const rxC = lx + lw * 0.36;
    const stage1H = lh * 0.42, stage2H = lh * 0.24, fairingH = lh * 0.14;
    const botY = ly + lh - 22;

    // Stage 1
    ctx.strokeStyle = C.text;
    ctx.fillStyle = "rgba(124,156,255,0.22)";
    ctx.fillRect(rxC - 22, botY - stage1H, 44, stage1H);
    ctx.fillStyle = "rgba(103,232,249,0.55)";
    ctx.fillRect(rxC - 20, botY - stage1H * zeta, 40, stage1H * zeta);
    ctx.strokeRect(rxC - 22, botY - stage1H, 44, stage1H);

    // Stage 2
    const s2Bot = botY - stage1H - 4;
    ctx.fillStyle = "rgba(255,143,171,0.22)";
    ctx.fillRect(rxC - 18, s2Bot - stage2H, 36, stage2H);
    ctx.fillStyle = "rgba(255,209,102,0.6)";
    ctx.fillRect(rxC - 16, s2Bot - stage2H * zeta, 32, stage2H * zeta);
    ctx.strokeRect(rxC - 18, s2Bot - stage2H, 36, stage2H);

    // Payload Fairing
    ctx.beginPath();
    ctx.moveTo(rxC - 18, s2Bot - stage2H);
    ctx.lineTo(rxC, s2Bot - stage2H - fairingH);
    ctx.lineTo(rxC + 18, s2Bot - stage2H);
    ctx.closePath();
    ctx.fillStyle = "rgba(110,231,183,0.45)";
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = C.text;
    ctx.font = "10px monospace";
    ctx.fillText(`S1 Δv: ${(dv1 / 1000).toFixed(2)} km/s`, rxC + 28, botY - stage1H * 0.5);
    ctx.fillText(`S2 Δv: ${(dv2 / 1000).toFixed(2)} km/s`, rxC + 28, s2Bot - stage2H * 0.5);

    // Right: Gravity-Turn Altitude vs Downrange Ascent Curve
    const gx = W * 0.42, gy = 44, gw = W - gx - 14, gh = H - 56;
    st.panel(gx, gy, gw, gh, "Gravity-Turn Ascent Trajectory: Altitude h(x) & MECO Separation");
    const px0 = gx + 28, py0 = gy + gh - 24, pw = gw - 44, ph = gh - 48;

    // Earth atmosphere bands
    ctx.fillStyle = "rgba(103,232,249,0.08)";
    ctx.fillRect(px0, py0 - ph * 0.35, pw, ph * 0.35);

    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const x = px0 + u * pw;
      const altNorm = Math.min(0.95, Math.pow(u, 0.58) * (1.1 - kickDeg * 0.04));
      const y = py0 - altNorm * ph;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // MECO marker at u = 0.36
    const mecoX = px0 + 0.36 * pw;
    const mecoY = py0 - Math.pow(0.36, 0.58) * (1.1 - kickDeg * 0.04) * ph;
    ctx.fillStyle = C.secondary;
    ctx.beginPath();
    ctx.arc(mecoX, mecoY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("MECO / Stage Sep", mecoX + 8, mecoY + 4);

    return {
      "Ideal Rocket Δv": ((dv1 + dv2) / 1000).toFixed(2) + " km/s",
      "Gravity/Drag Loss": (gravLoss / 1000).toFixed(2) + " km/s",
      "Net Orbital Velocity": (netDv / 1000).toFixed(2) + " km/s",
      "Orbit Insertion": netDv >= 7800 ? "LEO Achieved ✓" : "Suborbital Shortfall",
    };
  };

  // 6. aero_hohmann_bielliptic
  R.aero_hohmann_bielliptic = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Hohmann vs Bi-Elliptic Orbital Transfer & Lambert Δv Comparison", st.spec.formula);
    const Rratio = 2.0 + st.a * 16.0;
    const RbRatio = Rratio * (1.2 + st.b * 2.2);
    const incDeg = st.c * 30;

    // Normalized Hohmann Δv / v1
    const dvH1 = Math.sqrt((2 * Rratio) / (1 + Rratio)) - 1;
    const dvH2 = Math.sqrt(1 / Rratio) * (1 - Math.sqrt(2 / (1 + Rratio)));
    const dvHohmann = dvH1 + dvH2 + 2 * Math.sqrt(1 / Rratio) * Math.sin((incDeg * Math.PI) / 360);

    // Normalized Bi-Elliptic Δv / v1
    const dvB1 = Math.sqrt((2 * RbRatio) / (1 + RbRatio)) - 1;
    const dvB2 = Math.sqrt(2 / (RbRatio * (1 + RbRatio / Rratio))) - Math.sqrt(2 / (RbRatio * (1 + RbRatio)));
    const dvB3 = Math.sqrt(2 / (Rratio * (1 + Rratio / RbRatio))) - Math.sqrt(1 / Rratio);
    const dvBi = dvB1 + Math.abs(dvB2) + Math.abs(dvB3);

    // Left: Orbital Transfer Geometry
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Inner r₁, Target r₂, Hohmann (Gold) & Bi-Elliptic (Cyan)");
    const cx = lx + lw * 0.42, cy = ly + lh * 0.52;
    const r1Px = 18;
    const r2Px = Math.min(lw * 0.34, r1Px * Math.pow(Rratio, 0.58));
    const rbPx = Math.min(lw * 0.52, r2Px * (1.15 + st.b * 0.45));

    // Inner & Outer circular orbits
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r1Px, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r2Px, 0, Math.PI * 2);
    ctx.stroke();

    // Hohmann transfer half-ellipse
    const aH = (r1Px + r2Px) * 0.5;
    const bH = Math.sqrt(r1Px * r2Px);
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(cx + (r2Px - r1Px) * 0.5, cy, aH, bH, 0, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Bi-elliptic transfer arcs
    const aB1 = (r1Px + rbPx) * 0.5;
    const bB1 = Math.sqrt(r1Px * rbPx);
    ctx.strokeStyle = "#67e8f9";
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx + (rbPx - r1Px) * 0.5, cy, aB1, bB1, 0, 0, Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Central body
    ctx.fillStyle = C.primary;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Right: Δv Comparison & Porkchop Synodic Window
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Δv/v₁ vs Radius Ratio r₂/r₁ (Crossover at 11.94)");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 50;

    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 1; i <= 50; i++) {
      const rr = 1.5 + (i / 50) * 18.5;
      const dvh = Math.sqrt((2 * rr) / (1 + rr)) - 1 + Math.sqrt(1 / rr) * (1 - Math.sqrt(2 / (1 + rr)));
      const px = gx + ((rr - 1.5) / 18.5) * gw;
      const py = gy + gh - (dvh / 0.7) * gh;
      if (i === 1) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 1; i <= 50; i++) {
      const rr = 1.5 + (i / 50) * 18.5;
      const rbr = rr * 2.8;
      const dvb = Math.sqrt((2 * rbr) / (1 + rbr)) - 1 + Math.abs(Math.sqrt(2 / (rbr * (1 + rbr / rr))) - Math.sqrt(2 / (rbr * (1 + rbr)))) + Math.abs(Math.sqrt(2 / (rr * (1 + rr / rbr))) - Math.sqrt(1 / rr));
      const px = gx + ((rr - 1.5) / 18.5) * gw;
      const py = gy + gh - (dvb / 0.7) * gh;
      if (i === 1) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Radius Ratio r₂/r₁": Rratio.toFixed(2),
      "Hohmann Total Δv/v₁": dvHohmann.toFixed(3),
      "Bi-Elliptic Δv/v₁": dvBi.toFixed(3),
      "Optimal Strategy": dvBi < dvHohmann ? "Bi-Elliptic Wins" : "Hohmann Wins",
    };
  };

  // 7. aero_cr3bp_lagrange
  R.aero_cr3bp_lagrange = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("CR3BP Rotating Frame — Lagrange Points L₁–L₅, Roche Zero-Velocity & Halo Orbit", st.spec.formula);
    const mu = 0.012 + st.a * 0.18;
    const cj = 2.95 + st.b * 0.45;
    const zAmp = 0.05 + st.c * 0.35;

    const lx = 14, ly = 44, lw = W * 0.58 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Rotating Synodic Frame & Zero-Velocity Jacobi Contours");
    const cx = lx + lw * 0.48, cy = ly + lh * 0.52, sc = Math.min(lw, lh) * 0.34;

    // Zero-velocity forbidden zone shading
    for (let ix = -22; ix <= 22; ix++) {
      for (let iy = -16; iy <= 16; iy++) {
        const x = ix / 14, y = iy / 14;
        const r1 = Math.hypot(x + mu, y) + 0.04;
        const r2 = Math.hypot(x - (1 - mu), y) + 0.04;
        const omega = (x * x + y * y) + (2 * (1 - mu)) / r1 + (2 * mu) / r2;
        if (omega < cj) {
          ctx.fillStyle = "rgba(255,107,107,0.16)";
          ctx.fillRect(cx + x * sc - 4, cy + y * sc - 4, 8, 8);
        }
      }
    }

    // Primary m1 & Secondary m2
    ctx.fillStyle = C.primary;
    ctx.beginPath();
    ctx.arc(cx - mu * sc, cy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.arc(cx + (1 - mu) * sc, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    // L1..L5 markers
    const gammaL = Math.pow(mu / 3, 1 / 3);
    const pts = [
      { name: "L₁", x: 1 - mu - gammaL, y: 0 },
      { name: "L₂", x: 1 - mu + gammaL, y: 0 },
      { name: "L₃", x: -(1 + (5 / 12) * mu), y: 0 },
      { name: "L₄", x: 0.5 - mu, y: -0.866 },
      { name: "L₅", x: 0.5 - mu, y: 0.866 },
    ];
    pts.forEach((p) => {
      const px = cx + p.x * sc, py = cy + p.y * sc;
      ctx.strokeStyle = C.accent;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = C.accent;
      ctx.font = "10px monospace";
      ctx.fillText(p.name, px + 6, py - 4);
    });

    // Animated Halo orbit around L2
    const l2x = cx + (1 - mu + gammaL) * sc;
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const th = (i / 50) * Math.PI * 2;
      ctx.lineTo(l2x + Math.cos(th) * 14, cy + Math.sin(th) * (20 + zAmp * 28));
    }
    ctx.stroke();

    // Right: 3D Halo X-Z Projection
    const rx = W * 0.58, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Out-of-Plane NRHO / Halo Orbit (X–Z View)");
    const hcx = rx + rw * 0.5, hcy = ry + rh * 0.55;
    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const th = (i / 80) * Math.PI * 2;
      const hx = hcx + Math.sin(th) * rw * 0.28;
      const hz = hcy - Math.cos(th) * (rh * 0.15 + zAmp * rh * 0.6) + Math.cos(2 * th) * 12;
      if (i === 0) ctx.moveTo(hx, hz);
      else ctx.lineTo(hx, hz);
    }
    ctx.stroke();

    return {
      "Mass Parameter μ": mu.toFixed(4),
      "Jacobi Constant C_J": cj.toFixed(3),
      "Hill Sphere r_H": gammaL.toFixed(3) + " LU",
      "Halo Z-Amplitude": (zAmp * 384400 * 0.18).toFixed(0) + " km",
    };
  };

  // 8. aero_clohessy_wiltshire
  R.aero_clohessy_wiltshire = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Clohessy–Wiltshire Hill Frame — V-Bar & R-Bar Proximity Rendezvous", st.spec.formula);
    const x0 = -120 + st.a * 240; // radial R-bar
    const y0 = -350 + st.b * 300; // in-track V-bar
    const dvBurn = 0.1 + st.c * 1.4;
    const n = 0.0011; // LEO mean motion rad/s

    const lx = 14, ly = 44, lw = W * 0.62 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "LVLH Rotating Frame: In-Track V-Bar (Horizontal) vs Radial R-Bar (Vertical)");
    const tx = lx + lw * 0.72, ty = ly + lh * 0.52;

    // Docking approach corridor cone
    ctx.fillStyle = "rgba(110,231,183,0.1)";
    ctx.strokeStyle = "rgba(110,231,183,0.4)";
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(lx + 16, ty - 75);
    ctx.lineTo(lx + 16, ty + 75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Target station at origin
    ctx.fillStyle = C.accent;
    ctx.fillRect(tx - 6, ty - 6, 12, 12);
    ctx.fillText("ISS Target (0,0)", tx - 38, ty - 12);

    // CW relative trajectory (2:1 drifting cycloid / football orbit)
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const nt = (i / 90) * Math.PI * 2;
      const xRel = x0 * (4 - 3 * Math.cos(nt)) + (dvBurn * 45) * Math.sin(nt);
      const yRel = y0 * (1 - i / 90) - 6 * x0 * (nt - Math.sin(nt)) * 0.12 + (dvBurn * 90) * (1 - Math.cos(nt));
      const px = tx + yRel * 0.65;
      const py = ty - xRel * 0.45;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Right: Range & Closing Rate Profile
    const rx = W * 0.62, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Phase-Space Closing Velocity vs Range");
    const gx = rx + 24, gy = ry + 32, gw = rw - 38, gh = rh - 50;
    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      const px = gx + (1 - u) * gw;
      const py = gy + gh - Math.sqrt(1 - u) * gh * 0.78 * (dvBurn / 1.5);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const rangeM = Math.hypot(x0, y0);
    return {
      "Initial Range ||r₀||": rangeM.toFixed(1) + " m",
      "Radial Offset x₀": x0.toFixed(1) + " m",
      "In-Track Offset y₀": y0.toFixed(1) + " m",
      "Corridor Status": Math.abs(x0) < Math.abs(y0) * 0.45 ? "Inside Safe Cone ✓" : "Corridor Violation",
    };
  };

  // 9. aero_quaternion_reaction_wheel
  R.aero_quaternion_reaction_wheel = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Quaternion Attitude Control & 3-Axis Reaction Wheel Momentum Exchange", st.spec.formula);
    const kp = 0.5 + st.a * 4.5;
    const kd = 0.2 + st.b * 3.0;
    const gg = st.c * 1.5;

    const wn = Math.sqrt(kp);
    const zeta = kd / (2 * wn);
    const angle = Math.exp(-zeta * wn * ((st.t % 6) * 0.8)) * Math.cos(wn * Math.sqrt(Math.max(0.05, 1 - zeta * zeta)) * ((st.t % 6) * 1.8)) * 0.75 + (st.px - 0.5) * 0.6;
    const q0 = Math.cos(angle * 0.5);
    const q1 = Math.sin(angle * 0.5) * 0.8;
    const q2 = Math.sin(angle * 0.5) * 0.45;
    const q3 = Math.sin(angle * 0.5) * 0.39;

    // Left: Satellite bus + 3 Orthogonal Reaction Wheels
    const lx = 14, ly = 44, lw = W * 0.52 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "3-Axis Spacecraft Bus & Reaction Wheel Triad (h_w)");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    // Solar panels
    ctx.fillStyle = "rgba(124,156,255,0.35)";
    ctx.strokeStyle = C.primary;
    ctx.fillRect(-105, -10, 62, 20);
    ctx.strokeRect(-105, -10, 62, 20);
    ctx.fillRect(43, -10, 62, 20);
    ctx.strokeRect(43, -10, 62, 20);
    // Bus cube
    ctx.fillStyle = "#1e2642";
    ctx.strokeStyle = C.text;
    ctx.lineWidth = 2;
    ctx.fillRect(-34, -34, 68, 68);
    ctx.strokeRect(-34, -34, 68, 68);
    // 3 spinning reaction wheels inside bus
    const rwCols = [C.secondary, "#67e8f9", C.accent];
    [[-14, -12], [14, -12], [0, 14]].forEach(([wx, wy], idx) => {
      ctx.strokeStyle = rwCols[idx];
      ctx.beginPath();
      ctx.arc(wx, wy, 11, 0, Math.PI * 2);
      ctx.stroke();
      const sp = st.t * (6 + kp * 2) * (idx === 1 ? -1 : 1);
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx + Math.cos(sp) * 11, wy + Math.sin(sp) * 11);
      ctx.stroke();
    });
    ctx.restore();

    // Right: Quaternion Components (q0, q1, q2, q3) & Wheel Saturation
    const rx = W * 0.52, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Quaternion Components q(t) & Momentum Saturation");
    const qVals = [
      { k: "q₀ (scalar)", v: q0, col: C.ok },
      { k: "q₁ (roll)", v: q1, col: C.secondary },
      { k: "q₂ (pitch)", v: q2, col: "#67e8f9" },
      { k: "q₃ (yaw)", v: q3, col: C.accent },
    ];
    qVals.forEach((it, idx) => {
      const by = ry + 34 + idx * 34;
      ctx.fillStyle = C.text;
      ctx.font = "11px monospace";
      ctx.fillText(`${it.k}: ${it.v.toFixed(3)}`, rx + 14, by);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(rx + 125, by - 10, rw - 140, 13);
      ctx.fillStyle = it.col;
      ctx.fillRect(rx + 125 + (rw - 140) * 0.5, by - 10, it.v * (rw - 140) * 0.48, 13);
    });

    const hSat = Math.min(100, (kp * 12 + gg * 38));
    return {
      "Scalar Quaternion q₀": q0.toFixed(4),
      "Damping Ratio ζ": zeta.toFixed(2),
      "Pointing Error θ_e": (Math.abs(angle) * (180 / Math.PI)).toFixed(2) + "°",
      "RW Momentum Load": hSat.toFixed(1) + "%",
    };
  };

  // 10. aero_reentry_allen_eggers
  R.aero_reentry_allen_eggers = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Atmospheric Re-Entry — Allen–Eggers Deceleration & Stagnation Heating", st.spec.formula);
    const Ve = 7.2 + st.a * 4.0; // km/s
    const gammaDeg = 1.5 + st.b * 8.5;
    const Rn = 0.4 + st.c * 3.6; // nose radius m

    const gammaRad = (gammaDeg * Math.PI) / 180;
    const gMax = (Ve * Ve * 1e6 * Math.sin(gammaRad)) / (2 * Math.E * 8500 * 9.81);
    const qPeak = 185 * Math.pow(Ve / 7.9, 3.15) * Math.sqrt(Math.sin(gammaRad) / Rn);

    // Left: Blunt Capsule in Plasma Bow Shock
    const lx = 14, ly = 44, lw = W * 0.46 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Blunt-Body TPS Bow Shock & Plasma Sheath");
    const cx = lx + lw * 0.52, cy = ly + lh * 0.52;

    // Glowing plasma shock layer
    const grad = ctx.createRadialGradient(cx - 18, cy, 8, cx - 10, cy, 78);
    grad.addColorStop(0, "rgba(255,209,102,0.95)");
    grad.addColorStop(0.45, "rgba(255,107,107,0.65)");
    grad.addColorStop(1, "rgba(255,107,107,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx - 12, cy, 76, 0, Math.PI * 2);
    ctx.fill();

    // Blunt heatshield capsule
    const capR = 24 + Rn * 6;
    ctx.fillStyle = "#252b48";
    ctx.strokeStyle = C.text;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx + 8, cy, capR, Math.PI * 0.65, Math.PI * 1.35);
    ctx.lineTo(cx + 46, cy - 16);
    ctx.lineTo(cx + 46, cy + 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right: Altitude vs Velocity, G-load & Heat Flux Curves
    const rx = W * 0.46, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Altitude vs Velocity V(h), Deceleration a(h) & Heating q̇(h)");
    const gx = rx + 28, gy = ry + 28, gw = rw - 44, gh = rh - 48;

    // Velocity profile (cyan) & Heat flux (orange-red)
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const hNorm = i / 60; // 0 = ground, 1 = 120km
      const rhoRatio = Math.exp(-hNorm * 8.5);
      const vRatio = Math.exp(-0.45 * rhoRatio / Math.sin(gammaRad));
      const px = gx + vRatio * gw;
      const py = gy + (1 - hNorm) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const hNorm = i / 60;
      const rhoRatio = Math.exp(-hNorm * 8.5);
      const vRatio = Math.exp(-0.45 * rhoRatio / Math.sin(gammaRad));
      const qNorm = Math.min(1, 3.8 * Math.sqrt(rhoRatio) * Math.pow(vRatio, 3));
      const px = gx + qNorm * gw;
      const py = gy + (1 - hNorm) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Peak Deceleration": gMax.toFixed(1) + " g",
      "Peak Heat Flux q̇_max": qPeak.toFixed(0) + " W/cm²",
      "Entry Corridor γ_E": "-" + gammaDeg.toFixed(1) + "°",
      "Nose Radius R_n": Rn.toFixed(2) + " m",
    };
  };

  // 11. aero_brayton_turbofan
  R.aero_brayton_turbofan = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("High-Bypass Turbofan Engine Cutaway & Brayton T–s Thermodynamic Cycle", st.spec.formula);
    const B = 2 + st.a * 10;
    const OPR = 15 + st.b * 35;
    const Tt4 = 1350 + st.c * 550;

    const etaTh = 1 - Math.pow(OPR, -0.286);
    const tsfc = 19.5 / (1 + 0.12 * B) / Math.sqrt(etaTh);

    // Left: Turbofan Engine Spool Cutaway
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "High-Bypass Turbofan (Fan, HPC, Combustor, HPT/LPT)");
    const cy = ly + lh * 0.54, x0 = lx + 20, ew = lw - 40;
    const fanR = Math.min(lh * 0.38, 34 + B * 2.4);

    // Nacelle bypass duct
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x0, cy - fanR, ew * 0.65, fanR * 2);

    // Core gas generator stages
    const stages = [
      { name: "FAN", w: 0.14, r: fanR, col: "#67e8f9" },
      { name: "HPC", w: 0.24, r: 22, col: C.primary },
      { name: "COMB", w: 0.18, r: 20, col: C.danger },
      { name: "TURB", w: 0.22, r: 24, col: C.accent },
      { name: "NOZ", w: 0.22, r: 18, col: C.secondary },
    ];
    let curX = x0;
    stages.forEach((sg) => {
      const sw = sg.w * ew;
      ctx.fillStyle = sg.col + "33";
      ctx.strokeStyle = sg.col;
      ctx.fillRect(curX, cy - sg.r, sw - 3, sg.r * 2);
      ctx.strokeRect(curX, cy - sg.r, sw - 3, sg.r * 2);
      ctx.fillStyle = C.text;
      ctx.font = "9px monospace";
      ctx.fillText(sg.name, curX + 4, cy + 3);
      curX += sw;
    });

    // Right: Brayton T-s Diagram
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Ideal vs Real Brayton Cycle T–s Loop");
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 48;

    const p2x = gx + gw * 0.22, p2y = gy + gh * 0.82;
    const p3x = gx + gw * 0.28, p3y = gy + gh * (0.62 - 0.22 * (OPR / 50));
    const p4x = gx + gw * 0.76, p4y = gy + gh * (0.35 - 0.22 * ((Tt4 - 1350) / 550));
    const p5x = gx + gw * 0.84, p5y = gy + gh * 0.68;

    ctx.fillStyle = "rgba(255,209,102,0.16)";
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(p2x, p2y);
    ctx.lineTo(p3x, p3y);
    ctx.lineTo(p4x, p4y);
    ctx.lineTo(p5x, p5y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    return {
      "Bypass Ratio B": B.toFixed(1) + ":1",
      "Overall Pressure π_c": OPR.toFixed(1),
      "Thermal Efficiency η_th": (etaTh * 100).toFixed(1) + "%",
      "TSFC": tsfc.toFixed(2) + " g/(kN·s)",
    };
  };

  // 12. aero_scramjet_isolator
  R.aero_scramjet_isolator = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Hypersonic Scramjet Inlet, Isolator Shock Train & Rayleigh Thermal Choking", st.spec.formula);
    const M0 = 4.5 + st.a * 5.0;
    const phi = 0.2 + st.b * 1.1;
    const isoLD = 4 + st.c * 8;

    const mCombIn = Math.max(1.3, M0 * 0.42);
    const qNorm = phi * 0.88;
    const unstart = qNorm > (mCombIn - 1.0) * 0.55 + isoLD * 0.04;
    const mExit = unstart ? 0.85 : Math.max(1.02, mCombIn - qNorm * 1.15);

    // Left: Forebody Ramp + Isolator Shock Diamonds + Combustor
    const lx = 14, ly = 44, lw = W * 0.56 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, unstart ? "⚠️ INLET UNSTART — Thermal Choking Disgorged Shock!" : "Supersonic Isolator Shock Train & H₂ Combustor");
    const yTop = ly + lh * 0.34, yBot = ly + lh * 0.64;

    // Scramjet duct walls
    ctx.strokeStyle = C.text;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(lx + 14, yTop - 22);
    ctx.lineTo(lx + lw * 0.28, yTop);
    ctx.lineTo(lx + lw * 0.65, yTop);
    ctx.lineTo(lx + lw - 14, yTop - 16);
    ctx.moveTo(lx + lw * 0.22, yBot);
    ctx.lineTo(lx + lw - 14, yBot + 10);
    ctx.stroke();

    // Diamond shock train inside isolator
    ctx.strokeStyle = unstart ? C.danger : "#67e8f9";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const xIsoStart = unstart ? lx + 24 : lx + lw * 0.26;
    for (let i = 0; i <= 10; i++) {
      const sx = xIsoStart + i * ((lw * 0.38) / 10);
      const sy = i % 2 === 0 ? yTop : yBot;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Combustor flame plume
    const grad = ctx.createLinearGradient(lx + lw * 0.62, 0, lx + lw - 14, 0);
    grad.addColorStop(0, "rgba(255,107,107,0.75)");
    grad.addColorStop(1, "rgba(255,209,102,0.25)");
    ctx.fillStyle = grad;
    ctx.fillRect(lx + lw * 0.62, yTop + 2, lw * 0.32, yBot - yTop - 4);

    // Right: Rayleigh Curve T-s with Choking Point M=1
    const rx = W * 0.56, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Rayleigh Heating Curve & Sonic Thermal Choking (M = 1)");
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 48;

    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = (i / 60) * 2 - 1; // upper subsonic & lower supersonic branch
      const s = 1 - u * u;
      const px = gx + s * gw * 0.88;
      const py = gy + gh * 0.5 - u * gh * 0.42;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Flight Mach M_∞": M0.toFixed(1),
      "Combustor Exit M_e": mExit.toFixed(2),
      "Equivalence Ratio φ": phi.toFixed(2),
      "Isolator Margin": unstart ? "CHOKED / UNSTART" : "Supersonic Stable ✓",
    };
  };

  // 13. aero_ion_hall_thruster
  R.aero_ion_hall_thruster = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Hall-Effect Thruster — Radial B-Field, E×B Electron Drift & Xenon Ion Plume", st.spec.formula);
    const Vb = 200 + st.a * 800;
    const Bgauss = 100 + st.b * 300;
    const mdot = 2 + st.c * 18; // mg/s

    const mXe = 2.18e-25;
    const qE = 1.602e-19;
    const ve = Math.sqrt((2 * qE * Vb) / mXe);
    const isp = ve / 9.80665;
    const thrustMN = mdot * 1e-6 * ve * 1000;

    // Left: Annular Channel + Glowing Blue Xenon Plume
    const lx = 14, ly = 44, lw = W * 0.55 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Annular Discharge Channel & E×B Hall Drift Ring");
    const cx = lx + lw * 0.32, cy = ly + lh * 0.52;

    // Glowing Xenon ion plume
    const plume = ctx.createLinearGradient(cx, cy, lx + lw - 12, cy);
    plume.addColorStop(0, "rgba(103,232,249,0.85)");
    plume.addColorStop(0.5, "rgba(124,156,255,0.45)");
    plume.addColorStop(1, "rgba(124,156,255,0)");
    ctx.fillStyle = plume;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 42);
    ctx.lineTo(lx + lw - 12, cy - 75);
    ctx.lineTo(lx + lw - 12, cy + 75);
    ctx.lineTo(cx, cy + 42);
    ctx.closePath();
    ctx.fill();

    // Ceramic channel walls
    ctx.fillStyle = "#2b3252";
    ctx.strokeStyle = C.text;
    ctx.fillRect(cx - 55, cy - 58, 55, 18);
    ctx.fillRect(cx - 55, cy - 14, 55, 28);
    ctx.fillRect(cx - 55, cy + 40, 55, 18);

    // Animated Xenon ions streaming right
    for (let i = 0; i < 16; i++) {
      const u = ((st.t * (1.2 + Vb * 0.002) + i * 0.19) % 1);
      const ix = cx - 35 + u * (lw * 0.62);
      const iy = cy + (i % 2 === 0 ? -27 : 27) + Math.sin(i * 2.1) * 8 * u;
      ctx.fillStyle = "#67e8f9";
      ctx.beginPath();
      ctx.arc(ix, iy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right: Front View of Azimuthal Hall Current Ring
    const rx = W * 0.55, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Front View: Azimuthal E×B Electron Drift Ring");
    const rcx = rx + rw * 0.5, rcy = ry + rh * 0.54;
    ctx.strokeStyle = "rgba(103,232,249,0.75)";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(rcx, rcy, 44, 0, Math.PI * 2);
    ctx.stroke();

    for (let e = 0; e < 12; e++) {
      const ang = (e / 12) * Math.PI * 2 + st.t * (4 + Bgauss * 0.015);
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(rcx + Math.cos(ang) * 44, rcy + Math.sin(ang) * 44, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    return {
      "Specific Impulse I_sp": Math.round(isp) + " s",
      "Exhaust Velocity v_e": (ve / 1000).toFixed(1) + " km/s",
      "Thrust F": thrustMN.toFixed(1) + " mN",
      "Hall Parameter ω_ce τ": (12 + Bgauss * 0.08).toFixed(1),
    };
  };

  // 14. aero_aeroelastic_flutter
  R.aero_aeroelastic_flutter = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Aeroelastic Bending–Torsion Wing Flutter & V–g Damping Boundary", st.spec.formula);
    const V = 40 + st.a * 220;
    const xAlpha = -0.05 + st.b * 0.45;
    const damp = 0.01 + st.c * 0.12;

    const vFlutter = 145 - xAlpha * 165 + damp * 280;
    const netDamp = damp - (V - vFlutter) * 0.0018;
    const unstable = V > vFlutter;

    // Left: Pitching (θ) & Plunging (h) Airfoil Section on Springs
    const lx = 14, ly = 44, lw = W * 0.5 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, unstable ? "⚠️ FLUTTER INSTABILITY (Negative Damping!)" : "2-DOF Pitch (θ) & Plunge (h) Elastic Wing Section");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.5;
    const amp = unstable ? Math.min(1.6, 0.35 + (V - vFlutter) * 0.018) : 0.22;
    const hDisp = Math.sin(st.t * 7) * 26 * amp;
    const thDisp = Math.sin(st.t * 7 - 1.1) * 0.35 * amp;

    // Elastic support springs
    ctx.strokeStyle = C.muted;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx, ly + lh - 14);
    ctx.lineTo(cx, cy + hDisp);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy + hDisp);
    ctx.rotate(thDisp);
    ctx.fillStyle = unstable ? "rgba(255,107,107,0.35)" : "rgba(124,156,255,0.3)";
    ctx.strokeStyle = unstable ? C.danger : C.primary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 68, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Elastic axis vs CG marker
    ctx.fillStyle = C.ok;
    ctx.beginPath();
    ctx.arc(-15, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(-15 + xAlpha * 95, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right: V-g Modal Damping Diagram
    const rx = W * 0.5, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "V–g Aeroelastic Stability Diagram (Flutter Crossing g = 0)");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;
    const zeroY = gy + gh * 0.45;

    ctx.strokeStyle = "rgba(255,107,107,0.5)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(gx, zeroY);
    ctx.lineTo(gx + gw, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Torsion branch crossing into unstable region
    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const vSim = 40 + (i / 60) * 220;
      const gVal = damp - (vSim - vFlutter) * 0.0018;
      const px = gx + (i / 60) * gw;
      const py = zeroY + gVal * gh * 3.2;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const curX = gx + ((V - 40) / 220) * gw;
    const curY = zeroY + netDamp * gh * 3.2;
    ctx.fillStyle = unstable ? C.danger : C.ok;
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();

    return {
      "Airspeed V": V.toFixed(1) + " m/s",
      "Flutter Speed V_F": vFlutter.toFixed(1) + " m/s",
      "Modal Damping g": (-netDamp).toFixed(4),
      "Stability State": unstable ? "UNSTABLE FLUTTER" : "Damped Stable ✓",
    };
  };

  // 15. aero_panel_vortex_lattice
  R.aero_panel_vortex_lattice = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Source–Vortex Panel Method & Boundary Layer Transition / Separation", st.spec.formula);
    const reLog = 5.0 + st.a * 2.5;
    const aoa = -2 + st.b * 18;
    const xTrip = 0.15 + st.c * 0.65;

    const Hshape = 2.3 + Math.max(0, aoa - 6) * 0.18 - (reLog - 5.0) * 0.15;
    const sepX = Hshape > 3.5 ? Math.max(0.35, 1.0 - (Hshape - 3.5) * 0.45) : 1.0;

    // Left: Discretized Panel Polygon with Normal Control Points
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Discretized Surface Panels, Control Points & Separation Wake");
    const cx = lx + lw * 0.48, cy = ly + lh * 0.54, R = lw * 0.34;
    const Np = 14;
    const pts = [];
    for (let i = 0; i <= Np; i++) {
      const th = (i / Np) * Math.PI * 2;
      const x = cx + R * Math.cos(th);
      const y = cy - 0.32 * R * Math.sin(th) * (1 - 0.35 * Math.cos(th));
      pts.push({ x, y });
    }
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    // Control points & outward normal vectors
    for (let i = 0; i < Np; i++) {
      const mx = 0.5 * (pts[i].x + pts[i + 1].x);
      const my = 0.5 * (pts[i].y + pts[i + 1].y);
      const dx = pts[i + 1].x - pts[i].x, dy = pts[i + 1].y - pts[i].y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = dy / len, ny = -dx / len;
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#67e8f9";
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx + nx * 16, my + ny * 16);
      ctx.stroke();
    }

    // Right: Boundary Layer Velocity Profile u(y)
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Boundary Layer Velocity Profile u(y)/U_e & Shape Factor H");
    const gx = rx + 34, gy = ry + 30, gw = rw - 52, gh = rh - 48;

    ctx.strokeStyle = sepX < 1.0 ? C.danger : C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const yEta = i / 50;
      const uNorm = sepX < 1.0
        ? Math.tanh(yEta * 3.2) - 0.35 * Math.sin(yEta * Math.PI)
        : Math.pow(yEta, 1 / (7 - (Hshape - 1.4) * 1.8));
      const px = gx + Math.max(0, uNorm) * gw * 0.85;
      const py = gy + gh - yEta * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Reynolds Number Re": `10^${reLog.toFixed(2)}`,
      "Shape Factor H = δ*/θ": Hshape.toFixed(2),
      "Transition Trip x_tr/c": xTrip.toFixed(2),
      "Separation Point x_sep": sepX < 1.0 ? (sepX * 100).toFixed(0) + "% c (Stall)" : "Attached (100% c)",
    };
  };

  // 16. aero_j2_sun_sync
  R.aero_j2_sun_sync = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("J₂ Oblateness Nodal Precession & Sun-Synchronous Orbit (SSO)", st.spec.formula);
    const hKm = 400 + st.a * 1000;
    const incDeg = 92 + st.b * 14;
    const ecc = st.c * 0.08;

    const Re = 6378.137;
    const a = Re + hKm;
    const p = a * (1 - ecc * ecc);
    const J2 = 1.08263e-3;
    const nRadS = Math.sqrt(398600.44 / Math.pow(a, 3));
    const omegaDotDegDay = -1.5 * J2 * Math.pow(Re / p, 2) * nRadS * Math.cos((incDeg * Math.PI) / 180) * (180 / Math.PI) * 86400;
    const ssoTarget = 0.9856;

    // Left: Oblate Earth + Precessing Orbital Plane & Sun Vector
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Oblate Earth (J₂ Bulge) & Sun-Synchronous Nodal Precession Ω(t)");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;

    // Sun rays indicator rotating slowly
    const sunAng = st.t * 0.4;
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sunAng) * 92, cy + Math.sin(sunAng) * 92);
    ctx.stroke();
    ctx.fillStyle = C.accent;
    ctx.fillText("☀️ Sun Vector", cx + Math.cos(sunAng) * 72 - 20, cy + Math.sin(sunAng) * 72 - 6);

    // Oblate Earth ellipse
    ctx.fillStyle = "rgba(124,156,255,0.35)";
    ctx.strokeStyle = C.primary;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 46, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Precessing orbital plane
    const nodeAng = sunAng * (omegaDotDegDay / ssoTarget);
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 78, 26, nodeAng + 1.2, 0, Math.PI * 2);
    ctx.stroke();

    // Right: Sun-Sync Inclination vs Altitude Curve
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "SSO Locus: Nodal Drift Ω̇ (°/day) vs Inclination i");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.strokeStyle = C.ok;
    ctx.setLineDash([4, 3]);
    const targetY = gy + gh - (ssoTarget / 2.0) * gh;
    ctx.beginPath();
    ctx.moveTo(gx, targetY);
    ctx.lineTo(gx + gw, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const inc = 92 + (i / 50) * 14;
      const rate = -1.5 * J2 * Math.pow(Re / p, 2) * nRadS * Math.cos((inc * Math.PI) / 180) * (180 / Math.PI) * 86400;
      const px = gx + (i / 50) * gw;
      const py = gy + gh - (rate / 2.0) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Nodal Drift Ω̇": omegaDotDegDay.toFixed(4) + " °/day",
      "SSO Target Rate": "+0.9856 °/day",
      "LTAN Drift Error": (omegaDotDegDay - ssoTarget).toFixed(4) + " °/day",
      "SSO Lock": Math.abs(omegaDotDegDay - ssoTarget) < 0.05 ? "Sun-Synchronous ✓" : "Drifting LTAN",
    };
  };

  // 17. aero_lunar_powered_descent
  R.aero_lunar_powered_descent = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Powered Explicit Guidance (PEG) & Convex SOCP Pinpoint Landing", st.spec.formula);
    const altKm = 5 + st.a * 20;
    const twRatio = 1.4 + st.b * 2.2;
    const coneDeg = 10 + st.c * 35;

    // Left: Descent Trajectory inside Glide-Slope Cone
    const lx = 14, ly = 44, lw = W * 0.55 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Pinpoint Descent Trajectory & Glide-Slope Cone Constraint");
    const padX = lx + lw * 0.68, padY = ly + lh - 20;

    // Lunar cratered terrain & glide cone
    ctx.strokeStyle = C.muted;
    ctx.beginPath();
    ctx.moveTo(lx + 10, padY);
    ctx.lineTo(lx + lw - 10, padY);
    ctx.stroke();

    const coneRad = ((90 - coneDeg) * Math.PI) / 180;
    ctx.fillStyle = "rgba(110,231,183,0.08)";
    ctx.strokeStyle = "rgba(110,231,183,0.45)";
    ctx.beginPath();
    ctx.moveTo(padX, padY);
    ctx.lineTo(padX - 140 * Math.tan(coneRad), padY - 140);
    ctx.lineTo(padX + 140 * Math.tan(coneRad), padY - 140);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Optimal convex trajectory + thrust vectors
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const u = i / 40; // 0 = ignition, 1 = touchdown
      const px = padX - Math.pow(1 - u, 1.6) * (lw * 0.48);
      const py = padY - (1 - u * u) * (lh * 0.75 * (altKm / 25));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      if (i % 8 === 0 && i < 40) {
        ctx.save();
        ctx.strokeStyle = C.danger;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + 12 * (1 - u), py + 18);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.stroke();

    // Right: Bang-Bang Thrust Profile ||T(t)||
    const rx = W * 0.55, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Pontryagin Maximum-Principle Bang–Bang Throttle Profile");
    const gx = rx + 26, gy = ry + 32, gw = rw - 42, gh = rh - 50;
    const tSwitch1 = 0.28 + (1 / twRatio) * 0.2, tSwitch2 = 0.62;

    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const thr = (u < tSwitch1 || u > tSwitch2) ? 0.95 : 0.28;
      const px = gx + u * gw;
      const py = gy + gh - thr * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Ignition Altitude": altKm.toFixed(1) + " km",
      "Max Thrust / Weight": twRatio.toFixed(2),
      "Glide-Slope Margin": coneDeg.toFixed(0) + "°",
      "Propellant Used": (18 + altKm * 0.9 / twRatio).toFixed(1) + "%",
    };
  };

  // 18. aero_kalman_gps_ins
  R.aero_kalman_gps_ins = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Tightly-Coupled GPS/INS Multiplicative EKF & Covariance Ellipse", st.spec.formula);
    const imuDrift = 1 + st.a * 9;
    const nSats = Math.round(4 + st.b * 8);
    const multipath = st.c * 12;

    const gdop = 1.2 + 6.0 / nSats + multipath * 0.15;
    const cep = (0.8 * gdop * Math.sqrt(imuDrift)) / 2.2;

    // Left: True Trajectory vs Pure INS Dead-Reckoning vs GPS/INS MEKF
    const lx = 14, ly = 44, lw = W * 0.56 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "True Flight Path (Green) vs INS Drift (Red) vs EKF Fusion (Cyan)");
    const gx = lx + 20, gy = ly + lh * 0.55, gw = lw - 36;

    // Pure INS quadratic drift
    ctx.strokeStyle = C.danger;
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      const yTrue = Math.sin(u * Math.PI * 2) * 38;
      const yIns = yTrue - u * u * imuDrift * 8.5;
      if (i === 0) ctx.moveTo(gx + u * gw, gy + yIns);
      else ctx.lineTo(gx + u * gw, gy + yIns);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // True & EKF paths
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      const yTrue = Math.sin(u * Math.PI * 2) * 38;
      if (i === 0) ctx.moveTo(gx + u * gw, gy + yTrue);
      else ctx.lineTo(gx + u * gw, gy + yTrue);
    }
    ctx.stroke();

    // Right: 2σ Error Covariance Ellipse P(t) & Sawtooth Reset
    const rx = W * 0.56, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "2σ Error Covariance Ellipse & Sawtooth Measurement Updates");
    const ecx = rx + rw * 0.5, ecy = ry + rh * 0.45;
    const pulseScale = 0.55 + ((st.t * 1.4) % 1) * 0.65;
    ctx.fillStyle = "rgba(103,232,249,0.18)";
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(ecx, ecy, (12 + cep * 6) * pulseScale, (8 + cep * 4) * pulseScale, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    return {
      "Visible GNSS Sats": String(nSats),
      "Geometric GDOP": gdop.toFixed(2),
      "Horizontal CEP (95%)": cep.toFixed(2) + " m",
      "IMU Gyro Bias": (imuDrift * 0.15).toFixed(2) + " °/hr",
    };
  };

  // 19. aero_helicopter_momentum
  R.aero_helicopter_momentum = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Blade Element Momentum Theory (BEMT) & Vortex Ring State", st.spec.formula);
    const theta0 = 2 + st.a * 14;
    const Vc = -12 + st.b * 24; // negative = descent
    const sigma = 0.05 + st.c * 0.1;

    const vh = 6.5 + theta0 * 0.35; // hover induced velocity
    const inVRS = Vc < -0.5 * vh && Vc > -1.8 * vh;
    const fm = 0.58 + sigma * 1.4 - Math.pow(theta0 - 9, 2) * 0.003;

    // Left: Rotor Disk + Contracting Slipstream / VRS Toroidal Recirculation
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, inVRS ? "⚠️ VORTEX RING STATE (Turbulent Toroidal Recirculation)" : "Rotor Disk & Slipstream Contraction (R → R/√2)");
    const cx = lx + lw * 0.5, dy = ly + lh * 0.36, diskR = lw * 0.32;

    // Rotor disk & spinning blades
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - diskR, dy);
    ctx.lineTo(cx + diskR, dy);
    ctx.stroke();

    if (inVRS) {
      // Vortex rings on both tips
      for (const side of [-1, 1]) {
        ctx.strokeStyle = C.danger;
        ctx.lineWidth = 2;
        for (let r = 12; r <= 32; r += 10) {
          ctx.beginPath();
          ctx.arc(cx + side * diskR, dy + 6, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else {
      // Contracting streamtube
      ctx.strokeStyle = "#67e8f9";
      ctx.lineWidth = 1.8;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const u = i / 40;
          const rCur = diskR * (0.707 + 0.293 * Math.exp(-u * 3.5));
          const px = cx + side * rCur;
          const py = dy + u * (lh * 0.52);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }

    // Right: Induced Velocity v_i/v_h vs Climb Rate V_c/v_h
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Momentum Theory Curve: Climb, Hover, VRS & Autorotation");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const vcNorm = -2.2 + (i / 60) * 4.4;
      const viNorm = vcNorm >= 0
        ? -0.5 * vcNorm + Math.sqrt(0.25 * vcNorm * vcNorm + 1)
        : 1.0 + 0.45 * Math.sin(vcNorm * 2.2);
      const px = gx + ((vcNorm + 2.2) / 4.4) * gw;
      const py = gy + gh - (viNorm / 2.2) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Flight Regime": inVRS ? "VORTEX RING STATE" : (Vc < -1.8 * vh ? "Autorotation" : (Vc > 0.5 ? "Axial Climb" : "Hover")),
      "Hover Figure of Merit": fm.toFixed(3),
      "Induced Inflow v_i": vh.toFixed(1) + " m/s",
      "Vertical Rate V_c": Vc.toFixed(1) + " m/s",
    };
  };

  // 20. aero_gravity_assist_bsling
  R.aero_gravity_assist_bsling = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Planetary Gravity Assist Hyperbola & B-Plane Aiming Target", st.spec.formula);
    const rpRadii = 1.2 + st.a * 6.8;
    const vInf = 4.0 + st.b * 12.0;
    const bClockDeg = st.c * 360;

    const eHyp = 1 + rpRadii * (vInf / 14.0) * (vInf / 14.0);
    const deltaRad = 2 * Math.asin(1 / eHyp);
    const dvHelio = 2 * vInf * Math.sin(deltaRad * 0.5);

    // Left: Planet-Centered Hyperbolic Deflection
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Hyperbolic Flyby Deflection v_∞⁻ → v_∞⁺");
    const pxC = lx + lw * 0.5, pyC = ly + lh * 0.54;

    // Planet disk
    ctx.fillStyle = "rgba(253,186,116,0.35)";
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pxC, pyC, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hyperbolic path
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = -35; i <= 35; i++) {
      const u = i / 35;
      const r = (24 + rpRadii * 6) / (1 + 0.75 * Math.cos(u * 1.4));
      const ang = Math.PI + u * (Math.PI * 0.5 + deltaRad * 0.45);
      const x = pxC + r * Math.cos(ang);
      const y = pyC + r * Math.sin(ang);
      if (i === -35) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Right: B-Plane Target Reticle (B·T vs B·R)
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "B-Plane Target Reticle (B·T, B·R) & Impact Radius");
    const bcx = rx + rw * 0.5, bcy = ry + rh * 0.54;

    // Forbidden impact disk
    ctx.fillStyle = "rgba(255,107,107,0.22)";
    ctx.strokeStyle = C.danger;
    ctx.beginPath();
    ctx.arc(bcx, bcy, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const bDist = 24 + rpRadii * 8;
    const bRad = (bClockDeg * Math.PI) / 180;
    const bx = bcx + Math.cos(bRad) * bDist;
    const by = bcy + Math.sin(bRad) * bDist;
    ctx.strokeStyle = C.ok;
    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);
    ctx.stroke();

    return {
      "Turning Angle δ": ((deltaRad * 180) / Math.PI).toFixed(1) + "°",
      "Heliocentric ΔV": dvHelio.toFixed(2) + " km/s",
      "Hyperbolic Eccentricity e": eHyp.toFixed(2),
      "Periapsis Altitude": rpRadii.toFixed(2) + " R_p",
    };
  };

  // =========================================================================
  // 21–40: QUANTUM COMPUTING (20 Bespoke Simulations)
  // =========================================================================

  // 21. qc_bloch_rabi
  R.qc_bloch_rabi = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Single-Qubit Bloch Sphere & Driven Rabi / Ramsey Spectroscopy", st.spec.formula);
    const omegaR = 2 + st.a * 28; // MHz
    const delta = -15 + st.b * 30; // MHz
    const gamma2 = 0.05 + st.c * 0.95;

    const omegaEff = Math.hypot(omegaR, delta);
    const pMax = (omegaR * omegaR) / (omegaEff * omegaEff);
    const tRun = (st.t * 1.4) % 4;
    const p1 = pMax * Math.sin(0.5 * omegaEff * tRun) * Math.sin(0.5 * omegaEff * tRun) * Math.exp(-gamma2 * tRun * 0.4);

    // Left: 3D Bloch Sphere Projection + Precessing State Vector
    const lx = 14, ly = 44, lw = W * 0.48 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Bloch Sphere: |0⟩ North Pole, |1⟩ South Pole & Rabi Precession Cone");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.52, R = Math.min(lw, lh) * 0.34;

    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.32, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Z, X, Y axes
    ctx.strokeStyle = C.axis;
    ctx.beginPath();
    ctx.moveTo(cx, cy - R - 8);
    ctx.lineTo(cx, cy + R + 8);
    ctx.moveTo(cx - R - 8, cy);
    ctx.lineTo(cx + R + 8, cy);
    ctx.stroke();
    ctx.fillStyle = C.text;
    ctx.font = "10px monospace";
    ctx.fillText("|0⟩", cx - 8, cy - R - 12);
    ctx.fillText("|1⟩", cx - 8, cy + R + 18);

    // Effective Hamiltonian axis (Omega_R, 0, Delta)
    const tilt = Math.atan2(omegaR, delta);
    const axX = cx + Math.sin(tilt) * R * 0.85;
    const axY = cy - Math.cos(tilt) * R * 0.85;
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(axX, axY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Bloch state vector r(t)
    const zBloch = 1 - 2 * p1;
    const xyMag = Math.sqrt(Math.max(0, 1 - zBloch * zBloch)) * Math.exp(-gamma2 * 0.25);
    const phi = st.t * omegaEff * 0.35;
    const vx = cx + xyMag * Math.cos(phi) * R;
    const vy = cy - zBloch * R + xyMag * Math.sin(phi) * R * 0.32;
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(vx, vy);
    ctx.stroke();
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.arc(vx, vy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Right: Damped Rabi Chevron / Oscillation Curve P(|1⟩, t)
    const rx = W * 0.48, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Excited State Population P(|1⟩) vs Pulse Duration τ");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const tau = (i / 80) * 4.0;
      const pop = pMax * Math.pow(Math.sin(0.5 * omegaEff * tau), 2) * Math.exp(-gamma2 * tau * 0.45);
      const px = gx + (i / 80) * gw;
      const py = gy + gh - pop * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Generalized Rabi Ω": omegaEff.toFixed(2) + " MHz",
      "Max Inversion P_max": (pMax * 100).toFixed(1) + "%",
      "Current P(|1⟩)": p1.toFixed(3),
      "Bloch Purity |r|": Math.exp(-gamma2 * 0.3).toFixed(3),
    };
  };

  // 22. qc_bell_chsh
  R.qc_bell_chsh = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Bell State |Φ⁺⟩ Entanglement & CHSH Inequality Violator", st.spec.formula);
    const thetaDeg = st.a * 90;
    const pWerner = 0.4 + st.b * 0.6;
    const logShots = 2 + st.c * 3;

    const thetaRad = (thetaDeg * Math.PI) / 180;
    const Sval = pWerner * (3 * Math.cos(thetaRad) - Math.cos(3 * thetaRad));

    // Left: Entangled Photon Source + Alice & Bob Polarizer Dials
    const lx = 14, ly = 44, lw = W * 0.5 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "SPDC Entangled Pair Source → Alice (a, a') & Bob (b, b') Analyzers");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
    const ax = lx + 46, bx = lx + lw - 46;

    // Wavy entangled photon lines
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const x = ax + (i / 40) * (bx - ax);
      const y = cy + Math.sin(i * 0.8 - st.t * 8) * 6;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Alice & Bob analyzer dials
    [
      { x: ax, ang: 0, label: "Alice (0°)" },
      { x: bx, ang: thetaRad, label: `Bob (${thetaDeg.toFixed(0)}°)` },
    ].forEach((d) => {
      ctx.fillStyle = "#1d233b";
      ctx.strokeStyle = "#67e8f9";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(d.x, cy, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = C.accent;
      ctx.beginPath();
      ctx.moveTo(d.x - Math.cos(d.ang) * 22, cy - Math.sin(d.ang) * 22);
      ctx.lineTo(d.x + Math.cos(d.ang) * 22, cy + Math.sin(d.ang) * 22);
      ctx.stroke();
      ctx.fillStyle = C.text;
      ctx.font = "10px monospace";
      ctx.fillText(d.label, d.x - 28, cy + 42);
    });

    // Right: CHSH S(θ) Curve with Classical LHV Bound (2) & Tsirelson Bound (2√2)
    const rx = W * 0.5, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "CHSH Parameter |S(θ)| vs Local Hidden Variable Bound 2.0");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    const yClass = gy + gh - (2.0 / 3.0) * gh;
    const yQuant = gy + gh - (2.8284 / 3.0) * gh;
    ctx.strokeStyle = C.danger;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(gx, yClass);
    ctx.lineTo(gx + gw, yClass);
    ctx.stroke();
    ctx.strokeStyle = C.ok;
    ctx.beginPath();
    ctx.moveTo(gx, yQuant);
    ctx.lineTo(gx + gw, yQuant);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const th = (i / 60) * (Math.PI / 2);
      const s = Math.abs(pWerner * (3 * Math.cos(th) - Math.cos(3 * th)));
      const px = gx + (i / 60) * gw;
      const py = gy + gh - (s / 3.0) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "CHSH Correlator |S|": Math.abs(Sval).toFixed(3),
      "Bell Inequality": Math.abs(Sval) > 2.0 ? "VIOLATED (Quantum ✓)" : "Classical LHV (≤ 2)",
      "Tsirelson Max 2√2": "2.828",
      "Stat Uncertainty σ_S": (2 / Math.pow(10, logShots * 0.5)).toFixed(3),
    };
  };

  // 23. qc_grover_amplitude
  R.qc_grover_amplitude = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Grover's Search — Geometric Rotation in (|w⊥⟩, |w⟩) & State Bar Chart", st.spec.formula);
    const nQubits = Math.round(3 + st.a * 4);
    const N = 1 << nQubits;
    const kOpt = Math.max(1, Math.round((Math.PI / 4) * Math.sqrt(N)));
    const kStep = Math.round(st.b * (kOpt * 2));
    const phaseErr = st.c * 18;

    const theta0 = Math.asin(1 / Math.sqrt(N));
    const ang = (2 * kStep + 1) * theta0 * (1 - phaseErr * 0.008);
    const pTarget = Math.pow(Math.sin(ang), 2);
    const pOther = (1 - pTarget) / Math.max(1, N - 1);

    // Left: 2D Geometric Plane spanned by |w⊥⟩ and |w⟩
    const lx = 14, ly = 44, lw = W * 0.46 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "2D Subspace Rotation: |w⊥⟩ (Horizontal) → |w⟩ (Vertical)");
    const ox = lx + 36, oy = ly + lh - 34, R = Math.min(lw, lh) * 0.68;

    ctx.strokeStyle = C.axis;
    ctx.beginPath();
    ctx.moveTo(ox, oy - R);
    ctx.lineTo(ox, oy);
    ctx.lineTo(ox + R, oy);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ox, oy, R, -Math.PI / 2, 0);
    ctx.stroke();

    // Initial state |s⟩ and k-step rotated state |ψ_k⟩
    const vx = ox + Math.cos(ang) * R;
    const vy = oy - Math.sin(ang) * R;
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(vx, vy);
    ctx.stroke();
    ctx.fillStyle = C.ok;
    ctx.beginPath();
    ctx.arc(vx, vy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Right: Bar Chart of 2^n Computational Basis Amplitudes
    const rx = W * 0.46, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, `Basis State Probabilities (N = 2^${nQubits} = ${N}, Marked ω*)`);
    const gx = rx + 20, gy = ry + 32, gw = rw - 34, gh = rh - 52;
    const nBars = Math.min(16, N);
    const targetIdx = Math.floor(nBars * 0.62);
    const bw = gw / nBars;

    for (let i = 0; i < nBars; i++) {
      const isMarked = i === targetIdx;
      const prob = isMarked ? pTarget : pOther;
      const bh = Math.max(3, prob * gh * 0.9);
      ctx.fillStyle = isMarked ? C.accent : C.primary;
      ctx.fillRect(gx + i * bw + 2, gy + gh - bh, Math.max(3, bw - 4), bh);
    }

    return {
      "Hilbert Space N": `${N} states`,
      "Grover Iterations k": `${kStep} (Optimal k* = ${kOpt})`,
      "Target Prob P(ω*)": (pTarget * 100).toFixed(1) + "%",
      "Rotation Angle (2k+1)θ": ((ang * 180) / Math.PI).toFixed(1) + "°",
    };
  };

  // 24. qc_shor_qft_period
  R.qc_shor_qft_period = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Shor's Factoring Algorithm — Modular Exponentiation & Inverse QFT Peaks", st.spec.formula);
    const rPeriod = Math.round(2 + st.a * 8);
    const mBits = Math.round(5 + st.b * 5);
    const noise = st.c * 0.35;
    const Q = 1 << mBits;

    // Top: Periodic f(x) = a^x mod N Register
    const lx = 14, ly = 44, lw = W - 28, lh = (H - 64) * 0.44;
    st.panel(lx, ly, lw, lh, `Periodic Modular Sequence f(x) = a^x mod N (Hidden Period r = ${rPeriod})`);
    const gx = lx + 24, gy = ly + 26, gw = lw - 40, gh = lh - 38;
    const nSamples = 36;
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < nSamples; x++) {
      const val = ((x % rPeriod) + 1) / rPeriod;
      const px = gx + (x / (nSamples - 1)) * gw;
      const py = gy + gh - val * gh * 0.85;
      if (x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      ctx.fillStyle = C.accent;
      ctx.fillRect(px - 2, py - 2, 4, 4);
    }
    ctx.stroke();

    // Bottom: QFT Interference Spectrum P(y) Peaking at y = k · Q / r
    const by = ly + lh + 8, bh = H - by - 12;
    st.panel(lx, by, lw, bh, `Inverse QFT Probability Spectrum P(y) — Constructive Peaks at k·2^${mBits}/${rPeriod}`);
    const qx = lx + 24, qy = by + 26, qw = lw - 40, qh = bh - 38;
    const bins = 80;
    for (let i = 0; i < bins; i++) {
      const yFrac = (i / bins) * rPeriod;
      const distToInt = Math.abs(yFrac - Math.round(yFrac));
      const peak = Math.exp(-Math.pow(distToInt / (0.045 + noise * 0.14), 2)) * (1 - noise * 0.5) + noise * 0.08;
      const barH = peak * qh * 0.88;
      ctx.fillStyle = distToInt < 0.08 ? C.ok : C.primary;
      ctx.fillRect(qx + (i / bins) * qw, qy + qh - barH, Math.max(2, qw / bins - 1), barH);
    }

    return {
      "Hidden Period r": String(rPeriod),
      "QFT Register Q = 2^m": String(Q),
      "Peak Spacing Δy": (Q / rPeriod).toFixed(1),
      "Continued Fraction Success": ((1 - noise * 0.65) * 92).toFixed(1) + "%",
    };
  };

  // 25. qc_qpe_eigenphase
  R.qc_qpe_eigenphase = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Quantum Phase Estimation (QPE) Circuit & Fejér Kernel Eigenphase Spectrum", st.spec.formula);
    const phi = 0.05 + st.a * 0.9;
    const mAnc = Math.round(3 + st.b * 4);
    const trotter = Math.round(2 + st.c * 14);
    const M = 1 << mAnc;

    // Left: QPE Ancilla Circuit with Controlled-U^(2^k) Gates & QFT†
    const lx = 14, ly = 44, lw = W * 0.52 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `QPE Circuit: ${mAnc} Ancilla Wires + Controlled-U^(2^k) + QFT†`);
    const x0 = lx + 28, xEnd = lx + lw - 20;
    const wireStep = (lh - 52) / (mAnc + 1);

    for (let w = 0; w <= mAnc; w++) {
      const wy = ly + 30 + w * wireStep;
      ctx.strokeStyle = w === mAnc ? C.accent : "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x0, wy);
      ctx.lineTo(xEnd, wy);
      ctx.stroke();
      if (w < mAnc) {
        // Hadamard box
        ctx.fillStyle = "#222b4c";
        ctx.strokeStyle = "#67e8f9";
        ctx.fillRect(x0 + 14, wy - 8, 16, 16);
        ctx.strokeRect(x0 + 14, wy - 8, 16, 16);
        // Controlled-U^(2^w) vertical line to bottom target wire
        const gx = x0 + 46 + w * ((lw - 135) / Math.max(1, mAnc));
        const targetY = ly + 30 + mAnc * wireStep;
        ctx.strokeStyle = C.secondary;
        ctx.beginPath();
        ctx.moveTo(gx, wy);
        ctx.lineTo(gx, targetY);
        ctx.stroke();
        ctx.fillStyle = C.secondary;
        ctx.beginPath();
        ctx.arc(gx, wy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // QFT† block on ancilla wires
    ctx.fillStyle = "rgba(192,132,252,0.22)";
    ctx.strokeStyle = "#c084fc";
    ctx.fillRect(xEnd - 48, ly + 22, 36, (mAnc - 1) * wireStep + 16);
    ctx.strokeRect(xEnd - 48, ly + 22, 36, (mAnc - 1) * wireStep + 16);
    ctx.fillStyle = C.text;
    ctx.font = "10px monospace";
    ctx.fillText("QFT†", xEnd - 43, ly + 32 + ((mAnc - 1) * wireStep) * 0.5);

    // Right: Fejér Kernel Histogram over 2^m Bins
    const rx = W * 0.52, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Measured Bitstring Histogram P(y) vs True Phase φ");
    const gx = rx + 24, gy = ry + 30, gw = rw - 38, gh = rh - 48;
    const nBins = Math.min(32, M);
    const bw = gw / nBins;
    const bestBin = Math.round(phi * M) % M;

    for (let i = 0; i < nBins; i++) {
      const yVal = (i / nBins) * M;
      const diff = phi * M - yVal;
      const pBin = Math.abs(diff) < 1e-4 ? 1.0 : Math.pow(Math.sin(Math.PI * diff) / (M * Math.sin((Math.PI * diff) / M)), 2);
      const bh = Math.min(gh * 0.9, pBin * gh * 0.9);
      ctx.fillStyle = pBin > 0.35 ? C.ok : C.primary;
      ctx.fillRect(gx + i * bw + 1, gy + gh - bh, Math.max(2, bw - 2), bh);
    }

    return {
      "True Eigenphase φ": phi.toFixed(4),
      "Estimated φ̂ = y*/2^m": (bestBin / M).toFixed(4),
      "Precision Bits m": `${mAnc} bits (${M} bins)`,
      "Trotter Error O(t²/N)": (0.08 / trotter).toFixed(4),
    };
  };

  // 26. qc_vqe_h2_pes
  R.qc_vqe_h2_pes = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Variational Quantum Eigensolver (VQE) — H₂ Potential Energy Surface E(R)", st.spec.formula);
    const Rdist = 0.35 + st.a * 2.2; // Angstrom
    const layers = Math.round(1 + st.b * 5);
    const shotNoise = st.c * 0.08;

    function morseFCI(r) {
      const De = 0.1745, re = 0.741, a = 1.95;
      return -1.137 + De * Math.pow(1 - Math.exp(-a * (r - re)), 2) - De;
    }
    const eFCI = morseFCI(Rdist);
    const chemErr = 0.045 * Math.exp(-layers * 0.65) + shotNoise * 0.35;
    const eVQE = eFCI + chemErr;

    // Left: H₂ Dissociation Curve E(R) (Hartree-Fock vs VQE vs Exact FCI)
    const lx = 14, ly = 44, lw = W * 0.56 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "H₂ Potential Energy Curve E(R) in Hartree (Ha)");
    const gx = lx + 28, gy = ry => 0, gw = lw - 44, gh = lh - 50, py0 = ly + 30;

    // Exact FCI curve
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const r = 0.35 + (i / 60) * 2.2;
      const e = morseFCI(r);
      const px = gx + (i / 60) * gw;
      const py = py0 + ((e + 1.0) / -0.35) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // VQE curve (dashed)
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const r = 0.35 + (i / 60) * 2.2;
      const e = morseFCI(r) + chemErr * (1 + 0.4 * r);
      const px = gx + (i / 60) * gw;
      const py = py0 + ((e + 1.0) / -0.35) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Current bond length marker
    const curX = gx + ((Rdist - 0.35) / 2.2) * gw;
    const curY = py0 + ((eVQE + 1.0) / -0.35) * gh;
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Right: H-H Molecule Bond + UCCSD Ansatz Circuit
    const rx = W * 0.56, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "H–H Bond Orbital Overlap & UCCSD Ansatz U(θ)");
    const mcx = rx + rw * 0.5, mcy = ry + rh * 0.38;
    const sepPx = 14 + Rdist * 28;

    ctx.fillStyle = "rgba(103,232,249,0.28)";
    ctx.beginPath();
    ctx.arc(mcx - sepPx * 0.5, mcy, 24, 0, Math.PI * 2);
    ctx.arc(mcx + sepPx * 0.5, mcy, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.text;
    ctx.beginPath();
    ctx.arc(mcx - sepPx * 0.5, mcy, 5, 0, Math.PI * 2);
    ctx.arc(mcx + sepPx * 0.5, mcy, 5, 0, Math.PI * 2);
    ctx.fill();

    return {
      "Bond Distance R": Rdist.toFixed(2) + " Å",
      "VQE Energy E(θ*)": eVQE.toFixed(4) + " Ha",
      "Exact FCI Ground": eFCI.toFixed(4) + " Ha",
      "Chemical Accuracy": chemErr < 0.0016 ? "Achieved (<1.6 mHa) ✓" : `${(chemErr * 1000).toFixed(1)} mHa error`,
    };
  };

  // 27. qc_qaoa_maxcut
  R.qc_qaoa_maxcut = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("QAOA MaxCut Graph Partition & (γ, β) Expectation Landscape", st.spec.formula);
    const pDepth = Math.round(1 + st.a * 5);
    const gamma = st.b;
    const beta = st.c;

    const approxRatio = Math.min(0.98, 0.692 + (1 - Math.exp(-pDepth * 0.45)) * 0.22 * (0.5 + 0.5 * Math.sin(gamma * Math.PI) * Math.cos(beta * Math.PI)));

    // Left: 6-Vertex 3-Regular Graph with Cut Edges Highlighted
    const lx = 14, ly = 44, lw = W * 0.48 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "MaxCut Bipartition (|0⟩ Blue vs |1⟩ Gold) & Cut Edges");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.33;
    const nodes = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
      nodes.push({ x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R, part: i % 2 });
    }
    const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4], [2, 5]];
    edges.forEach(([u, v]) => {
      const cut = nodes[u].part !== nodes[v].part;
      ctx.strokeStyle = cut ? C.ok : "rgba(255,255,255,0.2)";
      ctx.lineWidth = cut ? 2.4 : 1.2;
      ctx.beginPath();
      ctx.moveTo(nodes[u].x, nodes[u].y);
      ctx.lineTo(nodes[v].x, nodes[v].y);
      ctx.stroke();
    });
    nodes.forEach((n, idx) => {
      ctx.fillStyle = n.part ? C.accent : C.primary;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f1222";
      ctx.font = "bold 10px monospace";
      ctx.fillText(String(idx), n.x - 3, n.y + 3);
    });

    // Right: 2D (γ, β) Expectation Landscape Heatmap
    const rx = W * 0.48, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Cost Landscape ⟨γ,β| H_C |γ,β⟩ over (γ, β) ∈ [0, π]²");
    const gx = rx + 24, gy = ry + 30, gw = rw - 38, gh = rh - 46;
    const Ngrid = 18;
    for (let ix = 0; ix < Ngrid; ix++) {
      for (let iy = 0; iy < Ngrid; iy++) {
        const g = ix / Ngrid, b = iy / Ngrid;
        const val = 0.5 + 0.5 * Math.sin(g * Math.PI * 2) * Math.sin(b * Math.PI * 2);
        const hue = 220 - val * 160;
        ctx.fillStyle = `hsla(${hue}, 80%, 52%, 0.72)`;
        ctx.fillRect(gx + g * gw, gy + (1 - b) * gh - gh / Ngrid, gw / Ngrid + 1, gh / Ngrid + 1);
      }
    }
    ctx.strokeStyle = C.text;
    ctx.beginPath();
    ctx.arc(gx + gamma * gw, gy + (1 - beta) * gh, 5, 0, Math.PI * 2);
    ctx.stroke();

    return {
      "QAOA Depth p": `p = ${pDepth}`,
      "Approx Ratio r": approxRatio.toFixed(3),
      "Goemans–Williamson": "0.878 benchmark",
      "Expected Cut ⟨H_C⟩": (approxRatio * 9).toFixed(2) + " / 9 edges",
    };
  };

  // 28. qc_surface_code_mwpm
  R.qc_surface_code_mwpm = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Rotated Surface Code [[d², 1, d]] Stabilizer Plaquettes & MWPM Decoder", st.spec.formula);
    const d = 3 + Math.round(st.a * 2) * 2; // 3, 5, 7
    const pPhys = 0.1 + st.b * 2.2; // %
    const rounds = Math.round(1 + st.c * 9);

    const pThresh = 1.0;
    const pLogical = 0.03 * Math.pow(pPhys / pThresh, (d + 1) / 2);

    // Left: Rotated Surface Code Checkerboard Lattice + Syndrome Defects
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `[[${d * d}, 1, ${d}]] X-Stabilizers (Blue), Z-Stabilizers (Pink) & MWPM Chains`);
    const cell = Math.min((lw - 56) / d, (lh - 56) / d);
    const ox = lx + (lw - cell * (d - 1)) * 0.5;
    const oy = ly + (lh - cell * (d - 1)) * 0.54;

    // Checkerboard stabilizer tiles
    for (let r = 0; r < d - 1; r++) {
      for (let c = 0; c < d - 1; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? "rgba(124,156,255,0.22)" : "rgba(255,143,171,0.22)";
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(ox + c * cell, oy + r * cell, cell, cell);
        ctx.strokeRect(ox + c * cell, oy + r * cell, cell, cell);
      }
    }

    // Data qubits at vertices
    for (let r = 0; r < d; r++) {
      for (let c = 0; c < d; c++) {
        ctx.fillStyle = C.text;
        ctx.beginPath();
        ctx.arc(ox + c * cell, oy + r * cell, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // MWPM error chain + paired syndrome anyons
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox + 0.5 * cell, oy + 0.5 * cell);
    ctx.lineTo(ox + (d - 1.5) * cell, oy + 1.5 * cell);
    ctx.stroke();

    // Right: Threshold Crossing Curves P_L(p) for d = 3, 5, 7
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Logical Error Suppression Below Threshold p_th ≈ 1.0%");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    [3, 5, 7].forEach((dist, idx) => {
      ctx.strokeStyle = [C.secondary, "#67e8f9", C.ok][idx];
      ctx.lineWidth = dist === d ? 2.6 : 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 50; i++) {
        const p = 0.1 + (i / 50) * 2.0;
        const pl = Math.min(1, 0.15 * Math.pow(p / pThresh, (dist + 1) / 2));
        const px = gx + (i / 50) * gw;
        const py = gy + gh - pl * gh * 0.85;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    return {
      "Surface Code [[n,k,d]]": `[[${d * d}, 1, ${d}]]`,
      "Physical Error p": pPhys.toFixed(2) + "%",
      "Logical Error P_L": pLogical.toExponential(2),
      "Regime": pPhys < pThresh ? "Fault-Tolerant (p < p_th) ✓" : "Above Threshold",
    };
  };

  // 29. qc_shor_steane_qec
  R.qc_shor_steane_qec = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Steane [[7,1,3]] Fano Plane & CSS Stabilizer Syndrome Table", st.spec.formula);
    const qErr = Math.max(1, Math.min(7, Math.round(1 + st.a * 6)));
    const pType = Math.round(1 + st.b * 2); // 1=X, 2=Z, 3=Y
    const pLabel = ["I", "X", "Z", "Y"][pType];

    // Steane 7-qubit parity check matrix rows
    const Hmat = [
      [1, 0, 1, 0, 1, 0, 1],
      [0, 1, 1, 0, 0, 1, 1],
      [0, 0, 0, 1, 1, 1, 1],
    ];
    const synBits = Hmat.map((row) => row[qErr - 1]);

    // Left: Fano Plane [[7,1,3]] Geometry
    const lx = 14, ly = 44, lw = W * 0.48 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `Steane [[7,1,3]] Fano Plane (Error ${pLabel} on Qubit q_${qErr})`);
    const cx = lx + lw * 0.5, cy = ly + lh * 0.58, R = Math.min(lw, lh) * 0.32;
    const pts = [
      { x: cx, y: cy - R },
      { x: cx - R * 0.866, y: cy + R * 0.5 },
      { x: cx + R * 0.866, y: cy + R * 0.5 },
      { x: cx - R * 0.433, y: cy - R * 0.25 },
      { x: cx + R * 0.433, y: cy - R * 0.25 },
      { x: cx, y: cy + R * 0.5 },
      { x: cx, y: cy },
    ];
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
    ctx.lineTo(pts[2].x, pts[2].y);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    pts.forEach((p, idx) => {
      const hit = idx + 1 === qErr;
      ctx.fillStyle = hit ? C.danger : C.primary;
      ctx.beginPath();
      ctx.arc(p.x, p.y, hit ? 11 : 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.text;
      ctx.font = "bold 10px monospace";
      ctx.fillText(`q${idx + 1}`, p.x - 6, p.y + 3);
    });

    // Right: 6-Generator CSS Stabilizer Table
    const rx = W * 0.48, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "CSS Stabilizer Generators g₁..g₆ & Syndrome s_k");
    for (let g = 0; g < 6; g++) {
      const isZ = g >= 3;
      const row = Hmat[g % 3];
      const antiCommutes = row[qErr - 1] === 1 && ((isZ && (pType === 1 || pType === 3)) || (!isZ && (pType === 2 || pType === 3)));
      const yRow = ry + 36 + g * 24;
      ctx.fillStyle = antiCommutes ? "rgba(255,107,107,0.25)" : "rgba(110,231,183,0.12)";
      ctx.fillRect(rx + 12, yRow - 12, rw - 24, 20);
      ctx.fillStyle = C.text;
      ctx.font = "11px monospace";
      const opStr = row.map((b) => (b ? (isZ ? "Z" : "X") : "I")).join(" ");
      ctx.fillText(`g_${g + 1} = [${opStr}]  →  s_${g + 1} = ${antiCommutes ? "-1 (TRIGGER)" : "+1"}`, rx + 18, yRow + 2);
    }

    return {
      "Injected Pauli Error": `${pLabel}_${qErr}`,
      "Binary Syndrome": synBits.reverse().join(""),
      "Decoded Location": `Qubit q_${qErr}`,
      "Recovery Operation": `Apply ${pLabel}†_${qErr} → Restored ✓`,
    };
  };

  // 30. qc_lindblad_decoherence
  R.qc_lindblad_decoherence = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Lindblad Master Equation — T₁ Amplitude Damping & T₂ Dephasing Ellipsoid", st.spec.formula);
    const gamma1 = 0.1 + st.a * 1.9;
    const gammaPhi = 0.05 + st.b * 2.5;
    const nth = st.c * 0.5;

    const gamma2 = 0.5 * gamma1 * (1 + 2 * nth) + gammaPhi;
    const tSnap = 0.6;
    const rXY = Math.exp(-gamma2 * tSnap);
    const rZ = Math.exp(-gamma1 * (1 + 2 * nth) * tSnap);
    const zShift = (1 - rZ) / (1 + 2 * nth);

    // Left: Shrinking Bloch Ellipsoid Inside Unit Sphere
    const lx = 14, ly = 44, lw = W * 0.48 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Kraus Channel Contraction of the Bloch Ball");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.34;

    // Outer pure-state boundary
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Contracted noisy ellipsoid shifted toward |0⟩ north pole
    ctx.fillStyle = "rgba(103,232,249,0.24)";
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy - zShift * R, R * rXY, R * rZ, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right: Purity Tr(ρ²) & Coherence |ρ₀₁(t)| Decay Curves
    const rx = W * 0.48, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Coherence |ρ₀₁(t)| (Cyan) & Longitudinal ρ₁₁(t) (Pink)");
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 48;

    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 2.5;
      const py = gy + gh - Math.exp(-gamma2 * t) * gh * 0.85;
      if (i === 0) ctx.moveTo(gx + (i / 60) * gw, py);
      else ctx.lineTo(gx + (i / 60) * gw, py);
    }
    ctx.stroke();

    ctx.strokeStyle = C.secondary;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 2.5;
      const py = gy + gh - Math.exp(-gamma1 * t) * gh * 0.85;
      if (i === 0) ctx.moveTo(gx + (i / 60) * gw, py);
      else ctx.lineTo(gx + (i / 60) * gw, py);
    }
    ctx.stroke();

    return {
      "Relaxation Time T₁": (1 / gamma1).toFixed(2) + " µs",
      "Dephasing Time T₂": (1 / gamma2).toFixed(2) + " µs",
      "Transverse Scale r_xy": rXY.toFixed(3),
      "Purity Tr(ρ²)": (0.5 * (1 + rXY * rXY * 0.5 + rZ * rZ * 0.5)).toFixed(3),
    };
  };

  // 31. qc_transmon_cqed
  R.qc_transmon_cqed = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Superconducting Transmon Cosine Potential & Dispersive IQ Readout", st.spec.formula);
    const ejEc = 25 + st.a * 75;
    const chiMhz = 0.5 + st.b * 4.5;
    const nPhot = 2 + st.c * 25;

    const snr = Math.sqrt(nPhot) * (chiMhz / 2.2);

    // Left: Josephson Cosine Well -E_J cos(φ) + Anharmonic Eigenstates |0⟩, |1⟩, |2⟩
    const lx = 14, ly = 44, lw = W * 0.5 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `Josephson Potential −E_J cos(φ) & Anharmonicity α ≈ −E_C`);
    const gx = lx + 24, gy = ly + 28, gw = lw - 38, gh = lh - 46;

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 70; i++) {
      const phi = ((i / 70) * 2 - 1) * Math.PI;
      const v = (1 - Math.cos(phi)) * 0.5;
      const px = gx + (i / 70) * gw;
      const py = gy + gh - v * gh * 0.86;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Energy levels |0⟩, |1⟩, |2⟩ with decreasing spacing
    const eLevels = [0.16, 0.44, 0.67 - 3.5 / ejEc];
    const lCols = [C.ok, "#67e8f9", C.secondary];
    eLevels.forEach((el, idx) => {
      const lyVal = gy + gh - el * gh * 0.86;
      ctx.strokeStyle = lCols[idx];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx + gw * 0.25, lyVal);
      ctx.lineTo(gx + gw * 0.75, lyVal);
      ctx.stroke();
      ctx.fillStyle = lCols[idx];
      ctx.font = "10px monospace";
      ctx.fillText(`|${idx}⟩`, gx + gw * 0.77, lyVal + 3);
    });

    // Right: Dispersive IQ Plane Gaussian Readout Blobs for |0⟩ and |1⟩
    const rx = W * 0.5, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Dispersive Cavity Readout in Quadrature (I, Q) Plane");
    const icx = rx + rw * 0.5, icy = ry + rh * 0.54;
    const sep = Math.min(rw * 0.28, 14 + snr * 11);

    [
      { x: icx - sep, col: C.ok, lbl: "|0⟩ Blob" },
      { x: icx + sep, col: C.secondary, lbl: "|1⟩ Blob" },
    ].forEach((b) => {
      ctx.fillStyle = b.col + "33";
      ctx.strokeStyle = b.col;
      ctx.beginPath();
      ctx.arc(b.x, icy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = C.text;
      ctx.fillText(b.lbl, b.x - 20, icy + 36);
    });

    return {
      "E_J / E_C Ratio": ejEc.toFixed(1),
      "Dispersive Pull 2χ/2π": (2 * chiMhz).toFixed(2) + " MHz",
      "Readout SNR": snr.toFixed(2),
      "Assignment Fidelity": (Math.min(99.95, 50 + 49.95 * Math.tanh(snr * 0.45))).toFixed(2) + "%",
    };
  };

  // 32. qc_trapped_ion_ms
  R.qc_trapped_ion_ms = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Trapped-Ion Linear Paul Trap & Mølmer–Sørensen Phase-Space Loops", st.spec.formula);
    const delta = 0.5 + st.a * 2.5;
    const eta = 0.04 + st.b * 0.14;
    const heat = st.c * 50;

    const closureErr = Math.abs(Math.sin(delta * Math.PI));
    const gateFid = Math.max(0.75, 1.0 - closureErr * 0.12 - heat * 0.0015);

    // Left: Linear Ion Chain in RF Paul Trap + Bichromatic Laser Beams
    const lx = 14, ly = 44, lw = W * 0.48 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "171Yb⁺ / 40Ca⁺ Linear Ion Crystal & Bichromatic Raman Beams");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;

    // RF electrodes
    ctx.fillStyle = "rgba(154,163,199,0.22)";
    ctx.fillRect(lx + 24, cy - 58, lw - 48, 10);
    ctx.fillRect(lx + 24, cy + 48, lw - 48, 10);

    // 4 oscillating ions
    for (let i = -1.5; i <= 1.5; i += 1) {
      const ix = cx + i * 42 + Math.sin(st.t * 6 + i) * 5 * eta * 30;
      ctx.fillStyle = "#67e8f9";
      ctx.beginPath();
      ctx.arc(ix, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      // Bichromatic laser cone on central two ions
      if (Math.abs(i) < 1) {
        ctx.fillStyle = "rgba(255,143,171,0.22)";
        ctx.fillRect(ix - 8, cy - 48, 16, 96);
      }
    }

    // Right: Motional Phase-Space (X, P) Trajectory Loop
    const rx = W * 0.48, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Motional Phase-Space Trajectory α(t) (Enclosed Area = Φ_MS)");
    const pcx = rx + rw * 0.5, pcy = ry + rh * 0.54, loopR = Math.min(rw, rh) * 0.26;

    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(pcx - loopR * 0.5, pcy, loopR * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = C.secondary;
    ctx.beginPath();
    ctx.arc(pcx + loopR * 0.5, pcy, loopR * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    return {
      "Lamb–Dicke Parameter η": eta.toFixed(3),
      "Geometric Phase Φ": "π / 4 rad (Bell Gate)",
      "Motional Residual |α(t_g)|": closureErr.toFixed(3),
      "MS Gate Fidelity F": (gateFid * 100).toFixed(2) + "%",
    };
  };

  // 33. qc_neutral_atom_rydberg
  R.qc_neutral_atom_rydberg = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Neutral-Atom Optical Tweezers & Rydberg Blockade Sphere (R < R_b)", st.spec.formula);
    const Rdist = 2.0 + st.a * 10.0; // um
    const omegaMhz = 1.0 + st.b * 9.0;
    const tempUk = 1 + st.c * 30;

    const C6 = 860000; // MHz * um^6 for Rb 70S
    const Rb = Math.pow(C6 / omegaMhz, 1 / 6);
    const vdwShift = C6 / Math.pow(Rdist, 6);
    const blockaded = Rdist < Rb;

    // Left: Optical Tweezer Array + Rydberg Blockade Spheres
    const lx = 14, ly = 44, lw = W * 0.52 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, blockaded ? "RYDBERG BLOCKADE ACTIVE (R < R_b: |rr⟩ Doubly-Excited Suppressed)" : "Outside Blockade Radius (Independent Rotations)");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
    const sepPx = Math.min(lw * 0.62, Rdist * 14);
    const rbPx = Rb * 7;

    // Blockade spheres
    ctx.fillStyle = blockaded ? "rgba(192,132,252,0.22)" : "rgba(124,156,255,0.12)";
    ctx.strokeStyle = "#c084fc";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(cx - sepPx * 0.5, cy, rbPx, 0, Math.PI * 2);
    ctx.arc(cx + sepPx * 0.5, cy, rbPx, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Atom tweezers
    [-0.5, 0.5].forEach((s) => {
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(cx + s * sepPx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Right: V_vdW(R) = C_6 / R^6 Curve & |rr⟩ Energy Shift
    const rx = W * 0.52, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Van der Waals Shift V(R) = C₆/R⁶ vs Rabi Drive Ω");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const r = 2.0 + (i / 60) * 10.0;
      const vLog = Math.min(1, Math.log10(1 + C6 / Math.pow(r, 6)) / 5.5);
      const px = gx + (i / 60) * gw;
      const py = gy + gh - vLog * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Blockade Radius R_b": Rb.toFixed(2) + " µm",
      "Tweezer Spacing R": Rdist.toFixed(2) + " µm",
      "vdW Shift V(R)/2π": vdwShift > 1000 ? (vdwShift / 1000).toFixed(1) + " GHz" : vdwShift.toFixed(1) + " MHz",
      "CZ Gate Regime": blockaded ? "Blockaded (√2 Ω Collective) ✓" : "Unblockaded Leakage",
    };
  };

  // 34. qc_bb84_qkd
  R.qc_bb84_qkd = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("BB84 Quantum Key Distribution — Basis Sifting & Eavesdropper QBER", st.spec.formula);
    const evePct = st.a * 100;
    const distKm = 5 + st.b * 95;
    const darkRate = st.c * 0.04;

    const qber = 0.25 * (evePct / 100) + darkRate + distKm * 0.0003;
    const h2 = (p) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
    const secRate = Math.max(0, 1 - 2 * h2(Math.min(0.5, qber)));

    // Top: Alice, Eve & Bob Polarization Basis Sifting Table
    const lx = 14, ly = 44, lw = W - 28, lh = (H - 64) * 0.52;
    st.panel(lx, ly, lw, lh, "BB84 Sifted Photon Stream (+ Rectilinear vs × Diagonal Basis)");
    const cols = 10, cw = (lw - 80) / cols;
    const rows = ["Alice Bit", "Alice Basis", "Eve Basis", "Bob Basis", "Sifted?"];
    rows.forEach((rName, rIdx) => {
      const ry = ly + 32 + rIdx * 18;
      ctx.fillStyle = C.muted;
      ctx.font = "10px monospace";
      ctx.fillText(rName, lx + 10, ry);
      for (let c = 0; c < cols; c++) {
        const aBit = (c * 7 + 3) % 2;
        const aBas = c % 2 === 0 ? "+" : "×";
        const bBas = (c + 1) % 3 === 0 ? "×" : "+";
        const match = aBas === bBas;
        let txt = "";
        if (rIdx === 0) txt = String(aBit);
        else if (rIdx === 1) txt = aBas;
        else if (rIdx === 2) txt = c / cols < evePct / 100 ? "🕵️" : "—";
        else if (rIdx === 3) txt = bBas;
        else txt = match ? "✓" : "✗";
        ctx.fillStyle = match ? C.ok : C.muted;
        ctx.fillText(txt, lx + 86 + c * cw, ry);
      }
    });

    // Bottom: Secret Key Rate r = 1 - 2 h₂(QBER) vs 11% Shor-Preskill Bound
    const by = ly + lh + 8, bh = H - by - 12;
    st.panel(lx, by, lw, bh, "Asymptotic Secret Key Fraction vs QBER (Abort Threshold = 11.0%)");
    const gx = lx + 28, gy = by + 26, gw = lw - 44, gh = bh - 38;
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const q = (i / 50) * 0.25;
      const r = Math.max(0, 1 - 2 * h2(q));
      const px = gx + (i / 50) * gw;
      const py = gy + gh - r * gh * 0.86;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Measured QBER": (qber * 100).toFixed(2) + "%",
      "Shor–Preskill Bound": "11.00%",
      "Secret Key Fraction r": secRate.toFixed(3) + " bits/sifted",
      "Channel Security": qber < 0.11 ? "Information-Theoretic Safe ✓" : "ABORT: Eavesdropper Detected!",
    };
  };

  // 35. qc_quantum_teleportation
  R.qc_quantum_teleportation = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Quantum State Teleportation — Bell Measurement & Pauli X^n Z^m Feedforward", st.spec.formula);
    const thetaDeg = st.a * 180;
    const phiDeg = st.b * 360;
    const fidBell = 0.65 + st.c * 0.35;

    const outFidelity = (2 * fidBell + 1) / 3;

    // Center: 3-Qubit Teleportation Circuit + Classical Double-Wire Feedforward
    const lx = 14, ly = 44, lw = W - 28, lh = H - 56;
    st.panel(lx, ly, lw, lh, "3-Qubit Teleportation Protocol: |ψ⟩_A + |Φ⁺⟩_{BC} → Bell Meas (m, n) → Bob Z^m X^n");
    const y0 = ly + lh * 0.26, y1 = ly + lh * 0.52, y2 = ly + lh * 0.78;
    const xStart = lx + 65, xEnd = lx + lw - 85;

    [
      { y: y0, lbl: "q₀ |ψ⟩_A" },
      { y: y1, lbl: "q₁ Alice" },
      { y: y2, lbl: "q₂ Bob" },
    ].forEach((w) => {
      ctx.fillStyle = C.text;
      ctx.font = "11px monospace";
      ctx.fillText(w.lbl, lx + 12, w.y + 4);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(xStart, w.y);
      ctx.lineTo(xEnd, w.y);
      ctx.stroke();
    });

    // EPR entanglement creation between q1 & q2
    const xEPR = xStart + (xEnd - xStart) * 0.18;
    ctx.strokeStyle = "#c084fc";
    ctx.beginPath();
    ctx.moveTo(xEPR, y1);
    ctx.lineTo(xEPR, y2);
    ctx.stroke();

    // Alice Bell measurement CNOT + H + Meters
    const xBell = xStart + (xEnd - xStart) * 0.45;
    ctx.strokeStyle = "#67e8f9";
    ctx.beginPath();
    ctx.moveTo(xBell, y0);
    ctx.lineTo(xBell, y1);
    ctx.stroke();

    // Classical feedforward arcs from Alice's meters to Bob's X and Z gates
    const xMeas = xStart + (xEnd - xStart) * 0.62;
    const xBob = xStart + (xEnd - xStart) * 0.82;
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(xMeas, y1);
    ctx.lineTo(xBob - 18, y2);
    ctx.moveTo(xMeas, y0);
    ctx.lineTo(xBob + 18, y2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Input and Teleported Bloch spheres on sides
    const th = (thetaDeg * Math.PI) / 180;
    [
      { x: lx + 42, y: y0, r: 16 },
      { x: xEnd + 42, y: y2, r: 22 },
    ].forEach((b) => {
      ctx.strokeStyle = C.ok;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x + Math.sin(th) * b.r * 0.85, b.y - Math.cos(th) * b.r * 0.85);
      ctx.stroke();
    });

    return {
      "Input State (θ, φ)": `(${thetaDeg.toFixed(0)}°, ${phiDeg.toFixed(0)}°)`,
      "EPR Pair Fidelity": (fidBell * 100).toFixed(1) + "%",
      "Teleported Fidelity F": (outFidelity * 100).toFixed(2) + "%",
      "Classical Limit 2/3": outFidelity > 0.667 ? "Quantum Advantage ✓" : "Below Classical 66.7%",
    };
  };

  // 36. qc_mps_tensor_network
  R.qc_mps_tensor_network = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Matrix Product State (MPS) Tensor Chain & Schmidt Entanglement Spectrum", st.spec.formula);
    const chi = Math.round(2 + st.a * 30);
    const gCrit = 0.2 + st.b * 1.8;
    const nSites = Math.round(6 + st.c * 8);

    const isCritical = Math.abs(gCrit - 1.0) < 0.2;
    const sEnt = Math.min(Math.log2(chi), 0.35 + (isCritical ? 0.85 : 0.25) * Math.log2(nSites));

    // Top: MPS Tensor Network Diagram with Virtual Bond Dimension χ and Physical Legs
    const lx = 14, ly = 44, lw = W - 28, lh = (H - 64) * 0.46;
    st.panel(lx, ly, lw, lh, `1D MPS Tensor Network (N = ${nSites} Sites, Virtual Bond Dimension χ = ${chi})`);
    const cy = ly + lh * 0.48;
    const step = (lw - 64) / Math.max(1, nSites - 1);

    // Virtual horizontal bonds (thickness scales with log(chi))
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2 + Math.log2(chi) * 1.3;
    ctx.beginPath();
    ctx.moveTo(lx + 32, cy);
    ctx.lineTo(lx + 32 + (nSites - 1) * step, cy);
    ctx.stroke();

    // Bipartition entanglement cut line at middle bond
    const cutX = lx + 32 + (Math.floor(nSites / 2) - 0.5) * step;
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cutX, ly + 22);
    ctx.lineTo(cutX, ly + lh - 8);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < nSites; i++) {
      const tx = lx + 32 + i * step;
      // Physical leg downward
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx, cy);
      ctx.lineTo(tx, cy + 28);
      ctx.stroke();
      // Tensor node A^[i]
      ctx.fillStyle = "#222b4c";
      ctx.strokeStyle = C.primary;
      ctx.fillRect(tx - 11, cy - 11, 22, 22);
      ctx.strokeRect(tx - 11, cy - 11, 22, 22);
    }

    // Bottom: Singular Value Schmidt Spectrum λ_k Across Cut
    const by = ly + lh + 8, bh = H - by - 12;
    st.panel(lx, by, lw, bh, "Schmidt Singular Value Decay λ_k & Truncation Cutoff χ");
    const gx = lx + 28, gy = by + 26, gw = lw - 44, gh = bh - 36;
    for (let k = 0; k < 20; k++) {
      const decay = isCritical ? Math.pow(k + 1, -0.85) : Math.exp(-k * 0.38);
      const barH = decay * gh * 0.88;
      ctx.fillStyle = k < chi ? C.ok : C.danger;
      ctx.fillRect(gx + (k / 20) * gw + 2, gy + gh - barH, gw / 20 - 4, barH);
    }

    return {
      "Bond Dimension χ": String(chi),
      "Max Entropy log₂(χ)": Math.log2(chi).toFixed(2) + " bits",
      "Half-Chain Entropy S_A": sEnt.toFixed(2) + " bits",
      "Scaling Law": isCritical ? "Critical CFT (c/6 log N)" : "Gapped Area Law O(1) ✓",
    };
  };

  // 37. qc_magic_state_distill
  R.qc_magic_state_distill = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("15-to-1 Bravyi–Kitaev Magic State |T⟩ Distillation Factory", st.spec.formula);
    const epsIn = 0.0005 + st.a * 0.015; // raw input error
    const tiers = Math.round(1 + st.b * 1); // 1 or 2 tiers
    const dCode = Math.round(7 + st.c * 14);

    const eps1 = Math.min(0.5, 35 * Math.pow(epsIn, 3));
    const epsOut = tiers === 2 ? Math.min(0.5, 35 * Math.pow(eps1, 3)) : eps1;

    // Left: 15 Raw |T⟩ States Funneling into Reed-Muller [[15,1,3]] Factory
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "15-to-1 Reed–Muller [[15,1,3]] Clifford Distillation Funnel");
    const fx = lx + lw * 0.52, fy = ly + lh * 0.52;

    for (let i = 0; i < 15; i++) {
      const iy = ly + 28 + (i / 14) * (lh - 42);
      ctx.strokeStyle = "rgba(255,143,171,0.45)";
      ctx.beginPath();
      ctx.moveTo(lx + 24, iy);
      ctx.lineTo(fx, fy);
      ctx.stroke();
      ctx.fillStyle = C.secondary;
      ctx.beginPath();
      ctx.arc(lx + 24, iy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Factory core box
    ctx.fillStyle = "#1f2947";
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.2;
    ctx.fillRect(fx - 36, fy - 28, 72, 56);
    ctx.strokeRect(fx - 36, fy - 28, 72, 56);
    ctx.fillStyle = C.text;
    ctx.font = "10px monospace";
    ctx.fillText("15 → 1", fx - 20, fy + 4);

    // Purified output |T⟩
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(fx + 36, fy);
    ctx.lineTo(lx + lw - 24, fy);
    ctx.stroke();
    ctx.fillStyle = C.ok;
    ctx.beginPath();
    ctx.arc(lx + lw - 24, fy, 7, 0, Math.PI * 2);
    ctx.fill();

    // Right: Log-Log Cubic Error Suppression Curve ε_out = 35 ε_in³
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Cubic Error Suppression ε_out = 35 ε_in³");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      const px = gx + u * gw;
      const py = gy + gh - Math.pow(u, 3) * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Raw T-Gate Error ε_in": (epsIn * 100).toFixed(3) + "%",
      "Distilled Error ε_out": epsOut.toExponential(2),
      "Factory Footprint": `${15 * dCode * dCode * 2} phys qubits`,
      "Acceptance Prob": ((1 - 15 * epsIn) * 100).toFixed(1) + "%",
    };
  };

  // 38. qc_hhl_linear_solver
  R.qc_hhl_linear_solver = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("HHL Quantum Linear Solver — Eigenvalue Inversion C/λ_j & Ancilla Post-Selection", st.spec.formula);
    const kappa = 2 + st.a * 28;
    const qpeBits = Math.round(3 + st.b * 5);
    const vtaa = Math.round(1 + st.c * 5);

    const pSucc = Math.min(0.95, (vtaa * 1.8) / (kappa * kappa));

    // Left: Spectral Filter 1/λ_j Curve & Eigenvalue Bars
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Controlled Rotation Spectral Inversion f(λ) = C / λ");
    const gx = lx + 28, gy = ly + 30, gw = lw - 44, gh = lh - 48;

    // 1/lambda hyperbola
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const lam = (1 / kappa) + (i / 60) * (1 - 1 / kappa);
      const inv = (1 / kappa) / lam;
      const px = gx + lam * gw;
      const py = gy + gh - inv * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Eigenvalue mode bars
    for (let j = 1; j <= 6; j++) {
      const lam = (1 / kappa) + ((j - 1) / 5) * (1 - 1 / kappa);
      const inv = (1 / kappa) / lam;
      const bx = gx + lam * gw;
      const bh = inv * gh * 0.85;
      ctx.fillStyle = "rgba(103,232,249,0.55)";
      ctx.fillRect(bx - 5, gy + gh - bh, 10, bh);
    }

    // Right: HHL Block Diagram (QPE → R_y(2 arcsin(C/λ)) → QPE† → Measure |1⟩_anc)
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "HHL Pipeline & Post-Selection Success P(|1⟩_a)");
    const blocks = ["QPE (e^{iAt})", "CR_y(C/λ_j)", "QPE† Uncompute", "Post-Select |1⟩"];
    blocks.forEach((b, i) => {
      const by = ry + 32 + i * 38;
      ctx.fillStyle = "#1f2744";
      ctx.strokeStyle = i === 1 ? C.accent : C.primary;
      ctx.fillRect(rx + 18, by, rw - 36, 26);
      ctx.strokeRect(rx + 18, by, rw - 36, 26);
      ctx.fillStyle = C.text;
      ctx.font = "11px monospace";
      ctx.fillText(b, rx + 28, by + 17);
    });

    return {
      "Condition Number κ(A)": kappa.toFixed(1),
      "Min Eigenvalue λ_min": (1 / kappa).toFixed(3),
      "Post-Select P(|1⟩_a)": (pSucc * 100).toFixed(2) + "%",
      "Runtime Complexity": `O(log(N) · s² · κ²)`,
    };
  };

  // 39. qc_boson_gkp_squeezing
  R.qc_boson_gkp_squeezing = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Photonic Boson Sampling & Gottesman–Kitaev–Preskill (GKP) Phase-Space Comb", st.spec.formula);
    const sqDb = 3 + st.a * 14; // dB squeezing
    const lossPct = st.b * 20;
    const res = 0.5 + st.c * 0.5;

    const deltaWidth = Math.pow(10, -sqDb / 20) + (lossPct / 100) * 0.25;

    // Left: 2D Wigner Function Phase-Space Grid (q, p) with Positive/Negative Interference Peaks
    const lx = 14, ly = 44, lw = W * 0.52 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `GKP Wigner Grid W(q, p) at ${sqDb.toFixed(1)} dB Squeezing`);
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
    const step = Math.min(lw, lh) * 0.14;
    const peakR = Math.max(3, deltaWidth * 24);

    for (let iq = -2; iq <= 2; iq++) {
      for (let ip = -2; ip <= 2; ip++) {
        const neg = (iq + ip) % 2 !== 0;
        const env = Math.exp(-(iq * iq + ip * ip) * deltaWidth * 0.8);
        ctx.fillStyle = neg ? `rgba(255,107,107,${0.75 * env})` : `rgba(103,232,249,${0.85 * env})`;
        ctx.beginPath();
        ctx.arc(cx + iq * step, cy + ip * step, peakR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Right: Marginal Position Comb ψ(q) Peaks at multiples of √π
    const rx = W * 0.52, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Homodyne Quadrature Comb P(q) — Peaks at 2s√π");
    const gx = rx + 24, gy = ry + 30, gw = rw - 38, gh = rh - 48;

    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const q = ((i / 100) * 2 - 1) * 2.5;
      let sum = 0;
      for (let k = -2; k <= 2; k++) {
        sum += Math.exp(-Math.pow((q - k) / Math.max(0.06, deltaWidth * 0.45), 2)) * Math.exp(-k * k * deltaWidth * 0.5);
      }
      const px = gx + (i / 100) * gw;
      const py = gy + gh - Math.min(1, sum) * gh * 0.86;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Squeezing Level": sqDb.toFixed(1) + " dB",
      "Peak Width Δ_q": deltaWidth.toFixed(3),
      "FT Threshold (~10.5 dB)": sqDb >= 10.5 && lossPct < 8 ? "Fault-Tolerant GKP ✓" : "Sub-Threshold Squeezing",
      "Wigner Negativity": (Math.max(0, 0.42 - deltaWidth * 0.5) * res).toFixed(3),
    };
  };

  // 40. qc_zne_error_mitigation
  R.qc_zne_error_mitigation = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Zero-Noise Extrapolation (ZNE) — Unitary Gate Folding & Richardson Extrapolation", st.spec.formula);
    const pBase = 0.002 + st.a * 0.025;
    const depth = Math.round(8 + st.b * 32);
    const order = Math.round(1 + st.c * 2); // 1=linear, 2=quadratic, 3=Richardson

    const trueVal = 0.85;
    const lam0 = depth * pBase;
    const scales = [1, 3, 5];
    const pts = scales.map((c) => ({ c, y: trueVal * Math.exp(-c * lam0) }));
    const zneEst = order === 1
      ? 1.5 * pts[0].y - 0.5 * pts[1].y
      : (15 / 8) * pts[0].y - (5 / 4) * pts[1].y + (3 / 8) * pts[2].y;

    // Left: Unitary Folding Diagram U → U (U† U)^k
    const lx = 14, ly = 44, lw = W * 0.46 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Unitary Gate Folding U → U · U† · U (Noise Scale c = 1, 3, 5)");
    scales.forEach((sc, idx) => {
      const wy = ly + 46 + idx * 54;
      ctx.fillStyle = C.muted;
      ctx.font = "10px monospace";
      ctx.fillText(`c = ${sc}λ`, lx + 12, wy + 4);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(lx + 58, wy);
      ctx.lineTo(lx + lw - 16, wy);
      ctx.stroke();
      for (let g = 0; g < sc; g++) {
        const gx = lx + 68 + g * 34;
        ctx.fillStyle = g % 2 === 1 ? "rgba(255,143,171,0.3)" : "rgba(124,156,255,0.3)";
        ctx.strokeStyle = g % 2 === 1 ? C.secondary : C.primary;
        ctx.fillRect(gx, wy - 11, 26, 22);
        ctx.strokeRect(gx, wy - 11, 26, 22);
        ctx.fillStyle = C.text;
        ctx.fillText(g % 2 === 1 ? "U†" : "U", gx + 6, wy + 4);
      }
    });

    // Right: Expectation Value ⟨O⟩(cλ) Extrapolated Back to c = 0
    const rx = W * 0.46, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Richardson Extrapolation to Zero-Noise Limit (c = 0)");
    const gx = rx + 34, gy = ry + 30, gw = rw - 50, gh = rh - 48;

    // Exact decay curve
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const c = (i / 50) * 5.5;
      const val = trueVal * Math.exp(-c * lam0);
      const px = gx + (c / 5.5) * gw;
      const py = gy + gh - val * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Sampled points at c = 1, 3, 5 + extrapolated point at c = 0
    pts.forEach((p) => {
      const px = gx + (p.c / 5.5) * gw;
      const py = gy + gh - p.y * gh;
      ctx.fillStyle = "#67e8f9";
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    // ZNE point at c = 0
    ctx.fillStyle = C.ok;
    ctx.beginPath();
    ctx.arc(gx, gy + gh - Math.min(1, zneEst) * gh, 6, 0, Math.PI * 2);
    ctx.fill();

    return {
      "Ideal Expectation ⟨O⟩₀": trueVal.toFixed(4),
      "Unmitigated ⟨O⟩(λ)": pts[0].y.toFixed(4),
      "ZNE Mitigated ⟨O⟩_ZNE": zneEst.toFixed(4),
      "Bias Reduction": (Math.abs(trueVal - pts[0].y) / Math.max(1e-4, Math.abs(trueVal - zneEst))).toFixed(1) + "× cleaner",
    };
  };

  // =========================================================================
  // 41–60: SYNTHETIC BIOLOGY & LONGEVITY (20 Bespoke Simulations)
  // =========================================================================

  // 41. bio_gardner_toggle_switch
  R.bio_gardner_toggle_switch = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Gardner–Collins Genetic Toggle Switch — Nullclines & Bistable Hysteresis", st.spec.formula);
    const alpha1 = 1.5 + st.a * 4.5;
    const alpha2 = 1.5 + st.b * 4.5;
    const beta = 1.0 + st.c * 3.5;

    const bistable = beta > 1.65 && Math.abs(alpha1 - alpha2) < 2.2;

    // Left: Mutual Repression Plasmid Diagram (LacI ⊣ P_trc, TetR ⊣ P_LtetO)
    const lx = 14, ly = 44, lw = W * 0.44 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Mutual Repression Genetic Latch (LacI ⊣ TetR)");
    const cx = lx + lw * 0.5, yTop = ly + lh * 0.34, yBot = ly + lh * 0.72;

    // Gene 1 (u = LacI) & Gene 2 (v = TetR) boxes
    ctx.fillStyle = "rgba(103,232,249,0.22)";
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2;
    ctx.fillRect(cx - 65, yTop - 14, 130, 28);
    ctx.strokeRect(cx - 65, yTop - 14, 130, 28);
    ctx.fillStyle = C.text;
    ctx.font = "11px monospace";
    ctx.fillText(`P₁ → Repressor u (α₁=${alpha1.toFixed(1)})`, cx - 58, yTop + 4);

    ctx.fillStyle = "rgba(255,143,171,0.22)";
    ctx.strokeStyle = C.secondary;
    ctx.fillRect(cx - 65, yBot - 14, 130, 28);
    ctx.strokeRect(cx - 65, yBot - 14, 130, 28);
    ctx.fillStyle = C.text;
    ctx.fillText(`P₂ → Repressor v (α₂=${alpha2.toFixed(1)})`, cx - 58, yBot + 4);

    // Cross-repression blunt T-bars
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 28, yTop + 14);
    ctx.lineTo(cx - 28, yBot - 18);
    ctx.moveTo(cx - 36, yBot - 18);
    ctx.lineTo(cx - 20, yBot - 18);
    ctx.moveTo(cx + 28, yBot - 14);
    ctx.lineTo(cx + 28, yTop + 18);
    ctx.moveTo(cx + 20, yTop + 18);
    ctx.lineTo(cx + 36, yTop + 18);
    ctx.stroke();

    // Right: Phase Plane (u, v) Nullclines & Stable/Unsaddle Fixed Points
    const rx = W * 0.44, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Phase Plane Nullclines: u = α₁/(1+v^β) vs v = α₂/(1+u^β)");
    const gx = rx + 30, gy = ry + 28, gw = rw - 46, gh = rh - 46;

    // u-nullcline (cyan): u as function of v
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const v = (i / 60) * 6.0;
      const u = alpha1 / (1 + Math.pow(v, beta));
      const px = gx + (u / 6.0) * gw;
      const py = gy + gh - (v / 6.0) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // v-nullcline (pink): v as function of u
    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = (i / 60) * 6.0;
      const v = alpha2 / (1 + Math.pow(u, beta));
      const px = gx + (u / 6.0) * gw;
      const py = gy + gh - (v / 6.0) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Switch Regime": bistable ? "BISTABLE MEMORY (2 Attractors + 1 Saddle) ✓" : "Monostable (Single Fixed Point)",
      "Hill Cooperativity β": beta.toFixed(2),
      "High-u State (u*, v*)": `(${alpha1.toFixed(2)}, ${(alpha2 / (1 + Math.pow(alpha1, beta))).toFixed(2)})`,
      "Promoter Balance α₁/α₂": (alpha1 / alpha2).toFixed(2),
    };
  };

  // 42. bio_elowitz_repressilator
  R.bio_elowitz_repressilator = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Elowitz–Leibler Repressilator — 3-Gene Ring & Limit-Cycle Oscillations", st.spec.formula);
    const alpha = 15 + st.a * 220;
    const nHill = 1.2 + st.b * 2.8;
    const betaRatio = 0.2 + st.c * 2.5;

    const oscillates = nHill > 1.85 && alpha > 45;

    // Left: 3-Gene Cyclic Repression Ring (TetR ⊣ λcI ⊣ LacI ⊣ TetR)
    const lx = 14, ly = 44, lw = W * 0.44 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Cyclic 3-Repressor Network (TetR ⊣ λcI ⊣ LacI)");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.29;
    const genes = [
      { name: "TetR", col: "#67e8f9", phase: 0 },
      { name: "λ-cI", col: C.secondary, phase: (2 * Math.PI) / 3 },
      { name: "LacI", col: C.accent, phase: (4 * Math.PI) / 3 },
    ];

    genes.forEach((g, idx) => {
      const ang = (idx / 3) * Math.PI * 2 - Math.PI / 2;
      const gx = cx + Math.cos(ang) * R, gy = cy + Math.sin(ang) * R;
      const nextAng = (((idx + 1) % 3) / 3) * Math.PI * 2 - Math.PI / 2;
      const nx = cx + Math.cos(nextAng) * R, ny = cy + Math.sin(nextAng) * R;

      ctx.strokeStyle = g.col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      const level = oscillates ? 0.5 + 0.5 * Math.sin(st.t * 3.2 - g.phase) : 0.4;
      ctx.fillStyle = g.col;
      ctx.beginPath();
      ctx.arc(gx, gy, 14 + level * 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f1222";
      ctx.font = "bold 10px monospace";
      ctx.fillText(g.name, gx - 14, gy + 3);
    });

    // Right: 3-Phase Limit Cycle Time-Series Traces
    const rx = W * 0.44, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, oscillates ? "Sustained 120°-Phased Transcriptional Oscillations" : "Damped Spiral to Steady State (Sub-Hopf)");
    const gx = rx + 24, gy = ry + 30, gw = rw - 38, gh = rh - 48;

    genes.forEach((g) => {
      ctx.strokeStyle = g.col;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const env = oscillates ? 1.0 : Math.exp(-u * 3.5);
        const val = 0.5 + 0.42 * env * Math.sin(u * Math.PI * 4 - st.t * 3.2 + g.phase);
        const px = gx + u * gw;
        const py = gy + gh - val * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    return {
      "Hopf Bifurcation": oscillates ? "Supercritical Limit Cycle ✓" : "Stable Fixed Point",
      "Hill Cooperativity n": nHill.toFixed(2),
      "Promoter Strength α": alpha.toFixed(0),
      "Clock Period T": (180 / (1 + betaRatio * 0.45)).toFixed(0) + " min",
    };
  };

  // 43. bio_crispr_cas9_offtarget
  R.bio_crispr_cas9_offtarget = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("CRISPR-Cas9 R-Loop Zipper & PAM-Proximal Seed Mismatch Penalty", st.spec.formula);
    const seedMM = Math.round(st.a * 4);
    const distalMM = Math.round(st.b * 5);
    const rnpConc = 5 + st.c * 95;

    const dgPenalty = seedMM * 4.2 + distalMM * 1.3;
    const cleaveRate = Math.max(0.001, Math.min(1.0, (rnpConc / 50) * Math.exp(-dgPenalty * 0.55)));

    // Top: 20-nt sgRNA-DNA R-Loop + NGG PAM Box
    const lx = 14, ly = 44, lw = W - 28, lh = (H - 64) * 0.48;
    st.panel(lx, ly, lw, lh, "20-nt Guide RNA–Target DNA Hybridization & 5'-NGG-3' PAM");
    const x0 = lx + 28, bw = (lw - 110) / 20, cy = ly + lh * 0.56;

    for (let i = 1; i <= 20; i++) {
      const bx = x0 + (i - 1) * bw;
      const inSeed = i >= 13; // positions 13..20 near PAM
      const isMM = (inSeed && i > 20 - seedMM) || (!inSeed && i <= distalMM);
      ctx.fillStyle = isMM ? C.danger : (inSeed ? C.ok : C.primary);
      ctx.fillRect(bx + 2, cy - (isMM ? 8 : 22), bw - 4, isMM ? 16 : 44);
      ctx.fillStyle = C.text;
      ctx.font = "9px monospace";
      ctx.fillText(String(21 - i), bx + 3, cy + 34);
    }

    // PAM NGG box on right
    const pamX = x0 + 20 * bw + 8;
    ctx.fillStyle = "rgba(255,209,102,0.3)";
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.fillRect(pamX, cy - 24, 58, 48);
    ctx.strokeRect(pamX, cy - 24, 58, 48);
    ctx.fillStyle = C.accent;
    ctx.font = "bold 11px monospace";
    ctx.fillText("NGG PAM", pamX + 6, cy + 4);

    // Bottom: Free Energy Barrier Landscape ΔG(position)
    const by = ly + lh + 8, bh = H - by - 12;
    st.panel(lx, by, lw, bh, "R-Loop Zipping Free-Energy Landscape ΔG(x) & HNH Nuclease Gate");
    const gx = lx + 28, gy = by + 26, gw = lw - 44, gh = bh - 38;
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      const px = gx + u * gw;
      const py = gy + gh * 0.35 + (u * 0.45 - (u > 0.6 ? seedMM * 0.12 : 0) - (u < 0.4 ? distalMM * 0.05 : 0)) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Seed Mismatches (1–8)": String(seedMM),
      "Distal Mismatches (9–20)": String(distalMM),
      "Penalty ΔΔG_MM": "+" + dgPenalty.toFixed(1) + " kcal/mol",
      "Cleavage Activity k_cat": (cleaveRate * 100).toFixed(1) + "%",
    };
  };

  // 44. bio_fba_metabolic_polytope
  R.bio_fba_metabolic_polytope = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Flux Balance Analysis (FBA) — S·v = 0 Network & Phenotypic LP Polytope", st.spec.formula);
    const vGlc = 4 + st.a * 16;
    const vO2 = 5 + st.b * 20;
    const valve = st.c;

    const muGrowth = Math.min(vGlc * 0.085, vO2 * 0.055) * (0.4 + 0.6 * valve);
    const vProduct = vGlc * 1.45 * (1 - 0.65 * valve);

    // Left: Stoichiometric Metabolic Pathway Graph (Glc → G6P → Pyr → TCA / Product)
    const lx = 14, ly = 44, lw = W * 0.48 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Core Stoichiometric Reaction Network (S · v = 0)");
    const cx = lx + lw * 0.5;
    const mets = [
      { id: "Glucose", x: cx, y: ly + 38 },
      { id: "G6P / PEP", x: cx, y: ly + 88 },
      { id: "Pyruvate", x: cx, y: ly + 138 },
      { id: "Biomass μ", x: cx - 58, y: ly + 195 },
      { id: "Product v_p", x: cx + 58, y: ly + 195 },
    ];
    const rxns = [[0, 1, 3], [1, 2, 3], [2, 3, 1 + valve * 3], [2, 4, 4 - valve * 2.5]];
    rxns.forEach(([u, v, w]) => {
      ctx.strokeStyle = v === 4 ? C.accent : "#67e8f9";
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(mets[u].x, mets[u].y);
      ctx.lineTo(mets[v].x, mets[v].y);
      ctx.stroke();
    });
    mets.forEach((m) => {
      ctx.fillStyle = "#1f2744";
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 1.6;
      ctx.fillRect(m.x - 36, m.y - 11, 72, 22);
      ctx.strokeRect(m.x - 36, m.y - 11, 72, 22);
      ctx.fillStyle = C.text;
      ctx.font = "10px monospace";
      ctx.fillText(m.id, m.x - 30, m.y + 3);
    });

    // Right: 2D Feasible LP Flux Polytope (Biomass Growth μ vs Product Flux v_p)
    const rx = W * 0.48, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Feasible LP Production Envelope (Pareto Frontier)");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.fillStyle = "rgba(110,231,183,0.18)";
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh);
    ctx.lineTo(gx, gy + gh * 0.18);
    ctx.lineTo(gx + gw * 0.48, gy + gh * 0.26);
    ctx.lineTo(gx + gw * 0.86, gy + gh * 0.62);
    ctx.lineTo(gx + gw * 0.86, gy + gh);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // LP optimal vertex
    const opX = gx + gw * (0.2 + valve * 0.62);
    const opY = gy + gh * (0.22 + valve * 0.36);
    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(opX, opY, 6, 0, Math.PI * 2);
    ctx.fill();

    return {
      "Specific Growth μ": muGrowth.toFixed(3) + " h⁻¹",
      "Product Flux v_prod": vProduct.toFixed(2) + " mmol/gDW/h",
      "Shadow Price π_O2": (vO2 < vGlc ? -0.42 : 0.0).toFixed(2),
      "Carbon Yield": ((vProduct / (vGlc * 2)) * 100).toFixed(1) + "% C-mol",
    };
  };

  // 45. bio_smith_waterman_dp
  R.bio_smith_waterman_dp = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Smith–Waterman Local Sequence Alignment Matrix & Optimal Traceback", st.spec.formula);
    const gapOpen = Math.round(2 + st.a * 10);
    const gapExt = Math.round(1 + st.b * 4);
    const seqId = 40 + st.c * 58;

    const seqA = "ACGTAGCTT";
    const seqB = "ACGTTGCTA";
    const N = 8;

    // Left: Dynamic Programming Scoring Matrix H_{i,j} with Optimal Traceback Path
    const lx = 14, ly = 44, lw = W * 0.58 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "DP Matrix H_{i,j} & Optimal Local Traceback Arrows");
    const cell = Math.min((lw - 54) / N, (lh - 54) / N);
    const ox = lx + 36, oy = ly + 38;

    for (let i = 0; i < N; i++) {
      ctx.fillStyle = C.accent;
      ctx.font = "bold 11px monospace";
      ctx.fillText(seqA[i], ox + i * cell + cell * 0.35, oy - 6);
      ctx.fillText(seqB[i], ox - 16, oy + i * cell + cell * 0.65);
      for (let j = 0; j < N; j++) {
        const onDiag = Math.abs(i - j) <= 1;
        const score = Math.max(0, (N - Math.abs(i - j) * 3) + i * 2 - (seqA[j] !== seqB[i] ? 3 : 0));
        ctx.fillStyle = i === j ? "rgba(110,231,183,0.28)" : (onDiag ? "rgba(124,156,255,0.16)" : "rgba(255,255,255,0.04)");
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(ox + j * cell, oy + i * cell, cell, cell);
        ctx.strokeRect(ox + j * cell, oy + i * cell, cell, cell);
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(String(score), ox + j * cell + 5, oy + i * cell + cell * 0.65);
      }
    }

    // Traceback path line
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(ox + (N - 0.5) * cell, oy + (N - 0.5) * cell);
    ctx.lineTo(ox + 0.5 * cell, oy + 0.5 * cell);
    ctx.stroke();

    // Right: Aligned Sequence Pair + Karlin-Altschul E-Value
    const rx = W * 0.58, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Optimal Local Alignment & Karlin–Altschul Statistics");
    ctx.fillStyle = "#67e8f9";
    ctx.font = "13px monospace";
    ctx.fillText("Qry: A C G T A G C T", rx + 16, ry + 56);
    ctx.fillStyle = C.ok;
    ctx.fillText("     | | | | . | | |", rx + 16, ry + 76);
    ctx.fillStyle = C.secondary;
    ctx.fillText("Ref: A C G T T G C T", rx + 16, ry + 96);

    const optScore = Math.round(38 + seqId * 0.4 - gapOpen * 1.2);
    return {
      "Optimal SW Score S*": String(optScore),
      "Affine Gap Cost": `-${gapOpen} - ${gapExt}·(k-1)`,
      "Sequence Identity": seqId.toFixed(1) + "%",
      "Karlin–Altschul E-val": (Math.exp(-optScore * 0.28)).toExponential(2),
    };
  };

  // 46. bio_de_bruijn_assembler
  R.bio_de_bruijn_assembler = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("De Bruijn Graph k-mer Genome Assembler & Eulerian Contig Path", st.spec.formula);
    const kLen = Math.round(15 + st.a * 40);
    const covDepth = Math.round(10 + st.b * 90);
    const errRate = st.c * 3.0;

    const repeatResolved = kLen >= 31;
    const n50Kb = Math.round((repeatResolved ? 140 : 28) * (1 - Math.exp(-covDepth / 22)) / (1 + errRate * 0.4));

    // Left: De Bruijn Graph with Repeat Node & Sequencing Error Tip/Bubble
    const lx = 14, ly = 44, lw = W * 0.56 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, repeatResolved ? `k = ${kLen}: Repeat Resolved into Linear Contig ✓` : `k = ${kLen}: Collapsed Repeat Tangle & Error Bubble`);
    const cx = lx + lw * 0.5, cy = ly + lh * 0.52;

    const nodes = repeatResolved
      ? [
          { x: cx - 110, y: cy, lbl: "ATG..C" },
          { x: cx - 35, y: cy, lbl: "TGC..A" },
          { x: cx + 40, y: cy, lbl: "GCA..T" },
          { x: cx + 110, y: cy, lbl: "CAT..G" },
        ]
      : [
          { x: cx - 105, y: cy - 34, lbl: "Prefix A" },
          { x: cx - 105, y: cy + 34, lbl: "Prefix B" },
          { x: cx, y: cy, lbl: "REPEAT" },
          { x: cx + 105, y: cy - 34, lbl: "Suffix A" },
          { x: cx + 105, y: cy + 34, lbl: "Suffix B" },
        ];

    ctx.strokeStyle = repeatResolved ? C.ok : C.accent;
    ctx.lineWidth = 2.4;
    if (repeatResolved) {
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.stroke();
    } else {
      [[0, 2], [1, 2], [2, 3], [2, 4]].forEach(([u, v]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[u].x, nodes[u].y);
        ctx.lineTo(nodes[v].x, nodes[v].y);
        ctx.stroke();
      });
    }

    nodes.forEach((n) => {
      ctx.fillStyle = "#1f2744";
      ctx.strokeStyle = "#67e8f9";
      ctx.fillRect(n.x - 28, n.y - 12, 56, 24);
      ctx.strokeRect(n.x - 28, n.y - 12, 56, 24);
      ctx.fillStyle = C.text;
      ctx.font = "9px monospace";
      ctx.fillText(n.lbl, n.x - 22, n.y + 3);
    });

    // Right: Lander-Waterman Contig N50 vs k-mer Size Curve
    const rx = W * 0.56, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Contig N50 vs k-mer Size Trade-Off");
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 48;

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const k = 15 + (i / 50) * 40;
      const val = Math.exp(-Math.pow((k - 37) / 14, 2));
      const px = gx + (i / 50) * gw;
      const py = gy + gh - val * gh * 0.85;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "k-mer Length k": `${kLen} bp`,
      "Contig N50": `${n50Kb} kb`,
      "Effective Coverage": (covDepth * (1 - kLen / 150)).toFixed(1) + "×",
      "Repeat Resolution": repeatResolved ? "Bridged (k > L_rep) ✓" : "Collapsed Repeat Node",
    };
  };

  // 47. bio_alphafold_se3_evo
  R.bio_alphafold_se3_evo = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("AlphaFold SE(3) Backbone Frame Refinement & Ramachandran (φ, ψ) Map", st.spec.formula);
    const msaNeff = 10 + st.a * 500;
    const recycles = Math.round(1 + st.b * 7);
    const temp = 0.1 + st.c * 1.2;

    const foldProg = Math.min(1, (1 - Math.exp(-msaNeff / 80)) * (recycles / 5));
    const pLDDT = 42 + foldProg * 54 - temp * 6;

    // Left: Polypeptide Backbone Residue Frames T_i = (R_i, t_i) Folding into Helix
    const lx = 14, ly = 44, lw = W * 0.52 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `SE(3) Invariant Point Attention Backbone (pLDDT = ${pLDDT.toFixed(1)})`);
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;

    ctx.strokeStyle = pLDDT > 75 ? "#3b82f6" : C.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const u = (i / 24) * 2 - 1;
      const hx = cx + u * (lw * 0.36);
      const hy = cy + Math.sin(i * 1.1 + st.t * 2) * (36 - foldProg * 16) + Math.cos(i * 2.3) * (1 - foldProg) * 25;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
      // Local residue triangle frame
      if (i % 3 === 0) {
        ctx.fillStyle = "rgba(103,232,249,0.5)";
        ctx.fillRect(hx - 4, hy - 4, 8, 8);
      }
    }
    ctx.stroke();

    // Right: Ramachandran Dihedral Plot (φ, ψ) ∈ [-180°, +180°]²
    const rx = W * 0.52, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Ramachandran Dihedral Map (φ, ψ) — α-Helix & β-Sheet Basins");
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 46;

    // Favored α-helix and β-sheet regions
    ctx.fillStyle = "rgba(110,231,183,0.18)";
    ctx.fillRect(gx + gw * 0.22, gy + gh * 0.52, gw * 0.22, gh * 0.24); // alpha
    ctx.fillRect(gx + gw * 0.14, gy + gh * 0.12, gw * 0.28, gh * 0.26); // beta

    for (let i = 0; i < 18; i++) {
      const targetX = i % 2 === 0 ? 0.32 : 0.26;
      const targetY = i % 2 === 0 ? 0.64 : 0.24;
      const spread = (1 - foldProg) * 0.35;
      const px = gx + (targetX + Math.sin(i * 3.7) * spread) * gw;
      const py = gy + (targetY + Math.cos(i * 5.1) * spread) * gh;
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    return {
      "Mean Confidence pLDDT": pLDDT.toFixed(1),
      "FAPE Loss": (4.8 * (1 - foldProg * 0.82)).toFixed(2) + " Å",
      "Evoformer Recycles": `${recycles} passes`,
      "Ramachandran Favored": (62 + foldProg * 36.5).toFixed(1) + "%",
    };
  };

  // 48. bio_gillespie_ssa
  R.bio_gillespie_ssa = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Gillespie Stochastic Simulation (SSA) — Telegraph Promoter & Bursting", st.spec.formula);
    const bBurst = 1 + st.a * 19;
    const kOn = 0.1 + st.b * 2.0;
    const volScale = 0.5 + st.c * 2.5;

    const fano = 1 + bBurst;
    const meanN = bBurst * kOn * 8 * volScale;

    // Top: Telegraph Promoter ON/OFF State + Discrete mRNA Step Trajectory
    const lx = 14, ly = 44, lw = W * 0.56 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Discrete SSA Trajectory n_mRNA(t) vs Deterministic ODE Mean");
    const gx = lx + 26, gy = ly + 30, gw = lw - 42, gh = lh - 48;

    // Deterministic ODE mean line
    ctx.strokeStyle = "rgba(255,209,102,0.65)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh * 0.52);
    ctx.lineTo(gx + gw, gy + gh * 0.52);
    ctx.stroke();
    ctx.setLineDash([]);

    // Discrete staircase stochastic bursts
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    let yVal = 0.45;
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      if (i % 9 === 2) yVal = Math.min(0.92, yVal + (bBurst / 25) * 0.55);
      else yVal *= 0.91;
      const px = gx + u * gw;
      const py = gy + gh - yVal * gh;
      if (i === 0) ctx.moveTo(px, py);
      else {
        ctx.lineTo(px, gy + gh - yVal * gh);
      }
    }
    ctx.stroke();

    // Right: Negative Binomial / Overdispersed Copy-Number Histogram vs Poisson
    const rx = W * 0.56, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, `Copy-Number Distribution P(n) (Fano Factor = ${fano.toFixed(1)})`);
    const hx = rx + 24, hy = ry + 30, hw = rw - 38, hh = rh - 48;
    for (let k = 0; k < 16; k++) {
      const pNB = Math.exp(-k / (2.5 + bBurst * 0.35)) * (1 + 0.4 * Math.sin(k * 0.4));
      const bh = pNB * hh * 0.85;
      ctx.fillStyle = C.secondary;
      ctx.fillRect(hx + (k / 16) * hw + 2, hy + hh - bh, hw / 16 - 4, bh);
    }

    return {
      "Fano Factor σ²/⟨n⟩": fano.toFixed(2) + " (Super-Poisson)",
      "Mean Burst Size b": bBurst.toFixed(1) + " mRNAs/burst",
      "Mean Copy Number ⟨n⟩": meanN.toFixed(1) + " molecules",
      "Intrinsic Noise CV²": (fano / Math.max(1, meanN)).toFixed(3),
    };
  };

  // 49. bio_monod_chemostat
  R.bio_monod_chemostat = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Monod Continuous Chemostat Bioreactor & Washout Bifurcation (D_crit)", st.spec.formula);
    const D = 0.05 + st.a * 0.95; // dilution rate h^-1
    const Sf = 2 + st.b * 18; // g/L
    const muMax = 0.4 + st.c * 0.8;
    const Ks = 0.5, Yxs = 0.5;

    const dCrit = (muMax * Sf) / (Ks + Sf);
    const washout = D >= dCrit;
    const Sss = washout ? Sf : (Ks * D) / (muMax - D);
    const Xss = washout ? 0 : Yxs * (Sf - Sss);
    const prodDX = D * Xss;

    // Left: Continuous Stirred Chemostat Vessel Diagram
    const lx = 14, ly = 44, lw = W * 0.44 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, washout ? "⚠️ BIOREACTOR WASHOUT (D > D_crit: X* → 0)" : "Continuous Stirred Chemostat (D = μ(S*))");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.56;

    // Bioreactor tank
    ctx.fillStyle = `rgba(110,231,183,${0.12 + (Xss / 10) * 0.65})`;
    ctx.strokeStyle = C.text;
    ctx.lineWidth = 2;
    ctx.fillRect(cx - 48, cy - 52, 96, 104);
    ctx.strokeRect(cx - 48, cy - 52, 96, 104);

    // Spinning impeller blades
    const impAng = st.t * 6;
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 68);
    ctx.lineTo(cx, cy + 20);
    ctx.moveTo(cx - Math.cos(impAng) * 26, cy + 20);
    ctx.lineTo(cx + Math.cos(impAng) * 26, cy + 20);
    ctx.stroke();

    // Right: Steady-State Biomass X*(D), Substrate S*(D) & Productivity D·X*(D)
    const rx = W * 0.44, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Steady-State Biomass X*(D) (Green), S*(D) (Cyan) & D·X* (Gold)");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    // Biomass curve X*(D)
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const dVal = (i / 60) * 1.1;
      const sVal = dVal >= dCrit ? Sf : Math.min(Sf, (Ks * dVal) / Math.max(0.01, muMax - dVal));
      const xVal = Yxs * (Sf - sVal);
      const px = gx + (dVal / 1.1) * gw;
      const py = gy + gh - (xVal / (Yxs * Sf)) * gh * 0.85;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Steady Biomass X*": Xss.toFixed(2) + " g/L",
      "Residual Substrate S*": Sss.toFixed(2) + " g/L",
      "Productivity D·X*": prodDX.toFixed(2) + " g/(L·h)",
      "Critical Washout D_c": dCrit.toFixed(3) + " h⁻¹",
    };
  };

  // 50. bio_horvath_epigenetic_clock
  R.bio_horvath_epigenetic_clock = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Horvath Epigenetic CpG Methylation Clock & Transient OSKM Reprogramming", st.spec.formula);
    const chronAge = 20 + st.a * 65;
    const oskmDays = st.b * 12;
    const sasp = st.c * 1.5;

    const pluripotencyRisk = oskmDays > 7.5;
    const bioAge = Math.max(12, chronAge * (1 + sasp * 0.18) - oskmDays * 3.2);

    // Top: CpG Island Lollipop Array (Methylated 5mC vs Unmethylated C)
    const lx = 14, ly = 44, lw = W - 28, lh = (H - 64) * 0.44;
    st.panel(lx, ly, lw, lh, "CpG Dinucleotide Lollipop Array (Filled = Hyper-Methylated 5mC, Open = Unmethylated)");
    const x0 = lx + 28, step = (lw - 56) / 15, cy = ly + lh * 0.68;

    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, cy);
    ctx.lineTo(x0 + 15 * step, cy);
    ctx.stroke();

    const methFrac = Math.min(0.95, Math.max(0.1, bioAge / 95));
    for (let i = 0; i < 16; i++) {
      const cx = x0 + i * step;
      const isMeth = (i / 16) < methFrac;
      ctx.strokeStyle = C.text;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - 26);
      ctx.stroke();
      ctx.fillStyle = isMeth ? C.secondary : "#0f1222";
      ctx.strokeStyle = isMeth ? C.secondary : "#67e8f9";
      ctx.beginPath();
      ctx.arc(cx, cy - 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Bottom: DNAm Biological Age vs Chronological Age Trajectory
    const by = ly + lh + 8, bh = H - by - 12;
    st.panel(lx, by, lw, bh, pluripotencyRisk ? "⚠️ IDENTITY LOSS THRESHOLD CROSSED (Teratoma Risk > 7d OSKM!)" : "Epigenetic Age Trajectory & Partial OSKM Rejuvenation Dip");
    const gx = lx + 30, gy = by + 24, gw = lw - 46, gh = bh - 36;

    // Diagonal identity line
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rejuvenation trajectory
    ctx.strokeStyle = pluripotencyRisk ? C.danger : C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      const dip = u > 0.65 ? (oskmDays / 12) * 0.35 * Math.sin(((u - 0.65) / 0.35) * Math.PI) : 0;
      const px = gx + u * gw;
      const py = gy + gh - (u * (1 + sasp * 0.15) - dip) * gh * 0.85;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Chronological Age": chronAge.toFixed(1) + " yr",
      "Horvath DNAm Age": bioAge.toFixed(1) + " yr",
      "Epigenetic ΔAge": (bioAge - chronAge).toFixed(1) + " yr",
      "Cell Identity Safety": pluripotencyRisk ? "Dedifferentiated (Unsafe!)" : "Somatic Identity Retained ✓",
    };
  };

  // 51. bio_gompertz_makeham
  R.bio_gompertz_makeham = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Gompertz–Makeham Mortality Hazard h(t) & Senolytic Survival S(t)", st.spec.formula);
    const senoEff = st.a * 0.9;
    const repairMult = 0.8 + st.b * 1.2;
    const Aext = (1 + st.c * 5) * 1e-4;

    const alphaGomp = 0.085 / (repairMult * (1 + senoEff * 0.35));
    const mrdt = Math.LN2 / alphaGomp;
    const medianLife = 78 + (mrdt - 8.15) * 3.8;

    // Left: Survival Curve Rectangularization S(t)
    const lx = 14, ly = 44, lw = W * 0.5 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Cohort Survival Curve S(t) — Control (Red) vs Senolytic + Repair (Green)");
    const gx = lx + 28, gy = ly + 30, gw = lw - 44, gh = lh - 48;

    [
      { alp: 0.085, col: C.danger },
      { alp: alphaGomp, col: C.ok },
    ].forEach((crv) => {
      ctx.strokeStyle = crv.col;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const age = (i / 60) * 120;
        const R0 = 5e-5;
        const surv = Math.exp(-Aext * age - (R0 / crv.alp) * (Math.exp(crv.alp * age) - 1));
        const px = gx + (i / 60) * gw;
        const py = gy + gh - surv * gh * 0.9;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // Right: Semi-Log Mortality Hazard log₁₀ h(t)
    const rx = W * 0.5, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Log-Mortality Hazard log₁₀ h(t) (Gompertz Slope α)");
    const hx = rx + 28, hy = ry + 30, hw = rw - 44, hh = rh - 48;

    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const age = (i / 60) * 110;
      const h = Aext + 5e-5 * Math.exp(alphaGomp * age);
      const logH = Math.min(1, (Math.log10(h) + 4.5) / 4.5);
      const px = hx + (i / 60) * hw;
      const py = hy + hh - logH * hh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Mortality Doubling MRDT": mrdt.toFixed(2) + " yr",
      "Median Lifespan t_50": medianLife.toFixed(1) + " yr",
      "Senescent Burden": ((1 - senoEff * 0.75) * 100).toFixed(0) + "% of baseline",
      "Gompertz Slope α": alphaGomp.toFixed(4) + " yr⁻¹",
    };
  };

  // 52. bio_turing_morphogen
  R.bio_turing_morphogen = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Reaction–Diffusion Morphogen Gradient C(x) & Wolpert French Flag Patterning", st.spec.formula);
    const D = 5 + st.a * 45;
    const k = 0.02 + st.b * 0.18;
    const thHigh = 0.35 + st.c * 0.4;
    const thLow = thHigh * 0.38;

    const lambda = Math.sqrt(D / k); // decay length scale
    const x1 = -lambda * Math.log(thHigh);
    const x2 = -lambda * Math.log(thLow);

    // Top: Exponential Morphogen Concentration C(x) = C₀ exp(-x/λ) + Threshold Lines
    const lx = 14, ly = 44, lw = W - 28, lh = (H - 64) * 0.56;
    st.panel(lx, ly, lw, lh, `Morphogen Decay Gradient C(x) = C₀ e^{−x/λ} (Decay Length λ = ${lambda.toFixed(1)} µm)`);
    const gx = lx + 30, gy = ly + 26, gw = lw - 46, gh = lh - 38;

    // Threshold horizontal lines
    [
      { th: thHigh, col: "#3b82f6", lbl: "T₁ (Blue/White)" },
      { th: thLow, col: C.danger, lbl: "T₂ (White/Red)" },
    ].forEach((t) => {
      const ty = gy + gh - t.th * gh * 0.88;
      ctx.strokeStyle = t.col;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(gx, ty);
      ctx.lineTo(gx + gw, ty);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const xUm = (i / 80) * 100;
      const cVal = Math.exp(-xUm / lambda);
      const px = gx + (i / 80) * gw;
      const py = gy + gh - cVal * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Bottom: Wolpert French Flag 24-Cell Tissue Row (Blue / White / Red Fates)
    const by = ly + lh + 8, bh = H - by - 12;
    st.panel(lx, by, lw, bh, "Wolpert French Flag Embryonic Cell-Fate Boundaries");
    const nCells = 24, cw = (lw - 60) / nCells;
    for (let c = 0; c < nCells; c++) {
      const xUm = ((c + 0.5) / nCells) * 100;
      const conc = Math.exp(-xUm / lambda);
      ctx.fillStyle = conc >= thHigh ? "#3b82f6" : (conc >= thLow ? "#e8ebff" : "#ef4444");
      ctx.fillRect(gx + c * cw + 1, by + 26, cw - 2, bh - 36);
    }

    return {
      "Decay Length λ = √(D/k)": lambda.toFixed(1) + " µm",
      "Anterior Boundary x₁": Math.min(100, x1).toFixed(1) + " µm",
      "Posterior Boundary x₂": Math.min(100, x2).toFixed(1) + " µm",
      "Middle Domain Width": Math.max(0, Math.min(100, x2) - Math.min(100, x1)).toFixed(1) + " µm",
    };
  };

  // 53. bio_quorum_luxi_luxr
  R.bio_quorum_luxi_luxr = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("AHL Quorum Sensing (LuxI / LuxR) — Synchronized Colony Fluorescence", st.spec.formula);
    const od = 0.05 + st.a * 1.45;
    const diffD = 0.1 + st.b * 1.9;
    const aiiA = st.c * 1.2;

    const coup = od * diffD - aiiA * 0.45;
    const orderR = Math.min(0.99, Math.max(0.08, 1 / (1 + Math.exp(-(coup - 0.55) * 6))));

    // Left: Microfluidic Chamber of Rod-Shaped Bacteria Flashing GFP
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `Microfluidic Bacterial Colony (Kuramoto Sync Order r = ${orderR.toFixed(2)})`);
    const nCells = Math.round(12 + od * 22);

    for (let i = 0; i < nCells; i++) {
      const cx = lx + 30 + ((i * 67) % (lw - 60));
      const cy = ly + 36 + ((i * 43) % (lh - 56));
      const indivPhase = i * 1.7 * (1 - orderR);
      const gfp = 0.5 + 0.5 * Math.sin(st.t * 4.2 + indivPhase);
      ctx.fillStyle = `rgba(110,231,183,${0.2 + gfp * 0.8})`;
      ctx.strokeStyle = C.ok;
      ctx.beginPath();
      ctx.roundRect(cx - 10, cy - 4, 20, 8, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Right: Collective Colony Fluorescence & AHL Autoinducer Wave
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Extracellular [AHL] Autoinducer & Synchronized GFP Pulse");
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 48;

    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const y = gy + gh * 0.5 - orderR * Math.sin(u * Math.PI * 4 - st.t * 4.2) * gh * 0.38;
      if (i === 0) ctx.moveTo(gx + u * gw, y);
      else ctx.lineTo(gx + u * gw, y);
    }
    ctx.stroke();

    return {
      "Colony Density OD₆₀₀": od.toFixed(2),
      "Kuramoto Sync Order r": orderR.toFixed(3),
      "AHL Concentration": (od * 120 / (1 + aiiA)).toFixed(1) + " nM",
      "Quorum State": orderR > 0.65 ? "Synchronized Bursting ✓" : "Incoherent Sub-Quorum",
    };
  };

  // 54. bio_codon_ribosome_tasep
  R.bio_codon_ribosome_tasep = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Ribosome Traffic Jam (TASEP) & Synonymous Codon Optimization", st.spec.formula);
    const alphaInit = 0.05 + st.a * 0.85;
    const cai = 0.35 + st.b * 0.63;
    const stallDepth = st.c * 0.85;

    const kSlow = Math.max(0.12, cai * (1 - stallDepth * 0.75));
    const jCurrent = Math.min(alphaInit * (1 - alphaInit), kSlow * 0.35);
    const jammed = alphaInit > kSlow * 0.55;

    // Top: mRNA Lattice with Hopping 70S Ribosome Footprints & Queuing
    const lx = 14, ly = 44, lw = W - 28, lh = (H - 64) * 0.48;
    st.panel(lx, ly, lw, lh, jammed ? "⚠️ RIBOSOME QUEUE JAMMING UPSTREAM OF RARE CODON BOTTLENECK!" : "Free-Flowing 70S Ribosome Elongation Along mRNA");
    const my = ly + lh * 0.62, x0 = lx + 28, mLen = lw - 56;

    // mRNA strand
    ctx.strokeStyle = C.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, my);
    ctx.lineTo(x0 + mLen, my);
    ctx.stroke();

    // Rare codon bottleneck marker at 60% mRNA length
    const bottleX = x0 + mLen * 0.6;
    ctx.fillStyle = C.danger;
    ctx.fillRect(bottleX - 10, my - 6, 20, 12);
    ctx.font = "9px monospace";
    ctx.fillText("AGG Rare Codon", bottleX - 32, my + 24);

    // Ribosome domes along mRNA
    const nRibo = 9;
    for (let r = 0; r < nRibo; r++) {
      let u = ((r / nRibo) + st.t * jCurrent * 0.6) % 1;
      if (jammed && u > 0.25 && u < 0.58) {
        u = 0.56 - (r % 5) * 0.065; // queued behind bottleneck
      }
      const rxPos = x0 + u * mLen;
      ctx.fillStyle = "#67e8f9";
      ctx.beginPath();
      ctx.arc(rxPos, my - 8, 11, Math.PI, 0);
      ctx.fill();
      // Growing nascent peptide chain
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(rxPos, my - 19);
      ctx.lineTo(rxPos + Math.sin(u * 12) * 8, my - 19 - u * 26);
      ctx.stroke();
    }

    // Bottom: Ribosome Occupancy Density Profile ρ(x) Along Transcript
    const by = ly + lh + 8, bh = H - by - 12;
    st.panel(lx, by, lw, bh, "Ribosome Footprint Density ρ(x) (Ribo-Seq Pileup)");
    const gx = lx + 28, gy = by + 26, gw = lw - 44, gh = bh - 38;
    for (let i = 0; i < 30; i++) {
      const u = i / 30;
      const occ = jammed && u < 0.6 ? Math.min(0.95, alphaInit + 0.35 * Math.exp(-(0.6 - u) * 4)) : alphaInit * 0.55;
      const barH = occ * gh * 0.85;
      ctx.fillStyle = u > 0.56 && u < 0.64 ? C.danger : C.primary;
      ctx.fillRect(gx + u * gw + 1, gy + gh - barH, gw / 30 - 2, barH);
    }

    return {
      "Translation Flux J": jCurrent.toFixed(3) + " prot/s",
      "Codon Adaptation CAI": cai.toFixed(2),
      "Traffic Phase": jammed ? "High-Density Jam (HD)" : (alphaInit > 0.45 ? "Maximal Current (MC) ✓" : "Low-Density (LD)"),
      "Queue Upstream ρ_max": (jammed ? 0.92 : alphaInit).toFixed(2),
    };
  };

  // 55. bio_scrna_umap_velocity
  R.bio_scrna_umap_velocity = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Single-Cell RNA Velocity (ds/dt = βu − γs) & Lineage UMAP Vector Field", st.spec.formula);
    const beta = 0.3 + st.a * 1.7;
    const gamma = 0.2 + st.b * 1.4;
    const dropout = st.c * 60;

    // Left: UMAP Cell Manifold with Velocity Arrows from Stem → Differentiated Fates
    const lx = 14, ly = 44, lw = W * 0.54 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "UMAP Manifold & Projected RNA Velocity Field (Stem → Lineages A/B)");
    const cx = lx + lw * 0.25, cy = ly + lh * 0.55;

    for (let i = 0; i < 28; i++) {
      const u = i / 28;
      const branch = i % 2 === 0 ? 1 : -1;
      const px = cx + u * (lw * 0.62);
      const py = cy + branch * Math.pow(u, 1.4) * (lh * 0.32) + Math.sin(i * 4.1) * 7;
      const col = u < 0.35 ? "#67e8f9" : (branch > 0 ? C.ok : C.secondary);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Velocity vector arrow
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 11 * (beta / 1.2), py + branch * u * 8);
      ctx.stroke();
    }

    // Right: Phase Portrait of Unspliced (u) vs Spliced (s) mRNA
    const rx = W * 0.54, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Phase Portrait: Unspliced u vs Spliced s (Steady-State Slope γ/β)");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    // Steady-state line u = (gamma/beta) s
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh - Math.min(1, gamma / beta) * gh);
    ctx.stroke();
    ctx.setLineDash([]);

    // Induction (upper almond arc) & Repression (lower arc)
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const th = (i / 60) * Math.PI * 2;
      const sVal = 0.5 + 0.38 * Math.cos(th);
      const uVal = 0.5 + 0.38 * Math.cos(th) + 0.24 * Math.sin(th);
      const px = gx + sVal * gw;
      const py = gy + gh - Math.max(0.05, Math.min(0.95, uVal)) * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Steady-State Ratio γ/β": (gamma / beta).toFixed(2),
      "RNA Velocity ds/dt": ((beta * 0.65 - gamma * 0.4)).toFixed(2) + " transcripts/h",
      "Transcriptional State": beta * 0.65 > gamma * 0.4 ? "Up-Regulating (u > γs/β) ↑" : "Repressing ↓",
      "Zero-Inflation Dropout": dropout.toFixed(0) + "%",
    };
  };

  // 56. bio_michaelis_allostery
  R.bio_michaelis_allostery = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Monod–Wyman–Changeux (MWC) Allosteric Cooperativity & T ⇄ R State Shift", st.spec.formula);
    const logL0 = -1 + st.a * 5; // L0 from 0.1 to 10,000
    const alphaSub = st.b * 8.0;
    const nSub = Math.round(2 + st.c * 4);
    const L0 = Math.pow(10, logL0);
    const cAff = 0.04;

    function yFrac(a, L) {
      const num = a * Math.pow(1 + a, nSub - 1) + L * cAff * a * Math.pow(1 + cAff * a, nSub - 1);
      const den = Math.pow(1 + a, nSub) + L * Math.pow(1 + cAff * a, nSub);
      return num / den;
    }
    const yNow = yFrac(alphaSub, L0);
    const rFrac = Math.pow(1 + alphaSub, nSub) / (Math.pow(1 + alphaSub, nSub) + L0 * Math.pow(1 + cAff * alphaSub, nSub));

    // Left: Oligomeric Subunit Ring Switching Between Tense (T Square) and Relaxed (R Circle)
    const lx = 14, ly = 44, lw = W * 0.46 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `Oligomeric ${nSub}-mer: Tense T-State vs Relaxed R-State (${(rFrac * 100).toFixed(0)}% R)`);
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.26;

    for (let i = 0; i < nSub; i++) {
      const ang = (i / nSub) * Math.PI * 2;
      const sx = cx + Math.cos(ang) * R, sy = cy + Math.sin(ang) * R;
      ctx.fillStyle = rFrac > 0.5 ? "rgba(110,231,183,0.35)" : "rgba(255,143,171,0.35)";
      ctx.strokeStyle = rFrac > 0.5 ? C.ok : C.secondary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      if (rFrac > 0.5) ctx.arc(sx, sy, 18, 0, Math.PI * 2);
      else ctx.rect(sx - 16, sy - 16, 32, 32);
      ctx.fill();
      ctx.stroke();
    }

    // Right: Sigmoidal Fractional Saturation Curve Y(α) vs Hyperbolic R/T Limits
    const rx = W * 0.46, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Fractional Saturation Y(α) — Sigmoidal Allosteric Curve");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * 8.0;
      const y = yFrac(a, L0);
      const px = gx + (i / 60) * gw;
      const py = gy + gh - y * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Saturation Fraction Y": (yNow * 100).toFixed(1) + "%",
      "Relaxed State Fraction R": (rFrac * 100).toFixed(1) + "%",
      "Allosteric Constant L₀": L0.toFixed(1),
      "Effective Hill n_H": (1 + (nSub - 1) * 0.65 * Math.sin(Math.min(Math.PI, logL0 * 0.6))).toFixed(2),
    };
  };

  // 57. bio_car_t_cytokine
  R.bio_car_t_cytokine = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("CAR-T Immunotherapy — Tumor Lysis vs IL-6 Cytokine Release Syndrome (CRS)", st.spec.formula);
    const affinity = 0.3 + st.a * 1.7;
    const dose = 0.5 + st.b * 4.5;
    const toci = st.c;

    const peakIL6 = (affinity * dose * 140) / (1 + toci * 2.2);
    const crsStorm = peakIL6 > 220;

    // Left: CAR-T Immunological Synapse Engaging Tumor Antigen + Perforin/Granzyme
    const lx = 14, ly = 44, lw = W * 0.46 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "CAR-T scFv Immunological Synapse & Perforin Lysis");
    const cy = ly + lh * 0.54;

    // CAR-T cell (left) & Tumor cell (right)
    ctx.fillStyle = "rgba(103,232,249,0.28)";
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(lx + lw * 0.32, cy, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,107,107,0.25)";
    ctx.strokeStyle = C.danger;
    ctx.beginPath();
    ctx.arc(lx + lw * 0.72, cy, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cytolytic granules & IL-6 dots
    for (let i = 0; i < 8; i++) {
      const gx = lx + lw * 0.45 + ((st.t * 40 + i * 9) % 35);
      const gy = cy - 16 + i * 4.5;
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right: Tumor Burden T(t), CAR-T Expansion E(t) & IL-6 Surge C(t)
    const rx = W * 0.46, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, crsStorm ? "⚠️ GRADE 3+ CYTOKINE STORM (Administer Tocilizumab!)" : "Tumor Clearance (Red), CAR-T Expansion (Cyan) & IL-6 (Gold)");
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 48;

    // Tumor curve decaying
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const tBurden = Math.exp(-Math.pow(u * affinity * 2.2, 2));
      ctx.lineTo(gx + u * gw, gy + gh - tBurden * gh * 0.85);
    }
    ctx.stroke();

    // CAR-T expansion curve
    ctx.strokeStyle = "#67e8f9";
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const cExp = Math.sin(u * Math.PI) * Math.exp(-(u - 0.35) * (u - 0.35) * 6);
      ctx.lineTo(gx + u * gw, gy + gh - cExp * gh * 0.82);
    }
    ctx.stroke();

    return {
      "Tumor Clearance": (affinity * dose > 0.8 ? "Complete Remission ✓" : "Partial / Escape"),
      "Peak Serum IL-6": peakIL6.toFixed(0) + " pg/mL",
      "CRS Toxicity Grade": crsStorm ? "Grade 3–4 Severe CRS" : "Grade 1 Mild ✓",
      "Tocilizumab Damping": (toci * 100).toFixed(0) + "% IL-6R Blockade",
    };
  };

  // 58. bio_lipid_nanoparticle_pk
  R.bio_lipid_nanoparticle_pk = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("mRNA Lipid Nanoparticle (LNP) — pH-Triggered Endosomal Escape & PK/PD", st.spec.formula);
    const pKa = 5.4 + st.a * 2.0;
    const pegPct = 0.5 + st.b * 4.0;
    const halfLife = 6 + st.c * 30;

    // Optimal ionizable lipid pKa is ~6.4
    const escEff = 0.38 * Math.exp(-Math.pow((pKa - 6.4) / 0.48, 2)) / (1 + 0.18 * pegPct);
    const aucProt = escEff * halfLife * 14.5;

    // Left: Acidifying Endosome (pH 7.4 → 5.5) Protonating LNP & Releasing mRNA
    const lx = 14, ly = 44, lw = W * 0.48 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `Endosomal Acidification (pKa = ${pKa.toFixed(2)}) & Hexagonal H_II Escape`);
    const cx = lx + lw * 0.48, cy = ly + lh * 0.52;

    // Endosome vesicle membrane
    ctx.fillStyle = "rgba(192,132,252,0.14)";
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // LNP core inside endosome
    ctx.fillStyle = "rgba(255,209,102,0.35)";
    ctx.strokeStyle = C.accent;
    ctx.beginPath();
    ctx.arc(cx - 6, cy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Escaping mRNA wavy strand into cytosol toward ribosome
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 30; i++) {
      const x = cx + 12 + i * 2.6;
      const y = cy + Math.sin(i * 0.7 - st.t * 6) * (6 * escEff * 3);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Right: Henderson-Hasselbalch Protonation Curve & Protein Expression PK
    const rx = W * 0.48, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "pKa Window (Optimum ≈ 6.4) & Cytosolic Protein Expression");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const tHr = (i / 60) * 72;
      const expr = escEff * 2.8 * (Math.exp(-tHr / halfLife) - Math.exp(-tHr / 2.5));
      const px = gx + (i / 60) * gw;
      const py = gy + gh - Math.max(0, expr) * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    return {
      "Ionizable Lipid pK_a": pKa.toFixed(2),
      "Endosomal Escape η_esc": (escEff * 100).toFixed(1) + "%",
      "mRNA Half-Life t_½": halfLife.toFixed(1) + " h",
      "Protein Exposure AUC": aucProt.toFixed(0) + " ng·h/mL",
    };
  };

  // 59. bio_gene_drive_mendelian
  R.bio_gene_drive_mendelian = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("CRISPR Homing Gene Drive — Germline HDR Conversion & Resistance Evolution", st.spec.formula);
    const eh = 0.5 + st.a * 0.49; // homing efficiency
    const sCost = st.b * 0.55; // homozygous fitness cost
    const nhej = st.c * 0.12; // resistance allele rate

    // Left: Homologous Chromosome Cleavage & HDR Homing Conversion Diagram
    const lx = 14, ly = 44, lw = W * 0.44 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, "Germline Heterozygote (D/WT) → Cas9 Cleavage → HDR (D/D)");
    const cx = lx + lw * 0.5, yTop = ly + lh * 0.32, yBot = ly + lh * 0.72;

    // Top pair: Drive (pink) + Wild-Type (blue)
    ctx.fillStyle = C.secondary;
    ctx.fillRect(cx - 55, yTop - 12, 42, 12);
    ctx.fillStyle = C.primary;
    ctx.fillRect(cx + 13, yTop - 12, 42, 12);
    ctx.fillStyle = C.text;
    ctx.font = "10px monospace";
    ctx.fillText("Drive / WT Heterozygote", cx - 64, yTop + 16);

    // Arrow down with Cas9 HDR
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, yTop + 24);
    ctx.lineTo(cx, yBot - 24);
    ctx.stroke();
    ctx.fillStyle = C.accent;
    ctx.fillText(`HDR Homing (${(eh * 100).toFixed(0)}%)`, cx + 8, (yTop + yBot) * 0.5);

    // Bottom pair: Converted Drive / Drive homozygote
    ctx.fillStyle = C.secondary;
    ctx.fillRect(cx - 55, yBot - 6, 42, 12);
    ctx.fillRect(cx + 13, yBot - 6, 42, 12);
    ctx.fillStyle = C.ok;
    ctx.fillText("Super-Mendelian D/D Gametes", cx - 72, yBot + 22);

    // Right: Multi-Generation Allele Frequency Trajectories (Drive q_t, WT p_t, NHEJ r_t)
    const rx = W * 0.44, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "25-Generation Allele Frequencies: Drive (Pink), WT (Blue), Resistance (Gold)");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    let q = 0.02, r = 0.0, p = 0.98;
    const hist = [];
    for (let g = 0; g <= 25; g++) {
      hist.push({ q, p, r });
      const wBar = Math.max(0.2, 1 - sCost * q * q);
      const qNext = Math.min(1, (q * q * (1 - sCost) + q * p * (1 + eh * (1 - nhej))) / wBar);
      const rNext = Math.min(1 - qNext, r + q * p * eh * nhej);
      q = qNext;
      r = rNext;
      p = Math.max(0, 1 - q - r);
    }

    [
      { key: "q", col: C.secondary },
      { key: "p", col: C.primary },
      { key: "r", col: C.accent },
    ].forEach((s) => {
      ctx.strokeStyle = s.col;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      hist.forEach((pt, idx) => {
        const px = gx + (idx / 25) * gw;
        const py = gy + gh - pt[s.key] * gh * 0.88;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    });

    return {
      "Gen-25 Drive Freq q_25": (hist[25].q * 100).toFixed(1) + "%",
      "Resistance Allele r_25": (hist[25].r * 100).toFixed(1) + "%",
      "Invasion Threshold": sCost < eh ? "Unconditional Spread ✓" : "Bistable Threshold",
      "Germline Conversion": (eh * (1 - nhej) * 100).toFixed(1) + "%",
    };
  };

  // 60. bio_cell_free_tx_tl
  R.bio_cell_free_tx_tl = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Cell-Free TX-TL Riboswitch Biosensor & NTP Energy Pool Depletion", st.spec.formula);
    const ligandUm = st.a * 100;
    const ntpPool = 1.0 + st.b * 5.0; // mM
    const dnaNm = 2 + st.c * 28;

    const Kd = 18.0;
    const pFoldOn = ligandUm / (ligandUm + Kd);
    const tauExhaust = (ntpPool * 24) / (1 + dnaNm * 0.08);
    const peakGfp = pFoldOn * ntpPool * 3.2;

    // Left: Aptamer Riboswitch Conformational Switch (Terminator Hairpin vs Anti-Terminator ON)
    const lx = 14, ly = 44, lw = W * 0.46 - 18, lh = H - 56;
    st.panel(lx, ly, lw, lh, `Riboswitch Aptamer Gate (P_ON = ${(pFoldOn * 100).toFixed(1)}% Anti-Terminator)`);
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;

    // Stem-loop RNA secondary structure
    ctx.strokeStyle = pFoldOn > 0.5 ? C.ok : C.secondary;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(cx - 55, cy + 32);
    ctx.lineTo(cx - 20, cy + 32);
    ctx.lineTo(cx - 20, cy - 18);
    ctx.arc(cx, cy - 18, 20, Math.PI, 0);
    ctx.lineTo(cx + 20, cy + 32);
    ctx.lineTo(cx + 55, cy + 32);
    ctx.stroke();

    // Bound analyte ligand inside aptamer pocket
    if (pFoldOn > 0.25) {
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(cx, cy - 18, 8 * pFoldOn + 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = C.text;
    ctx.font = "10px monospace";
    ctx.fillText(pFoldOn > 0.5 ? "RBS Exposed → Ribosome Translates GFP ✓" : "Intrinsic Terminator Hairpin Blocks TX", lx + 14, ly + lh - 12);

    // Right: Cell-Free GFP Accumulation & ATP/NTP Regeneration Depletion Curve
    const rx = W * 0.46, ry = 44, rw = W - rx - 14, rh = H - 56;
    st.panel(rx, ry, rw, rh, "Cell-Free GFP Readout (Green) & ATP/NTP Energy Depletion (Gold)");
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 48;

    // GFP accumulation plateauing as NTPs deplete
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const tMin = (i / 60) * 180;
      const gfp = pFoldOn * (ntpPool / 6.0) * (1 - Math.exp(-tMin / Math.max(15, tauExhaust)));
      const px = gx + (i / 60) * gw;
      const py = gy + gh - gfp * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // NTP pool decaying with inorganic phosphate Pi accumulation
    ctx.strokeStyle = C.accent;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const tMin = (i / 60) * 180;
      const ntp = (ntpPool / 6.0) * Math.exp(-tMin / Math.max(20, tauExhaust));
      const px = gx + (i / 60) * gw;
      const py = gy + gh - ntp * gh * 0.88;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    return {
      "Riboswitch Fold P_ON": (pFoldOn * 100).toFixed(1) + "%",
      "Endpoint GFP Yield": peakGfp.toFixed(2) + " µM",
      "Resource Lifetime τ_NTP": tauExhaust.toFixed(0) + " min",
      "Limit of Detection": ligandUm >= 2.5 ? "Positive Signal ✓" : "Below LoD",
    };
  };

  window.SelfTaughtSims.registerCustomRenderers(R);
})();


