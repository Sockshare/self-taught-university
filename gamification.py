"""Gamification: XP rules, academic rank ladder, streaks, badges and degree progress."""
from __future__ import annotations

import datetime as _dt
import math
import time
from typing import Any

import curriculum
import db

# --------------------------------------------------------------------------- XP rules
XP = {
    "lesson_open": 5,
    "checkpoint_correct": 12,
    "checkpoint_attempt": 3,
    "lecture_complete": 40,
    "homework_base": 100,          # × score
    "homework_perfect_bonus": 30,
    "sim_challenge_default": 10,
    "tutor_question": 3,           # capped per day
    "feedback": 8,
    "lab_run": 4,                  # capped per lesson
    "course_complete": 300,
    "course_credit_bonus": 60,     # × credits
    "domain_bachelor": 1500,
    "domain_master": 4000,
    "streak_daily": 10,            # × min(streak, 7)
    "design_course": 50,
    "viva_voce": 45,
    "feynman_teach": 50,
    "exam_base": 180,              # × score
    "fault_fixed": 35,
    "capstone_base": 250,          # × score
    "autopsy_drill": 30,
    "note_created": 8,
    "paper_ingested": 60,
    "lab_tests_pass": 40,          # once per lesson when all hidden lab tests pass (× level multiplier)
    "srs_review": 2,               # per flashcard review, capped per day
    "course_test_out": 150,        # + course_credit_bonus × credits when credit is earned by examination
}
TUTOR_DAILY_CAP = 15
LAB_PER_LESSON_CAP = 5

RANKS = [
    (0, "Freshman", "🎒"),
    (1500, "Sophomore", "📗"),
    (4000, "Junior", "📘"),
    (8000, "Senior", "📙"),
    (14000, "Graduate Student", "🎓"),
    (22000, "Master's Candidate", "🧭"),
    (32000, "Master of Science", "🏅"),
    (46000, "Doctoral Candidate", "🔬"),
    (65000, "Professor", "🦉"),
    (90000, "Luminary", "🌟"),
]


def level_multiplier(course_level: int) -> float:
    """Harder courses pay more: 100→1.0, 600→2.0."""
    return 1.0 + max(0, min(500, course_level - 100)) / 500.0


def rank_for(xp: int) -> dict:
    cur = RANKS[0]
    nxt = None
    for i, r in enumerate(RANKS):
        if xp >= r[0]:
            cur = r
            nxt = RANKS[i + 1] if i + 1 < len(RANKS) else None
    span = (nxt[0] - cur[0]) if nxt else 1
    into = xp - cur[0]
    return {
        "title": cur[1], "icon": cur[2], "min_xp": cur[0], "next_title": nxt[1] if nxt else None,
        "next_xp": nxt[0] if nxt else None, "progress": (into / span) if nxt else 1.0,
        "level": int(math.sqrt(max(0, xp) / 60.0)) + 1,  # fine-grained numeric level
    }


# --------------------------------------------------------------------------- streaks
def _active_days() -> set[str]:
    return {r["day"] for r in db.query("SELECT DISTINCT day FROM xp_events")}


def streak_info() -> dict:
    days = _active_days()
    today = db.today()
    d = _dt.date.fromisoformat(today)
    streak = 0
    # today counts if active; otherwise streak continues from yesterday
    if today not in days:
        d = d - _dt.timedelta(days=1)
    while d.isoformat() in days:
        streak += 1
        d = d - _dt.timedelta(days=1)
    # longest streak
    longest, run, prev = 0, 0, None
    for day in sorted(days):
        cur = _dt.date.fromisoformat(day)
        run = run + 1 if prev and (cur - prev).days == 1 else 1
        longest = max(longest, run)
        prev = cur
    return {"current": streak, "longest": longest, "active_today": today in days, "days": sorted(days)[-90:]}


def maybe_award_daily_streak() -> int:
    """Award the daily streak bonus once per day on first activity."""
    today = db.today()
    if db.xp_reason_count("streak_daily", today):
        return 0
    s = streak_info()
    bonus = XP["streak_daily"] * max(1, min(7, s["current"] if s["active_today"] else s["current"] + 1))
    return db.add_xp(bonus, "streak_daily", today)


