"""SQLite persistence for Self-Taught (progress, XP, badges, lesson cache, feedback, chat, settings)."""
from __future__ import annotations

import json
import os
import sqlite3
import threading
import time
from typing import Any

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT, "data")
DB_PATH = os.environ.get("SELF_TAUGHT_DB", os.path.join(DATA_DIR, "self_taught.db"))

_local = threading.local()
_write_lock = threading.RLock()

SCHEMA = """
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lesson_cache (
    lesson_id TEXT NOT NULL, version INTEGER NOT NULL, content TEXT NOT NULL, model TEXT,
    created_at REAL NOT NULL, PRIMARY KEY (lesson_id, version));
CREATE TABLE IF NOT EXISTS lesson_state (
    lesson_id TEXT PRIMARY KEY, current_version INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'idle',
    error TEXT, updated_at REAL NOT NULL);
CREATE TABLE IF NOT EXISTS progress (
    lesson_id TEXT PRIMARY KEY, started_at REAL, completed_at REAL, lecture_done INTEGER NOT NULL DEFAULT 0,
    score REAL, checkpoints TEXT NOT NULL DEFAULT '{}', homework TEXT, time_spent INTEGER NOT NULL DEFAULT 0,
    last_visited REAL, visits INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS xp_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL NOT NULL, amount INTEGER NOT NULL, reason TEXT NOT NULL,
    ref TEXT, day TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS badges (badge_id TEXT PRIMARY KEY, earned_at REAL NOT NULL, context TEXT);
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL NOT NULL, scope TEXT NOT NULL, lesson_id TEXT, rating INTEGER,
    tags TEXT, comment TEXT, status TEXT NOT NULL DEFAULT 'new', response TEXT);
CREATE TABLE IF NOT EXISTS chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, ts REAL NOT NULL);
CREATE TABLE IF NOT EXISTS sim_challenges (sim_id TEXT NOT NULL, challenge_id TEXT NOT NULL, ts REAL NOT NULL,
    PRIMARY KEY (sim_id, challenge_id));
CREATE TABLE IF NOT EXISTS homework_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id TEXT NOT NULL, ts REAL NOT NULL, answers TEXT NOT NULL,
    grading TEXT NOT NULL, score REAL NOT NULL);
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL NOT NULL, kind TEXT NOT NULL, data TEXT);
CREATE TABLE IF NOT EXISTS notebook_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, body TEXT NOT NULL, tags TEXT NOT NULL DEFAULT '[]',
    lesson_id TEXT, course_id TEXT, created_at REAL NOT NULL, updated_at REAL NOT NULL);
CREATE TABLE IF NOT EXISTS mistake_journal (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL NOT NULL, lesson_id TEXT, course_id TEXT, domain_id TEXT,
    source TEXT NOT NULL, question TEXT NOT NULL, learner_answer TEXT, correct_answer TEXT,
    category TEXT NOT NULL, diagnosis TEXT, resolved INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS exam_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL NOT NULL, scope_type TEXT NOT NULL, scope_id TEXT NOT NULL,
    title TEXT NOT NULL, duration_sec INTEGER NOT NULL, elapsed_sec INTEGER NOT NULL,
    questions TEXT NOT NULL, answers TEXT NOT NULL, grading TEXT NOT NULL, score REAL NOT NULL, grade TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS capstone_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, capstone_id TEXT NOT NULL, ts REAL NOT NULL,
    submission TEXT NOT NULL, code TEXT, evaluation TEXT NOT NULL, score REAL NOT NULL);
CREATE TABLE IF NOT EXISTS scholastic_tracks (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, overall_goal TEXT NOT NULL, description TEXT,
    domains TEXT NOT NULL DEFAULT '[]', active INTEGER NOT NULL DEFAULT 0,
    start_date TEXT NOT NULL, weeks INTEGER NOT NULL DEFAULT 8, days_per_week INTEGER NOT NULL DEFAULT 5,
    mins_per_day INTEGER NOT NULL DEFAULT 60, phases TEXT NOT NULL DEFAULT '[]',
    courses TEXT NOT NULL DEFAULT '[]', lessons TEXT NOT NULL DEFAULT '[]',
    schedule TEXT NOT NULL DEFAULT '[]', created_at REAL NOT NULL, updated_at REAL NOT NULL);
CREATE TABLE IF NOT EXISTS srs_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id TEXT, course_id TEXT, kind TEXT NOT NULL DEFAULT 'glossary',
    front TEXT NOT NULL, back TEXT NOT NULL, ease REAL NOT NULL DEFAULT 2.5, interval_days REAL NOT NULL DEFAULT 0,
    reps INTEGER NOT NULL DEFAULT 0, lapses INTEGER NOT NULL DEFAULT 0, due REAL NOT NULL, last_reviewed REAL,
    created_at REAL NOT NULL, suspended INTEGER NOT NULL DEFAULT 0, UNIQUE(lesson_id, front));
CREATE TABLE IF NOT EXISTS lab_drafts (
    lesson_id TEXT NOT NULL, slot TEXT NOT NULL DEFAULT 'lab', code TEXT NOT NULL, updated_at REAL NOT NULL,
    PRIMARY KEY (lesson_id, slot));
CREATE TABLE IF NOT EXISTS saved_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, lesson_id TEXT NOT NULL, title TEXT,
    data TEXT NOT NULL, created_at REAL NOT NULL, updated_at REAL NOT NULL);
CREATE TABLE IF NOT EXISTS course_credits (
    course_id TEXT PRIMARY KEY, method TEXT NOT NULL, score REAL, attempt_id INTEGER, ts REAL NOT NULL);
CREATE TABLE IF NOT EXISTS degrees_conferred (
    degree_id TEXT PRIMARY KEY, title TEXT NOT NULL, kind TEXT, conferred_at REAL NOT NULL,
    gpa REAL, honors TEXT, data TEXT);
CREATE INDEX IF NOT EXISTS idx_srs_due ON srs_cards(due, suspended);
CREATE INDEX IF NOT EXISTS idx_sessions_lesson ON saved_sessions(kind, lesson_id);
CREATE INDEX IF NOT EXISTS idx_xp_day ON xp_events(day);
CREATE INDEX IF NOT EXISTS idx_chat_lesson ON chat(lesson_id);
CREATE INDEX IF NOT EXISTS idx_feedback_lesson ON feedback(lesson_id);
CREATE INDEX IF NOT EXISTS idx_mistake_domain ON mistake_journal(domain_id, resolved);
"""


