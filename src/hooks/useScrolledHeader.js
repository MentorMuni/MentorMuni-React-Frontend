import { useEffect, useState } from 'react';

/**
 * Scroll state for sticky header chrome.
 * Hysteresis (enter > exit) avoids flicker when the user hovers near the threshold.
 *
 * @param {number | { enter?: number; exit?: number }} options
 *   enter — px scrolled before switching to "scrolled"
 *   exit  — px scrolled before switching back to "at top"
 */
export function useScrolledHeader(options = 48) {
  const { enter, exit } =
    typeof options === 'number'
      ? { enter: options, exit: Math.max(8, Math.floor(options * 0.35)) }
      : {
          enter: options.enter ?? 48,
          exit: options.exit ?? 16,
        };

  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > enter : false,
  );

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > enter) return true;
        if (prev && y < exit) return false;
        return prev;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enter, exit]);

  return scrolled;
}
