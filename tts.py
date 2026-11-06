"""Human Neural Text-to-Speech (TTS) & Professor Voice Lecturer engine for Self-Taught University.

Supports:
1. Microsoft Azure / Edge Natural & DragonHD Multilingual Neural Voices (`edge-tts`) across 16 distinct,
   genuine human-recorded faculty personas (8 Female & 8 Male lecturers) with native fluency in
   English (US/UK), Mandarin (`zh-CN`), German (`de-DE`), Italian (`it-IT`), French (`fr-FR`), and Arabic (`ar-EG`/`ar-SA`).
   Zero robotic pitch-shifting (`asetrate`), zero rate-limit bottlenecks, and natural human breathing/prosody.
2. Gemini 2.5 Neural Audio (`gemini-2.5-flash-preview-tts`) studio mode when explicitly selected and within quota,
   falling back automatically to the matching Microsoft Azure Human Neural voice.
3. On-disk audio caching in `data/tts_cache/` + pre-generated human neural audition samples in `static/audio/samples/`.
"""
from __future__ import annotations

import asyncio
import hashlib
import io
import os
import re
import struct
import threading
import time
import urllib.parse
import urllib.request
from typing import Any

import db
import llm

ROOT = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(ROOT, "data", "tts_cache")
SAMPLES_DIR = os.path.join(ROOT, "static", "audio", "samples")
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

# ---------------- audio cache management (LRU eviction by last access) ----------------
DEFAULT_CACHE_MAX_MB = 500


def _touch(path: str) -> None:
    try:
        os.utime(path, None)  # mark as recently used for LRU eviction
    except OSError:
        pass


def _cache_files() -> list[tuple[str, int, float]]:
    out = []
    try:
        for name in os.listdir(CACHE_DIR):
            fp = os.path.join(CACHE_DIR, name)
            if os.path.isfile(fp):
                st = os.stat(fp)
                out.append((fp, st.st_size, st.st_mtime))
    except FileNotFoundError:
        pass
    return out


def cache_max_bytes() -> int:
    try:
        mb = float(db.get_setting("tts_cache_max_mb", DEFAULT_CACHE_MAX_MB) or DEFAULT_CACHE_MAX_MB)
    except (TypeError, ValueError):
        mb = DEFAULT_CACHE_MAX_MB
    return int(max(20, mb) * 1024 * 1024)


def cache_stats() -> dict:
    files = _cache_files()
    total = sum(f[1] for f in files)
    return {"files": len(files), "bytes": total, "mb": round(total / 1048576, 1), "max_mb": round(cache_max_bytes() / 1048576),
            "path": CACHE_DIR, "oldest": min((f[2] for f in files), default=None)}


def prune_cache(max_bytes: int | None = None) -> dict:
    """Evict least-recently-used audio files until the cache fits within max_bytes."""
    limit = cache_max_bytes() if max_bytes is None else max_bytes
    files = sorted(_cache_files(), key=lambda f: f[2])  # oldest access first
    total = sum(f[1] for f in files)
    removed = freed = 0
    for fp, size, _ in files:
        if total <= limit:
            break
        try:
            os.remove(fp)
            total -= size
            freed += size
            removed += 1
        except OSError:
            pass
    return {"removed": removed, "freed_mb": round(freed / 1048576, 1), **cache_stats()}


def clear_cache() -> dict:
    return prune_cache(0)


TTS_MODEL = "gemini-2.5-flash-preview-tts"
DEFAULT_PERSONA = "claire_evans"

