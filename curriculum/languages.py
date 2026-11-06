"""World Languages & Polyglot Mastery curriculum for Self-Taught University.

Covers Mandarin Chinese (普通话), German (Deutsch), Italian (Italiano),
French (Français), Arabic (العربية — Fuṣḥā & Dialects), and Comparative
Linguistics & Polyglot Science across Freshman (100) through Master's (500)
seminars.
"""

DOMAIN = {
    "id": "languages",
    "name": "World Languages & Polyglot Mastery",
    "icon": "🌍",
    "color": "#e879f9",
    "tagline": "Phonology, Script Architecture, Morphosyntax, Literary Eloquence, and Live Spoken Immersion across Mandarin, German, Italian, French, and Arabic",
    "description": (
        "A rigorous university faculty combining acoustic phonetics, native script mastery, "
        "morphosyntactic geometry, literary & philosophical primary texts, and high-fluency "
        "spoken immersion across five major world languages plus comparative polyglot science."
    ),
    "subjects": [
        # =====================================================================
        # 1. MANDARIN CHINESE (普通话 / 汉语)
        # =====================================================================
        {
            "id": "mandarin",
            "name": "Mandarin Chinese (普通话)",
            "icon": "🏮",
            "description": (
                "From Pinyin acoustic phonology, pitch contours, and Hanzi semantic-phonetic "
                "radicals through HSK 1–6 grammar, Modern Sinophone media, four-character "
                "Chengyu idioms, and Classical Chinese (Wenyanwen) statecraft texts."
            ),
            "courses": [
                {
                    "id": "zho_101",
                    "code": "ZHO 101",
                    "title": "Mandarin Phonology, Pinyin & Tone Architecture",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": [],
                    "description": (
                        "Master the acoustic physics of Putonghua: the four primary pitch contours "
                        "plus neutral tone, retroflex vs. alveolo-palatal initials, compound finals, "
                        "and productive tone sandhi rules."
                    ),
                    "modules": [
                        {
                            "id": "pitch_contours",
                            "title": "The Four Tones & Five-Level Pitch Scale",
                            "summary": "Chao Yuen Ren's 1–5 tone numbers (55, 35, 214, 51), glottal control, and neutral tone (qīngshēng) timing.",
                            "sim": "tone_pitch_trainer",
                            "lab": False,
                            "lessons": [
                                "Chao's Five-Level Pitch Scale: High-Level (55) and Rising (35) Contours",
                                "The Dipping Third Tone (214) and Half-Third Tone in Connected Speech",
                                "The Sharp Falling Fourth Tone (51) vs. English Stress Intonation",
                                "Neutral Tone (Qīngshēng) Duration, Pitch Inheritance, and Minimal Pairs",
                                "Acoustic Drill: Mā, Má, Mǎ, Mà and High-Frequency Monosyllabic Contrasts",
                            ],
                        },
                        {
                            "id": "pinyin_initials",
                            "title": "Articulatory Phonetics of Mandarin Initials",
                            "summary": "Aspirated vs. unaspirated stops, retroflexes (zh, ch, sh, r), and alveolo-palatals (j, q, x).",
                            "sim": "tone_pitch_trainer",
                            "lab": False,
                            "lessons": [
                                "Voice Onset Time (VOT): Unaspirated b/d/g vs. Aspirated p/t/k",
                                "Dental Sibilants (z, c, s) and Apical Vowel Resonance",
                                "Retroflex Consonants (zh, ch, sh, r): Tongue-Tip Curling and Acoustic Formants",
                                "Alveolo-Palatal Series (j, q, x): Dorsal Articulation Before High Front Vowels",
                                "Minimal Pair Discrimination: j/q/x vs. zh/ch/sh vs. z/c/s",
                            ],
                        },
                        {
                            "id": "pinyin_finals",
                            "title": "Simple, Compound & Nasal Finals",
                            "summary": "The six core vowels including umlaut ü, diphthongs, triphthongs, and front vs. back nasal codas (-n vs. -ng).",
                            "sim": "tone_pitch_trainer",
                            "lab": True,
                            "lessons": [
                                "The Six Core Monophthongs: a, o, e, i, u, and Rounded Front ü",
                                "Diphthongs and Triphthongs: ai, ei, ao, ou, iao, iou (-iu), uai, uei (-ui)",
                                "Alveolar (-n) vs. Velar (-ng) Nasal Codas and Vowel Coloring",
                                "Pinyin Orthographic Conventions: y/w Onsets and Umlaut Omission Rules",
                                "Beijing Erhua (儿化): Rhotacized Finals in Spoken Northern Mandarin",
                            ],
                        },
                        {
                            "id": "tone_sandhi",
                            "title": "Tone Sandhi & Prosodic Connected Speech",
                            "summary": "Third-tone chains, bù (不) and yī (一) contextual tone shifts, and disyllabic trochaic rhythm.",
                            "sim": "tone_pitch_trainer",
                            "lab": True,
                            "lessons": [
                                "Binary Third-Tone Sandhi (3 + 3 → 2 + 3): Nǐ hǎo and Hěn hǎo",
                                "Trinary and Multi-Syllable Third-Tone Sandhi Grouping by Syntax",
                                "Tone Mutation of Bù (不): Fourth Tone to Second Tone Before Falling Tones",
                                "Tone Mutation of Yī (一): Citation First, Rising Second, and Falling Fourth Variants",
                                "Prosodic Foot Structure and Stress-Tone Interaction in Natural Sentences",
                            ],
                        },
                        {
                            "id": "first_dialogues",
                            "title": "Survival Immersion & Core Conversational Frames",
                            "summary": "Greetings, polite registers (nǐ vs. nín), self-introductions, numbers, and question particles.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Greetings, Polite Pronouns (Nǐ vs. Nín), and Surnames with Guìxìng (贵姓)",
                                "Equative Verbs (Shì 是), Stative Adjectives with Hěn (很), and Negation with Bù (不)",
                                "Yes/No Questions with Ma (吗) vs. Affirmative-Negative (A-not-A) Questions",
                                "Interrogative Pronouns In-Situ: Shénme (什么), Shéi (谁), Nǎr (哪儿), and Jǐ (几)",
                                "Cardinal Numbers, Currency (Yuán/Kuài), Dates, and Time Expressions",
                            ],
                        },
                    ],
                },
                {
                    "id": "zho_102",
                    "code": "ZHO 102",
                    "title": "Hanzi Radical Architecture & HSK 1–2 Foundations",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": ["zho_101"],
                    "description": (
                        "Decode the internal geometry of Chinese characters using Liùshū (六书) "
                        "principles, stroke-order invariants, semantic radicals, phonetic components, "
                        "classifier systems, and foundational clause syntax."
                    ),
                    "modules": [
                        {
                            "id": "stroke_geometry",
                            "title": "Eight Principles of Yong (永字八法) & Stroke Order",
                            "summary": "Fundamental strokes, spatial balance inside the imaginary square, and deterministic stroke sequencing.",
                            "sim": "script_stroke_lab",
                            "lab": False,
                            "lessons": [
                                "The Eight Fundamental Strokes in Yǒng (永): Dot, Horizontal, Vertical, Hook, Press, Sweep",
                                "Seven Universal Rules of Hanzi Stroke Order: Top-to-Bottom, Left-to-Right, Outside-In",
                                "Enclosing Frames (口, 囗, 门, 辶) and Center-First Symmetry Rules",
                                "Spatial Proportions: Left-Right, Top-Bottom, and Concentric Character Topologies",
                                "Simplified (Jiǎntǐzì) vs. Traditional (Fántǐzì) Structural Transformations",
                            ],
                        },
                        {
                            "id": "liushu_radicals",
                            "title": "Liùshū (六书) & Semantic-Phonetic Compounds",
                            "summary": "Pictographs, ideographs, compound ideographs, and phono-semantic (xíngshēng) decomposition.",
                            "sim": "script_stroke_lab",
                            "lab": True,
                            "lessons": [
                                "Xiàngxíng (象形) Pictographs and Zhǐshì (指事) Simple Ideographs",
                                "Huìyì (会意) Associative Compounds:明 (Míng), 休 (Xiū),森 (Sēn), and 信 (Xìn)",
                                "Xíngshēng (形声) Phono-Semantic Characters: How 80% of Hanzi Encode Meaning + Sound",
                                "High-Frequency Semantic Radicals I: Water (氵), Hand (扌), Speech (讠), Heart (忄/心)",
                                "High-Frequency Semantic Radicals II: Person (亻), Mouth (口), Wood (木), Metal (钅), Silk (纟)",
                            ],
                        },
                        {
                            "id": "classifiers_de",
                            "title": "Measure Words (Liàngcí) & Modification with De (的)",
                            "summary": "Conceptual categorization via classifiers and pre-nominal relative modification.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "The Cognitive Logic of Chinese Measure Words: Why Numerals Require Classifiers",
                                "Shape and Object Classifiers: Gè (个), Běn (本), Zhāng (张), Tiáo (条), Bǎ (把), Liàng (辆)",
                                "Possession and Nominal Modification with the Structural Particle De (的)",
                                "Demonstratives Zhè (这), Nà (那), and Classifier-Noun Phrases",
                                "Existential and Possessive Constructions: Yǒu (有), Méiyǒu (没有), and Zài (在)",
                            ],
                        },
                        {
                            "id": "time_location_word_order",
                            "title": "Mandarin Canonical Word Order (S + Time + Place + V + O)",
                            "summary": "The Principle of Temporal Sequence and pre-verbal adverbial placement.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "The Macro-to-Micro Rule: Year-Month-Day-Hour and Country-City-Street-Room",
                                "Time-When (Pre-Verbal) vs. Time-Duration (Post-Verbal) Placement",
                                "Pre-Verbal Locative Phrases with Zài (在), Cóng (从), and Dào (到)",
                                "Modal Auxiliary Verbs: Huì (会), Néng (能), Kěyǐ (可以), Xiǎng (想), and Yào (要)",
                                "Serial Verb Constructions and Purpose Clauses in Everyday Narration",
                            ],
                        },
                        {
                            "id": "hsk2_immersion",
                            "title": "HSK 2 Conversational Scenarios & Particle Nuance",
                            "summary": "Shopping, dining, transit, suggestions with Ba (吧), and ongoing action with Zhe (着) / Zhèngzài (正在).",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Ordering in a Teahouse & Restaurant: Dietary Preferences and Measure Quantities",
                                "Navigating High-Speed Rail (Gāotiě) & Subway Networks: Directions and Distances",
                                "Progressive Aspect with Zhèngzài (正在) ... Ne (呢) and Durative Zhe (着)",
                                "Comparative Structures with Bǐ (比), Méiyǒu (没有), and Yíyàng (一样)",
                                "Sentence-Final Discourse Particles: Ba (吧), Ne (呢), A/Ya (啊/呀), and Ma (嘛)",
                            ],
                        },
                    ],
                },
                {
                    "id": "zho_201",
                    "code": "ZHO 201",
                    "title": "Intermediate Mandarin Grammar: Aspect, Complements & Bǎ/Bèi (HSK 3–4)",
                    "level": 200,
                    "credits": 4,
                    "prerequisites": ["zho_102"],
                    "description": (
                        "Conquer the grammatical heart of Mandarin: aspectual particles (le, guo, zhe), "
                        "resultative and directional complements, the three structural de particles (的/得/地), "
                        "disposal Bǎ (把) constructions, and Bèi (被) passives."
                    ),
                    "modules": [
                        {
                            "id": "aspect_le_guo",
                            "title": "Aspectual Geometry: Verbal Le (了), Modal Le (了), and Experiential Guo (过)",
                            "summary": "Distinguishing perfective completion from change-of-state and past life experience.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Why Mandarin Has Aspect Instead of Morphological Tense",
                                "Verbal Perfective Le₁ (V + 了) vs. Sentence-Final Change-of-State Le₂ (了)",
                                "Double-Le Constructions: Quantified Completed ActionsContinuing into the Present",
                                "Experiential Aspect Guo (V + 过) and Negation with Méi (没) vs. Bù (不)",
                                "The Shì ... De (是…的) Focus Frame for Past Events: Time, Place, and Manner",
                            ],
                        },
                        {
                            "id": "three_de_complements",
                            "title": "The Three Structural De (的 / 得 / 地) & Complements",
                            "summary": "Attributive 的, adverbial 地, and post-verbal degree/potential complements with 得.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "Structural Disambiguation: Attributive De (的), Adverbial De (地), Complement De (得)",
                                "Complements of Degree and Verb-Copying Rules When an Object Is Present",
                                "Resultative Complements (V + Adj/V): Kàndǒng (看懂), Tīngjiàn (听见), Zuòwán (做完)",
                                "Simple and Compound Directional Complements: Shànglái (上来), Chūqù (出去), Huílái (回来)",
                                "Figurative Directional Complements: Kànchūlái (看出来), Xiǎngqǐlái (想起来), Jìxiàlái (记下来)",
                            ],
                        },
                        {
                            "id": "potential_complements",
                            "title": "Potential Complements (V + 得/不 + Complement)",
                            "summary": "Expressing structural capability or impossibility of achieving a result.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Affirmative Potential (V + de + R) vs. Negative Potential (V + bu + R)",
                                "Potential vs. Néng/Kěyǐ: Internal Feasibility vs. External Permission",
                                "High-Frequency Idiomatic Potentials: Láidejí (来得及), Mǎideqǐ (买得起), Shòubuliǎo (受不了)",
                                "Combining Directional and Potential Complements in Spoken Debate",
                            ],
                        },
                        {
                            "id": "ba_bei_constructions",
                            "title": "The Bǎ (把) Disposal Construction & Bèi (被) Passive",
                            "summary": "Fronting definite objects to highlight state transformation or affectedness.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Syntactic Conditions on Bǎ (把): Definite Object + Compulsory Post-Verbal Element",
                                "Bǎ with Resultative, Directional, and Locative (Zài/Dào/Gěi) Complements",
                                "The Bèi (被), Jiào (叫), and Ràng (让) Passive Markers in Spoken and Formal Registers",
                                "Unmarked Notionally Passive Topic-Comment Sentences in Mandarin",
                            ],
                        },
                        {
                            "id": "complex_connectors",
                            "title": "Correlative Conjunctions & Discourse Cohesion",
                            "summary": "Paired clausal connectors that scaffold reasoning, concession, and conditionality.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Causal and Conditional Pairs: Yīnwèi...Suǒyǐ (因为…所以), Zhǐyào...Jiù (只要…就), Zhǐyǒu...Cái (只有…才)",
                                "Concessive and Adversative Frames: Suīrán...Dànshì (虽然…但是), Jíshǐ...Yě (即使…也)",
                                "Progressive and Escalating Frames: Búdàn...Érqiě (不但…而且), Yuè...Yuè (越…越)",
                                "Rhetorical Interrogatives and Emphatic Lián...Dōu/Yě (连…都/也) Constructions",
                            ],
                        },
                    ],
                },
                {
                    "id": "zho_301",
                    "code": "ZHO 301",
                    "title": "Advanced Mandarin: Shūmiànyǔ, Media & Tech Discourse (HSK 5)",
                    "level": 300,
                    "credits": 4,
                    "prerequisites": ["zho_201"],
                    "description": (
                        "Bridge colloquial Kǒuyǔ (口语) and formal written register Shūmiànyǔ (书面语): "
                        "monosyllabic classical roots in modern journalism, economics, AI/technology "
                        "terminology, and executive negotiation."
                    ),
                    "modules": [
                        {
                            "id": "kouyu_vs_shumianyu",
                            "title": "Kǒuyǔ (口语) vs. Shūmiànyǔ (书面语) Register Shift",
                            "summary": "How formal Mandarin compresses disyllabic spoken grammar into classical-derived connectors.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "Register Duality: Spoken Yīnwèi/Suǒyǐ vs. Formal Yóuyú/Yīncǐ (由于/因此) and Zhìshǐ (致使)",
                                "Formal Prepositions inherited from Classical Chinese: Yú (于), Yǐ (以), Jiāng (将), and Wèi (为)",
                                "Disyllabic Rhythmic Elasticity: Combining 2+2 and 1+1 Lexical Templates",
                                "Nominalization and Formal Abstract Suffixes: -Huà (化), -Xìng (性), -Dù (度), and -Lǜ (率)",
                            ],
                        },
                        {
                            "id": "sinophone_tech_ai",
                            "title": "Mandarin for AI, Semiconductors, Robotics & Hard Science",
                            "summary": "Technical lexicon and research discourse in Chinese computer science and engineering.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "AI & Deep Learning Lexicon: Dà Yǔyán Móxíng (大语言模型), Zhùyìlì Jīzhì (注意力机制), Tīdù Xiàjiàng (梯度下降)",
                                "Semiconductors & Robotics: Xīnpiàn Zhìchéng (芯片制程), Jīxièbì (机械臂), Chuángǎnqì Rónghé (传感器融合)",
                                "Reading Chinese Technical Papers and Patent Abstracts",
                                "Delivering a Technical Architecture Briefing in Professional Putonghua",
                            ],
                        },
                        {
                            "id": "media_geopolitics",
                            "title": "Sinophone Journalism, Macroeconomics & Geopolitical Analysis",
                            "summary": "Analyzing financial reports, macroeconomic policy, and diplomatic communiqués.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Macroeconomic Indicators: GDP Growth, Supply Chains (Gōngyìngliàn), and Monetary Policy",
                                "Diplomatic Register & Official Communiqués: Hedging, Reciprocity, and Strategic Ambiguity",
                                "Cross-Strait & Regional Linguistic Variations: Mainland Putonghua, Taiwan Guóyǔ, and Singapore Huáyǔ",
                                "Critical Discourse Analysis of Investigative Journalism in Chinese",
                            ],
                        },
                        {
                            "id": "business_etiquette_mianzi",
                            "title": "Executive Negotiation, Guānxì (关系) & Miànzi (面子) Pragmatics",
                            "summary": "High-context indirectness, banquet rhetoric, contract framing, and conflict resolution.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Politeness Pragmatics: Giving Face (Gěi Miànzi), Indirect Refusals, and Strategic Silence",
                                "Formal Correspondence, Proposals, and Contract Clause Structures",
                                "High-Stakes Negotiation Roleplay: Pricing, IP Licensing, and Joint Ventures",
                                "Toast Rhetoric and Classical Allusions in Formal Banquets",
                            ],
                        },
                    ],
                },
                {
                    "id": "zho_401",
                    "code": "ZHO 401",
                    "title": "Chengyu (成语), Four-Character Idioms & Modern Chinese Literature",
                    "level": 400,
                    "credits": 4,
                    "prerequisites": ["zho_301"],
                    "description": (
                        "Master the compressed historical narratives of four-character Chengyu idioms "
                        "and read landmark 20th- and 21st-century Chinese prose from Lu Xun to Liu Cixin."
                    ),
                    "modules": [
                        {
                            "id": "chengyu_architecture",
                            "title": "The Internal Grammar & Historical Origins of Chéngyǔ (成语)",
                            "summary": "Parallel 2+2 syntax, Warring States fables, and syntactic functions of idioms in modern prose.",
                            "sim": "ngram_predictor",
                            "lab": True,
                            "lessons": [
                                "Parallelism in Four Characters: ABAC, AABB, and Subject-Predicate-Subject-Predicate Symmetry",
                                "Strategic & Military Chengyu from Zhànguó (Warring States) and Sūnzi: Wéi Wèi Jiù Zhào (围魏救赵), Shēng Dōng Jī Xī (声东击西)",
                                "Philosophical Fables in Four Characters: Sāi Wēng Shī Mǎ (塞翁失马), Kè Zhōu Qiú Jiàn (刻舟求剑), Huà Shé Tiān Zú (画蛇添足)",
                                "Syntactic Deployment: Using Chengyu as Predicates, Adverbials, and Attributes Without Overuse",
                            ],
                        },
                        {
                            "id": "may_fourth_prose",
                            "title": "The Baihua Revolution: Lu Xun, Zhang Ailing & Modernist Prose",
                            "summary": "Close reading of vernacular literary masterpieces and their stylistic hybridity.",
                            "sim": "script_stroke_lab",
                            "lab": False,
                            "lessons": [
                                "From Wenyan to Baihua: Lu Xun's 'Iron House' Preface to Nàhǎn (呐喊) and 'Kuángrén Rìjì'",
                                "Sensory Imagery and Urban Melancholy in Zhang Ailing (Eileen Chang)",
                                "Lyrical Essayism (Sǎnwén 散文): Zhu Ziqing, Qian Zhongshu's Wéichéng (围城), and Irony",
                                "Rhetorical Analysis Workshop: Translating Literary Nuance Between Chinese and English",
                            ],
                        },
                        {
                            "id": "contemporary_scifi_prose",
                            "title": "Contemporary Sinophone Fiction & Speculative Literature",
                            "summary": "Reading Liu Cixin's Three-Body Problem (三体), Hao Jingfang, and contemporary philosophical essays.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Cosmic Sociology in Original Mandarin: Close Reading Excerpts from Liu Cixin's Sāntǐ (三体)",
                                "Scientific Poetics and Classical Allusion in Contemporary Chinese Sci-Fi",
                                "Contemporary Philosophical and Cultural Criticism in the Sinophone World",
                                "Literary Seminar: Composing a Critical Essay in Polished Shūmiànyǔ",
                            ],
                        },
                        {
                            "id": "tang_song_poetry",
                            "title": "Prosody & Parallelism in Tang and Song Poetry (唐诗宋词)",
                            "summary": "Level (píng 平) vs. oblique (zè 仄) tonal meters, five/seven-character regulated verse (Lǜshī), and Ci lyrics.",
                            "sim": "tone_pitch_trainer",
                            "lab": True,
                            "lessons": [
                                "Píngzè (平仄) Tonal Prosody: Level vs. Oblique Tones in Classical Regulated Verse",
                                "Li Bai (李白) and Du Fu (杜甫): Jueju Quatrains and Lǜshī Antithetical Couplets",
                                "Wang Wei (王维) and Painterly Emptiness: Landscape as Epistemology",
                                "Song Dynasty Cí (词) Lyrics: Su Shi (苏轼) and Li Qingzhao (李清照)",
                            ],
                        },
                    ],
                },
                {
                    "id": "zho_501",
                    "code": "ZHO 501",
                    "title": "Graduate Seminar: Classical Chinese (文言文) & Philosophical Philology",
                    "level": 500,
                    "credits": 4,
                    "prerequisites": ["zho_401"],
                    "description": (
                        "Read Classical Chinese (Wényánwén) primary texts directly: empty function "
                        "particles (xūcí 虚词), word-class flexibility, and original passages from "
                        "Sunzi, Confucius, Laozi, Zhuangzi, and Han Feizi."
                    ),
                    "modules": [
                        {
                            "id": "wenyan_syntax",
                            "title": "Classical Chinese Morphosyntax & Empty Particles (Xūcí 虚词)",
                            "summary": "Nominal predicates with Zhě (者) and Yě (也), pronominal Zhī (之) and Qí (其), and causative/putative verb usage.",
                            "sim": "script_stroke_lab",
                            "lab": True,
                            "lessons": [
                                "Nominal Sentences in Wenyanwen: The...Zhě...Yě (…者…也) Definitional Frame",
                                "The Polysemy of Zhī (之): Object Pronoun, Genitive Subordinator, and Clause Nominalizer",
                                "Function Particles: Ér (而), Yǐ (以), Yú (於/于), Suǒ (所), and Rhetorical Hū/Zāi/Yān (乎/哉/焉)",
                                "Word-Class Fluidity: Nouns Used as Verbs, Causative (Shǐdòng 使动), and Putative (Yìdòng 意动) Shifts",
                            ],
                        },
                        {
                            "id": "sunzi_bingfa",
                            "title": "Strategic Philology: Reading Sūnzi Bīngfǎ (孙子兵法) in the Original",
                            "summary": "Line-by-line analysis of Shǐjì (Laying Plans), Xūshí (Weak Points & Strong), and Mógōng (Attack by Stratagem).",
                            "sim": "script_stroke_lab",
                            "lab": False,
                            "lessons": [
                                "Bīng Zhě, Guó Zhī Dà Shì (兵者，国之大事): Epistemology of Strategic Assessment in Chapter 1",
                                "Zhi Bǐ Zhī Jǐ, Bǎi Zhàn Bù Dài (知彼知己，百战不殆): Information Asymmetry in Chapter 3",
                                "Qí Zhèng Xiāng Shēng (奇正相生) & Xū Shí (虚实): Fluid Dynamics as Strategic Metaphor",
                                "Comparative Translation Lab: Classical Concision vs. Modern Analytical Rendering",
                            ],
                        },
                        {
                            "id": "daoist_confucian_canon",
                            "title": "Laozi's Dàodéjīng (道德经), Zhuāngzǐ (庄子) & Lúnyǔ (论语)",
                            "summary": "Paradox, apophatic language, and ethical cultivation in Warring States philosophy.",
                            "sim": "script_stroke_lab",
                            "lab": False,
                            "lessons": [
                                "Dào Kě Dào, Fēi Cháng Dào (道可道，非常道): Ontological Naming in Daodejing Chapter 1",
                                "Zhuangzi's Qíwùlùn (齐物论): The Butterfly Dream and Perspectival Relativism",
                                "The Analects (Lúnyǔ): Rén (仁), Lǐ (礼), Jūnzǐ (君子), and Rectification of Names (Zhèngmíng 正名)",
                                "Han Feizi (韩非子): Legalist Statecraft, Fǎ (法), Shù (术), and Shì (势)",
                            ],
                        },
                        {
                            "id": "capstone_sinology",
                            "title": "Master's Oratory & Classical Commentary Synthesis",
                            "summary": "Composing high-register modern speeches interwoven with classical citations.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Intertextuality in Elite Chinese Discourse: Quoting Classical Canons in Modern Argument",
                                "Reading Unpunctuated Classical Texts (Jùdòu 句读) Using Parallel Rhythm",
                                "Oral Defense: Delivering a 10-Minute Philosophical Lecture in Putonghua",
                                "Master's Capstone Translation & Philological Commentary Portfolio",
                            ],
                        },
                    ],
                },
            ],
        },

        # =====================================================================
        # 2. GERMAN (DEUTSCH)
        # =====================================================================
        {
            "id": "german",
            "name": "German (Deutsch)",
            "icon": "🦅",
            "description": (
                "Architectural precision in language: German phonology, the four-case declension "
                "matrix, V2/verb-final Satzklammer syntax, compound-word morphology, scientific "
                "and engineering German, and original readings from Kant, Nietzsche, Hilbert, "
                "Planck, and Wittgenstein."
            ),
            "courses": [
                {
                    "id": "deu_101",
                    "code": "DEU 101",
                    "title": "German Phonetics, Gender Architecture & the Four-Case System (A1)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": [],
                    "description": (
                        "Master Hochdeutsch pronunciation (umlauts, ich-Laut vs. ach-Laut, glottal stops), "
                        "three-gender noun classification, nominative/accusative/dative case mechanics, "
                        "and the Verb-Second (V2) syntactic invariant."
                    ),
                    "modules": [
                        {
                            "id": "hochdeutsch_phonetics",
                            "title": "Hochdeutsch Acoustics: Umlauts, Ch-Allophones & Glottal Attacks",
                            "summary": "Front rounded vowels (ä, ö, ü), palatal [ç] vs. uvular [χ], final obstruent devoicing, and uvular R.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Long vs. Short Tense/Lax Vowels and the Three Umlauts: Ä [ɛ/ɛː], Ö [øː/œ], Ü [yː/ʏ]",
                                "The Ich-Laut [ç] vs. Ach-Laut [χ] Complementary Distribution Rule",
                                "Auslautverhärtung (Final Devoicing: Tag [taːk], Hund [hʊnt]) and Glottal Stop (Knacklaut)",
                                "Consonant Clusters: sp-/st- [ʃp/ʃt], z [ts], pf [pf], and Vocalic vs. Consonantal R",
                                "Sentence Rhythm and Stress Placement in Native vs. Borrowed Roots",
                            ],
                        },
                        {
                            "id": "gender_cases_core",
                            "title": "Three Grammatical Genders & Nominative / Accusative / Dative",
                            "summary": "Morphological gender predictors, definite/indefinite articles, and case role assignment.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Predicting Der, Die, Das: Suffix Invariants (-ung, -heit, -keit, -schaft, -chen, -ismus, -ling)",
                                "Nominative Subject vs. Accusative Direct Object: Why Only Masculine Changes (der → den)",
                                "The Dative Indirect Object and Dative-Only Verbs (helfen, danken, gehören, gefallen)",
                                "Personal Pronouns Across Nominative, Accusative, and Dative (ich/mich/mir, du/dich/dir)",
                                "Negation Architecture: Kein-Declension vs. Positional Placement of Nicht",
                            ],
                        },
                        {
                            "id": "present_v2_syntax",
                            "title": "Present Tense Conjugation & the V2 Verb-Second Topological Field",
                            "summary": "Sein, haben, stem-vowel changing strong verbs, modal verbs, and the Satzklammer bracket.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Sein, Haben, Werden and Regular Present-Tense Paradigm Endings (-e, -st, -t, -en)",
                                "Strong Verbs with Stem-Vowel Umlaut or Breaking (fahren → fährt, sprechen → spricht, lesen → liest)",
                                "The V2 Invariant: Vorfeld (Position 1), Finite Verb (Position 2), and Subject-Verb Inversion",
                                "The Six Modal Verbs (können, müssen, wollen, sollen, dürfen, mögen) and the Infinitive Bracket",
                                "Imperative Forms Across Du, Ihr, and Formal Sie Registers",
                            ],
                        },
                        {
                            "id": "prepositions_two_way",
                            "title": "Accusative, Dative & Two-Way Spatial Prepositions (Wechselpräpositionen)",
                            "summary": "Encoding motion toward a boundary (Wohin? → Accusative) vs. static location (Wo? → Dative).",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Pure Accusative Prepositions (durch, für, gegen, ohne, um) and Pure Dative Prepositions (aus, bei, mit, nach, seit, von, zu)",
                                "The Nine Wechselpräpositionen (an, auf, hinter, in, neben, über, unter, vor, zwischen)",
                                "Wohin (Accusative Direction) vs. Wo (Dative Location) and Causative/Intransitive Verb Pairs (legen/liegen, stellen/stehen, setzen/sitzen)",
                                "Prepositional Contractions (im, am, ins, zum, zur, vom, beim) in Natural Speech",
                            ],
                        },
                        {
                            "id": "berlin_munich_dialogues",
                            "title": "A1 Conversational Immersion: Café, Bahn & Academic Introductions",
                            "summary": "Pragmatic fluency in everyday German interactions with formal Sie vs. informal Du.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Duzen vs. Siezen: Social Pragmatics of Formality in Germany, Austria, and Switzerland",
                                "In a Berlin Café & Bakery: Ordering with Konjunktiv II Politeness (Ich hätte gern / Ich möchte)",
                                "Deutsche Bahn Navigation: Connections, Track Changes (Gleiswechsel), and Time Expressions",
                                "Describing Daily Routines, University Schedules, and Living Spaces",
                            ],
                        },
                    ],
                },
                {
                    "id": "deu_102",
                    "code": "DEU 102",
                    "title": "Separable Verbs, Perfekt, Genitive & Adjective Endings (A2)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": ["deu_101"],
                    "description": (
                        "Master separable vs. inseparable prefix verbs, spoken Perfekt vs. written "
                        "Präteritum, the Genitive case, the 4×4 adjective declension matrix, and "
                        "verb-final subordinate clauses."
                    ),
                    "modules": [
                        {
                            "id": "prefix_verbs_reflexives",
                            "title": "Separable, Inseparable & Dual-Prefix Verbs + Reflexives",
                            "summary": "How stress determines whether a prefix detaches to the end of the clause.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Separable Prefixes (ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-) and the Satzklammer",
                                "Inseparable Prefixes (be-, emp-, ent-, er-, ge-, miss-, ver-, zer-): Semantic Shifts and Unstressed Prosody",
                                "Dual-Function Prefixes (durch-, über-, um-, unter-, wider-): Literal Separable vs. Figurative Inseparable",
                                "Accusative vs. Dative Reflexive Verbs (sich erinnern an vs. sich etwas vorstellen)",
                            ],
                        },
                        {
                            "id": "perfekt_praeteritum",
                            "title": "Past Time Architecture: Spoken Perfekt vs. Narrative Präteritum",
                            "summary": "Haben vs. sein auxiliary selection, strong/weak/mixed participles, and simple past stems.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Perfekt Auxiliary Selection: Sein for Change of Location or State vs. Haben for Transitives",
                                "Ge-Participle Morphology: Weak (-t), Strong (-en + Ablaut), and Mixed Verbs (denken → gedacht)",
                                "Why Ge- Disappears in Inseparable Prefix Verbs and -ieren Borrowings",
                                "Präteritum (Simple Past): Essential Spoken Forms (war, hatte, wollte, konnte, musste) and Literary Narration",
                            ],
                        },
                        {
                            "id": "genitive_adjectives",
                            "title": "The Genitive Case & Complete Adjective Declension Matrix",
                            "summary": "Strong, weak, and mixed adjective inflection across all 4 cases and 3 genders + plural.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Genitive Case Morphology (-es/-s on Masculine/Neuter Nouns) and Genitive Prepositions (während, trotz, wegen, statt)",
                                "The Signal Principle of German Adjective Endings: Someone Must Show the Case!",
                                "Weak Declension After Definite Articles (der/die/das): The -e vs. -en Binary Table",
                                "Mixed Declension After Ein/Kein/Possessives and Strong Declension Without Articles",
                                "Comparative (-er + Umlaut) and Superlative (am ...-sten / der ...-ste) Inflected Adjectives",
                            ],
                        },
                        {
                            "id": "nebensaetze_word_order",
                            "title": "Subordinate Clauses (Nebensätze) & Verb-Final Syntax",
                            "summary": "Subordinating conjunctions, indirect questions, and clause-first V2 inversion.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Coordating (und, aber, oder, denn, sondern — Position 0) vs. Subordinating Conjunctions",
                                "Verb-Final Nebensätze with weil, dass, obwohl, wenn, als, während, bevor, nachdem",
                                "Nebensatz in the Vorfeld: Why 'Weil es regnet, bleibe ich zu Hause' Produces Verb-Verb Adjacency",
                                "Infinitive Clauses with Um...zu, Ohne...zu, and Statt...zu",
                            ],
                        },
                        {
                            "id": "da_wo_compounds",
                            "title": "Da- and Wo-Prepositional Compounds & Everyday Argumentation",
                            "summary": "Verbs with fixed prepositions (warten auf, denken an) and anticipative dar-/wor- pronouns.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "High-Frequency Verbs with Governed Prepositions (sich freuen auf vs. über, abhängen von, bestehen aus)",
                                "Da(r)- and Wo(r)-Compounds for Inanimate Referents vs. Preposition + Pronoun for Persons",
                                "Anticipatory Da-Compounds Introducing Dass- and Zu-Infinitive Clauses",
                                "A2 Debate Workshop: Expressing Opinions, Causes, and Counterarguments",
                            ],
                        },
                    ],
                },
                {
                    "id": "deu_201",
                    "code": "DEU 201",
                    "title": "Konjunktiv I/II, Passive Voice & Relative Clause Architecture (B1)",
                    "level": 200,
                    "credits": 4,
                    "prerequisites": ["deu_102"],
                    "description": (
                        "Master counterfactual conditionals (Konjunktiv II), journalistic indirect "
                        "speech (Konjunktiv I), process vs. statal passives, relative clauses in all "
                        "four cases, and Germanic compound word formation."
                    ),
                    "modules": [
                        {
                            "id": "konjunktiv_ii",
                            "title": "Konjunktiv II: Counterfactuals, Irrealis Wishes & Diplomatic Politeness",
                            "summary": "Synthetic umlauted forms (wäre, hätte, käme, wüsste) vs. würde + infinitive and past counterfactuals.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Present Konjunktiv II: Wäre, Hätte, Würde, the Six Modals, and High-Frequency Strong Verbs",
                                "Counterfactual Wenn-Clauses and Verb-First Conditional Clauses Without Wenn ('Hätte ich das gewusst...')",
                                "Past Counterfactuals (hätte/wäre + Partizip II) and Double Infinitive Modal Past ('Ich hätte das machen sollen')",
                                "Irrealis Wishes, Comparisons with Als ob, and Polite Hedging in Academic Discourse",
                            ],
                        },
                        {
                            "id": "passiv_architecture",
                            "title": "Vorgangspassiv (werden) vs. Zustandspassiv (sein) & Passive Substitutes",
                            "summary": "Process vs. resultant state passives, impersonal passives, and lassen/sich/-bar alternatives.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Vorgangspassiv (werden + Partizip II) Across Present, Präteritum, Perfekt (worden!), and Modal Verbs",
                                "Agent vs. Instrument in the Passive: Von (+ Dative Agent) vs. Durch (+ Accusative Means)",
                                "Zustandspassiv (sein + Partizip II) and Impersonal Passives ('Es wird hier gearbeitet')",
                                "Passiversatzformen: Man, Sich lassen + Infinitive, Sein + zu + Infinitive, and -bar/-lich Adjectives",
                            ],
                        },
                        {
                            "id": "relativsaetze_cases",
                            "title": "Relative Clauses Across All Four Cases & Prepositional Relatives",
                            "summary": "Gender/number agreement with the antecedent vs. case assignment inside the relative clause.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Relative Pronouns (der, die, das, प्लुरल die) and the Special Dative Plural (denen) & Genitive (dessen/deren)",
                                "Preposition + Relative Pronoun ('Das Problem, über das wir gesprochen haben')",
                                "Free Relative Clauses with Wer/Wen/Wem and Was/Wo(r)- after Indefinites and Superlatives",
                                "Partizipialattribute: Unpacking Left-Branching Extended Participial Modifiers into Relative Clauses",
                            ],
                        },
                        {
                            "id": "konjunktiv_i_komposita",
                            "title": "Konjunktiv I (Indirect Speech) & German Compound Morphology (Komposita)",
                            "summary": "Epistemic neutrality in German journalism and recursive Determinativkomposita.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "Konjunktiv I (er sei, er habe, er komme) as a Grammatical Evidential in German Media and Law",
                                "Fallback Rules: Switching from Konjunktiv I to Konjunktiv II When Forms Collide with the Indicative",
                                "The Algebra of German Compound Nouns: Grundwort (Right-Hand Head) vs. Bestimmungswort + Fugenelemente (-s-, -n-, -er-)",
                                "Deconstructing Long Technical and Philosophical Compounds on Sight",
                            ],
                        },
                    ],
                },
                {
                    "id": "deu_301",
                    "code": "DEU 301",
                    "title": "Scientific, Mathematical & Engineering German (Fachsprache B2)",
                    "level": 300,
                    "credits": 4,
                    "prerequisites": ["deu_201"],
                    "description": (
                        "Master the precision register of German science and engineering: extended "
                        "participial attributes, Funktionsverbgefüge, mathematical proof terminology "
                        "(Hilbert, Gauss, Noether), and reading physics/chemistry/robotics papers."
                    ),
                    "modules": [
                        {
                            "id": "extended_participials",
                            "title": "Linksattribute (Extended Participial Constructions) & Nominalstil",
                            "summary": "Decoding dense pre-nominal participial modifiers and nominalized scientific prose.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "The Parsing Algorithm for Extended Participial Phrases: Article → Modifiers → Participle I/II → Head Noun",
                                "Gerundivum (ein zu lösendes Problem = a problem to be solved) in Engineering Specifications",
                                "Nominalstil vs. Verbalstil: Transforming Clauses into Prepositional Nominal Phrases (durch, infolge, zwecks, mittels)",
                                "Funktionsverbgefüge (in Betracht ziehen, zur Verfügung stellen, unter Beweis stellen)",
                            ],
                        },
                        {
                            "id": "math_physics_deutsch",
                            "title": "The Language of Gauss, Hilbert, Emmy Noether, Planck & Einstein",
                            "summary": "German mathematical proof formulas, linear algebra/calculus terminology, and original physics papers.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Mathematical Proof Idioms: Sei X ein... (Let X be...), Es gilt..., Daraus folgt..., W.z.b.w. (Q.E.D.)",
                                "Why Eigenvalue, Ansatz, Nullstellensatz, Vierergruppe, and Bremsstrahlung Are German: Etymology & Usage",
                                "Reading Excerpts from Einstein's 1905 'Zur Elektrodynamik bewegter Körper' in the Original German",
                                "Max Planck, Werner Heisenberg (Unschärferelation), and Emmy Noether's Symmetry Prose",
                            ],
                        },
                        {
                            "id": "engineering_robotics_de",
                            "title": "Maschinenbau, Mechatronik, Elektrotechnik & KI-Systeme",
                            "summary": "Technical German for robotics, control theory (Regelungstechnik), and industrial automation.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Regelungstechnik & Robotics: Stellgröße, Regelgröße, Rückkopplung (Feedback), and Freiheitsgrade (DOF)",
                                "Materials, Thermodynamics & Chemical Process Engineering Terminology (Verfahrenstechnik)",
                                "Reading DIN/ISO Engineering Standards and Technical Datasheets in German",
                                "Technical Presentation Workshop: Explaining a Control Loop or AI Pipeline in Hochdeutsch",
                            ],
                        },
                        {
                            "id": "subjective_modals",
                            "title": "Epistemic & Subjective Modal Verbs in Scientific Argumentation",
                            "summary": "Using dürfte, müsste, mag, soll, and will to calibrate probability and source attribution.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Epistemic Probability Scale: Muss (95%), Dürfte (75%), Mag/Kann (50%), Könnte (30%)",
                                "Evidential Soll ('is said to have') vs. Will ('claims to have') with Perfect Infinitives",
                                "Structuring a Scientific Abstract and Discussion Section in Academic German",
                                "Peer-Review Critique & Technical Q&A Simulation",
                            ],
                        },
                    ],
                },
                {
                    "id": "deu_401",
                    "code": "DEU 401",
                    "title": "Philosophical German: Kant, Hegel, Nietzsche, Frege & Heidegger (C1)",
                    "level": 400,
                    "credits": 4,
                    "prerequisites": ["deu_301"],
                    "description": (
                        "Understand why German became a premier language of modern philosophy: "
                        "substantivized infinitives (das Sein, das Dasein), morphological transparency "
                        "(Aufhebung, Anschauung, Vorstellung), and close readings of primary texts."
                    ),
                    "modules": [
                        {
                            "id": "kant_kritik",
                            "title": "Immanuel Kant: Kritik der reinen Vernunft & Groundwork of Ethics",
                            "summary": "Hypotactic periodic sentences, Anschauung vs. Begriff, and a priori synthetic judgments.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "Kant's Terminological Architecture: Sinnlichkeit, Anschauung, Verstand, Begriff, and Vernunft",
                                "An sich vs. Für uns: Parsing Kant's Multi-Tiered Hypotactic Periods",
                                "Close Reading: 'Gedanken ohne Inhalt sind leer, Anschauungen ohne Begriffe sind blind'",
                                "Der Kategorische Imperativ: Original Formulations in the Grundlegung zur Metaphysik der Sitten",
                            ],
                        },
                        {
                            "id": "hegel_nietzsche",
                            "title": "Hegel's Dialectical Morphology & Nietzsche's Aphoristic Mastery",
                            "summary": "Aufheben's triple meaning, An-und-für-sich, and Nietzsche's musical prose rhythm.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Hegel's Linguistic Genius: Why Aufheben Means to Cancel, Preserve, and Elevate Simultaneously",
                                "Herrschaft und Knechtschaft: Close Reading from the Phänomenologie des Geistes",
                                "Nietzsche as Stylist: Aphorism, Tempo, Dash Punctuation, and Wordplay in Jenseits von Gut und Böse",
                                "Zur Genealogie der Moral & Also sprach Zarathustra: Rhetoric, Irony, and Musicality",
                            ],
                        },
                        {
                            "id": "frege_wittgenstein",
                            "title": "Analytic Philosophy in German: Frege, Hilbert, Vienna Circle & Wittgenstein",
                            "summary": "Sinn vs. Bedeutung and the crystal-clear propositions of the Tractatus Logico-Philosophicus.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Gottlob Frege's 'Über Sinn und Bedeutung': Why Sense and Reference Emerged from German Usage",
                                "Ludwig Wittgenstein's Tractatus Logico-Philosophicus: Read propositions 1 through 7 in Original German",
                                "Sachverhalt, Tatsache, Bild, and Sprachspiel (Language-Game) in the Philosophische Untersuchungen",
                                "Translating Untranslatable German Philosophical Concepts Without Losing Structural Precision",
                            ],
                        },
                        {
                            "id": "heidegger_phenomenology",
                            "title": "Husserl & Heidegger: Hyphenated Etymologies and Existential Analytics",
                            "summary": "Dasein, In-der-Welt-sein, Zuhandenheit vs. Vorhandenheit, and Gelassenheit.",
                            "sim": "tokenizer",
                            "lab": False,
                            "lessons": [
                                "Husserl's Intentionalität and Lebenswelt (Lifeworld)",
                                "Heidegger's Word-Forging in Sein und Zeit: Da-sein, Geworfenheit, Sorge, and Ent-fernung",
                                "Zuhandenheit (Readiness-to-Hand) vs. Vorhandenheit (Presence-at-Hand) and 'Die Frage nach der Technik'",
                                "Seminar Paper: Writing a Philosophical Exegesis in C1 Academic German",
                            ],
                        },
                    ],
                },
                {
                    "id": "deu_501",
                    "code": "DEU 501",
                    "title": "Graduate Seminar: Goethe, Rilke, Kafka & High Diplomatic Oratory (C2)",
                    "level": 500,
                    "credits": 4,
                    "prerequisites": ["deu_401"],
                    "description": (
                        "Achieve near-native C2 stylistic command through Goethe's Faust, Rilke's "
                        "Duino Elegies, Kafka's juridical-crystalline prose, and high-level "
                        "diplomatic and academic rhetoric."
                    ),
                    "modules": [
                        {
                            "id": "goethe_faust",
                            "title": "Johann Wolfgang von Goethe: Faust I & II and Weimar Classicism",
                            "summary": "Knittelvers prosody, Sturm und Drang vs. Klassik, and Faust's wager with Mephistopheles.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Studierzimmer: 'Habe nun, ach! Philosophie...' and Faust's Translation of Logos ('Im Anfang war die Tat')",
                                "Mephistopheles as Rhetorician: 'Ich bin der Geist, der stets verneint' and the Wager ('Werd ich zum Augenblicke sagen...')",
                                "Goethe's Scientific Prose (Farbenlehre & Urpflanze) and Morphological Thinking",
                                "Prosody Workshop: Performing Classical German Verse with Natural Cadence",
                            ],
                        },
                        {
                            "id": "rilke_celan_poetry",
                            "title": "Rilke, Hölderlin & Paul Celan: Poetic Syntax at the Limit of Language",
                            "summary": "Dinggedichte (Thing-Poems), Duineser Elegien, and post-war hermetic lyricism.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Hölderlin's Parataxis and Classical Greek Meter in German",
                                "Rainer Maria Rilke: 'Der Panther', 'Archaischer Torso Apollos' ('Du musst dein Leben ändern'), and the First Duino Elegy",
                                "Paul Celan: Compound Neologisms and Polysemy in 'Todesfuge' and 'Atemwende'",
                                "Close Acoustic Reading: Intonation, Enjambment, and Resonance",
                            ],
                        },
                        {
                            "id": "kafka_mann_prose",
                            "title": "Franz Kafka's Crystalline Parables & Thomas Mann's Irony",
                            "summary": "How Kafka uses austere Präteritum and Konjunktiv II to construct surreal legal realism.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Kafka's Opening Sentences: 'Der Prozess', 'Die Verwandlung', and the Parable 'Vor dem Gesetz'",
                                "Prague German Clarity: How Legalistic Modal Particles (doch, wohl, ja, eigentlich) Create Epistemic Vertigo",
                                "Thomas Mann's 'Der Zauberberg': Multi-Clause Hypotaxis, Leitmotif, and Irony",
                                "Stylistic Imitation Lab: Writing a Parable in Kafka's Register vs. a Period in Mann's Register",
                            ],
                        },
                        {
                            "id": "c2_diplomatic_rhetoric",
                            "title": "C2 Rhetoric, Modal Particle Mastery & Live Disputation",
                            "summary": "Mastering Abtönungspartikeln (ja, doch, halt, eben, mal, schon, wohl) and high-register debate.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "The Pragmatic Calculus of German Modal Particles (Abtönungspartikeln) in Spontaneous Argument",
                                "DACH Pluricentric Nuances: Bundesdeutsch vs. Österreichisches Deutsch vs. Schweizer Hochdeutsch",
                                "Delivering a Formal Festrede / Academic Keynote in C2 Hochdeutsch",
                                "Master's Oral Examination & Disputation Defense",
                            ],
                        },
                    ],
                },
            ],
        },

        # =====================================================================
        # 3. ITALIAN (ITALIANO)
        # =====================================================================
        {
            "id": "italian",
            "name": "Italian (Italiano)",
            "icon": "🏛️",
            "description": (
                "The musical descendant of Latin: geminate consonant timing, open/closed vowel "
                "harmony, clitic pronoun choreography, the nuances of il congiuntivo, Renaissance "
                "science and art (Leonardo, Galileo, Machiavelli), and Dante's Divina Commedia."
            ),
            "courses": [
                {
                    "id": "ita_101",
                    "code": "ITA 101",
                    "title": "Italian Melodic Phonetics, Articles & Present Tense Foundations (A1)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": [],
                    "description": (
                        "Master Italian phonetic transparency, double consonant (doppie) duration, "
                        "the seven definite articles, noun/adjective agreement, -are/-ere/-ire "
                        "conjugations, and Piacere constructions."
                    ),
                    "modules": [
                        {
                            "id": "italian_phonetics",
                            "title": "Vocalic Purity, Palatal Digraphs (gl, gn, sc) & Double Consonants (Le Doppie)",
                            "summary": "Seven stressed vowels, hard vs. soft c/g, geminate consonant timing, and raddoppiamento sintattico.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "The Seven-Vowel System: Open vs. Closed E ([ɛ] vs. [e]) and O ([ɔ] vs. [o]) in Stressed Syllables",
                                "Orthographic Velars vs. Palatals: ca/co/cu vs. ci/ce vs. chi/che and ga/go/gu vs. gi/ge vs. ghi/ghe",
                                "Palatal Liquid [ʎ] (gli/famiglia), Palatal Nasal [ɲ] (gnocchi/bagno), and [ʃ] (scena/usciamo)",
                                "Le Doppie (Geminate Consonants): Why Pala vs. Palla and Note vs. Notte Depend on Hold Duration",
                                "Prosodic Contours: Penultimate (Parola Piana), Antepenultimate (Sdrucciola), and Final (Tronca) Stress",
                            ],
                        },
                        {
                            "id": "articles_agreement",
                            "title": "The Seven Definite Articles, Gender/Number & Preposizioni Articolate",
                            "summary": "Phonological conditioning of il/lo/l' and i/gli, irregular plurals, and fused prepositions.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Why Italian Has Three Masculine Singular Articles (il, lo, l') and Two Plurals (i, gli)",
                                "Noun and Adjective Agreement (-o/-i, -a/-e, -e/-i) and Invariable / Greek-Root Nouns (il problema → i problemi)",
                                "Demonstratives (questo vs. quello — Why Bello and Quello Mirror the Definite Article!)",
                                "Preposizioni Semplici (di, a, da, in, con, su, per, tra/fra) and Fused Preposizioni Articolate (del, nello, sul, agli)",
                            ],
                        },
                        {
                            "id": "presente_indicativo",
                            "title": "Presente Indicativo: Essere, Avere, Three Conjugations & Irregulars",
                            "summary": "-are, -ere, -ire (including -isc- verbs), modal verbs, and idiomatic avere expressions.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Essere vs. Avere and Idiomatic Avere Expressions (avere fame, sete, ragione, bisogno di, voglia di)",
                                "Regular -ARE (parlare), -ERE (prendere), and -IRE Type I (dormire) vs. Type II -ISC- (capire, finire, preferire)",
                                "Core Irregular Verbs: Andare, Venire, Fare, Dare, Stare, Uscire, Dire, Bere, Sapere vs. Conoscere",
                                "Modal Verbs (Potere, Volere, Dovere) and Present Progressive with Stare + Gerundio (Sto parlando)",
                            ],
                        },
                        {
                            "id": "piacere_reflexives",
                            "title": "The Logic of Piacere, Indirect Pronouns & Daily Reflexive Verbs",
                            "summary": "Syntactic inversion in Mi piace / Mi piacciono and reciprocal/reflexive routines.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Why 'I Like X' Is 'X Is Pleasing to Me': Mi piace + Singular/Infinitive vs. Mi piacciono + Plural",
                                "Similar Psych-Verbs: Mancare (Mi manchi!), Servire, Bastare, Sembrare, and Interessare",
                                "Reflexive Verbs (alzarsi, svegliarsi, vestirsi, divertirsi) and Reciprocal Plural Action (ci vediamo)",
                                "Possessive Adjectives with Definite Articles (la mia macchina) and the Family-Member Exception (mio fratello)",
                            ],
                        },
                        {
                            "id": "piazza_bar_immersion",
                            "title": "A1 Immersion: Al Bar, In Piazza, Trattoria & Treno Frecciarossa",
                            "summary": "Authentic spoken Italian at the espresso bar, market, trattoria, and train station.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Al Bar Rituals: Ordering Un Caffè, Cornetto, and Aperitivo with Tu vs. Formal Lei",
                                "In Trattoria: Antipasti, Primi, Secondi, Contorni, and Asking About Regional Ingredients",
                                "Navigating Florence, Rome & Venice: Directions, Piazza Life, and Frecciarossa High-Speed Rail",
                                "Time, Weather (Fa caldo / Piove), Seasons, and Expressing Preferences",
                            ],
                        },
                    ],
                },
                {
                    "id": "ita_102",
                    "code": "ITA 102",
                    "title": "Passato Prossimo vs. Imperfetto & Clitic Pronoun Choreography (A2)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": ["ita_101"],
                    "description": (
                        "Master the aspectual interplay between Passato Prossimo and Imperfetto, "
                        "direct/indirect object clitics, the particles Ci and Ne, combined pronouns "
                        "(glielo, me ne), and Futuro Semplice."
                    ),
                    "modules": [
                        {
                            "id": "passato_prossimo",
                            "title": "Passato Prossimo: Auxiliary Choice (Essere vs. Avere) & Past Participles",
                            "summary": "Unaccusative verbs of motion/state change with essere, past participle agreement, and irregular -to/-so/-sto stems.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Regular Participio Passato (-ato, -uto, -ito) and High-Frequency Irregulars (fatto, detto, letto, scritto, visto, preso, scelto, aperto)",
                                "The Casa di Essere: Intransitive Motion, State Change, Reflexives, and Piacere (È piaciuto / Sono piaciuti)",
                                "Transitive vs. Intransitive Dual-Auxiliary Verbs (iniziare, finire, cambiare, salire, scendere, correre)",
                                "Modal Verbs in the Passato Prossimo: Why the Following Infinitive Dictates Ho dovuto parlare vs. Sono dovuto andare",
                            ],
                        },
                        {
                            "id": "imperfetto_contrast",
                            "title": "L'Imperfetto vs. Passato Prossimo & Trapassato Prossimo",
                            "summary": "Background canvas vs. foreground event, habitual past, and pluperfect sequencing.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Imperfetto Morphology (-vo, -vi, -va...) and Irregular Stems (ero, facevo, dicevo, bevevo)",
                                "Aspectual Contrast: Mentre (Ongoing Imperfetto) vs. Quando (Interrupting Passato Prossimo)",
                                "How Verb Meaning Shifts by Aspect: Conoscevo vs. Ho conosciuto, Sapevo vs. Ho saputo, Volevo vs. Ho voluto",
                                "Trapassato Prossimo (Avevo/Ero + Participio) for Anterior Past Events",
                            ],
                        },
                        {
                            "id": "clitics_ci_ne",
                            "title": "Direct/Indirect Pronouns, Partitive/Genitive Ne & Locative/Existential Ci",
                            "summary": "Clitic placement, participle agreement with lo/la/li/le/ne, and idiomatic pronominal verbs.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Direct Object Clitics (mi, ti, lo, la, La, ci, vi, li, le) vs. Indirect Object Clitics (mi, ti, gli, le, Le, ci, vi, gli/loro)",
                                "Mandatory Past Participle Agreement with Direct Clitics: 'L'ho vista ieri' and 'Li abbiamo comprati'",
                                "The Particle NE: Partitive Quantities ('Ne voglio due'), Topic 'Of It' ('Ne parliamo'), and Departure",
                                "The Particle CI: Locative ('Ci vado'), Instrumental ('Ci penso io', 'Ci credo'), and Enclisis on Infinitives ('Andiamoci!')",
                                "Pronomi Combinati (me lo, te la, glielo, ce ne) and Pronominal Idioms (andarsene, farcela, cavarsela, volerci, metterci)",
                            ],
                        },
                        {
                            "id": "futuro_condizionale",
                            "title": "Futuro Semplice, Futuro Anteriore & Condizionale",
                            "summary": "Morphology of future and conditional stems, epistemic probability in the present/past, and future-in-the-past.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Futuro Semplice & Condizionale Presente Shared Irregular Stems (sar-, avr-, far-, andr-, verr-, potr-, dovr-, vorr-, rimarr-, berr-)",
                                "Epistemic Future of Probability ('Che ore sono? Saranno le cinque') and Futuro Anteriore ('Avrà avuto un imprevisto')",
                                "Condizionale Presente for Polite Requests, Advice, and Desires",
                                "Condizionale Composto (Avrei fatto / Sarei andato) for Unfulfilled Past Potentials and Future-in-the-Past ('Ha detto che sarebbe venuto!')",
                            ],
                        },
                    ],
                },
                {
                    "id": "ita_201",
                    "code": "ITA 201",
                    "title": "Il Congiuntivo, Periodo Ipotetico & Passato Remoto (B1)",
                    "level": 200,
                    "credits": 4,
                    "prerequisites": ["ita_102"],
                    "description": (
                        "Master all four tenses of the Italian subjunctive (congiuntivo), the three "
                        "types of conditional sentences (periodo ipotetico), the literary and southern "
                        "Passato Remoto, and implicit gerund/infinitive/participle subordination."
                    ),
                    "modules": [
                        {
                            "id": "congiuntivo_quattro_tempi",
                            "title": "The Four Subjunctive Tenses & Consecutio Temporum",
                            "summary": "Congiuntivo presente, passato, imperfetto, and trapassato across epistemic, volitional, and emotive triggers.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Congiuntivo Presente & Passato: Triggers of Opinion (penso che, credo che), Doubt, Desire, and Impersonal Expressions (è necessario che)",
                                "Indicative vs. Subjunctive Contrast: So che è vero (Certainty) vs. Non so se sia vero (Uncertainty)",
                                "Congiuntivo Imperfetto (-ssi, -ssi, -sse...) and Trapassato (avessi/fossi + Participio)",
                                "Consecutio Temporum (Sequence of Tenses): Coordinating Main-Clause Tense with Subjunctive Contemporaneity, Anteriority, or Posteriority",
                                "Subordinating Conjunctions Requiring the Subjunctive: Benchè, Sebbene, Nonostante, Prima che, A meno che non, Affinché, Senza che",
                            ],
                        },
                        {
                            "id": "periodo_ipotetico",
                            "title": "Il Periodo Ipotetico: Realtà, Possibilità & Irrealtà",
                            "summary": "Real conditions, hypothetical possibilities, and present/past counterfactuals.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Primo Tipo (Realtà): Se + Indicativo → Indicativo / Imperativo",
                                "Secondo Tipo (Possibilità): Se + Congiuntivo Imperfetto → Condizionale Presente ('Se potessi, verrei subito')",
                                "Terzo Tipo (Irrealtà nel Passato): Se + Congiuntivo Trapassato → Condizionale Composto ('Se l'avessi saputo, te l'avrei detto')",
                                "Mixed Conditionals (Periodo Ipotetico Misto): Past Counterfactual Condition with Present Consequence",
                            ],
                        },
                        {
                            "id": "passato_remoto_passivo",
                            "title": "Passato Remoto, Trapassato Remoto & Passive Constructions",
                            "summary": "Historical narrative tense, rhizotonic irregular stems, and passive with essere, venire, and andare.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Regular Passato Remoto Endings and the 1st/3rd Singular / 3rd Plural Irregular Pattern (feci/fece/fecero, dissi, scrissi, lessi, vidi, venni, nacqui)",
                                "fui/ebbi and Historical Narration vs. Living Southern Italian Spoken Usage",
                                "Passive Voice Nuances: Essere (State/Completed), Venire (Dynamic Simple Tenses), and Andare + Participio ('Questo va fatto' = Must Be Done)",
                                "Si Passivante ('Qui si vendono libri') vs. Si Impersonale ('Qui si mangia bene') in Past Tenses",
                            ],
                        },
                        {
                            "id": "subordinate_implicite",
                            "title": "Implicit Subordination, Relative Pronouns (Cui / Il Quale) & Expressive Suffixes",
                            "summary": "Gerundio/participio clauses, prepositional cui, and diminutive/augmentative/pejorative morphology.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Relative Pronouns: Che vs. Preposition + Cui vs. Il quale / La quale and Possessive 'Il cui'",
                                "Unpacking Gerundio Presente/Passato (Essendo arrivato tardi...) into Causal, Conditional, and Concessive Clauses",
                                "Italian Expressive Morphology (Alterati): Diminutives (-ino, -etto, -ello), Augmentatives (-one), and Pejoratives (-accio, -astro)",
                                "B1 Debate & Essay Workshop: Structuring Persuasive Italian Prose with Connettivi Testuali",
                            ],
                        },
                    ],
                },
                {
                    "id": "ita_301",
                    "code": "ITA 301",
                    "title": "Renaissance Humanism, Art, Architecture, Science & Machiavelli (B2)",
                    "level": 300,
                    "credits": 4,
                    "prerequisites": ["ita_201"],
                    "description": (
                        "Explore the Italian Renaissance through primary texts and technical vocabularies: "
                        "Leonardo da Vinci's notebooks, Galileo's scientific prose, Machiavelli's "
                        "Il Principe, and architectural/art-historical analysis."
                    ),
                    "modules": [
                        {
                            "id": "leonardo_galileo",
                            "title": "Leonardo da Vinci & Galileo Galilei: The Birth of Modern Scientific Prose",
                            "summary": "Reading Leonardo's anatomical/mechanical notes and Galileo's Il Saggiatore & Dialogo.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Leonardo da Vinci's Codices: Saper Vedere, Fluid Vortices, Flight Mechanics, and Anatomical Proportions",
                                "Why Galileo Chose Tuscan Vernacular Over Latin to Invent Modern Experimental Physics Prose",
                                "Close Reading from Galileo's Il Saggiatore (1623): 'Il gran libro della natura è scritto in lingua matematica'",
                                "Galileo's Dialogo sopra i due massimi sistemi del mondo: Thought Experiments and Rhetorical Irony",
                            ],
                        },
                        {
                            "id": "machiavelli_statecraft",
                            "title": "Niccolò Machiavelli: Il Principe & Discorsi sopra la prima deca di Tito Livio",
                            "summary": "Virtù vs. Fortuna, la verità effettuale della cosa, and dilemmatic syntax (o...o...).",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Machiavelli's Conceptual Polarity: Virtù (Strategic Prowess) vs. Fortuna (Contingency)",
                                "Machiavelli's Binary Syntax: Disjunctive Dilemmas ('Perché gli uomini si debbono o vezzeggiare o spegnere')",
                                "Chapters XV–XVIII of Il Principe: Being Loved vs. Being Feared, the Fox and the Lion (La Volpe e il Leone)",
                                "Republican Liberty and Institutional Checks in the Discorsi",
                            ],
                        },
                        {
                            "id": "rinascimento_arte_architettura",
                            "title": "Architecture, Perspective & Fine Arts: Brunelleschi, Alberti, Vasari & Bernini",
                            "summary": "Technical vocabulary of perspective (prospettiva lineare), fresco, chiaroscuro, and classical orders.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Brunelleschi's Cupola and Leon Battista Alberti's De Pictura: Prospettiva, Punto di Fuga, and Sezione Aurea",
                                "Giorgio Vasari's Le Vite: Disegno, Invenzione, Sprezzatura (Castiglione), and Chiaroscuro vs. Sfumato",
                                "Baroque Dynamism: Caravaggio's Tenebrismo and Bernini's Sculptural Theatricality",
                                "Art & Architecture Critique Seminar in Italian",
                            ],
                        },
                        {
                            "id": "gastronomia_design",
                            "title": "Italian Industrial Design, Oenology & Gastronomic Chemistry",
                            "summary": "Precision terminology of Italian design, regional culinary science, and economic culture.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Storia del Design Italiano: Gio Ponti, Olivetti, Pininfarina, and Ergonomic Aesthetics",
                                "Regional Gastronomic Lexicon & Oenology: Terroir, Tannini, Acidità, and Slow Food Philosophy",
                                "Contemporary Italian Economic, Legal, and Political Discourse",
                                "B2 Oral Presentation: Analyzing an Italian Innovation or Historical Text",
                            ],
                        },
                    ],
                },
                {
                    "id": "ita_401",
                    "code": "ITA 401",
                    "title": "Modern Italian Literature, Philosophy & Cinema: Leopardi to Calvino (C1)",
                    "level": 400,
                    "credits": 4,
                    "prerequisites": ["ita_301"],
                    "description": (
                        "Read the titans of modern Italian thought and literature: Leopardi's "
                        "philosophical poetry, Pirandello's epistemological theater, Primo Levi's "
                        "chemist-eye prose, Umberto Eco's semiotics, and Italo Calvino's combinatorics."
                    ),
                    "modules": [
                        {
                            "id": "leopardi_manzoni",
                            "title": "Giacomo Leopardi & Alessandro Manzoni: Forging Modern Literary Italian",
                            "summary": "L'Infinito, Operette Morali, and Manzoni's linguistic unification in I Promessi Sposi.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Giacomo Leopardi's 'L'Infinito' and 'Canto notturno': Indefinite Vague Words (Parole Poetiche) vs. Materialist Lucid Prose",
                                "Leopardi's Operette Morali and Zibaldone: Cosmic Pessimism and Enlightenment Irony",
                                "Alessandro Manzoni and the Questione della Lingua: 'Sciacquare i panni in Arno'",
                                "Prosody of the Italian Endecasillabo and Settenario",
                            ],
                        },
                        {
                            "id": "pirandello_svevo_montale",
                            "title": "Pirandello, Svevo & Montale: Identity, Psychoanalysis & Hermeticism",
                            "summary": "L'umorismo, Uno, nessuno e centomila, La coscienza di Zeno, and Ossi di seppia.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Luigi Pirandello: 'Il sentimento del contrario', Maschere, and Sei personaggi in cerca d'autore",
                                "Italo Svevo's La coscienza di Zeno: Unreliable Narration and Triestine Irony",
                                "Eugenio Montale's Objective Correlative: 'Meriggiare pallido e assorto' and 'Spesso il male di vivere ho incontrato'",
                                "Giuseppe Ungaretti and Salvatore Quasimodo: Essential Word Density",
                            ],
                        },
                        {
                            "id": "levi_calvino_eco",
                            "title": "Primo Levi, Italo Calvino & Umberto Eco: Science, Semiotics & Literature",
                            "summary": "Il sistema periodico, Le città invisibili, Lezioni americane, and Il nome della rosa.",
                            "sim": "ngram_predictor",
                            "lab": True,
                            "lessons": [
                                "Primo Levi's Il sistema periodico: How a Chemist's Quantitative Precision Illuminates Human Memory",
                                "Italo Calvino's Lezioni americane (Six Memos): Leggerezza, Rapidità, Esattezza, Visibilità, Molteplicità",
                                "Combinatorial Narrative in Calvino's Le città invisibili and Se una notte d'inverno un viaggiatore",
                                "Umberto Eco: Semiotics, Labyrinths, and Historical Detection in Il nome della rosa",
                            ],
                        },
                        {
                            "id": "cinema_neorealismo",
                            "title": "Italian Cinema & Regional Sociolinguistics: Rossellini, Fellini, Antonioni, Sorrentino",
                            "summary": "Regional varieties (Romanesco, Napoletano, Siciliano, Veneto, Milanese) in Italian cinema.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Neorealismo (De Sica, Rossellini, Visconti): Authentic Street Speech and Post-War Ethics",
                                "Fellini, Antonioni & Pasolini: Dreamscapes, Alienation, and Linguistic Anthropology",
                                "Italian Dialects (Lingue Regionali) vs. Italiano Regionale in Contemporary Film",
                                "C1 Critical Essay: Writing Literary or Film Criticism in High-Register Italian",
                            ],
                        },
                    ],
                },
                {
                    "id": "ita_501",
                    "code": "ITA 501",
                    "title": "Graduate Seminar: Dante's Divina Commedia, Petrarca, Opera Librettos & C2 Rhetoric",
                    "level": 500,
                    "credits": 4,
                    "prerequisites": ["ita_401"],
                    "description": (
                        "Read Dante Alighieri's Commedia in the original 14th-century Florentine "
                        "terza rima, analyze Da Ponte/Mozart and Verdi/Puccini opera librettos, "
                        "and master C2 forensic and academic Italian rhetoric."
                    ),
                    "modules": [
                        {
                            "id": "dante_inferno",
                            "title": "Dante Alighieri: Inferno & the Architecture of Terza Rima",
                            "summary": "ABA BCB CDC interlocking rhyme, contrapasso, Francesca da Rimini, Farinata, and Ulysses.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Inferno Canto I & III: 'Nel mezzo del cammin di nostra vita' and the Gate of Hell",
                                "Inferno Canto V (Paolo & Francesca): 'Amor, ch'a nullo amato amar perdona' and Dolce Stil Novo Ethics",
                                "Inferno Canto XXVI (Ulisse): 'Fatti non foste a viver come bruti, ma per seguir virtute e canoscenza'",
                                "Archaic Florentine Forms vs. Modern Italian: Why Dante Remains 90% Intelligible Today",
                            ],
                        },
                        {
                            "id": "purgatorio_paradiso",
                            "title": "Purgatorio, Paradiso & Dante's Neologisms (Transumanar, Insemprarsi)",
                            "summary": "How Dante forged philosophical, astronomical, and mystical vocabulary at the limit of speech.",
                            "sim": "tokenizer",
                            "lab": False,
                            "lessons": [
                                "Purgatorio: Temporal Hope, Virgil's Farewell, and Earthly Paradise",
                                "Paradiso Canto I & XXXIII: Light Metaphysics, Geometric Cosmology, and 'L'amor che move il sole e l'altre stelle'",
                                "Dante's Prefix-Verbs of Interiority: Trasumanar, Insemprarsi, Immiarsi, Intuarsi, Inluiarsi",
                                "Petrarca's Canzoniere & Boccaccio's Decameron: Lyric Interiority vs. Ciceronian Narrative Prose",
                            ],
                        },
                        {
                            "id": "opera_libretto_poetics",
                            "title": "The Poetics of the Italian Opera Libretto: Monteverdi, Da Ponte/Mozart, Verdi & Puccini",
                            "summary": "Recitativo secco vs. aria, poetic meters (ottonario, decasillabo), and dramatic hyperbaton.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Lorenzo Da Ponte's Librettos for Mozart: Le nozze di Figaro, Don Giovanni, and Così fan tutte",
                                "Bel Canto and Giuseppe Verdi (Rigoletto, La Traviata, Otello): Solita Forma and Political Risorgimento Subtext",
                                "Puccini (Tosca, La Bohème, Turandot): Verismo Colloquialism and Lyric Climax",
                                "Decoding Poetic Inversion (Anastrofe) and Literary Truncation (Apocope: amor, cor, far) in Sung Italian",
                            ],
                        },
                        {
                            "id": "c2_eloquenza_italiana",
                            "title": "C2 Forensic Rhetoric, Philology & Master's Oral Disputation",
                            "summary": "High-register judicial, diplomatic, and academic oratory in contemporary Italian.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Forensic & Parliamentary Italian Rhetoric: Hypotaxis, Litotes, Chiasmus, and Concessive Framing",
                                "Historical Grammar From Vulgar Latin to Florentine: Palatalization, Diphthongization (bonum → buono), and Case Collapse",
                                "Delivering a 10-Minute Lectio Magistralis in C2 Italian",
                                "Master's Capstone Portfolio & Oral Examination",
                            ],
                        },
                    ],
                },
            ],
        },

        # =====================================================================
        # 4. FRENCH (FRANÇAIS)
        # =====================================================================
        {
            "id": "french",
            "name": "French (Français)",
            "icon": "⚜️",
            "description": (
                "Analytic clarity and acoustic elegance: nasal vowels, liaison and enchaînement, "
                "clitic syntax, le subjonctif, Enlightenment philosophy and mathematics (Descartes, "
                "Pascal, Laplace, Poincaré, Sartre, Foucault), and the French art of la dissertation."
            ),
            "courses": [
                {
                    "id": "fra_101",
                    "code": "FRA 101",
                    "title": "French Phonology, Liaison, Nasal Vowels & Core Syntax (A1)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": [],
                    "description": (
                        "Master the acoustic flow of French: nasal vowels, front rounded vowels (u vs. ou, "
                        "eu/œ), mandatory/forbidden liaison, enchaînement, articles (including partitives), "
                        "and present-tense conjugation."
                    ),
                    "modules": [
                        {
                            "id": "french_acoustics_liaison",
                            "title": "Nasal Vowels, Front Rounded Vowels (u/eu) & the Physics of Liaison",
                            "summary": "Why French is spoken in rhythmic groups (groupes rythmiques) rather than isolated words.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Front Rounded Vowels: Tu [ty] vs. Tout [tu], Peu [pø] vs. Peur [pœʁ], and Mute/Caduc Schwa (e muet)",
                                "The Nasal Vowels: [ɑ̃] (sans/vent), [ɛ̃] (vin/pain/plein), and [ɔ̃] (bon/monde) vs. Denasalized Feminines (bon [bɔ̃] → bonne [bɔn])",
                                "The CaReFuL Rule of Final Consonants and Uvular Fricative R [ʁ]",
                                "Enchaînement vs. Liaison: Mandatory, Optional, and Forbidden Liaisons (and Aspirate H: le héros)",
                                "Oxytonic Rhythmic Group Stress and Intonation Contours",
                            ],
                        },
                        {
                            "id": "determiners_partitives",
                            "title": "Gender, Articles, Partitives (du/de la/des) & Negation (ne...pas de)",
                            "summary": "Definite vs. indefinite vs. partitive determiners and quantifier reduction to de.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Gender Patterns (-tion, -sion, -té, -ure vs. -age, -ment, -isme) and Silent Plural Markers (-s, -x, -aux)",
                                "Definite Articles (le, la, l', les) for General Categories vs. Partitives (du, de la, de l', des) for Uncountable Quantities",
                                "The De-Reduction Law: Negation (Je n'ai pas de temps), Quantities (beaucoup de), and Plural Pre-Nominal Adjectives (de bons amis)",
                                "Adjective Placement & Agreement: Post-Nominal Default vs. Pre-Nominal BAGS Adjectives (beau/bel, nouveau/nouvel, vieux/vieil)",
                            ],
                        },
                        {
                            "id": "present_verbs_interrogation",
                            "title": "Present Indicative: Être, Avoir, Aller, Faire, Three Verb Groups & Questions",
                            "summary": "-er, -ir (-iss-), and -re paradigms, stem-changing -er verbs, and three registers of question formation.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Être, Avoir, Aller, Faire and Idiomatic Avoir Expressions (avoir besoin de, avoir envie de, avoir l'air, avoir lieu)",
                                "First Group (-ER) Orthographic/Phonetic Stem Shifts (acheter → achète, appeler → appelle, préférer → préfère)",
                                "Second Group (-IR / -issons) vs. Two-Stem and Three-Stem Third Group Verbs (partir, prendre, venir, voir, pouvoir, vouloir, devoir, savoir)",
                                "Three Registers of Interrogation: Rising Intonation, Est-ce que, and Formal Subject-Clitic Inversion (Parlez-vous / A-t-il)",
                            ],
                        },
                        {
                            "id": "time_reflexives_futur_proche",
                            "title": "Pronominal Verbs, Futur Proche, Passé Récent & Temporal Prepositions",
                            "summary": "Se lever / s'appeler, aller + infinitive, venir de + infinitive, and depuis / pendant / il y a.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Pronominal Verbs (se réveiller, se souvenir de, s'intéresser à, se passer) in Affirmative and Negative",
                                "Periphrastic Time Frames: Futur Proche (Je vais faire), Passé Récent (Je viens de faire), and Ongoing Action (être en train de)",
                                "Temporal Prepositions: Depuis (Ongoing Since/For), Pendant, Pour, En (Time Required) vs. Dans (Time Until)",
                                "C'est vs. Il est: Identifying Noun Phrases vs. Describing with Adjectives/Professions",
                            ],
                        },
                        {
                            "id": "paris_bistro_immersion",
                            "title": "A1 Parisian Immersion: Boulangerie, Brasserie, Métro & Salon",
                            "summary": "Politeness codes ('Bonjour Monsieur/Madame' first!), ordering, and social register.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "The Golden Rule of French Pragmatics: Why 'Bonjour' Must Precede Every Interaction",
                                "Tutoiement vs. Vouvoiement and Polite Conditional Requests (Je voudrais / Auriez-vous)",
                                "At the Boulangerie, Fromagerie & Bistro: Menus, Courses, and Culinary Precision",
                                "Navigating Paris: Arrondissements, RATP Métro, TGV, and Cultural Institutions",
                            ],
                        },
                    ],
                },
                {
                    "id": "fra_102",
                    "code": "FRA 102",
                    "title": "Passé Composé, Imparfait, Double Clitics (Y & En) & Spoken French (A2)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": ["fra_101"],
                    "description": (
                        "Master past narrative aspect (Passé Composé vs. Imparfait vs. Plus-que-parfait), "
                        "the strict ordering of double object pronouns with y and en, relative pronouns "
                        "(qui, que, dont, où), and authentic spoken Parisian phonetic reductions."
                    ),
                    "modules": [
                        {
                            "id": "passe_compose_accord",
                            "title": "Passé Composé: Avoir vs. Être (DR & MRS VANDERTRAMP) & Participle Agreement",
                            "summary": "Past participle morphology, auxiliary switching for transitive motion verbs, and preceding-direct-object agreement.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Past Participles (-é, -i, -u) and Irregular Families (-is: pris/mis, -it: dit/écrit, -ert: ouvert/offert, eu, été, fait, vu, su, pu, dû, voulu, plu, vécu)",
                                "The 17 Intransitive Être Verbs and How They Switch to Avoir with a Direct Object ('Je suis sorti' vs. 'J'ai sorti la valise')",
                                "Participle Agreement with Avoir When the Direct Object Precedes the Verb ('La lettre que j'ai écrite')",
                                "Agreement Subtleties in Pronominal Verbs: 'Elle s'est lavée' vs. 'Elle s'est lavé les mains' (Indirect Reflexive!)",
                            ],
                        },
                        {
                            "id": "imparfait_plus_que_parfait",
                            "title": "Imparfait vs. Passé Composé & Plus-que-parfait Narrative Architecture",
                            "summary": "Nous-stem formation, aspectual framing, and anterior past flashbacks.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Imparfait Formation from the 1st Plural Present Stem (-ais, -ais, -ait, -ions, -iez, -aient) and the Single Irregular Stem (ét-)",
                                "Narrative Aspect: Imparfait (Decor, Habit, Ongoing State) vs. Passé Composé (Bounded Event, Sudden Change)",
                                "Plus-que-parfait (avais/étais + Participle) for Anterior Cause and Backstory",
                                "Reported Speech in the Past (Concordance des Temps: Présent → Imparfait, Passé Composé → Plus-que-parfait, Futur → Conditionnel)",
                            ],
                        },
                        {
                            "id": "double_pronouns_y_en",
                            "title": "The French Clitic Flag: Direct, Indirect, Y, En & Double Pronoun Order",
                            "summary": "Replacing prepositional phrases with à (y) and de (en) and ordering pre-verbal clitic clusters.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Direct (me, te, le/la, nous, vous, les) vs. Indirect (me, te, lui, nous, vous, leur) Object Pronouns and Disjunctive Stress Pronouns (moi, toi, lui, elle, eux)",
                                "The Pronoun Y: Replacing Locations and Inanimate Phrases with À ('J'y pense', 'Vas-y!')",
                                "The Pronoun EN: Replacing De + Noun, Partitives, Quantities ('J'en ai trois'), and Idioms ('Je m'en vais', 'Ne t'en fais pas')",
                                "The 5-Column Clitic Ordering Matrix (me/te/se/nous/vous → le/la/les → lui/leur → y → en) and Affirmative Imperative Inversion (Donne-le-moi!)",
                            ],
                        },
                        {
                            "id": "relatives_qui_que_dont_ou",
                            "title": "Relative Clauses (Qui, Que, Dont, Où, Lequel) & Futur / Conditionnel",
                            "summary": "Syntactic role mapping for relative pronouns (especially de-governed dont) and future/conditional stems.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Qui (Subject) vs. Que/Qu' (Direct Object) vs. Où (Place/Time)",
                                "Mastering DONT: Replacing Any Phrase Governed by De (avoir besoin de, parler de, être fier de, Possession) and Ce qui / Ce que / Ce dont",
                                "Preposition + Lequel/Laquelle/Lesquels/Lesquelles and Contractions (auquel, duquel)",
                                "Futur Simple, Futur Antérieur (après que / dès que / quand + Futur!), and Conditionnel Présent/Passé",
                            ],
                        },
                        {
                            "id": "francais_parle_verlan",
                            "title": "Authentic Spoken French: Ne-Drop, Tu→T', Glides & Contemporary Registers",
                            "summary": "Understanding fast native speech while knowing when to deploy formal register.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Fast Spoken French Acoustics: Dropping 'ne', 'Tu as' → 'T'as', 'Il y a' → 'Y a', 'Je ne sais pas' → 'Chais pas'",
                                "Left and Right Dislocation (Cadrage thématique): 'Moi, mon frère, je lui ai parlé hier'",
                                "Lexical Registers: Soutenu (ouvrage, demeurer) vs. Courant (livre, habiter) vs. Familier (bouquin, crécher)",
                                "Listening & Speaking Lab: Decoding Native Parisian Speed Without Losing Precision",
                            ],
                        },
                    ],
                },
                {
                    "id": "fra_201",
                    "code": "FRA 201",
                    "title": "Le Subjonctif, Passé Simple & Argumentative Connectors (B1)",
                    "level": 200,
                    "credits": 4,
                    "prerequisites": ["fra_102"],
                    "description": (
                        "Master the French subjunctive (présent and passé), avoiding the subjunctive "
                        "via infinitive transformations, recognizing the literary Passé Simple, and "
                        "wielding logical connectors (articulateurs logiques) for structured debate."
                    ),
                    "modules": [
                        {
                            "id": "subjonctif_architecture",
                            "title": "Le Subjonctif Présent & Passé: Triggers, Irregular Stems & Nuances",
                            "summary": "Volition, necessity, emotion, doubt, superlatives, and subordinating conjunctions.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Two-Stem Subjunctive Formation (ils-stem vs. nous-stem) and the 10 Core Irregulars (sois, aie, fasse, aille, puisse, sache, veuille, vaille, faille, pleuve)",
                                "Triggers of Necessity, Will, and Emotion vs. Indicative of Certainty (Je pense qu'il vient vs. Je ne pense pas qu'il vienne)",
                                "Conjunctions Taking the Subjunctive (bien que, quoique, pour que, avant que + ne explétif, à moins que, sans que, jusqu'à ce que)",
                                "Subjonctif after Superlatives, 'Le seul / Le premier qui...', and Indefinite Antecedents ('Je cherche quelqu'un qui sache...')",
                                "Mandatory Infinitive Substitution When Main and Subordinate Subjects Match (avant de partir, pour réussir)",
                            ],
                        },
                        {
                            "id": "hypotheses_si_clauses",
                            "title": "Hypothetical Systems (Si-Clauses) & Alternative Conditional Frames",
                            "summary": "The three canonical si-clauses plus au cas où, à condition que, and quand bien même.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Les Trois Systèmes Hypothétiques: Si + Présent → Futur, Si + Imparfait → Conditionnel Présent, Si + Plus-que-parfait → Conditionnel Passé",
                                "Remembering the Golden Prohibition: *Si ne mange jamais de -R-* (Never Futur or Conditionnel directly after Si!)",
                                "Alternative Conditional Frames: Au cas où + Conditionnel, Quand bien même + Conditionnel, À condition que + Subjonctif",
                                "Gérondif (en faisant) vs. Participe Présent (faisant — invariable!) vs. Verbal Adjective (convaincant/convaincante)",
                            ],
                        },
                        {
                            "id": "passe_simple_litt",
                            "title": "Le Passé Simple, Passé Antérieur & Literary Inversion",
                            "summary": "Reading classic and modern French novels effortlessly by mastering literary narrative tenses.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Passé Simple Morphology: -ai/-a/-èrent, -is/-it/-irent, -us/-ut/-urent, and -ins/-int/-inrent (venir/tenir)",
                                "High-Frequency Literary Forms: fut, eut, fit, dit, vit, prit, mit, sut, put, dut, voulut, naquit, vécut, mourut",
                                "Passé Antérieur (eut/fut + Participle) after Dès que / À peine...que",
                                "Ne...que (Restrictive 'Only'), Ne...aucun/guère/point, and Literary Negation Without Pas (Je ne sais, Je ne peux)",
                            ],
                        },
                        {
                            "id": "articulateurs_logiques",
                            "title": "Les Articulateurs Logiques: Concession, Cause, Consequence & Synthesis",
                            "summary": "Precision discourse markers that drive French academic, scientific, and journalistic prose.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Causal Nuances: Parce que vs. Puisque (Known Cause) vs. Comme (Clause-Initial) vs. Étant donné que / Vu que / Faute de",
                                "Concessive & Adversative Architecture: Certes...mais, Or (Minor Premise in Syllogism!), Néanmoins, Toutefois, En revanche, Force est de constater que",
                                "Consequence & Purpose: De sorte que (+ Ind. vs. + Subj.!), Si bien que, D'où, Par conséquent",
                                "B1 Debate Simulation: Defending a Thesis Against Counterarguments",
                            ],
                        },
                    ],
                },
                {
                    "id": "fra_301",
                    "code": "FRA 301",
                    "title": "French for Mathematics, Physics, AI & Enlightenment Philosophy (B2)",
                    "level": 300,
                    "credits": 4,
                    "prerequisites": ["fra_201"],
                    "description": (
                        "Read the French mathematical and philosophical tradition in the original: "
                        "Descartes, Pascal, Laplace, Fourier, Galois, Poincaré, Bourbaki, and modern "
                        "French AI/robotics research."
                    ),
                    "modules": [
                        {
                            "id": "descartes_pascal",
                            "title": "Descartes & Pascal: Methodological Doubt, Geometry & Probability",
                            "summary": "Discours de la méthode, Méditations, and Pascal's Pensées (esprit de géométrie vs. esprit de finesse).",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "René Descartes' Discours de la méthode (1637): Why Clear and Distinct Ideas Shaped Modern French Syntax",
                                "Close Reading of the Four Precepts of Method and 'Je pense, donc je suis'",
                                "Blaise Pascal's Pensées: 'L'esprit de géométrie et l'esprit de finesse', the Wager (Le Pari), and the Thinking Reed ('Un roseau pensant')",
                                "Classical 17th-Century Moralistes: La Rochefoucauld's Maximes and La Bruyère's Caractères",
                            ],
                        },
                        {
                            "id": "french_mathematics_physics",
                            "title": "The French Mathematical School: Lagrange, Laplace, Fourier, Galois, Poincaré & Bourbaki",
                            "summary": "Mathematical proof idioms in French and reading landmark French scientific texts.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "French Mathematical Proof Idioms: Soit X un espace..., Il existe un unique..., À condition nécessaire et suffisante, C.Q.F.D.",
                                "Laplace's Essai philosophique sur les probabilités (Laplace's Demon in the Original French!)",
                                "Henri Poincaré's La Science et l'Hypothèse: Non-Euclidean Geometry, Conventionalism, and Dynamical Systems",
                                "Nicolas Bourbaki's Structuralist Prose: Injective/Surjective/Bijective and Abstract Algebra Terminology",
                            ],
                        },
                        {
                            "id": "lumieres_montesquieu_rousseau",
                            "title": "Le Siècle des Lumières: Montesquieu, Voltaire, Diderot & Rousseau",
                            "summary": "Irony, encyclopedic taxonomy, separation of powers, and the social contract.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Montesquieu's De l'esprit des lois & Lettres persanes: Institutional Equilibrium and Perspectival Satire",
                                "Voltaire's Candide & Dictionnaire philosophique: The Mechanics of French Irony, Antiphrasis, and Litotes",
                                "Diderot & d'Alembert's Encyclopédie and Rousseau's Du contrat social",
                                "Analyzing Enlightenment Rhetoric and Epigrammatic Compression",
                            ],
                        },
                        {
                            "id": "french_ai_engineering",
                            "title": "Contemporary French Science, AI (IA), Aerospace & Robotics Discourse",
                            "summary": "Technical vocabulary and research communication in modern Francophone STEM.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "French AI & Computer Science Terminology: Apprentissage profond, Réseaux de neurones, Descente de gradient, Traitement automatique des langues (TAL)",
                                "Robotics, Control & Aerospace Lexicon: Asservissement, Cinématique inverse, Capteurs, Actionneurs",
                                "Reading CNRS / INRIA / Polytechnique Technical Briefs and Papers",
                                "Presenting a Technical Research Talk in Formal Academic French",
                            ],
                        },
                    ],
                },
                {
                    "id": "fra_401",
                    "code": "FRA 401",
                    "title": "20th-Century French Philosophy, Literature & Geopolitics (C1)",
                    "level": 400,
                    "credits": 4,
                    "prerequisites": ["fra_301"],
                    "description": (
                        "Engage with Bergson, Sartre, Beauvoir, Camus, Merleau-Ponty, Lévi-Strauss, "
                        "and Foucault alongside Baudelaire, Proust, and international diplomatic French."
                    ),
                    "modules": [
                        {
                            "id": "existentialisme_phenomenologie",
                            "title": "Bergson, Sartre, Simone de Beauvoir, Camus & Merleau-Ponty",
                            "summary": "Durée, en-soi vs. pour-soi, mauvaise foi, l'absurde, and embodied perception.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Henri Bergson: La Durée (Lived Time) vs. Spatialized Clock Time and Intuition",
                                "Jean-Paul Sartre's L'Être et le Néant: En-soi, Pour-soi, Facticité, Transcendance, and Mauvaise Foi",
                                "Simone de Beauvoir's Le Deuxième Sexe & Ethics of Ambiguity; Albert Camus's Le Mythe de Sisyphe",
                                "Maurice Merleau-Ponty's Phénoménologie de la perception: Le Corps propre and Chiasm",
                            ],
                        },
                        {
                            "id": "structuralisme_foucault",
                            "title": "Saussure, Lévi-Strauss, Barthes, Foucault & Deleuze",
                            "summary": "Signifiant/signifié, episteme, genealogies of power-knowledge, and conceptual synthesis.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "Ferdinand de Saussure's Cours de linguistique générale: Langue vs. Parole, Signifiant vs. Signifié, and Differential Value",
                                "Claude Lévi-Strauss & Roland Barthes (Mythologies): Structuralist Analysis of Culture",
                                "Michel Foucault's Les Mots et les Choses & Surveiller et punir: Épistémè, Dispositif, and Biopouvoir",
                                "Gilles Deleuze: Différence et répétition and the Philosophy of Creating Concepts",
                            ],
                        },
                        {
                            "id": "baudelaire_proust_poetics",
                            "title": "Baudelaire, Rimbaud, Mallarmé & Marcel Proust's Hypotactic Time",
                            "summary": "The Alexandrin (12-syllable line), Symbolist acoustics, and Proust's involuntary memory.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "The Classical Alexandrin (6+6 Hemistichs with Hémistiche/Césure) from Racine to Baudelaire's Les Fleurs du mal",
                                "Rimbaud's 'Le Bateau ivre' and Mallarmé's 'Un coup de dés jamais n'abolira le hasard'",
                                "Marcel Proust's Du côté de chez Swann: Unpacking the Architecture of a 150-Word Proustian Sentence",
                                "Albert Camus's L'Étranger vs. Proust: How Passé Composé vs. Imparfait Reshapes Metaphysics",
                            ],
                        },
                        {
                            "id": "diplomatie_francophonie",
                            "title": "Diplomatic French, International Law & Global Francophonie",
                            "summary": "Why French remains a premier language of treaties, the UN, ICJ, and global diplomacy.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "The Precision of Legal and Diplomatic French: Treaty Clauses, Recitals (Considérant que...), and Protocol",
                                "Geopolitical Discourse Across the Francophone World (Europe, Québec, West & North Africa, Switzerland)",
                                "Drafting a Diplomatic Note Verbale and Policy Synthesis (Note de synthèse)",
                                "High-Stakes Multilateral Negotiation Simulation in C1 French",
                            ],
                        },
                    ],
                },
                {
                    "id": "fra_501",
                    "code": "FRA 501",
                    "title": "Graduate Seminar: La Dissertation, Explication de Texte & Le Grand Oral (C2)",
                    "level": 500,
                    "credits": 4,
                    "prerequisites": ["fra_401"],
                    "description": (
                        "Master the pinnacle of French intellectual training (École Normale / Sciences Po / "
                        "Agrégation style): constructing a problematic (problématique), the three-part "
                        "dialectical dissertation, line-by-line explication de texte, and le Grand Oral."
                    ),
                    "modules": [
                        {
                            "id": "art_de_la_problematique",
                            "title": "L'Art de la Problématique: Uncovering Paradox in Any Question",
                            "summary": "Moving beyond mere topic description to formulate a genuine conceptual tension.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "What Makes a True Problématique? Identifying the Hidden Presupposition and Internal Paradox of a Subject",
                                "Analyzing Terms Rigorously: Etymology, Polysemy, Antonyms, and Adjacent Distinctions",
                                "Accroche, Définition, Problématique, and Annonce du Plan: The Classic French Introduction",
                                "Workshop: Turning Five Classic Agrégation / Bac Prompts into Razor-Sharp Problématiques",
                            ],
                        },
                        {
                            "id": "plan_dialectique",
                            "title": "Le Plan Dialectique (Thèse, Antithèse, Dépassement) & Transitions",
                            "summary": "Why the third part is not a lukewarm compromise ('ni oui ni non') but a conceptual elevation.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Part I (L'Évidence Première / Thèse) and Part II (La Limite Critique / Antithèse)",
                                "Part III (Le Dépassement / Aufhebung): Reframing the Question at a Higher Level of Analysis",
                                "Crafting Seamless Transitions (Transitions charnières) Between Parts and Subparts",
                                "The Conclusion: Bilan Récapitulatif and Ouverture",
                            ],
                        },
                        {
                            "id": "explication_de_texte",
                            "title": "L'Explication de Texte & Commentaire Composé",
                            "summary": "Linear and thematic analysis showing how syntactic form and lexical choice generate philosophical or literary meaning.",
                            "sim": "tokenizer",
                            "lab": False,
                            "lessons": [
                                "Methodology of the Philosophical Explication de Texte: Thèse, Mouvements du Texte, and Enjeu",
                                "Literary Commentaire Composé: Connecting Stylistic Figures (Chiasme, Hypallage, Litote, Asyndète) to Meaning",
                                "Subjonctif Imparfait & Plus-que-parfait (qu'il fût, qu'il eût été) and High Literary Register Mastery",
                                "Guided Explication of a Passage by Montaigne, Pascal, or Foucault",
                            ],
                        },
                        {
                            "id": "grand_oral_c2",
                            "title": "Le Grand Oral: 10-Minute Structured Exposé & Jury Cross-Examination",
                            "summary": "Delivering an eloquent, timed oral synthesis and responding to rapid-fire critical questions.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Prosody of French Public Eloquence: Pauses, Contrastive Stress, and Rhetorical Triads",
                                "Handling Hostile or Paradoxical Jury Questions with Composure and Analytic Precision",
                                "Live Grand Oral Simulation with the Professor",
                                "Master's Capstone Dissertation & Oral Defense",
                            ],
                        },
                    ],
                },
            ],
        },

        # =====================================================================
        # 5. ARABIC (العربية — FUṢḤĀ & SPOKEN DIALECTS)
        # =====================================================================
        {
            "id": "arabic",
            "name": "Arabic (العربية — Fuṣḥā & Dialects)",
            "icon": "🌙",
            "description": (
                "An algebraic language of staggering beauty: the cursive Arabic Abjad script, "
                "pharyngeal and emphatic phonology, the non-concatenative triliteral root (jizr) "
                "and pattern (wazn) engine across Forms I–X, Modern Standard Arabic (Fuṣḥā), "
                "Levantine and Egyptian spoken dialects, and classical Golden Age philosophy, "
                "mathematics, and poetry."
            ),
            "courses": [
                {
                    "id": "ara_101",
                    "code": "ARA 101",
                    "title": "The Arabic Abjad Script, Emphatic Phonology & Nominal Clauses (A1)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": [],
                    "description": (
                        "Master the 28-letter cursive Arabic script across all four contextual shapes, "
                        "diacritical vowel marks (ḥarakāt), emphatic (velarized/pharyngealized) and "
                        "guttural consonants, Sun vs. Moon letter assimilation, and verbless equational "
                        "sentences (al-jumla al-ismiyya)."
                    ),
                    "modules": [
                        {
                            "id": "abjad_script_connectors",
                            "title": "The 28-Letter Cursive Abjad: Contextual Shapes & Non-Connectors",
                            "summary": "Right-to-left geometry, isolated/initial/medial/final allographs, and the 6 non-connecting letters.",
                            "sim": "script_stroke_lab",
                            "lab": True,
                            "lessons": [
                                "How an Abjad Works: Consonants, Long Vowels (ā ا, ū و, ī ي), and Short Vowel Diacritics (Fatḥa َ , Kasra ِ , Ḍamma ُ , Sukūn ْ , Shadda ّ )",
                                "The Six Right-Only Connectors (ا د ذ ر ز و) and the Bāʾ/Tāʾ/Thāʾ/Nūn/Yāʾ Boat-Shape Family",
                                "The Jīm/Ḥāʾ/Khāʾ (ج ح خ), Sīn/Shīn (س ش), and Ṣād/Ḍād/Ṭāʾ/Ẓāʾ (ص ض ط ظ) Families",
                                "Medial/Final Shape Transformations of ʿAyn/Ghayn (ع غ), Fāʾ/Qāf (ف ق), Kāf (ك), Lām-Alif (لا), Mīm (م), and Hāʾ (ه)",
                                "Tāʾ Marbūṭa (ة), Alif Maqṣūra (ى), and the Orthography of Hamza (ء أ إ ؤ ئ)",
                            ],
                        },
                        {
                            "id": "arabic_phonology",
                            "title": "Emphatic (Mufakhkhama), Pharyngeal & Uvular Phonology",
                            "summary": "Distinguishing plain vs. emphatic coronal pairs and throat articulations (ʿayn, ḥāʾ, qāf, ghayn, khāʾ).",
                            "sim": "script_stroke_lab",
                            "lab": False,
                            "lessons": [
                                "The Four Emphatic (Pharyngealized) Pairs: س/ص (s/ṣ), د/ض (d/ḍ), ت/ط (t/ṭ), and ذ/ظ (dh/ẓ) + How Emphatics Lower Adjacent Vowels",
                                "Pharyngeal Articulation: Voiceless Ḥāʾ (ح [ħ]) vs. Glottal Hāʾ (ه [h]) and Voiced ʿAyn (ع [ʕ]) vs. Glottal Stop Hamza (ء [ʔ])",
                                "Uvulars: Voiceless Stop Qāf (ق [q]) vs. Velar Kāf (ك [k]), Voiceless Fricative Khāʾ (خ [χ]), and Voiced Ghayn (غ [ʁ])",
                                "The Definite Article Al- (الـ): Moon Letters (Qamariyya) vs. Sun Letters (Shamsiyya) Assimilation",
                                "Syllable Weight (CV, CVV, CVC) and Deterministic Word-Stress Rules in Arabic",
                            ],
                        },
                        {
                            "id": "jumla_ismiyya",
                            "title": "Al-Jumla al-Ismiyya (The Equational Sentence), Gender & Definiteness",
                            "summary": "Why Arabic has no present-tense copula ('to be') and how definiteness mismatch creates a predication boundary.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Definite Subject (Mubtadaʾ) + Indefinite Predicate (Khabar): 'Al-baytu kabīrun' (The house [is] big) vs. 'Al-baytu al-kabīru' (The big house)",
                                "Masculine vs. Feminine Gender (Tāʾ Marbūṭa ة), Independent Pronouns (anā, anta, anti, huwa, hiya, naḥnu, hum), and Attached Possessive Suffixes (-ī, -ka, -ki, -hu, -hā, -nā, -hum)",
                                "Prepositional Predicates (fī, ʿalā, min, ilā, maʿa, ʿinda, li-) and Fronted Existential Predicates ('Fī al-bayti kitābun' = There is a book in the house)",
                                "Negating the Nominal Sentence with Laysa (ليس) and Interrogatives (Hal هل, A- أ, Mā/Mādhā, Man, Ayna, Kayfa, Matā)",
                            ],
                        },
                        {
                            "id": "idafa_plurals_intro",
                            "title": "Al-Iḍāfa (The Construct State), Dual (-āni) & Sound Plurals",
                            "summary": "Encoding possession and specification by juxtaposing nouns without an article on the first term.",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "The Geometry of Al-Iḍāfa (الإضافة): Why the First Term (Muḍāf) Never Takes Al- or Tanwīn while the Last Term Determines Definiteness",
                                "Adjectives Modifying an Iḍāfa: Why the Adjective Must Follow the Entire Construct Chain",
                                "The Grammatical Dual (-āni / -ayni) and Sound Masculine (-ūna / -īna) vs. Sound Feminine (-āt) Plurals",
                                "The Non-Human Plural Agreement Rule: Why Plural Inanimate Nouns Trigger Feminine Singular Adjectives and Verbs!",
                            ],
                        },
                        {
                            "id": "greetings_hospitality_ara",
                            "title": "A1 Conversational Immersion: Hospitality, Café & Polite Blessings",
                            "summary": "The rich pragmatic echo-system of Arabic greetings, responses, and social etiquette.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "The Symmetry of Arabic Greetings and Root-Echo Responses (As-salāmu ʿalaykum / Ṣabāḥ al-khayr → Ṣabāḥ an-nūr / Ahlan wa sahlan → Ahlan bik)",
                                "Polite Formulaic Phrases: In shāʾa llāh, Mā shāʾa llāh, Tasharrafnā, Naʿīman, and Yā salām",
                                "Introducing Yourself, Family, Nationalities (Nisba Adjectives in -ī / -iyya), and Academic Fields",
                                "Ordering Arabic Coffee (Qahwa), Mint Tea, and Mezze in a Café",
                            ],
                        },
                    ],
                },
                {
                    "id": "ara_102",
                    "code": "ARA 102",
                    "title": "The Triliteral Root Engine (Jizr), Verb Forms I–X & Broken Plurals (A2)",
                    "level": 100,
                    "credits": 4,
                    "prerequisites": ["ara_101"],
                    "description": (
                        "Unlock the mathematical heart of Semitic linguistics: non-concatenative "
                        "morphology, how three consonant radicals (C₁-C₂-C₃) interleave with vowel "
                        "templates (awzān) across Verb Forms I–X, active/passive participles, verbal "
                        "nouns (maṣdar), and broken plural patterns."
                    ),
                    "modules": [
                        {
                            "id": "jizr_wazn_calculus",
                            "title": "The Algebra of Triliteral Roots (Jizr جذر) & Templates (Wazn وزن)",
                            "summary": "Using the canonical F-ʿ-L (ف-ع-ل) meta-template to generate entire word families from three consonants.",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "How Non-Concatenative Morphology Works: Consonantal Root (Semantic Core) × Vocalic/Affixal Template (Grammatical Role)",
                                "The F-ʿ-L (فعل) Meta-Notation: Mapping k-t-b (كتب write), d-r-s (درس study), ʿ-l-m (علم know), and ḥ-s-b (حسب compute)",
                                "Nominal Templates Derived from Form I: Active Participle Fāʿil (كاتب kātib), Passive Participle Mafʿūl (مكتوب maktūb), and Place/Instrument Mafʿal/Mafʿala (مكتب maktab / مكتبة maktaba)",
                                "Using a Root-Based Arabic Dictionary (Hans Wehr / Lisān al-ʿArab): Stripping Prefixes, Infixes, and Suffixes to Find C₁-C₂-C₃",
                            ],
                        },
                        {
                            "id": "madi_mudari_conjugation",
                            "title": "Form I Past (Al-Māḍī الماضي) & Present/Imperfect (Al-Muḍāriʿ المضارع)",
                            "summary": "Suffix conjugation (māḍī) vs. prefix-suffix conjugation (muḍāriʿ), future (sa-/sawfa), and negation (mā, lā, lam, lan).",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "Al-Māḍī (Perfect/Past Suffix Conjugation: kataba, katabat, katabta, katabti, katabtu...) and Stem Vowel Classes (faʿala, faʿila, faʿula)",
                                "Al-Muḍāriʿ (Imperfect Prefix-Suffix Conjugation: yaktubu, taktubu, aktubu, naktubu...) and Future Markers Sa- (سـ) / Sawfa (سوف)",
                                "The Four-Way Negation Matrix: Lā + Muḍāriʿ (Present), Mā + Māḍī or Lam + Jussive (Past!), and Lan + Subjunctive (Future!)",
                                "Al-Jumla al-Fiʿliyya (Verb-First Word Order): Why Verb-Subject-Object Singularizes the Verb Even Before a Plural Noun!",
                            ],
                        },
                        {
                            "id": "awzan_forms_ii_to_x",
                            "title": "The Ten Derived Verb Forms (Al-Awzān الأوزان I–X)",
                            "summary": "Predictable semantic transformations (causative, associative, reflexive, reciprocal, estimative) across Forms II–X.",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "Form II Faʿʿala (فعّل — Causative/Intensive: ʿallama 'to teach', darrasa) & Form III Fāʿala (فاعل — Associative/Attemptive: shāraka 'to participate', sāfara)",
                                "Form IV Afʿala (أفعل — Causative: arsala 'to send', aʿlama 'to inform') & Form V Tafaʿʿala (تفعّل — Reflexive of II: taʿallama 'to learn', takallama)",
                                "Form VI Tafāʿala (تفاعل — Mutual/Reciprocal: taʿāwana 'to cooperate') & Form VII Infaʿala (انفعل — Medio-Passive: inkasara 'to shatter')",
                                "Form VIII Iftaʿala (افتعل — Reflexive/Middle with Infixed -t-: ijtamaʿa 'to meet', iḥtarama) and Assimilation of the Infix (izdaḥama, iṣṭalaḥa)",
                                "Form X Istafʿala (استفعل — Seeking/Estimating: istakhdama 'to use', istaqblala 'to welcome') and Predictable Participles (Mu-...-i-... vs. Mu-...-a-...) & Maṣdars across II–X",
                            ],
                        },
                        {
                            "id": "jam_taksir_broken_plurals",
                            "title": "Jamʿ at-Taksīr (Broken Plurals) & the Arabic Number System",
                            "summary": "Internal vowel templates for plurals (afʿāl, fuʿūl, fuʿalāʾ, mafāʿil, mafāʿīl) and polarity agreement in numbers.",
                            "sim": "semitic_root_weaver",
                            "lab": False,
                            "lessons": [
                                "High-Frequency Triliteral Broken Plural Templates: Afʿāl (أفعال — aqlām, awqāt), Fuʿūl (فعول — buyūt, ʿulūm), Fiʿāl (فعال), and Fuʿalāʾ (فعلاء — ʿulamāʾ)",
                                "Quadriliteral Broken Plurals: Mafāʿil (مفاعل — makātib, madāris) and Mafāʿīl (مفاعيل — mafātīḥ, mawāḍīʿ)",
                                "Gender Polarity (Chiastic Agreement) in Numbers 3–10 (+ Plural Genitive), 11–99 (+ Singular Accusative!), and 100+ (+ Singular Genitive)",
                                "Ordinal Numbers on the Fāʿil Template and Telling Time",
                            ],
                        },
                    ],
                },
                {
                    "id": "ara_201",
                    "code": "ARA 201",
                    "title": "Modern Standard Arabic (Fuṣḥā): Case Inflection (Iʿrāb), Weak Roots & Syntax (B1)",
                    "level": 200,
                    "credits": 4,
                    "prerequisites": ["ara_102"],
                    "description": (
                        "Master the grammatical case system (iʿrāb: marfūʿ, manṣūb, majrūr), verbal "
                        "moods (marfūʿ, manṣūb, majzūm), weak roots (hollow, defective, assimilated, "
                        "doubled), Kāna and Inna sisters, and relative clauses (alladhī vs. ṣifa)."
                    ),
                    "modules": [
                        {
                            "id": "irab_cases_moods",
                            "title": "Al-Iʿrāb (الإعراب): The Three Nominal Cases & Three Verbal Moods",
                            "summary": "Nominative (-u), Accusative (-a), and Genitive (-i) plus Indicative (-u), Subjunctive (-a), and Jussive (-0).",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "Nominal Cases: Marfūʿ (Nominative -u/-un for Subject/Predicate), Manṣūb (Accusative -a/-an for Direct Object & Adverbials), Majrūr (Genitive -i/-in after Prepositions & in Iḍāfa)",
                                "Diptotes (Al-Mamnūʿ min aṣ-Ṣarf): Why Broken Plurals like Madārisu Take No Tanwīn and Use -a in Indefinite Genitive",
                                "Kāna wa Akhawātuhā (كان وأخواتها: kāna, aṣbaḥa, zalla, mā zāla, laysa → Predicate in Manṣūb!) vs. Inna wa Akhawātuhā (إنّ وأخواتها: inna, anna, lākinna, li-anna → Subject in Manṣūb!)",
                                "Verbal Moods of the Muḍāriʿ: Indicative (Marfūʿ), Subjunctive (Manṣūb after an, li-, kay, lan, ḥattā), and Jussive (Majzūm after lam, lā an-nāhiya, li-)",
                            ],
                        },
                        {
                            "id": "weak_roots_mu_tall",
                            "title": "Weak & Irregular Roots: Hollow (Ajwaf), Defective (Nāqiṣ), Assimilated & Doubled",
                            "summary": "Predictable vowel contraction laws when wāw (و) or yāʾ (ي) occupies C₁, C₂, or C₃.",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "Assimilated Roots (Mithāl, C₁ = w: waṣala → yaṣilu, wajada → yajidu) and Geminate/Doubled Roots (Muḍaʿʿaf, C₂ = C₃: radda, aḥabba)",
                                "Hollow Roots (Ajwaf, C₂ = w/y: qāla/yaqūlu 'say', kāna/yakūnu 'be', sāra/yasīru 'walk', nāma/yanāmu 'sleep') and Shortening in Closed Syllables (qultu, lam yaqul!)",
                                "Defective Roots (Nāqiṣ, C₃ = w/y: daʿā/yadʿū, banā/yabnī, mashā, baqiya/yabqā) and Jussive Apocope",
                                "Active/Passive Participles and Maṣdars of Hollow and Defective Roots across Forms I–X",
                            ],
                        },
                        {
                            "id": "relative_hal_tamyiz",
                            "title": "Relative Clauses (Ṣila vs. Ṣifa), Ḥāl (Circumstantial) & Tamyīz / Mafʿūl Muṭlaq",
                            "summary": "Definite vs. indefinite relative clauses, return pronouns (ʿāʾid), and adverbial accusatives.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "The Golden Rule of Arabic Relative Clauses: Alladhī/Allatī Only After a Definite Antecedent vs. Zero-Relative (Ṣifa) After an Indefinite Antecedent!",
                                "The Resumptive Pronoun (Al-ʿĀʾid العائد): Why 'The book that I read' Is 'The book which I read IT' (Al-kitābu alladhī qaraʾtuhu)",
                                "Al-Ḥāl (الحال): Circumstantial Accusative Clauses with Wāw al-Ḥāl ('Jāʾa wa-huwa yabtasimu')",
                                "Al-Mafʿūl al-Muṭlaq (Cognate Accusative for Emphasis), Al-Mafʿūl li-Ajlihi (Purpose), and At-Tamyīz (Accusative of Specification)",
                            ],
                        },
                        {
                            "id": "conditionals_passive_ara",
                            "title": "Conditional Sentences (Idhā, In, Law) & Internal Vocalic Passive (Al-Majhūl)",
                            "summary": "How Arabic forms the passive solely by changing internal vowels (kutiba / yuktabu) and structures real vs. counterfactual conditions.",
                            "sim": "semitic_root_weaver",
                            "lab": False,
                            "lessons": [
                                "The Internal Vocalic Passive (Al-Mabnī lil-Majhūl): Māḍī u-i-a (كُتِبَ kutiba) and Muḍāriʿ u-a-u (يُكْتَبُ yuktabu) + Tamma + Maṣdar in Modern Media",
                                "Real & Likely Conditionals with Idhā (إذا + Māḍī with Future Meaning!) and In (إنْ + Double Jussive)",
                                "Counterfactual Conditionals with Law (لَوْ ... لَـ: 'Law ʿalimtu dhālika la-faʿaltuhu')",
                                "Exceptive Constructions with Illā (إلّا), Ghayr (غير), and Siwā (سوى)",
                            ],
                        },
                    ],
                },
                {
                    "id": "ara_301",
                    "code": "ARA 301",
                    "title": "Spoken Arabic Diglossia Bridge: Levantine (Shāmī) & Egyptian (Maṣrī) (B2)",
                    "level": 300,
                    "credits": 4,
                    "prerequisites": ["ara_201"],
                    "description": (
                        "Master Arabic diglossia (Fuṣḥā vs. ʿĀmmiyya): how educated native speakers "
                        "blend Modern Standard Arabic with Levantine (Beirut, Damascus, Amman, Jerusalem) "
                        "and Egyptian (Cairo) spoken dialects in daily life, negotiations, and culture."
                    ),
                    "modules": [
                        {
                            "id": "diglossia_architecture",
                            "title": "The Architecture of Arabic Diglossia & Educated Spoken Arabic (Al-Lugha al-Wusṭā)",
                            "summary": "Systematic phonological, morphological, and lexical correspondences between Fuṣḥā and spoken dialects.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Charles Ferguson's Diglossia Model Updated: The Continuum from Classical Fuṣḥā to Educated Spoken Arabic (ESA) to Street ʿĀmmiyya",
                                "Regular Sound Correspondences: How Qāf (ق) Becomes Glottal [ʔ] in Urban Cairo/Beirut/Damascus, [g] in Cairo/Upper Egypt, or [q] in Formal Words",
                                "Interdental Shifts (ث → t/s, ذ → d/z, ظ → ḍ/z) and Diphthong Monophthongization (ay → ē, aw → ō)",
                                "How Dialects Simplify Case Endings and Duals While Preserving the Entire Triliteral Root & Form I–X Engine",
                            ],
                        },
                        {
                            "id": "levantine_shami",
                            "title": "Levantine Arabic (Shāmī شامي): B-Prefix Present, Pseudo-Verbs & Conversational Flow",
                            "summary": "Spoken fluency in Lebanese, Syrian, Jordanian, and Palestinian Arabic.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "The Levantine B-Imperfect (baktub, btuktub, byuktub, mnuktub), Progressive ʿAm- (عم بكتب), and Future Rāḥ (رح)",
                                "Essential Levantine Pseudo-Verbs: Bidd- + Suffix ('biddī / biddak' = want), Fī ('there is / can'), and ʿInd- / Maʿ-",
                                "Levantine Interrogatives (Shū? Lēsh? Wēn? Kīf? Aymtā? Qaddēsh?), Relative Illī (اللي), and Genitive Tabaʿ (تبع)",
                                "Roleplay in Beirut, Damascus & Amman: Warmth, Humor, Invitations, and Conversational Pragmatics",
                            ],
                        },
                        {
                            "id": "egyptian_masri",
                            "title": "Egyptian Arabic (Maṣrī مصري): Bi-/Ḥa-Prefixes, Ma-...-sh Negation & Cairene Wit",
                            "summary": "Understanding the most widely recognized dialect across Arabic cinema, music, and comedy.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Cairene Phonology ([g] for ج, Stress Shift to Penultimate) and Bi-Present (baktib) vs. Ḥa-Future (ḥaktib)",
                                "Circumfix Negation Ma-...-sh (ما كتبتش ma-katabtish, مش mish/mush for Nominals & Participles)",
                                "Active Participles as Present/Resultative Verbs in Maṣrī (ānā ʿārif, inta rāyiḥ fēn?, ʿāyiz/ʿāwiza)",
                                "Cairene Post-Positioned Interrogatives ('Inta ʿamalt ēh?' / 'Rāyiḥ fēn?') and Iconic Egyptian Idioms",
                            ],
                        },
                        {
                            "id": "code_switching_gulf_maghreb",
                            "title": "Cross-Dialect Code-Switching, Gulf (Khalījī) & North African Overview",
                            "summary": "Navigating inter-Arab communication and switching seamlessly between Fuṣḥā and dialect.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Gulf Arabic (Khalījī) Hallmarks: [ch] for kāf, [y] for jīm, Aby/Abghī ('want'), and Shlōnak?",
                                "Understanding Maghrebi (Moroccan/Algerian/Tunisian) Syllable Compression and Kā-/Tā- Present",
                                "Pragmatic Code-Switching: How Diplomats, Academics, and Executives Modulate Between Fuṣḥā and Dialect",
                                "Live Multi-Dialect Listening & Response Simulation",
                            ],
                        },
                    ],
                },
                {
                    "id": "ara_401",
                    "code": "ARA 401",
                    "title": "Arabic Media, Geopolitics, Economics & Golden Age Scientific Texts (C1)",
                    "level": 400,
                    "credits": 4,
                    "prerequisites": ["ara_301"],
                    "description": (
                        "Master high-register Fuṣḥā in international broadcasting (Al Jazeera / Asharq), "
                        "geopolitical and macroeconomic discourse, and original Arabic scientific and "
                        "philosophical prose from Al-Khwārizmī (Algebra), Ibn al-Haytham (Optics), "
                        "Ibn Sīnā, Ibn Rushd, and Ibn Khaldūn."
                    ),
                    "modules": [
                        {
                            "id": "media_diplomatic_fusha",
                            "title": "High-Register Media, Diplomatic & Macroeconomic Arabic",
                            "summary": "Journalistic verbal chains, nominalized maṣdar cascades, and diplomatic rhetoric.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "The Syntax of Arabic News Broadcasts: Clause-Initial Reporting Verbs (akkada, aʿlana, aʿraba ʿan, ashāra ilā anna...)",
                                "Diplomacy & International Law Lexicon: Sovereignty (as-siyāda), Negotiations (mufāwaḍāt), Treaties, and Geopolitical Strategy",
                                "Macroeconomics, Energy Markets, Sovereign Wealth Funds, and Technology Policy in Arabic",
                                "Delivering a Live Television-Style Geopolitical Briefing in Fully Vocalized Fuṣḥā",
                            ],
                        },
                        {
                            "id": "alkhwarizmi_ibn_alhaytham",
                            "title": "The Arabic Scientific Revolution: Al-Khwārizmī, Al-Kindī & Ibn al-Haytham",
                            "summary": "Read the birth of algebra (al-jabr wa-l-muqābala), algorithms, cryptanalysis, and experimental optics in original Arabic.",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "Al-Khwārizmī's Kitāb al-Mukhtaṣar fī Ḥisāb al-Jabr wa-l-Muqābala: Why j-b-r (جبر restoration) Gave the World Algebra",
                                "Al-Kindī's Manuscript on Deciphering Cryptographic Messages (Risāla fī Istikhrāj al-Muʿammā): The Invention of Frequency Analysis!",
                                "Ibn al-Haytham (Alhazen)'s Kitāb al-Manāẓir (Book of Optics): Iʿtibār (Controlled Experiment) and Hypothesis Testing",
                                "How Arabic Forged Technical Scientific Vocabulary via Form II/IV/X Maṣdars and Nisba Abstract Nouns (-iyya)",
                            ],
                        },
                        {
                            "id": "falsafa_ibn_sina_ibn_rushd",
                            "title": "Classical Falsafa: Al-Fārābī, Ibn Sīnā (Avicenna), Al-Ghazālī & Ibn Rushd (Averroes)",
                            "summary": "Wājib al-wujūd (Necessary Existence), the Floating Man thought experiment, and the Tahāfut debate.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Ibn Sīnā's 'Floating Man' (Ar-Rajul al-Muʿallaq الرجل المعلّق): Self-Awareness Prior to Sensory Input (Compare Descartes' Cogito 600 Years Later!)",
                                "Essence (Māhiyya ماهية) vs. Existence (Wujūd وجود) and Contingent vs. Necessary Being (Wājib al-Wujūd)",
                                "Al-Ghazālī's Tahāfut al-Falāsifa (Incoherence of the Philosophers) and Causality Critique (Compare Hume!)",
                                "Ibn Rushd's Tahāfut at-Tahāfut and Faṣl al-Maqāl: Demonstrative Reason (Burhān) and Truth",
                            ],
                        },
                        {
                            "id": "ibn_khaldun_muqaddima",
                            "title": "Ibn Khaldūn's Muqaddima (المقدّمة): ʿUmrān, ʿAṣabiyya & Philosophy of History",
                            "summary": "Reading the 14th-century founder of sociology, institutional economics, and cyclical state theory.",
                            "sim": "semitic_root_weaver",
                            "lab": False,
                            "lessons": [
                                "ʿIlm al-ʿUmrān (The Science of Civilization) and Historical Source Criticism in the Prolegomena",
                                "Al-ʿAṣabiyya (العصبية — Social Cohesion / Group Solidarity) and the Four-Generation Cycle of Dynasties",
                                "Ibn Khaldūn on Division of Labor, Supply/Demand, and the Laffer-Curve Effect of Taxation ('In the early stage of a dynasty, taxes are light and revenue is large...')",
                                "C1 Seminar Paper: Analyzing an Original Passage from the Muqaddima",
                            ],
                        },
                    ],
                },
                {
                    "id": "ara_501",
                    "code": "ARA 501",
                    "title": "Graduate Seminar: Classical Naḥw, Balāgha (Rhetoric), Classical Poetry & Modern Literature (C2)",
                    "level": 500,
                    "credits": 4,
                    "prerequisites": ["ara_401"],
                    "description": (
                        "Reach C2 mastery through the indigenous Arabic grammatical tradition (Sībawayh's "
                        "Naḥw and Ṣarf), the three sciences of classical rhetoric (ʿIlm al-Balāgha: "
                        "Bayān, Maʿānī, Badīʿ), classical Qaṣīda poetry (Al-Mutanabbī, Al-Maʿarrī), "
                        "and modern literary titans (Naguib Mahfouz, Taha Hussein, Mahmoud Darwish)."
                    ),
                    "modules": [
                        {
                            "id": "classical_nahw_sarf",
                            "title": "The Indigenous Arabic Grammatical Tradition: Sībawayh, Naḥw (نحو) & Ṣarf (صرف)",
                            "summary": "Understanding Arabic through its own formal operator-governance theory (ʿāmil / maʿmūl).",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "Sībawayh's Al-Kitāb and the Theory of Syntactic Governance (Al-ʿĀmil العامل): Why Every Case Ending Has a Formal Operator",
                                "Complete Traditional Iʿrāb Parsing (Taḥlīl Naḥwī) of Complex Classical Sentences",
                                "Advanced Ṣarf (Morphophonology): Iʿlāl (Weak-Letter Mutation) and Ibdāl (Consonant Substitution) Laws",
                                "Reading Unvoweled Classical Manuscripts by Syntactic Reconstruction Alone",
                            ],
                        },
                        {
                            "id": "ilm_al_balagha",
                            "title": "ʿIlm al-Balāgha (علم البلاغة): Maʿānī, Bayān & Badīʿ",
                            "summary": "Pragmatic syntax (ʿIlm al-Maʿānī), figurative imagery (ʿIlm al-Bayān), and acoustic-semantic embellishments (ʿIlm al-Badīʿ).",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "ʿIlm al-Maʿānī (Pragmatics of Syntax): Taqdīm wa-Taʾkhīr (Fronting for Focus), Ḥadhf (Ellipsis), and Ījāz (Supreme Concision) vs. Iṭnāb",
                                "ʿIlm al-Bayān: Tashbīh (Simile), Istiʿāra (Metaphor), Majāz Mursal (Metonymy), and Kināya (Allusive Implication)",
                                "ʿIlm al-Badīʿ: Jinās (Root-Play Paronomasia), Ṭibāq (Antithesis), Muqābala, and Sajʿ (Rhymed Prose Cadence)",
                                "Al-Jāḥiẓ's Al-Bayān wa-t-Tabyīn and ʿAbd al-Qāhir al-Jurjānī's Theory of Naẓm (Syntactic Poetics)",
                            ],
                        },
                        {
                            "id": "classical_qasida_mutanabbi",
                            "title": "Al-Qaṣīda & Classical Arabic Poetics: Al-Muʿallaqāt, Al-Mutanabbī & Al-Maʿarrī",
                            "summary": "Al-Khalīl ibn Aḥmad's 16 quantitative meters (ʿIlm al-ʿArūḍ) and the masterpieces of Abbasid verse.",
                            "sim": "script_stroke_lab",
                            "lab": False,
                            "lessons": [
                                "ʿIlm al-ʿArūḍ (Prosody): How Al-Khalīl Used F-ʿ-L Pegs and Cords (Faʿūlun Mafāʿīlun...) to Map the 16 Classical Meters (Ṭawīl, Basīṭ, Kāmil, Wāfir)",
                                "Pre-Islamic Muʿallaqāt (Imruʾ al-Qays, Zuhayr, ʿAntara): The Tripartite Qaṣīda Structure",
                                "Al-Mutanabbī: Epigrammatic Grandeur ('Al-khaylu wa-l-laylu wa-l-baydāʾu taʿrifunī...')",
                                "Abū al-ʿAlāʾ al-Maʿarrī's Luzūmiyyāt and Risālat al-Ghufrān: Philosophical Skepticism in Double-Rhymed Verse",
                            ],
                        },
                        {
                            "id": "nahda_mahfouz_c2",
                            "title": "Modern Arabic Literature (An-Nahḍa to Present) & C2 Oratory Defense",
                            "summary": "Taha Hussein, Gibran, Naguib Mahfouz, Tayeb Salih, Mahmoud Darwish, and formal C2 address.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Taha Hussein's Al-Ayyām (الأيام): Musical Cadence and Critical Rationalism",
                                "Naguib Mahfouz (Awlād Ḥāratinā & The Cairo Trilogy) and Tayeb Salih's Mawsim al-Hijra ilā ash-Shamāl",
                                "Modern Arabic Poetry: Mahmoud Darwish, Nizar Qabbani, and Adonis",
                                "Master's Capstone: Delivering a C2 Classical & Modern Arabic Oratory Lecture (Khuṭba / Muḥāḍara)",
                            ],
                        },
                    ],
                },
            ],
        },

        # =====================================================================
        # 6. COMPARATIVE LINGUISTICS & POLYGLOT SCIENCE
        # =====================================================================
        {
            "id": "polyglot_science",
            "name": "Comparative Linguistics & Polyglot Science",
            "icon": "🧠",
            "description": (
                "Synthesize all five target languages into a unified cognitive framework: "
                "articulatory and acoustic phonetics (IPA), comparative Romance/Germanic/Sino-Tibetan/"
                "Afroasiatic typology, cognitive neuroscience of adult polyglottery, translation "
                "theory, and simultaneous multi-language code-switching."
            ),
            "courses": [
                {
                    "id": "lin_101",
                    "code": "LIN 101",
                    "title": "Articulatory & Acoustic Phonetics: Mastering the IPA Across Five Languages",
                    "level": 100,
                    "credits": 3,
                    "prerequisites": [],
                    "description": (
                        "Learn the International Phonetic Alphabet (IPA) as a physical vocal-tract "
                        "instrument so you can pronounce any phoneme in Mandarin, German, Italian, "
                        "French, or Arabic with native-grade precision."
                    ),
                    "modules": [
                        {
                            "id": "vocal_tract_consonants",
                            "title": "Place, Manner & Voicing across the Pulmonary Consonant Chart",
                            "summary": "From bilabial to pharyngeal and glottal places of articulation.",
                            "sim": "tone_pitch_trainer",
                            "lab": False,
                            "lessons": [
                                "Vocal Tract Anatomy: Labial, Dental, Alveolar, Post-Alveolar, Retroflex, Palatal, Velar, Uvular, Pharyngeal, Glottal",
                                "Voice Onset Time (VOT) Spectrum: French/Italian Pre-Voiced vs. Mandarin/English/German Aspirated Stops",
                                "Fricative & Affricate Precision: Mandarin j/q/x vs. zh/ch/sh, German [ç]/[χ], and Arabic [ħ]/[ʕ]/[ʁ]",
                                "Trills, Taps, and Approximants: Italian Apical [r] vs. French/German Uvular [ʁ] vs. Mandarin [ɻ]",
                            ],
                        },
                        {
                            "id": "vowel_trapezoid_formants",
                            "title": "The Vowel Trapezoid, Acoustic Formants (F1/F2/F3) & Nasalization",
                            "summary": "Tongue height (F1), backness (F2), lip rounding (F3), and nasal coupling.",
                            "sim": "tone_pitch_trainer",
                            "lab": True,
                            "lessons": [
                                "Cardinal Vowels and Formant Physics: How F1 Tracks Jaw/Tongue Openness and F2 Tracks Front-Back Position",
                                "Front Rounded Vowels Across Three Families: Mandarin ü [y], German ü/ö [y/ø/œ], and French u/eu [y/ø/œ]",
                                "French Nasal Vowels vs. Mandarin Nasal Finals (-n/-ng) vs. Italian Pure Oral Vowels",
                                "How Arabic Emphatic Consonants Shift Adjacent Vowel F2 Formants (Backing & Lowering)",
                            ],
                        },
                        {
                            "id": "prosody_tone_timing",
                            "title": "Suprasegmentals: Tone, Gemination, Stress-Timing vs. Syllable-Timing",
                            "summary": "Comparing Mandarin lexical pitch with Italian consonant length, French group rhythm, and German/Arabic stress.",
                            "sim": "tone_pitch_trainer",
                            "lab": True,
                            "lessons": [
                                "Lexical Tone (Mandarin F0 Contours) vs. Intonational Pitch Accents in European & Semitic Languages",
                                "Consonant & Vowel Quantity: Italian Geminate Consonants (Doppie) and Arabic Long/Short Vowel Minimal Pairs",
                                "Syllable-Timed (Italian, French) vs. Stress-Timed (German) vs. Mora/Weight-Sensitive (Arabic) Prosody",
                                "Accent Elimination Lab: Diagnosing and Correcting English-Native Interference in All Five Languages",
                            ],
                        },
                        {
                            "id": "writing_systems_typology",
                            "title": "Comparative Graphemics: Alphabets, Abjads & Morphosyllabic Logographs",
                            "summary": "How Latin alphabets, the Arabic abjad, and Chinese Hanzi encode phonology and morphology differently.",
                            "sim": "script_stroke_lab",
                            "lab": False,
                            "lessons": [
                                "Shallow vs. Deep Orthographies: Italian Phonemic Transparency vs. French Historical Etymological Spelling",
                                "Why the Consonantal Abjad Is Mathematically Optimal for Arabic Triliteral Root Morphology",
                                "Why Morphosyllabic Hanzi Unifies Spoken Sinitic Varieties Across Time and Geography",
                                "Eye-Tracking and Visual Word Recognition Across Left-to-Right Alphabets, Right-to-Left Cursive Abjads, and Square Hanzi",
                            ],
                        },
                    ],
                },
                {
                    "id": "lin_201",
                    "code": "LIN 201",
                    "title": "Comparative Morphosyntax: Sino-Tibetan, Germanic, Romance & Semitic",
                    "level": 200,
                    "credits": 4,
                    "prerequisites": ["lin_101"],
                    "description": (
                        "See the deep structural invariants and contrasts across your five languages: "
                        "analytic isolating (Mandarin) vs. fusional (German, Italian, French) vs. "
                        "root-and-pattern introflecting (Arabic) architectures."
                    ),
                    "modules": [
                        {
                            "id": "morphological_typology",
                            "title": "Morphological Typology: Isolating, Fusional & Non-Concatenative Introflection",
                            "summary": "How each language family packages grammatical information into words.",
                            "sim": "semitic_root_weaver",
                            "lab": True,
                            "lessons": [
                                "Humboldt & Sapir's Typological Spectrum: Analytic Index vs. Synthetic Index",
                                "Mandarin as an Analytic-Isolating Masterpiece: Aspect Particles, Complements, and Compounding Without Inflection",
                                "German vs. Italian/French Fusional Evolution: How German Preserved Case on Determiners While Romance Shifted to Prepositions & Clitics",
                                "Arabic Root-and-Pattern Introflection: Separating Lexical Consonants from Grammatical Vowel Tier",
                            ],
                        },
                        {
                            "id": "comparative_romance_bridge",
                            "title": "The Italian ↔ French Structural Bridge (From Vulgar Latin to Twin Romance Systems)",
                            "summary": "Learn Italian and French at 2× speed by mapping their shared grammar and systematic sound shifts.",
                            "sim": "conjugation_matrix",
                            "lab": True,
                            "lessons": [
                                "Systematic Vulgar Latin Sound Laws: Why Italian Notte/Latte/Otto = French Nuit/Lait/Huit (-ct- → -tt- vs. -it-) and Chiave/Fiamma = Clé/Flamme (pl-/fl-/cl- → pi-/fi-/chi-)",
                                "Isomorphic Verb Systems: Passato Prossimo / Passé Composé (Essere/Avere ≡ Être/Avoir!), Imperfetto / Imparfait, and Congiuntivo / Subjonctif",
                                "Isomorphic Clitic Pronouns: Why Italian Ci/Ne Maps Directly onto French Y/En!",
                                "Key Divergences: Pro-Drop Italian vs. Mandatory Subject Pronouns in French, and Subjunctive Usage Frequency",
                            ],
                        },
                        {
                            "id": "word_order_topologies",
                            "title": "Syntactic Word Order Topologies: SVO, V2/SOV, VSO & Topic-Comment",
                            "summary": "Comparing clause geometry across Mandarin, German, Italian, French, and Arabic.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "German's V2 + Verb-Final Satzklammer vs. Romance SVO with Pre-Verbal Clitic Clusters",
                                "Arabic VSO (Jumla Fiʿliyya with Singular Verb Agreement) vs. Topic-Comment SVO (Jumla Ismiyya)",
                                "Mandarin Topic-Prominent Syntax, Head-Final Noun Phrases (Relative Clauses Before De 的!), and Bǎ-Fronting",
                                "Universal Information Structure: Given-Before-New and Focus Fronting Across All Five Languages",
                            ],
                        },
                        {
                            "id": "tense_aspect_mood_matrix",
                            "title": "Cross-Linguistic Tense, Aspect, Mood (TAM) & Evidentiality",
                            "summary": "Unified semantic map of perfective, imperfective, counterfactual, and epistemic systems.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Perfective vs. Imperfective: Mandarin Le/Guo/Zai, Romance Passato/Imperfetto, and Arabic Māḍī/Muḍāriʿ + Kāna",
                                "Subjunctive and Irrealis: German Konjunktiv I/II, Italian Congiuntivo, French Subjonctif, and Arabic Manṣūb/Majzūm + Law",
                                "Passive and Valency-Changing Operations: Mandarin Bǎ/Bèi, German Werden/Sein, Italian Venire/Si, and Arabic Form VII/VIII & Internal Passive",
                                "Comparative Grammar Matrix Synthesis Lab",
                            ],
                        },
                    ],
                },
                {
                    "id": "lin_301",
                    "code": "LIN 301",
                    "title": "Cognitive Neuroscience of Adult Polyglot Mastery & Memory Engineering",
                    "level": 300,
                    "credits": 3,
                    "prerequisites": ["lin_201"],
                    "description": (
                        "Apply computational neuroscience and cognitive psychology to hyper-accelerate "
                        "simultaneous acquisition of five languages without lexical interference."
                    ),
                    "modules": [
                        {
                            "id": "polyglot_brain_networks",
                            "title": "Neural Architecture of the Multilingual Brain & Inhibitory Control",
                            "summary": "Perisylvian language circuits, basal ganglia language switching, and preventing cross-talk.",
                            "sim": "ngram_predictor",
                            "lab": False,
                            "lessons": [
                                "Procedural (Basal Ganglia / Broca's) vs. Declarative (Hippocampal / Temporal) Memory Systems in Adult SLA",
                                "Green's Inhibitory Control Model: How the Anterior Cingulate and Caudate Nucleus Suppress Non-Target Languages",
                                "Phonological Working Memory (Baddeley's Loop) and Acoustic Shadowing Protocols",
                                "Why Typologically Distant Languages (Mandarin + Arabic)Interfere Less Than Close Relatives (Italian + French) — and How to Separate Twins",
                            ],
                        },
                        {
                            "id": "spaced_repetition_chunking",
                            "title": "Algorithmic Spaced Repetition, Collocational Chunking & Frequency Zipf Laws",
                            "summary": "Information-theoretic vocabulary acquisition and multi-word construction grammar.",
                            "sim": "ngram_predictor",
                            "lab": True,
                            "lessons": [
                                "Zipf's Law in Natural Language Corpora: How the Top 2,000 Lemmas Cover 85% of Spoken Text",
                                "Beyond Isolated Flashcards: Acquiring Constructions, Valency Frames, and Collocations as Atomic Chunks",
                                "Visual-Spatial Mnemonics for Hanzi Radicals, German Gender/Plural Classes, and Arabic Triliteral Roots",
                                "Designing a Daily 5-Language Interleaved Practice Schedule",
                            ],
                        },
                        {
                            "id": "auditory_shadowing_output",
                            "title": "Alexander Arguelles Shadowing, Comprehensible Input & Pushed Output",
                            "summary": "Combining prosodic shadowing with Swain's Output Hypothesis and deliberate feedback.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Blind and Scripted Prosodic Shadowing: Synchronizing Articulatory Motor Loops with Native Audio",
                                "Krashen's Comprehensible Input (i+1) vs. Swain's Comprehensible Output Hypothesis (Noticing the Gap)",
                                "Register-Specific Personas: Anchoring Each Language to a Distinct Vocal Posture and Cultural Persona",
                                "Self-Diagnostic Recording & Formant/Pitch Feedback Workflow",
                            ],
                        },
                        {
                            "id": "preventing_l2_interference",
                            "title": "Contrastive Interference Mitigation (Italian vs. French & German vs. English)",
                            "summary": "Surgical drills to eliminate false friends (falsi amici / faux amis) and syntactic transfer.",
                            "sim": "conjugation_matrix",
                            "lab": False,
                            "lessons": [
                                "Italian-French False Friends and Cognate Trap Drills (salire vs. salir, fermare vs. fermer, guardare vs. garder)",
                                "German-English Cognate Shifts (High German Consonant Shift: p/t/k → pf-ff / z-ss / ch: pipe/Pfeife, water/Wasser, make/machen!)",
                                "Arabic Loanwords in Romance and English (al-jabr, al-kīmiyāʾ, al-khwārizmī, ṣifr → cifra/zéro/cipher, taʿrīfa → tariff, makhzan → magazzino/magasin)",
                                "Cross-Language Error Correction Workshop",
                            ],
                        },
                    ],
                },
                {
                    "id": "lin_401",
                    "code": "LIN 401",
                    "title": "Translation Theory, Pragmatics & Cross-Cultural Strategic Negotiation",
                    "level": 400,
                    "credits": 4,
                    "prerequisites": ["lin_301"],
                    "description": (
                        "Master comparative stylistics (Vinay & Darbelnet), untranslatables (Cassin), "
                        "speech-act pragmatics, and cross-cultural negotiation across Sinophone, "
                        "DACH, Italian, Francophone, and Arab contexts."
                    ),
                    "modules": [
                        {
                            "id": "comparative_stylistics",
                            "title": "Vinay & Darbelnet's Comparative Stylistics & Translation Transformations",
                            "summary": "Transposition, modulation, equivalence, and adaptation across language pairs.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "Seven Translation Procedures: Borrowing, Calque, Literal, Transposition, Modulation, Equivalence, Adaptation",
                                "Chassé-Croisé (Verb-Adverb Crossing): Why 'He walked across the street' Is 'Il a traversé la rue à pied' / 'Ha attraversato la strada a piedi'",
                                "Concrete vs. Abstract Register Preferences Across German, French, Italian, Mandarin, and Arabic",
                                "Walter Benjamin ('Die Aufgabe des Übersetzers') and Umberto Eco ('Dire quasi la stessa cosa')",
                            ],
                        },
                        {
                            "id": "untranslatables_philosophy",
                            "title": "Barbara Cassin's Dictionary of Untranslatables: Philosophy Across Five Tongues",
                            "summary": "Comparing how fundamental concepts of truth, mind, being, and ethics shift across languages.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Truth Across Five Languages: Wahrheit (German) vs. Vérité/Verità (Romance) vs. Ḥaqīqa/Ṣidq (Arabic حقيقة/صدق) vs. Zhēn (Mandarin 真)",
                                "Mind, Spirit & Consciousness: Geist/Gemüt vs. Esprit/Mente vs. ʿAql/Rūḥ/Nafs (عقل/روح/نفس) vs. Xīn/Shén (心/神)",
                                "Law, Right & Justice: Recht/Gesetz, Droit/Loi, Diritto/Legge, Ḥaqq/Qānūn/Sharīʿa, and Fǎ/Lǐ (法/理)",
                                "Multilingual Philosophical Seminar: Thinking a Problem Simultaneously in Five Languages",
                            ],
                        },
                        {
                            "id": "intercultural_pragmatics",
                            "title": "Cross-Cultural Pragmatics, Politeness Theory & Strategic Communication",
                            "summary": "Brown & Levinson's face theory and high- vs. low-context negotiation dynamics.",
                            "sim": "dialogue_immersion",
                            "lab": False,
                            "lessons": [
                                "Directness vs. Indirectness Calibration: German Sachlichkeit vs. French Dialectical Rigor vs. Italian Relazione vs. Arabic Karam/Honor vs. Chinese Miànzi",
                                "Speech Acts Under Pressure: Refusing, Disagreeing, Apologizing, and Persuading in Five Languages",
                                "Interpreting Subtext, Hedging, and Diplomatic Euphemism Across Cultures",
                                "Simulated Five-Party International Negotiation Summit",
                            ],
                        },
                        {
                            "id": "nlp_multilingual_models",
                            "title": "Computational Linguistics & Multilingual LLMs Across Morphologically Diverse Languages",
                            "summary": "Subword tokenization fertility, cross-lingual embeddings, and machine translation pitfalls.",
                            "sim": "tokenizer",
                            "lab": True,
                            "lessons": [
                                "BPE & SentencePiece Tokenization Fertility: Why Hanzi, German Compounds, and Cliticized Arabic Tokenize Differently",
                                "Morphological Ambiguity in Unvocalized Arabic Text and Word Segmentation in Unspaced Chinese Text",
                                "Cross-Lingual Transfer in Transformer Models and Low-Resource Dialect Adaptation",
                                "Building a Multilingual Parallel Corpus Analyzer in Python",
                            ],
                        },
                    ],
                },
                {
                    "id": "lin_501",
                    "code": "LIN 501",
                    "title": "Graduate Seminar: Simultaneous Interpreting, Code-Switching & Polyglot Capstone",
                    "level": 500,
                    "credits": 4,
                    "prerequisites": ["lin_401"],
                    "description": (
                        "The culminating seminar of the World Languages Faculty: conference-style "
                        "consecutive and simultaneous interpreting (Rozan note-taking, décalage), "
                        "rapid five-language code-switching, and a polyglot thesis defense."
                    ),
                    "modules": [
                        {
                            "id": "consecutive_simultaneous",
                            "title": "Conference Interpreting Science: Décalage, Anticipation & Rozan Note-Taking",
                            "summary": "Managing ear-voice span when translating between Verb-Final (German), VSO (Arabic), and SVO languages.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Jean-François Rozan's Seven Principles of Consecutive Interpreting Note-Taking (Ideas, Not Words!)",
                                "Managing Décalage (Ear-Voice Span) and Syntactic Anticipation for German Verb-Final Clauses",
                                "De-Verbalization (Seleskovitch's Théorie du Sens): Extracting Pure Conceptual Structure Before Re-Encoding",
                                "Sight Translation & Simultaneous Interpreting Drills",
                            ],
                        },
                        {
                            "id": "five_language_switching",
                            "title": "High-Velocity Five-Language Code-Switching Studio",
                            "summary": "Switching cleanly between Mandarin, German, Italian, French, and Arabic on a single topic.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Acoustic Reset Triggers: Switching Vocal Tract Posture Between Mandarin, German, Italian, French, and Arabic in Under 2 Seconds",
                                "Explaining Quantum Mechanics, AI Architecture, and Moral Philosophy Across All Five Languages",
                                "Triadic Translation Chains: Mandarin → German → Italian → French → Arabic → Mandarin Without English Mediation!",
                                "Live Rapid-Fire Polyglot Roundtable with the Professor",
                            ],
                        },
                        {
                            "id": "historical_philology",
                            "title": "Historical & Comparative Philology: Proto-Indo-European, Proto-Semitic & Old Chinese",
                            "summary": "Tracing deep historical roots and sound laws across millennia.",
                            "sim": "semitic_root_weaver",
                            "lab": False,
                            "lessons": [
                                "Grimm's Law and Verner's Law: How Proto-Indo-European *p/*t/*k Split Latin/Romance (pater/padre/père) from Germanic (Vater/father)",
                                "Proto-Semitic Consonantal Conservation in Classical Arabic vs. Sister Semitic Languages",
                                "From Old Chinese (Shījīng Rhymes) to Middle Chinese (Qieyun Tones) to Modern Putonghua",
                                "Silk Road & Mediterranean Lexical Exchange: How Words Traveled Between China, the Arab World, Italy, France, and Germany",
                            ],
                        },
                        {
                            "id": "polyglot_capstone",
                            "title": "Master's Polyglot Symposium & Five-Language Oral Defense",
                            "summary": "Synthesizing humanities, science, and rhetoric across all five languages.",
                            "sim": "dialogue_immersion",
                            "lab": True,
                            "lessons": [
                                "Composing a Pentalingual Executive Dossier on a Complex Scientific or Geopolitical Topic",
                                "Rhetorical Polish and Native Idiomaticity Audit Across Mandarin, German, Italian, French, and Arabic",
                                "The Polyglot Laureate Defense: 5-Language Oral Examination with the Professor",
                                "Lifelong Polyglot Maintenance Architecture",
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
