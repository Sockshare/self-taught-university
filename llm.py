"""Gemini access layer: key discovery, resilient model fallback chain, JSON helpers and streaming.

Models observed on this key (Oct 2026): the 3.x flash family is frequently 503 (high demand) and the
pro family is quota-limited, so every call walks a preference list and remembers short cool-downs for
models that just failed. ``model="auto"`` (default) uses the chain; a specific model is tried first.
"""
from __future__ import annotations

import json
import os
import re
import queue
import threading
import time
from typing import Any, Iterator

import db

FALLBACK_CHAIN = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
]
# Preferred order for *fast* interactive calls (chat / grading) — lighter models first after the top tier.
# Measured: 3.5-flash-lite answers in ~0.5s; 2.5-flash spends 10s+ "thinking" even for trivial prompts,
# so it sits late in this chain and fast calls also cap the thinking budget (see FAST_THINKING_BUDGET).
FAST_CHAIN = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-latest",
]
# Thinking config for kind="fast" calls. Measured on 3.5-flash-lite with a ~23K-char system prompt: no thinking
# config → 0.6s to first token; thinking_budget=512 → 40s; thinking_budget=0 → HTTP 400. So fast calls send none.
FAST_THINKING_BUDGET: int | None = None
FAST_TIMEOUT_S = 60

# Optional places to pick up a key when GEMINI_API_KEY is not exported:
# a .env file in the project root (gitignored) or ~/.config/self_taught/.env.
KEY_FALLBACK_FILES = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"),
    os.path.expanduser("~/.config/self_taught/.env"),
]

_cooldown: dict[str, float] = {}
_cooldown_lock = threading.Lock()
_client_cache: dict[str, Any] = {}
_last_error: dict[str, str] = {}
COOLDOWN_SECONDS = 240


class LLMUnavailable(RuntimeError):
    pass


def _read_key_from_file(path: str) -> str:
    try:
        if not os.path.exists(path):
            return ""
        if path.endswith(".json"):
            with open(path, "r", encoding="utf-8") as f:
                return str(json.load(f).get("gemini_api_key") or "")
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY") or line.startswith("GOOGLE_API_KEY"):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except Exception:  # noqa: BLE001
        return ""
    return ""


def resolve_api_key() -> tuple[str, str]:
    """Returns (key, source)."""
    key = str(db.get_setting("gemini_api_key") or "").strip()
    if key:
        return key, "settings"
    for env in ("GEMINI_API_KEY", "GOOGLE_API_KEY"):
        if os.environ.get(env):
            return os.environ[env].strip(), f"env:{env}"
    for path in KEY_FALLBACK_FILES:
        k = _read_key_from_file(path)
        if k:
            return k, f"file:{os.path.basename(os.path.dirname(path))}/{os.path.basename(path)}"
    return "", "none"


def available() -> bool:
    return bool(resolve_api_key()[0])


def _client(key: str):
    if key in _client_cache:
        return _client_cache[key]
    from google import genai  # imported lazily so the app runs without the package

    c = genai.Client(api_key=key)
    _client_cache[key] = c
    return c


_cooldowns_loaded = False


def _load_cooldowns() -> None:
    """Restore busy-model cooldowns saved by a previous process so a restart doesn't re-probe known-busy models."""
    global _cooldowns_loaded
    if _cooldowns_loaded:
        return
    _cooldowns_loaded = True
    try:
        saved = db.get_setting("llm_cooldowns", {}) or {}
        now = time.time()
        with _cooldown_lock:
            for m, until in saved.items():
                if float(until) > now:
                    _cooldown[m] = float(until)
    except Exception:  # noqa: BLE001
        pass


def model_chain(kind: str = "long") -> list[str]:
    _load_cooldowns()
    pref = str(db.get_setting("model") or "auto")
    base = FAST_CHAIN if kind == "fast" else FALLBACK_CHAIN
    chain = list(base)
    if pref and pref != "auto":
        chain = [pref] + [m for m in chain if m != pref]
    now = time.time()
    with _cooldown_lock:
        hot = [m for m in chain if _cooldown.get(m, 0) <= now]
        cold = [m for m in chain if _cooldown.get(m, 0) > now]
    return hot + cold  # cold models still get tried last


