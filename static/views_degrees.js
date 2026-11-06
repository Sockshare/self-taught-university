/* Self-Taught — Degree Paths (#/degrees)
 * Pre-built Bachelor's, Master's, PhD-prep, interdisciplinary and minor programs. Courses and every
 * prerequisite (across faculties) are chosen automatically by degrees.py. This view lets the learner:
 *   • browse the catalog and their own degrees/diplomas
 *   • review the year-by-year plan, pick electives and add a minor
 *   • enroll (creates a scheduled Super Aid track; test-out courses are skipped)
 *   • follow the degree audit: coursework, electives, credits, comprehensive exam, capstone → Graduate
 */
(function () {
  "use strict";
  const { h, api } = App;
  const V = App.views;

  const KIND_LABEL = { bachelor: "Bachelor's", master: "Master's", phd_prep: "PhD-Prep", interdisciplinary: "Interdisciplinary", minor: "Minor" };
  const KIND_PILL = { bachelor: "primary", master: "violet", phd_prep: "bad", interdisciplinary: "warn", minor: "ok" };
  const ROLE_PILL = {
    gen_ed: (c) => h("span", { class: "pill primary", title: "General Education requirement" }, `Gen Ed · ${c.gen_ed_area || ""}`),
    elective: () => h("span", { class: "pill violet", title: "Elective you selected" }, "Elective"),
    supporting: (c) => h("span", { class: "pill warn", title: "Required prerequisite from another faculty" }, `${c.domain_icon} Prereq · ${c.domain_name}`),
    minor: (c) => h("span", { class: "pill ok", title: "Minor coursework" }, `Minor · ${c.domain_name}`),
    research: (c) => h("span", { class: "pill bad", title: "PhD-prep graduate coursework from a related faculty" }, `Research · ${c.domain_name}`),
  };
  const pct = (x) => `${Math.round((x || 0) * 100)}%`;
  const fmtDate = (ts) => (ts ? new Date(ts * 1000).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "");

  function statBox(big, label) {
    return h("div", { class: "card col", style: "padding:10px 14px;gap:2px;min-width:105px" },
      h("div", { style: "font-size:1.3rem;font-weight:700" }, String(big)),
      h("div", { class: "tiny muted" }, label));
  }

  function diploma(c) {
    return h("div", { class: "card col", style: "gap:4px;border:2px solid #fbbf24;background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(192,132,252,.08));text-align:center;padding:14px" },
      h("div", { class: "tiny muted" }, "SELF-TAUGHT UNIVERSITY · DIPLOMA"),
      h("div", { class: "bold", style: "font-size:1.05rem" }, `📜 ${c.title}`),
      c.honors ? h("div", { class: "small", style: "color:#fbbf24" }, c.honors) : null,
      c.data && c.data.minor ? h("div", { class: "tiny muted" }, `with a ${c.data.minor}`) : null,
      h("div", { class: "tiny muted" }, `Conferred ${fmtDate(c.conferred_at)}` + (c.gpa != null ? ` · Average ${Math.round(c.gpa * 100)}%` : "")));
  }

  // ------------------------------------------------------------------ catalog
  async function renderCatalog(root, query) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Degree Paths" }]);
    const data = await api("/degrees");
    const all = data.degrees || [];
    const conferred = data.conferred || [];
    let kind = query.kind || "all";
    let text = "";

    const grid = h("div", { class: "grid c3", style: "gap:12px" });
    const tabs = h("div", { class: "row wrap", style: "gap:6px" });

    function card(d) {
      const st = d.stats || {};
      const support = Object.entries(st.supporting_domains || {}).map(([n, c]) => `${c} ${n}`).join(", ");
      return h("a", {
        class: "card hover col between", href: `#/degrees/${encodeURIComponent(d.id)}`,
        style: `padding:14px;gap:8px;text-decoration:none;color:inherit;border-left:4px solid ${d.color}` + (d.active ? ";border-color:var(--violet)" : ""),
      },
        h("div", { class: "col", style: "gap:6px" },
          h("div", { class: "row between wrap", style: "gap:6px" },
            h("span", { class: "pill " + (KIND_PILL[d.kind] || "primary") }, KIND_LABEL[d.kind] || d.kind),
            h("div", { class: "row", style: "gap:4px" },
              d.conferred ? h("span", { class: "pill ok" }, "📜 Conferred") : null,
              d.active ? h("span", { class: "pill violet" }, "★ ACTIVE") : (d.enrolled ? h("span", { class: "pill ok" }, "Enrolled") : null),
              d.credential_note ? h("span", { class: "pill warn", title: d.credential_note }, "Concentrated") : null)),
          h("div", { class: "bold", style: "font-size:1rem" }, `${d.icon} ${d.title}`),
          h("div", { class: "tiny muted" }, d.summary),
          h("div", { class: "small" }, `${st.total_courses} courses · ${st.credits_required} credits required · ${d.year_count} yrs · ~${st.est_hours} h`),
          support ? h("div", { class: "tiny muted" }, `Prerequisites from: ${support}`) : null),
        h("div", null,
          h("div", { class: "row between tiny muted" }, h("span", null, `${st.credits_earned}/${st.credits_required} credits`), h("span", null, pct(st.pct))),
          h("div", { class: "progress ok mt4" }, h("i", { style: `width:${pct(st.pct)}` }))));
    }

    function draw() {
      tabs.innerHTML = "";
      [["all", "All"], ["bachelor", "Bachelor's"], ["master", "Master's"], ["phd_prep", "PhD-Prep"], ["interdisciplinary", "Interdisciplinary"], ["minor", "Minors"], ["mine", "My Programs"]].forEach(([k, label]) => {
        const n = k === "all" ? all.length : k === "mine" ? all.filter((d) => d.enrolled || d.conferred).length : all.filter((d) => d.kind === k).length;
        tabs.append(h("button", { class: "btn sm " + (kind === k ? "violet" : "secondary"), onclick: () => { kind = k; draw(); } }, `${label} (${n})`));
      });
      grid.innerHTML = "";
      const q = text.toLowerCase();
      const list = all.filter((d) => (kind === "all" || (kind === "mine" ? (d.enrolled || d.conferred) : d.kind === kind))
        && (!q || (d.title + " " + d.summary).toLowerCase().includes(q)));
      if (!list.length) grid.append(h("div", { class: "empty" }, kind === "mine" ? "You haven't enrolled in a program yet." : "No programs match."));
      list.forEach((d) => grid.append(card(d)));
    }

    const search = h("input", { class: "input", placeholder: "Search programs (e.g. physics, economics, minor)…", style: "max-width:340px",
      oninput: (e) => { text = e.target.value; draw(); } });
    root.append(
      h("div", { class: "col", style: "gap:16px" },
        h("div", null,
          h("h1", { class: "page", style: "margin:0" }, "🎓 Degree Paths"),
          h("p", { class: "lead", style: "margin:4px 0 0" },
            "Pick the degree you want. Each program already includes General Education, every course in its field, and every prerequisite from other fields, ordered year by year. Then follow the degree audit through to graduation.")),
        conferred.length ? h("div", { class: "col", style: "gap:8px" }, h("b", null, "📜 Your Diplomas"), h("div", { class: "grid c3", style: "gap:10px" }, conferred.map(diploma))) : null,
        h("div", { class: "row between wrap", style: "gap:10px" }, tabs, search),
        grid));
    draw();
  }

  // ------------------------------------------------------------------ detail
  async function renderDetail(root, degreeId, query) {
    let d = await api(`/degrees/${encodeURIComponent(degreeId)}`);
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Degree Paths", href: "#/degrees" }, { label: d.title }]);

    // Selection state (electives + minor) — seeded from the server's current plan
    let electiveSel = new Set(d.courses.filter((c) => c.role === "elective").map((c) => c.id));
    let minorSel = (d.minor && d.minor.id) || "";
    const wrap = h("div", { class: "col", style: "gap:16px" });
    root.append(wrap);

    async function refresh() {
      const qs = `?electives=${encodeURIComponent(Array.from(electiveSel).join(","))}&minor=${encodeURIComponent(minorSel)}`;
      d = await api(`/degrees/${encodeURIComponent(degreeId)}${qs}`);
      draw();
    }

    function auditCard() {
      const reqs = d.requirements || [];
      const gradBtn = h("button", {
        class: "btn lg " + (d.ready_to_graduate ? "ok" : "secondary"), disabled: !d.ready_to_graduate || !!d.conferred,
        title: d.ready_to_graduate ? "All requirements met!" : "Complete every requirement to graduate",
        onclick: async () => {
          try {
            const r = await api(`/degrees/${encodeURIComponent(d.id)}/graduate`, { body: {} });
            if (typeof confetti === "function") { try { confetti({ particleCount: 260, spread: 120 }); } catch (_) {} }
            App.toast(`🎓 Congratulations! ${r.conferred.title} conferred${r.conferred.honors ? " — " + r.conferred.honors : ""}.`, "xp");
            await refresh();
          } catch (e) { App.toast(e.message, "danger"); }
        },
      }, d.conferred ? "📜 Degree Conferred" : "🎓 Graduate");
      return h("div", { class: "card col", style: "gap:10px;border:2px solid " + (d.ready_to_graduate ? "#6ee7b7" : "var(--border)") },
        h("div", { class: "row between wrap" },
          h("div", null, h("h3", { style: "margin:0" }, "📋 Degree Audit"), h("div", { class: "tiny muted" }, "Everything you need to graduate. Test-out credit counts as completed coursework.")),
          gradBtn),
        h("div", { class: "col", style: "gap:6px" },
          reqs.map((r) => h("div", { class: "row between wrap", style: "gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)" },
            h("div", { class: "row", style: "gap:8px" }, h("span", null, r.met ? "✅" : "⬜"), h("span", { class: "small" }, r.label),
              r.warning ? h("span", { class: "pill warn tiny" }, r.warning) : null),
            h("div", { class: "row", style: "gap:6px" },
              h("span", { class: "tiny muted" }, r.progress),
              r.id === "exam" && !r.met ? h("a", { class: "btn sm violet", href: `#/exams?degree=${encodeURIComponent(d.id)}` }, "⏱️ Take Exam") : null,
              r.id === "capstone" && !r.met ? h("a", { class: "btn sm violet", href: "#capstone", onclick: (e) => { e.preventDefault(); const el = document.getElementById("capstone"); if (el) el.scrollIntoView({ behavior: "smooth" }); } }, "🧬 Capstone") : null)))));
    }

    function enrollCard() {
      const todayIso = new Date().toISOString().slice(0, 10);
      const startIn = h("input", { type: "date", class: "input", value: todayIso });
      const daysIn = h("input", { type: "number", class: "input", min: 1, max: 7, value: 5 });
      const minsIn = h("input", { type: "number", class: "input", min: 20, max: 300, step: 10, value: 60 });

      // Electives picker
      const electives = [...d.courses.filter((c) => c.role === "elective"), ...(d.available_electives || [])];
      const groups = d.elective_requirements || [];
      const picker = groups.length ? h("div", { class: "col", style: "gap:8px" },
        groups.map((g) => {
          const items = electives.filter((c) => c.elective_group === g.index).sort((a, b) => (a.code || "").localeCompare(b.code || ""));
          const nSel = items.filter((c) => electiveSel.has(c.id)).length;
          return h("details", { class: "acc", open: nSel < g.min },
            h("summary", null, h("span", null, `${g.name}`), h("span", { class: "tiny " + (nSel < g.min ? "bad" : "muted"), style: "margin-left:auto" }, `${nSel} selected · need ≥ ${g.min}`)),
            h("div", { class: "body grid c2", style: "gap:4px" },
              items.map((c) => h("label", { class: "row small", style: "gap:6px;cursor:pointer" },
                h("input", { type: "checkbox", checked: electiveSel.has(c.id), onchange: (e) => { if (e.target.checked) electiveSel.add(c.id); else electiveSel.delete(c.id); refresh(); } }),
                h("span", null, `${c.code} · ${c.title}`), h("span", { class: "tiny dim" }, `${c.credits} cr`)))));
        })) : null;

      const minorSelEl = (d.minors && d.minors.length) ? h("select", { class: "input", onchange: (e) => { minorSel = e.target.value; refresh(); } },
        h("option", { value: "" }, "— No minor —"),
        d.minors.map((m) => h("option", { value: m.id, selected: m.id === minorSel }, m.title))) : null;

      const enrollBtn = h("button", {
        class: "btn lg violet",
        onclick: async () => {
          enrollBtn.disabled = true;
          enrollBtn.textContent = "Building your schedule…";
          try {
            const r = await api(`/degrees/${encodeURIComponent(d.id)}/enroll`, {
              body: { electives: groups.length ? Array.from(electiveSel) : null, minor_id: minorSel || null,
                start_date: startIn.value || todayIso, days_per_week: parseInt(daysIn.value, 10) || 5, mins_per_day: parseInt(minsIn.value, 10) || 60 },
            });
            App.toast(`Enrolled: ${r.lessons} lessons scheduled over ~${r.weeks} weeks` + (r.skipped_courses ? ` (${r.skipped_courses} test-out course(s) skipped)` : "") + ".", "info");
            App.navigate("#/aid?tab=hierarchy");
          } catch (err) {
            App.toast(err.message, "danger");
            enrollBtn.disabled = false;
            enrollBtn.textContent = d.enrolled ? "🔄 Re-build Schedule & Activate" : "🎓 Enroll & Build My Schedule";
          }
        },
      }, d.enrolled ? "🔄 Re-build Schedule & Activate" : "🎓 Enroll & Build My Schedule");

      return h("div", { class: "card col", style: "gap:12px;border:2px solid var(--violet)" },
        h("b", null, d.enrolled ? "Customize & re-build this program's schedule" : "Customize & enroll"),
        h("div", { class: "tiny muted" }, "All electives are selected by default; uncheck any you want to skip (down to the minimum). Changes preview instantly below. Enrolling creates a Super Aid track; your other tracks are kept."),
        picker,
        minorSelEl ? h("label", { class: "field" }, "Add a Minor (optional)", minorSelEl) : null,
        h("div", { class: "grid c3", style: "gap:10px" },
          h("label", { class: "field" }, "Start date", startIn),
          h("label", { class: "field" }, "Study days / week", daysIn),
          h("label", { class: "field" }, "Minutes / day", minsIn)),
        h("div", { class: "row end" }, enrollBtn));
    }

    function capstoneCard() {
      const cap = d.capstone_spec;
      if (!cap) return null;
      const subIn = h("textarea", { rows: 8, class: "input", placeholder: "Write your report: problem, model/argument, methods, results, limitations, executive summary…" });
      const codeIn = h("textarea", { rows: 5, class: "input", style: "font-family:monospace", placeholder: "# Optional: code / derivations" });
      const out = h("div", { class: "col", style: "gap:8px" });
      const btn = h("button", {
        class: "btn violet",
        onclick: async () => {
          if (!subIn.value.trim() && !codeIn.value.trim()) { App.toast("Write your capstone report first.", "warn"); return; }
          btn.disabled = true; btn.textContent = "Faculty committee is reviewing…";
          try {
            const r = await api("/capstones", { body: { capstone_id: cap.id, submission: subIn.value, code: codeIn.value } });
            const ev = r.evaluation || {};
            out.innerHTML = "";
            out.append(h("div", { class: "card", style: `border-color:${(ev.score || 0) >= 0.7 ? "#6ee7b7" : "#fbbf24"}` },
              h("b", null, `${ev.committee_verdict || "Reviewed"} · ${ev.grade || ""} (${Math.round((ev.score || 0) * 100)}%)`),
              App.prose(ev.feedback || "")));
            await refresh();
          } catch (e) { App.toast(e.message, "danger"); } finally { btn.disabled = false; btn.textContent = "📤 Submit to Faculty Committee"; }
        },
      }, "📤 Submit to Faculty Committee");
      const best = (d.capstone_submissions || []).reduce((m, s) => Math.max(m, s.score || 0), 0);
      return h("div", { class: "card col", id: "capstone", style: "gap:10px" },
        h("div", { class: "row between wrap" }, h("h3", { style: "margin:0" }, `🧬 ${cap.title}`),
          (d.capstone_submissions || []).length ? h("span", { class: "pill " + (best >= 0.7 ? "ok" : "warn") }, `Best: ${Math.round(best * 100)}%`) : h("span", { class: "pill" }, "Not submitted")),
        h("div", { class: "small muted" }, cap.summary),
        h("ul", { class: "small", style: "margin:0;padding-left:18px" }, cap.deliverables.map((x) => h("li", null, x))),
        subIn, codeIn, h("div", { class: "row end" }, btn), out);
    }

    function yearsList() {
      const byId = {};
      (d.courses || []).forEach((c) => { byId[c.id] = c; });
      return (d.years || []).map((y) => h("div", { class: "card col", style: "gap:10px" },
        h("div", { class: "row between wrap" },
          h("div", null, h("h3", { style: "margin:0" }, y.title), h("div", { class: "tiny muted" }, y.subtitle)),
          h("div", { class: "small muted" }, `${y.courses.length} courses · ${y.credits} credits · ${y.lessons_done}/${y.lessons} lessons`)),
        h("div", { class: "grid c2", style: "gap:8px" },
          y.courses.map((c) => {
            const prereqs = (c.prerequisites || []).map((p) => (byId[p] ? byId[p].code : p));
            const cp = c.credit_by_exam ? 1 : (c.lesson_count ? c.lessons_done / c.lesson_count : 0);
            return h("div", { class: "card col", style: `padding:10px;gap:4px;border-left:3px solid ${c.domain_color}` },
              h("div", { class: "row between", style: "gap:6px" },
                h("a", { class: "bold small", href: `#/course/${c.id}` }, `${c.completed ? "✅ " : ""}${c.code} · ${c.title}`),
                ROLE_PILL[c.role] ? ROLE_PILL[c.role](c) : null),
              h("div", { class: "tiny muted" }, `${c.credits} cr · ${c.lesson_count} lessons` + (prereqs.length ? ` · requires ${prereqs.join(", ")}` : " · no prerequisites")),
              h("div", { class: "row between", style: "gap:6px" },
                cp > 0 ? h("div", { class: "progress ok", style: "flex:1" }, h("i", { style: `width:${pct(cp)}` })) : h("span"),
                c.credit_by_exam ? h("span", { class: "pill ok tiny" }, "🎓 Credit by exam")
                  : (!c.completed ? h("a", { class: "btn sm ghost", href: `#/exams?course=${encodeURIComponent(c.id)}&testout=1`, title: "Already know it? Score 85%+ to earn credit and skip it." }, "🎓 Test out") : null)));
          }))));
    }

    function draw() {
      const st = d.stats || {};
      const support = Object.entries(st.supporting_domains || {}).map(([n, c]) => `${c} from ${n}`).join(", ");
      wrap.innerHTML = "";
      wrap.append(...[
        h("div", { class: "hero", style: `background: radial-gradient(900px 320px at 0% -20%, ${d.color}44, transparent 65%), var(--panel)` },
          h("div", { class: "row wrap", style: "gap:8px" },
            h("span", { class: "pill " + (KIND_PILL[d.kind] || "primary") }, d.level_label),
            d.active ? h("span", { class: "pill violet" }, "★ ACTIVE TRACK") : (d.enrolled ? h("span", { class: "pill ok" }, "Enrolled") : null),
            d.minor ? h("span", { class: "pill ok" }, `+ ${d.minor.title}`) : null),
          h("h1", { class: "page", style: "margin:10px 0 4px" }, `${d.icon} ${d.title}`),
          h("p", { class: "lead", style: "margin:0" }, d.summary),
          d.builds_on ? h("div", { class: "small mt6" }, "Builds on ", h("a", { href: `#/degrees/${d.builds_on}` }, d.builds_on_title || d.builds_on),
            ". All of its coursework is included, and finished lessons count automatically.") : null,
          d.partner ? h("div", { class: "small mt4" }, `Research coursework drawn from the related faculty: ${d.partner.replace(/_/g, " ")}.`) : null,
          h("div", { class: "row wrap mt12", style: "gap:10px" },
            statBox(st.total_courses, "courses"),
            statBox(st.gen_ed_courses, "Gen Ed"),
            statBox(st.elective_courses, "electives"),
            statBox(st.supporting_courses, "prereqs (other fields)"),
            statBox(`${st.credits_earned}/${st.credits_required}`, "credits earned"),
            statBox(`~${st.est_hours} h`, "study time"),
            statBox(pct(st.pct), "complete")),
          support ? h("div", { class: "small muted mt8" }, `Prerequisites pulled in from other faculties: ${support}.`) : null),
        d.conferred ? diploma(d.conferred) : null,
        d.credential_note ? h("div", { class: "card small", style: "border-color:#fbbf24" }, `⚠️ ${d.credential_note}`) : null,
        auditCard(),
        enrollCard(),
        capstoneCard(),
        ...yearsList()].filter((x) => x != null && x !== false));
    }
    draw();
  }

  V.degrees = async function (root, seg, query) {
    if (seg && seg[0]) return renderDetail(root, decodeURIComponent(seg[0]), query || {});
    return renderCatalog(root, query || {});
  };
})();
