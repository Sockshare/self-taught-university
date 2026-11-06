/* Self-Taught — Bespoke Unique Canvas Renderers for 60 STEM Expansion Simulations
 * Covers 20 Mathematics, 20 Physics, and 20 Chemistry simulations from group_1_stem.json.
 * Every single simulation has its own distinct, domain-accurate visual diagram & interactive dynamics.
 */
(function () {
  "use strict";

  const R = {
    // =========================================================================
    // 1. MATHEMATICS (20 Bespoke Renderers)
    // =========================================================================

    // 1. Fourier Epicycles & Complex Phasors
    math_fourier_epicycles(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Drag probe to inspect harmonic phase; chain of rotating phasors reconstructs discontinuous wave", st.spec.formula);
      const omega = st.v0 || 1.8;
      const alpha = st.v1 || 1.0;
      const N = Math.max(1, Math.round(st.v2 || 7));
      const jitter = st.v3 || 0.05;

      const cx = W * 0.24, cy = 48 + (H - 64) * 0.52;
      const baseR = Math.min(W * 0.13, (H - 80) * 0.28);

      let x = cx, y = cy;
      for (let k = 0; k < N; k++) {
        const n = 2 * k + 1;
        const amp = baseR * (4 / Math.PI) / Math.pow(n, alpha);
        const phase = n * omega * st.t + (jitter * Math.sin(k * 7.13 + st.t * 2));
        const nx = x + amp * Math.cos(phase);
        const ny = y + amp * Math.sin(phase);

        ctx.strokeStyle = "rgba(124, 156, 255, 0.32)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, amp), 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = C.series[k % C.series.length];
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        ctx.fillStyle = C.series[k % C.series.length];
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fill();

        x = nx; y = ny;
      }

      if (!st.mem.wave) st.mem.wave = [];
      st.mem.wave.unshift(y);
      if (st.mem.wave.length > 220) st.mem.wave.pop();

      const wx0 = W * 0.48, ww = W - wx0 - 20;
      st.panel(wx0 - 8, 46, ww + 14, H - 60, "Reconstructed Waveform f(t) & Gibbs Ringing");

      ctx.strokeStyle = "rgba(255, 209, 102, 0.65)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(wx0, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(wx0, y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i < st.mem.wave.length; i++) {
        const px = wx0 + (i / 220) * ww;
        const py = st.mem.wave[i];
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Spectral magnitude bar inset at bottom left
      const bx = 20, by = H - 64, bw = W * 0.22, bh = 46;
      st.panel(bx, by, bw, bh, "|cₙ| Spectrum");
      for (let k = 0; k < N; k++) {
        const n = 2 * k + 1;
        const hBar = Math.min(26, 26 / Math.pow(n, alpha * 0.7));
        ctx.fillStyle = C.series[k % C.series.length];
        const xBar = bx + 8 + k * ((bw - 16) / Math.max(1, N));
        ctx.fillRect(xBar, by + bh - 6 - hBar, Math.max(3, (bw - 20) / N - 2), hBar);
      }

      const gibbs = (8.95 * Math.pow(N / (N + 1), 0.5) / Math.pow(alpha, 0.6)).toFixed(2);
      return {
        "Epicycles N": `${N} odd modes`,
        "Fundamental ω₀": `${omega.toFixed(2)} rad/s`,
        "Roll-Off Decay": `n^(−${alpha.toFixed(2)})`,
        "Gibbs Overshoot": `${gibbs}%`,
      };
    },

    // 2. Lorenz Strange Attractor & Chaos
    math_lorenz_attractor(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Click to reset twin perturbed trajectories (Δx₀ = 10⁻³) & watch butterfly chaos", st.spec.formula);
      const sigma = st.v0 || 10;
      const rho = st.v1 || 28;
      const beta = st.v2 || 2.67;

      if (!st.mem.ptsA || st.mem.lastClick !== st.clicks.length) {
        st.mem.lastClick = st.clicks.length;
        const x0 = (st.px - 0.5) * 24 || 0.1;
        const y0 = (st.py - 0.5) * 24 || 1.0;
        st.mem.pA = { x: x0, y: y0, z: 18 };
        st.mem.pB = { x: x0 + 0.015, y: y0 - 0.01, z: 18 };
        st.mem.ptsA = [];
        st.mem.ptsB = [];
      }

      const stepL = (p, dt) => {
        const dx = sigma * (p.y - p.x);
        const dy = p.x * (rho - p.z) - p.y;
        const dz = p.x * p.y - beta * p.z;
        p.x += dx * dt; p.y += dy * dt; p.z += dz * dt;
      };
      for (let s = 0; s < 5; s++) {
        stepL(st.mem.pA, 0.0045);
        stepL(st.mem.pB, 0.0045);
        st.mem.ptsA.push({ x: st.mem.pA.x, y: st.mem.pA.y, z: st.mem.pA.z });
        st.mem.ptsB.push({ x: st.mem.pB.x, y: st.mem.pB.y, z: st.mem.pB.z });
      }
      if (st.mem.ptsA.length > 420) {
        st.mem.ptsA.splice(0, 5);
        st.mem.ptsB.splice(0, 5);
      }

      const lx = 18, ly = 46, lw = W * 0.58, lh = H - 60;
      st.panel(lx, ly, lw, lh, "3D Butterfly Attractor (x − z Projection)");
      const cx = lx + lw * 0.5, bottomZ = ly + lh - 18;
      const scX = lw / 52, scZ = (lh - 34) / 54;

      // Fixed point eyes C+ and C-
      if (rho > 1) {
        const rEye = Math.sqrt(beta * (rho - 1));
        [-rEye, rEye].forEach((ex) => {
          ctx.strokeStyle = C.accent;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(cx + ex * scX, bottomZ - (rho - 1) * scZ, 5, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      const drawWing = (pts, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const px = cx + pts[i].x * scX;
          const py = bottomZ - pts[i].z * scZ;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      drawWing(st.mem.ptsB, "rgba(255, 143, 171, 0.72)");
      drawWing(st.mem.ptsA, C.primary);

      const headA = st.mem.pA, headB = st.mem.pB;
      ctx.fillStyle = C.ok;
      ctx.beginPath();
      ctx.arc(cx + headA.x * scX, bottomZ - headA.z * scZ, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.secondary;
      ctx.beginPath();
      ctx.arc(cx + headB.x * scX, bottomZ - headB.z * scZ, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Right: x-y Top view + log divergence
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(rx, ly, rw, lh * 0.52, "Top View (x − y Plane)");
      const rcx = rx + rw * 0.5, rcy = ly + lh * 0.28;
      ctx.strokeStyle = C.series[5];
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let i = Math.max(0, st.mem.ptsA.length - 160); i < st.mem.ptsA.length; i++) {
        const p = st.mem.ptsA[i];
        const px = rcx + p.x * (rw / 56), py = rcy + p.y * (lh * 0.45 / 60);
        if (i === Math.max(0, st.mem.ptsA.length - 160)) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const by = ly + lh * 0.56, bh = lh * 0.44;
      st.panel(rx, by, rw, bh, "Trajectory Separation ‖δx(t)‖");
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const N = st.mem.ptsA.length;
      for (let i = 0; i < N; i++) {
        const a = st.mem.ptsA[i], b = st.mem.ptsB[i];
        const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        const px = rx + 8 + (i / Math.max(1, N - 1)) * (rw - 16);
        const py = by + bh - 8 - Math.min(1, dist / 35) * (bh - 28);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const sep = Math.hypot(headA.x - headB.x, headA.y - headB.y, headA.z - headB.z);
      const lyap = rho > 24.74 ? (0.906 * (rho / 28)).toFixed(3) : "-0.180";
      return {
        "Max Lyapunov λ₁": `${lyap} s⁻¹`,
        "Twin Separation ‖δx‖": sep.toFixed(2),
        "State (x, z)": `(${headA.x.toFixed(1)}, ${headA.z.toFixed(1)})`,
        "Regime": rho >= 24.74 ? "Strange Attractor" : "Damped Spiral",
      };
    },

    // 3. Singular Value Decomposition (SVD) Manifold
    math_svd_low_rank(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Vᵀ rotation → Σ stretch → U rotation; Right: Rank-k matrix reconstruction", st.spec.formula);
      const rankRatio = st.v0 || 0.5;
      const cond = st.v1 || 4.5;
      const noise = st.v2 || 0.1;

      const r = 8;
      const kRetained = Math.max(1, Math.round(rankRatio * r));

      // Left: Unit circle mapped to singular ellipse
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Geometric Action A = U Σ Vᵀ on Unit Circle");
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      const rad = Math.min(lw, lh) * 0.22;

      // Unit circle
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const rot = 0.45 + 0.25 * Math.sin(st.t * 0.7);
      const s1 = 1.45;
      const s2 = Math.max(0.18, s1 / Math.pow(cond, 0.55));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = C.primary;
      ctx.fillStyle = "rgba(124, 156, 255, 0.14)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, rad * s1, rad * s2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Singular vectors σ₁ u₁ and σ₂ u₂
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(rad * s1, 0);
      ctx.stroke();
      ctx.fillStyle = C.accent;
      ctx.fillText("σ₁u₁", rad * s1 - 24, -6);

      ctx.strokeStyle = C.secondary;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, -rad * s2);
      ctx.stroke();
      ctx.fillStyle = C.secondary;
      ctx.fillText("σ₂u₂", 6, -rad * s2 + 4);
      ctx.restore();

      // Middle: Singular Value Spectrum
      const mx = lx + lw + 10, mw = W * 0.23;
      st.panel(mx, ly, mw, lh, `Singular Spectrum σᵢ (k=${kRetained}/${r})`);
      const sigmas = [];
      let totalE = 0, keptE = 0;
      for (let i = 0; i < r; i++) {
        const sv = Math.exp(-i * Math.log(cond) / (r - 1)) + noise * 0.25 * ((i % 2) ? 0.7 : 0.4);
        sigmas.push(sv);
        totalE += sv * sv;
        if (i < kRetained) keptE += sv * sv;
      }
      for (let i = 0; i < r; i++) {
        const bw = (mw - 24) / r;
        const bx = mx + 12 + i * bw;
        const bh = (sigmas[i] / sigmas[0]) * (lh - 54);
        ctx.fillStyle = i < kRetained ? C.ok : "rgba(255, 107, 107, 0.28)";
        ctx.fillRect(bx, ly + lh - 22 - bh, bw - 3, bh);
        ctx.fillStyle = C.muted;
        ctx.font = "9px monospace";
        ctx.fillText(String(i + 1), bx + 2, ly + lh - 9);
      }

      // Right: Low-rank 8x8 reconstructed heatmap A_k
      const rx = mx + mw + 10, rw = W - rx - 16;
      st.panel(rx, ly, rw, lh, "Rank-k Approximation Aₖ");
      const cellW = (rw - 20) / r, cellH = (lh - 38) / r;
      for (let row = 0; row < r; row++) {
        for (let col = 0; col < r; col++) {
          let val = 0;
          for (let m = 0; m < kRetained; m++) {
            const u = Math.cos((row + 0.5) * (m + 1) * Math.PI / r);
            const v = Math.sin((col + 0.5) * (m + 1) * Math.PI / r + st.t * 0.4);
            val += sigmas[m] * u * v;
          }
          const norm = Math.max(0, Math.min(1, 0.5 + 0.35 * val));
          ctx.fillStyle = `rgba(${Math.round(60 + norm * 180)}, ${Math.round(90 + (1 - norm) * 120)}, 255, 0.88)`;
          ctx.fillRect(rx + 10 + col * cellW, ly + 26 + row * cellH, cellW - 2, cellH - 2);
        }
      }

      const frobErr = Math.sqrt(Math.max(0, 1 - keptE / Math.max(1e-6, totalE))) * 100;
      return {
        "Active Rank k / r": `${kRetained} / ${r}`,
        "Condition κ(A)": cond.toFixed(2),
        "Energy Captured": `${((keptE / totalE) * 100).toFixed(1)}%`,
        "Eckart-Young Error": `${frobErr.toFixed(1)}%`,
      };
    },

    // 4. 2D Reaction-Diffusion & Laplacian PDE Solver
    math_pde_heat_wave(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Click/drag to inject Gray-Scott activator u(x,y); Right: 5-point Laplacian stencil", st.spec.formula);
      const F = st.v0 || 0.038;
      const K = st.v1 || 0.061;
      const D = st.v2 || 0.18;

      const NX = 36, NY = 24;
      if (!st.mem.u) {
        st.mem.u = new Float32Array(NX * NY).fill(1);
        st.mem.v = new Float32Array(NX * NY).fill(0);
        for (let j = 8; j < 16; j++) {
          for (let i = 13; i < 23; i++) {
            st.mem.v[j * NX + i] = 0.5 + 0.25 * Math.sin(i * j);
            st.mem.u[j * NX + i] = 0.5;
          }
        }
      }

      if (st.dragging || st.pulse > 0.4) {
        const ci = Math.floor(st.px * NX * 0.65);
        const cj = Math.floor(st.py * NY);
        for (let dj = -2; dj <= 2; dj++) {
          for (let di = -2; di <= 2; di++) {
            const ii = (ci + di + NX) % NX, jj = (cj + dj + NY) % NY;
            st.mem.v[jj * NX + ii] = 0.75;
          }
        }
      }

      const u = st.mem.u, v = st.mem.v;
      const uNext = new Float32Array(NX * NY);
      const vNext = new Float32Array(NX * NY);
      for (let step = 0; step < 2; step++) {
        for (let j = 0; j < NY; j++) {
          for (let i = 0; i < NX; i++) {
            const idx = j * NX + i;
            const l = j * NX + ((i - 1 + NX) % NX);
            const r = j * NX + ((i + 1) % NX);
            const up = ((j - 1 + NY) % NY) * NX + i;
            const dn = ((j + 1) % NY) * NX + i;
            const lapU = u[l] + u[r] + u[up] + u[dn] - 4 * u[idx];
            const lapV = v[l] + v[r] + v[up] + v[dn] - 4 * v[idx];
            const uvv = u[idx] * v[idx] * v[idx];
            uNext[idx] = Math.max(0, Math.min(1, u[idx] + (D * lapU - uvv + F * (1 - u[idx])) * 0.75));
            vNext[idx] = Math.max(0, Math.min(1, v[idx] + (D * 0.5 * lapV + uvv - (F + K) * v[idx]) * 0.75));
          }
        }
        u.set(uNext); v.set(vNext);
      }

      const lx = 18, ly = 46, lw = W * 0.60, lh = H - 60;
      st.panel(lx, ly, lw, lh, "2D Turing Reaction-Diffusion Field v(x,y)");
      const cw = (lw - 16) / NX, ch = (lh - 32) / NY;
      let maxLap = 0;
      for (let j = 0; j < NY; j++) {
        for (let i = 0; i < NX; i++) {
          const val = v[j * NX + i];
          maxLap += val;
          const rC = Math.round(25 + val * 220);
          const gC = Math.round(35 + Math.sin(val * Math.PI) * 190);
          const bC = Math.round(90 + (1 - val) * 140);
          ctx.fillStyle = `rgb(${rC},${gC},${bC})`;
          ctx.fillRect(lx + 8 + i * cw, ly + 24 + j * ch, cw + 0.5, ch + 0.5);
        }
      }

      // Right: 5-point Finite-Difference Stencil diagram + 1D slice
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(rx, ly, rw, lh, "5-Point ∇²h Stencil & Slice");
      const scx = rx + rw * 0.5, scy = ly + lh * 0.34, arm = Math.min(rw, lh) * 0.22;
      const nodes = [
        { dx: 0, dy: 0, w: "-4/h²", c: C.danger },
        { dx: -1, dy: 0, w: "+1/h²", c: C.primary },
        { dx: 1, dy: 0, w: "+1/h²", c: C.primary },
        { dx: 0, dy: -1, w: "+1/h²", c: C.primary },
        { dx: 0, dy: 1, w: "+1/h²", c: C.primary },
      ];
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scx - arm, scy); ctx.lineTo(scx + arm, scy);
      ctx.moveTo(scx, scy - arm); ctx.lineTo(scx, scy + arm);
      ctx.stroke();

      nodes.forEach((nd) => {
        const nx = scx + nd.dx * arm, ny = scy + nd.dy * arm;
        ctx.fillStyle = nd.c;
        ctx.beginPath();
        ctx.arc(nx, ny, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = C.text;
        ctx.font = "600 9px monospace";
        ctx.fillText(nd.w, nx - 13, ny + 3);
      });

      // Mid-row concentration profile u(x) and v(x)
      const py0 = ly + lh * 0.88;
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < NX; i++) {
        const px = rx + 10 + (i / (NX - 1)) * (rw - 20);
        const py = py0 - v[12 * NX + i] * (lh * 0.28);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Feed / Kill (F, K)": `${F.toFixed(3)}, ${K.toFixed(3)}`,
        "Diffusivity D_u": D.toFixed(2),
        "Mean Activator ⟨v⟩": (maxLap / (NX * NY)).toFixed(3),
        "CFL Stability": (D * 4 < 1.0) ? "Stable (CFL < 1)" : "Borderline",
      };
    },

    // 5. Markov Chain Mixing & Perron-Frobenius Spectrum
    math_markov_ergodic(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Directed stochastic state graph; Right: π(t) vs stationary π* & eigenvalue circle", st.spec.formula);
      const deg = Math.max(1, Math.round(st.v0 || 2));
      const rate = st.v1 || 1.4;
      const alpha = st.v2 || 0.15;

      const N = 6;
      if (!st.mem.dist || st.mem.lastClick !== st.clicks.length) {
        st.mem.lastClick = st.clicks.length;
        st.mem.dist = [1, 0, 0, 0, 0, 0];
      }

      // Evolve distribution toward stationary
      const targetPi = [0.22, 0.18, 0.16, 0.15, 0.15, 0.14];
      const mixRate = (0.15 * deg + alpha * 0.6) * rate * st.dt;
      let tvd = 0;
      for (let i = 0; i < N; i++) {
        st.mem.dist[i] += (targetPi[i] - st.mem.dist[i]) * Math.min(1, mixRate);
        tvd += 0.5 * Math.abs(st.mem.dist[i] - targetPi[i]);
      }

      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Stochastic Digraph & Random Surfer Tokens");
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.33;

      const pts = [];
      for (let i = 0; i < N; i++) {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / N;
        pts.push({ x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) });
      }

      // Directed edges
      for (let i = 0; i < N; i++) {
        for (let d = 1; d <= deg; d++) {
          const j = (i + d) % N;
          ctx.strokeStyle = "rgba(124,156,255,0.28)";
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();

          // Moving probability packet
          const u = (st.t * rate * 0.5 + i * 0.17 + d * 0.31) % 1;
          const px = pts[i].x + (pts[j].x - pts[i].x) * u;
          const py = pts[i].y + (pts[j].y - pts[i].y) * u;
          ctx.fillStyle = C.accent;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // State nodes sized by current probability p_i(t)
      pts.forEach((p, i) => {
        const nr = 12 + st.mem.dist[i] * 26;
        ctx.fillStyle = C.series[i % C.series.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, nr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f1222";
        ctx.font = "700 10px monospace";
        ctx.fillText(`S${i + 1}`, p.x - 7, p.y + 3);
      });

      // Right top: Current p(t) vs stationary π* bars
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(rx, ly, rw, lh * 0.50, "State Distribution p(t) vs Stationary π*");
      const bw = (rw - 28) / N;
      for (let i = 0; i < N; i++) {
        const bx = rx + 14 + i * bw;
        const hCurr = Math.min(lh * 0.34, st.mem.dist[i] * (lh * 0.95));
        const hStat = targetPi[i] * (lh * 0.95);
        ctx.fillStyle = C.series[i % C.series.length];
        ctx.fillRect(bx, ly + lh * 0.45 - hCurr, bw * 0.42, hCurr);
        ctx.strokeStyle = C.text;
        ctx.strokeRect(bx + bw * 0.45, ly + lh * 0.45 - hStat, bw * 0.36, hStat);
      }

      // Right bottom: Perron-Frobenius unit disk eigenvalues
      const by = ly + lh * 0.54, bh = lh * 0.46;
      st.panel(rx, by, rw, bh, "Perron-Frobenius Spectrum {λᵢ} inside Unit Disk");
      const dcx = rx + rw * 0.5, dcy = by + bh * 0.56, dr = Math.min(rw, bh) * 0.32;
      ctx.strokeStyle = C.axis;
      ctx.beginPath();
      ctx.arc(dcx, dcy, dr, 0, Math.PI * 2);
      ctx.stroke();

      const lam2 = Math.max(0.08, (1 - alpha) * Math.max(0.15, 1 - 0.22 * deg));
      // λ₁ = 1
      ctx.fillStyle = C.ok;
      ctx.beginPath();
      ctx.arc(dcx + dr, dcy, 5, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 1; i < N; i++) {
        const ang = (i * 2 * Math.PI) / (N - 1);
        const rLam = dr * Math.pow(lam2, 0.8 + 0.1 * i);
        ctx.fillStyle = C.secondary;
        ctx.beginPath();
        ctx.arc(dcx + rLam * Math.cos(ang), dcy + rLam * Math.sin(ang), 4, 0, Math.PI * 2);
        ctx.fill();
      }

      return {
        "Perron Root λ₁": "1.000",
        "Second Eigenvalue |λ₂|": lam2.toFixed(3),
        "Spectral Gap 1−|λ₂|": (1 - lam2).toFixed(3),
        "Total Variation d_TV": tvd.toFixed(3),
      };
    },

    // 6. Newton-Raphson Complex Basins & Convergence
    math_newton_fractal_basins(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Click anywhere in the complex plane z₀ to trace Newton-Raphson iterates to roots of z³ − μ = 0", st.spec.formula);
      const step = st.v0 || 0.85;
      const mu = st.v1 || 1.2;
      const reg = st.v2 || 0.08;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      st.panel(lx, ly, lw, lh, "Complex Newton Basins f(z) = z³ − μ");

      const roots = [
        { r: Math.pow(mu, 1 / 3), i: 0, col: C.primary },
        { r: Math.pow(mu, 1 / 3) * Math.cos(2 * Math.PI / 3), i: Math.pow(mu, 1 / 3) * Math.sin(2 * Math.PI / 3), col: C.secondary },
        { r: Math.pow(mu, 1 / 3) * Math.cos(4 * Math.PI / 3), i: Math.pow(mu, 1 / 3) * Math.sin(4 * Math.PI / 3), col: C.ok },
      ];

      const iterNewton = (zr, zi, maxIt) => {
        const path = [{ r: zr, i: zi }];
        for (let k = 0; k < maxIt; k++) {
          // z^2 = (zr^2 - zi^2) + i(2 zr zi)
          const z2r = zr * zr - zi * zi, z2i = 2 * zr * zi;
          // z^3 - mu
          const fr = zr * z2r - zi * z2i - mu;
          const fi = zr * z2i + zi * z2r;
          // f'(z) = 3 z^2 + reg
          const dfr = 3 * z2r + reg, dfi = 3 * z2i;
          const denom = Math.max(1e-6, dfr * dfr + dfi * dfi);
          zr -= step * (fr * dfr + fi * dfi) / denom;
          zi -= step * (fi * dfr - fr * dfi) / denom;
          path.push({ r: zr, i: zi });
          if (fr * fr + fi * fi < 1e-5) break;
        }
        return path;
      };

      const NX = 34, NY = 24;
      const cw = (lw - 16) / NX, ch = (lh - 32) / NY;
      for (let gy = 0; gy < NY; gy++) {
        for (let gx = 0; gx < NX; gx++) {
          const zr0 = ((gx + 0.5) / NX - 0.5) * 3.6;
          const zi0 = ((gy + 0.5) / NY - 0.5) * 3.2;
          const p = iterNewton(zr0, zi0, 7);
          const last = p[p.length - 1];
          let bestIdx = 0, bestD = 999;
          roots.forEach((rt, idx) => {
            const d = Math.hypot(last.r - rt.r, last.i - rt.i);
            if (d < bestD) { bestD = d; bestIdx = idx; }
          });
          const shade = Math.max(0.2, 1 - p.length / 9);
          ctx.fillStyle = bestIdx === 0 ? `rgba(124,156,255,${shade * 0.55})` : (bestIdx === 1 ? `rgba(255,143,171,${shade * 0.55})` : `rgba(110,231,183,${shade * 0.55})`);
          ctx.fillRect(lx + 8 + gx * cw, ly + 24 + gy * ch, cw - 0.5, ch - 0.5);
        }
      }

      const toScreen = (zr, zi) => ({
        x: lx + 8 + ((zr / 3.6) + 0.5) * (lw - 16),
        y: ly + 24 + ((zi / 3.2) + 0.5) * (lh - 32),
      });

      // Mark 3 roots
      roots.forEach((rt, idx) => {
        const sp = toScreen(rt.r, rt.i);
        ctx.fillStyle = rt.col;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = C.text;
        ctx.fillText(`r${idx + 1}`, sp.x + 8, sp.y + 4);
      });

      // Active probe trajectory
      const z0r = (st.px - 0.35) * 3.4;
      const z0i = (st.py - 0.52) * 3.0;
      const tr = iterNewton(z0r, z0i, 16);
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      tr.forEach((pt, idx) => {
        const sp = toScreen(pt.r, pt.i);
        if (idx === 0) ctx.moveTo(sp.x, sp.y); else ctx.lineTo(sp.x, sp.y);
      });
      ctx.stroke();
      tr.forEach((pt, idx) => {
        const sp = toScreen(pt.r, pt.i);
        ctx.fillStyle = idx === 0 ? C.danger : C.accent;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, idx === 0 ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Right: Quadratic residual decay log₁₀|f(zₙ)|
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(rx, ly, rw, lh, "Quadratic Residual Decay log₁₀|f(zₙ)|");
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      tr.forEach((pt, idx) => {
        const z2r = pt.r * pt.r - pt.i * pt.i, z2i = 2 * pt.r * pt.i;
        const fr = pt.r * z2r - pt.i * z2i - mu, fi = pt.r * z2i + pt.i * z2r;
        const res = Math.log10(Math.max(1e-7, Math.hypot(fr, fi)));
        const px = rx + 16 + (idx / Math.max(1, tr.length - 1)) * (rw - 32);
        const py = ly + 36 + ((-res + 1) / 8) * (lh - 56);
        if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      return {
        "Iterations to Root": `${tr.length - 1} steps`,
        "Damping Factor α": step.toFixed(2),
        "Root Radius |rᵢ|": Math.pow(mu, 1 / 3).toFixed(3),
        "Convergence Order": Math.abs(step - 1) < 0.08 ? "Quadratic O(ε²)" : "Linear O(ε)",
      };
    },

    // 7. Conformal Mapping & Joukowsky Airfoil Transform
    math_conformal_joukowsky(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Offset circle in z-plane; Right: Mapped Joukowsky airfoil w = z + c²/z with streamlines", st.spec.formula);
      const camber = st.v0 || 0.22;
      const thick = st.v1 || 0.18;
      const modes = st.v2 || 4;

      const lx = 18, ly = 46, lw = W * 0.44, lh = H - 60;
      const rx = lx + lw + 14, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Complex z-Plane (Off-Center Cylinder)");
      st.panel(rx, ly, rw, lh, "Mapped w-Plane (Joukowsky Airfoil & Flow)");

      const zcx = lx + lw * 0.52, zcy = ly + lh * 0.54, scZ = Math.min(lw, lh) * 0.26;
      const wcx = rx + rw * 0.50, wcy = ly + lh * 0.54, scW = Math.min(rw, lh) * 0.17;

      const x0 = -thick * 0.65;
      const y0 = camber * 0.45;
      const R = Math.hypot(1 - x0, y0);

      // Singular points z = ±1 in z-plane
      [-1, 1].forEach((s) => {
        ctx.fillStyle = C.danger;
        ctx.beginPath();
        ctx.arc(zcx + s * scZ, zcy, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      const mapJ = (zr, zi) => {
        const d2 = Math.max(0.04, zr * zr + zi * zi);
        const c2 = 1.0 - 0.03 * (10 - modes);
        return {
          u: zr + c2 * zr / d2,
          v: zi - c2 * zi / d2,
        };
      };

      // Conformal radial spokes and concentric circles
      for (let ring = 1; ring <= 4; ring++) {
        const rr = R * (1 + ring * 0.24);
        ctx.strokeStyle = "rgba(124,156,255,0.22)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let i = 0; i <= 72; i++) {
          const th = (i / 72) * Math.PI * 2;
          const zr = x0 + rr * Math.cos(th), zi = y0 + rr * Math.sin(th);
          const px = zcx + zr * scZ, py = zcy - zi * scZ;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Mapped streamline in w-plane
        ctx.strokeStyle = "rgba(103, 232, 249, 0.30)";
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const th = (i / 90) * Math.PI * 2;
          const zr = x0 + rr * Math.cos(th), zi = y0 + rr * Math.sin(th);
          const w = mapJ(zr, zi);
          const px = wcx + w.u * scW, py = wcy - w.v * scW;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Draw cylinder in z-plane
      ctx.strokeStyle = C.accent;
      ctx.fillStyle = "rgba(255, 209, 102, 0.14)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const th = (i / 90) * Math.PI * 2;
        const zr = x0 + R * Math.cos(th), zi = y0 + R * Math.sin(th);
        const px = zcx + zr * scZ, py = zcy - zi * scZ;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.fill();
      ctx.stroke();

      // Draw airfoil in w-plane
      ctx.strokeStyle = C.ok;
      ctx.fillStyle = "rgba(110, 231, 183, 0.24)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const th = (i / 120) * Math.PI * 2;
        const zr = x0 + R * Math.cos(th), zi = y0 + R * Math.sin(th);
        const w = mapJ(zr, zi);
        const px = wcx + w.u * scW, py = wcy - w.v * scW;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.fill();
      ctx.stroke();

      // Animated circulation particles around airfoil
      for (let p = 0; p < 10; p++) {
        const th = (st.t * 1.1 + p * (Math.PI * 2 / 10)) % (Math.PI * 2);
        const rr = R * 1.28;
        const w = mapJ(x0 + rr * Math.cos(th), y0 + rr * Math.sin(th));
        ctx.fillStyle = C.accent;
        ctx.beginPath();
        ctx.arc(wcx + w.u * scW, wcy - w.v * scW, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const cl = (2 * Math.PI * (camber * 0.45 + 0.08)).toFixed(2);
      return {
        "Kutta Lift C_L": cl,
        "Max Camber η_y": `${(camber * 18).toFixed(1)}%`,
        "Thickness Ratio": `${(thick * 24).toFixed(1)}%`,
        "Trailing Edge": "Conformal Cusp (f'(1)=0)",
      };
    },

    // 8. Riemann Zeta Critical Line & Euler Product Spiral
    math_riemann_zeta_zeros(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Critical strip 0 ≤ σ ≤ 1 & zeros; Right: Dirichlet partial-sum spiral Σ n^(−σ−it)", st.spec.formula);
      const tVal = st.v0 || 14.13;
      const sigma = st.v1 || 0.5;
      const terms = Math.max(10, Math.round(st.v2 || 90));

      const lx = 18, ly = 46, lw = W * 0.36, lh = H - 60;
      const rx = lx + lw + 14, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Critical Strip 0 ≤ Re(s) ≤ 1");
      st.panel(rx, ly, rw, lh, `Dirichlet Phasor Spiral ζ(${sigma.toFixed(2)} + ${tVal.toFixed(2)}i)`);

      // Strip boundaries Re(s)=0 and Re(s)=1
      const sLeft = lx + lw * 0.25, sRight = lx + lw * 0.75;
      ctx.fillStyle = "rgba(124, 156, 255, 0.10)";
      ctx.fillRect(sLeft, ly + 26, sRight - sLeft, lh - 38);

      // Critical line Re(s) = 1/2
      const sMid = (sLeft + sRight) * 0.5;
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(sMid, ly + 26); ctx.lineTo(sMid, ly + lh - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      const knownZeros = [14.135, 21.022, 25.011, 30.425, 32.935, 37.586, 40.919, 43.327, 48.005];
      const mapT = (tv) => ly + lh - 16 - ((tv - 8) / 44) * (lh - 46);
      knownZeros.forEach((kz) => {
        const zy = mapT(kz);
        ctx.fillStyle = C.ok;
        ctx.beginPath();
        ctx.arc(sMid, zy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = C.muted;
        ctx.font = "9px monospace";
        ctx.fillText(`t=${kz.toFixed(2)}`, sMid + 8, zy + 3);
      });

      // Current s = sigma + i*tVal marker
      const curX = sLeft + sigma * (sRight - sLeft);
      const curY = mapT(tVal);
      ctx.fillStyle = C.danger;
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Right: Euler-Dirichlet alternating/Riemann-Siegel spiral around origin
      const ocx = rx + rw * 0.48, ocy = ly + lh * 0.54;
      const sc = Math.min(rw, lh) * 0.24;

      // Origin crosshair
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rx + 12, ocy); ctx.lineTo(rx + rw - 12, ocy);
      ctx.moveTo(ocx, ly + 28); ctx.lineTo(ocx, ly + lh - 12);
      ctx.stroke();

      // Eta function alternating series (converges in critical strip!) divided by (1 - 2^(1-s))
      let sumR = 0, sumI = 0;
      ctx.lineWidth = 1.6;
      for (let n = 1; n <= terms; n++) {
        const sign = (n % 2 === 1) ? 1 : -1;
        const mag = sign * Math.pow(n, -sigma);
        const ang = -tVal * Math.log(n);
        const nx = sumR + mag * Math.cos(ang);
        const ny = sumI + mag * Math.sin(ang);

        ctx.strokeStyle = C.series[n % C.series.length];
        ctx.beginPath();
        ctx.moveTo(ocx + sumR * sc, ocy - sumI * sc);
        ctx.lineTo(ocx + nx * sc, ocy - ny * sc);
        ctx.stroke();
        sumR = nx; sumI = ny;
      }

      // Origin target ring
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(ocx, ocy, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Final partial sum head
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(ocx + sumR * sc, ocy - sumI * sc, 5, 0, Math.PI * 2);
      ctx.fill();

      const modZ = Math.hypot(sumR, sumI);
      return {
        "Critical Coord s": `${sigma.toFixed(2)} + ${tVal.toFixed(2)}i`,
        "|η(s)| Modulus": modZ.toFixed(3),
        "Nearest Zero": knownZeros.reduce((a, b) => Math.abs(b - tVal) < Math.abs(a - tVal) ? b : a).toFixed(3),
        "Zero Proximity": modZ < 0.12 ? "NEAR NON-TRIVIAL ZERO!" : "Off-Zero Spiral",
      };
    },

    // 9. Cyclotomic Fields & Galois Group Permutations
    math_galois_cyclotomic(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Roots of unity ζₙ^j & Frobenius chords j ↦ k·j mod n; Right: Orbit cycles", st.spec.formula);
      const n = Math.max(3, Math.round(st.v0 || 13));
      const k = Math.max(1, Math.round(st.v1 || 3));
      const subProj = st.v2 || 0.3;

      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      let phi = 0;
      for (let i = 1; i < n; i++) if (gcd(i, n) === 1) phi++;

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Cyclotomic Circle Q(ζ_${n}) & Automorphism σ_${k}`);
      st.panel(rx, ly, rw, lh, "Galois Orbit Decomposition & Subfield Trace");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.35;
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      const pts = [];
      for (let j = 0; j < n; j++) {
        const ang = (j * 2 * Math.PI) / n;
        pts.push({
          x: cx + R * Math.cos(ang),
          y: cy - R * Math.sin(ang),
          prim: gcd(j, n) === 1,
        });
      }

      // Draw Frobenius automorphism chords ζ^j -> ζ^(k*j mod n)
      for (let j = 1; j < n; j++) {
        const target = (j * k) % n;
        ctx.strokeStyle = pts[j].prim ? C.series[j % C.series.length] : "rgba(255,255,255,0.16)";
        ctx.lineWidth = pts[j].prim ? 1.8 : 1.0;
        ctx.beginPath();
        ctx.moveTo(pts[j].x, pts[j].y);
        ctx.lineTo(pts[target].x, pts[target].y);
        ctx.stroke();

        // Real subfield projection ζ + ζ⁻¹ = 2 cos(2πj/n)
        if (subProj > 0.35 && j <= n / 2) {
          ctx.strokeStyle = "rgba(255, 209, 102, 0.35)";
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(pts[j].x, pts[j].y);
          ctx.lineTo(pts[n - j].x, pts[n - j].y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      pts.forEach((p, j) => {
        ctx.fillStyle = j === 0 ? C.text : (p.prim ? C.ok : C.secondary);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.prim ? 5.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        if (n <= 17) {
          ctx.fillStyle = C.text;
          ctx.font = "10px monospace";
          ctx.fillText(`ζ^${j}`, p.x + (p.x > cx ? 7 : -22), p.y + 4);
        }
      });

      // Right: Compute multiplicative order of k mod n and display orbit cycles
      const visited = new Array(n).fill(false);
      const cycles = [];
      for (let j = 1; j < n; j++) {
        if (!visited[j]) {
          const cyc = [];
          let curr = j;
          while (!visited[curr] && cyc.length < n) {
            visited[curr] = true;
            cyc.push(curr);
            curr = (curr * k) % n;
          }
          cycles.push(cyc);
        }
      }

      cycles.slice(0, 7).forEach((cyc, idx) => {
        const yRow = ly + 38 + idx * 24;
        ctx.fillStyle = C.series[idx % C.series.length];
        ctx.font = "600 11px monospace";
        ctx.fillText(`Orbit #${idx + 1}: (${cyc.join(" → ")})`, rx + 12, yRow);
      });

      const isAut = gcd(k, n) === 1;
      return {
        "Degree φ(n)": `${phi} (|Gal| = ${phi})`,
        "Map ζ ↦ ζ^k": `k = ${k} (${isAut ? "Automorphism" : "Endomorphism"})`,
        "Orbit Count": `${cycles.length} cycles`,
        "Constructible?": [3, 4, 5, 6, 8, 10, 12, 15, 16, 17, 20, 24].includes(n) ? "Yes (Fermat 2ᵃpᵢ)" : "No",
      };
    },

    // 10. Riemannian Geodesics & Gaussian Curvature K
    math_geodesic_curvature(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("3D curved manifold z = ½ K (x² + ε y²) with geodesic spray & parallel transport holonomy", st.spec.formula);
      const K = st.v0 !== undefined ? st.v0 : 0.6;
      const pitch = (st.v1 || 25) * Math.PI / 180;
      const aniso = st.v2 || 0.2;

      const lx = 18, ly = 46, lw = W * 0.58, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      const surfType = K > 0.15 ? "Elliptic Dome (K > 0)" : (K < -0.15 ? "Hyperbolic Saddle (K < 0)" : "Flat Euclidean (K ≈ 0)");
      st.panel(lx, ly, lw, lh, `3D Wireframe Manifold: ${surfType}`);
      st.panel(rx, ly, rw, lh, "Jacobi Deviation J(s) & Gauss-Bonnet Loop");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.56, scale = Math.min(lw, lh) * 0.28;
      const proj3D = (x, y) => {
        const z = 0.38 * K * (x * x + (1 - aniso * 0.8) * y * y);
        const yaw = 0.55 + 0.15 * Math.sin(st.t * 0.4);
        const rx3 = x * Math.cos(yaw) - y * Math.sin(yaw);
        const ry3 = x * Math.sin(yaw) + y * Math.cos(yaw);
        return {
          px: cx + rx3 * scale,
          py: cy + (ry3 * 0.45 - z * 0.85) * scale,
        };
      };

      // Wireframe grid
      ctx.strokeStyle = "rgba(124, 156, 255, 0.26)";
      ctx.lineWidth = 1;
      for (let g = -1.2; g <= 1.21; g += 0.3) {
        ctx.beginPath();
        for (let s = -1.2; s <= 1.21; s += 0.15) {
          const p = proj3D(g, s);
          if (s === -1.2) ctx.moveTo(p.px, p.py); else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let s = -1.2; s <= 1.21; s += 0.15) {
          const p = proj3D(s, g);
          if (s === -1.2) ctx.moveTo(p.px, p.py); else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      }

      // Geodesic spray trajectories (converge for K>0, diverge for K<0)
      for (let ray = -2; ray <= 2; ray++) {
        ctx.strokeStyle = ray === 0 ? C.accent : C.ok;
        ctx.lineWidth = ray === 0 ? 2.4 : 1.7;
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const s = (i / 40) * 2.2 - 1.1;
          const spread = ray * 0.18 * (K >= 0 ? Math.cos(Math.sqrt(Math.max(0.01, K)) * (s + 1.1) * 0.9) : Math.cosh(Math.sqrt(-K) * (s + 1.1) * 0.85));
          const x = s * Math.cos(pitch * 0.3) - spread * Math.sin(pitch * 0.3);
          const y = s * Math.sin(pitch * 0.3) + spread * Math.cos(pitch * 0.3);
          const p = proj3D(x, y);
          if (i === 0) ctx.moveTo(p.px, p.py); else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      }

      // Right top: Jacobi field J(s) curve
      ctx.strokeStyle = K >= 0 ? C.primary : C.danger;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const s = (i / 60) * 2.5;
        const jVal = K > 0.05 ? Math.sin(Math.sqrt(K) * s) / Math.sqrt(K) : (K < -0.05 ? Math.sinh(Math.sqrt(-K) * s) / Math.sqrt(-K) : s);
        const px = rx + 14 + (i / 60) * (rw - 28);
        const py = ly + lh * 0.46 - Math.min(1.6, jVal * 0.55) * (lh * 0.22);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Geodesic triangle angle sum Σ αᵢ = π + ∬ K dA
      const tcx = rx + rw * 0.5, tcy = ly + lh * 0.76, tr = Math.min(rw, lh) * 0.16;
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const bulge = K * 14;
      ctx.moveTo(tcx, tcy - tr);
      ctx.quadraticCurveTo(tcx + tr * 0.5 + bulge, tcy, tcx + tr, tcy + tr * 0.8);
      ctx.quadraticCurveTo(tcx, tcy + tr * 0.8 + bulge, tcx - tr, tcy + tr * 0.8);
      ctx.quadraticCurveTo(tcx - tr * 0.5 - bulge, tcy, tcx, tcy - tr);
      ctx.stroke();

      const angleSum = (180 + K * 42).toFixed(1);
      return {
        "Gaussian Curvature K": K.toFixed(2),
        "Triangle Sum Σ αᵢ": `${angleSum}° (${K >= 0 ? "≥" : "<"} 180°)`,
        "Holonomy Δθ = ∬KdA": `${(K * 0.73).toFixed(2)} rad`,
        "Geodesic Behavior": K > 0.1 ? "Conjugate Focusing" : (K < -0.1 ? "Exponential Divergence" : "Parallel"),
      };
    },

    // 11. Monte Carlo Importance Sampling & Variance Reduction
    math_monte_carlo_importance(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Target f(x)p(x) vs tilted proposal q(x) & weighted samples; Right: Variance decay", st.spec.formula);
      const muQ = st.v0 !== undefined ? st.v0 : 1.5;
      const sigQ = st.v1 || 1.0;
      const tail = st.v2 || 2.0;

      const lx = 18, ly = 46, lw = W * 0.56, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Target Integrand f(x)p(x) vs Importance Proposal q(x)");
      st.panel(rx, ly, rw, lh, "Estimator Variance σ²_IS vs Naive σ²_MC");

      const xMin = -2.5, xMax = 4.5;
      const toX = (x) => lx + 16 + ((x - xMin) / (xMax - xMin)) * (lw - 32);
      const baseY = ly + lh - 26;
      const hScale = lh - 64;

      const targetCenter = 1.8 + (tail - 2.0) * 0.35;
      const targetSpread = 0.65;
      const evalTarget = (x) => Math.exp(-0.5 * Math.pow((x - targetCenter) / targetSpread, 2)) / (targetSpread * 2.5066);
      const evalProp = (x) => Math.exp(-0.5 * Math.pow((x - muQ) / sigQ, 2)) / (sigQ * 2.5066);

      // Draw naive p(x) centered at 0
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const x = xMin + (i / 100) * (xMax - xMin);
        const y = Math.exp(-0.5 * x * x) / 2.5066;
        const px = toX(x), py = baseY - y * hScale * 1.3;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Target f(x)p(x)
      ctx.strokeStyle = C.ok;
      ctx.fillStyle = "rgba(110, 231, 183, 0.16)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(toX(xMin), baseY);
      for (let i = 0; i <= 100; i++) {
        const x = xMin + (i / 100) * (xMax - xMin);
        ctx.lineTo(toX(x), baseY - evalTarget(x) * hScale * 1.2);
      }
      ctx.lineTo(toX(xMax), baseY);
      ctx.fill();
      ctx.stroke();

      // Draw Proposal q(x)
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const x = xMin + (i / 100) * (xMax - xMin);
        const px = toX(x), py = baseY - evalProp(x) * hScale * 1.2;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Weighted sample stems w_i = target(x_i) / q(x_i)
      let sumW = 0, sumW2 = 0;
      const M = 24;
      for (let m = 0; m < M; m++) {
        const u = (m + 0.5) / M;
        const z = (u - 0.5) * 3.4 + 0.15 * Math.sin(st.t * 1.5 + m);
        const x = muQ + z * sigQ;
        if (x > xMin && x < xMax) {
          const w = evalTarget(x) / Math.max(1e-4, evalProp(x));
          sumW += w;
          sumW2 += w * w;
          const sx = toX(x);
          const sy = baseY - Math.min(0.95, w * 0.35) * hScale;
          ctx.strokeStyle = C.accent;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx, baseY); ctx.lineTo(sx, sy);
          ctx.stroke();
          ctx.fillStyle = C.accent;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const essPct = Math.min(100, ((sumW * sumW) / Math.max(1e-6, M * sumW2)) * 100);
      const varRatio = Math.max(0.03, 1.05 - essPct / 108);

      // Right: Convergence funnel 1/√N
      const rMidY = ly + lh * 0.56;
      ctx.strokeStyle = C.axis;
      ctx.beginPath();
      ctx.moveTo(rx + 12, rMidY); ctx.lineTo(rx + rw - 12, rMidY);
      ctx.stroke();

      const drawFunnel = (scaleEnv, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.8;
        [1, -1].forEach((sgn) => {
          ctx.beginPath();
          for (let i = 1; i <= 50; i++) {
            const px = rx + 12 + (i / 50) * (rw - 24);
            const py = rMidY + sgn * (scaleEnv / Math.sqrt(i)) * (lh * 0.38);
            if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        });
      };
      drawFunnel(0.95, C.danger);
      drawFunnel(0.95 * Math.sqrt(varRatio), C.ok);

      return {
        "Effective Sample ESS": `${essPct.toFixed(1)}%`,
        "Variance Ratio σ²_IS/σ²": `${varRatio.toFixed(3)}×`,
        "Optimal Shift μ*": targetCenter.toFixed(2),
        "Speedup Factor": `${(1 / Math.max(0.04, varRatio)).toFixed(1)}× fewer samples`,
      };
    },

    // 12. Linear Programming Polytope & Simplex Pivots
    math_simplex_linear_prog(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("2D Feasible Polytope Ax ≤ b, Objective Contours cᵀx, Simplex Vertex Path & Barrier Central Path", st.spec.formula);
      const c1 = st.v0 !== undefined ? st.v0 : 1.8;
      const c2 = st.v1 !== undefined ? st.v1 : 1.2;
      const mu = st.v2 || 0.2;

      const lx = 18, ly = 46, lw = W * 0.58, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Convex Polytope {x ≥ 0 : Ax ≤ b} & Simplex Pivots");
      st.panel(rx, ly, rw, lh, "Primal-Dual Duality Gap & Slackness");

      // Vertices of 2D feasible polygon in [0, 10] x [0, 10]
      const verts = [
        { x: 0, y: 0, label: "v₀(0,0)" },
        { x: 0, y: 7.5, label: "v₁(0,7.5)" },
        { x: 3.2, y: 8.2, label: "v₂(3.2,8.2)" },
        { x: 6.8, y: 6.4, label: "v₃(6.8,6.4)" },
        { x: 8.5, y: 2.8, label: "v₄(8.5,2.8)" },
        { x: 7.5, y: 0, label: "v₅(7.5,0)" },
      ];

      const toS = (x, y) => ({
        px: lx + 34 + (x / 10) * (lw - 58),
        py: ly + lh - 26 - (y / 10) * (lh - 58),
      });

      // Shade feasible polytope
      ctx.fillStyle = "rgba(124, 156, 255, 0.16)";
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      verts.forEach((v, i) => {
        const p = toS(v.x, v.y);
        if (i === 0) ctx.moveTo(p.px, p.py); else ctx.lineTo(p.px, p.py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Find optimal extreme vertex
      let bestIdx = 0, bestVal = -1e9;
      verts.forEach((v, i) => {
        const val = c1 * v.x + c2 * v.y;
        if (val > bestVal) { bestVal = val; bestIdx = i; }
      });

      // Objective level-set lines c1*x + c2*y = const
      ctx.strokeStyle = "rgba(255, 209, 102, 0.28)";
      ctx.setLineDash([4, 4]);
      for (let lvl = -10; lvl <= 25; lvl += 4) {
        ctx.beginPath();
        if (Math.abs(c2) > 0.15) {
          const pA = toS(0, lvl / c2), pB = toS(9.5, (lvl - 9.5 * c1) / c2);
          ctx.moveTo(pA.px, pA.py); ctx.lineTo(pB.px, pB.py);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Interior Point Barrier central path from analytic center (3.8, 3.8) to optimal vertex
      const optV = verts[bestIdx];
      const pCenter = toS(3.8, 3.8), pOpt = toS(optV.x, optV.y);
      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pCenter.px, pCenter.py);
      ctx.quadraticCurveTo((pCenter.px + pOpt.px) * 0.5, pCenter.py - 22, pOpt.px, pOpt.py);
      ctx.stroke();

      // Draw vertices & highlight optimal vertex
      verts.forEach((v, i) => {
        const p = toS(v.x, v.y);
        ctx.fillStyle = i === bestIdx ? C.ok : C.text;
        ctx.beginPath();
        ctx.arc(p.px, p.py, i === bestIdx ? 7 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = i === bestIdx ? C.ok : C.muted;
        ctx.font = "10px monospace";
        ctx.fillText(v.label, p.px + 6, p.py - 5);
      });

      // Right: Primal vs Dual bar chart & KKT gap
      const gap = (mu * 2.4).toFixed(3);
      const primalObj = (bestVal - mu * 1.2).toFixed(2);
      const dualObj = (bestVal + mu * 1.2).toFixed(2);

      const barY = ly + 48;
      ctx.fillStyle = C.ok;
      ctx.fillRect(rx + 16, barY, Math.min(rw - 32, Math.max(20, (bestVal + 10) * 4.5)), 22);
      ctx.fillStyle = C.text;
      ctx.fillText(`Primal cᵀx* = ${primalObj}`, rx + 20, barY + 15);

      ctx.fillStyle = C.primary;
      ctx.fillRect(rx + 16, barY + 38, Math.min(rw - 32, Math.max(20, (bestVal + 10 + mu * 2.4) * 4.5)), 22);
      ctx.fillStyle = C.text;
      ctx.fillText(`Dual bᵀy* = ${dualObj}`, rx + 20, barY + 53);

      return {
        "Optimal Vertex x*": `${optV.label}`,
        "Max Objective cᵀx*": bestVal.toFixed(2),
        "Barrier Duality Gap": gap,
        "Active Constraints": "2 tight (Basic Feasible)",
      };
    },

    // 13. Feigenbaum Period-Doubling & Logistic Bifurcation
    math_bifurcation_logistic(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Cobweb map xₙ₊₁ = r xₙ(1−xₙ); Right: Feigenbaum bifurcation tree & attractor", st.spec.formula);
      const r = st.v0 || 3.72;
      const eps = st.v1 || 0.08;
      const forcing = st.v2 || 0.05;

      const lx = 18, ly = 46, lw = W * 0.45, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Logistic Cobweb Diagram (r = ${r.toFixed(3)})`);
      st.panel(rx, ly, rw, lh, "Feigenbaum Bifurcation Cascade (2.8 ≤ r ≤ 4.0)");

      const toCob = (x, y) => ({
        px: lx + 20 + x * (lw - 36),
        py: ly + lh - 20 - y * (lh - 48),
      });

      // Diagonal y = x
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      const d0 = toCob(0, 0), d1 = toCob(1, 1);
      ctx.moveTo(d0.px, d0.py); ctx.lineTo(d1.px, d1.py);
      ctx.stroke();

      // Parabola y = r x (1 - x)
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const v = Math.min(1, r * u * (1 - u));
        const p = toCob(u, v);
        if (i === 0) ctx.moveTo(p.px, p.py); else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();

      // Live Cobweb Staircase
      let x = Math.max(0.05, Math.min(0.95, st.px));
      let lyapSum = 0;
      ctx.strokeStyle = "rgba(255, 209, 102, 0.72)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      const pStart = toCob(x, 0);
      ctx.moveTo(pStart.px, pStart.py);
      for (let k = 0; k < 45; k++) {
        const xn = Math.max(0.001, Math.min(0.999, r * x * (1 - x) + forcing * 0.03 * Math.sin(k + st.t)));
        lyapSum += Math.log(Math.max(1e-5, Math.abs(r * (1 - 2 * x))));
        if (k > 10) {
          const pV = toCob(x, xn), pH = toCob(xn, xn);
          ctx.lineTo(pV.px, pV.py);
          ctx.lineTo(pH.px, pH.py);
        }
        x = xn;
      }
      ctx.stroke();

      // Right: Bifurcation diagram across r in [2.8, 4.0]
      const cols = 120;
      for (let c = 0; c < cols; c++) {
        const rVal = 2.8 + (c / (cols - 1)) * 1.2;
        let xv = 0.5;
        for (let m = 0; m < 32; m++) xv = rVal * xv * (1 - xv);
        ctx.fillStyle = Math.abs(rVal - r) < 0.015 ? C.accent : "rgba(110, 231, 183, 0.45)";
        const px = rx + 14 + (c / (cols - 1)) * (rw - 28);
        for (let m = 0; m < 16; m++) {
          xv = rVal * xv * (1 - xv);
          const py = ly + lh - 18 - xv * (lh - 44);
          ctx.fillRect(px, py, 2, 2);
        }
      }

      // Vertical cursor line at current r
      const rCursorX = rx + 14 + ((r - 2.8) / 1.2) * (rw - 28);
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(rCursorX, ly + 26); ctx.lineTo(rCursorX, ly + lh - 14);
      ctx.stroke();

      const lyap = (lyapSum / 45).toFixed(3);
      const regime = r < 3.0 ? "Period-1 Fixed Point" : (r < 3.449 ? "Period-2 Cycle" : (r < 3.5699 ? "Period-2ᵏ Cascade" : "Chaotic Band (λ > 0)"));
      return {
        "Growth Parameter r": r.toFixed(3),
        "Lyapunov Exponent λ": lyap,
        "Feigenbaum δ": "4.6692016...",
        "Dynamical Regime": regime,
      };
    },

    // 14. Wavelet Time-Frequency Scalogram & Heisenberg Box
    math_wavelet_multires(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Top: Morlet wavelet ψ_{a,b}(t) & chirp signal; Bottom: Dyadic scalogram + Heisenberg Δt·Δω box", st.spec.formula);
      const scaleA = st.v0 || 1.2;
      const chirp = st.v1 || 2.2;
      const octaves = Math.max(2, Math.round(st.v2 || 5));

      const tx = 18, ty = 46, tw = W - 36, th = (H - 68) * 0.40;
      const bx = 18, by = ty + th + 10, bw = W * 0.62, bh = H - by - 14;
      const rx = bx + bw + 12, rw = W - rx - 18;

      st.panel(tx, ty, tw, th, "Chirp Signal f(t) & Dilated Morlet Wavelet ψ((t − b)/a)");
      st.panel(bx, by, bw, bh, `Dyadic Multiresolution Scalogram (${octaves} Octaves)`);
      st.panel(rx, by, rw, bh, "Heisenberg Uncertainty Box Δt × Δω ≥ ½");

      const midY = ty + th * 0.58;
      // Chirp waveform
      ctx.strokeStyle = "rgba(124, 156, 255, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const u = i / 160;
        const y = Math.sin(2 * Math.PI * (2 + chirp * u * 5) * u - st.t * 2);
        const px = tx + 14 + u * (tw - 28);
        const py = midY - y * (th * 0.32);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Morlet wavelet centered at st.px
      const bShift = st.px;
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const u = i / 160;
        const tau = (u - bShift) / (scaleA * 0.14);
        const wv = Math.exp(-0.5 * tau * tau) * Math.cos(5 * tau);
        const px = tx + 14 + u * (tw - 28);
        const py = midY - wv * (th * 0.36);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Bottom left: Dyadic wavelet scalogram bricks
      const rowH = (bh - 30) / octaves;
      for (let j = 0; j < octaves; j++) {
        const cells = Math.pow(2, j + 1);
        const cellW = (bw - 20) / cells;
        for (let k = 0; k < cells; k++) {
          const uCenter = (k + 0.5) / cells;
          const instantFreq = 1 + chirp * uCenter * 1.4;
          const scaleFreq = (octaves - j);
          const coeff = Math.exp(-0.5 * Math.pow(instantFreq - scaleFreq * 0.7, 2));
          ctx.fillStyle = `rgba(${Math.round(60 + coeff * 195)}, ${Math.round(100 + coeff * 120)}, 255, ${0.25 + coeff * 0.7})`;
          ctx.fillRect(bx + 10 + k * cellW, by + 24 + j * rowH, cellW - 2, rowH - 2);
        }
      }

      // Bottom right: Heisenberg Gabor uncertainty rectangle Δt × Δω = constant area
      const hcx = rx + rw * 0.5, hcy = by + bh * 0.56;
      const boxW = Math.min(rw - 24, 24 * scaleA);
      const boxH = Math.min(bh - 36, (24 * 28) / boxW);
      ctx.fillStyle = "rgba(110, 231, 183, 0.22)";
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2;
      ctx.fillRect(hcx - boxW * 0.5, hcy - boxH * 0.5, boxW, boxH);
      ctx.strokeRect(hcx - boxW * 0.5, hcy - boxH * 0.5, boxW, boxH);
      ctx.fillStyle = C.text;
      ctx.font = "10px monospace";
      ctx.fillText(`Δt=${(0.35 * scaleA).toFixed(2)}`, hcx - 24, hcy + boxH * 0.5 + 12);
      ctx.fillText(`Δω=${(1.43 / scaleA).toFixed(2)}`, hcx - 24, hcy - boxH * 0.5 - 5);

      return {
        "Dilation Scale a": scaleA.toFixed(2),
        "Temporal Width Δt": `${(0.35 * scaleA).toFixed(3)} s`,
        "Spectral Width Δω": `${(1.43 / scaleA).toFixed(2)} rad/s`,
        "Gabor Product Δt·Δω": "0.500 (Minimum Bound)",
      };
    },

    // 15. Topological Data Analysis & Vietoris-Rips Filtrations
    math_persistent_homology(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Vietoris-Rips ε-balls & simplices on noisy circle; Right: H₀ / H₁ Persistence Barcode", st.spec.formula);
      const eps = st.v0 || 0.75;
      const jitter = st.v1 || 0.14;
      const tau = st.v2 || 0.35;

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Vietoris-Rips Complex VR(X, ε = ${eps.toFixed(2)})`);
      st.panel(rx, ly, rw, lh, "Persistence Barcode Diagram (H₀ & H₁)");

      const N = 14;
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.30;
      const pts = [];
      for (let i = 0; i < N; i++) {
        const ang = (i / N) * Math.PI * 2;
        const rOff = R * (1 + jitter * 0.65 * Math.sin(i * 3.7 + 1.2));
        pts.push({
          x: cx + rOff * Math.cos(ang),
          y: cy + rOff * Math.sin(ang),
        });
      }

      const epsPx = (eps / 2.2) * R * 1.45;
      // Draw ε/2 balls around points
      pts.forEach((p) => {
        ctx.fillStyle = "rgba(124, 156, 255, 0.10)";
        ctx.strokeStyle = "rgba(124, 156, 255, 0.25)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, epsPx * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // 2-simplices (triangles) and 1-simplices (edges)
      let edges = 0, tris = 0;
      const adj = Array.from({ length: N }, () => []);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) <= epsPx) {
            adj[i].push(j); adj[j].push(i);
            edges++;
            for (let k = j + 1; k < N; k++) {
              if (
                Math.hypot(pts[i].x - pts[k].x, pts[i].y - pts[k].y) <= epsPx &&
                Math.hypot(pts[j].x - pts[k].x, pts[j].y - pts[k].y) <= epsPx
              ) {
                tris++;
                ctx.fillStyle = "rgba(255, 143, 171, 0.16)";
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.lineTo(pts[k].x, pts[k].y);
                ctx.closePath();
                ctx.fill();
              }
            }
            ctx.strokeStyle = C.primary;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        ctx.fillStyle = C.accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connected components β₀ via DFS
      const vis = new Array(N).fill(false);
      let b0 = 0;
      for (let i = 0; i < N; i++) {
        if (!vis[i]) {
          b0++;
          const q = [i]; vis[i] = true;
          while (q.length) {
            const u = q.pop();
            adj[u].forEach((v) => { if (!vis[v]) { vis[v] = true; q.push(v); } });
          }
        }
      }
      const b1 = (eps > 0.45 && eps < 1.55) ? 1 : 0;

      // Right: Persistence Barcode H₀ and H₁
      const toBarX = (eVal) => rx + 16 + (eVal / 2.2) * (rw - 32);
      for (let i = 0; i < 9; i++) {
        const death = i === 0 ? 2.15 : Math.min(2.1, 0.25 + i * 0.08 + jitter * 0.3);
        const yBar = ly + 36 + i * 14;
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(toBarX(0), yBar);
        ctx.lineTo(toBarX(death), yBar);
        ctx.stroke();
      }
      // Dominant H₁ loop bar
      const yH1 = ly + 36 + 10 * 14;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(toBarX(0.45), yH1);
      ctx.lineTo(toBarX(1.55), yH1);
      ctx.stroke();
      ctx.fillStyle = C.ok;
      ctx.font = "600 10px monospace";
      ctx.fillText("H₁ Persistent Loop", toBarX(0.45), yH1 - 8);

      // Vertical ε filtration line
      const curBarX = toBarX(eps);
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(curBarX, ly + 26); ctx.lineTo(curBarX, ly + lh - 12);
      ctx.stroke();

      return {
        "Betti β₀ (Components)": String(b0),
        "Betti β₁ (1-Cycles)": String(b1),
        "Simplices (E, F)": `${edges} edges, ${tris} tris`,
        "Euler χ = V−E+F": String(N - edges + tris),
      };
    },

    // 16. Itô Stochastic Calculus & Ornstein-Uhlenbeck SDE
    math_ito_stochastic_sde(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Ensemble of Ornstein-Uhlenbeck SDE sample paths & ±2σ envelope; Right: Stationary density", st.spec.formula);
      const theta = st.v0 || 1.8;
      const sigma = st.v1 || 0.75;
      const mu = st.v2 !== undefined ? st.v2 : 0.5;

      const lx = 18, ly = 46, lw = W * 0.64, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Ornstein-Uhlenbeck SDE Paths dXₜ = θ(μ − Xₜ)dt + σdWₜ");
      st.panel(rx, ly, rw, lh, "Stationary Density N(μ, σ²/2θ)");

      const statStd = sigma / Math.sqrt(2 * Math.max(0.1, theta));
      const toY = (val) => ly + lh * 0.54 - ((val - mu) / 2.6) * (lh * 0.36);

      // Draw ±2σ envelope
      ctx.fillStyle = "rgba(124, 156, 255, 0.13)";
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const t = (i / 80) * 3.0;
        const stdT = statStd * Math.sqrt(1 - Math.exp(-2 * theta * t));
        const px = lx + 14 + (i / 80) * (lw - 28);
        if (i === 0) ctx.moveTo(px, toY(mu + 2 * stdT)); else ctx.lineTo(px, toY(mu + 2 * stdT));
      }
      for (let i = 80; i >= 0; i--) {
        const t = (i / 80) * 3.0;
        const stdT = statStd * Math.sqrt(1 - Math.exp(-2 * theta * t));
        const px = lx + 14 + (i / 80) * (lw - 28);
        ctx.lineTo(px, toY(mu - 2 * stdT));
      }
      ctx.closePath();
      ctx.fill();

      // Long-run mean line μ
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(lx + 14, toY(mu)); ctx.lineTo(lx + lw - 14, toY(mu));
      ctx.stroke();
      ctx.setLineDash([]);

      // 6 Stochastic sample paths
      const K = 80, dt = 3.0 / K;
      for (let p = 0; p < 6; p++) {
        let xv = -1.2 + (st.py - 0.5) * 2.0;
        ctx.strokeStyle = C.series[p % C.series.length];
        ctx.lineWidth = p === 0 ? 2.2 : 1.2;
        ctx.beginPath();
        for (let k = 0; k <= K; k++) {
          const px = lx + 14 + (k / K) * (lw - 28);
          const py = toY(xv);
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          const dW = Math.sin(k * 12.9898 + p * 78.233 + Math.floor(st.t * 4) * 0.3) * Math.sqrt(dt);
          xv += theta * (mu - xv) * dt + sigma * dW;
        }
        ctx.stroke();
      }

      // Right: Vertical Gaussian density bell curve
      ctx.strokeStyle = C.ok;
      ctx.fillStyle = "rgba(110, 231, 183, 0.22)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx + 14, ly + 28);
      for (let j = 0; j <= 60; j++) {
        const yVal = mu + ((j / 60) - 0.5) * 4.5;
        const dens = Math.exp(-0.5 * Math.pow((yVal - mu) / Math.max(0.15, statStd), 2));
        ctx.lineTo(rx + 14 + dens * (rw - 28), toY(yVal));
      }
      ctx.lineTo(rx + 14, ly + lh - 14);
      ctx.fill();
      ctx.stroke();

      const itoDrift = (0.5 * sigma * sigma).toFixed(3);
      return {
        "Stationary Var σ²/(2θ)": (statStd * statStd).toFixed(3),
        "Itô Correction ½σ²f''": `+${itoDrift} dt`,
        "Relaxation τ = 1/θ": `${(1 / theta).toFixed(2)} s`,
        "Equilibrium Mean μ": mu.toFixed(2),
      };
    },

    // 17. p-Adic Valuation & Ultrametric Bruhat-Tits Tree
    math_p_adic_ultrametric(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Bruhat-Tits p-adic branching tree Z_p; Right: Nested non-Archimedean ultrametric balls", st.spec.formula);
      const pRaw = Math.round(st.v0 || 3);
      const p = [2, 3, 5, 7].reduce((a, b) => Math.abs(b - pRaw) < Math.abs(a - pRaw) ? b : a);
      const depth = Math.min(4, Math.max(2, Math.round(st.v1 || 3)));
      const res = Math.round(st.v2 || 2);

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Bruhat-Tits ${p}-Adic Tree Z_${p} (Depth k=${depth})`);
      st.panel(rx, ly, rw, lh, "Ultrametric Balls B(a, p⁻ᵏ) & Isosceles Law");

      // Recursive tree drawing
      const drawTree = (x, y, spanW, lvl) => {
        if (lvl >= depth) return;
        const nextY = y + (lh - 54) / depth;
        for (let r = 0; r < p; r++) {
          const nx = x - spanW * 0.5 + ((r + 0.5) / p) * spanW;
          const active = (r === (res + lvl) % p);
          ctx.strokeStyle = active ? C.accent : "rgba(124, 156, 255, 0.38)";
          ctx.lineWidth = active ? 2.4 : 1.2;
          ctx.beginPath();
          ctx.moveTo(x, y); ctx.lineTo(nx, nextY);
          ctx.stroke();

          ctx.fillStyle = active ? C.ok : C.primary;
          ctx.beginPath();
          ctx.arc(nx, nextY, Math.max(2.5, 6 - lvl), 0, Math.PI * 2);
          ctx.fill();

          drawTree(nx, nextY, spanW / p, lvl + 1);
        }
      };
      const rootX = lx + lw * 0.5, rootY = ly + 32;
      ctx.fillStyle = C.danger;
      ctx.beginPath();
      ctx.arc(rootX, rootY, 6, 0, Math.PI * 2);
      ctx.fill();
      drawTree(rootX, rootY, lw - 28, 0);

      // Right: Fractal nested ultrametric disks (every interior point is a center)
      const dcx = rx + rw * 0.5, dcy = ly + lh * 0.54, outerR = Math.min(rw, lh) * 0.36;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(dcx, dcy, outerR, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < p; i++) {
        const ang = (i * 2 * Math.PI) / p + st.t * 0.25;
        const subX = dcx + outerR * 0.52 * Math.cos(ang);
        const subY = dcy + outerR * 0.52 * Math.sin(ang);
        const subR = outerR * 0.34;
        ctx.fillStyle = "rgba(124, 156, 255, 0.14)";
        ctx.strokeStyle = C.series[i % C.series.length];
        ctx.beginPath();
        ctx.arc(subX, subY, subR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        for (let j = 0; j < p; j++) {
          const a2 = (j * 2 * Math.PI) / p - st.t * 0.4;
          ctx.fillStyle = C.accent;
          ctx.beginPath();
          ctx.arc(subX + subR * 0.5 * Math.cos(a2), subY + subR * 0.5 * Math.sin(a2), subR * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const normVal = Math.pow(p, -depth);
      return {
        "Prime Base p": `p = ${p} (Q_${p})`,
        "p-Adic Norm |x|_p": `p^(−${depth}) = ${normVal.toFixed(4)}`,
        "Residue Balls": `${Math.pow(p, depth)} clopen balls`,
        "Triangle Geometry": "All Triangles Isosceles",
      };
    },

    // 18. Wasserstein Optimal Transport & Sinkhorn Entropic Plan
    math_optimal_transport(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Source μ → Target ν McCann displacement interpolation; Right: Sinkhorn coupling π(x,y)", st.spec.formula);
      const eps = st.v0 || 0.12;
      const shift = st.v1 || 1.8;
      const rate = st.v2 || 1.2;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Wasserstein-2 Geodesic Displacement μₜ = ((1−t)id + tT)#μ");
      st.panel(rx, ly, rw, lh, "Sinkhorn Coupling Matrix π*(xᵢ, yⱼ)");

      const tInterp = 0.5 + 0.5 * Math.sin(st.t * rate);
      const baseY = ly + lh - 26;
      const drawDist = (center, spread, col, fillAlpha) => {
        ctx.strokeStyle = col;
        ctx.fillStyle = fillAlpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx + 14, baseY);
        for (let i = 0; i <= 80; i++) {
          const u = (i / 80) * 6 - 3;
          const y = Math.exp(-0.5 * Math.pow((u - center) / spread, 2)) + 0.45 * Math.exp(-0.5 * Math.pow((u - center - 0.9) / (spread * 0.7), 2));
          const px = lx + 14 + (i / 80) * (lw - 28);
          const py = baseY - y * (lh * 0.46);
          ctx.lineTo(px, py);
        }
        ctx.lineTo(lx + lw - 14, baseY);
        ctx.fill();
        ctx.stroke();
      };

      const muC = -shift * 0.45, nuC = shift * 0.45;
      drawDist(muC, 0.55, C.primary, "rgba(124, 156, 255, 0.15)");
      drawDist(nuC, 0.65, C.secondary, "rgba(255, 143, 171, 0.15)");
      drawDist(muC * (1 - tInterp) + nuC * tInterp, 0.55 * (1 - tInterp) + 0.65 * tInterp, C.ok, "rgba(110, 231, 183, 0.26)");

      // Right: 10x10 Sinkhorn coupling matrix heatmap
      const M = 10;
      const cw = (rw - 24) / M, ch = (lh - 38) / M;
      let entropy = 0;
      for (let r = 0; r < M; r++) {
        for (let c = 0; c < M; c++) {
          const dist2 = Math.pow((r - c) / M, 2);
          const pij = Math.exp(-dist2 / Math.max(0.03, eps * 0.45));
          entropy -= pij * Math.log(Math.max(1e-6, pij));
          ctx.fillStyle = `rgba(110, 231, 183, ${Math.min(0.95, pij * 0.9)})`;
          ctx.fillRect(rx + 12 + c * cw, ly + 26 + r * ch, cw - 2, ch - 2);
        }
      }

      const w2 = (shift * shift * 0.42 + eps * 0.35).toFixed(3);
      return {
        "Wasserstein Cost W₂²": w2,
        "Entropic Blur ε": eps.toFixed(2),
        "Plan Sparsity": eps < 0.12 ? "Near-Monge Map" : "Diffused Coupling",
        "Interpolation t": tInterp.toFixed(2),
      };
    },

    // 19. Graph Laplacian Eigenmodes & Cheeger Conductance
    math_spectral_laplacian(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Dumbbell graph colored by Fiedler vector v₂ & spectral cut; Right: v₂(i) embedding", st.spec.formula);
      const wBridge = st.v0 || 0.25;
      const density = st.v1 || 0.7;
      const heatT = st.v2 || 1.0;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Weighted Graph G=(V,E) & Minimum Cheeger Cut ∂S");
      st.panel(rx, ly, rw, lh, "Fiedler Vector Embedding v₂(i) & Spectrum");

      const nodes = [];
      const cy = ly + lh * 0.54, rClust = Math.min(lw * 0.17, lh * 0.28);
      for (let c = 0; c < 2; c++) {
        const ccx = lx + lw * (c === 0 ? 0.27 : 0.73);
        for (let k = 0; k < 5; k++) {
          const ang = (k * 2 * Math.PI) / 5 + (c === 1 ? Math.PI : 0);
          const v2Val = (c === 0 ? -1 : 1) * (0.65 + 0.25 * Math.cos(ang)) * Math.exp(-heatT * wBridge * 0.15);
          nodes.push({
            x: ccx + rClust * Math.cos(ang),
            y: cy + rClust * Math.sin(ang),
            cluster: c,
            v2: v2Val,
          });
        }
      }

      // Intra-cluster edges
      ctx.strokeStyle = `rgba(124, 156, 255, ${0.25 + density * 0.45})`;
      ctx.lineWidth = 1.6;
      for (let c = 0; c < 2; c++) {
        const base = c * 5;
        for (let i = 0; i < 5; i++) {
          for (let j = i + 1; j < 5; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[base + i].x, nodes[base + i].y);
            ctx.lineTo(nodes[base + j].x, nodes[base + j].y);
            ctx.stroke();
          }
        }
      }

      // Bottleneck bridge edge between node 0 and node 5
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 1 + wBridge * 2.5;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[5].x, nodes[5].y);
      ctx.stroke();

      // Cheeger cut vertical divider
      const cutX = lx + lw * 0.5;
      ctx.strokeStyle = C.danger;
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cutX, ly + 28); ctx.lineTo(cutX, ly + lh - 14);
      ctx.stroke();
      ctx.setLineDash([]);

      nodes.forEach((nd, i) => {
        ctx.fillStyle = nd.v2 < 0 ? C.primary : C.secondary;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f1222";
        ctx.font = "700 9px monospace";
        ctx.fillText(String(i + 1), nd.x - 4, nd.y + 3);
      });

      // Right: 1D Fiedler coordinate bar chart v₂(i)
      const midRx = rx + rw * 0.5;
      ctx.strokeStyle = C.axis;
      ctx.beginPath();
      ctx.moveTo(midRx, ly + 28); ctx.lineTo(midRx, ly + lh - 14);
      ctx.stroke();

      nodes.forEach((nd, i) => {
        const yRow = ly + 32 + i * ((lh - 44) / 10);
        const bw = nd.v2 * (rw * 0.38);
        ctx.fillStyle = nd.v2 < 0 ? C.primary : C.secondary;
        ctx.fillRect(bw < 0 ? midRx + bw : midRx, yRow, Math.abs(bw), 11);
      });

      const lam2 = (0.18 * wBridge / Math.max(0.2, density)).toFixed(3);
      const cheeger = (wBridge / (5 * density * 2)).toFixed(3);
      return {
        "Fiedler Value λ₂": lam2,
        "Cheeger Ratio h(G)": cheeger,
        "Cut Conductance": wBridge < 0.35 ? "Sharp Bottleneck" : "Strong Coupling",
        "Spectral Cut": "{1..5} | {6..10}",
      };
    },

    // 20. Calculus of Variations & Euler-Lagrange Cycloid
    math_variational_brachistochrone(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Racing beads down Linear, Parabolic, and Optimal Brachistochrone Cycloid curves under gravity", st.spec.formula);
      const alpha = st.v0 || 1.0;
      const dropRatio = st.v1 || 0.65;
      const mu = st.v2 || 0.02;

      const lx = 18, ly = 46, lw = W * 0.62, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Brachistochrone Descent Race (A → B under Gravity)");
      st.panel(rx, ly, rw, lh, "Travel Time Functional J[y] (sec)");

      const xA = lx + 28, yA = ly + 36;
      const xB = lx + lw - 28, yB = yA + (lh - 64) * Math.min(0.95, dropRatio * 0.72);

      const curves = [
        { name: "Straight Line", col: C.danger, bulge: 0.0, tEst: 1.42 + mu * 0.8 },
        { name: "Parabola", col: C.primary, bulge: 0.24, tEst: 1.24 + mu * 0.7 },
        { name: "Optimal Cycloid", col: C.ok, bulge: 0.42 * alpha, tEst: 1.11 + mu * 0.6 + Math.abs(alpha - 1) * 0.14 },
      ];

      const raceTime = (st.t * 0.85) % 1.65;

      curves.forEach((crv) => {
        ctx.strokeStyle = crv.col;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const u = i / 60;
          const px = xA + u * (xB - xA);
          const py = yA + u * (yB - yA) + crv.bulge * Math.sin(u * Math.PI) * (yB - yA);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Bead position along curve
        const prog = Math.min(1, Math.pow(raceTime / crv.tEst, 1.35));
        const bx = xA + prog * (xB - xA);
        const by = yA + prog * (yB - yA) + crv.bulge * Math.sin(prog * Math.PI) * (yB - yA);
        ctx.fillStyle = crv.col;
        ctx.beginPath();
        ctx.arc(bx, by, 6.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Right: Bar chart comparing descent times J[y]
      curves.forEach((crv, idx) => {
        const by = ly + 42 + idx * 48;
        ctx.fillStyle = C.muted;
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText(`${crv.name}: ${crv.tEst.toFixed(3)} s`, rx + 12, by);
        ctx.fillStyle = crv.col;
        ctx.fillRect(rx + 12, by + 6, (crv.tEst / 1.7) * (rw - 24), 16);
      });

      return {
        "Cycloid Time T*": `${curves[2].tEst.toFixed(3)} s`,
        "Straight Line T_lin": `${curves[0].tEst.toFixed(3)} s`,
        "Time Saved ΔT": `${((1 - curves[2].tEst / curves[0].tEst) * 100).toFixed(1)}% faster`,
        "Euler-Lagrange": "y (1 + (y')²) = 2R",
      };
    },

    // =========================================================================
    // 2. PHYSICS (20 Bespoke Renderers)
    // =========================================================================

    // 21. Schwarzschild Geodesics & Black Hole Gravitational Lensing
    phys_black_hole_lensing(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Null geodesic ray bundle around event horizon r_s & photon sphere 1.5 r_s; Right: V_eff(r)", st.spec.formula);
      const bRatio = st.v0 || 2.8;
      const rs = st.v1 || 1.2;
      const spinA = st.v2 || 0.3;

      const lx = 18, ly = 46, lw = W * 0.58, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Schwarzschild / Kerr Null Geodesic Ray Tracing");
      st.panel(rx, ly, rw, lh, "Effective Potential V_eff(r) = (1 − r_s/r)/r²");

      const cx = lx + lw * 0.52, cy = ly + lh * 0.54;
      const rScale = Math.min(lw, lh) * 0.08 * rs;
      const bCrit = 2.598; // 3√3 / 2

      // Accretion disk glow & ergosphere
      ctx.fillStyle = "rgba(253, 186, 116, 0.12)";
      ctx.beginPath();
      ctx.arc(cx, cy, rScale * 3.0, 0, Math.PI * 2);
      ctx.fill();

      // ISCO at 3 r_s
      ctx.strokeStyle = "rgba(110, 231, 183, 0.45)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, rScale * 3.0, 0, Math.PI * 2);
      ctx.stroke();

      // Photon sphere at 1.5 r_s
      ctx.strokeStyle = C.accent;
      ctx.beginPath();
      ctx.arc(cx, cy, rScale * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Event Horizon r_s
      ctx.fillStyle = "#05060c";
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, rScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Geodesic ray fan including main impact parameter bRatio
      const rays = [-3.6, -2.9, -2.2, 1.8, 2.5, 3.3, bRatio];
      rays.forEach((b, idx) => {
        const isMain = idx === rays.length - 1;
        const absB = Math.abs(b);
        const sgn = b >= 0 ? -1 : 1;
        ctx.strokeStyle = isMain ? C.accent : (absB < bCrit ? "rgba(255,107,107,0.55)" : "rgba(124,156,255,0.55)");
        ctx.lineWidth = isMain ? 2.5 : 1.3;
        ctx.beginPath();
        let x = lx + 12, y = cy + sgn * absB * rScale;
        let vx = 1.0, vy = 0.0;
        ctx.moveTo(x, y);
        for (let step = 0; step < 120; step++) {
          const dx = x - cx, dy = y - cy;
          const rPx = Math.hypot(dx, dy);
          if (rPx <= rScale * 0.98 || x > lx + lw - 10 || y < ly + 22 || y > ly + lh - 10) break;
          const rNorm = rPx / rScale;
          const force = (1.5 / Math.pow(rNorm, 3.1)) * (1 - spinA * 0.15 * sgn);
          vx -= (dx / rPx) * force * 0.18;
          vy -= (dy / rPx) * force * 0.18;
          const vMag = Math.hypot(vx, vy);
          vx /= vMag; vy /= vMag;
          x += vx * 4.2; y += vy * 4.2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Right: Effective potential V_eff(r) with unstable peak at r = 1.5 r_s
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const rRatio = 1.0 + (i / 70) * 5.0;
        const vEff = (1 - 1 / rRatio) / (rRatio * rRatio); // peaks at r=1.5 with value 4/27 ≈ 0.1481
        const px = rx + 14 + (i / 70) * (rw - 28);
        const py = ly + lh - 24 - (vEff / 0.18) * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Energy level 1/b² line
      const eLvl = 1 / (bRatio * bRatio);
      const eY = ly + lh - 24 - Math.min(1.05, eLvl / 0.18) * (lh - 56);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(rx + 14, eY); ctx.lineTo(rx + rw - 14, eY);
      ctx.stroke();
      ctx.setLineDash([]);

      const defl = bRatio > bCrit ? `${((2 / bRatio) * 57.3 * (1 + 1.2 / (bRatio - 2.2))).toFixed(1)}°` : "Captured (r < r_s)";
      return {
        "Impact Param b / r_s": bRatio.toFixed(2),
        "Critical b_crit": "2.598 r_s (3√3/2)",
        "Deflection Angle Δφ": defl,
        "Photon Sphere": `${(1.5 * rs).toFixed(2)} r_s`,
      };
    },

    // 22. Lagrangian Double Pendulum & Poincaré Section
    phys_double_pendulum_chaos(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Planar double pendulum & chaotic bob trail; Right: Poincaré section (θ₂, ω₂)", st.spec.formula);
      const E = st.v0 || 1.6;
      const mRatio = st.v1 || 1.0;
      const lRatio = st.v2 || 1.0;

      if (!st.mem.dp || st.mem.lastClick !== st.clicks.length) {
        st.mem.lastClick = st.clicks.length;
        st.mem.dp = { th1: 0.8 + E * 0.45, th2: 1.1 + E * 0.55, w1: 0, w2: 0 };
        st.mem.trail = [];
        st.mem.poincare = [];
      }

      const s = st.mem.dp;
      const g = 9.8, dt = 0.016;
      const dth = s.th1 - s.th2;
      const den = 1 + mRatio * Math.sin(dth) * Math.sin(dth);
      const a1 = (-g * (1 + mRatio) * Math.sin(s.th1) - mRatio * g * Math.sin(s.th1 - 2 * s.th2) - 2 * Math.sin(dth) * mRatio * (s.w2 * s.w2 * lRatio + s.w1 * s.w1 * Math.cos(dth))) / (2 * den);
      const a2 = (2 * Math.sin(dth) * (s.w1 * s.w1 * (1 + mRatio) + g * (1 + mRatio) * Math.cos(s.th1) + s.w2 * s.w2 * lRatio * mRatio * Math.cos(dth))) / (2 * lRatio * den);
      const prevTh1 = s.th1;
      s.w1 = Math.max(-9, Math.min(9, s.w1 + a1 * dt));
      s.w2 = Math.max(-11, Math.min(11, s.w2 + a2 * dt));
      s.th1 += s.w1 * dt;
      s.th2 += s.w2 * dt;

      if (Math.sin(prevTh1) * Math.sin(s.th1) <= 0 && s.w1 > 0) {
        st.mem.poincare.push({ th2: ((s.th2 + Math.PI) % (2 * Math.PI)) - Math.PI, w2: s.w2 });
        if (st.mem.poincare.length > 90) st.mem.poincare.shift();
      }

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Coupled Double Pendulum (L₁, L₂, m₁, m₂)");
      st.panel(rx, ly, rw, lh, "Poincaré Surface of Section (θ₁ = 0, θ̇₁ > 0)");

      const px0 = lx + lw * 0.5, py0 = ly + lh * 0.42;
      const L1 = Math.min(lw, lh) * 0.22;
      const L2 = L1 * Math.min(1.25, 0.55 + lRatio * 0.45);
      const x1 = px0 + L1 * Math.sin(s.th1), y1 = py0 + L1 * Math.cos(s.th1);
      const x2 = x1 + L2 * Math.sin(s.th2), y2 = y1 + L2 * Math.cos(s.th2);

      st.mem.trail.push({ x: x2, y: y2 });
      if (st.mem.trail.length > 140) st.mem.trail.shift();

      // Bob 2 ribbon trail
      ctx.strokeStyle = "rgba(110, 231, 183, 0.55)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      st.mem.trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Arms and bobs
      ctx.strokeStyle = C.text;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(px0, py0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.fillStyle = C.primary;
      ctx.beginPath(); ctx.arc(x1, y1, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(x2, y2, 6 + mRatio * 2, 0, Math.PI * 2); ctx.fill();

      // Right: Poincaré section + KAM torus curves
      const pcx = rx + rw * 0.5, pcy = ly + lh * 0.54;
      ctx.strokeStyle = "rgba(124, 156, 255, 0.22)";
      ctx.beginPath();
      ctx.ellipse(pcx, pcy, rw * 0.32, lh * 0.26, 0, 0, Math.PI * 2);
      ctx.stroke();

      st.mem.poincare.forEach((pt) => {
        ctx.fillStyle = E > 1.4 ? C.secondary : C.ok;
        ctx.beginPath();
        ctx.arc(pcx + (pt.th2 / Math.PI) * (rw * 0.42), pcy - (pt.w2 / 11) * (lh * 0.38), 3, 0, Math.PI * 2);
        ctx.fill();
      });

      return {
        "Angles (θ₁, θ₂)": `${(s.th1 % 6.28).toFixed(2)}, ${(s.th2 % 6.28).toFixed(2)} rad`,
        "Mass Ratio m₂/m₁": mRatio.toFixed(2),
        "Length Ratio L₂/L₁": lRatio.toFixed(2),
        "Phase Topology": E < 1.2 ? "Quasi-Periodic KAM Torus" : "Hamiltonian Chaos",
      };
    },

    // 23. 2D Ising Model & Onsager Phase Transition
    phys_ising_ferromagnet(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: 2D Spin Lattice sᵢ ∈ {±1} under Metropolis-Hastings; Right: Onsager M(T) & Tc ≈ 2.269", st.spec.formula);
      const tRatio = st.v0 || 0.95; // T / Tc
      const B = st.v1 !== undefined ? st.v1 : 0.0;
      const J = st.v2 || 1.0;

      const N = 22;
      if (!st.mem.spins) {
        st.mem.spins = new Int8Array(N * N);
        for (let i = 0; i < N * N; i++) st.mem.spins[i] = st.rng() < 0.65 ? 1 : -1;
      }

      const T = Math.max(0.15, tRatio * 2.269 * J);
      const spins = st.mem.spins;
      for (let step = 0; step < 65; step++) {
        const idx = Math.floor(st.rng() * N * N);
        const r = Math.floor(idx / N), c = idx % N;
        const s = spins[idx];
        const nb =
          spins[r * N + ((c + 1) % N)] +
          spins[r * N + ((c - 1 + N) % N)] +
          spins[((r + 1) % N) * N + c] +
          spins[((r - 1 + N) % N) * N + c];
        const dE = 2 * s * (J * nb + B);
        if (dE <= 0 || st.rng() < Math.exp(-dE / T)) spins[idx] = -s;
      }

      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `2D Ising Spin Lattice (T / T_c = ${tRatio.toFixed(2)})`);
      st.panel(rx, ly, rw, lh, "Onsager Spontaneous Magnetization |M(T)|");

      const cw = (lw - 20) / N, ch = (lh - 34) / N;
      let sumS = 0;
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const s = spins[r * N + c];
          sumS += s;
          ctx.fillStyle = s > 0 ? C.primary : "rgba(255, 107, 107, 0.72)";
          ctx.fillRect(lx + 10 + c * cw, ly + 24 + r * ch, cw - 1.2, ch - 1.2);
        }
      }
      const mag = sumS / (N * N);

      // Right: Exact Onsager curve M(T) = (1 - sinh⁻⁴(2J/kT))^(1/8)
      const baseY = ly + lh - 26;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const tr = 0.2 + (i / 80) * 1.8;
        let mOns = 0;
        if (tr < 1.0) {
          const sh = Math.sinh(Math.log(1 + Math.SQRT2) / tr);
          mOns = Math.pow(Math.max(0, 1 - 1 / Math.pow(sh, 4)), 0.125);
        }
        const px = rx + 16 + ((tr - 0.2) / 1.8) * (rw - 32);
        const py = baseY - mOns * (lh - 58);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Critical vertical line T/Tc = 1
      const tcX = rx + 16 + ((1.0 - 0.2) / 1.8) * (rw - 32);
      ctx.strokeStyle = C.danger;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(tcX, ly + 26); ctx.lineTo(tcX, baseY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Live lattice magnetization point
      const curX = rx + 16 + ((Math.min(2.0, tRatio) - 0.2) / 1.8) * (rw - 32);
      const curY = baseY - Math.abs(mag) * (lh - 58);
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(curX, curY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      return {
        "Order Parameter ⟨M⟩": mag.toFixed(3),
        "Temp Ratio T / T_c": tRatio.toFixed(2),
        "Onsager T_c": `${(2.269 * J).toFixed(3)} J/k_B`,
        "Magnetic Phase": tRatio < 1.0 ? "Ferromagnetic Ordered" : "Paramagnetic Disordered",
      };
    },

    // 24. Maxwell Equations 2D FDTD & Evanescent Skin Depth
    phys_maxwell_fdtd_cavity(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Incident EM wave (E_z, H_y) hitting lossy dielectric slab (ε_r, σ) with skin depth δ", st.spec.formula);
      const omega = st.v0 || 2.2;
      const epsR = st.v1 || 4.0;
      const sigma = st.v2 || 0.25;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, "1D/2D Yee-Cell EM Wave Propagation Across Lossy Dielectric Slab");

      const ifaceX = lx + lw * 0.46;
      // Shade dielectric medium on right
      ctx.fillStyle = "rgba(124, 156, 255, 0.12)";
      ctx.fillRect(ifaceX, ly + 24, lx + lw - ifaceX - 8, lh - 34);
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ifaceX, ly + 24); ctx.lineTo(ifaceX, ly + lh - 10);
      ctx.stroke();

      const nIdx = Math.sqrt(epsR);
      const rFresnel = (1 - nIdx) / (1 + nIdx);
      const tFresnel = 2 / (1 + nIdx);
      const skinDelta = 1 / Math.max(0.08, sigma * omega * 0.9);

      const midY = ly + lh * 0.54;
      const ampScale = lh * 0.30;

      // Skin depth envelope ±exp(-x/δ) in medium 2
      ctx.strokeStyle = "rgba(255, 107, 107, 0.55)";
      ctx.setLineDash([4, 4]);
      [1, -1].forEach((sgn) => {
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const u = i / 80;
          const env = tFresnel * Math.exp(-u * 2.5 / skinDelta);
          const px = ifaceX + u * (lx + lw - ifaceX - 14);
          const py = midY - sgn * env * ampScale;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Electric field E_y(x, t) (solid primary) and Magnetic field H_z(x, t) (secondary)
      const drawEM = (isH, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = isH ? 1.5 : 2.3;
        ctx.beginPath();
        for (let i = 0; i <= 180; i++) {
          const px = lx + 14 + (i / 180) * (lw - 28);
          let val = 0;
          if (px < ifaceX) {
            const x = (px - ifaceX) / 38;
            const inc = Math.cos(omega * x - omega * st.t * 1.8);
            const ref = rFresnel * Math.cos(-omega * x - omega * st.t * 1.8) * (isH ? -1 : 1);
            val = inc + ref;
          } else {
            const x = (px - ifaceX) / 38;
            val = tFresnel * Math.exp(-x * 0.45 / skinDelta) * Math.cos(nIdx * omega * x - omega * st.t * 1.8) * (isH ? nIdx * 0.55 : 1);
          }
          const py = midY - val * ampScale * 0.65;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      drawEM(true, C.secondary);
      drawEM(false, C.ok);

      ctx.fillStyle = C.text;
      ctx.font = "600 11px monospace";
      ctx.fillText("Vacuum (ε₀, μ₀)", lx + 24, ly + 42);
      ctx.fillText(`Lossy Dielectric (ε_r=${epsR.toFixed(1)}, tan δ=${sigma.toFixed(2)})`, ifaceX + 14, ly + 42);

      return {
        "Refractive Index n": nIdx.toFixed(2),
        "Reflectance R = |r|²": `${(rFresnel * rFresnel * 100).toFixed(1)}%`,
        "Skin Depth δ": `${(skinDelta * 12).toFixed(1)} mm`,
        "Wave Impedance Z": `${(377 / nIdx).toFixed(1)} Ω`,
      };
    },

    // 25. Quantum Barrier Tunneling & WKB Transmission
    phys_quantum_tunneling_wkb(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Schrödinger wavepacket Re[ψ], |ψ|² scattering through rectangular barrier V₀ with WKB decay", st.spec.formula);
      const eRatio = st.v0 || 0.68; // E / V0
      const widthA = st.v1 || 1.2;
      const massM = st.v2 || 1.0;

      const lx = 18, ly = 46, lw = W * 0.64, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Quantum Potential Barrier V(x) & Wavefunction ψ(x, t)");
      st.panel(rx, ly, rw, lh, "Transmission Coefficient T(E / V₀)");

      const baseY = ly + lh - 28;
      const v0H = lh * 0.58;
      const barW = Math.max(24, widthA * 34);
      const barX1 = lx + lw * 0.44, barX2 = barX1 + barW;

      // Potential barrier V₀ rectangle
      ctx.fillStyle = "rgba(255, 107, 107, 0.18)";
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2;
      ctx.fillRect(barX1, baseY - v0H, barW, v0H);
      ctx.strokeRect(barX1, baseY - v0H, barW, v0H);

      // Particle energy level E line
      const eY = baseY - eRatio * v0H;
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(lx + 12, eY); ctx.lineTo(lx + lw - 12, eY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Compute WKB / exact rectangular transmission T
      const calcT = (er) => {
        if (Math.abs(er - 1) < 1e-3) return 1 / (1 + 0.8 * massM * widthA * widthA);
        if (er < 1) {
          const kappa = Math.sqrt(2 * massM * (1 - er)) * widthA * 1.35;
          const sh = Math.sinh(kappa);
          return 1 / (1 + (sh * sh) / (4 * er * (1 - er)));
        }
        const k2 = Math.sqrt(2 * massM * (er - 1)) * widthA * 1.35;
        const sn = Math.sin(k2);
        return 1 / (1 + (sn * sn) / (4 * er * (er - 1)));
      };
      const T = calcT(eRatio);
      const R = 1 - T;

      // Draw Re[ψ(x,t)] oscillating left, exponential inside, transmitted right
      const k1 = Math.sqrt(Math.max(0.1, eRatio * massM)) * 0.22;
      const kappa = eRatio < 1 ? Math.sqrt(2 * massM * (1 - eRatio)) / Math.max(12, barW) * 1.4 : 0;

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let px = lx + 14; px <= lx + lw - 14; px += 2) {
        let psi = 0;
        if (px < barX1) {
          const dx = px - barX1;
          psi = Math.cos(k1 * dx - st.t * 4) + Math.sqrt(R) * Math.cos(-k1 * dx - st.t * 4);
        } else if (px <= barX2) {
          const dx = px - barX1;
          if (eRatio < 1) {
            psi = (1 + Math.sqrt(R) * 0.4) * Math.exp(-kappa * dx) * Math.cos(st.t * 4);
          } else {
            const kIn = Math.sqrt(Math.max(0.05, (eRatio - 1) * massM)) * 0.22;
            psi = Math.cos(kIn * dx - st.t * 4);
          }
        } else {
          const dx = px - barX2;
          psi = Math.sqrt(T) * 1.35 * Math.cos(k1 * dx - st.t * 4);
        }
        const py = eY - psi * 26;
        if (px === lx + 14) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Right: Transmission curve T(E/V₀) showing exponential rise + Fabry-Pérot resonances for E > V₀
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const er = 0.08 + (i / 80) * 1.92;
        const tv = calcT(er);
        const px = rx + 14 + (i / 80) * (rw - 28);
        const py = baseY - tv * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curTx = rx + 14 + ((eRatio - 0.08) / 1.92) * (rw - 28);
      const curTy = baseY - T * (lh - 56);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(curTx, curTy, 5.5, 0, Math.PI * 2); ctx.fill();

      return {
        "Transmission T": `${(T * 100).toFixed(2)}%`,
        "Reflection R = 1−T": `${(R * 100).toFixed(2)}%`,
        "Energy Ratio E / V₀": eRatio.toFixed(2),
        "Regime": eRatio < 1 ? "WKB Evanescent Tunneling" : "Over-Barrier Fabry-Pérot",
      };
    },

    // 26. Carnot & Otto Thermodynamic P-V / T-S Engine
    phys_carnot_stirling_cycle(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Carnot P-V cycle (2 isotherms + 2 adiabats); Right: Rectangular T-S loop & piston", st.spec.formula);
      const thTc = st.v0 || 2.5; // T_H / T_C
      const compR = st.v1 || 2.8; // V2 / V1
      const gamma = st.v2 || 1.4;

      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "P-V Clapeyron Diagram (∮ P dV = W_net)");
      st.panel(rx, ly, rw, lh, "T-S Entropy Diagram (∮ T dS = Q_H − Q_C)");

      // 4 corners in (V, P) space
      const V1 = 1.0, V2 = compR;
      const adRatio = Math.pow(thTc, 1 / (gamma - 1));
      const V3 = Math.min(6.2, V2 * Math.min(2.1, adRatio * 0.55));
      const V4 = V1 * (V3 / V2);

      const toPV = (v, p) => ({
        px: lx + 26 + ((v - 0.7) / 5.8) * (lw - 44),
        py: ly + lh - 24 - Math.min(1, p / 3.4) * (lh - 56),
      });

      const ptsPV = [];
      // 1->2 Isothermal expansion at T_H: P = T_H / V
      for (let i = 0; i <= 25; i++) {
        const v = V1 + (i / 25) * (V2 - V1);
        ptsPV.push(toPV(v, thTc / v));
      }
      // 2->3 Adiabatic expansion
      const p2 = thTc / V2, p3 = 1.0 / V3;
      for (let i = 1; i <= 20; i++) {
        const u = i / 20;
        const v = V2 + u * (V3 - V2);
        const p = p2 * (1 - u) + p3 * u - 0.15 * u * (1 - u);
        ptsPV.push(toPV(v, p));
      }
      // 3->4 Isothermal compression at T_C = 1.0
      for (let i = 1; i <= 25; i++) {
        const v = V3 - (i / 25) * (V3 - V4);
        ptsPV.push(toPV(v, 1.0 / v));
      }
      // 4->1 Adiabatic compression
      const p4 = 1.0 / V4, p1 = thTc / V1;
      for (let i = 1; i <= 20; i++) {
        const u = i / 20;
        const v = V4 - u * (V4 - V1);
        const p = p4 * (1 - u) + p1 * u - 0.18 * u * (1 - u);
        ptsPV.push(toPV(v, p));
      }

      ctx.fillStyle = "rgba(255, 209, 102, 0.18)";
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ptsPV.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.px, pt.py); else ctx.lineTo(pt.px, pt.py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Animated state dot along cycle
      const cycIdx = Math.floor((st.t * 22) % ptsPV.length);
      const curPV = ptsPV[cycIdx];
      ctx.fillStyle = C.ok;
      ctx.beginPath(); ctx.arc(curPV.px, curPV.py, 5.5, 0, Math.PI * 2); ctx.fill();

      // Right: T-S rectangle (Carnot cycle is a clean rectangle in T-S space!)
      const sx1 = rx + 28, sx2 = rx + 28 + Math.min(rw - 56, Math.log(compR) * (rw * 0.34));
      const tyH = ly + lh - 28 - Math.min(0.85, thTc / 4.2) * (lh - 54);
      const tyC = ly + lh - 28 - (1.0 / 4.2) * (lh - 54);

      ctx.fillStyle = "rgba(110, 231, 183, 0.20)";
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.fillRect(sx1, tyH, sx2 - sx1, tyC - tyH);
      ctx.strokeRect(sx1, tyH, sx2 - sx1, tyC - tyH);

      ctx.fillStyle = C.danger;
      ctx.fillText(`T_H = ${(thTc * 300).toFixed(0)} K`, sx1 + 6, tyH - 6);
      ctx.fillStyle = C.primary;
      ctx.fillText("T_C = 300 K", sx1 + 6, tyC + 14);

      const etaCarnot = (1 - 1 / thTc) * 100;
      const etaOtto = (1 - 1 / Math.pow(compR, gamma - 1)) * 100;
      return {
        "Carnot Efficiency η_C": `${etaCarnot.toFixed(1)}%`,
        "Otto Efficiency η_O": `${etaOtto.toFixed(1)}%`,
        "Entropy Stroke ΔS": `${(8.314 * Math.log(compR)).toFixed(2)} J/K`,
        "Reservoir T_H / T_C": `${thTc.toFixed(2)}×`,
      };
    },

    // 27. Navier-Stokes Vortex Shedding & Kármán Street
    phys_navier_stokes_karman(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Viscous flow past cylinder shedding alternating clockwise/counter-clockwise Kármán vortices", st.spec.formula);
      const Re = st.v0 || 140;
      const U0 = st.v1 || 1.6;
      const nu = st.v2 || 0.08;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, `2D Kármán Vortex Street Wake (Re = ${Re.toFixed(0)}, St ≈ 0.198)`);

      const cylX = lx + lw * 0.20, cylY = ly + lh * 0.54, cylR = Math.min(lw, lh) * 0.095;
      const shedding = Re > 47;
      const strouhal = 0.198 * (1 - 19.7 / Math.max(25, Re));
      const freq = Math.max(0.4, strouhal * U0 * 3.5);

      // Draw alternating shed vortices downstream
      const numVort = 9;
      const vortList = [];
      for (let k = 0; k < numVort; k++) {
        const age = ((st.t * U0 * 0.55 + k / numVort) % 1);
        const vx = cylX + cylR * 1.2 + age * (lw * 0.74);
        const sign = (k % 2 === 0) ? 1 : -1;
        const amp = shedding ? cylR * (0.55 + age * 0.65) : cylR * 0.15;
        const vy = cylY + sign * amp * Math.sin(age * Math.PI * 3.2 - st.t * freq * 3);
        const rad = cylR * (0.45 + age * 0.85 + nu * 1.2);
        vortList.push({ x: vx, y: vy, r: rad, sign, alpha: Math.max(0.12, (1 - age * 0.82)) });
      }

      if (shedding) {
        vortList.forEach((v) => {
          ctx.strokeStyle = v.sign > 0 ? `rgba(255, 107, 107, ${v.alpha})` : `rgba(124, 156, 255, ${v.alpha})`;
          ctx.fillStyle = v.sign > 0 ? `rgba(255, 107, 107, ${v.alpha * 0.22})` : `rgba(124, 156, 255, ${v.alpha * 0.22})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Swirl spiral inside vortex core
          ctx.beginPath();
          for (let a = 0; a < 10; a++) {
            const ang = a * 0.6 * v.sign + st.t * 4 * v.sign;
            const sr = (a / 10) * v.r * 0.8;
            const px = v.x + sr * Math.cos(ang), py = v.y + sr * Math.sin(ang);
            if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        });
      }

      // Streamlines deflecting around cylinder and undulating in wake
      for (let row = -4; row <= 4; row++) {
        if (row === 0) continue;
        ctx.strokeStyle = "rgba(110, 231, 183, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i <= 110; i++) {
          const px = lx + 12 + (i / 110) * (lw - 24);
          const dx = px - cylX;
          const yBase = cylY + row * (lh * 0.085);
          const r2 = Math.max(cylR * cylR * 1.15, dx * dx + (yBase - cylY) * (yBase - cylY));
          let py = yBase + (yBase - cylY) * (cylR * cylR / r2);
          if (dx > 0 && shedding) {
            py += Math.sin(dx * 0.045 - st.t * freq * 4) * cylR * 0.42 * Math.exp(-Math.abs(row) * 0.25);
          }
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Obstacle Cylinder
      ctx.fillStyle = "#262d4d";
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cylX, cylY, cylR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      return {
        "Reynolds Number Re": Re.toFixed(0),
        "Strouhal Number St": shedding ? strouhal.toFixed(3) : "0.000 (Steady)",
        "Shedding Freq f_s": shedding ? `${freq.toFixed(2)} Hz` : "No Shedding (Re < 47)",
        "Wake Regime": Re < 47 ? "Attached Twin Eddies" : "Alternating Kármán Street",
      };
    },

    // 28. Rotating Reference Frame & Foucault Coriolis Precession
    phys_foucault_coriolis(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Foucault pendulum rosette in rotating frame; Right: Globe latitude φ & Coriolis vector", st.spec.formula);
      const latDeg = st.v0 !== undefined ? st.v0 : 48.8; // Paris latitude
      const omegaRot = st.v1 || 1.2;
      const damp = st.v2 || 0.04;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Foucault Rosette Precession (φ = ${latDeg.toFixed(1)}°)`);
      st.panel(rx, ly, rw, lh, "Planetary Frame & ω_p = Ω sin φ");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.36;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

      // Compass pegs around perimeter
      for (let k = 0; k < 24; k++) {
        const a = (k / 24) * Math.PI * 2;
        ctx.fillStyle = C.muted;
        ctx.beginPath();
        ctx.arc(cx + R * Math.cos(a), cy + R * Math.sin(a), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const sinPhi = Math.sin((latDeg * Math.PI) / 180);
      const omegaPrec = omegaRot * sinPhi * 0.35;

      // Hypotrochoid / Rosette curve x(t) = R cos(ω₀ u) cos(ω_p u), y(t) = R cos(ω₀ u) sin(ω_p u)
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const maxU = 22;
      for (let i = 0; i <= 320; i++) {
        const u = (i / 320) * maxU;
        const env = R * Math.exp(-damp * u * 0.15) * Math.cos(3.2 * u);
        const prec = omegaPrec * u + st.t * omegaPrec * 1.5;
        const px = cx + env * Math.cos(prec);
        const py = cy + env * Math.sin(prec);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Active bob position
      const envNow = R * Math.cos(3.2 * st.t * 1.5);
      const precNow = st.t * omegaPrec * 1.5;
      const bx = cx + envNow * Math.cos(precNow), by = cy + envNow * Math.sin(precNow);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(bx, by, 6.5, 0, Math.PI * 2); ctx.fill();

      // Right: Earth Meridian Cross-Section showing Latitude φ and tangent plane
      const gcx = rx + rw * 0.5, gcy = ly + lh * 0.56, gr = Math.min(rw, lh) * 0.30;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(gcx, gcy, gr, 0, Math.PI * 2); ctx.stroke();

      // Equator & Rotation axis Ω
      ctx.strokeStyle = C.axis;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(gcx - gr - 10, gcy); ctx.lineTo(gcx + gr + 10, gcy);
      ctx.moveTo(gcx, gcy - gr - 14); ctx.lineTo(gcx, gcy + gr + 14);
      ctx.stroke();
      ctx.setLineDash([]);

      const radPhi = (latDeg * Math.PI) / 180;
      const lxPt = gcx + gr * Math.cos(radPhi), lyPt = gcy - gr * Math.sin(radPhi);
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(gcx, gcy); ctx.lineTo(lxPt, lyPt);
      ctx.stroke();
      ctx.fillStyle = C.danger;
      ctx.beginPath(); ctx.arc(lxPt, lyPt, 5, 0, Math.PI * 2); ctx.fill();

      const periodHrs = Math.abs(sinPhi) > 0.03 ? `${(23.93 / Math.abs(sinPhi)).toFixed(1)} hrs` : "∞ (Equator)";
      return {
        "Latitude φ": `${latDeg.toFixed(1)}°`,
        "Sine Factor sin φ": sinPhi.toFixed(3),
        "Precession Period T_p": periodHrs,
        "Hourly Drift Δθ": `${(15 * sinPhi).toFixed(2)}°/hr`,
      };
    },

    // 29. Acoustic Doppler Shift & Supersonic Mach Shock Cone
    phys_doppler_mach_cone(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Moving acoustic source emitting spherical wavefronts; Mach cone sin μ = 1/M forms for M > 1", st.spec.formula);
      const M = st.v0 !== undefined ? st.v0 : 1.45;
      const f0 = st.v1 || 2.0;
      const atten = st.v2 || 0.15;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Doppler Wavefronts & Mach Cone (Mach M = ${M.toFixed(2)})`);

      const cy = ly + lh * 0.54;
      const cs = 52; // pixels per unit time
      const vs = M * cs;
      const cycleT = (st.t * 0.65) % 4.2;
      const srcX = lx + 90 + vs * cycleT * 0.65;

      // Draw 14 historical emitted spherical wavefronts
      const numWaves = 14;
      for (let k = 0; k < numWaves; k++) {
        const dtEmit = (k / numWaves) * 3.2;
        const emitX = srcX - vs * dtEmit * 0.55;
        const rad = cs * dtEmit * 0.55;
        const alpha = Math.max(0.12, Math.exp(-atten * dtEmit * 0.8));
        ctx.strokeStyle = `rgba(124, 156, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(emitX, cy, rad, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Supersonic Mach Cone tangent lines when M >= 1.0
      if (M >= 1.0) {
        const sinMu = Math.min(1, 1 / M);
        const muAng = Math.asin(sinMu);
        const coneLen = lw * 0.65;
        ctx.strokeStyle = C.danger;
        ctx.lineWidth = 2.5;
        [1, -1].forEach((sgn) => {
          ctx.beginPath();
          ctx.moveTo(srcX, cy);
          ctx.lineTo(srcX - coneLen * Math.cos(muAng), cy + sgn * coneLen * Math.sin(muAng));
          ctx.stroke();
        });
      }

      // Source emitter icon
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(srcX, cy, 6, 0, Math.PI * 2);
      ctx.fill();

      const machAngle = M >= 1.0 ? `${((Math.asin(1 / M) * 180) / Math.PI).toFixed(1)}°` : "Subsonic (No Shock)";
      const fAhead = M < 0.98 ? `${(f0 / (1 - M)).toFixed(2)} f₀` : "Shock Caustic (M ≥ 1)";
      const fBehind = `${(f0 / (1 + M)).toFixed(2)} f₀`;
      return {
        "Mach Number M": M.toFixed(2),
        "Mach Half-Angle μ": machAngle,
        "Forward Freq f_front": fAhead,
        "Receding Freq f_back": fBehind,
      };
    },

    // 30. Driven RLC Resonator, Impedance Phasor & Bode Plot
    phys_rlc_phasor_bode(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Rotating impedance phasor triangle (V_R, V_L, V_C); Right: Bode magnitude & phase", st.spec.formula);
      const wRatio = st.v0 || 1.0; // ω / ω0
      const Q = st.v1 || 4.0;
      const Rval = st.v2 || 10;

      const lx = 18, ly = 46, lw = W * 0.44, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Complex Phasor Diagram (I, V_R, V_L, V_C)");
      st.panel(rx, ly, rw, lh, "Bode Resonance |H(ω)| & Phase ∠Z(ω)");

      const netReact = Q * (wRatio - 1 / Math.max(0.1, wRatio));
      const Zmag = Rval * Math.sqrt(1 + netReact * netReact);
      const phi = Math.atan(netReact); // phase angle of Z

      // Left: Rotating phasors
      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, sc = Math.min(lw, lh) * 0.25;
      const ang = st.t * 2.2 * wRatio;

      const drawVec = (mag, angle, col, label) => {
        const vx = cx + mag * sc * Math.cos(angle);
        const vy = cy - mag * sc * Math.sin(angle);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(vx, vy); ctx.stroke();
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 10px monospace";
        ctx.fillText(label, vx + 6, vy + 3);
      };

      const iAmp = 1 / Math.sqrt(1 + netReact * netReact);
      drawVec(0.75, ang, C.ok, "V_R (I)");
      drawVec(Math.min(1.25, 0.45 * Q * wRatio * iAmp), ang + Math.PI / 2, C.primary, "V_L (+90°)");
      drawVec(Math.min(1.25, (0.45 * Q / Math.max(0.2, wRatio)) * iAmp), ang - Math.PI / 2, C.secondary, "V_C (−90°)");
      drawVec(0.95, ang + phi, C.accent, "V_drive");

      // Right top: Bode Magnitude Resonance peak
      const byMid = ly + lh * 0.54;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const wr = 0.2 + (i / 80) * 2.3;
        const xReact = Q * (wr - 1 / wr);
        const gain = 1 / Math.sqrt(1 + xReact * xReact);
        const px = rx + 14 + (i / 80) * (rw - 28);
        const py = byMid - gain * (lh * 0.38);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Right bottom: Phase angle curve -90° to +90°
      const pMidY = ly + lh * 0.78;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx + 14, pMidY); ctx.lineTo(rx + rw - 14, pMidY); ctx.stroke();

      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const wr = 0.2 + (i / 80) * 2.3;
        const ph = Math.atan(Q * (wr - 1 / wr)) / (Math.PI / 2);
        const px = rx + 14 + (i / 80) * (rw - 28);
        const py = pMidY - ph * (lh * 0.16);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Cursor line at current ω/ω₀
      const curX = rx + 14 + ((wRatio - 0.2) / 2.3) * (rw - 28);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(curX, ly + 26); ctx.lineTo(curX, ly + lh - 12); ctx.stroke();
      ctx.setLineDash([]);

      return {
        "Impedance |Z(ω)|": `${Zmag.toFixed(1)} Ω`,
        "Phase Angle φ": `${((phi * 180) / Math.PI).toFixed(1)}°`,
        "Power Factor cos φ": Math.cos(phi).toFixed(3),
        "Resonance State": Math.abs(wRatio - 1) < 0.06 ? "LC Resonance (X_L=X_C)" : (wRatio < 1 ? "Capacitive Lead" : "Inductive Lag"),
      };
    },

    // 31. Bragg X-Ray Diffraction & Reciprocal Lattice Ewald Sphere
    phys_bragg_crystal_diffraction(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: X-ray wavefronts reflecting off (hkl) planes; Right: 2θ XRD diffractogram peaks", st.spec.formula);
      const thetaDeg = st.v0 || 28;
      const dSpace = st.v1 || 2.8;
      const lambda = st.v2 || 1.54; // Cu Kα

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Crystal Lattice Planes (d = ${dSpace.toFixed(2)} Å) & Path Difference 2d sin θ`);
      st.panel(rx, ly, rw, lh, "Powder XRD Diffractogram I(2θ)");

      const thetaRad = (thetaDeg * Math.PI) / 180;
      const pathDiff = 2 * dSpace * Math.sin(thetaRad);
      const nOrder = Math.max(1, Math.round(pathDiff / lambda));
      const phaseMismatch = ((pathDiff / lambda) - nOrder) * Math.PI * 2;
      const constructiveness = Math.pow(Math.cos(phaseMismatch * 0.5), 6);

      // Draw 4 crystal atomic planes
      const dPx = Math.min(44, 18 + dSpace * 7.5);
      const yTop = ly + 74;
      for (let row = 0; row < 4; row++) {
        const py = yTop + row * dPx;
        ctx.strokeStyle = "rgba(124, 156, 255, 0.28)";
        ctx.beginPath(); ctx.moveTo(lx + 20, py); ctx.lineTo(lx + lw - 20, py); ctx.stroke();
        for (let col = 0; col < 8; col++) {
          const px = lx + 34 + col * ((lw - 68) / 7);
          ctx.fillStyle = C.primary;
          ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Incident & reflected X-ray beams on top 2 planes
      const midX = lx + lw * 0.5;
      [0, 1].forEach((r) => {
        const hitY = yTop + r * dPx;
        const beamLen = 95;
        const ix = midX - beamLen * Math.cos(thetaRad), iy = hitY - beamLen * Math.sin(thetaRad);
        const ox = midX + beamLen * Math.cos(thetaRad), oy = hitY - beamLen * Math.sin(thetaRad);

        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ix, iy); ctx.lineTo(midX, hitY);
        ctx.stroke();

        ctx.strokeStyle = constructiveness > 0.7 ? C.ok : C.secondary;
        ctx.lineWidth = 1.5 + constructiveness * 2.2;
        ctx.beginPath();
        ctx.moveTo(midX, hitY); ctx.lineTo(ox, oy);
        ctx.stroke();
      });

      // Highlight extra path 2 d sin θ on second plane
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(midX - dPx * Math.sin(thetaRad) * Math.cos(thetaRad), yTop + dPx - dPx * Math.sin(thetaRad) * Math.sin(thetaRad));
      ctx.lineTo(midX, yTop + dPx);
      ctx.lineTo(midX + dPx * Math.sin(thetaRad) * Math.cos(thetaRad), yTop + dPx - dPx * Math.sin(thetaRad) * Math.sin(thetaRad));
      ctx.stroke();

      // Right: XRD I(2θ) spectrum from θ = 10° to 75°
      const baseY = ly + lh - 26;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 110; i++) {
        const th = 10 + (i / 110) * 65;
        const pd = 2 * dSpace * Math.sin((th * Math.PI) / 180);
        let intensity = 0.04;
        for (let n = 1; n <= 4; n++) {
          intensity += Math.exp(-Math.pow((pd - n * lambda) / 0.14, 2)) / Math.pow(n, 0.45);
        }
        const px = rx + 14 + (i / 110) * (rw - 28);
        const py = baseY - Math.min(1, intensity) * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curX = rx + 14 + ((thetaDeg - 10) / 65) * (rw - 28);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(curX, ly + 26); ctx.lineTo(curX, baseY); ctx.stroke();
      ctx.setLineDash([]);

      return {
        "Path Difference 2dsinθ": `${pathDiff.toFixed(2)} Å`,
        "Order Ratio 2dsinθ/λ": (pathDiff / lambda).toFixed(2),
        "Diffraction Angle 2θ": `${(2 * thetaDeg).toFixed(1)}°`,
        "Bragg Condition": constructiveness > 0.75 ? `CONSTRUCTIVEPEAK (n=${nOrder})` : "Destructive Cancellation",
      };
    },

    // 32. Two-Level Rabi Oscillations & Bloch Sphere Nutation
    phys_rabi_bloch_precession(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: 3D Bloch sphere state vector r(t) nutating around Ω_eff; Right: Excited P₁(t) Rabi flopping", st.spec.formula);
      const omegaR = st.v0 || 2.0;
      const delta = st.v1 !== undefined ? st.v1 : 0.4;
      const gamma2 = st.v2 || 0.08;

      const omegaEff = Math.hypot(omegaR, delta);
      const lx = 18, ly = 46, lw = W * 0.46, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "3D Bloch Sphere (|0⟩ North, |1⟩ South)");
      st.panel(rx, ly, rw, lh, "Excited State Population P_{|1⟩}(t)");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.34;
      // Sphere outline & equator ellipse
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "rgba(124, 156, 255, 0.28)";
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.32, 0, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = C.text;
      ctx.font = "600 11px monospace";
      ctx.fillText("|0⟩", cx - 8, cy - R - 7);
      ctx.fillText("|1⟩", cx - 8, cy + R + 14);

      // Effective torque axis Ω_eff = (Ω_R, 0, Δ)
      const tilt = Math.atan2(omegaR, delta);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.sin(tilt), cy - R * Math.cos(tilt));
      ctx.stroke();
      ctx.setLineDash([]);

      // Bloch vector trajectory & current tip
      const p1OfT = (t) => {
        const osc = Math.pow(omegaR / omegaEff, 2) * Math.pow(Math.sin(0.5 * omegaEff * t), 2);
        return 0.5 * (omegaR * omegaR / (omegaEff * omegaEff)) * (1 - Math.exp(-gamma2 * t)) + osc * Math.exp(-gamma2 * t);
      };
      const tNow = (st.t * 1.4) % 8.0;
      const p1Now = p1OfT(tNow);
      const zBloch = 1 - 2 * p1Now;
      const xyAmp = Math.sqrt(Math.max(0, 1 - zBloch * zBloch)) * Math.exp(-gamma2 * tNow * 0.6);
      const bx = cx + R * xyAmp * Math.cos(omegaEff * tNow);
      const by = cy - R * zBloch + R * 0.25 * xyAmp * Math.sin(omegaEff * tNow);

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
      ctx.fillStyle = C.ok;
      ctx.beginPath(); ctx.arc(bx, by, 5.5, 0, Math.PI * 2); ctx.fill();

      // Right: Rabi oscillation curve P₁(t) vs resonant envelope
      const baseY = ly + lh - 24;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const tv = (i / 100) * 8.0;
        const pv = p1OfT(tv);
        const px = rx + 14 + (i / 100) * (rw - 28);
        const py = baseY - pv * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const maxInv = Math.pow(omegaR / omegaEff, 2);
      return {
        "Generalized Ω_eff": `${omegaEff.toFixed(2)} rad/s`,
        "Max Inversion P_max": `${(maxInv * 100).toFixed(1)}%`,
        "π-Pulse Time t_π": `${(Math.PI / omegaEff).toFixed(2)} s`,
        "Bloch z-Projection": `⟨σ_z⟩ = ${zBloch.toFixed(2)}`,
      };
    },

    // 33. Bose-Einstein, Fermi-Dirac & Maxwell-Boltzmann Statistics
    phys_bose_fermi_quantum_stat(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Occupancy ⟨n(ε)⟩ for Fermions (+1), Bosons (−1), and Boltzmann; Right: Quantum level boxes", st.spec.formula);
      const kT = Math.max(0.05, st.v0 || 0.25);
      const mu = st.v1 !== undefined ? st.v1 : 1.0;
      const gDeg = Math.max(1, Math.round(st.v2 || 2));

      const lx = 18, ly = 46, lw = W * 0.56, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Quantum Mean Occupancy ⟨n(ε)⟩ vs Energy ε");
      st.panel(rx, ly, rw, lh, "Microstate Level Filling (Pauli vs BEC)");

      const baseY = ly + lh - 26;
      const toX = (e) => lx + 20 + ((e - 0) / 3.0) * (lw - 36);
      const toY = (n) => baseY - Math.min(1.05, n / 2.2) * (lh - 56);

      // Chemical potential vertical line ε = μ
      const muX = toX(mu);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(muX, ly + 26); ctx.lineTo(muX, baseY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.accent;
      ctx.fillText(`μ=${mu.toFixed(2)}`, muX + 5, ly + 40);

      // 1. Fermi-Dirac: 1 / (exp((ε - μ)/kT) + 1)
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const e = (i / 90) * 3.0;
        const nFD = 1 / (Math.exp((e - mu) / kT) + 1);
        const px = toX(e), py = toY(nFD);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 2. Maxwell-Boltzmann: exp(-(ε - μ)/kT)
      ctx.strokeStyle = C.secondary;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const e = (i / 90) * 3.0;
        const nMB = Math.exp(-(e - mu) / kT);
        const px = toX(e), py = toY(nMB);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 3. Bose-Einstein: 1 / (exp((ε - μ_B)/kT) - 1) for ε > μ
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 90; i++) {
        const e = (i / 90) * 3.0;
        if (e > mu + 0.06) {
          const nBE = 1 / Math.max(0.08, Math.exp((e - mu) / kT) - 1);
          const px = toX(e), py = toY(nBE);
          if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Right: Discrete energy rungs showing Fermion Pauli exclusion vs Boson ground-state condensation
      for (let lvl = 0; lvl < 6; lvl++) {
        const yRung = baseY - 12 - lvl * ((lh - 54) / 5.5);
        ctx.strokeStyle = C.axis;
        ctx.beginPath();
        ctx.moveTo(rx + 14, yRung); ctx.lineTo(rx + rw * 0.46, yRung);
        ctx.moveTo(rx + rw * 0.54, yRung); ctx.lineTo(rx + rw - 14, yRung);
        ctx.stroke();

        // Fermions (left ladder): max g_s per level below E_F
        if (lvl * 0.45 <= mu + kT * 0.5) {
          for (let g = 0; g < Math.min(3, gDeg); g++) {
            ctx.fillStyle = C.primary;
            ctx.beginPath(); ctx.arc(rx + 26 + g * 14, yRung - 5, 4, 0, Math.PI * 2); ctx.fill();
          }
        }
        // Bosons (right ladder): pile into ground state lvl = 0 at low kT
        const bCount = lvl === 0 ? Math.max(2, Math.round(5 / (kT + 0.4))) : (lvl < 3 && kT > 0.35 ? 1 : 0);
        for (let b = 0; b < Math.min(6, bCount); b++) {
          ctx.fillStyle = C.ok;
          ctx.beginPath(); ctx.arc(rx + rw * 0.58 + b * 11, yRung - 5, 4, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.fillStyle = C.primary; ctx.fillText("Fermions", rx + 16, ly + 36);
      ctx.fillStyle = C.ok; ctx.fillText("Bosons (BEC)", rx + rw * 0.54, ly + 36);

      return {
        "Fermi Step Width": `~4 k_B T = ${(4 * kT).toFixed(2)}`,
        "Fermion ⟨n(μ)⟩": "0.500 (Exact at ε = μ)",
        "Spin Degeneracy g_s": `g_s = ${gDeg}`,
        "Quantum Regime": kT < 0.25 ? "Degenerate / BEC Condensate" : "Classical Boltzmann Tail",
      };
    },

    // 34. Lorentz E×B Drift & Penning Ion Trap Trajectories
    phys_penning_cyclotron_trap(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Radial Penning epitrochoid (fast cyclotron ω₊ + slow magnetron ω₋); Right: Axial harmonic z(t)", st.spec.formula);
      const B0 = st.v0 || 2.5;
      const U0 = st.v1 || 1.2;
      const qm = st.v2 || 1.5;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Radial (x, y) Epitrochoid: Cyclotron ω₊ + Magnetron ω₋");
      st.panel(rx, ly, rw, lh, "Quadrupole Electrodes & Axial Bounce ω_z");

      const omegaC = qm * B0 * 2.2;
      const omegaZ2 = qm * U0 * 1.4;
      const disc = omegaC * omegaC - 2 * omegaZ2;
      const trapped = disc > 0.1;

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      const Rmag = Math.min(lw, lh) * 0.24;
      const Rcyc = Math.min(lw, lh) * (0.09 / Math.max(0.6, B0 * 0.45));

      // Ring electrode boundary
      ctx.strokeStyle = "rgba(124, 156, 255, 0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(lw, lh) * 0.38, 0, Math.PI * 2); ctx.stroke();

      // Epitrochoid trajectory
      const wMinus = 0.7 + U0 * 0.45;
      const wPlus = Math.max(3.5, omegaC * 1.2);
      ctx.strokeStyle = trapped ? C.ok : C.danger;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= 260; i++) {
        const u = (i / 260) * Math.PI * 2 + st.t * 0.25;
        const px = cx + Rmag * Math.cos(wMinus * u) + Rcyc * Math.cos(wPlus * u);
        const py = cy + Rmag * Math.sin(wMinus * u) + Rcyc * Math.sin(wPlus * u);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current ion position
      const uNow = st.t * 0.9;
      const ix = cx + Rmag * Math.cos(wMinus * uNow) + Rcyc * Math.cos(wPlus * uNow);
      const iy = cy + Rmag * Math.sin(wMinus * uNow) + Rcyc * Math.sin(wPlus * uNow);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(ix, iy, 5.5, 0, Math.PI * 2); ctx.fill();

      // Right: Hyperbolic endcaps & axial oscillation z(t)
      const rcx = rx + rw * 0.5, rcy = ly + lh * 0.54;
      ctx.fillStyle = "rgba(255, 107, 107, 0.22)";
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2;
      // Top and bottom endcaps (+U₀)
      [-1, 1].forEach((sgn) => {
        ctx.beginPath();
        ctx.arc(rcx, rcy + sgn * (lh * 0.42), rw * 0.28, sgn > 0 ? Math.PI * 1.15 : 0.15 * Math.PI, sgn > 0 ? Math.PI * 1.85 : 0.85 * Math.PI);
        ctx.stroke();
      });

      const zPos = rcy + Math.sin(st.t * Math.sqrt(omegaZ2) * 2.5) * (lh * 0.22);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(rcx, zPos, 6.5, 0, Math.PI * 2); ctx.fill();

      return {
        "Cyclotron Freq ω_c": `${omegaC.toFixed(2)} rad/s`,
        "Axial Freq ω_z": `${Math.sqrt(omegaZ2).toFixed(2)} rad/s`,
        "Invariance ω₊²+ω₋²+ω_z²": `${(omegaC * omegaC).toFixed(1)} = ω_c²`,
        "Confinement Stability": trapped ? "Stable (ω_c² > 2ω_z²)" : "Unstable Radial Escape!",
      };
    },

    // 35. Fresnel Equations, Brewster's Angle & Evanescent TIR
    phys_snell_fresnel_brewster(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Incident, reflected & refracted rays across n₁/n₂ interface; Right: Fresnel R_s(θ) & R_p(θ)", st.spec.formula);
      const n1 = st.v0 || 1.0;
      const n2 = st.v1 || 1.52;
      const polP = st.v2 !== undefined ? st.v2 : 0.8;

      const thetaDeg = 12 + st.px * 74;
      const th1 = (thetaDeg * Math.PI) / 180;
      const sinTh2 = (n1 / n2) * Math.sin(th1);
      const isTIR = sinTh2 >= 1.0;
      const th2 = isTIR ? Math.PI / 2 : Math.asin(sinTh2);

      let Rs = 1, Rp = 1;
      if (!isTIR) {
        const c1 = Math.cos(th1), c2 = Math.cos(th2);
        Rs = Math.pow((n1 * c1 - n2 * c2) / (n1 * c1 + n2 * c2), 2);
        Rp = Math.pow((n2 * c1 - n1 * c2) / (n2 * c1 + n1 * c2), 2);
      }
      const brewsterDeg = (Math.atan(n2 / n1) * 180) / Math.PI;

      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Dielectric Interface (θ₁ = ${thetaDeg.toFixed(1)}°, drag X to sweep)`);
      st.panel(rx, ly, rw, lh, "Fresnel Reflectance R_s(θ) & R_p(θ) (Brewster Zero)");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, rayL = Math.min(lw, lh) * 0.38;
      // Shade lower medium n2
      ctx.fillStyle = "rgba(124, 156, 255, 0.14)";
      ctx.fillRect(lx + 8, cy, lw - 16, ly + lh - cy - 8);
      // Normal line
      ctx.strokeStyle = C.axis;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx, ly + 26); ctx.lineTo(cx, ly + lh - 10); ctx.stroke();
      ctx.setLineDash([]);

      // Incident ray
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(cx - rayL * Math.sin(th1), cy - rayL * Math.cos(th1));
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Reflected ray (opacity scaled by effective reflectance)
      const Reff = polP * Rp + (1 - polP) * Rs;
      ctx.strokeStyle = `rgba(255, 143, 171, ${0.2 + Reff * 0.8})`;
      ctx.lineWidth = 1.5 + Reff * 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + rayL * Math.sin(th1), cy - rayL * Math.cos(th1));
      ctx.stroke();

      // Refracted ray or Evanescent surface wave
      if (!isTIR) {
        ctx.strokeStyle = C.ok;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + rayL * Math.sin(th2), cy + rayL * Math.cos(th2));
        ctx.stroke();
      } else {
        ctx.strokeStyle = C.danger;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const u = i / 40;
          ctx.lineTo(cx + (u - 0.5) * (lw - 30), cy + 16 * Math.exp(-u * 2) * Math.sin(u * 25 - st.t * 5));
        }
        ctx.stroke();
      }

      // Right: R_s and R_p curves vs incidence angle 0..90°
      const baseY = ly + lh - 26;
      const drawRCurve = (isP, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let deg = 0; deg <= 89; deg++) {
          const t1 = (deg * Math.PI) / 180;
          const s2 = (n1 / n2) * Math.sin(t1);
          let Rval = 1.0;
          if (s2 < 1.0) {
            const c1 = Math.cos(t1), c2 = Math.sqrt(1 - s2 * s2);
            Rval = isP ? Math.pow((n2 * c1 - n1 * c2) / (n2 * c1 + n1 * c2), 2) : Math.pow((n1 * c1 - n2 * c2) / (n1 * c1 + n2 * c2), 2);
          }
          const px = rx + 14 + (deg / 90) * (rw - 28);
          const py = baseY - Rval * (lh - 56);
          if (deg === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      drawRCurve(false, C.primary); // R_s
      drawRCurve(true, C.ok); // R_p (hits 0 at Brewster's angle)

      const bX = rx + 14 + (brewsterDeg / 90) * (rw - 28);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(bX, baseY, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(`θ_B=${brewsterDeg.toFixed(1)}°`, bX - 22, baseY - 10);

      return {
        "Brewster Angle θ_B": `${brewsterDeg.toFixed(1)}° (R_p = 0)`,
        "s-Reflectance R_s": `${(Rs * 100).toFixed(1)}%`,
        "p-Reflectance R_p": `${(Rp * 100).toFixed(1)}%`,
        "Refracted Angle θ₂": isTIR ? "Total Internal Reflection!" : `${((th2 * 180) / Math.PI).toFixed(1)}°`,
      };
    },

    // 36. 2D Biharmonic Chladni Plate Nodal Patterns
    phys_chladni_plate_modes(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Square acoustic plate with sand grains migrating to w_{mn}(x,y) = 0 nodal lines", st.spec.formula);
      const m = Math.max(1, Math.round(st.v0 || 3));
      const n = Math.max(1, Math.round(st.v1 || 2));
      const damp = st.v2 || 0.08;

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Chladni Nodal Sand Plate — Mode (m=${m}, n=${n})`);
      st.panel(rx, ly, rw, lh, "Eigenfrequency Spectrum ω_{mn} ∝ (m² + n²)");

      const side = Math.min(lw - 28, lh - 38);
      const px0 = lx + (lw - side) * 0.5, py0 = ly + 22 + (lh - 30 - side) * 0.5;

      const evalW = (x, y) =>
        Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * y) -
        Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * y) +
        (m === n ? Math.cos(m * Math.PI * x) * Math.sin(n * Math.PI * y) : 0);

      const G = 34;
      const cw = side / G;
      for (let gy = 0; gy < G; gy++) {
        for (let gx = 0; gx < G; gx++) {
          const u = (gx + 0.5) / G, v = (gy + 0.5) / G;
          const w = evalW(u, v);
          const isNodal = Math.abs(w) < 0.16 + damp * 0.15;
          if (isNodal) {
            ctx.fillStyle = C.accent;
            ctx.fillRect(px0 + gx * cw, py0 + gy * cw, cw - 0.5, cw - 0.5);
          } else {
            const osc = w * Math.cos(st.t * 5);
            ctx.fillStyle = osc > 0 ? `rgba(124,156,255,${Math.min(0.45, osc * 0.25)})` : `rgba(255,143,171,${Math.min(0.45, -osc * 0.25)})`;
            ctx.fillRect(px0 + gx * cw, py0 + gy * cw, cw - 0.5, cw - 0.5);
          }
        }
      }
      ctx.strokeStyle = C.axis;
      ctx.strokeRect(px0, py0, side, side);

      // Right: Modal frequency grid (m, n)
      const cellS = Math.min((rw - 36) / 5, (lh - 56) / 5);
      for (let mr = 1; mr <= 5; mr++) {
        for (let nc = 1; nc <= 5; nc++) {
          const bx = rx + 18 + (nc - 1) * cellS;
          const by = ly + 34 + (mr - 1) * cellS;
          const active = mr === m && nc === n;
          ctx.fillStyle = active ? C.ok : "rgba(124, 156, 255, 0.15)";
          ctx.fillRect(bx, by, cellS - 4, cellS - 4);
          ctx.fillStyle = active ? "#0f1222" : C.text;
          ctx.font = "600 9px monospace";
          ctx.fillText(`(${mr},${nc})`, bx + 4, by + cellS * 0.55);
        }
      }

      const freqHz = Math.round(42 * (m * m + n * n));
      return {
        "Mode Indices (m, n)": `(${m}, ${n})`,
        "Eigenfrequency f_mn": `${freqHz} Hz`,
        "Biharmonic Eigenvalue": `k² ∝ m²+n² = ${m * m + n * n}`,
        "Symmetry Class": m === n ? "Diagonal Degenerate" : "Chladni Cross-Mode",
      };
    },

    // 37. Superconducting Josephson Junction & Shapiro Steps
    phys_josephson_squid(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Tilted washboard potential U(φ) = −E_J(cos φ + (I/I_c)φ); Right: Quantized Shapiro I-V steps", st.spec.formula);
      const iBias = st.v0 !== undefined ? st.v0 : 1.15; // I / Ic
      const betaC = st.v1 || 0.8;
      const rfDrive = st.v2 || 0.6;

      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "RCSJ Tilted Washboard Potential U(φ)");
      st.panel(rx, ly, rw, lh, "Josephson I-V Curve & Quantized Shapiro Steps");

      // Left: Washboard potential curve
      const midY = ly + lh * 0.44;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const phi = (i / 100) * 4 * Math.PI;
        const uVal = -Math.cos(phi) - iBias * 0.42 * phi;
        const px = lx + 16 + (i / 100) * (lw - 32);
        const py = midY + uVal * 18;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Phase particle φ(t): trapped in local well if I < I_c, running downhill if I > I_c
      const phiParticle = iBias <= 1.0 ? Math.asin(iBias) + 0.12 * Math.sin(st.t * 5) : ((st.t * 4.5 * Math.sqrt(iBias * iBias - 1)) % (4 * Math.PI));
      const pU = -Math.cos(phiParticle) - iBias * 0.42 * phiParticle;
      const ppx = lx + 16 + (phiParticle / (4 * Math.PI)) * (lw - 32);
      const ppy = midY + pU * 18;
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(ppx, ppy, 6, 0, Math.PI * 2); ctx.fill();

      // Right: I-V Curve with zero-voltage supercurrent up to I_c and Shapiro plateaus V_n = n ℏω / 2e
      const baseY = ly + lh - 26;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const ib = (i / 90) * 2.2;
        let vAvg = ib <= 1.0 ? 0 : Math.sqrt(ib * ib - 1);
        if (rfDrive > 0.1 && vAvg > 0) {
          vAvg = Math.round(vAvg * 3) / 3 + 0.15 * (1 - rfDrive) * Math.sin(vAvg * 9 * Math.PI);
        }
        const px = rx + 16 + (vAvg / 2.2) * (rw - 32);
        const py = baseY - (ib / 2.2) * (lh - 54);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const dcVolt = iBias <= 1.0 ? 0 : Math.sqrt(iBias * iBias - 1);
      return {
        "Bias Ratio I / I_c": iBias.toFixed(2),
        "DC Voltage ⟨V⟩": `${(dcVolt * 20.7).toFixed(1)} μV`,
        "AC Josephson f_J": `${(dcVolt * 10.0).toFixed(2)} GHz`,
        "Junction State": iBias <= 1.0 ? "Zero-Resistance Supercurrent" : "Running Phase / Shapiro Steps",
      };
    },

    // 38. Rayleigh-Bénard Thermal Convection & Boussinesq Rolls
    phys_rayleigh_benard_convection(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Fluid heated from below (T_hot) & cooled above (T_cold): counter-rotating Bénard cells for Ra > Ra_c", st.spec.formula);
      const raRatio = st.v0 || 2.2; // Ra / Ra_c
      const pr = st.v1 || 7.0;
      const kappa = st.v2 || 0.5;

      const lx = 18, ly = 46, lw = W - 36, lh = H - 60;
      st.panel(lx, ly, lw, lh, `Rayleigh-Bénard Convection Layer (Ra / Ra_c = ${raRatio.toFixed(2)}, Ra_c = 1708)`);

      const topY = ly + 36, botY = ly + lh - 26, chH = botY - topY;
      // Top cold plate (blue) and bottom hot plate (red/orange)
      ctx.fillStyle = C.primary;
      ctx.fillRect(lx + 14, topY - 8, lw - 28, 8);
      ctx.fillStyle = C.danger;
      ctx.fillRect(lx + 14, botY, lw - 28, 8);

      const convecting = raRatio > 1.0;
      const numRolls = 4;
      const rollW = (lw - 28) / numRolls;

      for (let r = 0; r < numRolls; r++) {
        const rcx = lx + 14 + (r + 0.5) * rollW;
        const rcy = (topY + botY) * 0.5;
        const dir = (r % 2 === 0) ? 1 : -1;

        // Thermal plume shading
        const grad = ctx.createLinearGradient(rcx, botY, rcx, topY);
        grad.addColorStop(0, "rgba(255, 107, 107, 0.25)");
        grad.addColorStop(1, "rgba(124, 156, 255, 0.25)");
        ctx.fillStyle = grad;
        ctx.fillRect(lx + 14 + r * rollW, topY, rollW - 2, chH);

        if (convecting) {
          for (let ring = 1; ring <= 2; ring++) {
            const rxR = rollW * 0.36 * (ring / 2), ryR = chH * 0.36 * (ring / 2);
            ctx.strokeStyle = dir > 0 ? C.accent : C.ok;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.ellipse(rcx, rcy, rxR, ryR, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Circulating tracer particles
            for (let p = 0; p < 4; p++) {
              const ang = dir * st.t * Math.sqrt(raRatio - 0.8) * 1.6 + (p * Math.PI) / 2;
              ctx.fillStyle = dir > 0 ? C.accent : C.ok;
              ctx.beginPath();
              ctx.arc(rcx + rxR * Math.cos(ang), rcy + ryR * Math.sin(ang), 3.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      const nusselt = convecting ? (1 + 1.44 * Math.pow(1 - 1 / raRatio, 0.8)) : 1.0;
      return {
        "Rayleigh Ra": `${Math.round(raRatio * 1708)} (Ra_c = 1708)`,
        "Nusselt Number Nu": nusselt.toFixed(2),
        "Prandtl Number Pr": pr.toFixed(2),
        "Transport Regime": convecting ? "Bénard Cellular Rolls" : "Pure Conduction (Nu = 1)",
      };
    },

    // 39. Anomalous Zeeman Effect & Atomic Multiplet Splitting
    phys_zeeman_hyperfine_splitting(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Magnetic sublevels E(m_J) = E₀ + g_J μ_B B m_J & selection rules Δm_J = 0, ±1; Right: π/σ lines", st.spec.formula);
      const B = st.v0 !== undefined ? st.v0 : 1.8;
      const gJ = st.v1 || 1.33;
      const mult = Math.max(2, Math.min(5, Math.round(st.v2 || 3))); // 2J+1

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Zeeman Multiplet Energy Level Splitting (2J+1 = ${mult})`);
      st.panel(rx, ly, rw, lh, "Polarized Spectral Triplet / Multiplet (σ⁻, π, σ⁺)");

      const J = (mult - 1) * 0.5;
      const topCenter = ly + lh * 0.28, botCenter = ly + lh * 0.76;
      const splitScale = B * gJ * 11;

      const xB0 = lx + 48, xB = lx + lw - 48;
      // Unsplit levels at B=0
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx + 16, topCenter); ctx.lineTo(xB0, topCenter);
      ctx.moveTo(lx + 16, botCenter); ctx.lineTo(xB0, botCenter);
      ctx.stroke();

      for (let i = 0; i < mult; i++) {
        const mJ = J - i;
        const yUp = topCenter - mJ * splitScale;
        const yDn = botCenter - mJ * splitScale * 0.65;

        ctx.strokeStyle = "rgba(124,156,255,0.45)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(xB0, topCenter); ctx.lineTo(xB - 44, yUp);
        ctx.moveTo(xB0, botCenter); ctx.lineTo(xB - 44, yDn);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(xB - 44, yUp); ctx.lineTo(xB, yUp);
        ctx.moveTo(xB - 44, yDn); ctx.lineTo(xB, yDn);
        ctx.stroke();

        ctx.fillStyle = C.text;
        ctx.font = "9px monospace";
        ctx.fillText(`m=${mJ > 0 ? "+" + mJ : mJ}`, xB + 4, yUp + 3);
      }

      // Allowed dipole transitions Δm = -1 (σ-), 0 (π), +1 (σ+)
      const transCols = { "-1": C.danger, "0": C.ok, "1": C.primary };
      for (let i = 0; i < mult; i++) {
        const mJ = J - i;
        [-1, 0, 1].forEach((dm) => {
          if (Math.abs(mJ + dm) <= J) {
            const xArrow = xB - 38 + (i * 8) + dm * 4;
            const y1 = topCenter - mJ * splitScale;
            const y2 = botCenter - (mJ + dm) * splitScale * 0.65;
            ctx.strokeStyle = transCols[String(dm)];
            ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(xArrow, y1); ctx.lineTo(xArrow, y2); ctx.stroke();
          }
        });
      }

      // Right: Spectral emission lines (σ⁻, π, σ⁺)
      const rcx = rx + rw * 0.5, baseY = ly + lh - 26;
      [-1, 0, 1].forEach((dm) => {
        for (let k = -1; k <= 1; k++) {
          const shiftPx = (dm * 26 + k * 5) * B * 0.65;
          const lxLine = rcx + shiftPx;
          const hPeak = (dm === 0 ? 0.85 : 0.55) * (lh - 64);
          ctx.strokeStyle = transCols[String(dm)];
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(lxLine, baseY); ctx.lineTo(lxLine, baseY - hPeak);
          ctx.stroke();
        }
      });

      const deltaE = (5.788e-5 * gJ * B * 1000).toFixed(3);
      return {
        "Zeeman Shift ΔE": `${deltaE} meV`,
        "Landé g-Factor g_J": gJ.toFixed(2),
        "Sublevels (2J+1)": `${mult} states`,
        "Field Regime": B < 2.2 ? "Anomalous Zeeman" : "Paschen-Back Decoupling",
      };
    },

    // 40. Quantum Vacuum Fluctuations & Casimir Plate Attraction
    phys_casimir_vacuum_modes(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Discrete standing vacuum modes k_n = nπ/d between plates vs continuum outside; Right: F/A ∝ d⁻⁴", st.spec.formula);
      const gapD = st.v0 || 1.2; // nm or hundred nm scale
      const cutoff = st.v1 || 2.0;
      const tempT = st.v2 || 300;

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Quantum Vacuum Modes Between Parallel Conducting Plates");
      st.panel(rx, ly, rw, lh, "Attractive Casimir Pressure |P_c| ∝ d⁻⁴");

      const cx = lx + lw * 0.5;
      const halfGap = Math.max(24, Math.min(lw * 0.28, gapD * 36));
      const pLeft = cx - halfGap, pRight = cx + halfGap;

      // Exterior continuum vacuum modes pushing plates inward
      for (let m = 0; m < 7; m++) {
        const yRow = ly + 40 + m * ((lh - 64) / 6);
        ctx.strokeStyle = "rgba(255, 143, 171, 0.45)";
        ctx.lineWidth = 1.4;
        [lx + 12, pRight].forEach((startX, sideIdx) => {
          const endX = sideIdx === 0 ? pLeft : lx + lw - 12;
          ctx.beginPath();
          for (let px = startX; px <= endX; px += 2) {
            const py = yRow + 6 * Math.sin((px - startX) * (0.15 + m * 0.04) - st.t * (3 + m));
            if (px === startX) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        });
      }

      // Discrete standing modes k_n = n π / d permitted inside gap
      const maxModes = Math.max(2, Math.min(5, Math.round(gapD * 2.5)));
      for (let n = 1; n <= maxModes; n++) {
        const yRow = ly + 48 + (n - 1) * ((lh - 76) / Math.max(1, maxModes - 1 || 1));
        ctx.strokeStyle = C.ok;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const u = i / 40;
          const px = pLeft + u * (pRight - pLeft);
          const py = yRow + 10 * Math.sin(n * Math.PI * u) * Math.cos(st.t * (2.5 + n));
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Parallel conducting plates & inward Casimir force arrows
      ctx.fillStyle = C.accent;
      ctx.fillRect(pLeft - 5, ly + 28, 6, lh - 40);
      ctx.fillRect(pRight - 1, ly + 28, 6, lh - 40);

      // Right: Casimir Pressure curve P(d) ∝ 1 / d^4
      const baseY = ly + lh - 26;
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const dVal = 0.5 + (i / 70) * 2.2;
        const pNorm = Math.min(1, 0.08 / Math.pow(dVal, 4));
        const px = rx + 16 + (i / 70) * (rw - 32);
        const py = baseY - pNorm * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curX = rx + 16 + ((Math.min(2.7, Math.max(0.5, gapD)) - 0.5) / 2.2) * (rw - 32);
      const curY = baseY - Math.min(1, 0.08 / Math.pow(gapD, 4)) * (lh - 56);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(curX, curY, 5.5, 0, Math.PI * 2); ctx.fill();

      const pressurePa = (1.3 / Math.pow(Math.max(0.3, gapD), 4)).toFixed(2);
      return {
        "Casimir Pressure |P_c|": `−${pressurePa} kPa`,
        "Scaling Law": "F/A ∝ −ℏc / (240 d⁴)",
        "Allowed Gap Modes": `${maxModes} standing harmonics`,
        "Zero-Point Energy": "⟨0|H|0⟩_in < ⟨0|H|0⟩_out",
      };
    },

    // =========================================================================
    // 3. CHEMISTRY (20 Bespoke Renderers)
    // =========================================================================

    // 41. Michaelis-Menten & Allosteric Hill Enzyme Kinetics
    chem_michaelis_menten(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Saturation curve v₀([S]) = V_max [S]^n / (K₀.₅^n + [S]^n); Right: Lineweaver-Burk 1/v vs 1/[S]", st.spec.formula);
      const vmax = st.v0 || 2.2;
      const km = st.v1 || 1.2;
      const hillN = st.v2 || 1.5;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Michaelis-Menten / Hill Kinetics (n_H = ${hillN.toFixed(2)})`);
      st.panel(rx, ly, rw, lh, "Lineweaver-Burk Double-Reciprocal (1/v vs 1/[S])");

      const baseY = ly + lh - 26;
      const toX = (s) => lx + 24 + (s / 5.0) * (lw - 42);
      const toY = (v) => baseY - Math.min(1, v / 3.2) * (lh - 56);

      // V_max asymptote and ½ V_max line
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(lx + 24, toY(vmax)); ctx.lineTo(lx + lw - 16, toY(vmax));
      ctx.moveTo(lx + 24, toY(vmax * 0.5)); ctx.lineTo(toX(km), toY(vmax * 0.5));
      ctx.lineTo(toX(km), baseY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.accent;
      ctx.font = "10px monospace";
      ctx.fillText(`V_max=${vmax.toFixed(2)}`, lx + 28, toY(vmax) - 5);
      ctx.fillText(`K_0.5=${km.toFixed(2)}`, toX(km) - 18, baseY + 14);

      // Hyperbolic n=1 reference (dashed) vs Cooperative Hill curve (solid)
      const drawKin = (nExp, col, dashed) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = dashed ? 1.4 : 2.5;
        if (dashed) ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const s = (i / 90) * 5.0;
          const sn = Math.pow(s, nExp), kn = Math.pow(km, nExp);
          const v = (vmax * sn) / Math.max(1e-6, kn + sn);
          const px = toX(s), py = toY(v);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };
      drawKin(1.0, "rgba(124,156,255,0.45)", true);
      drawKin(hillN, C.ok, false);

      // Right: Lineweaver-Burk 1/v = (Km/Vmax)(1/[S]) + 1/Vmax
      const ox = rx + rw * 0.42, oy = baseY - 12;
      ctx.strokeStyle = C.axis;
      ctx.beginPath();
      ctx.moveTo(rx + 12, oy); ctx.lineTo(rx + rw - 12, oy);
      ctx.moveTo(ox, ly + 28); ctx.lineTo(ox, baseY);
      ctx.stroke();

      const xInt = ox - (1 / km) * 28;
      const yInt = oy - (1 / vmax) * 54;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(Math.max(rx + 12, xInt), oy);
      ctx.lineTo(rx + rw - 16, yInt - (rx + rw - 16 - ox) * ((oy - yInt) / Math.max(8, ox - xInt)));
      ctx.stroke();

      const sProbe = st.px * 4.5 + 0.2;
      const vProbe = (vmax * Math.pow(sProbe, hillN)) / (Math.pow(km, hillN) + Math.pow(sProbe, hillN));
      ctx.fillStyle = C.secondary;
      ctx.beginPath(); ctx.arc(toX(sProbe), toY(vProbe), 5.5, 0, Math.PI * 2); ctx.fill();

      return {
        "Reaction Rate v₀": `${vProbe.toFixed(2)} mM/s`,
        "Fractional Sat θ": `${((vProbe / vmax) * 100).toFixed(1)}%`,
        "Cooperativity n_H": `${hillN.toFixed(2)} (${hillN > 1.05 ? "Positive Sigmoidal" : (hillN < 0.95 ? "Negative" : "Non-cooperative")})`,
        "Specificity V_max/K_m": (vmax / km).toFixed(2),
      };
    },

    // 42. Nernst Galvanic Cell Potential & Concentration Polarization
    chem_nernst_electrochem(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Daniell Galvanic half-cells, salt bridge & e⁻ flow; Right: Nernst E_cell vs log₁₀(Q)", st.spec.formula);
      const eStd = st.v0 !== undefined ? st.v0 : 1.10;
      const logQ = st.v1 !== undefined ? st.v1 : -1.0;
      const nElec = Math.max(1, Math.round(st.v2 || 2));

      const eCell = eStd - (0.05916 / nElec) * logQ;
      const dG = -nElec * 96.485 * eCell; // kJ/mol

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Galvanic Cell Schematic (E_cell = ${eCell.toFixed(3)} V)`);
      st.panel(rx, ly, rw, lh, "Nernst Line E = E° − (59.2mV/n) log₁₀ Q");

      // Two beakers (Anode left, Cathode right)
      const b1x = lx + 24, b2x = lx + lw * 0.56, bw = lw * 0.36, by = ly + lh * 0.44, bh = lh * 0.48;
      ctx.fillStyle = "rgba(124, 156, 255, 0.16)";
      ctx.strokeStyle = C.axis;
      ctx.fillRect(b1x, by, bw, bh); ctx.strokeRect(b1x, by, bw, bh);
      ctx.fillStyle = "rgba(110, 231, 183, 0.16)";
      ctx.fillRect(b2x, by, bw, bh); ctx.strokeRect(b2x, by, bw, bh);

      // Electrodes (Zn Anode, Cu Cathode)
      const e1x = b1x + bw * 0.42, e2x = b2x + bw * 0.42;
      ctx.fillStyle = "#9aa3c7";
      ctx.fillRect(e1x, by - 18, 14, bh * 0.78);
      ctx.fillStyle = "#fdba74";
      ctx.fillRect(e2x, by - 18, 14, bh * 0.78);

      // Salt bridge arch (K⁺ / NO₃⁻)
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(b1x + bw * 0.82, by + 24);
      ctx.lineTo(b1x + bw * 0.82, by - 12);
      ctx.lineTo(b2x + bw * 0.18, by - 12);
      ctx.lineTo(b2x + bw * 0.18, by + 24);
      ctx.stroke();

      // External wire + Digital Voltmeter badge
      const wireY = ly + 36;
      ctx.strokeStyle = C.text;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e1x + 7, by - 18); ctx.lineTo(e1x + 7, wireY);
      ctx.lineTo(e2x + 7, wireY); ctx.lineTo(e2x + 7, by - 18);
      ctx.stroke();

      // Moving electrons along wire
      const dir = eCell >= 0 ? 1 : -1;
      for (let k = 0; k < 5; k++) {
        const u = ((st.t * 0.6 * dir + k * 0.2) % 1 + 1) % 1;
        const ex = (e1x + 7) + u * (e2x - e1x);
        ctx.fillStyle = C.ok;
        ctx.beginPath(); ctx.arc(ex, wireY, 3.5, 0, Math.PI * 2); ctx.fill();
      }

      // Voltmeter circle
      const vcx = (e1x + e2x) * 0.5 + 7;
      ctx.fillStyle = "#161a2e";
      ctx.strokeStyle = C.accent;
      ctx.beginPath(); ctx.arc(vcx, wireY, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.accent;
      ctx.font = "700 9px monospace";
      ctx.fillText(`${eCell.toFixed(2)}V`, vcx - 14, wireY + 3);

      // Right: Nernst linear plot E vs log10(Q) in [-4, +4]
      const baseY = ly + lh - 26;
      const toNX = (lq) => rx + 20 + ((lq + 4) / 8) * (rw - 36);
      const toNY = (ev) => baseY - ((ev + 0.2) / 2.0) * (lh - 56);

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const lq = -4 + (i / 60) * 8;
        const ev = eStd - (0.05916 / nElec) * lq;
        const px = toNX(lq), py = toNY(ev);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curX = toNX(Math.max(-4, Math.min(4, logQ))), curY = toNY(eCell);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(curX, curY, 5.5, 0, Math.PI * 2); ctx.fill();

      return {
        "Cell Voltage E_cell": `${eCell.toFixed(3)} V`,
        "Free Energy ΔG": `${dG.toFixed(1)} kJ/mol`,
        "Nernst Slope": `−${(59.16 / nElec).toFixed(1)} mV/dec`,
        "Spontaneity": eCell > 0 ? "Galvanic (ΔG < 0)" : "Electrolytic / Reversed",
      };
    },

    // 43. LCAO-MO Bonding/Antibonding σ & π Orbital Interference
    chem_molecular_orbital_lcao(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: 2D LCAO wavefunction contour ψ_± = c_A ψ_A ± c_B ψ_B; Right: MO energy splitting diagram", st.spec.formula);
      const R = st.v0 || 1.4; // Internuclear distance Å
      const dChi = st.v1 !== undefined ? st.v1 : 0.2;
      const antiMix = st.v2 !== undefined ? st.v2 : 0.0;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      const isAnti = antiMix > 0.5;
      st.panel(lx, ly, lw, lh, `2D LCAO Orbital Density (${isAnti ? "σ* Antibonding Nodal Plane" : "σ Bonding Constructive Overlap"})`);
      st.panel(rx, ly, rw, lh, "MO Correlation Diagram & Bond Order");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      const sepPx = Math.max(24, Math.min(lw * 0.56, R * 42));
      const xA = cx - sepPx * 0.5, xB = cx + sepPx * 0.5;

      // Overlap integral S_AB = (1 + R + R²/3) exp(-R)
      const Sab = (1 + R + (R * R) / 3) * Math.exp(-R);
      const cA = Math.min(0.85, 0.5 + dChi * 0.2);
      const cB = 1 - cA;

      const NX = 36, NY = 24;
      const cw = (lw - 16) / NX, ch = (lh - 32) / NY;
      for (let gy = 0; gy < NY; gy++) {
        for (let gx = 0; gx < NX; gx++) {
          const px = lx + 8 + (gx + 0.5) * cw;
          const py = ly + 24 + (gy + 0.5) * ch;
          const rA = Math.hypot(px - xA, py - cy) / 38;
          const rB = Math.hypot(px - xB, py - cy) / 38;
          const psi = cA * Math.exp(-rA) + (isAnti ? -1 : 1) * cB * Math.exp(-rB);
          if (Math.abs(psi) > 0.06) {
            ctx.fillStyle = psi > 0 ? `rgba(124,156,255,${Math.min(0.75, psi * 0.85)})` : `rgba(255,143,171,${Math.min(0.75, -psi * 0.85)})`;
            ctx.fillRect(lx + 8 + gx * cw, ly + 24 + gy * ch, cw - 0.5, ch - 0.5);
          }
        }
      }

      // Nodal plane line for σ*
      if (isAnti) {
        ctx.strokeStyle = C.danger;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, ly + 26); ctx.lineTo(cx, ly + lh - 10); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Nuclei A and B
      [{ x: xA, lbl: "A" }, { x: xB, lbl: "B" }].forEach((n) => {
        ctx.fillStyle = C.accent;
        ctx.beginPath(); ctx.arc(n.x, cy, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0f1222";
        ctx.font = "700 9px monospace";
        ctx.fillText(n.lbl, n.x - 3, cy + 3);
      });

      // Right: MO Energy Level Splitting Diagram (AO_A, MO σ/σ*, AO_B)
      const yMid = ly + lh * 0.54;
      const yA = yMid + dChi * 22, yB = yMid - dChi * 22;
      const split = Math.max(12, Sab * 75);
      const yBond = yMid + split * 0.82;
      const yAnti = yMid - split * 1.15; // σ* destabilized more than σ stabilized!

      const xL = rx + 18, xM1 = rx + rw * 0.36, xM2 = rx + rw * 0.64, xR = rx + rw - 18;
      ctx.strokeStyle = C.axis;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xL + 24, yA); ctx.lineTo(xM1, yBond);
      ctx.moveTo(xL + 24, yA); ctx.lineTo(xM1, yAnti);
      ctx.moveTo(xR - 24, yB); ctx.lineTo(xM2, yBond);
      ctx.moveTo(xR - 24, yB); ctx.lineTo(xM2, yAnti);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = C.primary; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(xL, yA); ctx.lineTo(xL + 24, yA);
      ctx.moveTo(xR - 24, yB); ctx.lineTo(xR, yB);
      ctx.stroke();

      ctx.strokeStyle = C.ok;
      ctx.beginPath(); ctx.moveTo(xM1, yBond); ctx.lineTo(xM2, yBond); ctx.stroke();
      ctx.fillStyle = C.ok; ctx.fillText("σ (Bonding)", xM1, yBond + 14);

      ctx.strokeStyle = C.danger;
      ctx.beginPath(); ctx.moveTo(xM1, yAnti); ctx.lineTo(xM2, yAnti); ctx.stroke();
      ctx.fillStyle = C.danger; ctx.fillText("σ* (Antibond)", xM1 - 4, yAnti - 6);

      const nAnti = Math.round(antiMix * 2);
      const bondOrder = 0.5 * (2 - nAnti);
      return {
        "Overlap Integral S_AB": Sab.toFixed(3),
        "Bond Order ½(N_b−N_a)": bondOrder.toFixed(1),
        "Polarity Δχ": dChi.toFixed(2),
        "Orbital Symmetry": isAnti ? "σ*u (1 Nodal Plane)" : "σ_g (Cylindrical)",
      };
    },

    // 44. Eyring Transition-State Theory & Activation Barrier ΔG‡
    chem_arrhenius_eyring_tst(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Intrinsic Reaction Coordinate (IRC) potential barrier ΔG‡ (uncatalyzed vs catalyzed); Right: Eyring plot", st.spec.formula);
      const ea = st.v0 || 55; // kJ/mol
      const tempK = st.v1 || 320;
      const catDrop = st.v2 || 18;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Reaction Coordinate Profile & Transition State [‡]");
      st.panel(rx, ly, rw, lh, "Arrhenius / Eyring Plot ln(k/T) vs 1/T");

      const baseY = ly + lh - 28;
      const drawPES = (barrier, col, dashed) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = dashed ? 2.0 : 2.6;
        if (dashed) ctx.setLineDash([5, 4]);
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const u = i / 80;
          const hump = barrier * Math.exp(-Math.pow((u - 0.48) / 0.18, 2));
          const step = -18 * (1 / (1 + Math.exp(-(u - 0.55) * 14)));
          const eVal = 24 + hump + step;
          const px = lx + 18 + u * (lw - 36);
          const py = baseY - (eVal / 115) * (lh - 56);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };

      const effEa = Math.max(8, ea - catDrop);
      drawPES(ea, C.danger, false);
      drawPES(effEa, C.ok, true);

      // Animated reactant molecule hopping over catalyzed barrier
      const uHop = (st.t * (0.35 + (tempK - 250) * 0.003)) % 1;
      const eHop = 24 + effEa * Math.exp(-Math.pow((uHop - 0.48) / 0.18, 2)) - 18 / (1 + Math.exp(-(uHop - 0.55) * 14));
      const hx = lx + 18 + uHop * (lw - 36);
      const hy = baseY - (eHop / 115) * (lh - 56);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(hx, hy, 5.5, 0, Math.PI * 2); ctx.fill();

      // Double-dagger symbol [‡] at saddle point
      const peakY = baseY - ((24 + ea - 6) / 115) * (lh - 56);
      ctx.fillStyle = C.text;
      ctx.font = "600 11px monospace";
      ctx.fillText(`[‡] ΔG‡ = ${effEa.toFixed(0)} kJ/mol`, lx + lw * 0.34, peakY - 8);

      // Right: Eyring line ln(k/T) vs 1000/T
      const drawEyring = (bar, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const invT = 2.2 + (i / 60) * 1.8; // 1000/T in [2.2, 4.0]
          const lnk = 12 - (bar / 8.314) * (invT * 0.35);
          const px = rx + 16 + (i / 60) * (rw - 32);
          const py = baseY - Math.max(0.05, Math.min(0.95, (lnk + 6) / 16)) * (lh - 56);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      drawEyring(ea, C.danger);
      drawEyring(effEa, C.ok);

      const speedup = Math.exp((catDrop * 1000) / (8.314 * tempK));
      return {
        "Uncatalyzed E_a": `${ea.toFixed(1)} kJ/mol`,
        "Catalyzed Barrier": `${effEa.toFixed(1)} kJ/mol`,
        "Catalytic Speedup": `${speedup > 9999 ? speedup.toExponential(2) : speedup.toFixed(1)}×`,
        "Thermal Energy RT": `${((8.314 * tempK) / 1000).toFixed(2)} kJ/mol`,
      };
    },

    // 45. Lennard-Jones 6-12 Potential & Radial Distribution g(r)
    chem_lennard_jones_md(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Lennard-Jones V_LJ(r) well & anharmonic thermal oscillation; Right: Radial g(r) shells", st.spec.formula);
      const eps = st.v0 || 1.5;
      const sigma = st.v1 || 3.4; // Argon ≈ 3.4 Å
      const ktRatio = st.v2 || 0.35; // kT / ε

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Lennard-Jones 6-12 Potential V(r) = 4ε[(σ/r)¹² − (σ/r)⁶]");
      st.panel(rx, ly, rw, lh, "Pair Correlation Function g(r)");

      const zeroY = ly + lh * 0.46;
      const wellScale = (lh * 0.36) * Math.min(1.3, eps / 1.5);
      const toRX = (rOverSig) => lx + 24 + ((rOverSig - 0.85) / 2.15) * (lw - 42);

      // V = 0 horizontal axis
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(lx + 16, zeroY); ctx.lineTo(lx + lw - 16, zeroY); ctx.stroke();

      // LJ 6-12 Curve
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 100; i++) {
        const u = 0.90 + (i / 100) * 2.1; // r / σ
        const sr6 = Math.pow(1 / u, 6);
        const vOverEps = 4 * (sr6 * sr6 - sr6);
        if (vOverEps <= 1.2) {
          const px = toRX(u);
          const py = zeroY - vOverEps * wellScale;
          if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Equilibrium r_min = 2^(1/6) σ ≈ 1.122 σ and anharmonic oscillation
      const rEq = 1.12246;
      const eLevel = -1.0 + Math.min(0.92, ktRatio);
      // Turning points where 4(x^2 - x) = eLevel => x = (1 ± sqrt(1 + eLevel)) / 2 where x = (σ/r)^6
      const disc = Math.sqrt(Math.max(0, 1 + eLevel));
      const rInner = Math.pow(2 / (1 + disc), 1 / 6);
      const rOuter = Math.pow(2 / Math.max(0.08, 1 - disc), 1 / 6);

      const eY = zeroY - eLevel * wellScale;
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(toRX(rInner), eY); ctx.lineTo(toRX(Math.min(2.9, rOuter)), eY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Vibrating diatomic pair at energy level eY
      const phase = 0.5 + 0.5 * Math.sin(st.t * 3.8);
      const rNow = rInner + phase * (Math.min(2.7, rOuter) - rInner);
      ctx.fillStyle = C.ok;
      ctx.beginPath(); ctx.arc(toRX(0.92), eY, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(toRX(rNow), eY, 7, 0, Math.PI * 2); ctx.fill();

      // Right: Radial Distribution Function g(r) showing solvation shells
      const gBaseY = ly + lh - 26;
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = 0.7 + (i / 90) * 2.8;
        let g = 0;
        if (u > 0.92) {
          const damp = Math.exp(-(u - 1.0) * (0.8 + ktRatio * 1.1));
          g = 1 + (2.2 / Math.max(0.35, ktRatio + 0.3)) * damp * Math.cos(2 * Math.PI * (u - 1.12) / 0.95);
          if (u < 1.05) g *= Math.pow((u - 0.92) / 0.13, 2);
        }
        const px = rx + 14 + (i / 90) * (rw - 28);
        const py = gBaseY - Math.max(0, Math.min(1, g / 3.2)) * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const rMean = 0.5 * (rInner + Math.min(2.6, rOuter)) * sigma;
      return {
        "Equilibrium r_m": `${(rEq * sigma).toFixed(2)} Å (2¹/⁶σ)`,
        "Thermal ⟨r(T)⟩": `${rMean.toFixed(2)} Å (Anharmonic)`,
        "Well Depth ε": `${eps.toFixed(2)} kJ/mol`,
        "Phase State": ktRatio < 0.35 ? "Ordered Solid Shell" : (ktRatio < 0.75 ? "Liquid Solvation" : "Supercritical Gas"),
      };
    },

    // 46. Polyprotic Acid-Base Speciation (αᵢ) & Buffer Capacity β
    chem_buffer_speciation_alpha(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Fractional speciation α₀(H₂A), α₁(HA⁻), α₂(A²⁻) vs pH; Right: Buffer capacity β(pH)", st.spec.formula);
      const pka1 = st.v0 || 4.2;
      const pka2 = Math.max(pka1 + 0.8, st.v1 || 8.8);
      const cTot = st.v2 || 0.25;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Diprotic Speciation Fractions α₀, α₁, α₂ vs pH (0–14)");
      st.panel(rx, ly, rw, lh, "Van Slyke Buffer Capacity β(pH) Peaks at pKₐ");

      const baseY = ly + lh - 26;
      const toPHX = (ph, x0, w0) => x0 + 18 + (ph / 14) * (w0 - 34);
      const k1 = Math.pow(10, -pka1), k2 = Math.pow(10, -pka2);

      const getAlphas = (ph) => {
        const h = Math.pow(10, -ph);
        const den = h * h + k1 * h + k1 * k2;
        return [
          (h * h) / den,
          (k1 * h) / den,
          (k1 * k2) / den,
        ];
      };

      const cols = [C.danger, C.accent, C.primary];
      const names = ["α₀ [H₂A]", "α₁ [HA⁻]", "α₂ [A²⁻]"];
      for (let sp = 0; sp < 3; sp++) {
        ctx.strokeStyle = cols[sp];
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const ph = (i / 100) * 14;
          const al = getAlphas(ph)[sp];
          const px = toPHX(ph, lx, lw);
          const py = baseY - al * (lh - 56);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = cols[sp];
        ctx.font = "600 10px monospace";
        ctx.fillText(names[sp], lx + 24 + sp * 78, ly + 36);
      }

      // Isoelectric / Amphiprotic point pI = ½(pKa1 + pKa2)
      const pI = 0.5 * (pka1 + pka2);
      const piX = toPHX(pI, lx, lw);
      ctx.strokeStyle = C.ok;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(piX, ly + 26); ctx.lineTo(piX, baseY); ctx.stroke();
      ctx.setLineDash([]);

      // Right: Buffer capacity β(pH) = 2.303 * C_T * (α0*α1 + α1*α2)
      ctx.strokeStyle = C.ok;
      ctx.fillStyle = "rgba(110, 231, 183, 0.18)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(toPHX(0, rx, rw), baseY);
      for (let i = 0; i <= 100; i++) {
        const ph = (i / 100) * 14;
        const [a0, a1, a2] = getAlphas(ph);
        const beta = 2.303 * (a0 * a1 + a1 * a2); // max is 2.303 * 0.25 = 0.576 at pH = pKa
        const px = toPHX(ph, rx, rw);
        const py = baseY - (beta / 0.65) * (lh - 56);
        ctx.lineTo(px, py);
      }
      ctx.lineTo(toPHX(14, rx, rw), baseY);
      ctx.fill();
      ctx.stroke();

      const phProbe = st.px * 14;
      const [pa0, pa1, pa2] = getAlphas(phProbe);
      return {
        "Isoelectric pI": pI.toFixed(2),
        "pKₐ₁ / pKₐ₂": `${pka1.toFixed(2)} / ${pka2.toFixed(2)}`,
        "Max β at pKₐ": `${(0.576 * cTot).toFixed(3)} M/pH`,
        "Probe Speciation": `α₀=${(pa0 * 100).toFixed(0)}% α₁=${(pa1 * 100).toFixed(0)}% α₂=${(pa2 * 100).toFixed(0)}%`,
      };
    },

    // 47. Belousov-Zhabotinsky Chemical Oscillator & Oregonator Spiral
    chem_belousov_zhabotinsky(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Excitable Petri dish with rotating Ce⁴⁺/Fe(phen)₃³⁺ spiral waves; Right: Limit cycle", st.spec.formula);
      const fStoich = st.v0 || 1.0;
      const kRate = st.v1 || 1.4;
      const diffD = st.v2 || 0.22;

      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Belousov-Zhabotinsky Petri Dish (Ferroin/Ferriin Spiral)");
      st.panel(rx, ly, rw, lh, "Oregonator Relaxation Oscillations [HBrO₂] & [Ce⁴⁺]");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, dishR = Math.min(lw, lh) * 0.37;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, dishR, 0, Math.PI * 2);
      ctx.clip();

      // Render multi-arm Archimedean spiral redox wave r - k*θ - ω*t
      const G = 28;
      const step = (dishR * 2) / G;
      for (let gy = 0; gy < G; gy++) {
        for (let gx = 0; gx < G; gx++) {
          const px = cx - dishR + (gx + 0.5) * step;
          const py = cy - dishR + (gy + 0.5) * step;
          const r = Math.hypot(px - cx, py - cy);
          const ang = Math.atan2(py - cy, px - cx);
          const wave = Math.sin(r / (8 + diffD * 18) - ang * 2 - st.t * kRate * 2.5);
          // Ferroin (red) vs Ferriin (blue-cyan)
          ctx.fillStyle = wave > 0.15 ? `rgba(103, 232, 249, ${0.35 + 0.55 * wave})` : `rgba(255, 107, 107, ${0.45 - 0.3 * wave})`;
          ctx.fillRect(px - step * 0.5, py - step * 0.5, step + 0.8, step + 0.8);
        }
      }
      ctx.restore();

      ctx.strokeStyle = C.text;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(cx, cy, dishR, 0, Math.PI * 2); ctx.stroke();

      // Right: Relaxation oscillator sawtooth spikes [HBrO2] (activator x) and [Ce4+] (inhibitor z)
      const midY = ly + lh * 0.54;
      const drawOsc = (phaseShift, col, sharp) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const u = (i / 100) * 3.5 + st.t * kRate * 0.35 + phaseShift;
          const cyc = u % 1;
          const val = sharp ? Math.exp(-cyc * 5.5) * Math.sin(cyc * Math.PI * 2) : (cyc < 0.2 ? cyc * 5 : Math.exp(-(cyc - 0.2) * 2.2));
          const px = rx + 14 + (i / 100) * (rw - 28);
          const py = midY + 38 - val * (lh * 0.52);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      drawOsc(0, C.danger, true); // Activator HBrO2 spike
      drawOsc(0.12, C.series[5], false); // Oxidized catalyst Ce4+

      const oscActive = fStoich >= 0.5 && fStoich <= 2.4;
      return {
        "Stoichiometric f": fStoich.toFixed(2),
        "Spiral Wavelength λ": `${(12 + diffD * 28).toFixed(1)} mm`,
        "Oscillation Period": `${(6.2 / kRate).toFixed(1)} s`,
        "Hopf / Limit Cycle": oscActive ? "Sustained Oregonator Limit Cycle" : "Excitable Steady State",
      };
    },

    // 48. Beer-Lambert UV-Vis Spectrophotometry & Isosbestic Point
    chem_beer_lambert_uvvis(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Collimated beam I₀ attenuated through cuvette (ℓ, c); Right: UV-Vis spectra & isosbestic point", st.spec.formula);
      const conc = st.v0 || 1.2; // mM
      const pathL = st.v1 || 1.0; // cm
      const xi = st.v2 !== undefined ? st.v2 : 0.5; // interconversion extent A <-> B

      const lx = 18, ly = 46, lw = W * 0.44, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `UV-Vis Cuvette Bench (ℓ = ${pathL.toFixed(2)} cm, c = ${conc.toFixed(2)} mM)`);
      st.panel(rx, ly, rw, lh, "Absorbance Spectra A(λ) & Invariant Isosbestic Point");

      // Peak absorbance at 520 nm
      const epsIso = 0.42;
      const Aiso = epsIso * conc * pathL;
      const transPct = Math.pow(10, -Aiso) * 100;

      // Left: Light source -> Cuvette -> Photodiode
      const cy = ly + lh * 0.54;
      const cuvW = Math.max(28, pathL * 48);
      const cuvX = lx + lw * 0.5 - cuvW * 0.5;

      // Incident beam I0
      ctx.fillStyle = "rgba(255, 209, 102, 0.55)";
      ctx.fillRect(lx + 18, cy - 16, cuvX - (lx + 18), 32);

      // Exponential attenuation inside cuvette
      const grad = ctx.createLinearGradient(cuvX, cy, cuvX + cuvW, cy);
      grad.addColorStop(0, "rgba(255, 209, 102, 0.55)");
      grad.addColorStop(1, `rgba(255, 209, 102, ${Math.max(0.06, transPct / 180)})`);
      ctx.fillStyle = grad;
      ctx.fillRect(cuvX, cy - 16, cuvW, 32);

      // Cuvette quartz walls & solution tint
      ctx.fillStyle = `rgba(${Math.round(255 * (1 - xi))}, 90, ${Math.round(255 * xi)}, ${Math.min(0.65, conc * 0.25)})`;
      ctx.strokeStyle = C.text;
      ctx.lineWidth = 2;
      ctx.fillRect(cuvX, cy - 42, cuvW, 84);
      ctx.strokeRect(cuvX, cy - 42, cuvW, 84);

      // Transmitted beam I
      ctx.fillStyle = `rgba(255, 209, 102, ${Math.max(0.06, transPct / 180)})`;
      ctx.fillRect(cuvX + cuvW, cy - 16, lx + lw - 24 - (cuvX + cuvW), 32);

      // Right: Family of conversion spectra A <-> B intersecting at exact Isosbestic wavelength
      const baseY = ly + lh - 26;
      const evalSpec = (u, fracB) => {
        const epsA = 0.85 * Math.exp(-Math.pow((u - 0.32) / 0.14, 2));
        const epsB = 0.92 * Math.exp(-Math.pow((u - 0.68) / 0.15, 2));
        return ((1 - fracB) * epsA + fracB * epsB) * conc * pathL * 0.55;
      };

      [0.0, 0.25, 0.5, 0.75, 1.0].forEach((f) => {
        ctx.strokeStyle = "rgba(124, 156, 255, 0.25)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const u = i / 80;
          const px = rx + 16 + u * (rw - 32);
          const py = baseY - Math.min(1, evalSpec(u, f)) * (lh - 56);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Active conversion curve at current ξ
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const px = rx + 16 + u * (rw - 32);
        const py = baseY - Math.min(1, evalSpec(u, xi)) * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Highlight Isosbestic intersection point at u ≈ 0.495 (λ ≈ 498 nm)
      const isoU = 0.495;
      const isoX = rx + 16 + isoU * (rw - 32);
      const isoY = baseY - Math.min(1, evalSpec(isoU, 0.5)) * (lh - 56);
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(isoX, isoY, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillText("Isosbestic λ_iso=498nm", isoX - 48, isoY - 10);

      return {
        "Absorbance A(λ_iso)": Aiso.toFixed(3),
        "Transmittance %T": `${transPct.toFixed(1)}%`,
        "Conversion Extent ξ": `${(xi * 100).toFixed(0)}% B`,
        "Beer-Lambert Law": Aiso < 2.0 ? "Linear Regime (A < 2)" : "Stray-Light Deviation",
      };
    },

    // 49. Chromatographic Elution & Van Deemter Plate Height (HETP)
    chem_chromatography_van_deemter(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Co-eluting Gaussian analyte peaks & resolution R_s; Right: Van Deemter H(u) = A + B/u + C·u", st.spec.formula);
      const uFlow = st.v0 || 1.6; // cm/s
      const alphaSel = st.v1 || 1.25; // k2'/k1'
      const cMass = st.v2 || 0.25;

      const A = 0.35, B = 0.85, Cterm = cMass;
      const Hplate = A + B / Math.max(0.2, uFlow) + Cterm * uFlow;
      const uOpt = Math.sqrt(B / Math.max(0.05, Cterm));
      const hMin = A + 2 * Math.sqrt(B * Cterm);

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Chromatogram Elution Profile I(t) & Peak Resolution R_s");
      st.panel(rx, ly, rw, lh, "Van Deemter Curve H(u) = A + B/u + C·u");

      const baseY = ly + lh - 26;
      const tR1 = 0.36;
      const tR2 = Math.min(0.84, tR1 * alphaSel);
      const sigPeak = 0.045 * Math.sqrt(Hplate);

      const drawPeak = (center, col) => {
        ctx.strokeStyle = col;
        ctx.fillStyle = col === C.primary ? "rgba(124,156,255,0.22)" : "rgba(255,143,171,0.22)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(lx + 14, baseY);
        for (let i = 0; i <= 100; i++) {
          const t = i / 100;
          const y = Math.exp(-0.5 * Math.pow((t - center) / sigPeak, 2));
          ctx.lineTo(lx + 14 + t * (lw - 28), baseY - y * (lh - 64));
        }
        ctx.lineTo(lx + lw - 14, baseY);
        ctx.fill();
        ctx.stroke();
      };
      drawPeak(tR1, C.primary);
      drawPeak(tR2, C.secondary);

      // Right: Van Deemter curve + Eddy (A), Longitudinal (B/u), Mass Transfer (Cu) components
      const toVX = (u) => rx + 16 + ((u - 0.2) / 3.8) * (rw - 32);
      const toVY = (h) => baseY - Math.min(1, h / 3.2) * (lh - 56);

      // Component dashed lines
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(toVX(0.2), toVY(A)); ctx.lineTo(toVX(4.0), toVY(A));
      ctx.moveTo(toVX(0.2), toVY(Cterm * 0.2)); ctx.lineTo(toVX(4.0), toVY(Cterm * 4.0));
      ctx.stroke();
      ctx.setLineDash([]);

      // Total H(u)
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = 0.25 + (i / 80) * 3.75;
        const h = A + B / u + Cterm * u;
        const px = toVX(u), py = toVY(h);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current operating point vs Optimal u_opt
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(toVX(uFlow), toVY(Hplate), 5.5, 0, Math.PI * 2); ctx.fill();

      const Rs = (tR2 - tR1) / (4 * sigPeak);
      const Nplates = Math.round(1500 / Hplate);
      return {
        "Plate Height HETP": `${Hplate.toFixed(2)} mm (N=${Nplates})`,
        "Optimal Velocity u*": `${uOpt.toFixed(2)} cm/s (H_min=${hMin.toFixed(2)})`,
        "Resolution R_s": `${Rs.toFixed(2)} (${Rs >= 1.5 ? "Baseline Resolved" : "Overlapping Co-elution"})`,
        "Selectivity α": alphaSel.toFixed(2),
      };
    },

    // 50. Born-Haber Thermochemical Cycle & Kapustinskii Lattice Energy
    chem_born_haber_lattice(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Born-Haber Enthalpy Ladder (ΔH_sub, IE, ½BDE, EA, U_lat); Right: Ionic Rock-Salt Lattice", st.spec.formula);
      const zProd = st.v0 || 1.0; // |z+ z-|
      const r0 = st.v1 || 2.8; // r+ + r- (Å)
      const ieGap = st.v2 || 140; // IE + EA net endothermic step

      // Kapustinskii lattice energy U_lat (exothermic, kJ/mol)
      const uLat = -Math.round((1214 * 2 * zProd) / r0 * (1 - 0.345 / r0));
      const dhSub = 108, halfBDE = 121;
      const dhPeak = dhSub + halfBDE + ieGap;
      const dhForm = dhPeak + uLat;

      const lx = 18, ly = 46, lw = W * 0.56, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Born-Haber Hess's Law Enthalpy Ladder (kJ/mol)");
      st.panel(rx, ly, rw, lh, "Madelung Ionic Crystal Lattice (M⁺X⁻)");

      const zeroY = ly + lh * 0.58;
      const scE = (lh * 0.36) / 650;
      const toEY = (e) => zeroY - e * scE;

      // Standard state reference line ΔH = 0: M(s) + ½ X₂(g)
      ctx.strokeStyle = C.axis;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(lx + 14, zeroY); ctx.lineTo(lx + lw - 14, zeroY); ctx.stroke();
      ctx.setLineDash([]);

      const steps = [
        { lbl: "M(s)+½X₂", e: 0, x: lx + 20 },
        { lbl: "+ΔH_sub+½D", e: dhSub + halfBDE, x: lx + lw * 0.28 },
        { lbl: "M⁺(g)+X⁻(g)", e: dhPeak, x: lx + lw * 0.54 },
        { lbl: "MX(s) Crystal", e: dhForm, x: lx + lw * 0.78 },
      ];

      steps.forEach((s, i) => {
        const y = toEY(s.e);
        ctx.strokeStyle = C.text;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(s.x, y); ctx.lineTo(s.x + 48, y); ctx.stroke();
        ctx.fillStyle = C.text;
        ctx.font = "600 9px monospace";
        ctx.fillText(s.lbl, s.x, y - 6);

        if (i < steps.length - 1) {
          const nextY = toEY(steps[i + 1].e);
          const arrowX = s.x + 44;
          ctx.strokeStyle = steps[i + 1].e > s.e ? C.danger : C.ok;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(arrowX, y); ctx.lineTo(steps[i + 1].x + 6, nextY);
          ctx.stroke();
        }
      });

      // Right: 4x4 Alternating Cation M+ / Anion X- Crystal Grid scaled by r0
      const rcx = rx + rw * 0.5, rcy = ly + lh * 0.54;
      const spacing = Math.min(34, 14 + r0 * 5.2);
      for (let r = -1.5; r <= 1.5; r += 1) {
        for (let c = -1.5; c <= 1.5; c += 1) {
          const isCat = ((Math.round(r + 1.5) + Math.round(c + 1.5)) % 2 === 0);
          const ix = rcx + c * spacing, iy = rcy + r * spacing;
          ctx.fillStyle = isCat ? C.primary : C.ok;
          ctx.beginPath();
          ctx.arc(ix, iy, isCat ? 6 : 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      return {
        "Lattice Energy U_lat": `${uLat} kJ/mol`,
        "Formation ΔH°_f": `${dhForm} kJ/mol`,
        "Madelung Constant M": "1.7476 (NaCl Rock-Salt)",
        "Kapustinskii Scaling": `∝ |z₊z₋| / r₀ = ${(zProd / r0).toFixed(2)}`,
      };
    },

    // 51. Binary Vapor-Liquid Equilibrium, Raoult's Law & Azeotropes
    chem_phase_diagram_raoult(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Binary T-x-y / P-x-y Bubble & Dew Lens with McCabe-Thiele steps; Right: y₁ vs x₁ curve", st.spec.formula);
      const alpha = st.v0 || 2.4; // Relative volatility
      const margA = st.v1 !== undefined ? st.v1 : 0.2;
      const reflux = st.v2 || 2.0;

      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Binary Vapor-Liquid Lens (Bubble & Dew Curves)");
      st.panel(rx, ly, rw, lh, "McCabe-Thiele Equilibrium y₁(x₁) & Stages");

      const calcY = (x) => {
        const effAlpha = alpha * Math.exp(margA * (1 - 2 * x));
        return (effAlpha * x) / (1 + (effAlpha - 1) * x);
      };

      const baseY = ly + lh - 26;
      // Left: T-x-y lens (Bubble curve bottom, Dew curve top)
      const toLX = (x) => lx + 20 + x * (lw - 36);
      const toLY = (tNorm) => baseY - tNorm * (lh - 56);

      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = i / 80;
        const tBub = 1 - x - 0.18 * margA * x * (1 - x);
        const px = toLX(x), py = toLY(tBub);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = C.secondary;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = i / 80;
        const y = calcY(x);
        const tBub = 1 - x - 0.18 * margA * x * (1 - x);
        const px = toLX(y), py = toLY(tBub);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Horizontal Tie-Line at probe x
      const xProbe = Math.max(0.1, Math.min(0.85, st.px));
      const yProbe = calcY(xProbe);
      const tTie = 1 - xProbe - 0.18 * margA * xProbe * (1 - xProbe);
      ctx.strokeStyle = C.accent;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(toLX(xProbe), toLY(tTie));
      ctx.lineTo(toLX(yProbe), toLY(tTie));
      ctx.stroke();
      ctx.setLineDash([]);

      // Right: McCabe-Thiele y vs x diagram with 45° diagonal and theoretical plate staircase
      const toMX = (x) => rx + 20 + x * (rw - 36);
      const toMY = (y) => baseY - y * (lh - 56);

      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(toMX(0), toMY(0)); ctx.lineTo(toMX(1), toMY(1)); ctx.stroke();

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = i / 80;
        const px = toMX(x), py = toMY(calcY(x));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // McCabe-Thiele staircase from x = 0.12 to 0.90
      let xc = 0.12, stages = 0;
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(toMX(xc), toMY(xc));
      while (xc < 0.88 && stages < 8) {
        const yc = calcY(xc);
        if (yc <= xc + 0.015) break;
        ctx.lineTo(toMX(xc), toMY(yc));
        const xNext = Math.min(0.92, (yc - 0.08 / (reflux + 1)) * ((reflux + 1) / (reflux + 0.85)));
        ctx.lineTo(toMX(xNext), toMY(yc));
        xc = xNext;
        stages++;
      }
      ctx.stroke();

      const hasAzeo = Math.abs(margA) > Math.log(alpha);
      return {
        "Vapor Enrichment y₁": `${(yProbe * 100).toFixed(1)}% (from ${(xProbe * 100).toFixed(0)}%)`,
        "Theoretical Plates N": `${stages} McCabe-Thiele stages`,
        "Margules Non-Ideality": `A₁₂ = ${margA.toFixed(2)}`,
        "Azeotrope Status": hasAzeo ? "AZEOTROPE FORMED (y₁ = x₁)!" : "Zeotropic Separable",
      };
    },

    // 52. Crystal Field Splitting (Δₒ / Δₜ) & High-Spin / Low-Spin Crossover
    chem_crystal_field_splitting(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Octahedral t₂g / e_g d-orbital splitting & Hund/Pauli spin filling; Right: d_x²-y² lobes", st.spec.formula);
      const deltaO = st.v0 || 1.8; // Ligand field Δ_o relative to pairing P = 1.75
      const dCount = Math.max(1, Math.min(9, Math.round(st.v1 || 6)));
      const jtStretch = st.v2 || 0.0;

      const P = 1.75;
      const isLowSpin = deltaO > P && dCount >= 4 && dCount <= 7;

      // Distribute dCount electrons into 3 t2g orbitals and 2 eg orbitals
      const t2g = [0, 0, 0], eg = [0, 0];
      let rem = dCount;
      // First 3 go singly into t2g
      for (let i = 0; i < 3 && rem > 0; i++, rem--) t2g[i]++;
      if (isLowSpin) {
        for (let i = 0; i < 3 && rem > 0; i++, rem--) t2g[i]++;
        for (let i = 0; i < 2 && rem > 0; i++, rem--) eg[i]++;
        for (let i = 0; i < 2 && rem > 0; i++, rem--) eg[i]++;
      } else {
        for (let i = 0; i < 2 && rem > 0; i++, rem--) eg[i]++;
        for (let i = 0; i < 3 && rem > 0; i++, rem--) t2g[i]++;
        for (let i = 0; i < 2 && rem > 0; i++, rem--) eg[i]++;
      }

      const nT2g = t2g[0] + t2g[1] + t2g[2];
      const nEg = eg[0] + eg[1];
      let unpaired = 0;
      t2g.concat(eg).forEach((occ) => { if (occ === 1) unpaired++; });
      const muSpinOnly = Math.sqrt(unpaired * (unpaired + 2));
      const cfse = (-0.4 * nT2g + 0.6 * nEg) * deltaO;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Octahedral d${dCount} Splitting (${isLowSpin ? "Low-Spin Strong Field" : "High-Spin Weak Field"})`);
      st.panel(rx, ly, rw, lh, "Octahedral Ligand Cage [ML₆] & d-Orbital Lobes");

      const baryY = ly + lh * 0.56;
      const splitPx = Math.min(lh * 0.34, deltaO * 36);
      const yEg = baryY - 0.6 * splitPx;
      const yT2g = baryY + 0.4 * splitPx;

      // Barycenter dashed line
      ctx.strokeStyle = C.axis;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(lx + 18, baryY); ctx.lineTo(lx + lw - 18, baryY); ctx.stroke();
      ctx.setLineDash([]);

      const drawOrbitalSlot = (ox, oy, occ, lbl) => {
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(ox - 16, oy); ctx.lineTo(ox + 16, oy); ctx.stroke();
        ctx.fillStyle = C.muted;
        ctx.font = "9px monospace";
        ctx.fillText(lbl, ox - 14, oy + 13);

        // Spin-up arrow ↑
        if (occ >= 1) {
          ctx.strokeStyle = C.accent;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ox - 5, oy + 7); ctx.lineTo(ox - 5, oy - 11);
          ctx.lineTo(ox - 9, oy - 6);
          ctx.stroke();
        }
        // Spin-down arrow ↓
        if (occ >= 2) {
          ctx.strokeStyle = C.secondary;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ox + 5, oy - 11); ctx.lineTo(ox + 5, oy + 7);
          ctx.lineTo(ox + 9, oy + 2);
          ctx.stroke();
        }
      };

      const eNames = ["dz²", "dx²-y²"];
      eg.forEach((occ, i) => {
        const jtShift = (i === 0 ? -1 : 1) * jtStretch * 14;
        drawOrbitalSlot(lx + lw * 0.36 + i * 74, yEg + jtShift, occ, eNames[i]);
      });

      const tNames = ["dxy", "dxz", "dyz"];
      t2g.forEach((occ, i) => {
        drawOrbitalSlot(lx + lw * 0.24 + i * 66, yT2g, occ, tNames[i]);
      });

      // Right: Cloverleaf d-orbital lobes + 6 octahedral ligands
      const rcx = rx + rw * 0.5, rcy = ly + lh * 0.54, arm = Math.min(rw, lh) * 0.30;
      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2 + Math.PI / 4;
        ctx.save();
        ctx.translate(rcx, rcy);
        ctx.rotate(ang);
        ctx.fillStyle = k % 2 === 0 ? "rgba(124, 156, 255, 0.35)" : "rgba(255, 143, 171, 0.35)";
        ctx.strokeStyle = k % 2 === 0 ? C.primary : C.secondary;
        ctx.beginPath();
        ctx.ellipse(arm * 0.45, 0, arm * 0.42, arm * 0.18, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      // 4 in-plane ligands along axes
      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2;
        ctx.fillStyle = C.ok;
        ctx.beginPath();
        ctx.arc(rcx + arm * 0.92 * Math.cos(ang), rcy + arm * 0.92 * Math.sin(ang), 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      return {
        "Configuration": `t₂g^${nT2g} e_g^${nEg} (${isLowSpin ? "Low Spin" : "High Spin"})`,
        "Unpaired e⁻ / μ_eff": `${unpaired} e⁻ (${muSpinOnly.toFixed(2)} μ_B)`,
        "CFSE Stabilization": `${cfse.toFixed(2)} Δ_o`,
        "Spin Crossover": deltaO > P ? "Δ_o > P (Strong-Field)" : "Δ_o < P (Weak-Field)",
      };
    },

    // 53. ¹H NMR Chemical Shift δ & J-Coupling Multiplet Pascal Triangle
    chem_nmr_spin_coupling(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Free Induction Decay FID(t); Right: FT-NMR (n+1) Pascal Multiplet & Splitting Tree", st.spec.formula);
      const jHz = st.v0 || 7.2;
      const nNeighbors = Math.max(0, Math.min(6, Math.round(st.v1 !== undefined ? st.v1 : 3)));
      const b0MHz = st.v2 || 400;

      // Binomial coefficients C(n, k) for Pascal's triangle multiplet
      const coeffs = [1];
      for (let k = 1; k <= nNeighbors; k++) {
        coeffs[k] = (coeffs[k - 1] * (nNeighbors - k + 1)) / k;
      }
      const maxC = Math.max(...coeffs);

      const lx = 18, ly = 46, lw = W * 0.45, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      const multNames = ["Singlet (1)", "Doublet (1:1)", "Triplet (1:2:1)", "Quartet (1:3:3:1)", "Quintet (1:4:6:4:1)", "Sextet", "Septet"];
      st.panel(lx, ly, lw, lh, "Time-Domain Free Induction Decay FID(t)");
      st.panel(rx, ly, rw, lh, `¹H NMR ${multNames[nNeighbors]} (n=${nNeighbors}, ³J=${jHz.toFixed(1)} Hz)`);

      // Left: Damped beat-modulated FID signal
      const midY = ly + lh * 0.54;
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const t = (i / 140) * 3.0;
        const env = Math.exp(-t * 1.1) * Math.pow(Math.cos(jHz * 0.35 * t), nNeighbors);
        const y = env * Math.cos(24 * t - st.t * 4);
        const px = lx + 14 + (i / 140) * (lw - 28);
        const py = midY - y * (lh * 0.36);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Right: Lorentzian multiplet peaks + splitting tree at top
      const baseY = ly + lh - 26;
      const rcx = rx + rw * 0.5;
      const jPx = Math.min(26, 8 + (jHz / b0MHz) * 750);

      // Splitting tree diagram at top of right panel
      const treeTop = ly + 34;
      for (let lvl = 0; lvl <= nNeighbors; lvl++) {
        const yLvl = treeTop + (lvl / Math.max(1, nNeighbors)) * (lh * 0.25);
        for (let k = 0; k <= lvl; k++) {
          const xNode = rcx + (k - lvl * 0.5) * jPx;
          ctx.fillStyle = C.accent;
          ctx.beginPath(); ctx.arc(xNode, yLvl, 2.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Lorentzian multiplet lines
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const px = rx + 16 + (i / 120) * (rw - 32);
        let sig = 0;
        coeffs.forEach((cVal, k) => {
          const peakX = rcx + (k - nNeighbors * 0.5) * jPx;
          const dx = (px - peakX) / 3.2;
          sig += (cVal / maxC) / (1 + dx * dx);
        });
        const py = baseY - Math.min(1, sig) * (lh * 0.52);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Multiplet Pattern": multNames[nNeighbors],
        "Pascal Intensity Ratio": coeffs.join(" : "),
        "Coupling Constant ³J": `${jHz.toFixed(1)} Hz (${((jHz / b0MHz) * 1e6 * 1e-6).toFixed(3)} ppm)`,
        "Spectrometer B₀": `${b0MHz.toFixed(0)} MHz`,
      };
    },

    // 54. Morse Anharmonic Oscillator & Rovibrational IR Overtones
    chem_ir_anharmonic_morse(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Dissociative Morse potential V(r) vs harmonic parabola & v rungs; Right: IR P/R branches", st.spec.formula);
      const De = st.v0 || 4.5; // eV
      const aWidth = st.v1 || 1.8;
      const xe = st.v2 || 0.035;

      const lx = 18, ly = 46, lw = W * 0.54, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, "Morse Potential V(r) = D_e(1 − e^{−a(r−r_e)})² vs Harmonic");
      st.panel(rx, ly, rw, lh, "Rovibrational IR Spectrum (P & R Branches)");

      const baseY = ly + lh - 24;
      const dePx = (lh - 58) * Math.min(1, De / 5.5);
      const toRX = (r) => lx + 20 + ((r - 0.5) / 2.8) * (lw - 36);
      const toVY = (vNorm) => baseY - vNorm * dePx;

      // Dissociation asymptote V = D_e
      ctx.strokeStyle = C.danger;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(lx + 20, toVY(1)); ctx.lineTo(lx + lw - 16, toVY(1)); ctx.stroke();

      // Harmonic parabola (dashed muted)
      ctx.strokeStyle = "rgba(124, 156, 255, 0.35)";
      ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const r = 0.55 + (i / 70) * 1.6;
        const vHarm = Math.pow(aWidth * (r - 1.0), 2);
        if (vHarm <= 1.15) {
          const px = toRX(r), py = toVY(vHarm);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Exact Morse Potential curve
      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const r = 0.55 + (i / 90) * 2.6;
        const vMorse = Math.pow(1 - Math.exp(-aWidth * (r - 1.0)), 2);
        if (vMorse <= 1.18) {
          const px = toRX(r), py = toVY(vMorse);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Vibrational levels G(v) converging near D_e
      for (let v = 0; v < 7; v++) {
        const gNorm = 0.18 * (v + 0.5) * (1 - xe * 2.2 * (v + 0.5));
        if (gNorm > 0.96 || gNorm <= 0) break;
        const root = Math.sqrt(gNorm);
        const rMin = 1.0 - Math.log(1 + root) / aWidth;
        const rMax = 1.0 - Math.log(Math.max(0.05, 1 - root)) / aWidth;
        const yV = toVY(gNorm);
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(toRX(rMin), yV); ctx.lineTo(toRX(Math.min(3.1, rMax)), yV);
        ctx.stroke();
      }

      // Right: Rovibrational P-branch (ΔJ = -1) and R-branch (ΔJ = +1) stick spectrum
      const rcx = rx + rw * 0.5;
      for (let J = 0; J < 7; J++) {
        const pPop = (2 * J + 1) * Math.exp(-J * (J + 1) * 0.08);
        const hStick = (pPop / 3.2) * (lh - 64);
        // P branch (left of band origin) and R branch (right of band origin)
        const xP = rcx - (J + 1) * 11;
        const xR = rcx + (J + 1) * 10;
        ctx.strokeStyle = C.secondary;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(xP, baseY); ctx.lineTo(xP, baseY - hStick); ctx.stroke();
        ctx.strokeStyle = C.primary;
        ctx.beginPath(); ctx.moveTo(xR, baseY); ctx.lineTo(xR, baseY - hStick); ctx.stroke();
      }

      const d0 = De * (1 - 0.09 * (1 - 0.5 * xe));
      return {
        "Spectroscopic D_e": `${De.toFixed(2)} eV`,
        "Zero-Point Corrected D₀": `${d0.toFixed(2)} eV`,
        "Fundamental vs Overtone": `Δv=1, 2 (x_e = ${xe.toFixed(3)})`,
        "Rotational Branches": "P (ΔJ=−1) & R (ΔJ=+1)",
      };
    },

    // 55. Langmuir & BET Surface Adsorption Isotherms
    chem_langmuir_bet_adsorption(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Catalytic surface lattice with monolayer/multilayer adatoms; Right: Langmuir vs BET θ(P)", st.spec.formula);
      const kEq = st.v0 || 2.2;
      const tempT = st.v1 || 300;
      const cBET = st.v2 || 0.0; // multilayer factor

      const pNorm = 0.55;
      const kEff = kEq * (300 / Math.max(150, tempT));
      const thetaLang = (kEff * pNorm) / (1 + kEff * pNorm);

      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Catalytic Surface Sites (Monolayer θ = ${(thetaLang * 100).toFixed(0)}%)`);
      st.panel(rx, ly, rw, lh, "Langmuir Monolayer vs BET Multilayer Isotherm");

      // Draw 12 catalytic metal binding sites at bottom of left panel
      const surfY = ly + lh - 28;
      const numSites = 12;
      const siteW = (lw - 28) / numSites;
      for (let i = 0; i < numSites; i++) {
        const sx = lx + 14 + (i + 0.5) * siteW;
        ctx.fillStyle = "#3b426b";
        ctx.fillRect(sx - siteW * 0.4, surfY, siteW * 0.8, 12);

        // Monolayer adatom occupancy
        const occ1 = ((Math.sin(i * 4.3 + Math.floor(st.t * 1.5)) + 1) * 0.5) < thetaLang;
        if (occ1) {
          ctx.fillStyle = C.ok;
          ctx.beginPath(); ctx.arc(sx, surfY - 8, 6.5, 0, Math.PI * 2); ctx.fill();
          // Second BET layer adatom
          if (cBET > 0.25 && (i % 3 === 0)) {
            ctx.fillStyle = C.accent;
            ctx.beginPath(); ctx.arc(sx, surfY - 21, 5.5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      // Gas-phase impinging molecules above surface
      for (let g = 0; g < 10; g++) {
        const gx = lx + 24 + ((g * 43 + st.t * 36 * (g % 2 ? 1 : -1)) % (lw - 48) + (lw - 48)) % (lw - 48);
        const gy = ly + 38 + ((g * 29 + st.t * 28) % (lh - 95));
        ctx.fillStyle = C.primary;
        ctx.beginPath(); ctx.arc(gx, gy, 4, 0, Math.PI * 2); ctx.fill();
      }

      // Right: Langmuir Type I vs BET Type II isotherm curves vs P/P0
      const baseY = ly + lh - 26;
      const drawIso = (isBET, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const x = (i / 80) * 0.88; // P / P0
          let th = (kEff * x) / (1 + kEff * x);
          if (isBET && cBET > 0.05) {
            th = (kEff * x) / ((1 - x * 0.85 * Math.min(1, cBET)) * (1 + (kEff - 1) * x));
          }
          const px = rx + 16 + (i / 80) * (rw - 32);
          const py = baseY - Math.min(1, th / 2.2) * (lh - 56);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      drawIso(false, C.ok);
      if (cBET > 0.05) drawIso(true, C.accent);

      return {
        "Surface Coverage θ": `${(thetaLang * 100).toFixed(1)}%`,
        "Effective K_ads(T)": kEff.toFixed(2),
        "Vacant Site Fraction": `${((1 - thetaLang) * 100).toFixed(1)}%`,
        "Isotherm Type": cBET > 0.2 ? "IUPAC Type II (BET Multilayer)" : "IUPAC Type I (Langmuir)",
      };
    },

    // 56. Debye-Hückel Ionic Atmosphere & Activity Coefficients γ±
    chem_debye_huckel_ionic(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Central cation & counter-ion screening cloud (radius κ⁻¹); Right: log₁₀ γ± vs √I", st.spec.formula);
      const I = Math.max(0.002, st.v0 || 0.05); // Ionic strength mol/L
      const zProd = Math.max(1, Math.round(st.v1 || 1)); // |z+ z-|
      const a0 = st.v2 || 4.0; // Hydrated ion size Å

      const sqrtI = Math.sqrt(I);
      const kappaInv = 3.04 / sqrtI; // Debye length in Å at 298 K in water
      const logGammaLim = -0.509 * zProd * sqrtI;
      const logGammaExt = (-0.509 * zProd * sqrtI) / (1 + 0.328 * a0 * sqrtI);
      const gammaMean = Math.pow(10, logGammaExt);

      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Debye-Hückel Ionic Atmosphere (κ⁻¹ = ${kappaInv.toFixed(1)} Å)`);
      st.panel(rx, ly, rw, lh, "Debye-Hückel Plot log₁₀ γ± vs √I");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      const debyePx = Math.max(22, Math.min(Math.min(lw, lh) * 0.38, kappaInv * 3.2));

      // Screening cloud halo
      const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, debyePx);
      grad.addColorStop(0, "rgba(110, 231, 183, 0.38)");
      grad.addColorStop(1, "rgba(110, 231, 183, 0.0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, debyePx, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = C.ok;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.arc(cx, cy, debyePx, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting counter-ions (anions −) and co-ions (+)
      for (let k = 0; k < 14; k++) {
        const isCounter = k < 11;
        const rOrb = (0.35 + (k % 4) * 0.22) * debyePx;
        const ang = (k * 2.4) + st.t * (isCounter ? 0.9 : -0.6);
        const ix = cx + rOrb * Math.cos(ang), iy = cy + rOrb * Math.sin(ang);
        ctx.fillStyle = isCounter ? C.ok : C.danger;
        ctx.beginPath(); ctx.arc(ix, iy, 4, 0, Math.PI * 2); ctx.fill();
      }

      // Central cation M^{z+}
      ctx.fillStyle = C.danger;
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 10px monospace";
      ctx.fillText("+", cx - 3, cy + 4);

      // Right: Limiting Law (dashed straight line) vs Extended Debye-Hückel curve vs √I
      const topZeroY = ly + 40;
      const toSX = (si) => rx + 20 + (si / 0.6) * (rw - 36);
      const toGY = (lg) => topZeroY - lg * (lh - 70);

      // Limiting straight line
      ctx.strokeStyle = "rgba(255, 107, 107, 0.55)";
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(toSX(0), toGY(0));
      ctx.lineTo(toSX(0.55), toGY(-0.509 * zProd * 0.55));
      ctx.stroke();
      ctx.setLineDash([]);

      // Extended Debye-Hückel curve
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const si = (i / 70) * 0.55;
        const lg = (-0.509 * zProd * si) / (1 + 0.328 * a0 * si);
        const px = toSX(si), py = toGY(lg);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.arc(toSX(Math.min(0.55, sqrtI)), toGY(logGammaExt), 5.5, 0, Math.PI * 2); ctx.fill();

      return {
        "Debye Length κ⁻¹": `${kappaInv.toFixed(2)} Å`,
        "Activity Coeff γ±": gammaMean.toFixed(3),
        "Limiting vs Extended": `${logGammaLim.toFixed(3)} vs ${logGammaExt.toFixed(3)}`,
        "Ionic Strength I": `${I.toFixed(3)} mol/L`,
      };
    },

    // 57. Polymer Chain Conformation, Radius of Gyration & Flory-Huggins χ
    chem_polymer_flory_huggins(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: 2D Polymer Chain & Radius of Gyration R_g circle; Right: Flory-Huggins ΔG_mix(φ) spinodal", st.spec.formula);
      const chi = st.v0 !== undefined ? st.v0 : 0.45;
      const Ndeg = Math.max(15, Math.round(st.v1 || 45));
      const bStiff = st.v2 || 1.0;

      // Flory exponent ν: Good solvent (χ < 0.5) ν=0.588, Theta (χ ≈ 0.5) ν=0.50, Poor (χ > 0.5) ν=0.33 globule
      const nu = chi < 0.45 ? 0.588 : (chi <= 0.55 ? 0.50 : 0.33);
      const lx = 18, ly = 46, lw = W * 0.50, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      const solvState = chi < 0.45 ? "Swollen Coil (Good Solvent)" : (chi <= 0.55 ? "Ideal Random Walk (Θ-Solvent)" : "Collapsed Globule (Poor Solvent)");
      st.panel(lx, ly, lw, lh, `Polymer Chain Conformation: ${solvState}`);
      st.panel(rx, ly, rw, lh, "Flory-Huggins Free Energy ΔG_m(φ) / RT");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      const rgPx = Math.min(Math.min(lw, lh) * 0.36, 5.2 * bStiff * Math.pow(Ndeg, nu * 0.85));

      // Radius of gyration R_g halo
      ctx.strokeStyle = C.accent;
      ctx.fillStyle = "rgba(255, 209, 102, 0.10)";
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.arc(cx, cy, rgPx, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);

      // Draw Ndeg monomer beads along self-avoiding/collapsed chain
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const beads = [];
      for (let i = 0; i < Ndeg; i++) {
        const u = i / Ndeg;
        const ang = i * 0.65 + 0.35 * Math.sin(i * 1.7 + st.t * 1.4);
        const r = rgPx * (0.25 + 0.72 * Math.sin(u * Math.PI * 2.5 + st.t * 0.6));
        const bx = cx + r * Math.cos(ang), by = cy + r * Math.sin(ang);
        beads.push({ x: bx, y: by });
        if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
      }
      ctx.stroke();

      beads.forEach((b, i) => {
        if (i % 2 === 0) {
          ctx.fillStyle = i === 0 || i === Ndeg - 1 ? C.danger : C.ok;
          ctx.beginPath(); ctx.arc(b.x, b.y, 3.2, 0, Math.PI * 2); ctx.fill();
        }
      });

      // Right: Flory-Huggins ΔG_m / RT = (φ/N) ln φ + (1-φ) ln(1-φ) + χ φ (1-φ)
      const zeroY = ly + lh * 0.44;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(rx + 14, zeroY); ctx.lineTo(rx + rw - 14, zeroY); ctx.stroke();

      ctx.strokeStyle = chi > 0.6 ? C.danger : C.ok;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 1; i <= 79; i++) {
        const phi = i / 80;
        const dg = (phi / 8) * Math.log(phi) + (1 - phi) * Math.log(1 - phi) + chi * 2.2 * phi * (1 - phi);
        const px = rx + 16 + phi * (rw - 32);
        const py = zeroY - dg * (lh * 0.95);
        if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Flory Exponent ν": `ν = ${nu.toFixed(3)} (R_g ∝ N^ν)`,
        "Radius of Gyration R_g": `${(rgPx * 0.4).toFixed(1)} nm`,
        "Interaction Param χ": `${chi.toFixed(2)} (χ_c ≈ 0.50)`,
        "Phase Miscibility": chi <= 0.55 ? "Single Homogeneous Phase" : "Spinodal Phase Separation",
      };
    },

    // 58. Cyclic Voltammetry Duck Curve & Randles-Ševčík Diffusion
    chem_cyclic_voltammetry_randles(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Cyclic Voltammogram I(E) 'Duck Curve' (E_pa, E_pc); Right: Nernst diffusion layer C(x,t)", st.spec.formula);
      const scanV = st.v0 || 0.5; // V/s
      const k0 = st.v1 || 0.1; // cm/s
      const diffD = st.v2 || 0.8;

      const ipScale = Math.sqrt(scanV * diffD);
      const deltaEp = 59 + Math.round(18 / Math.max(0.08, k0 * 4)); // mV

      const lx = 18, ly = 46, lw = W * 0.56, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Cyclic Voltammogram (ΔE_p = ${deltaEp} mV, i_p ∝ v^{1/2})`);
      st.panel(rx, ly, rw, lh, "Electrode Diffusion Layer C_Red(x) & C_Ox(x)");

      const midY = ly + lh * 0.54;
      ctx.strokeStyle = C.axis;
      ctx.beginPath(); ctx.moveTo(lx + 16, midY); ctx.lineTo(lx + lw - 16, midY); ctx.stroke();

      const sep = (deltaEp / 260) * 0.22;
      const evalDuck = (u, forward) => {
        // u in [-1, 1] represents potential E - E0'
        if (forward) {
          const d = (u - sep) * 4.2;
          const peak = d > -1.2 ? Math.exp(-Math.pow(d - 0.3, 2)) + 0.45 / (1 + Math.max(0, d)) : 0.12 * Math.exp(d);
          return peak * ipScale * 0.65;
        }
        const d = (-u - sep) * 4.2;
        const peak = d > -1.2 ? Math.exp(-Math.pow(d - 0.3, 2)) + 0.45 / (1 + Math.max(0, d)) : 0.12 * Math.exp(d);
        return -peak * ipScale * 0.62 + 0.15 * ipScale * Math.exp(-(1 - u) * 2);
      };

      // Draw forward anodic sweep (top) and reverse cathodic sweep (bottom)
      ctx.strokeStyle = C.primary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = (i / 80) * 2 - 1;
        const px = lx + 20 + (i / 80) * (lw - 40);
        const py = midY - evalDuck(u, true) * (lh * 0.38);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      for (let i = 80; i >= 0; i--) {
        const u = (i / 80) * 2 - 1;
        const px = lx + 20 + (i / 80) * (lw - 40);
        const py = midY - evalDuck(u, false) * (lh * 0.38);
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Animated sweeping potential dot
      const cyc = (st.t * 0.55) % 2;
      const fwd = cyc < 1;
      const uNow = fwd ? cyc * 2 - 1 : (2 - cyc) * 2 - 1;
      const iNow = evalDuck(uNow, fwd);
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(lx + 20 + ((uNow + 1) * 0.5) * (lw - 40), midY - iNow * (lh * 0.38), 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Right: Concentration profiles C_Red(x) and C_Ox(x) vs distance from electrode x
      const baseY = ly + lh - 26;
      const surfRatio = 1 / (1 + Math.exp(uNow * 4)); // fraction of Red at x=0
      const deltaDiff = Math.max(0.18, 0.55 / Math.sqrt(scanV));

      ctx.strokeStyle = C.ok;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const x = i / 60;
        const cRed = 1 - (1 - surfRatio) * Math.exp(-x / deltaDiff);
        const px = rx + 18 + x * (rw - 32);
        const py = baseY - cRed * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = C.secondary;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const x = i / 60;
        const cOx = (1 - surfRatio) * Math.exp(-x / deltaDiff);
        const px = rx + 18 + x * (rw - 32);
        const py = baseY - cOx * (lh - 56);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return {
        "Peak Current i_pa": `${(ipScale * 42).toFixed(1)} μA`,
        "Peak Separation ΔE_p": `${deltaEp} mV`,
        "Peak Ratio |i_pa/i_pc|": "1.00 (Chemically Reversible)",
        "Kinetics Regime": deltaEp <= 65 ? "Nernstian Reversible" : "Quasi-Reversible (Finite k⁰)",
      };
    },

    // 59. Hückel π-Molecular Orbitals, Frost Circles & 4n+2 Aromaticity
    chem_huckel_aromatic_pi(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Frost Circle with inscribed [N]-annulene polygon (vertex down); Right: π-MO ladder & 4n+2", st.spec.formula);
      const N = Math.max(3, Math.min(8, Math.round(st.v0 || 6)));
      const beta = st.v1 || 2.4; // |β| in eV
      const peierls = st.v2 || 0.0;

      const isAromatic = (N % 4 === 2); // N = 6 (4*1 + 2)
      const lx = 18, ly = 46, lw = W * 0.48, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      st.panel(lx, ly, lw, lh, `Frost Circle Construction: C_${N}H_${N} Ring`);
      st.panel(rx, ly, rw, lh, "Hückel π-MO Energy Levels Eₖ = α + 2β cos(2πk/N)");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54, R = Math.min(lw, lh) * 0.34;
      // Non-bonding α reference line
      ctx.strokeStyle = C.axis;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(lx + 14, cy); ctx.lineTo(rx + rw - 14, cy); ctx.stroke();
      ctx.setLineDash([]);

      // Frost circle of radius 2|β|
      ctx.strokeStyle = "rgba(124, 156, 255, 0.35)";
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

      // Inscribed N-gon with one vertex at the bottom (angle = +π/2 in screen coords)
      const verts = [];
      ctx.strokeStyle = isAromatic ? C.ok : C.danger;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let k = 0; k < N; k++) {
        const ang = Math.PI / 2 - (k * 2 * Math.PI) / N;
        const vx = cx + R * Math.cos(ang), vy = cy + R * Math.sin(ang);
        verts.push({ x: vx, y: vy, cosVal: Math.cos((k * 2 * Math.PI) / N) });
        if (k === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.stroke();

      verts.forEach((v) => {
        ctx.fillStyle = C.accent;
        ctx.beginPath(); ctx.arc(v.x, v.y, 5.5, 0, Math.PI * 2); ctx.fill();
      });

      // Right: Group vertices by energy level y and populate with N π-electrons
      const sorted = verts.slice().sort((a, b) => b.y - a.y); // lowest energy (largest screen y) first
      let remElec = N;
      let totalBetaCoeff = 0;

      sorted.forEach((v, idx) => {
        const slotX = rx + rw * 0.42 + ((idx % 2 === 1 && idx > 0 && Math.abs(v.y - sorted[idx - 1].y) < 4) ? 46 : 0);
        const occ = Math.min(2, remElec);
        remElec -= occ;
        totalBetaCoeff += occ * 2 * v.cosVal;

        ctx.strokeStyle = v.y > cy + 2 ? C.ok : (v.y < cy - 2 ? C.danger : C.accent);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(slotX - 18, v.y); ctx.lineTo(slotX + 18, v.y); ctx.stroke();

        if (occ >= 1) {
          ctx.fillStyle = C.text;
          ctx.fillText("↑", slotX - 8, v.y - 4);
        }
        if (occ >= 2) {
          ctx.fillStyle = C.text;
          ctx.fillText("↓", slotX + 2, v.y - 4);
        }
      });

      const delocBeta = Math.max(0, totalBetaCoeff - N);
      return {
        "π-Electron Count": `${N} π e⁻ (${isAromatic ? "4n+2 Hückel Aromatic" : "4n / Radical"})`,
        "Delocalization E_π": `${delocBeta.toFixed(2)} |β| (${(delocBeta * beta).toFixed(1)} eV)`,
        "HOMO–LUMO Gap": isAromatic ? `${(2 * beta).toFixed(2)} eV (Closed Shell)` : `${(peierls * 1.4).toFixed(2)} eV (Jahn-Teller)`,
        "Magnetic Ring Current": isAromatic ? "Diathropic (Shielded)" : "Paratropic (Antiaromatic)",
      };
    },

    // 60. Nucleophilic Substitution (S_N2 Walden Inversion vs S_N1 Racemization)
    chem_SN1_SN2_stereochem(ctx, W, H, st) {
      const C = st.COLORS;
      st.drawHUD("Left: Trigonal bipyramidal umbrella inversion vs planar R⁺ carbocation; Right: PES profile", st.spec.formula);
      const steric = st.v0 !== undefined ? st.v0 : 1.0; // 1° -> 3°
      const nuc = st.v1 || 1.5;
      const protic = st.v2 || 0.8;

      const rateSN2 = nuc * Math.exp(-steric * 1.15);
      const rateSN1 = protic * Math.exp((steric - 1.5) * 1.25);
      const sn2Frac = rateSN2 / Math.max(1e-5, rateSN2 + rateSN1);

      const lx = 18, ly = 46, lw = W * 0.52, lh = H - 60;
      const rx = lx + lw + 12, rw = W - rx - 16;
      const mech = sn2Frac > 0.55 ? "Concerted S_N2 Backside Attack" : "Two-Step S_N1 Carbocation Solvolysis";
      st.panel(lx, ly, lw, lh, `Stereochemical Trajectory: ${mech}`);
      st.panel(rx, ly, rw, lh, "Free Energy Profile ΔG(IRC): 1-Step vs 2-Step");

      const cx = lx + lw * 0.5, cy = ly + lh * 0.54;
      const uProg = 0.5 + 0.5 * Math.sin(st.t * 1.8); // 0 = Reactant, 0.5 = TS/Intermediate, 1 = Product

      // Central chiral Carbon atom
      ctx.fillStyle = C.text;
      ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f1222";
      ctx.font = "700 10px monospace";
      ctx.fillText("C*", cx - 6, cy + 4);

      // Umbrella substituent tilt: flips from right-leaning (+1) through planar (0 at u=0.5) to left-leaning (-1)
      const tilt = (1 - 2 * uProg) * 24;
      [-1, 1, 0].forEach((sgn, idx) => {
        const sy = cy + (idx === 2 ? -12 : sgn * 42);
        const sx = cx + tilt * (idx === 2 ? 0.6 : 1.0);
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.fillStyle = C.primary;
        ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2); ctx.fill();
      });

      // Incoming Nucleophile Nu⁻ (from left) and departing Leaving Group X⁻ (to right)
      const nuX = cx - 26 - (1 - uProg) * 58;
      const lgX = cx + 26 + uProg * 58;

      ctx.strokeStyle = C.ok;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(nuX, cy); ctx.lineTo(cx - 11, cy); ctx.stroke();
      ctx.strokeStyle = C.danger;
      ctx.beginPath(); ctx.moveTo(cx + 11, cy); ctx.lineTo(lgX, cy); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = C.ok;
      ctx.beginPath(); ctx.arc(nuX, cy, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f1222"; ctx.fillText("Nu", nuX - 6, cy + 3);

      ctx.fillStyle = C.danger;
      ctx.beginPath(); ctx.arc(lgX, cy, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f1222"; ctx.fillText("X", lgX - 3, cy + 3);

      // Right: S_N2 single barrier vs S_N1 double barrier with carbocation intermediate valley
      const baseY = ly + lh - 26;
      const drawMechCurve = (isSN2, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = (isSN2 === (sn2Frac > 0.5)) ? 2.6 : 1.4;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const u = i / 80;
          let g = 0;
          if (isSN2) {
            g = 0.22 + (0.45 + steric * 0.14) * Math.exp(-Math.pow((u - 0.5) / 0.18, 2)) - 0.12 * u;
          } else {
            g = 0.22 + (0.68 - steric * 0.12) * (Math.exp(-Math.pow((u - 0.34) / 0.13, 2)) + 0.82 * Math.exp(-Math.pow((u - 0.68) / 0.13, 2))) - 0.12 * u;
          }
          const px = rx + 16 + u * (rw - 32);
          const py = baseY - Math.min(0.95, g) * (lh - 56);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      drawMechCurve(true, C.ok); // S_N2
      drawMechCurve(false, C.secondary); // S_N1

      return {
        "S_N2 vs S_N1 Share": `${(sn2Frac * 100).toFixed(0)}% S_N2 / ${((1 - sn2Frac) * 100).toFixed(0)}% S_N1`,
        "Stereochemical Outcome": `${(sn2Frac * 100).toFixed(0)}% Inversion, ${((1 - sn2Frac) * 100).toFixed(0)}% Racemic`,
        "Molecularity": sn2Frac > 0.5 ? "Bimolecular r = k₂[RX][Nu⁻]" : "Unimolecular r = k₁[RX]",
        "Transition State": sn2Frac > 0.5 ? "Pentacoordinate [Nu···C···X]‡" : "sp² Carbocation R⁺",
      };
    },
  };

  if (window.SelfTaughtSims && typeof window.SelfTaughtSims.registerCustomRenderers === "function") {
    window.SelfTaughtSims.registerCustomRenderers(R);
  }
})();