def connect() -> sqlite3.Connection:
    conn = getattr(_local, "conn", None)
    if conn is None:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH, timeout=30, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA synchronous=NORMAL")
        _local.conn = conn
    return conn


FTS_AVAILABLE = False


def init() -> None:
    global FTS_AVAILABLE
    with _write_lock:
        conn = connect()
        conn.executescript(SCHEMA)
        try:
            conn.execute("CREATE VIRTUAL TABLE IF NOT EXISTS search_fts USING fts5(kind UNINDEXED, ref UNINDEXED, "
                         "title, body, tokenize='porter unicode61')")
            FTS_AVAILABLE = True
        except sqlite3.OperationalError:
            FTS_AVAILABLE = False
        conn.commit()


def recover_stuck_jobs() -> int:
    """Reset lesson_state rows left in 'generating' by a killed server (ready if cached content exists)."""
    with _write_lock:
        conn = connect()
        cur = conn.execute(
            "UPDATE lesson_state SET status=CASE WHEN EXISTS(SELECT 1 FROM lesson_cache c WHERE c.lesson_id=lesson_state.lesson_id) "
            "THEN 'ready' ELSE 'idle' END, error=NULL, updated_at=? WHERE status='generating'", (now(),))
        conn.commit()
        return cur.rowcount or 0


def now() -> float:
    return time.time()


def today(ts: float | None = None) -> str:
    return time.strftime("%Y-%m-%d", time.localtime(ts or now()))


def execute(sql: str, params: tuple | list = ()) -> sqlite3.Cursor:
    with _write_lock:
        conn = connect()
        cur = conn.execute(sql, params)
        conn.commit()
        return cur


def query(sql: str, params: tuple | list = ()) -> list[sqlite3.Row]:
    return connect().execute(sql, params).fetchall()


def query_one(sql: str, params: tuple | list = ()) -> sqlite3.Row | None:
    return connect().execute(sql, params).fetchone()


# ---------------------------------------------------------------- settings
DEFAULT_SETTINGS: dict[str, Any] = {
    "learner_name": "Scholar",
    "gemini_api_key": "",
    "model": "auto",
    "preferences": {
        "depth": "deep",            # concise | standard | deep
        "tone": "playful",          # playful | professional | socratic
        "rigor": "balanced",        # intuitive | balanced | rigorous
        "examples": "mixed",        # mixed | real_world | code | historical
        "humor": "some",            # none | some | lots
        "daily_goal_xp": 150,
    },
    "professor_notes": "",
    "voice_persona": "claire_evans",
    "voice_engine": "gemini",
    "voice_speed": 1.0,
    "onboarded": False,
    "enforce_prereqs": True,     # soft-lock courses/lessons until prerequisites are complete (override per course)
    "prereq_overrides": [],      # course ids the learner chose to unlock early
}


def get_setting(key: str, default: Any = None) -> Any:
    row = query_one("SELECT value FROM settings WHERE key=?", (key,))
    if row is None:
        return DEFAULT_SETTINGS.get(key, default) if default is None else default
    try:
        return json.loads(row["value"])
    except Exception:  # noqa: BLE001
        return row["value"]


