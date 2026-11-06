# Self-Taught — Data & Widget Contracts

Self-Taught is a gamified, AI-professor-driven "personal university" (Flask + vanilla JS).
This document defines the two authored artifacts that other contributors produce:

1. **Curriculum catalogs** — `curriculum/<domain>.py` (Python data, one file per domain)
2. **Interactive simulations** — `static/sims/*.js` (self-registering widgets)

Everything else (server, LLM lesson generation, gamification, UI) consumes these.

---

## 1. Curriculum catalog (`curriculum/<domain>.py`)

Each file exports exactly one module-level variable: `DOMAIN` (a dict). No imports needed.

```python
DOMAIN = {
    "id": "physics",                 # slug: lowercase, [a-z0-9_], globally unique
    "name": "Physics",
    "icon": "⚛️",                    # single emoji
    "color": "#7c4dff",              # accent hex colour
    "tagline": "From falling apples to the fabric of spacetime.",
    "description": "2–3 sentences selling the domain and describing the arc Freshman → Master's.",
    "subjects": [
        {
            "id": "classical_mechanics",       # slug, unique within the domain
            "name": "Classical Mechanics",
            "icon": "🎯",
            "description": "1–2 sentences.",
            "courses": [
                {
                    "id": "phys_mech_101",         # slug, GLOBALLY unique across all domains (prefix with domain)
                    "code": "PHYS 101",             # human course code
                    "title": "Newtonian Mechanics",
                    "level": 100,                   # 100 Freshman · 200 Sophomore · 300 Junior · 400 Senior · 500 Graduate · 600 Master's
                    "credits": 4,                   # 1–6
                    "description": "2–3 sentences: what you will be able to DO after this course.",
                    "prerequisites": ["math_calc_1"],   # course ids (any domain). May be empty. Must exist somewhere in the catalog (soft-checked).
                    "modules": [
                        {
                            "id": "kinematics_1d",          # slug, unique within the course
                            "title": "Kinematics in One Dimension",
                            "summary": "1–2 sentences of what the module covers and why it matters.",
                            "sim": "projectile",            # OPTIONAL: id from the simulation registry (see §4). Omit if none fits.
                            "lab": True,                    # OPTIONAL: True if a Python coding lab is a natural fit for this module.
                            "lessons": [                    # 3–6 lesson titles (strings). Each becomes a full AI-generated lesson.
                                "Position, Displacement, and the Language of Motion",
                                "Velocity and Acceleration as Derivatives",
                                "Constant-Acceleration Equations and Free Fall",
                                "Graphical Analysis: Reading x–t, v–t and a–t Plots",
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
```

### Authoring rules
* **Scope**: a real university arc. Each subject has 3–5 courses that climb from level 100 to 500/600.
  Lower levels teach intuition and foundations; 400–600 courses are rigorous, research-adjacent, and assume the earlier ones.
* **Density**: each course has 5–8 modules; each module has 3–6 lessons. Target **≥ 500 lessons per domain**.
* **Lesson titles** must be specific and self-contained (“Gauss's Law for Symmetric Charge Distributions”, not “Gauss's Law”).
  Order lessons pedagogically. Avoid duplicates across courses unless deliberately revisited at a higher level
  (if so, make the title reflect the deeper treatment, e.g. “…Revisited with Tensor Notation”).
* **Interactivity**: wherever a listed simulation genuinely fits, set `"sim"`; set `"lab": True` for modules where
  writing Python (numpy / sympy / matplotlib available) helps learning. Aim for ≥ 40 % of modules to have a sim or a lab.
* **IDs** are slugs `[a-z0-9_]+`. Course ids must be globally unique — prefix them with the domain (e.g. `math_`, `phys_`, `chem_`, `ai_`, `robo_`, `phil_`).
* Plain ASCII in ids; Unicode is fine in titles/descriptions. Keep every string on one logical line (no literal newlines).
* Validate with: `python3 tools/validate_curriculum.py curriculum/<domain>.py`

---

## 2. Lesson content (generated at runtime — FYI only)

The server asks Gemini to expand each lesson title into a full structured lesson (hook, sections with inline
checkpoints, worked examples, misconceptions, an interactive sim config, a Python lab, a homework set, summary,
glossary). Catalog authors do **not** write lesson bodies.

---

## 3. Simulation widgets (`static/sims/*.js`)

Widgets self-register with the core registry defined in `static/sims/core.js`:

