/* Self-Taught — simulation core: registry, auto controls, canvas + loop helpers,
 * Fault-Injection ("Break the System") mode, and multi-physics/domain Canvas engines.
 * Widgets register with SelfTaughtSims.register({...}) or SelfTaughtSims.registerBatch([...]).
 * Host apps mount a widget with SelfTaughtSims.mount(id, containerEl, { initial, onAward, onEvent, onFaultSolved }).
 */
(function () {
  "use strict";

  const registry = new Map();

  const COLORS = {
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
    series: ["#7c9cff", "#ff8fab", "#ffd166", "#6ee7b7", "#c084fc", "#67e8f9", "#fdba74", "#a3e635"],
  };

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashStr(s) {
    let h = 2166136261 >>> 0;
    const str = String(s || "");
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "style") n.style.cssText = attrs[k];
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), attrs[k]);
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach((c) => {
      if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  function fmt(v, step) {
    if (typeof v !== "number" || !Number.isFinite(v)) return String(v);
    const d = step && step < 1 ? Math.min(6, Math.max(0, Math.ceil(-Math.log10(step)))) : 0;
    return v.toFixed(d);
  }

  function register(def) {
    if (!def || !def.id) throw new Error("sim def requires id");
    if (registry.has(def.id)) console.warn("[sims] overriding", def.id);
    def.params = (def.params || []).map((p) => {
      const copy = Object.assign({}, p);
      if (!copy.type) copy.type = "range";
      if (copy.value === undefined) copy.value = copy.default !== undefined ? copy.default : (copy.min !== undefined ? copy.min : 0);
      return copy;
    });
    def.actions = def.actions || [];
    def.challenges = def.challenges || [];
    def.domains = def.domains || [];
    registry.set(def.id, def);
  }

  function list() {
    return Array.from(registry.values()).map((d) => ({
      id: d.id, name: d.name, domains: d.domains, description: d.description,
      params: d.params.map((p) => ({ key: p.key, label: p.label, type: p.type, min: p.min, max: p.max, step: p.step, value: p.value, options: p.options })),
      challenges: d.challenges,
    }));
  }

  function resolveDef(id) {
    if (!id) return null;
    if (registry.has(id)) return registry.get(id);
    const norm = String(id).toLowerCase().trim();
    for (const [k, v] of registry.entries()) {
      if (k.toLowerCase() === norm || k.toLowerCase().includes(norm) || norm.includes(k.toLowerCase())) return v;
    }
    return null;
  }

  function has(id) { return !!resolveDef(id); }
  function get(id) { return resolveDef(id); }

  /** Mount a widget. opts: { initial: {param overrides}, onAward(challenge, def), onEvent(name, data), onFaultSolved(def), completed: Set/array of challenge ids } */
  function mount(id, container, opts) {
    opts = opts || {};
    let def = resolveDef(id);
    container.innerHTML = "";
    if (!def) {
      const pretty = String(id || "interactive_model").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const dynSpec = {
        id: String(id || "interactive_model"),
        name: pretty,
        domains: [],
        engine: "phase_attractor",
        formula: "dx/dt = f(x, y; μ)",
        description: `Interactive dynamical parameter explorer for ${pretty}.`,
        params: [
          { key: "gain", label: "Coupling Gain α", type: "range", min: 0.1, max: 5.0, step: 0.1, value: 1.8 },
          { key: "damping", label: "Damping Ratio ζ", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 0.45 },
          { key: "drive", label: "Excitation Drive F₀", type: "range", min: 0.0, max: 3.0, step: 0.1, value: 1.2 },
        ],
        challenges: [
          { id: `${id}_tune`, text: "Sweep Coupling Gain α and Damping Ratio ζ across regime boundaries.", xp: 15 },
          { id: `${id}_probe`, text: "Click the phase canvas to launch a new trajectory from custom initial conditions.", xp: 15 },
        ],
      };
      registerBatch([dynSpec]);
      def = registry.get(dynSpec.id);
    }

    const root = el("div", { class: "sim-root" });
    const faultBanner = el("div", {
      class: "sim-fault-banner",
      style: "display:none; margin-bottom:10px; padding:10px 12px; border-radius:10px; background:rgba(255,107,107,0.14); border:1px solid rgba(255,107,107,0.45); color:#ffd166; font-size:0.84rem; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;"
    });
    const header = el("div", { class: "sim-header" }, [
      el("div", { class: "sim-title" }, [def.name]),
      el("div", { class: "sim-desc" }, [def.description || ""]),
    ]);
    const body = el("div", { class: "sim-body" });
    const stage = el("div", { class: "sim-stage" });
    const side = el("div", { class: "sim-side" });
    const controls = el("div", { class: "sim-controls" });
    const actionsEl = el("div", { class: "sim-actions" });
    const status = el("div", { class: "sim-status" });
    const readoutEl = el("div", { class: "sim-readout" });
    const extra = el("div", { class: "sim-extra" });
    const challengesEl = el("div", { class: "sim-challenges" });
    side.appendChild(controls); side.appendChild(actionsEl); side.appendChild(status); side.appendChild(readoutEl);
    body.appendChild(stage); body.appendChild(side);
    root.appendChild(faultBanner); root.appendChild(header); root.appendChild(body); root.appendChild(extra); root.appendChild(challengesEl);
    container.appendChild(root);

    // ---- params & controls
    const params = {};
    const initial = Object.assign({}, opts.initial || {});
    def.params.forEach((p) => {
      const fallback = p.value !== undefined ? p.value : (p.default !== undefined ? p.default : (p.min !== undefined ? p.min : 0));
      params[p.key] = (p.key in initial && initial[p.key] !== undefined && initial[p.key] !== null) ? initial[p.key] : fallback;
    });
    const paramListeners = [];
    const inputs = {};

    // ---- Fault-Injection ("Break the System") tracking
    const faultState = {
      active: false,
      injecting: false,
      targetParams: null,
      perturbedKeys: [],
      adjustments: 0,
    };

    function isFaultWithinTolerance() {
      if (!faultState.active || !faultState.targetParams || !faultState.perturbedKeys.length) return false;
      return faultState.perturbedKeys.every((k) => {
        const p = def.params.find((x) => x.key === k);
        const target = faultState.targetParams[k];
        const curr = params[k];
        if (!p) return true;
        if (p.type === "select" || p.type === "toggle" || p.type === "text") {
          return String(curr) === String(target);
        }
        const span = Math.max(1e-6, (p.max ?? 100) - (p.min ?? 0));
        return Math.abs(Number(curr) - Number(target)) <= 0.15 * span;
      });
    }

    function solveFault(revealed) {
      if (!faultState.active) return;
      faultState.active = false;
      faultBanner.innerHTML = "";
      faultBanner.style.display = "none";
      if (revealed) {
        setStatus("🔎 Solution revealed — the drifted parameters were restored to their stable values (no XP). Try another fault to earn XP.");
        return;
      }
      setStatus("🎉 System Stabilized! Fault diagnosed and corrected (+35 XP)");
      if (opts.onFaultSolved) {
        try { opts.onFaultSolved(def); } catch (e) { console.error(e); }
      } else if (typeof window !== "undefined" && window.App && typeof window.App.toast === "function") {
        try { window.App.toast("Fault diagnosed & fixed! +35 XP", "ok"); } catch (e) { console.error(e); }
      }
      if (opts.onEvent) {
        try { opts.onEvent("fault_solved", { id: def.id, xp: 35 }); } catch (e) { console.error(e); }
      }
    }

    function injectFault() {
      if (!def.params || !def.params.length) return;
      if (!faultState.active) {
        faultState.targetParams = Object.assign({}, params);
      }
      faultState.active = true;
      faultState.injecting = true;
      faultState.adjustments = 0;
      faultState.perturbedKeys = [];

      const candidates = def.params.filter((p) => !p.type || p.type === "range" || p.type === "number" || p.type === "select");
      const count = Math.min(3, Math.max(1, candidates.length));
      for (let i = 0; i < count; i++) {
        const p = candidates[i];
        faultState.perturbedKeys.push(p.key);
        const targetVal = faultState.targetParams[p.key];
        if (p.type === "select" && Array.isArray(p.options) && p.options.length > 1) {
          const alt = p.options.find((o) => String(o.value) !== String(targetVal)) || p.options[p.options.length - 1];
          setParam(p.key, alt.value);
        } else {
          const min = p.min ?? 0;
          const max = p.max ?? 100;
          const step = p.step ?? 1;
          const mid = 0.5 * (min + max);
          let raw = Number(targetVal) >= mid ? min + 0.04 * (max - min) : max - 0.04 * (max - min);
          if (step > 0) raw = Math.round((raw - min) / step) * step + min;
          raw = Math.max(min, Math.min(max, Number(raw.toFixed(6))));
          if (raw === Number(targetVal)) raw = Number(targetVal) >= mid ? min : max;
          setParam(p.key, raw);
        }
      }
      faultState.injecting = false;

      faultBanner.innerHTML = "";
      const msg = el("span", { class: "sim-fault-msg" }, [
        "⚠️ FAULT INJECTED: System parameters have drifted into an unstable regime! Diagnose the anomaly on the canvas and tune the controls back to stabilize the system."
      ]);
      const verifyBtn = el("button", {
        class: "sim-btn",
        type: "button",
        style: "background:#6ee7b7; color:#0f1222;",
        onclick: () => {
          // XP is only awarded when the learner has actually tuned the system back into tolerance.
          if (isFaultWithinTolerance()) { solveFault(false); return; }
          const off = faultState.perturbedKeys.filter((k) => {
            const p = def.params.find((x) => x.key === k);
            if (!p) return false;
            const t = faultState.targetParams[k], c = params[k];
            if (p.type === "select" || p.type === "toggle" || p.type === "text") return String(c) !== String(t);
            return Math.abs(Number(c) - Number(t)) > 0.15 * Math.max(1e-6, (p.max ?? 100) - (p.min ?? 0));
          }).length;
          setStatus(`❌ Not stable yet — ${off} of ${faultState.perturbedKeys.length} drifted parameter${faultState.perturbedKeys.length > 1 ? "s are" : " is"} still out of tolerance. Keep diagnosing.`);
          verifyBtn.animate && verifyBtn.animate([{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 260 });
        }
      }, ["✅ Verify Fix (+35 XP)"]);
      const revealBtn = el("button", {
        class: "sim-btn",
        type: "button",
        style: "background:transparent; color:#cbd5e1; border:1px solid rgba(203,213,225,.4);",
        onclick: () => {
          if (!faultState.targetParams) return;
          faultState.injecting = true;
          faultState.perturbedKeys.forEach((k) => setParam(k, faultState.targetParams[k]));
          faultState.injecting = false;
          solveFault(true);
        }
      }, ["🔎 Reveal Solution (0 XP)"]);
      faultBanner.appendChild(msg);
      faultBanner.appendChild(verifyBtn);
      faultBanner.appendChild(revealBtn);
      faultBanner.style.display = "flex";
      setStatus("⚠️ Fault active — inspect the anomaly and restore stability.");
    }

    function notify(key) {
      paramListeners.forEach((cb) => { try { cb(key, params[key], params); } catch (e) { console.error(e); } });
      if (faultState.active && !faultState.injecting) {
        faultState.adjustments += 1;
        if (isFaultWithinTolerance()) {
          solveFault();
        }
      }
    }

    def.params.forEach((p) => {
      const row = el("label", { class: "sim-ctrl sim-ctrl-" + (p.type || "range") });
      const lab = el("span", { class: "sim-ctrl-label" }, [p.label || p.key]);
      const val = el("span", { class: "sim-ctrl-value" });
      row.appendChild(lab);
      let input;
      if (p.type === "select") {
        input = el("select");
        (p.options || []).forEach((o) => {
          const opt = el("option", { value: String(o.value) }, [o.label || String(o.value)]);
          if (String(o.value) === String(params[p.key])) opt.selected = true;
          input.appendChild(opt);
        });
        input.addEventListener("change", () => {
          const o = (p.options || []).find((x) => String(x.value) === input.value);
          params[p.key] = o ? o.value : input.value; notify(p.key);
        });
        row.appendChild(input);
      } else if (p.type === "toggle") {
        input = el("input", { type: "checkbox" });
        input.checked = !!params[p.key];
        input.addEventListener("change", () => { params[p.key] = input.checked; notify(p.key); });
        row.appendChild(input);
      } else if (p.type === "text") {
        input = el("input", { type: "text", value: String(params[p.key] ?? "") });
        input.addEventListener("change", () => { params[p.key] = input.value; notify(p.key); });
        row.appendChild(input);
      } else if (p.type === "number") {
        input = el("input", { type: "number", value: String(params[p.key] ?? 0) });
        if (p.min != null) input.min = p.min; if (p.max != null) input.max = p.max; if (p.step != null) input.step = p.step;
        input.addEventListener("change", () => { params[p.key] = parseFloat(input.value); notify(p.key); });
        row.appendChild(input);
      } else { // range
        input = el("input", { type: "range", min: p.min ?? 0, max: p.max ?? 100, step: p.step ?? 1, value: params[p.key] });
        val.textContent = fmt(Number(params[p.key]), p.step);
        input.addEventListener("input", () => { params[p.key] = parseFloat(input.value); val.textContent = fmt(params[p.key], p.step); notify(p.key); });
        row.appendChild(input); row.appendChild(val);
      }
      inputs[p.key] = { input, val, p };
      controls.appendChild(row);
    });

    function setParam(key, value) {
      params[key] = value;
      const h = inputs[key];
      if (h) {
        if (h.p.type === "toggle") h.input.checked = !!value;
        else if (h.p.type === "select") h.input.value = String(value);
        else { h.input.value = String(value); if (h.val) h.val.textContent = fmt(Number(value), h.p.step); }
      }
      notify(key);
    }

    // ---- canvas + loop
    const resizeListeners = [];
    let canvasInfo = null;
    let ro = null;
    function createCanvas(c) {
      c = c || {};
      const aspect = c.aspect || 16 / 9;
      const maxHeight = c.maxHeight || 520;
      const canvas = el("canvas", { class: "sim-canvas" });
      stage.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const info = { canvas, ctx, width: 0, height: 0 };
      function resize() {
        const cssW = Math.max(200, stage.clientWidth || 600);
        const cssH = Math.min(maxHeight, Math.round(cssW / aspect));
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        if (info.width === cssW && info.height === cssH) return;
        canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
        canvas.style.width = cssW + "px"; canvas.style.height = cssH + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        info.width = cssW; info.height = cssH;
        resizeListeners.forEach((cb) => { try { cb(cssW, cssH); } catch (e) { console.error(e); } });
      }
      resize();
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(resize);
      if (typeof setTimeout === "function") setTimeout(resize, 60);
      if (typeof window !== "undefined" && window.ResizeObserver) {
        let roRaf = 0;
        ro = new ResizeObserver(() => {
          if (roRaf) cancelAnimationFrame(roRaf);
          roRaf = requestAnimationFrame(() => { roRaf = 0; resize(); });
        });
        ro.observe(stage);
      } else if (typeof window !== "undefined") {
        window.addEventListener("resize", resize);
      }
      canvasInfo = info;
      return info;
    }

    let loopState = null;
    function loop(fn) {
      let running = true, last = performance.now(), raf = 0;
      function frame(now) {
        if (!running) return;
        let dt = (now - last) / 1000; last = now;
        if (!Number.isFinite(dt) || dt < 0) dt = 0;
        if (dt > 0.05) dt = 0.05;
        let keep = true;
        try { keep = fn(dt); } catch (e) { console.error("[sim loop]", e); keep = false; }
        if (keep === false) { running = false; return; }
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      loopState = {
        stop() { running = false; cancelAnimationFrame(raf); },
        start() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } },
        get running() { return running; },
      };
      return loopState;
    }

    function pointer(canvas, handlers) {
      const pos = (e) => {
        const r = canvas.getBoundingClientRect();
        const src = e.touches && e.touches[0] ? e.touches[0] : e;
        return { x: src.clientX - r.left, y: src.clientY - r.top, e };
      };
      const down = (e) => { if (handlers.down) { handlers.down(pos(e)); } if (e.cancelable && e.touches) e.preventDefault(); };
      const move = (e) => { if (handlers.move) handlers.move(pos(e)); };
      const up = (e) => { if (handlers.up) handlers.up(pos(e)); };
      canvas.addEventListener("mousedown", down); canvas.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
      canvas.addEventListener("touchstart", down, { passive: false }); canvas.addEventListener("touchmove", move, { passive: true }); window.addEventListener("touchend", up);
      cleanups.push(() => {
        canvas.removeEventListener("mousedown", down); canvas.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
        canvas.removeEventListener("touchstart", down); canvas.removeEventListener("touchmove", move); window.removeEventListener("touchend", up);
      });
    }

    // ---- readouts, status, html
    function readout(obj) {
      readoutEl.innerHTML = "";
      Object.keys(obj || {}).forEach((k) => {
        readoutEl.appendChild(el("div", { class: "sim-readout-row" }, [el("span", { class: "k" }, [k]), el("span", { class: "v" }, [String(obj[k])])]));
      });
    }
    function setStatus(t) { status.textContent = t || ""; }
    function html(h) { extra.innerHTML = h || ""; return extra; }

    // ---- challenges
    const completed = new Set(Array.isArray(opts.completed) ? opts.completed : (opts.completed ? Array.from(opts.completed) : []));
    function renderChallenges() {
      challengesEl.innerHTML = "";
      if (!def.challenges.length) return;
      challengesEl.appendChild(el("div", { class: "sim-ch-title" }, ["🎯 Challenges"]));
      def.challenges.forEach((ch) => {
        const done = completed.has(ch.id);
        const cb = el("input", { type: "checkbox" }); cb.checked = done; cb.disabled = done;
        const row = el("label", { class: "sim-ch" + (done ? " done" : "") }, [cb, el("span", { class: "t" }, [ch.text]), el("span", { class: "xp" }, [`+${ch.xp || 10} XP`])]);
        cb.addEventListener("change", () => { if (cb.checked) award(ch.id, true); });
        challengesEl.appendChild(row);
      });
    }
    function award(chId, manual) {
      if (completed.has(chId)) return;
      const ch = def.challenges.find((c) => c.id === chId);
      if (!ch) return;
      completed.add(chId);
      renderChallenges();
      if (opts.onAward) { try { opts.onAward(ch, def, !!manual); } catch (e) { console.error(e); } }
    }
    renderChallenges();

    const cleanups = [];
    const api = {
      params, initial, colors: COLORS, def,
      onParam(cb) { paramListeners.push(cb); },
      setParam, createCanvas, loop, pointer, readout, setStatus, html, award,
      onResize(cb) { resizeListeners.push(cb); },
      random: mulberry32(opts.seed || 1337),
      emit(name, data) { if (opts.onEvent) { try { opts.onEvent(name, data); } catch (e) { console.error(e); } } },
      injectFault, solveFault,
      stage, side, root,
    };

    let handle = null;
    try {
      handle = def.mount(stage, api) || {};
    } catch (e) {
      console.error("[sims] mount failed", id, e);
      stage.appendChild(el("div", { class: "sim-missing" }, ["This simulation crashed while loading: " + e.message]));
      handle = {};
    }

    def.actions.forEach((a) => {
      actionsEl.appendChild(el("button", { class: "sim-btn", type: "button", onclick: () => { try { a.fn(handle, api); } catch (e) { console.error(e); } } }, [a.label]));
    });
    actionsEl.appendChild(el("button", {
      class: "sim-btn sim-btn-ghost",
      type: "button",
      style: "border-color:rgba(255,107,107,0.45); color:#ff8fab;",
      onclick: () => injectFault()
    }, ["🔬 Break System"]));
    actionsEl.appendChild(el("button", { class: "sim-btn sim-btn-ghost", type: "button", onclick: () => { destroy(); mount(id, container, opts); } }, ["↺ Reset"]));

    function destroy() {
      try { if (handle && handle.destroy) handle.destroy(); } catch (e) { console.error(e); }
      if (loopState) loopState.stop();
      if (ro) ro.disconnect();
      cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } });
      container.innerHTML = "";
    }

    return { destroy, handle, api, def };
  }

  // =========================================================================
  // SPECIALIZED MULTI-DOMAIN INTERACTIVE CANVAS SIMULATION ENGINES
  // =========================================================================

  function normParam(pDef, val) {
    if (!pDef) return 0.5;
    if (pDef.type === "toggle") return val ? 1 : 0;
    if (pDef.type === "select" && Array.isArray(pDef.options)) {
      const idx = pDef.options.findIndex((o) => String(o.value) === String(val));
      return idx >= 0 ? idx / Math.max(1, pDef.options.length - 1) : 0;
    }
    const min = Number.isFinite(Number(pDef.min)) ? Number(pDef.min) : 0;
    const max = Number.isFinite(Number(pDef.max)) ? Number(pDef.max) : 100;
    const raw = Number(val !== undefined ? val : (pDef.value !== undefined ? pDef.value : pDef.default));
    if (!Number.isFinite(raw)) return 0.5;
    return Math.max(0, Math.min(1, (raw - min) / Math.max(1e-6, max - min)));
  }

  function drawHUD(ctx, W, H, spec, subtitle, eqText) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);
    // Subtle coordinate grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    const step = 40;
    ctx.beginPath();
    for (let x = step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();

    // Top HUD bar
    ctx.fillStyle = "rgba(22, 26, 46, 0.86)";
    ctx.fillRect(10, 8, W - 20, 28);
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(spec.formula || eqText || spec.name, 18, 26);
    if (subtitle) {
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = COLORS.muted;
      const tw = ctx.measureText(subtitle).width;
      ctx.fillText(subtitle, Math.max(220, W - tw - 18), 26);
    }
  }

  const ENGINES = {
    // 1. Phase-Portrait, ODE & Strange Attractor RK4 Engine
    phase_attractor(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let time = 0;
      let pulseBoost = 0;
      let pointerInteractions = 0;
      let paramTouches = 0;
      const trails = [];

      function spawnTrail(x0, y0, z0, col) {
        trails.push({
          pts: [{ x: x0, y: y0, z: z0 }],
          color: col || COLORS.series[trails.length % COLORS.series.length],
        });
        if (trails.length > 6) trails.shift();
      }

      function initTrails() {
        trails.length = 0;
        for (let i = 0; i < 3; i++) {
          spawnTrail((rng() - 0.5) * 2.2, (rng() - 0.5) * 2.2, 0.5 + rng() * 1.5, COLORS.series[i]);
        }
      }
      initTrails();

      function getRates(x, y, z, a, b, c) {
        const sub = spec.subtype || "lorenz";
        if (sub === "lorenz") {
          const sigma = 6 + a * 14, rho = 14 + b * 28, beta = 1.2 + c * 2.8;
          return {
            dx: sigma * (y - x) * 0.08,
            dy: (x * (rho - (z + 15)) - y) * 0.08,
            dz: (x * y - beta * (z + 15)) * 0.08,
          };
        }
        if (sub === "fitzhugh" || sub === "hodgkin") {
          const I = (a - 0.3) * 1.8 + pulseBoost;
          const eps = 0.08 + b * 0.25;
          const gamma = 0.5 + c * 0.9;
          return {
            dx: (x - (x * x * x) / 3 - y + I) * 2.2,
            dy: eps * (x + 0.7 - gamma * y) * 2.2,
            dz: -0.2 * z,
          };
        }
        if (sub === "lotka" || sub === "replicator") {
          const u = Math.max(0.05, x + 1.5), v = Math.max(0.05, y + 1.5);
          const alpha = 0.6 + a * 1.6, beta = 0.4 + b * 1.2, delta = 0.4 + c * 1.2;
          return {
            dx: (alpha * u - beta * u * v) * 0.7,
            dy: (delta * u * v - (0.5 + c) * v) * 0.7,
            dz: 0,
          };
        }
        if (sub === "duffing") {
          const damp = 0.08 + b * 0.6;
          const drive = (0.3 + c * 1.4) * Math.cos((1.2 + a * 2.0) * time);
          return {
            dx: y * 1.4,
            dy: (x - x * x * x - damp * y + drive + pulseBoost) * 1.4,
            dz: 0,
          };
        }
        // Generalized nonlinear coupled oscillator / Van der Pol / limit cycle
        const mu = (a - 0.15) * 3.2;
        const omega = 0.7 + b * 2.1;
        const cpl = (c - 0.5) * 1.6;
        return {
          dx: (y + cpl * z) * 1.3,
          dy: (mu * (1 - x * x) * y - omega * omega * x + pulseBoost) * 1.3,
          dz: (-0.6 * z + x * y * 0.5) * 1.3,
        };
      }

      api.onParam(() => {
        paramTouches++;
        if (spec.challenges && spec.challenges[0] && paramTouches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges && spec.challenges[2] && paramTouches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          const W = cv.width, H = cv.height;
          const pW = W * 0.62;
          const nx = ((pt.x - pW * 0.5) / (pW * 0.38)) * 2.4;
          const ny = -((pt.y - (H * 0.54)) / (H * 0.36)) * 2.4;
          spawnTrail(nx, ny, 1.0, COLORS.series[(trails.length + 1) % COLORS.series.length]);
          pointerInteractions++;
          api.setStatus(`Spawned trajectory at (${nx.toFixed(2)}, ${ny.toFixed(2)})`);
          if (spec.challenges && spec.challenges[1]) api.award(spec.challenges[1].id);
        },
      });

      api.loop((dt) => {
        time += dt;
        pulseBoost *= Math.exp(-dt * 3.5);
        const W = cv.width, H = cv.height;
        const ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click phase plane to launch trajectory", "dx/dt = f(x,y; μ),  dy/dt = g(x,y; μ)");

        const pW = W * 0.60, pH = H - 56;
        const cx = pW * 0.52, cy = 44 + pH * 0.5;
        const scaleX = pW * 0.16, scaleY = pH * 0.16;

        // Vector field quiver
        ctx.strokeStyle = "rgba(124,156,255,0.25)";
        ctx.lineWidth = 1;
        for (let gx = -2.4; gx <= 2.4; gx += 0.6) {
          for (let gy = -2.0; gy <= 2.0; gy += 0.5) {
            const r = getRates(gx, gy, 0.5, a, b, c);
            const mag = Math.hypot(r.dx, r.dy) || 1;
            const ux = (r.dx / mag) * 11, uy = -(r.dy / mag) * 11;
            const sx = cx + gx * scaleX, sy = cy - gy * scaleY;
            ctx.beginPath();
            ctx.moveTo(sx - ux * 0.5, sy - uy * 0.5);
            ctx.lineTo(sx + ux * 0.5, sy + uy * 0.5);
            ctx.stroke();
          }
        }

        // Axes
        ctx.strokeStyle = COLORS.axis;
        ctx.beginPath();
        ctx.moveTo(16, cy); ctx.lineTo(pW - 10, cy);
        ctx.moveTo(cx, 46); ctx.lineTo(cx, H - 14);
        ctx.stroke();
        ctx.fillStyle = COLORS.muted;
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText(spec.xLabel || "State x₁", pW - 64, cy - 6);
        ctx.fillText(spec.yLabel || "State x₂", cx + 6, 56);

        // RK4 integration & rendering
        let lead = { x: 0, y: 0, z: 0 };
        const h = Math.min(0.025, Math.max(0.008, dt));
        trails.forEach((tr, idx) => {
          const head = tr.pts[tr.pts.length - 1];
          const k1 = getRates(head.x, head.y, head.z, a, b, c);
          const k2 = getRates(head.x + 0.5 * h * k1.dx, head.y + 0.5 * h * k1.dy, head.z + 0.5 * h * k1.dz, a, b, c);
          const k3 = getRates(head.x + 0.5 * h * k2.dx, head.y + 0.5 * h * k2.dy, head.z + 0.5 * h * k2.dz, a, b, c);
          const k4 = getRates(head.x + h * k3.dx, head.y + h * k3.dy, head.z + h * k3.dz, a, b, c);
          const nx = Math.max(-3.2, Math.min(3.2, head.x + (h / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx)));
          const ny = Math.max(-3.2, Math.min(3.2, head.y + (h / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy)));
          const nz = Math.max(-3.2, Math.min(3.2, head.z + (h / 6) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz)));
          tr.pts.push({ x: nx, y: ny, z: nz });
          if (tr.pts.length > 180) tr.pts.shift();
          if (idx === trails.length - 1) lead = { x: nx, y: ny, z: nz };

          ctx.strokeStyle = tr.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          tr.pts.forEach((p, i) => {
            const px = cx + p.x * scaleX, py = cy - p.y * scaleY;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          });
          ctx.stroke();
          const lastPt = tr.pts[tr.pts.length - 1];
          ctx.fillStyle = tr.color;
          ctx.beginPath();
          ctx.arc(cx + lastPt.x * scaleX, cy - lastPt.y * scaleY, 4.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Right-hand Time-Series & Lyapunov / Eigen-spectrum Panel
        const rx = pW + 12, rw = W - rx - 14, ry = 48, rh = H - 64;
        ctx.fillStyle = "rgba(22,26,46,0.75)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Time-Series & Phase Energy", rx + 10, ry + 18);

        const activePts = trails[trails.length - 1]?.pts || [];
        if (activePts.length > 1) {
          ctx.strokeStyle = COLORS.primary;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          activePts.forEach((p, i) => {
            const tx = rx + 10 + (i / 180) * (rw - 20);
            const ty = ry + rh * 0.45 - p.x * (rh * 0.11);
            if (i === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
          });
          ctx.stroke();

          ctx.strokeStyle = COLORS.secondary;
          ctx.beginPath();
          activePts.forEach((p, i) => {
            const tx = rx + 10 + (i / 180) * (rw - 20);
            const ty = ry + rh * 0.45 - p.y * (rh * 0.11);
            if (i === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
          });
          ctx.stroke();
        }

        const energy = 0.5 * (lead.x * lead.x + lead.y * lead.y + lead.z * lead.z);
        const lyap = ((a - 0.35) * 1.4 - b * 0.6 + c * 0.4);
        ctx.fillStyle = COLORS.muted;
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText(`Lyapunov λ₁ ≈ ${lyap >= 0 ? "+" : ""}${lyap.toFixed(3)}`, rx + 10, ry + rh - 28);
        ctx.fillStyle = lyap > 0.05 ? COLORS.danger : (lyap < -0.05 ? COLORS.ok : COLORS.accent);
        ctx.fillText(lyap > 0.05 ? "Regime: Chaotic / Unstable" : (lyap < -0.05 ? "Regime: Damped Attractor" : "Regime: Limit-Cycle Bifurcation"), rx + 10, ry + rh - 12);

        api.readout({
          [spec.xLabel || "x₁(t)"]: lead.x.toFixed(3),
          [spec.yLabel || "x₂(t)"]: lead.y.toFixed(3),
          "Phase Energy H": energy.toFixed(3),
          "Lyapunov λ₁": (lyap >= 0 ? "+" : "") + lyap.toFixed(3),
        });
      });

      return {
        pulse() { pulseBoost = 1.8; initTrails(); api.setStatus("Impulse perturbation injected into phase space."); if (spec.challenges?.[1]) api.award(spec.challenges[1].id); },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 2. Wave, Harmonics, Fourier Epicycles, Optics & RF/Signal Engine
    wave_fourier(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let time = 0;
      let probe = { x: 0.55, y: 0.48 };
      let pulseAmp = 0;
      let touches = 0;

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          probe.x = Math.max(0.08, Math.min(0.92, pt.x / Math.max(1, cv.width)));
          probe.y = Math.max(0.15, Math.min(0.88, pt.y / Math.max(1, cv.height)));
          api.setStatus(`Sensor probe moved to (${(probe.x * 100).toFixed(0)}%, ${(probe.y * 100).toFixed(0)}%)`);
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
        move(pt) {
          if (pt.e && pt.e.buttons === 1) {
            probe.x = Math.max(0.08, Math.min(0.92, pt.x / Math.max(1, cv.width)));
            probe.y = Math.max(0.15, Math.min(0.88, pt.y / Math.max(1, cv.height)));
          }
        },
      });

      api.loop((dt) => {
        time += dt;
        pulseAmp *= Math.exp(-dt * 2.5);
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);
        const d = normParam(pDefs[3], api.params[pDefs[3]?.key]);

        drawHUD(ctx, W, H, spec, "Drag sensor probe on canvas", "ψ(x,t) = Σ cₙ exp(i(kₙx − ωₙt + φₙ))");

        const freq = 1.0 + a * 5.0;
        const mod = 0.2 + b * 2.4;
        const nharm = Math.max(1, Math.round(1 + c * 9));
        const noise = d * 0.45 + pulseAmp * 0.3;

        // Left: Phasor / Constellation / Epicycle wheel
        const cx = W * 0.24, cy = H * 0.54, baseR = Math.min(W, H) * 0.17;
        let vx = cx, vy = cy;
        for (let n = 1; n <= nharm; n++) {
          const k = 2 * n - 1;
          const r = (baseR * 1.1) / Math.pow(k, 0.85 + b * 0.4);
          const ang = k * freq * time * 1.6 + n * mod;
          ctx.strokeStyle = "rgba(255,255,255,0.18)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(vx, vy, r, 0, Math.PI * 2);
          ctx.stroke();
          const nx = vx + r * Math.cos(ang);
          const ny = vy + r * Math.sin(ang);
          ctx.strokeStyle = COLORS.series[(n - 1) % COLORS.series.length];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          vx = nx; vy = ny;
        }

        // Right: Waveform + Spectral Envelope
        const wx0 = W * 0.45, ww = W * 0.51, wyMid = H * 0.42, wh = H * 0.24;
        ctx.strokeStyle = "rgba(255,209,102,0.35)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(wx0, vy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = COLORS.primary;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        let probeVal = 0;
        for (let i = 0; i <= 180; i++) {
          const u = i / 180;
          let sum = 0;
          for (let n = 1; n <= nharm; n++) {
            const k = 2 * n - 1;
            const amp = 1 / Math.pow(k, 0.85 + b * 0.4);
            sum += amp * Math.sin(k * freq * (time * 1.6 - u * 4.2) + n * mod);
          }
          sum += Math.sin(u * 37 + time * 11) * noise * 0.35;
          const px = wx0 + u * ww;
          const py = wyMid + sum * wh * 0.55;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          if (Math.abs(u - probe.x) < 0.01) probeVal = sum;
        }
        ctx.stroke();

        // Bottom right: Spectral FFT bar graph
        const by0 = H * 0.88, bh = H * 0.22;
        ctx.fillStyle = COLORS.muted;
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText("Harmonic Power Spectrum |F(ω)|²", wx0, by0 - bh - 6);
        const bw = (ww - 20) / 10;
        for (let n = 1; n <= 10; n++) {
          const active = n <= nharm ? 1 : 0.12;
          const mag = active / Math.pow(2 * n - 1, 0.7 + b * 0.35);
          const barH = Math.max(4, mag * bh);
          ctx.fillStyle = n <= nharm ? COLORS.series[(n - 1) % COLORS.series.length] : "rgba(255,255,255,0.12)";
          ctx.fillRect(wx0 + (n - 1) * bw, by0 - barH, bw - 6, barH);
        }

        // Interactive Probe Marker
        const prX = probe.x * W, prY = probe.y * H;
        ctx.strokeStyle = COLORS.accent;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(prX, prY, 7, 0, Math.PI * 2);
        ctx.stroke();

        const snrDb = (22 - noise * 28 + a * 8).toFixed(1);
        const bwHz = (freq * nharm * 12.5).toFixed(1);
        api.readout({
          "Fundamental f₀": `${(freq * 10).toFixed(1)} Hz`,
          "Active Harmonics": String(nharm),
          "Spectral Bandwidth": `${bwHz} Hz`,
          "SNR / Coherence": `${snrDb} dB`,
        });
      });

      return {
        pulse() { pulseAmp = 1.5; api.setStatus("Injected broadband wave packet."); if (spec.challenges?.[1]) api.award(spec.challenges[1].id); },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 3. 2D Lattice, Cellular Field, Reaction-Diffusion, Ising Spin & Fluid/Stress Engine
    field_lattice(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      const NX = 38, NY = 22;
      let uGrid = new Float32Array(NX * NY);
      let vGrid = new Float32Array(NX * NY);
      let nextU = new Float32Array(NX * NY);
      let nextV = new Float32Array(NX * NY);
      let touches = 0;

      function seedLattice() {
        for (let i = 0; i < NX * NY; i++) {
          uGrid[i] = 1.0;
          vGrid[i] = rng() < 0.16 ? 0.5 + 0.4 * rng() : 0.0;
        }
      }
      seedLattice();

      function splat(px, py) {
        const gx = Math.floor((px / Math.max(1, cv.width * 0.68)) * NX);
        const gy = Math.floor(((py - 42) / Math.max(1, cv.height - 54)) * NY);
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const x = (gx + dx + NX) % NX, y = (gy + dy + NY) % NY;
            if (dx * dx + dy * dy <= 5) {
              vGrid[y * NX + x] = 0.85;
              uGrid[y * NX + x] = 0.2;
            }
          }
        }
      }

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          splat(pt.x, pt.y);
          api.setStatus("Nucleated localized field excitation on lattice.");
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
        move(pt) {
          if (pt.e && pt.e.buttons === 1) splat(pt.x, pt.y);
        },
      });

      api.loop(() => {
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click/drag lattice to nucleate defects or waves", "∂u/∂t = Dᵤ∇²u − uv² + F(1−u)");

        const F = 0.022 + a * 0.055;
        const K = 0.048 + b * 0.024;
        const diff = 0.14 + c * 0.16;

        let meanV = 0, gradEnergy = 0;
        for (let y = 0; y < NY; y++) {
          for (let x = 0; x < NX; x++) {
            const idx = y * NX + x;
            const u = uGrid[idx], v = vGrid[idx];
            const lU = uGrid[y * NX + ((x + 1) % NX)] + uGrid[y * NX + ((x - 1 + NX) % NX)] +
                       uGrid[((y + 1) % NY) * NX + x] + uGrid[((y - 1 + NY) % NY) * NX + x] - 4 * u;
            const lV = vGrid[y * NX + ((x + 1) % NX)] + vGrid[y * NX + ((x - 1 + NX) % NX)] +
                       vGrid[((y + 1) % NY) * NX + x] + vGrid[((y - 1 + NY) % NY) * NX + x] - 4 * v;
            const uvv = u * v * v;
            nextU[idx] = Math.max(0, Math.min(1, u + (diff * lU - uvv + F * (1 - u)) * 0.9));
            nextV[idx] = Math.max(0, Math.min(1, v + (0.5 * diff * lV + uvv - (F + K) * v) * 0.9));
            meanV += nextV[idx];
            gradEnergy += Math.abs(lV);
          }
        }
        const tmpU = uGrid; uGrid = nextU; nextU = tmpU;
        const tmpV = vGrid; vGrid = nextV; nextV = tmpV;
        meanV /= (NX * NY);
        gradEnergy /= (NX * NY);

        // Render 2D Lattice
        const lw = W * 0.66, lh = H - 56;
        const cw = lw / NX, ch = lh / NY;
        for (let y = 0; y < NY; y++) {
          for (let x = 0; x < NX; x++) {
            const v = vGrid[y * NX + x];
            const u = uGrid[y * NX + x];
            const r = Math.round(20 + v * 220);
            const g = Math.round(28 + (1 - u) * 140 + v * 65);
            const bl = Math.round(55 + u * 185);
            ctx.fillStyle = `rgb(${r},${g},${bl})`;
            ctx.fillRect(14 + x * cw, 44 + y * ch, Math.ceil(cw), Math.ceil(ch));
          }
        }

        // Right panel: Cross-section profile & Order parameter
        const rx = lw + 24, rw = W - rx - 14, ry = 44, rh = H - 56;
        ctx.fillStyle = "rgba(22,26,46,0.8)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Mid-Plane Field Cross-Section", rx + 10, ry + 18);

        ctx.strokeStyle = COLORS.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const midY = Math.floor(NY / 2);
        for (let x = 0; x < NX; x++) {
          const px = rx + 10 + (x / (NX - 1)) * (rw - 20);
          const py = ry + rh * 0.68 - vGrid[midY * NX + x] * (rh * 0.42);
          if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const entropy = (-meanV * Math.log(Math.max(1e-4, meanV)) - (1 - meanV) * Math.log(Math.max(1e-4, 1 - meanV)));
        ctx.fillStyle = COLORS.muted;
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText(`Order Parameter ⟨φ⟩: ${meanV.toFixed(3)}`, rx + 10, ry + rh - 30);
        ctx.fillText(`Configurational S: ${entropy.toFixed(3)}`, rx + 10, ry + rh - 14);

        api.readout({
          "Order Parameter ⟨φ⟩": meanV.toFixed(3),
          "Interface Gradient ⟨|∇φ|⟩": gradEnergy.toFixed(3),
          "Lattice Entropy S": entropy.toFixed(3),
          "Coupling Ratio F/K": (F / K).toFixed(2),
        });
      });

      return {
        pulse() { seedLattice(); api.setStatus("Re-nucleated multi-domain lattice excitations."); if (spec.challenges?.[1]) api.award(spec.challenges[1].id); },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 4. Network Topology, Protocol State, Consensus & Causal Graph Engine
    network_graph(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let time = 0, touches = 0;
      const N = 14;
      const nodes = [];
      const packets = [];
      let dragNode = null;

      function buildGraph() {
        nodes.length = 0;
        for (let i = 0; i < N; i++) {
          const ang = (i / N) * Math.PI * 2;
          const rad = (i % 3 === 0) ? 0.18 : 0.34;
          nodes.push({
            id: i,
            x: 0.35 + Math.cos(ang) * rad,
            y: 0.54 + Math.sin(ang) * rad,
            load: 0.2 + rng() * 0.6,
            state: i === 0 ? 1 : (rng() < 0.25 ? 0.8 : 0.2),
          });
        }
      }
      buildGraph();

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          const W = cv.width, H = cv.height;
          let best = null, bestD = 26;
          nodes.forEach((n) => {
            const d = Math.hypot(n.x * W - pt.x, n.y * H - pt.y);
            if (d < bestD) { bestD = d; best = n; }
          });
          if (best) {
            dragNode = best;
            best.state = 1.0;
            for (let j = 0; j < N; j++) {
              if (j !== best.id && (Math.abs(j - best.id) <= 2 || j === (best.id + 5) % N)) {
                packets.push({ from: best.id, to: j, u: 0, color: COLORS.accent });
              }
            }
            api.setStatus(`Injected broadcast/fault pulse at Node v${best.id}`);
            if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
          }
        },
        move(pt) {
          if (dragNode) {
            dragNode.x = Math.max(0.08, Math.min(0.62, pt.x / Math.max(1, cv.width)));
            dragNode.y = Math.max(0.16, Math.min(0.88, pt.y / Math.max(1, cv.height)));
          }
        },
        up() { dragNode = null; },
      });

      api.loop((dt) => {
        time += dt;
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click/drag nodes to inject traffic or isolate links", "L = D − A,  dx/dt = −β L x + σ(W x)");

        const density = 1 + Math.round(a * 3);
        const rate = 0.6 + b * 2.2;
        const damping = 0.2 + c * 0.7;

        if (rng() < dt * rate * 3.5 && packets.length < 28) {
          const s = Math.floor(rng() * N);
          const t = (s + 1 + Math.floor(rng() * density)) % N;
          packets.push({ from: s, to: t, u: 0, color: COLORS.primary });
        }

        // Draw edges
        let edgeCount = 0;
        ctx.lineWidth = 1.2;
        for (let i = 0; i < N; i++) {
          for (let step = 1; step <= density; step++) {
            const j = (i + step) % N;
            edgeCount++;
            ctx.strokeStyle = "rgba(124,156,255,0.22)";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * W, nodes[i].y * H);
            ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
            ctx.stroke();
          }
        }

        // Update and draw packets
        for (let i = packets.length - 1; i >= 0; i--) {
          const pk = packets[i];
          pk.u += dt * rate;
          const n1 = nodes[pk.from], n2 = nodes[pk.to];
          if (pk.u >= 1) {
            n2.state = Math.min(1, n2.state + 0.32);
            packets.splice(i, 1);
            continue;
          }
          const px = (n1.x + (n2.x - n1.x) * pk.u) * W;
          const py = (n1.y + (n2.y - n1.y) * pk.u) * H;
          ctx.fillStyle = pk.color;
          ctx.beginPath();
          ctx.arc(px, py, 3.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw nodes
        let avgState = 0;
        nodes.forEach((n) => {
          n.state = Math.max(0.12, n.state * (1 - dt * damping * 0.5));
          avgState += n.state;
          const nx = n.x * W, ny = n.y * H;
          ctx.fillStyle = n.state > 0.65 ? COLORS.secondary : (n.state > 0.35 ? COLORS.primary : "#2a3158");
          ctx.beginPath();
          ctx.arc(nx, ny, 9 + n.state * 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = COLORS.text;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.fillStyle = COLORS.text;
          ctx.font = "10px system-ui, sans-serif";
          ctx.fillText(`v${n.id}`, nx - 6, ny + 3);
        });
        avgState /= N;

        // Right panel: Node activation bar chart & spectral gap
        const rx = W * 0.68, rw = W - rx - 14, ry = 46, rh = H - 60;
        ctx.fillStyle = "rgba(22,26,46,0.8)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Node Centrality & Activation", rx + 10, ry + 18);

        const barH = (rh - 54) / N;
        nodes.forEach((n, idx) => {
          const by = ry + 28 + idx * barH;
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(rx + 28, by, rw - 40, barH - 3);
          ctx.fillStyle = n.state > 0.6 ? COLORS.secondary : COLORS.ok;
          ctx.fillRect(rx + 28, by, (rw - 40) * n.state, barH - 3);
          ctx.fillStyle = COLORS.muted;
          ctx.font = "9px system-ui, sans-serif";
          ctx.fillText(`v${idx}`, rx + 8, by + barH - 4);
        });

        const lambda2 = (0.35 * density + a * 0.8).toFixed(3);
        api.readout({
          "Active Edges |E|": String(edgeCount),
          "Algebraic Connectivity λ₂": lambda2,
          "Mean Node State ⟨s⟩": avgState.toFixed(3),
          "In-Flight Packets": String(packets.length),
        });
      });

      return {
        pulse() {
          nodes.forEach((n, i) => { if (i % 3 === 0) n.state = 1.0; });
          api.setStatus("Triggered network-wide synchronization wave.");
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
        randomize() {
          buildGraph();
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 5. Quantum State, Bloch Sphere, Orbital & Relativistic Geodesic Engine
    quantum_orbital(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let time = 0, touches = 0;
      let targetAngle = 0.65;

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          const cx = cv.width * 0.34, cy = cv.height * 0.54;
          targetAngle = Math.atan2(pt.y - cy, pt.x - cx);
          api.setStatus(`Set state vector azimuth φ = ${(targetAngle * 180 / Math.PI).toFixed(1)}°`);
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
      });

      api.loop((dt) => {
        time += dt;
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click sphere/orbit to re-orient state vector", "iℏ ∂|ψ⟩/∂t = Ĥ|ψ⟩,  ds² = −(1−rₛ/r)c²dt² + dr²/(1−rₛ/r)");

        const cx = W * 0.33, cy = H * 0.54, R = Math.min(W, H) * 0.29;
        // Outer sphere / orbit boundary
        ctx.strokeStyle = "rgba(124,156,255,0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        // Equatorial ellipse
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, R, R * 0.34, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Precessing trajectory / geodesic path
        const theta = (0.15 + a * 0.78) * Math.PI;
        const omega = 0.8 + b * 2.8;
        const decoherence = Math.max(0.15, 1 - c * 0.65);

        ctx.strokeStyle = COLORS.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const t = time - (90 - i) * 0.03;
          const phi = targetAngle + omega * t;
          const th = theta + 0.18 * Math.sin(t * 2.1) * (1 - decoherence);
          const x3 = Math.sin(th) * Math.cos(phi) * decoherence;
          const y3 = Math.sin(th) * Math.sin(phi) * decoherence;
          const z3 = Math.cos(th) * decoherence;
          const px = cx + x3 * R;
          const py = cy - z3 * R + y3 * R * 0.32;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const phiNow = targetAngle + omega * time;
        const sx = cx + Math.sin(theta) * Math.cos(phiNow) * decoherence * R;
        const sy = cy - Math.cos(theta) * decoherence * R + Math.sin(theta) * Math.sin(phiNow) * decoherence * R * 0.32;
        ctx.strokeStyle = COLORS.secondary;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        ctx.fillStyle = COLORS.secondary;
        ctx.beginPath();
        ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Right panel: Probability / Eigenstate amplitudes & Potential well
        const rx = W * 0.64, rw = W - rx - 14, ry = 46, rh = H - 60;
        ctx.fillStyle = "rgba(22,26,46,0.8)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Eigenstate Probabilities & Fidelity", rx + 10, ry + 18);

        const p0 = Math.pow(Math.cos(theta / 2), 2);
        const p1 = 1 - p0;
        const purity = 0.5 * (1 + decoherence * decoherence);

        // Bars for |0⟩, |1⟩, Purity
        const items = [
          { label: "P(|0⟩ / Ground)", val: p0, col: COLORS.primary },
          { label: "P(|1⟩ / Excited)", val: p1, col: COLORS.secondary },
          { label: "Purity Tr(ρ²)", val: purity, col: COLORS.ok },
          { label: "Coherence |ρ₀₁|", val: Math.sqrt(p0 * p1) * decoherence, col: COLORS.accent },
        ];
        items.forEach((it, idx) => {
          const by = ry + 36 + idx * 42;
          ctx.fillStyle = COLORS.muted;
          ctx.font = "11px system-ui, sans-serif";
          ctx.fillText(`${it.label}: ${(it.val * 100).toFixed(1)}%`, rx + 12, by);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(rx + 12, by + 6, rw - 24, 12);
          ctx.fillStyle = it.col;
          ctx.fillRect(rx + 12, by + 6, (rw - 24) * it.val, 12);
        });

        api.readout({
          "Polar Angle θ": `${(theta * 180 / Math.PI).toFixed(1)}°`,
          "Ground State P(|0⟩)": p0.toFixed(3),
          "Excited State P(|1⟩)": p1.toFixed(3),
          "State Purity Tr(ρ²)": purity.toFixed(3),
        });
      });

      return {
        pulse() { targetAngle += Math.PI * 0.5; api.setStatus("Applied π/2 unitary pulse gate."); if (spec.challenges?.[1]) api.award(spec.challenges[1].id); },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 6. Neural Manifold, Loss Surface, Attention Matrix & Representation Engine
    neural_manifold(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let touches = 0;
      let walker = { x: -0.65, y: 0.58, vx: 0, vy: 0 };
      const path = [{ x: walker.x, y: walker.y }];

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          const pW = cv.width * 0.62;
          if (pt.x < pW) {
            walker.x = ((pt.x / pW) - 0.5) * 2.2;
            walker.y = (((pt.y - 42) / Math.max(1, cv.height - 54)) - 0.5) * 2.2;
            walker.vx = 0; walker.vy = 0;
            path.length = 0;
            path.push({ x: walker.x, y: walker.y });
            api.setStatus(`Initialized latent vector z₀ = (${walker.x.toFixed(2)}, ${walker.y.toFixed(2)})`);
            if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
          }
        },
      });

      function lossAt(x, y, curv, reg) {
        return 0.45 * (x * x + curv * y * y) - 0.28 * Math.cos(3.2 * x) * Math.cos(2.6 * y) + reg * (Math.abs(x) + Math.abs(y));
      }

      api.loop((dt) => {
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click contour map to initialize optimizer / latent probe", "θₜ₊₁ = θₜ − η ∇L(θₜ) + β vₜ");

        const lr = 0.04 + a * 0.35;
        const curv = 0.5 + b * 2.2;
        const reg = c * 0.35;

        // Gradient step
        const eps = 0.01;
        const gx = (lossAt(walker.x + eps, walker.y, curv, reg) - lossAt(walker.x - eps, walker.y, curv, reg)) / (2 * eps);
        const gy = (lossAt(walker.x, walker.y + eps, curv, reg) - lossAt(walker.x, walker.y - eps, curv, reg)) / (2 * eps);
        walker.vx = 0.78 * walker.vx - lr * gx * dt * 8;
        walker.vy = 0.78 * walker.vy - lr * gy * dt * 8;
        walker.x = Math.max(-1.1, Math.min(1.1, walker.x + walker.vx));
        walker.y = Math.max(-1.1, Math.min(1.1, walker.y + walker.vy));
        path.push({ x: walker.x, y: walker.y });
        if (path.length > 90) path.shift();

        // Draw Loss / Manifold Heatmap
        const pW = W * 0.60, pH = H - 56;
        const NX = 28, NY = 18;
        const cw = pW / NX, ch = pH / NY;
        for (let iy = 0; iy < NY; iy++) {
          for (let ix = 0; ix < NX; ix++) {
            const lx = ((ix + 0.5) / NX - 0.5) * 2.2;
            const ly = ((iy + 0.5) / NY - 0.5) * 2.2;
            const val = Math.max(0, Math.min(1, (lossAt(lx, ly, curv, reg) + 0.3) / 1.8));
            const r = Math.round(22 + val * 150);
            const g = Math.round(35 + (1 - val) * 145);
            const bl = Math.round(80 + (1 - val) * 160);
            ctx.fillStyle = `rgb(${r},${g},${bl})`;
            ctx.fillRect(14 + ix * cw, 44 + iy * ch, Math.ceil(cw), Math.ceil(ch));
          }
        }

        // Trajectory on manifold
        ctx.strokeStyle = COLORS.accent;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        path.forEach((p, i) => {
          const px = 14 + (p.x / 2.2 + 0.5) * pW;
          const py = 44 + (p.y / 2.2 + 0.5) * pH;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Right panel: Attention / Cosine Similarity Matrix
        const rx = pW + 24, rw = W - rx - 14, ry = 44, rh = H - 56;
        ctx.fillStyle = "rgba(22,26,46,0.85)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Token / Feature Coupling Matrix", rx + 10, ry + 18);

        const M = 6;
        const cell = Math.min((rw - 24) / M, (rh - 54) / M);
        for (let r = 0; r < M; r++) {
          for (let col = 0; col < M; col++) {
            const w = 0.5 + 0.5 * Math.cos((r - col) * (1.1 + a * 1.5) + walker.x * 2 - b * col);
            ctx.fillStyle = `rgba(124, 156, 255, ${(0.12 + 0.82 * w).toFixed(2)})`;
            ctx.fillRect(rx + 12 + col * cell, ry + 28 + r * cell, cell - 3, cell - 3);
          }
        }

        const curLoss = lossAt(walker.x, walker.y, curv, reg);
        const gradNorm = Math.hypot(gx, gy);
        api.readout({
          "Objective Loss L(θ)": curLoss.toFixed(4),
          "Gradient Norm ‖∇L‖": gradNorm.toFixed(4),
          "Hessian Condition κ": (curv * 2.4).toFixed(2),
          "Latent Norm ‖z‖₂": Math.hypot(walker.x, walker.y).toFixed(3),
        });
      });

      return {
        pulse() {
          walker.x = (rng() - 0.5) * 1.9;
          walker.y = (rng() - 0.5) * 1.9;
          path.length = 0;
          api.setStatus("Stochastic saddle-point escape jump triggered.");
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 7. Strategic Game, Replicator Simplex, Bargaining & Welfare Frontier Engine
    strategic_game(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let touches = 0;
      let pop = { x: 0.45, y: 0.35, z: 0.20 };
      const history = [];

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          const W = cv.width, H = cv.height;
          if (pt.x < W * 0.6) {
            const u = Math.max(0.05, Math.min(0.9, pt.x / (W * 0.58)));
            const v = Math.max(0.05, Math.min(0.9 - u * 0.5, 1 - pt.y / H));
            const s1 = u, s2 = v, s3 = Math.max(0.02, 1 - s1 - s2);
            const sum = s1 + s2 + s3;
            pop = { x: s1 / sum, y: s2 / sum, z: s3 / sum };
            history.length = 0;
            api.setStatus(`Set strategy mix: (${(pop.x * 100).toFixed(0)}%, ${(pop.y * 100).toFixed(0)}%, ${(pop.z * 100).toFixed(0)}%)`);
            if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
          }
        },
      });

      api.loop((dt) => {
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click simplex triangle to set initial population / policy mix", "dxᵢ/dt = xᵢ [ (Ax)ᵢ − xᵀAx ]");

        // Replicator dynamics update
        const f1 = (1.1 + a * 0.8) * pop.y - (0.6 + b * 0.7) * pop.z;
        const f2 = (0.9 + b * 0.8) * pop.z - (0.7 + a * 0.6) * pop.x;
        const f3 = (0.8 + c * 0.9) * pop.x - (0.7 + c * 0.5) * pop.y;
        const fBar = pop.x * f1 + pop.y * f2 + pop.z * f3;

        pop.x = Math.max(0.02, pop.x + dt * pop.x * (f1 - fBar) * 0.9);
        pop.y = Math.max(0.02, pop.y + dt * pop.y * (f2 - fBar) * 0.9);
        pop.z = Math.max(0.02, pop.z + dt * pop.z * (f3 - fBar) * 0.9);
        const s = pop.x + pop.y + pop.z;
        pop.x /= s; pop.y /= s; pop.z /= s;

        // Simplex vertices
        const vA = { x: W * 0.30, y: 54 };
        const vB = { x: W * 0.08, y: H - 24 };
        const vC = { x: W * 0.52, y: H - 24 };

        const toXY = (p) => ({
          x: p.x * vA.x + p.y * vB.x + p.z * vC.x,
          y: p.x * vA.y + p.y * vB.y + p.z * vC.y,
        });

        const curPt = toXY(pop);
        history.push(curPt);
        if (history.length > 140) history.shift();

        ctx.strokeStyle = COLORS.axis;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(vA.x, vA.y); ctx.lineTo(vB.x, vB.y); ctx.lineTo(vC.x, vC.y); ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Strategy S₁ (Cooperate/Comply)", vA.x - 65, vA.y - 6);
        ctx.fillText("Strategy S₂ (Defect/Contest)", vB.x - 10, vB.y + 15);
        ctx.fillText("Strategy S₃ (Enforce/Hedge)", vC.x - 60, vC.y + 15);

        ctx.strokeStyle = COLORS.accent;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        history.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
        ctx.stroke();

        ctx.fillStyle = COLORS.secondary;
        ctx.beginPath();
        ctx.arc(curPt.x, curPt.y, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Right panel: Pareto Welfare & Nash Payoff Frontier
        const rx = W * 0.62, rw = W - rx - 14, ry = 46, rh = H - 60;
        ctx.fillStyle = "rgba(22,26,46,0.82)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Social Welfare & Equilibrium Shares", rx + 10, ry + 18);

        const shares = [
          { k: "S₁ Share", v: pop.x, col: COLORS.primary },
          { k: "S₂ Share", v: pop.y, col: COLORS.secondary },
          { k: "S₃ Share", v: pop.z, col: COLORS.ok },
        ];
        shares.forEach((sh, i) => {
          const by = ry + 34 + i * 44;
          ctx.fillStyle = COLORS.muted;
          ctx.font = "11px system-ui, sans-serif";
          ctx.fillText(`${sh.k}: ${(sh.v * 100).toFixed(1)}%`, rx + 12, by);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(rx + 12, by + 6, rw - 24, 13);
          ctx.fillStyle = sh.col;
          ctx.fillRect(rx + 12, by + 6, (rw - 24) * sh.v, 13);
        });

        const socialWelfare = (1.4 * pop.x + 0.8 * pop.z - 0.5 * pop.y + 0.5 * (a - b));
        const gini = Math.abs(pop.x - pop.y) * 0.5 + Math.abs(pop.y - pop.z) * 0.5;
        api.readout({
          "Cooperate Share x₁": (pop.x * 100).toFixed(1) + "%",
          "Contest Share x₂": (pop.y * 100).toFixed(1) + "%",
          "Social Welfare W": socialWelfare.toFixed(3),
          "Inequality / Asymmetry": gini.toFixed(3),
        });
      });

      return {
        pulse() {
          pop = { x: 0.15 + rng() * 0.5, y: 0.15 + rng() * 0.4, z: 0.2 };
          const s = pop.x + pop.y + pop.z;
          pop.x /= s; pop.y /= s; pop.z /= s;
          history.length = 0;
          api.setStatus("Injected external institutional/payoff shock.");
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 8. Kinetics, Thermodynamics, Phase Diagrams & Stress-Strain Engine
    kinetics_thermodynamics(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let touches = 0;
      let cursorX = 0.48;

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          cursorX = Math.max(0.05, Math.min(0.95, (pt.x - 42) / Math.max(1, cv.width * 0.56)));
          api.setStatus(`Inspected operating point u = ${(cursorX * 100).toFixed(1)}%`);
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
        move(pt) {
          if (pt.e && pt.e.buttons === 1) {
            cursorX = Math.max(0.05, Math.min(0.95, (pt.x - 42) / Math.max(1, cv.width * 0.56)));
          }
        },
      });

      api.loop(() => {
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click/drag operating point along response curve", "v = Vₘₐₓ [S]ⁿ / (Kₘⁿ + [S]ⁿ),  ΔG = ΔH − TΔS");

        const gx = 46, gy = 48, gw = W * 0.54, gh = H - 78;
        ctx.strokeStyle = COLORS.axis;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh);
        ctx.stroke();

        const vmax = 0.45 + a * 0.52;
        const km = 0.12 + b * 0.55;
        const hill = 0.8 + c * 2.4;

        // Primary Saturation / Response Curve
        ctx.strokeStyle = COLORS.primary;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const u = i / 120;
          const num = Math.pow(u, hill);
          const den = Math.pow(km, hill) + num;
          const yVal = vmax * (num / Math.max(1e-6, den));
          const px = gx + u * gw;
          const py = gy + gh - yVal * gh;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Free energy / Derivative / Secondary Curve
        ctx.strokeStyle = COLORS.secondary;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const u = i / 120;
          const yVal = 0.25 + 0.55 * Math.exp(-Math.pow((u - km) / (0.18 + 0.12 * c), 2)) * vmax;
          const px = gx + u * gw;
          const py = gy + gh - yVal * gh;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Operating Point Marker
        const numC = Math.pow(cursorX, hill);
        const yCur = vmax * (numC / (Math.pow(km, hill) + numC));
        const cx = gx + cursorX * gw, cy = gy + gh - yCur * gh;
        ctx.strokeStyle = COLORS.accent;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, gy + gh); ctx.lineTo(cx, cy); ctx.lineTo(gx, cy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = COLORS.accent;
        ctx.beginPath();
        ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Right panel: Energy Barrier / Lever Rule / Species Partition
        const rx = W * 0.64, rw = W - rx - 14, ry = 48, rh = H - 64;
        ctx.fillStyle = "rgba(22,26,46,0.82)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Thermodynamic & Kinetic Partition", rx + 10, ry + 18);

        const boundFrac = yCur / Math.max(1e-4, vmax);
        const freeFrac = 1 - boundFrac;
        const dG = -8.314 * (0.298 + a * 0.1) * Math.log(Math.max(0.05, boundFrac / Math.max(0.05, freeFrac)));

        const bars = [
          { l: "Converted / Bound Fraction", v: boundFrac, col: COLORS.ok },
          { l: "Unconverted / Free Fraction", v: freeFrac, col: COLORS.primary },
          { l: "Activation Efficiency η", v: Math.min(1, yCur * 1.15), col: COLORS.accent },
        ];
        bars.forEach((br, idx) => {
          const by = ry + 36 + idx * 46;
          ctx.fillStyle = COLORS.muted;
          ctx.font = "11px system-ui, sans-serif";
          ctx.fillText(`${br.l}: ${(br.v * 100).toFixed(1)}%`, rx + 12, by);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(rx + 12, by + 6, rw - 24, 13);
          ctx.fillStyle = br.col;
          ctx.fillRect(rx + 12, by + 6, (rw - 24) * br.v, 13);
        });

        api.readout({
          "Response Rate v": yCur.toFixed(3),
          "Half-Max Constant K₀.₅": km.toFixed(3),
          "Cooperativity / Order n": hill.toFixed(2),
          "ΔG (kJ/mol)": dG.toFixed(2),
        });
      });

      return {
        pulse() { cursorX = Math.min(0.92, cursorX + 0.18); api.setStatus("Stepped operating concentration/load upward."); if (spec.challenges?.[1]) api.award(spec.challenges[1].id); },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 9. Systems Architecture, Pipeline/Cache/Storage & Crypto Bit-Avalanche Engine
    systems_hardware(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let touches = 0;
      let flippedBit = 0;
      let clockCycle = 0;

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          const col = Math.floor((pt.x - 20) / 28);
          const row = Math.floor((pt.y - 54) / 28);
          flippedBit = Math.max(0, Math.min(63, row * 8 + col));
          clockCycle++;
          api.setStatus(`Toggled bit / memory slot #${flippedBit} (Cycle ${clockCycle})`);
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
      });

      api.loop((dt) => {
        clockCycle += dt * 2.5;
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click any bit/slot cell to inject fault or flip bit", "Throughput = IPC × f_clk,  Hamming d_H(E(x), E(x⊕eᵢ)) ≈ n/2");

        // Left: 8x8 Bit / Cache Line / Memory Frame Matrix
        const gx = 22, gy = 52;
        const cellW = Math.min(28, (W * 0.44) / 8), cellH = Math.min(28, (H - 72) / 8);
        let hamming = 0;
        const rounds = Math.max(1, Math.round(1 + a * 10));
        for (let r = 0; r < 8; r++) {
          for (let col = 0; col < 8; col++) {
            const idx = r * 8 + col;
            const h = hashStr(`${spec.id}:${idx}:${flippedBit}:${rounds}:${Math.floor(b * 10)}`);
            const bit = (h & 1) ^ (idx === flippedBit ? 1 : 0);
            if (bit) hamming++;
            ctx.fillStyle = idx === flippedBit ? COLORS.danger : (bit ? COLORS.primary : "rgba(255,255,255,0.08)");
            ctx.fillRect(gx + col * cellW, gy + r * cellH, cellW - 3, cellH - 3);
            ctx.fillStyle = COLORS.text;
            ctx.font = "10px monospace";
            ctx.fillText(String(bit), gx + col * cellW + cellW * 0.3, gy + r * cellH + cellH * 0.65);
          }
        }

        // Right: Pipeline / Latency / Queue Utilisation Waterfall
        const rx = W * 0.50, rw = W - rx - 16, ry = 52, rh = H - 70;
        ctx.fillStyle = "rgba(22,26,46,0.82)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Pipeline Stage / Queue Occupancy", rx + 10, ry + 18);

        const stages = ["IF / Ingress", "ID / Decode", "EX / Compute", "MEM / Cache", "WB / Commit"];
        const stageColors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.ok, "#c084fc"];
        stages.forEach((st, i) => {
          const sy = ry + 32 + i * ((rh - 46) / stages.length);
          ctx.fillStyle = COLORS.muted;
          ctx.font = "10px system-ui, sans-serif";
          ctx.fillText(st, rx + 10, sy + 12);
          const slots = 8;
          const sw = (rw - 105) / slots;
          for (let s = 0; s < slots; s++) {
            const active = ((s + i + Math.floor(clockCycle)) % 3 === 0) || (s < Math.ceil(b * 6));
            const hazard = (s === (flippedBit % slots)) && c > 0.45;
            ctx.fillStyle = hazard ? COLORS.danger : (active ? stageColors[i] : "rgba(255,255,255,0.06)");
            ctx.fillRect(rx + 92 + s * sw, sy, sw - 4, 16);
          }
        });

        const ipc = (1.2 + a * 1.8 - c * 0.7).toFixed(2);
        const hitRate = Math.min(99.8, 72 + b * 26 - c * 14).toFixed(1);
        api.readout({
          "Hamming / Active Slots": `${hamming} / 64 (${(hamming / 0.64).toFixed(1)}%)`,
          "Throughput / IPC": `${ipc} ops/cyc`,
          "Hit / Success Rate": `${hitRate}%`,
          "Active Rounds / Depth": String(rounds),
        });
      });

      return {
        pulse() { flippedBit = (flippedBit + 7) % 64; api.setStatus(`Injected bit-flip / hazard at index #${flippedBit}`); if (spec.challenges?.[1]) api.award(spec.challenges[1].id); },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },

    // 10. Linguistic Formant Vowel Space, Prosody Contour & Cognitive Psychophysics Engine
    linguistic_cognitive(spec, stage, api) {
      const cv = api.createCanvas({ aspect: 16 / 9 });
      const rng = mulberry32(hashStr(spec.id));
      const pDefs = spec.params || [];
      let time = 0, touches = 0;
      let target = { x: 0.35, y: 0.32 };

      api.onParam(() => {
        touches++;
        if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
        if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
      });

      api.pointer(cv.canvas, {
        down(pt) {
          if (pt.x < cv.width * 0.56) {
            target.x = Math.max(0.08, Math.min(0.92, (pt.x - 24) / Math.max(1, cv.width * 0.50)));
            target.y = Math.max(0.08, Math.min(0.92, (pt.y - 48) / Math.max(1, cv.height - 68)));
            api.setStatus(`Selected articulatory/perceptual coordinate (${target.x.toFixed(2)}, ${target.y.toFixed(2)})`);
            if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
          }
        },
        move(pt) {
          if (pt.e && pt.e.buttons === 1 && pt.x < cv.width * 0.56) {
            target.x = Math.max(0.08, Math.min(0.92, (pt.x - 24) / Math.max(1, cv.width * 0.50)));
            target.y = Math.max(0.08, Math.min(0.92, (pt.y - 48) / Math.max(1, cv.height - 68)));
          }
        },
      });

      const anchors = [
        { sym: "/i/", x: 0.15, y: 0.16 },
        { sym: "/e/", x: 0.25, y: 0.45 },
        { sym: "/a/", x: 0.48, y: 0.84 },
        { sym: "/ɑ/", x: 0.82, y: 0.82 },
        { sym: "/o/", x: 0.84, y: 0.46 },
        { sym: "/u/", x: 0.86, y: 0.16 },
        { sym: "/ə/", x: 0.52, y: 0.48 },
      ];

      api.loop((dt) => {
        time += dt;
        const W = cv.width, H = cv.height, ctx = cv.ctx;
        const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
        const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
        const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);

        drawHUD(ctx, W, H, spec, "Click/drag inside vowel/feature trapezoid", "F₁ ∝ Jaw Openness,  F₂ ∝ Tongue Frontness,  P(y|x) ∝ exp(−Σ wₖ fₖ)");

        const gx = 28, gy = 50, gw = W * 0.48, gh = H - 72;
        // Draw trapezoid
        ctx.strokeStyle = COLORS.axis;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(gx + gw * 0.1, gy + gh * 0.1);
        ctx.lineTo(gx + gw * 0.9, gy + gh * 0.1);
        ctx.lineTo(gx + gw * 0.85, gy + gh * 0.9);
        ctx.lineTo(gx + gw * 0.38, gy + gh * 0.9);
        ctx.closePath();
        ctx.stroke();

        anchors.forEach((an) => {
          const ax = gx + (an.x + (a - 0.5) * 0.12) * gw;
          const ay = gy + (an.y + (b - 0.5) * 0.12) * gh;
          ctx.fillStyle = "rgba(124,156,255,0.28)";
          ctx.beginPath();
          ctx.arc(ax, ay, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = COLORS.text;
          ctx.font = "600 11px system-ui, sans-serif";
          ctx.fillText(an.sym, ax - 8, ay + 4);
        });

        const tx = gx + target.x * gw, ty = gy + target.y * gh;
        ctx.fillStyle = COLORS.accent;
        ctx.beginPath();
        ctx.arc(tx, ty, 6.5, 0, Math.PI * 2);
        ctx.fill();

        const f1 = Math.round(250 + target.y * 650 + a * 120);
        const f2 = Math.round(2400 - target.x * 1600 + b * 220);
        const f0 = Math.round(110 + c * 160);

        // Right: Synthesized Acoustic Envelope & Pitch Contour
        const rx = W * 0.56, rw = W - rx - 16, ry = 50, rh = H - 72;
        ctx.fillStyle = "rgba(22,26,46,0.82)";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = COLORS.text;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText("Acoustic Formant Envelope & F₀ Contour", rx + 10, ry + 18);

        ctx.strokeStyle = COLORS.secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const freqHz = i * 32;
          const env = Math.exp(-Math.pow((freqHz - f1) / 180, 2)) + 0.85 * Math.exp(-Math.pow((freqHz - f2) / 260, 2));
          const px = rx + 12 + (i / 100) * (rw - 24);
          const py = ry + rh * 0.56 - env * (rh * 0.34);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Time-domain glottal + formant wave at bottom right
        ctx.strokeStyle = COLORS.ok;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const u = i / 100;
          const yw = Math.sin(u * f1 * 0.04 + time * 4) * 0.6 + Math.sin(u * f2 * 0.02 - time * 6) * 0.4;
          const px = rx + 12 + u * (rw - 24);
          const py = ry + rh * 0.82 + yw * (rh * 0.11);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        api.readout({
          "Formant F₁ (Height)": `${f1} Hz`,
          "Formant F₂ (Backness)": `${f2} Hz`,
          "Fundamental F₀": `${f0} Hz`,
          "F₂ − F₁ Dispersion": `${f2 - f1} Hz`,
        });
      });

      return {
        pulse() {
          const pick = anchors[Math.floor(rng() * anchors.length)];
          target = { x: pick.x, y: pick.y };
          api.setStatus(`Shifted articulatory target to phoneme ${pick.sym}`);
          if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
        },
        randomize() {
          pDefs.forEach((p) => {
            if (!p.type || p.type === "range") {
              const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
              api.setParam(p.key, Number(v.toFixed(2)));
            }
          });
        },
      };
    },
  };

  window.SelfTaughtCustomRenderers = window.SelfTaughtCustomRenderers || {};
  function registerCustomRenderers(map) {
    if (map && typeof map === "object") {
      Object.assign(window.SelfTaughtCustomRenderers, map);
    }
  }

  function mountCustomRenderer(spec, stage, api, customFn) {
    const cv = api.createCanvas({ aspect: 16 / 9 });
    const seed = hashStr(spec.id);
    const rng = mulberry32(seed);
    const pDefs = spec.params || [];
    let time = 0;
    let pulseBoost = 0;
    let touches = 0;
    let dragging = false;
    const probe = { x: 0.52, y: 0.52 };
    const clicks = [];
    const mem = {};

    api.onParam(() => {
      touches++;
      if (spec.challenges?.[0] && touches >= 2) api.award(spec.challenges[0].id);
      if (spec.challenges?.[2] && touches >= 5) api.award(spec.challenges[2].id);
    });

    api.pointer(cv.canvas, {
      down(pt) {
        dragging = true;
        probe.x = Math.max(0.05, Math.min(0.95, pt.x / Math.max(1, cv.width)));
        probe.y = Math.max(0.12, Math.min(0.92, pt.y / Math.max(1, cv.height)));
        clicks.push({ x: probe.x, y: probe.y, t: time });
        if (clicks.length > 16) clicks.shift();
        pulseBoost = Math.min(1.5, pulseBoost + 0.65);
        api.setStatus(`Interactive probe placed at (${(probe.x * 100).toFixed(0)}%, ${(probe.y * 100).toFixed(0)}%)`);
        if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
      },
      move(pt) {
        if (dragging || (pt.e && pt.e.buttons === 1)) {
          probe.x = Math.max(0.05, Math.min(0.95, pt.x / Math.max(1, cv.width)));
          probe.y = Math.max(0.12, Math.min(0.92, pt.y / Math.max(1, cv.height)));
        }
      },
      up() {
        dragging = false;
      },
    });

    api.loop((dt) => {
      time += dt;
      pulseBoost *= Math.exp(-dt * 2.6);
      const W = cv.width, H = cv.height, ctx = cv.ctx;
      const a = normParam(pDefs[0], api.params[pDefs[0]?.key]);
      const b = normParam(pDefs[1], api.params[pDefs[1]?.key]);
      const c = normParam(pDefs[2], api.params[pDefs[2]?.key]);
      const d = normParam(pDefs[3], api.params[pDefs[3]?.key]);
      const v0 = Number(api.params[pDefs[0]?.key] ?? (pDefs[0]?.value ?? pDefs[0]?.default ?? a));
      const v1 = Number(api.params[pDefs[1]?.key] ?? (pDefs[1]?.value ?? pDefs[1]?.default ?? b));
      const v2 = Number(api.params[pDefs[2]?.key] ?? (pDefs[2]?.value ?? pDefs[2]?.default ?? c));
      const v3 = Number(api.params[pDefs[3]?.key] ?? (pDefs[3]?.value ?? pDefs[3]?.default ?? d));

      const st = {
        t: time, dt, a, b, c, d, v0, v1, v2, v3,
        params: api.params, pDefs,
        px: probe.x, py: probe.y, probe, clicks, dragging,
        pulse: pulseBoost, mem, rng, COLORS, spec,
        drawHUD(subtitle, eqOverride) {
          drawHUD(ctx, W, H, spec, subtitle || "Interact directly with canvas & parameters", eqOverride || spec.formula || spec.name);
        },
        panel(x, y, w, h, title) {
          ctx.fillStyle = "rgba(22, 26, 46, 0.82)";
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.11)";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, w, h);
          if (title) {
            ctx.fillStyle = COLORS.text;
            ctx.font = "600 11px system-ui, sans-serif";
            ctx.fillText(title, x + 10, y + 17);
          }
        },
      };

      const ro = customFn(ctx, W, H, st);
      if (ro && typeof ro === "object") {
        api.readout(ro);
      }
    });

    return {
      pulse() {
        pulseBoost = 1.4;
        probe.x = 0.2 + rng() * 0.6;
        probe.y = 0.25 + rng() * 0.55;
        clicks.push({ x: probe.x, y: probe.y, t: time });
        if (clicks.length > 16) clicks.shift();
        api.setStatus(`Impulse perturbation injected into ${spec.name}.`);
        if (spec.challenges?.[1]) api.award(spec.challenges[1].id);
      },
      randomize() {
        pDefs.forEach((p) => {
          if (!p.type || p.type === "range") {
            const v = (p.min ?? 0) + rng() * ((p.max ?? 100) - (p.min ?? 0));
            api.setParam(p.key, Number(v.toFixed(2)));
          }
        });
      },
    };
  }

  function registerBatch(specs) {
    (specs || []).forEach((spec) => {
      const engineFn = ENGINES[spec.engine] || ENGINES.phase_attractor;
      const defaultChallenges = [
        { id: `${spec.id}_tune`, text: `Explore parameter sensitivity in ${spec.name} by adjusting at least two control sliders.`, xp: 15 },
        { id: `${spec.id}_probe`, text: `Interact directly with the ${spec.name} canvas or trigger a Perturb/Pulse action to test regime response.`, xp: 15 },
        { id: `${spec.id}_master`, text: `Drive ${spec.name} across multiple parameter regimes to compare steady-state readouts.`, xp: 15 },
      ];
      register({
        id: spec.id,
        name: spec.name,
        domains: spec.domains || [],
        description: spec.description || "",
        params: spec.params || [],
        challenges: spec.challenges || defaultChallenges,
        actions: spec.actions || [
          { label: "⚡ Pulse / Perturb", fn(h) { if (h && h.pulse) h.pulse(); } },
          { label: "🎲 Randomize", fn(h) { if (h && h.randomize) h.randomize(); } },
        ],
        mount(stage, api) {
          const customFn = (window.SelfTaughtCustomRenderers && window.SelfTaughtCustomRenderers[spec.id]) || spec.render;
          if (typeof customFn === "function") {
            return mountCustomRenderer(spec, stage, api, customFn);
          }
          return engineFn(spec, stage, api);
        },
      });
    });
  }

  window.SelfTaughtSims = { register, registerBatch, registerCustomRenderers, list, has, get, mount, COLORS, ENGINES, el };
})();