def _mark_cooldown(model: str, seconds: float = COOLDOWN_SECONDS) -> None:
    with _cooldown_lock:
        _cooldown[model] = time.time() + seconds
        snapshot = {m: t for m, t in _cooldown.items() if t > time.time()}
    try:
        db.set_setting("llm_cooldowns", snapshot)
    except Exception:  # noqa: BLE001
        pass


def _classify(err: Exception) -> str:
    s = str(err)
    if "429" in s or "RESOURCE_EXHAUSTED" in s:
        return "quota"
    if "503" in s or "UNAVAILABLE" in s or "high demand" in s:
        return "busy"
    if "404" in s or "NOT_FOUND" in s or "no longer available" in s:
        return "missing"
    if "400" in s and "API key" in s:
        return "key"
    return "other"


def status() -> dict:
    key, source = resolve_api_key()
    now = time.time()
    with _cooldown_lock:
        cooling = {m: round(t - now) for m, t in _cooldown.items() if t > now}
    return {
        "configured": bool(key),
        "key_source": source,
        "key_hint": (key[:4] + "…" + key[-4:]) if key else "",
        "model_pref": db.get_setting("model") or "auto",
        "chain": model_chain("long"),
        "cooling_down": cooling,
        "last_errors": dict(_last_error),
    }


def _build_config(types, *, temperature: float, max_tokens: int, system: str | None, json_mode: bool,
                  thinking_budget: int | None, timeout_s: float):
    """Returns (config_with_thinking, config_without_thinking). The second is used if a model rejects thinking_config."""
    base: dict[str, Any] = {"temperature": temperature, "max_output_tokens": max_tokens,
                            "http_options": types.HttpOptions(timeout=int(timeout_s * 1000))}
    if system:
        base["system_instruction"] = system
    if json_mode:
        base["response_mime_type"] = "application/json"
    plain = types.GenerateContentConfig(**base)
    if thinking_budget is None:
        return plain, plain
    try:
        return types.GenerateContentConfig(**base, thinking_config=types.ThinkingConfig(thinking_budget=thinking_budget)), plain
    except Exception:  # noqa: BLE001
        return plain, plain


def _is_thinking_rejection(err: Exception) -> bool:
    """A 400 while a thinking_config was attached — the only optional part of our config — so retry without it."""
    s = str(err).lower()
    return "thinking" in s or "400" in s or "invalid_argument" in s or "invalid argument" in s


def generate(prompt: str | list, *, system: str | None = None, json_mode: bool = False, temperature: float = 0.7,
             max_tokens: int = 8192, kind: str = "long", attempts_per_model: int = 1, timeout_s: float | None = None,
             thinking_budget: int | None = None) -> tuple[str, str]:
    """Returns (text, model_used). Walks the fallback chain; raises LLMUnavailable if everything fails."""
    key, _ = resolve_api_key()
    if not key:
        raise LLMUnavailable("No Gemini API key configured. Add one in Settings.")
    from google.genai import types  # lazy

    client = _client(key)
    if kind == "fast":
        if thinking_budget is None:
            thinking_budget = FAST_THINKING_BUDGET
        if timeout_s is None:
            timeout_s = FAST_TIMEOUT_S
    if timeout_s is None:
        timeout_s = 300  # deep lessons on slower models can take ~3 min
    config, config_plain = _build_config(types, temperature=temperature, max_tokens=max_tokens, system=system,
                                         json_mode=json_mode, thinking_budget=thinking_budget, timeout_s=timeout_s)

    errors: list[str] = []
    for model in model_chain(kind):
        cfg = config
        attempt = 0
        while attempt < attempts_per_model:
            try:
                resp = client.models.generate_content(model=model, contents=prompt, config=cfg)
                text = (resp.text or "").strip()
                if not text:
                    fr = ""
                    try:
                        fr = str(resp.candidates[0].finish_reason)
                    except Exception:  # noqa: BLE001
                        pass
                    raise RuntimeError(f"empty response (finish_reason={fr})")
                _last_error.pop(model, None)
                return text, model
            except Exception as e:  # noqa: BLE001
                if cfg is not config_plain and _is_thinking_rejection(e):
                    cfg = config_plain  # this model doesn't accept our thinking budget — retry once without it
                    continue
                attempt += 1
                kind_err = _classify(e)
                msg = f"{model}: {kind_err}: {str(e)[:160]}"
                errors.append(msg)
                _last_error[model] = msg
                if kind_err in ("busy", "quota", "missing"):
                    _mark_cooldown(model, COOLDOWN_SECONDS if kind_err != "missing" else 3600)
                    break  # next model
                if kind_err == "key":
                    raise LLMUnavailable("Gemini rejected the API key. Check Settings → API key.") from e
                if attempt < attempts_per_model:
                    time.sleep(1.0)
        continue
    raise LLMUnavailable("All Gemini models are busy or unavailable right now. " + " | ".join(errors[-3:]))


