/**
 * Student portal theming.
 *
 * Three modes — light / dark / system — because a portal that
 * ignores the OS setting on a student's first visit reads as
 * unfinished. `system` is the default.
 *
 * The provider is the single source of truth. Before this, every
 * page called its own `useState`, so four copies of the theme could
 * disagree and nothing synced across tabs.
 *
 * Components outside the provider (the readiness and today's-focus
 * cards are embedded as artwork on the public /colleges page) get
 * the light default rather than an error — see DEFAULT_VALUE.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { Moon, Sun } from 'lucide-react';

export const STUDENT_THEME_KEY = 'mm-student-theme';
/** Pre-tri-state key. Read once so existing users keep their choice. */
const LEGACY_THEME_KEY = 'mm-student-login-theme';

const MODES = ['light', 'dark', 'system'];
const DARK_QUERY = '(prefers-color-scheme: dark)';

function prefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(DARK_QUERY).matches;
}

function subscribeToScheme(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(DARK_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function readStoredMode() {
  try {
    const stored = localStorage.getItem(STUDENT_THEME_KEY);
    if (MODES.includes(stored)) return stored;

    const legacy = localStorage.getItem(LEGACY_THEME_KEY);
    if (legacy === 'dark' || legacy === 'light') return legacy;
  } catch {
    // Private mode / storage disabled — fall through to the default.
  }
  return 'system';
}

function resolve(mode) {
  if (mode === 'dark') return 'dark';
  if (mode === 'light') return 'light';
  return prefersDark() ? 'dark' : 'light';
}

/** Resolved theme for code that runs before the provider mounts. */
export function readStudentTheme() {
  return resolve(readStoredMode());
}

const DEFAULT_VALUE = {
  mode: 'light',
  theme: 'light',
  setMode: () => {},
  cycle: () => {},
  // Legacy surface, still used by the six auth pages.
  toggle: () => {},
  rootClass: 'is-light',
};

const StudentThemeContext = createContext(DEFAULT_VALUE);

export function StudentThemeProvider({ children }) {
  const [mode, setModeState] = useState(readStoredMode);
  // useSyncExternalStore keeps the OS preference in step without
  // seeding state from an effect (which causes a cascading render).
  const systemDark = useSyncExternalStore(subscribeToScheme, prefersDark, () => false);

  const theme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  const setMode = useCallback((next) => {
    if (!MODES.includes(next)) return;
    setModeState(next);
    try {
      localStorage.setItem(STUDENT_THEME_KEY, next);
    } catch {
      // Non-blocking: the theme still applies for this session.
    }
  }, []);

  const cycle = useCallback(() => {
    setMode(theme === 'dark' ? 'light' : 'dark');
  }, [setMode, theme]);

  // Keep other tabs in step.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STUDENT_THEME_KEY) return;
      if (MODES.includes(e.newValue)) setModeState(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      theme,
      setMode,
      cycle,
      // The auth pages predate the tri-state control and still take
      // a plain toggle plus an `is-dark`/`is-light` root class.
      toggle: cycle,
      rootClass: theme === 'dark' ? 'is-dark' : 'is-light',
    }),
    [mode, theme, setMode, cycle]
  );

  return (
    <StudentThemeContext.Provider value={value}>{children}</StudentThemeContext.Provider>
  );
}

export function useStudentTheme() {
  return useContext(StudentThemeContext);
}

/** Canvas colour behind the shell, per resolved theme. */
const CANVAS = { light: '#f4f7fa', dark: '#0d141d' };

/**
 * Paints the page canvas behind the portal shell and hands it back on
 * unmount.
 *
 * index.html ships `<body style="background-color:#f8fbff">` as an
 * anti-FOUC measure for the marketing site. An inline style beats every
 * selector, which is why the previous version of this needed `:has()`
 * plus `!important` to land. Setting the same inline property — and
 * restoring the original on unmount — works with that mechanism instead
 * of escalating against it.
 *
 * Called by StudentLayout only: the auth pages paint their own
 * background from student-login.css and must not be overridden.
 */
export function useStudentPortalCanvas(theme) {
  useEffect(() => {
    const root = document.documentElement;
    const { body } = document;
    const prevColor = body.style.backgroundColor;
    const prevImage = body.style.backgroundImage;

    root.setAttribute('data-student-portal', theme);
    body.style.backgroundColor = CANVAS[theme] || CANVAS.light;
    // `html.mm-new-ui body` (src/theme/new-ui-tokens.css) paints a
    // radial+linear gradient on the body. A background-image sits above
    // background-color, so setting the colour alone leaves the marketing
    // gradient showing through behind the portal.
    body.style.backgroundImage = 'none';

    return () => {
      root.removeAttribute('data-student-portal');
      body.style.backgroundColor = prevColor;
      body.style.backgroundImage = prevImage;
    };
  }, [theme]);
}

/** Floating light/dark toggle used by the auth pages. */
export function StudentThemeFab({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="mm-stu-theme-fab"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
