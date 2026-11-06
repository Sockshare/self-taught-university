#!/usr/bin/env python3
"""Self-Taught — your personal AI university. Flask server + JSON API.

Run:  python3 server.py   (port 8088 by default; override with SELF_TAUGHT_PORT)
"""
from __future__ import annotations

import json
import os
import re
import sys
import threading
import time
import traceback
import uuid
from typing import Any

from flask import Flask, Response, jsonify, request, send_from_directory, stream_with_context

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)

import curriculum  # noqa: E402
import db  # noqa: E402
import degrees  # noqa: E402
import gamification as game  # noqa: E402
import llm  # noqa: E402
import prompts  # noqa: E402
import tts  # noqa: E402

app = Flask(__name__, static_folder=os.path.join(ROOT, "static"), static_url_path="/static", template_folder=os.path.join(ROOT, "templates"))
app.config["JSON_SORT_KEYS"] = False
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.after_request
def _add_no_cache_headers(resp: Response) -> Response:
    if request.path.startswith("/static/vendor/"):
        # vendored libraries (KaTeX, Marked, Pyodide ~25 MB) are immutable: let the browser cache them
        resp.headers["Cache-Control"] = "public, max-age=604800, immutable"
        resp.headers.pop("Pragma", None)
        resp.headers.pop("Expires", None)
        return resp
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp


PORT = int(os.environ.get("SELF_TAUGHT_PORT", "8088"))
SIMS_REGISTRY_PATH = os.path.join(ROOT, "data", "sims_registry.json")

_sims_registry: list[dict] = []
_inflight: set[str] = set()
_inflight_lock = threading.Lock()
_jobs: dict[str, dict] = {}
_jobs_lock = threading.Lock()


# --------------------------------------------------------------------------- helpers
def _load_sims_registry() -> None:
    global _sims_registry
    try:
        if os.path.exists(SIMS_REGISTRY_PATH):
            with open(SIMS_REGISTRY_PATH, "r", encoding="utf-8") as f:
                _sims_registry = json.load(f)
    except Exception:  # noqa: BLE001
        _sims_registry = []


def _award(amount: int, reason: str, ref: str | None, awards: list[dict]) -> None:
    got = db.add_xp(amount, reason, ref)
    if got:
        awards.append({"xp": got, "reason": reason})


def _badges(event: str, data: dict | None = None) -> list[dict]:
    try:
        return game.check_badges(event, data)
    except Exception:  # noqa: BLE001
        traceback.print_exc()
        return []


def _lesson_payload(lesson_id: str, include_content: bool = True) -> dict:
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return {}
    state = db.lesson_state(lesson_id)
    content = db.get_lesson_content(lesson_id) if include_content else None
    progress = db.get_progress(lesson_id)
    return {
        "context": ctx, "state": state, "content": content, "progress": progress,
        "feedback": db.feedback_for_lesson(lesson_id), "chat": db.chat_history(lesson_id),
        "versions": db.lesson_versions(lesson_id), "submissions": db.submissions(lesson_id)[-3:],
        "lab_drafts": db.get_lab_drafts(lesson_id),
        "lock": _prereq_lock(ctx["course"]["id"]) if not (progress and progress.get("started_at")) else {"locked": False, "missing": []},
    }


def _course_payload(course_id: str) -> dict | None:
    c = curriculum.course(course_id)
    if not c:
        return None
    progress = db.all_progress()
    cached = db.cached_lesson_ids()
    modules = []
    for m in c["modules"]:
        lessons = []
        for i, lid in enumerate(m["lesson_ids"]):
            p = progress.get(lid)
            lessons.append({
                "id": lid, "title": m["lessons"][i], "index": i,
                "status": "completed" if p and p.get("completed_at") else ("started" if p else "new"),
                "score": p.get("score") if p else None, "cached": lid in cached,
            })
        modules.append({"id": m["id"], "title": m["title"], "summary": m["summary"], "sim": m.get("sim"), "lab": m.get("lab"), "lessons": lessons})
    d = curriculum.domain(c["domain_id"])
    s = next(x for x in d["subjects"] if x["id"] == c["subject_id"])
    prereqs = []
    for pid in c["prerequisites"]:
        pc = curriculum.course(pid)
        if pc:
            prereqs.append({"id": pid, "code": pc["code"], "title": pc["title"], "status": game.course_status(pid, progress)})
    return {
        "course": {k: c[k] for k in ("id", "code", "title", "level", "level_name", "credits", "description", "lesson_count")},
        "domain": {k: d[k] for k in ("id", "name", "icon", "color")}, "subject": {k: s[k] for k in ("id", "name", "icon")},
        "modules": modules, "status": game.course_status(course_id, progress), "prerequisites": prereqs,
        "lock": _prereq_lock(course_id, progress), "instructor": _instructor_for(c, d),
    }


_FACULTY_KEYS = ("id", "name", "title", "specialty", "bio", "icon", "persona")


def _faculty_roster(d: dict) -> list[dict]:
    """Optional named faculty roster declared by a domain (`DOMAIN["faculty"]`), with resolved course codes."""
    out = []
    for f in d.get("faculty") or []:
        if not isinstance(f, dict) or not f.get("name"):
            continue
        item = {k: f.get(k) for k in _FACULTY_KEYS}
        item["courses"] = [{"id": cid, "code": curriculum.course(cid)["code"], "title": curriculum.course(cid)["title"]}
                           for cid in (f.get("courses") or []) if curriculum.course(cid)]
        out.append(item)
    return out


def _instructor_for(c: dict, d: dict) -> dict | None:
    iid = c.get("instructor")
    if not iid:
        return None
    f = next((x for x in d.get("faculty") or [] if isinstance(x, dict) and x.get("id") == iid), None)
    return {k: f.get(k) for k in _FACULTY_KEYS} if f else None


def _prereq_lock(course_id: str, progress: dict | None = None) -> dict:
    """Soft prerequisite lock: a course is locked while any prerequisite is incomplete (no lessons/test-out),
    unless enforcement is off in Settings or the learner unlocked this course early."""
    c = curriculum.course(course_id)
    if not c:
        return {"locked": False, "missing": [], "enforced": False, "overridden": False}
    progress = progress if progress is not None else db.all_progress()
    missing = []
    for pid in c.get("prerequisites") or []:
        pc = curriculum.course(pid)
        if pc and not game.course_status(pid, progress)["completed"]:
            missing.append({"id": pid, "code": pc["code"], "title": pc["title"]})
    enforced = bool(db.get_setting("enforce_prereqs", True))
    overridden = course_id in (db.get_setting("prereq_overrides", []) or [])
    already = game.course_status(course_id, progress)
    locked = enforced and bool(missing) and not overridden and not already["completed"] and not already["started"]
    return {"locked": locked, "missing": missing, "enforced": enforced, "overridden": overridden}


def _domain_payload(domain_id: str) -> dict | None:
    d = curriculum.domain(domain_id)
    if not d:
        return None
    progress = db.all_progress()
    names = {f.get("id"): f.get("name") for f in d.get("faculty") or [] if isinstance(f, dict)}
    subjects = []
    for s in d["subjects"]:
        courses = []
        for c in s["courses"]:
            courses.append({**{k: c[k] for k in ("id", "code", "title", "level", "level_name", "credits", "description", "lesson_count", "prerequisites")},
                            "modules_count": len(c["modules"]), "status": game.course_status(c["id"], progress),
                            "instructor": names.get(c.get("instructor"))})
        subjects.append({**{k: s[k] for k in ("id", "name", "icon", "description", "lesson_count")}, "courses": courses})
    return {**{k: d[k] for k in ("id", "name", "icon", "color", "tagline", "description", "lesson_count", "course_count", "builtin")},
            "subjects": subjects, "progress": game.domain_progress(domain_id, progress), "faculty": _faculty_roster(d)}


def _catalog_payload() -> list[dict]:
    progress = db.all_progress()
    out = []
    for d in curriculum.domains():
        out.append({**{k: d[k] for k in ("id", "name", "icon", "color", "tagline", "description", "lesson_count", "course_count", "builtin")},
                    "subjects": [{k: s[k] for k in ("id", "name", "icon", "description", "lesson_count")} | {"courses": len(s["courses"])} for s in d["subjects"]],
                    "progress": game.domain_progress(d["id"], progress)})
    return out


def _first_incomplete(course_id: str, progress: dict[str, dict]) -> str | None:
    c = curriculum.course(course_id)
    for m in c["modules"]:
        for lid in m["lesson_ids"]:
            if not progress.get(lid, {}).get("completed_at"):
                return lid
    return None


def _recommendations(progress: dict[str, dict], limit: int = 6) -> list[dict]:
    recs: list[dict] = []
    seen: set[str] = set()
    # 1) courses in progress → next incomplete lesson
    started_courses: dict[str, float] = {}
    for lid, p in progress.items():
        meta = curriculum.lesson(lid)
        if meta:
            started_courses[meta["course_id"]] = max(started_courses.get(meta["course_id"], 0), p.get("last_visited") or 0)
    for cid, _ in sorted(started_courses.items(), key=lambda kv: -kv[1]):
        nxt = _first_incomplete(cid, progress)
        if nxt and nxt not in seen:
            seen.add(nxt)
            recs.append({"lesson": _lesson_brief(nxt), "why": "Continue your course"})
        if len(recs) >= limit:
            return recs
    # 2) unlocked next courses: prerequisites satisfied, not started
    done_courses = {cid for cid in curriculum.courses() if game.course_status(cid, progress)["completed"]}
    for cid, c in curriculum.courses().items():
        if cid in started_courses:
            continue
        if c["prerequisites"] and all(p in done_courses for p in c["prerequisites"]) and c["prerequisites"]:
            nxt = _first_incomplete(cid, progress)
            if nxt and nxt not in seen:
                seen.add(nxt)
                recs.append({"lesson": _lesson_brief(nxt), "why": "You unlocked this course"})
            if len(recs) >= limit:
                return recs
    # 3) first 100-level course in each domain
    for d in curriculum.domains():
        best = None
        for s in d["subjects"]:
            for c in s["courses"]:
                if c["id"] in started_courses:
                    continue
                if best is None or c["level"] < best["level"]:
                    best = c
        if best:
            nxt = _first_incomplete(best["id"], progress)
            if nxt and nxt not in seen:
                seen.add(nxt)
                recs.append({"lesson": _lesson_brief(nxt), "why": f"Start {d['name']}"})
        if len(recs) >= limit:
            break
    return recs[:limit]


def _lesson_brief(lesson_id: str) -> dict:
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return {"id": lesson_id}
    return {"id": lesson_id, "title": ctx["lesson"]["title"], "course": ctx["course"], "module": ctx["module"]["title"],
            "domain": ctx["domain"], "subject": ctx["subject"]["name"]}


def _daily_quest() -> dict:
    today = db.today()
    kinds = [
        {"id": "lessons2", "title": "Finish 2 lessons today", "target": 2, "metric": lambda: db.xp_reason_count("lecture_complete", today) + db.xp_reason_count("lesson_complete", today)},
        {"id": "xp200", "title": "Earn 200 XP today", "target": 200, "metric": lambda: db.xp_today()},
        {"id": "homework80", "title": "Submit a homework set", "target": 1, "metric": lambda: db.xp_reason_count("homework", today)},
        {"id": "sims3", "title": "Complete 3 simulation challenges", "target": 3, "metric": lambda: db.xp_reason_count("sim_challenge", today)},
        {"id": "ask3", "title": "Ask the professor 3 questions", "target": 3, "metric": lambda: db.xp_reason_count("tutor_question", today)},
        {"id": "checkpoints5", "title": "Nail 5 checkpoint questions", "target": 5, "metric": lambda: db.xp_reason_count("checkpoint_correct", today)},
    ]
    idx = sum(ord(ch) for ch in today) % len(kinds)
    q = kinds[idx]
    value = int(q["metric"]())
    done = value >= q["target"]
    rewarded = db.xp_reason_count("quest", today) > 0
    if done and not rewarded:
        db.add_xp(50, "quest", today)
        rewarded = True
    return {"id": q["id"], "title": q["title"], "target": q["target"], "value": min(value, q["target"]), "done": done, "reward": 50, "rewarded": rewarded}


# --------------------------------------------------------------------------- generation
def _generate_lesson(lesson_id: str, instruction: str = "") -> None:
    try:
        ctx = curriculum.lesson_context(lesson_id)
        if not ctx:
            db.set_lesson_state(lesson_id, "error", "unknown lesson")
            return
        settings = db.all_settings()
        feedback = db.feedback_for_lesson(lesson_id)
        prior = db.get_lesson_content(lesson_id)
        summary = game.learner_summary()
        prompt = prompts.lesson_prompt(ctx, settings, _sims_registry, feedback, summary, prior=prior, extra_instruction=instruction)
        system = prompts.system_professor(settings)
        try:
            raw, model = llm.generate_json(prompt, system=system, temperature=0.7, max_tokens=24576, kind="long")
            content = prompts.normalise_lesson(raw, ctx)
            if len(content["sections"]) < 2:
                raise ValueError("lesson came back nearly empty")
            content["generated_with_feedback"] = bool([f for f in feedback if (f.get("comment") or "").strip()])
            db.save_lesson_content(lesson_id, content, model)
            _index_lesson(lesson_id, content)
        except llm.LLMUnavailable as e:
            if prior:
                db.set_lesson_state(lesson_id, "ready", f"Regeneration failed: {e}")
            else:
                content = prompts.offline_lesson(ctx, str(e)[:200])
                db.save_lesson_content(lesson_id, content, "offline")
        except Exception as e:  # noqa: BLE001
            traceback.print_exc()
            if prior:
                db.set_lesson_state(lesson_id, "ready", f"Regeneration failed: {str(e)[:200]}")
            else:
                content = prompts.offline_lesson(ctx, f"generation error: {str(e)[:120]}")
                db.save_lesson_content(lesson_id, content, "offline")
    finally:
        with _inflight_lock:
            _inflight.discard(lesson_id)


def _start_generation(lesson_id: str, instruction: str = "") -> dict:
    with _inflight_lock:
        if lesson_id in _inflight:
            return db.lesson_state(lesson_id)
        _inflight.add(lesson_id)
    db.set_lesson_state(lesson_id, "generating", None)
    t = threading.Thread(target=_generate_lesson, args=(lesson_id, instruction), daemon=True)
    t.start()
    return db.lesson_state(lesson_id)


def _run_job(job_id: str, fn, *args) -> None:
    try:
        result = fn(*args)
        with _jobs_lock:
            _jobs[job_id].update({"status": "done", "result": result, "finished_at": time.time()})
    except Exception as e:  # noqa: BLE001
        traceback.print_exc()
        with _jobs_lock:
            _jobs[job_id].update({"status": "error", "error": str(e)[:500], "finished_at": time.time()})


def _start_job(kind: str, fn, *args) -> str:
    _prune_jobs()
    job_id = uuid.uuid4().hex[:12]
    with _jobs_lock:
        _jobs[job_id] = {"id": job_id, "kind": kind, "status": "running", "started_at": time.time()}
    threading.Thread(target=_run_job, args=(job_id, fn, *args), daemon=True).start()
    return job_id


# --------------------------------------------------------------------------- grading helpers
def _grade_local(q: dict, answer: Any) -> dict | None:
    t = q.get("type")
    if t == "mcq":
        try:
            idx = int(answer)
        except (TypeError, ValueError):
            idx = -1
        try:
            key = int(q.get("answer"))
        except (TypeError, ValueError):
            key = -2
        choices = q.get("choices") if isinstance(q.get("choices"), list) else []
        correct = idx == key and 0 <= key < max(1, len(choices))
        return {"id": q["id"], "score": 1.0 if correct else 0.0, "correct": correct, "feedback": q.get("explanation") or "",
                "model_answer_summary": str(choices[key]) if 0 <= key < len(choices) else ""}
    if t == "numeric":
        try:
            val = float(str(answer).replace(",", "").strip())
        except (TypeError, ValueError):
            return {"id": q["id"], "score": 0.0, "correct": False, "feedback": "Please enter a number." if answer not in (None, "") else "No answer given.", "model_answer_summary": f"{q.get('answer')} {q.get('unit', '')}".strip()}
        try:
            tol = abs(float(q.get("tolerance") or 0))
            target = float(str(q.get("answer")).replace(",", "").strip())
        except (TypeError, ValueError):
            return None  # malformed key: fall back to rubric/AI grading
        correct = abs(val - target) <= max(tol, abs(target) * 1e-6)
        close = (not correct) and abs(val - target) <= max(tol * 3, abs(target) * 0.1)
        return {"id": q["id"], "score": 1.0 if correct else (0.4 if close else 0.0), "correct": correct,
                "feedback": (q.get("explanation") or "") if correct else (("Close, but outside tolerance. " if close else "Not quite. ") + (q.get("explanation") or "")),
                "model_answer_summary": f"{target:g} {q.get('unit', '')}".strip()}
    return None


def _grade_with_llm(lesson: dict, items: list[dict], answers: dict[str, Any], exec_results: dict | None = None) -> dict[str, dict]:
    if not items:
        return {}
    prompt = prompts.grading_prompt(lesson, items, answers, exec_results)
    data, _model = llm.generate_json(prompt, temperature=0.2, max_tokens=4096, kind="fast")
    out = {}
    for g in (data or {}).get("grades", []) if isinstance(data, dict) else []:
        try:
            score = max(0.0, min(1.0, float(g.get("score", 0))))
        except (TypeError, ValueError):
            score = 0.0
        out[str(g.get("id"))] = {"id": str(g.get("id")), "score": score, "correct": score >= 0.7, "feedback": str(g.get("feedback") or ""),
                                 "model_answer_summary": str(g.get("model_answer_summary") or "")}
    return out


def _heuristic_grade(q: dict, answer: Any) -> dict:
    text = str(answer or "").strip()
    if not text:
        return {"id": q["id"], "score": 0.0, "correct": False, "feedback": "No answer given.", "model_answer_summary": str(q.get("answer") or "")}
    words = len(text.split())
    score = 0.5 if words >= 20 else 0.3
    return {"id": q["id"], "score": score, "correct": False, "pending": True,
            "feedback": "The AI grader is unavailable right now, so this got provisional partial credit. Compare your answer with the model answer below.",
            "model_answer_summary": str(q.get("answer") or "")}


# --------------------------------------------------------------------------- routes: pages & static
@app.route("/")
def index():
    return send_from_directory(app.template_folder, "index.html")


@app.errorhandler(ValueError)
@app.errorhandler(TypeError)
@app.errorhandler(KeyError)
@app.errorhandler(AttributeError)
def _bad_input(e):
    if not request.path.startswith("/api/"):
        raise e
    app.logger.warning("bad request on %s: %s: %s", request.path, type(e).__name__, str(e)[:200])
    return jsonify({"error": f"Invalid request: {type(e).__name__}: {str(e)[:160]}"}), 400


@app.route("/health")
def health():
    return jsonify({"ok": True, "lessons": len(curriculum.lessons()), "llm": llm.available()})


# --------------------------------------------------------------------------- routes: bootstrap / catalog
@app.route("/api/bootstrap")
def api_bootstrap():
    settings = db.all_settings()
    settings = {**settings, "gemini_api_key": "", "has_key": bool(settings.get("gemini_api_key"))}
    return jsonify({
        "settings": settings, "summary": game.learner_summary(), "catalog": _catalog_payload(), "llm": llm.status(),
        "curriculum_stats": curriculum.stats(), "ranks": [{"min_xp": r[0], "title": r[1], "icon": r[2]} for r in game.RANKS],
        "sims_known": [s["id"] for s in _sims_registry], "voices": tts.list_personas(),
    })


@app.route("/api/sims/registry", methods=["POST"])
def api_sims_registry():
    global _sims_registry
    data = request.get_json(silent=True) or {}
    sims = data.get("sims")
    if isinstance(sims, list) and sims:
        _sims_registry = sims
        try:
            os.makedirs(os.path.dirname(SIMS_REGISTRY_PATH), exist_ok=True)
            with open(SIMS_REGISTRY_PATH, "w", encoding="utf-8") as f:
                json.dump(sims, f)
        except Exception:  # noqa: BLE001
            pass
    return jsonify({"count": len(_sims_registry)})


@app.route("/api/catalog")
def api_catalog():
    return jsonify(_catalog_payload())


@app.route("/api/domain/<domain_id>")
def api_domain(domain_id: str):
    d = _domain_payload(domain_id)
    return (jsonify(d), 200) if d else (jsonify({"error": "unknown domain"}), 404)


@app.route("/api/domain/<domain_id>", methods=["DELETE"])
def api_domain_delete(domain_id: str):
    ok = curriculum.delete_custom_domain(domain_id)
    return jsonify({"ok": ok})


@app.route("/api/course/<course_id>")
def api_course(course_id: str):
    c = _course_payload(course_id)
    return (jsonify(c), 200) if c else (jsonify({"error": "unknown course"}), 404)


