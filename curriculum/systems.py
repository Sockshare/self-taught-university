# Systems Engineering, Compilers & GPU Kernel Architecture curriculum catalog for Self-Taught.

DOMAIN = {'id': 'systems',
 'name': 'Systems Engineering, Compilers & GPU Kernel Architecture',
 'icon': '🖥️',
 'color': '#64748b',
 'tagline': 'From silicon gates and RISC-V pipelines to OS kernels, MLIR compilers, and petascale GPU '
            'clusters.',
 'description': 'A rigorous systems engineering curriculum bridging digital logic, SystemVerilog/Chisel RTL, '
                'superscalar out-of-order processors, cache coherence, Linux/seL4 operating system '
                'internals, NVMe/io_uring storage engines, SSA/LLVM/MLIR/Triton compilers, '
                'CUTLASS/FlashAttention GPU kernels, and fault-tolerant distributed systems.',
 'subjects': [{'id': 'computer_architecture_hdl',
               'name': 'Computer Architecture, RISC-V & Hardware Description Languages',
               'icon': '🔲',
               'description': 'Digital logic, SystemVerilog/Chisel RTL synthesis, RISC-V instruction set '
                              'architecture, five-stage pipelining, Tomasulo out-of-order execution, cache '
                              'coherence protocols and hardware accelerators.',
               'courses': [{'id': 'sys_arch_101',
                            'code': 'SYS 101',
                            'title': 'Digital Logic Design, RTL Synthesis and RISC-V Foundations',
                            'level': 100,
                            'credits': 4,
                            'description': 'Boolean algebra, combinational and sequential CMOS logic, finite '
                                           'state machines, SystemVerilog RTL design, FPGA synthesis timing '
                                           'closure and the RV32I/RV64I base instruction set.',
                            'prerequisites': [],
                            'modules': [{'id': 'boolean_cmos_combinational',
                                         'title': 'Boolean Algebra, CMOS Gates and Combinational Arithmetic',
                                         'summary': 'From MOSFET switches to Karnaugh maps, carry-lookahead '
                                                    'adders, Wallace tree multipliers and barrel shifters.',
                                         'sim': 'truth_table',
                                         'lab': True,
                                         'lessons': ['MOSFET Switching Physics: Pull-Up PMOS Networks, '
                                                     'Pull-Down NMOS Networks and Static CMOS Inverters',
                                                     "Boolean Algebra Axioms, De Morgan's Laws, Canonical "
                                                     'SOP/POS Forms and Karnaugh Map Minimization',
                                                     'Quine-McCluskey Tabular Minimization and Espresso '
                                                     'Heuristic Logic Optimization',
                                                     'Ripple-Carry vs Carry-Lookahead (Kogge-Stone and '
                                                     'Brent-Kung Parallel Prefix) Adders',
                                                     'Booth Recoding, Wallace/Dadda Reduction Trees and '
                                                     'Array Multipliers',
                                                     'Multiplexers, Priority Encoders, Logarithmic Barrel '
                                                     'Shifters and ALU Datapath Composition',
                                                     'Quantitative Case Study & Synthesis: Boolean Algebra, '
                                                     'CMOS Gates and Combinational Arithmetic',
                                                     'Frontier Research & Open Problems: Boolean Algebra, '
                                                     'CMOS Gates and Combinational Arithmetic']},
                                        {'id': 'sequential_logic_fsm_timing',
                                         'title': 'Sequential Elements, Synchronous Timing Discipline and '
                                                  'Finite State Machines',
                                         'summary': 'Latches, edge-triggered flip-flops, setup/hold time '
                                                    'constraints, metastability and Mealy/Moore FSMs.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Bistable Storage: SR Latches, Transparent D-Latches '
                                                     'and Master-Slave Edge-Triggered D Flip-Flops',
                                                     'Static Timing Analysis (STA): Contamination Delay, '
                                                     'Propagation Delay, Setup Time and Hold Time',
                                                     'Clock Skew, Jitter, Maximum Clock Frequency '
                                                     'Derivations and Hold-Time Violation Fixing',
                                                     'Metastability Physics, Mean Time Between Failures '
                                                     '(MTBF) and Two-Flop Clock-Domain Synchronizers',
                                                     'Moore vs Mealy Finite State Machines: State Encoding '
                                                     '(Binary, Gray, One-Hot) and Minimization',
                                                     'Register Files, Multi-Ported SRAM Macros and '
                                                     'Synchronous FIFO Buffers',
                                                     'Quantitative Case Study & Synthesis: Sequential '
                                                     'Elements, Synchronous Timing Discipline and Finite '
                                                     'State Machines',
                                                     'Frontier Research & Open Problems: Sequential '
                                                     'Elements, Synchronous Timing Discipline and Finite '
                                                     'State Machines']},
                                        {'id': 'systemverilog_rtl_verification',
                                         'title': 'SystemVerilog RTL Modeling, Synthesis and Verification',
                                         'summary': 'Synthesizable SystemVerilog idioms, Verilator '
                                                    'simulation, formal property verification and FPGA LUT '
                                                    'mapping.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Synthesizable SystemVerilog: always_comb, always_ff, '
                                                     'Blocking vs Non-Blocking Assignments',
                                                     'Preventing Unintended Latch Inference, X-Propagation '
                                                     'Pitfalls and Parameterized Modules',
                                                     'SystemVerilog Interfaces, Structs, Packages and '
                                                     'Chisel/FIRRTL Hardware Construction Languages',
                                                     'Cycle-Accurate RTL Simulation with Verilator and '
                                                     'Waveform Debugging',
                                                     'SystemVerilog Assertions (SVA): Immediate/Concurrent '
                                                     'Properties and Bounded Model Checking',
                                                     'FPGA Architecture: K-Input Lookup Tables (LUTs), Carry '
                                                     'Chains, Block RAMs and Place-and-Route',
                                                     'Quantitative Case Study & Synthesis: SystemVerilog RTL '
                                                     'Modeling, Synthesis and Verification',
                                                     'Frontier Research & Open Problems: SystemVerilog RTL '
                                                     'Modeling, Synthesis and Verification']},
                                        {'id': 'riscv_isa_single_cycle',
                                         'title': 'The RISC-V Instruction Set Architecture and Single-Cycle '
                                                  'Datapath',
                                         'summary': 'RV32I/RV64I instruction formats, calling conventions, '
                                                    'CSRs and building a complete single-cycle processor.',
                                         'sim': 'truth_table',
                                         'lab': True,
                                         'lessons': ['ISA Design Philosophy: RISC vs CISC and the Modular '
                                                     'RISC-V Instruction Set (I, M, A, F, D, C, V)',
                                                     'RV32I Instruction Encoding Formats (R, I, S, B, U, J) '
                                                     'and Immediate Sign-Extension Hardware',
                                                     'RISC-V ABI Calling Conventions, Stack Frames, '
                                                     'Callee/Caller-Saved Registers and Linker Relaxation',
                                                     'Single-Cycle Processor Datapath: Instruction Fetch, '
                                                     'Register Read, ALU Execute, Memory and Writeback',
                                                     'Control Unit Synthesis: Main Instruction Decoder and '
                                                     'ALU Control Truth Tables',
                                                     'Machine-Mode Control and Status Registers (CSRs), '
                                                     'Traps, Exceptions and Precise Interrupts',
                                                     'Quantitative Case Study & Synthesis: The RISC-V '
                                                     'Instruction Set Architecture and Single-Cycle Datapath',
                                                     'Frontier Research & Open Problems: The RISC-V '
                                                     'Instruction Set Architecture and Single-Cycle '
                                                     'Datapath']},
                                        {'id': 'five_stage_pipelined_cpu',
                                         'title': 'Five-Stage Pipelined Processor Design and Hazard '
                                                  'Resolution',
                                         'summary': 'IF/ID/EX/MEM/WB pipeline registers, data forwarding '
                                                    'networks, load-use stalls and branch delay penalties.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Pipelining Fundamentals: Throughput vs Latency, '
                                                     'Pipeline Registers and the Iron Law of Processor '
                                                     'Performance',
                                                     'Structural, Data (RAW, WAR, WAW) and Control Hazards '
                                                     'in a 5-Stage RISC-V Pipeline',
                                                     'Full Bypassing and Forwarding Multiplexer Networks '
                                                     '(EX-to-EX and MEM-to-EX Paths)',
                                                     'Load-Use Hazard Detection Unit, Pipeline Interlocks '
                                                     'and NOP Bubble Injection',
                                                     'Control Hazard Mitigation: Early Branch Resolution, '
                                                     'pipeline Flushing and Static Branch Prediction',
                                                     'Verifying a Synthesizable 5-Stage Pipelined RV32IM '
                                                     'Core Against riscv-tests',
                                                     'Quantitative Case Study & Synthesis: Five-Stage '
                                                     'Pipelined Processor Design and Hazard Resolution',
                                                     'Frontier Research & Open Problems: Five-Stage '
                                                     'Pipelined Processor Design and Hazard Resolution']}]},
                           {'id': 'sys_arch_201',
                            'code': 'SYS 201',
                            'title': 'Superscalar Out-of-Order Microarchitecture and Memory Hierarchies',
                            'level': 200,
                            'credits': 4,
                            'description': "Dynamic branch prediction, Tomasulo's algorithm, register "
                                           'renaming, reorder buffers, speculative load-store queues, '
                                           'non-blocking caches and DRAM controllers.',
                            'prerequisites': ['sys_arch_101'],
                            'modules': [{'id': 'dynamic_branch_prediction',
                                         'title': 'Direction Predictors, Branch Target Buffers and TAGE',
                                         'summary': 'Two-level correlating predictors, gshare, tournament '
                                                    'predictors, TAGE and return address stacks.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['1-Bit and 2-Bit Saturating Counter Bimodal Predictors '
                                                     'and Aliasing Interference',
                                                     'Two-Level Adaptive Branch Prediction: Local/Global '
                                                     'History Registers and gshare/gselect',
                                                     'Tournament (Hybrid) Predictors and Perceptron-Based '
                                                     'Neural Branch Predictors',
                                                     'TAGE (TAgged GEometric History Length) Predictors and '
                                                     'ITTAGE Indirect Jump Prediction',
                                                     'Branch Target Buffers (BTBs), Return Address Stacks '
                                                     '(RAS) and Decoupled Fetch Frontends',
                                                     'High-Bandwidth Instruction Fetch: Trace Caches, Loop '
                                                     'Stream Detectors and Micro-Op Caches',
                                                     'Quantitative Case Study & Synthesis: Direction '
                                                     'Predictors, Branch Target Buffers and TAGE',
                                                     'Frontier Research & Open Problems: Direction '
                                                     'Predictors, Branch Target Buffers and TAGE']},
                                        {'id': 'register_renaming_tomasulo',
                                         'title': "Tomasulo's Algorithm, Register Renaming and Out-of-Order "
                                                  'Issue',
                                         'summary': 'Eliminating false WAR/WAW dependencies via RAT/PRF '
                                                    'renaming, reservation stations and wakeup-select loops.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ["Scoreboarding vs Tomasulo's Algorithm: Distributed "
                                                     'Reservation Stations and Common Data Bus (CDB)',
                                                     'Register Alias Tables (RAT), Free Lists and Merged '
                                                     'Physical Register File (PRF) Architectures',
                                                     'ROB-Based vs Unified PRF Renaming (MIPS R10000 / Intel '
                                                     'P6 / AMD Zen Microarchitectures)',
                                                     'Instruction Window Wakeup Logic (CAM Tag Broadcast) '
                                                     'and Priority Select Matrix Arbiters',
                                                     'Back-to-Back Dependent Instruction Issue, Bypass '
                                                     'Network Complexity and Clustering',
                                                     'In-Order Retirement with the Reorder Buffer (ROB) and '
                                                     'Precise Exception Recovery via Checkpointing',
                                                     "Quantitative Case Study & Synthesis: Tomasulo's "
                                                     'Algorithm, Register Renaming and Out-of-Order Issue',
                                                     "Frontier Research & Open Problems: Tomasulo's "
                                                     'Algorithm, Register Renaming and Out-of-Order Issue']},
                                        {'id': 'load_store_queues_disambiguation',
                                         'title': 'Speculative Memory Disambiguation and Load-Store Queues',
                                         'summary': 'Age-ordered load/store queues, store-to-load '
                                                    'forwarding, memory dependence prediction and store '
                                                    'sets.',
                                         'sim': 'state_machine',
                                         'lab': False,
                                         'lessons': ['Ordering Memory Operations Out-of-Order: Split Load '
                                                     'Queue (LQ) and Store Queue (SQ) Organization',
                                                     'Address Resolution, Partial/Full Store-to-Load '
                                                     'Forwarding and Banked Data Cache Access',
                                                     'Speculative Load Execution, Memory Order Violations '
                                                     'and Pipeline Squash/Replay Mechanisms',
                                                     'Memory Dependence Prediction: Chrysos-Emer Store Sets '
                                                     'and Store-Wait Tables',
                                                     'Non-Blocking (Lockup-Free) Caches: Miss Status Holding '
                                                     'Registers (MSHRs) and Memory-Level Parallelism (MLP)',
                                                     'Hardware Data Prefetchers: Stride, Stream, Spatial '
                                                     'Memory Streaming and Best-Offset Prefetching',
                                                     'Quantitative Case Study & Synthesis: Speculative '
                                                     'Memory Disambiguation and Load-Store Queues']},
                                        {'id': 'cache_microarchitecture_policies',
                                         'title': 'Cache Organization, Replacement Policies and Virtual '
                                                  'Indexing',
                                         'summary': 'VIPT caches, way prediction, SRRIP/DRRIP/Hawkeye '
                                                    'replacement and victim caches.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Set-Associative Cache Geometry, Tag/Data Array Banking '
                                                     'and CACTI Latency/Energy Modeling',
                                                     'Virtually Indexed Physically Tagged (VIPT) L1 Caches, '
                                                     'Page Coloring and Synonym Resolution',
                                                     'Replacement Policies Beyond LRU: Pseudo-LRU, NRU, '
                                                     'SRRIP, DRRIP and Belady-Guided Hawkeye',
                                                     'Inclusion Policies: Inclusive, Non-Inclusive and '
                                                     'Exclusive Last-Level Caches (LLCs) with Victim Caches',
                                                     'Translation Lookaside Buffers (TLBs), Multi-Level MMU '
                                                     'Page Table Walkers and Huge Pages',
                                                     'Writing a Trace-Driven Multi-Level Cache and '
                                                     'Prefetcher Simulator in C++/Python',
                                                     'Quantitative Case Study & Synthesis: Cache '
                                                     'Organization, Replacement Policies and Virtual '
                                                     'Indexing']},
                                        {'id': 'dram_controllers_interconnect',
                                         'title': 'DRAM Subsystem Architecture, HBM and Memory Controllers',
                                         'summary': 'DDR5/LPDDR5/HBM3 bank state machines, FR-FCFS '
                                                    'scheduling, refresh timing and Rowhammer mitigation.',
                                         'sim': 'state_machine',
                                         'lab': False,
                                         'lessons': ['DRAM Cell Physics (1T1C Capacitor), Sense Amplifiers, '
                                                     'Row Buffer Hits/Conflicts and Bank Groups',
                                                     'DRAM Command Protocol and Timing Parameters: tRCD, '
                                                     'tRP, tRAS, tCAS (CL), tWR and tRFC',
                                                     'Memory Controller Scheduling: First-Ready '
                                                     'First-Come-First-Served (FR-FCFS) and PAR-BS Batching',
                                                     '3D-Stacked High-Bandwidth Memory (HBM3/HBM3e), '
                                                     'Through-Silicon Vias (TSVs) and Silicon Interposers',
                                                     'DRAM Reliability: Chipkill ECC, On-Die ECC and '
                                                     'Rowhammer Disturbance Mitigations (TRR, PARA)',
                                                     'Compute Express Link (CXL.mem / CXL.cache) '
                                                     'Disaggregated and Pooled Memory Architectures',
                                                     'Quantitative Case Study & Synthesis: DRAM Subsystem '
                                                     'Architecture, HBM and Memory Controllers']}]},
                           {'id': 'sys_arch_301',
                            'code': 'SYS 301',
                            'title': 'Multicore Cache Coherence, Memory Consistency and Networks-on-Chip',
                            'level': 300,
                            'credits': 4,
                            'description': 'Snooping and directory-based MESI/MOESI cache coherence, formal '
                                           'memory consistency models (SC, TSO, RVWMO), atomic primitives, '
                                           'mesh/torus NoC routers and hardware security.',
                            'prerequisites': ['sys_arch_201'],
                            'modules': [{'id': 'snooping_directory_coherence',
                                         'title': 'Snooping and Directory-Based Cache Coherence Protocols',
                                         'summary': 'Single-writer-multiple-reader invariants, '
                                                    'MSI/MESI/MOESI/MESIF state transitions, transient '
                                                    'states and directories.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['The Cache Coherence Problem: '
                                                     'Single-Writer-Multiple-Reader (SWMR) and Data-Value '
                                                     'Invariants',
                                                     'Invalidation vs Update Protocols; Atomic Bus Snooping '
                                                     'and MSI/MESI/MOESI/MESIF Stable States',
                                                     'Split-Transaction Buses, Transient Protocol States '
                                                     '(IS_D, IM_AD, SM_A) and Race Resolution',
                                                     'Scalable Directory-Based Coherence: Full-Bit-Vector '
                                                     'Directories, Sparse Directories and Duplicate Tags',
                                                     'Three-Hop Read/Write Miss Transactions, Forwarded '
                                                     'Interventions and Invalidation Acknowledgments',
                                                     'Verifying Coherence Protocols Against Deadlock, '
                                                     'Livelock and Starvation with Murphi/TLA+',
                                                     'Quantitative Case Study & Synthesis: Snooping and '
                                                     'Directory-Based Cache Coherence Protocols']},
                                        {'id': 'memory_consistency_models',
                                         'title': 'Hardware Memory Consistency Models and Synchronization',
                                         'summary': 'Sequential consistency, x86-TSO, ARMv8/RISC-V RVWMO '
                                                    'weak ordering, litmus tests and LL/SC vs CAS atomics.',
                                         'sim': 'truth_table',
                                         'lab': True,
                                         'lessons': ["Coherence vs Consistency: Lamport's Sequential "
                                                     'Consistency (SC) and Reordering Litmus Tests (MP, SB, '
                                                     'IRIW)',
                                                     'Total Store Order (SPARC/x86-TSO): FIFO Write Buffers '
                                                     'and Store-Load Reordering',
                                                     'Relaxed/Weak Memory Models: ARMv8-A and RISC-V Weak '
                                                     'Memory Ordering (RVWMO) Fence Instructions',
                                                     'Release Consistency (RCsc/RCpc) and Mapping C++20 '
                                                     'memory_order_acquire/release/seq_cst to ISA Fences',
                                                     'Hardware Synchronization Primitives: Compare-and-Swap '
                                                     '(CAS), Fetch-and-Op and '
                                                     'Load-Reserved/Store-Conditional (LR/SC)',
                                                     'Hardware Transactional Memory (HTM): Speculative '
                                                     'Conflict Detection in L1 Cache and Fallback Locks',
                                                     'Quantitative Case Study & Synthesis: Hardware Memory '
                                                     'Consistency Models and Synchronization']},
                                        {'id': 'networks_on_chip_routers',
                                         'title': 'Networks-on-Chip (NoC): Topologies, Routing and '
                                                  'Virtual-Channel Flow Control',
                                         'summary': 'Mesh, torus, Clos and Dragonfly topologies, wormhole '
                                                    'switching, virtual channels and 4-stage pipelined '
                                                    'routers.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['On-Chip Interconnect Topologies: Rings, 2D Meshes, '
                                                     'Torus, Flattened Butterfly and Clos Networks',
                                                     'Dimension-Order (XY) Oblivious Routing, Turn Models '
                                                     '(West-First, Negative-First) and Deadlock Avoidance',
                                                     'Packet vs Flit Flow Control: Store-and-Forward, '
                                                     'Virtual Cut-Through and Wormhole Switching',
                                                     'Virtual Channels (VCs): Overcoming Head-of-Line '
                                                     'Blocking and Protocol-Level Deadlock Escape VCs',
                                                     'Pipelined NoC Router Microarchitecture: Route '
                                                     'Computation, VC Allocation, Switch Allocation and '
                                                     'Crossbar',
                                                     'Multi-Chiplet Die-to-Die Interconnects: UCIe, BoW, '
                                                     'NVLink and Co-Packaged Silicon Photonics',
                                                     'Quantitative Case Study & Synthesis: Networks-on-Chip '
                                                     '(NoC): Topologies, Routing and Virtual-Channel Flow '
                                                     'Control']},
                                        {'id': 'simd_vector_processors',
                                         'title': 'Vector Processors, Packed SIMD and Scalable Vector '
                                                  'Extensions',
                                         'summary': 'Cray-style vector machines, RISC-V Vector (RVV 1.0), '
                                                    'ARM SVE, predication, gather/scatter and strip-mining.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ["Flynn's Taxonomy and Data-Level Parallelism: Packed "
                                                     'Fixed-Width SIMD (AVX-512) vs Vector Architectures',
                                                     'Vector Length Agnostic (VLA) ISA Design: RISC-V Vector '
                                                     '(RVV 1.0) vsetvli, LMUL and SEW',
                                                     'Vector Chaining, Multi-Banked Vector Register Files '
                                                     'and Memory Bank Conflict Avoidance',
                                                     'Predicated Execution via Vector Mask Registers for '
                                                     'Divergent Control Flow',
                                                     'Unit-Stride, Constant-Stride and Indexed '
                                                     'Gather/Scatter Vector Memory Operations',
                                                     'Hardware Systolic Arrays vs Vector Engines: '
                                                     'Energy-per-Op Breakdown for Dense Matrix '
                                                     'Multiplication',
                                                     'Quantitative Case Study & Synthesis: Vector '
                                                     'Processors, Packed SIMD and Scalable Vector '
                                                     'Extensions']},
                                        {'id': 'microarchitectural_security_sidechannels',
                                         'title': 'Microarchitectural Side Channels, Speculative Execution '
                                                  'Attacks and Enclaves',
                                         'summary': 'Flush+Reload, Prime+Probe, Spectre, Meltdown, '
                                                    'constant-time hardware and Confidential Computing TEEs.',
                                         'sim': 'state_machine',
                                         'lab': False,
                                         'lessons': ['Cache Timing Side Channels: Evict+Time, Prime+Probe '
                                                     'and Flush+Reload Attacks on Cryptographic Keys',
                                                     'Transient Execution Attacks: Meltdown (Rogue Data '
                                                     'Cache Load) and Exception-Suppression Mechanics',
                                                     'Spectre Variants (Bounds Check Bypass v1, Branch '
                                                     'Target Injection v2, Speculative Store Bypass v4)',
                                                     'Hardware Defenses: KPTI, Retpoline, IBRS/STIBP, Way '
                                                     'Partitioning (CAT) and Randomized Skewed Caches',
                                                     'Speculative Taint Tracking (STT) and Invisible '
                                                     'Speculation in Out-of-Order Pipelines',
                                                     'Trusted Execution Environments (TEEs): Intel TDX, AMD '
                                                     'SEV-SNP, ARM CCA and Keystone RISC-V Enclaves',
                                                     'Quantitative Case Study & Synthesis: '
                                                     'Microarchitectural Side Channels, Speculative '
                                                     'Execution Attacks and Enclaves']}]},
                           {'id': 'sys_arch_410',
                            'code': 'SYS 410',
                            'title': 'Performance Modeling, Architectural Simulation and Hardware Specialization',
                            'level': 400,
                            'credits': 4,
                            'description': 'Predict and measure processor performance with analytical models and cycle-level '
                                           'simulators, exploit vector and dataflow execution, and prototype specialized hardware via '
                                           'high-level synthesis. Bridges multicore architecture to graduate-level accelerator and '
                                           'chiplet SoC design.',
                            'prerequisites': ['sys_arch_301'],
                            'modules': [{'id': 'performance_models',
                                         'title': 'Analytical Performance Modeling',
                                         'summary': 'Back-of-the-envelope models that predict where performance is bounded.',
                                         'lab': True,
                                         'lessons': ['Iron Law of Performance and CPI Stacks',
                                                     'The Roofline Model: Arithmetic Intensity vs Bandwidth',
                                                     'Amdahl, Gustafson and the Limits of Parallel Speedup',
                                                     "Queueing Models of Memory Systems and Little's Law",
                                                     'Building Roofline Plots for Real Kernels in Python']},
                                        {'id': 'architectural_simulation',
                                         'title': 'Architectural Simulation Methodology',
                                         'summary': 'How architects evaluate ideas before silicon exists.',
                                         'lab': True,
                                         'lessons': ['Trace-Driven vs Execution-Driven vs Full-System Simulation',
                                                     'gem5 Architecture: CPU Models, Ruby and Configuration Scripts',
                                                     'Sampling Methods: SimPoint and SMARTS',
                                                     'Writing a Simple Cache Simulator and Validating Against Traces']},
                                        {'id': 'vector_simd',
                                         'title': 'Vector and SIMD Architectures',
                                         'summary': 'Data-level parallelism from classic vector machines to RISC-V V.',
                                         'lab': True,
                                         'lessons': ['Cray-Style Vector Processing and Chaining',
                                                     'Packed SIMD (AVX-512, NEON) vs Scalable Vector ISAs (SVE, RVV)',
                                                     'Masking, Gather/Scatter and Strip-Mining Loops',
                                                     'Vector Register File and Lane Design',
                                                     'Measuring Auto-Vectorization Speedups on Benchmark Loops']},
                                        {'id': 'dataflow_spatial',
                                         'title': 'Dataflow and Spatial Architectures',
                                         'summary': 'Moving beyond von Neumann execution toward accelerators.',
                                         'lessons': ['Static vs Dynamic Dataflow Machines',
                                                     'CGRAs and Spatial Mapping of Computation',
                                                     'Dataflow Taxonomies for DNN Accelerators: Weight, Output and Row Stationary',
                                                     'Energy Cost of Data Movement and the Memory Wall']},
                                        {'id': 'hls_codesign',
                                         'title': 'High-Level Synthesis and Hardware/Software Co-Design',
                                         'summary': 'Generating hardware from C++ and partitioning systems across HW and SW.',
                                         'lessons': ['High-Level Synthesis: Scheduling, Binding and Pipelining Pragmas',
                                                     'FPGA Fabric Resources: LUTs, DSPs and BRAM',
                                                     'Co-Design Methodology and Hardware/Software Partitioning',
                                                     'Chisel and Agile Hardware Generators',
                                                     'Profiling a Workload to Identify Acceleration Candidates']}]},
                           {'id': 'sys_arch_401',
                            'code': 'SYS 401',
                            'title': 'Domain-Specific Accelerators, Systolic Tensor Cores and Chiplet SoC '
                                     'Design',
                            'level': 500,
                            'credits': 4,
                            'description': 'Graduate hardware architecture: Roofline modeling, TPU/NPU '
                                           'systolic arrays, sparsity hardware, dataflow spatial '
                                           'architectures, quantization units and ASIC physical synthesis.',
                            'prerequisites': ['sys_arch_301', 'sys_arch_410'],
                            'modules': [{'id': 'roofline_horowitz_energy',
                                         'title': 'Roofline Performance Bounds and Horowitz Energy Cost '
                                                  'Modeling',
                                         'summary': 'Operational intensity, bandwidth ceilings, dark '
                                                    "silicon, 45nm/5nm pJ-per-op energy models and Amdahl's "
                                                    'law.',
                                         'sim': 'function_plotter',
                                         'lab': True,
                                         'lessons': ['Dennard Scaling Breakdown, Dark Silicon Constraints '
                                                     "and Specialization as the Path Past Moore's Law",
                                                     'Horowitz Energy Breakdown: Why 64-Bit SRAM/DRAM Data '
                                                     'Movement Costs 100x–1000x More Than an FP16 MAC',
                                                     'The Roofline Model: Operational Intensity '
                                                     '(FLOPs/Byte), Ridge Point and Compute vs Bandwidth '
                                                     'Ceilings',
                                                     'Hierarchical Roofline Analysis Across L1 Scratchpad, '
                                                     'L2 SRAM, HBM3 and Off-Chip Interconnects',
                                                     'Data Reuse Taxonomies: Temporal vs Spatial Reuse, '
                                                     'Weight-Stationary, Output-Stationary and '
                                                     'Row-Stationary',
                                                     'Analytical Modeling of Accelerator Tile Sizes, '
                                                     'Scratchpad Capacities and Double-Buffered DMA Engines',
                                                     'Quantitative Case Study & Synthesis: Roofline '
                                                     'Performance Bounds and Horowitz Energy Cost Modeling']},
                                        {'id': 'systolic_arrays_tensor_cores',
                                         'title': 'Systolic Array Microarchitecture and Mixed-Precision '
                                                  'Tensor Cores',
                                         'summary': 'Weight/output-stationary 2D MAC arrays, FP8/FP4/INT4 '
                                                    'arithmetic units, microscaling formats and Gemmini/TPU '
                                                    'design.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Kung-Leiserson Systolic Arrays: Wavefront Skewing, '
                                                     'Processing Element (PE) Pipelines and Zero-Control '
                                                     'Overhead',
                                                     'Google TPU v1–v5e Architecture: Matrix Multiply Units '
                                                     '(MXUs), Vector Units (VPUs) and Scalar Control',
                                                     'NVIDIA Tensor Core Microarchitecture: Warp-Level MMA '
                                                     'Instructions, Register Layout and Shared Memory '
                                                     'Swizzling',
                                                     'Low-Precision Floating-Point Hardware: BF16, FP8 '
                                                     '(E4M3/E5M2), FP4 and OCP Microscaling (MXFP8/MXFP4) '
                                                     'Block Exponents',
                                                     'Hardware-Accelerated Softmax, LayerNorm/RMSNorm and '
                                                     'Online FlashAttention Rescaling Pipelines',
                                                     'Designing a Parameterized Systolic Matrix Engine in '
                                                     'Chisel/SystemVerilog (Gemmini Architecture)',
                                                     'Quantitative Case Study & Synthesis: Systolic Array '
                                                     'Microarchitecture and Mixed-Precision Tensor Cores']},
                                        {'id': 'sparse_cgra_dataflow',
                                         'title': 'Sparse Tensor Accelerators and Spatial Dataflow '
                                                  'Architectures',
                                         'summary': '2:4 structured sparsity multiplexers, CSR/CSF '
                                                    'intersection units, Coarse-Grained Reconfigurable '
                                                    'Arrays (CGRAs) and wafer-scale engines.',
                                         'sim': 'graph_theory',
                                         'lab': False,
                                         'lessons': ['Unstructured vs N:M (2:4) Structured Sparsity: '
                                                     'Metadata Encoding and Multiplexer Crossbar Design',
                                                     'Compressed Sparse Row (CSR), Compressed Sparse Fiber '
                                                     '(CSF) and Hardware Coordinate Intersection Units',
                                                     'Dual-Side Sparsity Accelerators: Eyeriss, SCNN, '
                                                     'ExTensor and SpArch Merge Trees',
                                                     'Coarse-Grained Reconfigurable Arrays (CGRAs) and '
                                                     'Reconfigurable Dataflow Units (SambaNova RDU)',
                                                     'Wafer-Scale Integration: Cerebras WSE Defect-Tolerant '
                                                     '2D Mesh Routing and SRAM-Only Execution',
                                                     'Processing-in-Memory (PIM) and Analog Crossbar '
                                                     'Compute-in-Memory (SRAM/ReRAM CiM) Trade-offs',
                                                     'Quantitative Case Study & Synthesis: Sparse Tensor '
                                                     'Accelerators and Spatial Dataflow Architectures']},
                                        {'id': 'asic_physical_design_tapeout',
                                         'title': 'ASIC Physical Synthesis, Clock Tree Synthesis and '
                                                  'FinFET/GAA Tapeout',
                                         'summary': 'RTL-to-GDSII flow, standard cell libraries, '
                                                    'floorplanning, clock trees, IR drop and DRC/LVS '
                                                    'signoff.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['The RTL-to-GDSII ASIC Flow: Logic Synthesis, '
                                                     'Technology Mapping and Multi-Corner Multi-Mode (MCMM) '
                                                     'STA',
                                                     'Standard Cell Libraries: Multi-Vt (ULVT, LVT, SVT) '
                                                     'Leakage/Speed Trade-offs and FinFET/GAA Nanosheet '
                                                     'Layout',
                                                     'Floorplanning, Macro Placement, Power Distribution '
                                                     'Networks (PDN) and Dynamic IR-Drop Analysis',
                                                     'Global and Detailed Placement, Clock Tree Synthesis '
                                                     '(H-Trees, Mesh Clocks) and Useful Skew Optimization',
                                                     'Design for Testability (DFT): Scan Chains, ATPG '
                                                     'Stuck-At/Transition Faults and Built-In Self-Test '
                                                     '(MBIST/LBIST)',
                                                     'Physical Verification Signoff: Design Rule Checking '
                                                     '(DRC), Layout Versus Schematic (LVS) and Parasitic '
                                                     'Extraction (PEX)',
                                                     'Quantitative Case Study & Synthesis: ASIC Physical '
                                                     'Synthesis, Clock Tree Synthesis and FinFET/GAA '
                                                     'Tapeout']}]}]},
              {'id': 'operating_systems_kernels',
               'name': 'Operating Systems, Kernel Internals & Storage Engines',
               'icon': '⚙️',
               'description': 'Virtual memory page tables, preemptive CPU scheduling, lock-free concurrency, '
                              'Read-Copy-Update (RCU), file systems, NVMe io_uring asynchronous I/O, eBPF '
                              'and hypervisors.',
               'courses': [{'id': 'sys_os_101',
                            'code': 'OS 101',
                            'title': 'Operating System Abstractions: Processes, Virtual Memory and '
                                     'Concurrency',
                            'level': 100,
                            'credits': 4,
                            'description': 'Privilege rings, trap handlers, process address spaces, radix '
                                           'page tables, demand paging, threads, mutexes, condition '
                                           'variables and classical synchronization.',
                            'prerequisites': ['sys_arch_101'],
                            'modules': [{'id': 'privilege_traps_processes',
                                         'title': 'Hardware Privilege Modes, System Calls and Process '
                                                  'Lifecycle',
                                         'summary': 'User vs supervisor mode, trap frames, context '
                                                    'switching, fork/execve/waitpid and UNIX process '
                                                    'semantics.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Dual-Mode Operation: x86-64 Rings / RISC-V U-Mode, '
                                                     'S-Mode and M-Mode Hardware Protection',
                                                     'System Call ABI Mechanics: SYSCALL/ECALL Instructions, '
                                                     'Trap Frames and Kernel Stack Switching',
                                                     'The Process Abstraction: Task Control Blocks '
                                                     '(task_struct), Process States and Context Switch '
                                                     'Assembly',
                                                     'Process Creation and Execution: UNIX fork(), '
                                                     'Copy-on-Write (CoW), execve() ELF Loading and '
                                                     'waitpid()',
                                                     'Inter-Process Communication (IPC): Anonymous Pipes, '
                                                     'Named FIFOs, UNIX Domain Sockets and Shared Memory',
                                                     'Asynchronous Signals: Pending/Blocked Bitmasks, Signal '
                                                     'Trampolines on User Stacks and Reentrancy Safety',
                                                     'Quantitative Case Study & Synthesis: Hardware '
                                                     'Privilege Modes, System Calls and Process Lifecycle']},
                                        {'id': 'virtual_memory_pagetables',
                                         'title': 'Virtual Memory, Multi-Level Radix Page Tables and Demand '
                                                  'Paging',
                                         'summary': '4-level/5-level page tables, TLB shootdowns, page fault '
                                                    'handlers, Copy-on-Write and clock/LRU eviction.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Address Translation Evolution: Base-and-Bounds, '
                                                     'Segmentation and Multi-Level Radix Page Tables '
                                                     '(Sv39/Sv48, x86-64 4/5-Level)',
                                                     'Page Table Entries (PTEs): Present, Read/Write, '
                                                     'User/Supervisor, NX, Dirty/Accessed Bits and Huge '
                                                     'Pages (2MB/1GB)',
                                                     'TLB Management: Address Space Identifiers '
                                                     '(ASIDs/PCIDs), Context Switch Flushes and '
                                                     'Inter-Processor TLB Shootdowns',
                                                     'Page Fault Handling: Minor vs Major Faults, '
                                                     'Zero-Fill-on-Demand, Copy-on-Write (CoW) and '
                                                     'Memory-Mapped Files (mmap)',
                                                     "Page Replacement Algorithms: Belady's MIN, Clock "
                                                     '(Second-Chance), Active/Inactive Two-List LRU and '
                                                     'MGLRU',
                                                     'Working Set Theory, Thrashing Detection, Swap '
                                                     'Subsystems and Out-of-Memory (OOM) Killer Heuristics',
                                                     'Quantitative Case Study & Synthesis: Virtual Memory, '
                                                     'Multi-Level Radix Page Tables and Demand Paging']},
                                        {'id': 'cpu_scheduling_disciplines',
                                         'title': 'Preemptive CPU Scheduling: MLFQ, Proportional Share and '
                                                  'EEVDF',
                                         'summary': 'Turnaround vs response time, Multi-Level Feedback '
                                                    'Queues, lottery/stride scheduling, Linux CFS and EEVDF.',
                                         'sim': 'pid_controller',
                                         'lab': True,
                                         'lessons': ['Scheduling Metrics and Classical Policies: FCFS, SJF, '
                                                     'STCF, Round-Robin and the Convoy Effect',
                                                     'Multi-Level Feedback Queue (MLFQ): Priority Decay, '
                                                     'Anti-Gaming Accounting and Periodic Priority Boosts',
                                                     "Proportional-Share Scheduling: Waldspurger's Lottery "
                                                     'Scheduling and Deterministic Stride Scheduling',
                                                     'Linux Completely Fair Scheduler (CFS): Virtual Runtime '
                                                     '(vruntime), Nice Weights and Red-Black Runqueues',
                                                     'Earliest Eligible Virtual Deadline First (EEVDF): Lag '
                                                     'Tracking, Virtual Deadlines and Latency-Critical Slice '
                                                     'Control',
                                                     'Multiprocessor Scheduling: Per-CPU Runqueues, Cache '
                                                     'Affinity, Work Stealing and NUMA-Aware Load Balancing',
                                                     'Quantitative Case Study & Synthesis: Preemptive CPU '
                                                     'Scheduling: MLFQ, Proportional Share and EEVDF']},
                                        {'id': 'threads_locks_synchronization',
                                         'title': 'Threads, Locks, Condition Variables and Deadlock '
                                                  'Prevention',
                                         'summary': 'Kernel vs user threads, spinlocks, futex-backed '
                                                    'mutexes, Mesa condition variables and Coffman deadlock '
                                                    'conditions.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Thread Execution Contexts: Thread Control Blocks, '
                                                     'Thread-Local Storage (TLS) and 1:1 vs M:N Threading '
                                                     'Models',
                                                     'Spinlocks in detail: Test-and-Set, Ticket Locks, MCS '
                                                     'Queue Locks and Cache-Line Bouncing under Contention',
                                                     'Sleeping Mutexes and Linux Futexes (Fast Userspace '
                                                     'Locking): Two-Phase Spin-then-Park Hybrid Locks',
                                                     'Condition Variables: Mesa vs Hoare Semantics, Spurious '
                                                     'Wakeups and Producer-Consumer Bounded Buffers',
                                                     'Counting Semaphores, Reader-Writer Locks and Priority '
                                                     'Inversion / Priority Inheritance Protocols',
                                                     "Coffman's Four Deadlock Conditions, Lock Ordering "
                                                     'Hierarchies and Lockdep Dynamic Cycle Detection',
                                                     'Quantitative Case Study & Synthesis: Threads, Locks, '
                                                     'Condition Variables and Deadlock Prevention']},
                                        {'id': 'persistence_filesystems_basics',
                                         'title': 'I/O Devices, Block Layers and Classic File System Design',
                                         'summary': 'Interrupts vs DMA, inode structures, VSFS, Berkeley FFS '
                                                    'cylinder groups and write-ahead journaling (ext4).',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Device Interaction: Memory-Mapped I/O (MMIO), '
                                                     'Interrupt Coalescing, Direct Memory Access (DMA) and '
                                                     'IOMMUs',
                                                     'File System Abstractions: Inodes, Directory Entries '
                                                     '(dentries), Hard/Symbolic Links and the Virtual File '
                                                     'System (VFS)',
                                                     'On-Disk Layout of a Simple File System (VSFS): '
                                                     'Superblocks, Inode/Data Bitmaps and Multi-Level '
                                                     'Indirect Blocks',
                                                     'Berkeley Fast File System (FFS) and Ext4: Extents, '
                                                     'Block Allocation Locality and HTree Directory Indexing',
                                                     'Crash Consistency: fsck vs Write-Ahead Logging '
                                                     '(Journaling Data, Ordered and Writeback Modes in JBD2)',
                                                     'Implementing a Journaling Inode File System inside an '
                                                     'Educational RISC-V Kernel (xv6)',
                                                     'Quantitative Case Study & Synthesis: I/O Devices, '
                                                     'Block Layers and Classic File System Design']}]},
                           {'id': 'sys_os_201',
                            'code': 'OS 201',
                            'title': 'Advanced Kernel Internals: Lockless Concurrency, RCU and Allocators',
                            'level': 200,
                            'credits': 4,
                            'description': 'Linux/seL4 kernel architecture, slab/slub and buddy allocators, '
                                           'non-blocking data structures, hazard pointers, Read-Copy-Update '
                                           '(RCU), interrupt bottom-halves and memory compaction.',
                            'prerequisites': ['sys_os_101', 'sys_arch_201'],
                            'modules': [{'id': 'kernel_memory_allocators',
                                         'title': 'Physical Page Management: Buddy System, Slab/SLUB and '
                                                  'Vmalloc',
                                         'summary': "NUMA zones, binary buddy allocation, Bonwick's slab "
                                                    'caches, per-CPU SLUB magazines and jemalloc/mimalloc.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Physical Memory Organization: NUMA Nodes, Memory '
                                                     'Zones, struct page Metadata and Sparse Memory Models',
                                                     'The Binary Buddy Allocator: Order-k Page '
                                                     'Splitting/Coalescing, Per-CPU Page Frame Caches and '
                                                     'Fragmentation Avoidance',
                                                     "Bonwick's Slab Allocator: Object Caching, Constructor "
                                                     'Reuse, Cache Coloring and SLAB vs SLUB Internals',
                                                     'Lockless Per-CPU SLUB Allocation Fastpaths, Partial '
                                                     'Slab Lists and KASAN Out-of-Bounds Memory Sanitizers',
                                                     'Non-Contiguous Kernel Virtual Memory (vmalloc), '
                                                     'Reverse Mapping (rmap) and Transparent Huge Page (THP) '
                                                     'Compaction',
                                                     'High-Performance Userspace Allocators: Thread-Caching '
                                                     'Malloc (tcmalloc), jemalloc Arenas and mimalloc Free '
                                                     'Lists',
                                                     'Quantitative Case Study & Synthesis: Physical Page '
                                                     'Management: Buddy System, Slab/SLUB and Vmalloc']},
                                        {'id': 'lockfree_algorithms_reclamation',
                                         'title': 'Lock-Free and Wait-Free Data Structures and Safe Memory '
                                                  'Reclamation',
                                         'summary': "Linearizability, Herlihy's consensus hierarchy, "
                                                    'Michael-Scott queues, ABA mitigation, epoch reclamation '
                                                    'and hazard pointers.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Correctness of Concurrent Objects: Sequential '
                                                     'Consistency vs Linearizability (Linearization Points)',
                                                     'Progress Guarantees (Obstruction-Free, Lock-Free, '
                                                     "Wait-Free) and Herlihy's Consensus Hierarchy",
                                                     'Treiber Lock-Free Stack, Michael-Scott Lock-Free Queue '
                                                     'and the ABA Problem (Tagged Pointers / LL-SC)',
                                                     'Lock-Free Hash Tables: Split-Ordered Lists and '
                                                     'Hopscotch/Cuckoo Concurrent Hashing',
                                                     'The Safe Memory Reclamation Problem: Quiescent State, '
                                                     'Epoch-Based Reclamation (EBR) and Hazard Pointers',
                                                     'Bounded Single-Producer/Multi-Producer Ring Buffers '
                                                     '(Linux kfifo and LMAX Disruptor Patterns)',
                                                     'Quantitative Case Study & Synthesis: Lock-Free and '
                                                     'Wait-Free Data Structures and Safe Memory '
                                                     'Reclamation']},
                                        {'id': 'rcu_kernel_synchronization',
                                         'title': 'Read-Copy-Update (RCU), Sequence Locks and Scalable '
                                                  'Kernel Synchronization',
                                         'summary': 'Zero-overhead reader paths, grace periods, Tree RCU, '
                                                    'seqlocks and scalable reference counting.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Read-Mostly Workloads: Why Reader-Writer Locks '
                                                     'Collapse on 128-Core Servers Due to Cache-Line '
                                                     'Contention',
                                                     'Read-Copy-Update (RCU) Fundamentals: Publish-Subscribe '
                                                     'Pointer Updates, rcu_read_lock() and Grace Periods',
                                                     'Classic vs Preemptible RCU, Quiescent State Tracking '
                                                     'and Hierarchical Tree RCU for Thousands of CPUs',
                                                     'RCU-Protected Linked Lists, Hash Tables (Resizable '
                                                     'Relativistic Hash Tables) and Deferred kfree_rcu()',
                                                     'Sequence Locks (seqlock_t): Optimistic Lockless '
                                                     'Readers with Odd/Even Sequence Counters',
                                                     'Scalable Reference Counting (percpu_ref), Split '
                                                     'Counters and Read-Mostly MCS/qspinlock Implementations',
                                                     'Quantitative Case Study & Synthesis: Read-Copy-Update '
                                                     '(RCU), Sequence Locks and Scalable Kernel '
                                                     'Synchronization']},
                                        {'id': 'interrupts_softirqs_timers',
                                         'title': 'Interrupt Handling, Softirqs, Workqueues and '
                                                  'High-Resolution Timers',
                                         'summary': 'APIC/PLIC interrupt routing, top-half vs bottom-half '
                                                    'split, NAPI polling, timer wheels and tickless kernels.',
                                         'sim': 'pid_controller',
                                         'lab': False,
                                         'lessons': ['Hardware Interrupt Controllers: x86 Local APIC / '
                                                     'IO-APIC, MSI-X Vectors and RISC-V PLIC/AIA',
                                                     'Top-Half Hardirq Handlers vs Deferred Bottom-Half '
                                                     'Processing: Softirqs, Tasklets and Threaded IRQs',
                                                     'Kernel Workqueues (Concurrency-Managed Workqueues): '
                                                     'Worker Pools and Sleeping Context Execution',
                                                     'Network Interrupt Mitigation: New API (NAPI) Adaptive '
                                                     'Interrupt-to-Polling Transitions',
                                                     'Timekeeping Hardware (TSC, HPET, ARM Generic Timer), '
                                                     'Hierarchical Timer Wheels and hrtimer Red-Black Trees',
                                                     'Tickless Kernel Operation (NO_HZ_IDLE and NO_HZ_FULL) '
                                                     'for Ultra-Low-Jitter HPC and Real-Time Workloads',
                                                     'Quantitative Case Study & Synthesis: Interrupt '
                                                     'Handling, Softirqs, Workqueues and High-Resolution '
                                                     'Timers']},
                                        {'id': 'real_time_microkernels',
                                         'title': 'Real-Time Scheduling (PREEMPT_RT) and Formally Verified '
                                                  'Microkernels',
                                         'summary': 'Rate-monotonic and EDF real-time bounds, Linux '
                                                    'PREEMPT_RT, L4 fast IPC and seL4 formal verification.',
                                         'sim': 'state_machine',
                                         'lab': False,
                                         'lessons': ['Hard vs Soft Real-Time Systems: Liu-Layland '
                                                     'Rate-Monotonic (RM) and Earliest Deadline First (EDF) '
                                                     'Schedulability',
                                                     'Priority Inversion in Real-Time Systems: Priority '
                                                     'Ceiling Protocol andLinux SCHED_DEADLINE (CBS)',
                                                     'The Linux PREEMPT_RT Architecture: Converting '
                                                     'Spinlocks to RT-Mutexes and Forced Threaded Interrupts',
                                                     "Monolithic Kernels vs Liedtke's Generation-2 "
                                                     'Microkernels (L4): Minimality Principle and Fast '
                                                     'Register IPC',
                                                     'Capability-Based Security and Access Control in seL4: '
                                                     'CNodes, Untyped Memory Retyping and Zero-Allocation '
                                                     'Kernel',
                                                     'Machine-Checked Formal Proof of seL4 in Isabelle/HOL: '
                                                     'Refinement from Abstract Spec to C and Binary',
                                                     'Quantitative Case Study & Synthesis: Real-Time '
                                                     'Scheduling (PREEMPT_RT) and Formally Verified '
                                                     'Microkernels']}]},
                           {'id': 'sys_os_301',
                            'code': 'OS 301',
                            'title': 'Modern Storage Engines, NVMe, io_uring and Copy-on-Write File Systems',
                            'level': 300,
                            'credits': 4,
                            'description': 'Flash FTL internals, NVMe submission/completion queues, Linux '
                                           'io_uring, SPDK kernel-bypass storage, ZFS/Btrfs copy-on-write '
                                           'trees and B+-tree/LSM-tree storage engines.',
                            'prerequisites': ['sys_os_201'],
                            'modules': [{'id': 'nand_flash_nvme_protocol',
                                         'title': 'NAND Flash Physics, Flash Translation Layers and the NVMe '
                                                  'Protocol',
                                         'summary': 'Erase-before-write asymmetry, wear leveling, write '
                                                    'amplification, NVMe queue pairs and ZNS SSDs.',
                                         'sim': 'state_machine',
                                         'lab': False,
                                         'lessons': ['NAND Flash Architecture: SLC/MLC/TLC/QLC Cells, Page '
                                                     'Reads/Programs vs Block Erases and Read Disturb',
                                                     'The Flash Translation Layer (FTL): Logical-to-Physical '
                                                     '(L2P) Mapping Tables, Garbage Collection and TRIM',
                                                     'Write Amplification Factor (WAF), Over-Provisioning, '
                                                     'Dynamic/Static Wear Leveling and Tail Latency Spikes',
                                                     'NVMe over PCIe Architecture: 64K Submission/Completion '
                                                     'Queue Pairs, Doorbell Registers and PRP/SGL DMA',
                                                     'Zoned Namespaces (ZNS) and Flexible Data Placement '
                                                     '(FDP): Eliminating FTL Garbage Collection Overhead',
                                                     'NVMe over Fabrics (NVMe-oF): RDMA and TCP Transport '
                                                     'Bindings for Disaggregated Flash Arrays',
                                                     'Quantitative Case Study & Synthesis: NAND Flash '
                                                     'Physics, Flash Translation Layers and the NVMe '
                                                     'Protocol']},
                                        {'id': 'io_uring_spdk_bypass',
                                         'title': 'Asynchronous Ring-Buffer I/O (io_uring) and Kernel-Bypass '
                                                  'Storage (SPDK)',
                                         'summary': 'Zero-syscall SQE/CQE rings, registered buffers, polled '
                                                    'NVMe I/O and userspace run-to-completion storage.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Evolution of Linux I/O: Blocking read/write, POSIX '
                                                     'AIO, epoll Readiness Notification and Linux AIO '
                                                     'Limitations',
                                                     'io_uring Architecture: Shared Memory Submission Queue '
                                                     '(SQ) and Completion Queue (CQ) Ring Buffers',
                                                     'Memory Ordering Barriers in io_uring, Linked SQE '
                                                     'Chains, Fixed Files and Registered DMA Buffers',
                                                     'Zero-Syscall I/O: SQPOLL Kernel Polling Threads and '
                                                     'IOPOLL NVMe Completion Queue Polling',
                                                     'Storage Performance Development Kit (SPDK): Userspace '
                                                     'VFIO PCIe Drivers, Polled Mode and Share-Nothing '
                                                     'Sharding',
                                                     'Building a Million-IOPS Asynchronous Storage Server '
                                                     'with io_uring in C/Rust',
                                                     'Quantitative Case Study & Synthesis: Asynchronous '
                                                     'Ring-Buffer I/O (io_uring) and Kernel-Bypass Storage '
                                                     '(SPDK)']},
                                        {'id': 'cow_filesystems_zfs_btrfs',
                                         'title': 'Copy-on-Write File Systems: ZFS, Btrfs and Log-Structured '
                                                  'Designs',
                                         'summary': 'Merkle-tree block pointers, end-to-end checksums, '
                                                    'instantaneous snapshots, B-trees with CoW and F2FS.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Log-Structured File Systems (Rosenblum-Ousterhout '
                                                     'LFS): Sequentializing Writes, Imap and Segment '
                                                     'Cleaning',
                                                     'Copy-on-Write (CoW) B-Trees (Rodeh): Shadow Paging '
                                                     'without Parent-Pointer Cascades and Reflink Clones',
                                                     'ZFS Architecture: Pooled Storage (SPA), Merkle-Tree '
                                                     'Checksummed Block Pointers and Silent Bit-Rot '
                                                     'Self-Healing',
                                                     'ZFS Adaptive Replacement Cache (ARC), Intent Log '
                                                     '(ZIL/SLOG), Transaction Groups (TXGs) and RAID-Z',
                                                     'Btrfs Internals: Extent Trees, Subvolumes, '
                                                     'Instantaneous Writable Snapshots and Send/Receive '
                                                     'Incremental Sync',
                                                     'Flash-Friendly File System (F2FS): Multi-Head '
                                                     'Hot/Warm/Cold Log Separation for Flash Media',
                                                     'Quantitative Case Study & Synthesis: Copy-on-Write '
                                                     'File Systems: ZFS, Btrfs and Log-Structured Designs']},
                                        {'id': 'btree_lsm_storage_engines',
                                         'title': 'Database Storage Engines: Slotted-Page B+-Trees, WiscKey '
                                                  'and LSM-Trees',
                                         'summary': 'Buffer pool management, ARIES write-ahead logging, '
                                                    'Bw-Trees, RocksDB LSM compaction and Bloom filters.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['B+-Tree Storage Engines: Slotted Pages, Prefix Key '
                                                     'Compression, Latch Crabbing and Blink-Trees '
                                                     '(Lehman-Yao)',
                                                     'Buffer Pool Management: Pointer Swizzling, Page '
                                                     'Pinning, Dirty Page Flushing and Direct I/O vs OS Page '
                                                     'Cache',
                                                     'ARIES Recovery Protocol: Write-Ahead Logging (WAL), '
                                                     'Steal/No-Force, Fuzzy Checkpoints and '
                                                     'Analysis/Redo/Undo',
                                                     'Log-Structured Merge (LSM) Trees (RocksDB/LevelDB): '
                                                     'MemTables, SkipLists, Immutable SSTables and Block '
                                                     'Indexes',
                                                     'LSM Compaction Strategies: Size-Tiered vs Leveled vs '
                                                     'Universal Compaction and RUM Conjecture Trade-offs',
                                                     'Monkey Optimal Bloom Filter Bit Allocation, Ribbon '
                                                     'Filters and Key-Value Separation (WiscKey / BlobDB)',
                                                     'Quantitative Case Study & Synthesis: Database Storage '
                                                     'Engines: Slotted-Page B+-Trees, WiscKey and '
                                                     'LSM-Trees']}]},
                           {'id': 'sys_os_410',
                            'code': 'OS 410',
                            'title': 'Isolation, Containers, Kernel Extensibility and Modern Scheduling',
                            'level': 400,
                            'credits': 4,
                            'description': 'Build and reason about the isolation mechanisms underpinning cloud computing — hardware '
                                           'virtualization primitives, namespaces and cgroups, eBPF programs and secure sandboxes — and '
                                           'analyse modern CPU schedulers. Bridges kernel internals and storage to graduate-level '
                                           'hypervisor and datacenter OS design.',
                            'prerequisites': ['sys_os_301', 'sys_os_201'],
                            'modules': [{'id': 'hw_virtualization_basics',
                                         'title': 'Hardware Virtualization Primitives',
                                         'summary': 'The CPU and MMU features that make efficient virtual machines possible.',
                                         'lessons': ['Popek–Goldberg Requirements and Trap-and-Emulate',
                                                     'Intel VT-x / AMD-V: VMX Root Mode and VM Exits',
                                                     'Nested Paging with EPT/NPT and TLB Implications',
                                                     'I/O Virtualization: Emulation, Virtio and SR-IOV']},
                                        {'id': 'containers',
                                         'title': 'Containers: Namespaces and cgroups',
                                         'summary': 'Lightweight OS-level virtualization from first principles.',
                                         'lab': True,
                                         'lessons': ['Linux Namespaces: PID, Mount, Network, User and IPC',
                                                     'cgroups v2: CPU, Memory and I/O Resource Control',
                                                     'Overlay File Systems and Container Images',
                                                     'Building a Minimal Container Runtime with unshare and pivot_root',
                                                     'Container Orchestration Primitives Underneath Kubernetes']},
                                        {'id': 'ebpf_programming',
                                         'title': 'eBPF Programming and Kernel Extensibility',
                                         'summary': 'Safely running user-supplied code inside the kernel.',
                                         'lab': True,
                                         'lessons': ['The eBPF Virtual Machine, Maps and Helper Functions',
                                                     'The eBPF Verifier: Bounded Loops and Memory Safety',
                                                     'Tracing with kprobes, tracepoints and BCC',
                                                     'XDP for High-Performance Packet Processing',
                                                     'Writing eBPF Tracing Tools with BCC in Python']},
                                        {'id': 'modern_scheduling',
                                         'title': 'Modern CPU Scheduling',
                                         'summary': 'From CFS to EEVDF and pluggable schedulers in production kernels.',
                                         'lab': True,
                                         'lessons': ['Completely Fair Scheduler: vruntime and Red-Black Trees',
                                                     'EEVDF: Virtual Deadlines and Latency Fairness',
                                                     'NUMA-Aware Load Balancing and Scheduling Domains',
                                                     'sched_ext: Writing Schedulers in eBPF',
                                                     'Simulating Scheduling Policies and Comparing Tail Latency']},
                                        {'id': 'sandboxing_security',
                                         'title': 'Sandboxing and Confidential Computing',
                                         'summary': 'Defending the boundary between tenants.',
                                         'lessons': ['seccomp-bpf System Call Filtering',
                                                     'User-Space Kernels (gVisor) and MicroVMs (Firecracker)',
                                                     'Side Channels: Spectre, Meltdown and Mitigations',
                                                     'Trusted Execution Environments: SGX, SEV-SNP and TDX']}]},
                           {'id': 'sys_os_401',
                            'code': 'OS 401',
                            'title': 'Virtualization, Hypervisors, eBPF Verification and Datacenter OS '
                                     'Design',
                            'level': 500,
                            'credits': 4,
                            'description': 'Hardware virtualization (VT-x/EPT, KVM), Firecracker microVMs, '
                                           'virtio/vhost-user, eBPF abstract interpretation verifier, '
                                           'XDP/DPDK kernel-bypass networking and exokernel/unikernel OS '
                                           'architectures.',
                            'prerequisites': ['sys_os_301', 'sys_arch_301', 'sys_os_410'],
                            'modules': [{'id': 'hardware_virtualization_kvm',
                                         'title': 'Hardware-Assisted Virtualization: VT-x, EPT/NPT, IOMMU '
                                                  'and KVM',
                                         'summary': 'Popek-Goldberg theorem, VMX root/non-root operation, '
                                                    'two-dimensional page walks, SR-IOV and Firecracker.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Popek and Goldberg Virtualizability Theorem, '
                                                     'Trap-and-Emulate vs Binary Translation (VMware ESX)',
                                                     'Hardware CPU Virtualization (Intel VT-x / AMD-V / '
                                                     'RISC-V H-Extension): VMCS, VM Entry and VM Exit '
                                                     'Handling',
                                                     'Memory Virtualization: Shadow Page Tables vs '
                                                     'Two-Dimensional Extended Page Tables (EPT / NPT)',
                                                     'I/O Virtualization: Paravirtualized virtio '
                                                     'Split/Packed Rings, vhost-net/vhost-user and PCIe '
                                                     'SR-IOV with VFIO',
                                                     'Posted Interrupts (APICv), Live VM Migration via '
                                                     'Pre-Copy Dirty-Page Tracking and Post-Copy Demand '
                                                     'Faulting',
                                                     'KVM/QEMU Internals and Minimalist Serverless MicroVMs '
                                                     '(AWS Firecracker and Cloud Hypervisor)',
                                                     'Quantitative Case Study & Synthesis: Hardware-Assisted '
                                                     'Virtualization: VT-x, EPT/NPT, IOMMU and KVM']},
                                        {'id': 'containers_namespaces_cgroups',
                                         'title': 'OS-Level Virtualization: Linux Namespaces, cgroups v2 and '
                                                  'Sandboxes',
                                         'summary': 'PID/mount/net namespaces, overlayfs, cgroups v2 '
                                                    'resource controllers, seccomp-BPF and gVisor.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Linux Namespaces (mnt, pid, net, ipc, uts, user, '
                                                     'cgroup, time): Isolating Global Kernel Resources',
                                                     'Control Groups (cgroups v2): Unified Hierarchy, CPU '
                                                     'Bandwidth Throttling, Memory High/Max Watermarks and '
                                                     'PSI',
                                                     'Union File Systems (OverlayFS): Lowerdir, Upperdir, '
                                                     'Copy-Up Semantics and OCI Container Image Layers',
                                                     'System Call Sandboxing: Linux Capabilities, Landlock '
                                                     'LSM and seccomp-BPF Syscall Filtering',
                                                     'Application Kernels and User-Space Sandboxes: Google '
                                                     'gVisor (Sentry/Gofer) vs Kata MicroVM Containers',
                                                     'Building a Rootless OCI-Compliant Container Runtime '
                                                     'from Scratch in Rust/C',
                                                     'Quantitative Case Study & Synthesis: OS-Level '
                                                     'Virtualization: Linux Namespaces, cgroups v2 and '
                                                     'Sandboxes']},
                                        {'id': 'ebpf_verifier_observability',
                                         'title': 'eBPF Virtual Machine, Abstract Interpretation Verifier '
                                                  'and XDP',
                                         'summary': '64-bit eBPF ISA, JIT compilation, static safety '
                                                    'verification, kprobes/uprobes, BPF maps and XDP packet '
                                                    'processing.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['The eBPF Architecture: 11 64-Bit Registers, '
                                                     'Instruction Encoding, Helper Calls, Kfuncs and Native '
                                                     'JIT Compilers',
                                                     'The In-Kernel eBPF Verifier: CFG DAG Check, Abstract '
                                                     'Interpretation of Register Bounds (tnum) and Pointer '
                                                     'Tracking',
                                                     'BPF Maps (Hash, Array, RingBuf, LPM Trie), BTF (BPF '
                                                     'Type Format) and Compile Once – Run Everywhere (CO-RE)',
                                                     'Zero-Overhead Dynamic Tracing: kprobes, fentry/fexit '
                                                     'Trampolines, Tracepoints, uprobes and DTrace/bpftrace',
                                                     'eBPF Networking: eXpress Data Path (XDP) Driver-Level '
                                                     'Packet Filtering, TC (Traffic Control) and Sockmap '
                                                     'Bypass',
                                                     'Sched_ext (extensible BPF CPU Schedulers): Safely '
                                                     'Implementing Custom Kernel Scheduling Policies in eBPF',
                                                     'Quantitative Case Study & Synthesis: eBPF Virtual '
                                                     'Machine, Abstract Interpretation Verifier and XDP']},
                                        {'id': 'kernel_bypass_datacenter_os',
                                         'title': 'Kernel-Bypass Networking (DPDK/RDMA) and Datacenter '
                                                  'Operating Systems',
                                         'summary': 'IX/Arrakis/Demikernel, DPDK poll-mode drivers, '
                                                    'RoCEv2/InfiniBand RDMA verbs and microsecond '
                                                    'tail-latency SLOs.',
                                         'sim': 'pid_controller',
                                         'lab': False,
                                         'lessons': ['The Killer Microseconds Problem: Why POSIX Sockets and '
                                                     'Kernel TCP Stacks Fail at 100–400 GbE Line Rates',
                                                     'DPDK Architecture: UIO/VFIO Hugepage DMA Buffers, Ring '
                                                     'Buffers and Run-to-Completion Poll-Mode Drivers (PMDs)',
                                                     'RDMA Internals (InfiniBand and RoCEv2): Queue Pairs, '
                                                     'Memory Regions, One-Sided READ/WRITE and Two-Sided '
                                                     'SEND/RECV',
                                                     'Control-Plane / Data-Plane Split Operating Systems: '
                                                     'Exokernel, Arrakis, IX, ZygOS and Shenango',
                                                     'Userspace TCP/IP Stacks (mTCP, TAS, F-Stack) and '
                                                     'Demikernel LibOS Abstractions for Portable Kernel '
                                                     'Bypass',
                                                     'Unikernels (MirageOS, OSv, Unikraft): '
                                                     'Single-Address-Space Library Operating Systems for '
                                                     'Cloud Functions',
                                                     'Quantitative Case Study & Synthesis: Kernel-Bypass '
                                                     'Networking (DPDK/RDMA) and Datacenter Operating '
                                                     'Systems']}]}]},
              {'id': 'compilers_llvm_mlir',
               'name': 'Compilers, Static Analysis, LLVM & MLIR Tensor Compilation',
               'icon': '🧬',
               'description': 'Lexing, parsing, bidirectional type inference, Static Single Assignment '
                              '(SSA), dataflow analysis, LLVM middle-end passes, polyhedral loop '
                              'optimization, register allocation and MLIR/Triton/XLA GPU compilers.',
               'courses': [{'id': 'sys_comp_101',
                            'code': 'CMP 101',
                            'title': 'Compiler Frontends: Lexing, Parsing, Type Systems and AST Lowering',
                            'level': 100,
                            'credits': 4,
                            'description': 'Regular expressions to DFAs, LL(k), Pratt and LR(1)/LALR(1) '
                                           'parsers, semantic analysis, Hindley-Milner type inference, '
                                           'algebraic data types and lowering to intermediate '
                                           'representations.',
                            'prerequisites': ['sys_arch_101'],
                            'modules': [{'id': 'lexical_analysis_automata',
                                         'title': 'Lexical Analysis, Thompson NFA Construction and Hopcroft '
                                                  'DFA Minimization',
                                         'summary': 'Regular languages, Brzozowski derivatives, Thompson '
                                                    'NFA, subset construction, DFA minimization and SIMD '
                                                    'lexing.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Formal Languages and the Chomsky Hierarchy: Regular '
                                                     'Expressions, Maximal Munch and Lexer Specification',
                                                     "Thompson's Construction: Compiling Regular Expressions "
                                                     'into Nondeterministic Finite Automata (NFAs)',
                                                     'Rabin-Scott Powerset Construction (NFA to DFA) and '
                                                     'Brzozowski Derivative-Based Regex Matching',
                                                     "Hopcroft's Partition Refinement Algorithm for O(n log "
                                                     'n) Minimal DFA Construction',
                                                     'Table-Driven vs Direct-Coded Scanners, String '
                                                     'Interning Tables and Source Span Diagnostics',
                                                     'SIMD-Accelerated Lexing (simdjson Techniques): '
                                                     'Branchless Classification and Bitmask Indexing',
                                                     'Quantitative Case Study & Synthesis: Lexical Analysis, '
                                                     'Thompson NFA Construction and Hopcroft DFA '
                                                     'Minimization']},
                                        {'id': 'parsing_grammars_ast',
                                         'title': 'Context-Free Grammars, Pratt Parsing and LR(1)/LALR(1) '
                                                  'Shift-Reduce Automata',
                                         'summary': 'Ambiguity resolution, LL(1) FIRST/FOLLOW sets, Pratt '
                                                    'operator precedence, LR(1)/LALR(1) and error recovery.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Context-Free Grammars (CFGs), Parse Trees vs Abstract '
                                                     'Syntax Trees (ASTs) and Ambiguity (Dangling Else)',
                                                     'Top-Down Recursive Descent and LL(1) Predictive '
                                                     'Parsing: Left-Factoring, Left-Recursion Elimination '
                                                     'and FIRST/FOLLOW',
                                                     'Vaughan Pratt Top-Down Operator Precedence Parsing: '
                                                     'Left/Right Binding Powers (lbp/rbp) for Expressions',
                                                     'Bottom-Up Shift-Reduce Parsing: LR(0) Items, SLR(1), '
                                                     'Canonical LR(1) Lookaheads and LALR(1) State Merging',
                                                     'GLR (Tomita) Generalized LR and Earley Parsing for '
                                                     'Arbitrary Context-Free Grammars',
                                                     'Resilient Incremental Parsing (Tree-sitter / '
                                                     'rust-analyzer): Green/Red CST Trees and Error Recovery',
                                                     'Quantitative Case Study & Synthesis: Context-Free '
                                                     'Grammars, Pratt Parsing and LR(1)/LALR(1) Shift-Reduce '
                                                     'Automata']},
                                        {'id': 'name_resolution_type_checking',
                                         'title': 'Lexical Scoping, Bidirectional Type Checking and '
                                                  'Hindley-Milner Inference',
                                         'summary': 'Symbol tables, lexical environments, subtyping '
                                                    'variance, Algorithm W unification and bidirectional '
                                                    'typing.',
                                         'sim': 'truth_table',
                                         'lab': True,
                                         'lessons': ['Name Resolution and Lexical Scoping: Rib-Cage Symbol '
                                                     'Tables, Hygiene and Closure Free-Variable Capture',
                                                     'Simply Typed Lambda Calculus, Typing Judgments, '
                                                     'Progress and Preservation (Type Soundness)',
                                                     'Subtyping Lattices, Top/Bottom Types and Covariance, '
                                                     'Contravariance and Invariance of Type Constructors',
                                                     'Damas-Hindley-Milner Type Inference: Let-Polymorphism, '
                                                     'Type Schemes, Robinson Unification and Algorithm W',
                                                     'Local Bidirectional Type Checking: Separating Type '
                                                     'Synthesis (⇒) and Type Checking (⇐) Modes',
                                                     "Type Classes, Rust Trait Resolution and Maranget's "
                                                     'Decision Trees for Exhaustive Pattern Matching',
                                                     'Quantitative Case Study & Synthesis: Lexical Scoping, '
                                                     'Bidirectional Type Checking and Hindley-Milner '
                                                     'Inference']},
                                        {'id': 'semantic_lowering_closures',
                                         'title': 'Semantic Lowering: Closures, Control Flow Graphs and '
                                                  'Three-Address IR',
                                         'summary': 'Defunctionalization, lambda lifting, closure '
                                                    'conversion, ANF/CPS and lowering ASTs to basic-block '
                                                    'CFGs.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Desugaring High-Level Constructs: Pattern Match '
                                                     'Compilation, For-Loops and Comprehension Lowering',
                                                     'First-Class Functions: Flat vs Linked Closure '
                                                     'Conversion, Lambda Lifting and Reynolds '
                                                     'Defunctionalization',
                                                     'Intermediate Representation Taxonomy: ASTs, Stack '
                                                     'Bytecode, A-Normal Form (ANF), CPS and Three-Address '
                                                     'Code',
                                                     'Constructing Control Flow Graphs (CFGs): Basic Blocks, '
                                                     'Terminators and Short-Circuit Boolean Evaluation',
                                                     'Memory Layout of Aggregates: Struct Alignment/Padding, '
                                                     'Tagged Unions, Vtables and Fat Pointers',
                                                     'Implementing a Complete Frontend and Bytecode VM for a '
                                                     'Statically Typed Functional/Imperative Language',
                                                     'Quantitative Case Study & Synthesis: Semantic '
                                                     'Lowering: Closures, Control Flow Graphs and '
                                                     'Three-Address IR']}]},
                           {'id': 'sys_comp_201',
                            'code': 'CMP 201',
                            'title': 'SSA Form, Dataflow Analysis and LLVM Middle-End Optimizations',
                            'level': 200,
                            'credits': 4,
                            'description': "Dominator trees, Cytron's SSA construction, monotone dataflow "
                                           'frameworks, sparse conditional constant propagation, global '
                                           'value numbering, alias analysis and LLVM IR pass engineering.',
                            'prerequisites': ['sys_comp_101'],
                            'modules': [{'id': 'cfg_dominators_ssa',
                                         'title': 'Dominator Trees, Dominance Frontiers and Static Single '
                                                  'Assignment (SSA)',
                                         'summary': 'Lengauer-Tarjan dominators, Cytron et al. phi-node '
                                                    'placement, Braun online SSA and SSA destruction.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Control Flow Graph Properties: Depth-First Spanning '
                                                     'Trees, Reverse Postorder (RPO) and Natural Loop '
                                                     'Detection',
                                                     'Dominance Relations (dom, idom, sdom): '
                                                     'Cooper-Harvey-Kennedy Iterative and Lengauer-Tarjan '
                                                     'Algorithms',
                                                     'Static Single Assignment (SSA) Form: Why Explicit '
                                                     'Use-Def Chains Enable Sparse O(V+E) Optimizations',
                                                     'Cytron et al. Minimal/Pruned SSA Construction: '
                                                     'Dominance Frontiers and Iterated Phi-Function '
                                                     'Placement',
                                                     'Braun et al. Simple and Efficient SSA Construction '
                                                     'Directly from ASTs Without Dominator Trees',
                                                     'Out-of-SSA Translation (SSA Destruction): Critical '
                                                     'Edge Splitting, Parallel Copy Sequentialization and '
                                                     'Lost-Copy/Swap Bugs',
                                                     'Quantitative Case Study & Synthesis: Dominator Trees, '
                                                     'Dominance Frontiers and Static Single Assignment '
                                                     '(SSA)']},
                                        {'id': 'monotone_dataflow_frameworks',
                                         'title': 'Monotone Dataflow Frameworks and Abstract Interpretation',
                                         'summary': 'Semilattices, Knaster-Tarski fixed points, reaching '
                                                    'definitions, liveness, available expressions and '
                                                    "Kildall's algorithm.",
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Four Classical Bitvector Dataflow Problems: Reaching '
                                                     'Definitions, Live Variables, Available and Very Busy '
                                                     'Expressions',
                                                     'Lattice Theory Foundations: Partial Orders, Join/Meet '
                                                     'Semilattices, Finite Ascending Chain Condition and '
                                                     'Monotone Transfer Functions',
                                                     'Knaster-Tarski Fixed-Point Theorem, Chaotic Worklist '
                                                     'Iteration and Meet-Over-All-Paths (MOP) vs Maximum '
                                                     'Fixed Point (MFP)',
                                                     "Distributive vs Non-Distributive Frameworks (Kildall's "
                                                     'Constant Propagation Lattice)',
                                                     'Cousot-Cousot Abstract Interpretation: Galois '
                                                     'Connections, Interval/Octagon Domains and '
                                                     'Widening/Narrowing Operators',
                                                     'Interprocedural Dataflow Analysis: Call Graphs, '
                                                     'Context Sensitivity (k-CFA) and IFDS/IDE Tabulation',
                                                     'Quantitative Case Study & Synthesis: Monotone Dataflow '
                                                     'Frameworks and Abstract Interpretation']},
                                        {'id': 'scalar_ssa_optimizations',
                                         'title': 'Scalar SSA Optimizations: SCCP, GVN, PRE and Dead Code '
                                                  'Elimination',
                                         'summary': 'Wegman-Zadeck SCCP, Alpern-Wegman-Zadeck / Click GVN, '
                                                    'Lazy Code Motion PRE and aggressive DCE.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Wegman-Zadeck Sparse Conditional Constant Propagation '
                                                     '(SCCP): Combining Constant Propagation with '
                                                     'Unreachable Branch Pruning',
                                                     'Dead Code Elimination: Mark-Sweep Aggressive DCE '
                                                     '(ADCE) Using Post-Dominator Control Dependence Graphs',
                                                     'Local, Dominator-Tree and Hash-Based Global Value '
                                                     "Numbering (GVN) vs Click's Optimistic Value Numbering",
                                                     'Partial Redundancy Elimination (PRE): '
                                                     'Knoop-Rüthing-Steffen Lazy Code Motion (LCM) and '
                                                     'SSAPRE',
                                                     'Instruction Combining, Algebraic Peephole '
                                                     'Canonicalization and Bittracking Demanded-Bits '
                                                     'Analysis',
                                                     'Classical Loop Optimizations on SSA: Loop-Invariant '
                                                     'Code Motion (LICM), Induction Variable Strength '
                                                     'Reduction and Unrolling',
                                                     'Quantitative Case Study & Synthesis: Scalar SSA '
                                                     'Optimizations: SCCP, GVN, PRE and Dead Code '
                                                     'Elimination']},
                                        {'id': 'pointer_alias_memory_ssa',
                                         'title': 'Pointer/Alias Analysis and MemorySSA Optimizations',
                                         'summary': 'Andersen inclusion vs Steensgaard unification '
                                                    'points-to, Type-Based Alias Analysis (TBAA), MemorySSA '
                                                    'and SROA.',
                                         'sim': 'graph_theory',
                                         'lab': False,
                                         'lessons': ['The Alias Analysis Problem: May-Alias, Must-Alias and '
                                                     'No-Alias Queries for Load/Store Reordering',
                                                     'Steensgaard Unification-Based O(n α(n)) vs Andersen '
                                                     'Inclusion-Based Cubic Points-To Analysis',
                                                     'Flow-Sensitive, Field-Sensitive and Context-Sensitive '
                                                     'Pointer Analysis; Language Rules (C Strict Aliasing / '
                                                     'TBAA / Rust noalias)',
                                                     'Scalar Replacement of Aggregates (SROA) and LLVM '
                                                     'mem2reg Stack-to-Register Promotion',
                                                     'MemorySSA: Modeling Heap/Stack Memory Def-Use Chains '
                                                     'with MemoryDef, MemoryUse and MemoryPhi Nodes',
                                                     'Dead Store Elimination (DSE), Store-to-Load Forwarding '
                                                     'and Loop Load Elimination Using MemorySSA',
                                                     'Quantitative Case Study & Synthesis: Pointer/Alias '
                                                     'Analysis and MemorySSA Optimizations']},
                                        {'id': 'llvm_ir_pass_engineering',
                                         'title': 'LLVM Architecture, IR Semantics (undef/poison) and Custom '
                                                  'Pass Design',
                                         'summary': 'LLVM IR type system, GEP address calculation, '
                                                    'poison/freeze semantics, New Pass Manager and Alive2 '
                                                    'verification.',
                                         'sim': 'truth_table',
                                         'lab': True,
                                         'lessons': ['LLVM IR Anatomy: Modules, Functions, BasicBlocks, '
                                                     'Users/Values and the GetElementPtr (GEP) Instruction',
                                                     'Undefined Behavior in Optimizing Compilers: LLVM '
                                                     'undef, poison Values and the freeze Instruction',
                                                     "LLVM's New Pass Manager Architecture: "
                                                     'Function/Loop/CGSCC Pass Pipelines and Cached Analysis '
                                                     'Invalidation',
                                                     'Inlining Heuristics, Tail-Call Elimination, '
                                                     'Devirtualization and Link-Time Optimization (FullLTO '
                                                     'and ThinLTO)',
                                                     'Profile-Guided Optimization (PGO) and AutoFDO: Branch '
                                                     'Probability Metadata and Hot/Cold Code Splitting',
                                                     'Translation Validation of LLVM Optimizations Using SMT '
                                                     'Solvers (Z3 and Alive2)',
                                                     'Quantitative Case Study & Synthesis: LLVM '
                                                     'Architecture, IR Semantics (undef/poison) and Custom '
                                                     'Pass Design']}]},
                           {'id': 'sys_comp_301',
                            'code': 'CMP 301',
                            'title': 'Code Generation, Register Allocation, Instruction Scheduling and JITs',
                            'level': 300,
                            'credits': 4,
                            'description': 'Tree/DAG instruction selection, Chaitin-Briggs graph coloring '
                                           'and SSA register allocation, modulo software pipelining, '
                                           'polyhedral loop compilation, garbage collection and '
                                           'tracing/method JITs.',
                            'prerequisites': ['sys_comp_201', 'sys_arch_201'],
                            'modules': [{'id': 'instruction_selection_iseldag',
                                         'title': 'Instruction Selection: Tree Covering, SelectionDAG and '
                                                  'e-Graphs',
                                         'summary': 'Maximal munch, dynamic programming tree tiling (IBURG), '
                                                    'LLVM SelectionDAG/GlobalISel and equality saturation.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Retargetable Code Generation: Lowering '
                                                     'Target-Independent IR to Machine Instructions and '
                                                     'Virtual Registers',
                                                     'Maximal Munch vs Optimal Dynamic Programming '
                                                     'Tree-Pattern Matching (Aho-Johnson and BURS/IBURG)',
                                                     'LLVM SelectionDAG: Type Legalization, Operation '
                                                     'Legalization, DAG Combine and TableGen Pattern '
                                                     'Matching',
                                                     'Fast Instruction Selection (FastISel) and GlobalISel '
                                                     'for Low-Compile-Time Debug and JIT Tiers',
                                                     'Equality Saturation with e-Graphs (egg): Simultaneous '
                                                     'Rewrite Exploration and Cost-Guided Extraction',
                                                     'Superoptimization (Massalin, STOKE, Souper): '
                                                     'Synthesizing Optimal Loop-Free Instruction Sequences '
                                                     'via MCMC/SMT',
                                                     'Quantitative Case Study & Synthesis: Instruction '
                                                     'Selection: Tree Covering, SelectionDAG and e-Graphs']},
                                        {'id': 'register_allocation_algorithms',
                                         'title': 'Register Allocation: Chaitin-Briggs Graph Coloring, '
                                                  'Linear Scan and SSA',
                                         'summary': 'Interference graphs, Iterated Register Coalescing, '
                                                    'Poletto-Sarkar linear scan and chordal SSA register '
                                                    'allocation.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Liveness Analysis at the Machine Level, Interference '
                                                     "Graphs and Kempe's k-Coloring Heuristic",
                                                     'Chaitin-Briggs Graph Coloring and George-Appel '
                                                     'Iterated Register Coalescing (Build, Simplify, '
                                                     'Coalesce, Freeze, Spill)',
                                                     'Spill Cost Estimation, Live-Range Splitting, '
                                                     'Rematerialization and Calling-Convention Pre-Colored '
                                                     'Nodes',
                                                     "Poletto-Sarkar Linear Scan and Wimmer's Linear Scan "
                                                     'with Live-Interval Holes for JIT Compilers',
                                                     "LLVM's Greedy Register Allocator: Priority Queue "
                                                     'Eviction and Global Live-Range Splitting',
                                                     'Hack-Goos Register Allocation on SSA Form: Why Strict '
                                                     'SSA Interference Graphs Are Chordal and Colorable in '
                                                     'P-Time',
                                                     'Quantitative Case Study & Synthesis: Register '
                                                     'Allocation: Chaitin-Briggs Graph Coloring, Linear Scan '
                                                     'and SSA']},
                                        {'id': 'instruction_scheduling_pipelining',
                                         'title': 'Instruction Scheduling, VLIW Bundling and Modulo Software '
                                                  'Pipelining',
                                         'summary': 'Data dependence DAGs, list scheduling, trace/superblock '
                                                    "scheduling and Rau's iterative modulo scheduling.",
                                         'sim': 'graph_theory',
                                         'lab': False,
                                         'lessons': ['Data Dependence DAGs (True, Anti, Output '
                                                     'Dependencies), Reservation Tables and Pipeline '
                                                     'Structural Hazards',
                                                     'Local List Scheduling: Critical Path Heuristics, '
                                                     'Register-Pressure-Aware Scheduling ( Sethi-Ullman ) '
                                                     'and Phase-Ordering',
                                                     'Global Instruction Scheduling Across Branches: '
                                                     "Fisher's Trace Scheduling and Hwu's Superblock "
                                                     'Scheduling',
                                                     'VLIW and EPIC Architectures (TI C6000, Hexagon, '
                                                     'Itanium): Explicit Parallelism, Predication and '
                                                     'Speculative Loads',
                                                     'Software Pipelining of Inner Loops: Minimum Initiation '
                                                     'Interval (MII = max(RecMII, ResMII))',
                                                     "Rau's Iterative Modulo Scheduling (IMS), Modulo "
                                                     'Variable Expansion and Rotating Register Files',
                                                     'Quantitative Case Study & Synthesis: Instruction '
                                                     'Scheduling, VLIW Bundling and Modulo Software '
                                                     'Pipelining']},
                                        {'id': 'polyhedral_loop_vectorization',
                                         'title': 'Dependence Testing, Auto-Vectorization and the Polyhedral '
                                                  'Model',
                                         'summary': 'Banerjee/Omega dependence tests, SLP/loop '
                                                    'vectorization, Presburger iteration domains and Pluto '
                                                    'affine transformations.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Loop Dependence Analysis: Distance/Direction Vectors, '
                                                     "GCD Test, Banerjee Inequality and Pugh's Omega Test",
                                                     'Classic Loop Transformations: Loop Interchange, '
                                                     'Skewing, Reversal, Fusion, Fission and Cache '
                                                     'Strip-Mining/Tiling',
                                                     'Auto-Vectorization: Loop-Level Vectorization vs '
                                                     'Larsen-Amarasinghe Superword-Level Parallelism (SLP)',
                                                     'The Polyhedral Model: Representing Loop Nests via '
                                                     'Presburger Iteration Domains, Access Relations and '
                                                     'Schedules',
                                                     'Affine Schedule Optimization (Feautrier and '
                                                     "Bondhugula's Pluto Algorithm): Maximizing Parallelism "
                                                     'and Locality',
                                                     'Polyhedral Code Generation with ISL (Integer Set '
                                                     'Library), Polly and Polygeist',
                                                     'Quantitative Case Study & Synthesis: Dependence '
                                                     'Testing, Auto-Vectorization and the Polyhedral Model']},
                                        {'id': 'jit_compilers_gc_runtimes',
                                         'title': 'Managed Language Runtimes: JIT Compilation and Garbage '
                                                  'Collection',
                                         'summary': 'Tiered method/tracing JITs, inline caches, '
                                                    'deoptimization, generational/concurrent GC and '
                                                    'Sea-of-Nodes IR.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Dynamic Dispatch Optimization: Monomorphic, '
                                                     'Polymorphic and Megamorphic Inline Caches (ICs) and '
                                                     'Hidden Classes',
                                                     'Tiered JIT Architectures (V8 TurboFan, JVM HotSpot '
                                                     'C1/C2, LuaJIT): Profiling, Type Speculation and '
                                                     'On-Stack Replacement (OSR)',
                                                     'Uncommon Traps, Speculative Guard Failure and '
                                                     'Deoptimization Back to Interpreter Stack Frames',
                                                     "Click's Sea-of-Nodes IR (HotSpot C2 / V8) vs "
                                                     'Block-Argument SSA (Cranelift)',
                                                     'Tracing Garbage Collection: Cheney Copying, '
                                                     'Generational Write Barriers (Card Tables) and Immix '
                                                     'Mark-Region',
                                                     'Low-Pause Concurrent Garbage Collectors: '
                                                     'Dijkstra/Yuasa Tri-Color Invariants, Load Barriers and '
                                                     'ZGC/Shenandoah',
                                                     'Quantitative Case Study & Synthesis: Managed Language '
                                                     'Runtimes: JIT Compilation and Garbage Collection']}]},
                           {'id': 'sys_comp_410',
                            'code': 'CMP 410',
                            'title': 'Program Analysis, Loop Optimization and Polyhedral Compilation',
                            'level': 400,
                            'credits': 4,
                            'description': 'Apply abstract interpretation and dependence analysis to prove properties of programs, then '
                                           'transform loop nests with polyhedral, vectorization and autotuning techniques for '
                                           'high-performance code. Bridges back-end code generation to graduate-level MLIR and '
                                           'deep-learning compilers.',
                            'prerequisites': ['sys_comp_301'],
                            'modules': [{'id': 'abstract_interpretation',
                                         'title': 'Static Analysis and Abstract Interpretation',
                                         'summary': 'Sound approximation of program behaviour for optimization and verification.',
                                         'lab': True,
                                         'lessons': ['Lattices, Monotone Frameworks and Fixed Points',
                                                     'Abstract Domains: Intervals, Octagons and Polyhedra',
                                                     'Widening and Narrowing for Termination',
                                                     'Pointer and Alias Analysis: Andersen vs Steensgaard',
                                                     'Implementing an Interval Analysis for a Toy Language in Python']},
                                        {'id': 'dependence_analysis',
                                         'title': 'Data Dependence Analysis and Loop Transformations',
                                         'summary': 'When it is legal to reorder, fuse or parallelize loops.',
                                         'lab': True,
                                         'lessons': ['Flow, Anti and Output Dependences and Distance Vectors',
                                                     'GCD and Banerjee Dependence Tests',
                                                     'Loop Interchange, Fusion, Fission and Skewing',
                                                     'Tiling for Cache Locality',
                                                     'Measuring the Effect of Loop Tiling on Matrix Multiply']},
                                        {'id': 'polyhedral_model',
                                         'title': 'The Polyhedral Model',
                                         'summary': 'Representing loop nests as integer polyhedra for global optimization.',
                                         'lab': True,
                                         'lessons': ['Iteration Domains, Access Relations and Schedules',
                                                     'Affine Scheduling and the Pluto Algorithm',
                                                     'Code Generation from Polyhedra (CLooG / isl)',
                                                     'Exploring Loop Schedules with islpy']},
                                        {'id': 'vectorization',
                                         'title': 'Auto-Vectorization',
                                         'summary': 'Turning scalar loops into SIMD code automatically.',
                                         'lessons': ['Loop Vectorization: Legality and Cost Models',
                                                     'Superword-Level Parallelism (SLP) Vectorization',
                                                     'Handling Control Flow with Predication and Masking',
                                                     'Reading LLVM Vectorization Remarks to Diagnose Missed Opportunities']},
                                        {'id': 'scheduling_languages',
                                         'title': 'Scheduling Languages and Autotuning',
                                         'summary': 'Separating algorithm from schedule, and searching the schedule space '
                                                    'automatically.',
                                         'lab': True,
                                         'lessons': ['Halide: Algorithm/Schedule Separation for Image Pipelines',
                                                     'TVM Tensor Expressions and Schedule Primitives',
                                                     'Autotuning with Search: Random, Genetic and Bayesian',
                                                     'Learned Cost Models for Compiler Optimization',
                                                     "Autotuning a Tiled Kernel's Parameters in Python"]}]},
                           {'id': 'sys_comp_401',
                            'code': 'CMP 401',
                            'title': 'MLIR Multi-Level Compilation, Tensor IRs and Deep Learning Compilers',
                            'level': 500,
                            'credits': 4,
                            'description': 'MLIR dialect infrastructure, progressive lowering '
                                           '(StableHLO/Linalg to Vector/NVVM), Halide/TVM schedule-compute '
                                           'separation, XLA operator fusion and OpenAI Triton block-level '
                                           'GPU compiler internals.',
                            'prerequisites': ['sys_comp_301', 'sys_arch_401', 'sys_comp_410'],
                            'modules': [{'id': 'mlir_dialect_infrastructure',
                                         'title': 'MLIR Architecture: Operations, Regions, Dialects and '
                                                  'Progressive Lowering',
                                         'summary': 'Block arguments vs phi nodes, TableGen ODS/DRR, Dialect '
                                                    'Conversion, Traits/Interfaces and Linalg structured '
                                                    'ops.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Why Single-Level IRs Fail for Heterogeneous Hardware: '
                                                     'The Case for Multi-Level Intermediate Representation '
                                                     '(MLIR)',
                                                     'MLIR Core IR Structure: Operations, Attributes, Types, '
                                                     'Nested Regions and SSA Basic-Block Arguments',
                                                     'Defining Dialects with TableGen Operation Definition '
                                                     'Specification (ODS), Traits and OpInterfaces',
                                                     'Declarative Rewrite Rules (DRR), PDL, '
                                                     'GreedyPatternRewriteDriver and Dialect Conversion '
                                                     'Frameworks',
                                                     'The Linalg Dialect: Structured Operations, Indexing '
                                                     'Maps, Iterator Types (Parallel, Reduction) and '
                                                     'Destination-Passing Style',
                                                     'Progressive Lowering Pipelines: Tensor → Linalg → '
                                                     'Affine/SCF → Vector → MemRef → LLVM/NVVM/SPIR-V',
                                                     'Quantitative Case Study & Synthesis: MLIR '
                                                     'Architecture: Operations, Regions, Dialects and '
                                                     'Progressive Lowering']},
                                        {'id': 'halide_tvm_tensor_scheduling',
                                         'title': 'Decoupling Algorithm from Schedule: Halide, TVM and '
                                                  'Auto-Tuning',
                                         'summary': 'Compute/schedule separation, '
                                                    'split/reorder/tile/vectorize primitives, '
                                                    'Ansor/MetaSchedule search and bufferization.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ["Ragan-Kelley's Halide Paradigm: Separating Pure "
                                                     'Functional Tensor Expressions from Execution Schedules',
                                                     'Schedule Primitives: split, fuse, reorder, tile, '
                                                     'vectorize, unroll, compute_at and store_at '
                                                     'Producer-Consumer Trade-offs',
                                                     'Apache TVM and TensorIR: Lowering High-Level '
                                                     'Relay/Relax Graphs to Scheduled Loops on CPUs, GPUs '
                                                     'and NPUs',
                                                     'Automated Schedule Search: AutoTVM Templates, Ansor '
                                                     'Sketch-Guided Evolutionary Search and Learned Cost '
                                                     'Models',
                                                     'One-Shot Bufferization in MLIR: Converting Immutable '
                                                     'Tensor Values to In-Place MemRef Allocations Without '
                                                     'Aliasing Bugs',
                                                     'Memory Planning in Deep Learning Compilers: Lifespan '
                                                     'Interval Packing, Scratchpad Reuse and '
                                                     'Rematerialization',
                                                     'Quantitative Case Study & Synthesis: Decoupling '
                                                     'Algorithm from Schedule: Halide, TVM and Auto-Tuning']},
                                        {'id': 'xla_torch_inductor_fusion',
                                         'title': 'Graph-Level ML Compilers: XLA, StableHLO, TorchDynamo and '
                                                  'TorchInductor',
                                         'summary': 'Python bytecode capture, AOTAutograd, operator fusion '
                                                    'taxonomies, dynamic shapes and GSPMD sharding passes.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Capturing Eager Python Execution: Lazy Tensors, JAX '
                                                     'Staging (jaxpr) and PyTorch 2 TorchDynamo Frame '
                                                     'Evaluation',
                                                     'AOTAutograd and PrimTorch: Ahead-of-Time Joint '
                                                     'Forward-Backward Graph Capture and Canonical Operator '
                                                     'Decomposition',
                                                     'StableHLO and XLA HLO: Algebraic Simplification, '
                                                     'Layout Assignment and Transpose-Matmul Folding',
                                                     'Operator Fusion Engine: Loop/Elementwise Fusion, '
                                                     'Reduction Fusion and Producer-Consumer Epilogue Fusion '
                                                     'into GEMM',
                                                     'Symbolic Shapes and Dynamic Dimension Guards: Avoiding '
                                                     'Recompilation Storms on Variable Sequence Lengths',
                                                     'Compiler-Driven Automatic Parallelism: XLA GSPMD '
                                                     'Sharding Propagation and Alpa Inter/Intra-Operator '
                                                     'Partitioning',
                                                     'Quantitative Case Study & Synthesis: Graph-Level ML '
                                                     'Compilers: XLA, StableHLO, TorchDynamo and '
                                                     'TorchInductor']},
                                        {'id': 'triton_gpu_kernel_compiler',
                                         'title': 'Block-Level GPU Compilation: Triton IR, Shared-Memory '
                                                  'Swizzling and Warp Specialization',
                                         'summary': 'Blocked program semantics, Triton-GPU layout encodings, '
                                                    'WGMMA/TMA lowering and software-pipelined async copies.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Thread-Level SIMT (CUDA) vs Block-Level Tile '
                                                     'Programming (OpenAI Triton): Abstracting Intra-Block '
                                                     'Synchronization',
                                                     'Triton Compilation Pipeline: Python AST → Triton-IR → '
                                                     'Triton-GPU IR → LLVM/NVVM → PTX → SASS',
                                                     'Triton-GPU Layout Attributes (#blocked, #mma, #shared, '
                                                     '#dot_op): Compiler-Synthesized Register and Shared '
                                                     'Memory Layouts',
                                                     'Automatic Shared-Memory Bank-Conflict Elimination via '
                                                     'XOR Swizzling Passes',
                                                     'Software Pipelining of Global-to-Shared Asynchronous '
                                                     'Transfers (cp.async and Hopper Tensor Memory '
                                                     'Accelerator TMA)',
                                                     'Lowering to Hopper/Blackwell Warp-Group Matrix '
                                                     'Multiply-Accumulate (WGMMA / tcgen05) and '
                                                     'Producer-Consumer Warp Specialization',
                                                     'Quantitative Case Study & Synthesis: Block-Level GPU '
                                                     'Compilation: Triton IR, Shared-Memory Swizzling and '
                                                     'Warp Specialization']}]}]},
              {'id': 'gpu_parallel_distributed_systems',
               'name': 'GPU Kernel Architecture, High-Performance Computing & Distributed Systems',
               'icon': '🚀',
               'description': 'NVIDIA/AMD GPU microarchitecture, PTX/SASS assembly, CUTLASS/FlashAttention '
                              'tensor kernels, MPI/NCCL collective communication, Raft/Paxos consensus and '
                              'petascale distributed systems.',
               'courses': [{'id': 'sys_gpu_101',
                            'code': 'GPU 101',
                            'title': 'Parallel Computing Foundations and SIMT GPU Architecture',
                            'level': 100,
                            'credits': 4,
                            'description': 'Work-span parallelism, Amdahl/Gustafson scaling, OpenMP '
                                           'shared-memory programming, CUDA execution model, Streaming '
                                           'Multiprocessor (SM) warp scheduling and global/shared memory '
                                           'coalescing.',
                            'prerequisites': ['sys_arch_101'],
                            'modules': [{'id': 'parallel_models_work_span',
                                         'title': 'Models of Parallel Computation: Work-Span DAGs, PRAM and '
                                                  'Scaling Laws',
                                         'summary': "Amdahl vs Gustafson laws, Brent's theorem, Cilk "
                                                    'work-stealing deques and false sharing on cache lines.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ["Amdahl's Law, Gustafson-Barsis Scaled Speedup and "
                                                     'Karp-Flatt Serial Fraction Metric',
                                                     'The Work-Span (Work-Depth) DAG Model: Work T1, '
                                                     "Critical-Path Span T∞, Parallelism and Brent's Theorem",
                                                     'PRAM Variants (EREW, CREW, CRCW) vs Realistic '
                                                     'Cache-Coherent Shared-Memory Cost Models',
                                                     'Fork-Join Parallelism and the Blumofe-Leiserson Cilk '
                                                     'Randomized Work-Stealing Scheduler',
                                                     'OpenMP Programming: Parallel Regions, Loop Schedules '
                                                     '(static, dynamic, guided), Reductions and Task Graphs',
                                                     'Performance Pitfalls on Multicore CPUs: True vs False '
                                                     'Cache-Line Sharing, Padding and NUMA First-Touch '
                                                     'Placement',
                                                     'Quantitative Case Study & Synthesis: Models of '
                                                     'Parallel Computation: Work-Span DAGs, PRAM and Scaling '
                                                     'Laws']},
                                        {'id': 'gpu_sm_warp_microarchitecture',
                                         'title': 'GPU Streaming Multiprocessor (SM) Microarchitecture and '
                                                  'Warp Execution',
                                         'summary': 'Thread blocks, warps, SIMT divergence stacks, '
                                                    'independent thread scheduling, occupancy and latency '
                                                    'hiding.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Throughput-Oriented vs Latency-Oriented Processors: '
                                                     'Comparing CPU Cores to GPU Streaming Multiprocessors '
                                                     '(SMs)',
                                                     'The CUDA Hierarchy: Grids, Thread Blocks (CTAs), Warps '
                                                     '(32 Threads) and Hardware Thread Block Clusters',
                                                     'SIMT Execution Model: Sub-Core Warp Schedulers, '
                                                     'Scoreboards and Zero-Overhead Cycle-by-Cycle Context '
                                                     'Switching',
                                                     'Branch Divergence in SIMT: Active Masks, Reconvergence '
                                                     'Stacks and Volta+ Independent Thread Scheduling '
                                                     '(syncwarp)',
                                                     "Little's Law for Latency Hiding: Calculating Required "
                                                     'Active Warps from Arithmetic and Memory Latencies',
                                                     'Resource Partitioning and Occupancy: Register File '
                                                     'Allocation Granularity, Shared Memory Per Block and '
                                                     'Launch Bounds',
                                                     'Quantitative Case Study & Synthesis: GPU Streaming '
                                                     'Multiprocessor (SM) Microarchitecture and Warp '
                                                     'Execution']},
                                        {'id': 'gpu_memory_coalescing_shared',
                                         'title': 'GPU Memory Hierarchy: Coalesced Global Access and '
                                                  'Bank-Free Shared Memory',
                                         'summary': 'HBM/GDDR transactions, 128-byte cache-line coalescing, '
                                                    'L1/shared SRAM banks, constant/texture caches and '
                                                    'registers.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Global Memory Coalescing: How 32 Warp Threads Map to '
                                                     '32B/128B L2/DRAM Sectors and Strided Access Penalties',
                                                     'Vectorized Memory Loads/Stores (float4 / uint4) for '
                                                     'Saturating HBM Memory Bandwidth',
                                                     'Shared Memory (User-Managed L1 Scratchpad): 32-Bank '
                                                     '4-Byte Interleaving and Multi-Way Bank Conflict '
                                                     'Diagnosis',
                                                     'Eliminating Shared Memory Bank Conflicts via Padding '
                                                     'and Permutation/XOR Swizzling',
                                                     'Read-Only Data Caches (__ldg), Constant Memory '
                                                     'Broadcasts and L2 Cache Persistence Residency Controls',
                                                     'Register Spilling to Local Memory: Diagnosing LMEM '
                                                     'Traffic in PTX/SASS and Tuning Register Pressure',
                                                     'Quantitative Case Study & Synthesis: GPU Memory '
                                                     'Hierarchy: Coalesced Global Access and Bank-Free '
                                                     'Shared Memory']},
                                        {'id': 'fundamental_parallel_primitives',
                                         'title': 'Fundamental GPU Parallel Primitives: Reductions, Scans, '
                                                  'Histograms and Radix Sort',
                                         'summary': 'Warp shuffle intrinsics, Blelloch/Hillis-Steele prefix '
                                                    'sums, decoupled look-back and Onesweep radix sort.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Tree-Based Parallel Reductions: Avoiding Warp '
                                                     'Divergence, Bank Conflicts and Utilizing '
                                                     '__shfl_down_sync',
                                                     'Warp-Level Primitives: __ballot_sync, __shfl_xor_sync '
                                                     'and Hardware Redux (__reduce_add_sync) Instructions',
                                                     'Parallel Prefix Sum (Scan): Hillis-Steele '
                                                     'Step-Efficient vs Blelloch Work-Efficient '
                                                     'Up-Sweep/Down-Sweep Scans',
                                                     'Single-Pass Global Prefix Sum: Merrill-Garland '
                                                     'Decoupled Look-Back Across Thread Blocks',
                                                     'Parallel Histograms: Shared-Memory Privatization, '
                                                     'Warp-Aggregated Atomics and L2 Atomic Throughput',
                                                     'High-Speed GPU Sorting: Bitonic Sort Networks vs '
                                                     'Merrill-then-Onesweep LSD Radix Sort',
                                                     'Quantitative Case Study & Synthesis: Fundamental GPU '
                                                     'Parallel Primitives: Reductions, Scans, Histograms and '
                                                     'Radix Sort']}]},
                           {'id': 'sys_gpu_201',
                            'code': 'GPU 201',
                            'title': 'High-Performance GPU Kernel Engineering: CUTLASS, PTX/SASS and '
                                     'FlashAttention',
                            'level': 200,
                            'credits': 4,
                            'description': 'Hierarchical tiled GEMM, CUTLASS CuTe layout algebra, Tensor '
                                           'Core MMA/WGMMA PTX programming, Hopper TMA/warpgroup '
                                           'specialization, FlashAttention-1/2/3 and Nsight Compute '
                                           'profiling.',
                            'prerequisites': ['sys_gpu_101', 'sys_arch_201'],
                            'modules': [{'id': 'hierarchical_gemm_cutlass',
                                         'title': 'Hierarchical Tiled Matrix Multiplication and CuTe Layout '
                                                  'Algebra',
                                         'summary': 'From naive O(N^3) GEMM to 95% peak TFLOP/s via '
                                                    'CTA/warp/thread tiling, double buffering and CuTe.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Why Naive Matrix Multiplication Achieves <2% of GPU '
                                                     'Peak: Arithmetic Intensity of Un-Tiled GEMM',
                                                     'Three-Level Hierarchical Tiling: Thread Block Tile '
                                                     '(Shared Memory), Warp Tile and Thread Fragment '
                                                     '(Registers)',
                                                     'Outer-Product Register Accumulation, Vectorized '
                                                     'LDS.128 Shared Loads and Bank-Conflict-Free Layouts',
                                                     'Software Pipelining (Double and Multi-Stage '
                                                     'Buffering): Overlapping Global Loads with Arithmetic '
                                                     'via cp.async',
                                                     'CUTLASS 3.x and CuTe Layout Algebra: Shapes, Strides, '
                                                     'Hierarchical Composition, Complement and Logical '
                                                     'Divide',
                                                     'Addressing Load Imbalance on Rectangular Matrices: '
                                                     'Split-K, Stream-K Persistent Kernels and L2 Tile '
                                                     'Swizzling',
                                                     'Quantitative Case Study & Synthesis: Hierarchical '
                                                     'Tiled Matrix Multiplication and CuTe Layout Algebra']},
                                        {'id': 'tensor_cores_hopper_blackwell',
                                         'title': 'Programming Tensor Cores: WMMA, MMA PTX, Hopper TMA/WGMMA '
                                                  'and Blackwell',
                                         'summary': 'PTX mma.sync, ldmatrix, Hopper Tensor Memory '
                                                    'Accelerator (TMA), WGMMA and warp-specialized ping-pong '
                                                    'kernels.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Evolution of NVIDIA Tensor Cores: Volta HMMA, Ampere '
                                                     'Sparse MMA, Hopper WGMMA and Blackwell tcgen05 Tensor '
                                                     'Memory (TMEM)',
                                                     'Warp-Level PTX Programming: ldmatrix.sync.aligned and '
                                                     'mma.sync.aligned.m16n8k16 Register Fragment Mapping',
                                                     'Hopper H100 Thread Block Clusters, Distributed Shared '
                                                     'Memory (DSMEM) and Asynchronous Transaction Barriers '
                                                     '(mbarrier)',
                                                     'The Tensor Memory Accelerator (TMA): Hardware '
                                                     'Multi-Dimensional Tensor Descriptors, Box Loads and '
                                                     'Multicast',
                                                     'Hopper Warpgroup Matrix Multiply (wgmma.mma_async): '
                                                     '128-Thread Collective MMA Directly from Shared Memory',
                                                     'Producer-Consumer Warp Specialization and Ping-Pong '
                                                     'Persistent GEMM Schedules on Hopper/Blackwell',
                                                     'Quantitative Case Study & Synthesis: Programming '
                                                     'Tensor Cores: WMMA, MMA PTX, Hopper TMA/WGMMA and '
                                                     'Blackwell']},
                                        {'id': 'flashattention_llm_kernels',
                                         'title': 'Fused LLM Kernels: Online Softmax, FlashAttention-1/2/3 '
                                                  'and PagedAttention',
                                         'summary': 'Milakov-Gimelshein online softmax, I/O-aware '
                                                    'FlashAttention tiling, KV-cache paging and fused '
                                                    'quantization.',
                                         'sim': 'attention_viz',
                                         'lab': True,
                                         'lessons': ['Memory-Bound LLM Operators: Fusing RMSNorm, RoPE '
                                                     '(Rotary Position Embeddings) and SwiGLU in Single-Pass '
                                                     'Kernels',
                                                     'Milakov-Gimelshein Online Safe Softmax: Single-Pass '
                                                     'Running Maximum and Exponential Rescaling Recurrence',
                                                     'FlashAttention-1 and FlashAttention-2: Tiling Q, K, V '
                                                     'in SRAM to Eliminate O(N^2) HBM Materialization',
                                                     'FlashAttention-3 on Hopper: Overlapping WGMMA QK^T and '
                                                     'PV Matmuls with Asynchronous Softmax and FP8 '
                                                     'Quantization',
                                                     'LLM Decoding (Batch=1 to Small Batch): FlashDecoding '
                                                     'Split-KV Parallelism and vLLM PagedAttention Block '
                                                     'Tables',
                                                     'Fused Weight-Only Dequantization Kernels (Marlin '
                                                     'INT4×FP16 and FP8 GEMM): LOP3 Bit Manipulation in '
                                                     'Registers',
                                                     'Quantitative Case Study & Synthesis: Fused LLM '
                                                     'Kernels: Online Softmax, FlashAttention-1/2/3 and '
                                                     'PagedAttention']},
                                        {'id': 'ptx_sass_nsight_profiling',
                                         'title': 'PTX/SASS Assembly Inspection, CUDA Graphs and Nsight '
                                                  'Compute Profiling',
                                         'summary': 'Reading SASS control codes, scoreboard stalls, CUDA '
                                                    'streams/graphs and roof-lining kernels in Nsight '
                                                    'Compute.',
                                         'sim': 'function_plotter',
                                         'lab': True,
                                         'lessons': ['Dissecting Compiled Binaries with cuobjdump and '
                                                     'nvdisasm: Virtual PTX ISA vs Native SASS Machine Code',
                                                     'SASS Instruction Control Codes: Stall Counts, Yield '
                                                     'Flags, Read/Write Dependency Barriers for Fixed- vs '
                                                     'Variable-Latency Ops',
                                                     'Nsight Compute (ncu) Deep Dive: Speed-of-Light (SOL%), '
                                                     'Warp State Statistics (Stall Long Scoreboard, MIO '
                                                     'Throttle)',
                                                     'Eliminating Kernel Launch Overhead: Asynchronous CUDA '
                                                     'Streams, Events, CUDA Graphs and Device-Initiated '
                                                     'Graphs',
                                                     'Persistent Kernels and Cooperative Groups: Grid-Wide '
                                                     'Synchronization (cg::this_grid().sync())',
                                                     'Cross-Vendor GPU Portability: AMD CDNA3 (MI300X) '
                                                     'Matrix Cores (MFMA), HIP and Composable Kernel (CK)',
                                                     'Quantitative Case Study & Synthesis: PTX/SASS Assembly '
                                                     'Inspection, CUDA Graphs and Nsight Compute '
                                                     'Profiling']}]},
                           {'id': 'sys_gpu_301',
                            'code': 'GPU 301',
                            'title': 'Multi-GPU Collectives, High-Performance Networking and Petascale HPC',
                            'level': 300,
                            'credits': 4,
                            'description': 'NVLink/NVSwitch and InfiniBand/RoCE fabrics, '
                                           'ring/tree/Halving-Doubling AllReduce algorithms, NCCL/NVSHMEM '
                                           'internals, MPI-4 and 4D distributed parallelism for frontier '
                                           'model training.',
                            'prerequisites': ['sys_gpu_201', 'sys_os_301'],
                            'modules': [{'id': 'gpu_interconnects_rdma',
                                         'title': 'Multi-GPU Interconnects: PCIe, NVLink/NVSwitch, GPUDirect '
                                                  'RDMA and Ultra Ethernet',
                                         'summary': 'PCIe root complexes, NVSwitch non-blocking fat trees, '
                                                    'GPUDirect RDMA/Storage and rail-optimized fabrics.',
                                         'sim': 'graph_theory',
                                         'lab': False,
                                         'lessons': ['Intra-Node Topology: PCIe Gen5/Gen6 Switches, NUMA '
                                                     'Root-Complex Bottlenecks and Peer-to-Peer (P2P) BAR '
                                                     'Mapping',
                                                     'NVLink and NVSwitch Fabrics: 900–1800 GB/s '
                                                     'Non-Blocking All-to-All Domains (NVL8 and NVL72 '
                                                     'Rack-Scale Systems)',
                                                     'In-Network Sharp (Scalable Hierarchical Aggregation '
                                                     'and Reduction Protocol) Switch-Offloaded Collectives',
                                                     'GPUDirect RDMA and GPUDirect Storage (GDS): Direct '
                                                     'NIC-to-HBM and NVMe-to-HBM DMA Without Host Bounce '
                                                     'Buffers',
                                                     'Cluster Topologies at 10,000+ GPUs: Rail-Optimized '
                                                     'Clos Fat-Trees, Dragonfly and 3D Torus (TPU Pods)',
                                                     'Congestion Control in Lossless RDMA Networks: PFC '
                                                     'Deadlocks, ECN Marking, DCQCN and Ultra Ethernet (UET)',
                                                     'Quantitative Case Study & Synthesis: Multi-GPU '
                                                     'Interconnects: PCIe, NVLink/NVSwitch, GPUDirect RDMA '
                                                     'and Ultra Ethernet']},
                                        {'id': 'collective_algorithms_nccl',
                                         'title': 'Collective Communication Algorithms and NCCL/NVSHMEM '
                                                  'Internals',
                                         'summary': 'Alpha-beta cost model, Ring vs Rabenseifner vs '
                                                    'Double-Binary-Tree AllReduce, LL/LL128/Simple protocols '
                                                    'and NVSHMEM.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ["Hockney's Alpha-Beta (Latency-Bandwidth) Model for "
                                                     'Point-to-Point and Collective Communication Lower '
                                                     'Bounds',
                                                     'AllReduce Algorithms: Bandwidth-Optimal Ring AllReduce '
                                                     '(2(N-1)/N) vs Latency-Optimal Recursive '
                                                     'Halving-Doubling',
                                                     'Broadcast, ReduceScatter, AllGather and All-to-All '
                                                     "(Bruck's Algorithm and Pairwise Exchange)",
                                                     'NCCL Internals: Topology Graph XML Discovery, Ring vs '
                                                     'Double Binary Tree Channels and Proxy Threads',
                                                     'NCCL Wire Protocols: Simple (Fence-Based), LL128 '
                                                     '(128-Byte Flagged Lines) and LL (8-Byte Low-Latency '
                                                     'Flagged Transfers)',
                                                     'Symmetric Memory and PGAS on GPUs: NVSHMEM, CUDA IPC '
                                                     'Multimem Instructions (multimem.ld_reduce) and Fused '
                                                     'GEMM+AllReduce',
                                                     'Quantitative Case Study & Synthesis: Collective '
                                                     'Communication Algorithms and NCCL/NVSHMEM Internals']},
                                        {'id': 'mpi_scientific_hpc',
                                         'title': 'MPI-4, Domain Decomposition and Exascale Scientific '
                                                  'Solvers',
                                         'summary': 'Non-blocking halo exchanges, 3D FFT pencil '
                                                    'decompositions, sparse Krylov/multigrid solvers and '
                                                    'I/O.',
                                         'sim': 'wave_superposition',
                                         'lab': True,
                                         'lessons': ['MPI Execution Model: Communicators, Blocking vs '
                                                     'Non-Blocking Point-to-Point (MPI_Isend/MPI_Irecv) and '
                                                     'Derived Datatypes',
                                                     'Cartesian Stencil Computations: 3D Domain '
                                                     'Decomposition, Surface-to-Volume Ratio and Overlapping '
                                                     'Halo Exchange with Compute',
                                                     'Distributed Fast Fourier Transforms (3D FFT): Slab vs '
                                                     'Pencil Decompositions and All-to-All Transpose '
                                                     'Bottlenecks',
                                                     'Scalable Linear Solvers: Distributed Conjugate '
                                                     'Gradient (CG), GMRES and Geometric/Algebraic Multigrid '
                                                     '(AMG)',
                                                     'N-Body Simulations at Scale: Barnes-Hut Octrees, Fast '
                                                     'Multipole Method (FMM) and Space-Filling Hilbert '
                                                     'Curves',
                                                     'Parallel HDF5 and MPI-IO Collective Buffering for '
                                                     'Checkpointing Exascale Simulations to Lustre/DAOS',
                                                     'Quantitative Case Study & Synthesis: MPI-4, Domain '
                                                     'Decomposition and Exascale Scientific Solvers']},
                                        {'id': 'distributed_training_4d_parallelism',
                                         'title': '4D Distributed Parallelism for Trillion-Parameter Model '
                                                  'Training',
                                         'summary': 'Data parallelism, ZeRO-1/2/3/FSDP, Megatron '
                                                    'tensor/sequence parallelism, 1F1B/DualPipe pipelining '
                                                    'and MoE.',
                                         'sim': 'matrix_transform',
                                         'lab': True,
                                         'lessons': ['Memory Breakdown of Transformer Training: Parameters, '
                                                     'Gradients, FP32 Master Weights, Adam States and '
                                                     'Activations',
                                                     'ZeRO (Zero Redundancy Optimizer) Stages 1, 2, 3 and '
                                                     'PyTorch FSDP: Sharding Optimizer, Gradients and '
                                                     'Weights via ReduceScatter/AllGather',
                                                     'Megatron-LM Tensor Parallelism (Column-Parallel and '
                                                     'Row-Parallel Linear Layers) and Sequence Parallelism',
                                                     'Pipeline Parallelism: GPipe, PipeDream 1F1B, '
                                                     'Interleaved 1F1B, Zero-Bubble Pipelining and DeepSeek '
                                                     'DualPipe',
                                                     'Long-Context Ring Attention and Ulysses All-to-All '
                                                     'Context Parallelism for Million-Token Sequences',
                                                     'Expert Parallelism (MoE): Token Dispatch/Combine '
                                                     'All-to-All Kernels, Load-Balancing Losses and '
                                                     'Straggler Resilience',
                                                     'Quantitative Case Study & Synthesis: 4D Distributed '
                                                     'Parallelism for Trillion-Parameter Model Training']}]},
                           {'id': 'sys_gpu_410',
                            'code': 'GPU 410',
                            'title': 'Senior Seminar & Capstone Project in High-Performance Systems',
                            'level': 400,
                            'credits': 4,
                            'description': 'Design, implement and rigorously evaluate an original systems project — a kernel, runtime, '
                                           'storage engine or distributed service — while learning to read research papers, measure '
                                           'performance honestly and reason about distributed failure. Synthesizes architecture, OS, '
                                           'compilers and parallel computing from the full degree.',
                            'prerequisites': ['sys_gpu_301', 'sys_os_301'],
                            'modules': [{'id': 'systems_research',
                                         'title': 'Reading and Doing Systems Research',
                                         'summary': 'How the SOSP/OSDI community frames problems and evaluates solutions.',
                                         'lessons': ['How to Read a Systems Paper: The Three-Pass Method',
                                                     'Classic Papers Seminar: End-to-End Arguments, UNIX, MapReduce',
                                                     'Identifying Bottlenecks and Formulating a Systems Hypothesis',
                                                     'Writing a Capstone Project Proposal with Evaluation Plan']},
                                        {'id': 'benchmarking_rigor',
                                         'title': 'Benchmarking and Measurement Rigor',
                                         'summary': 'Avoiding the classic mistakes that invalidate performance results.',
                                         'lab': True,
                                         'lessons': ['Warm-up, Variance and Confidence Intervals in Benchmarks',
                                                     'Tail Latency, Percentiles and Coordinated Omission',
                                                     'Microbenchmarks vs Macrobenchmarks and Representative Workloads',
                                                     'Statistical Comparison of Systems Configurations',
                                                     'Building a Reproducible Benchmark Harness in Python']},
                                        {'id': 'profiling',
                                         'title': 'Profiling and Bottleneck Analysis',
                                         'summary': 'Finding out where time actually goes on CPUs and GPUs.',
                                         'lab': True,
                                         'lessons': ['Sampling Profilers, perf and Flame Graphs',
                                                     'Hardware Performance Counters and Top-Down Microarchitecture Analysis',
                                                     'GPU Profiling with Nsight Systems and Nsight Compute',
                                                     'Analyzing Profiler Output to Guide Optimization']},
                                        {'id': 'distributed_foundations',
                                         'title': 'Distributed Systems Foundations',
                                         'summary': 'The core concepts needed before studying consensus and planet-scale systems.',
                                         'lab': True,
                                         'lessons': ['RPC, Serialization and Failure Semantics',
                                                     'Failure Models: Crash, Omission and Byzantine',
                                                     'Logical Clocks, Vector Clocks and Happens-Before',
                                                     'The FLP Impossibility and CAP Theorem Intuitions',
                                                     'Simulating Message Passing with Vector Clocks in Python']},
                                        {'id': 'capstone_delivery',
                                         'title': 'Capstone Build, Paper and Presentation',
                                         'summary': 'Delivering a working system and a credible evaluation.',
                                         'lessons': ['Iterative Development and Correctness Testing for Systems Code',
                                                     'Writing a Systems Paper: Design, Implementation and Evaluation',
                                                     'Artifact Evaluation and Reproducibility Badges',
                                                     'Presenting and Defending Your Capstone System']}]},
                           {'id': 'sys_gpu_401',
                            'code': 'GPU 401',
                            'title': 'Distributed Consensus, Fault-Tolerant Storage and Planet-Scale Systems',
                            'level': 500,
                            'credits': 4,
                            'description': 'Logical clocks, FLP impossibility, Paxos/Raft consensus, '
                                           'Byzantine fault tolerance, Spanner TrueTime distributed '
                                           'transactions, CRDTs and deterministic simulation testing.',
                            'prerequisites': ['sys_gpu_301', 'sys_os_401', 'sys_gpu_410'],
                            'modules': [{'id': 'time_causality_impossibility',
                                         'title': 'Time, Causality, Snapshots and Fundamental Impossibility '
                                                  'Results',
                                         'summary': 'Lamport/vector clocks, Chandy-Lamport consistent cuts, '
                                                    'Two Generals, FLP impossibility and CAP/PACELC.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ["Physical Clocks (NTP, PTP) vs Logical Time: Lamport's "
                                                     'Happens-Before (→) Partial Order and Scalar Clocks',
                                                     'Mattern-Fidge Vector Clocks, Version Vectors and Exact '
                                                     'Causal History Tracking',
                                                     'Chandy-Lamport Distributed Snapshot Algorithm: '
                                                     'Recording Consistent Global States Across Asynchronous '
                                                     'Channels',
                                                     'Network Failure Models (Crash-Stop, Crash-Recovery, '
                                                     'Omission, Byzantine) and Synchrony Assumptions (Sync, '
                                                     'Async, Partial Sync)',
                                                     'Fischer-Lynch-Paterson (FLP) Impossibility of '
                                                     'Deterministic Consensus in Asynchronous Systems with '
                                                     'One Unreliable Process',
                                                     "Brewer's CAP Theorem (Gilbert-Lynch Proof), PACELC and "
                                                     'Linearizability vs Sequential/Causal/Eventual '
                                                     'Consistency',
                                                     'Quantitative Case Study & Synthesis: Time, Causality, '
                                                     'Snapshots and Fundamental Impossibility Results']},
                                        {'id': 'paxos_raft_state_machine_replication',
                                         'title': 'State Machine Replication: Multi-Paxos, Raft and '
                                                  'Viewstamped Replication',
                                         'summary': 'Quorum intersection, Synod Single-Decree Paxos, '
                                                    'Multi-Paxos, Raft leader election/log replication and '
                                                    'Flexible Paxos.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Quorum Systems and State Machine Replication: Why '
                                                     'Deterministic Replicas Processing Identical Logs '
                                                     'Remain Synchronized',
                                                     "Lamport's Single-Decree Paxos (Synod): Prepare/Promise "
                                                     'and Accept/Accepted Phases and Dueling Proposers',
                                                     'Multi-Paxos and Viewstamped Replication: Amortizing '
                                                     'Phase 1 via Stable Leaders, Leases and Read-Index '
                                                     'Linearizable Reads',
                                                     'The Raft Consensus Protocol: Randomized Election '
                                                     'Timeouts, Term Monotonicity, Log Matching and Leader '
                                                     'Completeness',
                                                     'Raft Cluster Membership Changes (Joint Consensus vs '
                                                     'Single-Server Changes), Log Compaction and '
                                                     'InstallSnapshot',
                                                     "Howard's Flexible Paxos (FPaxos), Mencius/EPaxos "
                                                     'Leaderless Consensus and Chain Replication (CRAQ)',
                                                     'Quantitative Case Study & Synthesis: State Machine '
                                                     'Replication: Multi-Paxos, Raft and Viewstamped '
                                                     'Replication']},
                                        {'id': 'distributed_transactions_spanner',
                                         'title': 'Distributed Transactions: 2PC, MVCC, Calvin and Google '
                                                  'Spanner TrueTime',
                                         'summary': 'Two-Phase Commit, MVCC snapshot isolation, write skew, '
                                                    'deterministic Calvin and TrueTime external consistency.',
                                         'sim': 'state_machine',
                                         'lab': True,
                                         'lessons': ['Atomic Commitment Across Shards: Two-Phase Commit '
                                                     '(2PC), Coordinator Failure Blocking and Three-Phase '
                                                     'Commit (3PC)',
                                                     'Concurrency Control: Strict Two-Phase Locking (SS2PL), '
                                                     'Wound-Wait Deadlock Avoidance and Optimistic '
                                                     'Concurrency Control (OCC)',
                                                     'Multi-Version Concurrency Control (MVCC): Snapshot '
                                                     'Isolation (SI), Write-Skew Anomalies and Serializable '
                                                     'Snapshot Isolation (SSI)',
                                                     'Google Percolator and CockroachDB: Building '
                                                     'Distributed ACID Transactions on Top of Timestamp '
                                                     'Oracles',
                                                     'Google Spanner Architecture: Paxos-Replicated Tablets, '
                                                     'GPS/Atomic-Clock TrueTime API [earliest, latest] and '
                                                     'Commit Wait',
                                                     'Deterministic Database Systems (Calvin and FaunaDB): '
                                                     'Sequencing Transactions Before Execution to Eliminate '
                                                     '2PC Locking',
                                                     'Quantitative Case Study & Synthesis: Distributed '
                                                     'Transactions: 2PC, MVCC, Calvin and Google Spanner '
                                                     'TrueTime']},
                                        {'id': 'crdts_byzantine_dst',
                                         'title': 'Conflict-Free Replicated Data Types (CRDTs), BFT and '
                                                  'Deterministic Simulation Testing',
                                         'summary': 'Join-semilattice CvRDTs/CmRDTs, Dynamo/Cassandra sloppy '
                                                    'quorums, PBFT/HotStuff and FoundationDB/TigerBeetle '
                                                    'DST.',
                                         'sim': 'graph_theory',
                                         'lab': True,
                                         'lessons': ['Dynamo-Style Leaderless Storage: Consistent Hashing '
                                                     'Rings, Tunable R+W>N Quorums, Hinted Handoff and '
                                                     'Merkle Anti-Entropy',
                                                     "Strong Eventual Consistency and Shapiro's CRDTs: "
                                                     'State-Based (CvRDT Join-Semilattices) vs '
                                                     'Operation-Based (CmRDT) Convergence',
                                                     'Designing Practical CRDTs: G-Counter, PN-Counter, '
                                                     'LWW-Element-Set, OR-Set and Sequence CRDTs '
                                                     '(RGA/Yjs/Automerge)',
                                                     "Byzantine Fault Tolerance (f < N/3): Lamport's "
                                                     'Byzantine Generals, Castro-Liskov PBFT O(N^2) View '
                                                     'Change and Linear HotStuff',
                                                     'Formal Specification of Distributed Protocols in TLA+ '
                                                     'and PlusCal: Model Checking Safety and Liveness '
                                                     'Invariants',
                                                     'Deterministic Simulation Testing (FoundationDB and '
                                                     'TigerBeetle VOPR): Deterministic Network/Disk Fault '
                                                     'Injection at 1000x Real Time',
                                                     'Quantitative Case Study & Synthesis: Conflict-Free '
                                                     'Replicated Data Types (CRDTs), BFT and Deterministic '
                                                     'Simulation Testing']}]}]}]}
