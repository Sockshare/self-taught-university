"""Cross-faculty prerequisite overlay.

The 13 newer faculties were authored as self-contained islands: their entry courses
required nothing, so e.g. a "B.S. in Quantum Computing" never pulled in Linear Algebra.
This overlay adds the missing foundation links WITHOUT hand-editing the large faculty files.

Applied by curriculum.reload() after indexing. A link is only added if the target
course exists, so links to optional faculties (computer_science, biology, economics,
statistics, writing) switch on automatically once those faculties are present.

Rule of thumb: entry (100) courses get 100-level foundations so they stay in Year 1;
heavier foundations (Linear Algebra, ODEs, Probability, QM) attach to 200-level courses.
Languages intentionally get none: beginning a language needs no prior coursework.
"""

EXTRA_PREREQUISITES: dict[str, list[str]] = {
    # ---------------------------------------------------------------- Aerospace
    "aero_110": ["math_calc_2", "phys_mech_101"],
    "aero_120": ["math_calc_1", "phys_mech_101", "phys_thermo_101"],
    "aero_130": ["math_calc_2", "phys_mech_101"],
    "aero_140": ["math_calc_2", "phys_mech_101"],
    "aero_210": ["phys_thermo_201", "math_calc_3"],
    "aero_220": ["chem_gen_102", "phys_thermo_201"],
    "aero_230": ["math_diff_eq_1"],
    "aero_240": ["math_linear_algebra_1", "math_prob_1"],
    # ---------------------------------------------------------------- Complex Systems
    "cx_dyn_101": ["math_calc_2"],
    "cx_net_101": ["math_discrete_1", "cs_101"],
    "cx_abm_101": ["math_discrete_1", "cs_101"],
    "cx_stat_101": ["math_calc_2", "stat_101"],
    "cx_dyn_201": ["math_diff_eq_1", "math_linear_algebra_1"],
    "cx_net_201": ["math_prob_1", "math_linear_algebra_1"],
    "cx_stat_201": ["phys_thermo_101", "math_prob_1"],
    # ---------------------------------------------------------------- Cybersecurity
    "sec_110": ["math_discrete_1", "cs_101"],
    "sec_120": ["cs_101"],
    "sec_130": ["cs_101"],
    "sec_140": ["wrt_101"],
    "sec_220": ["sys_arch_101"],
    # ---------------------------------------------------------------- Game Theory & Quant Finance
    "gt_110": ["math_calc_1", "econ_101"],
    "gt_120": ["math_discrete_1"],
    "gt_130": ["math_calc_2", "stat_101"],
    "gt_140": ["stat_101", "econ_101"],
    "gt_210": ["math_prob_1"],
    "gt_220": ["math_prob_1"],
    "gt_230": ["math_prob_1", "math_diff_eq_1"],
    "gt_240": ["math_prob_1"],
    # ---------------------------------------------------------------- Geopolitics
    "geo_strat_101": ["wrt_101"],
    "geo_econ_101": ["econ_101"],
    "geo_intel_101": ["wrt_101"],
    "geo_war_101": ["stat_101"],
    "geo_war_201": ["gt_110"],
    # ---------------------------------------------------------------- Jurisprudence
    "jur_phil_101": ["phil_logic_101"],
    "jur_const_101": ["phil_pol_150"],
    "jur_priv_101": ["econ_101"],
    "jur_rhet_101": ["wrt_101"],
    # ---------------------------------------------------------------- Materials
    "mat_crys_101": ["chem_gen_101", "math_calc_1"],
    "mat_nano_101": ["chem_gen_101", "phys_modern_101"],
    "mat_crys_201": ["chem_gen_102", "phys_thermo_101", "math_calc_2"],
    "mat_semi_201": ["phys_em_101", "phys_qm_201"],
    "mat_nano_201": ["phys_qm_201"],
    "mat_ener_201": ["chem_gen_102"],
    # ---------------------------------------------------------------- Neuroscience
    "neuro_110": ["phys_em_101", "math_calc_1", "biol_101"],
    "neuro_120": ["math_calc_1", "stat_101", "cs_101"],
    "neuro_130": ["math_calc_2", "cs_101"],
    "neuro_140": ["biol_101"],
    "neuro_210": ["math_diff_eq_1"],
    "neuro_220": ["math_prob_1"],
    "neuro_230": ["math_linear_algebra_1", "math_prob_1"],
    "neuro_240": ["ai_dl_201"],
    # ---------------------------------------------------------------- Quantum Computing
    # QC genuinely needs Linear Algebra + the quantum revolution first, so QC courses begin in Year 2.
    "qc_110": ["math_linear_algebra_1", "phys_modern_101", "cs_101"],
    "qc_140": ["phys_em_101"],
    "qc_210": ["phys_qm_201"],
    "qc_220": ["math_prob_1"],
    # ---------------------------------------------------------------- RF / SDR
    "rf_dsp_101": ["math_calc_2", "cs_101"],
    "rf_em_101": ["phys_em_101", "math_calc_2"],
    "rf_dsp_201": ["math_linear_algebra_1"],
    "rf_em_201": ["phys_em_201"],
    "rf_mod_201": ["math_prob_1"],
    # ---------------------------------------------------------------- Synthetic Biology
    "bio_110": ["biol_101", "cs_101"],
    "bio_120": ["biol_101", "chem_gen_101", "phys_mech_101"],
    "bio_130": ["biol_101", "math_calc_1"],
    "bio_140": ["biol_101", "stat_101"],
    "bio_220": ["math_prob_1", "ai_dl_201"],
    "bio_230": ["chem_org_201"],
    "bio_240": ["math_prob_1"],
    # ---------------------------------------------------------------- Systems Engineering
    "sys_arch_101": ["math_discrete_1", "cs_101"],
    "sys_comp_201": ["math_discrete_1"],
    "sys_gpu_201": ["math_linear_algebra_1"],
}


def apply(courses: dict[str, dict]) -> list[str]:
    """Add overlay prerequisites in place; returns a list of skipped (missing) links for diagnostics."""
    skipped: list[str] = []
    for cid, extra in EXTRA_PREREQUISITES.items():
        c = courses.get(cid)
        if not c:
            skipped.append(f"{cid} (course missing)")
            continue
        pre = c.setdefault("prerequisites", [])
        for p in extra:
            if p == cid or p in pre:
                continue
            if p in courses:
                pre.append(p)
            else:
                skipped.append(f"{cid} -> {p}")
    return skipped
