import { HERO_SCORE_GAMIFICATION_INSIGHTS } from '../constants/brandCopy';

/** Biggest-gap labels — cycles in the hero scorecard */
export const HERO_GAP_OPTIONS = [
  {
    id: 'hr',
    displayName: 'HR & Communication',
    shortName: 'HR',
    focusTopics: ['STAR stories', 'Clarity', 'Confidence'],
  },
  {
    id: 'oops',
    displayName: 'OOPS Concepts',
    shortName: 'OOPS',
    focusTopics: ['Inheritance', 'Polymorphism', 'Abstraction'],
  },
  {
    id: 'ai',
    displayName: 'AI Knowledge',
    shortName: 'AI',
    focusTopics: ['LLMs', 'Prompting', 'RAG basics'],
  },
  {
    id: 'projects',
    displayName: 'Project Understanding',
    shortName: 'Projects',
    focusTopics: ['Impact metrics', 'Tech choices', 'Trade-offs'],
  },
  {
    id: 'logic',
    displayName: 'Logical Reasoning',
    shortName: 'Logic',
    focusTopics: ['Patterns', 'Puzzles', 'Speed & accuracy'],
  },
  {
    id: 'database',
    displayName: 'Database',
    shortName: 'DB',
    focusTopics: ['SQL joins', 'Indexing', 'Normalization'],
  },
];

/** @deprecated Used only for legacy preview helpers */
export const HERO_SKILL_DEFINITIONS = HERO_GAP_OPTIONS.map((gap) => ({
  ...gap,
  shortLabel: gap.displayName,
  label: gap.displayName,
  hint: gap.focusTopics[0],
  color: '#ef4444',
  glow: 'rgba(239, 68, 68, 0.45)',
}));

export const HERO_TARGET_COMPANY_ROWS = [
  [
    { id: 'tcs', name: 'TCS' },
    { id: 'infosys', name: 'Infosys' },
    { id: 'microsoft', name: 'Microsoft' },
  ],
  [
    { id: 'nagarro', name: 'Nagarro' },
    { id: 'persistent', name: 'Persistent' },
  ],
];

/** @deprecated Use HERO_TARGET_COMPANY_ROWS */
export const HERO_TARGET_COMPANIES = HERO_TARGET_COMPANY_ROWS.flat();

export const HERO_UNLOCK_COMPANIES = ['Amazon', 'Microsoft', 'Google', 'Flipkart'];

/** Hero rank pool — starts at 500, grows on page refresh and user clicks */
export const HERO_STUDENT_POOL_BASE = 500;
const HERO_STUDENT_POOL_KEY = 'mm_hero_student_pool';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateHeroRank(totalStudents, percentileAhead) {
  return Math.max(
    8,
    Math.min(totalStudents - 1, Math.round(totalStudents * (1 - percentileAhead / 100))),
  );
}

/** Bump pool on each page load — persists in sessionStorage */
export function initHeroStudentPool() {
  try {
    const stored = sessionStorage.getItem(HERO_STUDENT_POOL_KEY);
    let total = stored ? parseInt(stored, 10) : HERO_STUDENT_POOL_BASE;
    if (!Number.isFinite(total) || total < HERO_STUDENT_POOL_BASE) {
      total = HERO_STUDENT_POOL_BASE;
    }
    total += randomInt(1, 4);
    sessionStorage.setItem(HERO_STUDENT_POOL_KEY, String(total));
    return total;
  } catch {
    return HERO_STUDENT_POOL_BASE + randomInt(1, 4);
  }
}

/** +1 on interactive click within the scorecard */
export function bumpHeroStudentPool(current) {
  const next = Math.max(HERO_STUDENT_POOL_BASE, current + 1);
  try {
    sessionStorage.setItem(HERO_STUDENT_POOL_KEY, String(next));
  } catch {
    /* ignore */
  }
  return next;
}

function estimateWeeks(score) {
  if (score >= 76) return randomInt(2, 4);
  if (score >= 68) return randomInt(3, 5);
  return randomInt(4, 8);
}

/**
 * One sample readiness score for the hero card.
 * @param {number} totalStudents — pool size (default 500+)
 */
export function generateHeroScorePreview(totalStudents = HERO_STUDENT_POOL_BASE) {
  const score = randomInt(60, 80);
  const gapIndex = randomInt(0, HERO_GAP_OPTIONS.length - 1);
  const gapSkill = HERO_GAP_OPTIONS[gapIndex];
  const improvePct = randomInt(15, 25);
  const percentileAhead = Math.min(88, Math.max(55, score - randomInt(-4, 6)));
  const pool = Math.max(HERO_STUDENT_POOL_BASE, totalStudents);
  const rank = calculateHeroRank(pool, percentileAhead);
  const estimatedWeeks = estimateWeeks(score);
  const unlockNames = HERO_UNLOCK_COMPANIES.slice(0, 2).join(', ');

  const insight =
    HERO_SCORE_GAMIFICATION_INSIGHTS[
      randomInt(0, HERO_SCORE_GAMIFICATION_INSIGHTS.length - 1)
    ];

  return {
    score,
    scoreRatio: score / 100,
    gapSkill,
    gapIndex,
    improvePct,
    percentileAhead,
    rank,
    totalStudents: pool,
    estimatedWeeks,
    unlockNames,
    insightLead: insight.lead,
    insightRest: insight.rest,
  };
}
