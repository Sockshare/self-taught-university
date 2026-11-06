#!/usr/bin/env python3
"""Validate one or more Self-Taught curriculum files against docs/CONTRACTS.md.

Usage:
    python3 tools/validate_curriculum.py curriculum/physics.py [curriculum/math.py ...]
    python3 tools/validate_curriculum.py            # validates every curriculum/*.py

Exit code 0 = valid (warnings allowed), 1 = errors found.
"""
from __future__ import annotations

import glob
import importlib.util
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLUG = re.compile(r"^[a-z0-9_]+$")
LEVELS = {100, 200, 300, 400, 500, 600}

KNOWN_SIMS = {
    # physics
    "projectile", "pendulum", "spring_mass", "collisions", "orbit", "wave_superposition",
    "electric_field", "ideal_gas", "relativity", "quantum_well", "blackbody",
    "orbital_gravity", "em_field_lines", "circuit_rc_rlc",
    # chemistry
    "atom_builder", "reaction_kinetics", "titration", "radioactive_decay", "periodic_trends", "equilibrium",
    # math
    "function_plotter", "derivative_explorer", "riemann_sum", "taylor_series", "matrix_transform",
    "distribution_explorer", "regression_fit", "fourier_series", "phase_portrait", "graph_theory", "modular_clock",
    "fourier_epicycles", "graph_traversal",
    # ai
    "gradient_descent", "perceptron", "nn_playground", "kmeans", "attention_viz", "ngram_predictor",
    "bandit", "gridworld_rl", "agent_sim", "tokenizer", "neural_network_playground",
    # robotics
    "pid_controller", "robot_arm", "differential_drive", "path_planning", "kalman_filter", "state_machine",
    # philosophy
    "truth_table", "trolley_lab", "prisoners_dilemma", "veil_of_ignorance", "bayes_belief", "sorites", "argument_mapper",
    "logic_truth_table", "bayes_updater", "social_choice_voting",
    # languages
    "tone_pitch_trainer", "script_stroke_lab", "conjugation_matrix", "semitic_root_weaver", "dialogue_immersion",
}
for _jsp in glob.glob(os.path.join(ROOT, "static", "sims", "*.js")):
    try:
        with open(_jsp, "r", encoding="utf-8") as _f:
            KNOWN_SIMS.update(re.findall(r'["\']?id["\']?\s*:\s*["\']([a-zA-Z0-9_]+)["\']', _f.read()))
    except Exception:
        pass


