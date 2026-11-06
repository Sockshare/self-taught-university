/* Self-Taught — 12 Advanced University Features:
 * 1. #/graph      — Interactive Force-Directed Prerequisite & Cross-Domain Knowledge Galaxy
 * 2. #/exams      — Timed Midterm, Final & Qualifying Exam Simulator
 * 3. #/notebook   — Personal LaTeX + Code Zettelkasten with [[Backlinks]]
 * 4. #/autopsy    — Mistake Autopsy & Error-Taxonomy Journal + Micro-Drills
 * 5. #/capstones  — Cross-Domain Capstone Projects (Multi-Faculty Synthesis)
 * 6. #/ingest     — Paper / PDF / Syllabus / Repo Ingestion Pipeline
 * 7. #/nexus      — Run Nexus Live Tool Bridge
 * Plus Lesson Studio Extensions (App.Advanced):
 * 8. 🎙️ Viva Voce Oral Defense + Live WebAudio Pitch (F0) & Formant Analyzer
 * 9. 🪲 Feynman Student Mode (Teach-Back to an AI Novice)
 * 10. 🎧 2-Host Commute Podcast Generator (Alternating Female & Male Faculty Voices)
 * 11. 📎 One-Click Zettelkasten Clipper
 * 12. 🔬 Fault-Injection Lab Reward Hook
 */
