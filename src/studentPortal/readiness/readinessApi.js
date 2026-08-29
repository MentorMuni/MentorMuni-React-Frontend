/**
 * Student readiness transport — prefers GET /student/readiness (P0).
 * Falls back to local computeStudentReadiness when endpoint missing.
 */

import { studentApi, StudentApiError } from '../studentApi';
import { isLocalFallbackSession } from '../roadmap/roadmapApi';
import { computeStudentReadiness } from './useReadiness';

const MISSING = new Set([0, 404, 501]);

export function isMissingReadinessEndpoint(err) {
  return err instanceof StudentApiError && MISSING.has(err.status);
}

/**
 * @returns {Promise<object|null>} computeReadiness-shaped object
 */
export async function fetchStudentReadiness({
  roadmap,
  userKey,
  targetTier,
  targetCompanies,
  target,
  silent = true,
} = {}) {
  if (!isLocalFallbackSession()) {
    try {
      const data = await studentApi.get('/student/readiness', { silent });
      if (data && typeof data === 'object') {
        return { ...data, source: 'server' };
      }
    } catch (err) {
      if (!isMissingReadinessEndpoint(err)) throw err;
    }
  }

  const local = computeStudentReadiness({
    roadmap,
    userKey,
    targetTier,
    targetCompanies,
    target,
  });
  return local ? { ...local, source: 'local' } : null;
}
