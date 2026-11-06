"""Self-Taught curriculum catalog — Statistics & Data Science domain.

Pure data (see docs/CONTRACTS.md §1). The two tiny helpers below only remove dict boilerplate;
the exported DOMAIN is plain dicts / lists / strings / ints / bools.

Theory courses already living in the math domain (math_prob_1, math_stats_1, math_regression_design,
math_bayesian_stats, math_stochastic_processes) are used as prerequisites rather than duplicated; this
domain is applied, computational and data-science focused, plus advanced graduate topics.
"""


def _m(mid, title, summary, lessons, sim=None, lab=True):
    d = {"id": mid, "title": title, "summary": summary, "lab": lab, "lessons": lessons}
    if sim:
        d["sim"] = sim
    return d


def _c(cid, code, title, level, credits, description, prerequisites, modules):
    return {
        "id": cid,
        "code": code,
        "title": title,
        "level": level,
        "credits": credits,
        "description": description,
        "prerequisites": prerequisites,
        "modules": modules,
    }


# ---------------------------------------------------------------------------------------------
# 1. Introductory & Applied Statistics
# ---------------------------------------------------------------------------------------------
STAT_APPLIED = {
    "id": "stat_applied",
    "name": "Introductory & Applied Statistics",
    "icon": "📈",
    "description": "Statistical thinking from first principles: describing data, sampling variability, confidence intervals and tests, nonparametric and resampling methods, communication and ethics, and an end-to-end data science capstone.",
    "courses": [
        _c("stat_101", "STS 101", "Introduction to Statistics and Data Analysis", 100, 4,
           "A first course in statistical reasoning for every student: collecting and describing data, variability and sampling distributions, confidence intervals, hypothesis tests, simple regression, and critical reading of quantitative claims.",
           [], [
            _m("data_and_study_design", "Data, Variables & Where Data Come From",
               "Types of variables, observational studies vs. experiments, sampling bias, and why study design limits conclusions.", [
                "Cases, Variables and Tidy Data Tables: Categorical vs. Quantitative Measurements",
                "Populations, Samples and Parameters vs. Statistics",
                "Observational Studies vs. Randomized Experiments and the Problem of Confounding",
                "Sources of Sampling Bias: Convenience Samples, Nonresponse and Voluntary Response",
                "Reading Quantitative Claims in the News: Base Rates, Denominators and Misleading Graphs",
            ], lab=False),
            _m("describing_distributions", "Describing Distributions with Graphs and Numbers",
               "Histograms, boxplots, center and spread, robustness, and the normal model.", [
                "Histograms, Dotplots and Boxplots: Shape, Center, Spread and Outliers",
                "Mean vs. Median and the Robustness of Resistant Summaries",
                "Standard Deviation, Interquartile Range and the Five-Number Summary",
                "z-Scores, Percentiles and the Empirical 68-95-99.7 Rule",
                "Comparing Groups with Side-by-Side Boxplots and Two-Way Contingency Tables",
            ]),
            _m("relationships_and_correlation", "Relationships Between Variables: Scatterplots, Correlation & Simple Regression",
               "Scatterplots, Pearson correlation, least-squares lines, residuals, and correlation vs. causation.", [
                "Scatterplots: Direction, Form, Strength and Unusual Points",
                "The Pearson Correlation Coefficient and Its Limitations for Nonlinear Patterns",
                "Fitting the Least-Squares Regression Line and Interpreting Slope and Intercept",
                "Residual Plots, R-Squared and Influential Observations",
                "Correlation Is Not Causation: Lurking Variables and Simpson's Paradox",
            ]),
            _m("sampling_variability", "Randomness, Sampling Distributions & the Central Limit Theorem",
               "Simulating chance, sampling distributions of proportions and means, standard error, and the CLT.", [
                "Probability as Long-Run Frequency: Simulating Coin Flips and Dice in Python",
                "The Sampling Distribution of a Sample Proportion",
                "The Sampling Distribution of a Sample Mean and the Standard Error",
                "The Central Limit Theorem Demonstrated by Simulation from Skewed Populations",
                "The Bootstrap Idea: Resampling Your Sample to Estimate Variability",
            ]),
            _m("intervals_and_tests", "Confidence Intervals & Hypothesis Tests",
               "Interval estimation, the logic of significance testing, p-values, errors, power and practical significance.", [
                "Confidence Intervals for a Proportion and for a Mean (t Interval)",
                "The Logic of Hypothesis Testing: Null and Alternative Hypotheses and the p-Value",
                "Type I and Type II Errors, Significance Level and Statistical Power",
                "Two-Sample Comparisons: Difference in Proportions and Welch's t Test",
                "Chi-Square Tests for Goodness of Fit and Independence",
                "Statistical vs. Practical Significance, Effect Sizes and the Replication Crisis",
            ]),
        ]),
        _c("stat_220", "STS 220", "Applied Statistical Methods: Nonparametrics, Resampling & Categorical Data", 200, 4,
           "A methods toolbox for real-world data that violate textbook assumptions: rank-based tests, permutation and bootstrap inference, ANOVA, categorical data analysis and multiple testing.",
           ["stat_101"], [
            _m("checking_assumptions", "Checking Assumptions & Transforming Data",
               "Diagnosing non-normality and unequal variances, Q-Q plots, and variance-stabilizing transformations.", [
                "Normal Quantile-Quantile Plots and Formal Normality Tests (Shapiro–Wilk)",
                "Robustness of the t Procedures to Skewness, Outliers and Heavy Tails",
                "Log, Square-Root and Box–Cox Transformations and Interpreting Results on the Original Scale",
                "Detecting Unequal Variances with Levene's Test and Spread-vs-Level Plots",
            ]),
            _m("rank_based_tests", "Rank-Based Nonparametric Tests",
               "Sign, Wilcoxon, Mann–Whitney, Kruskal–Wallis and rank correlations.", [
                "The Sign Test and the Wilcoxon Signed-Rank Test for Paired Data",
                "The Wilcoxon–Mann–Whitney Rank-Sum Test and the Hodges–Lehmann Estimator",
                "The Kruskal–Wallis Test for Several Groups and Dunn's Post-Hoc Comparisons",
                "Spearman's Rho and Kendall's Tau for Monotone Association",
                "Asymptotic Relative Efficiency: When Nonparametric Tests Lose (and Win) Power",
            ]),
            _m("permutation_bootstrap", "Permutation Tests & the Bootstrap in Practice",
               "Randomization inference, nonparametric bootstrap, percentile and BCa intervals.", [
                "Permutation Tests for Two-Group Differences Implemented from Scratch",
                "Exchangeability: When Is a Permutation Test Valid?",
                "Nonparametric Bootstrap Standard Errors for Medians, Ratios and Correlations",
                "Percentile, Basic and BCa Bootstrap Confidence Intervals Compared",
                "When the Bootstrap Fails: Extremes, Small Samples and Dependent Data",
            ]),
            _m("anova_applied", "One- and Two-Way ANOVA for Applied Comparisons",
               "Partitioning variability, F tests, interactions and post-hoc procedures.", [
                "One-Way ANOVA: Between- vs. Within-Group Variability and the F Statistic",
                "Post-Hoc Comparisons: Tukey HSD, Bonferroni and Planned Contrasts",
                "Two-Way ANOVA, Interaction Plots and Interpreting Interaction Effects",
                "Welch's ANOVA and Remedies for Heteroscedastic Groups",
            ]),
            _m("categorical_multiple_testing", "Categorical Data & Multiple Testing",
               "Exact tests, measures of association for tables, and controlling error rates across many tests.", [
                "Fisher's Exact Test and McNemar's Test for Paired Binary Outcomes",
                "Relative Risk, Odds Ratios and Their Confidence Intervals",
                "Stratified Tables and the Cochran–Mantel–Haenszel Test",
                "Family-Wise Error Rate Control: Bonferroni and Holm Procedures",
                "False Discovery Rate and the Benjamini–Hochberg Procedure on Genomics-Scale Data",
            ]),
        ]),
        _c("stat_240", "STS 240", "Statistical Communication, Reproducibility & Data Ethics", 200, 3,
           "How statisticians communicate uncertainty, build reproducible analyses, and handle data responsibly: reports, visual storytelling, version-controlled workflows, privacy and fairness.",
           ["stat_101"], [
            _m("communicating_uncertainty", "Communicating Uncertainty to Non-Statisticians",
               "Explaining intervals, risk and probability clearly without overstating conclusions.", [
                "Explaining Confidence Intervals and p-Values Without Common Misinterpretations",
                "Absolute vs. Relative Risk and Natural Frequencies in Risk Communication",
                "Visualizing Uncertainty: Error Bars, Interval Plots, Fan Charts and Quantile Dotplots",
                "Writing the Statistical Methods and Results Sections of a Technical Report",
            ], lab=False),
            _m("reproducible_workflows", "Reproducible Analysis Workflows",
               "Literate programming, version control, environments and analysis pipelines.", [
                "Notebooks vs. Scripts and Literate Programming with Jupyter and Quarto",
                "Version Control with Git for Data Analysis Projects",
                "Pinning Environments and Random Seeds for Computational Reproducibility",
                "Project Structure, Raw vs. Derived Data, and Automated Analysis Pipelines",
            ]),
            _m("research_integrity", "Research Integrity: p-Hacking, Forking Paths & Preregistration",
               "How flexible analysis inflates false positives and the remedies the field has adopted.", [
                "Simulating p-Hacking: Optional Stopping, Outcome Switching and Subgroup Fishing",
                "The Garden of Forking Paths and Researcher Degrees of Freedom",
                "Preregistration, Registered Reports and Multiverse Analyses",
                "Publication Bias, Funnel Plots and the File-Drawer Problem",
            ]),
            _m("data_ethics_privacy", "Data Ethics, Privacy & Fairness",
               "Consent, de-identification, differential privacy basics and algorithmic fairness metrics.", [
                "Informed Consent, IRBs and the Ethics of Secondary Data Use",
                "Re-identification Attacks and the Limits of k-Anonymity",
                "Differential Privacy for Statisticians: Laplace Noise on Counts and Means",
                "Group Fairness Metrics: Demographic Parity, Equalized Odds and Calibration Trade-offs",
            ]),
        ]),
        _c("stat_420", "STS 420", "Data Science Capstone: End-to-End Statistical Consulting Project", 400, 5,
           "A semester-long practicum integrating the program: scoping a question with a stakeholder, acquiring and cleaning data, choosing and validating models, quantifying uncertainty, and delivering a reproducible report and presentation.",
           ["stat_240", "stat_330", "stat_350", "stat_440"], [
            _m("problem_scoping", "Scoping the Problem with Stakeholders",
               "Turning vague questions into estimands, success metrics and analysis plans.", [
                "The Statistical Consulting Interview: Eliciting the Real Question",
                "Defining the Estimand: Descriptive, Predictive or Causal Goals",
                "Writing a Statistical Analysis Plan Before Touching the Data",
                "Power and Sample-Size Feasibility Assessment for the Project",
            ], lab=False),
            _m("data_acquisition_audit", "Data Acquisition, Auditing & Cleaning",
               "Provenance, quality audits, missingness and documentation.", [
                "Data Provenance, Data Dictionaries and Codebooks",
                "Systematic Data Quality Audits: Ranges, Duplicates, Joins and Invariants",
                "Characterizing Missingness Patterns and Choosing a Handling Strategy",
                "Building a Cleaned Analysis Dataset with Tested Transformation Code",
            ]),
            _m("modeling_validation", "Modeling, Validation & Sensitivity Analysis",
               "Model selection aligned with the estimand, diagnostics and robustness checks.", [
                "Choosing Between Interpretable Models and Predictive Black Boxes for the Client",
                "Out-of-Sample Validation, Calibration and Error Analysis",
                "Sensitivity Analyses for Assumptions, Outliers and Analytic Choices",
                "Quantifying and Propagating Uncertainty into Final Recommendations",
            ]),
            _m("delivery", "Reporting, Visualization & Delivery",
               "Executive summaries, dashboards, and handoff of reproducible code.", [
                "Writing an Executive Summary and a Technical Appendix",
                "Designing Explanatory Figures for a Decision-Making Audience",
                "Building a Lightweight Interactive Dashboard for Results",
                "Code Review, Documentation and Handoff of a Reproducible Repository",
            ]),
            _m("capstone_presentation", "Capstone Presentation & Peer Review",
               "Presenting, defending and critiquing statistical work.", [
                "Structuring a 15-Minute Technical Presentation of a Statistical Analysis",
                "Anticipating and Answering Methodological Questions",
                "Structured Peer Review of Another Team's Analysis",
                "Reflecting on Limitations and Proposing Follow-Up Studies",
            ], lab=False),
        ]),
    ],
}

