/**
 * Nav active-state helpers — SEO alias paths map to primary nav targets.
 */
export const NAV_ACTIVE_ALIASES = {
  '/roadmap': ['/placement-roadmap'],
  '/mock-interviews': ['/mock-interview', '/ai-interview-preparation'],
  '/resume-analyzer': ['/resume-ats-checker'],
  '/learning-paths': ['/dsa-roadmap'],
};

/** True if current pathname matches nav item path or its SEO aliases. */
export function isNavActive(pathname, path, exact = false) {
  if (exact) {
    if (pathname === path) return true;
    const aliases = NAV_ACTIVE_ALIASES[path];
    return aliases?.includes(pathname) ?? false;
  }
  if (pathname.startsWith(path)) return true;
  const aliases = NAV_ACTIVE_ALIASES[path];
  return aliases?.some((a) => pathname.startsWith(a)) ?? false;
}
