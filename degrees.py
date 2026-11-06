"""Degree Paths — pre-built, prerequisite-aware degree programs (v2).

Every program is generated automatically from the curriculum, so new or custom faculties get
programs with no hand-curation.

Program kinds
-------------
* bachelor           B.S./B.A. — General Education core + every faculty course at 100-300 (required)
                     + Senior (400) courses as electives (all selected by default; minimum 60%).
* master             M.S./M.A. — the Bachelor's + graduate (500-600) courses as electives (minimum 60%).
* phd_prep           Master's + core graduate courses from the closest related faculty + a Qualifying Exam.
* interdisciplinary  Double-major Bachelor's: both faculties' Bachelor's coursework + General Education.
* minor              The 6 most foundational courses of a faculty (+ prerequisites). Can be standalone or
                     added on top of any degree when enrolling.

Every requested course is expanded with its transitive prerequisites from ANY faculty, topologically
ordered, and grouped into academic years by "effective level" (never before something it depends on).

Graduation requirements (degree audit): required coursework, elective minimums, credits, a
comprehensive (or qualifying) exam, and a degree capstone. Courses count as complete when every
lesson is finished OR credit was earned by examination (Exam Hall test-out).
"""
from __future__ import annotations

import heapq
import math

import curriculum

# --------------------------------------------------------------------------- configuration
_ARTS_DOMAINS = {"philosophy", "languages", "jurisprudence", "geopolitics", "writing"}

# General Education core required by every Bachelor's (skipped automatically if a course doesn't exist).
GEN_ED = [
    ("wrt_101", "Writing"),
    ("wrt_210", "Writing"),
    ("wrt_220", "Oral Communication"),
    ("phil_logic_101", "Critical Thinking"),
    ("phil_ethics_130", "Ethics"),
    ("cs_101", "Computing"),
    ("stat_101", "Quantitative Reasoning"),
    ("biol_101", "Natural Science"),
    ("econ_101", "Social Science"),
]

YEAR_DEFS = {
    100: {"title": "Year 1 · Freshman", "subtitle": "General Education, foundations and first principles"},
    200: {"title": "Year 2 · Sophomore", "subtitle": "Core theory and analytical tools"},
    300: {"title": "Year 3 · Junior", "subtitle": "Upper-division depth and applied methods"},
    400: {"title": "Year 4 · Senior", "subtitle": "Senior electives, synthesis and capstone"},
    500: {"title": "Graduate Year 1", "subtitle": "Graduate seminars and research-level theory"},
    600: {"title": "Graduate Year 2 · Master's Frontier", "subtitle": "Frontier topics, integration and qualifying mastery"},
}

INTERDISCIPLINARY = [
    ("physics", "math", "⚛️➗", "Mathematical Physics"),
    ("ai", "robotics", "🤖🦾", "AI & Robotics Engineering"),
    ("physics", "quantum_computing", "⚛️💠", "Quantum Science & Engineering"),
    ("chemistry", "materials", "🧪🧱", "Chemistry & Materials Science"),
    ("neuroscience", "ai", "🧠🤖", "Computational Neuroscience & AI"),
    ("cybersecurity", "rf_sdr", "🛡️📡", "Cyber & Signals Intelligence"),
    ("aerospace", "physics", "🚀⚛️", "Aerospace Physics"),
    ("philosophy", "jurisprudence", "🏛️⚖️", "Philosophy, Politics & Law"),
    ("game_theory", "geopolitics", "♟️🌍", "Strategy & Global Affairs"),
    ("synbio", "chemistry", "🧬🧪", "Biochemical Engineering"),
    ("computer_science", "math", "💻➗", "Computer Science & Mathematics"),
    ("computer_science", "ai", "💻🤖", "Computer Science & Artificial Intelligence"),
    ("biology", "chemistry", "🧫🧪", "Biochemistry & Molecular Biology"),
    ("biology", "neuroscience", "🧫🧠", "Neurobiology"),
    ("economics", "statistics", "📈📊", "Econometrics & Data Science"),
    ("economics", "game_theory", "📈♟️", "Economics & Strategic Decision-Making"),
    ("statistics", "ai", "📊🤖", "Statistical Machine Learning"),
    ("philosophy", "economics", "🏛️📈", "Philosophy, Politics & Economics (PPE)"),
    ("psychology", "neuroscience", "🧠🧬", "Cognitive Neuroscience"),
    ("psychology", "ai", "🧠🤖", "Cognitive Science & Artificial Intelligence"),
    ("psychology", "statistics", "🧠📊", "Quantitative Psychology & Psychometrics"),
    ("psychology", "economics", "🧠📈", "Behavioral Economics & Decision Science"),
    ("psychology", "philosophy", "🧠🏛️", "Philosophy of Mind & Psychology"),
]

