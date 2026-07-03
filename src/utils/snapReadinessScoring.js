/** @typedef {'yes_no' | 'scale'} SnapQuestionType */

/**
 * @typedef {Object} SnapQuestion
 * @property {string} id
 * @property {string} label
 * @property {string} [hint]
 * @property {SnapQuestionType} type
 * @property {number} weight
 * @property {string} gapLabel
 */

export const SNAP_QUESTIONS = [
  {
    id: 'resume_ats',
    label: 'Checked your resume ATS score?',
    hint: 'Keywords, format, gaps recruiters never see',
    type: 'yes_no',
    weight: 12,
    gapLabel: 'Resume / ATS',
  },
  {
    id: 'own_project',
    label: 'Built a project on your own?',
    hint: 'Not copy-paste — something you can explain',
    type: 'yes_no',
    weight: 18,
    gapLabel: 'Own project',
  },
  {
    id: 'ai_tools',
    label: 'Use AI tools for prep?',
    hint: 'GPT, Cursor, Claude — for code & concepts',
    type: 'scale',
    weight: 10,
    gapLabel: 'AI-assisted prep',
  },
  {
    id: 'stack_ready',
    label: 'Comfortable in a stack?',
    hint: 'Java, Python, frontend, or backend',
    type: 'yes_no',
    weight: 20,
    gapLabel: 'Core stack',
  },
  {
    id: 'mock_interview',
    label: 'Done mock interviews?',
    hint: 'Technical or HR — under real pressure',
    type: 'yes_no',
    weight: 20,
    gapLabel: 'Mock interviews',
  },
  {
    id: 'aptitude_concepts',
    label: 'Aptitude + deep concepts ready?',
    hint: 'Quant, logic, and "why" behind answers',
    type: 'scale',
    weight: 20,
    gapLabel: 'Aptitude & concepts',
  },
];

export const SNAP_SCALE_OPTIONS = [
  { value: 1, emoji: '😰', label: 'Not yet' },
  { value: 2, emoji: '😕', label: 'Starting' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '🔥', label: 'Solid' },
];

/**
 * @param {Record<string, boolean | number>} answers
 * @returns {number} 0–100 snap readiness score
 */
export function computeSnapScore(answers) {
  let total = 0;

  for (const q of SNAP_QUESTIONS) {
    const raw = answers[q.id];
    if (raw == null) continue;

    if (q.type === 'yes_no') {
      total += raw ? q.weight : 0;
    } else {
      const scale = Math.max(1, Math.min(5, Number(raw) || 1));
      total += Math.round((scale / 5) * q.weight);
    }
  }

  return Math.max(0, Math.min(100, total));
}

/**
 * Readiness stages — qualitative, honest positioning (NOT a computed score).
 * A 6-tap self-report can place you in a stage; it cannot produce a defensible
 * out-of-100 number. The real score is intentionally withheld for the full check.
 */
export const SNAP_STAGES = [
  {
    id: 'blind_spot',
    order: 1,
    label: 'Blind Spot',
    tagline: "You haven't seen what panels actually test yet.",
    tone: 'danger',
    peerLine: '7 in 10 students at this stage only find their gaps after a rejection.',
  },
  {
    id: 'early_mover',
    order: 2,
    label: 'Early Mover',
    tagline: "You've started — but the biggest gaps are still open.",
    tone: 'warning',
    peerLine: 'Most students here feel "almost ready" and get filtered in round 1.',
  },
  {
    id: 'in_the_race',
    order: 3,
    label: 'In the Race',
    tagline: "You're a real contender — a few gaps decide the outcome.",
    tone: 'caution',
    peerLine: 'At this stage, shortlists come down to depth you can prove under pressure.',
  },
  {
    id: 'frontrunner',
    order: 4,
    label: 'Frontrunner',
    tagline: 'You look sharp — now prove the edge is real.',
    tone: 'success',
    peerLine: 'Even strong profiles get surprised by what a panel digs into. Verify it.',
  },
];

/**
 * @param {number} score internal signal 0–100 (never shown to the user)
 * @returns {typeof SNAP_STAGES[number]}
 */
export function stageFromSignal(score) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  if (s >= 78) return SNAP_STAGES[3];
  if (s >= 55) return SNAP_STAGES[2];
  if (s >= 30) return SNAP_STAGES[1];
  return SNAP_STAGES[0];
}

/**
 * @param {Record<string, boolean | number>} answers
 * @returns {{ id: string; label: string; severity: 'high' | 'medium' }[]}
 */
export function snapGapsFromAnswers(answers) {
  const gaps = [];

  for (const q of SNAP_QUESTIONS) {
    const raw = answers[q.id];
    if (raw == null) continue;

    const weak =
      q.type === 'yes_no'
        ? !raw
        : (Number(raw) || 0) <= 2;

    if (weak) {
      gaps.push({
        id: q.id,
        label: q.gapLabel,
        severity: q.weight >= 18 ? 'high' : 'medium',
      });
    }
  }

  return gaps;
}

/**
 * How many of the 6 self-report signals came back "ready".
 * Honest, concrete number the user can trust (unlike a fabricated /100 score).
 * @param {Record<string, boolean | number>} answers
 */
export function readySignalCount(answers) {
  let ready = 0;
  for (const q of SNAP_QUESTIONS) {
    const raw = answers[q.id];
    if (raw == null) continue;
    const strong = q.type === 'yes_no' ? !!raw : (Number(raw) || 0) >= 3;
    if (strong) ready += 1;
  }
  return ready;
}

/**
 * @param {number} score internal signal (never displayed)
 * @param {Record<string, boolean | number>} answers
 */
export function buildSnapResult(score, answers) {
  const stage = stageFromSignal(score);
  const gaps = snapGapsFromAnswers(answers);
  const signalsReady = readySignalCount(answers);
  const totalSignals = SNAP_QUESTIONS.length;

  return {
    stage,
    gaps,
    signalsReady,
    totalSignals,
    readinessTone: stage.tone,
  };
}