def generate_json(prompt: str | list, *, system: str | None = None, temperature: float = 0.6, max_tokens: int = 16384,
                  kind: str = "long", repair: bool = True) -> tuple[Any, str]:
    text, model = generate(prompt, system=system, json_mode=True, temperature=temperature, max_tokens=max_tokens, kind=kind)
    try:
        return parse_json(text), model
    except ValueError:
        if not repair:
            raise
        # one repair attempt: ask the model to fix its own JSON (fast chain, lower tokens)
        fix_prompt = ("The following was supposed to be a single valid JSON document but is malformed or truncated. "
                      "Return ONLY the corrected, complete JSON (close any open strings/arrays/objects, drop a trailing "
                      "partial element if necessary):\n\n" + text[-60000:])
        fixed, model2 = generate(fix_prompt, json_mode=True, temperature=0.1, max_tokens=max_tokens, kind="fast")
        return parse_json(fixed), model2


# LaTeX commands whose first letter collides with a valid JSON escape (\b \f \n \r \t). Long, unambiguous names
# are repaired anywhere; prose like "\nThe" or "\tand" is never touched because those words are not in the list.
_LATEX_LONG = (
    "frac|dfrac|tfrac|forall|flat|theta|vartheta|tau|times|text|textbf|textit|textrm|texttt|tilde|widetilde|triangle|"
    "therefore|tanh|nabla|neq|neg|newline|notin|nmid|nparallel|rho|varrho|right|rightarrow|Rightarrow|rangle|rceil|"
    "rfloor|beta|bar|overline|begin|binom|bmod|boldsymbol|bigl|bigr|bigg|biggl|biggr|bigcup|bigcap|bigoplus|bullet|"
    "backslash|blacksquare|hbar|rightleftharpoons|leftrightarrow|mathbf|mathrm|mathbb|mathcal|operatorname"
)
_ODD_BS = r'(?<!\\)((?:\\\\)*)\\'          # an unescaped backslash (preceded by an even run of backslashes)
_LATEX_CMD = re.compile(_ODD_BS + r'(?=(?:' + _LATEX_LONG + r')(?![a-zA-Z]))')
_MATH_SPAN = re.compile(r'\$\$[^$"]{1,600}?\$\$|\$[^$"\n]{1,300}?\$|\\\\?\([^"]{1,300}?\\\\?\)|\\\\?\[[^"]{1,600}?\\\\?\]')
_MATH_CMD = re.compile(_ODD_BS + r'(?=[a-zA-Z]{2,})')
_BAD_ESCAPE = re.compile(_ODD_BS + r'(?!["\\/bfnrt]|u[0-9a-fA-F]{4})')


def _fix_escapes(t: str) -> str:
    """Double raw LaTeX backslashes in model JSON so \\frac, \\theta, \\upsilon survive json.loads intact."""
    t = _MATH_SPAN.sub(lambda m: _MATH_CMD.sub(lambda k: k.group(1) + "\\\\", m.group(0)), t)  # any \cmd inside $…$
    t = _LATEX_CMD.sub(lambda m: m.group(1) + "\\\\", t)
    return _BAD_ESCAPE.sub(lambda m: m.group(1) + "\\\\", t)


def parse_json(text: str) -> Any:
    t = text.strip()
    if t.startswith("```"):
        t = re.sub(r"^```(?:json)?\s*", "", t)
        t = re.sub(r"\s*```$", "", t)
    # Repair raw LaTeX first: \frac / \theta / \nabla are *valid* JSON escapes (\f \t \n) and would otherwise
    # parse "successfully" into form-feed/tab/newline garbage.
    fixed = _fix_escapes(t)
    for cand in (fixed, t):
        try:
            return json.loads(cand)
        except json.JSONDecodeError:
            pass
    t = fixed
    # trailing commas
    t2 = re.sub(r",\s*([}\]])", r"\1", t)
    try:
        return json.loads(t2)
    except json.JSONDecodeError as e:
        last_err = e
    # salvage: from the first { or [ to one of the last few closing brackets (bounded, so it stays fast)
    start = min([i for i in (t2.find("{"), t2.find("[")) if i >= 0], default=-1)
    if start >= 0:
        tried = 0
        for end in range(len(t2) - 1, start, -1):
            if t2[end] in "}]":
                try:
                    return json.loads(t2[start:end + 1])
                except json.JSONDecodeError:
                    tried += 1
                    if tried >= 25:
                        break
    raise ValueError(f"model returned invalid JSON: {last_err}") from last_err


