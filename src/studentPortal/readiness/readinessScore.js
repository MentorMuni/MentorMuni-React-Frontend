/**
 * One readiness number, one formula.
 *
 * The org portal currently invents student readiness
 * (`Math.floor(40 + Math.random() * 20)` in organizationPortal/store.js), so a
 * TPO and a student can look at the same person and see unrelated numbers.
 * This module is the single definition; the server implements it identically
 * and `student_readiness_snapshots` is what both portals read.
 *
 * Three deliberate choices:
 *
 *  - Pillars with no attempts are EXCLUDED from the denominator, never scored
 *    zero. A day-1 student is "68%, 2 of 6 pillars measured", not "11%".
 *  - Weights depend on the target tier. Aptitude and communication decide the
 *    mass-recruiter funnel; weighting DSA above them is a product-company bias
 *    that would mis-advise most of our students.
 *  - Execution can move the score by at most ±10%, so daily work visibly
 *    matters without letting anyone grind their way to a number they can't back.
 */

export const PILLARS = ['aptitude', 'coding', 'technical', 'communication', 'hr', 'resume'];

export const PILLAR_LABELS = {
  aptitude: 'Aptitude',
  coding: 'Coding',
  technical: 'Technical',
  communication: 'Communication',
  hr: 'HR / behavioural',
  resume: 'Resume',
};

const WEIGHTS_BY_TIER = {
  mass_recruiter: {
    aptitude: 0.26, communication: 0.20, technical: 0.18,
    coding: 0.14, hr: 0.12, resume: 0.10,
  },
  product: {
    coding: 0.30, technical: 0.24, communication: 0.14,
    aptitude: 0.12, hr: 0.10, resume: 0.10,
  },
};

export function pillarWeights(targetTier = 'mass_recruiter') {
  return WEIGHTS_BY_TIER[targetTier] || WEIGHTS_BY_TIER.mass_recruiter;
}

/**
 * How each tool's score distributes across pillars.
 * `5_sec` is absent on purpose — it is a self-rating with no backend, and
 * scoring it would let a student inflate readiness by feeling good.
 */
export const TOOL_PILLARS = {
  aptitude:            { aptitude: 1 },
  pseudocode:          { coding: 0.6, technical: 0.4 },
  coding:              { coding: 1 },
  skill_readiness:     { technical: 1 },
  skill_mock:          { technical: 0.6, communication: 0.4 },
  project_mock:        { technical: 0.5, communication: 0.5 },
  interview_readiness: { technical: 0.7, communication: 0.3 },
  interview_mock:      { technical: 0.5, communication: 0.5 },
  hr_mock:             { hr: 0.7, communication: 0.3 },
  hr_bank:             { hr: 1 },
  written_round:       { communication: 0.8, technical: 0.2 },
  ms_office:           { technical: 1 },
  resume_ats:          { resume: 1 },
};

const HALF_LIFE_DAYS = 30;
const DECAY_FLOOR = 0.6;
export const DEFAULT_TARGET = 85;

/** An old score fades toward 60% of its weight — it never becomes worthless. */
export function recencyWeight(ageDays) {
  const age = Math.max(0, Number(ageDays) || 0);
  return DECAY_FLOOR + (1 - DECAY_FLOOR) * Math.pow(2, -age / HALF_LIFE_DAYS);
}

/**
 * Gate thresholds. These are calibration targets, not published cutoffs —
 * companies publish ACADEMIC cutoffs (60%, Accenture 65%), which are an
 * eligibility question handled separately. Revise these against real
 * `drive_outcomes` as soon as we have them; until then they are our estimate.
 */
