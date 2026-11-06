"""Prompt construction for the AI professor: lessons, grading, tutoring, syllabus design, offline fallback."""
from __future__ import annotations

import json
from typing import Any

PROFESSOR_NAME = "Professor Sage"

LEVEL_GUIDANCE = {
    100: "Freshman level: assume curiosity but little background. Build intuition first, define every term, use everyday analogies, then introduce formalism gently.",
    200: "Sophomore level: assume one prior course. Balance intuition and formalism; introduce standard notation and first proofs/derivations.",
    300: "Junior level: assume solid foundations. Rigorous derivations, multi-step problem solving, connections between topics.",
    400: "Senior level: rigorous and dense. Expect comfort with abstraction; include proofs, edge cases, modern applications and open questions.",
    500: "Graduate level: research-adjacent. Formal precision, primary-literature awareness, derivations in full, critical discussion of assumptions and limitations.",
    600: "Master's level: expert treatment. Emphasize frontier results, methodological subtleties, and preparing the learner to read and critique current research.",
}

TONE_GUIDANCE = {
    "playful": "Warm, witty and energetic — the professor everyone wants. Light humor, vivid metaphors, but never at the expense of precision.",
    "professional": "Clear, polished and direct, like an excellent textbook author giving a well-rehearsed lecture.",
    "socratic": "Lead with questions; make the learner predict before you reveal; frequently pause to ask 'what would happen if…'.",
}
DEPTH_GUIDANCE = {
    "concise": "Aim for ~1200–1800 words of lecture across 3–4 sections.",
    "standard": "Aim for ~2000–2800 words of lecture across 4–5 sections.",
    "deep": "Aim for ~3000–4500 words of lecture across 5–7 sections. Do not skimp: this learner explicitly wants a LOT of information.",
}
RIGOR_GUIDANCE = {
    "intuitive": "Prefer intuition, pictures and plain language; keep formal derivations short and optional.",
    "balanced": "Pair every formal result with an intuitive explanation; derive the key results fully.",
    "rigorous": "Full derivations and proofs where they exist; state assumptions precisely; distinguish definitions, theorems, and heuristics.",
}
EXAMPLES_GUIDANCE = {
    "mixed": "Mix real-world, historical and computational examples.",
    "real_world": "Favor concrete real-world and engineering examples.",
    "code": "Favor computational examples with short Python snippets.",
    "historical": "Favor the historical development: who discovered what, why, and what they got wrong first.",
}

LESSON_SCHEMA = r'''
{
  "title": "string — the lesson title (may lightly polish the given title)",
  "subtitle": "string — one engaging line",
  "estimated_minutes": 45,
  "difficulty": 3,
  "objectives": ["By the end of this lesson you can …", "…"],
  "prerequisite_recap": "markdown — 60–120 words recapping exactly what is assumed, with a pointer to where it was taught",
  "hook": "markdown — 150–300 words: a vivid story, puzzle, paradox or real stakes that makes the learner NEED this lesson",
  "sections": [
    {
      "heading": "string",
      "body": "markdown — the lecture itself for this section. Use $inline$ and $$display$$ LaTeX for ALL math, fenced ```python blocks where code helps, tables for comparisons, bold for key terms on first use.",
      "checkpoint": {
        "type": "mcq | numeric | short",
        "question": "markdown",
        "choices": ["only for mcq: 3–5 options, plausible distractors"],
        "answer": "mcq: integer index of correct choice | numeric: number | short: model answer string",
        "tolerance": "numeric only: absolute tolerance (number)",
        "unit": "numeric only: unit string or empty",
        "explanation": "markdown — why the answer is right AND why each distractor is tempting"
      }
    }
  ],
  "worked_examples": [{"title": "string", "problem": "markdown", "solution": "markdown — fully worked, step by step, with reasoning at each step"}],
  "misconceptions": [{"myth": "string", "reality": "markdown"}],
  "interactive": {
    "sim": "one of the available simulation ids, or null",
    "params": {"param_key": "value — only keys that exist for that sim"},
    "intro": "markdown — what to look at and why it matters for THIS lesson (80–150 words)",
    "tasks": ["3–5 guided explorations phrased as experiments: 'Set X to …, predict …, then observe …'"]
  },
  "lab": {
    "title": "string",
    "intro": "markdown — what the learner will build/compute and why",
    "starter_code": "python — runnable in-browser (numpy available; sympy and matplotlib allowed; no file or network IO). Include TODO markers for the learner. Print results.",
    "tasks": ["3–5 concrete tasks that extend the starter code"],
    "solution_code": "python — a complete reference solution",
    "tests": "python — 3–6 plain `assert` statements (each with a message) executed AFTER the learner's code in the same namespace to verify the tasks; must pass against solution_code and fail against the untouched starter_code; no input/files/network"
  },
  "homework": [
    {
      "id": "hw1",
      "type": "mcq | numeric | short | code | proof",
      "difficulty": "core | stretch | challenge",
      "points": 10,
      "question": "markdown",
      "choices": ["mcq only"],
      "answer": "mcq: integer index | numeric: number | short/code/proof: model answer (markdown)",
      "tolerance": "numeric only (number)",
      "unit": "numeric only",
      "rubric": "short/code/proof only: what a full-credit answer must contain",
      "hint": "markdown — a nudge that does not give the answer",
      "starter_code": "code only: python skeleton (function signature + TODO)",
      "tests": "code only: python `assert` statements that call the learner's function(s); run in Pyodide after the learner's code"
    }
  ],
  "summary": "markdown — bullet recap of the big ideas and formulas",
  "glossary": [{"term": "string", "definition": "string"}],
  "connections": ["How this connects to other courses, domains or future lessons — 3–5 bullets"],
  "further_reading": [{"title": "book / paper / lecture series", "why": "one line"}],
  "fun_fact": "string"
}
'''


