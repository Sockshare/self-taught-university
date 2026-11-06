"""Self-Taught curriculum catalog — Psychology & Behavioral Science domain.

Pure data (see docs/CONTRACTS.md §1). The two tiny helpers below only remove dict boilerplate;
the exported DOMAIN is plain dicts / lists / strings / ints / bools.

Arc modeled on APA Guidelines for the Undergraduate Psychology Major (v3.0) and top research-focused
M.S. programs: a 100–300 core (methods, statistics, cognitive, biological, developmental, social,
personality, clinical, learning), 400-level senior electives, and a 500–600 graduate tier with advanced
quantitative methods (MLM/SEM, Bayesian & meta-analysis, psychometrics/IRT), computational modeling,
clinical science, health and I-O psychology, professional ethics, and an M.S. thesis practicum.

Extra keys (preserved by the loader): DOMAIN["faculty"] roster and per-course "instructor" (faculty id).
"""


def _m(mid, title, summary, lessons, sim=None, lab=False):
    d = {"id": mid, "title": title, "summary": summary, "lessons": lessons}
    if sim:
        d["sim"] = sim
    if lab:
        d["lab"] = True
    return d


def _c(cid, code, title, level, credits, instructor, description, prerequisites, modules):
    return {
        "id": cid,
        "code": code,
        "title": title,
        "level": level,
        "credits": credits,
        "instructor": instructor,
        "description": description,
        "prerequisites": prerequisites,
        "modules": modules,
    }


# ---------------------------------------------------------------------------------------------
# 1. Foundations, Research Methods & Open Science
# ---------------------------------------------------------------------------------------------
PSYCH_101 = _c(
    "psych_101", "PSYC 101", "Introduction to Psychological Science", 100, 5, "helena_marsh",
    "Survey the science of mind and behavior from neurons to cultures. You will be able to explain core findings across every major subfield, evaluate everyday psychological claims, and apply evidence-based learning strategies to your own study.",
    [],
    [
        _m("science_of_mind", "Psychology as a Science", "Why intuition fails and how the scientific method lets psychology build cumulative knowledge.", [
            "What Psychologists Study: Levels of Analysis from Neurons to Cultures",
            "From Wundt's Leipzig Laboratory to Modern Psychological Science",
            "Intuition, Hindsight Bias, and Why We Need the Scientific Method",
            "Theories, Hypotheses, and Operational Definitions in Psychology",
            "The Replication Crisis in Brief: Why Psychology Reformed Its Methods",
        ], lab=True),
        _m("brain_behavior_intro", "The Biological Bases of Behavior", "A first look at how neurons, brain systems, and genes shape thought and action.", [
            "Neurons, Action Potentials, and Synaptic Communication for Psychologists",
            "A Guided Tour of the Brain: Lobes, Subcortical Structures, and Hemispheres",
            "Phineas Gage and H.M.: What Brain Damage Teaches Us, Separating Fact from Myth",
            "Genes, Environment, and Heritability: Twin and Adoption Studies",
        ]),
        _m("sensation_attention_intro", "Sensation, Perception & Attention", "How the mind builds a world from raw sensory energy and selects what matters.", [
            "Transduction: How the Senses Convert Energy into Neural Signals",
            "Gestalt Principles and Perceptual Organization",
            "Selective Attention, the Cocktail Party Effect, and Inattentional Blindness",
            "The Stroop Effect: Automaticity and Cognitive Control",
        ], sim="psych_stroop"),
        _m("learning_memory_intro", "Learning & Memory", "Conditioning, the shape of forgetting, and how to study in ways that actually work.", [
            "Pavlov's Dogs and the Logic of Classical Conditioning",
            "Thorndike's Law of Effect and Skinner's Operant Conditioning",
            "Ebbinghaus and the Forgetting Curve: Memory Decays Predictably",
            "Memory Is Reconstructive: Loftus and Palmer's Car-Crash Study",
            "Evidence-Based Study Strategies: Retrieval Practice and Spacing",
        ], sim="psych_forgetting_curve"),
        _m("development_social_intro", "Development, Personality & Social Life", "How we grow, how we differ, and how powerfully situations shape behavior.", [
            "Piaget's Stages and Vygotsky's Zone of Proximal Development in Overview",
            "Attachment from Harlow's Monkeys to Ainsworth's Strange Situation",
            "The Big Five Personality Traits at a Glance",
            "Conformity, Obedience, and the Power of the Situation: Asch and Milgram",
        ], sim="psych_asch_conformity"),
        _m("mental_health_intro", "Psychological Disorders & Treatment", "What counts as a disorder, the major diagnostic families, and how treatment evolved.", [
            "Defining Abnormality: Distress, Dysfunction, and the DSM-5-TR",
            "Anxiety, Depression, and Schizophrenia: An Introductory Overview",
            "From Asylums to Evidence-Based Therapy: A Brief History of Treatment",
            "Stigma, Help-Seeking, and the Science of Well-Being",
        ]),
    ],
)

PSYCH_201 = _c(
    "psych_201", "PSYC 201", "Research Methods in Psychology", 200, 5, "greta_vogel",
    "Design, run, and report psychological studies. You will be able to choose an appropriate design, defend its validity, program a reaction-time experiment, handle ethics review, and write an APA-style empirical report.",
    ["psych_101", "stat_101"],
    [
        _m("research_questions", "From Questions to Testable Hypotheses", "Turning curiosity into constructs, operational definitions, and preregistered predictions.", [
            "Sources of Research Ideas and Reading the Primary Literature",
            "Constructs, Variables, and Operationalization",
            "Reliability and Validity: Internal, External, Construct, and Statistical Conclusion",
            "Preregistration and Registered Reports: Committing to a Plan",
        ]),
        _m("descriptive_correlational", "Descriptive & Correlational Designs", "Observation, surveys, and correlational designs — and what they can and cannot tell you.", [
            "Naturalistic Observation, Coding Schemes, and Inter-Rater Reliability",
            "Survey Design: Question Wording, Response Scales, and Sampling",
            "Correlation Does Not Imply Causation: Third Variables and Directionality",
            "Longitudinal versus Cross-Sectional Designs",
        ], lab=True),
        _m("experiments", "Experimental Design", "Random assignment, factorial designs, and controlling confounds for causal inference.", [
            "Random Assignment and the Logic of Causal Inference",
            "Between-Subjects versus Within-Subjects Designs and Counterbalancing",
            "Factorial Designs, Main Effects, and Interactions",
            "Confounds, Demand Characteristics, and Double-Blind Procedures",
            "Quasi-Experiments and Single-Case Designs",
        ], lab=True),
        _m("measurement_methods", "Reaction-Time Paradigms & Behavioral Measurement", "Building trials and blocks, and choosing among behavioral, self-report, and physiological measures.", [
            "Building a Reaction-Time Experiment: Trials, Blocks, and Randomization",
            "Self-Report, Implicit Measures, and the IAT Controversy",
            "Physiological Measures: Heart Rate, Skin Conductance, and Eye Tracking",
            "Online Data Collection, Attention Checks, and Data Quality",
        ], sim="psych_visual_search", lab=True),
        _m("research_ethics", "Research Ethics", "The history and principles that govern research with human participants.", [
            "Nuremberg, Tuskegee, and the Belmont Report",
            "Informed Consent, Deception, and Debriefing",
            "Revisiting Milgram and the Stanford Prison Experiment: Ethics, Validity, and Archival Critiques",
            "IRBs, Data Privacy, and Research with Vulnerable Populations",
        ]),
        _m("apa_writing", "Scientific Communication in APA Style", "Writing, visualizing, and critically reading empirical research reports.", [
            "Anatomy of an APA-Style Empirical Report",
            "Writing Results Sections: Reporting Statistics and Effect Sizes",
            "Figures and Tables that Tell the Truth",
            "Peer Review and How to Read a Paper Critically",
        ], lab=True),
    ],
)

PSYCH_310 = _c(
    "psych_310", "PSYC 310", "Open Science, Replication & Meta-Science", 300, 4, "greta_vogel",
    "Understand why many published findings failed to replicate and how the field is fixing it. You will be able to diagnose questionable research practices, preregister studies, build reproducible pipelines, and use equivalence tests and Bayes factors.",
    ["psych_201", "psych_210"],
    [
        _m("replication_crisis", "Anatomy of the Replication Crisis", "The landmark events and large-scale replication projects that reshaped psychology.", [
            "Bem's Precognition Paper and the 2011 Wake-Up Call",
            "The Open Science Collaboration's 2015 Reproducibility Project",
            "Many Labs, Registered Replication Reports, and Ego Depletion's Replication Failure",
            "Failed and Contested Replications: Power Posing, Elderly-Walking Priming, and Facial Feedback",
        ], sim="psych_power_replication"),
        _m("qrps", "Questionable Research Practices", "How flexible analysis inflates false positives — simulated, then detected.", [
            "Researcher Degrees of Freedom and the Garden of Forking Paths",
            "p-Hacking, HARKing, and Optional Stopping Simulated",
            "Publication Bias and the File-Drawer Problem",
            "Detecting Problems: p-Curve, GRIM, and statcheck",
        ], lab=True),
        _m("open_practices", "Open Science Practices", "Concrete tools for transparent, reproducible research.", [
            "Preregistration Templates on the Open Science Framework",
            "Open Data, Open Materials, and the FAIR Principles",
            "Reproducible Analysis Pipelines with Version Control and Notebooks",
            "Registered Reports and Results-Blind Review",
        ], lab=True),
        _m("better_inference", "Beyond p < .05", "Inferential tools that can support the null and control error rates honestly.", [
            "Equivalence Testing and the Smallest Effect Size of Interest",
            "Bayes Factors as Evidence for the Null",
            "Sequential Analysis with Alpha Spending",
            "Redefining Statistical Significance: The p < .005 Debate",
        ], sim="bayes_belief", lab=True),
        _m("generalizability", "Generalizability & Diversity", "Who psychology studies, and whether findings travel across populations.", [
            "WEIRD Samples: Henrich, Heine, and Norenzayan's Critique",
            "Constraints on Generality Statements",
            "Big-Team Science: The Psychological Science Accelerator",
            "Measurement Invariance as a Prerequisite for Cross-Group Comparison",
        ]),
        _m("theory_crisis", "Theory, Measurement & the Future of the Field", "Why better statistics alone cannot fix weak theory and sloppy measurement.", [
            "The Theory Crisis: Why Better Statistics Are Not Enough",
            "Questionable Measurement Practices and Jingle-Jangle Fallacies",
            "Formal Models as a Cure for Vague Verbal Theories",
            "Incentives, Metascience, and Reforming Academic Culture",
        ]),
    ],
)

PSYCH_690 = _c(
    "psych_690", "PSYC 690", "M.S. Thesis & Research Practicum", 600, 6, "rafael_ibanez",
    "Conceive, preregister, run, analyze, write, and defend an original empirical thesis. You will be able to carry a study from systematic review to Stage 1 Registered Report, confirmatory analysis, and a public defense with open data and code.",
    ["psych_510", "psych_515", "psych_580"],
    [
        _m("thesis_proposal", "Formulating the Thesis Question", "Finding a genuine gap, stating falsifiable predictions, and defending a proposal.", [
            "Conducting a Systematic Literature Review with PRISMA Methods",
            "Identifying a Theoretical Gap and Stating Falsifiable Predictions",
            "Writing the Thesis Proposal: Introduction, Aims, and Hypotheses",
            "Assembling a Committee and Defending the Proposal",
        ], lab=True),
        _m("design_prereg", "Design, Power & Preregistration", "Simulation-based power, Registered Report protocols, and ethics approval.", [
            "Simulation-Based Power Analysis for Mixed and Multilevel Designs",
            "Writing a Stage 1 Registered Report Protocol",
            "Specifying Exclusion Criteria and Analysis Plans in Advance",
            "Obtaining IRB Approval for the Thesis Study",
        ], sim="psych_power_replication", lab=True),
        _m("data_collection", "Running the Study", "Programming, piloting, and running the study with high fidelity and secure data handling.", [
            "Programming Experiments in PsychoPy and jsPsych",
            "Piloting, Manipulation Checks, and Protocol Fidelity",
            "Data Management Plans and Secure Storage",
            "Monitoring Data Quality During Collection",
        ], lab=True),
        _m("analysis_thesis", "Analysis & Robustness", "Executing the confirmatory plan and probing robustness transparently.", [
            "Executing the Confirmatory Analysis Plan",
            "Exploratory Analyses Clearly Labeled as Such",
            "Multiverse and Specification-Curve Analyses",
            "Sensitivity Analyses and Handling Missing Data",
        ], lab=True),
        _m("writing_thesis", "Writing the Thesis", "Turning results into an honest, publishable manuscript.", [
            "Writing a Discussion that Respects Your Effect Sizes",
            "Limitations, Constraints on Generality, and Future Directions",
            "Preparing a Manuscript for Journal Submission",
            "Responding to Reviewers Constructively",
        ]),
        _m("defense_dissemination", "Defense & Dissemination", "Presenting, defending, and openly sharing the finished work.", [
            "Designing an Effective Conference Poster and Talk",
            "The Oral Thesis Defense: Preparation and Common Questions",
            "Sharing Data, Code, and Preprints Openly",
            "Next Steps: Ph.D. Applications, Industry Research, and Accredited Routes to Clinical Practice",
        ]),
    ],
)

