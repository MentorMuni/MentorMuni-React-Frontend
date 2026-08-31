/**
 * Student placement journey — assessment week → personalized plan (30–45 days).
 * Mirrors backend student_roadmap/plan_horizon.py
 */

export const ASSESSMENT_WEEK_DAYS = 3;
export const ASSESSMENT_TOTAL_CHECKS = 8;

export const PLAN_HORIZON_BY_BAND = {
  foundation: 45,
  balanced: 38,
  interview_ready: 30,
};

export const PLAN_HORIZON_MIN = 30;
export const PLAN_HORIZON_MAX = 45;
/** Legacy cap — prefer planHorizonFromPlan() when a plan exists. */
export const PLAN_HORIZON_DAYS = PLAN_HORIZON_MAX;

export function planHorizonDays(band = 'balanced') {
  const days = PLAN_HORIZON_BY_BAND[band] ?? PLAN_HORIZON_BY_BAND.balanced;
  return Math.max(PLAN_HORIZON_MIN, Math.min(PLAN_HORIZON_MAX, days));
}

/** Read actual plan length from generated JSON (mocks phase day_end). */
export function planHorizonFromPlan(plan) {
  const phases = plan?.plan?.phases;
  if (!Array.isArray(phases)) return PLAN_HORIZON_BY_BAND.balanced;
  let maxDay = 0;
  for (const phase of phases) {
    const end = Number(phase?.day_end);
    if (Number.isFinite(end)) maxDay = Math.max(maxDay, end);
  }
  if (maxDay >= PLAN_HORIZON_MIN) return maxDay;
  return PLAN_HORIZON_BY_BAND.balanced;
}

export function assessmentWeekLabel() {
  return 'Assessment week';
}

export function personalizedPlanLabel(band = 'balanced') {
  const days = planHorizonDays(band);
  return `Your ${days}-day personalized plan`;
}