# Preferred partner faculty for PhD-prep (falls back to the strongest supporting faculty).
RELATED = {
    "math": "physics", "physics": "math", "chemistry": "physics", "ai": "statistics", "robotics": "ai",
    "philosophy": "math", "languages": "writing", "jurisprudence": "philosophy", "geopolitics": "economics",
    "game_theory": "economics", "economics": "statistics", "statistics": "math", "computer_science": "math",
    "biology": "chemistry", "neuroscience": "biology", "synbio": "biology", "quantum_computing": "physics",
    "aerospace": "physics", "materials": "chemistry", "rf_sdr": "physics", "cybersecurity": "computer_science",
    "systems": "computer_science", "complex_systems": "math", "writing": "philosophy",
    "psychology": "statistics",
}

ELECTIVE_MIN_FRACTION = 0.6
MINOR_SIZE = 6
PHD_EXTRA = 4
FULL_BACHELOR_CREDITS = 100   # below this a "Bachelor's" is flagged as a concentrated program
FULL_MASTER_GRAD_CREDITS = 30
EXAM_PASS = 0.70
QUAL_PASS = 0.80
CAPSTONE_PASS = 0.70


# --------------------------------------------------------------------------- graph helpers
def _year_of(level: int) -> int:
    lvl = int(level or 100)
    return lvl if lvl in YEAR_DEFS else min(YEAR_DEFS, key=lambda k: abs(k - lvl))


def _domain_courses(domain_id: str, levels: set[int] | None = None) -> list[str]:
    d = curriculum.get_domain(domain_id)
    if not d:
        return []
    return [c["id"] for s in d.get("subjects") or [] for c in s.get("courses") or []
            if levels is None or _year_of(c.get("level")) in levels]


def _closure(target_ids) -> set[str]:
    all_courses = curriculum.courses()
    out: set[str] = set()
    stack = [t for t in target_ids if t in all_courses]
    while stack:
        cid = stack.pop()
        if cid in out:
            continue
        out.add(cid)
        stack.extend(p for p in all_courses[cid].get("prerequisites") or [] if p in all_courses and p not in out)
    return out


def _centrality(domain_id: str, max_level: int = 300) -> list[str]:
    """Faculty courses (<= max_level) ranked by how many faculty courses transitively depend on them."""
    all_courses = curriculum.courses()
    dom_ids = _domain_courses(domain_id)
    dependents: dict[str, set[str]] = {cid: set() for cid in dom_ids}
    for cid in dom_ids:
        for anc in _closure([cid]) - {cid}:
            if anc in dependents:
                dependents[anc].add(cid)
    ranked = [cid for cid in dom_ids if int(all_courses[cid].get("level") or 100) <= max_level]
    ranked.sort(key=lambda c: (-len(dependents[c]), int(all_courses[c].get("level") or 100), all_courses[c].get("code") or c))
    return ranked


