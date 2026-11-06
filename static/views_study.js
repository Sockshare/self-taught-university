/* Self-Taught University — Study tools
 *  - #/review : SM-2 spaced-repetition flashcard review (#9)
 *  - App.Study.attachHighlightPopover : highlight-to-ask popover for lecture text (#21)
 */
(function () {
  "use strict";
  const App = window.App;
  const h = App.h;
  const api = App.api;
  const V = App.views;
  App.Study = App.Study || {};

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function relDue(ts) {
    const d = (ts * 1000 - Date.now()) / 86400000;
    if (d <= 0) return "due now";
    if (d < 1) return `in ${Math.max(1, Math.round(d * 24))}h`;
    return `in ${Math.round(d)}d`;
  }

  // =========================================================================
  // #/review — SPACED-REPETITION FLASHCARDS
  // =========================================================================
  V.review = async function (root) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Flashcard Review" }]);
    let queue = [];
    let stats = { total: 0, due: 0, new: 0, mature: 0 };
    let reviewed = 0;
    let tab = "review";
    let keyHandler = null;

    const statsRow = h("div", { class: "row wrap", style: "gap:8px" });
    const body = h("div", { class: "col mt16", style: "gap:14px" });
    const tabs = h("div", { class: "row wrap", style: "gap:6px" });

    function renderStats() {
      statsRow.innerHTML = "";
      statsRow.append(
        h("span", { class: "pill warn" }, `⏰ ${stats.due} due`),
        h("span", { class: "pill primary" }, `🆕 ${stats.new} new`),
        h("span", { class: "pill ok" }, `🌳 ${stats.mature} mature`),
        h("span", { class: "pill" }, `🗂️ ${stats.total} total`),
        reviewed ? h("span", { class: "pill ok" }, `✓ ${reviewed} reviewed this session`) : null);
    }
    function renderTabs() {
      tabs.innerHTML = "";
      [["review", "🧠 Review"], ["browse", "📚 Browse cards"], ["add", "➕ Add card"]].forEach(([id, label]) =>
        tabs.append(h("button", { class: "btn sm " + (tab === id ? "violet" : "ghost"), onclick: () => { tab = id; render(); } }, label)));
    }

    async function loadDue() {
      const r = await api("/srs?limit=50");
      queue = r.due || [];
      stats = r.stats || stats;
    }

    function setKeys(fn) {
      if (keyHandler) document.removeEventListener("keydown", keyHandler);
      keyHandler = fn;
      if (fn) document.addEventListener("keydown", fn);
    }

    function renderReview() {
      if (!queue.length) {
        setKeys(null);
        body.append(h("div", { class: "card col", style: "gap:10px;text-align:center;padding:30px" },
          h("div", { style: "font-size:42px" }, stats.total ? "🎉" : "🗂️"),
          h("h3", { style: "margin:0" }, stats.total ? "All caught up!" : "No flashcards yet"),
          h("p", { class: "muted small" }, stats.total
            ? "No cards are due right now. Come back later — spacing your reviews is what makes them stick."
            : "Cards are created automatically from lesson glossaries when you finish a lesson, and from checkpoint questions you miss. You can also add your own."),
          h("div", { class: "row wrap", style: "gap:8px;justify-content:center" },
            h("button", { class: "btn secondary", onclick: backfill }, "↺ Backfill from completed lessons"),
            h("button", { class: "btn ghost", onclick: () => { tab = "add"; render(); } }, "➕ Add a custom card"))));
        return;
      }
      const card = queue[0];
      let revealed = false;
      const back = h("div", { class: "back", style: "display:none" });
      App.renderInto(back, card.back);
      const grades = h("div", { class: "srs-grades", style: "display:none" });
      const showBtn = h("button", { class: "btn lg", onclick: reveal }, "Show answer (Space)");
      const G = [[0, "Again", "danger", "1"], [3, "Hard", "warn", "2"], [4, "Good", "ok", "3"], [5, "Easy", "secondary", "4"]];
      G.forEach(([g, label, cls, key]) => grades.append(h("button", { class: "btn " + cls, onclick: () => grade(g) }, `${label} (${key})`)));
      function reveal() {
        if (revealed) return;
        revealed = true;
        back.style.display = ""; grades.style.display = ""; showBtn.style.display = "none";
      }
      let busy = false;
      async function grade(g) {
        if (!revealed || busy) return;
        busy = true;
        try {
          const r = await api("/srs/review", { body: { card_id: card.id, grade: g } });
          stats = r.stats || stats;
          reviewed++;
          queue.shift();
          if (g === 0) queue.push({ ...card, ...(r.card || {}) }); // relearn in this session
        } catch (e) { App.toast(esc(e.message), "warn"); }
        busy = false;
        render();
      }
      setKeys((e) => {
        if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        if (e.code === "Space" || e.key === "Enter") { e.preventDefault(); reveal(); }
        const m = { "1": 0, "2": 3, "3": 4, "4": 5 }[e.key];
        if (m !== undefined) grade(m);
      });
      const front = h("div", { class: "front" });
      App.renderInto(front, card.front);
      body.append(
        h("div", { class: "tiny muted", style: "text-align:center" }, `${queue.length} in queue · ${card.kind || "card"}${card.lesson_id ? " · " : ""}`,
          card.lesson_id ? h("a", { href: `#/lesson/${card.lesson_id}` }, "source lesson") : null),
        h("div", { class: "card srs-card" },
          front,
          h("div", { class: "row mt16", style: "justify-content:center;gap:8px" },
            showBtn,
            h("button", { class: "btn sm ghost", title: "Read aloud", onclick: () => App.TTS && App.TTS.speakText(revealed ? `${card.front}. ${card.back}` : card.front) }, "🔊")),
          back, grades),
        h("div", { class: "tiny muted", style: "text-align:center" }, "Again = forgot · Hard = recalled with effort · Good = recalled · Easy = instant. Intervals grow with the SM-2 algorithm."));
    }

    async function backfill() {
      try {
        const r = await api("/srs/backfill", { body: {} });
        App.toast(`Added ${r.added || 0} cards from your completed lessons.`, "info");
        await loadDue(); render();
      } catch (e) { App.toast(esc(e.message), "warn"); }
    }

    async function renderBrowse() {
      setKeys(null);
      const r = await api("/srs/cards");
      stats = r.stats || stats; renderStats();
      const cards = r.cards || [];
      const filter = h("input", { class: "input", placeholder: "Filter cards..." });
      const list = h("div", { class: "col", style: "gap:6px" });
      function draw() {
        list.innerHTML = "";
        const q = filter.value.trim().toLowerCase();
        const shown = cards.filter((c) => !q || (c.front + " " + c.back).toLowerCase().includes(q));
        if (!shown.length) { list.append(h("div", { class: "muted small" }, "No cards.")); return; }
        shown.slice(0, 300).forEach((c) => list.append(h("div", { class: "card row between", style: "padding:10px;gap:10px" },
          h("div", { class: "col", style: "gap:2px;min-width:0;flex:1" },
            h("b", { class: "small" }, c.front.length > 140 ? c.front.slice(0, 140) + "…" : c.front),
            h("span", { class: "tiny muted" }, (c.back.length > 180 ? c.back.slice(0, 180) + "…" : c.back))),
          h("div", { class: "row", style: "gap:6px;flex-shrink:0" },
            h("span", { class: "pill" + (c.due * 1000 <= Date.now() ? " warn" : "") }, relDue(c.due)),
            h("span", { class: "pill primary", title: "interval / repetitions" }, `${Math.round(c.interval_days || 0)}d · ×${c.reps || 0}`),
            h("button", {
              class: "btn sm danger", title: "Delete card",
              onclick: async () => {
                if (!confirm("Delete this flashcard?")) return;
                await api(`/srs/${c.id}`, { method: "DELETE" });
                cards.splice(cards.indexOf(c), 1); draw();
              },
            }, "🗑")))));
      }
      filter.addEventListener("input", draw);
      draw();
      body.append(h("div", { class: "row between wrap", style: "gap:8px" }, filter,
        h("button", { class: "btn sm secondary", onclick: backfill }, "↺ Backfill from completed lessons")), list);
    }

    function renderAdd() {
      setKeys(null);
      const front = h("textarea", { class: "input", rows: 3, placeholder: "Front — question or term (Markdown + $LaTeX$ supported)" });
      const back = h("textarea", { class: "input", rows: 5, placeholder: "Back — answer or definition" });
      body.append(h("div", { class: "card col", style: "gap:10px" },
        h("b", null, "➕ New custom flashcard"), front, back,
        h("div", { class: "row end" }, h("button", {
          class: "btn violet",
          onclick: async () => {
            if (!front.value.trim() || !back.value.trim()) return App.toast("Both sides are required.", "warn");
            const r = await api("/srs/add", { body: { front: front.value, back: back.value, kind: "custom" } });
            stats = r.stats || stats; renderStats();
            App.toast(r.added ? "Card added — it is due now." : "That card already exists.", "info");
            front.value = ""; back.value = ""; front.focus();
          },
        }, "Add card"))));
    }

    async function render() {
      renderStats(); renderTabs();
      body.innerHTML = "";
      if (tab === "review") renderReview();
      else if (tab === "browse") await renderBrowse();
      else renderAdd();
    }

    await loadDue();
    root.append(
      h("h1", { class: "page" }, "🗂️ Flashcard Review"),
      h("p", { class: "lead" }, "Spaced repetition (SM-2) over glossary terms and missed checkpoints from your lessons — a few minutes a day keeps what you've learned from fading."),
      h("div", { class: "row between wrap", style: "gap:10px" }, statsRow, tabs),
      body);
    await render();
    return { destroy() { setKeys(null); } };
  };

  // =========================================================================
  // HIGHLIGHT-TO-ASK POPOVER (lecture pane)
  // =========================================================================
  App.Study.attachHighlightPopover = function (paneEl, opts) {
    opts = opts || {};
    const lessonId = opts.lessonId;
    const ctx = opts.ctx || {};
    let pop = null, answer = null;

    function close() {
      if (pop) { pop.remove(); pop = null; }
    }
    function closeAnswer() {
      if (answer) { answer.remove(); answer = null; }
    }
    function place(el, rect, below) {
      document.body.append(el);
      const top = window.scrollY + (below ? rect.bottom + 8 : rect.top - el.offsetHeight - 8);
      let left = window.scrollX + rect.left + rect.width / 2 - el.offsetWidth / 2;
      left = Math.max(window.scrollX + 8, Math.min(left, window.scrollX + document.documentElement.clientWidth - el.offsetWidth - 8));
      el.style.top = Math.max(window.scrollY + 8, top) + "px";
      el.style.left = left + "px";
    }
    function showAnswer(rect, title, md) {
      closeAnswer();
      const content = h("div");
      answer = h("div", { class: "hl-answer" },
        h("div", { class: "row between", style: "gap:8px;margin-bottom:6px" }, h("b", { class: "small" }, title),
          h("button", { class: "btn sm ghost", onclick: closeAnswer }, "✕")),
        content);
      if (md == null) content.innerHTML = "<span class='muted small'>Thinking…</span>";
      else App.renderInto(content, md);
      place(answer, rect, true);
      return content;
    }
    async function explain(sel, rect, mode) {
      const content = showAnswer(rect, mode === "deeper" ? "🔍 Going deeper" : "🪄 Explained simply", null);
      try {
        const r = await api(`/lesson/${encodeURIComponent(lessonId)}/explain`, { body: { selection: sel, mode } });
        if (content.isConnected) App.renderInto(content, r.explanation || "_No explanation returned._");
      } catch (e) {
        if (content.isConnected) content.innerHTML = `<span class='small' style='color:#ff9fb6'>${esc(e.message)}</span>`;
      }
    }
    async function clip(sel) {
      const title = (sel.split(/\s+/).slice(0, 8).join(" ") + (sel.split(/\s+/).length > 8 ? "…" : "")).replace(/[$#*_`]/g, "");
      const lessonTitle = (ctx.lesson && ctx.lesson.title) || "lesson";
      try {
        await api("/notebook", {
          body: {
            title: `Clip: ${title}`,
            body: sel.split("\n").map((l) => "> " + l).join("\n") + `\n\n— from *${lessonTitle}*`,
            tags: ["clip", (ctx.course && ctx.course.code ? ctx.course.code.replace(/\s+/g, "").toLowerCase() : "lesson")],
            lesson_id: lessonId,
            course_id: ctx.course && ctx.course.id,
          },
        });
        App.toast("📎 Clipped to your Zettelkasten", "info");
      } catch (e) { App.toast(esc(e.message), "warn"); }
    }

    function onMouseUp(e) {
      if (pop && pop.contains(e.target)) return;
      setTimeout(() => {
        const s = window.getSelection();
        const sel = s ? s.toString().trim() : "";
        if (!sel || sel.length < 3 || !s.rangeCount) { close(); return; }
        const range = s.getRangeAt(0);
        if (!paneEl.contains(range.commonAncestorContainer)) { close(); return; }
        if (e.target && e.target.closest && e.target.closest("input,textarea,button,.hl-answer")) return;
        const rect = range.getBoundingClientRect();
        const text = sel.slice(0, 1500);
        close();
        const btn = (label, title, fn) => h("button", { title, onmousedown: (ev) => ev.preventDefault(), onclick: () => { close(); fn(); } }, label);
        pop = h("div", { class: "hl-pop" },
          btn("💬 Ask Professor", "Send this passage to the professor chat", () => opts.ask && opts.ask(`Regarding this passage:\n\n> ${text.replace(/\n/g, "\n> ")}\n\nCan you help me understand it?`)),
          btn("🪄 Explain Simply", "Plain-language explanation", () => explain(text, rect, "simple")),
          btn("🔍 Go Deeper", "More rigorous / advanced treatment", () => explain(text, rect, "deeper")),
          btn("📎 Clip", "Clip to your Zettelkasten", () => clip(text)),
          btn("🔊 Read", "Read the selection aloud", () => App.TTS && App.TTS.speakText(text)));
        place(pop, rect, false);
      }, 10);
    }
    function onKey(e) { if (e.key === "Escape") { close(); closeAnswer(); } }
    function onDocDown(e) {
      if (pop && !pop.contains(e.target)) close();
      if (answer && !answer.contains(e.target) && !paneEl.contains(e.target)) closeAnswer();
    }
    paneEl.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocDown);
    window.addEventListener("hashchange", close);
    return function cleanup() {
      paneEl.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocDown);
      window.removeEventListener("hashchange", close);
      close(); closeAnswer();
    };
  };
})();