```js
SelfTaughtSims.register({
  id: "projectile",                       // slug, unique. Referenced by curriculum "sim" fields and by the AI.
  name: "Projectile Launcher",
  domains: ["physics"],                   // which domains this is relevant to (used for discovery in the Arcade page)
  description: "Launch a projectile and explore how speed, angle and gravity shape the trajectory.",
  // Controls are auto-rendered by core.js from this schema. Types: "range" | "select" | "toggle" | "number" | "text".
  params: [
    { key: "speed",  label: "Launch speed (m/s)", type: "range",  min: 1, max: 60, step: 1, value: 25 },
    { key: "angle",  label: "Angle (°)",          type: "range",  min: 0, max: 90, step: 1, value: 45 },
    { key: "planet", label: "Planet",             type: "select", value: "earth",
      options: [ { value: "earth", label: "Earth (9.81)" }, { value: "moon", label: "Moon (1.62)" } ] },
    { key: "drag",   label: "Air drag",           type: "toggle", value: false },
  ],
  // Buttons rendered by core.js; `fn` receives the live handle returned from mount().
  actions: [ { label: "Launch", fn: (h) => h.launch() }, { label: "Clear", fn: (h) => h.clear() } ],
  // Learning challenges rendered as a checklist. When the learner ticks one, the app awards XP.
  challenges: [
    { id: "same_range", text: "Find two different angles that give the same range.", xp: 15 },
    { id: "moon_hang",  text: "Switch to the Moon: how does hang time change and why?", xp: 10 },
  ],
  // mount() is called once with a container element and an api object. Return a handle.
  mount(el, api) {
    const { canvas, ctx } = api.createCanvas({ aspect: 16 / 9 });   // responsive canvas inside el
    let state = {/* ... */};
    const draw = () => { /* use api.params.speed, api.params.angle, ... (always live values) */ };
    api.onParam((key, value) => { /* react to control changes; usually just redraw */ draw(); });
    api.onResize(() => draw());
    api.loop((dt) => { /* optional animation step, dt in seconds; return false to stop */ });
    api.readout({ "Range": "12.3 m", "Flight time": "2.1 s" });   // key/value panel, call whenever values change
    api.setStatus("Adjust the angle, then press Launch.");
    return {
      launch() { /* ... */ },
      clear() { /* ... */ },
      destroy() { /* cancel timers; api.loop is cancelled automatically */ },
    };
  },
});
```

### `api` reference (provided by core.js)
| member | purpose |
|---|---|
| `api.params` | live object of current control values (`{speed: 25, angle: 45, …}`) |
| `api.onParam(cb)` | subscribe to control changes `cb(key, value, params)` |
| `api.setParam(key, value)` | programmatically set a control (updates UI) |
| `api.createCanvas({aspect, maxHeight})` | returns `{canvas, ctx, get width(), get height()}`; auto-resizes (HiDPI aware). `width/height` are CSS pixels; ctx is pre-scaled. |
| `api.onResize(cb)` | notified after canvas resize — redraw here |
| `api.loop(fn)` | start a requestAnimationFrame loop; `fn(dt)` with dt in seconds (capped at 0.05). Returns `{stop, start, running}` |
| `api.readout(obj)` | render key→value readouts |
| `api.setStatus(text)` | one-line hint/status under the controls |
| `api.html(innerHtml)` | render an extra HTML panel (tables, text) below the canvas |
| `api.award(challengeId)` | mark a challenge complete programmatically (e.g. the sim detected success) |
| `api.random()` | seeded PRNG in [0,1) for reproducible demos |
| `api.colors` | palette: `{bg, grid, axis, text, muted, primary, secondary, accent, danger, ok, series: [...]}` |
| `api.initial` | any `params` overrides supplied by the lesson (already merged into `api.params`) |
| `api.pointer(canvas, handlers)` | helper: attaches `{down, move, up}` handlers receiving `{x, y}` in CSS pixels |

### Widget rules
* Pure vanilla JS, no external libraries. Use `api.colors` for a consistent dark theme. Keep each widget self-contained.
* Must be robust: never throw on extreme slider values; guard divisions; cap particle counts.
* Default parameters must produce something interesting *immediately* (no blank canvas).
* Make the *physics/maths honest* (real equations, real units in labels).
* Clean up intervals/listeners in `destroy()`.
* Provide 2–4 challenges per widget that push the learner to discover a real insight.

---

## 4. Registry ids available to the curriculum

Catalog authors may reference any of these `sim` ids (grouped by primary domain; cross-use is encouraged where sensible):

* **Physics**: `projectile`, `pendulum`, `spring_mass`, `collisions`, `orbit`, `wave_superposition`, `electric_field`, `ideal_gas`, `relativity`, `quantum_well`, `blackbody`
* **Chemistry**: `atom_builder`, `reaction_kinetics`, `titration`, `radioactive_decay`, `periodic_trends`, `equilibrium`
* **Mathematics**: `function_plotter`, `derivative_explorer`, `riemann_sum`, `taylor_series`, `matrix_transform`, `distribution_explorer`, `regression_fit`, `fourier_series`, `phase_portrait`, `graph_theory`, `modular_clock`
* **AI**: `gradient_descent`, `perceptron`, `nn_playground`, `kmeans`, `attention_viz`, `ngram_predictor`, `bandit`, `gridworld_rl`, `agent_sim`, `tokenizer`
* **Robotics**: `pid_controller`, `robot_arm`, `differential_drive`, `path_planning`, `kalman_filter`, `state_machine`
* **Philosophy**: `truth_table`, `trolley_lab`, `prisoners_dilemma`, `veil_of_ignorance`, `bayes_belief`, `sorites`, `argument_mapper`
* **Psychology**: `psych_stroop`, `psych_signal_detection`, `psych_rescorla_wagner`, `psych_operant_schedules`, `psych_serial_position`, `psych_forgetting_curve`, `psych_psychophysics`, `psych_visual_search`, `psych_mental_rotation`, `psych_prospect_theory`, `psych_drift_diffusion`, `psych_asch_conformity`, `psych_big_five`, `psych_power_replication`, `psych_habituation`, `psych_exposure_therapy`, `psych_hicks_law`, `psych_muller_lyer`, `psych_nback`, `psych_sleep_two_process`
