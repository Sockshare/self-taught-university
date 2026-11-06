/* Self-Taught — Pyodide WebWorker.
 * Runs learner Python off the main UI thread so an infinite loop can never freeze the tab:
 * the page simply terminates this worker and spins up a fresh one.
 *
 * Messages in:  {id, type: "run", code, tests?, packages?}
 * Messages out: {id, type: "status"|"stdout"|"stderr"|"image"|"done", ...}
 */
/* eslint-disable no-restricted-globals */
"use strict";

const LOCAL_INDEX = "/static/vendor/pyodide/";
const CDN_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
// Wheels vendored under static/vendor/pyodide (everything else is fetched from the CDN on demand).
const LOCAL_WHEELS = new Set(["numpy", "sympy", "mpmath"]);

let pyPromise = null;
let lock = null;
let indexURL = LOCAL_INDEX;
let currentId = null;

const post = (msg) => self.postMessage(Object.assign({ id: currentId }, msg));

async function loadRuntime() {
  post({ type: "status", text: "Loading Python runtime (Pyodide)…" });
  try {
    importScripts(LOCAL_INDEX + "pyodide.js");
    indexURL = LOCAL_INDEX;
  } catch (e) {
    importScripts(CDN_INDEX + "pyodide.js");
    indexURL = CDN_INDEX;
  }
  const py = await self.loadPyodide({ indexURL });
  try {
    const res = await fetch(indexURL + "pyodide-lock.json");
    lock = (await res.json()).packages || {};
  } catch (e) { lock = {}; }
  post({ type: "status", text: "Loading numpy…" });
  await loadPackages(py, ["numpy"]);
  py.setStdout({ batched: (s) => post({ type: "stdout", text: s + "\n" }) });
  py.setStderr({ batched: (s) => post({ type: "stderr", text: s + "\n" }) });
  return py;
}

// Resolve a package + its dependency closure; local wheels load by name, the rest by absolute CDN URL.
async function loadPackages(py, names) {
  if (!names || !names.length) return;
  if (indexURL === CDN_INDEX || !lock || !Object.keys(lock).length) {
    await py.loadPackage(names);
    return;
  }
  const seen = new Set();
  const order = [];
  const visit = (n) => {
    const key = String(n).toLowerCase();
    if (seen.has(key) || !lock[key]) return;
    seen.add(key);
    (lock[key].depends || []).forEach(visit);
    order.push(key);
  };
  names.forEach(visit);
  const local = order.filter((n) => LOCAL_WHEELS.has(n));
  const remote = order.filter((n) => !LOCAL_WHEELS.has(n)).map((n) => CDN_INDEX + lock[n].file_name);
  if (local.length) await py.loadPackage(local);
  if (remote.length) {
    try { await py.loadPackage(remote); }
    catch (e) { post({ type: "stderr", text: `Could not load ${names.join(", ")} (offline?): ${e.message}\n` }); }
  }
}

const RUN_TESTS_PY = `
import ast as _ast, traceback as _tb
def _st_run_tests(_src, _ns):
    _results = []
    try:
        _tree = _ast.parse(_src)
    except SyntaxError as _e:
        return [{"ok": False, "label": "tests failed to parse", "msg": str(_e)}]
    for _node in _tree.body:
        _label = _ast.get_source_segment(_src, _node) or "test"
        _mod = _ast.Module(body=[_node], type_ignores=[])
        try:
            exec(compile(_mod, "<tests>", "exec"), _ns)
            if isinstance(_node, _ast.Assert):
                _results.append({"ok": True, "label": _label[:160], "msg": ""})
        except AssertionError as _e:
            _results.append({"ok": False, "label": _label[:160], "msg": str(_e) or "assertion failed"})
        except Exception as _e:
            _results.append({"ok": False, "label": _label[:160], "msg": f"{type(_e).__name__}: {_e}"})
    return _results
`;

const MPL_PRE = "import matplotlib\nmatplotlib.use('AGG')\n";
const MPL_POST = `
import base64 as _b64, io as _io
import matplotlib.pyplot as _plt
_imgs = []
for _n in _plt.get_fignums():
    _f = _plt.figure(_n); _buf = _io.BytesIO(); _f.savefig(_buf, format='png', dpi=110, bbox_inches='tight', facecolor='white'); _imgs.append(_b64.b64encode(_buf.getvalue()).decode())
_plt.close('all')
_imgs`;

async function handleRun(msg) {
  if (!pyPromise) pyPromise = loadRuntime();
  const py = await pyPromise;
  post({ type: "status", text: "Resolving imports…" });
  try {
    const imports = py.pyodide_py.code.find_imports(msg.code + "\n" + (msg.tests || "")).toJs();
    const importToPkg = {};
    Object.entries(lock || {}).forEach(([name, p]) => (p.imports || []).forEach((imp) => { importToPkg[imp] = name; }));
    const needed = imports.map((n) => importToPkg[n] || String(n).toLowerCase()).filter((n) => lock && lock[n]);
    await loadPackages(py, needed);
  } catch (e) { /* non-fatal: the run itself will raise ImportError */ }
  const usesMpl = /matplotlib|pyplot/.test(msg.code);
  const g = py.globals.get("dict")();
  const t0 = performance.now();
  let ok = true;
  let error = null;
  let tests = null;
  post({ type: "status", text: "Running…" });
  try {
    await py.runPythonAsync((usesMpl ? MPL_PRE : "") + msg.code, { globals: g });
    if (usesMpl) {
      const imgs = await py.runPythonAsync(MPL_POST, { globals: g });
      (imgs.toJs ? imgs.toJs() : imgs || []).forEach((b64) => post({ type: "image", b64 }));
    }
  } catch (e) {
    ok = false;
    error = String(e.message || e);
    post({ type: "stderr", text: error + "\n" });
  }
  if (msg.tests && String(msg.tests).trim()) {
    post({ type: "status", text: "Running hidden tests…" });
    try {
      await py.runPythonAsync(RUN_TESTS_PY, { globals: g });
      const fn = g.get("_st_run_tests");
      const res = fn(String(msg.tests), g);
      tests = res.toJs({ dict_converter: Object.fromEntries });
      res.destroy(); fn.destroy();
    } catch (e) {
      tests = [{ ok: false, label: "test harness", msg: String(e.message || e) }];
    }
  }
  try { g.destroy(); } catch (e) { /* ignore */ }
  post({ type: "done", ok, error, tests, seconds: (performance.now() - t0) / 1000 });
}

self.onmessage = async (ev) => {
  const msg = ev.data || {};
  currentId = msg.id;
  if (msg.type === "warmup") {
    try { if (!pyPromise) pyPromise = loadRuntime(); await pyPromise; post({ type: "ready" }); }
    catch (e) { post({ type: "done", ok: false, error: "Python runtime failed to load: " + e.message }); }
    return;
  }
  if (msg.type === "run") {
    try { await handleRun(msg); }
    catch (e) { post({ type: "done", ok: false, error: "Python runtime failed: " + (e.message || e) }); }
  }
};