def set_setting(key: str, value: Any) -> None:
    execute("INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            (key, json.dumps(value)))


def all_settings() -> dict[str, Any]:
    out = json.loads(json.dumps(DEFAULT_SETTINGS))
    for row in query("SELECT key, value FROM settings"):
        try:
            val = json.loads(row["value"])
        except Exception:  # noqa: BLE001
            val = row["value"]
        if isinstance(val, dict) and isinstance(out.get(row["key"]), dict):
            out[row["key"]].update(val)
        else:
            out[row["key"]] = val
    return out


# ---------------------------------------------------------------- lesson cache
def lesson_state(lesson_id: str) -> dict:
    row = query_one("SELECT * FROM lesson_state WHERE lesson_id=?", (lesson_id,))
    if row is None:
        return {"lesson_id": lesson_id, "current_version": 0, "status": "idle", "error": None, "updated_at": 0}
    return dict(row)


def set_lesson_state(lesson_id: str, status: str, error: str | None = None, version: int | None = None) -> None:
    st = lesson_state(lesson_id)
    v = st["current_version"] if version is None else version
    execute("INSERT INTO lesson_state(lesson_id, current_version, status, error, updated_at) VALUES(?,?,?,?,?) "
            "ON CONFLICT(lesson_id) DO UPDATE SET current_version=excluded.current_version, status=excluded.status, "
            "error=excluded.error, updated_at=excluded.updated_at", (lesson_id, v, status, error, now()))


def get_lesson_content(lesson_id: str, version: int | None = None) -> dict | None:
    if version is None:
        row = query_one("SELECT * FROM lesson_cache WHERE lesson_id=? ORDER BY version DESC LIMIT 1", (lesson_id,))
    else:
        row = query_one("SELECT * FROM lesson_cache WHERE lesson_id=? AND version=?", (lesson_id, version))
    if row is None:
        return None
    content = json.loads(row["content"])
    content["_version"] = row["version"]
    content["_model"] = row["model"]
    content["_created_at"] = row["created_at"]
    return content


def save_lesson_content(lesson_id: str, content: dict, model: str) -> int:
    row = query_one("SELECT MAX(version) AS v FROM lesson_cache WHERE lesson_id=?", (lesson_id,))
    version = int(row["v"] or 0) + 1
    execute("INSERT INTO lesson_cache(lesson_id, version, content, model, created_at) VALUES(?,?,?,?,?)",
            (lesson_id, version, json.dumps(content, ensure_ascii=False), model, now()))
    set_lesson_state(lesson_id, "ready", None, version)
    return version


def lesson_versions(lesson_id: str) -> list[dict]:
    return [dict(r) for r in query("SELECT version, model, created_at FROM lesson_cache WHERE lesson_id=? ORDER BY version", (lesson_id,))]


def cached_lesson_ids() -> set[str]:
    return {r["lesson_id"] for r in query("SELECT DISTINCT lesson_id FROM lesson_cache")}


# ---------------------------------------------------------------- progress
def get_progress(lesson_id: str) -> dict:
    row = query_one("SELECT * FROM progress WHERE lesson_id=?", (lesson_id,))
    if row is None:
        return {"lesson_id": lesson_id, "started_at": None, "completed_at": None, "lecture_done": 0, "score": None,
                "checkpoints": {}, "homework": None, "time_spent": 0, "last_visited": None, "visits": 0}
    d = dict(row)
    d["checkpoints"] = json.loads(d["checkpoints"] or "{}")
    d["homework"] = json.loads(d["homework"]) if d["homework"] else None
    return d


def touch_progress(lesson_id: str) -> dict:
    p = get_progress(lesson_id)
    first = p["started_at"] is None
    execute("INSERT INTO progress(lesson_id, started_at, last_visited, visits) VALUES(?,?,?,1) "
            "ON CONFLICT(lesson_id) DO UPDATE SET last_visited=excluded.last_visited, visits=progress.visits+1",
            (lesson_id, now(), now()))
    p = get_progress(lesson_id)
    p["first_visit"] = first
    return p


def update_progress(lesson_id: str, **fields: Any) -> dict:
    touch = get_progress(lesson_id)
    if touch["started_at"] is None:
        touch_progress(lesson_id)
    sets, vals = [], []
    for k, v in fields.items():
        if k in ("checkpoints", "homework") and v is not None and not isinstance(v, str):
            v = json.dumps(v)
        sets.append(f"{k}=?")
        vals.append(v)
    if sets:
        vals.append(lesson_id)
        execute(f"UPDATE progress SET {', '.join(sets)} WHERE lesson_id=?", vals)
    return get_progress(lesson_id)


def add_time_spent(lesson_id: str, seconds: int) -> int:
    """Accumulate active study seconds for a lesson (heartbeat from the lesson view)."""
    seconds = max(0, min(int(seconds), 300))
    if get_progress(lesson_id)["started_at"] is None:
        touch_progress(lesson_id)
    execute("UPDATE progress SET time_spent=time_spent+? WHERE lesson_id=?", (seconds, lesson_id))
    return int(get_progress(lesson_id)["time_spent"])


def total_time_spent() -> int:
    row = query_one("SELECT COALESCE(SUM(time_spent),0) AS t FROM progress")
    return int(row["t"]) if row else 0


def all_progress() -> dict[str, dict]:
    out = {}
    for row in query("SELECT * FROM progress"):
        d = dict(row)
        d["checkpoints"] = json.loads(d["checkpoints"] or "{}")
        d["homework"] = json.loads(d["homework"]) if d["homework"] else None
        out[d["lesson_id"]] = d
    return out


def completed_lesson_ids() -> set[str]:
    return {r["lesson_id"] for r in query("SELECT lesson_id FROM progress WHERE completed_at IS NOT NULL")}


# ---------------------------------------------------------------- XP / badges
def add_xp(amount: int, reason: str, ref: str | None = None) -> int:
    amount = int(amount)
    if amount == 0:
        return 0
    execute("INSERT INTO xp_events(ts, amount, reason, ref, day) VALUES(?,?,?,?,?)", (now(), amount, reason, ref, today()))
    return amount


def total_xp() -> int:
    row = query_one("SELECT COALESCE(SUM(amount),0) AS t FROM xp_events")
    return int(row["t"]) if row else 0


def xp_by_day(days: int = 60) -> list[dict]:
    rows = query("SELECT day, SUM(amount) AS xp, COUNT(*) AS n FROM xp_events GROUP BY day ORDER BY day DESC LIMIT ?", (days,))
    return [dict(r) for r in rows]


def xp_today() -> int:
    row = query_one("SELECT COALESCE(SUM(amount),0) AS t FROM xp_events WHERE day=?", (today(),))
    return int(row["t"]) if row else 0


def xp_reason_count(reason: str, day: str | None = None) -> int:
    if day:
        row = query_one("SELECT COUNT(*) AS n FROM xp_events WHERE reason=? AND day=?", (reason, day))
    else:
        row = query_one("SELECT COUNT(*) AS n FROM xp_events WHERE reason=?", (reason,))
    return int(row["n"]) if row else 0


def recent_xp(limit: int = 20) -> list[dict]:
    return [dict(r) for r in query("SELECT * FROM xp_events ORDER BY id DESC LIMIT ?", (limit,))]


def earned_badges() -> dict[str, dict]:
    return {r["badge_id"]: dict(r) for r in query("SELECT * FROM badges")}


def award_badge(badge_id: str, context: str | None = None) -> bool:
    if query_one("SELECT 1 FROM badges WHERE badge_id=?", (badge_id,)):
        return False
    execute("INSERT INTO badges(badge_id, earned_at, context) VALUES(?,?,?)", (badge_id, now(), context))
    return True


# ---------------------------------------------------------------- feedback / chat / sims / events
def add_feedback(scope: str, lesson_id: str | None, rating: int | None, tags: list[str] | None, comment: str) -> int:
    cur = execute("INSERT INTO feedback(ts, scope, lesson_id, rating, tags, comment) VALUES(?,?,?,?,?,?)",
                  (now(), scope, lesson_id, rating, json.dumps(tags or []), comment))
    return int(cur.lastrowid)


def feedback_for_lesson(lesson_id: str) -> list[dict]:
    rows = query("SELECT * FROM feedback WHERE lesson_id=? ORDER BY id", (lesson_id,))
    return [_fb(r) for r in rows]


def all_feedback() -> list[dict]:
    return [_fb(r) for r in query("SELECT * FROM feedback ORDER BY id DESC")]


def set_feedback_status(fid: int, status: str, response: str | None = None) -> None:
    execute("UPDATE feedback SET status=?, response=COALESCE(?, response) WHERE id=?", (status, response, fid))


def _fb(r: sqlite3.Row) -> dict:
    d = dict(r)
    try:
        d["tags"] = json.loads(d["tags"] or "[]")
    except Exception:  # noqa: BLE001
        d["tags"] = []
    return d


def add_chat(lesson_id: str, role: str, content: str) -> None:
    execute("INSERT INTO chat(lesson_id, role, content, ts) VALUES(?,?,?,?)", (lesson_id, role, content, now()))


def chat_history(lesson_id: str, limit: int = 40) -> list[dict]:
    rows = query("SELECT role, content, ts FROM chat WHERE lesson_id=? ORDER BY id DESC LIMIT ?", (lesson_id, limit))
    return [dict(r) for r in reversed(rows)]


def clear_chat(lesson_id: str) -> None:
    execute("DELETE FROM chat WHERE lesson_id=?", (lesson_id,))


def chat_count() -> int:
    row = query_one("SELECT COUNT(*) AS n FROM chat WHERE role='user'")
    return int(row["n"]) if row else 0


def complete_sim_challenge(sim_id: str, challenge_id: str) -> bool:
    if query_one("SELECT 1 FROM sim_challenges WHERE sim_id=? AND challenge_id=?", (sim_id, challenge_id)):
        return False
    execute("INSERT INTO sim_challenges(sim_id, challenge_id, ts) VALUES(?,?,?)", (sim_id, challenge_id, now()))
    return True


def sim_challenges_done(sim_id: str | None = None) -> list[dict]:
    if sim_id:
        return [dict(r) for r in query("SELECT * FROM sim_challenges WHERE sim_id=?", (sim_id,))]
    return [dict(r) for r in query("SELECT * FROM sim_challenges")]


def add_submission(lesson_id: str, answers: dict, grading: dict, score: float) -> int:
    cur = execute("INSERT INTO homework_submissions(lesson_id, ts, answers, grading, score) VALUES(?,?,?,?,?)",
                  (lesson_id, now(), json.dumps(answers), json.dumps(grading), score))
    return int(cur.lastrowid)


def submissions(lesson_id: str) -> list[dict]:
    out = []
    for r in query("SELECT * FROM homework_submissions WHERE lesson_id=? ORDER BY id", (lesson_id,)):
        d = dict(r)
        d["answers"] = json.loads(d["answers"])
        d["grading"] = json.loads(d["grading"])
        out.append(d)
    return out


def log_event(kind: str, data: dict | None = None) -> None:
    execute("INSERT INTO events(ts, kind, data) VALUES(?,?,?)", (now(), kind, json.dumps(data or {})))


def count(table: str, where: str = "1=1", params: tuple = ()) -> int:
    row = query_one(f"SELECT COUNT(*) AS n FROM {table} WHERE {where}", params)
    return int(row["n"]) if row else 0


# Learner-owned tables included in export/import/reset (lesson_cache is regenerable and excluded from export).
USER_TABLES = ("progress", "xp_events", "badges", "feedback", "chat", "sim_challenges", "homework_submissions",
               "notebook_notes", "mistake_journal", "exam_attempts", "capstone_submissions", "scholastic_tracks",
               "srs_cards", "lab_drafts", "saved_sessions", "course_credits", "degrees_conferred")


def reset_all(keep_settings: bool = True) -> None:
    with _write_lock:
        conn = connect()
        for t in ("lesson_cache", "lesson_state", "events") + USER_TABLES:
            conn.execute(f"DELETE FROM {t}")
        if FTS_AVAILABLE:
            conn.execute("DELETE FROM search_fts")
        if not keep_settings:
            conn.execute("DELETE FROM settings")
        conn.commit()


def export_all() -> dict:
    out: dict[str, Any] = {"format": "self_taught_backup", "schema_version": 2, "exported_at": now(),
                           "settings": all_settings()}
    for t in USER_TABLES:
        out[t] = [dict(r) for r in query(f"SELECT * FROM {t}")]
    return out


def _table_columns(conn: sqlite3.Connection, table: str) -> list[str]:
    return [r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()]


def import_all(data: dict, mode: str = "replace", include_settings: bool = True) -> dict[str, int]:
    """Restore a JSON backup produced by export_all().

    mode='replace' wipes learner tables first; mode='merge' inserts rows, ignoring primary-key conflicts.
    Unknown tables/columns are ignored so older or newer backups still restore cleanly.
    """
    if not isinstance(data, dict):
        raise ValueError("Backup must be a JSON object")
    if not any(isinstance(data.get(t), list) for t in USER_TABLES):
        raise ValueError("This file does not look like a Self-Taught backup (no known tables found)")
    counts: dict[str, int] = {}
    with _write_lock:
        conn = connect()
        try:
            conn.execute("BEGIN")
            for t in USER_TABLES:
                rows = data.get(t)
                if not isinstance(rows, list):
                    continue
                if mode == "replace":
                    conn.execute(f"DELETE FROM {t}")
                cols = set(_table_columns(conn, t))
                n = 0
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    keep = {k: (json.dumps(v) if isinstance(v, (dict, list)) else v) for k, v in row.items() if k in cols}
                    if not keep:
                        continue
                    names = ", ".join(keep)
                    marks = ", ".join("?" for _ in keep)
                    cur = conn.execute(f"INSERT OR IGNORE INTO {t}({names}) VALUES({marks})", list(keep.values()))
                    n += cur.rowcount or 0
                counts[t] = n
            if include_settings and isinstance(data.get("settings"), dict):
                for k, v in data["settings"].items():
                    if k == "gemini_api_key" and not v:
                        continue  # never wipe a working key with an empty one
                    conn.execute("INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                                 (k, json.dumps(v)))
                counts["settings"] = len(data["settings"])
            conn.commit()
        except Exception:
            conn.rollback()
            raise
    return counts


# ---------------------------------------------------------------- full-text search (FTS5)
def fts_upsert(kind: str, ref: str, title: str, body: str) -> None:
    if not FTS_AVAILABLE:
        return
    with _write_lock:
        conn = connect()
        conn.execute("DELETE FROM search_fts WHERE kind=? AND ref=?", (kind, str(ref)))
        conn.execute("INSERT INTO search_fts(kind, ref, title, body) VALUES(?,?,?,?)", (kind, str(ref), title or "", body or ""))
        conn.commit()


def fts_delete(kind: str, ref: str) -> None:
    if FTS_AVAILABLE:
        execute("DELETE FROM search_fts WHERE kind=? AND ref=?", (kind, str(ref)))


def fts_count() -> int:
    if not FTS_AVAILABLE:
        return 0
    row = query_one("SELECT COUNT(*) AS n FROM search_fts")
    return int(row["n"]) if row else 0


def fts_search(q: str, limit: int = 30) -> list[dict]:
    if not FTS_AVAILABLE or not q.strip():
        return []
    import re as _re
    terms = [t for t in _re.findall(r"\w+", q.lower()) if t]
    if not terms:
        return []
    match = " ".join(f'"{t}"*' for t in terms[:8])
    try:
        rows = query("SELECT kind, ref, title, snippet(search_fts, 3, '<mark>', '</mark>', ' … ', 18) AS snippet, "
                     "bm25(search_fts, 0, 0, 5.0, 1.0) AS rank FROM search_fts WHERE search_fts MATCH ? "
                     "ORDER BY rank LIMIT ?", (match, limit))
    except sqlite3.OperationalError:
        return []
    return [dict(r) for r in rows]


# ---------------------------------------------------------------- spaced repetition (SM-2)
def add_srs_card(front: str, back: str, lesson_id: str | None = None, course_id: str | None = None,
                 kind: str = "glossary") -> bool:
    front, back = str(front).strip()[:600], str(back).strip()[:1500]
    if not front or not back:
        return False
    if query_one("SELECT 1 FROM srs_cards WHERE front=? AND COALESCE(lesson_id,'')=COALESCE(?,'')", (front, lesson_id)):
        return False
    cur = execute("INSERT OR IGNORE INTO srs_cards(lesson_id, course_id, kind, front, back, due, created_at) "
                  "VALUES(?,?,?,?,?,?,?)", (lesson_id, course_id, kind, front, back, now(), now()))
    return bool(cur.rowcount)


def srs_due(limit: int = 30) -> list[dict]:
    return [dict(r) for r in query("SELECT * FROM srs_cards WHERE suspended=0 AND due<=? ORDER BY due LIMIT ?",
                                   (now(), limit))]


def srs_stats() -> dict:
    t = now()
    row = query_one("SELECT COUNT(*) AS total, SUM(CASE WHEN due<=? AND suspended=0 THEN 1 ELSE 0 END) AS due, "
                    "SUM(CASE WHEN reps=0 THEN 1 ELSE 0 END) AS new, SUM(CASE WHEN interval_days>=21 THEN 1 ELSE 0 END) AS mature "
                    "FROM srs_cards", (t,))
    d = dict(row) if row else {}
    return {k: int(d.get(k) or 0) for k in ("total", "due", "new", "mature")}


def srs_review(card_id: int, grade: int) -> dict | None:
    """SM-2 update. grade: 0=Again, 3=Hard, 4=Good, 5=Easy."""
    r = query_one("SELECT * FROM srs_cards WHERE id=?", (int(card_id),))
    if not r:
        return None
    c = dict(r)
    grade = max(0, min(5, int(grade)))
    ease, interval, reps, lapses = float(c["ease"]), float(c["interval_days"]), int(c["reps"]), int(c["lapses"])
    if grade < 3:
        reps, lapses, interval = 0, lapses + 1, 10 / 1440  # relearn in 10 minutes
    else:
        reps += 1
        if reps == 1:
            interval = 1
        elif reps == 2:
            interval = 6 if grade >= 4 else 3
        else:
            interval = max(1.0, interval * ease * (1.3 if grade == 5 else 0.8 if grade == 3 else 1.0))
    ease = max(1.3, ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)))
    due = now() + interval * 86400
    execute("UPDATE srs_cards SET ease=?, interval_days=?, reps=?, lapses=?, due=?, last_reviewed=? WHERE id=?",
            (ease, interval, reps, lapses, due, now(), int(card_id)))
    c.update(ease=ease, interval_days=interval, reps=reps, lapses=lapses, due=due)
    return c


