/**
 * Path helpers for BrowserRouter + Vite `base` (e.g. /MentorMuni-React-Frontend/).
 */

/** React Router `basename` — undefined when app is served from domain root. */
export function getRouterBasename() {
  const base = import.meta.env.BASE_URL || '/';
  if (base === '/') return undefined;
  return base.replace(/\/$/, '');
}

/** In-app path including Vite base, e.g. /MentorMuni-React-Frontend/start-assessment */
export function toAppPath(route = '/') {
  const r = route.startsWith('/') ? route : `/${route}`;
  const basename = getRouterBasename();
  if (!basename) return r;
  return `${basename}${r}`;
}

/** Absolute URL for sharing / target="_blank" */
export function toAppAbsoluteUrl(route = '/') {
  if (typeof window === 'undefined') return toAppPath(route);
  return `${window.location.origin}${toAppPath(route)}`;
}
