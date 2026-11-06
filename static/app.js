/* Self-Taught — app core: state, API, router, rendering helpers, rewards UI. Views live in views_*.js */
(function () {
  "use strict";

  const App = (window.App = {
    state: { boot: null, summary: null, settings: null, catalog: [], route: null, simsProgress: {} },
    views: {},
  });

  // Views often pass conditional children (`cond ? h(...) : null`) to native append()/prepend(), which would
  // render the literal text "null". Drop null/undefined/false children everywhere, like h() does.
  [Element.prototype, DocumentFragment.prototype].forEach((proto) => {
    ["append", "prepend"].forEach((fn) => {
      const orig = proto[fn];
      if (orig.__stSafe) return;
      const safe = function (...kids) { return orig.apply(this, kids.filter((k) => k != null && k !== false)); };
      safe.__stSafe = true;
      proto[fn] = safe;
    });
  });

  // ------------------------------------------------------------------ utils
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  App.$ = $; App.$$ = $$;

  function h(tag, attrs, ...children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "style") n.style.cssText = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "dataset") Object.assign(n.dataset, v);
      else if (v === true) n.setAttribute(k, "");
      else n.setAttribute(k, v);
    }
    const add = (c) => {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    };
    children.forEach(add);
    return n;
  }
  App.h = h;
  App.esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  App.fmt = {
    num: (n) => Number(n || 0).toLocaleString(),
    pct: (p) => Math.round((p || 0) * 100) + "%",
    date: (ts) => (ts ? new Date(ts * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""),
    time: (ts) => (ts ? new Date(ts * 1000).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""),
    ago: (ts) => { if (!ts) return ""; const s = Date.now() / 1000 - ts; if (s < 60) return "just now"; if (s < 3600) return Math.floor(s / 60) + "m ago"; if (s < 86400) return Math.floor(s / 3600) + "h ago"; return Math.floor(s / 86400) + "d ago"; },
    mins: (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`),
  };
  App.levelTag = (level) => h("span", { class: `tag l${level}` }, `${level} · ${{ 100: "Freshman", 200: "Sophomore", 300: "Junior", 400: "Senior", 500: "Graduate", 600: "Master's" }[level] || level}`);
  App.statusIcon = (st) => (st === "completed" ? "✅" : st === "started" ? "🟡" : "○");

  // ------------------------------------------------------------------ API
  async function api(path, opts) {
    opts = opts || {};
    const init = { method: opts.method || (opts.body ? "POST" : "GET"), headers: {} };
    if (opts.body !== undefined) { init.headers["Content-Type"] = "application/json"; init.body = JSON.stringify(opts.body); }
    const res = await fetch("/api" + path, init);
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (!res.ok) { const msg = (data && data.error) || `${res.status} ${res.statusText}`; throw new Error(msg); }
    if (data && init.method !== "GET" && (data.awards || data.badges || data.summary)) App.rewards(data);
    else if (data && data.summary && typeof data.summary === "object" && data.summary.rank) { App.state.summary = data.summary; App.renderSidebar(); }
    return data;
  }
  App.api = api;

  // ------------------------------------------------------------------ rewards: toasts, badges, level ups
  const toasts = h("div", { class: "toasts" });
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(toasts));
  App.toast = function (text, kind, ms) {
    const t = h("div", { class: "toast " + (kind || "info"), html: text });
    toasts.appendChild(t);
    setTimeout(() => { t.style.transition = "opacity .4s"; t.style.opacity = "0"; setTimeout(() => t.remove(), 400); }, ms || 3200);
  };
  const REASONS = { lesson_open: "Opened a lesson", checkpoint_correct: "Checkpoint correct!", checkpoint_attempt: "Nice try", lecture_complete: "Lecture finished", lesson_complete: "Lesson complete", homework: "Homework graded", homework_perfect: "Perfect homework!", sim_challenge: "Sim challenge", tutor_question: "Asked the professor", feedback: "Thanks for the feedback", lab_run: "Ran code in the lab", course_complete: "COURSE COMPLETE", streak_daily: "Daily streak bonus", quest: "Daily quest complete", design: "Designed a course", domain_bachelor: "BACHELOR'S DEGREE", domain_master: "MASTER'S DEGREE", lab_tests_pass: "All lab tests passed!", srs_review: "Flashcard reviewed", course_test_out: "CREDIT BY EXAMINATION", exam: "Exam graded", viva_voce: "Viva Voce defended", feynman_teach: "Feynman teach-back", fault_fixed: "Fault diagnosed & fixed" };
  let lastRankTitle = null;
  App.toastXP = (xp, reason) => App.toast(`<b>+${xp} XP</b> · ${REASONS[reason] || reason || "Progress"}`, "xp");
  App.showBadgeModal = (b) => App.badgePop(b);
  App.rewards = function (data) {
    if (!data || data._rewarded) return;
    data._rewarded = true;
    (data.awards || []).forEach((a) => App.toast(`<b>+${a.xp} XP</b> · ${REASONS[a.reason] || a.reason}`, "xp"));
    if (data.summary && typeof data.summary === "object" && data.summary.rank) {
      const prev = App.state.summary;
      App.state.summary = data.summary;
      App.renderSidebar();
      const title = data.summary.rank && data.summary.rank.title;
      if (prev && prev.rank && title && title !== prev.rank.title) App.levelUp(data.summary.rank);
      lastRankTitle = title;
    }
    (data.badges || []).forEach((b, i) => setTimeout(() => App.badgePop(b), 400 * i));
  };
  App.confetti = function (opts) {
    if (window.confetti) {
      try { window.confetti(Object.assign({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#7c9cff", "#ff8fab", "#ffd166", "#6ee7b7", "#c084fc"] }, opts || {})); } catch (e) { /* ignore */ }
    }
  };
  App.modal = function (content, opts) {
    opts = opts || {};
    const bg = h("div", { class: "modal-bg", onclick: (e) => { if (e.target === bg && !opts.sticky) close(); } });
    const box = h("div", { class: "modal " + (opts.cls || "") }, content);
    bg.appendChild(box);
    document.body.appendChild(bg);
    function close() { bg.remove(); if (opts.onClose) opts.onClose(); }
    return { close, box };
  };
  App.badgePop = function (b) {
    App.confetti();
    const m = App.modal([
      h("div", { class: "ic" }, b.icon || "🏅"),
      h("div", { class: "levelup" }, "Badge unlocked!"),
      h("h2", { style: "margin:6px 0 2px" }, b.name),
      h("p", { class: "muted" }, b.desc || b.description || ""),
      h("button", { class: "btn mt16", onclick: () => m.close() }, "Awesome"),
    ], { cls: "badge-pop" });
  };
  App.levelUp = function (rank) {
    App.confetti({ particleCount: 260, spread: 120 });
    const m = App.modal([
      h("div", { class: "ic" }, rank.icon),
      h("div", { class: "levelup" }, "Rank up!"),
      h("h2", { style: "margin:6px 0 2px" }, `You are now a ${rank.title}`),
      h("p", { class: "muted" }, rank.next_title ? `Next: ${rank.next_title} at ${App.fmt.num(rank.next_xp)} XP` : "You have reached the summit."),
      h("button", { class: "btn mt16", onclick: () => m.close() }, "Onward"),
    ], { cls: "badge-pop" });
  };

  // ------------------------------------------------------------------ Professor Voice Lecturer (TTS)
  const DEFAULT_PERSONAS = [
    // Female Faculty Lecturers
    { id: "claire_evans", name: "Dr. Claire Evans", gender: "female", Tagline: "Warm Contralto · Senior Fellow in Theoretical Sciences", style_badge: "🎙️ Warm Contralto (F)", default_lang: "en", sample_url: "/api/tts/sample/claire_evans" },
    { id: "elena_vance", name: "Prof. Elena Vance", gender: "female", Tagline: "Clear & Expressive · Distinguished University Lecturer", style_badge: "🎓 Clear & Expressive (F)", default_lang: "en", sample_url: "/api/tts/sample/elena_vance" },
    { id: "linnea_sterling", name: "Dr. Linnea Sterling", gender: "female", Tagline: "Oxford Received Pronunciation · Classical & STEM Fellow", style_badge: "🇬🇧 Oxford RP (F)", default_lang: "en", sample_url: "/api/tts/sample/linnea_sterling" },
    { id: "chiara_bellini", name: "Dr. Chiara Bellini", gender: "female", Tagline: "Rome & Florence · Italian Language & Humanities Chair", style_badge: "🇮🇹 Italiano (F)", default_lang: "it", sample_url: "/api/tts/sample/chiara_bellini" },
    { id: "colette_laurent", name: "Prof. Colette Laurent", gender: "female", Tagline: "Sorbonne & Sciences Po · French Language & Philosophy Chair", style_badge: "🇫🇷 Français (F)", default_lang: "fr", sample_url: "/api/tts/sample/colette_laurent" },
    { id: "meiling_zhou", name: "Prof. Mei-Ling Zhou", gender: "female", Tagline: "Beijing & Tsinghua · Mandarin & Computational Sciences", style_badge: "🇨🇳 普通话 (F)", default_lang: "zh-CN", sample_url: "/api/tts/sample/meiling_zhou" },
    { id: "marlene_richter", name: "Dr. Marlene Richter", gender: "female", Tagline: "Humboldt & ETH · German Language, Physics & Philosophy", style_badge: "🇩🇪 Deutsch (F)", default_lang: "de", sample_url: "/api/tts/sample/marlene_richter" },
    { id: "layla_mansoor", name: "Prof. Layla Al-Mansoor", gender: "female", Tagline: "Cairo & Beirut · Arabic Philology, Rhetoric & Mathematics", style_badge: "🌙 العربية (F)", default_lang: "ar", sample_url: "/api/tts/sample/layla_mansoor" },
    // Male Faculty Lecturers
    { id: "arthur_pendleton", name: "Prof. Arthur Pendleton", gender: "male", Tagline: "Oxford Baritone · Chair of Natural Philosophy & Mathematics", style_badge: "🇬🇧 Oxford Baritone (M)", default_lang: "en", sample_url: "/api/tts/sample/arthur_pendleton" },
    { id: "marcus_hale", name: "Dr. Marcus Hale", gender: "male", Tagline: "MIT & Stanford · Engineering, AI & Applied Physics", style_badge: "🎙️ Deep Baritone (M)", default_lang: "en", sample_url: "/api/tts/sample/marcus_hale" },
    { id: "julian_mercer", name: "Prof. Julian Mercer", gender: "male", Tagline: "Dynamic & Socratic · Seminar Leader in Logic & Systems", style_badge: "⚡ Dynamic Tenor (M)", default_lang: "en", sample_url: "/api/tts/sample/julian_mercer" },
    { id: "lukas_weber", name: "Prof. Lukas Weber", gender: "male", Tagline: "Heidelberg & Munich · German, Mechanics & Formal Logic", style_badge: "🇩🇪 Deutsch (M)", default_lang: "de", sample_url: "/api/tts/sample/lukas_weber" },
    { id: "lorenzo_conti", name: "Dr. Lorenzo Conti", gender: "male", Tagline: "Bologna & Milan · Italian Literature, Physics & Architecture", style_badge: "🇮🇹 Italiano (M)", default_lang: "it", sample_url: "/api/tts/sample/lorenzo_conti" },
    { id: "henri_moreau", name: "Prof. Henri Moreau", gender: "male", Tagline: "École Polytechnique · French Mathematics & Philosophy", style_badge: "🇫🇷 Français (M)", default_lang: "fr", sample_url: "/api/tts/sample/henri_moreau" },
    { id: "jian_chen", name: "Prof. Jian Chen", gender: "male", Tagline: "Peking University · Mandarin Linguistics & Quantitative Science", style_badge: "🇨🇳 普通话 (M)", default_lang: "zh-CN", sample_url: "/api/tts/sample/jian_chen" },
    { id: "tariq_khalil", name: "Dr. Tariq Al-Khalil", gender: "male", Tagline: "Amman & Oxford · Arabic Grammar (Naḥw), Optics & History", style_badge: "🌙 العربية (M)", default_lang: "ar", sample_url: "/api/tts/sample/tariq_khalil" },
  ];
  const blobCache = new Map();
  let curAudio = null;
  let curAbort = null;
  let queueRunId = 0;
  let stateCb = null;

  const TTS = (window.SelfTaughtTTS = App.TTS = {
    playing: false,
    paused: false,
    loading: false,
    activeLabel: "",
    activeIndex: -1,
    totalItems: 0,

    personas() {
      return (App.state.boot && App.state.boot.voices && App.state.boot.voices.length) ? App.state.boot.voices : DEFAULT_PERSONAS;
    },
    currentPersonaId() {
      const raw = (App.state.settings && App.state.settings.voice_persona) || "claire_evans";
      const found = this.personas().find((p) => p.id === raw);
      return found ? found.id : "claire_evans";
    },
    currentPersona() {
      const id = this.currentPersonaId();
      return this.personas().find((p) => p.id === id) || this.personas()[0];
    },
    currentEngine() {
      const raw = (App.state.settings && App.state.settings.voice_engine) || "neural";
      return (raw === "gemini" || raw === "cloud") ? "neural" : raw;
    },
    currentSpeed() {
      return Number((App.state.settings && App.state.settings.voice_speed) || 1.0) || 1.0;
    },
    async saveVoicePrefs(patch) {
      App.state.settings = Object.assign(App.state.settings || {}, patch);
      if (patch.voice_speed && curAudio) {
        try { curAudio.playbackRate = Number(patch.voice_speed) || 1.0; } catch (e) { /* ignore */ }
      }
      try { await api("/settings", { body: patch }); } catch (e) { /* non-fatal */ }
    },
    onState(cb) { stateCb = cb; },
    _notify() { if (stateCb) { try { stateCb(this); } catch (e) { console.error(e); } } },

    stop() {
      queueRunId++;
      if (curAbort) { try { curAbort.abort(); } catch (e) {} curAbort = null; }
      if (curAudio) {
        try { curAudio.pause(); curAudio.src = ""; } catch (e) {}
        curAudio = null;
      }
      if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) {} }
      $$(".tts-reading").forEach((n) => n.classList.remove("tts-reading"));
      this.playing = false; this.paused = false; this.loading = false;
      this.activeLabel = ""; this.activeIndex = -1; this.totalItems = 0;
      this._notify();
    },

    togglePause() {
      if (!this.playing) return;
      if (curAudio) {
        if (this.paused) { curAudio.play().catch(() => {}); this.paused = false; }
        else { curAudio.pause(); this.paused = true; }
      } else if (window.speechSynthesis) {
        if (this.paused) { window.speechSynthesis.resume(); this.paused = false; }
        else { window.speechSynthesis.pause(); this.paused = true; }
      }
      this._notify();
    },

    async audition(personaId) {
      this.stop();
      const p = this.personas().find((x) => x.id === (personaId || this.currentPersonaId())) || this.currentPersona();
      this.playing = true; this.loading = true; this.activeLabel = `Auditioning ${p.name}…`;
      this._notify();
      try {
        const base = p.sample_url || `/api/tts/sample/${p.id}`;
        const url = base.includes("?") ? base : `${base}?v=human2`;
        const a = new Audio(url);
        curAudio = a;
        a.playbackRate = this.currentSpeed();
        a.oncanplay = () => { this.loading = false; this.activeLabel = `${p.name} — "${p.Tagline}"`; this._notify(); };
        a.onended = () => { this.stop(); };
        a.onerror = () => { this.stop(); App.toast("Could not play voice sample", "err"); };
        await a.play();
      } catch (e) {
        this.stop();
      }
    },

    speakPhrase(text, lang) {
      if (!text) return;
      const u = `/api/tts/phrase?lang=${encodeURIComponent(lang || "en")}&text=${encodeURIComponent(text)}`;
      try {
        const a = new Audio(u);
        a.playbackRate = this.currentSpeed();
        a.play().catch(() => {});
      } catch (e) { /* ignore */ }
    },

    humanizeForSpeech(text) {
      if (!text) return "";
      let s = String(text);
      // Fenced code blocks -> conversational transition
      s = s.replace(/```[\s\S]*?```/g, " Take a look at the code example on your screen. ");
      // Markdown images & links
      s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
      s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
      s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a);
      // Markdown table separator rows
      s = s.replace(/^\s*\|?(?:\s*:?-{2,}:?\s*\|)+\s*:?-{2,}:?\s*\|?\s*$/gm, "");
      // Inline code
      s = s.replace(/`([^`\n]+)`/g, (_, code) => " " + code.replace(/_/g, " ") + " ");
      // Strip Markdown bold/italics/strikethrough FIRST so * and _ are never spoken as "asterisk" or "underscore"
      s = s.replace(/\*{1,3}([^*\n]+?)\*{1,3}/g, "$1");
      s = s.replace(/(^|\W)_{1,3}([^_\n]+?)_{1,3}(?=$|\W)/g, "$1$2");
      s = s.replace(/~~([^~\n]+?)~~/g, "$1");
      // Common LaTeX math -> spoken words
      s = s.replace(/\\frac\s*\{1\}\s*\{2\}/g, " one half ")
           .replace(/\\frac\s*\{1\}\s*\{3\}/g, " one third ")
           .replace(/\\frac\s*\{1\}\s*\{4\}/g, " one quarter ")
           .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, " $1 over $2 ")
           .replace(/\\sqrt\s*\{([^{}]+)\}/g, " the square root of $1 ")
           .replace(/\^\{2\}|\^2\b/g, " squared ")
           .replace(/\^\{3\}|\^3\b/g, " cubed ")
           .replace(/\^\{-1\}|\^-1\b/g, " inverse ")
           .replace(/\^\{([^{}]+)\}/g, " to the power of $1 ")
           .replace(/([a-zA-Z])_\{?0\}?\b/g, "$1 naught")
           .replace(/_\{([^{}]+)\}/g, " sub $1 ")
           .replace(/\b([a-zA-Z])_([0-9]+|[a-zA-Z])\b/g, "$1 sub $2")
           .replace(/([a-zA-Z0-9])_([a-zA-Z0-9])/g, "$1 $2");
      // Abbreviations
      s = s.replace(/\be\.g\.,?\s*/gi, "for example, ")
           .replace(/\bi\.e\.,?\s*/gi, "that is, ")
           .replace(/\bw\.r\.t\.?\s*/gi, "with respect to ")
           .replace(/\bvs\.(?=\s|$)|\bvs\b/gi, "versus")
           .replace(/\betc\.(?!\.)/gi, "and so on.");
      // Word/word slashes
      s = s.replace(/\b([a-zA-Z]{2,})\/([a-zA-Z]{2,})\b/g, "$1 or $2");
      // Multiplication between numbers/variables before stripping remaining *
      s = s.replace(/(\d|\b[a-zA-Z])\s*\*\s*(\d|\b[a-zA-Z])/g, "$1 times $2");
      // Strip remaining raw symbols that could ever be read aloud as symbol names
      s = s.replace(/[*_`~#^\\|<>[\]{}$]/g, " ");
      s = s.replace(/\s+([,.;:?!])/g, "$1").replace(/\s+/g, " ").trim();
      return s;
    },

    async _fetchAudioBlobUrl(text, personaId, engine, lang, signal) {
      const cleaned = this.humanizeForSpeech(text);
      const key = `${engine}:${personaId}:${lang || ""}:${cleaned}`;
      if (blobCache.has(key)) return blobCache.get(key);
      const res = await fetch("/api/tts/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleaned, persona: personaId, engine, lang }),
        signal,
      });
      if (!res.ok) {
        let msg = res.statusText;
        try { msg = (await res.json()).error || msg; } catch (e) {}
        throw new Error(msg);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      blobCache.set(key, url);
      return url;
    },

    async _playOne(text, opts) {
      opts = opts || {};
      const personaId = opts.persona || this.currentPersonaId();
      const engine = opts.engine || this.currentEngine();
      const lang = opts.lang || null;
      const cleaned = this.humanizeForSpeech(text);
      if (!cleaned) return;
      if (engine === "browser" && window.speechSynthesis) {
        return new Promise((resolve) => {
          this.loading = false; this._notify();
          const u = new SpeechSynthesisUtterance(cleaned);
          u.rate = this.currentSpeed();
          const voices = window.speechSynthesis.getVoices() || [];
          const fem = voices.find((v) => /female|samantha|victoria|google uk english female|zoe|aria|jenny/i.test(v.name));
          if (fem) u.voice = fem;
          u.onend = () => resolve();
          u.onerror = () => resolve();
          window.speechSynthesis.speak(u);
        });
      }
      const ac = new AbortController();
      curAbort = ac;
      const url = await this._fetchAudioBlobUrl(cleaned, personaId, engine, lang, ac.signal);
      if (ac.signal.aborted) return;
      return new Promise((resolve, reject) => {
        const a = new Audio(url);
        curAudio = a;
        a.playbackRate = this.currentSpeed();
        this.loading = false;
        this._notify();
        a.onended = () => resolve();
        a.onerror = (e) => reject(e);
        a.play().catch(reject);
      });
    },

    async speakText(text, opts) {
      if (!text) return;
      opts = opts || {};
      return this.readQueue([
        {
          id: opts.id || "single",
          label: opts.label || "Speaking…",
          text,
          persona: opts.persona,
          lang: opts.lang,
          el: opts.el,
        },
      ], opts);
    },

    async readQueue(items, opts) {
      this.stop();
      if (!items || !items.length) return;
      const myRun = ++queueRunId;
      this.playing = true; this.paused = false; this.totalItems = items.length;
      const defaultPersonaId = (opts && opts.persona) || this.currentPersonaId();
      const engine = (opts && opts.engine) || this.currentEngine();
      const defaultLang = (opts && opts.lang) || null;

      for (let i = 0; i < items.length; i++) {
        if (queueRunId !== myRun) return;
        const it = items[i];
        const itemPersona = it.persona || defaultPersonaId;
        const itemLang = it.lang || defaultLang;
        this.activeIndex = i;
        this.activeLabel = it.label || `Part ${i + 1} of ${items.length}`;
        this.loading = true;
        this._notify();
        $$(".tts-reading").forEach((n) => n.classList.remove("tts-reading"));
        if (it.el) {
          it.el.classList.add("tts-reading");
          try { it.el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
        }
        // Prefetch the next section in the background while this one loads/plays
        if (i + 1 < items.length && engine !== "browser") {
          const nxt = items[i + 1];
          this._fetchAudioBlobUrl(nxt.text, nxt.persona || defaultPersonaId, engine, nxt.lang || defaultLang).catch(() => {});
        }
        try {
          await this._playOne(it.text, { persona: itemPersona, engine, lang: itemLang });
        } catch (e) {
          if (queueRunId !== myRun) return;
          console.warn("[TTS] playback error:", e);
        }
      }
      if (queueRunId === myRun) this.stop();
    },
  });

  // ------------------------------------------------------------------ markdown + math
  function protectMath(md) {
    const store = [];
    const keep = (s) => { store.push(s); return `\u0000MATH${store.length - 1}\u0000`; };
    md = md.replace(/```[\s\S]*?```/g, (m) => keep(m));           // keep code blocks intact too
    md = md.replace(/\$\$[\s\S]+?\$\$/g, (m) => keep(m));
    md = md.replace(/\\\[[\s\S]+?\\\]/g, (m) => keep(m));
    md = md.replace(/\\\([\s\S]+?\\\)/g, (m) => keep(m));
    md = md.replace(/(^|[^\\$])\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)/g, (m, pre, body) => pre + keep("$" + body + "$"));
    return { md, store };
  }
  function restoreMath(html, store) {
    return html.replace(/\u0000MATH(\d+)\u0000/g, (m, i) => {
      const s = store[Number(i)];
      if (s.startsWith("```")) return s; // shouldn't happen (marked handles) but be safe
      return s;
    });
  }
  App.md = function (md) {
    if (md == null) return "";
    md = String(md);
    if (!window.marked) return "<p>" + App.esc(md).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>") + "</p>";
    const { md: safe, store } = protectMath(md);
    // code blocks were stored; put them back before marked so it can highlight them as code
    const withCode = safe.replace(/\u0000MATH(\d+)\u0000/g, (m, i) => (store[Number(i)].startsWith("```") ? store[Number(i)] : m));
    let html;
    try { html = window.marked.parse(withCode, { breaks: false, gfm: true }); } catch (e) { html = "<p>" + App.esc(md) + "</p>"; }
    html = restoreMath(html, store);
    html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    return html;
  };
  App.renderInto = function (el, md) {
    el._rawMd = md;
    el.innerHTML = App.md(md);
    App.typeset(el);
    App.enhanceCode(el);
    return el;
  };
  App.typeset = function (el) {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(el, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }, { left: "$", right: "$", display: false }],
          throwOnError: false, ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        });
      } catch (e) { /* ignore */ }
    }
  };
  App.enhanceCode = function (el) {
    $$("pre > code", el).forEach((code) => {
      const pre = code.parentElement;
      const lang = (code.className.match(/language-(\w+)/) || [])[1] || "";
      if (lang === "python" || lang === "py") {
        const btn = h("button", { class: "btn sm secondary runbtn", onclick: () => App.emit("lab:load", code.textContent) }, "▶ Open in Lab");
        pre.appendChild(btn);
      }
    });
  };
  // Soft prerequisite lock banner (course + lesson views)
  App.lockBanner = function (course, lock) {
    return h("div", { class: "card col", style: "gap:8px;border:2px solid #fbbf24;background:rgba(251,191,36,.07);margin-bottom:14px" },
      h("b", null, "🔒 Prerequisites not finished yet"),
      h("div", { class: "small" }, "This course builds on material you haven't completed. Finish these first, test out of them, or unlock anyway:"),
      h("div", { class: "row wrap", style: "gap:6px" }, (lock.missing || []).map((p) =>
        h("span", { class: "row", style: "gap:4px" }, h("a", { class: "pill warn", href: `#/course/${p.id}` }, `○ ${p.code} · ${p.title}`),
          h("a", { class: "btn sm ghost", href: `#/exams?course=${encodeURIComponent(p.id)}&testout=1` }, "🎓 Test out")))),
      h("div", { class: "row wrap", style: "gap:8px" },
        h("button", { class: "btn sm secondary", onclick: async () => { await api(`/course/${encodeURIComponent(course.id)}/unlock`, { body: {} }); App.toast(`Unlocked ${course.code}`, "info"); window.dispatchEvent(new HashChangeEvent("hashchange")); } }, "🔓 Unlock anyway"),
        h("a", { class: "btn sm ghost", href: "#/settings" }, "⚙️ Turn off prerequisite locks")));
  };
  App.prose = function (md, cls) { return App.renderInto(h("div", { class: "prose " + (cls || "") }), md); };

  // ------------------------------------------------------------------ tiny event bus
  const bus = {};
  App.on = (ev, fn) => { (bus[ev] = bus[ev] || []).push(fn); };
  App.off = (ev, fn) => { bus[ev] = (bus[ev] || []).filter((f) => f !== fn); };
  App.emit = (ev, data) => { (bus[ev] || []).forEach((f) => { try { f(data); } catch (e) { console.error(e); } }); };

  // ------------------------------------------------------------------ shell rendering
  const NAV = [
["/", "🏠", "Dashboard"], ["/review", "🗂️", "Flashcard Review"], ["/aid", "🧭", "Super Aid & Planner"], ["/degrees", "🎓", "Degree Paths"], ["/catalog", "📚", "Catalog"], ["/arcade", "🕹️", "Arcade"],
    ["/graph", "🕸️", "Knowledge Graph"], ["/exams", "⏱️", "Exam Hall"],
    ["/notebook", "📓", "Zettelkasten"], ["/autopsy", "📉", "Mistake Autopsy"],
    ["/capstones", "🧬", "Capstones"], ["/ingest", "📄", "Ingest Paper"],
    ["/nexus", "🔗", "Run Nexus Bridge"], ["/transcript", "📜", "Transcript"],
    ["/badges", "🏅", "Badges"], ["/design", "🏗️", "Design a Course"],
    ["/feedback", "🗳️", "Feedback"], ["/settings", "⚙️", "Settings"],
  ];
  App.renderSidebar = function () {
    const s = App.state.summary;
    const side = $("#sidebar");
    if (!side) return;
    const rank = s ? s.rank : { title: "Freshman", icon: "🎒", progress: 0, next_title: "Sophomore", next_xp: 1500, min_xp: 0, level: 1 };
    const cur = (App.state.route && App.state.route.path) || "/";
    side.innerHTML = "";
    side.append(
      h("a", { class: "brand", href: "#/" }, h("div", { class: "logo" }, "🦉"), h("div", null, h("h1", null, "Self-Taught"), h("small", null, "Your personal university"))),
      h("div", { class: "rankcard" },
        h("div", { class: "top" }, h("div", { class: "icon" }, rank.icon), h("div", null, h("div", { class: "title" }, `${s ? s.name : "Scholar"} · Lv ${rank.level}`), h("div", { class: "sub" }, rank.title))),
        h("div", { class: "xpbar" }, h("i", { style: `width:${Math.round(rank.progress * 100)}%` })),
        h("div", { class: "nums" }, h("span", null, `${App.fmt.num(s ? s.total_xp : 0)} XP`), h("span", null, rank.next_title ? `${App.fmt.num(rank.next_xp)} → ${rank.next_title}` : "MAX")),
        h("div", { class: "row mt8", style: "gap:6px;flex-wrap:wrap" },
          h("span", { class: "pill warn" }, `🔥 ${s ? s.streak.current : 0} day${s && s.streak.current === 1 ? "" : "s"}`),
          h("span", { class: "pill primary" }, `⚡ ${s ? s.xp_today : 0}/${s ? s.daily_goal_xp : 150} today`)),
      ),
      h("nav", { class: "nav" }, NAV.map(([p, ic, label]) => h("a", { href: "#" + p, class: (p === "/" ? cur === "/" : cur.startsWith(p)) ? "active" : "" }, h("span", { class: "ic" }, ic), label))),
      h("div", { class: "foot" }, App.state.boot ? `${App.fmt.num(App.state.boot.curriculum_stats.lessons)} lessons · ${App.state.boot.curriculum_stats.courses} courses · ${App.state.boot.curriculum_stats.domains} domains` : ""),
    );
  };
  App.setCrumbs = function (parts) {
    const c = $("#crumbs");
    if (!c) return;
    c.innerHTML = "";
    parts.forEach((p, i) => {
      if (i) c.append(h("span", { class: "dim" }, "  ›  "));
      c.append(p.href ? h("a", { href: p.href }, p.label) : h("b", null, p.label));
    });
  };

  // ------------------------------------------------------------------ search
  function setupSearch() {
    const input = $("#search");
    const results = $("#search-results");
    let timer = null;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      const q = input.value.trim();
      if (q.length < 2) { results.classList.remove("show"); return; }
      timer = setTimeout(async () => {
        try {
          const [items, ft] = await Promise.all([
            api("/search?q=" + encodeURIComponent(q)),
            api("/search/fulltext?q=" + encodeURIComponent(q)).catch(() => ({ results: [] })),
          ]);
          if (input.value.trim() !== q) return;  // a newer query is in flight
          results.innerHTML = "";
          if (!items.length && !(ft.results || []).length) results.append(h("a", { href: "#" }, h("small", null, "No matches")));
          items.forEach((it) => {
            const href = it.id ? `#/lesson/${it.id}` : `#/course/${it.course.id}`;
            results.append(h("a", { href, onclick: () => { results.classList.remove("show"); input.value = ""; } },
              it.id ? it.title : `📘 ${it.course.code} · ${it.course.title}`,
              h("small", null, it.id ? `${it.domain && it.domain.name ? it.domain.name + " › " : ""}${it.course.code} ${it.course.title} › ${it.module}` : `Course · level ${it.course.level}`)));
          });
          const fts = ft.results || [];
          if (fts.length) {
            results.append(h("div", { class: "search-sep" }, "📚 Inside your lectures & notes"));
            const safeSnippet = (sn) => App.esc(sn || "").replace(/&lt;mark&gt;/g, "<mark>").replace(/&lt;\/mark&gt;/g, "</mark>");
            fts.forEach((r) => {
              const href = r.kind === "note" ? `#/notebook?note=${r.ref}` : `#/lesson/${r.ref}`;
              results.append(h("a", { href, onclick: () => { results.classList.remove("show"); input.value = ""; } },
                `${r.kind === "note" ? "📓" : "📖"} ${r.title}`,
                h("small", { html: safeSnippet(r.snippet) })));
            });
          }
          results.classList.add("show");
        } catch (e) { /* ignore */ }
      }, 220);
    });
    document.addEventListener("click", (e) => { if (!results.contains(e.target) && e.target !== input) results.classList.remove("show"); });
    document.addEventListener("keydown", (e) => { if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") { e.preventDefault(); input.focus(); } });
  }

  // ------------------------------------------------------------------ router
  function parseHash() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const query = {};
    (qs || "").split("&").filter(Boolean).forEach((kv) => { const [k, v] = kv.split("="); query[decodeURIComponent(k)] = decodeURIComponent(v || ""); });
    return { path, query };
  }
  let currentView = null;
  async function route() {
    const r = parseHash();
    App.state.route = r;
    const content = $("#content");
    if (currentView && currentView.destroy) { try { currentView.destroy(); } catch (e) { /* ignore */ } }
    currentView = null;
    content.innerHTML = "";
    content.className = "content";
    // Views pass conditional children (`cond ? h(...) : null`) straight to root.append; native append()
    // would stringify null into a visible "null". Mirror h()'s behaviour and drop null/false children.
    content.append = (...kids) => Element.prototype.append.apply(content, kids.flat(Infinity).filter((k) => k != null && k !== false));
    App.renderSidebar();
    window.scrollTo(0, 0);
    const seg = r.path.split("/").filter(Boolean);
    const name = seg[0] || "dashboard";
    const view = App.views[name] || App.views.notfound;
    try {
      currentView = (await view(content, seg.slice(1), r.query)) || null;
    } catch (e) {
      console.error(e);
      content.append(h("div", { class: "empty" }, "Something went wrong: " + e.message));
    }
  }
  App.navigate = (hash) => { location.hash = hash; };
  window.addEventListener("hashchange", route);

  // ------------------------------------------------------------------ boot
  async function boot() {
    setupSearch();
    try {
      // tell the server which simulations exist (for prompting)
      if (window.SelfTaughtSims) api("/sims/registry", { body: { sims: window.SelfTaughtSims.list() } }).catch(() => {});
      const b = await api("/bootstrap");
      App.state.boot = b; App.state.summary = b.summary; App.state.settings = b.settings; App.state.catalog = b.catalog;
      try { App.state.simsProgress = await api("/sims/progress"); } catch (e) { App.state.simsProgress = {}; }
    } catch (e) {
      $("#content").append(h("div", { class: "empty" }, "Could not reach the Self-Taught server: " + e.message));
      return;
    }
    App.renderSidebar();
    await route();
    if (App.state.settings && !App.state.settings.onboarded && App.views.onboarding) App.views.onboarding();
  }
  document.addEventListener("DOMContentLoaded", boot);
})();