def srs_list(limit: int = 500) -> list[dict]:
    return [dict(r) for r in query("SELECT * FROM srs_cards ORDER BY due LIMIT ?", (limit,))]


def srs_delete(card_id: int) -> None:
    execute("DELETE FROM srs_cards WHERE id=?", (int(card_id),))


# ---------------------------------------------------------------- lab drafts
def save_lab_draft(lesson_id: str, slot: str, code: str) -> None:
    execute("INSERT INTO lab_drafts(lesson_id, slot, code, updated_at) VALUES(?,?,?,?) ON CONFLICT(lesson_id, slot) "
            "DO UPDATE SET code=excluded.code, updated_at=excluded.updated_at", (lesson_id, slot or "lab", code[:200000], now()))


def get_lab_drafts(lesson_id: str) -> dict[str, dict]:
    return {r["slot"]: {"code": r["code"], "updated_at": r["updated_at"]}
            for r in query("SELECT * FROM lab_drafts WHERE lesson_id=?", (lesson_id,))}


def delete_lab_draft(lesson_id: str, slot: str) -> None:
    execute("DELETE FROM lab_drafts WHERE lesson_id=? AND slot=?", (lesson_id, slot))


# ---------------------------------------------------------------- saved sessions (podcast / viva / feynman)
def save_session(kind: str, lesson_id: str, data: dict, title: str | None = None, session_id: int | None = None) -> int:
    ts = now()
    if session_id:
        execute("UPDATE saved_sessions SET data=?, title=COALESCE(?, title), updated_at=? WHERE id=?",
                (json.dumps(data, ensure_ascii=False), title, ts, int(session_id)))
        return int(session_id)
    cur = execute("INSERT INTO saved_sessions(kind, lesson_id, title, data, created_at, updated_at) VALUES(?,?,?,?,?,?)",
                  (kind, lesson_id, title, json.dumps(data, ensure_ascii=False), ts, ts))
    return int(cur.lastrowid)


