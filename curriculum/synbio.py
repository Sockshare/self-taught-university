# Synthetic Biology, Bioinformatics & Longevity Science curriculum catalog for Self-Taught.

DOMAIN = {'id': 'synbio',
 'name': 'Synthetic Biology, Bioinformatics & Longevity Science',
 'icon': '🧪',
 'color': '#22c55e',
 'tagline': 'From genomics algorithms and AlphaFold/RFdiffusion protein design to CRISPR prime editing, '
            'genetic circuits, and cellular longevity.',
 'description': 'An end-to-end bioengineering curriculum spanning computational genomics and '
                'sequence-to-function foundation models, biomolecular physics and generative protein/enzyme '
                'design, synthetic gene circuits and CRISPR genome engineering, and systems biology of '
                'cellular aging and rejuvenation.',
 'subjects': [{'id': 'genomics_bioinformatics',
               'name': 'Genomics Algorithms & Computational Bioinformatics',
               'icon': '🧬',
               'description': 'Sequence alignment (Needleman–Wunsch/Smith–Waterman), Burrows–Wheeler '
                              'FM-indexes, De Bruijn graph assembly, variant calling, single-cell '
                              'transcriptomics, and population genetics.',
               'courses': [{'id': 'bio_110',
                            'code': 'BIO 110',
                            'title': 'Sequence Alignment, Dynamic Programming, HMMs & Read Mapping',
                            'level': 100,
                            'credits': 4,
                            'description': 'Master the foundational algorithms of computational genomics: '
                                           'global/local dynamic programming alignment, affine gap '
                                           'penalties, Burrows–Wheeler FM-indexes, and profile Hidden Markov '
                                           'Models.',
                            'prerequisites': [],
                            'modules': [{'id': 'pairwise_dp_alignment',
                                         'title': 'Global & Local Sequence Alignment: Needleman–Wunsch & '
                                                  'Smith–Waterman',
                                         'summary': 'Dynamic programming recurrences, BLOSUM/PAM log-odds '
                                                    'substitution matrices, Gotoh affine gap penalties, and '
                                                    'Hirschberg linear-space divide-and-conquer.',
                                         'lab': True,
                                         'lessons': ['Dot Matrices, Edit Distance, and Formulating Sequence '
                                                     'Alignment as a Longest Path on a Manhattan Grid DAG',
                                                     'Needleman–Wunsch Global Alignment Recurrence and '
                                                     'Backtracking Pointer Reconstruction',
                                                     'Smith–Waterman Local Alignment: Zero-Floor Reset for '
                                                     'Discovering Conserved Domain Islands',
                                                     'Deriving PAM (Dayhoff Markov Evolution) and BLOSUM '
                                                     '(Henikoff Conserved Block) Log-Odds Substitution '
                                                     'Matrices',
                                                     "Gotoh's Three-Matrix O(mn) Algorithm for Biologically "
                                                     'Realistic Affine Gap Penalties gamma(k) = d + (k-1)*e',
                                                     "Hirschberg's Divide-and-Conquer Algorithm: Reducing "
                                                     'Global Alignment Memory from O(mn) to Linear O(m + n)',
                                                     "SIMD Striped Vectorization (Farrar's Algorithm) for "
                                                     'Ultra-Fast Smith–Waterman Database Scanning',
                                                     'Frontier Research & Open Problems: Global & Local '
                                                     'Sequence Alignment: Needleman–Wunsch & Smith–Waterman'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'blast_kmer_seeding',
                                         'title': 'Heuristic Database Search: BLAST, Spaced Seeds, MinHash & '
                                                  'Karlin–Altschul Statistics',
                                         'summary': 'Seed-and-extend heuristics, spaced seed sensitivity, '
                                                    'Gumbel extreme-value E-values, and Mash/Sourmash '
                                                    'MinHash sketching.',
                                         'lab': True,
                                         'lessons': ['Why Exact O(mn) Dynamic Programming Cannot Scan '
                                                     'Terabase Sequence Repositories at Interactive Speeds',
                                                     'The BLAST Seed-and-Extend Pipeline: High-Scoring '
                                                     'Segment Pairs (HSPs), Two-Hit Seeding, and X-Drop '
                                                     'Extension',
                                                     'Ma–Tromp–Li Spaced Seeds (111010010100110111): Why '
                                                     'Non-Contiguous Masks Boost Homology Sensitivity',
                                                     'Karlin–Altschul Statistics: Random Walk Excursion '
                                                     'Theory and Gumbel Extreme-Value Distribution of Bit '
                                                     'Scores and E-Values',
                                                     'Minimizers (Roberts–cherkassky) and Syncmers for '
                                                     'Memory-Frugal K-Mer Subsampling (Minimap2)',
                                                     "Ondov's Mash: Estimating Whole-Genome Jaccard and "
                                                     'Mutation Distance in Microseconds via MinHash Sketches',
                                                     'Progressive Multiple Sequence Alignment: Clustal, '
                                                     'MUSCLE, and MAFFT Fast Fourier Transform Homology',
                                                     'Frontier Research & Open Problems: Heuristic Database '
                                                     'Search: BLAST, Spaced Seeds, MinHash & Karlin–Altschul '
                                                     'Statistics'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'bwt_fm_index_mapping',
                                         'title': 'Suffix Arrays, Burrows–Wheeler Transform (BWT) & '
                                                  'Ferragina–Manzini (FM) Indexes',
                                         'summary': 'Compressing the 3-gigabase human genome into <2 GB RAM '
                                                    'while supporting O(|P|) exact/inexact read alignment in '
                                                    'Bowtie2 and BWA-MEM.',
                                         'lab': True,
                                         'lessons': ['Suffix Trees (Ukkonen O(N)), Suffix Arrays '
                                                     '(Manber–Myers), and Longest Common Prefix (LCP) Arrays',
                                                     'The Burrows–Wheeler Transform (BWT): Reversible '
                                                     'Block-Sorting Permutation Clustering Identical '
                                                     'Contexts',
                                                     'The Last-to-First (LF) Column Mapping Property and '
                                                     'Ferragina–Manzini (FM) Backward Search in O(|Query|) '
                                                     'Time!',
                                                     'Rank Checkpoints and Wavelet Trees for Sub-Linear '
                                                     'Memory Footprint in Bowtie2 and BWA-MEM2',
                                                     'Inexact Backtracking Search with Seed-and-Extend '
                                                     'Chains and Maximal Exact Matches (SMEMs)',
                                                     'Bidirectional BWT and the r-Index '
                                                     '(Gagie–Navarro–Prezza) for Pangenome Reference '
                                                     'Collections',
                                                     'SAM/BAM/CRAM Binary Alignment Formats, CIGAR Strings, '
                                                     'and Mapping Quality (MAPQ) Phred Calibration',
                                                     'Frontier Research & Open Problems: Suffix Arrays, '
                                                     'Burrows–Wheeler Transform (BWT) & Ferragina–Manzini '
                                                     '(FM) Indexes'],
                                         'sim': 'tokenizer'},
                                        {'id': 'profile_hmms_gene_finding',
                                         'title': 'Hidden Markov Models in Genomics: Viterbi, '
                                                  'Forward-Backward & Pfam Profiles',
                                         'summary': 'CpG island detection, generalized HMM eukaryotic '
                                                    'splice-site gene finding, and Krogh–Eddy profile HMMs '
                                                    '(HMMER3).',
                                         'lab': True,
                                         'lessons': ['Markov Chains for CpG Island Dinucleotide Methylation '
                                                     'Depletion Log-Likelihood Scoring',
                                                     'Hidden Markov Models: Viterbi Most-Likely State Path '
                                                     'vs. Forward-Backward Posterior Decoding',
                                                     'Baum–Welch Expectation-Maximization (EM) Parameter '
                                                     'Learning Without Labeled State Annotations',
                                                     'Generalized HMMs (Burge–Karlin GENSCAN / Augustus) '
                                                     'Modeling Intron Length Distributions and Open Reading '
                                                     'Frames',
                                                     'Krogh & Eddy Profile HMMs: Match, Insert, and Delete '
                                                     'States for Protein Domain Families (Pfam / InterPro)',
                                                     "Eddy's HMMER3 Acceleration Pipeline: Ungapped MSV "
                                                     'Filter + Viterbi Filter + Forward Scoring in SIMD',
                                                     'Covariance Models (Stochastic Context-Free Grammars / '
                                                     'Infernal) for Secondary-Structure Conserved Non-Coding '
                                                     'RNAs',
                                                     'Frontier Research & Open Problems: Hidden Markov '
                                                     'Models in Genomics: Viterbi, Forward-Backward & Pfam '
                                                     'Profiles'],
                                         'sim': 'state_machine'},
                                        {'id': 'phylogenetics_coalescent',
                                         'title': 'Molecular Evolution, Phylogenetic Trees (Felsenstein '
                                                  'Pruning) & Coalescent Theory',
                                         'summary': 'Jukes–Cantor/GTR substitution Markov models, '
                                                    "neighbor-joining, Felsenstein's pruning algorithm, "
                                                    "Bayesian MCMC (BEAST), and Kingman's coalescent.",
                                         'lab': True,
                                         'lessons': ['Continuous-Time Markov Models of Nucleotide '
                                                     'Substitution: Jukes–Cantor (JC69), Kimura 2-Parameter, '
                                                     'and General Time-Reversible (GTR + Gamma)',
                                                     'Distance-Matrix Tree Reconstruction: Ultrametric UPGMA '
                                                     'vs. Additive Neighbor-Joining (Saitou–Nei)',
                                                     "Maximum Parsimony (Fitch's Small Parsimony Algorithm) "
                                                     'vs. Long-Branch Attraction Consistency Failures',
                                                     "Felsenstein's (1981) Tree-Pruning Dynamic Programming "
                                                     'Algorithm for Maximum-Likelihood Phylogenetics '
                                                     '(IQ-TREE / RAxML)',
                                                     'Non-Parametric Bootstrap Support vs. Bayesian '
                                                     'Phylogenetics and Molecular Clock Dating (BEAST)',
                                                     "Kingman's Coalescent: Backward-in-Time Lineage "
                                                     "Merging, Effective Population Size N_e, and Tajima's D "
                                                     'Neutrality Test',
                                                     'Ancestral Recombination Graphs (ARGs), Incomplete '
                                                     'Lineage Sorting, and Viral Phylodynamics',
                                                     'Frontier Research & Open Problems: Molecular '
                                                     'Evolution, Phylogenetic Trees (Felsenstein Pruning) & '
                                                     'Coalescent Theory'],
                                         'sim': 'graph_theory'}]},
                           {'id': 'bio_210',
                            'code': 'BIO 210',
                            'title': 'De Novo Genome Assembly, Pangenome Graphs & Variant Discovery',
                            'level': 200,
                            'credits': 4,
                            'description': 'Eulerian De Bruijn graphs (SPAdes), long-read string graphs '
                                           '(HiFi/Nanopore Hifiasm/Verkko), telomere-to-telomere assembly, '
                                           'HaplotypeCaller/DeepVariant, and GWAS.',
                            'prerequisites': ['bio_110'],
                            'modules': [{'id': 'de_bruijn_short_read_assembly',
                                         'title': 'Short-Read Assembly: Hamiltonian Overlap vs. Eulerian De '
                                                  'Bruijn Graphs',
                                         'summary': 'Why Overlap-Layout-Consensus is NP-hard (Hamiltonian '
                                                    "path) while Pevzner's k-mer De Bruijn graph reduces "
                                                    'assembly to linear-time Eulerian cycles.',
                                         'lab': True,
                                         'lessons': ['The Lander–Waterman Poisson Coverage Model: Contig '
                                                     'Length Expectations and Sequencing Depth',
                                                     'Overlap-Layout-Consensus (OLC) Hamiltonian Path '
                                                     'Complexity vs. Pevzner–Idury–Waterman De Bruijn Graphs',
                                                     'Constructing Compacted De Bruijn Graphs (Unitigs) from '
                                                     'k-Mer Spectrum Bloom Filters and Succinct BOSS Tables',
                                                     'Graph Simplification: Popping Heterozygous/Error '
                                                     'Bubbles, Clipping Dead-End Tips, and Resolving Short '
                                                     'Repeats',
                                                     'Multi-k De Bruijn Assembly (SPAdes) and Paired-End '
                                                     'Mate-Pair Scaffolding Across Repeat Bridges',
                                                     'Evaluating Assembly Quality: N50/NG50, auN Area Under '
                                                     'Curve, and BUSCO Single-Copy Ortholog Completeness',
                                                     'Quantitative Case Study & Synthesis: Short-Read '
                                                     'Assembly: Hamiltonian Overlap vs. Eulerian De Bruijn '
                                                     'Graphs'],
                                         'sim': 'graph_theory'},
                                        {'id': 'long_read_t2t_assembly',
                                         'title': 'Long-Read Sequencing (PacBio HiFi & Oxford Nanopore) & '
                                                  'Telomere-to-Telomere Assembly',
                                         'summary': 'SMRTbell circular consensus vs. nanopore ionic-current '
                                                    'squiggle basecalling, Myers string graphs (Hifiasm), '
                                                    'and Verkko T2T phased diploid assembly.',
                                         'lab': True,
                                         'lessons': ['PacBio HiFi Circular Consensus Sequencing (CCS) vs. '
                                                     'Oxford Nanopore Ultra-Long (>100 kb) Ionic-Current '
                                                     'Squiggle Basecalling (Dorado)',
                                                     'Myers (2005) Transitive-Reduction String Graphs and '
                                                     'Phased Haplotype-Resolved Assembly (Hifiasm)',
                                                     'Trio-Binning (Koren) and Hi-C Chromatin Conformation '
                                                     'Phasing of Maternal and Paternal Haplotypes',
                                                     'The Verkko Hybrid Pipeline: Resolving Centromeric '
                                                     'Alpha-Satellite Arrays and rDNA Acrocentric Arms for '
                                                     'T2T-CHM13',
                                                     'Polishing Homopolymer Indel Errors without Introducing '
                                                     'Reference Bias (Merfin k-Mer Evaluation)',
                                                     'Metagenomic Assembly (metaSPAdes / metaMDBG) and '
                                                     'Contig Binning via Coverage-Tetranucleotide '
                                                     'Co-Abundance',
                                                     'Quantitative Case Study & Synthesis: Long-Read '
                                                     'Sequencing (PacBio HiFi & Oxford Nanopore) & '
                                                     'Telomere-to-Telomere Assembly'],
                                         'sim': 'graph_theory'},
                                        {'id': 'germline_somatic_variant_calling',
                                         'title': 'Bayesian & Deep-Learning Variant Calling: GATK '
                                                  'HaplotypeCaller, DeepVariant & SVs',
                                         'summary': 'Local De Bruijn reassembly around active regions, '
                                                    'Pair-HMM read likelihoods, somatic tumor-normal ctDNA '
                                                    'calling, and structural variant detection.',
                                         'lab': True,
                                         'lessons': ['Why Simple Pileup Thresholding Fails around Indels: '
                                                     'Reference Alignment Bias and Base-Quality '
                                                     'Recalibration',
                                                     'GATK HaplotypeCaller: Active-Region Local De Bruijn '
                                                     'Graph Assembly + Pair-HMM Read-to-Haplotype '
                                                     'Likelihoods',
                                                     'Poplin et al. DeepVariant: Rendering Read Pileup '
                                                     'Tensors as Multi-Channel Images for CNN/Transformer '
                                                     'Genotyping',
                                                     'Somatic Variant Calling (Mutect2): Low-Allele-Fraction '
                                                     'Tumor Clones, Liquid Biopsy ctDNA Duplex UMI '
                                                     'Consensus, and FFPE Artifacts',
                                                     'Structural Variant (SV) Signatures: Split Reads, '
                                                     'Discordant Mate Pairs, and Read-Depth Copy-Number '
                                                     'Segmentation',
                                                     'Long-Read Structural Variant Calling (Sniffles2) and '
                                                     'Tandem Repeat Expansion Genotyping',
                                                     'Quantitative Case Study & Synthesis: Bayesian & '
                                                     'Deep-Learning Variant Calling: GATK HaplotypeCaller, '
                                                     'DeepVariant & SVs'],
                                         'sim': 'bayes_belief'},
                                        {'id': 'pangenome_variation_graphs',
                                         'title': 'Human Pangenome Reference Graphs, Giraffe Mapping & Graph '
                                                  'Genotyping',
                                         'summary': 'Overcoming single-reference linear bias using '
                                                    'bidirectional variation graphs (vg/Minigraph-Cactus) '
                                                    'and GBWT haplotype indexing.',
                                         'lab': True,
                                         'lessons': ['Reference Allele Bias: Why Mapping to a Single Linear '
                                                     'Genome (GRCh38) Misses Population-Specific Insertions '
                                                     'and HLA Diversity',
                                                     'Sequence Graphs and Bidirectional Variation Graphs: '
                                                     'Nodes (DNA Segments), Edges, and Embedded Haplotype '
                                                     'Paths',
                                                     'Constructing the Human Pangenome Reference Consortium '
                                                     '(HPRC) Graph with Minigraph-Cactus and PGGB',
                                                     'The Graph Burrows–Wheeler Transform (GBWT): Indexing '
                                                     'Phased Haplotypes Inside Variation Graphs',
                                                     "Sirén's Giraffe Short-Read to Pangenome Mapper: "
                                                     'Matching Linear-Genome Speed on Complex Polymorphic '
                                                     'Loci',
                                                     'Graph-Based Structural Variant Genotyping (PanGenie) '
                                                     'Using Haplotype K-Mer Counting',
                                                     'Quantitative Case Study & Synthesis: Human Pangenome '
                                                     'Reference Graphs, Giraffe Mapping & Graph Genotyping'],
                                         'sim': 'graph_theory'},
                                        {'id': 'gwas_polygenic_population',
                                         'title': 'Population Genetics, Linkage Disequilibrium, GWAS & '
                                                  'Polygenic Risk Scores',
                                         'summary': 'Hardy–Weinberg equilibrium, Wright–Fisher drift, PCA '
                                                    'population stratification, mixed linear models '
                                                    '(BOLT-LMM/REGENIE), fine-mapping, and PRS.',
                                         'lab': True,
                                         'lessons': ["Hardy–Weinberg Equilibrium, Linkage Disequilibrium (D' "
                                                     'and r^2), and Li–Stephens Haplotype Copying Imputation',
                                                     'Confounding by Population Stratification: EIGENSTRAT '
                                                     'Principal Components and Genomic Control Inflation '
                                                     'Factor lambda_GC',
                                                     'Linear Mixed Models (BOLT-LMM / REGENIE): Modeling '
                                                     'Polygenic Background via the Genetic Relationship '
                                                     'Matrix (GRM)',
                                                     'LD Score Regression (Bulik-Sullivan): Separating True '
                                                     'Polygenicity from Confounding and Estimating SNP '
                                                     'Heritability + Genetic Correlation',
                                                     'Bayesian Statistical Fine-Mapping (SuSiE — Sum of '
                                                     'Single Effects): Isolating Credible Sets of Causal '
                                                     'Variants',
                                                     'Polygenic Risk Scores (PRS-CS / LDpred2) and '
                                                     'Addressing Eurocentric Portability Decay Across Global '
                                                     'Ancestries',
                                                     'Quantitative Case Study & Synthesis: Population '
                                                     'Genetics, Linkage Disequilibrium, GWAS & Polygenic '
                                                     'Risk Scores'],
                                         'sim': 'regression_fit'}]},
                           {'id': 'bio_310',
                            'code': 'BIO 310',
                            'title': 'Single-Cell Multi-Omics, Spatial Transcriptomics & Epigenomic '
                                     'Regulatory Networks',
                            'level': 300,
                            'credits': 4,
                            'description': 'Droplet scRNA-seq count statistics, negative binomial '
                                           'Variational Autoencoders (scVI), RNA velocity/optimal transport '
                                           'trajectories, scATAC-seq gene regulatory networks, and spatial '
                                           'omics.',
                            'prerequisites': ['bio_210'],
                            'modules': [{'id': 'scrna_count_normalization_scvi',
                                         'title': 'Single-Cell RNA-Seq Physics, Negative Binomial Models & '
                                                  'scVI Deep Latent Spaces',
                                         'summary': '10x barcoding/UMIs, Poisson-Gamma (Negative Binomial) '
                                                    'overdispersion, doublet removal, and Lopez et al. scVI '
                                                    'variational autoencoders.',
                                         'lab': True,
                                         'lessons': ['Microfluidic Droplet Barcoding (10x Chromium), Unique '
                                                     'Molecular Identifiers (UMIs), and Ambient RNA '
                                                     'Decontamination (CellBender)',
                                                     'Why Single-Cell Counts Are Not Log-Normal: Poisson '
                                                     'Measurement Noise + Gamma Biological Dispersion = '
                                                     'Negative Binomial (Sarkar–Stephens)',
                                                     'Analytic Pearson Residuals (Lause) and '
                                                     'Variance-Stabilizing Transformations (sctransform) vs. '
                                                     'Shifted Log Normalization',
                                                     'Batch-Effect Correction and Atlas Integration: '
                                                     'Harmony, MNN, and Lopez et al. scVI (Single-Cell '
                                                     'Variational Inference)',
                                                     'Zero-Inflated vs. Standard Negative Binomial Decoder '
                                                     'Likelihoods and Uncertainty-Aware Differential '
                                                     'Expression',
                                                     'Cluster-Free Differential Abundance Testing on '
                                                     'K-Nearest-Neighbor Graphs (Milo)',
                                                     'Quantitative Case Study & Synthesis: Single-Cell '
                                                     'RNA-Seq Physics, Negative Binomial Models & scVI Deep '
                                                     'Latent Spaces'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'trajectories_rna_velocity_ot',
                                         'title': 'Cellular Trajectories: Pseudotime, RNA Velocity & '
                                                  'Waddington Optimal Transport',
                                         'summary': 'Diffusion maps, spliced/unspliced ODE dynamics '
                                                    '(velocyto/scVelo), metabolic labeling (dynamo), and '
                                                    'Schiebinger Waddington-OT.',
                                         'lab': True,
                                         'lessons': ['Diffusion Pseudotime (Haghverdi), Palantir Markov '
                                                     'Absorption Probabilities, and Principal Graph Trees '
                                                     '(Monocle3)',
                                                     'La Manno & Bergen RNA Velocity: Inferring '
                                                     'Transcriptional Induction/Repression from '
                                                     'Unspliced-to-Spliced Intron Ratios',
                                                     'Dynamical EM and Variational Inference of '
                                                     'Gene-Specific Splicing/Degradation Rates (scVelo / '
                                                     'veloVI)',
                                                     'Pitfalls of Splicing Velocity (Multiple Kinetics, '
                                                     'Short Introns) and Metabolic 4sU RNA Labeling Vector '
                                                     'Fields (Dynamo)',
                                                     'Schiebinger et al. Waddington-OT: Unbalanced Entropic '
                                                     'Optimal Transport (Sinkhorn) Across Time-Series '
                                                     'Developmental Snapshots',
                                                     'TrajectoryNet and Continuous Normalizing Flows / '
                                                     'Schrödinger Bridges on Single-Cell Manifolds',
                                                     'Quantitative Case Study & Synthesis: Cellular '
                                                     'Trajectories: Pseudotime, RNA Velocity & Waddington '
                                                     'Optimal Transport'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'scatac_chromatin_grns',
                                         'title': 'Single-Cell Epigenomics (scATAC-Seq), Chromatin '
                                                  'Accessibility & Gene Regulatory Networks',
                                         'summary': 'Tn5 transposase cut-site footprinting, TF motif '
                                                    'enrichment (chromVAR), multi-omic RNA+ATAC pairing, and '
                                                    'SCENIC+ / CellOracle in-silico knockouts.',
                                         'lab': True,
                                         'lessons': ['Assay for Transposase-Accessible Chromatin (ATAC-Seq): '
                                                     'Tn5 Insertion Bias Correction and Nucleosome Phasing '
                                                     'Periodicity',
                                                     'Peak Calling (MACS3), Term Frequency-Inverse Document '
                                                     'Frequency (TF-IDF) + Latent Semantic Indexing (LSI) '
                                                     'for Sparse Binary Peaks',
                                                     'Transcription Factor (TF) Motif Deviations (chromVAR) '
                                                     'and Base-Resolution Deep Learning (BPNet / ChromBPNet) '
                                                     'Disentangling Tn5 Bias',
                                                     'Multi-Modal Single-Cell Integration (10x Multiome '
                                                     'RNA+ATAC, CITE-Seq Surface Proteins): Weighted Nearest '
                                                     'Neighbors and TotalVI/MultiVI',
                                                     'Enhancer-Driven Gene Regulatory Network (eGRN) '
                                                     'Reconstruction: SCENIC+ Linking TFs -> Enhancer Peaks '
                                                     '-> Target Genes',
                                                     'CellOracle: Simulating In-Silico Transcription Factor '
                                                     'Knockouts and Perturbation Vector Fields Before '
                                                     'Wet-Lab Experiments',
                                                     'Quantitative Case Study & Synthesis: Single-Cell '
                                                     'Epigenomics (scATAC-Seq), Chromatin Accessibility & '
                                                     'Gene Regulatory Networks'],
                                         'sim': 'graph_theory'},
                                        {'id': 'spatial_transcriptomics_ccc',
                                         'title': 'Spatial Transcriptomics (MERFISH, Xenium, Visium) & '
                                                  'Cell-Cell Communication',
                                         'summary': 'Combinatorial FISH error-correcting barcodes, spot '
                                                    'deconvolution (Cell2location), spatial point-process '
                                                    'statistics, and ligand-receptor signaling.',
                                         'lab': True,
                                         'lessons': ['Imaging-Based In-Situ Hybridization (MERFISH, Xenium, '
                                                     'CosMx): MHD4 Hamming-Distance-4 Combinatorial Optical '
                                                     'Barcoding',
                                                     'Sequencing-Based Spatial Capture Arrays (Visium HD, '
                                                     'Slide-Seq, Stereo-Seq) and Subcellular Cell-Boundary '
                                                     'Segmentation (Baysor)',
                                                     'Bayesian Spatial Spot Deconvolution (Cell2location / '
                                                     'RCTD): Mapping Single-Cell Reference Atlases onto '
                                                     'Multi-Cell Spatial Spots',
                                                     "Spatial Statistics: Moran's I Autocorrelation, "
                                                     "Ripley's K Neighborhood Enrichment, and Spatial Niche "
                                                     'Discovery',
                                                     'Ligand-Receptor Cell-Cell Communication Inference '
                                                     '(CellChat, NicheNet, COMMOT Spatial Optimal Transport)',
                                                     '3D Tissue Serial-Section Alignment (PASTE Optimal '
                                                     'Transport) and Spatiotemporal Morphogenesis Atlases',
                                                     'Quantitative Case Study & Synthesis: Spatial '
                                                     'Transcriptomics (MERFISH, Xenium, Visium) & Cell-Cell '
                                                     'Communication'],
                                         'sim': 'graph_theory'},
                                        {'id': 'perturb_seq_causal_genomics',
                                         'title': 'High-Throughput Perturb-Seq Screens & Causal Gene Network '
                                                  'Discovery',
                                         'summary': 'Pooled CRISPRi/CRISPRa single-cell screens (Perturb-seq '
                                                    '/ CROP-seq), guide assignment, SCEPTRE calibration, and '
                                                    'causal structure learning.',
                                         'lab': True,
                                         'lessons': ['Pooled Single-Cell CRISPR Screens (Perturb-Seq, '
                                                     'CROP-Seq): Capturing sgRNA Identity Alongside Whole '
                                                     'Transcriptomes in Millions of Cells',
                                                     'Mixture-Model Guide RNA Calling, '
                                                     'Multiplicity-of-Infection (MOI) Multiplexing, and '
                                                     'Filtering Non-Targeting Escapers',
                                                     'Statistical Calibration of Perturb-Seq Differential '
                                                     'Expression: SCEPTRE Conditional Randomization Testing',
                                                     'Compressed Perturb-Seq: Composite Cell-Pooling and '
                                                     'Sparse Compressed Sensing Deconvolution of Genetic '
                                                     'Interactions',
                                                     'Causal Discovery on Interventional Single-Cell Data '
                                                     '(GIES, DCD-FG, and Differentiable DAG Learning)',
                                                     'Predicting Unseen Double-Knockout Genetic Epistasis '
                                                     'and Non-Additive Manifolds (GEARS / CPA / Biolord)',
                                                     'Quantitative Case Study & Synthesis: High-Throughput '
                                                     'Perturb-Seq Screens & Causal Gene Network Discovery'],
                                         'sim': 'bayes_belief'}]},
                           {'id': 'bio_410',
                            'code': 'BIO 410',
                            'title': 'Statistical Genomics, Deep Learning on Sequences & Regulatory Variant Interpretation',
                            'level': 400,
                            'credits': 4,
                            'description': 'Map genotype to phenotype with GWAS, fine-mapping and eQTL colocalization, then train and '
                                           'interpret convolutional sequence-to-function models and validate predictions with massively '
                                           'parallel reporter assays. Bridges single-cell and regulatory genomics to graduate-level '
                                           'genomic foundation models.',
                            'prerequisites': ['bio_310'],
                            'modules': [{'id': 'gwas_finemapping',
                                         'title': 'GWAS and Statistical Fine-Mapping',
                                         'summary': 'Locating causal variants among thousands of correlated association signals.',
                                         'lab': True,
                                         'lessons': ['Genome-Wide Association Studies: Linear Mixed Models and Population Structure',
                                                     'Linkage Disequilibrium and the Problem of Correlated Signals',
                                                     'Bayesian Fine-Mapping with SuSiE and Credible Sets',
                                                     'Polygenic Risk Scores and Their Portability Across Ancestries',
                                                     'Running a Simulated GWAS and Manhattan Plot in Python']},
                                        {'id': 'eqtl_colocalization',
                                         'title': 'eQTLs, Colocalization and Mendelian Randomization',
                                         'summary': 'Linking non-coding variants to genes and causal mechanisms.',
                                         'lab': True,
                                         'lessons': ['Expression QTL Mapping and the GTEx Resource',
                                                     'Colocalization Analysis (coloc) of GWAS and eQTL Signals',
                                                     'Mendelian Randomization for Causal Inference',
                                                     'Single-Cell eQTLs and Cell-Type-Specific Regulation']},
                                        {'id': 'cnn_sequence_models',
                                         'title': 'Convolutional Neural Networks on DNA Sequence',
                                         'summary': 'Learning regulatory grammar directly from one-hot encoded sequence.',
                                         'lab': True,
                                         'lessons': ['One-Hot Encoding and Convolutional Filters as Learned Motifs',
                                                     'DeepSEA and Basset: Predicting Chromatin Features from Sequence',
                                                     'Dilated Convolutions and Long-Range Context (Basenji)',
                                                     'Training Strategies: Data Splits by Chromosome and Avoiding Leakage',
                                                     'Training a Small CNN to Predict TF Binding from Sequence']},
                                        {'id': 'model_interpretation',
                                         'title': 'Interpreting Sequence Models',
                                         'summary': 'Extracting biological insight from black-box predictions.',
                                         'lab': True,
                                         'lessons': ['In Silico Mutagenesis and Variant Effect Prediction',
                                                     'Gradient Attribution, DeepLIFT and Integrated Gradients',
                                                     'TF-MoDISco: Discovering Motifs from Attribution Maps',
                                                     'Scoring Non-Coding GWAS Variants with a Trained Model']},
                                        {'id': 'mpra_validation',
                                         'title': 'Massively Parallel Reporter Assays and Functional Validation',
                                         'summary': 'High-throughput experiments that test model predictions at scale.',
                                         'lab': True,
                                         'lessons': ['MPRA and STARR-seq Design Principles',
                                                     'CRISPRi/a Screens for Enhancer–Gene Mapping',
                                                     'Statistical Analysis of MPRA Barcode Counts',
                                                     'Closing the Loop: Designing Synthetic Enhancers with Models']}]},
                           {'id': 'bio_510',
                            'code': 'BIO 510',
                            'title': 'Genomic Foundation Models (Evo, Enformer, Borzoi) & '
                                     'Sequence-to-Function AI',
                            'level': 500,
                            'credits': 4,
                            'description': 'Long-context sequence-to-function models (Enformer/Borzoi), '
                                           'StripedHyena/Mamba whole-genome foundation models (Evo), RNA '
                                           'language models, and synthetic enhancer design.',
                            'prerequisites': ['bio_310', 'bio_410'],
                            'modules': [{'id': 'sequence_to_function_enformer',
                                         'title': 'Long-Range Sequence-to-Function Models: Basenji, Enformer '
                                                  '& Borzoi',
                                         'summary': 'Predicting thousands of ChIP-seq, DNase, CAGE, and '
                                                    'RNA-seq tracks across 200–500 kb genomic windows to '
                                                    'interpret non-coding disease variants.',
                                         'lab': True,
                                         'lessons': ['The Non-Coding Variant Interpretation Challenge: Why '
                                                     '>90% of GWAS Disease Variants Sit in Distal Enhancers '
                                                     'or Splicing Sites',
                                                     'From DeepSEA (1 kb Context) and Basenji2 (131 kb '
                                                     'Dilated CNNs) to Avsec et al. Enformer (200 kb '
                                                     'Convolutional + Transformer Attention)',
                                                     'Linder et al. Borzoi (524 kb Context): Directly '
                                                     'Predicting Base-Resolution RNA-Seq Coverage to Unify '
                                                     'Transcription, Splicing, and Polyadenylation',
                                                     'In-Silico Saturation Mutagenesis (ISM) and DeepSHAP '
                                                     'Attribution Maps for Pinpointing Causal Transcription '
                                                     'Factor Binding Motifs',
                                                     'Benchmarking Personal Genome Gene-Expression '
                                                     'Prediction: Why Models Trained Across Reference Loci '
                                                     'Struggle on Cross-Individual eQTL Direction!',
                                                     'Fine-Tuning Sequence-to-Function Oracles on Personal '
                                                     'Phased Diploid Genomes and Allele-Specific Chromatin '
                                                     'Accessibility',
                                                     'Quantitative Case Study & Synthesis: Long-Range '
                                                     'Sequence-to-Function Models: Basenji, Enformer & '
                                                     'Borzoi'],
                                         'sim': 'attention_viz'},
                                        {'id': 'splicing_rna_foundation',
                                         'title': 'Deep Splicing Codes (SpliceAI/Pangolin) & RNA '
                                                  'Structure/Translation Models',
                                         'summary': 'Cryptic splice-site activation in rare genetic '
                                                    "diseases, 5' UTR ribosome loading models, mRNA "
                                                    'half-life optimization, and 3D RNA folding.',
                                         'lab': True,
                                         'lessons': ['Jaganathan et al. SpliceAI and Zeng–Li Pangolin: 10-kb '
                                                     'Dilated Residual Convolutions Predicting '
                                                     'Donor/Acceptor Usage from Primary Pre-mRNA',
                                                     'Diagnosing Pathogenic Deep-Intronic Cryptic Exon '
                                                     'Variants and Designing Antisense Oligonucleotide (ASO) '
                                                     'Splice-Switching Therapies',
                                                     "5' UTR Ribosome Profiling (Optimus 5-Prime) and Salis "
                                                     'Thermodynamic Ribosome Binding Site (RBS) Calculators',
                                                     'Predicting Eukaryotic mRNA Stability and Half-Life '
                                                     "(Saluki) from Codon Optimality and 3' UTR RBP Motifs",
                                                     'LinearDesign (Zhang et al.): Dynamic Programming on '
                                                     'Lattice Grammars to Jointly Optimize mRNA Codon '
                                                     'Adaptation Index AND Secondary Structure MFE!',
                                                     'RNA Language Models (RNA-FM, RiNALMo) and Deep 3D RNA '
                                                     'Tertiary Structure Prediction (RhoFold / '
                                                     'RoseTTAFoldNA)',
                                                     'Quantitative Case Study & Synthesis: Deep Splicing '
                                                     'Codes (SpliceAI/Pangolin) & RNA Structure/Translation '
                                                     'Models'],
                                         'sim': 'nn_playground'},
                                        {'id': 'genomic_llms_hyena_evo',
                                         'title': 'Sub-Quadratic Genomic Foundation Models: Nucleotide '
                                                  'Transformer, Caduceus & Evo',
                                         'summary': 'Overcoming O(L^2) attention at megabase resolution '
                                                    'using reverse-complement equivariant Mamba (Caduceus) '
                                                    'and StripedHyena (Evo) at single-nucleotide resolution.',
                                         'lab': True,
                                         'lessons': ['Tokenization Tradeoffs in DNA Language Models: K-Mer / '
                                                     'BPE Tokenization (DNABERT-2, Nucleotide Transformer) '
                                                     'vs. Single-Nucleotide Resolution',
                                                     'Why BPE Tokenization Blurs Single-Nucleotide Variants '
                                                     'and Frame-Shift Boundaries',
                                                     'Reverse-Complement (RC) Parameter Sharing and '
                                                     'Equivariance on Double-Stranded DNA',
                                                     'Sub-Quadratic State-Space Models for Megabase Context: '
                                                     'HyenaDNA (Implicit Long Convolutions) and Schiff et '
                                                     'al. Caduceus (Bi-Directional RC-Mamba)',
                                                     'Nguyen, Poli, Durrant, Hie et al. Evo (7B '
                                                     'StripedHyena): Autoregressive Modeling Across 300 '
                                                     'Billion Prokaryotic/Phage Nucleotides at 131 kb '
                                                     'Context',
                                                     'Zero-Shot Fitness Prediction Across Coding/Non-Coding '
                                                     'Systems and Generating Functional Synthetic CRISPR-Cas '
                                                     'Operons and Transposons with Evo',
                                                     'Quantitative Case Study & Synthesis: Sub-Quadratic '
                                                     'Genomic Foundation Models: Nucleotide Transformer, '
                                                     'Caduceus & Evo'],
                                         'sim': 'attention_viz'},
                                        {'id': 'single_cell_foundation_models',
                                         'title': 'Single-Cell Transcriptomic Foundation Models (scGPT, '
                                                  'Geneformer, Universal Cell Embeddings)',
                                         'summary': 'Rank-value vs. count-binned gene tokenization, masked '
                                                    'gene modeling across 50M+ cell atlases, and zero-shot '
                                                    'batch/species transfer.',
                                         'lab': True,
                                         'lessons': ['Representing Unordered Bag-of-Genes Expression '
                                                     'Profiles for Transformers: Rank-Value Encoding '
                                                     '(Geneformer) vs. Value-Binning (scGPT)',
                                                     'Rosen et al. Universal Cell Embeddings (UCE): Using '
                                                     'ESM2 Protein Language Embeddings of Genes to '
                                                     'Generalize Zero-Shot to Unseen Species!',
                                                     'Critical Benchmarking (Boeva / Luecken / Kedzierska): '
                                                     'When Do Single-Cell Foundation Models Beat Simple HVG '
                                                     '+ scVI / Ridge Baselines?',
                                                     'Conditioning Generative Transcriptomic Models on '
                                                     'Small-Molecule Drug Structures (ChemCPA) and Cytokine '
                                                     'Combinations',
                                                     'Spatial Foundation Models (Nicheformer) Pretrained '
                                                     'Across Dissociated and Dissociation-Free Spatial '
                                                     'Tissue Atlases',
                                                     'Closing the Active-Learning Loop: Lab-in-the-Loop '
                                                     'Bayesian Optimization Choosing Next Perturb-Seq '
                                                     'Knockouts',
                                                     'Quantitative Case Study & Synthesis: Single-Cell '
                                                     'Transcriptomic Foundation Models (scGPT, Geneformer, '
                                                     'Universal Cell Embeddings)'],
                                         'sim': 'attention_viz'},
                                        {'id': 'synthetic_enhancer_promoter_design',
                                         'title': 'AI-Guided Design of Cell-Type-Specific Synthetic '
                                                  'Enhancers & Promoters',
                                         'summary': 'Inverting sequence-to-function Enformer/STARR-seq '
                                                    'oracles via directed evolution, Ledidi gradient design, '
                                                    'and discrete diffusion (DNA-Diffusion).',
                                         'lab': True,
                                         'lessons': [' Massively Parallel Reporter Assays (MPRA and '
                                                     'STARR-Seq): Measuring Activity of 100,000+ Synthetic '
                                                     'Regulatory Sequences in Parallel',
                                                     'Training DeepEnsemble Oracles (DeepSTARR / Malinois) '
                                                     'with Epistemic Uncertainty Quantification to Prevent '
                                                     'Adversarial Over-Optimization',
                                                     'In-Silico Directed Evolution, Fast SeqProp / Ledidi '
                                                     'Gradient Relaxation, and Gumbel-Softmax Sequence '
                                                     'Optimization',
                                                     'Taskiran–Aerts & Gosai–Sabeti–Tewhey (2024): Designing '
                                                     'Ultracompact Cell-Type-Specific Synthetic Enhancers '
                                                     'Selective for Brain, Liver, or Blood',
                                                     'Discrete Diffusion and Flow Matching on DNA Simplexes '
                                                     '(Dirichlet Flow Matching / Stark et al.) for '
                                                     'Motif-Grammar-Preserving Generation',
                                                     'AAV Gene Therapy Payload Engineering: Packing '
                                                     'Cell-Type-Specific Enhancers + Therapeutic Transgenes '
                                                     'Under the 4.7 kb Capsid Limit',
                                                     'Quantitative Case Study & Synthesis: AI-Guided Design '
                                                     'of Cell-Type-Specific Synthetic Enhancers & Promoters'],
                                         'sim': 'gradient_descent'}]}]},
              {'id': 'protein_design',
               'name': 'Protein Folding & Generative Biomolecular Design',
               'icon': '🧊',
               'description': "Anfinsen's thermodynamic hypothesis, molecular dynamics force fields, Potts "
                              'coevolution, AlphaFold2/3 SE(3) architectures, ProteinMPNN inverse folding, '
                              'and RFdiffusion de novo binder/enzyme design.',
               'courses': [{'id': 'bio_120',
                            'code': 'BIO 120',
                            'title': 'Structural Biophysics, Ramachandran Geometry & Molecular Dynamics',
                            'level': 100,
                            'credits': 4,
                            'description': 'Understand protein 3D geometry: backbone dihedral angles (phi, '
                                           'psi, omega), rotamer libraries, Rosetta energy functions, '
                                           'CHARMM/AMBER force fields, and Langevin MD.',
                            'prerequisites': [],
                            'modules': [{'id': 'backbone_ramachandran_rotamers',
                                         'title': 'Polypeptide Geometry, Ramachandran Steric Maps & '
                                                  'Side-Chain Rotamers',
                                         'summary': 'Planar peptide bonds, phi/psi dihedral angles, '
                                                    'alpha-helices and beta-sheets, Dunbrack '
                                                    'backbone-dependent rotamer libraries, and NeRF '
                                                    'coordinate building.',
                                         'lab': True,
                                         'lessons': ['The 20 Canonical Amino Acids: Hydrophobic, Polar, '
                                                     'Charged, and Special (Glycine Achirality, Proline '
                                                     'Cyclic Pyrrolidine, Cysteine Disulfides)',
                                                     'Resonance Stabilization of the Planar Peptide Bond '
                                                     '(omega approx 180 deg) and Backbone Torsions (phi, '
                                                     'psi)',
                                                     "Ramachandran's Hard-Sphere Steric Map: Allowed Regions "
                                                     'for Right-Handed Alpha-Helices, Beta-Strands, and '
                                                     'Left-Handed Alpha/Polyproline II',
                                                     'Hydrogen-Bonding Geometry (DSSP): Parallel vs. '
                                                     'Antiparallel Beta-Sheets, Beta-Hairpin Turns, and '
                                                     'Coiled-Coil Heptad Repeats',
                                                     "Side-Chain Chi1–Chi4 Dihedral Angles and Dunbrack's "
                                                     'Backbone-Dependent Rotamer Libraries',
                                                     'Natural Extension Reference Frame (NeRF / pNeRF): '
                                                     'Differentiable Conversion Between Internal Bond '
                                                     'Lengths/Angles/Torsions and 3D Cartesian Coordinates',
                                                     'Quantitative Case Study & Synthesis: Polypeptide '
                                                     'Geometry, Ramachandran Steric Maps & Side-Chain '
                                                     'Rotamers'],
                                         'sim': 'atom_builder'},
                                        {'id': 'anfinsen_rosetta_energy',
                                         'title': "Anfinsen's Thermodynamic Hypothesis, Folding Funnels & "
                                                  'Rosetta Energy Functions',
                                         'summary': "Levinthal's paradox, rugged vs. minimally frustrated "
                                                    'folding funnels (Onuchic–Wolynes), hydrophobic '
                                                    'solvation (Lazaridis–Karplus), and Rosetta Dead-End '
                                                    'Elimination.',
                                         'lab': True,
                                         'lessons': ["Anfinsen's Ribonuclease Refolding Experiment and "
                                                     "Levinthal's Paradox (3^{100} Conformations Cannot Be "
                                                     'Searched by Random Walk)',
                                                     'Wolynes & Onuchic Energy Landscape Theory: Minimally '
                                                     'Frustrated Folding Funnels and Contact Order '
                                                     'Folding-Rate Correlation (Plaxco–Simons–Baker)',
                                                     'Physical Forces Driving Folding: The Entropic '
                                                     'Hydrophobic Effect (Clathrate Water Cage Release) vs. '
                                                     'Intramolecular Hydrogen Bonding',
                                                     'Anatomy of the Rosetta All-Atom Energy Function '
                                                     '(REF15): Lennard-Jones Atr/Rep, Lazaridis–Karplus '
                                                     'Implicit Solvation, Orientation-Dependent H-Bonds, and '
                                                     'Dunbrack',
                                                     'Combinatorial Side-Chain Packing: Dead-End Elimination '
                                                     '(DEE) and Simulated Annealing Metropolis Monte Carlo '
                                                     'on Rotamer Interaction Graphs',
                                                     'Structural Quality Metrics: C-Alpha RMSD (Kabsch SVD '
                                                     'Alignment), TM-Score (Length-Independent '
                                                     'Zhang–Skolnick), and lDDT (Local Distance Difference '
                                                     'Test)',
                                                     "Quantitative Case Study & Synthesis: Anfinsen's "
                                                     'Thermodynamic Hypothesis, Folding Funnels & Rosetta '
                                                     'Energy Functions'],
                                         'sim': 'equilibrium'},
                                        {'id': 'classical_md_force_fields',
                                         'title': 'Classical Molecular Dynamics: AMBER/CHARMM Force Fields, '
                                                  'Verlet & PME Electrostatics',
                                         'summary': 'Bonded harmonic terms, non-bonded 12-6 Lennard-Jones, '
                                                    'Particle Mesh Ewald (PME) O(N log N) electrostatics, '
                                                    'velocity Verlet, and OpenMM GPU simulation.',
                                         'lab': True,
                                         'lessons': ['Potential Energy Surface Decomposition: Bond '
                                                     'Stretching, Angle Bending, Proper/Improper Periodic '
                                                     'Dihedrals, and Urey–Bradley Terms',
                                                     'Non-Bonded Interactions: 12-6 Lennard-Jones van der '
                                                     'Waals + Point-Charge Coulomb Electrostatics (AMBER '
                                                     'ff19SB / CHARMM36m)',
                                                     'Explicit Water Models (TIP3P, TIP4P-Ew, OPC) vs. '
                                                     'Generalized Born Surface Area (GBSA) Implicit Solvent',
                                                     "Darden's Particle Mesh Ewald (PME): Splitting 1/r into "
                                                     'Short-Range Direct Sum and Long-Range 3D Fast Fourier '
                                                     'Transform in O(N log N)',
                                                     'Symplectic Integrators: Velocity Verlet, SHAKE/RATTLE '
                                                     'Hydrogen Bond-Length Constraints (2 fs to 4 fs '
                                                     'Hydrogen Mass Repartitioning)',
                                                     'Canonical (NVT) and Isothermal-Isobaric (NPT) '
                                                     'Ensembles: Langevin Middle Integrator, Nosé–Hoover '
                                                     'Chains, and Monte Carlo Barostats in OpenMM',
                                                     'Quantitative Case Study & Synthesis: Classical '
                                                     'Molecular Dynamics: AMBER/CHARMM Force Fields, Verlet '
                                                     '& PME Electrostatics'],
                                         'sim': 'spring_mass'},
                                        {'id': 'enhanced_sampling_free_energy',
                                         'title': 'Enhanced Sampling, Markov State Models & Alchemical '
                                                  'Free-Energy Perturbation',
                                         'summary': 'Overcoming millisecond kinetic barriers via umbrella '
                                                    'sampling, metadynamics, Replica Exchange, Markov State '
                                                    'Models (PyEMMA), and Zwanzig FEP.',
                                         'lab': True,
                                         'lessons': ['The Timescale Gap: Femtosecond Integration Steps vs. '
                                                     'Millisecond Allosteric Conformational Transitions',
                                                     'Umbrella Sampling Along Collective Variables and '
                                                     'Weighted Histogram Analysis Method (WHAM / MBAR — '
                                                     'Shirts & Chodera)',
                                                     'Laio & Parrinello Metadynamics and Well-Tempered '
                                                     'Metadynamics: Filling Free-Energy Wells with '
                                                     'History-Dependent Gaussian Hills',
                                                     'Replica Exchange Molecular Dynamics (Parallel '
                                                     'Tempering) and Time-Lagged Independent Component '
                                                     'Analysis (tICA)',
                                                     'Markov State Models (MSMs — Pande/Noé): Discretizing '
                                                     'Conformational Space to Reconstruct Long-Timescale '
                                                     'Folding/Binding Kinetics from Short Trajectories',
                                                     "Zwanzig's Alchemical Free-Energy Perturbation (FEP) "
                                                     'and Thermodynamic Integration for Relative Drug '
                                                     'Binding Affinity (Delta Delta G)',
                                                     'Quantitative Case Study & Synthesis: Enhanced '
                                                     'Sampling, Markov State Models & Alchemical Free-Energy '
                                                     'Perturbation'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'experimental_cryoem_xray',
                                         'title': 'Experimental Structure Determination: X-Ray '
                                                  'Crystallography, Cryo-EM & NMR',
                                         'summary': 'Bragg diffraction and the crystallographic phase '
                                                    'problem, AlphaFold molecular replacement, '
                                                    'single-particle Cryo-EM 3D Fourier slice '
                                                    'reconstruction, and CryoDRGN.',
                                         'lab': True,
                                         'lessons': ['X-Ray Diffraction by Protein Crystals: Structure '
                                                     'Factors F(hkl), Electron Density Fourier Synthesis, '
                                                     'and the Phase Problem',
                                                     'Solving the Phase Problem via SAD/MAD Anomalous '
                                                     'Dispersion and Molecular Replacement Using AlphaFold '
                                                     'Models (Phaser)',
                                                     'The Resolution Revolution in Single-Particle '
                                                     'Cryo-Electron Microscopy (Cryo-EM): Direct Electron '
                                                     'Detectors and Beam-Induced Motion Correction',
                                                     'The Projection-Slice Theorem: Reconstructing 3D '
                                                     'Electrostatic Potential Volumes from Noisy 2D Particle '
                                                     'Projections in Fourier Space (RELION / CryoSPARC)',
                                                     'Gold-Standard Fourier Shell Correlation (FSC = 0.143) '
                                                     'Resolution Criterion and Atomic Model Refinement '
                                                     '(Phenix / Coot / ISOLDE)',
                                                     'Continuous Conformational Heterogeneity in Cryo-EM: '
                                                     'Zhong et al. CryoDRGN Variational Autoencoders in '
                                                     'Fourier Space',
                                                     'Quantitative Case Study & Synthesis: Experimental '
                                                     'Structure Determination: X-Ray Crystallography, '
                                                     'Cryo-EM & NMR'],
                                         'sim': 'fourier_series'}]},
                           {'id': 'bio_220',
                            'code': 'BIO 220',
                            'title': 'Coevolutionary Potts Models, Protein Language Models (ESM) & '
                                     'AlphaFold2/3',
                            'level': 200,
                            'credits': 4,
                            'description': 'Direct Coupling Analysis (DCA/GREMLIN) on Multiple Sequence '
                                           'Alignments, Evoformer triangle updates, SE(3) Invariant Point '
                                           'Attention, ESMFold, and AlphaFold3 diffusion.',
                            'prerequisites': ['bio_110', 'bio_120'],
                            'modules': [{'id': 'coevolution_potts_dca',
                                         'title': 'Evolutionary Couplings, Potts Models & Direct Coupling '
                                                  'Analysis (DCA)',
                                         'summary': 'Disentangling direct physical 3D residue contacts from '
                                                    'transitive phylogenetic correlations via '
                                                    'maximum-entropy Potts models and pseudolikelihood '
                                                    '(plmDCA).',
                                         'lab': True,
                                         'lessons': ['Compensatory Mutations in Evolution: Why Mutating '
                                                     'Residue i Requires a Rescuing Mutation at Spatially '
                                                     'Adjacent Residue j',
                                                     'Why Simple Mutual Information MI(i, j) Fails: '
                                                     'Transitive Indirect Chains (i <-> k <-> j) Create '
                                                     'False-Positive Contact Artifacts',
                                                     'Maximum-Entropy Potts Model P(seq) prop exp(sum '
                                                     'h_i(s_i) + sum_{i<j} J_ij(s_i, s_j)) Over a Multiple '
                                                     'Sequence Alignment (MSA)',
                                                     'Mean-Field Inversion (mfDCA — Morcos), Sparse Inverse '
                                                     'Covariance (PSICOV), and Ekeberg–Kamisetty '
                                                     'Pseudolikelihood Maximization (plmDCA / GREMLIN)',
                                                     'Average Product Correction (APC — Dunn) to Remove '
                                                     'Phylogenetic and Entropic Background Bias from '
                                                     'Frobenius Norms ||J_ij||_F',
                                                     'From Contact Maps to Distograms: ResNet Predictors '
                                                     '(RaptorX / trRosetta) Predicting Inter-Residue '
                                                     'Distance and Orientation Distributions',
                                                     'Quantitative Case Study & Synthesis: Evolutionary '
                                                     'Couplings, Potts Models & Direct Coupling Analysis '
                                                     '(DCA)'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'alphafold2_evoformer_ipa',
                                         'title': 'Dissecting AlphaFold2 & OpenFold: Evoformer Triangle '
                                                  'Updates & Invariant Point Attention',
                                         'summary': 'Jumper et al. end-to-end architecture: coupled MSA and '
                                                    'pair representations, triangle multiplicative updates, '
                                                    'SE(3)-equivariant Structure Module, and FAPE loss.',
                                         'lab': True,
                                         'lessons': ['The Two-Track Evoformer Core: Co-Updating the N_seq x '
                                                     'N_res MSA Representation and the N_res x N_res Pair '
                                                     'Representation',
                                                     'Row-Wise Gated Self-Attention Biased by Pair Weights + '
                                                     'Column-Wise Attention Across Evolutionary Homologs',
                                                     'Triangle Multiplicative Updates and Triangle '
                                                     'Self-Attention: Enforcing 3D Euclidean Triangle '
                                                     'Inequality Consistency on the Pair Matrix!',
                                                     'The Structure Module: Representing Every Residue as a '
                                                     'Local Rigid-Body Frame T_i = (R_i, t_i) in SE(3) '
                                                     "('Residue Gas')",
                                                     'Invariant Point Attention (IPA): Transforming 3D '
                                                     "Query/Key/Value Points into Each Residue's Local Frame "
                                                     'for Exact Global SE(3) Equivariance',
                                                     'Frame Aligned Point Error (FAPE) Loss: Why Measuring '
                                                     "Atom Errors in Every Residue's Local Frame Handles "
                                                     'Mirror-Image Chiralities and Domain Hinges',
                                                     'Quantitative Case Study & Synthesis: Dissecting '
                                                     'AlphaFold2 & OpenFold: Evoformer Triangle Updates & '
                                                     'Invariant Point Attention'],
                                         'sim': 'attention_viz'},
                                        {'id': 'confidence_multimer_conformation',
                                         'title': 'pLDDT, PAE, AlphaFold-Multimer & Sampling Conformational '
                                                  'Ensembles',
                                         'summary': 'Interpreting pLDDT and Predicted Aligned Error (PAE), '
                                                    'protein-protein complex prediction (AF-Multimer), and '
                                                    'subsampling MSAs to uncover cryptic states.',
                                         'lab': True,
                                         'lessons': ['Intrinsic Confidence Heads: Per-Residue pLDDT (<50 '
                                                     'Indicates Intrinsic Disorder) and Predicted TM-Score '
                                                     '(pTM / ipTM)',
                                                     'Predicted Aligned Error (PAE) Matrices: Distinguishing '
                                                     'Rigid Multi-Domain Packing from Flexible Inter-Domain '
                                                     'Linkers',
                                                     'AlphaFold-Multimer (Evans et al.): Cross-Chain MSA '
                                                     'Pairing by Species Taxonomy, Stoichiometry, and '
                                                     'Homomer Chain Permutation Alignment',
                                                     'Screening Proteome-Wide Protein-Protein Interaction '
                                                     'Networks (Humphreys) and Peptide-MHC / '
                                                     'Antibody-Antigen Challenges',
                                                     'Hacking AlphaFold2 to Sample Alternative '
                                                     'Conformational States (GPCR Active/Inactive, '
                                                     'Transporter Inward/Outward): Shallow MSA Subsampling '
                                                     '(del Alamo) and AF-Cluster (Wayment-Steele)',
                                                     'ColabFold (Mirdita–Steinegger): MMseqs2 '
                                                     'GPU-Accelerated MSA Generation for 40x Faster '
                                                     'High-Throughput Structure Prediction',
                                                     'Quantitative Case Study & Synthesis: pLDDT, PAE, '
                                                     'AlphaFold-Multimer & Sampling Conformational '
                                                     'Ensembles'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'protein_language_models_esm',
                                         'title': 'Protein Language Models (ESM-2, ESMFold,ESM3) & '
                                                  'Evolutionary Fitness Landscapes',
                                         'summary': 'Masked language modeling across 250M UniRef sequences, '
                                                    'emergent contact attention heads, single-sequence '
                                                    'ESMFold, and zero-shot variant pathogenicity '
                                                    '(AlphaMissense).',
                                         'lab': True,
                                         'lessons': ['Rives, Lin & Rao ESM-1b / ESM-2: Masked Language '
                                                     'Modeling Over 250 Million UniRef Protein Sequences '
                                                     'Without Explicit MSAs',
                                                     'Emergence of 3D Contact Maps Inside Unsupervised '
                                                     'Transformer Self-Attention Heads (Rao et al.)',
                                                     'Lin et al. ESMFold: Replacing the Expensive MSA Search '
                                                     'and Evoformer with a 15B-Parameter Protein Language '
                                                     'Model Folding Trunk',
                                                     'Zero-Shot Mutational Effect Prediction (ESM-1v / Meier '
                                                     'et al.): Log-Likelihood Ratios log P(mut) - log P(wt) '
                                                     'Predict Deep Mutational Scanning Fitness',
                                                     'Cheng et al. AlphaMissense and Frazer et al. EVE: '
                                                     'Classifying Clinical Pathogenicity of All 71 Million '
                                                     'Possible Human Missense Variants',
                                                     'Hayes et al. ESM3: Multimodal Masked Generative '
                                                     'Modeling Jointly Over Sequence, 3D Structure Tokens '
                                                     '(VQ-VAE), and Function Keywords',
                                                     'Quantitative Case Study & Synthesis: Protein Language '
                                                     'Models (ESM-2, ESMFold,ESM3) & Evolutionary Fitness '
                                                     'Landscapes'],
                                         'sim': 'attention_viz'},
                                        {'id': 'alphafold3_all_atom_biomolecular',
                                         'title': 'All-Atom Biomolecular Complexes: RoseTTAFold All-Atom, '
                                                  'AlphaFold3, Chai-1 & Boltz-1',
                                         'summary': 'Generalizing beyond canonical amino acids to DNA, RNA, '
                                                    'small-molecule ligands, covalent modifications, and '
                                                    'ions via Pairformer + direct Cartesian diffusion.',
                                         'lab': True,
                                         'lessons': ['Moving Beyond Amino-Acid-Only Frames: Tokenizing '
                                                     'Standard Residues Alongside Atom-Level Small '
                                                     'Molecules, Ions, Glycans, and Modified Bases',
                                                     'Abramson et al. AlphaFold3 Architecture: Replacing the '
                                                     'Heavy MSA Evoformer with a 4-Block MSA Module + '
                                                     '48-Block Pairformer',
                                                     'Why AlphaFold3 Replaced the SE(3) '
                                                     'Invariant-Point-Attention Torsion Module with a Direct '
                                                     '3D All-Atom Diffusion Module!',
                                                     'Eliminating Stereochemical Clashes and Hallucinations '
                                                     'in Disordered Regions via AlphaFold2 '
                                                     'Cross-Distillation',
                                                     'Open-Weights All-Atom Ecosystems: Baker Lab '
                                                     'RoseTTAFold All-Atom (RFAA), Chai-1, and '
                                                     'Wohlwend–Corso–Barzilay–Jaakkola Boltz-1',
                                                     'PoseBusters Benchmark (Buttenschoen): Auditing '
                                                     'Physical Plausibility, Chirality, and Planarity of '
                                                     'AI-Predicted Protein-Ligand Poses',
                                                     'Quantitative Case Study & Synthesis: All-Atom '
                                                     'Biomolecular Complexes: RoseTTAFold All-Atom, '
                                                     'AlphaFold3, Chai-1 & Boltz-1'],
                                         'sim': 'nn_playground'}]},
                           {'id': 'bio_320',
                            'code': 'BIO 320',
                            'title': 'Inverse Folding (ProteinMPNN) & De Novo Protein Design (RFdiffusion)',
                            'level': 300,
                            'credits': 4,
                            'description': 'Graph neural network inverse folding (ProteinMPNN/LigandMPNN), '
                                           'SE(3) frame diffusion and flow matching '
                                           '(RFdiffusion/FrameFlow/Chroma), and de novo binder/scaffold '
                                           'design.',
                            'prerequisites': ['bio_220'],
                            'modules': [{'id': 'inverse_folding_proteinmpnn',
                                         'title': 'The Inverse Folding Problem: Graph Neural Networks, '
                                                  'ProteinMPNN & LigandMPNN',
                                         'summary': 'Designing amino acid sequences that fold into a target '
                                                    '3D backbone using message-passing graph neural networks '
                                                    'with inter-atomic distance encodings.',
                                         'lab': True,
                                         'lessons': ['The Inverse Folding Problem: Finding a Sequence s '
                                                     'Maximizing P(s | Backbone Coordinates X) While '
                                                     'Avoiding Off-Target Competing Folds',
                                                     'Why Classical Rosetta Fixed-Backbone Rotamer Design '
                                                     'Often Produces Overly Hydrophobic, Aggregation-Prone '
                                                     'Sequences',
                                                     "Ingraham's Structured Transformer and Hsu's ESM-IF1: "
                                                     'Autoregressive Sequence Decoding on K-Nearest-Neighbor '
                                                     'Spatial Residue Graphs',
                                                     'Dauparas et al. ProteinMPNN: Edge-Updated '
                                                     'Message-Passing GNN Using Pairwise N, C-alpha, C, O, '
                                                     'and Virtual C-beta RBF Distances + Random Decoding '
                                                     'Order!',
                                                     'Rescue of Previously Failed De Novo Designs: How '
                                                     'ProteinMPNN Boosts Experimental Soluble Expression and '
                                                     'Thermal Stability by >30 C',
                                                     'Dauparas et al. LigandMPNN & SolubleMPNN: Conditioning '
                                                     'Sequence Design Directly on Explicit Small-Molecule, '
                                                     'Nucleic-Acid, and Metal Atoms',
                                                     'Quantitative Case Study & Synthesis: The Inverse '
                                                     'Folding Problem: Graph Neural Networks, ProteinMPNN & '
                                                     'LigandMPNN'],
                                         'sim': 'graph_theory'},
                                        {'id': 'se3_diffusion_rfdiffusion',
                                         'title': 'SE(3) Diffusion & Flow Matching on Rigid Frames: '
                                                  'RFdiffusion, FrameDiff & Chroma',
                                         'summary': 'Brownian motion on SO(3) x R^3, fine-tuning RoseTTAFold '
                                                    "as a denoising score network (RFdiffusion), Ingraham's "
                                                    'Chroma, and Bose/Yim SE(3) flow matching.',
                                         'lab': True,
                                         'lessons': ['Early Hallucination / TrRosetta Inversion Approaches '
                                                     '(Anishchenko) vs. True Generative Diffusion over 3D '
                                                     'Coordinates',
                                                     'Formulating Forward Noising on SE(3)^N: Euclidean '
                                                     'Gaussian Diffusion on C-alpha Translations R^3 + '
                                                     'IGSO(3) Heat-Kernel Brownian Motion on Rotations SO(3)',
                                                     'Watson, Juergens, Bennett, Trippe, Yim et al. (2023) '
                                                     'RFdiffusion: Fine-Tuning Pretrained RoseTTAFold '
                                                     'Structure Weights as an SE(3) Denoiser!',
                                                     'Self-Conditioning on Previous-Step X_0 Predictions and '
                                                     'Classifier-Free Guidance for Symmetry and Hotspot '
                                                     'Conditioning',
                                                     'Ingraham et al. Chroma: O(N) Long-Range Random-Graph '
                                                     'Message Passing + Polymer-Physics Correlated '
                                                     'Covariance Noise + Programmable Potentials',
                                                     'Yim et al. FrameFlow & Multiflow: Riemannian Flow '
                                                     'Matching on SE(3) for 5–10x Fewer Integration Steps '
                                                     'and Joint Sequence-Structure Co-Generation'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'de_novo_binder_design',
                                         'title': 'De Novo Protein Binder Design: Epitope Hotspots, '
                                                  'AlphaFold2 Filtering & Yeast Display',
                                         'summary': 'Targeting flat, undruggable protein surfaces with '
                                                    'picomolar de novo minibinders (Cao/Watson), BindCraft '
                                                    'gradient hallucination, and high-throughput wet-lab '
                                                    'screening.',
                                         'lab': True,
                                         'lessons': ["Why Flat Protein-Protein Interfaces Are 'Undruggable' "
                                                     'by Small Molecules and Challenging for Immunization',
                                                     'Cao, Coventry & Baker RifDock PatchDocking vs. '
                                                     'One-Shot Target-Conditioned RFdiffusion Around '
                                                     'Hydrophobic Epitope Hotspot Residues',
                                                     'The Gold-Standard In-Silico Filter Pipeline: '
                                                     'RFdiffusion Backbone -> ProteinMPNN Sequence -> '
                                                     'AlphaFold2 Single-Sequence Interface pAE '
                                                     '(pae_interaction < 10)!',
                                                     'Why AlphaFold2 Initial-Guess / Single-Sequence '
                                                     'Filtering Predicts Experimental Wet-Lab Binder Success '
                                                     'with 10–50% Hit Rates',
                                                     'Pacesa et al. BindCraft: Direct Multimer '
                                                     'Backpropagation Hallucination of High-Affinity Binders '
                                                     'Without Separate Diffusion/Inverse-Folding Stages',
                                                     'Experimental Validation: Oligo Pool Synthesis, Yeast '
                                                     'Surface Display FACS Sorting, Biolayer Interferometry '
                                                     '(BLI), and Surface Plasmon Resonance (SPR K_d)'],
                                         'sim': 'gradient_descent'},
                                        {'id': 'motif_scaffolding_symmetric_cages',
                                         'title': 'Functional Motif Scaffolding, Symmetric Oligomers & '
                                                  'Megadalton Viral-Like Cages',
                                         'summary': 'Inpainting catalytic triads and viral neutralizing '
                                                    'epitopes into stable de novo scaffolds, '
                                                    'cyclic/dihedral/icosahedral symmetry, and King–Baker '
                                                    'nanocages.',
                                         'lab': True,
                                         'lessons': ['The Motif Scaffolding Problem: Holding Discontinuous '
                                                     'Active-Site or Neutralizing-Epitope Coordinates Fixed '
                                                     'While Diffusing a Supporting Scaffold',
                                                     'Sub-Angstrom Scaffolding of RSV/Influenza/HIV '
                                                     'Neutralizing Epitopes for Structure-Based Vaccine '
                                                     'Immunogen Design (Correia / Schief / Baker)',
                                                     'Symmetric SE(3) Diffusion: Enforcing Point-Group '
                                                     'Symmetries (Cyclic C_n, Dihedral D_n, Tetrahedral, '
                                                     'Octahedral, Icosahedral) at Every Denoising Step',
                                                     'Two-Component Self-Assembling Protein Nanocages (King '
                                                     '& Baker): Designing Icosahedral Capsids for Targeted '
                                                     'mRNA/Drug Delivery and Multivalent Vaccines',
                                                     'Conformational Switch Design: Hinge Proteins, LockR De '
                                                     'Novo Cage Switches (Langan), and Allosteric Biosensors',
                                                     'Transmembrane Pore and Ion-Channel Design: Inverting '
                                                     'Exterior Hydrophobicity Within Lipid-Bilayer Z-Slabs'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'antibody_cdr_nanobody_design',
                                         'title': 'Computational Antibody & VHH Nanobody Engineering: CDR '
                                                  'Loop Design & Developability',
                                         'summary': 'IMGT numbering, H3 hypervariable loop folding '
                                                    '(ABodyBuilder/IgFold), RFantibody de novo CDR design, '
                                                    'humanization, and viscosity/immunogenicity '
                                                    'optimization.',
                                         'lab': True,
                                         'lessons': ['Immunoglobulin Architecture: Heavy/Light Chains, '
                                                     'Framework Regions, Six Complementarity-Determining '
                                                     'Region (CDR) Loops, and Camelid VHH Nanobodies',
                                                     'Chothia vs. IMGT Numbering Schemes, Canonical '
                                                     'CDR1/CDR2 Conformations, and the Unsolved Diversity of '
                                                     'CDR-H3 Loops',
                                                     'Antibody Language Models (AbLang, AntiBERTy) and Fast '
                                                     'Antibody Structure Predictors (IgFold, ABodyBuilder3, '
                                                     'EquiFold)',
                                                     'Bennett et al. RFantibody: Fine-Tuning RFdiffusion + '
                                                     'RoseTTAFold2 on Antibody-Antigen Complexes for De Novo '
                                                     'Atomic-Accuracy VHH/scFv Design',
                                                     'Affinity Maturation via ProteinMPNN / ESM-Logit '
                                                     'Scanning and Structure-Guided Epistasis',
                                                     'Therapeutic Developability Engineering: Eliminating '
                                                     'Deamidation/Isomerization Liability Motifs, Reducing '
                                                     'Hydrophobic Patch Aggregation (SAP), and Humanness '
                                                     'Scoring (BioPhi)'],
                                         'sim': 'nn_playground'}]},
                           {'id': 'bio_420',
                            'code': 'BIO 420',
                            'title': 'Protein Engineering: Directed Evolution, Fitness Landscapes & ML-Guided Optimization',
                            'level': 400,
                            'credits': 4,
                            'description': 'Engineer proteins by combining directed evolution, deep mutational scanning and '
                                           'machine-learning-guided design, and quantify binding and catalysis with physics-based '
                                           'tools. Bridges generative protein design to graduate-level enzyme and drug design.',
                            'prerequisites': ['bio_320'],
                            'modules': [{'id': 'directed_evolution',
                                         'title': 'Directed Evolution and Deep Mutational Scanning',
                                         'summary': 'Darwinian optimization in the lab and how to read its data.',
                                         'lessons': ["Arnold's Directed Evolution: Library Generation and Selection",
                                                     'Error-Prone PCR, DNA Shuffling and Site-Saturation Mutagenesis',
                                                     'Phage, Yeast and mRNA Display Selection Platforms',
                                                     'Deep Mutational Scanning and Enrich2 Fitness Scores',
                                                     'Continuous Evolution with PACE and OrthoRep']},
                                        {'id': 'fitness_landscapes',
                                         'title': 'Fitness Landscapes and Epistasis',
                                         'summary': 'The topology that determines whether evolution and design succeed.',
                                         'lab': True,
                                         'lessons': ["Sequence Space and Maynard Smith's Protein Space",
                                                     'Additive vs Epistatic Models and Walsh–Hadamard Decomposition',
                                                     'Rugged Landscapes: NK Models and Adaptive Walks',
                                                     'Analyzing Combinatorial Mutant Landscapes (GB1) in Python']},
                                        {'id': 'ml_guided_engineering',
                                         'title': 'Machine-Learning-Guided Protein Engineering',
                                         'summary': 'Using models to decide which variants to build next.',
                                         'lab': True,
                                         'lessons': ['Supervised Fitness Prediction from Embeddings (ESM + Ridge/GP)',
                                                     'Zero-Shot Variant Effect Prediction with Protein Language Models',
                                                     'Bayesian Optimization and Acquisition Functions for Active Learning',
                                                     'Batch Design Under Uncertainty and Exploration–Exploitation',
                                                     'Running a Simulated ML-Guided Directed Evolution Campaign']},
                                        {'id': 'binding_energetics',
                                         'title': 'Docking, Binding and Free-Energy Calculations',
                                         'summary': 'Physics-based estimation of protein–ligand and protein–protein affinity.',
                                         'lessons': ['Molecular Docking: Scoring Functions and Pose Search',
                                                     'Rosetta Energy Function and ddG Prediction',
                                                     'Alchemical Free-Energy Perturbation (FEP) Fundamentals',
                                                     'MM/PBSA and End-Point Methods: Speed vs Accuracy']},
                                        {'id': 'enzyme_catalysis',
                                         'title': 'Enzyme Catalysis Fundamentals',
                                         'summary': 'The kinetics and chemistry every enzyme designer must master.',
                                         'lab': True,
                                         'lessons': ['Michaelis–Menten Kinetics, kcat and kcat/KM',
                                                     'Transition-State Stabilization and Catalytic Strategies',
                                                     'Theozymes and the Inside-Out Approach to Enzyme Design',
                                                     'Fitting Enzyme Kinetics Data with SciPy']}]},
                           {'id': 'bio_520',
                            'code': 'BIO 520',
                            'title': 'De Novo Enzyme Design, All-Atom RFdiffusion & Structure-Based '
                                     'Generative Drug Discovery',
                            'level': 500,
                            'credits': 4,
                            'description': 'Transition-state theozymes (ertl/Houk), Riff-Diff/RFdiffusion '
                                           'All-Atom enzyme design (Yeh luciferase), geometric deep docking '
                                           '(DiffDock), and 3D pocket-conditioned ligand generation.',
                            'prerequisites': ['bio_320', 'bio_420'],
                            'modules': [{'id': 'theozymes_catalytic_design',
                                         'title': 'Computational Enzyme Design: Transition-State Theozymes, '
                                                  'Kemp Eliminases & Yeh Luciferase',
                                         'summary': "Pauling's transition-state stabilization theory, QM/MM "
                                                    'saddle-point theozymes, RosettaMatch/Riff-Diff '
                                                    'active-site scaffolding, and de novo '
                                                    'luciferases/hydrolases.',
                                         'lab': True,
                                         'lessons': ["Linus Pauling's Principle of Enzymatic Catalysis: "
                                                     'Preferential Binding and Electrostatic Stabilization '
                                                     'of the High-Energy Transition State (Delta G^‡)',
                                                     'Constructing Quantum-Mechanical Transition-State '
                                                     "'Theozymes' (Houk): DFT Saddle-Point Geometry of "
                                                     'Catalytic Triads + Oxyanion Holes',
                                                     'Why First-Generation RosettaMatch De Novo Enzymes '
                                                     '(Kemp Eliminase, Retro-Aldolase) Needed Rounds of '
                                                     'Directed Evolution to Reach Native k_cat / K_M',
                                                     'Yeh, Norn, Kipnis, Baker et al. (2023) De Novo '
                                                     'Luciferase: Scaffolding a Deep Shape-Complementary '
                                                     'Pocket Around Diphenylterazine with Family-Wide '
                                                     'Hallucination',
                                                     'RFdiffusion All-Atom (Krishna et al. 2024) and '
                                                     'Riff-Diff: Diffusing Protein Backbones Directly Around '
                                                     'Explicit Small-Molecule Substrates and Cofactors '
                                                     '(Heme/PLP/Zn2+)!',
                                                     'PLACER (Anishchenko): Predicting Pre-Organization and '
                                                     'Side-Chain Conformational Ensembles of Designed Active '
                                                     'Sites to Filter Out Floppy Dud Enzymes'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'directed_evolution_ml_epistasis',
                                         'title': 'Machine-Learning-Guided Directed Evolution (MLDE) & '
                                                  'Navigating Epistatic Landscapes',
                                         'summary': "Arnold's directed evolution, rugged NK fitness "
                                                    'landscapes, zero-shot protein fitness priors, Gaussian '
                                                    'process / Bayesian optimization, and active learning.',
                                         'lab': True,
                                         'lessons': ["Frances Arnold's Directed Evolution: Error-Prone PCR, "
                                                     'DNA Shuffling, and Why Greedy Single-Mutation Walks '
                                                     'Get Trapped in Local Epistatic Optima',
                                                     'Sign Epistasis and Reciprocal Sign Epistasis on Rugged '
                                                     'Protein Fitness Landscapes (Poelwijk / Wright)',
                                                     'Zero-Shot Cold-Start Prioritization (ProteinNPT / '
                                                     'EVmutation / ESM-2 / SaProt Structure-Aware Tokens) to '
                                                     'Enrich Initial Focused Libraries',
                                                     'Machine-Learning-Guided Directed Evolution (MLDE — Wu, '
                                                     'Kan, Lewis, Wittmann, Arnold): Training Ridge/GP '
                                                     'Surrogates on 96–384 Assayed Variants',
                                                     'Batch Bayesian Optimization (Upper Confidence Bound / '
                                                     'Thompson Sampling) Balancing Exploration of Epistatic '
                                                     'Combinations Against Exploitation',
                                                     "Continuous Evolution Systems (Liu's Phage-Assisted "
                                                     'Continuous Evolution — PACE and OrthoRep) Coupled with '
                                                     'Deep Sequencing Readouts'],
                                         'sim': 'gradient_descent'},
                                        {'id': 'geometric_molecular_docking',
                                         'title': 'Structure-Based Virtual Screening, Physics Docking '
                                                  '(Vina/Glide) & DiffDock',
                                         'summary': 'AutoDock Vina scoring functions, ultra-large '
                                                    'billion-molecule Enamine REAL screening, '
                                                    'Corso–Stärk–Barzilay–Jaakkola DiffDock torsional '
                                                    'diffusion, and dynamic co-folding.',
                                         'lab': True,
                                         'lessons': ['Classical Molecular Docking (AutoDock Vina, Glide): '
                                                     'Conformational Search Over Ligand Translation, '
                                                     'Rotation, and Rotatable Bonds + Empirical Scoring',
                                                     'Ultra-Large Virtual Screening of Billion-Molecule '
                                                     'Make-on-Demand Libraries (Lyu–Shoichet / Gorgulla '
                                                     'VirtualFlow) with Active-Learning Docking Surrogates',
                                                     'EquiBind and TankBind Regression Failure Modes (Steric '
                                                     'Clashes) vs. Corso et al. DiffDock Generative '
                                                     'Diffusion Over the Product Manifold R^3 x SO(3) x T^m!',
                                                     'Why DiffDock Separates a Score Model (Generating '
                                                     'Diverse Candidate Poses) from an SE(3)-Invariant '
                                                     'Confidence Model (Ranking Top-1 RMSD < 2 A)',
                                                     'Failure of Rigid-Receptor Docking on Apo Structures '
                                                     'and Induced-Fit / Flexible-Pocket Co-Folding '
                                                     '(DynamicBind, NeuralPLexer, AlphaFold3, Boltz-1)',
                                                     'Rescoring Docked Hits with Absolute/Relative '
                                                     'Alchemical Free-Energy Perturbation (OpenFE / FEP+) '
                                                     'Before Medicinal Chemistry Synthesis'],
                                         'sim': 'matrix_transform'},
                                        {'id': '3d_generative_ligand_design',
                                         'title': 'Pocket-Conditioned 3D Molecular Generation, '
                                                  'Synthesizability & PROTAC Degraders',
                                         'summary': 'E(3)-equivariant diffusion (EDM/Pocket2Mol/TargetDiff), '
                                                    'synthesizable synthon flow matching (SyntheMol), and '
                                                    'ternary complex modeling for PROTAC molecular glues.',
                                         'lab': True,
                                         'lessons': ['SMILES/SELFIES 1D String Generation and 2D Molecular '
                                                     'Graph Generation vs. Direct 3D Pocket-Conditioned '
                                                     'Point-Cloud Diffusion (TargetDiff / Schneuing '
                                                     'DiffSBDD)',
                                                     'E(3)-Equivariant Graph Neural Networks (Satorras EGNN '
                                                     '/ SchNet / Painn): Updating Atom Types and 3D '
                                                     'Coordinates Simultaneously Inside the Binding Pocket',
                                                     'The Synthesizability Gap of 3D Point-Cloud Generators: '
                                                     'Strained Rings, Unstable Functional Groups, and '
                                                     'Impossible Synthetic Routes',
                                                     'Synthesizability-Constrained Generation: Enamine '
                                                     'Building-Block Reaction Templates (SynNet, SyntheMol, '
                                                     'Cretu SynFlowNet) Guaranteeing 1–3 Step Synthesis!',
                                                     'Multi-Parameter ADMET Optimization: Lipinski/Veber '
                                                     'Permeability, hERG Cardiotoxicity, CYP450 Metabolism, '
                                                     'and Blood-Brain Barrier Penetration',
                                                     'Targeted Protein Degradation (PROTACs & Molecular '
                                                     'Glues): Modeling Protein-Ligand-E3 Ligase (CRBN/VHL) '
                                                     'Cooperative Ternary Complexes'],
                                         'sim': 'atom_builder'}]}]},
              {'id': 'genetic_circuits_crispr',
               'name': 'Genetic Circuits & CRISPR Engineering',
               'icon': '✂️',
               'description': 'Biophysical modeling of synthetic gene circuits (Gardner toggle switch, '
                              'Elowitz repressilator), Cello logic synthesis, CRISPR-Cas9/Cas12/Cas13, Liu '
                              'base and prime editing, and metabolic engineering.',
               'courses': [{'id': 'bio_130',
                            'code': 'BIO 130',
                            'title': 'Synthetic Gene Circuits: Hill Kinetics, Toggle Switches, Oscillators & '
                                     'Cello Logic',
                            'level': 100,
                            'credits': 4,
                            'description': 'Model and design synthetic transcriptional/translational '
                                           'circuits using Hill cooperativity, phase-plane bistability '
                                           '(Gardner–Collins), Hopf limit cycles (Elowitz–Leibler), and '
                                           'Cello Verilog.',
                            'prerequisites': [],
                            'modules': [{'id': 'hill_kinetics_gene_regulation',
                                         'title': 'Thermodynamic Promoter Modeling, Hill Cooperativity & '
                                                  'Autoregulation',
                                         'summary': 'Shea–Ackers statistical-mechanical promoter states, '
                                                    'cooperative transcription factor binding (Hill '
                                                    'coefficient n), and negative/positive autoregulation '
                                                    'speed/noise.',
                                         'lab': True,
                                         'lessons': ['Central Dogma ODEs: Transcription Rate beta_m, mRNA '
                                                     'Degradation gamma_m, Translation Rate beta_p, and '
                                                     "Dilution/Degradation gamma_p (Alon's Systems Biology)",
                                                     'Shea–Ackers Statistical Thermodynamics of Promoter '
                                                     'Occupancy: RNAP, Repressors, and Cooperative '
                                                     'Dimer/Tetramer Binding Energies',
                                                     'Deriving the Activating and Repressing Hill Functions '
                                                     'f(X) = beta / (1 + (X / K)^n) and Ultrasensitivity '
                                                     '(Goldbeter–Koshland)',
                                                     'Negative Autoregulation (NAR): Accelerating Response '
                                                     'Time T_{1/2} by 5x and Linearizing Dose-Response '
                                                     '(Rosenfeld–Elowitz–Alon)',
                                                     'Positive Autoregulation (PAR): Slowing Response Time, '
                                                     'Bimodal Population Splitting, and Saddle-Node '
                                                     'Hysteresis',
                                                     'Feed-Forward Loops (Alon): Coherent Type-1 Persistence '
                                                     'Detector (Sign-Sensitive Delay) vs. Incoherent Type-1 '
                                                     'Pulse Generator & Fold-Change Detector'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'toggle_switch_repressilator',
                                         'title': 'Foundational Synthetic Circuits: The Gardner Toggle '
                                                  'Switch & Elowitz Repressilator',
                                         'summary': 'Nullcline geometry of the mutual-repression bistable '
                                                    'toggle switch (Gardner–Cantor–Collins 2000) and Linear '
                                                    'stability Hopf condition of the 3-gene repressilator '
                                                    '(Elowitz–Leibler 2000).',
                                         'lab': True,
                                         'lessons': ['Gardner, Cantor & Collins (2000) Genetic Toggle '
                                                     'Switch: Two Mutually Repressing Transcriptional '
                                                     'Repressors (LacI and TetR)',
                                                     'Phase-Plane Nullcline Analysis: Why Cooperativity n > '
                                                     '1 Is Required for Three Intersections (Two Stable '
                                                     'Memory States + One Unstable Saddle)',
                                                     'Set/Reset Chemical/Thermal Induction Pulses (IPTG and '
                                                     'aTc) and Bifurcation Diagram of the Toggle Switch',
                                                     'Elowitz & Leibler (2000) Repressilator: Cyclic '
                                                     'Odd-Number Ring of Three Repressors (LacI -| TetR -| '
                                                     'cI -| LacI)',
                                                     'Secular Determinant Stability Analysis Around the '
                                                     'Symmetric Fixed Point: Deriving the Hopf Bifurcation '
                                                     'Condition for Sustained Oscillations!',
                                                     'Potvin-Trottier et al. (2016) Synchronous Low-Noise '
                                                     'Repressilator: Eliminating Reporter-Plasmid Titration '
                                                     'and ClpXP Degradation Queuing'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'stochastic_gillespie_noise',
                                         'title': 'Intrinsic vs. Extrinsic Gene Expression Noise & '
                                                  "Gillespie's Stochastic Simulation",
                                         'summary': 'Low-copy transcriptional bursting, Chemical Master '
                                                    "Equation (CME), Gillespie's exact SSA, Elowitz "
                                                    'dual-reporter noise decomposition, and noise-filtering '
                                                    'circuits.',
                                         'lab': True,
                                         'lessons': ['Why Deterministic ODEs Fail at Low Copy Numbers (1–10 '
                                                     'DNA/mRNA Molecules per Cell): Transcriptional Bursting',
                                                     "The Chemical Master Equation (CME) and Gillespie's "
                                                     '(1977) Exact Stochastic Simulation Algorithm (Direct '
                                                     'Method and Next-Reaction Method)',
                                                     "Paulsson's Linear Noise Approximation "
                                                     '(Fluctuation-Dissipation Theorem): Fano Factor '
                                                     '(Variance / Mean) Amplification by Translational Burst '
                                                     'Size b',
                                                     'Elowitz, Levine, Siggia & Swain (2002) Dual-Reporter '
                                                     'Assay: Separating Intrinsic (Promoter-Local) vs. '
                                                     'Extrinsic (Ribosome/Cell-Cycle Global) Noise',
                                                     'Negative Feedback Noise Suppression vs. High-Gain '
                                                     'Delay-Induced Noise Amplification '
                                                     '(Lestas–Vinnicombe–Paulsson Quartic Fundamental '
                                                     'Bound!)',
                                                     'Integral Feedback Control in Living Cells: '
                                                     'Briat–Gupta–Khammash Antithetic Integral Controller '
                                                     '(sigma-Factor / Anti-sigma Sequestration) for Robust '
                                                     'Perfect Adaptation'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'cello_genetic_logic_synthesis',
                                         'title': "Automated Genetic Logic Synthesis (Voigt's Cello), "
                                                  'Riboregulators & Context Effects',
                                         'summary': 'Compiling Verilog Boolean specifications into insulated '
                                                    'NOR/NOT gate cascades (Cello), response-function '
                                                    'matching, retroactivity, and ribozyme insulators.',
                                         'lab': True,
                                         'lessons': ["Voigt's Cello Compiler: Translating High-Level Verilog "
                                                     'Boolean Truth Tables into Transcriptional NOR and NOT '
                                                     'Gate Netlists',
                                                     'Cytometry Response Functions (y_min, y_max, K, n) in '
                                                     'Relative Promoter Units (RPUs) and Gate Input-Output '
                                                     'Threshold Matching',
                                                     'Overcoming Promoter Context Effects: RiboJ '
                                                     'Self-Cleaving Hammerhead Ribozyme Insulators '
                                                     "Standardizing 5' UTR mRNA Stability",
                                                     'Strong bidirectional Terminators (Chen–Voigt) to '
                                                     'Prevent Transcriptional Read-Through Interference',
                                                     'Retroactivity (Del Vecchio–Ninfa–Sontag): How '
                                                     'Downstream DNA Binding Sites Load Upstream '
                                                     'Transcription Factor Dynamics',
                                                     'Resource Competition for Shared Host RNA Polymerases '
                                                     "and Ribosomes ('Burden') and Endoribonuclease "
                                                     '(CasE/Csy4) Resource-Decoupled Gates (Qian–Del '
                                                     'Vecchio)'],
                                         'sim': 'truth_table'},
                                        {'id': 'rna_switches_mammalian_circuits',
                                         'title': 'RNA Toehold Switches, Mammalian SynNotch Receptors & '
                                                  'Therapeutic Cell Circuits',
                                         'summary': "Green–Yin de novo RNA toehold switches, Lim's modular "
                                                    'synNotch/CAR-T Boolean logic gates for tumor '
                                                    "recognition, and Gao's CHOMP/RADAR RNA sensors.",
                                         'lab': True,
                                         'lessons': ['Green, Silver, Collins & Yin De Novo Toehold Switches: '
                                                     'Sequestering the RBS and Start Codon in a Hairpin '
                                                     'Unlocked by Arbitrary Trigger RNAs',
                                                     'Paper-Based Cell-Free Freeze-Dried Diagnostics for '
                                                     'Viral Pathogens (Zika, Ebola, SARS-CoV-2) Coupled with '
                                                     'CRISPR-Cas12/Cas13',
                                                     'ADAR Programmable RNA Editing Sensors (RADAR / '
                                                     'CellREADR): Detecting Endogenous Cell-State '
                                                     'Transcripts to Trigger Therapeutic Protein '
                                                     'Translation!',
                                                     "Wendell Lim's Synthetic Notch (synNotch) Receptors: "
                                                     'Custom Extracellular scFv + Cleavable Intracellular '
                                                     'Transcription Factor',
                                                     'Boolean AND/NOT Logic-Gated CAR-T Cells: Preventing '
                                                     'On-Target Off-Tumor Toxicity in Solid Tumors via '
                                                     'Dual-Antigen Recognition',
                                                     "Protein-Level Protease Circuits (Gao's CHOMP — "
                                                     'Circuits of Hacked Orthogonal Modular Proteases) for '
                                                     'Fast Post-Translational Logic'],
                                         'sim': 'truth_table'}]},
                           {'id': 'bio_230',
                            'code': 'BIO 230',
                            'title': 'DNA Assembly Standards, Multiplex Genome Engineering & Synthetic '
                                     'Genomes',
                            'level': 200,
                            'credits': 4,
                            'description': 'Gibson isothermal assembly, Type IIS Golden Gate MoClo '
                                           'standards, phosphoramidite/enzymatic DNA synthesis, Church '
                                           'MAGE/CAGE recoding, and Sc2.0/JCVI-syn3.0 synthetic genomes.',
                            'prerequisites': ['bio_110', 'bio_130'],
                            'modules': [{'id': 'gibson_golden_gate_assembly',
                                         'title': 'Modern DNA Assembly: Gibson Isothermal, Type IIS Golden '
                                                  'Gate & MoClo Standards',
                                         'summary': 'Exonuclease-polymerase-ligase Gibson overlaps, '
                                                    'outside-cutter Type IIS restriction enzymes '
                                                    '(BsaI/BpiI), scarless Golden Gate 4-bp overhang '
                                                    'fidelity, and Loop/MoClo hierarchies.',
                                         'lab': True,
                                         'lessons': ['Why Classical BioBrick (EcoRI/XbaI/SpeI/PstI) Assembly '
                                                     'Left 8-bp In-Frame Scars and Scaled Poorly to '
                                                     'Multi-Part Pathways',
                                                     'Gibson, Young, Chuang, Venter et al. (2009) One-Pot '
                                                     "Isothermal Assembly: 5'->3' T5 Exonuclease Chew-Back + "
                                                     'Phusion Polymerase + Taq Ligase',
                                                     'Secondary-Structure Pitfalls in Gibson Overlaps and '
                                                     'Optimizing Melting Temperature Homology Arms (20–40 '
                                                     'bp)',
                                                     'Engler & Marillonnet Golden Gate Assembly: Type IIS '
                                                     'Restriction Enzymes (BsaI, BbsI, Esp3I) Cutting '
                                                     'Outside Their Recognition Sequence!',
                                                     'Potapov et al. Ligase Fidelity Profiling (NEB): '
                                                     'Selecting Orthogonal 4-bp Overhang Sets Allowing 24–35 '
                                                     'Fragment One-Pot Assemblies at >90% Accuracy',
                                                     'Hierarchical Modular Cloning (MoClo / GoldenBraid): '
                                                     'Level 0 Parts (Promoter, UTR, CDS, Terminator) -> '
                                                     'Level 1 Transcription Units -> Level 2 Multigene '
                                                     'Pathways'],
                                         'sim': 'state_machine'},
                                        {'id': 'dna_synthesis_error_correction',
                                         'title': 'Chemical (Phosphoramidite), Array & Enzymatic (TdT) DNA '
                                                  'Synthesis',
                                         'summary': 'Four-step phosphoramidite cycle, 99.5% step-yield '
                                                    'length limits, silicon/inkjet microarray oligo pools, '
                                                    'MutS mismatch error correction, and TdT enzymatic '
                                                    'synthesis.',
                                         'lab': True,
                                         'lessons': ["Caruthers's Four-Step Solid-Phase Phosphoramidite "
                                                     'Cycle: Detritylation, Coupling, Capping, and Oxidation',
                                                     'The Tyranny of the Exponent: Why 99.3% Coupling '
                                                     'Efficiency Limits Raw Chemical Oligos to ~200–300 nt '
                                                     '(0.993^{200} = 24.5% Full-Length!)',
                                                     'High-Density Microarray Oligo Pools (Twist Silicon '
                                                     'Nanowells / Agilent Inkjet): Synthesizing 10^5–10^6 '
                                                     'Oligos at <0.001 Cent/Base',
                                                     'Selective PCR Amplification of Sub-Pools from Complex '
                                                     'Oligo Libraries Using Orthogonal Primer Barcodes '
                                                     '(Kosuri–Church)',
                                                     'Enzymatic Error Correction of Assembled Genes: MutS '
                                                     'Mismatch-Binding Protein Columns and ErrASE '
                                                     'Endonuclease Cleavage',
                                                     'Template-Independent Terminal Deoxynucleotidyl '
                                                     'Transferase (TdT) Reversible-Terminator Enzymatic DNA '
                                                     'Synthesis'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'mage_genome_recoding_gro',
                                         'title': 'Multiplex Automated Genome Engineering (MAGE) & '
                                                  'Genomically Recoded Organisms',
                                         'summary': 'Lambda-Red beta-recombinase ssDNA lagging-strand '
                                                    'allelic replacement, Church/Isaacs CAGE freeing the UAG '
                                                    'Amber stop codon across E. coli, and virus resistance.',
                                         'lab': True,
                                         'lessons': ['Wang & Church (2009) MAGE: Lambda-Red Beta Protein '
                                                     'Annealing 90-nt ssDNA Oligos into the Lagging Strand '
                                                     'at the Replication Fork',
                                                     'Disabling Methyl-Directed Mismatch Repair (mutS-) vs. '
                                                     'Transient Dominant-Negative MutL Overexpression to '
                                                     'Boost Allelic Replacement Efficiency',
                                                     'Lajoie, Rovner, Lau,arrant, Isaacs & Church (2013) '
                                                     'Genomically Recoded Organism (CAGE): Replacing All 321 '
                                                     'UAG Amber Stop Codons with UAA + Deleting Release '
                                                     'Factor 1 (prfA)!',
                                                     'Fredens & Chin (2019) Syn61: Total Synthesis of a '
                                                     '4-Megabase E. coli Genome Compressed to 61 Sense/Stop '
                                                     'Codons (Removing TCG, TCA, and TAG)',
                                                     'Robertson & Chin (2021): Deleting Cognate tRNAs and '
                                                     'Release Factors in Syn61 Makes the Cell Completely '
                                                     'Refractory to Bacteriophage Infection and Horizontal '
                                                     'Gene Transfer!',
                                                     'Genetic Code Expansion: Orthogonal Aminoacyl-tRNA '
                                                     'Synthetase / tRNA_{CUA} Pairs (PylRS) Incorporating '
                                                     'Non-Canonical Amino Acids (ncAAs) at Recoded Codons'],
                                         'sim': 'graph_theory'},
                                        {'id': 'minimal_synthetic_genomes',
                                         'title': 'Bottom-Up Whole-Genome Synthesis: JCVI-syn1.0, Minimal '
                                                  'Cell JCVI-syn3.0 & Sc2.0 Yeast',
                                         'summary': 'Venter/Hutchison/Glass minimal Mycoplasma genome (473 '
                                                    'genes), yeast homologous recombination TAR cloning, and '
                                                    "Boeke's Synthetic Yeast 2.0 (SCRaMbLE).",
                                         'lab': True,
                                         'lessons': ['Gibson et al. (2010) JCVI-syn1.0: Assembling a 1.08 Mb '
                                                     'Mycoplasma mycoides Genome from Digitized Sequence in '
                                                     'Yeast and Transplanting It into a Recipient Cell',
                                                     'Hutchison, Chuang, Noskov, Assad-Garcia, Deerinck, '
                                                     'Ellisman, Gill, Kannan, Karas, Ma, Pelletier, Qi, '
                                                     'Richter, Strychalski, Sun, Suzuki, Tsvetanova, Wise, '
                                                     'Smith, Glass & Venter (2016) JCVI-syn3.0: '
                                                     'Design-Build-Test Reduction to a 531 kb, 473-Gene '
                                                     'Minimal Autonomous Genome',
                                                     'The Humbling Discovery in JCVI-syn3.0: 149 of the 473 '
                                                     'Essential Genes Had Unknown Biological Function at the '
                                                     'Time of Synthesis!',
                                                     'JCVI-syn3A + Pelletier (2021): Restoring 7 Genes '
                                                     '(Including ftsZ and SepF) to Recover Normal Spherical '
                                                     'Cell Division Morphology',
                                                     "Boeke's Sc2.0 Synthetic Eukaryotic Yeast Project: "
                                                     'Removing Introns/Retrotransposons, Relocating tRNAs to '
                                                     'a Neochromosome, and TAG->TAA Stop Swapping',
                                                     'SCRaMbLE (Synthetic Chromosome Rearrangement and '
                                                     'Modification by LoxP-Mediated Evolution): Inducible '
                                                     'Cre-loxPsym Combinatorial Genome Shuffling'],
                                         'sim': 'graph_theory'},
                                        {'id': 'biosecurity_dna_screening',
                                         'title': 'Biosecurity Engineering: DNA Synthesis Screening, '
                                                  'Biocontainment & Gene Drives',
                                         'summary': 'IGSC customer/sequence screening protocols, auxotrophic '
                                                    'ncAA firewalls, CRISPR homing gene drives, and '
                                                    'daisy-chain/reversal safeguard architectures.',
                                         'lab': True,
                                         'lessons': ['International Gene Synthesis Consortium (IGSC) and '
                                                     'Framework for Nucleic Acid Synthesis Screening: '
                                                     'Know-Your-Customer + Best-Match Sequence Screening',
                                                     'Cryptographic Secure DNA Screening (SecureDNA): '
                                                     'Oblivious Hash-Window Matching to Detect Regulated '
                                                     'Toxins/Pathogens Without Exposing Proprietary Designs',
                                                     'Engineered Genetic Biocontainment (Mandell / Rovner): '
                                                     'Redesigning Essential Enzymes (adk, tyrS) to Strictly '
                                                     'Require Synthetic Non-Canonical Amino Acids '
                                                     '(Biphenylalanine)',
                                                     'Achieving <10^{-12} Escape Frequencies via '
                                                     'Multi-Layered Auxotrophy + Toxin-Antitoxin Kill '
                                                     'Switches',
                                                     "Burt's CRISPR Homing Gene Drives: Super-Mendelian "
                                                     'Inheritance by Copying the Drive Cassette into the '
                                                     'Wild-Type Homologous Chromosome in the Germline',
                                                     "Controlling Gene Drives: Esvelt's Split/Daisy-Chain "
                                                     'Drives, Threshold-Dependent Underdominance, and '
                                                     'Anti-CRISPR/Catch-and-Replace Reversal Drives'],
                                         'sim': 'truth_table'}]},
                           {'id': 'bio_330',
                            'code': 'BIO 330',
                            'title': 'CRISPR-Cas Biology, Base Editing, Prime Editing & Epigenome Editing',
                            'level': 300,
                            'credits': 4,
                            'description': 'Class 1/2 CRISPR diversity, SpCas9 R-loop/HNH/RuvC kinetics, '
                                           "Cas12a/Cas13 collateral cleavage, David Liu's cytosine/adenine "
                                           'base editors, prime editing (PE2–PE7/twinPE), and CRISPRoff.',
                            'prerequisites': ['bio_210', 'bio_230'],
                            'modules': [{'id': 'crispr_cas_biophysics_pam',
                                         'title': 'CRISPR-Cas Biophysics: PAM Recognition, R-Loop Zippering '
                                                  '& High-Fidelity Cas9',
                                         'summary': "SpCas9 5'-NGG-3' PAM interrogation, seed region R-loop "
                                                    'directional unwinding, conformational HNH activation, '
                                                    'Cas12a staggered cuts, and off-target profiling '
                                                    '(GUIDE-seq).',
                                         'lab': True,
                                         'lessons': ['Prokaryotic Adaptive Immunity: Spacer Acquisition '
                                                     '(Cas1-Cas2), crRNA Biogenesis, and Class 1 '
                                                     '(Multi-Subunit Cascade) vs. Class 2 (Single-Effector '
                                                     'Cas9, Cas12, Cas13)',
                                                     'Jinek, Chylinski, Fonfara, Hauer, Doudna & Charpentier '
                                                     '(2012): Fusing crRNA and tracrRNA into a Programmable '
                                                     'Single-Guide RNA (sgRNA)',
                                                     'Biophysics of Target Search: 3D Diffusion + 1D '
                                                     "PAM-Sliding (5'-NGG-3'), Directional R-Loop Seed (nt "
                                                     '1–10) Zippering, and Allosteric HNH/RuvC Nuclease '
                                                     'Activation',
                                                     'Cellular Repair of Double-Strand Breaks (DSBs): '
                                                     'Error-Prone Non-Homologous End Joining (NHEJ), '
                                                     'Microhomology MMEJ, and Homology-Directed Repair (HDR)',
                                                     'Experimental Off-Target Discovery: GUIDE-Seq (dsODN '
                                                     'Capture), CIRCLE-Seq, DISCOVER-Seq (MRE11 ChIP), and '
                                                     'Deep Off-Target Scoring (Elevation / CRISPR-Net)',
                                                     'Rationally Engineered High-Fidelity Cas9 Variants '
                                                     '(SpCas9-HF1, eSpCas9, HypaCas9, SuperFi-Cas9) and '
                                                     'PAM-Relaxed SpRY (Walton–Kleinstiver)'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'base_editing_cbe_abe',
                                         'title': "David Liu's Cytosine & Adenine Base Editors (CBE & ABE): "
                                                  'Chemistry Without DSBs',
                                         'summary': 'Why DSBs cause p53 activation, large deletions, and '
                                                    'chromothripsis; Komor cytidine deaminase (CBE) and '
                                                    'Gaudelli laboratory-evolved TadA deoxyadenosine '
                                                    'deaminase (ABE).',
                                         'lab': True,
                                         'lessons': ['The Dark Side of Double-Strand Breaks: p53 DNA-Damage '
                                                     'Arrest, Megabase On-Target Deletions/Translocations, '
                                                     'and Low HDR in Post-Mitotic Cells',
                                                     'Komor, Kim, Packer, Zuris & Liu (2016) Cytosine Base '
                                                     'Editor (CBE): dCas9/nCas9(D10A) + APOBEC/AID Deaminase '
                                                     '(C -> U -> T) + Uracil Glycosylase Inhibitor (UGI)',
                                                     'Nickase Strand Biasing: Nicking the Non-Edited Strand '
                                                     'Tricks Eukaryotic Mismatch Repair into Using the '
                                                     'Deaminated Strand as Template (BE3 -> BE4max)!',
                                                     'The Missing Enzyme Challenge: No Natural Enzyme '
                                                     'Deaminates Adenine in DNA (A -> Inosine, Read as G by '
                                                     'Polymerases)',
                                                     'Gaudelli, Komor, Rees, Packer, Badran, Bryson & Liu '
                                                     '(2017) Adenine Base Editor (ABE): 7 Rounds of Directed '
                                                     'Evolution of E. coli tRNA Deaminase TadA to Accept DNA '
                                                     '(ABE7.10 / ABE8e)!',
                                                     'Managing Base-Editing Challenges: Activity Window '
                                                     '(Positions 4–8), Bystander Edits, Cas-Independent '
                                                     'Off-Target DNA/RNA Deamination, and TadA-Derived CBEs '
                                                     '(TadCBE)'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'prime_editing_twinpe_passes',
                                         'title': 'Search-and-Replace Genome Editing: Prime Editing '
                                                  '(PE1–PE7), TwinPE & PASTE',
                                         'summary': 'Anzalone–Liu prime editing (Cas9 H840A nickase + M-MLV '
                                                    'reverse transcriptase + pegRNA), epegRNA pseudoknot '
                                                    'shields, MMR evasion (PE4/PE5), and serine integrase '
                                                    'gene insertion.',
                                         'lab': True,
                                         'lessons': ['Limitations of Base Editors: Can Only Perform 4 '
                                                     'Transition Mutations (C<->T, A<->G); Cannot Perform '
                                                     'Transversions or Targeted Indels',
                                                     'Anzalone, Randolph, Davis, Sousa, Koblan, Levy, Chen, '
                                                     'Wilson, Newby, Raguram & Liu (2019) Prime Editing: '
                                                     'nCas9(H840A) + Engineered M-MLV Reverse Transcriptase '
                                                     '+ pegRNA!',
                                                     "Anatomy of a pegRNA: Spacer + Scaffold + 3' Extension "
                                                     'Containing the Primer Binding Site (PBS) and Reverse '
                                                     'Transcription Template (RTT)',
                                                     "3'-Flap vs. 5'-Flap Equilibration, FEN1 Endonuclease "
                                                     "5'-Flap Cleavage, and PE3 Second-Strand Nicking",
                                                     "Overcoming 3' Exonuclease pegRNA Degradation (Nelson "
                                                     'et al. epegRNAs with evoPreQ1 Pseudoknots), MMR '
                                                     'Evasion (Chen et al. MLH1dn PE4/PE5), and La-Protein '
                                                     'Binding (PE7)',
                                                     'Kilobase Gene Insertion Without DSBs: Anzalone TwinPE '
                                                     '+ Bxb1 Serine Integrase (PASSIGE) and '
                                                     'Abudayyeh–Gootenberg PASTE'],
                                         'sim': 'state_machine'},
                                        {'id': 'epigenome_editing_crispri_off',
                                         'title': 'Programmable Epigenome Editing: CRISPRi, CRISPRa & '
                                                  'Heritable CRISPRoff/CRISPRon',
                                         'summary': 'dCas9-KRAB heterochromatin silencing, VP64/VPR/SAM '
                                                    'transcriptional activation, and Nuñez–Weissman–Gilbert '
                                                    'dCas9-DNMT3A/3L-KRAB mitotic epigenetic memory.',
                                         'lab': True,
                                         'lessons': ['Catalytically Dead Cas9 (dCas9: D10A + H840A) as a '
                                                     'Programmable DNA-Binding Platform',
                                                     'CRISPR Interference (CRISPRi — Qi, Larson, Gilbert, '
                                                     'Weissman): dCas9-KRAB (ZIM3 KRAB) Recruiting KAP1 and '
                                                     'HP1alpha to Deposit H3K9me3',
                                                     'CRISPR Activation (CRISPRa): dCas9-VP64, Chavez VPR '
                                                     '(VP64-p65-Rta), Tanenbaum SunTag Peptide Array, and '
                                                     'Konermann Synergistic Activation Mediator (SAM)',
                                                     'Nuñez, Chen, Pommier, Cogan, Replogle, Adriaens, '
                                                     'Ramalingam, Fuchs,ining, Weissman & Gilbert (2021) '
                                                     'CRISPRoff: Fusion of DNMT3A, DNMT3L, and KRAB!',
                                                     'How Transient Expression of CRISPRoff Writes Durable '
                                                     'CpG Methylation + H3K9me3 Inherited Across >450 Cell '
                                                     'Divisions and Stem-Cell Differentiation!',
                                                     'Reversing Epigenetic Silencing with CRISPRon '
                                                     '(dCas9-TET1 Demethylase) and Ultracompact CasMINI / '
                                                     'Zinc-Finger Epigenetic Repressors for In-Vivo '
                                                     'Delivery'],
                                         'sim': 'state_machine'},
                                        {'id': 'delivery_lnps_aavs_vlps',
                                         'title': 'In-Vivo Delivery Engineering: Ionizable Lipid '
                                                  'Nanoparticles (LNPs), AAVs & eVLPs',
                                         'summary': 'Onpattro/Casgevy clinical milestones, SORT '
                                                    'tissue-selective LNPs, engineered AAV capsids '
                                                    '(AAV-PHP.eB), and Banskota–Liu engineered Virus-Like '
                                                    'Particles (eVLPs).',
                                         'lab': True,
                                         'lessons': ['The #1 Bottleneck of Genetic Medicine: Delivering '
                                                     'Large Ribonucleoproteins (RNPs) or mRNA/pegRNA Cargoes '
                                                     'Safely to Target Tissues In Vivo',
                                                     'Four-Component Lipid Nanoparticles (LNPs): Ionizable '
                                                     'Cationic Lipids (pKa ~ 6.4 for Endosomal Escape), '
                                                     'Helper Phospholipids, Cholesterol, and PEG-Lipids',
                                                     "Siegwart's Selective Organ Targeting (SORT) LNPs and "
                                                     "Dahlman's DNA-Barcoded LNP Nanoparticle Screening In "
                                                     'Vivo',
                                                     'Adeno-Associated Virus (AAV) Vectors: Tropism '
                                                     'Engineering via Cre-Dependent Directed Evolution '
                                                     '(Gradinaru AAV-PHP.eB Blood-Brain Barrier Crossing) '
                                                     'and Dual-AAV Intein Splicing',
                                                     'Why Viral Persistent Expression of Cas9 Increases '
                                                     'Off-Target Edits and Anti-Cas9 T-Cell Immunogenicity '
                                                     'vs. Transient mRNA/RNP Delivery',
                                                     'Banskota et al. (2022) Engineered Virus-Like Particles '
                                                     "(eVLPs) and Zhang's SEND/Contractile Injection Systems "
                                                     '(Photorhabdus PVC) for DNA-Free Protein Delivery'],
                                         'sim': 'distribution_explorer'}]},
                           {'id': 'bio_430',
                            'code': 'BIO 430',
                            'title': 'Senior Seminar & Capstone Project: Design–Build–Test–Learn in Synthetic Biology',
                            'level': 400,
                            'credits': 4,
                            'description': 'Carry an original synthetic-biology project through the full Design–Build–Test–Learn cycle '
                                           '— from biosafety review and computational design to assembly planning, automated assays, '
                                           'data analysis and an iGEM-style presentation. Synthesizes circuits, genome engineering and '
                                           'pathway design from the full degree.',
                            'prerequisites': ['bio_330', 'bio_230'],
                            'modules': [{'id': 'project_scoping',
                                         'title': 'Project Scoping, Biosafety and Biosecurity',
                                         'summary': 'Choosing a meaningful problem and doing it responsibly.',
                                         'lessons': ['Learning from iGEM: Anatomy of a Successful Synthetic Biology Project',
                                                     'Defining Specifications and Measurable Success Criteria',
                                                     'Biosafety Levels, Risk Groups and Institutional Review',
                                                     'Dual-Use Research of Concern and DNA Synthesis Screening',
                                                     'Writing a Capstone Project Proposal']},
                                        {'id': 'computational_design',
                                         'title': 'Computational Design of Circuits and Pathways',
                                         'summary': 'Modeling before building to narrow the design space.',
                                         'lab': True,
                                         'lessons': ['Choosing Parts: Promoters, RBS Calculators and Part Registries',
                                                     'ODE Modeling of Your Circuit and Parameter Sensitivity',
                                                     'Retrobiosynthesis and Pathway Design Tools',
                                                     'Codon Optimization and Avoiding Repeats and Secondary Structure',
                                                     'Simulating Your Circuit Design with SciPy Before Building']},
                                        {'id': 'build_automation',
                                         'title': 'Build: Assembly Planning and Lab Automation',
                                         'summary': 'Getting designs into DNA efficiently and reproducibly.',
                                         'lab': True,
                                         'lessons': ['Golden Gate and Gibson Assembly Planning',
                                                     'SBOL Representations and Design Repositories',
                                                     'Liquid-Handling Robots and Protocol Scripting with Opentrons',
                                                     'Writing an Automated Assembly Protocol in Python']},
                                        {'id': 'test_assays',
                                         'title': 'Test: Assay Design and Data Analysis',
                                         'summary': 'Measuring performance rigorously and analysing noisy biological data.',
                                         'lab': True,
                                         'lessons': ['Plate-Reader Fluorescence Assays and Normalization to OD',
                                                     'Flow Cytometry Gating and Cell-to-Cell Variability',
                                                     'Calibration Units (MEFL) and Reproducibility Across Labs',
                                                     'Design of Experiments for Multi-Factor Optimization',
                                                     'Analyzing Plate-Reader Time Courses with pandas']},
                                        {'id': 'learn_present',
                                         'title': 'Learn: Iteration, Communication and Defense',
                                         'summary': 'Closing the loop and communicating results to scientists and the public.',
                                         'lessons': ['Fitting Models to Data and Redesigning the Next Iteration',
                                                     'Active Learning Across DBTL Cycles',
                                                     'Human Practices: Stakeholder Engagement and Societal Impact',
                                                     'Presenting Your Capstone in an iGEM-Style Jamboree Talk']}]},
                           {'id': 'bio_530',
                            'code': 'BIO 530',
                            'title': 'Metabolic Engineering, Flux Balance Analysis (FBA) & Cell-Free '
                                     'Biomanufacturing',
                            'level': 500,
                            'credits': 4,
                            'description': 'Genome-scale stoichiometric matrices (S*v = 0), Flux Balance '
                                           'Analysis LP/MILP (OptKnock), 13C metabolic flux isotopomer '
                                           'analysis, PKS/NRPS megasynthases, and cell-free TX-TL.',
                            'prerequisites': ['bio_130', 'bio_230', 'bio_430'],
                            'modules': [{'id': 'fba_stoichiometric_models',
                                         'title': 'Genome-Scale Metabolic Models (GEMs) & Flux Balance '
                                                  'Analysis (FBA)',
                                         'summary': 'Stoichiometric matrix S (m metabolites x n reactions), '
                                                    'steady-state mass balance S*v = 0, biomass objective '
                                                    'functions, Flux Variability Analysis, and COBRApy.',
                                         'lab': True,
                                         'lessons': ['Reconstructing Genome-Scale Metabolic Networks '
                                                     '(iML1515 E. coli / Recon3D Human) from Enzyme EC '
                                                     'Annotations and Transporter Databases',
                                                     'The Stoichiometric Matrix S: Steady-State Internal '
                                                     'Mass Balance S * v = 0 and Thermodynamic '
                                                     'Irreversibility Bounds v_min <= v <= v_max',
                                                     'Orth–Thiele–Palsson Flux Balance Analysis (FBA): '
                                                     'Formulating Growth or Product Maximization as a Convex '
                                                     'Linear Program (LP)',
                                                     'Shadow Prices (Dual Variables) and Reduced Costs: '
                                                     'Identifying Limiting Cofactors (NADPH / ATP) and '
                                                     'Bottleneck Pathways',
                                                     'Flux Variability Analysis (FVA) and Parsimonious FBA '
                                                     '(pFBA — Minimizing Total Enzyme Flux Manhattan Norm '
                                                     '||v||_1)',
                                                     'Enzyme-Constrained FBA (GECKO / sMOMENT): '
                                                     'Incorporating Proteome Allocation Limits sum (v_i / '
                                                     'k_cat,i) * MW_i <= E_total'],
                                         'sim': 'matrix_transform'},
                                        {'id': 'optknock_bilevel_strain_design',
                                         'title': 'Computational Strain Design: MOMA, OptKnock Bilevel MILP '
                                                  '& Dynamic FBA',
                                         'summary': 'Segrè Minimization of Metabolic Adjustment (MOMA), '
                                                    'Burgard–Maranas OptKnock bilevel mixed-integer linear '
                                                    'programming for growth-coupled production, and dynamic '
                                                    'FBA.',
                                         'lab': True,
                                         'lessons': ['Why Wild-Type Microbes Divert Carbon Toward Biomass '
                                                     'Rather Than Your Target Chemical: The '
                                                     'Growth-Production Tradeoff Envelope',
                                                     'Segrè, Vitkup & Church MOMA (Minimization of Metabolic '
                                                     'Adjustment): Quadratic Programming Projection of '
                                                     'Knockout Fluxes',
                                                     'Burgard, Pharkya & Maranas (2003) OptKnock: Bilevel '
                                                     'Mixed-Integer Linear Programming (MILP) Coupling '
                                                     'Chemical Production to Mandatory Cell Growth!',
                                                     'Karush–Kuhn–Tucker (KKT) / LP Strong-Duality '
                                                     'Reformulation of the Inner Biomass-Maximization '
                                                     'Problem into a Single-Level MILP',
                                                     'Elementary Flux Modes (EFMs) and Minimal Cut Sets '
                                                     '(Klamt) for Guaranteed Growth-Coupled Adaptive '
                                                     'Laboratory Evolution (ALE)',
                                                     'Dynamic Flux Balance Analysis (dFBA — Mahadevan) for '
                                                     'Fed-Batch Bioreactor Substrate Depletion and '
                                                     'Dissolved-Oxygen Transfer (k_L a) Scaling'],
                                         'sim': 'gradient_descent'},
                                        {'id': '13c_mfa_biosensors',
                                         'title': '13C Metabolic Flux Analysis (13C-MFA) & High-Throughput '
                                                  'Biosensor Screening',
                                         'summary': 'Antoniewicz Elementary Metabolite Units (EMUs), '
                                                    'GC-MS/LC-MS mass isotopomer distributions, and '
                                                    'transcription-factor/GPCR biosensors for droplet FACS.',
                                         'lab': True,
                                         'lessons': ['Why Stoichiometric FBA Alone Cannot Resolve Parallel '
                                                     'Pathways (Glycolysis vs. Pentose Phosphate vs. '
                                                     'Entner–Doudoroff) or Cyclic Fluxes',
                                                     '13C Isotope Labeling Experiments: Feeding [1-13C] or '
                                                     '[U-13C] Glucose and Measuring Amino Acid / Metabolite '
                                                     'Mass Isotopomer Distributions (M+0, M+1, M+2...)',
                                                     'Antoniewicz, Kelleher & Stephanopoulos Elementary '
                                                     'Metabolite Units (EMUs): Reducing Isotopomer Balance '
                                                     'Equations by >100x!',
                                                     'Nonlinear Least-Squares Flux Fitting and Chi-Squared '
                                                     'Goodness-of-Fit Confidence Intervals in INCA / '
                                                     '13CFLUX2',
                                                     'Overcoming the Analytical Throughput Bottleneck (1 '
                                                     'Sample/Min LC-MS vs. 10^7 Variants): Genetically '
                                                     'Encoded Allosteric TF and RNA Aptamer Biosensors',
                                                     'Fluorescence-Activated Droplet Sorting (FADS) and '
                                                     'Growth-Coupled Biosensor Selection for High-Titer '
                                                     'Producer Strains'],
                                         'sim': 'regression_fit'},
                                        {'id': 'natural_products_pks_terpenes',
                                         'title': 'Pathway Engineering: Artemisinin, Opioids, Tropane '
                                                  'Alkaloids & PKS/NRPS Assembly Lines',
                                         'summary': "Keasling's semi-synthetic artemisinin, Smolke's "
                                                    '23-enzyme yeast opioid/scopolamine synthesis, and '
                                                    'reprogramming Type I polyketide synthase modules.',
                                         'lab': True,
                                         'lessons': ['Ro, Paradise, Ouellet, Fisher, Newman, Ndungu, Ho, '
                                                     'Eachus, Ham, Kirby, Chang, Withers,iba, Keasling et '
                                                     'al. (2006): Producing Artemisinic Acid in Yeast via '
                                                     'Mevalonate Pathway Overexpression + CYP71AV1!',
                                                     'Balancing Redox Cofactors (NADH vs. NADPH) and '
                                                     'Preventing Toxic Intermediate (FPP /HMG-CoA) '
                                                     'Accumulation via Dynamic Stress-Responsive Promoters '
                                                     '(Dahl–Keasling)',
                                                     'Galanie, Thodey, Trenchard, Interrante & Smolke '
                                                     '(2015–2020): Engineering 20–30 '
                                                     'Plant/Mammalian/Bacterial Enzymes Across 6 Yeast '
                                                     'Subcellular Organelles for Thebaine and Hyoscyamine!',
                                                     'Subcellular Compartmentalization Engineering: '
                                                     'Targeting Enzymes to Peroxisomes, Mitochondria, and ER '
                                                     'Membranes',
                                                     'Assembly-Line Biosynthesis: Type I Modular Polyketide '
                                                     'Synthases (PKS — AT, KS, ACP, KR, DH, ER Domains) and '
                                                     'Non-Ribosomal Peptide Synthetases (NRPS)',
                                                     "Synthetic Carbon Fixation Cycles: Erb's CETCH Cycle "
                                                     '(Crotonyl-CoA Carboxylase/Reductase) Beating Natural '
                                                     'Rubisco Catalytic Efficiency and Eliminating '
                                                     'Photorespiration'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'cell_free_txtl_automation',
                                         'title': 'Cell-Free Transcription-Translation (TX-TL), Biofoundries '
                                                  '& Autonomous Cloud Labs',
                                         'summary': 'Jewett/Noireaux crude extract energy regeneration, '
                                                    'cell-free synthesis of cytotoxic proteins, acoustic '
                                                    'liquid handling (Echo), and self-driving DBTL '
                                                    'biofoundries.',
                                         'lab': True,
                                         'lessons': ['Decoupling Biomanufacturing from Cell Viability: '
                                                     "Crude-Extract (E. coli S30) vs. Shimizu's "
                                                     'Reconstituted PURE Cell-Free Transcription-Translation '
                                                     'Systems',
                                                     'ATP Energy Regeneration and Phosphate Homeostasis in '
                                                     'Cell-Free Systems (PANOx-SP, 3-PGA, and Maltodextrin '
                                                     'Hexokinase Cascades)',
                                                     'Cell-Free Prototyping of Genetic Circuits, Membrane '
                                                     'Proteins in Nanodiscs, and Cell-Free Glycoprotein '
                                                     'Conjugate Vaccines (Jewett)',
                                                     'Automated Design-Build-Test-Learn (DBTL) Biofoundries: '
                                                     'Acoustic Droplet Ejection (Beckman Echo Nanoliter '
                                                     'Transfers) and Opentrons/Hamilton Robotics',
                                                     'Statistical Design of Experiments (DoE: Fractional '
                                                     'Factorial, Box–Behnken, and D-Optimal Designs) for '
                                                     '10-Factor Media and Promoter Optimization',
                                                     'Self-Driving Biofoundries: Closing the Loop Between '
                                                     'Active-Learning Gaussian Processes and Robotic Liquid '
                                                     'Handlers (RAD / BioAutomata)'],
                                         'sim': 'agent_sim'}]}]},
              {'id': 'longevity_systems_bio',
               'name': 'Systems Biology & Cellular Longevity Biophysics',
               'icon': '⏳',
               'description': 'Gompertz mortality dynamics, Horvath epigenetic aging clocks, partial '
                              'Yamanaka reprogramming, senolytics, proteostasis/autophagy, mitochondrial '
                              'bioenergetics, and clinical biomarker trials.',
               'courses': [{'id': 'bio_140',
                            'code': 'BIO 140',
                            'title': 'Biophysics of Aging, Gompertz Mortality Laws & The Hallmarks of Aging',
                            'level': 100,
                            'credits': 4,
                            'description': 'Analyze aging from demographic hazard mathematics and '
                                           'evolutionary reliability theory to the molecular Hallmarks of '
                                           'Aging (López-Otín) and conserved nutrient-sensing pathways.',
                            'prerequisites': [],
                            'modules': [{'id': 'gompertz_mortality_reliability',
                                         'title': 'Demographic Mortality Mathematics: Gompertz–Makeham Law & '
                                                  'Reliability Theory',
                                         'summary': 'Survival functions S(t), hazard rates h(t) = R_0 * '
                                                    'e^{alpha*t}, Strehler–Mildvan correlations, Gavrilov '
                                                    "redundancy depletion, and Uri Alon's saturating-removal "
                                                    'ODE.',
                                         'lab': True,
                                         'lessons': ['Survival Function S(t), Probability Density f(t), and '
                                                     'Instantaneous Mortality Hazard Rate h(t) = -d/dt ln '
                                                     'S(t)',
                                                     'The Gompertz–Makeham Law of Mortality (1825): '
                                                     'Age-Independent Extrinsic Hazard A + Exponential '
                                                     'Intrinsic Doubling R_0 * e^{alpha * t} Every ~8 Years '
                                                     'in Humans',
                                                     'Comparative Biodemography (Jones et al.): Naked '
                                                     'Mole-Rats, Hydra, and Rockfish Violating Canonical '
                                                     'Gompertzian Senescence',
                                                     'Gavrilov & Gavrilova Reliability Theory of Aging: How '
                                                     'Parallel Redundant Non-Aging Components Produce '
                                                     'Emergent Weibull/Gompertz System Failure',
                                                     'Karin, Agrawal, Mor, Yahav & Alon (2019) '
                                                     'Saturating-Removal (SR) Stochastic Differential '
                                                     'Equation: Senescent/Damage Production Linear in Age + '
                                                     'Michaelis–Menten Clearance!',
                                                     'How the Alon SR Model Quantitatively Derives Gompertz '
                                                     'Mortality, Late-Life Deceleration Plateaus, and '
                                                     'Scaling of Disease Incidence Curves'],
                                         'sim': 'distribution_explorer'},
                                        {'id': 'evolutionary_theories_aging',
                                         'title': "Evolutionary Theories of Aging: Medawar's Shadow, "
                                                  'Antagonistic Pleiotropy & Disposable Soma',
                                         'summary': "Hamilton's declining force of natural selection with "
                                                    'age, Medawar mutation accumulation, Williams '
                                                    "antagonistic pleiotropy, and Kirkwood's disposable soma "
                                                    'tradeoff.',
                                         'lab': True,
                                         'lessons': ['Why Does Aging Exist If Evolution Optimizes Fitness? '
                                                     "Euler–Lotka Equation and Hamilton's Declining Force of "
                                                     'Natural Selection After Reproduction Onset',
                                                     "Medawar's (1952) Mutation Accumulation Hypothesis: "
                                                     'Late-Acting Deleterious Germline Alleles Drift to High '
                                                     'Frequency in the Selection Shadow',
                                                     "Williams's (1957) Antagonistic Pleiotropy: Alleles "
                                                     'Enhancing Early-Life Fertility Selected Despite '
                                                     'Causing Late-Life Pathology (mTOR / p53 / '
                                                     'Hyperfunction)',
                                                     "Kirkwood's (1977) Disposable Soma Theory: Optimal "
                                                     'Metabolic Resource Allocation Between Germ-Line '
                                                     'Reproduction and Somatic DNA/Protein Repair',
                                                     "Classic Experimental Evolution Validation: Rose's "
                                                     "Late-Reproducing Drosophila Lines and Austad's Insular "
                                                     'Opossum Predation Natural Experiment',
                                                     'Programmed vs. Quasi-Programmed (Blagosklonny '
                                                     'Hyperfunction) Debates and Why Evolution Left '
                                                     'Conserved Plastic Longevity Switches'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'genomic_instability_telomeres',
                                         'title': 'Primary Hallmarks I: Somatic Mutation Accumulation, DNA '
                                                  'Repair & Telomere Attrition',
                                         'summary': 'Cross-species somatic mutation rates (Cagan), '
                                                    'double-strand break epigenetic drift (Sinclair RCM), '
                                                    'Hayflick replicative limit, and shelterin/telomerase '
                                                    'kinetics.',
                                         'lab': True,
                                         'lessons': ['López-Otín et al. (2013, 2023) Twelve Hallmarks of '
                                                     'Aging: Primary Causes, Antagonistic Responses, and '
                                                     'Integrative Culprits',
                                                     'Cagan et al. (2022) Cross-Mammalian Somatic Mutation '
                                                     'Sequencing: Why Somatic Mutation Rate per Year Scales '
                                                     'Inversely with Species Lifespan!',
                                                     'Clonal Hematopoiesis of Indeterminate Potential (CHIP '
                                                     '— DNMT3A, TET2, ASXL1): Somatic Stem-Cell Darwinian '
                                                     'Selection Driving Cardiovascular Inflammation',
                                                     'DNA Repair Pathways (BER, NER, MMR, HR, NHEJ) and '
                                                     'SIRT6 / PARP1 NAD+-Dependent Double-Strand Break '
                                                     'Recruitment in Long-Lived Species (Gorbunova)',
                                                     "The End-Replication Problem, Hayflick's Replicative "
                                                     'Senescence Limit, and Shelterin (TRF1/TRF2/POT1) '
                                                     'T-Loop Protection',
                                                     'Telomerase Reverse Transcriptase (TERT) Dynamics, '
                                                     'Shortest-Telomere DDR Triggering (Blasco), and '
                                                     'Dyskeratosis vs. Cancer Tradeoffs'],
                                         'sim': 'radioactive_decay'},
                                        {'id': 'nutrient_sensing_mtor_iis',
                                         'title': 'Conserved Longevity Pathways: Insulin/IGF-1 (daf-2/FOXO), '
                                                  'mTORC1, AMPK & Sirtuins',
                                         'summary': 'Kenyon/Ruvkun C. elegans daf-2/daf-16 discoveries, '
                                                    'mTORC1 amino-acid/growth sensing, AMPK energy sensing, '
                                                    'NAD+/sirtuin metabolism, and caloric restriction.',
                                         'lab': True,
                                         'lessons': ['Friedman–Johnson (age-1) and Kenyon (daf-2) '
                                                     'Breakthrough: A Single Gene Mutation Doubles Lifespan '
                                                     'in C. elegans Totally Dependent on FOXO Transcription '
                                                     'Factor daf-16!',
                                                     'Evolutionary Conservation of the GH / IGF-1 / PI3K / '
                                                     'AKT / FOXO Axis from Worms and Flies to Snell/Ames '
                                                     'Dwarf Mice and Human Centenarian FOXO3A Variants',
                                                     'mTOR Complex 1 (mTORC1) vs. mTORC2 (Sabatini / Hall): '
                                                     'Rag GTPase Lysosomal Amino-Acid Sensing (Sestrin2 '
                                                     'Leucine, CASTOR1 Arginine) and Rheb Activation',
                                                     'How Rapamycin Allosterically Inhibits FKBP12-mTORC1 to '
                                                     'Extend Lifespan Even When Started in Late Middle Age '
                                                     '(NIA Interventions Testing Program — Harrison)',
                                                     'AMP-Activated Protein Kinase (AMPK): Sensing AMP/ATP '
                                                     'and Fructose-1,6-Bisphosphate Drops to Phosphorylate '
                                                     'ULK1 (Autophagy) and Inhibit Raptor',
                                                     'NAD+ Decline with Age (CD38 Ectonucleotidase '
                                                     'Consumption) and Sirtuin (SIRT1–SIRT7) Deacetylase '
                                                     'Regulation of PGC-1alpha Mitochondrial Biogenesis'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'inflammaging_intercellular',
                                         'title': 'Integrative Hallmarks: Stem Cell Exhaustion, ECM '
                                                  'Stiffening, Microbiome & Parabiosis',
                                         'summary': 'Hematopoietic/muscle stem cell niche aging, '
                                                    'non-enzymatic collagen AGE cross-linking, heterochronic '
                                                    'parabiosis/plasma exchange (Conboy/Wyss-Coray), and '
                                                    'inflammaging.',
                                         'lab': True,
                                         'lessons': ['Somatic Stem-Cell Aging: Quiescence-to-Senescence '
                                                     'Switches, Asymmetric Division Polarity Loss (Cdc42), '
                                                     'and Niche Fibrosis',
                                                     'Extracellular Matrix (ECM) Aging: Non-Enzymatic '
                                                     'Maillard Glycation Cross-Links (AGEs — Pentosidine, '
                                                     'Glucosepane), Elastin Fragmentation, and '
                                                     'Mechanotransduction (YAP/TAZ)',
                                                     "Franceschi's 'Inflammaging': Chronic Sterile "
                                                     'Activation of NF-kappaB, NLRP3 Inflammasomes, and '
                                                     'cGAS-STING Sensing of Cytoplasmic mtDNA / '
                                                     'Retrotransposons (LINE-1)',
                                                     'Thymic Involution, Naive-to-Exhausted T-Cell Skewing, '
                                                     'and Age-Related Decline in Immune Surveillance of '
                                                     'Senescent and Pre-Malignant Cells',
                                                     'Heterochronic Parabiosis and Neutral Blood Exchange '
                                                     '(Conboy / Villeda / Wyss-Coray): Dilution of Pro-Aging '
                                                     'Circulatory Factors (CCL11, beta2-Microglobulin, '
                                                     'TGF-beta) vs. Youthful Factors',
                                                     'Gut Microbiome Dysbiosis, Intestinal Barrier '
                                                     'Permeability, and Microbial Metabolite Signaling '
                                                     '(Urolithin A, Short-Chain Fatty Acids, '
                                                     'Indole-3-Propionic Acid)'],
                                         'sim': 'phase_portrait'}]},
                           {'id': 'bio_240',
                            'code': 'BIO 240',
                            'title': 'Epigenetic Aging Clocks, Multi-Omic Biomarkers & Causal Aging '
                                     'Deconvolution',
                            'level': 200,
                            'credits': 4,
                            'description': 'Illumina/sequencing CpG beta matrices, ElasticNet '
                                           'first/second/third-generation clocks (Horvath, PhenoAge, '
                                           'GrimAge, DunedinPACE), single-cell clocks, and plasma '
                                           'proteomics.',
                            'prerequisites': ['bio_140', 'bio_210'],
                            'modules': [{'id': 'dna_methylation_horvath_clocks',
                                         'title': 'CpG Methylation Dynamics & First-Generation Chronological '
                                                  'Clocks (Horvath & Hannum)',
                                         'summary': 'DNMT1/3A/3B and TET1-3 enzymatic methylation cycles, '
                                                    'global hypomethylation + PRC2 CpG island '
                                                    "hypermethylation, and Horvath's 353-CpG pan-tissue "
                                                    'ElasticNet clock.',
                                         'lab': True,
                                         'lessons': ['Biochemistry of 5-Methylcytosine (5mC) and '
                                                     '5-Hydroxymethylcytosine (5hmC): Maintenance '
                                                     '(DNMT1/UHRF1), De Novo (DNMT3A/3B), and Active TET '
                                                     'Oxidation',
                                                     'The Paradox of Aging Methylomes: Global '
                                                     'Lamina-Associated Heterochromatin Hypomethylation + '
                                                     'Focal Polycomb Repressive Complex 2 (PRC2) Target '
                                                     'Hypermethylation!',
                                                     'Measuring Methylation Beta Values beta = M / (M + U + '
                                                     '100) and Logit M-Values on Illumina EPICv2 Arrays and '
                                                     'Enzymatic Methyl-Seq (EM-Seq)',
                                                     'Horvath (2013) Pan-Tissue Epigenetic Clock: Penalized '
                                                     'ElasticNet Regression Across 8,000 Samples Selecting '
                                                     '353 CpGs with a Piecewise Log-Linear '
                                                     'Developmental/Adult Transformation',
                                                     'Hannum Blood Clock and Why Purely Chronological '
                                                     "Training Exhibits 'Collander' Paradox: Perfect "
                                                     'Chronological Prediction Would Imply Zero Sensitivity '
                                                     'to Biological Mortality Risk!',
                                                     'Mammalian Methylation Consortium (Lu & Horvath '
                                                     'Pan-Mammalian Clock): Conserved PRC2 CpGs Tracking '
                                                     'Relative Age Across 348 Mammalian Species'],
                                         'sim': 'regression_fit'},
                                        {'id': 'second_third_gen_mortality_clocks',
                                         'title': 'Second- & Third-Generation Mortality & Pace-of-Aging '
                                                  'Clocks (PhenoAge, GrimAge, DunedinPACE)',
                                         'summary': 'Training clocks on clinical mortality hazards rather '
                                                    'than calendar time (Levine PhenoAge, Lu GrimAge2), '
                                                    'longitudinal slope clocks (Belsky DunedinPACE), and PC '
                                                    'Clocks.',
                                         'lab': True,
                                         'lessons': ['Levine et al. (2018) DNAm PhenoAge: Two-Step Gompertz '
                                                     'Proportional-Hazards Modeling of 9 Clinical Blood '
                                                     'Chemistry Biomarkers + Chronological Age, Then '
                                                     'Regressed on CpGs',
                                                     'Lu & Horvath (2019) GrimAge & GrimAge2: Methylation '
                                                     'Surrogates for Plasma Proteins (GDF-15, Cystatin-C, '
                                                     'TIMP-1, PAI-1, CRP, A1C) + Smoking Pack-Years!',
                                                     'Belsky, Caspi & Moffitt DunedinPACE: Training Directly '
                                                     'on 20-Year Longitudinal Within-Individual Slopes of 19 '
                                                     'Organ-System Decline Biomarkers in a Birth Cohort',
                                                     'The Technical Noise Problem of Individual CpGs: '
                                                     'Test-Retest Variations of 1.5–4 Years on Technical '
                                                     'Replicates!',
                                                     'Higgins-Chen, Thrush & Levine Principal-Component '
                                                     'Clocks (PC-Clocks): Training ElasticNet on Top '
                                                     'Methylation Principal Components to Boost ICC '
                                                     'Reliability > 0.99',
                                                     'Deconvolving Intrinsic Epigenetic Age Acceleration '
                                                     '(IEAA) from Extrinsic Blood Immune-Cell Composition '
                                                     'Shifts (Houseman / EpiDish Deconvolution)'],
                                         'sim': 'regression_fit'},
                                        {'id': 'stochastic_causal_sc_clocks',
                                         'title': 'Stochastic Epigenetic Drift (scAge), Entropic Aging & '
                                                  'Causal Mendelian-Randomization Clocks',
                                         'summary': 'Shannon methylation entropy, Tarkhov/Meyer stochastic '
                                                    'drift clocks, Trapp–Gladyshev scAge single-cell clocks, '
                                                    'and Ying–Gladyshev DamAge/AdaptAge causal CpGs.',
                                         'lab': True,
                                         'lessons': ['Shannon Entropy of Methylation Fractions H = '
                                                     '-beta*log(beta) - (1-beta)*log(1-beta): Why the '
                                                     'Methylome Drifts Toward 50% Disorder with Age',
                                                     'Tarkhov, Lindstrom-Vautrin, Meyer & Gladyshev: How '
                                                     'Purely Stochastic Binomial Maintenance Errors '
                                                     'Reproduce Most Variance of First-Generation Clocks!',
                                                     'Trapp, Kerepesi & Gladyshev (2021) scAge: '
                                                     'Probabilistic Likelihood Estimation of Epigenetic Age '
                                                     'in Sparse Single-Cell Bisulfite Sequencing Data',
                                                     'Tracking Rejuvenation During Early Embryogenesis '
                                                     "(Gladyshev 'Ground Zero'): Epigenetic Age Drops from "
                                                     'Parental Age to Zero Around Gastrulation (E6.5–E7.5)!',
                                                     'Ying, Paulson, Eames, Tyshkovskiy, Li, Perez-Guevara, '
                                                     'Lu, Horvath, Peyer & Gladyshev (2024) Causal Clocks: '
                                                     'Epigenome-Wide Mendelian Randomization',
                                                     'Separating DamAge (CpG Changes That Causally '
                                                     'Accelerate Aging/Disease) from AdaptAge (Protective '
                                                     'Compensatory Epigenetic Responses!)'],
                                         'sim': 'bayes_belief'},
                                        {'id': 'proteomic_organ_specific_clocks',
                                         'title': 'Organ-Specific Plasma Proteomic Clocks (Oh/Wyss-Coray), '
                                                  'GlycanAge & Multimodal Digital Twins',
                                         'summary': 'SomaScan/Olink 5,000+ protein plasma profiling, '
                                                    'tissue-enriched protein origin mapping '
                                                    '(brain/heart/kidney/artery aging trajectories), IgG '
                                                    'glycosylation, and retinal/ECG clocks.',
                                         'lab': True,
                                         'lessons': ['Non-Linear Waves of Human Plasma Proteome Aging at '
                                                     'Ages ~34, 60, and 78 (Lehallier / Shen & Snyder '
                                                     'Multi-Omic Waves)',
                                                     'Oh, Rutledge, Nachun, Palovics, Abiose, Moran-Losada, '
                                                     'Channappa, Urey, Kim, Youssef, Wyss-Coray et al. '
                                                     '(2023): Organ-Specific Plasma Proteomic Aging Clocks!',
                                                     'Mapping Tissue-Specific Transcripts (GTEx >= 4x '
                                                     'Enriched) to Secreted Plasma Proteins: Why 1 in 5 '
                                                     'Adults Is an Accelerated Single-Organ Ager (e.g., '
                                                     'Brain or Vascular Ager)',
                                                     "Brain Proteomic Age Acceleration Predicts Alzheimer's "
                                                     'Progression and Cognitive Decline on Par with Plasma '
                                                     'pTau-181',
                                                     "Lauc's GlycanAge: Immunoglobulin G (IgG) Fc "
                                                     'N-Glycosylation Loss of Galactose and Sialic Acid '
                                                     'Driving Pro-Inflammatory Complement Activation',
                                                     'Multimodal Physiological Clocks: Retinal Fundus '
                                                     'Vascular Topology, Brain MRI Volumetric '
                                                     'Bag-of-Features, and Wearable HRV/Actigraphy '
                                                     'Resilience Recovery Rates'],
                                         'sim': 'nn_playground'},
                                        {'id': 'geroscience_clinical_trial_design',
                                         'title': 'Designing Clinical Geroscience Trials: TAME, Surrogate '
                                                  'Endpoints & Survival Statistics',
                                         'summary': 'Why FDA does not classify aging as an indication, '
                                                    "Barzilai's TAME multi-morbidity composite endpoint, Cox "
                                                    'proportional hazards, and surrogate biomarker '
                                                    'validation.',
                                         'lab': True,
                                         'lessons': ['The Regulatory Bottleneck of Longevity Medicine: Why a '
                                                     'Trial Measuring 30-Year All-Cause Mortality in Healthy '
                                                     '50-Year-Olds Costs Billions',
                                                     "Barzilai's TAME (Targeting Aging with Metformin) Trial "
                                                     'Design: Time to First Incidence of Any Major '
                                                     'Age-Related Chronic Disease Cluster (CVD, Cancer, '
                                                     'Dementia, Mortality)',
                                                     'Survival Analysis Engineering: Kaplan–Meier '
                                                     'Estimators, Log-Rank Tests, Cox Proportional Hazards, '
                                                     'and Accelerated Failure Time (AFT) Models',
                                                     "Prentice's Criteria for Validating a Surrogate "
                                                     'Endpoint: Proving Intervention-Induced Change in Clock '
                                                     'Delta-Age Mediates Clinical Hazard Reduction',
                                                     'Short-Term Organ-Indication Stepping Stones: Immune '
                                                     'Vaccine Response in the Elderly (Mannick mTOR Trials), '
                                                     'Osteoarthritis, Idiopathic Pulmonary Fibrosis, and '
                                                     'Frailty',
                                                     'Dog Aging Project (Kaeberlein / Promislow TRIAD '
                                                     'Rapamycin Trial) and Marmoset Translational Bridges'],
                                         'sim': 'distribution_explorer'}]},
                           {'id': 'bio_340',
                            'code': 'BIO 340',
                            'title': 'Cellular Reprogramming (OSKM), Senolytics, Proteostasis & '
                                     'Mitochondrial Engineering',
                            'level': 300,
                            'credits': 4,
                            'description': 'Yamanaka factors (Oct4, Sox2, Klf4, c-Myc), Ocampo partial '
                                           'reprogramming without identity loss, BCL-2/CAR-T senolytics, '
                                           'chaperone/autophagy proteostasis, and mitophagy.',
                            'prerequisites': ['bio_140', 'bio_240'],
                            'modules': [{'id': 'partial_epigenetic_reprogramming',
                                         'title': 'Partial Epigenetic Reprogramming: Yamanaka OSKM, Identity '
                                                  'Preservation & Teratoma Avoidance',
                                         'summary': 'Waddington landscape trajectories during iPSC '
                                                    'reprogramming, separating the rejuvenation phase from '
                                                    'the pluripotency dedifferentiation cliff, and OSK optic '
                                                    'nerve restoration.',
                                         'lab': True,
                                         'lessons': ['Takahashi & Yamanaka (2006) Induced Pluripotent Stem '
                                                     'Cells (iPSCs): Oct4, Sox2, Klf4, and c-Myc Erase Both '
                                                     'Somatic Cell Identity AND Epigenetic Age to Zero!',
                                                     'Why Continuous In-Vivo OSKM Expression Is Lethal (Abad '
                                                     '2013): Loss of Somatic Organ Identity, '
                                                     'Liver/Intestinal Failure, and Teratoma Formation',
                                                     'Ocampo, Reddy, Martinez-Redondo, Platero-Luengo, '
                                                     'Hatanaka, Hishida, Li, Lam, Kurita, Beyret, Araoka, '
                                                     'Vazquez-Ferrer, Donoso, Roman, Xu, Rodriguez, Nuñez, '
                                                     'Delicado, Lajara, Guillen & Izpisua Belmonte (2016): '
                                                     'Cyclic Short-Pulse (2 Days On / 5 Days Off) OSKM '
                                                     'Extends Progeroid Mouse Lifespan Without Teratomas!',
                                                     'Gill, Parry, Santos, Okkenhaug, Todd, Stubbs, '
                                                     'Bellantuono, Reik et al. (2022) Maturation Phase '
                                                     'Transient Reprogramming (MPTR): Rejuvenating '
                                                     'Fibroblasts by ~30 Epigenetic Years Before Identity '
                                                     'Point-of-No-Return',
                                                     'Lu, Brommer, Tian, Krishnan, Meer, Wang, Vera, Zeng, '
                                                     'Zou, Haviva, Ksander,elace, He, Horvath, '
                                                     'Hochedlinger,obell & Sinclair (2020): AAV2-OSK '
                                                     '(Omitting Oncogenic c-Myc!) Restores Youthful DNA '
                                                     'Methylation and Regenerates Crushed Optic Nerve Axons!',
                                                     'Alternative Transcription Factor Cocktails (Sox2+Klf4, '
                                                     'Multiprotein Screens) and Small-Molecule Chemical '
                                                     'Reprogramming'],
                                         'sim': 'phase_portrait'},
                                        {'id': 'cellular_senescence_senolytics',
                                         'title': 'Cellular Senescence (p16/p21, SASP) & Small-Molecule / '
                                                  'Immune Senolytics',
                                         'summary': 'DNA damage -> p53/p21 & p16^{INK4a}/Rb cell-cycle '
                                                    'arrest, Senescence-Associated Secretory Phenotype '
                                                    '(Campisi), SCAP anti-apoptotic dependencies, and uPAR '
                                                    'CAR-T senolytics.',
                                         'lab': True,
                                         'lessons': ['Triggers of Cellular Senescence: Telomere Uncapping, '
                                                     'Oncogene Activation (OIS), Oxidative Stress, and '
                                                     'Persistent DDR Foci',
                                                     'The Two Effector Arms: p53 -> p21^{CIP1} and '
                                                     'p16^{INK4a} -> CDK4/6 Inhibition -> Hypophosphorylated '
                                                     'Rb Permanent Cell-Cycle Arrest',
                                                     "Judith Campisi's Senescence-Associated Secretory "
                                                     'Phenotype (SASP): IL-6, IL-8, MMPs, PAI-1, and '
                                                     'TGF-beta Paracrine Bystander Senescence Spreading',
                                                     'Baker, Wijshake, Tchkonia, LeBrasseur, Childs, van de '
                                                     'Sluis, Kirkland & van Deursen (2011–2016) INK-ATTAC '
                                                     'Proof-of-Concept: Clearing p16+ Cells Extends Median '
                                                     'Mouse Lifespan!',
                                                     "Kirkland's Senescent Cell Anti-Apoptotic Pathways "
                                                     '(SCAPs): Dasatinib + Quercetin (D+Q), Fisetin, and '
                                                     'Navitoclax / UBX1325 BCL-2/BCL-xL BH3-Mimetics',
                                                     'Next-Generation Precision Senolytics: '
                                                     'Galacto-Conjugated Prodrugs (Cleaved by '
                                                     'Senescence-Associated beta-Galactosidase), FOXO4-DRI '
                                                     'Peptides, and Amor–Lowe uPAR-Targeted CAR-T Cells!'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'proteostasis_chaperones_autophagy',
                                         'title': 'Proteostasis Collapse, Chaperone Networks, Ribosome '
                                                  'Pausing & Autophagy',
                                         'summary': 'Heat-shock factor HSF1, Stein–Morimoto age-related '
                                                    'ribosome pausing and nascent cotranslational '
                                                    'aggregation, proteasome activation, and '
                                                    'macroautophagy/CMA.',
                                         'lab': True,
                                         'lessons': ['The Proteostasis Network: 70/90 kDa Heat-Shock '
                                                     'Chaperones (HSP70/HSP90), TRiC/CCT Chaperonins, the '
                                                     'Ubiquitin-Proteasome System (UPS), and Autophagy',
                                                     'Ben-Zvi & Morimoto: Why Proteostasis Collapses '
                                                     'Precipitously Right at Reproductive Maturity in C. '
                                                     'elegans via Germline-to-Soma HSF-1 Repression',
                                                     'Stein, Yim,ritchett & Frydman (2022): Age-Related '
                                                     'Ribosome Pausing at Polybasic/Proline Stretch Motifs '
                                                     'Overwhelms Co-Translational Folding and Drives '
                                                     'Aggregation!',
                                                     '26S Proteasome Disassembly and 20S Gate-Opening '
                                                     'Activators; PROTACs and LYTACs / ATTECs for Clearing '
                                                     'Extracellular and Aggregate Proteins',
                                                     "Ohsumi's Macroautophagy Machinery: ULK1 Initiation, "
                                                     'Beclin-1/VPS34 PI3P Nucleation, ATG8/LC3-II '
                                                     'Lipidation, and Rubicon Age-Related Autophagy Braking',
                                                     "Cuervo's Chaperone-Mediated Autophagy (CMA): HSC70 "
                                                     'Recognition of KFERQ-Like Motifs and Restoring '
                                                     'Declining Lysosomal LAMP2A Receptor Levels in Aged '
                                                     'Livers/Brains'],
                                         'sim': 'reaction_kinetics'},
                                        {'id': 'mitochondrial_bioenergetics_mitophagy',
                                         'title': 'Mitochondrial Bioenergetics, mtDNA Heteroplasmy, '
                                                  'Mitophagy & Allotopic Expression',
                                         'summary': 'Chemiosmotic proton-motive force, Reverse Electron '
                                                    'Transport (RET) ROS vs. mitohormesis, clonal expansion '
                                                    'of mtDNA deletions, PINK1-Parkin mitophagy, and '
                                                    'allotopic nuclear relocation.',
                                         'lab': True,
                                         'lessons': ["Mitchell's Chemiosmotic Theory: Electron Transport "
                                                     'Chain Complexes I–IV, Proton-Motive Force Delta p, and '
                                                     'ATP Synthase Rotary Catalysis',
                                                     'Disproving Naive Harman Free-Radical Theory: Why '
                                                     "Antioxidant Megadoses Fail While Ristow's Mitohormesis "
                                                     '(Transient ROS Signaling via SKN-1/NRF2) Extends '
                                                     'Lifespan!',
                                                     'Mitochondrial DNA (16.5 kb Circular Genome, 13 OXPHOS '
                                                     'Proteins): Clonal Expansion of Large Common Deletions '
                                                     'in Post-Mitotic Muscle Fibers and Substantia Nigra '
                                                     'Neurons',
                                                     "Youle's PINK1-Parkin Quality Control: Depolarized "
                                                     'Mitochondria Fail to Import PINK1 -> Parkin E3 '
                                                     'Ubiquitin Ligase Recruitment -> Autophagosome '
                                                     'Engulfment (Urolithin A Activation)',
                                                     'Mitochondrial Base Editing (Mok–Liu DdCBE '
                                                     'Double-Stranded DNA Deaminase Toxin Split-Halves) for '
                                                     'Correcting Pathogenic mtDNA Point Mutations (where '
                                                     'CRISPR gRNAs Cannot Enter!)',
                                                     'Allotopic Expression (Oca-Cossio / Boore / Grey): '
                                                     'Recoding Hydrophobic Mitochondrial Genes (ND4 / ATP8) '
                                                     'with Mitochondrial Targeting Sequences to Express Them '
                                                     'Safely from the Nucleus!'],
                                         'sim': 'equilibrium'},
                                        {'id': 'extracellular_vascular_glymphatic',
                                         'title': 'Tissue-Level Rejuvenation: Crosslink Breakers, Thymic '
                                                  'Regeneration & Glymphatic Clearance',
                                         'summary': 'Glucosepane crosslink-cleaving enzymes, Fahy/Blackburn '
                                                    'FOXN1/GH thymic regeneration, Nedergaard/Kipnis '
                                                    'meningeal lymphatic and sleep glymphatic amyloid '
                                                    'clearance.',
                                         'lab': True,
                                         'lessons': ['Why Intracellular Rejuvenation Alone Cannot Fix '
                                                     'Stiffened Arteries: 50-Year Half-Life of Cross-Linked '
                                                     'Arterial Elastin and Collagen I',
                                                     'Breaking Advanced Glycation End-Product (AGE) '
                                                     'Crosslinks: Why Alagebrium (ALT-711) Thiazolium Failed '
                                                     'in Humans (Alpha-Dicarbonyls vs. Non-Cleavable '
                                                     'Glucosepane!)',
                                                     "Spiegel's Total Chemical Synthesis of Glucosepane and "
                                                     'Discovering Soil-Bacteria Enzymes Engineered to Cleave '
                                                     'Human Glucosepane Crosslinks',
                                                     'Reversing Thymic Involution: FOXN1 Transcription '
                                                     'Factor Reactivation (Bredenkamp), KGF/IL-22, and '
                                                     'Fahy–Horvath TRIIM Clinical Trial',
                                                     "Nedergaard's Glymphatic System (AQP4 Astrocytic Water "
                                                     "Channels) and Kipnis's Meningeal Lymphatics: Why Deep "
                                                     'Slow-Wave Sleep Doubles Interstitial Beta-Amyloid/Tau '
                                                     'Clearance',
                                                     'Microglial Senescence, APOE4 Lipid Droplet '
                                                     'Accumulation (Tsai / Wyss-Coray), and Restoring '
                                                     'Phagocytic Myelin Debris Clearance'],
                                         'sim': 'phase_portrait'}]},
                           {'id': 'bio_440',
                            'code': 'BIO 440',
                            'title': 'Quantitative Aging Biology: Survival Analysis, Intervention Testing & Biofabrication Foundations',
                            'level': 400,
                            'credits': 4,
                            'description': 'Design and analyse lifespan intervention studies with survival statistics, build dynamical '
                                           'models of damage accumulation, and learn the organoid, biofabrication and cryopreservation '
                                           'fundamentals behind replacement tissues. Bridges rejuvenation biology to graduate-level '
                                           'whole-cell modeling and tissue engineering.',
                            'prerequisites': ['bio_340', 'bio_240'],
                            'modules': [{'id': 'survival_analysis',
                                         'title': 'Survival Analysis for Aging Research',
                                         'summary': 'The statistical backbone of every lifespan study.',
                                         'lab': True,
                                         'lessons': ['Censoring, Survival Functions and the Kaplan–Meier Estimator',
                                                     'Log-Rank Tests and Comparing Survival Curves',
                                                     'Cox Proportional Hazards Models and Covariates',
                                                     'Fitting Gompertz and Weibull Parametric Survival Models',
                                                     'Analyzing Mouse Lifespan Data with lifelines in Python']},
                                        {'id': 'intervention_testing',
                                         'title': 'Designing Lifespan Intervention Studies',
                                         'summary': 'How to test whether a drug or genetic change truly slows aging.',
                                         'lab': True,
                                         'lessons': ['The NIA Interventions Testing Program: Rapamycin, Acarbose and Beyond',
                                                     'Model Organisms: Yeast, Worms, Flies, Killifish and Mice',
                                                     'Power Analysis and Sample Sizes for Lifespan Studies',
                                                     'Healthspan Metrics, Frailty Indices and Surrogate Endpoints',
                                                     'Running a Power Simulation for a Mouse Lifespan Trial']},
                                        {'id': 'damage_models',
                                         'title': 'Dynamical Models of Damage and Senescence',
                                         'summary': 'Mathematical theories that link molecular damage to mortality curves.',
                                         'lab': True,
                                         'lessons': ['Reliability Theory of Aging and Redundancy',
                                                     'Stochastic Damage Accumulation and Saturating-Removal Models',
                                                     'Senescent-Cell Population Dynamics (Karin–Alon Model)',
                                                     'Simulating Senescent-Cell Kinetics and Senolytic Dosing']},
                                        {'id': 'organoids_biofabrication',
                                         'title': 'Organoids and Biofabrication Foundations',
                                         'summary': 'Growing and printing tissues as a route to replacement organs.',
                                         'lessons': ['Stem-Cell Niches and Self-Organization in Organoids',
                                                     'Scaffolds, Hydrogels and Extracellular Matrix Mimics',
                                                     '3D Bioprinting Modalities and Bio-inks',
                                                     'Vascularization: The Central Bottleneck in Thick Tissues']},
                                        {'id': 'cryopreservation_basics',
                                         'title': 'Biopreservation Fundamentals',
                                         'summary': 'The physics of freezing living matter and why organs are so hard to bank.',
                                         'lab': True,
                                         'lessons': ["Ice Nucleation, Osmotic Injury and Mazur's Two-Factor Hypothesis",
                                                     'Cryoprotectant Agents and Toxicity Trade-offs',
                                                     'Vitrification and Critical Cooling and Warming Rates',
                                                     'Modeling Cell Volume Changes During Cryoprotectant Loading']}]},
                           {'id': 'bio_540',
                            'code': 'BIO 540',
                            'title': 'Whole-Cell Dynamical Modeling, Cryobiology & Replacement Tissue '
                                     'Bioengineering',
                            'level': 500,
                            'credits': 4,
                            'description': 'Covert whole-cell E. coli/Mycoplasma simulation, '
                                           'ordinary/partial differential equation pharmacological PK/PD, '
                                           'cryoprotectant vitrification & nanowarming, and 3D vascularized '
                                           'organ bioprinting.',
                            'prerequisites': ['bio_330', 'bio_340', 'bio_440'],
                            'modules': [{'id': 'whole_cell_multi_algorithmic',
                                         'title': 'Whole-Cell Computational Models (Karr–Covert): '
                                                  'Integrating 28 Subcellular Modules',
                                         'summary': 'Coupling ODEs, stochastic Gillespie, FBA, and Poisson '
                                                    'processes at 1-second timesteps to simulate every gene, '
                                                    'transcript, and molecule of a dividing cell.',
                                         'lab': True,
                                         'lessons': ['The Challenge of Multi-Scale Coupling: Metabolism Runs '
                                                     'at Milliseconds (FBA), Transcription Is Stochastic at '
                                                     'Low Copy (Gillespie), and DNA Replication Is Discrete!',
                                                     'Karr, Sanghvi, Macklin, Gutschow, Jacobs, Bolival, '
                                                     'Assad-Garcia, Glass & Covert (2012) Whole-Cell Model '
                                                     'of Mycoplasma genitalium: 28 Mathematically Distinct '
                                                     'Submodels',
                                                     'Shared Cell-State Variables: Assuming Submodels Are '
                                                     'Approximately Independent Over Short 1-Second Δt '
                                                     'Timesteps, Then Synchronizing Metabolite/ATP Pools',
                                                     'Macklin, Ruggero, Covert et al. (2020) Whole-Cell E. '
                                                     'coli Model: Resolving Multi-Fork Chromosome '
                                                     'Replication (Cooper–Helmstetter) and Ribosome-RNAP '
                                                     'Coupling',
                                                     'Luthey-Schulten 4D Spatial-Stochastic Whole-Cell '
                                                     'Models (Lattice Microbes) Incorporating Cryo-ET '
                                                     'Ribosome and Membrane Geometries',
                                                     'Predicting Emergent Phenotypes: Synthetic Lethality '
                                                     'Pairs, Antibiotic Mechanisms, and Growth-Rate Variance '
                                                     'Directly from Genotype'],
                                         'sim': 'state_machine'},
                                        {'id': 'qsp_pkpd_systems_pharmacology',
                                         'title': 'Quantitative Systems Pharmacology (QSP), PBPK & '
                                                  'Combination Longevity Modeling',
                                         'summary': 'Multi-compartment physiologically based '
                                                    'pharmacokinetics (PBPK), target-mediated drug '
                                                    'disposition (TMDD), Loewe/Bliss synergy, and optimal '
                                                    'pulsing schedules.',
                                         'lab': True,
                                         'lessons': ['Physiologically Based Pharmacokinetic (PBPK) ODEs: '
                                                     'Blood Flow Rates Q_i, Tissue Partition Coefficients '
                                                     'K_p, Hepatic CYP Clearance, and Renal GFR',
                                                     'Target-Mediated Drug Disposition (TMDD — Mager & '
                                                     'Jusko) for High-Affinity Biologics and Antibody-Drug '
                                                     'Conjugates: Receptor Saturation Nonlinearity',
                                                     'Indirect Response Pharmacodynamic (PD) Models (Jusko '
                                                     'Dayneka Types I–IV): Stimulating vs. Inhibiting '
                                                     'Biomarker Synthesis k_in or Degradation k_out',
                                                     'Synergy vs. Antagonism in Multi-Drug Longevity '
                                                     'Combinations (Rapamycin + Acarbose + Senolytics): '
                                                     'Loewe Additivity, Bliss Independence, and Chou–Talalay '
                                                     'Combination Index',
                                                     'Optimal Control of Intermittent Dosing: Why Weekly '
                                                     'Pulsed Rapamycin Preserves mTORC1 Inhibition While '
                                                     'Avoiding mTORC2 Rebound Insulin Resistance!',
                                                     'Virtual Patient Populations: Sampling Parameter '
                                                     'Covariates to Predict Phase II/III Responder Subgroups '
                                                     'and Dose-Limiting Toxicities'],
                                         'sim': 'pid_controller'},
                                        {'id': 'vascularized_organ_bioprinting',
                                         'title': 'Stem-Cell Organoids, Decellularized Scaffolds & 3D '
                                                  'Vascularized Organ Bioprinting',
                                         'summary': "Krogh's 200-um oxygen diffusion limit, sacrificial "
                                                    'SWIFT/SLATE vascular networks (Lewis/Miller), iPSC '
                                                    'differentiation protocols, and universal hypoimmune '
                                                    '(B2M/CIITA KO) cells.',
                                         'lab': True,
                                         'lessons': ["Krogh's Cylinder Oxygen Diffusion Limit (~150–200 "
                                                     'Micrometers): Why Thick Engineered Tissues Necrose '
                                                     'Without Perfusable Microvasculature',
                                                     'Directed Differentiation of Human iPSCs Along '
                                                     'Developmental WNT/BMP/Activin Morphogen Gradients into '
                                                     'Hepatocytes, Cardiomyocytes, Dopaminergic Neurons, and '
                                                     'Beta-Islets',
                                                     'Whole-Organ Perfusion Decellularization (Ott / Taylor) '
                                                     'vs. 3D Extrusion/Light Bioprinting',
                                                     'Skylar-Scott, Uzel & Lewis SWIFT (Sacrificial Writing '
                                                     'into Functional Tissue): Printing Gelatin Vascular '
                                                     'Channels Inside Dense Organoid Matrices at '
                                                     'Physiological Cell Density!',
                                                     'Grigoryan & Miller SLATE Stereolithography: Using '
                                                     'Food-Dye Photoabsorbers to Print Entangled Alveolar '
                                                     'Air Sacs and Perfusable Vascular Networks in Hydrogels',
                                                     "Universal 'Stealth' Hypoimmune Allogeneic Cells "
                                                     '(Schrepfer): Knocking Out MHC Class I (B2M) and Class '
                                                     "II (CIITA) + Overexpressing CD47 ('Don't Eat Me' "
                                                     'Signal against NK Cells!)'],
                                         'sim': 'wave_superposition'},
                                        {'id': 'cryobiology_vitrification_nanowarming',
                                         'title': 'Cryobiology & Organ Preservation: Ice Nucleation, '
                                                  'Vitrification & Nanowarming',
                                         'summary': "Mazur's two-factor freezing injury hypothesis, glass "
                                                    'transition vitrification (Fahy M22), devitrification '
                                                    'during convective warming, and Bischof radiofrequency '
                                                    'nanowarming.',
                                         'lab': True,
                                         'lessons': ['Why Donated Hearts and Livers Expire in 4–6 Hours on '
                                                     'Ice: Ischemia-Reperfusion Succinate Accumulation '
                                                     '(Chouchani) and Mitochondrial ROS Burst',
                                                     "Mazur's Two-Factor Hypothesis of Freezing Injury: "
                                                     'Slow-Cooling Solute/Osmotic Dehydration Shrinkage vs. '
                                                     'Fast-Cooling Lethal Intracellular Ice Crystallization',
                                                     'Vitrification (Fahy & Wowk): Loading High-Molarity '
                                                     'Cryoprotectant Cocktails (M22 / VMP) to Bypass the '
                                                     'Freezing Point and Solidify Directly into an Amorphous '
                                                     'Glass at T_g (~ -125 C)!',
                                                     'The Dual Obstacles to Whole-Organ Vitrification: '
                                                     'Cryoprotectant Toxicity During Loading (Normalized by '
                                                     "Fahy's qv* Water-Hydrogen-Bonding Metric) and "
                                                     'Cracking/Devitrification During Warming',
                                                     'Why External Convective Water-Bath Warming Fails on '
                                                     'Large Organs: Thermal Conduction Lag Causes Fatal Ice '
                                                     'Recrystallization (Devitrification) + Thermal Stress '
                                                     'Cracking',
                                                     'Manuchehrabadi, Gao, Zhang, Ring, Shao, Liu, '
                                                     'McDermott, Fok, Rabin, Brockbank, Garwood & Bischof '
                                                     '(2017–2023) Radiofrequency Nanowarming: Iron-Oxide '
                                                     'Nanoparticles Perfused Through Vasculature Achieve '
                                                     'Uniform >100 C/min Inductive Warming of Functional Rat '
                                                     'Kidneys!'],
                                         'sim': 'blackbody'}]}]}]}
