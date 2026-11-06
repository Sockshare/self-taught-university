# Game Theory, Mechanism Design & Quantitative Finance curriculum catalog for Self-Taught.

DOMAIN = {'id': 'game_theory',
 'name': 'Game Theory, Mechanism Design & Quantitative Finance',
 'icon': '📈',
 'color': '#eab308',
 'tagline': 'Strategic equilibria, incentive-compatible market design, continuous-time stochastic calculus, '
            'and algorithmic market microstructure.',
 'description': 'A rigorous mathematical and computational curriculum spanning non-cooperative and Bayesian '
                'game theory, auction theory and mechanism design, continuous-time stochastic calculus and '
                'derivatives pricing, and high-frequency market microstructure and quantitative strategy.',
 'subjects': [{'id': 'noncoop_bayesian',
               'name': 'Non-Cooperative & Bayesian Game Theory',
               'icon': '♟️',
               'description': 'Von Neumann–Morgenstern expected utility, Nash and correlated equilibria, '
                              'sequential imperfect-information games, Harsanyi Bayesian games, evolutionary '
                              'dynamics, and CFR.',
               'courses': [{'id': 'gt_110',
                            'code': 'GT 110',
                            'title': 'Strategic-Form Games, Nash Equilibrium & Expected Utility',
                            'level': 100,
                            'credits': 4,
                            'description': 'Formalize rational decision-making under strategic '
                                           'interdependence: dominance solvability, mixed-strategy Nash '
                                           'equilibria, zero-sum minimax duality, and correlated equilibria.',
                            'prerequisites': [],
                            'modules': [{'id': 'vnm_utility_dominance',
                                         'title': 'Von Neumann–Morgenstern Utility & Iterated Dominance',
                                         'summary': 'Axioms of expected utility over lotteries, risk '
                                                    'aversion, common knowledge of rationality, and iterated '
                                                    'elimination of strictly dominated strategies.',
                                         'lab': True,
                                         'lessons': ['Preference Relations, Completeness, Transitivity, and '
                                                     'Independence Axiom over Lotteries',
                                                     'Von Neumann–Morgenstern Expected Utility '
                                                     'Representation Theorem and Arrow–Pratt Risk Aversion',
                                                     'Normal-Form (Strategic-Form) Games: Players, Action '
                                                     'Spaces, and Payoff Tensors',
                                                     'Strict vs. Weak Dominance and Path-Dependence of '
                                                     'Weakly Dominated Strategy Elimination',
                                                     'Iterated Elimination of Strictly Dominated Strategies '
                                                     '(IESDS) and Rationalizability (Bernheim–Pearce)',
                                                     'Common Knowledge of Rationality and the p-Beauty '
                                                     'Contest (Keynesian Guessing Game)',
                                                     'Quantitative Case Study & Synthesis: Von '
                                                     'Neumann–Morgenstern Utility & Iterated Dominance'],
                                         'sim': 'prisoners_dilemma'},
                                        {'id': 'pure_mixed_nash',
                                         'title': "Pure & Mixed-Strategy Nash Equilibrium and Kakutani's "
                                                  'Fixed Point',
                                         'summary': 'Best-response correspondences, indifference principle '
                                                    'for mixed strategies, Brouwer/Kakutani fixed-point '
                                                    "proofs of Nash's theorem, and equilibrium selection.",
                                         'lab': True,
                                         'lessons': ['Best-Response Correspondences and Pure-Strategy Nash '
                                                     'Equilibrium in Coordination and Anti-Coordination '
                                                     'Games',
                                                     "Classic Archetypes: Prisoner's Dilemma, Stag Hunt, "
                                                     'Hawk–Dove (Chicken), and Battle of the Sexes',
                                                     'Mixed Strategies, Support Indifference Conditions, and '
                                                     "Oddness of Generic Equilibria (Wilson's Theorem)",
                                                     "Brouwer's Fixed-Point Theorem (Sperner's Lemma) and "
                                                     "Nash's 1950 Proof via Penalty Functions",
                                                     "Upper Hemicontinuity and Kakutani's Fixed-Point Proof "
                                                     'for Best-Response Correspondences',
                                                     'Payoff Dominance vs. Harsanyi–Selten Risk Dominance in '
                                                     'Equilibrium Selection',
                                                     'Quantitative Case Study & Synthesis: Pure & '
                                                     "Mixed-Strategy Nash Equilibrium and Kakutani's Fixed "
                                                     'Point'],
                                         'sim': 'prisoners_dilemma'},
                                        {'id': 'zero_sum_minimax_lp',
                                         'title': 'Two-Player Zero-Sum Games, Minimax Duality & Linear '
                                                  'Programming',
                                         'summary': "Von Neumann's minimax theorem, saddle points, reducing "
                                                    'zero-sum games to primal-dual linear programs, and '
                                                    'security strategies.',
                                         'lab': True,
                                         'lessons': ['Strictly Competitive Zero-Sum Games: Maximin and '
                                                     'Minimax Value Bounds',
                                                     "Von Neumann's Minimax Theorem via Separating "
                                                     'Hyperplane and LP Strong Duality',
                                                     'Formulating Two-Player Zero-Sum Games as Primal-Dual '
                                                     'Linear Programs in Python (SciPy/CVXPY)',
                                                     'Symmetric Zero-Sum Games (Rock-Paper-Scissors '
                                                     'Variants) and Interior Mixed Supports',
                                                     'Colonel Blotto Resource Allocation Games and '
                                                     'Continuous Marginals',
                                                     'Hide-and-Seek, Inspection Games, and Adversarial '
                                                     'Patrol Routing on Graphs',
                                                     'Quantitative Case Study & Synthesis: Two-Player '
                                                     'Zero-Sum Games, Minimax Duality & Linear Programming'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'correlated_coarse_regret',
                                         'title': "Aumann's Correlated Equilibrium, No-Regret Learning & "
                                                  'PPAD Complexity',
                                         'summary': 'Traffic-light correlation devices, internal vs. '
                                                    'external regret minimization, Hedge/Multiplicative '
                                                    'Weights, and why finding Nash is PPAD-complete.',
                                         'lab': True,
                                         'lessons': ["Aumann's Correlated Equilibrium (CE): Public/Private "
                                                     'Recommendations and Linear Incentive Constraints',
                                                     'Coarse Correlated Equilibrium (CCE) and the Hierarchy: '
                                                     'Pure NE subset Mixed NE subset CE subset CCE',
                                                     'External Regret Minimization (Hannan Consistency): '
                                                     'Multiplicative Weights Update (MWU) Converges to CCE',
                                                     'Internal (Swap) Regret Minimization (Foster–Vohra / '
                                                     'Hart–Mas-Colell) Converges to Correlated Equilibrium',
                                                     'The Lemke–Howson Complementary Pivoting Algorithm for '
                                                     'Bimatrix Games and Exponential Worst Cases',
                                                     'Daskalakis–Goldberg–Papadimitriou Theorem: Computing a '
                                                     'Mixed Nash Equilibrium is PPAD-Complete',
                                                     "Quantitative Case Study & Synthesis: Aumann's "
                                                     'Correlated Equilibrium, No-Regret Learning & PPAD '
                                                     'Complexity'],
                                         'sim': 'bandit'},
                                        {'id': 'potential_congestion_poa',
                                         'title': 'Potential Games, Congestion Routing & The Price of '
                                                  'Anarchy',
                                         'summary': 'Monderer–Shapley potential functions, Rosenthal '
                                                    "congestion games, Braess's paradox, and "
                                                    'Roughgarden–Tardos Price of Anarchy bounds.',
                                         'lab': True,
                                         'lessons': ['Exact, Weighted, and Ordinal Potential Games (Monderer '
                                                     '& Shapley) and Pure-Strategy Convergence',
                                                     'Better-Response Dynamics as Coordinate Ascent on the '
                                                     'Exact Potential Function',
                                                     "Rosenthal's Congestion Games and Isomorphism with "
                                                     'Exact Potential Games',
                                                     'Wardrop Equilibrium in Non-Atomic Traffic Routing '
                                                     "Networks and Beckmann's Convex Program",
                                                     "Braess's Paradox: How Adding a Zero-Cost Road Degrades "
                                                     'Equilibrium Latency for All Drivers',
                                                     'Price of Anarchy (PoA) and Price of Stability: The 4/3 '
                                                     'Bound for Affine Congestion Games',
                                                     'Quantitative Case Study & Synthesis: Potential Games, '
                                                     'Congestion Routing & The Price of Anarchy'],
                                         'sim': 'graph_theory'}]},
                           {'id': 'gt_210',
                            'code': 'GT 210',
                            'title': 'Extensive-Form Games, Repeated Games & Reputation Dynamics',
                            'level': 200,
                            'credits': 4,
                            'description': 'Backward induction, subgame perfection, Rubinstein '
                                           'alternating-offer bargaining, Folk Theorems in infinitely '
                                           'repeated games, and evolutionary game dynamics.',
                            'prerequisites': ['gt_110'],
                            'modules': [{'id': 'extensive_form_spe',
                                         'title': 'Extensive-Form Trees, Subgame Perfect Equilibrium & '
                                                  'Commitment',
                                         'summary': "Information sets, Kuhn's theorem on behavioral "
                                                    "strategies, Zermelo's theorem, credible vs. "
                                                    'non-credible threats, and Stackelberg leadership.',
                                         'lab': True,
                                         'lessons': ['Game Trees, Histories, Terminal Nodes, and '
                                                     'Partitioning Nodes into Information Sets',
                                                     "Perfect Recall and Kuhn's Theorem: Equivalence of "
                                                     'Mixed and Behavioral Strategies',
                                                     "Zermelo's Backward Induction Theorem in Finite Games "
                                                     'of Perfect Information',
                                                     "Selten's Subgame Perfect Equilibrium (SPE): "
                                                     'Eliminating Non-Credible Threats in Entry Deterrence',
                                                     'Stackelberg First-Mover Advantage vs. Cournot '
                                                     'Simultaneous Quantity Competition',
                                                     'Time Inconsistency, Hyperbolic Discounting, and '
                                                     'Schelling Commitment Devices',
                                                     'Quantitative Case Study & Synthesis: Extensive-Form '
                                                     'Trees, Subgame Perfect Equilibrium & Commitment'],
                                         'sim': 'state_machine'},
                                        {'id': 'bargaining_coalitional',
                                         'title': 'Rubinstein Bargaining, Nash Bargaining Solution & '
                                                  'Cooperative Games',
                                         'summary': "Axiomatic Nash bargaining, Rubinstein's "
                                                    'infinite-horizon alternating offers, core stability, '
                                                    'and the Shapley value.',
                                         'lab': True,
                                         'lessons': ["Nash's Axiomatic Bargaining Problem: Pareto "
                                                     'Efficiency, Symmetry, Scale Invariance, and IIA',
                                                     'Maximizing the Asymmetric Nash Product with '
                                                     'Disagreement Threat Points',
                                                     "Rubinstein's Alternating-Offers Bargaining Game: "
                                                     'Patience (delta_1, delta_2) Determines the Split',
                                                     'Transferable Utility (TU) Cooperative Games, '
                                                     'Superadditivity, and the Core (Bondareva–Shapley)',
                                                     'The Shapley Value: Marginal Contributions, Axiomatic '
                                                     'Uniqueness, and SHAP Feature Attribution',
                                                     'Gale–Shapley Deferred Acceptance Algorithm: Stable '
                                                     'Matching in Two-Sided Markets',
                                                     'Quantitative Case Study & Synthesis: Rubinstein '
                                                     'Bargaining, Nash Bargaining Solution & Cooperative '
                                                     'Games'],
                                         'sim': 'prisoners_dilemma'},
                                        {'id': 'repeated_games_folk',
                                         'title': 'Infinitely Repeated Games, Trigger Strategies & The Folk '
                                                  'Theorems',
                                         'summary': "Discount factors, grim trigger, tit-for-tat, Abreu's "
                                                    'optimal penal codes, and Fudenberg–Maskin Folk Theorem '
                                                    'with public/imperfect monitoring.',
                                         'lab': True,
                                         'lessons': ['Discounted Average Payoffs (1 - delta) in Infinitely '
                                                     'Repeated Games and Continuation Probabilities',
                                                     'One-Shot Deviation Principle for Subgame Perfection in '
                                                     'Infinite-Horizon Games',
                                                     'Grim Trigger, Tit-for-Tat, Contrite Tit-for-Tat, and '
                                                     'Win-Stay Lose-Shift (Pavlov) under Noise',
                                                     'Minmax Threat Points, Individually Rational Feasible '
                                                     'Payoff Sets, and the Nash Folk Theorem',
                                                     'Fudenberg–Maskin Subgame Perfect Folk Theorem and '
                                                     "Abreu's Simple Stick-and-Carrot Penal Codes",
                                                     'Imperfect Public Monitoring (Green–Porter Cartel Price '
                                                     'Wars) and Abreu–Pearce–Stacchetti Recursive Sets',
                                                     'Quantitative Case Study & Synthesis: Infinitely '
                                                     'Repeated Games, Trigger Strategies & The Folk '
                                                     'Theorems'],
                                         'sim': 'prisoners_dilemma'},
                                        {'id': 'evolutionary_game_dynamics',
                                         'title': 'Evolutionary Stability (ESS) & Replicator Differential '
                                                  'Equations',
                                         'summary': "Maynard Smith's ESS, Taylor–Jonker replicator ODEs, "
                                                    'permanent coexistence vs. heteroclinic cycles, and '
                                                    'Moran stochastic fixation.',
                                         'lab': True,
                                         'lessons': ['Maynard Smith & Price Evolutionarily Stable Strategy '
                                                     '(ESS): Invasion Barriers Against Mutants',
                                                     'Relationship Between ESS, Strict Nash Equilibrium, and '
                                                     'Local Asymptotic Stability',
                                                     'The Taylor–Jonker Replicator Equation: Connecting '
                                                     'Fitness Advantage to Simplex Phase Flows',
                                                     'Phase Portraits of 3x3 Rock-Paper-Scissors: Neutral '
                                                     'Centers, Spirals, and Heteroclinic Cycles',
                                                     'The Folk Theorem of Evolutionary Game Theory and '
                                                     'Shahshahani Riemannian Gradient Flows',
                                                     'Finite-Population Stochastic Games: The Moran Process, '
                                                     'Fixation Probabilities, and the 1/3 Law',
                                                     'Quantitative Case Study & Synthesis: Evolutionary '
                                                     'Stability (ESS) & Replicator Differential Equations'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'epistemic_trembling_refinements',
                                         'title': 'Trembling-Hand Perfection, Forward Induction & Epistemic '
                                                  'Logic',
                                         'summary': "Selten's trembling-hand perfect equilibrium, "
                                                    'Kreps–Wilson sequential equilibrium, forward induction '
                                                    "(burning money), and Aumann's agreement theorem.",
                                         'lab': True,
                                         'lessons': ['Weaknesses of Subgame Perfection off the Equilibrium '
                                                     'Path in Imperfect-Information Trees',
                                                     "Selten's Trembling-Hand Perfect Equilibrium and "
                                                     "Myerson's Proper Equilibrium",
                                                     'Kreps & Wilson Sequential Equilibrium: Consistent '
                                                     'Beliefs via Vanishing Tremble Sequences',
                                                     'Forward Induction, Kohlberg–Mertens Strategic '
                                                     'Stability, and Ben-Porath–Dekel Burning Money',
                                                     'Aumann Partition Structures of Knowledge and the Proof '
                                                     'That Common Knowledge Prohibits Agreeing to Disagree',
                                                     'Milgrom–Stokey No-Trade Theorem: Why Speculative Trade '
                                                     'Cannot Occur Purely on Private Information',
                                                     'Quantitative Case Study & Synthesis: Trembling-Hand '
                                                     'Perfection, Forward Induction & Epistemic Logic'],
                                         'sim': 'bayes_belief'}]},
                           {'id': 'gt_310',
                            'code': 'GT 310',
                            'title': 'Bayesian Games, Signaling, Cheap Talk & Information Design',
                            'level': 300,
                            'credits': 4,
                            'description': 'Harsanyi type spaces, Spence costly signaling, Intuitive '
                                           'Criterion, Crawford–Sobel cheap talk, Kamenica–Gentzkow Bayesian '
                                           'persuasion, and global games.',
                            'prerequisites': ['gt_210'],
                            'modules': [{'id': 'harsanyi_bayesian_games',
                                         'title': 'Harsanyi Type Spaces & Bayesian Nash Equilibrium',
                                         'summary': 'Transforming incomplete information into imperfect '
                                                    "information via Nature's move, interim expected "
                                                    'utility, and common priors.',
                                         'lab': True,
                                         'lessons': ["Harsanyi's 1967 Breakthrough: Modeling Private Payoff "
                                                     'Uncertainty via Type Spaces and Common Priors',
                                                     'Ex-Ante, Interim, and Ex-Post Expected Payoffs and '
                                                     'Bayesian Nash Equilibrium (BNE)',
                                                     'Cournot Duopoly Under Asymmetric Cost Information and '
                                                     'Jury Voting (Feddersen–Pesendorfer)',
                                                     'Purification Theorem (Harsanyi): Interpreting Mixed '
                                                     'Equilibria as Pure Equilibria of Perturbed Games',
                                                     'The Universal Type Space (Mertens–Zamir) and '
                                                     'Higher-Order Beliefs (Beliefs About Beliefs)',
                                                     "Rubinstein's Electronic Mail Game: Why Almost-Common "
                                                     'Knowledge Differs Radically from Common Knowledge',
                                                     'Quantitative Case Study & Synthesis: Harsanyi Type '
                                                     'Spaces & Bayesian Nash Equilibrium'],
                                         'sim': 'bayes_belief'},
                                        {'id': 'signaling_spence_intuitive',
                                         'title': 'Costly Signaling Games, Separating/Pooling PBE & '
                                                  'Cho–Kreps Criterion',
                                         'summary': "Spence's job-market signaling, single-crossing "
                                                    'conditions, separating vs. pooling Perfect Bayesian '
                                                    'Equilibria, and belief refinements.',
                                         'lab': True,
                                         'lessons': ['Perfect Bayesian Equilibrium (PBE): Sequential '
                                                     "Rationality and Bayes' Rule Where Applicable",
                                                     "Spence's Education Signaling Model: The "
                                                     'Single-Crossing (Spence–Mirrlees) Condition',
                                                     'Separating Equilibria, Pooling Equilibria, and '
                                                     'Semi-Separating (Hybrid) Equilibria',
                                                     'Plentiful Off-Path Beliefs and the Cho–Kreps Intuitive '
                                                     'Criterion Selecting the Riley Outcome',
                                                     'Divinity (D1/D2) and Universal Divinity Refinements in '
                                                     'Corporate Finance (Myers–Majluf)',
                                                     'Countersignaling (Feltovich–Harbaugh–To): Why High '
                                                     'TypesSometimes Avoid Flashy Signals',
                                                     'Quantitative Case Study & Synthesis: Costly Signaling '
                                                     'Games, Separating/Pooling PBE & Cho–Kreps Criterion'],
                                         'sim': 'bayes_belief'},
                                        {'id': 'cheap_talk_verifiable_disclosure',
                                         'title': 'Strategic Communication: Crawford–Sobel Cheap Talk & '
                                                  'Disclosure',
                                         'summary': 'Costless unverified communication under bias, '
                                                    'partitional interval equilibria, and Grossman–Milgrom '
                                                    'unravelling of verifiable information.',
                                         'lab': True,
                                         'lessons': ['Crawford & Sobel (1982) Strategic Information '
                                                     'Transmission: Quadratic Loss and Upward Bias b',
                                                     'Why Cheap Talk with Bias Cannot Be Fully Revealing: '
                                                     'Partitional Interval Equilibria',
                                                     'Comparative Statics of the Maximum Number of '
                                                     'Equilibrium Partitions N(b) as Bias Vanishes',
                                                     'Multi-Sender and Multi-Dimensional Cheap Talk '
                                                     '(Battaglini): Full Revelation via Cross-Checking',
                                                     'Verifiable Disclosure Games: Grossman–Milgrom '
                                                     "Unravelling Principle ('Good News Is Disclosed')",
                                                     "Dye's Uncertainty About Endowment: When Strategic "
                                                     'Silence Survives in Equilibrium',
                                                     'Quantitative Case Study & Synthesis: Strategic '
                                                     'Communication: Crawford–Sobel Cheap Talk & Disclosure'],
                                         'sim': 'bayes_belief'},
                                        {'id': 'bayesian_persuasion_kamenica',
                                         'title': 'Information Design, Kamenica–Gentzkow Bayesian Persuasion '
                                                  '& Concavification',
                                         'summary': 'Committing to an experiment/signal structure before '
                                                    'observing the state, splitting '
                                                    'posteriors,concavification, and Bergemann–Morris Bayes '
                                                    'correlated equilibrium.',
                                         'lab': True,
                                         'lessons': ['The Kamenica–Gentzkow Prosecutor-Judge Game: '
                                                     'Committing to a Blackwell Experiment pi(s | omega)',
                                                     'Bayes Plausibility Constraint: The Expected Posterior '
                                                     'Must Equal the Prior (Martingale Property)',
                                                     'Aumann–Maschler Cav(V) Concavification Geometry for '
                                                     'Finding Optimal Signal Structures',
                                                     "Blackwell's Informativeness Ordering of Experiments: "
                                                     'Garbling Matrices and Convex Value',
                                                     'Bergemann & Morris Bayes Correlated Equilibrium (BCE): '
                                                     'Information Design with Multiple Receivers',
                                                     'Algorithmic Information Design via Linear Programming '
                                                     'for Congestion and Platform Recommendations',
                                                     'Quantitative Case Study & Synthesis: Information '
                                                     'Design, Kamenica–Gentzkow Bayesian Persuasion & '
                                                     'Concavification'],
                                         'sim': 'function_plotter'},
                                        {'id': 'global_games_herding',
                                         'title': 'Global Games, Bank Runs & Informational Cascades '
                                                  '(Herding)',
                                         'summary': 'Carlsson–van Damme global games resolving equilibrium '
                                                    'multiplicity, Morris–Shin currency crises, and '
                                                    'Bikhchandani–Hirshleifer–Welch herding.',
                                         'lab': True,
                                         'lessons': ['Equilibrium Multiplicity in Coordination Games '
                                                     '(Diamond–Dybvig Bank Runs and Currency Speculation)',
                                                     'Carlsson & van Damme Global Games: Vanishing Private '
                                                     'Noise Selects the Risk-Dominant Threshold',
                                                     'Morris & Shin Self-Fulfilling Currency Attacks and the '
                                                     'Double Role of Public Information',
                                                     'Bikhchandani, Hirshleifer & Welch Informational '
                                                     'Cascades: Rational Herding on Wrong Actions',
                                                     'Smith & Sørensen Unbounded Private Signals Overturning '
                                                     'Fragile Herds',
                                                     'Social Learning on Networks (DeGroot vs. Bayesian '
                                                     'Learning) and the Wisdom of Crowds',
                                                     'Quantitative Case Study & Synthesis: Global Games, '
                                                     'Bank Runs & Informational Cascades (Herding)'],
                                         'sim': 'bayes_belief'}]},
                           {'id': 'gt_410',
                            'code': 'GT 410',
                            'title': 'Equilibrium Computation, Learning in Games & Extensive-Form Algorithms',
                            'level': 400,
                            'credits': 4,
                            'description': 'Compute Nash and correlated equilibria, understand why Nash is computationally hard, and '
                                           'implement no-regret learning dynamics and sequence-form methods for imperfect-information '
                                           'games. Directly prepares you for CFR and multi-agent reinforcement learning.',
                            'prerequisites': ['gt_310'],
                            'modules': [{'id': 'nash_complexity',
                                         'title': 'Computing Nash Equilibria and Its Complexity',
                                         'summary': 'Algorithms for bimatrix games and the PPAD-completeness result that explains their '
                                                    'limits.',
                                         'lab': True,
                                         'lessons': ['Support Enumeration for Bimatrix Games',
                                                     'The Lemke–Howson Algorithm and Complementary Pivoting',
                                                     'PPAD and the Complexity of Finding a Nash Equilibrium',
                                                     'Zero-Sum Games as Linear Programs and LP Duality',
                                                     'Solving Bimatrix Games with nashpy and SciPy linprog']},
                                        {'id': 'no_regret_learning',
                                         'title': 'No-Regret Learning and Online Optimization',
                                         'summary': 'Simple adaptive algorithms whose time-averaged play converges to equilibrium sets.',
                                         'lab': True,
                                         'lessons': ['External vs Swap Regret and Their Equilibrium Implications',
                                                     'Multiplicative Weights (Hedge) and Its O(√T log n) Regret Bound',
                                                     'Regret Matching and Hart–Mas-Colell Convergence to Correlated Equilibrium',
                                                     'Optimistic Mirror Descent and Last-Iterate Convergence',
                                                     'Implementing Hedge and Regret Matching in Rock–Paper–Scissors']},
                                        {'id': 'learning_dynamics',
                                         'title': 'Fictitious Play and Evolutionary Learning Dynamics',
                                         'summary': 'Belief-based and population dynamics, where they converge and where they cycle '
                                                    'chaotically.',
                                         'lab': True,
                                         'lessons': ["Fictitious Play and Robinson's Convergence Theorem for Zero-Sum Games",
                                                     "Shapley's Counterexample: Non-Convergent Cycling",
                                                     'Replicator Dynamics, ESS and Folk Theorem of Evolutionary Game Theory',
                                                     'Logit Response and Quantal Response Equilibrium',
                                                     'Simulating Replicator and Best-Response Dynamics in Python']},
                                        {'id': 'sequence_form',
                                         'title': 'Sequence-Form Representation of Extensive-Form Games',
                                         'summary': 'Exponentially smaller LP formulations that make imperfect-information games '
                                                    'tractable.',
                                         'lab': True,
                                         'lessons': ["Perfect Recall, Information Sets and Behavioral Strategies (Kuhn's Theorem)",
                                                     'Sequences, Realization Plans and the Sequence-Form Polytope',
                                                     'Solving Two-Player Zero-Sum Extensive-Form Games by Sequence-Form LP',
                                                     'Solving Kuhn Poker Exactly with a Sequence-Form LP']},
                                        {'id': 'correlated_equilibria',
                                         'title': 'Correlated and Coarse Correlated Equilibria',
                                         'summary': 'Equilibrium concepts that are both computationally easy and natural outcomes of '
                                                    'learning.',
                                         'lessons': ["Aumann's Correlated Equilibrium and the Traffic-Light Example",
                                                     'Computing Correlated Equilibria by Linear Programming',
                                                     'Coarse Correlated Equilibria and the Price of Anarchy for Learning Outcomes',
                                                     'Extensive-Form Correlated Equilibrium and Mediated Play']}]},
                           {'id': 'gt_510',
                            'code': 'GT 510',
                            'title': 'Computational Game Theory, Counterfactual Regret (CFR) & Multi-Agent '
                                     'RL',
                            'level': 500,
                            'credits': 4,
                            'description': 'Sequence-form linear programming, Counterfactual Regret '
                                           'Minimization (CFR+/Deep CFR) for imperfect-information games, '
                                           'Markov games, and mean-field games.',
                            'prerequisites': ['gt_310', 'gt_410'],
                            'modules': [{'id': 'sequence_form_cfr',
                                         'title': 'Sequence-Form LP & Counterfactual Regret Minimization '
                                                  '(CFR/CFR+)',
                                         'summary': 'Solving large imperfect-information extensive-form '
                                                    "games via von Stengel sequence form and Zinkevich's "
                                                    'Counterfactual Regret Minimization.',
                                         'lab': True,
                                         'lessons': ['Why Normal-Form Representation Explodes Exponentially '
                                                     'in the Number of Information Sets',
                                                     "Von Stengel's Sequence-Form Representation: "
                                                     'Realization Plans and Sparse Linear Constraints',
                                                     "Zinkevich's Counterfactual Regret Minimization (CFR): "
                                                     'Decomposing Overall Regret into Local Info-Sets',
                                                     'Regret Matching (Hart–Mas-Colell) at Each Information '
                                                     'Set and O(1/sqrt(T)) Convergence',
                                                     'CFR+, Linear CFR, and Discounted CFR (DCFR) for '
                                                     'Orders-of-Magnitude Faster Convergence',
                                                     'Monte Carlo CFR (MCCFR): External Sampling vs. Outcome '
                                                     'Sampling Variance-Speed Tradeoffs',
                                                     'Quantitative Case Study & Synthesis: Sequence-Form LP '
                                                     '& Counterfactual Regret Minimization (CFR/CFR+)'],
                                         'sim': 'bandit'},
                                        {'id': 'abstraction_subgame_solving',
                                         'title': 'Imperfect-Information Subgame Solving, ReBeL & '
                                                  'Poker/Stratego AI',
                                         'summary': 'Why naive subgame solving fails in '
                                                    'imperfect-information games, safe/maxmargin gadget '
                                                    'games (Libratus/Pluribus), and recursive belief-based '
                                                    'learning.',
                                         'lab': True,
                                         'lessons': ["Information Abstraction (Earth Mover's Distance "
                                                     'Bucketing) and Action Abstraction Translation '
                                                     '(Pseudo-Harmonic)',
                                                     'Why Naive Subgame Solving Breaks in Imperfect '
                                                     'Information: Opponent Reach-Probability Dependence',
                                                     'Burch–Moravčík– Schmid Safe Subgame Solving: Opt-Out '
                                                     'Gadget Games with Alternative Values',
                                                     'Depth-Limited Solving in Pluribus and ReBeL (Public '
                                                     'Belief States as Continuous-State MDPs)',
                                                     'Deep CFR and Regularized Nash Dynamics (R-NaD) Used in '
                                                     "DeepMind's Stratego (DeepNash)",
                                                     'Exploitability Metrics: Best-Response Oracle '
                                                     'Computation and Local Best Response (LBR)',
                                                     'Quantitative Case Study & Synthesis: '
                                                     'Imperfect-Information Subgame Solving, ReBeL & '
                                                     'Poker/Stratego AI'],
                                         'sim': 'agent_sim'},
                                        {'id': 'markov_games_marl',
                                         'title': 'Stochastic Markov Games, Policy-Space Response Oracles & '
                                                  'MARL',
                                         'summary': 'Shapley stochastic games, non-stationarity in '
                                                    'multi-agent RL, Policy-Space Response Oracles (PSRO), '
                                                    'and cooperative-competitive diplomacy.',
                                         'lab': True,
                                         'lessons': ["Shapley's Stochastic (Markov) Games and Markov Perfect "
                                                     'Equilibrium (MPE)',
                                                     'Non-Stationarity Pathologies of Independent Q-Learning '
                                                     'and Rotational Policy Cycling',
                                                     'Centralized Training with Decentralized Execution '
                                                     '(CTDE): QMIX Monotonic Value Factorization',
                                                     "Lanctot's Policy-Space Response Oracles (PSRO): "
                                                     'Generalizing Double Oracle and Fictitious Play',
                                                     'Alpha-Rank Evolutionary Meta-Game Evaluation on '
                                                     'Non-Transitive Strategy Landscapes',
                                                     'piKL Regularized Search + Strategic Language '
                                                     'Negotiation in No-Press and Full-Press Diplomacy '
                                                     '(Cicero)',
                                                     'Quantitative Case Study & Synthesis: Stochastic Markov '
                                                     'Games, Policy-Space Response Oracles & MARL'],
                                         'sim': 'gridworld_rl'},
                                        {'id': 'mean_field_games',
                                         'title': 'Mean-Field Games (Lasry–Lions / Caines): Coupled HJB and '
                                                  'Fokker–Planck PDEs',
                                         'summary': 'Scaling N-player differential games to continuum '
                                                    'populations via backward Hamilton–Jacobi–Bellman and '
                                                    'forward Kolmogorov–Fokker–Planck equations.',
                                         'lab': True,
                                         'lessons': ['From N-Player Symmetric Differential Games to the '
                                                     'Continuum Mean-Field Limit (N -> infinity)',
                                                     'Backward Hamilton–Jacobi–Bellman (HJB) Equation for '
                                                     "the Representative Agent's Optimal Control",
                                                     'Forward Kolmogorov–Fokker–Planck (KFP) Equation for '
                                                     'Population Measure Evolution',
                                                     'The Lasry–Lions Monotonicity Condition (Crowd '
                                                     'Aversion) for Uniqueness of Mean-Field Equilibria',
                                                     'Linear-Quadratic-Gaussian (LQG) Mean-Field Games and '
                                                     'Systemic Risk in Interbank Lending',
                                                     'Finite-State Mean-Field Games and Deep RL '
                                                     'Approximations for Crowd Dynamics and Fleet Routing',
                                                     'Quantitative Case Study & Synthesis: Mean-Field Games '
                                                     '(Lasry–Lions / Caines): Coupled HJB and Fokker–Planck '
                                                     'PDEs'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'differentiable_games_stackelberg',
                                         'title': 'Continuous-Action Differentiable Games, Symplectic '
                                                  'Dynamics & Stackelberg Gradients',
                                         'summary': 'Rotational Hamiltonian dynamics in min-max optimization '
                                                    '(GANs), extragradient/optimistic gradient descent, and '
                                                    'implicit Stackelberg differentiation.',
                                         'lab': True,
                                         'lessons': ['Simultaneous Gradient Descent in Bilinear Zero-Sum '
                                                     'Games: Pure Rotational Divergence',
                                                     "Balduzzi's Helmholtz Decomposition of Game Vector "
                                                     'Fields into Potential and Hamiltonian Components',
                                                     "Korpelevich's Extragradient Method, Optimistic Mirror "
                                                     'Descent (OMD), and Last-Iterate Convergence',
                                                     'Fiez–chasnov–Ratliff Total Stackelberg Derivative via '
                                                     'Implicit Function Theorem on Follower Best Response',
                                                     'Performative Prediction (Perdomo): Strategic '
                                                     'Classification When Data Distributions React to Models',
                                                     'Automated Mechanism Design via Differentiable '
                                                     'Economics (RegretNet)',
                                                     'Quantitative Case Study & Synthesis: Continuous-Action '
                                                     'Differentiable Games, Symplectic Dynamics & '
                                                     'Stackelberg Gradients'],
                                         'sim': 'gradient_descent'}]}]},
              {'id': 'mechanism_auctions',
               'name': 'Mechanism Design & Auction Theory',
               'icon': '⚖️',
               'description': 'Social choice impossibilities, Revelation Principle, VCG mechanisms, Myerson '
                              'optimal auctions, spectrum combinatorial auctions, ad markets, and matching '
                              'mechanisms.',
               'courses': [{'id': 'gt_120',
                            'code': 'GT 120',
                            'title': 'Social Choice Theory, Voting Impossibilities & Fair Division',
                            'level': 100,
                            'credits': 4,
                            'description': "Arrow's Impossibility Theorem, Gibbard–Satterthwaite strategic "
                                           'manipulation, median voter theorem, cake-cutting envy-freeness, '
                                           'and quadratic voting.',
                            'prerequisites': [],
                            'modules': [{'id': 'arrow_gibbard_satterthwaite',
                                         'title': "Arrow's Impossibility Theorem & Gibbard–Satterthwaite "
                                                  'Manipulation',
                                         'summary': "Condorcet cycles, Arrow's axioms, single-peaked "
                                                    "preferences (Black's Median Voter Theorem), and "
                                                    'strategy-proofness impossibility.',
                                         'lab': True,
                                         'lessons': ["Borda Count, Plurality, Runoff, and Condorcet's Voting "
                                                     'Paradox (Cyclic Majority Preferences)',
                                                     "Arrow's Axioms: Unrestricted Domain, Weak Pareto, "
                                                     'Independence of Irrelevant Alternatives (IIA), '
                                                     'Non-Dictatorship',
                                                     "Geanakoplos's Pivotal-Voter Proof of Arrow's "
                                                     'Impossibility Theorem',
                                                     'The Gibbard–Satterthwaite Theorem: Every '
                                                     'Strategy-Proof Social Choice Function (>=3 Outcomes) '
                                                     'is Dictatorial',
                                                     'Escape Route 1 — Restricted Domains: Single-Peaked '
                                                     "Preferences and Black's Median Voter Theorem",
                                                     'Escape Route 2 — Randomized Social Choice (Gibbard) '
                                                     'and Cardinal Quasilinear Utilities',
                                                     "Quantitative Case Study & Synthesis: Arrow's "
                                                     'Impossibility Theorem & Gibbard–Satterthwaite '
                                                     'Manipulation'],
                                         'sim': 'veil_of_ignorance'},
                                        {'id': 'voting_rules_computational',
                                         'title': 'Modern Voting Rules, Condorcet Extensions & Computational '
                                                  'Social Choice',
                                         'summary': 'Kemeny–Young, Schulze beatpath, Approval voting, Single '
                                                    'Transferable Vote, and NP-hardness of manipulation.',
                                         'lab': True,
                                         'lessons': ['Condorcet-Consistent Rules: Copeland, Minimax, '
                                                     'Kemeny–Young Rank Aggregation, and Schulze Beatpaths',
                                                     'Approval Voting, Range/Score Voting, and '
                                                     'Balinski–Laraki Majority Judgment',
                                                     'Proportional Representation: Single Transferable Vote '
                                                     '(STV) and Monroe/Chamberlin–Courant Rules',
                                                     'Apportionment Paradoxes (Alabama, Population, '
                                                     'New-States) and Balinski–Young Theorem '
                                                     '(Webster/Huntington–Hill)',
                                                     'Bartholdi–Tovey–Trick: Using Computational Complexity '
                                                     '(NP-Hardness) as a Barrier to Manipulation',
                                                     'Participatory Budgeting, Method of Equal Shares, and '
                                                     'Core-Fair Public Good Provision',
                                                     'Quantitative Case Study & Synthesis: Modern Voting '
                                                     'Rules, Condorcet Extensions & Computational Social '
                                                     'Choice'],
                                         'sim': 'graph_theory'},
                                        {'id': 'fair_division_envy_free',
                                         'title': 'Fair Division: Envy-Free Cake Cutting & Indivisible Goods '
                                                  '(EF1/MMS)',
                                         'summary': 'Proportionality, envy-freeness, Selfridge–Conway, '
                                                    "Sperner's lemma rental harmony, and Round-Robin/MNW for "
                                                    'indivisible items.',
                                         'lab': True,
                                         'lessons': ['Steinhaus Proportionality (1/n) and Cut-and-Choose vs. '
                                                     'Dubins–Spanier Moving-Knife Protocols',
                                                     'Envy-Freeness (EF) for 3 Players (Selfridge–Conway) '
                                                     'and Aziz–Mackenzie Bounded Discrete Protocol',
                                                     "Su's Rental Harmony Theorem: Fair Room Assignment and "
                                                     "Rent Splitting via Sperner's Lemma",
                                                     'Indivisible Goods: Why Exact Envy-Freeness Fails and '
                                                     'Envy-Freeness up to One Good (EF1)',
                                                     "Lipton's Envy-Cycle Elimination and Caragiannis et al. "
                                                     'Maximum Nash Welfare (MNW implies EF1 + PO)',
                                                     "Budish's Maximin Share (MMS) Guarantee and Competitive "
                                                     'Equilibrium from Equal Incomes (A-CEEI)',
                                                     'Quantitative Case Study & Synthesis: Fair Division: '
                                                     'Envy-Free Cake Cutting & Indivisible Goods (EF1/MMS)'],
                                         'sim': 'veil_of_ignorance'},
                                        {'id': 'matching_kidney_school',
                                         'title': 'Two-Sided & One-Sided Matching: School Choice & Kidney '
                                                  'Exchange',
                                         'summary': 'Rural Hospitals Theorem, strategy-proofness of '
                                                    'Applicant-Proposing DA, Top Trading Cycles (TTC), and '
                                                    'Roth–Sönmez–Ünver kidney exchange.',
                                         'lab': True,
                                         'lessons': ['Structure of the Stable Matching Lattice and the Rural '
                                                     'Hospitals Theorem',
                                                     'Dubins–Freedman Theorem: Applicant-Proposing Deferred '
                                                     'Acceptance is Strategy-Proof for Applicants',
                                                     'Impossibility of Two-Sided Strategy-Proof Stable '
                                                     'Matching (Roth) and Truncation Manipulation by '
                                                     'Receivers',
                                                     "Shapley–Scarf Housing Market: Gale's Top Trading "
                                                     'Cycles (TTC) is Strategy-Proof, Pareto Optimal, and '
                                                     'Unique Core',
                                                     'Abdulkadiroğlu & Sönmez School Choice Redesign in '
                                                     'Boston and NYC (DA vs.TTC Efficiency-Stability '
                                                     'Tradeoff)',
                                                     'Kidney Exchange Clearinghouses: Directed Cycle/Chain '
                                                     'Integer Programming on Compatibility Graphs',
                                                     'Quantitative Case Study & Synthesis: Two-Sided & '
                                                     'One-Sided Matching: School Choice & Kidney Exchange'],
                                         'sim': 'graph_theory'},
                                        {'id': 'scoring_prediction_markets',
                                         'title': 'Proper Scoring Rules, Prediction Markets & Peer '
                                                  'Prediction',
                                         'summary': "Brier and logarithmic scoring rules, Hanson's "
                                                    "Logarithmic Market Scoring Rule (LMSR), and Prelec's "
                                                    'Bayesian Truth Serum.',
                                         'lab': True,
                                         'lessons': ['Strictly Proper Scoring Rules: Brier (Quadratic), '
                                                     'Logarithmic, and Spherical Scores',
                                                     "Savage's Characterization of Proper Scoring Rules via "
                                                     'Convex Potential Functions (Bregman Divergences)',
                                                     "Hanson's Automated Market Maker: Logarithmic Market "
                                                     'Scoring Rule (LMSR) and Bounded Loss (b log N)',
                                                     'Equivalence Between Cost-Function Automated Market '
                                                     'Makers and Convex Dual Utility Maximization',
                                                     'Eliciting Unverifiable Subjective Information: '
                                                     'Miller–Resnick–Zeckhauser Peer Prediction',
                                                     "Prelec's Bayesian Truth Serum (BTS): Exploiting the "
                                                     "'Surprisingly Common' Principle"],
                                         'sim': 'bayes_belief'}]},
                           {'id': 'gt_220',
                            'code': 'GT 220',
                            'title': 'Single-Item Auctions, Revenue Equivalence & VCG Mechanisms',
                            'level': 200,
                            'credits': 4,
                            'description': 'First-price, second-price (Vickrey), English, and Dutch '
                                           'auctions, Revenue Equivalence Theorem, Myerson optimal reserve '
                                           'prices, and Vickrey–Clarke–Groves mechanisms.',
                            'prerequisites': ['gt_110', 'gt_120'],
                            'modules': [{'id': 'standard_auctions_vickrey',
                                         'title': "The Four Standard Auctions & Vickrey's Dominant-Strategy "
                                                  'Truthfulness',
                                         'summary': 'Strategic equivalence of Dutch and First-Price '
                                                    "auctions, Vickrey's DSIC proof for second-price "
                                                    'auctions, and order statistics.',
                                         'lab': True,
                                         'lessons': ['Taxonomy of Auctions: English Ascending, Dutch '
                                                     'Descending, First-Price Sealed-Bid, Second-Price '
                                                     'Sealed-Bid',
                                                     'Strategic Isomorphism of Dutch Open-Outcry and '
                                                     'First-Price Sealed-Bid Auctions',
                                                     "Vickrey's Theorem: Truthful Bidding is a Weakly "
                                                     'Dominant Strategy in Second-Price Auctions',
                                                     'Symmetric Bayesian Nash Equilibrium of First-Price '
                                                     'Auctions: Bidding the Expected Second-Highest Value '
                                                     'Conditional on Winning',
                                                     'Order Statistics of Uniform[0,1] Valuations: Why '
                                                     'Shaded First-Price Bids Yield Identical Expected '
                                                     'Revenue',
                                                     'Risk-Averse Bidders (CRRA): Why First-Price Auctions '
                                                     'Yield Higher Revenue Than Second-Price Under Risk '
                                                     'Aversion'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'envelope_revenue_equivalence',
                                         'title': "The Envelope Theorem, Myerson's Lemma & Revenue "
                                                  'Equivalence',
                                         'summary': 'Incentive compatibility in single-parameter '
                                                    'environments, monotonicity of allocation rules, payment '
                                                    'identity, and the Revenue Equivalence Theorem.',
                                         'lab': True,
                                         'lessons': ['Single-Parameter Quasilinear Environments: Private '
                                                     'Valuation v_i and Allocation Probability x_i(b)',
                                                     "Myerson's Lemma: An Allocation Rule is Implementable "
                                                     'iff x_i is Monotone Non-Decreasing',
                                                     'The Envelope Theorem Payment Formula: Unique Payments '
                                                     'up to a Zero-Type Boundary Constant',
                                                     'The Revenue Equivalence Theorem (RET): Any Two '
                                                     'Auctions with Identical Allocation and Zero-Type '
                                                     'Utility Yield Equal Expected Revenue',
                                                     'All-Pay Auctions (Lobbying/Contests) and War of '
                                                     'Attrition Equilibrium Derived Instantly via RET',
                                                     'When Revenue Equivalence Breaks: Asymmetric '
                                                     'Distributions, Correlation, Risk Aversion, and Budget '
                                                     'Constraints'],
                                         'sim': 'function_plotter'},
                                        {'id': 'myerson_optimal_auctions',
                                         'title': "Virtual Valuations & Myerson's Revenue-Maximizing Auction",
                                         'summary': 'Deriving virtual values phi(v) = v - (1-F(v))/f(v), '
                                                    'hazard rates, monopoly reserve prices, and '
                                                    'Bulow–Roberts marginal revenue.',
                                         'lab': True,
                                         'lessons': ['Writing Expected Seller Revenue as Expected Virtual '
                                                     'Surplus via Integration by Parts',
                                                     'Virtual Valuations phi(v) = v - (1 - F(v)) / f(v) and '
                                                     'Bulow–Roberts Monopoly Marginal Revenue Interpretation',
                                                     'Regularity (Monotone Hazard Rate) and Why a '
                                                     'Second-Price Auction with Reserve r* = phi^{-1}(0) is '
                                                     'Optimal for Symmetric Bidders',
                                                     'Irregular Distributions: Myerson Ironing of the '
                                                     'Cumulative Virtual Valuation Curve',
                                                     'Asymmetric Bidders: Why the Optimal Auction Biases '
                                                     'Allocation Toward Weak Bidders to Discipline Strong '
                                                     'Bidders',
                                                     'Bulow–Klemperer Theorem: An English Auction with N+1 '
                                                     'Bidders Without Reserve Beats the Optimal Auction with '
                                                     'N Bidders'],
                                         'sim': 'function_plotter'},
                                        {'id': 'vcg_clarke_pivot',
                                         'title': 'Vickrey–Clarke–Groves (VCG) Mechanisms & The Clarke Pivot '
                                                  'Rule',
                                         'summary': 'Welfare maximization in multi-parameter settings, '
                                                    'internalizing externalities via Clarke pivot payments, '
                                                    'and VCG limitations.',
                                         'lab': True,
                                         'lessons': ['Multi-Parameter Social Choice Environments and '
                                                     'Utilitarian Social Welfare Maximization',
                                                     'Groves Mechanisms: Paying Each Agent the Declared '
                                                     'Welfare of All Other Agents Plus h_i(v_{-i})',
                                                     'DSIC Proof of Groves Mechanisms and the Clarke Pivot '
                                                     'Rule (Paying Your Externality on Others)',
                                                     'Public Project Provision under VCG: Identifying '
                                                     'Pivotal Agents and Non-Negative Payments',
                                                     "Green–Laffont and Roberts's Theorems: VCG is the "
                                                     'Unique Welfare-Maximizing DSIC Mechanism on Rich '
                                                     'Domains',
                                                     'Why VCG Is Rarely Used Unmodified in Spectrum '
                                                     'Auctions: Zero Revenue, Shill Bidding, and Collusion '
                                                     '(Ausubel–Milgrom)'],
                                         'sim': 'truth_table'},
                                        {'id': 'myerson_satterthwaite_bilateral',
                                         'title': 'Budget Balance, Myerson–Satterthwaite Impossibility & '
                                                  'Double Auctions',
                                         'summary': 'Why no bilateral trade mechanism can be simultaneously '
                                                    "BIC, IR, efficient, and budget-balanced, plus McAfee's "
                                                    'asymptotic double auction.',
                                         'lab': True,
                                         'lessons': ['Bilateral Trade with Overlapping Support: Buyer '
                                                     'Valuation v_B and Seller Cost c_S',
                                                     'Applying Revenue Equivalence to Show the Expected VCG '
                                                     'Deficit When Enforcing Ex-Post Efficiency',
                                                     'The Myerson–Satterthwaite Impossibility Theorem: No '
                                                     'BIC, Interim IR, Ex-Post Efficient, Budget-Balanced '
                                                     'Mechanism Exists',
                                                     'Chatterjee–Samuelson k-Double Auction: Second-Best '
                                                     'Tradeoff Between Efficiency and Budget Balance',
                                                     "McAfee's Dominant-Strategy Double Auction: Sacrificing "
                                                     'One Marginal Trade for DSIC and Weak Budget Balance',
                                                     'Rustichini–Satterthwaite–Williams: O(1/N^2) Rate of '
                                                     'Convergence to Full Efficiency in Large Markets'],
                                         'sim': 'distribution_explorer'}]},
                           {'id': 'gt_320',
                            'code': 'GT 320',
                            'title': 'Combinatorial Auctions, Ad Markets & Algorithmic Mechanism Design',
                            'level': 300,
                            'credits': 4,
                            'description': 'Sponsored search (GSP vs. VCG), autobidding under RoS '
                                           'constraints, FCC spectrum auctions, Nisan–Ronen algorithmic '
                                           'mechanism design, and prophet inequalities.',
                            'prerequisites': ['gt_220'],
                            'modules': [{'id': 'ad_auctions_gsp_autobidding',
                                         'title': 'Sponsored Search Auctions: GSP, VCG & Modern Autobidding',
                                         'summary': 'Edelman–Ostrovsky–Schwarz locally envy-free equilibria '
                                                    'of Generalized Second Price, quality scores, and '
                                                    'target-CPA/RoS autobidders.',
                                         'lab': True,
                                         'lessons': ['Position Auctions with Separable Click-Through Rates '
                                                     '(alpha_j * q_i) and Quality Scores',
                                                     'Generalized Second Price (GSP) vs. VCG: Why GSP Is Not '
                                                     'Truthful',
                                                     'Edelman–Ostrovsky–Schwarz (EOS) and Varian: Locally '
                                                     'Envy-Free Equilibria of GSP Replicate VCG Payments',
                                                     'Reserve Prices, Squashing Parameters, and Yahoo/Google '
                                                     'Revenue Optimization',
                                                     'The Shift from First-Price/Second-Price Manual Bids to '
                                                     'Target-CPA / Return-on-Spend (RoS) Autobidders',
                                                     'Pacing Equilibria in Budget- and RoS-Constrained '
                                                     'Auctions: Why First-Price and Truthful Auctions '
                                                     'Diverge'],
                                         'sim': 'prisoners_dilemma'},
                                        {'id': 'combinatorial_spectrum_auctions',
                                         'title': 'Combinatorial Auctions, Exposure Problems & FCC Incentive '
                                                  'Auctions',
                                         'summary': 'Complementarities and substitutes, package bidding, the '
                                                    'winner determination NP-hard problem, ascending clock '
                                                    'auctions, and Milgrom–Segal deferred acceptance.',
                                         'lab': True,
                                         'lessons': ['Complements vs. Gross Substitutes (Kelso–Crawford) and '
                                                     'the Exposure Problem in Simultaneous Ascending '
                                                     'Auctions',
                                                     'The Winner Determination Problem (WDP): Weighted Set '
                                                     'Packing Integer Programming',
                                                     'Ascending Clock-Proxy Auctions '
                                                     '(Ausubel–Cramton–Milgrom) and Activity Rules (GARP)',
                                                     'Core-Selecting Package Auctions: Quadratic Programming '
                                                     'to Minimize Distance to VCG Within the Core',
                                                     'Milgrom & Segal (2014) Liable/Obvious '
                                                     'Strategy-Proofness and Deferred-Acceptance Clock '
                                                     'Auctions',
                                                     'Case Study: The FCC 600 MHz Broadcast Incentive '
                                                     'Auction — Reverse Clock + Forward Spectrum Repacking'],
                                         'sim': 'graph_theory'},
                                        {'id': 'algorithmic_mechanism_design',
                                         'title': 'Nisan–Ronen Algorithmic Mechanism Design & Truthful '
                                                  'Approximation',
                                         'summary': 'When exact welfare maximization is NP-hard: why greedy '
                                                    'approximations break VCG truthfulness, '
                                                    'maximal-in-distributional-range (MIDR), and cycle '
                                                    'monotonicity.',
                                         'lab': True,
                                         'lessons': ['The Nisan–Ronen Paradigm: Combining Polynomial-Time '
                                                     'Approximation with Incentive Compatibility',
                                                     'Why Plugging a Non-Exact Approximation Algorithm into '
                                                     'VCG Destroys Truthfulness',
                                                     'Single-Minded Combinatorial Bidders: '
                                                     "Lehman–O'Callaghan–Shoham sqrt(m)-Approximation via "
                                                     'Monotone Greedy',
                                                     "Rochet's Cycle Monotonicity and Weak Monotonicity "
                                                     '(WMON) Characterization of Truthful Multi-Parameter '
                                                     'Domains',
                                                     'Maximal-in-Range (MIR) and '
                                                     'Maximal-in-Distributional-Range (MIDR) Black-Box '
                                                     'Reductions (Dobzinski–Dughmi)',
                                                     'unrelated-Machines Scheduling (Nisan–Ronen Conjecture) '
                                                     'and Randomized Truthful-in-Expectation Mechanisms'],
                                         'sim': 'graph_theory'},
                                        {'id': 'multi_item_revenue_prophet',
                                         'title': 'Multi-Item Optimal Mechanisms, Bundling & Prophet '
                                                  'Inequalities',
                                         'summary': 'Why selling two items is radically harder than one '
                                                    '(Daskalakis–Deckelbaum–Tzamos), grand bundling vs. '
                                                    'separate sales, and posted-price prophet bounds.',
                                         'lab': True,
                                         'lessons': ['Multi-Dimensional Screening: Why 1D Myerson Ironing '
                                                     'Fails in 2D Valuation Spaces',
                                                     'Manelli–Vincent and Hart–Nisan: When Even Two '
                                                     'Independent Additive Items Require Infinite Menus of '
                                                     'Lotteries',
                                                     'Babaioff–Immorlica–Lucier–Weinberg Theorem: Max of '
                                                     'Separate Sales and Grand Bundling Captures >= 1/6 of '
                                                     'Optimal Revenue',
                                                     'Cai–Devanur–Weinberg Duality Framework: Reducing '
                                                     'Bayesian Incentive Compatibility to Virtual Welfare',
                                                     'Krengel–Sucheston–Samuel-Cahn Prophet Inequality: A '
                                                     'Single Posted Threshold Achieves 1/2 of the Omniscient '
                                                     'Prophet',
                                                     'Chawla–Hartline–Malec–Sivan: Sequential Posted Pricing '
                                                     'Achieves Constant-Factor Approximations to Myerson'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'two_sided_platforms_pricing',
                                         'title': 'Two-Sided Platform Economics, Surge Pricing & Congestion '
                                                  'Markets',
                                         'summary': 'Rochet–Tirole network externalities, Uber/Lyft spatial '
                                                    'surge pricing equilibria, and electricity locational '
                                                    'marginal pricing (LMP).',
                                         'lab': True,
                                         'lessons': ['Rochet & Tirole Two-Sided Markets: Cross-Side Network '
                                                     'Externalities and Below-Cost Loss Leaders',
                                                     'Spatial Ride-Hailing Marketplaces: Wild-Goose-Chase '
                                                     'High-Utilization Collapse and Surge Pricing '
                                                     'Restoration',
                                                     'Dynamic Matching in Ride-Sharing: Batching Windows vs. '
                                                     'Greedy Immediate Dispatch',
                                                     'Wholesale Electricity Markets: Unit Commitment, DC '
                                                     'Optimal Power Flow, and Locational Marginal Pricing '
                                                     '(LMP)',
                                                     'Carbon Cap-and-Trade Allowance Auctions vs. Pigouvian '
                                                     "Taxes under Cost Uncertainty (Weitzman's Prices vs. "
                                                     'Quantities)',
                                                     'Cloud Spot Instance Pricing and Preemption-Aware '
                                                     'Workload Scheduling'],
                                         'sim': 'equilibrium'}]},
                           {'id': 'gt_420',
                            'code': 'GT 420',
                            'title': 'Matching Markets, Optimal Auctions & Principal–Agent Foundations',
                            'level': 400,
                            'credits': 4,
                            'description': 'Design stable matching mechanisms for real markets, derive revenue-optimal auctions with '
                                           "Myerson's lemma, and analyse incentives under moral hazard and adverse selection. Bridges "
                                           'classical mechanism design to dynamic mechanisms, contract theory and blockchain fee '
                                           'markets.',
                            'prerequisites': ['gt_320', 'gt_310'],
                            'modules': [{'id': 'two_sided_matching',
                                         'title': 'Two-Sided Matching and Stability',
                                         'summary': 'The Gale–Shapley algorithm and the lattice structure of stable matchings.',
                                         'lab': True,
                                         'lessons': ['Stable Marriage and the Deferred-Acceptance Algorithm',
                                                     'Proposer-Optimality and the Lattice of Stable Matchings',
                                                     'Strategy-Proofness for Proposers and Manipulation by Receivers',
                                                     'The National Resident Matching Program and Couples Constraints',
                                                     'Implementing Deferred Acceptance and Testing Stability in Python']},
                                        {'id': 'market_design_applications',
                                         'title': 'Market Design in Practice: Schools and Kidneys',
                                         'summary': 'How economists redesigned real allocation systems without money.',
                                         'lab': True,
                                         'lessons': ['School Choice: Boston Mechanism vs Student-Proposing DA',
                                                     'Top Trading Cycles and Pareto-Efficient Allocation',
                                                     'Kidney Exchange: Cycles, Chains and Integer Programming',
                                                     'Simulating a Kidney Exchange Clearing Algorithm']},
                                        {'id': 'myerson_optimal_auctions',
                                         'title': "Myerson's Optimal Auction Theory",
                                         'summary': 'Revenue maximization through virtual values and ironing.',
                                         'lab': True,
                                         'lessons': ["Myerson's Lemma: Monotone Allocation Rules and Payment Identity",
                                                     'Virtual Valuations and the Revenue-Optimal Auction',
                                                     'Regularity, Ironing and Optimal Reserve Prices',
                                                     'Bulow–Klemperer: Competition vs Optimal Reserves',
                                                     'Computing Optimal Reserve Prices Numerically for Asymmetric Bidders']},
                                        {'id': 'principal_agent',
                                         'title': 'Moral Hazard, Adverse Selection and Screening',
                                         'summary': 'Foundations of contract theory: incentive compatibility when actions or types are '
                                                    'hidden.',
                                         'lessons': ['The Principal–Agent Problem with Hidden Action',
                                                     "Risk Sharing vs Incentives: Holmström's Informativeness Principle",
                                                     'Screening with Hidden Types: Mussa–Rosen Nonlinear Pricing',
                                                     'Rothschild–Stiglitz Insurance Markets and Separating Equilibria']},
                                        {'id': 'blockchain_mechanisms',
                                         'title': 'Introduction to Blockchain Mechanism Design',
                                         'summary': 'Incentive problems in decentralized ledgers as a preview of cryptoeconomic '
                                                    'systems.',
                                         'lab': True,
                                         'lessons': ['Transaction Fee Mechanisms and EIP-1559 Base-Fee Dynamics',
                                                     'Miner/Validator Extractable Value (MEV) as a Mechanism Design Failure',
                                                     'Proof-of-Stake Incentives, Slashing and Nothing-at-Stake',
                                                     'Simulating EIP-1559 Base-Fee Adjustment Under Demand Shocks']}]},
                           {'id': 'gt_520',
                            'code': 'GT 520',
                            'title': 'Dynamic Mechanism Design, Contract Theory & Cryptoeconomic Systems',
                            'level': 500,
                            'credits': 4,
                            'description': 'Principal-agent moral hazard (Holmström), dynamic '
                                           'Pavan–Segal–Toikka mechanisms, transaction-fee mechanisms '
                                           '(EIP-1559), MEV auctions, and automated market makers.',
                            'prerequisites': ['gt_310', 'gt_320', 'gt_420'],
                            'modules': [{'id': 'contract_theory_moral_hazard',
                                         'title': 'Contract Theory: Adverse Selection, Moral Hazard & '
                                                  'Principal-Agent Models',
                                         'summary': 'Laffont–Tirole screening menus, Holmström moral hazard '
                                                    'with hidden effort, informativeness principle, and '
                                                    'Holmström–Milgrom linear contracts.',
                                         'lab': True,
                                         'lessons': ['Nonlinear Pricing and Second-Degree Price '
                                                     'Discrimination (Mussa–Rosen Quality Screening)',
                                                     'Efficiency at the Top and Downward Information Rent '
                                                     'Distortion in Adverse Selection',
                                                     'Hidden Action (Moral Hazard): The First-Order Approach '
                                                     "and Rogerson's Monotone Likelihood Ratio / CDF "
                                                     'Conditions',
                                                     "Holmström's Informativeness Principle: When Should a "
                                                     'Bonus Depend on a Peer Benchmark?',
                                                     'Holmström & Milgrom Continuous-Time Brownian Effort '
                                                     'Model: Why Optimal Contracts Are Linear in Aggregate '
                                                     'Output',
                                                     'Multi-Task Moral Hazard: Why High-Powered Incentives '
                                                     'on Measurable Metrics Destroy Unmeasured Quality'],
                                         'sim': 'function_plotter'},
                                        {'id': 'dynamic_mechanisms_bandits',
                                         'title': 'Dynamic Mechanism Design (Bergemann–Välimäki / '
                                                  'Pavan–Segal–Toikka)',
                                         'summary': 'Evolving private Markovian types, the Dynamic Pivot '
                                                    'Mechanism, impulse responses, and truthful multi-armed '
                                                    'bandit exploration.',
                                         'lab': True,
                                         'lessons': ['Bergemann & Välimäki Dynamic Pivot Mechanism: '
                                                     'Generalizing VCG Payment Flows to Markov Decision '
                                                     'Processes',
                                                     'Pavan, Segal & Toikka (2014) Dynamic Envelope Theorem: '
                                                     "Impulse Responses of Future Types to Today's Report",
                                                     'Dynamic Revenue Maximization: When Should a Monopoly '
                                                     'Commit to Decreasing vs. Increasing Price Paths?',
                                                     'Coase Conjecture: Why a Durable-Goods Monopolist '
                                                     'Without Commitment Loses All Market Power as Period '
                                                     'Length Shrinks',
                                                     'Truthful Multi-Armed Bandits '
                                                     '(Babaioff–Sharma–Slivkins) and Incentivizing '
                                                     'Exploration via Bayesian Persuasion',
                                                     'Dynamic Matching Markets with Arrivals and Departures '
                                                     '(Akbarpour–Li–Ovezkoylu)'],
                                         'sim': 'bandit'},
                                        {'id': 'blockchain_tfm_eip1559',
                                         'title': 'Transaction Fee Mechanisms (Roughgarden EIP-1559) & '
                                                  'Consensus Incentives',
                                         'summary': "Roughgarden's axiomatic framework for blockchain "
                                                    'blockspace auctions (DSIC, MMIC, OCA-proofness) and '
                                                    'proof-of-stake slashing economics.',
                                         'lab': True,
                                         'lessons': ["Why Bitcoin's First-Price Fee Auction Forces Complex "
                                                     'Fee Estimation and Bid Shading',
                                                     'Why a Naive Second-Price Blockspace Auction Fails: '
                                                     'Block Producers Can Inject Fake Shill Transactions',
                                                     "Roughgarden's Three Axioms: User DSIC, Myopic Miner IC "
                                                     '(MMIC), and Off-Chain Agreement (OCA) Proofness',
                                                     'EIP-1559 Base-Fee Burning + Variable Block Size: '
                                                     'Achieving All Three Axioms Outside Congestion Spikes',
                                                     'Chung–Shi Impossibility Theorem: No Mechanism can be '
                                                     'Simultaneously DSIC, MMIC, and 1-OCA-Proof under '
                                                     'Finite Blocks',
                                                     'Selfish Mining (Eyal–Sirer) Markov Chain Analysis and '
                                                     'Proof-of-Stake Accountable Safety / Slashing Bounds'],
                                         'sim': 'prisoners_dilemma'},
                                        {'id': 'cfmm_dex_economics',
                                         'title': 'Constant Function Market Makers (CFMMs) & '
                                                  'Loss-Versus-Rebalancing (LVR)',
                                         'summary': 'Convex optimization formulation of Uniswap v2/v3/Curve '
                                                    'invariant curves, no-arbitrage pricing gradients, and '
                                                    'Milionis–Moallemi–Roughgarden LVR.',
                                         'lab': True,
                                         'lessons': ['Constant Product (x * y = k), Constant Sum, and '
                                                     'Stableswap (Curve) Trading Function Invariants',
                                                     'Angeris et al. Convex Optimization Equivalence: '
                                                     'Arbitrageurs Push Marginal CFMM Price to External '
                                                     'Reference Price',
                                                     'Concentrated Liquidity (Uniswap v3): Virtual Reserves '
                                                     'and Replicating Payoffs of Arbitrary Convex Options',
                                                     'Impermanent Loss (Divergence Loss) vs. '
                                                     'Milionis–Moallemi–Roughgarden Loss-Versus-Rebalancing '
                                                     '(LVR)',
                                                     'Deriving Instantaneous LVR = (sigma^2 / 2) * P^2 * '
                                                     "|x'(P)| via Itô's Lemma on Informed Arbitrage",
                                                     'Batch Auctions, Function-Maximizing Auctions (FM-AMM), '
                                                     'and Oracle-Assisted Dynamic Fees to Mitigate LVR'],
                                         'sim': 'function_plotter'},
                                        {'id': 'mev_order_flow_auctions',
                                         'title': 'Maximal Extractable Value (MEV), Proposer-Builder '
                                                  'Separation & OFAs',
                                         'summary': 'Sandwich attacks, backrunning, Flashbots MEV-Boost '
                                                    'timing games, and Order Flow Auctions (MEV-Share / '
                                                    'CowSwap).',
                                         'lab': True,
                                         'lessons': ['Taxonomy of Maximal Extractable Value (MEV): DEX-CEX '
                                                     'Arbitrage, Liquidations, and Sandwich Attacks',
                                                     'Optimal Sandwich Attack Sizing under Slippage '
                                                     'Tolerances and Constant-Product AMM Curves',
                                                     'Priority Gas Auctions (PGAs) as Continuous-Time '
                                                     'All-Pay Wars of Attrition',
                                                     'Proposer-Builder Separation (PBS): Relay Architecture, '
                                                     'Timing Games, and Builder Centralization Economies of '
                                                     'Scale',
                                                     'Order Flow Auctions (OFAs): Returning Backrun Surplus '
                                                     'to Users via Conditional Bundle Auctions',
                                                     'Encrypted Mempools (Threshold Decryption / TEEs) and '
                                                     'Fair Ordering Impossibility Theorems (Kelkar)'],
                                         'sim': 'prisoners_dilemma'}]}]},
              {'id': 'stochastic_derivatives',
               'name': 'Stochastic Calculus & Derivatives Pricing',
               'icon': '📐',
               'description': "Measure-theoretic martingales, Brownian motion, Itô's Lemma, Girsanov change "
                              'of measure, Black–Scholes PDEs, stochastic volatility (Heston/SABR), and '
                              'fixed-income term-structure models.',
               'courses': [{'id': 'gt_130',
                            'code': 'GT 130',
                            'title': 'Discrete-Time Martingales, No-Arbitrage & Binomial Option Pricing',
                            'level': 100,
                            'credits': 4,
                            'description': 'Build the fundamental theorems of asset pricing in discrete '
                                           'time: filtrations, risk-neutral measures, Cox–Ross–Rubinstein '
                                           'trees, and American optimal stopping.',
                            'prerequisites': [],
                            'modules': [{'id': 'no_arbitrage_ftap',
                                         'title': "State Prices, Farkas's Lemma & The Fundamental Theorems "
                                                  'of Asset Pricing',
                                         'summary': 'Self-financing portfolios, Type I/II arbitrage, '
                                                    'Arrow–Debreu state prices, and proving the First and '
                                                    'Second FTAP via separating hyperplanes.',
                                         'lab': True,
                                         'lessons': ['One-Period Market Models, Payoff Matrices, '
                                                     'Self-Financing Portfolios, and Dominance / Arbitrage',
                                                     "Farkas's Lemma and the Separating Hyperplane Theorem "
                                                     'on Convex Cones',
                                                     'The First Fundamental Theorem of Asset Pricing (1st '
                                                     'FTAP): No-Arbitrage iff Risk-Neutral Martingale '
                                                     'Measure Q Exists',
                                                     'Market Completeness, Replication of Contingent Claims, '
                                                     'and the Second FTAP (Uniqueness of Q)',
                                                     'Incomplete Markets: Super-Replication Upper Bounds and '
                                                     'Sub-Replication Lower Bounds via LP Duality',
                                                     'Stochastic Discount Factors (Pricing Kernels) and the '
                                                     'Hansen–Jagannathan Volatility Bound'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'filtrations_martingales_stopping',
                                         'title': 'Filtrations, Conditional Expectation, Martingales & '
                                                  'Optional Stopping',
                                         'summary': 'Information partitions, tower property, Doob '
                                                    "decomposition, and Doob's Optional Stopping Theorem.",
                                         'lab': True,
                                         'lessons': ['Sigma-Algebras, Filtrations (Information Flow), and '
                                                     'Adapted vs. Predictable Stochastic Processes',
                                                     'Measure-Theoretic Conditional Expectation E[X | F_t]: '
                                                     'Tower Property and Orthogonal Projection in L^2',
                                                     'Martingales, Submartingales, Supermartingales, and the '
                                                     'Discrete Stochastic Integral (Martingale Transform)',
                                                     "Doob's Decomposition Theorem and Quadratic Variation "
                                                     'of Discrete Martingales',
                                                     "Stopping Times tau and Doob's Optional Stopping "
                                                     'Theorem (Bounded Horizon and UI Conditions)',
                                                     "Wald's Identities and Gambler's Ruin Hitting "
                                                     'Probabilities via Exponential Martingales'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'crr_binomial_trees',
                                         'title': 'Cox–Ross–Rubinstein Binomial Trees & Backward Induction '
                                                  'Pricing',
                                         'summary': 'Replicating delta-hedging portfolios on recombining '
                                                    'binomial trees, risk-neutral probabilities, and weak '
                                                    'convergence to Black–Scholes.',
                                         'lab': True,
                                         'lessons': ['One-Step Binomial Model: Delta Replication vs. '
                                                     'Risk-Neutral Valuation (Independence from Physical '
                                                     'Drift mu)',
                                                     'Multi-Period Recombining Cox–Ross–Rubinstein (CRR) '
                                                     'Trees: u = exp(sigma*sqrt(dt)), d = 1/u',
                                                     'Dynamic Self-Financing Delta-Hedging Across '
                                                     'Path-Dependent Barrier and Lookback Payoffs',
                                                     'Put-Call Parity, Early Exercise Bounds, and Why '
                                                     'American Calls on Non-Dividend Stocks Are Never '
                                                     'Exercised Early',
                                                     'Snell Envelope and Backward Dynamic Programming for '
                                                     'American Put Options on Trees',
                                                     "Donsker's Invariance Principle: Convergence of CRR "
                                                     'Binomial Prices to the Black–Scholes Formula'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'fixed_income_duration_convexity',
                                         'title': 'Yield Curves, Bootstrapping, Duration, Convexity & '
                                                  'Forward Rates',
                                         'summary': 'Zero-coupon discount curves, Nelson–Siegel fitting, '
                                                    'Macaulay/modified duration, convexity immunization, and '
                                                    'forward rate agreements.',
                                         'lab': True,
                                         'lessons': ['Zero-Coupon Discount Factors P(0, T), Continuously '
                                                     'Compounded Spot Yields, and Par Swap Rates',
                                                     'Bootstrapping the Discount Curve from Treasury Bills, '
                                                     'Notes, and SOFR Interest Rate Swaps',
                                                     'Macaulay Duration, Modified Duration, Dollar DV01, and '
                                                     'Key-Rate Duration Buckets',
                                                     'Second-Order Taylor Expansion: Bond Convexity and '
                                                     "Redington's Classical Portfolio Immunization",
                                                     'Instantaneous Forward Rates f(0, T) = -d/dT ln P(0, T) '
                                                     'and Forward Rate Agreements (FRAs)',
                                                     'Principal Component Analysis of Yield Curve Movements: '
                                                     'Level (PC1), Slope (PC2), and Curvature (PC3)'],
                                         'sim': 'function_plotter'},
                                        {'id': 'markowitz_kelly_portfolio',
                                         'title': 'Markowitz Mean-Variance Frontier, CAPM & The Kelly '
                                                  'Criterion',
                                         'summary': 'Quadratic optimization of the efficient frontier, '
                                                    'Two-Fund Separation, Sharpe–Lintner CAPM, '
                                                    'Black–Litterman views, and log-optimal growth.',
                                         'lab': True,
                                         'lessons': ['Markowitz Mean-Variance Optimization: Analytical '
                                                     'Efficient Frontier via Lagrange Multipliers',
                                                     "Tobin's Two-Fund Separation with a Risk-Free Asset: "
                                                     'The Tangency Market Portfolio and Sharpe Ratio',
                                                     'The Capital Asset Pricing Model (CAPM), Security '
                                                     'Market Line, and Systematic Beta vs. Idiosyncratic '
                                                     'Alpha',
                                                     'Arbitrage Pricing Theory (Ross APT) and Fama–French '
                                                     'Multi-Factor Covariance Models',
                                                     'Estimation Error in Sample Covariance Matrices: '
                                                     'Ledoit–Wolf Shrinkage and Black–Litterman Bayesian '
                                                     'Views',
                                                     'The Kelly Criterion (f* = mu / sigma^2): Maximizing '
                                                     'Asymptotic Log-Wealth Growth Rate and Fractional '
                                                     'Kelly'],
                                         'sim': 'regression_fit'}]},
                           {'id': 'gt_230',
                            'code': 'GT 230',
                            'title': 'Brownian Motion, Itô Calculus & The Black–Scholes–Merton PDE',
                            'level': 200,
                            'credits': 4,
                            'description': 'Continuous-time Wiener processes, quadratic variation (dW_t)^2 = '
                                           "dt, Itô's Lemma, Feynman–Kac theorem, Girsanov's theorem, and "
                                           'the Greeks.',
                            'prerequisites': ['gt_130'],
                            'modules': [{'id': 'brownian_motion_ito_integral',
                                         'title': 'Wiener Processes, Quadratic Variation & The Itô '
                                                  'Stochastic Integral',
                                         'summary': 'Lévy construction of Brownian motion, '
                                                    'nowhere-differentiability, L^2-isometry of Itô '
                                                    'integrals, and why left-endpoint evaluation creates a '
                                                    'martingale.',
                                         'lab': True,
                                         'lessons': ['Definition and Lévy–Ciesielski Haar Wavelet '
                                                     'Construction of Standard Brownian Motion W_t',
                                                     'Sample Path Properties: Holder Continuity (alpha < '
                                                     '1/2), Nowhere Differentiability, and Unbounded First '
                                                     'Variation',
                                                     'Quadratic Variation of Brownian Motion: Proving sum '
                                                     '(Delta W_i)^2 Converges in L^2 to T (Informally '
                                                     '(dW_t)^2 = dt)',
                                                     'Constructing the Itô Integral int_0^t H_s dW_s for '
                                                     'Simple and General L^2-Adapted Processes',
                                                     'The Itô Isometry E[(int H_s dW_s)^2] = E[int H_s^2 ds] '
                                                     'and Martingale Property',
                                                     'Itô vs. Stratonovich Integrals: Why Finance Requires '
                                                     'Left-Endpoint Non-Anticipating Evaluation'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'itos_lemma_sdes',
                                         'title': "Itô's Lemma, Geometric Brownian Motion & Stochastic "
                                                  'Differential Equations',
                                         'summary': 'Multidimensional Itô–Doeblin formula, Geometric '
                                                    'Brownian Motion exact solution, Ornstein–Uhlenbeck mean '
                                                    'reversion, and Cox–Ingersoll–Ross processes.',
                                         'lab': True,
                                         'lessons': ['Deriving the 1D and Multidimensional Itô–Doeblin '
                                                     'Formula via Second-Order Taylor Expansion',
                                                     'Multiplication Table of Stochastic Differentials: dt^2 '
                                                     '= 0, dt dW_t = 0, dW_i dW_j = rho_ij dt',
                                                     'Geometric Brownian Motion (GBM): Explaining the -1/2 '
                                                     'sigma^2 t Volatility Drag in S_t = S_0 exp((mu - '
                                                     'sigma^2/2)t + sigma W_t)',
                                                     'The Ornstein–Uhlenbeck (Vasicek) Mean-Reverting '
                                                     'Gaussian Process and Integrating Factors',
                                                     'The Cox–Ingersoll–Ross (CIR) Square-Root Process and '
                                                     'Feller Boundary Condition (2*kappa*theta >= sigma^2)',
                                                     'Strong and Weak Existence/Uniqueness of SDEs '
                                                     '(Lipschitz and Linear Growth Conditions)'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'black_scholes_feynman_kac',
                                         'title': 'The Black–Scholes–Merton PDE, Feynman–Kac & Risk-Neutral '
                                                  'Valuation',
                                         'summary': 'Eliminating dW_t via continuous delta-hedging, solving '
                                                    'the parabolic PDE via heat-equation transformation, and '
                                                    'Feynman–Kac expectation representation.',
                                         'lab': True,
                                         'lessons': ['Black, Scholes & Merton (1973): Constructing a Locally '
                                                     'Riskless Portfolio V(t, S_t) - Delta * S_t',
                                                     'Deriving the Black–Scholes PDE: dV/dt + r S dV/dS + '
                                                     '1/2 sigma^2 S^2 d^2V/dS^2 - rV = 0',
                                                     'The Feynman–Kac Theorem: Connecting Parabolic Linear '
                                                     'PDEs to Discounted Expected Payoffs Under Q',
                                                     'Deriving the Closed-Form Black–Scholes Call/Put '
                                                     'Formulas and Interpreting N(d_1) vs. N(d_2)',
                                                     "Martingale Representation Theorem and Girsanov's "
                                                     'Theorem (Radon–Nikodym Change of Drift)',
                                                     'Changing Numéraire: Forward Measures, Stock Numéraire '
                                                     '(explaining N(d_1)), and Margrabe Exchange Options'],
                                         'sim': 'function_plotter'},
                                        {'id': 'option_greeks_hedging',
                                         'title': 'Option Sensitivity Greeks, Gamma-Theta Tradeoff & '
                                                  'Discrete Hedging Error',
                                         'summary': 'Analytical and finite-difference Greeks (Delta, Gamma, '
                                                    'Vega, Theta, Rho, Vanna, Volga), gamma scalping P&L '
                                                    'attribution, and Leland transaction costs.',
                                         'lab': True,
                                         'lessons': ['First-Order and Second-Order Greeks: Delta, Gamma, '
                                                     'Vega, Theta, Rho, Vanna (dDelta/dsigma), and Volga '
                                                     '(dVega/dsigma)',
                                                     'The Fundamental Gamma-Theta Identity from the '
                                                     'Black–Scholes PDE: Theta + r S Delta + 1/2 sigma^2 S^2 '
                                                     'Gamma = r V',
                                                     'Realized Volatility vs. Implied Volatility P&L '
                                                     'Attribution: 1/2 Gamma S^2 (sigma_real^2 - '
                                                     'sigma_imp^2) dt',
                                                     'Discrete Rebalancing Hedging Error (Kamal–Derman) and '
                                                     "Leland's Modified Volatility Under Proportional "
                                                     'Transaction Costs',
                                                     'Pin Risk at Expiration, Barrier Option Discontinuous '
                                                     'Gamma, and Static Replication of Variance Swaps',
                                                     'Automatic Differentiation (Adjoint Greeks) for '
                                                     'Computing High-Dimensional Sensitivities in O(1) '
                                                     'Overhead'],
                                         'sim': 'derivative_explorer'},
                                        {'id': 'exotic_options_reflection',
                                         'title': 'Barrier, Lookback, Asian Options & The Reflection '
                                                  'Principle',
                                         'summary': 'Running maximum distributions of drifted Brownian '
                                                    'motion, knock-in/knock-out barriers, and arithmetic vs. '
                                                    'geometric Asian options.',
                                         'lab': True,
                                         'lessons': ['The Reflection Principle for Standard Brownian Motion: '
                                                     'Joint Distribution of (W_T, max_{0<=t<=T} W_t)',
                                                     'Girsanov Change of Measure to Derive Hitting-Time '
                                                     '(Inverse Gaussian) and Running-Maximum Laws with Drift',
                                                     'Closed-Form Pricing of Up-and-Out, Down-and-Out, and '
                                                     'Knock-In Barrier Options via Method of Images',
                                                     'Floating-Strike and Fixed-Strike Lookback Options',
                                                     'Geometric Asian Options (Closed-Form Lognormal) vs. '
                                                     'Arithmetic Asian Options (Kemna–Vorst Control Variate)',
                                                     'Longstaff–Schwartz Least-Squares Monte Carlo (LSM) for '
                                                     'High-Dimensional Bermudan/American Options'],
                                         'sim': 'distribution_explorer'}]},
                           {'id': 'gt_330',
                            'code': 'GT 330',
                            'title': 'Volatility Surfaces, Stochastic Volatility (Heston/SABR) & '
                                     'Jump-Diffusions',
                            'level': 300,
                            'credits': 4,
                            'description': 'Implied volatility smiles, Breeden–Litzenberger risk-neutral '
                                           'densities, Dupire local volatility, Heston characteristic '
                                           'functions, SABR asymptotics, and rough volatility.',
                            'prerequisites': ['gt_230'],
                            'modules': [{'id': 'implied_vol_no_arb_surface',
                                         'title': 'Implied Volatility Smiles, Breeden–Litzenberger & SVI '
                                                  'Parameterization',
                                         'summary': 'Newton–Jaeckel implied volatility inversion, '
                                                    'butterfly/calendar arbitrage conditions, model-free '
                                                    "variance swaps, and Gatheral's SVI.",
                                         'lab': True,
                                         'lessons': ['Why Constant-Volatility Black–Scholes Fails Since the '
                                                     '1987 Crash: Equity Skew and FX Smiles',
                                                     'Fast Implied Volatility Inversion: Newton–Raphson with '
                                                     "Brenner–Subrahmanyam Seed and Jaeckel's Let's Be "
                                                     'Rational',
                                                     'Breeden–Litzenberger Theorem: Risk-Neutral Terminal '
                                                     'Density q(K) = e^{rT} d^2C / dK^2',
                                                     'Static No-Arbitrage Conditions on Total Implied '
                                                     'Variance w(k, T): Calendar Spread and Durrleman '
                                                     'Butterfly Conditions',
                                                     "Gatheral's Stochastic Volatility Inspired (SVI) and "
                                                     'SSVI Arbitrage-Free Surface Parameterizations',
                                                     'Model-Free Replication of Variance Swaps via '
                                                     'Log-Contract Strip (Demeterfi et al.) and the CBOE VIX '
                                                     'Formula'],
                                         'sim': 'function_plotter'},
                                        {'id': 'dupire_local_volatility',
                                         'title': "Dupire's Local Volatility Formula, Forward PDE & "
                                                  'Crank–Nicolson Solvers',
                                         'summary': "Deriving Dupire's exact Markovian projection "
                                                    'sigma_loc(K, T), solving PDEs via Crank–Nicolson/ADI '
                                                    'finite differences, and forward smile flattening.',
                                         'lab': True,
                                         'lessons': ["Tanaka's Formula and Deriving Dupire's Forward PDE in "
                                                     'Strike K and Maturity T',
                                                     "Dupire's Local Volatility Formula: Matching Any "
                                                     'Arbitrage-Free Vanilla Surface Exactly with a 1D '
                                                     'Diffusion',
                                                     "Gyöngy's Theorem: Local Variance Equals Conditional "
                                                     'Expected Instantaneous Stochastic Variance E[v_t | S_t '
                                                     '= K]',
                                                     'Finite-Difference PDE Solvers: Explicit, Implicit, '
                                                     'Crank–Nicolson, and Rannacher Half-Step Smoothing',
                                                     'Wait-and-See Flaws of Pure Local Volatility: Forward '
                                                     'Smile Flattening and Wrong Skew Dynamics for '
                                                     'Cliquets/Barriers',
                                                     'Stochastic Local Volatility (SLV): Calibrating the '
                                                     'Leverage Function via McKean–Vlasov Particle '
                                                     'Filtering'],
                                         'sim': 'function_plotter'},
                                        {'id': 'heston_sabr_stoch_vol',
                                         'title': 'Heston Fourier Pricing, FFT (Carr–Madan / COS) & The SABR '
                                                  'Model',
                                         'summary': "Riccati ODEs for Heston's affine characteristic "
                                                    'function, Fang–Oosterlee Fourier-cosine (COS) pricing, '
                                                    "and Hagan's SABR heat-kernel asymptotics.",
                                         'lab': True,
                                         'lessons': ['The Heston (1993) Stochastic Volatility Model: '
                                                     'Spot-Vol Correlation rho (Leverage Effect) and '
                                                     'Vol-of-Vol',
                                                     'Affine Jump-Diffusion Framework (Duffie–Pan–Singleton) '
                                                     "and Solving Heston's Riccati ODEs (Albrecher Little "
                                                     'Heston Trap)',
                                                     'Carr–Madan Fast Fourier Transform (FFT) and '
                                                     'Fang–Oosterlee Fourier-Cosine (COS) Exponentially '
                                                     'Convergent Pricing',
                                                     "Andersen's Quadratic-Exponential (QE) Discretization "
                                                     'Scheme for Exact/Unbiased Heston Monte Carlo',
                                                     "Hagan's SABR Model (dF = alpha F^beta dW_1, dalpha = "
                                                     'nu alpha dW_2): Singular Perturbation Implied Vol '
                                                     'Formula',
                                                     'Managing Backbone Dynamics (beta), Skew (rho), and '
                                                     'Smile Curvature (nu) on Swaption Desks'],
                                         'sim': 'fourier_series'},
                                        {'id': 'merton_levy_jumps',
                                         'title': 'Merton Jump-Diffusion, Lévy Processes & Variance-Gamma / '
                                                  'CGMY',
                                         'summary': "Compound Poisson processes, Itô's Lemma for "
                                                    'semimartingales with jumps, partial '
                                                    'integro-differential equations (PIDEs), and '
                                                    'Lévy–Khintchine representation.',
                                         'lab': True,
                                         'lessons': ['Why Continuous Diffusions Underestimate Short-Dated '
                                                     'Out-of-the-Money Crash Risk',
                                                     'Poisson Random Measures, Compensated Martingales, and '
                                                     "Itô's Formula for Jump-Diffusions",
                                                     'Merton (1976) Lognormal Jump-Diffusion and Kou '
                                                     'Double-Exponential Jump Models',
                                                     'Pricing Partial Integro-Differential Equations (PIDEs) '
                                                     'and Market Incompleteness Under Jumps',
                                                     'Infinite-Activity Pure-Jump Lévy Processes: '
                                                     'Variance-Gamma (Madan), NIG, and CGMY',
                                                     'The Lévy–Khintchine Characteristic Exponent Triple (b, '
                                                     'sigma^2, nu(dx))'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'rough_volatility_bergomi',
                                         'title': 'Rough Volatility (Gatheral–Jaisson–Rosenbaum), rBergomi & '
                                                  'Volterra Processes',
                                         'summary': 'Fractional Brownian motion with Hurst exponent H ~ 0.1, '
                                                    'power-law ATM skew explosion, and hybrid schemes for '
                                                    'rough Bergomi.',
                                         'lab': True,
                                         'lessons': ['Empirical Scaling of Log-Realized Volatility '
                                                     'Increments: Fractional Brownian Motion with Hurst H '
                                                     'approx 0.1',
                                                     'How Rough Volatility Explains the Power-Law Explosion '
                                                     'of At-The-Money Skew T^{-0.4} at Short Maturities',
                                                     'Volterra Stochastic Integral Equations and the '
                                                     'Non-Markovian Rough Bergomi (rBergomi) Model',
                                                     'Bennedsen–Lunde–Pakkanen Hybrid Scheme and Markovian '
                                                     'Multi-Factor Exponential Kernel Approximations (Abi '
                                                     'Jaber)',
                                                     'The Rough Heston Model: Fractional Riccati Equations '
                                                     'and Adams Predictor-Corrector Schemes',
                                                     'Deep Calibration: Using Neural Network Surrogates for '
                                                     'Millisecond Rough Volatility Calibration'],
                                         'sim': 'nn_playground'}]},
                           {'id': 'gt_430',
                            'code': 'GT 430',
                            'title': 'Numerical Methods for Derivatives: Monte Carlo, Finite Differences & Fourier Pricing',
                            'level': 400,
                            'credits': 4,
                            'description': 'Price and hedge path-dependent and exotic derivatives with Monte Carlo, PDE '
                                           'finite-difference schemes and characteristic-function methods, and calibrate classical '
                                           'short-rate models. Supplies the numerical toolkit needed for term-structure, credit and XVA '
                                           'engineering.',
                            'prerequisites': ['gt_330'],
                            'modules': [{'id': 'monte_carlo_pricing',
                                         'title': 'Monte Carlo Pricing and Variance Reduction',
                                         'summary': 'Simulating risk-neutral paths and making estimators converge faster.',
                                         'lab': True,
                                         'lessons': ['Risk-Neutral Simulation of GBM and Pricing European Options',
                                                     'Antithetic Variates and Control Variates',
                                                     'Quasi-Monte Carlo with Sobol Sequences',
                                                     'Pricing Asian and Barrier Options by Simulation',
                                                     'Longstaff–Schwartz Least-Squares Monte Carlo for American Options']},
                                        {'id': 'greeks_estimation',
                                         'title': 'Estimating Greeks by Simulation',
                                         'summary': 'Sensitivities for hedging computed efficiently inside Monte Carlo engines.',
                                         'lab': True,
                                         'lessons': ['Finite-Difference Bump-and-Revalue Greeks and Their Bias',
                                                     'Pathwise Derivative Estimators',
                                                     'Likelihood-Ratio Method for Discontinuous Payoffs',
                                                     'Adjoint Algorithmic Differentiation (AAD) for Thousands of Greeks']},
                                        {'id': 'finite_difference_pde',
                                         'title': 'Finite-Difference Methods for Pricing PDEs',
                                         'summary': 'Discretizing Black–Scholes-type PDEs with stable, accurate schemes.',
                                         'lab': True,
                                         'lessons': ['Explicit, Implicit and Crank–Nicolson Schemes for Black–Scholes',
                                                     'Von Neumann Stability Analysis and Spurious Oscillations',
                                                     'Early Exercise via Projected SOR and Penalty Methods',
                                                     'ADI Schemes for Two-Factor (Heston) PDEs',
                                                     'Building a Crank–Nicolson Pricer for American Puts in NumPy']},
                                        {'id': 'fourier_pricing',
                                         'title': 'Fourier and Characteristic-Function Pricing',
                                         'summary': 'Fast pricing under stochastic-volatility and jump models using transform methods.',
                                         'lab': True,
                                         'lessons': ['Characteristic Functions of Affine and Lévy Models',
                                                     'Carr–Madan FFT Option Pricing',
                                                     'The COS Method of Fang and Oosterlee',
                                                     'Calibrating Heston to an Implied Volatility Surface via FFT']},
                                        {'id': 'short_rate_intro',
                                         'title': 'Introduction to Short-Rate Models',
                                         'summary': 'Classical one-factor interest-rate models that underpin term-structure theory.',
                                         'lab': True,
                                         'lessons': ['Bonds, Yields and Forward Rates: Bootstrapping a Zero Curve',
                                                     'Vasicek and Cox–Ingersoll–Ross Models and Closed-Form Bond Prices',
                                                     'Hull–White: Fitting the Initial Term Structure',
                                                     'Trinomial Trees for Short-Rate Models',
                                                     'Simulating CIR Paths and Pricing Zero-Coupon Bonds in Python']}]},
                           {'id': 'gt_530',
                            'code': 'GT 530',
                            'title': 'Interest Rate Term Structure, Credit Derivatives & XVA Quantitative '
                                     'Engineering',
                            'level': 500,
                            'credits': 4,
                            'description': 'Heath–Jarrow–Morton (HJM) no-arbitrage drift, Hull–White/LMM '
                                           'models, structural/reduced-form credit risk, CVA/DVA/FVA/KVA, '
                                           'and Monte Carlo variance reduction.',
                            'prerequisites': ['gt_330', 'gt_430'],
                            'modules': [{'id': 'short_rate_hjm_lmm',
                                         'title': 'Short-Rate Models (Hull–White), HJM Drift Condition & '
                                                  'LIBOR/SOFR Market Models',
                                         'summary': 'Fitting the initial yield curve in Hull–White, '
                                                    'Heath–Jarrow–Morton no-arbitrage drift condition, and '
                                                    'Brace–Gatarek–Musiela (BGM) forward models.',
                                         'lab': True,
                                         'lessons': ['Equilibrium Short-Rate Models (Vasicek, CIR) vs. '
                                                     'No-Arbitrage Time-Dependent Models (Ho–Lee, '
                                                     'Hull–White)',
                                                     'Analytical Affine Bond Pricing P(t, T) = exp(A(t,T) - '
                                                     "B(t,T) r_t) and Jamshidian's Trick for Bond Options",
                                                     'Heath–Jarrow–Morton (HJM) Framework: Why Instantaneous '
                                                     'Forward Volatilities Fully Determine the Risk-Neutral '
                                                     'Drift',
                                                     'T-Forward Numéraire Measure Q^T: Why Forward Rates '
                                                     'F(t; T, S) Are Martingales Under Q^S',
                                                     'The Brace–Gatarek–Musiela (LIBOR Market Model) and '
                                                     'Post-LIBOR Backward-Looking SOFR Term Models '
                                                     '(Lyashenko–Mercurio)',
                                                     'Co-Terminal Swaption Calibration, Correlation '
                                                     'Parameterizations, and Bermudan Swaption Exercise '
                                                     'Boundaries'],
                                         'sim': 'function_plotter'},
                                        {'id': 'credit_risk_merton_intensity',
                                         'title': 'Structural (Merton) vs. Reduced-Form '
                                                  '(Jarrow–Turnbull/Duffie) Credit Models',
                                         'summary': 'Equity as a call option on firm assets, Black–Cox '
                                                    'first-passage default barriers, Cox hazard-rate '
                                                    'intensities, and CDS bootstrapping.',
                                         'lab': True,
                                         'lessons': ['Merton (1974) Structural Credit Model: Equity as a '
                                                     'Call Option and Debt as Risk-Free Bond Minus a Put on '
                                                     'Assets',
                                                     'Distance-to-Default (KMV), Credit Spreads at Short '
                                                     'Maturities, and Black–Cox First-Passage Barrier Models',
                                                     'Reduced-Form Intensity Models (Jarrow–Turnbull, '
                                                     'Duffie–Singleton): Inaccessible Stopping Times and '
                                                     'Hazard Rates lambda_t',
                                                     'Credit Default Swaps (CDS): Protection Leg vs. Premium '
                                                     'Leg with Accrued Coupon and Piecewise-Constant Hazard '
                                                     'Bootstrapping',
                                                     "Gaussian and Student-t Copulas (Li's Model) for "
                                                     'Portfolio Default Correlation and Why Base Correlation '
                                                     'Failed in 2008',
                                                     'Synthetic CDO Tranches, Loss Given Default (LGD) '
                                                     'Stochasticity, and Contagion Hawkes Processes'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'xva_counterparty_risk',
                                         'title': 'Counterparty Risk & XVA: CVA, DVA, FVA, MVA & Wrong-Way '
                                                  'Risk',
                                         'summary': 'Netting sets, collateral CSA margining, Expected '
                                                    'Positive Exposure (EPE), unilateral/bilateral CVA PDEs, '
                                                    'and SIMM initial margin.',
                                         'lab': True,
                                         'lessons': ['Counterparty Credit Exposure: Trade-Level vs. '
                                                     'Netting-Set Master Agreements (ISDA) and Collateral '
                                                     'CSAs',
                                                     'Exposure Profiles: Expected Exposure (EE), Potential '
                                                     'Future Exposure (PFE 99%), and Expected Positive '
                                                     'Exposure (EPE)',
                                                     'Unilateral and Bilateral Credit Valuation Adjustment '
                                                     '(CVA & DVA): Pricing Counterparty Default as a '
                                                     'Contingent Claim',
                                                     'Wrong-Way Risk (WWR): When Exposure and Counterparty '
                                                     'Default Intensity Positively Co-Move',
                                                     'Funding Valuation Adjustment (FVA), Capital Valuation '
                                                     'Adjustment (KVA), and Margin Valuation Adjustment '
                                                     '(MVA)',
                                                     'ISDA Standard Initial Margin Model (SIMM) '
                                                     'Sensitivities and American Monte Carlo Regression for '
                                                     'Forward Exposure'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'monte_carlo_qmc_mlmc',
                                         'title': 'Advanced Monte Carlo: Variance Reduction, Sobol Quasi-MC '
                                                  '& Multilevel MC',
                                         'summary': 'Antithetic variates, control variates, importance '
                                                    'sampling, low-discrepancy Sobol sequences with Brownian '
                                                    "bridge, and Giles's Multilevel Monte Carlo.",
                                         'lab': True,
                                         'lessons': ['Antithetic Variates, Moment Matching, and Optimal Beta '
                                                     'Control Variates',
                                                     'Importance Sampling via Girsanov Drift Shifting for '
                                                     'Deep Out-of-the-Money Rare Events',
                                                     'Quasi-Monte Carlo (QMC): Low-Discrepancy Sobol '
                                                     'Sequences, Koksma–Hlawka Inequality, and O((log N)^d / '
                                                     'N) Convergence',
                                                     'Beating the Curse of Effective Dimensionality: '
                                                     'Brownian Bridge and PCA Path Construction for Sobol '
                                                     'Points',
                                                     "Giles's Multilevel Monte Carlo (MLMC): Telescoping "
                                                     'Sums Across Geometric Time-Step Grids for O(eps^{-2}) '
                                                     'Complexity',
                                                     'Pathwise Sensitivities vs. Likelihood Ratio Method '
                                                     '(LRM) and Vibrato Monte Carlo for Discontinuous '
                                                     'Payoffs'],
                                         'sim': 'riemann_sum'},
                                        {'id': 'extreme_value_risk_measures',
                                         'title': 'Coherent Risk Measures (CVaR), Extreme Value Theory & '
                                                  'Stress Testing',
                                         'summary': 'Artzner coherent risk axioms, Value-at-Risk vs. '
                                                    'Expected Shortfall (CVaR), Fisher–Tippett–Gnedenko / '
                                                    'Pickands–Balkema–de Haan EVT, and vine copulas.',
                                         'lab': True,
                                         'lessons': ['Value-at-Risk (VaR) Failure Modes: Lack of '
                                                     'Subadditivity and Blindness to Tail Severity',
                                                     'Artzner et al. Axioms of Coherent Risk Measures '
                                                     '(Monotonicity, Translation Invariance, Positive '
                                                     'Homogeneity, Subadditivity)',
                                                     'Expected Shortfall / Conditional VaR (CVaR) and '
                                                     'Rockafellar–Uryasev Convex Linear Programming '
                                                     'Optimization',
                                                     'Extreme Value Theory (EVT): Block Maxima (GEV) and '
                                                     'Peaks-Over-Threshold Generalized Pareto Distribution '
                                                     '(GPD)',
                                                     "Sklar's Theorem, Tail Dependence Coefficients, and "
                                                     'Vine Copulas for Non-Gaussian Joint Crash Modeling',
                                                     'Fundamental Review of the Trading Book (FRTB), '
                                                     'Backtesting (Kupiec/Christoffersen), and Reverse '
                                                     'Stress Testing'],
                                         'sim': 'distribution_explorer'}]}]},
              {'id': 'market_microstructure',
               'name': 'Quantitative Market Microstructure & Algorithmic Strategy',
               'icon': '📈',
               'description': 'Limit order book mechanics, Kyle/Glosten–Milgrom adverse selection, '
                              'Almgren–Chriss optimal execution, Avellaneda–Stoikov market making, and '
                              'statistical arbitrage.',
               'courses': [{'id': 'gt_140',
                            'code': 'GT 140',
                            'title': 'Limit Order Books, Exchange Matching Engines & Adverse Selection',
                            'level': 100,
                            'credits': 4,
                            'description': 'How modern electronic exchanges operate at nanosecond '
                                           'resolution: price-time priority, ITCH/OUCH protocols, '
                                           'Roll/Glosten–Milgrom/Kyle microstructure models, and VPIN.',
                            'prerequisites': [],
                            'modules': [{'id': 'lob_matching_architecture',
                                         'title': 'Limit Order Book (LOB) Data Structures & Matching Engine '
                                                  'Mechanics',
                                         'summary': 'Price-time (FIFO) vs. pro-rata matching, order types '
                                                    '(IOC, FOK, iceberg, pegged), L1/L2/L3 market data '
                                                    'feeds, and O(1) order book implementation.',
                                         'lab': True,
                                         'lessons': ['Continuous Double Auctions: Limit Orders, Market '
                                                     'Orders, Cancellations, and Price-Time vs. Pro-Rata '
                                                     'Priority',
                                                     'Advanced Order Instructions: Post-Only, '
                                                     'Immediate-or-Cancel (IOC), Fill-or-Kill (FOK), '
                                                     'Iceberg/Hidden, and Midpoint Pegs',
                                                     'Market Data Granularity: Top-of-Book (L1), Price-Level '
                                                     'Depth (L2), and Order-by-Order (L3 / NASDAQ ITCH 5.0)',
                                                     'High-Performance L3 Order Book Data Structures in '
                                                     'C++/Rust: Intrusive Doubly-Linked Lists + Flat Hash '
                                                     'Maps',
                                                     'Maker-Taker vs. Inverted Taker-Maker Fee Schedules, '
                                                     'Tick-Size Regimes (Reg NMS), and Opening/Closing Cross '
                                                     'Auctions',
                                                     'Fragmented Equity Market Structure: Lit Exchanges, '
                                                     'Dark Pools, Internalizers, and Payment for Order Flow '
                                                     '(PFOF)'],
                                         'sim': 'state_machine'},
                                        {'id': 'roll_glosten_milgrom',
                                         'title': "Bid-Ask Spread Decomposition: Roll's Model & "
                                                  'Glosten–Milgrom Sequential Trade',
                                         'summary': 'Order-processing vs. inventory vs. adverse-selection '
                                                    "spread components, Roll's autocovariance estimator, and "
                                                    'Glosten–Milgrom Bayesian updating.',
                                         'lab': True,
                                         'lessons': ['Quoted Spread, Effective Spread, Realized Spread, and '
                                                     'Price Impact Decomposition',
                                                     'Roll (1984) Bid-Ask Bounce Model: Estimating Effective '
                                                     'Spread from First-Order Price Change Autocovariance',
                                                     "Bagehot's Insight: Market Makers Always Lose to "
                                                     'Informed Traders and Recover Losses from Noise Traders',
                                                     'The Glosten–Milgrom (1985) Sequential Trade Model: Bid '
                                                     'and Ask as Regret-Free Bayesian Conditional '
                                                     'Expectations',
                                                     'Convergence of Bid-Ask Quotes to the True Asset Value '
                                                     'and Market Breakdown Under High Information Asymmetry',
                                                     "Hasbrouck's Vector Autoregression (VAR) Information "
                                                     'Share and Gonzalo–Granger Price Discovery Metrics'],
                                         'sim': 'bayes_belief'},
                                        {'id': 'kyle_lambda_insider',
                                         'title': "Kyle's (1985) Strategic Insider Auction & Continuous-Time "
                                                  'Kyle–Back',
                                         'summary': 'Batch auction equilibrium between an strategic informed '
                                                    'insider, noise traders, and competitive market makers; '
                                                    "Kyle's lambda market depth.",
                                         'lab': True,
                                         'lessons': ['Single-Period Kyle (1985) Model: Normal Prior, Noise '
                                                     'Order Flow u ~ N(0, sigma_u^2), and Linear Pricing P = '
                                                     'mu + lambda * y',
                                                     "Deriving Kyle's Lambda = sigma_v / (2 * sigma_u): How "
                                                     'Noise Volatility Creates Liquidity Depth',
                                                     'Multi-Period Dynamic Kyle Model: Why the Insider Drips '
                                                     'Information Slowly to Reveal Volatility Linearly Over '
                                                     'Time',
                                                     'Continuous-Time Kyle–Back Model: Insider Order Flow as '
                                                     'a Brownian Bridge Toward the Terminal Value',
                                                     'Amihud Illiquidity Ratio and Empirical Estimation of '
                                                     'Price Impact Coefficients',
                                                     'Glosten (1994) Electronic Limit Order Book '
                                                     'Equilibrium: Zero-Profit Marginal Expectational '
                                                     'Pricing'],
                                         'sim': 'regression_fit'},
                                        {'id': 'order_flow_toxicity_vpin',
                                         'title': 'Order-Flow Imbalance (OFI), Hawkes Processes & Toxicity '
                                                  '(PIN/VPIN)',
                                         'summary': 'Cont–Kukanov–Stoikov linear order-flow imbalance, '
                                                    "self-exciting Hawkes order arrivals, Easley–O'Hara PIN, "
                                                    'and Volume-Synchronized PIN.',
                                         'lab': True,
                                         'lessons': ['Cont, Kukanov & Stoikov (2014): Why Short-Horizon '
                                                     'Price Changes Are Linear in Top-of-Book Order Flow '
                                                     'Imbalance (OFI)',
                                                     'Micro-Price (Stoikov): Markov Chain Imbalance-Weighted '
                                                     'Fair Price Estimator beating Mid-Price',
                                                     'Self-Exciting and Mutually-Exciting Hawkes Point '
                                                     'Processes for Trade and Cancellation Clustering',
                                                     'Trade Classification Rules (Lee–Ready, Tick Rule, Bulk '
                                                     'Volume Classification) and Clock Synchronization',
                                                     "Easley, Kiefer, O'Hara & Paperman Probability of "
                                                     'Informed Trading (PIN) Poisson Likelihood Model',
                                                     'Volume-Synchronized Probability of Informed Trading '
                                                     '(VPIN) and Flash Crash Liquidity Withdrawal Early '
                                                     'Warnings'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'empirical_microstructure_laws',
                                         'title': 'Universal Empirical Laws: The Square-Root Impact Law & '
                                                  'Long-Memory Flow',
                                         'summary': "Bouchaud's persistence of order signs, propagating "
                                                    'impact kernels, and the universal square-root metaorder '
                                                    'impact law.',
                                         'lab': True,
                                         'lessons': ['The Long-Memory Puzzle: Order Signs Autocorrelate as a '
                                                     'Power Law tau^{-gamma} While Returns Are Uncorrelated',
                                                     'Bouchaud, Gefen, Potters & Wyart (2004) Transient '
                                                     'Propagator Model: Power-Law Impact Decay Cancels Order '
                                                     'Flow Persistence',
                                                     'Obizhaeva & Wang (2013) Supply-Demand Order Book '
                                                     'Resilience Dynamics',
                                                     'The Universal Square-Root Law of Metaorder Market '
                                                     'Impact: Delta P ~ sigma * sqrt(Q / V_daily)',
                                                     'Tóth et al. Latent Order Book Theory Explaining the '
                                                     'Square-Root Concavity of Impact',
                                                     'Cross-Impact Matrices: How Trading Asset i Moves the '
                                                     'Price of Correlated Asset j (Benzaquen–Bouchaud)'],
                                         'sim': 'function_plotter'}]},
                           {'id': 'gt_240',
                            'code': 'GT 240',
                            'title': 'Optimal Trade Execution (Almgren–Chriss) & High-Frequency Market '
                                     'Making',
                            'level': 200,
                            'credits': 4,
                            'description': 'Almgren–Chriss mean-variance execution trajectories, gatheral '
                                           'transient impact, '
                                           'Avellaneda–Stoikov/Guéant–Lehalle–Fernandez-Tapia optimal market '
                                           'making, and smart order routing.',
                            'prerequisites': ['gt_140', 'gt_230'],
                            'modules': [{'id': 'almgren_chriss_execution',
                                         'title': 'Almgren–Chriss Optimal Execution, Implementation '
                                                  'Shortfall & VWAP/TWAP',
                                         'summary': 'Permanent vs. temporary market impact, mean-variance '
                                                    'risk-aversion tradeoff, hyperbolic sine liquidation '
                                                    'curves, and adaptive execution.',
                                         'lab': True,
                                         'lessons': ["Perold's Implementation Shortfall: Decomposing "
                                                     'Slippage into Delay Cost, Market Impact, and '
                                                     'Opportunity Cost',
                                                     'Almgren & Chriss (2000) Model: Linear Permanent Impact '
                                                     'g(v) = gamma*v and Temporary Impact h(v) = eta*v',
                                                     'Calculus of Variations / Euler–Lagrange Derivation of '
                                                     'the Hyperbolic Sine (sinh) Optimal Liquidation '
                                                     'Trajectory',
                                                     'Boundary Limits: Risk-Neutral TWAP (kappa -> 0) vs. '
                                                     'Ultra-Urgent Immediate Liquidation (kappa -> infinity)',
                                                     'Volume-Weighted Average Price (VWAP) and '
                                                     'Percentage-of-Volume (POV) Intraday U-Shaped Volume '
                                                     'Profiles',
                                                     'Incorporating Short-Term Alpha Signals into Optimal '
                                                     'Execution (Gârleanu–Pedersen / Cartea–Jaimungal)'],
                                         'sim': 'function_plotter'},
                                        {'id': 'transient_impact_gatheral',
                                         'title': 'Optimal Execution Under Transient Impact (Obizhaeva–Wang '
                                                  '& Gatheral)',
                                         'summary': 'Bucket-shaped trades under exponential decay kernels, '
                                                    "Gatheral's no-dynamic-arbitrage condition on decay "
                                                    'kernels, and Fredholm integral equations.',
                                         'lab': True,
                                         'lessons': ['Obizhaeva–Wang Optimal Execution: Initial Block Trade '
                                                     "+ Continuous Trading + Terminal Block Trade ('Bucket' "
                                                     'Shape)',
                                                     'Why Impulsive Block Trades at Start and End Exploit '
                                                     'Exponential Order-Book Recovery',
                                                     'Gatheral (2010) No-Dynamic-Arbitrage (No Price '
                                                     'Manipulation) Theorem for Nonlinear Impact f(v) and '
                                                     'Decay G(t-s)',
                                                     "Positive-Definiteness (Bochner's Theorem) of the Decay "
                                                     'Kernel G(t - s) and Fredholm Integral Solutions',
                                                     'Alfonsi–Fruth–Schied Nonlinear Resilience Models and '
                                                     'Curbing High-Frequency Oscillatory Strategies',
                                                     'Multi-Asset Portfolio Execution with Cross-Impact and '
                                                     'Factor Risk Constraints'],
                                         'sim': 'function_plotter'},
                                        {'id': 'avellaneda_stoikov_mm',
                                         'title': 'Avellaneda–Stoikov & Guéant–Lehalle Optimal Market Making',
                                         'summary': 'Ho–Stoll inventory risk, reservation price skewing, '
                                                    'exponential Poisson fill intensities, and the '
                                                    'HJB-to-linear-ODE Cole–Hopf transformation.',
                                         'lab': True,
                                         'lessons': ["The Market Maker's Dilemma: Capturing the Bid-Ask "
                                                     'Spread vs. Accumulating Toxic Directional Inventory '
                                                     'q_t',
                                                     'Avellaneda & Stoikov (2008): Exponential Utility, '
                                                     'Poisson Fill Rates A exp(-k * delta), and the '
                                                     'Reservation Indifference Price',
                                                     'Optimal Bid and Ask Half-Spreads: 1/gamma * ln(1 + '
                                                     'gamma/k) Plus Inventory Skew q * gamma * sigma^2 * (T '
                                                     '- t)',
                                                     'Guéant, Lehalle & Fernandez-Tapia (2013): Using the '
                                                     'Cole–Hopf Transformation to Linearize the Coupled HJB '
                                                     'Equations',
                                                     'Incorporating Hard Inventory Limits (-Q <= q <= Q), '
                                                     'Adverse Selection (Cartea–Jaimungal), and Short-Term '
                                                     'Alpha',
                                                     'Queue-Position Valuation: Deciding When to Cancel and '
                                                     'Re-Quote vs. Preserving FIFO Priority at Top-of-Book'],
                                         'sim': 'pid_controller'},
                                        {'id': 'smart_order_routing',
                                         'title': 'Smart Order Routing (SOR), Dark Pool Allocation & Latency '
                                                  'Arbitrage',
                                         'summary': 'Laruelle–Lehalle censored dark pool optimization, '
                                                    'crossing networks, maker-taker rebate optimization, and '
                                                    'Budish–Cramton–Shim frequent batch auctions.',
                                         'lab': True,
                                         'lessons': ['The Smart Order Router (SOR) Problem: Splitting Child '
                                                     'Orders Across N Lit Venues and M Dark Pools',
                                                     'Ganchev–Nevmyvaka–Kearns–Vaughan Censored Kaplan–Meier '
                                                     'Dark Pool Allocation Optimization',
                                                     'Cont & Kukanov Optimal Order Placement: Balancing '
                                                     'Limit Order Fill Probability Against Market Order Fees',
                                                     'Sniping Stale Quotes Across Geographically Separated '
                                                     'Exchanges (CME Aurora vs. Nasdaq Carteret)',
                                                     'Budish, Cramton & Shim (2015): Why Continuous-Time '
                                                     'Limit Order Books Create aSocially Wasteful Latency '
                                                     'Arms Race',
                                                     'Market Design Reforms: Frequent Batch Auctions (FBAs), '
                                                     'Speed Bumps (IEX 350-Microsecond Coil), and Asymmetric '
                                                     'Delays'],
                                         'sim': 'bandit'},
                                        {'id': 'rl_execution_simulation',
                                         'title': 'Agent-Based Market Simulation (ABIDES) & Deep RL for '
                                                  'Execution/MM',
                                         'summary': 'Building realistic multi-agent limit order book '
                                                    'simulators with queue priority, latency jitter, and '
                                                    'training PPO/SAC execution agents.',
                                         'lab': True,
                                         'lessons': ['Why Historical Replay Without Market Impact Simulation '
                                                     'Overestimates Passive Limit Order Fills',
                                                     'Discrete-Event Market Simulators (ABIDES): Modeling '
                                                     'Exchange Matching, Network Latency, and Background '
                                                     'Agents',
                                                     'State/Action/Reward Design for Deep RL Optimal '
                                                     'Execution (Ning–Lin–Jaimungal DDQN / PPO)',
                                                     'Inventory-Penalized Reward Shaping (Differential '
                                                     'Sharpe / Running Inventory Quadratic Penalty) for RL '
                                                     'Market Makers',
                                                     'Preventing Simulator Overfitting and Testing '
                                                     'Robustness Against Adversarial Spoofing/Predatory '
                                                     'Agents',
                                                     'Real-Time Risk Kill-Switches: Max Drawdown, '
                                                     'Order-to-Trade Ratios, Fat-Finger Guards, and SEC Rule '
                                                     '15c3-5'],
                                         'sim': 'agent_sim'}]},
                           {'id': 'gt_340',
                            'code': 'GT 340',
                            'title': 'Statistical Arbitrage, Time-Series Econometrics & Factor Alpha '
                                     'Modeling',
                            'level': 300,
                            'credits': 4,
                            'description': 'Cointegration (Engle–Granger/Johansen), Ornstein–Uhlenbeck pairs '
                                           'trading, ARIMA/GARCH volatility, cross-sectional factor models, '
                                           'and Grinold–Kahn portfolio construction.',
                            'prerequisites': ['gt_130', 'gt_240'],
                            'modules': [{'id': 'stationarity_garch_cointegration',
                                         'title': 'Stationarity, ARIMA, GARCH Volatility & Cointegration '
                                                  '(Johansen)',
                                         'summary': 'Augmented Dickey–Fuller tests, fractional '
                                                    'differentiation, Bollerslev GARCH/EGARCH volatility '
                                                    'clustering, and Johansen vector error correction.',
                                         'lab': True,
                                         'lessons': ['Weak Stationarity, Wold Decomposition, Autocorrelation '
                                                     '(ACF/PACF), and Box–Jenkins ARMA Modeling',
                                                     'Unit Roots and Augmented Dickey–Fuller (ADF) / KPSS '
                                                     'Tests; López de Prado Fractional Differentiation',
                                                     "Engle's ARCH and Bollerslev's GARCH(1,1) Models; "
                                                     'Glosten–Jagannathan–Runkle (GJR) Asymmetric Leverage',
                                                     'Spurious Regression of Random Walks vs. Engle–Granger '
                                                     'Two-Step Cointegration',
                                                     'Johansen Maximum-Likelihood Eigenvalue Test for '
                                                     'Multi-Asset Cointegrating Vectors (VECM)',
                                                     'Kalman Filter Dynamic Hedge-Ratio Tracking for '
                                                     'Time-Varying Cointegrated Spreads'],
                                         'sim': 'kalman_filter'},
                                        {'id': 'ou_stat_arb_eigenportfolios',
                                         'title': 'Ornstein–Uhlenbeck Optimal Pairs Thresholds & PCA '
                                                  'Eigenportfolios',
                                         'summary': 'First-passage optimal entry/exit levels for OU '
                                                    'processes, Avellaneda–Lee PCA statistical arbitrage, '
                                                    'and s-score mean-reversion signals.',
                                         'lab': True,
                                         'lessons': ['Maximum-Likelihood Calibration of Mean-Reversion Speed '
                                                     '(kappa), Equilibrium Level (theta), and Half-Life '
                                                     'ln(2)/kappa',
                                                     'Bertram and Leung–Li Optimal Entry, Exit, and '
                                                     'Stop-Loss Thresholds via First-Passage Renewal Theory',
                                                     'Avellaneda & Lee (2010) Statistical Arbitrage: '
                                                     'Extracting Market/Sector Principal Components and '
                                                     'Trading Residual s-Scores',
                                                     'Random Matrix Theory (Marchenko–Pastur Law): '
                                                     'Separating True Factor Eigenvalues from Bulk Noise',
                                                     'Distance, Copula, and Graph-Laplacian Clustering '
                                                     'Approaches to Universe Pair Selection',
                                                     'Regime-Switching Hidden Markov Models (Baum–Welch) to '
                                                     'Detect Structural Breaks in Cointegrated Spreads'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'cross_sectional_factors_ic',
                                         'title': 'Cross-Sectional Equity Factors, Fundamental Law & Alpha '
                                                  'Combination',
                                         'summary': 'Fama–MacBeth regressions, Barra risk models, '
                                                    'Grinold–Kahn Fundamental Law of Active Management (IR = '
                                                    'IC * sqrt(BR)), and orthogonalization.',
                                         'lab': True,
                                         'lessons': ['Time-Series vs. Cross-Sectional Factor Regressions '
                                                     '(Fama–MacBeth Two-Pass Procedure and Newey–West '
                                                     'Standard Errors)',
                                                     'Style Factors: Value, Momentum (Jegadeesh–Titman), '
                                                     'Short-Term Reversal, Quality, Low-Volatility, and '
                                                     'Liquidity',
                                                     'Rank Information Coefficient (Spearman Rank IC), '
                                                     'Information Ratio (ICIR), and Alpha Decay Horizons',
                                                     'Grinold & Kahn Fundamental Law of Active Management: '
                                                     'IR = TC * IC * sqrt(BR) and Effective Breadth under '
                                                     'Correlation',
                                                     'Cross-Sectional Signal Processing: Winsorization, '
                                                     'Industry-Neutral Z-Scoring, and Gram–Schmidt / '
                                                     'Symmetric Orthogonalization',
                                                     'Combining Weak Alpha Signals via Ridge, Lasso, '
                                                     'ElasticNet, and Gradient-Boosted Decision Trees'],
                                         'sim': 'regression_fit'},
                                        {'id': 'backtesting_overfitting_purged_cv',
                                         'title': 'Financial Machine Learning: Purged CV, Triple-Barrier & '
                                                  'Deflated Sharpe',
                                         'summary': 'Preventing leakage in financial ML (López de Prado): '
                                                    'dollar/volume bars, triple-barrier labeling, '
                                                    'meta-labeling, purged k-fold CV, and PSR/DSR.',
                                         'lab': True,
                                         'lessons': ['Why Time-Indexed Bars Exhibit Heteroscedasticity: '
                                                     'Constructing Tick, Volume, and Dollar Imbalance Bars',
                                                     'The Triple-Barrier Labeling Method: Dynamic '
                                                     'Volatility-Scaled Profit-Taking, Stop-Loss, and '
                                                     'Vertical Time Barriers',
                                                     'Meta-Labeling: Separating Side Prediction (Primary '
                                                     'Model) from Bet-Sizing Confidence (Secondary '
                                                     'Classifier)',
                                                     'Sample Overlapping Leakage: Purged and Embargoed '
                                                     'K-Fold Cross-Validation and Combinatorial Purged CV '
                                                     '(CPCV)',
                                                     'Multiple-Testing Bias in Backtests: Bailey & López de '
                                                     'Prado Probabilistic Sharpe Ratio (PSR) and Deflated '
                                                     'Sharpe Ratio (DSR)',
                                                     'Feature Importance for Correlated Financial Signals: '
                                                     'Mean Decrease Impurity (MDI), MDA, and Clustered '
                                                     'Shapley'],
                                         'sim': 'regression_fit'},
                                        {'id': 'multi_period_portfolio_opt',
                                         'title': 'Multi-Period Convex Portfolio Optimization (Boyd) & '
                                                  'Factor Neutrality',
                                         'summary': 'Transaction cost models (spread + 3/2-power impact), '
                                                    'holding/shorting costs, factor-beta neutrality, and '
                                                    'convex quadratic/conic programming.',
                                         'lab': True,
                                         'lessons': ['Single-Period Markowitz with Linear Spread Costs, '
                                                     'Short-Borrow Costs, and Leverage/Turnover Constraints',
                                                     'Incorporating 3/2-Power Market Impact Costs via '
                                                     'Second-Order Cone Programming (SOCP)',
                                                     'Structural Factor Risk Models (Sigma = B * Sigma_f * '
                                                     'B^T + D): Enforcing Dollar, Beta, and Sector '
                                                     'Neutrality',
                                                     'Boyd et al. Multi-Period Trading via Model Predictive '
                                                     'Control (MPC) Across Alpha Decay Horizons',
                                                     'Risk Parity (Equal Risk Contribution) and Hierarchical '
                                                     'Risk Parity (HRP) Tree Clustering',
                                                     'Drawdown Control, Volatility Targeting, and Post-Trade '
                                                     'Transaction Cost Analysis (TCA)'],
                                         'sim': 'gradient_descent'}]},
                           {'id': 'gt_440',
                            'code': 'GT 440',
                            'title': 'Senior Seminar & Capstone Project: Quantitative Strategy & Market Design',
                            'level': 400,
                            'credits': 4,
                            'description': 'Conduct an original end-to-end quantitative research project — a trading strategy, pricing '
                                           'engine or market-design simulation — with rigorous data handling, backtesting, risk '
                                           'analysis and a written and oral defense. Integrates game theory, stochastic calculus and '
                                           'microstructure from the full degree.',
                            'prerequisites': ['gt_340', 'gt_320'],
                            'modules': [{'id': 'research_pipeline',
                                         'title': 'Research Questions and Data Pipelines',
                                         'summary': 'Framing a quant research question and building clean, survivorship-bias-free data '
                                                    'pipelines.',
                                         'lab': True,
                                         'lessons': ['Reading Quant Research: From Journal of Finance to SSRN Preprints',
                                                     'Formulating Testable Hypotheses About Market Behaviour',
                                                     'Data Sources, Corporate Actions and Survivorship Bias',
                                                     'Point-in-Time Data and Avoiding Look-Ahead Bias',
                                                     'Building a Reproducible Market Data Pipeline with pandas']},
                                        {'id': 'backtesting_overfitting',
                                         'title': 'Backtesting Methodology and Overfitting',
                                         'summary': 'Why most backtests lie and how to measure that honestly.',
                                         'lab': True,
                                         'lessons': ['Event-Driven vs Vectorized Backtest Architectures',
                                                     'Modeling Transaction Costs, Slippage and Market Impact',
                                                     'Multiple Testing, the Deflated Sharpe Ratio and Probability of Backtest '
                                                     'Overfitting',
                                                     'Walk-Forward and Combinatorial Purged Cross-Validation',
                                                     'Implementing Purged K-Fold Cross-Validation for a Strategy']},
                                        {'id': 'risk_portfolio',
                                         'title': 'Risk Management and Portfolio Construction',
                                         'summary': 'Turning signals into positions with controlled risk.',
                                         'lab': True,
                                         'lessons': ['Mean–Variance Optimization and Its Estimation Error',
                                                     'Covariance Shrinkage (Ledoit–Wolf) and Risk Parity',
                                                     'Value-at-Risk, Expected Shortfall and Stress Testing',
                                                     'Kelly Sizing and Drawdown Control',
                                                     'Constructing a Risk-Parity Portfolio from Your Signals']},
                                        {'id': 'simulation_project',
                                         'title': 'Agent-Based Market and Mechanism Simulation Projects',
                                         'summary': 'Alternative capstone track: test a market or mechanism design with strategic '
                                                    'agents.',
                                         'lab': True,
                                         'lessons': ['Designing Zero-Intelligence and Strategic Trader Agents',
                                                     'Simulating a Continuous Double Auction Limit Order Book',
                                                     'Evaluating Auction Formats with Learning Bidders',
                                                     'Measuring Efficiency, Revenue and Stability in Simulated Markets']},
                                        {'id': 'capstone_defense',
                                         'title': 'Capstone Report, Ethics and Defense',
                                         'summary': 'Writing up results and presenting them as a professional quant would.',
                                         'lessons': ['Writing a Quant Research Report: Hypothesis, Method, Results, Caveats',
                                                     'Market Ethics, Manipulation Rules and Regulatory Constraints',
                                                     'Presenting to an Investment Committee',
                                                     'Defending Your Capstone Against Adversarial Questions']}]},
                           {'id': 'gt_540',
                            'code': 'GT 540',
                            'title': 'Deep Quantitative Modeling, Limit-Order-Book Transformers & '
                                     'Multi-Agent Markets',
                            'level': 500,
                            'credits': 4,
                            'description': 'Deep LOB architectures (DeepLOB/Transformers), neural SDEs for '
                                           'market generation, signature methods on rough paths, and '
                                           'multi-agent market ecology.',
                            'prerequisites': ['gt_340', 'gt_510', 'gt_440'],
                            'modules': [{'id': 'deep_lob_architectures',
                                         'title': 'Deep Learning on L3 Limit Order Books: DeepLOB, Temporal '
                                                  'Convolutions & Attention',
                                         'summary': 'Spatial-temporal convolutions across price levels, '
                                                    'permutation-equivariant order embeddings, and '
                                                    'multi-horizon mid-price/fill prediction.',
                                         'lab': True,
                                         'lessons': ['Stationary Normalization of L2/L3 Order Book Tensors: '
                                                     'Relative Tick Offsets and Log-Depth Profiles',
                                                     'DeepLOB Architecture: Spatial Convolutions Across '
                                                     'Price/Volume Levels + Inception Temporal Modules + '
                                                     'LSTM',
                                                     'Causal Dilated Temporal Convolutional Networks '
                                                     '(WaveNet) and Axial Attention on Order Book Events',
                                                     'Event-Stream Tokenization of NASDAQ ITCH Messages for '
                                                     'Autoregressive Market Foundation Models',
                                                     'Surviving the Latency Budget: Model Quantization, '
                                                     'TensorRT/ONNX Compilation, and FPGA Inference '
                                                     'Constraints',
                                                     'Evaluating Microstructure Forecasts: Why '
                                                     'Classification Accuracy Misleads Without Queue-Fill '
                                                     'Simulation'],
                                         'sim': 'attention_viz'},
                                        {'id': 'path_signatures_neural_sdes',
                                         'title': 'Rough Path Signatures, Neural CDEs & Generative Market '
                                                  'Models',
                                         'summary': "Chen's iterated-integral path signatures, Kidger's "
                                                    'Neural Controlled Differential Equations, and '
                                                    'Martingale Optimal Transport / Neural SDEs.',
                                         'lab': True,
                                         'lessons': ["Lyons's Theory of Rough Paths and Chen's "
                                                     'Iterated-Integral Signature Transform of '
                                                     'Multi-Dimensional Streams',
                                                     'Universal Nonlinearity of Signatures: Why Linear '
                                                     'Regression on Path Signatures Approximates Any '
                                                     'Continuous Path Functional',
                                                     'Neural Controlled Differential Equations (Neural CDEs) '
                                                     'for Irregularly Sampled Asynchronous Financial Ticks',
                                                     'Neural SDEs as Generative Market Models: Training '
                                                     'Drift and Volatility Networks via Wasserstein GANs / '
                                                     'Scoring Rules',
                                                     'Martingale Optimal Transport '
                                                     '(Beiglböck–Henry-Labordère–Penkner) for Model-Free '
                                                     'Exotic Bounds',
                                                     'Deep Hedging (Bühler et al.): Training Recurrent '
                                                     'Hedging Policies Directly Under Transaction Costs and '
                                                     'Risk Measures'],
                                         'sim': 'nn_playground'},
                                        {'id': 'alt_data_nlp_sentiment',
                                         'title': 'Financial NLP, Earnings Call Embeddings & Supply-Chain '
                                                  'Graph Alpha',
                                         'summary': 'SEC 10-K/10-Q diffing, earnings-call cross-modal tone '
                                                    'analysis, dynamic customer-supplier knowledge graphs, '
                                                    'and point-in-time hygiene.',
                                         'lab': True,
                                         'lessons': ['Point-in-Time (PIT) Data Architecture: Eliminating '
                                                     'Restatement Look-Ahead Bias and Survivorship Bias',
                                                     'Semantic Diffing of SEC 10-K Risk Factors (Lazy Prices '
                                                     '— Cohen, Malloy & Nguyen) and Filing Complexity',
                                                     'Fine-Tuning Domain Language Models on Earnings Call '
                                                     'Transcripts for Post-Earnings Announcement Drift '
                                                     '(PEAD)',
                                                     'Constructing Supply-Chain, Patent-Citation, and '
                                                     'Shared-Analyst Graphs for Momentum Spillover Alpha '
                                                     '(Cohen–Frazzini)',
                                                     'Temporal Graph Neural Networks for Propagating '
                                                     'Earnings Surprises Across Customer-Supplier Edges',
                                                     'Combining Alternative Data Streams (Satellite Foot '
                                                     'Traffic, Credit Card Panels, Shipping AIS) with '
                                                     'Nowcasting'],
                                         'sim': 'graph_theory'},
                                        {'id': 'market_ecology_endogenous_risk',
                                         'title': 'Market Ecology, Crowded Trades, Contagion & Flash Crash '
                                                  'Dynamics',
                                         'summary': 'Kyle–Obizhaeva market invariance, Khandani–Lo 2007 '
                                                    'Quant Quake unwinding cascades, CoVaR systemic risk, '
                                                    'and agent-based phase transitions.',
                                         'lab': True,
                                         'lessons': ["Farmer's Market Ecology: Coexistence and Trophic "
                                                     'Interactions of Trend-Followers, Value Investors, and '
                                                     'Market Makers',
                                                     "Khandani & Lo (2007) 'What Happened to the Quants?': "
                                                     'De-Leveraging Contagion Across Crowded Factor '
                                                     'Portfolios',
                                                     'Predatory Trading (Brunnermeier–Pedersen): '
                                                     'Front-Running Distressed Fire-Sale Liquidations',
                                                     'Endogenous Liquidity Crises: Margin Spiral + Loss '
                                                     'Spiral Amplification Loops',
                                                     'Kyle & Obizhaeva Market Microstructure Invariance '
                                                     'Hypothesis (Trading Activity Invariants Across Assets)',
                                                     'Agent-Based Phase Transitions (Minority Game / Santa '
                                                     'Fe Artificial Stock Market) and Circuit Breaker '
                                                     'Design'],
                                         'sim': 'agent_sim'},
                                        {'id': 'ultra_low_latency_systems',
                                         'title': 'Ultra-Low-Latency Systems Engineering: Kernel Bypass, '
                                                  'Lock-Free & FPGA',
                                         'summary': 'Solarflare OpenOnload/DPDK kernel bypass, L1/L2 '
                                                    'cache-line alignment, lock-free SPSC ring buffers, and '
                                                    'deterministic nanosecond profiling.',
                                         'lab': True,
                                         'lessons': ['Anatomy of Tick-to-Trade Latency: Optical Fiber '
                                                     'Propagation, Switch Serialization, NIC DMA, OS Kernel, '
                                                     'Strategy',
                                                     'Kernel Bypass Networking: DPDK, Solarflare ef_vi / '
                                                     'OpenOnload, and Busy-Polling CPU Core Pinning '
                                                     '(isolcpus)',
                                                     'CPU Microarchitecture Optimization: Cache-Line '
                                                     'Alignment (64B), False Sharing Elimination, and '
                                                     'Branchless Code',
                                                     'Wait-Free Single-Producer Single-Consumer (SPSC) Ring '
                                                     'Buffers with C++20 Acquire/Release Memory Ordering',
                                                     'Avoiding Page Faults, TLB Misses (2MB/1GB HugePages), '
                                                     'and Dynamic Heap Allocations on the Hot Path',
                                                     'Hardware Timestamping (PTP IEEE 1588) and Tail-Latency '
                                                     '(p99.99) Jitter Analysis'],
                                         'sim': 'state_machine'}]}]}]}