VOICE_PERSONAS: list[dict[str, Any]] = [
    # ==================== FEMALE FACULTY LECTURERS (8) ====================
    {
        "id": "claire_evans",
        "name": "Dr. Claire Evans",
        "gender": "female",
        "Tagline": "Warm Contralto · Senior Fellow in Theoretical Sciences",
        "style_badge": "🎙️ Warm Contralto (F)",
        "edge_voice": "en-US-AvaMultilingualNeural",
        "edge_rate": "-4%",
        "edge_pitch": "-2Hz",
        "gemini_voice": "Kore",
        "default_lang": "en",
        "cloud_tl": "en-us",
        "accent_hint": "en-US",
        "direction": (
            "Speak in a warm, smooth, low-pitched, and composed female professor voice — "
            "clear, unhurried, and engaging, like a one-on-one university tutorial."
        ),
        "sample_text": (
            "Welcome to today's seminar. Let us take a clear, unhurried look at the foundational "
            "principles behind this topic, and build your intuition step by step."
        ),
    },
    {
        "id": "elena_vance",
        "name": "Prof. Elena Vance",
        "gender": "female",
        "Tagline": "Clear & Expressive · Distinguished University Lecturer",
        "style_badge": "🎓 Clear & Expressive (F)",
        "edge_voice": "en-US-EmmaMultilingualNeural",
        "edge_rate": "-2%",
        "edge_pitch": "+0Hz",
        "gemini_voice": "Aoede",
        "default_lang": "en",
        "cloud_tl": "en-us",
        "accent_hint": "en-US",
        "direction": (
            "Speak in a warm, articulate, encouraging female academic voice "
            "with natural cadence and clarity."
        ),
        "sample_text": (
            "Good to have you in lecture today. We will build the intuition first, and then prove "
            "why the result holds across every case."
        ),
    },
    {
        "id": "linnea_sterling",
        "name": "Dr. Linnea Sterling",
        "gender": "female",
        "Tagline": "Oxford Received Pronunciation · Classical & STEM Fellow",
        "style_badge": "🇬🇧 Oxford RP (F)",
        "edge_voice": "en-GB-SoniaNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-1Hz",
        "gemini_voice": "Vindemiatrix",
        "default_lang": "en",
        "cloud_tl": "en-uk",
        "accent_hint": "en-GB",
        "direction": (
            "Speak in a poised, crisp, British female academic voice — "
            "articulate, confident, and scholarly."
        ),
        "sample_text": (
            "Good evening, Scholar. Today we are going all the way from physical intuition to rigorous proof."
        ),
    },
    {
        "id": "chiara_bellini",
        "name": "Dr. Chiara Bellini",
        "gender": "female",
        "Tagline": "Rome & Florence · Italian Language & Humanities Chair",
        "style_badge": "🇮🇹 Italiano (F)",
        "edge_voice": "it-IT-IsabellaNeural",
        "edge_rate": "-2%",
        "edge_pitch": "+0Hz",
        "gemini_voice": "Callirrhoe",
        "default_lang": "it",
        "cloud_tl": "it",
        "accent_hint": "it-IT",
        "direction": (
            "Speak in a warm, melodic female academic voice with a refined Italian cadence; "
            "pronounce any Italian phrases with native Roman and Florentine clarity."
        ),
        "sample_text": (
            "Buongiorno! Insieme esploreremo la bellezza della lingua italiana, step by step, with natural rhythm and clarity."
        ),
    },
    {
        "id": "colette_laurent",
        "name": "Prof. Colette Laurent",
        "gender": "female",
        "Tagline": "Sorbonne & Sciences Po · French Language & Philosophy Chair",
        "style_badge": "🇫🇷 Français (F)",
        "edge_voice": "fr-FR-VivienneMultilingualNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-1Hz",
        "gemini_voice": "Despina",
        "default_lang": "fr",
        "cloud_tl": "fr",
        "accent_hint": "fr-FR",
        "direction": (
            "Speak in a poised, smooth female academic voice with Parisian diction; "
            "pronounce any French words with authentic native precision."
        ),
        "sample_text": (
            "Bonjour. In today's lecture, nous allons explorer how clarity of language sharpens analytical reasoning."
        ),
    },
    {
        "id": "meiling_zhou",
        "name": "Prof. Mei-Ling Zhou",
        "gender": "female",
        "Tagline": "Beijing & Tsinghua · Mandarin & Computational Sciences",
        "style_badge": "🇨🇳 普通话 (F)",
        "edge_voice": "zh-CN-XiaoxiaoNeural",
        "edge_rate": "-3%",
        "edge_pitch": "+0Hz",
        "gemini_voice": "Leda",
        "default_lang": "zh-CN",
        "cloud_tl": "zh-CN",
        "accent_hint": "zh-CN",
        "direction": (
            "Speak in a clear, composed female professor voice; pronounce any Mandarin Chinese "
            "with standard Putonghua tones and natural warmth."
        ),
        "sample_text": (
            "欢迎来到大学课堂。 Today we will connect standard Mandarin pronunciation and tones with clear structural grammar."
        ),
    },
    {
        "id": "marlene_richter",
        "name": "Dr. Marlene Richter",
        "gender": "female",
        "Tagline": "Humboldt & ETH · German Language, Physics & Philosophy",
        "style_badge": "🇩🇪 Deutsch (F)",
        "edge_voice": "de-DE-SeraphinaMultilingualNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-1Hz",
        "gemini_voice": "Sulafat",
        "default_lang": "de",
        "cloud_tl": "de",
        "accent_hint": "de-DE",
        "direction": (
            "Speak in a composed, resonant female academic voice; pronounce any German words "
            "with crisp Hochdeutsch diction."
        ),
        "sample_text": (
            "Guten Tag. Precision and clarity belong together — beginnen wir heute mit den Grundlagen from first principles."
        ),
    },
    {
        "id": "layla_mansoor",
        "name": "Prof. Layla Al-Mansoor",
        "gender": "female",
        "Tagline": "Cairo & Beirut · Arabic Philology, Rhetoric & Mathematics",
        "style_badge": "🌙 العربية (F)",
        "edge_voice": "ar-EG-SalmaNeural",
        "edge_rate": "-3%",
        "edge_pitch": "+0Hz",
        "gemini_voice": "Zephyr",
        "default_lang": "ar",
        "cloud_tl": "ar",
        "accent_hint": "ar-XA",
        "direction": (
            "Speak in a warm, articulate female professor voice; pronounce any Arabic words "
            "with clear, classical Fuṣḥā articulation."
        ),
        "sample_text": (
            "أهلاً وسهلاً بكم في المحاضرة. Every root in Arabic and mathematics carries a deep, elegant structural logic."
        ),
    },

    # ==================== MALE FACULTY LECTURERS (8) ====================
    {
        "id": "arthur_pendleton",
        "name": "Prof. Arthur Pendleton",
        "gender": "male",
        "Tagline": "Oxford Baritone · Chair of Natural Philosophy & Mathematics",
        "style_badge": "🇬🇧 Oxford Baritone (M)",
        "edge_voice": "en-GB-RyanNeural",
        "edge_rate": "-4%",
        "edge_pitch": "-3Hz",
        "gemini_voice": "Charon",
        "default_lang": "en",
        "cloud_tl": "en-uk",
        "accent_hint": "en-GB",
        "direction": (
            "Speak in a deep, resonant, authoritative British male baritone professor voice — "
            "measured, scholarly, and crystal clear."
        ),
        "sample_text": (
            "Good day, Scholar. Let us lay out the axioms on the board and trace their consequences step by step."
        ),
    },
    {
        "id": "marcus_hale",
        "name": "Dr. Marcus Hale",
        "gender": "male",
        "Tagline": "MIT & Stanford · Engineering, AI & Applied Physics",
        "style_badge": "🎙️ Deep Baritone (M)",
        "edge_voice": "en-US-BrianMultilingualNeural",
        "edge_rate": "-4%",
        "edge_pitch": "-3Hz",
        "gemini_voice": "Fenrir",
        "default_lang": "en",
        "cloud_tl": "en-us",
        "accent_hint": "en-US",
        "direction": (
            "Speak in a calm, deep, grounded American male baritone lecturer voice — "
            "focused, practical, and clear."
        ),
        "sample_text": (
            "Welcome to the lab. We are going to derive the governing equations and test them directly in simulation."
        ),
    },
    {
        "id": "julian_mercer",
        "name": "Prof. Julian Mercer",
        "gender": "male",
        "Tagline": "Dynamic & Socratic · Seminar Leader in Logic & Systems",
        "style_badge": "⚡ Dynamic Tenor (M)",
        "edge_voice": "en-US-AndrewMultilingualNeural",
        "edge_rate": "-1%",
        "edge_pitch": "-1Hz",
        "gemini_voice": "Puck",
        "default_lang": "en",
        "cloud_tl": "en-us",
        "accent_hint": "en-US",
        "direction": (
            "Speak in an energetic, Socratic, articulate male professor voice "
            "that brings complex ideas to life."
        ),
        "sample_text": (
            "Let us start with a puzzle that looks simple on the surface, then see why it changes how we think about the entire field."
        ),
    },
    {
        "id": "lukas_weber",
        "name": "Prof. Lukas Weber",
        "gender": "male",
        "Tagline": "Heidelberg & Munich · German, Mechanics & Formal Logic",
        "style_badge": "🇩🇪 Deutsch (M)",
        "edge_voice": "de-DE-FlorianMultilingualNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-2Hz",
        "gemini_voice": "Orus",
        "default_lang": "de",
        "cloud_tl": "de",
        "accent_hint": "de-DE",
        "direction": (
            "Speak in a deep, composed male academic voice; pronounce German words "
            "with clear, authoritative Hochdeutsch articulation."
        ),
        "sample_text": (
            "Guten Tag. Wir untersuchen heute die grundlegenden Strukturen und Beweise Schritt für Schritt."
        ),
    },
    {
        "id": "lorenzo_conti",
        "name": "Dr. Lorenzo Conti",
        "gender": "male",
        "Tagline": "Bologna & Milan · Italian Literature, Physics & Architecture",
        "style_badge": "🇮🇹 Italiano (M)",
        "edge_voice": "it-IT-GiuseppeMultilingualNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-2Hz",
        "gemini_voice": "Iapetus",
        "default_lang": "it",
        "cloud_tl": "it",
        "accent_hint": "it-IT",
        "direction": (
            "Speak in a warm, resonant male professor voice with classical Italian diction."
        ),
        "sample_text": (
            "Buongiorno a tutti. Oggi analizziamo insieme la teoria fondamentale e gli esempi pratici."
        ),
    },
    {
        "id": "henri_moreau",
        "name": "Prof. Henri Moreau",
        "gender": "male",
        "Tagline": "École Polytechnique · French Mathematics & Philosophy",
        "style_badge": "🇫🇷 Français (M)",
        "edge_voice": "fr-FR-RemyMultilingualNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-2Hz",
        "gemini_voice": "Enceladus",
        "default_lang": "fr",
        "cloud_tl": "fr",
        "accent_hint": "fr-FR",
        "direction": (
            "Speak in a distinguished, measured male French academic voice."
        ),
        "sample_text": (
            "Bonjour à tous. Commençons par définir rigoureusement les termes essentiels de notre problème."
        ),
    },
    {
        "id": "jian_chen",
        "name": "Prof. Jian Chen",
        "gender": "male",
        "Tagline": "Peking University · Mandarin Linguistics & Quantitative Science",
        "style_badge": "🇨🇳 普通话 (M)",
        "edge_voice": "zh-CN-YunyangNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-2Hz",
        "gemini_voice": "Algenib",
        "default_lang": "zh-CN",
        "cloud_tl": "zh-CN",
        "accent_hint": "zh-CN",
        "direction": (
            "Speak in a steady, resonant male professor voice with standard Putonghua pronunciation."
        ),
        "sample_text": (
            "大家好，欢迎来到今天的课程。我们从基础概念开始，一步一步进行推导。"
        ),
    },
    {
        "id": "tariq_khalil",
        "name": "Dr. Tariq Al-Khalil",
        "gender": "male",
        "Tagline": "Amman & Oxford · Arabic Grammar (Naḥw), Optics & History",
        "style_badge": "🌙 العربية (M)",
        "edge_voice": "ar-SA-HamedNeural",
        "edge_rate": "-3%",
        "edge_pitch": "-2Hz",
        "gemini_voice": "Achird",
        "default_lang": "ar",
        "cloud_tl": "ar",
        "accent_hint": "ar-XA",
        "direction": (
            "Speak in a deep, clear male scholar voice with classical Fuṣḥā Arabic diction."
        ),
        "sample_text": (
            "السلام عليكم. نبدأ درس اليوم بتحليل القواعد الأساسية والأمثلة التطبيقية."
        ),
    },
]