export const GATES = [
  { id: 'tcs_ninja',    company: 'TCS',       label: 'TCS Ninja',     overall: 50, pillars: { aptitude: 55, communication: 45 } },
  { id: 'tcs_digital',  company: 'TCS',       label: 'TCS Digital',   overall: 65, pillars: { aptitude: 65, coding: 60, technical: 60 } },
  { id: 'tcs_prime',    company: 'TCS',       label: 'TCS Prime',     overall: 78, pillars: { coding: 75, technical: 75, aptitude: 70 } },
  { id: 'infosys_dse',  company: 'Infosys',   label: 'Infosys DSE',   overall: 55, pillars: { coding: 55, aptitude: 55 } },
  { id: 'infosys_sp',   company: 'Infosys',   label: 'Infosys SP',    overall: 70, pillars: { coding: 70, technical: 62 } },
  { id: 'accenture',    company: 'Accenture', label: 'Accenture',     overall: 60, pillars: { communication: 60, aptitude: 58 } },
  { id: 'wipro',        company: 'Wipro',     label: 'Wipro Elite',   overall: 55, pillars: { aptitude: 55, communication: 55 } },
  { id: 'cognizant',    company: 'Cognizant', label: 'Cognizant GenC',overall: 58, pillars: { aptitude: 58, technical: 55 } },
  { id: 'capgemini',    company: 'Capgemini', label: 'Capgemini',     overall: 55, pillars: { aptitude: 58, coding: 50 } },
];

/**
 * @param {object} input
 * @param {Array<{tool_code, score, technical_score?, communication_score?, completed_at}>} input.attempts
 * @param {string} input.today                 local YYYY-MM-DD
 * @param {number} [input.completionRate7d]    0..1 from the mission ledger
 * @param {string} [input.targetTier]
 * @param {string[]} [input.targetCompanies]
 * @param {number} [input.target]
 * @returns {object} Readiness
 */
export function computeReadiness(input = {}) {
  const {
    attempts = [],
    today,
    completionRate7d = 0,
    targetTier = 'mass_recruiter',
    targetCompanies = [],
    target = DEFAULT_TARGET,
  } = input;

  const weights = pillarWeights(targetTier);
  const acc = {};
  for (const p of PILLARS) acc[p] = { weighted: 0, weight: 0, scores: [], attempts: 0, lastAt: null };

  const sorted = [...attempts]
    .filter((a) => a && a.score != null && TOOL_PILLARS[a.tool_code])
    .sort((a, b) => String(a.completed_at || '').localeCompare(String(b.completed_at || '')));

  for (const attempt of sorted) {
    const contributions = TOOL_PILLARS[attempt.tool_code];
    const age = ageInDays(attempt.completed_at, today);
    const recency = recencyWeight(age);

    for (const [pillar, share] of Object.entries(contributions)) {
      // Voice tools report technical/communication separately — prefer those
      // over the blended overall when the tool actually measured them.
      let score = Number(attempt.score);
      if (pillar === 'technical' && attempt.technical_score != null) score = Number(attempt.technical_score);
      if (pillar === 'communication' && attempt.communication_score != null) score = Number(attempt.communication_score);
      if (!Number.isFinite(score)) continue;

      const w = share * recency;
      acc[pillar].weighted += score * w;
      acc[pillar].weight += w;
      acc[pillar].scores.push(score);
      acc[pillar].attempts += 1;
      acc[pillar].lastAt = attempt.completed_at || acc[pillar].lastAt;
    }
  }

  const pillars = {};
  let measuredCount = 0;
  for (const p of PILLARS) {
    const a = acc[p];
    const hasData = a.weight > 0;
    if (hasData) measuredCount += 1;
    const latest = a.scores[a.scores.length - 1] ?? null;
    const previous = a.scores.length > 1 ? a.scores[a.scores.length - 2] : null;
    pillars[p] = {
      label: PILLAR_LABELS[p],
      score: hasData ? Math.round(a.weighted / a.weight) : 0,
      hasData,
      attempts: a.attempts,
      confidence: Math.min(1, a.attempts / 2),
      trend: previous != null ? Math.round(latest - previous) : null,
      last_at: a.lastAt,
      weight: weights[p],
    };
  }

  // Measured pillars only — an unmeasured pillar is unknown, not zero.
  let weightSum = 0;
  let scoreSum = 0;
  for (const p of PILLARS) {
    if (!pillars[p].hasData) continue;
    weightSum += weights[p];
    scoreSum += pillars[p].score * weights[p];
  }
  const base = weightSum > 0 ? scoreSum / weightSum : 0;

  const rate = Math.min(1, Math.max(0, Number(completionRate7d) || 0));
  const execution = 0.9 + 0.1 * rate;
  const overall = Math.round(base * execution);

  const measured = PILLARS.filter((p) => pillars[p].hasData);
  const weakest = measured.length
    ? measured.reduce((lo, p) => (pillars[p].score < pillars[lo].score ? p : lo), measured[0])
    : null;
  const unmeasured = PILLARS.find((p) => !pillars[p].hasData) || null;

  return {
    overall,
    base: Math.round(base),
    execution_multiplier: Math.round(execution * 100) / 100,
    coverage: measuredCount / PILLARS.length,
    measured_pillars: measuredCount,
    total_pillars: PILLARS.length,
    target,
    target_tier: targetTier,
    eta_days: estimateEtaDays(sorted, overall, target, today),
    pillars,
    // Measuring an unmeasured pillar beats grinding a measured one.
    focus_pillar: unmeasured || weakest,
    weakest_pillar: weakest,
    gates: gatesFor({ overall, pillars }, targetCompanies),
    computed_at: today,
  };
}