def learner_profile(settings: dict, learner_stats: dict | None = None) -> str:
    prefs = settings.get("preferences", {})
    lines = [
        f"Learner name: {settings.get('learner_name') or 'Scholar'}.",
        f"Tone: {TONE_GUIDANCE.get(prefs.get('tone', 'playful'), TONE_GUIDANCE['playful'])}",
        f"Depth: {DEPTH_GUIDANCE.get(prefs.get('depth', 'deep'), DEPTH_GUIDANCE['deep'])}",
        f"Rigor: {RIGOR_GUIDANCE.get(prefs.get('rigor', 'balanced'), RIGOR_GUIDANCE['balanced'])}",
        f"Examples: {EXAMPLES_GUIDANCE.get(prefs.get('examples', 'mixed'), EXAMPLES_GUIDANCE['mixed'])}",
        f"Humor: {prefs.get('humor', 'some')}.",
    ]
    if learner_stats:
        lines.append(f"Learner standing: {learner_stats.get('level_title', 'Freshman')} with {learner_stats.get('total_xp', 0)} XP, "
                     f"{learner_stats.get('lessons_completed', 0)} lessons completed.")
    notes = (settings.get("professor_notes") or "").strip()
    if notes:
        lines.append("STANDING INSTRUCTIONS FROM THE LEARNER (always honor these):\n" + notes)
    return "\n".join(lines)


def system_professor(settings: dict) -> str:
    return (
        f"You are {PROFESSOR_NAME}, a legendary university professor who has taught every subject from first-year "
        "seminars to doctoral research groups. You are rigorous, correct, deeply knowledgeable, and genuinely fun. "
        "You teach the way the best human lecturers do: motivate → build intuition → formalize → practice → connect. "
        "You speak and write like a warm, articulate human being standing at a lectern speaking directly to a student — "
        "never like a robotic outline or a stiff LLM. Your sentences flow naturally when read aloud, using conversational "
        "transitions, clear spoken explanations of equations right alongside the formal LaTeX math, and zero awkward "
        "ASCII punctuation clutter in prose. You never hand-wave; when something is subtle you say so and explain why.\n\n"
        + learner_profile(settings)
    )


def sims_description(sims: list[dict], suggested: str | None, domain_id: str) -> str:
    """Compact catalog of sims the model may choose from, with full param schemas for the suggested one."""
    if not sims:
        return "No interactive simulations are available; set interactive to null."
    lines = []
    relevant = [s for s in sims if domain_id in (s.get("domains") or [])] or sims
    others = [s for s in sims if s not in relevant]
    for s in relevant + others[:12]:
        keys = ", ".join(f"{p['key']}({p.get('type','range')}{'' if p.get('type') in ('select','toggle','text') else f' {p.get('min')}–{p.get('max')}'})" for p in s.get("params", []))
        mark = "  <-- SUGGESTED for this module" if s["id"] == suggested else ""
        lines.append(f"- {s['id']}: {s.get('description','')} Params: {keys}{mark}")
    return "\n".join(lines)


