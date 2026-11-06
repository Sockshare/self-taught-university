# Computational Neuroscience & Brain-Computer Interfaces curriculum catalog for Self-Taught.

DOMAIN = {'id': 'neuroscience',
 'name': 'Computational Neuroscience & Brain-Computer Interfaces',
 'icon': '🧬',
 'color': '#f43f5e',
 'tagline': 'From Hodgkin–Huxley ion channels and cortical dynamics to high-bandwidth speech BCIs, '
            'connectomics, and neuromorphic silicon.',
 'description': 'A rigorous computational and engineering curriculum spanning cellular biophysics and '
                'dynamical systems, sensory coding and cognitive maps, closed-loop intracortical '
                'brain-computer interfaces and neurostimulation, and nanoscale connectomics and neuromorphic '
                'hardware.',
 'subjects': [{'id': 'cellular_biophysics',
               'name': 'Cellular & Spiking Neural Biophysics',
               'icon': '⚡',
               'description': 'Ion channel thermodynamics, Hodgkin–Huxley conductance equations, nonlinear '
                              'phase-plane bifurcations, dendritic cable theory, and synaptic plasticity.',
               'courses': [{'id': 'neuro_110',
                            'code': 'NEURO 110',
                            'title': 'Membrane Electrostatics, Nernst Equilibrium & Passive RC Neurons',
                            'level': 100,
                            'credits': 4,
                            'description': 'Derive the resting membrane potential from statistical '
                                           'mechanics, electrodiffusion, and equivalent RC circuits of the '
                                           'lipid bilayer.',
                            'prerequisites': [],
                            'modules': [{'id': 'ion_pumps_nernst',
                                         'title': 'Electrodiffusion, Nernst–Planck & Equilibrium Potentials',
                                         'summary': 'How concentration gradients and electric fields balance '
                                                    'across selective ion channels to create Nernst reversal '
                                                    'potentials.',
                                         'lab': True,
                                         'lessons': ['Lipid Bilayer Capacitance, Ion Pumps (Na+/K+-ATPase), '
                                                     'and Intracellular Gradients',
                                                     "Fick's Law of Diffusion, Ohm's Drift Law, and the "
                                                     'Nernst–Planck Electrodiffusion Equation',
                                                     'Deriving the Nernst Equilibrium Potential for K+, Na+, '
                                                     'Cl-, and Ca2+ Ions',
                                                     'Constant-Field Assumption and the Goldman–Hodgkin–Katz '
                                                     '(GHK) Voltage Equation',
                                                     'Donnan Equilibrium, Osmotic Pressure Balance, and '
                                                     'Glial Potassium Buffering',
                                                     'Temperature Sensitivity (Q10 Factor) of Membrane '
                                                     'Potentials and Channel Kinetics',
                                                     'Quantitative Case Study & Synthesis: Electrodiffusion, '
                                                     'Nernst–Planck & Equilibrium Potentials'],
                                         'sim': 'equilibrium'},
                                        {'id': 'passive_rc_membrane',
                                         'title': 'Equivalent RC Membrane Circuits & Leaky '
                                                  'Integrate-and-Fire',
                                         'summary': 'Modeling the cell membrane as a parallel '
                                                    'resistor-capacitor circuit, membrane time constants, '
                                                    'and subthreshold integration.',
                                         'lab': True,
                                         'lessons': ['Specific Membrane Capacitance (1 uF/cm^2) and Input '
                                                     'Resistance Scaling with Soma Area',
                                                     'The Passive Membrane Differential Equation and '
                                                     'Exponential Time Constant (tau_m)',
                                                     'Subthreshold Responses to Step, Pulse, and Sinusoidal '
                                                     'Current Injections',
                                                     'Frequency-Domain Impedance: The Cell Membrane as a '
                                                     'First-Order Low-Pass Filter',
                                                     'The Leaky Integrate-and-Fire (LIF) Model, Threshold '
                                                     'Reset, and Absolute Refractory Period',
                                                     'Deriving the Analytical f-I (Frequency-Current) Gain '
                                                     'Curve of an LIF Neuron',
                                                     'Quantitative Case Study & Synthesis: Equivalent RC '
                                                     'Membrane Circuits & Leaky Integrate-and-Fire'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'patch_clamp_biophysics',
                                         'title': 'Voltage Clamp, Patch Clamp & Single-Channel Stochastic '
                                                  'Markov Models',
                                         'summary': 'Dissecting macroscopic ionic currents from microscopic '
                                                    'stochastic single-channel opening/closing transitions.',
                                         'lab': True,
                                         'lessons': ['Cole and Hodgkin–Huxley Axial Wire Voltage Clamp: '
                                                     'Space Clamp and Feedback Amplifiers',
                                                     'Sakmann & Neher Gigaseal Patch-Clamp Configurations: '
                                                     'Cell-Attached, Whole-Cell, Inside-Out',
                                                     'Capacitive Transient Subtraction (P/4 Protocol) and '
                                                     'Series Resistance Compensation',
                                                     'Single-Channel Recordings: Unitary Conductance, Open '
                                                     'Probability, and Dwell-Time Histograms',
                                                     'Continuous-Time Markov Chain Models of Ion Channel '
                                                     'Conformational States',
                                                     'Relationship Between Ensemble Average Single-Channel '
                                                     'Currents and Macroscopic Conductance',
                                                     'Quantitative Case Study & Synthesis: Voltage Clamp, '
                                                     'Patch Clamp & Single-Channel Stochastic Markov Models'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'synaptic_biophysics_intro',
                                         'title': 'Chemical & Electrical Synapses: Quantal Release & '
                                                  'Conductance',
                                         'summary': 'Connexin gap junctions, presynaptic Ca2+-triggered '
                                                    'vesicle exocytosis, Poisson quantal statistics, and '
                                                    'reversal potentials.',
                                         'lab': True,
                                         'lessons': ['Electrical Synapses (Gap Junctions): Bidirectional '
                                                     'Coupling and Spike-let Transmission',
                                                     'Presynaptic Calcium Microdomains, SNARE Complex '
                                                     'Zippering, and Vesicle Fusion',
                                                     'Del Castillo & Katz Quantal Hypothesis: Miniature '
                                                     'Postsynaptic Potentials and Poisson/Binomial Fits',
                                                     'Alpha-Function and Dual-Exponential Kinetic Models of '
                                                     'Synaptic Conductance',
                                                     'Excitatory (AMPA/NMDA) vs. Inhibitory (GABA_A/GABA_B) '
                                                     'Reversal Potentials',
                                                     'Shunting Inhibition: Divisive Gain Modulation Without '
                                                     'Hyperpolarization',
                                                     'Quantitative Case Study & Synthesis: Chemical & '
                                                     'Electrical Synapses: Quantal Release & Conductance'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'nmda_coincidence_ca',
                                         'title': 'NMDA Magnesium Block, Coincidence Detection & Calcium '
                                                  'Signaling',
                                         'summary': 'Voltage-dependent Mg2+ unblock of NMDA receptors, '
                                                    'intracellular calcium dynamics, and short-term synaptic '
                                                    'depression/facilitation.',
                                         'lab': True,
                                         'lessons': ['Biophysics of the Extracellular Mg2+ Block in NMDA '
                                                     'Glutamate Receptors',
                                                     'Jahr–Stevens Sigmoidal Voltage Dependence and Hebbian '
                                                     'Coincidence Detection',
                                                     'Short-Term Synaptic Plasticity: Vesicle Depletion '
                                                     'Depression vs. Residual Ca2+ Facilitation',
                                                     'The Tsodyks–Markram Dynamical Model of Depressing and '
                                                     'Facilitating Synapses',
                                                     'Intracellular Calcium Buffering, Calmodulin '
                                                     'Activation, and CaMKII Autophosphorylation',
                                                     'Retrograde Endocannabinoid Signaling and Presynaptic '
                                                     'Release Modulation',
                                                     'Quantitative Case Study & Synthesis: NMDA Magnesium '
                                                     'Block, Coincidence Detection & Calcium Signaling'],
                                         'sim': 'reaction_kinetics'}]},
                           {'id': 'neuro_210',
                            'code': 'NEURO 210',
                            'title': 'Hodgkin–Huxley Dynamics, Phase-Plane Bifurcations & Excitability',
                            'level': 200,
                            'credits': 4,
                            'description': 'Master the nonlinear dynamical systems behind action potential '
                                           'generation, phase-plane reductions, Type I/II excitability, and '
                                           'bursting oscillators.',
                            'prerequisites': ['neuro_110'],
                            'modules': [{'id': 'hodgkin_huxley_model',
                                         'title': 'The Hodgkin–Huxley Squid Giant Axon Model',
                                         'summary': 'Voltage-gated Na+ activation/inactivation (m^3h) and K+ '
                                                    'activation (n^4) gating variables and numerical '
                                                    'stiffness.',
                                         'lab': True,
                                         'lessons': ['Dissecting I_Na and I_K via Tetrodotoxin (TTX), '
                                                     'Tetraethylammonium (TEA), and Ion Substitution',
                                                     'Voltage-Dependent Opening (alpha) and Closing (beta) '
                                                     'Rate Functions for m, h, and n',
                                                     'Steady-State Activation/Inactivation Curves (x_inf) '
                                                     'and Voltage-Dependent Time Constants (tau_x)',
                                                     'The Complete 4D Hodgkin–Huxley ODE System and Action '
                                                     'Potential Upstroke/Downstroke Phases',
                                                     'Threshold Phenomenon, All-or-None Firing, and Anode '
                                                     'Break Excitation',
                                                     'Numerical Integration of Stiff Conductance Equations: '
                                                     'Runge–Kutta vs. Exponential Euler',
                                                     'Quantitative Case Study & Synthesis: The '
                                                     'Hodgkin–Huxley Squid Giant Axon Model'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'phase_plane_fitzhugh_nagumo',
                                         'title': '2D Reductions: FitzHugh–Nagumo & Morris–Lecar Phase '
                                                  'Portraits',
                                         'summary': 'Time-scale separation, cubic V-nullclines, recovery '
                                                    'W-nullclines, fixed points, and relaxation '
                                                    'oscillations.',
                                         'lab': True,
                                         'lessons': ['Dimensionality Reduction of Hodgkin–Huxley: Fast '
                                                     'Activation (m = m_inf) and Conservation (n + h = '
                                                     'const)',
                                                     'The FitzHugh–Nagumo (FHN) Model: Cubic Voltage '
                                                     'Nullcline and Linear Recovery Nullcline',
                                                     'The Morris–Lecar Model: Biophysical Ca2+ and K+ '
                                                     'Conductances in 2D Phase Space',
                                                     'Jacobian Linearization, Trace-Determinant Stability '
                                                     'Classification, and Limit Cycles',
                                                     'Phase-Resetting Curves (PRCs) and Entrainment of '
                                                     'Neural Oscillators to Periodic Inputs',
                                                     'Canard Trajectories and Threshold Manifolds Near the '
                                                     'Cubic Nullcline Knee',
                                                     'Quantitative Case Study & Synthesis: 2D Reductions: '
                                                     'FitzHugh–Nagumo & Morris–Lecar Phase Portraits'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'bifurcations_excitability',
                                         'title': "Bifurcation Theory of Hodgkin's Class I, II & III "
                                                  'Excitability',
                                         'summary': 'How SNIC vs. Andronov–Hopf bifurcations govern '
                                                    'continuous vs. discontinuous firing frequency onset and '
                                                    'resonator behavior.',
                                         'lab': True,
                                         'lessons': ["Hodgkin's Classification: Integrators (Class I) vs. "
                                                     'Resonators (Class II)',
                                                     'Saddle-Node on Invariant Circle (SNIC) Bifurcation and '
                                                     'Arbitrarily Low Firing Rates',
                                                     'Subcritical and Supercritical Andronov–Hopf '
                                                     'Bifurcations and Subthreshold Oscillations',
                                                     'Homoclinic Orbit Bifurcations and Bistability Between '
                                                     'Resting and Repetitive Spiking',
                                                     'Quadratic Integrate-and-Fire (QIF) Normal Form and the '
                                                     'Theta-Neuron Canonical Model',
                                                     'Adaptive Exponential Integrate-and-Fire (AdEx) and '
                                                     'Izhikevich Phenomenological Models',
                                                     'Quantitative Case Study & Synthesis: Bifurcation '
                                                     "Theory of Hodgkin's Class I, II & III Excitability"],
                                         'sim': 'phase_portrait'},
                                        {'id': 'ion_channel_zoo_bursting',
                                         'title': 'The Ion Channel Zoo & Slow-Fast Bursting Dynamics',
                                         'summary': 'A-type K+, T-type Ca2+, h-current (I_h), Ca2+-activated '
                                                    'K+ (SK/BK) channels, and geometric dissection of '
                                                    'bursting.',
                                         'lab': True,
                                         'lessons': ['Transient A-Type Potassium Current (I_A): Delaying '
                                                     'Spike Onset and Linearizing f-I Curves',
                                                     'Hyperpolarization-Activated Cyclic Nucleotide-Gated '
                                                     '(HCN / I_h) Sag and Rebound Firing',
                                                     'Low-Threshold T-Type Calcium Channels and Thalamic '
                                                     'Relay Bursting vs. Tonic Modes',
                                                     'Calcium-Activated Potassium Currents (I_KCa / AHP) and '
                                                     'Spike-Frequency Adaptation',
                                                     "Rinzel's Slow-Fast Dissection of Bursting: "
                                                     'Square-Wave, Elliptic, and Parabolic Bursters',
                                                     'Persistent Sodium Current (I_NaP) and Pacemaker Rhythm '
                                                     'Generation in Brainstem Nuclei',
                                                     'Quantitative Case Study & Synthesis: The Ion Channel '
                                                     'Zoo & Slow-Fast Bursting Dynamics'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'stochastic_spiking_noise',
                                         'title': 'Channel Noise, Fokker–Planck Equations & First-Passage '
                                                  'Times',
                                         'summary': 'Ornstein–Uhlenbeck synaptic bombardment, Langevin '
                                                    'equations, coherence resonance, and interspike interval '
                                                    'distributions.',
                                         'lab': True,
                                         'lessons': ['Diffusive Approximation of High-Rate Poisson Synaptic '
                                                     'Bombardment (Ornstein–Uhlenbeck Process)',
                                                     'The Fokker–Planck Advection-Diffusion Equation for '
                                                     'Membrane Voltage Probability Density',
                                                     'Mean-Driven vs. Fluctuation-Driven Spiking Regimes and '
                                                     'Coefficient of Variation (CV)',
                                                     "First-Passage Time Problem, Siegert's Formula, and "
                                                     'Inverse Gaussian ISI Distributions',
                                                     'Stochastic Resonance and Coherence Resonance in '
                                                     'Excitable Membranes',
                                                     'Escape-Noise Point-Process Generalized Linear Models '
                                                     '(GLMs) of Spiking',
                                                     'Quantitative Case Study & Synthesis: Channel Noise, '
                                                     'Fokker–Planck Equations & First-Passage Times'],
                                         'sim': 'distribution_explorer'}]},
                           {'id': 'neuro_310',
                            'code': 'NEURO 310',
                            'title': 'Dendritic Cable Theory, Multi-Compartment Modeling & Plasticity',
                            'level': 300,
                            'credits': 4,
                            'description': "Rall's cable equation, action potential backpropagation, active "
                                           'dendritic NMDA/Ca2+ spikes, NEURON/Brian2 simulation, and '
                                           'STDP/homeostatic learning rules.',
                            'prerequisites': ['neuro_210'],
                            'modules': [{'id': 'rall_cable_theory',
                                         'title': "Rall's Cable Equation, Electrotonic Length & Dendritic "
                                                  'Filtering',
                                         'summary': 'Deriving the 1D spatiotemporal PDE for voltage '
                                                    "propagation along passive neurites and Rall's 3/2 power "
                                                    'law.',
                                         'lab': True,
                                         'lessons': ['Axial Cytoplasmic Resistance, Membrane Resistance, and '
                                                     'Deriving the Linear Cable PDE',
                                                     'Characteristic Electrotonic Space Constant (lambda) '
                                                     'and Membrane Time Constant (tau_m)',
                                                     "Infinite and Semi-Infinite Cable Green's Functions and "
                                                     'Centripetal Attenuation',
                                                     'Boundary Conditions: Sealed-End, Killed-End, and '
                                                     'Somatodendritic Conductance Load',
                                                     "Rall's 3/2 Power Law: Collapsing Branched Dendritic "
                                                     'Trees into an Equivalent Cylinder',
                                                     'Spatiotemporal Synaptic Delays and Direction-Selective '
                                                     'Rall Sequences on Dendrites',
                                                     "Quantitative Case Study & Synthesis: Rall's Cable "
                                                     'Equation, Electrotonic Length & Dendritic Filtering'],
                                         'sim': 'wave_superposition'},
                                        {'id': 'axon_propagation_myelin',
                                         'title': 'Action Potential Propagation, Myelination & Saltatory '
                                                  'Conduction',
                                         'summary': 'Traveling wave solutions of the Hodgkin–Huxley cable '
                                                    'equation, axonal diameter scaling, and Ranvier node '
                                                    'regeneration.',
                                         'lab': True,
                                         'lessons': ['Coupling Hodgkin–Huxley Kinetics to the Cable PDE: '
                                                     'Traveling Wave Velocity Scaling',
                                                     'Why Unmyelinated Conduction Velocity Scales with the '
                                                     'Square Root of Axon Diameter',
                                                     'Myelin Sheath Biophysics: Reducing Internodal '
                                                     'Capacitance and Increasing Transverse Resistance',
                                                     'Saltatory Conduction Across Nodes of Ranvier and '
                                                     'Optimal g-Ratio (0.6–0.7) Derivation',
                                                     'Axonal Branch-Point Conduction Failures and Ectopic '
                                                     'Spike Initiation',
                                                     'Extracellular Field Potentials: Monopole/Dipole '
                                                     'Current Sources and Current Source Density (CSD)',
                                                     'Quantitative Case Study & Synthesis: Action Potential '
                                                     'Propagation, Myelination & Saltatory Conduction'],
                                         'sim': 'wave_superposition'},
                                        {'id': 'active_dendritic_computation',
                                         'title': 'Active Dendrites: Backpropagating Spikes, NMDA & Calcium '
                                                  'Plateaus',
                                         'summary': 'How pyramidal neurons act as two-layer nonlinear neural '
                                                    'networks via dendritic subunit supralinearities.',
                                         'lab': True,
                                         'lessons': ['Backpropagating Action Potentials (bAPs) and '
                                                     'Distance-Dependent Sodium Attenuation',
                                                     'Clustered Synaptic Inputs and Local Dendritic NMDA '
                                                     'Plateau Potentials',
                                                     'Apical Trunk Calcium Spikes in Layer 5 Pyramidal '
                                                     'Neurons: Coupling Top-Down Context to Output',
                                                     'Poirazi–Mel Two-Layer Artificial Neural Network '
                                                     'Abstraction of a Single Pyramidal Cell',
                                                     'Compartmentalized Inhibitory Control: Soma-Targeting '
                                                     '(PV) vs. Dendrite-Targeting (SST) Interneurons',
                                                     'Dendritic Spine Neck Resistance: Electrical and '
                                                     'Biochemical Compartmentalization',
                                                     'Quantitative Case Study & Synthesis: Active Dendrites: '
                                                     'Backpropagating Spikes, NMDA & Calcium Plateaus'],
                                         'sim': 'nn_playground'},
                                        {'id': 'multicompartment_simulators',
                                         'title': 'Multi-Compartment Solvers, Hines Matrix Algorithm & Model '
                                                  'Fitting',
                                         'summary': 'Solving branched cable trees in O(N) time with the '
                                                    'Hines tridiagonal solver and fitting biophysical '
                                                    'parameters to recordings.',
                                         'lab': True,
                                         'lessons': ['Spatial Discretization into Iso-Potential Compartments '
                                                     'and d-Lambda Rule Selection',
                                                     'The Hines Algorithm: Ordering Branched Tree Matrices '
                                                     'for O(N) Gaussian Elimination',
                                                     'Building Morphologically Detailed Reconstructions (SWC '
                                                     'Files) in NEURON, Arbor, and Brian2',
                                                     'Parameter Degeneracy in Conductance-Based Models: '
                                                     "Prinz's Stomatogastric Ganglion Findings",
                                                     'Multi-Objective Evolutionary Optimization (BluePyOpt) '
                                                     'and Simulation-Based Inference (SBI)',
                                                     'GPU-Accelerated Biophysical Network Simulation with '
                                                     'Jaxley and Differentiable Biophysics',
                                                     'Quantitative Case Study & Synthesis: Multi-Compartment '
                                                     'Solvers, Hines Matrix Algorithm & Model Fitting'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'synaptic_plasticity_rules',
                                         'title': 'LTP/LTD, Spike-Timing-Dependent Plasticity (STDP) & '
                                                  'Homeostasis',
                                         'summary': 'Bienenstock–Cooper–Munro (BCM) sliding thresholds, '
                                                    'pair/triplet STDP, calcium control hypotheses, and '
                                                    'synaptic scaling.',
                                         'lab': True,
                                         'lessons': ["Hebbian Learning Instabilities and Oja's "
                                                     'Multiplicative Normalization Rule',
                                                     'The Bienenstock–Cooper–Munro (BCM) Rule and '
                                                     'Activity-Dependent Sliding Modification Thresholds',
                                                     'Pair-Based Spike-Timing-Dependent Plasticity (STDP) '
                                                     'Windows and Song–Miller–Abbott Competition',
                                                     'Triplet STDP, Voltage-Based Clopath Rules, and '
                                                     'Calcium-Control Models (Shouval)',
                                                     'Homeostatic Synaptic Scaling and Intrinsic '
                                                     'Excitability Regulation',
                                                     'Three-Factor Neo-Hebbian Learning Rules: Eligibility '
                                                     'Traces Gated by Dopamine Reward Prediction Error',
                                                     'Quantitative Case Study & Synthesis: LTP/LTD, '
                                                     'Spike-Timing-Dependent Plasticity (STDP) & '
                                                     'Homeostasis'],
                                         'sim': 'gradient_descent'}]},
                           {'id': 'neuro_510',
                            'code': 'NEURO 510',
                            'title': 'Large-Scale Cortical Microcircuits, Mean-Field Theory & Oscillations',
                            'level': 500,
                            'credits': 4,
                            'description': 'Canonical cortical microcircuit motifs, balanced E/I networks, '
                                           'Wilson–Cowan and Brunel mean-field reductions, gamma/theta '
                                           'rhythms, and neural avalanche criticality.',
                            'prerequisites': ['neuro_310'],
                            'modules': [{'id': 'canonical_cortical_circuit',
                                         'title': 'Canonical Neocortical Microcircuits & Interneuron '
                                                  'Diversity',
                                         'summary': 'Six-layer neocortical connectivity (Douglas & Martin), '
                                                    'PV/SST/VIP inhibitory disinhibitory motifs, and '
                                                    'thalamocortical loops.',
                                         'lab': True,
                                         'lessons': ['Laminar Organization of Neocortex: L4 Thalamic Input, '
                                                     'L2/3 Recurrent Processing, L5/6 Output',
                                                     'Excitatory-Inhibitory Motifs: Feedforward, Feedback, '
                                                     'Lateral, and Disinhibitory Circuits',
                                                     'The Interneuron Trinity: Parvalbumin (PV), '
                                                     'Somatostatin (SST), and VIP Cell Computations',
                                                     'Stabilized Supralinear Networks (SSN): Surround '
                                                     'Suppression and Normalization',
                                                     'Thalamocortical First-Order vs. Higher-Order '
                                                     'Pulvinar/MD Loops and Thalamic Reticular Nucleus',
                                                     'Neuromodulatory Gain Control: Acetylcholine, '
                                                     'Norepinephrine, Serotonin, and Dopamine',
                                                     'Quantitative Case Study & Synthesis: Canonical '
                                                     'Neocortical Microcircuits & Interneuron Diversity'],
                                         'sim': 'graph_theory'},
                                        {'id': 'balanced_ei_networks',
                                         'title': 'Asynchronous Irregular States & Van Vreeswijk–Sompolinsky '
                                                  'Balance',
                                         'summary': 'How strong O(1/sqrt(K)) synapses produce fast tracking '
                                                    'and chaotic asynchronous irregular spiking without '
                                                    'fine-tuning.',
                                         'lab': True,
                                         'lessons': ['The Paradox of High Firing-Rate Variability (CV ~ 1) '
                                                     'Despite Hundreds of Synaptic Inputs',
                                                     'Van Vreeswijk & Sompolinsky Tight E/I Balance: '
                                                     'O(1/sqrt(K)) Synaptic Weight Scaling',
                                                     'Cancelation of O(sqrt(K)) Mean Currents Leaving O(1) '
                                                     'Fluctuation-Driven Spiking',
                                                     "Brunel's Phase Diagram of Sparsely Connected LIF "
                                                     'Networks: SR, SI, AR, and AI Regimes',
                                                     'Inhibition-Stabilized Networks (ISNs) and the '
                                                     'Paradoxical Response to Inhibitory Stimulation',
                                                     'Chaos, Lyapunov Exponents, and Sensitivity to '
                                                     'Single-Spike Perturbations in Balanced Nets',
                                                     'Quantitative Case Study & Synthesis: Asynchronous '
                                                     'Irregular States & Van Vreeswijk–Sompolinsky Balance'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'mean_field_neural_mass',
                                         'title': 'Wilson–Cowan Equations, Next-Generation Neural Mass & '
                                                  'Neural Fields',
                                         'summary': 'Deriving macroscopic population firing-rate equations, '
                                                    'Ott–Antonsen exact reductions, and Amari neural field '
                                                    'bump attractors.',
                                         'lab': True,
                                         'lessons': ['The Wilson–Cowan Excitatory-Inhibitory Population Rate '
                                                     'Equations and Hysteresis',
                                                     'Montbrió–Pazo–Roxin Exact Mean-Field Reduction of '
                                                     'Quadratic Integrate-and-Fire Networks',
                                                     'Amari Continuum Neural Field Equations: Mexican-Hat '
                                                     'Connectivity and Traveling Waves',
                                                     'Ring Attractors and Continuous Bump Attractors for '
                                                     'Head-Direction and Working Memory',
                                                     'Whole-Brain Connectome-Coupled Neural Mass Models (The '
                                                     'Virtual Brain)',
                                                     'Dynamic Causal Modeling (DCM) for Inferring Effective '
                                                     'Connectivity from fMRI/MEG',
                                                     'Quantitative Case Study & Synthesis: Wilson–Cowan '
                                                     'Equations, Next-Generation Neural Mass & Neural '
                                                     'Fields'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'neural_oscillations_sync',
                                         'title': 'Biophysics of Neural Oscillations: ING, PING, Theta-Gamma '
                                                  '& Kuramoto',
                                         'summary': 'Mechanisms of gamma (30–80 Hz) rhythms, theta-gamma '
                                                    'phase-amplitude coupling, '
                                                    'communication-through-coherence, and Kuramoto '
                                                    'synchronization.',
                                         'lab': True,
                                         'lessons': ['Interneuron Network Gamma (ING) vs. '
                                                     'Pyramidal-Interneuron Network Gamma (PING) Mechanisms',
                                                     'Kuramoto Coupled Phase Oscillators and the Order '
                                                     'Parameter Synchronization Transition',
                                                     'Theta-Gamma Phase-Amplitude Coupling (PAC) and '
                                                     'Lisman–Jensen Working Memory Multiplexing',
                                                     "Fries's Communication-Through-Coherence (CTC) "
                                                     'Hypothesis and Phase-Gated Routing',
                                                     'Hippocampal Sharp-Wave Ripples (150–250 Hz) and '
                                                     'Offline Memory Replay Consolidation',
                                                     'Slow-Wave Sleep Up/Down States, Thalamocortical '
                                                     'Spindles, and Epileptiform Bifurcations',
                                                     'Quantitative Case Study & Synthesis: Biophysics of '
                                                     'Neural Oscillations: ING, PING, Theta-Gamma & '
                                                     'Kuramoto'],
                                         'sim': 'fourier_series'},
                                        {'id': 'criticality_avalanches',
                                         'title': 'Self-Organized Criticality, Neural Avalanches & Dynamic '
                                                  'Range',
                                         'summary': 'Branching processes, power-law avalanche distributions, '
                                                    'edge-of-chaos information transmission, and metabolic '
                                                    'efficiency.',
                                         'lab': True,
                                         'lessons': ['Branching Processes (sigma = 1) and Beggs–Plenz '
                                                     'Power-Law Cortical Avalanches (-3/2 Exponent)',
                                                     'Maximizing Dynamic Range, Mutual Information, and '
                                                     'Susceptibility at the Critical Point',
                                                     'Self-Organization Toward Criticality via Short-Term '
                                                     'Synaptic Depression and Homeostatic STDP',
                                                     'Subcritical vs. Supercritical Deviations in '
                                                     'Anesthesia, Sleep, and Seizure States',
                                                     'Distinguishing True Power-Law Criticality from '
                                                     'Lognormal Superpositions (Clauset–Shalizi–Newman)',
                                                     'Metabolic Energy Budgets of Cortical Signaling: ATP '
                                                     'Cost of Action Potentials vs. Synapses',
                                                     'Quantitative Case Study & Synthesis: Self-Organized '
                                                     'Criticality, Neural Avalanches & Dynamic Range'],
                                         'sim': 'distribution_explorer'}]}]},
              {'id': 'systems_sensory',
               'name': 'Systems Neuroscience & Sensory Coding',
               'icon': '👁️',
               'description': 'Spike-train statistics, receptive field estimation, efficient coding theory, '
                              'visual/auditory/motor systems, hippocampal spatial navigation, and basal '
                              'ganglia decision-making.',
               'courses': [{'id': 'neuro_120',
                            'code': 'NEURO 120',
                            'title': 'Neural Coding, Spike-Train Statistics & Receptive Fields',
                            'level': 100,
                            'credits': 4,
                            'description': 'Quantify how neurons represent the external world using '
                                           'peri-stimulus time histograms, Poisson point processes, reverse '
                                           'correlation, and Linear-Nonlinear-Poisson cascades.',
                            'prerequisites': [],
                            'modules': [{'id': 'spike_train_point_processes',
                                         'title': 'Spike-Train Representation, PSTHs & Renewal Point '
                                                  'Processes',
                                         'summary': 'Dirac delta representations, Fano factors, interspike '
                                                    'interval coefficients of variation, and inhomogeneous '
                                                    'Poisson processes.',
                                         'lab': True,
                                         'lessons': ['Representing Spike Trains as Sums of Dirac Delta '
                                                     'Impulses and Binned Count Vectors',
                                                     'Peri-Stimulus Time Histograms (PSTH), Kernel Density '
                                                     'Smoothing, and Trial-to-Trial Variability',
                                                     'Homogeneous and Inhomogeneous Poisson Point Processes '
                                                     'and the Time-Rescaling Theorem',
                                                     'Fano Factor (Variance-to-Mean Ratio) and Coefficient '
                                                     'of Variation (CV and Local CV2)',
                                                     'Spike-Train Autocorrelation Functions, Refractory '
                                                     'Dips, and Rhythmic Sidebands',
                                                     'Cross-Correlograms, Shift Predictors, and '
                                                     'Disentangling Stimulus-Locked from Monosynaptic '
                                                     'Coupling',
                                                     'Quantitative Case Study & Synthesis: Spike-Train '
                                                     'Representation, PSTHs & Renewal Point Processes'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'reverse_correlation_sta',
                                         'title': 'White-Noise Reverse Correlation & Spike-Triggered Average '
                                                  '(STA)',
                                         'summary': 'Estimating linear spectrotemporal and spatiotemporal '
                                                    'receptive fields from Gaussian white-noise stimuli.',
                                         'lab': True,
                                         'lessons': ['Volterra and Wiener Kernel Expansions of Nonlinear '
                                                     'Sensory Systems',
                                                     'The Spike-Triggered Average (STA) as an Unbiased '
                                                     'Estimator of the Linear Filter',
                                                     'Correcting STA for Natural Stimulus Correlations via '
                                                     'Whitening and Regularized Ridge Regression',
                                                     'Spike-Triggered Covariance (STC) for Recovering '
                                                     'Multi-Dimensional Subspaces (Complex Cells)',
                                                     'Maximally Informative Dimensions (MID) for '
                                                     'Non-Gaussian Natural Stimuli',
                                                     'Visualizing Retinal Ganglion Cell Center-Surround and '
                                                     'V1 Gabor Receptive Fields',
                                                     'Quantitative Case Study & Synthesis: White-Noise '
                                                     'Reverse Correlation & Spike-Triggered Average (STA)'],
                                         'sim': 'fourier_series'},
                                        {'id': 'lnp_glm_encoding',
                                         'title': 'Linear-Nonlinear-Poisson (LNP) & Point-Process GLMs',
                                         'summary': 'Fitting concave log-likelihood generalized linear '
                                                    'models with post-spike history filters and '
                                                    'inter-neuronal coupling.',
                                         'lab': True,
                                         'lessons': ['The Linear-Nonlinear-Poisson (LNP) Cascade Model and '
                                                     'Static Nonlinearity Estimation',
                                                     'Point-Process Generalized Linear Models (GLMs): '
                                                     'Exponential Nonlinearity and Concave Log-Likelihood',
                                                     'Post-Spike History Filters: Capturing Refractory '
                                                     'Periods, Bursting, and Adaptation',
                                                     'Multi-Neuron Coupled GLMs: Inferring Directed '
                                                     'Functional Connectivity Matrices',
                                                     'Goodness-of-Fit Assessment via Kolmogorov–Smirnov '
                                                     'Plots on Time-Rescaled ISIs',
                                                     'L1/Group-Lasso Regularization for Sparse Receptive '
                                                     'Field and Connectivity Estimation',
                                                     'Quantitative Case Study & Synthesis: '
                                                     'Linear-Nonlinear-Poisson (LNP) & Point-Process GLMs'],
                                         'sim': 'regression_fit'},
                                        {'id': 'rate_vs_temporal_coding',
                                         'title': 'Rate Coding, Latency Coding, Phase-of-Firing & Population '
                                                  'Vectors',
                                         'summary': 'Comparing spike-count rate codes against '
                                                    'millisecond-precision first-spike latency, phase '
                                                    'precession, and Georgopoulos population vectors.',
                                         'lab': True,
                                         'lessons': ["Adrian's Rate Code vs. Thorpe's Rapid First-Spike "
                                                     'Rank-Order Latency Coding',
                                                     'Georgopoulos Cosine Tuning Curves and Population '
                                                     'Vector Decoding in Motor Cortex',
                                                     'Fisher Information of Tuning Curve Populations: Should '
                                                     'Narrow or Broad Curves Be Preferred?',
                                                     'Noise Correlations (r_sc): Information-Limiting '
                                                     'Differential Correlations vs. Orthogonal Noise',
                                                     'Phase-of-Firing Codes in Olfactory Bulb and '
                                                     'Hippocampal Theta Rhythms',
                                                     'Synchrony and Polychronous Spike-Timing Groups',
                                                     'Quantitative Case Study & Synthesis: Rate Coding, '
                                                     'Latency Coding, Phase-of-Firing & Population Vectors'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'information_theory_spikes',
                                         'title': 'Information Theory for Neural Spike Trains',
                                         'summary': 'Measuring bits per spike via Strong–Bialek direct '
                                                    'entropy estimation, Panzeri–Treves bias correction, and '
                                                    'stimulus reconstruction bounds.',
                                         'lab': True,
                                         'lessons': ['Shannon Entropy and Mutual Information I(S; R) Between '
                                                     'Stimulus Ensemble and Spike Words',
                                                     'The Strong–Bialek Direct Method: Discretizing Spike '
                                                     'Trains into Binary Words',
                                                     'Finite-Sample Entropy Bias and Panzeri–Treves / '
                                                     'Nemenman–Shafee–Bialek (NSB) Corrections',
                                                     'Lower-Bounding Mutual Information via Linear Stimulus '
                                                     'Reconstruction (Bialek–Rieke)',
                                                     'Bits per Second vs. Bits per Spike and Metabolic '
                                                     'Coding Efficiency',
                                                     'Data Processing Inequality Across Hierarchical Sensory '
                                                     'Pathways',
                                                     'Quantitative Case Study & Synthesis: Information '
                                                     'Theory for Neural Spike Trains'],
                                         'sim': 'distribution_explorer'}]},
                           {'id': 'neuro_220',
                            'code': 'NEURO 220',
                            'title': 'Sensory Systems, Efficient Coding & Predictive Processing',
                            'level': 200,
                            'credits': 4,
                            'description': "Barlow's efficient coding hypothesis, Olshausen–Field sparse "
                                           'coding of natural scenes, retinal/cortical vision, cochlear '
                                           'auditory processing, and Rao–Ballard predictive coding.',
                            'prerequisites': ['neuro_120'],
                            'modules': [{'id': 'efficient_sparse_coding',
                                         'title': "Natural Scene Statistics, Barlow's Hypothesis & Sparse "
                                                  'Coding',
                                         'summary': '1/f^2 spatial power spectra, retinal whitening, '
                                                    "Laughlin's contrast histogram equalization, and "
                                                    'Olshausen–Field Gabor emergence.',
                                         'lab': True,
                                         'lessons': ["Attneave and Barlow's Efficient Coding Hypothesis: "
                                                     'Redundancy Reduction Under Noise',
                                                     "Laughlin's Blowfly LMC Experiment: Matching the "
                                                     'Contrast Response Function to the Stimulus CDF',
                                                     '1/f^2 Power Spectrum of Natural Images and '
                                                     'Center-Surround Retinal Whitening Filters',
                                                     'Olshausen & Field Sparse Coding: Learning Oriented '
                                                     'Gabor Filters from Natural Image Patches',
                                                     'Independent Component Analysis (ICA) and '
                                                     'Bell–Sejnowski Infomax in Early Vision',
                                                     'Divisive Normalization (Heeger) as Redundancy '
                                                     'Reduction of Higher-Order Contrast Dependencies',
                                                     'Quantitative Case Study & Synthesis: Natural Scene '
                                                     "Statistics, Barlow's Hypothesis & Sparse Coding"],
                                         'sim': 'fourier_series'},
                                        {'id': 'visual_hierarchy_v1_it',
                                         'title': 'The Primate Visual Hierarchy: Retina, LGN, V1 to '
                                                  'Inferotemporal Cortex',
                                         'summary': 'ON/OFF retinal pathways, Hubel–Wiesel simple/complex '
                                                    'cells, V4 curvature/color, MT motion energy, and IT '
                                                    'invariant object manifolds.',
                                         'lab': True,
                                         'lessons': ['Retinal Circuitry: Photoreceptors, '
                                                     'Horizontal/Bipolar/Amacrine Cells, and ~40 RGC Types',
                                                     'Lateral Geniculate Nucleus (LGN) Magno/Parvo/Konio '
                                                     'Pathways and Cortical Feedback',
                                                     'Hubel & Wiesel V1 Architecture: Simple vs. Complex '
                                                     'Cells, Orientation Columns, and Pinwheels',
                                                     'Adelson–Bergen Spatiotemporal Energy Model of Motion '
                                                     'Direction Selectivity in V1 and Area MT',
                                                     'Ventral Stream Transformation: V2 Contours, V4 '
                                                     'Surface/Color, and IT Face Patches (Tsao)',
                                                     'Untangling Object Identity Manifolds Across Pose and '
                                                     'Illumination in Inferotemporal Cortex',
                                                     'Quantitative Case Study & Synthesis: The Primate '
                                                     'Visual Hierarchy: Retina, LGN, V1 to Inferotemporal '
                                                     'Cortex'],
                                         'sim': 'nn_playground'},
                                        {'id': 'auditory_cochlea_scene',
                                         'title': 'Auditory Biophysics, Cochlear Mechanics & Sound '
                                                  'Localization',
                                         'summary': 'Traveling waves on the basilar membrane, outer hair '
                                                    'cell Hopf amplification, Jeffress coincidence lines, '
                                                    'and spectrotemporal receptive fields.',
                                         'lab': True,
                                         'lessons': ['Basilar Membrane Tonotopic Mechanics and Active Outer '
                                                     'Hair Cell Prestin Amplification',
                                                     'Cochlear Filterbanks (Gammatone Filters) and Auditory '
                                                     'Nerve Phase Locking up to 4 kHz',
                                                     'Interaural Time Differences (ITD): The Jeffress '
                                                     'Delay-Line Coincidence Model in MSO',
                                                     'Interaural Level Differences (ILD) in LSO and '
                                                     'Head-Related Transfer Functions (HRTFs)',
                                                     'Spectrotemporal Receptive Fields (STRFs) in Inferior '
                                                     'Colliculus and Primary Auditory Cortex (A1)',
                                                     'Cocktail Party Problem: Auditory Scene Analysis and '
                                                     'Attention-Driven Speech Envelope Tracking',
                                                     'Quantitative Case Study & Synthesis: Auditory '
                                                     'Biophysics, Cochlear Mechanics & Sound Localization'],
                                         'sim': 'fourier_series'},
                                        {'id': 'somatosensory_olfactory',
                                         'title': 'Somatosensory Mechanoreception & Combinatorial Olfactory '
                                                  'Coding',
                                         'summary': 'Piezo2 mechanotransduction, barrel cortex whisker '
                                                    'dynamics, and random expansion-projection coding in '
                                                    'piriform/mushroom body circuits.',
                                         'lab': True,
                                         'lessons': ['Cutaneous Mechanoreceptors (Merkel, Meissner, '
                                                     'Pacinian, Ruffini) and Piezo2 Ion Channels',
                                                     'Rodent Whisker Barrel Cortex: Active Touch Phase '
                                                     'Coding and Cortical Column Maps',
                                                     'Olfactory Receptor Combinatorial Code and Glomerular '
                                                     'Convergence in the Olfactory Bulb',
                                                     'Divisive Normalization and Decorrelation by Granule '
                                                     'Cell Lateral Inhibition in the Bulb',
                                                     'Random Expansion and Sparse Kenyon Cell Coding in the '
                                                     'Drosophila Mushroom Body (Dasgupta)',
                                                     'Representational Drift in Piriform Cortex and '
                                                     'Continual Odor Learning',
                                                     'Quantitative Case Study & Synthesis: Somatosensory '
                                                     'Mechanoreception & Combinatorial Olfactory Coding'],
                                         'sim': 'kmeans'},
                                        {'id': 'predictive_coding_bayesian',
                                         'title': 'Rao–Ballard Predictive Coding & The Bayesian Brain',
                                         'summary': 'Hierarchical prediction-error minimization, '
                                                    'extra-classical surround suppression, and '
                                                    'psychophysical cue combination.',
                                         'lab': True,
                                         'lessons': ["Helmholtz's Unconscious Inference and Multisensory "
                                                     'Maximum-Likelihood Cue Integration (Ernst–Banks)',
                                                     'Rao & Ballard Hierarchical Predictive Coding: Feedback '
                                                     'Predictions vs. Feedforward Errors',
                                                     'Explaining End-Stopping and Extra-Classical Receptive '
                                                     'Field Effects via Predictive Coding',
                                                     'Mapping Predictive Coding onto Canonical Cortical '
                                                     'Layers (Deep Predictions, Superficial Errors)',
                                                     'Precision Weighting of Prediction Errors via Attention '
                                                     'and Synaptic Gain',
                                                     'Experimental Tests of Mismatch Negativity and '
                                                     'Sensorimotor Prediction Errors in V1 (Keller)',
                                                     'Quantitative Case Study & Synthesis: Rao–Ballard '
                                                     'Predictive Coding & The Bayesian Brain'],
                                         'sim': 'bayes_belief'}]},
                           {'id': 'neuro_320',
                            'code': 'NEURO 320',
                            'title': 'Spatial Navigation, Hippocampal Maps & Memory Consolidation',
                            'level': 300,
                            'credits': 4,
                            'description': 'Place cells, entorhinal hexagonal grid cells, continuous '
                                           'attractor & oscillatory interference models, successor '
                                           'representations, and episodic replay.',
                            'prerequisites': ['neuro_220'],
                            'modules': [{'id': 'place_head_direction',
                                         'title': 'Hippocampal Place Cells, Head-Direction Rings & Theta '
                                                  'Phase Precession',
                                         'summary': "O'Keefe's cognitive map, Taube head-direction ring "
                                                    "attractors, and O'Keefe–Recce theta phase precession.",
                                         'lab': True,
                                         'lessons': ["O'Keefe & Nadel's Cognitive Map: CA1/CA3 Place Fields "
                                                     'and Spatial Information Metrics (Skaggs)',
                                                     'Global Remapping vs. Rate Remapping Across Distinct '
                                                     'Environments and Contexts',
                                                     'Head-Direction Cells in Postsubiculum/Thalamus and '
                                                     'Angular Velocity Path Integration on a Ring',
                                                     'Theta Phase Precession: Compressing Behavioral '
                                                     'Sequences into Single 125 ms Theta Cycles',
                                                     'Boundary Vector Cells, Object Vector Cells, and '
                                                     'Egocentric-to-Allocentric Coordinate Transforms',
                                                     'Non-Spatial Cognitive Maps: Sound-Frequency and '
                                                     'Abstract Concept Spaces in Hippocampus'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'entorhinal_grid_cells',
                                         'title': 'Entorhinal Grid Cells: Hexagonal Lattices, Modules & '
                                                  'Attractor Models',
                                         'summary': 'Moser medial entorhinal grid cells, discrete scale '
                                                    'modules (sqrt(2) ratio), Burak–Fiete continuous '
                                                    'attractor networks, and path integration.',
                                         'lab': True,
                                         'lessons': ['Medial Entorhinal Cortex (MEC) Grid Cells: 60-Degree '
                                                     'Hexagonal Symmetry, Scale, Orientation, Phase',
                                                     'Discrete Grid Modules Along the Dorsoventral MEC Axis '
                                                     'and Geometric Scale Ratios',
                                                     'Information-Theoretic Optimality of Multi-Scale '
                                                     'Modular Grid Codes forExponential Capacity',
                                                     'Burak & Fiete 2D Toroidal Continuous Attractor Network '
                                                     '(CAN) Model of Path Integration',
                                                     'Topological Data Analysis (Persistent Homology) '
                                                     'Proving Toroidal Manifolds in MEC Populations',
                                                     'Emergence of Hexagonal Grid Representations in '
                                                     'Path-Integrating Recurrent Neural Networks'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'hopfield_ca3_memory',
                                         'title': 'Autoassociative Memory: Hopfield Networks, Dentate '
                                                  'Pattern Separation & CA3',
                                         'summary': "Marr's trisynaptic theory, dentate gyrus sparse "
                                                    'expansion for pattern separation, and CA3 recurrent '
                                                    'collateral pattern completion.',
                                         'lab': True,
                                         'lessons': ["Marr's Theory of the Archicortex and the Trisynaptic "
                                                     'Loop (EC -> DG -> CA3 -> CA1)',
                                                     'Hopfield Energy Function, Hebbian Storage Capacity '
                                                     '(0.138 N), and Spurious Attractors',
                                                     "Sparse Low-Activity Tsodyks–Feigel'man Networks and "
                                                     'Exponential Modern Hopfield (Ramsauer) Capacity',
                                                     'Dentate Gyrus Granule Cells: High Expansion Ratio and '
                                                     'Tonic Inhibition for Pattern Separation',
                                                     'CA3 Recurrent Collaterals: Autoassociative Pattern '
                                                     'Completion from Partial Cues',
                                                     'CA1 as a Comparator Between CA3 Recalled Predictions '
                                                     'and Direct Entorhinal Sensory Reality'],
                                         'sim': 'nn_playground'},
                                        {'id': 'replay_consolidation_sr',
                                         'title': 'Sharp-Wave Ripples, Forward/Reverse Replay & Successor '
                                                  'Representations',
                                         'summary': "Awake and sleep replay trajectories, Stachenfeld's "
                                                    'predictive successor representation, and systems memory '
                                                    'consolidation.',
                                         'lab': True,
                                         'lessons': ['Sharp-Wave Ripples (SWRs): Compressed 10–20x Replay of '
                                                     'Behavioral Place-Cell Sequences',
                                                     'Awake Reverse Replay for Credit Assignment vs. Forward '
                                                     'Replay for Model-Based Planning (Mattar–Daw)',
                                                     'Two-Stage Memory Consolidation: Hippocampal Indexing '
                                                     'to Neocortical Slow-Wave Sleep Transfer',
                                                     "Dayan's Successor Representation (SR): Discounted "
                                                     'Future State Occupancy Matrices',
                                                     'Explaining Place-Field Skewing and Detour '
                                                     'Rearrangements as Eigenvectors of the SR Matrix',
                                                     'The Tolman–Eichenbaum Machine (Whittington): '
                                                     'Factorizing Structural Grammar from Sensory Content'],
                                         'sim': 'gridworld_rl'},
                                        {'id': 'working_memory_prefrontal',
                                         'title': 'Prefrontal Working Memory: Persistent Attractors vs. '
                                                  'Activity-Silent Dynamics',
                                         'summary': 'Oculomotor delayed-response persistent activity, '
                                                    'Mongillo synaptic calcium working memory, and '
                                                    'rotational subspace demixing.',
                                         'lab': True,
                                         'lessons': ['Goldman-Rakic Oculomotor Delayed-Response Task and '
                                                     'Prefrontal Persistent Delay Activity',
                                                     "Wang's Biophysical NMDA-Dominated Recurrent Attractor "
                                                     'Model of Working Memory',
                                                     'Mongillo–Barak–Tsodyks Synaptic Theory of Working '
                                                     'Memory via Short-Term Calcium Facilitation',
                                                     'Dynamic Coding, Mixed Selectivity (Rigotti–Fusi), and '
                                                     'High-Dimensional Shattering Dimensionality',
                                                     'Orthogonal Subspace Demixing: Separating Sensory Input '
                                                     'from Distractor-Resistant Memory Subspaces',
                                                     'Basal Ganglia-Thalamocortical Gating of Working Memory '
                                                     'Updating vs. Maintenance'],
                                         'sim': 'phase_portrait'}]},
                           {'id': 'neuro_420',
                            'code': 'NEURO 420',
                            'title': 'Motor Control, Basal Ganglia Reinforcement Learning & Decision-Making',
                            'level': 400,
                            'credits': 4,
                            'description': 'Optimal feedback control, Shenoy–Churchland dynamical systems in '
                                           'motor cortex, dopamine TD reward prediction errors, '
                                           'drift-diffusion decision bounds, and cerebellar internal models.',
                            'prerequisites': ['neuro_320'],
                            'modules': [{'id': 'evidence_accumulation_ddm',
                                         'title': 'Perceptual Decision-Making, Drift-Diffusion & LIP/FEF '
                                                  'Dynamics',
                                         'summary': 'Sequential probability ratio tests, drift-diffusion '
                                                    'models, Shadlen–Newsome random-dot motion ramping, and '
                                                    'Wong–Wang attractor competition.',
                                         'lab': True,
                                         'lessons': ["Wald's Sequential Probability Ratio Test (SPRT) and "
                                                     "Ratcliff's Drift-Diffusion Model (DDM)",
                                                     'Analytical Choice Probability and Reaction-Time '
                                                     'Distributions via Fokker–Planck First-Passage',
                                                     'Shadlen & Newsome Random-Dot Motion Coherence Task and '
                                                     'Area LIP Ramping Firing Rates',
                                                     'Stepping vs. Ramping Single-Trial Debates: Hidden '
                                                     'Markov Models vs. Continuous Diffusion',
                                                     'Wong–Wang Mutual-Inhibition NMDA Attractor Model of '
                                                     'Two-Alternative Forced Choice',
                                                     'Urgency Signals, Collapsing Bounds, and Confidence '
                                                     'Readouts in Orbitofrontal Cortex'],
                                         'sim': 'bayes_belief'},
                                        {'id': 'dopamine_basal_ganglia_rl',
                                         'title': 'Basal Ganglia Go/NoGo Pathways & Distributional Dopamine '
                                                  'RL',
                                         'summary': 'Direct (D1) vs. indirect (D2) striatal pathways, '
                                                    'Schultz temporal-difference reward prediction errors, '
                                                    'and Dabney distributional RL.',
                                         'lab': True,
                                         'lessons': ['Basal Ganglia Anatomy: Striatal Medium Spiny Neurons, '
                                                     'GPi/SNr Tonic Inhibition, and STN Hyperdirect Stop',
                                                     "Direct (D1 'Go') and Indirect (D2 'NoGo') Pathways and "
                                                     'Action Selection Dynamics',
                                                     'Schultz, Dayan & Montague: VTA/SNc Dopamine Phasic '
                                                     'Responses as TD Reward Prediction Error (delta_t)',
                                                     'Striatal D1/D2 Three-Factor Synaptic Plasticity Gated '
                                                     'by Dopamine Peaks and Dips',
                                                     "Dabney's Distributional Reinforcement Learning in VTA: "
                                                     'Optimistic vs. Pessimistic Expectile Neurons',
                                                     'Model-Free Dorsolateral Striatum Habit Loops vs. '
                                                     'Model-Based Dorsomedial Goal-Directed Planning'],
                                         'sim': 'bandit'},
                                        {'id': 'motor_cortex_dynamical_systems',
                                         'title': 'Motor Cortex as a Dynamical System: Rotations & '
                                                  'Null-Space Preparation',
                                         'summary': 'Moving beyond representational tuning curves to '
                                                    'Shenoy–Churchland low-dimensional preparatory null '
                                                    'spaces and rotational dynamics.',
                                         'lab': True,
                                         'lessons': ['Representational vs. Dynamical Systems Views of '
                                                     'Primary (M1) and Premotor (PMd) Cortex',
                                                     'Churchland & Shenoy Preparatory Activity: Setting the '
                                                     'Initial Condition of a Neural Oscillator',
                                                     "Kaufman's Output-Null vs. Output-Potent Subspaces: "
                                                     'Preparing Movement Without Premature Muscle Twitch',
                                                     'jPCA: Discovering Rotational Dynamics in '
                                                     'Low-Dimensional Motor Population Trajectories',
                                                     'Tangling Metric (Russo): Why Motor Cortex Trajectories '
                                                     'Avoid Crossing Statesunlike Sensory Cortex',
                                                     'Thalamocortical Communication Subspaces and Pontine '
                                                     'Triggering of Movement Initiation'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'optimal_feedback_cerebellum',
                                         'title': 'Optimal Feedback Control, Minimum Intervention & '
                                                  'Cerebellar Internal Models',
                                         'summary': 'Todorov–Jordan stochastic optimal feedback control, '
                                                    'minimum jerk, and Marr–Albus–Ito cerebellar forward '
                                                    'models.',
                                         'lab': True,
                                         'lessons': ['Flash & Hogan Minimum-Jerk Trajectories and '
                                                     'Harris–Wolpert Signal-Dependent Motor Noise',
                                                     'Todorov & Jordan Stochastic Optimal Feedback Control '
                                                     '(LQG) and the Minimum Intervention Principle',
                                                     'Sensory Delay Compensation via Forward Internal Models '
                                                     'and Kalman State Estimation',
                                                     'Marr–Albus–Ito Cerebellar Circuit: Granule Cell '
                                                     'Expansion, Purkinje Cells, and Climbing Fiber Errors',
                                                     'Complex Spikes vs. Simple Spikes and Parallel-Fiber '
                                                     'LTD in Motor Adaptation (VOR / Force Fields)',
                                                     'Spinal Cord Central Pattern Generators (CPGs), Muscle '
                                                     'Synergies, and Proprioceptive Reflex Loops'],
                                         'sim': 'kalman_filter'}]}]},
              {'id': 'neural_bci',
               'name': 'Neural Decoding & Brain-Computer Interfaces (BCI)',
               'icon': '🧠',
               'description': 'High-density neural recording physics (Neuropixels/ECoG/EEG), spike sorting, '
                              'latent state-space dynamics (LFADS/GPFA), closed-loop Kalman/RNN cursor and '
                              'speech prostheses, and neurostimulation.',
               'courses': [{'id': 'neuro_130',
                            'code': 'NEURO 130',
                            'title': 'Electrophysiology Signal Processing, Spectral Analysis & EEG/ECoG',
                            'level': 100,
                            'credits': 4,
                            'description': 'Acquire, filter, and analyze extracellular local field '
                                           'potentials, ECoG, and scalp EEG: volume conduction, multitaper '
                                           'spectrograms, CSP spatial filtering, and artifact removal.',
                            'prerequisites': [],
                            'modules': [{'id': 'biopotential_recording_physics',
                                         'title': 'Biophysics of Extracellular Recording, Electrodes & '
                                                  'Amplifiers',
                                         'summary': 'Electrode-electrolyte double-layer impedance, thermal '
                                                    'Johnson–Nyquist noise, instrumentation amplifiers, and '
                                                    'spatial scale from spikes to EEG.',
                                         'lab': True,
                                         'lessons': ['Volume Conduction in Brain Tissue: Current Dipoles and '
                                                     '1/r vs. 1/r^2 Potential Decay',
                                                     'Spatial and Spectral Scales: Intracortical Action '
                                                     'Potentials (300–6000 Hz), LFP (<300 Hz), ECoG, EEG',
                                                     'Electrode-Electrolyte Interface: Helmholtz '
                                                     'Double-Layer Capacitance, Faradaic Impedance, and '
                                                     'PEDOT:PSS',
                                                     'Thermal Johnson–Nyquist Noise, 1/f Flicker Noise, and '
                                                     'Common-Mode Rejection Ratio (CMRR)',
                                                     'CMOS Multiplexed High-Density Silicon Probes: '
                                                     'Neuropixels 1.0/2.0 Architecture',
                                                     'Aliasing, Front-End Analog Anti-Aliasing Filters, and '
                                                     'Simultaneous Sample-and-Hold'],
                                         'sim': 'electric_field'},
                                        {'id': 'filtering_multitaper_spectra',
                                         'title': 'Zero-Phase Filtering, Wavelets & Thomson Multitaper '
                                                  'Spectral Estimation',
                                         'summary': 'Designing non-causal filtfilt filters without phase '
                                                    'distortion, Morlet wavelets, and Slepian prolate '
                                                    'spheroidal multitaper spectrograms.',
                                         'lab': True,
                                         'lessons': ['Causal IIR/FIR Phase Distortion vs. Zero-Phase '
                                                     'Forward-Backward Filtering (filtfilt)',
                                                     'Line-Noise Removal without Ringing: Spectrum '
                                                     'Interpolation vs. Notch Filters',
                                                     "Variance-Bias Tradeoff of Periodograms and Thomson's "
                                                     'Discrete Prolate Spheroidal Sequences (Slepian Tapers)',
                                                     'Continuous Wavelet Transform (Morlet Wavelets) and '
                                                     'Hilbert Transform Instantaneous Phase/Envelope',
                                                     'Fooof / SpecParam: Separating Periodic Oscillatory '
                                                     'Peaks from the 1/f^chi Aperiodic Background',
                                                     'Coherence, Imaginary Coherence, and Weighted Phase Lag '
                                                     'Index (wPLI) Against Volume Conduction'],
                                         'sim': 'fourier_series'},
                                        {'id': 'ica_artifact_cleaning',
                                         'title': 'Artifact Rejection, Common Average Referencing & '
                                                  'Independent Component Analysis',
                                         'summary': 'Removing ocular (EOG), muscular (EMG), and cardiac '
                                                    '(ECG) artifacts using surface Laplacians, Infomax ICA, '
                                                    'and ASR.',
                                         'lab': True,
                                         'lessons': ['Reference Montage Selection: Monopolar, Bipolar, '
                                                     'Common Average Reference (CAR), and Surface Laplacian',
                                                     'Linear Mixing Model of Scalp Potentials: Leadfield '
                                                     'Matrices and Forward Head Models (BEM/FEM)',
                                                     'Blind Source Separation via Infomax and FastICA for '
                                                     'Ocular Blink and ECG Removal',
                                                     'Artifact Subspace Reconstruction (ASR) for Real-Time '
                                                     'Sliding-Window Artifact Cleaning',
                                                     'Inverse Source Localization: Minimum-Norm Estimates '
                                                     '(MNE), dSPM, and LCMV Beamformers',
                                                     'Automated Channel Quality Scoring and Spherical Spline '
                                                     'Interpolation of Bad Channels'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'noninvasive_bci_paradigms',
                                         'title': 'Non-Invasive BCI Paradigms: Motor Imagery, P300 & SSVEP',
                                         'summary': 'Sensorimotor mu/beta event-related desynchronization, '
                                                    'Common Spatial Patterns (CSP), Riemannian covariance '
                                                    'classifiers, and SSVEP CCA.',
                                         'lab': True,
                                         'lessons': ['Sensorimotor Rhythm (SMR) Motor Imagery: Mu (8–12 Hz) '
                                                     'and Beta (13–30 Hz) ERD/ERS',
                                                     'Common Spatial Patterns (CSP): Generalized Eigenvalue '
                                                     'Decomposition Maximizing Class Variance Ratio',
                                                     'Filter-Bank CSP (FBCSP) and Shrinkage Linear '
                                                     'Discriminant Analysis (rLDA)',
                                                     'Riemannian Geometry on Symmetric Positive-Definite '
                                                     '(SPD) Covariance Matrices: Tangent Space '
                                                     'Classification',
                                                     'Event-Related Potential (P300) Oddball Spellers and '
                                                     'xDAWN Spatial Enhancement',
                                                     'Steady-State Visual Evoked Potentials (SSVEP) and '
                                                     'Canonical Correlation Analysis (CCA) Decoding'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'optical_neuroimaging',
                                         'title': 'Optical Neurophysiology: Two-Photon Calcium Imaging, '
                                                  'Voltage Indicators & fNIRS',
                                         'summary': 'GCaMP fluorescence kinetics, motion correction '
                                                    '(NoRMCorre), CNMF source extraction (Suite2p/CaImAn), '
                                                    'and Oasis spike deconvolution.',
                                         'lab': True,
                                         'lessons': ['Genetically Encoded Calcium Indicators (GCaMP8) and '
                                                     'Genetically Encoded Voltage Indicators (GEVIs)',
                                                     'Two-Photon Laser Scanning Microscopy Physics and '
                                                     'Volumetric Bessel/Light-Bead Imaging',
                                                     'Piecewise-Rigid Motion Correction (NoRMCorre) for '
                                                     'Breathing and Brain-Motion Artifacts',
                                                     'Constrained Non-Negative Matrix Factorization (CNMF) '
                                                     'for Overlapping Soma Demixing',
                                                     'Fast Non-Negative Deconvolution (OASIS) for Inferring '
                                                     'Spike Trains from Slow Calcium Transients',
                                                     'Functional Near-Infrared Spectroscopy (fNIRS): '
                                                     'Modified Beer–Lambert Law for Oxy/Deoxy-Hemoglobin'],
                                         'sim': 'fourier_series'}]},
                           {'id': 'neuro_230',
                            'code': 'NEURO 230',
                            'title': 'High-Density Spike Sorting & Population Latent Variable Models',
                            'level': 200,
                            'credits': 4,
                            'description': 'Template-matching spike sorting (Kilosort) for thousands of '
                                           'channels, drift tracking, dimensionality reduction '
                                           '(PCA/dPCA/GPFA), and latent neural trajectories.',
                            'prerequisites': ['neuro_120', 'neuro_130'],
                            'modules': [{'id': 'spike_sorting_kilosort',
                                         'title': 'Automated Spike Sorting, Overlapping Spike Deconvolution '
                                                  '& Drift Correction',
                                         'summary': 'High-pass filtering, whitening, spatiotemporal template '
                                                    'matching (Kilosort4), and rigid/non-rigid probe drift '
                                                    'registration.',
                                         'lab': True,
                                         'lessons': ['The Spike Sorting Problem: Separating Single Units '
                                                     'from Multi-Unit Hash on Dense Probe Arrays',
                                                     'Spatial Whitening Across Channels and Threshold '
                                                     'Crossing Detection',
                                                     'Why Classical PCA+GMM Clustering Fails on Temporally '
                                                     'Overlapping Synchronous Spikes',
                                                     'Kilosort Spatiotemporal Template Matching: Low-Rank '
                                                     'SVD Templates and Matching Pursuit Deconvolution',
                                                     'Probe Drift Estimation and Registration (DREDge) '
                                                     'Across Chronic Multi-Hour Recordings',
                                                     'Quality Metrics for Single-Unit Isolation: Refractory '
                                                     'Period Violations, Presence Ratio, and Amplitude '
                                                     'Cutoff'],
                                         'sim': 'kmeans'},
                                        {'id': 'population_subspaces_dpca',
                                         'title': 'Neural Population Geometry, PCA, Factor Analysis & '
                                                  'Demixed PCA',
                                         'summary': 'Trial-averaged vs. single-trial population subspaces, '
                                                    'shared vs. private noise variance, and demixing task '
                                                    'variables with dPCA.',
                                         'lab': True,
                                         'lessons': ['The Neural State Space: Representing N Neurons as a '
                                                     'Trajectory in R^N',
                                                     'Principal Component Analysis (PCA) on Trial-Averaged '
                                                     'Condition PSTHs vs. Single-Trial Binned Counts',
                                                     'Factor Analysis (FA): Separating Shared Co-Fluctuation '
                                                     'Subspaces from Independent Poisson Noise',
                                                     'Demixed PCA (dPCA): Marginalizing Covariance Matrices '
                                                     'Across Stimulus, Choice, and Time',
                                                     'Targeted Dimensionality Reduction (TDR): '
                                                     'Orthogonalizing Task-Regression Axes (Mante et al.)',
                                                     'Participation Ratio and Effective Dimensionality of '
                                                     'High-Dimensional Neural Manifolds'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'gpfa_lds_smoothing',
                                         'title': 'Gaussian Process Factor Analysis (GPFA) & Linear '
                                                  'Dynamical Systems',
                                         'summary': 'Extracting smooth single-trial low-dimensional '
                                                    'trajectories without arbitrary pre-smoothing kernels '
                                                    'via GPFA and Kalman smoothing.',
                                         'lab': True,
                                         'lessons': ['Limitations of Two-Stage Kernel Smoothing + PCA on '
                                                     'Single-Trial Spike Trains',
                                                     'Gaussian Process Factor Analysis (GPFA): Jointly '
                                                     'Learning Observation Projections and GP Time Scales',
                                                     'Linear Dynamical Systems (LDS) with Poisson '
                                                     'Observations and Laplace-EM Inference',
                                                     'Switching Linear Dynamical Systems (rSLDS) for '
                                                     'Segmenting Discrete Behavioral States',
                                                     'Canonical Correlation Analysis (CCA) and Procrustes '
                                                     'Alignment Across Recording Sessions and Animals',
                                                     'Leave-One-Neuron-Out Cross-Validation for Selecting '
                                                     'Latent Dimensionality'],
                                         'sim': 'kalman_filter'},
                                        {'id': 'nonlinear_manifolds_umap_cebra',
                                         'title': 'Nonlinear Neural Manifolds: Isomap, UMAP, Topological '
                                                  'Data Analysis & CEBRA',
                                         'summary': 'Uncovering ring, torus, and task-aligned manifolds '
                                                    'using geodesic distances, persistent cohomology, and '
                                                    'contrastive learning (CEBRA).',
                                         'lab': True,
                                         'lessons': ['Geodesic Distance Preservation (Isomap) and '
                                                     'Neighborhood Graph Embeddings (t-SNE / UMAP)',
                                                     'Persistent Homology (Vietoris–Rips Complexes) and '
                                                     'Betti Barcodes for Ring/Torus Verification',
                                                     'Circular Coordinates from 1st Cohomology for '
                                                     'Unsupervised Angle Decoding',
                                                     'CEBRA: Contrastive Learning of Consistent Latent '
                                                     'Embeddings Using Behavioral and Time Labels',
                                                     'Poisson Variational Autoencoders (VAEs) and '
                                                     'Identifiability Guarantees in Nonlinear Latent Models',
                                                     'Representational Similarity Analysis (RSA) and '
                                                     'Centered Kernel Alignment (CKA)'],
                                         'sim': 'nn_playground'},
                                        {'id': 'lfads_neural_ode',
                                         'title': 'Deep Generative Dynamics: LFADS, Neural ODEs & '
                                                  'Transformer Foundation Models',
                                         'summary': 'Inferring single-trial initial conditions and '
                                                    'unmeasured controller inputs with Latent Factor '
                                                    'Analysis via Dynamical Systems (LFADS) and NDT/POYO.',
                                         'lab': True,
                                         'lessons': ['Latent Factor Analysis via Dynamical Systems (LFADS): '
                                                     'Bidirectional RNN Encoders and Generator RNNs',
                                                     'Inferring Unmeasured External Inputs (Controller '
                                                     'Signals) in Non-Autonomous Cortical Circuits',
                                                     'AutoLFADS Population-Based Training and Hyperparameter '
                                                     'Regularization',
                                                     'Neural Ordinary Differential Equations (Neural ODEs) '
                                                     'for Continuous-Time Irregular Spike Trains',
                                                     'Neural Data Transformers (NDT) and POYO: Pretraining '
                                                     'Across Multi-Session, Multi-Subject Spike Recordings',
                                                     'Zero-Shot Cross-Session Adaptation via '
                                                     'Unit-Identification Tokens'],
                                         'sim': 'attention_viz'}]},
                           {'id': 'neuro_330',
                            'code': 'NEURO 330',
                            'title': 'Closed-Loop Intracortical BCIs: Motor Cursor, Prosthetic & Speech '
                                     'Decoding',
                            'level': 300,
                            'credits': 4,
                            'description': 'Velocity Kalman filters (ReFIT-KF), recurrent neural decoders, '
                                           'intracortical speech-to-text/avatar neuroprostheses '
                                           '(Willett/Chang), and co-adaptive calibration.',
                            'prerequisites': ['neuro_230'],
                            'modules': [{'id': 'kalman_cursor_bci',
                                         'title': 'Intracortical Motor BCIs: Velocity Kalman Filters & '
                                                  'ReFIT-KF',
                                         'summary': 'Decoding 2D/3D cursor and robotic arm velocity in real '
                                                    "time, Intention Estimation (ReFIT), and Fitts's Law "
                                                    'bitrate benchmarks.',
                                         'lab': True,
                                         'lessons': ['Linear Velocity Encoding Models vs. Position Models in '
                                                     'Primary Motor Cortex (M1)',
                                                     'Steady-State Velocity Kalman Filter Derivation and '
                                                     'Sub-20 ms Real-Time Execution',
                                                     'Recalibrated Feedback Intention-Trained Kalman Filter '
                                                     '(ReFIT-KF): Rotating Velocities Toward the Target',
                                                     'Click State Decoding via Hidden Markov Models (HMM) or '
                                                     'Parallel Logistic Classifiers',
                                                     "Information Throughput Metrics: Fitts's Law Index of "
                                                     'Difficulty and Achieveable Bitrate (bps)',
                                                     'High-DoF Robotic Arm Control (Collinger/Hochberg) and '
                                                     'Grasp Posture Subspaces'],
                                         'sim': 'kalman_filter'},
                                        {'id': 'chronic_nonstationarity_alignment',
                                         'title': 'Combatting Chronic Recording Instability & Manifold '
                                                  'Alignment',
                                         'summary': 'Handling micromotion, gliosis, and unit turnover across '
                                                    'months via distribution alignment (ADAN/NoMAD) and '
                                                    'self-training.',
                                         'lab': True,
                                         'lessons': ['Causes of Chronic Signal Non-Stationarity: Electrode '
                                                     'Micromotion, Encapsulation, and Unit Dropout',
                                                     'Threshold Crossings (-4.5 RMS) vs. Online Spike '
                                                     'Sorting for Long-Term Stability',
                                                     'Preservation of Low-Dimensional Neural Manifold '
                                                     'Structure Despite Single-Neuron Turnover (Gallego)',
                                                     'Unsupervised Manifold Alignment: Procrustes, ADAN '
                                                     '(Adversarial Domain Adaptation), and NoMAD',
                                                     'Retrospective Target Inference for Self-Calibrating '
                                                     'Closed-Loop Cursor Use Without Calibration Blocks',
                                                     "Co-Adaptation Dynamics: How the User's Cortical "
                                                     'Network Learns the Decoder Mapping'],
                                         'sim': 'kalman_filter'},
                                        {'id': 'handwriting_speech_bci',
                                         'title': 'High-Bandwidth Communication BCIs: Handwriting & Speech '
                                                  'Neuroprostheses',
                                         'summary': 'Decoding attempted handwriting (Willett) and '
                                                    'vocal-tract articulatory gestures/phonemes '
                                                    '(Willett/Chang) using RNNs, CTC loss, and LLM '
                                                    'rescoring.',
                                         'lab': True,
                                         'lessons': ['Why Point-and-Click Typing Caps Out vs. Dextrous Motor '
                                                     'Sequences (Handwriting and Speech)',
                                                     'Decoding Attempted Handwriting from Hand-Knob M1 via '
                                                     'GRU/RNN and Synthetic Data Augmentation',
                                                     'Speech Motor Cortex (vSMC / Area 6v) Representation of '
                                                     'Vocal-Tract Articulators (Lips, Jaw, Tongue, Larynx)',
                                                     'Connectionist Temporal Classification (CTC) Loss for '
                                                     'Aligning Unsegmented Neural Activity to Phonemes',
                                                     'Weighted Finite-State Transducer (WFST) N-Gram '
                                                     'Decoding + Large Language Model Beam Rescoring',
                                                     'Direct Speech Waveform and Facial Avatar Synthesis via '
                                                     'Vocoders (HiFi-GAN) for Expressive Prosody'],
                                         'sim': 'attention_viz'},
                                        {'id': 'bidirectional_sensory_bci',
                                         'title': 'Bidirectional BCIs: Intracortical Microstimulation (ICMS) '
                                                  '& Biomimetic Touch',
                                         'summary': 'Restoring artificial tactile and proprioceptive '
                                                    'feedback in S1 to accelerate prosthetic grasp control.',
                                         'lab': True,
                                         'lessons': ['Why Purely Visual Feedback Slows Down Prosthetic '
                                                     'Grasping and Force Control',
                                                     'Somatotopic Organization of Primary Somatosensory '
                                                     'Cortex (Area 1 and Area 3b) Hand Representations',
                                                     'Intracortical Microstimulation (ICMS) Charge-Balanced '
                                                     'Biphasic Pulse Safety Limits (Shannon Equation)',
                                                     'Biomimetic Stimulation: Transient Onset/Offset Bursts '
                                                     'Mimicking Rapidly Adapting Mechanoreceptors',
                                                     'Artifact Blanker Circuits and Template Subtraction for '
                                                     'Simultaneous M1 Recording during S1 Stimulation',
                                                     'Closed-Loop Performance Gains from Artificial '
                                                     'Cutaneous Touch in Human Clinical Trials (Flesher)'],
                                         'sim': 'pid_controller'},
                                        {'id': 'bci_implant_engineering',
                                         'title': 'Implantable Hardware Architecture: Utah Arrays, '
                                                  'Stentrodes, Threads & Wireless',
                                         'summary': 'Bio-mechanical foreign body response, hermetic '
                                                    'packaging, ultra-low-power ASIC spike compression, and '
                                                    'transcutaneous telemetry.',
                                         'lab': True,
                                         'lessons': ['Mechanical Mismatch: Silicon (150 GPa) vs. Brain '
                                                     'Tissue (1 kPa) and Foreign Body Astrogliosis',
                                                     'Comparing Utah Microelectrode Arrays, Flexible '
                                                     'Polyimide Threads (Neuralink), and Endovascular '
                                                     'Stentrodes',
                                                     'Subdural High-Density Micro-ECoG Grids and Minimally '
                                                     'Invasive Cranial Layer Interfaces',
                                                     'Thermal Dissipation Constraint: Keeping Cortical '
                                                     'Temperature Rise Below 1 Degree Celsius (< 40 mW)',
                                                     'On-Chip Spike Detection, Nonlinear Energy Operator '
                                                     '(NEO), and Lossless/Lossy Compression ASICs',
                                                     'Inductive Power Transfer, Optical/UWB Telemetry, and '
                                                     'Hermetic Titanium/Ceramic Encapsulation'],
                                         'sim': 'electric_field'}]},
                           {'id': 'neuro_530',
                            'code': 'NEURO 530',
                            'title': 'Closed-Loop Neurostimulation, Optogenetics & Clinical Neuroengineering',
                            'level': 500,
                            'credits': 4,
                            'description': "Adaptive deep brain stimulation (aDBS) for Parkinson's, "
                                           'responsive neurostimulation for epilepsy, '
                                           'optogenetic/holographic control, and neuroethics.',
                            'prerequisites': ['neuro_310', 'neuro_330'],
                            'modules': [{'id': 'biophysics_extracellular_stim',
                                         'title': 'Activating Function Theory & Volume-of-Tissue-Activated '
                                                  'Modeling',
                                         'summary': "Rattay's activating function (second spatial derivative "
                                                    'of extracellular voltage), chronaxie/rheobase '
                                                    'strength-duration curves, and finite-element VTA.',
                                         'lab': True,
                                         'lessons': ["Rattay's Activating Function: Why the Second Spatial "
                                                     'Derivative d^2V_e/dx^2 Drives Depolarization',
                                                     'Cathodic vs. Anodic Stimulation Thresholds and Anodic '
                                                     'Surround Block',
                                                     'Lapicque and Weiss Strength-Duration Curves: Rheobase '
                                                     'Current and Chronaxie Time Constant',
                                                     'Why Extracellular Stimulation Recruits Large-Diameter '
                                                     'Myelinated Axons Before Cell Bodies',
                                                     'Finite-Element Volume Conduction Modeling and Volume '
                                                     'of Tissue Activated (VTA) Estimation',
                                                     'Directional Segmented DBS Leads and Current Steering '
                                                     'Optimization Around Internal Capsule'],
                                         'sim': 'electric_field'},
                                        {'id': 'adaptive_dbs_control',
                                         'title': 'Adaptive Deep Brain Stimulation (aDBS) & Phase-Locked '
                                                  'Control',
                                         'summary': "Subthalamic beta bursts in Parkinson's disease, "
                                                    'threshold and proportional feedback controllers, and '
                                                    'Cagnan phase-locked stimulation.',
                                         'lab': True,
                                         'lessons': ['Pathological Beta-Band (13–30 Hz) Synchrony and Burst '
                                                     "Duration in the Basal Ganglia in Parkinson's",
                                                     'Sensing During Stimulation: Symmetrical Sandwich '
                                                     'Contacts and Amplifier Saturation Recovery',
                                                     'Dual-Threshold Adaptive DBS (Little/Brown) and '
                                                     'Cortical Gamma-Triggered Dyskinesia Control',
                                                     'Phase-Specific Stimulation: Real-Time Hilbert/PLL '
                                                     'Phase Tracking to Suppress Pathological Oscillations',
                                                     'Desynchronizing Coupled Oscillators via Tass '
                                                     'Coordinated Reset (CR) Multi-Site Stimulation',
                                                     'Closed-Loop DBS for Treatment-Resistant Depression and '
                                                     'OCD: Biomarker Discovery in VC/VS and SCC'],
                                         'sim': 'pid_controller'},
                                        {'id': 'epilepsy_seizure_forecasting',
                                         'title': 'Epileptogenic Network Localization, Seizure Forecasting & '
                                                  'RNS',
                                         'summary': 'High-frequency oscillations (HFOs), Dynamical Network '
                                                    'Models of EZ fragility, line-length/bandpower RNS '
                                                    'detectors, and circadian seizure cycles.',
                                         'lab': True,
                                         'lessons': ['Stereoelectroencephalography (sEEG) and Graph '
                                                     'Fragility Perturbation Metrics for Epileptogenic Zones',
                                                     'Interictal Biomarkers: Ripples (80–250 Hz), Fast '
                                                     'Ripples (250–500 Hz), and Ictal DC Shifts',
                                                     'Ultra-Low-Power On-Device Seizure Detection: '
                                                     'Line-Length, Area, and Half-Wave Algorithms in RNS',
                                                     'Multidien (Weekly/Monthly) and Circadian Rhythms of '
                                                     'Interictal Epileptiform Activity (Baud)',
                                                     'Probabilistic Seizure Forecasting Calibration (Brier '
                                                     'Score) and Patient Advisory Systems',
                                                     "Optimal Control of Seizure Bifurcations in Jirsa's "
                                                     'Epileptor Dynamical Model'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'optogenetics_all_optical',
                                         'title': 'Optogenetics, Two-Photon Holographic Stimulation & '
                                                  'All-Optical Physiology',
                                         'summary': 'Channelrhodopsin/halorhodopsin photocycle kinetics, '
                                                    'spatial light modulators (SLMs), and writing synthetic '
                                                    'patterns into single-cell ensembles.',
                                         'lab': True,
                                         'lessons': ['Microbial Opsins: Channelrhodopsin-2 (ChR2), '
                                                     'Red-Shifted Chrimson, and Inhibitory '
                                                     'GtACR/Halorhodopsin',
                                                     'Four-State Photocycle Kinetic Models of Opsins and '
                                                     'Light Scattering/Absorption in Tissue (Kubelka–Munk)',
                                                     'Two-Photon Computer-Generated Holography (CGH) with '
                                                     'Liquid-Crystal Spatial Light Modulators (SLMs)',
                                                     'Temporal Focusing and Spiral Scanning for Single-Soma '
                                                     'Axial Resolution',
                                                     'All-Optical Clamp: Reading GCaMP Activity and '
                                                     'Triggering Targeted Ensemble Replay in Real Time',
                                                     'Sonogenetics, Magnetothermal Stimulation, and '
                                                     'Non-Invasive Focused Ultrasound Neuromodulation'],
                                         'sim': 'wave_superposition'},
                                        {'id': 'bci_safety_neuroethics',
                                         'title': 'Neurosecurity, Privacy of Neural Data & Clinical '
                                                  'Regulatory Engineering',
                                         'summary': 'FDA IDE/PMA Class III medical device verification, '
                                                    'encryption of wireless neural streams, mental privacy, '
                                                    'and agency in AI-assisted BCIs.',
                                         'lab': True,
                                         'lessons': ['ISO 14708 / IEC 60601 Medical Device Safety Standards '
                                                     'and FDA Investigational Device Exemptions (IDE)',
                                                     'Biocompatibility, Accelerated Aging Soak Tests, and '
                                                     'Failure Modes and Effects Analysis (FMEA)',
                                                     'Neurosecurity: Authenticating Wireless Implant '
                                                     'Commands and Preventing Malicious Stimulation',
                                                     'Privacy of Raw Neural Telemetry: Decoding Unintended '
                                                     'Private Attributes from EEG/ECoG',
                                                     'Shared Autonomy and Sense of Agency When LLMs '
                                                     'Autocomplete Decoded Speech or Motor Intent',
                                                     'Explantation Rights, Long-Term Device Stewardship, and '
                                                     'Equitable Access to Neurotechnology'],
                                         'sim': 'truth_table'}]}]},
              {'id': 'connectomics_ai',
               'name': 'Connectomics & Neuro-Inspired AI',
               'icon': '🕸️',
               'description': 'Nanoscale electron-microscopy connectome reconstruction, whole-brain graph '
                              'theory, biologically plausible credit assignment, spiking neural networks, '
                              'and neuromorphic silicon.',
               'courses': [{'id': 'neuro_140',
                            'code': 'NEURO 140',
                            'title': 'Structural Connectomics: From C. elegans & Drosophila to Mammalian '
                                     'Cortex',
                            'level': 100,
                            'credits': 4,
                            'description': 'Explore complete synaptic wiring diagrams across species, '
                                           'flooded-filling 3D EM segmentation, synapse detection, and '
                                           'structural graph motifs.',
                            'prerequisites': [],
                            'modules': [{'id': 'em_connectome_imaging',
                                         'title': 'Nanoscale Volume Electron Microscopy & Tissue Preparation',
                                         'summary': 'Heavy-metal osmium staining, serial block-face SEM, '
                                                    'ATUM-multiSEM petabyte imaging pipelines, and expansion '
                                                    'microscopy.',
                                         'lab': True,
                                         'lessons': ['Why Optical Resolution (200 nm) Cannot Resolve Dense '
                                                     'Neuropil and Synaptic Clefts (20 nm)',
                                                     'Extracellular Space Preservation and Reduced-Osmium '
                                                     '(rOTO) Heavy-Metal Staining',
                                                     'Serial Block-Face SEM (SBEM), FIB-SEM Isotropic '
                                                     'Milling, and ATUM Wafer Tape Libraries',
                                                     'Multi-Beam Scanning Electron Microscopy (mSEM) at '
                                                     'Petabyte/Cubic-Millimeter Scale (MICrONS)',
                                                     'Stitching, Elastic Montage Alignment, and Defect '
                                                     'Compensation Across Hundreds of Thousands of Sections',
                                                     'Expansion Microscopy (ExM) and LICONN: Hydrogel '
                                                     'Swelling for Molecularly Annotated Optical '
                                                     'Connectomics'],
                                         'sim': 'graph_theory'},
                                        {'id': 'flood_filling_segmentation',
                                         'title': '3D Neurite Segmentation: Flood-Filling Networks & '
                                                  'Affinity Graphs',
                                         'summary': 'Preventing catastrophic merge and split errors across '
                                                    'millimeter-long axons using 3D U-Nets, Flood-Filling '
                                                    'Networks, and proofreading.',
                                         'lab': True,
                                         'lessons': ['3D Anisotropic Convolutional U-Nets Predicting '
                                                     'Voxel-to-Voxel Membrane Affinity Graphs',
                                                     'Watershed Supervoxels and Agglomerative Graph '
                                                     'Clustering (Mutex Watershed / GASP)',
                                                     "Januszewski's Flood-Filling Networks (FFNs): Recurrent "
                                                     'Object-Centric 3D Mask Extension',
                                                     'Local Shape Descriptors (LSDs) for Auxiliary '
                                                     'Self-Supervised Morphology Pretraining',
                                                     'Automated Synapse Detection: Cleft Segmentation and '
                                                     'Presynaptic T-Bar/Vesicle to Postsynaptic Partner '
                                                     'Assignment',
                                                     'Collaborative Proofreading Ecosystems (FlyWire / '
                                                     'Neuroglancer) andExpected Run-Length (ERL) Metrics'],
                                         'sim': 'nn_playground'},
                                        {'id': 'invertebrate_connectomes',
                                         'title': 'Complete Model Connectomes: C. elegans, Larval & Adult '
                                                  'Drosophila (FlyWire)',
                                         'summary': 'Analyzing the 302-neuron C. elegans graph and the '
                                                    '139,255-neuron adult Drosophila whole-brain connectome.',
                                         'lab': True,
                                         'lessons': ["White's 302-Neuron C. elegans Connectome: "
                                                     'Sensory-to-Motor Pathways and Neuropeptide Wireless '
                                                     'Networks',
                                                     'The Drosophila Hemibrain and Full Adult Fly Brain '
                                                     '(FlyWire): 139,255 Neurons and 50 Million Synapses',
                                                     'Cell-Type Census and Bilateral Symmetry Homology '
                                                     'Matching Across Left/Right Hemispheres',
                                                     'The Central Complex Navigation Circuit: Ring Neurons, '
                                                     'E-PG Compass, and P-EN Angular Velocity',
                                                     'Neurotransmitter Prediction from Electron Micrographs '
                                                     'via Deep Synaptic Cleft Classification (Eckstein)',
                                                     'Simulating Whole-Brain Drosophila Sensorimotor '
                                                     'Reflexes Directly from the Connectome Graph (Shiu)'],
                                         'sim': 'graph_theory'},
                                        {'id': 'cortical_connectome_motifs',
                                         'title': "Mammalian Cortical Connectomics, Peters' Rule & "
                                                  'Non-Random Motifs',
                                         'summary': 'Testing whether axonal-dendritic overlap predicts '
                                                    "connectivity (Peters' rule), lognormal synaptic "
                                                    'weights, and reciprocal triplet motifs.',
                                         'lab': True,
                                         'lessons': ["Testing Peters' Rule: Geometric Axo-Dendritic "
                                                     'Proximity vs. Cell-Type-Specific Partner Selection',
                                                     'Song et al. Over-Representation of Reciprocal Pairs '
                                                     'and Three-Neuron Motifs in Layer 5',
                                                     'Lognormal Distribution of Spine Head Volumes and '
                                                     'Synaptic Weights: A Skeleton of Strong Connections',
                                                     'Correlating Dual-Head Spine Pairs to Measure Precision '
                                                     'of Hebbian Plasticity in Vivo',
                                                     'Functional Connectomics (MICrONS): Co-Registering In '
                                                     'Vivo Two-Photon Calcium Tuning with EM Wiring',
                                                     'Like-to-Like Connectivity of Orientation-Tuned V1 '
                                                     'Pyramidal Neurons'],
                                         'sim': 'graph_theory'},
                                        {'id': 'macroscale_dwi_tractography',
                                         'title': 'Macroscale Human Connectomics: Diffusion MRI, '
                                                  'Tractography & Graph Theory',
                                         'summary': 'Diffusion tensor/kurtosis imaging, spherical '
                                                    'deconvolution of crossing fibers, probabilistic '
                                                    'tractography, and rich-club hubs.',
                                         'lab': True,
                                         'lessons': ['Brownian Water Diffusion in White Matter and the '
                                                     'Stejskal–Tanner Pulsed-Gradient Spin-Echo Sequence',
                                                     'Diffusion Tensor Imaging (DTI), Fractional Anisotropy '
                                                     '(FA), and the Crossing-Fiber Limitation',
                                                     'Constrained Spherical Deconvolution (CSD) and Fiber '
                                                     'Orientation Distributions (FODs)',
                                                     'Deterministic vs. Probabilistic Streamline '
                                                     'Tractography and SIFT2 Quantitative Filtering',
                                                     'Small-World Topology (Watts–Strogatz), Modularity, and '
                                                     'Van den Heuvel Rich-Club Hubs',
                                                     'Network Control Theory on Structural Connectomes: '
                                                     'Modal and Average Controllability'],
                                         'sim': 'graph_theory'}]},
                           {'id': 'neuro_240',
                            'code': 'NEURO 240',
                            'title': 'Spiking Neural Networks (SNNs), Surrogate Gradients & Neuromorphic '
                                     'Learning',
                            'level': 200,
                            'credits': 4,
                            'description': 'Train deep spiking neural networks using surrogate gradient '
                                           'backpropagation through time, e-prop eligibility traces, and '
                                           'latency/rate coding benchmarks.',
                            'prerequisites': ['neuro_210'],
                            'modules': [{'id': 'snn_discrete_dynamics',
                                         'title': 'Discrete-Time Spiking Neuron Formulations for Deep '
                                                  'Learning',
                                         'summary': 'Unrolling leaky integrate-and-fire and adaptive spiking '
                                                    'neurons as recurrent computational graphs with binary '
                                                    'Heaviside outputs.',
                                         'lab': True,
                                         'lessons': ['Euler Discretization of Leaky Integrate-and-Fire (LIF) '
                                                     'State Update Equations',
                                                     'Hard Reset vs. Soft Subtractive Reset and Recurrent '
                                                     'Synaptic Current Filtering',
                                                     'Adaptive Threshold Spiking Neurons (ALIF) for Long '
                                                     'Short-Term Temporal Memory',
                                                     'Parametric LIF (PLIF): Learning Layer-Wise and '
                                                     'Neuron-Wise Membrane Time Constants',
                                                     'Encoding Continuous Inputs into Spikes: Poisson Rate, '
                                                     'Delta-Modulation, and Direct Current First-Layer',
                                                     'Decoding Output Layer Spikes: Membrane Potential '
                                                     'Readout, Spike Count, and Time-to-First-Spike'],
                                         'sim': 'nn_playground'},
                                        {'id': 'surrogate_gradient_bptt',
                                         'title': 'Surrogate Gradient Descent & Backpropagation Through Time '
                                                  'in SNNs',
                                         'summary': 'Overcoming the dead-neuron zero derivative of the '
                                                    'Heaviside step function using smooth surrogate '
                                                    'derivatives (Neftci/Zenke).',
                                         'lab': True,
                                         'lessons': ['The Non-Differentiability Problem: Heaviside Step '
                                                     'Derivative is Zero Everywhere Except Threshold',
                                                     'Surrogate Gradient Descent: Forward Binary Spikes with '
                                                     'Smooth Backward Pseudo-Derivatives',
                                                     'Comparing SuperSpike (Fast Sigmoid), Piece-Wise '
                                                     'Linear, and Multi-Gaussian Surrogate Shapes',
                                                     'Spatiotemporal Backpropagation Through Time (STBP) '
                                                     'Across Time Steps and Layers',
                                                     'Exact Event-Based Gradients (EventProp) Using Adjoint '
                                                     'Sensitivity Jumps at Spike Times',
                                                     'Batch/Layer Normalization in Spiking Networks: '
                                                     'Threshold-Dependent Batch Norm (tdBN)'],
                                         'sim': 'gradient_descent'},
                                        {'id': 'ann_to_snn_conversion',
                                         'title': 'ANN-to-SNN Conversion, Calibration & Ultra-Low-Latency '
                                                  'Spiking',
                                         'summary': 'Mapping ReLU activations to firing rates, '
                                                    'weight-threshold balancing, QCFS quantization, and '
                                                    '2-to-4 timestep inference.',
                                         'lab': True,
                                         'lessons': ['Equivalence Between ReLU Activations and '
                                                     'Integrate-and-Fire Firing Rates (Rueckauer/Diehl)',
                                                     'Data-Based Weight Normalization and Robust '
                                                     '99.9th-Percentile Threshold Balancing',
                                                     'Eliminating Conversion Errors: Residual Membrane '
                                                     'Potential Unevenness and Soft-Reset Compensation',
                                                     'Quantization-Clip-Floor-Shift (QCFS): Bridging '
                                                     'Quantized ANNs and Ultra-Low-Timestep SNNs',
                                                     'Spiking ResNets (SEW-ResNet) and Spiking '
                                                     'Self-Attention Transformers (Spikformer)',
                                                     'Synaptic Operations (SOPs) Counting and Energy '
                                                     'Estimation (0.9 pJ per Accumulate vs. 4.6 pJ MAC)'],
                                         'sim': 'nn_playground'},
                                        {'id': 'online_local_eprop',
                                         'title': 'Biologically Plausible Online Learning: e-prop,OSTL & '
                                                  'Three-Factor Rules',
                                         'summary': 'Replacing O(T) memory BPTT with forward-in-time local '
                                                    'eligibility traces (Bellec e-prop) for on-chip '
                                                    'learning.',
                                         'lab': True,
                                         'lessons': ['Why Standard Backpropagation Through Time (BPTT) '
                                                     'Violates Biological Causality and Memory Bounds',
                                                     'Factorizing the BPTT Gradient into Local '
                                                     'Presynaptic/Postsynaptic Eligibility Traces and '
                                                     'Learning Signals',
                                                     "Bellec's e-prop in Recurrent LIF and ALIF Networks: "
                                                     'Matching BPTT Without Storing History',
                                                     'Online Spatio-Temporal Learning (OSTL) and Real-Time '
                                                     'Recurrent Learning (RTRL) Approximations',
                                                     'Broadcast Alignment and Random Feedback Weights '
                                                     '(Lillicrap/Nøkland) for Local Error Projection',
                                                     'Firing-Rate Regularization: Maintaining Sparse 1–10 Hz '
                                                     'Cortical-Like Activity During Training'],
                                         'sim': 'gradient_descent'},
                                        {'id': 'neuromorphic_benchmarks',
                                         'title': 'Neuromorphic Datasets, Event Audio/Vision & SNN Software '
                                                  'Frameworks',
                                         'summary': 'Benchmarking SNNs on DVS Gesture, N-Caltech101, and '
                                                    'Spiking Heidelberg Digits (SHD) using snnTorch, '
                                                    'SpikingJelly, and Norse.',
                                         'lab': True,
                                         'lessons': ['Static-Image-to-Spike Anti-Patterns vs. True Temporal '
                                                     'Neuromorphic Benchmarks (N-MNIST vs. DVS128)',
                                                     'Spiking Heidelberg Digits (SHD) and Spiking Speech '
                                                     'Commands (SSC): Cochlear Bushy-Cell Spike Trains',
                                                     'Processing Event-Camera Streams with Spatiotemporal 3D '
                                                     'Spiking Convolutions',
                                                     'Software Frameworks: snnTorch, SpikingJelly CuPy '
                                                     'Kernels, Lava, and JAX-Based Spiking Libraries',
                                                     'State-Space Models (S4/Mamba) vs. Spiking '
                                                     'Resonant-and-Fire Neurons for Long-Range Sequences',
                                                     'Hybrid Event-Frame Fusion Architectures for High-Speed '
                                                     'Robotics'],
                                         'sim': 'nn_playground'}]},
                           {'id': 'neuro_340',
                            'code': 'NEURO 340',
                            'title': 'Biologically Plausible Credit Assignment, Predictive Coding & Neuro-AI',
                            'level': 300,
                            'credits': 4,
                            'description': 'Weight transport solutions, Equilibrium Propagation, predictive '
                                           'coding networks, dendritic credit assignment, and continual '
                                           'learning without catastrophic forgetting.',
                            'prerequisites': ['neuro_240', 'neuro_310'],
                            'modules': [{'id': 'weight_transport_feedback',
                                         'title': 'The Weight Transport Problem, Feedback Alignment & Target '
                                                  'Propagation',
                                         'summary': "Grossberg's weight transport critique of backprop, "
                                                    'Lillicrap feedback alignment, Kolen–Pollack weight '
                                                    'mirrors, and difference target propagation.',
                                         'lab': True,
                                         'lessons': ['Why Biological Cortical Feedback Projections Cannot '
                                                     'Copy Transpose Forward Weights (W^T)',
                                                     "Lillicrap's Feedback Alignment (FA): How Forward "
                                                     'Weights Rotate to Align with Random Feedback B',
                                                     'Direct Feedback Alignment (DFA) and Scaling Limits on '
                                                     'Deep Convolutional Architectures',
                                                     'Kolen–Pollack Weight Decay Symmetry and Akrout Weight '
                                                     'Mirrors Using Noise Perturbations',
                                                     'Lee & Bengio Difference Target Propagation (DTP): '
                                                     'Layer-Wise Autoencoding Inverse Mappings',
                                                     "Hinton's Forward-Forward (FF) Algorithm: Positive and "
                                                     'Negative Phase Goodness Optimization'],
                                         'sim': 'nn_playground'},
                                        {'id': 'energy_equilibrium_prop',
                                         'title': 'Energy-Based Networks, Contrastive Hebbian & Equilibrium '
                                                  'Propagation',
                                         'summary': 'Scellier–Bengio Equilibrium Propagation, continuous '
                                                    'Hopfield networks, and nudging steady-state dynamics '
                                                    'toward targets.',
                                         'lab': True,
                                         'lessons': ["Continuous Hopfield Energy Functions and Movellan's "
                                                     'Contrastive Hebbian Learning (CHL)',
                                                     'Scellier & Bengio Equilibrium Propagation: Free Phase '
                                                     'Relaxation and Weakly Clamped Nudging',
                                                     'Theorem: Infinitesimal Nudging Gradient Equals '
                                                     'Backpropagation Through the Equilibrium Fixed Point',
                                                     'Holomorphic Equilibrium Propagation for Finite-Nudge '
                                                     'Exact Gradients in Complex Networks',
                                                     'Mapping Predictive Coding Free-Energy Minimization '
                                                     'onto Backpropagation (Whittington & Bogacz)',
                                                     'Physical Realization of Equilibrium Propagation on '
                                                     'Analog Resistive Crossbar Arrays'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'dendritic_credit_assignment',
                                         'title': 'Sacramento–Senn Dendritic Microcircuits & '
                                                  'Burst-Multiplexed Learning',
                                         'summary': 'How apical dendrites segregate top-down error signals '
                                                    'from basal sensory feedforward streams without separate '
                                                    'phases.',
                                         'lab': True,
                                         'lessons': ['The Two-Phase Problem: How the Brain Computes Forward '
                                                     'Inference and Error Backprop Simultaneously',
                                                     'Sacramento, Ponte Costa, Bengio & Senn: Apical '
                                                     'Dendritic Prediction Errors Guided by SST/VIP '
                                                     'Interneurons',
                                                     'Payeur, Guerguiev, Zenke, Richards & Naud: '
                                                     'Multiplexing Feedforward Events and Feedback Bursts',
                                                     'High-Frequency Somatic Bursting as an Apical-Gated '
                                                     'Credit Assignment Signal',
                                                     'Short-Term Synaptic Facilitation vs. Depression as '
                                                     'Frequency-Selective Multiplexing Filters',
                                                     'Experimental Signatures of Apical Error Signals in '
                                                     'Behaving Mice During Perceptual Learning'],
                                         'sim': 'nn_playground'},
                                        {'id': 'representations_neuro_vs_ai',
                                         'title': 'Comparing Deep Neural Networks to Brains: Brain-Score, '
                                                  'RSA & CKA',
                                         'summary': 'Yamins–DiCarlo goal-driven sensory cortex models, '
                                                    'Brain-Score benchmarks, Representational Similarity '
                                                    'Analysis, and adversarial divergence.',
                                         'lab': True,
                                         'lessons': ['Yamins & DiCarlo Goal-Driven Approach: Why '
                                                     'Task-Optimized CNNs Predict V4 and IT Neurons',
                                                     'Linear Encoding Models: Ridge Regression from DNN '
                                                     'Layer Activations to Single-Unit Firing Rates',
                                                     "Kriegeskorte's Representational Similarity Analysis "
                                                     '(RSA) and Representational Dissimilarity Matrices',
                                                     "Kornblith's Centered Kernel Alignment (CKA) and "
                                                     "Williams's Generalized Shape Metrics",
                                                     'The Brain-Score Benchmark Suite and Where Current '
                                                     'Vision/Language Models Diverge from Primates',
                                                     'Stringer et al. 1/n^(1 + 2/d) Power-Law Eigenspectrum '
                                                     'of Smooth Cortical Population Codes'],
                                         'sim': 'regression_fit'},
                                        {'id': 'continual_learning_consolidation',
                                         'title': 'Continual Learning, Synaptic Intelligence & Replay '
                                                  'Consolidation',
                                         'summary': 'Solving catastrophic forgetting via metaplastic cascade '
                                                    'synapses (Fusi), Elastic Weight Consolidation, and '
                                                    'generative hippocampal replay.',
                                         'lab': True,
                                         'lessons': ['The Stability-Plasticity Dilemma: Why Bounded Binary '
                                                     'Synapses Forget Exponentially Fast',
                                                     'Fusi, Drew & Abbott Cascade Model of Metaplasticity: '
                                                     'Power-Law Memory Lifetimes',
                                                     "Kirkpatrick's Elastic Weight Consolidation (EWC) and "
                                                     "Zenke's Synaptic Intelligence (SI)",
                                                     'Complementary Learning Systems '
                                                     "(McClelland–McNaughton–O'Reilly): Fast Hippocampus + "
                                                     'Slow Neocortex',
                                                     'Generative Replay and Wake-Sleep Consolidation in '
                                                     'Variational and Diffusion World Models',
                                                     'Context-Dependent Gating and Neuromodulatory Task '
                                                     'Subspaces for Interference-Free Continual Learning'],
                                         'sim': 'gradient_descent'}]},
                           {'id': 'neuro_540',
                            'code': 'NEURO 540',
                            'title': 'Neuromorphic Silicon, Subthreshold Analog VLSI & In-Memory Computing',
                            'level': 500,
                            'credits': 4,
                            'description': "Mead's subthreshold MOSFET physics, Address-Event Representation "
                                           '(AER) NoC routing, digital neuromorphic architectures (Loihi 2, '
                                           'TrueNorth, SpiNNaker2), and memristive crossbars.',
                            'prerequisites': ['neuro_240', 'neuro_340'],
                            'modules': [{'id': 'subthreshold_analog_vlsi',
                                         'title': 'Carver Mead Subthreshold CMOS Physics, Silicon Neurons & '
                                                  'Synapses',
                                         'summary': 'Exponential drain current in weak inversion, '
                                                    'transconductance amplifiers, differential-pair '
                                                    'log-domain filters, and silicon DPI neurons.',
                                         'lab': True,
                                         'lessons': ["Carver Mead's Vision: Exploiting Boltzmann Exponential "
                                                     'Electron Diffusion in Weak-Inversion MOSFETs',
                                                     'Subthreshold Drain Current Equation, Thermal Voltage '
                                                     '(U_T = kT/q), and Slope Factor kappa',
                                                     'Operational Transconductance Amplifiers (OTAs) and '
                                                     'Winner-Take-All (Lazzaro) Competitive Circuits',
                                                     'Differential-Pair Integrator (DPI) Silicon Synapses '
                                                     'and Log-Domain Temporal Filtering',
                                                     "Indiveri's Adaptive Exponential Integrate-and-Fire "
                                                     'Silicon Neuron Circuit in CMOS',
                                                     "Device Mismatch (Pelgrom's Law): Turning Transistor "
                                                     'Variability into Useful Population Diversity'],
                                         'sim': 'electric_field'},
                                        {'id': 'aer_noc_routing',
                                         'title': 'Asynchronous Circuits & Address-Event Representation '
                                                  '(AER) Networks',
                                         'summary': 'Clockless four-phase handshakes, arbiter trees, '
                                                    'multicast mesh routing tables, and packetizing spikes '
                                                    'across multi-core neuromorphic chips.',
                                         'lab': True,
                                         'lessons': ['Why Point-to-Point 3D Axonal Fan-Out (10,000 '
                                                     'Synapses/Neuron) Cannot Be Wired Directly in 2D '
                                                     'Silicon',
                                                     'Time-Multiplexed Virtual Wiring via High-Speed Digital '
                                                     'Buses (Speedup Factor 10^6 vs. Biology)',
                                                     'Quasi-Delay-Insensitive (QDI) Asynchronous Logic and '
                                                     'Four-Phase Req/Ack Handshaking',
                                                     'Address-Event Representation (AER) Arbitration Trees '
                                                     'and Collision Resolution',
                                                     'Source-Based vs. Destination-Based Multicast Mesh '
                                                     'Network-on-Chip (NoC) Routing',
                                                     'Hierarchical AER Routing in Multi-Chip Boards and '
                                                     'SpiNNaker Packet-Switched Torus Networks'],
                                         'sim': 'graph_theory'},
                                        {'id': 'digital_neuromorphic_chips',
                                         'title': 'Digital Neuromorphic Architectures: Loihi 2, TrueNorth, '
                                                  'BrainScaleS & Tianjic',
                                         'summary': 'Comparing asynchronous microcode neurocores (Intel '
                                                    'Loihi 2), accelerated mixed-signal wafers '
                                                    '(BrainScaleS-2), and ARM-based SpiNNaker2.',
                                         'lab': True,
                                         'lessons': ['IBM TrueNorth: 1 Million Neurons, Deterministic '
                                                     'Tick-Based Synchronization, and Corelet Programming',
                                                     'Intel Loihi 2: Programmable Microcode Neuron Models, '
                                                     'Graded Spikes, and Three-Factor Learning Engine',
                                                     'SpiNNaker 2: Globallly Asynchronous Locally '
                                                     'Synchronous (GALS) ARM Cores with Exponential '
                                                     'Accelerators',
                                                     'BrainScaleS-2: Mixed-Signal Analog Emulation Running '
                                                     'at 1000x Biological Real-Time Speedup',
                                                     'Partitioning and Mapping Spiking Graphs onto Hardware '
                                                     'Core Constraints (NP-Hard Graph Partitioning)',
                                                     'Hardware-in-the-Loop Benchmarks: Energy-Delay Product '
                                                     '(EDP) vs. Edge GPUs (Jetson)'],
                                         'sim': 'state_machine'},
                                        {'id': 'memristors_in_memory_compute',
                                         'title': 'Memristive Crossbars, RRAM/PCM Physics & Analog In-Memory '
                                                  'Compute',
                                         'summary': "Ohm's and Kirchhoff's laws for O(1) matrix-vector "
                                                    'multiplication, filamentary RRAM, phase-change '
                                                    'crystallization, and non-ideality mitigation.',
                                         'lab': True,
                                         'lessons': ['Breaking the Von Neumann Memory Wall: Performing I_j = '
                                                     'sum_i V_i G_ij Directly in Memory Arrays',
                                                     'Resistive RAM (RRAM) Conductive Filament Physics and '
                                                     'Phase-Change Memory (PCM) Chalcogenide Glass',
                                                     'Ferroelectric FETs (FeFETs), Magnetic Tunnel Junctions '
                                                     '(MRAM), and Electrochemical RAM (ECRAM)',
                                                     'Hardware Non-Idealities: Conductance Drift, Read/Write '
                                                     'Stochasticity, IR Voltage Drop, and Sneak Paths',
                                                     '1T1R Access Transistor Arrays and Hardware-Aware '
                                                     'Noise-Injected Training',
                                                     'In-Situ STDP Learning via Overlapping Pre- and '
                                                     'Post-Synaptic Voltage Pulse Waveforms'],
                                         'sim': 'electric_field'},
                                        {'id': 'embodied_neuromorphic_systems',
                                         'title': 'Closed-Loop Neuromorphic Robotics, Olfactory Chips & '
                                                  'Brain Co-Processors',
                                         'summary': 'End-to-end event-driven perception-action loops on '
                                                    'drones/hands, neuromorphic electronic noses, and '
                                                    'ultra-low-power cortical co-processors.',
                                         'lab': True,
                                         'lessons': ['Connecting DVS Event Cameras Directly to Loihi/Speck '
                                                     'Neuromorphic Processors for Microsecond Loops',
                                                     'Event-Driven Optical Flow and Time-to-Contact '
                                                     'Divergence Control on Nano-Quadrotors',
                                                     'Neuromorphic Tactile Skins and Reflexive '
                                                     'Slip-Prevention Grasp Control on Prosthetic Hands',
                                                     'Imam & Cleland Neuromorphic Olfactory Bulb: One-Shot '
                                                     'Odor Learning Under Strong Clutter',
                                                     'Always-On Sub-Milliwatt Spike-Sorting and '
                                                     'Seizure-Detection ASICs for Cortical Implants',
                                                     'Closing the Loop with Biology: Hybrid Bio-Silicon '
                                                     'Synaptic Clamp Networks'],
                                         'sim': 'pid_controller'}]}]}]}