def load_domain(path: str) -> dict:
    spec = importlib.util.spec_from_file_location(f"_curr_{os.path.basename(path)[:-3]}", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
    if not hasattr(mod, "DOMAIN"):
        raise ValueError(f"{path}: missing module-level DOMAIN")
    return mod.DOMAIN


def validate(domain: dict, path: str, all_course_ids: set[str] | None = None):
    errors: list[str] = []
    warnings: list[str] = []
    stats = {"subjects": 0, "courses": 0, "modules": 0, "lessons": 0, "with_sim": 0, "with_lab": 0, "interactive_modules": 0}

    def err(msg):
        errors.append(f"{path}: {msg}")

    def warn(msg):
        warnings.append(f"{path}: {msg}")

    for key in ("id", "name", "icon", "color", "tagline", "description", "subjects"):
        if key not in domain:
            err(f"domain missing '{key}'")
    if errors:
        return errors, warnings, stats
    if not SLUG.match(domain["id"]):
        err(f"domain id '{domain['id']}' is not a slug")
    if not re.match(r"^#[0-9a-fA-F]{6}$", domain["color"]):
        err(f"domain color '{domain['color']}' must be a #rrggbb hex")

    subj_ids: set[str] = set()
    course_ids: set[str] = set()
    for s in domain["subjects"]:
        stats["subjects"] += 1
        for key in ("id", "name", "description", "courses"):
            if key not in s:
                err(f"subject {s.get('id', '?')} missing '{key}'")
        sid = s.get("id", "")
        if not SLUG.match(sid):
            err(f"subject id '{sid}' is not a slug")
        if sid in subj_ids:
            err(f"duplicate subject id '{sid}'")
        subj_ids.add(sid)
        courses = s.get("courses", [])
        if len(courses) < 3:
            warn(f"subject '{sid}' has only {len(courses)} courses (want 3–5)")
        levels = sorted(c.get("level", 0) for c in courses)
        if courses and (levels[0] > 200 or levels[-1] < 400):
            warn(f"subject '{sid}' levels {levels} do not span a Freshman→Graduate arc")
        for c in courses:
            stats["courses"] += 1
            for key in ("id", "code", "title", "level", "credits", "description", "modules"):
                if key not in c:
                    err(f"course {c.get('id', '?')} missing '{key}'")
            cid = c.get("id", "")
            if not SLUG.match(cid):
                err(f"course id '{cid}' is not a slug")
            if cid in course_ids:
                err(f"duplicate course id '{cid}'")
            course_ids.add(cid)
            if c.get("level") not in LEVELS:
                err(f"course '{cid}' level {c.get('level')} not in {sorted(LEVELS)}")
            if not isinstance(c.get("credits"), int) or not 1 <= c.get("credits", 0) <= 6:
                err(f"course '{cid}' credits must be int 1–6")
            if not isinstance(c.get("prerequisites", []), list):
                err(f"course '{cid}' prerequisites must be a list")
            modules = c.get("modules", [])
            if len(modules) < 4:
                warn(f"course '{cid}' has only {len(modules)} modules (want 5–8)")
            mod_ids: set[str] = set()
            for m in modules:
                stats["modules"] += 1
                for key in ("id", "title", "summary", "lessons"):
                    if key not in m:
                        err(f"module {cid}/{m.get('id', '?')} missing '{key}'")
                mid = m.get("id", "")
                if not SLUG.match(mid):
                    err(f"module id '{mid}' in course '{cid}' is not a slug")
                if mid in mod_ids:
                    err(f"duplicate module id '{mid}' in course '{cid}'")
                mod_ids.add(mid)
                sim = m.get("sim")
                if sim is not None:
                    if sim not in KNOWN_SIMS:
                        err(f"module {cid}/{mid} references unknown sim '{sim}'")
                    stats["with_sim"] += 1
                if m.get("lab"):
                    stats["with_lab"] += 1
                if sim or m.get("lab"):
                    stats["interactive_modules"] += 1
                lessons = m.get("lessons", [])
                if not isinstance(lessons, list) or not all(isinstance(x, str) and x.strip() for x in lessons):
                    err(f"module {cid}/{mid} lessons must be a list of non-empty strings")
                    continue
                if len(lessons) < 3:
                    warn(f"module {cid}/{mid} has only {len(lessons)} lessons (want 3–6)")
                if len(lessons) > 8:
                    warn(f"module {cid}/{mid} has {len(lessons)} lessons (want 3–6)")
                if len(set(x.strip().lower() for x in lessons)) != len(lessons):
                    err(f"module {cid}/{mid} has duplicate lesson titles")
                for t in lessons:
                    if "\n" in t:
                        err(f"lesson title contains newline in {cid}/{mid}")
                stats["lessons"] += len(lessons)

    # soft prerequisite check
    if all_course_ids is not None:
        for s in domain["subjects"]:
            for c in s.get("courses", []):
                for p in c.get("prerequisites", []) or []:
                    if p not in all_course_ids:
                        warn(f"course '{c['id']}' prerequisite '{p}' not found in catalog")

    if stats["lessons"] < 500:
        warn(f"domain '{domain['id']}' has {stats['lessons']} lessons (target ≥ 500)")
    if stats["modules"] and stats["interactive_modules"] / stats["modules"] < 0.4:
        warn(f"domain '{domain['id']}' only {stats['interactive_modules']}/{stats['modules']} modules are interactive (target ≥ 40%)")
    return errors, warnings, stats


def main(argv: list[str]) -> int:
    paths = argv[1:] or sorted(glob.glob(os.path.join(ROOT, "curriculum", "*.py")))
    paths = [p for p in paths if not os.path.basename(p).startswith("_")]
    domains = []
    for p in paths:
        try:
            domains.append((p, load_domain(p)))
        except Exception as e:  # noqa: BLE001
            print(f"ERROR {p}: failed to import: {e}")
            return 1
    all_course_ids = {c["id"] for _, d in domains for s in d.get("subjects", []) for c in s.get("courses", []) if "id" in c}
    total_errors = 0
    grand = {"lessons": 0, "modules": 0, "courses": 0}
    for p, d in domains:
        errors, warnings, stats = validate(d, os.path.relpath(p, ROOT), all_course_ids)
        total_errors += len(errors)
        for e in errors:
            print("ERROR  ", e)
        for w in warnings:
            print("WARN   ", w)
        print(f"OK? {'no' if errors else 'yes'}  {d.get('id','?'):12s} subjects={stats['subjects']:2d} courses={stats['courses']:3d} "
              f"modules={stats['modules']:4d} lessons={stats['lessons']:5d} sims={stats['with_sim']} labs={stats['with_lab']}")
        for k in grand:
            grand[k] += stats[k]
    print(f"TOTAL courses={grand['courses']} modules={grand['modules']} lessons={grand['lessons']}")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
