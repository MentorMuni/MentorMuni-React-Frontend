/** Score tier label for hero preview card */
export function getHeroScoreTier(score) {
  if (score >= 76) return { label: 'Strong baseline', tone: 'high' };
  if (score >= 68) return { label: 'Building momentum', tone: 'mid' };
  return { label: 'Clear focus area', tone: 'focus' };
}

export const HERO_RING_SIZE = 140;
export const HERO_RING_STROKE = 11;

export function heroRingMetrics(size = HERO_RING_SIZE, stroke = HERO_RING_STROKE) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return { size, stroke, r, circ, cx: size / 2, cy: size / 2 };
}
