/**
 * Full-page navigation to Interview Readiness (`#/start-assessment`).
 * HashRouter + SPA: client-side <Link> only swaps the hash without reloading,
 * so wizard state can stick around. This forces a real navigation / reload.
 *
 * If already on this route, reloads the page so state resets.
 */
const TARGET_HASH = '#/start-assessment';

export function goToStartAssessment() {
  const base = import.meta.env.BASE_URL || '/';
  const url = new URL(base, window.location.origin);
  url.hash = TARGET_HASH;

  const current = window.location.hash.split('?')[0];
  if (current === TARGET_HASH) {
    window.location.reload();
    return;
  }
  window.location.href = url.href;
}

export function isStartAssessmentPath(href) {
  if (!href || typeof href !== 'string') return false;
  return href === '/start-assessment' || href.startsWith('/start-assessment?');
}