def list_sessions(kind: str | None = None, lesson_id: str | None = None, limit: int = 50) -> list[dict]:
    sql, params = "SELECT * FROM saved_sessions WHERE 1=1", []
    if kind:
        sql += " AND kind=?"
        params.append(kind)
    if lesson_id:
        sql += " AND lesson_id=?"
        params.append(lesson_id)
    sql += " ORDER BY updated_at DESC LIMIT ?"
    params.append(limit)
    out = []
    for r in query(sql, params):
        d = dict(r)
        try:
            d["data"] = json.loads(d["data"])
        except Exception:  # noqa: BLE001
            d["data"] = {}
        out.append(d)
    return out


def get_session(session_id: int) -> dict | None:
    r = query_one("SELECT * FROM saved_sessions WHERE id=?", (int(session_id),))
    if not r:
        return None
    d = dict(r)
    d["data"] = json.loads(d["data"] or "{}")
    return d


def delete_session(session_id: int) -> None:
    execute("DELETE FROM saved_sessions WHERE id=?", (int(session_id),))


# ---------------------------------------------------------------- course credit by examination (test-out)
def grant_course_credit(course_id: str, method: str, score: float | None, attempt_id: int | None = None) -> bool:
    if query_one("SELECT 1 FROM course_credits WHERE course_id=?", (course_id,)):
        return False
    execute("INSERT INTO course_credits(course_id, method, score, attempt_id, ts) VALUES(?,?,?,?,?)",
            (course_id, method, score, attempt_id, now()))
    return True


