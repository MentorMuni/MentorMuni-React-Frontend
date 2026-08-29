import { useEffect, useState } from 'react';

/**
 * Re-render auth gates when the user uses Back/Forward or restores a tab,
 * so a cleared session cannot briefly show protected UI.
 */
export function useAuthGateRerender() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    window.addEventListener('popstate', bump);
    window.addEventListener('pageshow', bump);
    window.addEventListener('focus', bump);
    document.addEventListener('visibilitychange', bump);
    return () => {
      window.removeEventListener('popstate', bump);
      window.removeEventListener('pageshow', bump);
      window.removeEventListener('focus', bump);
      document.removeEventListener('visibilitychange', bump);
    };
  }, []);
}
