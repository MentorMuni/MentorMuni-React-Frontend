/** Score tier label for hero preview card */
export function getHeroScoreTier(score) {
  if (score >= 76) return { label: 'Good', tone: 'high' };
  if (score >= 68) return { label: 'Solid', tone: 'mid' };
  return { label: 'Building', tone: 'focus' };
}

export const HERO_ARC_WIDTH = 168;
export const HERO_ARC_HEIGHT = 96;
export const HERO_ARC_STROKE = 11;

/** Semi-circular gauge metrics (top arc, opening upward) */
export function heroArcMetrics(
  width = HERO_ARC_WIDTH,
  height = HERO_ARC_HEIGHT,
  stroke = HERO_ARC_STROKE,
) {
  const cx = width / 2;
  const cy = height - 6;
  const r = (width - stroke) / 2 - 10;
  const arcLength = Math.PI * r;
  const startX = cx - r;
  const endX = cx + r;
  const pathD = `M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`;

  return { width, height, stroke, r, arcLength, cx, cy, pathD };
}
