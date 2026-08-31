import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Detects when the user leaves this browser tab (visibility hidden) and returns
 * a warning when they come back. Used during assessments and embedded tools.
 */
export function useTabChangeWarning({ enabled = true } = {}) {
  const [warning, setWarning] = useState(null);
  const blurCountRef = useRef(0);
  const wasHiddenRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') {
      setWarning(null);
      return undefined;
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        wasHiddenRef.current = true;
        return;
      }

      if (document.visibilityState === 'visible' && wasHiddenRef.current) {
        wasHiddenRef.current = false;
        blurCountRef.current += 1;
        setWarning({
          count: blurCountRef.current,
          at: Date.now(),
        });
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [enabled]);

  const dismiss = useCallback(() => setWarning(null), []);

  const reset = useCallback(() => {
    blurCountRef.current = 0;
    wasHiddenRef.current = false;
    setWarning(null);
  }, []);

  return {
    warning,
    dismiss,
    reset,
    blurCount: blurCountRef.current,
  };
}
