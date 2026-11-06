"""Self-Taught curriculum catalog — Economics domain.

Pure data (see docs/CONTRACTS.md §1). The two tiny helpers below only remove dict boilerplate;
the exported DOMAIN is plain dicts / lists / strings / ints / bools.
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
# 1. Principles & Foundations
# ---------------------------------------------------------------------------------------------
PRINCIPLES = {
    "id": "econ_principles",
    "name": "Principles & Mathematical Foundations",
    "icon": "🧭",
    "description": "The economic way of thinking: scarcity, incentives, markets, national income, and the mathematical toolkit used throughout the program.",
    "courses": [
        _c("econ_101", "ECON 101", "Principles of Economics: Markets, Incentives and the Macroeconomy", 100, 4,
           "A one-semester survey of micro and macro: opportunity cost, supply and demand, market failure, GDP, inflation, unemployment, and the role of monetary and fiscal policy. Serves as the General Education social-science requirement.",
           [], [
            _m("econ101_thinking", "Thinking Like an Economist",
               "Scarcity, opportunity cost and marginal reasoning as the core lenses of economics.", [
                "Scarcity, Choice and Opportunity Cost in Everyday Decisions",
                "Marginal Thinking: Why Decisions Happen at the Margin",
                "The Production Possibilities Frontier and the Gains from Specialization",
                "Comparative Advantage and Why Voluntary Trade Creates Value",
                "Positive vs. Normative Statements and the Role of Economic Models",
            ], lab=False),
            _m("econ101_markets", "Supply, Demand and Market Equilibrium",
               "How prices coordinate buyers and sellers, and what happens when governments intervene.", [
                "Demand Curves, Willingness to Pay and the Law of Demand",
                "Supply Curves, Marginal Cost and the Law of Supply",
                "Market Equilibrium and Comparative Statics of Shifting Curves",
                "Price Elasticity of Demand and Total Revenue",
                "Price Ceilings, Price Floors and Deadweight Loss from Taxes",
            ]),
            _m("econ101_failure", "Market Structure and Market Failure",
               "Competition versus monopoly, externalities, public goods and the case for (and limits of) policy.", [
                "Perfect Competition vs. Monopoly: Prices, Output and Efficiency",
                "Negative and Positive Externalities: Pollution, Vaccines and Pigouvian Taxes",
                "Public Goods, Common Resources and the Free-Rider Problem",
                "Asymmetric Information: Used Cars, Insurance and Lemons",
                "Government Failure and the Limits of Corrective Policy",
            ], lab=False),
            _m("econ101_macro_measure", "Measuring the Macroeconomy",
               "GDP, price indices and labor-market statistics: what they capture and what they miss.", [
                "Gross Domestic Product: Expenditure, Income and Value-Added Approaches",
                "Real vs. Nominal GDP and the Consumer Price Index",
                "Unemployment: Measurement, Types and the Natural Rate",
                "Long-Run Growth, Productivity and Living Standards Across Countries",
                "Working with FRED Data: Plotting GDP, Inflation and Unemployment",
            ]),
            _m("econ101_policy", "Money, Business Cycles and Stabilization Policy",
               "Aggregate demand and supply, central banks and fiscal policy in recessions and booms.", [
                "What Money Is and How Banks Create It",
                "Aggregate Demand and Aggregate Supply: Short Run vs. Long Run",
                "Monetary Policy: Interest Rates, the Central Bank and Inflation Control",
                "Fiscal Policy: Government Spending, Taxes, Deficits and the Multiplier",
                "Case Studies: The Great Depression, Stagflation, 2008 and the Pandemic Recession",
            ], lab=False),
        ]),
        _c("econ_102", "ECON 102", "Microeconomic Principles and Applications", 100, 4,
           "A deeper principles-level treatment of consumer and producer behavior, market structures, factor markets and welfare, with applications to real policy debates.",
           ["econ_101"], [
            _m("econ102_consumer", "Consumer Choice and Demand",
               "Budget constraints, preferences and how demand responds to prices and income.", [
                "Budget Constraints and the Price of One Good in Terms of Another",
                "Preferences, Utility and Indifference Curves Without Calculus",
                "Income and Substitution Effects of a Price Change",
                "Consumer Surplus and Measuring the Value of Markets",
            ], lab=False),
            _m("econ102_firm", "Production, Costs and the Competitive Firm",
               "Short- and long-run cost curves and the supply decisions of price-taking firms.", [
                "Production Functions, Diminishing Marginal Returns and Returns to Scale",
                "Fixed, Variable, Average and Marginal Cost Curves",
                "Profit Maximization and the Shutdown Decision",
                "Long-Run Entry, Exit and Zero Economic Profit",
                "Simulating a Competitive Industry in Python",
            ]),
            _m("econ102_power", "Market Power and Strategic Firms",
               "Monopoly pricing, price discrimination, monopolistic competition and oligopoly.", [
                "Monopoly Pricing and the Deadweight Loss of Market Power",
                "Price Discrimination: Airline Tickets, Coupons and Student Discounts",
                "Monopolistic Competition and Product Differentiation",
                "Oligopoly, Collusion and an Informal Introduction to Strategic Interaction",
            ], lab=False),
            _m("econ102_factors", "Factor Markets and Income Distribution",
               "Wages, capital returns and inequality as outcomes of factor markets.", [
                "Labor Demand and the Marginal Revenue Product of Labor",
                "Labor Supply, Wage Differentials and Human Capital",
                "Minimum Wages: Theory and Evidence",
                "Measuring Inequality: Lorenz Curves and the Gini Coefficient",
                "Computing Gini Coefficients from Household Income Data",
            ]),
            _m("econ102_policy", "Microeconomic Policy Applications",
               "Applying the toolkit to tax incidence, environmental and health policy.", [
                "Tax Incidence: Who Really Pays a Payroll Tax?",
                "Cap-and-Trade vs. Carbon Taxes",
                "Rent Control and Housing Supply",
                "Health Insurance Markets and Adverse Selection",
            ], lab=False),
        ]),
        _c("econ_103", "ECON 103", "Macroeconomic Principles and Policy", 100, 4,
           "A deeper principles-level macro course: national accounts, long-run growth, money and inflation, the business cycle, and open-economy basics.",
           ["econ_101"], [
            _m("econ103_accounts", "National Income Accounting in Depth",
               "The circular flow, saving-investment identity and international accounts.", [
                "The Circular Flow and the National Income Identity Y = C + I + G + NX",
                "Saving, Investment and the Loanable Funds Market",
                "The Balance of Payments: Current and Financial Accounts",
                "Building a National Accounts Dashboard from Public Data",
            ]),
            _m("econ103_growth", "Long-Run Growth",
               "Capital accumulation, technology and institutions as sources of prosperity.", [
                "The Rule of 70 and the Power of Compound Growth",
                "Physical Capital, Human Capital and Diminishing Returns",
                "Technology, Ideas and Productivity Growth",
                "Institutions, Property Rights and Why Some Nations Are Rich",
            ], lab=False),
            _m("econ103_money", "Money, Inflation and the Banking System",
               "Quantity theory, fractional reserves and the costs of inflation.", [
                "The Quantity Theory of Money and Hyperinflations",
                "Fractional Reserve Banking and the Money Multiplier",
                "Costs of Inflation and Deflation",
                "The Fisher Effect: Nominal vs. Real Interest Rates",
            ], lab=False),
            _m("econ103_cycles", "Business Cycles and the AD-AS Model",
               "Short-run fluctuations, the Phillips curve and stabilization policy tradeoffs.", [
                "Stylized Facts of Business Cycles: Co-movement and Persistence",
                "The Keynesian Cross and the Spending Multiplier",
                "Supply Shocks, Demand Shocks and the AD-AS Diagram",
                "The Phillips Curve and Expectations",
                "Plotting Okun's Law and the Phillips Curve with Real Data",
            ]),
            _m("econ103_open", "The Open Economy",
               "Exchange rates, trade balances and policy in a globalized world.", [
                "Nominal and Real Exchange Rates and Purchasing Power Parity",
                "Trade Deficits, Capital Flows and National Saving",
                "Fixed vs. Floating Exchange Rate Regimes",
                "Government Debt, Deficits and Fiscal Sustainability",
            ], lab=False),
        ]),
        _c("econ_150", "ECON 150", "Mathematical Methods for Economists", 100, 4,
           "The mathematical toolkit of modern economics: functions, derivatives and elasticities, unconstrained and constrained optimization, comparative statics, and discrete-time dynamics, all motivated by economic problems.",
           ["econ_101", "math_calc_1"], [
            _m("econ150_functions", "Functions, Derivatives and Elasticities",
               "Expressing economic relationships as functions and measuring responsiveness.", [
                "Linear, Power, Exponential and Logarithmic Functions in Economics",
                "Derivatives as Marginal Quantities: Marginal Cost, Revenue and Utility",
                "Elasticities as Log-Derivatives",
                "Partial Derivatives and Multivariate Production Functions",
                "Symbolic Differentiation of Economic Functions with SymPy",
            ]),
            _m("econ150_optimization", "Unconstrained Optimization",
               "First- and second-order conditions for maximizing profit and minimizing cost.", [
                "First-Order Conditions and Profit Maximization",
                "Second-Order Conditions, Concavity and Convexity",
                "Multivariable Optimization and the Hessian",
                "Numerical Optimization with SciPy for Economic Problems",
            ]),
            _m("econ150_lagrange", "Constrained Optimization and the Lagrangian",
               "Lagrange multipliers, shadow prices and the envelope theorem.", [
                "Equality Constraints and the Method of Lagrange Multipliers",
                "Interpreting the Multiplier as a Shadow Price",
                "Inequality Constraints and Kuhn–Tucker Conditions",
                "The Envelope Theorem and Its Economic Uses",
            ], lab=False),
            _m("econ150_statics", "Comparative Statics and Linear Systems",
               "Implicit functions, total differentials and solving equilibrium systems.", [
                "Total Differentials and the Implicit Function Theorem",
                "Comparative Statics of Market Equilibrium",
                "Matrix Representation of Multi-Market Equilibrium and Cramer's Rule",
                "Input-Output (Leontief) Models with NumPy",
            ]),
            _m("econ150_dynamics", "Discrete-Time Dynamics and Present Value",
               "Difference equations, discounting and stability of dynamic economic systems.", [
                "Compound Interest, Discounting and Present Value",
                "First-Order Difference Equations and Steady States",
                "The Cobweb Model and Stability Conditions",
                "Simulating Dynamic Economic Systems in Python",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 2. Economic Theory (Micro & Macro)
# ---------------------------------------------------------------------------------------------
THEORY = {
    "id": "econ_theory",
    "name": "Microeconomic & Macroeconomic Theory",
    "icon": "📐",
    "description": "The calculus-based core of the discipline, from intermediate consumer theory and IS-LM to general equilibrium, recursive macroeconomics, and doctoral-level theory.",
    "courses": [
        _c("econ_201", "ECON 201", "Intermediate Microeconomic Theory", 200, 4,
           "Calculus-based consumer and producer theory, choice under uncertainty, partial equilibrium welfare analysis and market structure.",
           ["econ_102", "econ_150"], [
            _m("econ201_consumer", "Preferences, Utility and Demand",
               "Axioms of preference, utility maximization and the derivation of demand functions.", [
                "Preference Axioms: Completeness, Transitivity, Monotonicity and Convexity",
                "Utility Maximization and Marshallian Demand Functions",
                "Cobb–Douglas, CES, Perfect Substitutes and Leontief Preferences",
                "Expenditure Minimization, Hicksian Demand and the Slutsky Equation",
                "Compensating and Equivalent Variation as Welfare Measures",
            ]),
            _m("econ201_uncertainty", "Choice Under Uncertainty",
               "Expected utility, risk aversion and the demand for insurance.", [
                "Lotteries and the Expected Utility Hypothesis",
                "Risk Aversion, Certainty Equivalents and Risk Premia",
                "Arrow–Pratt Measures of Absolute and Relative Risk Aversion",
                "Insurance Demand and Portfolio Choice with One Risky Asset",
            ], lab=False),
            _m("econ201_producer", "Production and Cost Theory",
               "Technology, cost minimization and the duality between production and cost.", [
                "Production Functions, Isoquants and the Marginal Rate of Technical Substitution",
                "Cost Minimization and Conditional Factor Demands",
                "Cost Functions and Duality with Production",
                "Profit Maximization, Supply Functions and Hotelling's Lemma",
            ], lab=False),
            _m("econ201_equilibrium", "Competitive Equilibrium and Welfare",
               "Partial equilibrium, surplus, and an introduction to exchange economies.", [
                "Short-Run and Long-Run Competitive Equilibrium",
                "Welfare Analysis of Taxes, Subsidies and Quotas with Calculus",
                "The Edgeworth Box and Pareto Efficiency in Exchange",
                "Computing Competitive Equilibria Numerically in Python",
            ]),
            _m("econ201_power", "Monopoly and Oligopoly Models",
               "Monopoly pricing rules and the classic oligopoly models.", [
                "Monopoly and the Inverse Elasticity (Lerner) Pricing Rule",
                "Second- and Third-Degree Price Discrimination",
                "Cournot Quantity Competition",
                "Bertrand Price Competition and Stackelberg Leadership",
            ], lab=False),
        ]),
        _c("econ_202", "ECON 202", "Intermediate Macroeconomic Theory", 200, 4,
           "Model-based macroeconomics: the classical long run, Solow growth, IS-LM and IS-MP, aggregate supply, and modern stabilization policy.",
           ["econ_103", "econ_150"], [
            _m("econ202_classical", "The Classical Long-Run Model",
               "Output, factor prices and interest rates when prices are flexible.", [
                "The Aggregate Production Function and Factor Shares",
                "Labor Market Equilibrium and Real Wages",
                "The Real Interest Rate and the Market for Loanable Funds",
                "Classical Dichotomy and Monetary Neutrality",
            ], lab=False),
            _m("econ202_solow", "The Solow Growth Model",
               "Capital accumulation, steady states and convergence.", [
                "Capital Accumulation and the Solow Steady State",
                "The Golden Rule Level of Saving",
                "Technological Progress and Balanced Growth",
                "Growth Accounting and Solow Residuals",
                "Simulating Solow Transition Dynamics in Python",
            ]),
            _m("econ202_islm", "Short-Run Fluctuations: IS-LM and IS-MP",
               "Goods and money market equilibrium with sticky prices.", [
                "The IS Curve: Goods Market Equilibrium",
                "The LM Curve vs. the Monetary Policy (MP) Rule",
                "Fiscal and Monetary Policy in the IS-LM Framework",
                "The Zero Lower Bound and Liquidity Traps",
            ], lab=False),
            _m("econ202_as", "Aggregate Supply, Inflation and Expectations",
               "Phillips curves, adaptive vs. rational expectations and the Taylor rule.", [
                "Sticky Prices, Sticky Wages and the Short-Run Aggregate Supply Curve",
                "The Expectations-Augmented Phillips Curve",
                "Rational Expectations and the Lucas Critique",
                "The Taylor Rule and Inflation Targeting",
                "Estimating a Simple Taylor Rule on U.S. Data",
            ]),
            _m("econ202_consumption", "Microfoundations: Consumption, Investment and Debt",
               "Forward-looking households and firms and government budget arithmetic.", [
                "The Permanent Income and Life-Cycle Hypotheses",
                "The Two-Period Consumption-Saving Model",
                "Investment, Tobin's q and the User Cost of Capital",
                "Government Budget Constraints, Ricardian Equivalence and Debt Dynamics",
            ], lab=False),
        ]),
        _c("econ_301", "ECON 301", "Advanced Microeconomics: General Equilibrium, Welfare and Information", 300, 4,
           "General equilibrium and the welfare theorems, social welfare, externalities and public goods, and the economics of asymmetric information. Builds on game-theoretic foundations from GT 110 rather than repeating them.",
           ["econ_201", "math_linear_algebra_1", "gt_110"], [
            _m("econ301_ge", "General Equilibrium in Exchange and Production",
               "Walrasian equilibrium, existence and uniqueness in multi-good economies.", [
                "Walrasian Equilibrium in Pure Exchange Economies",
                "Walras' Law and the Excess Demand Function",
                "Equilibrium with Production: The Robinson Crusoe Economy",
                "Existence of Equilibrium via Fixed-Point Arguments",
                "Solving Multi-Good General Equilibrium Models Numerically",
            ]),
            _m("econ301_welfare", "Welfare Theorems and Social Choice",
               "The first and second welfare theorems and aggregating individual welfare.", [
                "The First Fundamental Theorem of Welfare Economics",
                "The Second Welfare Theorem and Lump-Sum Redistribution",
                "Social Welfare Functions: Utilitarian, Rawlsian and Bergson–Samuelson",
                "Efficiency–Equity Tradeoffs and Compensation Criteria",
            ], lab=False),
            _m("econ301_externalities", "Externalities and Public Goods Formally",
               "Coase, Pigou, Lindahl and the Samuelson condition.", [
                "Externalities in General Equilibrium and Missing Markets",
                "The Coase Theorem and Transaction Costs",
                "The Samuelson Condition for Optimal Public Goods Provision",
                "Lindahl Equilibrium and Voluntary Contribution Games",
            ], lab=False),
            _m("econ301_info", "Asymmetric Information: Adverse Selection",
               "Akerlof lemons, screening and signaling in markets.", [
                "Akerlof's Market for Lemons Formalized",
                "Rothschild–Stiglitz Screening in Insurance Markets",
                "Spence Job-Market Signaling Revisited for Labor Markets",
                "Simulating Unraveling in an Adverse Selection Market",
            ]),
            _m("econ301_moral", "Moral Hazard and Principal–Agent Problems",
               "Incentive contracts under hidden action.", [
                "Hidden Action and the Principal–Agent Framework",
                "Incentive Compatibility and Participation Constraints",
                "The Risk–Incentive Tradeoff in Optimal Contracts",
                "Efficiency Wages and Executive Compensation Applications",
            ], lab=False),
        ]),
        _c("econ_302", "ECON 302", "Dynamic Macroeconomics: Growth, Business Cycles and Fiscal Policy", 300, 4,
           "Microfounded dynamic macro: Ramsey and overlapping-generations models, endogenous growth, real business cycles and an introduction to New Keynesian models, with computational labs.",
           ["econ_202", "math_calc_2"], [
            _m("econ302_ramsey", "The Ramsey–Cass–Koopmans Model",
               "Optimal saving with infinitely-lived households.", [
                "Intertemporal Utility Maximization and the Euler Equation",
                "Phase Diagrams and Saddle-Path Stability",
                "Comparing Ramsey and Solow Steady States",
                "Shooting Algorithms for Ramsey Transition Paths in Python",
            ]),
            _m("econ302_olg", "Overlapping Generations Models",
               "Life-cycle saving, dynamic inefficiency and social security.", [
                "The Diamond Overlapping-Generations Model",
                "Dynamic Inefficiency and Over-Accumulation of Capital",
                "Pay-As-You-Go vs. Fully Funded Social Security",
                "Government Debt in OLG Economies",
            ], lab=False),
            _m("econ302_endog", "Endogenous Growth Theory",
               "Ideas, R&D and creative destruction as engines of growth.", [
                "The AK Model and Constant Returns to Reproducible Capital",
                "Romer's Model of Ideas and Nonrival Knowledge",
                "Schumpeterian Growth and Creative Destruction",
                "Cross-Country Convergence Regressions with Penn World Table Data",
            ]),
            _m("econ302_rbc", "Real Business Cycle Models",
               "Technology shocks, labor supply and calibration.", [
                "The Stochastic Neoclassical Growth Model",
                "Labor-Leisure Choice and Intertemporal Substitution",
                "Calibration Methodology and Matching Second Moments",
                "Log-Linearizing and Simulating a Basic RBC Model",
            ]),
            _m("econ302_nk", "Introduction to New Keynesian Macroeconomics",
               "Nominal rigidities and the three-equation model.", [
                "Calvo Price Setting and the New Keynesian Phillips Curve",
                "The Dynamic IS Curve",
                "The Three-Equation New Keynesian Model and Determinacy",
                "Optimal Monetary Policy Under Commitment vs. Discretion",
            ], lab=False),
        ]),
        _c("econ_501", "ECON 501", "Graduate Microeconomic Theory", 500, 4,
           "Doctoral-level micro: rigorous choice and demand theory, producer theory, general equilibrium with uncertainty, and information economics, with emphasis on proofs.",
           ["econ_301", "math_real_analysis_1", "math_convex_optimization"], [
            _m("econ501_choice", "Choice, Revealed Preference and Utility Representation",
               "Foundations of rational choice and when utility functions exist.", [
                "Choice Correspondences and the Weak Axiom of Revealed Preference",
                "Debreu's Utility Representation Theorem",
                "Integrability: Recovering Preferences from Demand",
                "Aggregation of Demand and Gorman Polar Form",
                "Testing GARP on Consumption Data with Afriat's Theorem",
            ]),
            _m("econ501_duality", "Duality Theory in Consumer and Producer Problems",
               "Indirect utility, expenditure and profit functions and their properties.", [
                "Properties of the Indirect Utility and Expenditure Functions",
                "Roy's Identity and Shephard's Lemma Rigorously Derived",
                "Profit Functions, Convex Technologies and Supporting Hyperplanes",
                "The Slutsky Matrix: Symmetry and Negative Semidefiniteness",
            ], lab=False),
            _m("econ501_ge", "General Equilibrium Theory",
               "Existence, the core, and equilibrium under uncertainty.", [
                "Existence of Walrasian Equilibrium via Kakutani's Fixed-Point Theorem",
                "The Core and Debreu–Scarf Core Convergence",
                "Sonnenschein–Mantel–Debreu: Anything Goes for Excess Demand",
                "Arrow–Debreu Contingent Claims and Radner Sequential Markets",
            ], lab=False),
            _m("econ501_uncertainty", "Decision Theory Under Risk and Ambiguity",
               "Axiomatic expected utility and its generalizations.", [
                "von Neumann–Morgenstern and Savage Axiomatizations",
                "Stochastic Dominance and Comparative Risk Aversion",
                "The Allais and Ellsberg Paradoxes",
                "Maxmin Expected Utility and Ambiguity Aversion",
            ], lab=False),
            _m("econ501_info", "Information Economics and Contract Theory",
               "Screening, mechanism design for monopolists and optimal incentive contracts.", [
                "Monopolistic Screening and Nonlinear Pricing (Mussa–Rosen)",
                "The Revelation Principle Applied to Contracting",
                "Moral Hazard with Continuous Effort and the First-Order Approach",
                "Solving Screening Problems Numerically with Convex Optimization",
            ]),
        ]),
        _c("econ_502", "ECON 502", "Graduate Macroeconomic Theory: Recursive Methods", 500, 4,
           "Doctoral-level macro: dynamic programming, stochastic growth, asset pricing in general equilibrium, search and matching, and medium-scale DSGE models with computation.",
           ["econ_302", "econ_420", "math_diff_eq_1"], [
            _m("econ502_dp", "Dynamic Programming and the Bellman Equation",
               "Recursive formulation of dynamic optimization problems.", [
                "Sequence Problems vs. Recursive Formulations",
                "Contraction Mappings and Blackwell's Sufficient Conditions",
                "Value Function Iteration and Policy Function Iteration",
                "Implementing Value Function Iteration for the Growth Model in Python",
            ]),
            _m("econ502_stochastic", "Stochastic Growth and Markov Processes",
               "Uncertainty, Markov chains and the stochastic neoclassical model.", [
                "Markov Chains and Tauchen Discretization of AR(1) Shocks",
                "The Stochastic Growth Model and Its Ergodic Distribution",
                "Perturbation Methods and Blanchard–Kahn Conditions",
                "Simulating and Computing Impulse Responses in a DSGE Model",
            ]),
            _m("econ502_assets", "Asset Pricing in General Equilibrium",
               "The Lucas tree model and macro-finance puzzles.", [
                "The Lucas Tree Endowment Economy",
                "Stochastic Discount Factors and the Consumption CAPM",
                "The Equity Premium and Risk-Free Rate Puzzles",
                "Habit Formation and Epstein–Zin Recursive Preferences",
            ], lab=False),
            _m("econ502_search", "Search and Matching in Labor Markets",
               "McCall search and the Diamond–Mortensen–Pissarides model.", [
                "The McCall Job Search Model and Reservation Wages",
                "Matching Functions and Labor Market Tightness",
                "Nash Bargaining over Wages in the DMP Model",
                "The Shimer Puzzle: Unemployment Volatility",
            ], lab=False),
            _m("econ502_hank", "Heterogeneous Agents and Incomplete Markets",
               "Aiyagari economies and the frontier of heterogeneous-agent macro.", [
                "Bewley–Huggett–Aiyagari Models with Uninsurable Income Risk",
                "Computing Stationary Wealth Distributions",
                "Krusell–Smith Approximate Aggregation",
                "Heterogeneous-Agent New Keynesian (HANK) Models and Monetary Transmission",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 3. Econometrics & Data
# ---------------------------------------------------------------------------------------------
ECONOMETRICS = {
    "id": "econ_metrics",
    "name": "Econometrics & Economic Data Science",
    "icon": "📊",
    "description": "From exploring economic data in Python to regression, causal inference, graduate asymptotic theory, structural estimation and machine learning for economics.",
    "courses": [
        _c("econ_210", "ECON 210", "Data Analysis for Economics with Python", 200, 4,
           "Hands-on introduction to economic data: sources, cleaning, visualization, descriptive statistics and simple regression using pandas and statsmodels.",
           ["econ_101", "math_prob_1"], [
            _m("econ210_sources", "Economic Data Sources and Structures",
               "Where economic data comes from and how it is organized.", [
                "Cross-Sectional, Time-Series and Panel Data Structures",
                "Official Statistics: National Accounts, Surveys and Administrative Data",
                "Pulling Data from FRED, World Bank and OECD APIs",
                "Data Quality, Revisions and Measurement Error",
            ]),
            _m("econ210_wrangling", "Data Wrangling with pandas",
               "Cleaning, merging and reshaping messy economic datasets.", [
                "Loading, Inspecting and Cleaning Economic Datasets",
                "Merging and Reshaping Panels: Long vs. Wide Formats",
                "Deflating Nominal Series and Constructing Index Numbers",
                "Seasonal Adjustment and Growth Rate Calculations",
            ]),
            _m("econ210_viz", "Visualization and Descriptive Statistics",
               "Telling honest stories with economic data.", [
                "Distributions of Income and Wealth: Histograms, Kernels and Log Scales",
                "Correlation, Covariance and Scatterplots of Economic Variables",
                "Time-Series Plots, Recession Shading and Log Growth Charts",
                "Common Pitfalls: Spurious Correlation and Misleading Axes",
            ]),
            _m("econ210_inference", "Sampling and Statistical Inference for Economists",
               "Estimation, confidence intervals and hypothesis tests on economic data.", [
                "Sampling Distributions and the Central Limit Theorem by Simulation",
                "Confidence Intervals for Means and Proportions",
                "Hypothesis Testing and p-Values in Policy Contexts",
                "Bootstrap Methods for Economic Statistics",
            ]),
            _m("econ210_regression", "Introduction to Regression",
               "Fitting and interpreting a simple linear regression.", [
                "Simple Linear Regression and Ordinary Least Squares",
                "Interpreting Slopes, Log-Log Specifications and Elasticities",
                "Goodness of Fit and Residual Diagnostics",
                "Mini-Project: Estimating Returns to Education from Survey Data",
            ]),
        ]),
        _c("econ_310", "ECON 310", "Econometrics I: Linear Regression and Its Extensions", 300, 4,
           "The classical linear regression model in matrix form: estimation, inference, specification, heteroskedasticity, binary outcomes and introductory time series.",
           ["econ_210", "math_linear_algebra_1", "math_stats_1"], [
            _m("econ310_ols", "Multiple Regression in Matrix Form",
               "OLS derivation, Gauss–Markov and the geometry of least squares.", [
                "The Linear Model y = Xb + e and the OLS Estimator in Matrix Form",
                "Projection Matrices and the Geometry of Least Squares",
                "Gauss–Markov Assumptions and the BLUE Property",
                "Frisch–Waugh–Lovell Theorem and Partialling Out",
                "Implementing OLS from Scratch with NumPy",
            ]),
            _m("econ310_inference", "Inference in the Linear Model",
               "t-tests, F-tests and robust standard errors.", [
                "Sampling Distribution of OLS Under Normal Errors",
                "t-Tests, F-Tests and Linear Restrictions",
                "Heteroskedasticity-Robust (White) Standard Errors",
                "Clustered Standard Errors and Grouped Data",
            ]),
            _m("econ310_spec", "Specification and Omitted Variables",
               "Functional form, dummies, interactions and omitted variable bias.", [
                "Omitted Variable Bias: Direction and Magnitude",
                "Dummy Variables, Interactions and Nonlinear Specifications",
                "Multicollinearity and Model Selection",
                "Measurement Error and Attenuation Bias",
            ]),
            _m("econ310_binary", "Limited Dependent Variables",
               "Models for binary and censored outcomes estimated by maximum likelihood.", [
                "The Linear Probability Model and Its Limitations",
                "Probit and Logit via Maximum Likelihood",
                "Marginal Effects in Nonlinear Models",
                "Tobit Models for Censored Outcomes",
            ]),
            _m("econ310_ts", "Introduction to Time-Series Regression",
               "Serial correlation, stationarity and forecasting.", [
                "Stationarity, Autocorrelation and the Correlogram",
                "AR and ARMA Models for Macroeconomic Series",
                "Serial Correlation and Newey–West Standard Errors",
                "Unit Roots, Spurious Regression and the Dickey–Fuller Test",
            ]),
        ]),
        _c("econ_410", "ECON 410", "Causal Inference and Applied Microeconometrics", 400, 4,
           "The modern credibility-revolution toolkit: potential outcomes, randomized experiments, instrumental variables, panel methods, difference-in-differences, regression discontinuity and synthetic control.",
           ["econ_310", "math_regression_design"], [
            _m("econ410_potential", "Potential Outcomes and Randomized Experiments",
               "The Rubin causal model and field experiments in economics.", [
                "Potential Outcomes, Selection Bias and the Average Treatment Effect",
                "Randomized Controlled Trials in Development and Labor Economics",
                "Power Calculations, Stratification and Pre-Analysis Plans",
                "Attrition, Noncompliance and Intent-to-Treat Analysis",
            ]),
            _m("econ410_iv", "Instrumental Variables",
               "Endogeneity, 2SLS and local average treatment effects.", [
                "Endogeneity and the Logic of Instrumental Variables",
                "Two-Stage Least Squares and the Wald Estimator",
                "Weak Instruments and First-Stage Diagnostics",
                "LATE, Compliers and Monotonicity",
                "Replicating Angrist–Krueger Quarter-of-Birth Estimates",
            ]),
            _m("econ410_panel", "Panel Data and Difference-in-Differences",
               "Fixed effects and DiD, including staggered-adoption pitfalls.", [
                "Fixed Effects vs. Random Effects and the Hausman Test",
                "Classic Two-Period Difference-in-Differences and Parallel Trends",
                "Event-Study Designs and Pre-Trend Testing",
                "Staggered Adoption, Negative Weights and Modern DiD Estimators",
            ]),
            _m("econ410_rd", "Regression Discontinuity and Synthetic Control",
               "Exploiting thresholds and constructing counterfactual units.", [
                "Sharp Regression Discontinuity and Local Linear Estimation",
                "Fuzzy RD, Bandwidth Selection and Manipulation Tests",
                "Synthetic Control Methods for Comparative Case Studies",
                "Placebo Inference and Robustness in Quasi-Experimental Designs",
            ]),
            _m("econ410_practice", "Research Design in Practice",
               "Reproducibility, credibility and writing up empirical work.", [
                "Reproducible Empirical Workflows: Version Control and Replication Packages",
                "Multiple Hypothesis Testing and Specification Searching",
                "External Validity and Generalizing Experimental Results",
                "Writing and Presenting an Applied Economics Paper",
            ]),
        ]),
        _c("econ_510", "ECON 510", "Graduate Econometrics: Asymptotic Theory, GMM and Time Series", 500, 4,
           "Doctoral econometric theory: large-sample theory, extremum estimators, maximum likelihood, generalized method of moments, and multivariate time series including VARs and cointegration.",
           ["econ_410", "math_stats_1"], [
            _m("econ510_asymptotics", "Large-Sample Theory",
               "Convergence concepts and limit theorems underpinning econometric inference.", [
                "Convergence in Probability, Distribution and the Continuous Mapping Theorem",
                "Laws of Large Numbers and Central Limit Theorems for Dependent Data",
                "The Delta Method and Asymptotic Normality of OLS",
                "Monte Carlo Studies of Finite-Sample vs. Asymptotic Behavior",
            ]),
            _m("econ510_extremum", "Extremum Estimators and Maximum Likelihood",
               "Consistency and efficiency of M-estimators and MLE.", [
                "Consistency of Extremum Estimators",
                "Maximum Likelihood: Score, Information Matrix and Cramér–Rao Bound",
                "Wald, Likelihood Ratio and Lagrange Multiplier Tests",
                "Quasi-Maximum Likelihood and Sandwich Variance Estimators",
            ], lab=False),
            _m("econ510_gmm", "Generalized Method of Moments",
               "Moment-based estimation with efficient weighting and overidentification tests.", [
                "Moment Conditions and the GMM Estimator",
                "Optimal Weighting Matrices and Two-Step Efficient GMM",
                "Hansen's J-Test of Overidentifying Restrictions",
                "Estimating Euler Equations by GMM",
            ]),
            _m("econ510_var", "Multivariate Time Series and VARs",
               "Vector autoregressions, identification and impulse responses.", [
                "Vector Autoregressions and Granger Causality",
                "Structural VAR Identification: Recursive, Sign and External Instruments",
                "Impulse Response Functions and Forecast Error Variance Decompositions",
                "Local Projections vs. VARs for Monetary Policy Shocks",
            ]),
            _m("econ510_coint", "Nonstationarity and Cointegration",
               "Unit root asymptotics, cointegration and error correction.", [
                "Unit Root Asymptotics and Functional Central Limit Theorems",
                "Engle–Granger and Johansen Cointegration Tests",
                "Vector Error Correction Models",
                "Volatility Modeling with ARCH and GARCH",
            ]),
        ]),
        _c("econ_610", "ECON 610", "Structural Econometrics, Machine Learning and Empirical Research Frontiers", 600, 4,
           "Research-level empirical methods: structural demand estimation, dynamic discrete choice, double/debiased machine learning, heterogeneous treatment effects, and text and big-data methods in economics.",
           ["econ_510", "econ_501", "econ_550"], [
            _m("econ610_demand", "Structural Demand Estimation",
               "Discrete choice demand models with differentiated products.", [
                "Random Utility Models and the Multinomial Logit",
                "Berry Inversion and the BLP Random-Coefficients Demand Model",
                "Instruments for Prices in Differentiated-Product Markets",
                "Implementing a BLP Estimator with Contraction Mapping in Python",
            ]),
            _m("econ610_ddc", "Dynamic Discrete Choice Models",
               "Estimating forward-looking agents' primitives.", [
                "Rust's Bus Engine Replacement Model and Nested Fixed Point",
                "Conditional Choice Probability (Hotz–Miller) Estimators",
                "Identification of Discount Factors and Unobserved Heterogeneity",
                "Counterfactual Policy Simulation with Structural Models",
            ]),
            _m("econ610_dml", "Machine Learning for Causal Inference",
               "Combining flexible prediction with valid inference.", [
                "Prediction vs. Causal Parameters: Regularization Bias",
                "Double/Debiased Machine Learning and Neyman Orthogonality",
                "Causal Forests and Heterogeneous Treatment Effects",
                "Policy Learning and Optimal Treatment Assignment",
            ]),
            _m("econ610_bigdata", "Text, Satellite and Big Data in Economics",
               "New data sources and the methods to extract economic signals from them.", [
                "Text as Data: Measuring Policy Uncertainty and Central Bank Sentiment",
                "Satellite Imagery and Night Lights as Measures of Economic Activity",
                "Nowcasting with High-Dimensional Indicators",
                "Ethics, Privacy and Reproducibility with Proprietary Data",
            ]),
            _m("econ610_research", "From Research Question to Dissertation Chapter",
               "Developing original empirical research.", [
                "Identifying a Research Gap and Formulating a Question",
                "Choosing Between Reduced-Form and Structural Approaches",
                "Robustness, Sensitivity Analysis and Partial Identification Bounds",
                "Refereeing, Revising and Presenting at Research Seminars",
            ], lab=False),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 4. Money, Banking & Finance
# ---------------------------------------------------------------------------------------------
FINANCE = {
    "id": "econ_finance",
    "name": "Money, Banking & Financial Economics",
    "icon": "🏦",
    "description": "Financial institutions and markets, asset pricing and corporate finance, and the theory and practice of central banking. Quantitative derivatives pricing is covered in the Game Theory & Quant Finance domain.",
    "courses": [
        _c("econ_220", "ECON 220", "Money, Banking and Financial Markets", 200, 4,
           "How the financial system channels savings into investment: interest rates, bond and stock markets, banks, central banks, financial crises and regulation.",
           ["econ_103"], [
            _m("econ220_rates", "Interest Rates and Bond Markets",
               "Pricing bonds, yields and the term structure.", [
                "Present Value, Yield to Maturity and Bond Prices",
                "Real vs. Nominal Rates and Inflation Expectations",
                "Risk Structure of Interest Rates and Credit Spreads",
                "The Yield Curve: Expectations and Term Premium Theories",
                "Plotting and Interpreting Treasury Yield Curves in Python",
            ]),
            _m("econ220_banks", "The Economics of Banking",
               "Why banks exist and how they manage risk.", [
                "Asymmetric Information and the Role of Financial Intermediaries",
                "Bank Balance Sheets: Liquidity, Credit and Interest-Rate Risk",
                "Bank Runs and the Diamond–Dybvig Model",
                "Shadow Banking and Money Market Funds",
            ], lab=False),
            _m("econ220_cb", "Central Banks and the Money Supply",
               "Central bank balance sheets and policy tools.", [
                "The Structure of the Federal Reserve, ECB and Other Central Banks",
                "Open Market Operations, Reserves and the Money Supply Process",
                "Interest on Reserves and the Floor System",
                "Quantitative Easing and Central Bank Balance Sheets",
            ], lab=False),
            _m("econ220_crises", "Financial Crises and Regulation",
               "Anatomy of crises and the regulatory response.", [
                "Anatomy of a Financial Crisis: Credit Booms and Asset Bubbles",
                "The 2007–2009 Global Financial Crisis Case Study",
                "Deposit Insurance, Lender of Last Resort and Moral Hazard",
                "Basel Capital Requirements and Macroprudential Policy",
            ], lab=False),
        ]),
        _c("econ_320", "ECON 320", "Financial Economics: Asset Pricing and Corporate Finance", 300, 4,
           "Economic foundations of finance: portfolio theory, CAPM and factor models, market efficiency, capital structure, and behavioral finance. Builds on GT 130's no-arbitrage foundations.",
           ["econ_201", "econ_220", "gt_130"], [
            _m("econ320_portfolio", "Portfolio Choice and Diversification",
               "Mean-variance analysis and the efficient frontier.", [
                "Risk, Return and the Benefits of Diversification",
                "Mean-Variance Optimization and the Efficient Frontier",
                "The Tangency Portfolio and Two-Fund Separation",
                "Building an Efficient Frontier from Stock Return Data",
            ]),
            _m("econ320_capm", "CAPM and Factor Models",
               "Equilibrium pricing of systematic risk and its empirical tests.", [
                "Deriving the Capital Asset Pricing Model",
                "Testing the CAPM: Fama–MacBeth Regressions",
                "Fama–French Three- and Five-Factor Models",
                "Arbitrage Pricing Theory",
            ]),
            _m("econ320_emh", "Market Efficiency and Anomalies",
               "Information in prices and evidence against efficiency.", [
                "Weak, Semi-Strong and Strong Form Market Efficiency",
                "Event Studies of Earnings and Policy Announcements",
                "Momentum, Value and Other Return Anomalies",
                "Limits to Arbitrage and Noise Trader Risk",
            ]),
            _m("econ320_corp", "Corporate Finance",
               "Investment decisions, capital structure and payout policy.", [
                "Capital Budgeting: NPV, IRR and the Cost of Capital",
                "Modigliani–Miller Irrelevance Theorems",
                "Taxes, Bankruptcy Costs and the Tradeoff Theory",
                "Agency Costs, Pecking Order and Payout Policy",
            ], lab=False),
            _m("econ320_behavioral", "Behavioral Finance and Bubbles",
               "Psychology, sentiment and speculative episodes.", [
                "Overconfidence, Extrapolation and Investor Sentiment",
                "The Disposition Effect and Prospect Theory in Trading",
                "Historical Bubbles: Tulips, South Sea, Dot-Com and Housing",
                "Rational Bubbles and Speculative Dynamics",
            ], lab=False),
        ]),
        _c("econ_420", "ECON 420", "Monetary Theory and Central Banking", 400, 4,
           "Advanced monetary economics: money demand, inflation dynamics, time inconsistency and credibility, policy rules, unconventional tools and the macro-financial transmission mechanism.",
           ["econ_302", "econ_220"], [
            _m("econ420_money", "Why Money? Foundations of Monetary Theory",
               "Models that explain the existence and value of money.", [
                "Money in the Utility Function and Cash-in-Advance Models",
                "Search-Theoretic Foundations of Money (Kiyotaki–Wright)",
                "Seigniorage, the Inflation Tax and the Laffer Curve",
                "Fiscal Theory of the Price Level",
            ], lab=False),
            _m("econ420_credibility", "Rules, Discretion and Credibility",
               "Time inconsistency and institutional solutions.", [
                "Kydland–Prescott Time Inconsistency",
                "The Barro–Gordon Model and Inflation Bias",
                "Central Bank Independence and Conservative Central Bankers",
                "Inflation Targeting Regimes Around the World",
            ], lab=False),
            _m("econ420_transmission", "The Monetary Transmission Mechanism",
               "How policy rates affect spending, credit and asset prices.", [
                "Interest Rate, Credit and Exchange Rate Channels",
                "The Financial Accelerator and Balance-Sheet Effects",
                "Identifying Monetary Policy Shocks with High-Frequency Data",
                "Estimating the Effects of Monetary Shocks with Local Projections",
            ]),
            _m("econ420_unconventional", "Unconventional Monetary Policy",
               "Policy at and beyond the zero lower bound.", [
                "Forward Guidance and the Forward Guidance Puzzle",
                "Large-Scale Asset Purchases and Portfolio Balance Effects",
                "Negative Interest Rate Policies",
                "Yield Curve Control and Exit Strategies",
            ], lab=False),
            _m("econ420_future", "Contemporary Issues in Central Banking",
               "Post-pandemic inflation, digital currencies and financial stability.", [
                "The 2021–2023 Inflation Surge and the Policy Response",
                "Central Bank Digital Currencies and Stablecoins",
                "Monetary Policy and Financial Stability Tradeoffs",
                "Simulating Taylor-Rule Variants in a New Keynesian Model",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 5. Public & Labor Economics
# ---------------------------------------------------------------------------------------------
PUBLIC_LABOR = {
    "id": "econ_public_labor",
    "name": "Public & Labor Economics",
    "icon": "🏛️",
    "description": "The economics of government taxation and spending, labor markets and human capital, and rigorous evaluation of social policy.",
    "courses": [
        _c("econ_230", "ECON 230", "Public Economics: Taxation, Spending and Market Failure", 200, 4,
           "The role of government in a market economy: externalities, public goods, tax incidence and efficiency, social insurance, and political economy.",
           ["econ_102"], [
            _m("econ230_role", "The Role of Government",
               "Efficiency, equity and the justification for public intervention.", [
                "Market Failures as a Rationale for Government Intervention",
                "Redistribution and Theories of Distributive Justice",
                "The Size and Composition of Government Budgets Across Countries",
                "Exploring Government Spending Data in Python",
            ]),
            _m("econ230_externalities", "Externalities and Environmental Policy",
               "Corrective taxes, permits and climate economics.", [
                "Pigouvian Taxes and the Social Cost of Carbon",
                "Tradable Permits vs. Command-and-Control Regulation",
                "Valuing the Environment: Contingent Valuation and Hedonics",
                "Discounting and Intergenerational Equity in Climate Policy",
            ], lab=False),
            _m("econ230_tax", "Tax Incidence and Efficiency",
               "Who bears taxes and how much they distort behavior.", [
                "Statutory vs. Economic Incidence",
                "Excess Burden and the Harberger Triangle",
                "Income, Consumption and Wealth Taxes Compared",
                "Corporate Tax Incidence and International Tax Competition",
            ]),
            _m("econ230_insurance", "Social Insurance and Welfare Programs",
               "Unemployment insurance, pensions, health care and transfers.", [
                "Why Governments Provide Social Insurance",
                "Social Security and Retirement Saving",
                "Unemployment Insurance and Moral Hazard",
                "Cash Transfers, EITC and the Design of Anti-Poverty Programs",
            ], lab=False),
            _m("econ230_politics", "Political Economy and Public Choice",
               "How collective decisions are made and where they go wrong.", [
                "Median Voter Theorem and Majority Voting",
                "Interest Groups, Lobbying and Rent-Seeking",
                "Bureaucracy and Government Failure",
                "Fiscal Federalism and Local Public Goods (Tiebout Sorting)",
            ], lab=False),
        ]),
        _c("econ_330", "ECON 330", "Labor Economics", 300, 4,
           "Theory and evidence on labor supply and demand, human capital, wage determination, discrimination, unions, migration and inequality.",
           ["econ_201", "econ_210"], [
            _m("econ330_supply", "Labor Supply",
               "Work-leisure choices, participation and taxes.", [
                "The Static Labor-Leisure Model and Reservation Wages",
                "Income and Substitution Effects of Wage Changes",
                "Female Labor Force Participation and Household Models",
                "Estimating Labor Supply Elasticities from Tax Reforms",
            ]),
            _m("econ330_demand", "Labor Demand and Market Structure",
               "Firm hiring, monopsony and minimum wages.", [
                "Short- and Long-Run Labor Demand Elasticities",
                "Monopsony Power and Employer Concentration",
                "Minimum Wage Evidence: Card–Krueger and Beyond",
                "Automation, Technology and Labor Demand",
            ]),
            _m("econ330_human", "Human Capital and Returns to Education",
               "Schooling investments and how to estimate their payoff.", [
                "The Becker Human Capital Model",
                "The Mincer Earnings Equation",
                "Ability Bias, Signaling and Twin/Sibling Designs",
                "Estimating a Mincer Equation with Census Microdata",
            ]),
            _m("econ330_wages", "Wage Determination, Discrimination and Inequality",
               "Explaining wage gaps and the rise of inequality.", [
                "Compensating Wage Differentials",
                "Taste-Based vs. Statistical Discrimination",
                "Oaxaca–Blinder Decomposition of Wage Gaps",
                "Skill-Biased Technical Change and Rising Wage Inequality",
            ]),
            _m("econ330_institutions", "Unions, Migration and Labor Institutions",
               "Collective bargaining, immigration and job mobility.", [
                "Union Wage Effects and Collective Bargaining Models",
                "Economics of Immigration: Theory and the Mariel Boatlift",
                "Job Search, Turnover and Unemployment Duration",
                "Noncompete Agreements and Labor Market Regulation",
            ], lab=False),
        ]),
        _c("econ_430", "ECON 430", "Policy Evaluation: Health, Education and Social Insurance", 400, 4,
           "Applied public and labor economics: evaluating health, education, poverty and social insurance programs with modern empirical methods and welfare analysis.",
           ["econ_330", "econ_310", "econ_230"], [
            _m("econ430_welfare", "Welfare Analysis for Policy Evaluation",
               "Sufficient statistics and the marginal value of public funds.", [
                "The Sufficient Statistics Approach to Welfare Analysis",
                "The Baily–Chetty Formula for Optimal Social Insurance",
                "Marginal Value of Public Funds (MVPF)",
                "Computing MVPFs for Real Programs",
            ]),
            _m("econ430_health", "Health Economics",
               "Insurance markets, health care demand and policy.", [
                "Demand for Health and the Grossman Model",
                "The RAND and Oregon Health Insurance Experiments",
                "Adverse Selection and Mandates in Health Insurance Exchanges",
                "Hospital Markets, Pricing and Medicare Payment Reform",
            ]),
            _m("econ430_education", "Economics of Education",
               "Schools, teachers and early childhood investments.", [
                "Education Production Functions and Class Size",
                "Teacher Value-Added Measurement",
                "School Choice, Charters and Lottery-Based Evaluations",
                "Early Childhood Programs: Perry Preschool and Head Start",
            ]),
            _m("econ430_poverty", "Poverty, Mobility and Place",
               "Intergenerational mobility and neighborhood effects.", [
                "Measuring Poverty and Intergenerational Mobility",
                "Neighborhood Effects and the Moving to Opportunity Experiment",
                "Administrative Data Studies of Opportunity",
                "Mapping Mobility Data with Python",
            ]),
            _m("econ430_tax", "Behavioral Responses to Taxation",
               "Elasticity of taxable income, bunching and top tax rates.", [
                "The Elasticity of Taxable Income",
                "Bunching Estimators at Kinks and Notches",
                "Optimal Top Income Tax Rates (Diamond–Saez)",
                "Tax Evasion, Enforcement and Third-Party Reporting",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 6. International & Development Economics
# ---------------------------------------------------------------------------------------------
INTL_DEV = {
    "id": "econ_intl_dev",
    "name": "International & Development Economics",
    "icon": "🌍",
    "description": "Trade theory and policy, international finance and exchange rates, and the economics of poverty and growth in developing countries. Strategic and security dimensions of trade are covered in Geopolitics.",
    "courses": [
        _c("econ_240", "ECON 240", "International Trade and Finance", 200, 4,
           "Why countries trade, who gains and loses, trade policy instruments, and an introduction to exchange rates and the balance of payments.",
           ["econ_102", "econ_103"], [
            _m("econ240_ricardo", "Comparative Advantage and the Ricardian Model",
               "Technology-based trade and gains from specialization.", [
                "The Ricardian Model with Two Goods and Two Countries",
                "Relative Prices, World Equilibrium and Gains from Trade",
                "Multiple Goods and the Dornbusch–Fischer–Samuelson Continuum",
                "Revealed Comparative Advantage from Trade Data",
            ]),
            _m("econ240_hos", "Factor Endowments and Distribution",
               "Heckscher–Ohlin and the winners and losers from trade.", [
                "The Heckscher–Ohlin Model",
                "Stolper–Samuelson and Rybczynski Theorems",
                "The Specific-Factors Model and Short-Run Losers",
                "The China Shock and Local Labor Market Adjustment",
            ], lab=False),
            _m("econ240_policy", "Trade Policy Instruments",
               "Tariffs, quotas, subsidies and the WTO system.", [
                "Partial Equilibrium Analysis of Tariffs and Quotas",
                "The Optimal Tariff and Terms-of-Trade Effects",
                "Export Subsidies and Strategic Trade Policy",
                "The WTO, Preferential Trade Agreements and Trade Wars",
            ], lab=False),
            _m("econ240_fx", "Exchange Rates and the Balance of Payments",
               "Foreign exchange markets and international capital flows.", [
                "The Foreign Exchange Market and Interest Parity",
                "Purchasing Power Parity in the Short and Long Run",
                "Current Account Imbalances and Global Saving",
                "Analyzing Exchange Rate and Trade Balance Data in Python",
            ]),
        ]),
        _c("econ_340", "ECON 340", "Development Economics", 300, 4,
           "Why some countries remain poor: poverty traps, institutions, human capital, credit and insurance markets, agriculture, and the experimental revolution in development policy.",
           ["econ_201", "econ_210"], [
            _m("econ340_facts", "Measuring Development and Poverty",
               "Income, poverty lines and multidimensional development.", [
                "GDP per Capita, PPP and the Global Income Distribution",
                "Poverty Lines, Headcounts and Poverty Gaps",
                "Multidimensional Poverty and the Human Development Index",
                "Exploring World Bank Development Indicators in Python",
            ]),
            _m("econ340_traps", "Poverty Traps and Institutions",
               "Multiple equilibria and the deep determinants of development.", [
                "Nutrition-Based and Capital-Based Poverty Traps",
                "Colonial Origins and Institutional Persistence",
                "Geography, Culture and Long-Run Development",
                "Corruption, State Capacity and Governance",
            ], lab=False),
            _m("econ340_markets", "Credit, Insurance and Microfinance",
               "Market imperfections facing the poor.", [
                "Credit Market Failures and Informal Lending",
                "Group Lending and the Microfinance Evidence",
                "Risk-Sharing and Informal Insurance Networks",
                "Mobile Money and Financial Inclusion (M-Pesa)",
            ]),
            _m("econ340_human", "Health, Education and Gender in Development",
               "Human capital investments and their returns in poor countries.", [
                "Deworming, Bed Nets and the Economics of Health Interventions",
                "School Enrollment vs. Learning: Evidence from RCTs",
                "Conditional Cash Transfers: PROGRESA and Its Successors",
                "Gender, Bargaining Power and Women's Empowerment",
            ]),
            _m("econ340_structural", "Structural Transformation and Aid",
               "Agriculture, urbanization, industrial policy and foreign aid.", [
                "The Lewis Dual-Economy Model",
                "Agricultural Productivity and the Green Revolution",
                "Urbanization and Rural–Urban Migration (Harris–Todaro)",
                "Foreign Aid Effectiveness and Industrial Policy Debates",
            ], lab=False),
        ]),
        _c("econ_440", "ECON 440", "Open-Economy Macroeconomics and International Finance", 400, 4,
           "Exchange-rate determination, the Mundell–Fleming and intertemporal current-account models, currency crises, sovereign debt and the international monetary system.",
           ["econ_302", "econ_240"], [
            _m("econ440_ca", "The Intertemporal Approach to the Current Account",
               "Consumption smoothing and capital flows across countries.", [
                "The Small Open Economy Two-Period Model",
                "Current Account as Saving Minus Investment Intertemporally",
                "The Feldstein–Horioka Puzzle",
                "Global Imbalances and the Savings Glut Hypothesis",
            ], lab=False),
            _m("econ440_mf", "Mundell–Fleming and the Policy Trilemma",
               "Monetary and fiscal policy under fixed and flexible exchange rates.", [
                "The Mundell–Fleming Model with Perfect Capital Mobility",
                "Policy Effectiveness Under Fixed vs. Floating Rates",
                "The Impossible Trinity and Capital Controls",
                "The Global Financial Cycle and Dollar Dominance",
            ], lab=False),
            _m("econ440_fx", "Exchange Rate Determination",
               "Monetary models, overshooting and empirical puzzles.", [
                "The Monetary Approach to Exchange Rates",
                "Dornbusch Overshooting",
                "The Meese–Rogoff Puzzle and Random-Walk Forecasting",
                "Testing Uncovered Interest Parity and the Carry Trade in Python",
            ]),
            _m("econ440_crises", "Currency Crises and Sovereign Debt",
               "Speculative attacks, sudden stops and default.", [
                "First-Generation (Krugman) Currency Crisis Models",
                "Second-Generation Self-Fulfilling Crises",
                "Sudden Stops and Emerging-Market Crises",
                "Sovereign Default Models (Eaton–Gersovitz) and Debt Restructuring",
            ]),
            _m("econ440_system", "The International Monetary System",
               "From Bretton Woods to the euro and beyond.", [
                "Gold Standard and Bretton Woods",
                "Optimum Currency Areas and the Eurozone Crisis",
                "The IMF, Swap Lines and the Global Financial Safety Net",
                "Reserve Currencies and the Future of the Dollar",
            ], lab=False),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 7. Industrial Organization & Behavioral Economics
# ---------------------------------------------------------------------------------------------
IO_BEHAVIORAL = {
    "id": "econ_io_behavioral",
    "name": "Industrial Organization & Behavioral Economics",
    "icon": "🏭",
    "description": "How firms compete and how real people decide: market power, strategic pricing, antitrust and platforms, plus psychology-informed economics and experiments. Formal game and auction theory live in the Game Theory domain.",
    "courses": [
        _c("econ_250", "ECON 250", "Behavioral Economics: Psychology and Economic Decisions", 200, 4,
           "Where real decisions depart from the rational model: heuristics and biases, prospect theory, present bias, social preferences, and nudges.",
           ["econ_102"], [
            _m("econ250_bounded", "Bounded Rationality and Heuristics",
               "Systematic deviations from rational choice.", [
                "Rational Choice as Benchmark and Its Critics",
                "Heuristics and Biases: Anchoring, Availability and Representativeness",
                "Mental Accounting and Framing Effects",
                "Choice Overload and Limited Attention",
            ], lab=False),
            _m("econ250_prospect", "Prospect Theory and Reference Dependence",
               "Loss aversion and probability weighting.", [
                "Reference Points and Loss Aversion",
                "Probability Weighting and the Fourfold Pattern",
                "The Endowment Effect",
                "Simulating Prospect-Theory Choices in Python",
            ]),
            _m("econ250_time", "Time Inconsistency and Self-Control",
               "Present bias and its consequences for saving and health.", [
                "Exponential vs. Quasi-Hyperbolic (Beta–Delta) Discounting",
                "Procrastination, Commitment Devices and Sophistication",
                "Retirement Saving and Default Enrollment",
                "Estimating Discount Rates from Choice Data",
            ]),
            _m("econ250_social", "Social Preferences",
               "Fairness, altruism and reciprocity in economic behavior.", [
                "Ultimatum and Dictator Game Evidence",
                "Inequity Aversion and Reciprocity Models",
                "Trust, Norms and Cooperation in Public Goods Games",
                "Identity and Image Concerns in Economic Choices",
            ], lab=False),
            _m("econ250_nudge", "Nudges and Behavioral Policy",
               "Choice architecture and its welfare implications.", [
                "Choice Architecture and Libertarian Paternalism",
                "Behavioral Insights Teams and Field Applications",
                "Sludge, Dark Patterns and Consumer Protection",
                "Behavioral Welfare Economics: Whose Preferences Count?",
            ], lab=False),
        ]),
        _c("econ_350", "ECON 350", "Industrial Organization", 300, 4,
           "The economics of firms and market structure: oligopoly, product differentiation, entry, vertical relations, price discrimination, network effects and competition policy. Uses game-theoretic tools from GT 110.",
           ["econ_201", "gt_110"], [
            _m("econ350_firms", "Firms, Costs and Market Structure",
               "Boundaries of the firm and measuring concentration.", [
                "Transaction Costs and the Boundaries of the Firm",
                "Economies of Scale and Scope and Natural Monopoly",
                "Measuring Concentration: HHI and Concentration Ratios",
                "Markups and Market Power: Measuring Price-Cost Margins",
            ]),
            _m("econ350_oligopoly", "Oligopoly and Product Differentiation",
               "Strategic competition with differentiated goods.", [
                "Capacity Constraints and the Kreps–Scheinkman Result",
                "Hotelling Spatial Competition",
                "Salop Circular City and Product Variety",
                "Simulating Differentiated Bertrand Competition in Python",
            ]),
            _m("econ350_entry", "Entry, Deterrence and Dynamic Competition",
               "Strategic entry and incumbency advantages.", [
                "Contestable Markets and Sunk Costs",
                "Limit Pricing and Strategic Capacity Investment",
                "Predatory Pricing: Theory and Evidence",
                "Collusion Sustainability and Cartel Detection",
            ], lab=False),
            _m("econ350_vertical", "Vertical Relations and Pricing Strategies",
               "Contracts between firms along the supply chain.", [
                "Double Marginalization and Vertical Integration",
                "Resale Price Maintenance and Exclusive Dealing",
                "Bundling and Tying",
                "Nonlinear Pricing and Two-Part Tariffs",
            ], lab=False),
            _m("econ350_platforms", "Networks, Platforms and Competition Policy",
               "Network effects, two-sided markets and antitrust.", [
                "Network Effects, Standards and Tipping",
                "Two-Sided Platforms and Rochet–Tirole Pricing",
                "Merger Analysis and Upward Pricing Pressure",
                "Antitrust in Digital Markets: Search, App Stores and Marketplaces",
            ]),
        ]),
        _c("econ_550", "ECON 550", "Graduate Industrial Organization and Behavioral Economics", 500, 4,
           "Doctoral-level empirical IO and behavioral economics: production function estimation, entry models, merger simulation, behavioral IO, and laboratory and field experimental methods. Auction and mechanism theory are drawn from GT 220.",
           ["econ_350", "econ_250", "econ_501", "gt_220"], [
            _m("econ550_production", "Production Function and Productivity Estimation",
               "Addressing simultaneity in estimating firm productivity.", [
                "The Simultaneity Problem in Production Function Estimation",
                "Olley–Pakes, Levinsohn–Petrin and Ackerberg–Caves–Frazer Methods",
                "Markup Estimation via the Production Approach (De Loecker–Warzynski)",
                "Productivity Dispersion and Misallocation (Hsieh–Klenow)",
            ]),
            _m("econ550_entry", "Empirical Entry and Market Structure",
               "Inferring competition from entry decisions.", [
                "Bresnahan–Reiss Entry Thresholds",
                "Static Entry Games with Multiple Equilibria",
                "Dynamic Oligopoly Models (Ericson–Pakes)",
                "Estimating Entry Thresholds from Market Count Data",
            ]),
            _m("econ550_merger", "Merger Simulation and Antitrust Empirics",
               "Using demand estimates to predict merger effects.", [
                "Merger Simulation with Logit and Nested-Logit Demand",
                "Retrospective Merger Studies",
                "Common Ownership and Competition",
                "Empirical Auctions: Identification of Bidder Valuations",
            ]),
            _m("econ550_behavioral_io", "Behavioral Industrial Organization",
               "How firms respond to and exploit consumer biases.", [
                "Shrouded Attributes and Add-On Pricing",
                "Contract Design for Present-Biased Consumers",
                "Inattention, Salience and Tax Pass-Through",
                "Structural Estimation of Behavioral Models",
            ], lab=False),
            _m("econ550_experiments", "Experimental Economics Methods",
               "Designing and analyzing lab and field experiments.", [
                "Induced Value Theory and Laboratory Design",
                "Market Experiments: Double Auctions and Bubbles in the Lab",
                "Field Experiments with Firms and Consumers",
                "Analyzing Experimental Data with Randomization Inference",
            ]),
        ]),
    ],
}


DOMAIN = {
    "id": "economics",
    "name": "Economics",
    "icon": "📈",
    "color": "#22c55e",
    "tagline": "From supply and demand to causal inference, recursive macro, and structural estimation — a full economics degree.",
    "description": (
        "A complete university economics program from freshman principles through master's-level theory and research: "
        "micro and macro theory, econometrics and economic data science, money and finance, public and labor economics, "
        "international and development economics, and industrial organization and behavioral economics."
    ),
    "subjects": [
        PRINCIPLES,
        THEORY,
        ECONOMETRICS,
        FINANCE,
        PUBLIC_LABOR,
        INTL_DEV,
        IO_BEHAVIORAL,
    ],
}