(function () {
  "use strict";
  const { h, $, $$, api, fmt, esc } = App;
  const V = App.views;

  function applyRewards(res) {
    if (!res) return;
    if (App.rewards) App.rewards(res);
  }

  // =========================================================================
  // LIVE WEBAUDIO PITCH (F0) & FORMANT SPECTRUM ANALYZER WIDGET
  // + PRONUNCIATION COACH: native TTS reference F0 contour overlaid on the learner's attempt
  // =========================================================================
  function autoCorrelatePitch(buf, sampleRate, rmsGate) {
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / size);
    if (rms < (rmsGate || 0.012)) return -1;
    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++) { if (Math.abs(buf[i]) < thres) { r1 = i; break; } }
    for (let i = 1; i < size / 2; i++) { if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; } }
    buf = buf.slice(r1, r2);
    size = buf.length;
    const c = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) c[i] = c[i] + buf[j] * buf[j + i];
    }
    let d = 0;
    while (d < size - 1 && c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    }
    if (maxpos <= 0) return -1;
    return sampleRate / maxpos;
  }

  // Decode native-speaker TTS audio and extract its F0 contour (16 kHz, 40 ms frames, 20 ms hop).
  async function referenceContour(text, lang) {
    const res = await fetch(`/api/tts/phrase?lang=${encodeURIComponent(lang || "en")}&text=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error("Could not synthesize the native reference");
    const raw = await res.arrayBuffer();
    const blobUrl = URL.createObjectURL(new Blob([raw.slice(0)], { type: res.headers.get("Content-Type") || "audio/mpeg" }));
    const tmp = new (window.AudioContext || window.webkitAudioContext)();
    const decoded = await tmp.decodeAudioData(raw);
    try { tmp.close(); } catch (e) { /* ignore */ }
    const SR = 16000;
    const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * SR), SR);
    const src = off.createBufferSource();
    src.buffer = decoded; src.connect(off.destination); src.start();
    const rendered = await off.startRendering();
    const data = rendered.getChannelData(0);
    const frame = 640, hop = 320, out = [];
    for (let i = 0; i + frame <= data.length; i += hop) {
      const f0 = autoCorrelatePitch(data.subarray(i, i + frame), SR, 0.01);
      out.push(f0 > 65 && f0 < 520 ? f0 : null);
    }
    return { contour: out, duration: decoded.duration, url: blobUrl };
  }

  // Compare two F0 contours independent of speaker register: semitones relative to each median, resampled.
  function contourSimilarity(ref, att) {
    const norm = (arr) => {
      const voiced = arr.filter((v) => v != null);
      if (voiced.length < 4) return null;
      const med = voiced.slice().sort((a, b) => a - b)[Math.floor(voiced.length / 2)];
      const N = 60, out = [];
      for (let k = 0; k < N; k++) {
        const pos = (k / (N - 1)) * (arr.length - 1);
        let v = null;
        for (let r = 0; r < arr.length && v == null; r++) {
          const a = arr[Math.round(pos) - r], b = arr[Math.round(pos) + r];
          v = a != null ? a : b != null ? b : null;
        }
        out.push(12 * Math.log2((v || med) / med));
      }
      return out;
    };
    const a = norm(ref), b = norm(att);
    if (!a || !b) return null;
    const mean = (x) => x.reduce((s, v) => s + v, 0) / x.length;
    const ma = mean(a), mb = mean(b);
    let num = 0, da = 0, db = 0, mad = 0;
    for (let i = 0; i < a.length; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; mad += Math.abs((a[i] - ma) - (b[i] - mb)); }
    const r = da && db ? num / Math.sqrt(da * db) : 0;
    return { r, score: Math.round(Math.max(0, r) * 100), semitoneError: mad / a.length };
  }

  function createMicPitchAnalyzer(opts) {
    opts = opts || {};
    let audioCtx = null, analyser = null, mediaStream = null, rafId = 0, running = false;
    const pitchHistory = [];
    let reference = null;          // {contour, duration, url}
    let recording = null;          // {frames: [], until}
    let lastAttempt = null;
    const canvas = h("canvas", { width: 640, height: 150, style: "width:100%;height:150px;background:#0b0e1a;border-radius:10px;border:1px solid rgba(255,255,255,.08)" });
    const readout = h("div", { class: "small muted", style: "font-family:monospace" }, "Mic idle · Click 🎙️ Start Live Pitch & Formant Monitor to visualize your voice F0 (Hz) & harmonics.");
    const toggleBtn = h("button", { class: "btn sm secondary", onclick: () => (running ? stop() : start()) }, "🎙️ Start Live Pitch & Formant Monitor");

    const yFor = (p, H) => H - 15 - ((p - 70) / 380) * (H - 35);
    function drawContour(ctx, arr, color, W, H, width, dashed) {
      ctx.strokeStyle = color; ctx.lineWidth = width || 2.5;
      ctx.setLineDash(dashed ? [6, 4] : []);
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        if (p == null) { started = false; continue; }
        const x = (i / Math.max(1, arr.length - 1)) * W;
        if (!started) { ctx.moveTo(x, yFor(p, H)); started = true; } else ctx.lineTo(x, yFor(p, H));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    function drawIdle() {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0b0e1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      for (let y = 30; y < canvas.height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      if (reference) drawContour(ctx, reference.contour, "#67e8f9", canvas.width, canvas.height, 3, true);
      if (lastAttempt) drawContour(ctx, lastAttempt, "#ffd166", canvas.width, canvas.height, 2.5);
      ctx.fillStyle = "#9aa3c7";
      ctx.font = "12px sans-serif";
      ctx.fillText(reference ? "Native reference F0 (cyan, dashed) vs. your attempt (gold)" : "Real-Time Vocal Pitch Contour F0 (80–400 Hz) + Formant Spectrum (F1 / F2)", 16, 24);
    }
    drawIdle();

    async function start() {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = audioCtx.createMediaStreamSource(mediaStream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        src.connect(analyser);
        running = true;
        toggleBtn.textContent = "⏹ Stop Mic Monitor";
        const timeBuf = new Float32Array(analyser.fftSize);
        const freqBuf = new Uint8Array(analyser.frequencyBinCount);
        let lastFrameAt = 0;

        function tick(ts) {
          if (!running) return;
          analyser.getFloatTimeDomainData(timeBuf);
          analyser.getByteFrequencyData(freqBuf);
          const f0 = autoCorrelatePitch(timeBuf, audioCtx.sampleRate);
          const val = f0 > 65 && f0 < 520 ? f0 : null;
          pitchHistory.push(val);
          if (pitchHistory.length > 160) pitchHistory.shift();
          if (recording && ts - lastFrameAt >= 18) {
            lastFrameAt = ts;
            recording.frames.push(val);
            if (performance.now() >= recording.until) finishRecording();
          }

          // Estimate F1 (300-900 Hz) & F2 (900-2600 Hz) spectral peaks
          const binHz = audioCtx.sampleRate / analyser.fftSize;
          let f1Bin = Math.round(300 / binHz), f1Max = 0;
          for (let b = Math.round(250 / binHz); b <= Math.round(900 / binHz); b++) {
            if (freqBuf[b] > f1Max) { f1Max = freqBuf[b]; f1Bin = b; }
          }
          let f2Bin = Math.round(1500 / binHz), f2Max = 0;
          for (let b = Math.round(920 / binHz); b <= Math.round(2700 / binHz); b++) {
            if (freqBuf[b] > f2Max) { f2Max = freqBuf[b]; f2Bin = b; }
          }
          const f1Hz = Math.round(f1Bin * binHz), f2Hz = Math.round(f2Bin * binHz);

          const ctx = canvas.getContext("2d");
          const W = canvas.width, H = canvas.height;
          ctx.fillStyle = "#0b0e1a";
          ctx.fillRect(0, 0, W, H);
          // Draw FFT bars in background
          for (let i = 0; i < 96; i++) {
            const mag = freqBuf[i] / 255.0;
            ctx.fillStyle = "rgba(124,156,255,0.22)";
            ctx.fillRect(i * (W / 96), H - mag * (H - 25), (W / 96) - 1, mag * (H - 25));
          }
          if (recording && reference) {
            drawContour(ctx, reference.contour, "#67e8f9", W, H, 3, true);
            const prog = recording.frames.concat(new Array(Math.max(0, recording.expected - recording.frames.length)).fill(null));
            drawContour(ctx, prog, "#ffd166", W, H, 2.5);
          } else {
            if (reference) drawContour(ctx, reference.contour, "rgba(103,232,249,.45)", W, H, 2, true);
            // Draw F0 pitch contour (rolling window)
            ctx.strokeStyle = "#ffd166";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < pitchHistory.length; i++) {
              const p = pitchHistory[i];
              if (p == null) { started = false; continue; }
              const x = (i / 160) * W;
              if (!started) { ctx.moveTo(x, yFor(p, H)); started = true; } else ctx.lineTo(x, yFor(p, H));
            }
            ctx.stroke();
          }

          readout.textContent = recording ? "🔴 Recording your attempt — say the phrase now…" : (f0 > 0
            ? `Live F0 Pitch: ${f0.toFixed(1)} Hz · Formant Peaks: F1 ≈ ${f1Hz} Hz, F2 ≈ ${f2Hz} Hz`
            : `Listening... speak into your microphone (Formants F1 ≈ ${f1Hz} Hz, F2 ≈ ${f2Hz} Hz)`);
          rafId = requestAnimationFrame(tick);
        }
        rafId = requestAnimationFrame(tick);
        return true;
      } catch (e) {
        readout.textContent = "Microphone access unavailable in this browser context (" + e.message + ").";
        return false;
      }
    }

    function stop() {
      running = false;
      recording = null;
      if (rafId) cancelAnimationFrame(rafId);
      if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
      if (audioCtx) { try { audioCtx.close(); } catch (e) {} }
      toggleBtn.textContent = "🎙️ Start Live Pitch & Formant Monitor";
      readout.textContent = "Mic monitor stopped.";
      drawIdle();
    }

    // ---- pronunciation coach controls
    const scoreBox = h("div", { class: "small" });
    const phraseIn = h("input", { class: "input", style: "flex:1;min-width:200px", placeholder: "Phrase in the target language (e.g. 你好 / Guten Morgen / مرحبا)", value: opts.phrase || "" });
    const langSel = h("select", { class: "input", style: "width:auto" }, [["zh-CN", "Mandarin"], ["de", "German"], ["fr", "French"], ["it", "Italian"], ["ar", "Arabic"], ["en", "English"]].map(([v, l]) => h("option", { value: v, selected: v === (opts.lang || "zh-CN") }, l)));
    const playRefBtn = h("button", { class: "btn sm ghost", disabled: true, onclick: () => { if (reference) new Audio(reference.url).play().catch(() => {}); } }, "▶ Hear native");
    const loadBtn = h("button", { class: "btn sm secondary", onclick: async () => {
      const text = phraseIn.value.trim();
      if (!text) { App.toast("Type a phrase first.", "info"); return; }
      loadBtn.disabled = true; loadBtn.textContent = "Analyzing native audio…";
      try {
        reference = await referenceContour(text, langSel.value);
        lastAttempt = null; scoreBox.innerHTML = "";
        playRefBtn.disabled = false; recBtn.disabled = false;
        drawIdle();
        new Audio(reference.url).play().catch(() => {});
        readout.textContent = `Native reference loaded (${reference.duration.toFixed(1)}s, ${reference.contour.filter((v) => v != null).length} voiced frames). Now press 🎙️ Record my attempt.`;
      } catch (e) { App.toast(e.message, "err"); }
      finally { loadBtn.disabled = false; loadBtn.textContent = "🎯 Load native reference"; }
    } }, "🎯 Load native reference");
    const recBtn = h("button", { class: "btn sm violet", disabled: true, onclick: async () => {
      if (!reference) return;
      if (!running && !(await start())) return;
      const frames = Math.max(20, Math.round((reference.duration * 1000 + 600) / 20));
      recording = { frames: [], expected: frames, until: performance.now() + reference.duration * 1000 + 600 };
      recBtn.disabled = true;
    } }, "🎙️ Record my attempt");
    function finishRecording() {
      const att = recording.frames;
      recording = null;
      recBtn.disabled = false;
      // resample attempt onto the reference timeline so both contours share the x-axis
      const n = reference.contour.length;
      lastAttempt = Array.from({ length: n }, (_, i) => att[Math.min(att.length - 1, Math.round((i / Math.max(1, n - 1)) * (att.length - 1)))]);
      const sim = contourSimilarity(reference.contour, lastAttempt);
      scoreBox.innerHTML = "";
      if (!sim) scoreBox.append(h("div", { class: "result bad" }, "Not enough voiced audio detected — speak a little louder and closer to the mic."));
      else scoreBox.append(h("div", { class: "result " + (sim.score >= 75 ? "ok" : sim.score >= 45 ? "part" : "bad") },
        h("b", null, `Intonation match: ${sim.score}%`),
        h("div", { class: "tiny mt4" }, `Contour correlation r = ${sim.r.toFixed(2)} · mean deviation ≈ ${sim.semitoneError.toFixed(1)} semitones (speaker register is normalized).`),
        h("div", { class: "tiny mt4 muted" }, sim.score >= 75 ? "Excellent — your pitch movement mirrors the native speaker." : "Compare the gold line to the cyan reference: where does your pitch rise or fall at the wrong moment? Hear the native audio and try again.")));
      stop();  // freeze the canvas on the reference-vs-attempt overlay
      readout.textContent = "Attempt captured — compare the contours above, then record again whenever you like.";
    }
    const coach = opts.coach ? h("div", { class: "col", style: "gap:8px;border-top:1px dashed rgba(255,255,255,.1);padding-top:8px" },
      h("b", { class: "small" }, "🎯 Pronunciation Coach — overlay your intonation on a native reference"),
      h("div", { class: "row wrap", style: "gap:6px" }, phraseIn, langSel, loadBtn, playRefBtn, recBtn),
      h("div", { class: "pitch-legend" }, h("span", null, h("i", { style: "background:#67e8f9" }), "native reference"), h("span", null, h("i", { style: "background:#ffd166" }), "you")),
      scoreBox) : null;

    const wrap = h("div", { class: "card col", style: "gap:8px;padding:12px;background:rgba(124,156,255,.05)" },
      h("div", { class: "row between wrap" },
        h("b", { class: "small" }, "🗣️ Real-Time Acoustic Pitch (F0) & Formant Spectrum Analyzer"),
        toggleBtn),
      canvas,
      readout,
      coach);
    wrap.destroy = stop;
    wrap.loadPhrase = (text, lang) => { phraseIn.value = text; if (lang) langSel.value = lang; loadBtn.click(); };
    return wrap;
  }

  function openPronunciationCoach(text, lang) {
    const coach = createMicPitchAnalyzer({ coach: true, phrase: text, lang });
    const m = App.modal([h("div", { class: "row between" }, h("h3", { style: "margin:0" }, "🎯 Pronunciation Coach"), h("button", { class: "btn sm ghost", onclick: () => { coach.destroy(); m.close(); } }, "✕")), coach], { onClose: () => coach.destroy() });
    m.box.style.maxWidth = "780px";
    if (text) setTimeout(() => coach.loadPhrase(text, lang), 50);
  }

  // =========================================================================
  // LESSON EXTENSIONS: VIVA VOCE, FEYNMAN TEACH-BACK, 2-HOST PODCAST, CLIPPER
  // =========================================================================
  App.Advanced = {
    createMicPitchAnalyzer,
    openPronunciationCoach,

    // 1. Viva Voce Panel (Two-Way Oral Defense)
    renderVivaVoceTab(lessonId, ctx, L) {
      const box = h("div", { class: "col", style: "gap:14px" });
      const isLang = ctx.domain.id === "languages";
      const sid = (ctx.subject && ctx.subject.id) || "";
      const coachLang = sid.includes("mandarin") || sid.includes("chinese") ? "zh-CN" : sid.includes("german") ? "de" : sid.includes("italian") ? "it" : sid.includes("french") ? "fr" : sid.includes("arabic") ? "ar" : "en";
      const micAnalyzer = createMicPitchAnalyzer({ coach: isLang, lang: coachLang });
      const stageBox = h("div", { class: "col", style: "gap:12px" }, h("div", { class: "muted" }, "Loading Viva Voce examination committee..."));

      box.append(
        h("div", { class: "card col", style: "gap:8px;border-color:rgba(124,156,255,.4)" },
          h("div", { class: "row between wrap" },
            h("div", null,
              h("h3", { style: "margin:0" }, "🎙️ Viva Voce — Two-Way Oral Defense"),
              h("div", { class: "small muted" }, "Defend your understanding out loud (via Web Speech recognition) or in writing. The Professor evaluates your rigor and responds aloud.")),
            h("span", { class: "pill primary" }, "+45 XP · Viva Laureate Badge")),
        ),
        micAnalyzer,
        stageBox
      );

      let vivaSessionId = null;
      api("/viva_voce/start", { body: { lesson_id: lessonId } }).then((data) => {
        stageBox.innerHTML = "";
        if (data.opening_statement) {
          stageBox.append(h("div", { class: "card row between wrap", style: "gap:10px;background:rgba(232,121,249,.08)" },
            h("div", null, h("b", null, "Examiner Opening: "), h("span", null, data.opening_statement)),
            h("button", { class: "btn sm secondary", onclick: () => App.TTS && App.TTS.speakText(data.opening_statement, { label: "Viva Voce Examiner" }) }, "🔊 Hear Examiner")));
        }
        (data.questions || []).forEach((q, idx) => {
          const input = h("textarea", { rows: 3, class: "input", placeholder: "Click 🎤 Dictate Answer to speak aloud, or type your oral defense here..." });
          const recStatus = h("span", { class: "tiny muted" }, "");
          const feedbackBox = h("div", { class: "mt8" });
          const thread = h("div", { class: "col", style: "gap:8px" });
          const history = [];
          let round = 1;
          let currentPrompt = q.question;

          const dictateBtn = h("button", {
            class: "btn sm secondary",
            onclick: () => {
              const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SR) {
                App.toast("Browser SpeechRecognition API not available; type your response below.", "info");
                input.focus();
                return;
              }
              const rec = new SR();
              rec.lang = ctx.domain.id === "languages" ? "en-US" : "en-US";
              rec.interimResults = true;
              recStatus.textContent = "🔴 Listening... speak now";
              rec.onresult = (ev) => {
                let txt = "";
                for (let i = 0; i < ev.results.length; i++) txt += ev.results[i][0].transcript;
                input.value = txt;
              };
              rec.onerror = () => { recStatus.textContent = "Speech input ended."; };
              rec.onend = () => { recStatus.textContent = "✓ Dictation captured."; };
              rec.start();
            },
          }, "🎤 Dictate Answer");

          const submitBtn = h("button", {
            class: "btn sm violet",
            onclick: async () => {
              if (!input.value.trim()) { App.toast("Speak or type your defense first", "warn"); return; }
              submitBtn.disabled = true; submitBtn.textContent = "Evaluating defense...";
              const answer = input.value.trim();
              let finished = false;
              try {
                const r = await api("/viva_voce/respond", { body: { lesson_id: lessonId, question: q.question, question_id: q.id || `v${idx + 1}`, key_points: q.key_points, transcript: answer, history, round, session_id: vivaSessionId, opening: data.opening_statement } });
                applyRewards(r);
                vivaSessionId = r.session_id || vivaSessionId;
                const ev = r.evaluation;
                history.push({ role: "scholar", text: answer });
                thread.append(h("div", { class: "card small", style: "background:rgba(124,156,255,.06)" }, h("b", null, `🧑‍🎓 You (round ${round}): `), answer));
                input.value = "";
                feedbackBox.innerHTML = "";
                const say = ev.follow_up ? `${ev.spoken_feedback} ${ev.follow_up}` : ev.spoken_feedback;
                history.push({ role: "examiner", text: say });
                thread.append(h("div", { class: "card col", style: `gap:8px;border-color:${ev.resolved ? "rgba(110,231,183,.4)" : "rgba(255,209,102,.45)"}` },
                  h("div", { class: "row between wrap" },
                    h("b", null, ev.resolved ? `Verdict: ${ev.verdict} (${Math.round((ev.score || 0) * 100)}%)` : `Examiner pushes back · running score ${Math.round((ev.score || 0) * 100)}%`),
                    h("button", { class: "btn sm secondary", onclick: () => App.TTS && App.TTS.speakText(say, { label: "Viva Voce Examiner" }) }, "🔊 Hear Examiner Reply")),
                  App.prose(ev.spoken_feedback),
                  ev.follow_up ? h("div", { class: "card", style: "background:rgba(255,209,102,.08);border-color:rgba(255,209,102,.35)" }, h("b", null, "🎓 Follow-up question: "), App.prose(ev.follow_up, "inline")) : null,
                  (ev.strengths && ev.strengths.length) ? h("div", { class: "tiny ok" }, "✓ Strengths: " + ev.strengths.join(" · ")) : null,
                  (ev.gaps && ev.gaps.length) ? h("div", { class: "tiny warn" }, "△ To sharpen: " + ev.gaps.join(" · ")) : null));
                if (App.TTS) App.TTS.speakText(say, { label: "Viva Voce Examiner" });
                if (ev.resolved) {
                  finished = true;
                  input.style.display = "none"; dictateBtn.style.display = "none";
                  submitBtn.textContent = "✓ Defense complete"; submitBtn.disabled = true;
                } else {
                  round += 1; currentPrompt = ev.follow_up;
                  input.placeholder = "Answer the examiner's follow-up…";
                }
              } catch (e) {
                App.toast(e.message, "danger");
              } finally {
                if (!finished) { submitBtn.disabled = false; submitBtn.textContent = round > 1 ? `⚖️ Answer Follow-up (round ${round}/3)` : "⚖️ Defend Answer"; }
              }
            },
          }, "⚖️ Defend Answer");

          stageBox.append(h("div", { class: "card col", style: "gap:8px" },
            h("div", { class: "row between wrap" },
              h("span", { class: "pill primary" }, `Question ${idx + 1} · ${q.stage}`),
              h("button", { class: "btn sm ghost", onclick: () => App.TTS && App.TTS.speakText(q.question, { label: `Viva Question ${idx + 1}` }) }, "🔊 Read Question Aloud")),
            h("b", null, q.question),
            thread,
            input,
            h("div", { class: "row wrap", style: "gap:8px;align-items:center" }, dictateBtn, submitBtn, recStatus),
            feedbackBox));
        });
      }).catch((e) => { stageBox.textContent = "Error loading Viva Voce: " + e.message; });

      return box;
    },

    // 2. Feynman Student Mode (Teach-Back to an AI Novice)
    renderFeynmanTab(lessonId, ctx, L) {
      const box = h("div", { class: "col", style: "gap:14px" });
      const inner = h("div", { class: "card col", style: "gap:12px" }, h("div", { class: "muted" }, "Summoning Alex (your confused undergraduate tutee)..."));
      box.append(
        h("div", { class: "card row between wrap", style: "border-color:rgba(255,209,102,.4)" },
          h("div", null,
            h("h3", { style: "margin:0" }, "🪲 Feynman Student Mode — Teach an AI Novice"),
            h("div", { class: "small muted" }, "“If you can't explain it simply, you don't understand it well enough.” Catch Alex's subtle misconception and teach the concept clearly.")),
          h("span", { class: "pill warn" }, "+50 XP · Feynman Pedagogue Badge")),
        inner
      );

      function loadPrompt() {
        inner.innerHTML = "<div class='muted'>Alex is formulating a question...</div>";
        api("/feynman/start", { body: { lesson_id: lessonId } }).then((st) => {
          inner.innerHTML = "";
          const input = h("textarea", { rows: 5, class: "input", placeholder: "Explain to Alex where their intuition went wrong, using plain language, a concrete analogy, and the correct governing principle..." });
          const resultBox = h("div", { class: "mt8 col", style: "gap:10px" });
          const history = [];
          let round = 1;
          let sessionId = null;
          const submitBtn = h("button", {
            class: "btn violet",
            onclick: async () => {
              if (!input.value.trim()) { App.toast("Write your explanation to Alex first", "warn"); return; }
              submitBtn.disabled = true; submitBtn.textContent = "Evaluating your teaching...";
              const explanation = input.value.trim();
              let finished = false;
              try {
                const r = await api("/feynman/evaluate", { body: { lesson_id: lessonId, misconception: st.misconception_statement, hidden_flaw: st.hidden_flaw, explanation, history, round, session_id: sessionId } });
                applyRewards(r);
                sessionId = r.session_id || sessionId;
                const ev = r.evaluation;
                history.push({ role: "scholar", text: explanation });
                history.push({ role: "alex", text: [ev.student_reply, ev.follow_up_question].filter(Boolean).join(" ") });
                input.value = "";
                resultBox.append(h("div", { class: "card small", style: "background:rgba(124,156,255,.06)" }, h("b", null, `🧑‍🏫 You (round ${round}): `), explanation));
                if (!ev.resolved) {
                  round += 1;
                  resultBox.append(h("div", { class: "card col", style: "gap:8px;border-color:rgba(255,209,102,.45)" },
                    h("div", { class: "row wrap", style: "gap:8px" }, h("span", { class: "pill warn" }, `Alex is still puzzled · running ${Math.round((ev.score || 0) * 100)}%`)),
                    h("div", null, h("b", null, "🧑🎓 Alex: "), App.prose(ev.student_reply)),
                    ev.follow_up_question ? h("div", { class: "card", style: "background:rgba(255,209,102,.08)" }, h("b", null, "❓ Follow-up: "), App.prose(ev.follow_up_question, "inline")) : null));
                  input.placeholder = "Answer Alex's follow-up question…";
                  return;
                }
                finished = true;
                input.style.display = "none";
                resultBox.append(h("div", { class: "card col", style: "gap:10px;border-color:rgba(110,231,183,.45)" },
                  h("div", { class: "row wrap", style: "gap:8px" },
                    h("span", { class: "pill ok" }, `Overall: ${Math.round((ev.score || 0) * 100)}%`),
                    h("span", { class: "pill primary" }, `Clarity: ${ev.clarity_score}%`),
                    h("span", { class: "pill primary" }, `Accuracy: ${ev.accuracy_score}%`),
                    h("span", { class: "pill warn" }, `Intuition: ${ev.intuition_score}%`)),
                  h("div", { class: "card", style: "background:rgba(255,255,255,.03)" }, h("b", null, "🧑🎓 Alex's Response: "), App.prose(ev.student_reply)),
                  h("div", null, h("b", null, "🦉 Professor's Pedagogical Note: "), App.prose(ev.professor_critique))));
              } catch (e) {
                App.toast(e.message, "danger");
              } finally {
                submitBtn.disabled = finished;
                submitBtn.textContent = finished ? "✓ Alex understands!" : (round > 1 ? `🎓 Answer Alex (round ${round}/3)` : "🎓 Teach Alex & Grade My Explanation");
              }
            },
          }, "🎓 Teach Alex & Grade My Explanation");

          inner.append(
            h("div", { class: "row between wrap" },
              h("b", null, `🧑🎓 ${st.student_name || "Alex (Confused Undergrad)"} asks:`),
              h("button", { class: "btn sm ghost", onclick: loadPrompt }, "↻ New Misconception")),
            h("div", { class: "card", style: "background:rgba(255,209,102,.07);border-color:rgba(255,209,102,.3)" }, App.prose(st.misconception_statement)),
            h("div", { class: "tiny muted" }, "Target concepts to weave in: " + (st.target_concepts || []).join(" · ")),
            input,
            h("div", { class: "row" }, submitBtn),
            resultBox
          );
        }).catch((e) => { inner.textContent = "Error: " + e.message; });
      }
      loadPrompt();
      return box;
    },

    // 3. Commute 2-Host Podcast Modal
    async openPodcastModal(lessonId, ctx, L) {
      const body = h("div", { class: "col", style: "gap:10px" }, h("div", { class: "muted" }, "Generating 2-Host Faculty Roundtable (Dr. Claire Evans & Prof. Arthur Pendleton)..."));
      const m = App.modal([
        h("div", { class: "row between wrap" },
          h("h2", { style: "margin:0" }, "🎧 2-Host Commute Podcast"),
          h("button", { class: "btn sm ghost", onclick: () => { if (App.TTS) App.TTS.stop(); m.close(); } }, "✕ Close")),
        body,
      ]);
      const load = async (regenerate) => {
      body.innerHTML = "";
      body.append(h("div", { class: "muted" }, regenerate ? "Recording a brand-new episode…" : "Loading episode…"));
      try {
        const pod = await api(`/podcast/${lessonId}`, { body: { regenerate: !!regenerate } });
        body.innerHTML = "";
        const turns = pod.turns || [];
        const playAllBtn = h("button", {
          class: "btn violet",
          onclick: () => {
            if (!App.TTS || !turns.length) return;
            App.TTS.readQueue(turns.map((t, i) => ({
              id: `pod-turn-${i}`,
              label: `${t.speaker} (Turn ${i + 1}/${turns.length})`,
              text: t.text,
              persona: t.persona || (i % 2 === 0 ? "claire_evans" : "arthur_pendleton"),
            })));
          },
        }, "▶ Play Dual-Voice Roundtable (Claire & Arthur)");
        body.append(
          h("div", { class: "row between wrap", style: "gap:8px" },
            h("div", null, h("b", null, pod.title || "Faculty Roundtable"), pod.cached ? h("span", { class: "pill ok", style: "margin-left:8px" }, "💾 saved episode") : (pod.session_id ? h("span", { class: "pill primary", style: "margin-left:8px" }, "✨ new · saved") : null)),
            h("div", { class: "row", style: "gap:6px" }, playAllBtn, h("button", { class: "btn sm ghost", onclick: () => App.TTS && App.TTS.stop() }, "⏹ Stop"),
              h("button", { class: "btn sm ghost", title: "Generate a fresh episode (the old one stays in your library)", onclick: () => { if (App.TTS) App.TTS.stop(); load(true); } }, "↻ New episode"))),
          h("div", { class: "col", style: "gap:8px;max-height:380px;overflow:auto" },
            turns.map((t, i) => h("div", { class: "card", style: "padding:10px" },
              h("div", { class: "row between" },
                h("b", { class: "small", style: `color:${t.persona === "arthur_pendleton" ? "#67e8f9" : "#e879f9"}` }, `${t.persona === "arthur_pendleton" ? "👨‍🏫" : "👩‍🏫"} ${t.speaker}`),
                h("button", { class: "btn sm ghost", onclick: () => App.TTS && App.TTS.speakText(t.text, { persona: t.persona, label: t.speaker }) }, "🔊 Play")),
              h("div", { class: "small mt4" }, t.text))))
        );
      } catch (e) {
        body.textContent = "Failed to generate podcast: " + e.message;
      }
      };
      load(false);
    },

    // 4. Quick Clip to Zettelkasten Modal
    openClipModal(lessonId, ctx, L) {
      const defaultTitle = `${ctx.course.code}: ${L.title}`;
      const defaultBody = `From **[[${ctx.course.code} ${ctx.course.title}]]** › *${L.title}*:\n\n${L.summary || (L.objectives || []).map((o) => "- " + o).join("\n")}\n\nRelated: [[${ctx.domain.name}]]`;
      const titleIn = h("input", { class: "input", value: defaultTitle });
      const tagsIn = h("input", { class: "input", value: `${ctx.domain.id}, ${ctx.course.id}` });
      const bodyIn = h("textarea", { rows: 8, class: "input", value: defaultBody });
      const m = App.modal([
        h("h2", { style: "margin:0" }, "📓 Clip to Scholar's Zettelkasten"),
        h("div", { class: "small muted" }, "Use [[Wiki Links]] to connect concepts across courses and faculties."),
        h("label", { class: "field" }, "Note Title", titleIn),
        h("label", { class: "field" }, "Tags (comma-separated)", tagsIn),
        h("label", { class: "field" }, "Markdown + LaTeX ($...$) + [[Backlinks]]", bodyIn),
        h("div", { class: "row between mt12" },
          h("button", { class: "btn ghost", onclick: () => m.close() }, "Cancel"),
          h("button", {
            class: "btn violet",
            onclick: async () => {
              const r = await api("/notebook", {
                body: {
                  title: titleIn.value,
                  body: bodyIn.value,
                  tags: tagsIn.value.split(",").map((x) => x.trim()).filter(Boolean),
                  lesson_id: lessonId,
                  course_id: ctx.course.id,
                },
              });
              applyRewards(r);
              App.toast("Saved to Scholar's Zettelkasten!", "info");
              m.close();
            },
          }, "💾 Save Note (+8 XP)")),
      ]);
    },
  };

  // =========================================================================
  // VIEW 1: #/graph — INTERACTIVE KNOWLEDGE GALAXY
  // =========================================================================
  V.graph = async function (root) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Knowledge Graph" }]);
    const data = await api("/graph");
    const domSelect = h("select", { class: "input", style: "width:auto" },
      h("option", { value: "all" }, "All 19 Faculties"),
      data.nodes.filter((n) => n.kind === "domain").map((d) => h("option", { value: d.domain_id }, `${d.icon} ${d.label}`)));
    const searchIn = h("input", { class: "input", placeholder: "Filter courses or concepts...", style: "max-width:260px" });
    const infoCard = h("div", { class: "card", style: "min-height:76px" },
      h("b", null, "🪐 Click any node in the Knowledge Galaxy"),
      h("div", { class: "small muted mt4" }, "Solid lines show course prerequisites; dashed golden arcs show cross-faculty conceptual bridges (shared mathematical/simulation models). Drag nodes or pan/zoom the canvas."));

    const canvas = h("canvas", { width: 1080, height: 620, style: "width:100%;height:600px;background:#090c18;border-radius:14px;border:1px solid rgba(255,255,255,.08);cursor:grab" });
    root.append(
      h("div", { class: "row between wrap mb12" },
        h("div", null,
          h("h1", { class: "page", style: "margin:0" }, "🕸️ Prerequisite & Cross-Domain Knowledge Galaxy"),
          h("p", { class: "lead", style: "margin:4px 0 0" }, `${data.nodes.length} nodes & ${data.edges.length} prerequisite + interdisciplinary bridge connections.`)),
        h("div", { class: "row wrap", style: "gap:8px" }, domSelect, searchIn)),
      infoCard,
      h("div", { class: "mt12" }, canvas)
    );

    // Initialize 2D radial layout by domain
    const domains = data.nodes.filter((n) => n.kind === "domain");
    const domAngle = {};
    domains.forEach((d, i) => { domAngle[d.domain_id] = (2 * Math.PI * i) / Math.max(1, domains.length); });
    const nodeMap = new Map();
    data.nodes.forEach((n, idx) => {
      const ang = domAngle[n.domain_id] || 0;
      if (n.kind === "domain") {
        n.x = 540 + Math.cos(ang) * 195;
        n.y = 310 + Math.sin(ang) * 180;
        n.r = 14;
      } else {
        const lvlOffset = ((n.level || 100) - 100) / 400;
        const spread = ((idx % 17) - 8) * 0.042;
        const rad = 85 + lvlOffset * 205 + (idx % 5) * 8;
        n.x = 540 + Math.cos(ang + spread) * rad;
        n.y = 310 + Math.sin(ang + spread) * rad;
        n.r = 5.5 + (n.credits || 3) * 0.5;
      }
      nodeMap.set(n.id, n);
    });

    let camX = 0, camY = 0, zoom = 1.0, dragging = null, panStart = null, selectedNode = null;
    function visible(n) {
      if (domSelect.value !== "all" && n.domain_id !== domSelect.value) return false;
      const q = searchIn.value.trim().toLowerCase();
      if (q && !(n.label.toLowerCase().includes(q) || (n.code || "").toLowerCase().includes(q))) return false;
      return true;
    }

    function draw() {
      const ctx = canvas.getContext("2d");
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = "#090c18";
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2 + camX, H / 2 + camY);
      ctx.scale(zoom, zoom);
      ctx.translate(-W / 2, -H / 2);

      // Draw edges
      data.edges.forEach((e) => {
        const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
        if (!a || !b || !visible(a) || !visible(b)) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        if (e.kind === "bridge") {
          ctx.strokeStyle = "rgba(255,209,102,0.26)";
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.2;
        } else if (e.kind === "prerequisite") {
          ctx.strokeStyle = "rgba(124,156,255,0.38)";
          ctx.setLineDash([]);
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.setLineDash([]);
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw nodes
      data.nodes.forEach((n) => {
        if (!visible(n)) return;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.completed ? "#6ee7b7" : (n.color || "#7c9cff");
        ctx.fill();
        if (n === selectedNode || n.kind === "domain") {
          ctx.lineWidth = n === selectedNode ? 3 : 1.5;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
        }
        if (n.kind === "domain" || zoom > 1.35 || n === selectedNode) {
          ctx.fillStyle = "#e8ebff";
          ctx.font = n.kind === "domain" ? "bold 11px sans-serif" : "10px sans-serif";
          ctx.fillText(n.kind === "domain" ? `${n.icon} ${n.label.split(",")[0]}` : n.code, n.x + n.r + 4, n.y + 3);
        }
      });
      ctx.restore();
    }

    function toWorld(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      const sx = (clientX - r.left) * (canvas.width / r.width);
      const sy = (clientY - r.top) * (canvas.height / r.height);
      return {
        x: (sx - canvas.width / 2 - camX) / zoom + canvas.width / 2,
        y: (sy - canvas.height / 2 - camY) / zoom + canvas.height / 2,
      };
    }

    canvas.addEventListener("mousedown", (e) => {
      const p = toWorld(e.clientX, e.clientY);
      const hit = data.nodes.find((n) => visible(n) && Math.hypot(n.x - p.x, n.y - p.y) <= n.r + 5);
      if (hit) {
        dragging = hit;
        selectedNode = hit;
        infoCard.innerHTML = "";
        if (hit.kind === "domain") {
          infoCard.append(
            h("div", { class: "row between wrap" },
              h("div", null, h("b", null, `${hit.icon} ${hit.label}`), h("div", { class: "small muted" }, `${hit.courses} courses · ${hit.lessons} lessons`)),
              h("a", { class: "btn sm violet", href: `#/domain/${hit.domain_id}` }, "Open Faculty →")));
        } else {
          infoCard.append(
            h("div", { class: "row between wrap" },
              h("div", null, h("b", null, `${hit.icon} ${hit.code} · ${hit.label}`), h("div", { class: "small muted" }, `Level ${hit.level} · ${hit.credits} credits · ${hit.subject_name} · ${Math.round((hit.pct || 0) * 100)}% complete`)),
              h("div", { class: "row", style: "gap:8px" },
                h("a", { class: "btn sm secondary", href: `#/exams?course=${hit.id}` }, "⏱️ Take Course Exam"),
                h("a", { class: "btn sm violet", href: `#/course/${hit.id}` }, "Open Course →"))));
        }
        draw();
      } else {
        panStart = { x: e.clientX - camX, y: e.clientY - camY };
      }
    });
    window.addEventListener("mousemove", (e) => {
      if (dragging) {
        const p = toWorld(e.clientX, e.clientY);
        dragging.x = p.x; dragging.y = p.y;
        draw();
      } else if (panStart) {
        camX = e.clientX - panStart.x;
        camY = e.clientY - panStart.y;
        draw();
      }
    });
    window.addEventListener("mouseup", () => { dragging = null; panStart = null; });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      zoom = Math.max(0.5, Math.min(3.0, zoom * (e.deltaY < 0 ? 1.12 : 0.9)));
      draw();
    }, { passive: false });
    domSelect.addEventListener("change", draw);
    searchIn.addEventListener("input", draw);
    draw();
  };

  // =========================================================================
  // VIEW 2: #/exams — TIMED MIDTERM, FINAL & QUALIFYING EXAM SIMULATOR
  // =========================================================================
  V.exams = async function (root, seg, query) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Exam Hall" }]);
    const hist = await api("/exams/history");
    const courses = hist.courses || [];
    const preCourse = (query && query.course) || (courses[0] && courses[0].id) || "";
    const autoTestOut = !!(query && query.testout);
    const degreeId = (query && query.degree) || "";
    const courseSel = h("select", { class: "input", style: "min-width:300px" },
      courses.map((c) => h("option", { value: c.id, selected: c.id === preCourse }, `${c.code} · ${c.title} (Level ${c.level})`)));

    const arena = h("div", { class: "col mt16", style: "gap:14px" });
    let timerId = 0;

    async function startExam(testOut) {
      testOut = testOut === true;
      clearInterval(timerId);
      arena.innerHTML = testOut
        ? "<div class='card muted'>Generating comprehensive Credit-by-Examination paper (12 questions, whole course)...</div>"
        : "<div class='card muted'>Generating closed-notes examination paper...</div>";
      let ex;
      try {
        ex = await api("/exams/generate", { body: degreeId ? { degree_id: degreeId } : { course_id: courseSel.value, test_out: testOut } });
      } catch (e) {
        arena.innerHTML = "";
        arena.append(h("div", { class: "card", style: "border-color:#ff6b6b" }, "⚠️ " + (e.message || "Could not generate the exam.")));
        return;
      }
      if (ex && ex.fallback) App.toast("⚠️ " + (ex.notice || "AI examiner unavailable — showing a generic practice paper."), "warn", 7000);
      const durationSec = (ex.duration_minutes || 25) * 60;
      let remaining = durationSec;
      const answers = {};
      const timerBadge = h("span", { class: "pill warn", style: "font-size:15px;font-family:monospace" }, "25:00");
      const qCards = h("div", { class: "col", style: "gap:12px" });

      (ex.questions || []).forEach((q, idx) => {
        let inputEl;
        if (q.type === "mcq") {
          inputEl = h("div", { class: "col", style: "gap:6px" },
            (q.choices || []).map((ch, ci) => h("label", { class: "row", style: "gap:8px;cursor:pointer" },
              h("input", { type: "radio", name: "ex_" + q.id, onchange: () => { answers[q.id] = ci; } }),
              h("span", null, ch))));
        } else if (q.type === "numeric") {
          inputEl = h("input", { type: "number", step: "any", class: "input", placeholder: "Numeric answer" + (q.unit ? ` (${q.unit})` : ""), oninput: (e) => { answers[q.id] = e.target.value; } });
        } else {
          inputEl = h("textarea", { rows: 4, class: "input", placeholder: "Write your derivation, proof, or synthesis...", oninput: (e) => { answers[q.id] = e.target.value; } });
        }
        qCards.append(h("div", { class: "card col", id: "excard_" + q.id, style: "gap:8px" },
          h("div", { class: "row between" }, h("b", null, `Problem ${idx + 1}`), h("span", { class: "pill primary" }, `${q.points || 15} pts · ${q.type.toUpperCase()}`)),
          App.prose(q.question),
          inputEl,
          h("div", { class: "ex-feedback" })));
      });

      const submitBtn = h("button", {
        class: "btn lg violet",
        onclick: async () => {
          clearInterval(timerId);
          submitBtn.disabled = true; submitBtn.textContent = "Grading Examination...";
          let r;
          try {
            r = await api("/exams/submit", {
              body: {
                course_id: ex.course_id,
                title: ex.title,
                duration_sec: durationSec,
                elapsed_sec: durationSec - remaining,
                questions: ex.questions,
                answers,
                test_out: testOut,
                degree_id: ex.degree_id || "",
                paper_id: ex.paper_id || "",
              },
            });
          } catch (err) {
            App.toast("⚠️ " + (err.message || "Could not submit the examination."), "danger", 7000);
            submitBtn.disabled = false; submitBtn.textContent = "📜 Retry Submission";
            return;
          }
          applyRewards(r);
          submitBtn.textContent = `Official Grade: ${r.grade} (${Math.round(r.score * 100)}%)`;
          const notes = h("div", { class: "col", style: "gap:8px" });
          if (r.credit) {
            notes.append(h("div", { class: "card", style: `border-color:${r.credit.granted ? "#6ee7b7" : "#fbbf24"}` },
              h("b", null, r.credit.granted ? "🎓 Credit by Examination GRANTED" : "🎓 Credit not granted"),
              h("div", { class: "small mt4" }, r.credit.reason || "")));
            if (r.credit.granted && typeof confetti === "function") { try { confetti({ particleCount: 160, spread: 90 }); } catch (_) {} }
          }
          if (r.degree_exam) {
            notes.append(h("div", { class: "card", style: `border-color:${r.degree_exam.passed ? "#6ee7b7" : "#fbbf24"}` },
              h("b", null, r.degree_exam.passed ? "🎓 Degree examination PASSED" : "🎓 Degree examination not passed"),
              h("div", { class: "small mt4" }, r.degree_exam.reason || ""),
              h("a", { class: "btn sm secondary mt8", href: `#/degrees/${encodeURIComponent(ex.degree_id)}` }, "↩ Back to Degree Audit")));
            if (r.degree_exam.passed && typeof confetti === "function") { try { confetti({ particleCount: 200, spread: 100 }); } catch (_) {} }
          }
          if (r.grader_note) notes.append(h("div", { class: "card small muted", style: "border-color:rgba(251,191,36,.5)" }, "ℹ️ " + r.grader_note));
          if (notes.childNodes.length) arena.insertBefore(notes, arena.firstChild);
          (ex.questions || []).forEach((q) => {
            const g = r.grading[q.id];
            const card = $("#excard_" + q.id, arena);
            if (card && g) {
              const fb = $(".ex-feedback", card);
              fb.innerHTML = "";
              fb.append(h("div", { class: "card mt8", style: `border-color:${g.correct ? "#6ee7b7" : "#ff6b6b"}` },
                h("b", null, g.correct ? `✓ Correct (${Math.round(g.score * 100)}%)` : `✗ Review Needed (${Math.round(g.score * 100)}%)`),
                App.prose(g.feedback || q.explanation || "")));
            }
          });
        },
      }, "📜 Submit Official Examination");

      timerId = setInterval(() => {
        remaining = Math.max(0, remaining - 1);
        const m = String(Math.floor(remaining / 60)).padStart(2, "0");
        const s = String(remaining % 60).padStart(2, "0");
        timerBadge.textContent = `⏱️ ${m}:${s}`;
        if (remaining === 0) { clearInterval(timerId); submitBtn.click(); }
      }, 1000);

      arena.innerHTML = "";
      arena.append(
        h("div", { class: "card row between wrap", style: "border-color:rgba(232,121,249,.4)" },
          h("div", { class: "row", style: "gap:8px" },
            h("b", { style: "font-size:18px" }, ex.title),
            testOut ? h("span", { class: "pill warn" }, "🎓 Test-Out · need 85%") : null,
            ex.degree_id ? h("span", { class: "pill violet" }, `🎓 Degree Exam · need ${Math.round((ex.pass || 0.7) * 100)}%`) : null),
          timerBadge),
        qCards,
        h("div", { class: "row end" }, submitBtn)
      );
    }

    root.append(
      h("h1", { class: "page" }, "⏱️ University Examination Hall"),
      h("p", { class: "lead" }, "Sit for closed-notes, countdown-timed Midterm, Final, and Qualifying Examinations to test synthesis across an entire course."),
      h("div", { class: "card row between wrap", style: "gap:10px" },
        courseSel,
        h("div", { class: "row wrap", style: "gap:8px" },
          h("button", { class: "btn violet", onclick: () => startExam(false) }, "⏱️ Start Timed Examination"),
          h("button", {
            class: "btn warn",
            title: "Comprehensive exam over the whole course. Score 85%+ (with the AI grader online) to earn full course credit without taking the lessons.",
            onclick: () => { if (confirm("Sit a comprehensive Credit-by-Examination test for this course?\n\n12 questions · 45 minutes · 85% required to earn credit.")) startExam(true); },
          }, "🎓 Test Out (Credit by Exam)"))),
      h("div", { class: "tiny muted mt4" }, "Already know this material? Test out: score ≥85% on a comprehensive exam and the course is marked complete with full credits (shown as \"credit by exam\" on your transcript)."),
      arena,
      (hist.attempts && hist.attempts.length) ? h("div", { class: "card col mt16", style: "gap:8px" },
        h("b", null, "📜 Official Examination Record"),
        hist.attempts.map((a) => h("div", { class: "row between", style: "padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)" },
          h("span", null, (a.kind === "test_out" ? "🎓 " : "") + `${a.title} (${Math.round(a.elapsed_sec / 60)}m)`),
          h("span", { class: "pill ok" }, `Grade: ${a.grade} · ${Math.round(a.score * 100)}%`)))) : null
    );
    if (degreeId) setTimeout(() => { if (confirm("Start your degree comprehensive / qualifying examination now?\n\n12 cross-course questions · 60 minutes.")) startExam(false); }, 50);
    else if (autoTestOut && preCourse) setTimeout(() => { if (confirm("Start the Credit-by-Examination test for this course now?\n\n12 questions · 45 minutes · 85% required.")) startExam(true); }, 50);
    return { destroy() { clearInterval(timerId); } };
  };

  // =========================================================================
  // VIEW 3: #/notebook — SCHOLAR'S ZETTELKASTEN (LaTeX + Code + [[Backlinks]])
  // =========================================================================
  V.notebook = async function (root, seg, query) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Scholar's Zettelkasten" }]);
    let data = await api("/notebook");
    let notes = data.notes || [];
    let current = notes[0] || null;
    if (query && query.note) {
      const want = notes.find((n) => String(n.id) === String(query.note));
      if (want) current = want;
    }
    let mode = "edit"; // or "graph"
    let graphStop = null;

    function findByTitle(title) {
      const t = (title || "").trim().toLowerCase();
      return notes.find((n) => (n.title || "").trim().toLowerCase() === t) || null;
    }
    function openNote(n) {
      if (graphStop) { graphStop(); graphStop = null; }
      mode = "edit";
      current = n;
      renderList(); renderEditor();
    }
    function openOrCreateByTitle(title) {
      const n = findByTitle(title);
      if (n) return openNote(n);
      openNote({ id: null, title: title.trim(), body: `Backlinked from [[${(current && current.title) || ""}]].\n\n`, tags: ["note"] });
      App.toast(`New Zettel "${title.trim()}" — save to create it.`, "info");
    }
    function linkChip(title, n) {
      const exists = n || findByTitle(title);
      return h("span", {
        class: "wikilink" + (exists ? "" : " missing"),
        title: exists ? "Open note" : "Create this note",
        onclick: () => (n ? openNote(n) : openOrCreateByTitle(title)),
      }, title);
    }

    const searchIn = h("input", { class: "input", placeholder: "Search notes, tags, or [[backlinks]]..." });
    const listCol = h("div", { class: "col", style: "gap:8px;max-height:560px;overflow:auto" });
    const editorCol = h("div", { class: "card col", style: "gap:10px" });

    function extractWikiLinks(text) {
      const out = [];
      const re = /\[\[([^\]]+)\]\]/g;
      let m;
      while ((m = re.exec(text || "")) !== null) out.push(m[1].trim());
      return out;
    }

    function renderList() {
      listCol.innerHTML = "";
      const q = searchIn.value.trim().toLowerCase();
      const filtered = notes.filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || (n.tags || []).some((t) => t.toLowerCase().includes(q)));
      if (!filtered.length) {
        listCol.append(h("div", { class: "card muted small" }, "No notes yet. Click + New Zettel or clip equations directly from any lesson!"));
        return;
      }
      filtered.forEach((n) => {
        const active = current && current.id === n.id;
        listCol.append(h("div", {
          class: "card",
          style: `padding:10px;cursor:pointer;border-color:${active ? "#e879f9" : "rgba(255,255,255,.08)"}`,
          onclick: () => { openNote(n); const gb = root.querySelector(".zk-graph-toggle"); if (gb) gb.textContent = "🕸️ Graph"; },
        },
          h("b", { class: "small" }, n.title),
          h("div", { class: "row wrap mt4", style: "gap:4px" }, (n.tags || []).map((t) => h("span", { class: "pill primary", style: "font-size:10px" }, "#" + t)))));
      });
    }

    function renderEditor() {
      editorCol.innerHTML = "";
      const n = current || { id: null, title: "New Zettel Note", body: "Write LaTeX ($E = mc^2$), fenced ```python code, and link notes with [[Concept Name]].", tags: ["synthesis"] };
      const titleIn = h("input", { class: "input", value: n.title });
      const tagsIn = h("input", { class: "input", value: (n.tags || []).join(", ") });
      const bodyIn = h("textarea", { rows: 10, class: "input", value: n.body });
      const preview = h("div", { class: "card", style: "background:rgba(255,255,255,.02)" });

      function updatePreview() {
        // Replace [[Title]] with placeholder tokens, render markdown, then swap tokens for clickable spans.
        const titles = [];
        const md = bodyIn.value.replace(/\[\[([^\]]+)\]\]/g, (_, t) => { titles.push(t.trim()); return `ZKLINK${titles.length - 1}ZK`; });
        preview.innerHTML = "";
        const body = App.prose(md);
        if (titles.length) {
          const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
          const nodes = [];
          while (walker.nextNode()) if (/ZKLINK\d+ZK/.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
          nodes.forEach((tn) => {
            const frag = document.createDocumentFragment();
            tn.nodeValue.split(/(ZKLINK\d+ZK)/).forEach((part) => {
              const m = /^ZKLINK(\d+)ZK$/.exec(part);
              if (m) frag.append(linkChip(titles[+m[1]]));
              else if (part) frag.append(document.createTextNode(part));
            });
            tn.parentNode.replaceChild(frag, tn);
          });
        }
        preview.append(h("div", { class: "tiny muted mb8" }, "Live Rendered Preview (KaTeX + Code + clickable [[Wiki Links]]):"), body);
      }
      bodyIn.addEventListener("input", updatePreview);
      updatePreview();

      const outbound = extractWikiLinks(n.body);
      const backlinks = notes.filter((other) => other.id !== n.id && extractWikiLinks(other.body).some((l) => l.toLowerCase() === (n.title || "").toLowerCase()));

      editorCol.append(
        h("div", { class: "row between wrap", style: "gap:8px" },
          h("b", null, n.id ? `Editing Zettel #${n.id}` : "New Zettel"),
          h("div", { class: "row wrap", style: "gap:6px" },
            h("button", {
              class: "btn sm secondary",
              onclick: () => {
                const blob = new Blob([`# ${titleIn.value}\nTags: ${tagsIn.value}\n\n${bodyIn.value}\n`], { type: "text/markdown" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = (titleIn.value.replace(/[^a-z0-9]+/gi, "_").toLowerCase() || "zettel") + ".md";
                a.click();
              },
            }, "⬇ Export .md"),
            n.id ? h("button", {
              class: "btn sm danger",
              onclick: async () => {
                await api(`/notebook/${n.id}`, { method: "DELETE" });
                notes = notes.filter((x) => x.id !== n.id);
                current = notes[0] || null;
                renderList(); renderEditor();
              },
            }, "🗑 Delete") : null,
            h("button", {
              class: "btn sm violet",
              onclick: async () => {
                const r = await api("/notebook", {
                  body: {
                    id: n.id,
                    title: titleIn.value,
                    body: bodyIn.value,
                    tags: tagsIn.value.split(",").map((x) => x.trim()).filter(Boolean),
                  },
                });
                applyRewards(r);
                data = await api("/notebook");
                notes = data.notes || [];
                current = r.note;
                renderList(); renderEditor();
                App.toast("Zettel saved!", "info");
              },
            }, "💾 Save Zettel"))),
        h("div", { class: "grid c2" },
          h("label", { class: "field" }, "Title", titleIn),
          h("label", { class: "field" }, "Tags", tagsIn)),
        bodyIn,
        preview,
        h("div", { class: "col", style: "gap:6px" },
          h("div", { class: "small muted row wrap", style: "gap:6px" }, "Outbound [[Links]]:",
            outbound.length ? outbound.map((t) => linkChip(t)) : h("span", null, "none")),
          h("div", { class: "small muted row wrap", style: "gap:6px" }, "Incoming Backlinks:",
            backlinks.length ? backlinks.map((b) => linkChip(b.title, b)) : h("span", null, "none")),
          (n.lesson_id || n.course_id) ? h("div", { class: "small muted" }, "Source: ",
            n.lesson_id ? h("a", { href: `#/lesson/${n.lesson_id}` }, "📖 open lesson") : h("a", { href: `#/course/${n.course_id}` }, "📚 open course")) : null)
      );
    }

    // ---------------- #20 Graph mode (force-directed canvas) ----------------
    function renderGraph() {
      editorCol.innerHTML = "";
      const canvas = h("canvas", { class: "zk-graph" });
      const info = h("div", { class: "tiny muted" }, "Drag to pan nodes · click a note to open it · violet = notes, cyan = courses/lessons, dashed = missing notes.");
      editorCol.append(h("div", { class: "row between" }, h("b", null, "🕸️ Knowledge Graph"), h("span", { class: "pill primary" }, `${notes.length} notes`)), canvas, info);
      const W = editorCol.clientWidth - 30 || 800, H = 520;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);

      const nodes = [], edges = [], idx = {};
      const add = (key, label, kind, ref) => {
        if (idx[key] != null) return idx[key];
        idx[key] = nodes.length;
        nodes.push({ key, label, kind, ref, x: W / 2 + (Math.random() - 0.5) * W * 0.6, y: H / 2 + (Math.random() - 0.5) * H * 0.6, vx: 0, vy: 0 });
        return idx[key];
      };
      notes.forEach((n) => add("n" + n.id, n.title || "Untitled", "note", n));
      notes.forEach((n) => {
        const a = idx["n" + n.id];
        extractWikiLinks(n.body).forEach((t) => {
          const tgt = findByTitle(t);
          const b = tgt ? idx["n" + tgt.id] : add("m:" + t.toLowerCase(), t, "missing", t);
          if (a !== b) edges.push([a, b, "link"]);
        });
        if (n.lesson_id) edges.push([a, add("l:" + n.lesson_id, n.lesson_id, "lesson", n.lesson_id), "src"]);
        else if (n.course_id) edges.push([a, add("c:" + n.course_id, n.course_id, "course", n.course_id), "src"]);
      });
      if (!nodes.length) { info.textContent = "No notes yet — create some Zettels and link them with [[Title]]."; return; }

      let raf = 0, alive = true, ticks = 0, drag = null, hover = null;
      function step() {
        const k = Math.sqrt((W * H) / Math.max(1, nodes.length)) * 0.6;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            let dx = a.x - b.x, dy = a.y - b.y; let d2 = dx * dx + dy * dy || 0.01;
            const f = (k * k) / d2 * 0.05;
            a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f;
          }
        }
        edges.forEach(([i, j]) => {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
          const f = (d - k) * 0.01;
          a.vx += (dx / d) * f * d * 0.05; a.vy += (dy / d) * f * d * 0.05;
          b.vx -= (dx / d) * f * d * 0.05; b.vy -= (dy / d) * f * d * 0.05;
        });
        nodes.forEach((n) => {
          n.vx += (W / 2 - n.x) * 0.002; n.vy += (H / 2 - n.y) * 0.002;
          if (n === drag) return;
          n.vx *= 0.82; n.vy *= 0.82;
          n.x = Math.max(20, Math.min(W - 20, n.x + Math.max(-12, Math.min(12, n.vx))));
          n.y = Math.max(20, Math.min(H - 20, n.y + Math.max(-12, Math.min(12, n.vy))));
        });
      }
      const color = { note: "#e879f9", lesson: "#22d3ee", course: "#22d3ee", missing: "#94a3b8" };
      function draw() {
        ctx.clearRect(0, 0, W, H);
        edges.forEach(([i, j, kind]) => {
          const a = nodes[i], b = nodes[j];
          ctx.strokeStyle = kind === "src" ? "rgba(34,211,238,.35)" : "rgba(232,121,249,.45)";
          ctx.setLineDash(nodes[j].kind === "missing" ? [4, 4] : []);
          ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        });
        ctx.setLineDash([]);
        nodes.forEach((n) => {
          const r = n.kind === "note" ? 7 : 5;
          ctx.fillStyle = color[n.kind]; ctx.globalAlpha = n.kind === "missing" ? 0.55 : 1;
          ctx.beginPath(); ctx.arc(n.x, n.y, n === hover ? r + 3 : r, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = n === hover ? "#fff" : "rgba(226,232,240,.8)";
          ctx.font = (n.kind === "note" ? "12px" : "10px") + " system-ui, sans-serif";
          const lbl = n.label.length > 28 ? n.label.slice(0, 27) + "…" : n.label;
          ctx.fillText(lbl, n.x + r + 3, n.y + 4);
        });
      }
      function loop() {
        if (!alive) return;
        if (ticks < 600 || drag) { step(); ticks++; }
        draw();
        raf = requestAnimationFrame(loop);
      }
      const pick = (e) => {
        const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
        let best = null, bd = 14 * 14;
        nodes.forEach((n) => { const d = (n.x - x) ** 2 + (n.y - y) ** 2; if (d < bd) { bd = d; best = n; } });
        return { n: best, x, y };
      };
      let moved = false;
      canvas.addEventListener("mousedown", (e) => { const p = pick(e); drag = p.n; moved = false; });
      canvas.addEventListener("mousemove", (e) => {
        const p = pick(e);
        if (drag) { drag.x = p.x; drag.y = p.y; moved = true; ticks = Math.min(ticks, 400); }
        hover = p.n; canvas.style.cursor = p.n ? "pointer" : "default";
      });
      window.addEventListener("mouseup", function up() {
        if (!alive) { window.removeEventListener("mouseup", up); return; }
        const n = drag; drag = null;
        if (n && !moved) {
          if (n.kind === "note") openNote(n.ref);
          else if (n.kind === "missing") openOrCreateByTitle(n.ref);
          else if (n.kind === "lesson") location.hash = `#/lesson/${n.ref}`;
          else if (n.kind === "course") location.hash = `#/course/${n.ref}`;
        }
      });
      loop();
      graphStop = () => { alive = false; cancelAnimationFrame(raf); };
    }

    const graphBtn = h("button", {
      class: "btn secondary zk-graph-toggle",
      onclick: () => {
        if (mode === "graph") { openNote(current); graphBtn.textContent = "🕸️ Graph"; return; }
        mode = "graph"; graphBtn.textContent = "✏️ Editor"; renderGraph();
      },
    }, "🕸️ Graph");

    searchIn.addEventListener("input", renderList);
    renderList();
    renderEditor();

    root.append(
      h("div", { class: "row between wrap mb12" },
        h("div", null,
          h("h1", { class: "page", style: "margin:0" }, "📓 Scholar's Zettelkasten"),
          h("p", { class: "lead", style: "margin:4px 0 0" }, "Your personal LaTeX, code, and [[Backlinked]] knowledge base across all 19 faculties.")),
        h("div", { class: "row", style: "gap:8px" },
          graphBtn,
          h("button", { class: "btn violet", onclick: () => { graphBtn.textContent = "🕸️ Graph"; openNote({ id: null, title: "Untitled Concept Note", body: "", tags: ["note"] }); } }, "+ New Zettel"))),
      h("div", { class: "grid", style: "grid-template-columns: 300px 1fr; gap: 16px" },
        h("div", { class: "col", style: "gap:8px" }, searchIn, listCol),
        editorCol)
    );
    return { destroy() { if (graphStop) graphStop(); } };
  };

  // =========================================================================
  // VIEW 4: #/autopsy — MISTAKE AUTOPSY & ERROR-TAXONOMY JOURNAL
  // =========================================================================
  V.autopsy = async function (root) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Mistake Autopsy Lab" }]);
    const data = await api("/autopsy");
    const mistakes = data.mistakes || [];
    const tax = data.taxonomy || {};

    const taxGrid = h("div", { class: "grid c3 mb16" },
      Object.keys(tax).length
        ? Object.entries(tax).map(([cat, cnt]) => h("div", { class: "card" }, h("b", null, cat), h("div", { class: "small muted mt4" }, `${cnt} logged occurrence${cnt === 1 ? "" : "s"}`)))
        : [h("div", { class: "card" }, h("b", null, "Zero Unresolved Errors Logged Yet"), h("div", { class: "small muted mt4" }, "Any checkpoint, homework, or exam miss is automatically dissected here."))]);

    const list = h("div", { class: "col", style: "gap:12px" });
    mistakes.forEach((m) => {
      const drillBox = h("div", { class: "mt8" });
      const card = h("div", { class: "card col", style: `gap:8px;opacity:${m.resolved ? 0.65 : 1}` },
        h("div", { class: "row between wrap" },
          h("div", { class: "row wrap", style: "gap:6px" },
            h("span", { class: "pill " + (m.resolved ? "ok" : "warn") }, m.resolved ? "✓ Inoculated" : `⚠️ ${m.category}`),
            h("span", { class: "pill primary" }, `${m.source} · ${m.course_id || "general"}`)),
          !m.resolved ? h("button", {
            class: "btn sm violet",
            onclick: async () => {
              drillBox.innerHTML = "<div class='small muted'>Running Root-Cause Autopsy & generating 3-minute micro-drill...</div>";
              const d = await api("/autopsy/drill", { body: { mistake_id: m.id } });
              drillBox.innerHTML = "";
              drillBox.append(
                h("div", { class: "card col", style: "gap:10px;border-color:rgba(232,121,249,.4)" },
                  App.prose(d.autopsy || ""),
                  (d.drills || []).map((q, qi) => h("div", { class: "col", style: "gap:4px" },
                    h("b", { class: "small" }, `Micro-Drill ${qi + 1}: ${q.question}`),
                    (q.choices || []).map((ch, ci) => h("button", {
                      class: "btn sm secondary",
                      style: "text-align:left;justify-content:flex-start",
                      onclick: (e) => {
                        if (ci === Number(q.answer || 0)) {
                          e.target.className = "btn sm ok";
                          App.toast("Correct! " + (q.explanation || ""), "info");
                        } else {
                          e.target.className = "btn sm danger";
                        }
                      },
                    }, ch)))),
                  h("button", {
                    class: "btn sm ok",
                    onclick: async () => {
                      const r = await api("/autopsy/resolve", { body: { mistake_id: m.id } });
                      applyRewards(r);
                      V.autopsy(root);
                    },
                  }, "✅ Mark Weakness Resolved (+30 XP)"))
              );
            },
          }, "🔬 Run Autopsy & Micro-Drill (+30 XP)") : null),
        App.prose(m.question),
        h("div", { class: "small muted" }, `Your answer: ${m.learner_answer}  |  Target invariant: ${m.correct_answer}`),
        drillBox);
      list.append(card);
    });

    root.innerHTML = "";
    root.append(
      h("h1", { class: "page" }, "📉 Mistake Autopsy & Error-Taxonomy Lab"),
      h("p", { class: "lead" }, "Every missed checkpoint, homework problem, or exam item is automatically classified by cognitive root cause so you can eradicate recurring traps."),
      taxGrid,
      list
    );
  };

  // =========================================================================
  // VIEW 5: #/capstones — CROSS-DOMAIN CAPSTONE PROJECTS
  // =========================================================================
  V.capstones = async function (root) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Cross-Domain Capstones" }]);
    const data = await api("/capstones");
    const capstones = data.capstones || [];
    const subs = data.submissions || [];

    root.append(
      h("h1", { class: "page" }, "🧬 Cross-Domain Capstone Projects"),
      h("p", { class: "lead" }, "Master's-level interdisciplinary synthesis projects that combine 4 faculties simultaneously and are graded by an AI Faculty Committee."),
      h("div", { class: "col", style: "gap:16px" },
        capstones.map((cap) => {
          const prevSub = subs.find((s) => s.capstone_id === cap.id);
          const subIn = h("textarea", { rows: 6, class: "input", placeholder: "Write your mathematical derivation, architectural synthesis, and multilingual/ethical defense covering all deliverables..." });
          const codeIn = h("textarea", { rows: 7, class: "input", style: "font-family:monospace", value: cap.starter_code || "" });
          const resultBox = h("div", { class: "mt8" });

          return h("div", { class: "card col", style: "gap:10px;border-color:rgba(124,156,255,.35)" },
            h("div", { class: "row between wrap" },
              h("div", null,
                h("h3", { style: "margin:0" }, cap.title),
                h("div", { class: "row wrap mt4", style: "gap:6px" },
                  cap.domains.map((d) => h("span", { class: "pill primary" }, d.toUpperCase())),
                  h("span", { class: "pill warn" }, `+${cap.xp} XP · ${cap.difficulty}`))),
              prevSub ? h("span", { class: "pill ok" }, `✓ Completed (${prevSub.evaluation.grade || "A"} · ${Math.round(prevSub.score * 100)}%)`) : null),
            h("p", { class: "muted", style: "margin:0" }, cap.summary),
            h("div", { class: "card", style: "background:rgba(255,255,255,.02)" },
              h("b", { class: "small" }, "Required Interdisciplinary Deliverables:"),
              h("ul", { style: "margin:6px 0 0 18px" }, cap.deliverables.map((d) => h("li", { class: "small" }, d)))),
            h("div", { class: "grid c2" },
              h("label", { class: "field" }, "Written Synthesis, Proofs & Multilingual Abstract", subIn),
              h("label", { class: "field" }, "Computational Model (Python / NumPy)", codeIn)),
            h("div", { class: "row end" },
              h("button", {
                class: "btn violet",
                onclick: async (e) => {
                  const btn = e.target;
                  btn.disabled = true; btn.textContent = "Convene Faculty Committee...";
                  try {
                    const r = await api("/capstones", { body: { capstone_id: cap.id, submission: subIn.value, code: codeIn.value } });
                    applyRewards(r);
                    const ev = r.evaluation;
                    resultBox.innerHTML = "";
                    resultBox.append(h("div", { class: "card col", style: "gap:8px;border-color:#6ee7b7" },
                      h("b", null, `Committee Verdict: ${ev.committee_verdict} · Grade ${ev.grade} (${Math.round(ev.score * 100)}%)`),
                      App.prose(ev.feedback || "")));
                  } catch (err) {
                    App.toast(err.message, "danger");
                  } finally {
                    btn.disabled = false; btn.textContent = "🏛️ Submit to Interdisciplinary Faculty Committee";
                  }
                },
              }, "🏛️ Submit to Interdisciplinary Faculty Committee")),
            resultBox);
        }))
    );
  };

  // =========================================================================
  // VIEW 6: #/ingest — PAPER / PDF / SYLLABUS / REPO INGESTION PIPELINE
  // =========================================================================
  V.ingest = async function (root) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Ingest Paper / Repo" }]);
    const titleIn = h("input", { class: "input", placeholder: "e.g., Attention Is All You Need / Linux Kernel Scheduler / MIT 18.06 Notes" });
    const textIn = h("textarea", { rows: 12, class: "input", placeholder: "Paste any arXiv paper text, Markdown documentation, textbook chapter, syllabus, or GitHub repository tree/README here..." });
    const fileIn = h("input", {
      type: "file",
      accept: ".txt,.md,.py,.js,.tex,.json,.csv",
      onchange: (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        if (!titleIn.value) titleIn.value = f.name.replace(/\.[^.]+$/, "");
        const reader = new FileReader();
        reader.onload = () => { textIn.value = String(reader.result || ""); };
        reader.readAsText(f);
      },
    });
    const statusBox = h("div", { class: "mt12" });

    root.append(
      h("h1", { class: "page" }, "📄 Ingest Any Paper, Syllabus or Repo into an Interactive Course"),
      h("p", { class: "lead" }, "Drop in raw technical papers, lecture notes, or codebases and let the Professor decompose them into modules, simulations, Python labs, and graded homework."),
      h("div", { class: "card col", style: "gap:12px" },
        h("div", { class: "grid c2" },
          h("label", { class: "field" }, "Course / Seminar Title", titleIn),
          h("label", { class: "field" }, "Or load a local text/markdown/code file", fileIn)),
        h("label", { class: "field" }, "Source Material (Paper Text / LaTeX / Syllabus / Codebase Overview)", textIn),
        h("div", { class: "row end" },
          h("button", {
            class: "btn lg violet",
            onclick: async () => {
              if (!textIn.value.trim()) { App.toast("Paste or select source text first", "warn"); return; }
              statusBox.innerHTML = "<div class='card muted'>Decomposing source material into university modules, labs, and simulations...</div>";
              const r = await api("/ingest", { body: { title: titleIn.value || "Ingested Seminar", text: textIn.value } });
              if (r.domain) {
                const b = await api("/bootstrap"); App.state.boot = b; App.state.catalog = b.catalog;
                App.navigate(`#/domain/${r.domain.id}`);
                return;
              }
              if (r.job_id) {
                const poll = setInterval(async () => {
                  const j = await api(`/jobs/${r.job_id}`);
                  if (j.status === "done") {
                    clearInterval(poll);
                    const b = await api("/bootstrap"); App.state.boot = b; App.state.catalog = b.catalog;
                    App.toast("Course ingested!", "info");
                    App.navigate(`#/domain/${j.result.domain.id}`);
                  } else if (j.status === "error") {
                    clearInterval(poll);
                    statusBox.innerHTML = `<div class='card danger'>${j.error}</div>`;
                  }
                }, 1500);
              }
            },
          }, "⚡ Ingest & Build Interactive Course (+60 XP)")),
        statusBox)
    );
  };

  // =========================================================================
  // VIEW 7: #/nexus — RUN NEXUS LIVE TOOL BRIDGE
  // =========================================================================
  V.nexus = async function (root) {
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Run Nexus Bridge" }]);
    const data = await api("/nexus/bridge");
    const apps = data.apps || [];

    root.append(
      h("h1", { class: "page" }, "🔗 Run Nexus Live Tool Bridge"),
      h("p", { class: "lead" }, "Connect your Self-Taught coursework in Cybersecurity, OSINT, AI Agents, and Systems directly to sibling applications in your Run Nexus desktop suite."),
      data.error
        ? h("div", { class: "card small", style: "border-color:#fbbf24" }, `⚠️ Could not read the Nexus registry: ${data.error}. Showing defaults.`)
        : h("div", { class: "tiny muted mb8" }, `Live registry: ${data.source || "built-in defaults"} · ${apps.length} apps · ${apps.filter((a) => a.online).length} online`),
      h("div", { class: "grid c2", style: "gap:14px" },
        apps.map((a) => h("div", { class: "card col", style: "gap:10px" },
          h("div", { class: "row between wrap" },
            h("b", { style: "font-size:16px" }, a.name),
            h("span", { class: "pill " + (a.online ? "ok" : "primary") }, a.online ? `● ONLINE (:${a.port})` : (a.port ? `○ Port :${a.port}` : "Desktop Orchestrator"))),
          h("div", { class: "small muted" }, a.desc),
          h("div", { class: "row wrap", style: "gap:6px" },
            (a.related_domains || []).map((d) => h("a", { class: "pill primary", href: `#/domain/${d}` }, `🎓 ${d}`))),
          a.url ? h("div", { class: "row mt4" }, h("a", { class: "btn sm secondary", href: a.url, target: "_blank" }, `↗ Open ${a.name} (${a.url})`)) : null)))
    );
  };

  // =========================================================================
  // VIEW 8: #/aid — SUPER AID & SCHOLASTIC PLANNER
  // =========================================================================
  V.aid = async function (root, seg, query) {
    query = query || {};
    App.setCrumbs([{ label: "Home", href: "#/" }, { label: "Super Aid & Scholastic Planner" }]);
    const data = await api("/aid/tracks");
    let tracks = data.tracks || [];
    let active = data.active_track || tracks[0] || null;
    let activeTab = query.tab || "calendar"; // "calendar" | "weekly" | "hierarchy" | "today"
    let showBuilder = query.build === "1" || !active;

    const todayIso = (active && active.stats && active.stats.today) || new Date().toISOString().slice(0, 10);
    let selectedDate = query.date || (active && active.todays_plan && active.todays_plan.date) || todayIso;
    let calYear = parseInt(selectedDate.slice(0, 4), 10) || new Date().getFullYear();
    let calMonth = (parseInt(selectedDate.slice(5, 7), 10) || (new Date().getMonth() + 1)) - 1; // 0..11

    const mainWrap = h("div", { class: "col", style: "gap:18px" });
    root.innerHTML = "";
    root.append(mainWrap);

    function speakBriefing(tr) {
      if (!tr || !App.TTS) return;
      const st = tr.stats || {};
      const tp = tr.todays_plan;
      const itemsText = tp && tp.items && tp.items.length
        ? tp.items.map((it, idx) => `Item ${idx + 1}: ${it.title} (${it.mins} minutes)`).join(". ")
        : "Your schedule is clear for today.";
      const speech = `Welcome to your Super Aid Scholastic Briefing. Your active educational track is ${tr.title.replace(/[^\w\s,&.-]/g, "")}. ` +
        `Your overall goal is: ${tr.overall_goal}. ` +
        `You have completed ${st.done_lessons || 0} of ${st.total_lessons || 0} lessons across ${st.total_courses || 0} courses and ${st.total_phases || 4} phases. ` +
        `For your scheduled session on ${tp ? tp.date : todayIso}, here is your lesson plan: ${itemsText}. Let's begin!`;
      App.TTS.speakText(speech);
    }

    function renderAll() {
      mainWrap.innerHTML = "";
      if (!active && tracks.length) active = tracks[0];
      const st = (active && active.stats) || { done_lessons: 0, total_lessons: 0, pct: 0, courses_done: 0, total_courses: 0, total_phases: 4, today: todayIso };

      // 1. Page Header & Action Bar
      const headerRow = h("div", { class: "row between wrap", style: "gap:12px" },
        h("div", null,
          h("h1", { class: "page", style: "margin:0" }, "🧭 Super Aid · Scholastic Planner & Curriculum Architect"),
          h("p", { class: "lead", style: "margin:4px 0 0" }, "Your personal Academic Dean: structures your Overall Goal into Educational Tracks, Cohesive Phases, Courses to Take, Daily Lesson Plans, and an Interactive Calendar.")),
        h("div", { class: "row wrap", style: "gap:8px" },
          active ? h("button", { class: "btn sm secondary", onclick: () => speakBriefing(active) }, "🔊 Voice Briefing") : null,
          active ? h("button", {
            class: "btn sm secondary",
            onclick: async () => {
              const r = await api("/aid/rebalance", { body: { track_id: active.id, start_date: todayIso, weeks: active.weeks, days_per_week: active.days_per_week, mins_per_day: active.mins_per_day } });
              tracks = r.tracks || tracks;
              active = r.active_track || active;
              selectedDate = (active.todays_plan && active.todays_plan.date) || todayIso;
              App.toast("Calendar schedule rebalanced starting from today!", "info");
              renderAll();
            },
          }, "🔄 Rebalance Schedule to Today") : null,
          active ? h("a", { class: "btn sm secondary", href: `/api/aid/ics/${encodeURIComponent(active.id)}`, download: `${active.id}.ics` }, "📅 Export .ics Calendar") : null,
          h("a", { class: "btn sm ok", href: "#/degrees" }, "🎓 Browse Degree Paths"),
          h("button", {
            class: "btn sm " + (showBuilder ? "secondary" : "violet"),
            onclick: () => { showBuilder = !showBuilder; renderAll(); },
          }, showBuilder ? "✕ Close Track Studio" : "✨ + Create New Custom Track"))
      );
      mainWrap.append(headerRow);

      // 2. Track Switcher Bar (All Saved & Flagship Educational Tracks)
      const trackBar = h("div", { class: "card col", style: "gap:10px" },
        h("div", { class: "row between wrap" },
          h("b", { class: "small" }, `📚 Your Educational Tracks (${tracks.length} tracks available — click any track to switch your active schedule):`),
          h("span", { class: "tiny muted" }, "Switch tracks anytime; your lesson completion progress is shared globally across all tracks.")),
        h("div", { class: "grid c3", style: "gap:10px" },
          tracks.map((tr) => {
            const isAct = active && tr.id === active.id;
            const trSt = tr.stats || {};
            return h("div", {
              class: "card hover col between",
              style: `padding:12px;cursor:pointer;border:2px solid ${isAct ? "var(--violet)" : "var(--border)"};background:${isAct ? "rgba(192,132,252,.11)" : "rgba(255,255,255,.02)"}`,
              onclick: async () => {
                if (isAct) return;
                const r = await api("/aid/activate", { body: { track_id: tr.id } });
                tracks = r.tracks || tracks;
                active = r.active_track || tr;
                selectedDate = (active.todays_plan && active.todays_plan.date) || todayIso;
                calYear = parseInt(selectedDate.slice(0, 4), 10) || calYear;
                calMonth = (parseInt(selectedDate.slice(5, 7), 10) || (calMonth + 1)) - 1;
                App.toast(`Activated track: ${active.title}`, "info");
                renderAll();
              },
            },
              h("div", null,
                h("div", { class: "row between", style: "gap:6px" },
                  h("span", { class: "pill " + (isAct ? "violet" : "primary") }, isAct ? "★ ACTIVE TRACK" : `${tr.weeks}w · ${tr.days_per_week}d/wk`),
                  h("div", { class: "row", style: "gap:6px" },
                    h("span", { class: "tiny muted" }, `${trSt.done_lessons || 0}/${trSt.total_lessons || 0} lessons`),
                    tracks.length > 1 ? h("button", {
                      class: "btn sm danger",
                      style: "padding:1px 6px;font-size:10px",
                      title: "Delete track",
                      onclick: async (e) => {
                        e.stopPropagation();
                        if (!confirm(`Delete track "${tr.title}"?`)) return;
                        const r = await api(`/aid/tracks/${encodeURIComponent(tr.id)}`, { method: "DELETE" });
                        tracks = r.tracks || [];
                        active = r.active_track || tracks[0] || null;
                        renderAll();
                      },
                    }, "✕") : null)),
                h("div", { class: "bold mt6", style: "font-size:0.96rem" }, tr.title),
                h("div", { class: "tiny muted mt4", style: "display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden" }, tr.overall_goal)),
              h("div", { class: "progress ok mt8" }, h("i", { style: `width:${Math.round((trSt.pct || 0) * 100)}%` }))
            );
          }))
      );
      mainWrap.append(trackBar);
      if (active) mainWrap.append(flightPackCard());

      // 3. Optional Custom Track & Lesson Plan Builder Studio
      if (showBuilder) {
        const titleIn = h("input", { class: "input", placeholder: "e.g., Autonomous Drone & Computer Vision Track / Polyglot Strategist" });
        const goalIn = h("textarea", {
          rows: 3,
          class: "input",
          placeholder: "Describe your Overall Goal and what you want to learn (e.g., 'I want to master Linear Algebra, Deep Learning LLMs, Robotics kinematics, and Mandarin Chinese in 8 weeks')...",
        });
        const startIn = h("input", { type: "date", class: "input", value: todayIso });
        const weeksIn = h("input", { type: "number", class: "input", min: 1, max: 52, value: 8 });
        const daysIn = h("input", { type: "number", class: "input", min: 1, max: 7, value: 5 });
        const minsIn = h("input", { type: "number", class: "input", min: 20, max: 240, step: 10, value: 60 });
        const maxCoursesIn = h("input", { type: "number", class: "input", min: 3, max: 16, value: 8 });

        const selectedDoms = new Set();
        const domChipsWrap = h("div", { class: "row wrap", style: "gap:6px" });
        (App.state.catalog || []).forEach((d) => {
          const btn = h("button", {
            type: "button",
            class: "btn sm secondary",
            onclick: () => {
              if (selectedDoms.has(d.id)) {
                selectedDoms.delete(d.id);
                btn.className = "btn sm secondary";
              } else {
                selectedDoms.add(d.id);
                btn.className = "btn sm violet";
              }
            },
          }, `${d.icon} ${d.name}`);
          domChipsWrap.append(btn);
        });

        const presets = [
          {
            label: "🤖 Full-Stack AI Agents + Robotics + Math",
            title: "🤖 Full-Stack AI Agents, LLMs & Robotics Track",
            goal: "Build autonomous LLM agent swarms, master linear algebra & probability, and integrate real-time SLAM and control theory on physical robots.",
            doms: ["math", "ai", "robotics"],
          },
          {
            label: "🗣️ 5-Language Polyglot + Philosophy & Rhetoric",
            title: "🗣️ Five-Language Polyglot & Classical Philosophy Track",
            goal: "Attain conversational and reading fluency across Mandarin, German, Italian, French, and Arabic while mastering epistemology, truth, and moral philosophy.",
            doms: ["languages", "philosophy", "jurisprudence"],
          },
          {
            label: "🕵️ Cyber Warfare, OSINT, SDR & Game Theory",
            title: "🕵️ Cyber Operations, RF Signals & Strategic Game Theory",
            goal: "Master offensive binary security, network cryptography, software-defined radio signal intelligence, and geopolitical game theory.",
            doms: ["cybersecurity", "rf_sdr", "game_theory", "geopolitics"],
          },
          {
            label: "⚛️ Quantum Physics, Astrophysics & Aerospace",
            title: "⚛️ Relativistic Physics, Quantum Computing & Orbital Mechanics",
            goal: "Unify Newtonian, relativistic, and quantum mechanics with fault-tolerant quantum algorithms and interplanetary spacecraft trajectory design.",
            doms: ["physics", "quantum_computing", "aerospace", "math"],
          },
        ];

        mainWrap.append(
          h("div", { class: "card col", style: "gap:12px;border:2px solid var(--violet);background:rgba(192,132,252,.06)" },
            h("div", { class: "row between wrap" },
              h("h3", { style: "margin:0" }, "✨ Super Aid · Custom Track & Scholastic Schedule Generator"),
              h("span", { class: "tiny muted" }, "Tell the Super Aid what you want to achieve — it groups courses into 4 phases and schedules every lesson on your calendar.")),
            h("div", { class: "row wrap", style: "gap:6px" },
              h("span", { class: "tiny muted" }, "Quick Goal Presets:"),
              presets.map((p) => h("button", {
                type: "button",
                class: "btn sm secondary",
                onclick: () => {
                  titleIn.value = p.title;
                  goalIn.value = p.goal;
                  selectedDoms.clear();
                  p.doms.forEach((id) => selectedDoms.add(id));
                  Array.from(domChipsWrap.children).forEach((ch, idx) => {
                    const domObj = (App.state.catalog || [])[idx];
                    if (domObj) ch.className = selectedDoms.has(domObj.id) ? "btn sm violet" : "btn sm secondary";
                  });
                },
              }, p.label))),
            h("div", { class: "grid c2", style: "gap:12px" },
              h("label", { class: "field" }, "Track Name (optional — auto-titled if blank)", titleIn),
              h("label", { class: "field" }, "Start Date", startIn)),
            h("label", { class: "field" }, "Overall Goal & Topics You Want to Learn", goalIn),
            h("div", { class: "col", style: "gap:6px" },
              h("span", { class: "small bold" }, "Select Faculties to Include (optional — Super Aid will also match keywords across all 19 faculties):"),
              domChipsWrap),
            h("div", { class: "grid c4", style: "gap:10px" },
              h("label", { class: "field" }, "Target Duration (Weeks)", weeksIn),
              h("label", { class: "field" }, "Study Days / Week (1–7)", daysIn),
              h("label", { class: "field" }, "Daily Study Budget (Mins)", minsIn),
              h("label", { class: "field" }, "Courses in Track (3–16)", maxCoursesIn)),
            h("div", { class: "row end", style: "gap:8px" },
              h("button", {
                class: "btn lg violet",
                onclick: async (e) => {
                  const btn = e.target;
                  if (!goalIn.value.trim() && selectedDoms.size === 0) {
                    App.toast("Enter a learning goal or pick at least one faculty!", "warn");
                    return;
                  }
                  btn.disabled = true;
                  btn.textContent = "Synthesizing Track, Phases, Courses & Calendar...";
                  try {
                    const r = await api("/aid/generate", {
                      body: {
                        title: titleIn.value.trim(),
                        goal: goalIn.value.trim(),
                        domains: Array.from(selectedDoms),
                        start_date: startIn.value || todayIso,
                        weeks: parseInt(weeksIn.value, 10) || 8,
                        days_per_week: parseInt(daysIn.value, 10) || 5,
                        mins_per_day: parseInt(minsIn.value, 10) || 60,
                        max_courses: parseInt(maxCoursesIn.value, 10) || 8,
                      },
                    });
                    tracks = r.tracks || tracks;
                    active = r.active_track || r.track;
                    showBuilder = false;
                    selectedDate = (active && active.todays_plan && active.todays_plan.date) || startIn.value || todayIso;
                    calYear = parseInt(selectedDate.slice(0, 4), 10) || calYear;
                    calMonth = (parseInt(selectedDate.slice(5, 7), 10) || (calMonth + 1)) - 1;
                    App.toast("New Scholastic Track & Calendar generated! (+45 XP)", "xp");
                    renderAll();
                  } catch (err) {
                    App.toast(err.message, "danger");
                  } finally {
                    btn.disabled = false;
                    btn.textContent = "⚡ Generate Cohesive Track & Scholastic Calendar (+45 XP)";
                  }
                },
              }, "⚡ Generate Cohesive Track & Scholastic Calendar (+45 XP)")))
        );
      }

      if (!active) return;

      // 4. Active Track North-Star Goal Banner & Hierarchy Summary
      const banner = h("div", { class: "hero", style: "background: radial-gradient(900px 320px at 0% -20%, rgba(192,132,252,.32), transparent 65%), var(--panel)" },
        h("div", { class: "row between wrap top", style: "gap:18px" },
          h("div", { style: "max-width:740px" },
            h("div", { class: "row wrap", style: "gap:8px" },
              h("span", { class: "pill violet" }, "🎯 OVERALL GOAL & ACTIVE TRACK"),
              h("span", { class: "pill primary" }, `🗓️ Starts ${active.start_date} · ${active.weeks} Weeks · ${active.days_per_week} Days/Wk · ${active.mins_per_day} Mins/Day`),
              (active.domains || []).map((did) => {
                const domObj = (App.state.catalog || []).find((x) => x.id === did);
                return h("a", { class: "pill", href: `#/domain/${did}` }, domObj ? `${domObj.icon} ${domObj.name}` : did.toUpperCase());
              })),
            h("h2", { style: "margin:10px 0 6px" }, active.title),
            h("p", { style: "margin:0;font-size:1.02rem;color:var(--text)" }, `“${active.overall_goal}”`),
            active.description ? h("div", { class: "small muted mt6" }, active.description) : null,
            active.next_lesson ? h("div", { class: "row wrap mt12", style: "gap:10px" },
              h("a", { class: "btn sm ok", href: `#/lesson/${active.next_lesson.lesson_id}` }, `▶ Continue Next Lesson: ${active.next_lesson.course_code} · ${active.next_lesson.title}`),
              active.next_lesson.sim_id ? h("a", { class: "btn sm secondary", href: `#/arcade?sim=${active.next_lesson.sim_id}` }, "🕹️ Open Paired Sim") : null) : null),
          h("div", { class: "row", style: "gap:18px" },
            h("div", { class: "center" },
              App.ui.ring(st.pct || 0, "var(--violet)", fmt.pct(st.pct || 0), true),
              h("div", { class: "tiny muted mt8" }, "Track Mastery")),
            h("div", { class: "center" },
              h("div", { class: "big" }, `${st.total_phases || 4}`),
              h("div", { class: "tiny muted" }, "Phases")),
            h("div", { class: "center" },
              h("div", { class: "big" }, `${st.courses_done}/${st.total_courses}`),
              h("div", { class: "tiny muted" }, "Courses")),
            h("div", { class: "center" },
              h("div", { class: "big" }, `${st.done_lessons}/${st.total_lessons}`),
              h("div", { class: "tiny muted" }, "Lessons"))))
      );
      mainWrap.append(banner);

      // 5. Sub-navigation tabs: Monthly Calendar | Weekly Timetable | Goal->Phases->Courses->Lessons Hierarchy | Today's Lesson Plan
      const tabs = [
        ["calendar", "📅 Monthly Calendar Grid"],
        ["weekly", "🗓️ Weekly Scholastic Timetable"],
        ["hierarchy", "🏛️ Track Hierarchy (Goal → Phases → Courses → Lessons)"],
        ["today", "🎯 Today's Lesson Plan & Briefing"],
      ];
      const tabBar = h("div", { class: "row wrap", style: "gap:8px;border-bottom:1px solid var(--border);padding-bottom:10px" },
        tabs.map(([id, label]) => h("button", {
          class: "btn sm " + (activeTab === id ? "violet" : "secondary"),
          onclick: () => { activeTab = id; renderAll(); },
        }, label)));
      mainWrap.append(tabBar);

      // Build lookup map of schedule by YYYY-MM-DD
      const schedByDate = {};
      (active.schedule || []).forEach((d) => { schedByDate[d.date] = d; });

      // ------------------------------------------------------------------ TAB 1: MONTHLY CALENDAR GRID
      if (activeTab === "calendar") {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const firstDay = new Date(calYear, calMonth, 1);
        const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0 .. Sunday = 6
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

        const dayCells = [];
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((wd) => {
          dayCells.push(h("div", { class: "tiny muted bold center", style: "padding:6px 0;border-bottom:1px solid var(--border)" }, wd));
        });
        for (let i = 0; i < startOffset; i++) {
          dayCells.push(h("div", { style: "min-height:96px;background:rgba(255,255,255,.01);border-radius:8px" }));
        }
        for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
          const iso = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const sDay = schedByDate[iso];
          const isToday = iso === todayIso;
          const isSelected = iso === selectedDate;
          const borderCol = isSelected ? "var(--violet)" : (isToday ? "var(--ok)" : (sDay ? "rgba(124,156,255,.35)" : "var(--border)"));
          const bgCol = isSelected ? "rgba(192,132,252,.13)" : (sDay ? (sDay.completed ? "rgba(110,231,183,.08)" : "rgba(124,156,255,.06)") : "rgba(255,255,255,.015)");

          dayCells.push(
            h("div", {
              class: "col",
              style: `min-height:102px;padding:7px;border-radius:10px;border:2px solid ${borderCol};background:${bgCol};cursor:pointer;gap:4px;transition:transform .12s`,
              onclick: () => { selectedDate = iso; renderAll(); },
            },
              h("div", { class: "row between" },
                h("span", { class: "small bold", style: isToday ? "color:var(--ok)" : "" }, isToday ? `${dayNum} · TODAY` : String(dayNum)),
                sDay ? h("span", { class: "tiny muted" }, sDay.completed ? "✅" : `${sDay.total_mins}m`) : null),
              sDay ? h("div", { class: "col", style: "gap:3px" },
                (sDay.items || []).slice(0, 3).map((it) => h("div", {
                  class: "tiny",
                  style: `padding:2px 5px;border-radius:4px;background:rgba(0,0,0,.28);border-left:3px solid ${it.domain_color || "var(--primary)"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`,
                  title: `${it.course_code || it.type.toUpperCase()}: ${it.title}`,
                }, `${it.completed ? "✓ " : ""}${it.domain_icon || "📘"} ${it.course_code ? it.course_code + ": " : ""}${it.title}`)),
                (sDay.items || []).length > 3 ? h("div", { class: "tiny muted" }, `+${sDay.items.length - 3} more`) : null
              ) : h("div", { class: "tiny dim", style: "margin-top:auto" }, "Rest / Open"))
          );
        }

        // Right-hand Selected Day Inspector
        const selPlan = schedByDate[selectedDate];
        const customTitleIn = h("input", { class: "input", placeholder: "Add custom study block or milestone..." });
        const customMinsIn = h("input", { type: "number", class: "input", value: 30, min: 5, max: 240, style: "width:90px" });

        const inspector = h("div", { class: "card col", style: "gap:12px;align-self:start" },
          h("div", { class: "row between wrap" },
            h("div", null,
              h("span", { class: "pill violet" }, `📅 ${selectedDate}`),
              h("h3", { style: "margin:6px 0 0" }, selPlan ? `Week ${selPlan.week_number} · Study Day ${selPlan.day_number}` : "Open / Self-Paced Study Day")),
            selPlan ? h("span", { class: "pill primary" }, `${selPlan.total_mins} mins total`) : null),
          selPlan && selPlan.phase_title ? h("div", { class: "small muted" }, `🏛️ ${selPlan.phase_title}`) : null,
          selPlan && selPlan.items && selPlan.items.length
            ? h("div", { class: "col", style: "gap:8px" },
                selPlan.items.map((it) => {
                  const href = it.type === "lesson" ? `#/lesson/${it.lesson_id}` : (it.type === "sim" ? `#/arcade?sim=${it.sim_id}` : (it.href || "#/exams"));
                  return h("div", {
                    class: "card col",
                    style: `padding:10px 12px;gap:6px;border-left:4px solid ${it.domain_color || "var(--primary)"}`,
                  },
                    h("div", { class: "row between wrap" },
                      h("span", { class: "tiny muted bold" }, `${it.domain_icon || "📘"} ${it.course_code || it.type.toUpperCase()} · ${it.mins} mins`),
                      h("span", { class: "pill " + (it.completed ? "ok" : "primary") }, it.completed ? "✅ Completed" : "Scheduled")),
                    h("div", { class: "bold" }, it.title),
                    it.module_title ? h("div", { class: "tiny muted" }, `Module: ${it.module_title}`) : null,
                    h("div", { class: "row end mt4", style: "gap:6px" },
                      it.course_id ? h("a", { class: "btn sm secondary", href: `#/course/${it.course_id}` }, "Course Syllabus") : null,
                      it.type !== "custom" ? h("a", { class: "btn sm ok", href }, it.type === "lesson" ? "▶ Start Lesson" : (it.type === "sim" ? "🕹️ Launch Sim" : "🧠 Start Review")) : null));
                }))
            : h("div", { class: "card muted small" }, "No required track lessons scheduled on this date. Click any highlighted date on the calendar or add a custom study session below."),
          h("div", { style: "border-top:1px solid var(--border);padding-top:10px" },
            h("div", { class: "small bold mb6" }, `📌 Add Custom Study Session on ${selectedDate}`),
            h("div", { class: "row", style: "gap:6px" },
              customTitleIn,
              customMinsIn,
              h("button", {
                class: "btn sm violet",
                onclick: async () => {
                  if (!customTitleIn.value.trim()) return;
                  const r = await api("/aid/custom_event", {
                    body: { track_id: active.id, date: selectedDate, title: customTitleIn.value.trim(), mins: parseInt(customMinsIn.value, 10) || 30 },
                  });
                  tracks = r.tracks || tracks;
                  active = r.active_track || active;
                  App.toast(`Added to ${selectedDate}`, "info");
                  renderAll();
                },
              }, "+ Add")))
        );

        mainWrap.append(
          h("div", { class: "grid", style: "grid-template-columns: 1.65fr 1fr; gap: 16px" },
            h("div", { class: "card col", style: "gap:12px" },
              h("div", { class: "row between wrap" },
                h("div", { class: "row", style: "gap:8px" },
                  h("button", {
                    class: "btn sm secondary",
                    onclick: () => {
                      calMonth--;
                      if (calMonth < 0) { calMonth = 11; calYear--; }
                      renderAll();
                    },
                  }, "◀ Prev"),
                  h("h3", { style: "margin:0;min-width:170px;text-align:center" }, `${monthNames[calMonth]} ${calYear}`),
                  h("button", {
                    class: "btn sm secondary",
                    onclick: () => {
                      calMonth++;
                      if (calMonth > 11) { calMonth = 0; calYear++; }
                      renderAll();
                    },
                  }, "Next ▶")),
                h("button", {
                  class: "btn sm secondary",
                  onclick: () => {
                    selectedDate = todayIso;
                    calYear = parseInt(todayIso.slice(0, 4), 10);
                    calMonth = parseInt(todayIso.slice(5, 7), 10) - 1;
                    renderAll();
                  },
                }, "Jump to Today")),
              h("div", { style: "display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px" }, dayCells)),
            inspector)
        );
      }

      // ------------------------------------------------------------------ TAB 2: WEEKLY SCHOLASTIC TIMETABLE
      if (activeTab === "weekly") {
        const weeksMap = {};
        (active.schedule || []).forEach((d) => {
          const w = d.week_number || 1;
          (weeksMap[w] = weeksMap[w] || []).push(d);
        });
        const weekNums = Object.keys(weeksMap).map(Number).sort((a, b) => a - b);

        mainWrap.append(
          h("div", { class: "col", style: "gap:16px" },
            weekNums.map((wNum) => {
              const days = weeksMap[wNum];
              const wkMins = days.reduce((acc, d) => acc + (d.total_mins || 0), 0);
              const wkDone = days.every((d) => d.completed);
              const phaseTitle = (days[0] && days[0].phase_title) || "Scholastic Week";
              return h("div", { class: "card col", style: "gap:12px" },
                h("div", { class: "row between wrap" },
                  h("div", null,
                    h("div", { class: "row", style: "gap:8px" },
                      h("span", { class: "pill " + (wkDone ? "ok" : "violet") }, `🗓️ Week ${wNum}`),
                      h("span", { class: "pill primary" }, phaseTitle)),
                    h("div", { class: "small muted mt4" }, `${days[0].date} → ${days[days.length - 1].date} · ${days.length} study days · ${fmt.mins(wkMins)}`)),
                  wkDone ? h("span", { class: "pill ok" }, "✅ Week Complete") : null),
                h("div", { class: "grid c3", style: "gap:10px" },
                  days.map((d) => h("div", {
                    class: "card col between",
                    style: `padding:12px;gap:8px;border-top:3px solid ${d.completed ? "var(--ok)" : (d.date === todayIso ? "var(--violet)" : "var(--primary)")}`,
                  },
                    h("div", { class: "col", style: "gap:6px" },
                      h("div", { class: "row between" },
                        h("b", { class: "small" }, `Day ${d.day_number} · ${d.date}`),
                        h("span", { class: "tiny muted" }, `${d.total_mins}m`)),
                      (d.items || []).map((it) => {
                        const href = it.type === "lesson" ? `#/lesson/${it.lesson_id}` : (it.type === "sim" ? `#/arcade?sim=${it.sim_id}` : (it.href || "#/exams"));
                        return h("a", {
                          class: "row between",
                          style: "padding:6px 8px;border-radius:6px;background:rgba(255,255,255,.03);text-decoration:none;gap:8px",
                          href,
                        },
                          h("span", { class: "small", style: "min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" }, `${it.completed ? "✅" : (it.domain_icon || "📘")} ${it.course_code ? it.course_code + " · " : ""}${it.title}`),
                          h("span", { class: "tiny muted" }, `${it.mins}m`));
                      })),
                    h("div", { class: "row end" },
                      h("button", {
                        class: "btn sm secondary",
                        onclick: () => {
                          selectedDate = d.date;
                          calYear = parseInt(d.date.slice(0, 4), 10);
                          calMonth = parseInt(d.date.slice(5, 7), 10) - 1;
                          activeTab = "calendar";
                          renderAll();
                        },
                      }, "Inspect on Calendar →"))))));
            }))
        );
      }

      // ------------------------------------------------------------------ TAB 3: HIERARCHICAL BREAKDOWN (Goal -> Phases -> Courses -> Lessons)
      if (activeTab === "hierarchy") {
        const lessonsByCourse = {};
        (active.lessons || []).forEach((L) => {
          (lessonsByCourse[L.course_id] = lessonsByCourse[L.course_id] || []).push(L);
        });

        mainWrap.append(
          h("div", { class: "card", style: "border-left:4px solid var(--ok)" },
            h("div", { class: "tiny muted bold" }, "TIER 1 · OVERALL NORTH-STAR GOAL"),
            h("h3", { style: "margin:4px 0" }, active.overall_goal),
            h("div", { class: "small muted" }, `Track: ${active.title} · ${st.total_phases} Cohesive Phases · ${st.total_courses} Courses to Take · ${st.total_lessons} Specific Lessons to Take`)),
          h("div", { class: "col", style: "gap:16px" },
            (active.phases || []).map((ph) => h("div", { class: "card col", style: "gap:14px;border-color:rgba(192,132,252,.35)" },
              h("div", { class: "row between wrap" },
                h("div", null,
                  h("span", { class: "pill violet" }, `TIER 2 · SCHOLASTIC PHASE ${ph.index}`),
                  h("h3", { style: "margin:6px 0 2px" }, ph.title),
                  h("div", { class: "small muted" }, ph.subtitle)),
                h("div", { class: "right" },
                  h("div", { class: "bold" }, `${ph.lessons_done || 0} / ${ph.lesson_count || 0} lessons (${fmt.pct(ph.pct || 0)})`),
                  h("div", { class: "tiny muted" }, `${(ph.courses || []).length} courses · ${fmt.mins(ph.total_mins || 0)}`))),
              h("div", { class: "progress ok" }, h("i", { style: `width:${Math.round((ph.pct || 0) * 100)}%` })),
              h("div", { class: "col", style: "gap:12px" },
                (ph.courses || []).map((c, cIdx) => {
                  const cLessons = lessonsByCourse[c.id] || [];
                  return h("details", { class: "acc", open: cIdx === 0 || !c.completed },
                    h("summary", null,
                      h("span", { class: "pill primary" }, `TIER 3 · COURSE`),
                      h("span", { class: "bold" }, `${c.domain_icon} ${c.code} · ${c.title}`),
                      App.levelTag(c.level),
                      h("span", { class: "tiny dim", style: "margin-left:auto" }, `${c.lessons_done || 0}/${c.lesson_count} lessons (${fmt.pct(c.pct || 0)})`)),
                    h("div", { class: "body col", style: "gap:8px" },
                      h("div", { class: "row between wrap" },
                        h("div", { class: "small muted" }, `${c.domain_name} › ${c.subject_name} — ${c.description}`),
                        h("a", { class: "btn sm secondary", href: `#/course/${c.id}` }, "Open Full Course Page →")),
                      h("div", { class: "tiny muted bold mt4" }, `TIER 4 · ORDERED LESSONS TO TAKE (${cLessons.length} lessons):`),
                      cLessons.map((L, lIdx) => h("div", { class: "lesson-row", style: "display:flex;align-items:center;justify-content:space-between;gap:10px" },
                        h("div", { class: "row", style: "gap:10px;min-width:0" },
                          h("span", { class: "st" }, App.statusIcon(L.status)),
                          h("div", { style: "min-width:0" },
                            h("div", { class: "bold small" }, `${lIdx + 1}. ${L.title}`),
                            h("div", { class: "tiny muted" }, `Module ${L.module_index}: ${L.module_title} · Scheduled: ${L.scheduled_date || "Flexible"} (Wk ${L.week_number || 1}, Day ${L.day_number || 1}) · ${L.est_mins}m`))),
                        h("div", { class: "row", style: "gap:6px;flex-shrink:0" },
                          L.sim_id ? h("a", { class: "pill primary", href: `#/arcade?sim=${L.sim_id}`, title: "Interactive Arcade Simulation" }, "🕹️ Sim") : null,
                          L.has_lab ? h("span", { class: "pill ok", title: "Includes Python Lab" }, "🧪 Lab") : null,
                          h("a", { class: "btn sm " + (L.status === "completed" ? "secondary" : "ok"), href: `#/lesson/${L.lesson_id}` }, L.status === "completed" ? "Review ↺" : "▶ Take Lesson"))))));
                })))))
        );
      }

      // ------------------------------------------------------------------ TAB 4: TODAY'S LESSON PLAN & BRIEFING
      if (activeTab === "today") {
        const tp = active.todays_plan;
        mainWrap.append(
          h("div", { class: "card col", style: "gap:14px;border:2px solid var(--ok)" },
            h("div", { class: "row between wrap" },
              h("div", null,
                h("span", { class: "pill ok" }, `🎯 DAILY LESSON PLAN · ${tp ? tp.date : todayIso}`),
                h("h2", { style: "margin:6px 0 2px" }, tp ? `Week ${tp.week_number}, Study Day ${tp.day_number} — ${tp.phase_title}` : "Today's Study Checklist"),
                h("div", { class: "small muted" }, `Part of your Overall Goal: ${active.overall_goal}`)),
              h("div", { class: "row", style: "gap:8px" },
                h("button", { class: "btn sm secondary", onclick: () => speakBriefing(active) }, "🔊 Read Today's Plan Aloud"),
                tp ? h("span", { class: "pill primary" }, `${tp.total_mins} mins total`) : null)),
            tp && tp.items && tp.items.length
              ? h("div", { class: "grid c2", style: "gap:12px" },
                  tp.items.map((it, i) => {
                    const href = it.type === "lesson" ? `#/lesson/${it.lesson_id}` : (it.type === "sim" ? `#/arcade?sim=${it.sim_id}` : (it.href || "#/exams"));
                    return h("div", { class: "card col between", style: `gap:10px;border-left:4px solid ${it.domain_color || "var(--primary)"}` },
                      h("div", { class: "col", style: "gap:6px" },
                        h("div", { class: "row between" },
                          h("span", { class: "pill primary" }, `Step ${i + 1} · ${it.type.toUpperCase()} · ${it.mins} mins`),
                          h("span", { class: "pill " + (it.completed ? "ok" : "warn") }, it.completed ? "✅ Done" : "To Do")),
                        h("h3", { style: "margin:4px 0 0" }, `${it.domain_icon || "📘"} ${it.course_code ? it.course_code + " · " : ""}${it.title}`),
                        it.module_title ? h("div", { class: "small muted" }, `Module: ${it.module_title}`) : null),
                      h("div", { class: "row end", style: "gap:8px" },
                        it.course_id ? h("a", { class: "btn sm secondary", href: `#/course/${it.course_id}` }, "View Course") : null,
                        h("a", { class: "btn sm ok", href }, it.type === "lesson" ? "▶ Launch Interactive Lesson" : (it.type === "sim" ? "🕹️ Open Arcade Simulation" : "🧠 Start Weekly Synthesis"))));
                  }))
              : h("div", { class: "empty" }, "All lessons in this track are complete! Create a new track above or switch to another track."))
        );
      }
    }

    // ---------------- #23 Offline Flight Pack ----------------
    let fpTimer = 0;
    function flightPackCard() {
      const audioCb = h("input", { type: "checkbox" });
      const status = h("div", { class: "small muted" });
      const bar = h("div", { class: "progress ok", style: "display:none" }, h("i", { style: "width:0%" }));
      const btn = h("button", { class: "btn sm violet" }, "⚡ Pre-generate This Week's Lessons & Audio");
      function show(st) {
        const total = (st.lessons || []).length;
        const done = Array.isArray(st.generated) ? st.generated.length : (st.generated || 0);
        if (!total && !st.running) { status.textContent = "Generate every lesson scheduled this week ahead of time (plus optional narrated audio) so they work fully offline — e.g. on a flight."; bar.style.display = "none"; return; }
        bar.style.display = "";
        bar.firstChild.style.width = (total ? Math.round((done / total) * 100) : 0) + "%";
        const bits = [`${done}/${total} lessons ready`];
        if (st.audio_sections) bits.push(`${st.audio_sections} audio sections cached`);
        if (st.audio_errors) bits.push(`${st.audio_errors} audio errors`);
        if (st.missing) bits.push(`${st.missing} needed generating`);
        if (st.last_error) bits.push(`last error: ${st.last_error}`);
        status.textContent = (st.running ? `⏳ Preparing${st.current ? " “" + st.current + "”" : ""}… ` : (done >= total ? "✅ Flight pack ready · " : "⚠️ Flight pack incomplete · ")) + bits.join(" · ");
        btn.disabled = !!st.running;
      }
      async function poll() {
        clearTimeout(fpTimer);
        try {
          const st = await api("/aid/flight_pack");
          show(st);
          if (st.running && document.body.contains(btn)) fpTimer = setTimeout(poll, 3000);
        } catch (_) { /* ignore */ }
      }
      btn.onclick = async () => {
        btn.disabled = true;
        try {
          const st = await api("/aid/flight_pack", { body: { audio: audioCb.checked } });
          show(st);
          App.toast("Flight pack started — you can keep studying while it runs.", "info");
          fpTimer = setTimeout(poll, 3000);
        } catch (e) { btn.disabled = false; App.toast(e.message || "Could not start the flight pack.", "warn"); }
      };
      poll();
      return h("div", { class: "card col", style: "gap:8px;border-color:rgba(34,211,238,.35)" },
        h("div", { class: "row between wrap", style: "gap:8px" },
          h("b", null, "✈️ Offline Flight Pack"),
          h("div", { class: "row wrap", style: "gap:10px" },
            h("label", { class: "row small", style: "gap:6px;cursor:pointer" }, audioCb, "Include narrated audio (slower)"),
            btn)),
        status, bar);
    }

    renderAll();
    return { destroy() { clearTimeout(fpTimer); } };
  };
})();