@app.route("/api/search")
def api_search():
    q = (request.args.get("q") or "").strip().lower()
    if len(q) < 2:
        return jsonify([])
    terms = q.split()
    out = []
    for lid, meta in curriculum.lessons().items():
        hay = meta["title"].lower()
        if all(t in hay for t in terms):
            out.append(_lesson_brief(lid))
            if len(out) >= 30:
                break
    if len(out) < 30:
        for cid, c in curriculum.courses().items():
            hay = (c["title"] + " " + c["code"]).lower()
            if all(t in hay for t in terms):
                out.append({"course": {k: c[k] for k in ("id", "code", "title", "level", "level_name", "credits")}, "domain": {"id": c["domain_id"]}, "title": c["title"], "id": None})
                if len(out) >= 40:
                    break
    return jsonify(out)


@app.route("/api/search/fulltext")
def api_search_fulltext():
    """Full-text search across generated lecture bodies, glossaries and Zettelkasten notes (SQLite FTS5)."""
    q = (request.args.get("q") or "").strip()
    if len(q) < 2:
        return jsonify({"results": [], "fts": db.FTS_AVAILABLE})
    out = []
    for r in db.fts_search(q, int(request.args.get("limit") or 25)):
        item = {"kind": r["kind"], "ref": r["ref"], "title": r["title"], "snippet": r["snippet"]}
        if r["kind"] == "lesson":
            item.update(_lesson_brief(r["ref"]) if curriculum.lesson(r["ref"]) else {})
            item["title"] = r["title"]
        out.append(item)
    return jsonify({"results": out, "fts": db.FTS_AVAILABLE, "indexed": db.fts_count()})


# --------------------------------------------------------------------------- routes: dashboard
@app.route("/api/dashboard")
def api_dashboard():
    progress = db.all_progress()
    last = sorted([p for p in progress.values() if p.get("last_visited")], key=lambda p: -p["last_visited"])
    cont = None
    for p in last:
        if not p.get("completed_at"):
            cont = _lesson_brief(p["lesson_id"])
            cont["progress"] = p
            break
    _ensure_default_tracks()
    tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    active_tr = next((t for t in tracks if t.get("active")), tracks[0] if tracks else None)
    return jsonify({
        "summary": game.learner_summary(), "continue": cont, "recommendations": _recommendations(progress),
        "recent_xp": db.recent_xp(12), "xp_by_day": db.xp_by_day(42), "badges": [b for b in game.badge_catalog() if b["earned"]][-6:],
        "quest": _daily_quest(), "llm": llm.status(),
        "recent_lessons": [dict(_lesson_brief(p["lesson_id"]), progress=p) for p in last[:6]],
        "active_track": active_tr, "srs": db.srs_stats(), "time_spent_total": db.total_time_spent(),
    })


@app.route("/api/transcript")
def api_transcript():
    progress = db.all_progress()
    out = []
    for d in curriculum.domains():
        courses = []
        for s in d["subjects"]:
            for c in s["courses"]:
                st = game.course_status(c["id"], progress)
                if st["started"] or st["completed"]:
                    courses.append({**{k: c[k] for k in ("id", "code", "title", "level", "level_name", "credits")}, "subject": s["name"], "status": st})
        out.append({"domain": {k: d[k] for k in ("id", "name", "icon", "color")}, "progress": game.domain_progress(d["id"], progress), "courses": courses})
    return jsonify({"domains": out, "summary": game.learner_summary(), "degrees": db.list_conferred()})


@app.route("/api/badges")
def api_badges():
    return jsonify(game.badge_catalog())


# --------------------------------------------------------------------------- routes: lesson lifecycle
@app.route("/api/lesson/<lesson_id>")
def api_lesson(lesson_id: str):
    payload = _lesson_payload(lesson_id)
    if not payload:
        return jsonify({"error": "unknown lesson"}), 404
    # auto-generate on first open (but not while the course is prerequisite-locked)
    if payload.get("lock", {}).get("locked") and payload["content"] is None:
        return jsonify(payload)
    if payload["content"] is None and payload["state"]["status"] != "generating":
        payload["state"] = _start_generation(lesson_id)
    elif payload["content"] is not None:
        _prefetch_next(lesson_id)
    return jsonify(payload)


def _prefetch_next(lesson_id: str) -> None:
    """Warm the cache for the lesson after this one so the learner rarely waits twice in a row."""
    if str(db.get_setting("prefetch_next", "1")) in ("0", "false", "False"):
        return
    ctx = curriculum.lesson_context(lesson_id)
    nxt = (ctx or {}).get("next_id")
    if not nxt or db.get_lesson_content(nxt) is not None:
        return
    with _inflight_lock:
        # never queue more than one speculative generation at a time
        if nxt in _inflight or len(_inflight) >= 2:
            return
    if not llm.available():
        return
    _start_generation(nxt)


_LESSON_ACTION = re.compile(r"^/api/lesson/(.+)/(status|generate|version/\d+|open|checkpoint|lecture_done|complete|homework|lab_run|"
                            r"feedback|chat|heartbeat|lab_draft|lab_tests|lab_result|explain)$")
_LOCKED_ACTIONS = {"generate", "open", "checkpoint", "lecture_done", "complete", "homework"}


@app.before_request
def _guard_lesson_routes():
    m = _LESSON_ACTION.match(request.path)
    if not m:
        return None
    lesson_id, action = m.group(1), m.group(2)
    meta = curriculum.lesson(lesson_id)
    if not meta:
        return jsonify({"error": "Unknown lesson."}), 404
    if request.method == "POST" and action in _LOCKED_ACTIONS:
        lock = _prereq_lock(meta["course_id"])
        if lock["locked"]:
            need = ", ".join(x["code"] for x in lock["missing"])
            return jsonify({"error": f"This course is locked until you complete its prerequisites ({need}). "
                                     "Unlock it early from the course page, or turn off prerequisite enforcement in Settings.",
                            "lock": lock}), 403
    return None


@app.route("/api/lesson/<lesson_id>/status")
def api_lesson_status(lesson_id: str):
    st = db.lesson_state(lesson_id)
    st["has_content"] = db.get_lesson_content(lesson_id) is not None
    return jsonify(st)


@app.route("/api/lesson/<lesson_id>/generate", methods=["POST"])
def api_lesson_generate(lesson_id: str):
    if not curriculum.lesson(lesson_id):
        return jsonify({"error": "unknown lesson"}), 404
    data = request.get_json(silent=True) or {}
    return jsonify(_start_generation(lesson_id, str(data.get("instruction") or "")))


@app.route("/api/lesson/<lesson_id>/version/<int:version>")
def api_lesson_version(lesson_id: str, version: int):
    content = db.get_lesson_content(lesson_id, version)
    if content is None:
        return jsonify({"error": "no such version"}), 404
    db.set_lesson_state(lesson_id, "ready", None, version)
    return jsonify({"content": content, "state": db.lesson_state(lesson_id)})


@app.route("/api/lesson/<lesson_id>/open", methods=["POST"])
def api_lesson_open(lesson_id: str):
    if not curriculum.lesson(lesson_id):
        return jsonify({"error": "unknown lesson"}), 404
    awards: list[dict] = []
    p = db.touch_progress(lesson_id)
    if p.get("first_visit"):
        _award(game.XP["lesson_open"], "lesson_open", lesson_id, awards)
    streak_xp = game.maybe_award_daily_streak()
    if streak_xp:
        awards.append({"xp": streak_xp, "reason": "streak_daily"})
    badges = _badges("lesson_open", {"lesson_id": lesson_id}) + _badges("streak")
    return jsonify({"awards": awards, "badges": badges, "progress": db.get_progress(lesson_id), "summary": game.learner_summary()})


@app.route("/api/lesson/<lesson_id>/checkpoint", methods=["POST"])
def api_checkpoint(lesson_id: str):
    data = request.get_json(silent=True) or {}
    cp_id = str(data.get("checkpoint_id") or "")
    answer = data.get("answer")
    content = db.get_lesson_content(lesson_id)
    if not content:
        return jsonify({"error": "lesson not generated"}), 400
    q = None
    for s in content.get("sections", []):
        cp = s.get("checkpoint")
        if cp and cp.get("id") == cp_id:
            q = cp
            break
    if not q:
        return jsonify({"error": "unknown checkpoint"}), 404
    ctx = curriculum.lesson_context(lesson_id)
    mult = game.level_multiplier(ctx["course"]["level"])
    result = _grade_local(q, answer)
    if result is None:
        try:
            graded = _grade_with_llm(content, [{**q, "points": 10}], {q["id"]: answer})
            result = graded.get(q["id"]) or _heuristic_grade(q, answer)
        except Exception as e:  # noqa: BLE001
            result = _heuristic_grade(q, answer)
            result["feedback"] += f" ({str(e)[:80]})"
        result["correct"] = result["score"] >= 0.7
        if not result.get("feedback"):
            result["feedback"] = q.get("explanation") or ""
        result["model_answer_summary"] = result.get("model_answer_summary") or str(q.get("answer") or "")
    progress = db.get_progress(lesson_id)
    cps = progress.get("checkpoints") or {}
    prev = cps.get(cp_id)
    awards: list[dict] = []
    first_try = prev is None
    if result["correct"] and not (prev and prev.get("correct")):
        _award(int(game.XP["checkpoint_correct"] * mult * (1.0 if first_try else 0.5)), "checkpoint_correct", lesson_id, awards)
    elif first_try:
        _award(game.XP["checkpoint_attempt"], "checkpoint_attempt", lesson_id, awards)
    if not result["correct"]:
        _record_mistake(ctx, "checkpoint", q, answer, result.get("feedback") or "")
        _enroll_srs_from_question(lesson_id, q, result.get("feedback") or "")
    cps[cp_id] = {"answer": answer, "correct": bool(result["correct"]), "score": result["score"], "attempts": (prev or {}).get("attempts", 0) + 1, "ts": time.time()}
    db.update_progress(lesson_id, checkpoints=cps)
    return jsonify({"result": result, "awards": awards, "progress": db.get_progress(lesson_id), "summary": game.learner_summary()})


def _record_mistake(ctx: dict, source: str, q: dict, learner_ans: Any, feedback: str) -> None:
    try:
        dom_id = ctx["domain"]["id"]
        qt = q.get("type", "short")
        if dom_id == "languages":
            cat = "Morphosyntax / Case / Tone Transfer"
        elif qt == "numeric":
            cat = "Quantitative / Algebraic / Sign or Unit Error"
        elif qt == "code":
            cat = "Algorithmic / Edge-Case / Implementation Bug"
        elif qt == "proof":
            cat = "Deductive / Assumption / Proof Gap"
        else:
            cat = "Conceptual Model / Boundary Misconception"
        correct_str = q["choices"][q["answer"]] if qt == "mcq" and isinstance(q.get("choices"), list) and 0 <= int(q.get("answer", 0)) < len(q["choices"]) else str(q.get("answer") or "")
        learner_str = q["choices"][int(learner_ans)] if qt == "mcq" and isinstance(q.get("choices"), list) and str(learner_ans).isdigit() and 0 <= int(learner_ans) < len(q["choices"]) else str(learner_ans or "(blank)")
        db.log_mistake(ctx["lesson"]["id"], ctx["course"]["id"], dom_id, source, q.get("question", ""), learner_str, correct_str, cat, feedback)
    except Exception:
        pass


@app.route("/api/lesson/<lesson_id>/lecture_done", methods=["POST"])
def api_lecture_done(lesson_id: str):
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    p = db.get_progress(lesson_id)
    awards: list[dict] = []
    if not p.get("lecture_done"):
        mult = game.level_multiplier(ctx["course"]["level"])
        _award(int(game.XP["lecture_complete"] * mult), "lecture_complete", lesson_id, awards)
        db.update_progress(lesson_id, lecture_done=1)
    return jsonify({"awards": awards, "progress": db.get_progress(lesson_id), "summary": game.learner_summary()})


def _complete_lesson(lesson_id: str, awards: list[dict]) -> dict:
    """Mark complete (idempotent); handles course completion rewards."""
    ctx = curriculum.lesson_context(lesson_id)
    p = db.get_progress(lesson_id)
    out = {"lesson_completed": False, "course_completed": False, "badges": []}
    if p.get("completed_at"):
        return out
    db.update_progress(lesson_id, completed_at=time.time())
    out["lesson_completed"] = True
    try:
        out["srs_added"] = _enroll_srs_from_lesson(lesson_id)
    except Exception:  # noqa: BLE001
        out["srs_added"] = 0
    mult = game.level_multiplier(ctx["course"]["level"])
    _award(int(25 * mult), "lesson_complete", lesson_id, awards)
    st = game.course_status(ctx["course"]["id"])
    if st["completed"]:
        out["course_completed"] = True
        c = curriculum.course(ctx["course"]["id"])
        _award(game.XP["course_complete"] + game.XP["course_credit_bonus"] * c["credits"], "course_complete", c["id"], awards)
        dp = game.domain_progress(c["domain_id"])
        if dp.get("degree") == "bachelor" and not db.query_one("SELECT 1 FROM xp_events WHERE reason='domain_bachelor' AND ref=?", (c["domain_id"],)):
            _award(game.XP["domain_bachelor"], "domain_bachelor", c["domain_id"], awards)
        if dp.get("degree") == "master" and not db.query_one("SELECT 1 FROM xp_events WHERE reason='domain_master' AND ref=?", (c["domain_id"],)):
            _award(game.XP["domain_master"], "domain_master", c["domain_id"], awards)
    out["badges"] = _badges("lesson_complete", {"lesson_id": lesson_id})
    return out


@app.route("/api/lesson/<lesson_id>/complete", methods=["POST"])
def api_complete(lesson_id: str):
    if not curriculum.lesson(lesson_id):
        return jsonify({"error": "unknown lesson"}), 404
    p = db.get_progress(lesson_id)
    if not p.get("lecture_done"):
        return jsonify({"error": "Finish the lecture first (scroll to the end and press 'I finished the lecture')."}), 400
    awards: list[dict] = []
    res = _complete_lesson(lesson_id, awards)
    return jsonify({**res, "awards": awards, "progress": db.get_progress(lesson_id), "summary": game.learner_summary(), "next_id": curriculum.lesson_context(lesson_id)["next_id"]})


@app.route("/api/lesson/<lesson_id>/homework", methods=["POST"])
def api_homework(lesson_id: str):
    data = request.get_json(silent=True) or {}
    answers = data.get("answers") or {}
    exec_results = data.get("exec_results") if isinstance(data.get("exec_results"), dict) else {}
    content = db.get_lesson_content(lesson_id)
    ctx = curriculum.lesson_context(lesson_id)
    if not content or not ctx:
        return jsonify({"error": "lesson not generated"}), 400
    hw = content.get("homework") or []
    grading: dict[str, dict] = {}
    llm_items = []
    for q in hw:
        a = answers.get(q["id"])
        local = _grade_local(q, a)
        if local is not None:
            grading[q["id"]] = local
        elif str(a or "").strip():
            llm_items.append(q)
        else:
            grading[q["id"]] = {"id": q["id"], "score": 0.0, "correct": False, "feedback": "No answer given.", "model_answer_summary": str(q.get("answer") or "")}
    grader_note = None
    if llm_items:
        try:
            grading.update(_grade_with_llm(content, llm_items, answers, exec_results))
        except Exception as e:  # noqa: BLE001
            grader_note = f"AI grader unavailable ({str(e)[:100]}); free-response items received provisional credit."
        for q in llm_items:
            if q["id"] not in grading:
                er = exec_results.get(q["id"]) if q.get("type") == "code" else None
                if isinstance(er, dict) and int(er.get("total") or 0) > 0:
                    ratio = max(0.0, min(1.0, int(er.get("passed") or 0) / int(er["total"])))
                    grading[q["id"]] = {"id": q["id"], "score": ratio, "correct": ratio >= 0.999, "feedback": f"Graded by unit tests: {er.get('passed')}/{er.get('total')} passed.",
                                        "model_answer_summary": str(q.get("answer") or "")}
                else:
                    grading[q["id"]] = _heuristic_grade(q, answers.get(q["id"]))
    for q in hw:
        g = grading.get(q["id"]) or {}
        if g.get("score", 0.0) < 0.7:
            _record_mistake(ctx, "homework", q, answers.get(q["id"]), g.get("feedback") or "")
    total_pts = sum(q.get("points", 10) for q in hw) or 1
    earned = sum(q.get("points", 10) * grading[q["id"]]["score"] for q in hw)
    score = earned / total_pts
    db.add_submission(lesson_id, answers, grading, score)
    prev = db.get_progress(lesson_id)
    best = max(score, prev.get("score") or 0.0)
    db.update_progress(lesson_id, score=best, homework={"score": score, "ts": time.time(), "n": len(hw)})
    awards: list[dict] = []
    mult = game.level_multiplier(ctx["course"]["level"])
    prev_score = prev.get("score") or 0.0
    first = prev.get("homework") is None
    if first:
        _award(int(game.XP["homework_base"] * score * mult), "homework", lesson_id, awards)
    elif score > prev_score:
        _award(int(game.XP["homework_base"] * (score - prev_score) * mult), "homework", lesson_id, awards)
    if score >= 0.999 and prev_score < 0.999:
        _award(int(game.XP["homework_perfect_bonus"] * mult), "homework_perfect", lesson_id, awards)
    badges = _badges("homework", {"lesson_id": lesson_id, "score": score})
    completion = {"lesson_completed": False, "course_completed": False, "badges": []}
    if db.get_progress(lesson_id).get("lecture_done"):
        completion = _complete_lesson(lesson_id, awards)
    return jsonify({"grading": grading, "score": score, "best_score": best, "grade": game.letter_grade(score), "awards": awards,
                    "badges": badges + completion["badges"], "completion": completion, "grader_note": grader_note,
                    "progress": db.get_progress(lesson_id), "summary": game.learner_summary(), "next_id": ctx["next_id"]})


@app.route("/api/lesson/<lesson_id>/lab_run", methods=["POST"])
def api_lab_run(lesson_id: str):
    awards: list[dict] = []
    data = request.get_json(silent=True) or {}
    code = re.sub(r"\s+", "", str(data.get("code") or ""))
    content = db.get_lesson_content(lesson_id) or {}
    starter = re.sub(r"\s+", "", str((content.get("lab") or {}).get("starter_code") or ""))
    modified = bool(code) and code != starter
    n = db.count("xp_events", "reason='lab_run' AND ref=?", (lesson_id,))
    if modified and n < game.LAB_PER_LESSON_CAP and data.get("ok", True):
        _award(game.XP["lab_run"], "lab_run", lesson_id, awards)
    return jsonify({"awards": awards, "badges": _badges("lab"), "summary": game.learner_summary()})


@app.route("/api/lesson/<lesson_id>/feedback", methods=["POST"])
def api_lesson_feedback(lesson_id: str):
    data = request.get_json(silent=True) or {}
    rating = data.get("rating")
    try:
        rating = int(rating) if rating is not None else None
    except (TypeError, ValueError):
        rating = None
    tags = [str(t) for t in (data.get("tags") or [])][:10]
    comment = str(data.get("comment") or "").strip()[:4000]
    fid = db.add_feedback("lesson", lesson_id, rating, tags, comment)
    awards: list[dict] = []
    if db.count("feedback", "lesson_id=?", (lesson_id,)) <= 3:
        _award(game.XP["feedback"], "feedback", lesson_id, awards)
    badges = _badges("feedback")
    state = None
    if data.get("regenerate"):
        instruction = "The learner just gave feedback (see above). Address it directly in this new version."
        state = _start_generation(lesson_id, instruction)
        db.set_feedback_status(fid, "applied")
    return jsonify({"id": fid, "awards": awards, "badges": badges, "state": state, "feedback": db.feedback_for_lesson(lesson_id), "summary": game.learner_summary()})