# ---------------------------------------------------------------------------------------------
# 2. Quantitative Psychology & Psychometrics
# ---------------------------------------------------------------------------------------------
PSYCH_210 = _c(
    "psych_210", "PSYC 210", "Statistics for the Behavioral Sciences", 200, 5, "greta_vogel",
    "Analyze psychological data with confidence. You will be able to describe distributions, run and interpret t-tests, ANOVA, correlation, regression and chi-square tests in Python, report effect sizes, and plan sample sizes with power analysis.",
    ["psych_101", "stat_101"],
    [
        _m("describing_data", "Describing Data", "Measurement scales, descriptive statistics, and honest visualization of psychological data.", [
            "Scales of Measurement: Nominal, Ordinal, Interval, and Ratio",
            "Central Tendency, Variability, and Skewed Distributions",
            "z-Scores and the Normal Distribution",
            "Visualizing Psychological Data: Histograms, Boxplots, and Raincloud Plots",
        ], sim="distribution_explorer", lab=True),
        _m("sampling_inference", "Sampling Distributions & Hypothesis Testing", "The logic of NHST, error types, and estimation with confidence intervals.", [
            "Sampling Distributions and the Central Limit Theorem",
            "Null Hypothesis Significance Testing and What a p-Value Is Not",
            "Type I and Type II Errors, Alpha, and Statistical Power",
            "Confidence Intervals as Estimation",
        ], sim="distribution_explorer", lab=True),
        _m("t_tests", "t-Tests and Effect Sizes", "Comparing means and quantifying how big a difference really is.", [
            "One-Sample and Independent-Samples t-Tests",
            "Paired-Samples t-Tests for Repeated Measures",
            "Cohen's d, Hedges' g, and Interpreting Effect Sizes",
            "Assumption Checks: Normality, Homogeneity, and Welch's Correction",
        ], lab=True),
        _m("anova", "Analysis of Variance", "Partitioning variance across one-way, factorial, and repeated-measures designs.", [
            "One-Way ANOVA and Partitioning Variance",
            "Post Hoc Tests and Multiple-Comparison Corrections",
            "Two-Way Factorial ANOVA and Interpreting Interactions",
            "Repeated-Measures ANOVA and Sphericity",
        ], lab=True),
        _m("correlation_regression", "Correlation & Simple Regression", "Quantifying association and prediction, and the artifacts that distort them.", [
            "Pearson and Spearman Correlation Coefficients",
            "Simple Linear Regression and Least Squares",
            "Residuals, Outliers, and Influential Points",
            "Restriction of Range and Attenuation by Unreliability",
        ], sim="regression_fit", lab=True),
        _m("categorical_power", "Categorical Data & Power Analysis", "Chi-square and nonparametric tests, and why small samples exaggerate effects.", [
            "Chi-Square Tests of Independence and Goodness of Fit",
            "Nonparametric Alternatives: Mann-Whitney, Wilcoxon, and Kruskal-Wallis",
            "A Priori Power Analysis and Sample Size Planning",
            "Why Underpowered Studies Exaggerate Effects: The Winner's Curse",
        ], sim="psych_power_replication", lab=True),
    ],
)

PSYCH_410 = _c(
    "psych_410", "PSYC 410", "Multiple Regression, Generalized Linear & Mixed Models", 400, 4, "priya_raman",
    "Move beyond ANOVA to the modeling toolkit of modern psychology. You will be able to fit and interpret multiple regression, moderation and mediation, GLMs, crossed random-effects models for trial-level data, multivariate methods, and principled missing-data handling.",
    ["psych_210", "stat_230"],
    [
        _m("multiple_regression", "Multiple Regression", "Statistical control, coding schemes, and incremental validity.", [
            "Partial Regression Coefficients and Statistical Control",
            "Multicollinearity, Variance Inflation, and Suppression Effects",
            "Dummy and Effect Coding for Categorical Predictors",
            "Hierarchical Regression and Incremental Validity",
        ], sim="regression_fit", lab=True),
        _m("moderation_mediation", "Moderation & Mediation", "Probing interactions and estimating indirect effects — with appropriate causal humility.", [
            "Interaction Terms, Centering, and Simple Slopes",
            "Johnson-Neyman Intervals for Probing Interactions",
            "Mediation with Bootstrapped Indirect Effects",
            "Why Cross-Sectional Mediation Rarely Supports Causal Claims",
        ], lab=True),
        _m("glm", "Generalized Linear Models", "Modeling binary, count, and ordinal outcomes common in psychology.", [
            "Logistic Regression for Binary Outcomes such as Diagnosis",
            "Poisson and Negative Binomial Models for Count Data",
            "Ordinal Regression for Likert-Type Responses",
            "Model Comparison with AIC, BIC, and Likelihood-Ratio Tests",
        ], lab=True),
        _m("mixed_models_intro", "Linear Mixed-Effects Models", "Trial-level modeling with random effects for participants and stimuli.", [
            "Random Intercepts and Random Slopes",
            "Crossed Random Effects for Subjects and Items",
            "Mixed Models for Reaction-Time Data versus Aggregated ANOVA",
            "Convergence Problems and the Maximal-versus-Parsimonious Random-Effects Debate",
        ], lab=True),
        _m("multivariate", "Multivariate Methods", "Dimension reduction, group separation, clustering, and similarity spaces.", [
            "Principal Component Analysis for Psychological Scales",
            "MANOVA and Discriminant Function Analysis",
            "Cluster Analysis and Latent Profile Thinking",
            "Multidimensional Scaling of Similarity Judgments",
        ], sim="kmeans", lab=True),
        _m("robust_missing", "Robust Methods & Missing Data", "Analyses that survive outliers, non-normality, and incomplete data.", [
            "Robust Regression and Trimmed Means",
            "Missing Data Mechanisms: MCAR, MAR, and MNAR",
            "Multiple Imputation in Practice",
            "Bootstrapping and Permutation Tests for Psychological Data",
        ], lab=True),
    ],
)

PSYCH_510 = _c(
    "psych_510", "PSYC 510", "Advanced Quantitative Methods I: Multilevel Modeling & SEM", 500, 4, "rafael_ibanez",
    "Model nested, longitudinal, and latent-variable data at a publishable standard. You will be able to specify and diagnose multilevel growth models, CFA and full SEMs, test measurement invariance, and fit mixture models with lavaan-style tooling.",
    ["psych_410"],
    [
        _m("mlm_foundations", "Multilevel Model Foundations", "Clustering, the ICC, and correct centering of predictors at each level.", [
            "Nested Data: Students in Classrooms and Patients in Therapists",
            "The Intraclass Correlation and Design Effects",
            "Level-1 and Level-2 Predictors and Cross-Level Interactions",
            "Centering Within Clusters versus Grand-Mean Centering",
        ], lab=True),
        _m("longitudinal_mlm", "Longitudinal & Intensive Data", "Modeling change and within-person dynamics from panels to EMA.", [
            "Growth Curve Models of Change",
            "Ecological Momentary Assessment and Within-Person Dynamics",
            "Autoregressive and Dynamic Structural Equation Models",
            "Disaggregating Between-Person and Within-Person Effects",
        ], lab=True),
        _m("path_cfa", "Path Analysis & Confirmatory Factor Analysis", "Identification, CFA of scales, and responsible use of fit indices.", [
            "Path Diagrams, Model Identification, and Degrees of Freedom",
            "Confirmatory Factor Analysis of Multi-Item Scales",
            "Fit Indices: Chi-Square, CFI, RMSEA, and SRMR",
            "Modification Indices and the Dangers of Data-Driven Respecification",
        ], lab=True),
        _m("full_sem", "Full Structural Equation Models", "Latent regressions, latent mediation, and panel models that separate trait from state.", [
            "Latent Variable Regression and Correcting for Measurement Error",
            "Latent Mediation Models",
            "Cross-Lagged Panel Models and the Random-Intercept CLPM",
            "Estimators for Non-Normal and Categorical Indicators",
        ], lab=True),
        _m("invariance", "Measurement Invariance & Multigroup Models", "Establishing that a scale means the same thing across groups before comparing them.", [
            "Configural, Metric, Scalar, and Strict Invariance",
            "Partial Invariance and Alignment Optimization",
            "Multigroup SEM for Cross-Cultural Comparisons",
            "Differential Item Functioning versus Invariance Testing",
        ], lab=True),
        _m("latent_classes", "Mixture & Latent Class Models", "Finding unobserved subgroups — and reporting such models responsibly.", [
            "Latent Class and Latent Profile Analysis",
            "Growth Mixture Models and Trajectory Classes",
            "Choosing the Number of Classes: BIC, Entropy, and Bootstrap LRT",
            "Reporting Standards for SEM and Multilevel Analyses",
        ], sim="kmeans", lab=True),
    ],
)

PSYCH_515 = _c(
    "psych_515", "PSYC 515", "Advanced Quantitative Methods II: Bayesian Inference & Meta-Analysis", 500, 4, "rafael_ibanez",
    "Reason with posterior distributions and synthesize literatures. You will be able to build hierarchical Bayesian models in Stan/PyMC, compute and critique Bayes factors, and run random-effects and bias-corrected meta-analyses.",
    ["psych_410", "psych_310"],
    [
        _m("bayes_foundations", "Bayesian Foundations", "Priors, likelihoods, posteriors, and checking priors before seeing data.", [
            "Bayes' Theorem for Psychologists: Priors, Likelihoods, and Posteriors",
            "Conjugate Models and Beta-Binomial Updating",
            "Credible Intervals versus Confidence Intervals",
            "Prior Elicitation and Prior Predictive Checks",
        ], sim="bayes_belief", lab=True),
        _m("mcmc", "Computation with MCMC", "Sampling posteriors and diagnosing whether the sampler worked.", [
            "Markov Chain Monte Carlo and the Metropolis Algorithm",
            "Hamiltonian Monte Carlo with Stan and PyMC",
            "Convergence Diagnostics: R-hat, Effective Sample Size, and Divergences",
            "Posterior Predictive Checks",
        ], lab=True),
        _m("bayesian_models", "Bayesian Regression & Hierarchical Models", "Partial pooling and realistic likelihoods for psychological data.", [
            "Bayesian Linear and Logistic Regression with brms",
            "Hierarchical Partial Pooling and Shrinkage",
            "Bayesian Mixed Models for Reaction Times with Shifted Lognormal Likelihoods",
            "Model Comparison with LOO-CV and WAIC",
        ], lab=True),
        _m("bayes_factors", "Bayesian Hypothesis Testing", "Bayes factors, their prior sensitivity, and estimation-based alternatives.", [
            "Bayes Factors, the Savage-Dickey Ratio, and Default JZS Priors",
            "Sensitivity of Bayes Factors to Prior Width",
            "Bayesian Sequential Designs with Optional Stopping",
            "Region of Practical Equivalence Decisions",
        ], sim="bayes_belief", lab=True),
        _m("meta_analysis", "Meta-Analysis", "Combining effect sizes and explaining their heterogeneity.", [
            "Effect Size Extraction and Conversion Across Designs",
            "Fixed-Effect versus Random-Effects Meta-Analysis",
            "Heterogeneity: Q, I-squared, Tau, and Prediction Intervals",
            "Meta-Regression and Moderator Analysis",
        ], lab=True),
        _m("bias_correction", "Publication Bias & Advanced Synthesis", "Correcting for selective publication and synthesizing complex evidence.", [
            "Funnel Plots, Egger's Test, and Trim-and-Fill",
            "PET-PEESE, Selection Models, and Robust Bayesian Meta-Analysis",
            "Multilevel Meta-Analysis of Dependent Effect Sizes",
            "Individual Participant Data and Network Meta-Analysis",
        ], sim="psych_power_replication", lab=True),
    ],
)

PSYCH_520 = _c(
    "psych_520", "PSYC 520", "Psychometrics, Measurement & Item Response Theory", 500, 4, "thomas_reinholt",
    "Build and evaluate psychological measures to professional standards. You will be able to estimate reliability, argue validity, develop a scale with EFA, fit Rasch/2PL/graded-response IRT models, detect DIF, and design an adaptive test.",
    ["psych_410"],
    [
        _m("ctt", "Classical Test Theory", "True scores, error, and the many faces of reliability.", [
            "True Scores, Error, and the Classical Test Theory Model",
            "Reliability Coefficients: Test-Retest, Alpha, and Omega",
            "Standard Error of Measurement and Score Confidence Bands",
            "Spearman-Brown Prophecy and Test Length",
        ], lab=True),
        _m("validity", "Validity Theory", "From the nomological network to Messick's unified framework.", [
            "Cronbach and Meehl's Construct Validity and the Nomological Network",
            "Messick's Unified Validity Framework",
            "Convergent and Discriminant Validity in the Multitrait-Multimethod Matrix",
            "Criterion Validity, Incremental Validity, and Test Fairness",
        ]),
        _m("efa_scale", "Exploratory Factor Analysis & Scale Development", "Writing items, extracting factors, and the origins of the Big Five.", [
            "Writing and Reviewing Items for a New Scale",
            "Exploratory Factor Analysis: Extraction, Parallel Analysis, and Rotation",
            "Bifactor Models and the Question of General Factors",
            "The Lexical Hypothesis and the Factor-Analytic Origins of the Big Five",
        ], sim="psych_big_five", lab=True),
        _m("irt", "Item Response Theory", "Modeling item-level responses as a function of latent trait level.", [
            "The Rasch and One-Parameter Logistic Models",
            "Two- and Three-Parameter Logistic Models: Discrimination and Guessing",
            "Item and Test Information Functions",
            "Polytomous IRT: Graded Response and Partial Credit Models",
        ], lab=True),
        _m("cat_dif", "Adaptive Testing & Item Bias", "Efficient adaptive measurement and detecting items that behave differently across groups.", [
            "Computerized Adaptive Testing and the PROMIS Item Banks",
            "Detecting Differential Item Functioning with IRT and Logistic Regression",
            "Test Equating and Linking Across Forms",
            "Person-Fit Statistics and Careless Responding",
        ], lab=True),
        _m("network_psychometrics", "Modern & Network Psychometrics", "Network models, G-theory, and measurement of within-person processes.", [
            "Psychometric Network Models of Symptoms",
            "Generalizability Theory and Multiple Sources of Error",
            "Intensive Longitudinal Measurement and Within-Person Reliability",
            "Standards for Educational and Psychological Testing in Practice",
        ], lab=True),
    ],
)

