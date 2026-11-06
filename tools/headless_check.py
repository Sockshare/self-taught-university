#!/usr/bin/env python3
"""Headless-Chrome page checker that works even when Chrome's own network stack is sandboxed.

Chrome is driven over the DevTools protocol; *every* network request the page makes is paused via
`Fetch.requestPaused` and fulfilled from Python (urllib), so the page loads normally even if Chrome
itself cannot open sockets. Console output and uncaught exceptions are collected and printed.

Usage:
    python3 tools/headless_check.py URL [--wait 8] [--eval JS] [--eval JS ...] [--chrome /usr/bin/google-chrome]
                                    [--click SELECTOR] [--hash '#/catalog'] [--json]

Exit code is 1 if any uncaught exception / console.error was recorded, else 0.
"""
from __future__ import annotations

import argparse
import asyncio
import base64
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

try:
    import websockets  # type: ignore
except ImportError:  # pragma: no cover
    print("python3 -m pip install websockets", file=sys.stderr)
    sys.exit(2)


def _free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def _fetch(url: str, method: str, headers: dict, body: bytes | None) -> tuple[int, list[dict], bytes]:
    hdrs = {k: v for k, v in headers.items() if k.lower() not in ("host", "content-length", "accept-encoding")}
    hdrs["Accept-Encoding"] = "identity"
    req = urllib.request.Request(url, data=body, method=method, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read()
            out_headers = [{"name": k, "value": v} for k, v in resp.getheaders()
                           if k.lower() not in ("transfer-encoding", "content-encoding", "content-length", "connection")]
            return resp.status, out_headers, raw
    except urllib.error.HTTPError as e:
        raw = e.read()
        out_headers = [{"name": k, "value": v} for k, v in e.headers.items()
                       if k.lower() not in ("transfer-encoding", "content-encoding", "content-length", "connection")]
        return e.code, out_headers, raw
    except Exception as e:  # noqa: BLE001
        return 599, [{"name": "Content-Type", "value": "text/plain"}], f"proxy error: {e}".encode()


class CDP:
    def __init__(self, ws):
        self.ws = ws
        self._id = 0
        self._pending: dict[int, asyncio.Future] = {}
        self.events: asyncio.Queue = asyncio.Queue()
        self.session_id: str | None = None
        self._reader = asyncio.create_task(self._read_loop())

    async def _read_loop(self):
        try:
            async for raw in self.ws:
                msg = json.loads(raw)
                if "id" in msg and msg["id"] in self._pending:
                    self._pending.pop(msg["id"]).set_result(msg)
                elif "method" in msg:
                    await self.events.put(msg)
        except Exception:  # noqa: BLE001
            pass

    async def send(self, method: str, params: dict | None = None, session: bool = True) -> dict:
        self._id += 1
        msg = {"id": self._id, "method": method, "params": params or {}}
        if session and self.session_id:
            msg["sessionId"] = self.session_id
        fut = asyncio.get_event_loop().create_future()
        self._pending[self._id] = fut
        await self.ws.send(json.dumps(msg))
        res = await asyncio.wait_for(fut, 60)
        if "error" in res:
            raise RuntimeError(f"{method}: {res['error']}")
        return res.get("result", {})


async def run(args) -> int:
    port = _free_port()
    profile = tempfile.mkdtemp(prefix="st_cdp_")
    chrome = subprocess.Popen([
        args.chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-extensions", "--no-first-run",
        "--no-default-browser-check", "--disable-background-networking", "--disable-component-update",
        f"--user-data-dir={profile}", f"--remote-debugging-port={port}", "--window-size=1400,1000", "about:blank",
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    logs: list[str] = []
    errors: list[str] = []
    requests_served: list[tuple[int, str]] = []
    try:
        ws_url = None
        for _ in range(100):
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=2) as r:
                    ws_url = json.load(r)["webSocketDebuggerUrl"]
                    break
            except Exception:  # noqa: BLE001
                await asyncio.sleep(0.2)
        if not ws_url:
            print("could not reach Chrome devtools endpoint", file=sys.stderr)
            return 2
        async with websockets.connect(ws_url, max_size=64 * 1024 * 1024) as ws:
            cdp = CDP(ws)
            target = await cdp.send("Target.createTarget", {"url": "about:blank"}, session=False)
            att = await cdp.send("Target.attachToTarget", {"targetId": target["targetId"], "flatten": True}, session=False)
            cdp.session_id = att["sessionId"]
            await cdp.send("Fetch.enable", {"patterns": [{"urlPattern": "*", "requestStage": "Request"}]})
            await cdp.send("Runtime.enable")
            await cdp.send("Log.enable")
            await cdp.send("Page.enable")

            async def serve(p: dict):
                req = p["request"]
                url = req["url"]
                if url.startswith("data:"):
                    await cdp.send("Fetch.continueRequest", {"requestId": p["requestId"]})
                    return
                body = base64.b64decode(req["postData"]) if req.get("postData") else None
                if req.get("hasPostData") and not body and req.get("postDataEntries"):
                    body = b"".join(base64.b64decode(e.get("bytes", "")) for e in req["postDataEntries"])
                status, headers, raw = await asyncio.get_event_loop().run_in_executor(
                    None, _fetch, url, req.get("method", "GET"), req.get("headers", {}), body)
                requests_served.append((status, url))
                try:
                    await cdp.send("Fetch.fulfillRequest", {
                        "requestId": p["requestId"], "responseCode": status, "responseHeaders": headers,
                        "body": base64.b64encode(raw).decode()})
                except Exception as e:  # noqa: BLE001
                    logs.append(f"[fulfill-failed] {url}: {e}")

            async def pump_forever():
                while True:
                    ev = await cdp.events.get()
                    m, p = ev.get("method"), ev.get("params", {})
                    if m == "Fetch.requestPaused":
                        asyncio.create_task(serve(p))  # serve concurrently; never block the pump
                    elif m == "Runtime.consoleAPICalled":
                        text = " ".join(str(a.get("value", a.get("description", ""))) for a in p.get("args", []))
                        line = f"[console.{p.get('type')}] {text}"
                        logs.append(line)
                        if p.get("type") == "error":
                            errors.append(line)
                    elif m == "Runtime.exceptionThrown":
                        d = p.get("exceptionDetails", {})
                        desc = (d.get("exception") or {}).get("description") or d.get("text")
                        line = f"[exception] {desc} @ {d.get('url')}:{d.get('lineNumber')}"
                        logs.append(line)
                        errors.append(line)
                    elif m == "Log.entryAdded":
                        e = p.get("entry", {})
                        line = f"[log.{e.get('level')}] {e.get('text')} {e.get('url') or ''}"
                        logs.append(line)
                        if e.get("level") == "error" and "favicon" not in line:
                            errors.append(line)

            pump_task = asyncio.create_task(pump_forever())

            async def step_eval(expr: str, timeout: float = 20.0):
                try:
                    return await asyncio.wait_for(
                        cdp.send("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True}), timeout)
                except asyncio.TimeoutError:
                    return {"exceptionDetails": {"text": f"evaluate timed out after {timeout}s (main thread busy?)"}}
                except Exception as e:  # noqa: BLE001
                    return {"exceptionDetails": {"text": str(e)}}

            # Page.navigate does not resolve until the (intercepted) document request is fulfilled,
            # so it runs concurrently with the pump; we simply wait for the page to settle.
            nav_task = asyncio.create_task(cdp.send("Page.navigate", {"url": args.url}))
            await asyncio.sleep(args.wait)
            if not nav_task.done():
                errors.append("[navigate] Page.navigate did not complete (document request stuck?)")
                nav_task.cancel()
            else:
                try:
                    nav_task.result()
                except Exception as e:  # noqa: BLE001
                    errors.append(f"[navigate] {e}")
            results = []
            for step in args.steps:
                kind, val = step
                if kind == "hash":
                    r = await step_eval(f"location.hash = {json.dumps(val)}")
                    if "exceptionDetails" in r:
                        results.append({"eval": f"hash {val}", "error": r["exceptionDetails"].get("text")})
                    await asyncio.sleep(args.step_wait)
                elif kind == "click":
                    r = await step_eval(f"(function(){{const el=document.querySelector({json.dumps(val)}); if(!el) throw new Error('no element '+{json.dumps(val)}); el.click();}})()")
                    if "exceptionDetails" in r:
                        results.append({"eval": f"click {val}", "error": (r["exceptionDetails"].get("exception") or {}).get("description") or r["exceptionDetails"].get("text")})
                    await asyncio.sleep(args.step_wait)
                elif kind == "eval":
                    r = await step_eval(val)
                    if "exceptionDetails" in r:
                        results.append({"eval": val, "error": (r["exceptionDetails"].get("exception") or {}).get("description") or r["exceptionDetails"].get("text")})
                    else:
                        results.append({"eval": val, "value": r.get("result", {}).get("value")})
                    await asyncio.sleep(0.3)
            await asyncio.sleep(0.5)
            if args.screenshot:
                try:
                    shot = await asyncio.wait_for(cdp.send("Page.captureScreenshot", {"format": "png"}), 20)
                    with open(args.screenshot, "wb") as f:
                        f.write(base64.b64decode(shot["data"]))
                except Exception as e:  # noqa: BLE001
                    logs.append(f"[screenshot-failed] {e}")
            pump_task.cancel()
            try:
                await asyncio.wait_for(cdp.send("Target.closeTarget", {"targetId": target["targetId"]}, session=False), 5)
            except Exception:  # noqa: BLE001
                pass
    finally:
        chrome.terminate()
        try:
            chrome.wait(5)
        except Exception:  # noqa: BLE001
            chrome.kill()
        shutil.rmtree(profile, ignore_errors=True)

    bad = [(s, u) for s, u in requests_served if s >= 400]
    report = {"url": args.url, "requests": len(requests_served), "failed_requests": bad, "errors": errors,
              "console": logs if args.verbose else logs[-40:], "results": results}
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"URL: {args.url}\nrequests served: {len(requests_served)}  (failed: {len(bad)})")
        for s, u in bad[:20]:
            print(f"  !! {s} {u}")
        for r in results:
            print(f"EVAL {r['eval'][:80]!s}\n  -> {json.dumps(r.get('value', r.get('error')))[:2000]}")
        print(f"errors: {len(errors)}")
        for e in errors[:30]:
            print("  " + e[:400])
        if args.verbose:
            print("--- console ---")
            for l in logs:
                print("  " + l[:300])
    return 1 if errors else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--wait", type=float, default=8.0, help="seconds to let the page settle after navigation")
    ap.add_argument("--step-wait", type=float, default=3.0)
    ap.add_argument("--chrome", default=shutil.which("google-chrome") or "/usr/bin/google-chrome")
    ap.add_argument("--eval", dest="steps", action="append", type=lambda v: ("eval", v), default=[])
    ap.add_argument("--hash", dest="steps", action="append", type=lambda v: ("hash", v))
    ap.add_argument("--click", dest="steps", action="append", type=lambda v: ("click", v))
    ap.add_argument("--screenshot", default="")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--verbose", "-v", action="store_true")
    args = ap.parse_args()
    args.steps = args.steps or []
    sys.exit(asyncio.run(run(args)))


if __name__ == "__main__":
    main()
