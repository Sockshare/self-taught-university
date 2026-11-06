"""Self-Taught curriculum catalog — Computer Science domain.

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
# 1. Programming Foundations
# ---------------------------------------------------------------------------------------------
PROGRAMMING = {
    "id": "programming_foundations",
    "name": "Programming Foundations",
    "icon": "🐍",
    "description": "From your first Python program to object-oriented design and functional abstraction — the craft of turning ideas into correct, readable code.",
    "courses": [
        _c("cs_101", "CS 101", "Introduction to Programming with Python", 100, 4,
           "Write, run, and debug real Python programs from scratch. You will model problems with variables, control flow, functions, and core data types, read and write files, and break larger tasks into small, testable pieces.",
           [], [
            _m("python_first_steps", "First Steps: Values, Variables & Expressions",
               "How a computer executes a program line by line, and the basic building blocks every Python program is made of.", [
                "What Is a Program? Interpreters, the Python REPL, and Running Your First Script",
                "Numbers, Strings, and Booleans: Python's Core Value Types and the type() Function",
                "Variables, Assignment, and Names as References to Objects",
                "Arithmetic and String Expressions, Operator Precedence, and Integer vs. Float Division",
                "Reading Input, Converting Types, and Formatting Output with f-Strings",
            ]),
            _m("control_flow", "Control Flow: Decisions and Loops",
               "Making programs react to data with conditionals and repeat work with loops.", [
                "Boolean Logic, Comparison Operators, and Truthiness in Python",
                "if / elif / else: Branching Programs and Nested Decisions",
                "while Loops, Loop Invariants, and Avoiding Infinite Loops",
                "for Loops over range() and Sequences; break, continue, and else on Loops",
                "Tracing Code by Hand: Building a Mental Model of Execution",
            ]),
            _m("functions_decomposition", "Functions and Problem Decomposition",
               "Packaging logic into reusable, well-named functions and designing programs top-down.", [
                "Defining Functions, Parameters, Return Values, and None",
                "Scope, Local vs. Global Variables, and Why Side Effects Matter",
                "Default Arguments, Keyword Arguments, and Docstrings",
                "Top-Down Design: Decomposing a Problem into Helper Functions",
                "Introduction to Recursion: Factorial, Fibonacci, and the Call Stack",
            ]),
            _m("collections", "Collections: Lists, Tuples, Dictionaries & Sets",
               "Python's built-in data structures and the idioms for searching, transforming, and aggregating data.", [
                "Lists: Indexing, Slicing, Mutation, and Common Methods",
                "Tuples, Unpacking, and Immutability",
                "Dictionaries: Key-Value Lookup, Counting, and Grouping Patterns",
                "Sets and Membership Testing; Choosing the Right Collection",
                "List, Dict, and Set Comprehensions for Concise Transformations",
            ]),
            _m("files_errors_testing", "Files, Errors, and Testing Your Code",
               "Working with external data robustly and gaining confidence that code is correct.", [
                "Reading and Writing Text and CSV Files with Context Managers",
                "Exceptions: try / except / finally and Raising Your Own Errors",
                "Debugging Strategies: Print Debugging, Assertions, and the pdb Debugger",
                "Writing Unit Tests with assert and pytest",
                "Mini-Project: A Command-Line Gradebook that Reads, Analyzes, and Reports Data",
            ]),
        ]),
        _c("cs_102", "CS 102", "Object-Oriented Programming and Program Design", 100, 4,
           "Design and build medium-sized programs using classes, objects, and interfaces. You will apply encapsulation, inheritance, composition, and classic design patterns, and structure code into modules and packages.",
           ["cs_101"], [
            _m("classes_objects", "Classes, Objects, and Encapsulation",
               "Modeling the world with user-defined types that bundle state and behavior.", [
                "From Data + Functions to Objects: Why Object-Oriented Programming Exists",
                "Defining Classes, __init__, Instance Attributes, and Methods",
                "Encapsulation, Class Invariants, and Properties with @property",
                "Special Methods: __repr__, __str__, __eq__, __lt__, and __hash__",
                "Class Attributes, @classmethod, and @staticmethod",
            ]),
            _m("inheritance_polymorphism", "Inheritance, Polymorphism, and Interfaces",
               "Reusing and extending behavior while keeping code substitutable.", [
                "Inheritance, super(), and Method Overriding",
                "Polymorphism and Duck Typing in Python",
                "Abstract Base Classes and Interface Contracts with abc",
                "The Liskov Substitution Principle and When Inheritance Goes Wrong",
                "Composition over Inheritance: Building Objects from Collaborators",
            ]),
            _m("design_principles", "Design Principles and UML Modeling",
               "Thinking about structure before writing code: responsibilities, coupling, and cohesion.", [
                "Cohesion, Coupling, and the Single Responsibility Principle",
                "The SOLID Principles Illustrated with Python Examples",
                "UML Class and Sequence Diagrams for Communicating Designs",
                "CRC Cards and Responsibility-Driven Design",
            ], lab=False),
            _m("design_patterns", "Classic Design Patterns",
               "Reusable solutions to recurring design problems, implemented idiomatically in Python.", [
                "Creational Patterns: Factory Method, Builder, and Singleton (and Its Pitfalls)",
                "Structural Patterns: Adapter, Decorator, and Composite",
                "Behavioral Patterns: Strategy, Observer, and Command",
                "Iterators and Generators: Python's Built-In Iterator Pattern",
                "Refactoring a Procedural Program into a Pattern-Based Design",
            ]),
            _m("modules_packages_project", "Modules, Packages, and a Team-Sized Project",
               "Organizing a codebase so it can grow, be tested, and be shared.", [
                "Modules, Imports, and the if __name__ == '__main__' Idiom",
                "Packages, Virtual Environments, and Dependency Management with pip",
                "Type Hints, mypy, and Dataclasses for Self-Documenting Code",
                "Testing Object-Oriented Code: Fixtures, Mocks, and Test Doubles",
                "Project: An Object-Oriented Text Adventure or Inventory System with Tests",
            ]),
        ]),
        _c("cs_201", "CS 201", "Functional Programming and Program Abstraction", 200, 4,
           "Think in terms of values, functions, and composition. You will use higher-order functions, immutable data, recursion schemes, and lazy evaluation to write concise, provably correct programs, and reason about them with equational logic.",
           ["cs_102", "math_discrete_1"], [
            _m("functions_as_values", "Functions as First-Class Values",
               "Treating functions as data unlocks powerful abstractions for building programs.", [
                "First-Class and Higher-Order Functions: map, filter, and reduce",
                "Lambda Expressions, Closures, and Lexical Scope",
                "Function Composition, Currying, and Partial Application with functools",
                "Decorators as Higher-Order Functions",
                "Pure Functions, Referential Transparency, and Side-Effect Isolation",
            ]),
            _m("recursion_induction", "Recursion and Structural Induction",
               "Designing recursive functions that mirror the shape of data, and proving them correct.", [
                "Designing Recursive Functions from Recursive Data Definitions",
                "Proving Recursive Functions Correct by Structural Induction",
                "Tail Recursion, Accumulators, and Converting Recursion to Iteration",
                "Mutual Recursion and Tree-Shaped Data: Expression Trees",
                "Memoization and the Bridge to Dynamic Programming",
            ]),
            _m("immutable_data", "Immutable Data and Algebraic Data Types",
               "Representing data as immutable values built from sums and products of types.", [
                "Immutable Lists and Persistent Data Structures with Structural Sharing",
                "Algebraic Data Types: Product Types, Sum Types, and Pattern Matching (match/case)",
                "Option/Maybe and Result/Either Types for Error Handling Without Exceptions",
                "Folds over Lists and Trees: Catamorphisms in Practice",
            ]),
            _m("laziness_streams", "Laziness, Streams, and Generators",
               "Computing only what is needed, and working with conceptually infinite data.", [
                "Strict vs. Lazy Evaluation and Call-by-Need",
                "Generators and itertools for Infinite Streams",
                "Stream Processing Pipelines: Sieve of Eratosthenes and Prime Streams",
                "Lazy Evaluation Pitfalls: Space Leaks and Evaluation Order",
            ]),
            _m("functional_abstractions", "Functional Abstractions: Functors and Monads in Practice",
               "The recurring patterns behind mapping, chaining, and composing computations.", [
                "Functors: Mapping over Containers Uniformly",
                "Chaining Computations that Can Fail: The Monad Pattern via Optional and Result",
                "Parser Combinators: Building a Parser from Small Functions",
                "Property-Based Testing with Hypothesis",
                "Project: A Functional Data-Processing Pipeline with No Mutable State",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 2. Data Structures & Algorithms
# ---------------------------------------------------------------------------------------------
DSA = {
    "id": "data_structures_algorithms",
    "name": "Data Structures & Algorithms",
    "icon": "🌳",
    "description": "The core of computer science: organizing data for efficient access and designing algorithms with provable correctness and running time.",
    "courses": [
        _c("cs_151", "CS 151", "Data Structures", 100, 4,
           "Implement and analyze the fundamental data structures — arrays, linked lists, stacks, queues, hash tables, trees, heaps, and graphs. You will choose structures based on asymptotic cost and build each one from scratch in Python.",
           ["cs_101"], [
            _m("complexity_basics", "Measuring Efficiency: Asymptotic Analysis",
               "Why some programs scale and others don't, expressed with Big-O notation.", [
                "Counting Operations and Empirical Timing with timeit",
                "Big-O, Big-Omega, and Big-Theta Notation",
                "Common Growth Rates: Constant, Logarithmic, Linear, n log n, Quadratic, Exponential",
                "Amortized Analysis of Dynamic Arrays (Python list append)",
                "Space Complexity and Time-Space Trade-offs",
            ]),
            _m("linear_structures", "Linear Structures: Arrays, Linked Lists, Stacks & Queues",
               "Sequential containers and the abstract data types built on them.", [
                "Abstract Data Types vs. Concrete Implementations",
                "Singly and Doubly Linked Lists: Insertion, Deletion, and Traversal",
                "Stacks: Balanced Parentheses and Evaluating Postfix Expressions",
                "Queues and Deques: Circular Buffers and Breadth-First Processing",
                "Comparing Array-Based and Linked Implementations",
            ]),
            _m("hashing", "Hash Tables",
               "Expected constant-time lookup through hashing, and what can go wrong.", [
                "Hash Functions, Uniformity, and the Pigeonhole Principle",
                "Collision Resolution by Separate Chaining",
                "Open Addressing: Linear Probing, Quadratic Probing, and Double Hashing",
                "Load Factor, Resizing, and Rehashing",
                "How Python dict and set Work Internally",
            ]),
            _m("trees_heaps", "Trees, Binary Search Trees, and Heaps",
               "Hierarchical structures for ordered data and priority-based access.", [
                "Tree Terminology and Recursive Traversals: Preorder, Inorder, Postorder, Level-Order",
                "Binary Search Trees: Search, Insert, Delete, and Degenerate Cases",
                "Balanced Trees Introduced: AVL Rotations",
                "Binary Heaps and Priority Queues with heapq",
                "Heapsort and Building a Heap in Linear Time",
            ]),
            _m("graphs_intro", "Graphs and Basic Graph Traversal",
               "Representing networks and exploring them systematically.", [
                "Graph Representations: Adjacency Matrix vs. Adjacency List",
                "Breadth-First Search and Shortest Paths in Unweighted Graphs",
                "Depth-First Search, Cycle Detection, and Connected Components",
                "Topological Sorting of Directed Acyclic Graphs",
                "Union-Find (Disjoint Sets) with Path Compression and Union by Rank",
            ]),
        ]),
        _c("cs_250", "CS 250", "Design and Analysis of Algorithms", 200, 5,
           "Design algorithms using divide-and-conquer, greedy, and dynamic programming paradigms, prove them correct, and analyze their running times with recurrences. You will master classic graph algorithms and recognize intractable problems.",
           ["cs_151", "math_discrete_1"], [
            _m("correctness_recurrences", "Correctness Proofs and Recurrences",
               "The mathematical toolkit for proving that algorithms work and bounding their cost.", [
                "Loop Invariants and Proving Insertion Sort Correct",
                "Solving Recurrences: Substitution and Recursion Trees",
                "The Master Theorem and Its Limitations",
                "Lower Bounds: The Omega(n log n) Comparison-Sorting Bound via Decision Trees",
            ], lab=False),
            _m("divide_conquer", "Divide and Conquer",
               "Breaking problems into independent subproblems and combining results.", [
                "Merge Sort and Counting Inversions",
                "Quicksort, Randomized Pivoting, and Expected O(n log n) Analysis",
                "Linear-Time Selection: Median of Medians",
                "Karatsuba Multiplication and Strassen's Matrix Multiplication",
                "Closest Pair of Points in O(n log n)",
            ]),
            _m("greedy", "Greedy Algorithms",
               "When locally optimal choices yield global optima, and how to prove it.", [
                "Interval Scheduling and the Exchange Argument",
                "Huffman Coding and Optimal Prefix Codes",
                "Minimum Spanning Trees: Cut Property, Kruskal's and Prim's Algorithms",
                "Dijkstra's Shortest-Path Algorithm and Its Correctness Proof",
                "Matroids and the Limits of Greedy Strategies",
            ]),
            _m("dynamic_programming", "Dynamic Programming",
               "Solving problems with overlapping subproblems by tabulating solutions.", [
                "From Memoized Recursion to Bottom-Up Tables: Weighted Interval Scheduling",
                "Sequence Alignment and Edit Distance",
                "0/1 Knapsack and Pseudo-Polynomial Time",
                "Longest Increasing Subsequence and Reconstructing Solutions",
                "Bellman-Ford and Floyd-Warshall: Dynamic Programming on Graphs",
            ]),
            _m("flows_intractability", "Network Flow and an Introduction to Intractability",
               "Powerful reductions to max-flow, and recognizing problems that likely have no efficient algorithm.", [
                "Max-Flow Min-Cut Theorem and the Ford-Fulkerson Method",
                "Edmonds-Karp and Bipartite Matching via Flow",
                "Polynomial-Time Reductions and the Classes P and NP",
                "NP-Completeness: SAT, 3-SAT, Vertex Cover, and Hamiltonian Cycle",
                "Coping with NP-Hardness: Backtracking, Branch and Bound, and Heuristics",
            ]),
        ]),
        _c("cs_350", "CS 350", "Advanced Algorithms and Data Structures", 300, 4,
           "Go beyond the textbook toolkit with randomized algorithms, advanced data structures, string algorithms, and linear-programming techniques. You will analyze probabilistic guarantees and implement structures used in production systems.",
           ["cs_250", "math_prob_1"], [
            _m("randomized_basics", "Randomized Algorithms and Probabilistic Analysis",
               "Using randomness to get simple, fast algorithms with high-probability guarantees.", [
                "Las Vegas vs. Monte Carlo Algorithms",
                "Karger's Randomized Min-Cut and Probability Amplification",
                "Chernoff Bounds and Concentration in Algorithm Analysis",
                "Randomized Primality Testing: Miller-Rabin",
                "Reservoir Sampling and Random Permutations",
            ]),
            _m("advanced_structures", "Advanced Data Structures",
               "Balanced and self-adjusting structures with strong amortized guarantees.", [
                "Red-Black Trees and Their Correspondence to 2-3-4 Trees",
                "Splay Trees and Amortized Analysis via the Potential Method",
                "Skip Lists and Treaps: Randomized Balanced Search",
                "Fibonacci Heaps and Faster Dijkstra/Prim",
                "B-Trees and Cache-Aware Data Structures",
            ]),
            _m("hashing_sketching", "Universal Hashing and Streaming Sketches",
               "Rigorous hashing and summarizing massive data streams in tiny memory.", [
                "Universal and k-Wise Independent Hash Families",
                "Perfect Hashing and Cuckoo Hashing",
                "Bloom Filters and False-Positive Analysis",
                "Count-Min Sketch and HyperLogLog Cardinality Estimation",
            ]),
            _m("string_algorithms", "String Algorithms",
               "Fast pattern matching and indexing for text and genomic data.", [
                "Knuth-Morris-Pratt and the Failure Function",
                "Rabin-Karp Rolling Hashes",
                "Tries and Aho-Corasick Multi-Pattern Matching",
                "Suffix Arrays, LCP Arrays, and Suffix Trees",
                "Burrows-Wheeler Transform and FM-Index Search",
            ]),
            _m("linear_programming", "Linear Programming and Duality in Algorithm Design",
               "Formulating combinatorial problems as linear programs and exploiting duality.", [
                "Formulating Problems as Linear Programs",
                "The Simplex Method: Geometry and Pivoting",
                "LP Duality and Complementary Slackness",
                "Integer Programming and LP Relaxations",
                "Min-Cost Flow and Assignment Problems",
            ]),
        ]),
        _c("cs_480", "CS 480", "Computer Graphics and Geometric Algorithms", 400, 4,
           "Render 3D scenes from first principles and solve geometric problems efficiently. You will implement transformation pipelines, rasterizers, and ray tracers, and core computational-geometry algorithms such as convex hulls and Voronoi diagrams.",
           ["cs_250", "math_linear_algebra_1"], [
            _m("transformations", "Geometric Transformations and Cameras",
               "Linear algebra as the language of moving, projecting, and viewing objects.", [
                "Homogeneous Coordinates and Affine Transformations",
                "Rotations: Matrices, Euler Angles, and Quaternions",
                "Viewing and Perspective Projection Matrices",
                "Scene Graphs and Hierarchical Transformations",
            ]),
            _m("rasterization", "The Rasterization Pipeline",
               "How GPUs turn triangles into pixels in real time.", [
                "Line and Triangle Rasterization with Barycentric Coordinates",
                "Depth Buffering, Clipping, and Back-Face Culling",
                "Texture Mapping, Mipmapping, and Filtering",
                "Programmable Shaders: Vertex and Fragment Stages",
                "Writing a Software Rasterizer in Python with NumPy",
            ]),
            _m("shading_ray_tracing", "Shading and Ray Tracing",
               "Physically motivated light transport for photorealistic images.", [
                "Phong and Blinn-Phong Local Illumination Models",
                "Ray-Sphere and Ray-Triangle Intersection",
                "Recursive Ray Tracing: Shadows, Reflection, and Refraction",
                "Bounding Volume Hierarchies for Fast Ray Queries",
                "Monte Carlo Path Tracing and the Rendering Equation",
            ]),
            _m("comp_geometry", "Computational Geometry",
               "Exact and efficient algorithms on points, segments, and polygons.", [
                "Orientation Predicates and Robust Geometric Computation",
                "Convex Hulls: Graham Scan and Andrew's Monotone Chain",
                "Line Segment Intersection by Plane Sweep",
                "Polygon Triangulation and the Art Gallery Theorem",
                "Voronoi Diagrams and Delaunay Triangulations",
            ]),
            _m("geometry_structures", "Spatial Data Structures and Meshes",
               "Organizing geometric data for fast queries and representing surfaces.", [
                "k-d Trees and Nearest-Neighbor Search",
                "Quadtrees, Octrees, and Range Queries",
                "Triangle Meshes, Half-Edge Data Structures, and Subdivision Surfaces",
                "Bézier Curves, B-Splines, and de Casteljau's Algorithm",
            ]),
        ]),
        _c("cs_550", "CS 550", "Randomized, Approximation, and Online Algorithms", 500, 3,
           "Attack NP-hard and uncertain problems with algorithms that come with provable guarantees. You will design approximation algorithms via LP rounding and primal-dual methods, analyze online algorithms competitively, and apply the probabilistic method.",
           ["cs_350"], [
            _m("approx_basics", "Approximation Algorithms Fundamentals",
               "Trading optimality for efficiency with guaranteed approximation ratios.", [
                "Approximation Ratios and Greedy Set Cover's ln n Guarantee",
                "Vertex Cover, Metric TSP, and Christofides' Algorithm",
                "PTAS and FPTAS: Knapsack via Scaling and Rounding",
                "Hardness of Approximation and the PCP Theorem (Overview)",
            ], lab=False),
            _m("lp_rounding", "LP Rounding and Primal-Dual Methods",
               "Turning fractional LP solutions into integral ones with bounded loss.", [
                "Deterministic and Randomized Rounding for Set Cover",
                "The Primal-Dual Schema for Facility Location and Steiner Forest",
                "Semidefinite Programming and Goemans-Williamson MAX-CUT",
                "Iterative Rounding and Integrality Gaps",
            ]),
            _m("probabilistic_method", "The Probabilistic Method and Derandomization",
               "Proving existence by randomness, then removing the randomness.", [
                "The Basic Probabilistic Method and MAX-3SAT",
                "The Lovász Local Lemma and the Moser-Tardos Algorithm",
                "Method of Conditional Expectations",
                "Pairwise Independence and Small Sample Spaces",
            ], lab=False),
            _m("online_algorithms", "Online Algorithms and Competitive Analysis",
               "Making decisions without knowing the future.", [
                "Competitive Ratio, Ski Rental, and Adversary Models",
                "Paging: LRU, FIFO, and the Randomized Marking Algorithm",
                "The k-Server Problem and Work-Function Algorithm",
                "Online Learning: Multiplicative Weights and Regret Bounds",
                "Learning-Augmented (Prediction-Based) Online Algorithms",
            ]),
            _m("sublinear_algorithms", "Sublinear and Streaming Algorithms",
               "Algorithms that read only a fraction of the input or a single pass over it.", [
                "Frequency Moments and the AMS Sketch",
                "Property Testing: Testing Graph Properties with Few Queries",
                "Dimensionality Reduction: The Johnson-Lindenstrauss Lemma",
                "Locality-Sensitive Hashing for Approximate Nearest Neighbors",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 3. Computer Systems & Architecture
# ---------------------------------------------------------------------------------------------
SYSTEMS_ARCH = {
    "id": "computer_systems_architecture",
    "name": "Computer Systems & Architecture",
    "icon": "🖥️",
    "description": "How software actually runs: from logic gates and binary data through C, assembly, memory hierarchies, and pipelined processors.",
    "courses": [
        _c("cs_110", "CS 110", "Computer Organization and Digital Logic", 100, 4,
           "Understand a computer from the transistor up. You will represent data in binary, design combinational and sequential circuits, and build a simple CPU datapath that executes machine instructions.",
           ["cs_101"], [
            _m("data_representation", "Binary Data Representation",
               "How numbers, text, and instructions are all just bits.", [
                "Binary, Hexadecimal, and Converting Between Number Bases",
                "Unsigned and Two's-Complement Integers and Overflow",
                "IEEE 754 Floating Point: Representation, Rounding, and Precision Surprises",
                "Characters and Text: ASCII, Unicode, and UTF-8 Encoding",
                "Bitwise Operations and Bit Masking in Python",
            ]),
            _m("boolean_logic", "Boolean Algebra and Combinational Circuits",
               "Gates and the algebra that lets us simplify them.", [
                "Logic Gates, Truth Tables, and Boolean Algebra Laws",
                "Karnaugh Maps and Logic Minimization",
                "Multiplexers, Decoders, and Encoders",
                "Half Adders, Full Adders, and Ripple-Carry Adders",
                "Building an Arithmetic Logic Unit (ALU)",
            ]),
            _m("sequential_logic", "Sequential Logic and State",
               "Circuits with memory: latches, flip-flops, and finite state machines.", [
                "SR Latches, D Flip-Flops, and Clocking",
                "Registers, Counters, and Register Files",
                "Finite State Machines: Moore vs. Mealy Designs",
                "Memory Arrays: SRAM and DRAM Cells",
            ]),
            _m("isa_machine_code", "Instruction Set Architecture and Machine Code",
               "The hardware/software contract that programs are compiled to.", [
                "The Stored-Program (von Neumann) Concept",
                "A RISC-V Tour: Registers, Instruction Formats, and Encoding",
                "Arithmetic, Load/Store, and Branch Instructions",
                "Writing and Simulating Small Assembly Programs",
            ]),
            _m("cpu_datapath", "Building a Simple CPU",
               "Putting it all together into a single-cycle processor.", [
                "Single-Cycle Datapath: Fetch, Decode, Execute, Memory, Writeback",
                "The Control Unit and Control Signals",
                "Writing a CPU Simulator in Python",
                "Performance Basics: Clock Rate, CPI, and the Iron Law of Performance",
            ]),
        ]),
        _c("cs_210", "CS 210", "Computer Systems: C, Assembly, and Memory", 200, 4,
           "See programs from the machine's point of view. You will write C, read x86-64 assembly, reason about the stack and heap, understand linking and loading, and write cache-friendly, memory-safe code.",
           ["cs_110", "cs_151"], [
            _m("c_programming", "Programming in C",
               "The systems language that exposes memory directly.", [
                "From Python to C: Compilation, Static Types, and main()",
                "Pointers, Addresses, and Pointer Arithmetic",
                "Arrays, Strings, and the Dangers of Buffer Overflows",
                "Structs, Unions, and Memory Layout with Padding and Alignment",
                "Dynamic Memory: malloc, free, and Debugging with Valgrind and AddressSanitizer",
            ], lab=False),
            _m("machine_level", "Machine-Level Representation of Programs",
               "How C constructs compile into x86-64 instructions.", [
                "x86-64 Registers, Operands, and Addressing Modes",
                "Control Flow in Assembly: Condition Codes, Jumps, and Loops",
                "Procedures: The Run-Time Stack, Calling Conventions, and Stack Frames",
                "Arrays, Structs, and Pointers in Assembly",
                "Reading Compiler Output with objdump and Compiler Explorer",
            ], lab=False),
            _m("memory_hierarchy", "The Memory Hierarchy and Caches",
               "Why locality determines performance on real hardware.", [
                "Storage Technologies and the Processor-Memory Gap",
                "Temporal and Spatial Locality",
                "Cache Organization: Direct-Mapped, Set-Associative, and Fully Associative",
                "Writing Cache-Friendly Code: Loop Ordering and Blocking for Matrix Multiply",
                "Simulating a Cache in Python and Measuring Hit Rates",
            ]),
            _m("linking_loading", "Linking, Loading, and Executables",
               "From separate source files to a running process image.", [
                "Object Files, ELF Format, and Symbol Tables",
                "Static Linking and Symbol Resolution",
                "Relocation and Position-Independent Code",
                "Dynamic Linking, Shared Libraries, and the PLT/GOT",
            ], lab=False),
            _m("dynamic_memory", "Dynamic Memory Allocation and Exceptional Control Flow",
               "How malloc works and how the OS interrupts your program.", [
                "Heap Allocator Design: Implicit and Explicit Free Lists",
                "Fragmentation, Coalescing, and Segregated Fits",
                "Garbage Collection Basics: Reference Counting and Mark-and-Sweep",
                "Exceptions, Interrupts, Signals, and Process Control with fork/exec",
            ]),
        ]),
        _c("cs_310", "CS 310", "Computer Architecture", 300, 4,
           "Analyze and design high-performance processors and memory systems. You will quantify performance, design pipelines with hazard handling, study out-of-order and superscalar execution, and evaluate multicore and GPU architectures.",
           ["cs_210"], [
            _m("quantitative_design", "Quantitative Design and Performance Evaluation",
               "Measuring, comparing, and reasoning about computer performance.", [
                "Performance Metrics, Benchmarks, and the Iron Law Revisited",
                "Amdahl's Law and the Limits of Speedup",
                "Power, Energy, and the End of Dennard Scaling",
                "RISC vs. CISC Instruction Set Design Trade-offs",
            ]),
            _m("pipelining", "Pipelining and Hazards",
               "Overlapping instruction execution for throughput.", [
                "The Classic Five-Stage RISC Pipeline",
                "Data Hazards, Forwarding, and Stalls",
                "Control Hazards and Branch Prediction: Static, Bimodal, and Two-Level Predictors",
                "Simulating a Pipelined Processor and Measuring CPI",
            ]),
            _m("ilp", "Instruction-Level Parallelism",
               "Extracting parallelism from sequential instruction streams.", [
                "Superscalar Issue and VLIW Approaches",
                "Dynamic Scheduling with Tomasulo's Algorithm",
                "Reorder Buffers, Register Renaming, and Precise Exceptions",
                "Speculative Execution and the Spectre/Meltdown Lesson",
            ]),
            _m("advanced_memory", "Advanced Memory Hierarchy Design",
               "Making memory appear fast, large, and cheap.", [
                "Multi-Level Caches, AMAT, and Cache Miss Classification (the 3 Cs)",
                "Cache Replacement and Write Policies",
                "Virtual Memory Hardware: TLBs and Page Table Walkers",
                "Prefetching and DRAM Organization",
            ]),
            _m("parallel_architectures", "Multicore, SIMD, and GPU Architectures",
               "Thread- and data-level parallelism in modern chips.", [
                "Shared-Memory Multiprocessors and Snooping Cache Coherence (MESI)",
                "Memory Consistency Models: Sequential Consistency vs. TSO",
                "SIMD Vector Extensions and Data-Level Parallelism",
                "GPU Architecture: SIMT Execution, Warps, and Memory Coalescing",
                "Domain-Specific Accelerators: The TPU Case Study",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 4. Operating Systems & Networks
# ---------------------------------------------------------------------------------------------
OS_NETWORKS = {
    "id": "operating_systems_networks",
    "name": "Operating Systems & Networks",
    "icon": "🌐",
    "description": "The software that manages machines and connects them: processes, memory, file systems, and the layered protocols of the Internet.",
    "courses": [
        _c("cs_320", "CS 320", "Operating Systems", 300, 4,
           "Understand and build the core abstractions an operating system provides. You will implement scheduling, synchronization, virtual memory, and a simple file system, and reason about concurrency bugs like races and deadlocks.",
           ["cs_210"], [
            _m("processes_threads", "Processes, Threads, and System Calls",
               "The OS as a virtualizer of the CPU.", [
                "The Role of the Kernel: User Mode, Kernel Mode, and System Calls",
                "The Process Abstraction: Address Spaces, PCBs, and Life Cycle",
                "Threads vs. Processes and Context Switching",
                "Process API in Practice: fork, exec, wait, and pipes",
            ]),
            _m("scheduling", "CPU Scheduling",
               "Deciding who runs next, and the trade-offs between fairness, latency, and throughput.", [
                "FIFO, Shortest-Job-First, and Round-Robin Scheduling",
                "Multi-Level Feedback Queues",
                "Proportional-Share Scheduling and Linux's CFS",
                "Multiprocessor Scheduling and Cache Affinity",
                "Simulating and Comparing Schedulers in Python",
            ]),
            _m("concurrency", "Concurrency and Synchronization",
               "Coordinating threads safely without destroying performance.", [
                "Race Conditions, Critical Sections, and Atomicity",
                "Locks: Spinlocks, Test-and-Set, Compare-and-Swap, and Mutexes",
                "Condition Variables and the Producer-Consumer Problem",
                "Semaphores, Readers-Writers, and Dining Philosophers",
                "Deadlock: Necessary Conditions, Prevention, Avoidance (Banker's Algorithm), and Detection",
            ]),
            _m("virtual_memory", "Memory Management and Virtual Memory",
               "Giving each process the illusion of a private, huge memory.", [
                "Address Translation, Base-and-Bounds, and Segmentation",
                "Paging and Multi-Level Page Tables",
                "Page Replacement Policies: FIFO, LRU, Clock, and Belady's Optimal",
                "Thrashing, Working Sets, and Memory-Mapped Files",
            ]),
            _m("file_systems", "Storage and File Systems",
               "Persistent data: from disk blocks to directories, and surviving crashes.", [
                "Hard Disks, SSDs, and I/O Scheduling",
                "File System Implementation: Inodes, Directories, and Block Allocation",
                "Crash Consistency: fsck vs. Journaling",
                "Log-Structured File Systems and Copy-on-Write",
                "RAID Levels and Reliability",
            ]),
        ]),
        _c("cs_330", "CS 330", "Computer Networks", 300, 4,
           "Understand how the Internet moves data reliably across unreliable links. You will write socket programs, analyze TCP congestion control, route packets, and trace real traffic through every protocol layer.",
           ["cs_210"], [
            _m("network_foundations", "Network Foundations and Layering",
               "The architecture and performance metrics of packet-switched networks.", [
                "Circuit Switching vs. Packet Switching",
                "Delay, Loss, and Throughput: Transmission, Propagation, Queuing, and Processing",
                "The Layered Model: OSI vs. TCP/IP and Encapsulation",
                "Capturing and Dissecting Packets with Wireshark and Scapy",
            ]),
            _m("application_layer", "Application Layer and Socket Programming",
               "The protocols users touch and how to write networked programs.", [
                "HTTP/1.1, HTTP/2, and HTTP/3: Requests, Responses, and Persistent Connections",
                "DNS: Hierarchy, Resolution, and Caching",
                "Socket Programming in Python: TCP and UDP Clients and Servers",
                "Content Delivery Networks and Peer-to-Peer Distribution",
            ]),
            _m("transport_layer", "Transport Layer: UDP and TCP",
               "Reliable, ordered, congestion-aware delivery over a best-effort network.", [
                "Reliable Data Transfer: Stop-and-Wait, Go-Back-N, and Selective Repeat",
                "TCP Connection Management: Three-Way Handshake and Teardown",
                "TCP Flow Control and Retransmission Timers",
                "Congestion Control: AIMD, Slow Start, CUBIC, and BBR",
                "Simulating TCP Congestion Windows in Python",
            ]),
            _m("network_layer", "Network Layer: IP and Routing",
               "Getting packets across many hops from source to destination.", [
                "IPv4 Addressing, Subnetting, CIDR, and NAT",
                "IPv6 and the Transition from IPv4",
                "Link-State (Dijkstra/OSPF) and Distance-Vector (Bellman-Ford/RIP) Routing",
                "Inter-Domain Routing with BGP",
                "Software-Defined Networking and the Data/Control Plane Split",
            ]),
            _m("link_layer", "Link Layer, Wireless, and Network Security Basics",
               "The last hop, and protecting traffic in transit.", [
                "Error Detection: Parity, Checksums, and CRC",
                "Ethernet, MAC Addresses, ARP, and Switches",
                "Wireless LANs: 802.11 and CSMA/CA",
                "TLS: Securing Connections with Handshakes and Certificates",
            ]),
        ]),
        _c("cs_520", "CS 520", "Advanced Operating Systems and Virtualization", 500, 3,
           "Read and reproduce landmark OS research. You will study kernel architectures, virtual machines and containers, modern storage stacks, and OS support for multicore scalability, and critique papers from SOSP and OSDI.",
           ["cs_320", "cs_310"], [
            _m("kernel_architectures", "Kernel Architectures",
               "Design space of OS kernels and their trade-offs.", [
                "Monolithic Kernels vs. Microkernels: Mach and L4",
                "Exokernels and Library Operating Systems",
                "Unikernels and Single-Address-Space Systems",
                "Formally Verified Kernels: The seL4 Case Study",
            ], lab=False),
            _m("virtualization", "Virtual Machines and Hypervisors",
               "Running operating systems on top of other operating systems.", [
                "Trap-and-Emulate and the Popek-Goldberg Requirements",
                "Binary Translation, Paravirtualization (Xen), and Hardware-Assisted Virtualization (VT-x)",
                "Memory Virtualization: Shadow Page Tables vs. Nested Paging",
                "I/O Virtualization, SR-IOV, and Live Migration",
            ], lab=False),
            _m("containers", "Containers and Lightweight Isolation",
               "OS-level virtualization behind modern cloud deployment.", [
                "Linux Namespaces and cgroups",
                "Container Images, Union File Systems, and OCI Runtimes",
                "MicroVMs and Sandboxes: Firecracker and gVisor",
                "eBPF: Safe Programmability Inside the Kernel",
            ]),
            _m("multicore_scalability", "Multicore Scalability and Synchronization",
               "Making kernels scale to hundreds of cores.", [
                "Scalable Locks: MCS Queue Locks and Lock Cohorting",
                "Read-Copy-Update (RCU) and Lock-Free Data Structures",
                "The Scalable Commutativity Rule",
                "Kernel-Bypass I/O: DPDK, io_uring, and RDMA",
            ]),
            _m("modern_storage", "Modern Storage Systems",
               "File systems and storage engines for flash and persistent memory.", [
                "Log-Structured Merge Trees and Flash-Friendly Storage",
                "Copy-on-Write File Systems: ZFS and Btrfs",
                "Persistent Memory Programming and Crash Consistency",
                "Reproducing a Classic OS Paper Experiment",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 5. Databases & Software Engineering
# ---------------------------------------------------------------------------------------------
DB_SE = {
    "id": "databases_software_engineering",
    "name": "Databases & Software Engineering",
    "icon": "🗄️",
    "description": "Managing data at scale and building software as a team: relational databases, transactions, testing, architecture, and delivery.",
    "courses": [
        _c("cs_220", "CS 220", "Software Engineering: Tools, Testing, and Teamwork", 200, 4,
           "Build software the way professional teams do. You will use Git workflows, write automated tests, apply code review and continuous integration, gather requirements, and ship an iterative team project.",
           ["cs_102"], [
            _m("process_requirements", "Software Process and Requirements",
               "How teams decide what to build and organize the work.", [
                "Software Lifecycles: Waterfall, Iterative, Agile, and Scrum",
                "Eliciting Requirements: User Stories, Use Cases, and Acceptance Criteria",
                "Estimation, Planning Poker, and Managing Technical Debt",
                "Ethics and Professional Responsibility in Software Engineering",
            ], lab=False),
            _m("version_control", "Version Control and Collaboration",
               "Git as the backbone of collaborative development.", [
                "Git Internals: Blobs, Trees, Commits, and Refs",
                "Branching, Merging, Rebasing, and Resolving Conflicts",
                "Pull Requests, Code Review Best Practices, and Style Guides",
                "Monorepos, Trunk-Based Development, and Release Branching",
            ]),
            _m("testing", "Software Testing",
               "Systematically finding defects before users do.", [
                "The Testing Pyramid: Unit, Integration, and End-to-End Tests",
                "Test-Driven Development: Red, Green, Refactor",
                "Black-Box Techniques: Equivalence Partitioning and Boundary Values",
                "Coverage Metrics and Mutation Testing",
                "Mocking, Dependency Injection, and Testing Legacy Code",
            ]),
            _m("ci_cd_quality", "Continuous Integration and Code Quality",
               "Automating builds, checks, and deployments.", [
                "Build Systems and Reproducible Builds",
                "Continuous Integration Pipelines with GitHub Actions",
                "Static Analysis, Linters, and Formatters",
                "Refactoring Catalog: Extract Function, Rename, and Replace Conditional with Polymorphism",
            ]),
            _m("team_project", "Team Project: From Idea to Release",
               "Applying the full process in a semester-long collaborative build.", [
                "Project Kickoff: Vision, Backlog, and Architecture Sketch",
                "Sprint Execution, Stand-Ups, and Burndown Tracking",
                "Writing Documentation: READMEs, API Docs, and Design Docs",
                "Retrospectives and Blameless Postmortems",
            ]),
        ]),
        _c("cs_340", "CS 340", "Database Systems", 300, 4,
           "Design, query, and understand relational databases. You will model data with ER diagrams, normalize schemas, write advanced SQL, and learn how indexes, query optimizers, and transactions work inside a DBMS.",
           ["cs_151", "math_discrete_1"], [
            _m("relational_model", "The Relational Model and Algebra",
               "The mathematical foundation of relational databases.", [
                "Why Databases? Data Independence and the DBMS Architecture",
                "Relations, Keys, and Integrity Constraints",
                "Relational Algebra: Selection, Projection, Join, Union, and Division",
                "Relational Calculus and the Declarative Query Idea",
            ]),
            _m("sql", "SQL in Depth",
               "Writing expressive and efficient queries.", [
                "SQL Basics: SELECT, WHERE, ORDER BY, and Aggregates with GROUP BY / HAVING",
                "Joins: Inner, Outer, Self-Joins, and Anti-Joins",
                "Subqueries, Common Table Expressions, and Recursive Queries",
                "Window Functions for Ranking and Running Totals",
                "Accessing Databases from Python with sqlite3 and SQLAlchemy",
            ]),
            _m("design_normalization", "Database Design and Normalization",
               "Designing schemas that avoid redundancy and anomalies.", [
                "Entity-Relationship Modeling and Mapping ER Diagrams to Tables",
                "Functional Dependencies and Armstrong's Axioms",
                "Normal Forms: 1NF, 2NF, 3NF, and BCNF",
                "Decomposition, Lossless Joins, and Dependency Preservation",
            ]),
            _m("storage_indexing", "Storage, Indexing, and Query Processing",
               "How a DBMS physically stores data and executes queries.", [
                "Disk Pages, Heap Files, and Buffer Pool Management",
                "B+ Tree Indexes and Hash Indexes",
                "Join Algorithms: Nested Loop, Sort-Merge, and Hash Join",
                "Query Optimization: Cost Models, Cardinality Estimation, and Reading EXPLAIN Plans",
            ]),
            _m("transactions", "Transactions, Concurrency Control, and Recovery",
               "Keeping data correct under concurrency and crashes.", [
                "ACID Properties and Transaction Schedules",
                "Serializability and Two-Phase Locking",
                "Isolation Levels, MVCC, and Snapshot Isolation Anomalies",
                "Write-Ahead Logging and ARIES Recovery",
                "NoSQL Overview: Key-Value, Document, Column, and Graph Stores",
            ]),
        ]),
        _c("cs_440", "CS 440", "Software Architecture and Senior Capstone", 400, 5,
           "Architect, build, and operate a substantial software system end to end. You will choose architectural styles, design APIs, plan for reliability and observability, and deliver a capstone project with a team.",
           ["cs_220", "cs_340"], [
            _m("architecture_styles", "Architectural Styles and Quality Attributes",
               "High-level structures and the trade-offs they encode.", [
                "Quality Attributes: Performance, Availability, Modifiability, and Security",
                "Layered, Hexagonal, and Clean Architectures",
                "Monoliths vs. Microservices vs. Serverless",
                "Event-Driven Architecture, Message Queues, and Event Sourcing",
                "Architecture Decision Records and Design Reviews",
            ], lab=False),
            _m("api_design", "API Design and Integration",
               "Designing interfaces that last.", [
                "RESTful Resource Design and HTTP Semantics",
                "gRPC, Protocol Buffers, and Schema Evolution",
                "GraphQL and Client-Driven Queries",
                "Versioning, Pagination, Idempotency, and Rate Limiting",
                "Building and Testing a REST API in Python with Flask",
            ]),
            _m("reliability_ops", "Reliability, Observability, and Operations",
               "Running software in production.", [
                "Site Reliability Engineering: SLIs, SLOs, and Error Budgets",
                "Logging, Metrics, and Distributed Tracing",
                "Containers, Kubernetes, and Infrastructure as Code",
                "Incident Response and Chaos Engineering",
            ]),
            _m("secure_maintainable", "Security, Performance, and Maintainability",
               "Engineering concerns that span the whole system.", [
                "Threat Modeling with STRIDE and the OWASP Top 10",
                "Profiling and Performance Optimization in Python",
                "Caching Strategies: CDNs, Redis, and Cache Invalidation",
                "Working Effectively with Legacy Systems and Large Refactors",
            ]),
            _m("capstone", "Senior Capstone Project",
               "A team-built system demonstrating the full degree.", [
                "Capstone Proposal: Problem Statement, Stakeholders, and Requirements",
                "System Design Document and Architecture Review",
                "Iterative Implementation with CI/CD and Code Review",
                "Testing, Load Testing, and Deployment",
                "Final Demo, Technical Report, and Project Retrospective",
            ]),
        ]),
        _c("cs_540", "CS 540", "Database System Internals", 500, 3,
           "Build the guts of a modern database engine. You will implement storage engines, query optimizers, and concurrency control protocols, and study analytical column stores and distributed SQL systems from the research literature.",
           ["cs_340", "cs_320"], [
            _m("storage_engines", "Storage Engines",
               "Physical data organization for transactional and analytical workloads.", [
                "Slotted Pages, Record Formats, and Buffer Replacement Policies",
                "B-Tree Variants: B-link Trees and Bw-Trees",
                "LSM-Tree Storage Engines: Compaction and Write Amplification",
                "Column Stores, Compression, and Vectorized Execution",
            ]),
            _m("query_optimization", "Query Optimization",
               "Finding fast plans in an exponential search space.", [
                "System R Dynamic Programming Join Enumeration",
                "Cascades/Volcano Optimizer Frameworks",
                "Cardinality Estimation: Histograms, Sketches, and Learned Estimators",
                "Adaptive Query Processing",
            ]),
            _m("execution_models", "Query Execution Models",
               "How operators are wired together and executed.", [
                "Iterator (Volcano) Model vs. Vectorized vs. Push-Based Execution",
                "Query Compilation with LLVM (HyPer Style)",
                "Parallel Query Execution and Morsel-Driven Parallelism",
                "Implementing a Mini Query Engine in Python",
            ]),
            _m("advanced_concurrency", "Advanced Concurrency Control and Recovery",
               "Transaction processing at in-memory speeds.", [
                "Optimistic Concurrency Control and Timestamp Ordering",
                "Serializable Snapshot Isolation",
                "In-Memory OLTP: Silo and Hekaton",
                "Recovery for Main-Memory Databases and Checkpointing",
            ], lab=False),
            _m("distributed_databases", "Distributed and Cloud Databases",
               "Scaling databases across machines and data centers.", [
                "Partitioning, Replication, and Distributed Joins",
                "Distributed Transactions: Two-Phase Commit and Its Failure Modes",
                "Spanner, CockroachDB, and Globally Consistent SQL",
                "Cloud-Native Analytics: Disaggregated Storage in Snowflake and BigQuery",
            ], lab=False),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 6. Theory of Computation
# ---------------------------------------------------------------------------------------------
THEORY = {
    "id": "theory_of_computation",
    "name": "Theory of Computation",
    "icon": "♾️",
    "description": "What can be computed, and at what cost: automata, formal languages, computability, and computational complexity.",
    "courses": [
        _c("cs_360", "CS 360", "Automata, Formal Languages, and Computability", 300, 4,
           "Characterize the power of different models of computation. You will build finite automata and grammars, prove languages non-regular or non-context-free, and prove problems undecidable using reductions.",
           ["cs_250", "math_discrete_1"], [
            _m("finite_automata", "Finite Automata and Regular Languages",
               "The simplest model of computation and the languages it recognizes.", [
                "Deterministic Finite Automata and Their Formal Definition",
                "Nondeterministic Finite Automata and the Subset Construction",
                "Regular Expressions and Kleene's Theorem",
                "DFA Minimization and the Myhill-Nerode Theorem",
                "Implementing a Regex-to-NFA-to-DFA Compiler in Python",
            ]),
            _m("nonregular", "Limits of Regular Languages",
               "Proving that some languages need more power.", [
                "The Pumping Lemma for Regular Languages",
                "Closure Properties and Proofs of Non-Regularity",
                "Decision Problems for Regular Languages",
            ], lab=False),
            _m("context_free", "Context-Free Grammars and Pushdown Automata",
               "Recursive structure in languages, the basis of parsing.", [
                "Context-Free Grammars, Derivations, and Parse Trees",
                "Ambiguity and Chomsky Normal Form",
                "Pushdown Automata and Their Equivalence with CFGs",
                "The Pumping Lemma for Context-Free Languages",
                "The CYK Parsing Algorithm",
            ]),
            _m("turing_machines", "Turing Machines and the Church-Turing Thesis",
               "A universal model of computation.", [
                "Turing Machines: Definition, Configurations, and Examples",
                "Variants: Multitape and Nondeterministic Turing Machines",
                "The Church-Turing Thesis and Universal Turing Machines",
                "Writing a Turing Machine Simulator in Python",
            ]),
            _m("decidability", "Decidability and Reductions",
               "Problems no algorithm can ever solve.", [
                "Decidable and Recognizable Languages",
                "Diagonalization and the Undecidability of the Halting Problem",
                "Mapping Reductions and Rice's Theorem",
                "The Post Correspondence Problem and Undecidability in Practice",
            ], lab=False),
        ]),
        _c("cs_460", "CS 460", "Computational Complexity", 400, 4,
           "Classify problems by the resources needed to solve them. You will prove NP-completeness, explore space complexity, the polynomial hierarchy, and randomized classes, and understand why P vs. NP matters.",
           ["cs_360"], [
            _m("time_complexity", "Time Complexity and P vs. NP",
               "Formalizing efficient computation and verification.", [
                "Time-Bounded Turing Machines and the Class P",
                "NP via Verifiers and Nondeterminism",
                "The Cook-Levin Theorem",
                "A Gallery of NP-Complete Reductions: Clique, Subset Sum, and 3-Coloring",
            ], lab=False),
            _m("space_complexity", "Space Complexity",
               "Memory as a computational resource.", [
                "Savitch's Theorem and PSPACE",
                "PSPACE-Completeness: TQBF and Generalized Games",
                "Logarithmic Space: L, NL, and Directed Reachability",
                "The Immerman-Szelepcsényi Theorem (NL = coNL)",
            ], lab=False),
            _m("hierarchies", "Hierarchy Theorems and the Polynomial Hierarchy",
               "Structure among complexity classes.", [
                "Time and Space Hierarchy Theorems via Diagonalization",
                "Oracles, Relativization, and the Baker-Gill-Solovay Barrier",
                "The Polynomial Hierarchy and Alternation",
                "coNP and the Structure of NP Under P != NP (Ladner's Theorem)",
            ], lab=False),
            _m("randomized_complexity", "Randomized Computation",
               "Complexity classes that use coin flips.", [
                "Probabilistic Turing Machines: BPP, RP, and ZPP",
                "Polynomial Identity Testing and the Schwartz-Zippel Lemma",
                "BPP Is in the Polynomial Hierarchy (Sipser-Gács-Lautemann)",
                "Experimenting with Randomized Identity Testing in Python",
            ]),
            _m("circuits_interactive", "Circuits and Interactive Proofs",
               "Non-uniform computation and proofs as conversations.", [
                "Boolean Circuits, P/poly, and the Karp-Lipton Theorem",
                "Interactive Proof Systems and Graph Non-Isomorphism",
                "IP = PSPACE (Overview)",
                "Zero-Knowledge Proofs: Definitions and Examples",
            ], lab=False),
        ]),
        _c("cs_660", "CS 660", "Advanced Complexity Theory", 600, 3,
           "Engage with research-level complexity theory. You will study PCPs and hardness of approximation, pseudorandomness and derandomization, circuit lower bounds, and fine-grained complexity, culminating in a survey or research project.",
           ["cs_460", "math_prob_1"], [
            _m("pcp", "Probabilistically Checkable Proofs and Hardness of Approximation",
               "Why approximating many problems is as hard as solving them exactly.", [
                "The PCP Theorem Statement and Equivalence with Gap Problems",
                "Dinur's Combinatorial Proof via Gap Amplification",
                "Håstad's Optimal Inapproximability for MAX-3SAT",
                "The Unique Games Conjecture and Its Consequences",
            ], lab=False),
            _m("pseudorandomness", "Pseudorandomness and Derandomization",
               "Replacing true randomness with structured objects.", [
                "Expander Graphs and Random Walks",
                "Pseudorandom Generators and the Nisan-Wigderson Construction",
                "Hardness vs. Randomness: Impagliazzo-Wigderson",
                "Randomness Extractors and Their Applications",
            ]),
            _m("circuit_lower_bounds", "Circuit and Proof Complexity Lower Bounds",
               "The frontier of proving computational hardness.", [
                "AC0 Lower Bounds: Håstad's Switching Lemma and Parity",
                "Razborov-Smolensky Polynomial Method",
                "The Natural Proofs Barrier and Algebrization",
                "Proof Complexity: Resolution Lower Bounds for the Pigeonhole Principle",
            ], lab=False),
            _m("fine_grained", "Fine-Grained Complexity",
               "Exact exponents for polynomial-time problems.", [
                "The Strong Exponential Time Hypothesis (SETH)",
                "3SUM-Hardness and Computational Geometry",
                "All-Pairs Shortest Paths Equivalences",
                "Conditional Lower Bounds for Edit Distance and LCS",
            ], lab=False),
            _m("research_seminar", "Research Seminar in Complexity",
               "Reading, presenting, and extending current work.", [
                "Reading a Complexity Paper: Structure, Techniques, and Open Problems",
                "Algebraic Complexity: VP vs. VNP and Geometric Complexity Theory",
                "Quantum Complexity Classes: BQP and Its Relationship to PH",
                "Writing a Research Survey or Original Result",
            ], lab=False),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 7. Programming Languages & Compilers
# ---------------------------------------------------------------------------------------------
PL_COMPILERS = {
    "id": "programming_languages_compilers",
    "name": "Programming Languages & Compilers",
    "icon": "🔤",
    "description": "How languages are defined, implemented, and made safe: semantics, interpreters, type systems, compilers, and program verification.",
    "courses": [
        _c("cs_370", "CS 370", "Programming Languages: Semantics and Interpreters", 300, 4,
           "Understand programming languages by implementing them. You will write interpreters for increasingly rich languages, formalize their semantics, and compare scoping, evaluation strategies, type systems, and paradigms.",
           ["cs_201", "cs_250"], [
            _m("syntax_interpreters", "Syntax and Your First Interpreter",
               "From concrete syntax to abstract syntax trees and evaluation.", [
                "Concrete vs. Abstract Syntax and S-Expressions",
                "Writing an Arithmetic Expression Interpreter in Python",
                "Environments, Variable Binding, and Substitution",
                "First-Class Functions and Closures in an Interpreter",
                "Static vs. Dynamic Scope",
            ]),
            _m("semantics", "Formal Semantics",
               "Precise mathematical meanings for programs.", [
                "Operational Semantics: Big-Step and Small-Step",
                "The Lambda Calculus: Syntax, Beta-Reduction, and Church Encodings",
                "Evaluation Strategies: Call-by-Value, Call-by-Name, and Call-by-Need",
                "Denotational Semantics in Brief",
            ], lab=False),
            _m("state_control", "State, Control, and Continuations",
               "Mutation, exceptions, and advanced control flow.", [
                "Mutable State, Stores, and Aliasing",
                "Implementing Exceptions in an Interpreter",
                "Continuations and Continuation-Passing Style",
                "Generators, Coroutines, and async/await Under the Hood",
            ]),
            _m("types", "Type Systems",
               "Catching errors before programs run.", [
                "Type Checking a Simply Typed Language",
                "Type Soundness: Progress and Preservation",
                "Hindley-Milner Type Inference and Unification",
                "Polymorphism: Parametric, Ad Hoc, and Subtype",
                "Gradual Typing and Python Type Hints",
            ]),
            _m("paradigms", "Language Paradigms and Design",
               "Comparing how languages organize computation.", [
                "Object Systems: Classes, Prototypes, and Dynamic Dispatch",
                "Logic Programming and Unification with a Mini-Prolog",
                "Memory Management Strategies: GC, Reference Counting, and Rust Ownership",
                "Domain-Specific Languages and Macros",
            ]),
        ]),
        _c("cs_470", "CS 470", "Compiler Construction", 400, 4,
           "Build a working compiler from source text to machine code. You will implement lexing, parsing, semantic analysis, intermediate representations, optimization passes, register allocation, and code generation.",
           ["cs_370", "cs_210", "cs_360"], [
            _m("lexing_parsing", "Lexical Analysis and Parsing",
               "Turning a stream of characters into a syntax tree.", [
                "Lexers: Tokens, Regular Expressions, and Maximal Munch",
                "Recursive-Descent and LL(1) Parsing",
                "LR Parsing: LR(0), SLR, and LALR Tables",
                "Pratt Parsing for Operator Precedence",
                "Error Recovery and Helpful Diagnostics",
            ]),
            _m("semantic_analysis", "Semantic Analysis",
               "Checking that programs make sense.", [
                "Symbol Tables and Nested Scopes",
                "Type Checking and Attribute Grammars",
                "Name Resolution, Overloading, and Implicit Conversions",
                "Building a Typed AST for a Small Language",
            ]),
            _m("intermediate_representation", "Intermediate Representations",
               "Machine-independent forms that enable optimization.", [
                "Three-Address Code and Control-Flow Graphs",
                "Static Single Assignment Form and Phi Functions",
                "Constructing SSA with Dominance Frontiers",
                "A Tour of LLVM IR",
            ]),
            _m("optimization", "Program Analysis and Optimization",
               "Making code faster without changing its meaning.", [
                "Dataflow Analysis: Reaching Definitions, Liveness, and Available Expressions",
                "Constant Propagation, Dead Code Elimination, and Common Subexpression Elimination",
                "Loop Optimizations: Invariant Code Motion, Strength Reduction, and Unrolling",
                "Inlining and Interprocedural Analysis",
            ]),
            _m("code_generation", "Code Generation and Runtime Systems",
               "From IR to executable machine code.", [
                "Instruction Selection by Tree Pattern Matching",
                "Register Allocation by Graph Coloring and Linear Scan",
                "Instruction Scheduling for Pipelined Processors",
                "Runtime Support: Activation Records, Closures, and Garbage Collectors",
                "Just-in-Time Compilation: Tracing JITs and Inline Caches",
            ]),
        ]),
        _c("cs_570", "CS 570", "Type Systems and Program Verification", 500, 3,
           "Prove programs correct with mathematical rigor. You will study advanced type systems, Hoare logic, model checking, and interactive theorem proving, and verify real programs with modern tools.",
           ["cs_370", "cs_360"], [
            _m("advanced_types", "Advanced Type Systems",
               "Types expressive enough to encode program properties.", [
                "System F and Parametricity (Theorems for Free)",
                "Dependent Types and the Curry-Howard Correspondence",
                "Linear and Affine Types: Resource Safety and Rust's Borrow Checker",
                "Effect Systems and Refinement Types",
            ], lab=False),
            _m("hoare_logic", "Hoare Logic and Deductive Verification",
               "Reasoning about imperative programs with pre- and post-conditions.", [
                "Hoare Triples and Proof Rules for Imperative Programs",
                "Weakest Preconditions and Verification Condition Generation",
                "Loop Invariants and Termination Measures",
                "Separation Logic for Heap-Manipulating Programs",
            ], lab=False),
            _m("model_checking", "Model Checking and Temporal Logic",
               "Automatically exploring all behaviors of a system.", [
                "Kripke Structures, LTL, and CTL",
                "Explicit-State Model Checking and State-Space Explosion",
                "Symbolic Model Checking with BDDs and SAT-Based Bounded Model Checking",
                "Specifying Concurrent Systems with TLA+",
            ]),
            _m("smt_static_analysis", "SMT Solvers and Static Analysis",
               "Automated reasoning engines behind modern verification tools.", [
                "SAT Solving with DPLL and CDCL",
                "SMT Theories and Using Z3 from Python",
                "Abstract Interpretation: Lattices, Widening, and Soundness",
                "Symbolic Execution and Concolic Testing",
            ]),
            _m("theorem_proving", "Interactive Theorem Proving",
               "Machine-checked proofs of program correctness.", [
                "Introduction to Lean/Coq: Propositions as Types",
                "Inductive Proofs about Functional Programs",
                "Verifying a Sorting Algorithm End to End",
                "Case Studies: CompCert and Verified Cryptography",
            ], lab=False),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# 8. Distributed, Parallel & Secure Systems
# ---------------------------------------------------------------------------------------------
DISTRIBUTED_SECURITY = {
    "id": "distributed_parallel_security",
    "name": "Distributed, Parallel & Secure Systems",
    "icon": "🔐",
    "description": "Computing across many cores and many machines, and defending systems against adversaries.",
    "courses": [
        _c("cs_410", "CS 410", "Parallel Programming and Concurrency", 400, 4,
           "Write programs that exploit multicore CPUs, GPUs, and clusters. You will reason about parallel speedup, use threads, message passing, and data-parallel frameworks, and avoid races with correct synchronization and lock-free techniques.",
           ["cs_320", "cs_310"], [
            _m("parallel_models", "Models of Parallel Computation",
               "How to think about and measure parallel algorithms.", [
                "Work, Span, and Brent's Theorem",
                "Amdahl's vs. Gustafson's Law and Strong vs. Weak Scaling",
                "PRAM, Fork-Join, and Bulk Synchronous Parallel Models",
                "Parallel Prefix Sum (Scan) and Its Many Applications",
            ]),
            _m("shared_memory", "Shared-Memory Programming",
               "Threads, tasks, and synchronization on multicore machines.", [
                "Threads, Thread Pools, and Python's GIL vs. multiprocessing",
                "OpenMP-Style Parallel Loops and Work Stealing",
                "Memory Models, Atomics, and Happens-Before",
                "Lock-Free Stacks and Queues and the ABA Problem",
                "Detecting Data Races and Deadlocks with Tools",
            ]),
            _m("message_passing", "Message Passing and Clusters",
               "Programming distributed-memory machines.", [
                "MPI Fundamentals: Point-to-Point Communication",
                "Collective Operations: Broadcast, Reduce, and All-Reduce",
                "Domain Decomposition and Halo Exchange",
                "Using mpi4py for Parallel Python Programs",
            ]),
            _m("gpu_programming", "GPU and Data-Parallel Programming",
               "Massively parallel computation on accelerators.", [
                "The CUDA Programming Model: Grids, Blocks, and Threads",
                "Memory Hierarchy on GPUs: Global, Shared, and Registers",
                "Parallel Reduction and Matrix Multiplication Kernels",
                "Writing GPU Kernels from Python with Numba",
            ]),
            _m("parallel_algorithms", "Parallel Algorithms and Frameworks",
               "Classic parallel algorithms and high-level frameworks.", [
                "Parallel Sorting: Bitonic Sort and Sample Sort",
                "Parallel Graph Algorithms: BFS and Connected Components",
                "MapReduce and Apache Spark Programming Models",
                "Asynchronous Programming and the Actor Model",
            ]),
        ]),
        _c("cs_430", "CS 430", "Computer Security", 400, 4,
           "Think like an attacker to build defensible systems. You will apply cryptographic primitives correctly, exploit and mitigate memory-safety bugs, secure web applications and networks, and design systems using least privilege and defense in depth.",
           ["cs_320", "cs_330"], [
            _m("security_principles", "Security Principles and Threat Modeling",
               "Foundational concepts for reasoning about security.", [
                "The CIA Triad, Threat Models, and Attack Surfaces",
                "Saltzer-Schroeder Design Principles: Least Privilege, Fail-Safe Defaults, and Complete Mediation",
                "Access Control Models: DAC, MAC, RBAC, and Capabilities",
                "Security Economics and Usable Security",
            ], lab=False),
            _m("applied_crypto", "Applied Cryptography",
               "Using cryptographic building blocks correctly.", [
                "Symmetric Encryption: Block Ciphers, Modes of Operation, and Authenticated Encryption",
                "Cryptographic Hash Functions, MACs, and Password Hashing",
                "Public-Key Cryptography: RSA, Diffie-Hellman, and Digital Signatures",
                "Public Key Infrastructure, Certificates, and TLS 1.3",
                "Common Crypto Pitfalls Demonstrated in Python",
            ]),
            _m("software_security", "Software and Memory Safety",
               "How programs are exploited and how to stop it.", [
                "Stack Buffer Overflows and Shellcode",
                "Mitigations: Stack Canaries, DEP/NX, and ASLR",
                "Return-Oriented Programming and Control-Flow Integrity",
                "Fuzzing with AFL and libFuzzer",
                "Memory-Safe Languages and Sandboxing",
            ]),
            _m("web_security", "Web Security",
               "Attacks and defenses in browsers and web servers.", [
                "The Same-Origin Policy and Cookies",
                "SQL Injection and Parameterized Queries",
                "Cross-Site Scripting (XSS) and Content Security Policy",
                "Cross-Site Request Forgery and Authentication/Session Management",
            ]),
            _m("network_os_security", "Network and Operating System Security",
               "Defending infrastructure.", [
                "Network Attacks: Spoofing, ARP Poisoning, and DDoS",
                "Firewalls, Intrusion Detection, and Zero-Trust Networking",
                "OS Hardening, Privilege Escalation, and Rootkits",
                "Side-Channel Attacks: Timing, Cache, and Spectre",
            ]),
        ]),
        _c("cs_450", "CS 450", "Distributed Systems", 400, 4,
           "Build systems that keep working when machines and networks fail. You will reason about time, consistency, and fault tolerance, implement replication and consensus, and analyze the design of real large-scale systems.",
           ["cs_320", "cs_330"], [
            _m("dist_foundations", "Foundations: Communication, Failure, and Time",
               "What makes distributed computing fundamentally hard.", [
                "Why Distribute? Scalability, Fault Tolerance, and Latency",
                "Remote Procedure Calls and Their Failure Semantics",
                "Failure Models: Crash, Omission, and Byzantine; Synchrony Assumptions",
                "Physical Clocks, NTP, and Lamport Logical Clocks",
                "Vector Clocks and Causal Ordering",
            ]),
            _m("replication_consistency", "Replication and Consistency",
               "Keeping copies of data in agreement.", [
                "Primary-Backup Replication and State Machine Replication",
                "Consistency Models: Linearizability, Sequential, Causal, and Eventual",
                "The CAP Theorem and the PACELC Trade-off",
                "Quorums and Dynamo-Style Leaderless Replication",
                "CRDTs: Conflict-Free Replicated Data Types",
            ]),
            _m("consensus", "Consensus",
               "Agreeing on a value despite failures.", [
                "The FLP Impossibility Result",
                "Paxos: Single-Decree and Multi-Paxos",
                "Raft: Leader Election, Log Replication, and Safety",
                "Implementing Raft in Python and Testing with Fault Injection",
            ]),
            _m("dist_transactions_storage", "Distributed Transactions and Storage",
               "Atomicity and scale across partitions.", [
                "Two-Phase Commit and Three-Phase Commit",
                "Consistent Hashing and Partitioning",
                "Distributed File Systems: GFS and HDFS",
                "Bigtable, Cassandra, and Wide-Column Stores",
            ]),
            _m("dist_case_studies", "Large-Scale Systems Case Studies",
               "Learning from production systems.", [
                "MapReduce and Spark: Fault-Tolerant Batch Processing",
                "Stream Processing with Kafka and Flink",
                "ZooKeeper and Coordination Services",
                "Byzantine Fault Tolerance and Blockchains (PBFT, Nakamoto Consensus)",
            ], lab=False),
        ]),
        _c("cs_610", "CS 610", "Advanced Distributed Systems Research", 600, 3,
           "Engage with the frontier of distributed-systems research. You will analyze cutting-edge papers on consensus, geo-distributed storage, formal verification of distributed protocols, and serverless/datacenter systems, and complete an original research project.",
           ["cs_450", "cs_520"], [
            _m("advanced_consensus", "Advanced Consensus Protocols",
               "Beyond Paxos and Raft.", [
                "EPaxos and Leaderless Consensus",
                "Flexible Paxos and Quorum Intersection Generalizations",
                "HotStuff and Modern Byzantine Consensus",
                "Consensus at Scale: Sharding and Reconfiguration",
            ], lab=False),
            _m("geo_distributed", "Geo-Distributed Storage and Transactions",
               "Systems spanning continents.", [
                "Spanner and TrueTime: External Consistency",
                "Calvin and Deterministic Database Systems",
                "Causal+ Consistency: COPS and Eiger",
                "Low-Latency Geo-Replication and Transactional CRDTs",
            ], lab=False),
            _m("verification_testing", "Verifying and Testing Distributed Systems",
               "Gaining confidence in protocols that are notoriously hard to get right.", [
                "Specifying Protocols in TLA+ and Model Checking Raft",
                "Verified Distributed Systems: IronFleet and Verdi",
                "Jepsen-Style Testing and Linearizability Checking",
                "Deterministic Simulation Testing (FoundationDB Style)",
            ]),
            _m("datacenter_systems", "Datacenter and Serverless Systems",
               "The infrastructure behind cloud computing.", [
                "Cluster Scheduling: Borg, Mesos, and Kubernetes",
                "Serverless Computing: Cold Starts and State Management",
                "Tail Latency at Scale and Hedged Requests",
                "RDMA and Disaggregated Datacenter Architectures",
            ], lab=False),
            _m("research_project", "Graduate Research Project",
               "Conducting and communicating original systems research.", [
                "Identifying a Research Problem and Writing a Proposal",
                "Experimental Methodology and Benchmarking Distributed Systems",
                "Building and Evaluating a Research Prototype",
                "Writing and Presenting a Systems Research Paper",
            ]),
        ]),
    ],
}


# ---------------------------------------------------------------------------------------------
# Exported Domain
# ---------------------------------------------------------------------------------------------
DOMAIN = {
    "id": "computer_science",
    "name": "Computer Science",
    "icon": "💻",
    "color": "#0ea5e9",
    "tagline": "From your first Python program to compilers, consensus protocols, and the limits of computation.",
    "description": (
        "A complete university computer science program. Begin with Python programming, data structures, and how computers work at the "
        "bit level; advance through algorithms, operating systems, networks, databases, and software engineering; and finish with "
        "graduate study in complexity theory, program verification, database internals, and distributed-systems research."
    ),
    "subjects": [
        PROGRAMMING,
        DSA,
        SYSTEMS_ARCH,
        OS_NETWORKS,
        DB_SE,
        THEORY,
        PL_COMPILERS,
        DISTRIBUTED_SECURITY,
    ],
}
