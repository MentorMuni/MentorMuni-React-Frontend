import { toAppPath } from './appPaths';

/**
 * Full-page navigation to Interview Readiness (`/start-assessment`).
 * Client-side <Link> does not reset wizard state — this forces a real navigation / reload.
 */
const TARGET_PATH = '/start-assessment';

export function goToStartAssessment() {
  const target = toAppPath(TARGET_PATH);
  const { pathname } = window.location;

  if (pathname === target || pathname.endsWith(TARGET_PATH)) {
    window.location.reload();
    return;
  }

  window.location.assign(target);
}

export function isStartAssessmentPath(href) {
  if (!href || typeof href !== 'string') return false;
  return href === TARGET_PATH || href.startsWith(`${TARGET_PATH}?`);
}