PERSONA_BY_ID: dict[str, dict[str, Any]] = {p["id"]: p for p in VOICE_PERSONAS}

_LANG_TO_EDGE_VOICE: dict[tuple[str, str], str] = {
    ("zh-CN", "female"): "zh-CN-XiaoxiaoNeural",
    ("zh-CN", "male"): "zh-CN-YunyangNeural",
    ("zh", "female"): "zh-CN-XiaoxiaoNeural",
    ("zh", "male"): "zh-CN-YunyangNeural",
    ("de", "female"): "de-DE-SeraphinaMultilingualNeural",
    ("de", "male"): "de-DE-FlorianMultilingualNeural",
    ("de-DE", "female"): "de-DE-SeraphinaMultilingualNeural",
    ("de-DE", "male"): "de-DE-FlorianMultilingualNeural",
    ("it", "female"): "it-IT-IsabellaNeural",
    ("it", "male"): "it-IT-GiuseppeMultilingualNeural",
    ("it-IT", "female"): "it-IT-IsabellaNeural",
    ("it-IT", "male"): "it-IT-GiuseppeMultilingualNeural",
    ("fr", "female"): "fr-FR-VivienneMultilingualNeural",
    ("fr", "male"): "fr-FR-RemyMultilingualNeural",
    ("fr-FR", "female"): "fr-FR-VivienneMultilingualNeural",
    ("fr-FR", "male"): "fr-FR-RemyMultilingualNeural",
    ("ar", "female"): "ar-EG-SalmaNeural",
    ("ar", "male"): "ar-SA-HamedNeural",
    ("en", "female"): "en-US-AvaMultilingualNeural",
    ("en", "male"): "en-US-AndrewMultilingualNeural",
}

_inflight_lock = threading.Lock()
_gemini_tts_cooldown_until: float = 0.0


def normalize_persona_id(persona_id: str | None) -> str:
    if not persona_id:
        return DEFAULT_PERSONA
    pid = str(persona_id)
    return pid if pid in PERSONA_BY_ID else DEFAULT_PERSONA


def get_persona(persona_id: str | None = None) -> dict[str, Any]:
    if not persona_id:
        persona_id = db.get_setting("voice_persona", DEFAULT_PERSONA) or DEFAULT_PERSONA
    pid = normalize_persona_id(persona_id)
    return PERSONA_BY_ID.get(pid, PERSONA_BY_ID[DEFAULT_PERSONA])