# --------------------------------------------------------------------------- degree progress
def course_status(course_id: str, progress: dict[str, dict] | None = None) -> dict:
    c = curriculum.course(course_id)
    if not c:
        return {"completed": False, "done": 0, "total": 0, "pct": 0}
    progress = progress if progress is not None else db.all_progress()
    ids = [lid for m in c["modules"] for lid in m["lesson_ids"]]
    done = sum(1 for lid in ids if progress.get(lid, {}).get("completed_at"))
    scores = [progress[lid]["score"] for lid in ids if progress.get(lid, {}).get("score") is not None]
    started = sum(1 for lid in ids if progress.get(lid, {}).get("started_at"))
    credit = db.query_one("SELECT method, score FROM course_credits WHERE course_id=?", (course_id,))
    by_exam = credit is not None
    if by_exam and credit["score"] is not None and not scores:
        scores = [float(credit["score"])]
    return {
        "course_id": course_id, "done": done, "total": len(ids), "started": started or (1 if by_exam else 0),
        "pct": 1.0 if by_exam else ((done / len(ids)) if ids else 0.0),
        "completed": by_exam or (bool(ids) and done == len(ids)),
        "credit_by_exam": by_exam,
        "avg_score": (sum(scores) / len(scores)) if scores else None,
        "grade": letter_grade(sum(scores) / len(scores)) if scores else None,
    }


def letter_grade(score: float) -> str:
    pct = score * 100
    for cut, letter in ((97, "A+"), (93, "A"), (90, "A-"), (87, "B+"), (83, "B"), (80, "B-"), (77, "C+"), (73, "C"), (70, "C-"), (60, "D")):
        if pct >= cut:
            return letter
    return "F"


def domain_progress(domain_id: str, progress: dict[str, dict] | None = None) -> dict:
    d = curriculum.domain(domain_id)
    if not d:
        return {}
    progress = progress if progress is not None else db.all_progress()
    total_lessons = done_lessons = 0
    ug_credits = ug_total = grad_credits = grad_total = 0
    courses_done = 0
    for s in d["subjects"]:
        for c in s["courses"]:
            st = course_status(c["id"], progress)
            total_lessons += st["total"]
            done_lessons += st["done"]
            if c["level"] <= 400:
                ug_total += c["credits"]
                if st["completed"]:
                    ug_credits += c["credits"]
            else:
                grad_total += c["credits"]
                if st["completed"]:
                    grad_credits += c["credits"]
            if st["completed"]:
                courses_done += 1
    bachelor_pct = (ug_credits / (0.7 * ug_total)) if ug_total else 0.0
    master_pct = (grad_credits / (0.7 * grad_total)) if grad_total else 0.0
    degree = "none"
    if bachelor_pct >= 1.0:
        degree = "bachelor"
    if degree == "bachelor" and master_pct >= 1.0:
        degree = "master"
    return {
        "domain_id": domain_id, "lessons_total": total_lessons, "lessons_done": done_lessons,
        "pct": (done_lessons / total_lessons) if total_lessons else 0.0,
        "ug_credits": ug_credits, "ug_total": ug_total, "grad_credits": grad_credits, "grad_total": grad_total,
        "bachelor_pct": min(1.0, bachelor_pct), "master_pct": min(1.0, master_pct), "degree": degree,
        "courses_done": courses_done, "courses_total": d["course_count"],
    }


