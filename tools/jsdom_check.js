#!/usr/bin/env node
/* jsdom-based smoke test for the Self-Taught SPA.
 *
 * Loads the app from a running server (default http://127.0.0.1:8099), executes its scripts (KaTeX/marked/
 * confetti are fetched from the CDN by jsdom's resource loader), lets the router render a sequence of views,
 * and reports uncaught errors / console.error output plus a short text snapshot of each view.
 *
 *   node tools/jsdom_check.js [baseUrl] [#/route ...]
 *
 * Canvas is not implemented in jsdom, so simulation widgets are expected to log "canvas unsupported" style
 * warnings when mounted — those are filtered; everything else counts as an error (exit code 1).
 */
const { JSDOM, VirtualConsole } = require("jsdom");

const base = process.argv[2] && process.argv[2].startsWith("http") ? process.argv[2] : "http://127.0.0.1:8099";
const routes = process.argv.slice(2).filter((a) => a.startsWith("#"));
if (!routes.length) routes.push("#/", "#/catalog", "#/domain/physics", "#/transcript", "#/badges", "#/arcade", "#/feedback", "#/settings", "#/design");

const errors = [];
const logs = [];
const vc = new VirtualConsole();
vc.on("error", (m) => { const s = String(m); logs.push("[error] " + s); if (!/canvas|getContext|not implemented/i.test(s)) errors.push(s); });
vc.on("warn", (m) => logs.push("[warn] " + String(m)));
vc.on("log", (m) => logs.push("[log] " + String(m)));
vc.on("jsdomError", (e) => {
  const s = (e && (e.stack || e.message)) || String(e);
  logs.push("[jsdomError] " + s.split("\n").slice(0, 3).join(" | "));
  if (!/canvas|getContext|not implemented|Could not load (img|link)|Could not parse CSS/i.test(s)) errors.push(s.split("\n").slice(0, 2).join(" | "));
});

(async () => {
  const dom = await JSDOM.fromURL(base + "/", {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window) {
      // jsdom ships no fetch; bridge to Node's, resolving relative URLs against the page.
      window.fetch = (url, init) => fetch(new URL(String(url), base + "/").href, init);
      window.Headers = Headers; window.Request = Request; window.Response = Response;
      window.scrollTo = () => {};
      // jsdom has no canvas: hand sims an inert 2D context (every property is a callable that returns itself).
      const inert = new Proxy(function () {}, {
        get: (t, p) => (p === Symbol.toPrimitive ? () => 0 : p === "then" ? undefined : inert),
        apply: () => inert, set: () => true,
      });
      window.HTMLCanvasElement.prototype.getContext = () => inert;
      window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      if (!window.ResizeObserver) window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
      if (!window.requestAnimationFrame) window.requestAnimationFrame = (fn) => setTimeout(() => fn(Date.now()), 16);
    },
  });
  const { window } = dom;
  window.addEventListener("error", (e) => errors.push("window.onerror: " + (e.message || e.error)));
  window.addEventListener("unhandledrejection", (e) => errors.push("unhandledrejection: " + ((e.reason && (e.reason.stack || e.reason.message)) || e.reason)));

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await sleep(6000); // scripts + bootstrap
  const libs = ["katex", "marked", "confetti", "SelfTaughtSims", "App"].map((k) => `${k}=${typeof window[k]}`).join(" ");
  console.log("libs:", libs);
  if (window.SelfTaughtSims) console.log("sims registered:", window.SelfTaughtSims.list().length);
  const snap = (label) => {
    const main = window.document.querySelector("#content, #view, #main, main") || window.document.body;
    const txt = main.textContent.replace(/\s+/g, " ").trim();
    console.log(`\n== ${label} == (${txt.length} chars)\n   ${txt.slice(0, 300)}`);
  };
  snap("initial " + window.location.hash);
  // steps: "#/route" navigates; "click:<css selector>" clicks the first match; "eval:<js>" evaluates and prints
  for (const r of routes) {
    if (r.startsWith("#click:")) {
      const sel = r.slice(7);
      const el = window.document.querySelector(sel);
      if (!el) { errors.push(`click: no element matches ${sel}`); continue; }
      el.click();
      await sleep(2500);
      snap(`click ${sel}`);
    } else if (r.startsWith("#eval:")) {
      try { console.log(`\n== eval == ${r.slice(6)}\n   -> ${JSON.stringify(window.eval(r.slice(6)))}`); } catch (e) { errors.push(`eval failed: ${e.message}`); }
    } else {
      window.location.hash = r;
      await sleep(3000);
      snap(r);
    }
  }
  console.log(`\nerrors: ${errors.length}`);
  errors.slice(0, 20).forEach((e) => console.log("  !! " + String(e).slice(0, 400)));
  if (process.env.VERBOSE) { console.log("--- console ---"); logs.forEach((l) => console.log("  " + l.slice(0, 300))); }
  window.close();
  process.exit(errors.length ? 1 : 0);
})().catch((e) => { console.error("harness failure:", e); process.exit(2); });
