#!/usr/bin/env bash
# Self-Taught University — one-command launcher.
#
#   ./run.sh                     start on http://127.0.0.1:8088
#   SELF_TAUGHT_PORT=9000 ./run.sh
#   ./run.sh --no-browser
#
# Creates a local .venv on first run (uv if available, else python -m venv) and
# installs requirements.txt into it.  Nothing is installed into system Python.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${SELF_TAUGHT_PORT:-8088}"
OPEN_BROWSER=1
[[ "${1:-}" == "--no-browser" ]] && { OPEN_BROWSER=0; shift; }
cd "$HERE"

# Load a project-root .env if present (GEMINI_API_KEY etc.)
if [[ -f .env ]]; then set -a; . ./.env; set +a; fi

PY="${PYTHON:-python3}"
command -v "$PY" >/dev/null 2>&1 || { echo "[!] python3 not found (need 3.10+)." >&2; exit 1; }

if [[ ! -x .venv/bin/python ]]; then
  echo "[*] Creating virtual environment (.venv)..."
  if command -v uv >/dev/null 2>&1; then uv venv -q .venv
  elif ! "$PY" -m venv .venv 2>/dev/null; then
    echo "[!] 'python3 -m venv' failed. Debian/Ubuntu: sudo apt install python3-venv  (or install uv)." >&2; exit 1
  fi
fi

if [[ ! -f .venv/.deps-installed ]] || [[ requirements.txt -nt .venv/.deps-installed ]]; then
  echo "[*] Installing dependencies..."
  if command -v uv >/dev/null 2>&1; then uv pip install -q -p .venv/bin/python -r requirements.txt
  else .venv/bin/python -m pip install -q --upgrade pip && .venv/bin/python -m pip install -q -r requirements.txt; fi
  touch .venv/.deps-installed
fi

if command -v lsof >/dev/null 2>&1 && lsof -t -i:"${PORT}" >/dev/null 2>&1; then
  echo "[*] Port ${PORT} busy — stopping previous instance..."
  lsof -t -i:"${PORT}" | xargs -r kill 2>/dev/null || true; sleep 1
fi

echo "[*] Self-Taught University → http://127.0.0.1:${PORT}   (Ctrl+C to stop)"
[[ -z "${GEMINI_API_KEY:-}" ]] && echo "    No GEMINI_API_KEY set — add one in Settings inside the app to generate lessons."
if [[ "$OPEN_BROWSER" == "1" ]] && command -v xdg-open >/dev/null 2>&1; then
  (sleep 2 && xdg-open "http://127.0.0.1:${PORT}" >/dev/null 2>&1 &) || true
fi
exec .venv/bin/python server.py "$@"
