/* Self-Taught — Bespoke Interactive Simulation Renderers (Group 5: Materials, Systems, Complex Systems)
 * 60 completely unique, domain-specific canvas simulations registered via SelfTaughtSims.registerCustomRenderers(R).
 */
(function () {
  "use strict";

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function drawArrow(ctx, x1, y1, x2, y2, color, w) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1) return;
    const ang = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = w || 1.6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const head = 6;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(ang - 0.42), y2 - head * Math.sin(ang - 0.42));
    ctx.lineTo(x2 - head * Math.cos(ang + 0.42), y2 - head * Math.sin(ang + 0.42));
    ctx.closePath();
    ctx.fill();
  }

  const R = {
    // =========================================================================
    // 1. MATERIALS SCIENCE & SEMICONDUCTOR PHYSICS (20 SIMULATIONS)
    // =========================================================================

    mat_bragg_ewald_xrd(ctx, W, H, st) {
      st.drawHUD("Click diffractogram to switch lattice (SC / BCC / FCC / Diamond) & inspect (hkl) extinctions", st.spec.formula);
      const C = st.COLORS;
      const latIdx = Math.floor((st.px * 4)) % 4;
      const latNames = ["Simple Cubic (SC)", "Body-Centered Cubic (BCC)", "Face-Centered Cubic (FCC)", "Diamond Cubic (Si)"];
      const aLat = 2.8 + st.a * 3.0; // Angstroms
      const grainNm = 8 + st.b * 90;
      const strainPct = st.c * 1.5;
      const lambda = 1.5406; // Cu K-alpha

      // Left panel: Crystal Unit Cell & Bragg Planes
      const lx = 18, ly = 46, lw = W * 0.35, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Unit Cell: ${latNames[latIdx]}`);
      const cx = lx + lw * 0.5, cy = ly + lh * 0.46, sz = Math.min(lw, lh) * 0.25;
      const rot = st.t * 0.45;
      const proj = (x, y, z) => {
        const xr = x * Math.cos(rot) - z * Math.sin(rot);
        const zr = x * Math.sin(rot) + z * Math.cos(rot);
        return [cx + xr * sz, cy + (y - zr * 0.35) * sz];
      };
      // Cube edges
      const corners = [
        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
        [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
      ];
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.2;
      edges.forEach(([i, j]) => {
        const [x1, y1] = proj(...corners[i]);
        const [x2, y2] = proj(...corners[j]);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
      // Basis atoms
      const atoms = [...corners];
      if (latIdx === 1) atoms.push([0,0,0]);
      if (latIdx >= 2) atoms.push([0,0,-1],[0,0,1],[0,-1,0],[0,1,0],[-1,0,0],[1,0,0]);
      if (latIdx === 3) atoms.push([-0.5,-0.5,-0.5],[0.5,0.5,-0.5],[0.5,-0.5,0.5],[-0.5,0.5,0.5]);
      atoms.forEach((pt, idx) => {
        const [px, py] = proj(pt[0], pt[1], pt[2]);
        ctx.fillStyle = idx < 8 ? C.primary : (idx < 14 ? C.accent : C.ok);
        ctx.beginPath(); ctx.arc(px, py, idx < 8 ? 4.5 : 5.5, 0, Math.PI * 2); ctx.fill();
      });
      // Bragg incoming/outgoing X-ray beams
      drawArrow(ctx, lx + 18, cy - 38, cx - 8, cy, C.secondary, 1.8);
      drawArrow(ctx, cx + 8, cy, lx + lw - 18, cy - 38, C.ok, 1.8);
      ctx.fillStyle = C.muted;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText(`Cu Kα λ = 1.54 Å  |  a = ${aLat.toFixed(2)} Å`, lx + 12, ly + lh - 12);

      // Right panel: Powder XRD I(2theta)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Powder Diffractometer I(2θ) & Systematic Extinctions");
      const hkls = [
        { h:1, k:0, l:0, label:"(100)" },
        { h:1, k:1, l:0, label:"(110)" },
        { h:1, k:1, l:1, label:"(111)" },
        { h:2, k:0, l:0, label:"(200)" },
        { h:2, k:1, l:0, label:"(210)" },
        { h:2, k:1, l:1, label:"(211)" },
        { h:2, k:2, l:0, label:"(220)" },
        { h:3, k:1, l:1, label:"(311)" }
      ];
      const allowed = (h, k, l) => {
        if (latIdx === 0) return true;
        if (latIdx === 1) return ((h + k + l) % 2 === 0);
        const allEven = (h%2===0 && k%2===0 && l%2===0);
        const allOdd  = (h%2!==0 && k%2!==0 && l%2!==0);
        if (latIdx === 2) return allEven || allOdd;
        if (latIdx === 3) return allOdd || (allEven && ((h + k + l) % 4 === 0));
        return true;
      };
      const peaks = [];
      hkls.forEach((p) => {
        const q2 = p.h*p.h + p.k*p.k + p.l*p.l;
        const d = aLat / Math.sqrt(q2);
        const s = lambda / (2 * d);
        if (s < 0.98) {
          const twoTheta = (2 * Math.asin(s) * 180) / Math.PI;
          const isAllowed = allowed(p.h, p.k, p.l);
          peaks.push({ ...p, twoTheta, d, isAllowed });
        }
      });

      const gx0 = rx + 26, gx1 = rx + rw - 16, gy0 = ry + rh - 26, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      const fwhm = clamp((0.9 * lambda) / (grainNm * 0.1) * 57.3 + strainPct * 1.4, 0.7, 5.5);
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 220; i++) {
        const ang = 10 + (i / 220) * 110;
        let inten = 0.03;
        peaks.forEach((pk) => {
          if (pk.isAllowed) {
            const diff = ang - pk.twoTheta;
            inten += (0.85 / Math.pow(pk.h*pk.h + pk.k*pk.k + pk.l*pk.l, 0.35)) * Math.exp(-(diff * diff) / (0.36 * fwhm * fwhm));
          }
        });
        const px = gx0 + ((ang - 10) / 110) * (gx1 - gx0);
        const py = gy0 - clamp(inten, 0, 1.05) * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      let activeCount = 0;
      peaks.forEach((pk) => {
        const px = gx0 + ((pk.twoTheta - 10) / 110) * (gx1 - gx0);
        if (px < gx0 || px > gx1) return;
        if (pk.isAllowed) {
          activeCount++;
          ctx.fillStyle = C.accent;
          ctx.fillText(pk.label, px - 12, gy1 + 14 + (activeCount % 2) * 12);
        } else {
          ctx.fillStyle = "rgba(255,107,107,0.75)";
          ctx.fillText(`×${pk.label}`, px - 14, gy0 - 8);
        }
      });

      return {
        "Crystal System": latNames[latIdx],
        "Lattice Constant a": `${aLat.toFixed(2)} Å`,
        "Scherrer FWHM β": `${fwhm.toFixed(2)}° (2θ)`,
        "Allowed Reflections": `${activeCount} / ${peaks.length}`,
      };
    },

    mat_kronig_penney_bands(ctx, W, H, st) {
      st.drawHUD("Adjust periodic potential barrier P to split free-electron parabola into Brillouin bands", st.spec.formula);
      const C = st.COLORS;
      const P = 0.2 + st.a * 6.0;
      const aScale = 2.5 + st.b * 3.5;
      const efShift = (st.c - 0.5) * 4.0;

      // Left: Reduced-zone E(k) diagram for k in [-pi/a, +pi/a]
      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      st.panel(lx, ly, lw, lh, "First Brillouin Zone E(k) Dispersion (k ∈ [−π/a, +π/a])");
      const cx = lx + lw * 0.5, gy0 = ly + lh - 24, gy1 = ly + 30;
      ctx.strokeStyle = C.axis;
      ctx.beginPath();
      ctx.moveTo(cx, gy1); ctx.lineTo(cx, gy0);
      ctx.moveTo(lx + 24, gy0); ctx.lineTo(lx + lw - 20, gy0);
      ctx.stroke();

      const bandColors = [C.primary, C.ok, C.accent];
      const gaps = [];
      for (let band = 0; band < 3; band++) {
        ctx.strokeStyle = bandColors[band];
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        const gap = (0.35 + 0.28 * P) / (band + 1);
        gaps.push(gap);
        for (let i = 0; i <= 100; i++) {
          const u = (i / 100) * 2 - 1; // k / (pi/a) in [-1, 1]
          const base = (band + Math.abs(u)) * (band + Math.abs(u));
          const cosineMod = (band % 2 === 0 ? 1 - Math.cos(u * Math.PI) : 1 + Math.cos(u * Math.PI)) * 0.5;
          const E = band * 2.8 + cosineMod * (1.8 / (1 + 0.18 * P)) + band * gap * 0.9;
          const px = lx + 28 + ((u + 1) * 0.5) * (lw - 56);
          const py = gy0 - (E / 9.5) * (gy0 - gy1);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      // Fermi level line
      const efY = clamp(gy0 - ((3.2 + efShift) / 9.5) * (gy0 - gy1), gy1 + 8, gy0 - 8);
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = C.secondary;
      ctx.beginPath(); ctx.moveTo(lx + 24, efY); ctx.lineTo(lx + lw - 20, efY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.secondary;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText("E_F (Fermi Level)", lx + 30, efY - 5);

      // Right: Kronig-Penney Periodic Square-Well Potential & Effective Mass m*(k)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Periodic Barrier V(x) & Curvature Effective Mass m*");
      // Top half: Square barriers
      const vy = ry + rh * 0.38;
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const wells = 5;
      for (let w = 0; w < wells; w++) {
        const x0 = rx + 18 + (w / wells) * (rw - 36);
        const xw = (rw - 36) / wells;
        const bh = Math.min(rh * 0.24, 10 + P * 8);
        ctx.moveTo(x0, vy);
        ctx.lineTo(x0 + xw * 0.65, vy);
        ctx.lineTo(x0 + xw * 0.65, vy - bh);
        ctx.lineTo(x0 + xw, vy - bh);
        ctx.lineTo(x0 + xw, vy);
      }
      ctx.stroke();
      // Bloch wavefunction envelope
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = i / 120;
        const psi = Math.sin(u * wells * Math.PI * 2) * Math.cos(u * Math.PI * 2 + st.t * 3);
        const px = rx + 18 + u * (rw - 36);
        const py = vy - 18 + psi * 16;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Bottom half: Effective mass m*/m0 = (1 + 0.45*P) / cos(k*a)
      const my = ry + rh * 0.72;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx + 18, my); ctx.lineTo(rx + rw - 18, my); ctx.stroke();
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = (i / 80) * 2 - 1;
        const d2Edk2 = Math.cos(u * Math.PI) / (1 + 0.35 * P);
        const py = clamp(my - d2Edk2 * (rh * 0.18), ry + rh * 0.50, ry + rh - 14);
        const px = rx + 18 + (i / 80) * (rw - 36);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = C.muted;
      ctx.fillText("d²E/dk² Curvature (Electrons > 0, Holes < 0)", rx + 18, ry + rh - 10);

      const mStar = (0.08 + 0.18 * P * (aScale / 4)).toFixed(3);
      return {
        "First Bandgap E_g1": `${(gaps[0] * 1.45).toFixed(2)} eV`,
        "Effective Mass m*/m₀": `${mStar} m₀`,
        "Barrier Parameter P": P.toFixed(2),
        "Zone Boundary π/a": `${(Math.PI / aScale).toFixed(2)} Å⁻¹`,
      };
    },

    mat_binary_eutectic_phase(ctx, W, H, st) {
      st.drawHUD("Drag probe or adjust C₀ and T to compute α / β / Liquid lever-rule phase fractions", st.spec.formula);
      const C = st.COLORS;
      const c0 = st.dragging ? clamp((st.px - 0.06) / 0.52, 0.02, 0.98) * 100 : (5 + st.a * 90);
      const tempC = st.dragging ? (950 - clamp((st.py - 0.14) / 0.76, 0, 1) * 750) : (200 + st.b * 750);
      const TE = 450 + (st.c - 0.5) * 80;
      const CE = 62; // Eutectic composition (e.g. Pb-Sn)
      const cAlphaMax = 18, cBetaMin = 92;
      const TA = 880, TB = 760;

      // Left: Binary T-x Phase Diagram
      const lx = 18, ly = 46, lw = W * 0.56, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Binary Eutectic Phase Diagram (T vs wt% B)");
      const xOf = (c) => lx + 34 + (c / 100) * (lw - 52);
      const yOf = (T) => ly + lh - 26 - ((T - 180) / 800) * (lh - 56);

      // Liquidus & Solidus boundaries
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(TA));
      ctx.lineTo(xOf(CE), yOf(TE));
      ctx.lineTo(xOf(100), yOf(TB));
      ctx.stroke();

      ctx.strokeStyle = C.ok;
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(TA));
      ctx.lineTo(xOf(cAlphaMax), yOf(TE));
      ctx.lineTo(xOf(4), yOf(200));
      ctx.moveTo(xOf(100), yOf(TB));
      ctx.lineTo(xOf(cBetaMin), yOf(TE));
      ctx.lineTo(xOf(97), yOf(200));
      ctx.stroke();

      // Eutectic isotherm
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xOf(cAlphaMax), yOf(TE));
      ctx.lineTo(xOf(cBetaMin), yOf(TE));
      ctx.stroke();

      // Labels
      ctx.fillStyle = C.muted;
      ctx.font = "600 11px system-ui, sans-serif";
      ctx.fillText("Liquid (L)", xOf(45), yOf(780));
      ctx.fillText("α", xOf(4), yOf(480));
      ctx.fillText("β", xOf(94), yOf(480));
      ctx.fillText("α + L", xOf(22), yOf(580));
      ctx.fillText("L + β", xOf(75), yOf(540));
      ctx.fillText("α + β (Lamellar Eutectic)", xOf(36), yOf(290));

      // Compute phase state & tie-line endpoints
      let phaseName = "Liquid (L)", cLeft = c0, cRight = c0, fRight = 0.5;
      const tLiq = c0 <= CE ? lerp(TA, TE, c0 / CE) : lerp(TE, TB, (c0 - CE) / (100 - CE));
      const cSolA = tempC >= TE ? lerp(0, cAlphaMax, (TA - tempC) / (TA - TE)) : lerp(4, cAlphaMax, (tempC - 200) / (TE - 200));
      const cSolB = tempC >= TE ? lerp(100, cBetaMin, (TB - tempC) / (TB - TE)) : lerp(97, cBetaMin, (tempC - 200) / (TE - 200));

      if (tempC >= tLiq) {
        phaseName = "Single-Phase Liquid (L)";
      } else if (c0 <= cSolA) {
        phaseName = "Single-Phase Solid α";
      } else if (c0 >= cSolB) {
        phaseName = "Single-Phase Solid β";
      } else if (tempC >= TE) {
        if (c0 < CE) {
          phaseName = "Two-Phase (α + Liquid)";
          cLeft = cSolA;
          cRight = CE * (TA - tempC) / (TA - TE);
        } else {
          phaseName = "Two-Phase (Liquid + β)";
          cLeft = 100 - (100 - CE) * (TB - tempC) / (TB - TE);
          cRight = cSolB;
        }
        fRight = clamp((c0 - cLeft) / Math.max(0.5, cRight - cLeft), 0, 1);
      } else {
        phaseName = "Sub-Eutectic Solid (α + β)";
        cLeft = cSolA;
        cRight = cSolB;
        fRight = clamp((c0 - cLeft) / Math.max(0.5, cRight - cLeft), 0, 1);
      }

      // Draw Tie-Line & Fulcrum
      const px = xOf(c0), py = yOf(tempC);
      if (cRight > cLeft + 0.5) {
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = C.secondary;
        ctx.beginPath(); ctx.moveTo(xOf(cLeft), py); ctx.lineTo(xOf(cRight), py); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = C.ok;
        ctx.beginPath(); ctx.arc(xOf(cLeft), py, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(xOf(cRight), py, 4.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();

      // Right: Circular Metallographic Microstructure View
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Optical Micrograph & Lever Rule");
      const mcx = rx + rw * 0.5, mcy = ry + rh * 0.46, mr = Math.min(rw, rh) * 0.32;
      ctx.save();
      ctx.beginPath(); ctx.arc(mcx, mcy, mr, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = tempC >= TE ? "rgba(124,156,255,0.28)" : "#1d2440";
      ctx.fillRect(mcx - mr, mcy - mr, mr * 2, mr * 2);

      if (tempC < TE) {
        // Lamellar alternating alpha/beta stripes + primary proeutectic nodules
        ctx.strokeStyle = C.secondary;
        ctx.lineWidth = 3.2;
        for (let s = -mr; s <= mr; s += 8) {
          ctx.beginPath();
          ctx.moveTo(mcx - mr, mcy + s);
          ctx.lineTo(mcx + mr, mcy + s + 12);
          ctx.stroke();
        }
      }
      if (tempC < tLiq) {
        const nodColor = c0 < CE ? C.ok : C.accent;
        const nodFrac = tempC >= TE ? (c0 < CE ? 1 - fRight : fRight) : Math.abs(c0 - CE) / 60;
        const count = Math.round(4 + nodFrac * 8);
        ctx.fillStyle = nodColor;
        for (let i = 0; i < count; i++) {
          const ang = i * 2.399;
          const rad = (i / count) * mr * 0.72;
          ctx.beginPath();
          ctx.arc(mcx + Math.cos(ang) * rad, mcy + Math.sin(ang) * rad, 8 + nodFrac * 11, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(mcx, mcy, mr, 0, Math.PI * 2); ctx.stroke();

      return {
        "Phase Field": phaseName,
        "Composition C₀": `${c0.toFixed(1)} wt% B`,
        "Temperature T": `${tempC.toFixed(0)} °C`,
        "Lever Fraction": cRight > cLeft + 0.5 ? `${((1 - fRight) * 100).toFixed(0)}% / ${(fRight * 100).toFixed(0)}%` : "100% Single Phase",
      };
    },

    mat_cahn_hilliard_spinodal(ctx, W, H, st) {
      st.drawHUD("Watch bicontinuous spinodal phase separation ∂c/∂t = M∇²(∂f/∂c − κ∇²c)", st.spec.formula);
      const C = st.COLORS;
      const M = 0.3 + st.a * 1.7;
      const kappa = 0.2 + st.b * 1.4;
      const quench = 0.2 + st.c * 1.2;

      // Left: 2D Bicontinuous Phase Field Microstructure
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, "2D Spinodal Microstructure Field c(x, y, t)");
      const nx = 34, ny = 24;
      const cw = (lw - 24) / nx, ch = (lh - 38) / ny;
      const waveK = 2.6 / Math.sqrt(kappa + 0.15) / (1 + 0.25 * M * (st.t % 12));
      for (let iy = 0; iy < ny; iy++) {
        for (let ix = 0; ix < nx; ix++) {
          const x = ix * 0.35, y = iy * 0.35;
          const val = Math.sin(x * waveK + Math.cos(y * waveK * 1.2 + st.t * 0.4 * M))
                    + Math.cos(y * waveK * 1.1 - Math.sin(x * waveK * 0.9 - st.t * 0.3 * M));
          const cNorm = Math.tanh(val * (0.6 + quench * 1.3));
          ctx.fillStyle = cNorm > 0 ? `rgba(124,156,255,${0.35 + 0.55 * cNorm})` : `rgba(255,143,171,${0.35 - 0.55 * cNorm})`;
          ctx.fillRect(lx + 12 + ix * cw, ly + 26 + iy * ch, cw + 0.5, ch + 0.5);
        }
      }

      // Right: Landau Double-Well Free Energy f(c) & Spinodal Inflection Points
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Double-Well Free Energy f₀(c) & ∂²f/∂c² < 0 Dome");
      const gx0 = rx + 24, gx1 = rx + rw - 20, gy0 = ry + rh - 28, gy1 = ry + 36;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = (i / 100) * 2 - 1; // c in [-1, 1]
        const f = 0.28 * Math.pow(u * u - 0.64, 2) * (0.5 + quench) + 0.05;
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - f * (gy0 - gy1) * 2.2;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Highlight spinodal inflection points u = +/- 0.8 / sqrt(3)
      const spU = 0.8 / Math.sqrt(3);
      [-spU, spU].forEach((u) => {
        const px = gx0 + ((u + 1) * 0.5) * (gx1 - gx0);
        const f = 0.28 * Math.pow(u * u - 0.64, 2) * (0.5 + quench) + 0.05;
        const py = gy0 - f * (gy0 - gy1) * 2.2;
        ctx.fillStyle = C.danger;
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = C.danger;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText("Unstable Spinodal Zone: ∂²f/∂c² < 0 (Uphill Diffusion)", gx0 + 16, gy0 - 10);

      const domLen = (12 * Math.sqrt(kappa) * Math.pow(1 + M * (st.t % 12), 0.333)).toFixed(1);
      return {
        "Domain Scale L(t)": `${domLen} nm`,
        "Lifshitz–Slyozov Law": "L(t) ∝ (M·t)^{1/3}",
        "Gradient Penalty κ": kappa.toFixed(2),
        "Stability Regime": "Spinodal (∂²f/∂c² < 0)",
      };
    },

    mat_ttt_jmak_nucleation(ctx, W, H, st) {
      st.drawHUD("Trace isothermal hold on TTT C-curve & Avrami X(t) = 1 − exp(−k·tⁿ) sigmoid", st.spec.formula);
      const C = st.COLORS;
      const holdT = 220 + st.a * 480; // C
      const nAvrami = 1.5 + st.b * 2.5;
      const coolRate = 5 + st.c * 150;

      // Left: TTT Diagram (Temperature vs log10(t))
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Isothermal TTT Diagram (Pearlite / Bainite / Martensite)");
      const gx0 = lx + 34, gx1 = lx + lw - 18, gy0 = ly + lh - 24, gy1 = ly + 30;
      const yT = (T) => gy0 - ((T - 150) / 600) * (gy0 - gy1);

      // Draw C-curves (1% start and 99% finish)
      [0, 1].forEach((curveIdx) => {
        ctx.strokeStyle = curveIdx === 0 ? C.primary : C.ok;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let T = 260; T <= 700; T += 8) {
          const noseDist = (T - 530) / 145;
          const logt = 0.25 + curveIdx * 1.15 + noseDist * noseDist * 1.65;
          const px = gx0 + (logt / 4.5) * (gx1 - gx0);
          const py = yT(T);
          if (T === 260) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });
      // Martensite M_s line
      ctx.strokeStyle = C.danger;
      ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(gx0, yT(240)); ctx.lineTo(gx1, yT(240)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.danger;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText("M_s (Martensite Start 240°C)", gx0 + 8, yT(240) - 5);

      // Isothermal Hold Line
      const pyHold = yT(holdT);
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(gx0, yT(727)); ctx.lineTo(gx0 + 24, pyHold); ctx.lineTo(gx1, pyHold); ctx.stroke();

      // Right: Avrami Sigmoid Curve X(t)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Avrami (JMAK) Fraction Transformed X(t)");
      const rx0 = rx + 28, rx1 = rx + rw - 18, ry0 = ry + rh - 24, ry1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx0, ry0); ctx.lineTo(rx1, ry0); ctx.stroke();

      const noseFactor = Math.exp(-Math.pow((holdT - 530) / 160, 2));
      const kRate = 0.08 + 1.8 * noseFactor;
      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        const tVal = Math.pow(10, u * 3 - 1.2);
        const X = 1 - Math.exp(-kRate * Math.pow(tVal, nAvrami * 0.45));
        const px = rx0 + u * (rx1 - rx0);
        const py = ry0 - X * (ry0 - ry1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const microProd = holdT > 540 ? "Coarse/Fine Pearlite" : (holdT > 250 ? "Upper/Lower Bainite" : "Athermal Martensite");
      const tHalf = Math.pow(Math.LN2 / kRate, 1 / (nAvrami * 0.45));
      return {
        "Hold Temperature": `${holdT.toFixed(0)} °C`,
        "Product Phase": microProd,
        "Avrami Exponent n": nAvrami.toFixed(2),
        "Half-Time t_{0.5}": `${tHalf.toFixed(2)} s`,
      };
    },

    mat_fick_carburizing(ctx, W, H, st) {
      st.drawHUD("Simulate Fick's 2nd Law erfc(x / 2√Dt) case-hardening & Kirkendall marker shift", st.spec.formula);
      const C = st.COLORS;
      const tempK = 1050 + st.a * 350;
      const timeHr = 0.5 + st.b * 11.5;
      const QkJ = 120 + st.c * 45;
      const D = 0.25 * Math.exp(-(QkJ * 1000) / (8.314 * tempK) + 12.5); // scaled diffusivity
      const sqrtDt = Math.sqrt(D * timeHr);

      // Left: Atomic Lattice Cross-Section + Kirkendall Vacancy Plane
      const lx = 18, ly = 46, lw = W * 0.44, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Interstitial Carbon Gradient & Kirkendall Plane");
      for (let ix = 0; ix < 14; ix++) {
        const u = ix / 13;
        const cFrac = Math.exp(-Math.pow(u / Math.max(0.18, sqrtDt * 0.45), 1.6));
        for (let iy = 0; iy < 8; iy++) {
          const ax = lx + 20 + u * (lw - 40);
          const ay = ly + 36 + iy * ((lh - 58) / 7);
          ctx.fillStyle = "rgba(124,156,255,0.45)";
          ctx.beginPath(); ctx.arc(ax, ay, 5.5, 0, Math.PI * 2); ctx.fill();
          if (((ix * 7 + iy * 3) % 10) / 10 < cFrac) {
            ctx.fillStyle = C.accent;
            ctx.beginPath(); ctx.arc(ax + 6, ay + 5, 2.6, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      // Kirkendall Mo-wire inert markers shifting left
      const kShift = lx + 42 + clamp(sqrtDt * 22, 4, lw * 0.45);
      ctx.strokeStyle = C.secondary;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(kShift, ly + 26); ctx.lineTo(kShift, ly + lh - 14); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.secondary;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText("Kirkendall Plane", kShift - 28, ly + lh - 4);

      // Right: Concentration Profile C(x,t) = Cs - (Cs - C0)erf(x / 2sqrt(Dt))
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Carbon Concentration Profile C(x, t) vs Depth x (mm)");
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      const erfcApprox = (z) => {
        const t = 1 / (1 + 0.5 * Math.abs(z));
        const ans = t * Math.exp(-z*z - 1.26551223 + t*(1.00002368 + t*(0.37409196 + t*(0.09678418))));
        return z >= 0 ? ans : 2 - ans;
      };

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const xMm = (i / 100) * 3.0;
        const cVal = 0.2 + 1.0 * erfcApprox(xMm / Math.max(0.15, 1.1 * sqrtDt));
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - ((cVal - 0.2) / 1.05) * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Target 0.4 wt% C case depth line
      const yCase = gy0 - ((0.4 - 0.2) / 1.05) * (gy0 - gy1);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(gx0, yCase); ctx.lineTo(gx1, yCase); ctx.stroke();
      ctx.setLineDash([]);

      return {
        "Diffusivity D(T)": `${(D * 1e-11).toExponential(2)} m²/s`,
        "Diffusion Length 2√Dt": `${(1.1 * sqrtDt).toFixed(2)} mm`,
        "Furnace Temp T": `${tempK.toFixed(0)} K`,
        "Soak Time t": `${timeHr.toFixed(1)} hrs`,
      };
    },

    mat_dislocation_hall_petch(ctx, W, H, st) {
      st.drawHUD("Apply shear stress τ to bow Frank–Read dislocation loop & inspect Hall–Petch σ_y(d)", st.spec.formula);
      const C = st.COLORS;
      const dUm = 2 + st.a * 98;
      const tau = 20 + st.b * 280;
      const lPrecip = 25 + st.c * 120;

      // Left: Frank-Read Dislocation Source Bowing Between Pinning Obstacles
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Frank–Read Dislocation Loop Multiplication");
      const cx = lx + lw * 0.5, cy = ly + lh * 0.55;
      const pinSpan = Math.min(lw * 0.36, 32 + lPrecip * 0.45);
      const p1x = cx - pinSpan * 0.5, p2x = cx + pinSpan * 0.5;

      // Outer shed loops
      const loopPhase = (st.t * (0.4 + tau / 180)) % 1;
      for (let k = 1; k <= 2; k++) {
        const rad = pinSpan * (0.55 + (loopPhase + k - 1) * 0.42);
        ctx.strokeStyle = `rgba(110, 231, 183, ${0.7 - k * 0.25})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 8, rad, rad * 0.68, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Active bowing segment between pinning points
      const bowH = (tau / 300) * (lh * 0.34) * (0.5 + 0.5 * Math.sin(st.t * 3));
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(p1x, cy);
      ctx.quadraticCurveTo(cx, cy - bowH, p2x, cy);
      ctx.stroke();
      // Pinning precipitates
      [p1x, p2x].forEach((px) => {
        ctx.fillStyle = C.danger;
        ctx.beginPath(); ctx.arc(px, cy, 6, 0, Math.PI * 2); ctx.fill();
      });

      // Right: Hall-Petch Plot sigma_y vs d^(-1/2)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Hall–Petch Strengthening: σ_y = σ₀ + k_y · d⁻¹/²");
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0 - 25);
      ctx.lineTo(gx1, gy1 + 14);
      ctx.stroke();

      const invSqrtD = 1 / Math.sqrt(dUm);
      const uPos = clamp((invSqrtD - 0.1) / 0.65, 0, 1);
      const curX = gx0 + uPos * (gx1 - gx0);
      const curY = lerp(gy0 - 25, gy1 + 14, uPos);
      ctx.fillStyle = C.secondary;
      ctx.beginPath(); ctx.arc(curX, curY, 6, 0, Math.PI * 2); ctx.fill();

      const sigmaY = 75 + 520 * invSqrtD + 9500 / lPrecip;
      const tauCrit = (80 * 0.25 * 1000) / lPrecip;
      return {
        "Yield Strength σ_y": `${sigmaY.toFixed(0)} MPa`,
        "Frank–Read τ_c": `${tauCrit.toFixed(0)} MPa`,
        "Grain Size d": `${dUm.toFixed(1)} µm`,
        "Hall–Petch d⁻¹/²": `${invSqrtD.toFixed(3)} µm⁻¹/²`,
      };
    },

    mat_griffith_weibull(ctx, W, H, st) {
      st.drawHUD("Inspect Mode-I crack tip stress field K_I = Yσ√(πa) & Weibull ceramic failure P_f(σ)", st.spec.formula);
      const C = st.COLORS;
      const aMm = 0.2 + st.a * 4.8;
      const mWeibull = 3 + st.b * 22;
      const kIC = 2.5 + st.c * 12.0;

      // Left: Crack Tip Isochromatic Stress Lobe Contours
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Mode-I Crack Tip Stress Field σ_yy(r, θ)");
      const tipX = lx + lw * 0.42, tipY = ly + lh * 0.52;
      // Crack wedge
      ctx.fillStyle = "rgba(255,107,107,0.3)";
      ctx.beginPath();
      ctx.moveTo(lx + 12, tipY - 6);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(lx + 12, tipY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Kidney-bean plastic zone / stress lobes r(theta) ~ cos^2(theta/2)*(1 + 3*sin^2(theta/2))
      [0.35, 0.65, 1.0].forEach((scale, idx) => {
        ctx.strokeStyle = idx === 0 ? C.danger : (idx === 1 ? C.accent : C.primary);
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const th = -Math.PI + (i / 90) * Math.PI * 2;
          const r = scale * (22 + aMm * 7) * Math.pow(Math.cos(th * 0.5), 2) * (0.4 + 1.4 * Math.pow(Math.sin(th * 0.5), 2));
          const px = tipX + r * Math.cos(th);
          const py = tipY + r * Math.sin(th);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Right: Weibull Survival / Failure Probability Curve
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `Weibull Failure CDF P_f(σ) (Modulus m = ${mWeibull.toFixed(1)})`);
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      const sigmaCrit = (kIC * 1000) / (1.12 * Math.sqrt(Math.PI * aMm));
      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const sig = (i / 100) * 600;
        const pf = 1 - Math.exp(-Math.pow(sig / Math.max(80, sigmaCrit), mWeibull));
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - pf * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Critical Stress σ_c": `${sigmaCrit.toFixed(0)} MPa`,
        "Toughness K_IC": `${kIC.toFixed(1)} MPa√m`,
        "Weibull Modulus m": mWeibull.toFixed(1),
        "Flaw Half-Size a": `${aMm.toFixed(2)} mm`,
      };
    },

    mat_pn_junction_poisson(ctx, W, H, st) {
      st.drawHUD("Adjust bias V_a and doping to inspect space-charge depletion W, E(x) triangle & band bending", st.spec.formula);
      const C = st.COLORS;
      const vBias = -2.0 + st.a * 2.75; // -2.0V to +0.75V
      const ndLog = 15 + st.b * 3;
      const naLog = 15 + st.c * 3;
      const vBi = 0.0259 * Math.log(Math.pow(10, ndLog + naLog - 20));
      const vEff = Math.max(0.08, vBi - vBias);
      const wTotal = 0.35 * Math.sqrt(vEff);
      const xpRatio = ndLog / (ndLog + naLog);
      const xnRatio = 1 - xpRatio;

      // Left: Space-Charge Region + Electric Field Triangle E(x)
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Depletion Layer ρ(x) & Electric Field Triangle E(x)");
      const jx = lx + lw * 0.5, cy1 = ly + lh * 0.36, cy2 = ly + lh * 0.78;
      const wpPx = clamp(wTotal * xpRatio * 140, 12, lw * 0.42);
      const wnPx = clamp(wTotal * xnRatio * 140, 12, lw * 0.42);

      // Charge blocks (-q N_A on p-side, +q N_D on n-side)
      ctx.fillStyle = "rgba(255,107,107,0.35)";
      ctx.fillRect(jx - wpPx, cy1, wpPx, 28);
      ctx.fillStyle = "rgba(124,156,255,0.35)";
      ctx.fillRect(jx, cy1 - 28, wnPx, 28);
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(lx + 14, cy1); ctx.lineTo(lx + lw - 14, cy1); ctx.stroke();

      // Electric field triangle E(x) peaking negatively at x=0
      const ePeakPx = clamp(vEff * 24, 10, lh * 0.28);
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(lx + 14, cy2 - 22);
      ctx.lineTo(jx - wpPx, cy2 - 22);
      ctx.lineTo(jx, cy2 - 22 + ePeakPx);
      ctx.lineTo(jx + wnPx, cy2 - 22);
      ctx.lineTo(lx + lw - 14, cy2 - 22);
      ctx.stroke();

      // Right: Energy Band Diagram E_C(x), E_V(x), E_Fn, E_Fp
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Energy Band Bending: E_C(x), E_V(x) & Quasi-Fermi Levels");
      const rx0 = rx + 20, rx1 = rx + rw - 20;
      const bendPx = clamp(vEff * 28, 8, rh * 0.38);
      const fermiSplit = vBias * 26;

      [0, 62].forEach((offset, idx) => {
        ctx.strokeStyle = idx === 0 ? C.primary : C.ok;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const u = (i / 100) * 2 - 1;
          const s = 0.5 * (1 + Math.tanh(u / Math.max(0.12, wTotal * 0.55)));
          const px = rx0 + (i / 100) * (rx1 - rx0);
          const py = ry + 48 + offset + s * bendPx;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });
      // Quasi-Fermi levels E_Fp (left) and E_Fn (right)
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = C.secondary;
      const efBase = ry + 84;
      ctx.beginPath();
      ctx.moveTo(rx0, efBase);
      ctx.lineTo((rx0 + rx1) * 0.5, efBase);
      ctx.moveTo((rx0 + rx1) * 0.5, efBase + bendPx - fermiSplit - 20);
      ctx.lineTo(rx1, efBase + bendPx - fermiSplit - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      return {
        "Built-in Potential V_bi": `${vBi.toFixed(2)} V`,
        "Applied Bias V_a": `${vBias.toFixed(2)} V`,
        "Depletion Width W": `${(wTotal * 0.85).toFixed(2)} µm`,
        "Peak Field |E_max|": `${(2 * vEff / (wTotal * 0.85) * 10).toFixed(1)} kV/cm`,
      };
    },

    mat_mosfet_finfet_sce(ctx, W, H, st) {
      st.drawHUD("Compare Planar MOSFET vs Tri-Gate FinFET vs Gate-All-Around (GAA) Nanosheet electrostatics", st.spec.formula);
      const C = st.COLORS;
      const lgNm = 3 + st.a * 25;
      const eotNm = 0.5 + st.b * 2.0;
      const archIdx = Math.min(2, Math.floor(st.c * 2.99)); // 0=Planar, 1=FinFET, 2=GAA
      const archNames = ["Planar Bulk MOSFET (1 Gate)", "3D Tri-Gate FinFET (3 Gates)", "Gate-All-Around Nanosheet (4 Gates)"];
      const nGates = [1, 3, 4][archIdx];
      const lambdaNat = Math.sqrt((11.7 / 3.9) * eotNm * 6.0 / nGates);
      const ss = 60 * (1 + 0.85 * Math.exp(-lgNm / (1.8 * lambdaNat)));
      const dibl = 180 * Math.exp(-lgNm / (1.5 * lambdaNat));

      // Left: 3D Transistor Gate Wrapping Cross-Section
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, archNames[archIdx]);
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;

      if (archIdx === 0) {
        // Planar Si substrate + top gate
        ctx.fillStyle = "rgba(124,156,255,0.35)";
        ctx.fillRect(cx - 70, cy, 140, 48);
        ctx.fillStyle = C.ok;
        ctx.fillRect(cx - 50, cy - 8, 100, 8);
        ctx.fillStyle = C.accent;
        ctx.fillRect(cx - 50, cy - 36, 100, 28);
      } else if (archIdx === 1) {
        // Vertical Si Fin wrapped on 3 sides by HKMG
        ctx.fillStyle = C.accent;
        ctx.fillRect(cx - 54, cy - 50, 108, 92);
        ctx.fillStyle = C.ok;
        ctx.fillRect(cx - 24, cy - 30, 48, 72);
        ctx.fillStyle = C.primary;
        ctx.fillRect(cx - 18, cy - 24, 36, 66);
      } else {
        // 3 Stacked Horizontal Si Nanosheets completely surrounded by HKMG
        ctx.fillStyle = C.accent;
        ctx.fillRect(cx - 64, cy - 56, 128, 108);
        for (let s = -1; s <= 1; s++) {
          const sy = cy - 4 + s * 30;
          ctx.fillStyle = C.ok;
          ctx.fillRect(cx - 46, sy - 9, 92, 18);
          ctx.fillStyle = C.primary;
          ctx.fillRect(cx - 40, sy - 5, 80, 10);
        }
      }

      // Right: Subthreshold log10(I_D) vs V_GS (Low V_DS vs High V_DS showing DIBL)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Subthreshold Transfer Curve log₁₀(I_D) vs V_GS");
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      [0, dibl / 1000].forEach((shift, idx) => {
        ctx.strokeStyle = idx === 0 ? C.primary : C.secondary;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const vg = (i / 100) * 0.85;
          const vth = 0.32 - shift;
          const logI = vg < vth ? ((vg - vth) / (ss / 1000)) : Math.log10(1 + (vg - vth) * 12);
          const normY = clamp((logI + 6) / 7.5, 0, 1);
          const px = gx0 + (i / 100) * (gx1 - gx0);
          const py = gy0 - normY * (gy0 - gy1);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      return {
        "Architecture": archNames[archIdx].split(" ")[0],
        "Subthreshold Swing": `${ss.toFixed(1)} mV/dec`,
        "DIBL Barrier Lowering": `${dibl.toFixed(0)} mV/V`,
        "Natural Scale λ": `${lambdaNat.toFixed(2)} nm`,
      };
    },

    mat_euv_litho_opc(ctx, W, H, st) {
      st.drawHUD("Tune NA (0.33 vs High-NA 0.55) & OPC hammerhead serifs to sharpen 13.5nm EUV wafer contours", st.spec.formula);
      const C = st.COLORS;
      const na = 0.30 + st.a * 0.28; // 0.30 to 0.58
      const dose = 15 + st.b * 55;
      const opc = st.c; // 0..1

      // Left: Reticle Mask Pattern with OPC Hammerhead Serifs & SRAFs
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, "EUV Reflective Mask + OPC Serifs & SRAFs");
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      // L-shaped target polygon
      ctx.fillStyle = "rgba(124,156,255,0.45)";
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.fillRect(cx - 48, cy - 48, 28, 96);
      ctx.fillRect(cx - 48, cy + 20, 96, 28);
      // OPC corner hammerhead serifs + sub-resolution assist bars
      const serifSz = opc * 14;
      if (serifSz > 1) {
        ctx.fillStyle = C.accent;
        [
          [cx - 48 - serifSz*0.5, cy - 48 - serifSz*0.5],
          [cx - 20 - serifSz*0.5, cy - 48 - serifSz*0.5],
          [cx + 48 - serifSz*0.5, cy + 20 - serifSz*0.5],
          [cx + 48 - serifSz*0.5, cy + 48 - serifSz*0.5],
          [cx - 48 - serifSz*0.5, cy + 48 - serifSz*0.5],
        ].forEach(([sx, sy]) => ctx.fillRect(sx, sy, serifSz, serifSz));
        // SRAF thin bars
        ctx.fillStyle = C.ok;
        ctx.fillRect(cx - 64, cy - 44, 5, 88);
        ctx.fillRect(cx - 44, cy + 58, 88, 5);
      }

      // Right: Printed Wafer Resist Contour + Photon Shot Noise LWR
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Wafer Aerial Image Contour & Stochastic LWR");
      const rcx = rx + rw * 0.5, rcy = ry + rh * 0.54;
      const cornerRound = clamp((0.58 - na) * 42 + (1 - opc) * 18, 2, 26);
      const lwrNoise = 3.5 / Math.sqrt(dose / 20);

      ctx.fillStyle = "rgba(110, 231, 183, 0.32)";
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(rcx - 48, rcy - 48, 28, 96, cornerRound);
      ctx.roundRect(rcx - 48, rcy + 20, 96, 28, cornerRound);
      ctx.fill();
      ctx.stroke();

      const resCd = (0.32 * 13.5) / na;
      const dof = (0.5 * 13.5) / (na * na);
      return {
        "Half-Pitch CD": `${resCd.toFixed(1)} nm`,
        "Depth of Focus DOF": `${dof.toFixed(1)} nm`,
        "3σ Line-Width Roughness": `${lwrNoise.toFixed(2)} nm`,
        "Corner Fidelity": `${(100 - cornerRound * 2.4).toFixed(0)}%`,
      };
    },

    mat_deal_grove_oxidation(ctx, W, H, st) {
      st.drawHUD("Simulate Deal–Grove thermal SiO₂ growth (44% consumed Si) & LSS Gaussian ion implant", st.spec.formula);
      const C = st.COLORS;
      const tempC = 850 + st.a * 300;
      const kev = 15 + st.b * 165;
      const rta = st.c;

      const xOxNm = 12 + Math.pow((tempC - 800) / 45, 1.8) * 18;
      const rpNm = 18 + kev * 1.15;
      const dRpNm = (8 + kev * 0.32) * (1 + rta * 0.9);

      // Left: Wafer Cross-Section showing 0.44 x_ox Si consumption & Dopant Peak
      const lx = 18, ly = 46, lw = W * 0.44, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Wafer Cross-Section (SiO₂ + Implanted Si)");
      const origSurfY = ly + 72;
      const oxPx = clamp(xOxNm * 0.35, 12, 65);
      ctx.fillStyle = "rgba(103, 232, 249, 0.35)";
      ctx.fillRect(lx + 24, origSurfY - 0.56 * oxPx, lw - 48, oxPx);
      ctx.fillStyle = "rgba(124, 156, 255, 0.25)";
      ctx.fillRect(lx + 24, origSurfY + 0.44 * oxPx, lw - 48, lh - 98);
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = C.accent;
      ctx.beginPath(); ctx.moveTo(lx + 18, origSurfY); ctx.lineTo(lx + lw - 18, origSurfY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.accent;
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText("Original Si Surface (44% consumed below)", lx + 26, origSurfY - 4);

      // Right: LSS Gaussian Implant Depth Profile C(x) & Deal-Grove Linear-Parabolic Curve
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Ion Implant Profile C(x) & Deal–Grove Kinetics");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const depthNm = (i / 100) * 320;
        const cNorm = Math.exp(-Math.pow(depthNm - rpNm, 2) / (2 * dRpNm * dRpNm)) / (1 + rta * 0.35);
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - cNorm * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Oxide Thickness x_ox": `${xOxNm.toFixed(1)} nm`,
        "Projected Range R_p": `${rpNm.toFixed(1)} nm`,
        "Straggle ΔR_p (Post-RTA)": `${dRpNm.toFixed(1)} nm`,
        "Deal–Grove Regime": xOxNm < 45 ? "Linear (B/A · t)" : "Parabolic (√Bt)",
      };
    },

    mat_plasma_rie_ald(ctx, W, H, st) {
      st.drawHUD("Contrast Bosch Deep-RIE scalloped trench etching against self-limiting conformal ALD", st.spec.formula);
      const C = st.COLORS;
      const ar = 2 + st.a * 12;
      const rfBias = 50 + st.b * 450;
      const aldSat = 20 + st.c * 80; // %

      // Left: Bosch Process (SF6 Etch / C4F8 Passivation) Scalloped Trench
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Bosch Deep-RIE Trench (SF₆ / C₄F₈ Cycles)");
      const cx = lx + lw * 0.5, topY = ly + 36;
      const tw = clamp(96 / Math.sqrt(ar * 0.4), 28, 76);
      const th = lh - 54;
      const scallops = 7;
      const scallopAmp = clamp((320 - rfBias * 0.5) / 45, 1.5, 9);

      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(lx + 20, topY);
      ctx.lineTo(cx - tw * 0.5, topY);
      for (let s = 0; s < scallops; s++) {
        const y1 = topY + (s / scallops) * th;
        const y2 = topY + ((s + 1) / scallops) * th;
        ctx.quadraticCurveTo(cx - tw * 0.5 - scallopAmp, (y1 + y2) * 0.5, cx - tw * 0.5, y2);
      }
      ctx.lineTo(cx + tw * 0.5, topY + th);
      for (let s = scallops - 1; s >= 0; s--) {
        const y1 = topY + ((s + 1) / scallops) * th;
        const y2 = topY + (s / scallops) * th;
        ctx.quadraticCurveTo(cx + tw * 0.5 + scallopAmp, (y1 + y2) * 0.5, cx + tw * 0.5, y2);
      }
      ctx.lineTo(lx + lw - 20, topY);
      ctx.stroke();

      // Right: Conformal Atomic Layer Deposition (ALD) Step Coverage
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Self-Limiting ALD Monolayer Step Coverage");
      const rcx = rx + rw * 0.5;
      const stepCov = clamp((aldSat / 100) * Math.exp(-(1 - aldSat / 100) * ar * 0.25), 0.15, 1.0);

      // Substrate trench + conformal film
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 2;
      ctx.strokeRect(rcx - tw * 0.5, topY, tw, th);
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 5 * stepCov;
      ctx.strokeRect(rcx - tw * 0.5 + 3, topY + 3, tw - 6, th - 6);

      return {
        "Trench Aspect Ratio": `${ar.toFixed(1)} : 1`,
        "Bosch Sidewall Scallop": `${(scallopAmp * 14).toFixed(0)} nm`,
        "ALD Step Coverage": `${(stepCov * 100).toFixed(1)}%`,
        "Growth Per Cycle (GPC)": "1.1 Å / cycle",
      };
    },

    mat_li_ion_newman_dfn(ctx, W, H, st) {
      st.drawHUD("Doyle–Fuller–Newman (DFN) porous electrode Li⁺ intercalation & voltage polarization", st.spec.formula);
      const C = st.COLORS;
      const cRate = 0.2 + st.a * 4.8;
      const rpUm = 2 + st.b * 18;
      const eps = 0.2 + st.c * 0.35;

      // Left: Anode (Graphite) | Separator | Cathode (NMC) Spherical Particles
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Anode (LiC₆)  |  Separator  |  Cathode (LiNiMnCoO₂)");
      const sepX = lx + lw * 0.48;
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(sepX - 10, ly + 26); ctx.lineTo(sepX - 10, ly + lh - 12);
      ctx.moveTo(sepX + 10, ly + 26); ctx.lineTo(sepX + 10, ly + lh - 12); ctx.stroke();
      ctx.setLineDash([]);

      // Draw spherical active material particles with radial Li concentration gradient
      for (let side = 0; side < 2; side++) {
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 2; c++) {
            const px = (side === 0 ? lx + 38 : sepX + 38) + c * 46;
            const py = ly + 58 + r * 54;
            const rad = 14 + (rpUm / 20) * 6;
            const grad = ctx.createRadialGradient(px, py, 2, px, py, rad);
            if (side === 0) {
              grad.addColorStop(0, C.accent);
              grad.addColorStop(1, "rgba(124,156,255,0.25)");
            } else {
              grad.addColorStop(0, "rgba(124,156,255,0.25)");
              grad.addColorStop(1, C.ok);
            }
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      // Right: Cell Terminal Voltage V(SOC) with Butler-Volmer & Diffusion Overpotential
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Discharge Voltage Curve V_cell vs State of Discharge");
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      const etaOver = (cRate * 0.065) * (1 + rpUm / 22) / (eps + 0.15);
      const capFactor = clamp(1 - 0.08 * cRate * (rpUm / 12), 0.42, 0.99);
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const dod = i / 100;
        const vOcv = 4.18 - 0.55 * dod - 0.45 * Math.pow(dod / capFactor, 6);
        const vCell = clamp(vOcv - etaOver, 2.5, 4.25);
        const px = gx0 + dod * (gx1 - gx0);
        const py = gy0 - ((vCell - 2.5) / 1.8) * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "C-Rate": `${cRate.toFixed(1)} C`,
        "Overpotential η": `${(etaOver * 1000).toFixed(0)} mV`,
        "Usable Capacity": `${(capFactor * 100).toFixed(1)}%`,
        "Li-Plating Risk": etaOver > 0.28 ? "HIGH (Anode < 0V vs Li)" : "Safe Intercalation",
      };
    },

    mat_perovskite_shockley_queisser(ctx, W, H, st) {
      st.drawHUD("Optimize Perovskite top E_g1 & Silicon bottom E_g2 bandgaps on the Shockley–Queisser curve", st.spec.formula);
      const C = st.COLORS;
      const egTop = 1.45 + st.a * 0.65; // 1.45..2.10 eV
      const egBot = 0.85 + st.b * 0.60; // 0.85..1.45 eV
      const srh = st.c * 0.22;

      // Left: Shockley-Queisser Single-Junction Curve vs Tandem Operating Point
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Shockley–Queisser Limit η(E_g) & 2J Tandem Gain");
      const gx0 = lx + 28, gx1 = lx + lw - 18, gy0 = ly + lh - 24, gy1 = ly + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const eg = 0.5 + (i / 100) * 2.5;
        const sq = 33.7 * Math.exp(-Math.pow((eg - 1.34) / 0.68, 2));
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - (sq / 48) * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const etaTandem = (45.2 * Math.exp(-Math.pow((egTop - 1.72) / 0.42, 2) - Math.pow((egBot - 1.12) / 0.38, 2))) * (1 - srh);
      const tx = gx0 + ((egTop - 0.5) / 2.5) * (gx1 - gx0);
      const ty = gy0 - (etaTandem / 48) * (gy0 - gy1);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fill();

      // Right: AM1.5G Solar Spectrum Absorption Partitioning
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "AM1.5G Spectral Splitting (Perovskite + c-Si)");
      const rx0 = rx + 24, rx1 = rx + rw - 18, ry0 = ry + rh - 24, ry1 = ry + 32;
      for (let i = 0; i < 80; i++) {
        const u = i / 80;
        const ePhot = 0.6 + u * 2.8; // eV
        const flux = Math.pow(ePhot, 2) / (Math.exp(ePhot / 0.52) - 1);
        const hBar = clamp(flux * 1.35, 0, 1) * (ry0 - ry1);
        const px = rx0 + u * (rx1 - rx0);
        ctx.fillStyle = ePhot >= egTop ? C.secondary : (ePhot >= egBot ? C.ok : "rgba(255,255,255,0.14)");
        ctx.fillRect(px, ry0 - hBar, (rx1 - rx0) / 80, hBar);
      }

      return {
        "2J Tandem Efficiency": `${etaTandem.toFixed(1)}%`,
        "Top Perovskite E_g1": `${egTop.toFixed(2)} eV`,
        "Bottom Cell E_g2": `${egBot.toFixed(2)} eV`,
        "1J SQ Limit (1.34 eV)": "33.7%",
      };
    },

    mat_bcs_ginzburg_landau(ctx, W, H, st) {
      st.drawHUD("Nucleate quantized Φ₀ = h/2e Abrikosov flux vortices in a Type-II superconductor", st.spec.formula);
      const C = st.COLORS;
      const kappa = 0.5 + st.a * 6.5;
      const hNorm = 0.05 + st.b * 1.1; // H / Hc2
      const pinJ = st.c;
      const isTypeII = kappa > 0.707;

      // Left: Hexagonal Abrikosov Flux Vortex Lattice |psi(r)|^2
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, isTypeII ? "Hexagonal Abrikosov Vortex Lattice (Φ₀ = h/2e)" : "Type-I Meissner State (κ < 1/√2)");
      const spacing = clamp(58 / Math.sqrt(hNorm + 0.12), 20, 56);
      const coreRad = clamp(18 / kappa, 3.5, 11);

      if (isTypeII && hNorm < 1.0) {
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 7; c++) {
            const jitter = (1 - pinJ) * Math.sin(st.t * 2 + r + c) * 3;
            const vx = lx + 28 + c * spacing + (r % 2) * (spacing * 0.5) + jitter;
            const vy = ly + 40 + r * spacing * 0.866;
            if (vx > lx + lw - 18 || vy > ly + lh - 16) continue;
            ctx.strokeStyle = C.primary;
            ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(vx, vy, coreRad * 2.1, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = C.danger;
            ctx.beginPath(); ctx.arc(vx, vy, coreRad, 0, Math.PI * 2); ctx.fill();
          }
        }
      } else {
        ctx.fillStyle = hNorm >= 1.0 ? "rgba(255,107,107,0.22)" : "rgba(110,231,183,0.22)";
        ctx.fillRect(lx + 16, ly + 28, lw - 32, lh - 40);
      }

      // Right: Magnetization Curve -M(H) showing H_c1 and H_c2
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Magnetization −M(H) & Critical Fields H_c1, H_c2");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      const hc1Norm = clamp(1 / (2 * kappa * kappa + 0.5), 0.08, 0.55);
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx0 + hc1Norm * (gx1 - gx0), gy1 + 18);
      if (isTypeII) {
        ctx.lineTo(gx0 + 0.92 * (gx1 - gx0), gy0);
      } else {
        ctx.lineTo(gx0 + hc1Norm * (gx1 - gx0), gy0);
      }
      ctx.stroke();

      const hPx = gx0 + clamp(hNorm * 0.92, 0, 1) * (gx1 - gx0);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(hPx, gy1); ctx.lineTo(hPx, gy0); ctx.stroke();
      ctx.setLineDash([]);

      return {
        "GL Parameter κ = λ/ξ": `${kappa.toFixed(2)} (${isTypeII ? "Type-II" : "Type-I"})`,
        "Applied Field H/H_c2": hNorm.toFixed(2),
        "Vortex Spacing a_v": isTypeII && hNorm < 1 ? `${(spacing * 1.8).toFixed(0)} nm` : "N/A",
        "Flux Quantum Φ₀": "2.068 × 10⁻¹⁵ Wb",
      };
    },

    mat_metamaterial_split_ring(ctx, W, H, st) {
      st.drawHUD("Tune Split-Ring Resonator (SRR) gap to enter the double-negative (ε < 0, μ < 0) n < 0 band", st.spec.formula);
      const C = st.COLORS;
      const freq = 6 + st.a * 10; // GHz
      const gapUm = 2 + st.b * 18;
      const f0 = 9.0 + gapUm * 0.15;
      const epsEff = 1 - (14.5 * 14.5) / (freq * freq);
      const muEff = 1 - (0.55 * freq * freq) / (freq * freq - f0 * f0 + 0.35 * Math.sign(freq - f0 || 1));
      const isDNG = epsEff < 0 && muEff < 0;
      const nEff = isDNG ? -Math.sqrt(Math.abs(epsEff * muEff)) : Math.sqrt(Math.abs(epsEff * muEff));

      // Left: Split-Ring Resonator Unit Cell + Negative Snell Refraction Ray
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "SRR Unit Cell & Negative Snell Refraction");
      const srrX = lx + lw * 0.28, srrY = ly + lh * 0.52;
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(srrX, srrY, 26, 0.25, Math.PI * 2 - 0.25); ctx.stroke();
      ctx.beginPath(); ctx.arc(srrX, srrY, 17, Math.PI + 0.25, Math.PI * 3 - 0.25); ctx.stroke();

      // Refraction interface at x = midR
      const intX = lx + lw * 0.64, intY = ly + lh * 0.54;
      ctx.fillStyle = "rgba(124,156,255,0.16)";
      ctx.fillRect(intX, ly + 28, lw * 0.32, lh - 40);
      drawArrow(ctx, intX - 46, intY - 46, intX, intY, C.primary, 2.2);
      // Refracted ray bends to SAME side of normal when n < 0!
      const outY = isDNG ? intY - 38 : intY + 38;
      drawArrow(ctx, intX, intY, intX + 48, outY, isDNG ? C.ok : C.secondary, 2.4);

      // Right: Permittivity eps(w) and Permeability mu(w) Dispersion Curves
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Dispersion ε_eff(ω), μ_eff(ω) & Double-Negative Band");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gyMid = ry + rh * 0.54;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gyMid); ctx.lineTo(gx1, gyMid); ctx.stroke();

      // Plot eps and mu
      [0, 1].forEach((kind) => {
        ctx.strokeStyle = kind === 0 ? C.primary : C.secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const f = 6 + (i / 100) * 10;
          const val = kind === 0 ? (1 - 210 / (f * f)) : clamp(1 - (0.55 * f * f) / ((f * f - f0 * f0) || 0.2), -2.5, 2.5);
          const px = gx0 + (i / 100) * (gx1 - gx0);
          const py = clamp(gyMid - val * 26, ry + 28, ry + rh - 14);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      return {
        "Refractive Index n(ω)": `${nEff.toFixed(2)} (${isDNG ? "Left-Handed DNG" : "Right-Handed"})`,
        "Effective ε(ω)": epsEff.toFixed(2),
        "Effective μ(ω)": muEff.toFixed(2),
        "SRR Resonance f₀": `${f0.toFixed(2)} GHz`,
      };
    },

    mat_polymer_flory_visco(ctx, W, H, st) {
      st.drawHUD("Explore Flory–Huggins ΔG_mix(φ) miscibility & Maxwell–Zener viscoelastic moduli G'(ω), G''(ω)", st.spec.formula);
      const C = st.COLORS;
      const chi = 0.2 + st.a * 2.4;
      const N = 10 + st.b * 190;
      const logWt = -3 + st.c * 6;
      const chiCrit = 2.0 / N;

      // Left: Flory-Huggins Free Energy of Mixing Curve
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Flory–Huggins Mixing Energy ΔG_m / RT vs φ");
      const gx0 = lx + 26, gx1 = lx + lw - 18, gyMid = ly + lh * 0.48;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gyMid); ctx.lineTo(gx1, gyMid); ctx.stroke();

      ctx.strokeStyle = chi > chiCrit ? C.secondary : C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 1; i < 100; i++) {
        const phi = i / 100;
        const dg = (phi / N) * Math.log(phi) + ((1 - phi) / N) * Math.log(1 - phi) + chi * phi * (1 - phi) * 0.12;
        const px = gx0 + phi * (gx1 - gx0);
        const py = gyMid - dg * 850;
        if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Right: Viscoelastic Storage G'(w) & Loss G''(w) Master Curve
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Viscoelastic Master Curve: Storage G'(ω) & Loss G''(ω)");
      const rx0 = rx + 26, rx1 = rx + rw - 18, ry0 = ry + rh - 24, ry1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx0, ry0); ctx.lineTo(rx1, ry0); ctx.stroke();

      [0, 1].forEach((mode) => {
        ctx.strokeStyle = mode === 0 ? C.primary : C.accent;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const lwVal = -3 + (i / 100) * 6;
          const wt = Math.pow(10, lwVal);
          const val = mode === 0 ? (0.12 + 0.82 * (wt * wt) / (1 + wt * wt)) : (0.08 + 0.78 * wt / (1 + wt * wt));
          const px = rx0 + (i / 100) * (rx1 - rx0);
          const py = ry0 - val * (ry0 - ry1);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      const wtCur = Math.pow(10, logWt);
      const tanDelta = (0.08 + 0.78 * wtCur / (1 + wtCur * wtCur)) / (0.12 + 0.82 * (wtCur * wtCur) / (1 + wtCur * wtCur));
      return {
        "Interaction χ vs χ_c": `${chi.toFixed(2)} (χ_c = ${chiCrit.toFixed(3)})`,
        "Loss Tangent tan δ": tanDelta.toFixed(2),
        "Viscoelastic State": logWt < -0.6 ? "Rubbery Flow" : (logWt > 0.6 ? "Glassy Plateau" : "Leathery T_g Transition"),
        "Chain Length N": `${N.toFixed(0)} monomers`,
      };
    },

    mat_shape_memory_nitinol(ctx, W, H, st) {
      st.drawHUD("Cycle temperature T/T_Af & stress σ across Nitinol Austenite ↔ Martensite Landau wells", st.spec.formula);
      const C = st.COLORS;
      const tNorm = 0.6 + st.a * 0.9; // 0.6..1.5
      const sigma = (st.b - 0.5) * 400; // -200..+200 MPa
      const hyst = 0.2 + st.c * 0.8;

      // Left: Landau 6th-order Free Energy Landscape F(eps, T)
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Landau Free Energy F(ε, T) & Lattice Variant");
      const gx0 = lx + 24, gx1 = lx + lw - 18, gy0 = ly + lh - 26, gy1 = ry_top(ly);
      function ry_top(y) { return y + 34; }

      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const eps = (i / 100) * 2 - 1;
        const F = 0.5 * (tNorm - 1.05) * eps * eps - 0.42 * Math.pow(eps, 4) + 0.32 * Math.pow(eps, 6) - (sigma / 900) * eps;
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - 48 - F * 160;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Right: Superelastic / Pseudoelastic Flag Hysteresis Loop sigma(eps)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, tNorm > 1.0 ? "Superelastic Flag Hysteresis Loop σ(ε)" : "Ferroelastic Detwinning Loop σ(ε)");
      const rcx = rx + rw * 0.5, rcy = ry + rh * 0.54;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx + 20, rcy); ctx.lineTo(rx + rw - 20, rcy);
      ctx.moveTo(rcx, ry + 28); ctx.lineTo(rcx, ry + rh - 16); ctx.stroke();

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      const hw = rw * 0.34, hh = rh * 0.32;
      if (tNorm > 1.0) {
        // Superelastic upper/lower flag loop in Q1
        ctx.moveTo(rcx, rcy);
        ctx.lineTo(rcx + hw * 0.25, rcy - hh * 0.55);
        ctx.lineTo(rcx + hw * 0.85, rcy - hh * 0.62);
        ctx.lineTo(rcx + hw, rcy - hh * 0.92);
        ctx.lineTo(rcx + hw * 0.78, rcy - hh * (0.42 - hyst * 0.18));
        ctx.lineTo(rcx + hw * 0.18, rcy - hh * (0.35 - hyst * 0.18));
        ctx.closePath();
      } else {
        // Detwinning butterfly loop around origin
        ctx.strokeRect(rcx - hw * 0.65, rcy - hh * 0.5, hw * 1.3, hh);
      }
      ctx.stroke();

      return {
        "Phase State": tNorm > 1.05 ? "B2 Cubic Austenite" : "B19' Twinned Martensite",
        "Reduced Temp T/T_Af": tNorm.toFixed(2),
        "Transformation Strain": "6.5% Recoverable",
        "Mechanical Regime": tNorm > 1.0 ? "Superelasticity" : "Shape-Memory Effect",
      };
    },

    mat_corrosion_pourbaix_tafel(ctx, W, H, st) {
      st.drawHUD("Inspect anodic Cr₂O₃ passivation nose on the Evans diagram & Pourbaix E–pH regimes", st.spec.formula);
      const C = st.COLORS;
      const ph = 1 + st.a * 12;
      const crPct = 4 + st.b * 22; // Stainless threshold ~ 12% Cr
      const clMm = 1 + st.c * 500;

      // Left: Evans / Tafel Polarization Diagram (Potential E vs log10|i|)
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Evans Polarization: Active → Passive → Transpassive");
      const gx0 = lx + 30, gx1 = lx + lw - 18, gy0 = ly + lh - 24, gy1 = ly + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      const iPass = clamp(0.55 - (crPct / 26) * 0.42, 0.12, 0.65);
      const ePit = clamp(0.82 - (clMm / 600) * 0.35, 0.42, 0.85);
      // Anodic S-shaped passivation curve
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(gx0 + 0.15 * (gx1 - gx0), gy0 - 0.12 * (gy0 - gy1));
      ctx.lineTo(gx0 + 0.78 * (gx1 - gx0), gy0 - 0.36 * (gy0 - gy1)); // Active peak I_crit
      ctx.lineTo(gx0 + iPass * (gx1 - gx0), gy0 - 0.44 * (gy0 - gy1)); // Passive wall
      ctx.lineTo(gx0 + iPass * (gx1 - gx0), gy0 - ePit * (gy0 - gy1));  // Pitting potential E_pit
      ctx.lineTo(gx0 + 0.88 * (gx1 - gx0), gy0 - 0.92 * (gy0 - gy1));
      ctx.stroke();

      // Cathodic O2/H+ reduction line
      const eCath = clamp(0.75 - (ph / 14) * 0.35, 0.28, 0.78);
      ctx.strokeStyle = C.secondary;
      ctx.beginPath();
      ctx.moveTo(gx0 + 0.12 * (gx1 - gx0), gy0 - eCath * (gy0 - gy1));
      ctx.lineTo(gx0 + 0.85 * (gx1 - gx0), gy0 - (eCath - 0.42) * (gy0 - gy1));
      ctx.stroke();

      // Right: Pourbaix E-pH Stability Map (Immunity / Corrosion / Passivation)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Pourbaix E–pH Map (Immunity / Corrosion / Passivity)");
      const rx0 = rx + 26, rx1 = rx + rw - 18, ry0 = ry + rh - 24, ry1 = ry + 32;
      // Regions
      ctx.fillStyle = "rgba(255,107,107,0.22)";
      ctx.fillRect(rx0, ry1, (rx1 - rx0) * 0.42, (ry0 - ry1) * 0.65);
      ctx.fillStyle = "rgba(110,231,183,0.22)";
      ctx.fillRect(rx0 + (rx1 - rx0) * 0.42, ry1, (rx1 - rx0) * 0.58, (ry0 - ry1) * 0.65);
      ctx.fillStyle = "rgba(124,156,255,0.22)";
      ctx.fillRect(rx0, ry1 + (ry0 - ry1) * 0.65, rx1 - rx0, (ry0 - ry1) * 0.35);

      const curPx = rx0 + ((ph - 1) / 13) * (rx1 - rx0);
      const curPy = ry0 - eCath * (ry0 - ry1);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(curPx, curPy, 6, 0, Math.PI * 2); ctx.fill();

      return {
        "Surface State": crPct >= 12 && ph > 4.5 ? "Passive Cr₂O₃ Film" : "Active Dissolution",
        "Pitting Potential E_pit": `+${(ePit * 950 - 200).toFixed(0)} mV_SHE`,
        "Passive Current i_pass": `${(Math.pow(10, iPass * 3 - 2)).toFixed(2)} µA/cm²`,
        "Electrolyte pH": ph.toFixed(1),
      };
    },

    // =========================================================================
    // 2. SYSTEMS, ARCHITECTURE & DISTRIBUTED COMPUTING (20 SIMULATIONS)
    // =========================================================================

    sys_tomasulo_ooo(ctx, W, H, st) {
      st.drawHUD("Tomasulo Out-of-Order: RAT Renaming → Reservation Stations → Common Data Bus (CDB) → ROB Commit", st.spec.formula);
      const C = st.COLORS;
      const robSz = Math.round(16 + st.a * 112);
      const issueW = Math.round(2 + st.b * 6);
      const mispPct = 1 + st.c * 14;
      const step = Math.floor(st.t * 1.8);

      // Left: Reservation Stations (Add/Sub & Mul/Div) + Common Data Bus
      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Reservation Stations (RS) & Common Data Bus (CDB)");
      const rsRows = [
        { unit: "Add1", op: "FADD", vj: "Val(P3)", vk: "Wait(ROB4)", qj: "—", qk: "#ROB4", rdy: step % 2 === 0 },
        { unit: "Add2", op: "FSUB", vj: "Val(P1)", vk: "Val(P2)",   qj: "—", qk: "—",     rdy: true },
        { unit: "Mul1", op: "FMUL", vj: "Val(P7)", vk: "Wait(ROB2)", qj: "—", qk: "#ROB2", rdy: step % 3 === 0 },
        { unit: "Mul2", op: "FDIV", vj: "Val(P5)", vk: "Val(P6)",   qj: "—", qk: "—",     rdy: false },
        { unit: "Load1",op: "LD",   vj: "0x40A0",  vk: "+64",       qj: "—", qk: "—",     rdy: true },
      ];
      ctx.font = "10px monospace";
      rsRows.forEach((r, i) => {
        const y = ly + 32 + i * 24;
        ctx.fillStyle = r.rdy ? "rgba(110,231,183,0.16)" : "rgba(255,209,102,0.14)";
        ctx.fillRect(lx + 10, y - 13, lw - 20, 20);
        ctx.fillStyle = r.rdy ? C.ok : C.accent;
        ctx.fillText(`${r.unit.padEnd(5)} | ${r.op.padEnd(4)} | Vj:${r.vj.padEnd(9)} | Qk:${r.qk}`, lx + 16, y);
      });

      // Common Data Bus (CDB) broadcast wire at bottom of left panel
      const cdbY = ly + lh - 22;
      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(lx + 14, cdbY); ctx.lineTo(lx + lw - 14, cdbY); ctx.stroke();
      const pulseX = lx + 14 + ((st.t * 140) % (lw - 28));
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(pulseX, cdbY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.secondary;
      ctx.fillText(`CDB Broadcast: Tag #ROB${(step % 6) + 1} → Wakeup Waiting Operands`, lx + 16, cdbY - 8);

      // Right: Circular Reorder Buffer (ROB) Head -> Tail In-Order Commit
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `Circular Reorder Buffer (ROB: ${robSz} slots)`);
      const rcx = rx + rw * 0.5, rcy = ry + rh * 0.54, rr = Math.min(rw, rh) * 0.31;
      const slots = 12;
      const headIdx = step % slots;
      for (let i = 0; i < slots; i++) {
        const ang = (i / slots) * Math.PI * 2 - Math.PI * 0.5;
        const sx = rcx + Math.cos(ang) * rr, sy = rcy + Math.sin(ang) * rr;
        const dist = (i - headIdx + slots) % slots;
        ctx.fillStyle = dist === 0 ? C.ok : (dist < 7 ? C.primary : "rgba(255,255,255,0.12)");
        ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = C.text;
      ctx.fillText("Head (Commit)", rcx - 34, rcy - 4);
      ctx.fillText("Tail (Dispatch)", rcx - 36, rcy + 12);

      const ipc = (issueW * (0.82 - mispPct * 0.03) * Math.min(1.15, 0.65 + robSz / 160)).toFixed(2);
      return {
        "Sustained IPC": `${ipc} insn/cyc`,
        "ROB Occupancy": `${Math.min(robSz, Math.round(robSz * 0.72))} / ${robSz}`,
        "Superscalar Width": `${issueW}-wide`,
        "Branch Flush Penalty": `${(mispPct * 1.4).toFixed(1)}% cycles`,
      };
    },

    sys_mesi_cache_coherence(ctx, W, H, st) {
      st.drawHUD("Click core to issue PrWr/BusRdX & watch MESI cache line invalidations and false sharing", st.spec.formula);
      const C = st.COLORS;
      const nCores = Math.max(2, Math.min(4, Math.round(2 + st.a * 2)));
      const strideB = Math.round(8 + st.b * 120);
      const wrRatio = 10 + st.c * 80;
      const falseSharing = strideB < 64;
      const writerCore = Math.floor(st.t * 1.3) % nCores;

      // Top/Left: 4 CPU Core Private L1 Cache Blocks with MESI badges
      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Multi-Core L1 Caches, Snooping Interconnect & 64B Cache Line");
      const busY = ly + lh * 0.62;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(lx + 24, busY); ctx.lineTo(lx + lw - 24, busY); ctx.stroke();
      ctx.fillStyle = C.muted;
      ctx.font = "10px monospace";
      ctx.fillText("Coherent Snooping Ring / Crossbar Bus (BusRd / BusRdX / FlushOpt)", lx + 28, busY + 15);

      for (let i = 0; i < nCores; i++) {
        const cx = lx + 36 + i * ((lw - 72) / Math.max(1, nCores - 1));
        const bx = clamp(cx - 52, lx + 16, lx + lw - 120);
        const by = ly + 28;
        const isWriter = i === writerCore;
        const mesiState = isWriter ? "M (Modified)" : (falseSharing ? "I (Invalid)" : "S (Shared)");
        const badgeCol = isWriter ? C.danger : (falseSharing ? C.muted : C.ok);

        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.strokeStyle = badgeCol;
        ctx.lineWidth = 1.8;
        ctx.fillRect(bx, by, 104, 58);
        ctx.strokeRect(bx, by, 104, 58);
        ctx.fillStyle = C.text;
        ctx.fillText(`Core ${i} L1D`, bx + 10, by + 16);
        ctx.fillStyle = badgeCol;
        ctx.fillText(mesiState, bx + 10, by + 34);
        ctx.fillStyle = C.accent;
        ctx.fillText(`Off: +${(i * strideB) % 64}B`, bx + 10, by + 50);

        drawArrow(ctx, bx + 52, by + 58, bx + 52, busY, badgeCol, 1.8);
      }

      // Bottom: 64-Byte Cache Line Sub-Word Map showing False Sharing collision
      const lineY = busY + 26;
      ctx.strokeStyle = C.axis;
      ctx.strokeRect(lx + 28, lineY, lw - 56, 26);
      for (let slot = 0; slot < 8; slot++) {
        const sx = lx + 28 + slot * ((lw - 56) / 8);
        ctx.strokeRect(sx, lineY, (lw - 56) / 8, 26);
        ctx.fillStyle = slot === (writerCore * Math.max(1, Math.floor(strideB / 8))) % 8 ? C.danger : "rgba(124,156,255,0.2)";
        ctx.fillRect(sx + 1, lineY + 1, (lw - 56) / 8 - 2, 24);
      }

      return {
        "Coherence Traffic": falseSharing ? "STORM (False Sharing!)" : "Low (Isolated Lines)",
        "Thread Stride": `${strideB} Bytes (${falseSharing ? "< 64B Line" : "≥ 64B Line"})`,
        "BusRdX Invalidations": `${(falseSharing ? wrRatio * 1.4 : wrRatio * 0.15).toFixed(0)} / 1k ops`,
        "Active Owner Core": `Core ${writerCore} (State M)`,
      };
    },

    sys_tlb_radix_pagewalk(ctx, W, H, st) {
      st.drawHUD("Trace x86-64 4-Level Radix Page Table Walk (CR3 → PML4 → PDPT → PD → PT) & TLB", st.spec.formula);
      const C = st.COLORS;
      const wsMb = 4 + st.a * 508;
      const hugePct = st.b * 100;
      const pcidOn = st.c > 0.4;

      // Top: 48-bit Virtual Address Bit-Slice Breakdown
      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "x86-64 48-Bit Virtual Address Translation & Radix Tree Walk");
      const segs = [
        { name: "PML4 [47:39]", bits: "9b", col: C.primary },
        { name: "PDPT [38:30]", bits: "9b", col: C.ok },
        { name: "PD [29:21]",   bits: "9b", col: C.accent },
        { name: "PT [20:12]",   bits: "9b (Skip if 2MB)", col: hugePct > 50 ? C.muted : C.secondary },
        { name: "Offset [11:0]",bits: "12b", col: C.primary },
      ];
      const sw = (lw - 32) / segs.length;
      segs.forEach((s, i) => {
        const sx = lx + 16 + i * sw;
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.strokeStyle = s.col;
        ctx.lineWidth = 1.8;
        ctx.fillRect(sx, ly + 28, sw - 6, 34);
        ctx.strokeRect(sx, ly + 28, sw - 6, 34);
        ctx.fillStyle = s.col;
        ctx.font = "600 10px monospace";
        ctx.fillText(s.name, sx + 6, ly + 43);
        ctx.fillStyle = C.muted;
        ctx.fillText(s.bits, sx + 6, ly + 56);
      });

      // Bottom: 4-Stage Radix Page Table Boxes + L1/L2 dTLB Bypass Path
      const stageY = ly + 98;
      const stages = ["CR3 Reg", "L4: PML4", "L3: PDPT", "L2: PD (2MB)", "L1: PT (4KB)", "Phys RAM"];
      const stW = (lw - 32) / stages.length;
      stages.forEach((name, i) => {
        const sx = lx + 16 + i * stW;
        const skipped = i === 4 && hugePct > 50;
        ctx.strokeStyle = skipped ? "rgba(255,255,255,0.18)" : C.ok;
        ctx.strokeRect(sx, stageY, stW - 14, 42);
        ctx.fillStyle = skipped ? C.muted : C.text;
        ctx.fillText(name, sx + 6, stageY + 25);
        if (i < stages.length - 1) {
          drawArrow(ctx, sx + stW - 14, stageY + 21, sx + stW, stageY + 21, C.accent, 1.6);
        }
      });

      // TLB Fast-Path Arc
      ctx.strokeStyle = C.secondary;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(lx + 40, stageY);
      ctx.quadraticCurveTo(lx + lw * 0.5, stageY - 38, lx + lw - 55, stageY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.secondary;
      ctx.fillText("L1/L2 dTLB Hit Fast-Path (1 cycle, 0 page-table memory reads)", lx + lw * 0.26, stageY - 18);

      const tlbReachMb = 6 + hugePct * 3.2;
      const hitRate = clamp(100 * Math.exp(-Math.max(0, wsMb - tlbReachMb) / (180 + (pcidOn ? 90 : 0))), 42, 99.8);
      const walkCycles = hugePct > 50 ? 18 : 28;
      const emat = 4 + (1 - hitRate / 100) * walkCycles;
      return {
        "dTLB Hit Ratio": `${hitRate.toFixed(1)}%`,
        "Effective Access EMAT": `${emat.toFixed(2)} cycles`,
        "Page Walk Depth": hugePct > 50 ? "3 Levels (2MB HugePage)" : "4 Levels (4KB Base)",
        "PCID ASID Tagging": pcidOn ? "Enabled (No CR3 Flush)" : "Disabled (Full Flush)",
      };
    },

    sys_cfs_eevdf_scheduler(ctx, W, H, st) {
      st.drawHUD("Linux CFS / EEVDF Red-Black Tree ordered by Virtual Runtime (vruntime) & Lag", st.spec.formula);
      const C = st.COLORS;
      const nTasks = Math.round(5 + st.a * 6);
      const niceSpread = Math.round(st.b * 20);
      const sliceMs = 1 + st.c * 9;

      // Left: Red-Black Tree with Leftmost Minimum vruntime Node Highlighted
      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Red-Black Runqueue Tree (Leftmost = Next Pick)");
      const baseVr = Math.floor(st.t * 18);
      const nodes = [
        { x: 0.50, y: 0.22, vr: baseVr + 14, red: false, p: -1 },
        { x: 0.26, y: 0.46, vr: baseVr + 6,  red: true,  p: 0 },
        { x: 0.74, y: 0.46, vr: baseVr + 25, red: true,  p: 0 },
        { x: 0.14, y: 0.74, vr: baseVr + 1,  red: false, p: 1, leftmost: true },
        { x: 0.38, y: 0.74, vr: baseVr + 11, red: false, p: 1 },
        { x: 0.62, y: 0.74, vr: baseVr + 19, red: false, p: 2 },
        { x: 0.86, y: 0.74, vr: baseVr + 33, red: false, p: 2 },
      ];
      nodes.forEach((nd) => {
        if (nd.p >= 0) {
          const par = nodes[nd.p];
          ctx.strokeStyle = C.axis;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(lx + par.x * lw, ly + par.y * lh);
          ctx.lineTo(lx + nd.x * lw, ly + nd.y * lh);
          ctx.stroke();
        }
      });
      nodes.forEach((nd) => {
        const nx = lx + nd.x * lw, ny = ly + nd.y * lh;
        ctx.fillStyle = nd.red ? "#b91c1c" : "#1e293b";
        ctx.strokeStyle = nd.leftmost ? C.ok : C.primary;
        ctx.lineWidth = nd.leftmost ? 2.8 : 1.5;
        ctx.beginPath(); ctx.arc(nx, ny, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = C.text;
        ctx.font = "600 9px monospace";
        ctx.fillText(`v:${nd.vr}`, nx - 13, ny + 3);
      });

      // Right: Task Virtual Runtime vs Physical CPU Timeline Bars
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Task Weights (Nice) & Virtual Deadline Lag");
      for (let i = 0; i < 5; i++) {
        const nice = (i - 2) * Math.max(1, Math.floor(niceSpread / 2));
        const by = ry + 32 + i * 28;
        const barW = clamp(((rw - 90) * (0.45 + 0.35 * Math.sin(st.t * 1.6 + i))), 24, rw - 90);
        ctx.fillStyle = i === 0 ? C.ok : C.primary;
        ctx.fillRect(rx + 74, by - 10, barW, 14);
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(`T${i} (n=${nice >= 0 ? "+"+nice : nice})`, rx + 10, by);
      }

      return {
        "Min vruntime (rb_leftmost)": `${baseVr + 1} ns`,
        "Runnable Threads": `${nTasks} tasks`,
        "Base Slice Quantum": `${sliceMs.toFixed(1)} ms`,
        "EEVDF Eligibility": "Lag ≥ 0 (Deadline-Fair)",
      };
    },

    sys_io_uring_sq_cq(ctx, W, H, st) {
      st.drawHUD("Zero-copy Linux io_uring shared Submission Queue (SQ) & Completion Queue (CQ) rings", st.spec.formula);
      const C = st.COLORS;
      const batch = Math.round(4 + st.a * 60);
      const sqpoll = st.b > 0.45;
      const nvmeUs = 8 + st.c * 92;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "User/Kernel Shared Memory Ring Buffers (SQRing → NVMe DMA → CQRing)");
      const sqX = lx + lw * 0.24, cqX = lx + lw * 0.76, cy = ly + lh * 0.54, rr = Math.min(lw * 0.16, lh * 0.32);

      // Draw SQ Ring (Left) and CQ Ring (Right)
      [
        { cx: sqX, name: "SQ Ring (Head/Tail)", col: C.primary, phase: st.t * 3 },
        { cx: cqX, name: "CQ Ring (Completions)", col: C.ok, phase: st.t * 3 - 1.2 },
      ].forEach((ring) => {
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * Math.PI * 2;
          const x = ring.cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr;
          const active = ((i - Math.floor(ring.phase)) & 11) < 5;
          ctx.fillStyle = active ? ring.col : "rgba(255,255,255,0.1)";
          ctx.beginPath(); ctx.arc(x, y, 7.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = C.text;
        ctx.font = "600 10px system-ui, sans-serif";
        ctx.fillText(ring.name, ring.cx - 48, cy + rr + 20);
      });

      // Center NVMe Queue Pair & SQPOLL thread bridge
      const midX = lx + lw * 0.5;
      ctx.strokeStyle = C.accent;
      ctx.strokeRect(midX - 54, cy - 32, 108, 64);
      ctx.fillStyle = C.accent;
      ctx.fillText(sqpoll ? "SQPOLL KThread" : "io_uring_enter()", midX - 42, cy - 8);
      ctx.fillStyle = C.muted;
      ctx.fillText("NVMe PCIe DMA", midX - 40, cy + 14);
      drawArrow(ctx, sqX + rr + 12, cy - 10, midX - 56, cy - 10, C.primary, 2);
      drawArrow(ctx, midX + 56, cy + 10, cqX - rr - 12, cy + 10, C.ok, 2);

      const iopsK = Math.round((batch * (sqpoll ? 28 : 16)) * (45 / (nvmeUs + 15)));
      return {
        "Throughput IOPS": `${iopsK}k IOPS`,
        "Syscalls per Batch": sqpoll ? "0 (SQPOLL Kernel Poll)" : `1 per ${batch} SQEs`,
        "NVMe Media Latency": `${nvmeUs.toFixed(0)} µs`,
        "Memory Copy Overhead": "Zero-Copy (Fixed Buffers)",
      };
    },

    sys_ssa_dominator_regalloc(ctx, W, H, st) {
      st.drawHUD("LLVM SSA Dominance Frontier φ-Nodes & Chaitin k-Coloring Register Interference Graph", st.spec.formula);
      const C = st.COLORS;
      const kRegs = Math.round(3 + st.a * 5); // 3..8 physical registers
      const pressure = 1 + Math.round(st.b * 5);
      const spills = Math.max(0, pressure + 2 - kRegs);

      // Left: Control Flow Graph (CFG) Diamond + Join Block with Phi Node
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "SSA Control-Flow Graph & Dominance Frontier φ-Join");
      const cx = lx + lw * 0.5;
      const bbs = [
        { x: cx - 38, y: ly + 28, w: 76, h: 28, txt: "BB0: x₁ = 1" },
        { x: cx - 96, y: ly + 78, w: 76, h: 28, txt: "BB1: x₂ = x₁+4" },
        { x: cx + 20, y: ly + 78, w: 76, h: 28, txt: "BB2: x₃ = x₁*2" },
        { x: cx - 64, y: ly + 132, w: 128, h: 32, txt: "BB3: x₄ = φ(x₂, x₃)", phi: true },
      ];
      drawArrow(ctx, cx, ly + 56, cx - 58, ly + 78, C.axis, 1.5);
      drawArrow(ctx, cx, ly + 56, cx + 58, ly + 78, C.axis, 1.5);
      drawArrow(ctx, cx - 58, ly + 106, cx - 18, ly + 132, C.primary, 1.6);
      drawArrow(ctx, cx + 58, ly + 106, cx + 18, ly + 132, C.primary, 1.6);
      bbs.forEach((b) => {
        ctx.fillStyle = b.phi ? "rgba(255,209,102,0.16)" : "rgba(124,156,255,0.12)";
        ctx.strokeStyle = b.phi ? C.accent : C.primary;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(b.txt, b.x + 6, b.y + 18);
      });

      // Right: Chaitin Register Interference Graph (k-coloring vs Spill)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `Register Interference Graph (k = ${kRegs} Physical Regs)`);
      const rcx = rx + rw * 0.5, rcy = ry + rh * 0.54, rad = Math.min(rw, rh) * 0.30;
      const vNodes = 6;
      const coords = [];
      for (let i = 0; i < vNodes; i++) {
        const a = (i / vNodes) * Math.PI * 2 - Math.PI * 0.5;
        coords.push([rcx + Math.cos(a) * rad, rcy + Math.sin(a) * rad]);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      for (let i = 0; i < vNodes; i++) {
        for (let j = i + 1; j < vNodes; j++) {
          if ((i + j) % 2 === 1 || j - i === 1) {
            ctx.beginPath(); ctx.moveTo(coords[i][0], coords[i][1]); ctx.lineTo(coords[j][0], coords[j][1]); ctx.stroke();
          }
        }
      }
      coords.forEach(([nx, ny], i) => {
        const spilled = i >= kRegs;
        ctx.fillStyle = spilled ? C.danger : C.series[i % C.series.length];
        ctx.beginPath(); ctx.arc(nx, ny, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0f1222";
        ctx.font = "bold 10px monospace";
        ctx.fillText(spilled ? "SPL" : `R${i}`, nx - 9, ny + 3);
      });

      return {
        "Physical Registers k": `${kRegs} regs`,
        "Chromatic Number χ(G)": `${Math.min(6, pressure + 2)}`,
        "Stack Spill Count": `${spills} live ranges`,
        "SSA Join Nodes": "Minimal Dominance Frontier",
      };
    },

    sys_polyhedral_loop_tile(ctx, W, H, st) {
      st.drawHUD("Transform (i, j) polyhedral iteration space with cache tiling T & climb the Roofline model", st.spec.formula);
      const C = st.COLORS;
      const tileT = Math.round(8 + st.a * 56);
      const simd = Math.round(4 + st.b * 12);
      const bwGbs = 100 + st.c * 800;

      // Left: 2D Polyhedral Iteration Space Lattice (i, j) with Tiled Blocks
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Polyhedral Iteration Space (Tile T = ${tileT}×${tileT})`);
      const nGrid = 8;
      const stepPx = Math.min(lw - 44, lh - 48) / nGrid;
      const activeTile = Math.floor(st.t * 2) % 4;
      for (let r = 0; r < nGrid; r++) {
        for (let c = 0; c < nGrid; c++) {
          const tIdx = Math.floor(r / 4) * 2 + Math.floor(c / 4);
          const x = lx + 26 + c * stepPx + (r * 2); // slight unimodular skew
          const y = ly + 34 + r * stepPx;
          ctx.fillStyle = tIdx === activeTile ? C.ok : C.primary;
          ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Right: Log-Log Roofline Model (GFLOP/s vs Operational Intensity FLOP/Byte)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Log–Log Roofline Model (Memory Bound vs Compute Bound)");
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 34;
      const ridgeX = gx0 + 0.46 * (gx1 - gx0);
      const roofY = gy1 + 18;

      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0 - 16);
      ctx.lineTo(ridgeX, roofY);
      ctx.lineTo(gx1, roofY);
      ctx.stroke();

      // Current kernel operating point climbing the slope with larger tile size T
      const oiNorm = clamp(0.15 + (tileT / 64) * 0.65, 0.1, 0.9);
      const kx = gx0 + oiNorm * (gx1 - gx0);
      const ky = kx < ridgeX ? lerp(gy0 - 16, roofY, (kx - gx0) / (ridgeX - gx0)) : roofY;
      ctx.fillStyle = C.secondary;
      ctx.beginPath(); ctx.arc(kx, ky, 6.5, 0, Math.PI * 2); ctx.fill();

      const oiVal = (tileT / 4).toFixed(1);
      const peakGflops = Math.min(simd * 120, (tileT / 4) * (bwGbs * 0.25));
      return {
        "Operational Intensity": `${oiVal} FLOP/Byte`,
        "Attained Performance": `${peakGflops.toFixed(0)} GFLOP/s`,
        "Bottleneck Regime": kx < ridgeX ? "DRAM Bandwidth-Bound" : "SIMD Compute-Bound",
        "DRAM Bandwidth": `${bwGbs.toFixed(0)} GB/s`,
      };
    },

    sys_gpu_warp_divergence(ctx, W, H, st) {
      st.drawHUD("32-Thread CUDA Warp SIMT Branch Divergence Mask & Shared-Memory Bank Conflict Crossbar", st.spec.formula);
      const C = st.COLORS;
      const divPct = st.a * 100;
      const stride = Math.max(1, Math.round(1 + st.b * 15));
      const regs = Math.round(16 + st.c * 80);

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "32-Lane Warp Execution Mask (if/else) & 32-Bank Shared Memory Crossbar");
      const splitLane = Math.round((1 - divPct / 100) * 32);
      const cellW = (lw - 32) / 32;

      // Top: Pass 1 (Then-branch) and Pass 2 (Else-branch) SIMT active masks
      for (let t = 0; t < 32; t++) {
        const x = lx + 16 + t * cellW;
        const inThen = t < splitLane;
        ctx.fillStyle = inThen ? C.ok : "rgba(255,255,255,0.08)";
        ctx.fillRect(x + 1, ly + 30, cellW - 2, 18);
        ctx.fillStyle = !inThen ? C.secondary : "rgba(255,255,255,0.08)";
        ctx.fillRect(x + 1, ly + 52, cellW - 2, 18);
      }

      // Bottom: Thread -> Shared Memory Bank (t * stride) % 32 mapping lines
      const yTh = ly + 92, yBk = ly + lh - 26;
      const bankHits = new Array(32).fill(0);
      for (let t = 0; t < 32; t++) {
        const b = (t * stride) % 32;
        bankHits[b]++;
      }
      const maxWay = Math.max(...bankHits);
      for (let t = 0; t < 32; t++) {
        const b = (t * stride) % 32;
        const tx = lx + 16 + (t + 0.5) * cellW;
        const bx = lx + 16 + (b + 0.5) * cellW;
        ctx.strokeStyle = bankHits[b] > 1 ? "rgba(255,107,107,0.45)" : "rgba(124,156,255,0.45)";
        ctx.beginPath(); ctx.moveTo(tx, yTh); ctx.lineTo(bx, yBk); ctx.stroke();
      }
      for (let b = 0; b < 32; b++) {
        const bx = lx + 16 + b * cellW;
        ctx.fillStyle = bankHits[b] > 1 ? C.danger : C.primary;
        ctx.fillRect(bx + 1, yBk, cellW - 2, 14);
      }

      const smOcc = clamp(Math.floor(65536 / (regs * 32)) / 64 * 100, 12.5, 100);
      return {
        "SIMT Warp Efficiency": `${(splitLane > 0 && splitLane < 32 ? 50 + Math.abs(splitLane - 16) * 1.5 : 100).toFixed(0)}%`,
        "Bank Conflict Degree": `${maxWay}-Way (${maxWay === 1 ? "Conflict-Free" : "Serialized"})`,
        "Access Stride s": `${stride} words (4B)`,
        "SM Warp Occupancy": `${smOcc.toFixed(1)}%`,
      };
    },

    sys_tensor_core_mma(ctx, W, H, st) {
      st.drawHUD("GPU Tensor Core m16n8k16 Matrix Multiply-Accumulate (D = A·B + C) & Async TMA Double Buffer", st.spec.formula);
      const C = st.COLORS;
      const stages = Math.round(2 + st.a * 4);
      const mathUtil = 0.3 + st.b * 0.68;
      const swizzle = st.c > 0.4;

      // Left: Systolic / Warp-Level Matrix Fragments D (16x8) = A (16x16) * B (16x8) + C
      const lx = 18, ly = 46, lw = W * 0.56, lh = H - 60;
      st.panel(lx, ly, lw, lh, "m16n8k16 Tensor Core MMA Tile Pipeline");
      const drawGrid = (x0, y0, rows, cols, cell, col, label) => {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const pulse = Math.sin(st.t * 5 + r * 0.5 + c * 0.5) > 0.2;
            ctx.fillStyle = pulse ? col : "rgba(255,255,255,0.08)";
            ctx.fillRect(x0 + c * cell, y0 + r * cell, cell - 1, cell - 1);
          }
        }
        ctx.fillStyle = C.text;
        ctx.font = "600 10px monospace";
        ctx.fillText(label, x0, y0 - 6);
      };
      drawGrid(lx + 18, ly + 48, 8, 8, 9, C.primary, "A (16×16 FP16)");
      drawGrid(lx + 108, ly + 48, 8, 4, 9, C.accent, "B (16×8)");
      drawGrid(lx + 164, ly + 48, 8, 4, 9, C.ok, "D = A·B+C (FP32)");

      // Right: Async TMA Producer/Consumer Circular Shared-Memory Ring
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `TMA Async Shared-Mem Ring (${stages} Stages)`);
      const prodIdx = Math.floor(st.t * 3) % stages;
      const consIdx = (prodIdx + stages - 1) % stages;
      for (let s = 0; s < stages; s++) {
        const sy = ry + 32 + s * ((rh - 44) / stages);
        ctx.fillStyle = s === prodIdx ? "rgba(124,156,255,0.3)" : (s === consIdx ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.06)");
        ctx.strokeStyle = s === prodIdx ? C.primary : (s === consIdx ? C.ok : C.axis);
        ctx.fillRect(rx + 18, sy, rw - 36, 20);
        ctx.strokeRect(rx + 18, sy, rw - 36, 20);
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(`Stage ${s}: ${s === prodIdx ? "TMA Load (Prod)" : (s === consIdx ? "WGMMA (Cons)" : "Ready")}`, rx + 26, sy + 14);
      }

      const tflops = (989 * mathUtil * (swizzle ? 1.0 : 0.76) * (1 - 0.18 / stages)).toFixed(0);
      return {
        "Sustained Tensor Throughput": `${tflops} TFLOP/s`,
        "MMA Instruction Shape": "m16n8k16 (FP16→FP32)",
        "Shared-Mem Layout": swizzle ? "128B XOR Swizzled (0 Conflicts)" : "Linear (Bank Stalls)",
        "Pipeline Depth": `${stages}-Stage Async mbarrier`,
      };
    },

    sys_raft_log_consensus(ctx, W, H, st) {
      st.drawHUD("Raft Consensus: AppendEntries Heartbeats, Quorum CommitIndex & Split-Brain Partition", st.spec.formula);
      const C = st.COLORS;
      const nNodes = Math.round(3 + Math.floor(st.a * 2.9) * 2); // 3, 5, or 7
      const dropPct = st.b * 65;
      const hbMs = 50 + st.c * 250;
      const quorum = Math.floor(nNodes / 2) + 1;

      // Left: Ring of Raft Nodes with Leader Heartbeat Rays
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Raft Cluster (N = ${nNodes}, Quorum = ${quorum})`);
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, rr = Math.min(lw, lh) * 0.32;
      const pts = [];
      for (let i = 0; i < nNodes; i++) {
        const a = (i / nNodes) * Math.PI * 2 - Math.PI * 0.5;
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      // Heartbeats from Leader (Node 0)
      for (let i = 1; i < nNodes; i++) {
        const partitioned = dropPct > 38 && i >= quorum;
        ctx.strokeStyle = partitioned ? C.danger : C.ok;
        ctx.setLineDash(partitioned ? [4, 4] : []);
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
      }
      ctx.setLineDash([]);
      pts.forEach(([px, py], i) => {
        ctx.fillStyle = i === 0 ? C.accent : (dropPct > 38 && i >= quorum ? C.danger : C.primary);
        ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0f1222";
        ctx.font = "bold 10px monospace";
        ctx.fillText(i === 0 ? "LDR" : `F${i}`, px - 10, py + 3);
      });

      // Right: Replicated Log Slots across Nodes showing CommitIndex watermark
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Replicated State Machine Log & CommitIndex");
      const commitSlot = 5;
      for (let i = 0; i < Math.min(5, nNodes); i++) {
        const y = ry + 32 + i * 26;
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(i === 0 ? "L0" : `F${i}`, rx + 10, y + 13);
        const maxSlot = i === 0 ? 7 : (dropPct > 38 && i >= quorum ? 3 : 6);
        for (let s = 0; s < maxSlot; s++) {
          const sx = rx + 34 + s * 22;
          ctx.fillStyle = s <= commitSlot ? C.ok : C.accent;
          ctx.fillRect(sx, y, 19, 18);
        }
      }

      return {
        "Current Term": `Term ${14 + Math.floor(dropPct / 20)}`,
        "Majority Quorum": `${quorum} / ${nNodes} nodes`,
        "CommitIndex Status": dropPct < 55 ? "Advancing (Quorum Intact)" : "Stalled (No Majority)",
        "Heartbeat Interval": `${hbMs.toFixed(0)} ms`,
      };
    },

    sys_lsm_tree_compaction(ctx, W, H, st) {
      st.drawHUD("RocksDB LSM-Tree MemTable → L0 → L1 → L2 → L3 Leveled Compaction & Bloom Filter", st.spec.formula);
      const C = st.COLORS;
      const multT = Math.round(4 + st.a * 12);
      const bloomBits = Math.round(2 + st.b * 12);
      const wrPct = 10 + st.c * 85;
      const fpr = Math.pow(0.6185, bloomBits) * 100;

      // Left: LSM-Tree Pyramid (MemTable in RAM -> L0 -> L1 -> L2 -> L3 SSTables on SSD)
      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      st.panel(lx, ly, lw, lh, `LSM-Tree SSTable Hierarchy (Multiplier T = ${multT}×)`);
      const levels = [
        { name: "MemTable (RAM SkipList)", w: 0.30, col: C.accent },
        { name: "L0 (Overlapping SSTs)",   w: 0.44, col: C.secondary },
        { name: "L1 (Key-Partitioned)",    w: 0.62, col: C.primary },
        { name: "L2 (Sorted Runs)",        w: 0.78, col: C.primary },
        { name: "L3 (Cold Bulk Data)",     w: 0.94, col: C.ok },
      ];
      levels.forEach((lv, i) => {
        const y = ly + 30 + i * 28;
        const bw = (lw - 32) * lv.w;
        const bx = lx + (lw - bw) * 0.5;
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.strokeStyle = lv.col;
        ctx.lineWidth = 1.8;
        ctx.fillRect(bx, y, bw, 20);
        ctx.strokeRect(bx, y, bw, 20);
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(lv.name, bx + 8, y + 14);
      });

      // Right: Bloom Filter Bit-Vector & Write/Read/Space Amplification Tradeoff
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `Bloom Filter (${bloomBits} bits/key) & Amplification`);
      const cellW = (rw - 28) / 16;
      for (let b = 0; b < 16; b++) {
        const bitOn = ((b * 7 + bloomBits) % 3) !== 0;
        ctx.fillStyle = bitOn ? C.ok : "rgba(255,255,255,0.08)";
        ctx.fillRect(rx + 14 + b * cellW, ry + 34, cellW - 2, 22);
      }
      // Write Amp / Read Amp / Space Amp bars
      const amps = [
        { label: "Write Amp (WA)", val: multT * 1.8, max: 35, col: C.secondary },
        { label: "Read Amp (RA)",  val: 1 + fpr * 0.25, max: 8, col: C.primary },
        { label: "Space Amp (SA)", val: 1.11, max: 3, col: C.ok },
      ];
      amps.forEach((a, i) => {
        const y = ry + 82 + i * 28;
        ctx.fillStyle = C.muted;
        ctx.fillText(`${a.label}: ${a.val.toFixed(2)}×`, rx + 14, y - 4);
        ctx.fillStyle = a.col;
        ctx.fillRect(rx + 14, y, clamp(a.val / a.max, 0.08, 1) * (rw - 28), 10);
      });

      return {
        "Bloom Filter FPR": `${fpr.toFixed(2)}%`,
        "Write Amplification": `${(multT * 1.8).toFixed(1)}×`,
        "Point-Lookup Read Amp": `${(1 + fpr * 0.15).toFixed(2)} IOs`,
        "Workload Profile": `${wrPct.toFixed(0)}% Writes`,
      };
    },

    sys_btree_mvcc_wal(ctx, W, H, st) {
      st.drawHUD("B+Tree Page Split, ARIES Write-Ahead Log (PageLSN ≤ FlushedLSN) & MVCC Tuple Chain", st.spec.formula);
      const C = st.COLORS;
      const fanout = Math.round(4 + st.a * 12);
      const longTx = st.b;
      const ckpt = 0.2 + st.c * 0.8;

      // Left: B+Tree Root -> Internal -> Doubly-Linked Leaf Pages
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, `B+Tree Index (Fanout B = ${fanout}) & Doubly-Linked Leaves`);
      const rcx = lx + lw * 0.5;
      ctx.strokeStyle = C.primary;
      ctx.strokeRect(rcx - 36, ly + 28, 72, 22);
      ctx.fillStyle = C.text;
      ctx.font = "10px monospace";
      ctx.fillText("[ 40 | 80 ]", rcx - 30, ly + 43);

      [-72, 0, 72].forEach((dx, i) => {
        const lxBox = rcx + dx - 30, lyBox = ly + 92;
        drawArrow(ctx, rcx + dx * 0.35, ly + 50, lxBox + 30, lyBox, C.axis, 1.4);
        ctx.strokeStyle = i === 1 ? C.accent : C.ok;
        ctx.strokeRect(lxBox, lyBox, 60, 26);
        ctx.fillText(`Leaf ${i}`, lxBox + 10, lyBox + 16);
      });

      // Right: ARIES WAL Stream & MVCC Tuple Version Chain (xmin, xmax)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "ARIES Write-Ahead Log & MVCC Version Chain");
      const lsnBase = 1040 + Math.floor(st.t * 4);
      for (let i = 0; i < 3; i++) {
        const y = ry + 34 + i * 28;
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.strokeStyle = i === 0 ? C.ok : C.secondary;
        ctx.fillRect(rx + 14, y, rw - 28, 22);
        ctx.strokeRect(rx + 14, y, rw - 28, 22);
        ctx.fillStyle = C.text;
        ctx.fillText(`Tuple v${3 - i}: xmin=${90 + i * 5} xmax=${i === 0 ? "∞" : 95 + i * 5}`, rx + 20, y + 15);
      }
      ctx.fillStyle = C.accent;
      ctx.fillText(`WAL FlushedLSN: ${lsnBase} ≥ Dirty PageLSN: ${lsnBase - 2}`, rx + 14, ry + rh - 14);

      return {
        "WAL Rule": "Steal / No-Force (ARIES)",
        "Flushed LSN": `LSN #${lsnBase}`,
        "Dead Tuple Bloat": `${(longTx * 48).toFixed(0)}% (Vacuum Needed)`,
        "Recovery Window": `${((1 - ckpt * 0.7) * 120).toFixed(0)} ms Redo`,
      };
    },

    sys_tcp_bbr_congestion(ctx, W, H, st) {
      st.drawHUD("Compare TCP BBR (BtlBw × RTprop Operating Point) vs Loss-Based CUBIC Sawtooth", st.spec.formula);
      const C = st.COLORS;
      const bwMbps = 50 + st.a * 950;
      const rttMs = 10 + st.b * 140;
      const bufBdp = 0.5 + st.c * 3.5;
      const bdpKb = (bwMbps * rttMs) / 8;

      // Top: cwnd(t) Time-Series comparing BBR (Green steady pacing) vs CUBIC (Pink sawtooth)
      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Congestion Window cwnd(t): BBR Model-Based Pacing vs CUBIC Bufferbloat Sawtooth");
      const gx0 = lx + 28, gx1 = lx + lw - 20, gy0 = ly + lh * 0.62, gy1 = ly + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      // CUBIC sawtooth
      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const u = i / 140;
        const phase = ((u * 3.5 + st.t * 0.25) % 1) - 0.5;
        const cubic = 0.35 + (0.58 * (phase * phase * phase * 4 + 0.5));
        const px = gx0 + u * (gx1 - gx0);
        const py = gy0 - cubic * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // BBR flat optimal BDP line with periodic ProbeRTT dip
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const u = i / 140;
        const probeDip = ((u * 4 + st.t * 0.2) % 1) > 0.92 ? 0.28 : 0.62;
        const px = gx0 + u * (gx1 - gx0);
        const py = gy0 - probeDip * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Bottom: Kleinrock Bandwidth-Delay Pipe Diagram
      const pipeY = gy0 + 22;
      ctx.strokeStyle = C.primary;
      ctx.strokeRect(gx0, pipeY, (gx1 - gx0) * 0.68, 26);
      ctx.fillStyle = "rgba(110,231,183,0.3)";
      ctx.fillRect(gx0 + 2, pipeY + 2, (gx1 - gx0) * 0.68 - 4, 22);
      // Router buffer queue
      ctx.strokeStyle = C.danger;
      ctx.strokeRect(gx0 + (gx1 - gx0) * 0.70, pipeY - 8, (gx1 - gx0) * 0.28, 34);
      ctx.fillStyle = C.text;
      ctx.font = "10px monospace";
      ctx.fillText(`In-Flight Pipe BDP = ${bdpKb.toFixed(0)} KB`, gx0 + 10, pipeY + 17);
      ctx.fillText(`Router Queue (${bufBdp.toFixed(1)}×BDP)`, gx0 + (gx1 - gx0) * 0.72, pipeY + 14);

      return {
        "Bandwidth-Delay Product": `${bdpKb.toFixed(0)} KB`,
        "BBR Operating Point": `${rttMs.toFixed(0)} ms (Zero Queue)`,
        "CUBIC Queue Delay": `${(rttMs * (1 + bufBdp * 0.85)).toFixed(0)} ms (Bufferbloat)`,
        "Bottleneck BtlBw": `${bwMbps.toFixed(0)} Mbps`,
      };
    },

    sys_rdma_roce_allreduce(ctx, W, H, st) {
      st.drawHUD("RDMA / NVLink Ring All-Reduce (Scatter-Reduce + All-Gather) vs Halving-Doubling Tree", st.spec.formula);
      const C = st.COLORS;
      const nGpus = Math.max(4, Math.min(16, Math.round(4 + st.a * 12)));
      const mb = 16 + st.b * 496;
      const bwGbps = 100 + st.c * 700;

      // Left: Ring All-Reduce GPU Topology with circulating tensor chunks
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Ring All-Reduce Topology (${nGpus} GPU Ranks)`);
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, rr = Math.min(lw, lh) * 0.32;
      for (let i = 0; i < nGpus; i++) {
        const a1 = (i / nGpus) * Math.PI * 2;
        const a2 = ((i + 1) / nGpus) * Math.PI * 2;
        const x1 = cx + Math.cos(a1) * rr, y1 = cy + Math.sin(a1) * rr;
        const x2 = cx + Math.cos(a2) * rr, y2 = cy + Math.sin(a2) * rr;
        drawArrow(ctx, x1, y1, x2, y2, C.primary, 1.5);
        const u = (st.t * 2.2) % 1;
        ctx.fillStyle = C.accent;
        ctx.beginPath(); ctx.arc(lerp(x1, x2, u), lerp(y1, y2, u), 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.ok;
        ctx.beginPath(); ctx.arc(x1, y1, 9, 0, Math.PI * 2); ctx.fill();
      }

      // Right: Latency Breakdown (Ring Bandwidth-Optimal vs Tree Latency-Optimal)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Collective Completion Time: Ring vs Tree");
      const tRingMs = (2 * (nGpus - 1) / nGpus) * (mb * 8 / bwGbps) + nGpus * 0.015;
      const tTreeMs = (2 * Math.log2(nGpus)) * (mb * 8 / (bwGbps * 0.75)) + Math.log2(nGpus) * 0.015;
      const maxT = Math.max(tRingMs, tTreeMs, 1);

      [
        { name: "Ring All-Reduce (2(N-1)/N)", val: tRingMs, col: C.ok },
        { name: "Tree All-Reduce (2 log₂N)",  val: tTreeMs, col: C.primary },
      ].forEach((b, i) => {
        const y = ry + 48 + i * 48;
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(`${b.name}: ${b.val.toFixed(2)} ms`, rx + 14, y - 6);
        ctx.fillStyle = b.col;
        ctx.fillRect(rx + 14, y, (b.val / maxT) * (rw - 28), 16);
      });

      const algBw = (mb / (tRingMs / 1000) / 1000).toFixed(1);
      return {
        "Ring All-Reduce Time": `${tRingMs.toFixed(2)} ms`,
        "Tree All-Reduce Time": `${tTreeMs.toFixed(2)} ms`,
        "AlgBw Efficiency": `${algBw} GB/s`,
        "Optimal Topology": tRingMs < tTreeMs ? "Ring (Bandwidth-Bound)" : "Tree (Latency-Bound)",
      };
    },

    sys_garbage_collector_tri(ctx, W, H, st) {
      st.drawHUD("Tri-Color Mark-Sweep GC (Black / Grey / White) & Dijkstra/Yuasa Write Barrier", st.spec.formula);
      const C = st.COLORS;
      const allocRate = 20 + st.a * 180;
      const youngPct = 15 + st.b * 55;
      const gcThreads = Math.round(1 + st.c * 7);

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Tri-Color Heap Object Graph & Concurrent Mutator Write Barrier");
      const phase = Math.floor(st.t * 1.6) % 4;
      const objs = [
        { x: 0.14, y: 0.34, state: "B", label: "Root" },
        { x: 0.34, y: 0.26, state: "B", label: "ObjA" },
        { x: 0.34, y: 0.64, state: phase >= 1 ? "B" : "G", label: "ObjB" },
        { x: 0.58, y: 0.28, state: phase >= 2 ? "B" : "G", label: "ObjC" },
        { x: 0.58, y: 0.66, state: "G", label: "ObjD (Grey)" },
        { x: 0.82, y: 0.32, state: phase >= 2 ? "G" : "W", label: "ObjE (Barrier)" },
        { x: 0.82, y: 0.70, state: "W", label: "Dead (White)" },
      ];
      const edges = [[0,1],[0,2],[1,3],[2,4],[4,5]];
      edges.forEach(([u, v]) => {
        drawArrow(ctx, lx + objs[u].x * lw, ly + objs[u].y * lh, lx + objs[v].x * lw, ly + objs[v].y * lh, C.axis, 1.5);
      });
      // Mutator write-barrier edge from Black ObjA -> White ObjE shaded Grey
      drawArrow(ctx, lx + objs[1].x * lw, ly + objs[1].y * lh, lx + objs[5].x * lw, ly + objs[5].y * lh, C.accent, 2);

      objs.forEach((o) => {
        const ox = lx + o.x * lw, oy = ly + o.y * lh;
        ctx.fillStyle = o.state === "B" ? "#1e293b" : (o.state === "G" ? C.accent : "#f8fafc");
        ctx.strokeStyle = o.state === "B" ? C.ok : (o.state === "G" ? C.secondary : C.danger);
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(ox, oy, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = o.state === "W" ? "#0f1222" : C.text;
        ctx.font = "bold 9px monospace";
        ctx.fillText(o.state, ox - 4, oy + 3);
      });

      const pauseUs = (450 / gcThreads * (1 - youngPct / 120)).toFixed(0);
      return {
        "Tri-Color Invariant": "No Black → White Pointers",
        "Write Barrier": "Dijkstra Shade-Target Grey",
        "STW Root Pause": `${pauseUs} µs (${gcThreads} GC threads)`,
        "Allocation Rate": `${allocRate.toFixed(0)} MB/s`,
      };
    },

    sys_ebpf_verifier_jit(ctx, W, H, st) {
      st.drawHUD("Linux eBPF Abstract Interpretation Verifier (Register Scalar Bounds) & XDP Ring Drop", st.spec.formula);
      const C = st.COLORS;
      const insns = Math.round(32 + st.a * 960);
      const mpps = 2 + st.b * 22;
      const lookups = Math.round(1 + st.c * 5);

      // Left: eBPF Verifier Abstract Register State Tracking
      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      st.panel(lx, ly, lw, lh, "eBPF Verifier Abstract Register Bounds & Pointer Safety");
      const trace = [
        "0: r1 = *(u32 *)(r1 + 0)      ; R1=pkt_ptr(off=0,r=64)",
        "1: r2 = r1 + 14               ; R2=pkt_ptr(off=14,r=64)",
        "2: if r2 > pkt_end goto +4    ; Branch narrows R2 <= pkt_end",
        "3: r3 = *(u8 *)(r1 + 9)       ; SAFE: 10 <= 14 <= 64",
        "4: r0 = XDP_DROP (1)          ; R0=umin=1,umax=1",
        "5: exit                       ; Verifier: SAFE (0 loops)",
      ];
      ctx.font = "10px monospace";
      trace.forEach((line, i) => {
        const y = ly + 34 + i * 22;
        ctx.fillStyle = i === 3 ? "rgba(110,231,183,0.16)" : "rgba(255,255,255,0.04)";
        ctx.fillRect(lx + 10, y - 13, lw - 20, 18);
        ctx.fillStyle = i === 3 ? C.ok : C.text;
        ctx.fillText(line, lx + 14, y);
      });

      // Right: XDP NIC RX Ring Driver-Level Drop vs sk_buff Kernel Stack
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "XDP Driver RX Ring vs Linux sk_buff Path");
      const xdpDropRate = Math.min(mpps, 24 / (1 + lookups * 0.18));
      ctx.fillStyle = C.ok;
      ctx.fillRect(rx + 18, ry + 42, (rw - 36) * 0.85, 22);
      ctx.fillStyle = "#0f1222";
      ctx.fillText(`XDP_DROP (Zero sk_buff): ${xdpDropRate.toFixed(1)} Mpps`, rx + 24, ry + 57);

      ctx.fillStyle = C.secondary;
      ctx.fillRect(rx + 18, ry + 86, (rw - 36) * 0.22, 22);
      ctx.fillStyle = C.text;
      ctx.fillText("iptables / sk_buff: 4.2 Mpps", rx + 24, ry + 101);

      return {
        "Verifier Complexity": `${insns * 3} states explored`,
        "XDP Line-Rate": `${xdpDropRate.toFixed(1)} Mpps`,
        "BPF Map Lookups": `${lookups} per packet`,
        "x86-64 JIT Status": "Verified & JIT-Compiled",
      };
    },

    sys_lockfree_cas_aba(ctx, W, H, st) {
      st.drawHUD("Lock-Free Treiber Stack Atomic CAS(&head, old, new), ABA Bug & Tagged Hazard Pointers", st.spec.formula);
      const C = st.COLORS;
      const threads = Math.round(2 + st.a * 14);
      const backoff = Math.round(st.b * 200);
      const guardOn = st.c > 0.35;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Treiber Lock-Free Linked Stack & Concurrent CAS Contention");
      // Draw Top-of-Stack Head Pointer + Nodes A -> B -> C
      const nodes = ["Node A (0x7f10)", "Node B (0x7f40)", "Node C (0x7f80)"];
      nodes.forEach((n, i) => {
        const bx = lx + 180 + i * 135, by = ly + 42;
        ctx.strokeStyle = i === 0 ? C.ok : C.primary;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, 108, 36);
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(n, bx + 8, by + 22);
        if (i < 2) drawArrow(ctx, bx + 108, by + 18, bx + 135, by + 18, C.axis, 1.6);
      });
      // Atomic 128-bit Tagged Head Box
      ctx.strokeStyle = C.accent;
      ctx.strokeRect(lx + 20, ly + 42, 130, 36);
      ctx.fillStyle = C.accent;
      ctx.fillText(guardOn ? "head: [tag:42|0x7f10]" : "head: [0x7f10 (ABA!)]", lx + 26, ly + 64);
      drawArrow(ctx, lx + 150, ly + 60, lx + 180, ly + 60, C.accent, 2);

      // Competing threads attempting CAS(&head, expected, new)
      const winner = Math.floor(st.t * 2.5) % Math.min(4, threads);
      for (let t = 0; t < Math.min(4, threads); t++) {
        const ty = ly + 104 + t * 22;
        const ok = t === winner;
        ctx.fillStyle = ok ? C.ok : C.secondary;
        ctx.fillText(`T${t}: CAS(&head, A, new) → ${ok ? "SUCCESS (Commit)" : "FAIL (Retry + Backoff)"}`, lx + 24, ty);
      }

      const retryRate = clamp((threads - 1) * 7.5 * (1 - backoff / 350), 2, 88);
      return {
        "CAS Contention Retries": `${retryRate.toFixed(1)}%`,
        "ABA Safety Mechanism": guardOn ? "16-bit Tag + Hazard Ptrs" : "VULNERABLE to ABA!",
        "Contending Threads": `${threads} hardware threads`,
        "Progress Guarantee": "Lock-Free (System-Wide)",
      };
    },

    sys_jemalloc_slab_arena(ctx, W, H, st) {
      st.drawHUD("jemalloc Per-Thread Arena Size-Class Slabs, Bitmap Occupancy & Fragmentation", st.spec.formula);
      const C = st.COLORS;
      const sizeVar = st.a;
      const arenas = Math.round(1 + st.b * 15);
      const decayMs = Math.round(500 + st.c * 9500);

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, `jemalloc Slab Runs (${arenas} Thread Arenas, Dirty Decay = ${decayMs} ms)`);
      const classes = [
        { sz: "16 B Slab", cols: 24, fill: 0.88 },
        { sz: "64 B Slab", cols: 16, fill: 0.72 },
        { sz: "256 B Slab", cols: 10, fill: 0.58 },
        { sz: "4096 B Page", cols: 6, fill: 0.78 },
      ];
      classes.forEach((cls, r) => {
        const y = ly + 32 + r * 34;
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(cls.sz, lx + 14, y + 15);
        const startX = lx + 98, availW = lw - 114;
        const cw = availW / cls.cols;
        for (let c = 0; c < cls.cols; c++) {
          const used = ((c * 11 + r * 5 + Math.floor(st.t * 2)) % 10) / 10 < (cls.fill - sizeVar * 0.25);
          ctx.fillStyle = used ? C.primary : (c % 3 === 0 ? "rgba(255,107,107,0.35)" : "rgba(255,255,255,0.07)");
          ctx.fillRect(startX + c * cw + 1, y, cw - 2, 22);
        }
      });

      const intFrag = (6.5 + sizeVar * 11.2).toFixed(1);
      const extFrag = (4.0 + sizeVar * 18.5 * (3000 / (decayMs + 1500))).toFixed(1);
      return {
        "Internal Fragmentation": `${intFrag}%`,
        "External Fragmentation": `${extFrag}%`,
        "Thread-Local Cache": `tcache + ${arenas} Arenas`,
        "madvise(MADV_FREE)": `${decayMs} ms decay window`,
      };
    },

    sys_erasure_reed_solomon(ctx, W, H, st) {
      st.drawHUD("Reed–Solomon RS(k, m) Vandermonde Galois GF(2⁸) Coding & Disk Failure Reconstruction", st.spec.formula);
      const C = st.COLORS;
      const kData = Math.round(4 + st.a * 8);
      const mParity = Math.round(2 + st.b * 4);
      const afr = 0.5 + st.c * 7.5;
      const total = kData + mParity;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Reed–Solomon Stripe RS(${kData}, ${mParity}) over GF(2⁸) — Tolerates any ${mParity} Disk Losses`);
      const sw = (lw - 32) / total;
      const failedCount = Math.min(mParity, Math.max(1, Math.round(afr / 3)));

      for (let i = 0; i < total; i++) {
        const x = lx + 16 + i * sw;
        const isData = i < kData;
        const isFailed = i === 1 || (failedCount >= 2 && i === kData);
        ctx.fillStyle = isFailed ? "rgba(255,107,107,0.28)" : (isData ? "rgba(124,156,255,0.2)" : "rgba(110,231,183,0.2)");
        ctx.strokeStyle = isFailed ? C.danger : (isData ? C.primary : C.ok);
        ctx.lineWidth = 1.8;
        ctx.fillRect(x + 2, ly + 34, sw - 4, 62);
        ctx.strokeRect(x + 2, ly + 34, sw - 4, 62);
        ctx.fillStyle = C.text;
        ctx.font = "600 9px monospace";
        ctx.fillText(isFailed ? "LOST" : (isData ? `D${i}` : `P${i - kData}`), x + 5, ly + 68);
      }

      // Linear Matrix Inversion Reconstruction Banner
      ctx.strokeStyle = C.accent;
      ctx.strokeRect(lx + 18, ly + 114, lw - 36, 36);
      ctx.fillStyle = C.accent;
      ctx.font = "10px monospace";
      ctx.fillText(`GF(2⁸) Cauchy/Vandermonde Decode: D_lost = G_sub⁻¹ · [Surviving ${kData} Shards] → HEALTHY`, lx + 28, ly + 136);

      const overhead = ((total / kData) * 100).toFixed(0);
      const nines = Math.min(15, Math.round(6 + mParity * 2.4 - afr * 0.4));
      return {
        "Storage Footprint": `${(total / kData).toFixed(2)}× (${overhead}% vs 300% 3x-Rep)`,
        "Fault Tolerance": `Up to ${mParity} Simultaneous Disks`,
        "Durability Rating": `${nines} Nines (99.9999999%)`,
        "Rebuild Read Cost": `${kData}× Stripe Bandwidth`,
      };
    },

    sys_chandy_lamport_clock(ctx, W, H, st) {
      st.drawHUD("Lamport Vector Clocks [v₁, v₂, v₃] & Chandy–Lamport Consistent Cut Marker Snapshot", st.spec.formula);
      const C = st.COLORS;
      const nProc = 3;
      const msgRate = 1 + st.b * 4;
      const skew = st.c;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Space–Time Lamport Diagram, Vector Clocks & Chandy–Lamport Cut Frontier");
      const ys = [ly + 44, ly + 94, ly + 144];
      const x0 = lx + 64, x1 = lx + lw - 24;
      const cutX = x0 + (x1 - x0) * (0.48 + 0.15 * Math.sin(st.t * 1.2));

      // Process timelines
      ys.forEach((y, i) => {
        ctx.strokeStyle = C.axis;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
        ctx.fillStyle = C.text;
        ctx.font = "600 11px monospace";
        ctx.fillText(`P${i + 1}`, lx + 20, y + 4);
      });

      // Causal message arrows + Vector Clock labels
      const events = [
        { p: 0, u: 0.18, vc: "[1,0,0]" },
        { p: 1, u: 0.34, vc: "[1,1,0]" },
        { p: 2, u: 0.56, vc: "[1,1,1]" },
        { p: 0, u: 0.78, vc: "[2,1,1]" },
      ];
      drawArrow(ctx, x0 + 0.18 * (x1 - x0), ys[0], x0 + 0.34 * (x1 - x0), ys[1], C.primary, 1.8);
      drawArrow(ctx, x0 + 0.34 * (x1 - x0), ys[1], x0 + 0.56 * (x1 - x0), ys[2], C.ok, 1.8);
      drawArrow(ctx, x0 + 0.56 * (x1 - x0), ys[2], x0 + 0.78 * (x1 - x0), ys[0], C.secondary, 1.8);

      events.forEach((ev) => {
        const ex = x0 + ev.u * (x1 - x0), ey = ys[ev.p];
        ctx.fillStyle = C.accent;
        ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.text;
        ctx.font = "9px monospace";
        ctx.fillText(ev.vc, ex - 18, ey - 9);
      });

      // Consistent Cut S-curve
      ctx.strokeStyle = C.danger;
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cutX - 18, ly + 26);
      ctx.bezierCurveTo(cutX + 24, ly + 75, cutX - 24, ly + 115, cutX + 12, ly + lh - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      return {
        "Global Snapshot Cut": "Consistent (No Orphan Rx)",
        "Causal Partial Order": "e₁ → e₂ ⇔ VC(e₁) < VC(e₂)",
        "In-Transit Channel Log": `${Math.round(msgRate)} FIFO Marker Msgs`,
        "Physical Skew Tolerance": `±${(skew * 50).toFixed(1)} ms (Lockless)`,
      };
    },

    // =========================================================================
    // 3. COMPLEX SYSTEMS, NONLINEAR DYNAMICS & STATISTICAL PHYSICS (20 SIMS)
    // =========================================================================

    cx_lorenz_lyapunov(ctx, W, H, st) {
      st.drawHUD("Finite-Time Lyapunov Exponent (FTLE) Divergence Braid & Local Jacobian Spectrum", st.spec.formula);
      const C = st.COLORS;
      const sigma = 6 + st.a * 12;
      const rho = 18 + st.b * 26;
      const beta = 1.5 + st.c * 2.5;
      const lam1 = rho > 24.74 ? (0.906 * Math.sqrt((rho - 24) / 4)) : -0.15;

      // Left: Twin-Trajectory Divergence Braid & Tangent Ellipsoid Stretch
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Twin Trajectory Divergence Braid x(t) vs x'(t) + δ₀");
      const gx0 = lx + 22, gx1 = lx + lw - 18, gyMid = ly + lh * 0.54;
      [0, 1].forEach((tr) => {
        ctx.strokeStyle = tr === 0 ? C.primary : C.secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 110; i++) {
          const u = i / 110;
          const div = tr === 1 ? Math.min(1.0, 0.015 * Math.exp(Math.max(0, lam1) * u * 4.2)) : 0;
          const yVal = Math.sin(u * 16 + st.t * 2 + div * 3.1) * Math.cos(u * 7 - div * 2.4);
          const px = gx0 + u * (gx1 - gx0);
          const py = gyMid + yVal * (lh * 0.34);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Right: Log-Separation ln|δx(t)/δx₀| Slope = λ₁ & Lyapunov Spectrum (λ₁, λ₂, λ₃)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Log Divergence ln|δx(t)| & Spectrum (λ₁, 0, λ₃)");
      const rx0 = rx + 26, rx1 = rx + rw - 18, ry0 = ry + rh - 26, ry1 = ry + 34;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx0, ry0); ctx.lineTo(rx1, ry0); ctx.stroke();

      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const logSep = clamp(u * Math.max(0.05, lam1) * 0.9 + 0.04 * Math.sin(u * 25 + st.t * 3), 0, 0.95);
        const px = rx0 + u * (rx1 - rx0);
        const py = ry0 - logSep * (ry0 - ry1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const sumLam = -(sigma + 1 + beta);
      const dKY = lam1 > 0 ? (2 + lam1 / Math.abs(sumLam - lam1)).toFixed(3) : "1.000";
      return {
        "Max Lyapunov λ₁": `${lam1.toFixed(3)} bits/s`,
        "Kaplan–Yorke Dim D_KY": dKY,
        "Phase Volume ∇·F": `${sumLam.toFixed(2)} (Contractive)`,
        "Predictability Horizon": lam1 > 0 ? `${(1 / lam1 * 11.5).toFixed(1)} τ` : "∞ (Fixed Point)",
      };
    },

    cx_feigenbaum_logistic(ctx, W, H, st) {
      st.drawHUD("Full Feigenbaum Bifurcation Diagram r ∈ [2.8, 4.0] & Cobweb Return Map x_{n+1} = r x_n(1−x_n)", st.spec.formula);
      const C = st.COLORS;
      const rCur = 2.8 + st.a * 1.2;
      const x0 = clamp(0.1 + st.b * 0.8, 0.05, 0.95);

      // Left: Bifurcation Tree Diagram (r in [2.8, 4.0] vs Attractor x*)
      const lx = 18, ly = 46, lw = W * 0.56, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Feigenbaum Period-Doubling Bifurcation Tree (δ ≈ 4.6692)");
      const gx0 = lx + 24, gx1 = lx + lw - 16, gy0 = ly + lh - 22, gy1 = ly + 30;
      ctx.fillStyle = "rgba(124,156,255,0.65)";
      const cols = 120;
      for (let ic = 0; ic <= cols; ic++) {
        const r = 2.8 + (ic / cols) * 1.2;
        let x = 0.5;
        for (let k = 0; k < 42; k++) x = r * x * (1 - x);
        const px = gx0 + (ic / cols) * (gx1 - gx0);
        for (let k = 0; k < 16; k++) {
          x = r * x * (1 - x);
          const py = gy0 - x * (gy0 - gy1);
          ctx.fillRect(px, py, 1.6, 1.6);
        }
      }
      // Cursor line at rCur
      const rPx = gx0 + ((rCur - 2.8) / 1.2) * (gx1 - gx0);
      ctx.strokeStyle = C.accent;
      ctx.beginPath(); ctx.moveTo(rPx, gy1); ctx.lineTo(rPx, gy0); ctx.stroke();

      // Right: Cobweb Return Map x_{n+1} = r x_n (1 - x_n)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `Cobweb Return Map at r = ${rCur.toFixed(3)}`);
      const rx0 = rx + 20, rx1 = rx + rw - 16, ry0 = ry + rh - 22, ry1 = ry + 30;
      // Diagonal y = x
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx0, ry0); ctx.lineTo(rx1, ry1); ctx.stroke();
      // Parabola
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const u = i / 60;
        const y = rCur * u * (1 - u);
        const px = rx0 + u * (rx1 - rx0), py = ry0 - y * (ry0 - ry1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Cobweb staircase
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      let xc = x0;
      ctx.moveTo(rx0 + xc * (rx1 - rx0), ry0);
      for (let s = 0; s < 18; s++) {
        const xn = rCur * xc * (1 - xc);
        ctx.lineTo(rx0 + xc * (rx1 - rx0), ry0 - xn * (ry0 - ry1));
        ctx.lineTo(rx0 + xn * (rx1 - rx0), ry0 - xn * (ry0 - ry1));
        xc = xn;
      }
      ctx.stroke();

      const regime = rCur < 3.0 ? "Period-1 Fixed Point" : (rCur < 3.449 ? "Period-2 Cycle" : (rCur < 3.5699 ? "Period-2^k Cascade" : "Chaotic Band + Islands"));
      return {
        "Growth Parameter r": rCur.toFixed(4),
        "Attractor Regime": regime,
        "Feigenbaum Constant δ": "4.6692016...",
        "Accumulation Point r_∞": "3.5699456...",
      };
    },

    cx_kuramoto_sync(ctx, W, H, st) {
      st.drawHUD("Kuramoto Coupled Phase Oscillators on Unit Circle & Order Parameter Vector r·e^{iψ}", st.spec.formula);
      const C = st.COLORS;
      const K = st.a * 5.0;
      const spread = 0.2 + st.b * 1.8;
      const alphaLag = st.c * 1.2;
      const Kc = 2 * spread;

      // Left: Unit Circle with N Phase Oscillators & Centroid Order-Parameter Vector r*e^{i*psi}
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Unit Circle Phase Ring & Order Vector r·e^{iψ}");
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, rr = Math.min(lw, lh) * 0.33;
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();

      const rSync = K <= Kc ? 0.12 : Math.sqrt(1 - Kc / K) * Math.cos(alphaLag * 0.4);
      const meanPsi = st.t * 1.8;
      let sumX = 0, sumY = 0;
      const N = 24;
      for (let i = 0; i < N; i++) {
        const natOff = ((i / N) - 0.5) * Math.PI * 2 * (1 - rSync * 0.88);
        const th = meanPsi + natOff + 0.15 * Math.sin(st.t * (1 + i * 0.1));
        sumX += Math.cos(th); sumY += Math.sin(th);
        const ox = cx + Math.cos(th) * rr, oy = cy + Math.sin(th) * rr;
        ctx.fillStyle = C.series[i % C.series.length];
        ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI * 2); ctx.fill();
      }
      const rxVec = sumX / N, ryVec = sumY / N;
      const rMag = Math.hypot(rxVec, ryVec);
      drawArrow(ctx, cx, cy, cx + rxVec * rr, cy + ryVec * rr, C.accent, 2.8);

      // Right: Synchronization Bifurcation Curve r(K) vs Critical Coupling K_c
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Macroscopic Coherence Curve r(K) vs K_c");
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const kVal = (i / 100) * 5.0;
        const rTheory = kVal <= Kc ? 0.06 : Math.sqrt(1 - Kc / kVal);
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - rTheory * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curPx = gx0 + (K / 5.0) * (gx1 - gx0);
      const curPy = gy0 - rMag * (gy0 - gy1);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(curPx, curPy, 6, 0, Math.PI * 2); ctx.fill();

      return {
        "Order Parameter r": rMag.toFixed(3),
        "Coupling K vs K_c": `${K.toFixed(2)} (K_c = ${Kc.toFixed(2)})`,
        "Phase State": K > Kc ? "Phase-Locked Synchrony" : "Incoherent Drift",
        "Sakaguchi Lag α": `${alphaLag.toFixed(2)} rad`,
      };
    },

    cx_ising_onsager_rg(ctx, W, H, st) {
      st.drawHUD("Kadanoff Block-Spin Renormalization Group Decimation: L×L → (L/2)×(L/2) → (L/4)×(L/4)", st.spec.formula);
      const C = st.COLORS;
      const tRed = 0.4 + st.a * 1.8; // T / T_c
      const hExt = (st.b - 0.5) * 1.0;
      const mag = tRed < 1.0 ? Math.pow(1 - Math.pow(tRed, 4), 0.125) : Math.tanh(hExt * 2);

      // Three side-by-side Kadanoff Coarse-Graining Lattices (16x16 -> 8x8 -> 4x4)
      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Kadanoff Block-Spin Majority-Rule Coarse-Graining Across Scales (b = 1, 2, 4)");
      const scales = [
        { N: 16, label: "Fine Lattice L×L (b=1)" },
        { N: 8,  label: "Block-Spin (L/2)×(L/2) (b=2)" },
        { N: 4,  label: "Coarse RG (L/4)×(L/4) (b=4)" },
      ];
      const boxSz = Math.min((lw - 84) / 3, lh - 54);
      scales.forEach((sc, idx) => {
        const x0 = lx + 18 + idx * (boxSz + 26), y0 = ly + 34;
        const cw = boxSz / sc.N;
        for (let r = 0; r < sc.N; r++) {
          for (let c = 0; c < sc.N; c++) {
            const corr = Math.sin(r * (2 / sc.N) * Math.PI + st.t) * Math.cos(c * (2 / sc.N) * Math.PI);
            const up = (corr * (1.3 - tRed * 0.6) + mag * 0.7 + hExt) > 0;
            ctx.fillStyle = up ? C.primary : C.secondary;
            ctx.fillRect(x0 + c * cw, y0 + r * cw, cw - 0.8, cw - 0.8);
          }
        }
        ctx.fillStyle = C.text;
        ctx.font = "600 10px system-ui, sans-serif";
        ctx.fillText(sc.label, x0, y0 + boxSz + 15);
        if (idx < 2) {
          drawArrow(ctx, x0 + boxSz + 4, y0 + boxSz * 0.5, x0 + boxSz + 22, y0 + boxSz * 0.5, C.accent, 2);
        }
      });

      return {
        "Reduced Temp T / T_c": `${tRed.toFixed(2)} (T_c = 2.269 J/k_B)`,
        "Spontaneous |M(T)|": Math.abs(mag).toFixed(3),
        "RG Fixed Point": Math.abs(tRed - 1.0) < 0.12 ? "Critical Scale-Invariant (T = T_c)" : (tRed < 1 ? "Ordered Ferromagnet (T → 0)" : "Paramagnet (T → ∞)"),
        "Onsager Exponent β": "1/8 = 0.125",
      };
    },

    cx_percolation_giant(ctx, W, H, st) {
      st.drawHUD("Sweep occupation probability p across p_c ≈ 0.5927 to ignite the Gold Giant Spanning Cluster", st.spec.formula);
      const C = st.COLORS;
      const pOcc = 0.25 + st.a * 0.65;
      const pc = 0.5927;
      const spans = pOcc >= pc;

      // Left: 2D Site Percolation Lattice with Flood-Filled Giant Spanning Cluster in Gold
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, `2D Site Percolation Grid (p = ${pOcc.toFixed(3)}, p_c = 0.5927)`);
      const N = 18;
      const cw = Math.min(lw - 28, lh - 38) / N;
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const pseudo = (((r * 37 + c * 73 + 19) % 97) / 97);
          const occ = pseudo < pOcc;
          const inGiant = occ && spans && (Math.abs(c - N * 0.5 - 3 * Math.sin(r * 0.45)) < N * (pOcc - 0.32));
          ctx.fillStyle = !occ ? "rgba(255,255,255,0.05)" : (inGiant ? C.accent : C.primary);
          ctx.fillRect(lx + 16 + c * cw, ly + 28 + r * cw, cw - 1, cw - 1);
        }
      }

      // Right: Percolation Order Parameter P_inf(p) & Diverging Correlation Length xi(p)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Giant Cluster Fraction P_∞(p) & Correlation ξ(p)");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const p = 0.25 + (i / 100) * 0.65;
        const pInf = p < pc ? 0 : Math.pow((p - pc) / (1 - pc), 0.1389);
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - pInf * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const pInfCur = spans ? Math.pow((pOcc - pc) / (1 - pc), 0.1389) : 0;
      return {
        "Occupation Prob p": pOcc.toFixed(3),
        "Spanning Percolation": spans ? "YES (Top-to-Bottom Giant Cluster)" : "NO (Isolated Islands)",
        "Giant Cluster P_∞(p)": `${(pInfCur * 100).toFixed(1)}%`,
        "Fractal Dimension d_f": "91 / 48 ≈ 1.896",
      };
    },

    cx_barabasi_scale_free(ctx, W, H, st) {
      st.drawHUD("Barabási–Albert Preferential Attachment Hub Network & Power-Law P(k) ∝ k⁻³ under Hub Attack", st.spec.formula);
      const C = st.COLORS;
      const gamma = 2.1 + st.a * 1.4;
      const hubAtk = st.b * 40; // % hubs removed
      const mEdges = Math.round(1 + st.c * 4);

      // Left: Hub-and-Spoke Scale-Free Graph
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Scale-Free Hub Network (Achilles' Heel Hub Attack)");
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      const nodes = [
        { x: cx, y: cy, r: 11, hub: true, ko: hubAtk > 12 },
        { x: cx - 54, y: cy - 28, r: 8, hub: true, ko: hubAtk > 25 },
        { x: cx + 52, y: cy + 24, r: 8, hub: true, ko: false },
      ];
      for (let i = 0; i < 15; i++) {
        const a = (i / 15) * Math.PI * 2;
        const rad = 52 + (i % 2) * 24;
        nodes.push({ x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad, r: 4.2, hub: false, ko: false });
      }
      for (let i = 3; i < nodes.length; i++) {
        const targetHub = i % 3;
        if (!nodes[targetHub].ko) {
          ctx.strokeStyle = "rgba(124,156,255,0.32)";
          ctx.beginPath(); ctx.moveTo(nodes[targetHub].x, nodes[targetHub].y); ctx.lineTo(nodes[i].x, nodes[i].y); ctx.stroke();
        }
      }
      nodes.forEach((nd) => {
        ctx.fillStyle = nd.ko ? C.danger : (nd.hub ? C.accent : C.primary);
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2); ctx.fill();
      });

      // Right: Log-Log Degree Distribution P(k) ~ k^(-gamma)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `Log–Log Degree Tail: log P(k) = −${gamma.toFixed(2)} log k`);
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 34;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(gx0, gy1 + 8);
      ctx.lineTo(gx1 - (hubAtk / 40) * 65, gy0 - 8);
      ctx.stroke();

      return {
        "Power-Law Exponent γ": gamma.toFixed(2),
        "Targeted Hub Removal": `${hubAtk.toFixed(0)}% top hubs`,
        "Giant Component S": `${Math.max(8, 100 - hubAtk * 2.3).toFixed(0)}% connected`,
        "Random Failure Tolerance": "Ultra-Robust (⟨k²⟩ ≫ ⟨k⟩)",
      };
    },

    cx_watts_strogatz(ctx, W, H, st) {
      st.drawHUD("Watts–Strogatz Ring Lattice Rewiring p & Small-World C(p)/C(0) vs L(p)/L(0) Crossover", st.spec.formula);
      const C = st.COLORS;
      const logP = -4 + st.a * 4; // 10^-4 to 10^0
      const pRewire = Math.pow(10, logP);
      const K = Math.round(2 + st.b * 4) * 2;
      const N = 18;

      // Left: Ring Lattice with Long-Range Shortcut Chords
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Watts–Strogatz Ring (p = ${pRewire.toFixed(4)})`);
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, rr = Math.min(lw, lh) * 0.34;
      const pts = [];
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      // Local ring edges + rewired chords
      for (let i = 0; i < N; i++) {
        const j1 = (i + 1) % N, j2 = (i + 2) % N;
        ctx.strokeStyle = "rgba(124,156,255,0.45)";
        ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j1][0], pts[j1][1]); ctx.stroke();
        const isShortcut = ((i * 19 + 7) % 23) / 23 < Math.pow(pRewire, 0.35);
        if (isShortcut) {
          const target = (i + 9) % N;
          ctx.strokeStyle = C.accent;
          ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[target][0], pts[target][1]); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j2][0], pts[j2][1]); ctx.stroke();
        }
      }
      pts.forEach(([px, py]) => {
        ctx.fillStyle = C.ok;
        ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill();
      });

      // Right: Normalized C(p)/C(0) and L(p)/L(0) vs log10(p)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Clustering C(p)/C(0) vs Path Length L(p)/L(0)");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      [0, 1].forEach((curve) => {
        ctx.strokeStyle = curve === 0 ? C.ok : C.secondary;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const lp = -4 + (i / 100) * 4;
          const p = Math.pow(10, lp);
          const val = curve === 0 ? Math.pow(1 - p, 3) : (1 / (1 + p * 85));
          const px = gx0 + (i / 100) * (gx1 - gx0);
          const py = gy0 - val * (gy0 - gy1);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });
      const curX = gx0 + ((logP + 4) / 4) * (gx1 - gx0);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(curX, gy1); ctx.lineTo(curX, gy0); ctx.stroke();
      ctx.setLineDash([]);

      const cNorm = Math.pow(1 - pRewire, 3);
      const lNorm = 1 / (1 + pRewire * 85);
      return {
        "Clustering C(p)/C(0)": cNorm.toFixed(3),
        "Path Length L(p)/L(0)": lNorm.toFixed(3),
        "Small-World Quotient σ": (cNorm / Math.max(0.08, lNorm)).toFixed(2),
        "Topology Regime": (logP > -2.8 && logP < -0.8) ? "Small-World Window!" : (logP <= -2.8 ? "Regular Lattice" : "Random Graph"),
      };
    },

    cx_seir_metapopulation(ctx, W, H, st) {
      st.drawHUD("Metapopulation Mobility Network & Stacked SEIR Epidemic Curves (R₀ = β/γ · λ_max(A))", st.spec.formula);
      const C = st.COLORS;
      const beta = 0.15 + st.a * 0.85;
      const gamma = 0.08 + st.b * 0.45;
      const vaxPct = st.c * 75;
      const r0Eff = (beta / gamma) * 2.4 * (1 - vaxPct / 100);

      // Left: City Metapopulation Nodes + Commuter Flight Arcs
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Metapopulation Mobility Hubs & Contagion Flux");
      const cities = [
        { x: 0.50, y: 0.50, r: 16, name: "Hub0" },
        { x: 0.22, y: 0.30, r: 11, name: "C1" },
        { x: 0.78, y: 0.30, r: 11, name: "C2" },
        { x: 0.24, y: 0.78, r: 11, name: "C3" },
        { x: 0.76, y: 0.78, r: 11, name: "C4" },
      ];
      for (let i = 1; i < cities.length; i++) {
        const x1 = lx + cities[0].x * lw, y1 = ly + cities[0].y * lh;
        const x2 = lx + cities[i].x * lw, y2 = ly + cities[i].y * lh;
        ctx.strokeStyle = "rgba(255,143,171,0.45)";
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      cities.forEach((ct, i) => {
        const cx = lx + ct.x * lw, cy = ly + ct.y * lh;
        ctx.fillStyle = r0Eff > 1.0 && i <= 2 ? C.danger : C.ok;
        ctx.beginPath(); ctx.arc(cx, cy, ct.r, 0, Math.PI * 2); ctx.fill();
      });

      // Right: S(t), E(t), I(t), R(t) Compartment Trajectories
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "SEIR Compartment Dynamics: S(t), E(t), I(t), R(t)");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      let S = 1 - vaxPct / 100 - 0.02, E = 0.01, I = 0.01, Rec = vaxPct / 100;
      const histS = [], histI = [], histR = [];
      for (let t = 0; t <= 100; t++) {
        histS.push(S); histI.push(I); histR.push(Rec);
        const newE = beta * 1.6 * S * I;
        const newI = 0.35 * E;
        const newR = gamma * I;
        S = clamp(S - newE, 0, 1);
        E = clamp(E + newE - newI, 0, 1);
        I = clamp(I + newI - newR, 0, 1);
        Rec = clamp(Rec + newR, 0, 1);
      }
      [
        { arr: histS, col: C.primary },
        { arr: histI, col: C.danger },
        { arr: histR, col: C.ok },
      ].forEach((s) => {
        ctx.strokeStyle = s.col;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        s.arr.forEach((v, i) => {
          const px = gx0 + (i / 100) * (gx1 - gx0);
          const py = gy0 - v * (gy0 - gy1);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      return {
        "Effective R_eff": r0Eff.toFixed(2),
        "Peak Infectious I_max": `${(Math.max(...histI) * 100).toFixed(1)}%`,
        "Herd Immunity Threshold": `${(Math.max(0, 1 - 1 / Math.max(1.01, (beta / gamma) * 2.4)) * 100).toFixed(0)}%`,
        "Outbreak Regime": r0Eff > 1.0 ? "Supercritical Epidemic" : "Subcritical Containment",
      };
    },

    cx_bak_sandpile_soc(ctx, W, H, st) {
      st.drawHUD("Bak–Tang–Wiesenfeld Abelian Sandpile Grid (z_i ≥ 4 Toppling) & 1/f Avalanche Power Law", st.spec.formula);
      const C = st.COLORS;
      const dropRate = 1 + st.a * 9;
      const dissip = 0.02 + st.b * 0.25;
      const tauExp = 1.15 + dissip * 0.8;

      // Left: 2D Abelian Sandpile Grid (0, 1, 2, 3 grains + Red Toppling Avalanche z >= 4)
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "2D Abelian Sandpile Lattice (Red = Toppling Cascade z ≥ 4)");
      const N = 16;
      const cw = Math.min(lw - 28, lh - 38) / N;
      const colors = ["#161a2e", "#3b82f6", "#6ee7b7", "#ffd166", "#ff6b6b"];
      const avCenter = Math.floor(st.t * 2.5) % N;
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const dist = Math.hypot(r - avCenter, c - (N - 1 - avCenter));
          const z = dist < 2.6 ? 4 : ((r * 7 + c * 13 + Math.floor(st.t * 3)) % 4);
          ctx.fillStyle = colors[z];
          ctx.fillRect(lx + 16 + c * cw, ly + 28 + r * cw, cw - 1, cw - 1);
        }
      }

      // Right: Log-Log Avalanche Size Distribution P(s) ~ s^(-tau)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, `Log–Log Avalanche Spectrum P(s) ∝ s⁻${tauExp.toFixed(2)}`);
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 34;
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const dropOff = u * tauExp * 0.65 + (u > 0.78 ? (u - 0.78) * dissip * 8 : 0);
        const px = gx0 + u * (gx1 - gx0);
        const py = clamp(gy1 + 12 + dropOff * (gy0 - gy1), gy1, gy0);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Avalanche Exponent τ": tauExp.toFixed(2),
        "Mean Slope ⟨z⟩": "2.125 grains/site",
        "Critical State": "Self-Organized Criticality (SOC)",
        "Grain Drive Rate": `${dropRate.toFixed(1)} grains/step`,
      };
    },

    cx_schelling_segregation(ctx, W, H, st) {
      st.drawHUD("Schelling Micromotives Spatial Segregation Grid & Tipping Point at Tolerance τ ≈ 33%", st.spec.formula);
      const C = st.COLORS;
      const tauPct = 10 + st.a * 75;
      const vacPct = 5 + st.b * 25;
      const segregated = tauPct >= 32;

      // Left: 2D Residential Grid (Blue vs Gold households + Empty slots)
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, `2D Neighborhood Grid (Homophily Threshold τ = ${tauPct.toFixed(0)}%)`);
      const N = 16;
      const cw = Math.min(lw - 28, lh - 38) / N;
      const freq = segregated ? 0.35 : 2.4;
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const isVac = ((r * 19 + c * 31) % 100) < vacPct;
          if (isVac) {
            ctx.fillStyle = "rgba(255,255,255,0.04)";
          } else {
            const field = Math.sin(r * freq) + Math.cos(c * freq);
            ctx.fillStyle = field >= 0 ? C.primary : C.accent;
          }
          ctx.fillRect(lx + 16 + c * cw, ly + 28 + r * cw, cw - 1, cw - 1);
        }
      }

      // Right: Macroscopic Segregation Index S(tau) S-Curve
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Macroscopic Segregation Index vs Tolerance τ");
      const gx0 = rx + 28, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const tVal = 10 + (i / 100) * 75;
        const seg = 0.5 + 0.46 * Math.tanh((tVal - 33) / 7);
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - seg * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const segIdx = (0.5 + 0.46 * Math.tanh((tauPct - 33) / 7)) * 100;
      return {
        "Individual Tolerance τ": `${tauPct.toFixed(0)}% same-neighbors`,
        "Same-Type Neighbor %": `${segIdx.toFixed(1)}%`,
        "Macroscopic State": segregated ? "Segregated Enclaves" : "Integrated Mix",
        "Vacancy Mobility": `${vacPct.toFixed(0)}% empty lots`,
      };
    },

    cx_vicsek_flocking(ctx, W, H, st) {
      st.drawHUD("Vicsek Active Matter Self-Propelled Swarm Velocity Alignment & Polar Order Φ(η)", st.spec.formula);
      const C = st.COLORS;
      const eta = st.a * 4.5; // Angular noise
      const rho = 0.5 + st.b * 3.5;
      const radR = 15 + st.c * 35;
      const phiOrder = clamp(Math.exp(-Math.pow(eta / (2.2 + rho * 0.35), 2.2)), 0.06, 0.98);

      // Left: 2D Periodic Box of Self-Propelled Boid Velocity Arrows
      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Active Matter Swarm (Polar Order Φ = ${phiOrder.toFixed(2)})`);
      const flockAng = st.t * 0.6;
      const count = 36;
      for (let i = 0; i < count; i++) {
        const bx = lx + 20 + (((i * 47 + st.t * 45 * Math.cos(flockAng)) % (lw - 40)) + (lw - 40)) % (lw - 40);
        const by = ly + 32 + (((i * 73 + st.t * 45 * Math.sin(flockAng)) % (lh - 48)) + (lh - 48)) % (lh - 48);
        const ang = flockAng + (1 - phiOrder) * Math.sin(i * 3.7 + st.t * 4) * Math.PI;
        drawArrow(ctx, bx, by, bx + Math.cos(ang) * 14, by + Math.sin(ang) * 14, phiOrder > 0.5 ? C.ok : C.accent, 1.8);
      }

      // Right: Orientational Phase Transition Curve Phi(eta)
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Polar Order Parameter Φ = |Σ v_i| / (N v₀) vs Noise η");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const nVal = (i / 100) * 4.5;
        const pVal = Math.exp(-Math.pow(nVal / (2.2 + rho * 0.35), 2.2));
        const px = gx0 + (i / 100) * (gx1 - gx0);
        const py = gy0 - pVal * (gy0 - gy1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Polar Alignment Φ": phiOrder.toFixed(3),
        "Angular Noise η": `${eta.toFixed(2)} rad`,
        "Interaction Radius R": `${radR.toFixed(0)} px`,
        "Collective Phase": phiOrder > 0.55 ? "Ordered Toner–Tu Flock" : "Disordered Gas",
      };
    },

    cx_gray_scott_turing(ctx, W, H, st) {
      st.drawHUD("Gray–Scott Reaction–Diffusion Morphospace (F, k) & Animated Turing Pattern Patch", st.spec.formula);
      const C = st.COLORS;
      const F = 0.015 + st.a * 0.065;
      const k = 0.045 + st.b * 0.025;
      const dRatio = 1.5 + st.c * 1.5;

      // Left: Animated 2D Turing Morphogen Concentration Field v(x, y)
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      const patType = F < 0.032 ? "Self-Replicating Mitosis Spots" : (F < 0.052 ? "Labyrinthine Coral Stripes" : "Soliton Holes");
      st.panel(lx, ly, lw, lh, `Turing Pattern: ${patType}`);
      const nx = 30, ny = 22;
      const cw = (lw - 24) / nx, ch = (lh - 38) / ny;
      for (let r = 0; r < ny; r++) {
        for (let c = 0; c < nx; c++) {
          const x = c * 0.45, y = r * 0.45;
          const v = F < 0.032
            ? Math.sin(x * 1.6 + st.t) * Math.sin(y * 1.6 - st.t)
            : Math.sin(x * 1.3 + Math.cos(y * 1.4 + st.t * 0.8));
          const active = v > (0.25 - (F - 0.015) * 4);
          ctx.fillStyle = active ? C.ok : "#14182c";
          ctx.fillRect(lx + 12 + c * cw, ly + 28 + r * ch, cw + 0.4, ch + 0.4);
        }
      }

      // Right: Pearson (F, k) Bifurcation Morphospace Diagram
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Pearson (k vs F) Reaction–Diffusion Phase Map");
      const gx0 = rx + 26, gx1 = rx + rw - 18, gy0 = ry + rh - 24, gy1 = ry + 32;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx0 + 18, gy0 - 12);
      ctx.quadraticCurveTo(gx0 + (gx1 - gx0) * 0.55, gy1 + 14, gx1 - 12, gy1 + 36);
      ctx.stroke();

      const curX = gx0 + ((k - 0.045) / 0.025) * (gx1 - gx0);
      const curY = gy0 - ((F - 0.015) / 0.065) * (gy0 - gy1);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(curX, curY, 6, 0, Math.PI * 2); ctx.fill();

      return {
        "Feed Rate F": F.toFixed(4),
        "Kill Rate k": k.toFixed(4),
        "Diffusivity D_u / D_v": `${dRatio.toFixed(2)} : 1`,
        "Morphology": patType.split(" ").slice(-1)[0],
      };
    },

    cx_cascade_overload(ctx, W, H, st) {
      st.drawHUD("Motter–Lai Power Grid Cascading Overload: L_j(t) > (1 + α) L_j(0) Line Trips", st.spec.formula);
      const C = st.COLORS;
      const alphaTol = 0.05 + st.a * 0.75;
      const initShock = st.b;
      const shed = st.c;

      // Left: High-Voltage Substation Transmission Grid
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      st.panel(lx, ly, lw, lh, "High-Voltage Transmission Grid (Red = Thermal Trip)");
      const subs = [
        [0.2, 0.3], [0.5, 0.24], [0.8, 0.3],
        [0.2, 0.75], [0.5, 0.78], [0.8, 0.75],
      ];
      const lines = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[0,4],[1,5]];
      const tripCount = Math.max(1, Math.round((1 - alphaTol) * 6 * (0.5 + initShock) * (1 - shed * 0.5)));
      lines.forEach(([u, v], idx) => {
        const tripped = idx < tripCount;
        ctx.strokeStyle = tripped ? C.danger : C.ok;
        ctx.lineWidth = tripped ? 2.4 : 1.8;
        ctx.setLineDash(tripped ? [4, 3] : []);
        ctx.beginPath();
        ctx.moveTo(lx + subs[u][0] * lw, ly + subs[u][1] * lh);
        ctx.lineTo(lx + subs[v][0] * lw, ly + subs[v][1] * lh);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      subs.forEach(([sx, sy], i) => {
        ctx.fillStyle = i < Math.floor(tripCount / 2) ? C.danger : C.primary;
        ctx.beginPath(); ctx.arc(lx + sx * lw, ly + sy * lh, 8, 0, Math.PI * 2); ctx.fill();
      });

      // Right: Substation Load / Capacity Bar Chart
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Line Load Ratio L_i / C_i vs Trip Limit 1.0");
      for (let i = 0; i < 6; i++) {
        const y = ry + 34 + i * 24;
        const loadRatio = clamp(0.55 + (i < tripCount ? 0.55 : 0.15) - alphaTol * 0.3, 0.2, 1.25);
        ctx.fillStyle = loadRatio >= 1.0 ? C.danger : C.ok;
        ctx.fillRect(rx + 48, y, (loadRatio / 1.3) * (rw - 66), 14);
        ctx.fillStyle = C.text;
        ctx.font = "10px monospace";
        ctx.fillText(`Bus ${i}`, rx + 12, y + 11);
      }

      const servedMw = Math.max(12, 100 - tripCount * 11.5);
      return {
        "Tolerance Margin α": `${(alphaTol * 100).toFixed(0)}%`,
        "Tripped Lines": `${tripCount} / ${lines.length} corridors`,
        "Served Grid Load": `${servedMw.toFixed(1)}% MW`,
        "Cascade Status": tripCount >= 4 ? "Blackout Islanding" : "N−1 Stable",
      };
    },

    cx_hegselmann_krause(ctx, W, H, st) {
      st.drawHUD("Hegselmann–Krause Bounded Confidence Opinion Trajectories x_i(t) ∈ [0, 1]", st.spec.formula);
      const C = st.COLORS;
      const eps = 0.04 + st.a * 0.36; // Consensus > 0.25, Bipartisan ~ 0.15, Fragmented < 0.10
      const zealot = st.b;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      const clusters = eps > 0.24 ? 1 : (eps > 0.13 ? 2 : 4);
      st.panel(lx, ly, lw, lh, `Opinion Evolution x_i(t) for Confidence Bound ε = ${eps.toFixed(2)} (${clusters} Cluster${clusters > 1 ? "s" : ""})`);
      const gx0 = lx + 28, gx1 = lx + lw - 24, gy0 = ly + lh - 22, gy1 = ly + 32;

      const nAgents = 24;
      for (let i = 0; i < nAgents; i++) {
        const xInit = (i + 0.5) / nAgents;
        const targetCluster = (Math.floor(xInit * clusters) + 0.5) / clusters;
        ctx.strokeStyle = C.series[Math.floor(xInit * clusters) % C.series.length];
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let step = 0; step <= 60; step++) {
          const u = step / 60;
          const xVal = lerp(xInit, targetCluster, 1 - Math.exp(-u * (4.5 + zealot * 2)));
          const px = gx0 + u * (gx1 - gx0);
          const py = gy0 - xVal * (gy0 - gy1);
          if (step === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      return {
        "Confidence Bound ε": eps.toFixed(3),
        "Asymptotic Clusters": `${clusters} (${clusters === 1 ? "Consensus" : (clusters === 2 ? "Polarized" : "Echo Chambers")})`,
        "Rule Approx": "≈ 1 / (2ε) clusters",
        "Convergence Time": `${Math.round(14 / eps)} steps`,
      };
    },

    cx_early_warning_csd(ctx, W, H, st) {
      st.drawHUD("Critical Slowing Down (CSD): Flattening Fold Potential U(x) & Rising AC(1) / Variance", st.spec.formula);
      const C = st.COLORS;
      const mu = st.a * 0.96; // 0..0.96 approaching bifurcation at 1.0
      const sigma = 0.05 + st.b * 0.25;
      const lambdaRec = Math.max(0.04, 1 - mu);
      const ac1 = Math.exp(-lambdaRec * 0.45);
      const variance = (sigma * sigma) / (2 * lambdaRec);

      // Left: Tilting Saddle-Node Potential Well U(x) = -x^3/3 + (1-mu)*x
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Saddle-Node Potential Well Flattening Near Tipping Point");
      const gx0 = lx + 24, gx1 = lx + lw - 18, gyMid = ly + lh * 0.58;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const x = (i / 90) * 2.2 - 1.1;
        const U = (x * x * x) / 3 - (1 - mu * 0.88) * x;
        const px = gx0 + (i / 90) * (gx1 - gx0);
        const py = gyMid - U * 68;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // Rolling ball sloshing wider as curvature flattens
      const ballU = 0.68 + Math.sin(st.t * (3.5 * lambdaRec + 0.6)) * (0.08 + 0.16 * mu);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(gx0 + ballU * (gx1 - gx0), gyMid + 14 * (1 - mu), 6.5, 0, Math.PI * 2); ctx.fill();

      // Right: Rising Early Warning Indicators: Lag-1 Autocorrelation AC(1) -> 1 & Variance
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Early Warning Signals: Lag-1 AC(1) → 1 & Variance ↑");
      const rx0 = rx + 26, rx1 = rx + rw - 18, ry0 = ry + rh - 24, ry1 = ry + 32;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const m = (i / 100) * 0.96;
        const ac = Math.exp(-(1 - m) * 0.45);
        const px = rx0 + (i / 100) * (rx1 - rx0);
        const py = ry0 - ac * (ry0 - ry1);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      const curX = rx0 + (mu / 0.96) * (rx1 - rx0);
      ctx.fillStyle = C.danger;
      ctx.beginPath(); ctx.arc(curX, ry0 - ac1 * (ry0 - ry1), 6, 0, Math.PI * 2); ctx.fill();

      return {
        "Recovery Rate |λ_rec|": lambdaRec.toFixed(3),
        "Lag-1 Autocorrelation": ac1.toFixed(3),
        "Fluctuation Variance": variance.toFixed(3),
        "Tipping Alert": ac1 > 0.85 ? "CRITICAL (Imminent Fold!)" : "Resilient Basin",
      };
    },

    cx_may_wigner_stability(ctx, W, H, st) {
      st.drawHUD("May–Wigner Girko Circle in the Complex Plane: Radius R = σ√(S·C) vs Re(λ) = 0", st.spec.formula);
      const C = st.COLORS;
      const S = Math.round(15 + st.a * 85);
      const connC = 0.05 + st.b * 0.45;
      const sigma = 0.1 + st.c * 0.6;
      const radMay = sigma * Math.sqrt(S * connC);
      const stable = radMay < 1.0;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Complex Eigenvalue Plane (Center = −d = −1, Girko–May Radius R = ${radMay.toFixed(2)})`);
      const zeroX = lx + lw * 0.66, cy = ly + lh * 0.54;
      const scalePx = Math.min(lw * 0.24, lh * 0.36);
      const centerX = zeroX - scalePx; // -1.0 on real axis

      // Instability boundary Re(lambda) = 0
      ctx.fillStyle = "rgba(255,107,107,0.14)";
      ctx.fillRect(zeroX, ly + 26, lw - (zeroX - lx) - 12, lh - 38);
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(zeroX, ly + 26); ctx.lineTo(zeroX, ly + lh - 12); ctx.stroke();
      ctx.fillStyle = C.danger;
      ctx.font = "600 10px monospace";
      ctx.fillText("Re(λ) = 0 Instability Boundary", zeroX + 8, ly + 42);

      // Girko-May Disk
      const rPx = radMay * scalePx;
      ctx.strokeStyle = stable ? C.ok : C.danger;
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(centerX, cy, rPx, 0, Math.PI * 2); ctx.stroke();

      // Eigenvalues uniformly distributed inside disk
      for (let i = 0; i < Math.min(45, S); i++) {
        const a = i * 2.39996 + st.t * 0.2;
        const r = Math.sqrt((i + 0.5) / Math.min(45, S)) * rPx;
        const ex = centerX + Math.cos(a) * r, ey = cy + Math.sin(a) * r;
        ctx.fillStyle = ex > zeroX ? C.danger : C.primary;
        ctx.beginPath(); ctx.arc(ex, ey, 3.2, 0, Math.PI * 2); ctx.fill();
      }

      return {
        "May Complexity σ√(SC)": radMay.toFixed(3),
        "Max Real Part Re(λ_max)": (radMay - 1.0).toFixed(3),
        "Ecosystem Stability": stable ? "Asymptotically Stable" : "UNSTABLE (Re(λ) > 0)",
        "Species Richness S": `${S} species (C = ${(connC * 100).toFixed(0)}%)`,
      };
    },

    cx_jarzynski_crooks(ctx, W, H, st) {
      st.drawHUD("Crooks Fluctuation Theorem: Forward P_F(W) & Reverse P_R(−W) Crossing at W = ΔF", st.spec.formula);
      const C = st.COLORS;
      const vPull = 0.2 + st.a * 2.8;
      const nTraj = Math.round(50 + st.b * 950);
      const beta = 0.5 + st.c * 1.5;
      const dF = 4.0;
      const wDiss = vPull * 1.35;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Forward P_F(W) vs Time-Reversed P_R(−W) Work Distributions Crossing at ΔF");
      const gx0 = lx + 32, gx1 = lx + lw - 24, gy0 = ly + lh - 26, gy1 = ly + 34;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();

      const sig2 = (2 * wDiss) / beta;
      [
        { mean: dF + wDiss, col: C.primary },
        { mean: dF - wDiss, col: C.secondary },
      ].forEach((dist) => {
        ctx.strokeStyle = dist.col;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const w = -2 + (i / 120) * 12;
          const p = Math.exp(-Math.pow(w - dist.mean, 2) / (2 * Math.max(0.4, sig2)));
          const px = gx0 + (i / 120) * (gx1 - gx0);
          const py = gy0 - p * (gy0 - gy1) * 0.88;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Exact Crossing Line W = Delta F
      const dfPx = gx0 + ((dF + 2) / 12) * (gx1 - gx0);
      ctx.strokeStyle = C.ok;
      ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(dfPx, gy1); ctx.lineTo(dfPx, gy0); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.ok;
      ctx.font = "600 11px monospace";
      ctx.fillText("Exact Crossing: W = ΔF = 4.00 k_B T", dfPx - 80, gy1 + 14);

      return {
        "Equilibrium Free Energy ΔF": `${dF.toFixed(2)} k_B T`,
        "Mean Forward Work ⟨W⟩_F": `${(dF + wDiss).toFixed(2)} k_B T`,
        "Dissipated Work W_diss": `${wDiss.toFixed(2)} k_B T`,
        "Jarzynski Estimator": `${(dF + 0.08 / Math.sqrt(nTraj / 50)).toFixed(3)} k_B T`,
      };
    },

    cx_west_allometric_urban(ctx, W, H, st) {
      st.drawHUD("West–Brown–Enquist β = 0.75 Vascular Fractal vs Bettencourt β = 1.15 Urban Superlinear Scaling", st.spec.formula);
      const C = st.COLORS;
      const logSize = 2 + st.a * 6;
      const fracD = 2.0 + st.b * 1.0;

      // Left: Log-Log Allometric Scaling Lines (beta = 0.75, 1.00, 1.15)
      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Log–Log Allometric Scaling: Biology (0.75) vs Cities (1.15)");
      const gx0 = lx + 28, gx1 = lx + lw - 18, gy0 = ly + lh - 24, gy1 = ry_top(ly);
      function ry_top(y) { return y + 32; }

      [
        { slope: 0.75, col: C.ok, label: "β = 0.75 (Metabolic Vascular)" },
        { slope: 1.00, col: C.muted, label: "β = 1.00 (Linear Isometric)" },
        { slope: 1.15, col: C.accent, label: "β = 1.15 (Urban Patents/GDP)" },
      ].forEach((ln) => {
        ctx.strokeStyle = ln.col;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(gx0, gy0 - 14);
        ctx.lineTo(gx1, gy0 - 14 - (ln.slope / 1.25) * (gy0 - gy1 - 20));
        ctx.stroke();
      });

      // Right: Space-Filling Fractal Vascular Tree
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Space-Filling Fractal Branching Network");
      const branch = (x, y, len, ang, depth) => {
        if (depth === 0) return;
        const x2 = x + Math.cos(ang) * len;
        const y2 = y + Math.sin(ang) * len;
        ctx.strokeStyle = depth > 2 ? C.primary : C.ok;
        ctx.lineWidth = depth * 0.7;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
        branch(x2, y2, len * 0.72, ang - 0.45, depth - 1);
        branch(x2, y2, len * 0.72, ang + 0.45, depth - 1);
      };
      branch(rx + rw * 0.5, ry + rh - 18, 36, -Math.PI * 0.5, 5);

      const bMetab = fracD / (fracD + 1);
      return {
        "WBE Metabolic Exponent": `β = D/(D+1) = ${bMetab.toFixed(3)}`,
        "Urban Innovation β": "1.15 (Superlinear)",
        "Urban Infrastructure β": "0.85 (Economy of Scale)",
        "Population Scale 10^N": `10^${logSize.toFixed(1)}`,
      };
    },

    cx_minor_game_el_farol(ctx, W, H, st) {
      st.drawHUD("El Farol Bar & Challet–Zhang Minority Game Volatility σ²/N vs Savit Threshold α_c ≈ 0.337", st.spec.formula);
      const C = st.COLORS;
      const mBits = Math.round(2 + st.a * 8);
      const nAgents = 101;
      const alpha = Math.pow(2, mBits) / nAgents;
      const sigma2N = alpha < 0.34 ? (0.34 / alpha) * 1.4 : 0.42 + 0.58 * (1 - Math.exp(-(alpha - 0.34) * 1.5));

      // Left: Bar Attendance Time-Series A(t) around 60% Capacity Threshold
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "El Farol Bar Attendance A(t) vs 60% Capacity Threshold");
      const gx0 = lx + 26, gx1 = lx + lw - 18, gyMid = ly + lh * 0.52;
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(gx0, gyMid); ctx.lineTo(gx1, gyMid); ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const amp = Math.min(1.2, Math.sqrt(sigma2N) * 0.45);
        const y = gyMid + Math.sin(i * 1.7 + st.t * 4) * Math.cos(i * 0.9 - st.t * 2) * amp * (lh * 0.36);
        const px = gx0 + u * (gx1 - gx0);
        if (i === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
      }
      ctx.stroke();

      // Right: Savit Phase Transition Curve sigma^2 / N vs alpha = 2^m / N
      const rx = lx + lw + 12, ry = 46, rw = W - rx - 16, rh = H - 60;
      st.panel(rx, ry, rw, rh, "Volatility σ²/N vs Complexity α = 2^m / N (Savit Dip)");
      const rx0 = rx + 28, rx1 = rx + rw - 18, ry0 = ry + rh - 24, ry1 = ry + 32;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 1; i <= 100; i++) {
        const aVal = (i / 100) * 2.5;
        const vol = aVal < 0.34 ? Math.min(2.2, 0.32 / aVal) : 0.35 + 0.65 * (1 - Math.exp(-(aVal - 0.34) * 1.8));
        const px = rx0 + (i / 100) * (rx1 - rx0);
        const py = ry0 - (vol / 2.4) * (ry0 - ry1);
        if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Control Ratio α = 2^m/N": alpha.toFixed(3),
        "Normalized Volatility σ²/N": sigma2N.toFixed(2),
        "Savit Phase": alpha < 0.30 ? "Symmetric Herding (High Vol)" : (alpha < 0.55 ? "Coordination Minimum!" : "Random Coin-Toss Limit"),
        "History Memory m": `${mBits} bits (${Math.pow(2, mBits)} histories)`,
      };
    },

    cx_fokker_planck_kramers(ctx, W, H, st) {
      st.drawHUD("Fokker–Planck Probability Density P(x, t) Leaking Over Bistable Barrier at Kramers Rate r_K", st.spec.formula);
      const C = st.COLORS;
      const dU = 0.4 + st.a * 2.2;
      const noiseD = 0.15 + st.b * 1.2;
      const tiltF = (st.c - 0.5) * 0.8;
      const rKramers = (1 / (2 * Math.PI)) * Math.sqrt(2 * dU) * Math.exp(-dU / noiseD);

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Tilted Bistable Potential U(x) & Fokker–Planck Density P(x, t) Barrier Escape");
      const gx0 = lx + 32, gx1 = lx + lw - 24, gy0 = ly + lh - 26, gy1 = ly + 34;

      // Bistable potential U(x) = dU * (x^2 - 1)^2 - tiltF * x
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const x = (i / 120) * 3.2 - 1.6;
        const U = 0.35 * dU * Math.pow(x * x - 1, 2) - tiltF * x + 0.35;
        const px = gx0 + (i / 120) * (gx1 - gx0);
        const py = clamp(gy0 - U * 58, gy1, gy0);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Fokker-Planck density P(x, t) sloshing / leaking from left well (-1) to right well (+1)
      const leakFrac = clamp(0.15 + 0.75 * (1 - Math.exp(-rKramers * ((st.t % 10) * 1.8))), 0.1, 0.9);
      ctx.fillStyle = "rgba(110, 231, 183, 0.28)";
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      for (let i = 0; i <= 120; i++) {
        const x = (i / 120) * 3.2 - 1.6;
        const pLeft = (1 - leakFrac) * Math.exp(-Math.pow(x + 1, 2) / (0.18 * noiseD + 0.06));
        const pRight = leakFrac * Math.exp(-Math.pow(x - 1, 2) / (0.18 * noiseD + 0.06));
        const px = gx0 + (i / 120) * (gx1 - gx0);
        const py = gy0 - (pLeft + pRight) * (gy0 - gy1) * 0.75;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(gx1, gy0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      return {
        "Kramers Rate r_K": `${rKramers.toExponential(2)} s⁻¹`,
        "Mean Escape Time τ_K": `${(1 / Math.max(1e-6, rKramers)).toFixed(1)} s`,
        "Arrhenius Factor ΔU/D": (dU / noiseD).toFixed(2),
        "Right-Well Population": `${(leakFrac * 100).toFixed(1)}%`,
      };
    },
  };

  window.SelfTaughtSims.registerCustomRenderers(R);
})();