def lesson_prompt(ctx: dict, settings: dict, sims: list[dict], feedback: list[dict], learner_stats: dict | None,
                  prior: dict | None = None, extra_instruction: str = "") -> str:
    course, module, lesson = ctx["course"], ctx["module"], ctx["lesson"]
    level = int(course["level"])
    fb_text = ""
    useful = [f for f in feedback if (f.get("comment") or "").strip() or (f.get("rating") is not None and f["rating"] <= 2)]
    if useful:
        fb_lines = []
        for f in useful[-6:]:
            fb_lines.append(f"- rating={f.get('rating')} tags={','.join(f.get('tags') or [])}: {f.get('comment','')}")
        fb_text = "\nLEARNER FEEDBACK ON PREVIOUS VERSIONS OF THIS LESSON (fix these!):\n" + "\n".join(fb_lines)
    prior_text = ""
    if prior:
        heads = [s.get("heading", "") for s in prior.get("sections", [])]
        prior_text = f"\nThe previous version had sections: {heads}. Produce a clearly improved lesson, not a near-duplicate."
    prefs = settings.get("preferences", {})
    depth = prefs.get("depth", "deep")
    n_hw = {"concise": "6–7", "standard": "7–9", "deep": "8–12"}.get(depth, "8–10")
    lecturer_line = ""
    ins = ctx.get("instructor")
    if ins and ins.get("name"):
        lecturer_line = (f"\n- Lecturer: {ins['name']} ({ins.get('title') or 'Faculty'}; specialty: {ins.get('specialty') or 'general'}) — "
                         "deliver the lecture in this professor's first-person voice and draw on their specialty for examples.")
    return f"""Create a complete, interactive university lesson as a single JSON object following the schema below.

CONTEXT
- Domain: {ctx['domain']['name']} ({ctx['domain']['tagline']})
- Subject: {ctx['subject']['name']} — {ctx['subject']['description']}
- Course: {course['code']} {course['title']} (level {level}, {course['level_name']}; {course['credits']} credits). {course['description']}
- Module: {module['title']} — {module['summary']}
- Module lesson sequence: {json.dumps(module['lessons'])}{lecturer_line}
- THIS LESSON: "{lesson['title']}" (lesson {lesson['index'] + 1} of {len(module['lessons'])} in the module; lesson {ctx['position']['index_in_course'] + 1} of {ctx['position']['course_total']} in the course)
- Previous lesson: {ctx.get('prev_title') or '(first in module)'}; Next lesson: {ctx.get('next_title') or '(last in module)'}
- Suggested simulation for this module: {module.get('sim') or 'none'}; Python lab suggested: {bool(module.get('lab'))}

LEVEL GUIDANCE: {LEVEL_GUIDANCE.get(level, LEVEL_GUIDANCE[300])}

AVAILABLE SIMULATIONS (choose the single best fit for THIS lesson, or null if none genuinely fits):
{sims_description(sims, module.get('sim'), ctx['domain']['id'])}

REQUIREMENTS
1. Teach THIS lesson's topic specifically and thoroughly — not the whole module. Stay within scope but go deep.
2. Every section gets a checkpoint question that tests understanding (not recall). Mix mcq / numeric / short.
3. Homework: {n_hw} problems, ordered core → stretch → challenge, covering every objective. For numeric answers give exact numbers and a sensible tolerance. For short/code/proof give a rubric.
4. Include the lab if a Python exercise genuinely deepens understanding (always for computational topics). Starter code must run as-is in Pyodide (numpy ok; no input(), no files, no network, no pip).
5. If you choose a simulation, set params only to keys that exist, and write tasks that are experiments with predictions.
6. All mathematics in LaTeX ($…$ / $$…$$). Escape backslashes correctly inside JSON strings (e.g. "\\\\frac"). Always introduce and explain equations in natural spoken English so a listener hearing the lecture read aloud can follow the intuition effortlessly.
7. Worked examples must be fully worked. Misconceptions must be real ones students actually have.
7b. ANSWER KEYS MUST BE CORRECT: solve every checkpoint and homework problem yourself BEFORE writing its choices; the correct value must appear among the mcq choices and "answer" must be the 0-based index of that exact choice. Explanations are final, student-facing text — never think aloud, self-correct, or mention "the choices array", "option indices" or adjusting options.
8. SPOKEN HUMAN LECTURER VOICE: Because your lectures are read aloud to the learner by a neural voice, write section prose in natural, flowing, conversational human paragraphs (like a great professor speaking at a blackboard). Spell out words like "for example", "that is", "versus", and "leads to" instead of cryptic ASCII shorthand (`e.g.`, `i.e.`, `w.r.t.`, `->`, `/`), and never use raw `*` for multiplication in prose.
9. Length/style per learner profile in the system prompt. Keep it engaging, concrete and precise. No filler.
{"10. LANGUAGE LEARNING SPECIAL RULES: Because this is a World Languages lesson, ALWAYS write every target-language word, sentence, and dialogue with: (a) native script (Hanzi / German / Italian / French / fully vocalized Arabic with harakat), (b) phonetic/romanization guide in brackets (Pinyin with tone marks, IPA, or Arabic transliteration), (c) literal word-by-word gloss, and (d) natural English translation. Include markdown tables of key vocabulary/phrases and realistic spoken dialogues so the learner can click any phrase to hear the Professor pronounce it aloud!" if ctx['domain']['id'] == 'languages' else ""}
{fb_text}{prior_text}
{extra_instruction}

OUTPUT: ONLY the JSON object (no prose, no code fences) matching this schema:
{LESSON_SCHEMA}
"""