# ---------------------------------------------------------------------------------------------
# 3. Cognitive Psychology & Cognitive Neuroscience
# ---------------------------------------------------------------------------------------------
PSYCH_220 = _c(
    "psych_220", "PSYC 220", "Sensation & Perception", 200, 4, "kenji_morimoto",
    "Discover how the brain constructs perceptual experience. You will be able to measure thresholds, apply Weber's and Stevens' laws, compute d' and criterion from detection data, and explain illusions, object recognition, and multisensory integration.",
    ["psych_101"],
    [
        _m("psychophysics", "Psychophysics", "Lawful relationships between physical stimuli and perceived magnitude.", [
            "Absolute Thresholds and the Method of Constant Stimuli",
            "Weber's Law and Just-Noticeable Differences",
            "Fechner's Logarithmic Law versus Stevens' Power Law",
            "Adaptive Staircases and Psychometric Function Fitting",
        ], sim="psych_psychophysics", lab=True),
        _m("sdt", "Signal Detection Theory", "Separating perceptual sensitivity from response bias.", [
            "Hits, Misses, False Alarms, and Correct Rejections",
            "Sensitivity (d') and Response Criterion (c)",
            "ROC Curves and the Area Under the Curve",
            "Signal Detection in Radiology, Eyewitness Lineups, and Airport Screening",
        ], sim="psych_signal_detection", lab=True),
        _m("vision", "The Visual System", "From photoreceptors to the two cortical visual streams.", [
            "The Retina: Photoreceptors, Lateral Inhibition, and Mach Bands",
            "Hubel and Wiesel's Feature Detectors in V1",
            "Trichromatic and Opponent-Process Theories of Color Vision",
            "Dorsal and Ventral Streams: Vision for Action versus Recognition",
        ]),
        _m("depth_illusion", "Depth, Size & Visual Illusions", "How the visual system infers 3-D structure — and what illusions reveal.", [
            "Monocular and Binocular Depth Cues",
            "Size Constancy and the Ames Room",
            "The Müller-Lyer Illusion and the Contested Carpentered-World Hypothesis",
            "Perception as Unconscious Inference: Helmholtz to Predictive Processing",
        ], sim="psych_muller_lyer"),
        _m("object_face", "Object, Face & Motion Perception", "Binding features, recognizing objects and faces, and seeing motion.", [
            "Feature Integration Theory and Visual Search",
            "Biederman's Recognition-by-Components Theory",
            "The Fusiform Face Area and Prosopagnosia",
            "Motion Perception, Apparent Motion, and Akinetopsia",
        ], sim="psych_visual_search"),
        _m("other_senses", "Audition, Touch, Taste & Multisensory Integration", "The non-visual senses and how the brain fuses information across them.", [
            "Pitch, Loudness, and the Place versus Temporal Theories of Hearing",
            "Auditory Scene Analysis and Sound Localization",
            "Gate Control Theory of Pain and Somatosensation",
            "The McGurk Effect and Multisensory Integration",
        ]),
    ],
)

PSYCH_230 = _c(
    "psych_230", "PSYC 230", "Cognitive Psychology", 200, 5, "naomi_achterberg",
    "Learn how the mind attends, remembers, represents, and reasons. You will be able to explain and replicate classic paradigms — Stroop, serial position, mental rotation, Wason — and evaluate competing models of attention, memory, and language.",
    ["psych_101"],
    [
        _m("cog_revolution", "The Cognitive Revolution", "How psychology rediscovered the mind and learned to time it.", [
            "From Behaviorism to Information Processing: Chomsky's Review of Skinner",
            "Marr's Three Levels of Analysis",
            "Mental Chronometry: Donders' Subtraction Method",
            "Serial versus Parallel Processing: Sternberg's Memory Scanning Task",
        ]),
        _m("attention", "Attention & Cognitive Control", "Early versus late selection, spatial cueing, temporal limits, and executive control.", [
            "Broadbent's Filter, Treisman's Attenuation, and Late Selection Models",
            "Posner Cueing and the Spotlight of Attention",
            "Attentional Blink and the Limits of Temporal Attention",
            "Stroop Interference, Task Switching, and Executive Control",
        ], sim="psych_stroop", lab=True),
        _m("working_memory", "Short-Term & Working Memory", "Capacity limits and the multicomponent architecture of working memory.", [
            "Atkinson and Shiffrin's Modal Model",
            "Miller's Magical Number Seven and Cowan's Four",
            "Baddeley and Hitch's Multicomponent Working Memory Model",
            "The Serial Position Curve: Primacy and Recency Effects",
        ], sim="psych_serial_position", lab=True),
        _m("long_term_memory", "Long-Term Memory", "Encoding, retrieval, forgetting, and the fallibility of memory.", [
            "Levels of Processing and the Testing Effect",
            "Encoding Specificity and Godden and Baddeley's Diving Study: A Mixed Replication Record",
            "Episodic versus Semantic Memory and Tulving's Taxonomy",
            "Interference, Decay, and the Shape of Forgetting",
            "False Memories and the Deese-Roediger-McDermott Paradigm",
        ], sim="psych_forgetting_curve", lab=True),
        _m("imagery_concepts", "Mental Imagery & Concepts", "Analog mental representations and how we carve the world into categories.", [
            "Shepard and Metzler's Mental Rotation Experiments",
            "Kosslyn's Image Scanning and the Imagery Debate",
            "Rosch's Prototype Theory and Basic-Level Categories",
            "Exemplar Models and Semantic Networks",
        ], sim="psych_mental_rotation"),
        _m("language_cog", "Language & Thought", "Speech perception, parsing, aphasia, and whether language shapes thought.", [
            "Phonemes, Morphemes, and Categorical Speech Perception",
            "Garden-Path Sentences and Syntactic Parsing",
            "Broca's and Wernicke's Aphasias",
            "Linguistic Relativity: The Sapir-Whorf Hypothesis Reexamined",
        ]),
        _m("problem_solving", "Problem Solving & Reasoning", "Insight, search through problem spaces, deduction, and expertise.", [
            "Gestalt Insight, Functional Fixedness, and Duncker's Candle Problem",
            "Newell and Simon's Problem-Space Theory",
            "Wason Selection Task and Deductive Reasoning",
            "Analogical Reasoning and Expertise",
        ]),
    ],
)

PSYCH_330 = _c(
    "psych_330", "PSYC 330", "Judgment, Decision-Making & Reasoning", 300, 4, "naomi_achterberg",
    "Understand how people actually choose under risk, delay, and uncertainty. You will be able to contrast expected utility with prospect theory, diagnose heuristics and biases, model choices with drift diffusion, and design choice architecture.",
    ["psych_230", "psych_210"],
    [
        _m("rational_choice", "Normative Models of Choice", "Expected utility, its famous paradoxes, and bounded rationality.", [
            "Expected Utility Theory and the von Neumann-Morgenstern Axioms",
            "The Allais and Ellsberg Paradoxes",
            "Bounded Rationality and Simon's Satisficing",
            "Dual-Process Theories: System 1 and System 2",
        ], lab=True),
        _m("heuristics", "Heuristics & Biases", "Kahneman and Tversky's program and Gigerenzer's ecological-rationality response.", [
            "Kahneman and Tversky's Representativeness Heuristic and the Linda Problem",
            "Availability and Anchoring-and-Adjustment",
            "Base-Rate Neglect and Bayesian Reasoning with Natural Frequencies",
            "Gigerenzer's Ecological Rationality and Fast-and-Frugal Heuristics",
        ], sim="bayes_belief"),
        _m("prospect_theory", "Prospect Theory", "Reference dependence, loss aversion, probability weighting, and framing.", [
            "Reference Dependence and the S-Shaped Value Function",
            "Loss Aversion and the Endowment Effect",
            "Probability Weighting and the Fourfold Pattern of Risk Attitudes",
            "Framing Effects: The Asian Disease Problem",
        ], sim="psych_prospect_theory", lab=True),
        _m("intertemporal", "Intertemporal Choice & Self-Control", "Discounting the future, self-control, and nudging better choices.", [
            "Exponential versus Hyperbolic Discounting",
            "Mischel's Marshmallow Test and Its Much Weaker 2018 Replication",
            "Precommitment Devices and Present Bias",
            "Nudges and Choice Architecture: Effect Sizes and the Publication-Bias Debate",
        ], lab=True),
        _m("sequential_sampling", "Evidence Accumulation Models of Choice", "How noisy evidence accumulates to a bound to produce choices and reaction times.", [
            "The Speed-Accuracy Tradeoff",
            "Ratcliff's Drift Diffusion Model of Two-Choice Decisions",
            "Fitting Diffusion Parameters to Reaction-Time Distributions",
            "Value-Based Choice and the Attentional Drift Diffusion Model",
        ], sim="psych_drift_diffusion", lab=True),
        _m("social_moral_decisions", "Social, Strategic & Moral Decisions", "Fairness, cooperation, moral judgment, and calibration.", [
            "Ultimatum and Dictator Games: Fairness Beyond Self-Interest",
            "Cooperation in the Prisoner's Dilemma",
            "Trolley Problems and Greene's Dual-Process Model of Moral Judgment",
            "Overconfidence, Calibration, and Expert Forecasting",
        ], sim="prisoners_dilemma"),
    ],
)

PSYCH_430 = _c(
    "psych_430", "PSYC 430", "Cognitive Neuroscience: Methods & Models", 400, 4, "kenji_morimoto",
    "Link cognition to brain mechanisms with modern methods. You will be able to critique fMRI/EEG/TMS designs, analyze imaging data with the GLM and MVPA, and explain the neural bases of working memory, memory systems, attention, and reward.",
    ["psych_230", "psych_150"],
    [
        _m("cn_methods", "Methods of Cognitive Neuroscience", "What each method measures, and what kinds of inference it licenses.", [
            "Lesion Logic and Double Dissociations",
            "fMRI and the BOLD Signal: Hemodynamic Response and Design",
            "EEG, Event-Related Potentials, and the P300 and N400",
            "TMS and Causal Inference in the Human Brain",
        ], lab=True),
        _m("fmri_analysis", "Analyzing Neuroimaging Data", "From voxelwise GLMs to pattern analysis, and the statistical pitfalls between.", [
            "The General Linear Model for fMRI Time Series",
            "Multiple Comparisons in Neuroimaging and the Dead Salmon Study",
            "Multivoxel Pattern Analysis and Representational Similarity Analysis",
            "Reverse Inference and Its Limits",
        ], lab=True),
        _m("wm_neuro", "Working Memory & Executive Function in the Brain", "Prefrontal maintenance, load effects, conflict monitoring, and brain training claims.", [
            "Persistent Prefrontal Delay Activity versus Activity-Silent Accounts of Working Memory",
            "The N-Back Task and Load-Dependent Frontoparietal Activation",
            "Cognitive Control and the Anterior Cingulate Conflict-Monitoring Hypothesis",
            "Brain Training and the Far-Transfer Debate",
        ], sim="psych_nback", lab=True),
        _m("memory_neuro", "Memory Systems of the Brain", "Hippocampal consolidation, spatial maps, reconsolidation, and procedural learning.", [
            "The Hippocampus, Consolidation, and Patient H.M. Revisited",
            "Place Cells, Grid Cells, and Cognitive Maps",
            "Reconsolidation and Memory Updating",
            "Procedural Memory and the Basal Ganglia",
        ]),
        _m("attention_neuro", "Attention, Awareness & Consciousness", "Attention networks, biased competition, and theories of conscious access.", [
            "Hemispatial Neglect and the Parietal Attention Network",
            "Biased Competition and Attentional Modulation of Visual Cortex",
            "Neural Correlates of Consciousness and Global Workspace Theory",
            "Blindsight and Unconscious Perception",
        ], sim="psych_visual_search"),
        _m("emotion_social_neuro", "Emotion, Reward & Decision in the Brain", "Fear circuits, dopamine prediction errors, valuation, and mentalizing.", [
            "The Amygdala and Fear Learning",
            "Dopamine and Reward Prediction Errors",
            "The Ventromedial Prefrontal Cortex and the Somatic Marker Hypothesis and Its Critics",
            "Mentalizing Networks and Theory of Mind",
        ]),
    ],
)

PSYCH_530 = _c(
    "psych_530", "PSYC 530", "Computational Cognitive Modeling", 500, 4, "priya_raman",
    "Express psychological theories as runnable models and test them against data. You will be able to fit reinforcement-learning, drift-diffusion, memory, categorization, connectionist, and Bayesian models by maximum likelihood and hierarchical Bayes, and compare them rigorously.",
    ["psych_330", "psych_410"],
    [
        _m("modeling_why", "Why Model Cognition?", "Formal models, parameter estimation, and the indispensable recovery checks.", [
            "Verbal Theories versus Formal Models",
            "Parameters, Free Parameters, and Model Flexibility",
            "Maximum Likelihood Estimation for Behavioral Data",
            "Parameter Recovery and Model Recovery Simulations",
        ], lab=True),
        _m("rl_models", "Reinforcement Learning Models of Behavior", "Learning rules and choice policies fit to trial-by-trial behavior.", [
            "The Rescorla-Wagner Model as a Learning Rule",
            "Q-Learning and Softmax Choice in Bandit Tasks",
            "Model-Based versus Model-Free Control and the Two-Step Task",
            "Hierarchical Bayesian Fitting of Learning Rates",
        ], sim="bandit", lab=True),
        _m("ddm_models", "Sequential Sampling Models", "Mathematics and estimation of diffusion and accumulator models.", [
            "Deriving First-Passage Times of the Diffusion Process",
            "Linear Ballistic Accumulator and Race Models",
            "Hierarchical Drift Diffusion Modeling with HDDM",
            "Collapsing Bounds and Urgency Signals",
        ], sim="psych_drift_diffusion", lab=True),
        _m("memory_models", "Mathematical Models of Memory & Categorization", "Classic global-matching, context, and exemplar models.", [
            "SAM and REM Models of Recognition Memory",
            "The Temporal Context Model of Free Recall",
            "Nosofsky's Generalized Context Model",
            "ALCOVE and Attention Learning in Categorization",
        ], lab=True),
        _m("connectionist", "Connectionist & Neural Network Models", "From the perceptron and PDP to deep nets and LLMs as cognitive models.", [
            "Rosenblatt's Perceptron and Its Limits",
            "Parallel Distributed Processing: Rumelhart and McClelland's Past-Tense Model",
            "Deep Neural Networks as Models of the Ventral Visual Stream",
            "Large Language Models and Psycholinguistic Prediction",
        ], sim="nn_playground", lab=True),
        _m("bayesian_cognition", "Bayesian Models of Cognition & Model Comparison", "Rational analysis, cognitive architectures, and choosing between models.", [
            "Rational Analysis and Bayesian Models of Perception",
            "Bayesian Concept Learning and the Number Game",
            "ACT-R and Cognitive Architectures",
            "Comparing Cognitive Models with AIC, BIC, and Cross-Validation",
        ], sim="bayes_belief", lab=True),
    ],
)

