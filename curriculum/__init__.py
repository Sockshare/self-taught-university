"""Curriculum loader: merges built-in domain catalogs (curriculum/*.py) with learner-designed
custom domains (data/custom/*.json) and exposes fast lookups.

Lesson ids are dotted paths: ``<domain>.<subject>.<course>.<module>.<lesson_index>``.
"""
from __future__ import annotations

import glob
import importlib.util
import json
import os
import re
import threading
from typing import Any

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRICULUM_DIR = os.path.join(ROOT, "curriculum")
CUSTOM_DIR = os.path.join(ROOT, "data", "custom")

LEVEL_NAMES = {100: "Freshman", 200: "Sophomore", 300: "Junior", 400: "Senior", 500: "Graduate", 600: "Master's"}
SLUG = re.compile(r"^[a-z0-9_]+$")

_lock = threading.RLock()
_state: dict[str, Any] = {"domains": [], "by_domain": {}, "courses": {}, "lessons": {}, "loaded": False, "errors": []}


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "_", (text or "").lower()).strip("_")
    return s or "item"


def _load_builtin() -> list[dict]:
    domains = []
    for path in sorted(glob.glob(os.path.join(CURRICULUM_DIR, "*.py"))):
        name = os.path.basename(path)
        if name.startswith("_"):
            continue
        try:
            spec = importlib.util.spec_from_file_location(f"st_curriculum_{name[:-3]}", path)
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)  # type: ignore[union-attr]
            dom = getattr(mod, "DOMAIN", None)
            if isinstance(dom, dict) and dom.get("id"):
                dom = json.loads(json.dumps(dom))  # deep copy / normalise
                dom["builtin"] = True
                domains.append(dom)
        except Exception as e:  # noqa: BLE001
            _state["errors"].append(f"{name}: {e}")
    return domains


def _load_custom() -> list[dict]:
    domains = []
    os.makedirs(CUSTOM_DIR, exist_ok=True)
    for path in sorted(glob.glob(os.path.join(CUSTOM_DIR, "*.json"))):
        try:
            with open(path, "r", encoding="utf-8") as f:
                dom = json.load(f)
            if isinstance(dom, dict) and dom.get("id"):
                dom["builtin"] = False
                dom["custom_path"] = path
                domains.append(dom)
        except Exception as e:  # noqa: BLE001
            _state["errors"].append(f"{os.path.basename(path)}: {e}")
    return domains


def normalise_domain(dom: dict) -> dict:
    """Fill defaults, coerce ids to slugs, make course ids unique within the domain, and index lessons."""
    dom["id"] = slugify(dom.get("id") or dom.get("name"))
    dom.setdefault("name", dom["id"].replace("_", " ").title())
    dom.setdefault("icon", "📚")
    dom.setdefault("color", "#7c9cff")
    dom.setdefault("tagline", "")
    dom.setdefault("description", "")
    dom.setdefault("subjects", [])
    seen_subj: set[str] = set()
    for s in dom["subjects"]:
        s["id"] = slugify(s.get("id") or s.get("name"))
        while s["id"] in seen_subj:
            s["id"] += "_2"
        seen_subj.add(s["id"])
        s.setdefault("name", s["id"].replace("_", " ").title())
        s.setdefault("icon", "📘")
        s.setdefault("description", "")
        s.setdefault("courses", [])
        for c in s["courses"]:
            c["id"] = slugify(c.get("id") or c.get("title"))
            c.setdefault("title", c["id"].replace("_", " ").title())
            c.setdefault("code", c["id"].upper()[:12])
            try:
                c["level"] = int(c.get("level", 100))
            except Exception:  # noqa: BLE001
                c["level"] = 100
            if c["level"] not in LEVEL_NAMES:
                c["level"] = min(LEVEL_NAMES, key=lambda k: abs(k - c["level"]))
            try:
                c["credits"] = max(1, min(6, int(c.get("credits", 3))))
            except Exception:  # noqa: BLE001
                c["credits"] = 3
            c.setdefault("description", "")
            c["prerequisites"] = [p for p in (c.get("prerequisites") or []) if isinstance(p, str)]
            c.setdefault("modules", [])
            seen_mod: set[str] = set()
            for m in c["modules"]:
                m["id"] = slugify(m.get("id") or m.get("title"))
                while m["id"] in seen_mod:
                    m["id"] += "_2"
                seen_mod.add(m["id"])
                m.setdefault("title", m["id"].replace("_", " ").title())
                m.setdefault("summary", "")
                lessons = m.get("lessons") or []
                m["lessons"] = [str(x).strip() for x in lessons if str(x).strip()]
                if m.get("sim") is not None and not isinstance(m.get("sim"), str):
                    m["sim"] = None
                m["lab"] = bool(m.get("lab"))
    return dom


def _index(domains: list[dict]) -> None:
    by_domain: dict[str, dict] = {}
    courses: dict[str, dict] = {}
    lessons: dict[str, dict] = {}
    for d in domains:
        by_domain[d["id"]] = d
        d["lesson_count"] = 0
        d["course_count"] = 0
        for s in d["subjects"]:
            s["lesson_count"] = 0
            for c in s["courses"]:
                c["domain_id"], c["subject_id"] = d["id"], s["id"]
                c["lesson_count"] = sum(len(m["lessons"]) for m in c["modules"])
                c["level_name"] = LEVEL_NAMES.get(c["level"], str(c["level"]))
                s["lesson_count"] += c["lesson_count"]
                d["course_count"] += 1
                if c["id"] in courses:  # global uniqueness: prefix with domain if clash
                    c["id"] = f"{d['id']}_{c['id']}"
                courses[c["id"]] = c
                for m in c["modules"]:
                    m["lesson_ids"] = []
                    for i, title in enumerate(m["lessons"]):
                        lid = f"{d['id']}.{s['id']}.{c['id']}.{m['id']}.{i}"
                        m["lesson_ids"].append(lid)
                        lessons[lid] = {
                            "id": lid, "title": title, "index": i,
                            "domain_id": d["id"], "subject_id": s["id"], "course_id": c["id"], "module_id": m["id"],
                        }
            d["lesson_count"] += s["lesson_count"]
    _state.update({"domains": domains, "by_domain": by_domain, "courses": courses, "lessons": lessons, "loaded": True})