def _order(course_ids: set[str], major_domains: list[str]) -> list[tuple[str, int]]:
    """Topological study order; returns [(course_id, year)]."""
    all_courses = curriculum.courses()
    prereqs = {cid: [p for p in all_courses[cid].get("prerequisites") or [] if p in course_ids] for cid in course_ids}
    eff: dict[str, int] = {}

    def effective(cid: str, trail: frozenset = frozenset()) -> int:
        if cid in eff:
            return eff[cid]
        own = _year_of(all_courses[cid].get("level") or 100)
        if cid in trail:
            return own
        val = max([own] + [effective(p, trail | {cid}) for p in prereqs[cid]])
        eff[cid] = val
        return val

    for cid in course_ids:
        effective(cid)

    def prio(cid: str) -> tuple:
        c = all_courses[cid]
        return (eff[cid], 1 if c.get("domain_id") in major_domains else 0, int(c.get("level") or 100), c.get("code") or cid)

    indeg = {cid: len(ps) for cid, ps in prereqs.items()}
    children: dict[str, list[str]] = {cid: [] for cid in course_ids}
    for cid, ps in prereqs.items():
        for p in ps:
            children[p].append(cid)
    heap = [(prio(cid), cid) for cid, n in indeg.items() if n == 0]
    heapq.heapify(heap)
    order: list[str] = []
    while heap:
        _, cid = heapq.heappop(heap)
        order.append(cid)
        for ch in children[cid]:
            indeg[ch] -= 1
            if indeg[ch] == 0:
                heapq.heappush(heap, (prio(ch), ch))
    seen = set(order)
    order.extend(sorted((c for c in course_ids if c not in seen), key=prio))  # only with prerequisite cycles
    return [(cid, eff[cid]) for cid in order]


# --------------------------------------------------------------------------- program specs
def _specs() -> list[dict]:
    specs: list[dict] = []
    doms = {d["id"]: d for d in curriculum.domains()}
    for did, d in doms.items():
        arts = did in _ARTS_DOMAINS
        levels = {_year_of(c.get("level")) for s in d.get("subjects") or [] for c in s.get("courses") or []}
        has_grad = bool(levels & {500, 600})
        icon, color, name = d.get("icon") or "🎓", d.get("color") or "#7c9cff", d["name"]
        b_abbr, m_abbr = ("B.A.", "M.A.") if arts else ("B.S.", "M.S.")
        bachelor = {
            "id": f"bachelor_{did}", "kind": "bachelor", "level_label": "Bachelor's", "abbr": b_abbr,
            "title": f"{b_abbr} in {name}", "icon": icon, "color": color, "domains": [did],
            "required_levels": {100, 200, 300}, "elective_groups": [{"name": f"{name} Senior Electives", "domain": did, "levels": {400}}],
            "gen_ed": True, "extra": [], "builds_on": None,
            "exam": {"title": "Comprehensive Examination", "pass": EXAM_PASS},
            "capstone": {"title": "Senior Capstone Project"},
            "summary": f"General Education + every {name} course from Freshman to Junior level, Senior electives, and all prerequisites from other faculties.",
        }
        specs.append(bachelor)
        if has_grad:
            master = {
                **bachelor, "id": f"master_{did}", "kind": "master", "level_label": "Master's", "abbr": m_abbr,
                "title": f"{m_abbr} in {name}", "builds_on": bachelor["id"],
                "elective_groups": bachelor["elective_groups"] + [{"name": f"{name} Graduate Electives", "domain": did, "levels": {500, 600}}],
                "exam": {"title": "Master's Comprehensive Examination", "pass": EXAM_PASS},
                "capstone": {"title": "Master's Thesis Project"},
                "summary": f"The full {name} Bachelor's plus graduate electives, with every prerequisite included.",
            }
            specs.append(master)
            partner = RELATED.get(did)
            specs.append({
                **master, "id": f"phd_{did}", "kind": "phd_prep", "level_label": "PhD-Prep", "abbr": "PhD-Prep",
                "title": f"PhD-Prep in {name}", "builds_on": master["id"], "partner": partner,
                "exam": {"title": "Doctoral Qualifying Examination", "pass": QUAL_PASS},
                "capstone": {"title": "Research Prospectus"},
                "summary": f"The {name} Master's plus core graduate courses from a related faculty, a doctoral qualifying exam and a research prospectus.",
            })
        specs.append({
            "id": f"minor_{did}", "kind": "minor", "level_label": "Minor", "abbr": "Minor",
            "title": f"Minor in {name}", "icon": icon, "color": color, "domains": [did],
            "minor_core": True, "required_levels": set(), "elective_groups": [], "gen_ed": False, "extra": [],
            "builds_on": None, "exam": None, "capstone": None,
            "summary": f"The {MINOR_SIZE} most foundational {name} courses plus their prerequisites. Take it alone or add it to a degree.",
        })
    for a, b, icon, name in INTERDISCIPLINARY:
        if a in doms and b in doms:
            abbr = "B.A." if {a, b} <= _ARTS_DOMAINS else "B.S."
            specs.append({
                "id": f"inter_{a}__{b}", "kind": "interdisciplinary", "level_label": "Interdisciplinary Bachelor's",
                "abbr": abbr, "title": f"{abbr} in {name}", "icon": icon, "color": doms[a].get("color") or "#7c9cff",
                "domains": [a, b], "required_levels": {100, 200, 300},
                "elective_groups": [{"name": f"{doms[x]['name']} Senior Electives", "domain": x, "levels": {400}} for x in (a, b)],
                "gen_ed": True, "extra": [], "builds_on": None,
                "exam": {"title": "Comprehensive Examination", "pass": EXAM_PASS},
                "capstone": {"title": "Interdisciplinary Senior Capstone"},
                "summary": f"Double major: {doms[a]['name']} and {doms[b]['name']} Bachelor's coursework, General Education and every prerequisite.",
            })
    return specs