# ---------------------------------------------------------------------------------------------
# 2. Statistical Computing & Data Science Tools
# ---------------------------------------------------------------------------------------------
STAT_COMPUTING = {
    "id": "stat_computing",
    "name": "Statistical Computing & Data Science Tools",
    "icon": "💻",
    "description": "Python for data science, visualization, data wrangling and SQL, simulation and numerical methods for statistics, and scalable computation on large data.",
    "courses": [
        _c("stat_110", "DSCI 110", "Programming for Data Science in Python", 100, 4,
           "Python from zero for data analysis: core language, NumPy arrays, pandas DataFrames, reading files and APIs, functions and testing, and a first complete analysis.",
           [], [
            _m("python_core", "Python Fundamentals for Data Work",
               "Types, control flow, collections and functions with data-oriented examples.", [
                "Variables, Numeric Types, Strings and Booleans in Python",
                "Lists, Dictionaries, Tuples and Sets for Organizing Records",
                "Conditionals, Loops and List/Dictionary Comprehensions",
                "Writing Functions with Arguments, Defaults and Docstrings",
                "Reading Error Messages, Tracebacks and Debugging Strategies",
            ]),
            _m("numpy_arrays", "Vectorized Computing with NumPy",
               "ndarrays, broadcasting, boolean indexing and random number generation.", [
                "Creating ndarrays, Shapes, dtypes and Memory Layout",
                "Vectorized Arithmetic, Universal Functions and Broadcasting Rules",
                "Boolean Masks, Fancy Indexing and Aggregations Along Axes",
                "Random Number Generators, Seeds and Simulating Random Experiments",
            ]),
            _m("pandas_basics", "Tabular Data with pandas",
               "Series and DataFrames, selection, filtering, sorting and summaries.", [
                "Series and DataFrames: Indexes, Columns and dtypes",
                "Selecting Rows and Columns with loc, iloc and Boolean Filters",
                "Creating Derived Columns, Sorting and Handling Missing Values (NaN)",
                "Descriptive Summaries with describe, value_counts and crosstab",
                "Group-By Aggregation: Split-Apply-Combine",
            ]),
            _m("data_io", "Getting Data In and Out",
               "CSV, Excel, JSON, web APIs and basic web scraping.", [
                "Reading and Writing CSV and Excel Files and Handling Encodings",
                "Parsing Nested JSON into Flat Tables",
                "Requesting Data from REST APIs with Pagination and Rate Limits",
                "Introductory Web Scraping with HTML Parsing and Its Ethics",
            ]),
            _m("first_analysis", "Writing Reliable Analysis Code & a First Project",
               "Modules, testing, plotting basics and an end-to-end mini analysis.", [
                "Organizing Code into Modules and Reusable Functions",
                "Unit Testing Data Functions with pytest and assert Statements",
                "First Plots with matplotlib: Line, Bar, Histogram and Scatter",
                "Mini-Project: Cleaning, Summarizing and Plotting a Public Dataset",
            ]),
        ]),
        _c("stat_120", "DSCI 120", "Data Visualization & Exploratory Data Analysis", 100, 4,
           "Principles and practice of statistical graphics: perception, the grammar of graphics, choosing encodings, multivariate and interactive displays, and EDA as a disciplined workflow.",
           ["stat_110"], [
            _m("perception_principles", "Visual Perception & Design Principles",
               "How humans decode graphics and how to design for accuracy.", [
                "Cleveland–McGill Ranking of Visual Encodings: Position, Length, Angle, Area, Color",
                "Pre-Attentive Attributes, Gestalt Principles and Visual Hierarchy",
                "Color Theory for Data: Sequential, Diverging and Qualitative Palettes and Color-Blind Safety",
                "Data-Ink Ratio, Chartjunk and Honest Axes",
            ], lab=False),
            _m("grammar_of_graphics", "The Grammar of Graphics",
               "Layered graphics: data, aesthetics, geoms, scales, facets and coordinates.", [
                "Aesthetic Mappings, Geometric Objects and Statistical Transformations",
                "Scales, Coordinate Systems and Log Axes",
                "Faceting into Small Multiples for Conditional Comparisons",
                "Building Layered Plots with seaborn and plotnine",
            ]),
            _m("distribution_displays", "Displaying Distributions & Uncertainty",
               "Density estimates, ECDFs, violin and ridgeline plots, and error displays.", [
                "Histogram Bin Width Choice and Kernel Density Estimates",
                "Empirical CDFs and Quantile Plots for Comparing Distributions",
                "Violin, Strip, Beeswarm and Ridgeline Plots",
                "Showing Uncertainty with Intervals, Bands and Gradient Displays",
            ]),
            _m("multivariate_displays", "Multivariate, Temporal & Geographic Displays",
               "Scatterplot matrices, heatmaps, time series charts and maps.", [
                "Scatterplot Matrices, Overplotting Remedies and Hexbin Plots",
                "Heatmaps and Clustered Correlation Matrices",
                "Time Series Graphics: Seasonality Plots, Lag Plots and Calendar Heatmaps",
                "Choropleth Maps, Projections and the Modifiable Areal Unit Problem",
            ]),
            _m("eda_workflow", "Exploratory Data Analysis Workflow & Interactive Graphics",
               "Tukey-style EDA, data storytelling and interactive dashboards.", [
                "Tukey's Exploratory Data Analysis Philosophy and Iterative Questioning",
                "A Systematic EDA Checklist: Univariate, Bivariate and Missingness Exploration",
                "Interactive Graphics with Plotly and Altair: Brushing, Linking and Tooltips",
                "From Exploratory to Explanatory: Annotating Figures for a Narrative",
            ]),
        ]),
        _c("stat_210", "DSCI 210", "Data Wrangling, Databases & SQL for Data Science", 200, 4,
           "Industrial-strength data preparation: tidy data, reshaping, joins, strings and dates, relational databases and SQL, and data validation pipelines.",
           ["stat_110", "stat_101"], [
            _m("tidy_data", "Tidy Data & Reshaping",
               "Tidy principles, melting and pivoting, and multi-indexes.", [
                "Wickham's Tidy Data Principles and Common Messy-Data Patterns",
                "Melting Wide Data to Long and Pivoting Long Data to Wide",
                "Hierarchical (Multi-) Indexes, Stacking and Unstacking",
                "Exploding Nested Lists and Normalizing Semi-Structured Records",
            ]),
            _m("joins_combining", "Combining Datasets: Joins & Keys",
               "Relational joins, key integrity and reconciling sources.", [
                "Primary Keys, Foreign Keys and Checking Key Uniqueness",
                "Inner, Left, Right, Outer, Semi and Anti Joins in pandas",
                "Diagnosing Join Explosions and Unmatched Records",
                "Fuzzy Matching and Record Linkage Across Messy Sources",
            ]),
            _m("strings_dates", "Strings, Regular Expressions, Dates & Categoricals",
               "Cleaning text fields, parsing timestamps and managing factors.", [
                "String Methods and Regular Expressions for Cleaning Text Fields",
                "Parsing Dates, Time Zones and Resampling Time-Indexed Data",
                "Categorical dtypes, Ordered Levels and Collapsing Rare Categories",
                "Window Functions in pandas: Rolling, Expanding and Shifted Features",
            ]),
            _m("sql_databases", "Relational Databases & SQL",
               "SELECT through window functions, query from Python, and schema design.", [
                "The Relational Model, Schemas and Normal Forms",
                "SQL SELECT, WHERE, GROUP BY and HAVING with SQLite and DuckDB",
                "SQL Joins, Subqueries and Common Table Expressions",
                "SQL Window Functions for Running Totals, Ranks and Cohorts",
                "Querying Databases from Python and Avoiding SQL Injection",
            ]),
            _m("data_validation", "Data Validation & Wrangling Pipelines",
               "Schema checks, assertions and reproducible ETL.", [
                "Declarative Data Validation with Schema Checks (pandera)",
                "Detecting Anomalies, Duplicates and Impossible Values Automatically",
                "Method Chaining and Building Reusable Wrangling Pipelines",
                "Columnar Formats (Parquet, Arrow) and Efficient Data Storage",
            ]),
        ]),
        _c("stat_310", "DSCI 310", "Statistical Computing: Simulation, Resampling & Optimization", 300, 4,
           "The computational engine of modern statistics: random variate generation, Monte Carlo integration and variance reduction, numerical optimization for likelihoods, the EM algorithm, and numerical linear algebra for regression.",
           ["stat_210", "math_prob_1", "math_linear_algebra_1", "math_calc_2"], [
            _m("random_generation", "Random Number & Random Variate Generation",
               "PRNGs and methods for sampling arbitrary distributions.", [
                "Pseudo-Random Number Generators: LCGs, Mersenne Twister and PCG",
                "Inverse-Transform Sampling for Continuous and Discrete Distributions",
                "Acceptance–Rejection Sampling and Choosing Efficient Envelopes",
                "Generating Multivariate Normal Vectors via the Cholesky Factor",
                "Testing Random Number Generators for Uniformity and Independence",
            ]),
            _m("monte_carlo", "Monte Carlo Integration & Variance Reduction",
               "Estimating expectations by simulation and making it efficient.", [
                "Monte Carlo Estimation of Integrals and Its Error Rate",
                "Importance Sampling and Effective Sample Size",
                "Control Variates and Antithetic Variates",
                "Stratified Sampling and Quasi-Monte Carlo Sequences",
                "Designing and Reporting Simulation Studies to Evaluate Statistical Methods",
            ]),
            _m("optimization_likelihood", "Numerical Optimization for Maximum Likelihood",
               "Root finding and optimization methods applied to log-likelihoods.", [
                "Bisection, Newton–Raphson and Fisher Scoring for Score Equations",
                "Gradient Descent, Line Search and Quasi-Newton (BFGS) Methods",
                "Constrained Optimization and Reparameterization Tricks",
                "Automatic Differentiation for Statistical Models with JAX",
                "Numerical Standard Errors from the Observed Information (Hessian)",
            ]),
            _m("em_algorithm", "The EM Algorithm & Latent Variable Computation",
               "EM derivation, mixtures, missing data and convergence acceleration.", [
                "Derivation of the Expectation–Maximization Algorithm via the ELBO",
                "EM for Gaussian Mixture Models Implemented from Scratch",
                "EM for Missing Data in Multivariate Normal Models",
                "Convergence Properties, Local Optima and Initialization Strategies for EM",
            ]),
            _m("numerical_linear_models", "Numerical Linear Algebra for Statistics",
               "Stable computation of least squares and related decompositions.", [
                "Why Not Invert X'X: Conditioning and Numerical Stability",
                "Least Squares via QR Decomposition and Householder Reflections",
                "The Singular Value Decomposition for Rank-Deficient Regression and PCA",
                "Sparse Matrices and Iterative Solvers (Conjugate Gradient) for Large Problems",
            ]),
        ]),
        _c("stat_410", "DSCI 410", "Scalable Statistical Computing & Big Data", 400, 4,
           "Statistics when data do not fit in memory: profiling and performance, parallel and distributed computation, Spark and SQL engines, streaming and sketching algorithms, and stochastic optimization at scale.",
           ["stat_310"], [
            _m("performance", "Performance Engineering for Statistical Code",
               "Profiling, vectorization, compilation and memory management.", [
                "Profiling Python Code: cProfile, line_profiler and Memory Profilers",
                "Vectorization vs. Loops and Just-In-Time Compilation with Numba",
                "Chunked and Out-of-Core Processing with Arrow and DuckDB",
                "Algorithmic Complexity of Common Statistical Procedures",
            ]),
            _m("parallel_distributed", "Parallel & Distributed Computation",
               "Embarrassingly parallel simulation, map-reduce and distributed DataFrames.", [
                "Embarrassingly Parallel Simulation with multiprocessing and joblib",
                "The MapReduce Model and Divide-and-Conquer Statistical Estimators",
                "Distributed DataFrames with Dask and Apache Spark",
                "Reproducible Random Streams Across Parallel Workers",
            ]),
            _m("streaming_sketching", "Streaming Algorithms & Data Sketches",
               "One-pass statistics and probabilistic summaries.", [
                "Welford's Online Algorithm for Mean and Variance",
                "Reservoir Sampling from Streams of Unknown Length",
                "Count-Min Sketch and HyperLogLog for Frequencies and Cardinalities",
                "Streaming Quantiles with t-Digest and the GK Algorithm",
            ]),
            _m("scalable_inference", "Scalable Estimation & Inference",
               "Subsampling, bag of little bootstraps and stochastic gradient methods.", [
                "Stochastic Gradient Descent for Large-Scale Maximum Likelihood",
                "The Bag of Little Bootstraps and Subsampling Inference",
                "Divide-and-Combine Estimators and Communication-Efficient Inference",
                "Random Projections and Sketched Least Squares",
            ]),
            _m("cloud_workflows", "Cloud Data Warehouses & Production Analytics",
               "Columnar warehouses, orchestration and monitoring of statistical jobs.", [
                "Columnar Data Warehouses and Cost-Aware SQL Analytics",
                "Orchestrating Batch Statistical Pipelines and Scheduling",
                "Monitoring Data Drift and Metric Integrity in Production",
                "Case Study: Computing Experiment Metrics over Billions of Events",
            ]),
        ]),
    ],
}

