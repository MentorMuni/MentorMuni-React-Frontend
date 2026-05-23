import { toAppPath } from './appPaths';

/**
 * Client-side navigation to Interview Readiness (`/start-assessment`).
 * Uses history API instead of full page load so GitHub Pages 404.html does not
 * corrupt the URL with `?/&/~and~/…` redirect loops.
 */
const TARGET_PATH = '/start-assessment';

function isOnAssessmentPath() {
  const { pathname } = window.location;
  const target = toAppPath(TARGET_PATH);
  return pathname === target || pathname.endsWith(TARGET_PATH);
}

/** Navigate in-app without reload (BrowserRouter listens to popstate). */
function navigateInApp(path) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
}

export function goToStartAssessment() {
  if (isOnAssessmentPath()) {
    window.location.reload();
    return;
  }

  navigateInApp(toAppPath(TARGET_PATH));
}

export function isStartAssessmentPath(href) {
  if (!href || typeof href !== 'string') return false;
  return href === TARGET_PATH || href.startsWith(`${TARGET_PATH}?`);
}