def _spec(degree_id: str) -> dict | None:
    return next((s for s in _specs() if s["id"] == degree_id), None)


def _phd_extra(spec: dict, supporting: dict[str, int]) -> list[str]:
    all_courses = curriculum.courses()
    partner = spec.get("partner")
    if not partner or not curriculum.get_domain(partner):
        partner = max(supporting, key=supporting.get) if supporting else None
    if not partner:
        return []
    spec["partner"] = partner
    grads = [cid for cid in _centrality(partner, max_level=600) if int(all_courses[cid].get("level") or 100) >= 500]
    return grads[:PHD_EXTRA]


# --------------------------------------------------------------------------- building
def _course_done(c: dict, progress: dict, credits: dict) -> tuple[int, int, bool, bool]:
    lids = [lid for m in c.get("modules") or [] for lid in (m.get("lesson_ids") or [])]
    done = sum(1 for lid in lids if (progress.get(lid) or {}).get("completed_at"))
    by_exam = c["id"] in credits
    return done, len(lids), by_exam or (bool(lids) and done == len(lids)), by_exam


def _build(spec: dict, progress: dict | None = None, credits: dict | None = None, records: dict | None = None,
           selected_electives: list[str] | None = None, minor_id: str | None = None) -> dict:
    all_courses = curriculum.courses()
    progress, credits, records = progress or {}, credits or {}, records or {}
    spec = dict(spec)

    required: list[str] = []
    for did in spec["domains"]:
        if spec.get("minor_core"):
            required += _centrality(did)[:MINOR_SIZE]
        else:
            required += _domain_courses(did, spec["required_levels"])
    elective_of: dict[str, int] = {}
    for gi, g in enumerate(spec["elective_groups"]):
        for cid in _domain_courses(g["domain"], g["levels"]):
            elective_of.setdefault(cid, gi)
    gen_ed = [cid for cid, _ in GEN_ED if cid in all_courses] if spec.get("gen_ed") else []
    gen_ed_area = {cid: area for cid, area in GEN_ED}

    if selected_electives is None:
        chosen = set(elective_of)
    else:
        chosen = {c for c in selected_electives if c in elective_of}

    extra: list[str] = []
    if spec["kind"] == "phd_prep":
        base = _closure(required + list(elective_of) + gen_ed)
        sup: dict[str, int] = {}
        for cid in base:
            dd = all_courses[cid].get("domain_id")
            if dd not in spec["domains"] and cid not in gen_ed:
                sup[dd] = sup.get(dd, 0) + 1
        extra = _phd_extra(spec, sup)

    minor_spec = _spec(minor_id) if minor_id else None
    minor_core = []
    if minor_spec and minor_spec["kind"] == "minor" and minor_spec["domains"][0] not in spec["domains"]:
        minor_core = _centrality(minor_spec["domains"][0])[:MINOR_SIZE]
    else:
        minor_spec = None

    ids = _closure(required + list(chosen) + gen_ed + extra + minor_core)
    ordered = _order(ids, spec["domains"])
    gen_set, extra_set, minor_set = set(gen_ed), set(extra), set(minor_core)

    courses: list[dict] = []
    years: dict[int, dict] = {}
    for cid, year in ordered:
        c = all_courses[cid]
        ctx = curriculum.get_course(cid) or {}
        dom = ctx.get("domain") or {}
        done, total, completed, by_exam = _course_done(c, progress, credits)
        if cid in elective_of:
            role = "elective"
        elif c.get("domain_id") in spec["domains"]:
            role = "major"
        elif cid in gen_set:
            role = "gen_ed"
        elif cid in extra_set:
            role = "research"
        elif cid in minor_set:
            role = "minor"
        else:
            role = "supporting"
        entry = {
            "id": cid, "code": c.get("code") or cid, "title": c.get("title") or cid,
            "level": int(c.get("level") or 100), "credits": int(c.get("credits") or 3),
            "description": c.get("description") or "", "domain_id": c.get("domain_id"),
            "domain_name": dom.get("name") or c.get("domain_id"), "domain_icon": dom.get("icon") or "🎓",
            "domain_color": dom.get("color") or "#7c9cff", "role": role, "year": year,
            "gen_ed_area": gen_ed_area.get(cid) if role == "gen_ed" else None,
            "elective_group": elective_of.get(cid), "prerequisites": [p for p in c.get("prerequisites") or [] if p in ids],
            "lesson_count": total, "lessons_done": done, "completed": completed, "credit_by_exam": by_exam,
        }
        courses.append(entry)
        y = years.setdefault(year, {"year": year, **YEAR_DEFS[year], "courses": [], "credits": 0, "lessons": 0, "lessons_done": 0})
        y["courses"].append(entry)
        y["credits"] += entry["credits"]
        y["lessons"] += total
        y["lessons_done"] += total if by_exam else done

    # Electives not chosen (offered in the picker)
    available = []
    for cid, gi in elective_of.items():
        if cid not in ids:
            c = all_courses[cid]
            available.append({"id": cid, "code": c.get("code"), "title": c.get("title"), "credits": int(c.get("credits") or 3),
                              "level": int(c.get("level") or 100), "elective_group": gi})

    # ---------------------------------------------------------------- stats
    by_role: dict[str, int] = {}
    supporting_domains: dict[str, int] = {}
    for c in courses:
        by_role[c["role"]] = by_role.get(c["role"], 0) + 1
        if c["role"] == "supporting":
            supporting_domains[c["domain_name"]] = supporting_domains.get(c["domain_name"], 0) + 1
    lessons = sum(c["lesson_count"] for c in courses)
    lessons_done = sum(c["lesson_count"] if c["credit_by_exam"] else c["lessons_done"] for c in courses)
    credits_total = sum(c["credits"] for c in courses)
    credits_earned = sum(c["credits"] for c in courses if c["completed"])

    # ---------------------------------------------------------------- requirements (degree audit)
    groups = []
    for gi, g in enumerate(spec["elective_groups"]):
        offered = [cid for cid, x in elective_of.items() if x == gi]
        if not offered:
            continue
        need = max(1, math.ceil(len(offered) * ELECTIVE_MIN_FRACTION))
        groups.append({"index": gi, "name": g["name"], "offered": len(offered), "min": need})
    non_elective = [c for c in courses if c["role"] != "elective"]
    elective_courses = [c for c in courses if c["role"] == "elective"]
    avg_el = (sum(c["credits"] for c in elective_courses) / len(elective_courses)) if elective_courses else 4
    credits_required = sum(c["credits"] for c in non_elective) + int(round(sum(g["min"] for g in groups) * avg_el))

    reqs = []
    req_done = sum(1 for c in non_elective if c["completed"])
    reqs.append({"id": "required", "label": "Required coursework (major, General Education & prerequisites)",
                 "progress": f"{req_done}/{len(non_elective)} courses", "met": req_done == len(non_elective)})
    for g in groups:
        sel = [c for c in elective_courses if c["elective_group"] == g["index"]]
        done_n = sum(1 for c in sel if c["completed"])
        reqs.append({"id": f"electives_{g['index']}", "label": f"{g['name']}: complete at least {g['min']} of {g['offered']}",
                     "progress": f"{done_n}/{g['min']} completed · {len(sel)} selected", "met": done_n >= g["min"],
                     "warning": None if len(sel) >= g["min"] else f"Select at least {g['min']} electives in this group."})
    reqs.append({"id": "credits", "label": f"Earn at least {credits_required} credits",
                 "progress": f"{credits_earned}/{credits_required} credits", "met": credits_earned >= credits_required})
    if spec.get("exam"):
        best = records.get("exam_best")
        reqs.append({"id": "exam", "label": f"{spec['exam']['title']} (pass ≥ {int(spec['exam']['pass'] * 100)}%)",
                     "progress": f"best {round(best * 100)}%" if best is not None else "not attempted",
                     "met": best is not None and best >= spec["exam"]["pass"]})
    if spec.get("capstone"):
        best = records.get("capstone_best")
        reqs.append({"id": "capstone", "label": f"{spec['capstone']['title']} (pass ≥ {int(CAPSTONE_PASS * 100)}%)",
                     "progress": f"best {round(best * 100)}%" if best is not None else "not submitted",
                     "met": best is not None and best >= CAPSTONE_PASS})
    if minor_spec:
        reqs.append({"id": "minor", "label": f"{minor_spec['title']} coursework",
                     "progress": f"{sum(1 for c in courses if c['id'] in minor_set and c['completed'])}/{len(minor_set)} courses",
                     "met": all(c["completed"] for c in courses if c["id"] in minor_set)})

    note = None
    if spec["kind"] in ("bachelor", "interdisciplinary") and credits_required < FULL_BACHELOR_CREDITS:
        note = (f"Concentrated program: {credits_required} credits, below the ~120 credits of a typical full Bachelor's. "
                "Consider pairing it with a Minor.")
    if spec["kind"] == "master":
        grad = sum(c["credits"] for c in courses if c["level"] >= 500 and c["role"] == "elective")
        if grad < FULL_MASTER_GRAD_CREDITS:
            note = f"Compact Master's: {grad} graduate credits (typical programs require ~30)."

    spec.pop("required_levels", None)
    spec["elective_groups"] = [{**g, "levels": sorted(g["levels"])} for g in spec.get("elective_groups") or []]
    return {
        **spec,
        "minor": {"id": minor_spec["id"], "title": minor_spec["title"]} if minor_spec else None,
        "course_ids": [c["id"] for c in courses],
        "courses": courses,
        "years": [years[k] for k in sorted(years)],
        "available_electives": available,
        "elective_requirements": groups,
        "requirements": reqs,
        "ready_to_graduate": all(r["met"] for r in reqs),
        "conferred": records.get("conferred"),
        "credential_note": note,
        "stats": {
            "total_courses": len(courses), "major_courses": by_role.get("major", 0) + by_role.get("elective", 0),
            "elective_courses": by_role.get("elective", 0), "gen_ed_courses": by_role.get("gen_ed", 0),
            "supporting_courses": by_role.get("supporting", 0), "research_courses": by_role.get("research", 0),
            "minor_courses": by_role.get("minor", 0),
            "credits": credits_total, "credits_required": credits_required, "credits_earned": credits_earned,
            "lessons": lessons, "lessons_done": lessons_done, "pct": round(lessons_done / max(1, lessons), 3),
            "courses_done": sum(1 for c in courses if c["completed"]),
            "credit_by_exam": sum(1 for c in courses if c["credit_by_exam"]),
            "est_hours": round(sum(c["lesson_count"] * (25 if c["level"] <= 200 else 30 if c["level"] <= 400 else 35) for c in courses) / 60),
            "supporting_domains": supporting_domains,
        },
    }