# ---------------------------------------------------------------------------------------------
# 3. Regression & Linear Models
# ---------------------------------------------------------------------------------------------
STAT_MODELS = {
    "id": "stat_models",
    "name": "Regression & Linear Models",
    "icon": "📉",
    "description": "Applied multiple regression, the theory of linear models, generalized linear models for categorical and count data, and mixed-effects, hierarchical and longitudinal models.",
    "courses": [
        _c("stat_230", "STS 230", "Applied Regression Analysis", 200, 4,
           "Multiple regression as a practical modeling tool: interpretation, categorical predictors and interactions, diagnostics, model building, and an introduction to logistic regression — all with real data in Python.",
           ["stat_101", "stat_110"], [
            _m("multiple_regression", "Multiple Linear Regression in Practice",
               "Fitting, interpreting and testing multiple regression models.", [
                "From Simple to Multiple Regression: Holding Other Variables Constant",
                "Fitting Models with statsmodels Formulas and Reading the Output Table",
                "t Tests for Coefficients, the Overall F Test and Confidence Intervals",
                "Prediction Intervals vs. Confidence Intervals for the Mean Response",
            ]),
            _m("categorical_interactions", "Categorical Predictors, Interactions & Nonlinearity",
               "Dummy coding, interaction terms and polynomial or spline terms.", [
                "Indicator (Dummy) Coding, Reference Levels and Effect Coding",
                "Interaction Terms and Interpreting Varying Slopes",
                "Polynomial Terms and Centering to Reduce Collinearity",
                "Piecewise Linear and Basic Spline Terms for Nonlinear Trends",
            ]),
            _m("diagnostics", "Regression Diagnostics & Remedies",
               "Residual analysis, influence measures, collinearity and transformations.", [
                "Residual vs. Fitted, Scale-Location and Normal Q-Q Diagnostic Plots",
                "Leverage, Studentized Residuals and Cook's Distance",
                "Multicollinearity and Variance Inflation Factors",
                "Heteroscedasticity: Breusch–Pagan Test and Robust (Sandwich) Standard Errors",
                "Transforming Responses and Predictors and Interpreting Log Models",
            ]),
            _m("model_building", "Model Building & Selection",
               "Choosing predictors, comparing models and avoiding overfitting.", [
                "Nested Model Comparison with Partial F Tests",
                "Information Criteria: Adjusted R-Squared, AIC and BIC",
                "The Perils of Stepwise Selection and Post-Selection Inference",
                "Train/Test Splits and Cross-Validation for Regression Models",
            ]),
            _m("intro_logistic", "Introduction to Logistic Regression",
               "Modeling binary outcomes with the logit link.", [
                "Why Linear Probability Models Fail for Binary Outcomes",
                "The Logistic Model, Log-Odds and Interpreting Odds Ratios",
                "Fitting Logistic Regression and Wald and Likelihood-Ratio Tests",
                "Classification Thresholds, Confusion Matrices and ROC Curves",
            ]),
        ]),
        _c("stat_330", "STS 330", "Theory of Linear Models", 300, 4,
           "The linear model in matrix form: projections, Gauss–Markov, distribution theory for quadratic forms, general linear hypotheses, generalized least squares and penalized estimation.",
           ["stat_230", "math_linear_algebra_1", "math_stats_1"], [
            _m("matrix_ls", "Least Squares as Projection",
               "The geometry of OLS in matrix form.", [
                "The Linear Model y = Xβ + ε in Matrix Notation",
                "Normal Equations and the Hat Matrix as an Orthogonal Projection",
                "Estimability, Rank-Deficient Designs and Generalized Inverses",
                "The Gauss–Markov Theorem and Best Linear Unbiased Estimation",
            ]),
            _m("distribution_theory", "Multivariate Normal & Quadratic Form Distribution Theory",
               "The distributional results that underpin linear model inference.", [
                "Properties of the Multivariate Normal Distribution and Linear Transformations",
                "Distribution of Quadratic Forms and Cochran's Theorem",
                "Independence of β-hat and the Residual Sum of Squares",
                "Deriving the t and F Distributions of Regression Test Statistics",
            ]),
            _m("general_linear_hypothesis", "The General Linear Hypothesis & Simultaneous Inference",
               "Testing Cβ = d, confidence regions and multiple comparisons.", [
                "Testing the General Linear Hypothesis Cβ = d with the F Statistic",
                "Confidence Ellipsoids for Coefficient Vectors",
                "Scheffé and Bonferroni Simultaneous Intervals",
                "ANOVA Models as Linear Models: Cell Means and Constraints",
            ]),
            _m("gls_robust", "Generalized Least Squares & Robust Regression",
               "Correlated and heteroscedastic errors, and outlier-resistant fitting.", [
                "Generalized and Weighted Least Squares for Known Covariance",
                "Feasible GLS and Heteroscedasticity-Consistent (HC0–HC3) Covariance Estimators",
                "M-Estimation, Huber Loss and Iteratively Reweighted Least Squares",
                "High-Breakdown Estimators: Least Trimmed Squares and MM-Estimation",
            ]),
            _m("penalized_ls", "Penalized Least Squares",
               "Ridge, lasso and the bias–variance trade-off from a linear model viewpoint.", [
                "Bias–Variance Decomposition of Prediction Error for Linear Models",
                "Ridge Regression, Its SVD Form and Effective Degrees of Freedom",
                "The Lasso, Soft Thresholding and Coordinate Descent",
                "Choosing the Penalty by Cross-Validation and Generalized Cross-Validation",
            ]),
        ]),
        _c("stat_340", "STS 340", "Generalized Linear Models & Categorical Data Analysis", 300, 4,
           "Exponential-family regression for binary, multinomial, ordinal, count and positive continuous outcomes: estimation by IRLS, deviance, overdispersion, zero-inflation and contingency-table models.",
           ["stat_230", "math_stats_1"], [
            _m("glm_framework", "The GLM Framework",
               "Exponential families, link functions and IRLS estimation.", [
                "Exponential Dispersion Families and Canonical Links",
                "Maximum Likelihood for GLMs via Iteratively Reweighted Least Squares",
                "Deviance, Pearson Statistics and Goodness of Fit",
                "Wald, Score and Likelihood-Ratio Inference in GLMs",
            ]),
            _m("binary_outcomes", "Binary Response Models in Depth",
               "Logistic, probit and complementary log-log models, separation and diagnostics.", [
                "Logit vs. Probit vs. Complementary Log-Log Links",
                "Complete Separation and Firth's Penalized Likelihood",
                "Residuals and Influence Diagnostics for Logistic Regression",
                "Calibration, Hosmer–Lemeshow and Brier Score Assessment",
            ]),
            _m("multicategory", "Multinomial & Ordinal Response Models",
               "Baseline-category logits and cumulative link models.", [
                "Baseline-Category (Multinomial) Logistic Regression",
                "Cumulative Logit (Proportional Odds) Models for Ordinal Outcomes",
                "Testing the Proportional Odds Assumption and Partial Proportional Odds",
                "Discrete Choice Models and the Independence of Irrelevant Alternatives",
            ]),
            _m("count_models", "Count Data Models",
               "Poisson regression, offsets, overdispersion and excess zeros.", [
                "Poisson Regression for Counts and Rates with Exposure Offsets",
                "Overdispersion: Quasi-Poisson and Negative Binomial Regression",
                "Zero-Inflated and Hurdle Models for Excess Zeros",
                "Gamma and Inverse-Gaussian GLMs for Positive Skewed Responses",
            ]),
            _m("contingency_loglinear", "Log-Linear Models for Contingency Tables",
               "Multiway tables, conditional independence and model selection.", [
                "Poisson–Multinomial Connection for Contingency Tables",
                "Log-Linear Models of Independence, Conditional Independence and Homogeneous Association",
                "Hierarchical Model Selection for Three-Way Tables",
                "Graphical Interpretation of Log-Linear Models",
            ]),
        ]),
        _c("stat_430", "STS 430", "Mixed Effects, Hierarchical & Longitudinal Models", 400, 4,
           "Models for clustered and repeated-measures data: random intercepts and slopes, REML, generalized linear mixed models, marginal models with GEE, and longitudinal and multilevel analysis strategies.",
           ["stat_330", "stat_340"], [
            _m("clustered_data", "Why Clustered Data Need Special Models",
               "Intraclass correlation, design effects and pooling.", [
                "Clustered and Repeated-Measures Data and the Intraclass Correlation",
                "Complete Pooling, No Pooling and Partial Pooling Compared",
                "Design Effects and the Cost of Ignoring Clustering",
                "Fixed Effects vs. Random Effects: Modeling Choices and Interpretation",
            ]),
            _m("linear_mixed_models", "Linear Mixed Models",
               "Random intercepts and slopes, estimation and BLUPs.", [
                "Random-Intercept and Random-Slope Models",
                "Maximum Likelihood vs. Restricted Maximum Likelihood (REML) Estimation",
                "Best Linear Unbiased Predictors (BLUPs) and Shrinkage",
                "Testing Variance Components and Boundary Issues in Likelihood-Ratio Tests",
                "Fitting Mixed Models in Python with statsmodels MixedLM",
            ]),
            _m("longitudinal", "Longitudinal Data Analysis",
               "Growth curves, covariance structures and time-varying covariates.", [
                "Exploring Longitudinal Data with Spaghetti Plots and Empirical Variograms",
                "Growth Curve Models for Individual Trajectories",
                "Residual Covariance Structures: Compound Symmetry, AR(1) and Unstructured",
                "Time-Varying Covariates and Within- vs. Between-Subject Effects",
            ]),
            _m("glmm", "Generalized Linear Mixed Models",
               "Random effects for non-Gaussian outcomes and approximate likelihoods.", [
                "GLMMs for Binary and Count Outcomes with Random Effects",
                "Laplace Approximation and Adaptive Gauss–Hermite Quadrature",
                "Subject-Specific vs. Population-Averaged Interpretations",
                "Crossed and Nested Random Effects in Multilevel Designs",
            ]),
            _m("gee_marginal", "Marginal Models & Generalized Estimating Equations",
               "Population-averaged inference robust to covariance misspecification.", [
                "Marginal Models and Working Correlation Structures",
                "Generalized Estimating Equations and Sandwich Variance Estimation",
                "GEE vs. GLMM: When to Use Which",
                "Missing Data in Longitudinal Studies: Dropout Mechanisms and Weighted GEE",
            ]),
        ]),
    ],
}

