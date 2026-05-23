/**
 * If the URL was corrupted by a GitHub Pages 404 redirect loop, reset to pathname only.
 * Call once on app boot (before routes render).
 */
export function sanitizeBrokenSpaUrl() {
  if (typeof window === 'undefined') return;
  const { search, pathname, hash } = window.location;
  if (!search || (!search.includes('~and~') && !search.includes('/&/'))) return;

  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  window.history.replaceState(null, '', cleanPath + hash);
}