def list_personas() -> list[dict[str, Any]]:
    out = []
    for p in VOICE_PERSONAS:
        wav_abs = os.path.join(SAMPLES_DIR, f"{p['id']}.wav")
        mp3_abs = os.path.join(SAMPLES_DIR, f"{p['id']}.mp3")
        if os.path.exists(mp3_abs) and os.path.getsize(mp3_abs) > 1000:
            url = f"/static/audio/samples/{p['id']}.mp3?v=human2"
        elif os.path.exists(wav_abs) and os.path.getsize(wav_abs) > 1000:
            url = f"/static/audio/samples/{p['id']}.wav?v=human2"
        else:
            url = f"/api/tts/sample/{p['id']}?v=human2"
        out.append({**p, "sample_url": url})
    return out


# ---------------- LaTeX & Markdown -> Natural Spoken Text ----------------

_GREEK_SPOKEN = {
    r"\alpha": " alpha ", r"\beta": " beta ", r"\gamma": " gamma ", r"\Gamma": " Gamma ",
    r"\delta": " delta ", r"\Delta": " Delta ", r"\epsilon": " epsilon ", r"\varepsilon": " epsilon ",
    r"\zeta": " zeta ", r"\eta": " eta ", r"\theta": " theta ", r"\Theta": " Theta ",
    r"\vartheta": " theta ", r"\iota": " iota ",
    r"\kappa": " kappa ", r"\lambda": " lambda ", r"\Lambda": " Lambda ", r"\mu": " mu ",
    r"\nu": " nu ", r"\xi": " xi ", r"\Xi": " Xi ", r"\pi": " pi ", r"\Pi": " Pi ", r"\rho": " rho ",
    r"\sigma": " sigma ", r"\Sigma": " Sigma ", r"\tau": " tau ", r"\upsilon": " upsilon ",
    r"\phi": " phi ", r"\varphi": " phi ", r"\Phi": " Phi ", r"\chi": " chi ",
    r"\psi": " psi ", r"\Psi": " Psi ", r"\omega": " omega ", r"\Omega": " Omega ",
    r"\infty": " infinity ", r"\partial": " partial ", r"\nabla": " del ",
    r"\approx": " is approximately ", r"\neq": " is not equal to ", r"\ne": " is not equal to ",
    r"\equiv": " is equivalent to ", r"\propto": " is proportional to ", r"\sim": " is distributed as ",
    r"\leq": " is less than or equal to ", r"\le": " is less than or equal to ",
    r"\geq": " is greater than or equal to ", r"\ge": " is greater than or equal to ",
    r"\ll": " is much less than ", r"\gg": " is much greater than ",
    r"\times": " times ", r"\cdot": " times ", r"\div": " divided by ", r"\pm": " plus or minus ",
    r"\mp": " minus or plus ", r"\circ": " composed with ", r"\otimes": " tensor product ",
    r"\leftrightarrow": " corresponds to ", r"\Leftrightarrow": " if and only if ",
    r"\rightarrow": " leads to ", r"\to": " approaches ", r"\mapsto": " maps to ",
    r"\Rightarrow": " implies ", r"\implies": " implies ",
    r"\leftarrow": " comes from ", r"\Leftarrow": " is implied by ",
    r"\iff": " if and only if ", r"\in": " in ", r"\notin": " not in ",
    r"\subset": " is a subset of ", r"\subseteq": " is a subset of ",
    r"\cup": " union ", r"\cap": " intersection ", r"\emptyset": " the empty set ",
    r"\forall": " for all ", r"\exists": " there exists ", r"\neg": " not ",
    r"\land": " and ", r"\lor": " or ", r"\mid": " given ",
    r"\int": " the integral of ", r"\oint": " the contour integral of ",
    r"\sum": " the sum of ", r"\prod": " the product of ",
    r"\lim": " the limit of ", r"\log": " log ", r"\ln": " natural log of ",
    r"\exp": " e to the ", r"\sin": " sine ", r"\cos": " cosine ", r"\tan": " tangent ",
    r"\arcsin": " arcsine ", r"\arccos": " arccosine ", r"\arctan": " arctangent ",
    r"\sinh": " hyperbolic sine ", r"\cosh": " hyperbolic cosine ", r"\tanh": " hyperbolic tangent ",
    r"\max": " the maximum of ", r"\min": " the minimum of ",
    r"\argmax": " arg max of ", r"\argmin": " arg min of ",
    r"\det": " the determinant of ", r"\dim": " the dimension of ",
}

_UNICODE_MATH_SPOKEN = {
    "→": " leads to ", "←": " comes from ", "↔": " corresponds to ",
    "⇒": " implies ", "⇐": " is implied by ", "⇔": " if and only if ",
    "↦": " maps to ", "≈": " is approximately ", "≠": " is not equal to ",
    "≡": " is equivalent to ", "∝": " is proportional to ",
    "≤": " is less than or equal to ", "≥": " is greater than or equal to ",
    "≪": " is much less than ", "≫": " is much greater than ",
    "±": " plus or minus ", "×": " times ", "÷": " divided by ", "·": " times ",
    "∞": " infinity ", "∂": " partial ", "∇": " del ", "√": " the square root of ",
    "∑": " the sum of ", "∏": " the product of ", "∫": " the integral of ",
    "∈": " in ", "∉": " not in ", "⊂": " is a subset of ", "⊆": " is a subset of ",
    "∪": " union ", "∩": " intersection ", "∅": " the empty set ",
    "∀": " for all ", "∃": " there exists ", "¬": " not ",
    "∧": " and ", "∨": " or ", "⊥": " is perpendicular to ", "∥": " is parallel to ",
    "°": " degrees ", "′": " prime ", "″": " double prime ",
    "²": " squared ", "³": " cubed ", "⁴": " to the fourth ",
    "⁰": " to the zero ", "¹": " to the first ", "⁻¹": " inverse ",
    "₀": " naught ", "₁": " sub 1 ", "₂": " sub 2 ", "₃": " sub 3 ", "₄": " sub 4 ",
    "α": " alpha ", "β": " beta ", "γ": " gamma ", "δ": " delta ", "Δ": " Delta ",
    "ε": " epsilon ", "ζ": " zeta ", "η": " eta ", "θ": " theta ", "Θ": " Theta ",
    "κ": " kappa ", "λ": " lambda ", "Λ": " Lambda ", "μ": " mu ", "ν": " nu ",
    "ξ": " xi ", "π": " pi ", "Π": " Pi ", "ρ": " rho ", "σ": " sigma ", "Σ": " Sigma ",
    "τ": " tau ", "φ": " phi ", "Φ": " Phi ", "χ": " chi ", "ψ": " psi ", "Ψ": " Psi ",
    "ω": " omega ", "Ω": " Omega ",
}