# ---------------------------------------------------------------------------------------------
# 4. Biological Psychology & Psychopharmacology
# ---------------------------------------------------------------------------------------------
PSYCH_150 = _c(
    "psych_150", "PSYC 150", "Brain & Behavior", 100, 5, "samuel_adeyemi",
    "Build a working model of how the nervous system produces behavior. You will be able to trace neural signaling, map functions onto brain structures, explain hormonal and genetic influences, and describe the biology of plasticity and motivated behavior.",
    ["psych_101"],
    [
        _m("neurons", "Neurons & Neural Communication", "Electrical signaling within neurons and chemical signaling between them.", [
            "Anatomy of a Neuron: Dendrites, Soma, Axon, and Myelin",
            "Resting Potential and the Action Potential",
            "Synaptic Transmission: Release, Receptors, and Reuptake",
            "Glia and Their Surprising Roles",
        ]),
        _m("neurotransmitters", "Neurotransmitter Systems", "The major chemical systems and the behaviors they modulate.", [
            "Glutamate and GABA: Excitation and Inhibition",
            "Dopamine Pathways: Mesolimbic, Mesocortical, and Nigrostriatal",
            "Serotonin, Norepinephrine, and Acetylcholine",
            "Neuropeptides, Endorphins, and Oxytocin",
        ]),
        _m("neuroanatomy", "Functional Neuroanatomy", "A structural map of the nervous system and the split-brain story.", [
            "The Central and Peripheral Nervous Systems",
            "Brainstem, Cerebellum, and Diencephalon",
            "The Limbic System and Its Contested Definition",
            "Cortical Lobes, Brodmann Areas, and Hemispheric Specialization versus the Left-/Right-Brain Myth",
            "Sperry and Gazzaniga's Split-Brain Studies",
        ]),
        _m("endocrine_genes", "Hormones, Genes & Evolution", "Endocrine signaling, behavioral genetics, and evolutionary explanations.", [
            "The Endocrine System and the HPA Axis",
            "Behavioral Genetics: Heritability Is Not Destiny",
            "Polygenic Scores and Their Limits",
            "Evolutionary Psychology and Its Critics",
        ], lab=True),
        _m("neuroplasticity", "Development & Plasticity", "How experience rewires the brain, from Aplysia to stroke recovery.", [
            "Neurogenesis, Synaptic Pruning, Critical Periods, and the Adult Neurogenesis Debate",
            "Hebbian Learning and Long-Term Potentiation",
            "Habituation and Sensitization in Aplysia: Kandel's Work",
            "Recovery of Function after Stroke",
        ], sim="psych_habituation"),
        _m("motivated_behavior", "Motivated Behaviors: Hunger, Thirst & Sex", "Homeostatic and hormonal control of basic drives.", [
            "Homeostasis and the Hypothalamus",
            "Leptin, Ghrelin, and the Regulation of Eating",
            "Sexual Differentiation and Sexual Behavior",
            "Thermoregulation and Thirst",
        ]),
    ],
)

PSYCH_350 = _c(
    "psych_350", "PSYC 350", "Psychopharmacology & Addiction", 300, 4, "samuel_adeyemi",
    "Understand how drugs act on the brain and behavior. You will be able to read dose-response curves, explain the mechanisms of drugs of abuse and psychiatric medications, evaluate addiction theories, and critically appraise drug-trial evidence.",
    ["psych_150"],
    [
        _m("pharmacology_principles", "Principles of Pharmacology", "Pharmacokinetics, pharmacodynamics, tolerance, and placebo.", [
            "Pharmacokinetics: Absorption, Distribution, Metabolism, and Excretion",
            "Pharmacodynamics: Agonists, Antagonists, and Dose-Response Curves",
            "Tolerance, Sensitization, and Withdrawal",
            "Placebo Effects and Double-Blind Drug Trials",
        ], lab=True),
        _m("drugs_of_abuse", "Drugs of Abuse", "Mechanisms of the major classes of recreational drugs.", [
            "Stimulants: Cocaine, Amphetamine, and the Dopamine Transporter",
            "Opioids, Receptor Subtypes, and the Overdose Crisis",
            "Alcohol, Sedative-Hypnotics, and GABA-A Receptors",
            "Cannabis, the Endocannabinoid System, and Psychedelics",
        ]),
        _m("addiction_neuro", "Neuroscience of Addiction", "Learning, wanting, and habit in the transition to compulsive drug use.", [
            "Incentive-Sensitization Theory: Wanting versus Liking",
            "Siegel's Conditioned Drug Tolerance and Situational Overdose",
            "From Goal-Directed to Habitual Drug Seeking",
            "The Brain Disease Model of Addiction and Its Critics",
        ], sim="psych_rescorla_wagner"),
        _m("psychotherapeutic_drugs", "Psychotherapeutic Drugs", "How antidepressants, antipsychotics, anxiolytics, and novel agents work.", [
            "Antidepressants: SSRIs, SNRIs, and the Limits of the Monoamine Hypothesis",
            "Antipsychotics, D2 Blockade, and the Revised Dopamine Hypothesis of Schizophrenia",
            "Anxiolytics and Mood Stabilizers: Benzodiazepines and Lithium",
            "Esketamine, Investigational Psilocybin, and the Evidence on Rapid-Acting Antidepressants",
        ]),
        _m("addiction_treatment", "Treating Substance Use Disorders", "Diagnosis and evidence-based pharmacological and behavioral treatment.", [
            "DSM-5-TR Criteria for Substance Use Disorders",
            "Medications for Opioid Use Disorder: Methadone, Buprenorphine, and Naltrexone",
            "Contingency Management and Motivational Interviewing",
            "Harm Reduction and Public Health Policy",
        ]),
        _m("drug_trials", "Evaluating Drug Evidence", "Reading trials and meta-analyses of psychiatric medications critically.", [
            "Reading a Randomized Controlled Trial of a Psychiatric Drug",
            "Kirsch versus Cipriani: The Antidepressant-Placebo Debate in Meta-Analyses",
            "Number Needed to Treat and Clinical Significance",
            "Pharmacogenomics and Personalized Prescribing",
        ], sim="distribution_explorer", lab=True),
    ],
)

PSYCH_450 = _c(
    "psych_450", "PSYC 450", "Sleep, Stress & Psychoneuroimmunology", 400, 4, "ingrid_solberg",
    "Connect sleep, stress physiology, and immunity to mind and health. You will be able to model sleep regulation with the two-process model, interpret polysomnography, explain HPA-axis dynamics and allostatic load, and evaluate stress interventions.",
    ["psych_150"],
    [
        _m("sleep_architecture", "Sleep Architecture", "Stages of sleep, nightly cycles, lifespan changes, and dreaming.", [
            "Polysomnography: EEG Signatures of NREM and REM Sleep",
            "The Ultradian Sleep Cycle across the Night",
            "Sleep across the Lifespan",
            "Dreaming: Activation-Synthesis and Threat-Simulation Theories",
        ], lab=True),
        _m("two_process", "Circadian Rhythms & Sleep Regulation", "The interplay of homeostatic sleep pressure and the circadian clock.", [
            "The Suprachiasmatic Nucleus and Melatonin",
            "Borbély's Two-Process Model: Homeostatic Pressure and Circadian Drive",
            "Adenosine, Caffeine, and Sleep Pressure",
            "Shift Work, Jet Lag, and Social Jet Lag",
        ], sim="psych_sleep_two_process", lab=True),
        _m("sleep_cognition", "Sleep, Memory & Mental Health", "Sleep's role in memory, vigilance, and psychopathology.", [
            "From Jenkins and Dallenbach (1924) to Active Systems Consolidation during Sleep",
            "Sleep Deprivation, Attention Lapses, and the Psychomotor Vigilance Task",
            "Insomnia and CBT-I",
            "Sleep Disturbance as a Transdiagnostic Factor",
        ], sim="psych_forgetting_curve"),
        _m("stress_physiology", "The Physiology of Stress", "From fight-or-flight to allostatic load.", [
            "Cannon's Fight-or-Flight and Selye's General Adaptation Syndrome",
            "Cortisol, the HPA Axis, and Negative Feedback",
            "Allostatic Load and Chronic Stress",
            "Sapolsky's Primate Hierarchies and Stress",
        ]),
        _m("pni", "Psychoneuroimmunology", "Bidirectional links between the brain, behavior, and the immune system.", [
            "Ader and Cohen's Conditioned Immunosuppression",
            "Cohen's Common Cold Studies: Stress and Infection",
            "Inflammation, Cytokines, and Sickness Behavior",
            "The Inflammatory Hypothesis of Depression",
        ]),
        _m("coping_resilience", "Coping, Resilience & Intervention", "Appraisal, coping, resilience, and measuring stress in daily life.", [
            "Lazarus and Folkman's Transactional Model of Stress and Coping",
            "Resilience after Adversity",
            "Mindfulness-Based Stress Reduction: Evidence and Hype",
            "Measuring Stress with Wearables and Ambulatory Assessment",
        ], lab=True),
    ],
)

PSYCH_555 = _c(
    "psych_555", "PSYC 555", "Affective & Social Neuroscience", 500, 4, "ingrid_solberg",
    "Engage the research frontier on emotion and the social brain. You will be able to evaluate competing theories of emotion, model fear extinction and reward learning, analyze psychophysiological signals, and critique claims about oxytocin, mirror neurons, and brain-wide associations.",
    ["psych_430", "psych_450"],
    [
        _m("theories_emotion", "Theories of Emotion", "Classic and contemporary accounts of what emotions are.", [
            "James-Lange, Cannon-Bard, and Schachter-Singer Revisited",
            "Ekman's Basic Emotions and the Facial-Expression Universality Debate",
            "Barrett's Theory of Constructed Emotion",
            "Circumplex Models: Valence and Arousal",
        ]),
        _m("fear_circuits", "Fear, Threat & Anxiety Circuits", "Fear acquisition, extinction, and the translation to clinical treatment.", [
            "LeDoux's Low and High Roads to the Amygdala and His Threat-Circuit Reframing",
            "Fear Conditioning and Extinction as Inhibitory Learning",
            "Threat versus Anxiety: The BNST and Sustained Responses",
            "Translating Extinction Research to Exposure Therapy",
        ], sim="psych_rescorla_wagner", lab=True),
        _m("reward_affect", "Reward, Motivation & Anhedonia", "Dopamine, hedonic hotspots, effort, and reward deficits in depression.", [
            "Schultz's Dopamine Neurons and Prediction-Error Coding",
            "Berridge's Hedonic Hotspots",
            "Effort-Based Decision Making and Anhedonia",
            "Reward Processing Deficits in Depression",
        ], sim="bandit", lab=True),
        _m("emotion_regulation", "Emotion Regulation", "Strategies, neural circuits, and physiological indices of regulation.", [
            "Gross's Process Model of Emotion Regulation",
            "Reappraisal versus Suppression in the Brain",
            "Prefrontal-Amygdala Coupling across Development",
            "Psychophysiological Indices: Startle, Heart Rate Variability, and Pupillometry",
        ], lab=True),
        _m("social_brain", "The Social Brain", "Empathy, exclusion, bonding, and the mirror-neuron debate.", [
            "Empathy for Pain and Shared Representations",
            "Social Exclusion and Cyberball Studies",
            "Oxytocin and Social Bonding: Hype and Evidence",
            "Mirror Neurons: Claims and Controversies",
        ]),
        _m("affective_methods", "Advanced Methods in Affective Neuroscience", "Circuit manipulation, naturalistic paradigms, and reproducibility at scale.", [
            "Optogenetics and Chemogenetics in Rodent Models of Emotion",
            "Hyperscanning and Inter-Brain Synchrony",
            "Naturalistic Neuroimaging with Movies",
            "Brain-Wide Association Studies and the Reproducibility of Individual Differences",
        ], lab=True),
    ],
)