# ---------------------------------------------------------------------------------------------
# 4. Experimental Design, Sampling & Causal Inference
# ---------------------------------------------------------------------------------------------
STAT_DESIGN_CAUSAL = {
    "id": "stat_design_causal",
    "name": "Experimental Design, Sampling & Causal Inference",
    "icon": "🧪",
    "description": "Designing experiments and online A/B tests, survey sampling and missing data, potential outcomes and observational studies, quasi-experimental designs, and causal machine learning.",
    "courses": [
        _c("stat_350", "STS 350", "Design of Experiments & Online Controlled Experiments", 300, 4,
           "Classical and modern experimentation: randomization, blocking, factorial and fractional designs, response surfaces, and the practice of large-scale A/B testing including variance reduction and sequential monitoring.",
           ["stat_230", "math_stats_1"], [
            _m("randomization_principles", "Principles of Experimentation",
               "Randomization, replication, blocking and power analysis.", [
                "Fisher's Principles: Randomization, Replication and Local Control",
                "Completely Randomized vs. Randomized Complete Block Designs",
                "Latin Squares and Crossover Designs",
                "Power and Sample-Size Calculations by Formula and by Simulation",
            ]),
            _m("factorial_designs", "Factorial & Fractional Factorial Designs",
               "Screening many factors efficiently.", [
                "Full 2^k Factorial Designs and Estimating Main Effects and Interactions",
                "Fractional Factorials, Aliasing, Defining Relations and Resolution",
                "Split-Plot Designs and Hard-to-Change Factors",
                "Plackett–Burman Screening Designs",
            ]),
            _m("response_surface", "Response Surface Methodology & Optimal Design",
               "Sequential experimentation to optimize processes.", [
                "Steepest Ascent and Sequential Experimentation",
                "Central Composite and Box–Behnken Designs for Second-Order Models",
                "D-, A- and I-Optimal Designs and Computer-Generated Designs",
                "Robust Parameter Design and Taguchi Methods Critically Examined",
            ]),
            _m("ab_testing", "A/B Testing at Scale",
               "Metrics, randomization units, validity threats and analysis of online experiments.", [
                "Choosing Overall Evaluation Criteria, Guardrail Metrics and Randomization Units",
                "Sample Ratio Mismatch and Other Trustworthiness Checks",
                "Ratio Metrics and the Delta Method for Variance",
                "Novelty Effects, Interference and Network/Marketplace Experiments",
            ]),
            _m("variance_reduction_sequential", "Variance Reduction & Sequential Testing",
               "CUPED, stratification and always-valid inference for peeking.", [
                "CUPED: Variance Reduction with Pre-Experiment Covariates",
                "Post-Stratification and Regression Adjustment in Randomized Experiments",
                "The Peeking Problem and Group Sequential Designs with Alpha Spending",
                "Always-Valid p-Values and Mixture Sequential Probability Ratio Tests",
                "Multi-Armed Bandits vs. Fixed-Horizon Experiments",
            ]),
        ]),
        _c("stat_360", "STS 360", "Survey Sampling & Missing Data", 300, 4,
           "Design-based inference for finite populations — stratified, cluster and multistage sampling, weighting and calibration, variance estimation for complex surveys — and principled handling of missing data with multiple imputation.",
           ["stat_230", "math_prob_1"], [
            _m("srs_design_based", "Design-Based Inference & Simple Random Sampling",
               "Finite populations, inclusion probabilities and Horvitz–Thompson estimation.", [
                "Finite Populations, Sampling Frames and Design-Based vs. Model-Based Inference",
                "Simple Random Sampling and the Finite Population Correction",
                "Inclusion Probabilities and the Horvitz–Thompson Estimator",
                "Ratio and Regression Estimators Using Auxiliary Information",
            ]),
            _m("complex_designs", "Stratified, Cluster & Multistage Sampling",
               "Efficient designs and their variance consequences.", [
                "Stratified Sampling and Neyman Optimal Allocation",
                "Cluster Sampling, Intracluster Correlation and Design Effects",
                "Multistage and Probability-Proportional-to-Size Sampling",
                "Systematic Sampling and Its Hidden Periodicity Risks",
            ]),
            _m("weighting_variance", "Weighting, Calibration & Variance Estimation",
               "Survey weights, nonresponse adjustment and replication variance.", [
                "Base Weights, Nonresponse Adjustment and Weighting-Class Methods",
                "Post-Stratification, Raking and Generalized Calibration",
                "Linearization (Taylor Series) Variance Estimation for Complex Surveys",
                "Replication Methods: Jackknife, Balanced Repeated Replication and Bootstrap Weights",
            ]),
            _m("missing_mechanisms", "Missing Data Mechanisms",
               "MCAR, MAR, MNAR and the bias of naive methods.", [
                "Rubin's Taxonomy: MCAR, MAR and MNAR",
                "Bias of Complete-Case Analysis and Single Imputation by Simulation",
                "Inverse Probability Weighting for Missing Outcomes",
                "Sensitivity Analysis for Not-Missing-at-Random Data",
            ]),
            _m("multiple_imputation", "Multiple Imputation",
               "Imputation models, chained equations and Rubin's combining rules.", [
                "Rubin's Rules for Combining Estimates Across Imputations",
                "Multiple Imputation by Chained Equations (MICE) and Predictive Mean Matching",
                "Congeniality and Choosing Variables for the Imputation Model",
                "Diagnostics for Imputations and Reporting Missing-Data Analyses",
            ]),
        ]),
        _c("stat_390", "STS 390", "Causal Inference I: Potential Outcomes, DAGs & Observational Studies", 300, 4,
           "Foundations of causal reasoning: the potential outcomes framework, randomization inference, causal graphs and identification, confounding adjustment by matching, weighting and regression, and sensitivity analysis.",
           ["stat_230", "math_stats_1"], [
            _m("potential_outcomes", "Potential Outcomes & Randomized Experiments",
               "Defining causal effects and why randomization identifies them.", [
                "Potential Outcomes, SUTVA and the Fundamental Problem of Causal Inference",
                "Average, Conditional and Treated-Group Causal Estimands (ATE, CATE, ATT)",
                "Fisher's Sharp Null and Randomization Inference",
                "Neyman's Repeated-Sampling Inference for the Average Treatment Effect",
            ]),
            _m("causal_graphs", "Causal Graphs & Identification",
               "DAGs, d-separation, the backdoor criterion and common biases.", [
                "Directed Acyclic Graphs and Structural Causal Models",
                "d-Separation and Reading Conditional Independencies from Graphs",
                "The Backdoor Criterion and Choosing Adjustment Sets",
                "Collider Bias, M-Bias and Selection Bias Illustrated by Simulation",
                "The Frontdoor Criterion and an Introduction to do-Calculus",
            ]),
            _m("matching", "Matching & Propensity Scores",
               "Balancing covariates by design.", [
                "The Propensity Score and Its Balancing Property",
                "Nearest-Neighbor, Caliper and Optimal Matching",
                "Assessing Covariate Balance with Standardized Mean Differences and Love Plots",
                "Overlap, Positivity Violations and Trimming",
            ]),
            _m("weighting_regression", "Weighting, Regression Adjustment & Doubly Robust Estimation",
               "Estimators of average effects under unconfoundedness.", [
                "Inverse Probability of Treatment Weighting and Stabilized Weights",
                "Regression Adjustment and G-Computation",
                "Augmented IPW: Doubly Robust Estimation",
                "Bootstrap Inference for Causal Effect Estimators",
            ]),
            _m("sensitivity", "Sensitivity Analysis for Unmeasured Confounding",
               "How strong would hidden bias need to be?", [
                "Rosenbaum Bounds for Matched Observational Studies",
                "E-Values for Unmeasured Confounding",
                "Negative Controls and Falsification Tests",
                "Case Study: Reanalyzing a Famous Observational Study",
            ]),
        ]),
        _c("stat_490", "STS 490", "Causal Inference II: Quasi-Experimental & Econometric Designs", 400, 4,
           "Designs that exploit natural variation when unconfoundedness is implausible: instrumental variables, regression discontinuity, difference-in-differences with staggered adoption, synthetic control, and time-varying treatments.",
           ["stat_390", "stat_340"], [
            _m("instrumental_variables", "Instrumental Variables",
               "IV identification, LATE and weak instruments.", [
                "Instrumental Variables Assumptions: Relevance, Exclusion and Independence",
                "Two-Stage Least Squares and the Wald Estimator",
                "Compliers and the Local Average Treatment Effect",
                "Weak Instruments, First-Stage F Statistics and Anderson–Rubin Inference",
                "Mendelian Randomization as an IV Design",
            ]),
            _m("regression_discontinuity", "Regression Discontinuity Designs",
               "Sharp and fuzzy RD, bandwidth selection and validity checks.", [
                "Sharp Regression Discontinuity and Local Linear Estimation",
                "Bandwidth Selection and Robust Bias-Corrected Confidence Intervals",
                "Fuzzy Regression Discontinuity as Local IV",
                "Manipulation Tests (McCrary/Density) and Covariate Balance at the Cutoff",
            ]),
            _m("difference_in_differences", "Difference-in-Differences & Panel Methods",
               "Parallel trends, event studies and staggered adoption.", [
                "Two-Period Difference-in-Differences and the Parallel Trends Assumption",
                "Two-Way Fixed Effects and Event-Study Specifications",
                "Problems of TWFE with Staggered Adoption and Heterogeneous Effects",
                "Modern Staggered DiD Estimators (Callaway–Sant'Anna, Sun–Abraham)",
            ]),
            _m("synthetic_control", "Synthetic Control & Comparative Case Studies",
               "Constructing counterfactuals from donor pools.", [
                "The Synthetic Control Method and Donor Pool Weights",
                "Placebo-in-Space and Placebo-in-Time Inference",
                "Synthetic Difference-in-Differences",
                "Interrupted Time Series and Bayesian Structural Time Series for Impact Estimation",
            ]),
            _m("time_varying", "Time-Varying Treatments & Mediation",
               "Sequential confounding, g-methods and decomposing effects.", [
                "Treatment-Confounder Feedback and Why Standard Regression Fails",
                "Marginal Structural Models with Time-Varying Weights",
                "The Parametric G-Formula for Dynamic Treatment Regimes",
                "Causal Mediation: Natural Direct and Indirect Effects",
            ]),
        ]),
        _c("stat_590", "STS 590", "Causal Machine Learning & Heterogeneous Treatment Effects", 500, 3,
           "Graduate causal inference meets machine learning: semiparametric efficiency, double/debiased ML, targeted learning, heterogeneous effect estimation with meta-learners and causal forests, and optimal policy learning.",
           ["stat_490", "stat_440"], [
            _m("semiparametric", "Semiparametric Theory for Causal Estimands",
               "Influence functions and efficiency bounds.", [
                "Statistical Functionals, Pathwise Derivatives and Influence Functions",
                "Efficient Influence Function of the Average Treatment Effect",
                "Semiparametric Efficiency Bounds and Neyman Orthogonality",
                "Von Mises Expansions and Plug-In Bias",
            ], lab=False),
            _m("double_ml", "Double/Debiased Machine Learning & Targeted Learning",
               "Orthogonal scores and cross-fitting with flexible nuisance models.", [
                "Double/Debiased Machine Learning with Cross-Fitting",
                "Partially Linear Models and Orthogonalized Regression",
                "Targeted Maximum Likelihood Estimation (TMLE) and Super Learner",
                "Finite-Sample Behavior and Pitfalls of DML in Simulation",
            ]),
            _m("hte", "Heterogeneous Treatment Effect Estimation",
               "Meta-learners and forest-based methods for CATE.", [
                "S-, T-, X- and R-Learners for Conditional Average Treatment Effects",
                "Causal Trees and Honest Splitting",
                "Generalized Random Forests and Causal Forests",
                "Evaluating CATE Models: Uplift Curves, Qini and Calibration Tests",
            ]),
            _m("policy_learning", "Policy Learning & Off-Policy Evaluation",
               "Learning who to treat and evaluating policies from logged data.", [
                "Optimal Treatment Rules and Empirical Welfare Maximization",
                "Doubly Robust Off-Policy Evaluation for Contextual Bandit Logs",
                "Policy Trees and Interpretable Treatment Assignment",
                "Fairness and Budget Constraints in Treatment Allocation",
            ]),
            _m("causal_discovery", "Causal Discovery from Observational Data",
               "Learning graphs from data and its limits.", [
                "Faithfulness, Markov Equivalence and the PC Algorithm",
                "Score-Based Discovery: GES and Continuous Optimization (NOTEARS)",
                "Functional Causal Models: LiNGAM and Additive Noise Models",
                "Invariant Causal Prediction Across Environments",
            ]),
        ]),
    ],
}