def _humanize_inline_code(match: re.Match) -> str:
    """Turn inline `code` into smooth spoken English rather than reading punctuation aloud."""
    raw = match.group(1).strip()
    if not raw:
        return ""
    # Replace snake_case with spaces
    spoken = raw.replace("_", " ")
    # If it looks like a complex code expression with brackets/dots/parens/semicolons, soften it
    if re.search(r"[;{}[\]\\]", spoken) or spoken.count("(") >= 1 or spoken.count(".") >= 1:
        spoken = re.sub(r"(?<=[a-zA-Z0-9])\.(?=[a-zA-Z])", " ", spoken)
        spoken = re.sub(r"[(){}[\];,:\"']", " ", spoken)
    spoken = spoken.replace("==", " equals ").replace("!=", " is not equal to ")
    spoken = spoken.replace("<=", " is less than or equal to ").replace(">=", " is greater than or equal to ")
    spoken = spoken.replace("->", " leads to ").replace("=>", " leads to ")
    spoken = re.sub(r"(\d|\b[a-zA-Z])\s*\*\*\s*(\d|\b[a-zA-Z])", r"\1 to the power of \2", spoken)
    spoken = re.sub(r"(\d|\b[a-zA-Z])\s*\*\s*(\d|\b[a-zA-Z])", r"\1 times \2", spoken)
    spoken = re.sub(r"(\d|\b[a-zA-Z])\s*\+\s*(\d|\b[a-zA-Z])", r"\1 plus \2", spoken)
    spoken = re.sub(r"(\d|\b[a-zA-Z])\s*-\s*(\d|\b[a-zA-Z])", r"\1 minus \2", spoken)
    return f" {spoken} "


def _humanize_table_row(line: str) -> str:
    """Convert a Markdown table row `| cell1 | cell2 | cell3 |` into a natural spoken sentence."""
    stripped = line.strip()
    if not stripped.startswith("|") and "|" not in stripped:
        return line
    # Check if this is a separator row like | :--- | :---: | ---: |
    inner = stripped.strip("|").strip()
    if not inner or re.fullmatch(r"[:\-\s|]+", inner):
        return ""
    cells = [c.strip() for c in stripped.strip("|").split("|") if c.strip() and not re.fullmatch(r"[:\-]+", c.strip())]
    if not cells:
        return ""
    joined = ", ".join(cells)
    if not joined.endswith((".", "!", "?", "。")):
        joined += "."
    return joined