def normalise_lesson(obj: Any, ctx: dict) -> dict:
    """Coerce whatever the model returned into the shape the UI expects."""
    if isinstance(obj, list):
        obj = next((x for x in obj if isinstance(x, dict)), {})
    if not isinstance(obj, dict):
        obj = {}
    out: dict[str, Any] = {}
    out["title"] = str(obj.get("title") or ctx["lesson"]["title"])
    out["subtitle"] = str(obj.get("subtitle") or "")
    out["estimated_minutes"] = _int(obj.get("estimated_minutes"), 40, 5, 240)
    out["difficulty"] = _int(obj.get("difficulty"), max(1, min(5, ctx["course"]["level"] // 100)), 1, 5)
    out["objectives"] = _str_list(obj.get("objectives"))
    out["prerequisite_recap"] = str(obj.get("prerequisite_recap") or "")
    out["hook"] = str(obj.get("hook") or "")
    sections = []
    for i, s in enumerate(obj.get("sections") or []):
        if not isinstance(s, dict):
            continue
        sec = {"id": f"s{i}", "heading": str(s.get("heading") or f"Section {i + 1}"), "body": str(s.get("body") or "")}
        cp = s.get("checkpoint")
        if isinstance(cp, dict) and cp.get("question"):
            sec["checkpoint"] = _norm_question(cp, f"cp{i}")
        sections.append(sec)
    out["sections"] = sections
    out["worked_examples"] = [{"title": str(w.get("title") or f"Example {i + 1}"), "problem": str(w.get("problem") or ""), "solution": str(w.get("solution") or "")}
                              for i, w in enumerate(obj.get("worked_examples") or []) if isinstance(w, dict)]
    out["misconceptions"] = [{"myth": str(m.get("myth") or ""), "reality": str(m.get("reality") or "")}
                             for m in (obj.get("misconceptions") or []) if isinstance(m, dict)]
    inter = obj.get("interactive")
    if isinstance(inter, dict) and inter.get("sim"):
        out["interactive"] = {"sim": str(inter.get("sim")), "params": inter.get("params") if isinstance(inter.get("params"), dict) else {},
                              "intro": str(inter.get("intro") or ""), "tasks": _str_list(inter.get("tasks"))}
    else:
        out["interactive"] = None
    lab = obj.get("lab")
    if isinstance(lab, dict) and (lab.get("starter_code") or lab.get("tasks")):
        out["lab"] = {"title": str(lab.get("title") or "Lab"), "intro": str(lab.get("intro") or ""),
                      "starter_code": str(lab.get("starter_code") or "# Write your code here\n"), "tasks": _str_list(lab.get("tasks")),
                      "solution_code": str(lab.get("solution_code") or ""), "tests": str(lab.get("tests") or "")}
    else:
        out["lab"] = None
    hw = []
    for i, q in enumerate(obj.get("homework") or []):
        if isinstance(q, dict) and q.get("question"):
            nq = _norm_question(q, f"hw{i + 1}")
            nq["difficulty"] = q.get("difficulty") if q.get("difficulty") in ("core", "stretch", "challenge") else "core"
            nq["points"] = _int(q.get("points"), 10, 1, 100)
            nq["hint"] = str(q.get("hint") or "")
            hw.append(nq)
    out["homework"] = hw
    out["summary"] = str(obj.get("summary") or "")
    out["glossary"] = [{"term": str(g.get("term") or ""), "definition": str(g.get("definition") or "")}
                       for g in (obj.get("glossary") or []) if isinstance(g, dict) and g.get("term")]
    out["connections"] = _str_list(obj.get("connections"))
    fr = []
    for r in obj.get("further_reading") or []:
        if isinstance(r, dict):
            fr.append({"title": str(r.get("title") or ""), "why": str(r.get("why") or "")})
        elif isinstance(r, str):
            fr.append({"title": r, "why": ""})
    out["further_reading"] = fr
    out["fun_fact"] = str(obj.get("fun_fact") or "")
    return out


def _norm_question(q: dict, qid: str) -> dict:
    t = str(q.get("type") or "short").lower()
    if t not in ("mcq", "numeric", "short", "code", "proof"):
        t = "short"
    out: dict[str, Any] = {"id": str(q.get("id") or qid), "type": t, "question": str(q.get("question") or ""),
                           "explanation": str(q.get("explanation") or ""), "rubric": str(q.get("rubric") or "")}
    if t == "mcq":
        choices = _str_list(q.get("choices"))
        if len(choices) < 2:
            out["type"] = "short"
            out["answer"] = str(q.get("answer") or "")
            return out
        out["choices"] = choices
        ans = q.get("answer")
        if isinstance(ans, str):
            # could be the text of the choice or a letter
            if ans.strip().upper() in "ABCDEFGH" and len(ans.strip()) == 1:
                ans = "ABCDEFGH".index(ans.strip().upper())
            elif ans in choices:
                ans = choices.index(ans)
            else:
                try:
                    ans = int(ans)
                except ValueError:
                    ans = 0
        out["answer"] = max(0, min(len(choices) - 1, _int(ans, 0, 0, len(choices) - 1)))
    elif t == "numeric":
        try:
            out["answer"] = float(q.get("answer"))
        except (TypeError, ValueError):
            out["type"] = "short"
            out["answer"] = str(q.get("answer") or "")
            return out
        try:
            tol = float(q.get("tolerance")) if q.get("tolerance") is not None else abs(out["answer"]) * 0.02
        except (TypeError, ValueError):
            tol = abs(out["answer"]) * 0.02
        out["tolerance"] = max(tol, 1e-9)
        out["unit"] = str(q.get("unit") or "")
    else:
        out["answer"] = str(q.get("answer") or q.get("sample_answer") or "")
        if t == "code":
            out["starter_code"] = str(q.get("starter_code") or "")
            out["tests"] = str(q.get("tests") or "")
    return out


def _int(v: Any, default: int, lo: int, hi: int) -> int:
    try:
        return max(lo, min(hi, int(float(v))))
    except (TypeError, ValueError):
        return default


def _str_list(v: Any) -> list[str]:
    if isinstance(v, list):
        return [str(x) for x in v if str(x).strip()]
    if isinstance(v, str) and v.strip():
        return [v.strip()]
    return []


# ---------------------------------------------------------------- grading
def grading_prompt(lesson: dict, items: list[dict], answers: dict[str, Any], exec_results: dict | None = None) -> str:
    qs = []
    for q in items:
        item = {"id": q["id"], "type": q["type"], "question": q["question"], "model_answer": q.get("answer"),
                "rubric": q.get("rubric", ""), "points": q.get("points", 10), "learner_answer": answers.get(q["id"], "")}
        if exec_results and q["id"] in exec_results:
            item["execution_result"] = exec_results[q["id"]]
        qs.append(item)
    return f"""You are grading homework for the lesson "{lesson.get('title')}". Objectives: {json.dumps(lesson.get('objectives', []))}.
Grade each learner answer against the model answer and rubric. Be fair and encouraging but honest: partial credit for partially correct reasoning; zero for blank or off-topic answers. For code, judge correctness of logic; when an "execution_result" is present it is the REAL outcome of running the learner's code against unit tests in Python — weight it heavily (all tests passing is strong evidence of correctness; failures/exceptions must cost credit). For proofs, check logical validity and completeness.

ITEMS:
{json.dumps(qs, ensure_ascii=False, indent=1)}

Return ONLY JSON: {{"grades": [{{"id": "hw3", "score": 0.0-1.0, "feedback": "markdown — specific, 2–5 sentences, what was right, what was missing, how to improve", "model_answer_summary": "one-paragraph exemplary answer"}}]}}"""


# ---------------------------------------------------------------- tutor chat
def tutor_system(ctx: dict, lesson: dict | None, settings: dict, progress: dict | None) -> str:
    base = system_professor(settings)
    course = ctx["course"]
    content_summary = ""
    if lesson:
        heads = "\n".join(f"  {i + 1}. {s['heading']}" for i, s in enumerate(lesson.get("sections", [])))
        lecture = "\n\n".join(f"## {s['heading']}\n{s['body']}" for s in lesson.get("sections", []))
        if len(lecture) > 24000:
            lecture = lecture[:24000] + "\n…(truncated)"
        content_summary = f"""
LESSON CONTENT YOU WROTE (the learner is reading this right now):
Title: {lesson.get('title')}
Objectives: {json.dumps(lesson.get('objectives', []))}
Sections:
{heads}
Summary: {lesson.get('summary', '')}

FULL LECTURE TEXT:
{lecture}
"""
    prog = ""
    if progress:
        cps = progress.get("checkpoints") or {}
        wrong = [k for k, v in cps.items() if isinstance(v, dict) and not v.get("correct")]
        if wrong:
            prog = f"\nThe learner answered these checkpoints incorrectly: {wrong}. Gently probe those ideas when relevant."
    return base + f"""

You are now holding OFFICE HOURS for: {ctx['domain']['name']} › {ctx['subject']['name']} › {course['code']} {course['title']} (level {course['level']}) › module "{ctx['module']['title']}" › lesson "{ctx['lesson']['title']}".
{content_summary}{prog}
HOW TO TUTOR
- Default to Socratic guidance for problem-solving: ask what they have tried, give the smallest useful hint, then escalate. But when the learner asks a direct conceptual question, answer it directly and well.
- Reference the lesson's own sections/examples ("remember the worked example on …").
- Use LaTeX for math. Keep answers focused (usually under 250 words) unless a derivation is requested.
- If the learner is wrong, say so kindly and precisely. If YOU were wrong in the lesson, own it and correct it.
- You can suggest experiments in the lesson's simulation or lab when relevant.
- Occasionally (not every message) offer a quick challenge question to check understanding.
"""


# ---------------------------------------------------------------- syllabus / domain designer
DESIGN_SCHEMA = r'''
{
  "id": "slug", "name": "Domain name", "icon": "single emoji", "color": "#rrggbb", "tagline": "one line", "description": "2–3 sentences",
  "subjects": [
    {"id": "slug", "name": "Subject", "icon": "emoji", "description": "1–2 sentences",
     "courses": [
       {"id": "slug_unique", "code": "ABC 101", "title": "Course title", "level": 100, "credits": 3, "description": "2 sentences", "prerequisites": [],
        "modules": [
          {"id": "slug", "title": "Module title", "summary": "1–2 sentences", "sim": "sim id or null", "lab": true,
           "lessons": ["Specific lesson title 1", "Specific lesson title 2", "…"]}
        ]}
     ]}
  ]
}
'''


def design_prompt(topic: str, goal: str, size: str, sims: list[dict], existing_domain: dict | None = None) -> str:
    sizes = {
        "small": "2 subjects × 2–3 courses × 4–5 modules × 3–4 lessons (≈ 60–100 lessons)",
        "medium": "3 subjects × 3 courses × 5–6 modules × 3–5 lessons (≈ 150–250 lessons)",
        "large": "4–5 subjects × 3–4 courses × 5–7 modules × 4–5 lessons (≈ 350–500 lessons)",
    }
    sim_ids = ", ".join(s["id"] + " (" + (s.get("description") or "")[:60] + ")" for s in sims)
    existing = ""
    if existing_domain:
        subj = [s["name"] for s in existing_domain.get("subjects", [])]
        existing = (f"\nThis is an ADDITION to the existing domain '{existing_domain['name']}' (id {existing_domain['id']}), which already has subjects: {subj}. "
                    "Design NEW subject(s) that complement them; reuse the domain id, name, icon and color exactly.")
    return f"""Design a complete university curriculum (Freshman → Master's arc) for a learner who wants to study:
TOPIC: {topic}
LEARNER'S GOAL: {goal or 'deep mastery'}
SIZE: {sizes.get(size, sizes['medium'])}{existing}

Rules:
- Levels climb 100 → 200 → 300 → 400 → 500/600 across each subject's courses; later courses list earlier ones as prerequisites (by id).
- Lesson titles must be specific and self-contained (what exactly will be taught), pedagogically ordered, no duplicates.
- Course ids must be unique slugs prefixed with the domain id. All ids are [a-z0-9_].
- Set "sim" ONLY to one of these available simulation ids when it genuinely fits, else null: {sim_ids}
- Set "lab": true for modules where writing Python would deepen understanding.
- Make it rigorous and real — this will actually be taught lesson by lesson by an AI professor.

Return ONLY the JSON object with this schema:
{DESIGN_SCHEMA}
"""


# ---------------------------------------------------------------- offline fallback
def offline_lesson(ctx: dict, reason: str) -> dict:
    """A structured self-study guide generated without the LLM so the app always works."""
    lesson, module, course = ctx["lesson"], ctx["module"], ctx["course"]
    title = lesson["title"]
    sections = [
        {"id": "s0", "heading": "Orientation", "body": (
            f"This lesson sits in **{course['code']} {course['title']}** ({course['level_name']}), module **{module['title']}**.\n\n"
            f"Module summary: {module['summary']}\n\n"
            f"The AI professor could not be reached right now ({reason}). Below is a self-study scaffold so you can keep momentum; "
            f"press **Regenerate with AI** at any time to get the full interactive lecture."),
         "checkpoint": {"id": "cp0", "type": "short", "question": f"In one or two sentences, what do you *expect* \"{title}\" to be about, and how might it connect to \"{ctx.get('prev_title') or module['title']}\"?",
                        "answer": "Any thoughtful prediction that references the module context.", "explanation": "Predicting before learning primes memory (the 'generation effect').", "rubric": "Reasonable prediction connected to the module."}},
        {"id": "s1", "heading": "Study plan", "body": (
            "1. **Define** the core terms in the title in your own words.\n"
            "2. **Find** one canonical source (textbook chapter, lecture notes) and read actively: write down every claim you cannot yet justify.\n"
            "3. **Derive or reproduce** the central result or procedure by hand.\n"
            "4. **Apply** it to a fresh example of your own invention.\n"
            "5. **Teach it back** in the Professor chat once the AI is available — explaining is the best test of understanding.")},
        {"id": "s2", "heading": "Where this leads", "body": (
            f"Next lesson: **{ctx.get('next_title') or 'end of module'}**. The remaining lessons in this module are: "
            + "; ".join(module["lessons"]))},
    ]
    interactive = {"sim": module.get("sim"), "params": {}, "intro": "Explore the simulation linked to this module and write down two things that surprised you.",
                   "tasks": ["Change one parameter at a time and predict the effect before you move the slider.",
                             "Find a setting that breaks your intuition and explain why."]} if module.get("sim") else None
    lab = {"title": "Open lab", "intro": "Use Python to explore the idea numerically.", "starter_code": "import numpy as np\n\n# TODO: model the key quantity from this lesson numerically\nx = np.linspace(0, 10, 11)\nprint(x)\n", "tasks": ["Model the central quantity of the lesson numerically.", "Plot or print how it changes with one parameter."], "solution_code": ""} if module.get("lab") else None
    return {
        "title": title, "subtitle": "Self-study scaffold (AI professor offline)", "estimated_minutes": 30, "difficulty": max(1, min(5, course["level"] // 100)),
        "objectives": [f"Explain the key ideas behind: {title}", "Reproduce the central result or procedure", "Apply it to a new example"],
        "prerequisite_recap": f"Assumes the previous lesson: {ctx.get('prev_title') or 'none (first lesson of the module)'}.",
        "hook": f"Why does **{title}** matter? Every topic in {ctx['domain']['name']} earns its place by solving a problem the previous ideas could not. Your first task is to find that problem.",
        "sections": sections, "worked_examples": [], "misconceptions": [], "interactive": interactive, "lab": lab,
        "homework": [
            {"id": "hw1", "type": "short", "difficulty": "core", "points": 10, "question": f"Write a 150-word explanation of \"{title}\" for a classmate who missed class.", "answer": "", "rubric": "Accurate, clear, mentions the central idea and one example.", "hint": "Start with the problem it solves.", "explanation": ""},
            {"id": "hw2", "type": "short", "difficulty": "stretch", "points": 10, "question": "Pose and solve one original problem that uses the main idea of this lesson.", "answer": "", "rubric": "Well-posed problem and a correct solution.", "hint": "Change the numbers or context of a textbook example.", "explanation": ""},
        ],
        "summary": "- Scaffold lesson generated offline.\n- Regenerate with AI for the full lecture, checkpoints, lab and homework.",
        "glossary": [], "connections": [], "further_reading": [], "fun_fact": "", "offline": True,
    }


# ---------------------------------------------------------------- Advanced Feature Prompts

def viva_voce_prompt(ctx: dict, lesson: dict | None) -> str:
    title = (lesson or {}).get("title") or ctx["lesson"]["title"]
    objs = (lesson or {}).get("objectives") or []
    return f"""You are conducting a rigorous but encouraging Oxford-style VIVA VOCE (Oral Examination) for:
Course: {ctx['course']['code']} {ctx['course']['title']} (Level {ctx['course']['level']})
Lesson: "{title}"
Objectives: {json.dumps(objs)}

Pose 3 progressively deeper oral examination questions (1. Conceptual Intuition, 2. Formal Mechanism / Derivation, 3. Edge Case or Real-World Application) that the student can answer aloud or in writing.
Return ONLY JSON:
{{
  "opening_statement": "1-2 spoken sentences welcoming the scholar to the Viva Voce for this lesson",
  "questions": [
    {{"id": "v1", "stage": "Intuition & Core Principle", "question": "spoken question 1", "key_points": ["point 1", "point 2"]}},
    {{"id": "v2", "stage": "Formal Mechanism & Proof", "question": "spoken question 2", "key_points": ["point 1", "point 2"]}},
    {{"id": "v3", "stage": "Edge Case & Synthesis", "question": "spoken question 3", "key_points": ["point 1", "point 2"]}}
  ]
}}"""


def _history_text(history: list[dict] | None) -> str:
    if not history:
        return ""
    lines = []
    for h in history[-10:]:
        who = "EXAMINER" if h.get("role") in ("examiner", "student_ai", "alex") else "SCHOLAR"
        lines.append(f"{who}: {str(h.get('text') or '')[:1500]}")
    return "\nPRIOR EXCHANGE ON THIS QUESTION (oldest first):\n" + "\n".join(lines) + "\n"


def viva_voce_eval_prompt(ctx: dict, question: str, key_points: list[str], transcript: str,
                          history: list[dict] | None = None, round_no: int = 1, max_rounds: int = 3) -> str:
    return f"""Evaluate the student's spoken Viva Voce defense for "{ctx['lesson']['title']}".
Question asked: {question}
Expected key points: {json.dumps(key_points)}
{_history_text(history)}
Student's latest spoken response (round {round_no} of at most {max_rounds}): "{transcript}"

Judge the defense cumulatively across all rounds. If an important key point is still missing or a claim is subtly wrong
AND round {round_no} < {max_rounds}, push back like a real Oxford examiner with ONE crisp Socratic follow-up question that
targets the exact gap (e.g. "Wait - what happens as v approaches c?"). Otherwise set follow_up to null and resolved to true.
Return ONLY JSON:
{{
  "score": 0.85,
  "verdict": "Pass with Distinction | Pass | Needs Refinement",
  "spoken_feedback": "3-5 spoken sentences directly addressing the student: praise what they nailed and name any subtle gap",
  "strengths": ["bullet 1", "bullet 2"],
  "gaps": ["bullet 1"],
  "resolved": false,
  "follow_up": "one spoken follow-up question, or null when the defense is complete"
}}"""


def feynman_start_prompt(ctx: dict, lesson: dict | None) -> str:
    title = (lesson or {}).get("title") or ctx["lesson"]["title"]
    summary = (lesson or {}).get("summary") or ctx["module"]["summary"]
    return f"""Act as "Alex", an eager, curious, but slightly confused undergraduate student trying to understand "{title}" in {ctx['course']['code']} {ctx['course']['title']}.
Context: {summary}

State a plausible, realistic misconception about "{title}" in 2-4 sentences and ask the user (who is acting as your tutor) to explain why your intuition is wrong and how the concept actually works.
Return ONLY JSON:
{{
  "student_name": "Alex (Confused Undergrad)",
  "misconception_statement": "Hey! I was reading the notes on {title}, and I'm confused... [state specific plausible misconception and ask the user to explain it simply]",
  "hidden_flaw": "1 sentence describing the exact flaw the user should catch and correct",
  "target_concepts": ["concept 1", "concept 2", "concept 3"]
}}"""


def feynman_eval_prompt(ctx: dict, misconception: str, hidden_flaw: str, explanation: str,
                        history: list[dict] | None = None, round_no: int = 1, max_rounds: int = 3) -> str:
    return f"""Evaluate how well the user taught the concept of "{ctx['lesson']['title']}" to Alex (the confused undergraduate) using the Feynman Technique.
Alex's original misconception: {misconception}
Hidden flaw to catch: {hidden_flaw}
{_history_text(history)}
User's latest explanation (round {round_no} of at most {max_rounds}): {explanation}

Grade cumulatively on: (1) Did they catch the misconception? (2) Was the explanation clear and free of undefined jargon? (3) Did they use a concrete analogy or example?
If Alex would still be confused about something specific AND round {round_no} < {max_rounds}, Alex pushes back in character with ONE
genuine follow-up question ("Okay, but then why does...?"). Otherwise resolved=true and follow_up_question=null.
Return ONLY JSON:
{{
  "score": 0.9,
  "clarity_score": 90,
  "accuracy_score": 92,
  "intuition_score": 88,
  "student_reply": "Alex's response in character: either 'Aha! That finally clicked because...' or naming the remaining fuzzy spot",
  "professor_critique": "2-3 sentences of pedagogical feedback from Professor Sage on the quality of their teaching",
  "resolved": false,
  "follow_up_question": "Alex's one follow-up question, or null"
}}"""


def podcast_prompt(ctx: dict, lesson: dict | None) -> str:
    title = (lesson or {}).get("title") or ctx["lesson"]["title"]
    body = "\n".join(s.get("body", "")[:800] for s in ((lesson or {}).get("sections") or [])[:4])
    return f"""Write a lively, intellectually rich 8-turn academic commute podcast dialogue about "{title}" ({ctx['course']['code']} {ctx['course']['title']}) between two university professors:
- Host A: Dr. Claire Evans (female, warm theoretical synthesis, loves deep principles and vivid analogies)
- Host B: Prof. Arthur Pendleton (male, crisp Oxford baritone, loves concrete examples, historical context, and sharp counter-questions)

Lesson material:
{body[:2800]}

Rules:
- Plain spoken English (no raw LaTeX backslashes; write "alpha squared" instead of "\\alpha^2").
- 8 turns alternating between Claire and Arthur, each turn 2-4 sentences.
Return ONLY JSON:
{{
  "title": "Deep Dive Podcast: {title}",
  "turns": [
    {{"speaker": "Dr. Claire Evans", "persona": "claire_evans", "text": "..."}},
    {{"speaker": "Prof. Arthur Pendleton", "persona": "arthur_pendleton", "text": "..."}}
  ]
}}"""


def ingest_document_prompt(title: str, raw_text: str, domain_id: str | None, sims: list[dict]) -> str:
    sim_ids = ", ".join(s["id"] for s in sims[:60])
    return f"""You are the University Curriculum Ingest Engine. A scholar has provided a technical paper, syllabus, notes, or repository specification titled "{title}".
Decompose this source material into a complete, rigorous university subject & course structure that can be taught interactively inside Self-Taught!

SOURCE MATERIAL (excerpt):
{raw_text[:12000]}

Available Simulation IDs (pick best fits): {sim_ids}

Return ONLY a JSON object matching the domain schema (with 1-2 subjects, 2-3 courses climbing 200->400->500, 4 modules per course, 4 specific lessons per module):
{DESIGN_SCHEMA}"""


def exam_generate_prompt(scope_title: str, lesson_titles: list[str], level: int, test_out: bool = False, comprehensive: bool = False) -> str:
    if comprehensive:
        mix = """This is a DEGREE COMPREHENSIVE / QUALIFYING EXAMINATION covering an entire degree program. It must sample
broadly across the listed courses and modules, emphasise integration ACROSS courses, and be genuinely hard to pass without
degree-level mastery. Create 12 problems:
- 4 conceptual multiple-choice questions (`type: "mcq"`, 4 choices, integer `answer` 0-3, plausible distractors)
- 4 quantitative calculation questions (`type: "numeric"`, numeric `answer`, `tolerance`, `unit`)
- 4 cross-course synthesis / derivation / proof / design questions (`type: "short"`, detailed `answer` and `rubric`)
Set duration_minutes to 60."""
        topics = lesson_titles[:80]
    elif test_out:
        mix = """This is a COMPREHENSIVE CREDIT-BY-EXAMINATION ("test out") final. Passing (>= 85%) awards full course credit without
taking the lessons, so it must sample EVERY module and be genuinely hard to pass without mastery. Create 12 problems:
- 4 conceptual multiple-choice questions (`type: "mcq"`, 4 choices, integer `answer` 0-3, plausible distractors)
- 4 quantitative calculation questions (`type: "numeric"`, numeric `answer`, `tolerance`, `unit`)
- 4 synthesis / derivation / proof / code questions (`type: "short"`, detailed `answer` and `rubric`)
Set duration_minutes to 45."""
        topics = lesson_titles[:80]
    else:
        mix = """Create 6 examination problems mixing:
- 2 conceptual multiple-choice questions (`type: "mcq"`, 4 choices, integer `answer` 0-3)
- 2 quantitative calculation questions (`type: "numeric"`, numeric `answer`, `tolerance`, `unit`)
- 2 synthesis / derivation / proof / code questions (`type: "short"`, detailed `answer` and `rubric`)"""
        topics = lesson_titles[:30]
    return f"""Generate a rigorous, closed-notes University Examination for "{scope_title}" (Level {level}) synthesizing these topics:
{json.dumps(topics)}

{mix}

Return ONLY JSON:
{{
  "title": "{scope_title} — Official Examination",
  "duration_minutes": 25,
  "questions": [
    {{
      "id": "ex1",
      "type": "mcq | numeric | short",
      "points": 15,
      "question": "markdown with $LaTeX$",
      "choices": ["only for mcq"],
      "answer": 0,
      "tolerance": 0.05,
      "unit": "",
      "rubric": "what earns full marks",
      "explanation": "full worked solution"
    }}
  ]
}}"""


def autopsy_drill_prompt(mistake: dict) -> str:
    return f"""A scholar missed the following question in {mistake.get('course_id') or 'their course'}:
Original Question: {mistake.get('question')}
Learner's Flawed Answer: {mistake.get('learner_answer')}
Correct Answer: {mistake.get('correct_answer')}
Error Category: {mistake.get('category')}

First, write a 2-3 sentence "Root Cause Autopsy" explaining the exact cognitive or mathematical trap that caused this mistake.
Second, generate 3 targeted micro-drill questions (`mcq` or `numeric`) that specifically inoculate the learner against this exact error pattern.

Return ONLY JSON:
{{
  "autopsy": "markdown root-cause diagnosis",
  "drills": [
    {{
      "id": "d1",
      "type": "mcq",
      "question": "markdown question",
      "choices": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "why this is right"
    }}
  ]
}}"""


def capstone_grade_prompt(capstone: dict, submission: str, code: str) -> str:
    return f"""You are the Interdisciplinary Faculty Committee evaluating a Cross-Domain Capstone Project:
Title: {capstone['title']}
Domains Combined: {json.dumps(capstone['domains'])}
Requirements & Deliverables: {json.dumps(capstone['deliverables'])}

Scholar's Written Architecture / Proof / Defense:
{submission[:8000]}

Scholar's Code / Implementation:
{code[:8000]}

Evaluate rigorously across all domains involved. Return ONLY JSON:
{{
  "score": 0.88,
  "grade": "A",
  "committee_verdict": "Pass with Interdisciplinary Honors",
  "domain_scores": {{"domain_1": 90, "domain_2": 85, "domain_3": 89}},
  "feedback": "markdown detailed multi-paragraph review from the faculty chairs",
  "next_steps": ["1-2 concrete extensions"]
}}"""


def lab_tests_prompt(lesson_title: str, lab: dict) -> str:
    return f"""Write hidden unit tests for an in-browser Python (Pyodide) lab in the lesson "{lesson_title}".
Lab title: {lab.get('title')}
Tasks: {json.dumps(lab.get('tasks') or [])}
Starter code:
{(lab.get('starter_code') or '')[:4000]}
Reference solution:
{(lab.get('solution_code') or '(none provided)')[:4000]}

Write 3-6 plain Python `assert` statements (each with a helpful failure message) that run AFTER the learner's code in the same
global namespace and verify the tasks were actually completed (names/values/shapes/behaviour). They must pass for a correct
solution and fail for the untouched starter code. numpy is available. No input(), files, network or printing required.
Return ONLY JSON: {{"tests": "python source"}}"""


def explain_selection_prompt(lesson_title: str, selection: str, mode: str) -> str:
    style = {"simple": "Explain it like I'm a smart 12-year-old, with one vivid everyday analogy, in under 120 words.",
             "deeper": "Go one level deeper than the lecture: the formal mechanism, why it holds, and one subtle edge case, under 220 words."}
    return f"""A learner reading the lecture "{lesson_title}" highlighted this passage:
\"\"\"{selection[:2000]}\"\"\"
{style.get(mode, style['simple'])} Use LaTeX for math. Return ONLY JSON: {{"explanation": "markdown"}}"""

