import { useCallback, useEffect, useState } from 'react';
import { HERO_GAP_OPTIONS } from '../../utils/heroScorePreview';

const GAP_MS = 2800;

export function useHeroGapRotation(initialGap, reduceMotion = false) {
  const [activeGap, setActiveGap] = useState(initialGap);

  const advanceGap = useCallback(() => {
    setActiveGap((prev) => {
      const index = HERO_GAP_OPTIONS.findIndex((gap) => gap.id === prev.id);
      const next = index >= 0 ? (index + 1) % HERO_GAP_OPTIONS.length : 0;
      return HERO_GAP_OPTIONS[next];
    });
  }, []);

  useEffect(() => {
    setActiveGap(initialGap);
  }, [initialGap]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(advanceGap, GAP_MS);
    return () => window.clearInterval(id);
  }, [advanceGap, reduceMotion]);

  return { activeGap, advanceGap };
}
