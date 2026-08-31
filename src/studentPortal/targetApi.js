/**
 * Student placement target — GET/POST /student/target
 * Canonical store: student_target table (Postgres).
 * localStorage mirrors for offline/demo fallback.
 */

import { studentApi, StudentApiError } from './studentApi';
import { isLocalFallbackSession } from './roadmap/roadmapApi';
import { getPlacementProfile, savePlacementProfile } from './placementProfile';
import { campusTodayKey, ensureSprintStart } from './baselineSprint';

const MISSING = new Set([0, 404, 501]);

export function normalizeTarget(data = {}) {
  return {
    target_companies: Array.isArray(data.target_companies) ? data.target_companies : [],
    target_tier: data.target_tier || 'mass_recruiter',
    target_readiness: Number(data.target_readiness) || 85,
    starting_level: data.starting_level || 'some_experience',
    baseline_path: data.baseline_path || null,
    daily_budget_minutes: Number(data.daily_budget_minutes) || 25,
    onboarding_completed: Boolean(data.onboarding_completed),
    baseline_sprint_start_date: data.baseline_sprint_start_date || null,
  };
}

function mirrorToLocal(userKey, payload) {
  savePlacementProfile(userKey, {
    targetTier: payload.target_tier,
    targetCompanies: payload.target_companies,
    targetReadiness: payload.target_readiness,
    startingLevel: payload.starting_level,
    baselinePath: payload.baseline_path,
    budgetMinutes: payload.daily_budget_minutes,
    completedAt: payload.onboarding_completed ? new Date().toISOString() : undefined,
    baselineSprintStart: payload.baseline_sprint_start_date || undefined,
  });
  if (payload.onboarding_completed) {
    ensureSprintStart(userKey, payload.baseline_sprint_start_date || campusTodayKey());
  }
}

export async function fetchStudentTarget({ userKey = 'anon' } = {}) {
  if (isLocalFallbackSession()) {
    const local = getPlacementProfile(userKey);
    return normalizeTarget({
      target_companies: local?.targetCompanies || [],
      target_tier: local?.targetTier || 'mass_recruiter',
      target_readiness: local?.targetReadiness || 85,
      starting_level: local?.startingLevel || 'some_experience',
      baseline_path: local?.baselinePath || null,
      daily_budget_minutes: local?.budgetMinutes || 25,
      onboarding_completed: Boolean(local?.completedAt),
      baseline_sprint_start_date: local?.baselineSprintStart || null,
    });
  }

  try {
    const data = await studentApi.get('/student/target', { silent: true });
    const payload = normalizeTarget(data);
    mirrorToLocal(userKey, payload);
    return payload;
  } catch (err) {
    if (err instanceof StudentApiError && MISSING.has(err.status)) {
      const local = getPlacementProfile(userKey);
      return normalizeTarget({
        target_companies: local?.targetCompanies || [],
        target_tier: local?.targetTier || 'mass_recruiter',
        target_readiness: local?.targetReadiness || 85,
        starting_level: local?.startingLevel || 'some_experience',
        baseline_path: local?.baselinePath || null,
        daily_budget_minutes: local?.budgetMinutes || 25,
        onboarding_completed: Boolean(local?.completedAt),
        baseline_sprint_start_date: local?.baselineSprintStart || null,
      });
    }
    throw err;
  }
}

export async function saveStudentTarget(body = {}, { userKey = 'anon' } = {}) {
  const local = getPlacementProfile(userKey);
  const payload = normalizeTarget({
    target_companies: body.target_companies ?? local?.targetCompanies ?? [],
    target_tier: body.target_tier ?? local?.targetTier ?? 'mass_recruiter',
    target_readiness: body.target_readiness ?? local?.targetReadiness ?? 85,
    starting_level: body.starting_level ?? local?.startingLevel ?? 'some_experience',
    baseline_path: body.baseline_path ?? local?.baselinePath ?? null,
    daily_budget_minutes: body.daily_budget_minutes ?? local?.budgetMinutes ?? 25,
    onboarding_completed:
      body.onboarding_completed ?? Boolean(local?.completedAt) ?? false,
  });

  mirrorToLocal(userKey, payload);

  if (isLocalFallbackSession()) {
    return payload;
  }

  try {
    const data = await studentApi.post('/student/target', payload);
    const saved = normalizeTarget(data);
    mirrorToLocal(userKey, saved);
    return saved;
  } catch (err) {
    if (err instanceof StudentApiError && MISSING.has(err.status)) {
      return payload;
    }
    throw err;
  }
}