# ---------------------------------------------------------------------------------------------
# 5. Developmental Psychology
# ---------------------------------------------------------------------------------------------
PSYCH_260 = _c(
    "psych_260", "PSYC 260", "Lifespan Developmental Psychology", 200, 4, "lucia_ferraro",
    "Follow human development from conception to death. You will be able to compare developmental designs, explain major theories (Piaget, Vygotsky, Bowlby, Erikson), and interpret research on infancy, attachment, adolescence, adulthood, and aging.",
    ["psych_101"],
    [
        _m("dev_foundations", "Foundations of Developmental Science", "Nature and nurture, developmental designs, ecological context, and prenatal life.", [
            "Nature, Nurture, and Gene-Environment Interplay",
            "Developmental Designs: Cross-Sectional, Longitudinal, and Cross-Sequential",
            "Bronfenbrenner's Ecological Systems Theory",
            "Prenatal Development and Teratogens",
        ], lab=True),
        _m("infancy", "Infancy", "Newborn capacities and the clever methods used to study preverbal minds.", [
            "Newborn Reflexes and Perceptual Capacities",
            "Habituation and Preferential-Looking Methods with Infants",
            "Gibson and Walk's Visual Cliff",
            "Motor Development as a Dynamic System",
        ], sim="psych_habituation"),
        _m("cognitive_dev", "Cognitive Development", "Stage theories, their critics, and information-processing alternatives.", [
            "Piaget's Sensorimotor, Preoperational, Concrete Operational, and Formal Operational Stages",
            "Conservation Tasks and Their Critics",
            "Vygotsky's Sociocultural Theory and Scaffolding",
            "Information-Processing Accounts of Cognitive Development",
        ]),
        _m("socioemotional", "Attachment & Socioemotional Development", "Attachment, temperament, and parenting in cultural context.", [
            "Bowlby's Attachment Theory, Harlow's Monkeys, and Sensitive (Not Critical) Periods",
            "Ainsworth's Strange Situation, Attachment Classifications, and Cross-Cultural Critiques",
            "Temperament: Thomas and Chess to Kagan's Inhibited Children",
            "Baumrind's Parenting Styles and Cultural Context",
        ]),
        _m("adolescence", "Adolescence", "Puberty, identity, peers, and the social-media debate.", [
            "Puberty and the Adolescent Brain",
            "Erikson's Identity versus Role Confusion",
            "Peer Influence and Risk Taking",
            "Social Media and Adolescent Mental Health: Weighing the Evidence",
        ], lab=True),
        _m("adulthood_aging", "Adulthood, Aging & Death", "Emerging adulthood through late life and the end of life.", [
            "Emerging Adulthood and Arnett's Framework",
            "Fluid versus Crystallized Intelligence across Adulthood",
            "Socioemotional Selectivity Theory and the Positivity Effect",
            "Dementia, Successful Aging, and End-of-Life Development",
        ]),
    ],
)

PSYCH_360 = _c(
    "psych_360", "PSYC 360", "Cognitive & Language Development in Childhood", 300, 4, "lucia_ferraro",
    "Explore how children's minds are built. You will be able to evaluate infant-cognition paradigms, explain statistical learning in language acquisition, assess theory of mind and executive function, and connect developmental science to education.",
    ["psych_260", "psych_230"],
    [
        _m("core_knowledge", "Infant Cognition & Core Knowledge", "Violation-of-expectation methods and what infants know about objects and number.", [
            "Violation-of-Expectation Paradigms and Object Permanence",
            "Baillargeon's Drawbridge Study and Its Interpretation",
            "Spelke's Core Knowledge Systems",
            "Infant Number Sense and Wynn's Addition Study: Replications and Reinterpretations",
        ], sim="psych_habituation", lab=True),
        _m("language_acquisition", "Language Acquisition", "How infants crack the speech stream and learn words and grammar.", [
            "Statistical Learning: Saffran, Aslin, and Newport's Segmentation Study",
            "Perceptual Narrowing in Speech Perception",
            "Word Learning, Fast Mapping, and the Vocabulary Spurt",
            "Nativist versus Usage-Based Theories of Grammar",
        ], lab=True),
        _m("theory_of_mind", "Theory of Mind", "Understanding others' beliefs, explicitly and implicitly.", [
            "The Sally-Anne False-Belief Task",
            "Implicit False-Belief Understanding in Infants and Its Replication Failures",
            "Theory of Mind in Autism Spectrum Disorder: Deficit Accounts and the Double-Empathy Critique",
            "Executive Function and Theory of Mind",
        ]),
        _m("executive_dev", "Executive Function & Self-Regulation", "Development of inhibition, working memory, and self-control.", [
            "Inhibitory Control: Day-Night Stroop and Dimensional Change Card Sort",
            "Working Memory Development in Childhood",
            "The Marshmallow Test Revisited: Watts, Duncan, and Quan's 2018 Conceptual Replication",
            "Poverty, Stress, and Executive Function",
        ], sim="psych_stroop"),
        _m("spatial_math", "Spatial & Mathematical Cognition", "Mental rotation, number sense, counting, and spatial training.", [
            "Mental Rotation in Children and Sex Differences Revisited",
            "The Mental Number Line and Approximate Number System",
            "Learning to Count and the Cardinal Principle",
            "Spatial Training and STEM Achievement",
        ], sim="psych_mental_rotation", lab=True),
        _m("education", "Cognitive Development & Education", "Reading, learning disorders, mindset, and early intervention.", [
            "Reading Acquisition and the Phonological Route",
            "Dyslexia and Developmental Language Disorder",
            "Growth Mindset Interventions: Promise and Replication",
            "Early Childhood Interventions: Perry Preschool and Abecedarian Projects",
        ]),
    ],
)

PSYCH_460 = _c(
    "psych_460", "PSYC 460", "Adolescence, Adulthood & Aging: Advanced Topics", 400, 4, "lucia_ferraro",
    "Analyze development after childhood with research-grade methods. You will be able to model developmental trajectories in cohort data, evaluate dual-systems and cognitive-aging theories, explain dementia biomarker frameworks, and assess interventions for later life.",
    ["psych_260", "psych_210"],
    [
        _m("dev_methods_adv", "Advanced Developmental Methods", "Cohort studies, accelerated designs, and causal inference about development.", [
            "Accelerated Longitudinal Designs and Cohort Effects",
            "Large Cohort Studies: Dunedin, ABCD, and UK Biobank",
            "Modeling Developmental Trajectories",
            "Causal Inference from Natural Experiments in Development",
        ], lab=True),
        _m("adolescent_brain", "Adolescent Neurodevelopment", "Risk-taking, social reward, and the adolescent onset of psychopathology.", [
            "The Dual-Systems Model of Adolescent Risk-Taking",
            "Social Reward Sensitivity in Adolescence",
            "Onset of Psychopathology in Adolescence",
            "Sleep and Circadian Shifts in Teenagers",
        ]),
        _m("adult_dev", "Adult Development & Relationships", "Attachment, work, parenthood, personality change, and marriage.", [
            "Attachment in Adulthood and Romantic Relationships",
            "Work, Parenthood, and Midlife Development",
            "Personality Change across Adulthood and the Maturity Principle",
            "Gottman's Research on Marital Stability and Critiques of Its Predictive Claims",
        ]),
        _m("cognitive_aging", "Cognitive Aging", "Processing speed, working memory, reserve, and training trials.", [
            "Salthouse's Processing-Speed Theory of Cognitive Aging",
            "Working Memory Decline and Compensation in Older Adults",
            "Cognitive Reserve and the Nun Study",
            "Does Cognitive Training Help Older Adults? The ACTIVE Trial",
        ], sim="psych_nback", lab=True),
        _m("neurodegeneration", "Neurodegeneration & Dementia", "Diagnosis, biomarkers, assessment, and caregiving.", [
            "Mild and Major Neurocognitive Disorders: MCI and Alzheimer's Disease",
            "Biomarkers: Amyloid, Tau, and Neurodegeneration",
            "Neuropsychological Assessment of Dementia",
            "Caregiving and Dementia Care Interventions",
        ]),
        _m("wellbeing_aging", "Well-Being, Wisdom & End of Life", "Life satisfaction, adaptive aging, wisdom, and grief.", [
            "The U-Shaped Curve of Life Satisfaction and Why It Is Contested",
            "Baltes' Selection, Optimization, and Compensation Model",
            "Wisdom Research and the Berlin Paradigm",
            "Grief, Bereavement, and Bonanno's Resilience Trajectories",
        ], lab=True),
    ],
)

# ---------------------------------------------------------------------------------------------
# 6. Social & Personality Psychology
# ---------------------------------------------------------------------------------------------
PSYCH_270 = _c(
    "psych_270", "PSYC 270", "Social Psychology", 200, 4, "helena_marsh",
    "Understand how other people shape our thoughts, feelings, and actions. You will be able to explain attribution, dissonance, persuasion, conformity, obedience, group processes, prejudice, and helping — and judge which classic findings have held up.",
    ["psych_101"],
    [
        _m("social_perception", "Social Perception & Attribution", "How we explain behavior — and the systematic errors we make.", [
            "The Fundamental Attribution Error and Jones and Harris's Essay Study",
            "Kelley's Covariation Model of Attribution",
            "The Actor-Observer Asymmetry Reconsidered (Malle, 2006) and Self-Serving Biases",
            "First Impressions and Thin Slices of Behavior",
        ]),
        _m("self", "The Self", "Self-knowledge, self-esteem, and presenting ourselves to others.", [
            "Self-Concept, Self-Esteem, and Self-Schemas",
            "Social Comparison Theory",
            "Self-Perception Theory and the Overjustification Effect",
            "Self-Presentation and Impression Management",
        ]),
        _m("attitudes", "Attitudes & Persuasion", "Dissonance, persuasion routes, and when attitudes predict behavior.", [
            "Festinger and Carlsmith's Cognitive Dissonance Experiment",
            "The Elaboration Likelihood Model of Persuasion",
            "Attitude-Behavior Consistency and the Theory of Planned Behavior",
            "Implicit Attitudes and the Limits of the IAT",
        ], lab=True),
        _m("social_influence", "Conformity, Compliance & Obedience", "The classic studies of social influence and what they really showed.", [
            "Sherif's Autokinetic Effect and Norm Formation",
            "Asch's Line-Judgment Experiments and Group Size",
            "Milgram's Obedience Studies: Variations, Archival Critiques, and Burger's Partial Replication",
            "Zimbardo's Stanford Prison Experiment: Demand Characteristics and Le Texier's Critique",
            "Foot-in-the-Door, Door-in-the-Face, and Cialdini's Principles",
        ], sim="psych_asch_conformity"),
        _m("groups", "Group Processes", "Performance, decision-making, and cooperation in groups.", [
            "Social Facilitation and Zajonc's Drive Theory",
            "Social Loafing and the Ringelmann Effect",
            "Groupthink (and Its Thin Empirical Support) and Group Polarization",
            "Social Dilemmas and the Tragedy of the Commons",
        ], sim="prisoners_dilemma"),
        _m("prejudice_prosocial", "Prejudice, Aggression & Helping", "Intergroup bias, aggression, and when people help.", [
            "Tajfel's Minimal Group Paradigm and Social Identity Theory",
            "Sherif's Robbers Cave Reconsidered and Allport's Contact Hypothesis",
            "Darley and Latané's Bystander Effect and the Kitty Genovese '38 Witnesses' Myth",
            "Aggression: Frustration-Aggression and Bandura's Bobo Doll",
        ]),
    ],
)

PSYCH_280 = _c(
    "psych_280", "PSYC 280", "Personality Psychology", 200, 4, "thomas_reinholt",
    "Learn the science of individual differences. You will be able to score and interpret Big Five and HEXACO profiles, weigh the person-situation debate, explain biological and developmental bases of traits, and evaluate personality assessment.",
    ["psych_101"],
    [
        _m("personality_approaches", "Approaches to Personality", "The grand theories and how scientific each turned out to be.", [
            "What Is Personality? Traits, States, and Situations",
            "Freud's Psychodynamic Theory and Its Scientific Status",
            "Humanistic Perspectives: Rogers and Maslow",
            "Social-Cognitive Approaches: Bandura and Mischel's CAPS Model",
        ]),
        _m("big_five", "The Big Five & HEXACO", "The dominant trait taxonomies and how to measure them.", [
            "From Allport's Trait Lexicon to the Five-Factor Model",
            "Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism Defined",
            "The HEXACO Model and Honesty-Humility",
            "Scoring and Interpreting a Big Five Inventory",
        ], sim="psych_big_five", lab=True),
        _m("person_situation", "The Person-Situation Debate", "Whether traits predict behavior — and how the debate was resolved.", [
            "Mischel's 1968 Critique and the Personality Coefficient",
            "Aggregation and Behavioral Consistency",
            "If-Then Signatures and Situational Profiles",
            "Whole Trait Theory and Density Distributions of States",
        ], lab=True),
        _m("bio_personality", "Biological Bases of Personality", "Arousal, reinforcement sensitivity, heritability, and animal personality.", [
            "Eysenck's Arousal Theory of Extraversion",
            "Gray's Reinforcement Sensitivity Theory: BIS and BAS",
            "Twin Studies and the Heritability of Traits",
            "Animal Personality and Comparative Approaches",
        ]),
        _m("personality_dev", "Personality Development & Outcomes", "Stability, change, consequential outcomes, and culture.", [
            "Rank-Order Stability and Mean-Level Change",
            "Personality Predicts Life Outcomes: Health, Work, and Relationships",
            "Can Personality Be Changed Deliberately?",
            "Personality and Culture: Cross-Cultural Replication of the Five Factors",
        ], lab=True),
        _m("dark_traits", "Dark Traits & Personality Disorders", "Aversive traits, psychopathy, dimensional disorder models, and assessment.", [
            "The Dark Triad: Narcissism, Machiavellianism, and Psychopathy",
            "Hare's Psychopathy Checklist-Revised (PCL-R)",
            "Dimensional Models of Personality Disorder: The AMPD",
            "Personality Assessment: MMPI-3 versus Projective Tests and the MBTI Critiqued",
        ]),
    ],
)

