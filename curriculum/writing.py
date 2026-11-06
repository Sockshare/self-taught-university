"""Self-Taught curriculum catalog — Writing & Communication domain.

Pure data (see docs/CONTRACTS.md §1). The two tiny helpers below only remove dict boilerplate;
the exported DOMAIN is plain dicts / lists / strings / ints / bools.

NOTE: wrt_101, wrt_210 and wrt_220 are General Education anchors required by every degree —
keep their ids, levels, credits and (in-domain only) prerequisites stable.
"""


def _m(mid, title, summary, lessons, sim=None, lab=False):
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
# 1. Composition & Argument
# ---------------------------------------------------------------------------------------------
COMPOSITION = {
    "id": "composition_argument",
    "name": "Composition & Argument",
    "icon": "📝",
    "description": "From the first college essay to a distinctive prose style: thesis, evidence, structure, revision, genre awareness and sustained argument.",
    "courses": [
        _c("wrt_101", "WRT 101", "College Composition: Clear Writing and Evidence-Based Argument", 100, 3,
           "Write clear, well-organized essays that make a defensible claim, support it with credible evidence, address counterarguments, and survive rigorous revision. A foundation for writing in every discipline.",
           [], [
            _m("writing_process", "The Writing Process: From Blank Page to Final Draft",
               "Treat writing as a recursive process of invention, drafting, revision and editing rather than a one-shot performance.", [
                "Why Writing Is Thinking: Using Drafts to Discover What You Actually Believe",
                "Invention Strategies: Freewriting, Clustering, Question Lists and Reverse Outlining",
                "Drafting Without Perfectionism: Getting a Complete 'Ugly First Draft' on the Page",
                "Global vs. Local Revision: Fixing Argument and Structure Before Sentences",
                "Giving and Using Peer Feedback: Describe-Evaluate-Suggest Workshop Protocols",
            ]),
            _m("thesis_claims", "Crafting a Thesis and Arguable Claims",
               "Turn a topic into a focused, arguable, significant thesis that organizes an entire essay.", [
                "Topic vs. Question vs. Thesis: Narrowing a Subject into an Arguable Claim",
                "Claims of Fact, Definition, Cause, Value and Policy",
                "The 'So What?' Test: Establishing Stakes and Significance for a Reader",
                "Working Theses That Evolve: Revising Your Claim as Evidence Accumulates",
            ]),
            _m("evidence_reasoning", "Evidence, Reasoning and Source Integration",
               "Select, introduce, and analyze evidence so that it actually supports the claim instead of decorating it.", [
                "Types of Evidence: Data, Examples, Expert Testimony, Anecdote and Their Relative Weight",
                "Evaluating Source Credibility: Authority, Currency, Purpose and Corroboration",
                "Quote, Paraphrase or Summarize? Integrating Sources with Signal Phrases",
                "The Quote Sandwich: Introducing, Presenting and Analyzing Evidence",
                "Citation Basics and Avoiding Plagiarism: MLA, APA and Chicago at a Glance",
            ]),
            _m("structure_coherence", "Structure, Paragraphing and Coherence",
               "Organize ideas so readers can follow the line of reasoning from introduction to conclusion.", [
                "Introductions That Frame a Problem: Context, Gap and Thesis",
                "Topic Sentences and the Paragraph as a Unit of Argument",
                "Transitions and Old-to-New Information Flow Between Sentences and Paragraphs",
                "Organizational Patterns: Problem–Solution, Compare–Contrast, Cause–Effect",
                "Conclusions That Extend Rather Than Repeat: Implications and Next Questions",
            ]),
            _m("counterargument_clarity", "Counterargument, Concession and Clear Sentences",
               "Strengthen arguments by engaging opposing views fairly and polishing prose for clarity.", [
                "Steelmanning: Representing Opposing Views in Their Strongest Form",
                "Concession and Rebuttal Moves: 'Granted…, but…' and Qualified Claims",
                "Recognizing Common Fallacies in Your Own Drafts",
                "Clarity at the Sentence Level: Actors as Subjects and Actions as Verbs",
                "Cutting Clutter: Eliminating Wordiness, Nominalizations and Hedging",
            ]),
        ]),
        _c("wrt_102", "WRT 102", "Writing Across the Disciplines: Genre, Audience and Discourse Communities", 100, 4,
           "Analyze how writing conventions differ across the sciences, social sciences, humanities and professions, and adapt your writing to unfamiliar genres and audiences with confidence.",
           ["wrt_101"], [
            _m("genre_theory", "Genre as Social Action",
               "Understand genres as recurring responses to recurring situations rather than fixed templates.", [
                "What Is a Genre? Miller's 'Genre as Social Action' and Rhetorical Situations",
                "Discourse Communities: Swales's Six Characteristics and Insider Knowledge",
                "Genre Analysis Method: Collecting Samples, Identifying Moves and Inferring Purpose",
                "Transferring Writing Knowledge Between Contexts: Near and Far Transfer",
            ]),
            _m("sciences_writing", "Writing in the Natural Sciences and Engineering",
               "Read and write lab reports, abstracts and design memos that follow scientific conventions.", [
                "The IMRaD Structure and Why Science Reports Are Built That Way",
                "Writing a Lab Report: Methods Precision and Results vs. Discussion",
                "Hedging and Certainty in Scientific Claims",
                "Engineering Design Memos and Trade-Off Justification",
            ]),
            _m("social_sciences_humanities", "Writing in the Social Sciences and Humanities",
               "Compare interpretive, empirical and theoretical writing in the social sciences and humanities.", [
                "Literature-Based Argument in the Social Sciences: Positioning Against Prior Research",
                "Close Reading and Interpretive Claims in Literary and Historical Writing",
                "Using Theory as a Lens: Applying a Framework to a Case",
                "Disciplinary Citation Cultures: Why APA Uses Dates and MLA Uses Pages",
            ]),
            _m("professional_public_genres", "Professional and Public Genres",
               "Adapt to workplace and civic genres where readers are busy and stakes are practical.", [
                "Emails, Memos and the Bottom-Line-Up-Front (BLUF) Principle",
                "Op-Eds and Letters to the Editor: Arguing for General Readers in 750 Words",
                "Policy Briefs: Translating Research into Actionable Recommendations",
                "Multimodal Composition: Combining Text, Images and Layout for Public Audiences",
            ]),
        ]),
        _c("wrt_301", "WRT 301", "Advanced Argument: The Extended Persuasive and Analytical Essay", 300, 4,
           "Sustain a complex argument over 5,000+ words, integrating diverse sources, managing multiple counterarguments, and structuring nuanced, qualified claims for skeptical expert readers.",
           ["wrt_230"], [
            _m("toulmin_extended", "Argument Architecture for Long Essays",
               "Design multi-part arguments with sub-claims, warrants and backing that hold together across many pages.", [
                "Toulmin Analysis of Extended Arguments: Claims, Grounds, Warrants, Backing and Qualifiers",
                "Argument Mapping: Diagramming Sub-Claims and Dependencies Before Drafting",
                "Stasis Questions as a Planning Tool: Fact, Definition, Quality and Policy",
                "Signposting and Meta-Discourse for Readers of Long Arguments",
            ]),
            _m("synthesis_sources", "Synthesis and Conversation with Sources",
               "Move beyond summarizing sources to orchestrating them into a scholarly conversation.", [
                "From Summary to Synthesis: Grouping Sources by Position, Method and Assumption",
                "'They Say / I Say' Moves: Agreeing, Disagreeing and Complicating",
                "Identifying Gaps, Tensions and Contradictions in a Body of Literature",
                "Writing Synthesis Matrices and Turning Them into Prose",
            ]),
            _m("nuance_qualification", "Nuance, Qualification and Intellectual Honesty",
               "Make claims as strong as the evidence allows and no stronger.", [
                "Calibrated Confidence: Modal Verbs, Hedges and Boosters",
                "Handling Contradictory Evidence Without Burying It",
                "Multi-Sided Counterargument: Managing Several Opposing Positions at Once",
                "Ethics of Argument: Charity, Fairness and Avoiding Motivated Reasoning",
            ]),
            _m("extended_revision", "Revision of Long-Form Argument",
               "Use structural diagnostics to revise long documents systematically.", [
                "Reverse Outlining a 20-Page Draft to Expose Structural Weaknesses",
                "Cutting and Reordering: Killing Darlings Without Losing the Argument",
                "Reader Testing: Recruiting Skeptical Readers and Interpreting Their Confusion",
                "Final Polish Checklist for Extended Analytical Essays",
            ]),
        ]),
        _c("wrt_401", "WRT 401", "Style: Sentence Craft, Clarity and the Rhythm of Prose", 400, 4,
           "Develop a precise, graceful and recognizable prose style by mastering sentence architecture, cohesion, emphasis and rhythm, informed by Williams, Pinker, Strunk and classical stylistics.",
           ["wrt_301", "wrt_250"], [
            _m("clarity_principles", "Principles of Clarity",
               "Apply Joseph Williams's principles of characters, actions and information flow.", [
                "Characters and Actions: Williams's Diagnosis of Unclear Sentences",
                "Cohesion and Coherence: The Known–New Contract",
                "Emphasis: Placing the Most Important Information at the Stress Position",
                "Pinker's 'Curse of Knowledge' and Classic Style as a Window onto the World",
            ]),
            _m("sentence_architecture", "Sentence Architecture and Variety",
               "Control sentence length, shape and syntax for effect.", [
                "Cumulative, Periodic and Balanced Sentences",
                "Parallelism, Antithesis and Chiasmus in Expository Prose",
                "Managing Long Sentences: Resumptive, Summative and Free Modifiers",
                "Sentence Length Variation and the Music of Paragraphs",
            ]),
            _m("diction_voice", "Diction, Tone and Voice",
               "Choose words with precision and cultivate a consistent authorial voice.", [
                "Concrete vs. Abstract Diction and the Ladder of Abstraction",
                "Register and Tone: Calibrating Formality to Audience",
                "Metaphor and Figurative Language in Nonfiction: When It Clarifies and When It Obscures",
                "Finding and Sustaining an Authorial Voice Across Genres",
            ]),
            _m("style_imitation", "Imitation, Analysis and Style Portfolios",
               "Learn style the classical way: by analyzing and imitating masters.", [
                "Stylistic Analysis of Masters: Orwell, Didion, Baldwin and McPhee",
                "Imitation Exercises: Copying Sentence Patterns to Expand Your Repertoire",
                "Concision Without Curtness: Editing a Published Essay by 30 Percent",
                "Building a Personal Style Sheet and Revision Checklist",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 2. Technical & Scientific Writing
# ---------------------------------------------------------------------------------------------
TECHNICAL = {
    "id": "technical_scientific",
    "name": "Technical & Scientific Writing",
    "icon": "🔬",
    "description": "Writing that helps people understand and do things: reports, documentation, instructions, data-driven prose and research articles.",
    "courses": [
        _c("wrt_210", "WRT 210", "Technical and Scientific Writing", 200, 3,
           "Produce clear, accurate and usable technical documents — reports, proposals, instructions and abstracts — for both expert and non-expert readers in science, engineering and technology.",
           ["wrt_101"], [
            _m("audience_purpose", "Audience Analysis and Purpose in Technical Communication",
               "Identify who will read a document, what they need to do with it, and how that shapes every choice.", [
                "Technical Communication as User-Centered Writing: Readers Act, Not Just Read",
                "Audience Analysis: Experts, Technicians, Managers and Lay Readers",
                "Purpose Statements and Writing for Decision-Makers",
                "Ethics in Technical Communication: Accuracy, Omission and the Challenger Memos",
            ]),
            _m("technical_style", "Technical Style: Precision, Concision and Plain Language",
               "Write sentences that are unambiguous, economical and easy to scan.", [
                "Plain Language Principles and the US Plain Writing Act",
                "Defining Technical Terms: Parenthetical, Sentence and Extended Definitions",
                "Active vs. Passive Voice in Scientific Writing: When Each Is Appropriate",
                "Numbers, Units, Abbreviations and Equations in Running Text",
            ]),
            _m("document_design", "Document Design, Visuals and Data Display",
               "Use headings, lists, tables and figures so readers can navigate and understand quickly.", [
                "Headings, Lists and Chunking for Scannable Documents",
                "Designing Effective Tables and Figures with Informative Captions",
                "Choosing the Right Chart: Bar, Line, Scatter and When to Use a Table Instead",
                "Visual Integrity: Avoiding Misleading Axes and Chartjunk (Tufte's Principles)",
            ]),
            _m("core_genres", "Core Technical Genres: Instructions, Reports and Proposals",
               "Draft the documents engineers and scientists write every week.", [
                "Writing Step-by-Step Instructions and Procedures with Warnings and Cautions",
                "Progress, Status and Incident Reports",
                "Writing a Technical Proposal: Problem, Approach, Schedule and Budget",
                "Recommendation Reports and Feasibility Studies",
                "Usability Testing Your Documents with Real Users",
            ]),
            _m("scientific_writing_basics", "Scientific Writing Fundamentals",
               "Write abstracts, summaries and short research reports that follow scientific conventions.", [
                "Writing Informative Abstracts in 250 Words",
                "Executive Summaries for Non-Specialist Decision Makers",
                "Describing Methods Reproducibly and Reporting Results Without Interpretation",
                "Discussion Sections: Interpreting Findings, Limitations and Implications",
            ]),
        ]),
        _c("wrt_311", "WRT 311", "Software Documentation, API Writing and UX Content", 300, 4,
           "Write and maintain developer documentation, API references, tutorials and in-product UX text using docs-as-code workflows and information architecture principles.",
           ["wrt_210"], [
            _m("docs_types", "The Four Kinds of Documentation",
               "Distinguish tutorials, how-to guides, reference and explanation (the Diátaxis framework).", [
                "The Diátaxis Framework: Tutorials, How-Tos, Reference and Explanation",
                "Writing Tutorials That Guarantee a First Success",
                "Task-Oriented How-To Guides for Experienced Users",
                "Conceptual Explanations and Architecture Overviews",
            ]),
            _m("api_reference", "API Reference and Developer Documentation",
               "Document endpoints, parameters, errors and code samples that developers trust.", [
                "Anatomy of an API Reference Page: Endpoints, Parameters, Responses and Errors",
                "Writing and Testing Code Samples That Actually Run",
                "README Files, Quickstarts and Getting-Started Guides",
                "Generating Reference Docs from Docstrings and OpenAPI Specifications",
            ], lab=True),
            _m("docs_as_code", "Docs-as-Code Workflows and Information Architecture",
               "Manage documentation like software: version control, review and continuous publishing.", [
                "Markdown, reStructuredText and Static Site Generators",
                "Version Control and Code Review for Documentation",
                "Information Architecture: Navigation, Findability and Topic-Based Authoring",
                "Style Guides for Technical Writers: Google, Microsoft and Building Your Own",
            ]),
            _m("ux_writing", "UX Writing and Microcopy",
               "Write the words inside interfaces: labels, errors, onboarding and empty states.", [
                "UX Writing Principles: Clear, Concise, Useful and Human",
                "Error Messages That Explain What Happened and How to Fix It",
                "Onboarding Flows, Empty States and Tooltips",
                "Content Testing: A/B Tests and Comprehension Studies for Interface Text",
                "Inclusive and Accessible Language in Products",
            ]),
        ]),
        _c("wrt_312", "WRT 312", "Writing with Data: Quantitative Reasoning and Visual Explanation", 300, 4,
           "Explain quantitative findings honestly and memorably by combining clear prose with well-designed charts, appropriate statistics and data-driven narrative structure.",
           ["wrt_210"], [
            _m("numbers_in_prose", "Numbers in Prose",
               "Present statistics in sentences readers understand and remember.", [
                "Making Numbers Meaningful: Comparisons, Rates and Human-Scale Analogies",
                "Reporting Uncertainty: Confidence Intervals, Error Bars and Hedged Language",
                "Absolute vs. Relative Risk and Other Common Statistical Miscommunications",
                "Correlation, Causation and the Language of Causal Claims",
            ]),
            _m("chart_design", "Designing Charts That Make a Point",
               "Build visualizations whose design serves a single clear message.", [
                "Preattentive Attributes and Visual Encoding Hierarchies (Cleveland & McGill)",
                "Action Titles: Writing Chart Headlines That State the Finding",
                "Decluttering Charts and Directing Attention with Color",
                "Building Publication-Quality Charts in Python with Matplotlib",
            ], lab=True),
            _m("data_narrative", "Data Storytelling and Narrative Structure",
               "Organize a data-driven report or article around a narrative arc.", [
                "The Data Story Arc: Context, Conflict and Resolution",
                "Martini-Glass and Drill-Down Structures for Interactive Explanations",
                "Annotating Visuals to Guide Interpretation",
                "Case Studies in Data Journalism: The Upshot, FiveThirtyEight and Our World in Data",
            ]),
            _m("data_ethics", "Ethics and Integrity in Data Communication",
               "Avoid misleading readers with selective data, axes or framing.", [
                "Cherry-Picking, Truncated Axes and Other Visual Deceptions",
                "Communicating Missing Data, Sampling Bias and Limitations",
                "Reproducible Reporting: Sharing Data and Code Behind Figures",
                "Writing Methodology Notes for General Audiences",
            ], lab=True),
        ]),
        _c("wrt_411", "WRT 411", "Writing Scientific Research Articles", 400, 4,
           "Draft a complete journal-style research article — from title and abstract to figures and response-to-reviewers — that meets the expectations of a peer-reviewed venue in your field.",
           ["wrt_210", "wrt_350"], [
            _m("article_architecture", "Architecture of a Research Article",
               "Understand how each section of a research paper serves reviewers and readers.", [
                "The Hourglass Model: From Broad Context to Specific Findings and Back",
                "Writing Titles and Abstracts That Get Read and Cited",
                "Introductions Using Swales's CARS Model: Establishing Territory, Niche and Occupation",
                "Writing Methods Sections for Reproducibility and Reporting Guidelines (CONSORT, PRISMA, ARRIVE)",
            ]),
            _m("results_discussion", "Results, Figures and Discussion",
               "Present findings visually and verbally, then interpret them responsibly.", [
                "Planning the Paper Around Its Figures: The Storyboard Method",
                "Writing Results Paragraphs That Lead with the Finding",
                "Discussion Sections: Interpretation, Comparison with Prior Work and Limitations",
                "Avoiding Spin and Overclaiming in Conclusions",
            ]),
            _m("scientific_prose", "Scientific Prose at the Paragraph Level",
               "Write dense technical paragraphs that remain readable.", [
                "Gopen and Swan's 'The Science of Scientific Writing': Reader Expectations",
                "Managing Jargon and Acronyms for Interdisciplinary Readers",
                "Writing in English as an Additional Language: Strategies and Resources",
                "Co-Authoring: Version Control, Authorship Order and Contribution Statements (CRediT)",
            ]),
            _m("submission_review", "Submission, Peer Review and Revision",
               "Navigate journal selection, cover letters, reviews and resubmission.", [
                "Choosing a Journal: Scope, Impact, Open Access and Predatory Venues",
                "Writing Cover Letters to Editors",
                "Responding to Reviewers: Point-by-Point Response Letters",
                "Preprints, Data Availability Statements and Research Integrity",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 3. Rhetoric & Persuasion
# ---------------------------------------------------------------------------------------------
RHETORIC = {
    "id": "rhetoric_persuasion",
    "name": "Rhetoric & Persuasion",
    "icon": "🏛️",
    "description": "How language moves people: classical and modern rhetorical theory, persuasion science, propaganda, media literacy and digital rhetoric.",
    "courses": [
        _c("wrt_230", "WRT 230", "Rhetorical Theory and Analysis: From Aristotle to the Present", 200, 4,
           "Analyze speeches, essays, ads and digital texts using classical and modern rhetorical frameworks, and use those frameworks to make your own writing more persuasive.",
           ["wrt_101", "phil_logic_101"], [
            _m("classical_rhetoric", "Classical Foundations",
               "The Greek and Roman rhetorical tradition and its enduring tools.", [
                "Aristotle's Rhetoric: Ethos, Pathos, Logos and the Available Means of Persuasion",
                "The Five Canons: Invention, Arrangement, Style, Memory and Delivery",
                "Kairos and Decorum: Timing and Fit in Persuasion",
                "Cicero and Quintilian: The Good Person Speaking Well",
            ]),
            _m("rhetorical_situation", "The Rhetorical Situation",
               "Model texts as responses to exigence, audience and constraints.", [
                "Bitzer's Rhetorical Situation: Exigence, Audience and Constraints",
                "Vatz's Rejoinder and the Social Construction of Exigence",
                "The Rhetorical Triangle and Its Modern Expansions",
                "Writing a Rhetorical Analysis Essay",
            ]),
            _m("modern_rhetoric", "Modern and Contemporary Rhetorical Theory",
               "Twentieth-century theorists who reframed rhetoric as identification and meaning-making.", [
                "Kenneth Burke: Identification, the Pentad and Dramatism",
                "Perelman and Olbrechts-Tyteca's New Rhetoric: Universal and Particular Audiences",
                "Invitational Rhetoric and Feminist Critiques of Persuasion",
                "Visual Rhetoric: Reading Images, Design and Layout as Arguments",
            ]),
            _m("rhetorical_criticism", "Methods of Rhetorical Criticism",
               "Apply critical methods to real artifacts from politics, advertising and science.", [
                "Neo-Aristotelian Criticism of a Political Speech",
                "Narrative Criticism and Fisher's Narrative Paradigm",
                "Metaphor and Framing Analysis (Lakoff)",
                "Ideological Criticism: Whose Interests Does a Text Serve?",
            ]),
        ]),
        _c("wrt_330", "WRT 330", "Persuasion, Propaganda and Media Literacy", 300, 4,
           "Explain the psychology of persuasion and the techniques of propaganda and misinformation, and build robust habits for evaluating and responding to persuasive media.",
           ["wrt_230"], [
            _m("persuasion_science", "The Psychology of Persuasion",
               "Empirical models of how attitudes change.", [
                "The Elaboration Likelihood Model: Central and Peripheral Routes",
                "Cialdini's Principles of Influence and Their Ethical Limits",
                "Cognitive Biases Exploited by Persuaders: Anchoring, Framing and Social Proof",
                "Inoculation Theory and Prebunking Against Manipulation",
            ]),
            _m("propaganda", "Propaganda: History and Technique",
               "How states and movements have engineered mass persuasion.", [
                "Bernays, Lippmann and the Birth of Public Relations",
                "Classic Propaganda Techniques: Bandwagon, Glittering Generalities, Scapegoating",
                "Wartime and Totalitarian Propaganda Case Studies",
                "Euphemism, Doublespeak and Orwell's 'Politics and the English Language'",
            ]),
            _m("misinformation", "Misinformation and Information Disorder",
               "Understand how false and misleading content spreads in networked media.", [
                "Misinformation, Disinformation and Malinformation: A Taxonomy",
                "Lateral Reading and the SIFT Method for Fact-Checking",
                "Recommendation Algorithms, Virality and Attention Economics",
                "Deepfakes, Synthetic Media and AI-Generated Text Detection",
            ]),
            _m("ethical_advocacy", "Ethical Advocacy and Counter-Messaging",
               "Persuade responsibly and respond effectively to misleading claims.", [
                "The Ethics of Persuasion: Manipulation vs. Legitimate Influence",
                "Writing Effective Corrections: The Truth Sandwich",
                "Public Health and Science Communication Campaigns Case Studies",
                "Designing an Ethical Persuasion Campaign",
            ]),
        ]),
        _c("wrt_430", "WRT 430", "Digital Rhetoric and Computational Text Analysis", 400, 4,
           "Study persuasion in networked media and use Python-based text analysis — word frequencies, sentiment, topic models and stylometry — to investigate rhetorical patterns at scale.",
           ["wrt_330"], [
            _m("digital_rhetoric", "Rhetoric in Networked Media",
               "How platforms, interfaces and algorithms reshape rhetorical practice.", [
                "Procedural Rhetoric: How Software and Games Make Arguments (Bogost)",
                "Circulation and Virality: Rhetorical Velocity in Social Media",
                "Memes, Remix and Participatory Persuasion",
                "Platform Affordances and the Rhetoric of Interfaces",
            ]),
            _m("text_as_data", "Text as Data: Foundations",
               "Prepare corpora and compute basic descriptive measures with Python.", [
                "Building a Corpus: Collection, Cleaning and Ethics of Scraping",
                "Tokenization, Stopwords and Word Frequency Analysis",
                "Readability Metrics: Flesch–Kincaid, Gunning Fog and Their Limits",
                "Keyword-in-Context (KWIC) Concordances and Collocations",
            ], lab=True),
            _m("computational_methods", "Computational Rhetorical Analysis",
               "Apply sentiment, topic and stylometric methods to rhetorical questions.", [
                "Sentiment and Emotion Lexicons Applied to Political Speeches",
                "Topic Modeling with LDA to Map Themes in a Discourse",
                "Stylometry and Authorship Attribution (Burrows's Delta)",
                "Word Embeddings and Measuring Framing Shifts Over Time",
            ], lab=True),
            _m("llm_rhetoric", "Large Language Models and the Future of Writing",
               "Critically examine AI-generated text as rhetoric and as a writing tool.", [
                "How Large Language Models Generate Text and Why They Sound Persuasive",
                "Authorship, Originality and Academic Integrity in the Age of AI",
                "Using AI Writing Tools Responsibly: Brainstorming, Feedback and Verification",
                "Capstone: A Mixed-Methods Rhetorical Analysis of an Online Controversy",
            ], lab=True),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 4. Public Speaking & Presentation
# ---------------------------------------------------------------------------------------------
SPEAKING = {
    "id": "public_speaking",
    "name": "Public Speaking & Presentation",
    "icon": "🎤",
    "description": "Oral communication from the first classroom talk to debate, negotiation and leadership communication.",
    "courses": [
        _c("wrt_220", "WRT 220", "Public Speaking and Presenting Technical Ideas", 200, 3,
           "Plan, design and deliver confident, well-structured presentations that make complex technical ideas understandable to varied audiences, and handle questions under pressure.",
           ["wrt_101"], [
            _m("speech_foundations", "Foundations of Effective Speaking",
               "Core principles of audience-centered oral communication.", [
                "Speaking vs. Writing: Why Listeners Need Repetition, Signposts and Simplicity",
                "Analyzing Your Audience and Setting a Single Clear Objective",
                "Managing Speech Anxiety: Preparation, Reframing and Physiological Techniques",
                "Ethical Speaking: Accuracy, Attribution and Respect for Listeners",
            ]),
            _m("structure_talks", "Structuring Talks and Technical Explanations",
               "Organize presentations so audiences follow and remember them.", [
                "Openings That Earn Attention: Questions, Stories and Surprising Data",
                "Organizational Patterns: Chronological, Problem–Solution and Monroe's Motivated Sequence",
                "Explaining Complex Ideas: Analogies, Concrete Examples and Layered Detail",
                "Closings, Calls to Action and the Rule of Three",
            ]),
            _m("slides_visuals", "Slides and Visual Aids",
               "Design slides that support rather than compete with the speaker.", [
                "Assertion–Evidence Slide Design for Technical Talks",
                "Presenting Data and Equations Live Without Losing the Room",
                "Live Demos and Whiteboard Explanations: Planning for Failure",
                "Accessibility in Presentations: Contrast, Captions and Font Size",
            ]),
            _m("delivery", "Delivery: Voice, Body and Presence",
               "Use voice, gesture and eye contact to convey confidence and clarity.", [
                "Vocal Variety: Pace, Pitch, Volume and the Power of Pauses",
                "Body Language, Gesture and Eye Contact",
                "Extemporaneous vs. Scripted vs. Memorized Delivery",
                "Presenting Remotely: Camera, Audio and Virtual Engagement",
            ]),
            _m("qa_formats", "Q&A, Short Formats and Feedback",
               "Handle questions and adapt to formats from lightning talks to poster sessions.", [
                "Handling Q&A: Listening, Restating, Answering and Admitting What You Don't Know",
                "Elevator Pitches and Three-Minute Lightning Talks",
                "Conference Poster Presentations",
                "Recording, Self-Review and Structured Peer Feedback",
            ]),
        ]),
        _c("wrt_320", "WRT 320", "Debate, Argumentation and Public Deliberation", 300, 4,
           "Construct, deliver and refute arguments in competitive debate and deliberative formats, thinking on your feet while maintaining rigor and civility.",
           ["wrt_220", "wrt_230"], [
            _m("debate_formats", "Debate Formats and Case Construction",
               "Learn the major debate formats and how to build a case.", [
                "Debate Formats: Parliamentary, Policy, Lincoln–Douglas and British Parliamentary",
                "Constructing an Affirmative Case: Harms, Inherency, Plan and Solvency",
                "Negative Strategies: Disadvantages, Counterplans and Kritiks",
                "Research and Evidence Cards for Debate",
            ]),
            _m("refutation", "Refutation and Cross-Examination",
               "Attack and defend arguments in real time.", [
                "The Four-Step Refutation Model: They Say, But, Because, Therefore",
                "Flowing a Debate: Tracking Arguments in Real Time",
                "Cross-Examination Strategy: Asking Questions That Build Your Case",
                "Weighing Impacts: Magnitude, Probability and Timeframe",
            ]),
            _m("impromptu", "Impromptu and Extemporaneous Speaking",
               "Think and speak clearly with minimal preparation time.", [
                "Rapid Case Building in Ten Minutes of Prep",
                "Impromptu Structures: PREP, Past–Present–Future and Problem–Cause–Solution",
                "Staying Composed Under Hostile Questioning",
                "Rebuttal Speeches: Crystallizing the Key Voting Issues",
            ]),
            _m("deliberation", "Deliberation and Civil Discourse",
               "Move from winning arguments to reaching shared decisions.", [
                "Deliberative Democracy and Habermas's Ideal Speech Situation",
                "Facilitating Structured Dialogue Across Disagreement",
                "Town Halls, Public Comment and Civic Testimony",
                "Moderating Panels and Running Productive Meetings",
            ]),
        ]),
        _c("wrt_420", "WRT 420", "Leadership Communication, Negotiation and Executive Presence", 400, 4,
           "Communicate as a leader: deliver high-stakes briefings, negotiate interest-based agreements, manage difficult conversations and communicate during crises.",
           ["wrt_320"], [
            _m("executive_briefing", "Executive Briefings and Strategic Messaging",
               "Communicate decisions and strategy concisely to senior stakeholders.", [
                "The Pyramid Principle: Leading with the Answer (Minto)",
                "Briefing Executives in Five Minutes: Situation, Complication, Resolution",
                "Communicating Strategy and Vision to Teams",
                "Writing and Delivering Persuasive Business Cases",
            ]),
            _m("negotiation", "Negotiation",
               "Principled, interest-based negotiation techniques.", [
                "Principled Negotiation: Interests, Options, Criteria and BATNA (Fisher & Ury)",
                "Anchoring, Concessions and the Zone of Possible Agreement",
                "Multi-Party and Cross-Cultural Negotiation",
                "Negotiation Simulation and Debrief",
            ]),
            _m("difficult_conversations", "Difficult Conversations and Feedback",
               "Handle conflict, feedback and emotionally charged discussions.", [
                "Difficult Conversations: The What-Happened, Feelings and Identity Conversations",
                "Giving Actionable Feedback: Situation–Behavior–Impact",
                "Active Listening and Nonviolent Communication",
                "Managing Conflict in Teams",
            ]),
            _m("crisis_communication", "Crisis and Media Communication",
               "Speak for an organization when things go wrong.", [
                "Crisis Communication Principles: Be First, Be Right, Be Credible",
                "Media Interviews: Bridging, Flagging and Staying on Message",
                "Writing Press Releases and Public Statements",
                "Case Studies in Crisis Response Successes and Failures",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 5. Research Methods, Information Literacy & Graduate Writing
# ---------------------------------------------------------------------------------------------
RESEARCH = {
    "id": "research_graduate_writing",
    "name": "Research Methods, Information Literacy & Graduate Writing",
    "icon": "📚",
    "description": "Finding, evaluating and synthesizing information, conducting writing research, and producing graduate genres: literature reviews, grant proposals and theses.",
    "courses": [
        _c("wrt_150", "WRT 150", "Information Literacy and Research Fundamentals", 100, 4,
           "Find, evaluate, organize and ethically use information from libraries, databases and the open web, building a research workflow you will use for the rest of your degree.",
           [], [
            _m("info_landscape", "The Information Landscape",
               "How information is produced, published and distributed.", [
                "The Information Cycle: From Breaking News to Scholarly Books",
                "Scholarly vs. Popular vs. Trade Sources",
                "How Peer Review Works and What It Does Not Guarantee",
                "Primary, Secondary and Tertiary Sources Across Disciplines",
            ]),
            _m("searching", "Search Strategies and Databases",
               "Search efficiently in library catalogs, databases and search engines.", [
                "Developing Research Questions and Keyword Lists",
                "Boolean Operators, Truncation and Controlled Vocabularies",
                "Using Google Scholar, JSTOR, PubMed and Discipline Databases",
                "Citation Chaining: Following References Forward and Backward",
            ]),
            _m("evaluation", "Evaluating Information",
               "Judge credibility, bias and relevance of sources.", [
                "The CRAAP Test and Its Limitations",
                "Lateral Reading Like a Professional Fact-Checker",
                "Recognizing Bias, Conflicts of Interest and Predatory Publishing",
                "Evaluating Statistics and Data Sources",
            ]),
            _m("managing_ethics", "Managing Research and Using Sources Ethically",
               "Organize sources and use them in accordance with academic integrity.", [
                "Reference Managers: Zotero, Mendeley and Citation Workflows",
                "Annotated Bibliographies: Summarizing and Evaluating Sources",
                "Copyright, Fair Use and Creative Commons Licensing",
                "Academic Integrity: Plagiarism, Patchwriting and Self-Plagiarism",
            ]),
        ]),
        _c("wrt_350", "WRT 350", "Research Methods for Writers: Qualitative, Quantitative and Archival Inquiry", 300, 4,
           "Design and carry out original research projects using interviews, surveys, archives and textual analysis, and report findings in a methodologically sound written study.",
           ["wrt_150", "wrt_102"], [
            _m("research_design", "Research Design",
               "Plan a study that can actually answer a question.", [
                "From Research Question to Research Design: Matching Methods to Questions",
                "Qualitative, Quantitative and Mixed-Methods Paradigms",
                "Sampling, Validity and Reliability",
                "Research Ethics and Institutional Review Boards (IRB)",
            ]),
            _m("qualitative", "Qualitative Methods",
               "Collect and analyze interviews, observations and documents.", [
                "Designing and Conducting Semi-Structured Interviews",
                "Ethnographic Observation and Field Notes",
                "Qualitative Coding: Open, Axial and Thematic Analysis",
                "Trustworthiness in Qualitative Research: Triangulation and Member Checking",
            ]),
            _m("quantitative_survey", "Surveys and Quantitative Methods",
               "Design surveys and analyze results with basic statistics.", [
                "Writing Unbiased Survey Questions and Response Scales",
                "Descriptive Statistics for Writers: Means, Distributions and Cross-Tabulations",
                "Basic Inferential Statistics and Significance Testing",
                "Analyzing Survey Data with Python and Pandas",
            ], lab=True),
            _m("archival_textual", "Archival and Textual Research",
               "Work with historical documents and textual corpora.", [
                "Archival Research: Finding Aids, Provenance and Handling Primary Documents",
                "Content Analysis: Coding Schemes and Inter-Rater Reliability",
                "Discourse Analysis Approaches",
                "Writing Up a Research Study: Methods, Findings and Limitations",
            ]),
        ]),
        _c("wrt_510", "WRT 510", "Graduate Literature Reviews and Systematic Synthesis", 500, 3,
           "Produce publishable literature reviews — narrative, scoping and systematic — that map a field, critically evaluate evidence, and position a new research contribution.",
           ["wrt_350"], [
            _m("review_types", "Types and Purposes of Literature Reviews",
               "Choose the right review approach for your goal.", [
                "Narrative, Integrative, Scoping and Systematic Reviews Compared",
                "The Literature Review as Argument, Not Annotated Bibliography",
                "Defining Scope, Inclusion Criteria and Review Questions (PICO, SPIDER)",
                "Registering Protocols: PROSPERO and Open Science Framework",
            ]),
            _m("systematic_search", "Systematic Searching and Screening",
               "Conduct reproducible, comprehensive searches.", [
                "Building Reproducible Search Strings Across Multiple Databases",
                "Screening and the PRISMA Flow Diagram",
                "Critical Appraisal Tools and Risk-of-Bias Assessment",
                "Data Extraction Tables and Evidence Matrices",
            ]),
            _m("synthesis_methods", "Synthesis Methods",
               "Combine findings from many studies into new insight.", [
                "Thematic and Narrative Synthesis of Qualitative Studies",
                "Introduction to Meta-Analysis: Effect Sizes and Forest Plots",
                "Conceptual Frameworks and Theory-Building from Literature",
                "Identifying Research Gaps and Future Directions",
            ]),
            _m("writing_review", "Writing and Publishing the Review",
               "Structure and write the review for publication or a thesis chapter.", [
                "Organizing a Review: Chronological, Thematic and Methodological Structures",
                "Maintaining Your Authorial Voice Among Many Sources",
                "Writing the Literature Review Chapter of a Thesis",
                "Keeping a Review Current: Living Reviews and Update Searches",
            ]),
        ]),
        _c("wrt_520", "WRT 520", "Grant and Research Proposal Writing", 500, 3,
           "Write competitive grant and fellowship proposals — specific aims, significance, approach, budget justification — for agencies such as NSF, NIH and private foundations.",
           ["wrt_411"], [
            _m("funding_landscape", "The Funding Landscape",
               "Understand funders, mechanisms and what reviewers look for.", [
                "Federal, Foundation and Industry Funding: How Each Works",
                "Reading a Funding Opportunity Announcement Closely",
                "How Review Panels Score Proposals: NSF Merit Criteria and NIH Scoring",
                "Talking to Program Officers and Building Funder Relationships",
            ]),
            _m("specific_aims", "Specific Aims and Project Summary",
               "Write the single most important page of a proposal.", [
                "The One-Page Specific Aims: Hook, Gap, Hypothesis and Aims",
                "Writing Testable Aims That Are Independent but Synergistic",
                "Project Summaries and Lay Abstracts",
                "Iterating the Aims Page with Mentor and Peer Feedback",
            ]),
            _m("narrative_sections", "Significance, Innovation and Approach",
               "Develop the research narrative that persuades reviewers.", [
                "Significance: Making the Case That the Problem Matters",
                "Innovation: Articulating What Is Genuinely New",
                "Approach: Rationale, Methods, Expected Outcomes, Pitfalls and Alternatives",
                "Broader Impacts and Data Management Plans",
            ]),
            _m("budget_submission", "Budgets, Logistics and Resubmission",
               "Complete the supporting documents and respond to rejection.", [
                "Budgets and Budget Justifications",
                "Biosketches, Letters of Support and Facilities Statements",
                "Fellowship and Foundation Proposals: Personal Statements and Research Plans",
                "Reading Summary Statements and Writing a Resubmission Introduction",
            ]),
        ]),
        _c("wrt_610", "WRT 610", "Thesis and Dissertation Writing", 600, 4,
           "Plan, draft and complete a master's thesis or dissertation chapter with a sustainable writing practice, coherent multi-chapter argument and successful defense.",
           ["wrt_510", "wrt_520"], [
            _m("thesis_planning", "Planning the Thesis",
               "Turn a research project into a feasible, coherent written thesis.", [
                "Thesis Genres: Monograph, Manuscript-Style and Project-Based Theses",
                "Writing the Prospectus or Thesis Proposal",
                "Building a Chapter Map and the Thesis's Through-Line Argument",
                "Working with Advisors and Committees: Expectations and Feedback Cycles",
            ]),
            _m("writing_practice", "Sustainable Writing Practice",
               "Develop habits that get long projects finished.", [
                "Daily Writing, Time-Blocking and Boice's Research on Productive Writers",
                "Overcoming Writer's Block and Perfectionism",
                "Writing Groups, Retreats and Accountability Partnerships",
                "Managing Large Documents: LaTeX, Reference Managers and Version Control",
            ]),
            _m("chapters", "Drafting the Chapters",
               "Write introduction, methods, results and discussion chapters that cohere.", [
                "The Introduction Chapter: Problem, Contribution and Roadmap",
                "Methods and Theoretical Framework Chapters",
                "Findings Chapters: Organizing Evidence Around Claims",
                "The Concluding Chapter: Synthesis, Contributions and Future Work",
            ]),
            _m("revision_defense", "Revision, Defense and Dissemination",
               "Finish, defend and share the thesis.", [
                "Revising for Coherence Across Chapters",
                "Preparing the Defense Presentation and Anticipating Committee Questions",
                "Turning Thesis Chapters into Journal Articles",
                "Open Access Deposit, Embargoes and Public Dissemination of Research",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 6. Creative Nonfiction, Editing & Publishing
# ---------------------------------------------------------------------------------------------
CREATIVE_EDITING = {
    "id": "creative_editing_publishing",
    "name": "Creative Nonfiction, Editing & Publishing",
    "icon": "📖",
    "description": "The craft of true stories and the professional practice of editing, grammar mastery and getting work published.",
    "courses": [
        _c("wrt_240", "WRT 240", "Creative Nonfiction and the Personal Essay", 200, 4,
           "Write compelling true stories — memoir, personal essays and literary nonfiction — using scene, character, structure and reflection, while navigating the ethics of writing about real people.",
           ["wrt_101"], [
            _m("essay_tradition", "The Essay Tradition",
               "From Montaigne to contemporary lyric essays.", [
                "Montaigne and the Essay as an Attempt",
                "The Personal Essay vs. Memoir vs. Literary Journalism",
                "The Lyric and Braided Essay: Fragmented and Hybrid Forms",
                "Reading Like a Writer: Analyzing Contemporary Essayists",
            ]),
            _m("narrative_craft", "Narrative Craft for Nonfiction",
               "Borrow fiction's tools to bring true stories to life.", [
                "Scene vs. Summary: Pacing a True Story",
                "Character Development for Real People",
                "Dialogue, Memory and Reconstructed Conversation",
                "Concrete Sensory Detail and Setting",
            ]),
            _m("structure_reflection", "Structure, Voice and Reflection",
               "Shape experience into meaning.", [
                "The Two Selves: Narrating Self vs. Experiencing Self",
                "Structural Choices: Chronological, Frame and Collage",
                "Reflection: Moving from What Happened to What It Means",
                "Openings and Endings in the Personal Essay",
            ]),
            _m("ethics_workshop", "Ethics and Workshop",
               "Navigate truth, memory and privacy; give and receive workshop critique.", [
                "Truth, Memory and the Ethics of Writing About Family and Friends",
                "Fact-Checking Your Own Life: Research for Memoirists",
                "The Writing Workshop: Critiquing Craft Not Content",
                "Revising a Personal Essay for Publication",
            ]),
        ]),
        _c("wrt_250", "WRT 250", "Grammar, Usage and Mechanics for Writers and Editors", 200, 4,
           "Master English grammar, punctuation and usage at an editor's level — understanding why rules exist, when they can be broken, and how to explain corrections to writers.",
           ["wrt_101"], [
            _m("grammar_system", "The Grammar of English Sentences",
               "Parts of speech, clauses and sentence types analyzed descriptively.", [
                "Parts of Speech and Phrase Structure",
                "Independent and Dependent Clauses; Simple, Compound and Complex Sentences",
                "Sentence Diagramming and Constituency Analysis",
                "Verb Tense, Aspect, Mood and Voice",
            ]),
            _m("punctuation", "Punctuation with Purpose",
               "Use punctuation to control meaning and rhythm.", [
                "Commas: Restrictive vs. Nonrestrictive Elements and Introductory Phrases",
                "Semicolons, Colons and Dashes",
                "Apostrophes, Hyphens and Compound Modifiers",
                "Quotation Marks, Ellipses and Brackets in Quoted Material",
            ]),
            _m("common_errors", "Common Errors and Usage Debates",
               "Diagnose and correct errors and understand contested usage.", [
                "Subject–Verb and Pronoun–Antecedent Agreement, Including Singular 'They'",
                "Dangling and Misplaced Modifiers",
                "Comma Splices, Fused Sentences and Fragments",
                "Prescriptivism vs. Descriptivism: Split Infinitives, 'Less vs. Fewer' and Other Debates",
            ]),
            _m("style_guides", "Style Guides and Consistency",
               "Apply house style using major style manuals.", [
                "The Chicago Manual of Style, AP Stylebook and APA Compared",
                "Building and Using a Project Style Sheet",
                "Capitalization, Numbers and Abbreviations Under Different Styles",
                "Inclusive Language Guidelines in Contemporary Style Manuals",
            ]),
        ]),
        _c("wrt_340", "WRT 340", "Editing and Publishing: From Manuscript to Print and Web", 300, 4,
           "Edit manuscripts at the developmental, line and copy levels, communicate edits diplomatically, and understand the workflows and economics of book, magazine and digital publishing.",
           ["wrt_250"], [
            _m("levels_of_edit", "Levels of Editing",
               "Distinguish developmental, substantive, line and copy editing and proofreading.", [
                "Developmental Editing: Structure, Argument and Audience Fit",
                "Line Editing: Voice, Flow and Sentence-Level Clarity",
                "Copyediting: Consistency, Correctness and Style Sheet Compliance",
                "Proofreading Proofs and Production Marks",
            ]),
            _m("editor_writer", "The Editor–Writer Relationship",
               "Communicate edits so writers accept and learn from them.", [
                "Writing Editorial Letters and Margin Queries",
                "Track Changes, Comments and Collaborative Editing Tools",
                "Editing Without Erasing the Author's Voice",
                "Editing Across Cultures and Varieties of English",
            ]),
            _m("publishing_industry", "The Publishing Industry",
               "Understand how books, magazines and digital content get published.", [
                "Traditional, Independent and Self-Publishing Models",
                "Literary Agents, Query Letters and Book Proposals",
                "Magazine and Digital Publishing: Pitches, Editors and Content Calendars",
                "Rights, Contracts, Royalties and Permissions",
            ]),
            _m("production", "Production and Digital Publishing",
               "Take content through design, production and distribution.", [
                "Book Production Workflow: Design, Typesetting and Printing",
                "E-Books, EPUB and Accessible Digital Publishing",
                "Content Management Systems and Web Publishing Workflows",
                "Fact-Checking and Legal Review: Libel, Privacy and Copyright",
            ]),
        ]),
        _c("wrt_440", "WRT 440", "Long-Form Narrative Nonfiction and Literary Journalism", 400, 4,
           "Report, structure and write a substantial work of long-form nonfiction — a feature article or book chapter — combining immersive reporting with literary craft, and pitch it to editors.",
           ["wrt_240", "wrt_340"], [
            _m("reporting", "Immersive Reporting",
               "Gather the material that makes long-form work possible.", [
                "Immersion Reporting and Access: Spending Time with Subjects",
                "Interviewing for Narrative: Eliciting Scenes and Details",
                "Documents, Records and Data in Narrative Reporting",
                "Note-Taking, Recording and Organizing Large Reporting Archives",
            ]),
            _m("long_form_structure", "Structuring Long-Form Narratives",
               "Organize tens of thousands of words around story and idea.", [
                "Story vs. Situation: Finding the Narrative Arc in Reported Material",
                "McPhee's Structural Diagrams and Organizing Principles",
                "Braiding Narrative and Exposition: Weaving Ideas into Story",
                "Point of View and the Writer's Presence in Literary Journalism",
            ]),
            _m("masters", "Studying the Masters",
               "Analyze landmark works of literary nonfiction.", [
                "New Journalism: Wolfe, Talese, Didion and Thompson",
                "Capote's In Cold Blood and the Nonfiction Novel Debate",
                "Contemporary Long-Form: Science, Crime and Narrative Explanatory Journalism",
                "Ethics of Literary Journalism: Composite Characters and Fabrication Scandals",
            ]),
            _m("pitch_publish", "Pitching, Revising and Publishing",
               "Take a long-form project to editors and the market.", [
                "Writing a Compelling Pitch Letter",
                "Writing a Nonfiction Book Proposal: Overview, Comparables and Sample Chapter",
                "Working Through Multiple Rounds of Edits and Fact-Checks",
                "Capstone: Completing and Workshopping a 6,000-Word Feature",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# Exported Domain
# ---------------------------------------------------------------------------------------------
DOMAIN = {
    "id": "writing",
    "name": "Writing & Communication",
    "icon": "✍️",
    "color": "#e07a5f",
    "tagline": "From the first college essay to grant proposals, keynote talks and the finished thesis.",
    "description": (
        "A complete university writing, rhetoric and communication program: composition and argument, technical and scientific writing, "
        "rhetoric and persuasion, public speaking, research methods and creative nonfiction. "
        "The arc runs from clear, evidence-based freshman essays through editing, debate and research articles to graduate literature reviews, "
        "grant writing and the thesis."
    ),
    "subjects": [
        COMPOSITION,
        TECHNICAL,
        RHETORIC,
        SPEAKING,
        RESEARCH,
        CREATIVE_EDITING,
    ],
}
