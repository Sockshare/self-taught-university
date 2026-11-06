/* Self-Taught — Arcade Expansion for Existing 7 Domains (140 Interactive Simulations: 20 per domain)
 * Domains covered: math (20), physics (20), chemistry (20), ai (20), robotics (20), philosophy (20), languages (20).
 */
(function () {
  "use strict";
  if (!window.SelfTaughtSims || !window.SelfTaughtSims.registerBatch) return;

  const SPECS = [
    // =========================================================================
    // 1. MATHEMATICS (20 simulations)
    // =========================================================================
    {
      id: "math_fourier_epicycles", name: "Fourier Epicycles & Complex Phasors", domains: ["math"],
      engine: "wave_fourier", formula: "f(t) = Σ cₙ e^{i n ω₀ t}",
      description: "Decompose periodic contours into rotating complex exponential phasors and inspect Gibbs ringing near discontinuities.",
      params: [
        { key: "omega", label: "Fundamental ω₀", type: "range", min: 0.5, max: 5.0, step: 0.1, value: 1.8 },
        { key: "decay", label: "Spectral Roll-Off α", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 1.0 },
        { key: "harmonics", label: "Epicycle Count N", type: "range", min: 1, max: 15, step: 1, value: 7 },
        { key: "jitter", label: "Phase Noise σ_φ", type: "range", min: 0, max: 1.0, step: 0.02, value: 0.05 },
      ],
      challenges: [
        { id: "math_fe_1", text: "Increase Epicycle Count N ≥ 10 to sharpen the square-wave corner and observe Gibbs overshoot.", xp: 15 },
        { id: "math_fe_2", text: "Drag the spectral probe on the canvas to measure local harmonic amplitude.", xp: 15 },
        { id: "math_fe_3", text: "Vary Spectral Roll-Off α to transition between sawtooth (1/n) and triangle (1/n²) decay.", xp: 15 },
      ],
    },
    {
      id: "math_lorenz_attractor", name: "Lorenz Strange Attractor & Chaos", domains: ["math"],
      engine: "phase_attractor", subtype: "lorenz", formula: "dx/dt = σ(y−x), dy/dt = x(ρ−z)−y, dz/dt = xy−βz",
      xLabel: "Convection x", yLabel: "Temp ΔT y",
      description: "Integrate the 3D Lorenz atmospheric convection equations via RK4 and observe butterfly-wing chaos and positive Lyapunov exponents.",
      params: [
        { key: "sigma", label: "Prandtl Number σ", type: "range", min: 4, max: 20, step: 0.5, value: 10 },
        { key: "rho", label: "Rayleigh Number ρ", type: "range", min: 10, max: 45, step: 0.5, value: 28 },
        { key: "beta", label: "Geometric Ratio β", type: "range", min: 1.0, max: 4.0, step: 0.1, value: 2.67 },
      ],
      challenges: [
        { id: "math_la_1", text: "Tune Rayleigh Number ρ across the Hopf bifurcation at ρ ≈ 24.74.", xp: 15 },
        { id: "math_la_2", text: "Click the phase plane to launch a nearby trajectory and watch exponential divergence.", xp: 15 },
        { id: "math_la_3", text: "Stabilize the attractor into a damped fixed point by lowering ρ below 14.", xp: 15 },
      ],
    },
    {
      id: "math_svd_low_rank", name: "Singular Value Decomposition (SVD) Manifold", domains: ["math"],
      engine: "neural_manifold", formula: "A = U Σ Vᵀ = Σᵢ σᵢ uᵢ vᵢᵀ",
      description: "Explore rank-k matrix approximation, Eckart-Young Frobenius error bounds, and singular value spectrum decay.",
      params: [
        { key: "rank_ratio", label: "Retained Rank Ratio k/r", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.5 },
        { key: "cond", label: "Condition Number κ(A)", type: "range", min: 1.0, max: 20.0, step: 0.5, value: 4.5 },
        { key: "noise", label: "Spectral Perturbation ε", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.1 },
      ],
      challenges: [
        { id: "math_svd_1", text: "Adjust Condition Number κ(A) to observe elliptical stretching of the quadratic form.", xp: 15 },
        { id: "math_svd_2", text: "Click the manifold to project a test vector onto the top singular subspace.", xp: 15 },
        { id: "math_svd_3", text: "Balance rank truncation k/r against spectral perturbation ε to minimize reconstruction loss.", xp: 15 },
      ],
    },
    {
      id: "math_pde_heat_wave", name: "2D Reaction-Diffusion & Laplacian PDE Solver", domains: ["math"],
      engine: "field_lattice", formula: "∂u/∂t = D ∇²u + R(u,v)",
      description: "Solve coupled parabolic PDEs on a 2D finite-difference stencil and inspect eigenmode smoothing and Turing patterns.",
      params: [
        { key: "feed", label: "Source Feed Rate F", type: "range", min: 0.01, max: 0.09, step: 0.002, value: 0.038 },
        { key: "kill", label: "Sink Decay Rate K", type: "range", min: 0.04, max: 0.075, step: 0.001, value: 0.061 },
        { key: "diff", label: "Diffusivity D", type: "range", min: 0.05, max: 0.35, step: 0.01, value: 0.18 },
      ],
      challenges: [
        { id: "math_pde_1", text: "Tune Diffusivity D and Feed Rate F to transition from spots to labyrinthine stripes.", xp: 15 },
        { id: "math_pde_2", text: "Click or drag on the 2D domain to impose a localized Dirichlet boundary impulse.", xp: 15 },
        { id: "math_pde_3", text: "Drive the Laplacian toward homogeneous equilibrium by raising diffusivity D.", xp: 15 },
      ],
    },
    {
      id: "math_markov_ergodic", name: "Markov Chain Mixing & Perron-Frobenius Spectrum", domains: ["math"],
      engine: "network_graph", formula: "πᵀ P = πᵀ,  ‖Pᵗ − 1πᵀ‖ ≤ C |λ₂|ᵗ",
      description: "Simulate random walks on a directed stochastic graph and relate mixing time to the spectral gap 1 − |λ₂|.",
      params: [
        { key: "deg", label: "Transition Out-Degree k", type: "range", min: 1, max: 5, step: 1, value: 2 },
        { key: "rate", label: "Jump Rate λ", type: "range", min: 0.2, max: 3.0, step: 0.1, value: 1.4 },
        { key: "teleport", label: "Ergodic Damping α", type: "range", min: 0.05, max: 0.95, step: 0.05, value: 0.15 },
      ],
      challenges: [
        { id: "math_mc_1", text: "Increase Out-Degree k to enlarge the algebraic connectivity λ₂ and accelerate mixing.", xp: 15 },
        { id: "math_mc_2", text: "Click a vertex to inject probability mass and watch convergence to stationary distribution π.", xp: 15 },
        { id: "math_mc_3", text: "Tune Ergodic Damping α to break periodicity and eliminate recurrent traps.", xp: 15 },
      ],
    },
    {
      id: "math_newton_fractal_basins", name: "Newton-Raphson Complex Basins & Convergence", domains: ["math"],
      engine: "neural_manifold", formula: "zₙ₊₁ = zₙ − α f(zₙ)/f'(zₙ)",
      description: "Trace damped Newton-Raphson root-finding trajectories over a non-convex complex potential with fractal basin boundaries.",
      params: [
        { key: "step", label: "Damping Factor α", type: "range", min: 0.1, max: 1.5, step: 0.05, value: 0.85 },
        { key: "aniso", label: "Root Asymmetry μ", type: "range", min: 0.5, max: 3.0, step: 0.1, value: 1.2 },
        { key: "reg", label: "Levenberg Shift λ", type: "range", min: 0.0, max: 0.8, step: 0.02, value: 0.08 },
      ],
      challenges: [
        { id: "math_nr_1", text: "Vary Damping Factor α to compare quadratic convergence (α=1) vs over-relaxed oscillation.", xp: 15 },
        { id: "math_nr_2", text: "Click near a saddle ridge on the canvas to observe basin boundary sensitivity.", xp: 15 },
        { id: "math_nr_3", text: "Tune Levenberg Shift λ to stabilize iterations near singular Jacobian points.", xp: 15 },
      ],
    },
    {
      id: "math_conformal_joukowsky", name: "Conformal Mapping & Joukowsky Airfoil Transform", domains: ["math"],
      engine: "wave_fourier", formula: "w = z + c²/z,  f'(z) ≠ 0",
      description: "Map circles in the complex z-plane to airfoils and ellipses in the w-plane while preserving local intersection angles.",
      params: [
        { key: "camber", label: "Camber Offset η_y", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.22 },
        { key: "thick", label: "Thickness Offset ξ_x", type: "range", min: 0.05, max: 0.8, step: 0.02, value: 0.18 },
        { key: "modes", label: "Laurent Terms M", type: "range", min: 1, max: 10, step: 1, value: 4 },
      ],
      challenges: [
        { id: "math_cj_1", text: "Adjust Camber Offset η_y and Thickness ξ_x to resolve the trailing-edge Kutta cusp.", xp: 15 },
        { id: "math_cj_2", text: "Drag the complex plane probe to inspect local conformal magnification |f'(z)|.", xp: 15 },
        { id: "math_cj_3", text: "Sweep Laurent Terms M to compare pure Joukowsky vs Kármán-Trefftz profiles.", xp: 15 },
      ],
    },
    {
      id: "math_riemann_zeta_zeros", name: "Riemann Zeta Critical Line & Euler Product Spiral", domains: ["math"],
      engine: "wave_fourier", formula: "ζ(1/2 + it) = Σ n^{−1/2} e^{−i t ln n}",
      description: "Sum Dirichlet partial phasors along the critical line Re(s) = 1/2 and locate non-trivial zeros where the spiral passes the origin.",
      params: [
        { key: "imag_t", label: "Critical Height t", type: "range", min: 10.0, max: 40.0, step: 0.05, value: 14.13 },
        { key: "sigma", label: "Real Part σ = Re(s)", type: "range", min: 0.1, max: 0.9, step: 0.02, value: 0.5 },
        { key: "terms", label: "Dirichlet Terms N", type: "range", min: 2, max: 14, step: 1, value: 9 },
      ],
      challenges: [
        { id: "math_rz_1", text: "Set σ = 0.5 and tune Critical Height t near 14.13 or 21.02 to approach a non-trivial zero.", xp: 15 },
        { id: "math_rz_2", text: "Drag the probe on the canvas to inspect partial Dirichlet phasor cancellation.", xp: 15 },
        { id: "math_rz_3", text: "Shift Re(s) away from 0.5 and observe why zero crossings break symmetry.", xp: 15 },
      ],
    },
    {
      id: "math_galois_cyclotomic", name: "Cyclotomic Fields & Galois Group Permutations", domains: ["math"],
      engine: "quantum_orbital", formula: "Gal(ℚ(ζₙ)/ℚ) ≅ (ℤ/nℤ)×,  ζₙ = e^{2πi/n}",
      description: "Visualize primitive nth roots of unity on the unit circle and act on them via Frobenius automorphisms ζ ↦ ζᵏ.",
      params: [
        { key: "modulus", label: "Cyclotomic Degree n", type: "range", min: 3, max: 19, step: 1, value: 7 },
        { key: "multiplier", label: "Automorphism Power k", type: "range", min: 1, max: 12, step: 1, value: 3 },
        { key: "damping", label: "Subfield Projection", type: "range", min: 0, max: 1, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "math_gc_1", text: "Select coprime Automorphism Power k and Cyclotomic Degree n to generate the full multiplicative orbit.", xp: 15 },
        { id: "math_gc_2", text: "Click the unit circle to select a root of unity and trace its Galois conjugate orbit.", xp: 15 },
        { id: "math_gc_3", text: "Project onto the maximal real subfield ℚ(ζₙ + ζₙ⁻¹) using the projection slider.", xp: 15 },
      ],
    },
    {
      id: "math_geodesic_curvature", name: "Riemannian Geodesics & Gaussian Curvature K", domains: ["math"],
      engine: "quantum_orbital", formula: "d²xᵏ/ds² + Γᵏᵢⱼ (dxⁱ/ds)(dxʲ/ds) = 0",
      description: "Integrate geodesic spray on a curved 2-manifold and measure Jacobi field deviation and Gauss-Bonnet holonomy.",
      params: [
        { key: "curvature", label: "Gaussian Curvature K", type: "range", min: -1.5, max: 2.0, step: 0.05, value: 0.8 },
        { key: "azimuth", label: "Launch Pitch θ₀", type: "range", min: 0.1, max: 3.0, step: 0.05, value: 1.1 },
        { key: "torsion", label: "Metric Anisotropy ε", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.2 },
      ],
      challenges: [
        { id: "math_gc_geo1", text: "Compare geodesic convergence (K > 0) vs hyperbolic divergence (K < 0).", xp: 15 },
        { id: "math_gc_geo2", text: "Click the manifold sphere to parallel-transport a tangent vector around a closed loop.", xp: 15 },
        { id: "math_gc_geo3", text: "Locate conjugate antipodal focal points under positive Gaussian curvature.", xp: 15 },
      ],
    },
    {
      id: "math_monte_carlo_importance", name: "Monte Carlo Importance Sampling & Variance Reduction", domains: ["math"],
      engine: "kinetics_thermodynamics", formula: "I = ∫ [f(x)/q(x)] q(x) dx,  σ²_IS ≪ σ²_MC",
      description: "Compare naive uniform Monte Carlo against proposal-tilted importance sampling and inspect effective sample size (ESS).",
      params: [
        { key: "tilt", label: "Proposal Tilt μ_q", type: "range", min: 0.1, max: 2.5, step: 0.05, value: 1.1 },
        { key: "spread", label: "Proposal Scale σ_q", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 0.7 },
        { key: "tail", label: "Target Tail Heaviness α", type: "range", min: 0.5, max: 3.5, step: 0.1, value: 1.6 },
      ],
      challenges: [
        { id: "math_mcis_1", text: "Align Proposal Tilt μ_q with the target mode to maximize Effective Sample Size (ESS).", xp: 15 },
        { id: "math_mcis_2", text: "Drag the operating point along the likelihood ratio curve w(x) = p(x)/q(x).", xp: 15 },
        { id: "math_mcis_3", text: "Observe variance explosion when Proposal Scale σ_q is narrower than target tails.", xp: 15 },
      ],
    },
    {
      id: "math_simplex_linear_prog", name: "Linear Programming Polytope & Simplex Pivots", domains: ["math"],
      engine: "strategic_game", formula: "max cᵀx  s.t.  Ax ≤ b, x ≥ 0",
      description: "Walk along extreme vertices of a convex feasible polytope and verify complementary slackness and strong KKT duality.",
      params: [
        { key: "obj_x", label: "Objective Gradient c₁", type: "range", min: -2.0, max: 3.0, step: 0.1, value: 1.4 },
        { key: "obj_y", label: "Objective Gradient c₂", type: "range", min: -2.0, max: 3.0, step: 0.1, value: 0.9 },
        { key: "barrier", label: "Interior Barrier μ", type: "range", min: 0.01, max: 1.0, step: 0.02, value: 0.15 },
      ],
      challenges: [
        { id: "math_lp_1", text: "Rotate Objective Gradient (c₁, c₂) to trigger a vertex jump across an active facet.", xp: 15 },
        { id: "math_lp_2", text: "Click inside the simplex to compare central-path interior trajectories vs boundary pivots.", xp: 15 },
        { id: "math_lp_3", text: "Shrink Interior Barrier μ → 0 to drive the duality gap to zero.", xp: 15 },
      ],
    },
    {
      id: "math_bifurcation_logistic", name: "Feigenbaum Period-Doubling & Logistic Bifurcation", domains: ["math"],
      engine: "phase_attractor", subtype: "duffing", formula: "xₙ₊₁ = r xₙ (1 − xₙ),  δ ≈ 4.6692",
      xLabel: "Population xₙ", yLabel: "Next Map xₙ₊₁",
      description: "Explore period-doubling cascades into chaos, cobweb orbits, and universal Feigenbaum scaling constants.",
      params: [
        { key: "r_growth", label: "Growth Parameter r", type: "range", min: 2.5, max: 4.0, step: 0.01, value: 3.58 },
        { key: "damping", label: "Map Coupling ε", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.25 },
        { key: "forcing", label: "Periodic Modulation A", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.15 },
      ],
      challenges: [
        { id: "math_bl_1", text: "Sweep Growth Parameter r past 3.0, 3.449, and 3.5699 to witness period-2, 4, and chaos.", xp: 15 },
        { id: "math_bl_2", text: "Click the phase space to seed two nearby orbits and measure Lyapunov divergence.", xp: 15 },
        { id: "math_bl_3", text: "Locate the period-3 stability window near r ≈ 3.83.", xp: 15 },
      ],
    },
    {
      id: "math_wavelet_multires", name: "Wavelet Time-Frequency Scalogram & Heisenberg Box", domains: ["math"],
      engine: "wave_fourier", formula: "W_ψ f(a,b) = |a|^{−1/2} ∫ f(t) ψ*((t−b)/a) dt",
      description: "Trade off temporal vs spectral localization across dyadic Morlet/Haar wavelet scales and verify the Gabor uncertainty bound.",
      params: [
        { key: "scale_a", label: "Wavelet Dilation Scale a", type: "range", min: 0.2, max: 4.0, step: 0.1, value: 1.2 },
        { key: "chirp", label: "Chirp Sweep Rate β", type: "range", min: 0.1, max: 3.0, step: 0.1, value: 1.1 },
        { key: "octaves", label: "Dyadic Sub-bands J", type: "range", min: 2, max: 10, step: 1, value: 6 },
      ],
      challenges: [
        { id: "math_wv_1", text: "Adjust Dilation Scale a to stretch and compress the Heisenberg uncertainty box Δt·Δω ≥ 1/2.", xp: 15 },
        { id: "math_wv_2", text: "Drag the time-frequency probe to localize a transient impulse.", xp: 15 },
        { id: "math_wv_3", text: "Increase Dyadic Sub-bands J to resolve both high-frequency transients and low-frequency drift.", xp: 15 },
      ],
    },
    {
      id: "math_persistent_homology", name: "Topological Data Analysis & Vietoris-Rips Filtrations", domains: ["math"],
      engine: "network_graph", formula: "βₖ = rank(Hₖ) = dim(ker ∂ₖ) − dim(im ∂ₖ₊₁)",
      description: "Grow Vietoris-Rips balls of radius ε around a noisy point cloud and track Betti numbers β₀ (components) and β₁ (1-cycles).",
      params: [
        { key: "eps_radius", label: "Filtration Radius ε", type: "range", min: 0.1, max: 3.0, step: 0.05, value: 1.2 },
        { key: "noise_lvl", label: "Manifold Jitter σ", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.18 },
        { key: "persistence", label: "Persistence Threshold τ", type: "range", min: 0.05, max: 1.0, step: 0.05, value: 0.35 },
      ],
      challenges: [
        { id: "math_ph_1", text: "Sweep Filtration Radius ε to observe the birth and death of the primary topological 1-cycle (β₁=1).", xp: 15 },
        { id: "math_ph_2", text: "Drag a vertex on the simplicial complex to test topological stability under perturbation.", xp: 15 },
        { id: "math_ph_3", text: "Filter out short-lived topological noise using Persistence Threshold τ.", xp: 15 },
      ],
    },
    {
      id: "math_ito_stochastic_sde", name: "Itô Stochastic Calculus & Ornstein-Uhlenbeck SDE", domains: ["math"],
      engine: "phase_attractor", formula: "dXₜ = θ(μ − Xₜ)dt + σ dWₜ,  df = (f'μ + ½σ²f'')dt + σf'dWₜ",
      xLabel: "Process Xₜ", yLabel: "Itô Drift / Vol",
      description: "Simulate mean-reverting Ornstein-Uhlenbeck and geometric Brownian paths and verify the ½σ²f''(Xₜ)dt Itô correction term.",
      params: [
        { key: "theta", label: "Mean Reversion Speed θ", type: "range", min: 0.1, max: 4.0, step: 0.1, value: 1.5 },
        { key: "sigma", label: "Volatility Diffusion σ", type: "range", min: 0.1, max: 2.5, step: 0.05, value: 0.85 },
        { key: "drift", label: "Long-Run Equilibrium μ", type: "range", min: -1.5, max: 1.5, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "math_sde_1", text: "Increase Mean Reversion θ and confirm stationary variance shrinks as σ²/(2θ).", xp: 15 },
        { id: "math_sde_2", text: "Click the phase canvas to launch an ensemble of sample paths from an extreme initial state.", xp: 15 },
        { id: "math_sde_3", text: "Tune Volatility σ to observe the divergence between Itô and Stratonovich integrals.", xp: 15 },
      ],
    },
    {
      id: "math_p_adic_ultrametric", name: "p-Adic Valuation & Ultrametric Bruhat-Tits Tree", domains: ["math"],
      engine: "network_graph", formula: "|x − z|_p ≤ max(|x − y|_p, |y − z|_p)",
      description: "Explore non-Archimedean ultrametric balls in ℚ_p where every point inside a disk is its center and all triangles are isosceles.",
      params: [
        { key: "prime_p", label: "Prime Base p", type: "range", min: 2, max: 7, step: 1, value: 3 },
        { key: "depth", label: "Valuation Precision p⁻ᵏ", type: "range", min: 1, max: 5, step: 1, value: 3 },
        { key: "residue", label: "Hensel Lift Step", type: "range", min: 0.1, max: 2.0, step: 0.1, value: 0.8 },
      ],
      challenges: [
        { id: "math_pad_1", text: "Change Prime Base p to see p-ary branching across valuation levels.", xp: 15 },
        { id: "math_pad_2", text: "Click a node to verify the strong triangle inequality |x+y|_p ≤ max(|x|_p, |y|_p).", xp: 15 },
        { id: "math_pad_3", text: "Trace a Hensel-lifting root approximation down the p-adic tree.", xp: 15 },
      ],
    },
    {
      id: "math_optimal_transport", name: "Wasserstein Optimal Transport & Sinkhorn Entropic Plan", domains: ["math"],
      engine: "neural_manifold", formula: "W₂²(μ,ν) = inf_π ∫ ‖x−y‖² dπ(x,y) + ε H(π)",
      description: "Compute entropically regularized Kantorovich transport plans via Sinkhorn-Knopp scaling and trace McCann displacement interpolations.",
      params: [
        { key: "epsilon", label: "Entropic Regularization ε", type: "range", min: 0.02, max: 1.0, step: 0.02, value: 0.15 },
        { key: "shift", label: "Distribution Separation Δμ", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 1.2 },
        { key: "iters", label: "Sinkhorn Scaling Rate", type: "range", min: 0.2, max: 2.0, step: 0.1, value: 1.0 },
      ],
      challenges: [
        { id: "math_ot_1", text: "Decrease Entropic Regularization ε toward 0 to sharpen the coupling matrix into a deterministic Monge map.", xp: 15 },
        { id: "math_ot_2", text: "Click the manifold to inspect the Wasserstein geodesic barycenter between source and target.", xp: 15 },
        { id: "math_ot_3", text: "Vary Distribution Separation Δμ and verify quadratic scaling of W₂².", xp: 15 },
      ],
    },
    {
      id: "math_spectral_laplacian", name: "Graph Laplacian Eigenmodes & Cheeger Conductance", domains: ["math"],
      engine: "network_graph", formula: "L v₂ = λ₂ v₂,  λ₂/2 ≤ h(G) ≤ √(2 dₘₐₓ λ₂)",
      description: "Compute the Fiedler vector v₂ of a weighted graph and partition nodes across the minimum-conductance spectral cut.",
      params: [
        { key: "bridge", label: "Bottleneck Bridge Weight w_b", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 0.35 },
        { key: "cluster", label: "Intra-Cluster Density", type: "range", min: 1, max: 4, step: 1, value: 3 },
        { key: "diff_rate", label: "Heat Kernel Time t", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 0.6 },
      ],
      challenges: [
        { id: "math_sl_1", text: "Lower Bottleneck Weight w_b and watch the Fiedler eigenvalue λ₂ approach zero.", xp: 15 },
        { id: "math_sl_2", text: "Click a vertex to launch a heat-kernel diffusion wave e^{−tL}δᵢ.", xp: 15 },
        { id: "math_sl_3", text: "Verify the Cheeger inequality connecting λ₂ to the sparse cut ratio h(G).", xp: 15 },
      ],
    },
    {
      id: "math_variational_brachistochrone", name: "Calculus of Variations & Euler-Lagrange Cycloid", domains: ["math"],
      engine: "kinetics_thermodynamics", formula: "d/dx (∂L/∂y') − ∂L/∂y = 0,  T = ∫ √((1+y'²)/(2gy)) dx",
      description: "Compare straight-line, parabolic, and cycloid descent curves between two points under gravity to minimize travel time functional J[y].",
      params: [
        { key: "curv_c", label: "Path Cycloidicity α", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 1.0 },
        { key: "drop_h", label: "Vertical Drop Ratio Δy/Δx", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 0.8 },
        { key: "friction", label: "Kinetic Drag μ", type: "range", min: 0.0, max: 0.5, step: 0.02, value: 0.04 },
      ],
      challenges: [
        { id: "math_vb_1", text: "Tune Path Cycloidicity α = 1.0 to achieve the stationary Euler-Lagrange minimum descent time.", xp: 15 },
        { id: "math_vb_2", text: "Drag the bead along the curve to verify tautochrone isochronicity.", xp: 15 },
        { id: "math_vb_3", text: "Add Kinetic Drag μ > 0 and find how friction shifts the optimal variational curve.", xp: 15 },
      ],
    },

    // =========================================================================
    // 2. PHYSICS (20 simulations)
    // =========================================================================
    {
      id: "phys_black_hole_lensing", name: "Schwarzschild Geodesics & Black Hole Gravitational Lensing", domains: ["physics"],
      engine: "quantum_orbital", formula: "d²u/dφ² + u = 3GM u² / c²,  r_ph = 1.5 r_s",
      description: "Integrate null and timelike geodesics around a Schwarzschild black hole to observe Einstein rings, the photon sphere at 1.5 r_s, and ISCO at 3 r_s.",
      params: [
        { key: "impact_b", label: "Impact Parameter b / r_s", type: "range", min: 1.6, max: 6.0, step: 0.05, value: 2.6 },
        { key: "mass_rs", label: "Schwarzschild Radius r_s", type: "range", min: 0.5, max: 2.5, step: 0.05, value: 1.0 },
        { key: "spin_a", label: "Kerr Frame-Dragging a*", type: "range", min: 0.0, max: 0.98, step: 0.02, value: 0.2 },
      ],
      challenges: [
        { id: "phys_bh_1", text: "Tune Impact Parameter b / r_s near √27/2 ≈ 2.60 to orbit the unstable photon sphere.", xp: 15 },
        { id: "phys_bh_2", text: "Click the orbital plane to change photon launch angle and observe relativistic deflection.", xp: 15 },
        { id: "phys_bh_3", text: "Increase Kerr Frame-Dragging a* to compare prograde vs retrograde ISCO radii.", xp: 15 },
      ],
    },
    {
      id: "phys_double_pendulum_chaos", name: "Lagrangian Double Pendulum & Poincaré Section", domains: ["physics"],
      engine: "phase_attractor", subtype: "duffing", formula: "d/dt(∂L/∂θ̇ᵢ) − ∂L/∂θᵢ = 0",
      xLabel: "Angle θ₁ (rad)", yLabel: "Momentum p₁",
      description: "Simulate the coupled Euler-Lagrange equations of a planar double pendulum transitioning from quasi-periodic KAM tori to Hamiltonian chaos.",
      params: [
        { key: "energy", label: "Total Mechanical Energy E", type: "range", min: 0.2, max: 3.5, step: 0.05, value: 1.8 },
        { key: "mass_ratio", label: "Bob Mass Ratio m₂/m₁", type: "range", min: 0.2, max: 3.0, step: 0.1, value: 1.0 },
        { key: "len_ratio", label: "Arm Length Ratio L₂/L₁", type: "range", min: 0.3, max: 2.0, step: 0.05, value: 1.0 },
      ],
      challenges: [
        { id: "phys_dp_1", text: "Compare low-energy normal modes against high-energy chaotic flipping (E > 2.0).", xp: 15 },
        { id: "phys_dp_2", text: "Click the phase portrait to launch two nearly identical initial conditions.", xp: 15 },
        { id: "phys_dp_3", text: "Tune Mass Ratio m₂/m₁ to maximize momentum transfer between arms.", xp: 15 },
      ],
    },
    {
      id: "phys_ising_ferromagnet", name: "2D Ising Model & Onsager Phase Transition", domains: ["physics"],
      engine: "field_lattice", formula: "H = −J Σ_{⟨i,j⟩} sᵢ sⱼ − B Σᵢ sᵢ,  T_c = 2J / (k_B ln(1+√2))",
      description: "Run Metropolis-Hastings spin flips on a 2D ferromagnetic lattice across the critical Onsager temperature T_c ≈ 2.269 J/k_B.",
      params: [
        { key: "temp", label: "Temperature T / T_c", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 1.0 },
        { key: "field_b", label: "External Field B", type: "range", min: -1.0, max: 1.0, step: 0.05, value: 0.0 },
        { key: "coupling_j", label: "Exchange Coupling J", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 1.0 },
      ],
      challenges: [
        { id: "phys_is_1", text: "Cool Temperature T/T_c below 1.0 to observe spontaneous magnetization symmetry breaking.", xp: 15 },
        { id: "phys_is_2", text: "Click/drag on the spin lattice to nucleate a reversed Weiss magnetic domain.", xp: 15 },
        { id: "phys_is_3", text: "Hold T/T_c = 1.0 to observe scale-invariant critical clusters and diverging susceptibility χ.", xp: 15 },
      ],
    },
    {
      id: "phys_maxwell_fdtd_cavity", name: "Maxwell Equations 2D FDTD & Evanescent Skin Depth", domains: ["physics"],
      engine: "wave_fourier", formula: "∇×E = −∂B/∂t,  ∇×H = J + ε ∂E/∂t",
      description: "Propagate transverse electromagnetic waves across dielectric interfaces and conducting media to measure Fresnel reflection and skin depth δ.",
      params: [
        { key: "freq", label: "Wave Frequency ω", type: "range", min: 0.5, max: 5.0, step: 0.1, value: 2.2 },
        { key: "eps_r", label: "Relative Permittivity ε_r", type: "range", min: 1.0, max: 9.0, step: 0.2, value: 4.0 },
        { key: "sigma", label: "Conductivity Loss tan δ", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.25 },
      ],
      challenges: [
        { id: "phys_mx_1", text: "Increase Permittivity ε_r to observe wavelength compression λ = λ₀/√ε_r.", xp: 15 },
        { id: "phys_mx_2", text: "Drag the field probe to measure standing-wave nodes and Voltage Standing Wave Ratio (VSWR).", xp: 15 },
        { id: "phys_mx_3", text: "Raise Conductivity Loss tan δ to observe exponential skin-depth attenuation.", xp: 15 },
      ],
    },
    {
      id: "phys_quantum_tunneling_wkb", name: "Quantum Barrier Tunneling & WKB Transmission", domains: ["physics"],
      engine: "quantum_orbital", formula: "T ≈ exp(−2 ∫ √(2m(V(x)−E))/ℏ dx)",
      description: "Scatter a Gaussian Schrödinger wavepacket against a finite potential barrier and observe exponential WKB decay and Fabry-Pérot resonance.",
      params: [
        { key: "energy_e", label: "Particle Energy E / V₀", type: "range", min: 0.1, max: 1.8, step: 0.05, value: 0.75 },
        { key: "width_a", label: "Barrier Width a (nm)", type: "range", min: 0.2, max: 3.0, step: 0.05, value: 1.1 },
        { key: "mass_m", label: "Effective Mass m*/mₑ", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "phys_qt_1", text: "Verify exponential sensitivity of transmission T when Barrier Width a doubles for E < V₀.", xp: 15 },
        { id: "phys_qt_2", text: "Click the state display to inject a coherent wavepacket superposition.", xp: 15 },
        { id: "phys_qt_3", text: "Tune Energy E / V₀ > 1.0 to locate a Ramsauer-Townsend transmission resonance where T = 1.", xp: 15 },
      ],
    },
    {
      id: "phys_carnot_stirling_cycle", name: "Carnot & Otto Thermodynamic P-V / T-S Engine", domains: ["physics"],
      engine: "kinetics_thermodynamics", formula: "η_Carnot = 1 − T_C / T_H,  ∮ P dV = ∮ T dS",
      description: "Trace isothermal and adiabatic strokes on coupled P-V and T-S diagrams and compare real irreversible efficiency against the Carnot bound.",
      params: [
        { key: "th_tc", label: "Reservoir Ratio T_H / T_C", type: "range", min: 1.2, max: 5.0, step: 0.1, value: 2.5 },
        { key: "comp_r", label: "Compression Ratio V₁ / V₂", type: "range", min: 1.5, max: 12.0, step: 0.5, value: 6.0 },
        { key: "gamma", label: "Adiabatic Index γ = C_p/C_v", type: "range", min: 1.2, max: 1.67, step: 0.02, value: 1.4 },
      ],
      challenges: [
        { id: "phys_cs_1", text: "Raise Reservoir Ratio T_H / T_C to increase maximum Carnot efficiency η = 1 − T_C/T_H.", xp: 15 },
        { id: "phys_cs_2", text: "Drag the piston state marker along the isothermal expansion stroke.", xp: 15 },
        { id: "phys_cs_3", text: "Compare monatomic (γ=1.67) vs diatomic (γ=1.40) adiabatic slopes.", xp: 15 },
      ],
    },
    {
      id: "phys_navier_stokes_karman", name: "Navier-Stokes Vortex Shedding & Kármán Street", domains: ["physics"],
      engine: "field_lattice", formula: "∂u/∂t + (u·∇)u = −∇p/ρ + ν∇²u,  St = f D / U",
      description: "Simulate incompressible viscous flow past a cylindrical obstacle across Reynolds numbers Re and observe alternating Kármán vortex shedding.",
      params: [
        { key: "reynolds", label: "Reynolds Number Re", type: "range", min: 10, max: 400, step: 5, value: 140 },
        { key: "strouhal", label: "Inflow Velocity U₀", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 1.1 },
        { key: "visc", label: "Kinematic Viscosity ν", type: "range", min: 0.02, max: 0.5, step: 0.01, value: 0.12 },
      ],
      challenges: [
        { id: "phys_ns_1", text: "Increase Reynolds Number Re past ~47 to trigger the Hopf bifurcation into periodic vortex shedding.", xp: 15 },
        { id: "phys_ns_2", text: "Click or drag in the wake to inject a vorticity perturbation.", xp: 15 },
        { id: "phys_ns_3", text: "Verify Strouhal number St ≈ 0.20 stability across moderate Reynolds numbers.", xp: 15 },
      ],
    },
    {
      id: "phys_foucault_coriolis", name: "Rotating Reference Frame & Foucault Coriolis Precession", domains: ["physics"],
      engine: "phase_attractor", formula: "a_rot = a_in − 2Ω×v − Ω×(Ω×r),  ω_p = Ω sin φ",
      xLabel: "East Displacement x", yLabel: "North Displacement y",
      description: "Track projectile and Foucault pendulum trajectories in a rotating planetary frame under Coriolis and centrifugal pseudo-forces.",
      params: [
        { key: "lat_phi", label: "Latitude φ (deg)", type: "range", min: 0, max: 90, step: 1, value: 48 },
        { key: "omega_rot", label: "Planetary Rotation Ω", type: "range", min: 0.1, max: 3.0, step: 0.05, value: 1.0 },
        { key: "damping", label: "Pivot Damping ζ", type: "range", min: 0.0, max: 0.5, step: 0.02, value: 0.05 },
      ],
      challenges: [
        { id: "phys_fc_1", text: "Set Latitude φ = 90° (North Pole) vs φ = 0° (Equator) to verify precession rate Ω sin φ.", xp: 15 },
        { id: "phys_fc_2", text: "Click the horizontal plane to launch a rose-petal Coriolis trajectory.", xp: 15 },
        { id: "phys_fc_3", text: "Increase Planetary Rotation Ω to observe geostrophic cyclonic deflection.", xp: 15 },
      ],
    },
    {
      id: "phys_doppler_mach_cone", name: "Acoustic Doppler Shift & Supersonic Mach Shock Cone", domains: ["physics"],
      engine: "wave_fourier", formula: "sin μ = c_s / v_s = 1 / M,  f_obs = f₀ / (1 ∓ M cos θ)",
      description: "Emit spherical wavefronts from a moving source and transition through the transonic barrier M = 1 into a conical Mach shock envelope.",
      params: [
        { key: "mach", label: "Mach Number M = v/c_s", type: "range", min: 0.1, max: 2.8, step: 0.05, value: 1.35 },
        { key: "freq", label: "Source Emission Rate f₀", type: "range", min: 1.0, max: 8.0, step: 0.2, value: 3.5 },
        { key: "atten", label: "Atmospheric Attenuation α", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "phys_dm_1", text: "Set Mach Number M = 1.0 to observe wavefront pileup at the sonic barrier.", xp: 15 },
        { id: "phys_dm_2", text: "Drag the observer microphone on the canvas to measure approaching vs receding Doppler shift.", xp: 15 },
        { id: "phys_dm_3", text: "Tune M = 2.0 and verify the Mach half-angle μ = arcsin(1/2) = 30°.", xp: 15 },
      ],
    },
    {
      id: "phys_rlc_phasor_bode", name: "Driven RLC Resonator, Impedance Phasor & Bode Plot", domains: ["physics"],
      engine: "wave_fourier", formula: "Z(ω) = R + i(ωL − 1/ωC),  Q = (1/R)√(L/C)",
      description: "Sweep AC drive frequency across LC resonance ω₀ = 1/√(LC) and inspect voltage/current phase lead-lag and quality factor Q.",
      params: [
        { key: "freq_ratio", label: "Drive Ratio ω / ω₀", type: "range", min: 0.2, max: 3.0, step: 0.05, value: 1.0 },
        { key: "q_factor", label: "Quality Factor Q", type: "range", min: 0.5, max: 15.0, step: 0.5, value: 5.0 },
        { key: "load_r", label: "Damping Resistance R (Ω)", type: "range", min: 1, max: 50, step: 1, value: 10 },
      ],
      challenges: [
        { id: "phys_rlc_1", text: "Tune ω / ω₀ = 1.0 so inductive and capacitive reactances cancel (phase φ = 0°).", xp: 15 },
        { id: "phys_rlc_2", text: "Drag the frequency probe to locate the −3 dB half-power bandwidth Δω = ω₀/Q.", xp: 15 },
        { id: "phys_rlc_3", text: "Compare capacitive phase lead (ω < ω₀) vs inductive phase lag (ω > ω₀).", xp: 15 },
      ],
    },
    {
      id: "phys_bragg_crystal_diffraction", name: "Bragg X-Ray Diffraction & Reciprocal Lattice Ewald Sphere", domains: ["physics"],
      engine: "wave_fourier", formula: "2 d_{hkl} sin θ = n λ,  Δk = G_{hkl}",
      description: "Scatter monochromatic X-rays off Miller crystal planes (hkl) and locate constructive Laue/Bragg peaks on the Ewald sphere.",
      params: [
        { key: "theta", label: "Glancing Angle θ (deg)", type: "range", min: 5, max: 85, step: 0.5, value: 28.0 },
        { key: "d_spacing", label: "Lattice Spacing d (Å)", type: "range", min: 1.0, max: 5.0, step: 0.05, value: 2.4 },
        { key: "lambda", label: "X-Ray Wavelength λ (Å)", type: "range", min: 0.5, max: 3.0, step: 0.05, value: 1.54 },
      ],
      challenges: [
        { id: "phys_brg_1", text: "Satisfy Bragg's law 2d sin θ = nλ for Cu-Kα (λ = 1.54 Å) to maximize peak intensity.", xp: 15 },
        { id: "phys_brg_2", text: "Drag the detector probe across 2θ to measure higher-order diffraction peaks (n=2, 3).", xp: 15 },
        { id: "phys_brg_3", text: "Decrease Lattice Spacing d and observe reciprocal-space expansion.", xp: 15 },
      ],
    },
    {
      id: "phys_rabi_bloch_precession", name: "Two-Level Rabi Oscillations & Bloch Sphere Nutation", domains: ["physics"],
      engine: "quantum_orbital", formula: "Ω_eff = √(Ω_R² + Δ²),  P₁(t) = (Ω_R/Ω_eff)² sin²(Ω_eff t/2)",
      description: "Drive a quantum two-level spin-1/2 system with an oscillating RF field and observe resonant Rabi flips and Ramsey detuning fringes.",
      params: [
        { key: "rabi_omega", label: "Rabi Frequency Ω_R", type: "range", min: 0.2, max: 4.0, step: 0.1, value: 1.8 },
        { key: "detuning", label: "Detuning Δ = ω − ω₀", type: "range", min: -3.0, max: 3.0, step: 0.1, value: 0.0 },
        { key: "t2_decay", label: "Dephasing Rate 1/T₂", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.1 },
      ],
      challenges: [
        { id: "phys_rb_1", text: "Set Detuning Δ = 0 to achieve 100% population inversion P(|1⟩) = 1.0.", xp: 15 },
        { id: "phys_rb_2", text: "Click the Bloch sphere to apply an instantaneous π/2 Ramsey pulse.", xp: 15 },
        { id: "phys_rb_3", text: "Increase Detuning |Δ| and observe faster nutation Ω_eff with reduced inversion amplitude.", xp: 15 },
      ],
    },
    {
      id: "phys_bose_fermi_quantum_stat", name: "Bose-Einstein, Fermi-Dirac & Maxwell-Boltzmann Statistics", domains: ["physics"],
      engine: "kinetics_thermodynamics", formula: "⟨n(ε)⟩ = 1 / (exp((ε − μ)/k_B T) ± 1)",
      description: "Compare quantum occupancy distributions across temperature T and chemical potential μ, from Fermi surfaces to Bose-Einstein condensation.",
      params: [
        { key: "temp_kt", label: "Thermal Energy k_B T / E_F", type: "range", min: 0.02, max: 1.5, step: 0.02, value: 0.15 },
        { key: "chem_mu", label: "Chemical Potential μ", type: "range", min: 0.1, max: 1.5, step: 0.02, value: 0.8 },
        { key: "spin_deg", label: "Spin Degeneracy g_s", type: "range", min: 1, max: 6, step: 1, value: 2 },
      ],
      challenges: [
        { id: "phys_bf_1", text: "Cool k_B T / E_F → 0.02 to sharpen the degenerate Fermi step at ε = E_F.", xp: 15 },
        { id: "phys_bf_2", text: "Drag the energy probe across the thermal smearing window ~4 k_B T around μ.", xp: 15 },
        { id: "phys_bf_3", text: "Raise k_B T / E_F above 1.0 to see quantum statistics converge to classical Boltzmann tails.", xp: 15 },
      ],
    },
    {
      id: "phys_penning_cyclotron_trap", name: "Lorentz E×B Drift & Penning Ion Trap Trajectories", domains: ["physics"],
      engine: "phase_attractor", formula: "m dv/dt = q(E + v × B),  v_d = (E × B)/B²",
      xLabel: "Radial x (mm)", yLabel: "Radial y (mm)",
      description: "Confine charged particles using axial magnetic fields and quadrupole electrostatic potentials, decomposing cyclotron, magnetron, and axial modes.",
      params: [
        { key: "mag_b", label: "Axial Magnetic Field B₀ (T)", type: "range", min: 0.5, max: 5.0, step: 0.1, value: 2.4 },
        { key: "volt_u", label: "Quadrupole Voltage U₀ (V)", type: "range", min: 0.1, max: 3.0, step: 0.1, value: 0.9 },
        { key: "q_over_m", label: "Charge-to-Mass q/m", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 1.0 },
      ],
      challenges: [
        { id: "phys_pt_1", text: "Keep B₀ above the radial confinement limit ω_c² > 2ω_z² to prevent ion escape.", xp: 15 },
        { id: "phys_pt_2", text: "Click the trap cross-section to inject an ion and observe epitrochoid cyclotron+magnetron loops.", xp: 15 },
        { id: "phys_pt_3", text: "Vary q/m to separate isotopes by their modified cyclotron frequency ω₊.", xp: 15 },
      ],
    },
    {
      id: "phys_snell_fresnel_brewster", name: "Fresnel Equations, Brewster's Angle & Evanescent TIR", domains: ["physics"],
      engine: "kinetics_thermodynamics", formula: "n₁ sin θ₁ = n₂ sin θ₂,  tan θ_B = n₂ / n₁",
      description: "Plot s- and p-polarized reflectance R_s, R_p across incidence angle θᵢ, pinpointing Brewster's zero-glare angle and total internal reflection.",
      params: [
        { key: "n1", label: "Incident Index n₁", type: "range", min: 1.0, max: 2.5, step: 0.05, value: 1.0 },
        { key: "n2", label: "Transmitted Index n₂", type: "range", min: 1.0, max: 2.5, step: 0.05, value: 1.52 },
        { key: "pol", label: "p-Polarization Fraction", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.8 },
      ],
      challenges: [
        { id: "phys_sfb_1", text: "Drag the incidence angle cursor to Brewster's angle θ_B = arctan(n₂/n₁) where R_p = 0.", xp: 15 },
        { id: "phys_sfb_2", text: "Set n₁ > n₂ (e.g. glass to air) to trigger Total Internal Reflection above θ_c = arcsin(n₂/n₁).", xp: 15 },
        { id: "phys_sfb_3", text: "Compare s- vs p-polarized Fresnel reflection at grazing incidence.", xp: 15 },
      ],
    },
    {
      id: "phys_chladni_plate_modes", name: "2D Biharmonic Chladni Plate Nodal Patterns", domains: ["physics"],
      engine: "field_lattice", formula: "D ∇⁴w + ρh ∂²w/∂t² = F(x,y) cos(ωt),  w_mn = cos(mπx/L)cos(nπy/L) ± ...",
      description: "Excite flexural eigenmodes on a clamped/free square acoustic plate and watch sand grains migrate to zero-amplitude nodal lines.",
      params: [
        { key: "mode_m", label: "Horizontal Mode Index m", type: "range", min: 1, max: 7, step: 1, value: 3 },
        { key: "mode_n", label: "Vertical Mode Index n", type: "range", min: 1, max: 7, step: 1, value: 5 },
        { key: "damping", label: "Plate Internal Damping ζ", type: "range", min: 0.02, max: 0.5, step: 0.02, value: 0.12 },
      ],
      challenges: [
        { id: "phys_ch_1", text: "Set distinct mode numbers (m ≠ n) to form symmetric/antisymmetric Chladni nodal figures.", xp: 15 },
        { id: "phys_ch_2", text: "Click on the plate to bow/pluck a local point and excite superposed eigenmodes.", xp: 15 },
        { id: "phys_ch_3", text: "Set m = n to collapse the degenerate pair into diagonal/circular nodes.", xp: 15 },
      ],
    },
    {
      id: "phys_josephson_squid", name: "Superconducting Josephson Junction & Shapiro Steps", domains: ["physics"],
      engine: "phase_attractor", formula: "I = I_c sin φ,  dφ/dt = 2eV / ℏ",
      xLabel: "Gauge Phase φ", yLabel: "Voltage dφ/dt",
      description: "Simulate the resistively and capacitively shunted junction (RCSJ) washboard potential to observe DC/AC Josephson effects and quantized Shapiro voltage steps.",
      params: [
        { key: "bias_i", label: "Bias Current I / I_c", type: "range", min: 0.1, max: 2.5, step: 0.05, value: 1.15 },
        { key: "stewart_beta", label: "McCumber Capacitance β_c", type: "range", min: 0.1, max: 5.0, step: 0.1, value: 1.4 },
        { key: "rf_drive", label: "Microwave RF Drive A_rf", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.6 },
      ],
      challenges: [
        { id: "phys_jj_1", text: "Keep Bias Current I / I_c < 1.0 to observe the zero-voltage DC supercurrent state.", xp: 15 },
        { id: "phys_jj_2", text: "Click the phase portrait to kick the superconducting phase φ over the washboard barrier.", xp: 15 },
        { id: "phys_jj_3", text: "Raise Microwave RF Drive A_rf with I > I_c to lock onto quantized Shapiro voltage steps.", xp: 15 },
      ],
    },
    {
      id: "phys_rayleigh_benard_convection", name: "Rayleigh-Bénard Thermal Convection & Boussinesq Rolls", domains: ["physics"],
      engine: "field_lattice", formula: "Ra = g α ΔT H³ / (ν κ),  Ra_c ≈ 1708",
      description: "Heat a fluid layer from below and observe the transition from conductive heat transfer to counter-rotating Bénard convection cells.",
      params: [
        { key: "rayleigh", label: "Normalized Rayleigh Ra / Ra_c", type: "range", min: 0.3, max: 5.0, step: 0.1, value: 2.1 },
        { key: "prandtl", label: "Prandtl Number Pr = ν/κ", type: "range", min: 0.5, max: 15.0, step: 0.5, value: 7.0 },
        { key: "aspect", label: "Thermal Diffusivity κ", type: "range", min: 0.05, max: 0.4, step: 0.01, value: 0.18 },
      ],
      challenges: [
        { id: "phys_rbc_1", text: "Raise Ra / Ra_c above 1.0 to trigger convective roll instability and raise Nusselt number Nu > 1.", xp: 15 },
        { id: "phys_rbc_2", text: "Click the fluid layer to inject a buoyant thermal plume.", xp: 15 },
        { id: "phys_rbc_3", text: "Vary Prandtl Number Pr to compare liquid-metal vs water/oil plume structures.", xp: 15 },
      ],
    },
    {
      id: "phys_zeeman_hyperfine_splitting", name: "Anomalous Zeeman Effect & Atomic Multiplet Splitting", domains: ["physics"],
      engine: "wave_fourier", formula: "ΔE = g_J μ_B B m_J,  g_J = 1 + [J(J+1)+S(S+1)−L(L+1)]/[2J(J+1)]",
      description: "Apply an external magnetic field B to lift m_J degeneracy via Landé g-factor splitting and transition to the strong-field Paschen-Back regime.",
      params: [
        { key: "mag_b", label: "Magnetic Field B (Tesla)", type: "range", min: 0.0, max: 5.0, step: 0.1, value: 1.8 },
        { key: "lande_g", label: "Landé Factor Ratio g_J", type: "range", min: 0.5, max: 2.5, step: 0.05, value: 1.33 },
        { key: "mult", label: "Total Angular Momentum 2J+1", type: "range", min: 2, max: 8, step: 1, value: 4 },
      ],
      challenges: [
        { id: "phys_zm_1", text: "Sweep Magnetic Field B from 0 to 5 T to watch spectral lines fan out linearly with m_J.", xp: 15 },
        { id: "phys_zm_2", text: "Drag the spectrometer probe to distinguish π (Δm=0) and σ± (Δm=±1) polarization components.", xp: 15 },
        { id: "phys_zm_3", text: "Increase B into the Paschen-Back regime where L and S decouple.", xp: 15 },
      ],
    },
    {
      id: "phys_casimir_vacuum_modes", name: "Quantum Vacuum Fluctuations & Casimir Plate Attraction", domains: ["physics"],
      engine: "wave_fourier", formula: "F_c / A = − π² ℏ c / (240 d⁴)",
      description: "Quantize electromagnetic standing modes between uncharged conducting plates and compute the negative Casimir pressure from excluded vacuum modes.",
      params: [
        { key: "gap_d", label: "Plate Separation d (nm)", type: "range", min: 10, max: 200, step: 5, value: 45 },
        { key: "cutoff", label: "Plasma Cutoff ω_p", type: "range", min: 1, max: 12, step: 1, value: 6 },
        { key: "temp_t", label: "Thermal Correction T (K)", type: "range", min: 0, max: 300, step: 10, value: 20 },
      ],
      challenges: [
        { id: "phys_cas_1", text: "Halve Plate Separation d and verify the 16× surge in Casimir attraction (∝ d⁻⁴).", xp: 15 },
        { id: "phys_cas_2", text: "Drag the cavity probe to inspect discrete intra-cavity modes vs continuum exterior modes.", xp: 15 },
        { id: "phys_cas_3", text: "Tune Plasma Cutoff ω_p to observe finite-conductivity skin-depth corrections.", xp: 15 },
      ],
    },

    // =========================================================================
    // 3. CHEMISTRY (20 simulations)
    // =========================================================================
    {
      id: "chem_michaelis_menten", name: "Michaelis-Menten & Allosteric Hill Enzyme Kinetics", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "v = V_max [S]ⁿ / (K_m'(I) + [S]ⁿ)",
      description: "Analyze initial enzymatic reaction velocity v₀ vs substrate concentration [S] under competitive, uncompetitive, and cooperative Hill binding.",
      params: [
        { key: "vmax", label: "Turnover Capacity V_max", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 1.0 },
        { key: "km", label: "Michaelis Constant K_m (mM)", type: "range", min: 0.05, max: 1.0, step: 0.02, value: 0.3 },
        { key: "hill_n", label: "Hill Cooperativity n_H", type: "range", min: 0.5, max: 4.0, step: 0.1, value: 1.0 },
      ],
      challenges: [
        { id: "chem_mm_1", text: "Increase K_m while holding V_max constant to simulate a competitive inhibitor.", xp: 15 },
        { id: "chem_mm_2", text: "Drag the substrate marker [S] to K_m and verify v₀ = 0.5 V_max.", xp: 15 },
        { id: "chem_mm_3", text: "Set Hill Cooperativity n_H ≥ 2.5 to turn the hyperbolic curve into a sigmoidal hemoglobin-like switch.", xp: 15 },
      ],
    },
    {
      id: "chem_nernst_electrochem", name: "Nernst Galvanic Cell Potential & Concentration Polarization", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "E = E° − (RT / nF) ln([Red]/[Ox]),  ΔG = −nFE",
      description: "Compute non-standard galvanic cell voltage E_cell as reaction quotient Q evolves toward equilibrium K_eq (where E = 0).",
      params: [
        { key: "e_std", label: "Standard Potential E° (V)", type: "range", min: 0.2, max: 2.2, step: 0.05, value: 1.10 },
        { key: "q_ratio", label: "Log Quotient log₁₀(Q)", type: "range", min: -4.0, max: 4.0, step: 0.1, value: -1.0 },
        { key: "n_elec", label: "Electrons Transferred n", type: "range", min: 1, max: 4, step: 1, value: 2 },
      ],
      challenges: [
        { id: "chem_ne_1", text: "Change log₁₀(Q) by 1 unit at n=1 vs n=2 to verify the 59.2/n mV Nernst slope.", xp: 15 },
        { id: "chem_ne_2", text: "Drag the reaction coordinate along the discharge curve toward equilibrium E = 0 V.", xp: 15 },
        { id: "chem_ne_3", text: "Configure a concentration cell (E° ≈ 0.2 V, Q ≪ 1) driven purely by entropic dilution.", xp: 15 },
      ],
    },
    {
      id: "chem_molecular_orbital_lcao", name: "LCAO-MO Bonding/Antibonding σ & π Orbital Interference", domains: ["chemistry"],
      engine: "quantum_orbital", formula: "ψ_± = (ψ_A ± ψ_B) / √(2(1 ± S_AB))",
      description: "Superpose atomic orbitals across internuclear distance R to form constructive σ bonding and nodal σ* antibonding molecular orbitals.",
      params: [
        { key: "bond_r", label: "Internuclear Distance R (Å)", type: "range", min: 0.5, max: 3.5, step: 0.05, value: 1.1 },
        { key: "delta_en", label: "Electronegativity Δχ (Polarity)", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.2 },
        { key: "anti_mix", label: "Antibonding σ* Population", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.15 },
      ],
      challenges: [
        { id: "chem_mo_1", text: "Tune Internuclear Distance R to maximize overlap integral S_AB without core repulsion.", xp: 15 },
        { id: "chem_mo_2", text: "Click the orbital display to inspect nodal plane inversion between ψ₊ and ψ₋.", xp: 15 },
        { id: "chem_mo_3", text: "Increase Δχ to shift homonuclear covalent sharing into a polar ionic orbital.", xp: 15 },
      ],
    },
    {
      id: "chem_arrhenius_eyring_tst", name: "Eyring Transition-State Theory & Activation Barrier ΔG‡", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "k = (k_B T / h) exp(−ΔG‡ / RT) = A exp(−E_a / RT)",
      description: "Shape the potential energy surface along the intrinsic reaction coordinate (IRC) and compare catalyzed vs uncatalyzed rate constants.",
      params: [
        { key: "ea_barrier", label: "Activation Barrier E_a (kJ/mol)", type: "range", min: 15, max: 120, step: 2, value: 65 },
        { key: "temp_k", label: "Temperature T (K)", type: "range", min: 250, max: 600, step: 5, value: 310 },
        { key: "catalyst", label: "Catalytic Stabilization ΔE_cat", type: "range", min: 0, max: 50, step: 2, value: 15 },
      ],
      challenges: [
        { id: "chem_ae_1", text: "Increase Catalyst Stabilization ΔE_cat and verify that forward and reverse rates speed up equally without shifting K_eq.", xp: 15 },
        { id: "chem_ae_2", text: "Drag the coordinate cursor to the saddle-point transition state [‡].", xp: 15 },
        { id: "chem_ae_3", text: "Raise Temperature T by 10 K to test the van 't Hoff rate-doubling heuristic.", xp: 15 },
      ],
    },
    {
      id: "chem_lennard_jones_md", name: "Lennard-Jones 6-12 Potential & Radial Distribution g(r)", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "V_LJ(r) = 4ε [ (σ/r)¹² − (σ/r)⁶ ]",
      description: "Balance Pauli short-range r⁻¹² repulsion against London dispersion r⁻⁶ attraction and inspect bond anharmonicity and thermal expansion.",
      params: [
        { key: "eps_depth", label: "Well Depth ε (kJ/mol)", type: "range", min: 0.2, max: 3.0, step: 0.05, value: 1.2 },
        { key: "sigma_r", label: "Collision Diameter σ (Å)", type: "range", min: 1.5, max: 5.0, step: 0.1, value: 3.4 },
        { key: "temp_e", label: "Thermal Excitation k_B T / ε", type: "range", min: 0.05, max: 1.5, step: 0.05, value: 0.35 },
      ],
      challenges: [
        { id: "chem_lj_1", text: "Drag the interatomic distance probe to the equilibrium minimum r_m = 2^{1/6} σ ≈ 1.122 σ.", xp: 15 },
        { id: "chem_lj_2", text: "Raise Thermal Excitation k_B T / ε near 1.0 to observe bond dissociation.", xp: 15 },
        { id: "chem_lj_3", text: "Compare noble-gas dispersion (small ε) vs strong intermolecular binding (large ε).", xp: 15 },
      ],
    },
    {
      id: "chem_buffer_speciation_alpha", name: "Polyprotic Acid-Base Speciation (αᵢ) & Buffer Capacity β", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "pH = pKₐ + log([A⁻]/[HA]),  β = dC_b / dpH",
      description: "Plot fractional speciation curves α₀, α₁, α₂, α₃ across pH and locate maximum buffer capacity peaks at pH = pKₐᵢ.",
      params: [
        { key: "pka1", label: "First Dissociation pKₐ₁", type: "range", min: 1.5, max: 6.0, step: 0.1, value: 2.15 },
        { key: "pka2", label: "Second Dissociation pKₐ₂", type: "range", min: 5.0, max: 10.0, step: 0.1, value: 7.20 },
        { key: "conc_c", label: "Total Buffer Molarity C_T (M)", type: "range", min: 0.05, max: 1.0, step: 0.05, value: 0.25 },
      ],
      challenges: [
        { id: "chem_bs_1", text: "Drag the pH cursor to pH = pKₐ₂ to verify [HA²⁻] = [H₂A⁻] (crossover α₁ = α₂ = 0.5).", xp: 15 },
        { id: "chem_bs_2", text: "Locate the isoelectric/amphiprotic point pH = ½(pKₐ₁ + pKₐ₂).", xp: 15 },
        { id: "chem_bs_3", text: "Increase Total Buffer Molarity C_T to scale up the Van Slyke buffer index β.", xp: 15 },
      ],
    },
    {
      id: "chem_belousov_zhabotinsky", name: "Belousov-Zhabotinsky Chemical Oscillator & Oregonator Spiral", domains: ["chemistry"],
      engine: "field_lattice", formula: "ε dx/dt = qy − xy + x(1−x),  dy/dt = −qy − xy + fz",
      description: "Simulate autocatalytic bromate-cerium redox waves and rotating chemical target/spiral patterns in an excitable Petri dish.",
      params: [
        { key: "f_stoich", label: "Stoichiometric Factor f", type: "range", min: 0.3, max: 2.2, step: 0.05, value: 1.0 },
        { key: "k_rate", label: "Autocatalytic Rate k", type: "range", min: 0.03, max: 0.08, step: 0.002, value: 0.058 },
        { key: "diff_d", label: "Ionic Diffusivity D", type: "range", min: 0.08, max: 0.32, step: 0.01, value: 0.19 },
      ],
      challenges: [
        { id: "chem_bz_1", text: "Tune Stoichiometric Factor f into the oscillatory Hopf instability window.", xp: 15 },
        { id: "chem_bz_2", text: "Click on the Petri dish to nucleate a broken wavefront that curls into a spiral pair.", xp: 15 },
        { id: "chem_bz_3", text: "Observe mutual annihilation when two chemical oxidation wavefronts collide.", xp: 15 },
      ],
    },
    {
      id: "chem_beer_lambert_uvvis", name: "Beer-Lambert UV-Vis Spectrophotometry & Isosbestic Point", domains: ["chemistry"],
      engine: "wave_fourier", formula: "A(λ) = −log₁₀(I/I₀) = Σᵢ εᵢ(λ) cᵢ ℓ",
      description: "Measure multi-component absorbance spectra A(λ) across path length ℓ and identify invariant isosbestic wavelengths during interconversion.",
      params: [
        { key: "conc_m", label: "Analyte Concentration c (mM)", type: "range", min: 0.1, max: 2.5, step: 0.05, value: 0.8 },
        { key: "path_l", label: "Cuvette Path Length ℓ (cm)", type: "range", min: 0.2, max: 2.0, step: 0.1, value: 1.0 },
        { key: "conv_x", label: "Interconversion Extent ξ", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.45 },
      ],
      challenges: [
        { id: "chem_bl_1", text: "Sweep Interconversion Extent ξ and locate the invariant isosbestic wavelength where ε_A(λ) = ε_B(λ).", xp: 15 },
        { id: "chem_bl_2", text: "Drag the monochromator probe to λ_max for maximum analytical sensitivity.", xp: 15 },
        { id: "chem_bl_3", text: "Double Path Length ℓ and verify transmittance T = 10⁻ᴬ squares.", xp: 15 },
      ],
    },
    {
      id: "chem_chromatography_van_deemter", name: "Chromatographic Elution & Van Deemter Plate Height (HETP)", domains: ["chemistry"],
      engine: "wave_fourier", formula: "H = A + B/u + C·u,  R_s = (√N / 4)((α−1)/α)(k'/(1+k'))",
      description: "Optimize mobile-phase linear velocity u to minimize theoretical plate height H and resolve co-eluting Gaussian analyte peaks.",
      params: [
        { key: "flow_u", label: "Mobile Phase Velocity u (cm/s)", type: "range", min: 0.2, max: 5.0, step: 0.1, value: 1.6 },
        { key: "select_a", label: "Selectivity Factor α = k₂'/k₁'", type: "range", min: 1.02, max: 2.0, step: 0.02, value: 1.25 },
        { key: "mass_c", label: "Mass Transfer Resistance C", type: "range", min: 0.05, max: 1.0, step: 0.05, value: 0.25 },
      ],
      challenges: [
        { id: "chem_vd_1", text: "Tune Velocity u to the Van Deemter optimum u_opt = √(B/C) to maximize plate number N.", xp: 15 },
        { id: "chem_vd_2", text: "Drag the chromatogram probe to verify baseline resolution R_s ≥ 1.5.", xp: 15 },
        { id: "chem_vd_3", text: "Observe longitudinal diffusion broadening (B/u) at ultra-low flow rates.", xp: 15 },
      ],
    },
    {
      id: "chem_born_haber_lattice", name: "Born-Haber Thermochemical Cycle & Kapustinskii Lattice Energy", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "ΔH°_f = ΔH_sub + IE + ½BDE + EA + U_lattice",
      description: "Construct a closed Hess's Law enthalpy cycle for ionic crystal formation and evaluate Madelung electrostatic stabilization.",
      params: [
        { key: "charge_z", label: "Ionic Charge Product |z₊z₋|", type: "range", min: 1, max: 4, step: 1, value: 1 },
        { key: "radii_r0", label: "Interionic Distance r₊ + r₋ (Å)", type: "range", min: 1.8, max: 4.2, step: 0.05, value: 2.81 },
        { key: "ie_ea", label: "Ionization − Affinity Gap", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 0.8 },
      ],
      challenges: [
        { id: "chem_bh_1", text: "Double Ionic Charge Product |z₊z₋| (e.g. NaCl → MgO) to observe the ~4× leap in lattice energy U.", xp: 15 },
        { id: "chem_bh_2", text: "Drag the cycle step marker to inspect endothermic atomization vs exothermic crystallization.", xp: 15 },
        { id: "chem_bh_3", text: "Decrease Interionic Distance r₀ to see how small ions stabilize high oxidation states.", xp: 15 },
      ],
    },
    {
      id: "chem_phase_diagram_raoult", name: "Binary Vapor-Liquid Equilibrium, Raoult's Law & Azeotropes", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "P = x₁ γ₁ P₁* + x₂ γ₂ P₂*",
      description: "Explore P-x-y and T-x-y distillation envelopes, tie lines, fractional distillation plates, and positive/negative Margules deviations.",
      params: [
        { key: "volatility", label: "Relative Volatility α₁₂", type: "range", min: 1.1, max: 5.0, step: 0.1, value: 2.4 },
        { key: "margules", label: "Non-Ideality Parameter A₁₂", type: "range", min: -1.5, max: 2.0, step: 0.05, value: 0.0 },
        { key: "reflux", label: "Reflux Ratio R", type: "range", min: 0.5, max: 5.0, step: 0.1, value: 2.0 },
      ],
      challenges: [
        { id: "chem_vle_1", text: "Set Non-Ideality A₁₂ > 1.2 to induce a minimum-boiling positive azeotrope where x₁ = y₁.", xp: 15 },
        { id: "chem_vle_2", text: "Drag the composition cursor x₁ to read off vapor enrichment y₁ via the tie line.", xp: 15 },
        { id: "chem_vle_3", text: "Increase Relative Volatility α₁₂ to widen the vapor-liquid lens and reduce required McCabe-Thiele stages.", xp: 15 },
      ],
    },
    {
      id: "chem_crystal_field_splitting", name: "Crystal Field Splitting (Δₒ / Δₜ) & High-Spin / Low-Spin Crossover", domains: ["chemistry"],
      engine: "quantum_orbital", formula: "CFSE = (−0.4 n_{t2g} + 0.6 n_{eg}) Δₒ + m P",
      description: "Split d-orbital degeneracy under octahedral, tetrahedral, and square-planar ligand fields and compare Δₒ against spin-pairing energy P.",
      params: [
        { key: "delta_o", label: "Ligand Field Strength Δₒ", type: "range", min: 0.3, max: 3.0, step: 0.05, value: 1.2 },
        { key: "d_count", label: "d-Electron Count (d¹–d⁹)", type: "range", min: 1, max: 9, step: 1, value: 6 },
        { key: "jahn_teller", label: "Jahn-Teller Tetragonal z-Stretch", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.15 },
      ],
      challenges: [
        { id: "chem_cf_1", text: "For a d⁶ complex, increase Ligand Field Δₒ past pairing energy P to switch from paramagnetic high-spin (S=2) to diamagnetic low-spin (S=0).", xp: 15 },
        { id: "chem_cf_2", text: "Click the orbital manifold to excite a d → d optical transition and observe complementary color shift.", xp: 15 },
        { id: "chem_cf_3", text: "Tune Jahn-Teller z-Stretch for d⁹ (Cu²⁺) to lift e_g degeneracy.", xp: 15 },
      ],
    },
    {
      id: "chem_nmr_spin_coupling", name: "¹H NMR Chemical Shift δ & J-Coupling Multiplet Pascal Triangle", domains: ["chemistry"],
      engine: "wave_fourier", formula: "δ = (ν − ν_TMS)/ν₀ × 10⁶,  Intensity ∝ C(n, k)",
      description: "Simulate Free Induction Decay (FID) and Fourier-transformed NMR multiplets under diamagnetic shielding and n+1 scalar J-coupling.",
      params: [
        { key: "j_hz", label: "Vicinal Coupling ³J (Hz)", type: "range", min: 0.0, max: 18.0, step: 0.5, value: 7.0 },
        { key: "neighbors", label: "Equivalent Neighbors n", type: "range", min: 0, max: 6, step: 1, value: 3 },
        { key: "field_b0", label: "Spectrometer Field B₀ (MHz)", type: "range", min: 60, max: 800, step: 20, value: 400 },
      ],
      challenges: [
        { id: "chem_nmr_1", text: "Set Equivalent Neighbors n = 3 to produce a 1:3:3:1 quartet.", xp: 15 },
        { id: "chem_nmr_2", text: "Drag the frequency probe to verify that J (in Hz) stays invariant while Δν scales with B₀.", xp: 15 },
        { id: "chem_nmr_3", text: "Reduce Spectrometer Field B₀ to observe second-order 'roofing' distortion.", xp: 15 },
      ],
    },
    {
      id: "chem_ir_anharmonic_morse", name: "Morse Anharmonic Oscillator & Rovibrational IR Overtones", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "V(r) = Dₑ(1 − e^{−a(r−rₑ)})²,  G(v) = ωₑ(v+½) − ωₑxₑ(v+½)²",
      description: "Compare harmonic parabolic potentials against the dissociative Morse curve and inspect P/R rotational branches and overtone spacing.",
      params: [
        { key: "de_dissoc", label: "Bond Dissociation Energy Dₑ", type: "range", min: 0.3, max: 2.5, step: 0.05, value: 1.2 },
        { key: "stiff_a", label: "Morse Stiffness Width a", type: "range", min: 0.5, max: 3.0, step: 0.05, value: 1.4 },
        { key: "anharm_x", label: "Anharmonicity Constant xₑ", type: "range", min: 0.01, max: 0.15, step: 0.005, value: 0.04 },
      ],
      challenges: [
        { id: "chem_ir_1", text: "Increase Anharmonicity xₑ to see vibrational levels crowd together near the dissociation limit Dₑ.", xp: 15 },
        { id: "chem_ir_2", text: "Drag the vibrational quantum state marker to inspect zero-point energy E₀ = ½hcωₑ.", xp: 15 },
        { id: "chem_ir_3", text: "Compare reduced mass impact (C–H vs C–D isotopic substitution) on fundamental wavenumber.", xp: 15 },
      ],
    },
    {
      id: "chem_langmuir_bet_adsorption", name: "Langmuir & BET Surface Adsorption Isotherms", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "θ = K P / (1 + K P),  k_ads P (1−θ) = k_des θ",
      description: "Simulate dynamic gas-surface adsorption/desorption equilibrium on catalytic sites and transition from monolayer Langmuir to multilayer BET coverage.",
      params: [
        { key: "k_eq", label: "Adsorption Equilibrium K_ads", type: "range", min: 0.2, max: 5.0, step: 0.1, value: 1.8 },
        { key: "temp_t", label: "Surface Temperature T", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 0.7 },
        { key: "multilayer", label: "BET Multilayer Factor c", type: "range", min: 0.5, max: 3.0, step: 0.1, value: 1.0 },
      ],
      challenges: [
        { id: "chem_lb_1", text: "Drag partial pressure P to verify fractional surface coverage θ = 0.5 at P = 1/K_ads.", xp: 15 },
        { id: "chem_lb_2", text: "Raise Surface Temperature T to accelerate exothermic desorption and lower θ.", xp: 15 },
        { id: "chem_lb_3", text: "Increase Multilayer Factor c to observe Type II BET condensation.", xp: 15 },
      ],
    },
    {
      id: "chem_debye_huckel_ionic", name: "Debye-Hückel Ionic Atmosphere & Activity Coefficients γ±", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "log γ_± = −A |z₊z₋| √I / (1 + B a₀ √I),  I = ½ Σ cᵢ zᵢ²",
      description: "Compute electrostatic screening length κ⁻¹ and mean ionic activity coefficients γ± as electrolyte ionic strength I increases.",
      params: [
        { key: "ionic_i", label: "Ionic Strength I (mol/L)", type: "range", min: 0.001, max: 1.0, step: 0.01, value: 0.1 },
        { key: "valency", label: "Charge Product |z₊z₋|", type: "range", min: 1, max: 6, step: 1, value: 2 },
        { key: "ion_size", label: "Hydrated Ion Radius a₀ (Å)", type: "range", min: 2.0, max: 9.0, step: 0.5, value: 4.5 },
      ],
      challenges: [
        { id: "chem_dh_1", text: "Increase Charge Product |z₊z₋| to observe dramatic Debye screening and reduced γ±.", xp: 15 },
        { id: "chem_dh_2", text: "Drag the ionic strength marker to compare limiting Debye-Hückel vs Davies extended regions.", xp: 15 },
        { id: "chem_dh_3", text: "Verify how high ionic strength increases sparingly soluble salt solubility ('salting-in').", xp: 15 },
      ],
    },
    {
      id: "chem_polymer_flory_huggins", name: "Polymer Chain Conformation, Radius of Gyration & Flory-Huggins χ", domains: ["chemistry"],
      engine: "quantum_orbital", formula: "⟨R_g²⟩ ∝ N^{2ν},  ΔG_m/RT = (φ₁/N₁)ln φ₁ + φ₂ ln φ₂ + χ φ₁ φ₂",
      description: "Simulate self-avoiding polymer chains in good, theta (ν=0.5), and poor solvents (coil-to-globule collapse) alongside Flory-Huggins mixing.",
      params: [
        { key: "chi_param", label: "Flory Interaction χ", type: "range", min: 0.0, max: 1.5, step: 0.02, value: 0.45 },
        { key: "deg_n", label: "Degree of Polymerization N", type: "range", min: 10, max: 200, step: 5, value: 80 },
        { key: "kuhn_b", label: "Kuhn Segment Stiffness b", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 0.9 },
      ],
      challenges: [
        { id: "chem_pf_1", text: "Raise Flory χ past 0.5 (the Θ-point) to trigger coil-to-globule collapse and phase demixing.", xp: 15 },
        { id: "chem_pf_2", text: "Click the polymer conformation canvas to resample end-to-end chain vectors.", xp: 15 },
        { id: "chem_pf_3", text: "Verify how large Degree of Polymerization N suppresses combinatorial mixing entropy.", xp: 15 },
      ],
    },
    {
      id: "chem_cyclic_voltammetry_randles", name: "Cyclic Voltammetry Duck Curve & Randles-Ševčík Diffusion", domains: ["chemistry"],
      engine: "phase_attractor", formula: "i_p = 0.4463 n F A C (nFvD / RT)^{1/2},  ΔE_p ≈ 59/n mV",
      xLabel: "Applied Potential E (V)", yLabel: "Faradaic Current i (µA)",
      description: "Sweep electrode potential triangularly across E⁰' and analyze anodic/cathodic diffusion peaks and electron-transfer reversibility.",
      params: [
        { key: "scan_v", label: "Scan Rate v (V/s)", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 0.5 },
        { key: "k0_het", label: "Heterogeneous Rate k⁰ (cm/s)", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 1.2 },
        { key: "diff_d", label: "Analyte Diffusivity D", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 1.0 },
      ],
      challenges: [
        { id: "chem_cv_1", text: "Quadruple Scan Rate v and verify peak current i_p doubles (i_p ∝ v^{1/2}).", xp: 15 },
        { id: "chem_cv_2", text: "Click the voltammogram to inject a fresh diffusion-layer concentration pulse.", xp: 15 },
        { id: "chem_cv_3", text: "Lower Heterogeneous Rate k⁰ to observe quasi-reversible peak separation ΔE_p > 59 mV.", xp: 15 },
      ],
    },
    {
      id: "chem_huckel_aromatic_pi", name: "Hückel π-Molecular Orbitals, Frost Circles & 4n+2 Aromaticity", domains: ["chemistry"],
      engine: "quantum_orbital", formula: "E_k = α + 2β cos(2πk / N),  k = 0, ±1, ...",
      description: "Inscribe cyclic polyenes C_N H_N inside a Frost circle to compute delocalization energy and compare aromatic (4n+2) vs antiaromatic (4n) rings.",
      params: [
        { key: "ring_n", label: "Ring Size N (Carbons)", type: "range", min: 3, max: 10, step: 1, value: 6 },
        { key: "beta_res", label: "Resonance Integral |β| (eV)", type: "range", min: 0.5, max: 3.5, step: 0.1, value: 2.4 },
        { key: "altern", label: "Bond Alternation δ_Peierls", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.1 },
      ],
      challenges: [
        { id: "chem_hk_1", text: "Compare N = 6 (benzene, closed shell 4n+2) against N = 4 (cyclobutadiene, diradical non-bonding pair).", xp: 15 },
        { id: "chem_hk_2", text: "Click the Frost circle to inspect π nodal planes of the HOMO and LUMO.", xp: 15 },
        { id: "chem_hk_3", text: "Increase Bond Alternation δ for N = 4 or 8 to observe Jahn-Teller/Peierls gap opening.", xp: 15 },
      ],
    },
    {
      id: "chem_SN1_SN2_stereochem", name: "Nucleophilic Substitution (S_N2 Walden Inversion vs S_N1 Racemization)", domains: ["chemistry"],
      engine: "kinetics_thermodynamics", formula: "r = k₂[R-X][Nu⁻] + k₁[R-X]",
      description: "Compare concerted backside S_N2 attack (100% inversion) against carbocation-intermediate S_N1 solvolysis across substrate steric hindrance and solvent polarity.",
      params: [
        { key: "steric", label: "Substrate Substitution (1°→3°)", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.25 },
        { key: "nuc_conc", label: "Nucleophile Strength [Nu⁻]", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 1.2 },
        { key: "protic", label: "Solvent Polarity / Ionizing Power Y", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 0.6 },
      ],
      challenges: [
        { id: "chem_sn_1", text: "Set primary substrate (low steric) + strong [Nu⁻] to favor concerted S_N2 Walden inversion.", xp: 15 },
        { id: "chem_sn_2", text: "Drag the reaction coordinate to compare a single S_N2 barrier vs the two-step S_N1 carbocation well.", xp: 15 },
        { id: "chem_sn_3", text: "Shift to tertiary substrate + high Ionizing Power Y to observe first-order S_N1 kinetics.", xp: 15 },
      ],
    },

    // =========================================================================
    // 4. ARTIFICIAL INTELLIGENCE (20 simulations)
    // =========================================================================
    {
      id: "ai_sparse_autoencoder", name: "Sparse Autoencoder (SAE) Monosemantic Feature Disentanglement", domains: ["ai"],
      engine: "neural_manifold", formula: "L(x) = ‖x − W_dec f(x)‖₂² + λ ‖f(x)‖₁,  f(x) = ReLU(W_enc x + b)",
      description: "Decompose polysemantic residual-stream activations in superposition into an overcomplete dictionary of monosemantic sparse features.",
      params: [
        { key: "l1_lambda", label: "L₁ Sparsity Penalty λ", type: "range", min: 0.01, max: 1.0, step: 0.02, value: 0.22 },
        { key: "dict_ratio", label: "Dictionary Expansion M / d", type: "range", min: 1.0, max: 16.0, step: 0.5, value: 8.0 },
        { key: "feature_corr", label: "Feature Co-Occurrence ρ", type: "range", min: 0.0, max: 0.8, step: 0.02, value: 0.12 },
      ],
      challenges: [
        { id: "ai_sae_1", text: "Tune L₁ Sparsity λ to balance L₀ active feature count against reconstruction MSE.", xp: 15 },
        { id: "ai_sae_2", text: "Click the activation manifold to probe which dictionary atoms fire for a given input.", xp: 15 },
        { id: "ai_sae_3", text: "Observe dead-neuron collapse when L₁ Sparsity λ is pushed too high.", xp: 15 },
      ],
    },
    {
      id: "ai_diffusion_score_matching", name: "Denoising Diffusion & Reverse SDE Score Vector Field ∇ₓ log pₜ(x)", domains: ["ai"],
      engine: "phase_attractor", formula: "dx = [f(x,t) − g(t)² ∇ₓ log pₜ(x)] dt + g(t) dW̄ₜ",
      xLabel: "Latent Dimension z₁", yLabel: "Latent Dimension z₂",
      description: "Integrate the reverse-time Langevin/probability-flow ODE along the learned score field ∇ₓ log pₜ(x) from Gaussian noise to the data manifold.",
      params: [
        { key: "cfg_scale", label: "Classifier-Free Guidance w", type: "range", min: 1.0, max: 12.0, step: 0.5, value: 4.5 },
        { key: "sigma_t", label: "Noise Schedule σ(t)", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 0.6 },
        { key: "step_eta", label: "DDIM Stochasticity η", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "ai_df_1", text: "Set DDIM Stochasticity η = 0 to trace deterministic probability-flow ODE trajectories.", xp: 15 },
        { id: "ai_df_2", text: "Click anywhere in Gaussian noise space to watch the score field guide the sample to a mode.", xp: 15 },
        { id: "ai_df_3", text: "Raise Guidance Scale w > 8 to observe mode-seeking saturation vs diversity loss.", xp: 15 },
      ],
    },
    {
      id: "ai_lora_low_rank_adapter", name: "LoRA Low-Rank Weight Adaptation (W₀ + B·A)", domains: ["ai"],
      engine: "neural_manifold", formula: "h = W₀ x + (α / r) B A x,  A ∈ ℝ^{r×d}, B ∈ ℝ^{k×r}",
      description: "Inspect intrinsic dimensionality of parameter-efficient fine-tuning as rank r and scaling α update a frozen pretrained weight matrix W₀.",
      params: [
        { key: "rank_r", label: "LoRA Rank r", type: "range", min: 1, max: 64, step: 1, value: 16 },
        { key: "alpha_scale", label: "Scaling Factor α / r", type: "range", min: 0.2, max: 4.0, step: 0.1, value: 2.0 },
        { key: "wd_reg", label: "Orthogonal Regularization", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.1 },
      ],
      challenges: [
        { id: "ai_lr_1", text: "Reduce LoRA Rank r to 4 and observe how much task loss is recovered with <1% trainable parameters.", xp: 15 },
        { id: "ai_lr_2", text: "Click the subspace landscape to initialize adapter gradient descent.", xp: 15 },
        { id: "ai_lr_3", text: "Tune Scaling α / r to prevent catastrophic forgetting of base capabilities.", xp: 15 },
      ],
    },
    {
      id: "ai_rlhf_dpo_kl_frontier", name: "RLHF / DPO Alignment & KL-Divergence Reward Over-Optimization", domains: ["ai"],
      engine: "kinetics_thermodynamics", formula: "max_π 𝔼[r(x,y)] − β D_KL(π_θ(y|x) ‖ π_ref(y|x))",
      description: "Trace Goodhart's Law on the proxy-reward vs true-gold-reward frontier as KL penalty β varies during policy alignment.",
      params: [
        { key: "kl_beta", label: "KL Regularization Penalty β", type: "range", min: 0.01, max: 1.0, step: 0.02, value: 0.15 },
        { key: "rm_noise", label: "Reward Model Misspecification ε", type: "range", min: 0.05, max: 1.0, step: 0.05, value: 0.25 },
        { key: "margin", label: "Preference Margin γ", type: "range", min: 0.1, max: 2.5, step: 0.1, value: 1.0 },
      ],
      challenges: [
        { id: "ai_dpo_1", text: "Lower KL Penalty β toward 0.01 to trigger reward hacking where proxy reward rises while gold reward drops.", xp: 15 },
        { id: "ai_dpo_2", text: "Drag the KL divergence operating point √D_KL to the Pareto-optimal alignment sweet spot.", xp: 15 },
        { id: "ai_dpo_3", text: "Increase Reward Model Misspecification ε to see earlier onset of over-optimization.", xp: 15 },
      ],
    },
    {
      id: "ai_rope_positional_encoding", name: "Rotary Position Embedding (RoPE) & Context Window Extrapolation", domains: ["ai"],
      engine: "wave_fourier", formula: "R_{Θ,m} q = q ⊙ cos(mΘ) + q̃ ⊙ sin(mΘ),  θᵢ = b^{−2i/d}",
      description: "Rotate query/key complex pairs across token offset Δm = m − n and compare NTK-aware base scaling and YaRN wavelength interpolation.",
      params: [
        { key: "rope_base", label: "RoPE Base Frequency log₁₀(b)", type: "range", min: 3.0, max: 6.5, step: 0.1, value: 4.0 },
        { key: "ctx_scale", label: "NTK Context Scale Factor s", type: "range", min: 1.0, max: 8.0, step: 0.2, value: 2.0 },
        { key: "dim_bands", label: "Active Frequency Subspaces", type: "range", min: 2, max: 12, step: 1, value: 6 },
      ],
      challenges: [
        { id: "ai_rp_1", text: "Increase RoPE Base log₁₀(b) from 4.0 (10k) to 5.7 (500k) to extend long-context attention decay.", xp: 15 },
        { id: "ai_rp_2", text: "Drag the relative token distance probe Δm to inspect high- vs low-frequency head inner products.", xp: 15 },
        { id: "ai_rp_3", text: "Tune NTK Scale Factor s to eliminate out-of-distribution phase wrapping.", xp: 15 },
      ],
    },
    {
      id: "ai_moe_router_load", name: "Mixture-of-Experts (MoE) Top-k Router & Load Balancing", domains: ["ai"],
      engine: "network_graph", formula: "y = Σ_{i ∈ TopK(g(x))} gᵢ(x) Eᵢ(x),  L_aux = α N Σ fᵢ Pᵢ",
      description: "Route token batches across N specialized feed-forward experts and prevent expert collapse using auxiliary load-balancing loss and capacity factors.",
      params: [
        { key: "top_k", label: "Active Experts per Token k", type: "range", min: 1, max: 4, step: 1, value: 2 },
        { key: "aux_alpha", label: "Load Balance Coefficient α", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.2 },
        { key: "cap_factor", label: "Expert Capacity Factor C", type: "range", min: 0.5, max: 2.5, step: 0.1, value: 1.25 },
      ],
      challenges: [
        { id: "ai_moe_1", text: "Set Load Balance α = 0 to observe routing collapse onto a single dominant expert.", xp: 15 },
        { id: "ai_moe_2", text: "Click an expert node to inject a domain-shifted token burst and observe overflow dropping.", xp: 15 },
        { id: "ai_moe_3", text: "Tune Capacity Factor C and α to achieve uniform expert utilization.", xp: 15 },
      ],
    },
    {
      id: "ai_kv_cache_flash_attn", name: "KV-Cache Roofline, GQA Compression & FlashAttention Tiling", domains: ["ai"],
      engine: "systems_hardware", formula: "OI = FLOPs / Bytes_HBM,  KV_Bytes = 2 · b · s · L · h_kv · d_h",
      description: "Simulate SRAM tile fusion in FlashAttention and Grouped-Query Attention (GQA) to overcome HBM memory-bandwidth bottlenecks during LLM decoding.",
      params: [
        { key: "gqa_groups", label: "GQA Query-to-KV Ratio", type: "range", min: 1, max: 8, step: 1, value: 4 },
        { key: "tile_size", label: "SRAM Block Tile Size B_r", type: "range", min: 16, max: 128, step: 16, value: 64 },
        { key: "seq_len", label: "Context Length (kTokens)", type: "range", min: 1, max: 64, step: 1, value: 16 },
      ],
      challenges: [
        { id: "ai_kv_1", text: "Increase GQA Ratio from 1 (MHA) to 8 (MQA-like) to slash KV-cache memory footprint.", xp: 15 },
        { id: "ai_kv_2", text: "Click an SRAM tile block to inspect online softmax rescaling without materializing N×N matrices.", xp: 15 },
        { id: "ai_kv_3", text: "Sweep Context Length to watch decode shift from compute-bound to memory-bandwidth-bound.", xp: 15 },
      ],
    },
    {
      id: "ai_gnn_message_passing", name: "Graph Neural Network (GNN) Message Passing & Over-Smoothing", domains: ["ai"],
      engine: "network_graph", formula: "H^{(l+1)} = σ( D̃^{−1/2} Ã D̃^{−1/2} H^{(l)} W^{(l)} )",
      description: "Propagate node embeddings across k-hop neighborhood aggregations and observe Dirichlet energy collapse (over-smoothing) at deep layers.",
      params: [
        { key: "layers_l", label: "GNN Propagation Depth L", type: "range", min: 1, max: 10, step: 1, value: 3 },
        { key: "res_alpha", label: "Residual / Jumping Knowledge α", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.25 },
        { key: "drop_edge", label: "DropEdge Regularization p", type: "range", min: 0.0, max: 0.7, step: 0.05, value: 0.15 },
      ],
      challenges: [
        { id: "ai_gnn_1", text: "Push Depth L ≥ 8 with Residual α = 0 to observe over-smoothing where all node features converge.", xp: 15 },
        { id: "ai_gnn_2", text: "Click a node to visualize its receptive-field message wave across k hops.", xp: 15 },
        { id: "ai_gnn_3", text: "Increase Residual α > 0.3 to preserve high-frequency local node distinctions.", xp: 15 },
      ],
    },
    {
      id: "ai_contrastive_infonce", name: "Contrastive InfoNCE Loss & Hyperspherical Embedding Uniformity", domains: ["ai"],
      engine: "quantum_orbital", formula: "L = −log [ exp(uᵀv₊/τ) / Σⱼ exp(uᵀvⱼ/τ) ]",
      description: "Align positive pairs while repelling negative samples on the unit hypersphere S^{d-1}, controlled by softmax temperature τ.",
      params: [
        { key: "temp_tau", label: "Softmax Temperature τ", type: "range", min: 0.02, max: 1.0, step: 0.02, value: 0.07 },
        { key: "neg_k", label: "Hard Negative Weighting β", type: "range", min: 0.1, max: 3.0, step: 0.1, value: 1.0 },
        { key: "align_w", label: "Alignment vs Uniformity λ", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "ai_cl_1", text: "Lower Temperature τ toward 0.05 to concentrate gradients on the hardest negative pairs.", xp: 15 },
        { id: "ai_cl_2", text: "Click the unit hypersphere to inject an anchor embedding and view its cosine similarity cone.", xp: 15 },
        { id: "ai_cl_3", text: "Balance Alignment and Uniformity λ to avoid dimensional representation collapse.", xp: 15 },
      ],
    },
    {
      id: "ai_vae_elbo_kl", name: "Variational Autoencoder (β-VAE) ELBO & Posterior Collapse", domains: ["ai"],
      engine: "neural_manifold", formula: "ELBO = 𝔼_{q(z|x)}[log p(x|z)] − β D_KL(q(z|x) ‖ p(z))",
      description: "Balance reconstruction fidelity against Gaussian prior regularization via the reparameterization trick z = μ + σ ⊙ ε.",
      params: [
        { key: "beta_kl", label: "β-VAE Weight β", type: "range", min: 0.05, max: 5.0, step: 0.1, value: 1.0 },
        { key: "sigma_post", label: "Posterior Variance σ²(x)", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 0.5 },
        { key: "cap_c", label: "Information Capacity Target C", type: "range", min: 0.0, max: 2.0, step: 0.1, value: 0.4 },
      ],
      challenges: [
        { id: "ai_vae_1", text: "Raise β > 3.0 to observe disentangled axis alignment vs posterior collapse (q(z|x) → N(0,I)).", xp: 15 },
        { id: "ai_vae_2", text: "Click the 2D latent space to decode and interpolate between latent prototypes.", xp: 15 },
        { id: "ai_vae_3", text: "Set β → 0.05 to see holes open in the aggregate posterior q(z).", xp: 15 },
      ],
    },
    {
      id: "ai_mcts_alphazero_puct", name: "AlphaZero Monte Carlo Tree Search (MCTS) & PUCT Exploration", domains: ["ai"],
      engine: "network_graph", formula: "a* = argmax_a [ Q(s,a) + c_puct P(s,a) √(Σ_b N(s,b)) / (1 + N(s,a)) ]",
      description: "Balance policy-prior exploitation Q(s,a) against visit-count curiosity in game-tree rollouts with Dirichlet root noise.",
      params: [
        { key: "c_puct", label: "Exploration Constant c_puct", type: "range", min: 0.2, max: 5.0, step: 0.1, value: 1.5 },
        { key: "dirichlet", label: "Root Dirichlet Noise ε", type: "range", min: 0.0, max: 0.8, step: 0.05, value: 0.25 },
        { key: "rollouts", label: "Simulation Rollout Rate", type: "range", min: 0.5, max: 3.0, step: 0.1, value: 1.5 },
      ],
      challenges: [
        { id: "ai_mcts_1", text: "Increase c_puct to widen search across low-visit branches with non-zero policy prior P(s,a).", xp: 15 },
        { id: "ai_mcts_2", text: "Click a tree node to inject a high value backup V(s) and watch parent Q-values update.", xp: 15 },
        { id: "ai_mcts_3", text: "Adjust Dirichlet Noise ε to prevent early deterministic lock-in at the root.", xp: 15 },
      ],
    },
    {
      id: "ai_ppo_trust_region_clip", name: "Proximal Policy Optimization (PPO) Clipped Surrogate Objective", domains: ["ai"],
      engine: "kinetics_thermodynamics", formula: "L^{CLIP}(θ) = 𝔼[ min(rₜ(θ) Âₜ, clip(rₜ(θ), 1−ε, 1+ε) Âₜ) ]",
      description: "Visualize probability ratio r(θ) = π_θ(a|s)/π_old(a|s) clipping for positive and negative Generalized Advantage Estimates (GAE).",
      params: [
        { key: "clip_eps", label: "PPO Clipping Ratio ε", type: "range", min: 0.05, max: 0.5, step: 0.02, value: 0.2 },
        { key: "gae_lam", label: "GAE Bias-Variance λ", type: "range", min: 0.5, max: 1.0, step: 0.02, value: 0.95 },
        { key: "ent_coef", label: "Entropy Bonus c₂", type: "range", min: 0.0, max: 0.2, step: 0.01, value: 0.02 },
      ],
      challenges: [
        { id: "ai_ppo_1", text: "Drag the policy ratio r(θ) past 1 + ε to observe the flat zero-gradient ceiling.", xp: 15 },
        { id: "ai_ppo_2", text: "Tune GAE λ between TD(0) (λ=0.5, low variance) and Monte Carlo (λ=1.0, zero bias).", xp: 15 },
        { id: "ai_ppo_3", text: "Increase Entropy Bonus c₂ to prevent premature policy collapse.", xp: 15 },
      ],
    },
    {
      id: "ai_grokking_phase_transition", name: "Grokking & Weight-Decay Representation Phase Transition", domains: ["ai"],
      engine: "kinetics_thermodynamics", formula: "θₜ₊₁ = (1 − ηλ)θₜ − η ∇L_train(θₜ)",
      description: "Track training vs validation accuracy across log-steps to observe sudden generalization ('grokking') long after 100% training memorization.",
      params: [
        { key: "wd_lambda", label: "Weight Decay λ", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.8 },
        { key: "data_frac", label: "Training Data Fraction α", type: "range", min: 0.1, max: 0.9, step: 0.05, value: 0.45 },
        { key: "lr_eta", label: "Learning Rate η", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 1.0 },
      ],
      challenges: [
        { id: "ai_grk_1", text: "Increase Weight Decay λ to accelerate the transition from lookup memorization to Fourier circuit generalization.", xp: 15 },
        { id: "ai_grk_2", text: "Drag the training epoch marker across the grokking cliff where validation loss plummets.", xp: 15 },
        { id: "ai_grk_3", text: "Lower Training Fraction α below 0.25 and observe how grokking delay scales.", xp: 15 },
      ],
    },
    {
      id: "ai_gaussian_process_bo", name: "Gaussian Process Regression & Bayesian Optimization (UCB / EI)", domains: ["ai"],
      engine: "wave_fourier", formula: "f(x) ~ GP(m(x), k(x,x')),  α_UCB(x) = μ(x) + κ σ(x)",
      description: "Condition an RBF-kernel Gaussian Process on noisy observations and select the next query point maximizing Upper Confidence Bound (UCB).",
      params: [
        { key: "lengthscale", label: "RBF Kernel Lengthscale ℓ", type: "range", min: 0.2, max: 3.0, step: 0.05, value: 1.0 },
        { key: "kappa_ucb", label: "Exploration Weight κ", type: "range", min: 0.1, max: 4.0, step: 0.1, value: 1.96 },
        { key: "obs_noise", label: "Observation Noise σ_n", type: "range", min: 0.0, max: 0.8, step: 0.02, value: 0.1 },
      ],
      challenges: [
        { id: "ai_gp_1", text: "Increase Lengthscale ℓ to smooth the posterior mean μ(x) and widen epistemic correlation.", xp: 15 },
        { id: "ai_gp_2", text: "Drag the query probe to a high-uncertainty region to observe posterior variance collapse.", xp: 15 },
        { id: "ai_gp_3", text: "Raise Exploration Weight κ to prioritize high-variance unexplored regions over the current maximum.", xp: 15 },
      ],
    },
    {
      id: "ai_speculative_decoding_draft", name: "Speculative Decoding & Draft-Target Rejection Sampling", domains: ["ai"],
      engine: "kinetics_thermodynamics", formula: "P(accept) = min(1, p_target(x) / q_draft(x)),  E[tokens] = (1 − α^{γ+1})/(1 − α)",
      description: "Verify exact target-distribution preservation when a fast draft model proposes γ speculative tokens verified in parallel by a large target LLM.",
      params: [
        { key: "accept_alpha", label: "Draft Alignment Rate α", type: "range", min: 0.2, max: 0.95, step: 0.02, value: 0.78 },
        { key: "draft_gamma", label: "Speculative Lookahead γ", type: "range", min: 1, max: 12, step: 1, value: 5 },
        { key: "cost_ratio", label: "Draft-to-Target Latency Ratio c", type: "range", min: 0.02, max: 0.4, step: 0.02, value: 0.1 },
      ],
      challenges: [
        { id: "ai_sd_1", text: "Tune Speculative Lookahead γ to maximize wall-clock speedup for your Draft Cost Ratio c.", xp: 15 },
        { id: "ai_sd_2", text: "Drag the token acceptance probe to inspect residual distribution resampling (p − q)₊.", xp: 15 },
        { id: "ai_sd_3", text: "Observe why overly large γ hurts speedup when Draft Latency c is non-negligible.", xp: 15 },
      ],
    },
    {
      id: "ai_adamw_momentum_geometry", name: "AdamW Adaptive Preconditioning vs SGD Momentum Ravines", domains: ["ai"],
      engine: "neural_manifold", formula: "mₜ = β₁mₜ₋₁+(1−β₁)gₜ,  vₜ = β₂vₜ₋₁+(1−β₂)gₜ²,  θₜ₊₁ = (1−ηλ)θₜ − η m̂ₜ/(√v̂ₜ+ϵ)",
      description: "Compare diagonal RMSprop/Adam curvature normalization against raw SGD oscillations across ill-conditioned Rosenbrock ravines.",
      params: [
        { key: "beta1", label: "First Moment Momentum β₁", type: "range", min: 0.1, max: 0.99, step: 0.02, value: 0.9 },
        { key: "beta2", label: "Second Moment RMS β₂", type: "range", min: 0.5, max: 0.999, step: 0.01, value: 0.98 },
        { key: "wd_dec", label: "Decoupled Weight Decay λ", type: "range", min: 0.0, max: 0.5, step: 0.02, value: 0.05 },
      ],
      challenges: [
        { id: "ai_aw_1", text: "Adjust Second Moment β₂ to dampen vertical wall oscillations in steep ravines.", xp: 15 },
        { id: "ai_aw_2", text: "Click the loss surface to launch an optimizer trajectory from a high-curvature ridge.", xp: 15 },
        { id: "ai_aw_3", text: "Compare decoupled AdamW weight decay λ against coupled L₂ regularization.", xp: 15 },
      ],
    },
    {
      id: "ai_double_descent_overparam", name: "Belkin Double Descent & Interpolation Threshold (N = P)", domains: ["ai"],
      engine: "kinetics_thermodynamics", formula: "R_test(P/N) peaks at P ≈ N, then decays via min-norm inductive bias",
      description: "Plot test risk across model capacity P/N from the classical bias-variance U-curve through the interpolation peak into the modern overparameterized regime.",
      params: [
        { key: "cap_ratio", label: "Overparameterization P / N", type: "range", min: 0.1, max: 4.0, step: 0.05, value: 1.0 },
        { key: "label_noise", label: "Label Noise σ_ε", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.35 },
        { key: "ridge_reg", label: "Ridge L₂ Regularization λ", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.02 },
      ],
      challenges: [
        { id: "ai_dd_1", text: "Set P / N = 1.0 with high Label Noise σ_ε to observe the sharp interpolation test-risk spike.", xp: 15 },
        { id: "ai_dd_2", text: "Drag the capacity probe past P / N > 2.5 to verify benign overfitting via minimum-norm solutions.", xp: 15 },
        { id: "ai_dd_3", text: "Increase Ridge Regularization λ to suppress the interpolation peak.", xp: 15 },
      ],
    },
    {
      id: "ai_SSM_mamba_selective", name: "Selective State-Space Models (Mamba / S4) & HiPPO Discretization", domains: ["ai"],
      engine: "phase_attractor", formula: "hₜ = Ā(xₜ) hₜ₋₁ + B̄(xₜ) xₜ,  Ā = exp(Δ(xₜ) A)",
      xLabel: "Hidden State Re(h₁)", yLabel: "Hidden State Im(h₁)",
      description: "Discretize continuous HiPPO state matrices via input-dependent step size Δ(xₜ) to selectively remember long-range tokens or reset on noise.",
      params: [
        { key: "delta_dt", label: "Selective Step Size Δ(xₜ)", type: "range", min: 0.02, max: 1.5, step: 0.02, value: 0.35 },
        { key: "hippo_n", label: "HiPPO Polynomial Order N", type: "range", min: 2, max: 16, step: 1, value: 8 },
        { key: "decay_a", label: "State Decay Eigenvalue |Re(λ)|", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "ai_ssm_1", text: "Shrink Step Size Δ(xₜ) → 0.05 to freeze hidden state memory across irrelevant filler tokens.", xp: 15 },
        { id: "ai_ssm_2", text: "Click the state plane to inject a salient token impulse and watch polynomial projection.", xp: 15 },
        { id: "ai_ssm_3", text: "Enlarge Δ(xₜ) to flush old state history and focus on the current token.", xp: 15 },
      ],
    },
    {
      id: "ai_quantization_int4_awq", name: "LLM Weight Quantization (FP16 → INT4), Outliers & AWQ Scaling", domains: ["ai"],
      engine: "systems_hardware", formula: "W_q = round(W · s / Δ) · (Δ / s),  s = (𝔼|X|)^α",
      description: "Quantize weight matrices into 4-bit integer grids and protect salient activation-outlier channels via Activation-Aware Weight Quantization (AWQ).",
      params: [
        { key: "bits", label: "Quantization Bit-Width b", type: "range", min: 2, max: 8, step: 1, value: 4 },
        { key: "awq_scale", label: "Salient Channel Protection α", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.5 },
        { key: "outlier", label: "Activation Outlier Magnitude", type: "range", min: 0.1, max: 3.0, step: 0.1, value: 1.4 },
      ],
      challenges: [
        { id: "ai_qt_1", text: "Drop Bit-Width b to 3 or 4 and observe quantization grid clamping vs perplexity impact.", xp: 15 },
        { id: "ai_qt_2", text: "Click a weight block in the hardware matrix to inject an activation outlier.", xp: 15 },
        { id: "ai_qt_3", text: "Tune Salient Channel Protection α ≈ 0.5 to minimize output MSE.", xp: 15 },
      ],
    },
    {
      id: "ai_mechanistic_induction_heads", name: "Mechanistic Interpretability: Induction Heads ([A][B] ... [A] → [B])", domains: ["ai"],
      engine: "neural_manifold", formula: "OV_circuit = W_U W_O^{(2)} W_V^{(2)},  QK_circuit = W_Q^{(2)T} W_K^{(2)} W_{OV}^{(1)}",
      description: "Inspect two-layer composition between a previous-token head in Layer 1 and a prefix-matching induction head in Layer 2 driving in-context learning.",
      params: [
        { key: "qk_strength", label: "K-Composition Strength β_QK", type: "range", min: 0.1, max: 3.0, step: 0.1, value: 1.6 },
        { key: "ov_copy", label: "OV Copying Eigenvalue λ_OV", type: "range", min: 0.1, max: 2.5, step: 0.1, value: 1.4 },
        { key: "attn_temp", label: "Attention Sharpness 1/√d_k", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 0.8 },
      ],
      challenges: [
        { id: "ai_ih_1", text: "Increase K-Composition β_QK to sharpen the off-diagonal induction stripe in the attention matrix.", xp: 15 },
        { id: "ai_ih_2", text: "Click the loss/attention manifold to perform activation patching on the Layer-1 head.", xp: 15 },
        { id: "ai_ih_3", text: "Verify positive OV eigenvalues (λ_OV > 1) required for token-copying logits.", xp: 15 },
      ],
    },

    // =========================================================================
    // 5. ROBOTICS (20 simulations)
    // =========================================================================
    {
      id: "rob_drone_swarm_cbf", name: "Quadrotor Swarm & Control Barrier Functions (CBF-QP Safety)", domains: ["robotics"],
      engine: "phase_attractor", formula: "min_u ‖u − u_nom‖²  s.t.  L_f h(x) + L_g h(x) u ≥ −α(h(x))",
      xLabel: "Swarm X (m)", yLabel: "Swarm Y (m)",
      description: "Filter nominal trajectory tracking controllers through a real-time Control Barrier Function Quadratic Program to guarantee collision-free forward invariance h(x) ≥ 0.",
      params: [
        { key: "cbf_alpha", label: "Barrier Class-K Gain α", type: "range", min: 0.2, max: 5.0, step: 0.1, value: 1.5 },
        { key: "safe_r", label: "Safety Radius r_safe (m)", type: "range", min: 0.3, max: 2.0, step: 0.05, value: 0.85 },
        { key: "aggr_kp", label: "Nominal Tracking Gain K_p", type: "range", min: 0.5, max: 4.0, step: 0.1, value: 1.8 },
      ],
      challenges: [
        { id: "rob_cbf_1", text: "Lower Barrier Gain α to make the drone decelerate earlier as it approaches the safety boundary h(x)=0.", xp: 15 },
        { id: "rob_cbf_2", text: "Click the workspace to spawn a dynamic agent trajectory and verify zero safety violations.", xp: 15 },
        { id: "rob_cbf_3", text: "Balance Safety Radius r_safe and Nominal Gain K_p to avoid deadlock.", xp: 15 },
      ],
    },
    {
      id: "rob_mpc_receding_horizon", name: "Model Predictive Control (MPC) Receding Horizon Trajectory", domains: ["robotics"],
      engine: "phase_attractor", formula: "min_{u_{0:N-1}} Σ (xₖᵀ Q xₖ + uₖᵀ R uₖ) + x_Nᵀ P x_N",
      xLabel: "Position Error e_x", yLabel: "Velocity Error e_v",
      description: "Solve a constrained finite-horizon optimal control problem at every timestep under actuator saturation |u| ≤ u_max.",
      params: [
        { key: "horizon_n", label: "Prediction Horizon N", type: "range", min: 3, max: 25, step: 1, value: 12 },
        { key: "r_weight", label: "Control Effort Penalty R", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 0.35 },
        { key: "u_max", label: "Actuator Saturation Limit u_max", type: "range", min: 0.3, max: 2.5, step: 0.05, value: 1.2 },
      ],
      challenges: [
        { id: "rob_mpc_1", text: "Extend Prediction Horizon N ≥ 15 to prevent short-sighted overshoot under tight u_max saturation.", xp: 15 },
        { id: "rob_mpc_2", text: "Click the state plane to apply an external disturbance impulse and watch MPC replan.", xp: 15 },
        { id: "rob_mpc_3", text: "Tune Control Effort Penalty R to trade settling speed against actuator energy.", xp: 15 },
      ],
    },
    {
      id: "rob_ekf_slam_loop_closure", name: "EKF / Factor-Graph SLAM & Loop-Closure Covariance Collapse", domains: ["robotics"],
      engine: "network_graph", formula: "P₊ = (I − K H) P₋,  K = P₋ Hᵀ (H P₋ Hᵀ + R)⁻¹",
      description: "Build a pose-landmark factor graph under odometry drift and trigger loop-closure observations to collapse uncertainty ellipses across the trajectory.",
      params: [
        { key: "odom_q", label: "Odometry Process Noise σ_q", type: "range", min: 0.05, max: 1.5, step: 0.05, value: 0.45 },
        { key: "meas_r", label: "Range-Bearing Sensor Noise σ_r", type: "range", min: 0.05, max: 1.5, step: 0.05, value: 0.25 },
        { key: "loop_w", label: "Loop Closure Information Gain", type: "range", min: 0.2, max: 3.0, step: 0.1, value: 1.6 },
      ],
      challenges: [
        { id: "rob_slm_1", text: "Increase Loop Closure Gain to watch covariance trace Tr(P) collapse across all past poses.", xp: 15 },
        { id: "rob_slm_2", text: "Click a landmark node to trigger a high-precision range-bearing update.", xp: 15 },
        { id: "rob_slm_3", text: "Compare dead-reckoning drift (high σ_q) vs sensor-dominated updates (low σ_r).", xp: 15 },
      ],
    },
    {
      id: "rob_biped_zmp_lipm", name: "Bipedal Walking: Linear Inverted Pendulum (LIPM) & Zero-Moment Point", domains: ["robotics"],
      engine: "phase_attractor", formula: "ẍ_com = (g / z_c)(x_com − p_zmp),  ξ = x_com + ẋ_com / ω₀",
      xLabel: "CoM Position x (m)", yLabel: "CoM Velocity ẋ (m/s)",
      description: "Plan dynamic footstep placements using the Divergent Component of Motion (DCM / Capture Point ξ) to keep the Zero-Moment Point inside the support polygon.",
      params: [
        { key: "zc_height", label: "CoM Pelvis Height z_c (m)", type: "range", min: 0.4, max: 1.2, step: 0.02, value: 0.82 },
        { key: "step_t", label: "Step Duration T_step (s)", type: "range", min: 0.2, max: 1.0, step: 0.02, value: 0.45 },
        { key: "push_imp", label: "External Push Disturbance", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "rob_zmp_1", text: "Lower CoM Height z_c to increase natural frequency ω₀ = √(g/z_c) and widen capture margin.", xp: 15 },
        { id: "rob_zmp_2", text: "Click the phase portrait to apply a lateral push and observe capture-point step recovery.", xp: 15 },
        { id: "rob_zmp_3", text: "Shorten Step Duration T_step to stabilize high-speed dynamic walking.", xp: 15 },
      ],
    },
    {
      id: "rob_jacobian_singularity_dls", name: "Manipulator Jacobian Ellipsoid & Damped Least Squares (DLS) IK", domains: ["robotics"],
      engine: "neural_manifold", formula: "q̇ = Jᵀ (J Jᵀ + λ² I)⁻¹ v_task,  w(q) = √det(J Jᵀ)",
      description: "Map joint velocities to end-effector manipulability ellipsoids and use Levenberg-Marquardt damping λ near kinematic singularities where det(J) → 0.",
      params: [
        { key: "dls_lambda", label: "Damping Factor λ_DLS", type: "range", min: 0.01, max: 1.0, step: 0.02, value: 0.18 },
        { key: "manip_cond", label: "Proximity to Singularity κ(J)", type: "range", min: 1.0, max: 15.0, step: 0.5, value: 4.0 },
        { key: "null_gain", label: "Null-Space Posture Gain k₀", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 0.35 },
      ],
      challenges: [
        { id: "rob_jac_1", text: "Increase Damping λ_DLS near high Singularity κ(J) to prevent infinite joint-velocity spikes.", xp: 15 },
        { id: "rob_jac_2", text: "Click the workspace manifold to set a new end-effector target velocity.", xp: 15 },
        { id: "rob_jac_3", text: "Raise Null-Space Gain k₀ to maximize Yoshikawa manipulability w(q) during tracking.", xp: 15 },
      ],
    },
    {
      id: "rob_rrt_star_sampling", name: "Asymptotically Optimal RRT* & Informed Ellipsoidal Sampling", domains: ["robotics"],
      engine: "network_graph", formula: "r_rewire = γ (log n / n)^{1/d},  c_best ≥ ‖x_start − x_goal‖",
      description: "Grow a rapidly-exploring random tree with local radius rewiring and restrict sampling to the prolate hyperspheroid after finding an initial path.",
      params: [
        { key: "rewire_r", label: "Rewiring Radius γ", type: "range", min: 1, max: 5, step: 1, value: 3 },
        { key: "goal_bias", label: "Goal Bias Probability p_goal", type: "range", min: 0.05, max: 0.8, step: 0.05, value: 0.25 },
        { key: "clearance", label: "Obstacle Clearance Inflation", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "rob_rrt_1", text: "Increase Rewiring Radius γ to straighten suboptimal jagged tree branches toward the geodesic.", xp: 15 },
        { id: "rob_rrt_2", text: "Click a waypoint node to force local path rewiring.", xp: 15 },
        { id: "rob_rrt_3", text: "Tune Goal Bias p_goal to balance fast initial solution discovery vs global exploration.", xp: 15 },
      ],
    },
    {
      id: "rob_impedance_admittance_ctrl", name: "Cartesian Impedance Control & Compliant Contact Dynamics", domains: ["robotics"],
      engine: "phase_attractor", formula: "M_d ẍ + B_d (ẋ − ẋ_0) + K_d (x − x_0) = F_ext",
      xLabel: "Contact Penetration Δx", yLabel: "Contact Velocity ẋ",
      description: "Shape the virtual mass-spring-damper mechanical impedance of a robot arm during contact transitions with stiff environments.",
      params: [
        { key: "stiff_kd", label: "Virtual Stiffness K_d (N/m)", type: "range", min: 0.2, max: 4.0, step: 0.1, value: 1.4 },
        { key: "damp_bd", label: "Virtual Damping B_d (Ns/m)", type: "range", min: 0.1, max: 3.0, step: 0.05, value: 1.1 },
        { key: "env_ke", label: "Wall Stiffness K_env", type: "range", min: 0.5, max: 5.0, step: 0.1, value: 2.2 },
      ],
      challenges: [
        { id: "rob_imp_1", text: "Tune Virtual Damping B_d ≈ 2√(M_d K_d) to eliminate contact bounce upon wall impact.", xp: 15 },
        { id: "rob_imp_2", text: "Click the phase space to simulate an unexpected surface contact collision.", xp: 15 },
        { id: "rob_imp_3", text: "Lower Virtual Stiffness K_d when interacting with a high-stiffness K_env wall to preserve passivity.", xp: 15 },
      ],
    },
    {
      id: "rob_lqr_riccati_pendulum", name: "Linear Quadratic Regulator (LQR) & Algebraic Riccati Equation", domains: ["robotics"],
      engine: "phase_attractor", formula: "AᵀP + PA − PBR⁻¹BᵀP + Q = 0,  u = −R⁻¹BᵀP x",
      xLabel: "Pole Angle θ (rad)", yLabel: "Angular Rate θ̇ (rad/s)",
      description: "Stabilize an underactuated cart-pole about its upright unstable equilibrium by solving the continuous-time Algebraic Riccati Equation for optimal gain K.",
      params: [
        { key: "q_state", label: "State Penalty Weight Q", type: "range", min: 0.2, max: 10.0, step: 0.2, value: 3.0 },
        { key: "r_act", label: "Actuator Cost Weight R", type: "range", min: 0.1, max: 5.0, step: 0.1, value: 0.8 },
        { key: "disturb", label: "Wind Torque Disturbance", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 0.15 },
      ],
      challenges: [
        { id: "rob_lqr_1", text: "Increase State Weight Q relative to R to shift closed-loop poles further into the left-half plane.", xp: 15 },
        { id: "rob_lqr_2", text: "Click the phase portrait to displace the pole and inspect the quadratic cost-to-go xᵀPx.", xp: 15 },
        { id: "rob_lqr_3", text: "Verify symmetric root-locus pole placement guaranteed by LQR return-difference identity.", xp: 15 },
      ],
    },
    {
      id: "rob_mecanum_holonomic_kin", name: "Omnidirectional Mecanum / Swedish Wheel Kinematics", domains: ["robotics"],
      engine: "quantum_orbital", formula: "[ω₁, ω₂, ω₃, ω₄]ᵀ = (1/r) J_m [v_x, v_y, ω_z]ᵀ",
      description: "Command decoupled planar translation (v_x, v_y) and yaw spin ω_z using 45° roller force vectors and inspect the traction friction polygon.",
      params: [
        { key: "heading_vx", label: "Strafe Angle atan2(v_y, v_x)", type: "range", min: 0.0, max: 6.28, step: 0.1, value: 0.78 },
        { key: "yaw_wz", label: "Simultaneous Yaw Rate ω_z", type: "range", min: -2.0, max: 2.0, step: 0.1, value: 0.5 },
        { key: "slip_mu", label: "Roller Slip Coefficient", type: "range", min: 0.0, max: 0.8, step: 0.05, value: 0.1 },
      ],
      challenges: [
        { id: "rob_mec_1", text: "Set Strafe Angle to π/2 (pure lateral crabbing) and verify diagonal wheel counter-rotation.", xp: 15 },
        { id: "rob_mec_2", text: "Click the chassis vector rose to command an instant holonomic velocity vector.", xp: 15 },
        { id: "rob_mec_3", text: "Combine translation with Yaw Rate ω_z to trace a spinning pirouette trajectory.", xp: 15 },
      ],
    },
    {
      id: "rob_particle_filter_mcl", name: "Monte Carlo Localization (MCL) & Kidnapped Robot Resampling", domains: ["robotics"],
      engine: "field_lattice", formula: "wₜ^{[m]} ∝ p(zₜ | xₜ^{[m]}, M),  N_eff = 1 / Σ (w̃^{[m]})²",
      description: "Track non-Gaussian multi-modal pose beliefs on an occupancy grid and recover from robot kidnapping via low-variance sequential importance resampling.",
      params: [
        { key: "sensor_sig", label: "LiDAR Likelihood Sharpness", type: "range", min: 0.01, max: 0.08, step: 0.002, value: 0.042 },
        { key: "rand_inj", label: "Kidnapped Recovery Particle Rate", type: "range", min: 0.03, max: 0.08, step: 0.002, value: 0.058 },
        { key: "motion_d", label: "Odometry Diffusion Spread", type: "range", min: 0.08, max: 0.35, step: 0.01, value: 0.16 },
      ],
      challenges: [
        { id: "rob_mcl_1", text: "Adjust Likelihood Sharpness to collapse multi-modal hallway hypotheses into a single pose mode.", xp: 15 },
        { id: "rob_mcl_2", text: "Click the occupancy map to teleport ('kidnap') the robot and watch random particle injection recover.", xp: 15 },
        { id: "rob_mcl_3", text: "Monitor Effective Sample Size N_eff to prevent particle deprivation.", xp: 15 },
      ],
    },
    {
      id: "rob_dubins_reeds_shepp", name: "Non-Holonomic Dubins & Reeds-Shepp Minimum-Turn Curvature Paths", domains: ["robotics"],
      engine: "quantum_orbital", formula: "ẋ = v cos θ, ẏ = v sin θ, θ̇ = (v/L) tan φ,  |κ| ≤ κ_max",
      description: "Synthesize optimal CSC and CCC minimum-length curves (LSL, RSR, LRL) connecting oriented SE(2) configurations under bounded steering radius R_min.",
      params: [
        { key: "r_min", label: "Minimum Turn Radius R_min", type: "range", min: 0.3, max: 2.5, step: 0.05, value: 1.0 },
        { key: "goal_psi", label: "Terminal Heading ψ_goal", type: "range", min: 0.0, max: 6.28, step: 0.1, value: 1.57 },
        { key: "rev_cost", label: "Reverse Gear Penalty (Reeds-Shepp)", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "rob_dub_1", text: "Increase Minimum Turn Radius R_min until the CSC path switches to a 3-arc CCC maneuver.", xp: 15 },
        { id: "rob_dub_2", text: "Click the SE(2) workspace to set a new target heading orientation.", xp: 15 },
        { id: "rob_dub_3", text: "Lower Reverse Gear Penalty to enable Reeds-Shepp parallel-parking cusps.", xp: 15 },
      ],
    },
    {
      id: "rob_grasp_force_closure", name: "Dexterous Grasp Wrench Cone & Ferrari-Canny Force Closure", domains: ["robotics"],
      engine: "strategic_game", formula: "W = ConvexHull(∪ᵢ Fᵢ),  0 ∈ int(W) ⟺ Force Closure",
      description: "Position multi-finger contact points on an object boundary and test whether the Coulomb friction cones span the 6D wrench space origin.",
      params: [
        { key: "mu_fric", label: "Coulomb Friction Coefficient μ", type: "range", min: 0.1, max: 1.5, step: 0.05, value: 0.6 },
        { key: "spread_ang", label: "Finger Opposition Spread", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 1.1 },
        { key: "preload", label: "Internal Squeeze Preload F_int", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 0.8 },
      ],
      challenges: [
        { id: "rob_gfc_1", text: "Widen Finger Friction μ = tan(α) until the origin lies strictly inside the wrench simplex.", xp: 15 },
        { id: "rob_gfc_2", text: "Click inside the wrench simplex to apply an external disturbance wrench and verify grasp stability.", xp: 15 },
        { id: "rob_gfc_3", text: "Maximize the Ferrari-Canny largest-inscribed-ball grasp quality metric Q_FC.", xp: 15 },
      ],
    },
    {
      id: "rob_visual_servoing_ibvs", name: "Image-Based Visual Servoing (IBVS) & Interaction Matrix L_s", domains: ["robotics"],
      engine: "phase_attractor", formula: "ṡ = L_s(s, Z) v_c,  v_c = −λ L̂_s⁺ (s − s*)",
      xLabel: "Image Feature Error e_u (px)", yLabel: "Image Feature Error e_v (px)",
      description: "Drive 6-DOF camera velocity v_c directly from 2D pixel feature errors e = s − s* and compare image-plane straight lines vs 3D camera retreat (Chaumette conundrum).",
      params: [
        { key: "servo_lam", label: "Proportional Servo Gain λ", type: "range", min: 0.2, max: 3.5, step: 0.1, value: 1.2 },
        { key: "depth_z", label: "Estimated Feature Depth Ẑ (m)", type: "range", min: 0.3, max: 3.0, step: 0.1, value: 1.0 },
        { key: "rot_phi", label: "Optical Axis Rotation Δφ", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "rob_vs_1", text: "Introduce a large Optical Axis Rotation Δφ to observe the IBVS camera-retreat phenomenon.", xp: 15 },
        { id: "rob_vs_2", text: "Click the image plane to displace target fiducial corners and trace pixel error convergence.", xp: 15 },
        { id: "rob_vs_3", text: "Mismatch Depth Estimate Ẑ and test robustness of pseudoinverse L̂_s⁺.", xp: 15 },
      ],
    },
    {
      id: "rob_cpg_legged_gaits", name: "Central Pattern Generator (CPG) Coupled Hopf Gait Oscillators", domains: ["robotics"],
      engine: "phase_attractor", formula: "żᵢ = (μ − |zᵢ|² + iω)zᵢ + Σⱼ Kᵢⱼ e^{iφᵢⱼ} zⱼ",
      xLabel: "Limb Oscillator x₁", yLabel: "Limb Oscillator y₁",
      description: "Synchronize four coupled nonlinear Hopf oscillators via phase-lag matrices φᵢⱼ to transition smoothly between walk, trot, pace, and bound quadruped gaits.",
      params: [
        { key: "freq_gait", label: "Stride Cadence ω (Hz)", type: "range", min: 0.5, max: 4.0, step: 0.1, value: 1.8 },
        { key: "cpl_k", label: "Inter-Limb Coupling Gain K", type: "range", min: 0.1, max: 3.0, step: 0.1, value: 1.4 },
        { key: "duty_beta", label: "Duty Factor Stance Ratio β", type: "range", min: 0.2, max: 0.85, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "rob_cpg_1", text: "Set Duty Factor β = 0.5 and high Coupling K to lock into a diagonal trotting limit cycle.", xp: 15 },
        { id: "rob_cpg_2", text: "Click the phase portrait to stumble a limb and watch rapid limit-cycle entrainment.", xp: 15 },
        { id: "rob_cpg_3", text: "Raise Stride Cadence ω while lowering β < 0.4 to transition into a dynamic galloping bound.", xp: 15 },
      ],
    },
    {
      id: "rob_se3_pose_graph_opt", name: "SE(3) Lie Group Pose-Graph Optimization & Gauss-Newton Manifold", domains: ["robotics"],
      engine: "neural_manifold", formula: "T ← T · exp([ξ*]∧),  (Jᵀ Ω J) ξ* = −Jᵀ Ω e(T)",
      description: "Optimize 3D robot trajectories directly on the smooth Lie manifold SE(3) via tangent-space se(3) increments ξ ∈ ℝ⁶ and robust Huber kernels.",
      params: [
        { key: "huber_k", label: "Robust Huber Threshold δ", type: "range", min: 0.1, max: 2.5, step: 0.05, value: 0.8 },
        { key: "info_w", label: "Loop Information Stiffness Ω", type: "range", min: 0.2, max: 4.0, step: 0.1, value: 1.5 },
        { key: "outlier_r", label: "False Loop-Closure Ratio", type: "range", min: 0.0, max: 0.6, step: 0.05, value: 0.1 },
      ],
      challenges: [
        { id: "rob_se3_1", text: "Tighten Huber Threshold δ when Outlier Ratio > 0.3 to reject perceptual aliasing loops.", xp: 15 },
        { id: "rob_se3_2", text: "Click the manifold to initialize Gauss-Newton retraction from a distorted initial guess.", xp: 15 },
        { id: "rob_se3_3", text: "Compare chordal initialization vs naive Euler-angle linearization.", xp: 15 },
      ],
    },
    {
      id: "rob_BLDC_foc_commutation", name: "Brushless DC (BLDC) Field-Oriented Control & Park-Clarke d-q Transform", domains: ["robotics"],
      engine: "wave_fourier", formula: "[i_d, i_q]ᵀ = T_Park(θ_e) T_Clarke [i_a, i_b, i_c]ᵀ,  τ_e = (3/2) p λ_m i_q",
      description: "Transform 3-phase stator currents into the rotor-aligned d-q reference frame to maintain 90° quadrature torque current i_q and zero flux waste i_d = 0.",
      params: [
        { key: "rpm_w", label: "Electrical Speed ω_e", type: "range", min: 0.5, max: 5.0, step: 0.1, value: 2.0 },
        { key: "iq_ref", label: "Quadrature Torque Current i_q*", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 1.4 },
        { key: "id_weak", label: "Field-Weakening Current i_d*", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 0.0 },
      ],
      challenges: [
        { id: "rob_foc_1", text: "Set Field-Weakening i_d* = 0 to keep stator current phasor strictly orthogonal to rotor flux (90° MTPA).", xp: 15 },
        { id: "rob_foc_2", text: "Drag the rotor angle probe to inspect balanced 120°-shifted Clarke/SVPWM phase waveforms.", xp: 15 },
        { id: "rob_foc_3", text: "Inject negative Field-Weakening i_d* at high ω_e to operate above base back-EMF speed.", xp: 15 },
      ],
    },
    {
      id: "rob_complementary_imu_fusion", name: "IMU Mahony/Madgwick Attitude Filter & Gyro Bias Observability", domains: ["robotics"],
      engine: "wave_fourier", formula: "q̇ = ½ q ⊗ (ω_m − b̂ + k_p e_mes),  b̂̇ = −k_i e_mes",
      description: "Fuse high-frequency gyroscope integration (low-pass drift) with noisy accelerometer/magnetometer gravity vectors (high-pass vibration) on SO(3).",
      params: [
        { key: "cutoff_fc", label: "Crossover Frequency f_c (Hz)", type: "range", min: 0.2, max: 5.0, step: 0.1, value: 1.2 },
        { key: "gyro_bias", label: "Gyro Constant Bias b_ω (deg/s)", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.45 },
        { key: "vib_noise", label: "Linear Accel Vibration σ_a", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "rob_imu_1", text: "Tune Crossover Frequency f_c to reject linear vibration σ_a while canceling gyro drift b_ω.", xp: 15 },
        { id: "rob_imu_2", text: "Drag the frequency probe to inspect where the low-pass and high-pass Bode gains sum to unity (L(s)+H(s)=1).", xp: 15 },
        { id: "rob_imu_3", text: "Raise Gyro Bias b_ω and verify integral feedback k_i estimates and subtracts the drift.", xp: 15 },
      ],
    },
    {
      id: "rob_artificial_potential_bug", name: "Artificial Potential Fields (APF) & Harmonic Navigation Functions", domains: ["robotics"],
      engine: "field_lattice", formula: "U(q) = ½ k_att ‖q − q_goal‖² + ½ k_rep (1/ρ(q) − 1/ρ₀)²",
      description: "Navigate a mobile robot along −∇U(q) and resolve concave U-shaped obstacle local minima by switching to a harmonic Laplace potential ∇²φ = 0.",
      params: [
        { key: "k_att", label: "Attractive Gain k_att", type: "range", min: 0.02, max: 0.08, step: 0.002, value: 0.044 },
        { key: "k_rep", label: "Repulsive Barrier Gain k_rep", type: "range", min: 0.04, max: 0.08, step: 0.002, value: 0.060 },
        { key: "harmonic", label: "Harmonic Smoothing D", type: "range", min: 0.08, max: 0.35, step: 0.01, value: 0.22 },
      ],
      challenges: [
        { id: "rob_apf_1", text: "Increase Harmonic Smoothing D to eliminate spurious interior local minima.", xp: 15 },
        { id: "rob_apf_2", text: "Click/drag on the workspace to place new repulsive obstacles and watch potential streamlines adapt.", xp: 15 },
        { id: "rob_apf_3", text: "Balance k_att and k_rep to pass smoothly through narrow corridors without oscillation.", xp: 15 },
      ],
    },
    {
      id: "rob_consensus_olfati_saber", name: "Multi-Robot Consensus, Reynolds Flocking & Algebraic Connectivity λ₂", domains: ["robotics"],
      engine: "network_graph", formula: "uᵢ = −Σ_{j∈Nᵢ} aᵢⱼ (xᵢ − xⱼ) + f_coh/sep",
      description: "Achieve distributed rendezvous and formation control over a time-varying proximity graph G(t) with convergence rate governed by Fiedler eigenvalue λ₂(L).",
      params: [
        { key: "comm_r", label: "Communication Range R_comm", type: "range", min: 1, max: 5, step: 1, value: 2 },
        { key: "gain_k", label: "Consensus Coupling Gain k", type: "range", min: 0.3, max: 3.0, step: 0.1, value: 1.5 },
        { key: "delay_tau", label: "Communication Delay τ", type: "range", min: 0.05, max: 0.9, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "rob_con_1", text: "Increase Communication Range R_comm to raise λ₂(L) and accelerate swarm rendezvous.", xp: 15 },
        { id: "rob_con_2", text: "Drag a leader agent node on the canvas and watch the connected flock track its heading.", xp: 15 },
        { id: "rob_con_3", text: "Keep Coupling Gain × Delay below the Nyquist stability threshold π / (2 λ_max).", xp: 15 },
      ],
    },
    {
      id: "rob_teleop_wave_variables", name: "Bilateral Haptic Teleoperation & Scattering Wave Variables", domains: ["robotics"],
      engine: "wave_fourier", formula: "u_m = (b ẋ_m + F_m)/√(2b),  v_s = (b ẋ_s − F_s)/√(2b)",
      description: "Guarantee passivity of force-reflecting master-slave teleoperation across arbitrary communication time delays T using Niemeyer-Slotine wave variables.",
      params: [
        { key: "delay_t", label: "Round-Trip Latency 2T (ms)", type: "range", min: 0.2, max: 4.0, step: 0.1, value: 1.4 },
        { key: "wave_b", label: "Characteristic Wave Impedance b", type: "range", min: 0.3, max: 3.0, step: 0.1, value: 1.2 },
        { key: "match_k", label: "Termination Impedance Match", type: "range", min: 1, max: 10, step: 1, value: 5 },
      ],
      challenges: [
        { id: "rob_tel_1", text: "Match Wave Impedance b to the termination load to eliminate wave reflections on the delay line.", xp: 15 },
        { id: "rob_tel_2", text: "Drag the master probe to feel transmitted slave contact forces across latency 2T.", xp: 15 },
        { id: "rob_tel_3", text: "Verify system passivity even when Round-Trip Latency 2T exceeds 500 ms.", xp: 15 },
      ],
    },

    // =========================================================================
    // 6. PHILOSOPHY (20 simulations)
    // =========================================================================
    {
      id: "phil_newcomb_paradox", name: "Newcomb's Paradox: Causal (CDT) vs Evidential Decision Theory (EDT)", domains: ["philosophy"],
      engine: "strategic_game", formula: "EU_EDT(a) = Σ_s P(s | a) U(a,s)  vs  EU_CDT(a) = Σ_s P(a □→ s) U(a,s)",
      description: "Compare One-Boxing vs Two-Boxing against an α-accurate predictor Omega across Causal, Evidential, and Functional Decision Theories (FDT).",
      params: [
        { key: "omega_acc", label: "Predictor Accuracy α", type: "range", min: 0.5, max: 0.99, step: 0.01, value: 0.92 },
        { key: "box_a", label: "Transparent Box A ($k)", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 0.5 },
        { key: "corr_rho", label: "Algorithmic Twin Correlation ρ", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.85 },
      ],
      challenges: [
        { id: "phil_nc_1", text: "Raise Predictor Accuracy α above (1000 + A)/2000 to make Evidential Decision Theory strictly favor One-Boxing.", xp: 15 },
        { id: "phil_nc_2", text: "Click the decision simplex to shift agent population mix between CDT, EDT, and FDT.", xp: 15 },
        { id: "phil_nc_3", text: "Observe why CDT dominance reasoning ('Two-Boxing gives +$1k in both states') loses wealth when ρ → 1.", xp: 15 },
      ],
    },
    {
      id: "phil_skyrms_stag_hunt", name: "Skyrms Social Contract: Stag Hunt vs Rousseau Basin of Attraction", domains: ["philosophy"],
      engine: "strategic_game", formula: "dx_S/dt = x_S (1 − x_S) [ u(S,S) x_S + u(S,H)(1−x_S) − u_H ]",
      description: "Compare payoff-dominant Stag cooperation against risk-dominant Hare hunting in evolutionary replicator dynamics and local neighborhood networks.",
      params: [
        { key: "stag_pay", label: "Stag Mutual Payoff S", type: "range", min: 2.0, max: 6.0, step: 0.1, value: 4.0 },
        { key: "hare_pay", label: "Safe Hare Payoff H", type: "range", min: 1.0, max: 3.5, step: 0.1, value: 2.5 },
        { key: "assort", label: "Local Kin/Network Assortment r", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "phil_sh_1", text: "Increase Safe Hare Payoff H to widen the risk-dominant Hare basin and shrink the Stag separatrix.", xp: 15 },
        { id: "phil_sh_2", text: "Click the simplex across the unstable interior polymorphism x* = H / S.", xp: 15 },
        { id: "phil_sh_3", text: "Raise Network Assortment r to allow cooperative Stag hunters to invade a Hare population.", xp: 15 },
      ],
    },
    {
      id: "phil_condorcet_jury_epistemic", name: "Condorcet Jury Theorem & Epistemic Diversity (Hong-Page)", domains: ["philosophy"],
      engine: "kinetics_thermodynamics", formula: "P(Maj_N = True) = Σ_{k=⌈N/2⌉}^N C(N,k) p^k (1−p)^{N−k}",
      description: "Track collective group reliability as voter count N grows under individual competence p and correlated groupthink ρ.",
      params: [
        { key: "comp_p", label: "Individual Competence p", type: "range", min: 0.35, max: 0.85, step: 0.01, value: 0.56 },
        { key: "corr_rho", label: "Deliberative Correlation ρ", type: "range", min: 0.0, max: 0.8, step: 0.02, value: 0.12 },
        { key: "jury_n", label: "Jury Size Scaling N", type: "range", min: 0.5, max: 4.0, step: 0.1, value: 2.2 },
      ],
      challenges: [
        { id: "phil_cj_1", text: "Flip Individual Competence p across 0.50 to see majority accuracy rush toward 1.0 vs 0.0.", xp: 15 },
        { id: "phil_cj_2", text: "Drag the jury-size probe to inspect diminishing returns when Correlation ρ > 0.4 (groupthink ceiling).", xp: 15 },
        { id: "phil_cj_3", text: "Verify how a diverse, uncorrelated p=0.55 crowd beats a small correlated p=0.70 clique.", xp: 15 },
      ],
    },
    {
      id: "phil_arrow_impossibility", name: "Arrow's Impossibility Theorem & Condorcet Voting Cycles", domains: ["philosophy"],
      engine: "strategic_game", formula: "A ≻ B ≻ C, B ≻ C ≻ A, C ≻ A ≻ B  ⇒  Cyclic Social Preference",
      description: "Aggregate preference profiles via Borda count, Plurality, and Condorcet pairwise comparison and trigger violations of Independence of Irrelevant Alternatives (IIA).",
      params: [
        { key: "polar", label: "Voter Preference Polarization", type: "range", min: 0.1, max: 2.0, step: 0.05, value: 1.1 },
        { key: "spoiler", label: "Third-Party Spoiler Entry", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.45 },
        { key: "borda_w", label: "Positional Scoring Convexity", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "phil_ar_1", text: "Raise Spoiler Entry to flip the Borda/Plurality winner without changing pairwise A vs B preferences (IIA violation).", xp: 15 },
        { id: "phil_ar_2", text: "Click the center of the voting simplex to enter the rock-paper-scissors Condorcet cycle zone.", xp: 15 },
        { id: "phil_ar_3", text: "Impose single-peaked preferences (low Polarization) to restore Black's Median Voter equilibrium.", xp: 15 },
      ],
    },
    {
      id: "phil_parfit_repugnant_conclusion", name: "Parfit's Repugnant Conclusion & Population Axiology", domains: ["philosophy"],
      engine: "kinetics_thermodynamics", formula: "W_total = Σᵢ uᵢ,  W_avg = (1/N) Σᵢ uᵢ,  W_critical = Σᵢ (uᵢ − c)",
      description: "Compare Total Utilitarianism, Average Utilitarianism, and Critical-Level Prioritarianism as population N expands from small ecstatic World A to vast barely-worth-living World Z.",
      params: [
        { key: "crit_c", label: "Critical Welfare Threshold c", type: "range", min: 0.0, max: 0.8, step: 0.02, value: 0.25 },
        { key: "ineq_alpha", label: "Prioritarian Concavity α", type: "range", min: 0.5, max: 3.0, step: 0.1, value: 1.4 },
        { key: "carrying", label: "Resource Dilution Elasticity", type: "range", min: 0.1, max: 1.5, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "phil_pr_1", text: "Set Critical Threshold c = 0 (Total Utilitarianism) and drag population N rightward into World Z.", xp: 15 },
        { id: "phil_pr_2", text: "Raise Critical Threshold c > 0.3 to block the Repugnant Conclusion while observing the Sadistic Conclusion tension.", xp: 15 },
        { id: "phil_pr_3", text: "Tune Prioritarian Concavity α to give lexical priority to the worst-off individuals.", xp: 15 },
      ],
    },
    {
      id: "phil_gettier_epistemic_safety", name: "Gettier Cases, Nozick Tracking & Williamson Epistemic Safety", domains: ["philosophy"],
      engine: "quantum_orbital", formula: "Safe(B) ⟺ ∀w' ∈ B_ε(w₀): B(w') → True(w')",
      description: "Map belief-forming methods in modal possible-world space around the actual world w₀ to distinguish lucky justified true belief (Gettier) from safe knowledge.",
      params: [
        { key: "truth_r", label: "Truth-Sphere Radius R_T", type: "range", min: 0.2, max: 1.5, step: 0.05, value: 0.7 },
        { key: "modal_eps", label: "Modal Safety Neighborhood ε", type: "range", min: 0.1, max: 1.2, step: 0.05, value: 0.55 },
        { key: "luck_shift", label: "Bad/Good Luck Double Shift Δ", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.45 },
      ],
      challenges: [
        { id: "phil_gt_1", text: "Increase Luck Shift Δ to create a Fake-Barn / Stopped-Clock Gettier case where belief is true at w₀ but false in nearby w'.", xp: 15 },
        { id: "phil_gt_2", text: "Click the modal sphere to move the actual world w₀ deep inside the Truth-Sphere for safe knowledge.", xp: 15 },
        { id: "phil_gt_3", text: "Compare Nozick sensitivity (~p □→ ~B(p)) against Sosa safety (B(p) □→ p).", xp: 15 },
      ],
    },
    {
      id: "phil_kripke_modal_frames", name: "Kripke Possible-World Semantics & Modal Axioms (K, T, S4, S5)", domains: ["philosophy"],
      engine: "network_graph", formula: "w ⊨ □φ ⟺ ∀v (wRv → v ⊨ φ),  ◇φ ≡ ¬□¬φ",
      description: "Edit accessibility relations R between possible worlds (reflexive, symmetric, transitive) to validate or refute modal formulas like □p → p and ◇p → □◇p.",
      params: [
        { key: "frame_deg", label: "Accessibility Density (K→T→S4→S5)", type: "range", min: 1, max: 4, step: 1, value: 2 },
        { key: "val_p", label: "Valuation Density V(p)", type: "range", min: 0.2, max: 2.5, step: 0.1, value: 1.2 },
        { key: "euclid", label: "Symmetric Closure Rate", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "phil_kr_1", text: "Increase Accessibility Density to S5 (equivalence relation) where ◇□p → □p holds at every world.", xp: 15 },
        { id: "phil_kr_2", text: "Click a world v_i to toggle truth of p and watch □p and ◇p propagate backward along R.", xp: 15 },
        { id: "phil_kr_3", text: "Construct a non-reflexive countermodel where □p is true at w₀ while p is false.", xp: 15 },
      ],
    },
    {
      id: "phil_tarski_liar_fixed_point", name: "Tarski's Undefinability & Kripke's 3-Valued Grounded Truth", domains: ["philosophy"],
      engine: "phase_attractor", formula: "L ↔ ¬True(⌜L⌝),  Φ_K(S⁺, S⁻) = S⁺_∞ (Kleene Fixed Point)",
      xLabel: "Truth Credence c(L)", yLabel: "Dual Credence c(¬L)",
      description: "Iterate truth-revision operators on the Liar ('This sentence is false'), Truth-Teller, and Yablo chains across Classical Revision (Gupta-Belnap) and Strong Kleene K₃.",
      params: [
        { key: "kleene_damp", label: "Kleene Grounding Damping γ", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.2 },
        { key: "cycle_len", label: "Circularity Loop Coupling", type: "range", min: 0.5, max: 2.5, step: 0.1, value: 1.4 },
        { key: "para_dial", label: "Priest Dialetheic Overlap", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.15 },
      ],
      challenges: [
        { id: "phil_tl_1", text: "Set Grounding Damping γ = 0 to observe classical Gupta-Belnap revision oscillation (0 → 1 → 0).", xp: 15 },
        { id: "phil_tl_2", text: "Click the truth-value plane to test whether the Truth-Teller converges or remains ungrounded.", xp: 15 },
        { id: "phil_tl_3", text: "Increase Grounding Damping γ > 0.6 to drive the Liar to the Kripke fixed point u = ½.", xp: 15 },
      ],
    },
    {
      id: "phil_duhem_quine_holism", name: "Duhem-Quine Web of Belief & Lakatosian Protective Belt", domains: ["philosophy"],
      engine: "network_graph", formula: "(H ∧ A₁ ∧ ... ∧ Aₙ) → O;  ¬O ⇒ ¬H ∨ ¬A₁ ∨ ... ∨ ¬Aₙ",
      description: "Inject recalcitrant empirical anomalies at the sensory periphery and observe how minimum-mutilation belief revision protects high-centrality core axioms.",
      params: [
        { key: "core_stiff", label: "Hard-Core Entrenchment k_core", type: "range", min: 1, max: 4, step: 1, value: 3 },
        { key: "anomaly_str", label: "Empirical Shock Magnitude", type: "range", min: 0.3, max: 2.5, step: 0.1, value: 1.4 },
        { key: "conserv", label: "Quinean Minimum-Mutilation α", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.45 },
      ],
      challenges: [
        { id: "phil_dq_1", text: "Click a peripheral observation node to inject a falsifying anomaly and watch auxiliary hypotheses absorb the shock.", xp: 15 },
        { id: "phil_dq_2", text: "Lower Hard-Core Entrenchment and raise Anomaly Magnitude to trigger a Kuhnian paradigm shift.", xp: 15 },
        { id: "phil_dq_3", text: "Compare Popperian isolated falsification vs Quinean holistic web redistribution.", xp: 15 },
      ],
    },
    {
      id: "phil_Hume_Lewis_convention", name: "David Lewis Signaling Games & Spontaneous Meaning Emergence", domains: ["philosophy"],
      engine: "strategic_game", formula: "S: States → Signals,  R: Signals → Actions,  u(s,a) = δ_{s,a}",
      description: "Simulate sender-receiver reinforcement learning and replicator dynamics converging from babbling equilibria to compositional signaling conventions.",
      params: [
        { key: "mut_eps", label: "Exploration / Mutation Rate ε", type: "range", min: 0.01, max: 0.5, step: 0.02, value: 0.08 },
        { key: "asymm", label: "State Prior Skewness", type: "range", min: 0.1, max: 1.5, step: 0.05, value: 0.4 },
        { key: "cost_c", label: "Signal Production Cost c", type: "range", min: 0.0, max: 0.8, step: 0.05, value: 0.1 },
      ],
      challenges: [
        { id: "phil_dl_1", text: "Click near the center of the simplex (pooling/babbling) and watch symmetry break into a separating signaling system.", xp: 15 },
        { id: "phil_dl_2", text: "Increase State Prior Skewness to observe partial-pooling bottlenecks.", xp: 15 },
        { id: "phil_dl_3", text: "Add slight Mutation ε to escape suboptimal partial-pooling equilibria toward full communication.", xp: 15 },
      ],
    },
    {
      id: "phil_no_cloning_identity", name: "Parfit's Teletransporter, Fission & Bundle Theory of Personal Identity", domains: ["philosophy"],
      engine: "quantum_orbital", formula: "Relation R = Psychological Continuity + Connectedness (Non-Branching)",
      description: "Vary neural replacement fraction and hemispheric fission symmetry to compare Ego Theory (strict all-or-nothing identity) against Parfit's Psychological Continuity R.",
      params: [
        { key: "replace_pct", label: "Teletransport / Silicon Replacement", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.5 },
        { key: "fission_sym", label: "Hemispheric Branching Symmetry", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.2 },
        { key: "mem_decay", label: "Memory Connectedness Decay λ", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.15 },
      ],
      challenges: [
        { id: "phil_pi_1", text: "Sweep Silicon Replacement through 50% (Williams/Parfit spectrum) to inspect Ego vs Bundle thresholds.", xp: 15 },
        { id: "phil_pi_2", text: "Click the state sphere to trigger symmetric fission (Branching = 1.0) where strict identity fails transitivity.", xp: 15 },
        { id: "phil_pi_3", text: "Adjust Memory Decay λ to model Methuselah's fading psychological connectedness.", xp: 15 },
      ],
    },
    {
      id: "phil_sleeping_beauty_credence", name: "Sleeping Beauty Problem: Thirder vs Halfer Anthropic Updating", domains: ["philosophy"],
      engine: "strategic_game", formula: "P_Thirder(Heads | Awake) = 1/3  vs  P_Halfer(Heads | Awake) = 1/2",
      description: "Simulate repeated anthropic awakenings under Elga's Thirder self-locating credence update vs Lewis's Halfer non-indexical conditioning.",
      params: [
        { key: "clones_k", label: "Tails Awakenings / Clones M", type: "range", min: 2, max: 10, step: 1, value: 2 },
        { key: "coin_bias", label: "Prior Coin Bias P(Heads)", type: "range", min: 0.1, max: 0.9, step: 0.05, value: 0.5 },
        { key: "bet_ev", label: "Per-Awakening Betting Stake", type: "range", min: 0.1, max: 2.0, step: 0.1, value: 1.0 },
      ],
      challenges: [
        { id: "phil_sb_1", text: "Set Tails Awakenings M = 2 and Coin Bias = 0.5 to compare 1/3 vs 1/2 credence shares.", xp: 15 },
        { id: "phil_sb_2", text: "Click the credence simplex to test Dutch-Book vulnerability across Monday/Tuesday bets.", xp: 15 },
        { id: "phil_sb_3", text: "Increase Tails Awakenings M = 10 ('Extreme Sleeping Beauty') to amplify the anthropic reference-class gap.", xp: 15 },
      ],
    },
    {
      id: "phil_popper_verisimilitude", name: "Popperian Falsifiability, Corroboration & Niiniluoto Truthlikeness", domains: ["philosophy"],
      engine: "kinetics_thermodynamics", formula: "Ct(H) = 1 − P(H),  C(H,E) = [P(E|H) − P(E)] / [P(E|H) − P(E∧H) + P(E)]",
      description: "Trade off logical boldness (low prior P(H), high empirical content) against risky prediction survival P(E|H) to measure Popperian degree of corroboration.",
      params: [
        { key: "boldness", label: "Logical Boldness 1 − P(H)", type: "range", min: 0.1, max: 0.98, step: 0.02, value: 0.75 },
        { key: "sev_test", label: "Test Severity 1 − P(E)", type: "range", min: 0.1, max: 0.98, step: 0.02, value: 0.8 },
        { key: "accuracy", label: "Empirical Fit Proximity", type: "range", min: 0.2, max: 2.0, step: 0.05, value: 1.2 },
      ],
      challenges: [
        { id: "phil_pv_1", text: "Maximize Test Severity 1 − P(E) to see why surviving an improbable prediction yields high corroboration.", xp: 15 },
        { id: "phil_pv_2", text: "Drag the boldness cursor toward tautology (1−P(H) → 0) and verify zero empirical content.", xp: 15 },
        { id: "phil_pv_3", text: "Compare Bayesian posterior P(H|E) (which penalizes bold hypotheses) against Popperian corroboration.", xp: 15 },
      ],
    },
    {
      id: "phil_goodman_grue_induction", name: "Goodman's New Riddle of Induction: 'Green' vs 'Grue' Priors", domains: ["philosophy"],
      engine: "wave_fourier", formula: "Grue(x) ⟺ (t < T ∧ Green(x)) ∨ (t ≥ T ∧ Blue(x))",
      description: "Project competing inductive hypotheses across critical time t = T and see how Solomonoff algorithmic complexity and projectibility priors break the grue symmetry.",
      params: [
        { key: "kom_pen", label: "Kolmogorov Complexity Penalty λ", type: "range", min: 0.0, max: 2.5, step: 0.05, value: 1.0 },
        { key: "switch_t", label: "Critical Bleemer Time T", type: "range", min: 1.0, max: 5.0, step: 0.1, value: 2.8 },
        { key: "obs_n", label: "Observed Pre-T Emeralds N", type: "range", min: 1, max: 12, step: 1, value: 6 },
      ],
      challenges: [
        { id: "phil_gg_1", text: "Set Kolmogorov Penalty λ = 0 to observe identical likelihoods for 'All Green' and 'All Grue' before t = T.", xp: 15 },
        { id: "phil_gg_2", text: "Drag the temporal probe past t = T to witness the inductive divergence.", xp: 15 },
        { id: "phil_gg_3", text: "Raise Kolmogorov Penalty λ to weight natural projectible predicates over disjunctive time-indexed predicates.", xp: 15 },
      ],
    },
    {
      id: "phil_IIT_phi_consciousness", name: "Integrated Information Theory (IIT Φ) & Global Workspace Ignition", domains: ["philosophy"],
      engine: "network_graph", formula: "Φ = min_{MIP} D_EMD( p(Xₜ | Xₜ₋₁) ‖ Πₖ p(Mₖ,ₜ | Mₖ,ₜ₋₁) )",
      description: "Compare recurrent thalamocortical small-world networks against feedforward chains of equal gate count to compute irreducible causal integration Φ across the Minimum Information Partition.",
      params: [
        { key: "recurrence", label: "Recurrent Feedback Loops", type: "range", min: 1, max: 4, step: 1, value: 3 },
        { key: "modularity", label: "Inter-Module Coupling", type: "range", min: 0.2, max: 2.5, step: 0.1, value: 1.3 },
        { key: "noise_t", label: "Synaptic Indeterminism", type: "range", min: 0.05, max: 0.9, step: 0.05, value: 0.2 },
      ],
      challenges: [
        { id: "phil_iit_1", text: "Balance Modularity and Recurrence so the network is neither split into independent modules nor locked in uniform synchrony.", xp: 15 },
        { id: "phil_iit_2", text: "Click a cortical hub node to trigger a Dehaene Global Neuronal Workspace ignition broadcast.", xp: 15 },
        { id: "phil_iit_3", text: "Sever recurrent feedback (Recurrence = 1) to see integrated information Φ collapse toward zero.", xp: 15 },
      ],
    },
    {
      id: "phil_pascal_st_petersburg", name: "Pascal's Mugging, St. Petersburg Paradox & Bounded Utility", domains: ["philosophy"],
      engine: "kinetics_thermodynamics", formula: "𝔼[U] = Σ_{n=1}^∞ 2⁻ⁿ U(2ⁿ),  U_CARA(w) = 1 − e^{−αw},  U_CRRA(w) = ln(w)",
      description: "Evaluate unbounded expected-value gambles with tiny probabilities and see how logarithmic Bernoulli utility and bounded utility ceilings resolve fanatical dominance.",
      params: [
        { key: "risk_av", label: "Arrow-Pratt Risk Aversion α", type: "range", min: 0.05, max: 2.0, step: 0.05, value: 0.6 },
        { key: "prob_decay", label: "Tail Probability Decay β", type: "range", min: 0.2, max: 1.5, step: 0.05, value: 0.5 },
        { key: "wealth_w0", label: "Baseline Wealth Reserve W₀", type: "range", min: 0.2, max: 3.0, step: 0.1, value: 1.0 },
      ],
      challenges: [
        { id: "phil_ps_1", text: "Lower Risk Aversion α → 0.05 to watch certainty equivalent surge under nearly linear utility.", xp: 15 },
        { id: "phil_ps_2", text: "Drag the tail-truncation probe to inspect expected utility convergence under logarithmic utility.", xp: 15 },
        { id: "phil_ps_3", text: "Compare Solomonoff complexity-penalized priors against fixed-bound utility truncation.", xp: 15 },
      ],
    },
    {
      id: "phil_SEN_capabilities_pareto", name: "Amartya Sen's Liberal Paradox & Capabilities Frontier", domains: ["philosophy"],
      engine: "strategic_game", formula: "Pareto ∧ Minimal Liberty (|D_i| ≥ 2) ⇒ Social Preference Cycle",
      description: "Explore the tension between the Pareto principle and individual personal-sphere liberty (Prude vs Lewd reading Lady Chatterley's Lover).",
      params: [
        { key: "meddle", label: "Nosy / External Preference Weight", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.9 },
        { key: "rights_w", label: "Deontic Liberty Protection", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 1.0 },
        { key: "bargain", label: "Coasean Rights-Waiver Trade", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "phil_sen_1", text: "Increase Nosy Preference Weight > 1.0 to trigger Sen's cycle between Pareto optimality and minimal liberty.", xp: 15 },
        { id: "phil_sen_2", text: "Click the social-choice simplex to inspect outcomes when rights are treated as Nozickian side-constraints.", xp: 15 },
        { id: "phil_sen_3", text: "Filter out external/meddlesome preferences to reconcile Pareto efficiency with individual liberty.", xp: 15 },
      ],
    },
    {
      id: "phil_pearl_do_calculus", name: "Judea Pearl's Causal DAGs: Conditioning P(Y|X) vs Intervention P(Y|do(X))", domains: ["philosophy"],
      engine: "network_graph", formula: "P(y | do(x)) = Σ_z P(y | x, z) P(z)  (Back-Door Adjustment)",
      description: "Perform graphical surgery (deleting incoming arrows into X) to distinguish observational confounding and Simpson's Paradox from genuine causal intervention do(X).",
      params: [
        { key: "confound_z", label: "Confounder Strength Z → X,Y", type: "range", min: 1, max: 4, step: 1, value: 3 },
        { key: "causal_xy", label: "Direct Causal Effect X → Y", type: "range", min: 0.2, max: 2.5, step: 0.1, value: 1.1 },
        { key: "collider_b", label: "Collider Selection Bias", type: "range", min: 0.05, max: 0.9, step: 0.05, value: 0.25 },
      ],
      challenges: [
        { id: "phil_do_1", text: "Click Node X to apply the do(X=x) operator, severing incoming confounder arrows Z → X.", xp: 15 },
        { id: "phil_do_2", text: "Increase Confounder Strength to induce Simpson's reversal between P(Y|X) and P(Y|do(X)).", xp: 15 },
        { id: "phil_do_3", text: "Adjust Collider Bias to observe Berkson's paradox when conditioning on a common effect.", xp: 15 },
      ],
    },
    {
      id: "phil_kant_universalizability", name: "Kantian Categorical Imperative vs Tragedy of the Commons", domains: ["philosophy"],
      engine: "strategic_game", formula: "CI(m): Can maxim m be willed as a universal law without contradiction?",
      description: "Evaluate false-promising, free-riding, and resource extraction maxims when universalized across fraction α of agents vs individual instrumental rationality.",
      params: [
        { key: "kant_alpha", label: "Kantian Universalizer Share α", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.45 },
        { key: "trust_thresh", label: "Institutional Collapse Threshold", type: "range", min: 0.2, max: 0.9, step: 0.05, value: 0.55 },
        { key: "sanction", label: "Civic Reciprocity Norm", type: "range", min: 0.0, max: 1.5, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "phil_kt_1", text: "Lower Kantian Share α below the Collapse Threshold to observe Contradiction in Conception (the practice of promising dissolves).", xp: 15 },
        { id: "phil_kt_2", text: "Click the strategy simplex to test stability of mixed Kantian-Utilitarian populations.", xp: 15 },
        { id: "phil_kt_3", text: "Raise Kantian Share α above 0.7 to achieve the Kingdom of Ends Pareto optimum.", xp: 15 },
      ],
    },
    {
      id: "phil_free_will_libet_veto", name: "Libet Readiness Potential, Schurger Stochastic Accumulator & Conscious Veto", domains: ["philosophy"],
      engine: "linguistic_cognitive", formula: "dx = (I − k x) dt + σ dWₜ,  RP = 𝔼[x(t) | x(0) = θ_thresh]",
      description: "Simulate bounded neural drift-diffusion accumulation to show how backward-aligning trials on threshold crossings creates an apparent pre-conscious Readiness Potential.",
      params: [
        { key: "thresh_th", label: "Motor Action Threshold θ", type: "range", min: 0.2, max: 1.0, step: 0.02, value: 0.65 },
        { key: "veto_win", label: "Pre-Motor Veto Window ('Free Won't')", type: "range", min: 0.0, max: 1.0, step: 0.02, value: 0.35 },
        { key: "noise_s", label: "Spontaneous Neural Fluctuation σ", type: "range", min: 0.1, max: 1.0, step: 0.02, value: 0.5 },
      ],
      challenges: [
        { id: "phil_fw_1", text: "Adjust Neural Fluctuation σ to see how stochastic crossings produce a smooth average Readiness Potential ramp.", xp: 15 },
        { id: "phil_fw_2", text: "Click inside the decision space to trigger a conscious 'Free Won't' veto before the point of no return.", xp: 15 },
        { id: "phil_fw_3", text: "Compare compatibilist reasons-responsiveness against hard-incompatibilist determinism.", xp: 15 },
      ],
    },

    // =========================================================================
    // 7. LANGUAGES & LINGUISTICS (20 simulations)
    // =========================================================================
    {
      id: "lang_formant_vowel_chart", name: "Acoustic Phonetics: IPA Vowel Trapezoid & F₁/F₂ Source-Filter Synthesis", domains: ["languages"],
      engine: "linguistic_cognitive", formula: "S(f) = |G(f)| · |H_tract(f; F₁, F₂, F₃)|",
      description: "Synthesize cardinal vowels (/i, e, a, ɑ, o, u, ə/) by dragging tongue height (inverse F₁) and tongue advancement (F₂ − F₁) inside the acoustic vowel space.",
      params: [
        { key: "tract_len", label: "Vocal Tract Length L (cm)", type: "range", min: 13.0, max: 20.0, step: 0.2, value: 17.5 },
        { key: "lip_round", label: "Lip Rounding Perturbation ( lowers F₂/F₃)", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.25 },
        { key: "glottal_f0", label: "Glottal Pitch F₀ (Hz)", type: "range", min: 85, max: 280, step: 5, value: 135 },
      ],
      challenges: [
        { id: "lang_fv_1", text: "Click/drag to the high-front corner /i/ (low F₁ ≈ 280 Hz, high F₂ ≈ 2300 Hz).", xp: 15 },
        { id: "lang_fv_2", text: "Increase Lip Rounding at high-front position to shift /i/ toward rounded /y/ via F₂ lowering.", xp: 15 },
        { id: "lang_fv_3", text: "Shorten Vocal Tract Length L to observe uniform formant scaling across all vowels.", xp: 15 },
      ],
    },
    {
      id: "lang_vot_categorical_perception", name: "Voice Onset Time (VOT) Continuum & Categorical Perception S-Curve", domains: ["languages"],
      engine: "kinetics_thermodynamics", formula: "P(/p/ | VOT) = 1 / (1 + exp(−k (VOT − θ_b)))",
      description: "Sweep Voice Onset Time from pre-voiced (−60 ms /b/) through unaspirated (0 ms) to aspirated (+60 ms /pʰ/) and compare Spanish vs English vs Thai phoneme boundaries.",
      params: [
        { key: "vot_bound", label: "Language Boundary θ_b (ms)", type: "range", min: 0.1, max: 0.9, step: 0.02, value: 0.45 },
        { key: "slope_k", label: "Categorical Sharpness k", type: "range", min: 0.5, max: 4.0, step: 0.1, value: 2.2 },
        { key: "f0_cue", label: "Onset F₀ Secondary Cue Weight", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "lang_vot_1", text: "Drag the VOT stimulus cursor across θ_b to observe the discrimination peak right at the category boundary.", xp: 15 },
        { id: "lang_vot_2", text: "Shift Boundary θ_b left for Romance (0 ms) vs right for Germanic (+25 ms) stop perception.", xp: 15 },
        { id: "lang_vot_3", text: "Raise Onset F₀ Cue Weight to observe trading relations in tonogenesis.", xp: 15 },
      ],
    },
    {
      id: "lang_grimm_verner_sound_shift", name: "Historical Linguistics: Grimm's Law, Verner's Law & Great Vowel Shift", domains: ["languages"],
      engine: "linguistic_cognitive", formula: "PIE *bh → *b → *p → PGmc *f (Chain Shift Pull/Push)",
      description: "Simulate diachronic push-chain and drag-chain trajectories in phonological feature space while preserving functional minimal-pair dispersion.",
      params: [
        { key: "chain_push", label: "Diphthongization / Push Pressure", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.55 },
        { key: "stress_pos", label: "PIE Mobile Accent (Verner's Conditioning)", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.4 },
        { key: "dispersion", label: "Liljencrants-Lindblom Margin", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.6 },
      ],
      challenges: [
        { id: "lang_gv_1", text: "Increase Push Pressure to watch long mid vowels raise (/eː/ → /iː/) as high vowels diphthongize (/iː/ → /aɪ/).", xp: 15 },
        { id: "lang_gv_2", text: "Click the phonological space to trace a Proto-Indo-European root through Grimm's and Verner's laws.", xp: 15 },
        { id: "lang_gv_3", text: "Toggle PIE Mobile Accent to voice medial fricatives (*t → *θ → *ð) under Verner's Law.", xp: 15 },
      ],
    },
    {
      id: "lang_optimality_theory_tableau", name: "Optimality Theory (OT) Constraint Ranking & Factorial Typology", domains: ["languages"],
      engine: "systems_hardware", formula: "Cand* = argmin_{c ∈ Gen(ur)} Σᵢ 2^{−π(i)} Viol_i(c)",
      description: "Re-rank universal Markedness (ONSET, *CODA, *COMPLEX) vs Faithfulness (MAX-IO, DEP-IO) constraints to derive cross-linguistic syllable structures (CV vs CVC vs CCVCC).",
      params: [
        { key: "mark_rank", label: "Markedness Dominance (*CODA / ONSET)", type: "range", min: 1, max: 10, step: 1, value: 6 },
        { key: "max_faith", label: "Deletion Penalty (MAX-IO)", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.6 },
        { key: "dep_faith", label: "Epenthesis Penalty (DEP-IO)", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "lang_ot_1", text: "Rank Markedness above both MAX-IO and DEP-IO to force strict CV open syllables (e.g. Hawaiian/Japanese loanword adaptation).", xp: 15 },
        { id: "lang_ot_2", text: "Click a violation cell in the tableau to compare deletion (MAX violation) vs vowel insertion (DEP violation).", xp: 15 },
        { id: "lang_ot_3", text: "Rank MAX-IO and DEP-IO above Markedness to allow complex codas (English/Russian).", xp: 15 },
      ],
    },
    {
      id: "lang_zipf_heaps_menzerath", name: "Quantitative Linguistics: Zipf's Law, Heaps' Vocabulary Growth & Least Effort", domains: ["languages"],
      engine: "kinetics_thermodynamics", formula: "f(r) ∝ 1 / (r + β)^α,  V(N) = K N^γ,  I = −λ H(W|M) + (1−λ) H(W)",
      description: "Simulate Zipf's principle of least effort balancing speaker unification (one word means everything) against listener diversification (unique word per meaning).",
      params: [
        { key: "speaker_lam", label: "Listener vs Speaker Effort λ", type: "range", min: 0.1, max: 0.95, step: 0.02, value: 0.48 },
        { key: "mandel_b", label: "Mandelbrot High-Freq Shift β", type: "range", min: 0.1, max: 3.0, step: 0.1, value: 1.2 },
        { key: "zipf_alpha", label: "Zipf Power Exponent α", type: "range", min: 0.5, max: 2.0, step: 0.05, value: 1.05 },
      ],
      challenges: [
        { id: "lang_zh_1", text: "Tune Effort Balance λ ≈ 0.48 (the phase transition point) where power-law Zipf scaling α ≈ 1.0 emerges.", xp: 15 },
        { id: "lang_zh_2", text: "Drag the rank probe along the Zipf-Mandelbrot curve to inspect hapax legomena (f=1) proportion.", xp: 15 },
        { id: "lang_zh_3", text: "Push λ → 0.1 or 0.9 to observe lexicon collapse vs unbounded synonym explosion.", xp: 15 },
      ],
    },
    {
      id: "lang_chomsky_xbar_movement", name: "Generative Syntax: X-Bar Phrase Structure, Wh-Movement & Subjacency Islands", domains: ["languages"],
      engine: "network_graph", formula: "[CP Whᵢ [C' C [TP DP [T' T [VP V tᵢ ]]]]]",
      description: "Build hierarchical syntactic constituency trees, trigger cyclic A-bar wh-movement to Spec-CP, and test Ross Island / Minimal Link Condition barriers.",
      params: [
        { key: "head_dir", label: "Head Directionality (SVO ↔ SOV)", type: "range", min: 1, max: 4, step: 1, value: 2 },
        { key: "move_rate", label: "EPP / Wh-Movement Strength", type: "range", min: 0.3, max: 2.5, step: 0.1, value: 1.5 },
        { key: "island_b", label: "Phase / Island Barrier Strictness", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.4 },
      ],
      challenges: [
        { id: "lang_xb_1", text: "Click a lower argument node to launch cyclic wh-movement through intermediate Spec-CP phase edges.", xp: 15 },
        { id: "lang_xb_2", text: "Switch Head Directionality to compare head-initial English vs head-final Japanese mirror trees.", xp: 15 },
        { id: "lang_xb_3", text: "Raise Island Barrier Strictness to block extraction out of a Complex NP or Adjunct Island.", xp: 15 },
      ],
    },
    {
      id: "lang_ergative_absolutive_align", name: "Morphosyntactic Alignment: Nominative-Accusative vs Ergative-Absolutive & Split-Ergativity", domains: ["languages"],
      engine: "strategic_game", formula: "Nom-Acc: S = A ≠ O  vs  Erg-Abs: S = O ≠ A  (Silverstein Hierarchy)",
      description: "Map transitive agent (A), transitive patient (O), and intransitive subject (S) across case-marking systems and trigger Silverstein animacy/tense split-ergativity.",
      params: [
        { key: "animacy", label: "NP Animacy Hierarchy Position", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.45 },
        { key: "perf_asp", label: "Perfective Aspect / Past Tense", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.6 },
        { key: "disc_top", label: "Topic Empathy / Discourse Salience", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "lang_ea_1", text: "Raise Perfective Aspect (e.g. Hindi/Georgian past perfective) to shift alignment into Ergative-Absolutive.", xp: 15 },
        { id: "lang_ea_2", text: "Click the S-A-O alignment triangle to compare Tripartite (S≠A≠O) vs Austronesian voice systems.", xp: 15 },
        { id: "lang_ea_3", text: "Slide NP Animacy to 1st/2nd person pronouns to verify Silverstein's nominative-accusative bias at the top of the hierarchy.", xp: 15 },
      ],
    },
    {
      id: "lang_tonogenesis_pitch_accent", name: "Tonogenesis, Register Split & Autosegmental Downstep Terracing", domains: ["languages"],
      engine: "wave_fourier", formula: "Voiceless Onset (*pa) → High Tone [pá],  Voiced (*ba) → Low Tone [pà]",
      description: "Track how loss of onset voicing contrasts and coda laryngeals (*-ʔ, *-h) transphonologizes microprosodic F₀ perturbations into lexical contour tones.",
      params: [
        { key: "devoice", label: "Onset Devoicing Completion", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 1.1 },
        { key: "coda_glott", label: "Coda Glottal/Pharyngeal Contour", type: "range", min: 0.1, max: 2.5, step: 0.05, value: 1.2 },
        { key: "downstep", label: "H-L-H Autosegmental Downstep", type: "range", min: 1, max: 8, step: 1, value: 4 },
      ],
      challenges: [
        { id: "lang_tg_1", text: "Increase Onset Devoicing to watch a 3-tone system double into a 6-tone High/Low register system (Middle Chinese / Vietnamese).", xp: 15 },
        { id: "lang_tg_2", text: "Drag the pitch contour probe to measure terraced H-tone downstep (!H) across floating L tones.", xp: 15 },
        { id: "lang_tg_3", text: "Adjust Coda Glottalization to contrast rising (*-ʔ) vs falling (*-h) contour genesis.", xp: 15 },
      ],
    },
    {
      id: "lang_wals_greenberg_universals", name: "Linguistic Typology: Greenberg's Implicational Universals & WALS Correlated Evolution", domains: ["languages"],
      engine: "network_graph", formula: "SOV ⇒ Postpositions ∧ Gen-N (Harmonic Head-Ordering)",
      description: "Simulate continuous-time Markov evolution of typological features (OV/VO, Prep/Postp, Rel-N/N-Rel) on a phylogenetic language family tree (Dunn/Pagel model).",
      params: [
        { key: "harmony_k", label: "Processing Harmony Selection", type: "range", min: 1, max: 4, step: 1, value: 3 },
        { key: "areal_diff", label: "Sprachbund Areal Contact Rate", type: "range", min: 0.2, max: 2.5, step: 0.1, value: 1.0 },
        { key: "branch_mut", label: "Lineage Drift Rate μ", type: "range", min: 0.1, max: 0.9, step: 0.05, value: 0.3 },
      ],
      challenges: [
        { id: "lang_wu_1", text: "Increase Processing Harmony to cluster languages into harmonic OV+Postp vs VO+Prep attractors.", xp: 15 },
        { id: "lang_wu_2", text: "Click a language node to induce an areal Sprachbund contact wave (e.g. Balkan/Mesoamerican convergence).", xp: 15 },
        { id: "lang_wu_3", text: "Verify Hawkins' Disharmonic Processing Penalty on mixed VO+Postp grammars.", xp: 15 },
      ],
    },
    {
      id: "lang_garden_path_surprisal", name: "Psycholinguistics: Levy Surprisal Theory & Garden-Path Eye-Tracking", domains: ["languages"],
      engine: "kinetics_thermodynamics", formula: "RT(wᵢ) ∝ −log₂ P(wᵢ | w₁...wᵢ₋₁) = D_KL(P(T|w₁..ᵢ) ‖ P(T|w₁..ᵢ₋₁))",
      description: "Model incremental human reading times and regressive saccades on ambiguous garden-path sentences ('The horse raced past the barn fell') via parallel probabilistic beam pruning.",
      params: [
        { key: "beam_w", label: "Working-Memory Beam Width B", type: "range", min: 0.1, max: 1.5, step: 0.05, value: 0.45 },
        { key: "mv_prior", label: "Main-Verb vs Reduced-Relative Bias", type: "range", min: 0.1, max: 1.5, step: 0.05, value: 0.8 },
        { key: "dep_len", label: "Gibson Dependency Locality Cost", type: "range", min: 0.2, max: 3.0, step: 0.1, value: 1.3 },
      ],
      challenges: [
        { id: "lang_gp_1", text: "Narrow Working-Memory Beam B to prune the reduced-relative parse early, causing a massive surprisal spike at 'fell'.", xp: 15 },
        { id: "lang_gp_2", text: "Drag the word-position probe to compare center-embedding memory load vs right-branching structures.", xp: 15 },
        { id: "lang_gp_3", text: "Provide an animate/inanimate semantic cue ('The evidence examined by the lawyer...') to eliminate the garden path.", xp: 15 },
      ],
    },
    {
      id: "lang_labov_sociolinguistic_s", name: "Sociolinguistics: Labovian S-Curve Diffusion & Prestige/Covert Network Spread", domains: ["languages"],
      engine: "field_lattice", formula: "dp/dt = s p (1 − p) + Σ_j w_{ij} (p_j − p_i)",
      description: "Simulate sound change in progress (e.g. Martha's Vineyard centralization or Northern Cities Shift) across social-class stratification and Milroy weak-tie bridges.",
      params: [
        { key: "prestige_s", label: "Overt / Covert Prestige Bias s", type: "range", min: 0.02, max: 0.08, step: 0.002, value: 0.046 },
        { key: "weak_ties", label: "Inter-Cluster Weak-Tie Bridges", type: "range", min: 0.04, max: 0.075, step: 0.002, value: 0.059 },
        { key: "mobility", label: "Geographic Gravity Diffusion D", type: "range", min: 0.06, max: 0.32, step: 0.01, value: 0.18 },
      ],
      challenges: [
        { id: "lang_lb_1", text: "Tune Prestige Bias s and Weak-Tie Bridges to trigger the steep mid-range S-curve acceleration (20% → 80%).", xp: 15 },
        { id: "lang_lb_2", text: "Click on the speech-community map to seed an urban linguistic innovation hub (Trudgill gravity model).", xp: 15 },
        { id: "lang_lb_3", text: "Observe dense multiplex local networks resisting external standard-dialect leveling.", xp: 15 },
      ],
    },
    {
      id: "lang_grice_rsa_pragmatics", name: "Rational Speech Acts (RSA): Bayesian Gricean Scalar Implicature", domains: ["languages"],
      engine: "neural_manifold", formula: "P_{L1}(s|u) ∝ P_{S1}(u|s) P(s),  P_{S1}(u|s) ∝ exp(α [ln P_{L0}(s|u) − C(u)])",
      description: "Compute recursive pragmatic listener L₁ beliefs ('some' → 'not all') from literal semantics L₀ and speaker rationality α.",
      params: [
        { key: "alpha_rat", label: "Speaker Pragmatic Optimality α", type: "range", min: 0.2, max: 8.0, step: 0.2, value: 3.5 },
        { key: "cost_all", label: "Utterance Effort Cost C('all')", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.2 },
        { key: "qud_focus", label: "Question Under Discussion (QUD) Weight", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.8 },
      ],
      challenges: [
        { id: "lang_rsa_1", text: "Increase Speaker Optimality α to strengthen the scalar implicature P(state=3/3 | 'some') → 0.", xp: 15 },
        { id: "lang_rsa_2", text: "Click the speaker-listener probability matrix to inspect L₀ literal vs L₁ pragmatic posteriors.", xp: 15 },
        { id: "lang_rsa_3", text: "Raise Utterance Cost C('all') to see why high cost weakens the scalar inference.", xp: 15 },
      ],
    },
    {
      id: "lang_montague_lambda_type", name: "Formal Semantics: Montague Type-Driven λ-Calculus & Quantifier Raising", domains: ["languages"],
      engine: "network_graph", formula: "⟦every⟧ = λP_{⟨e,t⟩}.λQ_{⟨e,t⟩}.∀x(P(x) → Q(x)),  Type: ⟨⟨e,t⟩,⟨⟨e,t⟩,t⟩⟩",
      description: "Compose generalized quantifiers (⟨⟨e,t⟩,⟨⟨e,t⟩,t⟩⟩) via Functional Application and Quantifier Raising (QR) to resolve surface vs inverse scope ('Every linguist speaks a language').",
      params: [
        { key: "qr_height", label: "Quantifier Raising (QR) Landing Site", type: "range", min: 1, max: 4, step: 1, value: 2 },
        { key: "dist_pref", label: "Surface (∀∃) vs Inverse (∃∀) Bias", type: "range", min: 0.2, max: 2.5, step: 0.1, value: 1.2 },
        { key: "intension", label: "Intensional World Binding (⟨s,τ⟩)", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.4 },
      ],
      challenges: [
        { id: "lang_mt_1", text: "Raise QR Landing Site to invert quantifier scope from ∀x∃y to ∃y∀x.", xp: 15 },
        { id: "lang_mt_2", text: "Click a semantic composition node to step through β-reduction (λx.M)(N) ⊳ M[x:=N].", xp: 15 },
        { id: "lang_mt_3", text: "Toggle Intensional World Binding to distinguish de dicto vs de re opaque beliefs.", xp: 15 },
      ],
    },
    {
      id: "lang_bilingual_code_switching", name: "Bilingual Lexical Access (BIA+), Inhibitory Control & Matrix Language Frame", domains: ["languages"],
      engine: "phase_attractor", formula: "da_L1/dt = I_L1 − γ a_L2 − δ a_L1,  Code-Switch Cost = τ_inhibit",
      xLabel: "L1 Lexicon Activation", yLabel: "L2 Lexicon Activation",
      description: "Simulate parallel non-selective bilingual activation, Green's Inhibitory Control model, and asymmetric L1↔L2 code-switching reaction-time costs.",
      params: [
        { key: "prof_l2", label: "L2 Relative Proficiency", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.65 },
        { key: "inhib_g", label: "Prefrontal Executive Inhibition γ", type: "range", min: 0.1, max: 2.5, step: 0.05, value: 1.1 },
        { key: "cognate", label: "Orthographic/Phonological Cognate Overlap", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.4 },
      ],
      challenges: [
        { id: "lang_bi_1", text: "Observe Meuter & Allport's paradoxical switch-cost asymmetry: switching back into dominant L1 requires overcoming stronger prior inhibition.", xp: 15 },
        { id: "lang_bi_2", text: "Click the activation plane to trigger an intra-sentential code-switch under Myers-Scotton's Equivalence Constraint.", xp: 15 },
        { id: "lang_bi_3", text: "Increase Cognate Overlap to observe cross-linguistic facilitation.", xp: 15 },
      ],
    },
    {
      id: "lang_moraic_metrical_stress", name: "Metrical Phonology: Moraic Trochees, Iambic Lengthening & Stress Grids", domains: ["languages"],
      engine: "systems_hardware", formula: "Heavy Syllable (CVV/CVC) = μμ,  Light (CV) = μ  (Weight-to-Stress)",
      description: "Parse prosodic words into binary moraic or syllabic feet (Trochaic vs Iambic, L→R vs R→L) with extrametricality and Clash Avoidance.",
      params: [
        { key: "foot_type", label: "Foot Inventory (Trochee ↔ Iamb)", type: "range", min: 1, max: 8, step: 1, value: 3 },
        { key: "wsp_weight", label: "Weight-to-Stress Sensitivity (CVC=μμ)", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.7 },
        { key: "extramet", label: "Final Syllable Extrametricality ⟨σ⟩", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "lang_mm_1", text: "Enable Weight-to-Stress + Final Extrametricality to derive the Classical Latin/Arabic antepenultimate/penultimate stress rule.", xp: 15 },
        { id: "lang_mm_2", text: "Click a syllable slot in the metrical grid to toggle coda weight (CV ↔ CVC) and watch primary stress shift.", xp: 15 },
        { id: "lang_mm_3", text: "Compare Hayes' Iambic/Trochaic Law (durational contrast in iambs vs intensity in trochees).", xp: 15 },
      ],
    },
    {
      id: "lang_agglutinative_templatic_morph", name: "Morphological Typology: Agglutinative Affix Ordering vs Root-and-Pattern", domains: ["languages"],
      engine: "systems_hardware", formula: "Index of Synthesis (Morphemes/Word) × Index of Fusion (Meanings/Morpheme)",
      description: "Locate languages in Sapir/Comrie's 2D morphological space (Isolating, Agglutinative, Fusional, Polysynthetic) and verify Bybee/Baker Mirror Principle affix ordering.",
      params: [
        { key: "synthesis", label: "Index of Synthesis (M / W)", type: "range", min: 1.0, max: 5.0, step: 0.1, value: 2.8 },
        { key: "fusion", label: "Index of Fusion / Allomorphy", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.25 },
        { key: "harmony", label: "Palatal / Rounding Vowel Harmony", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.7 },
      ],
      challenges: [
        { id: "lang_am_1", text: "Set high Synthesis + low Fusion + high Vowel Harmony to model Turkish/Finnish agglutination.", xp: 15 },
        { id: "lang_am_2", text: "Click a morpheme slot to test Baker's Mirror Principle (Valency/Voice closer to root than Tense/Agreement).", xp: 15 },
        { id: "lang_am_3", text: "Increase Fusion to collapse separate Tense and Person slots into a single cumulative portmanteau morph.", xp: 15 },
      ],
    },
    {
      id: "lang_swadesh_glottochronology", name: "Computational Phylogenetics: Swadesh Cognate Decay & Bayesian Clock", domains: ["languages"],
      engine: "kinetics_thermodynamics", formula: "C(t) = e^{−2 r t},  t = −ln(C) / (2r)",
      description: "Estimate divergence time t between sister languages from shared Swadesh-100 basic vocabulary cognates while correcting for Pagel's frequency-dependent replacement rates.",
      params: [
        { key: "ret_rate", label: "Millennial Retention Rate r₀", type: "range", min: 0.05, max: 0.35, step: 0.01, value: 0.14 },
        { key: "borrowing", label: "Horizontal Loanword Contamination", type: "range", min: 0.0, max: 0.5, step: 0.02, value: 0.08 },
        { key: "rate_het", label: "Gamma Rate Heterogeneity α", type: "range", min: 0.3, max: 3.0, step: 0.1, value: 1.1 },
      ],
      challenges: [
        { id: "lang_sw_1", text: "Drag the time-depth probe to 3,000 years and compute expected shared cognates C = e^{−2rt}.", xp: 15 },
        { id: "lang_sw_2", text: "Increase Rate Heterogeneity α to see why ultra-conserved words ('two', 'I', 'water') extend deep phylogenetic signal beyond 6,000 years.", xp: 15 },
        { id: "lang_sw_3", text: "Introduce Horizontal Borrowing and observe how unscreened loans bias divergence dates younger.", xp: 15 },
      ],
    },
    {
      id: "lang_sign_phonology_cheremes", name: "Sign Language Phonology: Handshape, Location, Movement & Non-Manuals", domains: ["languages"],
      engine: "quantum_orbital", formula: "Sign = (Handshape H, Location L, Movement M, Orientation O, NMS)",
      description: "Manipulate Stokoe/Sandler simultaneous sign parameters in 3D signing space and verify Battison's Symmetry and Dominance constraints on two-handed signs.",
      params: [
        { key: "dom_hand", label: "Two-Handed Symmetry / Dominance", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.6 },
        { key: "move_arc", label: "Path vs Trill Movement Frequency", type: "range", min: 0.5, max: 4.0, step: 0.1, value: 1.8 },
        { key: "nms_scope", label: "Non-Manual Brow/Head Scope", type: "range", min: 0.0, max: 1.0, step: 0.05, value: 0.5 },
      ],
      challenges: [
        { id: "lang_sl_1", text: "Change a single parameter (Location or Orientation) while holding others fixed to form a sign minimal pair (e.g. ASL SUMMER/UGLY/DRY).", xp: 15 },
        { id: "lang_sl_2", text: "Click the 3D signing space to assign a locus for pronominal indexing and verb agreement.", xp: 15 },
        { id: "lang_sl_3", text: "Verify Battison's Dominance Condition when the non-dominant hand acts as a stationary base.", xp: 15 },
      ],
    },
    {
      id: "lang_color_berlin_kay_ib", name: "Semantic Typology: Berlin-Kay Color Hierarchy & Information Bottleneck", domains: ["languages"],
      engine: "linguistic_cognitive", formula: "L_IB[q(w|c)] = I(W; C) − β I(W; M)  (Zaslavsky et al.)",
      description: "Partition perceptual CIELAB space into k lexical color categories along the Pareto Information Bottleneck curve to derive the Berlin-Kay evolutionary sequence.",
      params: [
        { key: "ib_beta", label: "Communicative Complexity Tradeoff β", type: "range", min: 0.1, max: 1.0, step: 0.02, value: 0.55 },
        { key: "warm_sal", label: "Warm-Cool Communicative Need p(c)", type: "range", min: 0.1, max: 1.0, step: 0.05, value: 0.65 },
        { key: "lex_k", label: "Basic Color Term Inventory k", type: "range", min: 2, max: 11, step: 1, value: 5 },
      ],
      challenges: [
        { id: "lang_bk_1", text: "Sweep Inventory k from 2 (Dark/Light) → 3 (+Red) → 5 (+Yellow, Green/Blue 'grue') → 6 (splitting Blue from Green).", xp: 15 },
        { id: "lang_bk_2", text: "Click perceptual space to inspect category centroids and focal-color naming entropy.", xp: 15 },
        { id: "lang_bk_3", text: "Tune Complexity β to verify that natural languages cluster near the theoretical IB optimality frontier.", xp: 15 },
      ],
    },
    {
      id: "lang_child_statistical_seg", name: "Child Language Acquisition: Saffran Transitional Probability & Poverty of Stimulus", domains: ["languages"],
      engine: "wave_fourier", formula: "TP(Y | X) = Count(XY) / Count(X),  Word Boundary at local TP minima",
      description: "Segment continuous unspaced infant-directed speech into word candidates using dip detection in syllable-to-syllable Transitional Probabilities TP(σₜ | σₜ₋₁).",
      params: [
        { key: "tp_thresh", label: "TP Dip Segmentation Threshold", type: "range", min: 0.2, max: 1.5, step: 0.05, value: 0.65 },
        { key: "prosody_w", label: "Trochaic Stress Cue Weighting", type: "range", min: 0.0, max: 2.0, step: 0.05, value: 0.8 },
        { key: "vocab_sz", label: "Utterance Vocabulary Entropy", type: "range", min: 2, max: 10, step: 1, value: 5 },
      ],
      challenges: [
        { id: "lang_cs_1", text: "Tune TP Threshold to separate high within-word probability (TP ≈ 1.0) from low between-word dips (TP ≈ 0.33).", xp: 15 },
        { id: "lang_cs_2", text: "Drag the speech-stream probe to locate word boundaries where TP drops below local expectation.", xp: 15 },
        { id: "lang_cs_3", text: "Combine Trochaic Stress cues with statistical TP dips to resolve ambiguous segmentation.", xp: 15 },
      ],
    },
  ];

  window.SelfTaughtSims.registerBatch(SPECS);
})();
