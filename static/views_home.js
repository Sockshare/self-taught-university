/* Self-Taught — views: dashboard, catalog, domain, course, transcript, badges, arcade, design, feedback, settings, onboarding */
(function () {
  "use strict";
  const { h, api, fmt, esc } = App;
  const V = App.views;

  function domainById(id) { return (App.state.catalog || []).find((d) => d.id === id); }
  function ring(p, color, label, lg) {
    return h("div", { class: "ring" + (lg ? " lg" : ""), style: `--p:${Math.round((p || 0) * 100)};--c:${color || "var(--primary)"}` }, h("span", null, label != null ? label : fmt.pct(p)));
  }
  function degreeLabel(dp) {
    if (!dp) return "";
    if (dp.degree === "master") return "👑 Master's earned";
    if (dp.degree === "bachelor") return `🎓 Bachelor's · Master's ${fmt.pct(dp.master_pct)}`;
    return `Bachelor's ${fmt.pct(dp.bachelor_pct)}`;
  }
  function lessonCard(rec) {
    const L = rec.lesson || rec;
    const d = L.domain || {};
    return h("a", { class: "card hover", href: `#/lesson/${L.id}`, style: `border-top:3px solid ${d.color || "var(--primary)"}` },
      h("div", { class: "row between" }, h("span", { class: "small muted" }, `${d.icon || ""} ${d.name || ""}`), rec.why ? h("span", { class: "pill primary" }, rec.why) : null),
      h("div", { class: "bold mt8", style: "font-size:1.02rem" }, L.title),
      h("div", { class: "small muted mt8" }, `${L.course ? L.course.code + " · " + L.course.title : ""}`),
      L.module ? h("div", { class: "tiny dim" }, `Module: ${L.module}`) : null);
  }
  App.ui = { ring, lessonCard, degreeLabel, domainById };

  // ------------------------------------------------------------------ dashboard
  V.dashboard = async function (root) {
    App.setCrumbs([{ label: "Dashboard" }]);
    const d = await api("/dashboard");
    const s = d.summary;
    const hour = new Date().getHours();
    const greet = hour < 5 ? "Burning the midnight oil" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const goalPct = Math.min(1, s.xp_today / (s.daily_goal_xp || 150));
    root.append(
      h("div", { class: "hero" },
        h("div", { class: "row between wrap top" },
          h("div", null,
            h("div", { class: "muted" }, `${greet}, ${s.name}.`,
              d.srs && d.srs.due ? h("a", { class: "pill warn", href: "#/review", style: "margin-left:8px" }, `🗂️ ${d.srs.due} flashcards due`) : null,
              d.time_spent_total ? h("span", { class: "pill", style: "margin-left:6px", title: "Active study time tracked across lessons" }, `⏱ ${Math.round(d.time_spent_total / 3600 * 10) / 10}h studied`) : null),
            h("h2", null, `${s.rank.icon} ${s.rank.title} · Level ${s.rank.level}`),
            h("div", { class: "muted small" }, s.rank.next_title ? `${fmt.num(s.rank.next_xp - s.total_xp)} XP to ${s.rank.next_title}` : "Maximum rank reached"),
            h("div", { class: "xpbar", style: "max-width:420px;margin-top:10px" }, h("i", { style: `width:${Math.round(s.rank.progress * 100)}%` }))),
          h("div", { class: "row", style: "gap:18px" },
            h("div", { class: "center" }, ring(goalPct, "var(--ok)", `${s.xp_today}`, true), h("div", { class: "tiny muted mt8" }, `of ${s.daily_goal_xp} XP goal`)),
            h("div", { class: "center" }, h("div", { class: "big" }, `🔥${s.streak.current}`), h("div", { class: "tiny muted" }, `streak · best ${s.streak.longest}`)),
            h("div", { class: "center" }, h("div", { class: "big" }, fmt.num(s.lessons_completed)), h("div", { class: "tiny muted" }, "lessons done")),
            h("div", { class: "center" }, h("div", { class: "big" }, `${s.badges_earned}`), h("div", { class: "tiny muted" }, `of ${s.badges_total} badges`))))),
      !d.llm.configured ? h("div", { class: "card mt16", style: "border-color:rgba(255,209,102,.5)" }, h("div", { class: "row between wrap" }, h("div", null, h("b", null, "⚠️ No Gemini API key configured."), h("span", { class: "muted" }, " Lessons will fall back to offline study scaffolds until you add one.")), h("a", { class: "btn sm warn", href: "#/settings" }, "Open Settings"))) : null,
      h("div", { class: "grid c3 mt16" },
        d.continue ? h("a", { class: "card hover", href: `#/lesson/${d.continue.id}`, style: "border-top:3px solid var(--ok)" },
          h("div", { class: "pill ok" }, "▶ Continue learning"), h("div", { class: "bold mt8", style: "font-size:1.05rem" }, d.continue.title),
          h("div", { class: "small muted mt8" }, `${d.continue.domain.icon} ${d.continue.course.code} · ${d.continue.course.title}`),
          h("div", { class: "tiny dim" }, `last visited ${fmt.ago(d.continue.progress.last_visited)}`))
          : h("a", { class: "card hover", href: "#/catalog", style: "border-top:3px solid var(--ok)" }, h("div", { class: "pill ok" }, "🚀 Start here"), h("div", { class: "bold mt8", style: "font-size:1.05rem" }, "Pick your first course"), h("div", { class: "small muted mt8" }, "Browse the catalog and open any lesson — the professor prepares it on the spot.")),
        h("div", { class: "card quest" },
          h("div", { class: "row between" }, h("div", { class: "pill warn" }, "🗺️ Daily quest"), h("span", { class: "small bold" }, d.quest.done ? "✅ +50 XP" : "+50 XP")),
          h("div", { class: "bold mt8", style: "font-size:1.05rem" }, d.quest.title),
          h("div", { class: "progress gold mt8" }, h("i", { style: `width:${Math.round(100 * d.quest.value / d.quest.target)}%` })),
          h("div", { class: "tiny muted mt8" }, `${d.quest.value} / ${d.quest.target}`)),
        h("div", { class: "card" },
          h("div", { class: "row between" }, h("div", { class: "pill primary" }, "📈 Activity · last 6 weeks"), h("span", { class: "tiny muted" }, `${d.xp_by_day.length} active days`)),
          heat(d.xp_by_day))),
      d.active_track ? h("div", { class: "card mt16", style: "border-left:4px solid var(--violet);background:linear-gradient(135deg,rgba(192,132,252,.09),rgba(124,156,255,.05))" },
        h("div", { class: "row between wrap" },
          h("div", { style: "max-width:740px" },
            h("div", { class: "row wrap", style: "gap:8px" },
              h("span", { class: "pill violet" }, "🧭 Super Aid · Active Scholastic Track"),
              h("span", { class: "pill primary" }, `${d.active_track.weeks} Weeks · ${d.active_track.days_per_week}d/wk · ${d.active_track.mins_per_day}m/day`),
              h("span", { class: "pill ok" }, `${d.active_track.stats.done_lessons}/${d.active_track.stats.total_lessons} Lessons (${fmt.pct(d.active_track.stats.pct)})`)),
            h("h3", { style: "margin:8px 0 4px" }, d.active_track.title),
            h("div", { class: "small muted" }, `🎯 Overall Goal: ${d.active_track.overall_goal}`)),
          h("div", { class: "row wrap", style: "gap:8px" },
            d.active_track.next_lesson ? h("a", { class: "btn sm ok", href: `#/lesson/${d.active_track.next_lesson.lesson_id}` }, "▶ Start Next Track Lesson") : null,
            h("a", { class: "btn sm violet", href: "#/aid" }, "📅 Open Super Aid & Calendar"))),
        d.active_track.todays_plan ? h("div", { class: "mt12", style: "border-top:1px solid var(--border);padding-top:10px" },
          h("div", { class: "tiny muted mb8" }, `📅 Scheduled Session (${d.active_track.todays_plan.date} · Week ${d.active_track.todays_plan.week_number}, Day ${d.active_track.todays_plan.day_number} · ${d.active_track.todays_plan.total_mins} mins):`),
          h("div", { class: "grid c3", style: "gap:8px" },
            (d.active_track.todays_plan.items || []).slice(0, 3).map((it) => h("a", {
              class: "card hover row between",
              style: "padding:10px 12px",
              href: it.type === "lesson" ? `#/lesson/${it.lesson_id}` : (it.type === "sim" ? `#/arcade?sim=${it.sim_id}` : (it.href || "#/aid")),
            },
              h("div", { style: "min-width:0" },
                h("div", { class: "tiny muted" }, `${it.domain_icon || "📘"} ${it.course_code || it.type.toUpperCase()} · ${it.mins}m`),
                h("div", { class: "small bold", style: "white-space:nowrap;overflow:hidden;text-overflow:ellipsis" }, it.title)),
              h("span", null, it.completed ? "✅" : "▶"))))) : null) : null,
      h("h2", { class: "mt24", style: "font-size:1.2rem" }, "Up next"),
      h("div", { class: "grid c3" }, d.recommendations.map(lessonCard)),
      h("h2", { class: "mt24", style: "font-size:1.2rem" }, "Degree progress"),
      h("div", { class: "grid auto" }, (App.state.catalog || []).map((dom) => {
        const dp = s.domains[dom.id] || {};
        return h("a", { class: "card hover row", href: `#/domain/${dom.id}`, style: "gap:14px" }, ring(dp.pct, dom.color, null),
          h("div", { style: "min-width:0" }, h("div", { class: "bold" }, `${dom.icon} ${dom.name}`), h("div", { class: "tiny muted" }, `${dp.lessons_done || 0}/${dp.lessons_total || 0} lessons · ${dp.courses_done || 0}/${dp.courses_total || 0} courses`), h("div", { class: "tiny", style: "color:var(--accent)" }, degreeLabel(dp))));
      })),
      d.badges.length ? h("div", null, h("h2", { class: "mt24", style: "font-size:1.2rem" }, "Recent badges"), h("div", { class: "grid c4" }, d.badges.map((b) => h("div", { class: "badge" }, h("div", { class: "ic" }, b.icon), h("div", { class: "nm" }, b.name), h("div", { class: "ds" }, b.desc))))) : null,
      d.recent_xp.length ? h("div", { class: "card mt24" }, h("div", { class: "bold mb8" }, "Recent XP"), h("div", { class: "col gap6" }, d.recent_xp.map((e) => h("div", { class: "row between small" }, h("span", { class: "muted" }, e.reason.replace(/_/g, " ")), h("span", null, h("b", { style: "color:var(--ok)" }, `+${e.amount}`), h("span", { class: "dim tiny" }, `  ${fmt.ago(e.ts)}`)))))) : null,
    );
  };
  function heat(days) {
    const map = {}; days.forEach((d) => (map[d.day] = d.xp));
    const cells = [];
    const today = new Date();
    for (let i = 41; i >= 0; i--) {
      const dt = new Date(today); dt.setDate(today.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      const xp = map[key] || 0;
      const lvl = xp === 0 ? 0 : xp < 60 ? 1 : xp < 150 ? 2 : xp < 300 ? 3 : 4;
      cells.push(h("i", { class: lvl ? "l" + lvl : "", title: `${key}: ${xp} XP` }));
    }
    return h("div", { class: "heat mt8" }, cells);
  }

  // ------------------------------------------------------------------ catalog
  V.catalog = async function (root) {
    App.setCrumbs([{ label: "Catalog" }]);
    const cat = await api("/catalog");
    App.state.catalog = cat;
    const totalCourses = cat.reduce((a, d) => a + (d.course_count || 0), 0);
    const totalLessons = cat.reduce((a, d) => a + (d.lesson_count || 0), 0);
    root.append(h("h1", { class: "page" }, "Course Catalog"), h("p", { class: "lead" }, `${cat.length} faculties, ${fmt.num(totalCourses)} courses, ${fmt.num(totalLessons)} lessons — each one taught live by your AI professor with interactive labs, voice lecturers, and homework.`),
      h("div", { class: "grid c3" }, cat.map((d) => h("a", { class: "card hover domain-card", href: `#/domain/${d.id}` },
        h("div", { class: "glow", style: `background:${d.color}` }),
        h("div", { class: "row between top" }, h("div", { class: "ic" }, d.icon), ring(d.progress.pct, d.color)),
        h("h3", { style: "margin:8px 0 2px" }, d.name), h("div", { class: "muted small" }, d.tagline),
        h("div", { class: "chips mt8" }, d.subjects.slice(0, 5).map((s) => h("span", { class: "tag" }, s.name)), d.subjects.length > 5 ? h("span", { class: "tag" }, `+${d.subjects.length - 5}`) : null),
        h("div", { class: "row between mt16 tiny muted" }, h("span", null, `${d.course_count} courses · ${fmt.num(d.lesson_count)} lessons`), h("span", { style: "color:var(--accent)" }, degreeLabel(d.progress))),
        !d.builtin ? h("span", { class: "pill violet mt8", style: "background:rgba(192,132,252,.18);color:var(--violet)" }, "✨ Designed by you") : null)),
        h("a", { class: "card hover center", href: "#/design", style: "border-style:dashed;display:grid;place-items:center;min-height:220px" }, h("div", null, h("div", { style: "font-size:40px" }, "🏗️"), h("h3", { style: "margin:8px 0 2px" }, "Design a new domain"), h("div", { class: "muted small" }, "Tell the professor what you want to master — get a full Freshman→Master's syllabus.")))));
  };

  // ------------------------------------------------------------------ domain
  V.domain = async function (root, seg) {
    const d = await api("/domain/" + seg[0]);
    App.setCrumbs([{ label: "Catalog", href: "#/catalog" }, { label: d.name }]);
    const dp = d.progress;
    root.append(
      h("div", { class: "hero", style: `background: radial-gradient(900px 300px at 0% -20%, ${d.color}55, transparent 60%), var(--panel)` },
        h("div", { class: "row between wrap top" },
          h("div", { style: "max-width:720px" }, h("div", { style: "font-size:44px" }, d.icon), h("h2", null, d.name), h("div", { class: "muted" }, d.tagline), h("p", { class: "small", style: "color:var(--text)" }, d.description)),
          h("div", { class: "card", style: "min-width:280px" },
            h("div", { class: "bold mb8" }, "🎓 Degree track"),
            h("div", { class: "small row between" }, h("span", null, "Bachelor's"), h("span", { class: "muted" }, `${dp.ug_credits}/${Math.round(dp.ug_total * 0.7)} credits`)), h("div", { class: "progress ok" }, h("i", { style: `width:${Math.round(dp.bachelor_pct * 100)}%` })),
            h("div", { class: "small row between mt8" }, h("span", null, "Master's"), h("span", { class: "muted" }, `${dp.grad_credits}/${Math.round(dp.grad_total * 0.7)} credits`)), h("div", { class: "progress gold" }, h("i", { style: `width:${Math.round(dp.master_pct * 100)}%` })),
            h("div", { class: "tiny muted mt8" }, `${dp.lessons_done}/${dp.lessons_total} lessons · ${dp.courses_done}/${dp.courses_total} courses`),
            !d.builtin ? h("button", { class: "btn sm danger mt8", onclick: async () => { if (confirm("Delete this custom domain and its syllabus? Progress records stay in the database.")) { await api("/domain/" + d.id, { method: "DELETE" }); App.navigate("#/catalog"); } } }, "Delete domain") : null))),
      (d.faculty || []).length ? h("details", { class: "acc mt16", open: true },
        h("summary", null, h("span", null, `👩‍🏫 Faculty & Staff`), h("span", { class: "tiny dim", style: "margin-left:auto" }, `${d.faculty.length} members`)),
        h("div", { class: "body" }, h("div", { class: "grid auto" }, d.faculty.map((f) => h("div", { class: "card", style: "gap:4px" },
          h("div", { class: "row", style: "gap:8px" }, h("span", { style: "font-size:28px" }, f.icon || "🎓"),
            h("div", { style: "min-width:0" }, h("div", { class: "bold" }, f.name), h("div", { class: "tiny muted" }, f.title || ""))),
          f.specialty ? h("div", { class: "small mt8" }, h("b", null, "Specialty: "), f.specialty) : null,
          f.bio ? h("div", { class: "tiny muted mt8" }, f.bio) : null,
          (f.courses || []).length ? h("div", { class: "row wrap mt8", style: "gap:4px" }, f.courses.map((c) => h("a", { class: "pill", href: `#/course/${c.id}`, title: c.title }, c.code))) : null,
          f.persona ? h("button", { class: "btn sm ghost mt8", title: "Hear this lecturer's voice", onclick: () => { try { new Audio(`/static/audio/samples/${f.persona}.mp3`).play(); } catch (e) {} } }, "🔊 Voice") : null))))) : null,
      h("div", { class: "row between mt16" }, h("h2", { style: "font-size:1.2rem;margin:0" }, "Subjects & courses"), h("a", { class: "btn sm secondary", href: `#/design?domain=${d.id}` }, "➕ Add a subject with AI")),
      ...d.subjects.map((s) => h("div", { class: "card mt16" },
        h("div", { class: "row between wrap" }, h("div", null, h("div", { class: "bold", style: "font-size:1.08rem" }, `${s.icon || "📘"} ${s.name}`), h("div", { class: "small muted" }, s.description)), h("span", { class: "tiny muted" }, `${s.courses.length} courses · ${s.lesson_count} lessons`)),
        h("div", { class: "grid auto mt16" }, s.courses.slice().sort((a, b) => a.level - b.level).map((c) => h("a", { class: "course-chip", href: `#/course/${c.id}` },
          ring(c.status.pct, d.color, c.status.completed ? "✓" : c.status.started ? `${c.status.done}` : "", false),
          h("div", { style: "min-width:0" }, h("div", { class: "row", style: "gap:6px" }, App.levelTag(c.level), h("span", { class: "tiny dim" }, `${c.credits} cr`)), h("div", { class: "t" }, `${c.code} · ${c.title}`), h("div", { class: "m" }, `${c.modules_count} modules · ${c.lesson_count} lessons${c.prerequisites.length ? " · prereqs: " + c.prerequisites.length : ""}`), c.instructor ? h("div", { class: "tiny dim" }, `👩‍🏫 ${c.instructor}`) : null)))))));
  };

  // ------------------------------------------------------------------ course
  V.course = async function (root, seg) {
    const c = await api("/course/" + seg[0]);
    App.setCrumbs([{ label: "Catalog", href: "#/catalog" }, { label: c.domain.name, href: `#/domain/${c.domain.id}` }, { label: c.course.code }]);
    const first = (() => { for (const m of c.modules) for (const l of m.lessons) if (l.status !== "completed") return l; return null; })();
    if (c.lock && c.lock.locked) root.append(App.lockBanner(c.course, c.lock));
    root.append(
      h("div", { class: "hero" },
        h("div", { class: "row between wrap top" },
          h("div", { style: "max-width:760px" }, h("div", { class: "row" }, App.levelTag(c.course.level), h("span", { class: "pill" }, `${c.course.credits} credits`), h("span", { class: "pill" }, `${c.subject.icon || ""} ${c.subject.name}`)),
            h("h2", { class: "mt8" }, `${c.course.code} · ${c.course.title}`), h("p", { class: "small" }, c.course.description),
            c.instructor ? h("div", { class: "row small mb8", style: "gap:6px" }, h("span", null, c.instructor.icon || "👩‍🏫"), h("span", null, "Taught by ", h("b", null, c.instructor.name), c.instructor.title ? h("span", { class: "muted" }, ` · ${c.instructor.title}`) : null)) : null,
            c.prerequisites.length ? h("div", { class: "row wrap small" }, h("span", { class: "muted" }, "Recommended prerequisites:"), c.prerequisites.map((p) => h("a", { class: "pill " + (p.status.completed ? "ok" : "warn"), href: `#/course/${p.id}` }, `${p.status.completed ? "✓" : "○"} ${p.code}`))) : null),
          h("div", { class: "center" }, ring(c.status.pct, c.domain.color, null, true), h("div", { class: "tiny muted mt8" }, `${c.status.done}/${c.status.total} lessons`), c.status.grade ? h("div", { class: "pill ok mt8" }, `Grade ${c.status.grade}`) : null,
            c.status.credit_by_exam ? h("div", { class: "pill ok mt8", title: "Completed via comprehensive test-out exam" }, "🎓 Credit by exam") : null,
            first && !c.status.credit_by_exam ? h("a", { class: "btn mt8 block", href: `#/lesson/${first.id}` }, c.status.started ? "Continue ▶" : "Start course ▶") : h("div", { class: "pill ok mt8" }, "🏁 Completed"),
            !c.status.completed && !c.status.credit_by_exam ? h("a", { class: "btn sm ghost mt8 block", href: `#/exams?course=${encodeURIComponent(c.course.id)}&testout=1`, title: "Already know this? Score 85%+ on a comprehensive exam to earn full credit." }, "🎓 Test out of this course") : null))),
      h("div", { class: "mt16 col" }, c.modules.map((m, i) => h("details", { class: "acc", open: i === 0 || m.lessons.some((l) => l.status === "started") },
        h("summary", null, h("span", { class: "muted" }, `Module ${i + 1}`), h("span", null, m.title), h("span", { class: "tiny dim", style: "margin-left:auto" }, `${m.lessons.filter((l) => l.status === "completed").length}/${m.lessons.length}`), m.sim ? h("span", { class: "pill primary", title: "Interactive simulation" }, "🎮") : null, m.lab ? h("span", { class: "pill ok", title: "Python lab" }, "🧪") : null),
        h("div", { class: "body" }, h("div", { class: "small muted mb8" }, m.summary),
          m.lessons.map((l) => h("a", { class: "lesson-row", href: `#/lesson/${l.id}` }, h("span", { class: "st" }, App.statusIcon(l.status)), h("span", { class: "t" }, l.title), l.score != null ? h("span", { class: "pill " + (l.score >= 0.8 ? "ok" : l.score >= 0.6 ? "warn" : "bad") }, fmt.pct(l.score)) : null, l.cached ? h("span", { class: "meta", title: "Lesson already prepared — opens instantly" }, "⚡") : null)))))));
  };

  // ------------------------------------------------------------------ transcript
  V.transcript = async function (root) {
    App.setCrumbs([{ label: "Transcript" }]);
    const t = await api("/transcript");
    const s = t.summary;
    setTimeout(() => {
      if (!(t.degrees || []).length || !root.firstElementChild) return;
      root.firstElementChild.after(h("div", { class: "card mt16 col", style: "gap:6px;border-color:#fbbf24" }, h("b", null, "📜 Degrees Conferred"),
        t.degrees.map((g) => h("div", { class: "row between wrap" }, h("span", null, `${g.title}${g.honors ? " · " + g.honors : ""}${g.data && g.data.minor ? " · with a " + g.data.minor : ""}`),
          h("span", { class: "tiny muted" }, `${fmt.date(g.conferred_at)}${g.gpa != null ? " · Avg " + Math.round(g.gpa * 100) + "%" : ""}`)))));
    }, 0);
    root.append(h("div", { class: "row between wrap" }, h("div", null, h("h1", { class: "page" }, "Academic Transcript"), h("p", { class: "lead" }, `${s.name} · ${s.rank.icon} ${s.rank.title} · ${fmt.num(s.total_xp)} XP · ${s.lessons_completed} lessons completed`)), h("button", { class: "btn secondary", onclick: () => window.print() }, "🖨️ Print")),
      ...t.domains.map((d) => {
        const dp = d.progress;
        return h("div", { class: "card mt16" },
          h("div", { class: "row between wrap" }, h("div", { class: "bold", style: "font-size:1.1rem" }, `${d.domain.icon} ${d.domain.name}`), h("div", { class: "row" }, h("span", { class: "pill " + (dp.degree !== "none" ? "ok" : "") }, degreeLabel(dp)), h("span", { class: "pill" }, `${dp.ug_credits + dp.grad_credits} credits earned`))),
          d.courses.length ? h("table", { class: "tbl mt8" }, h("thead", null, h("tr", null, h("th", null, "Code"), h("th", null, "Course"), h("th", null, "Level"), h("th", null, "Credits"), h("th", null, "Progress"), h("th", null, "Grade"))),
            h("tbody", null, d.courses.map((c) => h("tr", null, h("td", null, h("a", { href: `#/course/${c.id}` }, c.code)), h("td", null, c.title, h("div", { class: "tiny dim" }, c.subject)), h("td", null, App.levelTag(c.level)), h("td", null, c.credits), h("td", null, h("div", { class: "progress" + (c.status.completed ? " ok" : ""), style: "width:120px" }, h("i", { style: `width:${Math.round(c.status.pct * 100)}%` })), h("span", { class: "tiny muted" }, `${c.status.done}/${c.status.total}`)), h("td", null, c.status.grade ? h("b", null, c.status.grade) : h("span", { class: "dim" }, "—"), c.status.credit_by_exam ? h("div", { class: "tiny ok" }, "credit by exam") : null)))))
            : h("div", { class: "small muted mt8" }, "No courses started yet."));
      }));
  };

  // ------------------------------------------------------------------ badges
  V.badges = async function (root) {
    App.setCrumbs([{ label: "Badges" }]);
    const list = await api("/badges");
    const earned = list.filter((b) => b.earned), locked = list.filter((b) => !b.earned);
    root.append(h("h1", { class: "page" }, "Badges"), h("p", { class: "lead" }, `${earned.length} of ${list.length} unlocked. Each badge marks a real milestone in your journey from Freshman to Master.`),
      earned.length ? h("div", { class: "grid c4" }, earned.map((b) => h("div", { class: "badge" }, h("div", { class: "ic" }, b.icon), h("div", { class: "nm" }, b.name), h("div", { class: "ds" }, b.desc), h("div", { class: "tiny dim" }, fmt.date(b.earned_at))))) : h("div", { class: "empty" }, "No badges yet — open a lesson to earn your first one."),
      h("h2", { class: "mt24", style: "font-size:1.1rem" }, "Locked"), h("div", { class: "grid c4" }, locked.map((b) => h("div", { class: "badge locked" }, h("div", { class: "ic" }, b.icon), h("div", { class: "nm" }, b.name), h("div", { class: "ds" }, b.desc)))));
  };

  // ------------------------------------------------------------------ arcade (all sims)
  V.arcade = async function (root, seg, query) {
    query = query || {};
    App.setCrumbs([{ label: "Arcade" }]);
    const sims = window.SelfTaughtSims ? window.SelfTaughtSims.list() : [];
    const prog = App.state.simsProgress || {};
    let mounted = null;
    let activeSimId = null;
    const stage = h("div", { class: "mt16", id: "arcade-stage" });

    function open(id, shouldScroll) {
      if (mounted) { try { mounted.destroy(); } catch (e) {} mounted = null; }
      stage.innerHTML = "";
      const def = sims.find((s) => s.id === id) || (window.SelfTaughtSims && window.SelfTaughtSims.get(id));
      if (!def) {
        App.toast(`Simulation "${id}" not found.`, "err");
        return;
      }
      activeSimId = def.id;
      const domId = (def.domains && def.domains[0]) || "physics";
      const dom = domainById(domId) || { name: domId, icon: "🕹️", color: "var(--primary)" };
      const box = h("div", { style: "min-height:380px" });
      const wrap = h("div", {
        class: "card",
        style: `border:2px solid ${dom.color || "var(--primary)"}; padding:16px; background:rgba(15,18,34,0.92); box-shadow:0 12px 36px rgba(0,0,0,0.45)`,
      },
        h("div", { class: "row between wrap mb8", style: "gap:8px" },
          h("div", { class: "row wrap", style: "gap:10px;align-items:center" },
            h("span", { class: "pill primary" }, `${dom.icon} ${dom.name}`),
            h("h2", { style: "margin:0;font-size:1.25rem" }, `🎮 ${def.name}`)),
          h("div", { class: "row", style: "gap:8px" },
            h("button", {
              class: "btn sm ghost",
              onclick: () => {
                if (mounted) { try { mounted.destroy(); } catch (e) {} mounted = null; }
                activeSimId = null;
                stage.innerHTML = "";
                try { history.replaceState(null, "", "#/arcade"); } catch (e) {}
                renderGroups();
              },
            }, "✕ Close Simulation"))),
        box);
      stage.append(wrap);
      mounted = App.mountSim(def.id, box, {});
      renderGroups();
      if (shouldScroll !== false) {
        try { stage.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
      }
    }

    const groups = {};
    sims.forEach((s) => { const d = (s.domains && s.domains[0]) || "other"; (groups[d] = groups[d] || []).push(s); });
    const catalogIds = (App.state.catalog || []).map((d) => d.id);
    const knownOrder = [
      "physics", "chemistry", "math", "ai", "robotics", "philosophy", "languages",
      "cybersecurity", "neuroscience", "psychology", "game_theory", "aerospace", "quantum_computing",
      "synbio", "materials", "systems", "complex_systems", "geopolitics", "jurisprudence", "rf_sdr",
    ];
    const order = Array.from(new Set([...knownOrder, ...catalogIds, ...Object.keys(groups)]));
    let activeDom = query.domain || "all";
    let searchTerm = "";
    const gridHost = h("div");
    const filterBar = h("div", { class: "row wrap mt12", style: "gap:6px" });
    const searchInp = h("input", {
      class: "input",
      style: "max-width:320px",
      placeholder: "Filter simulations by name or concept…",
      oninput: (e) => { searchTerm = e.target.value.trim().toLowerCase(); renderGroups(); },
    });

    function renderFilters() {
      filterBar.innerHTML = "";
      filterBar.append(h("button", {
        class: "chip" + (activeDom === "all" ? " on" : ""),
        onclick: () => { activeDom = "all"; renderFilters(); renderGroups(); },
      }, `All Faculties (${sims.length})`));
      order.filter((k) => groups[k]).forEach((k) => {
        const dom = domainById(k) || { name: k, icon: "🎲" };
        filterBar.append(h("button", {
          class: "chip" + (activeDom === k ? " on" : ""),
          onclick: () => { activeDom = k; renderFilters(); renderGroups(); },
        }, `${dom.icon} ${dom.name} (${groups[k].length})`));
      });
    }

    function renderGroups() {
      gridHost.innerHTML = "";
      order.filter((k) => groups[k] && (activeDom === "all" || activeDom === k)).forEach((k) => {
        const dom = domainById(k) || { name: k, icon: "🎲", color: "var(--primary)" };
        const items = groups[k].filter((s) => !searchTerm || s.name.toLowerCase().includes(searchTerm) || (s.description || "").toLowerCase().includes(searchTerm) || s.id.toLowerCase().includes(searchTerm));
        if (!items.length) return;
        gridHost.append(h("div", null,
          h("h2", { class: "mt24", style: "font-size:1.1rem" }, `${dom.icon} ${dom.name} (${items.length})`),
          h("div", { class: "grid c3" }, items.map((s) => {
            const done = (prog[s.id] || []).length, total = (s.challenges || []).length;
            const isOpen = activeSimId === s.id;
            return h("div", {
              class: "card hover",
              style: isOpen ? `border-color:${dom.color || "var(--primary)"};box-shadow:0 0 0 1px ${dom.color || "var(--primary)"}` : "cursor:pointer",
              onclick: () => {
                try { history.replaceState(null, "", "#/arcade/" + s.id); } catch (e) {}
                open(s.id, true);
              },
            },
              h("div", { class: "row between" }, h("b", null, s.name), ring(total ? done / total : 0, dom.color, `${done}/${total}`)),
              h("div", { class: "small muted mt8" }, s.description),
              h("div", { class: "row between mt12" },
                h("span", { class: "tiny dim" }, `${(s.params || []).length} controls · ${total} challenges`),
                h("span", { class: "pill " + (isOpen ? "ok" : "primary") }, isOpen ? "● Active Above" : "▶ Launch Sim")));
          }))));
      });
    }

    renderFilters();
    renderGroups();
    root.append(
      h("div", { class: "row between wrap" },
        h("div", null,
          h("h1", { class: "page" }, "🕹️ The Interactive Arcade"),
          h("p", { class: "lead" }, `${sims.length} interactive visual simulations across all faculties — click any card below to launch its live interactive canvas, parameter sliders, challenges, and 🔬 Break the System fault-injection lab.`)),
        searchInp),
      filterBar,
      stage,
      gridHost,
    );
    if (seg[0] || query.sim) open(seg[0] || query.sim, false);
    return { destroy() { if (mounted) { try { mounted.destroy(); } catch (e) {} } } };
  };

  // shared: mount a sim with XP wiring + Fault-Injection XP wiring
  App.mountSim = function (id, container, opts) {
    opts = opts || {};
    const prog = App.state.simsProgress || {};
    return window.SelfTaughtSims.mount(id, container, {
      initial: opts.initial || {}, completed: prog[id] || [],
      onAward: async (ch, def) => {
        try {
          const r = await api("/sim/challenge", { body: { sim_id: def.id, challenge_id: ch.id, xp: ch.xp || 10 } });
          App.state.simsProgress[def.id] = (r.done || []).map((x) => x.challenge_id);
        } catch (e) { App.toast("Could not record challenge: " + e.message, "err"); }
      },
      onFaultSolved: async (def) => {
        try {
          await api("/fault_solved", { body: { sim_id: def.id } });
        } catch (e) { App.toast("Fault fixed!", "ok"); }
      },
    });
  };

  // ------------------------------------------------------------------ design a course
  V.design = async function (root, seg, query) {
    App.setCrumbs([{ label: "Design a Course" }]);
    const custom = (App.state.catalog || []).filter((d) => !d.builtin);
    const topic = h("input", { class: "input", placeholder: "e.g. Quantum computing · Game theory · Music theory · Byzantine history · Rust systems programming" });
    const goal = h("textarea", { class: "input", placeholder: "What do you want to be able to DO at the end? (optional) e.g. 'implement Shor's algorithm and read current QC papers'" });
    const size = h("select", { class: "input" }, h("option", { value: "small" }, "Small · ~80 lessons (a focused minor)"), h("option", { value: "medium", selected: true }, "Medium · ~200 lessons (a full major)"), h("option", { value: "large" }, "Large · ~400 lessons (a whole faculty)"));
    const extend = h("select", { class: "input" }, h("option", { value: "" }, "Create a brand-new domain"), (App.state.catalog || []).map((d) => h("option", { value: d.id, selected: query.domain === d.id }, `Add subject(s) to: ${d.icon} ${d.name}`)));
    const status = h("div", { class: "mt16" });
    const btn = h("button", { class: "btn lg", onclick: async () => {
      if (!topic.value.trim()) { topic.focus(); return; }
      btn.disabled = true;
      status.innerHTML = "";
      status.append(h("div", { class: "gen-wait" }, h("div", { class: "orb" }, h("span", null, "🏗️")), h("h3", null, "Designing your curriculum…"), h("div", { class: "msgline" }, "The professor is drafting courses, modules and lessons. This takes 30–90 seconds.")));
      try {
        const { job_id } = await api("/design", { body: { topic: topic.value.trim(), goal: goal.value.trim(), size: size.value, domain_id: extend.value || null } });
        const poll = async () => {
          const j = await api("/jobs/" + job_id);
          if (j.status === "running") return setTimeout(poll, 2500);
          btn.disabled = false;
          status.innerHTML = "";
          if (j.status === "error") { status.append(h("div", { class: "result bad" }, "Design failed: " + j.error)); return; }
          App.confetti();
          const dom = j.result.domain;
          (j.result.badges || []).forEach((b) => App.badgePop(b));
          App.state.catalog = await api("/catalog");
          status.append(h("div", { class: "result ok" }, h("b", null, `✨ ${dom.icon} ${dom.name} is ready: `), `${dom.course_count} courses · ${dom.lesson_count} lessons. `, h("a", { class: "btn sm mt8", href: `#/domain/${dom.id}` }, "Open it →")));
        };
        poll();
      } catch (e) { btn.disabled = false; status.innerHTML = ""; status.append(h("div", { class: "result bad" }, e.message)); }
    } }, "🏗️ Design it");
    root.append(h("h1", { class: "page" }, "Design a Course"), h("p", { class: "lead" }, "Name any subject or domain you deign to master. The professor will architect a complete Freshman → Master's syllabus — subjects, leveled courses, modules and specific lessons — then teach every lesson on demand."),
      h("div", { class: "card", style: "max-width:820px" }, h("div", { class: "col", style: "gap:14px" },
        h("label", { class: "field" }, "Topic / domain", topic), h("label", { class: "field" }, "Your goal", goal),
        h("div", { class: "grid c2" }, h("label", { class: "field" }, "Size", size), h("label", { class: "field" }, "Where", extend)), h("div", null, btn)), status),
      custom.length ? h("div", null, h("h2", { class: "mt24", style: "font-size:1.1rem" }, "Your designed domains"), h("div", { class: "grid c3" }, custom.map((d) => h("a", { class: "card hover", href: `#/domain/${d.id}` }, h("div", { style: "font-size:30px" }, d.icon), h("b", null, d.name), h("div", { class: "small muted" }, `${d.course_count} courses · ${d.lesson_count} lessons`))))) : null);
  };

  // ------------------------------------------------------------------ feedback
  V.feedback = async function (root) {
    App.setCrumbs([{ label: "Feedback" }]);
    const comment = h("textarea", { class: "input", placeholder: "What should change? Anything: UI, pacing, the professor's style, missing topics, bugs…" });
    let rating = 0;
    const stars = h("div", { class: "stars" }, [1, 2, 3, 4, 5].map((n) => h("span", { onclick: () => { rating = n; App.$$("span", stars).forEach((s, i) => s.classList.toggle("on", i < n)); } }, "★")));
    const tags = ["UI", "Professor style", "Too hard", "Too easy", "Bug", "Missing topic", "Gamification", "Labs", "Sims", "Idea"];
    const chosen = new Set();
    const chips = h("div", { class: "chips" }, tags.map((t) => h("button", { class: "chip", onclick: (e) => { chosen.has(t) ? chosen.delete(t) : chosen.add(t); e.target.classList.toggle("on"); } }, t)));
    const list = h("div", { class: "mt16" });
    async function load() {
      const items = await api("/feedback");
      list.innerHTML = "";
      if (!items.length) { list.append(h("div", { class: "empty" }, "No feedback yet. Your notes shape how the professor teaches.")); return; }
      list.append(h("table", { class: "tbl" }, h("thead", null, h("tr", null, h("th", null, "When"), h("th", null, "Scope"), h("th", null, "Rating"), h("th", null, "Comment"), h("th", null, "Status"))),
        h("tbody", null, items.map((f) => h("tr", null, h("td", { class: "tiny muted" }, fmt.time(f.ts)), h("td", null, f.lesson_id ? h("a", { href: `#/lesson/${f.lesson_id}` }, f.lesson_title || "lesson") : h("span", { class: "pill" }, f.scope)), h("td", null, f.rating ? "★".repeat(f.rating) : "—"), h("td", null, h("div", { class: "chips mb8" }, (f.tags || []).map((t) => h("span", { class: "tag" }, t))), f.comment), h("td", null, h("select", { class: "input", style: "padding:4px 8px;width:auto", onchange: (e) => api(`/feedback/${f.id}/status`, { body: { status: e.target.value } }) }, ["new", "applied", "wontfix", "later"].map((s) => h("option", { value: s, selected: f.status === s }, s)))))))));
    }
    root.append(h("h1", { class: "page" }, "Feedback & Tuning"), h("p", { class: "lead" }, "Lesson feedback is injected straight into the professor's prompt when a lesson is regenerated. App-level feedback is logged here so it can be acted on when the app is tuned."),
      h("div", { class: "card", style: "max-width:820px" }, h("div", { class: "col", style: "gap:12px" }, h("div", { class: "row between wrap" }, h("b", null, "How is Self-Taught working for you?"), stars), chips, comment,
        h("div", null, h("button", { class: "btn", onclick: async () => { if (!comment.value.trim()) return; await api("/feedback", { body: { scope: "app", rating: rating || null, tags: Array.from(chosen), comment: comment.value.trim() } }); comment.value = ""; App.toast("Feedback recorded — thank you!", "info"); load(); } }, "Send feedback")))),
      h("div", { class: "card mt16" }, h("b", null, "💡 Tip: "), h("span", { class: "muted" }, "To permanently change how the professor teaches (e.g. 'always relate things to robotics', 'more proofs'), write it in "), h("a", { href: "#/settings" }, "Settings → Professor notes"), h("span", { class: "muted" }, " — it is included in every lesson, chat and grading prompt.")),
      list);
    load();
  };

  // ------------------------------------------------------------------ settings
  V.settings = async function (root) {
    App.setCrumbs([{ label: "Settings" }]);
    const data = await api("/settings");
    const s = data.settings, p = s.preferences || {};
    const name = h("input", { class: "input", value: s.learner_name || "" });
    const key = h("input", { class: "input", type: "password", placeholder: s.has_key ? "•••••••• (saved in Self-Taught settings)" : (data.llm.configured ? `Using key from ${data.llm.key_source} — paste one here to override` : "Paste your Gemini API key (AIza… / AQ.…)") });
    const model = h("select", { class: "input" }, h("option", { value: "auto" }, "Auto (smart fallback chain — recommended)"), data.models.map((m) => h("option", { value: m, selected: s.model === m }, m)));
    const notes = h("textarea", { class: "input", style: "min-height:120px", placeholder: "Standing instructions for the professor, e.g. 'I am a software engineer; use code analogies. Always include a historical aside. Push me hard on proofs.'" }, s.professor_notes || "");
    const sel = (k, opts) => h("select", { class: "input", dataset: { pref: k } }, opts.map(([v, l]) => h("option", { value: v, selected: (p[k] || "") === v }, l)));
    const depth = sel("depth", [["concise", "Concise · ~1500 words"], ["standard", "Standard · ~2500 words"], ["deep", "Deep · 3000–4500 words (max content)"]]);
    const tone = sel("tone", [["playful", "Playful & witty"], ["professional", "Professional"], ["socratic", "Socratic"]]);
    const rigor = sel("rigor", [["intuitive", "Intuitive first"], ["balanced", "Balanced"], ["rigorous", "Rigorous · full proofs"]]);
    const examples = sel("examples", [["mixed", "Mixed"], ["real_world", "Real-world & engineering"], ["code", "Computational / code"], ["historical", "Historical"]]);
    const humor = sel("humor", [["none", "None"], ["some", "Some"], ["lots", "Lots"]]);
    const goal = h("input", { class: "input", type: "number", min: 50, max: 2000, step: 10, value: p.daily_goal_xp || 150 });
    const llmStatus = h("div", { class: "small mt8" });
    function renderLlm(st) {
      llmStatus.innerHTML = "";
      llmStatus.append(h("span", { class: "pill " + (st.configured ? "ok" : "bad") }, st.configured ? `Key active (${st.key_source}) ${st.key_hint}` : "No key"), " ",
        h("span", { class: "pill" }, `pref: ${st.model_pref}`), " ",
        Object.keys(st.cooling_down || {}).length ? h("span", { class: "pill warn" }, `cooling: ${Object.keys(st.cooling_down).join(", ")}`) : null);
    }
    renderLlm(data.llm);
    const testBtn = h("button", { class: "btn sm secondary", onclick: async () => { testBtn.disabled = true; testBtn.textContent = "Testing…"; const r = await api("/settings/test_llm", { method: "POST", body: {} }); testBtn.disabled = false; testBtn.textContent = "Test connection"; App.toast(r.ok ? `✅ ${r.model} replied in ${r.latency_s}s` : `❌ ${r.message}`, r.ok ? "xp" : "err", 5000); } }, "Test connection");
    const prefetch = h("input", { type: "checkbox", checked: String(s.prefetch_next ?? "1") !== "0" && s.prefetch_next !== false });
    const enforcePre = h("input", { type: "checkbox", checked: s.enforce_prereqs !== false });

    // ---- Professor Voice Studio
    const voices = data.voices || (App.TTS ? App.TTS.personas() : []);
    let chosenVoice = (voices.find((v) => v.id === s.voice_persona) ? s.voice_persona : "claire_evans");
    let genderFilter = "all"; // "all" | "female" | "male"
    const voiceEngine = h("select", { class: "input" }, [
      ["neural", "🎙️ Human Neural Studio — Azure DragonHD & Multilingual Natural Voices (Recommended)"],
      ["gemini_studio", "✨ Gemini 2.5 Neural Studio (Expressive AI + Azure Neural Fallback)"],
      ["browser", "💻 Local Browser Speech Synthesis (Offline)"],
    ].map(([v, l]) => h("option", { value: v, selected: ((s.voice_engine === "gemini" || s.voice_engine === "cloud" || !s.voice_engine) ? "neural" : s.voice_engine) === v }, l)));
    const voiceSpeed = h("select", { class: "input" }, [0.9, 1.0, 1.1, 1.25, 1.5].map((r) => h("option", { value: r, selected: Math.abs(r - Number(s.voice_speed || 1.0)) < 0.03 }, `${r}× reading speed`)));

    const filterBar = h("div", { class: "row wrap", style: "gap:6px" });
    const voiceGrid = h("div", { class: "grid c2 mt8", style: "gap:10px" });
    function renderVoiceCards() {
      filterBar.innerHTML = "";
      [
        ["all", `All Faculty (${voices.length})`],
        ["female", `Female Lecturers (${voices.filter((v) => v.gender === "female").length})`],
        ["male", `Male Lecturers (${voices.filter((v) => v.gender === "male").length})`],
      ].forEach(([gf, label]) => {
        filterBar.append(h("button", {
          class: "btn sm " + (genderFilter === gf ? "violet" : "ghost"),
          onclick: () => { genderFilter = gf; renderVoiceCards(); },
        }, label));
      });
      voiceGrid.innerHTML = "";
      voices.filter((v) => genderFilter === "all" || v.gender === genderFilter).forEach((v) => {
        const active = v.id === chosenVoice;
        const card = h("div", {
          class: "card",
          style: `padding:12px;cursor:pointer;border-color:${active ? "#e879f9" : "rgba(255,255,255,.08)"};background:${active ? "rgba(232,121,249,.10)" : ""}`,
          onclick: () => { chosenVoice = v.id; renderVoiceCards(); if (App.TTS) App.TTS.saveVoicePrefs({ voice_persona: v.id }); },
        },
          h("div", { class: "row between wrap", style: "gap:6px" },
            h("b", null, v.name),
            h("span", { class: "pill " + (active ? "ok" : "primary") }, active ? `✓ ${v.style_badge}` : v.style_badge)),
          h("div", { class: "small muted mt4" }, v.Tagline),
          h("div", { class: "tiny dim mt8", style: "font-style:italic" }, `“${v.sample_text}”`),
          h("div", { class: "row mt8", style: "gap:8px" },
            h("button", {
              class: "btn sm secondary",
              onclick: (e) => { e.stopPropagation(); if (App.TTS) App.TTS.audition(v.id); },
            }, "🔊 Audition Voice"),
            active ? h("span", { class: "tiny ok", style: "align-self:center" }, "Active Lecturer") : null));
        voiceGrid.append(card);
      });
    }
    renderVoiceCards();

    // ---- #2 Import / restore a JSON export
    const fileIn = h("input", { type: "file", accept: "application/json,.json", class: "input" });
    const modeSel = h("select", { class: "input" },
      h("option", { value: "merge" }, "Merge — add missing records, keep current data"),
      h("option", { value: "replace" }, "Replace — wipe current progress, restore the file exactly"));
    const importOut = h("div", { class: "tiny muted" });
    const importBtn = h("button", {
      class: "btn sm warn",
      onclick: async () => {
        const f = fileIn.files && fileIn.files[0];
        if (!f) return App.toast("Choose an export .json file first.", "warn");
        const mode = modeSel.value;
        if (mode === "replace") {
          const v = prompt("REPLACE mode wipes your current XP, progress, notes and chats and restores the file. A safety backup is saved first. Type RESTORE to confirm.");
          if (v !== "RESTORE") return;
        }
        importBtn.disabled = true; importOut.textContent = "Importing…";
        try {
          const fd = new FormData(); fd.append("file", f);
          const res = await fetch(`/api/import?mode=${mode}${mode === "replace" ? "&confirm=RESTORE" : ""}`, { method: "POST", body: fd });
          const r = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(r.error || res.statusText);
          const counts = r.counts || {};
          const total = Object.values(counts).reduce((a, b) => a + (Number(b) || 0), 0);
          importOut.textContent = `✅ Imported ${total} records (${Object.entries(counts).filter(([, n]) => n).map(([k, n]) => `${k}: ${n}`).join(", ") || "nothing new"}).` + (r.safety_backup ? ` Safety backup: ${r.safety_backup}` : "");
          App.toast("Import complete — reloading…", "info");
          setTimeout(() => location.reload(), 2500);
        } catch (e) {
          importOut.textContent = "❌ " + e.message;
        } finally { importBtn.disabled = false; }
      },
    }, "⬆ Import / Restore");
    const importBox = h("div", { class: "col", style: "gap:6px;border-top:1px solid var(--line);padding-top:10px" },
      h("b", { class: "small" }, "Restore from an export"), fileIn, modeSel, h("div", { class: "row" }, importBtn), importOut);

    // ---- #30 Audio (TTS) cache management
    const cacheInfo = h("div", { class: "small muted" }, "Loading…");
    const cacheBar = h("div", { class: "progress" }, h("i", { style: "width:0%" }));
    const capIn = h("input", { class: "input", type: "number", min: 20, max: 20000, step: 50, style: "max-width:120px" });
    function showCache(st) {
      const mb = Number(st.mb || 0), max = Number(st.max_mb || 500);
      cacheInfo.textContent = `${mb} MB used by ${st.files || 0} cached audio files (cap ${max} MB). Least-recently-played files are evicted automatically.`;
      cacheBar.firstChild.style.width = Math.min(100, Math.round((mb / Math.max(1, max)) * 100)) + "%";
      capIn.value = max;
    }
    api("/tts/cache").then(showCache).catch(() => { cacheInfo.textContent = "Audio cache info unavailable."; });
    const ttsCacheBox = h("div", { class: "card col", style: "gap:10px" },
      h("b", null, "🔊 Audio cache"), cacheInfo, cacheBar,
      h("div", { class: "row wrap", style: "gap:8px;align-items:center" },
        h("span", { class: "small" }, "Max size (MB)"), capIn,
        h("button", { class: "btn sm secondary", onclick: async () => { const r = await api("/tts/cache", { body: { max_mb: Number(capIn.value) || 500 } }); showCache(await api("/tts/cache")); App.toast(r.removed ? `Cap saved — evicted ${r.removed} files.` : "Cap saved.", "info"); } }, "Apply cap"),
        h("button", { class: "btn sm danger", onclick: async () => { if (!confirm("Delete all cached lecture audio? It will be re-synthesized on demand.")) return; await api("/tts/cache", { method: "DELETE" }); showCache(await api("/tts/cache")); App.toast("Audio cache cleared.", "info"); } }, "🗑 Clear audio cache")));

    async function save() {
      const body = {
        learner_name: name.value.trim() || "Scholar",
        model: model.value,
        professor_notes: notes.value,
        prefetch_next: prefetch.checked,
        enforce_prereqs: enforcePre.checked,
        voice_persona: chosenVoice,
        voice_engine: voiceEngine.value,
        voice_speed: Number(voiceSpeed.value) || 1.0,
        preferences: { depth: depth.value, tone: tone.value, rigor: rigor.value, examples: examples.value, humor: humor.value, daily_goal_xp: Number(goal.value) || 150 },
      };
      if (key.value.trim()) body.gemini_api_key = key.value.trim();
      const r = await api("/settings", { body });
      App.state.settings = r.settings; renderLlm(r.llm); key.value = ""; key.placeholder = r.settings.has_key ? "•••••••• (saved)" : key.placeholder;
      App.toast("Settings saved", "info");
      const sum = await api("/dashboard"); App.state.summary = sum.summary; App.renderSidebar();
    }
    root.append(h("h1", { class: "page" }, "Settings"), h("p", { class: "lead" }, "Tune the professor, audition female and male faculty lecturer voices, set your goals, and manage the Gemini connection."),
      h("div", { class: "card col mb16", style: "gap:12px;border-color:rgba(232,121,249,.35)" },
        h("div", { class: "row between wrap" },
          h("div", null, h("b", null, "🎙️ Professor Voice & Persona Studio"), h("div", { class: "small muted" }, "Pick the faculty voice (8 Female & 8 Male lecturers) that reads lectures, examples, and office-hours replies aloud to you.")),
          h("div", { class: "row wrap", style: "gap:8px" }, filterBar, h("button", { class: "btn sm ghost", onclick: () => App.TTS && App.TTS.stop() }, "⏹ Stop Audio"))),
        h("div", { class: "grid c2" },
          h("label", { class: "field" }, "Voice synthesis engine", voiceEngine),
          h("label", { class: "field" }, "Lecturer pacing", voiceSpeed)),
        voiceGrid),
      h("div", { class: "grid c2" },
        h("div", { class: "card col", style: "gap:12px" }, h("b", null, "👤 Learner"), h("label", { class: "field" }, "Name", name), h("label", { class: "field" }, "Daily XP goal", goal),
          h("b", { class: "mt8" }, "🧑‍🏫 Professor style"), h("label", { class: "field" }, "Lesson depth", depth), h("label", { class: "field" }, "Tone", tone), h("label", { class: "field" }, "Rigor", rigor), h("label", { class: "field" }, "Example style", examples), h("label", { class: "field" }, "Humor", humor),
          h("label", { class: "field" }, "Professor notes (standing instructions)", notes)),
        h("div", { class: "col", style: "gap:16px" },
          h("div", { class: "card col", style: "gap:12px" }, h("b", null, "🔑 Gemini connection"), h("label", { class: "field" }, "API key", key), h("label", { class: "field" }, "Preferred model", model), h("div", { class: "row" }, testBtn), llmStatus,
            h("label", { class: "row", style: "gap:8px;align-items:center;cursor:pointer" }, prefetch, h("span", { class: "small" }, "Prepare the next lesson in the background while I study (uses extra tokens, removes most waiting)")),
            h("label", { class: "row", style: "gap:8px;align-items:center;cursor:pointer" }, enforcePre, h("span", { class: "small" }, "Lock courses until their prerequisites are finished or tested out (you can still unlock any course individually)")),
            h("div", { class: "tiny muted" }, "Auto mode tries the newest flash model first and silently falls back when a model is busy (503) or quota-limited (429). Lessons are cached once generated, so they only cost tokens once.")),
          h("div", { class: "card col", style: "gap:10px" }, h("b", null, "💾 Data"), h("div", { class: "row wrap" }, h("a", { class: "btn sm secondary", href: "/api/export", download: "self_taught_export.json" }, "Export progress (JSON)"),
            h("button", { class: "btn sm danger", onclick: async () => { const v = prompt("This wipes XP, badges, progress, cached lessons and chats (settings stay). Type RESET to confirm."); if (v === "RESET") { await api("/reset", { body: { confirm: "RESET" } }); location.reload(); } } }, "Reset all progress")),
            importBox,
            h("div", { class: "tiny muted" }, "Database: self_taught/data/self_taught.db")),
          ttsCacheBox,
          h("div", { class: "card" }, h("b", null, "ℹ️ About"), h("div", { class: "small muted mt8" }, "Self-Taught generates each lesson live with Gemini from a hand-built university catalog, grades your work, tutors you in office hours, and keeps a transcript. Content is cached locally; feedback regenerates lessons with your notes applied.")))),
      h("div", { class: "sticky-actions" }, h("button", { class: "btn lg", onclick: save }, "Save settings")));
  };

  // ------------------------------------------------------------------ onboarding
  V.onboarding = function () {
    const name = h("input", { class: "input", placeholder: "What should the professor call you?" });
    const tone = h("select", { class: "input" }, h("option", { value: "playful" }, "Playful & witty"), h("option", { value: "professional" }, "Professional"), h("option", { value: "socratic" }, "Socratic"));
    const depth = h("select", { class: "input" }, h("option", { value: "deep", selected: true }, "Deep — maximum content"), h("option", { value: "standard" }, "Standard"), h("option", { value: "concise" }, "Concise"));
    const m = App.modal([
      h("div", { style: "font-size:44px;text-align:center" }, "🦉"), h("h2", { class: "center", style: "margin:4px 0" }, "Welcome to Self-Taught"),
      h("p", { class: "muted center" }, "Your personal university: six faculties, thousands of lessons, an AI professor who teaches, grades and tutors you — and XP, ranks and badges to make the climb from Freshman to Master's a game."),
      h("div", { class: "col", style: "gap:10px" }, h("label", { class: "field" }, "Your name", name), h("div", { class: "grid c2" }, h("label", { class: "field" }, "Professor tone", tone), h("label", { class: "field" }, "Lesson depth", depth))),
      h("div", { class: "row between mt16" }, h("a", { class: "small muted", href: "#/settings", onclick: () => m.close() }, "More settings →"),
        h("button", { class: "btn", onclick: async () => { await api("/settings", { body: { learner_name: name.value.trim() || "Scholar", onboarded: true, preferences: { tone: tone.value, depth: depth.value } } }); App.state.settings.onboarded = true; m.close(); const d = await api("/dashboard"); App.state.summary = d.summary; App.renderSidebar(); App.navigate("#/catalog"); } }, "Enroll me 🎓")),
    ], { sticky: true });
  };

  V.notfound = async function (root) { root.append(h("div", { class: "empty" }, "Page not found. ", h("a", { href: "#/" }, "Go home"))); };
})();