# --------------------------------------------------------------------------- badges
BADGES: list[dict] = [
    {"id": "first_steps", "name": "First Steps", "icon": "👣", "desc": "Open your first lesson.", "tier": 1},
    {"id": "first_lesson", "name": "Lesson One", "icon": "✅", "desc": "Complete your first lesson.", "tier": 1},
    {"id": "first_homework", "name": "Homework Hero", "icon": "📝", "desc": "Submit your first homework set.", "tier": 1},
    {"id": "perfect_homework", "name": "Perfectionist", "icon": "💯", "desc": "Score 100% on a homework set.", "tier": 2},
    {"id": "lessons_10", "name": "Decathlete", "icon": "🔟", "desc": "Complete 10 lessons.", "tier": 1},
    {"id": "lessons_50", "name": "Half-Century", "icon": "5️⃣", "desc": "Complete 50 lessons.", "tier": 2},
    {"id": "lessons_100", "name": "Centurion", "icon": "💯", "desc": "Complete 100 lessons.", "tier": 3},
    {"id": "lessons_500", "name": "Scholar of Legend", "icon": "📜", "desc": "Complete 500 lessons.", "tier": 4},
    {"id": "streak_3", "name": "Warming Up", "icon": "🔥", "desc": "3-day learning streak.", "tier": 1},
    {"id": "streak_7", "name": "On Fire", "icon": "🔥", "desc": "7-day learning streak.", "tier": 2},
    {"id": "streak_30", "name": "Unstoppable", "icon": "☄️", "desc": "30-day learning streak.", "tier": 3},
    {"id": "polymath", "name": "Polymath", "icon": "🧠", "desc": "Complete a lesson in every built-in domain.", "tier": 3},
    {"id": "course_complete", "name": "Course Conqueror", "icon": "🏁", "desc": "Complete an entire course.", "tier": 2},
    {"id": "courses_5", "name": "Dean's List", "icon": "📋", "desc": "Complete 5 courses.", "tier": 3},
    {"id": "bachelor", "name": "Bachelor's Degree", "icon": "🎓", "desc": "Earn a Bachelor's in any domain.", "tier": 4},
    {"id": "master", "name": "Master's Degree", "icon": "👑", "desc": "Earn a Master's in any domain.", "tier": 5},
    {"id": "sim_explorer", "name": "Lab Rat", "icon": "🧪", "desc": "Complete 10 simulation challenges.", "tier": 2},
    {"id": "sim_master", "name": "Mad Scientist", "icon": "⚗️", "desc": "Complete 50 simulation challenges.", "tier": 3},
    {"id": "socratic", "name": "Socratic Method", "icon": "💬", "desc": "Ask the professor 25 questions.", "tier": 2},
    {"id": "critic", "name": "Constructive Critic", "icon": "🗳️", "desc": "Give feedback 10 times.", "tier": 2},
    {"id": "architect", "name": "Curriculum Architect", "icon": "🏗️", "desc": "Design your own course with the AI.", "tier": 2},
    {"id": "night_owl", "name": "Night Owl", "icon": "🦉", "desc": "Complete a lesson between midnight and 5 am.", "tier": 1},
    {"id": "early_bird", "name": "Early Bird", "icon": "🐦", "desc": "Complete a lesson before 7 am.", "tier": 1},
    {"id": "xp_1000", "name": "Kilo-Scholar", "icon": "⚡", "desc": "Earn 1,000 XP.", "tier": 1},
    {"id": "xp_10000", "name": "Mega-Scholar", "icon": "⚡", "desc": "Earn 10,000 XP.", "tier": 3},
    {"id": "grad_level", "name": "Grad School", "icon": "🏛️", "desc": "Complete a 500/600-level lesson.", "tier": 3},
    {"id": "coder", "name": "Hands on Keyboard", "icon": "⌨️", "desc": "Run code in 10 labs.", "tier": 2},
    # domain flavour
    {"id": "dom_physics", "name": "Newton's Apprentice", "icon": "⚛️", "desc": "Complete a Physics course.", "tier": 2},
    {"id": "dom_math", "name": "Euler's Heir", "icon": "📐", "desc": "Complete a Mathematics course.", "tier": 2},
    {"id": "dom_chemistry", "name": "Curie's Circle", "icon": "🧪", "desc": "Complete a Chemistry course.", "tier": 2},
    {"id": "dom_ai", "name": "Turing's Heir", "icon": "🤖", "desc": "Complete an AI course.", "tier": 2},
    {"id": "dom_robotics", "name": "Asimov's Engineer", "icon": "🦾", "desc": "Complete a Robotics course.", "tier": 2},
    {"id": "dom_philosophy", "name": "Socrates' Student", "icon": "🏛️", "desc": "Complete a Philosophy course.", "tier": 2},
    {"id": "dom_languages", "name": "Polyglot Laureate", "icon": "🌍", "desc": "Complete a World Languages course.", "tier": 2},
    {"id": "dom_cybersecurity", "name": "Zero-Day Sentinel", "icon": "🕵️", "desc": "Complete a Cybersecurity & OSINT course.", "tier": 2},
    {"id": "dom_neuroscience", "name": "Cortical Architect", "icon": "🧬", "desc": "Complete a Computational Neuroscience & BCI course.", "tier": 2},
    {"id": "dom_game_theory", "name": "Nash Strategist", "icon": "📈", "desc": "Complete a Game Theory & Quant Finance course.", "tier": 2},
    {"id": "dom_aerospace", "name": "Orbital Navigator", "icon": "🚀", "desc": "Complete an Aerospace & Astrodynamics course.", "tier": 2},
    {"id": "dom_quantum_computing", "name": "Qubit Forger", "icon": "⚡", "desc": "Complete a Quantum Computing course.", "tier": 2},
    {"id": "dom_synbio", "name": "Genome Engineer", "icon": "🧪", "desc": "Complete a Synthetic Biology & Longevity course.", "tier": 2},
    {"id": "dom_materials", "name": "Nanofab Pioneer", "icon": "🔋", "desc": "Complete a Materials Science & Semiconductor course.", "tier": 2},
    {"id": "dom_systems", "name": "Kernel Hacker", "icon": "🖥️", "desc": "Complete a Systems, Compilers & GPU course.", "tier": 2},
    {"id": "dom_complex_systems", "name": "Chaos Navigator", "icon": "🌐", "desc": "Complete a Complex Systems & Chaos course.", "tier": 2},
    {"id": "dom_geopolitics", "name": "Grand Strategist", "icon": "🏛️", "desc": "Complete a Geopolitics & Strategy course.", "tier": 2},
    {"id": "dom_jurisprudence", "name": "Master Advocate", "icon": "⚖️", "desc": "Complete a Jurisprudence & Rhetoric course.", "tier": 2},
    {"id": "dom_rf_sdr", "name": "Spectrum Sovereign", "icon": "📡", "desc": "Complete an RF Systems & SDR course.", "tier": 2},
    {"id": "dom_computer_science", "name": "Knuth's Disciple", "icon": "💻", "desc": "Complete a Computer Science course.", "tier": 2},
    {"id": "dom_biology", "name": "Darwin's Naturalist", "icon": "🌿", "desc": "Complete a General Biology course.", "tier": 2},
    {"id": "dom_economics", "name": "Smith's Economist", "icon": "💹", "desc": "Complete an Economics course.", "tier": 2},
    {"id": "dom_statistics", "name": "Bayes' Apprentice", "icon": "📊", "desc": "Complete a Statistics & Data Science course.", "tier": 2},
    {"id": "dom_writing", "name": "Orwell's Scribe", "icon": "✍️", "desc": "Complete a Writing & Communication course.", "tier": 2},
    {"id": "dom_psychology", "name": "James's Psychologist", "icon": "🧠", "desc": "Complete a Psychology & Behavioral Science course.", "tier": 2},
    # advanced features
    {"id": "viva_laureate", "name": "Viva Voce Defender", "icon": "🎙️", "desc": "Pass an Oral Defense (Viva Voce) with ≥ 80%.", "tier": 3},
    {"id": "feynman_master", "name": "Feynman Pedagogue", "icon": "🪲", "desc": "Teach back a concept to the AI Novice with ≥ 80%.", "tier": 3},
    {"id": "fault_hunter", "name": "Fault-Injection Debugger", "icon": "🔬", "desc": "Diagnose and stabilize a broken simulation in Fault Mode.", "tier": 2},
    {"id": "exam_honors", "name": "Exam Honors", "icon": "⏱️", "desc": "Pass a Timed Midterm or Final Exam with an A.", "tier": 3},
    {"id": "zettelkasten_sage", "name": "Zettelkasten Chronicler", "icon": "📓", "desc": "Save 5 linked notes in your Scholar's Notebook.", "tier": 2},
    {"id": "capstone_fellow", "name": "Interdisciplinary Fellow", "icon": "🧬", "desc": "Complete a Cross-Domain Capstone Project.", "tier": 4},
    {"id": "autopsy_surgeon", "name": "Mistake Surgeon", "icon": "📉", "desc": "Resolve a weakness in the Mistake Autopsy Lab.", "tier": 2},
]
BADGE_BY_ID = {b["id"]: b for b in BADGES}