# --------------------------------------------------------------------------- public API
def catalog(progress=None, credits=None, records_by_id=None) -> list[dict]:
    curriculum.ensure_loaded()
    records_by_id = records_by_id or {}
    out = []
    for spec in _specs():
        full = _build(spec, progress, credits, records_by_id.get(spec["id"]))
        out.append({k: v for k, v in full.items() if k not in ("courses", "years", "available_electives", "course_ids")}
                   | {"year_count": len(full["years"])})
    order = {"bachelor": 0, "master": 1, "phd_prep": 2, "interdisciplinary": 3, "minor": 4}
    out.sort(key=lambda d: (order.get(d["kind"], 9), d["title"]))
    return out


def get(degree_id: str, progress=None, credits=None, records=None, selected_electives=None, minor_id=None) -> dict | None:
    curriculum.ensure_loaded()
    spec = _spec(degree_id)
    return _build(spec, progress, credits, records, selected_electives, minor_id) if spec else None


def minors() -> list[dict]:
    return [{"id": s["id"], "title": s["title"], "domain": s["domains"][0]} for s in _specs() if s["kind"] == "minor"]


def phase_plan(degree: dict, skip_ids: set[str] | None = None) -> tuple[list[str], dict[str, int], list[dict]]:
    """Map a degree into (ordered course ids, course->phase index, phase defs) for the Super Aid track builder."""
    skip_ids = skip_ids or set()
    keep = [c for c in degree["courses"] if c["id"] not in skip_ids]
    year_keys = sorted({c["year"] for c in keep})
    idx_of = {yk: i + 1 for i, yk in enumerate(year_keys)}
    phase_defs = [{"index": idx_of[yk], "title": YEAR_DEFS[yk]["title"], "subtitle": YEAR_DEFS[yk]["subtitle"]} for yk in year_keys]
    return [c["id"] for c in keep], {c["id"]: idx_of[c["year"]] for c in keep}, phase_defs


