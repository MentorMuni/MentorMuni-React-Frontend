import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isDarkThemeBySchedule } from '../utils/themeSchedule';

const STORAGE_KEY = 'mm-new-ui';
const SOURCE_KEY = 'mm-theme-source';
const THEME_COLOR_CLASSIC = '#1A8FC4';
const THEME_COLOR_NEW_UI = '#060a12';
const SCHEDULE_CHECK_MS = 60_000;

function syncThemeColorMeta(isNewUI) {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', isNewUI ? THEME_COLOR_NEW_UI : THEME_COLOR_CLASSIC);
}

function applyThemeToDom(isNewUI) {
  const root = document.documentElement;
  if (isNewUI) root.classList.add('mm-new-ui');
  else root.classList.remove('mm-new-ui');
  syncThemeColorMeta(isNewUI);
}

function readPreferenceSource() {
  try {
    return localStorage.getItem(SOURCE_KEY);
  } catch {
    return null;
  }
}

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') return true;
    if (stored === '0') return false;
    return null;
  } catch {
    return null;
  }
}

function persistTheme(isNewUI, source) {
  try {
    localStorage.setItem(STORAGE_KEY, isNewUI ? '1' : '0');
    localStorage.setItem(SOURCE_KEY, source);
  } catch {
    /* ignore */
  }
}

function readNewUIFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('classic') === '1') return false;
  if (params.get('newui') === '1') return true;
  return null;
}

/**
 * Resolve theme: URL overrides > explicit manual toggle > time-of-day schedule.
 */
export function resolveThemePreference() {
  const fromUrl = readNewUIFromUrl();
  if (fromUrl !== null) {
    return { newUI: fromUrl, source: 'manual' };
  }

  if (readPreferenceSource() === 'manual') {
    const stored = readStoredTheme();
    if (stored !== null) {
      return { newUI: stored, source: 'manual' };
    }
  }

  return { newUI: isDarkThemeBySchedule(), source: 'auto' };
}

const NewUIContext = createContext({
  newUI: false,
  setNewUI: () => {},
  toggleNewUI: () => {},
  themeSource: 'auto',
});

export function NewUIProvider({ children }) {
  const [newUI, setNewUIState] = useState(() => {
    if (typeof window === 'undefined') return false;
    return resolveThemePreference().newUI;
  });

  const [themeSource, setThemeSource] = useState(() => {
    if (typeof window === 'undefined') return 'auto';
    return resolveThemePreference().source;
  });

  const applyTheme = useCallback((isNewUI, source) => {
    setNewUIState(isNewUI);
    setThemeSource(source);
    applyThemeToDom(isNewUI);
    persistTheme(isNewUI, source);
  }, []);

  const setNewUI = useCallback(
    (value) => {
      applyTheme(Boolean(value), 'manual');
    },
    [applyTheme],
  );

  const toggleNewUI = useCallback(() => {
    applyTheme(!newUI, 'manual');
  }, [applyTheme, newUI]);

  useEffect(() => {
    applyThemeToDom(newUI);
    syncThemeColorMeta(newUI);
  }, [newUI]);

  useEffect(() => {
    if (readPreferenceSource() === 'manual') return;
    const scheduled = isDarkThemeBySchedule();
    applyTheme(scheduled, 'auto');
  }, [applyTheme]);

  useEffect(() => {
    const syncSchedule = () => {
      if (readPreferenceSource() !== 'auto') return;
      const scheduled = isDarkThemeBySchedule();
      setNewUIState((current) => {
        if (current === scheduled) return current;
        setThemeSource('auto');
        applyThemeToDom(scheduled);
        persistTheme(scheduled, 'auto');
        return scheduled;
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncSchedule();
    };

    const intervalId = window.setInterval(syncSchedule, SCHEDULE_CHECK_MS);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <NewUIContext.Provider value={{ newUI, setNewUI, toggleNewUI, themeSource }}>
      {children}
    </NewUIContext.Provider>
  );
}

export function useNewUI() {
  return useContext(NewUIContext);
}