def check_badges(event: str, data: dict | None = None) -> list[dict]:
    """Evaluate badge conditions relevant to an event; returns newly earned badges."""
    data = data or {}
    earned = db.earned_badges()
    new: list[str] = []

    def give(bid: str):
        if bid not in earned and bid not in new and bid in BADGE_BY_ID:
            new.append(bid)

    total_xp = db.total_xp()
    if total_xp >= 1000:
        give("xp_1000")
    if total_xp >= 10000:
        give("xp_10000")

    if event == "lesson_open":
        give("first_steps")
    if event in ("lesson_complete", "course_complete"):
        completed = db.completed_lesson_ids()
        n = len(completed)
        if n >= 1:
            give("first_lesson")
        if n >= 10:
            give("lessons_10")
        if n >= 50:
            give("lessons_50")
        if n >= 100:
            give("lessons_100")
        if n >= 500:
            give("lessons_500")
        hour = time.localtime().tm_hour
        if 0 <= hour < 5:
            give("night_owl")
        if 5 <= hour < 7:
            give("early_bird")
        lid = data.get("lesson_id")
        if lid:
            meta = curriculum.lesson(lid)
            if meta and curriculum.course(meta["course_id"])["level"] >= 500:
                give("grad_level")
        builtin = [d["id"] for d in curriculum.domains() if d.get("builtin")]
        touched = {curriculum.lesson(x)["domain_id"] for x in completed if curriculum.lesson(x)}
        if builtin and all(b in touched for b in builtin):
            give("polymath")
        # courses
        progress = db.all_progress()
        done_courses = [cid for cid in curriculum.courses() if course_status(cid, progress)["completed"]]
        if done_courses:
            give("course_complete")
            for cid in done_courses:
                dom = curriculum.course(cid)["domain_id"]
                give(f"dom_{dom}")
        if len(done_courses) >= 5:
            give("courses_5")
        for d in curriculum.domains():
            dp = domain_progress(d["id"], progress)
            if dp.get("degree") in ("bachelor", "master"):
                give("bachelor")
            if dp.get("degree") == "master":
                give("master")
    if event == "homework":
        give("first_homework")
        if data.get("score", 0) >= 0.999:
            give("perfect_homework")
    if event == "streak":
        s = streak_info()["current"]
        if s >= 3:
            give("streak_3")
        if s >= 7:
            give("streak_7")
        if s >= 30:
            give("streak_30")
    if event == "sim":
        n = len(db.sim_challenges_done())
        if n >= 10:
            give("sim_explorer")
        if n >= 50:
            give("sim_master")
    if event == "chat":
        if db.chat_count() >= 25:
            give("socratic")
    if event == "feedback":
        if db.count("feedback") >= 10:
            give("critic")
    if event == "design":
        give("architect")
    if event == "lab":
        if db.xp_reason_count("lab_run") >= 10:
            give("coder")
    if event == "viva_voce" and data.get("score", 0) >= 0.8:
        give("viva_laureate")
    if event == "feynman" and data.get("score", 0) >= 0.8:
        give("feynman_master")
    if event == "fault_fixed":
        give("fault_hunter")
    if event == "exam" and data.get("score", 0) >= 0.9:
        give("exam_honors")
    if event == "note" and db.count("notebook_notes") >= 5:
        give("zettelkasten_sage")
    if event == "capstone" and data.get("score", 0) >= 0.75:
        give("capstone_fellow")
    if event == "autopsy":
        give("autopsy_surgeon")

    out = []
    for bid in new:
        if db.award_badge(bid, data.get("lesson_id")):
            out.append(BADGE_BY_ID[bid])
    return out


def badge_catalog() -> list[dict]:
    earned = db.earned_badges()
    out = []
    for b in BADGES:
        e = earned.get(b["id"])
        out.append({**b, "earned": bool(e), "earned_at": e["earned_at"] if e else None})
    return out


# --------------------------------------------------------------------------- summary
def learner_summary() -> dict[str, Any]:
    xp = db.total_xp()
    rank = rank_for(xp)
    streak = streak_info()
    progress = db.all_progress()
    completed = [lid for lid, p in progress.items() if p.get("completed_at")]
    settings = db.all_settings()
    goal = int(settings.get("preferences", {}).get("daily_goal_xp", 150) or 150)
    return {
        "name": settings.get("learner_name") or "Scholar",
        "total_xp": xp, "xp_today": db.xp_today(), "daily_goal_xp": goal, "rank": rank, "level_title": rank["title"],
        "streak": streak, "lessons_completed": len(completed), "lessons_started": len(progress),
        "badges_earned": len(db.earned_badges()), "badges_total": len(BADGES),
        "domains": {d["id"]: domain_progress(d["id"], progress) for d in curriculum.domains()},
    }
