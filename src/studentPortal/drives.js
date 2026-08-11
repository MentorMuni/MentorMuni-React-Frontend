/**
 * Upcoming campus drives — the one real source for anything on the
 * portal that claims a company is coming.
 *
 * The topbar chip used to read "Campus Drive · TCS · in 14 days" from
 * a string literal, and the companies list scored five invented
 * employers. Both now render from this, and render an empty state
 * when the college has not published anything.
 *
 * `demo: true` marks synthetic data (demo/local sessions, or a real
 * account whose college has no drives yet). Surfaces must label it as
 * a sample rather than presenting it as a scheduled drive.
 */

import { studentApi } from './studentApi';
import { isLocalFallbackSession } from './roadmap/roadmapApi';
import { demoNearestDrive } from './companyPrep';

const REQUEST_TIMEOUT_MS = 8000;

function withTimeout(promise, ms = REQUEST_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Drive list timed out')), ms)),
  ]);
}

function demoResult() {
  const demo = demoNearestDrive();
  return { items: [demo], nearest: demo, demo: true };
}

const EMPTY_RESULT = { items: [], nearest: null, demo: false };

/**
 * @returns {Promise<{items: object[], nearest: object|null, demo: boolean}>}
 *   Never rejects — callers can render without a try/catch.
 *
 * The demo drive is returned ONLY for demo/local sessions. A real
 * student whose college has published nothing gets an empty result, so
 * the topbar chip hides and the campus sections show their empty
 * state. Falling back to the sample drive here would put a fictional
 * "Accenture · in 21 days" in a real student's chrome — the exact
 * thing the hardcoded TCS chip was doing.
 */
export async function fetchUpcomingDrives() {
  if (isLocalFallbackSession()) return demoResult();

  try {
    const data = await withTimeout(studentApi.get('/student/upcoming-drives', { silent: true }));
    const items = (data?.items || []).filter(Boolean);
    const nearest = data?.nearest || items.find((d) => !d.is_past) || items[0] || null;
    if (!nearest) return EMPTY_RESULT;
    return { items: items.length ? items : [nearest], nearest, demo: false };
  } catch {
    // Unreachable API is not evidence of a drive. Say nothing.
    return EMPTY_RESULT;
  }
}

/** Human label for a drive's countdown. */
export function driveCountdown(drive) {
  const days = drive?.days_until;
  if (days == null) return '';
  if (days <= 0) return 'today';
  if (days === 1) return 'tomorrow';
  return `in ${days} days`;
}

/** A drive inside two weeks gets the urgent treatment. */
export function isDriveSoon(drive) {
  const days = drive?.days_until;
  return days != null && days >= 0 && days <= 14;
}