# ---------------------------------------------------------------------------------------------
# 5. Multivariate, Time Series & Spatial Statistics
# ---------------------------------------------------------------------------------------------
STAT_MULTIVARIATE_TS = {
    "id": "stat_multivariate_ts",
    "name": "Multivariate, Time Series & Spatial Statistics",
    "icon": "🌐",
    "description": "Dimension reduction and multivariate inference, clustering, time series modeling and forecasting, and spatial and spatio-temporal statistics.",
    "courses": [
        _c("stat_370", "STS 370", "Applied Multivariate Analysis", 300, 4,
           "Analyzing many variables jointly: multivariate normal inference, principal components, factor analysis, discriminant analysis, clustering, canonical correlation and multidimensional scaling.",
           ["stat_230", "math_linear_algebra_1", "math_prob_1"], [
            _m("mvn_inference", "Multivariate Normal Inference",
               "Covariance estimation and multivariate tests.", [
                "Sample Mean Vectors, Covariance Matrices and Mahalanobis Distance",
                "Assessing Multivariate Normality and Detecting Multivariate Outliers",
                "Hotelling's T-Squared Test for Mean Vectors",
                "MANOVA: Wilks' Lambda, Pillai's Trace and Follow-Up Analyses",
            ]),
            _m("pca", "Principal Component Analysis",
               "Variance-maximizing projections and their interpretation.", [
                "PCA as Eigen-Decomposition of the Covariance Matrix and via the SVD",
                "Scree Plots, Explained Variance and Choosing the Number of Components",
                "Biplots and Interpreting Loadings",
                "Robust and Sparse PCA",
            ]),
            _m("factor_analysis", "Factor Analysis & Latent Structure",
               "Common factor models and rotation.", [
                "The Common Factor Model vs. PCA",
                "Maximum Likelihood Factor Analysis and Model Fit",
                "Varimax and Oblique Rotations",
                "Confirmatory Factor Analysis and an Introduction to Structural Equation Models",
            ]),
            _m("classification_clustering", "Discriminant Analysis & Clustering",
               "Supervised and unsupervised grouping of observations.", [
                "Linear and Quadratic Discriminant Analysis",
                "Hierarchical Clustering, Linkage Methods and Dendrograms",
                "k-Means, k-Medoids and Choosing k with Silhouettes and Gap Statistics",
                "Model-Based Clustering with Gaussian Mixtures and BIC",
            ]),
            _m("association_scaling", "Canonical Correlation, Correspondence Analysis & MDS",
               "Relating variable sets and visualizing dissimilarities.", [
                "Canonical Correlation Analysis Between Two Variable Sets",
                "Correspondence Analysis for Contingency Tables",
                "Classical and Non-Metric Multidimensional Scaling",
                "Nonlinear Embeddings for Visualization: t-SNE and UMAP and Their Pitfalls",
            ]),
        ]),
        _c("stat_380", "STS 380", "Time Series Analysis & Forecasting", 300, 4,
           "Modeling temporally dependent data: decomposition and smoothing, stationarity and autocorrelation, ARIMA and seasonal models, forecast evaluation, volatility models, and multivariate time series.",
           ["stat_230", "math_prob_1"], [
            _m("ts_exploration", "Time Series Exploration & Decomposition",
               "Trend, seasonality and smoothing.", [
                "Time Series Graphics, Trend, Seasonality and Cycles",
                "Classical and STL Decomposition",
                "Moving Averages and Exponential Smoothing",
                "Holt–Winters and ETS State-Space Smoothing Models",
            ]),
            _m("stationarity_acf", "Stationarity & Autocorrelation",
               "The foundations of ARMA modeling.", [
                "Weak Stationarity, White Noise and Random Walks",
                "Autocorrelation and Partial Autocorrelation Functions",
                "Differencing, Unit Roots and the Augmented Dickey–Fuller and KPSS Tests",
                "Spurious Regression Between Trending Series",
            ]),
            _m("arima", "ARIMA & Seasonal ARIMA Models",
               "Identification, estimation, diagnostics and forecasting.", [
                "Autoregressive and Moving Average Processes and Their ACF Signatures",
                "ARIMA Model Identification, Estimation and Residual Diagnostics (Ljung–Box)",
                "Seasonal ARIMA Models",
                "Regression with ARIMA Errors and Dynamic Regression",
            ]),
            _m("forecast_evaluation", "Forecasting & Forecast Evaluation",
               "Point and probabilistic forecasts and their assessment.", [
                "Forecast Accuracy Metrics: MAE, RMSE, MAPE and MASE",
                "Time Series Cross-Validation with Rolling Origins",
                "Prediction Intervals and Probabilistic Forecasts Scored by CRPS",
                "Forecast Combination and Hierarchical Reconciliation",
            ]),
            _m("volatility_multivariate", "Volatility & Multivariate Time Series",
               "GARCH, VAR and cointegration.", [
                "ARCH and GARCH Models for Volatility Clustering",
                "Vector Autoregressions and Impulse Response Functions",
                "Granger Causality and Its Limitations",
                "Cointegration and Error-Correction Models",
            ]),
        ]),
        _c("stat_470", "STS 470", "Spatial & Spatio-Temporal Statistics", 400, 4,
           "Statistics for data indexed by location: geostatistics and kriging, areal data and spatial autocorrelation, point processes, and spatio-temporal models with Gaussian processes.",
           ["stat_370", "stat_380"], [
            _m("spatial_data", "Spatial Data Types & Exploration",
               "Geostatistical, areal and point-pattern data.", [
                "Three Kinds of Spatial Data: Geostatistical, Lattice and Point Patterns",
                "Coordinate Reference Systems and Working with GeoPandas",
                "Spatial Autocorrelation: Moran's I and Geary's C",
                "Local Indicators of Spatial Association (LISA) and Hot-Spot Analysis",
            ]),
            _m("geostatistics", "Geostatistics & Kriging",
               "Variograms and optimal spatial prediction.", [
                "Stationarity, Isotropy and the Empirical Semivariogram",
                "Fitting Variogram Models: Spherical, Exponential and Matérn",
                "Ordinary and Universal Kriging",
                "Kriging as Gaussian Process Regression",
            ]),
            _m("areal_models", "Areal Data Models",
               "Neighborhood structures and autoregressive spatial models.", [
                "Spatial Weights Matrices and Neighborhood Definitions",
                "Simultaneous and Conditional Autoregressive (SAR/CAR) Models",
                "Disease Mapping with Poisson–CAR (BYM) Models",
                "Spatial Regression and Spillover Effects",
            ]),
            _m("point_processes", "Spatial Point Processes",
               "Modeling locations of events.", [
                "Complete Spatial Randomness and Homogeneous Poisson Processes",
                "Ripley's K and the Pair Correlation Function",
                "Inhomogeneous Poisson and Log-Gaussian Cox Processes",
                "Cluster and Inhibition Processes",
            ]),
            _m("spatiotemporal", "Spatio-Temporal Modeling",
               "Joint space–time dependence and scalable approximations.", [
                "Separable and Non-Separable Space–Time Covariance Functions",
                "Dynamic Spatio-Temporal Models",
                "Scalable Gaussian Processes: Nearest-Neighbor GPs and SPDE Approximations",
                "Case Study: Spatio-Temporal Air Pollution Mapping",
            ]),
        ]),
    ],
}

