import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'mm-new-ui';

const NewUIContext = createContext({
  newUI: false,
  setNewUI: () => {},
  toggleNewUI: () => {},
});

function readNewUIFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('classic') === '1') return false;
  if (params.get('newui') === '1') return true;
  return null;
}

export function NewUIProvider({ children }) {
  const [newUI, setNewUI] = useState(() => {
    if (typeof window === 'undefined') return false;
    const fromUrl = readNewUIFromUrl();
    if (fromUrl !== null) return fromUrl;
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (newUI) root.classList.add('mm-new-ui');
    else root.classList.remove('mm-new-ui');
    try {
      localStorage.setItem(STORAGE_KEY, newUI ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [newUI]);

  const toggleNewUI = () => setNewUI((v) => !v);

  return (
    <NewUIContext.Provider value={{ newUI, setNewUI, toggleNewUI }}>
      {children}
    </NewUIContext.Provider>
  );
}

export function useNewUI() {
  return useContext(NewUIContext);
}
