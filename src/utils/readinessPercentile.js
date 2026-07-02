/**
 * Deterministic percentile-ahead estimate from a readiness score (0–100).
 * Used on results screens and share cards — stable for a given score.
 */
export function percentileAheadFromScore(score) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  if (s >= 85) return Math.min(92, 78 + Math.round((s - 85) * 0.9));
  if (s >= 70) return 62 + Math.round((s - 70) * 1.1);
  if (s >= 50) return 38 + Math.round((s - 50) * 1.2);
  return Math.max(12, Math.round(s * 0.75));
}
