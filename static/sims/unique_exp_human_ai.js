/* Self-Taught — 80 Unique Bespoke Interactive Renderers for Group 2:
 * AI (20), Robotics (20), Philosophy (20), Languages (20)
 */
(function () {
  "use strict";
  const R = {};

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function arrow(ctx, x1, y1, x2, y2, col, w) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 1.6;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * 7 - uy * 4, y2 - uy * 7 + ux * 4);
    ctx.lineTo(x2 - ux * 7 + uy * 4, y2 - uy * 7 - ux * 4);
    ctx.closePath(); ctx.fill();
  }

  // ==================== 1. AI (20) ====================

  // 1. ai_sparse_autoencoder
  R.ai_sparse_autoencoder = function (ctx, W, H, st) {
    st.drawHUD("Click to probe residual activation x; tune L1 λ to disentangle monosemantic dictionary features", st.spec.formula);
    const C = st.COLORS, lam = 0.05 + st.a * 0.9, expM = Math.round(6 + st.b * 10), rho = st.c;
    const lx = 24, ly = 52, lw = W * 0.42, lh = H - 70;
    st.panel(lx, ly, lw, lh, "Polysemantic Residual Stream (Superposition in ℝ²)");
    const cx = lx + lw * 0.5, cy = ly + lh * 0.54, rad = Math.min(lw, lh) * 0.36;
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
    const angProbe = (st.px - 0.5) * Math.PI * 2 + st.t * 0.4;
    for (let i = 0; i < expM; i++) {
      const th = (i / expM) * Math.PI * 2 + rho * 0.3 * Math.sin(i * 1.7);
      const tx = cx + Math.cos(th) * rad, ty = cy + Math.sin(th) * rad;
      arrow(ctx, cx, cy, tx, ty, C.series[i % C.series.length], 1.5);
    }
    const px = cx + Math.cos(angProbe) * rad * 0.85, py = cy + Math.sin(angProbe) * rad * 0.85;
    arrow(ctx, cx, cy, px, py, "#ffffff", 2.5);
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

    const rx = lx + lw + 14, rw = W - rx - 18;
    st.panel(rx, ly, rw, lh, `Overcomplete SAE Dictionary f(x) = ReLU(W_enc x − λ)  [M=${expM}]`);
    let l0 = 0, l1 = 0;
    const bw = (rw - 28) / expM;
    for (let i = 0; i < expM; i++) {
      const th = (i / expM) * Math.PI * 2 + rho * 0.3 * Math.sin(i * 1.7);
      const raw = Math.cos(th - angProbe) + 0.15 * rho;
      const act = Math.max(0, raw - lam * 0.75);
      if (act > 0.02) l0++;
      l1 += act;
      const bx = rx + 14 + i * bw, bh = clamp(act * (lh - 56), 2, lh - 56);
      ctx.fillStyle = act > 0.02 ? C.series[i % C.series.length] : "rgba(255,255,255,0.08)";
      ctx.fillRect(bx + 2, ly + lh - 22 - bh, bw - 4, bh);
      ctx.fillStyle = C.muted; ctx.font = "9px monospace";
      ctx.fillText(`f${i}`, bx + 2, ly + lh - 8);
    }
    const mse = (0.02 + 0.22 * lam * lam / (expM / 8)).toFixed(4);
    return {
      "Active Features ‖f‖₀": `${l0} / ${expM}`,
      "L₁ Sparsity Sum": l1.toFixed(2),
      "Reconstruction MSE": mse,
      "Monosemanticity Score": `${Math.round(clamp((1 - l0 / expM) * 100 - rho * 15, 10, 99))}%`,
    };
  };

  // 2. ai_diffusion_score_matching
  R.ai_diffusion_score_matching = function (ctx, W, H, st) {
    st.drawHUD("Reverse SDE trajectories following score field ∇ₓ log pₜ(x) toward bimodal data manifold", st.spec.formula);
    const C = st.COLORS, cfg = 0.5 + st.a * 4.5, sig = 0.15 + st.b * 1.2, eta = st.c;
    const x0 = 22, y0 = 48, w = W - 44, h = H - 64;
    st.panel(x0, y0, w, h, "Score Vector Field ∇ₓ log pₜ(x) & Reverse Langevin Trajectories (t: 1 → 0)");
    const m1x = x0 + w * 0.78, m1y = y0 + h * 0.34;
    const m2x = x0 + w * 0.78, m2y = y0 + h * 0.72;
    for (let gx = x0 + 36; gx < x0 + w - 20; gx += 42) {
      for (let gy = y0 + 34; gy < y0 + h - 16; gy += 34) {
        const d1x = m1x - gx, d1y = m1y - gy, r1 = Math.hypot(d1x, d1y) + 20;
        const d2x = m2x - gx, d2y = m2y - gy, r2 = Math.hypot(d2x, d2y) + 20;
        const w1 = Math.exp(-r1 / (90 * sig)), w2 = Math.exp(-r2 / (90 * sig));
        const sx = (w1 * d1x / r1 + w2 * d2x / r2) / (w1 + w2 + 1e-4);
        const sy = (w1 * d1y / r1 + w2 * d2y / r2) / (w1 + w2 + 1e-4);
        arrow(ctx, gx, gy, gx + sx * 14, gy + sy * 14, "rgba(124,156,255,0.32)", 1.1);
      }
    }
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(m1x, m1y, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.secondary; ctx.beginPath(); ctx.arc(m2x, m2y, 9, 0, Math.PI * 2); ctx.fill();
    for (let p = 0; p < 7; p++) {
      let px = x0 + 38, py = y0 + 36 + (p / 6) * (h - 60);
      if (p === 3) py = y0 + st.py * (h - 30);
      ctx.strokeStyle = p < 3 ? C.ok : p > 3 ? C.secondary : C.accent;
      ctx.lineWidth = p === 3 ? 2.4 : 1.5;
      ctx.beginPath(); ctx.moveTo(px, py);
      const targetY = p <= 3 ? m1y : m2y;
      for (let s = 1; s <= 24; s++) {
        const u = s / 24;
        px = x0 + 38 + u * (m1x - x0 - 38);
        const pull = Math.pow(u, 0.6 + 0.25 * cfg);
        const noise = eta * 14 * (1 - u) * Math.sin(s * 1.9 + p * 2.3 + st.t * 2.2);
        py = py * (1 - 0.14 * cfg * 0.25) + targetY * (0.14 * cfg * 0.25) + noise * 0.2;
        py = clamp(py + (targetY - py) * pull * 0.18, y0 + 24, y0 + h - 10);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    return {
      "Guidance Scale w": cfg.toFixed(2),
      "Noise Level σ(t)": sig.toFixed(2),
      "DDIM Stochasticity η": eta.toFixed(2),
      "FID Proxy Score": (4.2 + 8 * Math.abs(cfg - 2.2) + 5 * sig * eta).toFixed(2),
    };
  };

  // 3. ai_lora_low_rank_adapter
  R.ai_lora_low_rank_adapter = function (ctx, W, H, st) {
    st.drawHUD("Frozen pretrained matrix W₀ plus low-rank bottleneck adapter (α/r) B·A", st.spec.formula);
    const C = st.COLORS, rank = Math.max(1, Math.round(1 + st.a * 7)), alpha = 0.5 + st.b * 3.5, orth = st.c;
    const y0 = 52, h = H - 68;
    st.panel(20, y0, W * 0.30, h, "Frozen Pretrained W₀ (d × d)");
    const g0x = 34, g0y = y0 + 28, gs = Math.min(W * 0.25, h - 46) / 8;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const v = 0.5 + 0.5 * Math.sin(r * 1.3 + c * 0.9);
        ctx.fillStyle = `rgba(124,156,255,${(0.18 + 0.65 * v).toFixed(2)})`;
        ctx.fillRect(g0x + c * gs, g0y + r * gs, gs - 2, gs - 2);
      }
    }
    const mx = W * 0.34, mw = W * 0.34;
    st.panel(mx, y0, mw, h, `Low-Rank Adapter B (d×${rank}) · A (${rank}×d)`);
    const bx = mx + 18, by = g0y, bw = Math.max(6, rank * 7);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < rank; c++) {
        ctx.fillStyle = C.secondary;
        ctx.fillRect(bx + c * 8, by + r * gs, 6, gs - 2);
      }
    }
    const ax = bx + bw + 22, ay = g0y + 20;
    for (let r = 0; r < rank; r++) {
      for (let c = 0; c < 8; c++) {
        ctx.fillStyle = C.accent;
        ctx.fillRect(ax + c * gs * 0.85, ay + r * 8, gs * 0.85 - 2, 6);
      }
    }
    const rx = W * 0.70, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Singular Value Spectrum σᵢ(ΔW)");
    for (let i = 0; i < 8; i++) {
      const active = i < rank;
      const sv = active ? alpha * Math.exp(-i * (0.35 - 0.18 * orth)) : 0.02;
      const bh = clamp((sv / 4) * (h - 54), 3, h - 54);
      const sx = rx + 14 + i * ((rw - 28) / 8);
      ctx.fillStyle = active ? C.ok : "rgba(255,255,255,0.1)";
      ctx.fillRect(sx, y0 + h - 22 - bh, (rw - 36) / 8, bh);
      ctx.fillStyle = C.muted; ctx.font = "9px monospace";
      ctx.fillText(`σ${i + 1}`, sx, y0 + h - 8);
    }
    const paramPct = ((2 * 8 * rank) / (64) * 2.5).toFixed(2);
    return {
      "LoRA Rank r": `${rank} / 8`,
      "Adapter Scale α/r": alpha.toFixed(2),
      "Trainable Params %": `${paramPct}%`,
      "Effective Rank": (rank * (0.7 + 0.3 * orth)).toFixed(1),
    };
  };

  // 4. ai_rlhf_dpo_kl_frontier
  R.ai_rlhf_dpo_kl_frontier = function (ctx, W, H, st) {
    st.drawHUD("Goodhart over-optimization frontier: Proxy Reward vs True Gold Reward across √D_KL", st.spec.formula);
    const C = st.COLORS, beta = 0.05 + st.a * 0.95, eps = 0.08 + st.b * 0.55, gamma = 0.2 + st.c * 1.2;
    const x0 = 24, y0 = 50, w = W - 48, h = H - 68;
    st.panel(x0, y0, w, h, "Proxy RM Score r_ψ(x,y) vs True Gold Utility R*(x,y) over KL Divergence D_KL(π_θ ‖ π_ref)");
    const ox = x0 + 46, oy = y0 + h - 30, pw = w - 70, ph = h - 62;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    // Proxy reward curve (monotonic)
    ctx.strokeStyle = C.secondary; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const d = (i / 80) * 10; // sqrt(KL)
      const proxy = 0.85 * d * gamma * 0.35;
      const px = ox + (i / 80) * pw, py = oy - clamp(proxy / 3.2, 0, 0.95) * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // Gold reward curve (rises then collapses due to reward hacking)
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const d = (i / 80) * 10;
      const gold = d * (0.28 * gamma - 0.045 * eps * d);
      const px = ox + (i / 80) * pw, py = oy - clamp((gold + 0.4) / 2.2, 0.05, 0.95) * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const dOpt = clamp(1.8 / (beta + 0.12), 0.5, 9.5);
    const curX = ox + (dOpt / 10) * pw;
    const goldVal = dOpt * (0.28 * gamma - 0.045 * eps * dOpt);
    const curY = oy - clamp((goldVal + 0.4) / 2.2, 0.05, 0.95) * ph;
    ctx.strokeStyle = C.accent; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(curX, y0 + 26); ctx.lineTo(curX, oy); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(curX, curY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.secondary; ctx.fillText("Proxy Reward r_ψ (Hacked at high KL)", ox + 14, y0 + 40);
    ctx.fillStyle = C.ok; ctx.fillText("True Gold Reward R* (Goodhart Peak)", ox + 14, y0 + 56);
    return {
      "KL Penalty β": beta.toFixed(2),
      "Operating D_KL": (dOpt * dOpt).toFixed(1) + " nats",
      "True Gold Score R*": goldVal.toFixed(2),
      "Regime": dOpt * 0.09 * eps > 0.28 * gamma ? "Reward Hacking!" : "Aligned Pareto",
    };
  };

  // 5. ai_rope_positional_encoding
  R.ai_rope_positional_encoding = function (ctx, W, H, st) {
    st.drawHUD("Rotary Position Embedding (RoPE) 2D complex plane clocks & relative attention decay", st.spec.formula);
    const C = st.COLORS, logB = 3 + st.a * 3, scaleS = 1 + st.b * 7, bands = Math.max(3, Math.round(3 + st.c * 5));
    const y0 = 50, h = H - 66;
    st.panel(20, y0, W * 0.48, h, `RoPE Frequency Clocks θᵢ = b^(−2i/d)  [b=10^${logB.toFixed(1)}]`);
    const posM = Math.round(st.px * 64 + st.t * 4) % 64;
    const cols = 4, cw = (W * 0.46) / cols, ch = (h - 36) / 2;
    for (let i = 0; i < bands; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const cx = 32 + (c + 0.5) * cw, cy = y0 + 38 + (r + 0.5) * ch, rad = Math.min(cw, ch) * 0.34;
      const theta = Math.pow(10, -logB * (i / bands)) / scaleS;
      const ang = posM * theta;
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
      arrow(ctx, cx, cy, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, C.series[i % C.series.length], 2);
      ctx.fillStyle = C.muted; ctx.font = "9px monospace"; ctx.fillText(`d${2 * i}`, cx - 8, cy + rad + 11);
    }
    const rx = W * 0.50, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Relative Attention Score Re[⟨R_m q, R_n k⟩] vs Distance Δm");
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2; ctx.beginPath();
    for (let k = 0; k <= 90; k++) {
      const dm = (k / 90) * 128;
      let sum = 0;
      for (let i = 0; i < bands; i++) {
        const theta = Math.pow(10, -logB * (i / bands)) / scaleS;
        sum += Math.cos(dm * theta);
      }
      sum /= bands;
      const px = rx + 16 + (k / 90) * (rw - 32);
      const py = y0 + h * 0.58 - sum * (h * 0.34);
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "RoPE Base b": `10^${logB.toFixed(2)}`,
      "NTK Scale Factor s": `${scaleS.toFixed(1)}×`,
      "Token Position m": String(posM),
      "Effective Context": `${Math.round(4 * scaleS)}k tokens`,
    };
  };

  // 6. ai_moe_router_load
  R.ai_moe_router_load = function (ctx, W, H, st) {
    st.drawHUD("Top-k token routing switchboard across 8 FFN experts with capacity threshold C", st.spec.formula);
    const C = st.COLORS, topK = Math.max(1, Math.round(1 + st.a * 3)), aux = st.b, cap = 0.6 + st.c * 1.2;
    const y0 = 50, h = H - 66;
    st.panel(20, y0, W * 0.48, h, `Bipartite Router Gating (8 Tokens → Top-${topK} of 8 Experts)`);
    const loads = new Array(8).fill(0);
    for (let t = 0; t < 8; t++) {
      const ty = y0 + 34 + t * ((h - 48) / 7);
      ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(44, ty, 5, 0, Math.PI * 2); ctx.fill();
      for (let k = 0; k < topK; k++) {
        const skew = (1 - aux) * 0.7;
        const expIdx = Math.floor((t * (1 - skew) + k * 2 + Math.sin(t + st.t) * 0.5 + 8) % 8);
        loads[expIdx] += 1 / topK;
        const ey = y0 + 34 + expIdx * ((h - 48) / 7);
        ctx.strokeStyle = C.series[expIdx % C.series.length];
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(50, ty); ctx.lineTo(W * 0.44, ey); ctx.stroke();
      }
    }
    for (let e = 0; e < 8; e++) {
      const ey = y0 + 34 + e * ((h - 48) / 7);
      ctx.fillStyle = C.series[e % C.series.length];
      ctx.fillRect(W * 0.44, ey - 6, 16, 12);
    }
    const rx = W * 0.50, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Expert Token Load fᵢ vs Capacity Factor C (Dropped Overflow in Red)");
    const capY = y0 + h - 24 - clamp(cap * 0.45, 0.1, 0.85) * (h - 54);
    let dropped = 0;
    const bw = (rw - 28) / 8;
    for (let e = 0; e < 8; e++) {
      const ld = loads[e] / 2.2;
      const bh = clamp(ld * (h - 54), 4, h - 54);
      const bx = rx + 14 + e * bw;
      ctx.fillStyle = y0 + h - 24 - bh < capY ? C.danger : C.ok;
      if (y0 + h - 24 - bh < capY) dropped += (ld - cap * 0.45);
      ctx.fillRect(bx + 2, y0 + h - 24 - bh, bw - 5, bh);
    }
    ctx.strokeStyle = C.accent; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(rx + 10, capY); ctx.lineTo(rx + rw - 10, capY); ctx.stroke(); ctx.setLineDash([]);
    return {
      "Active Experts k": `${topK} / 8`,
      "Aux Balance α": aux.toFixed(2),
      "Capacity Factor C": cap.toFixed(2),
      "Dropped Token Rate": `${clamp(dropped * 18, 0, 45).toFixed(1)}%`,
    };
  };

  // 7. ai_kv_cache_flash_attn
  R.ai_kv_cache_flash_attn = function (ctx, W, H, st) {
    st.drawHUD("FlashAttention SRAM tile sweep & Roofline arithmetic intensity with GQA compression", st.spec.formula);
    const C = st.COLORS, gqa = Math.pow(2, Math.round(st.a * 3)), tile = Math.round(32 + st.b * 96), seq = Math.round(2 + st.c * 30);
    const y0 = 50, h = H - 66;
    st.panel(20, y0, W * 0.46, h, `FlashAttention Online Softmax Tiling (B_r=${tile})`);
    const N = 8, gs = Math.min(W * 0.36, h - 48) / N, gx = 42, gy = y0 + 32;
    const activeRow = Math.floor(st.t * 3) % N;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const causal = c <= r;
        const inSRAM = r === activeRow && causal;
        ctx.fillStyle = !causal ? "rgba(255,255,255,0.03)" : inSRAM ? C.accent : "rgba(124,156,255,0.28)";
        ctx.fillRect(gx + c * gs, gy + r * gs, gs - 2, gs - 2);
      }
    }
    const rx = W * 0.49, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Roofline Model: TFLOP/s vs Arithmetic Intensity (FLOPs/Byte)");
    const ox = rx + 30, oy = y0 + h - 26, pw = rw - 48, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + pw * 0.45, y0 + 36); ctx.lineTo(ox + pw, y0 + 36); ctx.stroke();
    const oi = clamp(0.15 + 0.1 * Math.log2(gqa) + (tile / 160) * 0.45, 0.1, 0.9);
    const px = ox + oi * pw, py = oi < 0.45 ? oy - (oi / 0.45) * (ph - 12) : y0 + 36;
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
    const kvGB = ((seq * 0.52) / gqa).toFixed(2);
    return {
      "GQA Ratio": `${gqa}:1`,
      "SRAM Tile B_r": `${tile}×${tile}`,
      "KV Cache Memory": `${kvGB} GB`,
      "Roofline Bound": oi < 0.45 ? "HBM Bandwidth Bound" : "Tensor Core Compute",
    };
  };

  // 8. ai_gnn_message_passing
  R.ai_gnn_message_passing = function (ctx, W, H, st) {
    st.drawHUD("GNN k-hop neighborhood aggregation & Dirichlet energy over-smoothing at deep layers", st.spec.formula);
    const C = st.COLORS, depth = Math.round(1 + st.a * 11), res = st.b, drop = st.c;
    const y0 = 50, h = H - 66;
    st.panel(20, y0, W * 0.48, h, `Graph Node Embeddings after L=${depth} Message-Passing Layers`);
    const cx = 20 + W * 0.24, cy = y0 + h * 0.54, R0 = Math.min(W * 0.18, h * 0.35);
    const smooth = Math.exp(-depth * 0.28 * (1 - 0.7 * res) * (1 - 0.4 * drop));
    const nodes = [];
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const comm = i < 5 ? -1 : 1;
      const r = R0 * (0.25 + 0.75 * smooth);
      const nx = cx + comm * (1 - smooth) * 6 + Math.cos(ang) * r;
      const ny = cy + Math.sin(ang) * r;
      nodes.push({ x: nx, y: ny, c: comm });
    }
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    for (let i = 0; i < 10; i++) {
      for (let j = i + 1; j < 10; j++) {
        if ((i + j) % 3 === 0) {
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
        }
      }
    }
    nodes.forEach((n) => {
      ctx.fillStyle = n.c < 0 ? C.primary : C.secondary;
      ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI * 2); ctx.fill();
    });
    const rx = W * 0.50, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Dirichlet Energy E(H^(l)) across Layer Depth l");
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let l = 0; l <= 12; l++) {
      const e = Math.exp(-l * 0.28 * (1 - 0.7 * res) * (1 - 0.4 * drop));
      const px = rx + 20 + (l / 12) * (rw - 36), py = y0 + h - 26 - e * (h - 58);
      if (l === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "Layer Depth L": String(depth),
      "Dirichlet Energy": smooth.toFixed(3),
      "Residual α": res.toFixed(2),
      "Status": smooth < 0.22 ? "Over-Smoothed!" : "Discriminative",
    };
  };

  // 9. ai_contrastive_infonce
  R.ai_contrastive_infonce = function (ctx, W, H, st) {
    st.drawHUD("InfoNCE contrastive embeddings on unit hypersphere S¹ with temperature τ", st.spec.formula);
    const C = st.COLORS, tau = 0.05 + st.a * 0.95, hardB = st.b, alignW = 0.2 + st.c * 0.8;
    const y0 = 50, h = H - 66;
    st.panel(20, y0, W * 0.50, h, "Unit Hypersphere S^(d−1): Anchor u, Positive v₊ & Repelled Negatives v⁻");
    const cx = 20 + W * 0.25, cy = y0 + h * 0.54, rad = Math.min(W * 0.20, h * 0.36);
    ctx.strokeStyle = C.axis; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
    const aAng = (st.px - 0.5) * Math.PI * 2;
    const pAng = aAng + 0.35 * (1 - alignW * 0.75);
    const ax = cx + Math.cos(aAng) * rad, ay = cy + Math.sin(aAng) * rad;
    const px = cx + Math.cos(pAng) * rad, py = cy + Math.sin(pAng) * rad;
    arrow(ctx, cx, cy, ax, ay, C.accent, 2.4);
    arrow(ctx, cx, cy, px, py, C.ok, 2.2);
    for (let k = 0; k < 8; k++) {
      const nAng = aAng + Math.PI * (0.35 + 1.3 * (k / 7)) + 0.15 * Math.sin(st.t + k) * tau;
      const nx = cx + Math.cos(nAng) * rad, ny = cy + Math.sin(nAng) * rad;
      ctx.fillStyle = C.danger; ctx.beginPath(); ctx.arc(nx, ny, 4.5, 0, Math.PI * 2); ctx.fill();
    }
    const rx = W * 0.53, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Softmax Cosine Similarity Distribution exp(cos θ / τ)");
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 70; i++) {
      const cos = -1 + 2 * (i / 70);
      const val = Math.exp((cos - 1) / Math.max(0.12, tau));
      const gx = rx + 18 + (i / 70) * (rw - 34), gy = y0 + h - 26 - val * (h - 58);
      if (i === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy);
    }
    ctx.stroke();
    const unif = (-2.1 - 1.4 * (1 - tau) + 0.4 * hardB).toFixed(2);
    return {
      "Temperature τ": tau.toFixed(2),
      "Positive Cosine uᵀv₊": Math.cos(pAng - aAng).toFixed(3),
      "Uniformity Loss": unif,
      "InfoNCE Loss": (Math.log(1 + 7 * Math.exp(-0.8 / tau))).toFixed(2),
    };
  };

  // 10. ai_vae_elbo_kl
  R.ai_vae_elbo_kl = function (ctx, W, H, st) {
    st.drawHUD("β-VAE Latent Posterior Clouds q_φ(z|x) vs Standard Normal Prior N(0,I)", st.spec.formula);
    const C = st.COLORS, beta = 0.1 + st.a * 4.9, sigPost = 0.15 + st.b * 0.9, capC = st.c * 5;
    const y0 = 50, h = H - 66;
    st.panel(20, y0, W * 0.52, h, "2D Latent Space z ~ N(μ(x), σ²(x)I) vs Prior N(0,I) Contours");
    const cx = 20 + W * 0.26, cy = y0 + h * 0.54, R0 = Math.min(W * 0.20, h * 0.36);
    [0.4, 0.75, 1.05].forEach((s) => {
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.arc(cx, cy, R0 * s, 0, Math.PI * 2); ctx.stroke();
    });
    const collapse = Math.exp(-0.42 * Math.max(0, beta - 0.8));
    for (let k = 0; k < 6; k++) {
      const ang = (k / 6) * Math.PI * 2 + st.t * 0.25;
      const mx = cx + Math.cos(ang) * R0 * 0.72 * collapse;
      const my = cy + Math.sin(ang) * R0 * 0.72 * collapse;
      const rad = R0 * (0.14 + 0.22 * sigPost * (1 - 0.5 * collapse));
      ctx.fillStyle = C.series[k % C.series.length] + "44";
      ctx.strokeStyle = C.series[k % C.series.length];
      ctx.beginPath(); ctx.arc(mx, my, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    const rx = W * 0.55, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Rate-Distortion Plane (KL Rate vs Reconstruction)");
    const kl = (3.8 * collapse + 0.2 * capC).toFixed(2);
    const recon = (0.15 + 1.4 * (1 - collapse)).toFixed(2);
    ctx.fillStyle = C.ok; ctx.fillRect(rx + 28, y0 + h - 28 - collapse * (h - 66), 44, collapse * (h - 66));
    ctx.fillStyle = C.secondary; ctx.fillRect(rx + 96, y0 + h - 28 - (1 - 0.7 * collapse) * (h - 66), 44, (1 - 0.7 * collapse) * (h - 66));
    ctx.fillStyle = C.text; ctx.fillText("D_KL Rate", rx + 26, y0 + h - 10);
    ctx.fillText("Recon Err", rx + 94, y0 + h - 10);
    return {
      "β Weight": beta.toFixed(2),
      "KL Divergence D_KL": `${kl} nats`,
      "Recon Loss −log p": recon,
      "Latent State": collapse < 0.35 ? "Posterior Collapse" : "Disentangled",
    };
  };

  // 11. ai_mcts_alphazero_puct
  R.ai_mcts_alphazero_puct = function (ctx, W, H, st) {
    st.drawHUD("AlphaZero MCTS tree search balancing Q(s,a) exploitation and PUCT exploration U(s,a)", st.spec.formula);
    const C = st.COLORS, cpuct = 0.3 + st.a * 3.7, dir = st.b, rate = 1 + st.c * 4;
    const x0 = 20, y0 = 50, w = W - 40, h = H - 66;
    st.panel(x0, y0, w, h, "MCTS Game Tree Rollouts: Node Size ∝ Visit Count N(s,a), Color = Q(s,a)");
    const rootX = x0 + w * 0.5, rootY = y0 + 40;
    const priors = [0.45, 0.30, 0.15, 0.10];
    const qvals = [0.68, 0.54, 0.74, 0.32];
    let bestA = 0, bestScore = -99;
    for (let i = 0; i < 4; i++) {
      const cx = x0 + w * (0.16 + i * 0.22), cy = y0 + h * 0.48;
      const pNoisy = (1 - 0.25 * dir) * priors[i] + 0.25 * dir * 0.25;
      const visits = Math.round(12 + 40 * pNoisy * rate / (1 + 0.4 * cpuct * i));
      const uVal = cpuct * pNoisy * Math.sqrt(120) / (1 + visits);
      const score = qvals[i] + uVal;
      if (score > bestScore) { bestScore = score; bestA = i; }
      ctx.strokeStyle = i === bestA ? C.accent : "rgba(255,255,255,0.22)";
      ctx.lineWidth = i === bestA ? 2.6 : 1.4;
      ctx.beginPath(); ctx.moveTo(rootX, rootY); ctx.lineTo(cx, cy); ctx.stroke();
      ctx.fillStyle = C.series[i];
      ctx.beginPath(); ctx.arc(cx, cy, 10 + visits * 0.16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = "10px monospace";
      ctx.fillText(`Q=${qvals[i].toFixed(2)} U=${uVal.toFixed(2)} N=${visits}`, cx - 46, cy + 28);
      for (let j = 0; j < 2; j++) {
        const lx = cx + (j === 0 ? -28 : 28), ly = y0 + h * 0.82;
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(lx, ly); ctx.stroke();
        ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(lx, ly, 6, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(rootX, rootY, 12, 0, Math.PI * 2); ctx.fill();
    return {
      "Selected Action a*": `Branch #${bestA + 1}`,
      "Max PUCT Q + U": bestScore.toFixed(3),
      "Exploration c_puct": cpuct.toFixed(2),
      "Root Value V(s₀)": (0.62 + 0.05 * dir).toFixed(3),
    };
  };

  // 12. ai_ppo_trust_region_clip
  R.ai_ppo_trust_region_clip = function (ctx, W, H, st) {
    st.drawHUD("PPO Clipped Surrogate Objective L^CLIP(r_t) for A > 0 and A < 0", st.spec.formula);
    const C = st.COLORS, eps = 0.08 + st.a * 0.32, lam = 0.8 + st.b * 0.19, ent = st.c * 0.05;
    const y0 = 50, h = H - 66;
    const pw = (W - 54) / 2;
    st.panel(20, y0, pw, h, `Positive Advantage Â_t > 0  (Clip at 1 + ε = ${(1 + eps).toFixed(2)})`);
    st.panel(34 + pw, y0, pw, h, `Negative Advantage Â_t < 0  (Clip at 1 − ε = ${(1 - eps).toFixed(2)})`);
    [0, 1].forEach((panelIdx) => {
      const ox = (panelIdx === 0 ? 20 : 34 + pw) + 28, oy = y0 + h * 0.56, gw = pw - 46, gh = h * 0.34;
      ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke();
      ctx.strokeStyle = panelIdx === 0 ? C.ok : C.secondary; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const r = 0.2 + (i / 80) * 1.6;
        const rc = clamp(r, 1 - eps, 1 + eps);
        const val = panelIdx === 0 ? Math.min(r, rc) - 1 : Math.min(-r, -rc) + 1;
        const px = ox + (i / 80) * gw, py = oy - val * gh * 1.4;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
    return {
      "Clip Range [1−ε, 1+ε]": `[${(1 - eps).toFixed(2)}, ${(1 + eps).toFixed(2)}]`,
      "GAE Lambda λ": lam.toFixed(2),
      "Entropy Bonus c₂": ent.toFixed(3),
      "Approx KL": (0.5 * eps * eps).toFixed(4),
    };
  };

  // 13. ai_grokking_phase_transition
  R.ai_grokking_phase_transition = function (ctx, W, H, st) {
    st.drawHUD("Grokking on modular arithmetic: Delayed validation generalization after memorization", st.spec.formula);
    const C = st.COLORS, wd = 0.05 + st.a * 1.95, frac = 0.25 + st.b * 0.65, lr = 0.2 + st.c * 0.8;
    const x0 = 22, y0 = 50, w = W - 44, h = H - 66;
    st.panel(x0, y0, w, h, "Train vs Validation Accuracy over Log₁₀ Optimization Steps");
    const ox = x0 + 44, oy = y0 + h - 28, pw = w - 68, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    const tMem = 0.22 / lr;
    const tGrok = clamp(tMem + 0.55 / (wd * frac + 0.15), 0.28, 0.92);
    // Train curve
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const u = i / 90;
      const acc = 1 / (1 + Math.exp(-(u - tMem) * 28));
      const px = ox + u * pw, py = oy - acc * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // Val curve
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const u = i / 90;
      const acc = 0.05 + 0.94 / (1 + Math.exp(-(u - tGrok) * 24));
      const px = ox + u * pw, py = oy - acc * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = C.primary; ctx.fillText("Train Acc (Rapid Memorization)", ox + 14, y0 + 38);
    ctx.fillStyle = C.ok; ctx.fillText("Validation Acc (Grokking Phase Transition)", ox + 14, y0 + 54);
    return {
      "Memorization Step": `10^${(2.2 + tMem).toFixed(2)}`,
      "Grokking Step": `10^${(2.2 + tGrok * 3).toFixed(2)}`,
      "Weight Decay λ": wd.toFixed(2),
      "Representation": tGrok < 0.75 ? "Fourier Circle Learned" : "Lookup Table",
    };
  };

  // 14. ai_gaussian_process_bo
  R.ai_gaussian_process_bo = function (ctx, W, H, st) {
    st.drawHUD("Click to place observation; GP posterior mean μ(x) ± κσ(x) & UCB acquisition", st.spec.formula);
    const C = st.COLORS, ell = 0.08 + st.a * 0.35, kappa = 0.5 + st.b * 3.5, noise = 0.02 + st.c * 0.2;
    const x0 = 22, y0 = 50, w = W - 44, h = H - 66;
    st.panel(x0, y0, w, h, "Gaussian Process Posterior μ(x) ± 2σ(x) & Upper Confidence Bound α_UCB(x)");
    const pts = [0.14, 0.32, 0.68, 0.86, clamp(st.px, 0.08, 0.92)];
    const fTrue = (u) => Math.sin(u * 6.2) * 0.55 + Math.cos(u * 13) * 0.25;
    const ox = x0 + 24, oy = y0 + h * 0.48, pw = w - 48, ph = h * 0.32;
    let bestX = 0, bestUCB = -99;
    // Shaded uncertainty band
    ctx.fillStyle = "rgba(124,156,255,0.20)";
    ctx.beginPath();
    const mus = [], sigs = [];
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      let wSum = 0, ySum = 0, kMax = 0;
      pts.forEach((p) => {
        const k = Math.exp(-Math.pow((u - p) / ell, 2));
        wSum += k; ySum += k * fTrue(p);
        if (k > kMax) kMax = k;
      });
      const mu = wSum / (wSum + noise + 0.08) * (ySum / Math.max(1e-4, wSum));
      const sig = Math.sqrt(Math.max(0.01, 1 - kMax * (1 - noise)));
      mus.push(mu); sigs.push(sig);
      const ucb = mu + 0.35 * kappa * sig;
      if (ucb > bestUCB) { bestUCB = ucb; bestX = u; }
      ctx.lineTo(ox + u * pw, oy - (mu + 0.5 * sig) * ph);
    }
    for (let i = 80; i >= 0; i--) {
      const u = i / 80;
      ctx.lineTo(ox + u * pw, oy - (mus[i] - 0.5 * sigs[i]) * ph);
    }
    ctx.closePath(); ctx.fill();
    // Posterior mean
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const px = ox + (i / 80) * pw, py = oy - mus[i] * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    pts.forEach((p) => {
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(ox + p * pw, oy - fTrue(p) * ph, 4.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(ox + bestX * pw, y0 + h - 20, 6, 0, Math.PI * 2); ctx.fill();
    return {
      "RBF Lengthscale ℓ": ell.toFixed(2),
      "UCB Exploration κ": kappa.toFixed(2),
      "Next Query x_next": bestX.toFixed(3),
      "Max α_UCB(x)": bestUCB.toFixed(2),
    };
  };

  // 15. ai_speculative_decoding_draft
  R.ai_speculative_decoding_draft = function (ctx, W, H, st) {
    st.drawHUD("Draft LLM proposes γ tokens verified in 1 parallel Target LLM forward pass", st.spec.formula);
    const C = st.COLORS, alpha = 0.4 + st.a * 0.55, gamma = Math.round(2 + st.b * 6), cost = 0.04 + st.c * 0.25;
    const x0 = 22, y0 = 50, w = W - 44, h = H - 66;
    st.panel(x0, y0, w, h, `Speculative Verification Pipeline (Lookahead γ = ${gamma}, Acceptance α = ${alpha.toFixed(2)})`);
    const bw = (w - 60) / (gamma + 1);
    let accepted = 0, broken = false;
    for (let i = 0; i < gamma; i++) {
      const bx = x0 + 24 + i * bw, by = y0 + 48;
      const pAcc = Math.pow(alpha, 0.7 + 0.1 * i);
      const ok = !broken && pAcc > 0.52;
      if (ok) accepted++; else broken = true;
      ctx.fillStyle = ok ? "rgba(110,231,183,0.22)" : "rgba(255,107,107,0.22)";
      ctx.strokeStyle = ok ? C.ok : C.danger;
      ctx.lineWidth = 2;
      ctx.fillRect(bx, by, bw - 10, 56); ctx.strokeRect(bx, by, bw - 10, 56);
      ctx.fillStyle = C.text; ctx.font = "600 11px monospace";
      ctx.fillText(`tok_${i + 1}`, bx + 8, by + 22);
      ctx.fillStyle = ok ? C.ok : C.danger;
      ctx.fillText(ok ? "ACCEPT" : "REJECT", bx + 8, by + 42);
    }
    const expTok = (1 - Math.pow(alpha, gamma + 1)) / Math.max(0.05, 1 - alpha);
    const speedup = expTok / (1 + gamma * cost);
    return {
      "Accepted Prefix": `${accepted} / ${gamma} + 1 bonus`,
      "Expected E[tokens]": expTok.toFixed(2),
      "Wall-Clock Speedup": `${speedup.toFixed(2)}×`,
      "Target Distribution": "Exact (Lossless)",
    };
  };

  // 16. ai_adamw_momentum_geometry
  R.ai_adamw_momentum_geometry = function (ctx, W, H, st) {
    st.drawHUD("Ill-conditioned ravine contours: Oscillating SGD+Momentum vs Preconditioned AdamW", st.spec.formula);
    const C = st.COLORS, b1 = 0.5 + st.a * 0.48, b2 = 0.8 + st.b * 0.199, wd = st.c * 0.3;
    const x0 = 22, y0 = 50, w = W - 44, h = H - 66;
    st.panel(x0, y0, w, h, "Anisotropic Loss Ravine L(θ₁, θ₂) = 0.5 θ₁² + 25 θ₂²");
    const cx = x0 + w * 0.78, cy = y0 + h * 0.54;
    for (let r = 1; r <= 5; r++) {
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.ellipse(cx, cy, r * (w * 0.11), r * (h * 0.065), 0, 0, Math.PI * 2); ctx.stroke();
    }
    const sx = x0 + w * 0.14, sy = y0 + h * 0.22;
    // SGD path (zig-zag)
    ctx.strokeStyle = C.secondary; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(sx, sy);
    for (let k = 1; k <= 24; k++) {
      const u = k / 24;
      const px = sx + u * (cx - sx) * b1;
      const py = cy + Math.pow(-1, k) * (1 - u) * (h * 0.32) * (1.1 - 0.4 * b1);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    // AdamW path (smooth diagonal)
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(sx, sy);
    for (let k = 1; k <= 24; k++) {
      const u = k / 24;
      const px = sx + Math.pow(u, 0.75) * (cx - sx - wd * 30);
      const py = sy + Math.pow(u, 0.65 * b2) * (cy - sy);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
    return {
      "Momentum β₁": b1.toFixed(2),
      "RMS Precond β₂": b2.toFixed(3),
      "Weight Decay λ": wd.toFixed(2),
      "Condition Ratio": `${(25 / (1 + 22 * b2)).toFixed(1)}:1`,
    };
  };

  // 17. ai_double_descent_overparam
  R.ai_double_descent_overparam = function (ctx, W, H, st) {
    st.drawHUD("Belkin Double Descent test risk peaking at interpolation threshold P = N", st.spec.formula);
    const C = st.COLORS, cap = 0.1 + st.a * 2.9, noise = 0.05 + st.b * 0.6, ridge = st.c * 0.5;
    const x0 = 22, y0 = 50, w = W - 44, h = H - 66;
    st.panel(x0, y0, w, h, "Test Risk vs Model Capacity Ratio P / N (Classical Bias-Variance → Interpolation Peak → Modern Regime)");
    const ox = x0 + 44, oy = y0 + h - 28, pw = w - 68, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    const threshX = ox + (1.0 / 3.0) * pw;
    ctx.strokeStyle = C.danger; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(threshX, y0 + 24); ctx.lineTo(threshX, oy); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.5; ctx.beginPath();
    const riskAt = (r) => {
      const peak = (noise * 1.4) / (Math.pow(r - 1, 2) + 0.03 + ridge * 0.5);
      const base = r < 1 ? 0.55 * Math.pow(r - 0.55, 2) + 0.18 : 0.12 + 0.26 / Math.sqrt(r);
      return clamp(base + peak * 0.06, 0.08, 0.95);
    };
    for (let i = 0; i <= 100; i++) {
      const r = (i / 100) * 3.0;
      const px = ox + (i / 100) * pw, py = oy - riskAt(r) * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const cx = ox + (cap / 3.0) * pw, cy = oy - riskAt(cap) * ph;
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
    return {
      "Capacity Ratio P/N": cap.toFixed(2),
      "Test Risk R_test": riskAt(cap).toFixed(3),
      "Train Risk R_train": cap >= 1 ? "0.000 (Interpolated)" : (0.35 * (1 - cap)).toFixed(3),
      "Regime": Math.abs(cap - 1) < 0.18 ? "Interpolation Peak!" : cap > 1 ? "Overparameterized" : "Underparameterized",
    };
  };

  // 18. ai_SSM_mamba_selective
  R.ai_SSM_mamba_selective = function (ctx, W, H, st) {
    st.drawHUD("Mamba selective state-space highway: Input-dependent step Δ(x_t) gates memory retention", st.spec.formula);
    const C = st.COLORS, dtGate = 0.05 + st.a * 0.95, orderN = Math.round(4 + st.b * 12), decay = 0.2 + st.c * 1.5;
    const x0 = 22, y0 = 50, w = W - 44, h = H - 66;
    st.panel(x0, y0, w, h, `Selective State Highway h_t = Ā(x_t) h_{t−1} + B̄(x_t) x_t   [HiPPO N=${orderN}]`);
    const steps = 10, bw = (w - 48) / steps;
    let stateVal = 0.2;
    for (let t = 0; t < steps; t++) {
      const salient = (t === 1 || t === 5 || t === 8);
      const dt = salient ? dtGate : 0.05;
      const aBar = Math.exp(-dt * decay);
      stateVal = aBar * stateVal + (1 - aBar) * (salient ? 1.0 : 0.1);
      const bx = x0 + 24 + t * bw, by = y0 + 54;
      ctx.fillStyle = salient ? C.accent : "rgba(255,255,255,0.12)";
      ctx.fillRect(bx + 4, by + 76 - dt * 50, bw - 12, dt * 50);
      ctx.fillStyle = C.ok;
      ctx.beginPath(); ctx.arc(bx + bw * 0.4, by + 24, 6 + stateVal * 10, 0, Math.PI * 2); ctx.fill();
      if (t < steps - 1) arrow(ctx, bx + bw * 0.55, by + 24, bx + bw * 1.25, by + 24, C.primary, 1.8);
    }
    return {
      "Selective Δ(x_t)": dtGate.toFixed(2),
      "Transition Ā = exp(ΔA)": Math.exp(-dtGate * decay).toFixed(3),
      "HiPPO State Dim N": String(orderN),
      "Memory Horizon": `${Math.round(12 / (dtGate * decay))} tokens`,
    };
  };

  // 19. ai_quantization_int4_awq
  R.ai_quantization_int4_awq = function (ctx, W, H, st) {
    st.drawHUD("INT4 weight quantization grid with Activation-Aware (AWQ) salient channel scaling", st.spec.formula);
    const C = st.COLORS, bits = Math.round(2 + st.a * 6), awq = st.b, outlier = 2 + st.c * 18;
    const y0 = 50, h = H - 66;
    st.panel(20, y0, W * 0.48, h, `Activation Magnitude E|X| (Outlier Channel = ${outlier.toFixed(1)}×)`);
    const cw = (W * 0.44) / 8;
    for (let c = 0; c < 8; c++) {
      const isOut = c === 2 || c === 6;
      const mag = isOut ? outlier : 1.2 + 0.4 * Math.sin(c);
      const bh = clamp((mag / 20) * (h - 54), 6, h - 54);
      ctx.fillStyle = isOut ? C.danger : C.primary;
      ctx.fillRect(32 + c * cw, y0 + h - 24 - bh, cw - 6, bh);
    }
    const rx = W * 0.50, rw = W - rx - 18;
    const levels = Math.min(16, Math.pow(2, bits));
    st.panel(rx, y0, rw, h, `${bits}-Bit Quantization Grid (${levels} Levels) & AWQ Scale s = (E|X|)^α`);
    for (let l = 0; l < levels; l++) {
      const ly = y0 + 34 + (l / Math.max(1, levels - 1)) * (h - 56);
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.beginPath(); ctx.moveTo(rx + 18, ly); ctx.lineTo(rx + rw - 18, ly); ctx.stroke();
    }
    const ppl = (5.2 + (outlier * (1 - 0.82 * awq)) / Math.pow(2, bits - 1)).toFixed(2);
    return {
      "Quantization Precision": `INT${bits}`,
      "AWQ Protection α": awq.toFixed(2),
      "Outlier Spike": `${outlier.toFixed(1)}×`,
      "WikiText-2 Perplexity": ppl,
    };
  };

  // 20. ai_mechanistic_induction_heads
  R.ai_mechanistic_induction_heads = function (ctx, W, H, st) {
    st.drawHUD("Two-layer Induction Circuit: [A][B] ... [A] → predicts [B] via off-diagonal stripe", st.spec.formula);
    const C = st.COLORS, qk = 0.2 + st.a * 0.8, ov = 0.2 + st.b * 0.8, sharp = 0.5 + st.c * 3.5;
    const y0 = 50, h = H - 66;
    const toks = ["[BOS]", "pot", "ter", "wiz", "ard", "pot", "ter"];
    st.panel(20, y0, W * 0.48, h, "Layer 2 Induction Head Attention Pattern A^(2)");
    const N = toks.length, gs = Math.min(W * 0.36, h - 54) / N, gx = 54, gy = y0 + 38;
    for (let r = 0; r < N; r++) {
      ctx.fillStyle = C.muted; ctx.font = "10px monospace";
      ctx.fillText(toks[r], 24, gy + r * gs + 13);
      for (let c = 0; c <= r; c++) {
        const isInd = (r === 5 && c === 2) || (r === 6 && c === 3);
        const val = isInd ? clamp(qk * sharp * 0.45, 0.15, 0.98) : 0.08;
        ctx.fillStyle = isInd ? `rgba(110,231,183,${val.toFixed(2)})` : `rgba(124,156,255,${val.toFixed(2)})`;
        ctx.fillRect(gx + c * gs, gy + r * gs, gs - 2, gs - 2);
      }
    }
    const rx = W * 0.50, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "K-Composition Circuit: Layer 1 (Prev Token) → Layer 2 (Copy [B])");
    arrow(ctx, rx + 40, y0 + 70, rx + rw - 40, y0 + 70, C.accent, 2.2);
    ctx.fillStyle = C.text; ctx.fillText("L1.H0 shifts key of 'ter' by 'pot' (Previous Token)", rx + 24, y0 + 54);
    arrow(ctx, rx + 40, y0 + 130, rx + rw - 40, y0 + 130, C.ok, 2.5);
    ctx.fillText("L2.H1 matches second 'pot' → attends to 'ter'", rx + 24, y0 + 114);
    const pB = clamp(qk * ov * (1 - Math.exp(-sharp)), 0.05, 0.99);
    return {
      "Prefix Match Score": (qk * 100).toFixed(1) + "%",
      "OV Copy Logit": (ov * sharp * 3.2).toFixed(2),
      "P(next = 'ter')": (pB * 100).toFixed(1) + "%",
      "ICL Loss Drop": `−${(pB * 2.8).toFixed(2)} nats`,
    };
  };

  // ==================== 2. ROBOTICS (20) ====================

  // 21. rob_drone_swarm_cbf
  R.rob_drone_swarm_cbf = function (ctx, W, H, st) {
    st.drawHUD("Quadrotor swarm with Control Barrier Function safety circles h(x) = ‖x − x_obs‖² − r² ≥ 0", st.spec.formula);
    const C = st.COLORS, alpha = 0.2 + st.a * 2.8, rSafe = 26 + st.b * 38, kp = 0.5 + st.c * 2.5;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "CBF-QP Safety Filter: Nominal u_nom (Dashed) vs Safe Filtered u* (Solid)");
    const ox = x0 + w * st.px, oy = y0 + h * st.py;
    ctx.fillStyle = "rgba(255,107,107,0.16)"; ctx.strokeStyle = C.danger; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ox, oy, rSafe, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    let minH = 999;
    for (let i = 0; i < 4; i++) {
      const sy = y0 + 44 + i * ((h - 76) / 3);
      const gx = x0 + w - 42, gy = y0 + h - 36 - i * ((h - 76) / 3);
      const u = (st.t * 0.22 * kp + i * 0.2) % 1;
      let dx = x0 + 42 + u * (gx - x0 - 42), dy = sy + u * (gy - sy);
      const vx = dx - ox, vy = dy - oy, dist = Math.hypot(vx, vy) + 1e-3;
      if (dist < rSafe + 18) {
        const push = (rSafe + 18 - dist) * (0.6 + 0.3 / alpha);
        dx += (vx / dist) * push; dy += (vy / dist) * push;
      }
      const hVal = (Math.hypot(dx - ox, dy - oy) - rSafe) / 20;
      if (hVal < minH) minH = hVal;
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(x0 + 42, sy); ctx.lineTo(gx, gy); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(dx, dy, 8, 0, Math.PI * 2); ctx.fill();
    }
    return {
      "Min Barrier h(x)": `${Math.max(0.02, minH).toFixed(2)} m²`,
      "Safety Radius r_safe": `${(rSafe / 20).toFixed(2)} m`,
      "CBF Class-K α": alpha.toFixed(2),
      "Forward Invariance": "Guaranteed (h ≥ 0)",
    };
  };

  // 22. rob_mpc_receding_horizon
  R.rob_mpc_receding_horizon = function (ctx, W, H, st) {
    st.drawHUD("Receding Horizon Model Predictive Control: Predicted trajectory fan & actuator saturation", st.spec.formula);
    const C = st.COLORS, N = Math.round(4 + st.a * 16), Rw = 0.1 + st.b * 2.0, uMax = 0.3 + st.c * 0.7;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `MPC Horizon Rollout (N = ${N} steps, |u_k| ≤ ${uMax.toFixed(2)})`);
    const ox = x0 + 36, oy = y0 + h * 0.56, pw = w - 64;
    // Reference sinusoid
    ctx.strokeStyle = "rgba(255,255,255,0.28)"; ctx.setLineDash([5, 4]); ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80, px = ox + u * pw, py = oy - Math.sin(u * 6 + st.t) * (h * 0.28);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.setLineDash([]);
    // Candidate fan + optimal horizon
    for (let c = -2; c <= 2; c++) {
      ctx.strokeStyle = c === 0 ? C.ok : "rgba(124,156,255,0.25)";
      ctx.lineWidth = c === 0 ? 2.6 : 1.2;
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const u = (k / 22);
        const px = ox + u * pw;
        const py = oy - Math.sin(u * 6 + st.t) * (h * 0.28) * clamp(uMax / (0.4 + 0.15 * Rw), 0.3, 1.0) + c * k * 1.8;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    return {
      "Horizon Steps N": String(N),
      "Control Effort R": Rw.toFixed(2),
      "Saturation u_max": uMax.toFixed(2),
      "QP Cost J*": (1.4 + Rw * 0.8 + 4 / N).toFixed(2),
    };
  };

  // 23. rob_ekf_slam_loop_closure
  R.rob_ekf_slam_loop_closure = function (ctx, W, H, st) {
    st.drawHUD("EKF-SLAM trajectory & landmark 2σ covariance ellipses collapsing upon loop closure", st.spec.formula);
    const C = st.COLORS, qNoise = 0.2 + st.a * 1.2, rNoise = 0.2 + st.b * 1.0, loopW = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Pose-Landmark Factor Graph & Covariance Ellipses P₊ = (I − KH)P₋");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54, rx = w * 0.32, ry = h * 0.30;
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const px = cx + Math.cos(ang) * rx, py = cy + Math.sin(ang) * ry;
      const unc = (4 + i * 2.8 * qNoise) * (1 - 0.82 * loopW);
      ctx.strokeStyle = loopW > 0.5 ? C.ok : C.secondary;
      ctx.beginPath(); ctx.ellipse(px, py, unc, unc * 0.7, ang, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    if (loopW > 0.2) {
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.stroke();
    }
    return {
      "Max Pose σ": `${((1.8 * qNoise) * (1 - 0.78 * loopW)).toFixed(2)} m`,
      "Sensor Noise σ_r": rNoise.toFixed(2),
      "Loop Closure Gain": `${Math.round(loopW * 100)}%`,
      "Trace(P_SLAM)": ((14 * qNoise + 5 * rNoise) * (1 - 0.7 * loopW)).toFixed(2),
    };
  };

  // 24. rob_biped_zmp_lipm
  R.rob_biped_zmp_lipm = function (ctx, W, H, st) {
    st.drawHUD("Linear Inverted Pendulum (LIPM): CoM, Capture Point ξ, and ZMP support polygon", st.spec.formula);
    const C = st.COLORS, zc = 0.6 + st.a * 0.5, Tstep = 0.3 + st.b * 0.5, push = (st.c - 0.5) * 0.4;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Sagittal Biped LIPM & Foot Support Polygon (ZMP vs Capture Point ξ)");
    const groundY = y0 + h - 34, footX = x0 + w * 0.48;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(x0 + 20, groundY); ctx.lineTo(x0 + w - 20, groundY); ctx.stroke();
    // Foot support polygon
    ctx.fillStyle = "rgba(110,231,183,0.25)"; ctx.fillRect(footX - 38, groundY - 8, 76, 8);
    const omega0 = Math.sqrt(9.81 / zc);
    const sway = Math.sin(st.t * (Math.PI / Tstep)) * 18 + push * 75;
    const comX = footX + sway, comY = groundY - zc * (h * 0.55);
    const dcmX = comX + sway * 0.45;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(footX, groundY); ctx.lineTo(comX, comY); ctx.stroke();
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(comX, comY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.danger; ctx.beginPath(); ctx.arc(dcmX, groundY - 4, 6, 0, Math.PI * 2); ctx.fill();
    const stable = Math.abs(dcmX - footX) < 38;
    return {
      "Eigenfrequency ω₀": `${omega0.toFixed(2)} rad/s`,
      "Capture Point ξ": `${((dcmX - footX) / 100).toFixed(2)} m`,
      "ZMP Margin": `${((38 - Math.abs(sway)) / 100).toFixed(2)} m`,
      "Balance State": stable ? "ZMP Inside Foot" : "Step Recovery Required!",
    };
  };

  // 25. rob_jacobian_singularity_dls
  R.rob_jacobian_singularity_dls = function (ctx, W, H, st) {
    st.drawHUD("2-Link planar arm velocity manipulability ellipsoid & Damped Least Squares IK", st.spec.formula);
    const C = st.COLORS, dls = 0.02 + st.a * 0.5, sing = st.b, nullG = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Planar Manipulator & Velocity Manipulability Ellipsoid J Jᵀ");
    const bx = x0 + w * 0.34, by = y0 + h * 0.65, L1 = h * 0.28, L2 = h * 0.26;
    const q1 = 0.45, q2 = (1 - sing) * 1.35 + 0.04;
    const ex = bx + Math.cos(q1) * L1, ey = by - Math.sin(q1) * L1;
    const tx = ex + Math.cos(q1 + q2) * L2, ty = ey - Math.sin(q1 + q2) * L2;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.lineTo(tx, ty); ctx.stroke();
    const sMin = Math.max(4, Math.sin(q2) * 38);
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(tx, ty, 46, sMin, -(q1 + q2 * 0.5), 0, Math.PI * 2); ctx.stroke();
    const wManip = Math.abs(Math.sin(q2));
    return {
      "Manipulability w(q)": wManip.toFixed(3),
      "Condition Number κ(J)": (1 / Math.max(0.03, wManip)).toFixed(1),
      "DLS Damping λ": dls.toFixed(2),
      "Max Joint Rate q̇": `${(1.2 / (wManip + dls)).toFixed(2)} rad/s`,
    };
  };

  // 26. rob_rrt_star_sampling
  R.rob_rrt_star_sampling = function (ctx, W, H, st) {
    st.drawHUD("Informed RRT* tree rewiring inside prolate hyperspheroid c_best", st.spec.formula);
    const C = st.COLORS, gamma = 0.8 + st.a * 2.2, bias = st.b, clear = 12 + st.c * 20;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "RRT* Tree Rewiring & Informed Prolate Ellipsoid Sampling Domain");
    const sx = x0 + 54, sy = y0 + h * 0.54, gx = x0 + w - 54, gy = y0 + h * 0.54;
    const cx = (sx + gx) / 2, cy = sy;
    ctx.strokeStyle = "rgba(255,209,102,0.35)"; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.ellipse(cx, cy, (gx - sx) * 0.55, h * (0.42 - 0.18 * gamma / 3), 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,107,107,0.28)"; ctx.beginPath(); ctx.arc(cx, cy, clear, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 18; i++) {
      const u = (i + 1) / 19;
      const nx = sx + u * (gx - sx), ny = cy + Math.sin(i * 2.1) * (h * 0.28);
      ctx.strokeStyle = "rgba(124,156,255,0.35)";
      ctx.beginPath(); ctx.moveTo(sx + (u - 0.08) * (gx - sx), cy); ctx.lineTo(nx, ny); ctx.stroke();
    }
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy - clear - 26, gx, gy); ctx.stroke();
    return {
      "Rewire Radius γ": gamma.toFixed(2),
      "Goal Bias p_goal": (bias * 100).toFixed(0) + "%",
      "Best Path Cost c_best": (1.08 + 0.35 / gamma + clear * 0.005).toFixed(2),
      "Optimality": "Asymptotically Optimal",
    };
  };

  // 27. rob_impedance_admittance_ctrl
  R.rob_impedance_admittance_ctrl = function (ctx, W, H, st) {
    st.drawHUD("Cartesian Impedance Control: Virtual mass-spring-damper contacting stiff wall", st.spec.formula);
    const C = st.COLORS, Kd = 100 + st.a * 900, Bd = 10 + st.b * 90, Ke = 500 + st.c * 2500;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Virtual Mechanical Impedance M_d ẍ + B_d ẋ + K_d(x − x₀) = F_ext");
    const wallX = x0 + w * 0.62, cy = y0 + h * 0.45;
    ctx.fillStyle = "rgba(255,107,107,0.22)"; ctx.fillRect(wallX, y0 + 28, 28, h - 42);
    const eqX = wallX - 10 + (Kd / (Kd + Ke)) * 18;
    // Draw spring zig-zag
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 50, cy);
    for (let i = 1; i <= 12; i++) {
      ctx.lineTo(x0 + 50 + (i / 12) * (eqX - x0 - 70), cy + (i % 2 === 0 ? -10 : 10));
    }
    ctx.stroke();
    ctx.fillStyle = C.primary; ctx.fillRect(eqX - 20, cy - 18, 20, 36);
    const zeta = Bd / (2 * Math.sqrt(Kd + Ke) * 0.5);
    return {
      "Virtual Stiffness K_d": `${Math.round(Kd)} N/m`,
      "Virtual Damping B_d": `${Math.round(Bd)} Ns/m`,
      "Contact Force F_ext": `${((Kd * Ke) / (Kd + Ke) * 0.04).toFixed(1)} N`,
      "Contact Damping ζ": zeta.toFixed(2),
    };
  };

  // 28. rob_lqr_riccati_pendulum
  R.rob_lqr_riccati_pendulum = function (ctx, W, H, st) {
    st.drawHUD("Cart-Pole stabilized upright by continuous-time LQR Riccati state feedback u = −Kx", st.spec.formula);
    const C = st.COLORS, Q = 1 + st.a * 19, Rw = 0.1 + st.b * 4.9, wind = (st.c - 0.5) * 2;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Underactuated Cart-Pole & Algebraic Riccati Feedback Gain K = R⁻¹BᵀP");
    const trackY = y0 + h * 0.72, cx = x0 + w * 0.5 + wind * 24;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(x0 + 30, trackY); ctx.lineTo(x0 + w - 30, trackY); ctx.stroke();
    const gainK = Math.sqrt(Q / Rw);
    const theta = (wind * 0.22 + 0.12 * Math.sin(st.t * 3)) / (1 + 0.35 * gainK);
    ctx.fillStyle = C.primary; ctx.fillRect(cx - 28, trackY - 14, 56, 20);
    const px = cx + Math.sin(theta) * (h * 0.42), py = trackY - 14 - Math.cos(theta) * (h * 0.42);
    ctx.strokeStyle = C.accent; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx, trackY - 14); ctx.lineTo(px, py); ctx.stroke();
    ctx.fillStyle = C.secondary; ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
    return {
      "Riccati Gain ‖K‖": gainK.toFixed(2),
      "Tilt Angle θ": `${(theta * 57.3).toFixed(2)}°`,
      "Q / R Weight Ratio": (Q / Rw).toFixed(1),
      "Closed-Loop Poles": `−${(1.8 + 0.6 * gainK).toFixed(2)} ± j1.4`,
    };
  };

  // 29. rob_mecanum_holonomic_kin
  R.rob_mecanum_holonomic_kin = function (ctx, W, H, st) {
    st.drawHUD("4-Wheel Mecanum omnidirectional chassis with 45° diagonal roller force vectors", st.spec.formula);
    const C = st.COLORS, ang = st.a * Math.PI * 2, wz = (st.b - 0.5) * 2, slip = st.c * 0.4;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Holonomic Mecanum Chassis: [ω₁, ω₂, ω₃, ω₄]ᵀ = (1/r) J_m [v_x, v_y, ω_z]ᵀ");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54, cw = 110, ch = 76;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2; ctx.strokeRect(cx - cw / 2, cy - ch / 2, cw, ch);
    const vx = Math.cos(ang), vy = Math.sin(ang);
    arrow(ctx, cx, cy, cx + vx * 55 * (1 - slip), cy - vy * 55 * (1 - slip), C.ok, 3);
    const wheels = [
      { x: -cw / 2, y: -ch / 2, w: vx - vy - wz },
      { x: cw / 2, y: -ch / 2, w: vx + vy + wz },
      { x: -cw / 2, y: ch / 2, w: vx + vy - wz },
      { x: cw / 2, y: ch / 2, w: vx - vy + wz },
    ];
    wheels.forEach((wh, i) => {
      ctx.fillStyle = C.panel; ctx.strokeStyle = C.accent;
      ctx.fillRect(cx + wh.x - 10, cy + wh.y - 16, 20, 32);
      ctx.strokeRect(cx + wh.x - 10, cy + wh.y - 16, 20, 32);
      arrow(ctx, cx + wh.x, cy + wh.y, cx + wh.x + wh.w * 24, cy + wh.y, C.secondary, 2);
      ctx.fillStyle = C.text; ctx.fillText(`ω${i + 1}=${wh.w.toFixed(1)}`, cx + wh.x - 18, cy + wh.y + 28);
    });
    return {
      "Strafe Heading": `${Math.round((ang * 180) / Math.PI)}°`,
      "Yaw Rate ω_z": `${wz.toFixed(2)} rad/s`,
      "Net Speed |v|": `${(1 - slip).toFixed(2)} m/s`,
      "Wheel Speeds": wheels.map((w) => w.w.toFixed(1)).join(", "),
    };
  };

  // 30. rob_particle_filter_mcl
  R.rob_particle_filter_mcl = function (ctx, W, H, st) {
    st.drawHUD("Monte Carlo Localization (MCL) particle belief cloud & kidnapped robot recovery", st.spec.formula);
    const C = st.COLORS, sharp = 0.2 + st.a * 0.8, inj = st.b * 0.35, diff = 0.05 + st.c * 0.4;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Occupancy Floorplan, True Robot Pose (Green) & Importance-Weighted Particles");
    const rx = x0 + 60 + st.px * (w - 120), ry = y0 + 44 + st.py * (h - 76);
    for (let i = 0; i < 45; i++) {
      const randomP = i < 45 * inj;
      const px = randomP ? x0 + 30 + ((i * 73) % (w - 60)) : rx + Math.cos(i * 1.7) * diff * 65 * (1.2 - sharp);
      const py = randomP ? y0 + 34 + ((i * 47) % (h - 54)) : ry + Math.sin(i * 2.3) * diff * 65 * (1.2 - sharp);
      ctx.fillStyle = randomP ? C.accent : C.primary;
      ctx.beginPath(); ctx.arc(px, py, randomP ? 2.5 : 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(rx, ry, 8, 0, Math.PI * 2); ctx.fill();
    const neff = Math.round(45 * (0.25 + 0.65 * sharp * (1 - diff)));
    return {
      "Effective N_eff": `${neff} / 45`,
      "Random Injection": `${(inj * 100).toFixed(1)}%`,
      "Pose RMSE": `${((1 - sharp * 0.7) * diff * 0.8).toFixed(2)} m`,
      "Filter Mode": neff < 22 ? "SIR Resampling Triggered" : "Tracking Converged",
    };
  };

  // 31. rob_dubins_reeds_shepp
  R.rob_dubins_reeds_shepp = function (ctx, W, H, st) {
    st.drawHUD("Minimum-turn-radius Dubins LSL/RSR/LRL and Reeds-Shepp curvature-bounded paths", st.spec.formula);
    const C = st.COLORS, rMin = 22 + st.a * 38, psi = (st.b - 0.5) * Math.PI, rev = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `SE(2) Bounded-Curvature Geodesic (R_min = ${(rMin / 20).toFixed(2)} m)`);
    const sx = x0 + 84, sy = y0 + h * 0.55, gx = x0 + w - 94, gy = y0 + h * 0.48;
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath(); ctx.arc(sx, sy - rMin, rMin, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(gx - Math.sin(psi) * rMin, gy - Math.cos(psi) * rMin, rMin, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + rMin, sy - rMin * 1.2, gx - rMin, gy + Math.sin(psi) * rMin, gx, gy);
    ctx.stroke();
    arrow(ctx, sx, sy, sx + 26, sy, C.accent, 2.2);
    arrow(ctx, gx, gy, gx + Math.cos(psi) * 26, gy + Math.sin(psi) * 26, C.secondary, 2.2);
    const word = rev < 0.35 ? "Reeds-Shepp L⁺S⁻R⁺" : "Dubins LSL";
    return {
      "Min Turn Radius R_min": `${(rMin / 20).toFixed(2)} m`,
      "Optimal Word": word,
      "Terminal Heading ψ": `${Math.round((psi * 180) / Math.PI)}°`,
      "Path Length L*": `${(((gx - sx) + rMin * 0.9) / 40).toFixed(2)} m`,
    };
  };

  // 32. rob_grasp_force_closure
  R.rob_grasp_force_closure = function (ctx, W, H, st) {
    st.drawHUD("3-Finger grasp Coulomb friction cones & Ferrari-Canny wrench-space convex hull", st.spec.formula);
    const C = st.COLORS, mu = 0.1 + st.a * 0.9, spread = 0.4 + st.b * 0.6, preload = 5 + st.c * 25;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.50, h, `Object Contacts & Friction Cones (±atan μ = ${(Math.atan(mu) * 57.3).toFixed(0)}°)`);
    const cx = 20 + W * 0.25, cy = y0 + h * 0.54, R0 = Math.min(W * 0.16, h * 0.32);
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, Math.PI * 2); ctx.stroke();
    const angs = [0, spread * 2.1, -spread * 2.1];
    angs.forEach((a) => {
      const fx = cx + Math.cos(a) * R0, fy = cy + Math.sin(a) * R0;
      const cone = Math.atan(mu);
      ctx.fillStyle = "rgba(110,231,183,0.22)";
      ctx.beginPath(); ctx.moveTo(fx, fy);
      ctx.lineTo(fx - Math.cos(a - cone) * 48, fy - Math.sin(a - cone) * 48);
      ctx.lineTo(fx - Math.cos(a + cone) * 48, fy - Math.sin(a + cone) * 48);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(fx, fy, 6, 0, Math.PI * 2); ctx.fill();
    });
    const rx = W * 0.53, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Wrench Space Convex Hull W (Origin Inside ⇔ Force Closure)");
    const wcx = rx + rw * 0.5, wcy = y0 + h * 0.54;
    const epsQ = clamp((spread - 0.55) * 0.8 + mu * 0.5, -0.2, 0.85);
    ctx.strokeStyle = epsQ > 0 ? C.ok : C.danger; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(wcx, wcy, Math.max(8, (0.25 + epsQ) * 48), 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(wcx, wcy, 4, 0, Math.PI * 2); ctx.fill();
    return {
      "Friction Coeff μ": mu.toFixed(2),
      "Ferrari-Canny ε": Math.max(0, epsQ).toFixed(3),
      "Squeeze Preload": `${preload.toFixed(1)} N`,
      "Grasp Status": epsQ > 0 ? "Force Closure (0 ∈ int W)" : "Slip / Form Open!",
    };
  };

  // 33. rob_visual_servoing_ibvs
  R.rob_visual_servoing_ibvs = function (ctx, W, H, st) {
    st.drawHUD("Image-Based Visual Servoing (IBVS): 4 feature corners & Chaumette camera retreat", st.spec.formula);
    const C = st.COLORS, lam = 0.2 + st.a * 1.8, depthZ = 0.5 + st.b * 2.0, rot = st.c * Math.PI * 0.85;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.52, h, "Normalized Camera Image Plane: Current Features s(t) → Desired s*");
    const cx = 20 + W * 0.26, cy = y0 + h * 0.54, R0 = Math.min(W * 0.16, h * 0.30);
    for (let i = 0; i < 4; i++) {
      const aGoal = (i * Math.PI) / 2 + Math.PI / 4;
      const aStart = aGoal + rot;
      const gx = cx + Math.cos(aGoal) * R0, gy = cy + Math.sin(aGoal) * R0;
      const sx = cx + Math.cos(aStart) * R0, sy = cy + Math.sin(aStart) * R0;
      ctx.strokeStyle = C.ok; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(gx, gy); ctx.stroke();
      ctx.fillStyle = C.secondary; ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = C.accent; ctx.strokeRect(gx - 5, gy - 5, 10, 10);
    }
    const rx = W * 0.55, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "3D Optical Axis Camera Retreat ΔZ(t)");
    const retreat = (1 / Math.max(0.2, Math.cos(rot * 0.5)) - 1) * depthZ;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(rx + 28, y0 + h * 0.7);
    ctx.quadraticCurveTo(rx + rw * 0.5, y0 + h * 0.7 - retreat * 60, rx + rw - 28, y0 + h * 0.7);
    ctx.stroke();
    return {
      "Servo Gain λ": lam.toFixed(2),
      "Rotation Δφ": `${Math.round((rot * 180) / Math.PI)}°`,
      "Camera Retreat ΔZ": `${retreat.toFixed(2)} m`,
      "Interaction Matrix": `L_s(s, Z=${depthZ.toFixed(1)}m)`,
    };
  };

  // 34. rob_cpg_legged_gaits
  R.rob_cpg_legged_gaits = function (ctx, W, H, st) {
    st.drawHUD("Coupled Hopf CPG oscillator ring & quadruped footfall Hildebrand gait diagram", st.spec.formula);
    const C = st.COLORS, freq = 0.8 + st.a * 2.4, cpl = 0.5 + st.b * 2.5, duty = 0.35 + st.c * 0.45;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.44, h, "4-Limb Coupled Hopf Oscillator Phase Ring (LF, RF, LH, RH)");
    const cx = 20 + W * 0.22, cy = y0 + h * 0.54, R0 = Math.min(W * 0.15, h * 0.32);
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, Math.PI * 2); ctx.stroke();
    const offsets = duty > 0.62 ? [0, 0.5, 0.25, 0.75] : [0, 0.5, 0.5, 0]; // Walk vs Trot
    const names = ["LF", "RF", "LH", "RH"];
    offsets.forEach((off, i) => {
      const ang = (st.t * freq + off) * Math.PI * 2;
      const px = cx + Math.cos(ang) * R0, py = cy + Math.sin(ang) * R0;
      ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.text; ctx.fillText(names[i], px + 9, py + 4);
    });
    const rx = W * 0.47, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, `Footfall Stance Bars (Duty Factor β = ${duty.toFixed(2)})`);
    for (let i = 0; i < 4; i++) {
      const by = y0 + 38 + i * ((h - 54) / 4);
      ctx.fillStyle = C.text; ctx.fillText(names[i], rx + 12, by + 14);
      for (let k = 0; k < 40; k++) {
        const ph = (k / 40 + offsets[i] + st.t * freq * 0.2) % 1;
        if (ph < duty) {
          ctx.fillStyle = C.series[i];
          ctx.fillRect(rx + 42 + (k / 40) * (rw - 56), by, (rw - 56) / 40 + 1, 18);
        }
      }
    }
    return {
      "Gait Pattern": duty > 0.62 ? "Static Walk (4-beat)" : "Dynamic Trot (Diagonal)",
      "Stride Frequency ω": `${freq.toFixed(2)} Hz`,
      "Duty Factor β": `${(duty * 100).toFixed(0)}%`,
      "Phase Lock K": cpl.toFixed(2),
    };
  };

  // 35. rob_se3_pose_graph_opt
  R.rob_se3_pose_graph_opt = function (ctx, W, H, st) {
    st.drawHUD("SE(3) Lie manifold pose-graph Gauss-Newton optimization with Huber robust kernel", st.spec.formula);
    const C = st.COLORS, huber = 0.2 + st.a * 1.8, info = 0.2 + st.b * 0.8, outlier = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Unoptimized Odometry Drift (Dashed Red) vs SE(3) Manifold Optimized Trajectory (Green)");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54, R0 = Math.min(w * 0.30, h * 0.34);
    for (let mode = 0; mode < 2; mode++) {
      ctx.strokeStyle = mode === 0 ? C.danger : C.ok;
      if (mode === 0) ctx.setLineDash([4, 4]); else ctx.setLineDash([]);
      ctx.lineWidth = mode === 0 ? 1.6 : 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const u = i / 20, ang = u * Math.PI * 1.85;
        const drift = mode === 0 ? u * 45 : u * 45 * (1 - info * 0.85) + (outlier * 18) / (1 + 2 / huber);
        const px = cx + Math.cos(ang) * (R0 + drift), py = cy + Math.sin(ang) * (R0 * 0.75 + drift * 0.5);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    return {
      "Huber Threshold δ": huber.toFixed(2),
      "Loop Stiffness Ω": info.toFixed(2),
      "Chi-Square χ² Error": (18 * (1 - 0.8 * info) + outlier * 6 * huber).toFixed(2),
      "Manifold Step": "exp([ξ*]∧) ∈ SE(3)",
    };
  };

  // 36. rob_BLDC_foc_commutation
  R.rob_BLDC_foc_commutation = function (ctx, W, H, st) {
    st.drawHUD("BLDC Field-Oriented Control (FOC): 3-phase stator & Park-Clarke d-q vector at 90°", st.spec.formula);
    const C = st.COLORS, rpm = 0.5 + st.a * 3.5, iq = 0.3 + st.b * 1.2, id = (st.c - 0.5) * 0.8;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.48, h, "Rotor Flux d-Axis & 90° Quadrature Torque Current i_q");
    const cx = 20 + W * 0.24, cy = y0 + h * 0.54, R0 = Math.min(W * 0.16, h * 0.32);
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, Math.PI * 2); ctx.stroke();
    const th = st.t * rpm;
    const dx = Math.cos(th), dy = Math.sin(th);
    const qx = -Math.sin(th), qy = Math.cos(th);
    arrow(ctx, cx, cy, cx + dx * R0 * 0.75, cy + dy * R0 * 0.75, C.primary, 2.5);
    arrow(ctx, cx, cy, cx + (dx * id + qx * iq) * R0 * 0.7, cy + (dy * id + qy * iq) * R0 * 0.7, C.ok, 2.8);
    const rx = W * 0.51, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "3-Phase Inverse Clarke Currents (i_a, i_b, i_c)");
    [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach((ph, idx) => {
      ctx.strokeStyle = C.series[idx]; ctx.lineWidth = 1.8; ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const u = i / 70;
        const val = iq * Math.sin(u * 6.28 + th - ph);
        const px = rx + 18 + u * (rw - 36), py = y0 + h * 0.56 - val * (h * 0.25);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
    return {
      "Quadrature Current i_q": `${(iq * 10).toFixed(1)} A`,
      "Direct Current i_d": `${(id * 10).toFixed(1)} A`,
      "Electromagnetic Torque": `${(1.5 * 7 * 0.08 * iq * 10).toFixed(2)} N·m`,
      "Torque Efficiency": `${Math.round((iq / Math.hypot(iq, id)) * 100)}%`,
    };
  };

  // 37. rob_complementary_imu_fusion
  R.rob_complementary_imu_fusion = function (ctx, W, H, st) {
    st.drawHUD("IMU Attitude Filter: High-pass Gyro integration + Low-pass Accelerometer gravity", st.spec.formula);
    const C = st.COLORS, fc = 0.2 + st.a * 2.5, bias = st.b * 1.5, vib = st.c * 1.2;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.44, h, "Artificial Horizon: True Pitch/Roll vs Drifting Gyro vs Fused SO(3)");
    const cx = 20 + W * 0.22, cy = y0 + h * 0.54, R0 = Math.min(W * 0.16, h * 0.32);
    const trueRoll = Math.sin(st.t * 1.4) * 0.4;
    const gyroRoll = trueRoll + bias * 0.35;
    const fusedRoll = trueRoll + (bias * 0.08) / fc + vib * 0.05 * Math.sin(st.t * 19);
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, Math.PI * 2); ctx.stroke();
    const drawHorizon = (ang, col, w) => {
      ctx.strokeStyle = col; ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(ang) * R0, cy - Math.sin(ang) * R0);
      ctx.lineTo(cx + Math.cos(ang) * R0, cy + Math.sin(ang) * R0);
      ctx.stroke();
    };
    drawHorizon(gyroRoll, C.danger, 1.5);
    drawHorizon(fusedRoll, C.ok, 3.0);
    const rx = W * 0.47, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Complementary Bode Crossover: LPF(Accel) + HPF(Gyro) = 1");
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 70; i++) {
      const u = i / 70, lpf = 1 / (1 + Math.pow(u * 4 / fc, 2));
      const px = rx + 18 + u * (rw - 36), py = y0 + h - 26 - lpf * (h - 58);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "Crossover f_c": `${fc.toFixed(2)} Hz`,
      "Gyro Bias b̂": `${(bias * 2.5).toFixed(2)} °/s`,
      "Attitude Error": `${(Math.abs(fusedRoll - trueRoll) * 57.3).toFixed(2)}°`,
      "SO(3) Norm ‖q‖": "1.0000",
    };
  };

  // 38. rob_artificial_potential_bug
  R.rob_artificial_potential_bug = function (ctx, W, H, st) {
    st.drawHUD("Artificial Potential Field (APF) local minimum in U-trap vs Harmonic Laplace potential", st.spec.formula);
    const C = st.COLORS, katt = 0.5 + st.a * 2.0, krep = 0.5 + st.b * 2.5, harm = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Concave U-Shaped Obstacle Trap: Standard APF (Stuck) vs Harmonic Streamline (Escapes)");
    const ux = x0 + w * 0.48, uy = y0 + h * 0.54;
    ctx.strokeStyle = C.danger; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(ux - 50, uy - 44); ctx.lineTo(ux + 30, uy - 44);
    ctx.lineTo(ux + 30, uy + 44); ctx.lineTo(ux - 50, uy + 44); ctx.stroke();
    const sx = x0 + 54, sy = uy, gx = x0 + w - 58, gy = uy;
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(gx, gy, 9, 0, Math.PI * 2); ctx.fill();
    // Standard APF path into trap
    ctx.strokeStyle = C.secondary; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ux - 4, uy); ctx.stroke(); ctx.setLineDash([]);
    // Harmonic path
    if (harm > 0.35) {
      ctx.strokeStyle = C.ok; ctx.lineWidth = 2.8;
      ctx.beginPath(); ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(ux - 80, uy - 95, ux + 80, uy - 95, gx, gy);
      ctx.stroke();
    }
    return {
      "Attractive Gain k_att": katt.toFixed(2),
      "Repulsive Gain k_rep": krep.toFixed(2),
      "Harmonic Mode ∇²φ=0": harm > 0.35 ? "Active (Zero Local Minima)" : "Disabled (Trapped!)",
      "Goal Distance": harm > 0.35 ? "0.00 m (Reached)" : "1.42 m (Stuck in U-trap)",
    };
  };

  // 39. rob_consensus_olfati_saber
  R.rob_consensus_olfati_saber = function (ctx, W, H, st) {
    st.drawHUD("Multi-robot proximity graph G(t), Olfati-Saber flocking & Fiedler eigenvalue λ₂(L)", st.spec.formula);
    const C = st.COLORS, rComm = 70 + st.a * 110, gain = 0.3 + st.b * 1.7, delay = st.c * 0.5;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `Dynamic Proximity Graph G(t) & Consensus Rendezvous (R_comm = ${Math.round(rComm)} px)`);
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54;
    const spread = Math.max(24, (110 - gain * 35 + delay * 50) * (0.7 + 0.3 * Math.cos(st.t)));
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + st.t * 0.35;
      pts.push({ x: cx + Math.cos(a) * spread, y: cy + Math.sin(a) * spread * 0.75 });
    }
    let edges = 0;
    ctx.strokeStyle = "rgba(124,156,255,0.35)"; ctx.lineWidth = 1.4;
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < rComm) {
          edges++;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
    }
    pts.forEach((p, i) => {
      ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
    });
    const lam2 = clamp((edges - 7) * 0.18, 0, 4.5);
    return {
      "Fiedler Value λ₂(L)": lam2.toFixed(2),
      "Active Comm Links": `${edges} / 28`,
      "Convergence Rate": `exp(−${(lam2 * gain).toFixed(2)} t)`,
      "Graph Topology": lam2 > 0 ? "Connected Consensus" : "Disconnected Partition!",
    };
  };

  // 40. rob_teleop_wave_variables
  R.rob_teleop_wave_variables = function (ctx, W, H, st) {
    st.drawHUD("Bilateral haptic teleoperation across delay T stabilized by scattering wave variables", st.spec.formula);
    const C = st.COLORS, delay = Math.round(20 + st.a * 380), waveB = 5 + st.b * 45, match = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `Niemeyer-Slotine Wave Transmission Line (2T = ${delay} ms, Wave Impedance b = ${waveB.toFixed(0)})`);
    const lx = x0 + 68, rx = x0 + w - 68, my = y0 + h * 0.45;
    ctx.fillStyle = C.primary; ctx.fillRect(lx - 24, my - 24, 48, 48);
    ctx.fillStyle = C.secondary; ctx.fillRect(rx - 24, my - 24, 48, 48);
    ctx.fillStyle = C.text; ctx.fillText("Master x_m", lx - 26, my + 38); ctx.fillText("Slave x_s", rx - 22, my + 38);
    // Forward wave u_m and backward wave v_s
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60, px = lx + 28 + u * (rx - lx - 56);
      const py = my - 14 + Math.sin(u * 10 - st.t * 5) * 10;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60, px = lx + 28 + u * (rx - lx - 56);
      const py = my + 14 + Math.sin(u * 10 + st.t * 5) * 10 * (1 - 0.5 * match);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "Round-Trip Delay 2T": `${delay} ms`,
      "Wave Impedance b": `${waveB.toFixed(1)} Ns/m`,
      "Wave Reflection |R|": (1 - match).toFixed(2),
      "Passivity": "Strictly Passive (∀T > 0)",
    };
  };

  // ==================== 3. PHILOSOPHY (20) ====================

  // 41. phil_newcomb_paradox
  R.phil_newcomb_paradox = function (ctx, W, H, st) {
    st.drawHUD("Newcomb's Paradox: Opaque Box B ($1M) + Transparent Box A vs Predictor Omega", st.spec.formula);
    const C = st.COLORS, acc = 0.5 + st.a * 0.49, boxA = Math.round(1 + st.b * 99), rho = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `Omega Predictor Accuracy α = ${(acc * 100).toFixed(1)}%  |  Box A = $${boxA}k, Box B = $1,000k`);
    const euEDT1 = acc * 1000, euEDT2 = (1 - acc) * 1000 + boxA;
    const euCDT1 = 500, euCDT2 = 500 + boxA;
    ctx.fillStyle = "rgba(124,156,255,0.22)"; ctx.strokeStyle = C.primary; ctx.lineWidth = 2;
    ctx.fillRect(x0 + 36, y0 + 48, 96, 64); ctx.strokeRect(x0 + 36, y0 + 48, 96, 64);
    ctx.fillStyle = "rgba(255,209,102,0.22)"; ctx.strokeStyle = C.accent;
    ctx.fillRect(x0 + 152, y0 + 48, 110, 64); ctx.strokeRect(x0 + 152, y0 + 48, 110, 64);
    ctx.fillStyle = C.text;
    ctx.fillText(`Box A: $${boxA}k`, x0 + 50, y0 + 84);
    ctx.fillText("Box B: $1M / $0", x0 + 162, y0 + 84);
    // Bars comparing EDT vs CDT
    const bx = x0 + 300, bw = w - 330;
    const drawBar = (y, label, val, col) => {
      ctx.fillStyle = col; ctx.fillRect(bx, y, clamp((val / 1100) * bw, 10, bw), 22);
      ctx.fillStyle = C.text; ctx.fillText(`${label}: $${val.toFixed(0)}k`, bx + 8, y + 15);
    };
    drawBar(y0 + 44, "EDT One-Box", euEDT1, C.ok);
    drawBar(y0 + 74, "EDT Two-Box", euEDT2, C.secondary);
    drawBar(y0 + 110, "CDT Dominance (2-Box)", euCDT2, C.primary);
    return {
      "EU_EDT(One-Box)": `$${euEDT1.toFixed(1)}k`,
      "EU_EDT(Two-Box)": `$${euEDT2.toFixed(1)}k`,
      "EDT Choice": euEDT1 >= euEDT2 ? "One-Box ($1M)" : "Two-Box",
      "CDT Choice": `Two-Box (+$${boxA}k Dominance)`,
    };
  };

  // 42. phil_skyrms_stag_hunt
  R.phil_skyrms_stag_hunt = function (ctx, W, H, st) {
    st.drawHUD("Skyrms Stag Hunt evolutionary phase line & Rousseau basin of attraction", st.spec.formula);
    const C = st.COLORS, stag = 3 + st.a * 5, hare = 1 + st.b * 3, assort = st.c * 0.5;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    const xStar = clamp((hare / stag) * (1 - assort), 0.08, 0.92);
    st.panel(x0, y0, w, h, `Replicator Potential Landscape & Unstable Separatrix x* = ${xStar.toFixed(2)}`);
    const ox = x0 + 44, oy = y0 + h * 0.65, pw = w - 88;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const pot = -Math.pow(u - xStar, 2) * (1 - 0.5 * Math.pow(u - xStar, 2));
      const px = ox + u * pw, py = oy + pot * 160;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = C.danger; ctx.beginPath(); ctx.arc(ox, oy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(ox + xStar * pw, oy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(ox + pw, oy, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.text;
    ctx.fillText("Hare All-Defect (0)", ox - 12, oy + 22);
    ctx.fillText(`Tipping Point x*=${xStar.toFixed(2)}`, ox + xStar * pw - 42, oy - 14);
    ctx.fillText("Stag Social Contract (1)", ox + pw - 90, oy + 22);
    return {
      "Stag Payoff S": stag.toFixed(1),
      "Hare Payoff H": hare.toFixed(1),
      "Separatrix x*": xStar.toFixed(2),
      "Stag Basin Width": `${((1 - xStar) * 100).toFixed(0)}%`,
    };
  };

  // 43. phil_condorcet_jury_epistemic
  R.phil_condorcet_jury_epistemic = function (ctx, W, H, st) {
    st.drawHUD("Condorcet Jury Theorem: Majority accuracy P(Maj_N) under competence p & correlation ρ", st.spec.formula);
    const C = st.COLORS, p = 0.35 + st.a * 0.45, rho = st.b * 0.6, maxN = Math.round(5 + st.c * 46) | 1;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `Collective Epistemic Reliability vs Jury Size N (Competence p = ${p.toFixed(2)})`);
    const ox = x0 + 44, oy = y0 + h - 26, pw = w - 68, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    ctx.strokeStyle = p > 0.5 ? C.ok : C.danger; ctx.lineWidth = 2.6; ctx.beginPath();
    let finalP = p;
    for (let i = 0; i <= 60; i++) {
      const n = 1 + (i / 60) * maxN;
      const nEff = n / (1 + (n - 1) * rho);
      const z = ((p - 0.5) * Math.sqrt(nEff)) / Math.sqrt(p * (1 - p));
      const maj = 1 / (1 + Math.exp(-3.4 * z));
      if (i === 60) finalP = maj;
      const px = ox + (i / 60) * pw, py = oy - maj * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "Individual Competence p": p.toFixed(2),
      "Jury Size N": String(maxN),
      "Effective Independent N": (maxN / (1 + (maxN - 1) * rho)).toFixed(1),
      "Majority Reliability": `${(finalP * 100).toFixed(1)}%`,
    };
  };

  // 44. phil_arrow_impossibility
  R.phil_arrow_impossibility = function (ctx, W, H, st) {
    st.drawHUD("Arrow's Impossibility Theorem: Condorcet Rock-Paper-Scissors cycle A ≻ B ≻ C ≻ A", st.spec.formula);
    const C = st.COLORS, polar = st.a, spoiler = st.b, borda = st.c;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.48, h, "Pairwise Majority Tournament Graph (Condorcet Paradox Cycle)");
    const cx = 20 + W * 0.24, cy = y0 + h * 0.56, R0 = Math.min(W * 0.15, h * 0.30);
    const pts = [0, 1, 2].map((i) => ({
      x: cx + Math.cos((i * 2 * Math.PI) / 3 - Math.PI / 2) * R0,
      y: cy + Math.sin((i * 2 * Math.PI) / 3 - Math.PI / 2) * R0,
      lbl: ["A", "B", "C"][i],
    }));
    for (let i = 0; i < 3; i++) {
      const n = (i + 1) % 3;
      arrow(ctx, pts[i].x, pts[i].y, pts[n].x, pts[n].y, polar > 0.35 ? C.danger : C.ok, 2.2);
      ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f1222"; ctx.font = "bold 12px sans-serif"; ctx.fillText(pts[i].lbl, pts[i].x - 4, pts[i].y + 4);
    }
    const rx = W * 0.51, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Plurality vs Borda Winner under Spoiler Entry (IIA Test)");
    const sA = 42 - spoiler * 14, sB = 38 + borda * 8, sC = 20 + spoiler * 14;
    [sA, sB, sC].forEach((s, i) => {
      const bh = (s / 55) * (h - 58);
      ctx.fillStyle = C.series[i];
      ctx.fillRect(rx + 28 + i * 64, y0 + h - 24 - bh, 42, bh);
      ctx.fillStyle = C.text; ctx.fillText(`${["A", "B", "C"][i]}:${s.toFixed(0)}`, rx + 30 + i * 64, y0 + h - 8);
    });
    return {
      "Condorcet Winner": polar > 0.35 ? "None (Cyclic A≻B≻C≻A)" : "Candidate A",
      "Borda Winner": sB > sA ? "Candidate B" : "Candidate A",
      "IIA Axiom": spoiler > 0.3 ? "Violated by Spoiler!" : "Satisfied",
      "Dictatorship": "Non-Dictatorial",
    };
  };

  // 45. phil_parfit_repugnant_conclusion
  R.phil_parfit_repugnant_conclusion = function (ctx, W, H, st) {
    st.drawHUD("Parfit's Repugnant Conclusion: World A (high quality) → World Z (vast barely-worth-living)", st.spec.formula);
    const C = st.COLORS, crit = st.a * 4, alpha = 0.2 + st.b * 0.8, el = 0.7 + st.c * 0.5;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Population Size N (Width) × Quality of Life u (Height) across Worlds A → Z");
    const oy = y0 + h - 28;
    let xCur = x0 + 24;
    for (let k = 0; k < 6; k++) {
      const bw = 20 + k * 22;
      const uVal = 10 * Math.pow(0.68, k);
      const bh = (uVal / 10) * (h - 62);
      ctx.fillStyle = uVal > crit ? C.series[k] + "88" : "rgba(255,107,107,0.35)";
      ctx.strokeStyle = C.series[k];
      ctx.fillRect(xCur, oy - bh, bw, bh); ctx.strokeRect(xCur, oy - bh, bw, bh);
      ctx.fillStyle = C.text; ctx.fillText( k === 0 ? "A" : k === 5 ? "Z" : String.fromCharCode(65 + k), xCur + 6, oy - 6);
      xCur += bw + 10;
    }
    const cY = oy - (crit / 10) * (h - 62);
    ctx.strokeStyle = C.danger; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(x0 + 18, cY); ctx.lineTo(x0 + w - 18, cY); ctx.stroke(); ctx.setLineDash([]);
    return {
      "Total Utility W_total": "World Z > World A",
      "Average Utility W_avg": "World A (10.0) > Z (1.4)",
      "Critical Level c": crit.toFixed(2),
      "Critical-Level Choice": crit > 1.5 ? "Rejects Z (Avoids Repugnant)" : "Prefers Z",
    };
  };

  // 46. phil_gettier_epistemic_safety
  R.phil_gettier_epistemic_safety = function (ctx, W, H, st) {
    st.drawHUD("Modal possible-world space around w₀: Gettier double-luck vs Williamson Safety B_ε(w₀)", st.spec.formula);
    const C = st.COLORS, rTruth = 55 + st.a * 45, rModal = 24 + st.b * 55, luck = st.c * 60;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Modal Space around Actual World w₀: Truth Region T(p) vs Safety Neighborhood B_ε(w₀)");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54;
    ctx.fillStyle = "rgba(110,231,183,0.18)"; ctx.strokeStyle = C.ok; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx - luck, cy, rTruth, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.setLineDash([5, 4]); ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(cx, cy, rModal, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillText("w₀ (Actual)", cx + 8, cy + 4);
    const safe = luck + rModal <= rTruth;
    const trueAtW0 = luck <= rTruth;
    return {
      "True in Actual w₀": trueAtW0 ? "Yes (True Belief)" : "False",
      "Modal Safety B_ε ⊆ T": safe ? "Safe (Knowledge!)" : "Unsafe (Nearby False Worlds)",
      "Nozick Sensitivity": luck > 25 ? "Fails Tracking" : "Tracks Truth",
      "Epistemic Status": trueAtW0 && !safe ? "Gettier Case (Lucky JTB)" : safe ? "Genuine Knowledge" : "Ignorance",
    };
  };

  // 47. phil_kripke_modal_frames
  R.phil_kripke_modal_frames = function (ctx, W, H, st) {
    st.drawHUD("Kripke Relational Frames ⟨W, R, V⟩ across Modal Logic Systems K, T, S4, S5", st.spec.formula);
    const C = st.COLORS, deg = st.a, valP = st.b, sym = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    const sys = deg < 0.25 ? "K (Minimal)" : deg < 0.5 ? "T (Reflexive □p→p)" : deg < 0.75 ? "S4 (Transitive □p→□□p)" : "S5 (Equivalence ◇p→□◇p)";
    st.panel(x0, y0, w, h, `Kripke Possible Worlds W = {w₁, w₂, w₃, w₄}  |  Active System: ${sys}`);
    const cx = x0 + w * 0.42, cy = y0 + h * 0.55, R0 = Math.min(w * 0.24, h * 0.30);
    const worlds = [0, 1, 2, 3].map((i) => ({
      x: cx + Math.cos((i * Math.PI) / 2) * R0,
      y: cy + Math.sin((i * Math.PI) / 2) * R0,
      p: (i / 4) < valP,
    }));
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      arrow(ctx, worlds[i].x, worlds[i].y, worlds[next].x, worlds[next].y, C.primary, 1.8);
      if (sym > 0.5 || deg > 0.75) arrow(ctx, worlds[next].x, worlds[next].y, worlds[i].x, worlds[i].y, C.secondary, 1.4);
      ctx.fillStyle = worlds[i].p ? C.ok : C.danger;
      ctx.beginPath(); ctx.arc(worlds[i].x, worlds[i].y, 16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f1222"; ctx.font = "bold 11px monospace";
      ctx.fillText(`w${i + 1}:${worlds[i].p ? "p" : "¬p"}`, worlds[i].x - 14, worlds[i].y + 4);
    }
    const allP = worlds.every((w) => w.p);
    const someP = worlds.some((w) => w.p);
    return {
      "Modal Logic System": sys,
      "w₁ ⊨ □p (Necessary)": allP ? "True" : "False",
      "w₁ ⊨ ◇p (Possible)": someP ? "True" : "False",
      "S5 Axiom ◇p → □◇p": deg > 0.75 || sym > 0.6 ? "Valid on Frame" : "Countermodel Found",
    };
  };

  // 48. phil_tarski_liar_fixed_point
  R.phil_tarski_liar_fixed_point = function (ctx, W, H, st) {
    st.drawHUD("Tarski Liar Paradox L ↔ ¬True(⌜L⌝): Classical Oscillation vs Kripke K₃ Fixed Point ½", st.spec.formula);
    const C = st.COLORS, damp = st.a, cpl = st.b, dial = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Truth-Value Revision Trajectory T^(k)(L) across Ordinal Stages k = 0..12");
    const ox = x0 + 44, oy = y0 + h - 28, pw = w - 70, ph = h - 60;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    let v = 0.05;
    ctx.strokeStyle = damp > 0.45 ? C.ok : C.secondary; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let k = 0; k <= 14; k++) {
      const px = ox + (k / 14) * pw, py = oy - v * ph;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
      v = damp * 0.5 + (1 - damp) * (1 - v);
    }
    ctx.stroke();
    return {
      "Liar Valuation |L|": v.toFixed(3),
      "Truth Theory": damp > 0.45 ? "Kripke Strong Kleene K₃" : dial > 0.5 ? "Priest LP Dialetheism" : "Gupta-Belnap Revision",
      "Fixed Point Φ(S)=S": damp > 0.45 ? "Reached (½ Gap)" : "2-Cycle Oscillation",
      "Tarski Hierarchy": "Self-Reference Active",
    };
  };

  // 49. phil_duhem_quine_holism
  R.phil_duhem_quine_holism = function (ctx, W, H, st) {
    st.drawHUD("Duhem-Quine Web of Belief: Peripheral empirical shock absorbed by auxiliary belt", st.spec.formula);
    const C = st.COLORS, stiff = 0.2 + st.a * 0.8, shock = 0.2 + st.b * 0.8, conserv = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Concentric Web of Belief: Hard Core H (Center), Auxiliary Belt Aᵢ, Sensory Periphery O");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54;
    [32, 74, 116].forEach((r, idx) => {
      ctx.strokeStyle = idx === 0 ? C.accent : idx === 1 ? C.primary : C.danger;
      ctx.lineWidth = idx === 0 ? 2.5 : 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 116, cy + Math.sin(a) * 116); ctx.stroke();
      ctx.fillStyle = i === 0 ? C.danger : C.ok;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 74, cy + Math.sin(a) * 74, 6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
    const coreStress = shock * (1 - 0.8 * stiff) * (1 - 0.5 * conserv);
    return {
      "Hard-Core Stress": (coreStress * 100).toFixed(1) + "%",
      "Auxiliary Belt Revision": `${Math.round(shock * 85)}% absorbed`,
      "Minimum Mutilation α": conserv.toFixed(2),
      "Paradigm Status": coreStress > 0.45 ? "Kuhn Crisis / Core Shift!" : "Lakatos Protective Belt Holds",
    };
  };

  // 50. phil_Hume_Lewis_convention
  R.phil_Hume_Lewis_convention = function (ctx, W, H, st) {
    st.drawHUD("David Lewis Signaling Game: Spontaneous emergence of convention from babbling", st.spec.formula);
    const C = st.COLORS, eps = st.a * 0.4, skew = st.b * 0.6, cost = st.c * 0.4;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "States {S₁,S₂,S₃} → Signals {m₁,m₂,m₃} → Receiver Actions {A₁,A₂,A₃}");
    const cols = [x0 + w * 0.18, x0 + w * 0.50, x0 + w * 0.82];
    const sep = clamp(1 - eps * 1.6 - cost * 0.7, 0.25, 0.98);
    for (let i = 0; i < 3; i++) {
      const y = y0 + 52 + i * ((h - 80) / 2);
      arrow(ctx, cols[0] + 18, y, cols[1] - 18, y, C.series[i], 1.5 + sep * 2.5);
      arrow(ctx, cols[1] + 18, y, cols[2] - 18, y, C.series[i], 1.5 + sep * 2.5);
      cols.forEach((cx, cIdx) => {
        ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(cx, y, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0f1222"; ctx.font = "bold 11px monospace";
        ctx.fillText(["S", "m", "A"][cIdx] + (i + 1), cx - 8, y + 4);
      });
    }
    return {
      "Communicative Success": `${(sep * 100).toFixed(1)}%`,
      "Mutual Information I(S;M)": `${(sep * 1.58).toFixed(2)} bits`,
      "Equilibrium Type": sep > 0.7 ? "Separating Lewis Convention" : "Pooling / Partial Babbling",
      "Mutation Noise ε": eps.toFixed(2),
    };
  };

  // 51. phil_no_cloning_identity
  R.phil_no_cloning_identity = function (ctx, W, H, st) {
    st.drawHUD("Parfit's Teletransporter & Hemispheric Fission: Ego Theory vs Relation R", st.spec.formula);
    const C = st.COLORS, rep = st.a, sym = st.b, dec = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Personal Identity Worldline: Pre-Fission Person P₀ → Left Branch P_L & Right Branch P_R");
    const sx = x0 + 60, my = y0 + h * 0.54, fx = x0 + w * 0.46, ex = x0 + w - 60;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(sx, my); ctx.lineTo(fx, my); ctx.stroke();
    ctx.strokeStyle = C.ok; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(fx, my); ctx.quadraticCurveTo(fx + 60, my - 56, ex, my - 56); ctx.stroke();
    if (sym > 0.15) {
      ctx.strokeStyle = C.secondary; ctx.lineWidth = 4 * sym;
      ctx.beginPath(); ctx.moveTo(fx, my); ctx.quadraticCurveTo(fx + 60, my + 56, ex, my + 56); ctx.stroke();
    }
    const rScore = clamp((1 - 0.35 * dec) * (1 - 0.15 * rep), 0.1, 1.0);
    return {
      "Parfit Relation R": `${(rScore * 100).toFixed(0)}% Continuity`,
      "Branching Symmetry": `${(sym * 100).toFixed(0)}%`,
      "Strict Identity (1-to-1)": sym > 0.35 ? "Violated (Fission Double!)" : "Unique Survivor",
      "Parfit Verdict": "Relation R Matters, Not Identity",
    };
  };

  // 52. phil_sleeping_beauty_credence
  R.phil_sleeping_beauty_credence = function (ctx, W, H, st) {
    st.drawHUD("Sleeping Beauty Problem: Monday/Tuesday anthropic awakenings (Thirder vs Halfer)", st.spec.formula);
    const C = st.COLORS, clones = Math.round(2 + st.a * 4), priorH = 0.2 + st.b * 0.6, stake = 1 + st.c * 9;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    const pThirder = priorH / (priorH + (1 - priorH) * clones);
    st.panel(x0, y0, w, h, `Centered World Awakening Tree (Tails Awakenings M = ${clones})`);
    const rx = x0 + 70, ry = y0 + h * 0.54;
    const hx = x0 + w * 0.52, hy = y0 + h * 0.28, tx = x0 + w * 0.52, ty = y0 + h * 0.72;
    arrow(ctx, rx, ry, hx, hy, C.ok, 2.4);
    arrow(ctx, rx, ry, tx, ty, C.secondary, 2.4);
    ctx.fillStyle = C.ok; ctx.fillRect(hx + 16, hy - 14, 120, 28);
    ctx.fillStyle = "#0f1222"; ctx.fillText("Heads: Mon Awake (1)", hx + 24, hy + 4);
    for (let m = 0; m < clones; m++) {
      const by = ty - 28 + m * 22;
      ctx.fillStyle = C.secondary; ctx.fillRect(tx + 16, by, 135, 18);
      ctx.fillStyle = "#0f1222"; ctx.fillText(`Tails: Awake #${m + 1}`, tx + 24, by + 13);
    }
    return {
      "Elga Thirder P(H|Awake)": pThirder.toFixed(3),
      "Lewis Halfer P(H|Awake)": priorH.toFixed(3),
      "Tails Awakenings M": String(clones),
      "Repeated Betting EV": `Thirder Fair Odds 1:${clones}`,
    };
  };

  // 53. phil_popper_verisimilitude
  R.phil_popper_verisimilitude = function (ctx, W, H, st) {
    st.drawHUD("Popperian Falsifiability, Risky Predictions & Niiniluoto Verisimilitude Target", st.spec.formula);
    const C = st.COLORS, bold = 0.2 + st.a * 0.75, sev = 0.2 + st.b * 0.75, acc = 0.2 + st.c * 0.78;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Logical Space of Possibilities: Complete Truth T* vs Theory Content Ring");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54;
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.arc(cx, cy, 96, 0, Math.PI * 2); ctx.stroke();
    const rTheory = (1 - bold) * 90 + 8;
    const tx = cx + (1 - acc) * 55, ty = cy;
    ctx.fillStyle = "rgba(124,156,255,0.24)"; ctx.strokeStyle = C.primary; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tx, ty, rTheory, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillText("T* (Truth)", cx + 10, cy + 4);
    const verisim = clamp(0.5 * bold + 0.5 * acc, 0.1, 0.99);
    return {
      "Empirical Content 1−P(H)": bold.toFixed(2),
      "Corroboration C(H,E)": ((bold * sev) / (1 + 0.3 * (1 - acc))).toFixed(2),
      "Truthlikeness Vs(H)": verisim.toFixed(3),
      "Popperian Status": bold > 0.65 ? "Bold Falsifiable Theory" : "Ad-Hoc / Tautological",
    };
  };

  // 54. phil_goodman_grue_induction
  R.phil_goodman_grue_induction = function (ctx, W, H, st) {
    st.drawHUD("Goodman's New Riddle of Induction: 'All emeralds are Green' vs 'Grue' at t = T", st.spec.formula);
    const C = st.COLORS, kom = 0.1 + st.a * 2.5, tCrit = 0.35 + st.b * 0.4, obs = Math.round(5 + st.c * 45);
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `Inductive Projection Across Critical Time T (Observed Emeralds N = ${obs})`);
    const tx = x0 + 44 + tCrit * (w - 88), cy = y0 + h * 0.48;
    ctx.strokeStyle = C.accent; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(tx, y0 + 28); ctx.lineTo(tx, y0 + h - 24); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.ok; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x0 + 44, cy - 18); ctx.lineTo(x0 + w - 44, cy - 18); ctx.stroke();
    ctx.strokeStyle = C.ok; ctx.beginPath(); ctx.moveTo(x0 + 44, cy + 22); ctx.lineTo(tx, cy + 22); ctx.stroke();
    ctx.strokeStyle = C.primary; ctx.beginPath(); ctx.moveTo(tx, cy + 22); ctx.lineTo(x0 + w - 44, cy + 52); ctx.stroke();
    const pGreen = 1 / (1 + Math.exp(-kom * 1.8));
    return {
      "Solomonoff P(Green|D)": (pGreen * 100).toFixed(1) + "%",
      "Solomonoff P(Grue|D)": ((1 - pGreen) * 100).toFixed(1) + "%",
      "Complexity Penalty ΔK": `${(kom * 2.4).toFixed(1)} bits`,
      "Post-T Prediction": pGreen > 0.55 ? "Green (Natural Kind)" : "Ambiguous Grue!",
    };
  };

  // 55. phil_IIT_phi_consciousness
  R.phil_IIT_phi_consciousness = function (ctx, W, H, st) {
    st.drawHUD("Integrated Information Theory (IIT Φ): Recurrent network vs Minimum Information Partition", st.spec.formula);
    const C = st.COLORS, rec = st.a, mod = st.b, noise = st.c * 0.5;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Thalamocortical Recurrent Graph & Minimum Information Partition (MIP Cut)");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54, R0 = Math.min(w * 0.26, h * 0.32);
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * R0, y: cy + Math.sin(a) * R0 });
    }
    ctx.strokeStyle = "rgba(124,156,255,0.4)"; ctx.lineWidth = 1.6;
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        if (rec > 0.3 || j === i + 1) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
    }
    ctx.strokeStyle = C.danger; ctx.setLineDash([5, 4]); ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(cx, y0 + 28); ctx.lineTo(cx, y0 + h - 20); ctx.stroke(); ctx.setLineDash([]);
    pts.forEach((p, i) => {
      ctx.fillStyle = i < 4 ? C.ok : C.primary; ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
    });
    const phi = clamp(rec * mod * (1 - noise) * 4.2, 0, 4.2);
    return {
      "Integrated Info Φ": `${phi.toFixed(2)} bits`,
      "Recurrent Density": (rec * 100).toFixed(0) + "%",
      "Cross-MIP Coupling": (mod * 100).toFixed(0) + "%",
      "System Architecture": phi > 0.8 ? "Irreducible Conscious Complex" : "Reducible / Feedforward (Φ≈0)",
    };
  };

  // 56. phil_pascal_st_petersburg
  R.phil_pascal_st_petersburg = function (ctx, W, H, st) {
    st.drawHUD("St. Petersburg Paradox & Pascal's Mugging: Unbounded linear EV vs Log/CARA Utility", st.spec.formula);
    const C = st.COLORS, alpha = 0.1 + st.a * 1.9, decay = 0.8 + st.b * 0.6, w0 = 2 + st.c * 18;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Per-Flip Expected Contribution p_n · U(W₀ + 2^n) across Coin Flips n = 1..12");
    const ox = x0 + 44, oy = y0 + h - 26, pw = w - 68, ph = h - 58;
    let ceSum = 0;
    for (let n = 1; n <= 12; n++) {
      const bx = ox + ((n - 1) / 12) * pw, bw = pw / 14;
      const linTerm = Math.pow(2, n * (1 - decay));
      const logTerm = Math.pow(2, -n * decay) * Math.log(w0 + Math.pow(2, n));
      ceSum += logTerm;
      ctx.fillStyle = C.danger;
      ctx.fillRect(bx, oy - clamp(linTerm * 28, 4, ph), bw * 0.45, clamp(linTerm * 28, 4, ph));
      ctx.fillStyle = C.ok;
      ctx.fillRect(bx + bw * 0.48, oy - clamp(logTerm * 45, 3, ph), bw * 0.45, clamp(logTerm * 45, 3, ph));
    }
    return {
      "Linear Expected Value": decay <= 1.0 ? "∞ (Divergent!)" : `$${(2 / (Math.pow(2, decay) - 2)).toFixed(2)}`,
      "Log Utility Certainty Eq": `$${(Math.exp(ceSum) - w0 + 4).toFixed(2)}`,
      "Baseline Wealth W₀": `$${w0.toFixed(0)}`,
      "Fanatical Dominance": alpha > 0.5 ? "Resolved by Bounded Utility" : "Vulnerable to Mugging",
    };
  };

  // 57. phil_SEN_capabilities_pareto
  R.phil_SEN_capabilities_pareto = function (ctx, W, H, st) {
    st.drawHUD("Amartya Sen's Liberal Paradox: Pareto Optimality vs Personal Liberty Cycle", st.spec.formula);
    const C = st.COLORS, meddle = st.a, rights = st.b, trade = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Lady Chatterley's Lover Game: Outcomes {o_P (Prude reads), o_L (Lewd reads), o_0 (Neither)}");
    const cx = x0 + w * 0.5, cy = y0 + h * 0.54, R0 = Math.min(w * 0.25, h * 0.30);
    const nodes = [
      { x: cx, y: cy - R0, l: "o_0 (Neither Reads)" },
      { x: cx + R0 * 1.1, y: cy + R0 * 0.7, l: "o_P (Prude Reads)" },
      { x: cx - R0 * 1.1, y: cy + R0 * 0.7, l: "o_L (Lewd Reads)" },
    ];
    arrow(ctx, nodes[0].x, nodes[0].y, nodes[2].x, nodes[2].y, C.ok, 2.2);
    arrow(ctx, nodes[1].x, nodes[1].y, nodes[0].x, nodes[0].y, C.primary, 2.2);
    if (meddle > 0.45 && rights < 0.7) arrow(ctx, nodes[2].x, nodes[2].y, nodes[1].x, nodes[1].y, C.danger, 2.2);
    nodes.forEach((n, i) => {
      ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(n.x, n.y, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.text; ctx.fillText(n.l, n.x - 42, n.y + 24);
    });
    const cycle = meddle > 0.45 && rights < 0.7 && trade < 0.6;
    return {
      "Social Preference": cycle ? "Cycle: o_L ≻ o_P ≻ o_0 ≻ o_L" : "Stable Outcome o_0",
      "Minimal Liberty": "Lewd controls o_L, Prude controls o_P",
      "Pareto Principle": "o_0 ≻_Pareto o_L",
      "Resolution": trade > 0.6 ? "Coasean Rights-Waiver Contract" : rights >= 0.7 ? "Deontic Rights Trump Pareto" : "Liberal Paradox Active!",
    };
  };

  // 58. phil_pearl_do_calculus
  R.phil_pearl_do_calculus = function (ctx, W, H, st) {
    st.drawHUD("Judea Pearl Causal DAG: Observational P(Y|X) vs Surgical Intervention P(Y|do(X))", st.spec.formula);
    const C = st.COLORS, conf = st.a, causal = st.b, coll = st.c;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.48, h, "Causal DAG with Confounder Z and Surgical do(X) Edge Deletion");
    const zx = 20 + W * 0.24, zy = y0 + 50, xx = 54, xy = y0 + h - 42, yx = 20 + W * 0.42, yy = y0 + h - 42;
    ctx.strokeStyle = C.danger; ctx.setLineDash([4, 4]);
    arrow(ctx, zx, zy, xx, xy, C.danger, 1.8); ctx.setLineDash([]);
    arrow(ctx, zx, zy, yx, yy, C.secondary, 2.2);
    arrow(ctx, xx, xy, yx, yy, C.ok, 2.8);
    [{ x: zx, y: zy, l: "Z (Confounder)" }, { x: xx, y: xy, l: "do(X)" }, { x: yx, y: yy, l: "Y (Outcome)" }].forEach((n, i) => {
      ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(n.x, n.y, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.text; ctx.fillText(n.l, n.x - 28, n.y + 26);
    });
    const rx = W * 0.51, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Observational P(Y|X) vs True Causal Effect P(Y|do(X))");
    const obsE = causal * 0.6 + conf * 0.5 - coll * 0.25;
    const doE = causal * 0.6;
    ctx.fillStyle = C.secondary; ctx.fillRect(rx + 36, y0 + h - 28 - obsE * (h - 68), 46, obsE * (h - 68));
    ctx.fillStyle = C.ok; ctx.fillRect(rx + 112, y0 + h - 28 - doE * (h - 68), 46, doE * (h - 68));
    ctx.fillStyle = C.text; ctx.fillText("P(Y|X)", rx + 38, y0 + h - 10); ctx.fillText("P(Y|do(X))", rx + 106, y0 + h - 10);
    return {
      "Observational P(Y|X)": obsE.toFixed(2),
      "Interventional P(Y|do(X))": doE.toFixed(2),
      "Confounding Bias": (obsE - doE).toFixed(2),
      "Back-Door Set": "{ Z } Blocks Spurious Path",
    };
  };

  // 59. phil_kant_universalizability
  R.phil_kant_universalizability = function (ctx, W, H, st) {
    st.drawHUD("Kantian Categorical Imperative: Universalizing false-promising/defection collapses trust", st.spec.formula);
    const C = st.COLORS, kant = st.a, thresh = 0.3 + st.b * 0.5, sanc = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Social Commons & Promise-Keeping Institution Survival vs Universalized Defection Share");
    const ox = x0 + 44, oy = y0 + h - 28, pw = w - 68, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      const welf = u < thresh ? 0.4 + 0.5 * u : Math.max(0.05, 0.85 - 1.4 * (u - thresh));
      const px = ox + u * pw, py = oy - welf * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const defShare = 1 - kant;
    const cx = ox + defShare * pw;
    ctx.strokeStyle = C.accent; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, y0 + 24); ctx.lineTo(cx, oy); ctx.stroke(); ctx.setLineDash([]);
    return {
      "Kantian Share α": (kant * 100).toFixed(0) + "%",
      "Defector Share 1−α": (defShare * 100).toFixed(0) + "%",
      "Collapse Threshold": (thresh * 100).toFixed(0) + "%",
      "Universalizability Test": defShare > thresh ? "Contradiction in Conception!" : "Institution Sustained",
    };
  };

  // 60. phil_free_will_libet_veto
  R.phil_free_will_libet_veto = function (ctx, W, H, st) {
    st.drawHUD("Libet Readiness Potential (RP), Schurger stochastic accumulator & Conscious Veto window", st.spec.formula);
    const C = st.COLORS, thresh = 0.45 + st.a * 0.45, veto = st.b, noise = 0.1 + st.c * 0.5;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Pre-Motor Readiness Potential (-1000 ms → W Awareness -200 ms → Motor Action 0 ms)");
    const ox = x0 + 44, oy = y0 + h - 28, pw = w - 68, ph = h - 58;
    const thY = oy - thresh * ph;
    ctx.strokeStyle = C.danger; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(ox, thY); ctx.lineTo(ox + pw, thY); ctx.stroke(); ctx.setLineDash([]);
    const wX = ox + pw * 0.76;
    ctx.fillStyle = "rgba(255,209,102,0.16)"; ctx.fillRect(wX, y0 + 24, pw * 0.24, ph);
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const u = i / 80;
      let val = Math.pow(u, 2.2) * thresh + Math.sin(i * 0.9 + st.t * 3) * noise * 0.12 * (1 - u);
      if (u > 0.76 && veto > 0.55) val *= Math.max(0.1, 1 - (u - 0.76) * 5 * veto);
      const px = ox + u * pw, py = oy - clamp(val, 0.02, 0.95) * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "RP Onset": "−850 ms",
      "Conscious W Time": "−200 ms",
      "Veto ('Free Won't')": veto > 0.55 ? "Action Aborted before 0 ms!" : "Threshold Crossed (Motor Fire)",
      "Schurger Account": "Backward-Aligned O-U Noise",
    };
  };

  // ==================== 4. LANGUAGES (20) ====================

  // 61. lang_formant_vowel_chart
  R.lang_formant_vowel_chart = function (ctx, W, H, st) {
    st.drawHUD("Click inside IPA Vowel Trapezoid to synthesize F₁ (height) & F₂ (backness) formants", st.spec.formula);
    const C = st.COLORS, len = 14 + st.a * 6, lip = st.b, f0 = Math.round(90 + st.c * 160);
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.48, h, `IPA Acoustic Vowel Quadrilateral (L_tract = ${len.toFixed(1)} cm)`);
    const gx = 34, gy = y0 + 28, gw = W * 0.42, gh = h - 44;
    ctx.strokeStyle = C.axis; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(gx + gw * 0.08, gy + gh * 0.1); ctx.lineTo(gx + gw * 0.9, gy + gh * 0.1);
    ctx.lineTo(gx + gw * 0.85, gy + gh * 0.9); ctx.lineTo(gx + gw * 0.35, gy + gh * 0.9);
    ctx.closePath(); ctx.stroke();
    const vowels = [
      { s: "/i/", x: 0.14, y: 0.16 }, { s: "/e/", x: 0.24, y: 0.48 },
      { s: "/a/", x: 0.45, y: 0.85 }, { s: "/ɑ/", x: 0.80, y: 0.84 },
      { s: "/o/", x: 0.83, y: 0.48 }, { s: "/u/", x: 0.86, y: 0.16 },
    ];
    vowels.forEach((v) => {
      ctx.fillStyle = C.primary; ctx.fillText(v.s, gx + v.x * gw, gy + v.y * gh);
    });
    const tx = gx + clamp(st.px * 1.4, 0.12, 0.88) * gw, ty = gy + clamp(st.py, 0.14, 0.88) * gh;
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(tx, ty, 6.5, 0, Math.PI * 2); ctx.fill();
    const scale = 17.5 / len;
    const f1 = Math.round((250 + st.py * 620) * scale);
    const f2 = Math.round((2350 - st.px * 1500 - lip * 240) * scale);
    const rx = W * 0.51, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, `Source-Filter Spectrum |H(f)|  [F₁=${f1} Hz, F₂=${f2} Hz]`);
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const f = i * 40;
      const env = Math.exp(-Math.pow((f - f1) / 180, 2)) + 0.85 * Math.exp(-Math.pow((f - f2) / 260, 2));
      const px = rx + 16 + (i / 80) * (rw - 32), py = y0 + h - 26 - env * (h - 58);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "Formant F₁ (Openness)": `${f1} Hz`,
      "Formant F₂ (Frontness)": `${f2} Hz`,
      "Glottal Pitch F₀": `${f0} Hz`,
      "F₂ − F₁ Dispersion": `${f2 - f1} Hz`,
    };
  };

  // 62. lang_vot_categorical_perception
  R.lang_vot_categorical_perception = function (ctx, W, H, st) {
    st.drawHUD("Voice Onset Time (VOT) categorical S-curve & discrimination peak at θ_b", st.spec.formula);
    const C = st.COLORS, bound = -20 + st.a * 60, slope = 0.08 + st.b * 0.35, f0Cue = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `Categorical Identification P(/p/ | VOT) & ABX Discrimination Peak (Boundary θ_b = ${bound.toFixed(0)} ms)`);
    const ox = x0 + 44, oy = y0 + h - 28, pw = w - 68, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    // Identification S-curve
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const vot = -60 + (i / 80) * 120;
      const p = 1 / (1 + Math.exp(-slope * (vot - bound + f0Cue * 8)));
      const px = ox + (i / 80) * pw, py = oy - p * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // Discrimination peak
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const vot = -60 + (i / 80) * 120;
      const p = 1 / (1 + Math.exp(-slope * (vot - bound)));
      const disc = 0.25 + 2.6 * p * (1 - p);
      const px = ox + (i / 80) * pw, py = oy - disc * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const probeVOT = Math.round(-60 + st.px * 120);
    return {
      "Boundary θ_b": `${bound.toFixed(0)} ms`,
      "Probe VOT": `${probeVOT} ms`,
      "Perceived Phoneme": probeVOT > bound ? "Voiceless /pʰ/" : "Voiced /b/",
      "Language Profile": bound < 5 ? "Romance (Spanish/French)" : "Germanic (English +25ms)",
    };
  };

  // 63. lang_grimm_verner_sound_shift
  R.lang_grimm_verner_sound_shift = function (ctx, W, H, st) {
    st.drawHUD("Grimm's Law IE Consonant Wheel (*bh→*b→*p→*f) & Great Vowel Shift Chain", st.spec.formula);
    const C = st.COLORS, push = st.a, verner = st.b, disp = 0.5 + st.c * 0.5;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.48, h, "Grimm's Law & Verner's Law Stop Rotation Wheel");
    const cx = 20 + W * 0.24, cy = y0 + h * 0.54, R0 = Math.min(W * 0.15, h * 0.30);
    const stops = ["*bh (Asp)", "*b (Voiced)", "*p (Tenuis)", "*f / *β (Fric)"];
    for (let i = 0; i < 4; i++) {
      const a1 = (i * Math.PI) / 2, a2 = ((i + 1) * Math.PI) / 2;
      arrow(ctx, cx + Math.cos(a1) * R0, cy + Math.sin(a1) * R0, cx + Math.cos(a2) * R0, cy + Math.sin(a2) * R0, C.accent, 2.2);
      ctx.fillStyle = C.series[i];
      ctx.beginPath(); ctx.arc(cx + Math.cos(a1) * R0, cy + Math.sin(a1) * R0, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.text; ctx.fillText(stops[i], cx + Math.cos(a1) * R0 - 28, cy + Math.sin(a1) * R0 + 24);
    }
    const rx = W * 0.51, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Great Vowel Shift (1400–1700): High Diphthongization & Raising");
    arrow(ctx, rx + 48, y0 + h - 36, rx + 48, y0 + 48, C.ok, 2.6);
    arrow(ctx, rx + 48, y0 + 48, rx + rw * 0.5, y0 + h * 0.55, C.secondary, 2.4);
    ctx.fillStyle = C.text;
    ctx.fillText("/aː/ → /eː/ → /iː/ → /aɪ/ (bite)", rx + 62, y0 + 72);
    ctx.fillText("/uː/ → /aʊ/ (house)", rx + 62, y0 + 104);
    return {
      "PIE *pater → PGmc": verner > 0.5 ? "*faðēr (Verner Voicing)" : "*faþēr (Grimm)",
      "Chain Shift Force": `${(push * 100).toFixed(0)}% Push-Chain`,
      "Min-Pair Dispersion": disp.toFixed(2),
      "GVS Reflex of /iː/": push > 0.4 ? "Diphthong /aɪ/" : "Long /iː/",
    };
  };

  // 64. lang_optimality_theory_tableau
  R.lang_optimality_theory_tableau = function (ctx, W, H, st) {
    st.drawHUD("Prince & Smolensky Optimality Theory Tableau: Markedness vs Faithfulness", st.spec.formula);
    const C = st.COLORS, mark = st.a, maxF = st.b, depF = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "OT Constraint Tableau for Underlying Input /pat/ → Optimal Surface Output ☞");
    const cands = [
      { form: "[pat] (Faithful)", c1: 1, c2: 0, c3: 0, score: mark * 4 },
      { form: "[pa] (Deletion)", c1: 0, c2: 1, c3: 0, score: maxF * 4 },
      { form: "[pa.ti] (Epenthesis)", c1: 0, c2: 0, c3: 1, score: depF * 4 },
    ];
    let winIdx = 0;
    if (cands[1].score < cands[winIdx].score) winIdx = 1;
    if (cands[2].score < cands[winIdx].score) winIdx = 2;
    const headers = ["Candidate", "*CODA (Mark)", "MAX-IO (No Del)", "DEP-IO (No Epenth)"];
    headers.forEach((hd, c) => {
      ctx.fillStyle = C.accent; ctx.font = "600 11px monospace";
      ctx.fillText(hd, x0 + 24 + c * ((w - 48) / 4), y0 + 44);
    });
    cands.forEach((row, r) => {
      const ry = y0 + 76 + r * 38;
      const isWin = r === winIdx;
      ctx.fillStyle = isWin ? "rgba(110,231,183,0.18)" : "rgba(255,255,255,0.04)";
      ctx.fillRect(x0 + 18, ry - 18, w - 36, 28);
      ctx.fillStyle = isWin ? C.ok : C.text;
      ctx.fillText((isWin ? "☞ " : "   ") + row.form, x0 + 24, ry);
      ctx.fillText(row.c1 ? "*!" : "", x0 + 24 + (w - 48) * 0.28, ry);
      ctx.fillText(row.c2 ? "*!" : "", x0 + 24 + (w - 48) * 0.53, ry);
      ctx.fillText(row.c3 ? "*!" : "", x0 + 24 + (w - 48) * 0.78, ry);
    });
    return {
      "Winning Output ☞": cands[winIdx].form,
      "Constraint Ranking": mark > Math.max(maxF, depF) ? "*CODA ≫ Faithfulness (CV)" : "Faithfulness ≫ *CODA (CVC)",
      "Syllable Typology": winIdx === 0 ? "English/Arabic CVC" : winIdx === 1 ? "Hawaiian Deletion" : "Japanese Epenthesis",
      "Harmonic Eval": "Strict Domination",
    };
  };

  // 65. lang_zipf_heaps_menzerath
  R.lang_zipf_heaps_menzerath = function (ctx, W, H, st) {
    st.drawHUD("Zipf-Mandelbrot log-log rank-frequency distribution & Heaps' vocabulary growth", st.spec.formula);
    const C = st.COLORS, lam = 0.2 + st.a * 0.6, beta = st.b * 4, alpha = 0.7 + st.c * 0.7;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.48, h, `Zipf-Mandelbrot Log-Log Law f(r) ∝ (r + ${beta.toFixed(1)})^(−${alpha.toFixed(2)})`);
    const ox = 48, oy = y0 + h - 26, pw = W * 0.40, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 1; i <= 50; i++) {
      const lx = Math.log(i) / Math.log(50);
      const ly = Math.pow((i + beta) / (1 + beta), -alpha);
      const px = ox + lx * pw, py = oy - ly * (ph - 10);
      if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const rx = W * 0.51, rw = W - rx - 18;
    const gamma = clamp(1 / (alpha + 0.15), 0.4, 0.85);
    st.panel(rx, y0, rw, h, `Heaps' Sublinear Vocabulary Growth V(N) = K · N^${gamma.toFixed(2)}`);
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const px = rx + 24 + u * (rw - 42), py = oy - Math.pow(u, gamma) * (ph - 10);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    return {
      "Zipf Exponent α": alpha.toFixed(2),
      "Mandelbrot Shift β": beta.toFixed(2),
      "Heaps' Exponent γ": gamma.toFixed(2),
      "Speaker-Listener λ": lam.toFixed(2),
    };
  };

  // 66. lang_chomsky_xbar_movement
  R.lang_chomsky_xbar_movement = function (ctx, W, H, st) {
    st.drawHUD("Chomsky X-Bar syntactic hierarchy, cyclic Wh-Movement to Spec-CP & Island barriers", st.spec.formula);
    const C = st.COLORS, headDir = st.a, move = st.b, island = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `[CP Whatᵢ [C' did [TP you [VP ${headDir < 0.5 ? "see tᵢ" : "tᵢ see"} ]]]]`);
    const cpX = x0 + w * 0.45, cpY = y0 + 38;
    const specX = x0 + w * 0.18, specY = y0 + 92;
    const tpX = x0 + w * 0.62, tpY = y0 + 92;
    const vpX = x0 + w * 0.72, vpY = y0 + 148;
    const traceX = headDir < 0.5 ? vpX + 54 : vpX - 54, traceY = y0 + h - 26;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2;
    [[cpX, cpY, specX, specY], [cpX, cpY, tpX, tpY], [tpX, tpY, vpX, vpY], [vpX, vpY, traceX, traceY]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    ctx.fillStyle = C.text; ctx.font = "600 11px monospace";
    ctx.fillText("CP", cpX - 8, cpY - 6); ctx.fillText("Spec,CP: Whatᵢ", specX - 36, specY + 16);
    ctx.fillText("TP", tpX + 8, tpY); ctx.fillText("VP", vpX + 8, vpY); ctx.fillText("tᵢ (trace)", traceX - 24, traceY + 12);
    // Curved Wh-movement arrow
    ctx.strokeStyle = island > 0.65 ? C.danger : C.ok; ctx.setLineDash([5, 4]); ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(traceX, traceY); ctx.quadraticCurveTo(x0 + w * 0.35, y0 + h, specX, specY + 20); ctx.stroke(); ctx.setLineDash([]);
    return {
      "Head Parameter": headDir < 0.5 ? "Head-Initial (SVO English)" : "Head-Final (SOV Japanese)",
      "Wh-Movement": move > 0.3 ? "Overt to Spec,CP" : "Wh-in-situ",
      "Subjacency / Island": island > 0.65 ? "*Island Violation Blocked!" : "Grammatical Extraction",
      "C-Command": "Spec,CP c-commands trace tᵢ",
    };
  };

  // 67. lang_ergative_absolutive_align
  R.lang_ergative_absolutive_align = function (ctx, W, H, st) {
    st.drawHUD("Morphosyntactic Alignment: Nominative-Accusative (S=A) vs Ergative-Absolutive (S=O)", st.spec.formula);
    const C = st.COLORS, anim = st.a, perf = st.b, top = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    const isErg = perf > anim;
    st.panel(x0, y0, w, h, `Dixon/Silverstein Alignment Diagram  |  Active System: ${isErg ? "Ergative-Absolutive (S = O)" : "Nominative-Accusative (S = A)"}`);
    const sx = x0 + w * 0.5, sy = y0 + 60, ax = x0 + w * 0.30, ay = y0 + h - 48, ox = x0 + w * 0.70, oy = y0 + h - 48;
    // Draw grouping oval
    ctx.strokeStyle = isErg ? C.ok : C.primary; ctx.lineWidth = 3;
    ctx.beginPath();
    if (!isErg) {
      ctx.moveTo(sx, sy - 24); ctx.lineTo(ax - 24, ay + 18); ctx.lineTo(ax + 34, ay + 18); ctx.closePath();
    } else {
      ctx.moveTo(sx, sy - 24); ctx.lineTo(ox + 28, oy + 18); ctx.lineTo(ox - 34, oy + 18); ctx.closePath();
    }
    ctx.stroke();
    [{ x: sx, y: sy, l: "S (Intrans Subj)" }, { x: ax, y: ay, l: "A (Trans Agent)" }, { x: ox, y: oy, l: "O (Trans Patient)" }].forEach((n, i) => {
      ctx.fillStyle = C.series[i]; ctx.beginPath(); ctx.arc(n.x, n.y, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f1222"; ctx.font = "bold 12px monospace"; ctx.fillText(n.l[0], n.x - 4, n.y + 4);
      ctx.fillStyle = C.text; ctx.fillText(n.l, n.x - 42, n.y + 32);
    });
    return {
      "Active Alignment": isErg ? "Ergative-Absolutive (S=O≠A)" : "Nominative-Accusative (S=A≠O)",
      "NP Animacy Rank": anim > 0.6 ? "1st/2nd Person Pronoun" : "Inanimate Common Noun",
      "Aspect / Tense": perf > 0.5 ? "Perfective / Past (Erg Bias)" : "Imperfective / Present",
      "Split-Ergativity": "Follows Silverstein Hierarchy",
    };
  };

  // 68. lang_tonogenesis_pitch_accent
  R.lang_tonogenesis_pitch_accent = function (ctx, W, H, st) {
    st.drawHUD("Tonogenesis: Loss of onset voicing (*pa/*ba) & coda laryngeals transphonologizes into F₀ tone", st.spec.formula);
    const C = st.COLORS, dev = st.a, coda = st.b, down = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Register Split (*pa → High Tone [pá], *ba → Low Tone [pà]) & Coda Contour");
    const ox = x0 + 48, oy = y0 + h * 0.54, pw = w - 96;
    const drawContour = (sign, col, lbl) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2.8; ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const u = i / 70;
        const f0 = sign * (12 + 28 * dev) + Math.sin(u * 3.14) * coda * 24 * sign - u * down * 18;
        const px = ox + u * pw, py = oy - f0;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = col; ctx.fillText(lbl, ox + 10, oy - sign * (18 + 24 * dev));
    };
    drawContour(1, C.ok, "Upper Register *pa → High/Rising [pá]");
    drawContour(-1, C.secondary, "Lower Register *ba → Low/Falling [pà]");
    return {
      "Onset Devoicing": (dev * 100).toFixed(0) + "% Complete",
      "Register F₀ Split": `${Math.round(14 + 42 * dev)} Hz`,
      "Coda Contour": coda > 0.5 ? "Rising (*-ʔ) / Falling (*-h)" : "Level Register",
      "Stage": dev > 0.7 ? "Phonemic Lexical Tone" : "Coarticulatory Microprosody",
    };
  };

  // 69. lang_wals_greenberg_universals
  R.lang_wals_greenberg_universals = function (ctx, W, H, st) {
    st.drawHUD("Greenberg's Implicational Universals: Harmonic Head-Ordering (VO+Prep vs OV+Postp)", st.spec.formula);
    const C = st.COLORS, harm = 0.2 + st.a * 0.8, areal = st.b, mut = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "WALS Typological State-Space: Harmonic Attractors (OV+Postp & VO+Prep)");
    const qx = x0 + 36, qy = y0 + 32, qw = (w - 72) / 2, qh = (h - 48) / 2;
    const probs = [
      { l: "OV + Postpositions (Japanese/Turkish)", p: 0.42 * harm + 0.08 },
      { l: "VO + Postpositions (Rare Disharmonic)", p: 0.25 * (1 - harm) },
      { l: "OV + Prepositions (Persian Transition)", p: 0.25 * (1 - harm) },
      { l: "VO + Prepositions (English/Arabic)", p: 0.42 * harm + 0.08 },
    ];
    probs.forEach((cell, i) => {
      const r = Math.floor(i / 2), c = i % 2;
      const bx = qx + c * qw, by = qy + r * qh;
      const isHarm = i === 0 || i === 3;
      ctx.fillStyle = isHarm ? `rgba(110,231,183,${(cell.p * 0.7).toFixed(2)})` : `rgba(255,107,107,${(cell.p * 0.7).toFixed(2)})`;
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(bx, by, qw - 8, qh - 8); ctx.strokeRect(bx, by, qw - 8, qh - 8);
      ctx.fillStyle = C.text; ctx.font = "600 11px system-ui";
      ctx.fillText(cell.l, bx + 12, by + 24);
      ctx.fillStyle = isHarm ? C.ok : C.secondary;
      ctx.fillText(`Frequency: ${(cell.p * 100).toFixed(1)}%`, bx + 12, by + 44);
    });
    return {
      "Harmonic Share": `${((probs[0].p + probs[3].p) * 100).toFixed(1)}%`,
      "Greenberg Universal 3/4": "SOV ⇒ Postpositions",
      "Hawkins Processing": `Efficiency Gain ${(harm * 38).toFixed(0)}%`,
      "Sprachbund Contact": (areal * 100).toFixed(0) + "%",
    };
  };

  // 70. lang_garden_path_surprisal
  R.lang_garden_path_surprisal = function (ctx, W, H, st) {
    st.drawHUD("Levy Surprisal −log₂ P(wᵢ|w_{<i}) & Regressive Eye Saccades on Garden-Path Ambiguity", st.spec.formula);
    const C = st.COLORS, beam = 0.15 + st.a * 0.85, mvPrior = 0.5 + st.b * 0.45, dep = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "'The horse raced past the barn fell' — Disambiguation Surprisal Spike at 'fell'");
    const words = ["The", "horse", "raced", "past", "the", "barn", "fell"];
    const spike = clamp((mvPrior * 11) / (beam + 0.2) + dep * 2, 2.5, 14.5);
    const surp = [1.8, 4.2, 5.1, 3.4, 1.5, 4.0, spike];
    const bw = (w - 64) / words.length;
    words.forEach((wd, i) => {
      const bx = x0 + 32 + i * bw, bh = (surp[i] / 15) * (h - 68);
      ctx.fillStyle = i === 6 ? C.danger : C.primary;
      ctx.fillRect(bx + 6, y0 + h - 30 - bh, bw - 14, bh);
      ctx.fillStyle = C.text; ctx.fillText(wd, bx + 8, y0 + h - 12);
    });
    // Regressive eye-movement arc from "fell" back to "raced"
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x0 + 32 + 6.4 * bw, y0 + h - 42);
    ctx.quadraticCurveTo(x0 + 32 + 4.2 * bw, y0 + 28, x0 + 32 + 2.4 * bw, y0 + h - 42);
    ctx.stroke();
    return {
      "Surprisal at 'fell'": `${spike.toFixed(2)} bits`,
      "Reading Time Spike": `${Math.round(210 + spike * 42)} ms`,
      "Reduced-Relative Retention": beam > 0.6 ? "Kept in Parallel Beam" : "Pruned (Garden-Pathed!)",
      "Regressive Saccade": `${Math.round(clamp(spike * 6.5, 12, 95))}% probability`,
    };
  };

  // 71. lang_labov_sociolinguistic_s
  R.lang_labov_sociolinguistic_s = function (ctx, W, H, st) {
    st.drawHUD("Labovian S-Curve Sound Change Diffusion & Social Class Stratification", st.spec.formula);
    const C = st.COLORS, sBias = 0.2 + st.a * 0.8, weak = st.b, mob = st.c;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.50, h, "S-Curve Logistic Diffusion p(t) = 1 / (1 + e^(−st)) Across Social Strata");
    const ox = 46, oy = y0 + h - 26, pw = W * 0.42, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    ["Working Class", "Lower-Middle (Hypercorrect)", "Upper-Middle"].forEach((lbl, idx) => {
      ctx.strokeStyle = C.series[idx]; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const u = i / 70;
        const rate = sBias * (1 + 0.5 * weak) * (idx === 1 ? 1.25 : 0.9);
        const p = 1 / (1 + Math.exp(-rate * 10 * (u - 0.45 + idx * 0.08)));
        const px = ox + u * pw, py = oy - p * ph;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
    const rx = W * 0.53, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Formal vs Casual Style Shift (Labov NYC /r/)");
    [0.35, 0.78, 0.68].forEach((v, i) => {
      const bh = v * (h - 60);
      ctx.fillStyle = C.series[i];
      ctx.fillRect(rx + 26 + i * 62, oy - bh, 42, bh);
      ctx.fillStyle = C.text; ctx.fillText(["WC", "LMC", "UMC"][i], rx + 34 + i * 62, oy + 14);
    });
    return {
      "Selection Rate s": sBias.toFixed(2),
      "Milroy Weak Ties": (weak * 100).toFixed(0) + "%",
      "LMC Crossover": "Active in Formal Style (Hypercorrection)",
      "Prestige Type": sBias > 0.6 ? "Change from Above (Overt)" : "Covert Local Identity",
    };
  };

  // 72. lang_grice_rsa_pragmatics
  R.lang_grice_rsa_pragmatics = function (ctx, W, H, st) {
    st.drawHUD("Rational Speech Acts (RSA): Pragmatic Listener L₁ computes Scalar Implicature 'some' → 'not all'", st.spec.formula);
    const C = st.COLORS, alpha = 0.5 + st.a * 7.5, costAll = st.b * 1.5, qud = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    // Literal L0: 'some' is true in 1,2,3; 'all' is true only in 3
    const s1AllIn3 = Math.exp(alpha * (0 - costAll));
    const s1SomeIn3 = Math.exp(alpha * Math.log(1 / 3));
    const pS1SomeGiven3 = s1SomeIn3 / (s1SomeIn3 + s1AllIn3);
    const pS1SomeGiven2 = 1.0;
    const pL1NotAll = pS1SomeGiven2 / (pS1SomeGiven2 + pS1SomeGiven3);
    st.panel(x0, y0, w, h, `Bayesian Gricean Recursion (L₀ Literal → S₁ Speaker α=${alpha.toFixed(1)} → L₁ Pragmatic Listener)`);
    const bx = x0 + 60, oy = y0 + h - 30, ph = h - 68;
    // Literal vs Pragmatic bars for 'some'
    ctx.fillStyle = C.primary;
    ctx.fillRect(bx, oy - 0.5 * ph, 64, 0.5 * ph);
    ctx.fillRect(bx + 80, oy - 0.5 * ph, 64, 0.5 * ph);
    ctx.fillStyle = C.ok;
    ctx.fillRect(bx + 210, oy - pL1NotAll * ph, 64, pL1NotAll * ph);
    ctx.fillStyle = C.secondary;
    ctx.fillRect(bx + 290, oy - (1 - pL1NotAll) * ph, 64, (1 - pL1NotAll) * ph);
    ctx.fillStyle = C.text;
    ctx.fillText("L₀(some⇒¬all) 50%", bx - 10, oy + 16);
    ctx.fillText(`L₁(some⇒¬all) ${(pL1NotAll * 100).toFixed(0)}%`, bx + 200, oy + 16);
    ctx.fillText(`L₁(all) ${((1 - pL1NotAll) * 100).toFixed(0)}%`, bx + 295, oy + 16);
    return {
      "Speaker Optimality α": alpha.toFixed(2),
      "Literal P_L0(¬all | 'some')": "50.0%",
      "Pragmatic P_L1(¬all | 'some')": `${(pL1NotAll * 100).toFixed(1)}%`,
      "Scalar Implicature": pL1NotAll > 0.75 ? "Strong ('some but not all')" : "Weak / Literal",
    };
  };

  // 73. lang_montague_lambda_type
  R.lang_montague_lambda_type = function (ctx, W, H, st) {
    st.drawHUD("Montague Type-Driven λ-Calculus Composition & Quantifier Raising (Surface ∀∃ vs Inverse ∃∀)", st.spec.formula);
    const C = st.COLORS, qr = st.a, bias = st.b, inten = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    const inv = qr > 0.52;
    st.panel(x0, y0, w, h, `'Every linguist speaks a language' — Active Reading: ${inv ? "Inverse Scope ∃y ∀x (One universal language)" : "Surface Scope ∀x ∃y (Possibly different languages)"}`);
    // Left: Semantic Type Tree; Right: Bipartite Witness Graph
    const tx = x0 + w * 0.25, ty = y0 + 44;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx - 65, ty + 65); ctx.moveTo(tx, ty); ctx.lineTo(tx + 65, ty + 65); ctx.stroke();
    ctx.fillStyle = C.accent; ctx.fillText("S : t", tx - 14, ty - 6);
    ctx.fillStyle = C.text;
    ctx.fillText("DP : ⟨⟨e,t⟩,t⟩", tx - 105, ty + 82);
    ctx.fillText("VP : ⟨e,t⟩", tx + 40, ty + 82);
    // Witness bipartite mapping on right
    const lx = x0 + w * 0.60, rx = x0 + w * 0.84;
    for (let i = 0; i < 3; i++) {
      const ly = y0 + 52 + i * 38;
      const targetIdx = inv ? 1 : i;
      const ry = y0 + 52 + targetIdx * 38;
      arrow(ctx, lx + 12, ly, rx - 12, ry, inv ? C.secondary : C.ok, 2.2);
      ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(lx, ly, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(rx, y0 + 52 + i * 38, 9, 0, Math.PI * 2); ctx.fill();
    }
    return {
      "Logical Form (LF)": inv ? "∃y[Lang(y) ∧ ∀x(Ling(x)→Speak(x,y))]" : "∀x[Ling(x) → ∃y(Lang(y)∧Speak(x,y))]",
      "Generalized Quantifier": "⟨⟨e,t⟩,⟨⟨e,t⟩,t⟩⟩",
      "QR Landing Site": inv ? "Object QR above Subject" : "In-Situ Surface Scope",
      "Intensional Type": inten > 0.5 ? "⟨s, ⟨e,t⟩⟩ (De Dicto)" : "Extensional ⟨e,t⟩",
    };
  };

  // 74. lang_bilingual_code_switching
  R.lang_bilingual_code_switching = function (ctx, W, H, st) {
    st.drawHUD("BIA+ Bilingual Lexical Access & Green's Inhibitory Control Asymmetry", st.spec.formula);
    const C = st.COLORS, profL2 = 0.2 + st.a * 0.8, inhib = 0.2 + st.b * 0.8, cog = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Parallel Lexical Activation & Asymmetric L2→L1 vs L1→L2 Code-Switch Cost");
    const ox = x0 + 44, oy = y0 + h - 28, pw = w - 68, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    // L1 and L2 activation waves with switch at u=0.5
    ["L1 Dominant", "L2 Non-Dominant"].forEach((lbl, idx) => {
      ctx.strokeStyle = idx === 0 ? C.primary : C.ok; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const active = idx === 0 ? u < 0.5 : u >= 0.5;
        const val = active ? 0.75 + 0.15 * cog : 0.22 * (1 - 0.6 * inhib);
        const px = ox + u * pw, py = oy - val * ph;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
    const costL2toL1 = Math.round(95 * inhib * (1.2 - 0.5 * profL2));
    const costL1toL2 = Math.round(45 * inhib * profL2);
    return {
      "L2→L1 Switch Cost": `${costL2toL1} ms (Strong L1 Inhibition)`,
      "L1→L2 Switch Cost": `${costL1toL2} ms`,
      "Cognate Facilitation": `−${Math.round(cog * 32)} ms`,
      "Control Regime": inhib > 0.6 ? "High Prefrontal Gate" : "Dense Code-Switching",
    };
  };

  // 75. lang_moraic_metrical_stress
  R.lang_moraic_metrical_stress = function (ctx, W, H, st) {
    st.drawHUD("Metrical Phonology: Moraic Trochees vs Iambs, Weight-to-Stress & Extrametricality ⟨σ⟩", st.spec.formula);
    const C = st.COLORS, iamb = st.a > 0.5, wsp = st.b > 0.4, extra = st.c > 0.5;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `Metrical Stress Grid & Moraic Foot Bracketings  [${iamb ? "Iambic (μ ˈμ)" : "Trochaic (ˈμ μ)"}]`);
    const sylls = [
      { s: "pa", m: 1 }, { s: "ta", m: 1 },
      { s: "kan", m: wsp ? 2 : 1 }, { s: "da", m: 1 }, { s: "la", m: 1 },
    ];
    const bw = (w - 64) / sylls.length;
    sylls.forEach((sy, i) => {
      const bx = x0 + 32 + i * bw, by = y0 + h - 42;
      const isExtra = extra && i === sylls.length - 1;
      const stressed = !isExtra && ((i === 2 && wsp) || (!iamb && i % 2 === 0) || (iamb && i % 2 === 1));
      ctx.fillStyle = isExtra ? C.muted : C.text;
      ctx.font = "600 13px monospace";
      ctx.fillText(isExtra ? `⟨${sy.s}⟩` : sy.s, bx + 16, by);
      ctx.fillStyle = C.primary;
      ctx.fillText(sy.m === 2 ? "μ μ" : "μ", bx + 16, by - 22);
      ctx.fillStyle = C.ok;
      ctx.fillText("×", bx + 20, by - 46);
      if (stressed) {
        ctx.fillStyle = C.accent;
        ctx.fillText("×  (Foot Head)", bx + 14, by - 70);
      }
    });
    return {
      "Foot Type": iamb ? "Iambic (Right-Headed)" : "Moraic Trochee (Left-Headed)",
      "Heavy CVC Weight": wsp ? "Bimoraic (μμ Attracts Stress)" : "Monomoraic (Quantity-Insensitive)",
      "Final Syllable": extra ? "Extrametrical ⟨la⟩" : "Parsed in Foot",
      "Primary Stress": extra ? "Ante-penultimate / Heavy" : "Penultimate",
    };
  };

  // 76. lang_agglutinative_templatic_morph
  R.lang_agglutinative_templatic_morph = function (ctx, W, H, st) {
    st.drawHUD("Morphological Typology: Agglutinative Affix Chain vs Semitic Root-and-Pattern Comb", st.spec.formula);
    const C = st.COLORS, synth = 1 + st.a * 4, fusion = 1 + st.b * 3, harm = st.c;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.50, h, "Agglutinative Mirror-Principle Chain vs Semitic Root k-t-b + Pattern");
    const blocks = ["ev (Root)", harm > 0.5 ? "-ler (PL)" : "-lar (PL)", harm > 0.5 ? "-imiz (1PL)" : "-ımız (1PL)", "-de (LOC)"];
    blocks.forEach((b, i) => {
      ctx.fillStyle = C.series[i];
      ctx.fillRect(34 + i * 74, y0 + 44, 68, 32);
      ctx.fillStyle = "#0f1222"; ctx.font = "bold 10px monospace";
      ctx.fillText(b, 38 + i * 74, y0 + 64);
    });
    // Semitic interlocking root k-t-b and vocalic tier a-a
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
    ["k", "a", "t", "a", "b"].forEach((ch, i) => {
      const cx = 48 + i * 48, cy = y0 + 132;
      ctx.fillStyle = i % 2 === 0 ? C.ok : C.secondary;
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f1222"; ctx.fillText(ch, cx - 4, cy + 4);
    });
    const rx = W * 0.53, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Sapir 2D Morphological Plane (Synthesis × Fusion)");
    const px = rx + 24 + ((synth - 1) / 4) * (rw - 48);
    const py = y0 + h - 28 - ((fusion - 1) / 3) * (h - 60);
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
    return {
      "Index of Synthesis": `${synth.toFixed(2)} morph/word`,
      "Index of Fusion": `${fusion.toFixed(2)} meanings/morph`,
      "Vowel Harmony": harm > 0.5 ? "Front/Unrounded (-ler/-imiz)" : "Back (-lar/-ımız)",
      "Typological Class": synth < 1.8 ? "Isolating (Mandarin)" : fusion < 1.8 ? "Agglutinative (Turkish)" : "Fusional / Non-Concatenative",
    };
  };

  // 77. lang_swadesh_glottochronology
  R.lang_swadesh_glottochronology = function (ctx, W, H, st) {
    st.drawHUD("Swadesh-100 Glottochronology Cognate Decay C(t) = exp(−2rt) & Phylogenetic Tree", st.spec.formula);
    const C = st.COLORS, ret = 0.70 + st.a * 0.22, borrow = st.b * 0.25, het = 0.3 + st.c * 1.7;
    const y0 = 48, h = H - 64;
    st.panel(20, y0, W * 0.52, h, "Shared Cognate Percentage C(t) across Millennia t = 0..6 kyr");
    const ox = 48, oy = y0 + h - 26, pw = W * 0.44, ph = h - 58;
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(ox, y0 + 24); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
    const rDecay = -Math.log(ret);
    ctx.strokeStyle = C.ok; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 6;
      const cog = Math.pow(1 + (2 * rDecay * t) / het, -het) * (1 - borrow) + borrow;
      const px = ox + (i / 60) * pw, py = oy - cog * ph;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const rx = W * 0.55, rw = W - rx - 18;
    st.panel(rx, y0, rw, h, "Bayesian Dated Language Family Tree");
    const rootX = rx + rw * 0.5, rootY = y0 + 40;
    ctx.strokeStyle = C.primary; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(rootX, rootY); ctx.lineTo(rx + 40, oy - 18);
    ctx.moveTo(rootX, rootY); ctx.lineTo(rx + rw - 40, oy - 18); ctx.stroke();
    const cog3k = (Math.exp(-2 * rDecay * 3) * 100).toFixed(1);
    return {
      "Retention Rate r₀": `${(ret * 100).toFixed(1)}% / kyr`,
      "Shared Cognates (3 kyr)": `${cog3k}%`,
      "Loanword Bias": `+${(borrow * 100).toFixed(1)}%`,
      "Pagel Heterogeneity α": het.toFixed(2),
    };
  };

  // 78. lang_sign_phonology_cheremes
  R.lang_sign_phonology_cheremes = function (ctx, W, H, st) {
    st.drawHUD("Sign Language Phonology: Simultaneous Handshape, Location, Movement & Battison Symmetry", st.spec.formula);
    const C = st.COLORS, dom = st.a, arc = 0.5 + st.b * 2.5, nms = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "3D Signing Space Avatar: Dominant Hand (Green), Non-Dominant Hand (Blue) & Non-Manual Brow Scope");
    const cx = x0 + w * 0.45, cy = y0 + h * 0.48;
    // Head & torso outline
    ctx.strokeStyle = C.muted; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy - 38, 22, 0, Math.PI * 2); ctx.stroke();
    // Non-manual eyebrows
    const browTilt = (nms - 0.5) * 6;
    ctx.strokeStyle = C.accent; ctx.beginPath();
    ctx.moveTo(cx - 14, cy - 44 - browTilt); ctx.lineTo(cx - 4, cy - 44 + browTilt);
    ctx.moveTo(cx + 4, cy - 44 + browTilt); ctx.lineTo(cx + 14, cy - 44 - browTilt); ctx.stroke();
    // Dominant & Non-Dominant hand trajectories
    const dx = cx + 52 + Math.cos(st.t * arc) * 28, dy = cy + 8 + Math.sin(st.t * arc) * 22;
    const nx = cx - 52 - (dom > 0.5 ? Math.cos(st.t * arc) * 28 : 0);
    const ny = cy + 8 + (dom > 0.5 ? Math.sin(st.t * arc) * 22 : 0);
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(dx, dy, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(nx, ny, 11, 0, Math.PI * 2); ctx.fill();
    return {
      "Battison Constraint": dom > 0.5 ? "Symmetry Condition (Both Move)" : "Dominance Condition (Base Stationary)",
      "Movement Parameter": `${arc.toFixed(1)} Hz Arc/Trill`,
      "Non-Manual Marking": nms > 0.5 ? "Raised Brow (Topicalization / Y-N Q)" : "Furrowed Brow (Wh-Question)",
      "Prosodic Density": "Simultaneous Tier Bundling",
    };
  };

  // 79. lang_color_berlin_kay_ib
  R.lang_color_berlin_kay_ib = function (ctx, W, H, st) {
    st.drawHUD("Berlin-Kay Color Hierarchy & Information Bottleneck Partition of Perceptual Hue Space", st.spec.formula);
    const C = st.COLORS, beta = 1.0 + st.a * 4.0, warm = 0.2 + st.b * 0.8, kTerms = Math.round(2 + st.c * 9);
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, `World Color Survey Hue/Lightness Naming Grid (Inventory k = ${kTerms} Basic Color Terms)`);
    const palette = ["#1e293b", "#f8fafc", "#ef4444", "#eab308", "#22c55e", "#3b82f6", "#92400e", "#a855f7", "#f472b6", "#f97316", "#94a3b8"];
    const names = ["Bk", "Wh", "Red", "Yel", "Grn", "Blu", "Brn", "Pur", "Pnk", "Org", "Gry"];
    const cols = 16, rows = 5, cw = (w - 48) / cols, ch = (h - 56) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = Math.min(kTerms - 1, Math.floor(((c + r * 0.5) / (cols + 2)) * kTerms));
        ctx.fillStyle = palette[idx];
        ctx.fillRect(x0 + 24 + c * cw, y0 + 34 + r * ch, cw - 2, ch - 2);
      }
    }
    return {
      "Basic Color Terms k": `${kTerms} (${names.slice(0, kTerms).join(", ")})`,
      "IB Tradeoff β": beta.toFixed(2),
      "Complexity I(M;W)": `${Math.log2(kTerms).toFixed(2)} bits`,
      "Berlin-Kay Stage": `Stage ${Math.min(7, kTerms - 1)}`,
    };
  };

  // 80. lang_child_statistical_seg
  R.lang_child_statistical_seg = function (ctx, W, H, st) {
    st.drawHUD("Saffran Infant Statistical Learning: Word segmentation at Transitional Probability minima", st.spec.formula);
    const C = st.COLORS, thresh = 0.35 + st.a * 0.45, pros = st.b, ent = st.c;
    const x0 = 20, y0 = 48, w = W - 40, h = H - 64;
    st.panel(x0, y0, w, h, "Unspaced Infant Speech Stream: bi-da-ku | pa-do-ti | go-la-bu (TP Dips = Word Boundaries)");
    const sylls = ["bi", "da", "ku", "pa", "do", "ti", "go", "la", "bu"];
    const tps = [1.0, 1.0, 0.33, 1.0, 1.0, 0.33, 1.0, 1.0, 0.33];
    const bw = (w - 64) / sylls.length, oy = y0 + h - 30, ph = h - 68;
    let cuts = 0;
    sylls.forEach((sy, i) => {
      const bx = x0 + 32 + i * bw;
      const tp = clamp(tps[i] - (tps[i] < 0.5 ? pros * 0.12 : 0), 0.15, 1.0);
      const bh = tp * ph;
      const isCut = tp < thresh;
      if (isCut) cuts++;
      ctx.fillStyle = isCut ? C.danger : C.ok;
      ctx.fillRect(bx + 8, oy - bh, bw - 16, bh);
      ctx.fillStyle = C.text; ctx.font = "600 12px monospace";
      ctx.fillText(sy, bx + 14, oy + 16);
      if (isCut && i < sylls.length - 1) {
        ctx.strokeStyle = C.accent; ctx.setLineDash([4, 3]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx + bw, y0 + 28); ctx.lineTo(bx + bw, oy + 18); ctx.stroke(); ctx.setLineDash([]);
      }
    });
    return {
      "Internal Word TP": "1.00 (Deterministic)",
      "Part-Word Boundary TP": "0.33 (1 / 3 Dip)",
      "Segmentation Threshold": thresh.toFixed(2),
      "Segmented Words": `${cuts} Tri-syllabic Words`,
    };
  };

  if (window.SelfTaughtSims && typeof window.SelfTaughtSims.registerCustomRenderers === "function") {
    window.SelfTaughtSims.registerCustomRenderers(R);
  }
})();
