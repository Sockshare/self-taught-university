// 240 Interactive Arcade Simulations across the 12 new Self-Taught University Faculties (20 per domain)
(function () {
  if (!window.SelfTaughtSims || !window.SelfTaughtSims.registerBatch) return;
  window.SelfTaughtSims.registerBatch([
  {
    "id": "sec_rsa_lattice",
    "name": "RSA & Lattice Trapdoor Cryptanalysis",
    "domains": [
      "cybersecurity"
    ],
    "engine": "systems_hardware",
    "formula": "c ≡ m^e (mod N),  ||B·v|| ≤ λ₁(L)",
    "description": "Inspect modular exponentiation cycles, prime factorization timing, and LLL lattice basis reduction.",
    "params": [
      {
        "key": "key_bits",
        "label": "Modulus Bit Depth",
        "min": 64,
        "max": 4096,
        "step": 64,
        "default": 1024,
        "type": "range",
        "value": 1024
      },
      {
        "key": "pub_exp",
        "label": "Public Exponent Weight",
        "min": 1,
        "max": 16,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "lattice_dim",
        "label": "Lattice Dimension n",
        "min": 2,
        "max": 64,
        "step": 2,
        "default": 16,
        "type": "range",
        "value": 16
      }
    ]
  },
  {
    "id": "sec_elliptic_ecdh",
    "name": "Elliptic Curve Diffie–Hellman (Curve25519)",
    "domains": [
      "cybersecurity"
    ],
    "engine": "phase_attractor",
    "formula": "y² ≡ x³ + 486662x² + x (mod 2²⁵⁵−19)",
    "description": "Visualize scalar point multiplication k·G and Montgomery ladder constant-time group law.",
    "params": [
      {
        "key": "scalar_k",
        "label": "Private Scalar k",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 37,
        "type": "range",
        "value": 37
      },
      {
        "key": "curve_a",
        "label": "Curve Parameter A",
        "min": -5,
        "max": 25,
        "step": 0.5,
        "default": 8.0,
        "type": "range",
        "value": 8.0
      },
      {
        "key": "prime_mod",
        "label": "Finite Field Modulus p",
        "min": 17,
        "max": 257,
        "step": 2,
        "default": 97,
        "type": "range",
        "value": 97
      }
    ]
  },
  {
    "id": "sec_aes_avalanche",
    "name": "AES-GCM SubBytes & Avalanche Diffusion Lab",
    "domains": [
      "cybersecurity"
    ],
    "engine": "systems_hardware",
    "formula": "S(x) = A·x⁻¹ ⊕ 0x63 ∈ GF(2⁸)",
    "description": "Flip a single plaintext or key bit and watch strict avalanche criterion propagate across substitution-permutation rounds.",
    "params": [
      {
        "key": "rounds",
        "label": "Cipher Rounds",
        "min": 1,
        "max": 14,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "key_entropy",
        "label": "Key Schedule Entropy",
        "min": 0,
        "max": 100,
        "step": 1,
        "default": 85,
        "type": "range",
        "value": 85
      },
      {
        "key": "fault_bit",
        "label": "Injected Bit Flip Index",
        "min": 0,
        "max": 63,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      }
    ]
  },
  {
    "id": "sec_zero_knowledge_snark",
    "name": "zk-SNARK Polynomial Commitment & Verifier",
    "domains": [
      "cybersecurity"
    ],
    "engine": "strategic_game",
    "formula": "e(π_A, π_B) = e(g^α, h^β)·e(L_pub, h)·e(π_C, h^γ)",
    "description": "Test soundness, completeness, and zero-knowledge witness blinding in quadratic arithmetic programs.",
    "params": [
      {
        "key": "constraints",
        "label": "R1CS Gate Count",
        "min": 10,
        "max": 1000,
        "step": 10,
        "default": 240,
        "type": "range",
        "value": 240
      },
      {
        "key": "challenge_entropy",
        "label": "Verifier Challenge Bits",
        "min": 8,
        "max": 256,
        "step": 8,
        "default": 128,
        "type": "range",
        "value": 128
      },
      {
        "key": "cheating_prob",
        "label": "Adversary Forgery Effort",
        "min": 0,
        "max": 100,
        "step": 1,
        "default": 15,
        "type": "range",
        "value": 15
      }
    ]
  },
  {
    "id": "sec_stack_rop_chain",
    "name": "Stack Smashing, Canary & ROP Gadget Chain",
    "domains": [
      "cybersecurity"
    ],
    "engine": "systems_hardware",
    "formula": "RSP → [Gadget₁] → [pop rdi; ret] → [bin_sh]",
    "description": "Analyze stack frame layout, ASLR entropy, stack canaries, and Return-Oriented Programming gadget chaining.",
    "params": [
      {
        "key": "buffer_fill",
        "label": "Payload Overflow Bytes",
        "min": 0,
        "max": 256,
        "step": 4,
        "default": 88,
        "type": "range",
        "value": 88
      },
      {
        "key": "aslr_bits",
        "label": "ASLR Slide Entropy Bits",
        "min": 0,
        "max": 32,
        "step": 1,
        "default": 16,
        "type": "range",
        "value": 16
      },
      {
        "key": "canary_check",
        "label": "StackGuard Canary Strictness",
        "min": 0,
        "max": 100,
        "step": 1,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "sec_heap_tcache_fengshui",
    "name": "Heap Allocator & tcache Bin Feng Shui",
    "domains": [
      "cybersecurity"
    ],
    "engine": "systems_hardware",
    "formula": "chunk → [prev_size | size|A|M|P | fd | bk]",
    "description": "Explore glibc ptmalloc tcache bins, fastbin coalescing, and use-after-free pointer poisoning.",
    "params": [
      {
        "key": "alloc_rate",
        "label": "Allocation Burst Rate",
        "min": 1,
        "max": 50,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      },
      {
        "key": "chunk_size",
        "label": "Target Chunk Size (B)",
        "min": 32,
        "max": 1024,
        "step": 16,
        "default": 128,
        "type": "range",
        "value": 128
      },
      {
        "key": "free_ratio",
        "label": "Deallocation / UAF Hazard",
        "min": 0,
        "max": 100,
        "step": 1,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "sec_spectre_cache_probe",
    "name": "Spectre Transient Execution & Flush+Reload",
    "domains": [
      "cybersecurity"
    ],
    "engine": "wave_fourier",
    "formula": "Δt_hit ≪ Δt_miss  ⇒  Secret[k] leaked via L1D",
    "description": "Measure L1 cache access latency histograms to recover speculatively accessed secret bytes.",
    "params": [
      {
        "key": "branch_train",
        "label": "Branch Predictor Training",
        "min": 1,
        "max": 32,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "cache_noise",
        "label": "System Bus Jitter",
        "min": 0,
        "max": 100,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      },
      {
        "key": "spec_window",
        "label": "Reorder Buffer Window",
        "min": 16,
        "max": 256,
        "step": 8,
        "default": 128,
        "type": "range",
        "value": 128
      }
    ]
  },
  {
    "id": "sec_power_dpa_trace",
    "name": "Differential Power Analysis (DPA) Side-Channel",
    "domains": [
      "cybersecurity"
    ],
    "engine": "wave_fourier",
    "formula": "Δ_DPA(t) = ⟨P(t) | b=1⟩ − ⟨P(t) | b=0⟩",
    "description": "Correlate Hamming weight power traces against S-Box key hypotheses to extract cryptographic keys.",
    "params": [
      {
        "key": "trace_count",
        "label": "Captured Power Traces",
        "min": 10,
        "max": 1000,
        "step": 10,
        "default": 320,
        "type": "range",
        "value": 320
      },
      {
        "key": "snr_db",
        "label": "Oscilloscope SNR (dB)",
        "min": -10,
        "max": 30,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "clock_jitter",
        "label": "Clock Desynchronization",
        "min": 0,
        "max": 50,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "sec_bgp_hijack_ propagation",
    "name": "BGP Route Hijacking & RPKI Origin Validation",
    "domains": [
      "cybersecurity"
    ],
    "engine": "network_graph",
    "formula": "AS_PATH: AS64512 → AS174 → Prefix 203.0.113.0/24",
    "description": "Simulate sub-prefix BGP hijacks propagating across autonomous systems and deploy RPKI ROA filters.",
    "params": [
      {
        "key": "rpki_adoption",
        "label": "RPKI ROA Deployment (%)",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 42,
        "type": "range",
        "value": 42
      },
      {
        "key": "attacker_degree",
        "label": "Hijacker AS Peering Degree",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "flap_damping",
        "label": "Route Flap Damping",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "sec_tor_onion_circuit",
    "name": "Onion Routing Circuit & Traffic Correlation",
    "domains": [
      "cybersecurity"
    ],
    "engine": "network_graph",
    "formula": "E_k1(E_k2(E_k3(Payload)))  |  Guard → Middle → Exit",
    "description": "Trace 3-hop Tor onion circuits and evaluate timing correlation attacks under chaff padding.",
    "params": [
      {
        "key": "guard_nodes",
        "label": "Guard Relay Diversity",
        "min": 3,
        "max": 50,
        "step": 1,
        "default": 16,
        "type": "range",
        "value": 16
      },
      {
        "key": "padding_rate",
        "label": "Constant-Rate Chaff Traffic",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 30,
        "type": "range",
        "value": 30
      },
      {
        "key": "adversary_view",
        "label": "ISP Tap Coverage (%)",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "sec_osint_entity_graph",
    "name": "OSINT Entity Resolution & Fellegi–Sunter Linker",
    "domains": [
      "cybersecurity"
    ],
    "engine": "network_graph",
    "formula": "LLR(a,b) = Σ_k log [P(γ_k | M) / P(γ_k | U)]",
    "description": "De-anonymize overlapping corporate registries, DNS WHOIS records, and wallet clusters via probabilistic record linkage.",
    "params": [
      {
        "key": "match_thresh",
        "label": "Linkage LLR Threshold",
        "min": 0.1,
        "max": 0.99,
        "step": 0.01,
        "default": 0.72,
        "type": "range",
        "value": 0.72
      },
      {
        "key": "alias_noise",
        "label": "Typo / Transliteration Noise",
        "min": 0,
        "max": 50,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "hop_depth",
        "label": "Ego-Graph Expansion Depth",
        "min": 1,
        "max": 6,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      }
    ]
  },
  {
    "id": "sec_stylometry_authorship",
    "name": "Stylometric Authorship Attribution & Burrow's Delta",
    "domains": [
      "cybersecurity"
    ],
    "engine": "neural_manifold",
    "formula": "Δ(D₁, D₂) = (1/n) Σ_i |z_i(D₁) − z_i(D₂)|",
    "description": "Project anonymous documents into function-word n-gram space to identify author fingerprints.",
    "params": [
      {
        "key": "ngram_order",
        "label": "Character/Word n-gram Order",
        "min": 1,
        "max": 5,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "feature_count",
        "label": "Top Function Words M",
        "min": 20,
        "max": 500,
        "step": 20,
        "default": 150,
        "type": "range",
        "value": 150
      },
      {
        "key": "obfuscation",
        "label": "Adversarial Paraphrase Level",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 20,
        "type": "range",
        "value": 20
      }
    ]
  },
  {
    "id": "sec_fuzzing_coverage",
    "name": "Coverage-Guided Greybox Fuzzing (AFL / libFuzzer)",
    "domains": [
      "cybersecurity"
    ],
    "engine": "field_lattice",
    "formula": "P(mutate s) ∝ PerfScore(s) / EdgeHitCount(s)",
    "description": "Watch genetic corpus mutation uncover new basic-block control-flow edges and trigger sanitizers.",
    "params": [
      {
        "key": "mutation_rate",
        "label": "Bitflip / Havoc Aggression",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 45,
        "type": "range",
        "value": 45
      },
      {
        "key": "dict_weight",
        "label": "SMT / Token Dictionary Weight",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 60,
        "type": "range",
        "value": 60
      },
      {
        "key": "branch_depth",
        "label": "Magic-Byte Branch Complexity",
        "min": 1,
        "max": 32,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "sec_symbolic_concolic",
    "name": "Concolic Execution & SMT Path Constraint Solver",
    "domains": [
      "cybersecurity"
    ],
    "engine": "network_graph",
    "formula": "Π = π₁ ∧ π₂ ∧ ¬π₃  ⇒  Z3.solve(Π)",
    "description": "Fork symbolic execution states at conditional branches and solve path predicates with Z3.",
    "params": [
      {
        "key": "loop_bound",
        "label": "Loop Unrolling Bound k",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "smt_timeout",
        "label": "Solver Timeout Budget (ms)",
        "min": 50,
        "max": 2000,
        "step": 50,
        "default": 500,
        "type": "range",
        "value": 500
      },
      {
        "key": "path_pruning",
        "label": "Heuristic State Pruning",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 55,
        "type": "range",
        "value": 55
      }
    ]
  },
  {
    "id": "sec_differential_privacy",
    "name": "Differential Privacy (ε, δ) Laplace & Gaussian Mechanism",
    "domains": [
      "cybersecurity"
    ],
    "engine": "wave_fourier",
    "formula": "Pr[M(D) ∈ S] ≤ e^ε Pr[M(D') ∈ S] + δ",
    "description": "Balance statistical query utility against membership-inference privacy leakage across composition budgets.",
    "params": [
      {
        "key": "epsilon",
        "label": "Privacy Budget ε",
        "min": 0.05,
        "max": 5.0,
        "step": 0.05,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      },
      {
        "key": "sensitivity",
        "label": "L₁ Query Sensitivity Δf",
        "min": 0.1,
        "max": 10.0,
        "step": 0.1,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      },
      {
        "key": "queries",
        "label": "Sequential Query Compositions",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 20,
        "type": "range",
        "value": 20
      }
    ]
  },
  {
    "id": "sec_byzantine_pbft",
    "name": "Byzantine Fault Tolerance (PBFT / HotStuff Quorum)",
    "domains": [
      "cybersecurity"
    ],
    "engine": "network_graph",
    "formula": "n ≥ 3f + 1  ⇒  |Q₁ ∩ Q₂| ≥ f + 1 honest",
    "description": "Inject equivocating Byzantine validators and verify safety and liveness across view changes.",
    "params": [
      {
        "key": "replicas",
        "label": "Total Validator Nodes n",
        "min": 4,
        "max": 31,
        "step": 3,
        "default": 13,
        "type": "range",
        "value": 13
      },
      {
        "key": "byzantine_f",
        "label": "Byzantine Faulty Nodes f",
        "min": 0,
        "max": 10,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "net_delay",
        "label": "Network Asynchrony (ms)",
        "min": 5,
        "max": 500,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      }
    ]
  },
  {
    "id": "sec_kerberos_golden_ticket",
    "name": "Active Directory Attack Graph & BloodHound Paths",
    "domains": [
      "cybersecurity"
    ],
    "engine": "network_graph",
    "formula": "User → MemberOf → Group → GenericAll → DomainController",
    "description": "Analyze shortest privilege-escalation paths to Domain Admin and place tiered identity boundaries.",
    "params": [
      {
        "key": "session_hygiene",
        "label": "Privileged Session Tiering",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 40,
        "type": "range",
        "value": 40
      },
      {
        "key": "acl_sprawl",
        "label": "Over-Permissive ACE Density",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 55,
        "type": "range",
        "value": 55
      },
      {
        "key": "krbtgt_rot",
        "label": "KRBTGT Key Rotation Frequency",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "sec_dns_tunnel_entropy",
    "name": "DNS Exfiltration & Shannon Entropy Detector",
    "domains": [
      "cybersecurity"
    ],
    "engine": "wave_fourier",
    "formula": "H(X) = −Σ P(x_i) log₂ P(x_i) > 4.1 bits/char",
    "description": "Inspect FQDN subdomain entropy, record frequency, and payload chunking vs benign CDN traffic.",
    "params": [
      {
        "key": "exfil_rate",
        "label": "Exfiltration Baud (kbps)",
        "min": 0.5,
        "max": 50,
        "step": 0.5,
        "default": 8.0,
        "type": "range",
        "value": 8.0
      },
      {
        "key": "base_encoding",
        "label": "Base32 / Base64 Packing",
        "min": 1,
        "max": 64,
        "step": 1,
        "default": 32,
        "type": "range",
        "value": 32
      },
      {
        "key": "detector_thresh",
        "label": "Entropy Alert Threshold",
        "min": 2.5,
        "max": 5.5,
        "step": 0.1,
        "default": 3.9,
        "type": "range",
        "value": 3.9
      }
    ]
  },
  {
    "id": "sec_kyber_mlkem",
    "name": "Post-Quantum ML-KEM (Kyber) Module-LWE Lab",
    "domains": [
      "cybersecurity"
    ],
    "engine": "field_lattice",
    "formula": "b = A·s + e (mod q=3329, Z_q[X]/(X²⁵⁶+1))",
    "description": "Explore error polynomial noise distributions, NTT multiplication, and decryption failure bounds.",
    "params": [
      {
        "key": "module_rank",
        "label": "Module Rank k (512/768/1024)",
        "min": 2,
        "max": 4,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "eta_noise",
        "label": "Centered Binomial Noise η",
        "min": 1,
        "max": 5,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      },
      {
        "key": "compression_d",
        "label": "Ciphertext Compression Bits",
        "min": 4,
        "max": 12,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "sec_adversarial_evasion",
    "name": "Adversarial Malware Evasion & PGD Feature Perturbation",
    "domains": [
      "cybersecurity"
    ],
    "engine": "neural_manifold",
    "formula": "x_adv = Π_{B_ε(x)} (x + α·sign(∇_x L(θ, x, y)))",
    "description": "Perturb PE header/import features within semantic-preserving constraints to test classifier robustness.",
    "params": [
      {
        "key": "eps_budget",
        "label": "Perturbation Budget ε",
        "min": 0.0,
        "max": 1.0,
        "step": 0.02,
        "default": 0.24,
        "type": "range",
        "value": 0.24
      },
      {
        "key": "adv_training",
        "label": "Adversarial Training Weight",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 50,
        "type": "range",
        "value": 50
      },
      {
        "key": "feature_mask",
        "label": "Immutable Semantic Constraints",
        "min": 10,
        "max": 95,
        "step": 5,
        "default": 65,
        "type": "range",
        "value": 65
      }
    ]
  },
  {
    "id": "neuro_hodgkin_huxley",
    "name": "Hodgkin–Huxley Conductance Action Potential",
    "domains": [
      "neuroscience"
    ],
    "engine": "phase_attractor",
    "formula": "C_m dV/dt = I_ext − g_Na m³h(V−E_Na) − g_K n⁴(V−E_K) − g_L(V−E_L)",
    "description": "Tune voltage-gated Na⁺ and K⁺ maximal conductances and inject current pulses to trigger spike trains.",
    "params": [
      {
        "key": "i_inj",
        "label": "Injected Current I_ext (µA/cm²)",
        "min": 0,
        "max": 40,
        "step": 0.5,
        "default": 12.0,
        "type": "range",
        "value": 12.0
      },
      {
        "key": "g_na",
        "label": "Max Na⁺ Conductance g_Na",
        "min": 40,
        "max": 180,
        "step": 2,
        "default": 120,
        "type": "range",
        "value": 120
      },
      {
        "key": "g_k",
        "label": "Max K⁺ Conductance g_K",
        "min": 10,
        "max": 80,
        "step": 1,
        "default": 36,
        "type": "range",
        "value": 36
      }
    ]
  },
  {
    "id": "neuro_fitzhugh_nagumo",
    "name": "FitzHugh–Nagumo Phase Plane & Excitability Bifurcation",
    "domains": [
      "neuroscience"
    ],
    "engine": "phase_attractor",
    "formula": "dv/dt = v − v³/3 − w + I,   dw/dt = ε(v + a − b·w)",
    "description": "Inspect cubic nullclines, Hopf bifurcation into repetitive spiking, and refractory phase trajectories.",
    "params": [
      {
        "key": "stimulus_i",
        "label": "Stimulus Drive I",
        "min": -0.5,
        "max": 1.5,
        "step": 0.02,
        "default": 0.42,
        "type": "range",
        "value": 0.42
      },
      {
        "key": "recovery_eps",
        "label": "Recovery Rate ε",
        "min": 0.01,
        "max": 0.3,
        "step": 0.01,
        "default": 0.08,
        "type": "range",
        "value": 0.08
      },
      {
        "key": "damping_b",
        "label": "Slow Variable Damping b",
        "min": 0.2,
        "max": 1.4,
        "step": 0.02,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      }
    ]
  },
  {
    "id": "neuro_cable_dendrite",
    "name": "Rall Passive & Active Dendritic Cable Equation",
    "domains": [
      "neuroscience"
    ],
    "engine": "wave_fourier",
    "formula": "λ² ∂²V/∂x² − τ_m ∂V/∂t − V = 0",
    "description": "Simulate electrotonic attenuation, space constant λ, and nonlinear NMDA dendritic spikes.",
    "params": [
      {
        "key": "lambda_um",
        "label": "Length Constant λ (µm)",
        "min": 100,
        "max": 1000,
        "step": 20,
        "default": 420,
        "type": "range",
        "value": 420
      },
      {
        "key": "tau_ms",
        "label": "Membrane Time Constant τ_m (ms)",
        "min": 2,
        "max": 50,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      },
      {
        "key": "nmda_gain",
        "label": "Active NMDA Regenerative Gain",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 45,
        "type": "range",
        "value": 45
      }
    ]
  },
  {
    "id": "neuro_stdp_synapse",
    "name": "Spike-Timing-Dependent Plasticity (STDP) Window",
    "domains": [
      "neuroscience"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "Δw = A₊ exp(−Δt/τ₊) (Δt>0),  −A₋ exp(Δt/τ₋) (Δt<0)",
    "description": "Vary pre-post spike timing Δt = t_post − t_pre to induce LTP or LTD synaptic weight updates.",
    "params": [
      {
        "key": "delta_t",
        "label": "Spike Timing Δt (ms)",
        "min": -60,
        "max": 60,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "tau_plus",
        "label": "LTP Window τ₊ (ms)",
        "min": 5,
        "max": 40,
        "step": 1,
        "default": 20,
        "type": "range",
        "value": 20
      },
      {
        "key": "a_ratio",
        "label": "LTD / LTP Asymmetry A₋/A₊",
        "min": 0.5,
        "max": 1.8,
        "step": 0.05,
        "default": 1.05,
        "type": "range",
        "value": 1.05
      }
    ]
  },
  {
    "id": "neuro_wilson_cowan",
    "name": "Wilson–Cowan Excitatory–Inhibitory Cortical Oscillations",
    "domains": [
      "neuroscience"
    ],
    "engine": "phase_attractor",
    "formula": "τ_E dE/dt = −E + S(w_EE E − w_EI I + P)",
    "description": "Explore gamma/beta cortical oscillations and E/I balance across recurrent synaptic coupling strengths.",
    "params": [
      {
        "key": "w_ee",
        "label": "Recurrent Excitation w_EE",
        "min": 4,
        "max": 24,
        "step": 0.5,
        "default": 14.0,
        "type": "range",
        "value": 14.0
      },
      {
        "key": "w_ei",
        "label": "Inhibitory Feedback w_EI",
        "min": 4,
        "max": 24,
        "step": 0.5,
        "default": 12.0,
        "type": "range",
        "value": 12.0
      },
      {
        "key": "ext_drive",
        "label": "Thalamic Input Drive P",
        "min": -2,
        "max": 8,
        "step": 0.2,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      }
    ]
  },
  {
    "id": "neuro_ring_attractor",
    "name": "Head-Direction Continuous Ring Attractor Network",
    "domains": [
      "neuroscience"
    ],
    "engine": "field_lattice",
    "formula": "τ du(θ)/dt = −u(θ) + ∫ J(θ−θ') r(θ') dθ' + I_vel",
    "description": "Watch a bump of persistent neural activity integrate angular velocity in a ring network.",
    "params": [
      {
        "key": "mexican_hat",
        "label": "Lateral Inhibition Depth",
        "min": 0.1,
        "max": 3.0,
        "step": 0.05,
        "default": 1.4,
        "type": "range",
        "value": 1.4
      },
      {
        "key": "ang_vel",
        "label": "Angular Velocity Input ω",
        "min": -5.0,
        "max": 5.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "syn_noise",
        "label": "Synaptic Background Noise",
        "min": 0,
        "max": 1.0,
        "step": 0.02,
        "default": 0.15,
        "type": "range",
        "value": 0.15
      }
    ]
  },
  {
    "id": "neuro_grid_cell_hex",
    "name": "Entorhinal Grid Cell Hexagonal Interference Lattice",
    "domains": [
      "neuroscience"
    ],
    "engine": "field_lattice",
    "formula": "G(r) = Σ_{k=1..3} cos(k_i · (r − r₀))",
    "description": "Adjust spatial scale, orientation, and velocity modulation of entorhinal grid fields.",
    "params": [
      {
        "key": "grid_scale",
        "label": "Spatial Period λ (cm)",
        "min": 20,
        "max": 120,
        "step": 2,
        "default": 48,
        "type": "range",
        "value": 48
      },
      {
        "key": "grid_angle",
        "label": "Lattice Orientation φ (°)",
        "min": 0,
        "max": 60,
        "step": 1,
        "default": 15,
        "type": "range",
        "value": 15
      },
      {
        "key": "theta_mod",
        "label": "Theta Phase Precession Depth",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 65,
        "type": "range",
        "value": 65
      }
    ]
  },
  {
    "id": "neuro_kalman_bci_decoder",
    "name": "Motor Cortex BCI Kalman Velocity Decoder",
    "domains": [
      "neuroscience"
    ],
    "engine": "neural_manifold",
    "formula": "x̂_{t|t} = x̂_{t|t-1} + K_t (y_t − C x̂_{t|t-1})",
    "description": "Decode 2D cursor kinematics from cosine-tuned M1 neural ensemble firing rates in real time.",
    "params": [
      {
        "key": "unit_count",
        "label": "Recorded M1 Units N",
        "min": 8,
        "max": 256,
        "step": 8,
        "default": 96,
        "type": "range",
        "value": 96
      },
      {
        "key": "poisson_noise",
        "label": "Spike Count Fano Factor",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "kalman_smooth",
        "label": "Process Prior Smoothing Q",
        "min": 0.05,
        "max": 2.0,
        "step": 0.05,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      }
    ]
  },
  {
    "id": "neuro_lfads_manifold",
    "name": "Neural Population Latent Manifold Trajectory (LFADS)",
    "domains": [
      "neuroscience"
    ],
    "engine": "neural_manifold",
    "formula": "g_t = RNN(g_{t-1}, u_t),   r_t = exp(W_fac · f_t)",
    "description": "Project high-dimensional premotor spike trains onto low-dimensional rotational dynamics.",
    "params": [
      {
        "key": "latent_dim",
        "label": "Latent Factors d",
        "min": 2,
        "max": 16,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "rot_freq",
        "label": "Rotational Dynamics ω (Hz)",
        "min": 0.5,
        "max": 6.0,
        "step": 0.1,
        "default": 2.4,
        "type": "range",
        "value": 2.4
      },
      {
        "key": "kl_penalty",
        "label": "Variational KL Regularizer",
        "min": 0.01,
        "max": 2.0,
        "step": 0.05,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      }
    ]
  },
  {
    "id": "neuro_eeg_csp_motor",
    "name": "EEG Common Spatial Patterns (CSP) Motor Imagery",
    "domains": [
      "neuroscience"
    ],
    "engine": "wave_fourier",
    "formula": "w = argmax (w^T Σ₁ w) / (w^T (Σ₁ + Σ₂) w)",
    "description": "Extract mu/beta event-related desynchronization (ERD) spatial filters for left/right hand imagery.",
    "params": [
      {
        "key": "mu_band_hz",
        "label": "Mu Rhythm Center Freq (Hz)",
        "min": 8,
        "max": 14,
        "step": 0.2,
        "default": 10.5,
        "type": "range",
        "value": 10.5
      },
      {
        "key": "erd_depth",
        "label": "Contralateral ERD Suppression (%)",
        "min": 5,
        "max": 85,
        "step": 5,
        "default": 55,
        "type": "range",
        "value": 55
      },
      {
        "key": "emg_artifact",
        "label": "Cranial EMG Artifact Level",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 20,
        "type": "range",
        "value": 20
      }
    ]
  },
  {
    "id": "neuro_ssvep_cca",
    "name": "SSVEP Visual BCI & Canonical Correlation Analysis",
    "domains": [
      "neuroscience"
    ],
    "engine": "wave_fourier",
    "formula": "ρ = max_{u,v} corr(u^T X_EEG, v^T Y_ref(f_k))",
    "description": "Decode gaze target frequencies from occipital steady-state visual evoked potentials and harmonics.",
    "params": [
      {
        "key": "stim_freq",
        "label": "Target Flicker Frequency (Hz)",
        "min": 7.0,
        "max": 20.0,
        "step": 0.5,
        "default": 12.0,
        "type": "range",
        "value": 12.0
      },
      {
        "key": "harmonics",
        "label": "CCA Reference Harmonics",
        "min": 1,
        "max": 6,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "window_sec",
        "label": "Integration Window (s)",
        "min": 0.25,
        "max": 4.0,
        "step": 0.25,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      }
    ]
  },
  {
    "id": "neuro_optogenetics_chr2",
    "name": "Channelrhodopsin-2 (ChR2) Four-State Photocycle",
    "domains": [
      "neuroscience"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "C₁ --(hν)→ O₁ ⇄ O₂ → C₂ → C₁",
    "description": "Pulse 473 nm blue laser light to drive ChR2 photocurrents and observe desensitization kinetics.",
    "params": [
      {
        "key": "irradiance",
        "label": "473 nm Irradiance (mW/mm²)",
        "min": 0.1,
        "max": 25.0,
        "step": 0.5,
        "default": 8.0,
        "type": "range",
        "value": 8.0
      },
      {
        "key": "pulse_hz",
        "label": "Optical Pulse Frequency (Hz)",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 25,
        "type": "range",
        "value": 25
      },
      {
        "key": "duty_cycle",
        "label": "Laser Duty Cycle (%)",
        "min": 5,
        "max": 90,
        "step": 5,
        "default": 30,
        "type": "range",
        "value": 30
      }
    ]
  },
  {
    "id": "neuro_dbs_parkinson_beta",
    "name": "Closed-Loop Deep Brain Stimulation (STN-GPe Beta)",
    "domains": [
      "neuroscience"
    ],
    "engine": "wave_fourier",
    "formula": "I_DBS(t) = G · H_β(LFP_STN(t))",
    "description": "Suppress pathological 18–30 Hz basal ganglia beta synchrony using adaptive phase-locked DBS.",
    "params": [
      {
        "key": "dbs_freq",
        "label": "DBS Pulse Frequency (Hz)",
        "min": 10,
        "max": 180,
        "step": 5,
        "default": 130,
        "type": "range",
        "value": 130
      },
      {
        "key": "dbs_amp",
        "label": "Stimulation Amplitude (mA)",
        "min": 0.0,
        "max": 5.0,
        "step": 0.1,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "closed_loop",
        "label": "Adaptive Beta Trigger Gain",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 70,
        "type": "range",
        "value": 70
      }
    ]
  },
  {
    "id": "neuro_bold_balloon_hrf",
    "name": "fMRI Hemodynamic Balloon–Windkessel Model",
    "domains": [
      "neuroscience"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "dq/dt = (f_in/τ₀)[E(f_in)/E₀ − q/v · v^(1/α)]",
    "description": "Simulate cerebral blood flow, venous volume inflation, and deoxyhemoglobin BOLD signal undershoot.",
    "params": [
      {
        "key": "neural_dur",
        "label": "Neural Event Duration (s)",
        "min": 0.5,
        "max": 16.0,
        "step": 0.5,
        "default": 4.0,
        "type": "range",
        "value": 4.0
      },
      {
        "key": "transit_tau",
        "label": "Venous Transit Time τ₀ (s)",
        "min": 0.5,
        "max": 4.0,
        "step": 0.1,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      },
      {
        "key": "stiffness_alpha",
        "label": "Grubb Vessel Stiffness α",
        "min": 0.15,
        "max": 0.55,
        "step": 0.02,
        "default": 0.32,
        "type": "range",
        "value": 0.32
      }
    ]
  },
  {
    "id": "neuro_drift_diffusion_ddm",
    "name": "Ratcliff Drift-Diffusion Perceptual Decision Model",
    "domains": [
      "neuroscience"
    ],
    "engine": "phase_attractor",
    "formula": "dx = v·dt + σ·dW_t,   bound ±a",
    "description": "Accumulate noisy sensory evidence in LIP/FEF neurons until reaching decision commitment bounds.",
    "params": [
      {
        "key": "coherence",
        "label": "Motion Coherence Drift v",
        "min": -2.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.65,
        "type": "range",
        "value": 0.65
      },
      {
        "key": "bound_a",
        "label": "Speed-Accuracy Bound a",
        "min": 0.4,
        "max": 2.5,
        "step": 0.05,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "diffusion_s",
        "label": "Sensory Noise σ",
        "min": 0.2,
        "max": 2.0,
        "step": 0.05,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      }
    ]
  },
  {
    "id": "neuro_predictive_coding",
    "name": "Hierarchical Predictive Coding & Free Energy Minimization",
    "domains": [
      "neuroscience"
    ],
    "engine": "network_graph",
    "formula": "ε_l = μ_l − g(μ_{l+1}),   dμ_l/dt = −Π_l ε_l + ∂g^T Π_{l-1} ε_{l-1}",
    "description": "Propagate precision-weighted prediction errors up and top-down predictions down cortical layers.",
    "params": [
      {
        "key": "sensory_prec",
        "label": "Bottom-Up Sensory Precision Π₀",
        "min": 0.1,
        "max": 5.0,
        "step": 0.1,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      },
      {
        "key": "prior_prec",
        "label": "Top-Down Prior Precision Π_P",
        "min": 0.1,
        "max": 5.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "surprise_amp",
        "label": "Oddball Stimulus Mismatch",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 45,
        "type": "range",
        "value": 45
      }
    ]
  },
  {
    "id": "neuro_retinal_dog_gabor",
    "name": "Retinal Center-Surround & V1 Simple Cell Gabor Filter",
    "domains": [
      "neuroscience"
    ],
    "engine": "field_lattice",
    "formula": "g(x,y) = exp(−(x'²+γ²y'²)/2σ²) cos(2π x'/λ + ψ)",
    "description": "Tune spatial frequency, orientation selectivity, and surround suppression in early visual cortex.",
    "params": [
      {
        "key": "spat_freq",
        "label": "Spatial Frequency 1/λ",
        "min": 0.5,
        "max": 5.0,
        "step": 0.1,
        "default": 2.0,
        "type": "range",
        "value": 2.0
      },
      {
        "key": "orientation",
        "label": "Preferred Orientation θ (°)",
        "min": 0,
        "max": 180,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      },
      {
        "key": "surround_inh",
        "label": "Center-Surround Inhibition",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "neuro_cochlear_tonotopy",
    "name": "Cochlear Basilar Membrane Gammatone Filterbank",
    "domains": [
      "neuroscience"
    ],
    "engine": "wave_fourier",
    "formula": "g(t) = a t^(n−1) exp(−2π b t) cos(2π f_c t + φ)",
    "description": "Visualize traveling wave tonotopy from base (20 kHz) to apex (20 Hz) and outer hair cell amplification.",
    "params": [
      {
        "key": "input_freq",
        "label": "Acoustic Stimulus Freq (Hz)",
        "min": 100,
        "max": 8000,
        "step": 50,
        "default": 1400,
        "type": "range",
        "value": 1400
      },
      {
        "key": "ohc_gain",
        "label": "Active Cochlear Amplifier (dB)",
        "min": 0,
        "max": 60,
        "step": 2,
        "default": 40,
        "type": "range",
        "value": 40
      },
      {
        "key": "q_erb",
        "label": "Filter Tuning Sharpness Q_ERB",
        "min": 2,
        "max": 20,
        "step": 0.5,
        "default": 8.5,
        "type": "range",
        "value": 8.5
      }
    ]
  },
  {
    "id": "neuro_spike_sorting_pca",
    "name": "Extracellular Neuropixels Spike Sorting & Waveform PCA",
    "domains": [
      "neuroscience"
    ],
    "engine": "neural_manifold",
    "formula": "V_ext(r,t) = (1 / 4πσ) ∫ I_m(r',t) / |r − r'| dr'",
    "description": "Separate overlapping multi-unit extracellular action potentials into isolated single units via PCA/GMM.",
    "params": [
      {
        "key": "snr_unit",
        "label": "Electrode SNR",
        "min": 1.5,
        "max": 12.0,
        "step": 0.2,
        "default": 5.5,
        "type": "range",
        "value": 5.5
      },
      {
        "key": "drift_um",
        "label": "Tissue Probe Drift (µm)",
        "min": 0,
        "max": 40,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": " refractory_ms",
        "label": "ISI Refractory Threshold (ms)",
        "min": 0.5,
        "max": 4.0,
        "step": 0.1,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      }
    ]
  },
  {
    "id": "neuro_hopfield_modern",
    "name": "Modern Continuous Hopfield Associative Memory",
    "domains": [
      "neuroscience"
    ],
    "engine": "field_lattice",
    "formula": "E(ξ) = −β⁻¹ log Σ_i exp(β x_i^T ξ) + ½ ||ξ||²",
    "description": "Retrieve corrupted memory patterns across energy basins and inspect capacity phase transitions.",
    "params": [
      {
        "key": "beta_inv_t",
        "label": "Inverse Temperature β",
        "min": 0.5,
        "max": 15.0,
        "step": 0.5,
        "default": 4.5,
        "type": "range",
        "value": 4.5
      },
      {
        "key": "load_alpha",
        "label": "Memory Load Ratio α = P/N",
        "min": 0.05,
        "max": 0.5,
        "step": 0.01,
        "default": 0.14,
        "type": "range",
        "value": 0.14
      },
      {
        "key": "corrupt_pct",
        "label": "Cue Corruption (%)",
        "min": 0,
        "max": 60,
        "step": 2,
        "default": 22,
        "type": "range",
        "value": 22
      }
    ]
  },
  {
    "id": "gt_nash_replicator",
    "name": "Evolutionary Replicator Dynamics & Mixed Nash Simplex",
    "domains": [
      "game_theory"
    ],
    "engine": "phase_attractor",
    "formula": "dx_i/dt = x_i [ (A x)_i − x^T A x ]",
    "description": "Trace evolutionary trajectories on the strategy simplex for Hawk-Dove, Stag Hunt, and Rock-Paper-Scissors.",
    "params": [
      {
        "key": "hawk_cost",
        "label": "Conflict Injury Cost C",
        "min": 0.5,
        "max": 5.0,
        "step": 0.1,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "resource_v",
        "label": "Resource Prize Value V",
        "min": 0.5,
        "max": 4.0,
        "step": 0.1,
        "default": 1.4,
        "type": "range",
        "value": 1.4
      },
      {
        "key": "mutation_mu",
        "label": "Exploration / Mutation Rate",
        "min": 0.0,
        "max": 0.2,
        "step": 0.005,
        "default": 0.02,
        "type": "range",
        "value": 0.02
      }
    ]
  },
  {
    "id": "gt_vickrey_vcg_auction",
    "name": "Vickrey–Clarke–Groves (VCG) Combinatorial Auction",
    "domains": [
      "game_theory"
    ],
    "engine": "strategic_game",
    "formula": "p_i = max_x Σ_{j≠i} v_j(x) − Σ_{j≠i} v_j(x*)",
    "description": "Verify strategy-proofness and compute externality pivot payments in multi-item VCG auctions.",
    "params": [
      {
        "key": "bidders",
        "label": "Competing Bidders N",
        "min": 2,
        "max": 20,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "shade_factor",
        "label": "Bid Shading Deviation",
        "min": -0.5,
        "max": 0.5,
        "step": 0.02,
        "default": 0.0,
        "type": "range",
        "value": 0.0
      },
      {
        "key": "complement",
        "label": "Bundle Synergy α",
        "min": 0.5,
        "max": 2.0,
        "step": 0.05,
        "default": 1.25,
        "type": "range",
        "value": 1.25
      }
    ]
  },
  {
    "id": "gt_myerson_optimal",
    "name": "Myerson Optimal Auction & Virtual Valuation Ironing",
    "domains": [
      "game_theory"
    ],
    "engine": "strategic_game",
    "formula": "ψ(v) = v − (1 − F(v)) / f(v) ≥ 0",
    "description": "Set optimal reserve prices where virtual valuation crosses zero to maximize expected seller revenue.",
    "params": [
      {
        "key": "reserve_r",
        "label": "Seller Reserve Price r",
        "min": 0.0,
        "max": 1.0,
        "step": 0.02,
        "default": 0.5,
        "type": "range",
        "value": 0.5
      },
      {
        "key": "dist_skew",
        "label": "Valuation Distribution Skew",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "num_buyers",
        "label": "Active Bidders N",
        "min": 1,
        "max": 16,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      }
    ]
  },
  {
    "id": "gt_black_scholes_greeks",
    "name": "Black–Scholes–Merton PDE & Option Greeks Surface",
    "domains": [
      "game_theory"
    ],
    "engine": "wave_fourier",
    "formula": "∂V/∂t + ½σ²S² ∂²V/∂S² + rS ∂V/∂S − rV = 0",
    "description": "Visualize option price, Delta (Δ), Gamma (Γ), Vega (ν), and Theta (Θ) across strike and maturity.",
    "params": [
      {
        "key": "volatility",
        "label": "Implied Volatility σ (%)",
        "min": 5,
        "max": 100,
        "step": 1,
        "default": 28,
        "type": "range",
        "value": 28
      },
      {
        "key": "time_mat",
        "label": "Time to Expiry T (yr)",
        "min": 0.05,
        "max": 2.0,
        "step": 0.05,
        "default": 0.5,
        "type": "range",
        "value": 0.5
      },
      {
        "key": "rate_r",
        "label": "Risk-Free Rate r (%)",
        "min": 0.0,
        "max": 12.0,
        "step": 0.25,
        "default": 4.5,
        "type": "range",
        "value": 4.5
      }
    ]
  },
  {
    "id": "gt_heston_stoch_vol",
    "name": "Heston Stochastic Volatility & Volatility Smile",
    "domains": [
      "game_theory"
    ],
    "engine": "phase_attractor",
    "formula": "dS_t = μS_t dt + √v_t S_t dW₁,   dv_t = κ(θ−v_t)dt + ξ√v_t dW₂",
    "description": "Adjust vol-of-vol ξ and spot-vol correlation ρ to shape the implied volatility skew and smile.",
    "params": [
      {
        "key": "vol_of_vol",
        "label": "Vol of Vol ξ",
        "min": 0.05,
        "max": 1.2,
        "step": 0.05,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "corr_rho",
        "label": "Spot-Vol Correlation ρ",
        "min": -0.95,
        "max": 0.5,
        "step": 0.05,
        "default": -0.65,
        "type": "range",
        "value": -0.65
      },
      {
        "key": "mean_rev_k",
        "label": "Mean Reversion Speed κ",
        "min": 0.2,
        "max": 6.0,
        "step": 0.2,
        "default": 2.0,
        "type": "range",
        "value": 2.0
      }
    ]
  },
  {
    "id": "gt_limit_order_book",
    "name": "Limit Order Book (LOB), Avellaneda–Stoikov Market Making",
    "domains": [
      "game_theory"
    ],
    "engine": "systems_hardware",
    "formula": "r(s,q,t) = s − q·γσ²(T−t),   δ_a + δ_b = γσ²(T−t) + (2/γ)ln(1+γ/k)",
    "description": "Stream limit/market orders and manage inventory skew to avoid toxic adverse selection.",
    "params": [
      {
        "key": "inv_aversion",
        "label": "Inventory Risk Aversion γ",
        "min": 0.01,
        "max": 1.0,
        "step": 0.02,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      },
      {
        "key": "order_arrival",
        "label": "Order Flow Intensity λ",
        "min": 1,
        "max": 50,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      },
      {
        "key": "toxic_flow",
        "label": "Informed Kyle Flow Fraction",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "gt_almgren_chriss",
    "name": "Almgren–Chriss Optimal Execution & Market Impact",
    "domains": [
      "game_theory"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "min E[Cost] + λ·Var[Cost],   x(t) = X sinh(κ(T−t)) / sinh(κT)",
    "description": "Trade off permanent/temporary market impact against price-risk variance when liquidating a large block.",
    "params": [
      {
        "key": "risk_lambda",
        "label": "Urgency / Risk Aversion λ",
        "min": 0.01,
        "max": 2.0,
        "step": 0.02,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "temp_impact",
        "label": "Temporary Impact η",
        "min": 0.1,
        "max": 5.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "volatility_s",
        "label": "Intraday Volatility σ",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      }
    ]
  },
  {
    "id": "gt_markowitz_cvar",
    "name": "Markowitz Mean-Variance & CVaR Efficient Frontier",
    "domains": [
      "game_theory"
    ],
    "engine": "neural_manifold",
    "formula": "min_w w^T Σ w   s.t.  w^T μ = μ_p,  1^T w = 1",
    "description": "Trace the efficient frontier, Sharpe-optimal tangency portfolio, and tail Conditional Value-at-Risk.",
    "params": [
      {
        "key": "target_ret",
        "label": "Target Return μ_p (%)",
        "min": 2,
        "max": 24,
        "step": 0.5,
        "default": 11.0,
        "type": "range",
        "value": 11.0
      },
      {
        "key": "asset_corr",
        "label": "Pairwise Asset Correlation ρ",
        "min": -0.4,
        "max": 0.9,
        "step": 0.05,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      },
      {
        "key": "shrinkage",
        "label": "Ledoit–Wolf Covariance Shrinkage",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "gt_kelly_ergodicity",
    "name": "Kelly Criterion, Ergodicity Breaking & Leverage Ruin",
    "domains": [
      "game_theory"
    ],
    "engine": "wave_fourier",
    "formula": "g(f) = r + f(μ − r) − ½ f² σ²,   f* = (μ − r)/σ²",
    "description": "Compare ensemble-average wealth vs time-average logarithmic growth rate across fractional Kelly bets.",
    "params": [
      {
        "key": "kelly_frac",
        "label": "Leverage Multiple f / f*",
        "min": 0.1,
        "max": 2.5,
        "step": 0.05,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "edge_mu",
        "label": "Expected Excess Edge μ (%)",
        "min": 2,
        "max": 30,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "vol_sigma",
        "label": "Return Volatility σ (%)",
        "min": 10,
        "max": 60,
        "step": 2,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "gt_kyle_lambda_insider",
    "name": "Kyle (1985) Insider Trading & Market Depth λ",
    "domains": [
      "game_theory"
    ],
    "engine": "strategic_game",
    "formula": "p(y) = μ₀ + λ(x + u),   λ = ½ √(Σ₀ / σ_u²)",
    "description": "Observe how an informed trader hides order flow inside noise trading u while market makers update prices.",
    "params": [
      {
        "key": "noise_vol",
        "label": "Noise Trader Volume σ_u",
        "min": 0.5,
        "max": 10.0,
        "step": 0.5,
        "default": 3.5,
        "type": "range",
        "value": 3.5
      },
      {
        "key": "info_prec",
        "label": "Private Signal Precision 1/Σ₀",
        "min": 0.2,
        "max": 5.0,
        "step": 0.2,
        "default": 1.6,
        "type": "range",
        "value": 1.6
      },
      {
        "key": "auctions",
        "label": "Sequential Clearing Rounds N",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      }
    ]
  },
  {
    "id": "gt_spence_signaling",
    "name": "Spence Signaling Equilibria (Separating vs Pooling)",
    "domains": [
      "game_theory"
    ],
    "engine": "strategic_game",
    "formula": "c(e, θ_H) < c(e, θ_L)   (Single-Crossing Condition)",
    "description": "Test when high-type agents invest in costly signaling vs when pooling equilibria collapse via Cho-Kreps.",
    "params": [
      {
        "key": "cost_ratio",
        "label": "Low/High Signaling Cost Ratio",
        "min": 1.1,
        "max": 4.0,
        "step": 0.1,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "prior_high",
        "label": "Prior Fraction of High Types",
        "min": 0.05,
        "max": 0.95,
        "step": 0.05,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      },
      {
        "key": "signal_level",
        "label": "Education / Signal Threshold e*",
        "min": 0.1,
        "max": 3.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      }
    ]
  },
  {
    "id": "gt_bayesian_persuasion",
    "name": "Kamenica–Gentzkow Bayesian Persuasion & Concavification",
    "domains": [
      "game_theory"
    ],
    "engine": "strategic_game",
    "formula": "V̂(μ₀) = sup { Σ τ(s) v(μ_s) : Σ τ(s) μ_s = μ₀ }",
    "description": "Design an information disclosure experiment that concavifies the sender's value function over receiver beliefs.",
    "params": [
      {
        "key": "prior_mu",
        "label": "Prior Belief μ₀",
        "min": 0.05,
        "max": 0.95,
        "step": 0.02,
        "default": 0.3,
        "type": "range",
        "value": 0.3
      },
      {
        "key": "receiver_th",
        "label": "Receiver Action Threshold",
        "min": 0.2,
        "max": 0.9,
        "step": 0.02,
        "default": 0.6,
        "type": "range",
        "value": 0.6
      },
      {
        "key": "signal_precision",
        "label": "Signal Informativeness",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 75,
        "type": "range",
        "value": 75
      }
    ]
  },
  {
    "id": "gt_gale_shapley_matching",
    "name": "Gale–Shapley Deferred Acceptance & Core Stability",
    "domains": [
      "game_theory"
    ],
    "engine": "network_graph",
    "formula": "No blocking pair (m, w) prefers each other over μ(m), μ(w)",
    "description": "Run proposer-optimal vs receiver-optimal deferred acceptance and check for blocking pairs.",
    "params": [
      {
        "key": "market_size",
        "label": "Participants per Side N",
        "min": 4,
        "max": 20,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "pref_corr",
        "label": "Preference Correlation",
        "min": 0.0,
        "max": 0.95,
        "step": 0.05,
        "default": 0.3,
        "type": "range",
        "value": 0.3
      },
      {
        "key": "strategic_trunc",
        "label": "Preference List Truncation",
        "min": 0,
        "max": 80,
        "step": 5,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "gt_braess_wardrop",
    "name": "Braess's Paradox & Wardrop Routing Equilibrium",
    "domains": [
      "game_theory"
    ],
    "engine": "network_graph",
    "formula": "c_p(f) = c_p'(f) ∀ active paths,   Price of Anarchy ≤ 4/3",
    "description": "Toggle the zero-cost shortcut edge in a congestion network and watch selfish Wardrop latency increase!",
    "params": [
      {
        "key": "total_demand",
        "label": "Total Traffic Demand Φ",
        "min": 0.5,
        "max": 4.0,
        "step": 0.1,
        "default": 2.0,
        "type": "range",
        "value": 2.0
      },
      {
        "key": "shortcut_open",
        "label": "Shortcut Edge Capacity",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 100,
        "type": "range",
        "value": 100
      },
      {
        "key": "pigou_toll",
        "label": "Congestion Pigouvian Toll",
        "min": 0.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.0,
        "type": "range",
        "value": 0.0
      }
    ]
  },
  {
    "id": "gt_shapley_coalition",
    "name": "Cooperative Game Core & Shapley Value Attribution",
    "domains": [
      "game_theory"
    ],
    "engine": "network_graph",
    "formula": "φ_i(v) = Σ_{S⊆N\\{i}} [|S|!(n−|S|−1)!/n!] (v(S∪{i}) − v(S))",
    "description": "Compute marginal contribution permutations and test whether the core of the coalition game is non-empty.",
    "params": [
      {
        "key": "synergy_exp",
        "label": "Superadditive Synergy Exponent",
        "min": 0.8,
        "max": 2.5,
        "step": 0.05,
        "default": 1.4,
        "type": "range",
        "value": 1.4
      },
      {
        "key": "veto_weight",
        "label": "Anchor Player Veto Power",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 35,
        "type": "range",
        "value": 35
      },
      {
        "key": "players_n",
        "label": "Coalition Players N",
        "min": 3,
        "max": 10,
        "step": 1,
        "default": 5,
        "type": "range",
        "value": 5
      }
    ]
  },
  {
    "id": "gt_uniswap_cfmm_il",
    "name": "Constant Function Market Maker (x·y = k) & Impermanent Loss",
    "domains": [
      "game_theory"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "x·y = L²,   IL(p) = 2√p / (1 + p) − 1",
    "description": "Simulate concentrated liquidity ticks, arbitrage toxicity (LVR), and LP fee compensation.",
    "params": [
      {
        "key": "price_ratio",
        "label": "Relative Price Ratio p/p₀",
        "min": 0.2,
        "max": 5.0,
        "step": 0.05,
        "default": 1.6,
        "type": "range",
        "value": 1.6
      },
      {
        "key": "fee_bps",
        "label": "Pool Swap Fee (bps)",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 30,
        "type": "range",
        "value": 30
      },
      {
        "key": "conc_range",
        "label": "Concentrated Liquidity Width",
        "min": 1.1,
        "max": 4.0,
        "step": 0.1,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      }
    ]
  },
  {
    "id": "gt_vasicek_cir_yield",
    "name": "Vasicek & Cox–Ingersoll–Ross Term Structure Yield Curve",
    "domains": [
      "game_theory"
    ],
    "engine": "wave_fourier",
    "formula": "dr_t = κ(θ − r_t)dt + σ r_t^γ dW_t,   P(t,T) = A(t,T)e^{−B(t,T)r_t}",
    "description": "Shape normal, flat, and inverted zero-coupon yield curves via short-rate mean reversion.",
    "params": [
      {
        "key": "short_r0",
        "label": "Current Short Rate r₀ (%)",
        "min": 0.0,
        "max": 10.0,
        "step": 0.2,
        "default": 5.2,
        "type": "range",
        "value": 5.2
      },
      {
        "key": "long_theta",
        "label": "Long-Run Mean Rate θ (%)",
        "min": 0.5,
        "max": 10.0,
        "step": 0.2,
        "default": 3.8,
        "type": "range",
        "value": 3.8
      },
      {
        "key": "kappa_speed",
        "label": "Mean Reversion κ",
        "min": 0.1,
        "max": 3.0,
        "step": 0.1,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      }
    ]
  },
  {
    "id": "gt_hawkes_microstructure",
    "name": "Self-Exciting Hawkes Process Order-Flow Clustering",
    "domains": [
      "game_theory"
    ],
    "engine": "wave_fourier",
    "formula": "λ(t) = μ + Σ_{t_i < t} α exp(−β (t − t_i))",
    "description": "Simulate flash-crash order flow criticality as the branching ratio n = α/β approaches 1.",
    "params": [
      {
        "key": "base_mu",
        "label": "Baseline Arrival Rate μ (Hz)",
        "min": 0.5,
        "max": 10.0,
        "step": 0.5,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      },
      {
        "key": "alpha_excite",
        "label": "Self-Excitation Jump α",
        "min": 0.1,
        "max": 4.0,
        "step": 0.1,
        "default": 1.4,
        "type": "range",
        "value": 1.4
      },
      {
        "key": "beta_decay",
        "label": "Memory Decay Rate β",
        "min": 0.5,
        "max": 5.0,
        "step": 0.1,
        "default": 2.0,
        "type": "range",
        "value": 2.0
      }
    ]
  },
  {
    "id": "gt_merton_credit_cds",
    "name": "Merton Structural Credit Default & CDS Spread Calculator",
    "domains": [
      "game_theory"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "d₂ = [ln(V₀/D) + (r − ½σ_V²)T] / (σ_V √T),   PD = Φ(−d₂)",
    "description": "Model corporate equity as a call option on firm assets V_t relative to the debt barrier D.",
    "params": [
      {
        "key": "leverage_d",
        "label": "Debt-to-Asset Ratio D/V₀",
        "min": 0.1,
        "max": 1.2,
        "step": 0.02,
        "default": 0.65,
        "type": "range",
        "value": 0.65
      },
      {
        "key": "asset_vol",
        "label": "Asset Volatility σ_V (%)",
        "min": 5,
        "max": 80,
        "step": 1,
        "default": 28,
        "type": "range",
        "value": 28
      },
      {
        "key": "maturity_t",
        "label": "Debt Maturity Horizon T (yr)",
        "min": 0.5,
        "max": 10.0,
        "step": 0.5,
        "default": 5.0,
        "type": "range",
        "value": 5.0
      }
    ]
  },
  {
    "id": "gt_cfr_poker_regret",
    "name": "Counterfactual Regret Minimization (CFR+) Imperfect-Info Game",
    "domains": [
      "game_theory"
    ],
    "engine": "strategic_game",
    "formula": "R_i^{T,+}(I,a) = max(0, R_i^{T-1,+}(I,a) + r_i^t(I,a))",
    "description": "Watch regret-matching converge to a Nash equilibrium in Kuhn/Leduc poker information sets.",
    "params": [
      {
        "key": "iterations",
        "label": "Self-Play Iterations (log₁₀)",
        "min": 1.0,
        "max": 5.0,
        "step": 0.2,
        "default": 3.0,
        "type": "range",
        "value": 3.0
      },
      {
        "key": "bluff_incentive",
        "label": "Pot Odds / Bluff Incentive",
        "min": 0.5,
        "max": 4.0,
        "step": 0.1,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      },
      {
        "key": "exploit_probe",
        "label": "Adversary Best-Response Probe",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "aero_joukowski_airfoil",
    "name": "Joukowski Conformal Airfoil & Kutta Circulation Lift",
    "domains": [
      "aerospace"
    ],
    "engine": "field_lattice",
    "formula": "ζ = z + c²/z,   L' = ρ_∞ V_∞ Γ,   Γ = 4π V_∞ a sin(α + β)",
    "description": "Adjust camber, thickness, and angle of attack α while enforcing the Kutta trailing-edge condition.",
    "params": [
      {
        "key": "alpha_deg",
        "label": "Angle of Attack α (°)",
        "min": -8,
        "max": 20,
        "step": 0.5,
        "default": 6.5,
        "type": "range",
        "value": 6.5
      },
      {
        "key": "camber_pct",
        "label": "Mean Camber (%)",
        "min": 0,
        "max": 12,
        "step": 0.5,
        "default": 4.0,
        "type": "range",
        "value": 4.0
      },
      {
        "key": "thickness",
        "label": "Airfoil Thickness (%)",
        "min": 4,
        "max": 24,
        "step": 0.5,
        "default": 12.0,
        "type": "range",
        "value": 12.0
      }
    ]
  },
  {
    "id": "aero_prandtl_lifting_line",
    "name": "Prandtl Lifting-Line Wing Downwash & Induced Drag",
    "domains": [
      "aerospace"
    ],
    "engine": "wave_fourier",
    "formula": "C_{Di} = C_L² / (π · AR · e),   w(y₀) = −(1/4π) ∫ (dΓ/dy)/(y₀−y) dy",
    "description": "Vary wing aspect ratio AR and taper ratio to approach the elliptical spanwise circulation ideal.",
    "params": [
      {
        "key": "aspect_ratio",
        "label": "Wing Aspect Ratio AR",
        "min": 3.0,
        "max": 24.0,
        "step": 0.5,
        "default": 9.5,
        "type": "range",
        "value": 9.5
      },
      {
        "key": "taper_ratio",
        "label": "Tip-to-Root Taper λ",
        "min": 0.1,
        "max": 1.0,
        "step": 0.05,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "cl_target",
        "label": "Target Lift Coefficient C_L",
        "min": 0.2,
        "max": 1.6,
        "step": 0.05,
        "default": 0.85,
        "type": "range",
        "value": 0.85
      }
    ]
  },
  {
    "id": "aero_oblique_shock_theta_beta",
    "name": "Supersonic Oblique Shock θ–β–M & Prandtl–Meyer Expansion",
    "domains": [
      "aerospace"
    ],
    "engine": "wave_fourier",
    "formula": "tan θ = 2 cot β (M₁² sin²β − 1) / (M₁²(γ + cos 2β) + 2)",
    "description": "Sweep upstream Mach number M₁ and wedge deflection θ to observe weak/strong attached shocks and detachment.",
    "params": [
      {
        "key": "mach_1",
        "label": "Upstream Mach Number M₁",
        "min": 1.2,
        "max": 8.0,
        "step": 0.1,
        "default": 2.8,
        "type": "range",
        "value": 2.8
      },
      {
        "key": "wedge_deg",
        "label": "Wedge Deflection Angle θ (°)",
        "min": 2,
        "max": 42,
        "step": 1,
        "default": 16,
        "type": "range",
        "value": 16
      },
      {
        "key": "gamma_gas",
        "label": "Specific Heat Ratio γ",
        "min": 1.15,
        "max": 1.67,
        "step": 0.01,
        "default": 1.4,
        "type": "range",
        "value": 1.4
      }
    ]
  },
  {
    "id": "aero_de_laval_nozzle",
    "name": "Compressible De Laval Converging–Diverging Rocket Nozzle",
    "domains": [
      "aerospace"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "(A/A*)² = (1/M²)[(2/(γ+1))(1 + (γ−1)M²/2)]^{(γ+1)/(γ−1)}",
    "description": "Tune chamber-to-ambient pressure ratio to transition from subsonic venturi to normal shock, over-expanded, and ideally expanded supersonic jet.",
    "params": [
      {
        "key": "area_ratio",
        "label": "Expansion Ratio ε = A_e/A*",
        "min": 1.5,
        "max": 60.0,
        "step": 0.5,
        "default": 16.0,
        "type": "range",
        "value": 16.0
      },
      {
        "key": "pressure_ratio",
        "label": "Ambient / Chamber P_a/P_c",
        "min": 0.001,
        "max": 0.9,
        "step": 0.005,
        "default": 0.025,
        "type": "range",
        "value": 0.025
      },
      {
        "key": "chamber_temp",
        "label": "Chamber Temperature T_c (K)",
        "min": 1500,
        "max": 4200,
        "step": 50,
        "default": 3400,
        "type": "range",
        "value": 3400
      }
    ]
  },
  {
    "id": "aero_tsiolkovsky_staging",
    "name": "Multistage Tsiolkovsky Δv & Gravity-Turn Ascent Optimizer",
    "domains": [
      "aerospace"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "Δv = Σ_i I_{sp,i} g₀ ln(m_{0,i}/m_{f,i}) − ∫ (g sin γ + D/m) dt",
    "description": "Optimize stage mass fractions, propellant I_sp, and pitch-over kick angle to reach orbital velocity.",
    "params": [
      {
        "key": "isp_vac",
        "label": "Upper Stage Vacuum I_sp (s)",
        "min": 280,
        "max": 465,
        "step": 5,
        "default": 380,
        "type": "range",
        "value": 380
      },
      {
        "key": "prop_frac",
        "label": "Propellant Mass Fraction ζ",
        "min": 0.7,
        "max": 0.95,
        "step": 0.01,
        "default": 0.89,
        "type": "range",
        "value": 0.89
      },
      {
        "key": "pitch_kick",
        "label": "Gravity Turn Pitch-Over (°)",
        "min": 0.5,
        "max": 12.0,
        "step": 0.5,
        "default": 3.5,
        "type": "range",
        "value": 3.5
      }
    ]
  },
  {
    "id": "aero_hohmann_bielliptic",
    "name": "Hohmann vs Bi-Elliptic Orbital Transfer & Lambert Porkchop",
    "domains": [
      "aerospace"
    ],
    "engine": "quantum_orbital",
    "formula": "v² = μ(2/r − 1/a),   Δv_total = Δv₁ + Δv₂",
    "description": "Compare Hohmann and bi-elliptic Δv budgets across radius ratios r₂/r₁ and launch synodic windows.",
    "params": [
      {
        "key": "radius_ratio",
        "label": "Target Orbit Ratio r₂/r₁",
        "min": 1.5,
        "max": 25.0,
        "step": 0.5,
        "default": 6.6,
        "type": "range",
        "value": 6.6
      },
      {
        "key": "mid_apoapsis",
        "label": "Bi-Elliptic Intermediate r_b/r₂",
        "min": 1.0,
        "max": 5.0,
        "step": 0.2,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "plane_inc",
        "label": "Inclination Change Δi (°)",
        "min": 0,
        "max": 45,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      }
    ]
  },
  {
    "id": "aero_cr3bp_lagrange",
    "name": "Circular Restricted 3-Body Problem (CR3BP) & Halo Orbits",
    "domains": [
      "aerospace"
    ],
    "engine": "phase_attractor",
    "formula": "C_J = (x² + y²) + 2(1−μ)/r₁ + 2μ/r₂ − (ẋ² + ẏ² + ż²)",
    "description": "Explore Lagrange points L₁–L₅, zero-velocity Jacobi surfaces, and NRHO lunar gateway trajectories.",
    "params": [
      {
        "key": "mass_mu",
        "label": "Mass Ratio μ = m₂/(m₁+m₂)",
        "min": 0.005,
        "max": 0.25,
        "step": 0.005,
        "default": 0.012,
        "type": "range",
        "value": 0.012
      },
      {
        "key": "jacobi_c",
        "label": "Jacobi Constant Energy C_J",
        "min": 2.8,
        "max": 3.6,
        "step": 0.02,
        "default": 3.15,
        "type": "range",
        "value": 3.15
      },
      {
        "key": "z_amp",
        "label": "Out-of-Plane Halo Amplitude",
        "min": 0.0,
        "max": 1.0,
        "step": 0.05,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      }
    ]
  },
  {
    "id": "aero_clohessy_wiltshire",
    "name": "Clohessy–Wiltshire Rendezvous & Proximity Docking",
    "domains": [
      "aerospace"
    ],
    "engine": "phase_attractor",
    "formula": "ẍ − 2nẏ − 3n²x = f_x,   ÿ + 2nẋ = f_y,   z̈ + n²z = f_z",
    "description": "Execute V-bar and R-bar spacecraft docking approaches in the Hill/LVLH rotating reference frame.",
    "params": [
      {
        "key": "radial_x0",
        "label": "Initial Radial Offset x₀ (m)",
        "min": -500,
        "max": 500,
        "step": 10,
        "default": -120,
        "type": "range",
        "value": -120
      },
      {
        "key": "in_track_y0",
        "label": "Initial In-Track Offset y₀ (m)",
        "min": -1000,
        "max": 1000,
        "step": 20,
        "default": -450,
        "type": "range",
        "value": -450
      },
      {
        "key": "thrust_dv",
        "label": "Rendezvous Burn Impulse",
        "min": 0.1,
        "max": 5.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      }
    ]
  },
  {
    "id": "aero_quaternion_reaction_wheel",
    "name": "Spacecraft Quaternion Attitude Control & Reaction Wheels",
    "domains": [
      "aerospace"
    ],
    "engine": "phase_attractor",
    "formula": "J ω̇ + ω × (Jω + h_w) = −ḣ_w + τ_ext,   q̇ = ½ q ⊗ ω",
    "description": "Slew a 3-axis satellite using quaternion PD feedback while avoiding reaction wheel momentum saturation.",
    "params": [
      {
        "key": "kp_gain",
        "label": "Proportional Attitude Gain K_p",
        "min": 0.5,
        "max": 10.0,
        "step": 0.2,
        "default": 3.2,
        "type": "range",
        "value": 3.2
      },
      {
        "key": "kd_gain",
        "label": "Derivative Rate Damping K_d",
        "min": 0.5,
        "max": 10.0,
        "step": 0.2,
        "default": 4.5,
        "type": "range",
        "value": 4.5
      },
      {
        "key": "gg_torque",
        "label": "Gravity-Gradient Disturbance",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 20,
        "type": "range",
        "value": 20
      }
    ]
  },
  {
    "id": "aero_reentry_allen_eggers",
    "name": "Atmospheric Re-Entry Heating & Allen–Eggers Deceleration",
    "domains": [
      "aerospace"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "q̇_conv ∝ √(ρ_∞ / R_n) V³,   a_max = V_E² sin γ_E / (2 e H)",
    "description": "Balance peak g-load deceleration against stagnation-point convective heat flux across entry corridor angles.",
    "params": [
      {
        "key": "entry_vel",
        "label": "Entry Velocity V_E (km/s)",
        "min": 7.0,
        "max": 13.0,
        "step": 0.1,
        "default": 11.2,
        "type": "range",
        "value": 11.2
      },
      {
        "key": "flight_gamma",
        "label": "Entry Flight-Path Angle −γ_E (°)",
        "min": 1.0,
        "max": 12.0,
        "step": 0.2,
        "default": 5.5,
        "type": "range",
        "value": 5.5
      },
      {
        "key": "nose_radius",
        "label": "TPS Blunt Nose Radius R_n (m)",
        "min": 0.2,
        "max": 5.0,
        "step": 0.1,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      }
    ]
  },
  {
    "id": "aero_brayton_turbofan",
    "name": "High-Bypass Turbofan Brayton Cycle & TSFC Analyzer",
    "domains": [
      "aerospace"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "F = ṁ₀[(1+f)V_9 − V_0 + B(V_{19} − V_0)],   TSFC = ṁ_f / F",
    "description": "Tune bypass ratio B, overall pressure ratio OPR, and turbine inlet temperature T_t4 to minimize specific fuel consumption.",
    "params": [
      {
        "key": "bypass_b",
        "label": "Bypass Ratio B",
        "min": 0.5,
        "max": 15.0,
        "step": 0.5,
        "default": 9.5,
        "type": "range",
        "value": 9.5
      },
      {
        "key": "opr_pi",
        "label": "Overall Pressure Ratio π_c",
        "min": 8,
        "max": 55,
        "step": 1,
        "default": 42,
        "type": "range",
        "value": 42
      },
      {
        "key": "tit_k",
        "label": "Turbine Inlet Temp T_t4 (K)",
        "min": 1200,
        "max": 2100,
        "step": 20,
        "default": 1750,
        "type": "range",
        "value": 1750
      }
    ]
  },
  {
    "id": "aero_scramjet_isolator",
    "name": "Hypersonic Scramjet Inlet, Isolator Shock Train & Rayleigh Flow",
    "domains": [
      "aerospace"
    ],
    "engine": "wave_fourier",
    "formula": "M₂² = [1 + (γ−1)M₁²/2] / [γ M₁² − (γ−1)/2]   (Thermal Choking)",
    "description": "Prevent combustor thermal choking and inlet unstart in a Mach 7 hydrogen-fueled scramjet.",
    "params": [
      {
        "key": "flight_mach",
        "label": "Freestream Mach Number M_∞",
        "min": 4.0,
        "max": 10.0,
        "step": 0.2,
        "default": 6.8,
        "type": "range",
        "value": 6.8
      },
      {
        "key": "equiv_phi",
        "label": "Fuel Equivalence Ratio φ",
        "min": 0.1,
        "max": 1.4,
        "step": 0.05,
        "default": 0.75,
        "type": "range",
        "value": 0.75
      },
      {
        "key": "isolator_ld",
        "label": "Isolator Length-to-Height L/H",
        "min": 4,
        "max": 20,
        "step": 1,
        "default": 11,
        "type": "range",
        "value": 11
      }
    ]
  },
  {
    "id": "aero_ion_hall_thruster",
    "name": "Hall-Effect & Gridded Ion Electric Propulsion Plume",
    "domains": [
      "aerospace"
    ],
    "engine": "quantum_orbital",
    "formula": "I_sp = (1/g₀) √(2 e V_b / m_i),   F = ṁ v_e = √(2 m_i / e) I_b √V_b",
    "description": "Accelerate Xenon ions across electrostatic grids or crossed E×B Hall channels for deep-space missions.",
    "params": [
      {
        "key": "beam_volt",
        "label": "Acceleration Voltage V_b (V)",
        "min": 200,
        "max": 3000,
        "step": 50,
        "default": 1200,
        "type": "range",
        "value": 1200
      },
      {
        "key": "mag_gauss",
        "label": "Radial Magnetic Field B (G)",
        "min": 50,
        "max": 400,
        "step": 10,
        "default": 180,
        "type": "range",
        "value": 180
      },
      {
        "key": "mass_flow",
        "label": "Xenon Mass Flow Rate (mg/s)",
        "min": 0.5,
        "max": 20.0,
        "step": 0.5,
        "default": 5.0,
        "type": "range",
        "value": 5.0
      }
    ]
  },
  {
    "id": "aero_aeroelastic_flutter",
    "name": "Aeroelastic Wing Flutter & Divergence Bending–Torsion Coupling",
    "domains": [
      "aerospace"
    ],
    "engine": "phase_attractor",
    "formula": "M q̈ + C(V) q̇ + [K − ½ ρ V² Q_aero] q = 0",
    "description": "Sweep airspeed V to locate the Hopf flutter boundary and torsional divergence speed.",
    "params": [
      {
        "key": "airspeed_v",
        "label": "Freestream Airspeed V (m/s)",
        "min": 20,
        "max": 300,
        "step": 5,
        "default": 135,
        "type": "range",
        "value": 135
      },
      {
        "key": "cg_offset",
        "label": "Elastic-to-CG Offset x_α",
        "min": -0.2,
        "max": 0.4,
        "step": 0.02,
        "default": 0.12,
        "type": "range",
        "value": 0.12
      },
      {
        "key": "struct_damp",
        "label": "Structural Damping ζ",
        "min": 0.005,
        "max": 0.15,
        "step": 0.005,
        "default": 0.03,
        "type": "range",
        "value": 0.03
      }
    ]
  },
  {
    "id": "aero_panel_vortex_lattice",
    "name": "Source–Vortex Panel Method & Boundary Layer Separation",
    "domains": [
      "aerospace"
    ],
    "engine": "field_lattice",
    "formula": "∇²Φ = 0,   u_e ∂θ/∂s + (2 + H)θ ∂u_e/∂s = τ_w / (ρ u_e²)",
    "description": "Solve inviscid panel circulation coupled with Thwaites/Head boundary-layer shape factor H.",
    "params": [
      {
        "key": "reynolds_log",
        "label": "Log₁₀ Reynolds Number Re",
        "min": 4.5,
        "max": 8.0,
        "step": 0.1,
        "default": 6.2,
        "type": "range",
        "value": 6.2
      },
      {
        "key": "aoa_deg",
        "label": "Incidence Angle α (°)",
        "min": -4,
        "max": 18,
        "step": 0.5,
        "default": 7.0,
        "type": "range",
        "value": 7.0
      },
      {
        "key": "trip_loc",
        "label": "Turbulent Transition Trip x/c",
        "min": 0.05,
        "max": 0.9,
        "step": 0.05,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      }
    ]
  },
  {
    "id": "aero_j2_sun_sync",
    "name": "J₂ Oblateness Nodal Precession & Sun-Synchronous Orbit",
    "domains": [
      "aerospace"
    ],
    "engine": "quantum_orbital",
    "formula": "Ω̇ = −(3/2) J₂ (R_E / p)² n cos i = +0.9856°/day",
    "description": "Match inclination i and altitude h so nodal regression equals Earth's mean motion around the Sun.",
    "params": [
      {
        "key": "altitude_km",
        "label": "Orbital Altitude h (km)",
        "min": 300,
        "max": 1500,
        "step": 10,
        "default": 705,
        "type": "range",
        "value": 705
      },
      {
        "key": "inclination",
        "label": "Orbital Inclination i (°)",
        "min": 0,
        "max": 120,
        "step": 0.5,
        "default": 98.2,
        "type": "range",
        "value": 98.2
      },
      {
        "key": "eccentricity",
        "label": "Orbital Eccentricity e",
        "min": 0.0,
        "max": 0.25,
        "step": 0.01,
        "default": 0.01,
        "type": "range",
        "value": 0.01
      }
    ]
  },
  {
    "id": "aero_lunar_powered_descent",
    "name": "Powered Explicit Guidance (PEG) & Pinpoint Landing Convex SOCP",
    "domains": [
      "aerospace"
    ],
    "engine": "phase_attractor",
    "formula": "min ∫ ||T(t)|| dt   s.t.  r(t_f)=0, v(t_f)=0, ||T|| ∈ [T_min, T_max], θ ≤ θ_glide",
    "description": "Solve the lossless convexified Mars/Lunar pinpoint landing trajectory with thrust-pointing and glide-slope cones.",
    "params": [
      {
        "key": "init_alt",
        "label": "Ignition Altitude (km)",
        "min": 0.5,
        "max": 10.0,
        "step": 0.25,
        "default": 3.2,
        "type": "range",
        "value": 3.2
      },
      {
        "key": "max_thrust",
        "label": "Thrust-to-Weight Ratio T/W",
        "min": 1.2,
        "max": 4.0,
        "step": 0.1,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "glide_cone",
        "label": "Glide-Slope Clearance (°)",
        "min": 5,
        "max": 60,
        "step": 1,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "aero_kalman_gps_ins",
    "name": "Tightly-Coupled GPS/INS Multiplicative Extended Kalman Filter",
    "domains": [
      "aerospace"
    ],
    "engine": "neural_manifold",
    "formula": "δẋ = F(t)δx + G(t)w,   ρ_k = ||r_sat,k − r_u|| + c·δt_u + ε_k",
    "description": "Fuse strapdown IMU gyro/accelerometer integration with pseudorange measurements across satellite GDOP.",
    "params": [
      {
        "key": "imu_grade",
        "label": "Gyro Bias Stability (1=Nav, 10=MEMS)",
        "min": 1,
        "max": 10,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "visible_sats",
        "label": "Visible GNSS Satellites",
        "min": 3,
        "max": 14,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "multipath",
        "label": "Urban Canyon Multipath Error",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 15,
        "type": "range",
        "value": 15
      }
    ]
  },
  {
    "id": "aero_helicopter_momentum",
    "name": "Blade Element Momentum Theory (BEMT) & Vortex Ring State",
    "domains": [
      "aerospace"
    ],
    "engine": "wave_fourier",
    "formula": "dT = ½ ρ (Ωr)² c C_l(θ − φ) dr = 4π r ρ (V_c + v_i) v_i dr",
    "description": "Analyze hover figure of merit, collective pitch, and descent into turbulent vortex ring state.",
    "params": [
      {
        "key": "collective",
        "label": "Collective Pitch θ₀ (°)",
        "min": 2,
        "max": 18,
        "step": 0.5,
        "default": 9.5,
        "type": "range",
        "value": 9.5
      },
      {
        "key": "climb_vel",
        "label": "Vertical Climb/Descent V_c (m/s)",
        "min": -15,
        "max": 15,
        "step": 0.5,
        "default": 0.0,
        "type": "range",
        "value": 0.0
      },
      {
        "key": "solidity",
        "label": "Rotor Disk Solidity σ",
        "min": 0.04,
        "max": 0.16,
        "step": 0.005,
        "default": 0.08,
        "type": "range",
        "value": 0.08
      }
    ]
  },
  {
    "id": "aero_gravity_assist_bsling",
    "name": "Planetary Gravity Assist & B-Plane Aiming Target",
    "domains": [
      "aerospace"
    ],
    "engine": "quantum_orbital",
    "formula": "δ = 2 arcsin(1 / (1 + r_p v_∞² / μ_p)),   ΔV_helio = 2 v_∞ sin(δ/2)",
    "description": "Target the hyperbolic B-plane impact parameter to bend the heliocentric velocity vector around Jupiter.",
    "params": [
      {
        "key": "periapsis_rp",
        "label": "Periapsis Distance (R_planet)",
        "min": 1.1,
        "max": 15.0,
        "step": 0.2,
        "default": 3.2,
        "type": "range",
        "value": 3.2
      },
      {
        "key": "v_inf",
        "label": "Hyperbolic Excess v_∞ (km/s)",
        "min": 2.0,
        "max": 25.0,
        "step": 0.5,
        "default": 9.5,
        "type": "range",
        "value": 9.5
      },
      {
        "key": "b_angle",
        "label": "B-Plane Clock Angle θ (°)",
        "min": -180,
        "max": 180,
        "step": 5,
        "default": 0,
        "type": "range",
        "value": 0
      }
    ]
  },
  {
    "id": "qc_bloch_rabi",
    "name": "Single-Qubit Bloch Sphere & Driven Rabi/Ramsey Spectroscopy",
    "domains": [
      "quantum_computing"
    ],
    "engine": "quantum_orbital",
    "formula": "H = ½ ℏ Δ σ_z + ½ ℏ Ω_R (cos φ σ_x + sin φ σ_y)",
    "description": "Drive resonant and detuned microwave pulses on the Bloch sphere and observe Ramsey fringes.",
    "params": [
      {
        "key": "rabi_omega",
        "label": "Rabi Drive Frequency Ω_R (MHz)",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 35,
        "type": "range",
        "value": 35
      },
      {
        "key": "detuning_d",
        "label": "Drive Detuning Δ (MHz)",
        "min": -50,
        "max": 50,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "t2_dephase",
        "label": "Decoherence Rate 1/T₂*",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 15,
        "type": "range",
        "value": 15
      }
    ]
  },
  {
    "id": "qc_bell_chsh",
    "name": "Bell State Entanglement & CHSH Inequality Violator",
    "domains": [
      "quantum_computing"
    ],
    "engine": "quantum_orbital",
    "formula": "|S| = |E(a,b) − E(a,b') + E(a',b) + E(a',b')| ≤ 2√2 ≈ 2.828",
    "description": "Rotate Alice and Bob's measurement bases to cross the Tsirelson quantum bound 2√2 vs local hidden variables.",
    "params": [
      {
        "key": "theta_ab",
        "label": "Relative Analyzer Angle θ (°)",
        "min": 0,
        "max": 90,
        "step": 1,
        "default": 22.5,
        "type": "range",
        "value": 22.5
      },
      {
        "key": "werner_p",
        "label": "Werner State Purity p",
        "min": 0.0,
        "max": 1.0,
        "step": 0.01,
        "default": 0.94,
        "type": "range",
        "value": 0.94
      },
      {
        "key": "shots",
        "label": "Coincidence Photon Counts (log)",
        "min": 2,
        "max": 6,
        "step": 0.2,
        "default": 4.0,
        "type": "range",
        "value": 4.0
      }
    ]
  },
  {
    "id": "qc_grover_amplitude",
    "name": "Grover's Search Geometric Amplitude Amplification",
    "domains": [
      "quantum_computing"
    ],
    "engine": "quantum_orbital",
    "formula": "|ψ_k⟩ = cos((2k+1)θ)|w⊥⟩ + sin((2k+1)θ)|w⟩,   k* ≈ (π/4)√N",
    "description": "Step the oracle U_ω and diffusion operator U_s in the 2D plane spanned by |w⟩ and |s⟩.",
    "params": [
      {
        "key": "qubits_n",
        "label": "Search Register Qubits n",
        "min": 3,
        "max": 16,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "iterations_k",
        "label": "Grover Oracle Steps k",
        "min": 0,
        "max": 30,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "phase_err",
        "label": "Oracle Phase Imperfection (°)",
        "min": 0,
        "max": 30,
        "step": 1,
        "default": 0,
        "type": "range",
        "value": 0
      }
    ]
  },
  {
    "id": "qc_shor_qft_period",
    "name": "Shor's Algorithm & Quantum Fourier Transform Period Finder",
    "domains": [
      "quantum_computing"
    ],
    "engine": "wave_fourier",
    "formula": "QFT|x⟩ = (1/√Q) Σ_y exp(2πi x y / Q)|y⟩,   peaks at y ≈ k·Q/r",
    "description": "Compute modular exponentiation a^x mod N and interfere periodic amplitudes via the inverse QFT.",
    "params": [
      {
        "key": "period_r",
        "label": "Hidden Modular Period r",
        "min": 2,
        "max": 32,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "reg_bits",
        "label": "Phase Estimation Register m",
        "min": 4,
        "max": 14,
        "step": 1,
        "default": 9,
        "type": "range",
        "value": 9
      },
      {
        "key": "gate_noise",
        "label": "Controlled-Phase Error (%)",
        "min": 0.0,
        "max": 5.0,
        "step": 0.1,
        "default": 0.3,
        "type": "range",
        "value": 0.3
      }
    ]
  },
  {
    "id": "qc_qpe_eigenphase",
    "name": "Quantum Phase Estimation (QPE) & Trotterized U = exp(−iHt)",
    "domains": [
      "quantum_computing"
    ],
    "engine": "wave_fourier",
    "formula": "P(y) = sin²(π(2^m φ − y)) / [2^{2m} sin²(π(φ − y/2^m))]",
    "description": "Estimate unknown unitary eigenphases φ to m bits of precision using ancilla-controlled powers U^{2^k}.",
    "params": [
      {
        "key": "true_phi",
        "label": "True Eigenphase φ ∈ [0,1)",
        "min": 0.01,
        "max": 0.99,
        "step": 0.01,
        "default": 0.37,
        "type": "range",
        "value": 0.37
      },
      {
        "key": "ancilla_m",
        "label": "Ancilla Precision Qubits m",
        "min": 2,
        "max": 12,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "trotter_n",
        "label": "Suzuki–Trotter Steps",
        "min": 1,
        "max": 50,
        "step": 1,
        "default": 16,
        "type": "range",
        "value": 16
      }
    ]
  },
  {
    "id": "qc_vqe_h2_pes",
    "name": "Variational Quantum Eigensolver (VQE) H₂ Dissociation Curve",
    "domains": [
      "quantum_computing"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "E(θ) = ⟨0|U†(θ) H_mol(R) U(θ)|0⟩ ≥ E_FCI(R)",
    "description": "Optimize UCCSD ansatz parameters across interatomic bond lengths R and analyze barren plateaus.",
    "params": [
      {
        "key": "bond_r",
        "label": "Interatomic Distance R (Å)",
        "min": 0.3,
        "max": 3.0,
        "step": 0.05,
        "default": 0.74,
        "type": "range",
        "value": 0.74
      },
      {
        "key": "ansatz_depth",
        "label": "UCCSD / Hardware-Efficient Layers",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "shot_noise",
        "label": "Measurement Shot Noise",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 12,
        "type": "range",
        "value": 12
      }
    ]
  },
  {
    "id": "qc_qaoa_maxcut",
    "name": "QAOA MaxCut Energy Landscape (γ, β)",
    "domains": [
      "quantum_computing"
    ],
    "engine": "field_lattice",
    "formula": "|γ,β⟩ = Π_p e^{−iβ_p H_B} e^{−iγ_p H_C} |+⟩^⊗n",
    "description": "Explore the (γ, β) expectation landscape and approximation ratio r = ⟨H_C⟩ / C_max on 3-regular graphs.",
    "params": [
      {
        "key": "p_depth",
        "label": "QAOA Circuit Depth p",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      },
      {
        "key": "gamma_p",
        "label": "Cost Angle γ / π",
        "min": 0.0,
        "max": 1.0,
        "step": 0.02,
        "default": 0.38,
        "type": "range",
        "value": 0.38
      },
      {
        "key": "beta_p",
        "label": "Mixer Angle β / π",
        "min": 0.0,
        "max": 1.0,
        "step": 0.02,
        "default": 0.24,
        "type": "range",
        "value": 0.24
      }
    ]
  },
  {
    "id": "qc_surface_code_mwpm",
    "name": "Rotated Surface Code [[d², 1, d]] & MWPM Syndrome Decoder",
    "domains": [
      "quantum_computing"
    ],
    "engine": "field_lattice",
    "formula": "S_Z = Π_{i∈□} Z_i,   S_X = Π_{i∈+} X_i,   p_th ≈ 1.0%",
    "description": "Inject Pauli X/Z data and syndrome errors on a 2D stabilizer lattice and decode minimum-weight matching chains.",
    "params": [
      {
        "key": "code_dist",
        "label": "Code Distance d (odd)",
        "min": 3,
        "max": 13,
        "step": 2,
        "default": 7,
        "type": "range",
        "value": 7
      },
      {
        "key": "phys_err",
        "label": "Physical Gate Error Rate p (%)",
        "min": 0.05,
        "max": 2.5,
        "step": 0.05,
        "default": 0.4,
        "type": "range",
        "value": 0.4
      },
      {
        "key": "meas_rounds",
        "label": "Syndrome Extraction Rounds",
        "min": 1,
        "max": 15,
        "step": 1,
        "default": 7,
        "type": "range",
        "value": 7
      }
    ]
  },
  {
    "id": "qc_shor_steane_qec",
    "name": "Shor 9-Qubit & Steane [[7,1,3]] CSS Stabilizer Table",
    "domains": [
      "quantum_computing"
    ],
    "engine": "systems_hardware",
    "formula": "g_k ∈ G_S,   S|ψ_L⟩ = +|ψ_L⟩,   Syndrome s_k = ⟨E, g_k⟩",
    "description": "Flip physical X, Y, or Z Pauli errors on any qubit and watch CSS syndrome parity checks isolate and correct them.",
    "params": [
      {
        "key": "err_qubit",
        "label": "Corrupted Physical Qubit Index",
        "min": 0,
        "max": 8,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "pauli_type",
        "label": "Pauli Error Type (1=X, 2=Z, 3=Y)",
        "min": 1,
        "max": 3,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "leakage_p",
        "label": "Non-Computational Leakage (%)",
        "min": 0,
        "max": 20,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      }
    ]
  },
  {
    "id": "qc_lindblad_decoherence",
    "name": "Lindblad Master Equation & Kraus Channel Tomography",
    "domains": [
      "quantum_computing"
    ],
    "engine": "quantum_orbital",
    "formula": "dρ/dt = −(i/ℏ)[H, ρ] + Σ_k γ_k (L_k ρ L_k† − ½{L_k† L_k, ρ})",
    "description": "Watch the Bloch vector shrink under amplitude damping (T₁) and phase damping (T₂) quantum channels.",
    "params": [
      {
        "key": "gamma_1",
        "label": "Amplitude Relaxation γ₁ (1/T₁)",
        "min": 0.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      },
      {
        "key": "gamma_phi",
        "label": "Pure Dephasing γ_φ",
        "min": 0.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.55,
        "type": "range",
        "value": 0.55
      },
      {
        "key": "thermal_n",
        "label": "Thermal Photon Bath n_th",
        "min": 0.0,
        "max": 1.0,
        "step": 0.02,
        "default": 0.08,
        "type": "range",
        "value": 0.08
      }
    ]
  },
  {
    "id": "qc_transmon_cqed",
    "name": "Superconducting Transmon & Dispersive Circuit QED Readout",
    "domains": [
      "quantum_computing"
    ],
    "engine": "wave_fourier",
    "formula": "H = ω_r a†a + ω_q b†b − (E_C/2) b†b†bb + χ a†a σ_z",
    "description": "Tune Josephson E_J/E_C anharmonicity and dispersive resonator shift 2χ for single-shot IQ readout.",
    "params": [
      {
        "key": "ej_ec",
        "label": "Josephson Ratio E_J / E_C",
        "min": 15,
        "max": 100,
        "step": 1,
        "default": 55,
        "type": "range",
        "value": 55
      },
      {
        "key": "chi_mhz",
        "label": "Dispersive Shift χ/2π (MHz)",
        "min": 0.5,
        "max": 10.0,
        "step": 0.25,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      },
      {
        "key": "readout_pwr",
        "label": "Readout Photon Number n̄",
        "min": 1,
        "max": 80,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      }
    ]
  },
  {
    "id": "qc_trapped_ion_ms",
    "name": "Trapped-Ion Mølmer–Sørensen Bichromatic Entangling Gate",
    "domains": [
      "quantum_computing"
    ],
    "engine": "phase_attractor",
    "formula": "U_MS(t) = exp(−i α(t) S_x a† − i α*(t) S_x a + i Φ(t) S_x²)",
    "description": "Close motional phase-space loops while accumulating geometric spin-spin entanglement Φ = π/4.",
    "params": [
      {
        "key": "detuning_delta",
        "label": "Motional Sideband Detuning δ",
        "min": 0.5,
        "max": 4.0,
        "step": 0.05,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "lamb_dicke",
        "label": "Lamb–Dicke Parameter η",
        "min": 0.02,
        "max": 0.25,
        "step": 0.01,
        "default": 0.08,
        "type": "range",
        "value": 0.08
      },
      {
        "key": "heating_rate",
        "label": "Motional Phonon Heating (q/s)",
        "min": 0,
        "max": 200,
        "step": 5,
        "default": 20,
        "type": "range",
        "value": 20
      }
    ]
  },
  {
    "id": "qc_neutral_atom_rydberg",
    "name": "Neutral Atom Optical Tweezers & Rydberg Blockade Gate",
    "domains": [
      "quantum_computing"
    ],
    "engine": "field_lattice",
    "formula": "V_vdW(R) = C₆ / R⁶ ≫ Ω  (R < R_b)",
    "description": "Position Rb/Sr atom tweezers within the Rydberg blockade radius R_b to execute native CZ/CCZ gates.",
    "params": [
      {
        "key": "atom_dist",
        "label": "Interatomic Spacing R (µm)",
        "min": 2.0,
        "max": 14.0,
        "step": 0.2,
        "default": 4.8,
        "type": "range",
        "value": 4.8
      },
      {
        "key": "rabi_uv",
        "label": "Rydberg Laser Ω/2π (MHz)",
        "min": 1.0,
        "max": 20.0,
        "step": 0.5,
        "default": 6.0,
        "type": "range",
        "value": 6.0
      },
      {
        "key": "doppler_t",
        "label": "Atom Temperature (µK)",
        "min": 1,
        "max": 100,
        "step": 2,
        "default": 12,
        "type": "range",
        "value": 12
      }
    ]
  },
  {
    "id": "qc_bb84_qkd",
    "name": "BB84 & E91 Quantum Key Distribution & Eavesdropper QBER",
    "domains": [
      "quantum_computing"
    ],
    "engine": "systems_hardware",
    "formula": "QBER < 11.0%  ⇒  r_sec = 1 − 2 h₂(QBER) > 0",
    "description": "Simulate rectilinear/diagonal basis sifting, intercept-resend eavesdropping, and privacy amplification.",
    "params": [
      {
        "key": "eve_intercept",
        "label": "Eve Intercept Fraction (%)",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 0,
        "type": "range",
        "value": 0
      },
      {
        "key": "fiber_km",
        "label": "Optical Fiber Distance (km)",
        "min": 5,
        "max": 200,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      },
      {
        "key": "dark_counts",
        "label": "Detector Dark Count Rate",
        "min": 0,
        "max": 50,
        "step": 1,
        "default": 5,
        "type": "range",
        "value": 5
      }
    ]
  },
  {
    "id": "qc_quantum_teleportation",
    "name": "Quantum State Teleportation & Classical Feedforward",
    "domains": [
      "quantum_computing"
    ],
    "engine": "quantum_orbital",
    "formula": "|ψ⟩_A |Φ⁺⟩_{BC} = ½ Σ_{m,n} |Bell_{mn}⟩_{AB} (X^n Z^m |ψ⟩_C)",
    "description": "Verify how Bell-basis measurement + 2 classical bits reconstructs an arbitrary state |ψ⟩ at Bob's node.",
    "params": [
      {
        "key": "state_theta",
        "label": "Input Polar Angle θ (°)",
        "min": 0,
        "max": 180,
        "step": 2,
        "default": 65,
        "type": "range",
        "value": 65
      },
      {
        "key": "state_phi",
        "label": "Input Azimuthal Phase φ (°)",
        "min": 0,
        "max": 360,
        "step": 5,
        "default": 120,
        "type": "range",
        "value": 120
      },
      {
        "key": "bell_fidelity",
        "label": "Shared Pair Fidelity F",
        "min": 0.5,
        "max": 1.0,
        "step": 0.01,
        "default": 0.98,
        "type": "range",
        "value": 0.98
      }
    ]
  },
  {
    "id": "qc_mps_tensor_network",
    "name": "Matrix Product State (MPS) Bond Dimension & Area Law",
    "domains": [
      "quantum_computing"
    ],
    "engine": "network_graph",
    "formula": "|ψ⟩ = Σ_{s} Tr(A^{[1]s₁} A^{[2]s₂} … A^{[N]s_N}) |s₁…s_N⟩,   S_A ≤ log₂ χ",
    "description": "Truncate singular values across Schmidt cuts and compare entanglement entropy against bond dimension χ.",
    "params": [
      {
        "key": "bond_chi",
        "label": "MPS Bond Dimension χ",
        "min": 2,
        "max": 128,
        "step": 2,
        "default": 24,
        "type": "range",
        "value": 24
      },
      {
        "key": "crit_g",
        "label": "Transverse Field Criticality g/J",
        "min": 0.2,
        "max": 2.0,
        "step": 0.05,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "chain_n",
        "label": "Spin Chain Sites N",
        "min": 8,
        "max": 64,
        "step": 4,
        "default": 24,
        "type": "range",
        "value": 24
      }
    ]
  },
  {
    "id": "qc_magic_state_distill",
    "name": "15-to-1 Bravyi–Kitaev Magic State |T⟩ Distillation Factory",
    "domains": [
      "quantum_computing"
    ],
    "engine": "systems_hardware",
    "formula": "ε_out = 35 ε_in³ + O(ε_in⁴)   for Reed–Muller [[15,1,3]]",
    "description": "Analyze space-time footprint and cubic error suppression in fault-tolerant T-gate magic state factories.",
    "params": [
      {
        "key": "eps_in",
        "label": "Input Raw T-State Error (%)",
        "min": 0.05,
        "max": 2.0,
        "step": 0.05,
        "default": 0.4,
        "type": "range",
        "value": 0.4
      },
      {
        "key": "distill_levels",
        "label": "Concatenated Factory Tiers",
        "min": 1,
        "max": 3,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      },
      {
        "key": "code_d",
        "label": "Factory Surface Code Distance",
        "min": 5,
        "max": 27,
        "step": 2,
        "default": 13,
        "type": "range",
        "value": 13
      }
    ]
  },
  {
    "id": "qc_hhl_linear_solver",
    "name": "HHL Quantum Linear Systems & Condition Number κ Filter",
    "domains": [
      "quantum_computing"
    ],
    "engine": "wave_fourier",
    "formula": "|b⟩ = Σ β_j |u_j⟩  →  Σ β_j (C/λ_j)|u_j⟩|1⟩,   P_succ ∝ 1/κ²",
    "description": "Inspect eigenvalue inversion via controlled ancilla rotations and post-selection probability vs κ(A).",
    "params": [
      {
        "key": "cond_kappa",
        "label": "Matrix Condition Number κ",
        "min": 1.5,
        "max": 40.0,
        "step": 0.5,
        "default": 6.0,
        "type": "range",
        "value": 6.0
      },
      {
        "key": "qpe_bits",
        "label": "Eigenvalue Register Bits",
        "min": 3,
        "max": 10,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "amp_rounds",
        "label": "Variable-Time Amp Amplification",
        "min": 1,
        "max": 12,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      }
    ]
  },
  {
    "id": "qc_boson_gkp_squeezing",
    "name": "Photonic Boson Sampling & Gottesman–Kitaev–Preskill (GKP) Grid",
    "domains": [
      "quantum_computing"
    ],
    "engine": "field_lattice",
    "formula": "S_q = exp(i 2√π p̂),   S_p = exp(−i 2√π q̂),   Δ_dB = −10 log₁₀(Δ²)",
    "description": "Visualize Wigner function negativity and phase-space grid peaks as optical squeezing dB increases.",
    "params": [
      {
        "key": "squeeze_db",
        "label": "Optical Squeezing Level (dB)",
        "min": 3.0,
        "max": 18.0,
        "step": 0.5,
        "default": 11.5,
        "type": "range",
        "value": 11.5
      },
      {
        "key": "photon_loss",
        "label": "Waveguide Loss η (%)",
        "min": 0,
        "max": 25,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "homodyne_res",
        "label": "Homodyne Detector Resolution",
        "min": 10,
        "max": 100,
        "step": 2,
        "default": 85,
        "type": "range",
        "value": 85
      }
    ]
  },
  {
    "id": "qc_zne_error_mitigation",
    "name": "Zero-Noise Extrapolation (ZNE) & Probabilistic Error Cancellation",
    "domains": [
      "quantum_computing"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "E(0) ≈ Σ_k γ_k E(c_k λ),   γ_pec = Π_i (1 + 2p_i) ≈ e^{2 N_g p}",
    "description": "Fold unitary gates U → U(U†U)^n to amplify noise factors c_k and extrapolate expectation values to zero noise.",
    "params": [
      {
        "key": "base_noise",
        "label": "Base 2-Qubit Error Rate (%)",
        "min": 0.1,
        "max": 3.0,
        "step": 0.1,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      },
      {
        "key": "circuit_depth",
        "label": "Two-Qubit Gate Depth",
        "min": 5,
        "max": 80,
        "step": 5,
        "default": 30,
        "type": "range",
        "value": 30
      },
      {
        "key": "poly_order",
        "label": "Richardson / Poly Extrap Order",
        "min": 1,
        "max": 4,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      }
    ]
  },
  {
    "id": "bio_gardner_toggle_switch",
    "name": "Gardner–Collins Genetic Toggle Switch & Bistable Hysteresis",
    "domains": [
      "synbio"
    ],
    "engine": "phase_attractor",
    "formula": "du/dt = α₁ / (1 + v^β) − u,   dv/dt = α₂ / (1 + u^γ) − v",
    "description": "Tune promoter synthesis rates α₁, α₂ and Hill cooperativity β, γ to create a bistable cellular memory latch.",
    "params": [
      {
        "key": "alpha_1",
        "label": "Promoter 1 Synthesis α₁",
        "min": 1.0,
        "max": 10.0,
        "step": 0.2,
        "default": 5.2,
        "type": "range",
        "value": 5.2
      },
      {
        "key": "alpha_2",
        "label": "Promoter 2 Synthesis α₂",
        "min": 1.0,
        "max": 10.0,
        "step": 0.2,
        "default": 5.0,
        "type": "range",
        "value": 5.0
      },
      {
        "key": "hill_n",
        "label": "Repressor Cooperativity β",
        "min": 1.0,
        "max": 5.0,
        "step": 0.1,
        "default": 2.8,
        "type": "range",
        "value": 2.8
      }
    ]
  },
  {
    "id": "bio_elowitz_repressilator",
    "name": "Elowitz–Leibler Repressilator 3-Gene Limit-Cycle Clock",
    "domains": [
      "synbio"
    ],
    "engine": "phase_attractor",
    "formula": "dm_i/dt = −m_i + α/(1 + p_{i-1}^n) + α₀,   dp_i/dt = −β(p_i − m_i)",
    "description": "Drive sustained transcriptional oscillations across TetR, λ-cI, and LacI via Hopf bifurcation.",
    "params": [
      {
        "key": "prom_alpha",
        "label": "Maximal Transcription Rate α",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 220,
        "type": "range",
        "value": 220
      },
      {
        "key": "hill_coop",
        "label": "Hill Coefficient n",
        "min": 1.2,
        "max": 4.0,
        "step": 0.1,
        "default": 2.4,
        "type": "range",
        "value": 2.4
      },
      {
        "key": "prot_beta",
        "label": "Protein/mRNA Decay Ratio β",
        "min": 0.2,
        "max": 5.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      }
    ]
  },
  {
    "id": "bio_crispr_cas9_offtarget",
    "name": "CRISPR-Cas9 R-Loop Hybridization & Off-Target Energy Landscape",
    "domains": [
      "synbio"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "ΔG_tot = Σ_{i=1..20} ΔG_bp(i) + ΔG_PAM − Σ_{m∈MM} ΔΔG_pen(m)",
    "description": "Evaluate PAM proximal seed mismatches and kinetic cleavage rates for SpCas9 vs High-Fidelity variants.",
    "params": [
      {
        "key": "seed_mm",
        "label": "PAM-Proximal Seed Mismatches",
        "min": 0,
        "max": 5,
        "step": 1,
        "default": 1,
        "type": "range",
        "value": 1
      },
      {
        "key": "distal_mm",
        "label": "PAM-Distal Mismatches",
        "min": 0,
        "max": 6,
        "step": 1,
        "default": 1,
        "type": "range",
        "value": 1
      },
      {
        "key": "cas_conc",
        "label": "RNP Concentration (nM)",
        "min": 1,
        "max": 200,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "bio_fba_metabolic_polytope",
    "name": "Flux Balance Analysis (FBA) Stoichiometric LP Polytope",
    "domains": [
      "synbio"
    ],
    "engine": "neural_manifold",
    "formula": "max c^T v   s.t.  S·v = 0,   v_min ≤ v ≤ v_max",
    "description": "Optimize biomass vs recombinant product yield on the phenotypic phase plane and simulate gene knockouts.",
    "params": [
      {
        "key": "glucose_up",
        "label": "Glucose Uptake Bound (mmol/gDW/h)",
        "min": 1.0,
        "max": 20.0,
        "step": 0.5,
        "default": 10.0,
        "type": "range",
        "value": 10.0
      },
      {
        "key": "oxygen_up",
        "label": "Oxygen Uptake Bound",
        "min": 0.5,
        "max": 30.0,
        "step": 0.5,
        "default": 15.0,
        "type": "range",
        "value": 15.0
      },
      {
        "key": "knockout_flux",
        "label": "Competing Pathway Valve (%)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 30,
        "type": "range",
        "value": 30
      }
    ]
  },
  {
    "id": "bio_smith_waterman_dp",
    "name": "Smith–Waterman Local Sequence Alignment & Affine Gap Matrix",
    "domains": [
      "synbio"
    ],
    "engine": "systems_hardware",
    "formula": "H_{i,j} = max(0, H_{i-1,j-1} + s(a_i,b_j), E_{i,j}, F_{i,j})",
    "description": "Explore BLOSUM62 substitution scoring, gap opening/extension penalties, and optimal traceback paths.",
    "params": [
      {
        "key": "gap_open",
        "label": "Gap Opening Penalty d",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "gap_extend",
        "label": "Gap Extension Penalty e",
        "min": 0.5,
        "max": 10.0,
        "step": 0.5,
        "default": 2.0,
        "type": "range",
        "value": 2.0
      },
      {
        "key": "seq_id",
        "label": "Sequence Evolutionary Identity (%)",
        "min": 15,
        "max": 98,
        "step": 2,
        "default": 65,
        "type": "range",
        "value": 65
      }
    ]
  },
  {
    "id": "bio_de_bruijn_assembler",
    "name": "De Bruijn Graph k-mer Genome Assembler & Repeat Resolver",
    "domains": [
      "synbio"
    ],
    "engine": "network_graph",
    "formula": "G_k = (V_{k-1}, E_k),   Eulerian Contig Path Reconstruction",
    "description": "Tune k-mer size to trade off coverage dropouts at large k against repeat tangles at small k.",
    "params": [
      {
        "key": "kmer_len",
        "label": "k-mer Length k",
        "min": 15,
        "max": 127,
        "step": 2,
        "default": 55,
        "type": "range",
        "value": 55
      },
      {
        "key": "read_depth",
        "label": "Sequencing Coverage Depth (×)",
        "min": 5,
        "max": 100,
        "step": 5,
        "default": 40,
        "type": "range",
        "value": 40
      },
      {
        "key": "seq_error",
        "label": "Base-Call Error Rate (%)",
        "min": 0.05,
        "max": 5.0,
        "step": 0.1,
        "default": 0.5,
        "type": "range",
        "value": 0.5
      }
    ]
  },
  {
    "id": "bio_alphafold_se3_evo",
    "name": "Protein Structure SE(3) Frame Refinement & Ramachandran Map",
    "domains": [
      "synbio"
    ],
    "engine": "neural_manifold",
    "formula": "T_i = (R_i, t_i) ∈ SE(3),   L_FAPE = (1/Z) Σ_{i,j} ||T_i⁻¹ x_j − T_i^{true,-1} x_j^{true}||",
    "description": "Watch iterative IPA frame updates fold a polypeptide chain from random coil into α-helices and β-sheets.",
    "params": [
      {
        "key": "msa_depth",
        "label": "Multiple Sequence Alignment Neff",
        "min": 4,
        "max": 1024,
        "step": 16,
        "default": 256,
        "type": "range",
        "value": 256
      },
      {
        "key": "recycle_iters",
        "label": "Evoformer Recycling Passes",
        "min": 1,
        "max": 12,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "temp_sample",
        "label": "Conformational Sampling Temp",
        "min": 0.1,
        "max": 2.0,
        "step": 0.05,
        "default": 0.4,
        "type": "range",
        "value": 0.4
      }
    ]
  },
  {
    "id": "bio_gillespie_ssa",
    "name": "Gillespie Stochastic Simulation Algorithm (SSA) Transcriptional Bursting",
    "domains": [
      "synbio"
    ],
    "engine": "wave_fourier",
    "formula": "P(τ, μ) = a_μ exp(−a₀ τ),   Fano Factor = σ²/⟨n⟩ = 1 + b",
    "description": "Simulate discrete mRNA/protein molecule counts in low-copy cells when promoter switching is slow.",
    "params": [
      {
        "key": "burst_size",
        "label": "Mean Transcriptional Burst Size b",
        "min": 1.0,
        "max": 30.0,
        "step": 0.5,
        "default": 8.0,
        "type": "range",
        "value": 8.0
      },
      {
        "key": "k_on",
        "label": "Promoter Activation Rate k_on",
        "min": 0.05,
        "max": 2.0,
        "step": 0.05,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      },
      {
        "key": "cell_vol",
        "label": "Cell Volume Copy Scale",
        "min": 1,
        "max": 50,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "bio_monod_chemostat",
    "name": "Monod Chemostat Bioreactor & Washout Bifurcation",
    "domains": [
      "synbio"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "dX/dt = (μ(S) − D)X,   dS/dt = D(S_f − S) − μ(S)X/Y_{X/S}",
    "description": "Control dilution rate D and feed substrate S_f to maximize volumetric productivity without washout.",
    "params": [
      {
        "key": "dilution_d",
        "label": "Dilution Rate D (h⁻¹)",
        "min": 0.05,
        "max": 1.2,
        "step": 0.02,
        "default": 0.42,
        "type": "range",
        "value": 0.42
      },
      {
        "key": "feed_sf",
        "label": "Feed Substrate S_f (g/L)",
        "min": 2.0,
        "max": 50.0,
        "step": 1.0,
        "default": 20.0,
        "type": "range",
        "value": 20.0
      },
      {
        "key": "mu_max",
        "label": "Max Specific Growth μ_max (h⁻¹)",
        "min": 0.2,
        "max": 1.5,
        "step": 0.05,
        "default": 0.75,
        "type": "range",
        "value": 0.75
      }
    ]
  },
  {
    "id": "bio_horvath_epigenetic_clock",
    "name": "Epigenetic Methylation Aging Clock & Yamanaka Reprogramming",
    "domains": [
      "synbio"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "Age_DNAm = F(Σ_k w_k β_k(CpG_k)),   OSKM Partial Reset",
    "description": "Simulate CpG island methylation drift over chronological age and transient OSKM rejuvenating pulses.",
    "params": [
      {
        "key": "chron_age",
        "label": "Chronological Age (yr)",
        "min": 18,
        "max": 95,
        "step": 1,
        "default": 58,
        "type": "range",
        "value": 58
      },
      {
        "key": "oskm_days",
        "label": "Transient OSKM Pulse Duration (d)",
        "min": 0,
        "max": 14,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "inflammaging",
        "label": "Systemic SASP Stress Rate",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "bio_gompertz_makeham",
    "name": "Gompertz–Makeham Mortality Hazard & Senolytic Intervention",
    "domains": [
      "synbio"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "h(t) = A + R₀ exp(α·t),   dS_sen/dt = η·t − (κ_immune + u_seno)S_sen",
    "description": "Model exponential mortality doubling time (~8 yr) and senescent cell clearance via senolytics.",
    "params": [
      {
        "key": "senolytic_dose",
        "label": "Senolytic Clearance Efficacy (%)",
        "min": 0,
        "max": 95,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      },
      {
        "key": "dna_repair",
        "label": "DNA Repair Capacity Multiplier",
        "min": 0.5,
        "max": 2.5,
        "step": 0.05,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "baseline_a",
        "label": "Extrinsic Hazard A (×10⁻⁴/yr)",
        "min": 0.5,
        "max": 10.0,
        "step": 0.5,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      }
    ]
  },
  {
    "id": "bio_turing_morphogen",
    "name": "Reaction–Diffusion Morphogen Gradient & French Flag Patterning",
    "domains": [
      "synbio"
    ],
    "engine": "field_lattice",
    "formula": "∂c/∂t = D ∂²c/∂x² − k·c + J₀ δ(x),   λ = √(D/k)",
    "description": "Tune morphogen diffusivity D, degradation rate k, and enhancer thresholds to pattern tissue boundaries.",
    "params": [
      {
        "key": "diff_d",
        "label": "Morphogen Diffusivity D (µm²/s)",
        "min": 1.0,
        "max": 50.0,
        "step": 1.0,
        "default": 14.0,
        "type": "range",
        "value": 14.0
      },
      {
        "key": "decay_k",
        "label": "Clearance Rate k (s⁻¹)",
        "min": 0.01,
        "max": 0.5,
        "step": 0.01,
        "default": 0.08,
        "type": "range",
        "value": 0.08
      },
      {
        "key": "thresh_high",
        "label": "High-Fate Threshold C_th1",
        "min": 0.2,
        "max": 0.8,
        "step": 0.02,
        "default": 0.55,
        "type": "range",
        "value": 0.55
      }
    ]
  },
  {
    "id": "bio_quorum_luxi_luxr",
    "name": "AHL Quorum Sensing Synchronized Genetic Oscillators",
    "domains": [
      "synbio"
    ],
    "engine": "field_lattice",
    "formula": "d[AHL]_i/dt = k_synth LuxI_i − γ [AHL]_i + D_ext([AHL]_ext − [AHL]_i)",
    "description": "Couple thousands of synthetic bacteria via diffusible acyl-homoserine lactone (AHL) to synchronize glowing pulses.",
    "params": [
      {
        "key": "cell_density",
        "label": "Colony Cell Density OD₆₀₀",
        "min": 0.05,
        "max": 2.0,
        "step": 0.05,
        "default": 0.75,
        "type": "range",
        "value": 0.75
      },
      {
        "key": "ahl_diff",
        "label": "Intercellular AHL Coupling D",
        "min": 0.1,
        "max": 10.0,
        "step": 0.2,
        "default": 3.2,
        "type": "range",
        "value": 3.2
      },
      {
        "key": "aiiA_deg",
        "label": "Enzymatic AiiA Lactonase Rate",
        "min": 0.1,
        "max": 3.0,
        "step": 0.1,
        "default": 0.9,
        "type": "range",
        "value": 0.9
      }
    ]
  },
  {
    "id": "bio_codon_ribosome_tasep",
    "name": "Ribosome Traffic Jam (TASEP) & Codon Optimization",
    "domains": [
      "synbio"
    ],
    "engine": "systems_hardware",
    "formula": "J = α(1 − α)  vs  Slow-Codon Bottleneck k_elong(c_i)",
    "description": "Optimize synonymous codons to eliminate ribosomal queuing while preserving co-translational folding pauses.",
    "params": [
      {
        "key": "init_alpha",
        "label": "Translation Initiation Rate α",
        "min": 0.05,
        "max": 0.95,
        "step": 0.02,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "cai_score",
        "label": "Codon Adaptation Index (CAI)",
        "min": 0.2,
        "max": 1.0,
        "step": 0.02,
        "default": 0.78,
        "type": "range",
        "value": 0.78
      },
      {
        "key": "pause_site",
        "label": "Rare Codon Stall Depth",
        "min": 0,
        "max": 90,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "bio_scrna_umap_velocity",
    "name": "Single-Cell RNA Velocity (ds/dt = β·u − γ·s) & Lineage Manifold",
    "domains": [
      "synbio"
    ],
    "engine": "neural_manifold",
    "formula": "du/dt = α(t) − β·u,   ds/dt = β·u − γ·s",
    "description": "Project unspliced/spliced transcript ratios onto developmental differentiation trajectories.",
    "params": [
      {
        "key": "splicing_beta",
        "label": "Splicing Rate β",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.1,
        "type": "range",
        "value": 1.1
      },
      {
        "key": "deg_gamma",
        "label": "mRNA Degradation Rate γ",
        "min": 0.1,
        "max": 2.5,
        "step": 0.1,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      },
      {
        "key": "dropout_noise",
        "label": "scRNA Capture Dropout (%)",
        "min": 0,
        "max": 80,
        "step": 2,
        "default": 30,
        "type": "range",
        "value": 30
      }
    ]
  },
  {
    "id": "bio_michaelis_allostery",
    "name": "Monod–Wyman–Changeux (MWC) Allosteric Enzyme Cooperativity",
    "domains": [
      "synbio"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "Y = [α(1+α)^{n-1} + L·c·α(1+cα)^{n-1}] / [(1+α)^n + L(1+cα)^n]",
    "description": "Shift the T ⇄ R conformational equilibrium constant L with allosteric activators and inhibitors.",
    "params": [
      {
        "key": "allosteric_l",
        "label": "Log₁₀ T/R Equilibrium L₀",
        "min": 0.0,
        "max": 5.0,
        "step": 0.1,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      },
      {
        "key": "sub_alpha",
        "label": "Normalized Substrate α = [S]/K_R",
        "min": 0.1,
        "max": 20.0,
        "step": 0.2,
        "default": 3.5,
        "type": "range",
        "value": 3.5
      },
      {
        "key": "subunits_n",
        "label": "Oligomeric Subunits n",
        "min": 2,
        "max": 8,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      }
    ]
  },
  {
    "id": "bio_car_t_cytokine",
    "name": "CAR-T Tumor Killing Kinetics & Cytokine Release Feedback",
    "domains": [
      "synbio"
    ],
    "engine": "phase_attractor",
    "formula": "dT/dt = r T(1 − T/K) − κ E·T,   dE/dt = α E·T/(T+K_m) − δ_E E",
    "description": "Balance CAR-T receptor affinity and expansion rate against tumor escape and IL-6 cytokine storm risk.",
    "params": [
      {
        "key": "car_affinity",
        "label": "scFv Antigen Affinity",
        "min": 0.2,
        "max": 5.0,
        "step": 0.1,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      },
      {
        "key": "infusion_dose",
        "label": "Initial CAR-T Dose (×10⁶/kg)",
        "min": 0.2,
        "max": 10.0,
        "step": 0.2,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      },
      {
        "key": "tocilizumab",
        "label": "IL-6R Blockade Damping",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 40,
        "type": "range",
        "value": 40
      }
    ]
  },
  {
    "id": "bio_lipid_nanoparticle_pk",
    "name": "mRNA Lipid Nanoparticle (LNP) Endosomal Escape & PK/PD",
    "domains": [
      "synbio"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "pK_a ≈ 6.4 Ionizable Lipid Protonation  →  Endosomal Escape η_esc",
    "description": "Tune ionizable lipid apparent pK_a, PEG-lipid shedding rate, and hepatic vs extrahepatic biodistribution.",
    "params": [
      {
        "key": "lipid_pka",
        "label": "Ionizable Lipid Apparent pK_a",
        "min": 5.2,
        "max": 7.6,
        "step": 0.05,
        "default": 6.45,
        "type": "range",
        "value": 6.45
      },
      {
        "key": "peg_mol_pct",
        "label": "PEG-Lipid Molar Ratio (%)",
        "min": 0.5,
        "max": 5.0,
        "step": 0.1,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      },
      {
        "key": "mrna_utr_stab",
        "label": "5'/3' UTR & ΨUridine Half-Life (h)",
        "min": 4,
        "max": 72,
        "step": 2,
        "default": 28,
        "type": "range",
        "value": 28
      }
    ]
  },
  {
    "id": "bio_gene_drive_mendelian",
    "name": "CRISPR Homing Gene Drive & Resistance Allele Evolution",
    "domains": [
      "synbio"
    ],
    "engine": "phase_attractor",
    "formula": "q_{t+1} = [q_t² + q_t p_t (1 + e_h)] / w̄",
    "description": "Simulate super-Mendelian homing rate e_h, fitness cost s, and NHEJ resistance allele accumulation in vector populations.",
    "params": [
      {
        "key": "homing_eff",
        "label": "Germline Homing Efficiency e_h",
        "min": 0.5,
        "max": 0.99,
        "step": 0.01,
        "default": 0.92,
        "type": "range",
        "value": 0.92
      },
      {
        "key": "fitness_cost",
        "label": "Homozygous Fitness Cost s",
        "min": 0.0,
        "max": 0.6,
        "step": 0.02,
        "default": 0.12,
        "type": "range",
        "value": 0.12
      },
      {
        "key": "nhej_rate",
        "label": "Non-Homologous Resistance Rate",
        "min": 0.0,
        "max": 0.1,
        "step": 0.002,
        "default": 0.01,
        "type": "range",
        "value": 0.01
      }
    ]
  },
  {
    "id": "bio_cell_free_tx_tl",
    "name": "Cell-Free TX-TL Riboswitch Biosensor & Resource Depletion",
    "domains": [
      "synbio"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "v_TX = V_max [NTP]/([NTP]+K_m) · P_fold([Ligand])",
    "description": "Design a fluoride/theophylline riboswitch diagnostic and model ATP/NTP regeneration in cell-free extracts.",
    "params": [
      {
        "key": "ligand_um",
        "label": "Target Analyte Concentration (µM)",
        "min": 0.1,
        "max": 500.0,
        "step": 5.0,
        "default": 85.0,
        "type": "range",
        "value": 85.0
      },
      {
        "key": "ntp_pool",
        "label": "Initial NTP Energy Pool (mM)",
        "min": 0.5,
        "max": 6.0,
        "step": 0.2,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      },
      {
        "key": "dna_template",
        "label": "Linear DNA Template (nM)",
        "min": 1.0,
        "max": 50.0,
        "step": 1.0,
        "default": 12.0,
        "type": "range",
        "value": 12.0
      }
    ]
  },
  {
    "id": "mat_bragg_ewald_xrd",
    "name": "X-Ray Diffraction (XRD) Bragg Peaks & Structure Factor F(hkl)",
    "domains": [
      "materials"
    ],
    "engine": "wave_fourier",
    "formula": "nλ = 2 d_{hkl} sin θ,   F_{hkl} = Σ_j f_j exp(2πi(h x_j + k y_j + l z_j))",
    "description": "Switch crystal lattices (SC, BCC, FCC, Diamond) and observe systematic extinction rules in 2θ diffractograms.",
    "params": [
      {
        "key": "lattice_a",
        "label": "Lattice Constant a (Å)",
        "min": 2.5,
        "max": 6.5,
        "step": 0.05,
        "default": 4.05,
        "type": "range",
        "value": 4.05
      },
      {
        "key": "grain_nm",
        "label": "Scherrer Crystallite Size (nm)",
        "min": 5,
        "max": 200,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      },
      {
        "key": "strain_pct",
        "label": "Microstrain Lattice Distortion (%)",
        "min": 0.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      }
    ]
  },
  {
    "id": "mat_kronig_penney_bands",
    "name": "Kronig–Penney Electronic Band Structure & Effective Mass m*",
    "domains": [
      "materials"
    ],
    "engine": "wave_fourier",
    "formula": "P sin(αa)/(αa) + cos(αa) = cos(ka),   m* = ℏ² / (d²E/dk²)",
    "description": "Vary periodic crystal barrier strength P to watch free-electron parabolas split into Brillouin zone bandgaps.",
    "params": [
      {
        "key": "barrier_p",
        "label": "Periodic Barrier Strength P",
        "min": 0.2,
        "max": 12.0,
        "step": 0.2,
        "default": 3.5,
        "type": "range",
        "value": 3.5
      },
      {
        "key": "lattice_const",
        "label": "Brillouin Zone Scale a (Å)",
        "min": 2.0,
        "max": 8.0,
        "step": 0.2,
        "default": 5.43,
        "type": "range",
        "value": 5.43
      },
      {
        "key": "doping_ef",
        "label": "Fermi Level Shift E_F (eV)",
        "min": -2.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.2,
        "type": "range",
        "value": 0.2
      }
    ]
  },
  {
    "id": "mat_binary_eutectic_phase",
    "name": "Binary Eutectic Phase Diagram & Lever Rule Microstructure",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "f_L = (C_α − C₀)/(C_α − C_L),   ΔG_mix = ΔH_mix − T ΔS_mix",
    "description": "Cool an alloy of composition C₀ across the liquidus and solidus and compute phase fractions via the lever rule.",
    "params": [
      {
        "key": "comp_c0",
        "label": "Alloy Composition C₀ (wt% B)",
        "min": 5,
        "max": 95,
        "step": 1,
        "default": 38,
        "type": "range",
        "value": 38
      },
      {
        "key": "temp_c",
        "label": "System Temperature T (°C)",
        "min": 100,
        "max": 700,
        "step": 5,
        "default": 220,
        "type": "range",
        "value": 220
      },
      {
        "key": "omega_reg",
        "label": "Regular Solution Interaction Ω",
        "min": -10,
        "max": 25,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      }
    ]
  },
  {
    "id": "mat_cahn_hilliard_spinodal",
    "name": "Cahn–Hilliard Spinodal Decomposition & Phase Field Coarsening",
    "domains": [
      "materials"
    ],
    "engine": "field_lattice",
    "formula": "∂c/∂t = M ∇²(∂f₀/∂c − κ ∇²c),   L(t) ∝ t^{1/3}",
    "description": "Quench a binary solid solution into the unstable spinodal dome (∂²f/∂c² < 0) and watch bicontinuous coarsening.",
    "params": [
      {
        "key": "mobility_m",
        "label": "Atomic Diffusional Mobility M",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "grad_kappa",
        "label": "Interfacial Gradient Penalty κ",
        "min": 0.1,
        "max": 2.5,
        "step": 0.1,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      },
      {
        "key": "quench_depth",
        "label": "Undercooling Quench Depth",
        "min": 0.1,
        "max": 2.0,
        "step": 0.05,
        "default": 0.9,
        "type": "range",
        "value": 0.9
      }
    ]
  },
  {
    "id": "mat_ttt_jmak_nucleation",
    "name": "Avrami (JMAK) Isothermal Transformation & TTT Nose Curve",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "X(t) = 1 − exp(−k(T) · t^n),   ΔG* = 16π γ³ / [3 (ΔG_v)²]",
    "description": "Trace nucleation vs diffusion competition across undercooling ΔT to form pearlite, bainite, or martensite.",
    "params": [
      {
        "key": "hold_temp",
        "label": "Isothermal Hold Temp (°C)",
        "min": 200,
        "max": 720,
        "step": 5,
        "default": 540,
        "type": "range",
        "value": 540
      },
      {
        "key": "avrami_n",
        "label": "Avrami Growth Exponent n",
        "min": 1.0,
        "max": 4.0,
        "step": 0.1,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      },
      {
        "key": "cooling_rate",
        "label": "Continuous Cooling Rate (°C/s)",
        "min": 0.5,
        "max": 200.0,
        "step": 2.0,
        "default": 35.0,
        "type": "range",
        "value": 35.0
      }
    ]
  },
  {
    "id": "mat_fick_carburizing",
    "name": "Fick's Second Law Vacancy Diffusion & Kirkendall Marker Shift",
    "domains": [
      "materials"
    ],
    "engine": "wave_fourier",
    "formula": "C(x,t) = C_s − (C_s − C₀) erf(x / (2√(D(T)t))),   D = D₀ exp(−Q/RT)",
    "description": "Simulate case-hardening carbon diffusion profiles and Arrhenius temperature sensitivity.",
    "params": [
      {
        "key": "temp_k",
        "label": "Furnace Temperature T (K)",
        "min": 800,
        "max": 1400,
        "step": 10,
        "default": 1173,
        "type": "range",
        "value": 1173
      },
      {
        "key": "time_hr",
        "label": "Soak Time t (hours)",
        "min": 0.5,
        "max": 24.0,
        "step": 0.5,
        "default": 6.0,
        "type": "range",
        "value": 6.0
      },
      {
        "key": "act_q",
        "label": "Activation Energy Q (kJ/mol)",
        "min": 80,
        "max": 220,
        "step": 5,
        "default": 142,
        "type": "range",
        "value": 142
      }
    ]
  },
  {
    "id": "mat_dislocation_hall_petch",
    "name": "Dislocation Frank–Read Source & Hall–Petch Grain Strengthening",
    "domains": [
      "materials"
    ],
    "engine": "field_lattice",
    "formula": "σ_y = σ₀ + k_y d^{−1/2},   τ_FR ≈ G·b / L",
    "description": "Apply shear stress τ to bow a pinned dislocation line of length L into a Frank–Read multiplication loop.",
    "params": [
      {
        "key": "grain_d_um",
        "label": "Mean Grain Diameter d (µm)",
        "min": 0.5,
        "max": 100.0,
        "step": 1.0,
        "default": 12.0,
        "type": "range",
        "value": 12.0
      },
      {
        "key": "shear_tau",
        "label": "Applied Shear Stress τ (MPa)",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 180,
        "type": "range",
        "value": 180
      },
      {
        "key": "precip_space",
        "label": "Orowan Precipitate Spacing (nm)",
        "min": 10,
        "max": 300,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      }
    ]
  },
  {
    "id": "mat_griffith_weibull",
    "name": "Griffith–Irwin Fracture Mechanics K_IC & Weibull Ceramic Modulus",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "K_I = Y σ √(π a) ≤ K_{IC},   P_f(σ) = 1 − exp(−(σ/σ₀)^m)",
    "description": "Plot crack-tip stress intensity fields and compare brittle ceramic Weibull survival curves against ductile toughening.",
    "params": [
      {
        "key": "crack_mm",
        "label": "Flaw Half-Length a (mm)",
        "min": 0.1,
        "max": 10.0,
        "step": 0.1,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      },
      {
        "key": "weibull_m",
        "label": "Weibull Modulus m",
        "min": 3,
        "max": 30,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "toughness_kic",
        "label": "Fracture Toughness K_IC (MPa√m)",
        "min": 2,
        "max": 120,
        "step": 2,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "mat_pn_junction_poisson",
    "name": "Semiconductor p-n Junction Poisson Band-Bending & Depletion",
    "domains": [
      "materials"
    ],
    "engine": "wave_fourier",
    "formula": "d²ψ/dx² = −(q/ε_s)(p − n + N_D⁺ − N_A⁻),   W = √[(2ε_s/q)(N_A+N_D)/(N_A N_D)(V_bi−V)]",
    "description": "Adjust donor/acceptor doping and forward/reverse bias V to inspect E_C, E_V, E_F, space-charge ρ(x), and electric field E(x).",
    "params": [
      {
        "key": "bias_v",
        "label": "Applied Bias Voltage V_a (V)",
        "min": -5.0,
        "max": 0.8,
        "step": 0.05,
        "default": 0.0,
        "type": "range",
        "value": 0.0
      },
      {
        "key": "nd_log",
        "label": "Donor Doping log₁₀(N_D cm⁻³)",
        "min": 14.0,
        "max": 18.5,
        "step": 0.1,
        "default": 16.5,
        "type": "range",
        "value": 16.5
      },
      {
        "key": "na_log",
        "label": "Acceptor Doping log₁₀(N_A cm⁻³)",
        "min": 14.0,
        "max": 18.5,
        "step": 0.1,
        "default": 16.5,
        "type": "range",
        "value": 16.5
      }
    ]
  },
  {
    "id": "mat_mosfet_finfet_sce",
    "name": "FinFET / GAA Nanosheet Subthreshold Swing & DIBL",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "SS = (k_B T / q) ln(10) (1 + C_dep/C_ox) ≥ 60 mV/dec,   λ = √[(ε_si/ε_ox) t_ox t_si / N_gates]",
    "description": "Compare planar MOSFET vs Tri-Gate FinFET vs Gate-All-Around (GAA) nanosheet electrostatics at sub-5nm gate lengths.",
    "params": [
      {
        "key": "gate_lg_nm",
        "label": "Physical Gate Length L_g (nm)",
        "min": 3,
        "max": 45,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "eot_nm",
        "label": "Equivalent Oxide Thickness EOT (nm)",
        "min": 0.4,
        "max": 3.0,
        "step": 0.1,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      },
      {
        "key": "gate_arch",
        "label": "Gate Wrapping (1=Planar, 2=Fin, 3=GAA)",
        "min": 1,
        "max": 3,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      }
    ]
  },
  {
    "id": "mat_euv_litho_opc",
    "name": "13.5 nm EUV Lithography Aerial Image & Optical Proximity Correction",
    "domains": [
      "materials"
    ],
    "engine": "field_lattice",
    "formula": "CD = k₁ λ / NA,   DOF = k₂ λ / NA²   (λ = 13.5 nm, High-NA = 0.55)",
    "description": "Simulate Hopkins partially coherent aerial imaging, stochastic photon shot noise, and sub-resolution assist features (SRAFs).",
    "params": [
      {
        "key": "na_lens",
        "label": "Mirror Numerical Aperture NA",
        "min": 0.25,
        "max": 0.55,
        "step": 0.01,
        "default": 0.33,
        "type": "range",
        "value": 0.33
      },
      {
        "key": "dose_mj",
        "label": "EUV Exposure Dose (mJ/cm²)",
        "min": 10,
        "max": 80,
        "step": 2,
        "default": 38,
        "type": "range",
        "value": 38
      },
      {
        "key": "opc_serif",
        "label": "OPC Serif & SRAF Strength (%)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 75,
        "type": "range",
        "value": 75
      }
    ]
  },
  {
    "id": "mat_deal_grove_oxidation",
    "name": "Deal–Grove Thermal Oxidation & Ion Implantation Range Profile",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "x₀² + A x₀ = B(t + τ),   C(x) = [Φ / (√(2π) ΔR_p)] exp(−(x − R_p)² / 2ΔR_p²)",
    "description": "Simulate dry vs wet SiO₂ growth kinetics and LSS Gaussian/Pearson-IV dopant ion implantation.",
    "params": [
      {
        "key": "ox_temp_c",
        "label": "Oxidation Temperature (°C)",
        "min": 800,
        "max": 1200,
        "step": 10,
        "default": 1000,
        "type": "range",
        "value": 1000
      },
      {
        "key": "implant_kev",
        "label": "Ion Implant Energy (keV)",
        "min": 5,
        "max": 200,
        "step": 5,
        "default": 60,
        "type": "range",
        "value": 60
      },
      {
        "key": "anneal_rta",
        "label": "Rapid Thermal Anneal Budget",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 40,
        "type": "range",
        "value": 40
      }
    ]
  },
  {
    "id": "mat_plasma_rie_ald",
    "name": "Bosche Deep RIE Etch vs Atomic Layer Deposition (ALD) Conformality",
    "domains": [
      "materials"
    ],
    "engine": "field_lattice",
    "formula": "Step Coverage = f(Sticking Coeff s₀, Aspect Ratio AR),   Self-Limiting Surface Saturation",
    "description": "Contrast directional ion-assisted plasma trench etching against self-limiting TMA/H₂O ALD monolayer growth.",
    "params": [
      {
        "key": "trench_ar",
        "label": "Trench Aspect Ratio H/W",
        "min": 1,
        "max": 40,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "rf_bias_v",
        "label": "Substrate RF Bias Power (W)",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 160,
        "type": "range",
        "value": 160
      },
      {
        "key": "ald_pulse",
        "label": "ALD Precursor Pulse Saturation (%)",
        "min": 20,
        "max": 100,
        "step": 2,
        "default": 95,
        "type": "range",
        "value": 95
      }
    ]
  },
  {
    "id": "mat_li_ion_newman_dfn",
    "name": "Doyle–Fuller–Newman (DFN) Lithium-Ion Battery Intercalation",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "j_Li = i₀ [exp(α_a F η / RT) − exp(−α_c F η / RT)],   ∂c_s/∂t = (1/r²)∂/∂r(D_s r² ∂c_s/∂r)",
    "description": "Simulate Li⁺ solid-particle diffusion, Butler–Volmer overpotential, and lithium plating at high C-rates.",
    "params": [
      {
        "key": "c_rate",
        "label": "Charge / Discharge Rate (C)",
        "min": 0.2,
        "max": 6.0,
        "step": 0.2,
        "default": 2.0,
        "type": "range",
        "value": 2.0
      },
      {
        "key": "part_rad_um",
        "label": "Cathode Particle Radius R_p (µm)",
        "min": 1.0,
        "max": 15.0,
        "step": 0.5,
        "default": 5.0,
        "type": "range",
        "value": 5.0
      },
      {
        "key": "porosity_eps",
        "label": "Electrode Porosity ε_e",
        "min": 0.15,
        "max": 0.55,
        "step": 0.02,
        "default": 0.32,
        "type": "range",
        "value": 0.32
      }
    ]
  },
  {
    "id": "mat_perovskite_shockley_queisser",
    "name": "Shockley–Queisser Detailed Balance & Tandem Perovskite/Si Solar Cell",
    "domains": [
      "materials"
    ],
    "engine": "wave_fourier",
    "formula": "η_SQ(E_g) = [V_oc · J_sc(E_g) · FF] / P_AM1.5G,   η_max(1J) ≈ 33.7%",
    "description": "Optimize top/bottom absorber bandgaps E_g1, E_g2 to suppress thermalization and transmission losses.",
    "params": [
      {
        "key": "eg_top",
        "label": "Top Perovskite Bandgap E_g1 (eV)",
        "min": 1.3,
        "max": 2.2,
        "step": 0.02,
        "default": 1.72,
        "type": "range",
        "value": 1.72
      },
      {
        "key": "eg_bot",
        "label": "Bottom Cell Bandgap E_g2 (eV)",
        "min": 0.7,
        "max": 1.5,
        "step": 0.02,
        "default": 1.12,
        "type": "range",
        "value": 1.12
      },
      {
        "key": "srh_defect",
        "label": "Non-Radiative Trap Density",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 15,
        "type": "range",
        "value": 15
      }
    ]
  },
  {
    "id": "mat_bcs_ginzburg_landau",
    "name": "Ginzburg–Landau Type-II Superconductor & Abrikosov Vortex Lattice",
    "domains": [
      "materials"
    ],
    "engine": "field_lattice",
    "formula": "κ = λ_L / ξ_GL > 1/√2,   H_{c2} = Φ₀ / (2π μ₀ ξ_GL²)",
    "description": "Apply magnetic field H between H_{c1} and H_{c2} to nucleate quantized Φ₀ = h/2e Abrikosov flux vortices.",
    "params": [
      {
        "key": "kappa_gl",
        "label": "Ginzburg–Landau Parameter κ",
        "min": 0.4,
        "max": 10.0,
        "step": 0.2,
        "default": 3.5,
        "type": "range",
        "value": 3.5
      },
      {
        "key": "mag_field",
        "label": "Applied Field H / H_{c2}",
        "min": 0.0,
        "max": 1.2,
        "step": 0.02,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "pinning_j",
        "label": "Defect Flux-Pinning Strength",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 60,
        "type": "range",
        "value": 60
      }
    ]
  },
  {
    "id": "mat_metamaterial_split_ring",
    "name": "Negative-Index Metamaterial (ε < 0, μ < 0) & Photonic Bandgap",
    "domains": [
      "materials"
    ],
    "engine": "wave_fourier",
    "formula": "n(ω) = −√(ε_eff(ω) μ_eff(ω)) < 0,   Snell's Reversed Refraction",
    "description": "Tune split-ring resonator LC resonance and wire plasma frequency to create a double-negative passband.",
    "params": [
      {
        "key": "freq_ghz",
        "label": "Incident Wave Frequency (GHz)",
        "min": 4.0,
        "max": 16.0,
        "step": 0.2,
        "default": 10.2,
        "type": "range",
        "value": 10.2
      },
      {
        "key": "srr_gap",
        "label": "Split-Ring Capacitive Gap (µm)",
        "min": 5,
        "max": 100,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      },
      {
        "key": "loss_tan",
        "label": "Dielectric Damping tan δ",
        "min": 0.001,
        "max": 0.1,
        "step": 0.002,
        "default": 0.01,
        "type": "range",
        "value": 0.01
      }
    ]
  },
  {
    "id": "mat_polymer_flory_visco",
    "name": "Flory–Huggins Polymer Blend & Maxwell–Zener Viscoelasticity",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "ΔG_m / RT = (φ₁/N₁)ln φ₁ + (φ₂/N₂)ln φ₂ + χ φ₁ φ₂,   G*(ω) = G'(ω) + i G''(ω)",
    "description": "Sweep frequency ω and temperature T (WLF time-temperature superposition) across the glass transition T_g.",
    "params": [
      {
        "key": "chi_flory",
        "label": "Flory–Huggins Parameter χ",
        "min": 0.0,
        "max": 1.5,
        "step": 0.02,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "chain_n",
        "label": "Degree of Polymerization N",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 120,
        "type": "range",
        "value": 120
      },
      {
        "key": "freq_log",
        "label": "Oscillation Freq log₁₀(ωτ)",
        "min": -3.0,
        "max": 3.0,
        "step": 0.1,
        "default": 0.0,
        "type": "range",
        "value": 0.0
      }
    ]
  },
  {
    "id": "mat_shape_memory_nitinol",
    "name": "Martensitic Shape-Memory Alloy (NiTi) Landau Free Energy",
    "domains": [
      "materials"
    ],
    "engine": "phase_attractor",
    "formula": "F(ε, T) = ½ a(T − T_c) ε² − ¼ b ε⁴ + ⅙ c ε⁶ − σ·ε",
    "description": "Cycle temperature T across austenite/martensite transitions to observe shape recovery and superelastic pseudoelastic loops.",
    "params": [
      {
        "key": "temp_norm",
        "label": "Normalized Temperature T / T_Af",
        "min": 0.4,
        "max": 1.8,
        "step": 0.02,
        "default": 1.15,
        "type": "range",
        "value": 1.15
      },
      {
        "key": "applied_stress",
        "label": "Applied Tensile Stress σ (MPa)",
        "min": -400,
        "max": 400,
        "step": 10,
        "default": 150,
        "type": "range",
        "value": 150
      },
      {
        "key": "twin_barrier",
        "label": "Detwinning Hysteresis Barrier",
        "min": 0.2,
        "max": 2.0,
        "step": 0.05,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      }
    ]
  },
  {
    "id": "mat_corrosion_pourbaix_tafel",
    "name": "Electrochemical Tafel Polarization & Passivation Evans Diagram",
    "domains": [
      "materials"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "η = a + b log₁₀(i / i₀),   i_corr at E_corr (Anodic = Cathodic)",
    "description": "Plot anodic metal dissolution with active-to-passive Cr₂O₃ film transition against cathodic oxygen/proton reduction.",
    "params": [
      {
        "key": "ph_sol",
        "label": "Electrolyte pH",
        "min": 0.0,
        "max": 14.0,
        "step": 0.2,
        "default": 5.5,
        "type": "range",
        "value": 5.5
      },
      {
        "key": "cr_content",
        "label": "Chromium Alloying Content (wt%)",
        "min": 0,
        "max": 24,
        "step": 1,
        "default": 13,
        "type": "range",
        "value": 13
      },
      {
        "key": "chloride_ppm",
        "label": "Pitting Chloride [Cl⁻] (mM)",
        "min": 0,
        "max": 500,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      }
    ]
  },
  {
    "id": "sys_tomasulo_ooo",
    "name": "Tomasulo Out-of-Order Execution, Register Renaming & ROB",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "RAT → Reservation Stations → CDB Broadcast → In-Order ROB Commit",
    "description": "Dispatch RAW/WAR/WAW dependent instructions across reservation stations and observe Common Data Bus wakeups.",
    "params": [
      {
        "key": "rob_size",
        "label": "Reorder Buffer Entries",
        "min": 8,
        "max": 128,
        "step": 8,
        "default": 48,
        "type": "range",
        "value": 48
      },
      {
        "key": "issue_width",
        "label": "Superscalar Issue Width",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "branch_misp",
        "label": "Branch Misprediction Rate (%)",
        "min": 0,
        "max": 25,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      }
    ]
  },
  {
    "id": "sys_mesi_cache_coherence",
    "name": "MESI / MOESI Snooping Cache Coherence & False Sharing",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "Modified ↔ Exclusive ↔ Shared ↔ Invalid  |  BusRd / BusRdX",
    "description": "Simulate multi-core read/write streams on shared cache lines and observe invalidation storms from false sharing.",
    "params": [
      {
        "key": "cores_n",
        "label": "Active CPU Cores",
        "min": 2,
        "max": 16,
        "step": 2,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "stride_bytes",
        "label": "Thread Write Stride (Bytes)",
        "min": 4,
        "max": 128,
        "step": 4,
        "default": 16,
        "type": "range",
        "value": 16
      },
      {
        "key": "write_ratio",
        "label": "Store / Load Ratio (%)",
        "min": 5,
        "max": 90,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "sys_tlb_radix_pagewalk",
    "name": "x86-64 4-Level Radix Page Table Walk & TLB HugePages",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "CR3 → PML4[47:39] → PDPT[38:30] → PD[29:21] → PT[20:12] → Offset[11:0]",
    "description": "Measure effective memory access time (EMAT) across L1/L2 TLB hits, 4KB 4-level walks, and 2MB/1GB huge pages.",
    "params": [
      {
        "key": "working_set",
        "label": "Working Set Footprint (MB)",
        "min": 4,
        "max": 4096,
        "step": 32,
        "default": 512,
        "type": "range",
        "value": 512
      },
      {
        "key": "huge_page",
        "label": "2MB HugePage Coverage (%)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 40,
        "type": "range",
        "value": 40
      },
      {
        "key": "pcid_on",
        "label": "PCID Context-Switch Tagging",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      }
    ]
  },
  {
    "id": "sys_cfs_eevdf_scheduler",
    "name": "Linux EEVDF / CFS Fair Scheduler Virtual Runtime & Latency",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "vruntime_i += Δt · (NICE_0_LOAD / weight_i),   lag_i = S_ideal − s_i ≥ 0",
    "description": "Schedule mix of latency-sensitive interactive tasks and CPU-bound batch threads on a red-black virtual-time tree.",
    "params": [
      {
        "key": "tasks_n",
        "label": "Runnable Thread Count",
        "min": 2,
        "max": 32,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "nice_spread",
        "label": "Nice Weight Spread (−20..+19)",
        "min": 0,
        "max": 39,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "slice_ms",
        "label": "Base Scheduling Quantum (ms)",
        "min": 0.5,
        "max": 20.0,
        "step": 0.5,
        "default": 3.0,
        "type": "range",
        "value": 3.0
      }
    ]
  },
  {
    "id": "sys_io_uring_sq_cq",
    "name": "Linux io_uring Submission/Completion Ring Zero-Copy Pipeline",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "User SQ Ring → SQPOLL Kernel Thread → NVMe DMA → User CQ Ring",
    "description": "Compare traditional blocking syscalls against batched io_uring SQE/CQE ring buffers with registered buffers.",
    "params": [
      {
        "key": "batch_depth",
        "label": "SQE Batch Submission Depth",
        "min": 1,
        "max": 128,
        "step": 1,
        "default": 32,
        "type": "range",
        "value": 32
      },
      {
        "key": "sqpoll_on",
        "label": "Kernel SQPOLL Mode Weight",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      },
      {
        "key": "nvme_lat_us",
        "label": "NVMe Device Latency (µs)",
        "min": 5,
        "max": 200,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "sys_ssa_dominator_regalloc",
    "name": "LLVM SSA Dominator Tree, Φ-Node Placement & Chaitin Graph Coloring",
    "domains": [
      "systems"
    ],
    "engine": "network_graph",
    "formula": "DF(X) = {Y | ∃P∈pred(Y) s.t. X dom P ∧ ¬(X sdom Y)},   k-Coloring Interference Graph",
    "description": "Compute dominance frontiers for minimal SSA φ-nodes and color the live-range register interference graph.",
    "params": [
      {
        "key": "phys_regs",
        "label": "Available Physical Registers k",
        "min": 4,
        "max": 32,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "loop_pressure",
        "label": "Loop Live-Range Pressure",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "remat_cost",
        "label": "Spill vs Rematerialization Bias",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "sys_polyhedral_loop_tile",
    "name": "MLIR Polyhedral Loop Tiling, Skewing & Roofline Model",
    "domains": [
      "systems"
    ],
    "engine": "field_lattice",
    "formula": "OI = FLOPs / Bytes,   Perf ≤ min(Peak_FLOPs, OI × Peak_BW)",
    "description": "Transform nested loop iteration spaces via unimodular skewing and L1/L2 cache tiling to climb the Roofline ridge.",
    "params": [
      {
        "key": "tile_size",
        "label": "Cache Tile Blocking Size T",
        "min": 4,
        "max": 128,
        "step": 4,
        "default": 32,
        "type": "range",
        "value": 32
      },
      {
        "key": "simd_lanes",
        "label": "AVX-512 / Tensor Vector Lanes",
        "min": 1,
        "max": 16,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "mem_bw_gbs",
        "label": "DRAM Bandwidth (GB/s)",
        "min": 50,
        "max": 3000,
        "step": 50,
        "default": 900,
        "type": "range",
        "value": 900
      }
    ]
  },
  {
    "id": "sys_gpu_warp_divergence",
    "name": "CUDA Warp SIMT Divergence, Shared Memory Bank Conflicts & Occupancy",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "32 Threads/Warp  |  32 Shared-Memory Banks (4B stride)  |  Active Warps / SM",
    "description": "Visualize SIMT branch serialization masks and stride-induced 32-way shared-memory bank conflicts.",
    "params": [
      {
        "key": "branch_div",
        "label": "Intra-Warp Branch Divergence (%)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 20,
        "type": "range",
        "value": 20
      },
      {
        "key": "bank_stride",
        "label": "Shared Memory Access Stride",
        "min": 1,
        "max": 32,
        "step": 1,
        "default": 1,
        "type": "range",
        "value": 1
      },
      {
        "key": "regs_per_th",
        "label": "Registers per Thread",
        "min": 16,
        "max": 128,
        "step": 4,
        "default": 48,
        "type": "range",
        "value": 48
      }
    ]
  },
  {
    "id": "sys_tensor_core_mma",
    "name": "GPU Tensor Core m16n8k16 MMA & Async TMA Double-Buffering",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "D = A_{16×16} · B_{16×8} + C_{16×8},   TMA Global→Shared Producer/Consumer Barrier",
    "description": "Overlap Tensor Memory Accelerator (TMA) global loads with warp-group WGMMA matrix multiply-accumulate.",
    "params": [
      {
        "key": "pipe_stages",
        "label": "Async Shared-Mem Stages",
        "min": 1,
        "max": 6,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "math_util",
        "label": "Compute-to-Memory Ratio",
        "min": 10,
        "max": 200,
        "step": 5,
        "default": 85,
        "type": "range",
        "value": 85
      },
      {
        "key": "swizzle_on",
        "label": "XOR Shared-Mem Swizzling",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 100,
        "type": "range",
        "value": 100
      }
    ]
  },
  {
    "id": "sys_raft_log_consensus",
    "name": "Raft Distributed Consensus: Leader Election & Log Replication",
    "domains": [
      "systems"
    ],
    "engine": "network_graph",
    "formula": "CommitIndex advances when entry replicated on ⌊N/2⌋ + 1 followers in current Term",
    "description": "Partition the network, trigger randomized election timeouts, and verify log matching safety across terms.",
    "params": [
      {
        "key": "cluster_n",
        "label": "Cluster Nodes N (odd)",
        "min": 3,
        "max": 9,
        "step": 2,
        "default": 5,
        "type": "range",
        "value": 5
      },
      {
        "key": "packet_drop",
        "label": "Network Partition / Drop (%)",
        "min": 0,
        "max": 50,
        "step": 2,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "heartbeat_ms",
        "label": "Leader Heartbeat Interval (ms)",
        "min": 20,
        "max": 200,
        "step": 10,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "sys_lsm_tree_compaction",
    "name": "LSM-Tree (RocksDB) MemTable, Bloom Filters & Leveled Compaction",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "Write Amp vs Read Amp vs Space Amp  |  Bloom FPR ≈ (0.6185)^{m/n}",
    "description": "Tune level size multiplier T, Bloom filter bits per key, and tiered vs leveled SSTable compaction.",
    "params": [
      {
        "key": "level_mult",
        "label": "Level Size Multiplier T",
        "min": 2,
        "max": 16,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "bloom_bits",
        "label": "Bloom Filter Bits per Key",
        "min": 2,
        "max": 20,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "write_heavy",
        "label": "Workload Write Ratio (%)",
        "min": 5,
        "max": 95,
        "step": 5,
        "default": 60,
        "type": "range",
        "value": 60
      }
    ]
  },
  {
    "id": "sys_btree_mvcc_wal",
    "name": "B+Tree Page Splits, Write-Ahead Logging (ARIES) & MVCC Snapshot",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "WAL LSN ≥ PageLSN before flush  |  xmin ≤ TxSnapshot < xmax",
    "description": "Simulate concurrent OLTP transactions, B+Tree node splits, steal/no-force ARIES redo/undo recovery, and vacuuming.",
    "params": [
      {
        "key": "fanout_b",
        "label": "B+Tree Node Fanout",
        "min": 4,
        "max": 64,
        "step": 4,
        "default": 16,
        "type": "range",
        "value": 16
      },
      {
        "key": "long_tx",
        "label": "Long-Running Snapshot Hold",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 20,
        "type": "range",
        "value": 20
      },
      {
        "key": "ckpt_freq",
        "label": "Fuzzy Checkpoint Frequency",
        "min": 10,
        "max": 100,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "sys_tcp_bbr_congestion",
    "name": "TCP BBR vs CUBIC Congestion Control & Bandwidth-Delay Pipe",
    "domains": [
      "systems"
    ],
    "engine": "wave_fourier",
    "formula": "BDP = BtlBw × RTprop,   cwnd = gain × BDP",
    "description": "Compare CUBIC bufferbloattooth oscillations against BBR bottleneck bandwidth and min-RTT probing.",
    "params": [
      {
        "key": "btl_bw_mbps",
        "label": "Bottleneck Link (Mbps)",
        "min": 10,
        "max": 1000,
        "step": 10,
        "default": 200,
        "type": "range",
        "value": 200
      },
      {
        "key": "rt_prop_ms",
        "label": "Propagation RTT (ms)",
        "min": 5,
        "max": 300,
        "step": 5,
        "default": 60,
        "type": "range",
        "value": 60
      },
      {
        "key": "buf_bdp",
        "label": "Router Queue Buffer / BDP",
        "min": 0.2,
        "max": 8.0,
        "step": 0.2,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      }
    ]
  },
  {
    "id": "sys_rdma_roce_allreduce",
    "name": "RDMA Ring/Tree All-Reduce & NVLink Collective Topology",
    "domains": [
      "systems"
    ],
    "engine": "network_graph",
    "formula": "T_{Ring} = 2(N−1) · (M / N) / B + 2(N−1)α",
    "description": "Compare Ring All-Reduce vs Halving-Doubling Tree latency and bandwidth utilization across GPU nodes.",
    "params": [
      {
        "key": "gpu_nodes",
        "label": "Distributed GPU Ranks N",
        "min": 2,
        "max": 64,
        "step": 2,
        "default": 16,
        "type": "range",
        "value": 16
      },
      {
        "key": "tensor_mb",
        "label": "Gradient Tensor Size (MB)",
        "min": 1,
        "max": 1024,
        "step": 16,
        "default": 128,
        "type": "range",
        "value": 128
      },
      {
        "key": "link_gbps",
        "label": "Interconnect Bandwidth (Gbps)",
        "min": 25,
        "max": 800,
        "step": 25,
        "default": 400,
        "type": "range",
        "value": 400
      }
    ]
  },
  {
    "id": "sys_garbage_collector_tri",
    "name": "Tri-Color Concurrent Mark-Sweep & Generational Write Barrier",
    "domains": [
      "systems"
    ],
    "engine": "network_graph",
    "formula": "White (Unvisited) → Grey (Frontier) → Black (Scanned)  |  Dijkstra/Yuasa Barrier",
    "description": "Mutate object references concurrently with the GC marker and see how write barriers preserve the tri-color invariant.",
    "params": [
      {
        "key": "alloc_rate",
        "label": "Mutator Allocation Rate",
        "min": 10,
        "max": 200,
        "step": 5,
        "default": 65,
        "type": "range",
        "value": 65
      },
      {
        "key": "young_ratio",
        "label": "Nursery Generation Fraction (%)",
        "min": 10,
        "max": 60,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      },
      {
        "key": "conc_threads",
        "label": "Concurrent GC Marker Threads",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      }
    ]
  },
  {
    "id": "sys_ebpf_verifier_jit",
    "name": "Linux eBPF Abstract Interpretation Verifier & XDP Packet Drop",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "R0..R10 Bounded Scalar/Ptr Tracking  |  DAG Termination & Map Bounds Check",
    "description": "Trace eBPF register range bounds through conditional branches and benchmark XDP driver-level packet processing.",
    "params": [
      {
        "key": "prog_insns",
        "label": "eBPF Bytecode Instructions",
        "min": 16,
        "max": 512,
        "step": 16,
        "default": 128,
        "type": "range",
        "value": 128
      },
      {
        "key": "pkt_mpps",
        "label": "Incoming Traffic Rate (Mpps)",
        "min": 1,
        "max": 40,
        "step": 1,
        "default": 14,
        "type": "range",
        "value": 14
      },
      {
        "key": "map_lookups",
        "label": "Per-Packet BPF Map Lookups",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      }
    ]
  },
  {
    "id": "sys_lockfree_cas_aba",
    "name": "Lock-Free Treiber Stack, Compare-And-Swap (CAS) & Hazard Pointers",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "CAS(&head, old_head, new_node)  |  Tagged Pointer [aba_tag : 16 | ptr : 48]",
    "description": "Simulate high-contention atomic CAS retries, reproduce the ABA memory reclamation bug, and fix it with epoch/hazard pointers.",
    "params": [
      {
        "key": "threads_n",
        "label": "Contending Hardware Threads",
        "min": 2,
        "max": 32,
        "step": 2,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "backoff_ns",
        "label": "Exponential CAS Backoff (ns)",
        "min": 0,
        "max": 500,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      },
      {
        "key": "aba_guard",
        "label": "Epoch / Tagged Pointer Guard",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 100,
        "type": "range",
        "value": 100
      }
    ]
  },
  {
    "id": "sys_jemalloc_slab_arena",
    "name": "Per-Thread Arena Slab Allocator & External Fragmentation Map",
    "domains": [
      "systems"
    ],
    "engine": "field_lattice",
    "formula": "Size Classes [8, 16, 32, 48, 64…]  |  Thread-Local Magazine → Central Slab",
    "description": "Visualize virtual memory slab occupancy, buddy coalescing, and fragmentation under mixed-lifetime workloads.",
    "params": [
      {
        "key": "size_var",
        "label": "Allocation Size Variance",
        "min": 5,
        "max": 100,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      },
      {
        "key": "arena_count",
        "label": "Per-Core Malloc Arenas",
        "min": 1,
        "max": 16,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "decay_ms",
        "label": "Dirty Page Purge Decay (ms)",
        "min": 100,
        "max": 5000,
        "step": 100,
        "default": 1000,
        "type": "range",
        "value": 1000
      }
    ]
  },
  {
    "id": "sys_erasure_reed_solomon",
    "name": "Distributed Storage Reed–Solomon Erasure Coding (k + m)",
    "domains": [
      "systems"
    ],
    "engine": "systems_hardware",
    "formula": "d_parity = V_{m×k} · d_data  ∈ GF(2⁸),   Tolerates any m disk failures",
    "description": "Compare 3x replication against RS(10,4) and Local Reconstruction Codes (LRC) for durability vs rebuild bandwidth.",
    "params": [
      {
        "key": "data_shards",
        "label": "Data Shards k",
        "min": 4,
        "max": 16,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "parity_shards",
        "label": "Coding Parity Shards m",
        "min": 1,
        "max": 6,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "disk_fail_r",
        "label": "Annualized Disk Failure Rate (%)",
        "min": 0.5,
        "max": 10.0,
        "step": 0.5,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      }
    ]
  },
  {
    "id": "sys_chandy_lamport_clock",
    "name": "Vector Clocks & Chandy–Lamport Consistent Distributed Snapshot",
    "domains": [
      "systems"
    ],
    "engine": "network_graph",
    "formula": "e₁ → e₂  ⇔  VC(e₁) < VC(e₂),   Marker Channel State Recording",
    "description": "Pass messages across asynchronous processes, detect causal concurrency, and capture a consistent global cut.",
    "params": [
      {
        "key": "nodes_n",
        "label": "Distributed Processes N",
        "min": 3,
        "max": 8,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "msg_rate",
        "label": "Inter-Node Message Rate",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "clock_skew",
        "label": "Physical Clock Skew / Jitter",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "cx_lorenz_lyapunov",
    "name": "Lorenz Butterfly Attractor & Maximal Lyapunov Exponent λ₁",
    "domains": [
      "complex_systems"
    ],
    "engine": "phase_attractor",
    "formula": "dx/dt = σ(y−x),  dy/dt = x(ρ−z)−y,  dz/dt = xy − βz,   |δx(t)| ≈ |δx₀| e^{λ₁ t}",
    "description": "Launch two infinitesimally separated trajectories (10⁻⁵) and measure exponential divergence time on the strange attractor.",
    "params": [
      {
        "key": "sigma_p",
        "label": "Prandtl Number σ",
        "min": 4.0,
        "max": 20.0,
        "step": 0.5,
        "default": 10.0,
        "type": "range",
        "value": 10.0
      },
      {
        "key": "rho_r",
        "label": "Rayleigh Number ρ",
        "min": 10.0,
        "max": 45.0,
        "step": 0.5,
        "default": 28.0,
        "type": "range",
        "value": 28.0
      },
      {
        "key": "beta_b",
        "label": "Geometric Ratio β",
        "min": 0.5,
        "max": 4.0,
        "step": 0.1,
        "default": 2.67,
        "type": "range",
        "value": 2.67
      }
    ]
  },
  {
    "id": "cx_feigenbaum_logistic",
    "name": "Logistic Map Period-Doubling Cascade & Feigenbaum δ ≈ 4.669",
    "domains": [
      "complex_systems"
    ],
    "engine": "wave_fourier",
    "formula": "x_{n+1} = r x_n (1 − x_n),   δ = lim (r_k − r_{k-1})/(r_{k+1} − r_k) = 4.6692016…",
    "description": "Sweep growth parameter r from 2.8 to 4.0 to inspect cobweb diagrams, period-doubling bifurcations, and periodic islands.",
    "params": [
      {
        "key": "r_param",
        "label": "Control Parameter r",
        "min": 2.8,
        "max": 4.0,
        "step": 0.005,
        "default": 3.72,
        "type": "range",
        "value": 3.72
      },
      {
        "key": "init_x0",
        "label": "Initial Seed x₀",
        "min": 0.05,
        "max": 0.95,
        "step": 0.02,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      },
      {
        "key": "lyap_window",
        "label": "Orbit Iteration Depth",
        "min": 20,
        "max": 200,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      }
    ]
  },
  {
    "id": "cx_kuramoto_sync",
    "name": "Kuramoto Coupled Phase Oscillators & Order Parameter r(K)",
    "domains": [
      "complex_systems"
    ],
    "engine": "phase_attractor",
    "formula": "dθ_i/dt = ω_i + (K/N) Σ_j sin(θ_j − θ_i),   r e^{iψ} = (1/N) Σ e^{iθ_j}",
    "description": "Increase coupling K past the critical threshold K_c = 2/(π g(0)) to witness macroscopic phase synchronization.",
    "params": [
      {
        "key": "coupling_k",
        "label": "Coupling Strength K",
        "min": 0.0,
        "max": 5.0,
        "step": 0.05,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "freq_spread",
        "label": "Natural Frequency Spread γ",
        "min": 0.1,
        "max": 2.0,
        "step": 0.05,
        "default": 0.6,
        "type": "range",
        "value": 0.6
      },
      {
        "key": "phase_lag",
        "label": "Sakaguchi Frustration α",
        "min": 0.0,
        "max": 1.5,
        "step": 0.05,
        "default": 0.0,
        "type": "range",
        "value": 0.0
      }
    ]
  },
  {
    "id": "cx_ising_onsager_rg",
    "name": "2D Ising Ferromagnet & Onsager Critical Temperature T_c",
    "domains": [
      "complex_systems"
    ],
    "engine": "field_lattice",
    "formula": "H = −J Σ_{⟨i,j⟩} s_i s_j − h Σ_i s_i,   k_B T_c / J = 2 / ln(1 + √2) ≈ 2.269",
    "description": "Tune temperature T through T_c = 2.269 J/k_B to observe scale-invariant spin clusters and spontaneous magnetization.",
    "params": [
      {
        "key": "temp_t",
        "label": "Reduced Temperature T / T_c",
        "min": 0.2,
        "max": 2.5,
        "step": 0.02,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "ext_field_h",
        "label": "External Magnetic Field h",
        "min": -1.0,
        "max": 1.0,
        "step": 0.02,
        "default": 0.0,
        "type": "range",
        "value": 0.0
      },
      {
        "key": "rg_block",
        "label": "Kadanoff Block-Spin Scale b",
        "min": 1,
        "max": 4,
        "step": 1,
        "default": 1,
        "type": "range",
        "value": 1
      }
    ]
  },
  {
    "id": "cx_percolation_giant",
    "name": "Site/Bond Percolation Threshold p_c & Fractal Cluster Spanning",
    "domains": [
      "complex_systems"
    ],
    "engine": "field_lattice",
    "formula": "P_∞(p) ∝ (p − p_c)^β,   ξ(p) ∝ |p − p_c|^{−ν}   (p_c ≈ 0.5927 on 2D square)",
    "description": "Sweep occupation probability p across p_c to watch the giant spanning cluster emerge with fractal dimension d_f = 91/48.",
    "params": [
      {
        "key": "occ_prob_p",
        "label": "Site Occupation Probability p",
        "min": 0.1,
        "max": 0.95,
        "step": 0.01,
        "default": 0.59,
        "type": "range",
        "value": 0.59
      },
      {
        "key": "anisotropy",
        "label": "Directional Bond Bias",
        "min": 0.5,
        "max": 1.5,
        "step": 0.05,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "lattice_l",
        "label": "Effective Grid Scale",
        "min": 16,
        "max": 64,
        "step": 4,
        "default": 38,
        "type": "range",
        "value": 38
      }
    ]
  },
  {
    "id": "cx_barabasi_scale_free",
    "name": "Barabási–Albert Preferential Attachment & Achilles' Heel Attack",
    "domains": [
      "complex_systems"
    ],
    "engine": "network_graph",
    "formula": "Π(k_i) = k_i / Σ_j k_j  ⇒  P(k) ∝ k^{−3}",
    "description": "Compare scale-free vs Erdős–Rényi network robustness under random node failures vs targeted hub removal.",
    "params": [
      {
        "key": "attach_exp",
        "label": "Attachment Exponent α (k^α)",
        "min": 0.2,
        "max": 2.0,
        "step": 0.1,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      },
      {
        "key": "hub_attack",
        "label": "Targeted Hub Removal (%)",
        "min": 0,
        "max": 50,
        "step": 2,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "mean_deg",
        "label": "New Node Edges m",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      }
    ]
  },
  {
    "id": "cx_watts_strogatz",
    "name": "Watts–Strogatz Small-World Rewiring (Clustering C(p) vs Path L(p))",
    "domains": [
      "complex_systems"
    ],
    "engine": "network_graph",
    "formula": "L(p)/L(0) ≪ 1  while  C(p)/C(0) ≈ 1   for 0.001 < p < 0.1",
    "description": "Rewire ring-lattice edges with probability p and watch average path length collapse while local clustering stays high.",
    "params": [
      {
        "key": "rewire_p",
        "label": "Log₁₀ Rewiring Probability p",
        "min": -4.0,
        "max": 0.0,
        "step": 0.1,
        "default": -1.8,
        "type": "range",
        "value": -1.8
      },
      {
        "key": "neighbors_k",
        "label": "Lattice Neighbors K",
        "min": 2,
        "max": 10,
        "step": 2,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "nodes_n",
        "label": "Ring Network Size N",
        "min": 12,
        "max": 48,
        "step": 4,
        "default": 24,
        "type": "range",
        "value": 24
      }
    ]
  },
  {
    "id": "cx_seir_metapopulation",
    "name": "Network SEIR Epidemic Threshold & Spectral Radius R₀ = β/γ · λ_max(A)",
    "domains": [
      "complex_systems"
    ],
    "engine": "network_graph",
    "formula": "τ_c = 1 / λ_max(A),   dI_i/dt = β S_i Σ_j A_{ij} I_j − γ I_i",
    "description": "Simulate contagion spreading across commuter mobility networks and compare ring vaccination vs hub quarantine.",
    "params": [
      {
        "key": "beta_trans",
        "label": "Transmission Rate β",
        "min": 0.05,
        "max": 1.2,
        "step": 0.02,
        "default": 0.38,
        "type": "range",
        "value": 0.38
      },
      {
        "key": "gamma_rec",
        "label": "Recovery Rate γ",
        "min": 0.05,
        "max": 0.8,
        "step": 0.02,
        "default": 0.18,
        "type": "range",
        "value": 0.18
      },
      {
        "key": "vax_hubs",
        "label": "Targeted Hub Immunization (%)",
        "min": 0,
        "max": 80,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "cx_bak_sandpile_soc",
    "name": "Bak–Tang–Wiesenfeld Abelian Sandpile Self-Organized Criticality",
    "domains": [
      "complex_systems"
    ],
    "engine": "field_lattice",
    "formula": "z_i ≥ 4  ⇒  z_i → z_i − 4,  z_{nn} → z_{nn} + 1,   P(s) ∝ s^{−τ}",
    "description": "Drop grains onto a lattice until it self-organizes to the critical slope with power-law avalanche distributions.",
    "params": [
      {
        "key": "drop_rate",
        "label": "Grain Addition Rate",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 5,
        "type": "range",
        "value": 5
      },
      {
        "key": "dissipation",
        "label": "Boundary Openness / Dissipation",
        "min": 1,
        "max": 50,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "thresh_z",
        "label": "Toppling Slope Threshold",
        "min": 3,
        "max": 8,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      }
    ]
  },
  {
    "id": "cx_schelling_segregation",
    "name": "Schelling Micromotives Tipping Point & Spatial Segregation",
    "domains": [
      "complex_systems"
    ],
    "engine": "field_lattice",
    "formula": "U_i = 1  iff  (Same-Type Neighbors / Total Neighbors) ≥ τ_tol",
    "description": "See how mild individual tolerance thresholds (τ ≈ 33%) trigger macroscopic residential phase separation.",
    "params": [
      {
        "key": "tolerance_tau",
        "label": "Homophily Threshold τ (%)",
        "min": 10,
        "max": 85,
        "step": 2,
        "default": 35,
        "type": "range",
        "value": 35
      },
      {
        "key": "vacancy_pct",
        "label": "Empty Housing Vacancy (%)",
        "min": 2,
        "max": 40,
        "step": 2,
        "default": 15,
        "type": "range",
        "value": 15
      },
      {
        "key": "vision_rad",
        "label": "Neighborhood Radius r",
        "min": 1,
        "max": 4,
        "step": 1,
        "default": 1,
        "type": "range",
        "value": 1
      }
    ]
  },
  {
    "id": "cx_vicsek_flocking",
    "name": "Vicsek Active Matter Flocking & Orientational Phase Transition",
    "domains": [
      "complex_systems"
    ],
    "engine": "phase_attractor",
    "formula": "θ_i(t+Δt) = ⟨θ_j(t)⟩_{|r_i−r_j|<R} + η ξ_i,   Φ = (1/N v₀)|Σ v_i|",
    "description": "Tune angular noise η and particle density ρ to trigger spontaneous collective flocking and band formation.",
    "params": [
      {
        "key": "noise_eta",
        "label": "Angular Noise Amplitude η",
        "min": 0.05,
        "max": 3.0,
        "step": 0.05,
        "default": 0.65,
        "type": "range",
        "value": 0.65
      },
      {
        "key": "density_rho",
        "label": "Swarm Density ρ",
        "min": 0.5,
        "max": 6.0,
        "step": 0.2,
        "default": 2.4,
        "type": "range",
        "value": 2.4
      },
      {
        "key": "align_rad",
        "label": "Interaction Radius R",
        "min": 0.2,
        "max": 2.0,
        "step": 0.1,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      }
    ]
  },
  {
    "id": "cx_gray_scott_turing",
    "name": "Gray–Scott Reaction–Diffusion Spots, Stripes & Mitosis Waves",
    "domains": [
      "complex_systems"
    ],
    "engine": "field_lattice",
    "formula": "∂u/∂t = D_u ∇²u − uv² + F(1−u),   ∂v/∂t = D_v ∇²v + uv² − (F+k)v",
    "description": "Navigate the Pearson (F, k) phase diagram to morph self-replicating spots into labyrinths and spiral waves.",
    "params": [
      {
        "key": "feed_f",
        "label": "Feed Rate F",
        "min": 0.015,
        "max": 0.08,
        "step": 0.002,
        "default": 0.037,
        "type": "range",
        "value": 0.037
      },
      {
        "key": "kill_k",
        "label": "Kill Rate k",
        "min": 0.04,
        "max": 0.07,
        "step": 0.001,
        "default": 0.06,
        "type": "range",
        "value": 0.06
      },
      {
        "key": "diff_ratio",
        "label": "Diffusivity Ratio D_u / D_v",
        "min": 1.5,
        "max": 3.0,
        "step": 0.1,
        "default": 2.0,
        "type": "range",
        "value": 2.0
      }
    ]
  },
  {
    "id": "cx_cascade_overload",
    "name": "Motter–Lai Power Grid Cascading Overload & Braess Line Trip",
    "domains": [
      "complex_systems"
    ],
    "engine": "network_graph",
    "formula": "L_i(t) > (1 + α) L_i(0)  ⇒  Node/Edge Trips & Load Redistributes",
    "description": "Trip a high-betweenness transmission line and watch non-local shortest-path load redistribution trigger blackouts.",
    "params": [
      {
        "key": "tol_alpha",
        "label": "Capacity Safety Margin α",
        "min": 0.05,
        "max": 1.0,
        "step": 0.05,
        "default": 0.3,
        "type": "range",
        "value": 0.3
      },
      {
        "key": "init_shock",
        "label": "Initial Substation Fault Severity",
        "min": 1,
        "max": 10,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "island_shed",
        "label": "Autonomous Load-Shedding",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "cx_hegselmann_krause",
    "name": "Hegselmann–Krause Bounded Confidence Opinion Polarization",
    "domains": [
      "complex_systems"
    ],
    "engine": "neural_manifold",
    "formula": "x_i(t+1) = |N_i(t)|⁻¹ Σ_{j : |x_i − x_j| ≤ ε} x_j(t)",
    "description": "Adjust confidence bound ε to watch consensus fracture into bipartisan polarization or fragmented echo chambers.",
    "params": [
      {
        "key": "eps_bound",
        "label": "Confidence Bound ε",
        "min": 0.05,
        "max": 0.6,
        "step": 0.01,
        "default": 0.18,
        "type": "range",
        "value": 0.18
      },
      {
        "key": "extremist_w",
        "label": "Zealot / Stubborn Agent Weight",
        "min": 0,
        "max": 50,
        "step": 2,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "algo_amp",
        "label": "Algorithmic Homophily Boost",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 30,
        "type": "range",
        "value": 30
      }
    ]
  },
  {
    "id": "cx_early_warning_csd",
    "name": "Critical Slowing Down (CSD) Early-Warning Signals of Bifurcation",
    "domains": [
      "complex_systems"
    ],
    "engine": "wave_fourier",
    "formula": "λ_rec → 0  ⇒  Var(x) = σ²/(2|λ|) → ∞,   AC(1) = exp(−|λ|Δt) → 1",
    "description": "Monitor rising lag-1 autocorrelation and variance as an ecosystem or climate state approaches a fold tipping point.",
    "params": [
      {
        "key": "stress_mu",
        "label": "Bifurcation Stress Parameter μ",
        "min": 0.0,
        "max": 0.99,
        "step": 0.01,
        "default": 0.78,
        "type": "range",
        "value": 0.78
      },
      {
        "key": "noise_sigma",
        "label": "Environmental Perturbation σ",
        "min": 0.02,
        "max": 0.5,
        "step": 0.02,
        "default": 0.12,
        "type": "range",
        "value": 0.12
      },
      {
        "key": "window_len",
        "label": "Rolling Window Length",
        "min": 20,
        "max": 200,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      }
    ]
  },
  {
    "id": "cx_may_wigner_stability",
    "name": "May–Wigner Random Ecosystem Stability Circular Law",
    "domains": [
      "complex_systems"
    ],
    "engine": "neural_manifold",
    "formula": "σ √(S · C) < d   (May's Stability Criterion for S Species, Connectance C)",
    "description": "Plot the Girko-May eigenvalue disk of random community matrices and cross the complexity-instability boundary.",
    "params": [
      {
        "key": "species_s",
        "label": "Species Richness S",
        "min": 10,
        "max": 200,
        "step": 5,
        "default": 80,
        "type": "range",
        "value": 80
      },
      {
        "key": "connect_c",
        "label": "Trophic Connectance C",
        "min": 0.05,
        "max": 0.8,
        "step": 0.05,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      },
      {
        "key": "inter_sigma",
        "label": "Interaction Strength σ",
        "min": 0.1,
        "max": 2.0,
        "step": 0.05,
        "default": 0.6,
        "type": "range",
        "value": 0.6
      }
    ]
  },
  {
    "id": "cx_jarzynski_crooks",
    "name": "Jarzynski Equality & Crooks Fluctuation Theorem Nonequilibrium Work",
    "domains": [
      "complex_systems"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "⟨exp(−β W)⟩ = exp(−β ΔF),   P_F(W) / P_R(−W) = exp(β(W − ΔF))",
    "description": "Pull an optical trap at finite speed v_pull and recover equilibrium free energy ΔF from irreversible work histograms.",
    "params": [
      {
        "key": "pull_speed",
        "label": "Protocol Pulling Speed v",
        "min": 0.1,
        "max": 10.0,
        "step": 0.2,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "trajectories",
        "label": "Ensemble Trajectories N",
        "min": 20,
        "max": 1000,
        "step": 20,
        "default": 300,
        "type": "range",
        "value": 300
      },
      {
        "key": "temp_beta",
        "label": "Inverse Thermal Energy β",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.0,
        "type": "range",
        "value": 1.0
      }
    ]
  },
  {
    "id": "cx_west_allometric_urban",
    "name": "West–Brown–Enquist 3/4 Metabolic & Bettencourt Urban Scaling",
    "domains": [
      "complex_systems"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "B ∝ M^{3/4} (Sublinear Infrastructure β≈0.85)  vs  Y ∝ N^{1.15} (Superlinear Innovation)",
    "description": "Compare fractal vascular resource distribution (β = 3/4) against superlinear urban socioeconomic scaling (β ≈ 1.15).",
    "params": [
      {
        "key": "pop_log",
        "label": "Log₁₀ Organism / City Size",
        "min": 1.0,
        "max": 8.0,
        "step": 0.2,
        "default": 5.0,
        "type": "range",
        "value": 5.0
      },
      {
        "key": "fractal_d",
        "label": "Space-Filling Network Dimension D",
        "min": 2.0,
        "max": 3.0,
        "step": 0.05,
        "default": 3.0,
        "type": "range",
        "value": 3.0
      },
      {
        "key": "social_deg",
        "label": "Social Interaction Density",
        "min": 0.8,
        "max": 1.4,
        "step": 0.02,
        "default": 1.15,
        "type": "range",
        "value": 1.15
      }
    ]
  },
  {
    "id": "cx_minor_game_el_farol",
    "name": "El Farol Bar & Challet–Zhang Minority Game Volatility Clustering",
    "domains": [
      "complex_systems"
    ],
    "engine": "wave_fourier",
    "formula": "A(t) = Σ_{i=1}^N a_i(t),   Payoff = −a_i(t) · sign(A(t)),   α = 2^m / N",
    "description": "Sweep memory complexity α = 2^m / N through the Savit phase transition where crowd predictability vanishes.",
    "params": [
      {
        "key": "memory_m",
        "label": "Agent Strategy History Bits m",
        "min": 1,
        "max": 12,
        "step": 1,
        "default": 5,
        "type": "range",
        "value": 5
      },
      {
        "key": "agents_n",
        "label": "Competing Agents N",
        "min": 21,
        "max": 501,
        "step": 20,
        "default": 101,
        "type": "range",
        "value": 101
      },
      {
        "key": "strategies_s",
        "label": "Strategies per Agent S",
        "min": 2,
        "max": 8,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      }
    ]
  },
  {
    "id": "cx_fokker_planck_kramers",
    "name": "Fokker–Planck Double-Well & Kramers Escape Rate",
    "domains": [
      "complex_systems"
    ],
    "engine": "wave_fourier",
    "formula": "∂P/∂t = ∂/∂x[U'(x)P] + D ∂²P/∂x²,   r_K = (√(|U''(x_a)U''(x_b)|)/2π) exp(−ΔU/D)",
    "description": "Watch probability density P(x,t) diffuse and tunnel thermally across a bistable potential barrier ΔU.",
    "params": [
      {
        "key": "barrier_du",
        "label": "Potential Barrier Height ΔU",
        "min": 0.2,
        "max": 4.0,
        "step": 0.1,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      },
      {
        "key": "noise_d",
        "label": "Thermal Noise Intensity D",
        "min": 0.05,
        "max": 2.0,
        "step": 0.05,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "tilt_force",
        "label": "Asymmetric Driving Force F",
        "min": -1.0,
        "max": 1.0,
        "step": 0.05,
        "default": 0.1,
        "type": "range",
        "value": 0.1
      }
    ]
  },
  {
    "id": "geo_richardson_arms_race",
    "name": "Richardson Arms Race Differential Equations & Stability",
    "domains": [
      "geopolitics"
    ],
    "engine": "phase_attractor",
    "formula": "dx/dt = k·y − α·x + g,   dy/dt = l·x − β·y + h   (Stable iff αβ > kl)",
    "description": "Tune mutual threat reactivity (k, l), economic fatigue (α, β), and underlying grievances (g, h).",
    "params": [
      {
        "key": "react_kl",
        "label": "Mutual Threat Reactivity √(kl)",
        "min": 0.1,
        "max": 3.0,
        "step": 0.05,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "fatigue_ab",
        "label": "Economic Cost Damping √(αβ)",
        "min": 0.1,
        "max": 3.0,
        "step": 0.05,
        "default": 1.4,
        "type": "range",
        "value": 1.4
      },
      {
        "key": "grievance_g",
        "label": "Structural Grievance Index g",
        "min": -1.0,
        "max": 2.0,
        "step": 0.1,
        "default": 0.5,
        "type": "range",
        "value": 0.5
      }
    ]
  },
  {
    "id": "geo_lanchester_attrition",
    "name": "Lanchester Square Law vs Linear Law & Salvo Missile Exchange",
    "domains": [
      "geopolitics"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "dR/dt = −β B,  dB/dt = −α R  ⇒  α(R₀² − R²) = β(B₀² − B²)",
    "description": "Compare aimed-fire concentration (Square Law) against area fire and Hughes naval missile salvo defense.",
    "params": [
      {
        "key": "force_ratio",
        "label": "Initial Force Ratio B₀ / R₀",
        "min": 0.5,
        "max": 2.5,
        "step": 0.05,
        "default": 1.25,
        "type": "range",
        "value": 1.25
      },
      {
        "key": "qual_ratio",
        "label": "Firepower Effectiveness α / β",
        "min": 0.4,
        "max": 3.0,
        "step": 0.05,
        "default": 1.1,
        "type": "range",
        "value": 1.1
      },
      {
        "key": "def_intercept",
        "label": "Point-Defense Interceptor Rate",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "geo_schelling_brinkmanship",
    "name": "Schelling Threat That Leaves Something to Chance & Brinkmanship",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "U_challenger(q) = q·V − (1 − q)·s(t)·C_nuclear",
    "description": "Walk down the escalation ladder where autonomous risk s(t) forces mutual resolve testing under incomplete information.",
    "params": [
      {
        "key": "auto_risk",
        "label": "Autonomous Escalation Hazard s",
        "min": 0.01,
        "max": 0.5,
        "step": 0.01,
        "default": 0.12,
        "type": "range",
        "value": 0.12
      },
      {
        "key": "stake_asymm",
        "label": "Homeland / Vital Interest Asymmetry",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      },
      {
        "key": "hand_tying",
        "label": "Audience Cost Commitment",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 60,
        "type": "range",
        "value": 60
      }
    ]
  },
  {
    "id": "geo_fearon_bargaining",
    "name": "Fearon Bargaining Range of War: Information vs Commitment Problems",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "Bargaining Range = [p − c_A,  p + c_B],   Rapid Power Shift Δp > c_A + c_B",
    "description": "Visualize why rational states fight when preventive power shifts or private military capabilities collapse the peaceful range.",
    "params": [
      {
        "key": "win_prob_p",
        "label": "True Balance of Power p",
        "min": 0.1,
        "max": 0.9,
        "step": 0.02,
        "default": 0.55,
        "type": "range",
        "value": 0.55
      },
      {
        "key": "war_cost_c",
        "label": "Combined Cost of War c_A + c_B",
        "min": 0.05,
        "max": 0.6,
        "step": 0.02,
        "default": 0.22,
        "type": "range",
        "value": 0.22
      },
      {
        "key": "power_shift",
        "label": "Future Power Shift Δp (Preventive)",
        "min": 0.0,
        "max": 0.5,
        "step": 0.02,
        "default": 0.15,
        "type": "range",
        "value": 0.15
      }
    ]
  },
  {
    "id": "geo_nuclear_second_strike",
    "name": "Second-Strike Survivability, MIRV De-MIRVing & Crisis Stability",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "N_surv = N_0 (1 − P_k)^{r_warheads} + N_SSBN,   First-Strike Incentive Index",
    "description": "Compare heavy MIRVed silo ICBM vulnerability against dispersed road-mobile and SSBN triad forces.",
    "params": [
      {
        "key": "mirv_ratio",
        "label": "Warheads per ICBM (MIRV)",
        "min": 1,
        "max": 10,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "sspk",
        "label": "Single-Shot Kill Prob SSPK",
        "min": 0.1,
        "max": 0.98,
        "step": 0.02,
        "default": 0.75,
        "type": "range",
        "value": 0.75
      },
      {
        "key": "ssbn_share",
        "label": "Untargetable SSBN Triad Share (%)",
        "min": 0,
        "max": 80,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "geo_chokepoint_maritime",
    "name": "Maritime Chokepoint Flow Network (Malacca, Hormuz, Bab el-Mandeb, Suez)",
    "domains": [
      "geopolitics"
    ],
    "engine": "network_graph",
    "formula": "MaxFlow(S, T) = MinCut(S, T),   Cape Reroute Δt = +12 days",
    "description": "Simulate strait interdiction, tanker insurance war-risk premiums, and Cape of Good Hope fleet capacity absorption.",
    "params": [
      {
        "key": "interdiction",
        "label": "Chokepoint Disruption Severity (%)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      },
      {
        "key": "spr_drawdown",
        "label": "Strategic Petroleum Reserve Release",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 40,
        "type": "range",
        "value": 40
      },
      {
        "key": "fleet_elastic",
        "label": "Spare Tanker Tonnage Elasticity",
        "min": 10,
        "max": 100,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "geo_sanctions_tariff_gravity",
    "name": "Trade Gravity Model, Sanctions Evasion & Third-Party Rerouting",
    "domains": [
      "geopolitics"
    ],
    "engine": "network_graph",
    "formula": "F_{ij} = G (Y_i Y_j) / (D_{ij}^θ · τ_{ij}^σ),   Transshipment Leakage",
    "description": "Impose bilateral export controls and trace trade deflection through neutral intermediary jurisdictions.",
    "params": [
      {
        "key": "tariff_tau",
        "label": "Sanction / Tariff Barrier τ",
        "min": 1.0,
        "max": 5.0,
        "step": 0.1,
        "default": 2.4,
        "type": "range",
        "value": 2.4
      },
      {
        "key": "coalition_w",
        "label": "Sanctioning Coalition GDP Share (%)",
        "min": 20,
        "max": 95,
        "step": 5,
        "default": 65,
        "type": "range",
        "value": 65
      },
      {
        "key": "secondary_enf",
        "label": "Secondary Sanctions Enforcement",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "geo_ach_competing_hypotheses",
    "name": "Heuer Analysis of Competing Hypotheses (ACH) & Deception Matrix",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "P(H_k | E) ∝ P(H_k) Π_j P(E_j | H_k, Deception_d)",
    "description": "Evaluate diagnostic evidence across competing intelligence hypotheses while discounting double-agent deception.",
    "params": [
      {
        "key": "diagnosticity",
        "label": "Evidence Diagnosticity Ratio",
        "min": 1.1,
        "max": 10.0,
        "step": 0.2,
        "default": 3.8,
        "type": "range",
        "value": 3.8
      },
      {
        "key": "deception_p",
        "label": "Adversary Denial & Deception Risk",
        "min": 0.0,
        "max": 0.8,
        "step": 0.02,
        "default": 0.2,
        "type": "range",
        "value": 0.2
      },
      {
        "key": "prior_anchoring",
        "label": "Analyst Cognitive Anchoring Bias",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "geo_enigma_bombe_turing",
    "name": "Bletchley Park Enigma Rotor Cryptanalysis & Turing Banburismus",
    "domains": [
      "geopolitics"
    ],
    "engine": "systems_hardware",
    "formula": "P_k = R_3^{-1} R_2^{-1} R_1^{-1} U R_1 R_2 R_3 S(x)   (No letter maps to itself)",
    "description": "Exploit known-plaintext cribs and Index of Coincidence deciban weights to prune rotor/plugboard states.",
    "params": [
      {
        "key": "crib_len",
        "label": "Known Plaintext Crib Length",
        "min": 4,
        "max": 24,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "stecker_pairs",
        "label": "Plugboard Stecker Cables",
        "min": 0,
        "max": 13,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "menu_closures",
        "label": "Bombe Menu Loop Closures",
        "min": 0,
        "max": 6,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      }
    ]
  },
  {
    "id": "geo_thucydides_power_parity",
    "name": "Organski Power Transition & Thucydides Trap Differential Growth",
    "domains": [
      "geopolitics"
    ],
    "engine": "phase_attractor",
    "formula": "dP_R/dt = g_R P_R (1 − P_R/K_R),   Parity Window: 0.8 ≤ P_R / P_H ≤ 1.2",
    "description": "Simulate demographic, technological, and alliance shifts as a rising challenger approaches power parity with a hegemon.",
    "params": [
      {
        "key": "growth_diff",
        "label": "Differential Growth Rate Δg (%)",
        "min": -1.0,
        "max": 6.0,
        "step": 0.2,
        "default": 2.8,
        "type": "range",
        "value": 2.8
      },
      {
        "key": "status_dissat",
        "label": "Revisionist Institutional Dissatisfaction",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 55,
        "type": "range",
        "value": 55
      },
      {
        "key": "alliance_bal",
        "label": "External Balancing Coalition",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      }
    ]
  },
  {
    "id": "geo_selectorate_bdm",
    "name": "Bueno de Mesquita Selectorate Theory (Winning Coalition W / S)",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "Loyalty Norm = W / S,   Private Goods (small W) vs Public Goods (large W)",
    "description": "Vary winning coalition size W and selectorate S to predict regime survival, kleptocracy, and war effort.",
    "params": [
      {
        "key": "coalition_w",
        "label": "Winning Coalition Size W",
        "min": 0.02,
        "max": 0.95,
        "step": 0.02,
        "default": 0.55,
        "type": "range",
        "value": 0.55
      },
      {
        "key": "selectorate_s",
        "label": "Selectorate Size S",
        "min": 0.1,
        "max": 1.0,
        "step": 0.02,
        "default": 0.85,
        "type": "range",
        "value": 0.85
      },
      {
        "key": "resource_rent",
        "label": "Non-Tax Resource Rents (%)",
        "min": 0,
        "max": 90,
        "step": 5,
        "default": 20,
        "type": "range",
        "value": 20
      }
    ]
  },
  {
    "id": "geo_semiconductor_supply_dag",
    "name": "Weaponized Interdependence & Semiconductor Chokepoint DAG",
    "domains": [
      "geopolitics"
    ],
    "engine": "network_graph",
    "formula": "ASML EUV → Photomask/EDA → TSMC 2nm Foundry → CoWoS Packaging",
    "description": "Compute Farrell–Newman panopticon and chokepoint centrality across the global semiconductor supply chain.",
    "params": [
      {
        "key": "choke_herf",
        "label": "Herfindahl Concentration HHI",
        "min": 0.2,
        "max": 1.0,
        "step": 0.02,
        "default": 0.82,
        "type": "range",
        "value": 0.82
      },
      {
        "key": "sub_years",
        "label": "Domestic Substitution Lag (yr)",
        "min": 1,
        "max": 12,
        "step": 0.5,
        "default": 5.5,
        "type": "range",
        "value": 5.5
      },
      {
        "key": "stockpile_mo",
        "label": "Strategic Buffer Inventory (mo)",
        "min": 1,
        "max": 24,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      }
    ]
  },
  {
    "id": "geo_alliance_burden_olson",
    "name": "Olson–Zeckhauser Alliance Burden-Sharing & Entrapment/Abandonment",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "g_i* = max(0, G_i − Σ_{j≠i} g_j)   (Defense as Pure vs Impure Public Good)",
    "description": "Analyze why large allies disproportionately fund collective defense and balance Snyder's alliance security dilemma.",
    "params": [
      {
        "key": "gdp_asymm",
        "label": "Lead Ally GDP Share (%)",
        "min": 20,
        "max": 85,
        "step": 5,
        "default": 62,
        "type": "range",
        "value": 62
      },
      {
        "key": "joint_exclud",
        "label": "Private Benefit Excludability (%)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      },
      {
        "key": "tripwire_k",
        "label": "Forward Tripwire Force Commitment",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 55,
        "type": "range",
        "value": 55
      }
    ]
  },
  {
    "id": "geo_coin_insurgency",
    "name": "Counterinsurgency (COIN) Intelligence–Population Control Loop",
    "domains": [
      "geopolitics"
    ],
    "engine": "phase_attractor",
    "formula": "dI_tips/dt = κ P_sec (1 − Fear_ins),   dG_ins/dt = r G (1 − P_sec) − μ I_tips G",
    "description": "Model Berman-Shapiro conditional intelligence tips: population security enables tips, which enable precise targeting.",
    "params": [
      {
        "key": "pop_security",
        "label": "Garrison Population Security",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 60,
        "type": "range",
        "value": 60
      },
      {
        "key": "collateral_d",
        "label": "Indiscriminate Force Backlash",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 15,
        "type": "range",
        "value": 15
      },
      {
        "key": "econ_aid",
        "label": "Local Public Service Provision",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "geo_swift_dollar_network",
    "name": "Correspondent Banking Network, SWIFT & Reserve Currency Inertia",
    "domains": [
      "geopolitics"
    ],
    "engine": "network_graph",
    "formula": "U(Currency_i) = NetworkShare_i^γ + Depth(Bonds_i) − CapitalControlCost_i",
    "description": "Simulate payment clearing network effects, FX swap lines, and bilateral alternative settlement friction.",
    "params": [
      {
        "key": "net_exp",
        "label": "Network Externalities γ",
        "min": 1.0,
        "max": 3.0,
        "step": 0.1,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      },
      {
        "key": "swap_liquidity",
        "label": "Central Bank Swap Line Depth",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 75,
        "type": "range",
        "value": 75
      },
      {
        "key": "settlement_fx",
        "label": "Alternative Clearing Friction (bps)",
        "min": 5,
        "max": 250,
        "step": 5,
        "default": 65,
        "type": "range",
        "value": 65
      }
    ]
  },
  {
    "id": "geo_cyber_attribution_deter",
    "name": "Sub-Threshold Gray-Zone Operations & Attribution Delay",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "E[Retaliation] = P_attrib(t_d) · Credibility · Punishment − EscalationRisk",
    "description": "Explore salami-slicing campaigns designed to stay just below kinetic casus belli thresholds.",
    "params": [
      {
        "key": "salami_size",
        "label": "Increment Slice Magnitude",
        "min": 0.05,
        "max": 1.0,
        "step": 0.05,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      },
      {
        "key": "attrib_conf",
        "label": "Forensic Attribution Confidence (%)",
        "min": 10,
        "max": 99,
        "step": 2,
        "default": 72,
        "type": "range",
        "value": 72
      },
      {
        "key": "redline_blur",
        "label": "Defender Redline Ambiguity",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "geo_critical_minerals_cartel",
    "name": "Critical Minerals (Li, Co, Ga, REE) Refining Concentration & Learning Curve",
    "domains": [
      "geopolitics"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "Cost(Q) = C₀ (Q/Q₀)^{−b},   Lerner Index L = (P − MC)/P = s_i / |ε_d + s_{fringe} ε_s|",
    "description": "Simulate export quota shocks, fringe supply elasticity lags, and battery chemistries substituting away from bottlenecks.",
    "params": [
      {
        "key": "quota_cut",
        "label": "Dominant Refiner Export Cut (%)",
        "min": 0,
        "max": 80,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      },
      {
        "key": "mine_lag_yr",
        "label": "Greenfield Mine Lead Time (yr)",
        "min": 1,
        "max": 12,
        "step": 1,
        "default": 6,
        "type": "range",
        "value": 6
      },
      {
        "key": "chem_subst",
        "label": "LFP / Sodium Tech Substitution",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      }
    ]
  },
  {
    "id": "geo_putnam_two_level",
    "name": "Putnam Two-Level Diplomatic Game & Domestic Ratification Win-Set",
    "domains": [
      "geopolitics"
    ],
    "engine": "strategic_game",
    "formula": "Agreement ∈ W_A ∩ W_B ≠ ∅,   Smaller W_A ⇒ Stronger Bargaining Leverage",
    "description": "See how domestic legislative ratification constraints (Schelling conjecture) increase bargaining leverage until negotiations collapse.",
    "params": [
      {
        "key": "winset_a",
        "label": "State A Domestic Win-Set Width",
        "min": 0.1,
        "max": 1.0,
        "step": 0.05,
        "default": 0.45,
        "type": "range",
        "value": 0.45
      },
      {
        "key": "winset_b",
        "label": "State B Domestic Win-Set Width",
        "min": 0.1,
        "max": 1.0,
        "step": 0.05,
        "default": 0.55,
        "type": "range",
        "value": 0.55
      },
      {
        "key": "hawk_veto",
        "label": "Domestic Veto Player Polarization",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "geo_mackinder_rimland",
    "name": "Mackinder Heartland vs Spykman Rimland & Mahan Sea-Power Projection",
    "domains": [
      "geopolitics"
    ],
    "engine": "field_lattice",
    "formula": "Power(x) = Σ_i Base_i exp(−c_{land/sea} · d(x, x_i))",
    "description": "Compare continental rail/pipeline interior lines against oceanic blue-water fleet loss-of-strength gradients.",
    "params": [
      {
        "key": "sea_lift_eff",
        "label": "Maritime Transport Efficiency Ratio",
        "min": 1.0,
        "max": 10.0,
        "step": 0.5,
        "default": 4.5,
        "type": "range",
        "value": 4.5
      },
      {
        "key": "basing_access",
        "label": "Forward Rimland Basing Access (%)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 65,
        "type": "range",
        "value": 65
      },
      {
        "key": "a2ad_range",
        "label": "Coastal A2/AD Bastion Range",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 40,
        "type": "range",
        "value": 40
      }
    ]
  },
  {
    "id": "geo_demographic_support_ratio",
    "name": "Demographic Transition Pyramid & Fiscal Support Ratio",
    "domains": [
      "geopolitics"
    ],
    "engine": "wave_fourier",
    "formula": "Support Ratio = Pop(20..64) / [0.5 Pop(0..19) + 1.2 Pop(65+)]",
    "description": "Project total fertility rate (TFR), longevity, and working-age cohort contraction on national power and pension solvency.",
    "params": [
      {
        "key": "tfr_rate",
        "label": "Total Fertility Rate (TFR)",
        "min": 0.7,
        "max": 3.8,
        "step": 0.1,
        "default": 1.3,
        "type": "range",
        "value": 1.3
      },
      {
        "key": "prod_growth",
        "label": "AI / Automation Productivity (%)",
        "min": 0.0,
        "max": 5.0,
        "step": 0.2,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      },
      {
        "key": "retire_age",
        "label": "Effective Retirement Age",
        "min": 58,
        "max": 72,
        "step": 1,
        "default": 65,
        "type": "range",
        "value": 65
      }
    ]
  },
  {
    "id": "jur_hohfeld_square",
    "name": "Hohfeldian Jural Correlatives & Opposites Algebra",
    "domains": [
      "jurisprudence"
    ],
    "engine": "network_graph",
    "formula": "Claim-Right ↔ Duty,  Privilege ↔ No-Right,  Power ↔ Liability,  Immunity ↔ Disability",
    "description": "Map complex property, contract, and constitutional entitlements onto Hohfeld's 8 fundamental atomic relations.",
    "params": [
      {
        "key": "entitlement",
        "label": "Primary Entitlement Mode (1..4)",
        "min": 1,
        "max": 4,
        "step": 1,
        "default": 1,
        "type": "range",
        "value": 1
      },
      {
        "key": "meta_power",
        "label": "Second-Order Power / Immunity",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 60,
        "type": "range",
        "value": 60
      },
      {
        "key": "alienability",
        "label": "Calabresi–Melamed Rule (Prop/Liab)",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "jur_coase_calabresi",
    "name": "Coase Theorem, Transaction Costs & Calabresi–Melamed Rules",
    "domains": [
      "jurisprudence"
    ],
    "engine": "strategic_game",
    "formula": "ΔW = V_polluter − D_victim − C_tx,   Property Rule (Injunction) vs Liability Rule (Damages)",
    "description": "Test when private bargaining achieves Pareto efficiency vs when high transaction costs require Liability rules.",
    "params": [
      {
        "key": "tx_cost",
        "label": "Bargaining Transaction Cost C_tx",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 20,
        "type": "range",
        "value": 20
      },
      {
        "key": "info_asymm",
        "label": "Valuation Private Info Asymmetry",
        "min": 0,
        "max": 100,
        "step": 2,
        "default": 30,
        "type": "range",
        "value": 30
      },
      {
        "key": "holdout_n",
        "label": "Affected Plaintiffs N (Holdout)",
        "min": 1,
        "max": 50,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      }
    ]
  },
  {
    "id": "jur_learned_hand_tort",
    "name": "Learned Hand Negligence Formula (B < P·L) & Bilateral Precaution",
    "domains": [
      "jurisprudence"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "min_{x,y} C(x) + C(y) + P(x,y)·L,   Negligent iff Marginal B < −∂P/∂x · L",
    "description": "Compare Strict Liability, Simple Negligence, and Comparative Negligence on injurer and victim care levels.",
    "params": [
      {
        "key": "harm_loss_l",
        "label": "Expected Accident Magnitude L",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 150,
        "type": "range",
        "value": 150
      },
      {
        "key": "care_cost_b",
        "label": "Marginal Precaution Cost c_x",
        "min": 0.5,
        "max": 10.0,
        "step": 0.5,
        "default": 2.5,
        "type": "range",
        "value": 2.5
      },
      {
        "key": "activity_lvl",
        "label": "Injurer Activity Volume",
        "min": 1,
        "max": 20,
        "step": 1,
        "default": 8,
        "type": "range",
        "value": 8
      }
    ]
  },
  {
    "id": "jur_bayes_evidence_403",
    "name": "Bayesian Forensic Likelihood Ratio & Rule 403 Prejudice Gate",
    "domains": [
      "jurisprudence"
    ],
    "engine": "strategic_game",
    "formula": "O(G | E) = O(G) × [P(E | G) / P(E | ¬G)],   Base-Rate Fallacy Guard",
    "description": "Combine prior odds with forensic DNA/trace likelihood ratios while guarding against prosecutor's fallacy.",
    "params": [
      {
        "key": "prior_log",
        "label": "Log₁₀ Prior Odds of Guilt",
        "min": -4.0,
        "max": 0.0,
        "step": 0.2,
        "default": -2.0,
        "type": "range",
        "value": -2.0
      },
      {
        "key": "lr_log",
        "label": "Log₁₀ Forensic Likelihood Ratio",
        "min": 0.5,
        "max": 6.0,
        "step": 0.2,
        "default": 3.0,
        "type": "range",
        "value": 3.0
      },
      {
        "key": "lab_error",
        "label": "False-Positive Lab Error Rate (%)",
        "min": 0.0,
        "max": 5.0,
        "step": 0.1,
        "default": 0.4,
        "type": "range",
        "value": 0.4
      }
    ]
  },
  {
    "id": "jur_condorcet_supermajority",
    "name": "Jury Size, Unanimity vs Supermajority & Condorcet Epistemic Accuracy",
    "domains": [
      "jurisprudence"
    ],
    "engine": "wave_fourier",
    "formula": "P_maj(N, p) = Σ_{k=⌈qN⌉}^N C(N,k) p^k (1−p)^{N−k},   Blackstone Ratio α / β",
    "description": "Trade off Type I (convicting the innocent) vs Type II errors across 6- vs 12-person juries and voting thresholds.",
    "params": [
      {
        "key": "juror_acc_p",
        "label": "Individual Juror Competence p",
        "min": 0.52,
        "max": 0.92,
        "step": 0.02,
        "default": 0.72,
        "type": "range",
        "value": 0.72
      },
      {
        "key": "jury_size_n",
        "label": "Jury Panel Size N",
        "min": 6,
        "max": 18,
        "step": 2,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "vote_quota",
        "label": "Conviction Threshold Quota q",
        "min": 0.5,
        "max": 1.0,
        "step": 0.05,
        "default": 0.95,
        "type": "range",
        "value": 0.95
      }
    ]
  },
  {
    "id": "jur_shapley_shubik_bicameral",
    "name": "Bicameral Constitutional Veto Players & Shapley–Shubik Power Index",
    "domains": [
      "jurisprudence"
    ],
    "engine": "network_graph",
    "formula": "φ_i = (# Pivotal Permutations for i) / n!,   Core Stability of Status Quo",
    "description": "Compute pivotal voting power across House, Senate, Filibuster, Executive Veto, and Judicial Review.",
    "params": [
      {
        "key": "filibuster_q",
        "label": "Upper Chamber Cloture Threshold",
        "min": 0.5,
        "max": 0.75,
        "step": 0.01,
        "default": 0.6,
        "type": "range",
        "value": 0.6
      },
      {
        "key": "override_q",
        "label": "Veto Override Supermajority",
        "min": 0.55,
        "max": 0.8,
        "step": 0.01,
        "default": 0.67,
        "type": "range",
        "value": 0.67
      },
      {
        "key": "polarization",
        "label": "Ideological Distance Between Chambers",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 55,
        "type": "range",
        "value": 55
      }
    ]
  },
  {
    "id": "jur_HAD_contract_breach",
    "name": "Efficient Breach, Expectation vs Reliance Damages & Hadley Foreseeability",
    "domains": [
      "jurisprudence"
    ],
    "engine": "strategic_game",
    "formula": "D_exp = V_promisee − P,   Efficient Breach iff V_3rd − P > V_promisee − P (or C_perf > V)",
    "description": "Show why Expectation Damages induce efficient performance, breach, and reliance investment (Shavell paradox).",
    "params": [
      {
        "key": "cost_shock",
        "label": "Promisor Cost Realization C",
        "min": 20,
        "max": 250,
        "step": 5,
        "default": 130,
        "type": "range",
        "value": 130
      },
      {
        "key": "buyer_val",
        "label": "Buyer Base Valuation V",
        "min": 50,
        "max": 200,
        "step": 5,
        "default": 120,
        "type": "range",
        "value": 120
      },
      {
        "key": "reliance_r",
        "label": "Buyer Reliance Investment r",
        "min": 0,
        "max": 80,
        "step": 5,
        "default": 25,
        "type": "range",
        "value": 25
      }
    ]
  },
  {
    "id": "jur_becker_crime_deterrence",
    "name": "Becker Economic Model of Crime: Certainty p vs Severity f",
    "domains": [
      "jurisprudence"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "EU_crime = (1 − p) U(W + G) + p U(W − f) < U(W),   min C_police(p) + C_prison(p·f)",
    "description": "Compare risk-preferring vs risk-averse offenders to explain why detection certainty p dominates sentence severity f.",
    "params": [
      {
        "key": "detect_prob",
        "label": "Detection & Conviction Prob p",
        "min": 0.05,
        "max": 0.9,
        "step": 0.02,
        "default": 0.35,
        "type": "range",
        "value": 0.35
      },
      {
        "key": "sanction_f",
        "label": "Sanction Severity f",
        "min": 10,
        "max": 200,
        "step": 5,
        "default": 60,
        "type": "range",
        "value": 60
      },
      {
        "key": "discount_beta",
        "label": "Offender Hyperbolic Discounting",
        "min": 0.2,
        "max": 1.0,
        "step": 0.05,
        "default": 0.55,
        "type": "range",
        "value": 0.55
      }
    ]
  },
  {
    "id": "jur_settlement_priest_klein",
    "name": "Priest–Klein Litigation Selection & Asymmetric-Info Settlement Range",
    "domains": [
      "jurisprudence"
    ],
    "engine": "strategic_game",
    "formula": "Settle iff (P_p − P_d)·J ≤ C_p + C_d − S,   50% Win-Rate Limit at Trial",
    "description": "Vary plaintiff/defendant optimism (P_p − P_d), discovery cost C, and fee-shifting (American vs English rule).",
    "params": [
      {
        "key": "optimism_gap",
        "label": "Mutual Optimism Gap (P_p − P_d)",
        "min": -0.3,
        "max": 0.5,
        "step": 0.02,
        "default": 0.12,
        "type": "range",
        "value": 0.12
      },
      {
        "key": "trial_cost",
        "label": "Combined Litigation Cost C / J",
        "min": 0.05,
        "max": 0.6,
        "step": 0.02,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      },
      {
        "key": "english_rule",
        "label": "Loser-Pays Fee Shifting (%)",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 0,
        "type": "range",
        "value": 0
      }
    ]
  },
  {
    "id": "jur_toulmin_wigmore_chart",
    "name": "Wigmore Evidentiary Chart & Toulmin Argumentation Warrant Analyzer",
    "domains": [
      "jurisprudence"
    ],
    "engine": "network_graph",
    "formula": "Claim ←[Qualifier]— (Data + Warrant[Backing])  unless  Rebuttal",
    "description": "Construct multi-tiered testimonial/circumstantial inference trees and propagate corroboration vs impeachment weights.",
    "params": [
      {
        "key": "warrant_str",
        "label": "Inferential Warrant Strength",
        "min": 0.1,
        "max": 0.99,
        "step": 0.02,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      },
      {
        "key": "corroboration",
        "label": "Independent Corroborating Witnesses",
        "min": 1,
        "max": 6,
        "step": 1,
        "default": 2,
        "type": "range",
        "value": 2
      },
      {
        "key": "rebuttal_w",
        "label": "Affirmative Exception / Rebuttal",
        "min": 0.0,
        "max": 0.9,
        "step": 0.05,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      }
    ]
  },
  {
    "id": "jur_stare_decisis_precedent",
    "name": "Common Law Precedent Evolution & Distinguish/Overrule Lattice",
    "domains": [
      "jurisprudence"
    ],
    "engine": "neural_manifold",
    "formula": "Hold(Case_t) = +1 iff w^T f(x_t) ≥ τ,   Overrule Cost C_stare",
    "description": "Visualize multidimensional fact-pattern space as appellate panels narrow, extend, or overrule precedents.",
    "params": [
      {
        "key": "stare_weight",
        "label": "Stare Decisis Reliance Weight",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 70,
        "type": "range",
        "value": 70
      },
      {
        "key": "fact_drift",
        "label": "Technological Fact-Pattern Drift",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      },
      {
        "key": "panel_median",
        "label": "Appellate Panel Median Shift",
        "min": -1.0,
        "max": 1.0,
        "step": 0.05,
        "default": 0.1,
        "type": "range",
        "value": 0.1
      }
    ]
  },
  {
    "id": "jur_proportionality_alexy",
    "name": "Alexy Constitutional Proportionality Weight Formula & Strict Scrutiny",
    "domains": [
      "jurisprudence"
    ],
    "engine": "strategic_game",
    "formula": "W_{i,j} = (I_i · W_i · R_i) / (I_j · W_j · R_j)",
    "description": "Balance competing constitutional principles across Suitability, Necessity (Least Restrictive Means), and Balancing.",
    "params": [
      {
        "key": "intrusion_i",
        "label": "Rights Intrusion Intensity I_i",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "state_urgency",
        "label": "Compelling State Interest W_j",
        "min": 1,
        "max": 8,
        "step": 1,
        "default": 4,
        "type": "range",
        "value": 4
      },
      {
        "key": "lrm_avail",
        "label": "Less-Restrictive Alternative Availability",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 40,
        "type": "range",
        "value": 40
      }
    ]
  },
  {
    "id": "jur_statutory_canons",
    "name": "Statutory Interpretation: Textualism, Purposivism & Chevron/Loper Bright",
    "domains": [
      "jurisprudence"
    ],
    "engine": "linguistic_cognitive",
    "formula": "Meaning(T) = w_text Sem(T) + w_purp Telos(T, Context) + w_canon Canon(T)",
    "description": "Test Noscitur a Sociis, Ejusdem Generis, Rule of Lenity, and Major Questions Doctrine on ambiguous statutory text.",
    "params": [
      {
        "key": "text_clarity",
        "label": "Semantic Textual Determinacy",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 55,
        "type": "range",
        "value": 55
      },
      {
        "key": "econ_sig",
        "label": "Major Questions Economic Impact",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 45,
        "type": "range",
        "value": 45
      },
      {
        "key": "lenity_weight",
        "label": "Penal Rule of Lenity Weight",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 60,
        "type": "range",
        "value": 60
      }
    ]
  },
  {
    "id": "jur_antitrust_hhi_uppi",
    "name": "Antitrust Merger Review: Herfindahl–Hirschman Index (HHI) & UPP",
    "domains": [
      "jurisprudence"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "HHI = Σ s_i²,   ΔHHI = 2 s₁ s₂,   UPP_1 = D_{12}(P_2 − C_2) − E_1 C_1",
    "description": "Evaluate horizontal mergers under the 1,800 HHI / +100 ΔHHI structural presumption vs Upward Pricing Pressure.",
    "params": [
      {
        "key": "share_1",
        "label": "Merging Firm 1 Share s₁ (%)",
        "min": 5,
        "max": 50,
        "step": 1,
        "default": 22,
        "type": "range",
        "value": 22
      },
      {
        "key": "share_2",
        "label": "Merging Firm 2 Share s₂ (%)",
        "min": 5,
        "max": 50,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      },
      {
        "key": "diversion_d",
        "label": "Diversion Ratio D₁₂ (%)",
        "min": 5,
        "max": 80,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "jur_patent_breadth_nordhaus",
    "name": "Nordhaus Patent Breadth × Length Trade-Off & Deadweight Loss",
    "domains": [
      "jurisprudence"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "max_{T, w} V_innovation(T,w) − ∫_0^T e^{−rt} DWL(w) dt",
    "description": "Balance R&D incentive creation against static monopoly deadweight loss and cumulative follow-on innovation blocking.",
    "params": [
      {
        "key": "patent_term",
        "label": "Statutory Patent Term T (yr)",
        "min": 5,
        "max": 35,
        "step": 1,
        "default": 20,
        "type": "range",
        "value": 20
      },
      {
        "key": "claim_breadth",
        "label": "Doctrine of Equivalents Breadth w",
        "min": 0.1,
        "max": 1.0,
        "step": 0.05,
        "default": 0.55,
        "type": "range",
        "value": 0.55
      },
      {
        "key": "follow_on",
        "label": "Cumulative Sequential Innovation",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "jur_corporate_fiduciary_bjr",
    "name": "Corporate Fiduciary Duties, Business Judgment Rule & Revlon Auction",
    "domains": [
      "jurisprudence"
    ],
    "engine": "strategic_game",
    "formula": "BJR Presumption unless Conflict / Bad Faith  ⇒  Entire Fairness Review",
    "description": "Model agency costs between shareholders and management across Poison Pills, Unocal proportionality, and MFW cleansing.",
    "params": [
      {
        "key": "insider_own",
        "label": "Management Equity Alignment (%)",
        "min": 1,
        "max": 60,
        "step": 2,
        "default": 15,
        "type": "range",
        "value": 15
      },
      {
        "key": "board_indep",
        "label": "Independent Director Majority (%)",
        "min": 20,
        "max": 100,
        "step": 5,
        "default": 75,
        "type": "range",
        "value": 75
      },
      {
        "key": "hostile_prem",
        "label": "Takeover Bid Premium (%)",
        "min": 5,
        "max": 80,
        "step": 5,
        "default": 35,
        "type": "range",
        "value": 35
      }
    ]
  },
  {
    "id": "jur_bankruptcy_absolute_priority",
    "name": "Chapter 11 Cram-Down Waterfall & Absolute Priority Rule",
    "domains": [
      "jurisprudence"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "V_firm → Secured → Admin → Unsecured → Equity   (11 U.S.C. § 1129(b))",
    "description": "Value a distressed enterprise and allocate reorganization recovery across tranches while resolving debt overhang.",
    "params": [
      {
        "key": "ev_firm",
        "label": "Reorganized Enterprise Value ($M)",
        "min": 50,
        "max": 500,
        "step": 10,
        "default": 220,
        "type": "range",
        "value": 220
      },
      {
        "key": "senior_debt",
        "label": "Senior Secured Claims ($M)",
        "min": 50,
        "max": 300,
        "step": 10,
        "default": 150,
        "type": "range",
        "value": 150
      },
      {
        "key": "junior_debt",
        "label": "Unsecured / Mezzanine Claims ($M)",
        "min": 20,
        "max": 250,
        "step": 10,
        "default": 120,
        "type": "range",
        "value": 120
      }
    ]
  },
  {
    "id": "jur_aristotle_stasis_rhetoric",
    "name": "Classical Stasis Theory (Conjectural, Definitional, Qualitative) & Enthymeme",
    "domains": [
      "jurisprudence"
    ],
    "engine": "linguistic_cognitive",
    "formula": "Stasis: An sit (Fact) → Quid sit (Definition) → Quale sit (Quality/Justification)",
    "description": "Diagnose the exact point of clash (stasis) in forensic arguments and balance Logos, Ethos, and Pathos.",
    "params": [
      {
        "key": "fact_strength",
        "label": "Empirical Fact Proof (An Sit)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 75,
        "type": "range",
        "value": 75
      },
      {
        "key": "def_fit",
        "label": "Statutory Element Fit (Quid Sit)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 65,
        "type": "range",
        "value": 65
      },
      {
        "key": "equity_excuse",
        "label": "Affirmative Justification (Quale Sit)",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 50,
        "type": "range",
        "value": 50
      }
    ]
  },
  {
    "id": "jur_hart_fuller_deontic",
    "name": "Deontic Modal Logic (Obligation O, Permission P, Prohibition F) & Conflict",
    "domains": [
      "jurisprudence"
    ],
    "engine": "systems_hardware",
    "formula": "O(p) ≡ ¬P(¬p),   F(p) ≡ O(¬p),   Lex Superior / Lex Specialis / Lex Posterior",
    "description": "Detect normative contradictions (O(p) ∧ O(¬p)) in statutory codes and resolve them via meta-rules of recognition.",
    "params": [
      {
        "key": "norm_density",
        "label": "Overlapping Regulatory Rules",
        "min": 4,
        "max": 32,
        "step": 2,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "lex_specialis",
        "label": "Specific-Over-General Priority",
        "min": 0,
        "max": 100,
        "step": 10,
        "default": 80,
        "type": "range",
        "value": 80
      },
      {
        "key": "open_texture",
        "label": "Hartian Penumbral Ambiguity (%)",
        "min": 0,
        "max": 60,
        "step": 5,
        "default": 20,
        "type": "range",
        "value": 20
      }
    ]
  },
  {
    "id": "jur_takings_michelman",
    "name": "Eminent Domain, Regulatory Takings & Michelman Demoralization Cost",
    "domains": [
      "jurisprudence"
    ],
    "engine": "strategic_game",
    "formula": "Compensate iff Demoralization Cost D > Settlement Cost S  ∧  Efficiency Gain > 0",
    "description": "Balance Lucas/Penn Central investment-backed expectations against public-use holdouts and fiscal illusion.",
    "params": [
      {
        "key": "val_diminish",
        "label": "Parcel Value Diminution (%)",
        "min": 10,
        "max": 100,
        "step": 5,
        "default": 75,
        "type": "range",
        "value": 75
      },
      {
        "key": "settle_cost",
        "label": "Administrative Valuation Cost S",
        "min": 5,
        "max": 100,
        "step": 5,
        "default": 30,
        "type": "range",
        "value": 30
      },
      {
        "key": "reciprocity",
        "label": "Average Reciprocity of Advantage",
        "min": 0,
        "max": 100,
        "step": 5,
        "default": 40,
        "type": "range",
        "value": 40
      }
    ]
  },
  {
    "id": "rf_smith_chart_matching",
    "name": "Smith Chart Complex Reflection Γ(Z) & L-Network Impedance Matching",
    "domains": [
      "rf_sdr"
    ],
    "engine": "quantum_orbital",
    "formula": "Γ = (Z_L − Z₀)/(Z_L + Z₀),   VSWR = (1 + |Γ|) / (1 − |Γ|)",
    "description": "Transform arbitrary load impedances Z_L = R + jX to 50 Ω along constant-resistance and constant-conductance circles.",
    "params": [
      {
        "key": "load_r",
        "label": "Load Resistance R_L (Ω)",
        "min": 5,
        "max": 250,
        "step": 5,
        "default": 125,
        "type": "range",
        "value": 125
      },
      {
        "key": "load_x",
        "label": "Load Reactance X_L (Ω)",
        "min": -150,
        "max": 150,
        "step": 5,
        "default": 65,
        "type": "range",
        "value": 65
      },
      {
        "key": "stub_len",
        "label": "Matching Element Susceptance",
        "min": -2.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.6,
        "type": "range",
        "value": 0.6
      }
    ]
  },
  {
    "id": "rf_telegrapher_tdr",
    "name": "Transmission Line Telegrapher's Equation & Time-Domain Reflectometry",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "∂²V/∂z² = LC ∂²V/∂t² + (RC+GL)∂V/∂t + RGV,   Z₀ = √((R+jωL)/(G+jωC))",
    "description": "Launch a fast step pulse down a coaxial line and diagnose open, short, or reactive discontinuities from reflected echoes.",
    "params": [
      {
        "key": "z_term",
        "label": "Termination Impedance Z_L (Ω)",
        "min": 0,
        "max": 200,
        "step": 5,
        "default": 150,
        "type": "range",
        "value": 150
      },
      {
        "key": "line_loss",
        "label": "Attenuation α (dB/m)",
        "min": 0.0,
        "max": 2.0,
        "step": 0.05,
        "default": 0.2,
        "type": "range",
        "value": 0.2
      },
      {
        "key": "freq_mhz",
        "label": "CW Standing Wave Freq (MHz)",
        "min": 50,
        "max": 1000,
        "step": 25,
        "default": 300,
        "type": "range",
        "value": 300
      }
    ]
  },
  {
    "id": "rf_phased_array_beam",
    "name": "Uniform Linear Phased Array Beamforming & Grating Lobes",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "AF(θ) = sin[N π (d/λ)(sin θ − sin θ₀)] / [N sin(π (d/λ)(sin θ − sin θ₀))]",
    "description": "Steer the main beam electronically via progressive phase shift Δφ and observe grating lobes when d/λ > 0.5.",
    "params": [
      {
        "key": "elements_n",
        "label": "Antenna Array Elements N",
        "min": 2,
        "max": 32,
        "step": 2,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "steer_deg",
        "label": "Beam Steering Angle θ₀ (°)",
        "min": -75,
        "max": 75,
        "step": 1,
        "default": 25,
        "type": "range",
        "value": 25
      },
      {
        "key": "spacing_dl",
        "label": "Element Spacing d / λ",
        "min": 0.25,
        "max": 1.25,
        "step": 0.05,
        "default": 0.5,
        "type": "range",
        "value": 0.5
      }
    ]
  },
  {
    "id": "rf_iq_qam_constellation",
    "name": "SDR Quadrature (I/Q) 16/64/256-QAM Constellation, EVM & Phase Noise",
    "domains": [
      "rf_sdr"
    ],
    "engine": "neural_manifold",
    "formula": "s(t) = I(t)cos(ω_c t) − Q(t)sin(ω_c t),   EVM_rms = √(⟨|e_k|²⟩ / ⟨|s_k|²⟩)",
    "description": "Inject AWGN, local oscillator phase noise, and I/Q gain/quadrature imbalance into a high-order QAM constellation.",
    "params": [
      {
        "key": "eb_n0_db",
        "label": "Signal-to-Noise Eb/N0 (dB)",
        "min": 4,
        "max": 36,
        "step": 1,
        "default": 22,
        "type": "range",
        "value": 22
      },
      {
        "key": "phase_noise",
        "label": "LO Phase Jitter σ_φ (°)",
        "min": 0.0,
        "max": 12.0,
        "step": 0.2,
        "default": 1.8,
        "type": "range",
        "value": 1.8
      },
      {
        "key": "iq_skew",
        "label": "I/Q Amplitude/Phase Imbalance (%)",
        "min": 0,
        "max": 25,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      }
    ]
  },
  {
    "id": "rf_costas_pll_carrier",
    "name": "Costas Loop Carrier Recovery & Mueller–Müller Timing Sync",
    "domains": [
      "rf_sdr"
    ],
    "engine": "phase_attractor",
    "formula": "dθ̂/dt = K_v (K_p e_φ(t) + K_i ∫ e_φ dt),   e_φ = I·Q (BPSK) or sgn(I)Q − sgn(Q)I (QPSK)",
    "description": "Lock onto a Doppler-shifted carrier with unknown phase and frequency offset and observe cycle slips at low SNR.",
    "params": [
      {
        "key": "freq_offset",
        "label": "Initial Carrier Offset Δf (kHz)",
        "min": -50,
        "max": 50,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      },
      {
        "key": "loop_bw",
        "label": "PLL Loop Bandwidth B_L",
        "min": 0.01,
        "max": 0.25,
        "step": 0.01,
        "default": 0.06,
        "type": "range",
        "value": 0.06
      },
      {
        "key": "damping_zeta",
        "label": "PLL Damping Factor ζ",
        "min": 0.2,
        "max": 2.0,
        "step": 0.05,
        "default": 0.707,
        "type": "range",
        "value": 0.707
      }
    ]
  },
  {
    "id": "rf_ofdm_cyclic_prefix",
    "name": "OFDM Orthogonal Subcarriers, Cyclic Prefix & Multipath Equalization",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "x[n] = (1/√N) Σ_{k=0}^{N-1} X[k] e^{j2πkn/N},   Y[k] = H[k] X[k] + W[k]",
    "description": "Set cyclic prefix length L_CP relative to multipath delay spread τ_max to eliminate inter-symbol interference (ISI).",
    "params": [
      {
        "key": "delay_spread",
        "label": "Multipath Delay Spread τ_max (µs)",
        "min": 0.1,
        "max": 10.0,
        "step": 0.2,
        "default": 2.2,
        "type": "range",
        "value": 2.2
      },
      {
        "key": "cp_length",
        "label": "Cyclic Prefix Duration T_CP (µs)",
        "min": 0.5,
        "max": 8.0,
        "step": 0.2,
        "default": 3.2,
        "type": "range",
        "value": 3.2
      },
      {
        "key": "papr_clip",
        "label": "Power Amplifier IBO Backoff (dB)",
        "min": 2,
        "max": 14,
        "step": 0.5,
        "default": 7.0,
        "type": "range",
        "value": 7.0
      }
    ]
  },
  {
    "id": "rf_fmcw_chirp_radar",
    "name": "FMCW Automotive/SAR Radar Range–Doppler 2D FFT Waterfall",
    "domains": [
      "rf_sdr"
    ],
    "engine": "field_lattice",
    "formula": "f_beat = (2 B / (c T_c)) R + (2 f_c / c) v_r,   ΔR = c / (2B)",
    "description": "Sweep chirp bandwidth B and frame time to resolve multi-target range R and radial velocity v_r.",
    "params": [
      {
        "key": "bw_ghz",
        "label": "Chirp Sweep Bandwidth B (GHz)",
        "min": 0.2,
        "max": 4.0,
        "step": 0.1,
        "default": 1.5,
        "type": "range",
        "value": 1.5
      },
      {
        "key": "target_vel",
        "label": "Target Radial Velocity v_r (m/s)",
        "min": -40,
        "max": 40,
        "step": 1,
        "default": 18,
        "type": "range",
        "value": 18
      },
      {
        "key": "cfar_thresh",
        "label": "CA-CFAR Detection Margin (dB)",
        "min": 6,
        "max": 24,
        "step": 1,
        "default": 13,
        "type": "range",
        "value": 13
      }
    ]
  },
  {
    "id": "rf_friis_link_budget",
    "name": "Satellite Link Budget, Friis Path Loss & Cascaded Noise Figure",
    "domains": [
      "rf_sdr"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "C/N₀ = EIRP − L_fs − L_atm + (G/T) − k_B,   F_tot = F₁ + (F₂−1)/G₁ + (F₃−1)/(G₁G₂)",
    "description": "Design a LEO/GEO K_u-band downlink and verify why the first LNA gain G₁ and noise figure F₁ dominate system SNR.",
    "params": [
      {
        "key": "lna_nf_db",
        "label": "First-Stage LNA Noise Figure (dB)",
        "min": 0.4,
        "max": 6.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "lna_gain_db",
        "label": "First-Stage LNA Gain G₁ (dB)",
        "min": 5,
        "max": 35,
        "step": 1,
        "default": 24,
        "type": "range",
        "value": 24
      },
      {
        "key": "rain_fade",
        "label": "Atmospheric / Rain Attenuation (dB)",
        "min": 0,
        "max": 20,
        "step": 0.5,
        "default": 3.0,
        "type": "range",
        "value": 3.0
      }
    ]
  },
  {
    "id": "rf_fir_polyphase_ddc",
    "name": "Digital Down-Converter (DDC), CIC & Polyphase FIR Filter Designer",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "H(e^{jω}) = Σ_{n=0}^{M} h[n] e^{−jωn},   Kaiser / Parks–McClellan Equiripple",
    "description": "Design decimation filters with steep transition bands and stopband attenuation to suppress out-of-band blockers.",
    "params": [
      {
        "key": "taps_m",
        "label": "FIR Filter Tap Order M",
        "min": 9,
        "max": 129,
        "step": 4,
        "default": 49,
        "type": "range",
        "value": 49
      },
      {
        "key": "cutoff_wc",
        "label": "Normalized Cutoff ω_c / π",
        "min": 0.05,
        "max": 0.85,
        "step": 0.02,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      },
      {
        "key": "kaiser_beta",
        "label": "Kaiser Window Stopband β",
        "min": 0.0,
        "max": 10.0,
        "step": 0.2,
        "default": 5.6,
        "type": "range",
        "value": 5.6
      }
    ]
  },
  {
    "id": "rf_viterbi_ldpc_turbo",
    "name": "Convolutional Viterbi Trellis & LDPC Belief-Propagation Waterfall",
    "domains": [
      "rf_sdr"
    ],
    "engine": "systems_hardware",
    "formula": "d_min(G) ≥ 2t + 1,   LLR(x_i) = log[P(x_i=0|y)/P(x_i=1|y)]",
    "description": "Compare uncoded BER against soft-decision Viterbi and LDPC sum-product message passing near the Shannon limit.",
    "params": [
      {
        "key": "eb_n0",
        "label": "Channel Eb/N0 (dB)",
        "min": 0.0,
        "max": 10.0,
        "step": 0.2,
        "default": 3.2,
        "type": "range",
        "value": 3.2
      },
      {
        "key": "code_rate",
        "label": "Code Rate R (k/n)",
        "min": 0.25,
        "max": 0.9,
        "step": 0.05,
        "default": 0.5,
        "type": "range",
        "value": 0.5
      },
      {
        "key": "bp_iters",
        "label": "Belief Propagation Iterations",
        "min": 1,
        "max": 30,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "rf_superhet_image_ip3",
    "name": "Superheterodyne Image Rejection, Mixer Spurs & Third-Order Intercept (IIP3)",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "f_image = f_LO ± f_IF,   SFDR = (2/3)(IIP3 − P_noise_floor)",
    "description": "Visualize two-tone intermodulation products (2f₁ − f₂, 2f₂ − f₁) rising at 3 dB/dB and image-frequency aliasing.",
    "params": [
      {
        "key": "tone_pwr",
        "label": "Two-Tone Input Power (dBm)",
        "min": -60,
        "max": 0,
        "step": 1,
        "default": -22,
        "type": "range",
        "value": -22
      },
      {
        "key": "iip3_dbm",
        "label": "Amplifier/Mixer IIP3 (dBm)",
        "min": -10,
        "max": 35,
        "step": 1,
        "default": 15,
        "type": "range",
        "value": 15
      },
      {
        "key": "if_mhz",
        "label": "Intermediate Frequency f_IF (MHz)",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 140,
        "type": "range",
        "value": 140
      }
    ]
  },
  {
    "id": "rf_yagi_maxwell_fdtd",
    "name": "2D FDTD Maxwell Solver: Waveguide Modes, Skin Depth & Yagi Radiation",
    "domains": [
      "rf_sdr"
    ],
    "engine": "field_lattice",
    "formula": "∇×E = −μ ∂H/∂t,   ∇×H = σE + ε ∂E/∂t,   δ_skin = √(2 / (ω μ σ))",
    "description": "Step Yee's staggered E-H finite-difference time-domain grid to watch dipole radiation, waveguides, and Faraday shielding.",
    "params": [
      {
        "key": "freq_scale",
        "label": "Excitation Frequency ω",
        "min": 0.2,
        "max": 3.0,
        "step": 0.1,
        "default": 1.2,
        "type": "range",
        "value": 1.2
      },
      {
        "key": "dielectric_er",
        "label": "Obstacle Permittivity ε_r",
        "min": 1.0,
        "max": 12.0,
        "step": 0.5,
        "default": 4.2,
        "type": "range",
        "value": 4.2
      },
      {
        "key": "cond_sigma",
        "label": "Conductor Skin Loss σ",
        "min": 0.0,
        "max": 5.0,
        "step": 0.1,
        "default": 0.8,
        "type": "range",
        "value": 0.8
      }
    ]
  },
  {
    "id": "rf_mimo_svd_waterfilling",
    "name": "Massive MIMO Spatial Multiplexing & SVD Water-Filling Capacity",
    "domains": [
      "rf_sdr"
    ],
    "engine": "neural_manifold",
    "formula": "H = U Σ V^H,   C = Σ_i log₂(1 + P_i σ_i² / N₀),   P_i = max(0, μ − N₀/σ_i²)",
    "description": "Decompose a Rayleigh multipath MIMO channel into parallel eigenmodes and allocate transmit power via water-filling.",
    "params": [
      {
        "key": "tx_rx_ant",
        "label": "MIMO Antenna Rank N_t = N_r",
        "min": 2,
        "max": 16,
        "step": 2,
        "default": 8,
        "type": "range",
        "value": 8
      },
      {
        "key": "snr_db",
        "label": "Total Transmit SNR (dB)",
        "min": 0,
        "max": 30,
        "step": 1,
        "default": 15,
        "type": "range",
        "value": 15
      },
      {
        "key": "spatial_corr",
        "label": "Antenna Spatial Correlation ρ",
        "min": 0.0,
        "max": 0.95,
        "step": 0.05,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      }
    ]
  },
  {
    "id": "rf_chirp_lora_css",
    "name": "LoRa Chirp Spread Spectrum (CSS) & Direct-Sequence CDMA Processing Gain",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "G_p = 10 log₁₀(BW · T_sym) = 10 log₁₀(2^{SF}),   Dechirp FFT Peak at −20 dB SNR",
    "description": "Recover weak spread-spectrum signals buried 20 dB below the thermal noise floor by multiplying with a conjugate reference chirp.",
    "params": [
      {
        "key": "spread_sf",
        "label": "Spreading Factor SF (7..12)",
        "min": 7,
        "max": 12,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      },
      {
        "key": "snr_in_db",
        "label": "Input Channel SNR (dB)",
        "min": -24,
        "max": 10,
        "step": 1,
        "default": -12,
        "type": "range",
        "value": -12
      },
      {
        "key": "interference",
        "label": "Narrowband Jammer Power (dB)",
        "min": 0,
        "max": 30,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "rf_kalman_music_doa",
    "name": "MUSIC Subspace Direction-of-Arrival (DoA) Super-Resolution Spectrum",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "P_MUSIC(θ) = 1 / [a^H(θ) E_N E_N^H a(θ)]",
    "description": "Separate closely spaced RF emitters below the Rayleigh diffraction limit using sample covariance noise-subspace projection.",
    "params": [
      {
        "key": "sep_deg",
        "label": "Two-Emitter Angular Separation (°)",
        "min": 1.0,
        "max": 30.0,
        "step": 0.5,
        "default": 6.0,
        "type": "range",
        "value": 6.0
      },
      {
        "key": "snapshots",
        "label": "Time Snapshots K",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 120,
        "type": "range",
        "value": 120
      },
      {
        "key": "snr_doa",
        "label": "Element SNR (dB)",
        "min": -5,
        "max": 25,
        "step": 1,
        "default": 10,
        "type": "range",
        "value": 10
      }
    ]
  },
  {
    "id": "rf_class_e_doherty_pa",
    "name": "RF Power Amplifier Load-Pull, Doherty Efficiency & Digital Predistortion",
    "domains": [
      "rf_sdr"
    ],
    "engine": "kinetics_thermodynamics",
    "formula": "y_DPD(x) = Σ_k Σ_m a_{k,m} x(n−m)|x(n−m)|^{k-1},   PAE = (P_out − P_in)/P_DC",
    "description": "Linearize AM/AM compression and AM/PM distortion using memory-polynomial Digital Predistortion (DPD).",
    "params": [
      {
        "key": "drive_bo",
        "label": "Input Drive Backoff (dB)",
        "min": -12,
        "max": 3,
        "step": 0.5,
        "default": -2.0,
        "type": "range",
        "value": -2.0
      },
      {
        "key": "dpd_order",
        "label": "DPD Polynomial Order K",
        "min": 1,
        "max": 9,
        "step": 2,
        "default": 5,
        "type": "range",
        "value": 5
      },
      {
        "key": "doherty_peak",
        "label": "Doherty Peaking Bias Threshold",
        "min": 0.2,
        "max": 0.8,
        "step": 0.05,
        "default": 0.5,
        "type": "range",
        "value": 0.5
      }
    ]
  },
  {
    "id": "rf_pll_fractional_n_dds",
    "name": "Fractional-N ΔΣ Frequency Synthesizer & Phase Noise Mask",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "f_out = (N + K/2^M) f_ref,   S_φ(f) = N² S_ref + |H_n(f)|² (2π)²/(12 f_ref)(f/f_ref)^{2m-2}",
    "description": "Shape MASH 1-1-1 delta-sigma quantization spurs and balance reference noise against VCO 1/f³ phase noise.",
    "params": [
      {
        "key": "loop_fn_khz",
        "label": "PLL Natural Frequency f_n (kHz)",
        "min": 10,
        "max": 500,
        "step": 10,
        "default": 120,
        "type": "range",
        "value": 120
      },
      {
        "key": "mash_order",
        "label": "ΔΣ Modulator Order m (1..4)",
        "min": 1,
        "max": 4,
        "step": 1,
        "default": 3,
        "type": "range",
        "value": 3
      },
      {
        "key": "vco_q",
        "label": "Resonator Loaded Quality Factor Q",
        "min": 20,
        "max": 400,
        "step": 10,
        "default": 150,
        "type": "range",
        "value": 150
      }
    ]
  },
  {
    "id": "rf_s_param_vna_filter",
    "name": "Vector Network Analyzer (VNA) S-Parameters (|S₁₁|, |S₂₁|) & Chebyshev Filter",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "|S_{21}(jω)|² = 1 / [1 + ε² T_n²(ω/ω_c)],   |S_{11}|² + |S_{21}|² = 1 (Lossless)",
    "description": "Sweep coupled-resonator microwave filter order n and passband ripple ε to inspect insertion loss, return loss, and group delay.",
    "params": [
      {
        "key": "filter_n",
        "label": "Coupled Resonator Order n",
        "min": 2,
        "max": 11,
        "step": 1,
        "default": 5,
        "type": "range",
        "value": 5
      },
      {
        "key": "ripple_db",
        "label": "Passband Ripple (dB)",
        "min": 0.01,
        "max": 1.5,
        "step": 0.05,
        "default": 0.15,
        "type": "range",
        "value": 0.15
      },
      {
        "key": "unloaded_qu",
        "label": "Cavity Unloaded Q_u",
        "min": 100,
        "max": 5000,
        "step": 100,
        "default": 1500,
        "type": "range",
        "value": 1500
      }
    ]
  },
  {
    "id": "rf_gnss_prn_correlator",
    "name": "GPS C/A Gold-Code Delay-Locked Loop (DLL) & Multipath Early-Late Discriminator",
    "domains": [
      "rf_sdr"
    ],
    "engine": "wave_fourier",
    "formula": "R(τ) = (1/1023) Σ c[n] c[n−τ],   D_EL(τ) = |R(τ − d/2)| − |R(τ + d/2)|",
    "description": "Acquire GPS L1 PRN Gold codes in a 2D Code-Phase × Doppler search grid and track prompt/early/late correlators.",
    "params": [
      {
        "key": "correl_d",
        "label": "Early-Late Chip Spacing d",
        "min": 0.1,
        "max": 1.0,
        "step": 0.05,
        "default": 0.25,
        "type": "range",
        "value": 0.25
      },
      {
        "key": "cn0_dbhz",
        "label": "Carrier-to-Noise C/N₀ (dB-Hz)",
        "min": 25,
        "max": 55,
        "step": 1,
        "default": 42,
        "type": "range",
        "value": 42
      },
      {
        "key": "mp_ratio",
        "label": "Specular Multipath Ratio",
        "min": 0.0,
        "max": 0.7,
        "step": 0.05,
        "default": 0.2,
        "type": "range",
        "value": 0.2
      }
    ]
  },
  {
    "id": "rf_sigma_delta_adc_nyquist",
    "name": "Bandpass Undersampling ADC, Jitter SNR & ΔΣ Noise Shaping",
    "domains": [
      "rf_sdr"
    ],
    "engine": "systems_hardware",
    "formula": "SNR_max = min(6.02 N + 1.76 + 10 log₁₀(OSR),  −20 log₁₀(2π f_in t_jitter))",
    "description": "Explore Nyquist zones, aperture clock jitter limits at high RF input frequencies, and oversampled noise shaping.",
    "params": [
      {
        "key": "bits_enob",
        "label": "Quantizer Resolution N (bits)",
        "min": 4,
        "max": 16,
        "step": 1,
        "default": 12,
        "type": "range",
        "value": 12
      },
      {
        "key": "osr_ratio",
        "label": "Oversampling Ratio OSR",
        "min": 1,
        "max": 64,
        "step": 1,
        "default": 16,
        "type": "range",
        "value": 16
      },
      {
        "key": "jitter_fs",
        "label": "Clock Aperture Jitter t_j (fs)",
        "min": 10,
        "max": 2000,
        "step": 20,
        "default": 150,
        "type": "range",
        "value": 150
      }
    ]
  }
]);
})();
