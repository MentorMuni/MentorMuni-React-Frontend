import { computeReadiness, DEFAULT_TARGET } from './readinessScore';
import { completionRate } from '../daily/dailyLocal';
import { todayKey } from '../daily/dayKeys';

/**
 * Compute readiness from roadmap attempts + daily mission completion rate.
 * Pure utility function (not a React hook).
 *
 * Builds attempts[] from roadmap.steps (which already carry scores) and day-by-day mission ledger.
 * Returns the full readiness object with pillars, gates, and binding constraint.
 */
export function computeStudentReadiness({
  roadmap = null,
  userKey = 'anon',
  targetTier = 'mass_recruiter',
  targetCompanies = [],
  target = DEFAULT_TARGET,
} = {}) {
  if (!roadmap?.steps || !roadmap.steps.length) {
    return null;
  }

  const today = todayKey();

  // Build attempts from roadmap steps (which already carry scores from completed assessments)
  const attempts = (roadmap.steps || [])
    .filter((step) => step.status === 'done' && step.score != null)
    .map((step) => ({
      tool_code: step.tool_code,
      score: step.score,
      technical_score: step.technical_score ?? null,
      communication_score: step.communication_score ?? null,
      completed_at: step.completed_at,
    }));

  // Get 7-day completion rate from the mission ledger
  // This will feed the execution_multiplier in computeReadiness
  const rate7d = completionRate(userKey, 7, today);

  return computeReadiness({
    attempts,
    today,
    completionRate7d: rate7d,
    targetTier,
    targetCompanies,
    target,
  });
}