FIRST_TOKEN_DEADLINE_S = 8.0  # fast streams: abandon a model that has produced nothing by then and fall back


class _FirstTokenTimeout(RuntimeError):
    pass


def _stream_model(client, model: str, contents, cfg, first_token_s: float | None) -> Iterator[str]:
    """Runs one streaming call in a worker thread so we can enforce a first-token deadline."""
    q: queue.Queue = queue.Queue()

    def worker():
        try:
            for ch in client.models.generate_content_stream(model=model, contents=contents, config=cfg):
                q.put(("chunk", getattr(ch, "text", None)))
            q.put(("end", None))
        except Exception as e:  # noqa: BLE001
            q.put(("err", e))

    threading.Thread(target=worker, daemon=True).start()
    deadline = (time.time() + first_token_s) if first_token_s else None
    produced = False
    while True:
        wait = None if (produced or deadline is None) else max(0.05, deadline - time.time())
        try:
            kind, val = q.get(timeout=wait)
        except queue.Empty:
            raise _FirstTokenTimeout(f"{model}: silent for {first_token_s:.0f}s")  # worker keeps running harmlessly
        if kind == "chunk":
            if val:
                produced = True
                yield val
        elif kind == "end":
            return
        else:
            raise val


def stream(prompt: str | list, *, system: str | None = None, temperature: float = 0.7, max_tokens: int = 4096,
           kind: str = "fast", thinking_budget: int | None = None, timeout_s: float = 120,
           first_token_s: float | None = None) -> Iterator[tuple[str, str]]:
    """Yields (chunk_text, model). Falls back across models only before the first chunk is produced."""
    key, _ = resolve_api_key()
    if not key:
        raise LLMUnavailable("No Gemini API key configured. Add one in Settings.")
    from google.genai import types

    client = _client(key)
    if kind == "fast" and thinking_budget is None:
        thinking_budget = FAST_THINKING_BUDGET  # None → no thinking block; see note at the top of the file
    if first_token_s is None and kind == "fast":
        first_token_s = FIRST_TOKEN_DEADLINE_S
    config, config_plain = _build_config(types, temperature=temperature, max_tokens=max_tokens, system=system,
                                         json_mode=False, thinking_budget=thinking_budget, timeout_s=timeout_s)
    errors: list[str] = []
    for model in model_chain(kind):
        cfg = config
        while True:
            produced = False
            try:
                for txt in _stream_model(client, model, prompt, cfg, first_token_s):
                    produced = True
                    yield txt, model
                if produced:
                    return
                raise RuntimeError("empty stream")
            except _FirstTokenTimeout as e:
                errors.append(str(e))
                _last_error[model] = str(e)
                _mark_cooldown(model, 120)  # probably overloaded; let the next model answer for a while
                break
            except Exception as e:  # noqa: BLE001
                if produced:
                    raise
                if cfg is not config_plain and _is_thinking_rejection(e):
                    cfg = config_plain
                    continue
                k = _classify(e)
                errors.append(f"{model}: {k}: {str(e)[:120]}")
                _last_error[model] = errors[-1]
                if k in ("busy", "quota", "missing"):
                    _mark_cooldown(model)
                if k == "key":
                    raise LLMUnavailable("Gemini rejected the API key. Check Settings → API key.") from e
                break  # next model
    raise LLMUnavailable("All Gemini models are busy or unavailable right now. " + " | ".join(errors[-3:]))


def test_connection() -> dict:
    """Quick probe used by the Settings page."""
    key, source = resolve_api_key()
    if not key:
        return {"ok": False, "message": "No API key configured.", "source": source}
    t0 = time.time()
    try:
        text, model = generate("Reply with exactly: READY", temperature=0.0, max_tokens=16, kind="fast")
        return {"ok": True, "model": model, "latency_s": round(time.time() - t0, 2), "source": source, "reply": text[:40]}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "message": str(e)[:400], "source": source}