def course_credits() -> dict[str, dict]:
    return {r["course_id"]: dict(r) for r in query("SELECT * FROM course_credits")}


# ---------------------------------------------------------------- degrees conferred (Degree Paths graduation)
def confer_degree(degree_id: str, title: str, kind: str, gpa: float | None, honors: str | None, data: dict | None = None) -> bool:
    if query_one("SELECT 1 FROM degrees_conferred WHERE degree_id=?", (degree_id,)):
        return False
    execute("INSERT INTO degrees_conferred(degree_id, title, kind, conferred_at, gpa, honors, data) VALUES(?,?,?,?,?,?,?)",
            (degree_id, title, kind, now(), gpa, honors, json.dumps(data or {})))
    return True


def list_conferred() -> list[dict]:
    out = []
    for r in query("SELECT * FROM degrees_conferred ORDER BY conferred_at"):
        d = dict(r)
        try:
            d["data"] = json.loads(d.get("data") or "{}")
        except Exception:  # noqa: BLE001
            d["data"] = {}
        out.append(d)
    return out


# ---------------------------------------------------------------- notebook (Zettelkasten)
def save_note(title: str, body: str, tags: list[str] | None = None, lesson_id: str | None = None,
              course_id: str | None = None, note_id: int | None = None) -> dict:
    ts = now()
    tags_json = json.dumps(tags or [])
    if note_id:
        execute("UPDATE notebook_notes SET title=?, body=?, tags=?, lesson_id=COALESCE(?, lesson_id), course_id=COALESCE(?, course_id), updated_at=? WHERE id=?",
                (title, body, tags_json, lesson_id, course_id, ts, int(note_id)))
        nid = int(note_id)
    else:
        cur = execute("INSERT INTO notebook_notes(title, body, tags, lesson_id, course_id, created_at, updated_at) VALUES(?,?,?,?,?,?,?)",
                      (title, body, tags_json, lesson_id, course_id, ts, ts))
        nid = int(cur.lastrowid)
    fts_upsert("note", str(nid), title, body + " " + " ".join(tags or []))
    return get_note(nid) or {}