PSYCH_470 = _c(
    "psych_470", "PSYC 470", "Advanced Social Psychology: Social Cognition, Culture & Behavior Change", 400, 4, "helena_marsh",
    "Work at the research frontier of social and personality psychology. You will be able to evaluate social-cognition findings post-replication-crisis, analyze cultural variation, model norm dynamics, and design field interventions that change behavior.",
    ["psych_270", "psych_280", "psych_210"],
    [
        _m("social_cognition", "Social Cognition", "Automaticity, stereotypes, motivated reasoning, and psychological distance.", [
            "Automaticity and Bargh's Elderly Priming Study in Light of Failed Replications",
            "Stereotype Content Model: Warmth and Competence",
            "Motivated Reasoning and Partisan Bias",
            "Construal Level Theory and Psychological Distance",
        ], lab=True),
        _m("culture", "Cultural Psychology", "How culture shapes self, cognition, and norms.", [
            "Independent and Interdependent Self-Construals",
            "Holistic versus Analytic Cognition across Cultures",
            "Tight and Loose Cultures",
            "Honor Cultures and Nisbett and Cohen's Insult Experiments",
        ]),
        _m("intergroup", "Intergroup Relations", "Conflict, threat, prejudice reduction, and polarization.", [
            "Realistic Conflict Theory and Intergroup Competition",
            "Stereotype Threat: Original Findings and Replication Debates",
            "Prejudice-Reduction Interventions: A Meta-Analytic View",
            "Affective Polarization and Intergroup Contact Online",
        ], sim="prisoners_dilemma", lab=True),
        _m("relationships", "Close Relationships", "Attraction, commitment, responsiveness, and social connection.", [
            "Interdependence Theory and the Investment Model",
            "Attraction: Proximity, Similarity, and the Speed-Dating Paradigm",
            "Capitalization and Responsiveness in Relationships",
            "Loneliness and Social Connection as Health Factors",
        ]),
        _m("social_influence_adv", "Social Norms & Networks", "Norms, contagion, minority influence, and agent-based models of opinion.", [
            "Descriptive versus Injunctive Norms in Behavior Change",
            "Social Contagion in Networks: Christakis and Fowler Debated",
            "Minority Influence and Moscovici's Blue-Green Studies",
            "Agent-Based Models of Conformity and Opinion Dynamics",
        ], sim="psych_asch_conformity", lab=True),
        _m("morality_wellbeing", "Morality, Meaning & Well-Being", "Moral psychology, well-being, and large field experiments.", [
            "Haidt's Moral Foundations Theory",
            "Moral Licensing (Shrinking Meta-Analytic Effects) and Moral Hypocrisy",
            "Hedonic versus Eudaimonic Well-Being",
            "Large-Scale Field Experiments in Social Psychology",
        ], sim="trolley_lab"),
    ],
)

# ---------------------------------------------------------------------------------------------
# 7. Clinical & Counseling Psychology
# ---------------------------------------------------------------------------------------------
PSYCH_290 = _c(
    "psych_290", "PSYC 290", "Psychopathology", 200, 4, "amira_haddad",
    "Understand the major mental disorders scientifically and compassionately. You will be able to explain how DSM-5-TR criteria are structured, contrast categorical and dimensional models (HiTOP, RDoC), and explain leading etiological models of anxiety, mood, psychotic, and other disorders. This is an academic course, not training to diagnose yourself or others.",
    ["psych_101"],
    [
        _m("defining_disorder", "Classifying Mental Disorder", "What a disorder is and how classification systems carve psychopathology.", [
            "Harmful Dysfunction: Wakefield's Definition of Disorder",
            "The DSM-5-TR and ICD-11: Structure and Controversies",
            "Categorical versus Dimensional Models: HiTOP and RDoC",
            "The Diathesis-Stress and Biopsychosocial Models",
        ]),
        _m("anxiety", "Anxiety, Fear & Obsessive-Compulsive Disorders", "Cognitive and learning models of anxiety and avoidance.", [
            "Panic Disorder and Clark's Cognitive Model",
            "Specific Phobias, Social Anxiety, and Generalized Anxiety Disorder",
            "Obsessive-Compulsive Disorder and Neutralizing Behaviors",
            "Mowrer's Two-Factor Theory of Avoidance",
        ], sim="psych_exposure_therapy"),
        _m("trauma_mood", "Trauma, Depression & Bipolar Disorders", "Models of PTSD, depression, and bipolar illness.", [
            "Posttraumatic Stress Disorder and Fear-Conditioning Models",
            "Major Depressive Disorder, Beck's Cognitive Triad, and the 'Chemical Imbalance' Oversimplification",
            "Seligman's Learned Helplessness, Its Attributional Reformulation, and Maier and Seligman's 2016 Revision",
            "Bipolar Disorders, Mania, and Circadian Dysregulation",
        ]),
        _m("psychosis", "Schizophrenia Spectrum & Psychotic Disorders", "Symptoms, mechanisms, and early intervention in psychosis.", [
            "Positive, Negative, and Cognitive Symptoms of Schizophrenia",
            "Neurodevelopmental and Dopamine Hypotheses of Psychosis",
            "Aberrant Salience and Predictive-Processing Accounts of Delusions",
            "Early Intervention and Clinical High-Risk States",
        ]),
        _m("neurodevelopmental_eating", "Neurodevelopmental, Eating & Personality Disorders", "Autism, ADHD, eating disorders, and borderline personality disorder.", [
            "Autism Spectrum Disorder, the Neurodiversity Perspective, and Debunked Causal Myths (Refrigerator Mothers, Vaccines)",
            "ADHD across the Lifespan",
            "Anorexia Nervosa, Bulimia Nervosa, and Binge-Eating Disorder",
            "Borderline Personality Disorder and Emotion Dysregulation",
        ]),
        _m("epidemiology", "Epidemiology & Prevention", "How common disorders are, how they co-occur, and how to prevent harm.", [
            "Prevalence, Comorbidity, and the National Comorbidity Survey",
            "The p-Factor: A General Dimension of Psychopathology",
            "Suicide: Risk Factors, the Interpersonal Theory, and the Limits of Prediction",
            "Global Mental Health and the Treatment Gap",
        ], lab=True),
    ],
)

PSYCH_390 = _c(
    "psych_390", "PSYC 390", "Clinical Assessment & Diagnosis", 300, 4, "amira_haddad",
    "Study how scientist-practitioners approach assessment. You will be able to explain how structured diagnostic interviews and symptom and cognitive measures are built and validated, reason about base rates, compute reliable change, and draft a case formulation for fictional vignettes. Academic course only: assessing or diagnosing real people requires a graduate clinical degree, supervision, and licensure.",
    ["psych_290", "psych_210"],
    [
        _m("assessment_principles", "Principles of Clinical Assessment", "Assessment goals, actuarial prediction, and the arithmetic of diagnosis.", [
            "The Purpose of Assessment: Diagnosis, Formulation, and Treatment Planning",
            "Clinical versus Actuarial Prediction: Meehl's Classic Argument",
            "Sensitivity, Specificity, and Base Rates in Diagnosis",
            "Cultural Formulation and Bias in Assessment",
        ], sim="psych_signal_detection", lab=True),
        _m("interviews", "Diagnostic Interviews", "Mental status, structured interviews, risk assessment, and rapport.", [
            "The Mental Status Examination",
            "Structured Interviews: SCID-5 and MINI",
            "Risk Assessment for Suicide and Violence",
            "Rapport and the Principles of Motivational Interviewing",
        ]),
        _m("self_report", "Self-Report & Symptom Measures", "Brief measures, broadband inventories, and quantifying change.", [
            "PHQ-9, GAD-7, and Measurement-Based Care",
            "MMPI-3 Validity, Higher-Order, and Restructured Clinical Scales",
            "Interpreting Reliable Change and Clinically Significant Change",
            "Response Styles: Malingering and Defensiveness",
        ], lab=True),
        _m("cognitive_assessment", "Intelligence & Neuropsychological Assessment", "Theories and tests of intelligence and neuropsychological function.", [
            "Spearman's g, Cattell-Horn-Carroll Theory, and the Wechsler Scales (WAIS-IV/WAIS-5)",
            "Norm-Referenced Scores and the Normal Curve in Assessment",
            "The Flynn Effect and Its Recent Reversals",
            "Neuropsychological Batteries and Executive Function Tests",
        ], sim="distribution_explorer", lab=True),
        _m("case_formulation", "Case Formulation & Report Writing", "From data to formulation to a clear, ethical written report.", [
            "Functional Analysis of Behavior in Clinical Cases",
            "Cognitive-Behavioral Case Conceptualization",
            "Writing an Integrated Psychological Report",
            "Communicating Diagnoses and Feedback to Clients",
        ]),
        _m("special_populations", "Assessment across Populations", "Children, older adults, forensic contexts, and digital assessment.", [
            "Child and Adolescent Assessment with Multi-Informant Data",
            "Assessing Older Adults and Capacity Evaluations",
            "Forensic Assessment and Competency to Stand Trial",
            "Digital Phenotyping and Smartphone-Based Assessment",
        ]),
    ],
)

PSYCH_490 = _c(
    "psych_490", "PSYC 490", "Evidence-Based Psychotherapies: CBT, Exposure, ACT & DBT", 400, 4, "amira_haddad",
    "Learn the treatments with the strongest scientific support. You will be able to explain and role-play core CBT, exposure, ACT, and DBT techniques, match treatments to disorders, and critically evaluate psychotherapy outcome research. This is an academic survey: delivering psychotherapy requires a graduate clinical degree, supervised practice, and licensure.",
    ["psych_390"],
    [
        _m("ebp_foundations", "Foundations of Evidence-Based Practice", "Specific versus common factors, ESTs, and the research-practice gap.", [
            "The Dodo Bird Verdict and Common Factors Debate",
            "Empirically Supported Treatments and the APA Division 12 Criteria",
            "The Therapeutic Alliance and Outcome",
            "Efficacy versus Effectiveness and Dissemination Gaps",
            "Potentially Harmful Therapies: Critical-Incident Stress Debriefing and Recovered-Memory Techniques",
        ]),
        _m("cbt", "Cognitive Behavioral Therapy", "Beck's model and core CBT techniques for depression and anxiety.", [
            "Beck's Cognitive Model and Automatic Thoughts",
            "Cognitive Restructuring with Thought Records",
            "Behavioral Activation for Depression",
            "Session Structure, Homework, and Socratic Questioning",
        ], lab=True),
        _m("exposure", "Exposure-Based Treatments", "Theories and protocols of exposure for anxiety, OCD, and PTSD.", [
            "Foa and Kozak's Emotional Processing Theory and Habituation",
            "Craske's Inhibitory Learning Approach to Exposure",
            "Exposure and Response Prevention for OCD",
            "Prolonged Exposure and Cognitive Processing Therapy for PTSD",
        ], sim="psych_exposure_therapy"),
        _m("third_wave", "Third-Wave & Contextual Therapies", "Acceptance, mindfulness, and dialectical approaches.", [
            "Acceptance and Commitment Therapy and Psychological Flexibility",
            "Linehan's Dialectical Behavior Therapy and Its Skills Modules",
            "Mindfulness-Based Cognitive Therapy for Relapse Prevention",
            "Compassion-Focused and Metacognitive Therapies",
        ]),
        _m("other_modalities", "Other Modalities & Populations", "Interpersonal, psychodynamic, and family-based treatments.", [
            "Interpersonal Psychotherapy",
            "Short-Term Psychodynamic Therapy and Its Evidence Base",
            "Parent Management Training and PCIT for Child Conduct Problems",
            "Family-Based Treatment for Adolescent Anorexia",
        ]),
        _m("outcome_research", "Psychotherapy Outcome Research", "Designing and interpreting trials of psychological treatments.", [
            "Designing a Psychotherapy RCT: Control Conditions and Blinding",
            "Effect Sizes in Psychotherapy Meta-Analyses and Publication Bias",
            "Moderators, Mediators, and Mechanisms of Change",
            "Digital and App-Based CBT Interventions",
        ], sim="psych_power_replication", lab=True),
    ],
)

PSYCH_560 = _c(
    "psych_560", "PSYC 560", "Advanced Psychopathology & Clinical Science", 500, 4, "amira_haddad",
    "Engage graduate-level clinical science. You will be able to evaluate taxometric and network models of disorder, test transdiagnostic mechanisms and cognitive biases, apply developmental psychopathology principles, and evaluate approaches to personalizing treatment with measurement-based care.",
    ["psych_490", "psych_410"],
    [
        _m("nosology_adv", "Advanced Nosology", "Statistical and conceptual approaches to the structure of psychopathology.", [
            "Taxometric Analysis: Are Mental Disorders Categories or Dimensions?",
            "The Hierarchical Taxonomy of Psychopathology in Depth",
            "RDoC Domains and Units of Analysis",
            "Network Theory of Mental Disorders",
        ], lab=True),
        _m("transdiagnostic", "Transdiagnostic Processes", "Mechanisms that cut across diagnostic boundaries and treatments that target them.", [
            "Repetitive Negative Thinking across Disorders",
            "Experiential Avoidance and Emotion Dysregulation",
            "Barlow's Unified Protocol for Transdiagnostic Treatment",
            "Intolerance of Uncertainty",
        ]),
        _m("cognitive_bias", "Cognitive Biases in Psychopathology", "Attention, interpretation, and memory biases and attempts to modify them.", [
            "The Emotional Stroop and Attentional Bias to Threat",
            "Dot-Probe Tasks and Attention Bias Modification Trials",
            "Interpretation Biases and Cognitive Bias Modification",
            "Overgeneral Autobiographical Memory in Depression",
        ], sim="psych_stroop", lab=True),
        _m("dev_psychopathology", "Developmental Psychopathology", "Pathways, adversity, susceptibility, and prevention.", [
            "Equifinality and Multifinality",
            "Adverse Childhood Experiences: Population Risk versus Individual Prediction",
            "Differential Susceptibility and Orchid-Dandelion Hypotheses",
            "Prevention Science and Universal versus Targeted Programs",
        ]),
        _m("treatment_mechanisms", "Mechanisms & Personalization of Treatment", "Idiographic models, treatment selection, and outcome monitoring.", [
            "Idiographic Network Models for Personalized Treatment",
            "Treatment Selection and the Personalized Advantage Index",
            "Sudden Gains and Nonlinear Trajectories in Therapy",
            "Measurement-Based Care and Routine Outcome Monitoring",
        ], lab=True),
        _m("clinical_practice", "Professional Issues in Clinical Practice", "Supervision, cultural humility, telehealth, and licensure requirements — studied academically, not as practice training.", [
            "Clinical Supervision Models and Competency Benchmarks",
            "Cultural Humility and Multicultural Competence in Therapy",
            "Telehealth Practice Standards",
            "Licensure Pathways, the EPPP, and Why a Research M.S. Does Not Permit Independent Practice",
        ]),
    ],
)

