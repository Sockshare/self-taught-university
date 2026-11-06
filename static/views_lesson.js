/* Self-Taught — lesson view: generation wait, lecture + checkpoints, interactive sim, Python lab (Pyodide), homework, professor chat, feedback */
(function () {
  "use strict";
  const { h, api, fmt, esc } = App;
  const V = App.views;

  const WAIT_MSGS = [
    "Professor Sage is sharpening the chalk…", "Consulting three textbooks and one very old notebook…", "Designing checkpoint questions that actually test understanding…",
    "Writing worked examples step by step…", "Hunting down the misconceptions students always have…", "Wiring up the interactive simulation…",
    "Composing homework from core → stretch → challenge…", "Checking every equation twice…", "Adding a fun fact nobody asked for but everyone enjoys…",
    "Deep lessons take 30–90 seconds. Worth it.", "Calibrating difficulty to your level…", "Cross-referencing with the next lesson…",
  ];

  // ------------------------------------------------------------------ Pyodide lab runtime (WebWorker)
  // Python runs in static/pyworker.js, off the UI thread. A runaway loop can always be stopped with
  // Terminate (or the automatic time limit): the worker is killed and a fresh one is started.
  const Py = {
    worker: null, seq: 0, pending: null, ready: false,
    TIME_LIMIT_MS: 120000,
    _spawn() {
      this.worker = new Worker("/static/pyworker.js?v=20261007_1");
      this.ready = false;
      this.worker.onmessage = (ev) => {
        const m = ev.data || {};
        if (m.type === "ready") { this.ready = true; return; }
        const p = this.pending;
        if (!p || m.id !== p.id) return;
        const out = p.out;
        if (m.type === "status") out.status(m.text);
        else if (m.type === "stdout") out.text(m.text);
        else if (m.type === "stderr") out.text(m.text, true);
        else if (m.type === "image") out.image(m.b64);
        else if (m.type === "done") {
          this.ready = true;
          clearTimeout(p.timer);
          this.pending = null;
          out.status(m.ok ? `Done in ${(m.seconds || 0).toFixed(2)}s` : "Error");
          p.resolve({ ok: !!m.ok, error: m.error || null, tests: m.tests || null });
        }
      };
      this.worker.onerror = (e) => {
        const p = this.pending;
        if (p) { clearTimeout(p.timer); this.pending = null; p.out.text("Python worker crashed: " + (e.message || e), true); p.out.status("Error"); p.resolve({ ok: false, error: "worker crashed" }); }
      };
    },
    get busy() { return !!this.pending; },
    warm() { if (!this.worker) this._spawn(); try { this.worker.postMessage({ id: 0, type: "warmup" }); } catch (e) { /* ignore */ } },
    terminate(reason) {
      if (this.worker) { try { this.worker.terminate(); } catch (e) { /* ignore */ } }
      this.worker = null;
      const p = this.pending;
      this.pending = null;
      if (p) {
        clearTimeout(p.timer);
        p.out.text(`\n⏹ ${reason || "Execution terminated."}\n`, true);
        p.out.status("Terminated");
        p.resolve({ ok: false, error: reason || "terminated", terminated: true });
      }
    },
    run(code, out, opts) {
      opts = opts || {};
      if (this.pending) this.terminate("Previous run was stopped to start a new one.");
      if (!this.worker) this._spawn();
      const id = ++this.seq;
      if (!this.ready) out.status("Loading Python runtime (Pyodide, one-time)…");
      return new Promise((resolve) => {
        const timer = setTimeout(() => this.terminate(`Time limit (${Math.round((opts.timeLimit || this.TIME_LIMIT_MS) / 1000)}s) reached — possible infinite loop. The Python runtime was restarted.`), opts.timeLimit || this.TIME_LIMIT_MS);
        this.pending = { id, out, resolve, timer };
        this.worker.postMessage({ id, type: "run", code, tests: opts.tests || "" });
      });
    },
  };
  App.Py = Py;

  function testReport(tests) {
    const passed = tests.filter((t) => t.ok).length;
    const box = h("div", { class: "result " + (passed === tests.length ? "ok" : passed ? "part" : "bad"), style: "margin-top:10px" },
      h("b", null, passed === tests.length ? `✅ All ${tests.length} tests passed` : `🧪 ${passed}/${tests.length} tests passed`),
      h("ul", { class: "small", style: "margin:6px 0 0;padding-left:18px" }, tests.map((t) => h("li", null, t.ok ? "✓ " : "✗ ", h("code", null, t.label), t.ok ? null : h("div", { class: "err tiny" }, t.msg)))));
    return { box, passed, total: tests.length };
  }

  // Debounced draft autosave: localStorage immediately, server shortly after (survives reloads & devices).
  function draftSaver(lessonId, slot) {
    let timer = null;
    const key = `st_draft:${lessonId}:${slot}`;
    return {
      key,
      local() { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; } },
      save(code, statusEl) {
        try { localStorage.setItem(key, JSON.stringify({ code, ts: Date.now() / 1000 })); } catch (e) { /* quota */ }
        clearTimeout(timer);
        if (statusEl) statusEl.textContent = "Saving…";
        timer = setTimeout(() => {
          api(`/lesson/${lessonId}/lab_draft`, { body: { slot, code } })
            .then(() => { if (statusEl) statusEl.textContent = "Draft saved ✓"; })
            .catch(() => { if (statusEl) statusEl.textContent = "Saved locally (server unreachable)"; });
        }, 1200);
      },
      clear() { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } api(`/lesson/${lessonId}/lab_draft?slot=${encodeURIComponent(slot)}`, { method: "DELETE" }).catch(() => {}); },
    };
  }
  function pickDraft(serverDraft, localDraft) {
    if (serverDraft && localDraft) return (localDraft.ts || 0) > (serverDraft.updated_at || 0) ? localDraft.code : serverDraft.code;
    return (serverDraft && serverDraft.code) || (localDraft && localDraft.code) || null;
  }

  function codeEditor(initial) {
    const ta = h("textarea", { spellcheck: "false" }, initial || "");
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { e.preventDefault(); const s = ta.selectionStart, en = ta.selectionEnd; ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en); ta.selectionStart = ta.selectionEnd = s + 4; }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); ta.dispatchEvent(new CustomEvent("run")); }
    });
    return ta;
  }
  function outputPanel() {
    const el = h("div", { class: "output" });
    const status = h("div", { class: "tiny muted mt8" });
    const api_ = {
      el, status: (t) => { status.textContent = t; }, clear: () => { el.innerHTML = ""; },
      text: (t, err) => { el.append(h("span", { class: err ? "err" : "" }, t)); el.scrollTop = el.scrollHeight; },
      image: (b64) => { el.append(h("img", { src: "data:image/png;base64," + b64 })); },
      statusEl: status,
    };
    return api_;
  }
  function labPanel(lab, lessonId, opts) {
    opts = opts || {};
    const slot = opts.slot || "lab";
    const saver = lessonId && !opts.scratch ? draftSaver(lessonId, slot) : null;
    const draft = saver ? pickDraft((opts.drafts || {})[slot], saver.local()) : null;
    const starter = lab.starter_code || "# Write Python here\nprint('hello')\n";
    const ta = codeEditor(draft || starter);
    const out = outputPanel();
    const saveState = h("span", { class: "tiny dim" }, draft ? "Restored your saved draft ✓" : "");
    if (saver) ta.addEventListener("input", () => saver.save(ta.value, saveState));
    const testsHost = h("div");
    let tests = lab.tests || null;
    const run = async () => {
      runBtn.disabled = true; stopBtn.style.display = ""; out.clear(); out.status("Starting…");
      const r = await Py.run(ta.value, out);
      if (lessonId && !opts.scratch) api(`/lesson/${lessonId}/lab_run`, { body: { code: ta.value, ok: r.ok } }).catch(() => {});
      runBtn.disabled = false; stopBtn.style.display = "none";
    };
    const check = async () => {
      checkBtn.disabled = true; checkBtn.textContent = "Fetching tests…";
      try {
        if (!tests) {
          const t = await api(`/lesson/${lessonId}/lab_tests`, { body: {} });
          if (!t.tests) { App.toast(t.error || "No tests available for this lab yet.", "info", 5000); return; }
          tests = t.tests; lab.tests = t.tests;
        }
        checkBtn.textContent = "Testing…"; stopBtn.style.display = ""; out.clear(); testsHost.innerHTML = "";
        const r = await Py.run(ta.value, out, { tests });
        if (r.tests && r.tests.length) {
          const rep = testReport(r.tests);
          testsHost.append(rep.box);
          const res = await api(`/lesson/${lessonId}/lab_result`, { body: { passed: rep.passed, total: rep.total } });
          if (res.all_pass) App.confetti({ particleCount: 120 });
        } else if (!r.terminated) testsHost.append(h("div", { class: "result bad mt8" }, "Tests could not run: " + (r.error || "unknown error")));
      } catch (e) { App.toast(e.message, "err"); }
      finally { checkBtn.disabled = false; checkBtn.textContent = "✅ Check my work"; stopBtn.style.display = "none"; }
    };
    ta.addEventListener("run", run);
    const runBtn = h("button", { class: "btn ok", onclick: run }, "▶ Run  (Ctrl+Enter)");
    const stopBtn = h("button", { class: "btn sm danger", style: "display:none", title: "Kill the Python worker (use for infinite loops)", onclick: () => Py.terminate("Terminated by you.") }, "⏹ Terminate");
    const checkBtn = h("button", { class: "btn sm violet", title: "Run hidden unit tests against your code", onclick: check }, "✅ Check my work");
    const left = h("div", null, h("div", { class: "row between mb8" }, h("div", { class: "row", style: "gap:8px" }, h("b", null, "Editor"), saveState), h("div", { class: "row" },
      lab.solution_code ? h("button", { class: "btn sm ghost", onclick: () => { if (confirm("Replace your code with the reference solution? (Your draft will be overwritten.)")) { ta.value = lab.solution_code; if (saver) saver.save(ta.value, saveState); } } }, "Show solution") : null,
      h("button", { class: "btn sm ghost", onclick: () => { if (confirm("Reset to the starter code? Your saved draft will be discarded.")) { ta.value = lab.starter_code || ""; if (saver) saver.clear(); saveState.textContent = "Reset to starter"; } } }, "Reset"),
      lessonId && !opts.scratch ? checkBtn : null, stopBtn, runBtn)),
      h("div", { class: "editor" }, ta));
    const right = h("div", null, h("div", { class: "row between mb8" }, h("b", null, "Output"), out.statusEl), out.el, testsHost);
    const wrap = h("div", { class: "lab" }, left, right);
    wrap.setCode = (code) => { ta.value = code; ta.focus(); if (saver) saver.save(code, saveState); };
    Py.warm();
    return wrap;
  }
  App.labPanel = labPanel;

  // ------------------------------------------------------------------ question widgets
  function questionInput(q, prevAnswer, ctxOpts) {
    let value = prevAnswer != null ? prevAnswer : (q.type === "mcq" ? null : "");
    let execResult = null;
    let el;
    if (q.type === "mcq") {
      el = h("div", { class: "choices" }, q.choices.map((c, i) => {
        const row = h("label", { class: "choice" + (value === i ? " sel" : "") }, h("input", { type: "radio", name: "q_" + q.id + Math.random().toString(36).slice(2, 6), checked: value === i, onchange: () => { value = i; App.$$(".choice", el).forEach((x, j) => x.classList.toggle("sel", j === i)); } }), App.prose(c, "inline"));
        return row;
      }));
    } else if (q.type === "numeric") {
      const inp = h("input", { class: "input", type: "text", placeholder: "Enter a number", value: value || "", style: "max-width:240px", oninput: (e) => { value = e.target.value; } });
      el = h("div", { class: "row" }, inp, q.unit ? h("span", { class: "muted" }, q.unit) : null);
    } else if (q.type === "code") {
      const saver = ctxOpts && ctxOpts.lessonId ? draftSaver(ctxOpts.lessonId, "hw_" + q.id) : null;
      const draft = saver ? pickDraft((ctxOpts.drafts || {})["hw_" + q.id], saver.local()) : null;
      if (draft && !value) value = draft;
      const ta = codeEditor(value || q.starter_code || "# your code\n"); ta.style.minHeight = "160px";
      if (!value) value = ta.value;
      const saveState = h("span", { class: "tiny dim" }, draft ? "draft restored ✓" : "");
      ta.addEventListener("input", () => { value = ta.value; execResult = null; if (saver) saver.save(ta.value, saveState); });
      const out = outputPanel(); out.el.style.minHeight = "60px";
      const testsHost = h("div");
      const runIt = async (withTests) => {
        out.clear(); testsHost.innerHTML = "";
        const r = await Py.run(ta.value, out, { tests: withTests ? q.tests : "" });
        if (withTests && r.tests && r.tests.length) {
          const rep = testReport(r.tests);
          testsHost.append(rep.box);
          execResult = { passed: rep.passed, total: rep.total, ok: r.ok, error: r.error, failures: r.tests.filter((t) => !t.ok).map((t) => `${t.label}: ${t.msg}`).slice(0, 6) };
        }
        return r;
      };
      el = h("div", null, h("div", { class: "editor" }, ta), h("div", { class: "row mt8", style: "gap:6px" },
        h("button", { class: "btn sm secondary", onclick: () => runIt(false) }, "▶ Test run"),
        q.tests ? h("button", { class: "btn sm violet", onclick: () => runIt(true) }, "🧪 Run unit tests") : null,
        h("button", { class: "btn sm danger", onclick: () => Py.terminate("Terminated by you.") }, "⏹"),
        out.statusEl, saveState), out.el, testsHost);
      return { el, get: () => value, exec: () => execResult, runTests: q.tests ? () => runIt(true) : null };
    } else {
      el = h("textarea", { class: "input", placeholder: q.type === "proof" ? "Write your proof. LaTeX is welcome ($…$)." : "Your answer…", oninput: (e) => { value = e.target.value; } }, value || "");
    }
    return { el, get: () => value };
  }
  function resultBox(res) {
    const cls = res.score >= 0.999 || res.correct ? "ok" : res.score > 0 ? "part" : "bad";
    const head = res.correct ? "✅ Correct" : res.score > 0 ? `🟡 Partial credit (${Math.round(res.score * 100)}%)` : "❌ Not quite";
    const box = h("div", { class: "result " + cls }, h("b", null, head));
    if (res.feedback) box.append(App.prose(res.feedback, "mt8"));
    if (res.model_answer_summary && !res.correct) box.append(h("details", { class: "mt8" }, h("summary", { class: "small muted", style: "cursor:pointer" }, "Show model answer"), App.prose(res.model_answer_summary, "mt8")));
    return box;
  }

  // ------------------------------------------------------------------ lesson view
  V.lesson = async function (root, seg, query) {
    const lessonId = seg.join("/");
    let data = await api("/lesson/" + lessonId);
    if (!data || !data.context) { root.append(h("div", { class: "empty" }, "Unknown lesson.")); return; }
    const ctx = data.context;
    App.setCrumbs([{ label: ctx.domain.name, href: `#/domain/${ctx.domain.id}` }, { label: ctx.course.code, href: `#/course/${ctx.course.id}` }, { label: ctx.lesson.title }]);
    if (data.lock && data.lock.locked) {
      root.append(App.lockBanner(ctx.course, data.lock), h("a", { class: "btn secondary", href: `#/course/${ctx.course.id}` }, "← Back to course"));
      return;
    }
    api(`/lesson/${lessonId}/open`, { body: {} }).catch(() => {});

    const destroyers = [];
    let pollTimer = null;
    const view = { destroy() { destroyers.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); clearTimeout(pollTimer); } };

    // ---- active study-time heartbeat (only counts while the tab is visible and the learner is active)
    let lastActivity = Date.now();
    let pendingSecs = 0;
    const markActive = () => { lastActivity = Date.now(); };
    ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach((ev) => window.addEventListener(ev, markActive, { passive: true }));
    const tickTimer = setInterval(() => {
      const playingAudio = App.TTS && App.TTS.playing && !App.TTS.paused;
      if (document.visibilityState === "visible" && (Date.now() - lastActivity < 120000 || playingAudio)) pendingSecs += 5;
    }, 5000);
    const flush = (useBeacon) => {
      if (pendingSecs < 5) return;
      const secs = pendingSecs; pendingSecs = 0;
      const url = `/api/lesson/${lessonId}/heartbeat`;
      const body = JSON.stringify({ seconds: secs });
      if (useBeacon && navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      else fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body }).catch(() => { pendingSecs += secs; });
    };
    const flushTimer = setInterval(() => flush(false), 30000);
    const onHide = () => { if (document.visibilityState === "hidden") flush(true); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    destroyers.push(() => { clearInterval(tickTimer); clearInterval(flushTimer); flush(true); document.removeEventListener("visibilitychange", onHide); window.removeEventListener("pagehide", onHide);
      ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach((ev) => window.removeEventListener(ev, markActive)); });

    // ---- waiting screen with polling
    if (!data.content) {
      const msg = h("div", { class: "msgline" }, WAIT_MSGS[0]);
      const elapsed = h("div", { class: "tiny dim mt8" }, "0s");
      root.append(h("div", { class: "gen-wait" }, h("div", { class: "orb" }, h("span", null, "🦉")), h("h3", null, `Preparing “${ctx.lesson.title}”`), h("div", { class: "muted small" }, `${ctx.course.code} ${ctx.course.title} · ${ctx.module.title}`), msg, elapsed,
        h("div", { class: "mt16 row", style: "justify-content:center" }, h("a", { class: "btn sm ghost", href: `#/course/${ctx.course.id}` }, "← Back to course"))));
      const t0 = Date.now(); let i = 0;
      const tick = setInterval(() => { i++; msg.textContent = WAIT_MSGS[i % WAIT_MSGS.length]; }, 4000);
      const el = setInterval(() => { elapsed.textContent = Math.round((Date.now() - t0) / 1000) + "s"; }, 1000);
      destroyers.push(() => clearInterval(tick), () => clearInterval(el));
      const poll = async () => {
        try {
          const st = await api(`/lesson/${lessonId}/status`);
          if (st.has_content) { view.destroy(); root.innerHTML = ""; return V.lesson(root, seg, query); }
          if (st.status === "error") { msg.textContent = "Generation failed: " + (st.error || "unknown"); return; }
        } catch (e) { /* retry */ }
        pollTimer = setTimeout(poll, 2500);
      };
      pollTimer = setTimeout(poll, 2500);
      return view;
    }

    // ---- ready: render
    const L = data.content;
    let progress = data.progress;
    const prefersTab = query.tab || "lecture";
    const head = h("div", { class: "lesson-head" },
      h("div", { style: "flex:1;min-width:280px" },
        h("div", { class: "row wrap", style: "gap:6px" }, App.levelTag(ctx.course.level), h("span", { class: "pill" }, `⏱ ${fmt.mins(L.estimated_minutes || 40)}`), h("span", { class: "pill" }, "★".repeat(L.difficulty || 3) + "☆".repeat(5 - (L.difficulty || 3))), h("span", { class: "pill" }, `Lesson ${ctx.position.index_in_course + 1}/${ctx.position.course_total}`), L.offline ? h("span", { class: "pill bad" }, "offline scaffold") : h("span", { class: "pill primary", title: "model" }, `v${L._version} · ${L._model}`), L.generated_with_feedback ? h("span", { class: "pill ok" }, "tuned with your feedback") : null),
        h("h1", null, L.title), h("div", { class: "sub" }, L.subtitle || ""),
        h("div", { class: "small muted mt8" }, `${ctx.domain.icon} ${ctx.domain.name} › ${ctx.subject.name} › `, h("a", { href: `#/course/${ctx.course.id}` }, `${ctx.course.code} ${ctx.course.title}`), ` › ${ctx.module.title}`)),
      h("div", { class: "col", style: "min-width:220px;gap:8px" },
        h("div", { class: "card", style: "padding:12px" }, h("div", { class: "tiny muted" }, "Lesson progress"), progressBar(), h("div", { class: "row wrap mt8", style: "gap:6px" }, statusPills())),
        h("div", { class: "row wrap", style: "gap:6px" }, ctx.prev_id ? h("a", { class: "btn sm ghost", href: `#/lesson/${ctx.prev_id}` }, "← Prev") : null, ctx.next_id ? h("a", { class: "btn sm ghost", href: `#/lesson/${ctx.next_id}` }, "Next →") : null, regenerateButton())));
    function progressBar() {
      const cps = Object.values(progress.checkpoints || {}); const total = L.sections.filter((s) => s.checkpoint).length;
      const steps = [progress.lecture_done ? 1 : 0, total ? cps.filter((c) => c.correct).length / total : (progress.lecture_done ? 1 : 0), progress.homework ? 1 : 0];
      const pct = Math.round((steps.reduce((a, b) => a + b, 0) / 3) * 100);
      return h("div", { class: "progress mt8" + (progress.completed_at ? " ok" : "") }, h("i", { style: `width:${progress.completed_at ? 100 : pct}%` }));
    }
    function statusPills() {
      const cps = Object.values(progress.checkpoints || {}); const total = L.sections.filter((s) => s.checkpoint).length;
      return [h("span", { class: "pill " + (progress.lecture_done ? "ok" : "") }, progress.lecture_done ? "✓ lecture" : "lecture"), h("span", { class: "pill " + (total && cps.filter((c) => c.correct).length === total ? "ok" : "") }, `${cps.filter((c) => c.correct).length}/${total} checkpoints`), h("span", { class: "pill " + (progress.homework ? "ok" : "") }, progress.score != null ? `homework ${fmt.pct(progress.score)}` : "homework"), progress.completed_at ? h("span", { class: "pill ok" }, "🏁 complete") : null];
    }
    function regenerateButton() {
      return h("button", { class: "btn sm ghost", title: "Ask the professor to rewrite this lesson", onclick: async () => {
        const instruction = prompt("Any instruction for the rewrite? (optional — e.g. 'more examples', 'shorter', 'focus on intuition')", "");
        if (instruction === null) return;
        await api(`/lesson/${lessonId}/generate`, { body: { instruction } });
        App.toast("Regenerating… you can keep reading; the page will refresh when the new version is ready.", "info", 5000);
        watchRegeneration();
      } }, "↻ Regenerate");
    }
    function watchRegeneration() {
      const poll = async () => {
        try { const st = await api(`/lesson/${lessonId}/status`); if (st.status === "ready") { App.toast("New version ready ✨", "xp"); return V.lesson(root, seg, query).then((v) => { view.destroy(); Object.assign(view, v); root.scrollIntoView(); }); } if (st.status === "error") { App.toast("Regeneration failed: " + st.error, "err", 6000); return; } } catch (e) { /* ignore */ }
        pollTimer = setTimeout(poll, 3000);
      };
      root.innerHTML = ""; root.append(h("div", { class: "gen-wait" }, h("div", { class: "orb" }, h("span", null, "🦉")), h("h3", null, "Rewriting the lesson…"), h("div", { class: "msgline" }, "Your feedback and preferences are being applied.")));
      pollTimer = setTimeout(poll, 3000);
    }
    function refreshHead() { const nh = head.querySelector(".card"); if (nh) { nh.innerHTML = ""; nh.append(h("div", { class: "tiny muted" }, "Lesson progress"), progressBar(), h("div", { class: "row wrap mt8", style: "gap:6px" }, statusPills())); } }

    // ---- tabs
    const tabs = [
      ["lecture", "📖 Lecture"],
      L.interactive && window.SelfTaughtSims && window.SelfTaughtSims.has(L.interactive.sim) ? ["interactive", "🎮 Interactive"] : null,
      L.lab ? ["lab", "🧪 Lab"] : null,
      ["homework", `📝 Homework`, L.homework.length],
      ["professor", "💬 Professor"],
      ["viva", "🎙️ Viva Voce"],
      ["feynman", "🪲 Teach-Back"],
      ["feedback", "🗳️ Feedback"],
    ].filter(Boolean);
    const tabBar = h("div", { class: "tabs" });
    const panes = {};
    const paneHost = h("div");
    let activeTab = null;
    let mountedSim = null;
    function showTab(id) {
      activeTab = id;
      App.$$("button", tabBar).forEach((b) => b.classList.toggle("active", b.dataset.tab === id));
      paneHost.innerHTML = "";
      if (!panes[id]) panes[id] = buildPane(id);
      paneHost.append(panes[id]);
      if (id === "interactive" && !mountedSim) { const box = panes[id].querySelector(".simbox"); mountedSim = App.mountSim(L.interactive.sim, box, { initial: L.interactive.params || {} }); }
      if (id === "professor") { const log = panes[id].querySelector(".log"); if (log) log.scrollTop = log.scrollHeight; }
      const u = new URL(location.href); const hash = `#/lesson/${lessonId}?tab=${id}`; if (location.hash !== hash) history.replaceState(null, "", hash);
    }
    tabs.forEach(([id, label, n]) => tabBar.append(h("button", { dataset: { tab: id }, onclick: () => showTab(id) }, label, n ? h("span", { class: "n" }, n) : null)));
    destroyers.push(() => { if (mountedSim) mountedSim.destroy(); });

    function buildPane(id) {
      if (id === "lecture") return lecturePane();
      if (id === "interactive") return interactivePane();
      if (id === "lab") return labPane();
      if (id === "homework") return homeworkPane();
      if (id === "professor") return chatPane();
      if (id === "viva" && App.Advanced) return App.Advanced.renderVivaVoceTab(lessonId, ctx, L);
      if (id === "feynman" && App.Advanced) return App.Advanced.renderFeynmanTab(lessonId, ctx, L);
      if (id === "feedback") return feedbackPane();
      return h("div");
    }

    // ---- lecture
    function detectLessonLang() {
      const sid = (ctx.subject && ctx.subject.id) || "";
      if (sid.includes("mandarin") || sid.includes("chinese")) return "zh-CN";
      if (sid.includes("german")) return "de";
      if (sid.includes("italian")) return "it";
      if (sid.includes("french")) return "fr";
      if (sid.includes("arabic")) return "ar";
      return "en";
    }
    function enhanceLanguageTables(rootEl) {
      if (ctx.domain.id !== "languages" || !App.TTS) return;
      const lang = detectLessonLang();
      App.$$("table tbody tr", rootEl).forEach((tr) => {
        const first = tr.querySelector("td");
        if (!first || first.dataset.ttsWired) return;
        const txt = (first.textContent || "").trim();
        if (!txt) return;
        first.dataset.ttsWired = "1";
        const btn = h("button", {
          class: "btn sm ghost tts-inline-btn",
          title: `Hear native pronunciation (${lang})`,
          style: "margin-right:6px;padding:2px 7px;font-size:12px",
          onclick: (e) => { e.stopPropagation(); App.TTS.speakPhrase(txt, lang); },
        }, "🔊");
        const coach = (App.Advanced && App.Advanced.openPronunciationCoach) ? h("button", {
          class: "btn sm ghost tts-inline-btn",
          title: "Pronunciation coach — record yourself and compare your pitch contour with the native reference",
          style: "margin-right:6px;padding:2px 7px;font-size:12px",
          onclick: (e) => { e.stopPropagation(); App.Advanced.openPronunciationCoach(txt, lang); },
        }, "🎯") : null;
        if (coach) first.prepend(coach);
        first.prepend(btn);
      });
    }

    function lecturePane() {
      const bar = h("div", { class: "readbar" }, h("i"));
      const pane = h("div", null, bar);
      const onScroll = () => { const r = pane.getBoundingClientRect(); const total = r.height - window.innerHeight; const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1; bar.firstChild.style.width = Math.round(p * 100) + "%"; };
      window.addEventListener("scroll", onScroll);
      destroyers.push(() => window.removeEventListener("scroll", onScroll), () => { if (App.TTS) App.TTS.stop(); });

      const queueItems = [];
      const hookEl = L.hook ? h("div", { class: "hook" }, App.prose(L.hook)) : null;
      if (hookEl) {
        const subSpoken = L.subtitle ? `${L.subtitle}. ` : "";
        queueItems.push({
          id: "hook",
          label: "Introduction & Hook",
          text: `Welcome to today's lecture on ${L.title}. ${subSpoken}${L.hook}`,
          el: hookEl,
        });
      }
      const sectionLeadIns = [
        (hd) => `Let's begin with ${hd}.`,
        (hd) => `Now, let's turn to ${hd}.`,
        (hd) => `Next, let's explore ${hd}.`,
        (hd) => `Moving on to ${hd}.`,
        (hd) => `Let's now take a closer look at ${hd}.`,
        (hd) => `Finally, let's examine ${hd}.`,
      ];
      const secEls = L.sections.map((s, i) => {
        const secIdx = queueItems.length;
        const readBtn = h("button", {
          class: "btn sm ghost",
          title: "Have the Professor read from this section",
          style: "margin-left:auto;font-size:12px",
          onclick: () => App.TTS && App.TTS.readQueue(queueItems.slice(secIdx)),
        }, "🔊 Read aloud");
        const sec = h("div", { class: "section", id: "sec-" + i },
          h("h2", { style: "display:flex;align-items:center;gap:10px;flex-wrap:wrap" }, h("span", { class: "num" }, i + 1), h("span", null, s.heading), readBtn),
          App.prose(s.body));
        if (s.checkpoint) sec.append(checkpointWidget(s.checkpoint));
        const leadFn = sectionLeadIns[Math.min(i, sectionLeadIns.length - 1)];
        queueItems.push({
          id: "sec-" + i,
          label: `Section ${i + 1}: ${s.heading}`,
          text: `${leadFn(s.heading)}\n\n${s.body}`,
          el: sec,
        });
        return sec;
      });
      const summaryCard = L.summary ? h("div", { class: "card" }, App.prose(L.summary)) : null;
      if (summaryCard) {
        queueItems.push({
          id: "summary",
          label: "Summary & Takeaways",
          text: `To wrap up today's lecture, let's bring the key ideas together.\n\n${L.summary}`,
          el: summaryCard,
        });
      }

      // ---- Professor Voice Lecturer Console
      if (App.TTS) {
        const personas = App.TTS.personas();
        const curPid = App.TTS.currentPersonaId();
        const femaleOpts = personas.filter((p) => p.gender !== "male").map((p) => h("option", { value: p.id, selected: p.id === curPid }, `${p.style_badge} · ${p.name}`));
        const maleOpts = personas.filter((p) => p.gender === "male").map((p) => h("option", { value: p.id, selected: p.id === curPid }, `${p.style_badge} · ${p.name}`));
        const personaSel = h("select", {
          class: "input",
          style: "min-width:265px;padding:6px 10px",
          onchange: (e) => App.TTS.saveVoicePrefs({ voice_persona: e.target.value }),
        },
          h("optgroup", { label: "Female Faculty Lecturers (8)" }, femaleOpts),
          h("optgroup", { label: "Male Faculty Lecturers (8)" }, maleOpts));

        const engineSel = h("select", {
          class: "input",
          style: "width:auto;padding:6px 10px",
          onchange: (e) => App.TTS.saveVoicePrefs({ voice_engine: e.target.value }),
        }, [
          ["neural", "🎙️ Human Neural Studio (HD)"],
          ["gemini_studio", "✨ Gemini 2.5 Neural Studio"],
          ["browser", "💻 Browser Voice"],
        ].map(([v, l]) => h("option", { value: v, selected: v === App.TTS.currentEngine() }, l)));

        const speedSel = h("select", {
          class: "input",
          style: "width:auto;padding:6px 10px",
          onchange: (e) => App.TTS.saveVoicePrefs({ voice_speed: Number(e.target.value) || 1.0 }),
        }, [0.9, 1.0, 1.1, 1.25, 1.5].map((r) => h("option", { value: r, selected: Math.abs(r - App.TTS.currentSpeed()) < 0.03 }, `${r}×`)));

        const playBtn = h("button", {
          class: "btn violet",
          onclick: () => {
            if (App.TTS.playing) App.TTS.togglePause();
            else App.TTS.readQueue(queueItems, { persona: personaSel.value, engine: engineSel.value });
          },
        }, "🎙️ Read Lecture to Me");

        const stopBtn = h("button", {
          class: "btn sm ghost",
          style: "display:none",
          onclick: () => App.TTS.stop(),
        }, "⏹ Stop");

        const auditionBtn = h("button", {
          class: "btn sm secondary",
          title: "Hear a sample of this professor's voice",
          onclick: () => App.TTS.audition(personaSel.value),
        }, "🔊 Sample Voice");

        const podcastBtn = h("button", {
          class: "btn sm secondary",
          title: "Generate a 2-Host Seminar Podcast discussing this lesson",
          onclick: () => App.Advanced && App.Advanced.openPodcastModal(lessonId, ctx, L),
        }, "🎧 2-Host Podcast");

        const clipBtn = h("button", {
          class: "btn sm ghost",
          title: "Clip equations, theorems, or notes from this lesson to your Zettelkasten",
          onclick: () => App.Advanced && App.Advanced.openClipModal(lessonId, ctx, L),
        }, "📎 Clip to Notebook");

        const statusTxt = h("div", { class: "tiny muted" }, "Choose your lecturer's voice and press Read Lecture to Me — or click 🔊 on any section.");

        App.TTS.onState((st) => {
          if (!st.playing) {
            playBtn.textContent = "🎙️ Read Lecture to Me";
            stopBtn.style.display = "none";
            statusTxt.textContent = "Choose your lecturer's voice and press Read Lecture to Me — or click 🔊 on any section.";
          } else {
            stopBtn.style.display = "";
            playBtn.textContent = st.loading ? "⏳ Preparing voice…" : (st.paused ? "▶ Resume Lecturer" : "⏸ Pause Lecturer");
            statusTxt.textContent = (st.loading ? "Synthesizing neural audio: " : "🔊 Speaking: ") + st.activeLabel;
          }
        });

        const lecturerCard = h("div", {
          class: "card mb16 lecturer-bar",
          style: "border-color:rgba(232,121,249,.35);background:linear-gradient(135deg,rgba(124,156,255,.10),rgba(232,121,249,.09))",
        },
          h("div", { class: "row between wrap", style: "gap:10px" },
            h("div", { class: "row wrap", style: "gap:8px;align-items:center" },
              playBtn, stopBtn, personaSel, auditionBtn, podcastBtn, clipBtn, engineSel, speedSel),
            statusTxt));
        pane.append(lecturerCard);
      }

      if (hookEl) pane.append(hookEl);
      if (L.objectives.length) pane.append(h("div", { class: "card mt16" }, h("b", null, "🎯 By the end of this lesson you can"), h("ul", { class: "objectives mt8" }, L.objectives.map((o) => h("li", null, App.prose(o, "inline"))))));
      if (L.prerequisite_recap) pane.append(h("details", { class: "acc mt16" }, h("summary", null, "🔁 What this assumes (prerequisite recap)"), h("div", { class: "body" }, App.prose(L.prerequisite_recap))));
      secEls.forEach((sec) => pane.append(sec));
      if (L.worked_examples.length) pane.append(h("h2", { class: "mt24" }, "🧮 Worked examples"), ...L.worked_examples.map((w, i) => {
        const sol = h("div", { class: "sol", style: "display:none" }, App.prose(w.solution));
        const exCard = h("div", { class: "example" });
        exCard.append(h("div", { class: "ph" },
          h("div", { class: "row between wrap" }, h("b", null, `${i + 1}. ${w.title}`),
            App.TTS ? h("button", { class: "btn sm ghost", onclick: () => App.TTS.readQueue([{ id: `ex-${i}`, label: `Worked Example ${i + 1}: ${w.title}`, text: `Let's walk through an example together: ${w.title}. Here is the question we want to solve. ${w.problem}. Now let's work through the solution step by step. ${w.solution}`, el: exCard }]) }, "🔊 Read example") : null),
          App.prose(w.problem, "mt8"),
          h("button", { class: "btn sm secondary mt8", onclick: (e) => { sol.style.display = sol.style.display === "none" ? "" : "none"; e.target.textContent = sol.style.display === "none" ? "Reveal solution" : "Hide solution"; } }, "Reveal solution")), sol);
        return exCard;
      }));
      if (L.misconceptions.length) pane.append(h("h2", { class: "mt24" }, "🚧 Common misconceptions"), ...L.misconceptions.map((m) => h("div", { class: "myth" }, h("div", { class: "m" }, h("div", { class: "lbl" }, "Myth"), App.prose(m.myth)), h("div", { class: "r" }, h("div", { class: "lbl" }, "Reality"), App.prose(m.reality)))));
      if (summaryCard) pane.append(h("h2", { class: "mt24" }, "📌 Summary"), summaryCard);
      if (L.glossary.length) pane.append(h("h2", { class: "mt24" }, "📖 Glossary"), h("div", { class: "gloss" }, L.glossary.map((g) => h("div", null, h("b", null, g.term), ": ", App.prose(g.definition, "inline")))));
      if (L.connections.length) pane.append(h("h2", { class: "mt24" }, "🕸️ Connections"), h("ul", { class: "prose" }, L.connections.map((c) => h("li", null, App.prose(c, "inline")))));
      if (L.further_reading.length) pane.append(h("h2", { class: "mt24" }, "📚 Further reading"), h("ul", { class: "prose" }, L.further_reading.map((r) => h("li", null, h("b", null, r.title), r.why ? ` — ${r.why}` : ""))));
      if (L.fun_fact) pane.append(h("div", { class: "card mt16", style: "border-color:rgba(255,209,102,.4)" }, h("b", null, "✨ Fun fact: "), App.prose(L.fun_fact, "inline")));
      const finish = h("div", { class: "finish" });
      function renderFinish() {
        finish.innerHTML = "";
        if (!progress.lecture_done) finish.append(h("h3", { style: "margin:0 0 6px" }, "Made it to the end?"), h("p", { class: "muted small" }, "Marking the lecture complete earns XP and unlocks lesson completion. Then take the homework to lock in what you learned."), h("button", { class: "btn lg", onclick: async () => { await api(`/lesson/${lessonId}/lecture_done`, { body: {} }); progress = (await api(`/lesson/${lessonId}`)).progress; refreshHead(); renderFinish(); } }, "✓ I finished the lecture"));
        else if (!progress.completed_at) finish.append(h("h3", { style: "margin:0 0 6px" }, "Lecture complete ✓"), h("p", { class: "muted small" }, "Submit the homework to complete the lesson (best XP), or mark it complete now."), h("div", { class: "row", style: "justify-content:center" }, h("button", { class: "btn lg", onclick: () => showTab("homework") }, "📝 Go to homework"), h("button", { class: "btn lg secondary", onclick: async () => { const r = await api(`/lesson/${lessonId}/complete`, { body: {} }); progress = r.progress; refreshHead(); renderFinish(); if (r.course_completed) { App.confetti({ particleCount: 300 }); App.toast("🏁 COURSE COMPLETE!", "xp", 6000); } } }, "Mark lesson complete")));
        else finish.append(h("h3", { style: "margin:0 0 6px" }, "🏁 Lesson complete"), h("p", { class: "muted small" }, progress.score != null ? `Homework best score: ${fmt.pct(progress.score)}` : "Tip: the homework still pays XP."), h("div", { class: "row", style: "justify-content:center" }, ctx.next_id ? h("a", { class: "btn lg", href: `#/lesson/${ctx.next_id}` }, "Next lesson →") : h("a", { class: "btn lg", href: `#/course/${ctx.course.id}` }, "Back to course"), !progress.homework ? h("button", { class: "btn lg secondary", onclick: () => showTab("homework") }, "📝 Homework") : null));
      }
      renderFinish();
      pane.append(finish);
      enhanceLanguageTables(pane);
      if (App.Study && App.Study.attachHighlightPopover) {
        destroyers.push(App.Study.attachHighlightPopover(pane, { lessonId, ctx, L, ask: askProfessor }));
      }
      return pane;
    }
    let pendingAsk = null;
    function askProfessor(text) {
      pendingAsk = text;
      showTab("professor");
      if (panes.professor && panes.professor._submit && pendingAsk) { const t = pendingAsk; pendingAsk = null; panes.professor._submit(t); }
    }
    function checkpointWidget(cp) {
      const prev = (progress.checkpoints || {})[cp.id];
      const box = h("div", { class: "checkpoint" }, h("div", { class: "lbl" }, "✋ Checkpoint"), App.prose(cp.question, "q"));
      const inp = questionInput(cp, prev ? prev.answer : null);
      const resHost = h("div");
      const btn = h("button", { class: "btn sm mt8", onclick: async () => {
        const a = inp.get(); if (a == null || a === "") { App.toast("Pick or type an answer first.", "info"); return; }
        btn.disabled = true; btn.textContent = "Checking…";
        try {
          const r = await api(`/lesson/${lessonId}/checkpoint`, { body: { checkpoint_id: cp.id, answer: a } });
          progress = r.progress; refreshHead();
          resHost.innerHTML = ""; resHost.append(resultBox(r.result));
          if (cp.type === "mcq") App.$$(".choice", inp.el).forEach((c, i) => { c.classList.toggle("right", i === cp.answer && r.result.correct); c.classList.toggle("wrong", i === a && !r.result.correct); });
          btn.textContent = r.result.correct ? "✓ Answered" : "Try again"; btn.disabled = r.result.correct;
        } catch (e) { App.toast(e.message, "err"); btn.disabled = false; btn.textContent = "Check answer"; }
      } }, prev && prev.correct ? "✓ Answered" : "Check answer");
      if (prev && prev.correct) { btn.disabled = true; resHost.append(resultBox({ correct: true, score: 1, feedback: cp.explanation })); }
      box.append(inp.el, btn, resHost);
      return box;
    }

    // ---- interactive
    function interactivePane() {
      const sim = window.SelfTaughtSims.get(L.interactive.sim);
      return h("div", null, L.interactive.intro ? h("div", { class: "card mb16" }, h("b", null, `🎮 ${sim ? sim.name : L.interactive.sim}`), App.prose(L.interactive.intro, "mt8"), L.interactive.tasks.length ? h("div", { class: "mt8" }, h("b", { class: "small" }, "Guided explorations"), h("ol", { class: "prose", style: "margin:4px 0" }, L.interactive.tasks.map((t) => h("li", null, App.prose(t, "inline"))))) : null) : null, h("div", { class: "simbox" }));
    }

    // ---- lab
    function labPane() {
      const lab = L.lab;
      const panel = labPanel(lab, lessonId, { drafts: data.lab_drafts || {} });
      App.on("lab:load", (code) => { showTab("lab"); panel.setCode(code); });
      return h("div", null, h("div", { class: "card mb16" }, h("b", null, `🧪 ${lab.title}`), App.prose(lab.intro, "mt8"), lab.tasks.length ? h("div", { class: "mt8" }, h("b", { class: "small" }, "Tasks"), h("ol", { class: "prose", style: "margin:4px 0" }, lab.tasks.map((t) => h("li", null, App.prose(t, "inline"))))) : null, h("div", { class: "tiny muted mt8" }, "Runs entirely in your browser (Pyodide). numpy is preloaded; sympy and matplotlib load automatically when imported. Code runs in a background worker: ⏹ Terminate (or the 2-minute limit) safely stops infinite loops. Your code autosaves as you type. Press ✅ Check my work to run the hidden unit tests.")), panel);
    }
    if (!L.lab) App.on("lab:load", (code) => { App.modal([h("h3", null, "Scratch lab"), labPanel({ starter_code: code }, lessonId, { scratch: true })], { cls: "", sticky: false }).box.style.maxWidth = "1100px"; });

    // ---- homework
    function homeworkPane() {
      const pane = h("div");
      const inputs = {};
      const lastSub = (data.submissions || []).slice(-1)[0];
      const banner = h("div");
      function renderBanner(score, grade, note) {
        banner.innerHTML = "";
        banner.append(h("div", { class: "scoreboard mb16" }, h("div", { class: "g" }, grade), h("div", null, h("div", { class: "bold" }, `${Math.round(score * 100)}% on this submission`), h("div", { class: "small muted" }, progress.score != null ? `Best: ${fmt.pct(progress.score)}` : "", note ? ` · ${note}` : ""), ctx.next_id && progress.completed_at ? h("a", { class: "btn sm mt8", href: `#/lesson/${ctx.next_id}` }, "Next lesson →") : null)));
      }
      pane.append(h("div", { class: "card mb16" }, h("b", null, "📝 Problem set"), h("div", { class: "small muted mt8" }, `${L.homework.length} problems · ${L.homework.reduce((a, q) => a + (q.points || 10), 0)} points. Multiple-choice and numeric answers are graded instantly; written, code and proof answers are graded by the professor with feedback. Resubmitting only ever raises your score.`), lastSub ? h("div", { class: "tiny dim mt8" }, `Last submission ${fmt.ago(lastSub.ts)} · ${fmt.pct(lastSub.score)}`) : null), banner);
      L.homework.forEach((q, i) => {
        const prevA = lastSub ? lastSub.answers[q.id] : null;
        const inp = questionInput(q, prevA, { lessonId, drafts: data.lab_drafts || {} });
        inputs[q.id] = inp;
        const res = h("div");
        if (lastSub && lastSub.grading[q.id]) res.append(resultBox(lastSub.grading[q.id]));
        const hint = q.hint ? h("details", { class: "mt8" }, h("summary", { class: "small muted", style: "cursor:pointer" }, "💡 Hint"), App.prose(q.hint, "mt8 small")) : null;
        pane.append(h("div", { class: "hw-item", id: "hw-" + q.id }, h("div", { class: "hd" }, h("b", null, `${i + 1}.`), h("span", { class: "tag " + q.difficulty }, q.difficulty), h("span", { class: "tag" }, `${q.points} pts`), h("span", { class: "tag" }, q.type)), App.prose(q.question), inp.el, hint, res));
        inp.resHost = res;
      });
      const submit = h("button", { class: "btn lg", onclick: async () => {
        const answers = {}; Object.keys(inputs).forEach((k) => { const v = inputs[k].get(); if (v != null && v !== "") answers[k] = v; });
        if (!Object.keys(answers).length) { App.toast("Answer at least one problem.", "info"); return; }
        const unanswered = L.homework.length - Object.keys(answers).length;
        if (unanswered && !confirm(`${unanswered} problem(s) are blank and will score 0. Submit anyway?`)) return;
        submit.disabled = true;
        const exec_results = {};
        for (const q of L.homework) {
          const inp = inputs[q.id];
          if (q.type !== "code" || !inp.runTests || answers[q.id] == null) continue;
          submit.textContent = `Running unit tests for problem ${L.homework.indexOf(q) + 1}…`;
          if (!inp.exec()) { try { await inp.runTests(); } catch (e) { /* graded without execution */ } }
          if (inp.exec()) exec_results[q.id] = inp.exec();
        }
        submit.textContent = "Grading… (written answers take ~10–20s)";
        try {
          const r = await api(`/lesson/${lessonId}/homework`, { body: { answers, exec_results } });
          progress = r.progress; refreshHead();
          L.homework.forEach((q) => { const g = r.grading[q.id]; const host = inputs[q.id].resHost; host.innerHTML = ""; if (g) host.append(resultBox(g)); if (q.type === "mcq" && g) App.$$(".choice", inputs[q.id].el).forEach((c, i) => { c.classList.toggle("right", i === q.answer); c.classList.toggle("wrong", i === answers[q.id] && !g.correct); }); });
          renderBanner(r.score, r.grade, r.grader_note);
          if (r.score >= 0.999) App.confetti({ particleCount: 220 });
          if (r.completion && r.completion.course_completed) { App.confetti({ particleCount: 320, spread: 140 }); App.toast("🏁 COURSE COMPLETE!", "xp", 6000); }
          banner.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) { App.toast(e.message, "err", 5000); }
        submit.disabled = false; submit.textContent = "Submit for grading";
      } }, "Submit for grading");
      pane.append(h("div", { class: "sticky-actions" }, submit));
      return pane;
    }

    // ---- professor chat (SSE)
    function chatPane() {
      const log = h("div", { class: "log" });
      const ta = h("textarea", { class: "input", placeholder: "Ask anything about this lesson… (Enter to send, Shift+Enter for newline)" });
      const send = h("button", { class: "btn", onclick: () => submit() }, "Send");
      const render = (role, md) => {
        const m = h("div", { class: "msg " + role });
        const body = App.prose(md);
        if (role === "model") {
          const persona = App.TTS ? App.TTS.currentPersona() : { name: "PROFESSOR SAGE" };
          const speakBtn = App.TTS ? h("button", {
            class: "btn sm ghost",
            style: "padding:1px 7px;font-size:11px;margin-left:8px",
            title: "Read this reply aloud",
            onclick: () => App.TTS.readQueue([{ id: "chat-msg", label: persona.name, text: body._rawMd || md || body.textContent, el: m }]),
          }, "🔊 Listen") : null;
          m.append(h("div", { class: "who row between", style: "align-items:center" }, h("span", null, `🦉 ${persona.name.toUpperCase()}`), speakBtn));
        }
        m.append(body);
        log.append(m);
        log.scrollTop = log.scrollHeight;
        return body;
      };
      (data.chat || []).forEach((c) => render(c.role === "user" ? "user" : "model", c.content));
      if (!(data.chat || []).length) render("model", `Welcome to office hours! I wrote this lesson on **${L.title}** — ask me to explain any part differently, quiz you, go deeper, or help with a specific homework problem.`);
      async function submit(text) {
        const msg = (text || ta.value).trim(); if (!msg) return;
        ta.value = ""; render("user", msg); send.disabled = true;
        const body = render("model", "…");
        let acc = "";
        try {
          const res = await fetch(`/api/lesson/${lessonId}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg }) });
          if (!res.ok) throw new Error((await res.json()).error || res.statusText);
          const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = "";
          let lastRender = 0;
          while (true) {
            const { value, done } = await reader.read(); if (done) break;
            buf += dec.decode(value, { stream: true });
            let idx;
            while ((idx = buf.indexOf("\n\n")) >= 0) {
              const chunk = buf.slice(0, idx); buf = buf.slice(idx + 2);
              const ev = (chunk.match(/^event: (.*)$/m) || [])[1]; const dataLine = (chunk.match(/^data: (.*)$/m) || [])[1];
              if (!ev || !dataLine) continue;
              const payload = JSON.parse(dataLine);
              if (ev === "token") { acc += payload.t; if (performance.now() - lastRender > 120) { body.innerHTML = App.md(acc); lastRender = performance.now(); log.scrollTop = log.scrollHeight; } }
              else if (ev === "meta") App.rewards(payload);
              else if (ev === "error") { acc += `\n\n*${payload.message}*`; }
              else if (ev === "done") App.rewards(payload);
            }
          }
          App.renderInto(body, acc || "*(no reply)*");
        } catch (e) { App.renderInto(body, `*The professor is unreachable: ${e.message}*`); }
        send.disabled = false; log.scrollTop = log.scrollHeight;
      }
      ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } });
      const sugg = ["Explain the hardest idea here a different way", "Quiz me with 3 quick questions", "Give me a real-world application", "Why does this matter for the next lesson?", "I'm stuck on homework problem 1", "Go deeper: what's the graduate-level view?"];
      const chatRoot = h("div", { class: "chat" });
      chatRoot._submit = (t) => submit(t);
      if (pendingAsk) { const t = pendingAsk; pendingAsk = null; setTimeout(() => submit(t), 50); }
      chatRoot.append(h("div", { class: "row between" }, h("b", null, "💬 Office hours"), h("button", { class: "btn sm ghost", onclick: async () => { if (confirm("Clear this conversation?")) { await api(`/lesson/${lessonId}/chat`, { method: "DELETE" }); log.innerHTML = ""; } } }, "Clear")), log, h("div", { class: "suggest" }, sugg.map((s) => h("button", { class: "chip", onclick: () => submit(s) }, s))), h("div", { class: "composer" }, ta, send));
      return chatRoot;
    }

    // ---- feedback
    function feedbackPane() {
      let rating = 0; const chosen = new Set();
      const stars = h("div", { class: "stars" }, [1, 2, 3, 4, 5].map((n) => h("span", { onclick: () => { rating = n; App.$$("span", stars).forEach((s, i) => s.classList.toggle("on", i < n)); } }, "★")));
      const tags = ["Too easy", "Too hard", "Too long", "Too short", "More examples", "More math", "More code", "More intuition", "Unclear", "Factual error", "More fun", "Better homework", "Sim mismatch"];
      const chips = h("div", { class: "chips" }, tags.map((t) => h("button", { class: "chip", onclick: (e) => { chosen.has(t) ? chosen.delete(t) : chosen.add(t); e.target.classList.toggle("on"); } }, t)));
      const comment = h("textarea", { class: "input", placeholder: "Tell the professor what to change in this lesson. Be specific — it is injected into the regeneration prompt." });
      const prev = h("div", { class: "mt16" });
      function renderPrev(items) { prev.innerHTML = ""; if (!items.length) return; prev.append(h("b", { class: "small" }, "Your previous feedback on this lesson"), ...items.map((f) => h("div", { class: "card mt8 small" }, h("div", { class: "row between" }, h("span", null, f.rating ? "★".repeat(f.rating) : "", " ", (f.tags || []).map((t) => h("span", { class: "tag" }, t))), h("span", { class: "tiny dim" }, `${fmt.time(f.ts)} · ${f.status}`)), f.comment ? h("div", { class: "mt8" }, f.comment) : null))); }
      renderPrev(data.feedback || []);
      const sendFb = async (regen) => {
        if (!rating && !chosen.size && !comment.value.trim()) { App.toast("Add a rating, tags or a comment first.", "info"); return; }
        const r = await api(`/lesson/${lessonId}/feedback`, { body: { rating: rating || null, tags: Array.from(chosen), comment: comment.value.trim(), regenerate: regen } });
        renderPrev(r.feedback); comment.value = "";
        if (regen) watchRegeneration(); else App.toast("Feedback saved. It will be applied next time this lesson is regenerated.", "info", 4500);
      };
      const versions = h("div", { class: "versions mt8" }, (data.versions || []).map((v) => h("button", { class: "btn sm " + (v.version === L._version ? "" : "ghost"), onclick: async () => { if (v.version === L._version) return; await api(`/lesson/${lessonId}/version/${v.version}`); location.reload(); } }, `v${v.version} · ${v.model || "?"} · ${fmt.date(v.created_at)}`)));
      return h("div", { style: "max-width:820px" }, h("div", { class: "card col", style: "gap:12px" }, h("div", { class: "row between wrap" }, h("b", null, "How was this lesson?"), stars), chips, comment,
        h("div", { class: "row wrap" }, h("button", { class: "btn secondary", onclick: () => sendFb(false) }, "Save feedback"), h("button", { class: "btn violet", onclick: () => sendFb(true) }, "↻ Save & regenerate lesson with this feedback")),
        h("div", { class: "tiny muted" }, "Regeneration keeps your progress and previous versions; you can switch back any time.")),
        h("div", { class: "mt16" }, h("b", { class: "small" }, "Versions"), versions), prev);
    }

    root.append(head, tabBar, paneHost);
    showTab(tabs.some((t) => t[0] === prefersTab) ? prefersTab : "lecture");
    return view;
  };
})();
