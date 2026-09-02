/** Map old hash / marketing shortcuts to in-portal routes (BrowserRouter). */
const LEGACY_HASH_TO_PATH = {
  '/aptitude-arcade': '/studentportal/aptitude-arcade',
  '/student/aptitude-arcade': '/studentportal/aptitude-arcade',
  '/my-performance': '/studentportal/progress',
  '/student/performance': '/studentportal/progress',
};

const LEGACY_PATH_REDIRECTS = {
  '/aptitude-arcade': '/studentportal/aptitude-arcade',
  '/student/aptitude-arcade': '/studentportal/aptitude-arcade',
};

/**
 * Supports bookmarks like http://localhost:5173/#/aptitude-arcade
 * when the app uses BrowserRouter (hash is not read by React Router).
 */
export function redirectLegacySpaEntry() {
  if (typeof window === 'undefined') return;

  const { hash, pathname, search } = window.location;

  if (hash && hash.startsWith('#/')) {
    const hashPath = hash.slice(1).split('?')[0];
    const target = LEGACY_HASH_TO_PATH[hashPath];
    if (target) {
      const qs = hash.includes('?') ? hash.slice(hash.indexOf('?')) : search;
      window.location.replace(`${target}${qs || ''}`);
      return;
    }
  }

  const bare = pathname.replace(/\/+$/, '') || '/';
  const target = LEGACY_PATH_REDIRECTS[bare];
  if (target) {
    window.location.replace(`${target}${search || ''}`);
  }
}