def reload() -> None:
    with _lock:
        _state["errors"] = []
        domains = [normalise_domain(d) for d in _load_builtin() + _load_custom()]
        _index(domains)
        try:  # cross-faculty foundation links (see curriculum/_overlay.py)
            from . import _overlay
            _state["overlay_skipped"] = _overlay.apply(_state["courses"])
        except Exception as e:  # noqa: BLE001
            _state["errors"].append(f"_overlay.py: {e}")


def ensure_loaded() -> None:
    if not _state["loaded"]:
        reload()


def errors() -> list[str]:
    ensure_loaded()
    return list(_state["errors"])


def domains() -> list[dict]:
    ensure_loaded()
    return _state["domains"]


def domain(domain_id: str) -> dict | None:
    ensure_loaded()
    return _state["by_domain"].get(domain_id) or _state["by_domain"].get(slugify(domain_id))


def get_domain(domain_id: str) -> dict | None:
    return domain(domain_id)


def course(course_id: str) -> dict | None:
    ensure_loaded()
    return _state["courses"].get(course_id) or _state["courses"].get(slugify(course_id))


def get_course(course_id: str) -> dict | None:
    c = course(course_id)
    if not c:
        return None
    d = domain(c["domain_id"])
    if not d:
        return None
    s = next((x for x in d.get("subjects", []) if x["id"] == c.get("subject_id")), None) or {"id": "general", "name": "General"}
    return {"course": c, "domain": d, "subject": s}


def courses() -> dict[str, dict]:
    ensure_loaded()
    return _state["courses"]


def lessons() -> dict[str, dict]:
    ensure_loaded()
    return _state["lessons"]


def lesson(lesson_id: str) -> dict | None:
    ensure_loaded()
    return _state["lessons"].get(lesson_id)


def lesson_context(lesson_id: str) -> dict | None:
    """Everything a prompt or UI needs to know about where a lesson sits."""
    meta = lesson(lesson_id)
    if not meta:
        return None
    d = domain(meta["domain_id"])
    s = next((x for x in d["subjects"] if x["id"] == meta["subject_id"]), None)
    c = course(meta["course_id"])
    m = next((x for x in c["modules"] if x["id"] == meta["module_id"]), None)
    idx = meta["index"]
    prev_title = m["lessons"][idx - 1] if idx > 0 else None
    next_title = m["lessons"][idx + 1] if idx + 1 < len(m["lessons"]) else None
    # next lesson id (across modules)
    next_id = None
    prev_id = None
    flat = [lid for mod in c["modules"] for lid in mod["lesson_ids"]]
    pos = flat.index(lesson_id)
    if pos + 1 < len(flat):
        next_id = flat[pos + 1]
    if pos > 0:
        prev_id = flat[pos - 1]
    return {
        "lesson": meta,
        "domain": {k: d[k] for k in ("id", "name", "icon", "color", "tagline")},
        "subject": {k: s[k] for k in ("id", "name", "icon", "description")},
        "course": {k: c[k] for k in ("id", "code", "title", "level", "level_name", "credits", "description", "prerequisites", "lesson_count")},
        "module": {"id": m["id"], "title": m["title"], "summary": m["summary"], "sim": m.get("sim"), "lab": m.get("lab"), "lessons": m["lessons"]},
        "prev_title": prev_title, "next_title": next_title, "next_id": next_id, "prev_id": prev_id,
        "position": {"index_in_course": pos, "course_total": len(flat)},
        "instructor": next(({k: f.get(k) for k in ("id", "name", "title", "specialty", "persona")}
                            for f in d.get("faculty") or [] if isinstance(f, dict) and f.get("id") == c.get("instructor")), None),
    }


def save_custom_domain(dom: dict) -> dict:
    """Persist a learner-designed domain (or merge new subjects into an existing custom domain)."""
    os.makedirs(CUSTOM_DIR, exist_ok=True)
    dom = normalise_domain(json.loads(json.dumps(dom)))
    existing = domain(dom["id"])
    if existing and existing.get("builtin"):
        dom["id"] = dom["id"] + "_custom"
    path = os.path.join(CUSTOM_DIR, f"{dom['id']}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            old = json.load(f)
        known = {s["id"] for s in old.get("subjects", [])}
        for s in dom["subjects"]:
            if s["id"] in known:
                # merge courses
                target = next(x for x in old["subjects"] if x["id"] == s["id"])
                kc = {c["id"] for c in target.get("courses", [])}
                target["courses"].extend([c for c in s["courses"] if c["id"] not in kc])
            else:
                old["subjects"].append(s)
        dom = old
    for key in ("builtin", "custom_path", "lesson_count", "course_count"):
        dom.pop(key, None)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dom, f, indent=1, ensure_ascii=False)
    reload()
    return domain(dom["id"])


def delete_custom_domain(domain_id: str) -> bool:
    d = domain(domain_id)
    if not d or d.get("builtin"):
        return False
    try:
        os.remove(d["custom_path"])
    except OSError:
        return False
    reload()
    return True


def stats() -> dict:
    ensure_loaded()
    return {
        "domains": len(_state["domains"]),
        "courses": len(_state["courses"]),
        "lessons": len(_state["lessons"]),
        "errors": _state["errors"],
    }