def clean_for_speech(text: str, max_chars: int = 2600) -> str:
    """Convert Markdown, LaTeX, code, and LLM symbols into warm, natural spoken sentences like a human lecturer."""
    if not text:
        return ""
    s = str(text)

    # 1. Fenced code blocks -> natural spoken transition
    s = re.sub(r"```[\s\S]*?```", " Take a look at the code example on your screen. ", s)

    # 2. Markdown links & images (before bracket cleanup)
    s = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
    # Wiki-links [[Concept]] -> Concept
    s = re.sub(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", lambda m: m.group(2) or m.group(1), s)

    # 3. Markdown tables -> strip separator rows and convert data rows into clean clauses
    s = re.sub(r"(?m)^\s*\|?(?:\s*:?-{2,}:?\s*\|)+\s*:?-{2,}:?\s*\|?\s*$", "", s)
    lines = s.split("\n")
    cleaned_lines = []
    for line in lines:
        if "|" in line and (line.strip().startswith("|") or line.count("|") >= 2):
            row_spoken = _humanize_table_row(line)
            if row_spoken:
                cleaned_lines.append(row_spoken)
        else:
            cleaned_lines.append(line)
    s = "\n".join(cleaned_lines)

    # 4. Inline code `...` -> humanize before general symbol stripping
    s = re.sub(r"`([^`\n]+)`", _humanize_inline_code, s)

    # 5. Strip Markdown emphasis markers FIRST so `**bold**`, `*italic*`, `_italic_`, `~~strike~~`
    #    never get mistaken for math operators or read aloud as "asterisk" / "underscore"!
    s = re.sub(r"\*{1,3}([^*\n]+?)\*{1,3}", r"\1", s)
    s = re.sub(r"(?<!\w)_{1,3}([^_\n]+?)_{1,3}(?!\w)", r"\1", s)
    s = re.sub(r"~~([^~\n]+?)~~", r"\1", s)

    # 6. LaTeX environments & common calculus/algebra idioms
    s = re.sub(r"\\begin\{[^}]+\}", " ", s)
    s = re.sub(r"\\end\{[^}]+\}", " ", s)
    s = re.sub(r"\\frac\s*\{1\}\s*\{2\}", " one half ", s)
    s = re.sub(r"\\frac\s*\{1\}\s*\{3\}", " one third ", s)
    s = re.sub(r"\\frac\s*\{1\}\s*\{4\}", " one quarter ", s)
    s = re.sub(r"\\frac\s*\{d\}\s*\{d\s*([a-zA-Z])\}", r" the derivative with respect to \1 of ", s)
    s = re.sub(r"\\frac\s*\{d\s*([a-zA-Z])\}\s*\{d\s*([a-zA-Z])\}", r" d \1 by d \2 ", s)
    s = re.sub(r"\\frac\s*\{\\partial\}\s*\{\\partial\s*([a-zA-Z])\}", r" the partial derivative with respect to \1 of ", s)
    s = re.sub(r"\\frac\s*\{\\partial\s*([a-zA-Z])\}\s*\{\\partial\s*([a-zA-Z])\}", r" partial \1 by partial \2 ", s)
    # Apply nested \frac twice so compound fractions resolve cleanly
    for _ in range(2):
        s = re.sub(r"\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}", r" \1 over \2 ", s)
    s = re.sub(r"\\binom\s*\{([^{}]+)\}\s*\{([^{}]+)\}", r" \1 choose \2 ", s)
    s = re.sub(r"\\sqrt\s*\[([^\[\]]+)\]\s*\{([^{}]+)\}", r" the \1 root of \2 ", s)
    s = re.sub(r"\\sqrt\s*\{([^{}]+)\}", r" the square root of \1 ", s)
    s = re.sub(r"\\(?:text|textrm|textit|textbf|operatorname)\s*\{([^{}]+)\}", r" \1 ", s)
    s = re.sub(r"\\hat\s*\{([^{}]+)\}", r" \1 hat ", s)
    s = re.sub(r"\\bar\s*\{([^{}]+)\}", r" \1 bar ", s)
    s = re.sub(r"\\vec\s*\{([^{}]+)\}", r" vector \1 ", s)
    s = re.sub(r"\\tilde\s*\{([^{}]+)\}", r" \1 tilde ", s)
    s = re.sub(r"\\(?:mathbf|mathrm|mathcal|mathbb|mathfrak|mathsf|bm|dot|ddot|overline|underline)\s*\{([^{}]+)\}", r" \1 ", s)

    # 7. Superscripts & subscripts (both braced and unbraced!)
    s = re.sub(r"\^\{\\top\}|\^\\top|\^\{T\}|\^T\b", " transpose ", s)
    s = re.sub(r"\^\{-1\}|\^-1\b", " inverse ", s)
    s = re.sub(r"\^\{\*\}|\^\*", " star ", s)
    s = re.sub(r"\^\{2\}|\^2\b", " squared ", s)
    s = re.sub(r"\^\{3\}|\^3\b", " cubed ", s)
    s = re.sub(r"\^\{-([0-9]+)\}|\^-([0-9]+)\b", lambda m: f" to the minus {m.group(1) or m.group(2)} ", s)
    s = re.sub(r"\^\{([^{}]+)\}", r" to the power of \1 ", s)
    s = re.sub(r"\^([0-9]+|[a-zA-Z])\b", r" to the \1 ", s)
    # Subscripts: x_0 -> x naught, x_1 -> x sub 1, x_i -> x sub i
    s = re.sub(r"([a-zA-Z])_\{0\}|([a-zA-Z])_0\b", lambda m: f"{m.group(1) or m.group(2)} naught", s)
    s = re.sub(r"_\{([^{}]+)\}", r" sub \1 ", s)
    s = re.sub(r"\b([a-zA-Z])_([0-9]+|[a-zA-Z])\b", r"\1 sub \2", s)
    # Snake_case words (e.g. learning_rate -> learning rate)
    s = re.sub(r"([a-zA-Z0-9])_([a-zA-Z0-9])", r"\1 \2", s)
    s = re.sub(r"([a-zA-Z0-9])_([a-zA-Z0-9])", r"\1 \2", s)

    # 8. Primes, Big-O, probabilities, and function notation
    s = re.sub(r"\b([fghFGH])''\s*\(\s*([a-zA-Z0-9_]+)\s*\)", r"\1 double prime of \2", s)
    s = re.sub(r"\b([fghFGH])'\s*\(\s*([a-zA-Z0-9_]+)\s*\)", r"\1 prime of \2", s)
    s = re.sub(r"\bO\s*\(\s*([^()]+?)\s*\)", r"big O of \1", s)
    s = re.sub(r"\bP\s*\(\s*([^()|]+?)\s*\|\s*([^()]+?)\s*\)", r"the probability of \1 given \2", s)
    s = re.sub(r"\b([fghFGH])\s*\(\s*([a-zA-Z])\s*\)", r"\1 of \2", s)

    # 9. Greek letters, LaTeX operators, and Unicode math symbols
    # Sort longest keys first so \Leftrightarrow matches before \Leftarrow and \varepsilon before \epsilon
    for k in sorted(_GREEK_SPOKEN.keys(), key=len, reverse=True):
        s = s.replace(k, _GREEK_SPOKEN[k])
    for k, v in _UNICODE_MATH_SPOKEN.items():
        s = s.replace(k, v)

    # 10. Clean remaining LaTeX sizing/spacing commands & backslashes
    s = re.sub(r"\\(?:left|right|big|Big|bigl|bigr|Bigl|Bigr|quad|qquad|displaystyle|textstyle|limits|nolimits|!|,|;|:)\b", " ", s)
    s = re.sub(r"\\([a-zA-Z]+)", r" \1 ", s)
    s = s.replace("$$", " ").replace("$", " ").replace(r"\[", " ").replace(r"\]", " ").replace(r"\(", " ").replace(r"\)", " ")
    s = s.replace("{", " ").replace("}", " ")

    # 11. ASCII multi-character arrows, comparisons, and math operators in prose
    s = re.sub(r"<-->|<->|<=>", " corresponds to ", s)
    s = re.sub(r"-->|->", " leads to ", s)
    s = re.sub(r"==>|=>", " implies ", s)
    s = re.sub(r"<--", " comes from ", s)
    s = re.sub(r"!=", " is not equal to ", s)
    s = re.sub(r"<=", " is less than or equal to ", s)
    s = re.sub(r">=", " is greater than or equal to ", s)
    # Multiplication with * between numbers or variables (before stripping all remaining *)
    s = re.sub(r"(\d|\b[a-zA-Z])\s*\*\s*(\d|\b[a-zA-Z])", r"\1 times \2", s)
    # Plus and minus between math variables/numbers (e.g. t+1 -> t plus 1, x - alpha -> x minus alpha)
    s = re.sub(r"(\d|\b[a-zA-Z])\s*\+\s*(\d|\b[a-zA-Z])", r"\1 plus \2", s)
    s = re.sub(r"(\d|\b[a-zA-Z])\s+-\s+(\d|[a-zA-Z]{1,6}\b)", r"\1 minus \2", s)
    # Equals sign between variables/numbers
    s = re.sub(r"(\b[a-zA-Z0-9])\s*=\s*([+-]?\s*[a-zA-Z0-9])", r"\1 equals \2", s)
    s = s.replace("=", " equals ")

    # 12. Conversational expansion of academic / LLM abbreviations
    s = re.sub(r"\be\.g\.,?\s*", "for example, ", s, flags=re.IGNORECASE)
    s = re.sub(r"\bi\.e\.,?\s*", "that is, ", s, flags=re.IGNORECASE)
    s = re.sub(r"\bw\.r\.t\.?\s*", "with respect to ", s, flags=re.IGNORECASE)
    s = re.sub(r"\bcf\.\s*", "compare ", s, flags=re.IGNORECASE)
    s = re.sub(r"\bvs\.(?=\s|$)|\bvs\b", "versus", s, flags=re.IGNORECASE)
    s = re.sub(r"\betc\.(?!\.)", "and so on.", s, flags=re.IGNORECASE)
    s = re.sub(r"\bEqs?\.\s*\(?(\d+)\)?", r"Equation \1", s)
    s = re.sub(r"\bFigs?\.\s*\(?(\d+)\)?", r"Figure \1", s)
    s = re.sub(r"\bSecs?\.\s*\(?(\d+)\)?", r"Section \1", s)
    s = re.sub(r"\band/or\b", "and or", s, flags=re.IGNORECASE)
    # Word/word slashes (e.g. "intuition/formalism" -> "intuition or formalism") so TTS never says "slash"
    s = re.sub(r"\b([a-zA-Z]{2,})/([a-zA-Z]{2,})\b", r"\1 or \2", s)
    # Numeric fractions like 1/2, 1/3, 1/4, or a/b
    s = re.sub(r"\b1/2\b", "one half", s)
    s = re.sub(r"\b1/3\b", "one third", s)
    s = re.sub(r"\b1/4\b", "one quarter", s)
    s = re.sub(r"\b([0-9]+)/([0-9]+)\b", r"\1 over \2", s)

    # 13. Markdown headings, blockquotes, list bullets, and numbered prefixes
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"(?m)^#{1,6}\s*(.+?)\s*#*$", r"\1.", s)
    s = re.sub(r"(?m)^>\s*", "", s)
    s = re.sub(r"(?m)^\s*[-*+•◦▪▸►]\s+", "", s)
    s = re.sub(r"(?m)^(\s*\d+)\)\s+", r"\1. ", s)
    # Horizontal rules
    s = re.sub(r"(?m)^\s*[-*_]{3,}\s*$", " ", s)

    # 14. Strip emojis, dingbats, box-drawing characters, and decorative symbols
    #     so TTS never reads Unicode emoji descriptions aloud
    s = re.sub(r"[\U00010000-\U0010ffff]", " ", s)
    s = re.sub(r"[\u2500-\u27bf\ufe0f★☆✓✔✗✘•◦▪▸►]", " ", s)

    # 15. Final unconditional guardrail strip of raw symbols that could be spoken as symbol names
    #     ("asterisk", "underscore", "backtick", "tilde", "hash", "caret", "backslash", "vertical bar", "slash")
    for ch in ("*", "_", "`", "~", "#", "^", "\\", "|", "<", ">"):
        s = s.replace(ch, " ")
    s = s.replace("/", " ")
    s = s.replace("[", " ").replace("]", " ")
    s = s.replace(" & ", " and ")

    # 16. Tidy punctuation & whitespace for natural human prosody
    s = re.sub(r"\(\s*\)", " ", s)
    s = re.sub(r"\s+([,.;:?!])", r"\1", s)
    s = re.sub(r"([,.;:]){2,}", lambda m: m.group(0)[0], s)
    s = re.sub(r"\.\s*\.", ".", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{2,}", "\n\n", s).strip()

    if len(s) > max_chars:
        cut = s[:max_chars]
        last_dot = max(cut.rfind(". "), cut.rfind("。"), cut.rfind("! "), cut.rfind("? "))
        if last_dot > max_chars // 2:
            cut = cut[: last_dot + 1]
        s = cut.strip()
    return s



def detect_lang_code(text: str, fallback: str = "en") -> str:
    """Detect whether a snippet contains predominantly CJK (Mandarin), Arabic, or European script."""
    if not text:
        return fallback
    if re.search(r"[\u4e00-\u9fff]", text):
        return "zh-CN"
    if re.search(r"[\u0600-\u06ff]", text):
        return "ar"
    return fallback


def pcm16_to_wav(pcm_bytes: bytes, sample_rate: int = 24000, channels: int = 1) -> bytes:
    """Wrap raw signed 16-bit little-endian PCM bytes in a standard RIFF WAVE header."""
    byte_rate = sample_rate * channels * 2
    block_align = channels * 2
    data_size = len(pcm_bytes)
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        36 + data_size,
        b"WAVE",
        b"fmt ",
        16,
        1,
        channels,
        sample_rate,
        byte_rate,
        block_align,
        16,
        b"data",
        data_size,
    )
    return header + pcm_bytes


