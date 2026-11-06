/* Self-Taught University — World Languages interactive HTML5 simulations
 * Covers Mandarin Chinese (zh-CN), German (de), Italian (it), French (fr), and Modern Standard Arabic (ar).
 * Registers 5 simulations with SelfTaughtSims:
 *   1. tone_pitch_trainer  — Mandarin Tone & Pitch Contour Studio
 *   2. script_stroke_lab   — Arabic Abjad & Hanzi Radical Tracing Studio
 *   3. conjugation_matrix  — European Grammar & Conjugation Matrix (German · Italian · French)
 *   4. semitic_root_weaver — Arabic Triliteral Root (Jizr) & Pattern (Wazn) Weaver
 *   5. dialogue_immersion  — Polyglot Immersion Roleplay Deck (5 Languages)
 */
(function () {
  "use strict";
  const S = window.SelfTaughtSims;
  if (!S) return;

  function speakPhrase(text, lang) {
    if (window.SelfTaughtTTS && typeof window.SelfTaughtTTS.speakPhrase === "function") {
      window.SelfTaughtTTS.speakPhrase(text, lang);
      return;
    }
    const u = `/api/tts/phrase?lang=${encodeURIComponent(lang || "en")}&text=${encodeURIComponent(text || "")}`;
    const a = new Audio(u);
    a.play().catch(() => {});
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  /* =========================================================================
   * 1. TONE PITCH TRAINER — Mandarin Tone & Pitch Contour Studio
   * ========================================================================= */
  const TONE_ITEMS = {
    t1_ma: {
      hanzi: "妈",
      pinyin: "mā",
      meaning: "mother",
      chao: "55 (High Level)",
      rule: "Tone 1 — sustain a steady, high fundamental frequency (f₀) across the entire rime.",
      pts: [5.0, 5.0, 5.0],
      sandhiNote: "No sandhi in isolation; stays 55.",
      underlying: "mā (55)",
      surface: "mā (55)",
    },
    t2_ma: {
      hanzi: "麻",
      pinyin: "má",
      meaning: "hemp / numb",
      chao: "35 (Mid-Rising)",
      rule: "Tone 2 — climb briskly from mid-range (3) to top of pitch register (5), like asking 'What?'",
      pts: [3.0, 3.85, 5.0],
      sandhiNote: "In fast trisyllables (1+2+X), middle T2 can become 1.",
      underlying: "má (35)",
      surface: "má (35)",
    },
    t3_ma: {
      hanzi: "马",
      pinyin: "mǎ",
      meaning: "horse",
      chao: "214 (Low Dipping / 21 Half-Third)",
      rule: "Tone 3 — dip from low-mid (2) to creaky low (1), then rise to mid-high (4) in citation form.",
      pts: [2.2, 1.1, 4.0],
      sandhiNote: "Before Tone 1/2/4/Neutral, loses final rise → Half-Third (21).",
      underlying: "mǎ (214)",
      surface: "mǎ (214 citation / 21 pre-pausal)",
    },
    t4_ma: {
      hanzi: "骂",
      pinyin: "mà",
      meaning: "to scold",
      chao: "51 (High Falling)",
      rule: "Tone 4 — sharp, decisive drop from highest register (5) to bottom (1).",
      pts: [5.0, 3.0, 1.0],
      sandhiNote: "Before another T4, first T4 falls less far (53 + 51).",
      underlying: "mà (51)",
      surface: "mà (51)",
    },
    t0_ma: {
      hanzi: "吗",
      pinyin: "ma",
      meaning: "yes/no question particle",
      chao: "Neutral (轻声 qīngshēng)",
      rule: "Neutral tone — short, unstressed syllable whose pitch targets ~2–3 depending on preceding tone.",
      pts: [2.8, 2.5, 2.3],
      sandhiNote: "Pitch height is governed by the preceding syllable's offset.",
      underlying: "ma (0)",
      surface: "ma (mid-low short)",
    },
    sandhi_nihao: {
      hanzi: "你好",
      pinyin: "nǐ hǎo → ní hǎo",
      meaning: "hello (lit. you good)",
      chao: "3+3 → 2+3 (35 + 214)",
      rule: "3rd-Tone Sandhi: When two Tone 3 syllables meet (214 + 214), the first dissimilates into Tone 2 (35).",
      pts: [3.0, 4.8, 1.5],
      multiPts: [3.0, 4.2, 5.0, 2.2, 1.1, 3.8],
      sandhiNote: "ACTIVE SANDHI: nǐ (214) + hǎo (214) → ní (35) + hǎo (214)",
      underlying: "nǐ hǎo (214 + 214)",
      surface: "ní hǎo (35 + 214)",
    },
    sandhi_bu: {
      hanzi: "不对",
      pinyin: "bù duì → bú duì",
      meaning: "incorrect / not right",
      chao: "不 (bù 51) + T4 → bú (35) + T4 (51)",
      rule: "不 (bù) Sandhi: Underlying Tone 4 (51) shifts to rising Tone 2 (35) immediately before another Tone 4.",
      pts: [3.1, 4.9, 1.2],
      multiPts: [3.0, 4.1, 5.0, 5.0, 2.9, 1.0],
      sandhiNote: "ACTIVE SANDHI: bù (51) + duì (51) → bú (35) + duì (51)",
      underlying: "bù duì (51 + 51)",
      surface: "bú duì (35 + 51)",
    },
    sandhi_yi: {
      hanzi: "一定 / 一般",
      pinyin: "yī dìng → yí dìng · yī bān → yì bān",
      meaning: "certainly (T2+T4) / general (T4+T1)",
      chao: "一 (yī 55) → yí (35) before T4; yì (51) before T1/T2/T3",
      rule: "一 (yī) Sandhi: Citation 55 becomes rising 35 before T4 (yí dìng), and falling 51 before T1/2/3 (yì bān).",
      pts: [3.0, 4.9, 1.1],
      multiPts: [3.0, 4.2, 5.0, 5.0, 3.0, 1.0],
      sandhiNote: "ACTIVE SANDHI: yī (55) + dìng (51) → yí (35) + dìng (51)",
      underlying: "yī dìng (55 + 51)",
      surface: "yí dìng (35 + 51)",
    },
  };

  S.register({
    id: "tone_pitch_trainer",
    name: "Mandarin Tone & Pitch Contour Studio",
    domains: ["languages"],
    description:
      "Visualize and sculpt Mandarin Chinese pitch contours on Y. R. Chao's 5-level scale (1–5), inspect Tone Sandhi transformations (3+3→2+3, 一 yī, 不 bù), and test your contour accuracy.",
    params: [
      {
        key: "target",
        label: "Target Word / Sandhi Pattern",
        type: "select",
        value: "t1_ma",
        options: [
          { value: "t1_ma", label: "Tone 1 (55 High Level) — 妈 mā (mother)" },
          { value: "t2_ma", label: "Tone 2 (35 Rising) — 麻 má (hemp)" },
          { value: "t3_ma", label: "Tone 3 (214 Dipping) — 马 mǎ (horse)" },
          { value: "t4_ma", label: "Tone 4 (51 Falling) — 骂 mà (scold)" },
          { value: "t0_ma", label: "Neutral (轻声) — 吗 ma (question)" },
          { value: "sandhi_nihao", label: "Sandhi 3+3 → 2+3 — 你好 nǐhǎo → níhǎo" },
          { value: "sandhi_bu", label: "Sandhi 不 bù — 不对 bù duì → bú duì" },
          { value: "sandhi_yi", label: "Sandhi 一 yī — 一定 yī dìng → yí dìng" },
        ],
      },
      { key: "pStart", label: "User Onset Pitch (Chao 1–5)", type: "range", min: 1, max: 5, step: 0.1, value: 5.0 },
      { key: "pMid", label: "User Inflection Pitch (Chao 1–5)", type: "range", min: 1, max: 5, step: 0.1, value: 5.0 },
      { key: "pEnd", label: "User Offset Pitch (Chao 1–5)", type: "range", min: 1, max: 5, step: 0.1, value: 5.0 },
      { key: "showUnderlying", label: "Show Underlying Pre-Sandhi Ghost Curve", type: "toggle", value: true },
    ],
    actions: [
      {
        label: "🔊 Hear Mandarin",
        fn: (h) => h.speak(),
      },
      {
        label: "✨ Snap to Target Contour",
        fn: (h) => h.snapToTarget(),
      },
    ],
    challenges: [
      {
        id: "tone3_dip",
        text: "Select 马 mǎ (Tone 3, 214) and sculpt the dipping pitch curve to achieve ≥ 90% contour match.",
        xp: 15,
      },
      {
        id: "nihao_sandhi",
        text: "Switch to 你好 (nǐ hǎo → ní hǎo) and match the 3+3 → 2+3 sandhi contour (≥ 88% match).",
        xp: 20,
      },
      {
        id: "bu_yi_mastery",
        text: "Explore both 不对 (bú duì) and 一定 (yí dìng) sandhi patterns and press '🔊 Hear Mandarin'.",
        xp: 15,
      },
    ],
    mount(el, api) {
      const view = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 });
      const { canvas, ctx } = view;
      const NUM_SAMPLES = 48;
      let userCurve = new Array(NUM_SAMPLES).fill(5.0);
      let dragging = false;
      let animPhase = 0;
      const visitedSandhi = new Set();

      function evalQuad(p0, p1, p2, t) {
        // Interpolating quadratic passing through p0 at t=0, p1 at t=0.5, p2 at t=1
        const c = p0;
        const b = 4 * p1 - 3 * p0 - p2;
        const a = 2 * p2 - 4 * p1 + 2 * p0;
        return clamp(a * t * t + b * t + c, 1.0, 5.0);
      }

      function rebuildUserFromSliders() {
        const p0 = Number(api.params.pStart) || 3;
        const p1 = Number(api.params.pMid) || 3;
        const p2 = Number(api.params.pEnd) || 3;
        for (let i = 0; i < NUM_SAMPLES; i++) {
          const t = i / (NUM_SAMPLES - 1);
          userCurve[i] = evalQuad(p0, p1, p2, t);
        }
      }

      function targetCurveAt(item, t) {
        if (item.multiPts) {
          const mp = item.multiPts;
          if (t < 0.5) {
            return evalQuad(mp[0], mp[1], mp[2], t * 2);
          }
          return evalQuad(mp[3], mp[4], mp[5], (t - 0.5) * 2);
        }
        return evalQuad(item.pts[0], item.pts[1], item.pts[2], t);
      }

      function underlyingCurveAt(key, t) {
        if (key === "sandhi_nihao") {
          return t < 0.5 ? evalQuad(2.2, 1.1, 4.0, t * 2) : evalQuad(2.2, 1.1, 4.0, (t - 0.5) * 2);
        }
        if (key === "sandhi_bu") {
          return t < 0.5 ? evalQuad(5.0, 3.0, 1.0, t * 2) : evalQuad(5.0, 3.0, 1.0, (t - 0.5) * 2);
        }
        if (key === "sandhi_yi") {
          return t < 0.5 ? evalQuad(5.0, 5.0, 5.0, t * 2) : evalQuad(5.0, 3.0, 1.0, (t - 0.5) * 2);
        }
        return null;
      }

      function computeScore(item) {
        let sumSq = 0;
        for (let i = 0; i < NUM_SAMPLES; i++) {
          const t = i / (NUM_SAMPLES - 1);
          const diff = userCurve[i] - targetCurveAt(item, t);
          sumSq += diff * diff;
        }
        const rms = Math.sqrt(sumSq / NUM_SAMPLES);
        const pct = clamp(Math.round((1 - rms / 2.6) * 100), 0, 100);
        return { rms, pct };
      }

      function checkAwards(item, pct) {
        const key = api.params.target;
        if (key === "t3_ma" && pct >= 90) api.award("tone3_dip");
        if (key === "sandhi_nihao" && pct >= 88) api.award("nihao_sandhi");
        if (key === "sandhi_bu" || key === "sandhi_yi") visitedSandhi.add(key);
        if (visitedSandhi.has("sandhi_bu") && visitedSandhi.has("sandhi_yi")) {
          api.award("bu_yi_mastery");
        }
      }

      function plotRect() {
        const w = view.width || 640;
        const h = view.height || 360;
        return {
          x: Math.round(w * 0.14),
          y: Math.round(h * 0.22),
          w: Math.round(w * 0.8),
          h: Math.round(h * 0.64),
        };
      }

      function draw() {
        const w = view.width || 640;
        const h = view.height || 360;
        const C = api.colors;
        const key = api.params.target;
        const item = TONE_ITEMS[key] || TONE_ITEMS.t1_ma;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, w, h);

        // Top Banner with Hanzi, Pinyin, Meaning, Chao numbers
        ctx.fillStyle = "#161a2e";
        roundRect(ctx, 14, 10, w - 28, Math.round(h * 0.17), 10);
        ctx.fill();

        ctx.fillStyle = C.accent;
        ctx.font = `bold ${Math.round(h * 0.095)}px "Noto Sans SC", system-ui, sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillText(item.hanzi, 28, Math.round(h * 0.095));

        const textX = 28 + ctx.measureText(item.hanzi).width + 18;
        ctx.fillStyle = C.text;
        ctx.font = `bold ${Math.round(h * 0.05)}px Inter, system-ui, sans-serif`;
        ctx.fillText(`${item.pinyin}  —  "${item.meaning}"`, textX, Math.round(h * 0.07));

        ctx.fillStyle = C.muted;
        ctx.font = `${Math.round(h * 0.035)}px Inter, system-ui, sans-serif`;
        ctx.fillText(`Chao Pitch Scale: ${item.chao}  ·  ${item.sandhiNote}`, textX, Math.round(h * 0.125));

        const pr = plotRect();
        const chaoLabels = [
          { lv: 5, name: "5 · High (高)" },
          { lv: 4, name: "4 · Mid-High (半高)" },
          { lv: 3, name: "3 · Mid (中)" },
          { lv: 2, name: "2 · Mid-Low (半低)" },
          { lv: 1, name: "1 · Low (低)" },
        ];

        // Pitch grid lines (1..5)
        chaoLabels.forEach((row) => {
          const py = pr.y + ((5 - row.lv) / 4) * pr.h;
          ctx.strokeStyle = row.lv === 3 ? "rgba(255,255,255,0.18)" : C.grid;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pr.x, py);
          ctx.lineTo(pr.x + pr.w, py);
          ctx.stroke();

          ctx.fillStyle = C.muted;
          ctx.font = "11px ui-monospace, monospace";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText(row.name, pr.x - 10, py);
        });
        ctx.textAlign = "left";

        // Syllable divider for disyllabic sandhi items
        if (item.multiPts) {
          const midX = pr.x + pr.w * 0.5;
          ctx.save();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = "rgba(255, 209, 102, 0.45)";
          ctx.beginPath();
          ctx.moveTo(midX, pr.y);
          ctx.lineTo(midX, pr.y + pr.h);
          ctx.stroke();
          ctx.fillStyle = C.accent;
          ctx.font = "11px Inter, sans-serif";
          ctx.fillText("Syllable 1 (Sandhi Trigger)", pr.x + 8, pr.y + 14);
          ctx.fillText("Syllable 2 (Environment)", midX + 8, pr.y + 14);
          ctx.restore();
        }

        // Underlying pre-sandhi ghost curve if enabled
        if (api.params.showUnderlying && item.multiPts) {
          ctx.save();
          ctx.setLineDash([6, 4]);
          ctx.strokeStyle = "rgba(255, 143, 171, 0.55)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let i = 0; i < NUM_SAMPLES; i++) {
            const t = i / (NUM_SAMPLES - 1);
            const uLv = underlyingCurveAt(key, t);
            if (uLv == null) break;
            const px = pr.x + t * pr.w;
            const py = pr.y + ((5 - uLv) / 4) * pr.h;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Target reference contour (gold glow)
        ctx.save();
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i < NUM_SAMPLES; i++) {
          const t = i / (NUM_SAMPLES - 1);
          const lv = targetCurveAt(item, t);
          const px = pr.x + t * pr.w;
          const py = pr.y + ((5 - lv) / 4) * pr.h;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        // User drawn/slider contour (cyan/primary)
        ctx.save();
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i < NUM_SAMPLES; i++) {
          const t = i / (NUM_SAMPLES - 1);
          const lv = userCurve[i];
          const px = pr.x + t * pr.w;
          const py = pr.y + ((5 - lv) / 4) * pr.h;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Animated voice playhead orb along target contour
        const orbT = (animPhase % 1);
        const orbLv = targetCurveAt(item, orbT);
        const orbX = pr.x + orbT * pr.w;
        const orbY = pr.y + ((5 - orbLv) / 4) * pr.h;
        ctx.fillStyle = C.ok;
        ctx.beginPath();
        ctx.arc(orbX, orbY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Score & Legend footer
        const { rms, pct } = computeScore(item);
        checkAwards(item, pct);

        ctx.fillStyle = C.text;
        ctx.font = "12px Inter, system-ui, sans-serif";
        ctx.fillText(
          `Gold = Target Native Contour (${item.chao})   ·   Blue = Your Pitch Curve (drag on canvas or adjust sliders)`,
          pr.x,
          h - 14
        );

        api.readout({
          "Hanzi / Pinyin": `${item.hanzi} (${item.pinyin})`,
          "Chao Pitch Value": item.chao,
          "Underlying → Surface": `${item.underlying} → ${item.surface}`,
          "RMS Pitch Error": `${rms.toFixed(2)} Chao units`,
          "Contour Match Score": `${pct}%`,
        });
        api.setStatus(item.rule);
      }

      function paintAtPointer(pt) {
        const pr = plotRect();
        if (pt.x < pr.x - 12 || pt.x > pr.x + pr.w + 12 || pt.y < pr.y - 20 || pt.y > pr.y + pr.h + 20) return;
        const normX = clamp((pt.x - pr.x) / pr.w, 0, 1);
        const lv = clamp(5 - ((pt.y - pr.y) / pr.h) * 4, 1.0, 5.0);
        const centerIdx = Math.round(normX * (NUM_SAMPLES - 1));
        const radius = 5;
        for (let i = Math.max(0, centerIdx - radius); i <= Math.min(NUM_SAMPLES - 1, centerIdx + radius); i++) {
          const w = 1 - Math.abs(i - centerIdx) / (radius + 1);
          userCurve[i] = clamp(userCurve[i] * (1 - w * 0.65) + lv * (w * 0.65), 1.0, 5.0);
        }
        draw();
      }

      api.pointer(canvas, {
        down(pt) {
          dragging = true;
          paintAtPointer(pt);
        },
        move(pt) {
          if (dragging) paintAtPointer(pt);
        },
        up() {
          dragging = false;
        },
      });

      rebuildUserFromSliders();

      api.onParam((key) => {
        if (key === "pStart" || key === "pMid" || key === "pEnd") {
          rebuildUserFromSliders();
        } else if (key === "target") {
          const item = TONE_ITEMS[api.params.target] || TONE_ITEMS.t1_ma;
          if (api.params.target === "sandhi_bu" || api.params.target === "sandhi_yi") {
            visitedSandhi.add(api.params.target);
          }
          checkAwards(item, computeScore(item).pct);
        }
        draw();
      });

      api.onResize(() => draw());
      api.loop((dt) => {
        animPhase = (animPhase + dt * 0.45) % 1;
        draw();
      });

      return {
        speak() {
          const item = TONE_ITEMS[api.params.target] || TONE_ITEMS.t1_ma;
          const cleanText = item.hanzi.split("/")[0].trim();
          speakPhrase(cleanText, "zh-CN");
          if (api.params.target === "sandhi_bu" || api.params.target === "sandhi_yi") {
            visitedSandhi.add(api.params.target);
            if (visitedSandhi.size >= 2) api.award("bu_yi_mastery");
          }
        },
        snapToTarget() {
          const item = TONE_ITEMS[api.params.target] || TONE_ITEMS.t1_ma;
          for (let i = 0; i < NUM_SAMPLES; i++) {
            userCurve[i] = targetCurveAt(item, i / (NUM_SAMPLES - 1));
          }
          draw();
        },
        destroy() {},
      };
    },
  });

  /* =========================================================================
   * 2. SCRIPT STROKE LAB — Arabic Abjad & Hanzi Radical Tracing Studio
   * ========================================================================= */
  const ARABIC_GLYPHS = {
    ba: {
      letter: "ب",
      name: "Bāʾ (باء)",
      ipa: "/b/",
      forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" },
      joining: "Dual-joining (connects both right and left) · 1 sub-dot (nuqṭa) below the tooth",
      strokes: [
        [
          [0.78, 0.42],
          [0.76, 0.62],
          [0.5, 0.66],
          [0.24, 0.62],
          [0.22, 0.45],
        ],
        [
          [0.49, 0.78],
          [0.51, 0.79],
        ],
      ],
    },
    jim: {
      letter: "ج",
      name: "Jīm (جيم)",
      ipa: "/dʒ/ ~ /g/",
      forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" },
      joining: "Dual-joining · Upper wedge brow + sweeping lower bowl enclosing 1 central dot",
      strokes: [
        [
          [0.32, 0.34],
          [0.68, 0.34],
          [0.42, 0.52],
          [0.35, 0.72],
          [0.58, 0.82],
          [0.72, 0.72],
        ],
        [
          [0.51, 0.64],
          [0.53, 0.65],
        ],
      ],
    },
    ayn: {
      letter: "ع",
      name: "ʿAyn (عين)",
      ipa: "/ʕ/ (voiced pharyngeal)",
      forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" },
      joining: "Dual-joining · Open top hamza-like hook in isolated/initial, closed triangular loop in medial/final",
      strokes: [
        [
          [0.62, 0.32],
          [0.42, 0.34],
          [0.44, 0.48],
          [0.64, 0.5],
          [0.38, 0.66],
          [0.45, 0.84],
          [0.72, 0.8],
        ],
      ],
    },
    sin: {
      letter: "س",
      name: "Sīn (سين)",
      ipa: "/s/",
      forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" },
      joining: "Dual-joining · Three rhythmic teeth (asnān) on the baseline + deep final bowl (kāsah)",
      strokes: [
        [
          [0.82, 0.44],
          [0.78, 0.58],
          [0.7, 0.44],
          [0.65, 0.58],
          [0.56, 0.44],
          [0.52, 0.66],
          [0.34, 0.78],
          [0.22, 0.56],
        ],
      ],
    },
    kaf: {
      letter: "ك",
      name: "Kāf (كاف)",
      ipa: "/k/",
      forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" },
      joining: "Dual-joining · Tall ascender shaft + flat baseline boat in final; diagonal S-bar in initial/medial",
      strokes: [
        [
          [0.68, 0.24],
          [0.68, 0.66],
          [0.32, 0.66],
          [0.28, 0.52],
        ],
        [
          [0.55, 0.42],
          [0.45, 0.5],
        ],
      ],
    },
    mim: {
      letter: "م",
      name: "Mīm (ميم)",
      ipa: "/m/",
      forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" },
      joining: "Dual-joining · Small circular bead head + descending tail in isolated/final position",
      strokes: [
        [
          [0.58, 0.48],
          [0.7, 0.4],
          [0.66, 0.54],
          [0.44, 0.54],
          [0.42, 0.84],
        ],
      ],
    },
    ha: {
      letter: "ه",
      name: "Hāʾ (هاء)",
      ipa: "/h/",
      forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" },
      joining: "Dual-joining · 4 distinct shapes: circle (isolated), double-loop (initial), vertical bow (medial), flag (final)",
      strokes: [
        [
          [0.52, 0.36],
          [0.68, 0.52],
          [0.52, 0.66],
          [0.36, 0.52],
          [0.52, 0.36],
        ],
      ],
    },
    ya: {
      letter: "ي",
      name: "Yāʾ (ياء)",
      ipa: "/j/ or /iː/",
      forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" },
      joining: "Dual-joining · S-curve duck body with 2 dots below in all positions",
      strokes: [
        [
          [0.66, 0.4],
          [0.5, 0.46],
          [0.64, 0.6],
          [0.36, 0.72],
          [0.24, 0.56],
        ],
        [
          [0.46, 0.82],
          [0.56, 0.82],
        ],
      ],
    },
  };

  const HARAKAT_INFO = {
    fatha: { mark: "◌َ", suffix: "\u064E", label: "Fatḥa (ـَ) — short /a/ above letter", soundSuffix: "a" },
    kasra: { mark: "◌ِ", suffix: "\u0650", label: "Kasra (ـِ) — short /i/ below letter", soundSuffix: "i" },
    damma: { mark: "◌ُ", suffix: "\u064F", label: "Ḍamma (ـُ) — short /u/ loop above letter", soundSuffix: "u" },
    sukun: { mark: "◌ْ", suffix: "\u0652", label: "Sukūn (ـْ) — vowel absence / coda consonant", soundSuffix: "" },
    shadda: { mark: "◌ّ", suffix: "\u0651\u064E", label: "Shadda (ـّ) — consonant gemination (doubling)", soundSuffix: "ba" },
  };

  const HANZI_GLYPHS = {
    shui: {
      char: "水",
      radicalForm: "氵 (3-dot water sān diǎn shuǐ)",
      pinyin: "shuǐ",
      meaning: "water / river / liquid",
      decomp: "Pictograph of flowing central stream with eddies; compresses to 氵 on the left of phono-semantic compounds.",
      compounds: "清 qīng (clear) · 河 hé (river) · 海 hǎi (sea) · 汁 zhī (juice)",
      strokes: [
        [[0.5, 0.2], [0.5, 0.78], [0.43, 0.72]],
        [[0.24, 0.44], [0.42, 0.42], [0.22, 0.72]],
        [[0.74, 0.34], [0.54, 0.5]],
        [[0.52, 0.48], [0.78, 0.74]],
      ],
    },
    xin: {
      char: "心",
      radicalForm: "忄 (standing heart shù xīn páng)",
      pinyin: "xīn",
      meaning: "heart / mind / emotion",
      decomp: "4 strokes (Left dot → lying hook 卧钩 → top dot → right dot). Compresses to 忄 on left for emotions.",
      compounds: "情 qíng (feeling/emotion) · 快 kuài (fast/glad) · 忙 máng (busy)",
      strokes: [
        [[0.24, 0.52], [0.2, 0.66]],
        [[0.34, 0.46], [0.44, 0.72], [0.68, 0.72], [0.66, 0.58]],
        [[0.5, 0.34], [0.55, 0.44]],
        [[0.76, 0.42], [0.82, 0.54]],
      ],
    },
    yan: {
      char: "言",
      radicalForm: "讠 (speech radical yán zì páng)",
      pinyin: "yán",
      meaning: "words / speech / language",
      decomp: "Top dot + 3 horizontal bars + mouth 口 (kǒu) at bottom; simplifies to 2-stroke 讠 on the left.",
      compounds: "请 qǐng (please/invite) · 语 yǔ (language) · 话 huà (speech)",
      strokes: [
        [[0.48, 0.18], [0.53, 0.25]],
        [[0.24, 0.32], [0.76, 0.32]],
        [[0.32, 0.43], [0.68, 0.43]],
        [[0.32, 0.54], [0.68, 0.54]],
        [[0.34, 0.66], [0.66, 0.66], [0.66, 0.82], [0.34, 0.82], [0.34, 0.66]],
      ],
    },
    ri: {
      char: "日",
      radicalForm: "日 (sun / time radical rì zì páng)",
      pinyin: "rì",
      meaning: "sun / day / daytime",
      decomp: "Rule: Outside before inside, then close bottom last (先里后封口): Left vertical → Top-right hook → Inner bar → Bottom seal.",
      compounds: "晴 qíng (sunny/clear sky) · 明 míng (bright = 日 + 月) · 时 shí (time)",
      strokes: [
        [[0.32, 0.24], [0.32, 0.78]],
        [[0.32, 0.24], [0.68, 0.24], [0.68, 0.78]],
        [[0.34, 0.5], [0.66, 0.5]],
        [[0.34, 0.78], [0.66, 0.78]],
      ],
    },
    qing_water: {
      char: "清",
      radicalForm: "氵 (water semantic) + 青 qīng (phonetic)",
      pinyin: "qīng",
      meaning: "clear / pure (water)",
      decomp: "Phono-semantic compound (形声字): 氵 gives 'water' meaning; 青 (qīng) gives the /tɕʰiŋ/ pronunciation!",
      compounds: "Sister series with 青 (qīng): 清 qīng (clear) · 情 qíng (emotion) · 请 qǐng (please) · 晴 qíng (sunny)",
      strokes: [
        [[0.22, 0.26], [0.27, 0.32]],
        [[0.18, 0.46], [0.24, 0.52]],
        [[0.2, 0.76], [0.28, 0.6]],
        [[0.44, 0.28], [0.76, 0.28]],
        [[0.6, 0.18], [0.6, 0.48]],
        [[0.4, 0.48], [0.8, 0.48]],
        [[0.46, 0.56], [0.74, 0.56], [0.74, 0.84], [0.46, 0.84], [0.46, 0.56]],
      ],
    },
    mu: {
      char: "木",
      radicalForm: "木 (tree / wood mù zì páng)",
      pinyin: "mù",
      meaning: "tree / wood",
      decomp: "Stroke order rule: Horizontal before vertical (先横后竖), then left-falling撇 (piě) before right-falling捺 (nà).",
      compounds: "林 lín (woods = 2 trees) · 森 sēn (forest = 3 trees) · 休 xiū (rest = person 人 leaning on tree 木)",
      strokes: [
        [[0.24, 0.4], [0.76, 0.4]],
        [[0.5, 0.18], [0.5, 0.84]],
        [[0.5, 0.42], [0.24, 0.74]],
        [[0.5, 0.42], [0.76, 0.74]],
      ],
    },
  };

  S.register({
    id: "script_stroke_lab",
    name: "Arabic Abjad & Hanzi Radical Tracing Studio",
    domains: ["languages"],
    description:
      "Master right-to-left Arabic Abjad contextual letterforms (Isolated, Initial, Medial, Final + Harakat) and Chinese Hanzi radical decomposition & stroke order rules by tracing on the interactive calligrapher's slate.",
    params: [
      {
        key: "scriptMode",
        label: "Writing System Mode",
        type: "select",
        value: "arabic",
        options: [
          { value: "arabic", label: "Arabic Abjad — Contextual Joining & Harakat" },
          { value: "hanzi", label: "Mandarin Hanzi — Radicals & Stroke Order" },
        ],
      },
      {
        key: "arabicLetter",
        label: "Arabic Letter (Abjad)",
        type: "select",
        value: "ba",
        options: [
          { value: "ba", label: "ب Bāʾ (/b/) — Boat + 1 bottom dot" },
          { value: "jim", label: "ج Jīm (/dʒ/) — Brow + bowl + inner dot" },
          { value: "ayn", label: "ع ʿAyn (/ʕ/) — Pharyngeal loop" },
          { value: "sin", label: "س Sīn (/s/) — 3 teeth + deep cup" },
          { value: "kaf", label: "ك Kāf (/k/) — Tall shaft + baseline" },
          { value: "mim", label: "م Mīm (/m/) — Circular bead + tail" },
          { value: "ha", label: "ه Hāʾ (/h/) — 4 contextual shapes" },
          { value: "ya", label: "ي Yāʾ (/j/, /iː/) — Duck curve + 2 dots" },
        ],
      },
      {
        key: "harakat",
        label: "Arabic Vowel Diacritic (Harakat)",
        type: "select",
        value: "fatha",
        options: [
          { value: "fatha", label: "Fatḥa (ـَ) — short /a/" },
          { value: "kasra", label: "Kasra (ـِ) — short /i/" },
          { value: "damma", label: "Ḍamma (ـُ) — short /u/" },
          { value: "sukun", label: "Sukūn (ـْ) — no vowel" },
          { value: "shadda", label: "Shadda (ـّ) — doubled consonant" },
        ],
      },
      {
        key: "hanziChar",
        label: "Hanzi Radical / Compound",
        type: "select",
        value: "shui",
        options: [
          { value: "shui", label: "水 / 氵 (shuǐ — water radical)" },
          { value: "xin", label: "心 / 忄 (xīn — heart/mind radical)" },
          { value: "yan", label: "言 / 讠 (yán — speech radical)" },
          { value: "ri", label: "日 (rì — sun/time radical)" },
          { value: "qing_water", label: "清 (qīng — phono-semantic 氵+青)" },
          { value: "mu", label: "木 (mù — tree/wood radical)" },
        ],
      },
    ],
    actions: [
      { label: "🔊 Hear Letter / Character", fn: (h) => h.speak() },
      { label: "⏭ Step Stroke / Form", fn: (h) => h.stepStroke() },
      { label: "🧹 Clear Ink", fn: (h) => h.clearInk() },
    ],
    challenges: [
      {
        id: "trace_glyph",
        text: "Trace along the guide strokes on the calligraphy slate with your mouse or finger (≥ 70% path coverage).",
        xp: 15,
      },
      {
        id: "explore_contextual",
        text: "In Arabic mode, inspect ع (ʿAyn) and ه (Hāʾ) across all 4 contextual positions and hear their pronunciation.",
        xp: 15,
      },
      {
        id: "qing_phonosemantic",
        text: "Switch to Mandarin Hanzi mode, select 清 (qīng), and step through all strokes to see 氵 + 青 decomposition.",
        xp: 20,
      },
    ],
    mount(el, api) {
      const view = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 });
      const { canvas, ctx } = view;
      let userStrokes = [];
      let currentStroke = null;
      let activeStep = 0;
      const seenArabic = new Set();

      function slateBox() {
        const w = view.width || 640;
        const h = view.height || 360;
        const sz = Math.min(w * 0.44, h * 0.76);
        return {
          x: 20,
          y: Math.round((h - sz) * 0.52),
          w: Math.round(sz),
          h: Math.round(sz),
        };
      }

      function computeCoverage(strokes, box) {
        let totalPts = 0;
        let hitPts = 0;
        const userFlat = [];
        userStrokes.forEach((s) => s.forEach((p) => userFlat.push(p)));
        if (!userFlat.length) return 0;

        strokes.forEach((st) => {
          for (let i = 0; i < st.length; i++) {
            const gx = box.x + st[i][0] * box.w;
            const gy = box.y + st[i][1] * box.h;
            totalPts++;
            const near = userFlat.some((u) => Math.hypot(u.x - gx, u.y - gy) <= box.w * 0.13);
            if (near) hitPts++;
          }
        });
        return totalPts ? Math.round((hitPts / totalPts) * 100) : 0;
      }

      function draw() {
        const w = view.width || 640;
        const h = view.height || 360;
        const C = api.colors;
        const isArabic = api.params.scriptMode === "arabic";
        const box = slateBox();

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, w, h);

        // Left Calligraphy Tianzigong / Ruled Slate
        ctx.fillStyle = "#14182b";
        roundRect(ctx, box.x, box.y, box.w, box.h, 12);
        ctx.fill();
        ctx.strokeStyle = "rgba(124, 156, 255, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Diagonal & center grid (Tianzigong 米字格)
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(box.x + box.w / 2, box.y);
        ctx.lineTo(box.x + box.w / 2, box.y + box.h);
        ctx.moveTo(box.x, box.y + box.h / 2);
        ctx.lineTo(box.x + box.w, box.y + box.h / 2);
        ctx.moveTo(box.x, box.y);
        ctx.lineTo(box.x + box.w, box.y + box.h);
        ctx.moveTo(box.x + box.w, box.y);
        ctx.lineTo(box.x, box.y + box.h);
        ctx.stroke();
        ctx.restore();

        const glyph = isArabic
          ? ARABIC_GLYPHS[api.params.arabicLetter] || ARABIC_GLYPHS.ba
          : HANZI_GLYPHS[api.params.hanziChar] || HANZI_GLYPHS.shui;
        const hInfo = HARAKAT_INFO[api.params.harakat] || HARAKAT_INFO.fatha;

        // Watermark character inside slate
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.11)";
        ctx.font = `${Math.round(box.w * 0.66)}px "Noto Naskh Arabic", "Noto Serif SC", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const displayWatermark = isArabic ? glyph.letter + hInfo.suffix : glyph.char;
        ctx.fillText(displayWatermark, box.x + box.w * 0.5, box.y + box.h * 0.53);
        ctx.restore();

        // Guide strokes with numbered start badges & directional arrows
        const strokes = glyph.strokes || [];
        strokes.forEach((st, idx) => {
          const isCurrent = idx === activeStep % Math.max(1, strokes.length);
          ctx.save();
          ctx.strokeStyle = isCurrent ? C.accent : "rgba(124, 156, 255, 0.42)";
          ctx.lineWidth = isCurrent ? 5 : 3;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          st.forEach((pt, i) => {
            const px = box.x + pt[0] * box.w;
            const py = box.y + pt[1] * box.h;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();

          // Start number circle
          const sx = box.x + st[0][0] * box.w;
          const sy = box.y + st[0][1] * box.h;
          ctx.fillStyle = isCurrent ? C.accent : C.primary;
          ctx.beginPath();
          ctx.arc(sx, sy, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0f1222";
          ctx.font = "bold 10px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(idx + 1), sx, sy);
          ctx.restore();
        });

        // User traced ink strokes
        ctx.save();
        ctx.strokeStyle = C.ok;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        userStrokes.forEach((s) => {
          if (s.length < 2) return;
          ctx.beginPath();
          s.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.stroke();
        });
        ctx.restore();

        const cov = computeCoverage(strokes, box);
        if (cov >= 70) api.award("trace_glyph");

        // Right Panel: Contextual Forms / Radical Breakdown Cards
        const rx = box.x + box.w + 20;
        const rw = w - rx - 18;
        const ry = box.y;

        ctx.fillStyle = "#161a2e";
        roundRect(ctx, rx, ry, rw, box.h, 12);
        ctx.fill();

        if (isArabic) {
          ctx.fillStyle = C.accent;
          ctx.font = "bold 16px Inter, system-ui, sans-serif";
          ctx.fillText(`${glyph.name}   ·   IPA ${glyph.ipa}   ·   Right-to-Left (←)`, rx + 16, ry + 28);

          // 4 Contextual Form Cards (ordered Final ← Medial ← Initial ← Isolated for RTL intuition)
          const cols = [
            { key: "final", title: "Final (آخر)", sub: "connects right", form: glyph.forms.final },
            { key: "medial", title: "Medial (وسط)", sub: "connects both", form: glyph.forms.medial },
            { key: "initial", title: "Initial (أول)", sub: "connects left", form: glyph.forms.initial },
            { key: "isolated", title: "Isolated (مفرد)", sub: "standalone", form: glyph.forms.isolated },
          ];
          const cw = (rw - 44) / 4;
          cols.forEach((c, i) => {
            const cx = rx + 16 + i * (cw + 4);
            const cy = ry + 46;
            const ch = Math.round(box.h * 0.42);
            const highlight = activeStep % 4 === i;
            ctx.fillStyle = highlight ? "rgba(124,156,255,0.2)" : "rgba(255,255,255,0.04)";
            roundRect(ctx, cx, cy, cw, ch, 8);
            ctx.fill();
            if (highlight) {
              ctx.strokeStyle = C.primary;
              ctx.stroke();
            }

            ctx.fillStyle = C.text;
            ctx.font = `${Math.round(ch * 0.45)}px "Noto Naskh Arabic", serif`;
            ctx.textAlign = "center";
            ctx.fillText(c.form, cx + cw / 2, cy + ch * 0.48);

            ctx.fillStyle = C.accent;
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.fillText(c.title, cx + cw / 2, cy + ch - 24);
            ctx.fillStyle = C.muted;
            ctx.font = "10px Inter, sans-serif";
            ctx.fillText(c.sub, cx + cw / 2, cy + ch - 10);
          });
          ctx.textAlign = "left";

          // Harakat vocalization strip
          const hy = ry + Math.round(box.h * 0.56);
          ctx.fillStyle = C.primary;
          ctx.font = "bold 13px Inter, sans-serif";
          ctx.fillText(`Vocalized with ${hInfo.label}:`, rx + 16, hy);

          ctx.fillStyle = C.ok;
          ctx.font = "30px 'Noto Naskh Arabic', serif";
          ctx.fillText(glyph.letter + hInfo.suffix, rx + 16, hy + 36);

          ctx.fillStyle = C.muted;
          ctx.font = "12px Inter, sans-serif";
          ctx.fillText(glyph.joining, rx + 85, hy + 32);

          api.readout({
            "Mode": "Arabic Abjad (RTL)",
            "Letter & IPA": `${glyph.letter} ${glyph.name} (${glyph.ipa})`,
            "4 Contextual Forms": `${glyph.forms.isolated} · ${glyph.forms.initial} · ${glyph.forms.medial} · ${glyph.forms.final}`,
            "Active Harakat": hInfo.label,
            "Trace Coverage": `${cov}%`,
          });
          api.setStatus("Trace the Arabic letterform on the left slate (right-to-left) or step through its 4 contextual positions.");
        } else {
          // Hanzi mode
          ctx.fillStyle = C.accent;
          ctx.font = "bold 16px Inter, system-ui, sans-serif";
          ctx.fillText(`${glyph.char} (${glyph.pinyin}) — "${glyph.meaning}"`, rx + 16, ry + 28);

          ctx.fillStyle = C.primary;
          ctx.font = "bold 13px Inter, sans-serif";
          ctx.fillText(`Radical Form: ${glyph.radicalForm}`, rx + 16, ry + 54);

          ctx.fillStyle = C.text;
          ctx.font = "12px Inter, sans-serif";
          ctx.fillText(
            `Active Stroke: #${(activeStep % strokes.length) + 1} of ${strokes.length} total strokes`,
            rx + 16,
            ry + 80
          );

          // Wrap decomposition text
          const lines = [
            `Structure: ${glyph.decomp}`,
            `Compound Family: ${glyph.compounds}`,
            "Core Rules: Top→Bottom (先上后下) · Left→Right (先左后右) · Outside→Inside→Seal (先里后封口)",
          ];
          let ly = ry + 112;
          lines.forEach((ln) => {
            ctx.fillStyle = C.muted;
            ctx.font = "12px Inter, sans-serif";
            const words = ln.split(" ");
            let row = "";
            words.forEach((wd) => {
              const test = row ? row + " " + wd : wd;
              if (ctx.measureText(test).width > rw - 32) {
                ctx.fillText(row, rx + 16, ly);
                ly += 18;
                row = wd;
              } else {
                row = test;
              }
            });
            if (row) {
              ctx.fillText(row, rx + 16, ly);
              ly += 24;
            }
          });

          api.readout({
            "Mode": "Mandarin Hanzi Radical & Stroke Lab",
            "Character / Pinyin": `${glyph.char} (${glyph.pinyin}) — ${glyph.meaning}`,
            "Radical Component": glyph.radicalForm,
            "Stroke Count": `${strokes.length} strokes (Highlighting #${(activeStep % strokes.length) + 1})`,
            "Trace Coverage": `${cov}%`,
          });
          api.setStatus("Trace the numbered strokes in order on the 米字格 (Mǐzìgé) grid or press '⏭ Step Stroke / Form'.");
        }
      }

      api.pointer(canvas, {
        down(pt) {
          currentStroke = [{ x: pt.x, y: pt.y }];
          userStrokes.push(currentStroke);
          draw();
        },
        move(pt) {
          if (!currentStroke) return;
          currentStroke.push({ x: pt.x, y: pt.y });
          draw();
        },
        up() {
          currentStroke = null;
        },
      });

      api.onParam((key) => {
        if (key === "arabicLetter" || key === "hanziChar" || key === "scriptMode") {
          activeStep = 0;
          userStrokes = [];
          if (api.params.arabicLetter === "ayn" || api.params.arabicLetter === "ha") {
            seenArabic.add(api.params.arabicLetter);
          }
        }
        draw();
      });

      api.onResize(() => draw());
      draw();

      return {
        speak() {
          if (api.params.scriptMode === "arabic") {
            const g = ARABIC_GLYPHS[api.params.arabicLetter] || ARABIC_GLYPHS.ba;
            const h = HARAKAT_INFO[api.params.harakat] || HARAKAT_INFO.fatha;
            speakPhrase(g.letter + h.suffix, "ar");
            if (api.params.arabicLetter === "ayn" || api.params.arabicLetter === "ha") {
              seenArabic.add(api.params.arabicLetter);
              if (seenArabic.has("ayn") && seenArabic.has("ha")) api.award("explore_contextual");
            }
          } else {
            const g = HANZI_GLYPHS[api.params.hanziChar] || HANZI_GLYPHS.shui;
            speakPhrase(g.char, "zh-CN");
          }
        },
        stepStroke() {
          activeStep++;
          if (api.params.scriptMode === "hanzi" && api.params.hanziChar === "qing_water" && activeStep >= 5) {
            api.award("qing_phonosemantic");
          }
          draw();
        },
        clearInk() {
          userStrokes = [];
          draw();
        },
        destroy() {},
      };
    },
  });

  /* =========================================================================
   * 3. CONJUGATION MATRIX — European Grammar & Conjugation Matrix (DE · IT · FR)
   * ========================================================================= */
  const GERMAN_CASES = [
    {
      kase: "Nominativ (Subjekt — Wer/Was?)",
      m: "der kluge Hund",
      f: "die kluge Katze",
      n: "das kluge Kind",
      pl: "die klugen Bücher",
      indef: "ein / eine / ein",
    },
    {
      kase: "Akkusativ (Direktes Objekt — Wen/Was?)",
      m: "den klugen Hund ★",
      f: "die kluge Katze",
      n: "das kluge Kind",
      pl: "die klugen Bücher",
      indef: "einen ★ / eine / ein",
    },
    {
      kase: "Dativ (Indirektes Objekt — Wem?)",
      m: "dem klugen Hund",
      f: "der klugen Katze",
      n: "dem klugen Kind",
      pl: "den klugen Büchern (+n)",
      indef: "einem / einer / einem",
    },
    {
      kase: "Genitiv (Besitz — Wessen?)",
      m: "des klugen Hundes (+s)",
      f: "der klugen Katze",
      n: "des klugen Kindes (+es)",
      pl: "der klugen Bücher",
      indef: "eines / einer / eines",
    },
  ];

  const GERMAN_WORD_ORDER = {
    v2: {
      label: "Hauptsatz (Main Clause — Verb-Second V2 Rule)",
      slots: [
        { role: "Vorfeld (Pos 1)", word: "Heute", color: "#67e8f9" },
        { role: "Linke Klammer (V2 Finite Verb)", word: "gibt", color: "#ffd166" },
        { role: "Subjekt (NOM)", word: "der Professor", color: "#7c9cff" },
        { role: "Ind. Obj (DAT)", word: "der Studentin", color: "#6ee7b7" },
        { role: "Dir. Obj (AKK)", word: "den klugen Rat.", color: "#ff8fab" },
      ],
      spoken: "Heute gibt der Professor der Studentin den klugen Rat.",
      translation: "Today the professor gives the (female) student the wise advice.",
    },
    nebensatz: {
      label: "Nebensatz (Subordinate Clause — Conjunction + Verb-Final Rule)",
      slots: [
        { role: "Subjunktion", word: "... weil", color: "#c084fc" },
        { role: "Subjekt (NOM)", word: "der Professor", color: "#7c9cff" },
        { role: "Time + DAT Obj", word: "heute der Studentin", color: "#6ee7b7" },
        { role: "AKK Obj", word: "den klugen Rat", color: "#ff8fab" },
        { role: "Verb-Endstellung (V-Final)", word: "gibt.", color: "#ffd166" },
      ],
      spoken: "Weil der Professor heute der Studentin den klugen Rat gibt.",
      translation: "... because the professor gives the student the wise advice today.",
    },
  };

  const ITALIAN_PARADIGMS = {
    parlare: {
      inf: "parlare (-are regular, 'to speak')",
      tenses: {
        presente: ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"],
        passato: ["ho parlato", "hai parlato", "ha parlato", "abbiamo parlato", "avete parlato", "hanno parlato"],
        imperfetto: ["parlavo", "parlavi", "parlava", "parlavamo", "parlavate", "parlavano"],
        congiuntivo: ["che io parli", "che tu parli", "che lui parli", "che parliamo", "che parliate", "che parlino"],
        condizionale: ["parlerei", "parleresti", "parlerebbe", "parleremmo", "parlereste", "parlerebbero"],
      },
      sample: { it: "Penso che tu parli italiano molto bene!", en: "I think that you speak Italian very well! (Congiuntivo)" },
    },
    essere: {
      inf: "essere (irregular auxiliary, 'to be')",
      tenses: {
        presente: ["sono", "sei", "è", "siamo", "siete", "sono"],
        passato: ["sono stato/a", "sei stato/a", "è stato/a", "siamo stati/e", "siete stati/e", "sono stati/e"],
        imperfetto: ["ero", "eri", "era", "eravamo", "eravate", "erano"],
        congiuntivo: ["che io sia", "che tu sia", "che lui sia", "che siamo", "che siate", "che siano"],
        condizionale: ["sarei", "saresti", "sarebbe", "saremmo", "sareste", "sarebbero"],
      },
      sample: { it: "Se avessi tempo, sarei già a Roma.", en: "If I had time, I would already be in Rome." },
    },
    andare: {
      inf: "andare (irregular motion verb — takes ESSERE in Passato Prossimo)",
      tenses: {
        presente: ["vado", "vai", "va", "andiamo", "andate", "vanno"],
        passato: ["sono andato/a", "sei andato/a", "è andato/a", "siamo andati/e", "siete andati/e", "sono andati/e"],
        imperfetto: ["andavo", "andavi", "andava", "andavamo", "andavate", "andavano"],
        congiuntivo: ["che io vada", "che tu vada", "che lui vada", "che andiamo", "che andiate", "che vadano"],
        condizionale: ["andrei", "andresti", "andrebbe", "andremmo", "andreste", "andrebbero"],
      },
      sample: { it: "Ieri siamo andati al caffè in centro.", en: "Yesterday we went to the café downtown." },
    },
  };

  const FRENCH_PARADIGMS = {
    parler: {
      inf: "parler (-er 1st group, 'to speak') + Liaison rules",
      tenses: {
        presente: ["je parle", "tu parles", "il/elle parle", "nous parlons", "vous‿avez / parlez", "ils parlent (silent -ent)"],
        passato: ["j'ai parlé", "tu as parlé", "il a parlé", "nous‿avons parlé", "vous‿avez parlé", "ils‿ont parlé"],
        imperfetto: ["je parlais", "tu parlais", "il parlait", "nous parlions", "vous parliez", "ils parlaient"],
        congiuntivo: ["que je parle", "que tu parles", "qu'il parle", "que nous parlions", "que vous parliez", "qu'ils parlent"],
        condizionale: ["je parlerai (Futur)", "tu parleras", "il parlera", "nous parlerons", "vous parlerez", "ils parleront"],
      },
      sample: {
        fr: "Nous avons parlé avec les étudiants à Paris.",
        liaison: "Nous‿avons [nu.za.vɔ̃] · les‿étudiants [le.ze.ty.djɑ̃] (Mandatory Liaison ‿)",
        en: "We spoke with the students in Paris.",
      },
    },
    etre: {
      inf: "être (irregular auxiliary, 'to be')",
      tenses: {
        presente: ["je suis", "tu es", "il/elle est", "nous sommes", "vous‿êtes [vu.zɛt]", "ils sont"],
        passato: ["j'ai été", "tu as été", "il a été", "nous‿avons été", "vous‿avez été", "ils‿ont été"],
        imperfetto: ["j'étais", "tu étais", "il était", "nous‿étions", "vous‿étiez", "ils‿étaient"],
        congiuntivo: ["que je sois", "que tu sois", "qu'il soit", "que nous soyons", "que vous soyez", "qu'ils soient"],
        condizionale: ["je serai (Futur)", "tu seras", "il sera", "nous serons", "vous serez", "ils seront"],
      },
      sample: {
        fr: "Il faut que vous soyez prêts avant midi.",
        liaison: "vous‿êtes [vu.zɛt] · ils‿étaient [il.ze.tɛ]",
        en: "It is necessary that you be ready before noon (Subjonctif).",
      },
    },
    aller: {
      inf: "aller (irregular motion — takes ÊTRE in Passé Composé)",
      tenses: {
        presente: ["je vais", "tu vas", "il/elle va", "nous‿allons", "vous‿allez", "ils vont"],
        passato: ["je suis‿allé(e)", "tu es‿allé(e)", "il est‿allé", "nous sommes‿allés", "vous‿êtes‿allés", "ils sont‿allés"],
        imperfetto: ["j'allais", "tu allais", "il allait", "nous‿allions", "vous‿alliez", "ils‿allaient"],
        congiuntivo: ["que j'aille", "que tu ailles", "qu'il aille", "que nous‿allions", "que vous‿alliez", "qu'ils‿aillent"],
        condizionale: ["j'irai (Futur)", "tu iras", "il ira", "nous‿irons", "vous‿irez", "ils‿iront"],
      },
      sample: {
        fr: "Nous sommes allés à la gare ce matin.",
        liaison: "Nous sommes‿allés [nu sɔm.za.le]",
        en: "We went to the train station this morning.",
      },
    },
  };

  S.register({
    id: "conjugation_matrix",
    name: "European Grammar & Conjugation Matrix (German · Italian · French)",
    domains: ["languages"],
    description:
      "Compare German 4-case declensions & V2/Nebensatz word order with Italian and French tense/mood conjugation grids (Presente, Passato Prossimo/Passé Composé, Imperfetto, Subjunctive, plus French Liaison ‿).",
    params: [
      {
        key: "euroLang",
        label: "Target European Language",
        type: "select",
        value: "de",
        options: [
          { value: "de", label: "🇩🇪 German — 4 Cases × 3 Genders + V2/Nebensatz Syntax" },
          { value: "it", label: "🇮🇹 Italian — 6-Person Verb Conjugation & Subjunctive" },
          { value: "fr", label: "🇫🇷 French — Verb Conjugation, Subjonctif & Liaison (‿)" },
        ],
      },
      {
        key: "tenseOrClause",
        label: "Tense / Mood (IT·FR) or Clause Type (DE)",
        type: "select",
        value: "presente",
        options: [
          { value: "presente", label: "Presente / Présent  |  DE: Hauptsatz (V2 Main Clause)" },
          { value: "passato", label: "Passato Prossimo / Passé Composé  |  DE: Nebensatz (Verb-Final)" },
          { value: "imperfetto", label: "Imperfetto / Imparfait" },
          { value: "congiuntivo", label: "Congiuntivo / Subjonctif (Mood of Doubt/Desire)" },
          { value: "condizionale", label: "Condizionale (IT) / Futur Simple (FR)" },
        ],
      },
      {
        key: "verbChoice",
        label: "Verb Paradigm (IT / FR)",
        type: "select",
        value: "regular",
        options: [
          { value: "regular", label: "parlare (IT) / parler (FR) — Regular 1st Conjugation" },
          { value: "be", label: "essere (IT) / être (FR) — Auxiliary 'to be'" },
          { value: "go", label: "andare (IT) / aller (FR) — Motion verb (takes essere/être)" },
        ],
      },
    ],
    actions: [
      { label: "🔊 Speak Sentence", fn: (h) => h.speak() },
      { label: "🎲 Next Morphological Drill", fn: (h) => h.nextDrill() },
    ],
    challenges: [
      {
        id: "de_nebensatz",
        text: "In German mode, toggle between Hauptsatz (V2) and Nebensatz (Verb-Final) and hear the spoken sentence.",
        xp: 15,
      },
      {
        id: "it_congiuntivo",
        text: "Switch to Italian, inspect the Congiuntivo (subjunctive) across all 6 persons, and run a Morphological Drill.",
        xp: 15,
      },
      {
        id: "fr_liaison_pass",
        text: "Switch to French, explore aller in Passé Composé (être auxiliary + participle agreement + liaison ‿).",
        xp: 20,
      },
    ],
    mount(el, api) {
      const view = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 });
      const { canvas, ctx } = view;
      let highlightRow = 0;
      let drillIdx = 0;
      const seenDe = new Set();

      const DRILLS = [
        { q: "DE: 'I see the wise dog' (masc. direct object) → Ich sehe ___", a: "den klugen Hund (Akkusativ Maskulin -en)" },
        { q: "IT: 'I think that you speak well' → Penso che tu ___ bene", a: "parli (Congiuntivo Presente, 2nd sg.)" },
        { q: "FR: 'We went to the station' → Nous ___ à la gare", a: "sommes‿allés (Passé Composé with être + -s agreement)" },
        { q: "DE: Subordinate clause word order after 'weil' (because)?", a: "Conjugated verb moves to the very end (Verb-Endstellung)" },
      ];

      function draw() {
        const w = view.width || 640;
        const h = view.height || 360;
        const C = api.colors;
        const lang = api.params.euroLang;
        const tc = api.params.tenseOrClause;
        const vc = api.params.verbChoice;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, w, h);

        if (lang === "de") {
          const isNebensatz = tc === "passato" || tc === "congiuntivo";
          const clause = isNebensatz ? GERMAN_WORD_ORDER.nebensatz : GERMAN_WORD_ORDER.v2;
          seenDe.add(isNebensatz ? "neb" : "v2");
          if (seenDe.size >= 2) api.award("de_nebensatz");

          // Title
          ctx.fillStyle = C.accent;
          ctx.font = "bold 15px Inter, system-ui, sans-serif";
          ctx.fillText("🇩🇪 German Case Declension Matrix (Artikel + Adjektiv) & Satzklammer", 18, 24);

          // Case table (4 rows x 5 cols)
          const headers = ["Kasus (Case)", "Maskulin (der)", "Feminin (die)", "Neutrum (das)", "Plural (die)"];
          const tx = 18;
          const ty = 36;
          const tw = w - 36;
          const rh = Math.round(h * 0.11);
          const colW = [tw * 0.28, tw * 0.18, tw * 0.18, tw * 0.18, tw * 0.18];

          // Header row
          let cx = tx;
          ctx.fillStyle = "#1d2340";
          roundRect(ctx, tx, ty, tw, rh, 6);
          ctx.fill();
          headers.forEach((hd, i) => {
            ctx.fillStyle = C.primary;
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.fillText(hd, cx + 8, ty + rh * 0.62);
            cx += colW[i];
          });

          GERMAN_CASES.forEach((row, rIdx) => {
            const ry = ty + (rIdx + 1) * (rh + 3);
            const active = rIdx === highlightRow % 4;
            ctx.fillStyle = active ? "rgba(124, 156, 255, 0.18)" : "#15192c";
            roundRect(ctx, tx, ry, tw, rh, 6);
            ctx.fill();

            const vals = [row.kase, row.m, row.f, row.n, row.pl];
            let rx = tx;
            vals.forEach((v, cIdx) => {
              ctx.fillStyle = cIdx === 0 ? C.accent : v.includes("★") ? C.secondary : C.text;
              ctx.font = cIdx === 0 ? "bold 11px Inter, sans-serif" : "11px Inter, sans-serif";
              ctx.fillText(v, rx + 8, ry + rh * 0.62);
              rx += colW[cIdx];
            });
          });

          // Word Order Visualizer (V2 vs Nebensatz)
          const wy = ty + 5 * (rh + 3) + 8;
          ctx.fillStyle = C.ok;
          ctx.font = "bold 12px Inter, sans-serif";
          ctx.fillText(`Syntax Topology: ${clause.label}`, tx, wy);

          const sw = (tw - 24) / clause.slots.length;
          const sh = Math.round(h * 0.17);
          clause.slots.forEach((s, i) => {
            const sx = tx + i * (sw + 6);
            const sy = wy + 8;
            ctx.fillStyle = "#161a2e";
            roundRect(ctx, sx, sy, sw, sh, 8);
            ctx.fill();
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = s.color;
            ctx.font = "bold 10px Inter, sans-serif";
            ctx.fillText(s.role, sx + 8, sy + 16);

            ctx.fillStyle = C.text;
            ctx.font = "bold 13px Inter, sans-serif";
            ctx.fillText(s.word, sx + 8, sy + sh - 12);
          });

          const drill = DRILLS[drillIdx % DRILLS.length];
          api.readout({
            "Active Clause Syntax": clause.label,
            "German Sentence": clause.spoken,
            "English Gloss": clause.translation,
            "Active Drill": `${drill.q} → ${drill.a}`,
          });
          api.setStatus("Click any row in the German case matrix to inspect Nominativ/Akkusativ/Dativ/Genitiv endings.");
        } else {
          // Italian or French 6-person conjugation paradigm
          const isIt = lang === "it";
          const bank = isIt ? ITALIAN_PARADIGMS : FRENCH_PARADIGMS;
          const vKey = vc === "be" ? (isIt ? "essere" : "etre") : vc === "go" ? (isIt ? "andare" : "aller") : isIt ? "parlare" : "parler";
          const paradigm = bank[vKey];
          const forms = paradigm.tenses[tc] || paradigm.tenses.presente;
          const pronouns = isIt
            ? ["1sg · io", "2sg · tu", "3sg · lui / lei", "1pl · noi", "2pl · voi", "3pl · loro"]
            : ["1sg · je", "2sg · tu", "3sg · il / elle / on", "1pl · nous", "2pl · vous", "3pl · ils / elles"];

          if (!isIt && vKey === "aller" && tc === "passato") {
            api.award("fr_liaison_pass");
          }

          ctx.fillStyle = C.accent;
          ctx.font = "bold 15px Inter, system-ui, sans-serif";
          ctx.fillText(
            `${isIt ? "🇮🇹 Italian" : "🇫🇷 French"} Verb Paradigm: ${paradigm.inf}  [${tc.toUpperCase()}]`,
            18,
            26
          );

          // 2 columns x 3 rows of person cards (Singular on left, Plural on right)
          const gx = 18;
          const gy = 40;
          const gw = (w - 48) / 2;
          const gh = Math.round(h * 0.16);

          for (let i = 0; i < 6; i++) {
            const col = i < 3 ? 0 : 1;
            const row = i % 3;
            const cx = gx + col * (gw + 12);
            const cy = gy + row * (gh + 8);
            const active = highlightRow % 6 === i;

            ctx.fillStyle = active ? "rgba(124, 156, 255, 0.22)" : "#161a2e";
            roundRect(ctx, cx, cy, gw, gh, 10);
            ctx.fill();
            ctx.strokeStyle = active ? C.accent : "rgba(255,255,255,0.08)";
            ctx.stroke();

            ctx.fillStyle = C.muted;
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.fillText(pronouns[i], cx + 14, cy + 20);

            ctx.fillStyle = C.text;
            ctx.font = "bold 16px Inter, sans-serif";
            ctx.fillText(forms[i], cx + 14, cy + gh - 14);
          }

          // Sentence banner at bottom
          const by = gy + 3 * (gh + 8) + 6;
          const bh = h - by - 12;
          ctx.fillStyle = "#14182b";
          roundRect(ctx, 18, by, w - 36, bh, 10);
          ctx.fill();

          const sampleText = isIt ? paradigm.sample.it : paradigm.sample.fr;
          ctx.fillStyle = C.ok;
          ctx.font = "bold 14px Inter, sans-serif";
          ctx.fillText(`Example: "${sampleText}"`, 30, by + 24);

          ctx.fillStyle = C.muted;
          ctx.font = "12px Inter, sans-serif";
          ctx.fillText(
            isIt
              ? `Translation: "${paradigm.sample.en}"`
              : `Phonetics: ${paradigm.sample.liaison}   ·   "${paradigm.sample.en}"`,
            30,
            by + 46
          );

          const drill = DRILLS[drillIdx % DRILLS.length];
          api.readout({
            "Language & Verb": `${isIt ? "Italian" : "French"} — ${paradigm.inf}`,
            "Selected Person": `${pronouns[highlightRow % 6]} → ${forms[highlightRow % 6]}`,
            "Exemplar Sentence": sampleText,
            "Morphological Drill": `${drill.q} → ${drill.a}`,
          });
          api.setStatus("Click any conjugation card to select that grammatical person, or press '🔊 Speak Sentence'.");
        }
      }

      api.pointer(canvas, {
        down() {
          highlightRow++;
          draw();
        },
      });

      api.onParam(() => draw());
      api.onResize(() => draw());
      draw();

      return {
        speak() {
          const lang = api.params.euroLang;
          if (lang === "de") {
            const isNebensatz = api.params.tenseOrClause === "passato" || api.params.tenseOrClause === "congiuntivo";
            const clause = isNebensatz ? GERMAN_WORD_ORDER.nebensatz : GERMAN_WORD_ORDER.v2;
            speakPhrase(clause.spoken, "de");
            seenDe.add(isNebensatz ? "neb" : "v2");
            if (seenDe.size >= 2) api.award("de_nebensatz");
          } else if (lang === "it") {
            const vc = api.params.verbChoice;
            const vKey = vc === "be" ? "essere" : vc === "go" ? "andare" : "parlare";
            speakPhrase(ITALIAN_PARADIGMS[vKey].sample.it, "it");
          } else {
            const vc = api.params.verbChoice;
            const vKey = vc === "be" ? "etre" : vc === "go" ? "aller" : "parler";
            speakPhrase(FRENCH_PARADIGMS[vKey].sample.fr, "fr");
          }
        },
        nextDrill() {
          drillIdx++;
          highlightRow++;
          if (api.params.euroLang === "it" && api.params.tenseOrClause === "congiuntivo") {
            api.award("it_congiuntivo");
          }
          draw();
        },
        destroy() {},
      };
    },
  });

  /* =========================================================================
   * 4. SEMITIC ROOT WEAVER — Arabic Triliteral Root (Jizr) & Pattern (Wazn) Weaver
   * ========================================================================= */
  const SEMITIC_ROOTS = {
    ktb: {
      c: ["ك", "ت", "ب"],
      tr: ["k", "t", "b"],
      core: "writing / inscription / books",
      words: {
        f1: { ar: "كَتَبَ", tr: "kataba", gloss: "he wrote (basic transitive action)" },
        f2: { ar: "كَتَّبَ", tr: "kattaba", gloss: "he made someone write / dictated (intensive/causative)" },
        f3: { ar: "كَاتَبَ", tr: "kātaba", gloss: "he corresponded with (reciprocal action)" },
        f4: { ar: "أَكْتَبَ", tr: "ʾaktaba", gloss: "he dictated to someone (causative)" },
        f5: { ar: "تَكَتَّبَ", tr: "takattaba", gloss: "it was written / formed squadrons (reflexive of II)" },
        f6: { ar: "تَكَاتَبَ", tr: "takātaba", gloss: "they wrote to one another (mutual correspondence)" },
        f7: { ar: "اِنْكَتَبَ", tr: "inkataba", gloss: "he subscribed / was inscribed (passive/middle)" },
        f8: { ar: "اِكْتَتَبَ", tr: "iktataba", gloss: "he registered / copied / enrolled" },
        f10: { ar: "اِسْتَكْتَبَ", tr: "istaktaba", gloss: "he asked someone to write (requestative)" },
        fail: { ar: "كَاتِب", tr: "kātib", gloss: "writer / author / clerk (Active Participle)" },
        maful: { ar: "مَكْتُوب", tr: "maktūb", gloss: "written / letter / destiny (Passive Participle)" },
        mafal: { ar: "مَكْتَب", tr: "maktab", gloss: "office / desk (Noun of Place — ism makān)" },
        mifal: { ar: "مِكْتَاب", tr: "miktāb", gloss: "typewriter / writing instrument (Noun of Instrument)" },
        fiala: { ar: "كِتَابَة", tr: "kitāba", gloss: "writing / calligraphy / secretariat (Verbal Noun / Craft)" },
      },
    },
    alm: {
      c: ["ع", "ل", "م"],
      tr: ["ʿ", "l", "m"],
      core: "knowledge / knowing / marking",
      words: {
        f1: { ar: "عَلِمَ", tr: "ʿalima", gloss: "he knew / became aware" },
        f2: { ar: "عَلَّمَ", tr: "ʿallama", gloss: "he taught (caused to know — geminated middle C₂)" },
        f3: { ar: "عَالَمَ", tr: "ʿālama", gloss: "he vied in knowledge with" },
        f4: { ar: "أَعْلَمَ", tr: "ʾaʿlama", gloss: "he informed / notified someone" },
        f5: { ar: "تَعَلَّمَ", tr: "taʿallama", gloss: "he learned / studied (reflexive of 'taught')" },
        f6: { ar: "تَعَالَمَ", tr: "taʿālama", gloss: "everyone knew / feigned knowledge" },
        f7: { ar: "اِنْعَلَمَ", tr: "inʿalama", gloss: "it became known / marked" },
        f8: { ar: "اِعْتَلَمَ", tr: "iʿtalama", gloss: "he learned / took notice" },
        f10: { ar: "اِسْتَعْلَمَ", tr: "istaʿlama", gloss: "he inquired / asked for information" },
        fail: { ar: "عَالِم", tr: "ʿālim", gloss: "scholar / scientist (one who knows)" },
        maful: { ar: "مَعْلُوم", tr: "maʿlūm", gloss: "known / معلومة maʿlūma = piece of information" },
        mafal: { ar: "مَعْلَم", tr: "maʿlam", gloss: "landmark / signpost (place of knowing)" },
        mifal: { ar: "مِعْلَام", tr: "miʿlām", gloss: "indicator / instrument of knowledge" },
        fiala: { ar: "عِلَامَة", tr: "ʿilāma", gloss: "sign / emblem / badge" },
      },
    },
    slm: {
      c: ["س", "ل", "م"],
      tr: ["s", "l", "m"],
      core: "peace / safety / soundness / wholeness",
      words: {
        f1: { ar: "سَلِمَ", tr: "salima", gloss: "he was safe / unharmed / intact" },
        f2: { ar: "سَلَّمَ", tr: "sallama", gloss: "he greeted (said Salām) / delivered / handed over" },
        f3: { ar: "سَالَمَ", tr: "sālama", gloss: "he made peace with someone" },
        f4: { ar: "أَسْلَمَ", tr: "ʾaslama", gloss: "he submitted / committed himself to peace" },
        f5: { ar: "تَسَلَّمَ", tr: "tasallama", gloss: "he received / took delivery" },
        f6: { ar: "تَسَالَمَ", tr: "tasālama", gloss: "they reconciled / made mutual peace" },
        f7: { ar: "اِنْسَلَمَ", tr: "insalama", gloss: "it was kept safe" },
        f8: { ar: "اِسْتَلَمَ", tr: "istalama", gloss: "he received / touched (e.g., the cornerstone)" },
        f10: { ar: "اِسْتَسْلَمَ", tr: "istaslama", gloss: "he surrendered / yielded" },
        fail: { ar: "سَالِم", tr: "sālim", gloss: "safe / sound / intact" },
        maful: { ar: "مَسْلُوم", tr: "maslūm", gloss: "kept safe / undisputed" },
        mafal: { ar: "مَسْلَم", tr: "maslam", gloss: "haven / place of safety" },
        mifal: { ar: "مِسْلَام", tr: "mislām", gloss: "peacemaker" },
        fiala: { ar: "سَلَامَة", tr: "salāma", gloss: "safety / well-being / security" },
      },
    },
    hkm: {
      c: ["ح", "ك", "م"],
      tr: ["ḥ", "k", "m"],
      core: "judgment / wisdom / governance",
      words: {
        f1: { ar: "حَكَمَ", tr: "ḥakama", gloss: "he judged / ruled / governed" },
        f2: { ar: "حَكَّمَ", tr: "ḥakkama", gloss: "he appointed as arbitrator" },
        f3: { ar: "حَاكَمَ", tr: "ḥākama", gloss: "he prosecuted / brought to trial" },
        f4: { ar: "أَحْكَمَ", tr: "ʾaḥkama", gloss: "he perfected / mastered / made firm" },
        f5: { ar: "تَحَكَّمَ", tr: "taḥakkama", gloss: "he controlled / exercised authority" },
        f6: { ar: "تَحَاكَمَ", tr: "taḥākama", gloss: "they went to court together" },
        f7: { ar: "اِنْحَكَمَ", tr: "inḥakama", gloss: "it was governed / regulated" },
        f8: { ar: "اِحْتَكَمَ", tr: "iḥtakama", gloss: "he appealed for judgment" },
        f10: { ar: "اِسْتَحْكَمَ", tr: "istaḥkama", gloss: "it became entrenched / fortified" },
        fail: { ar: "حَاكِم", tr: "ḥākim", gloss: "ruler / governor / judge" },
        maful: { ar: "مَحْكُوم", tr: "maḥkūm", gloss: "governed / sentenced" },
        mafal: { ar: "مَحْكَمَة", tr: "maḥkama", gloss: "courthouse / tribunal (Noun of Place)" },
        mifal: { ar: "مِحْكَام", tr: "miḥkām", gloss: "criterion / wise instrument" },
        fiala: { ar: "حِكْمَة", tr: "ḥikma", gloss: "wisdom / philosophy / aphorism" },
      },
    },
    drs: {
      c: ["د", "ر", "س"],
      tr: ["d", "r", "s"],
      core: "studying / learning / treading a path",
      words: {
        f1: { ar: "دَرَسَ", tr: "darasa", gloss: "he studied" },
        f2: { ar: "دَرَّسَ", tr: "darrasa", gloss: "he taught / instructed (causative of study)" },
        f3: { ar: "دَارَسَ", tr: "dārasa", gloss: "he studied together with someone" },
        f4: { ar: "أَدْرَسَ", tr: "ʾadrasa", gloss: "he caused to study" },
        f5: { ar: "تَدَرَّسَ", tr: "tadarrasa", gloss: "he studied step by step" },
        f6: { ar: "تَدَارَسَ", tr: "tadārasa", gloss: "they studied / discussed mutually" },
        f7: { ar: "اِنْدَرَسَ", tr: "indarasa", gloss: "it was effaced / worn down by time" },
        f8: { ar: "اِدَّرَسَ", tr: "iddarasa", gloss: "he studied intently" },
        f10: { ar: "اِسْتَدْرَسَ", tr: "istadrasa", gloss: "he sought instruction" },
        fail: { ar: "دَارِس", tr: "dāris", gloss: "student / researcher (Active Participle)" },
        maful: { ar: "مَدْرُوس", tr: "madrūs", gloss: "studied / carefully considered" },
        mafal: { ar: "مَدْرَسَة", tr: "madrasa", gloss: "school (Noun of Place — where one studies!)" },
        mifal: { ar: "مِدْرَاس", tr: "midrās", gloss: "study hall / academy" },
        fiala: { ar: "دِرَاسَة", tr: "dirāsa", gloss: "study / scholarship" },
      },
    },
    aml: {
      c: ["ع", "م", "ل"],
      tr: ["ʿ", "m", "l"],
      core: "working / making / operating",
      words: {
        f1: { ar: "عَمِلَ", tr: "ʿamila", gloss: "he worked / did / acted" },
        f2: { ar: "عَمَّلَ", tr: "ʿammala", gloss: "he appointed as governor / processed" },
        f3: { ar: "عَامَلَ", tr: "ʿāmala", gloss: "he treated / dealt with someone" },
        f4: { ar: "أَعْمَلَ", tr: "ʾaʿmala", gloss: "he put to work / applied (e.g., his mind)" },
        f5: { ar: "تَعَمَّلَ", tr: "taʿammala", gloss: "he labored / took pains" },
        f6: { ar: "تَعَامَلَ", tr: "taʿāmala", gloss: "they interacted / did business together" },
        f7: { ar: "اِنْعَمَلَ", tr: "inʿamala", gloss: "it was made / done (passive)" },
        f8: { ar: "اِعْتَمَلَ", tr: "iʿtamala", gloss: "it worked / fermented within" },
        f10: { ar: "اِسْتَعْمَلَ", tr: "istaʿmala", gloss: "he used / employed (sought work from)" },
        fail: { ar: "عَامِل", tr: "ʿāmil", gloss: "worker / factor / agent" },
        maful: { ar: "مَعْمُول", tr: "maʿmūl", gloss: "made / done (also date-filled pastry!)" },
        mafal: { ar: "مَعْمَل", tr: "maʿmal", gloss: "laboratory / factory (place of work)" },
        mifal: { ar: "مِعْمَال", tr: "miʿmāl", gloss: "high-output tool" },
        fiala: { ar: "عِمَالَة", tr: "ʿimāla", gloss: "employment / labor force" },
      },
    },
  };

  const WAZN_PATTERNS = {
    f1: { name: "Form I — فَعَلَ (faʿala)", schema: "C₁ a C₂ a C₃ a", role: "Base triliteral lexical meaning" },
    f2: { name: "Form II — فَعَّلَ (faʿʿala)", schema: "C₁ a C₂C₂ a C₃ a", role: "Intensive / Causative (geminated middle C₂)" },
    f3: { name: "Form III — فَاعَلَ (fāʿala)", schema: "C₁ ā C₂ a C₃ a", role: "Reciprocal / Associative action ('with someone')" },
    f4: { name: "Form IV — أَفْعَلَ (ʾafʿala)", schema: "ʾa C₁ C₂ a C₃ a", role: "Transitive / Direct Causative" },
    f5: { name: "Form V — تَفَعَّلَ (tafaʿʿala)", schema: "ta C₁ a C₂C₂ a C₃ a", role: "Reflexive / Gradual result of Form II" },
    f6: { name: "Form VI — تَفَاعَلَ (tafāʿala)", schema: "ta C₁ ā C₂ a C₃ a", role: "Mutual / Cooperative action of Form III" },
    f7: { name: "Form VII — اِنْفَعَلَ (infaʿala)", schema: "in C₁ a C₂ a C₃ a", role: "Passive / Anticausative middle voice" },
    f8: { name: "Form VIII — اِفْتَعَلَ (iftaʿala)", schema: "i C₁ ta C₂ a C₃ a", role: "Middle / Reflexive with infixed -t- after C₁" },
    f10: { name: "Form X — اِسْتَفْعَلَ (istafʿala)", schema: "ista C₁ C₂ a C₃ a", role: "Seeking / Requesting / Considering (ist- prefix)" },
    fail: { name: "Ism Fāʿil — فَاعِل (fāʿil)", schema: "C₁ ā C₂ i C₃", role: "Active Participle / Doer of the action" },
    maful: { name: "Ism Mafʿūl — مَفْعُول (mafʿūl)", schema: "ma C₁ C₂ ū C₃", role: "Passive Participle / Object of the action" },
    mafal: { name: "Ism Makān — مَفْعَل (mafʿal)", schema: "ma C₁ C₂ a C₃ (a)", role: "Noun of Place / Time where the root occurs" },
    mifal: { name: "Ism Āla — مِفْعَال (mifʿāl)", schema: "mi C₁ C₂ ā C₃", role: "Noun of Instrument / Tool" },
    fiala: { name: "Maṣdar / Craft — فِعَالَة (fiʿāla)", schema: "C₁ i C₂ ā C₃ a", role: "Profession / Craft / Verbal Noun" },
  };

  S.register({
    id: "semitic_root_weaver",
    name: "Arabic Triliteral Root (Jizr) & Pattern (Wazn) Weaver",
    domains: ["languages"],
    description:
      "Weave 3-consonant Arabic roots (Jizr جذر) into Verb Forms I–X and nominal templates (Wazn وزن) on an interactive morphological loom to see how non-concatenative morphology generates entire word families.",
    params: [
      {
        key: "root",
        label: "Triliteral Root (Jizr جذر)",
        type: "select",
        value: "ktb",
        options: [
          { value: "ktb", label: "ك - ت - ب (k-t-b) — Writing & Books" },
          { value: "alm", label: "ع - ل - م (ʿ-l-m) — Knowledge & Science" },
          { value: "slm", label: "س - ل - م (s-l-m) — Peace & Safety" },
          { value: "hkm", label: "ح - ك - م (ḥ-k-m) — Judgment & Wisdom" },
          { value: "drs", label: "د - ر - س (d-r-s) — Study & Instruction" },
          { value: "aml", label: "ع - م - ل (ʿ-m-l) — Work & Action" },
        ],
      },
      {
        key: "wazn",
        label: "Morphological Pattern (Wazn وزن)",
        type: "select",
        value: "f1",
        options: [
          { value: "f1", label: "Form I: فَعَلَ (faʿala) — Base Verb" },
          { value: "f2", label: "Form II: فَعَّلَ (faʿʿala) — Causative / Intensive" },
          { value: "f3", label: "Form III: فَاعَلَ (fāʿala) — Reciprocal" },
          { value: "f4", label: "Form IV: أَفْعَلَ (ʾafʿala) — Transitive Causative" },
          { value: "f5", label: "Form V: تَفَعَّلَ (tafaʿʿala) — Reflexive of II" },
          { value: "f6", label: "Form VI: تَفَاعَلَ (tafāʿala) — Mutual Action" },
          { value: "f7", label: "Form VII: اِنْفَعَلَ (infaʿala) — Passive" },
          { value: "f8", label: "Form VIII: اِفْتَعَلَ (iftaʿala) — Infix -t- Reflexive" },
          { value: "f10", label: "Form X: اِسْتَفْعَلَ (istafʿala) — Requestative" },
          { value: "fail", label: "Participle: فَاعِل (fāʿil) — Doer / Agent" },
          { value: "maful", label: "Participle: مَفْعُول (mafʿūl) — Object / Done" },
          { value: "mafal", label: "Place Noun: مَفْعَل (mafʿal) — Place of Action" },
          { value: "mifal", label: "Instrument: مِفْعَال (mifʿāl) — Tool" },
          { value: "fiala", label: "Craft Noun: فِعَالَة (fiʿāla) — Profession" },
        ],
      },
    ],
    actions: [
      { label: "🔊 Hear Arabic Word", fn: (h) => h.speak() },
      { label: "🧵 Weave Next Pattern", fn: (h) => h.nextPattern() },
    ],
    challenges: [
      {
        id: "alm_causative",
        text: "Select root ع-ل-م (ʿ-l-m) and compare Form I عَلِمَ (he knew), Form II عَلَّمَ (he taught), and Form V تَعَلَّمَ (he learned).",
        xp: 20,
      },
      {
        id: "place_nouns",
        text: "Weave the Place Noun pattern مَفْعَل (mafʿal) across ك-ت-ب (maktab office) and د-ر-س (madrasa school).",
        xp: 15,
      },
      {
        id: "form_ten_seeker",
        text: "Weave Form X اِسْتَفْعَلَ (istafʿala) and press '🔊 Hear Arabic Word' to hear the requestative prefix ista-.",
        xp: 15,
      },
    ],
    mount(el, api) {
      const view = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 });
      const { canvas, ctx } = view;
      let weaveAnim = 1;
      const almSeen = new Set();
      const placeSeen = new Set();

      function checkChallenges() {
        const r = api.params.root;
        const wz = api.params.wazn;
        if (r === "alm" && (wz === "f1" || wz === "f2" || wz === "f5")) {
          almSeen.add(wz);
          if (almSeen.size >= 3) api.award("alm_causative");
        }
        if (wz === "mafal" && (r === "ktb" || r === "drs")) {
          placeSeen.add(r);
          if (placeSeen.size >= 2) api.award("place_nouns");
        }
      }

      function draw() {
        const w = view.width || 640;
        const h = view.height || 360;
        const C = api.colors;
        const rKey = api.params.root;
        const wKey = api.params.wazn;
        const root = SEMITIC_ROOTS[rKey] || SEMITIC_ROOTS.ktb;
        const wazn = WAZN_PATTERNS[wKey] || WAZN_PATTERNS.f1;
        const word = root.words[wKey] || root.words.f1;

        checkChallenges();

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, w, h);

        // Top Tier: 3 Root Radicals (Fāʾ, ʿAyn, Lām al-fiʿl) ordered Right-to-Left (C1 on right, C3 on left)
        const radLabels = ["Lām (C₃ — 3rd Radical)", "ʿAyn (C₂ — 2nd Radical)", "Fāʾ (C₁ — 1st Radical)"];
        const radIdx = [2, 1, 0];
        const cardW = (w - 64) / 3;
        const cardH = Math.round(h * 0.22);

        radIdx.forEach((cIdx, pos) => {
          const cx = 20 + pos * (cardW + 12);
          const cy = 14;
          ctx.fillStyle = "#161a2e";
          roundRect(ctx, cx, cy, cardW, cardH, 10);
          ctx.fill();
          ctx.strokeStyle = C.series[cIdx];
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.fillStyle = C.series[cIdx];
          ctx.font = "bold 11px Inter, sans-serif";
          ctx.fillText(radLabels[pos], cx + 12, cy + 20);

          ctx.fillStyle = C.text;
          ctx.font = `bold ${Math.round(cardH * 0.48)}px "Noto Naskh Arabic", serif`;
          ctx.fillText(`${root.c[cIdx]}  (${root.tr[cIdx]})`, cx + 16, cy + cardH - 14);
        });

        // Loom weaving threads connecting top 3 radicals into the central Wazn Crucible
        const midY = Math.round(h * 0.48);
        const loomW = Math.round(w * 0.78);
        const loomX = Math.round((w - loomW) / 2);
        const loomH = Math.round(h * 0.44);

        radIdx.forEach((cIdx, pos) => {
          const sx = 20 + pos * (cardW + 12) + cardW / 2;
          const sy = 14 + cardH;
          const tx = loomX + loomW * (0.25 + pos * 0.25);
          const ty = midY + 10;

          ctx.save();
          ctx.strokeStyle = C.series[cIdx];
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(sx, (sy + ty) / 2, tx, (sy + ty) / 2, tx, ty);
          ctx.stroke();

          // Travelling radical bead along thread
          const t = clamp(weaveAnim, 0, 1);
          const bx = sx * (1 - t) + tx * t;
          const by = sy * (1 - t) + ty * t;
          ctx.fillStyle = C.series[cIdx];
          ctx.beginPath();
          ctx.arc(bx, by, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Central Woven Word Showcase Card
        ctx.fillStyle = "#14182b";
        roundRect(ctx, loomX, midY, loomW, loomH, 14);
        ctx.fill();
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = C.primary;
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Pattern (Wazn): ${wazn.name}   ·   Template: [ ${wazn.schema} ]`, w / 2, midY + 26);

        ctx.fillStyle = C.accent;
        ctx.font = `bold ${Math.round(loomH * 0.36)}px "Noto Naskh Arabic", serif`;
        ctx.fillText(word.ar, w / 2, midY + Math.round(loomH * 0.52));

        ctx.fillStyle = C.text;
        ctx.font = "bold 16px Inter, sans-serif";
        ctx.fillText(`${word.tr}  —  "${word.gloss}"`, w / 2, midY + Math.round(loomH * 0.78));

        ctx.fillStyle = C.muted;
        ctx.font = "12px Inter, sans-serif";
        ctx.fillText(`Semantic Role: ${wazn.role}   (Root core: ${root.core})`, w / 2, midY + loomH - 12);
        ctx.textAlign = "left";

        api.readout({
          "Root (Jizr جذر)": `${root.c.join("-")} (${root.tr.join("-")}) — ${root.core}`,
          "Pattern (Wazn وزن)": `${wazn.name} [${wazn.schema}]`,
          "Woven Derivative": `${word.ar} (${word.tr})`,
          "Meaning": word.gloss,
        });
        api.setStatus("Select any 3-consonant root and weave it through Verb Forms I–X or nominal patterns.");
      }

      api.onParam(() => {
        weaveAnim = 0;
        draw();
      });
      api.onResize(() => draw());
      api.loop((dt) => {
        if (weaveAnim < 1) {
          weaveAnim = Math.min(1, weaveAnim + dt * 2.2);
          draw();
        }
      });
      draw();

      const patternOrder = Object.keys(WAZN_PATTERNS);
      return {
        speak() {
          const root = SEMITIC_ROOTS[api.params.root] || SEMITIC_ROOTS.ktb;
          const word = root.words[api.params.wazn] || root.words.f1;
          speakPhrase(word.ar, "ar");
          if (api.params.wazn === "f10") api.award("form_ten_seeker");
        },
        nextPattern() {
          const idx = patternOrder.indexOf(api.params.wazn);
          const next = patternOrder[(idx + 1) % patternOrder.length];
          api.setParam("wazn", next);
        },
        destroy() {},
      };
    },
  });

  /* =========================================================================
   * 5. DIALOGUE IMMERSION — Polyglot Immersion Roleplay Deck (5 Languages)
   * ========================================================================= */
  const DIALOGUE_DECK = {
    "zh-CN": {
      name: "🇨🇳 Mandarin Chinese (普通话)",
      scenes: {
        cafe: {
          prompt: {
            speaker: "Barista (咖啡师)",
            native: "您好！请问今天想喝点什么？手冲还是拿铁？",
            phonetic: "Nín hǎo! Qǐngwèn jīntiān xiǎng hē diǎn shénme? Shǒuchōng háishì nátiě?",
            gloss: "You(polite) good! Please-ask today want drink a-bit what? Hand-pour or latte?",
            meaning: "Hello! What would you like to drink today? Pour-over or latte?",
          },
          replies: {
            casual: {
              native: "来一杯冰拿铁，少冰不加糖，谢啦！",
              phonetic: "Lái yì bēi bīng nátiě, shǎo bīng bù jiā táng, xiè la!",
              gloss: "Come one-cup iced latte, less ice not add sugar, thanks PRT!",
              meaning: "Get me an iced latte, light ice and unsweetened, thanks!",
              note: "Uses 来 (lái) as brisk colloquial 'bring me' + sentence-final 啦 (la).",
            },
            polite: {
              native: "麻烦给我一杯热燕麦拿铁，谢谢您。",
              phonetic: "Máfan gěi wǒ yì bēi rè yànmài nátiě, xièxie nín.",
              gloss: "Trouble give me one-cup hot oat latte, thank you(hon.).",
              meaning: "Could I trouble you for a hot oat-milk latte, thank you.",
              note: "Standard polite 麻烦 (máfan, 'bother you') + honorific 您 (nín).",
            },
            formal: {
              native: "劳驾，我想点一壶云南单品手冲咖啡，烦请慢用堂食。",
              phonetic: "Láojià, wǒ xiǎng diǎn yì hú Yúnnán dānpǐn shǒuchōng kāfēi, fánqǐng mànyòng tángshí.",
              gloss: "Excuse-me, I would-like order one-pot Yunnan single-origin pour-over coffee, kindly dine-in.",
              meaning: "Pardon me, I would like to order a pot of Yunnan single-origin pour-over for here, please.",
              note: "Elevated lexical register with 劳驾 (láojià) and 烦请 (fánqǐng).",
            },
          },
        },
        rail: {
          prompt: {
            speaker: "Station Attendant (高铁乘务员)",
            native: "去往上海虹桥的G12次复兴号即将检票，请出示证件。",
            phonetic: "Qùwǎng Shànghǎi Hóngqiáo de G-shí'èr cì Fùxīng-hào jíjiāng jiǎnpiào, qǐng chūshì zhèngjiàn.",
            gloss: "Bound-for Shanghai Hongqiao MOD G12 train Fuxing about-to check-ticket, please show ID.",
            meaning: "Train G12 to Shanghai Hongqiao is about to board; please present your ID.",
          },
          replies: {
            casual: {
              native: "好嘞，请问四号车厢往哪边走？",
              phonetic: "Hǎo lei, qǐngwèn sì hào chēxiāng wǎng nǎ biān zǒu?",
              gloss: "Okay PRT, ask #4 carriage toward which side walk?",
              meaning: "Got it! Which way do I walk for Car 4?",
              note: "Warm colloquial acknowledgment 好嘞 (hǎo lei).",
            },
            polite: {
              native: "给您护照。请问去往商务座候车区怎么走？",
              phonetic: "Gěi nín hùzhào. Qǐngwèn qùwǎng shāngwùzuò hòuchēqū zěnme zǒu?",
              gloss: "Give you(hon.) passport. Please-ask bound-for business-seat waiting-zone how walk?",
              meaning: "Here is my passport. How do I get to the business-class boarding area?",
              note: "Clear polite inquiry using 请问 ... 怎么走.",
            },
            formal: {
              native: "这是我的有效证件，烦请指引前往静音车厢的站台通道。",
              phonetic: "Zhè shì wǒ de yǒuxiào zhèngjiàn, fánqǐng zhǐyǐn qiánwǎng jìngyīn chēxiāng de zhàntái tōngdào.",
              gloss: "This is my valid credential, kindly guide proceed quiet-carriage MOD platform passage.",
              meaning: "Here is my identification; kindly direct me to the platform entrance for the quiet car.",
              note: "Formal written-style disyllabic verbs (指引 zhǐyǐn, 前往 qiánwǎng).",
            },
          },
        },
        seminar: {
          prompt: {
            speaker: "Professor Lin (林教授)",
            native: "关于大语言模型与人类语言习得的差异，你有什么独到见解？",
            phonetic: "Guānyú dà yǔyán móxíng yǔ rénlèi yǔyán xídé de chāyì, nǐ yǒu shénme dúdào jiànjiě?",
            gloss: "Regarding large language model and human language acquisition MOD difference, you have what original insight?",
            meaning: "Regarding the difference between LLMs and human language acquisition, what is your view?",
          },
          replies: {
            casual: {
              native: "我觉得小孩学说话靠互动，模型主要还是靠海量文本。",
              phonetic: "Wǒ juéde xiǎohái xué shuōhuà kào hùdòng, móxíng zhǔyào háishì kào hǎiliàng wénběn.",
              gloss: "I feel kids learn speak rely interaction, model mainly still rely massive text.",
              meaning: "I think kids learn speech through interaction, while models mostly rely on massive text.",
              note: "Conversational 我觉得 (wǒ juéde).",
            },
            polite: {
              native: "依我之见，人类具备具身认知与社交意图，这是纯统计模型所缺乏的。",
              phonetic: "Yī wǒ zhī jiàn, rénlèi jùbèi jùshēn rènzhī yǔ shèjiāo yìtú, zhè shì chún tǒngjì móxíng suǒ quēfá de.",
              gloss: "According-to my view, humans possess embodied cognition and social intent, this is pure statistical model NOM lack.",
              meaning: "In my view, humans possess embodied cognition and social intent, which purely statistical models lack.",
              note: "Academic discourse frame 依我之见 ... 所缺乏的.",
            },
            formal: {
              native: "诚然，统计分布可拟合句法表征，然语用推理仍仰赖真实世界的因果交互。",
              phonetic: "Chéngrán, tǒngjì fēnbù kě nǐhé jùfǎ biǎozhēng, rán yǔyòng tuīlǐ réng yǎnglài zhēnshí shìjiè de yīnguǒ jiāohù.",
              gloss: "Indeed, statistical distribution can fit syntactic representation, yet pragmatic inference still relies-on real world causal interaction.",
              meaning: "Granted, statistical distributions can fit syntax, yet pragmatic inference relies on real-world causal interaction.",
              note: "High literary academic register (诚然 ... 然 ... 仰赖).",
            },
          },
        },
        lounge: {
          prompt: {
            speaker: "Host (主理人)",
            native: "很高兴在今晚的跨文化沙龙见到你，平时主要研究哪个领域？",
            phonetic: "Hěn gāoxìng zài jīnwǎn de kuàwénhuà shālóng jiàndào nǐ, píngshí zhǔyào yánjiū nǎge lǐngyù?",
            gloss: "Very glad at tonight MOD cross-cultural salon meet you, usually mainly research which field?",
            meaning: "So glad to meet you at tonight's cross-cultural salon! What field do you focus on?",
          },
          replies: {
            casual: {
              native: "嗨！我平时喜欢琢磨多国语言和人工智能，请多指教！",
              phonetic: "Hāi! Wǒ píngshí xǐhuan zuómo duōguó yǔyán hé réngōng zhìnéng, qǐng duō zhǐjiào!",
              gloss: "Hi! I usually like ponder multi-language and AI, please more guide!",
              meaning: "Hey! I love exploring world languages and AI—great to meet you!",
              note: "Friendly, relaxed social introduction.",
            },
            polite: {
              native: "幸会！我目前专注于计算语言学与跨语种交流，很高兴认识您。",
              phonetic: "Xìnghuì! Wǒ mùqián zhuānzhù yú jìsuàn yǔyánxué yǔ kuàyǔzhǒng jiāoliú, hěn gāoxìng rènshi nín.",
              gloss: "Charmed! I currently focus on computational linguistics and cross-lingual exchange, very glad know you.",
              meaning: "Pleasure to meet you! I currently focus on computational linguistics and cross-lingual communication.",
              note: "Polite professional greeting 幸会 (xìnghuì).",
            },
            formal: {
              native: "久仰大名，鄙人深耕比较语言学与认知科学，愿今后常与诸位切磋。",
              phonetic: "Jiǔyǎng dàmíng, bǐrén shēngēng bǐjiào yǔyánxué yǔ rènzhī kēxué, yuàn jīnhòu cháng yǔ zhūwèi qiēcuō.",
              gloss: "Long-admired great-name, humble-self cultivate comparative linguistics and cognitive science, wish hereafter often with all-of-you exchange.",
              meaning: "I have long admired your reputation; I specialize in comparative linguistics and look forward to scholarly exchange.",
              note: "Classical diplomatic courtesy (久仰大名, 切磋).",
            },
          },
        },
      },
    },
    de: {
      name: "🇩🇪 German (Deutsch)",
      scenes: {
        cafe: {
          prompt: {
            speaker: "Barista (Kaffeehaus Wien/Berlin)",
            native: "Guten Morgen! Was darf ich Ihnen heute bringen?",
            phonetic: "[ˈɡuːtn̩ ˈmɔʁɡn̩ | vas daʁf ɪç ˈiːnən ˈhɔʏtə ˈbʁɪŋən]",
            gloss: "Good morning(ACC)! What may I to-you(DAT.FORMAL) today bring(INF)?",
            meaning: "Good morning! What may I bring you today?",
          },
          replies: {
            casual: {
              native: "Für mich bitte einen doppelten Espresso und ein Croissant, danke dir!",
              phonetic: "[fyːɐ̯ mɪç ˈbɪtə ˈaɪnən ˈdɔpl̩tn̩ ɛsˈpʁɛso ʊnt aɪn kʁwaˈsɑ̃ː]",
              gloss: "For me(ACC) please a(ACC.M) double(ACC.M) espresso and a croissant, thanks to-you(DAT)!",
              meaning: "A double espresso and a croissant for me please, thanks!",
              note: "Uses Akkusativ masculine 'einen doppelten Espresso' + informal 'dir'.",
            },
            polite: {
              native: "Ich hätte gern einen Hafermilch-Cappuccino zum Hiertrinken, bitte.",
              phonetic: "[ɪç ˈhɛtə ɡɛʁn ˈaɪnən ˈhaːfɐmɪlç kapʊˈtʃiːno tsʊm ˈhiːɐ̯tʁɪŋkn̩]",
              gloss: "I would-have(KONJ.II) gladly a(ACC.M) oat-milk cappuccino for-the here-drinking, please.",
              meaning: "I would like an oat-milk cappuccino for here, please.",
              note: "Konjunktiv II 'Ich hätte gern' is the gold standard for polite ordering in German.",
            },
            formal: {
              native: "Dürfte ich Sie um ein Kännchen Filterkaffee sowie ein Glas Leitungswasser bitten?",
              phonetic: "[ˈdʏʁftə ɪç ziː ʊm aɪn ˈkɛnçən ˈfɪltɐkafe zoˈviː aɪn ɡlaːs ˈlaɪtʊŋsvasɐ ˈbɪtn̩]",
              gloss: "Might(KONJ.II) I you(FORMAL) for a small-pot filter-coffee as-well-as a glass tap-water ask?",
              meaning: "Might I ask you for a small pot of filter coffee as well as a glass of tap water?",
              note: "High-register Viennese/diplomatic Konjunktiv II 'Dürfte ich Sie um ... bitten'.",
            },
          },
        },
        rail: {
          prompt: {
            speaker: "Zugbegleiter (DB ICE Conductor)",
            native: "Guten Tag, die Fahrkartenkontrolle! Wo steigen Sie heute um?",
            phonetic: "[ˈɡuːtn̩ taːk | diː ˈfaːɐ̯kaʁtn̩kɔnˌtʁɔlə | voː ˈʃtaɪɡn̩ ziː ˈhɔʏtə ʊm]",
            gloss: "Good day, the ticket-inspection! Where transfer you today PARTICLE(um-steigen)?",
            meaning: "Good day, ticket inspection! Where are you transferring today?",
          },
          replies: {
            casual: {
              native: "Hi! Hier ist mein QR-Code. Ich steig' in Frankfurt direkt zum Flughafen um.",
              phonetic: "[haɪ | hiːɐ̯ ɪst maɪn kuːˈɛʁ koːt | ɪç ʃtaɪk ɪn ˈfʁaŋkfʊʁt ˈʊm]",
              gloss: "Hi! Here is my QR-code. I climb in Frankfurt directly to-the(DAT) airport around(PART).",
              meaning: "Hi! Here's my QR code. I'm transferring in Frankfurt straight to the airport.",
              note: "Separable prefix verb 'umsteigen' splits: finite 'steig' in V2, prefix 'um' at clause end!",
            },
            polite: {
              native: "Bitte sehr, hier ist mein Ticket. Wissen Sie, ob wir pünktlich in München ankommen?",
              phonetic: "[ˈbɪtə zeːɐ̯ | ˈvɪsn̩ ziː ɔp viːɐ̯ ˈpʏŋktlɪç ɪn ˈmʏnçn̩ ˈankɔmən]",
              gloss: "Please very, here is my ticket. Know you, whether we on-time in Munich arrive(V-FINAL)?",
              meaning: "Here you go. Do you know whether we will arrive in Munich on time?",
              note: "Subordinate 'ob' clause rejoins separable 'ankommen' at the very end!",
            },
            formal: {
              native: "Gestatten Sie, hier ist meine BahnCard. Könnten Sie mir den Anschlussgleisbereich nennen?",
              phonetic: "[ɡəˈʃtatn̩ ziː | ˈkœntn̩ ziː miːɐ̯ deːn ˈanʃlʊsɡlaɪsbəˌʁaɪç ˈnɛnən]",
              gloss: "Permit you, here is my BahnCard. Could you to-me(DAT) the(ACC) connecting-track-sector name?",
              meaning: "Allow me, here is my rail pass. Could you inform me of the connecting platform sector?",
              note: "Formal 'Gestatten Sie' + DAT/ACC object ordering.",
            },
          },
        },
        seminar: {
          prompt: {
            speaker: "Seminarleiterin (Humboldt-Universität)",
            native: "Inwiefern prägt die Struktur einer Sprache unsere kognitive Wahrnehmung?",
            phonetic: "[ɪnviːˈfɛʁn pʁɛːkt diː ʃtʁʊkˈtuːɐ̯ ˈaɪnɐ ˈʃpʁaːxə ˈʊnzəʁə kɔɡniˈtiːvə ˈvaːɐ̯neːmʊŋ]",
            gloss: "To-what-extent shapes the structure of-a(GEN.F) language our cognitive perception(ACC)?",
            meaning: "To what extent does the structure of a language shape our cognitive perception?",
          },
          replies: {
            casual: {
              native: "Also, ich glaube schon, dass Grammatik unsere Aufmerksamkeit ziemlich stark lenkt.",
              phonetic: "[ˈalzo ɪç ˈɡlaʊbə ʃoːn das ɡʁaˈmatɪk ˈʊnzəʁə ˈaʊfmɛʁkzaːmkaɪt lɛŋkt]",
              gloss: "Well, I believe indeed, that grammar our attention quite strongly steers(V-FINAL).",
              meaning: "Well, I do think grammar steers our attention quite strongly.",
              note: "'dass'-Nebensatz sends 'lenkt' to the final slot.",
            },
            polite: {
              native: "Meines Erachtens beeinflusst die Morphologie vor allem, welche Details wir spontan kodieren.",
              phonetic: "[ˈmaɪnəs ɛɐ̯ˈʔaxtn̩s bəˈʔaɪnflʊst diː mɔʁfoloˈɡiː ˈvɛlçə deˈtaɪs viːɐ̯ koˈdiːʁən]",
              gloss: "Of-my opinion(GEN) influences(V2) the morphology above all, which details we encode(V-FINAL).",
              meaning: "In my estimation, morphology primarily influences which details we spontaneously encode.",
              note: "Genitive adverbial 'Meines Erachtens' occupies Position 1, triggering V2 inversion ('beeinflusst die...').",
            },
            formal: {
              native: "Es lässt sich argumentieren, dass sprachliche Kategorien als kognitive Werkzeuge fungieren.",
              phonetic: "[ɛs lɛst zɪç aʁɡumɛnˈtiːʁən das ˈʃpʁaːxlɪçə kateɡoˈʁiːən als ˈvɛʁktsɔʏɡə fʊŋˈɡiːʁən]",
              gloss: "It lets itself argue, that linguistic categories as cognitive tools function(V-FINAL).",
              meaning: "One may argue that linguistic categories function as cognitive instruments.",
              note: "Academic impersonal construction 'Es lässt sich argumentieren, dass...'.",
            },
          },
        },
        lounge: {
          prompt: {
            speaker: "Gastgeber (Berliner Kulturabend)",
            native: "Schön, dass Sie heute Abend dabei sind! Was führt Sie nach Berlin?",
            phonetic: "[ʃøːn das ziː ˈhɔʏtə ˈaːbn̩t daˈbaɪ zɪnt | vas fyːɐ̯t ziː naːx bɛʁˈliːn]",
            gloss: "Lovely, that you tonight daarbij are! What leads you to Berlin?",
            meaning: "Lovely that you're here tonight! What brings you to Berlin?",
          },
          replies: {
            casual: {
              native: "Hey! Ich bin wegen der Konferenz hier und liebe einfach die Berliner Kulturszene.",
              phonetic: "[heː | ɪç bɪn ˈveːɡn̩ deːɐ̯ kɔnfəˈʁɛnts hiːɐ̯ ʊnt ˈliːbə diː bɛʁˈliːnɐ kʊlˈtuːɐ̯stseːnə]",
              gloss: "Hey! I am because-of the(GEN.F) conference here and love simply the Berlin culture-scene.",
              meaning: "Hey! I'm here for the conference and just love the Berlin cultural scene.",
              note: "Preposition 'wegen' + Genitiv feminine ('der Konferenz').",
            },
            polite: {
              native: "Vielen Dank für die Einladung! Ich forsche im Bereich der mehrsprachigen Kommunikation.",
              phonetic: "[ˈfiːlən daŋk fyːɐ̯ diː ˈaɪnlaːdʊŋ | ɪç ˈfɔʁʃə ɪm bəˈʁaɪç deːɐ̯ ˈmeːɐ̯ʃpʁaːxɪɡn̩ kɔmunikaˈtsjoːn]",
              gloss: "Many thanks for the invitation! I research in-the(DAT) field of-the(GEN) multilingual communication.",
              meaning: "Many thanks for the invitation! I do research in multilingual communication.",
              note: "Balanced polite register with Dativ ('im Bereich') + Genitiv ('der mehrsprachigen Kommunikation').",
            },
            formal: {
              native: "Es ist mir eine außerordentliche Freude; mein Forschungsinteresse gilt der vergleichenden Sprachwissenschaft.",
              phonetic: "[ɛs ɪst miːɐ̯ ˈaɪnə ˈaʊsɐˌʔɔʁdn̩tlɪçə ˈfʁɔʏdə | maɪn ˈfɔʁʃʊŋsʔɪntəˌʁɛsə ɡɪlt deːɐ̯ ˈʃpʁaːxvɪsn̩ʃaft]",
              gloss: "It is to-me(DAT) an extraordinary joy; my research-interest applies to-the(DAT) comparative linguistics.",
              meaning: "It is an extraordinary pleasure; my research interest lies in comparative linguistics.",
              note: "Elevated verb 'gelten' + Dativ ('gilt der vergleichenden Sprachwissenschaft').",
            },
          },
        },
      },
    },
    it: {
      name: "🇮🇹 Italian (Italiano)",
      scenes: {
        cafe: {
          prompt: {
            speaker: "Barista (Caffè Storico a Firenze)",
            native: "Buongiorno! Desidera prendere il caffè al banco o si accomoda al tavolo?",
            phonetic: "[bwɔnˈdʒorno | deˈziːdera ˈprɛndere il kafˈfɛ al ˈbaŋko o si akˈkɔmoda al ˈtaːvolo]",
            gloss: "Good-day! Desires(3SG.POLITE) take the coffee at-the bar or REFL seats at-the table?",
            meaning: "Good morning! Would you like to take your coffee at the bar or sit at a table?",
          },
          replies: {
            casual: {
              native: "Ciao! Prendo un espresso macchiato caldo al banco, grazie mille!",
              phonetic: "[ˈtʃaːo | ˈprɛndo un eˈsprɛsso makˈkjaːto ˈkaldo al ˈbaŋko ˈɡrattsje ˈmille]",
              gloss: "Hi! I-take an espresso stained warm at-the counter, thanks thousand!",
              meaning: "Hi! I'll have a warm espresso macchiato at the bar, thanks so much!",
              note: "Direct Presente 'prendo' at the bar ('al banco') like a local.",
            },
            polite: {
              native: "Vorrei un cappuccino e un cornetto integrale al tavolo, per cortesia.",
              phonetic: "[vorˈrɛi un kapputˈtʃiːno e un korˈnetto inteˈɡraːle al ˈtaːvolo per korteˈziːa]",
              gloss: "I-would-want(COND) a cappuccino and a croissant whole-grain at-the table, by courtesy.",
              meaning: "I would like a cappuccino and a whole-grain croissant at a table, please.",
              note: "Condizionale 'Vorrei' (from volere) + 'per cortesia'.",
            },
            formal: {
              native: "Le sarei grato se potesse portarmi un caffè filtro e dell'acqua frizzante al tavolo.",
              phonetic: "[le saˈrɛi ˈɡraːto se poˈtesse porˈtarmi un kafˈfɛ ˈfiltro e delˈlakkwa friddˈzante]",
              gloss: "To-You(POL) I-would-be grateful if could(CONG.IMP) bring-me a coffee filter and some water sparkling.",
              meaning: "I would be grateful if you could bring me a filter coffee and sparkling water at the table.",
              note: "Period ipotetico of high courtesy: Condizionale ('Le sarei grato') + Congiuntivo Imperfetto ('se potesse').",
            },
          },
        },
        rail: {
          prompt: {
            speaker: "Capotreno (Frecciarossa Milano–Roma)",
            native: "Buongiorno, biglietti prego! Siamo in arrivo a Bologna Centrale tra dieci minuti.",
            phonetic: "[bwɔnˈdʒorno bilˈʎetti ˈprɛːɡo | ˈsjaːmo in arˈriːvo a boˈloɲɲa tʃenˈtraːle]",
            gloss: "Good-day, tickets please! We-are in arrival at Bologna Central in ten minutes.",
            meaning: "Good morning, tickets please! We are arriving at Bologna Centrale in ten minutes.",
          },
          replies: {
            casual: {
              native: "Ecco il codice sul telefono! Scusi, da quale binario parte la coincidenza per Venezia?",
              phonetic: "[ˈɛkko il ˈkɔːditʃe sul teˈlɛːfono | da ˈkwaːle biˈnaːrjo ˈparte la kointʃiˈdɛntsa]",
              gloss: "Here-is the code on-the phone! Excuse, from which platform leaves the connection for Venice?",
              meaning: "Here's the code on my phone! Excuse me, which platform does the Venice connection leave from?",
              note: "Useful travel noun 'la coincidenza' (connecting train) and 'il binario' (platform).",
            },
            polite: {
              native: "Ecco a Lei il mio biglietto. Saprebbe dirmi se il treno per Firenze è in orario?",
              phonetic: "[ˈɛkko a ˈlɛi il ˈmiːo bilˈʎetto | saˈprɛbbe ˈdirmi se il ˈtrɛːno ɛ in oˈraːrjo]",
              gloss: "Here to You(POL) the my ticket. Would-know(COND) tell-me if the train for Florence is on schedule?",
              meaning: "Here is my ticket. Could you tell me if the train to Florence is on time?",
              note: "Polite Condizionale 'Saprebbe dirmi' + enclitic pronoun '-mi'.",
            },
            formal: {
              native: "Ecco il titolo di viaggio; vorrei accertarmi che la carrozza Executive sia in testa al treno.",
              phonetic: "[ˈɛkko il ˈtiːtolo di ˈvjaddʒo | vorˈrɛi attʃerˈtarmi ke la karˈrɔttsa ˈsiːa in ˈtɛsta]",
              gloss: "Here-is the travel-document; I-would-like assure-myself that the coach Executive be(CONG) at head of train.",
              meaning: "Here is my travel pass; I should like to confirm that the Executive coach is at the front of the train.",
              note: "Triggers Congiuntivo Presente 'che ... sia' after 'accertarsi che'.",
            },
          },
        },
        seminar: {
          prompt: {
            speaker: "Professoressa Conti (Università di Bologna)",
            native: "Secondo Lei, perché il congiuntivo rimane così vitale nell'italiano colto contemporaneo?",
            phonetic: "[seˈkondo ˈlɛi perˈke il kondʒunˈtiːvo riˈmaːne koˈzi viˈtaːle nellitaˈljaːno ˈkolto]",
            gloss: "According-to You(POL), why the subjunctive remains so vital in-the Italian educated contemporary?",
            meaning: "In your view, why does the subjunctive remain so vital in educated contemporary Italian?",
          },
          replies: {
            casual: {
              native: "Secondo me, serve proprio a far capire subito quando una cosa è un'opinione e non un fatto.",
              phonetic: "[seˈkondo me ˈsɛrve ˈprɔːprjo a far kaˈpiːre ˈsuːbito ˈkwando ˈuːna ˈkɔːza ɛ unopiˈnjoːne]",
              gloss: "According-to me, it-serves really to make understand immediately when a thing is an opinion.",
              meaning: "In my view, it really helps show right away when something is an opinion rather than a fact.",
              note: "Causative construction 'far capire' (make understand).",
            },
            polite: {
              native: "Ritengo che il congiuntivo permetta di esprimere sfumature epistemiche ed emotive insostituibili.",
              phonetic: "[riˈtɛŋɡo ke il kondʒunˈtiːvo perˈmetta di eˈspriːmere sfumaˈtuːre epiˈstɛːmike]",
              gloss: "I-maintain that the subjunctive permits(CONG) to express nuances epistemic and emotional irreplaceable.",
              meaning: "I believe that the subjunctive allows us to express irreplaceable epistemic and emotional nuances.",
              note: "'Ritengo che' requires the Congiuntivo ('permetta')—practicing what the sentence preaches!",
            },
            formal: {
              native: "Benchè taluni ne lamentino il declino nel parlato, esso resta il cardine della subordinazione ipotetica.",
              phonetic: "[beŋˈke taˈluːni ne laˈmentino il deˈkliːno | ˈesso ˈrɛsta il ˈkardine della subordinatˈtsjoːne]",
              gloss: "Although some of-it lament(CONG.3PL) the decline in-the spoken, it remains the hinge of subordination.",
              meaning: "Although some lament its decline in colloquial speech, it remains the cornerstone of hypothetical subordination.",
              note: "Concessive conjunction 'benché' + 3rd plural Congiuntivo 'lamentino' + partitive pronoun 'ne'.",
            },
          },
        },
        lounge: {
          prompt: {
            speaker: "Ospite (Terrazza a Milano)",
            native: "Che piacere conoscerLa! È la Sua prima volta a Milano o ci viene spesso?",
            phonetic: "[ke pjaˈtʃeːre koˈnoʃʃerla | ɛ la ˈsuːa ˈpriːma ˈvɔlta a miˈlaːno o tʃi ˈvjɛːne ˈspesso]",
            gloss: "What pleasure to-meet-You(POL)! Is the Your first time in Milan or here(ci) come often?",
            meaning: "What a pleasure to meet you! Is it your first time in Milan or do you come here often?",
          },
          replies: {
            casual: {
              native: "Piacere mio! Ci vengo spesso per lavoro e adoro l'energia di questa città.",
              phonetic: "[pjaˈtʃeːre ˈmiːo | tʃi ˈvɛŋɡo ˈspesso per laˈvoːro e aˈdɔːro lenerˈdʒiːa di ˈkwesta tʃitˈta]",
              gloss: "Pleasure mine! There(ci) I-come often for work and I-adore the energy of this city.",
              meaning: "My pleasure! I come here often for work and adore the energy of this city.",
              note: "Locative clitic 'ci' ('ci vengo' = I come here/there).",
            },
            polite: {
              native: "Il piacere è tutto mio! Sono stato a Milano diverse volte per progetti di ricerca linguistica.",
              phonetic: "[il pjaˈtʃeːre ɛ ˈtutto ˈmiːo | ˈsoːno ˈstaːto a miˈlaːno diˈvɛrse ˈvɔlte]",
              gloss: "The pleasure is all mine! I-am been in Milan several times for projects of research linguistic.",
              meaning: "The pleasure is all mine! I have been to Milan several times for linguistic research projects.",
              note: "Passato Prossimo 'sono stato' (uses auxiliary essere!).",
            },
            formal: {
              native: "Onorato di fare la Sua conoscenza; nutro da sempre una profonda ammirazione per la cultura italiana.",
              phonetic: "[onoˈraːto di ˈfaːre la ˈsuːa konoˈʃɛntsa | ˈnuːtro da ˈsɛmpre ˈuːna proˈfonda ammiratˈtsjoːne]",
              gloss: "Honored to make the Your acquaintance; I-harbor since always a deep admiration for the culture Italian.",
              meaning: "Honored to make your acquaintance; I have always held a deep admiration for Italian culture.",
              note: "Formal 'fare la Sua conoscenza' + 'nutro' (from nutrire, to cherish/nourish).",
            },
          },
        },
      },
    },
    fr: {
      name: "🇫🇷 French (Français)",
      scenes: {
        cafe: {
          prompt: {
            speaker: "Serveur (Café de Flore, Saint-Germain)",
            native: "Bonjour ! Vous avez choisi, ou je vous laisse encore quelques instants ?",
            phonetic: "[bɔ̃ʒuʁ | vu.za.ve ʃwazi u ʒə vu lɛs ɑ̃kɔʁ kɛlkə.z‿ɛ̃stɑ̃]",
            gloss: "Good-day! You have(‿) chosen, or I you leave still a-few(‿) moments?",
            meaning: "Hello! Have you chosen, or shall I give you a few more moments?",
          },
          replies: {
            casual: {
              native: "Salut ! Je vais prendre un café allongé et une tartine beurrée, s'il te plaît.",
              phonetic: "[saly | ʒə vɛ pʁɑ̃dʁ œ̃ kafe alɔ̃ʒe e yn taʁtin bœʁe sil tə plɛ]",
              gloss: "Hi! I go take a coffee lengthened and a slice buttered, if it to-you pleases.",
              meaning: "Hi! I'm going to grab an americano and buttered baguette toast, please.",
              note: "Futur proche 'je vais prendre' + informal 's'il te plaît'.",
            },
            polite: {
              native: "Je voudrais un café crème et un croissant aux amandes, s'il vous plaît.",
              phonetic: "[ʒə vudʁɛ œ̃ kafe kʁɛm e œ̃ kʁwasɑ̃ o.z‿amɑ̃d sil vu plɛ]",
              gloss: "I would-like(COND) a coffee cream and a croissant with-the(‿) almonds, if it to-you(POL) pleases.",
              meaning: "I would like a café crème and an almond croissant, please.",
              note: "Classic polite conditionnel 'Je voudrais' + mandatory liaison in 'aux‿amandes' [o.za.mɑ̃d].",
            },
            formal: {
              native: "Auriez-vous l'amabilité de m'apporter une infusion de verveine ainsi qu'une carafe d'eau ?",
              phonetic: "[oʁje vu lamabilite də mapɔʁte yn ɛ̃fyzjɔ̃ də vɛʁvɛn ɛ̃si kyn kaʁaf do]",
              gloss: "Would-have-you the kindness to to-me-bring an infusion of verbena as-well as-a carafe of-water?",
              meaning: "Would you have the kindness to bring me a verbena herbal tea as well as a carafe of water?",
              note: "Inverted conditionnel 'Auriez-vous l'amabilité de...'.",
            },
          },
        },
        rail: {
          prompt: {
            speaker: "Contrôleur SNCF (TGV InOui Paris–Lyon)",
            native: "Bonjour, contrôle des billets s'il vous plaît ! Nous arrivons bientôt à Lyon Part-Dieu.",
            phonetic: "[bɔ̃ʒuʁ kɔ̃tʁol de bijɛ sil vu plɛ | nu.z‿aʁivɔ̃ bjɛ̃to a ljɔ̃ paʁ djø]",
            gloss: "Good-day, inspection of-the tickets please! We(‿) arrive soon at Lyon Part-Dieu.",
            meaning: "Hello, ticket inspection please! We will arrive shortly at Lyon Part-Dieu.",
          },
          replies: {
            casual: {
              native: "Voilà mon billet sur l'appli ! Dis, la voiture-bar est dans quelle direction ?",
              phonetic: "[vwala mɔ̃ bijɛ syʁ lapli | di la vwatyʁ baʁ ɛ dɑ̃ kɛl diʁɛksjɔ̃]",
              gloss: "Here-is my ticket on the-app! Say, the car-bar is in which direction?",
              meaning: "Here's my ticket on the app! Hey, which way is the café car?",
              note: "Colloquial clipping 'l'appli' (application).",
            },
            polite: {
              native: "Voici mon billet. Pourriez-vous m'indiquer sur quel quai se trouve la correspondance pour Genève ?",
              phonetic: "[vwasi mɔ̃ bijɛ | puʁje vu mɛ̃dike syʁ kɛl kɛ sə tʁuv la kɔʁɛspɔ̃dɑ̃s puʁ ʒənɛv]",
              gloss: "Here-is my ticket. Could-you to-me-indicate on which platform REFL finds the connection for Geneva?",
              meaning: "Here is my ticket. Could you tell me which platform the connection to Geneva is on?",
              note: "Polite 'Pourriez-vous m'indiquer' + 'le quai' (platform).",
            },
            formal: {
              native: "Je vous prie de bien vouloir trouver ci-joint mon titre de transport ; sommes-nous à l'heure ?",
              phonetic: "[ʒə vu pʁi də bjɛ̃ vulwaʁ tʁuve si ʒwɛ̃ mɔ̃ titʁ də tʁɑ̃spɔʁ | sɔm nu a lœʁ]",
              gloss: "I you pray to well want find attached my title of transport; are-we on the-hour?",
              meaning: "Please find here my travel pass; are we running on schedule?",
              note: "Formal 'Je vous prie de bien vouloir...'.",
            },
          },
        },
        seminar: {
          prompt: {
            speaker: "Professeur Moreau (Sorbonne Université)",
            native: "Croyez-vous qu'une intelligence artificielle puisse véritablement saisir l'ironie littéraire ?",
            phonetic: "[kʁwaje vu kyn ɛ̃tɛliʒɑ̃s aʁtifisjɛl pɥis veʁitabləmɑ̃ sɛziʁ liʁɔni liteʁɛʁ]",
            gloss: "Believe-you that-an intelligence artificial may(SUBJ) truly grasp the-irony literary?",
            meaning: "Do you believe an AI can truly grasp literary irony?",
          },
          replies: {
            casual: {
              native: "Franchement, j'ai l'impression qu'elle repère les mots mais passe parfois à côté du sous-entendu.",
              phonetic: "[fʁɑ̃ʃmɑ̃ ʒe lɛ̃pʁɛsjɔ̃ kɛl ʁəpɛʁ le mo mɛ pas paʁfwa a kote dy su.z‿ɑ̃tɑ̃dy]",
              gloss: "Frankly, I-have the-impression that-it spots the words but passes sometimes beside the implied.",
              meaning: "Frankly, I feel it spots the words but sometimes misses the subtext.",
              note: "Idiomatic 'passer à côté de' (to miss the point of).",
            },
            polite: {
              native: "Il me semble que l'ironie exige qu'on comprenne le contexte culturel et l'intention de l'auteur.",
              phonetic: "[il mə sɑ̃bl kə liʁɔni ɛɡziʒ kɔ̃ kɔ̃pʁɛn lə kɔ̃tɛkst kyltyʁɛl]",
              gloss: "It to-me seems that the-irony demands that-one understand(SUBJ) the context cultural.",
              meaning: "It seems to me that irony requires that one understand the cultural context and authorial intent.",
              note: "'exiger que' triggers the Subjonctif présent 'qu'on comprenne'!",
            },
            formal: {
              native: "Quoique les modèles maîtrisent la syntaxe, je doute qu'ils puissent éprouver l'ambiguïté existentielle.",
              phonetic: "[kwakə le mɔdɛl mɛtʁiz la sɛ̃taks | ʒə dut kil pɥis.t‿epʁuve lɑ̃biɡɥite]",
              gloss: "Although the models master(SUBJ) the syntax, I doubt that-they may(SUBJ) experience the-ambiguity.",
              meaning: "Although models master syntax, I doubt they can experience existential ambiguity.",
              note: "Double Subjonctif: 'Quoique ... maîtrisent' + 'je doute qu'ils puissent'.",
            },
          },
        },
        lounge: {
          prompt: {
            speaker: "Hôtesse (Soirée Littéraire à Montmartre)",
            native: "Enchantée ! Qu'est-ce qui vous passionne dans l'apprentissage des langues ?",
            phonetic: "[ɑ̃ʃɑ̃te | kɛs ki vu pasjɔn dɑ̃ lapʁɑ̃tisaʒ de lɑ̃ɡ]",
            gloss: "Delighted! What-is-it that you fascinates in the-learning of-the languages?",
            meaning: "Delighted to meet you! What fascinates you about learning languages?",
          },
          replies: {
            casual: {
              native: "Enchanté ! J'adore découvrir comment chaque langue découpe le monde différemment.",
              phonetic: "[ɑ̃ʃɑ̃te | ʒadɔʁ dekuvʁiʁ kɔmɑ̃ ʃak lɑ̃ɡ dekup lə mɔ̃d difeʁamɑ̃]",
              gloss: "Delighted! I-adore discover how each language carves-up the world differently.",
              meaning: "Delighted! I love discovering how each language carves up the world differently.",
              note: "Expressive verb 'découper le monde' (to slice/carve up the world).",
            },
            polite: {
              native: "C'est un plaisir ! Chaque nouvelle langue nous offre une nouvelle manière d'écouter les autres.",
              phonetic: "[sɛ.t‿œ̃ pleziʁ | ʃak nuvɛl lɑ̃ɡ nu.z‿ɔfʁ yn nuvɛl manjɛʁ dekute le.z‿otʁ]",
              gloss: "It-is(‿) a pleasure! Each new language to-us(‿) offers a new way to-listen-to the(‿) others.",
              meaning: "It's a pleasure! Every new language offers us a new way of listening to others.",
              note: "Rich liaisons: 'C'est‿un', 'nous‿offre', 'les‿autres'.",
            },
            formal: {
              native: "Tout le plaisir est pour moi ; le plurilinguisme constitue à mes yeux un pont indispensable entre les cultures.",
              phonetic: "[tu lə pleziʁ ɛ puʁ mwa | lə plyʁilɛ̃ɡɥism kɔ̃stity a me.z‿jø œ̃ pɔ̃ ɛ̃dispɑ̃sabl]",
              gloss: "All the pleasure is for me; the multilingualism constitutes to my(‿) eyes a bridge indispensable.",
              meaning: "The pleasure is all mine; multilingualism constitutes in my eyes an indispensable bridge between cultures.",
              note: "Elevated 'à mes‿yeux' [a me.zjø].",
            },
          },
        },
      },
    },
    ar: {
      name: "🇸🇦 Arabic (العربية الفصحى — Modern Standard Arabic)",
      scenes: {
        cafe: {
          prompt: {
            speaker: "صانع القهوة (Café Host)",
            native: "أَهْلاً وَسَهْلاً! مَاذَا تُحِبُّ أَنْ تَشْرَبَ الْيَوْمَ؟ قَهْوَةً عَرَبِيَّةً أَمْ إِسْبْرِيسُو؟",
            phonetic: "ʾAhlan wa-sahlan! Mādhā tuḥibbu ʾan tashraba l-yawma? Qahwatan ʿarabiyyatan ʾam ʾisbrīsū?",
            gloss: "Welcome! What you-like that you-drink(SUBJ) today? Coffee(ACC) Arabic(ACC) or espresso?",
            meaning: "Welcome! What would you like to drink today? Arabic coffee or espresso?",
          },
          replies: {
            casual: {
              native: "مَرْحَباً! أَعْطِنِي فِنْجَانَ قَهْوَةٍ بِالْهَالِ لَوْ سَمَحْتَ، شُكْراً!",
              phonetic: "Marḥaban! ʾAʿṭinī finjāna qahwatin bi-l-hāli law samaḥta, shukran!",
              gloss: "Hello! Give-me cup(ACC) of-coffee(GEN) with-the-cardamom if you-permitted, thanks!",
              meaning: "Hi! Give me a cup of cardamom coffee please, thanks!",
              note: "Iḍāfa construct state 'finjāna qahwatin' (cup of coffee) + polite 'law samaḥta'.",
            },
            polite: {
              native: "مِنْ فَضْلِكَ، أُرِيدُ فِنْجَاناً مِنَ الْقَهْوَةِ الْعَرَبِيَّةِ مَعَ التَّمْرِ، شُكْراً جَزِيلاً.",
              phonetic: "Min faḍlika, ʾurīdu finjānan mina l-qahwati l-ʿarabiyyati maʿa t-tamri, shukran jazīlan.",
              gloss: "From your-grace, I-want a-cup(ACC) of the-coffee the-Arabic with the-dates, thanks abundant.",
              meaning: "Please, I would like a cup of Arabic coffee with dates, thank you very much.",
              note: "Standard 'Min faḍlika' + definite adjective agreement 'al-qahwati l-ʿarabiyyati'.",
            },
            formal: {
              native: "طَابَ يَوْمُكُمْ؛ هَلْ تَكَرَّمْتُمْ بِتَقْدِيمِ الْقَهْوَةِ الْمُخْتَصَّةِ بِدُونِ سُكَّرٍ؟",
              phonetic: "Ṭāba yawmukum; hal takarramtum bi-taqdīmi l-qahwati l-mukhtaṣṣati bi-dūni sukkarin?",
              gloss: "May-be-pleasant your-day; Q you-graciously-deigned with-serving the-coffee the-specialty without sugar?",
              meaning: "Good day to you; would you kindly serve me the specialty coffee without sugar?",
              note: "High diplomatic courtesy 'hal takarramtum bi-taqdīm' (Form V verb + Form II verbal noun).",
            },
          },
        },
        rail: {
          prompt: {
            speaker: "مُوَظَّفُ الْمَحَطَّةِ (High-Speed Rail Officer)",
            native: "الْقِطَارُ السَّرِيعُ الْمُتَّجِهُ إِلَى الْمَدِينَةِ سَيَنْطَلِقُ مِنْ رَصِيفِ رَقْمِ ثَلَاثَةٍ.",
            phonetic: "Al-qiṭāru s-sarīʿu l-muttajihu ʾilā l-Madīnati sa-yanṭaliqu min raṣīfi raqmi thalāthatin.",
            gloss: "The-train the-fast the-heading to Medina FUT-departs(Form VII) from platform number three.",
            meaning: "The high-speed train bound for Medina will depart from Platform 3.",
          },
          replies: {
            casual: {
              native: "مُمْتَاز! مِنْ أَيْنَ أَدْخُلُ إِلَى الْعَرَبَةِ الرَّابِعَةِ؟",
              phonetic: "Mumtāz! Min ʾayna ʾadkhulu ʾilā l-ʿarabati r-rābiʿati?",
              gloss: "Excellent! From where I-enter to the-coach the-fourth?",
              meaning: "Great! Where do I board Coach 4?",
              note: "Ordinal adjective 'ar-rābiʿati' (the fourth) agrees in gender, definiteness, and genitive case.",
            },
            polite: {
              native: "تَفَضَّلْ تَذْكِرَتِي. هَلْ يُمْكِنُكَ إِرْشَادِي إِلَى قَاعَةِ انْتِظَارِ الدَّرَجَةِ الْأُولَى؟",
              phonetic: "Tafaḍḍal tadhkiratī. Hal yumkinuka ʾirshādī ʾilā qāʿati ntiẓāri d-darajati l-ʾūlā?",
              gloss: "Here-you-are my-ticket. Q is-possible-for-you guiding-me to hall of-waiting of-the-class the-first?",
              meaning: "Here is my ticket. Could you direct me to the first-class waiting lounge?",
              note: "Chain Iḍāfa (genitive construct): 'qāʿati ntiẓāri d-darajati'.",
            },
            formal: {
              native: "إِلَيْكُمْ وَثِيقَةَ السَّفَرِ؛ نَرْجُو إِفَادَتَنَا بِمَوْعِدِ الْوُصُولِ الْمُقَرَّرِ.",
              phonetic: "ʾIlaykum wathīqata s-safari; narjū ʾifādatanā bi-mawʿidi l-wuṣūli l-muqarrari.",
              gloss: "To-you(PL.HON) document(ACC) of-the-travel; we-request informing-us with-time(place/time noun) of-arrival scheduled.",
              meaning: "Here is the travel document; we kindly request confirmation of the scheduled arrival time.",
              note: "Uses noun of time/place 'mawʿid' (from root و-ع-د w-ʿ-d).",
            },
          },
        },
        seminar: {
          prompt: {
            speaker: "الأُسْتَاذُ الدُّكْتُورُ (University Seminar Chair)",
            native: "كَيْفَ يُسْهِمُ نِظَامُ الْجُذُورِ وَالأَوْزَانِ فِي إِثْرَاءِ الْمُعْجَمِ الْعَرَبِيِّ؟",
            phonetic: "Kayfa yushimu niẓāmu l-judhūri wa-l-ʾawzāni fī ʾithrāʾi l-muʿjami l-ʿarabiyyi?",
            gloss: "How contributes system of-the-roots and-the-patterns in enriching(Form IV) the-lexicon the-Arabic?",
            meaning: "How does the root-and-pattern system contribute to enriching the Arabic lexicon?",
          },
          replies: {
            casual: {
              native: "بِصَرَاحَةٍ، هَذَا النِّظَامُ يَجْعَلُ تَخْمِينَ مَعَانِي الْكَلِمَاتِ الْجَدِيدَةِ سَهْلاً جِدّاً!",
              phonetic: "Bi-ṣarāḥatin, hādhā n-niẓāmu yajʿalu takhmīna maʿānī l-kalimāti l-jadīdati sahlan jiddan!",
              gloss: "Frankly, this the-system makes guessing meanings of-the-words the-new easy(ACC) very!",
              meaning: "Frankly, this system makes guessing the meanings of new words super easy!",
              note: "Double-accusative verb 'yajʿalu' (makes X into Y).",
            },
            polite: {
              native: "أَعْتَقِدُ أَنَّ الاِشْتِقَاقَ الصَّرْفِيَّ يَمْنَحُ اللُّغَةَ دِقَّةً عِلْمِيَّةً وَمُرُونَةً عَالِيَةً.",
              phonetic: "ʾAʿtaqidu ʾanna l-ishtiqāqa ṣ-ṣarfiyya yamnaḥu l-lughata diqqatan ʿilmiyyatan wa-murūnatan ʿāliyatan.",
              gloss: "I-believe(Form VIII) that the-derivation the-morphological grants the-language precision scientific and flexibility high.",
              meaning: "I believe that morphological derivation grants the language scientific precision and high flexibility.",
              note: "Particle 'ʾanna' puts the subject noun phrase 'al-ishtiqāqa ṣ-ṣarfiyya' into the Accusative (naṣb).",
            },
            formal: {
              native: "لَا رَيْبَ أَنَّ الْبِنْيَةَ الصَّرْفِيَّةَ تُمَكِّنُ اللُّغَةَ مِنْ تَوْلِيدِ الْمُصْطَلَحَاتِ الْحَدِيثَةِ بِأَصَالَةٍ.",
              phonetic: "Lā rayba ʾanna l-binyata ṣ-ṣarfiyyata tumakkinu l-lughata min tawlīdi l-muṣṭalaḥāti l-ḥadīthati bi-ʾaṣālatin.",
              gloss: "No doubt that the-structure the-morphological enables(Form II) the-language from generating the-terminology the-modern with-authenticity.",
              meaning: "There is no doubt that morphological structure enables the language to coin modern terminology authentically.",
              note: "Classical academic opening 'Lā rayba ʾanna...' (There is no doubt that...).",
            },
          },
        },
        lounge: {
          prompt: {
            speaker: "الْمُضِيفُ (Cultural Majlis Host)",
            native: "تَشَرَّفْنَا بِحُضُورِكُمْ هَذَا الْمَسَاءَ! مَا الَّذِي جَذَبَكُمْ إِلَى دِرَاسَةِ اللُّغَاتِ؟",
            phonetic: "Tasharrafnā bi-ḥuḍūrikum hādhā l-masāʾa! Mā lladhī jadhabakum ʾilā dirāsati l-lughāti?",
            gloss: "We-were-honored(Form V) by-your-presence this the-evening! What that-which attracted-you to study of-the-languages?",
            meaning: "We are honored by your presence this evening! What drew you to studying languages?",
          },
          replies: {
            casual: {
              native: "الشَّرَفُ لِي! أُحِبُّ التَّعَرُّفَ عَلَى ثَقَافَاتٍ جَدِيدَةٍ وَالتَّحَدُّثَ مَعَ النَّاسِ.",
              phonetic: "Ash-sharafu lī! ʾUḥibbu t-taʿarrufa ʿalā thaqāfātin jadīdatin wa-t-taḥaddutha maʿa n-nāsi.",
              gloss: "The-honor to-me! I-love the-getting-acquainted(Form V) with cultures new and-the-conversing with the-people.",
              meaning: "The honor is mine! I love getting to know new cultures and talking with people.",
              note: "Classic response 'Ash-sharafu lī' (The honor is mine).",
            },
            polite: {
              native: "أَنَا سَعِيدٌ جِدّاً بِلِقَائِكُمْ؛ اللُّغَاتُ تَفْتَحُ لَنَا نَوَافِذَ عَلَى الْفِكْرِ الْإِنْسَانِيِّ.",
              phonetic: "ʾAnā saʿīdun jiddan bi-liqāʾikum; al-lughātu taftaḥu lanā nawāfidha ʿalā l-fikri l-ʾinsāniyyi.",
              gloss: "I happy very with-meeting-you; the-languages open for-us windows(broken plural) onto the-thought the-human.",
              meaning: "I am delighted to meet you; languages open windows for us onto human thought.",
              note: "Broken plural 'nawāfidha' (windows, diptote in accusative without nunation).",
            },
            formal: {
              native: "إِنَّهُ لَمِنْ دَوَاعِي سُرُورِي؛ فَاللُّغَةُ هِيَ الْجِسْرُ الْأَسْمَى لِلتَّفَاهُمِ الْحَضَارِيِّ.",
              phonetic: "ʾInnahu la-min dawāʿī surūrī; fa-l-lughatu hiya l-jisru l-ʾasmā li-t-tafāhumi l-ḥaḍāriyyi.",
              gloss: "Indeed-it EMPH-among causes of-my-joy; for-the-language she the-bridge the-supreme for-mutual-understanding(Form VI) civilizational.",
              meaning: "It is truly my utmost pleasure; language is the supreme bridge for civilizational mutual understanding.",
              note: "Features Form VI maṣdar 'at-tafāhum' (mutual understanding, from f-h-m).",
            },
          },
        },
      },
    },
  };

  const SCENE_ORDER = ["cafe", "rail", "seminar", "lounge"];

  S.register({
    id: "dialogue_immersion",
    name: "Polyglot Immersion Roleplay Deck (5 Languages)",
    domains: ["languages"],
    description:
      "Practice real-world situational conversations across Mandarin, German, Italian, French, and Arabic at 3 sociolinguistic registers (Casual, Polite Standard, Formal/Diplomatic) with native script, phonetic transcription, word-by-word gloss, and TTS playback.",
    params: [
      {
        key: "lang",
        label: "Target Immersion Language",
        type: "select",
        value: "zh-CN",
        options: [
          { value: "zh-CN", label: "🇨🇳 Mandarin Chinese (普通话)" },
          { value: "de", label: "🇩🇪 German (Deutsch)" },
          { value: "it", label: "🇮🇹 Italian (Italiano)" },
          { value: "fr", label: "🇫🇷 French (Français)" },
          { value: "ar", label: "🇸🇦 Arabic (العربية الفصحى)" },
        ],
      },
      {
        key: "scene",
        label: "Immersion Situation",
        type: "select",
        value: "cafe",
        options: [
          { value: "cafe", label: "1 · Café & Artisanal Ordering" },
          { value: "rail", label: "2 · High-Speed Rail & Directions" },
          { value: "seminar", label: "3 · University Seminar & Debate" },
          { value: "lounge", label: "4 · Late-Night Lounge & Introductions" },
        ],
      },
      {
        key: "register",
        label: "Sociolinguistic Register (Politeness Level)",
        type: "select",
        value: "polite",
        options: [
          { value: "casual", label: "Casual / Street (Tu / Du / 你)" },
          { value: "polite", label: "Polite Standard (Vous / Sie / Lei / 您)" },
          { value: "formal", label: "Formal / Diplomatic / Academic" },
        ],
      },
    ],
    actions: [
      { label: "🔊 Speak Prompt Line", fn: (h) => h.speakPrompt() },
      { label: "🔊 Speak Your Response", fn: (h) => h.speakReply() },
      { label: "⏭ Next Turn / Scene", fn: (h) => h.nextTurn() },
    ],
    challenges: [
      {
        id: "register_shift",
        text: "Compare all 3 sociolinguistic registers (Casual, Polite Standard, Formal/Diplomatic) within any scene.",
        xp: 15,
      },
      {
        id: "polyglot_tour",
        text: "Complete a dialogue turn in at least 3 different languages (e.g., Mandarin, French, and Arabic) and hear their audio.",
        xp: 20,
      },
      {
        id: "seminar_debate",
        text: "Switch to '3 · University Seminar & Debate' in Formal register and inspect the grammatical discourse markers.",
        xp: 15,
      },
    ],
    mount(el, api) {
      const view = api.createCanvas({ aspect: 16 / 9, maxHeight: 460 });
      const { canvas, ctx } = view;
      const regsVisited = new Set();
      const langsSpoken = new Set();

      function wrapLine(text, x, y, maxW, lineH) {
        const words = String(text || "").split(" ");
        let line = "";
        let curY = y;
        for (let i = 0; i < words.length; i++) {
          const test = line ? line + " " + words[i] : words[i];
          if (ctx.measureText(test).width > maxW && line) {
            ctx.fillText(line, x, curY);
            line = words[i];
            curY += lineH;
          } else {
            line = test;
          }
        }
        if (line) ctx.fillText(line, x, curY);
      }

      function draw() {
        const w = view.width || 640;
        const h = view.height || 360;
        const C = api.colors;
        const lKey = api.params.lang;
        const sKey = api.params.scene;
        const rKey = api.params.register;

        regsVisited.add(rKey);
        if (regsVisited.size >= 3) api.award("register_shift");
        if (sKey === "seminar" && rKey === "formal") api.award("seminar_debate");

        const deck = DIALOGUE_DECK[lKey] || DIALOGUE_DECK["zh-CN"];
        const sc = deck.scenes[sKey] || deck.scenes.cafe;
        const rep = sc.replies[rKey] || sc.replies.polite;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, w, h);

        // Top Card: Native Interlocutor Prompt
        const pad = 16;
        const cardW = w - pad * 2;
        const topH = Math.round(h * 0.37);
        ctx.fillStyle = "#161a2e";
        roundRect(ctx, pad, 12, cardW, topH, 12);
        ctx.fill();
        ctx.strokeStyle = C.primary;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = C.primary;
        ctx.font = "bold 12px Inter, sans-serif";
        ctx.fillText(`🎙️ Interlocutor — ${sc.prompt.speaker}   (${deck.name})`, pad + 14, 32);

        ctx.fillStyle = C.text;
        ctx.font = `bold ${Math.round(h * 0.045)}px "Noto Naskh Arabic", "Noto Sans SC", Inter, sans-serif`;
        wrapLine(sc.prompt.native, pad + 14, 58, cardW - 28, 22);

        ctx.fillStyle = C.accent;
        ctx.font = "12px ui-monospace, monospace";
        wrapLine(`Phonetic: ${sc.prompt.phonetic}`, pad + 14, topH - 28, cardW - 28, 16);

        ctx.fillStyle = C.muted;
        ctx.font = "11px Inter, sans-serif";
        wrapLine(`Literal Gloss: ${sc.prompt.gloss}  →  "${sc.prompt.meaning}"`, pad + 14, topH - 8, cardW - 28, 15);

        // Bottom Card: Learner Response Card + 3 Register Selector Pills
        const botY = topH + 22;
        const botH = h - botY - 10;
        ctx.fillStyle = "#14182b";
        roundRect(ctx, pad, botY, cardW, botH, 12);
        ctx.fill();
        ctx.strokeStyle = C.ok;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Register pill buttons along top of response card (clickable!)
        const pills = [
          { key: "casual", label: "1 · Casual / Street" },
          { key: "polite", label: "2 · Polite Standard" },
          { key: "formal", label: "3 · Formal / Diplomatic" },
        ];
        const pw = (cardW - 44) / 3;
        pills.forEach((p, i) => {
          const px = pad + 14 + i * (pw + 8);
          const py = botY + 10;
          const active = p.key === rKey;
          ctx.fillStyle = active ? C.ok : "rgba(255,255,255,0.06)";
          roundRect(ctx, px, py, pw, 24, 6);
          ctx.fill();
          ctx.fillStyle = active ? "#0f1222" : C.muted;
          ctx.font = "bold 11px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(p.label, px + pw / 2, py + 16);
        });
        ctx.textAlign = "left";

        ctx.fillStyle = C.text;
        ctx.font = `bold ${Math.round(h * 0.044)}px "Noto Naskh Arabic", "Noto Sans SC", Inter, sans-serif`;
        wrapLine(rep.native, pad + 14, botY + 56, cardW - 28, 22);

        ctx.fillStyle = C.accent;
        ctx.font = "12px ui-monospace, monospace";
        wrapLine(`Phonetic: ${rep.phonetic}`, pad + 14, botY + botH - 56, cardW - 28, 16);

        ctx.fillStyle = C.muted;
        ctx.font = "11px Inter, sans-serif";
        wrapLine(`Gloss: ${rep.gloss}  →  "${rep.meaning}"`, pad + 14, botY + botH - 34, cardW - 28, 15);

        ctx.fillStyle = C.secondary;
        ctx.font = "bold 11px Inter, sans-serif";
        wrapLine(`Pragmatic Note: ${rep.note}`, pad + 14, botY + botH - 14, cardW - 28, 15);

        api.readout({
          "Language": deck.name,
          "Register": rKey.toUpperCase(),
          "Your Native Line": rep.native,
          "Pragmatic Grammar Note": rep.note,
        });
        api.setStatus("Click the 3 Register tabs on the canvas to shift politeness levels, or press '🔊 Speak Your Response'.");
      }

      api.pointer(canvas, {
        down(pt) {
          const w = view.width || 640;
          const h = view.height || 360;
          const topH = Math.round(h * 0.37);
          const botY = topH + 22;
          if (pt.y >= botY + 6 && pt.y <= botY + 38) {
            const relX = pt.x - 30;
            const cardW = w - 32;
            const idx = Math.floor((relX / (cardW - 28)) * 3);
            const regs = ["casual", "polite", "formal"];
            if (regs[idx]) api.setParam("register", regs[idx]);
          }
        },
      });

      api.onParam(() => draw());
      api.onResize(() => draw());
      draw();

      return {
        speakPrompt() {
          const lKey = api.params.lang;
          const sKey = api.params.scene;
          const deck = DIALOGUE_DECK[lKey] || DIALOGUE_DECK["zh-CN"];
          const sc = deck.scenes[sKey] || deck.scenes.cafe;
          speakPhrase(sc.prompt.native, lKey);
          langsSpoken.add(lKey);
          if (langsSpoken.size >= 3) api.award("polyglot_tour");
        },
        speakReply() {
          const lKey = api.params.lang;
          const sKey = api.params.scene;
          const rKey = api.params.register;
          const deck = DIALOGUE_DECK[lKey] || DIALOGUE_DECK["zh-CN"];
          const sc = deck.scenes[sKey] || deck.scenes.cafe;
          const rep = sc.replies[rKey] || sc.replies.polite;
          speakPhrase(rep.native, lKey);
          langsSpoken.add(lKey);
          if (langsSpoken.size >= 3) api.award("polyglot_tour");
        },
        nextTurn() {
          const idx = SCENE_ORDER.indexOf(api.params.scene);
          const next = SCENE_ORDER[(idx + 1) % SCENE_ORDER.length];
          api.setParam("scene", next);
        },
        destroy() {},
      };
    },
  });
})();