PSYCH_610 = _c(
    "psych_610", "PSYC 610", "Computational Psychiatry & Precision Mental Health", 600, 4, "priya_raman",
    "Apply computational models and machine learning to mental illness. You will be able to fit RL, Bayesian, and diffusion models to behavioral data from clinical research samples, build validated clinical prediction models, and design ethical digital-phenotyping and just-in-time interventions.",
    ["psych_530", "psych_560"],
    [
        _m("comp_psych_intro", "Foundations of Computational Psychiatry", "Theory-driven and data-driven approaches and the reliability problem.", [
            "Data-Driven versus Theory-Driven Computational Psychiatry",
            "Generative Models of Symptoms and Behavior",
            "Model-Based Phenotyping with Behavioral Tasks",
            "Reliability Challenges for Computational Task Parameters",
        ], lab=True),
        _m("rl_psychiatry", "Reinforcement Learning in Psychiatry", "Reward learning, habits, Pavlovian biases, and exploration in clinical populations.", [
            "Reward Learning Deficits in Depression and Anhedonia",
            "Habit versus Goal-Directed Control in OCD and Addiction",
            "Pavlovian Bias and the Go/No-Go Learning Task",
            "Exploration-Exploitation Tradeoffs in Anxiety",
        ], sim="bandit", lab=True),
        _m("bayesian_brain", "Bayesian Brain & Predictive Processing in Psychopathology", "Belief updating, precision, and interoception as computational targets.", [
            "Hierarchical Gaussian Filter Models of Belief Updating",
            "Aberrant Precision Weighting in Psychosis",
            "Interoceptive Inference and Anxiety",
            "Belief Updating Asymmetries and Optimism Bias",
        ], sim="bayes_belief", lab=True),
        _m("ddm_psychiatry", "Decision Models of Clinical Populations", "Evidence-accumulation models of impulsivity, anxiety, and delusion-proneness.", [
            "Drift Diffusion Accounts of Impulsivity in ADHD",
            "Evidence Accumulation in Anxiety and Depression",
            "Jumping to Conclusions: Beads Tasks in Delusion-Prone Individuals",
            "Joint Modeling of Choices, Reaction Times, and Neural Data",
        ], sim="psych_drift_diffusion", lab=True),
        _m("ml_prediction", "Machine Learning for Clinical Prediction", "Building, validating, and auditing predictive models in mental health.", [
            "Predicting Treatment Response with Cross-Validated Machine Learning",
            "Overfitting, Leakage, and External Validation in Clinical Prediction",
            "Natural Language Processing of Clinical Text and Speech",
            "Fairness and Bias in Mental Health Algorithms",
        ], sim="nn_playground", lab=True),
        _m("digital_mental_health", "Digital Phenotyping & Just-in-Time Interventions", "Passive sensing, micro-randomized trials, and early-warning signals.", [
            "Passive Sensing from Smartphones and Wearables",
            "Ecological Momentary Interventions and Micro-Randomized Trials",
            "Dynamical Systems and Early Warning Signals of Relapse",
            "Ethics, Privacy, and Regulation of Digital Psychiatry",
        ], lab=True),
    ],
)

# ---------------------------------------------------------------------------------------------
# 8. Learning, Behavior Analysis & Applied Psychology
# ---------------------------------------------------------------------------------------------
PSYCH_180 = _c(
    "psych_180", "PSYC 180", "Principles of Learning & Behavior", 100, 4, "beatrice_lemaire",
    "Master the laws of learning shared by animals and humans. You will be able to predict conditioning outcomes with the Rescorla-Wagner model, analyze reinforcement schedules and the matching law, and explain cognitive and social forms of learning.",
    [],
    [
        _m("habituation", "Habituation & Sensitization", "The simplest forms of learning and their dual-process explanation.", [
            "Habituation as the Simplest Form of Learning",
            "Dishabituation, Spontaneous Recovery, and Stimulus Specificity",
            "Groves and Thompson's Dual-Process Theory",
            "Sensitization and Its Role in Chronic Pain and Anxiety",
        ], sim="psych_habituation"),
        _m("classical", "Classical Conditioning", "Pavlovian phenomena and the prediction-error principle behind them.", [
            "Acquisition, Extinction, and Spontaneous Recovery",
            "Watson and Rayner's Little Albert Study: Ethics and Contested History",
            "Kamin's Blocking Effect and the Role of Surprise",
            "The Rescorla-Wagner Model: Prediction Error Drives Learning",
            "Garcia's Taste Aversion and Biological Preparedness",
        ], sim="psych_rescorla_wagner", lab=True),
        _m("operant", "Operant Conditioning", "Consequences, shaping, and the distinctive signatures of reinforcement schedules.", [
            "Thorndike's Law of Effect and Skinner's Operant Chamber",
            "Positive and Negative Reinforcement and Punishment",
            "Shaping by Successive Approximations",
            "Schedules of Reinforcement: Fixed and Variable Ratio and Interval",
            "The Partial Reinforcement Extinction Effect",
        ], sim="psych_operant_schedules"),
        _m("choice_behavior", "Choice & Behavioral Economics", "Matching, preference, discounting, and the economics of reinforcement.", [
            "Herrnstein's Matching Law",
            "Concurrent Schedules and Preference",
            "Delay Discounting in Animals and Humans",
            "Behavioral Economics of Demand: Elasticity and Drug Reinforcers",
        ], lab=True),
        _m("cognitive_learning", "Cognitive & Social Learning", "Learning that goes beyond stimulus-response associations.", [
            "Tolman's Latent Learning and Cognitive Maps",
            "Köhler's Insight Learning in Chimpanzees",
            "Bandura's Observational Learning",
            "Seligman and Maier's Learned Helplessness and Controllability",
        ]),
        _m("avoidance_generalization", "Generalization, Discrimination & Avoidance", "Stimulus control, avoidance, and contextual modulation of behavior.", [
            "Stimulus Generalization Gradients and Peak Shift",
            "Discrimination Training and Stimulus Control",
            "Avoidance Learning and the Avoidance Paradox",
            "Occasion Setting and Contextual Control of Behavior",
        ]),
    ],
)

PSYCH_380 = _c(
    "psych_380", "PSYC 380", "Applied Behavior Analysis & Behavior Change", 300, 4, "beatrice_lemaire",
    "Turn learning principles into effective interventions. You will be able to define and measure target behaviors, analyze single-case designs, explain how functional analyses are conducted, design reinforcement-based interventions for case vignettes, weigh ethical critiques of ABA, and apply behavior-change frameworks to health. Academic course: delivering ABA services requires supervised fieldwork and certification.",
    ["psych_180", "psych_201"],
    [
        _m("aba_foundations", "Foundations of Applied Behavior Analysis", "The dimensions of ABA and rigorous behavioral measurement.", [
            "Baer, Wolf, and Risley's Seven Dimensions of ABA",
            "Defining Target Behaviors Operationally",
            "Measurement: Frequency, Duration, Latency, and Interval Recording",
            "Interobserver Agreement Calculations",
        ], lab=True),
        _m("single_case", "Single-Case Experimental Designs", "Demonstrating experimental control with one participant at a time.", [
            "Reversal (ABAB) Designs",
            "Multiple-Baseline Designs across Behaviors, Settings, and Participants",
            "Changing-Criterion and Alternating-Treatments Designs",
            "Visual Analysis and Effect Size Metrics for Single-Case Data",
        ], lab=True),
        _m("functional_assessment", "Functional Behavior Assessment", "Identifying why a behavior occurs before trying to change it.", [
            "Antecedent-Behavior-Consequence Recording",
            "Iwata's Functional Analysis Methodology",
            "Escape, Attention, Tangible, and Automatic Functions",
            "Function-Based Treatment Selection",
        ]),
        _m("reinforcement_interventions", "Reinforcement-Based Interventions", "Differential reinforcement, token systems, and maintenance.", [
            "Differential Reinforcement: DRA, DRI, DRO, and DRL",
            "Token Economies and Behavioral Contracts",
            "Thinning Reinforcement Schedules for Maintenance",
            "Functional Communication Training",
        ], sim="psych_operant_schedules"),
        _m("skill_acquisition", "Skill Acquisition, Verbal Behavior & Ethics", "Teaching new skills, Skinner's analysis of language, and contemporary ethical critiques of ABA.", [
            "Discrete Trial Training and Naturalistic Teaching",
            "Task Analysis, Chaining, and Prompt Fading",
            "Skinner's Verbal Behavior: Mands, Tacts, and Intraverbals",
            "Evidence and Controversy in Early Intensive Behavioral Intervention",
            "Assent, the BACB Ethics Code, and Neurodiversity-Affirming Critiques of ABA",
        ]),
        _m("behavior_change_health", "Behavior Change in Health & Society", "Habits, the COM-B model, incentives, and organizational behavior.", [
            "Habit Formation and Lally's Automaticity Curve",
            "The COM-B Model and Behavior Change Wheel",
            "Gamification and Incentive Design for Health Behavior",
            "Organizational Behavior Management and Safety",
        ], lab=True),
    ],
)

PSYCH_480 = _c(
    "psych_480", "PSYC 480", "Industrial-Organizational Psychology & Human Factors", 400, 4, "edmund_hawthorne",
    "Apply psychology to work, organizations, and the design of systems. You will be able to run a job analysis, evaluate selection methods by validity and adverse impact, apply motivation and leadership research, and design interfaces using Hick's and Fitts's laws.",
    ["psych_201", "psych_230"],
    [
        _m("io_foundations", "Foundations of I-O Psychology", "History, job analysis, performance criteria, training evaluation, and the legal landscape.", [
            "From Taylorism to the Hawthorne Studies and the Contested 'Hawthorne Effect'",
            "Job Analysis and Competency Modeling",
            "Criterion Development and Job Performance Measurement",
            "Legal Context: Adverse Impact and the Four-Fifths Rule",
            "Training Needs Analysis and Kirkpatrick's Four Levels of Evaluation",
        ]),
        _m("selection", "Personnel Selection", "What predicts job performance and how much it is worth.", [
            "Schmidt and Hunter (1998) and Sackett et al.'s (2022) Revised Validity Estimates",
            "Structured Interviews and Work Samples",
            "Cognitive Ability Tests, Personality Tests, and Integrity Tests",
            "Utility Analysis and the Taylor-Russell Tables",
        ], lab=True),
        _m("motivation_work", "Work Motivation & Attitudes", "Goals, autonomy, satisfaction, burnout, and fairness at work.", [
            "Goal-Setting Theory: Locke and Latham",
            "Self-Determination Theory at Work",
            "Job Satisfaction, Engagement, and Burnout",
            "Organizational Justice",
        ]),
        _m("leadership_teams", "Leadership & Teams", "Leadership styles, team effectiveness, diversity, and culture change.", [
            "Transformational and Transactional Leadership",
            "Team Effectiveness and Psychological Safety",
            "Diversity, Inclusion, and Team Performance",
            "Organizational Culture and Change Management",
        ]),
        _m("human_factors", "Human Factors & Ergonomics", "Quantitative laws of human performance applied to design.", [
            "Hick-Hyman Law and Choice Reaction Time in Interface Design",
            "Fitts's Law and Pointing Movements",
            "Mental Workload, Situation Awareness, and Vigilance Decrement",
            "Usability Testing and Human-Centered Design",
        ], sim="psych_hicks_law", lab=True),
        _m("safety_automation", "Safety, Error & Automation", "Human error, alarms, and calibrating trust in automated systems.", [
            "Reason's Swiss Cheese Model of Accidents",
            "Slips, Lapses, and Mistakes: A Taxonomy of Human Error",
            "Alarm Design, False Alarms, and Cry-Wolf Effects",
            "Trust in Automation and Human-AI Teaming",
        ], sim="psych_signal_detection"),
    ],
)