def get_note(note_id: int) -> dict | None:
    r = query_one("SELECT * FROM notebook_notes WHERE id=?", (int(note_id),))
    if not r:
        return None
    d = dict(r)
    try:
        d["tags"] = json.loads(d.get("tags") or "[]")
    except Exception:
        d["tags"] = []
    return d


def list_notes(lesson_id: str | None = None) -> list[dict]:
    if lesson_id:
        rows = query("SELECT * FROM notebook_notes WHERE lesson_id=? ORDER BY updated_at DESC", (lesson_id,))
    else:
        rows = query("SELECT * FROM notebook_notes ORDER BY updated_at DESC")
    out = []
    for r in rows:
        d = dict(r)
        try:
            d["tags"] = json.loads(d.get("tags") or "[]")
        except Exception:
            d["tags"] = []
        out.append(d)
    return out


def delete_note(note_id: int) -> None:
    execute("DELETE FROM notebook_notes WHERE id=?", (int(note_id),))
    fts_delete("note", str(note_id))


# ---------------------------------------------------------------- mistake autopsy journal
def log_mistake(lesson_id: str | None, course_id: str | None, domain_id: str | None, source: str,
                question: str, learner_answer: Any, correct_answer: Any, category: str, diagnosis: str = "") -> int:
    cur = execute(
        "INSERT INTO mistake_journal(ts, lesson_id, course_id, domain_id, source, question, learner_answer, correct_answer, category, diagnosis, resolved) VALUES(?,?,?,?,?,?,?,?,?,?,0)",
        (now(), lesson_id, course_id, domain_id, source, str(question)[:1200], str(learner_answer)[:800], str(correct_answer)[:800], category, str(diagnosis)[:1200]),
    )
    return int(cur.lastrowid)


def list_mistakes(resolved: int | None = None, limit: int = 100) -> list[dict]:
    if resolved is None:
        rows = query("SELECT * FROM mistake_journal ORDER BY id DESC LIMIT ?", (limit,))
    else:
        rows = query("SELECT * FROM mistake_journal WHERE resolved=? ORDER BY id DESC LIMIT ?", (int(resolved), limit))
    return [dict(r) for r in rows]


