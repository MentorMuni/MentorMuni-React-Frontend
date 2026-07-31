import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'mm-org-portal-theme';

export function getStoredOrgTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return 'light';
}

export function useOrgTheme() {
  const [theme, setThemeState] = useState(() => getStoredOrgTheme());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme, isLight: theme === 'light', isDark: theme === 'dark' };
}