function ageInDays(completedAt, today) {
  if (!completedAt || !today) return 0;
  const then = new Date(completedAt);
  const now = new Date(`${today}T00:00:00`);
  if (Number.isNaN(then.getTime()) || Number.isNaN(now.getTime())) return 0;
  return Math.max(0, Math.round((now - then) / 86400000));
}

/** Days to target at the pace of the last fortnight; null when unknowable. */
function estimateEtaDays(sortedAttempts, overall, target, today) {
  if (overall >= target) return 0;
  const recent = sortedAttempts.filter((a) => ageInDays(a.completed_at, today) <= 14);
  if (recent.length < 2) return null;

  const first = Number(recent[0].score);
  const last = Number(recent[recent.length - 1].score);
  const span = Math.max(1, ageInDays(recent[0].completed_at, today));
  const perDay = (last - first) / span;
  if (!Number.isFinite(perDay) || perDay <= 0) return null;

  return Math.min(180, Math.max(7, Math.round((target - overall) / perDay)));
}

/**
 * Turn a score into something a student can act on:
 * which gates they clear, and what is actually blocking the next one.
 */
export function gatesFor(readiness, targetCompanies = []) {
  const wanted = new Set((targetCompanies || []).map((c) => String(c).toLowerCase()));
  const relevant = wanted.size
    ? GATES.filter((g) => wanted.has(g.company.toLowerCase()))
    : GATES;

  return relevant.map((gate) => {
    const blockers = [];
    if (readiness.overall < gate.overall) {
      blockers.push({ pillar: 'overall', need: gate.overall, have: readiness.overall });
    }
    for (const [pillar, need] of Object.entries(gate.pillars)) {
      const have = readiness.pillars?.[pillar];
      // An unmeasured pillar blocks the gate as "unknown", not as a failure.
      if (!have?.hasData) {
        blockers.push({ pillar, need, have: null, unmeasured: true });
      } else if (have.score < need) {
        blockers.push({ pillar, need, have: have.score, gap: need - have.score });
      }
    }
    const binding = blockers
      .filter((b) => b.gap != null)
      .sort((a, b) => b.gap - a.gap)[0] || blockers[0] || null;

    return {
      id: gate.id,
      company: gate.company,
      label: gate.label,
      cleared: blockers.length === 0,
      blockers,
      binding_constraint: binding,
    };
  });
}