def resolve_mistake(mistake_id: int) -> None:
    execute("UPDATE mistake_journal SET resolved=1 WHERE id=?", (int(mistake_id),))


# ---------------------------------------------------------------- timed exams
def add_exam_attempt(scope_type: str, scope_id: str, title: str, duration_sec: int, elapsed_sec: int,
                     questions: list[dict], answers: dict, grading: dict, score: float, grade: str) -> int:
    cur = execute(
        "INSERT INTO exam_attempts(ts, scope_type, scope_id, title, duration_sec, elapsed_sec, questions, answers, grading, score, grade) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
        (now(), scope_type, scope_id, title, int(duration_sec), int(elapsed_sec), json.dumps(questions), json.dumps(answers), json.dumps(grading), float(score), grade),
    )
    return int(cur.lastrowid)


def list_exam_attempts(limit: int = 50) -> list[dict]:
    out = []
    for r in query("SELECT * FROM exam_attempts ORDER BY id DESC LIMIT ?", (limit,)):
        d = dict(r)
        for k in ("questions", "answers", "grading"):
            try:
                d[k] = json.loads(d.get(k) or "{}")
            except Exception:
                d[k] = {}
        out.append(d)
    return out


# ---------------------------------------------------------------- cross-domain capstones
def add_capstone_submission(capstone_id: str, submission: str, code: str, evaluation: dict, score: float) -> int:
    cur = execute(
        "INSERT INTO capstone_submissions(capstone_id, ts, submission, code, evaluation, score) VALUES(?,?,?,?,?,?)",
        (capstone_id, now(), submission, code, json.dumps(evaluation), float(score)),
    )
    return int(cur.lastrowid)


def list_capstone_submissions(capstone_id: str | None = None) -> list[dict]:
    rows = query("SELECT * FROM capstone_submissions WHERE capstone_id=? ORDER BY id DESC", (capstone_id,)) if capstone_id else query("SELECT * FROM capstone_submissions ORDER BY id DESC")
    out = []
    for r in rows:
        d = dict(r)
        try:
            d["evaluation"] = json.loads(d.get("evaluation") or "{}")
        except Exception:
            d["evaluation"] = {}
        out.append(d)
    return out


# ---------------------------------------------------------------- Super Aid: scholastic tracks & calendar schedules
def _unpack_track(r: sqlite3.Row) -> dict:
    d = dict(r)
    for k in ("domains", "phases", "courses", "lessons", "schedule"):
        try:
            d[k] = json.loads(d.get(k) or "[]")
        except Exception:
            d[k] = []
    d["active"] = bool(d.get("active"))
    return d


def save_scholastic_track(track: dict) -> dict:
    ts = now()
    tid = str(track.get("id") or f"track_{int(ts)}")
    existing = query_one("SELECT created_at FROM scholastic_tracks WHERE id=?", (tid,))
    created_at = float(existing["created_at"]) if existing else ts
    active = 1 if track.get("active") else 0
    if active:
        execute("UPDATE scholastic_tracks SET active=0")
    execute(
        """INSERT INTO scholastic_tracks(
            id, title, overall_goal, description, domains, active, start_date,
            weeks, days_per_week, mins_per_day, phases, courses, lessons, schedule, created_at, updated_at
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET
            title=excluded.title, overall_goal=excluded.overall_goal, description=excluded.description,
            domains=excluded.domains, active=excluded.active, start_date=excluded.start_date,
            weeks=excluded.weeks, days_per_week=excluded.days_per_week, mins_per_day=excluded.mins_per_day,
            phases=excluded.phases, courses=excluded.courses, lessons=excluded.lessons,
            schedule=excluded.schedule, updated_at=excluded.updated_at""",
        (
            tid,
            str(track.get("title") or "Custom Scholastic Track"),
            str(track.get("overall_goal") or ""),
            str(track.get("description") or ""),
            json.dumps(track.get("domains") or []),
            active,
            str(track.get("start_date") or today()),
            int(track.get("weeks") or 8),
            int(track.get("days_per_week") or 5),
            int(track.get("mins_per_day") or 60),
            json.dumps(track.get("phases") or []),
            json.dumps(track.get("courses") or []),
            json.dumps(track.get("lessons") or []),
            json.dumps(track.get("schedule") or []),
            created_at,
            ts,
        ),
    )
    return get_scholastic_track(tid) or {}


def get_scholastic_track(track_id: str) -> dict | None:
    r = query_one("SELECT * FROM scholastic_tracks WHERE id=?", (track_id,))
    return _unpack_track(r) if r else None


def list_scholastic_tracks() -> list[dict]:
    rows = query("SELECT * FROM scholastic_tracks ORDER BY active DESC, updated_at DESC")
    return [_unpack_track(r) for r in rows]


def set_active_scholastic_track(track_id: str) -> dict | None:
    execute("UPDATE scholastic_tracks SET active=0")
    execute("UPDATE scholastic_tracks SET active=1, updated_at=? WHERE id=?", (now(), track_id))
    return get_scholastic_track(track_id)


def delete_scholastic_track(track_id: str) -> None:
    execute("DELETE FROM scholastic_tracks WHERE id=?", (track_id,))


