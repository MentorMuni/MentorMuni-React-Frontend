/** Skill rows shown on the homepage hero score preview card */
export const HERO_SKILL_DEFINITIONS = [
  {
    shortLabel: 'Data structures & algorithms',
    label: 'Data structures & algorithms',
    hint: 'Coding / problem-solving rounds',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.45)',
  },
  {
    shortLabel: 'System Design',
    label: 'System design',
    hint: 'Architecture & trade-offs',
    color: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.45)',
  },
  {
    shortLabel: 'HR & communication',
    label: 'HR & communication',
    hint: 'Behavioral & clarity',
    color: '#16a34a',
    glow: 'rgba(34, 197, 94, 0.4)',
  },
  {
    shortLabel: 'Projects & depth',
    label: 'Projects & depth',
    hint: 'What you built & why',
    color: '#9333ea',
    glow: 'rgba(167, 139, 250, 0.4)',
  },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * One sample readiness score for the hero card — stable for the page visit (call once on mount).
 * Overall score 60–80; category bars vary with a clear weakest area.
 */
export function generateHeroScorePreview() {
  const score = randomInt(60, 80);
  const gapIndex = randomInt(0, HERO_SKILL_DEFINITIONS.length - 1);
  const percents = new Array(HERO_SKILL_DEFINITIONS.length);

  const gapPct = randomInt(Math.max(38, score - 22), Math.max(42, score - 8));
  percents[gapIndex] = gapPct;

  for (let i = 0; i < HERO_SKILL_DEFINITIONS.length; i++) {
    if (i === gapIndex) continue;
    const floor = Math.min(gapPct + 6, score);
    const ceil = Math.min(92, score + randomInt(8, 16));
    percents[i] = randomInt(Math.max(floor, score - 2), Math.max(floor + 1, ceil));
  }

  const skillBars = HERO_SKILL_DEFINITIONS.map((def, i) => ({
    ...def,
    w: percents[i] / 100,
    pct: percents[i],
  }));

  const improvement = randomInt(16, 24);

  return {
    score,
    scoreRatio: score / 100,
    skillBars,
    gapLabel: HERO_SKILL_DEFINITIONS[gapIndex].shortLabel,
    improvement,
    insightLead: `${HERO_SKILL_DEFINITIONS[gapIndex].shortLabel} is your biggest gap.`,
    insightRest: `Most students with this profile improve +${improvement} pts in 3 weeks with focused practice.`,
  };
}
