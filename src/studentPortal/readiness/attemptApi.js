/**
 * Log an intelligence attempt to the server (P0).
 * No-ops quietly when the endpoint is missing.
 */

import { studentApi, StudentApiError } from '../studentApi';
import { isLocalFallbackSession } from '../roadmap/roadmapApi';

const MISSING = new Set([0, 404, 501]);

export async function postStudentAttempt(body = {}) {
  if (isLocalFallbackSession()) return { ok: true, source: 'local' };
  try {
    const data = await studentApi.post('/student/attempts', body, { silent: true });
    return { ...data, source: 'server' };
  } catch (err) {
    if (err instanceof StudentApiError && MISSING.has(err.status)) {
      return { ok: false, source: 'missing' };
    }
    throw err;
  }
}
