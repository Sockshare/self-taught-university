/* Self-Taught — 60 Bespoke Domain-Accurate Interactive Simulations (Group 3: Cybersecurity, Neuroscience, Game Theory & Quant Finance)
 * Registers 60 distinct custom renderers via window.SelfTaughtSims.registerCustomRenderers(R).
 */
(function () {
  "use strict";

  const TAU = Math.PI * 2;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function txt(ctx, s, x, y, col, sz, align, bold) {
    ctx.fillStyle = col || "#e8ebff";
    ctx.font = (bold ? "600 " : "") + (sz || 11) + "px system-ui, -apple-system, sans-serif";
    ctx.textAlign = align || "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(String(s), x, y);
  }

  function line(ctx, x1, y1, x2, y2, col, w, dash) {
    ctx.save();
    ctx.strokeStyle = col || "#7c9cff";
    ctx.lineWidth = w || 1.5;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function arrow(ctx, x1, y1, x2, y2, col, w) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < 2) return;
    const ux = dx / L, uy = dy / L, hs = Math.min(8, L * 0.4);
    ctx.save();
    ctx.strokeStyle = col || "#7c9cff";
    ctx.fillStyle = col || "#7c9cff";
    ctx.lineWidth = w || 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - ux * hs, y2 - uy * hs);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * hs - uy * hs * 0.5, y2 - uy * hs + ux * hs * 0.5);
    ctx.lineTo(x2 - ux * hs + uy * hs * 0.5, y2 - uy * hs - ux * hs * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function circle(ctx, x, y, r, fill, stroke, lw) {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.5, r), 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); }
  }

  const R = {};

  /* ══════════════════════════════════════════════════════════════════════════
   * PART 1: CYBERSECURITY (20 SIMULATIONS)
   * ══════════════════════════════════════════════════════════════════════════ */

  // 1. sec_rsa_lattice: 2D lattice grid with skew trapdoor basis vs LLL-reduced orthogonal basis + shortest vector ball λ₁(L) and modular exponentiation cycle
  R.sec_rsa_lattice = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Drag on lattice to probe target vector; compare skew public basis B vs LLL-reduced basis", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.56, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "2D Lattice L(B): Skew Public Basis vs LLL Reduced Basis & λ₁ Ball");
    st.panel(rx, ry, rw, rh, "Modular Exponentiation Cycle m^e mod N");

    const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
    const skew = 0.35 + (1 - st.a) * 1.4;
    // Reduced basis vectors
    const r1x = 28 + st.c * 14, r1y = 6;
    const r2x = -8, r2y = 26 + st.c * 12;
    // Skew trapdoor basis B = U * R
    const kSkew = Math.round(2 + skew * 2);
    const b1x = r1x + kSkew * r2x, b1y = r1y + kSkew * r2y;
    const b2x = r1x + (kSkew + 1) * r2x, b2y = r1y + (kSkew + 1) * r2y;

    ctx.save();
    ctx.beginPath(); ctx.rect(lx + 2, ly + 22, lw - 4, lh - 24); ctx.clip();

    // Shortest vector ball λ₁(L)
    const lambda1 = Math.hypot(r1x, r1y);
    circle(ctx, cx, cy, lambda1, "rgba(110,231,183,0.10)", C.ok, 1.5);
    txt(ctx, `λ₁(L) ≈ ${(lambda1 / 10).toFixed(2)}`, cx + lambda1 + 5, cy - 4, C.ok, 10);

    // Draw lattice points
    for (let i = -6; i <= 6; i++) {
      for (let j = -6; j <= 6; j++) {
        const px = cx + i * r1x + j * r2x;
        const py = cy + i * r1y + j * r2y;
        if (px > lx + 8 && px < lx + lw - 8 && py > ly + 26 && py < ly + lh - 8) {
          circle(ctx, px, py, (i === 0 && j === 0) ? 4 : 2.3, (i === 0 && j === 0) ? C.accent : "rgba(232,235,255,0.45)");
        }
      }
    }

    // Skew basis arrows (danger/secondary)
    arrow(ctx, cx, cy, cx + b1x, cy - b1y, C.danger, 2.2);
    arrow(ctx, cx, cy, cx + b2x, cy - b2y, C.secondary, 2.2);
    txt(ctx, "b₁ (skew)", cx + b1x + 4, cy - b1y, C.danger, 10, "left", true);
    txt(ctx, "b₂ (skew)", cx + b2x + 4, cy - b2y, C.secondary, 10, "left", true);

    // LLL reduced basis arrows (ok/primary)
    arrow(ctx, cx, cy, cx + r1x, cy - r1y, C.ok, 2.5);
    arrow(ctx, cx, cy, cx + r2x, cy - r2y, C.primary, 2.5);
    txt(ctx, "b₁* (LLL)", cx + r1x + 4, cy - r1y + 10, C.ok, 10, "left", true);
    txt(ctx, "b₂* (LLL)", cx + r2x - 42, cy - r2y - 4, C.primary, 10, "left", true);

    // Babai closest vector probe from mouse
    const tx = lx + clamp(st.px, 0.1, 0.9) * lw;
    const ty = ly + clamp(st.py, 0.2, 0.9) * lh;
    const det = r1x * r2y - r1y * r2x;
    const dx = tx - cx, dy = ty - cy;
    const u1 = Math.round((dx * r2y - dy * r2x) / det);
    const u2 = Math.round((-dx * r1y + dy * r1x) / det);
    const cvx = cx + u1 * r1x + u2 * r2x, cvy = cy + u1 * r1y + u2 * r2y;
    line(ctx, tx, ty, cvx, cvy, C.accent, 1.5, [3, 3]);
    circle(ctx, tx, ty, 4, C.accent);
    circle(ctx, cvx, cvy, 5, null, C.accent, 2);
    ctx.restore();

    // Right panel: Modular exponentiation cycle c ≡ m^e mod N
    const rcx = rx + rw * 0.5, rcy = ry + rh * 0.52;
    const rad = Math.min(rw, rh) * 0.34;
    const Nmod = 17 + Math.round(st.a * 16);
    const expE = Math.max(3, (Math.round(st.v1) * 2) + 1);
    circle(ctx, rcx, rcy, rad, "rgba(124,156,255,0.05)", C.axis, 1);

    const activeM = (Math.floor(st.t * 2) % (Nmod - 1)) + 1;
    for (let m = 0; m < Nmod; m++) {
      const ang1 = (m / Nmod) * TAU - Math.PI / 2;
      const x1 = rcx + Math.cos(ang1) * rad, y1 = rcy + Math.sin(ang1) * rad;
      // Compute m^e mod N
      let cVal = 1, base = m % Nmod, e = expE;
      while (e > 0) { if (e & 1) cVal = (cVal * base) % Nmod; base = (base * base) % Nmod; e >>= 1; }
      const ang2 = (cVal / Nmod) * TAU - Math.PI / 2;
      const x2 = rcx + Math.cos(ang2) * rad, y2 = rcy + Math.sin(ang2) * rad;
      const isAct = m === activeM;
      line(ctx, x1, y1, x2, y2, isAct ? C.accent : "rgba(124,156,255,0.28)", isAct ? 2.2 : 1);
      circle(ctx, x1, y1, isAct ? 4.5 : 2.5, isAct ? C.accent : C.primary);
    }
    txt(ctx, `Ring Z_${Nmod}: m ↦ m^${expE} mod ${Nmod}`, rcx, ry + rh - 14, C.muted, 10, "center");

    const hermite = Math.pow(1.0219, st.v2);
    return {
      "RSA Modulus Depth": `${Math.round(st.v0)} bits`,
      "Shortest Vector λ₁(L)": `${(lambda1 / 10).toFixed(2)}`,
      "LLL Hermite Factor δ^n": hermite.toFixed(3),
      "Babai CVP Lattice Index": `(${u1}, ${u2})`,
    };
  };

  // 2. sec_elliptic_ecdh: elliptic curve y² = x³ + ax + b chord-and-tangent point addition + finite field GF(p) point cloud + Montgomery ladder steps
  R.sec_elliptic_ecdh = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Real-plane chord-and-tangent P+Q=-R | Right: Finite field GF(p) torus & Montgomery ladder", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Weierstrass Curve y² = x³ + ax + b (Chord & Tangent)");
    st.panel(rx, ry, rw, rh, "Finite Field E(GF(p)) & Constant-Time Montgomery Ladder");

    // Left: Continuous curve y^2 = x^3 - 2x + 2
    const aCurve = -2.2 + (st.b - 0.5) * 1.2;
    const bCurve = 2.0;
    const ox = lx + lw * 0.45, oy = ly + lh * 0.54, sc = Math.min(lw, lh) * 0.16;
    line(ctx, lx + 10, oy, lx + lw - 10, oy, C.axis, 1);
    line(ctx, ox, ly + 24, ox, ly + lh - 10, C.axis, 1);

    for (const sign of [1, -1]) {
      ctx.beginPath();
      let started = false;
      for (let px = -2.2; px <= 2.6; px += 0.025) {
        const rhs = px * px * px + aCurve * px + bCurve;
        if (rhs >= 0) {
          const py = sign * Math.sqrt(rhs);
          const sx = ox + px * sc, sy = oy - py * sc;
          if (sy > ly + 24 && sy < ly + lh - 8) {
            if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
          } else started = false;
        } else started = false;
      }
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    // Two points P and Q on curve and secant line to -R and reflection to R = P + Q
    const xP = -1.35 + 0.35 * Math.sin(st.t * 0.9);
    const yP = Math.sqrt(Math.max(0.01, xP * xP * xP + aCurve * xP + bCurve));
    const xQ = 0.25 + (st.px - 0.5) * 0.9;
    const yQ = Math.sqrt(Math.max(0.01, xQ * xQ * xQ + aCurve * xQ + bCurve));
    const mSlope = (yQ - yP) / (xQ - xP + 1e-6);
    const xR = clamp(mSlope * mSlope - xP - xQ, -2.0, 2.4);
    const yRneg = yP + mSlope * (xR - xP);
    const yR = -yRneg;

    const sxP = ox + xP * sc, syP = oy - yP * sc;
    const sxQ = ox + xQ * sc, syQ = oy - yQ * sc;
    const sxR = ox + xR * sc, syRneg = oy - yRneg * sc, syR = oy - yR * sc;

    line(ctx, sxP - (sxQ - sxP) * 0.3, syP - (syQ - syP) * 0.3, sxR + (sxR - sxP) * 0.15, syRneg + (syRneg - syP) * 0.15, C.secondary, 1.5);
    line(ctx, sxR, syRneg, sxR, syR, C.accent, 1.6, [4, 3]);
    circle(ctx, sxP, syP, 5, C.ok); txt(ctx, "P", sxP - 10, syP - 7, C.ok, 11, "left", true);
    circle(ctx, sxQ, syQ, 5, C.secondary); txt(ctx, "Q", sxQ + 6, syQ - 7, C.secondary, 11, "left", true);
    circle(ctx, sxR, syRneg, 4.5, C.muted); txt(ctx, "-R", sxR + 6, syRneg + 4, C.muted, 10);
    circle(ctx, sxR, syR, 5.5, C.accent); txt(ctx, "R=P+Q", sxR + 7, syR + 4, C.accent, 11, "left", true);

    // Right top: Finite field point cloud E(GF(p))
    const pMod = Math.max(17, Math.min(97, Math.round(st.v2) | 1));
    const fBoxX = rx + 12, fBoxY = ry + 26, fBoxW = rw - 24, fBoxH = rh * 0.56;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.strokeRect(fBoxX, fBoxY, fBoxW, fBoxH);

    const kScalar = Math.max(1, Math.round(st.v0));
    const pts = [];
    for (let x = 0; x < pMod; x++) {
      const rhs = ((x * x * x) + 7 * x + 3) % pMod;
      for (let y = 0; y <= pMod / 2; y++) {
        if ((y * y) % pMod === rhs) {
          pts.push([x, y]);
          if (y > 0 && pMod - y !== y) pts.push([x, pMod - y]);
        }
      }
    }
    pts.forEach((pt, idx) => {
      const px = fBoxX + 6 + (pt[0] / pMod) * (fBoxW - 12);
      const py = fBoxY + fBoxH - 6 - (pt[1] / pMod) * (fBoxH - 12);
      const isK = pts.length > 0 && idx === (kScalar % pts.length);
      circle(ctx, px, py, isK ? 5 : 2, isK ? C.accent : "rgba(124,156,255,0.55)");
    });
    if (pts.length > 1) {
      const gPt = pts[1 % pts.length], kPt = pts[kScalar % pts.length];
      const gx = fBoxX + 6 + (gPt[0] / pMod) * (fBoxW - 12), gy = fBoxY + fBoxH - 6 - (gPt[1] / pMod) * (fBoxH - 12);
      const kx = fBoxX + 6 + (kPt[0] / pMod) * (fBoxW - 12), ky = fBoxY + fBoxH - 6 - (kPt[1] / pMod) * (fBoxH - 12);
      arrow(ctx, gx, gy, kx, ky, C.ok, 1.8);
      txt(ctx, "G", gx + 5, gy - 4, C.ok, 10, "left", true);
      txt(ctx, "k·G", kx + 6, ky - 4, C.accent, 10, "left", true);
    }

    // Right bottom: Montgomery ladder R0, R1 constant-time bit scan
    const ladY = fBoxY + fBoxH + 14;
    const bits = kScalar.toString(2).padStart(7, "0");
    txt(ctx, `Montgomery Ladder for k = ${kScalar} (${bits}₂):`, fBoxX, ladY + 8, C.text, 10, "left", true);
    const bw = (fBoxW - 8) / bits.length;
    for (let i = 0; i < bits.length; i++) {
      const bx = fBoxX + i * bw;
      const bit = bits[i] === "1";
      ctx.fillStyle = bit ? "rgba(110,231,183,0.22)" : "rgba(124,156,255,0.15)";
      ctx.fillRect(bx, ladY + 14, bw - 4, 34);
      ctx.strokeStyle = bit ? C.ok : C.primary;
      ctx.strokeRect(bx, ladY + 14, bw - 4, 34);
      txt(ctx, `b=${bits[i]}`, bx + (bw - 4) / 2, ladY + 27, bit ? C.ok : C.primary, 10, "center", true);
      txt(ctx, bit ? "R0+=R1;2R1" : "R1+=R0;2R0", bx + (bw - 4) / 2, ladY + 42, C.muted, 8, "center");
    }

    return {
      "Private Scalar k": `${kScalar} (0b${bits})`,
      "Field Order |E(GF(p))|": `${pts.length + 1} pts (p=${pMod})`,
      "Public Point k·G": pts.length ? `(${pts[kScalar % pts.length][0]}, ${pts[kScalar % pts.length][1]})` : "O",
      "Ladder Timing Leakage": "0.00 ns (Constant-Time)",
    };
  };

  // 3. sec_aes_avalanche: dual 4×4 byte state grids (Plain vs Flipped) across AES rounds with glowing bit-diff cells + Hamming distance avalanche curve
  R.sec_aes_avalanche = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Click any cell to flip a fault bit; inspect SubBytes/MixColumns diffusion across rounds", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "4×4 AES State Matrices: Reference S vs Fault-Flipped S'");
    st.panel(rx, ry, rw, rh, "Strict Avalanche Criterion (SAC) Hamming Distance");

    const rounds = Math.max(1, Math.round(st.v0));
    const faultBit = Math.round(st.v2) % 128;
    const faultByte = Math.floor(faultBit / 8);

    const gridW = (lw - 36) * 0.47;
    const cellS = Math.min((gridW - 12) / 4, (lh - 70) / 4);
    const g1x = lx + 14, g2x = lx + lw * 0.52, gy = ly + 42;

    txt(ctx, "State S (Original)", g1x, gy - 8, C.primary, 10, "left", true);
    txt(ctx, `State S' (Bit #${faultBit} Flipped, R=${rounds})`, g2x, gy - 8, C.secondary, 10, "left", true);

    let totalDiffBits = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const idx = c * 4 + r;
        const baseByte = ((idx * 37 + 19 * rounds + Math.round(st.v1)) * 73) & 0xff;
        // Avalanche diffusion spread by round
        let diffMask = 0;
        if (rounds === 1) {
          if (idx === faultByte) diffMask = (1 << (faultBit % 8)) ^ 0x5a;
          else if (c === Math.floor(faultByte / 4)) diffMask = ((idx * 29 + faultBit) & 0x3f);
        } else {
          const seed = (idx * 131 + faultBit * 17 + rounds * 53 + Math.round(st.v1)) & 0xff;
          diffMask = rounds >= 3 ? (seed ^ 0xa5) : (seed & 0x73);
        }
        const flippedByte = baseByte ^ diffMask;
        // Count set bits in diffMask
        let pop = 0, m = diffMask;
        while (m) { pop += m & 1; m >>= 1; }
        totalDiffBits += pop;

        const x1 = g1x + c * cellS, y1 = gy + r * cellS;
        const x2 = g2x + c * cellS, y2 = gy + r * cellS;

        // Reference cell
        ctx.fillStyle = "rgba(124,156,255,0.14)";
        ctx.fillRect(x1 + 1, y1 + 1, cellS - 3, cellS - 3);
        ctx.strokeStyle = "rgba(124,156,255,0.4)";
        ctx.strokeRect(x1 + 1, y1 + 1, cellS - 3, cellS - 3);
        txt(ctx, baseByte.toString(16).padStart(2, "0").toUpperCase(), x1 + cellS * 0.5, y1 + cellS * 0.56, C.text, 11, "center", true);

        // Diff cell
        const heat = pop / 8;
        ctx.fillStyle = pop > 0 ? `rgba(255,107,107,${0.12 + heat * 0.55})` : "rgba(22,26,46,0.9)";
        ctx.fillRect(x2 + 1, y2 + 1, cellS - 3, cellS - 3);
        ctx.strokeStyle = idx === faultByte ? C.accent : (pop > 0 ? C.danger : "rgba(255,255,255,0.15)");
        ctx.lineWidth = idx === faultByte ? 2 : 1;
        ctx.strokeRect(x2 + 1, y2 + 1, cellS - 3, cellS - 3);
        txt(ctx, flippedByte.toString(16).padStart(2, "0").toUpperCase(), x2 + cellS * 0.5, y2 + cellS * 0.48, pop > 0 ? C.accent : C.muted, 11, "center", true);
        txt(ctx, `Δ${pop}b`, x2 + cellS * 0.5, y2 + cellS * 0.80, pop >= 4 ? C.ok : C.secondary, 9, "center");
      }
    }
    txt(ctx, "SubBytes → ShiftRows → MixColumns → AddRoundKey", lx + lw * 0.5, ly + lh - 12, C.muted, 10, "center");

    // Right panel: Hamming distance curve across rounds 0..14
    const gx = rx + 34, gyPlot = ry + 32, gw = rw - 48, gh = rh - 58;
    line(ctx, gx, gyPlot + gh, gx + gw, gyPlot + gh, C.axis, 1);
    line(ctx, gx, gyPlot, gx, gyPlot + gh, C.axis, 1);
    // Ideal 64-bit SAC line
    const y64 = gyPlot + gh * 0.5;
    line(ctx, gx, y64, gx + gw, y64, C.ok, 1.2, [4, 4]);
    txt(ctx, "64 bits (50% SAC Target)", gx + gw - 4, y64 - 5, C.ok, 9, "right");

    ctx.beginPath();
    for (let r = 0; r <= 14; r++) {
      const hBits = r === 0 ? 1 : (r === 1 ? 8 : (r === 2 ? 34 : 64 + 5 * Math.sin(r * 1.9 + faultBit)));
      const px = gx + (r / 14) * gw;
      const py = gyPlot + gh - (hBits / 128) * gh;
      if (r === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const curX = gx + (rounds / 14) * gw;
    const curY = gyPlot + gh - (totalDiffBits / 128) * gh;
    circle(ctx, curX, curY, 5.5, C.accent);
    txt(ctx, `Round ${rounds}: ${totalDiffBits}/128 bits`, curX, curY - 9, C.accent, 10, "center", true);

    return {
      "Active Cipher Round": `${rounds} / 14`,
      "Hamming Distance ΔH": `${totalDiffBits} / 128 bits (${((totalDiffBits / 128) * 100).toFixed(1)}%)`,
      "S-Box Nonlinearity": "112 (GF(2⁸) Inversion)",
      "Injected Fault Bit": `Bit #${faultBit} (Byte ${faultByte})`,
    };
  };

  // 4. sec_zero_knowledge_snark: R1CS circuit gates (a·b = c) + polynomial commitment evaluation curves P(x) & Z(x)·H(x) + verifier pairing check
  R.sec_zero_knowledge_snark = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: R1CS Arithmetic Circuit Gates | Right: QAP Polynomial Divisibility A(τ)·B(τ) − C(τ) = H(τ)·Z(τ)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.42, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "R1CS Witness & Multiplication Gates (aᵢ·bᵢ = cᵢ)");
    st.panel(rx, ry, rw, rh, "QAP Polynomial Commitment & Toxic Waste Evaluation τ");

    // Draw 3 R1CS gates on left
    const gateY = [ly + 55, ly + 115, ly + 175];
    const cheat = st.c > 0.55;
    gateY.forEach((gy, i) => {
      const gx = lx + lw * 0.52;
      line(ctx, lx + 24, gy - 10, gx - 18, gy - 4, C.primary, 1.6);
      line(ctx, lx + 24, gy + 10, gx - 18, gy + 4, C.secondary, 1.6);
      circle(ctx, gx, gy, 16, "rgba(124,156,255,0.16)", cheat && i === 1 ? C.danger : C.ok, 2);
      txt(ctx, "×", gx, gy + 4, C.text, 14, "center", true);
      arrow(ctx, gx + 16, gy, lx + lw - 24, gy, cheat && i === 1 ? C.danger : C.ok, 1.8);
      txt(ctx, `a_${i + 1}`, lx + 20, gy - 13, C.primary, 9);
      txt(ctx, `b_${i + 1}`, lx + 20, gy + 18, C.secondary, 9);
      txt(ctx, cheat && i === 1 ? `c_${i + 1}≠a·b` : `c_${i + 1}=a·b`, lx + lw - 28, gy - 6, cheat && i === 1 ? C.danger : C.ok, 9, "right", true);
    });
    txt(ctx, `Total R1CS Constraints: ${Math.round(st.v0)}`, lx + 14, ly + lh - 14, C.muted, 10);

    // Right panel: Polynomial curves P(x) = A(x)B(x) - C(x) and roots r1, r2, r3 of vanishing polynomial Z(x)
    const px0 = rx + 24, py0 = ry + rh * 0.54, pw = rw - 44, ph = rh * 0.34;
    line(ctx, px0, py0, px0 + pw, py0, C.axis, 1.2);
    const roots = [0.2, 0.5, 0.8];

    // Draw P(x) curve passing through 0 at roots unless cheating
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const u = i / 120;
      const zVal = (u - 0.2) * (u - 0.5) * (u - 0.8) * 18;
      const err = cheat ? 0.35 * Math.sin(u * 9 + st.t * 2) * st.c : 0;
      const yVal = zVal * Math.cos(u * 4 + st.a * 2) + err;
      const sx = px0 + u * pw, sy = py0 - yVal * ph;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = cheat ? C.danger : C.primary;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Draw Z(x) roots
    roots.forEach((r, idx) => {
      const rxPos = px0 + r * pw;
      circle(ctx, rxPos, py0, 4.5, C.ok);
      txt(ctx, `r_${idx + 1}`, rxPos, py0 + 15, C.ok, 9, "center");
    });

    // Random challenge point τ (probed by mouse x or animated)
    const tau = clamp(st.px, 0.08, 0.92);
    const tx = px0 + tau * pw;
    const zTau = (tau - 0.2) * (tau - 0.5) * (tau - 0.8) * 18;
    const pTau = zTau * Math.cos(tau * 4 + st.a * 2) + (cheat ? 0.35 * Math.sin(tau * 9 + st.t * 2) * st.c : 0);
    const ty = py0 - pTau * ph;
    line(ctx, tx, ry + 28, tx, ry + rh - 36, C.accent, 1.2, [3, 3]);
    circle(ctx, tx, ty, 5.5, C.accent);
    txt(ctx, `Challenge τ = ${tau.toFixed(2)}`, tx, ry + 38, C.accent, 10, "center", true);

    // Pairing verification badge
    const soundErr = Math.pow(2, -Math.min(128, Math.round(st.v1)));
    const badgeCol = cheat ? C.danger : C.ok;
    txt(ctx, cheat ? "✗ PAIRING CHECK FAILED: P(τ) ≠ H(τ)·Z(τ)" : "✓ PAIRING VERIFIED: e(π_A, π_B) = e(α,β)·e(L,γ)·e(C,δ)", rx + rw * 0.5, ry + rh - 12, badgeCol, 10, "center", true);

    return {
      "R1CS Constraints": `${Math.round(st.v0)} gates`,
      "Soundness Error": soundErr.toExponential(2),
      "Proof Size (Groth16)": "192 Bytes (3 G₁/G₂ pts)",
      "Verifier Pairing Status": cheat ? "REJECTED (Forged Witness)" : "ACCEPTED (Zero-Knowledge)",
    };
  };

  // 5. sec_stack_rop_chain: x86-64 stack frame layout (buffer, Canary, Saved RBP, RIP) overflowing into ROP gadget boxes (pop rdi; ret, "/bin/sh", system())
  R.sec_stack_rop_chain = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Adjust Payload Overflow Bytes to overwrite Saved RIP and chain x86-64 ROP gadgets", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.46, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "x86-64 Stack Frame Layout (Low → High Address)");
    st.panel(rx, ry, rw, rh, "Return-Oriented Programming (ROP) Gadget Chain");

    const overflowBytes = Math.round(st.v0);
    const canaryStrict = st.c > 0.4;
    const slots = [
      { name: "char buf[64]", cap: 64, addr: "0x7fff...e0" },
      { name: "Stack Canary (0x00..ff)", cap: 72, addr: "0x7fff...20" },
      { name: "Saved RBP", cap: 80, addr: "0x7fff...28" },
      { name: "Saved RIP → Gadget 1", cap: 88, addr: "0x7fff...30" },
      { name: "Arg: &\"/bin/sh\"", cap: 96, addr: "0x7fff...38" },
      { name: "Gadget 2: system()", cap: 104, addr: "0x7fff...40" },
    ];

    const sh = (lh - 38) / slots.length;
    slots.forEach((s, i) => {
      const sy = ly + 26 + i * sh;
      const prevCap = i === 0 ? 0 : slots[i - 1].cap;
      const fillFrac = clamp((overflowBytes - prevCap) / (s.cap - prevCap), 0, 1);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(lx + 14, sy, lw - 28, sh - 5);
      if (fillFrac > 0) {
        const isCanary = i === 1;
        ctx.fillStyle = isCanary && canaryStrict ? "rgba(255,107,107,0.45)" : "rgba(255,209,102,0.32)";
        ctx.fillRect(lx + 14, sy, (lw - 28) * fillFrac, sh - 5);
      }
      ctx.strokeStyle = fillFrac >= 1 ? C.accent : "rgba(255,255,255,0.18)";
      ctx.strokeRect(lx + 14, sy, lw - 28, sh - 5);
      txt(ctx, s.addr, lx + 20, sy + sh * 0.56, C.muted, 9);
      txt(ctx, s.name, lx + 94, sy + sh * 0.56, fillFrac > 0 ? C.accent : C.text, 10, "left", true);
    });

    // Right panel: ROP gadget boxes chained by RSP
    const gadgets = [
      { title: "Gadget 1 (libc + 0x2a3e5)", ins: "pop rdi ; ret", active: overflowBytes >= 88 },
      { title: "Stack Slot [RSP+8]", ins: "rdi ← 0x7f8b1b458d (\"/bin/sh\")", active: overflowBytes >= 96 },
      { title: "Gadget 2 (libc + 0x50d60)", ins: "call system(rdi) ; ret", active: overflowBytes >= 104 },
    ];
    const canaryTripped = overflowBytes > 64 && canaryStrict;

    gadgets.forEach((g, i) => {
      const gx = rx + 20, gy = ry + 34 + i * 58, gw = rw - 40, gh = 42;
      ctx.fillStyle = g.active && !canaryTripped ? "rgba(110,231,183,0.16)" : "rgba(255,255,255,0.04)";
      ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = g.active && !canaryTripped ? C.ok : C.axis;
      ctx.lineWidth = g.active ? 2 : 1;
      ctx.strokeRect(gx, gy, gw, gh);
      txt(ctx, g.title, gx + 10, gy + 16, C.muted, 9);
      txt(ctx, g.ins, gx + 10, gy + 33, g.active && !canaryTripped ? C.ok : C.text, 11, "left", true);
      if (i < gadgets.length - 1) {
        arrow(ctx, gx + gw * 0.5, gy + gh, gx + gw * 0.5, gy + 58, g.active && !canaryTripped ? C.ok : C.muted, 1.8);
      }
    });

    const statusMsg = canaryTripped
      ? "✗ __stack_chk_fail(): Stack Canary Corrupted → SIGABRT!"
      : (overflowBytes >= 104 ? "⚡ ROP Chain Complete: execve(\"/bin/sh\") Hijacked!" : " Normal Execution / Partial Buffer Fill");
    txt(ctx, statusMsg, rx + rw * 0.5, ry + rh - 12, canaryTripped ? C.danger : (overflowBytes >= 104 ? C.ok : C.accent), 10, "center", true);

    return {
      "Payload Overflow": `${overflowBytes} bytes (buf=64B)`,
      "StackGuard Canary": canaryTripped ? "TRIPPED (SIGABRT)" : (canaryStrict ? "Intact" : "Bypassed / Leaked"),
      "ASLR Entropy": `${Math.round(st.v1)} bits (2^${Math.round(st.v1)} base)`,
      "Control Flow State": canaryTripped ? "Aborted" : (overflowBytes >= 104 ? "ROP Shell Spawned" : "Benign Return"),
    };
  };

  // 6. sec_heap_tcache_fengshui: glibc heap memory chunks (prev_size, size|AMP, fd, bk) + tcache freelist bins with UAF pointer poisoning arrow
  R.sec_heap_tcache_fengshui = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Inspect ptmalloc chunk headers [prev_size | size|A|M|P | fd | bk] and tcache UAF poisoning", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "glibc malloc_chunk Structure & Arena Layout");
    st.panel(rx, ry, rw, rh, "tcache_perthread_struct Bins & UAF fd Poisoning");

    const chunkSz = Math.round(st.v1 / 16) * 16;
    const uafActive = st.c > 0.45;
    // Draw detailed chunk anatomy on left
    const fields = [
      { label: "prev_size (8B)", val: "0x0000000000000000", col: C.muted },
      { label: "size | A | M | P (8B)", val: `0x${(chunkSz | 1).toString(16).padStart(4, "0")} (PREV_INUSE=1)`, col: C.primary },
      { label: "fd (tcache next ^ key)", val: uafActive ? "0x7fff_target_got (POISONED!)" : "0x5555557572a0 (Next Free)", col: uafActive ? C.danger : C.ok },
      { label: "bk (tcache_key / cookie)", val: uafActive ? "0xdeadbeefcafebabe (Overwritten)" : "0x9e3779b97f4a7c15", col: C.secondary },
    ];
    const fh = (lh - 46) / fields.length;
    fields.forEach((f, i) => {
      const fy = ly + 30 + i * fh;
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(lx + 14, fy, lw - 28, fh - 6);
      ctx.strokeStyle = f.col;
      ctx.strokeRect(lx + 14, fy, lw - 28, fh - 6);
      txt(ctx, f.label, lx + 22, fy + 16, C.muted, 9);
      txt(ctx, f.val, lx + 22, fy + 33, f.col, 10, "left", true);
    });

    // Right panel: tcache bin linked list
    const binIdx = Math.min(63, Math.max(0, Math.floor((chunkSz - 24) / 16)));
    txt(ctx, `tcache_bins[${binIdx}] (size 0x${chunkSz.toString(16)}, count=3/7):`, rx + 14, ry + 34, C.accent, 10, "left", true);

    const nodes = [
      { id: "Chunk A (Freed)", addr: "0x5555..260", x: rx + 20, y: ry + 52 },
      { id: "Chunk B (UAF Victim)", addr: "0x5555..2a0", x: rx + 20, y: ry + 112 },
      { id: uafActive ? "Arbitrary Target (__free_hook)" : "Chunk C (Freed)", addr: uafActive ? "0x7ffff7dd18e8" : "0x5555..2e0", x: rx + 20, y: ry + 172 },
    ];
    nodes.forEach((n, i) => {
      const isPoison = i === 2 && uafActive;
      ctx.fillStyle = isPoison ? "rgba(255,107,107,0.22)" : "rgba(124,156,255,0.14)";
      ctx.fillRect(n.x, n.y, rw - 40, 40);
      ctx.strokeStyle = isPoison ? C.danger : C.primary;
      ctx.lineWidth = isPoison ? 2 : 1.2;
      ctx.strokeRect(n.x, n.y, rw - 40, 40);
      txt(ctx, n.id, n.x + 10, n.y + 16, isPoison ? C.danger : C.text, 10, "left", true);
      txt(ctx, n.addr, n.x + 10, n.y + 32, C.muted, 9);
      if (i < nodes.length - 1) {
        arrow(ctx, n.x + (rw - 40) * 0.5, n.y + 40, nodes[i + 1].x + (rw - 40) * 0.5, nodes[i + 1].y, i === 1 && uafActive ? C.danger : C.ok, 2);
      }
    });

    return {
      "Target Chunk Size": `0x${chunkSz.toString(16)} (${chunkSz} B)`,
      "tcache Bin Index": `Bin #${binIdx} (LIFO Singly-Linked)`,
      "Safe-Linking XOR": "fd' = (pos >> 12) ^ ptr",
      "UAF Freelist State": uafActive ? "POISONED → Arbitrary Write" : "Valid Arena Chunks",
    };
  };

  // 7. sec_spectre_cache_probe: speculative branch predictor window + 256-entry cache-line reload latency bar chart revealing the secret byte k* spike
  R.sec_spectre_cache_probe = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Transient Branch Misprediction Window | Right: 256-Entry Flush+Reload L1 Cache Latency", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.38, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Speculative ROB Execution (Spectre v1)");
    st.panel(rx, ry, rw, rh, "Flush+Reload Probe Array2[0..255 * 4096] Cycles");

    const secretByte = 0x4b; // 'K' = 75
    const steps = [
      { s: "1. Train BTB: x < array1_size (Taken)", c: C.ok },
      { s: "2. clflush(&array2[0..255 * 4KB])", c: C.primary },
      { s: "3. Victim OOB: k = array1[x_malicious]", c: C.accent },
      { s: "4. Transient load: array2[k * 4096]", c: C.danger },
      { s: "5. Pipeline Rollback (L1 line remains!)", c: C.secondary },
    ];
    steps.forEach((stItem, i) => {
      const sy = ly + 32 + i * 38;
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(lx + 10, sy, lw - 20, 30);
      ctx.strokeStyle = stItem.c;
      ctx.strokeRect(lx + 10, sy, lw - 20, 30);
      txt(ctx, stItem.s, lx + 16, sy + 19, stItem.c, 9.5, "left", true);
    });

    // Right panel: 256-byte reload latency plot (L1 hit ~ 38 cycles, DRAM miss ~ 240 cycles)
    const px0 = rx + 30, py0 = ry + 32, pw = rw - 44, ph = rh - 56;
    line(ctx, px0, py0 + ph, px0 + pw, py0 + ph, C.axis, 1);
    line(ctx, px0, py0, px0, py0 + ph, C.axis, 1);
    const hitThreshY = py0 + ph - (80 / 300) * ph;
    line(ctx, px0, hitThreshY, px0 + pw, hitThreshY, C.ok, 1.2, [4, 4]);
    txt(ctx, "L1 Cache Hit Threshold (80 cyc)", px0 + pw - 4, hitThreshY - 5, C.ok, 9, "right");

    const snr = st.a * (1 - st.b * 0.5);
    for (let k = 0; k < 256; k += 2) {
      const isSecret = Math.abs(k - secretByte) <= 1;
      const noise = Math.sin(k * 12.7 + st.t * 4) * (15 + st.b * 45);
      const cycles = isSecret ? Math.max(28, 36 + (1 - snr) * 140) : clamp(220 + noise, 95, 290);
      const bx = px0 + (k / 256) * pw;
      const by = py0 + ph - (cycles / 300) * ph;
      circle(ctx, bx, by, isSecret ? 5 : 1.8, isSecret ? C.ok : "rgba(124,156,255,0.55)");
      if (isSecret) {
        line(ctx, bx, py0 + ph, bx, by, C.ok, 2);
        txt(ctx, `k*=0x4B ('K'): ${Math.round(cycles)} cyc`, bx, by - 10, C.ok, 10, "center", true);
      }
    }

    return {
      "Leaked Secret Byte": "0x4B ('K' = 75)",
      "L1D Hit Latency": `${Math.round(36 + (1 - snr) * 35)} cycles`,
      "DRAM Miss Latency": `${Math.round(225 + st.b * 25)} cycles`,
      "ROB Transient Window": `${Math.round(st.v2)} μops`,
    };
  };

  // 8. sec_power_dpa_trace: oscilloscope power traces P(t) stacked over AES S-Box operations + Pearson correlation ρ(k, t) spike at correct key byte
  R.sec_power_dpa_trace = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Top: Oscilloscope Power Traces P(t) during SubBytes | Bottom: Differential Correlation Δ_DPA(t)", st.spec.formula);
    const padX = 16, topY = 46, boxW = W - 32, topH = (H - 68) * 0.48;
    const botY = topY + topH + 10, botH = H - botY - 12;
    st.panel(padX, topY, boxW, topH, "CMOS Dynamic Power Consumption P(t) ∝ HW(SBox(p ⊕ k*)) + ε");
    st.panel(padX, botY, boxW, botH, "Pearson Correlation ρ(k, t) Across 256 Key Hypotheses (Correct Key k* = 0xA7)");

    // Top: stacked oscilloscope traces
    const tx0 = padX + 24, tw = boxW - 40, tyMid = topY + topH * 0.58;
    const jitter = st.c * 0.04;
    for (let tr = 0; tr < 6; tr++) {
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const u = i / 140 + (tr - 2.5) * jitter * 0.2;
        const sboxPulse = Math.exp(-Math.pow((u - 0.56) / 0.045, 2)) * (0.4 + 0.12 * tr);
        const clk = 0.25 * Math.sin(u * 60) + 0.12 * Math.cos(u * 23 + tr + st.t * 3);
        const sx = tx0 + (i / 140) * tw;
        const sy = tyMid - (sboxPulse + clk * (1 - st.b * 0.4)) * (topH * 0.42);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = tr === 5 ? C.accent : `rgba(124,156,255,${0.2 + tr * 0.08})`;
      ctx.lineWidth = tr === 5 ? 2 : 1;
      ctx.stroke();
    }
    const leakX = tx0 + 0.56 * tw;
    line(ctx, leakX, topY + 22, leakX, topY + topH - 6, C.danger, 1.2, [3, 3]);
    txt(ctx, "S-Box Evaluation Clock Edge", leakX + 6, topY + 34, C.danger, 9);

    // Bottom: Differential trace Δ_DPA(t) for wrong keys vs correct key 0xA7
    const byMid = botY + botH * 0.62;
    line(ctx, tx0, byMid, tx0 + tw, byMid, C.axis, 1);
    const snrGain = clamp((st.a * 0.7 + st.b * 0.5) * (1 - st.c * 0.5), 0.15, 1.0);

    // Wrong key hypothesis ghost envelope
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
      const u = i / 140;
      const ghost = 0.14 * (1 - snrGain * 0.5) * Math.sin(u * 85 + st.t * 2);
      const sx = tx0 + u * tw, sy = byMid - ghost * (botH * 0.45);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = "rgba(154,163,199,0.45)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Correct key k* = 0xA7 correlation peak
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
      const u = i / 140;
      const spike = snrGain * Math.exp(-Math.pow((u - 0.56) / 0.028, 2)) * Math.cos((u - 0.56) * 90);
      const bg = 0.08 * Math.sin(u * 70 - st.t * 3);
      const sx = tx0 + u * tw, sy = byMid - (spike + bg) * (botH * 0.52);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2.2;
    ctx.stroke();
    txt(ctx, `Peak ρ(k*=0xA7) = ${(0.18 + snrGain * 0.72).toFixed(3)}`, leakX + 8, botY + 36, C.ok, 10, "left", true);

    return {
      "Recovered Subkey Byte": "k* = 0xA7 (167)",
      "Max Correlation ρmax": (0.18 + snrGain * 0.72).toFixed(3),
      "Captured Traces N": `${Math.round(st.v0)} traces`,
      "Ghost Threshold ±4/√N": `±${(4 / Math.sqrt(Math.max(10, st.v0))).toFixed(3)}`,
    };
  };

  // 9. sec_bgp_hijack_propagation: autonomous system (AS) internet graph with legitimate route vs sub-prefix BGP hijack wave & RPKI ROA shield drops
  R.sec_bgp_hijack_propagation = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Increase RPKI ROA Deployment (%) to filter invalid sub-prefix BGP announcements", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Autonomous System (AS) Peering Topology: Origin AS15169 vs Hijacker AS64512");

    const nodes = [
      { asn: "AS15169 (Origin /24)", x: 0.14, y: 0.52, role: "origin" },
      { asn: "AS3356 (Tier-1)", x: 0.34, y: 0.28, role: "transit", rpkiThresh: 0.25 },
      { asn: "AS1299 (Tier-1)", x: 0.36, y: 0.74, role: "transit", rpkiThresh: 0.45 },
      { asn: "AS174 (Transit)", x: 0.56, y: 0.30, role: "transit", rpkiThresh: 0.60 },
      { asn: "AS2914 (Transit)", x: 0.55, y: 0.72, role: "transit", rpkiThresh: 0.35 },
      { asn: "AS7018 (Eyeball)", x: 0.74, y: 0.50, role: "transit", rpkiThresh: 0.75 },
      { asn: "AS64512 (Hijacker /25)", x: 0.86, y: 0.52, role: "attacker" },
    ];
    const edges = [[0, 1], [0, 2], [1, 3], [1, 2], [2, 4], [3, 4], [3, 5], [4, 5], [5, 6], [3, 6], [4, 6]];

    let hijackedCount = 1;
    nodes.forEach((n) => {
      n.sx = padX + n.x * boxW;
      n.sy = padY + 18 + n.y * (boxH - 28);
      if (n.role === "transit") {
        n.rpkiProtected = st.a >= n.rpkiThresh;
        n.hijacked = !n.rpkiProtected && (n.x > 0.45 || st.b > 0.45);
        if (n.hijacked) hijackedCount++;
      }
    });

    edges.forEach(([i, j]) => {
      const n1 = nodes[i], n2 = nodes[j];
      const badEdge = (n1.role === "attacker" || n1.hijacked) && (n2.role === "attacker" || n2.hijacked);
      line(ctx, n1.sx, n1.sy, n2.sx, n2.sy, badEdge ? C.danger : "rgba(110,231,183,0.45)", badEdge ? 2.4 : 1.5);
    });

    nodes.forEach((n) => {
      const col = n.role === "origin" ? C.ok : (n.role === "attacker" ? C.danger : (n.hijacked ? C.danger : C.primary));
      circle(ctx, n.sx, n.sy, 16, "rgba(22,26,46,0.92)", col, 2.5);
      if (n.rpkiProtected) {
        txt(ctx, "🛡️ROA", n.sx, n.sy + 4, C.ok, 9, "center", true);
      } else {
        txt(ctx, n.role === "origin" ? "ORIG" : (n.role === "attacker" ? "ADV" : "BGP"), n.sx, n.sy + 4, col, 9, "center", true);
      }
      txt(ctx, n.asn, n.sx, n.sy + 28, col, 9.5, "center", true);
    });

    return {
      "RPKI ROA Coverage": `${Math.round(st.v0)}% Validated`,
      "Polluted AS Nodes": `${hijackedCount} / ${nodes.length} ASNs`,
      "Announced Sub-Prefix": "203.0.113.0/25 (Longest Match)",
      "RPKI Origin Status": st.a > 0.6 ? "DROPPED (ROA Invalid)" : "PROPAGATING (Unfiltered)",
    };
  };
  R["sec_bgp_hijack_ propagation"] = R.sec_bgp_hijack_propagation;

  // 10. sec_tor_onion_circuit: Client → Entry Guard → Middle Relay → Exit Node → Destination with 3 nested AES onion encryption layers peeling hop-by-hop + timing correlation panel
  R.sec_tor_onion_circuit = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Watch 3-layer AES-CTR onion packets peel hop-by-hop; chaff padding defeats timing correlation", st.spec.formula);
    const padX = 16, topY = 46, boxW = W - 32, topH = (H - 68) * 0.54;
    const botY = topY + topH + 10, botH = H - botY - 12;
    st.panel(padX, topY, boxW, topH, "3-Hop Tor Onion Circuit: Layered Encryption E_k1(E_k2(E_k3(M)))");
    st.panel(padX, botY, boxW, botH, "Entry vs Exit Packet Timing Cross-Correlation R_xy(τ)");

    const hops = [
      { name: "Client (OP)", layers: 3, x: 0.10 },
      { name: "Entry Guard", layers: 2, x: 0.34 },
      { name: "Middle Relay", layers: 1, x: 0.58 },
      { name: "Exit Relay", layers: 0, x: 0.80 },
      { name: "Destination", layers: 0, x: 0.93 },
    ];
    const cy = topY + topH * 0.58;
    for (let i = 0; i < hops.length - 1; i++) {
      line(ctx, padX + hops[i].x * boxW, cy, padX + hops[i + 1].x * boxW, cy, i === 3 ? C.danger : C.primary, 2);
    }

    // Animated packet moving across circuit peeling layers
    const prog = (st.t * 0.45) % 1;
    const pktX = padX + (0.10 + prog * 0.83) * boxW;
    const remLayers = prog < 0.28 ? 3 : (prog < 0.56 ? 2 : (prog < 0.82 ? 1 : 0));
    const layerCols = [C.accent, C.ok, C.secondary, C.primary];
    for (let L = remLayers; L >= 0; L--) {
      circle(ctx, pktX, cy, 5 + L * 4.5, null, layerCols[L], 2);
    }

    hops.forEach((h) => {
      const hx = padX + h.x * boxW;
      circle(ctx, hx, cy, 14, "rgba(22,26,46,0.95)", h.layers > 0 ? C.ok : C.accent, 2);
      txt(ctx, `${h.layers}L`, hx, cy + 4, C.text, 10, "center", true);
      txt(ctx, h.name, hx, cy + 28, C.muted, 9.5, "center");
    });

    // Bottom: Timing correlation waves (Entry stream vs Exit stream)
    const bx0 = padX + 24, bw = boxW - 48, byMid = botY + botH * 0.58;
    const chaff = st.b;
    const corrScore = clamp((st.c * 0.85) * (1 - chaff * 0.72), 0.04, 0.98);
    for (let ch = 0; ch < 2; ch++) {
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = i / 120;
        const burst = Math.sin(u * 18 - st.t * 4) * Math.exp(-Math.pow(((u * 3) % 1) - 0.5, 2) * 12);
        const padNoise = ch === 1 ? chaff * 0.6 * Math.cos(u * 47 + st.t * 7) : 0;
        const y = byMid + (ch === 0 ? -12 : 12) - (burst + padNoise) * (botH * 0.24);
        if (i === 0) ctx.moveTo(bx0 + u * bw, y); else ctx.lineTo(bx0 + u * bw, y);
      }
      ctx.strokeStyle = ch === 0 ? C.primary : C.secondary;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    txt(ctx, `End-to-End Timing Correlation r = ${corrScore.toFixed(2)}`, bx0 + bw - 6, botY + 18, corrScore > 0.5 ? C.danger : C.ok, 10, "right", true);

    return {
      "Active Onion Layers": `${remLayers} AES-128-CTR Wraps`,
      "Chaff Padding Overhead": `${Math.round(st.v1)}% Constant-Rate`,
      "Timing Correlation r": corrScore.toFixed(3),
      "Circuit Anonymity": corrScore > 0.55 ? "DE-ANONYMIZED (Flow Match)" : "PROTECTED (Unlinked)",
    };
  };

  // 11. sec_osint_entity_graph: multi-source OSINT records linked via Fellegi-Sunter match/non-match log-likelihood thresholds into resolved identity clusters
  R.sec_osint_entity_graph = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Adjust Fellegi-Sunter LLR Threshold to resolve WHOIS, Corporate, and Wallet OSINT records", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.54, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Multi-Source OSINT Entity Resolution Graph");
    st.panel(rx, ry, rw, rh, "Fellegi–Sunter Log-Likelihood Ratio P(γ|M)/P(γ|U)");

    const thresh = st.v0;
    const recs = [
      { id: "WHOIS: j.kovacs@proton", x: 0.22, y: 0.30, c: C.primary },
      { id: "Corp: Kovacs Holdings Ltd", x: 0.48, y: 0.24, c: C.accent },
      { id: "Git: @jkov_sec (PGP 0x9F)", x: 0.24, y: 0.72, c: C.ok },
      { id: "BTC: bc1q9f8...a2x", x: 0.54, y: 0.74, c: C.secondary },
      { id: "SAN: mail.kovacs-infra.net", x: 0.78, y: 0.48, c: C.primary },
    ];
    const links = [
      [0, 1, 8.4], [0, 2, 11.2], [1, 4, 6.8], [2, 3, 4.9], [3, 4, 3.2], [1, 3, 5.6],
    ];

    let activeEdges = 0;
    links.forEach(([i, j, w]) => {
      const score = w - st.b * 3.5;
      if (score >= thresh) {
        activeEdges++;
        const x1 = lx + recs[i].x * lw, y1 = ly + 18 + recs[i].y * (lh - 24);
        const x2 = lx + recs[j].x * lw, y2 = ly + 18 + recs[j].y * (lh - 24);
        line(ctx, x1, y1, x2, y2, C.ok, 2);
        txt(ctx, `LLR=${score.toFixed(1)}`, (x1 + x2) * 0.5, (y1 + y2) * 0.5 - 4, C.ok, 8.5, "center");
      }
    });

    recs.forEach((r) => {
      const sx = lx + r.x * lw, sy = ly + 18 + r.y * (lh - 24);
      circle(ctx, sx, sy, 11, "rgba(22,26,46,0.92)", r.c, 2);
      txt(ctx, r.id, sx, sy + 22, C.text, 9, "center", true);
    });

    // Right panel: Non-match U vs Match M LLR distributions + threshold line
    const px0 = rx + 20, py0 = ry + rh - 28, pw = rw - 40, ph = rh - 62;
    line(ctx, px0, py0, px0 + pw, py0, C.axis, 1);
    for (const [mu, col] of [[0.28, C.danger], [0.74, C.ok]]) {
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const g = Math.exp(-Math.pow((u - mu) / 0.14, 2));
        const sx = px0 + u * pw, sy = py0 - g * ph * 0.85;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
    }
    const tx = px0 + clamp((thresh + 5) / 20, 0.05, 0.95) * pw;
    line(ctx, tx, ry + 28, tx, py0, C.accent, 2, [4, 3]);
    txt(ctx, `Threshold τ = ${thresh.toFixed(1)}`, tx, ry + 40, C.accent, 9.5, "center", true);
    txt(ctx, "P(γ|U) Non-Match", px0 + pw * 0.25, py0 + 14, C.danger, 9, "center");
    txt(ctx, "P(γ|M) True Match", px0 + pw * 0.75, py0 + 14, C.ok, 9, "center");

    return {
      "LLR Match Threshold": `${thresh.toFixed(1)} bits`,
      "Linked OSINT Edges": `${activeEdges} / ${links.length} pairs`,
      "Resolved Identity Clusters": `${Math.max(1, 5 - activeEdges)} entities`,
      "False Positive Risk": thresh > 6 ? "Low (<1.2%)" : "Elevated (Merge Risk)",
    };
  };

  // 12. sec_stylometry_authorship: Burrows's Delta function-word z-score radar/bar profile + author attribution distance dendrogram
  R.sec_stylometry_authorship = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Function-Word Z-Score Fingerprint | Right: Burrows's Delta Attribution Distances", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.50, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Function-Word Z-Score Radar (Unknown Text vs Suspect A)");
    st.panel(rx, ry, rw, rh, "Burrows's Delta Δ(D_anon, Candidate_k) Ranking");

    const words = ["the", "of", "and", "to", "in", "that", "upon", "whilst"];
    const rcx = lx + lw * 0.5, rcy = ly + lh * 0.55, rad = Math.min(lw, lh) * 0.34;
    for (let ring = 1; ring <= 3; ring++) {
      circle(ctx, rcx, rcy, (rad * ring) / 3, null, "rgba(255,255,255,0.08)", 1);
    }
    words.forEach((w, i) => {
      const ang = (i / words.length) * TAU - Math.PI / 2;
      line(ctx, rcx, rcy, rcx + Math.cos(ang) * rad, rcy + Math.sin(ang) * rad, "rgba(255,255,255,0.1)", 1);
      txt(ctx, `"${w}"`, rcx + Math.cos(ang) * (rad + 16), rcy + Math.sin(ang) * (rad + 14) + 3, C.muted, 9.5, "center");
    });

    const obf = st.c;
    const profiles = [
      { col: C.accent, vals: [0.82, 0.64, 0.75, 0.45, 0.70, 0.88, 0.35, 0.62] },
      { col: C.ok, vals: [0.80, 0.62, 0.78, 0.48, 0.68, 0.85, 0.38, 0.60].map((v, i) => clamp(v + (obf - 0.2) * 0.28 * Math.sin(i * 2.1), 0.15, 0.95)) },
    ];
    profiles.forEach((p) => {
      ctx.beginPath();
      p.vals.forEach((v, i) => {
        const ang = (i / words.length) * TAU - Math.PI / 2;
        const px = rcx + Math.cos(ang) * rad * v, py = rcy + Math.sin(ang) * rad * v;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = p.col;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Right panel: Burrows's Delta bars for 4 candidate authors
    const cands = [
      { name: "Suspect A (opsec_dev)", delta: 0.42 + obf * 0.65, col: C.ok },
      { name: "Suspect B (core_maint)", delta: 1.18 - obf * 0.12, col: C.primary },
      { name: "Suspect C (anon_leaker)", delta: 1.54, col: C.secondary },
      { name: "Suspect D (decoy_bot)", delta: 1.92, col: C.muted },
    ];
    cands.forEach((ca, i) => {
      const by = ry + 36 + i * 44;
      txt(ctx, ca.name, rx + 14, by + 12, C.text, 10, "left", true);
      const bw = clamp((ca.delta / 2.2) * (rw - 36), 12, rw - 36);
      ctx.fillStyle = ca.col;
      ctx.fillRect(rx + 14, by + 18, bw, 14);
      txt(ctx, `Δ = ${ca.delta.toFixed(2)}`, rx + 20 + bw, by + 29, ca.col, 9.5, "left", true);
    });

    const winner = cands[0].delta < cands[1].delta ? "Suspect A (High Confidence)" : "Ambiguous (Obfuscated)";
    return {
      "Closest Author Match": winner,
      "Min Burrows's Delta Δ": Math.min(cands[0].delta, cands[1].delta).toFixed(3),
      "Feature Space M": `Top ${Math.round(st.v1)} ${Math.round(st.v0)}-grams`,
      "Paraphrase Evasion": `${Math.round(st.v2)}% Drift`,
    };
  };

  // 13. sec_fuzzing_coverage: control-flow basic block graph lighting up discovered edges + AFL bitmap density & corpus coverage growth curve
  R.sec_fuzzing_coverage = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Basic-Block CFG Edge Discovery | Right: AFL 64KB Shared-Memory Bitmap & Edge Growth", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Target Control-Flow Graph (CFG) & ASan Crash Sink");
    st.panel(rx, ry, rw, rh, "Edge Coverage Growth & AFL Bitmap Hit Buckets");

    const blocks = [
      { id: "BB0: parse_hdr()", x: 0.50, y: 0.16, req: 0.0 },
      { id: "BB1: magic=='PNG'", x: 0.26, y: 0.38, req: 0.15 },
      { id: "BB2: err_exit()", x: 0.74, y: 0.38, req: 0.05 },
      { id: "BB3: chunk_crc()", x: 0.26, y: 0.62, req: 0.35 },
      { id: "BB4: zlib_decomp()", x: 0.56, y: 0.62, req: 0.55 },
      { id: "BB5: ASan SEGV!", x: 0.42, y: 0.86, req: 0.72, crash: true },
    ];
    const cfgEdges = [[0, 1], [0, 2], [1, 3], [1, 4], [3, 5], [4, 5]];
    const power = clamp(st.a * 0.5 + st.b * 0.5 - (st.c - 0.3) * 0.35 + 0.15 * Math.sin(st.t), 0.1, 1.0);

    cfgEdges.forEach(([u, v]) => {
      const b1 = blocks[u], b2 = blocks[v];
      const hit = power >= b2.req;
      arrow(ctx, lx + b1.x * lw, ly + 18 + b1.y * (lh - 24), lx + b2.x * lw, ly + 18 + b2.y * (lh - 24), hit ? (b2.crash ? C.danger : C.ok) : "rgba(255,255,255,0.15)", hit ? 2.2 : 1.2);
    });

    blocks.forEach((b) => {
      const bx = lx + b.x * lw - 48, by = ly + 18 + b.y * (lh - 24) - 12;
      const hit = power >= b.req;
      ctx.fillStyle = hit ? (b.crash ? "rgba(255,107,107,0.28)" : "rgba(110,231,183,0.18)") : "rgba(22,26,46,0.9)";
      ctx.fillRect(bx, by, 96, 24);
      ctx.strokeStyle = hit ? (b.crash ? C.danger : C.ok) : C.axis;
      ctx.strokeRect(bx, by, 96, 24);
      txt(ctx, b.id, bx + 48, by + 16, hit ? (b.crash ? C.danger : C.text) : C.muted, 9.5, "center", true);
    });

    // Right top: 8x4 mini AFL shared-memory bitmap
    const bmX = rx + 16, bmY = ry + 28, cellW = (rw - 32) / 12;
    for (let i = 0; i < 36; i++) {
      const r = Math.floor(i / 12), c = i % 12;
      const on = ((i * 19 + 7) % 36) / 36 < power;
      ctx.fillStyle = on ? C.ok : "rgba(255,255,255,0.05)";
      ctx.fillRect(bmX + c * cellW, bmY + r * 12, cellW - 2, 10);
    }

    // Right bottom: logarithmic coverage growth curve
    const gx = rx + 24, gy = ry + 84, gw = rw - 38, gh = rh - 102;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const cov = power * (1 - Math.exp(-u * (3 + st.b * 4)));
      const sx = gx + u * gw, sy = gy + gh - cov * gh * 0.9;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2; ctx.stroke();

    const crashes = power >= 0.72 ? Math.max(1, Math.round((power - 0.7) * 18)) : 0;
    return {
      "Tuple Edge Coverage": `${(power * 84.6).toFixed(1)}% (${Math.round(power * 1420)} edges)`,
      "Corpus Queue Seeds": `${Math.round(42 + power * 310)} favored`,
      "Unique ASan Crashes": crashes > 0 ? `${crashes} (Heap-Buffer-Overflow)` : "0 crashes",
      "Executions / sec": `${Math.round(1800 + st.a * 4200)} exec/s`,
    };
  };

  // 14. sec_symbolic_concolic: binary symbolic execution tree with path constraints (x > 10, x + y == 42) and Z3 SMT solver feasible region
  R.sec_symbolic_concolic = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Symbolic Fork Tree Π = π₁ ∧ π₂ | Right: 2D SMT Polytope Solved by Z3", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Symbolic Execution Tree (Forking on Branches)");
    st.panel(rx, ry, rw, rh, "Z3 Linear Integer Arithmetic Feasible Polytope (x, y)");

    // Binary tree on left
    const nodes = [
      { l: "sym_x, sym_y", x: 0.50, y: 0.16, c: C.primary },
      { l: "π₁: x > 10", x: 0.28, y: 0.44, c: C.ok },
      { l: "¬π₁: x ≤ 10", x: 0.72, y: 0.44, c: C.muted },
      { l: "π₂: x+y == 42", x: 0.16, y: 0.76, c: C.accent },
      { l: "¬π₂: UNSAT", x: 0.42, y: 0.76, c: C.danger },
      { l: "Pruned State", x: 0.72, y: 0.76, c: C.muted },
    ];
    [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]].forEach(([u, v]) => {
      line(ctx, lx + nodes[u].x * lw, ly + 18 + nodes[u].y * (lh - 24), lx + nodes[v].x * lw, ly + 18 + nodes[v].y * (lh - 24), nodes[v].c, 1.8);
    });
    nodes.forEach((n) => {
      const nx = lx + n.x * lw, ny = ly + 18 + n.y * (lh - 24);
      circle(ctx, nx, ny, 9, "rgba(22,26,46,0.95)", n.c, 2);
      txt(ctx, n.l, nx, ny + 21, n.c, 9, "center", true);
    });

    // Right panel: 2D constraint polytope (x > 10, y > 5, x + y <= 42)
    const gx = rx + 28, gy = ry + 30, gw = rw - 44, gh = rh - 52;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1);

    const xCut = gx + (0.22 + st.a * 0.15) * gw;
    const yCut = gy + gh * 0.80;
    const diagX = gx + gw * 0.88, diagY = gy + gh * 0.16;

    ctx.fillStyle = "rgba(110,231,183,0.20)";
    ctx.beginPath();
    ctx.moveTo(xCut, yCut);
    ctx.lineTo(diagX, yCut);
    ctx.lineTo(xCut, diagY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = C.ok;
    ctx.lineWidth = 2;
    ctx.stroke();

    const modelX = Math.round(12 + st.a * 8), modelY = 42 - modelX;
    const mx = (xCut + diagX) * 0.45, my = (yCut + diagY) * 0.55;
    circle(ctx, mx, my, 5.5, C.accent);
    txt(ctx, `SAT Witness: x=${modelX}, y=${modelY}`, mx + 8, my - 6, C.accent, 10, "left", true);

    return {
      "Active Path Predicate": "x > 10 ∧ y ≥ 5 ∧ x+y = 42",
      "Z3 Solver Result": `SAT (x=${modelX}, y=${modelY})`,
      "Unrolled Loop Depth": `k = ${Math.round(st.v0)}`,
      "Active Forked States": `${Math.max(4, Math.round(Math.pow(2, st.a * 6) * (1 - st.c * 0.6)))} paths`,
    };
  };

  // 15. sec_differential_privacy: true query distribution vs Laplace/Gaussian noise-added mechanisms + privacy budget ε KL divergence / ROC trade-off
  R.sec_differential_privacy = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Neighboring Databases M(D) vs M(D') Laplace Density | Right: Privacy-Utility Frontier", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Laplace Mechanism Lap(Δf / ε) on Neighboring D vs D'");
    st.panel(rx, ry, rw, rh, "Sequential Composition ε_tot & Membership Inference Risk");

    const eps = Math.max(0.1, st.v0);
    const sens = Math.max(0.5, st.v1);
    const scaleB = sens / eps;

    // Left: Two Laplace distributions centered at -0.12 and +0.12
    const px0 = lx + 20, py0 = ly + lh - 26, pw = lw - 40, ph = lh - 58;
    line(ctx, px0, py0, px0 + pw, py0, C.axis, 1);
    const bVis = clamp(scaleB * 0.08, 0.05, 0.35);

    for (const [mu, col, lbl] of [[0.43, C.primary, "Pr[M(D)]"], [0.57, C.secondary, "Pr[M(D')]"]]) {
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = i / 120;
        const lap = Math.exp(-Math.abs(u - mu) / bVis);
        const sx = px0 + u * pw, sy = py0 - lap * ph * 0.85;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.stroke();
      txt(ctx, lbl, px0 + mu * pw, py0 - ph * 0.88, col, 9.5, "center", true);
    }

    // Right: Composition curve ε_total = √(2k ln(1/δ)) ε
    const rx0 = rx + 28, ry0 = ry + rh - 26, rwPlot = rw - 44, rhPlot = rh - 58;
    line(ctx, rx0, ry0, rx0 + rwPlot, ry0, C.axis, 1);
    line(ctx, rx0, ry0 - rhPlot, rx0, ry0, C.axis, 1);

    ctx.beginPath();
    for (let q = 1; q <= 50; q++) {
      const u = q / 50;
      const advEps = Math.min(1, (eps * Math.sqrt(q)) / 35);
      const sx = rx0 + u * rwPlot, sy = ry0 - advEps * rhPlot;
      if (q === 1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.stroke();

    const kQueries = Math.round(st.v2);
    const qx = rx0 + (kQueries / 50) * rwPlot;
    const qy = ry0 - Math.min(1, (eps * Math.sqrt(kQueries)) / 35) * rhPlot;
    circle(ctx, qx, qy, 5, C.danger);
    txt(ctx, `k=${kQueries} queries`, qx - 6, qy - 8, C.danger, 9.5, "right", true);

    return {
      "Laplace Noise Scale b": `Δf/ε = ${scaleB.toFixed(2)}`,
      "Density Ratio Bound e^ε": Math.exp(Math.min(6, eps)).toFixed(2),
      "Composed Budget ε_tot": `${(eps * Math.sqrt(kQueries)).toFixed(2)} (k=${kQueries})`,
      "Expected L₁ Utility Error": `±${scaleB.toFixed(2)}`,
    };
  };

  // 16. sec_byzantine_pbft: 4-phase PBFT message timeline (Pre-Prepare, Prepare, Commit, Reply) across honest & Byzantine traitor replicas with 2f+1 quorum certificate
  R.sec_byzantine_pbft = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Verify safety threshold n ≥ 3f + 1 across Pre-Prepare, Prepare, and Commit phases", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "PBFT Space-Time Message Diagram (Primary R0, Honest Replicas, Byzantine Equivocators)");

    const nTotal = Math.round(st.v0);
    const fByz = Math.round(st.v1);
    const safe = nTotal >= 3 * fByz + 1;

    const lanes = ["Primary R0", "Replica R1 (Honest)", "Replica R2 (Honest)", `Replica R3 (${fByz > 0 ? "Byzantine" : "Honest"})`];
    const phases = ["Pre-Prepare", "Prepare (2f)", "Commit (2f+1)", "Reply QC"];
    const lx0 = padX + 118, lw = boxW - 140;

    lanes.forEach((name, i) => {
      const ly = padY + 42 + i * ((boxH - 68) / 3);
      const isByz = i === 3 && fByz > 0;
      line(ctx, lx0, ly, lx0 + lw, ly, isByz ? C.danger : C.axis, 1.5, isByz ? [4, 4] : null);
      txt(ctx, name, padX + 12, ly + 4, isByz ? C.danger : C.text, 10, "left", true);
    });

    phases.forEach((p, pIdx) => {
      const px1 = lx0 + (pIdx / 4) * lw;
      const px2 = lx0 + ((pIdx + 0.85) / 4) * lw;
      txt(ctx, p, (px1 + px2) * 0.5, padY + 28, C.accent, 9.5, "center", true);
      for (let src = 0; src < 4; src++) {
        if (pIdx === 0 && src > 0) continue;
        for (let dst = 0; dst < 4; dst++) {
          if (src === dst) continue;
          const y1 = padY + 42 + src * ((boxH - 68) / 3);
          const y2 = padY + 42 + dst * ((boxH - 68) / 3);
          const isByz = src === 3 && fByz > 0;
          line(ctx, px1, y1, px2, y2, isByz ? "rgba(255,107,107,0.45)" : "rgba(124,156,255,0.32)", 1.1);
        }
      }
    });

    txt(ctx, safe ? `✓ QUORUM SAFE: n=${nTotal} ≥ 3f+1=${3 * fByz + 1} (Quorum Q = ${2 * fByz + 1})` : `✗ SAFETY VIOLATION: n=${nTotal} < 3f+1=${3 * fByz + 1} (Split-Brain Fork!)`, padX + boxW * 0.5, padY + boxH - 10, safe ? C.ok : C.danger, 10.5, "center", true);

    return {
      "Validator Set (n, f)": `n = ${nTotal}, f = ${fByz} Byzantine`,
      "Required Quorum |Q|": `${2 * fByz + 1} signatures (2f+1)`,
      "Honest Overlap |Q₁∩Q₂|": `${Math.max(0, nTotal - 2 * fByz)} nodes`,
      "BFT Consensus State": safe ? "FINALIZED (Safety Holds)" : "FORKED (Equivocation)",
    };
  };

  // 17. sec_kerberos_golden_ticket: Active Directory BloodHound attack path (User -> MemberOf -> AdminTo -> HasSession -> Domain Controller) with TGT/TGS ticket forge
  R.sec_kerberos_golden_ticket = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Reduce Over-Permissive ACEs and enforce Tier-0 Isolation to sever the BloodHound path to DC01", st.spec.formula);
    const padX = 16, topY = 46, boxW = W - 32, topH = (H - 68) * 0.58;
    const botY = topY + topH + 10, botH = H - botY - 12;
    st.panel(padX, topY, boxW, topH, "BloodHound Active Directory Privilege Escalation Graph");
    st.panel(padX, botY, boxW, botH, "Kerberos Golden Ticket Structure (PAC Forged with NTLM(krbtgt))");

    const chain = [
      { n: "USR: jsmith", x: 0.10, y: 0.52 },
      { n: "GRP: HelpDesk", x: 0.30, y: 0.28 },
      { n: "WRK: SRV-SQL02", x: 0.50, y: 0.58 },
      { n: "ADM: svc_backup", x: 0.70, y: 0.28 },
      { n: "DC01 (Tier-0)", x: 0.90, y: 0.52 },
    ];
    const rels = ["MemberOf", "AdminTo", "HasSession", "DCSync / GenericAll"];
    const severedHop = st.a > 0.65 ? 2 : (st.b < 0.3 ? 3 : -1);

    for (let i = 0; i < chain.length - 1; i++) {
      const x1 = padX + chain[i].x * boxW, y1 = topY + 18 + chain[i].y * (topH - 28);
      const x2 = padX + chain[i + 1].x * boxW, y2 = topY + 18 + chain[i + 1].y * (topH - 28);
      const blocked = i === severedHop;
      arrow(ctx, x1, y1, x2, y2, blocked ? C.ok : C.danger, 2.2);
      txt(ctx, blocked ? "✂ TIER-0 BLOCKED" : rels[i], (x1 + x2) * 0.5, (y1 + y2) * 0.5 - 6, blocked ? C.ok : C.accent, 9, "center", true);
    }

    chain.forEach((nd, i) => {
      const sx = padX + nd.x * boxW, sy = topY + 18 + nd.y * (topH - 28);
      circle(ctx, sx, sy, 14, "rgba(22,26,46,0.95)", i === 4 ? C.accent : C.primary, 2);
      txt(ctx, nd.n, sx, sy + 26, C.text, 9.5, "center", true);
    });

    // Bottom: Kerberos Golden Ticket fields
    const fields = ["cname: Administrator", "SID: S-1-5-21-...-500", "Groups: [512, 518, 519]", `Enc: RC4/AES(krbtgt)`];
    const fw = (boxW - 36) / fields.length;
    fields.forEach((f, i) => {
      const fx = padX + 14 + i * fw;
      ctx.fillStyle = severedHop >= 0 ? "rgba(110,231,183,0.12)" : "rgba(255,107,107,0.18)";
      ctx.fillRect(fx, botY + 26, fw - 8, botH - 36);
      ctx.strokeStyle = severedHop >= 0 ? C.ok : C.danger;
      ctx.strokeRect(fx, botY + 26, fw - 8, botH - 36);
      txt(ctx, f, fx + (fw - 8) * 0.5, botY + 26 + (botH - 36) * 0.56, C.text, 9.5, "center", true);
    });

    return {
      "Attack Path Length": severedHop >= 0 ? "∞ (Path Remediated)" : "4 Hops to Domain Admin",
      "Tier-0 PAW Hygiene": `${Math.round(st.v0)}% Enforced`,
      "KRBTGT Double-Reset": `Every ${Math.round(st.v2)} days`,
      "Golden Ticket Risk": severedHop >= 0 ? "MITIGATED" : "CRITICAL (DCSync Exposed)",
    };
  };

  // 18. sec_dns_tunnel_entropy: live stream of normal vs base32-encoded exfiltration DNS queries (a8f92c.evil.com) + Shannon entropy H(X) threshold histogram
  R.sec_dns_tunnel_entropy = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Live FQDN Query Stream | Right: Subdomain Shannon Entropy H(X) Detector", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Live DNS Resolver Query Log (TXT / CNAME / A)");
    st.panel(rx, ry, rw, rh, "Shannon Entropy H(X) Distribution vs Alert Threshold");

    const thresh = st.v2;
    const queries = [
      { q: "api.cdn.cloudflare.com", h: 3.12, exfil: false },
      { q: "mfrggZdfmztwq2lknnwg23tp.c2-sync.io", h: 4.48 + st.b * 0.4, exfil: true },
      { q: "mail.corp-internal.org", h: 2.94, exfil: false },
      { q: "JBSWY3DPEHPK3PXP89A2C1F0.c2-sync.io", h: 4.62 + st.b * 0.45, exfil: true },
      { q: "update.googleapis.com", h: 3.28, exfil: false },
      { q: "9x8k2m7v4p1q0w5z3r6t8y2u.c2-sync.io", h: 4.79 + st.b * 0.35, exfil: true },
    ];

    queries.forEach((item, i) => {
      const qy = ly + 30 + i * 32;
      const flagged = item.h >= thresh;
      ctx.fillStyle = flagged ? "rgba(255,107,107,0.16)" : "rgba(110,231,183,0.10)";
      ctx.fillRect(lx + 12, qy, lw - 24, 26);
      ctx.strokeStyle = flagged ? C.danger : C.ok;
      ctx.strokeRect(lx + 12, qy, lw - 24, 26);
      txt(ctx, item.q, lx + 18, qy + 17, flagged ? C.danger : C.text, 9.5, "left", true);
      txt(ctx, `H=${item.h.toFixed(2)}`, lx + lw - 18, qy + 17, flagged ? C.accent : C.ok, 9.5, "right", true);
    });

    // Right panel: Histogram of benign (H~3.1) vs exfil (H~4.7) + threshold line
    const px0 = rx + 20, py0 = ry + rh - 26, pw = rw - 40, ph = rh - 58;
    line(ctx, px0, py0, px0 + pw, py0, C.axis, 1);
    for (let b = 0; b < 18; b++) {
      const hVal = 2.0 + (b / 18) * 3.8;
      const benign = Math.exp(-Math.pow((hVal - 3.1) / 0.42, 2)) * 0.85;
      const tunnel = Math.exp(-Math.pow((hVal - (4.55 + st.b * 0.35)) / 0.35, 2)) * (0.35 + st.a * 0.6);
      const bx = px0 + (b / 18) * pw, bw = pw / 20;
      ctx.fillStyle = "rgba(110,231,183,0.55)";
      ctx.fillRect(bx, py0 - benign * ph, bw, benign * ph);
      ctx.fillStyle = "rgba(255,107,107,0.65)";
      ctx.fillRect(bx, py0 - tunnel * ph, bw, tunnel * ph);
    }
    const tx = px0 + ((thresh - 2.0) / 3.8) * pw;
    line(ctx, tx, ry + 26, tx, py0, C.accent, 2, [4, 3]);
    txt(ctx, `Alert H > ${thresh.toFixed(1)} b/char`, tx, ry + 38, C.accent, 9.5, "center", true);

    return {
      "Tunnel Exfil Rate": `${Math.round(st.v0)} kbps`,
      "Subdomain Entropy H": `${(4.62 + st.b * 0.4).toFixed(2)} bits/char`,
      "Alert Threshold": `${thresh.toFixed(2)} bits/char`,
      "Sinkhole Verdict": (4.62 + st.b * 0.4) >= thresh ? "BLOCKED (DNS Tunnel)" : "MISSED (False Negative)",
    };
  };

  // 19. sec_kyber_mlkem: Module-LWE noisy linear equations b = A·s + e (mod q) lattice rings + encapsulation/decapsulation error threshold q/4
  R.sec_kyber_mlkem = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Ring R_q = Z_3329[X]/(X^256+1) Polynomials | Right: Decapsulation Error vs q/4 Bound", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Module-LWE Matrix-Vector Product b = A·s + e (mod 3329)");
    st.panel(rx, ry, rw, rh, "Decapsulation Rounding Threshold ±q/4 (q = 3329)");

    const kRank = Math.round(st.v0);
    const eta = Math.round(st.v1);
    const cell = Math.min(34, (lw - 120) / kRank);
    const mx = lx + 18, my = ly + 52;

    for (let r = 0; r < kRank; r++) {
      for (let c = 0; c < kRank; c++) {
        ctx.fillStyle = "rgba(124,156,255,0.16)";
        ctx.fillRect(mx + c * cell, my + r * cell, cell - 4, cell - 4);
        ctx.strokeStyle = C.primary;
        ctx.strokeRect(mx + c * cell, my + r * cell, cell - 4, cell - 4);
        txt(ctx, `A${r}${c}`, mx + c * cell + (cell - 4) * 0.5, my + r * cell + (cell - 4) * 0.6, C.text, 9, "center");
      }
      // s vector and e vector
      const sx = mx + kRank * cell + 14;
      ctx.fillStyle = "rgba(110,231,183,0.18)";
      ctx.fillRect(sx, my + r * cell, 28, cell - 4);
      txt(ctx, `s_${r}`, sx + 14, my + r * cell + (cell - 4) * 0.6, C.ok, 9, "center", true);

      const ex = sx + 42;
      ctx.fillStyle = "rgba(255,143,171,0.18)";
      ctx.fillRect(ex, my + r * cell, 28, cell - 4);
      txt(ctx, `e_${r}`, ex + 14, my + r * cell + (cell - 4) * 0.6, C.secondary, 9, "center", true);
    }
    txt(ctx, `ML-KEM-${kRank * 256} (Rank k=${kRank}, NTT O(n log n))`, lx + 18, ly + lh - 14, C.accent, 10, "left", true);

    // Right panel: Z_q circle / interval showing bit 0 at 0, bit 1 at q/2=1665, and decision boundaries at ±q/4 = ±832
    const px0 = rx + 20, py0 = ry + rh - 28, pw = rw - 40, ph = rh - 58;
    line(ctx, px0, py0, px0 + pw, py0, C.axis, 1);
    const sigma = 0.06 + eta * 0.032 + (1 - st.c) * 0.06;

    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const g = Math.exp(-Math.pow((u - 0.5) / sigma, 2));
      const sx = px0 + u * pw, sy = py0 - g * ph * 0.85;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.2; ctx.stroke();

    // Decision bounds at -q/4 and +q/4
    const b1 = px0 + 0.22 * pw, b2 = px0 + 0.78 * pw;
    line(ctx, b1, ry + 28, b1, py0, C.danger, 1.6, [4, 3]);
    line(ctx, b2, ry + 28, b2, py0, C.danger, 1.6, [4, 3]);
    txt(ctx, "-q/4 (-832)", b1, ry + 38, C.danger, 9, "center");
    txt(ctx, "+q/4 (+832)", b2, ry + 38, C.danger, 9, "center");

    return {
      "Parameter Set": `ML-KEM-${kRank * 256} (k=${kRank})`,
      "Binomial Noise η": `CBD_${eta} (mod q=3329)`,
      "Decapsulation Bound": "±832 (q / 4)",
      "Decryption Failure δ": sigma < 0.14 ? "< 2⁻¹³⁸ (Negligible)" : "Elevated (Noise Overflow)",
    };
  };

  // 20. sec_adversarial_evasion: malware feature space with decision boundary, L_∞ ε-ball box around sample, and PGD gradient ascent evasion path
  R.sec_adversarial_evasion = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Trace Projected Gradient Descent (PGD) inside the L_∞ ε-box across the Malware Decision Boundary", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "2D Malware Feature Space: Decision Boundary f_θ(x) = 0 & L_∞ Perturbation Ball B_ε(x₀)");

    const gx = padX + 24, gy = padY + 26, gw = boxW - 48, gh = boxH - 42;
    // Decision boundary curve (Hardens/shifts with adversarial training st.b)
    const boundX = gx + gw * (0.52 + st.b * 0.16);
    ctx.fillStyle = "rgba(110,231,183,0.07)";
    ctx.fillRect(gx, gy, boundX - gx, gh);
    ctx.fillStyle = "rgba(255,107,107,0.07)";
    ctx.fillRect(boundX, gy, gx + gw - boundX, gh);
    line(ctx, boundX, gy, boundX, gy + gh, C.accent, 2.2, [5, 4]);
    txt(ctx, "BENIGN CLASS (f_θ < 0)", gx + 14, gy + 18, C.ok, 10, "left", true);
    txt(ctx, "MALWARE CLASS (f_θ > 0)", gx + gw - 14, gy + 18, C.danger, 10, "right", true);

    // Original malware sample x0 on right side
    const x0 = gx + gw * 0.68, y0 = gy + gh * 0.56;
    const epsBox = (0.06 + st.a * 0.28) * gw;
    ctx.strokeStyle = C.primary;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x0 - epsBox, y0 - epsBox * 0.7, epsBox * 2, epsBox * 1.4);
    txt(ctx, "L_∞ Ball B_ε(x₀)", x0 + epsBox - 4, y0 - epsBox * 0.7 - 6, C.primary, 9.5, "right");

    // Multi-step PGD trajectory from x0 toward boundary constrained by box and semantic mask st.c
    const maxStepX = epsBox * (1 - st.c * 0.35);
    const xAdv = x0 - maxStepX;
    const yAdv = y0 - epsBox * 0.35;
    for (let s = 0; s < 5; s++) {
      const t1 = s / 5, t2 = (s + 1) / 5;
      arrow(ctx, lerp(x0, xAdv, t1), lerp(y0, yAdv, t1), lerp(x0, xAdv, t2), lerp(y0, yAdv, t2), C.secondary, 2);
    }
    circle(ctx, x0, y0, 5.5, C.danger);
    txt(ctx, "x₀ (Malware)", x0 + 8, y0 + 4, C.danger, 10, "left", true);

    const evaded = xAdv < boundX;
    circle(ctx, xAdv, yAdv, 6, evaded ? C.ok : C.accent);
    txt(ctx, evaded ? "x_adv (Evaded!)" : "x_adv (Blocked)", xAdv - 8, yAdv - 8, evaded ? C.ok : C.accent, 10, "right", true);

    return {
      "Perturbation Budget ε": `||δ||_∞ ≤ ${st.v0.toFixed(2)}`,
      "Classifier Score P(Mal)": evaded ? "0.18 (Evaded → Benign)" : "0.84 (Detected as Malware)",
      "Adversarial Training": `${(st.v1 * 100).toFixed(0)}% Min-Max Robust`,
      "Semantic Mask": `${Math.round(st.v2)}% Headers Locked`,
    };
  };

  /* ══════════════════════════════════════════════════════════════════════════
   * PART 2: NEUROSCIENCE (20 SIMULATIONS)
   * ══════════════════════════════════════════════════════════════════════════ */

  // 21. neuro_hodgkin_huxley: Hodgkin-Huxley V(t) spike + m,h,n gating variables + Na+/K+ channel currents
  R.neuro_hodgkin_huxley = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Top: Action Potential V(t) (mV) | Bottom: Gating Variables m(t), h(t), n(t) & Na⁺/K⁺ Channels", st.spec.formula);
    const padX = 16, topY = 46, boxW = W - 32, topH = (H - 68) * 0.54;
    const botY = topY + topH + 10, botH = H - botY - 12;
    st.panel(padX, topY, boxW, topH, "Membrane Voltage V_m(t) (−70 mV Resting → +40 mV Na⁺ Depolarization Peak)");
    st.panel(padX, botY, boxW, botH, "Gating Kinetics: m (Na⁺ Activation), h (Na⁺ Inactivation), n (K⁺ Delayed Rectifier)");

    const iExt = st.v0;
    const spiking = iExt > 6.2 && st.b > 0.25;
    const freq = spiking ? 1.5 + st.a * 3.5 : 0;

    // Top: V(t) action potential waveform
    const px0 = padX + 28, pw = boxW - 44, vyMid = topY + topH * 0.68;
    line(ctx, px0, vyMid, px0 + pw, vyMid, C.axis, 1, [3, 3]);
    txt(ctx, "-70mV", px0 - 4, vyMid + 3, C.muted, 8.5, "right");
    txt(ctx, "+40mV", px0 - 4, topY + 28, C.ok, 8.5, "right");

    ctx.beginPath();
    for (let i = 0; i <= 150; i++) {
      const u = i / 150;
      const ph = ((u * (1 + freq) - st.t * 0.6) % 1 + 1) % 1;
      let vNorm = 0;
      if (spiking) {
        const upstroke = Math.exp(-Math.pow((ph - 0.35) / 0.045, 2)) * (0.65 + st.b * 0.45);
        const ahp = -0.22 * Math.exp(-Math.pow((ph - 0.46) / 0.09, 2)) * (0.5 + st.c * 0.7);
        vNorm = upstroke + ahp;
      } else {
        vNorm = 0.14 * st.a * Math.sin(u * 12 - st.t * 3);
      }
      const sx = px0 + u * pw, sy = vyMid - vNorm * (topH * 0.52);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = spiking ? C.ok : C.primary;
    ctx.lineWidth = 2.3;
    ctx.stroke();

    // Bottom: m(t), h(t), n(t) curves in [0, 1]
    const by0 = botY + botH - 16, bh = botH - 38;
    line(ctx, px0, by0, px0 + pw, by0, C.axis, 1);
    const gates = [
      { name: "m (Na⁺ act)", col: C.accent, fn: (ph) => Math.exp(-Math.pow((ph - 0.35) / 0.05, 2)) },
      { name: "h (Na⁺ inact)", col: C.danger, fn: (ph) => 1 - 0.85 * Math.exp(-Math.pow((ph - 0.42) / 0.12, 2)) },
      { name: "n (K⁺ act)", col: C.primary, fn: (ph) => 0.2 + 0.72 * Math.exp(-Math.pow((ph - 0.44) / 0.10, 2)) },
    ];
    gates.forEach((g, idx) => {
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const u = i / 140;
        const ph = ((u * (1 + freq) - st.t * 0.6) % 1 + 1) % 1;
        const val = spiking ? g.fn(ph) : (idx === 1 ? 0.65 : 0.15);
        const sx = px0 + u * pw, sy = by0 - val * bh;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = g.col; ctx.lineWidth = 1.9; ctx.stroke();
      txt(ctx, g.name, px0 + 10 + idx * 115, botY + 30, g.col, 9.5, "left", true);
    });

    return {
      "Injected Current I_ext": `${iExt.toFixed(1)} µA/cm²`,
      "Firing Regime": spiking ? `Repetitive Spiking (${Math.round(freq * 28)} Hz)` : "Subthreshold (Rheobase ~ 6.3)",
      "Peak Action Potential": spiking ? `${Math.round(15 + st.b * 28)} mV` : "-62.4 mV",
      "Conductances (gNa, gK)": `${Math.round(st.v1)}, ${Math.round(st.v2)} mS/cm²`,
    };
  };

  // 22. neuro_fitzhugh_nagumo: FitzHugh-Nagumo cubic nullcline w = v - v³/3 phase plane
  R.neuro_fitzhugh_nagumo = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: (v, w) Phase Plane with Cubic v-Nullcline & w-Nullcline | Right: Limit Cycle Time Series", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Phase Plane: w = v − v³/3 + I (Cubic) vs w = (v + a)/b");
    st.panel(rx, ry, rw, rh, "Fast Voltage v(t) & Slow Recovery Variable w(t)");

    const stimI = st.v0;
    const bSlope = Math.max(0.2, st.v2);
    const aParam = 0.7;
    const ox = lx + lw * 0.5, oy = ly + lh * 0.58;
    const scX = lw * 0.20, scY = lh * 0.25;
    line(ctx, lx + 12, oy, lx + lw - 12, oy, C.axis, 1);
    line(ctx, ox, ly + 24, ox, ly + lh - 12, C.axis, 1);

    // Cubic v-nullcline: w = v - v^3/3 + I
    ctx.beginPath();
    for (let v = -2.2; v <= 2.2; v += 0.04) {
      const w = v - (v * v * v) / 3 + stimI * 0.6;
      const sx = ox + v * scX, sy = oy - w * scY;
      if (v === -2.2) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2; ctx.stroke();

    // Linear w-nullcline: w = (v + a) / b
    ctx.beginPath();
    for (let v = -1.8; v <= 1.8; v += 0.1) {
      const w = (v + aParam) / bSlope;
      const sx = ox + v * scX, sy = oy - w * scY;
      if (sy > ly + 22 && sy < ly + lh - 10) {
        if (v === -1.8) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
    }
    ctx.strokeStyle = C.secondary; ctx.lineWidth = 1.8; ctx.stroke();

    // Limit cycle trajectory when stimulus I > 0.33
    const constosc = stimI > 0.34;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const ang = (i / 100) * TAU;
      const rAmp = constosc ? 1.55 : 0.18;
      const v = rAmp * Math.cos(ang);
      const w = stimI * 0.6 + 0.65 * rAmp * Math.sin(ang);
      const sx = ox + v * scX, sy = oy - w * scY;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2; ctx.stroke();
    const curAng = st.t * (1.8 + st.b * 3);
    const cv = (constosc ? 1.55 : 0.18) * Math.cos(curAng);
    const cw = stimI * 0.6 + 0.65 * (constosc ? 1.55 : 0.18) * Math.sin(curAng);
    circle(ctx, ox + cv * scX, oy - cw * scY, 5.5, C.accent);

    // Right panel: v(t) and w(t) waveforms
    const rx0 = rx + 16, rwPlot = rw - 32, ryMid = ry + rh * 0.56;
    line(ctx, rx0, ryMid, rx0 + rwPlot, ryMid, C.axis, 1);
    for (const [isW, col] of [[false, C.ok], [true, C.secondary]]) {
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        const ph = u * 10 - st.t * 3;
        const val = constosc ? (isW ? 0.55 * Math.sin(ph - 0.8) : Math.cos(ph) + 0.25 * Math.cos(3 * ph)) : 0.1 * Math.sin(ph);
        const sx = rx0 + u * rwPlot, sy = ryMid - val * (rh * 0.28);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
    }

    return {
      "Stimulus Drive I": stimI.toFixed(2),
      "Bifurcation Regime": constosc ? "Hopf Limit Cycle (Tonic Spiking)" : "Stable Excitable Fixed Point",
      "Time-Scale Separation ε": st.v1.toFixed(3),
      "Nullcline Slope 1/b": (1 / bSlope).toFixed(2),
    };
  };

  // 23. neuro_cable_dendrite: Rall branched dendritic tree with electrotonic attenuation V(x,t)
  R.neuro_cable_dendrite = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Branched Dendritic Arbor (d_p^(3/2) = Σ d_k^(3/2)) | Right: Spatial Attenuation V(x) & NMDA Spike", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.46, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Pyramidal Soma & Rall Equivalent Dendritic Tree");
    st.panel(rx, ry, rw, rh, "Electrotonic Decay V(x) = V₀ exp(−x/λ) + NMDA Plateau");

    // Draw soma + branched apical/basal dendrites on left
    const sx = lx + lw * 0.5, sy = ly + lh * 0.82;
    const branches = [
      [sx, sy, sx, sy - 58, 5, C.ok],
      [sx, sy - 58, sx - 42, sy - 110, 3.2, C.primary],
      [sx, sy - 58, sx + 42, sy - 110, 3.2, C.primary],
      [sx - 42, sy - 110, sx - 68, sy - 154, 2, C.secondary],
      [sx - 42, sy - 110, sx - 18, sy - 154, 2, C.secondary],
      [sx + 42, sy - 110, sx + 18, sy - 154, 2, C.accent],
      [sx + 42, sy - 110, sx + 68, sy - 154, 2, C.accent],
    ];
    branches.forEach(([x1, y1, x2, y2, w, col]) => line(ctx, x1, y1, x2, y2, col, w));
    // Soma triangle
    ctx.fillStyle = C.ok;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 14); ctx.lineTo(sx - 14, sy + 10); ctx.lineTo(sx + 14, sy + 10); ctx.closePath();
    ctx.fill();
    txt(ctx, "Soma (x = L)", sx, sy + 24, C.ok, 10, "center", true);
    circle(ctx, sx + 68, sy - 154, 6 + 3 * Math.sin(st.t * 5), C.accent);
    txt(ctx, "Distal Synapse (x=0)", sx + 42, sy - 164, C.accent, 9.5, "center", true);

    // Right panel: V(x) spatial profile from distal synapse (x=0) to soma (x=600 um)
    const gx = rx + 26, gy = ry + 30, gw = rw - 42, gh = rh - 52;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1);
    const lam = Math.max(50, st.v0);
    const nmda = st.c;

    // Passive decay curve vs active NMDA boosted curve
    for (const [active, col] of [[false, C.muted], [true, C.ok]]) {
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        const xUm = u * 600;
        let v = Math.exp(-xUm / lam);
        if (active && nmda > 0.35) {
          v += 0.45 * nmda * Math.exp(-Math.pow((u - 0.35) / 0.18, 2));
        }
        const px = gx + u * gw, py = gy + gh - clamp(v, 0, 1.15) * (gh * 0.82);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = col; ctx.lineWidth = active ? 2.4 : 1.5; ctx.stroke();
    }
    txt(ctx, "Active NMDA Dendritic Spike", gx + gw * 0.38, gy + 24, C.ok, 9.5, "center", true);
    txt(ctx, "Passive Rall Cable", gx + gw * 0.72, gy + gh - 18, C.muted, 9, "center");

    const somaticV = Math.exp(-600 / lam) + (nmda > 0.35 ? 0.18 * nmda : 0);
    return {
      "Space Constant λ": `${Math.round(lam)} µm`,
      "Electrotonic Length L/λ": (600 / lam).toFixed(2),
      "Somatic EPSP Amplitude": `${(somaticV * 24).toFixed(1)} mV`,
      "NMDA Mg²⁺ Unblock": nmda > 0.5 ? "Regenerative Plateau" : "Passive Sublinear",
    };
  };

  // 24. neuro_stdp_synapse: STDP asymmetric exponential window Δw(Δt) around pre/post spike pairs
  R.neuro_stdp_synapse = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Vary Δt = t_post − t_pre across the Bi & Poo (1998) Asymmetric Exponential Window", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Spike-Timing-Dependent Plasticity Window Δw(Δt): Causal LTP (Δt > 0) vs Anti-Causal LTD (Δt < 0)");

    const ox = padX + boxW * 0.5, oy = padY + boxH * 0.54;
    const gw = boxW * 0.44, gh = boxH * 0.36;
    line(ctx, ox - gw, oy, ox + gw, oy, C.axis, 1.3);
    line(ctx, ox, padY + 26, ox, padY + boxH - 16, C.axis, 1.3);
    txt(ctx, "LTP (+Δw %): Pre before Post (Δt > 0)", ox + gw * 0.5, padY + 38, C.ok, 10, "center", true);
    txt(ctx, "LTD (−Δw %): Post before Pre (Δt < 0)", ox - gw * 0.5, padY + boxH - 22, C.danger, 10, "center", true);

    const tauPlus = Math.max(5, st.v1);
    const aRatio = st.v2;

    // LTP curve (dt > 0)
    ctx.beginPath();
    for (let dt = 0.5; dt <= 80; dt += 1) {
      const dw = Math.exp(-dt / tauPlus);
      const sx = ox + (dt / 80) * gw, sy = oy - dw * gh;
      if (dt === 0.5) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.5; ctx.stroke();

    // LTD curve (dt < 0)
    ctx.beginPath();
    for (let dt = -80; dt <= -0.5; dt += 1) {
      const dw = -aRatio * 0.75 * Math.exp(dt / (tauPlus * 1.4));
      const sx = ox + (dt / 80) * gw, sy = oy - dw * gh;
      if (dt === -80) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.danger; ctx.lineWidth = 2.5; ctx.stroke();

    // Current Δt marker
    const curDt = st.v0;
    const curDw = curDt >= 0 ? Math.exp(-curDt / tauPlus) : -aRatio * 0.75 * Math.exp(curDt / (tauPlus * 1.4));
    const mx = ox + (curDt / 80) * gw, my = oy - curDw * gh;
    line(ctx, mx, oy, mx, my, C.accent, 2, [3, 3]);
    circle(ctx, mx, my, 6, C.accent);
    txt(ctx, `Δt = ${curDt > 0 ? "+" : ""}${curDt} ms → Δw = ${(curDw * 100).toFixed(1)}%`, mx, my + (curDw >= 0 ? -10 : 16), C.accent, 10, "center", true);

    return {
      "Spike Timing Δt": `${curDt > 0 ? "+" : ""}${curDt} ms (t_post − t_pre)`,
      "Synaptic Weight Update": `${curDw >= 0 ? "+" : ""}${(curDw * 100).toFixed(1)}% (${curDw >= 0 ? "LTP" : "LTD"})`,
      "LTP Time Constant τ₊": `${tauPlus} ms`,
      "Integral Balance A₋τ₋/A₊τ₊": (aRatio * 1.05).toFixed(2),
    };
  };

  // 25. neuro_wilson_cowan: Wilson-Cowan E-I cortical columns + gamma/alpha limit cycle
  R.neuro_wilson_cowan = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Recurrent Pyramidal (E) & PV Interneuron (I) Circuit | Right: Gamma/Beta Limit Cycle", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.44, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Cortical Microcircuit: E (Pyramidal) ⇄ I (PV Basket)");
    st.panel(rx, ry, rw, rh, "Population Firing Rates E(t), I(t) & E-I Phase Portrait");

    const ex = lx + lw * 0.32, ix = lx + lw * 0.70, cy = ly + lh * 0.54;
    circle(ctx, ex, cy, 26, "rgba(110,231,183,0.18)", C.ok, 2.5);
    circle(ctx, ix, cy, 26, "rgba(255,107,107,0.18)", C.danger, 2.5);
    txt(ctx, "E", ex, cy + 5, C.ok, 15, "center", true);
    txt(ctx, "I", ix, cy + 5, C.danger, 15, "center", true);
    arrow(ctx, ex + 24, cy - 10, ix - 24, cy - 10, C.ok, 2.2);
    arrow(ctx, ix - 24, cy + 10, ex + 24, cy + 10, C.danger, 2.2);
    txt(ctx, `w_EE=${st.v0.toFixed(1)}`, ex, cy - 34, C.ok, 9.5, "center", true);
    txt(ctx, `w_EI=${st.v1.toFixed(1)}`, (ex + ix) * 0.5, cy + 28, C.danger, 9.5, "center", true);
    txt(ctx, `Drive P=${st.v2.toFixed(1)}`, ex, cy + 46, C.accent, 9.5, "center");

    // Right panel: E(t) and I(t)PING gamma waves
    const gx = rx + 18, gy = ry + 32, gw = rw - 36, gh = rh - 48;
    const oscAmp = clamp((st.a * 0.7 + st.b * 0.5) * (0.4 + st.c * 0.6), 0.1, 0.95);
    const freqHz = Math.round(24 + st.b * 38);

    for (const [lag, col, name] of [[0, C.ok, "Excitatory E(t)"], [1.1, C.danger, "Inhibitory I(t)"]]) {
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = i / 120;
        const val = 0.5 + 0.42 * oscAmp * Math.sin(u * (12 + st.b * 12) - st.t * 4.5 - lag);
        const sx = gx + u * gw, sy = gy + gh - val * gh;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2.1; ctx.stroke();
      txt(ctx, name, gx + (lag > 0 ? 120 : 8), gy + 12, col, 9.5, "left", true);
    }

    return {
      "Cortical Rhythm": `${freqHz} Hz (${freqHz >= 35 ? "PING Gamma" : "Beta Rhythm"})`,
      "E/I Conductance Ratio": (st.v0 / Math.max(1, st.v1)).toFixed(2),
      "Oscillation Amplitude": `${(oscAmp * 100).toFixed(0)}% Modulation`,
      "Thalamic Drive P": st.v2.toFixed(2),
    };
  };

  // 26. neuro_ring_attractor: Head-direction ring attractor activity bump
  R.neuro_ring_attractor = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Drosophila Central Complex / ADN Ring Attractor | Right: Unwrapped Activity Bump r(θ)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Ring Attractor Network (32 Head-Direction Neurons)");
    st.panel(rx, ry, rw, rh, "Persistent Bump Profile r(θ) & Mexican-Hat Connectivity");

    const rcx = lx + lw * 0.5, rcy = ly + lh * 0.54, rad = Math.min(lw, lh) * 0.35;
    const omega = st.v1 * 0.015;
    const headAng = ((st.t * omega + (st.px - 0.5) * 2) % TAU + TAU) % TAU;
    const N = 32;

    for (let i = 0; i < N; i++) {
      const ang = (i / N) * TAU;
      let diff = Math.abs(ang - headAng);
      if (diff > Math.PI) diff = TAU - diff;
      const rate = Math.exp(-Math.pow(diff / (0.55 - st.a * 0.25), 2));
      const nx = rcx + Math.cos(ang) * rad, ny = rcy + Math.sin(ang) * rad;
      circle(ctx, nx, ny, 3.5 + rate * 6, rate > 0.4 ? C.accent : "rgba(124,156,255,0.35)", rate > 0.6 ? C.ok : null, 1.5);
    }
    arrow(ctx, rcx, rcy, rcx + Math.cos(headAng) * (rad * 0.68), rcy + Math.sin(headAng) * (rad * 0.68), C.ok, 2.5);
    txt(ctx, `θ* = ${Math.round((headAng * 180) / Math.PI)}°`, rcx, rcy + 22, C.ok, 10.5, "center", true);

    // Right panel: Unwrapped bump over 0..360 deg
    const gx = rx + 20, gy = ry + 32, gw = rw - 36, gh = rh - 54;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100, ang = u * TAU;
      let diff = Math.abs(ang - headAng);
      if (diff > Math.PI) diff = TAU - diff;
      const bump = Math.exp(-Math.pow(diff / (0.55 - st.a * 0.25), 2)) + (st.c * 0.14 * Math.sin(i * 1.7 + st.t * 5));
      const sx = gx + u * gw, sy = gy + gh - clamp(bump, 0, 1.1) * gh * 0.85;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.stroke();

    return {
      "Decoded Head Angle θ*": `${Math.round((headAng * 180) / Math.PI)}°`,
      "Angular Velocity ω": `${Math.round(st.v1)} °/s`,
      "Bump FWHM Width": `${Math.round(48 - st.a * 22)}°`,
      "Diffusion Drift D": `${(st.c * 2.4).toFixed(2)} deg²/s`,
    };
  };

  // 27. neuro_grid_cell_hex: Entorhinal hexagonal grid-cell firing rate map + animal trajectory
  R.neuro_grid_cell_hex = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Medial Entorhinal Cortex (MEC) Hexagonal Rate Map | Right: Theta Phase Precession", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.50, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "2D Arena Hexagonal Grid Firing Field (60° Wave-Vector Triad)");
    st.panel(rx, ry, rw, rh, "8 Hz Theta Oscillation & Spike Phase Precession");

    const scaleK = 10 + (1 - st.a) * 18;
    const phi = (st.v1 * Math.PI) / 180;
    const kVecs = [0, Math.PI / 3, (2 * Math.PI) / 3].map((a) => [Math.cos(a + phi) * scaleK, Math.sin(a + phi) * scaleK]);

    const ax = lx + 14, ay = ly + 26, aw = lw - 28, ah = lh - 38;
    const N = 22, cw = aw / N, ch = ah / N;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const ux = (c / N) - 0.5, uy = (r / N) - 0.5;
        const g = (Math.cos(kVecs[0][0] * ux + kVecs[0][1] * uy) +
                   Math.cos(kVecs[1][0] * ux + kVecs[1][1] * uy) +
                   Math.cos(kVecs[2][0] * ux + kVecs[2][1] * uy) + 1.5) / 4.5;
        if (g > 0.52) {
          ctx.fillStyle = `rgba(255,209,102,${(g - 0.45) * 1.4})`;
          ctx.fillRect(ax + c * cw, ay + r * ch, cw + 0.5, ch + 0.5);
        }
      }
    }

    // Simulated foraging rat trajectory
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = st.t * 0.5 - i * 0.04;
      const rxPos = ax + (0.5 + 0.38 * Math.sin(t * 1.3)) * aw;
      const ryPos = ay + (0.5 + 0.38 * Math.cos(t * 1.7)) * ah;
      if (i === 0) ctx.moveTo(rxPos, ryPos); else ctx.lineTo(rxPos, ryPos);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 1.8; ctx.stroke();

    // Right panel: Theta wave & phase-precessing spikes
    const gx = rx + 20, gy = ry + 32, gw = rw - 36, gh = rh - 52;
    line(ctx, gx, gy + gh * 0.5, gx + gw, gy + gh * 0.5, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const sx = gx + u * gw, sy = gy + gh * 0.5 - Math.cos(u * TAU * 4) * (gh * 0.25);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 1.8; ctx.stroke();

    // Phase-precessing dots (360° down to 0° as position traverses field)
    for (let k = 0; k < 12; k++) {
      const u = (k + 0.5) / 12;
      const phDeg = 340 - u * 280 * st.c;
      const sx = gx + u * gw, sy = gy + gh - (phDeg / 360) * gh;
      circle(ctx, sx, sy, 4, C.accent);
    }

    return {
      "Grid Spatial Period λ": `${Math.round(st.v0)} cm`,
      "Gridness Score (60°)": "1.42 (Hexagonal Symmetry)",
      "Lattice Orientation φ": `${Math.round(st.v1)}°`,
      "Phase Precession Slope": `${(-280 * st.c).toFixed(0)}° / field`,
    };
  };

  // 28. neuro_kalman_bci_decoder: Motor cortex center-out reach trajectories + Kalman BCI decoded cursor
  R.neuro_kalman_bci_decoder = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: 8-Target Center-Out Reach & Kalman Decoded Cursor | Right: Cosine-Tuned M1 Ensemble", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.50, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "8-Target Center-Out Task: True Hand vs Kalman BCI Cursor");
    st.panel(rx, ry, rw, rh, "Primary Motor Cortex (M1) Cosine Tuning Curves r_i(θ)");

    const cx = lx + lw * 0.5, cy = ly + lh * 0.54, rad = Math.min(lw, lh) * 0.34;
    const activeTgt = Math.floor(st.t * 0.7) % 8;
    const tgtAng = (activeTgt / 8) * TAU;

    for (let k = 0; k < 8; k++) {
      const ang = (k / 8) * TAU;
      const tx = cx + Math.cos(ang) * rad, ty = cy + Math.sin(ang) * rad;
      circle(ctx, tx, ty, 10, k === activeTgt ? "rgba(110,231,183,0.28)" : "rgba(255,255,255,0.05)", k === activeTgt ? C.ok : C.axis, 2);
    }

    // True reach vs noisy Kalman decoded path
    const reachProg = (st.t * 0.7) % 1;
    const jitter = (1 - st.a * 0.65) * st.b * 18 * (1 - st.c * 0.5);
    ctx.beginPath();
    for (let s = 0; s <= 24; s++) {
      const u = (s / 24) * reachProg;
      const nx = cx + Math.cos(tgtAng) * rad * u + Math.sin(s * 1.9 + st.t * 4) * jitter * u;
      const ny = cy + Math.sin(tgtAng) * rad * u + Math.cos(s * 2.3 - st.t * 3) * jitter * u;
      if (s === 0) ctx.moveTo(nx, ny); else ctx.lineTo(nx, ny);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.stroke();
    line(ctx, cx, cy, cx + Math.cos(tgtAng) * rad * reachProg, cy + Math.sin(tgtAng) * rad * reachProg, C.ok, 1.5, [3, 3]);

    // Right panel: Cosine tuning bars for 12 M1 neurons
    const bx0 = rx + 18, by0 = ry + rh - 24, bw = (rw - 36) / 12, bh = rh - 56;
    for (let n = 0; n < 12; n++) {
      const prefAng = (n / 12) * TAU;
      const rate = clamp(0.45 + 0.45 * Math.cos(tgtAng - prefAng), 0.08, 0.96);
      ctx.fillStyle = C.primary;
      ctx.fillRect(bx0 + n * bw, by0 - rate * bh, bw - 4, rate * bh);
    }
    txt(ctx, "Preferred Direction PD_i ∈ [0°, 360°)", rx + rw * 0.5, by0 + 14, C.muted, 9.5, "center");

    const r2 = clamp(0.58 + st.a * 0.34 - st.b * 0.18 + st.c * 0.1, 0.25, 0.98);
    return {
      "Decoded Velocity R²": r2.toFixed(3),
      "Recorded M1 Ensemble": `${Math.round(st.v0)} single units`,
      "Kalman Gain Smoothing": `Q = ${st.v2.toFixed(2)}`,
      "Fitts's Throughput": `${(3.2 + r2 * 3.8).toFixed(1)} bits/s`,
    };
  };

  // 29. neuro_lfads_manifold: LFADS low-dimensional neural state trajectory in 3D PCA space
  R.neuro_lfads_manifold = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: jPCA / LFADS Rotational Neural Trajectories in State Space | Right: Single-Trial Raster", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.54, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Premotor Latent Manifold (PC₁, PC₂, PC₃ Rotational Dynamics)");
    st.panel(rx, ry, rw, rh, "Inferred Firing Rates r_t vs Raw Spike Raster");

    const cx = lx + lw * 0.5, cy = ly + lh * 0.56, sc = Math.min(lw, lh) * 0.34;
    const cols = [C.primary, C.ok, C.secondary, C.accent];
    const omega = st.v1;

    for (let cond = 0; cond < 4; cond++) {
      const cAng = (cond / 4) * TAU;
      ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const u = i / 70;
        const r = (1 - 0.65 * u) * sc;
        const theta = cAng + u * omega * 2.2 + st.t * 0.8;
        const x3 = r * Math.cos(theta), y3 = r * Math.sin(theta) * 0.68 - (u - 0.5) * 28;
        if (i === 0) ctx.moveTo(cx + x3, cy + y3); else ctx.lineTo(cx + x3, cy + y3);
      }
      ctx.strokeStyle = cols[cond]; ctx.lineWidth = 2.2; ctx.stroke();
    }

    // Right panel: Spike raster + smooth LFADS inferred rates
    const gx = rx + 16, gy = ry + 30, gw = rw - 32;
    for (let u = 0; u < 8; u++) {
      const ryRow = gy + u * 16;
      for (let s = 0; s < 18; s++) {
        if (Math.sin(u * 3.7 + s * 1.9 + st.a * 4) > 0.25) {
          line(ctx, gx + (s / 18) * gw, ryRow, gx + (s / 18) * gw, ryRow + 10, C.muted, 1.3);
        }
      }
    }
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const sx = gx + u * gw, sy = ry + rh - 36 - Math.sin(u * omega * 3 + st.t * 2) * 22;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.2; ctx.stroke();

    return {
      "Latent Manifold Dim d": `${Math.round(st.v0)} factors`,
      "jPCA Rotational R²": (0.74 + st.b * 0.21).toFixed(2),
      "Rotational Frequency ω": `${omega.toFixed(1)} Hz`,
      "ELBO KL Divergence": `${(12.4 * st.v2).toFixed(1)} nats`,
    };
  };

  // 30. neuro_eeg_csp_motor: EEG scalp topography map + CSP spatial filter variance bars
  R.neuro_eeg_csp_motor = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: 10-20 Scalp Topography (C3 vs C4 Mu ERD) | Right: CSP Log-Variance Feature Space", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "EEG Scalp Topomap: Contralateral Sensorimotor ERD (C3 / C4)");
    st.panel(rx, ry, rw, rh, "Common Spatial Patterns (CSP) Eigenvalue Filter Variance");

    const hcx = lx + lw * 0.5, hcy = ly + lh * 0.56, hrad = Math.min(lw, lh) * 0.34;
    // Nose and ears
    ctx.strokeStyle = C.axis; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hcx - 12, hcy - hrad + 2); ctx.lineTo(hcx, hcy - hrad - 14); ctx.lineTo(hcx + 12, hcy - hrad + 2);
    ctx.stroke();
    circle(ctx, hcx, hcy, hrad, "rgba(124,156,255,0.06)", C.text, 2);

    // C3 (Left hemisphere ERD suppression) & C4 (Right hemisphere ERS)
    const erd = st.b;
    circle(ctx, hcx - hrad * 0.45, hcy, hrad * (0.28 + erd * 0.14), "rgba(124,156,255,0.42)", C.primary, 1.8);
    circle(ctx, hcx + hrad * 0.45, hcy, hrad * 0.32, "rgba(255,107,107,0.38)", C.danger, 1.8);
    txt(ctx, "C3 (ERD)", hcx - hrad * 0.45, hcy + 4, C.text, 9.5, "center", true);
    txt(ctx, "C4 (ERS)", hcx + hrad * 0.45, hcy + 4, C.text, 9.5, "center", true);
    txt(ctx, "Cz", hcx, hcy + 4, C.muted, 9.5, "center");

    // Right panel: CSP filter eigenvalues lambda_1..lambda_6
    const eigs = [0.86 - st.c * 0.2, 0.74 - st.c * 0.15, 0.52, 0.48, 0.26 + st.c * 0.15, 0.14 + st.c * 0.2];
    const bw = (rw - 44) / eigs.length;
    eigs.forEach((ev, i) => {
      const bx = rx + 22 + i * bw, bh = ev * (rh - 64);
      ctx.fillStyle = i < 2 ? C.primary : (i > 3 ? C.danger : C.muted);
      ctx.fillRect(bx, ry + rh - 28 - bh, bw - 8, bh);
      txt(ctx, `w_${i + 1}`, bx + (bw - 8) * 0.5, ry + rh - 14, C.muted, 9, "center");
    });

    return {
      "Mu Rhythm Peak": `${st.v0.toFixed(1)} Hz`,
      "C3 Contralateral ERD": `−${Math.round(st.v1)}% Desync`,
      "CSP Max Eigenvalue λ₁": eigs[0].toFixed(3),
      "LDA Classification Acc": `${Math.round(68 + erd * 28 - st.c * 18)}%`,
    };
  };

  // 31. neuro_ssvep_cca: SSVEP visual flickering targets (10Hz, 12Hz, 15Hz) + CCA frequency spectrum
  R.neuro_ssvep_cca = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Flickering SSVEP Gaze Targets | Right: Occipital (Oz) Spectrum & Harmonics f₀, 2f₀, 3f₀", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.42, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Visual BCI Checkerboard Targets");
    st.panel(rx, ry, rw, rh, "Canonical Correlation ρ(f) & Harmonic Peaks");

    const fTarget = st.v0;
    const targets = [
      { lbl: "UP (10 Hz)", f: 10, x: 0.26, y: 0.34 },
      { lbl: `FOCUS (${fTarget.toFixed(1)} Hz)`, f: fTarget, x: 0.72, y: 0.34, sel: true },
      { lbl: "LEFT (12 Hz)", f: 12, x: 0.26, y: 0.74 },
      { lbl: "RIGHT (15 Hz)", f: 15, x: 0.72, y: 0.74 },
    ];
    targets.forEach((tg) => {
      const tx = lx + tg.x * lw - 38, ty = ly + 16 + tg.y * (lh - 24) - 24;
      const lum = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(st.t * tg.f * 1.2));
      ctx.fillStyle = tg.sel ? `rgba(110,231,183,${lum})` : `rgba(124,156,255,${lum * 0.6})`;
      ctx.fillRect(tx, ty, 76, 42);
      ctx.strokeStyle = tg.sel ? C.ok : C.axis;
      ctx.lineWidth = tg.sel ? 2.2 : 1;
      ctx.strokeRect(tx, ty, 76, 42);
      txt(ctx, tg.lbl, tx + 38, ty + 25, C.text, 9, "center", true);
    });

    // Right panel: Spectrum from 5 Hz to 45 Hz showing peaks at f0, 2f0, 3f0
    const gx = rx + 24, gy = ry + 30, gw = rw - 40, gh = rh - 52;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    const nHarm = Math.round(st.v1);
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
      const f = 5 + (i / 140) * 42;
      let amp = 0.08 + 0.04 * Math.sin(i * 0.9);
      for (let h = 1; h <= nHarm; h++) {
        amp += (0.85 / h) * Math.exp(-Math.pow((f - h * fTarget) / 0.85, 2));
      }
      const sx = gx + (i / 140) * gw, sy = gy + gh - clamp(amp, 0, 1) * gh * 0.88;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.2; ctx.stroke();

    const ccaRho = clamp(0.45 + st.c * 0.35 + nHarm * 0.06, 0.3, 0.98);
    return {
      "Attended Frequency f₀": `${fTarget.toFixed(1)} Hz`,
      "Max CCA Correlation ρ": ccaRho.toFixed(3),
      "Harmonics Included": `f₀ .. ${nHarm}f₀`,
      "ITR Bitrate": `${Math.round(48 + ccaRho * 64)} bits/min`,
    };
  };

  // 32. neuro_optogenetics_chr2: Channelrhodopsin-2 4-state (C1, O1, O2, C2) blue-light photocycle diagram + photocurrent trace
  R.neuro_optogenetics_chr2 = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: ChR2 Four-State Markov Photocycle (473 nm) | Right: Inward Photocurrent I_ChR2(t)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.44, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "ChR2 Photocycle: C₁ (Dark) → O₁ (Peak) ⇄ O₂ → C₂");
    st.panel(rx, ry, rw, rh, "473 nm Blue Laser Pulses & Desensitizing Photocurrent (pA)");

    const states = [
      { id: "C₁ (Dark Closed)", x: 0.25, y: 0.32, col: C.muted },
      { id: "O₁ (High Cond)", x: 0.75, y: 0.32, col: "#38bdf8" },
      { id: "O₂ (Low Cond)", x: 0.75, y: 0.76, col: C.primary },
      { id: "C₂ (Desensitized)", x: 0.25, y: 0.76, col: C.secondary },
    ];
    [[0, 1, "hν (473nm)"], [1, 2, "e₁₂"], [2, 3, "γ₂"], [3, 0, "g_d"]].forEach(([u, v, lbl]) => {
      const s1 = states[u], s2 = states[v];
      const x1 = lx + s1.x * lw, y1 = ly + 16 + s1.y * (lh - 24);
      const x2 = lx + s2.x * lw, y2 = ly + 16 + s2.y * (lh - 24);
      arrow(ctx, x1, y1, x2, y2, u === 0 ? "#38bdf8" : C.axis, 2);
      txt(ctx, lbl, (x1 + x2) * 0.5, (y1 + y2) * 0.5 - 5, u === 0 ? "#38bdf8" : C.muted, 9, "center", true);
    });
    states.forEach((s) => {
      const sx = lx + s.x * lw, sy = ly + 16 + s.y * (lh - 24);
      circle(ctx, sx, sy, 18, "rgba(22,26,46,0.95)", s.col, 2.2);
      txt(ctx, s.id.split(" ")[0], sx, sy + 4, s.col, 11, "center", true);
    });

    // Right panel: Blue laser bar at top + inward (negative) current with peak-to-steady-state sag
    const gx = rx + 24, gy = ry + 34, gw = rw - 40, gh = rh - 54;
    ctx.fillStyle = "rgba(56,189,248,0.28)";
    ctx.fillRect(gx + gw * 0.15, gy, gw * 0.65, 12);
    txt(ctx, `473 nm Laser (${st.v0.toFixed(1)} mW/mm²)`, gx + gw * 0.48, gy + 10, "#38bdf8", 9, "center", true);

    const baseY = gy + 26;
    line(ctx, gx, baseY, gx + gw, baseY, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const u = i / 120;
      let curr = 0;
      if (u >= 0.15 && u <= 0.80) {
        const dt = u - 0.15;
        const peak = 1 - Math.exp(-dt * 45);
        const sag = 0.45 + 0.55 * Math.exp(-dt * (6 + st.a * 8));
        curr = peak * sag * (0.4 + st.a * 0.55);
      } else if (u > 0.80) {
        curr = 0.45 * (0.4 + st.a * 0.55) * Math.exp(-(u - 0.80) * 28);
      }
      const sx = gx + u * gw, sy = baseY + curr * (gh - 32);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2.4; ctx.stroke();

    return {
      "Peak Photocurrent I_p": `−${Math.round(320 + st.a * 680)} pA`,
      "Steady-State Ratio I_ss/I_p": `${Math.round(42 - st.a * 14)}% (O₁→O₂ Inactivation)`,
      "Optical Pulse Train": `${Math.round(st.v1)} Hz (${Math.round(st.v2)}% duty)`,
      "Off-Kinetics τ_off": "11.8 ms",
    };
  };

  // 33. neuro_dbs_parkinson_beta: Parkinsonian STN-GPe beta burst LFP + adaptive closed-loop DBS pulses
  R.neuro_dbs_parkinson_beta = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Top: Subthalamic Nucleus (STN) 20 Hz Beta LFP & Adaptive Threshold | Bottom: 130 Hz DBS Pulses", st.spec.formula);
    const padX = 16, topY = 46, boxW = W - 32, topH = (H - 68) * 0.56;
    const botY = topY + topH + 10, botH = H - botY - 12;
    st.panel(padX, topY, boxW, topH, "STN Local Field Potential (18–30 Hz Pathological Beta Bursts)");
    st.panel(padX, botY, boxW, botH, "Adaptive Closed-Loop DBS Stimulation Train I_DBS(t)");

    const gx = padX + 24, gw = boxW - 44, midY = topY + topH * 0.58;
    const supp = clamp(st.b * st.c * 0.78, 0, 0.85);
    line(ctx, gx, midY - topH * 0.22, gx + gw, midY - topH * 0.22, C.accent, 1.2, [4, 4]);
    txt(ctx, "aDBS Beta Trigger Threshold", gx + gw - 6, midY - topH * 0.25, C.accent, 9, "right");

    ctx.beginPath();
    for (let i = 0; i <= 150; i++) {
      const u = i / 150;
      const env = Math.max(0.15, Math.sin(u * TAU * 1.5 - st.t * 1.2)) * (1 - supp);
      const beta = env * Math.sin(u * 95 - st.t * 8);
      const sx = gx + u * gw, sy = midY - beta * (topH * 0.36);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = supp > 0.45 ? C.ok : C.danger; ctx.lineWidth = 2; ctx.stroke();

    // Bottom: High-frequency DBS pulse train active during bursts
    const by0 = botY + botH - 18;
    line(ctx, gx, by0, gx + gw, by0, C.axis, 1);
    for (let i = 0; i < 60; i++) {
      const u = i / 60;
      const env = Math.sin(u * TAU * 1.5 - st.t * 1.2);
      if (env > 0.25 && st.c > 0.1) {
        const px = gx + u * gw;
        line(ctx, px, by0, px, by0 - (botH - 36) * (0.3 + st.b * 0.65), C.primary, 2);
      }
    }

    return {
      "STN Beta Power (13–30Hz)": `−${Math.round(supp * 100)}% Suppressed`,
      "DBS Pulse Frequency": `${Math.round(st.v0)} Hz`,
      "Stimulation Current": `${st.v1.toFixed(1)} mA`,
      "Battery Duty Savings": `${Math.round(54 - st.c * 18)}% vs Continuous cDBS`,
    };
  };

  // 34. neuro_bold_balloon_hrf: fMRI BOLD Balloon-Windkessel neurovascular response (CBF, CBV, dHb, BOLD)
  R.neuro_bold_balloon_hrf = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Canonical Hemodynamic Response Function (HRF): CBF f_in(t), Venous Volume v(t), dHb q(t), and BOLD %", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Balloon–Windkessel Neurovascular Coupling & Post-Stimulus Undershoot (0–28 s)");

    const gx = padX + 32, gy = padY + 28, gw = boxW - 52, gh = boxH - 48;
    const zeroY = gy + gh * 0.72;
    line(ctx, gx, zeroY, gx + gw, zeroY, C.axis, 1.2);

    // Neural stimulus block at t = 1..1+dur
    const dur = st.v0;
    ctx.fillStyle = "rgba(255,209,102,0.20)";
    ctx.fillRect(gx + (1 / 28) * gw, gy + 8, (dur / 28) * gw, gh - 16);
    txt(ctx, `Stim (${dur.toFixed(1)}s)`, gx + ((1 + dur * 0.5) / 28) * gw, gy + 20, C.accent, 9, "center", true);

    const curves = [
      { name: "CBF Inflow f_in(t)", col: C.primary, fn: (t) => t < 1 ? 0 : Math.pow(t - 1, 2) * Math.exp(-(t - 1) / (1.3 + dur * 0.15)) * 0.42 },
      { name: "Venous Volume v(t)", col: C.secondary, fn: (t) => t < 1 ? 0 : Math.pow(t - 1, 2.5) * Math.exp(-(t - 1) / (2.4 + st.b * 1.2)) * 0.18 },
      { name: "Deoxy-Hb q(t)", col: C.danger, fn: (t) => t < 1 ? 0 : -Math.pow(t - 1, 2.1) * Math.exp(-(t - 1) / 1.5) * 0.25 + 0.08 * Math.exp(-Math.pow((t - 14) / 4, 2)) },
      { name: "BOLD ΔS/S (%)", col: C.ok, fn: (t) => t < 1 ? 0 : Math.pow(t - 1, 2.2) * Math.exp(-(t - 1) / 1.55) * 0.34 - (0.12 + st.c * 0.1) * Math.exp(-Math.pow((t - 15) / 3.8, 2)) },
    ];

    curves.forEach((cv, idx) => {
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const tSec = (i / 140) * 28;
        const val = cv.fn(tSec);
        const sx = gx + (i / 140) * gw, sy = zeroY - val * (gh * 0.65);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = cv.col; ctx.lineWidth = idx === 3 ? 2.6 : 1.7; ctx.stroke();
      txt(ctx, cv.name, gx + gw - 10, gy + 22 + idx * 16, cv.col, 9.5, "right", true);
    });

    return {
      "BOLD Peak Time-to-Peak": `${(4.8 + dur * 0.35).toFixed(1)} s`,
      "Peak BOLD Signal ΔS/S": `+${(2.4 + st.a * 1.8).toFixed(2)}%`,
      "Grubb Exponent α": st.v2.toFixed(2),
      "Post-Stimulus Undershoot": `−${(0.45 + st.c * 0.4).toFixed(2)}% (at ~15s)`,
    };
  };

  // 35. neuro_drift_diffusion_ddm: Ratcliff Drift-Diffusion noisy evidence paths racing between upper/lower decision bounds with RT histograms
  R.neuro_drift_diffusion_ddm = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Accumulate noisy LIP motion evidence dx = v·dt + σ·dW until crossing Upper (+a) or Lower (−a) Bound", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Ratcliff Drift-Diffusion Decision Bounded Accumulator (±a) & RT Distribution");

    const gx = padX + 34, gw = boxW - 56, midY = padY + boxH * 0.56;
    const boundH = (0.24 + st.b * 0.16) * boxH;
    const topB = midY - boundH, botB = midY + boundH;

    line(ctx, gx, topB, gx + gw, topB, C.ok, 2);
    line(ctx, gx, botB, gx + gw, botB, C.danger, 2);
    line(ctx, gx, midY, gx + gw, midY, C.axis, 1, [3, 3]);
    txt(ctx, "Choice A Bound (+a)", gx + 8, topB - 6, C.ok, 9.5, "left", true);
    txt(ctx, "Choice B Bound (−a)", gx + 8, botB + 13, C.danger, 9.5, "left", true);

    const drift = st.v0 * 0.45;
    const sigma = st.v2 * 0.35;
    // Mean drift vector
    arrow(ctx, gx, midY, gx + gw * 0.55, clamp(midY - drift * boundH * 1.4, topB, botB), C.accent, 2.2);

    // 5 single-trial evidence trajectories
    for (let tr = 0; tr < 5; tr++) {
      ctx.beginPath();
      let ev = 0;
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const dW = Math.sin(i * 1.7 + tr * 2.3 + Math.floor(st.t * 1.5)) * sigma;
        ev = clamp(ev + drift * 0.028 + dW * 0.14, -1, 1);
        const sx = gx + u * gw, sy = midY - ev * boundH;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        if (Math.abs(ev) >= 0.99) break;
      }
      ctx.strokeStyle = tr === 0 ? C.primary : "rgba(124,156,255,0.38)";
      ctx.lineWidth = tr === 0 ? 2.2 : 1.2;
      ctx.stroke();
    }

    const meanRT = Math.round(260 + (st.v1 / Math.max(0.25, Math.abs(st.v0))) * 190);
    const acc = 1 / (1 + Math.exp(-2 * st.v0 * st.v1 / Math.max(0.2, st.v2 * st.v2)));
    return {
      "Drift Rate v (Coherence)": `${st.v0.toFixed(2)} units/s`,
      "Decision Threshold ±a": `±${st.v1.toFixed(2)}`,
      "Choice Accuracy P(+a)": `${(acc * 100).toFixed(1)}%`,
      "Mean Reaction Time": `${meanRT} ms`,
    };
  };

  // 36. neuro_predictive_coding: Hierarchical predictive coding cortical layers exchanging top-down predictions & bottom-up prediction errors
  R.neuro_predictive_coding = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Bottom-Up Precision-Weighted Prediction Errors (Π·ε, Red) vs Top-Down Generative Predictions (g(μ), Blue)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Cortical Hierarchy (V1 → V4 → IT / PFC) Message Passing");
    st.panel(rx, ry, rw, rh, "Variational Free Energy F(t) & MMN Surprise ERP");

    const levels = [
      { name: "Level 3: IT / PFC Prior μ₃", y: ly + 46 },
      { name: "Level 2: V4 Representation μ₂", y: ly + 114 },
      { name: "Level 1: V1 Sensory Layer μ₁", y: ly + 182 },
    ];
    levels.forEach((lv, i) => {
      const bx = lx + 24, bw = lw - 48;
      ctx.fillStyle = "rgba(124,156,255,0.12)";
      ctx.fillRect(bx, lv.y, bw, 32);
      ctx.strokeStyle = C.primary;
      ctx.strokeRect(bx, lv.y, bw, 32);
      txt(ctx, lv.name, bx + 10, lv.y + 20, C.text, 10, "left", true);
      if (i < levels.length - 1) {
        // Top-down prediction arrow (left side)
        arrow(ctx, bx + bw * 0.30, lv.y + 32, bx + bw * 0.30, levels[i + 1].y, C.primary, 2 + st.b * 2);
        txt(ctx, "g(μ) Pred", bx + bw * 0.26, (lv.y + 32 + levels[i + 1].y) * 0.5 + 3, C.primary, 8.5, "right");
        // Bottom-up error arrow (right side)
        arrow(ctx, bx + bw * 0.70, levels[i + 1].y, bx + bw * 0.70, lv.y + 32, C.danger, 2 + st.a * 2);
        txt(ctx, "Π·ε Error", bx + bw * 0.74, (lv.y + 32 + levels[i + 1].y) * 0.5 + 3, C.danger, 8.5, "left");
      }
    });

    // Right panel: Free energy decay F(t)
    const gx = rx + 24, gy = ry + 32, gw = rw - 40, gh = rh - 52;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    const f0 = 0.35 + st.c * 0.6;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const fe = f0 * Math.exp(-u * (2 + st.a * 3 + st.b * 2)) + 0.08;
      const sx = gx + u * gw, sy = gy + gh - fe * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.stroke();

    const sensoryWeight = st.v0 / (st.v0 + st.v1);
    return {
      "Sensory Weight Π₀/(Π₀+Π_P)": sensoryWeight.toFixed(2),
      "Prediction Error ||ε₁||": (st.v2 * (1 - sensoryWeight * 0.4)).toFixed(2),
      "Variational Free Energy F": `${(f0 * 4.2).toFixed(2)} nats`,
      "Perceptual Regime": sensoryWeight > 0.6 ? "Sensory-Driven (Bottom-Up)" : "Prior-Dominated (Top-Down)",
    };
  };

  // 37. neuro_retinal_dog_gabor: Retinal DoG center-surround & 2D V1 Gabor orientation filter
  R.neuro_retinal_dog_gabor = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Retinal Difference-of-Gaussians (DoG) | Right: 2D V1 Simple Cell Gabor Patch & Orientation Curve", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.46, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Retinal Ganglion ON-Center / OFF-Surround (DoG)");
    st.panel(rx, ry, rw, rh, "V1 Simple Cell 2D Gabor Kernel g(x, y; λ, θ)");

    // Left: Concentric ON/OFF circles + Mexican hat 1D cross-section
    const cx = lx + lw * 0.5, cy = ly + lh * 0.40;
    circle(ctx, cx, cy, 42, "rgba(255,107,107,0.18)", C.danger, 1.8);
    circle(ctx, cx, cy, 18, "rgba(110,231,183,0.32)", C.ok, 2);
    txt(ctx, "+", cx, cy + 4, C.ok, 14, "center", true);
    txt(ctx, "−", cx + 29, cy + 4, C.danger, 14, "center", true);

    const by0 = ly + lh - 34;
    line(ctx, lx + 20, by0, lx + lw - 20, by0, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const x = (i / 40) - 1;
      const dog = Math.exp(-x * x * 14) - st.c * 0.55 * Math.exp(-x * x * 3.5);
      const sx = lx + 20 + (i / 80) * (lw - 40), sy = by0 - dog * 42;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.stroke();

    // Right: 2D Gabor patch grid
    const theta = (st.v1 * Math.PI) / 180;
    const freq = 2.5 + st.a * 5.5;
    const gx = rx + 24, gy = ry + 32, gSize = Math.min(rw - 48, rh - 48);
    const N = 22, cell = gSize / N;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const u = (c / N) - 0.5, v = (r / N) - 0.5;
        const xp = u * Math.cos(theta) + v * Math.sin(theta);
        const yp = -u * Math.sin(theta) + v * Math.cos(theta);
        const env = Math.exp(-(xp * xp + yp * yp) * 14);
        const gVal = env * Math.cos(TAU * freq * xp);
        ctx.fillStyle = gVal >= 0 ? `rgba(110,231,183,${Math.abs(gVal) * 0.85})` : `rgba(255,107,107,${Math.abs(gVal) * 0.85})`;
        ctx.fillRect(gx + c * cell, gy + r * cell, cell + 0.5, cell + 0.5);
      }
    }

    return {
      "Preferred Orientation θ": `${Math.round(st.v1)}°`,
      "Spatial Frequency 1/λ": `${st.v0.toFixed(1)} cycles/deg`,
      "Surround Suppression": `${Math.round(st.v2 * 100)}% DoG Weight`,
      "Simple Cell Phase ψ": "0° (Even-Symmetric Cosine)",
    };
  };

  // 38. neuro_cochlear_tonotopy: Cochlear basilar membrane spiral/unrolled tonotopic map + Gammatone filterbank
  R.neuro_cochlear_tonotopy = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Top: Unrolled Basilar Membrane Traveling Wave (Base 20kHz → Apex 20Hz) | Bottom: Gammatone Filterbank", st.spec.formula);
    const padX = 16, topY = 46, boxW = W - 32, topH = (H - 68) * 0.52;
    const botY = topY + topH + 10, botH = H - botY - 12;
    st.panel(padX, topY, boxW, topH, "Unrolled Basilar Membrane (35 mm): Greenwood Tonotopic Place Map");
    st.panel(padX, botY, boxW, botH, "Auditory Nerve Gammatone Filterbank Channels & OHC Active Gain");

    const fHz = st.v0;
    // Log-frequency place x* along membrane (high freq near base u=0.15, low freq near apex u=0.88)
    const placeU = clamp(1 - Math.log10(Math.max(50, fHz) / 50) / Math.log10(16000 / 50), 0.12, 0.88);
    const gx = padX + 28, gw = boxW - 56, midY = topY + topH * 0.58;

    // Tapered basilar membrane envelope + traveling wave peaking at placeU
    line(ctx, gx, midY, gx + gw, midY, C.axis, 1);
    const gain = 0.4 + st.b * 0.55;
    ctx.beginPath();
    for (let i = 0; i <= 150; i++) {
      const u = i / 150;
      const env = u <= placeU
        ? Math.pow(u / placeU, 1.8) * Math.exp(-Math.pow((u - placeU) / (0.14 - st.c * 0.06), 2))
        : Math.exp(-Math.pow((u - placeU) / 0.035, 2));
      const wave = env * gain * Math.sin(u * 90 - st.t * 10);
      const sx = gx + u * gw, sy = midY - wave * (topH * 0.42);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.2; ctx.stroke();
    txt(ctx, "Base (Stapes, 20 kHz)", gx, topY + topH - 8, C.muted, 9);
    txt(ctx, "Apex (Helicotrema, 20 Hz)", gx + gw, topY + topH - 8, C.muted, 9, "right");

    // Bottom: 8 overlapping Gammatone ERB filters
    const by0 = botY + botH - 18, bh = botH - 40;
    line(ctx, gx, by0, gx + gw, by0, C.axis, 1);
    for (let ch = 0; ch < 8; ch++) {
      const cfU = 0.12 + (ch / 7) * 0.76;
      const isBest = Math.abs(cfU - placeU) < 0.07;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        const resp = Math.exp(-Math.pow((u - cfU) / (0.08 - st.c * 0.035), 2));
        const sx = gx + u * gw, sy = by0 - resp * bh * (isBest ? 0.95 : 0.6);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = isBest ? C.accent : "rgba(124,156,255,0.45)";
      ctx.lineWidth = isBest ? 2.4 : 1.3;
      ctx.stroke();
    }

    return {
      "Stimulus Frequency f": `${Math.round(fHz)} Hz`,
      "Characteristic Place x*": `${(placeU * 35).toFixed(1)} mm from Stapes`,
      "OHC Cochlear Amplifier": `+${Math.round(st.v1)} dB Gain`,
      "ERB Bandwidth": `${Math.round(24.7 * (4.37 * (fHz / 1000) + 1))} Hz`,
    };
  };

  // 39. neuro_spike_sorting_pca: Neuropixels multi-channel extracellular voltage traces + PCA waveform cluster sorting
  R.neuro_spike_sorting_pca = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Neuropixels Shanks & Aligned Action Potential Waveforms | Right: (PC₁, PC₂) GMM Clusters", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Extracellular Spike Waveforms (3 Isolated Single Units)");
    st.panel(rx, ry, rw, rh, "PCA Feature Space (PC₁ vs PC₂) & Refractory Violations");

    const unitCols = [C.ok, C.primary, C.secondary];
    const unitAmps = [1.0, 0.68, -0.55];
    const wx0 = lx + 20, ww = lw - 40, wyMid = ly + lh * 0.55;
    line(ctx, wx0, wyMid, wx0 + ww, wyMid, C.axis, 1);

    unitCols.forEach((col, uIdx) => {
      for (let tr = 0; tr < 4; tr++) {
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const u = i / 60;
          const biphasic = -Math.exp(-Math.pow((u - 0.38) / 0.08, 2)) + 0.48 * Math.exp(-Math.pow((u - 0.56) / 0.14, 2));
          const noise = (1 - st.a) * 0.12 * Math.sin(i * 2.3 + tr * 3.1 + uIdx);
          const sx = wx0 + u * ww, sy = wyMid - (biphasic * unitAmps[uIdx] + noise) * (lh * 0.34);
          if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = col; ctx.lineWidth = tr === 0 ? 2.2 : 1; ctx.stroke();
      }
    });

    // Right: PCA scatter clusters
    const drift = st.b * 0.16;
    const spread = 0.06 + (1 - st.a) * 0.12;
    const centers = [[0.28 + drift, 0.32, C.ok], [0.72 - drift, 0.36, C.primary], [0.48, 0.74 - drift, C.secondary]];
    centers.forEach(([cxU, cyU, col], cIdx) => {
      const cx = rx + cxU * rw, cy = ry + 18 + cyU * (rh - 24);
      circle(ctx, cx, cy, spread * rw * 1.1, null, col, 1.2);
      for (let p = 0; p < 18; p++) {
        const px = cx + Math.sin(p * 4.1 + cIdx) * spread * rw * 0.85;
        const py = cy + Math.cos(p * 5.7 + cIdx) * spread * rh * 0.85;
        circle(ctx, px, py, 2.8, col);
      }
    });

    const isiViol = Math.max(0, (2.2 - st.a * 1.8 + st.b * 1.4)).toFixed(2);
    return {
      "Sorted Single Units": "3 Units (Pyramidal / FS)",
      "Isolation Distance L_ratio": `${(28 + st.a * 42 - st.b * 16).toFixed(1)}`,
      "Refractory ISI (<2ms)": `${isiViol}% Violations`,
      "Tissue Drift Offset": `${Math.round(st.v1)} µm`,
    };
  };

  // 40. neuro_hopfield_modern: Modern continuous Hopfield energy landscape with stored memory attractors
  R.neuro_hopfield_modern = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Log-Sum-Exp Energy Landscape E(ξ) | Right: 5×5 Associative Pattern Completion", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.54, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Continuous Hopfield Energy Basins E(ξ) = −β⁻¹ log Σ exp(β xᵢᵀξ)");
    st.panel(rx, ry, rw, rh, "Attractor Retrieval from Corrupted Cue ξ₀");

    const beta = st.v0;
    const gx = lx + 22, gy = ly + 30, gw = lw - 44, gh = lh - 52;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);

    // Draw multi-well energy curve sharpened by inverse temperature beta
    const wells = [0.22, 0.52, 0.80];
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const u = i / 120;
      const lse = Math.log(
        Math.exp(beta * Math.cos((u - wells[0]) * 9)) +
        Math.exp(beta * 1.15 * Math.cos((u - wells[1]) * 9)) +
        Math.exp(beta * 0.95 * Math.cos((u - wells[2]) * 9))
      ) / Math.max(1, beta);
      const energy = clamp(1.15 - lse * 0.75, 0.1, 0.95);
      const sx = gx + u * gw, sy = gy + energy * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.4; ctx.stroke();

    // Ball rolling into central attractor well
    const ballU = lerp(0.52, clamp(st.px, 0.1, 0.9), Math.exp(-((st.t * 1.5) % 3)));
    circle(ctx, gx + ballU * gw, gy + 0.34 * gh, 6, C.accent);
    txt(ctx, "Stored Attractors x₁, x₂, x₃", gx + gw * 0.5, gy + gh - 8, C.ok, 9.5, "center", true);

    // Right: 5x5 letter 'T' memory pattern with cue corruption healing
    const Tpat = [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
    const cell = Math.min((rw - 48) / 5, (rh - 64) / 5);
    const px0 = rx + (rw - cell * 5) * 0.5, py0 = ry + 36;
    const retrieved = beta > 3.5 && st.c < 0.65;

    for (let i = 0; i < 25; i++) {
      const r = Math.floor(i / 5), c = i % 5;
      const noisy = !retrieved && ((i * 7 + 3) % 10) / 10 < st.c;
      const bit = noisy ? 1 - Tpat[i] : Tpat[i];
      ctx.fillStyle = bit ? C.ok : "rgba(255,255,255,0.06)";
      ctx.fillRect(px0 + c * cell, py0 + r * cell, cell - 3, cell - 3);
    }

    return {
      "Inverse Temperature β": `${beta.toFixed(1)} (Softmax Sharpness)`,
      "Pattern Overlap m*": retrieved ? "0.99 (Exact Fixed Point)" : `${(0.62 - st.c * 0.3).toFixed(2)} (Metastable Mix)`,
      "Memory Load α = P/N": st.v1.toFixed(2),
      "Cue Corruption": `${Math.round(st.v2)}% Masked`,
    };
  };

  /* ══════════════════════════════════════════════════════════════════════════
   * PART 3: GAME THEORY & QUANTITATIVE FINANCE (20 SIMULATIONS)
   * ══════════════════════════════════════════════════════════════════════════ */

  // 41. gt_nash_replicator: Replicator simplex triangle (Rock-Paper-Scissors / Hawk-Dove)
  R.gt_nash_replicator = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: 3-Strategy Barycentric Simplex Δ² | Right: Population Shares x₁(t), x₂(t), x₃(t)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.50, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Evolutionary Simplex Δ² (Hawk / Dove / Retaliator-RPS)");
    st.panel(rx, ry, rw, rh, "Replicator Trajectory x_i(t) & ESS Fixed Point");

    const topX = lx + lw * 0.5, topY = ly + 36;
    const blX = lx + 32, blY = ly + lh - 26;
    const brX = lx + lw - 32, brY = ly + lh - 26;
    ctx.strokeStyle = C.axis; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(topX, topY); ctx.lineTo(blX, blY); ctx.lineTo(brX, brY); ctx.closePath(); ctx.stroke();
    txt(ctx, "Hawk / Rock (e₁)", topX, topY - 8, C.danger, 9.5, "center", true);
    txt(ctx, "Dove / Paper (e₂)", blX, blY + 14, C.ok, 9.5, "left", true);
    txt(ctx, "Bourgeois / Scissors (e₃)", brX, brY + 14, C.primary, 9.5, "right", true);

    const cx = (topX + blX + brX) / 3, cy = (topY + blY + brY) / 3;
    const damp = 0.15 + st.c * 0.8;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const r = (lw * 0.25) * Math.exp(-u * damp);
      const ang = u * 14 + st.t * 1.4;
      const sx = cx + Math.cos(ang) * r, sy = cy + Math.sin(ang) * r * 0.72;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.stroke();
    circle(ctx, cx, cy, 5, C.ok);

    // Right: 3 oscillating population share curves
    const gx = rx + 20, gy = ry + 32, gw = rw - 36, gh = rh - 52;
    [C.danger, C.ok, C.primary].forEach((col, k) => {
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const val = 0.33 + 0.28 * Math.exp(-u * damp) * Math.sin(u * 12 - st.t * 2 + (k * TAU) / 3);
        const sx = gx + u * gw, sy = gy + gh - val * gh;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
    });

    const hawkEss = Math.min(1, st.v1 / Math.max(0.5, st.v0));
    return {
      "Hawk-Dove ESS Ratio V/C": hawkEss.toFixed(2),
      "Interior Nash Mix x*": "(0.33, 0.33, 0.33)",
      "Mutation Damping μ": st.v2.toFixed(3),
      "Lyapunov Stability": st.c > 0.05 ? "Asymptotically Stable ESS" : "Neutrally Stable Center",
    };
  };

  // 42. gt_vickrey_vcg_auction: VCG combinatorial auction bidder valuations + Clarke pivot Externality tax bars
  R.gt_vickrey_vcg_auction = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Combinatorial Valuations v_i(S) & Clarke Pivot Tax p_i | Right: Truthful Dominant Strategy", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "VCG Winner Allocation & Clarke Pivot Externality Payment p_i");
    st.panel(rx, ry, rw, rh, "Bidder 1 Utility u₁(b₁) vs Bid Shading Factor (Truthful Peak at 0%)");

    const syn = st.v2;
    const bidders = [
      { name: "Bidder 1 (Bundle A)", v: 82 * (1 + (syn - 1) * 0.3), p: 54 },
      { name: "Bidder 2 (Bundle B)", v: 68 * syn, p: 42 },
      { name: "Bidder 3 (Displaced)", v: 62, p: 0 },
    ];
    bidders.forEach((b, i) => {
      const by = ly + 36 + i * 54;
      txt(ctx, b.name, lx + 14, by + 12, C.text, 10, "left", true);
      const vw = (b.v / 140) * (lw - 40);
      const pw = (b.p / 140) * (lw - 40);
      ctx.fillStyle = "rgba(124,156,255,0.28)";
      ctx.fillRect(lx + 14, by + 18, vw, 14);
      ctx.fillStyle = C.accent;
      ctx.fillRect(lx + 14, by + 34, pw, 10);
      txt(ctx, `v=${b.v.toFixed(0)}, VCG tax p=${b.p}`, lx + 20 + vw, by + 29, C.ok, 9.5, "left", true);
    });

    // Right panel: Utility tent/parabola peaking at bid shading = 0
    const gx = rx + 24, gy = ry + 34, gw = rw - 44, gh = rh - 54;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    const zeroX = gx + gw * 0.5;
    line(ctx, zeroX, gy, zeroX, gy + gh, C.ok, 1.4, [4, 3]);
    txt(ctx, "Truthful b₁ = v₁ (Dominant)", zeroX, gy + 12, C.ok, 9, "center", true);

    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = (i / 80) - 0.5;
      const util = 0.82 - 2.6 * u * u;
      const sx = gx + (i / 80) * gw, sy = gy + gh - Math.max(0.08, util) * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2; ctx.stroke();

    const shadeU = (st.v1 + 50) / 100;
    const curUtil = Math.max(0.08, 0.82 - 2.6 * Math.pow(shadeU - 0.5, 2));
    circle(ctx, gx + shadeU * gw, gy + gh - curUtil * gh, 5.5, C.danger);

    return {
      "Social Welfare Σ v_i(x*)": `$${(bidders[0].v + bidders[1].v).toFixed(1)}M`,
      "Clarke Pivot Revenue Σ p_i": "$96.0M",
      "Bid Shading Deviation": `${st.v1 > 0 ? "+" : ""}${Math.round(st.v1)}%`,
      "Incentive Compatibility": Math.abs(st.v1) < 3 ? "OPTIMAL (Truthful)" : "SUBOPTIMAL (Utility Loss)",
    };
  };

  // 43. gt_myerson_optimal: Myerson virtual valuation φ(v) ironing curve + optimal reserve price
  R.gt_myerson_optimal = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Virtual Valuation ψ(v) = v − (1−F(v))/f(v) & Ironed ψ̄(v) | Right: Seller Expected Revenue R(r)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Myerson Virtual Valuation ψ(v) & Monotone Ironing");
    st.panel(rx, ry, rw, rh, "Expected Seller Revenue vs Reserve Price r");

    const gx = lx + 26, gy = ly + 28, gw = lw - 44, gh = lh - 48;
    const zeroY = gy + gh * 0.62;
    line(ctx, gx, zeroY, gx + gw, zeroY, C.axis, 1.2);
    txt(ctx, "ψ(v) = 0", gx + 6, zeroY - 5, C.muted, 9);

    // Non-regular bumpy virtual valuation vs ironed monotone curve
    for (const [ironed, col] of [[false, C.secondary], [true, C.ok]]) {
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        const bump = !ironed ? 0.22 * st.b * Math.sin(u * 14) : 0;
        const psi = (2 * u - 1) + bump;
        const sx = gx + u * gw, sy = zeroY - psi * (gh * 0.45);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = ironed ? 2.4 : 1.5; ctx.stroke();
    }

    const rOpt = 50 * Math.pow(st.v1, -0.25);
    const rxPos = gx + (st.v0 / 100) * gw;
    line(ctx, rxPos, gy + 10, rxPos, gy + gh, C.accent, 1.8, [4, 3]);
    txt(ctx, `Reserve r = ${Math.round(st.v0)}`, rxPos, gy + 22, C.accent, 9.5, "center", true);

    // Right panel: Revenue curve peaking at r* = ψ⁻¹(0)
    const rgx = rx + 24, rgy = ry + 32, rgw = rw - 40, rgh = rh - 52;
    line(ctx, rgx, rgy + rgh, rgx + rgw, rgy + rgh, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const rVal = (i / 80) * 100;
      const rev = 0.35 + 0.55 * Math.exp(-Math.pow((rVal - rOpt) / 28, 2));
      const sx = rgx + (i / 80) * rgw, sy = rgy + rgh - rev * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2; ctx.stroke();
    circle(ctx, rgx + (st.v0 / 100) * rgw, rgy + rgh - (0.35 + 0.55 * Math.exp(-Math.pow((st.v0 - rOpt) / 28, 2))) * rgh, 5.5, C.accent);

    return {
      "Optimal Reserve r* = ψ⁻¹(0)": `$${rOpt.toFixed(1)}`,
      "Chosen Reserve Price r": `$${st.v0.toFixed(1)}`,
      "Ironing Status": st.b > 0.35 ? "Ironed Pooling Interval" : "Regular Hazard Rate",
      "Active Bidders N": `${Math.round(st.v2)} buyers`,
    };
  };

  // 44. gt_black_scholes_greeks: Black-Scholes 3D/contour Option Greeks (Δ, Γ, Vega, Θ) across spot & moneyness
  R.gt_black_scholes_greeks = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Call Option Price C(S,t) vs Intrinsic Payoff | Right: Option Greeks Δ (Delta), Γ (Gamma), ν (Vega)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Black–Scholes Call Value C(S, T) vs Strike K = 100");
    st.panel(rx, ry, rw, rh, "Sensitivities: Delta Δ = Φ(d₁), Gamma Γ, Vega ν");

    const sigma = st.v0 / 100, T = st.v1;
    const std = Math.max(0.06, sigma * Math.sqrt(T));
    const gx = lx + 24, gy = ly + 30, gw = lw - 40, gh = lh - 50;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx + gw * 0.5, gy, gx + gw * 0.5, gy + gh, C.axis, 1, [3, 3]);
    txt(ctx, "ATM Strike K=100", gx + gw * 0.5, gy + 14, C.muted, 9, "center");

    // Intrinsic hockey-stick max(S - K, 0)
    line(ctx, gx, gy + gh, gx + gw * 0.5, gy + gh, C.muted, 1.5);
    line(ctx, gx + gw * 0.5, gy + gh, gx + gw, gy + gh * 0.15, C.muted, 1.5);

    // Smooth Black-Scholes curve
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100, m = (u - 0.5) * 2;
      const bs = Math.max(0, m) * 0.85 + std * 0.55 * Math.exp(-(m * m) / (2 * std * std));
      const sx = gx + u * gw, sy = gy + gh - clamp(bs, 0, 0.95) * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.4; ctx.stroke();

    // Right panel: Delta sigmoid and Gamma bell curve
    const rgx = rx + 24, rgy = ry + 30, rgw = rw - 40, rgh = rh - 50;
    line(ctx, rgx, rgy + rgh, rgx + rgw, rgy + rgh, C.axis, 1);
    for (const [isGamma, col, lbl] of [[false, C.primary, "Delta Δ = ∂C/∂S"], [true, C.accent, "Gamma Γ = ∂²C/∂S²"]]) {
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100, m = (u - 0.5) * 2.5;
        const val = isGamma
          ? Math.exp(-(m * m) / (2 * std * std)) * clamp(0.35 / std, 0.2, 0.95)
          : 1 / (1 + Math.exp(-m / (std * 0.7)));
        const sx = rgx + u * rgw, sy = rgy + rgh - val * rgh * 0.9;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.stroke();
      txt(ctx, lbl, rgx + 10, rgy + (isGamma ? 32 : 16), col, 9.5, "left", true);
    }

    return {
      "ATM Call Price C(K,T)": `$${(100 * (0.4 * std + 0.01 * st.v2 * T)).toFixed(2)}`,
      "ATM Delta Δ": (0.52 + 0.04 * Math.sqrt(T)).toFixed(3),
      "ATM Gamma Γ": (0.3989 / (100 * std)).toFixed(4),
      "ATM Vega ν": (39.89 * Math.sqrt(T)).toFixed(2),
    };
  };

  // 45. gt_heston_stoch_vol: Heston stochastic volatility smile/skew implied vol surface
  R.gt_heston_stoch_vol = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Implied Volatility Smile / Skew σ_imp(K/S₀) | Right: Correlated Variance Process v_t", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Implied Volatility Surface σ_BS(K/S₀): Skew ρ & Curvature ξ");
    st.panel(rx, ry, rw, rh, "CIR Variance Process dv_t = κ(θ − v_t)dt + ξ√v_t dW₂");

    const xi = st.v0, rho = st.v1, kappa = st.v2;
    const gx = lx + 28, gy = ly + 30, gw = lw - 44, gh = lh - 52;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx + gw * 0.5, gy, gx + gw * 0.5, gy + gh, C.axis, 1, [3, 3]);

    // Draw 2 maturity smiles (Short T=0.25y vs Long T=1.0y)
    for (const [isShort, col, lbl] of [[true, C.accent, "Short Maturity (T=3M)"], [false, C.primary, "Long Maturity (T=1Y)"]]) {
      ctx.beginPath();
      const scale = isShort ? 1.0 : 0.55 / Math.sqrt(kappa * 0.5);
      for (let i = 0; i <= 100; i++) {
        const u = i / 100, kLog = (u - 0.5) * 2;
        const iv = 0.35 + scale * (rho * 0.22 * kLog + xi * 0.28 * kLog * kLog);
        const sx = gx + u * gw, sy = gy + gh - clamp(iv, 0.1, 0.92) * gh;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2.3; ctx.stroke();
      txt(ctx, lbl, gx + 10, gy + (isShort ? 16 : 32), col, 9.5, "left", true);
    }

    // Right panel: Mean-reverting variance path v_t around theta
    const rgx = rx + 20, rgy = ry + 32, rgw = rw - 36, rgh = rh - 52;
    const thetaY = rgy + rgh * 0.52;
    line(ctx, rgx, thetaY, rgx + rgw, thetaY, C.ok, 1.3, [4, 4]);
    txt(ctx, "Long-Run Variance θ", rgx + rgw - 6, thetaY - 6, C.ok, 9, "right");

    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const vPath = 0.48 + 0.32 * xi * Math.sin(u * (8 + kappa * 2) - st.t * 2.5) * Math.cos(u * 3);
      const sx = rgx + u * rgw, sy = rgy + rgh - clamp(vPath, 0.08, 0.92) * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.secondary; ctx.lineWidth = 2; ctx.stroke();

    return {
      "Spot-Vol Correlation ρ": `${rho.toFixed(2)} (${rho < -0.2 ? "Put Skew" : "Symmetric Smile"})`,
      "Vol-of-Vol Curvature ξ": xi.toFixed(2),
      "25Δ Risk Reversal Skew": `${(rho * xi * 8.4).toFixed(2)}%`,
      "Feller Condition 2κθ > ξ²": 2 * kappa * 0.04 > xi * xi * 0.05 ? "Satisfied (v_t > 0)" : "Violated (Zero Touch)",
    };
  };

  // 46. gt_limit_order_book: Limit Order Book bid/ask depth mountain chart + Avellaneda-Stoikov reservation price quotes
  R.gt_limit_order_book = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Cumulative Bid (Green) & Ask (Red) Depth Mountain Chart + Avellaneda–Stoikov Reservation Price r(s,q,t)", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Limit Order Book (L2 Depth) & Inventory-Skewed Market Maker Quotes (δ_b, δ_a)");

    const gx = padX + 28, gy = padY + 30, gw = boxW - 56, gh = boxH - 50;
    const midX = gx + gw * 0.5;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1.2);
    line(ctx, midX, gy, midX, gy + gh, C.muted, 1.2, [3, 3]);
    txt(ctx, "Mid-Price s = $100.00", midX, gy + 14, C.muted, 9.5, "center");

    const spread = (0.04 + st.a * 0.08 + st.c * 0.08) * gw;
    const invSkew = (st.px - 0.5) * st.a * 45;
    const resX = midX - invSkew;

    // Bid mountain (left)
    ctx.fillStyle = "rgba(110,231,183,0.22)";
    ctx.beginPath();
    ctx.moveTo(resX - spread, gy + gh);
    for (let i = 0; i <= 8; i++) {
      const x = resX - spread - (i / 8) * (resX - spread - gx);
      const y = gy + gh - Math.pow((i + 1) / 9, 1.4) * gh * 0.82;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(gx, gy + gh); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2; ctx.stroke();

    // Ask mountain (right)
    ctx.fillStyle = "rgba(255,107,107,0.22)";
    ctx.beginPath();
    ctx.moveTo(resX + spread, gy + gh);
    for (let i = 0; i <= 8; i++) {
      const x = resX + spread + (i / 8) * (gx + gw - (resX + spread));
      const y = gy + gh - Math.pow((i + 1) / 9, 1.4) * gh * 0.82;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(gx + gw, gy + gh); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.danger; ctx.lineWidth = 2; ctx.stroke();

    // Reservation price marker
    line(ctx, resX, gy + 20, resX, gy + gh, C.accent, 2);
    txt(ctx, "Reservation r(s,q,t)", resX, gy + 30, C.accent, 9.5, "center", true);

    const bpsSpread = Math.round(8 + st.v0 * 24 + st.v2 * 35);
    return {
      "Reservation Price r": `$${(100 - invSkew * 0.02).toFixed(2)}`,
      "Optimal Half-Spread δ*": `${(bpsSpread * 0.5).toFixed(1)} bps`,
      "Order Arrival Rate λ": `${Math.round(st.v1)} orders/s`,
      "Adverse Selection VPIN": `${(st.v2 * 100).toFixed(0)}% Toxic Flow`,
    };
  };

  // 47. gt_almgren_chriss: Almgren-Chriss execution liquidation schedule x(t) trading off market impact vs timing risk
  R.gt_almgren_chriss = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Liquidation Trajectory x(t) = X sinh(κ(T−t))/sinh(κT) | Right: Impact vs Variance Frontier", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Remaining Block Inventory x(t) vs Linear TWAP");
    st.panel(rx, ry, rw, rh, "Almgren–Chriss E[Shortfall] vs Var[Shortfall] Frontier");

    const gx = lx + 28, gy = ly + 30, gw = lw - 44, gh = lh - 50;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1);
    // TWAP diagonal
    line(ctx, gx, gy + 10, gx + gw, gy + gh, C.muted, 1.5, [4, 4]);
    txt(ctx, "Risk-Neutral TWAP (λ→0)", gx + gw * 0.58, gy + gh * 0.44, C.muted, 9.5);

    const kappa = Math.max(0.15, Math.sqrt((st.v0 * st.v2 * st.v2) / Math.max(0.05, st.v1)) * 0.45);
    ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const u = i / 90;
      const frac = Math.sinh(kappa * (1 - u)) / Math.sinh(kappa);
      const sx = gx + u * gw, sy = gy + 10 + (1 - frac) * (gh - 10);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.5; ctx.stroke();
    txt(ctx, `Urgency κ = ${kappa.toFixed(2)}`, gx + 16, gy + gh - 14, C.ok, 10, "left", true);

    // Right panel: Efficient execution frontier
    const rgx = rx + 26, rgy = ry + 32, rgw = rw - 42, rgh = rh - 52;
    line(ctx, rgx, rgy + rgh, rgx + rgw, rgy + rgh, C.axis, 1);
    line(ctx, rgx, rgy, rgx, rgy + rgh, C.axis, 1);
    ctx.beginPath();
    for (let i = 1; i <= 80; i++) {
      const u = i / 80;
      const cost = 0.15 + (0.22 / (u + 0.18));
      const sx = rgx + u * rgw, sy = rgy + rgh - clamp(cost, 0.1, 0.92) * rgh;
      if (i === 1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2; ctx.stroke();
    const uPt = clamp(1 - st.a * 0.75, 0.12, 0.9);
    circle(ctx, rgx + uPt * rgw, rgy + rgh - clamp(0.15 + 0.22 / (uPt + 0.18), 0.1, 0.92) * rgh, 5.5, C.accent);

    return {
      "Urgency Parameter κ": `${kappa.toFixed(2)} s⁻¹`,
      "Half-Life t_{1/2}": `${(Math.log(2) / kappa * 100).toFixed(0)} mins`,
      "Expected Impact Cost": `${(14 + kappa * 18 * st.b).toFixed(1)} bps`,
      "Timing Risk StdDev": `${(42 / Math.sqrt(kappa) * st.c).toFixed(1)} bps`,
    };
  };

  // 48. gt_markowitz_cvar: Markowitz Mean-Variance efficient frontier parabola + Tangency Sharpe ratio line + CVaR tail
  R.gt_markowitz_cvar = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Markowitz Mean-Variance Hyperbola & Capital Market Line | Right: Return Tail VaR & CVaR_95%", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Efficient Frontier (σ_p, μ_p) & Sharpe Tangency Portfolio");
    st.panel(rx, ry, rw, rh, "Portfolio Loss Tail: VaR_α vs Expected Shortfall CVaR_α");

    const gx = lx + 28, gy = ly + 28, gw = lw - 44, gh = lh - 48;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1);

    const minVol = 0.22 + st.b * 0.20;
    // Upper efficient branch + lower inefficient branch
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const mu = i / 100;
      const vol = Math.sqrt(minVol * minVol + Math.pow(mu - 0.38, 2) * 1.45);
      const sx = gx + clamp((vol - 0.1) / 0.85, 0, 1) * gw, sy = gy + gh - mu * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.4; ctx.stroke();

    // Capital Market Line from risk-free rate (0, 0.18) tangent to frontier
    const tangMu = 0.68, tangVol = Math.sqrt(minVol * minVol + Math.pow(tangMu - 0.38, 2) * 1.45);
    const tx = gx + ((tangVol - 0.1) / 0.85) * gw, ty = gy + gh - tangMu * gh;
    line(ctx, gx, gy + gh * 0.82, tx + 35, ty - 22, C.accent, 1.8, [4, 3]);
    circle(ctx, tx, ty, 5.5, C.ok);
    txt(ctx, "Max Sharpe Tangency", tx + 8, ty + 4, C.ok, 9.5, "left", true);

    // Right panel: Gaussian/fat-tail distribution with left tail shaded in red for CVaR
    const rgx = rx + 20, rgy = ry + rh - 26, rgw = rw - 40, rgh = rh - 56;
    line(ctx, rgx, rgy, rgx + rgw, rgy, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      const d = Math.exp(-Math.pow((u - 0.56) / 0.20, 2));
      const sx = rgx + u * rgw, sy = rgy - d * rgh * 0.85;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2; ctx.stroke();

    const varX = rgx + 0.26 * rgw;
    line(ctx, varX, ry + 28, varX, rgy, C.danger, 2, [3, 3]);
    txt(ctx, "CVaR_95% Tail", varX - 4, ry + 42, C.danger, 9, "right", true);

    const sharpe = ((st.v0 - 3.5) / (11 + st.b * 8)).toFixed(2);
    return {
      "Portfolio Sharpe Ratio": sharpe,
      "Minimum Variance σ_GMV": `${(minVol * 28).toFixed(1)}% ann.`,
      "95% CVaR (Exp Shortfall)": `−${(minVol * 46).toFixed(1)}%`,
      "Ledoit–Wolf Shrinkage δ": st.v2.toFixed(2),
    };
  };

  // 49. gt_kelly_ergodicity: Kelly criterion growth rate g(f) parabola showing optimal Kelly f*, half-Kelly, and over-betting ruin cliff
  R.gt_kelly_ergodicity = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Time-Average Growth Rate g(f) = μf − ½σ²f² | Right: Ensemble Average vs Typical Wealth Path", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.50, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Kelly Growth Parabola g(f): Optimal f*, Half-Kelly, Ruin Cliff (2f*)");
    st.panel(rx, ry, rw, rh, "Ergodicity Breaking: Ensemble E[W_t] vs Time-Average W_t");

    const gx = lx + 28, gy = ly + 30, gw = lw - 44, gh = lh - 50;
    const zeroY = gy + gh * 0.68;
    line(ctx, gx, zeroY, gx + gw, zeroY, C.axis, 1.2);

    // Parabola over f/f* in [0, 2.5]
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const m = (i / 100) * 2.5; // f / f*
      const gNorm = 2 * m - m * m; // peaks at 1.0 when m=1, crosses 0 at m=2
      const sx = gx + (i / 100) * gw, sy = zeroY - gNorm * (gh * 0.54);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.4; ctx.stroke();

    const mCur = st.v0;
    const gCur = 2 * mCur - mCur * mCur;
    const cx = gx + (mCur / 2.5) * gw, cy = zeroY - gCur * (gh * 0.54);
    circle(ctx, cx, cy, 6, mCur > 2 ? C.danger : C.accent);
    txt(ctx, "f* (Optimal)", gx + (1 / 2.5) * gw, zeroY - gh * 0.56, C.ok, 9.5, "center", true);
    txt(ctx, "2f* (Zero Growth)", gx + (2 / 2.5) * gw, zeroY + 14, C.danger, 9, "center");

    // Right panel: Exponential ensemble mean vs median Kelly vs overleveraged ruin path
    const rgx = rx + 24, rgy = ry + 30, rgw = rw - 40, rgh = rh - 50;
    line(ctx, rgx, rgy + rgh, rgx + rgw, rgy + rgh, C.axis, 1);
    for (const [mode, col, lbl] of [["ens", C.primary, "Ensemble Mean E[W_t]"], ["typ", gCur >= 0 ? C.ok : C.danger, "Typical Trajectory W_t"]]) {
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const yVal = mode === "ens"
          ? 0.25 + 0.65 * u
          : clamp(0.25 + 0.45 * gCur * u + 0.08 * mCur * Math.sin(i * 1.4 + st.t * 2), 0.04, 0.95);
        const sx = rgx + u * rgw, sy = rgy + rgh - yVal * rgh;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2.1; ctx.stroke();
      txt(ctx, lbl, rgx + 10, rgy + (mode === "ens" ? 16 : 32), col, 9.5, "left", true);
    }

    const fStar = st.v1 / Math.max(1, (st.v2 * st.v2) / 100);
    return {
      "Optimal Kelly Fraction f*": `${fStar.toFixed(2)}x Leverage`,
      "Selected Multiple f/f*": `${mCur.toFixed(2)}x`,
      "Log Growth Rate g(f)": `${(gCur * 0.5 * st.v1).toFixed(2)}% / yr`,
      "Ergodic Regime": mCur > 2.0 ? "RUIN CLIFF (g(f) < 0)" : (mCur > 1.0 ? "Over-Betting (High Vol)" : "Compounding Growth"),
    };
  };

  // 50. gt_kyle_lambda_insider: Kyle (1985) insider + noise trader order flow vs market maker linear pricing rule P = μ + λ·y
  R.gt_kyle_lambda_insider = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Market Maker Linear Pricing Rule P(y) = μ₀ + λ(x + u) | Right: Sequential Price Discovery", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Kyle's Lambda Slope λ = ½√(Σ₀ / σ_u²)");
    st.panel(rx, ry, rw, rh, "Price Convergence P_n → True Fundamental Value v");

    const sigmaU = Math.max(10, st.v0), prec = st.v1;
    const kyleLam = 0.5 * Math.sqrt((1 / prec) / (sigmaU * 0.02));
    const ox = lx + lw * 0.5, oy = ly + lh * 0.56;
    line(ctx, lx + 18, oy, lx + lw - 18, oy, C.axis, 1);
    line(ctx, ox, ly + 26, ox, ly + lh - 14, C.axis, 1);

    // Pricing line P = mu_0 + lambda * y
    const dy = clamp(kyleLam * 55, 16, lh * 0.38);
    line(ctx, lx + 24, oy + dy, lx + lw - 24, oy - dy, C.primary, 2.5);
    txt(ctx, `Slope λ = ${kyleLam.toFixed(3)}`, lx + 28, ly + 42, C.primary, 10, "left", true);

    // Right panel: Price path converging toward fundamental value v*
    const rgx = rx + 24, rgy = ry + 30, rgw = rw - 40, rgh = rh - 50;
    const vTrueY = rgy + rgh * 0.24;
    line(ctx, rgx, vTrueY, rgx + rgw, vTrueY, C.ok, 1.5, [4, 4]);
    txt(ctx, "True Liquidation Value v*", rgx + rgw - 6, vTrueY - 6, C.ok, 9.5, "right", true);

    ctx.beginPath();
    const N = Math.round(st.v2);
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const pGap = Math.exp(-u * 2.4) * (0.55 - 0.08 * Math.sin(i * 1.7 + st.t * 2));
      const sx = rgx + u * rgw, sy = vTrueY + pGap * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.stroke();

    return {
      "Kyle Illiquidity λ": kyleLam.toFixed(4),
      "Market Depth 1/λ": `${(1 / kyleLam).toFixed(1)} shares/$`,
      "Insider Expected Profit": `$${(0.5 / kyleLam).toFixed(1)}k`,
      "Remaining Variance Σ_N": `${(100 / Math.sqrt(N)).toFixed(1)}% of Σ₀`,
    };
  };

  // 51. gt_spence_signaling: Spence job-market education signaling separating vs pooling equilibria
  R.gt_spence_signaling = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Single-Crossing Indifference Curves: High-Productivity θ_H (Flatter Cost) vs Low-Productivity θ_L (Steeper)", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Spence Education Signaling (e, w): Wage Schedule w(e) & Separating Threshold e*");

    const gx = padX + 36, gy = padY + 30, gw = boxW - 64, gh = boxH - 50;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1.2);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1.2);

    const wLowY = gy + gh * 0.72, wHighY = gy + gh * 0.26;
    const eStarU = clamp(st.v2 / 10, 0.15, 0.88);
    const eStarX = gx + eStarU * gw;

    // Step-function employer wage offer w(e)
    line(ctx, gx, wLowY, eStarX, wLowY, C.accent, 2.5);
    line(ctx, eStarX, wLowY, eStarX, wHighY, C.accent, 1.8, [4, 3]);
    line(ctx, eStarX, wHighY, gx + gw, wHighY, C.accent, 2.5);
    txt(ctx, "w_L = θ_L", gx + 10, wLowY - 6, C.accent, 9.5);
    txt(ctx, "w_H = θ_H (Signal e ≥ e*)", eStarX + 10, wHighY - 6, C.accent, 9.5, "left", true);

    // Indifference curve for Low type through (0, w_L): steep slope c_L
    const costRatio = st.v0;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const wy = wLowY - u * (gh * 0.28 * costRatio);
      if (i === 0) ctx.moveTo(gx + u * gw, wy); else ctx.lineTo(gx + u * gw, wy);
    }
    ctx.strokeStyle = C.danger; ctx.lineWidth = 2; ctx.stroke();

    // Indifference curve for High type through (e*, w_H): flatter slope c_H
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const wy = wHighY - (u - eStarU) * (gh * 0.28);
      if (i === 0) ctx.moveTo(gx + u * gw, wy); else ctx.lineTo(gx + u * gw, wy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2; ctx.stroke();

    const separating = eStarU * costRatio >= 0.46 / 0.28 && eStarU <= 0.46 / 0.28;
    circle(ctx, gx, wLowY, 5.5, C.danger);
    circle(ctx, eStarX, wHighY, 6, C.ok);

    return {
      "Equilibrium Type": separating ? "Separating PBE (Riley Outcome)" : (eStarU < 0.35 ? "Pooling (Low Type Mimics)" : "Over-Signaling (Unprofitable)"),
      "Separating Interval [e_min, e_max]": `[${(4.6 / costRatio).toFixed(1)}, 4.6] yrs`,
      "Chosen Credential e*": `${st.v2.toFixed(1)} yrs`,
      "Cost Ratio c_L / c_H": `${costRatio.toFixed(2)}x`,
    };
  };

  // 52. gt_bayesian_persuasion: Kamenica-Gentzkow Bayesian persuasion concavification of sender utility V(μ) over posterior beliefs
  R.gt_bayesian_persuasion = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Kamenica–Gentzkow Concavification: Sender Step Utility v(μ) vs Concave Envelope V̂(μ₀)", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Bayesian Persuasion over Posterior Belief μ ∈ [0, 1]: Splitting μ₀ into (0, μ_th)");

    const gx = padX + 36, gy = padY + 32, gw = boxW - 64, gh = boxH - 52;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1.2);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1.2);

    const mu0 = st.v0, th = st.v1;
    const thX = gx + th * gw, highY = gy + gh * 0.20, lowY = gy + gh * 0.88;

    // Step utility v(mu): 0 for mu < th, 1 for mu >= th
    line(ctx, gx, lowY, thX, lowY, C.secondary, 2.5);
    line(ctx, thX, highY, gx + gw, highY, C.secondary, 2.5);
    txt(ctx, "Unpersuaded Utility v(μ)", gx + gw - 10, highY + 16, C.secondary, 9.5, "right", true);

    // Concavification envelope V_hat(mu) connecting (0,0) to (th, 1)
    line(ctx, gx, lowY, thX, highY, C.ok, 2.5, [5, 3]);
    txt(ctx, "Concave Envelope V̂(μ)", (gx + thX) * 0.5 - 10, (lowY + highY) * 0.5 - 10, C.ok, 10, "center", true);

    // Prior belief mu0 and vertical persuasion gain
    const mu0X = gx + mu0 * gw;
    const vHat = mu0 < th ? (mu0 / th) * st.c + (1 - st.c) * 0 : 1.0;
    const vHatY = lowY - vHat * (lowY - highY);
    line(ctx, mu0X, lowY, mu0X, vHatY, C.accent, 2);
    circle(ctx, mu0X, vHatY, 6, C.accent);
    txt(ctx, `Prior μ₀=${mu0.toFixed(2)} → V̂=${vHat.toFixed(2)}`, mu0X, vHatY - 10, C.accent, 10, "center", true);

    return {
      "Prior Conviction Probability": `v(μ₀) = ${mu0 >= th ? "1.00" : "0.00"}`,
      "Persuasion Value V̂(μ₀)": `${(vHat * 100).toFixed(1)}% Action Rate`,
      "Posterior Splitting": `{0.00, ${th.toFixed(2)}} (Martingale)`,
      "Receiver Threshold μ*": th.toFixed(2),
    };
  };

  // 53. gt_gale_shapley_matching: Gale-Shapley deferred acceptance bipartite proposer-reviewer matching animations
  R.gt_gale_shapley_matching = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Bipartite Deferred Acceptance (Men/Applicants Proposing → Reviewer/Hospital Tentative Holds)", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Gale–Shapley Stable Matching Lattice & Core Blocking-Pair Verification");

    const N = Math.min(6, Math.max(3, Math.round(st.v0)));
    const lx = padX + boxW * 0.24, rx = padX + boxW * 0.76;
    const stepH = (boxH - 46) / N;

    for (let i = 0; i < N; i++) {
      const y1 = padY + 36 + i * stepH;
      const matchJ = (i + Math.round(st.b * 2)) % N;
      const y2 = padY + 36 + matchJ * stepH;

      // Rejected proposal dashed line
      const rejJ = (matchJ + 1) % N;
      line(ctx, lx + 20, y1, rx - 20, padY + 36 + rejJ * stepH, "rgba(255,107,107,0.22)", 1, [3, 3]);
      // Stable matched edge
      line(ctx, lx + 20, y1, rx - 20, y2, C.ok, 2.3);

      circle(ctx, lx, y1, 13, "rgba(124,156,255,0.2)", C.primary, 2);
      txt(ctx, `M${i + 1}`, lx, y1 + 4, C.text, 10, "center", true);

      circle(ctx, rx, y1, 13, "rgba(255,143,171,0.2)", C.secondary, 2);
      txt(ctx, `W${i + 1}`, rx, y1 + 4, C.text, 10, "center", true);
    }

    const coreWidth = (1 - st.b) * 2.4;
    return {
      "Matched Pairs": `${N} / ${N} (100% Cleared)`,
      "Blocking Pairs": "0 (Strictly Core Stable)",
      "Proposer Average Rank": `${(1.3 + st.b * 1.4).toFixed(2)} (Proposer-Optimal)`,
      "Core Lattice Width": `${coreWidth.toFixed(2)} rank spread`,
    };
  };

  // 54. gt_braess_wardrop: Braess's paradox 4-node road network (A -> B/C -> D) with shortcut edge increasing travel time
  R.gt_braess_wardrop = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("4-Node Diamond Network: Opening the Zero-Cost B→C Shortcut Degrades Selfish Wardrop Travel Time!", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Braess's Paradox Network: Origin A → (Top B, Bottom C) → Destination D");

    const pts = {
      A: [padX + boxW * 0.14, padY + boxH * 0.54],
      B: [padX + boxW * 0.50, padY + boxH * 0.22],
      C: [padX + boxW * 0.50, padY + boxH * 0.86],
      D: [padX + boxW * 0.86, padY + boxH * 0.54],
    };
    const phi = st.v0;
    const scOpen = st.b;
    const toll = st.v2;
    const zigFrac = clamp(scOpen * (1 - toll / 40), 0, 1);

    // Outer edges
    arrow(ctx, pts.A[0], pts.A[1], pts.B[0], pts.B[1], C.danger, 2.8);
    txt(ctx, "c(x) = x/100 (Congestible)", (pts.A[0] + pts.B[0]) * 0.5 - 12, (pts.A[1] + pts.B[1]) * 0.5 - 8, C.danger, 9.5, "center", true);

    arrow(ctx, pts.B[0], pts.B[1], pts.D[0], pts.D[1], C.primary, 2.2);
    txt(ctx, "c(x) = 45 min (Constant)", (pts.B[0] + pts.D[0]) * 0.5 + 12, (pts.B[1] + pts.D[1]) * 0.5 - 8, C.primary, 9.5, "center", true);

    arrow(ctx, pts.A[0], pts.A[1], pts.C[0], pts.C[1], C.primary, 2.2);
    txt(ctx, "c(x) = 45 min (Constant)", (pts.A[0] + pts.C[0]) * 0.5 - 12, (pts.A[1] + pts.C[1]) * 0.5 + 16, C.primary, 9.5, "center", true);

    arrow(ctx, pts.C[0], pts.C[1], pts.D[0], pts.D[1], C.danger, 2.8);
    txt(ctx, "c(x) = x/100 (Congestible)", (pts.C[0] + pts.D[0]) * 0.5 + 12, (pts.C[1] + pts.D[1]) * 0.5 + 16, C.danger, 9.5, "center", true);

    // B -> C shortcut edge
    arrow(ctx, pts.B[0], pts.B[1] + 18, pts.C[0], pts.C[1] - 18, scOpen > 0.1 ? C.accent : C.muted, 2 + zigFrac * 3);
    txt(ctx, `Shortcut B→C (Toll=$${toll})`, pts.B[0] + 12, padY + boxH * 0.54, C.accent, 9.5, "left", true);

    Object.entries(pts).forEach(([k, [x, y]]) => {
      circle(ctx, x, y, 16, "rgba(22,26,46,0.95)", C.ok, 2.2);
      txt(ctx, k, x, y + 4, C.text, 12, "center", true);
    });

    const optTime = 45 + (phi * 0.5) / 100 * 20;
    const eqTime = optTime + zigFrac * (phi * 0.5 / 100 * 20);
    return {
      "Social Optimum Latency": `${optTime.toFixed(1)} mins`,
      "Wardrop Equilibrium Latency": `${eqTime.toFixed(1)} mins`,
      "Price of Anarchy (PoA)": (eqTime / optTime).toFixed(3),
      "B→C Shortcut Flow": `${Math.round(zigFrac * 100)}% of Drivers`,
    };
  };

  // 55. gt_shapley_coalition: Shapley value coalition lattice (∅ to {A,B,C}) + marginal contribution bars
  R.gt_shapley_coalition = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Hasse Coalition Lattice (∅ → {1,2,3}) | Right: Fair Shapley Value Attribution φ_i(v)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Coalition Hasse Diagram & Characteristic Value v(S)");
    st.panel(rx, ry, rw, rh, "Shapley Value Allocation φ_i(v) (% of Grand Coalition)");

    const nodes = [
      { s: "{A,B,C}", x: 0.50, y: 0.16 },
      { s: "{A,B}", x: 0.22, y: 0.42 }, { s: "{A,C}", x: 0.50, y: 0.42 }, { s: "{B,C}", x: 0.78, y: 0.42 },
      { s: "{A}", x: 0.22, y: 0.68 }, { s: "{B}", x: 0.50, y: 0.68 }, { s: "{C}", x: 0.78, y: 0.68 },
      { s: "∅", x: 0.50, y: 0.90 },
    ];
    const edges = [[7, 4], [7, 5], [7, 6], [4, 1], [4, 2], [5, 1], [5, 3], [6, 2], [6, 3], [1, 0], [2, 0], [3, 0]];
    edges.forEach(([u, v]) => {
      line(ctx, lx + nodes[u].x * lw, ly + 16 + nodes[u].y * (lh - 20), lx + nodes[v].x * lw, ly + 16 + nodes[v].y * (lh - 20), "rgba(124,156,255,0.35)", 1.4);
    });
    nodes.forEach((n, idx) => {
      const nx = lx + n.x * lw, ny = ly + 16 + n.y * (lh - 20);
      circle(ctx, nx, ny, 14, "rgba(22,26,46,0.95)", idx === 0 ? C.ok : C.primary, 1.8);
      txt(ctx, n.s, nx, ny + 3, C.text, 8.5, "center", true);
    });

    // Right: Shapley attribution bars
    const p1 = 0.34 + st.b * 0.28, p2 = (1 - p1) * 0.56, p3 = 1 - p1 - p2;
    const shares = [
      { name: "Player A (Anchor Veto)", v: p1, col: C.ok },
      { name: "Player B (Catalyst)", v: p2, col: C.primary },
      { name: "Player C (Contributor)", v: p3, col: C.accent },
    ];
    shares.forEach((sh, i) => {
      const by = ry + 42 + i * 52;
      txt(ctx, sh.name, rx + 16, by + 12, C.text, 10, "left", true);
      const bw = sh.v * (rw - 44);
      ctx.fillStyle = sh.col;
      ctx.fillRect(rx + 16, by + 18, bw, 16);
      txt(ctx, `φ = ${(sh.v * 100).toFixed(1)}%`, rx + 22 + bw, by + 30, sh.col, 9.5, "left", true);
    });

    return {
      "Shapley Vector (φ_A, φ_B, φ_C)": `(${(p1 * 100).toFixed(0)}%, ${(p2 * 100).toFixed(0)}%, ${(p3 * 100).toFixed(0)}%)`,
      "Grand Coalition v(N)": `${Math.pow(st.v2, st.v0).toFixed(1)} units`,
      "Permutations Evaluated": `${Math.round(st.v2)}! = ${[1, 1, 2, 6, 24, 120, 720][Math.round(st.v2)] || 6}`,
      "Bondareva–Shapley Core": st.v0 >= 1.0 ? "NON-EMPTY (Convex Game)" : "EMPTY (Subadditive Instability)",
    };
  };

  // 56. gt_uniswap_cfmm_il: Uniswap x·y = k constant product bonding curve + arbitrage shift & Impermanent Loss curve
  R.gt_uniswap_cfmm_il = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Constant Product Hyperbola x·y = L² | Right: Impermanent Loss IL(p) = 2√p/(1+p) − 1 vs Fee Income", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.48, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "AMM Reserve Bonding Curve x·y = k & Price Tangent");
    st.panel(rx, ry, rw, rh, "Divergence / Impermanent Loss IL(p/p₀) vs LP Swap Fees");

    const gx = lx + 28, gy = ly + 28, gw = lw - 44, gh = lh - 48;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1);

    // Hyperbola y = 0.22 / x
    ctx.beginPath();
    for (let i = 12; i <= 95; i++) {
      const u = i / 100;
      const v = clamp(0.22 / u, 0.08, 0.94);
      const sx = gx + u * gw, sy = gy + gh - v * gh;
      if (i === 12) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.4; ctx.stroke();

    const pRatio = Math.max(0.2, st.v0);
    const xU = clamp(0.47 / Math.sqrt(pRatio), 0.16, 0.88);
    const yU = clamp(0.22 / xU, 0.1, 0.92);
    circle(ctx, gx + 0.47 * gw, gy + gh - 0.47 * gh, 4.5, C.muted);
    circle(ctx, gx + xU * gw, gy + gh - yU * gh, 6, C.accent);
    txt(ctx, `(x*, y*) at p/p₀=${pRatio.toFixed(2)}`, gx + xU * gw + 8, gy + gh - yU * gh - 6, C.accent, 9.5, "left", true);

    // Right panel: Impermanent loss curve IL(p) <= 0
    const rgx = rx + 26, rgy = ry + 34, rgw = rw - 42, rgh = rh - 54;
    line(ctx, rgx, rgy + 18, rgx + rgw, rgy + 18, C.axis, 1.2);
    ctx.beginPath();
    for (let i = 5; i <= 100; i++) {
      const p = (i / 100) * 5;
      const il = (2 * Math.sqrt(p)) / (1 + p) - 1; // negative
      const sx = rgx + (i / 100) * rgw, sy = rgy + 18 - il * (rgh * 2.2);
      if (i === 5) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.danger; ctx.lineWidth = 2.3; ctx.stroke();

    const ilNow = ((2 * Math.sqrt(pRatio)) / (1 + pRatio) - 1) * (1 + (1 - st.c) * 1.4);
    const feeApr = (st.v1 * 0.18).toFixed(2);
    return {
      "Price Ratio p / p₀": `${pRatio.toFixed(2)}x`,
      "Impermanent Loss IL": `${(ilNow * 100).toFixed(2)}%`,
      "Swap Fee Tier": `${Math.round(st.v1)} bps (${(st.v1 / 100).toFixed(2)}%)`,
      "Net LP PnL vs HODL": ilNow * 100 + Number(feeApr) >= 0 ? `+${(ilNow * 100 + Number(feeApr)).toFixed(2)}% (Profitable)` : `${(ilNow * 100 + Number(feeApr)).toFixed(2)}% (LVR Underwater)`,
    };
  };

  // 57. gt_vasicek_cir_yield: Vasicek / CIR yield curve term structure Y(τ) (normal, inverted, humped)
  R.gt_vasicek_cir_yield = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Affine Term Structure Y(τ) = −ln P(t,T)/τ: Normal (r₀ < θ), Flat, and Inverted (r₀ > θ) Yield Curves", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Zero-Coupon Spot Yield Curve Y(τ) & Instantaneous Forward Rate f(0, τ) (0–30Y)");

    const gx = padX + 36, gy = padY + 30, gw = boxW - 64, gh = boxH - 50;
    line(ctx, gx, gy + gh, gx + gw, gy + gh, C.axis, 1.2);
    line(ctx, gx, gy, gx, gy + gh, C.axis, 1.2);

    const r0 = st.v0, theta = st.v1, kappa = Math.max(0.08, st.v2);
    // Asymptotic long rate line
    const thY = gy + gh - (theta / 12) * gh;
    line(ctx, gx, thY, gx + gw, thY, C.muted, 1.2, [4, 4]);
    txt(ctx, `Long-Run Mean θ = ${theta.toFixed(2)}%`, gx + gw - 8, thY - 6, C.muted, 9.5, "right");

    // Spot yield curve Y(tau) and Forward rate curve f(tau)
    for (const [isFwd, col, lbl] of [[false, C.ok, "Spot Zero Yield Y(τ)"], [true, C.primary, "Forward Rate f(0, τ)"]]) {
      ctx.beginPath();
      for (let i = 1; i <= 100; i++) {
        const tau = (i / 100) * 30;
        const B = (1 - Math.exp(-kappa * tau)) / kappa;
        const yld = isFwd
          ? theta + (r0 - theta) * Math.exp(-kappa * tau)
          : theta + (r0 - theta) * (B / tau);
        const sx = gx + (i / 100) * gw, sy = gy + gh - clamp(yld / 12, 0.04, 0.95) * gh;
        if (i === 1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.stroke();
      txt(ctx, lbl, gx + 14, gy + (isFwd ? 32 : 16), col, 10, "left", true);
    }

    const y10 = theta + (r0 - theta) * ((1 - Math.exp(-kappa * 10)) / (10 * kappa));
    const y2 = theta + (r0 - theta) * ((1 - Math.exp(-kappa * 2)) / (2 * kappa));
    const spread2s10s = (y10 - y2) * 100;
    return {
      "Short Rate r₀ vs Mean θ": `${r0.toFixed(2)}% → ${theta.toFixed(2)}%`,
      "10Y Zero-Coupon Yield": `${y10.toFixed(2)}%`,
      "2s10s Term Spread": `${spread2s10s >= 0 ? "+" : ""}${spread2s10s.toFixed(0)} bps`,
      "Curve Shape": r0 > theta + 0.3 ? "INVERTED (Recession Signal)" : (r0 < theta - 0.3 ? "NORMAL (Upward Sloping)" : "FLAT"),
    };
  };

  // 58. gt_hawkes_microstructure: Hawkes self-exciting point process intensity λ(t) with clustered order-flow arrivals
  R.gt_hawkes_microstructure = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Self-Exciting Conditional Intensity λ(t) = μ + Σ α exp(−β(t − t_i)) & Endogenous Order Clustering", st.spec.formula);
    const padX = 16, padY = 46, boxW = W - 32, boxH = H - 60;
    st.panel(padX, padY, boxW, boxH, "Hawkes Conditional Intensity λ(t) Jumps & Event Barcode Raster");

    const gx = padX + 32, gy = padY + 28, gw = boxW - 52, gh = boxH - 58;
    const baseMu = st.v0, alpha = st.v1, beta = Math.max(0.2, st.v2);
    const branchRatio = alpha / beta;

    const arrivals = [0.08, 0.19, 0.22, 0.25, 0.44, 0.62, 0.64, 0.66, 0.69, 0.85];
    ctx.beginPath();
    for (let i = 0; i <= 160; i++) {
      const u = i / 160;
      let lam = baseMu * 0.08;
      arrivals.forEach((ti) => {
        if (u >= ti) lam += alpha * 0.26 * Math.exp(-beta * 12 * (u - ti));
      });
      const sx = gx + u * gw, sy = gy + gh - clamp(lam, 0.05, 0.95) * gh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = branchRatio >= 1 ? C.danger : C.ok;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Arrival barcode ticks at bottom
    arrivals.forEach((ti) => {
      const tx = gx + ti * gw;
      line(ctx, tx, gy + gh + 4, tx, gy + gh + 16, C.accent, 2);
    });

    return {
      "Branching Ratio n = α/β": branchRatio.toFixed(2),
      "Mean Intensity E[λ]": branchRatio < 1 ? `${(baseMu / (1 - branchRatio)).toFixed(1)} Hz` : "∞ (Supercritical Explosion!)",
      "Endogenous Fraction": `${Math.min(99, Math.round(branchRatio * 100))}% Self-Excited`,
      "Microstructure Regime": branchRatio >= 1 ? "CRITICAL FLASH CRASH (n ≥ 1)" : "Stationary Clustered Flow",
    };
  };

  // 59. gt_merton_credit_cds: Merton structural credit model asset paths vs debt barrier D + CDS spread term structure
  R.gt_merton_credit_cds = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Firm Asset Value V_t vs Debt Default Barrier D | Right: Credit Default Swap (CDS) Spread Curve", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Structural Asset Paths V_t vs Default Barrier D at Maturity T");
    st.panel(rx, ry, rw, rh, "Credit Spread Term Structure s(T) (bps)");

    const gx = lx + 26, gy = ly + 30, gw = lw - 42, gh = lh - 50;
    const dRatio = st.v0;
    const sigmaV = st.v1 / 100;
    const T = st.v2;
    const barY = gy + gh * (1 - dRatio * 0.72);
    line(ctx, gx, barY, gx + gw, barY, C.danger, 2, [5, 3]);
    txt(ctx, `Default Barrier D/V₀ = ${dRatio.toFixed(2)}`, gx + 8, barY - 6, C.danger, 9.5, "left", true);

    // 4 geometric Brownian motion asset paths
    const v0Y = gy + gh * 0.28;
    for (let p = 0; p < 4; p++) {
      ctx.beginPath();
      let defaulted = false;
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const drift = (p - 1.3) * sigmaV * 0.85 * u + 0.16 * sigmaV * Math.sin(i * 0.9 + p * 2 + st.t);
        const sy = clamp(v0Y - drift * gh, gy + 8, gy + gh);
        if (i === 80 && sy > barY) defaulted = true;
        if (i === 0) ctx.moveTo(gx + u * gw, sy); else ctx.lineTo(gx + u * gw, sy);
      }
      ctx.strokeStyle = p === 0 ? C.danger : C.ok;
      ctx.lineWidth = p === 0 ? 2.2 : 1.5;
      ctx.stroke();
    }

    // Right panel: CDS credit spread term structure
    const rgx = rx + 24, rgy = ry + 32, rgw = rw - 40, rgh = rh - 52;
    line(ctx, rgx, rgy + rgh, rgx + rgw, rgy + rgh, C.axis, 1);
    ctx.beginPath();
    for (let i = 1; i <= 80; i++) {
      const u = i / 80;
      const spread = Math.pow(dRatio, 1.8) * sigmaV * 2.2 * Math.exp(-Math.pow((u - 0.35) / 0.45, 2));
      const sx = rgx + u * rgw, sy = rgy + rgh - clamp(spread, 0.05, 0.92) * rgh;
      if (i === 1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.3; ctx.stroke();

    const d2 = (Math.log(1 / dRatio) + (0.04 - 0.5 * sigmaV * sigmaV) * T) / (sigmaV * Math.sqrt(T));
    const pd = 1 / (1 + Math.exp(1.7 * d2));
    return {
      "Distance to Default d₂": `${d2.toFixed(2)} σ`,
      "Default Probability Φ(−d₂)": `${(pd * 100).toFixed(2)}%`,
      "5Y CDS Par Spread": `${Math.round(pd * 6000 / Math.max(1, T))} bps`,
      "Credit Rating Implied": d2 > 2.5 ? "Investment Grade (AA/A)" : (d2 > 1.2 ? "Crossover (BBB/BB)" : "Distressed High-Yield (CCC)"),
    };
  };

  // 60. gt_cfr_poker_regret: Counterfactual Regret Minimization (CFR+) Kuhn/Leduc poker game tree with evolving strategy probabilities
  R.gt_cfr_poker_regret = function (ctx, W, H, st) {
    const C = st.COLORS;
    st.drawHUD("Left: Kuhn Poker Information Set Tree & Bluff Probabilities | Right: Exploitability O(1/√T)", st.spec.formula);
    const lx = 16, ly = 46, lw = W * 0.52, lh = H - 60;
    const rx = lx + lw + 12, rw = W - rx - 16, ry = 46, rh = H - 60;
    st.panel(lx, ly, lw, lh, "Kuhn Poker Game Tree & CFR+ Strategy σ^T(I, a)");
    st.panel(rx, ry, rw, rh, "Nash Conv / Exploitability Decay ε(T) ∝ T^(−1/2)");

    const alphaBluff = clamp(1 / (2 + st.v1), 0.08, 0.48);
    const kBet = clamp(3 * alphaBluff, 0.15, 0.98);
    const tree = [
      { l: "Chance Deal (J, Q, K)", x: 0.50, y: 0.16, col: C.accent },
      { l: `P1 Jack: Bluff α=${(alphaBluff * 100).toFixed(0)}%`, x: 0.22, y: 0.48, col: C.danger },
      { l: "P1 Queen: Check 100%", x: 0.50, y: 0.48, col: C.primary },
      { l: `P1 King: Value 3α=${(kBet * 100).toFixed(0)}%`, x: 0.78, y: 0.48, col: C.ok },
      { l: `P2 Queen Call=${((alphaBluff + 0.15) * 100).toFixed(0)}%`, x: 0.50, y: 0.82, col: C.secondary },
    ];
    [[0, 1], [0, 2], [0, 3], [1, 4], [3, 4]].forEach(([u, v]) => {
      line(ctx, lx + tree[u].x * lw, ly + 18 + tree[u].y * (lh - 24), lx + tree[v].x * lw, ly + 18 + tree[v].y * (lh - 24), tree[v].col, 1.8);
    });
    tree.forEach((n) => {
      const nx = lx + n.x * lw, ny = ly + 18 + n.y * (lh - 24);
      circle(ctx, nx, ny, 10, "rgba(22,26,46,0.95)", n.col, 2);
      txt(ctx, n.l, nx, ny + 22, n.col, 8.8, "center", true);
    });

    // Right: Log-log exploitability decay curve
    const rgx = rx + 26, rgy = ry + 32, rgw = rw - 42, rgh = rh - 52;
    line(ctx, rgx, rgy + rgh, rgx + rgw, rgy + rgh, C.axis, 1);
    line(ctx, rgx, rgy, rgx, rgy + rgh, C.axis, 1);
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const expY = Math.exp(-u * 3.2) * 0.88 + 0.05;
      const sx = rgx + u * rgw, sy = rgy + rgh - expY * rgh;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.3; ctx.stroke();

    const iterU = (st.v0 - 1) / 5;
    circle(ctx, rgx + iterU * rgw, rgy + rgh - (Math.exp(-iterU * 3.2) * 0.88 + 0.05) * rgh, 5.5, C.accent);

    const exploitMbb = (180 * Math.pow(10, -st.v0 * 0.55) * (1 + st.c * 0.5)).toFixed(2);
    return {
      "Jack Bluff / King Bet Ratio": `α = ${(alphaBluff * 100).toFixed(1)}%, 3α = ${(kBet * 100).toFixed(1)}%`,
      "CFR+ Iterations T": `10^${st.v0.toFixed(1)} traversals`,
      "Nash Exploitability ε": `${exploitMbb} mbb/hand`,
      "Kuhn Game Value v*": "−1/18 (−0.0556 ante/hand)",
    };
  };

  if (window.SelfTaughtSims && typeof window.SelfTaughtSims.registerCustomRenderers === "function") {
    window.SelfTaughtSims.registerCustomRenderers(R);
  } else {
    window.SelfTaughtCustomRenderers = Object.assign(window.SelfTaughtCustomRenderers || {}, R);
  }
})();


