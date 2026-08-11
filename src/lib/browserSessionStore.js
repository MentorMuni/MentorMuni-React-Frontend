/**
 * Auth credentials that must die when the browser closes.
 * Theme prefs and campus demo data stay in localStorage.
 */
export function createBrowserSessionStore(keys) {
  const list = Array.isArray(keys) ? keys : [keys];

  function store() {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  }

  function dropLegacy() {
    try {
      list.forEach((key) => localStorage.removeItem(key));
    } catch {
      // ignore
    }
  }

  return {
    get(key) {
      dropLegacy();
      try {
        return store()?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      dropLegacy();
      try {
        const s = store();
        if (!s) return;
        if (value == null || value === '') s.removeItem(key);
        else s.setItem(key, String(value));
      } catch {
        // ignore
      }
    },
    remove(key) {
      dropLegacy();
      try {
        store()?.removeItem(key);
      } catch {
        // ignore
      }
    },
    clearAll() {
      dropLegacy();
      try {
        const s = store();
        list.forEach((key) => s?.removeItem(key));
      } catch {
        // ignore
      }
    },
  };
}