def capstone_spec(degree: dict) -> dict:
    """A degree-specific capstone brief, graded by the existing capstone committee prompt."""
    senior = [c for c in degree["courses"] if c["role"] in ("major", "elective", "research")]
    senior.sort(key=lambda c: -c["level"])
    focus = [c["title"] for c in senior[:3]]
    doms = [curriculum.get_domain(d)["name"] for d in degree["domains"] if curriculum.get_domain(d)]
    title = (degree.get("capstone") or {}).get("title") or "Capstone Project"
    if degree["kind"] == "phd_prep":
        deliverables = [
            "A research question at the frontier of the field, with a literature review citing the key results it builds on",
            f"A methodology section drawing on: {'; '.join(focus) or 'your graduate coursework'}",
            "Preliminary results or a worked pilot analysis/derivation/simulation (code welcome)",
            "A 12-month research plan with risks and fallback directions",
        ]
    else:
        deliverables = [
            f"A substantive project that integrates material from: {'; '.join(focus) or 'your upper-division coursework'}",
            "A written report: problem statement, formal model or argument, methods, results and limitations",
            "Supporting code, derivations or primary-source analysis as appropriate to the field",
            "A 300-word executive summary written for a non-specialist audience",
        ]
    return {"id": f"degree:{degree['id']}", "title": f"{title}: {degree['title']}", "domains": doms,
            "summary": f"The culminating {title.lower()} for the {degree['title']}.", "deliverables": deliverables}


def exam_scope(degree: dict) -> dict:
    """Topics for the comprehensive/qualifying exam, sampled evenly across the major coursework."""
    all_courses = curriculum.courses()
    major = [c for c in degree["courses"] if c["role"] in ("major", "elective", "research")]
    topics: list[str] = []
    for c in major:
        for m in all_courses[c["id"]].get("modules") or []:
            topics.append(f"{c['code']}: {m.get('title')}")
    if len(topics) > 80:
        step = len(topics) / 80
        topics = [topics[int(i * step)] for i in range(80)]
    level = max((c["level"] for c in major), default=400)
    return {"title": f"{degree['title']} — {(degree.get('exam') or {}).get('title', 'Comprehensive Examination')}",
            "topics": topics, "level": level, "pass": (degree.get("exam") or {}).get("pass", EXAM_PASS)}
