#!/usr/bin/env bash
# Headless smoke test for simulation widgets.
# Loads tools/sim_harness.html in headless Chrome for every registered sim id and prints the harness log
# (registration count, mount errors, runtime errors). Usage: tools/smoke_sims.sh [sim_id ...]
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}"
if [ -z "${CHROME}" ]; then echo "no chrome found"; exit 2; fi
IDS=("$@")
if [ ${#IDS[@]} -eq 0 ]; then
  # discover registered sim ids by evaluating core.js + sim files in node
  mapfile -t IDS < <(node -e '
    global.window = {};
    require(process.argv[1] + "/../static/sims/core.js");
    for (const f of ["physics","chemistry","math","ai","robotics","philosophy","languages","arcade_expansion","new_domains_arcade","psychology_a","psychology_b"]) {
      try { require(process.argv[1] + "/../static/sims/" + f + ".js"); } catch (e) {}
    }
    console.log(window.SelfTaughtSims.list().map(s => s.id).join("\n"));
  ' "$HERE")
fi
PROFILE="/tmp/st_smoke_profile_$$"
trap 'rm -rf "$PROFILE"' EXIT
fail=0
for id in "${IDS[@]}"; do
  out=$("$CHROME" --headless=new --disable-gpu --no-sandbox --disable-extensions --user-data-dir="$PROFILE" --virtual-time-budget=2500 --run-all-compositor-stages-before-draw \
        --dump-dom "file://$HERE/sim_harness.html#$id" 2>/dev/null | python3 -c '
import sys, re, html
dom = sys.stdin.read()
m = re.search(r"<div id=\"log\">(.*?)</div>", dom, re.S)
txt = html.unescape(m.group(1)) if m else "(no log div)"
print(txt.strip())
')
  if echo "$out" | grep -q "\[error\]\|crashed"; then echo "FAIL $id"; echo "$out" | sed 's/^/    /'; fail=1; else echo "ok   $id"; fi
done
exit $fail