@app.route("/api/lesson/<lesson_id>/chat", methods=["POST"])
def api_chat(lesson_id: str):
    data = request.get_json(silent=True) or {}
    message = str(data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "empty message"}), 400
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    settings = db.all_settings()
    content = db.get_lesson_content(lesson_id)
    progress = db.get_progress(lesson_id)
    history = db.chat_history(lesson_id, 30)
    db.add_chat(lesson_id, "user", message)
    system = prompts.tutor_system(ctx, content, settings, progress)
    # build contents as alternating turns
    contents = []
    for h in history:
        contents.append({"role": "user" if h["role"] == "user" else "model", "parts": [{"text": h["content"]}]})
    contents.append({"role": "user", "parts": [{"text": message}]})
    awards: list[dict] = []
    if db.xp_reason_count("tutor_question", db.today()) < game.TUTOR_DAILY_CAP:
        _award(game.XP["tutor_question"], "tutor_question", lesson_id, awards)
    badges = _badges("chat")

    def sse(event: str, payload: Any) -> str:
        return f"event: {event}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n"

    @stream_with_context
    def generate():
        yield sse("meta", {"awards": awards, "badges": badges})
        full = []
        model_used = None
        try:
            for chunk, model in llm.stream(contents, system=system, temperature=0.6, max_tokens=4096, kind="fast"):
                model_used = model
                full.append(chunk)
                yield sse("token", {"t": chunk})
        except Exception as e:  # noqa: BLE001
            msg = str(e)[:300]
            if not full:
                # fallback: non-streaming attempt
                try:
                    text, model_used = llm.generate(contents, system=system, temperature=0.6, max_tokens=4096, kind="fast")
                    full.append(text)
                    yield sse("token", {"t": text})
                except Exception as e2:  # noqa: BLE001
                    yield sse("error", {"message": f"The professor is unreachable right now: {str(e2)[:200]}"})
                    return
            else:
                yield sse("error", {"message": f"(stream interrupted: {msg})"})
        answer = "".join(full)
        if answer.strip():
            db.add_chat(lesson_id, "model", answer)
        yield sse("done", {"model": model_used, "summary": game.learner_summary()})

    return Response(generate(), mimetype="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.route("/api/lesson/<lesson_id>/chat", methods=["DELETE"])
def api_chat_clear(lesson_id: str):
    db.clear_chat(lesson_id)
    return jsonify({"ok": True})


# --------------------------------------------------------------------------- routes: sims
@app.route("/api/sim/challenge", methods=["POST"])
def api_sim_challenge():
    data = request.get_json(silent=True) or {}
    sim_id = str(data.get("sim_id") or "")
    ch_id = str(data.get("challenge_id") or "")
    try:
        xp = max(5, min(30, int(data.get("xp") or game.XP["sim_challenge_default"])))
    except (TypeError, ValueError):
        xp = game.XP["sim_challenge_default"]
    if not sim_id or not ch_id:
        return jsonify({"error": "sim_id and challenge_id required"}), 400
    awards: list[dict] = []
    if db.complete_sim_challenge(sim_id, ch_id):
        _award(xp, "sim_challenge", f"{sim_id}:{ch_id}", awards)
    return jsonify({"awards": awards, "badges": _badges("sim"), "done": db.sim_challenges_done(sim_id), "summary": game.learner_summary()})


@app.route("/api/sims/progress")
def api_sims_progress():
    done: dict[str, list[str]] = {}
    for r in db.sim_challenges_done():
        done.setdefault(r["sim_id"], []).append(r["challenge_id"])
    return jsonify(done)


# --------------------------------------------------------------------------- routes: feedback (app-level)
@app.route("/api/feedback", methods=["GET"])
def api_feedback_list():
    items = db.all_feedback()
    for it in items:
        if it.get("lesson_id"):
            ctx = curriculum.lesson_context(it["lesson_id"])
            it["lesson_title"] = ctx["lesson"]["title"] if ctx else it["lesson_id"]
    return jsonify(items)


@app.route("/api/feedback", methods=["POST"])
def api_feedback_add():
    data = request.get_json(silent=True) or {}
    comment = str(data.get("comment") or "").strip()[:4000]
    if not comment:
        return jsonify({"error": "comment required"}), 400
    rating = data.get("rating")
    try:
        rating = int(rating) if rating is not None else None
    except (TypeError, ValueError):
        rating = None
    fid = db.add_feedback(str(data.get("scope") or "app"), data.get("lesson_id"), rating, [str(t) for t in (data.get("tags") or [])], comment)
    awards: list[dict] = []
    _award(game.XP["feedback"], "feedback", f"app:{fid}", awards)
    return jsonify({"id": fid, "awards": awards, "badges": _badges("feedback"), "summary": game.learner_summary()})


@app.route("/api/feedback/<int:fid>/status", methods=["POST"])
def api_feedback_status(fid: int):
    data = request.get_json(silent=True) or {}
    if not db.query_one("SELECT 1 FROM feedback WHERE id=?", (fid,)):
        return jsonify({"error": "Unknown feedback item."}), 404
    db.set_feedback_status(fid, str(data.get("status") or "new"), data.get("response"))
    return jsonify({"ok": True})


# --------------------------------------------------------------------------- routes: settings & voice TTS
@app.route("/api/settings", methods=["GET"])
def api_settings_get():
    s = db.all_settings()
    s["has_key"] = bool(s.get("gemini_api_key"))
    s["gemini_api_key"] = ""
    return jsonify({
        "settings": s,
        "llm": llm.status(),
        "models": llm.FALLBACK_CHAIN,
        "voices": tts.list_personas(),
    })


@app.route("/api/settings", methods=["POST"])
def api_settings_post():
    data = request.get_json(silent=True) or {}
    for key in ("learner_name", "model", "professor_notes", "onboarded", "prefetch_next", "voice_persona", "voice_engine", "voice_speed", "enforce_prereqs"):
        if key in data:
            db.set_setting(key, data[key])
    if "gemini_api_key" in data and data["gemini_api_key"] is not None:
        db.set_setting("gemini_api_key", str(data["gemini_api_key"]).strip())
    if isinstance(data.get("preferences"), dict):
        prefs = db.all_settings().get("preferences", {})
        prefs.update(data["preferences"])
        db.set_setting("preferences", prefs)
    return api_settings_get()


@app.route("/api/tts/personas")
def api_tts_personas():
    s = db.all_settings()
    return jsonify({
        "personas": tts.list_personas(),
        "voice_persona": s.get("voice_persona", tts.DEFAULT_PERSONA),
        "voice_engine": s.get("voice_engine", "gemini"),
        "voice_speed": float(s.get("voice_speed", 1.0) or 1.0),
    })


@app.route("/api/tts/speak", methods=["POST"])
def api_tts_speak():
    data = request.get_json(silent=True) or {}
    text = str(data.get("text") or "").strip()
    if not text:
        return jsonify({"error": "text required"}), 400
    persona_id = data.get("persona") or db.get_setting("voice_persona", tts.DEFAULT_PERSONA)
    engine = data.get("engine") or db.get_setting("voice_engine", "gemini")
    lang = data.get("lang")
    try:
        audio_bytes, mime, used_engine = tts.synthesize(text, persona_id=persona_id, engine=engine, lang=lang)
        return Response(
            audio_bytes,
            mimetype=mime,
            headers={
                "X-TTS-Engine": used_engine,
                "X-TTS-Persona": str(persona_id),
                "Cache-Control": "public, max-age=86400",
            },
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/tts/phrase")
def api_tts_phrase():
    text = str(request.args.get("text") or "").strip()
    lang = str(request.args.get("lang") or "en").strip()
    if not text:
        return jsonify({"error": "text required"}), 400
    try:
        mp3 = tts.synthesize_cloud_mp3(text, lang=lang)
        return Response(mp3, mimetype="audio/mpeg", headers={"Cache-Control": "public, max-age=86400"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/tts/sample/<persona_id>")
def api_tts_sample(persona_id: str):
    try:
        if persona_id not in {p_.get("id") for p_ in tts.VOICE_PERSONAS}:
            return jsonify({"error": "Unknown voice persona."}), 404
        audio_bytes, mime = tts.ensure_sample(persona_id)
        return Response(audio_bytes, mimetype=mime, headers={"Cache-Control": "public, max-age=86400"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/settings/test_llm", methods=["POST"])
def api_settings_test():
    return jsonify(llm.test_connection())


@app.route("/api/export")
def api_export():
    data = db.export_all()
    st = data.get("settings")
    if isinstance(st, dict):  # never write the API key into a portable backup file
        data["settings"] = {k: v for k, v in st.items() if "api_key" not in k}
    return jsonify(data)


@app.route("/api/reset", methods=["POST"])
def api_reset():
    data = request.get_json(silent=True) or {}
    if data.get("confirm") != "RESET":
        return jsonify({"error": "confirm with RESET"}), 400
    db.reset_all(keep_settings=True)
    return jsonify({"ok": True})


# --------------------------------------------------------------------------- routes: study-time, SRS, labs, search, backup
def _lesson_index_text(content: dict) -> str:
    parts = [content.get("subtitle") or "", content.get("hook") or "", content.get("summary") or ""]
    parts += [f"{s.get('heading', '')}\n{s.get('body', '')}" for s in content.get("sections") or []]
    parts += [f"{g.get('term', '')}: {g.get('definition', '')}" for g in content.get("glossary") or []]
    parts += [f"{w.get('title', '')} {w.get('problem', '')}" for w in content.get("worked_examples") or []]
    return "\n".join(parts)[:60000]


def _index_lesson(lesson_id: str, content: dict | None = None) -> None:
    try:
        content = content or db.get_lesson_content(lesson_id)
        if content:
            db.fts_upsert("lesson", lesson_id, content.get("title") or lesson_id, _lesson_index_text(content))
    except Exception:  # noqa: BLE001
        traceback.print_exc()


def _reindex_fts() -> None:
    """Background (re)build of the full-text index for lessons + notes generated before FTS existed."""
    if not db.FTS_AVAILABLE:
        print("[Self-Taught] SQLite FTS5 unavailable — full-text search falls back to titles only")
        return
    try:
        indexed = {r["ref"] for r in db.query("SELECT ref FROM search_fts WHERE kind='lesson'")}
        n = 0
        for lid in db.cached_lesson_ids() - indexed:
            _index_lesson(lid)
            n += 1
        notes_indexed = {r["ref"] for r in db.query("SELECT ref FROM search_fts WHERE kind='note'")}
        for note in db.list_notes():
            if str(note["id"]) not in notes_indexed:
                db.fts_upsert("note", str(note["id"]), note["title"], note["body"] + " " + " ".join(note.get("tags") or []))
                n += 1
        if n:
            print(f"[Self-Taught] full-text index: added {n} documents")
    except Exception:  # noqa: BLE001
        traceback.print_exc()


JOB_TTL_SEC = 3600
JOB_MAX = 200


def _prune_jobs() -> None:
    now_ts = time.time()
    with _jobs_lock:
        stale = [k for k, j in _jobs.items() if j.get("finished_at") and now_ts - j["finished_at"] > JOB_TTL_SEC]
        for k in stale:
            _jobs.pop(k, None)
        if len(_jobs) > JOB_MAX:
            done = sorted((j for j in _jobs.values() if j.get("finished_at")), key=lambda j: j["finished_at"])
            for j in done[: len(_jobs) - JOB_MAX]:
                _jobs.pop(j["id"], None)


def _janitor_loop() -> None:
    """Housekeeping every 10 minutes: prune finished jobs and keep the TTS audio cache under its size cap."""
    while True:
        try:
            _prune_jobs()
            res = tts.prune_cache()
            if res.get("removed"):
                print(f"[Self-Taught] TTS cache: evicted {res['removed']} files ({res['freed_mb']} MB)")
        except Exception:  # noqa: BLE001
            traceback.print_exc()
        time.sleep(600)


def _enroll_srs_from_lesson(lesson_id: str, content: dict | None = None) -> int:
    content = content or db.get_lesson_content(lesson_id)
    ctx = curriculum.lesson_context(lesson_id)
    if not content or not ctx:
        return 0
    n = 0
    for g in content.get("glossary") or []:
        if db.add_srs_card(f"Define: **{g.get('term')}**", g.get("definition") or "", lesson_id, ctx["course"]["id"], "glossary"):
            n += 1
    return n


def _enroll_srs_from_question(lesson_id: str, q: dict, feedback: str = "") -> None:
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx or not q.get("question"):
        return
    if q.get("type") == "mcq" and isinstance(q.get("choices"), list):
        try:
            ans = q["choices"][int(q.get("answer", 0))]
        except (IndexError, TypeError, ValueError):
            ans = ""
    elif q.get("type") == "numeric":
        ans = f"{q.get('answer')} {q.get('unit') or ''}".strip()
    else:
        ans = str(q.get("answer") or "")
    back = ans + (f"\n\n{q.get('explanation')}" if q.get("explanation") else (f"\n\n{feedback}" if feedback else ""))
    db.add_srs_card(q["question"], back, lesson_id, ctx["course"]["id"], "missed")


@app.route("/api/lesson/<lesson_id>/heartbeat", methods=["POST"])
def api_lesson_heartbeat(lesson_id: str):
    if not curriculum.lesson(lesson_id):
        return jsonify({"error": "unknown lesson"}), 404
    data = request.get_json(silent=True) or {}
    try:
        secs = int(data.get("seconds") or 0)
    except (TypeError, ValueError):
        secs = 0
    total = db.add_time_spent(lesson_id, secs)
    return jsonify({"time_spent": total})


@app.route("/api/lesson/<lesson_id>/lab_draft", methods=["GET", "POST", "DELETE"])
def api_lab_draft(lesson_id: str):
    if request.method == "GET":
        return jsonify({"drafts": db.get_lab_drafts(lesson_id)})
    data = request.get_json(silent=True) or {}
    slot = str(data.get("slot") or request.args.get("slot") or "lab")[:60]
    if request.method == "DELETE":
        db.delete_lab_draft(lesson_id, slot)
        return jsonify({"ok": True})
    db.save_lab_draft(lesson_id, slot, str(data.get("code") or ""))
    return jsonify({"ok": True, "saved_at": time.time()})


@app.route("/api/lesson/<lesson_id>/lab_tests", methods=["POST"])
def api_lab_tests(lesson_id: str):
    """Return hidden lab tests; generate + cache them for lessons created before tests existed."""
    content = db.get_lesson_content(lesson_id)
    if not content or not content.get("lab"):
        return jsonify({"error": "this lesson has no lab"}), 400
    lab = content["lab"]
    if (lab.get("tests") or "").strip():
        return jsonify({"tests": lab["tests"], "cached": True})
    if not llm.available():
        return jsonify({"tests": "", "error": "Auto-grading tests need the AI (no Gemini key) — run your code freely meanwhile."})
    try:
        res, _ = llm.generate_json(prompts.lab_tests_prompt(content.get("title") or "", lab), temperature=0.2, max_tokens=2048, kind="fast")
        tests = str((res or {}).get("tests") or "") if isinstance(res, dict) else ""
    except Exception as e:  # noqa: BLE001
        return jsonify({"tests": "", "error": f"Could not generate tests: {str(e)[:120]}"})
    if tests.strip():
        version = content.get("_version")
        row = db.query_one("SELECT content FROM lesson_cache WHERE lesson_id=? AND version=?", (lesson_id, version))
        if row:
            raw = json.loads(row["content"])
            if isinstance(raw.get("lab"), dict):
                raw["lab"]["tests"] = tests
                db.execute("UPDATE lesson_cache SET content=? WHERE lesson_id=? AND version=?", (json.dumps(raw, ensure_ascii=False), lesson_id, version))
    return jsonify({"tests": tests, "cached": False})


@app.route("/api/lesson/<lesson_id>/lab_result", methods=["POST"])
def api_lab_result(lesson_id: str):
    """Record the outcome of running the hidden lab tests in Pyodide; XP once when every test passes."""
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    data = request.get_json(silent=True) or {}
    passed, total = int(data.get("passed") or 0), int(data.get("total") or 0)
    awards: list[dict] = []
    all_pass = total > 0 and passed >= total
    if all_pass and not db.query_one("SELECT 1 FROM xp_events WHERE reason='lab_tests_pass' AND ref=?", (lesson_id,)):
        _award(int(game.XP["lab_tests_pass"] * game.level_multiplier(ctx["course"]["level"])), "lab_tests_pass", lesson_id, awards)
    db.log_event("lab_tests", {"lesson_id": lesson_id, "passed": passed, "total": total})
    return jsonify({"all_pass": all_pass, "awards": awards, "badges": _badges("lab") if awards else [], "summary": game.learner_summary()})


@app.route("/api/lesson/<lesson_id>/explain", methods=["POST"])
def api_explain_selection(lesson_id: str):
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    data = request.get_json(silent=True) or {}
    sel = str(data.get("selection") or "").strip()
    if not sel:
        return jsonify({"error": "nothing selected"}), 400
    if not llm.available():
        return jsonify({"explanation": "_The AI professor is offline (no Gemini key), so I can't explain this passage right now._"})
    try:
        res, _ = llm.generate_json(prompts.explain_selection_prompt(ctx["lesson"]["title"], sel, str(data.get("mode") or "simple")),
                                   system=prompts.system_professor(db.all_settings()), temperature=0.5, max_tokens=1200, kind="fast")
        return jsonify({"explanation": str((res or {}).get("explanation") or "") if isinstance(res, dict) else str(res)})
    except Exception as e:  # noqa: BLE001
        return jsonify({"error": str(e)[:200]}), 502


SRS_DAILY_XP_CAP = 40


@app.route("/api/srs")
def api_srs():
    return jsonify({"due": db.srs_due(int(request.args.get("limit") or 30)), "stats": db.srs_stats()})


@app.route("/api/srs/cards")
def api_srs_cards():
    return jsonify({"cards": db.srs_list(), "stats": db.srs_stats()})


@app.route("/api/srs/review", methods=["POST"])
def api_srs_review():
    data = request.get_json(silent=True) or {}
    card = db.srs_review(int(data.get("card_id") or 0), int(data.get("grade") if data.get("grade") is not None else 4))
    if not card:
        return jsonify({"error": "unknown card"}), 404
    awards: list[dict] = []
    if db.xp_reason_count("srs_review", db.today()) * game.XP["srs_review"] < SRS_DAILY_XP_CAP:
        _award(game.XP["srs_review"], "srs_review", str(card["id"]), awards)
    return jsonify({"card": card, "stats": db.srs_stats(), "awards": awards, "summary": game.learner_summary()})


@app.route("/api/srs/add", methods=["POST"])
def api_srs_add():
    data = request.get_json(silent=True) or {}
    if data.get("lesson_id") and not data.get("front"):
        return jsonify({"added": _enroll_srs_from_lesson(str(data["lesson_id"])), "stats": db.srs_stats()})
    ok = db.add_srs_card(str(data.get("front") or ""), str(data.get("back") or ""), data.get("lesson_id"), data.get("course_id"), str(data.get("kind") or "custom"))
    return jsonify({"added": int(ok), "stats": db.srs_stats()})


@app.route("/api/srs/<int:card_id>", methods=["DELETE"])
def api_srs_delete(card_id: int):
    db.srs_delete(card_id)
    return jsonify({"ok": True, "stats": db.srs_stats()})


@app.route("/api/srs/backfill", methods=["POST"])
def api_srs_backfill():
    """Enroll glossary terms from every completed lesson (for learners who finished lessons before SRS existed)."""
    n = sum(_enroll_srs_from_lesson(lid) for lid in db.completed_lesson_ids())
    return jsonify({"added": n, "stats": db.srs_stats()})


@app.route("/api/import", methods=["POST"])
def api_import():
    mode = (request.args.get("mode") or "replace").lower()
    if mode not in ("replace", "merge"):
        return jsonify({"error": "mode must be replace or merge"}), 400
    payload = None
    if "file" in request.files:
        try:
            payload = json.loads(request.files["file"].read().decode("utf-8"))
        except Exception as e:  # noqa: BLE001
            return jsonify({"error": f"Not valid JSON: {str(e)[:120]}"}), 400
    else:
        payload = request.get_json(silent=True)
    if mode == "replace" and request.args.get("confirm") != "RESTORE":
        return jsonify({"error": "Replace-mode restore must be confirmed with ?confirm=RESTORE"}), 400
    try:
        # always keep an automatic safety backup of the current state before overwriting it
        safety = os.path.join(os.path.dirname(os.path.abspath(db.DB_PATH)), f"pre_import_backup_{time.strftime('%Y%m%d_%H%M%S')}.json")
        with open(safety, "w", encoding="utf-8") as f:
            json.dump(db.export_all(), f)
        counts = db.import_all(payload, mode=mode, include_settings=request.args.get("settings", "1") != "0")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:  # noqa: BLE001
        traceback.print_exc()
        return jsonify({"error": f"Import failed and was rolled back: {str(e)[:200]}"}), 500
    threading.Thread(target=_reindex_fts, daemon=True).start()
    return jsonify({"ok": True, "mode": mode, "counts": counts, "safety_backup": safety, "summary": game.learner_summary()})


@app.route("/api/tts/cache", methods=["GET", "POST", "DELETE"])
def api_tts_cache():
    if request.method == "DELETE":
        return jsonify(tts.clear_cache())
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        if data.get("max_mb") is not None:
            try:
                db.set_setting("tts_cache_max_mb", max(20, int(float(data["max_mb"]))))
            except (TypeError, ValueError):
                return jsonify({"error": "max_mb must be a number"}), 400
        return jsonify(tts.prune_cache())
    return jsonify(tts.cache_stats())


# Offline Flight Pack: pre-generate this week's Super Aid lessons (and optionally their lecture audio)
_flight_lock = threading.Lock()
_flight_state: dict[str, Any] = {"running": False}


def _week_lessons(track: dict) -> list[str]:
    from datetime import date as _date, timedelta as _td
    today = _date.today()
    start = today - _td(days=today.weekday())
    end = start + _td(days=6)
    lids: list[str] = []
    for day in track.get("schedule") or []:
        try:
            d = _date.fromisoformat(str(day.get("date"))[:10])
        except ValueError:
            continue
        if start <= d <= end:
            for it in day.get("items") or []:
                if it.get("type") == "lesson" and it.get("lesson_id") and it["lesson_id"] not in lids:
                    lids.append(it["lesson_id"])
    if not lids:  # nothing scheduled this week: take the next 5 unfinished lessons in the track
        done = db.completed_lesson_ids()
        lids = [L["lesson_id"] for L in track.get("lessons") or [] if L.get("lesson_id") not in done][:5]
    return lids


def _flight_pack_job(lesson_ids: list[str], with_audio: bool) -> dict:
    st = _flight_state
    try:
        for lid in lesson_ids:
            st["current"] = lid
            if db.get_lesson_content(lid) is None:
                with _inflight_lock:
                    busy = lid in _inflight
                    if not busy:
                        _inflight.add(lid)
                if not busy:
                    db.set_lesson_state(lid, "generating", None)
                    _generate_lesson(lid)  # synchronous, one at a time to respect API rate limits
                else:
                    while lid in _inflight:
                        time.sleep(2)
            st["generated"].append(lid)
            if with_audio:
                content = db.get_lesson_content(lid) or {}
                persona = db.get_setting("voice_persona", tts.DEFAULT_PERSONA)
                engine = db.get_setting("voice_engine", "gemini")
                for sec in content.get("sections") or []:
                    try:
                        tts.synthesize(f"{sec.get('heading', '')}. {sec.get('body', '')}", persona_id=persona, engine=engine)
                        st["audio_sections"] += 1
                    except Exception as e:  # noqa: BLE001
                        st["audio_errors"] += 1
                        st["last_error"] = str(e)[:160]
        return {"generated": len(st["generated"]), "audio_sections": st["audio_sections"]}
    finally:
        st["running"] = False
        st["current"] = None
        st["finished_at"] = time.time()


@app.route("/api/aid/flight_pack", methods=["GET", "POST"])
def api_aid_flight_pack():
    if request.method == "GET":
        return jsonify(_flight_state)
    data = request.get_json(silent=True) or {}
    tracks = db.list_scholastic_tracks()
    tr = next((t for t in tracks if t.get("id") == data.get("track_id")), None) or next((t for t in tracks if t.get("active")), None)
    if not tr:
        return jsonify({"error": "No active Super Aid track — activate one first."}), 400
    lids = _week_lessons(tr)
    if not lids:
        return jsonify({"error": "No lessons scheduled for this week."}), 400
    with _flight_lock:
        if _flight_state.get("running"):
            return jsonify({"error": "A flight pack is already being prepared.", **_flight_state}), 409
        missing = [lid for lid in lids if db.get_lesson_content(lid) is None]
        if missing and not llm.available():
            return jsonify({"error": "Pre-generating lessons needs a Gemini API key (Settings)."}), 400
        _flight_state.clear()
        _flight_state.update({"running": True, "track_id": tr["id"], "lessons": lids, "missing": len(missing), "generated": [],
                              "audio": bool(data.get("audio")), "audio_sections": 0, "audio_errors": 0, "started_at": time.time()})
        job_id = _start_job("flight_pack", _flight_pack_job, lids, bool(data.get("audio")))
        _flight_state["job_id"] = job_id
    return jsonify(_flight_state)


# --------------------------------------------------------------------------- routes: designer & jobs
def _design_job(topic: str, goal: str, size: str, domain_id: str | None) -> dict:
    existing = curriculum.domain(domain_id) if domain_id else None
    prompt = prompts.design_prompt(topic, goal, size, _sims_registry, existing)
    system = prompts.system_professor(db.all_settings())
    data, model = llm.generate_json(prompt, system=system, temperature=0.6, max_tokens=24576, kind="long")
    if isinstance(data, list):
        data = next((x for x in data if isinstance(x, dict)), {})
    if not isinstance(data, dict) or not data.get("subjects"):
        raise ValueError("The designer returned an empty curriculum. Try again or make the topic more specific.")
    if existing and not existing.get("builtin"):
        data["id"] = existing["id"]
        data["name"], data["icon"], data["color"] = existing["name"], existing["icon"], existing["color"]
    elif existing and existing.get("builtin"):
        data["id"] = existing["id"] + "_plus"
        data["name"] = data.get("name") or (existing["name"] + " (Extended)")
    dom = curriculum.save_custom_domain(data)
    db.add_xp(game.XP["design_course"], "design", dom["id"])
    badges = _badges("design")
    return {"domain": {k: dom[k] for k in ("id", "name", "icon", "color", "lesson_count", "course_count")}, "model": model, "badges": badges}


@app.route("/api/design", methods=["POST"])
def api_design():
    data = request.get_json(silent=True) or {}
    topic = str(data.get("topic") or "").strip()
    if not topic:
        return jsonify({"error": "topic required"}), 400
    if not llm.available():
        return jsonify({"error": "The course designer needs a Gemini API key (Settings)."}), 400
    job_id = _start_job("design", _design_job, topic, str(data.get("goal") or ""), str(data.get("size") or "medium"), data.get("domain_id"))
    return jsonify({"job_id": job_id})


@app.route("/api/jobs/<job_id>")
def api_job(job_id: str):
    with _jobs_lock:
        job = _jobs.get(job_id)
    return (jsonify(job), 200) if job else (jsonify({"error": "unknown job"}), 404)


# --------------------------------------------------------------------------- routes: 12 Advanced Features

# 1. Interactive Prerequisite & Cross-Domain Knowledge Graph
@app.route("/api/graph")
def api_graph():
    progress = db.all_progress()
    nodes = []
    edges = []
    sim_to_courses: dict[str, list[str]] = {}
    for d in curriculum.domains():
        nodes.append({
            "id": f"dom:{d['id']}", "kind": "domain", "domain_id": d["id"],
            "label": d["name"], "icon": d["icon"], "color": d["color"],
            "courses": d["course_count"], "lessons": d["lesson_count"],
        })
        for s in d["subjects"]:
            for c in s["courses"]:
                st = game.course_status(c["id"], progress)
                nodes.append({
                    "id": c["id"], "kind": "course", "domain_id": d["id"], "subject_id": s["id"],
                    "subject_name": s["name"], "code": c["code"], "label": c["title"],
                    "level": c["level"], "credits": c["credits"], "color": d["color"],
                    "icon": s.get("icon") or d["icon"], "pct": st["pct"], "completed": st["completed"],
                })
                edges.append({"source": f"dom:{d['id']}", "target": c["id"], "kind": "belongs"})
                for p in c.get("prerequisites") or []:
                    edges.append({"source": p, "target": c["id"], "kind": "prerequisite"})
                for m in c.get("modules") or []:
                    if m.get("sim"):
                        sim_to_courses.setdefault(m["sim"], []).append(c["id"])
    # Cross-domain conceptual bridges via shared simulation models
    seen_bridges = set()
    for sim_id, cids in sim_to_courses.items():
        uniq = list(dict.fromkeys(cids))
        for i in range(min(len(uniq), 6)):
            for j in range(i + 1, min(len(uniq), 6)):
                c1, c2 = curriculum.course(uniq[i]), curriculum.course(uniq[j])
                if c1 and c2 and c1["domain_id"] != c2["domain_id"]:
                    pair = tuple(sorted((uniq[i], uniq[j])))
                    if pair not in seen_bridges and len(seen_bridges) < 90:
                        seen_bridges.add(pair)
                        edges.append({"source": pair[0], "target": pair[1], "kind": "bridge", "sim": sim_id})
    return jsonify({"nodes": nodes, "edges": edges})


# 2. Viva Voce (Two-Way Oral Defense)
@app.route("/api/viva_voce/start", methods=["POST"])
def api_viva_start():
    data = request.get_json(silent=True) or {}
    lesson_id = str(data.get("lesson_id") or "")
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    lesson = db.get_lesson_content(lesson_id)
    title = (lesson or {}).get("title") or ctx["lesson"]["title"]
    fallback = {
        "opening_statement": f"Welcome to your Viva Voce oral defense on {title}. Speak clearly and reason from first principles.",
        "questions": [
            {"id": "v1", "stage": "Intuition & Core Principle", "question": f"In your own words, what is the fundamental intuition behind {title}, and what problem does it solve?", "key_points": ["Core definition", "Physical or structural intuition", "Why simpler approaches fail"]},
            {"id": "v2", "stage": "Formal Mechanism & Proof", "question": f"Walk me through the governing equation, algorithm, or structural rule in {ctx['module']['title']} and explain what each term represents.", "key_points": ["Formal mechanism", "Role of parameters", "Assumptions"]},
            {"id": "v3", "stage": "Edge Case & Synthesis", "question": f"Where does this model or principle break down in extreme regimes, and how does it connect to {ctx['course']['title']}?", "key_points": ["Boundary or limiting case", "Connection to broader course"]},
        ],
    }
    if llm.available():
        try:
            res, _ = llm.generate_json(prompts.viva_voce_prompt(ctx, lesson), system=prompts.system_professor(db.all_settings()), temperature=0.5, max_tokens=2048, kind="fast")
            if isinstance(res, dict) and res.get("questions"):
                return jsonify(res)
        except Exception:
            pass
    return jsonify(fallback)


MAX_SOCRATIC_ROUNDS = 3


def _clean_history(raw: Any) -> list[dict]:
    out = []
    for h in raw if isinstance(raw, list) else []:
        if isinstance(h, dict) and str(h.get("text") or "").strip():
            out.append({"role": str(h.get("role") or "scholar")[:20], "text": str(h.get("text"))[:2000]})
    return out[-12:]


@app.route("/api/viva_voce/respond", methods=["POST"])
def api_viva_respond():
    data = request.get_json(silent=True) or {}
    lesson_id = str(data.get("lesson_id") or "")
    question = str(data.get("question") or "")
    key_points = data.get("key_points") or []
    transcript = str(data.get("transcript") or "").strip()
    history = _clean_history(data.get("history"))
    round_no = max(1, min(MAX_SOCRATIC_ROUNDS, int(data.get("round") or 1)))
    if not transcript:
        return jsonify({"error": "Please speak or type your defense response first."}), 400
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    eval_res = None
    if llm.available():
        try:
            eval_res, _ = llm.generate_json(prompts.viva_voce_eval_prompt(ctx, question, key_points, transcript, history, round_no, MAX_SOCRATIC_ROUNDS),
                                            system=prompts.system_professor(db.all_settings()), temperature=0.4, max_tokens=2048, kind="fast")
        except Exception:
            eval_res = None
    if not isinstance(eval_res, dict) or "score" not in eval_res:
        words = len(transcript.split()) + sum(len(h["text"].split()) for h in history if h["role"] == "scholar")
        sc = min(0.95, max(0.35, words / 45.0))
        eval_res = {
            "score": round(sc, 2),
            "verdict": "Pass with Distinction" if sc >= 0.85 else ("Pass" if sc >= 0.65 else "Needs Refinement"),
            "spoken_feedback": f"Thank you for that defense. You articulated {words} words of reasoning on {ctx['lesson']['title']}. To sharpen it further, explicitly tie the limiting behavior back to the governing invariants.",
            "strengths": ["Clear spoken structure", "Addressed the core prompt"],
            "gaps": ["Include quantitative limiting cases"],
            "resolved": round_no >= 2 or sc >= 0.85,
            "follow_up": None if (round_no >= 2 or sc >= 0.85) else "Push one step further: what happens to your argument in the most extreme limiting case you can think of?",
        }
    follow_up = eval_res.get("follow_up")
    if not isinstance(follow_up, str) or not follow_up.strip() or str(follow_up).lower() == "null":
        follow_up = None
    resolved = bool(eval_res.get("resolved")) or follow_up is None or round_no >= MAX_SOCRATIC_ROUNDS
    eval_res["follow_up"] = None if resolved else follow_up
    eval_res["resolved"] = resolved
    eval_res["round"] = round_no
    score = max(0.0, min(1.0, float(eval_res.get("score") or 0.7)))
    awards: list[dict] = []
    badges: list[dict] = []
    if resolved:  # XP once per question, on the final round, based on the cumulative score
        _award(int(game.XP["viva_voce"] * score), "viva_voce", lesson_id, awards)
        badges = _badges("viva_voce", {"lesson_id": lesson_id, "score": score})
    # persist the defense transcript
    session_id = data.get("session_id")
    try:
        sess = db.get_session(int(session_id)) if session_id else None
    except (TypeError, ValueError):
        sess = None
    sdata = (sess or {}).get("data") or {"questions": {}, "opening": data.get("opening") or ""}
    qkey = str(data.get("question_id") or question[:60])
    qrec = sdata["questions"].setdefault(qkey, {"question": question, "turns": []})
    qrec["turns"].append({"role": "scholar", "text": transcript})
    qrec["turns"].append({"role": "examiner", "text": eval_res.get("spoken_feedback") or "", "follow_up": eval_res["follow_up"], "score": score})
    qrec["final"] = {"score": score, "verdict": eval_res.get("verdict")} if resolved else qrec.get("final")
    sid = db.save_session("viva", lesson_id, sdata, f"Viva Voce: {ctx['lesson']['title']}", sess["id"] if sess else None)
    return jsonify({"evaluation": eval_res, "awards": awards, "badges": badges, "summary": game.learner_summary(), "session_id": sid})


# 3. Feynman Student Mode (Teach-Back to an AI Novice)
@app.route("/api/feynman/start", methods=["POST"])
def api_feynman_start():
    data = request.get_json(silent=True) or {}
    lesson_id = str(data.get("lesson_id") or "")
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    lesson = db.get_lesson_content(lesson_id)
    title = (lesson or {}).get("title") or ctx["lesson"]["title"]
    fallback = {
        "student_name": "Alex (Confused Undergrad)",
        "misconception_statement": f"Hey! I was reading our lecture notes on **{title}**, and I thought we could just treat every variable as linear and independent without worrying about boundary constraints or coupling. Why do we need the full formalism here? Can you explain where my shortcut goes wrong?",
        "hidden_flaw": "Assuming linearity/independence and ignoring coupling or boundary conditions.",
        "target_concepts": [title, ctx["module"]["title"], "Intuitive physical or logical counterexample"],
    }
    if llm.available():
        try:
            res, _ = llm.generate_json(prompts.feynman_start_prompt(ctx, lesson), system=prompts.system_professor(db.all_settings()), temperature=0.6, max_tokens=1500, kind="fast")
            if isinstance(res, dict) and res.get("misconception_statement"):
                return jsonify(res)
        except Exception:
            pass
    return jsonify(fallback)


@app.route("/api/feynman/evaluate", methods=["POST"])
def api_feynman_evaluate():
    data = request.get_json(silent=True) or {}
    lesson_id = str(data.get("lesson_id") or "")
    misconception = str(data.get("misconception") or "")
    hidden_flaw = str(data.get("hidden_flaw") or "")
    explanation = str(data.get("explanation") or "").strip()
    history = _clean_history(data.get("history"))
    round_no = max(1, min(MAX_SOCRATIC_ROUNDS, int(data.get("round") or 1)))
    if not explanation:
        return jsonify({"error": "Write or speak your explanation to Alex first."}), 400
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    res = None
    if llm.available():
        try:
            res, _ = llm.generate_json(prompts.feynman_eval_prompt(ctx, misconception, hidden_flaw, explanation, history, round_no, MAX_SOCRATIC_ROUNDS),
                                       system=prompts.system_professor(db.all_settings()), temperature=0.4, max_tokens=2048, kind="fast")
        except Exception:
            res = None
    if not isinstance(res, dict) or "score" not in res:
        words = len(explanation.split()) + sum(len(h["text"].split()) for h in history if h["role"] == "scholar")
        sc = min(0.95, max(0.4, words / 50.0))
        pct = int(round(sc * 100))
        done = round_no >= 2 or sc >= 0.85
        res = {
            "score": round(sc, 2),
            "clarity_score": pct,
            "accuracy_score": pct,
            "intuition_score": max(65, pct - 3),
            "student_reply": f"Aha! That makes way more sense now — I see why my naive assumption breaks down in {ctx['lesson']['title']}. Thanks for walking me through the concrete example!" if done else "Hmm, I think I'm getting there... but can you give me a concrete everyday example? I still can't picture it.",
            "professor_critique": "Solid pedagogical breakdown. You identified the student's flawed assumption and replaced it with a concrete mental model.",
            "resolved": done,
            "follow_up_question": None if done else "Can you give me a concrete everyday example?",
        }
    fq = res.get("follow_up_question")
    if not isinstance(fq, str) or not fq.strip() or fq.lower() == "null":
        fq = None
    resolved = bool(res.get("resolved")) or fq is None or round_no >= MAX_SOCRATIC_ROUNDS
    res["follow_up_question"] = None if resolved else fq
    res["resolved"] = resolved
    res["round"] = round_no
    score = max(0.0, min(1.0, float(res.get("score") or 0.75)))
    awards: list[dict] = []
    badges: list[dict] = []
    if resolved:
        _award(int(game.XP["feynman_teach"] * score), "feynman_teach", lesson_id, awards)
        badges = _badges("feynman", {"lesson_id": lesson_id, "score": score})
    session_id = data.get("session_id")
    try:
        sess = db.get_session(int(session_id)) if session_id else None
    except (TypeError, ValueError):
        sess = None
    sdata = (sess or {}).get("data") or {"misconception": misconception, "hidden_flaw": hidden_flaw, "turns": []}
    sdata["turns"].append({"role": "scholar", "text": explanation})
    sdata["turns"].append({"role": "alex", "text": res.get("student_reply") or "", "follow_up": res["follow_up_question"], "score": score})
    if resolved:
        sdata["final"] = {k: res.get(k) for k in ("score", "clarity_score", "accuracy_score", "intuition_score", "professor_critique")}
    sid = db.save_session("feynman", lesson_id, sdata, f"Feynman: {ctx['lesson']['title']}", sess["id"] if sess else None)
    return jsonify({"evaluation": res, "awards": awards, "badges": badges, "summary": game.learner_summary(), "session_id": sid})


# Saved sessions (podcasts, viva defenses, feynman teach-backs)
@app.route("/api/sessions")
def api_sessions():
    return jsonify({"sessions": db.list_sessions(request.args.get("kind"), request.args.get("lesson_id"), int(request.args.get("limit") or 50))})


@app.route("/api/sessions/<int:session_id>", methods=["GET", "DELETE"])
def api_session_item(session_id: int):
    if request.method == "DELETE":
        db.delete_session(session_id)
        return jsonify({"ok": True})
    sess = db.get_session(session_id)
    return (jsonify(sess), 200) if sess else (jsonify({"error": "not found"}), 404)


# 4. Commute / Hands-Free 2-Host Podcast Generator
@app.route("/api/podcast/<lesson_id>", methods=["POST"])
def api_podcast(lesson_id: str):
    ctx = curriculum.lesson_context(lesson_id)
    if not ctx:
        return jsonify({"error": "unknown lesson"}), 404
    body = request.get_json(silent=True) or {}
    if not body.get("regenerate"):
        cached = db.list_sessions("podcast", lesson_id, 1)
        if cached and cached[0]["data"].get("turns"):
            return jsonify({**cached[0]["data"], "cached": True, "session_id": cached[0]["id"]})
    lesson = db.get_lesson_content(lesson_id)
    title = (lesson or {}).get("title") or ctx["lesson"]["title"]
    mod_title = ctx["module"]["title"]
    fallback = {
        "title": f"Faculty Roundtable: {title}",
        "turns": [
            {"speaker": "Dr. Claire Evans", "persona": "claire_evans", "text": f"Welcome to the Self-Taught Faculty Podcast. Today Arthur and I are unpacking {title}, a cornerstone of {ctx['course']['code']} {ctx['course']['title']}."},
            {"speaker": "Prof. Arthur Pendleton", "persona": "arthur_pendleton", "text": f"And what makes {title} so fascinating, Claire, is how it bridges the intuition of {mod_title} with rigorous predictive power."},
            {"speaker": "Dr. Claire Evans", "persona": "claire_evans", "text": f"Exactly. When students first encounter {title}, they often focus on the surface notation rather than the underlying conservation or invariance principle."},
            {"speaker": "Prof. Arthur Pendleton", "persona": "arthur_pendleton", "text": "Spot on. If you perturb the boundary conditions in the interactive simulation, you immediately see how the system's phase behavior responds."},
            {"speaker": "Dr. Claire Evans", "persona": "claire_evans", "text": f"Let's highlight the practical takeaway: whenever you apply {title}, check the assumptions first, verify the limiting regime, and test a concrete case."},
            {"speaker": "Prof. Arthur Pendleton", "persona": "arthur_pendleton", "text": "Try the Fault-Injection Lab and Viva Voce defense next — there is no better test of mastery than diagnosing a live anomaly."},
        ],
    }
    if llm.available():
        try:
            res, _ = llm.generate_json(prompts.podcast_prompt(ctx, lesson), system=prompts.system_professor(db.all_settings()), temperature=0.6, max_tokens=2400, kind="fast")
            if isinstance(res, dict) and isinstance(res.get("turns"), list) and len(res["turns"]) >= 2:
                sid = db.save_session("podcast", lesson_id, res, res.get("title"))
                return jsonify({**res, "cached": False, "session_id": sid})
        except Exception:
            pass
    return jsonify(fallback)


# 5. Paper / PDF / Repo / Notes Ingestion into a Course
def _ingest_job(title: str, raw_text: str, domain_id: str | None) -> dict:
    prompt = prompts.ingest_document_prompt(title, raw_text, domain_id, _sims_registry)
    system = prompts.system_professor(db.all_settings())
    data, model = llm.generate_json(prompt, system=system, temperature=0.5, max_tokens=20000, kind="long")
    if isinstance(data, list):
        data = next((x for x in data if isinstance(x, dict)), {})
    if not isinstance(data, dict) or not data.get("subjects"):
        raise ValueError("Ingestion returned an empty curriculum structure.")
    dom = curriculum.save_custom_domain(data)
    db.add_xp(game.XP["paper_ingested"], "paper_ingested", dom["id"])
    badges = _badges("design")
    return {"domain": {k: dom[k] for k in ("id", "name", "icon", "color", "lesson_count", "course_count")}, "model": model, "badges": badges}


@app.route("/api/ingest", methods=["POST"])
def api_ingest():
    data = request.get_json(silent=True) or {}
    title = str(data.get("title") or "Ingested Seminar").strip()
    raw_text = str(data.get("text") or "").strip()
    if not raw_text:
        return jsonify({"error": "Please paste or upload paper/syllabus/repository text to ingest."}), 400
    if not llm.available():
        # Instant deterministic ingestion fallback if offline
        slug = re.sub(r"[^a-z0-9]+", "_", title.lower()).strip("_")[:24] or "custom_ingest"
        lines = [ln.strip("#*- \t") for ln in raw_text.splitlines() if len(ln.strip()) > 8][:16]
        while len(lines) < 8:
            lines.append(f"{title} — Core Topic {len(lines) + 1}")
        dom_obj = {
            "id": f"ingest_{slug}", "name": title, "icon": "📄", "color": "#38bdf8",
            "tagline": f"Custom ingested course from {title}", "description": raw_text[:260],
            "subjects": [{
                "id": f"{slug}_subj", "name": title, "icon": "📄", "description": "Ingested technical seminar.",
                "courses": [{
                    "id": f"{slug}_301", "code": "ING 301", "title": title, "level": 300, "credits": 4,
                    "prerequisites": [], "description": raw_text[:240],
                    "modules": [
                        {"id": "mod_foundations", "title": "Foundations & Architecture", "summary": "Core concepts extracted from source.", "sim": "graph_algo", "lab": True, "lessons": lines[:4]},
                        {"id": "mod_mechanisms", "title": "Formal Mechanisms & Analysis", "summary": "Deep analysis of source methods.", "sim": "ode_phase", "lab": True, "lessons": lines[4:8]},
                    ],
                }],
            }],
        }
        dom = curriculum.save_custom_domain(dom_obj)
        db.add_xp(game.XP["paper_ingested"], "paper_ingested", dom["id"])
        return jsonify({"domain": {k: dom[k] for k in ("id", "name", "icon", "color", "lesson_count", "course_count")}})
    job_id = _start_job("ingest", _ingest_job, title, raw_text, data.get("domain_id"))
    return jsonify({"job_id": job_id})


# 6. Timed Midterm, Final & Qualifying Exam Simulator
@app.route("/api/exams/generate", methods=["POST"])
def api_exam_generate():
    data = request.get_json(silent=True) or {}
    degree_id = str(data.get("degree_id") or "")
    if degree_id:
        return _degree_exam_generate(degree_id)
    course_id = str(data.get("course_id") or "")
    c = curriculum.course(course_id)
    if not c:
        return jsonify({"error": "Unknown course."}), 404
    lesson_titles = [t for m in c["modules"] for t in m["lessons"]]
    scope_title = f"{c['code']} {c['title']}"
    test_out = bool(data.get("test_out"))
    fallback_qs = [
        {"id": "ex1", "type": "mcq", "points": 15, "question": f"Which structural invariant or assumption is most critical when analyzing **{lesson_titles[0]}** in {scope_title}?", "choices": ["Conservation / structural invariance across transformations", "Ignoring all boundary conditions", "Assuming all variables are constant zero", "Replacing non-linear coupling with random noise"], "answer": 0, "explanation": "First-principles analysis relies on identifying the conserved or invariant quantities across state transitions."},
        {"id": "ex2", "type": "mcq", "points": 15, "question": f"In **{c['modules'][min(1, len(c['modules'])-1)]['title']}**, what happens when the primary feedback or coupling gain exceeds the stability threshold?", "choices": ["The system undergoes bifurcation, oscillation, or divergence", "Nothing changes in the phase portrait", "All eigenvalues become strictly zero", "The dimensionality collapses to zero"], "answer": 0, "explanation": "Crossing critical gain thresholds shifts eigenvalues across the stability boundary."},
        {"id": "ex3", "type": "numeric", "points": 15, "question": "Suppose a normalized response decays exponentially as $y(t) = 100 \\cdot e^{-0.5 t}$. What is $y(2)$ (to two decimal places)?", "answer": 36.79, "tolerance": 0.25, "unit": "", "explanation": "$100 \\cdot e^{-1} \\approx 36.79$."},
        {"id": "ex4", "type": "numeric", "points": 15, "question": "A 2×2 diagonal system has eigenvalues $\\lambda_1 = 4$ and $\\lambda_2 = 9$. What is its determinant $\\det(A) = \\lambda_1 \\lambda_2$?", "answer": 36.0, "tolerance": 0.1, "unit": "", "explanation": "The determinant equals the product of the eigenvalues: $4 \\times 9 = 36$."},
        {"id": "ex5", "type": "short", "points": 20, "question": f"Synthesize how **{lesson_titles[0]}** connects to **{lesson_titles[-1]}** across {scope_title}, and give one concrete application.", "answer": "Connect foundational definitions to advanced synthesis with a concrete real-world example.", "rubric": "Clear conceptual bridge, formal accuracy, and concrete example.", "explanation": "Full marks for linking the introductory axioms to the final module's synthesis."},
        {"id": "ex6", "type": "short", "points": 20, "question": f"Describe a failure mode or edge case in **{c['modules'][-1]['title']}** and explain how you would diagnose and mitigate it.", "answer": "Identify a boundary failure mode, diagnostic metric, and stabilization strategy.", "rubric": "Specific failure mode + quantitative diagnostic + mitigation.", "explanation": "Engineering and theoretical mastery requires knowing where models fail."},
    ]
    if llm.available():
        try:
            res, _ = llm.generate_json(prompts.exam_generate_prompt(scope_title, lesson_titles, c["level"], test_out=test_out), system=prompts.system_professor(db.all_settings()), temperature=0.5, max_tokens=6144 if test_out else 4096, kind="fast")
            if isinstance(res, dict) and isinstance(res.get("questions"), list) and len(res["questions"]) >= 3:
                qs = [prompts._norm_question(q, f"ex{i+1}") for i, q in enumerate(res["questions"])]
                for i, q in enumerate(qs):
                    q["points"] = int(res["questions"][i].get("points") or 15)
                return _issue_paper({"course_id": c["id"], "title": res.get("title") or f"{scope_title} — Examination", "duration_minutes": int(res.get("duration_minutes") or (45 if test_out else 25)), "questions": qs, "test_out": test_out})
            n_q = len(res["questions"]) if isinstance(res, dict) and isinstance(res.get("questions"), list) else 0
            ai_error = f"the AI returned an incomplete paper ({n_q} usable questions)"
        except Exception as e:  # noqa: BLE001
            ai_error = str(e)[:200]
        app.logger.warning("exam generation failed for %s: %s", c["id"], ai_error)
        if test_out:
            return jsonify({"error": f"The AI could not generate the test-out exam right now ({ai_error[:120]}). Please try again in a minute."}), 502
    else:
        ai_error = "no Gemini API key configured"
    if test_out:
        return jsonify({"error": "Test-out exams must be generated by the AI so they genuinely cover this course. Add a Gemini API key (Settings) and try again."}), 400
    return _issue_paper({"course_id": c["id"], "title": f"{scope_title} — Official Examination", "duration_minutes": 25, "questions": fallback_qs,
                    "fallback": True, "notice": f"The AI examiner is unavailable ({ai_error[:120]}), so this is a generic practice paper rather than one written for this course."})


_EXAM_PAPERS: "dict[str, dict]" = {}
_EXAM_PAPERS_LOCK = threading.Lock()


def _issue_paper(payload: dict):
    """Keep the generated paper server-side so grading uses the real questions/answer keys, not what the client
    posts back (prevents forged test-out / degree-exam papers). Returns the JSON response with a paper_id."""
    pid = uuid.uuid4().hex
    with _EXAM_PAPERS_LOCK:
        _EXAM_PAPERS[pid] = {"questions": payload.get("questions") or [], "course_id": payload.get("course_id") or "",
                             "degree_id": payload.get("degree_id") or "", "test_out": bool(payload.get("test_out")),
                             "title": payload.get("title") or "", "ts": time.time()}
        while len(_EXAM_PAPERS) > 200:
            _EXAM_PAPERS.pop(next(iter(_EXAM_PAPERS)))
    out = {**payload, "paper_id": pid}
    if payload.get("test_out") or payload.get("degree_id"):
        # credit-bearing papers: answer keys stay on the server (returned with the grading after submission)
        out["questions"] = [{k: v for k, v in q.items() if k not in ("answer", "explanation", "rubric", "tolerance")}
                            for q in (payload.get("questions") or []) if isinstance(q, dict)]
    return jsonify(out)


TEST_OUT_THRESHOLD = 0.85
TEST_OUT_MIN_QUESTIONS = 8


@app.route("/api/exams/submit", methods=["POST"])
def api_exam_submit():
    data = request.get_json(silent=True) or {}
    course_id = str(data.get("course_id") or "")
    title = str(data.get("title") or "Course Examination")
    duration_sec = int(data.get("duration_sec") or 1500)
    elapsed_sec = int(data.get("elapsed_sec") or 0)
    questions = [q for q in (data.get("questions") or []) if isinstance(q, dict) and q.get("id")]
    answers = data.get("answers") or {}
    test_out = bool(data.get("test_out"))
    degree_id = str(data.get("degree_id") or "")
    paper_id = str(data.get("paper_id") or "")
    with _EXAM_PAPERS_LOCK:
        paper = _EXAM_PAPERS.pop(paper_id, None) if paper_id else None
    if paper:
        questions = [q for q in paper["questions"] if isinstance(q, dict) and q.get("id")]
        course_id, degree_id, test_out = paper["course_id"], paper["degree_id"], paper["test_out"]
        title = paper["title"] or title
    elif test_out or degree_id:
        return jsonify({"error": "This examination session has expired or was already submitted (the server may have restarted). "
                                 "Please generate a new paper."}), 400
    if not isinstance(answers, dict):
        return jsonify({"error": "answers must be an object mapping question id to answer"}), 400
    if degree_id:
        if not degrees.get(degree_id):
            return jsonify({"error": "Unknown degree."}), 404
        test_out = False
        course_id = ""
    elif course_id and not curriculum.course(course_id):
        return jsonify({"error": "Unknown course."}), 404
    if not questions:
        return jsonify({"error": "No questions submitted."}), 400
    for q in questions:
        try:
            q["points"] = max(0, int(q.get("points") or 15))
        except (TypeError, ValueError):
            q["points"] = 15
    c = curriculum.course(course_id)
    grading: dict[str, dict] = {}
    llm_items: list[dict] = []
    for q in questions:
        a = answers.get(q["id"])
        local = _grade_local(q, a)
        if local is not None:
            grading[q["id"]] = local
        elif str(a or "").strip():
            llm_items.append({**q, "points": int(q.get("points") or 15)})
        else:
            grading[q["id"]] = {"id": q["id"], "score": 0.0, "correct": False, "feedback": "No answer given.",
                                "model_answer_summary": str(q.get("answer") or "")}
    grader_note = None
    if llm_items:
        exam_ctx = {"title": title, "objectives": [f"{c['code']} {c['title']}" if c else title]}
        try:
            grading.update(_grade_with_llm(exam_ctx, llm_items, answers))
        except Exception as e:  # noqa: BLE001
            grader_note = f"AI grader unavailable ({str(e)[:100]}); written answers received provisional credit."
        for q in llm_items:
            if q["id"] not in grading:
                grading[q["id"]] = _heuristic_grade(q, answers.get(q["id"]))
    for q in questions:
        g = grading[q["id"]]
        if not g.get("model_answer_summary"):
            g["model_answer_summary"] = str(q.get("answer") or "")
        if not g.get("correct") and c:
            db.log_mistake(None, c["id"], c["domain_id"], "exam", q.get("question", ""), answers.get(q["id"]), q.get("answer"),
                           "Examination Synthesis Gap", g.get("feedback", ""))
    total_pts = sum(int(q.get("points") or 15) for q in questions) or 1
    earned = sum(int(q.get("points") or 15) * float(grading[q["id"]]["score"]) for q in questions)
    score = earned / total_pts
    grade = game.letter_grade(score)
    provisional = any(g.get("pending") for g in grading.values())
    scope_type = "degree" if degree_id else ("test_out" if test_out else "course")
    exam_id = db.add_exam_attempt(scope_type, degree_id or course_id, title, duration_sec, elapsed_sec, questions, answers, grading, score, grade)
    awards: list[dict] = []
    _award(int(game.XP["exam_base"] * score), "exam", degree_id or course_id, awards)
    badges = _badges("exam", {"score": score})
    credit = None
    if test_out and c:
        already = game.course_status(c["id"])["completed"]
        if already:
            credit = {"granted": False, "reason": "You have already earned credit for this course."}
        elif provisional:
            credit = {"granted": False, "reason": "The AI grader was unavailable, so written answers were only provisionally scored. Retake the test-out exam when the AI is online to earn credit."}
        elif len(questions) < TEST_OUT_MIN_QUESTIONS:
            credit = {"granted": False, "reason": f"A test-out paper must contain at least {TEST_OUT_MIN_QUESTIONS} questions — generate a full Credit-by-Examination paper."}
        elif score >= TEST_OUT_THRESHOLD and db.grant_course_credit(c["id"], "exam", score, exam_id):
            _award(game.XP["course_test_out"] + game.XP["course_credit_bonus"] * int(c["credits"]), "course_test_out", c["id"], awards)
            dp = game.domain_progress(c["domain_id"])
            if dp.get("degree") == "bachelor" and not db.query_one("SELECT 1 FROM xp_events WHERE reason='domain_bachelor' AND ref=?", (c["domain_id"],)):
                _award(game.XP["domain_bachelor"], "domain_bachelor", c["domain_id"], awards)
            if dp.get("degree") == "master" and not db.query_one("SELECT 1 FROM xp_events WHERE reason='domain_master' AND ref=?", (c["domain_id"],)):
                _award(game.XP["domain_master"], "domain_master", c["domain_id"], awards)
            badges += _badges("lesson_complete", {"lesson_id": None})
            credit = {"granted": True, "reason": f"Credit by examination granted for {c['code']} ({c['credits']} credits)."}
        else:
            credit = {"granted": False, "reason": f"Test-out requires at least {int(TEST_OUT_THRESHOLD * 100)}%. You scored {round(score * 100)}% — review and try again."}
    degree_exam = None
    if degree_id:
        sp = degrees.get(degree_id)
        need = ((sp or {}).get("exam") or {}).get("pass", degrees.EXAM_PASS)
        degree_exam = {"passed": score >= need and not provisional, "pass": need,
                       "reason": ("Passed! This counts toward your degree audit." if score >= need and not provisional else
                                  ("The AI grader was unavailable, so this attempt was only provisionally scored." if provisional else
                                   f"Passing requires {round(need * 100)}%. Review and try again."))}
        if provisional:  # provisional attempts must not satisfy graduation requirements
            db.execute("UPDATE exam_attempts SET scope_type='degree_provisional' WHERE id=?", (exam_id,))
    return jsonify({"exam_id": exam_id, "score": score, "grade": grade, "grading": grading, "awards": awards, "badges": badges,
                    "grader_note": grader_note, "credit": credit, "degree_exam": degree_exam, "summary": game.learner_summary()})


@app.route("/api/exams/history")
def api_exam_history():
    return jsonify({"attempts": db.list_exam_attempts(30), "courses": [{"id": c["id"], "code": c["code"], "title": c["title"], "domain_id": c["domain_id"], "level": c["level"]} for c in curriculum.courses().values()]})


# 7. Personal LaTeX + Code Zettelkasten ("Scholar's Notebook")
@app.route("/api/notebook", methods=["GET", "POST"])
def api_notebook():
    if request.method == "GET":
        lesson_id = request.args.get("lesson_id")
        notes = db.list_notes(lesson_id)
        return jsonify({"notes": notes})
    data = request.get_json(silent=True) or {}
    title = str(data.get("title") or "Untitled Note").strip()
    body = str(data.get("body") or "").strip()
    tags = [str(t).strip() for t in (data.get("tags") or []) if str(t).strip()]
    lesson_id = data.get("lesson_id")
    course_id = data.get("course_id")
    note_id = data.get("id")
    if note_id not in (None, "", 0):
        note_id = int(note_id)
        if not db.get_note(note_id):
            return jsonify({"error": "Unknown note."}), 404
    tags = tags if isinstance(data.get("tags") or [], list) else []
    note = db.save_note(title, body, tags, lesson_id, course_id, note_id)
    awards: list[dict] = []
    if not note_id:
        _award(game.XP["note_created"], "note_created", str(note.get("id")), awards)
    badges = _badges("note")
    return jsonify({"note": note, "awards": awards, "badges": badges, "summary": game.learner_summary()})


@app.route("/api/notebook/<int:note_id>", methods=["DELETE"])
def api_notebook_delete(note_id: int):
    db.delete_note(note_id)
    return jsonify({"ok": True})


# 8. Mistake Autopsy & Error-Taxonomy Journal
@app.route("/api/autopsy")
def api_autopsy():
    mistakes = db.list_mistakes(limit=100)
    by_cat: dict[str, int] = {}
    for m in mistakes:
        cat = m.get("category") or "Uncategorized"
        by_cat[cat] = by_cat.get(cat, 0) + 1
    return jsonify({"mistakes": mistakes, "taxonomy": by_cat})


@app.route("/api/autopsy/drill", methods=["POST"])
def api_autopsy_drill():
    data = request.get_json(silent=True) or {}
    mid = int(data.get("mistake_id") or 0)
    mistakes = db.list_mistakes(limit=200)
    m = next((x for x in mistakes if x["id"] == mid), None)
    if not m:
        return jsonify({"error": "Mistake record not found"}), 404
    fallback = {
        "autopsy": f"**Root-Cause Diagnosis ({m['category']})**: You answered `{m.get('learner_answer')}` whereas the target invariant requires `{m.get('correct_answer')}`. This typically happens when an implicit sign, unit, or boundary condition is skipped during setup.",
        "drills": [
            {"id": "d1", "type": "mcq", "question": f"To avoid repeating the **{m['category']}** trap on `{m['question'][:120]}...`, what should you verify first?", "choices": [f"Verify the target invariant / reference answer ({str(m.get('correct_answer'))[:60]}) and check limiting cases", "Skip dimensional and boundary checks", "Invert the sign without checking", "Assume zero coupling"], "answer": 0, "explanation": "Checking dimensional consistency and boundary invariants catches 90% of recurring errors."},
            {"id": "d2", "type": "mcq", "question": "When checking your derivation or code before submission, which sanity test is strongest?", "choices": ["Substitute an extreme or known-answer limiting case ($0, 1, \\infty$) and verify it matches", "Re-read the same line without testing values", "Guess the middle option", "Omit units"], "answer": 0, "explanation": "Limiting-case analysis immediately exposes sign, scaling, and boundary flaws."},
        ],
    }
    if llm.available():
        try:
            res, _ = llm.generate_json(prompts.autopsy_drill_prompt(m), system=prompts.system_professor(db.all_settings()), temperature=0.5, max_tokens=2048, kind="fast")
            if isinstance(res, dict) and res.get("drills"):
                return jsonify(res)
        except Exception:
            pass
    return jsonify(fallback)


@app.route("/api/autopsy/resolve", methods=["POST"])
def api_autopsy_resolve():
    data = request.get_json(silent=True) or {}
    mid = int(data.get("mistake_id") or 0)
    row = db.query_one("SELECT resolved FROM mistake_journal WHERE id=?", (mid,))
    if not row:
        return jsonify({"error": "Unknown mistake."}), 404
    if row["resolved"]:
        return jsonify({"ok": True, "awards": [], "badges": [], "already_resolved": True, "summary": game.learner_summary()})
    db.resolve_mistake(mid)
    awards: list[dict] = []
    _award(game.XP["autopsy_drill"], "autopsy_drill", str(mid), awards)
    badges = _badges("autopsy")
    return jsonify({"ok": True, "awards": awards, "badges": badges, "summary": game.learner_summary()})


# 9. Fault-Injection Lab Reward ("Break the System")
@app.route("/api/fault_solved", methods=["POST"])
def api_fault_solved():
    data = request.get_json(silent=True) or {}
    sim_id = str(data.get("sim_id") or "sim")
    awards: list[dict] = []
    _award(game.XP["fault_fixed"], "fault_fixed", sim_id, awards)
    badges = _badges("fault_fixed")
    return jsonify({"awards": awards, "badges": badges, "summary": game.learner_summary()})


# 10. Cross-Domain Capstone Projects
CAPSTONES = [
    {
        "id": "cap_drone_lie_de",
        "title": "Autonomous GPS-Denied Quadrotor with SO(3) Lie-Algebra EKF & German Technical Spec",
        "domains": ["robotics", "math", "aerospace", "languages"],
        "difficulty": "Master's Synthesis",
        "xp": 250,
        "summary": "Design a Visual-Inertial Extended Kalman Filter on the SO(3) rotation manifold for an agile quadrotor navigating a GPS-denied corridor, implement the state estimator in Python, and write a 150-word executive specification in technical Hochdeutsch (Regelungstechnik).",
        "deliverables": [
            "Mathematical formulation of the SO(3) tangent-space error state and Jacobian",
            "Python simulation of position/attitude convergence under IMU drift",
            "Executive technical abstract written in German (using Fachsprache terms like Regelkreis, Zustandsregler, Rückkopplung)",
        ],
        "starter_code": "import numpy as np\n\n# SO(3) skew-symmetric hat map\ndef hat(omega):\n    wx, wy, wz = omega\n    return np.array([[0, -wz, wy], [wz, 0, -wx], [-wy, wx, 0.0]])\n\nomega = np.array([0.1, -0.2, 0.3])\nprint('Skew-symmetric generator:\\n', hat(omega))\n",
    },
    {
        "id": "cap_pqc_zk_gpu",
        "title": "Post-Quantum Lattice Cryptosystem, Zero-Knowledge Proof & GPU Tiled Matrix Kernel",
        "domains": ["cybersecurity", "quantum_computing", "systems", "math"],
        "difficulty": "Master's Synthesis",
        "xp": 250,
        "summary": "Implement a Module-LWE (Kyber-style) lattice encryption prototype in Python, prove why Shor's algorithm breaks RSA but fails on shortest-vector lattice problems, and design a tiled shared-memory matrix-vector polynomial multiplication schedule.",
        "deliverables": [
            "Security reduction comparing Shor's period-finding on abelian groups vs. LWE with noise",
            "Working Python LWE keygen/encrypt/decrypt demonstration over Z_q",
            "Tiled GPU memory-hierarchy access analysis (arithmetic intensity & bank-conflict avoidance)",
        ],
        "starter_code": "import numpy as np\n\nq = 3329\nn = 8\nnp.random.seed(42)\nA = np.random.randint(0, q, size=(n, n))\ns = np.random.randint(-1, 2, size=(n,))\ne = np.random.randint(-1, 2, size=(n,))\nb = (A @ s + e) % q\nprint('Public key vector b mod q:', b)\n",
    },
    {
        "id": "cap_bci_dsp_ethics",
        "title": "Closed-Loop Cortical Spiking BCI Decoder, Spectral DSP Filter & Neuro-Privacy Framework",
        "domains": ["neuroscience", "rf_sdr", "ai", "philosophy"],
        "difficulty": "Senior / Graduate",
        "xp": 250,
        "summary": "Decode 2D hand velocity from a population of cosine-tuned motor cortex neurons with Poisson spiking noise, filter local field potentials in the beta/gamma band, and formulate a philosophical & legal cognitive-liberty framework.",
        "deliverables": [
            "Population vector / Kalman neural decoder derivation and MSE evaluation",
            "Bandpass spectral filtering analysis for 13–30 Hz beta desynchronization",
            "Philosophical analysis of mental privacy, agency, and extended mind in closed-loop BCIs",
        ],
        "starter_code": "import numpy as np\n\n# Cosine-tuned motor cortex population decoder\ntheta_pref = np.linspace(0, 2*np.pi, 16, endpoint=False)\ntrue_dir = np.pi / 3\nrates = np.maximum(0, 20 + 35 * np.cos(true_dir - theta_pref))\nvec = np.sum(rates[:, None] * np.column_stack([np.cos(theta_pref), np.sin(theta_pref)]), axis=0)\ndecoded = np.arctan2(vec[1], vec[0])\nprint(f'True angle: {true_dir:.3f} rad, Decoded: {decoded:.3f} rad')\n",
    },
    {
        "id": "cap_fusion_mhd_materials",
        "title": "Tokamak MHD Plasma Confinement, Superconducting Magnet Materials & Energy Economics",
        "domains": ["physics", "materials", "complex_systems", "game_theory"],
        "difficulty": "Master's Synthesis",
        "xp": 250,
        "summary": "Compute the Lawson triple product $n T \\tau_E$ and magnetic pressure $\\beta$ for a compact REBCO high-temperature superconducting tokamak, analyze edge-localized instability cascades, and model grid-level energy auction equilibrium.",
        "deliverables": [
            "Derivation of magnetic pressure ratio beta and ignition margin against bremsstrahlung losses",
            "Critical current density and neutron-damage analysis of REBCO superconducting tapes",
            "Cournot/Vickrey electricity market dispatch model for baseload fusion",
        ],
        "starter_code": "import numpy as np\n\nB = 12.0  # Tesla (HTS REBCO magnet)\nmu0 = 4e-7 * np.pi\np_mag = B**2 / (2 * mu0)\nprint(f'Magnetic confining pressure at {B} T: {p_mag/1e6:.2f} MPa')\n",
    },
    {
        "id": "cap_synbio_dft_longevity",
        "title": "Generative Enzyme Active-Site Design, Quantum DFT Transition State & Longevity Kinetics",
        "domains": ["synbio", "chemistry", "ai", "math"],
        "difficulty": "Senior / Graduate",
        "xp": 250,
        "summary": "Model catalytic rate enhancement $\\Delta \\Delta G^\\ddagger$ using Eyring transition-state theory, simulate competitive vs. allosteric Michaelis-Menten kinetics in a cellular senescence pathway, and score sequence embeddings.",
        "deliverables": [
            "Eyring transition-state barrier reduction calculation in kJ/mol",
            "Coupled ODE simulation of senolytic clearance and NAD+ metabolic flux",
            "Active-site sequence conservation and mutation stability analysis",
        ],
        "starter_code": "import numpy as np\n\nR = 8.314e-3  # kJ/(mol*K)\nT = 310.15\nddG = -18.0   # kJ/mol barrier stabilization\nspeedup = np.exp(-ddG / (R * T))\nprint(f'Catalytic rate enhancement factor: {speedup:,.1f}x')\n",
    },
    {
        "id": "cap_pentalingual_treatise",
        "title": "The Polyglot Strategist: Epistemology, Game Theory & Statecraft Across Five Languages",
        "domains": ["languages", "geopolitics", "jurisprudence", "philosophy"],
        "difficulty": "Master's Polyglot Symposium",
        "xp": 250,
        "summary": "Analyze a multilateral strategic deterrence & treaty verification crisis by synthesizing Sunzi (Classical Chinese), Clausewitz/Kant (German), Machiavelli (Italian), Montesquieu/Descartes (French), and Ibn Khaldūn (Arabic).",
        "deliverables": [
            "Comparative philological analysis of strategic equilibrium using original concepts in all 5 target languages",
            "Bayesian signaling game model of treaty verification and credible commitment",
            "Pentalingual executive summary paragraph with terms in Mandarin, German, Italian, French, and Arabic",
        ],
        "starter_code": "# Payoff matrix for Treaty Verification vs. Defection\nimport numpy as np\npayoffs = np.array([[(4, 4), (1, 5)], [(5, 1), (2, 2)]])\nprint('Symmetric deterrence matrix shape:', payoffs.shape)\n",
    },
]


@app.route("/api/capstones", methods=["GET", "POST"])
def api_capstones():
    if request.method == "GET":
        return jsonify({"capstones": CAPSTONES, "submissions": db.list_capstone_submissions()})
    data = request.get_json(silent=True) or {}
    cid = str(data.get("capstone_id") or "")
    submission = str(data.get("submission") or "").strip()
    code = str(data.get("code") or "").strip()
    cap = next((x for x in CAPSTONES if x["id"] == cid), None)
    if not cap and cid.startswith("degree:"):
        dg = degrees.get(cid.split(":", 1)[1], **_degree_inputs(cid.split(":", 1)[1]))
        cap = degrees.capstone_spec(dg) if dg else None
    if not cap:
        return jsonify({"error": "Unknown capstone project"}), 404
    if not submission and not code:
        return jsonify({"error": "Please write your interdisciplinary synthesis and/or code before submitting."}), 400
    eval_res = None
    ai_error = "no Gemini API key configured"
    if llm.available():
        try:
            eval_res, _ = llm.generate_json(prompts.capstone_grade_prompt(cap, submission, code), system=prompts.system_professor(db.all_settings()), temperature=0.4, max_tokens=3000, kind="fast")
        except Exception as e:  # noqa: BLE001
            eval_res, ai_error = None, str(e)[:160]
    if not isinstance(eval_res, dict) or "score" not in eval_res:
        # Never invent a grade: the committee is the AI. Nothing is recorded; the draft stays in the editor.
        return jsonify({"error": f"The faculty committee (AI grader) is unavailable right now ({ai_error}). "
                                 "Your draft was not submitted — please try again in a minute."}), 503
    try:
        score = float(eval_res.get("score"))
    except (TypeError, ValueError):
        return jsonify({"error": "The AI committee returned an unreadable evaluation. Please submit again."}), 502
    if score > 1.0001:  # some models answer on a 0-100 scale
        score = score / 100.0
    score = max(0.0, min(1.0, score))
    eval_res["score"] = score
    sub_id = db.add_capstone_submission(cid, submission, code, eval_res, score)
    awards: list[dict] = []
    _award(int(game.XP["capstone_base"] * score), "capstone", cid, awards)
    badges = _badges("capstone", {"score": score})
    return jsonify({"submission_id": sub_id, "evaluation": eval_res, "awards": awards, "badges": badges, "summary": game.learner_summary()})


# 11. Run Nexus Live Tool Bridge (optional)
# If you run the Run Nexus launcher, point NEXUS_APPS_JSON at its apps.json so the
# "#/nexus" page can link coursework to your local tools.  Harmless when absent.
NEXUS_APPS_JSON = os.environ.get("NEXUS_APPS_JSON", os.path.expanduser("~/.config/run_nexus/apps.json"))
NEXUS_PORT = int(os.environ.get("NEXUS_PORT", "5000"))
_NEXUS_DOMAIN_HINTS = [
    (r"osint|intel|recon|argus|threat|telemetry", ["cybersecurity", "geopolitics", "complex_systems"]),
    (r"secur|cmmc|safer|audit|access review|uar|compliance|crypto", ["cybersecurity", "systems", "jurisprudence"]),
    (r"\bai\b|agent|llm|model|gemini|ml\b|neural", ["ai", "neuroscience", "robotics"]),
    (r"universit|learn|course|campus|self-taught", ["math", "physics", "ai", "languages"]),
    (r"radio|sdr|rf\b|spectrum", ["rf_sdr", "physics", "systems"]),
    (r"finance|market|quant|trading", ["game_theory", "math", "complex_systems"]),
    (r"psych|behavio|cogniti|mental|therap|human factor", ["psychology", "neuroscience", "statistics"]),
]


def _nexus_port(app_def: dict) -> int | None:
    if str(app_def.get("port") or "").isdigit():
        return int(app_def["port"])
    cmd = str(app_def.get("command") or "")
    m = re.search(r"localhost:(\d{2,5})", cmd) or re.search(r"127\.0\.0\.1:(\d{2,5})", cmd) or re.search(r"-i:(\d{2,5})", cmd)
    return int(m.group(1)) if m else None


def _nexus_domains(text: str) -> list[str]:
    out: list[str] = []
    for pat, doms in _NEXUS_DOMAIN_HINTS:
        if re.search(pat, text, re.I):
            out += [d for d in doms if d not in out]
    known = {d["id"] for d in curriculum.domains()}
    return [d for d in out if d in known][:4] or [d for d in ("systems", "ai", "cybersecurity") if d in known]


@app.route("/api/nexus/bridge")
def api_nexus_bridge():
    """Live view of the Desktop Nexus launcher: reads the real apps.json and probes each app's port."""
    import socket
    nexus_apps: list[dict] = [{"id": "run_nexus", "name": "Nexus Control Center", "category": "Orchestrator", "port": NEXUS_PORT,
                               "desc": "Desktop launcher, storage manager & command center for all local apps.",
                               "related_domains": _nexus_domains("systems ai security")}]
    source, error = NEXUS_APPS_JSON, None
    try:
        with open(NEXUS_APPS_JSON, "r", encoding="utf-8") as f:
            registry = json.load(f)
        for a in registry if isinstance(registry, list) else []:
            if not isinstance(a, dict) or not a.get("id"):
                continue
            text = f"{a.get('name', '')} {a.get('description', '')}"
            nexus_apps.append({
                "id": str(a["id"]), "name": str(a.get("name") or a["id"]),
                "category": "Self-Taught (this app)" if a["id"] == "self_taught" else ("Web App" if a.get("type") == "web" else str(a.get("type") or "App").title()),
                "port": _nexus_port(a), "desc": str(a.get("description") or ""), "related_domains": _nexus_domains(text),
            })
    except FileNotFoundError:
        error = f"Nexus registry not found at {NEXUS_APPS_JSON}"
    except Exception as e:  # noqa: BLE001
        error = f"Could not read Nexus registry: {str(e)[:160]}"

    def probe(pt: int | None) -> bool:
        if not pt:
            return False
        try:
            with socket.create_connection(("127.0.0.1", int(pt)), timeout=0.25):
                return True
        except Exception:  # noqa: BLE001
            return False
    for a in nexus_apps:
        pt = a.get("port")
        a["online"] = True if pt == PORT else probe(pt)
        a["url"] = f"http://127.0.0.1:{pt}" if pt else None
    return jsonify({"apps": nexus_apps, "source": source, "error": error})


# 12. Super Aid & Scholastic Planner (Goals -> Tracks -> Phases -> Courses -> Lessons + Calendar)
_PHASE_DEFS = [
    {"index": 1, "title": "Phase I · Foundations & First Principles", "subtitle": "Axioms, core notation, foundational intuition, and introductory interactive labs"},
    {"index": 2, "title": "Phase II · Core Systems & Analytical Models", "subtitle": "Intermediate theory, structural mechanisms, and computational problem solving"},
    {"index": 3, "title": "Phase III · Advanced Synthesis & Applied Engineering", "subtitle": "Upper-division synthesis, multi-variable dynamics, and real-world architectures"},
    {"index": 4, "title": "Phase IV · Master's Frontier, Defense & Capstone", "subtitle": "Graduate-level seminars, cross-domain integration, and qualifying mastery"},
]


def _next_study_dates(start_date_str: str, count: int, days_per_week: int = 5) -> list[str]:
    from datetime import date as _date, timedelta as _td
    try:
        y, m, d = [int(x) for x in (start_date_str or "").split("-")[:3]]
        cur = _date(y, m, d)
    except Exception:
        cur = _date.today()
    days_per_week = max(1, min(7, int(days_per_week or 5)))
    # Pick study weekdays: e.g., 5 -> Mon..Fri (0..4), 6 -> Mon..Sat (0..5), 3 -> Mon,Wed,Fri (0,2,4), etc.
    if days_per_week == 7:
        allowed = {0, 1, 2, 3, 4, 5, 6}
    elif days_per_week == 6:
        allowed = {0, 1, 2, 3, 4, 5}
    elif days_per_week == 5:
        allowed = {0, 1, 2, 3, 4}
    elif days_per_week == 4:
        allowed = {0, 1, 3, 4}
    elif days_per_week == 3:
        allowed = {0, 2, 4}
    elif days_per_week == 2:
        allowed = {1, 3}
    else:
        allowed = {0}
    out: list[str] = []
    safety = 0
    while len(out) < max(1, count) and safety < 3650:
        if cur.weekday() in allowed:
            out.append(cur.isoformat())
        cur += _td(days=1)
        safety += 1
    return out


def _prereq_order(entries: list[dict]) -> list[dict]:
    """Kahn topological sort of curriculum.get_course entries by in-set prerequisites; ties by (level, code)."""
    import heapq
    by_id = {e["course"]["id"]: e for e in entries}
    key = lambda cid: (int(by_id[cid]["course"].get("level") or 100), by_id[cid]["course"].get("code") or "", cid)
    deps = {cid: {p for p in (by_id[cid]["course"].get("prerequisites") or []) if p in by_id and p != cid} for cid in by_id}
    users: dict[str, list[str]] = {cid: [] for cid in by_id}
    for cid, ps in deps.items():
        for p_ in ps:
            users[p_].append(cid)
    heap = [key(cid) for cid, ps in deps.items() if not ps]
    heapq.heapify(heap)
    out, done = [], set()
    while heap:
        cid = heapq.heappop(heap)[2]
        if cid in done:
            continue
        done.add(cid)
        out.append(by_id[cid])
        for u in users[cid]:
            deps[u].discard(cid)
            if not deps[u] and u not in done:
                heapq.heappush(heap, key(u))
    out.extend(by_id[c] for c in sorted((c for c in by_id if c not in done), key=key))  # cycles (shouldn't happen)
    return out


def _build_track_from_courses(
    track_id: str,
    title: str,
    overall_goal: str,
    description: str,
    course_ids: list[str],
    start_date: str | None = None,
    weeks: int = 8,
    days_per_week: int = 5,
    mins_per_day: int = 60,
    active: bool = False,
    advisor_note: str = "",
    custom_events: list[dict] | None = None,
    completed_dates: dict[str, str] | None = None,
    phase_of: dict[str, int] | None = None,
    phase_defs: list[dict] | None = None,
    pace_by_mins: bool = False,
) -> dict:
    # phase_of/phase_defs: keep the caller's course order and phase layout (used by Degree Paths,
    # which group courses into academic years). pace_by_mins: lessons/day follows the daily
    # minutes budget instead of being compressed to fit `weeks` (degrees span years, not weeks).
    from datetime import date as _date
    curriculum.ensure_loaded()
    start_date = start_date or _date.today().isoformat()
    weeks = max(1, min(52, int(weeks or 8)))
    days_per_week = max(1, min(7, int(days_per_week or 5)))
    mins_per_day = max(20, min(300, int(mins_per_day or 60)))
    completed_dates = completed_dates or {}

    # Resolve courses in order of level so foundational courses come first
    resolved_courses = []
    seen_cids = set()
    for cid in course_ids:
        if cid in seen_cids:
            continue
        c_entry = curriculum.get_course(cid)
        if not c_entry:
            continue
        seen_cids.add(cid)
        resolved_courses.append(c_entry)

    if not phase_of:
        # Prerequisite-respecting order (topological), foundational level/code first as the tie-breaker.
        resolved_courses = _prereq_order(resolved_courses)

    # Group courses into 4 cohesive phases
    n_courses = max(1, len(resolved_courses))
    courses_list: list[dict] = []
    lessons_list: list[dict] = []
    phases_map: dict[int, dict] = {
        p["index"]: {
            "index": p["index"],
            "title": p["title"],
            "subtitle": p["subtitle"],
            "courses": [],
            "lesson_count": 0,
            "total_mins": 0,
        }
        for p in (phase_defs or _PHASE_DEFS)
    }
    domains_seen: list[str] = []

    for idx, ce in enumerate(resolved_courses):
        c = ce["course"]
        d = ce["domain"]
        s = ce["subject"]
        if d["id"] not in domains_seen:
            domains_seen.append(d["id"])
        # Assign phase 1..4 based on position and course level
        if phase_of and phase_of.get(c["id"]) in phases_map:
            p_idx = phase_of[c["id"]]
        else:
            p_idx = min(4, max(1, int((idx * 4) // n_courses) + 1))
        c_lessons = []
        for m_i, m in enumerate(c.get("modules") or []):
            lids = m.get("lesson_ids") or []
            ltitles = m.get("lessons") or []
            sim_meta = m.get("sim")
            sim_id = sim_meta.get("id") if isinstance(sim_meta, dict) else (sim_meta if isinstance(sim_meta, str) else None)
            has_lab = bool(m.get("lab"))
            for l_i, lid in enumerate(lids):
                ltitle = ltitles[l_i] if l_i < len(ltitles) else lid
                est_mins = 25 if int(c.get("level") or 100) <= 200 else (30 if int(c.get("level") or 100) <= 400 else 35)
                l_obj = {
                    "lesson_id": lid,
                    "title": ltitle,
                    "course_id": c["id"],
                    "course_code": c["code"],
                    "course_title": c["title"],
                    "module_index": m_i + 1,
                    "module_title": m.get("title") or f"Module {m_i + 1}",
                    "domain_id": d["id"],
                    "domain_name": d["name"],
                    "domain_icon": d.get("icon") or "🎓",
                    "domain_color": d.get("color") or "#7c9cff",
                    "level": c.get("level") or 100,
                    "phase_index": p_idx,
                    "phase_title": phases_map[p_idx]["title"],
                    "est_mins": est_mins,
                    "sim_id": sim_id if l_i == 0 else None,
                    "has_lab": has_lab and (l_i == len(lids) - 1),
                }
                c_lessons.append(l_obj)
                lessons_list.append(l_obj)

        c_summary = {
            "id": c["id"],
            "code": c["code"],
            "title": c["title"],
            "level": c.get("level") or 100,
            "credits": c.get("credits") or 3,
            "description": c.get("description") or "",
            "domain_id": d["id"],
            "domain_name": d["name"],
            "domain_icon": d.get("icon") or "🎓",
            "domain_color": d.get("color") or "#7c9cff",
            "subject_name": s.get("name") or "",
            "phase_index": p_idx,
            "phase_title": phases_map[p_idx]["title"],
            "lesson_count": len(c_lessons),
            "lesson_ids": [x["lesson_id"] for x in c_lessons],
        }
        courses_list.append(c_summary)
        phases_map[p_idx]["courses"].append(c_summary)
        phases_map[p_idx]["lesson_count"] += len(c_lessons)
        phases_map[p_idx]["total_mins"] += sum(x["est_mins"] for x in c_lessons)

    # Build day-by-day calendar schedule
    total_study_days = max(1, weeks * days_per_week)
    # Decide how many lessons per study day so the track fits nicely into the target window
    # or expands naturally if mins_per_day dictates pacing
    lessons_per_day_by_mins = max(1, round(mins_per_day / 28))
    lessons_per_day_by_window = max(1, int((len(lessons_list) + total_study_days - 1) // total_study_days))
    if pace_by_mins:
        lessons_per_day = max(1, min(6, lessons_per_day_by_mins))
    else:
        lessons_per_day = max(1, min(6, max(lessons_per_day_by_mins, lessons_per_day_by_window)))

    needed_days = max(total_study_days, int((len(lessons_list) + lessons_per_day - 1) // lessons_per_day))
    study_dates = _next_study_dates(start_date, needed_days, days_per_week)
    first_phase = min(phases_map) if phases_map else 1

    schedule_by_date: dict[str, dict] = {}
    lesson_cursor = 0
    for day_idx, dt_str in enumerate(study_dates):
        wk_num = (day_idx // days_per_week) + 1
        day_items: list[dict] = []
        day_mins = 0
        day_phase = first_phase
        for _ in range(lessons_per_day):
            if lesson_cursor >= len(lessons_list):
                break
            L = lessons_list[lesson_cursor]
            lesson_cursor += 1
            sched_dt = completed_dates.get(L["lesson_id"]) or dt_str
            L["scheduled_date"] = sched_dt
            L["day_number"] = day_idx + 1
            L["week_number"] = wk_num
            day_phase = L["phase_index"]
            day_items.append({
                "type": "lesson",
                "lesson_id": L["lesson_id"],
                "course_id": L["course_id"],
                "course_code": L["course_code"],
                "title": L["title"],
                "module_title": L["module_title"],
                "domain_id": L["domain_id"],
                "domain_name": L["domain_name"],
                "domain_icon": L["domain_icon"],
                "domain_color": L["domain_color"],
                "mins": L["est_mins"],
            })
            day_mins += L["est_mins"]
            if L.get("sim_id"):
                day_items.append({
                    "type": "sim",
                    "sim_id": L["sim_id"],
                    "domain_id": L["domain_id"],
                    "domain_icon": "🕹️",
                    "domain_color": L["domain_color"],
                    "title": f"Interactive Arcade Lab: {L['module_title']}",
                    "mins": 15,
                })
                day_mins += 15

        # End of study week: add a Spaced Repetition & Synthesis Review block
        if day_items and ((day_idx + 1) % days_per_week == 0 or lesson_cursor == len(lessons_list)):
            day_items.append({
                "type": "review",
                "title": f"Week {wk_num} Spaced Repetition & Socratic Synthesis",
                "domain_icon": "🧠",
                "domain_color": "#c084fc",
                "href": "#/exams",
                "mins": 20,
            })
            day_mins += 20

        if day_items:
            schedule_by_date[dt_str] = {
                "date": dt_str,
                "day_number": day_idx + 1,
                "week_number": wk_num,
                "phase_index": day_phase,
                "phase_title": phases_map[day_phase]["title"],
                "total_mins": day_mins,
                "items": day_items,
            }
        if lesson_cursor >= len(lessons_list):
            break

    # Merge any user custom events
    for ev in (custom_events or []):
        dt_str = ev.get("date")
        if not dt_str:
            continue
        if dt_str not in schedule_by_date:
            schedule_by_date[dt_str] = {
                "date": dt_str,
                "day_number": 0,
                "week_number": 1,
                "phase_index": first_phase,
                "phase_title": "Custom Study Block",
                "total_mins": 0,
                "items": [],
            }
        schedule_by_date[dt_str]["items"].append(ev)
        schedule_by_date[dt_str]["total_mins"] += int(ev.get("mins") or 25)

    schedule_list = [schedule_by_date[k] for k in sorted(schedule_by_date.keys())]
    actual_weeks = max(1, max((d.get("week_number") or 1) for d in schedule_list)) if schedule_list else weeks

    return {
        "id": track_id,
        "title": title,
        "overall_goal": overall_goal,
        "description": description or advisor_note,
        "domains": domains_seen,
        "start_date": start_date,
        "weeks": actual_weeks,
        "days_per_week": days_per_week,
        "mins_per_day": mins_per_day,
        "active": active,
        "phases": [phases_map[i] for i in sorted(phases_map) if phases_map[i]["courses"]],
        "courses": courses_list,
        "lessons": lessons_list,
        "schedule": schedule_list,
    }


_DEFAULT_TRACK_SPECS = [
    {
        "id": "track_ai_robotics_architect",
        "title": "🤖 Autonomous AI, LLMs & Embodied Robotics Architect",
        "overall_goal": "Master the mathematical foundations of linear algebra and optimization, build transformer LLMs and multi-agent architectures from scratch, and deploy real-time kinematics, SLAM, and control loops onto embodied robots.",
        "description": "Cohesive 4-phase engineering track uniting Mathematics, Artificial Intelligence, Robotics, and Systems Engineering.",
        "domains": ["math", "ai", "robotics", "systems"],
        "course_ids": [],
        "weeks": 10,
        "days_per_week": 5,
        "mins_per_day": 60,
        "active": True,
    },
    {
        "id": "track_cyber_osint_rf",
        "title": "🕵️ Offensive Security, Cryptography, OSINT & RF Signals",
        "overall_goal": "Attain full-spectrum mastery over binary exploitation, modern cryptographic protocols, Linux kernel internals, open-source intelligence (OSINT), and Software-Defined Radio (SDR) signal interception.",
        "description": "Designed for security researchers and intelligence analysts bridging low-level systems, cryptography, and electromagnetic spectrum operations.",
        "domains": ["cybersecurity", "rf_sdr", "systems", "math"],
        "course_ids": [],
        "weeks": 9,
        "days_per_week": 5,
        "mins_per_day": 60,
        "active": False,
    },
    {
        "id": "track_physics_quantum_fusion",
        "title": "⚛️ Theoretical Physics, Quantum Computing & Fusion Engineering",
        "overall_goal": "Progress from classical Lagrangian mechanics and electrodynamics to relativistic quantum mechanics, fault-tolerant quantum algorithms, and magnetohydrodynamic plasma fusion confinement.",
        "description": "Rigorous theoretical and computational physics curriculum spanning Newtonian mechanics to quantum supremacy.",
        "domains": ["physics", "quantum_computing", "math", "chemistry"],
        "course_ids": [],
        "weeks": 10,
        "days_per_week": 5,
        "mins_per_day": 60,
        "active": False,
    },
    {
        "id": "track_polyglot_grand_strategy",
        "title": "🌍 Polyglot Grand Strategy, Game Theory & Constitutional Rhetoric",
        "overall_goal": "Combine formal game-theoretic mechanism design, geopolitical statecraft, formal logic, constitutional jurisprudence, and multilingual fluency across Mandarin, German, Italian, French, and Arabic.",
        "description": "Executive synthesis of strategic decision theory, classical rhetoric, philosophy of truth, and global languages.",
        "domains": ["languages", "philosophy", "game_theory", "geopolitics", "jurisprudence"],
        "course_ids": [],
        "weeks": 10,
        "days_per_week": 5,
        "mins_per_day": 60,
        "active": False,
    },
    {
        "id": "track_neuro_synbio_bci",
        "title": "🧬 Computational Neuroscience, BCI & Synthetic Biology",
        "overall_goal": "Decode biological neural spiking networks, design closed-loop Brain-Computer Interfaces (BCIs), and engineer CRISPR gene circuits and computational protein folds.",
        "description": "Frontier bio-computation track uniting Neuroscience, Synthetic Biology, Organic Chemistry, and Deep Learning.",
        "domains": ["neuroscience", "synbio", "chemistry", "ai"],
        "course_ids": [],
        "weeks": 8,
        "days_per_week": 5,
        "mins_per_day": 60,
        "active": False,
    },
    {
        "id": "track_psychology_mind_behavior",
        "title": "🧠 Psychology: Mind, Brain & Behavior",
        "overall_goal": "Master the science of mind and behavior — research methods and statistics, cognition, learning, development, social and personality psychology, psychopathology and evidence-based treatment — through graduate psychometrics and computational modeling.",
        "description": "B.S.-to-M.S. behavioral science track uniting Psychology, Neuroscience, Statistics and AI.",
        "domains": ["psychology", "neuroscience", "statistics", "ai"],
        "course_ids": [],
        "weeks": 10,
        "days_per_week": 5,
        "mins_per_day": 60,
        "active": False,
    },
    {
        "id": "track_aerospace_materials_propulsion",
        "title": "🚀 Hypersonic Aerospace, Astrodynamics & Semiconductor Materials",
        "overall_goal": "Master orbital mechanics, interplanetary trajectory optimization, hypersonic aerothermodynamics, rocket propulsion cycles, and solid-state crystal/semiconductor engineering.",
        "description": "Deep hardware and propulsion track for aerospace, orbital dynamics, and advanced materials science.",
        "domains": ["aerospace", "materials", "physics", "robotics"],
        "course_ids": [],
        "weeks": 8,
        "days_per_week": 5,
        "mins_per_day": 60,
        "active": False,
    },
]


def _pick_courses_for_domains_or_query(query_text: str, domain_ids: list[str], max_courses: int = 8) -> list[str]:
    curriculum.ensure_loaded()
    q_words = [w.lower() for w in re.findall(r"[a-zA-Z0-9]{3,}", query_text or "")]
    by_dom_scored: dict[str, list[tuple[float, int, str]]] = {}
    all_scored: list[tuple[float, int, str]] = []
    for d in curriculum.domains():
        in_dom = d["id"] in (domain_ids or [])
        dom_text = f"{d['id']} {d['name']} {d.get('tagline','')} {d.get('description','')}".lower()
        for s in d.get("subjects") or []:
            sub_text = f"{s['name']} {s.get('description','')}".lower()
            for c in s.get("courses") or []:
                c_text = f"{c['id']} {c['code']} {c['title']} {c.get('description','')} " + " ".join(
                    m.get("title", "") for m in (c.get("modules") or [])
                )
                c_text_l = c_text.lower()
                score = 0.0
                if in_dom:
                    score += 15.0
                for w in q_words:
                    if w in c_text_l:
                        score += 5.0
                    elif w in sub_text:
                        score += 3.0
                    elif w in dom_text:
                        score += 2.0
                lvl = int(c.get("level") or 100)
                if score > 0:
                    item = (score, lvl, c["id"])
                    all_scored.append(item)
                    if in_dom:
                        by_dom_scored.setdefault(d["id"], []).append(item)

    chosen: list[str] = []
    # Ensure round-robin representation across requested domains first
    for did in (domain_ids or []):
        bucket = by_dom_scored.get(did) or []
        bucket.sort(key=lambda x: (-x[0], x[1], x[2]))
        per_dom = max(1, max_courses // max(1, len(domain_ids)))
        for _, _, cid in bucket[:per_dom]:
            if cid not in chosen and len(chosen) < max_courses:
                chosen.append(cid)

    all_scored.sort(key=lambda x: (-x[0], x[1], x[2]))
    for _, _, cid in all_scored:
        if len(chosen) >= max_courses:
            break
        if cid not in chosen:
            chosen.append(cid)

    if not chosen:
        target_doms = domain_ids or ["math", "ai", "physics", "robotics"]
        for d in curriculum.domains():
            if d["id"] in target_doms:
                for s in d.get("subjects") or []:
                    for c in s.get("courses") or []:
                        if len(chosen) < max_courses:
                            chosen.append(c["id"])
    return chosen[:max_courses]


# Default tracks introduced after the first release; seeded once into existing installs.
_DEFAULT_TRACKS_ADDED_LATER = {"track_psychology_mind_behavior"}


def _ensure_default_tracks() -> None:
    existing = db.list_scholastic_tracks()
    existing_ids = {t.get("id") for t in existing}
    # Remember which defaults were ever offered so a learner-deleted default is never resurrected,
    # while defaults added in later releases (e.g. Psychology) still appear on existing installs.
    offered_setting = db.get_setting("default_tracks_offered", None)
    if offered_setting is None and existing:
        offered_setting = [s["id"] for s in _DEFAULT_TRACK_SPECS if s["id"] not in _DEFAULT_TRACKS_ADDED_LATER]
    offered = set(offered_setting or [])
    pending = [s for s in _DEFAULT_TRACK_SPECS if s["id"] not in offered and s["id"] not in existing_ids]
    if existing and not pending:
        if db.get_setting("default_tracks_offered", None) is None:
            db.set_setting("default_tracks_offered", sorted(offered | existing_ids))
        return
    curriculum.ensure_loaded()
    for spec in (pending if existing else _DEFAULT_TRACK_SPECS):
        valid_cids = [cid for cid in spec.get("course_ids", []) if curriculum.get_course(cid)]
        if len(valid_cids) < 4:
            valid_cids = _pick_courses_for_domains_or_query(
                spec["title"] + " " + spec["overall_goal"],
                spec.get("domains") or [],
                max_courses=8,
            )
        tr = _build_track_from_courses(
            track_id=spec["id"],
            title=spec["title"],
            overall_goal=spec["overall_goal"],
            description=spec["description"],
            course_ids=valid_cids,
            weeks=spec["weeks"],
            days_per_week=spec["days_per_week"],
            mins_per_day=spec["mins_per_day"],
            active=spec["active"] and not existing,
        )
        db.save_scholastic_track(tr)
    db.set_setting("default_tracks_offered", sorted(offered | existing_ids | {s["id"] for s in _DEFAULT_TRACK_SPECS}))


def _enrich_track(tr: dict) -> dict:
    from datetime import date as _date
    prog = db.all_progress()
    today_str = _date.today().isoformat()

    total_lessons = len(tr.get("lessons") or [])
    done_lessons = 0
    started_lessons = 0
    next_lesson = None

    for L in tr.get("lessons") or []:
        p = prog.get(L["lesson_id"])
        if p and p.get("completed_at"):
            L["status"] = "completed"
            L["score"] = p.get("score")
            done_lessons += 1
        elif p and p.get("started_at"):
            L["status"] = "started"
            started_lessons += 1
            if not next_lesson:
                next_lesson = L
        else:
            L["status"] = "unstarted"
            if not next_lesson:
                next_lesson = L

    # Enrich courses
    courses_done = 0
    for c in tr.get("courses") or []:
        lids = c.get("lesson_ids") or []
        c_done = sum(1 for lid in lids if prog.get(lid) and prog[lid].get("completed_at"))
        c["lessons_done"] = c_done
        c["pct"] = round(c_done / max(1, len(lids)), 3)
        c["completed"] = len(lids) > 0 and c_done == len(lids)
        if c["completed"]:
            courses_done += 1

    # Enrich phases
    for ph in tr.get("phases") or []:
        ph_cids = {c["id"] for c in (ph.get("courses") or [])}
        ph_lessons = [L for L in (tr.get("lessons") or []) if L["course_id"] in ph_cids]
        ph_done = sum(1 for L in ph_lessons if L.get("status") == "completed")
        ph["lessons_done"] = ph_done
        ph["lesson_count"] = len(ph_lessons)
        ph["pct"] = round(ph_done / max(1, len(ph_lessons)), 3)
        for c in ph.get("courses") or []:
            lids = c.get("lesson_ids") or []
            c_done = sum(1 for lid in lids if prog.get(lid) and prog[lid].get("completed_at"))
            c["lessons_done"] = c_done
            c["pct"] = round(c_done / max(1, len(lids)), 3)
            c["completed"] = len(lids) > 0 and c_done == len(lids)

    # Enrich schedule items
    todays_plan = None
    upcoming_day = None
    overdue_count = 0
    for day in tr.get("schedule") or []:
        dt = day.get("date") or ""
        all_done = True
        any_done = False
        for it in day.get("items") or []:
            if it.get("type") == "lesson":
                lid = it.get("lesson_id")
                p = prog.get(lid)
                it["completed"] = bool(p and p.get("completed_at"))
                if it["completed"]:
                    any_done = True
                else:
                    all_done = False
                    if dt < today_str:
                        overdue_count += 1
            else:
                it["completed"] = bool(it.get("completed"))
        day["completed"] = all_done and len(day.get("items") or []) > 0
        day["partial"] = any_done and not all_done
        if dt == today_str:
            todays_plan = day
        elif dt > today_str and not upcoming_day and not day["completed"]:
            upcoming_day = day

    if not todays_plan:
        todays_plan = upcoming_day or (tr["schedule"][0] if tr.get("schedule") else None)

    tr["stats"] = {
        "total_lessons": total_lessons,
        "done_lessons": done_lessons,
        "started_lessons": started_lessons,
        "pct": round(done_lessons / max(1, total_lessons), 3),
        "total_courses": len(tr.get("courses") or []),
        "courses_done": courses_done,
        "total_phases": len(tr.get("phases") or []),
        "overdue_lessons": overdue_count,
        "today": today_str,
    }
    tr["next_lesson"] = next_lesson
    tr["todays_plan"] = todays_plan
    return tr


@app.route("/api/aid/tracks")
def api_aid_tracks():
    _ensure_default_tracks()
    tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    active = next((t for t in tracks if t.get("active")), tracks[0] if tracks else None)
    return jsonify({
        "tracks": tracks,
        "active_track": active,
    })


@app.route("/api/aid/activate", methods=["POST"])
def api_aid_activate():
    _ensure_default_tracks()
    b = request.get_json(force=True, silent=True) or {}
    tid = b.get("track_id") or ""
    if not tid or not db.get_scholastic_track(tid):
        return jsonify({"error": "Track not found"}), 404
    db.set_active_scholastic_track(tid)
    tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    active = next((t for t in tracks if t.get("active")), tracks[0] if tracks else None)
    return jsonify({"tracks": tracks, "active_track": active})


@app.route("/api/aid/generate", methods=["POST"])
def api_aid_generate():
    from datetime import date as _date
    _ensure_default_tracks()
    b = request.get_json(force=True, silent=True) or {}
    goal_prompt = (b.get("goal") or b.get("prompt") or "").strip()
    title_in = (b.get("title") or "").strip()
    domain_ids = b.get("domains") or []
    explicit_courses = b.get("course_ids") or []
    start_date = (b.get("start_date") or _date.today().isoformat()).strip()
    weeks = max(1, min(52, int(b.get("weeks") or 8)))
    days_per_week = max(1, min(7, int(b.get("days_per_week") or 5)))
    mins_per_day = max(20, min(300, int(b.get("mins_per_day") or 60)))
    max_courses = max(2, min(16, int(b.get("max_courses") or 8)))

    if not goal_prompt and not domain_ids and not explicit_courses:
        return jsonify({"error": "Provide a learning goal, domains, or courses to build a track."}), 400

    chosen_cids = [cid for cid in explicit_courses if curriculum.get_course(cid)]
    if not chosen_cids:
        chosen_cids = _pick_courses_for_domains_or_query(f"{title_in} {goal_prompt}", domain_ids, max_courses=max_courses)

    # Optionally refine title, overall_goal, and advisor description via Gemini if configured, with instant deterministic fallback
    track_title = title_in
    overall_goal = goal_prompt
    advisor_note = (
        f"Custom {weeks}-week scholastic track ({days_per_week} study days/week · {mins_per_day} mins/day) "
        f"grouping {len(chosen_cids)} courses into 4 progressive mastery phases."
    )

    if not track_title:
        if goal_prompt:
            short = goal_prompt[:62].strip().rstrip(".")
            track_title = f"🧭 {short}"
        else:
            dom_names = [curriculum.get_domain(d)["name"] for d in domain_ids if curriculum.get_domain(d)]
            track_title = "🧭 " + (" & ".join(dom_names[:3]) or "Custom Scholastic Track")

    if not overall_goal:
        c_titles = [curriculum.get_course(cid)["course"]["title"] for cid in chosen_cids[:5] if curriculum.get_course(cid)]
        overall_goal = f"Achieve end-to-end theoretical and applied mastery across {', '.join(c_titles)}."

    tid = "track_custom_" + uuid.uuid4().hex[:10]
    tr = _build_track_from_courses(
        track_id=tid,
        title=track_title,
        overall_goal=overall_goal,
        description=advisor_note,
        course_ids=chosen_cids,
        start_date=start_date,
        weeks=weeks,
        days_per_week=days_per_week,
        mins_per_day=mins_per_day,
        active=True,
    )
    db.save_scholastic_track(tr)
    db.set_active_scholastic_track(tid)

    awards: list[dict] = []
    _award(45, "design", tid, awards)
    tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    active = next((t for t in tracks if t.get("id") == tid), tracks[0] if tracks else None)
    return jsonify({
        "track": active,
        "tracks": tracks,
        "active_track": active,
        "awards": awards,
        "summary": game.learner_summary(),
    })


@app.route("/api/aid/rebalance", methods=["POST"])
def api_aid_rebalance():
    from datetime import date as _date
    _ensure_default_tracks()
    b = request.get_json(force=True, silent=True) or {}
    tid = b.get("track_id") or ""
    tr = db.get_scholastic_track(tid)
    if not tr:
        return jsonify({"error": "Track not found"}), 404

    start_date = (b.get("start_date") or _date.today().isoformat()).strip()
    weeks = max(1, min(52, int(b.get("weeks") or tr.get("weeks") or 8)))
    days_per_week = max(1, min(7, int(b.get("days_per_week") or tr.get("days_per_week") or 5)))
    mins_per_day = max(20, min(300, int(b.get("mins_per_day") or tr.get("mins_per_day") or 60)))

    # Keep custom events when rebuilding
    custom_events = []
    for day in tr.get("schedule") or []:
        for it in day.get("items") or []:
            if it.get("type") == "custom":
                ev_copy = dict(it)
                ev_copy["date"] = day.get("date")
                custom_events.append(ev_copy)

    if str(tid).startswith("degree_"):
        # Degree tracks are rebuilt through the degree planner (years, prerequisite order, pace by minutes,
        # credit-by-exam skips, saved electives/minor) instead of being squeezed into a generic 52-week plan.
        deg_id = tid[len("degree_"):]
        inputs = _degree_inputs(deg_id)
        d = degrees.get(deg_id, **inputs)
        if d:
            rebuilt, _cred = _degree_track(deg_id, d, inputs, start_date, days_per_week, mins_per_day,
                                           active=bool(tr.get("active")), custom_events=custom_events)
            if not rebuilt:
                return jsonify({"error": "Every course in this program is already complete — head to the degree audit to graduate!"}), 400
            db.save_scholastic_track(rebuilt)
            tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
            active = next((t for t in tracks if t.get("id") == tid), tracks[0] if tracks else None)
            return jsonify({"track": active, "tracks": tracks, "active_track": active})

    cids = [c["id"] for c in (tr.get("courses") or [])]
    rebuilt = _build_track_from_courses(
        track_id=tr["id"],
        title=tr["title"],
        overall_goal=tr["overall_goal"],
        description=tr.get("description") or "",
        course_ids=cids,
        start_date=start_date,
        weeks=weeks,
        days_per_week=days_per_week,
        mins_per_day=mins_per_day,
        active=bool(tr.get("active")),
        custom_events=custom_events,
    )
    db.save_scholastic_track(rebuilt)
    tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    active = next((t for t in tracks if t.get("id") == tid), tracks[0] if tracks else None)
    return jsonify({"track": active, "tracks": tracks, "active_track": active})


@app.route("/api/aid/custom_event", methods=["POST"])
def api_aid_custom_event():
    _ensure_default_tracks()
    b = request.get_json(force=True, silent=True) or {}
    tid = b.get("track_id") or ""
    tr = db.get_scholastic_track(tid)
    if not tr:
        return jsonify({"error": "Track not found"}), 404
    dt_str = (b.get("date") or "").strip()
    title = (b.get("title") or "").strip()
    mins = max(5, min(240, int(b.get("mins") or 30)))
    if not dt_str or not title:
        return jsonify({"error": "Date and title required"}), 400

    sched = tr.get("schedule") or []
    target_day = next((d for d in sched if d.get("date") == dt_str), None)
    new_item = {
        "type": "custom",
        "id": "ev_" + uuid.uuid4().hex[:10],
        "title": title,
        "domain_icon": "📌",
        "domain_color": "#ffd166",
        "mins": mins,
        "completed": False,
    }
    if target_day:
        target_day.setdefault("items", []).append(new_item)
        target_day["total_mins"] = int(target_day.get("total_mins") or 0) + mins
    else:
        sched.append({
            "date": dt_str,
            "day_number": len(sched) + 1,
            "week_number": 1,
            "phase_index": 1,
            "phase_title": "Custom Scholastic Session",
            "total_mins": mins,
            "items": [new_item],
        })
        sched.sort(key=lambda d: d.get("date") or "")
    tr["schedule"] = sched
    db.save_scholastic_track(tr)
    tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    active = next((t for t in tracks if t.get("id") == tid), tracks[0] if tracks else None)
    return jsonify({"track": active, "tracks": tracks, "active_track": active})


@app.route("/api/aid/tracks/<track_id>", methods=["DELETE"])
def api_aid_delete_track(track_id: str):
    db.delete_scholastic_track(track_id)
    _ensure_default_tracks()
    tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    if tracks and not any(t.get("active") for t in tracks):
        db.set_active_scholastic_track(tracks[0]["id"])
        tracks = [_enrich_track(t) for t in db.list_scholastic_tracks()]
    active = next((t for t in tracks if t.get("active")), tracks[0] if tracks else None)
    return jsonify({"tracks": tracks, "active_track": active})


@app.route("/api/aid/ics/<track_id>")
def api_aid_ics(track_id: str):
    _ensure_default_tracks()
    tr = db.get_scholastic_track(track_id)
    if not tr:
        return jsonify({"error": "Track not found"}), 404
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Self-Taught University//Super Aid Scholastic Planner//EN",
        "CALSCALE:GREGORIAN",
        f"X-WR-CALNAME:{tr.get('title','Self-Taught Track')}",
    ]
    for day in tr.get("schedule") or []:
        dt_clean = (day.get("date") or "").replace("-", "")
        if len(dt_clean) != 8:
            continue
        items = day.get("items") or []
        summary_titles = ", ".join(it.get("title", "") for it in items[:3])
        if len(items) > 3:
            summary_titles += f" (+{len(items) - 3} more)"
        desc_lines = [f"Overall Goal: {tr.get('overall_goal','')}"]
        for it in items:
            desc_lines.append(f"- [{it.get('type','lesson').upper()}] {it.get('title','')} ({it.get('mins',25)}m)")
        desc_escaped = "\\n".join(desc_lines).replace(",", "\\,").replace(";", "\\;")
        uid = f"selftaught-{track_id}-{dt_clean}@localhost"
        lines.extend([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTART;VALUE=DATE:{dt_clean}",
            f"DTEND;VALUE=DATE:{_ics_next_day(dt_clean)}",
            "SUMMARY:🎓 Self-Taught: " + summary_titles.replace("\\", "\\\\").replace(",", "\\,").replace(";", "\\;").replace("\n", " "),
            f"DESCRIPTION:{desc_escaped}",
            "END:VEVENT",
        ])
    lines.append("END:VCALENDAR")
    ics_text = "\r\n".join(lines)
    return Response(
        ics_text,
        mimetype="text/calendar",
        headers={"Content-Disposition": f'attachment; filename="{track_id}.ics"'},
    )


def _ics_next_day(yyyymmdd: str) -> str:
    from datetime import datetime as _dt, timedelta as _td
    try:
        return (_dt.strptime(yyyymmdd, "%Y%m%d") + _td(days=1)).strftime("%Y%m%d")
    except ValueError:
        return yyyymmdd


# 13. Degree Paths: pre-built Bachelor's / Master's / PhD-prep / interdisciplinary / minor programs (see degrees.py)
def _degree_selection(degree_id: str) -> dict:
    sel = db.get_setting(f"degree_sel:{degree_id}", {}) or {}
    return sel if isinstance(sel, dict) else {}


def _degree_records(degree_id: str | None = None) -> dict:
    """Best comprehensive-exam score, best capstone score and conferral record, per degree."""
    out: dict[str, dict] = {}
    for r in db.query("SELECT scope_id, MAX(score) AS best FROM exam_attempts WHERE scope_type='degree' GROUP BY scope_id"):
        out.setdefault(r["scope_id"], {})["exam_best"] = float(r["best"])
    for r in db.query("SELECT capstone_id, MAX(score) AS best FROM capstone_submissions WHERE capstone_id LIKE 'degree:%' GROUP BY capstone_id"):
        out.setdefault(r["capstone_id"].split(":", 1)[1], {})["capstone_best"] = float(r["best"])
    for d in db.list_conferred():
        out.setdefault(d["degree_id"], {})["conferred"] = d
    return out.get(degree_id, {}) if degree_id else out


def _degree_inputs(degree_id: str, electives=None, minor_id=None) -> dict:
    sel = _degree_selection(degree_id)
    return {
        "progress": db.all_progress(), "credits": db.course_credits(), "records": _degree_records(degree_id),
        "selected_electives": electives if electives is not None else sel.get("electives"),
        "minor_id": minor_id if minor_id is not None else sel.get("minor"),
    }


@app.route("/api/degrees")
def api_degrees():
    enrolled = {t["id"]: bool(t.get("active")) for t in db.list_scholastic_tracks() if str(t.get("id", "")).startswith("degree_")}
    cat = degrees.catalog(db.all_progress(), db.course_credits(), _degree_records())
    for d in cat:
        tid = "degree_" + d["id"]
        d["enrolled"] = tid in enrolled
        d["active"] = enrolled.get(tid, False)
    return jsonify({"degrees": cat, "conferred": db.list_conferred()})


@app.route("/api/degrees/<degree_id>")
def api_degree_detail(degree_id: str):
    electives = request.args.get("electives")
    electives = [x for x in electives.split(",") if x] if electives is not None else None
    minor_id = request.args.get("minor")
    d = degrees.get(degree_id, **_degree_inputs(degree_id, electives, minor_id if minor_id is not None else None))
    if not d:
        return jsonify({"error": "Degree not found"}), 404
    tr = db.get_scholastic_track("degree_" + degree_id)
    d["enrolled"] = bool(tr)
    d["active"] = bool(tr and tr.get("active"))
    d["selection"] = _degree_selection(degree_id)
    d["minors"] = [m for m in degrees.minors() if m["domain"] not in d["domains"]] if d["kind"] != "minor" else []
    if d.get("builds_on"):
        base = degrees.get(d["builds_on"])
        d["builds_on_title"] = base["title"] if base else None
    if d.get("capstone"):
        d["capstone_spec"] = degrees.capstone_spec(d)
        d["capstone_submissions"] = db.list_capstone_submissions(f"degree:{degree_id}")[:5]
    d["exam_attempts"] = [{"ts": a["ts"], "score": a["score"], "grade": a["grade"]} for a in db.list_exam_attempts(200)
                          if a.get("scope_type") == "degree" and a.get("scope_id") == degree_id][:5]
    return jsonify(d)


@app.route("/api/degrees/<degree_id>/enroll", methods=["POST"])
def api_degree_enroll(degree_id: str):
    from datetime import date as _date
    b = request.get_json(force=True, silent=True) or {}
    electives = b.get("electives")
    electives = [str(x) for x in electives] if isinstance(electives, list) else None
    minor_id = str(b.get("minor_id") or "") or None
    inputs = _degree_inputs(degree_id, electives, minor_id or "")
    d = degrees.get(degree_id, **inputs)
    if not d:
        return jsonify({"error": "Degree not found"}), 404
    for g in d["elective_requirements"]:
        chosen = sum(1 for c in d["courses"] if c["role"] == "elective" and c["elective_group"] == g["index"])
        if chosen < g["min"]:
            return jsonify({"error": f"Pick at least {g['min']} electives in “{g['name']}” (you picked {chosen})."}), 400
    db.set_setting(f"degree_sel:{degree_id}", {"electives": electives, "minor": minor_id})
    start_date = (b.get("start_date") or _date.today().isoformat()).strip()
    days_per_week = max(1, min(7, int(b.get("days_per_week") or 5)))
    mins_per_day = max(20, min(300, int(b.get("mins_per_day") or 60)))
    tr, credited = _degree_track(degree_id, d, inputs, start_date, days_per_week, mins_per_day, active=True)
    if not tr:
        return jsonify({"error": "Every course in this program is already complete — head to the degree audit to graduate!"}), 400
    db.save_scholastic_track(tr)
    db.set_active_scholastic_track(tr["id"])
    return jsonify({"track_id": tr["id"], "title": tr["title"], "weeks": tr["weeks"], "lessons": len(tr["lessons"]), "skipped_courses": len(credited)})


def _degree_track(degree_id: str, d: dict, inputs: dict, start_date: str, days_per_week: int, mins_per_day: int,
                  active: bool = True, custom_events: list | None = None):
    """Build the Super Aid track for a degree: academic years in prerequisite order, paced by daily minutes,
    test-out courses skipped, finished lessons keep their real completion date. Returns (track|None, credited)."""
    credited = {c["id"] for c in d["courses"] if c["credit_by_exam"]}
    cids, phase_of, phase_defs = degrees.phase_plan(d, skip_ids=credited)
    if not cids:
        return None, credited
    def _iso(v):
        try:
            return db.today(float(v))
        except (TypeError, ValueError):
            return str(v)[:10]
    completed_dates = {lid: _iso(p["completed_at"]) for lid, p in inputs["progress"].items() if p.get("completed_at")}
    st = d["stats"]
    support = ", ".join(f"{n} {k}" for k, n in st["supporting_domains"].items())
    title = f"🎓 {d['title']}" + (f" + {d['minor']['title']}" if d.get("minor") else "")
    desc = (f"{st['total_courses']} courses ({st['major_courses']} major, {st['gen_ed_courses']} General Education"
            + (f", {st['supporting_courses']} prerequisites from {support}" if support else "")
            + (f", {st['minor_courses']} minor" if st.get("minor_courses") else "")
            + f") · {st['credits']} credits · {len(phase_defs)} academic years in prerequisite order"
            + (f" · {len(credited)} course(s) skipped via credit by exam" if credited else "") + ".")
    tr = _build_track_from_courses(
        track_id="degree_" + degree_id, title=title,
        overall_goal=f"Earn degree-level knowledge equivalent to a {d['title']}. {d['summary']}",
        description=desc, course_ids=cids, start_date=start_date, weeks=52, days_per_week=days_per_week,
        mins_per_day=mins_per_day, active=active, completed_dates=completed_dates, custom_events=custom_events,
        phase_of=phase_of, phase_defs=phase_defs, pace_by_mins=True,
    )
    return tr, credited


def _degree_exam_generate(degree_id: str):
    d = degrees.get(degree_id, **_degree_inputs(degree_id))
    if not d or not d.get("exam"):
        return jsonify({"error": "This program has no comprehensive examination."}), 404
    scope = degrees.exam_scope(d)
    if not llm.available():
        return jsonify({"error": "Degree examinations must be generated by the AI so they genuinely cover the program. Add a Gemini API key (Settings) and try again."}), 400
    try:
        res, _ = llm.generate_json(prompts.exam_generate_prompt(scope["title"], scope["topics"], scope["level"], comprehensive=True),
                                   system=prompts.system_professor(db.all_settings()), temperature=0.5, max_tokens=8192, kind="fast")
    except Exception as e:  # noqa: BLE001
        return jsonify({"error": f"Could not generate the examination: {str(e)[:160]}"}), 502
    if not (isinstance(res, dict) and isinstance(res.get("questions"), list) and len(res["questions"]) >= 6):
        return jsonify({"error": "The AI returned an incomplete examination. Please try again."}), 502
    qs = [prompts._norm_question(q, f"ex{i+1}") for i, q in enumerate(res["questions"])]
    for i, q in enumerate(qs):
        q["points"] = int(res["questions"][i].get("points") or 15)
    return _issue_paper({"degree_id": degree_id, "course_id": "", "title": scope["title"], "pass": scope["pass"],
                    "duration_minutes": int(res.get("duration_minutes") or 60), "questions": qs, "test_out": False})


@app.route("/api/degrees/<degree_id>/graduate", methods=["POST"])
def api_degree_graduate(degree_id: str):
    d = degrees.get(degree_id, **_degree_inputs(degree_id))
    if not d:
        return jsonify({"error": "Degree not found"}), 404
    if d.get("conferred"):
        return jsonify({"error": "This degree has already been conferred.", "conferred": d["conferred"]}), 400
    unmet = [r["label"] for r in d["requirements"] if not r["met"]]
    if unmet:
        return jsonify({"error": "Not all graduation requirements are met yet.", "unmet": unmet}), 400
    progress = db.all_progress()
    scores = [s for s in (game.course_status(c["id"], progress).get("avg_score") for c in d["courses"]) if s is not None]
    gpa = round(sum(scores) / len(scores), 3) if scores else None
    honors = None
    if gpa is not None and d["kind"] in ("bachelor", "interdisciplinary"):
        honors = "Summa Cum Laude" if gpa >= 0.93 else "Magna Cum Laude" if gpa >= 0.88 else "Cum Laude" if gpa >= 0.83 else None
    elif gpa is not None and gpa >= 0.9:
        honors = "With Distinction"
    db.confer_degree(degree_id, d["title"], d["kind"], gpa, honors,
                     {"credits": d["stats"]["credits_earned"], "courses": d["stats"]["courses_done"], "minor": (d.get("minor") or {}).get("title")})
    awards: list[dict] = []
    xp = {"minor": 300, "bachelor": 2000, "interdisciplinary": 2500, "master": 3000, "phd_prep": 4000}.get(d["kind"], 1000)
    _award(xp, "degree_conferred", degree_id, awards)
    return jsonify({"conferred": db.list_conferred()[-1], "awards": awards, "summary": game.learner_summary()})


@app.route("/api/course/<course_id>/unlock", methods=["POST"])
def api_course_unlock(course_id: str):
    if not curriculum.course(course_id):
        return jsonify({"error": "unknown course"}), 404
    ov = list(db.get_setting("prereq_overrides", []) or [])
    if course_id not in ov:
        ov.append(course_id)
        db.set_setting("prereq_overrides", ov)
    return jsonify({"ok": True, "lock": _prereq_lock(course_id)})


# --------------------------------------------------------------------------- main
def main() -> None:
    db.init()
    recovered = db.recover_stuck_jobs()
    if recovered:
        print(f"[Self-Taught] recovered {recovered} lesson(s) left in 'generating' by a previous shutdown")
    curriculum.ensure_loaded()
    _load_sims_registry()
    threading.Thread(target=_reindex_fts, daemon=True).start()
    threading.Thread(target=_janitor_loop, daemon=True).start()
    st = curriculum.stats()
    print(f"[Self-Taught] {st['domains']} domains · {st['courses']} courses · {st['lessons']} lessons loaded")
    for e in st["errors"]:
        print("[Self-Taught] curriculum error:", e)
    print(f"[Self-Taught] Gemini key: {llm.status()['key_source']}")
    print(f"[Self-Taught] http://127.0.0.1:{PORT}")
    app.run(host="127.0.0.1", port=PORT, threaded=True, debug=False)


if __name__ == "__main__":
    main()