# ---------------------------------------------------------------------------------------------
# 6. Bayesian & Computational Statistics
# ---------------------------------------------------------------------------------------------
STAT_BAYES = {
    "id": "stat_bayes",
    "name": "Bayesian & Computational Statistics",
    "icon": "🎲",
    "description": "Applied Bayesian workflow and probabilistic programming, advanced Monte Carlo and variational inference, and research-level Bayesian nonparametrics and scalable inference.",
    "courses": [
        _c("stat_455", "STS 455", "Applied Bayesian Data Analysis & Probabilistic Programming", 400, 4,
           "The Bayesian workflow in practice: building models in a probabilistic programming language, prior choice, hierarchical models, MCMC diagnostics, posterior predictive checks and model comparison.",
           ["stat_310", "stat_340", "math_bayesian_stats"], [
            _m("ppl_basics", "Probabilistic Programming Foundations",
               "Expressing models as code and sampling posteriors.", [
                "Generative Models as Programs: Writing Models in PyMC",
                "Prior Predictive Simulation to Choose Sensible Priors",
                "Weakly Informative Priors and Scale Considerations",
                "Running NUTS, Reading Traces and Summarizing Posteriors with ArviZ",
            ]),
            _m("hierarchical_applied", "Hierarchical Models in Practice",
               "Partial pooling, reparameterization and multilevel regression.", [
                "The Eight Schools Model and Partial Pooling",
                "Centered vs. Non-Centered Parameterizations and Divergences",
                "Bayesian Multilevel Regression with Varying Intercepts and Slopes",
                "Multilevel Regression and Poststratification (MRP)",
            ]),
            _m("mcmc_diagnostics", "MCMC Diagnostics & Computational Troubleshooting",
               "Knowing when to trust your sampler.", [
                "R-hat, Bulk and Tail Effective Sample Size",
                "Divergent Transitions, Tree Depth and Energy Diagnostics in HMC",
                "Simulation-Based Calibration for Validating Inference",
                "The Folk Theorem of Statistical Computing: Bad Fits Signal Bad Models",
            ]),
            _m("model_checking", "Model Checking & Comparison",
               "Posterior predictive checks and predictive model comparison.", [
                "Posterior Predictive Checks with Graphical Test Quantities",
                "Leave-One-Out Cross-Validation with Pareto-Smoothed Importance Sampling",
                "WAIC, Stacking and Bayesian Model Averaging",
                "Bayes Factors and Their Sensitivity to Priors",
            ]),
            _m("applied_models", "Applied Bayesian Models",
               "GLMs, missing data, measurement error and Gaussian processes.", [
                "Bayesian Logistic and Poisson Regression with Overdispersion",
                "Measurement Error and Missing Data as Latent Variables",
                "Gaussian Process Regression for Smooth Functions",
                "Bayesian Decision Analysis and Expected Utility",
            ]),
        ]),
        _c("stat_555", "STS 555", "Advanced Monte Carlo & Approximate Bayesian Inference", 500, 3,
           "Graduate computational statistics: MCMC theory, Hamiltonian and Langevin dynamics, sequential Monte Carlo, variational inference and its guarantees, and likelihood-free inference.",
           ["stat_455", "math_real_analysis_1"], [
            _m("mcmc_theory", "Markov Chain Monte Carlo Theory",
               "Convergence, mixing and the Metropolis–Hastings family.", [
                "Detailed Balance, Ergodicity and the Metropolis–Hastings Algorithm",
                "Gibbs Sampling, Data Augmentation and Blocking",
                "Geometric Ergodicity, Mixing Times and the Markov Chain CLT",
                "Optimal Scaling of Random-Walk Metropolis",
            ]),
            _m("gradient_mcmc", "Gradient-Based MCMC",
               "Hamiltonian Monte Carlo and Langevin methods.", [
                "Hamiltonian Dynamics, Leapfrog Integration and Volume Preservation",
                "The No-U-Turn Sampler and Mass Matrix Adaptation",
                "Metropolis-Adjusted and Unadjusted Langevin Algorithms",
                "Stochastic Gradient MCMC for Large Datasets",
            ]),
            _m("smc", "Sequential Monte Carlo",
               "Particle filters and SMC samplers.", [
                "Sequential Importance Sampling and Resampling Schemes",
                "Bootstrap and Auxiliary Particle Filters for State-Space Models",
                "SMC Samplers and Tempering for Multimodal Posteriors",
                "Particle MCMC and Pseudo-Marginal Methods",
            ]),
            _m("variational", "Variational Inference",
               "Optimization-based approximate posteriors.", [
                "The Evidence Lower Bound and Mean-Field Coordinate Ascent",
                "Stochastic and Black-Box Variational Inference with Reparameterization Gradients",
                "Normalizing Flows for Expressive Variational Families",
                "Assessing VI Quality: Pareto-k Diagnostics and Underdispersion",
            ]),
            _m("likelihood_free", "Likelihood-Free & Simulation-Based Inference",
               "Inference when you can simulate but not evaluate the likelihood.", [
                "Approximate Bayesian Computation with Rejection and SMC-ABC",
                "Summary Statistics Choice and the Curse of Dimensionality in ABC",
                "Neural Posterior and Neural Likelihood Estimation",
                "Calibration Checks for Simulation-Based Inference",
            ]),
        ]),
        _c("stat_650", "STS 650", "Research Seminar: Bayesian Nonparametrics & Scalable Inference", 600, 3,
           "Doctoral-level seminar on infinite-dimensional Bayesian models and modern theory: Dirichlet and Gaussian processes, posterior contraction, Bernstein–von Mises phenomena, generalized Bayes, and scalable inference for massive data; culminating in an original research project.",
           ["stat_555"], [
            _m("dirichlet_process", "Dirichlet Processes & Random Measures",
               "Priors over distributions and infinite mixtures.", [
                "The Dirichlet Process: Definition, Stick-Breaking and Pólya Urn",
                "Dirichlet Process Mixture Models and Collapsed Gibbs Sampling",
                "Pitman–Yor Processes and Power-Law Clustering",
                "Hierarchical Dirichlet Processes and Completely Random Measures",
            ]),
            _m("gp_theory", "Gaussian Process Priors & Function Estimation",
               "Reproducing kernel geometry and adaptive priors.", [
                "Gaussian Process Priors, RKHS and Sample Path Regularity",
                "Hyperparameter Learning and Adaptive GP Priors",
                "Sparse Variational Gaussian Processes with Inducing Points",
                "Deep Gaussian Processes and Their Limits",
            ]),
            _m("posterior_asymptotics", "Frequentist Properties of Bayesian Procedures",
               "Consistency, contraction rates and Bernstein–von Mises.", [
                "Posterior Consistency and Schwartz's Theorem",
                "Posterior Contraction Rates in Nonparametric Models",
                "Bernstein–von Mises Theorems and Their Failures in High Dimensions",
                "Coverage of Bayesian Credible Sets",
            ], lab=False),
            _m("generalized_bayes", "Generalized Bayes & Robust Bayesian Inference",
               "Bayesian updating beyond correctly specified likelihoods.", [
                "Gibbs Posteriors and Loss-Based Bayesian Updating",
                "Tempered and Power Posteriors under Misspecification",
                "PAC-Bayes Bounds and Their Connection to Generalization",
                "Bayesian Coresets and Divide-and-Conquer Posterior Aggregation",
            ]),
            _m("research_project", "Research Project & Paper Workshop",
               "Reading the literature critically and producing original work.", [
                "Critically Reading a Recent Annals or JASA Paper",
                "Formulating a Research Question and Simulation Design",
                "Writing a Methods Paper: Theory, Simulations and Real-Data Application",
                "Presenting Research and Responding to Referee Reports",
            ], lab=False),
        ]),
    ],
}