# ---------------- Engine 1: Microsoft Azure / Edge Human Neural Voices (`edge-tts`) ----------------

def _resolve_edge_voice(persona: dict[str, Any] | None, text: str, lang: str | None = None) -> tuple[str, str, str]:
    """Select the optimal Microsoft Azure Human Neural voice, rate, and pitch."""
    gender = (persona.get("gender") if persona else "female") or "female"
    rate = (persona.get("edge_rate") if persona else "-2%") or "-2%"
    pitch = (persona.get("edge_pitch") if persona else "+0Hz") or "+0Hz"
    base_voice = (persona.get("edge_voice") if persona else None) or "en-US-AvaMultilingualNeural"

    detected = detect_lang_code(text, fallback=lang or (persona.get("default_lang") if persona else "en") or "en")
    # If text contains Chinese characters and the selected voice is not a Chinese voice, switch to the matching gender Mandarin neural voice
    if detected == "zh-CN" and not base_voice.startswith("zh-"):
        return _LANG_TO_EDGE_VOICE.get(("zh-CN", gender), "zh-CN-XiaoxiaoNeural"), "-3%", "+0Hz"
    # If text contains Arabic script and the selected voice is not an Arabic voice, switch to the matching gender Arabic neural voice
    if detected == "ar" and not base_voice.startswith("ar-"):
        return _LANG_TO_EDGE_VOICE.get(("ar", gender), "ar-EG-SalmaNeural"), "-2%", "+0Hz"
    # If explicit language override is passed (e.g. phrase pronunciation in Language courses)
    if lang and not persona:
        short = lang.split("-")[0].lower()
        mapped = _LANG_TO_EDGE_VOICE.get((lang, gender)) or _LANG_TO_EDGE_VOICE.get((short, gender))
        if mapped:
            return mapped, "-2%", "+0Hz"
    return base_voice, rate, pitch


async def _edge_stream_mp3(text: str, voice: str, rate: str, pitch: str) -> bytes:
    import edge_tts

    last_err = None
    for attempt in range(3):
        try:
            comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            out = io.BytesIO()
            async for chunk in comm.stream():
                if chunk.get("type") == "audio" and chunk.get("data"):
                    out.write(chunk["data"])
            data = out.getvalue()
            if data and len(data) > 200:
                return data
        except Exception as e:
            last_err = e
            await asyncio.sleep(0.25 * (attempt + 1))
    if last_err:
        raise last_err
    return b""


