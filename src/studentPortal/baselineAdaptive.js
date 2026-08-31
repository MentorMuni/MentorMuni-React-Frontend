/**
 * Adaptive Week-1 baseline — fast-track, standard, or foundation path.
 * Evaluated after snap + aptitude (first two checks).
 */

import { getPlacementProfile, savePlacementProfile } from './placementProfile';

export const BASELINE_PATHS = {
  FAST_TRACK: 'fast_track',
  STANDARD: 'standard',
  FOUNDATION: 'foundation',
};

/** Target: finish all 8 baseline checks in 3 calendar days (not 8). */
export const BASELINE_SPRINT_DAYS = 3;
export const BASELINE_TOTAL_CHECKS = 8;

/** Suggested checks per sprint day (standard path, no fast-track). */
export const BASELINE_SPRINT_PLAN = [
  { day: 1, target: 3, label: 'Snap, aptitude, skill readiness' },
  { day: 2, target: 3, label: 'Skill mock, project mock, interview readiness' },
  { day: 3, target: 2, label: 'Interview mock, HR mock — then generate your plan' },
];

/** Waived immediately on fast-track (day 1). */
export const FAST_TRACK_DAY1_WAIVE_TOOLS = ['skill_readiness'];
/** Waived when day-2 batch unlocks (order 6+). */
export const FAST_TRACK_DEFER_WAIVE_TOOLS = ['interview_readiness'];
export const FAST_TRACK_WAIVE_TOOLS = [
  ...FAST_TRACK_DAY1_WAIVE_TOOLS,
  ...FAST_TRACK_DEFER_WAIVE_TOOLS,
];

const EARLY_TOOLS = ['5_sec', 'aptitude'];

export function getBaselinePath(userKey = 'anon') {
  const profile = getPlacementProfile(userKey);
  return profile?.baselinePath || null;
}

export function saveBaselinePath(userKey, path) {
  return savePlacementProfile(userKey, { baselinePath: path });
}

/** Average score from completed early baseline tools (ignores unscored snap). */
export function earlyBaselineAverage(steps = []) {
  const scores = steps
    .filter((s) => EARLY_TOOLS.includes(s.tool_code) && s.status === 'done')
    .map((s) => s.score)
    .filter((n) => n != null && Number.isFinite(Number(n)))
    .map(Number);
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Recommend a path from early scores + onboarding starting level.
 * @returns {'fast_track'|'standard'|'foundation'}
 */
export function recommendBaselinePath({ steps = [], startingLevel = 'some_experience' } = {}) {
  const avg = earlyBaselineAverage(steps);
  if (avg == null) return BASELINE_PATHS.STANDARD;

  if (startingLevel === 'strong_coding' && avg >= 65) return BASELINE_PATHS.FAST_TRACK;
  if (avg >= 70) return BASELINE_PATHS.FAST_TRACK;
  if (avg < 45) return BASELINE_PATHS.FOUNDATION;
  if (startingLevel === 'beginner' && avg < 55) return BASELINE_PATHS.FOUNDATION;
  return BASELINE_PATHS.STANDARD;
}

export function shouldPromptBaselinePath(steps = [], userKey = 'anon') {
  const aptitude = steps.find((s) => s.tool_code === 'aptitude');
  if (aptitude?.status !== 'done') return false;
  return !getBaselinePath(userKey);
}

export function baselinePathLabel(path) {
  switch (path) {
    case BASELINE_PATHS.FAST_TRACK:
      return 'Fast track';
    case BASELINE_PATHS.FOUNDATION:
      return 'Foundation mode';
    default:
      return 'Standard path';
  }
}

export function baselinePathHint(path) {
  switch (path) {
    case BASELINE_PATHS.FAST_TRACK:
      return 'Skip redundant readiness checks — jump straight to AI mocks.';
    case BASELINE_PATHS.FOUNDATION:
      return 'Extra scaffolding on gaps before mocks — smaller wins each day.';
    default:
      return 'All eight checks in order — balanced for most students.';
  }
}