# ---------------------------------------------------------------------------------------------
# 7. Statistical Learning & Modern Inference
# ---------------------------------------------------------------------------------------------
STAT_LEARNING = {
    "id": "stat_learning",
    "name": "Statistical Learning & Modern Inference",
    "icon": "🤖",
    "description": "Predictive modeling from a statistician's viewpoint: regularization, trees and ensembles, smoothing, high-dimensional theory, and distribution-free and post-selection inference.",
    "courses": [
        _c("stat_440", "STS 440", "Statistical Learning", 400, 4,
           "Prediction and classification with an emphasis on statistical principles: resampling for model assessment, regularized regression, smoothing splines and GAMs, trees and ensembles, support vector machines and interpretability.",
           ["stat_330", "stat_310"], [
            _m("model_assessment", "Model Assessment & Selection",
               "Estimating prediction error honestly.", [
                "Training Error, Test Error and Optimism",
                "k-Fold, Leave-One-Out and Nested Cross-Validation",
                "Proper Scoring Rules and Probabilistic Classification Metrics",
                "Data Leakage: Common Sources and How to Prevent It",
            ]),
            _m("regularization", "Regularized Regression & Classification",
               "Shrinkage methods for high-variance problems.", [
                "Ridge, Lasso and Elastic Net Regularization Paths",
                "Group Lasso and Structured Sparsity",
                "Regularized Logistic and Multinomial Regression",
                "Principal Components and Partial Least Squares Regression",
            ]),
            _m("smoothing_gam", "Smoothing, Splines & Generalized Additive Models",
               "Flexible nonparametric regression.", [
                "Kernel Smoothing, Local Polynomial Regression and LOESS",
                "Regression Splines, Natural Splines and Knot Placement",
                "Smoothing Splines and Penalized Regression Splines",
                "Generalized Additive Models and Interpreting Partial Effects",
            ]),
            _m("trees_ensembles", "Trees & Ensemble Methods",
               "From CART to gradient boosting.", [
                "Classification and Regression Trees and Cost-Complexity Pruning",
                "Bagging and Random Forests with Out-of-Bag Error",
                "Gradient Boosting Machines and XGBoost/LightGBM Hyperparameters",
                "Stacking and Super Learning",
            ]),
            _m("kernels_interpretability", "Kernel Methods & Interpretable ML",
               "SVMs, kernels and explaining black boxes.", [
                "Support Vector Classifiers, Margins and the Kernel Trick",
                "Kernel Ridge Regression and Reproducing Kernel Hilbert Spaces",
                "Permutation Importance, Partial Dependence and ICE Plots",
                "Shapley Values (SHAP) and Their Statistical Caveats",
            ]),
        ]),
        _c("stat_540", "STS 540", "High-Dimensional Statistics & Nonparametric Inference", 500, 3,
           "Graduate theory for modern data where p is comparable to or exceeds n: concentration inequalities, sparse estimation theory, covariance and matrix estimation, nonparametric rates, and multiple testing at scale.",
           ["stat_440", "math_stats_1", "math_real_analysis_1"], [
            _m("concentration", "Concentration of Measure",
               "Tail bounds that power high-dimensional theory.", [
                "Sub-Gaussian and Sub-Exponential Random Variables",
                "Hoeffding, Bernstein and McDiarmid Inequalities",
                "Maximal Inequalities, Union Bounds and Covering Numbers",
                "Concentration of Random Matrices and the Matrix Bernstein Inequality",
            ], lab=False),
            _m("sparse_estimation", "Theory of Sparse Linear Models",
               "Lasso error bounds and support recovery.", [
                "Restricted Eigenvalue and Compatibility Conditions",
                "Prediction and Estimation Error Bounds for the Lasso",
                "Variable Selection Consistency and the Irrepresentable Condition",
                "Non-Convex Penalties: SCAD and MCP",
            ]),
            _m("covariance_matrix", "High-Dimensional Covariance & Matrix Estimation",
               "Estimating large covariance and precision matrices.", [
                "Failure of the Sample Covariance When p/n Does Not Vanish (Marchenko–Pastur)",
                "Shrinkage (Ledoit–Wolf), Banding and Thresholding Estimators",
                "Sparse Precision Matrices and the Graphical Lasso",
                "Low-Rank Matrix Completion and Spiked Covariance Models",
            ]),
            _m("nonparametric_rates", "Nonparametric Estimation Theory",
               "Minimax rates for density and regression estimation.", [
                "Kernel Density Estimation: Bias, Variance and Bandwidth Selection",
                "Minimax Lower Bounds via Le Cam and Fano Methods",
                "Rates for Nonparametric Regression over Hölder and Sobolev Classes",
                "The Curse of Dimensionality and Structural Assumptions",
            ]),
            _m("large_scale_testing", "Large-Scale Inference",
               "Testing thousands of hypotheses with empirical Bayes ideas.", [
                "FDR Control Proofs and Dependence (Benjamini–Yekutieli)",
                "Local False Discovery Rates and Empirical Null Estimation",
                "Empirical Bayes Shrinkage and Tweedie's Formula",
                "Knockoff Filters for Controlled Variable Selection",
            ]),
        ]),
        _c("stat_545", "STS 545", "Distribution-Free & Post-Selection Inference", 500, 3,
           "Valid uncertainty quantification for modern pipelines: conformal prediction, selective and post-selection inference, debiased lasso, e-values and anytime-valid inference, and inference under distribution shift.",
           ["stat_440", "math_stats_1"], [
            _m("conformal", "Conformal Prediction",
               "Finite-sample prediction sets for any model.", [
                "Exchangeability and Split Conformal Prediction Intervals",
                "Full Conformal, Jackknife+ and CV+ Methods",
                "Conformalized Quantile Regression and Adaptive Prediction Sets for Classification",
                "Conformal Prediction under Covariate Shift with Weighted Exchangeability",
            ]),
            _m("selective_inference", "Selective & Post-Selection Inference",
               "Valid inference after looking at the data.", [
                "Why Inference After Model Selection Is Invalid: A Simulation",
                "Data Splitting and Data Fission/Carving",
                "Polyhedral Selective Inference for the Lasso",
                "Simultaneous Post-Selection Inference (PoSI)",
            ]),
            _m("debiased_hd", "Inference in High Dimensions",
               "Confidence intervals for sparse models.", [
                "The Debiased (Desparsified) Lasso",
                "Multi-Sample Splitting p-Values",
                "High-Dimensional Bootstrap and Gaussian Approximation",
                "Inference for Prediction-Powered Estimators Using ML Predictions",
            ]),
            _m("anytime_valid", "E-Values & Anytime-Valid Inference",
               "Testing by betting and safe sequential analysis.", [
                "E-Values, Test Martingales and Ville's Inequality",
                "Testing by Betting and Confidence Sequences",
                "E-Value Based Multiple Testing (e-BH)",
                "Applications to Continuous Monitoring of Experiments",
            ]),
            _m("shift_robustness", "Inference under Distribution Shift",
               "Generalization and transportability of statistical conclusions.", [
                "Covariate, Label and Concept Shift: Definitions and Detection Tests",
                "Importance Weighting and Density Ratio Estimation",
                "Distributionally Robust Estimation and Worst-Case Risk",
                "Transportability and Generalizing Trial Results to Target Populations",
            ]),
        ]),
    ],
}


DOMAIN = {
    "id": "statistics",
    "name": "Statistics & Data Science",
    "icon": "📊",
    "color": "#0ea5e9",
    "tagline": "From first histograms to causal machine learning, conformal prediction and Bayesian nonparametrics — statistics as a computational, data-driven science.",
    "description": (
        "A complete applied and computational statistics program: statistical reasoning and data analysis, Python for data science, "
        "visualization and data wrangling, regression and generalized linear models, mixed models, experimental design and A/B testing, "
        "survey sampling, multivariate and time series analysis, causal inference, Bayesian workflow and advanced Monte Carlo, "
        "and statistical learning with modern distribution-free inference. Probability and mathematical statistics theory is drawn from the Mathematics domain."
    ),
    "subjects": [
        STAT_APPLIED,
        STAT_COMPUTING,
        STAT_MODELS,
        STAT_DESIGN_CAUSAL,
        STAT_MULTIVARIATE_TS,
        STAT_BAYES,
        STAT_LEARNING,
    ],
}