def _run_coro_sync(coro) -> bytes:
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None
    if loop and loop.is_running():
        result: dict[str, Any] = {}

        def _worker():
            try:
                result["data"] = asyncio.run(coro)
            except Exception as exc:
                result["err"] = exc

        t = threading.Thread(target=_worker, daemon=True)
        t.start()
        t.join(timeout=25)
        if "err" in result:
            raise result["err"]
        return result.get("data", b"")
    return asyncio.run(coro)


def synthesize_neural_mp3(text: str, lang: str = "en", persona_id: str | None = None) -> bytes:
    """Generate genuine human-sounding MP3 speech using Microsoft Azure / Edge Natural Neural Voices."""
    cleaned = clean_for_speech(text, max_chars=2600)
    if not cleaned:
        raise ValueError("Empty text")
    persona = get_persona(persona_id) if persona_id else None
    voice, rate, pitch = _resolve_edge_voice(persona, cleaned, lang=lang)
    cache_key = hashlib.sha256(f"edge_neural:v5:{voice}:{rate}:{pitch}:{cleaned}".encode("utf-8")).hexdigest()
    cache_path = os.path.join(CACHE_DIR, f"{cache_key}.mp3")
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 500:
        _touch(cache_path)
        with open(cache_path, "rb") as f:
            return f.read()

    mp3_bytes = _run_coro_sync(_edge_stream_mp3(cleaned, voice, rate, pitch))
    if not mp3_bytes or len(mp3_bytes) < 200:
        raise RuntimeError(f"edge-tts returned empty audio for {voice}")
    with _inflight_lock:
        with open(cache_path, "wb") as f:
            f.write(mp3_bytes)
    return mp3_bytes


# ---------------- Engine 2: Gemini 2.5 Neural Voice Studio ----------------

def synthesize_gemini_wav(text: str, persona_id: str | None = None) -> bytes:
    """Generate 24 kHz WAV audio using Gemini 2.5 Flash TTS with persona vocal direction."""
    from google.genai import types  # lazy import

    persona = get_persona(persona_id)
    cleaned = clean_for_speech(text, max_chars=2200)
    if not cleaned:
        raise ValueError("Empty text for TTS")

    cache_key = hashlib.sha256(f"gemini:v5:{persona['id']}:{cleaned}".encode("utf-8")).hexdigest()
    cache_path = os.path.join(CACHE_DIR, f"{cache_key}.wav")
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 500:
        _touch(cache_path)
        with open(cache_path, "rb") as f:
            return f.read()

    key, _ = llm.resolve_api_key()
    if not key:
        raise RuntimeError("No Gemini API key configured")

    client = llm._client(key)
    prompt = (
        f"Audio Delivery Direction: {persona['direction']}\n"
        f"Read the following text aloud naturally and expressively (do not add any preamble or commentary, "
        f"just read the text itself):\n\n{cleaned}"
    )
    resp = client.models.generate_content(
        model=TTS_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=persona["gemini_voice"]
                    )
                )
            ),
        ),
    )
    part = resp.candidates[0].content.parts[0]
    raw = part.inline_data.data
    mime = (part.inline_data.mime_type or "").lower()
    if raw[:4] == b"RIFF":
        wav_bytes = raw
    else:
        rate = 24000
        m = re.search(r"rate=(\d+)", mime)
        if m:
            rate = int(m.group(1))
        wav_bytes = pcm16_to_wav(raw, sample_rate=rate, channels=1)

    with _inflight_lock:
        with open(cache_path, "wb") as f:
            f.write(wav_bytes)
    return wav_bytes


# ---------------- Backwards-compatible alias for phrase & cloud calls ----------------

def synthesize_cloud_mp3(text: str, lang: str = "en", persona_id: str | None = None) -> bytes:
    """Synthesize natural human MP3 speech via Microsoft Azure Neural Voices (with Google fallback if offline)."""
    try:
        return synthesize_neural_mp3(text, lang=lang, persona_id=persona_id)
    except Exception as e:
        print(f"[TTS] edge_neural fallback: {e}")
        cleaned = clean_for_speech(text, max_chars=400)
        url = (
            "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob"
            f"&tl={urllib.parse.quote(lang or 'en')}&q={urllib.parse.quote(cleaned[:180])}"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read()


def synthesize(
    text: str,
    persona_id: str | None = None,
    engine: str | None = None,
    lang: str | None = None,
) -> tuple[bytes, str, str]:
    """Synthesize human-sounding speech and return `(audio_bytes, mime_type, engine_used)`.

    Uses Microsoft Azure / Edge Natural & DragonHD Multilingual Neural Voices (`neural`) by default
    for instant, ultra-human delivery across all 16 faculty personas without rate-limit bottlenecks.
    """
    global _gemini_tts_cooldown_until
    persona = get_persona(persona_id)
    chosen_engine = (engine or db.get_setting("voice_engine", "neural") or "neural").lower()
    target_lang = lang or persona.get("default_lang") or "en"

    # Only call Gemini TTS if the user explicitly requested "gemini_studio" (otherwise use fast, reliable Azure Neural)
    if chosen_engine == "gemini_studio" and time.time() >= _gemini_tts_cooldown_until:
        try:
            wav = synthesize_gemini_wav(text, persona_id=persona["id"])
            return wav, "audio/wav", "gemini_studio"
        except Exception as e:
            msg = str(e)
            if "429" in msg or "RESOURCE_EXHAUSTED" in msg:
                _gemini_tts_cooldown_until = time.time() + 600.0
            print(f"[TTS] Gemini Studio fallback to Azure Human Neural ({persona['id']}): {msg[:120]}")

    mp3 = synthesize_neural_mp3(text, lang=target_lang, persona_id=persona["id"])
    return mp3, "audio/mpeg", "neural"


def ensure_sample(persona_id: str, force: bool = False) -> tuple[bytes, str]:
    """Return (or generate and save) the human neural audition sample for `persona_id`."""
    persona = get_persona(persona_id)
    sample_mp3 = os.path.join(SAMPLES_DIR, f"{persona['id']}.mp3")
    if not force and os.path.exists(sample_mp3) and os.path.getsize(sample_mp3) > 1000:
        with open(sample_mp3, "rb") as f:
            return f.read(), "audio/mpeg"
    mp3 = synthesize_neural_mp3(persona["sample_text"], lang=persona.get("default_lang", "en"), persona_id=persona["id"])
    with open(sample_mp3, "wb") as f:
        f.write(mp3)
    return mp3, "audio/mpeg"