PSYCH_570 = _c(
    "psych_570", "PSYC 570", "Health Psychology & Behavioral Medicine", 500, 4, "matteo_rinaldi",
    "Apply psychological science to physical health. You will be able to critique health-behavior models, design and evaluate interventions for chronic illness, pain, sleep, and adherence, and plan cluster-randomized, stepped-wedge, and SMART trials.",
    ["psych_450", "psych_410"],
    [
        _m("health_models", "Models of Health Behavior", "Theories of why people do (or don't) act on health intentions.", [
            "The Health Belief Model and Protection Motivation Theory",
            "The Transtheoretical Model and Its Critics",
            "The Intention-Behavior Gap and Implementation Intentions",
            "Social Determinants of Health and Health Disparities",
        ], lab=True),
        _m("chronic_illness", "Chronic Illness & Pain", "Adjustment to illness, chronic pain, cardiovascular risk, and psycho-oncology.", [
            "Psychological Adjustment to Chronic Illness",
            "The Biopsychosocial Model of Chronic Pain and Fear-Avoidance",
            "Cardiovascular Disease, Hostility, and the Rise and Fall of Type A",
            "Psycho-Oncology and Psychosocial Interventions in Cancer",
        ]),
        _m("health_behaviors", "Health Behaviors & Interventions", "Smoking, activity, eating, and adherence interventions.", [
            "Smoking Cessation: Pharmacological and Behavioral Approaches",
            "Physical Activity Interventions and Wearable Feedback",
            "Obesity, Eating Behavior, and Weight-Stigma Research",
            "Medication Adherence and Behavioral Interventions",
        ], sim="psych_operant_schedules", lab=True),
        _m("sleep_health", "Sleep & Behavioral Medicine", "Behavioral treatments for sleep disorders and circadian interventions.", [
            "CBT for Insomnia (CBT-I) and Stimulus Control Therapy",
            "Sleep Restriction Therapy Mechanisms",
            "Obstructive Sleep Apnea and CPAP Adherence",
            "Circadian Interventions: Light Therapy and Chronotherapy",
        ], sim="psych_sleep_two_process"),
        _m("placebo_mindbody", "Placebo, Expectation & Mind-Body Interactions", "How expectations change symptoms and what that means for trials.", [
            "Neurobiology of Placebo Analgesia",
            "Nocebo Effects and Informed Consent",
            "Open-Label Placebos",
            "Expectation Effects in Clinical Trials",
        ]),
        _m("intervention_design", "Designing & Evaluating Health Interventions", "From logic models to adaptive trials and real-world implementation.", [
            "Intervention Mapping and Logic Models",
            "Cluster-Randomized and Stepped-Wedge Trials",
            "SMART Designs for Adaptive Interventions",
            "Implementation Science and the RE-AIM Framework",
        ], lab=True),
    ],
)

PSYCH_580 = _c(
    "psych_580", "PSYC 580", "Ethics, Professional Practice & Teaching in Psychology", 500, 4, "matteo_rinaldi",
    "Prepare for responsible professional life in psychology. You will be able to apply the APA Ethics Code to research and clinical dilemmas, analyze confidentiality and duty-to-protect cases, explain standards for culturally responsive care, teach with evidence-based pedagogy, and communicate science to the public and policymakers.",
    ["psych_201", "psych_390"],
    [
        _m("apa_ethics", "The APA Ethics Code", "Principles, standards, and structured ethical decision-making.", [
            "General Principles of the APA Ethical Principles of Psychologists and Code of Conduct",
            "Ethical Decision-Making Models",
            "Confidentiality, Privilege, and Its Limits: Tarasoff",
            "Multiple Relationships and Boundary Issues",
        ], sim="argument_mapper"),
        _m("research_ethics_adv", "Advanced Research Ethics", "Misconduct, authorship, big-data consent, and institutional failures.", [
            "Research Misconduct Case Studies: Stapel and Fabrication",
            "Authorship, Credit, and the CRediT Taxonomy",
            "Ethics of Big Data, Social Media Research, and Consent",
            "Dual-Use Concerns and the Hoffman Report on Interrogation",
        ], sim="trolley_lab"),
        _m("professional_practice", "Professional Practice", "Competence, records, mandated reporting, and practitioner well-being.", [
            "Competence and Scope of Practice",
            "Record Keeping, HIPAA, and Informed Consent to Treatment",
            "Mandated Reporting and Duty to Protect",
            "Self-Care, Burnout, and Impairment among Psychologists",
        ]),
        _m("diversity_justice", "Diversity, Equity & Social Justice", "Multicultural guidelines and psychology's own history of harm.", [
            "APA Multicultural Guidelines",
            "Microaggressions Research and Its Measurement Debates",
            "Serving Linguistically Diverse Clients and Working with Interpreters",
            "Psychology's History of Harm and Repair: Eugenics and Apology",
        ]),
        _m("teaching", "Teaching of Psychology", "Evidence-based teaching, assessment, and research mentoring.", [
            "Evidence-Based Pedagogy: Retrieval Practice, Interleaving, and the Learning-Styles Myth",
            "Designing Learning Objectives with APA Undergraduate Guidelines",
            "Assessment of Student Learning",
            "Mentoring Undergraduate Researchers",
        ], lab=True),
        _m("science_communication", "Science Communication & Policy", "Bringing psychological science to the public, courts, policy, and funders.", [
            "Communicating Psychological Science to the Public",
            "Psychology in Public Policy: Behavioral Insights Teams",
            "Expert Testimony and the Daubert Standard",
            "Grant Writing: Specific Aims and Significance",
        ]),
    ],
)


# ---------------------------------------------------------------------------------------------
# Faculty roster (fictional). "persona" = TTS voice id; "courses" must match each course's "instructor".
# ---------------------------------------------------------------------------------------------
FACULTY = [
    {"id": "helena_marsh", "name": "Dr. Helena Marsh", "title": "Professor & Department Chair", "specialty": "Social psychology & social influence", "bio": "Helena runs large multi-site replications of classic social-influence studies and has led open-science reform efforts within her field. She believes every freshman should run a conformity experiment before reading about one.", "icon": "👩‍🏫", "persona": "claire_evans", "courses": ["psych_101", "psych_270", "psych_470"]},
    {"id": "rafael_ibanez", "name": "Dr. Rafael Ibáñez", "title": "Professor & Director of Graduate Studies", "specialty": "Quantitative psychology: multilevel, SEM & Bayesian methods", "bio": "Rafael develops Bayesian multilevel and structural equation models for intensive longitudinal data and supervises every M.S. thesis in the department.", "icon": "📈", "persona": "julian_mercer", "courses": ["psych_510", "psych_515", "psych_690"]},
    {"id": "amira_haddad", "name": "Dr. Amira Haddad", "title": "Professor & Director of Clinical Training", "specialty": "Clinical science, anxiety disorders & CBT", "bio": "A clinical scientist, Amira studies inhibitory-learning approaches to exposure therapy and teaches how anxiety treatments are tested in randomized trials.", "icon": "🩺", "persona": "layla_mansoor", "courses": ["psych_290", "psych_390", "psych_490", "psych_560"]},
    {"id": "naomi_achterberg", "name": "Dr. Naomi Achterberg", "title": "Professor of Cognitive Psychology", "specialty": "Memory, attention & judgment", "bio": "Naomi's lab studies retrieval practice, forgetting, and risky choice; her work on spacing schedules has informed study design in medical education.", "icon": "🧩", "persona": "elena_vance", "courses": ["psych_230", "psych_330"]},
    {"id": "kenji_morimoto", "name": "Dr. Kenji Morimoto", "title": "Associate Professor", "specialty": "Perception, psychophysics & cognitive neuroscience", "bio": "Kenji combines psychophysics, signal detection theory, and fMRI to study visual search and attentional selection.", "icon": "👁️", "persona": "jian_chen", "courses": ["psych_220", "psych_430"]},
    {"id": "priya_raman", "name": "Dr. Priya Raman", "title": "Assistant Professor", "specialty": "Computational modeling & computational psychiatry", "bio": "Priya fits reinforcement-learning and drift-diffusion models to clinical populations, and insists that every model pass parameter-recovery checks before it meets real data.", "icon": "🤖", "persona": "meiling_zhou", "courses": ["psych_410", "psych_530", "psych_610"]},
    {"id": "samuel_adeyemi", "name": "Dr. Samuel Adeyemi", "title": "Professor of Behavioral Neuroscience", "specialty": "Biological psychology & psychopharmacology", "bio": "Samuel studies how drug-associated cues drive relapse in rodent models and translates the findings to human addiction treatment.", "icon": "💊", "persona": "marcus_hale", "courses": ["psych_150", "psych_350"]},
    {"id": "ingrid_solberg", "name": "Dr. Ingrid Solberg", "title": "Associate Professor", "specialty": "Sleep, stress & affective neuroscience", "bio": "Ingrid runs the department's sleep laboratory, investigating how sleep loss and chronic stress reshape emotional memory and immune function.", "icon": "🌙", "persona": "linnea_sterling", "courses": ["psych_450", "psych_555"]},
    {"id": "lucia_ferraro", "name": "Dr. Lucia Ferraro", "title": "Professor of Developmental Psychology", "specialty": "Lifespan cognitive & language development", "bio": "Lucia's infant lab uses habituation and eye-tracking to study statistical learning, and she co-leads a 20-year longitudinal cohort study of aging.", "icon": "👶", "persona": "chiara_bellini", "courses": ["psych_260", "psych_360", "psych_460"]},
    {"id": "thomas_reinholt", "name": "Dr. Thomas Reinholt", "title": "Associate Professor", "specialty": "Personality & psychometrics", "bio": "Thomas builds item-response-theory measures of personality and tests whether the Big Five replicate across 40 languages.", "icon": "📏", "persona": "lukas_weber", "courses": ["psych_280", "psych_520"]},
    {"id": "beatrice_lemaire", "name": "Dr. Béatrice Lemaire", "title": "Associate Professor of Behavior Analysis", "specialty": "Learning theory & applied behavior analysis", "bio": "Béatrice studies reinforcement schedules and choice in the lab and teaches the science and ethics of function-based interventions.", "icon": "🐀", "persona": "colette_laurent", "courses": ["psych_180", "psych_380"]},
    {"id": "edmund_hawthorne", "name": "Dr. Edmund Hawthorne", "title": "Professor of Industrial-Organizational Psychology", "specialty": "Personnel selection & human factors", "bio": "Edmund consults on selection systems and cockpit-interface design, and has spent three decades measuring how people actually perform at work.", "icon": "💼", "persona": "arthur_pendleton", "courses": ["psych_480"]},
    {"id": "matteo_rinaldi", "name": "Dr. Matteo Rinaldi", "title": "Professor of Health Psychology & Ethics Officer", "specialty": "Behavioral medicine & professional ethics", "bio": "Matteo studies placebo and expectation effects in chronic pain and chairs the university's research ethics board.", "icon": "⚖️", "persona": "lorenzo_conti", "courses": ["psych_570", "psych_580"]},
    {"id": "greta_vogel", "name": "Dr. Greta Vogel", "title": "Senior Lecturer & Director of Undergraduate Research", "specialty": "Research methods, statistics & open science", "bio": "Greta teaches every undergraduate how to preregister a study and runs the department's reproducibility audits of published papers.", "icon": "🔬", "persona": "marlene_richter", "courses": ["psych_201", "psych_210", "psych_310"]},
]


DOMAIN = {
    "id": "psychology",
    "name": "Psychology & Behavioral Science",
    "icon": "🧠",
    "color": "#a855f7",
    "tagline": "From Pavlov's bell and Milgram's shock box to drift-diffusion models and computational psychiatry.",
    "description": "A rigorous arc, informed by APA guidelines for the undergraduate major, through the science of mind and behavior: research methods and open science, cognition and perception, biological and developmental psychology, social and personality psychology, psychopathology and evidence-based treatment, and learning and behavior analysis. Graduate study adds multilevel/SEM, Bayesian and meta-analytic methods, psychometrics and IRT, computational cognitive modeling, clinical, health and I-O psychology, professional ethics, and an M.S. thesis. This is an academic, research-focused program; it does not lead to clinical licensure or qualify learners to diagnose or treat.",
    "faculty": FACULTY,
    "subjects": [
        {
            "id": "foundations_methods",
            "name": "Foundations, Research Methods & Open Science",
            "icon": "🔬",
            "description": "How psychology knows what it knows: the scientific method, experimental design, research ethics, the replication crisis, and an original M.S. thesis.",
            "courses": [PSYCH_101, PSYCH_201, PSYCH_310, PSYCH_690],
        },
        {
            "id": "quantitative",
            "name": "Quantitative Psychology & Psychometrics",
            "icon": "📈",
            "description": "From t-tests to mixed models, SEM, Bayesian inference, meta-analysis, and item response theory — the statistical backbone of modern psychology.",
            "courses": [PSYCH_210, PSYCH_410, PSYCH_510, PSYCH_515, PSYCH_520],
        },
        {
            "id": "cognitive",
            "name": "Cognitive Psychology & Cognitive Neuroscience",
            "icon": "🧩",
            "description": "Perception, attention, memory, language, and decision-making — measured in the lab, mapped in the brain, and formalized in computational models.",
            "courses": [PSYCH_220, PSYCH_230, PSYCH_330, PSYCH_430, PSYCH_530],
        },
        {
            "id": "biological",
            "name": "Biological Psychology & Psychopharmacology",
            "icon": "🧬",
            "description": "Neurons, neurotransmitters, hormones, drugs, sleep, stress, and the neural circuits of emotion and social behavior.",
            "courses": [PSYCH_150, PSYCH_350, PSYCH_450, PSYCH_555],
        },
        {
            "id": "developmental",
            "name": "Developmental Psychology",
            "icon": "👶",
            "description": "Human development across the lifespan, from infant cognition and language acquisition to adolescence, adulthood, and aging.",
            "courses": [PSYCH_260, PSYCH_360, PSYCH_460],
        },
        {
            "id": "social_personality",
            "name": "Social & Personality Psychology",
            "icon": "🤝",
            "description": "How situations and other people shape behavior, how individuals differ, and how culture, norms, and relationships interact with both.",
            "courses": [PSYCH_270, PSYCH_280, PSYCH_470],
        },
        {
            "id": "clinical",
            "name": "Clinical & Counseling Psychology",
            "icon": "🩺",
            "description": "Psychopathology, DSM-5-TR assessment, evidence-based psychotherapies (CBT, exposure, ACT, DBT), clinical science, and computational psychiatry — studied academically; these courses do not confer licensure or qualify you to diagnose or treat anyone.",
            "courses": [PSYCH_290, PSYCH_390, PSYCH_490, PSYCH_560, PSYCH_610],
        },
        {
            "id": "learning_applied",
            "name": "Learning, Behavior Analysis & Applied Psychology",
            "icon": "🐀",
            "description": "The laws of learning and their applications: behavior analysis, industrial-organizational psychology and human factors, health psychology, and professional ethics.",
            "courses": [PSYCH_180, PSYCH_380, PSYCH_480, PSYCH_570, PSYCH_580],
        },
    ],
}
