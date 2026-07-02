const STORAGE_KEY = 'mm_leaderboard_optins';

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} id
 * @property {number} readinessScore
 * @property {string} college
 * @property {string} [branch]
 * @property {string} segment — prefinal | final_year | professional
 * @property {string} optedInAt — ISO timestamp
 */

/** @returns {LeaderboardEntry[]} */
export function getLeaderboardOptIns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @param {Omit<LeaderboardEntry, 'id' | 'optedInAt'>} entry
 */
export function addLeaderboardOptIn(entry) {
  const list = getLeaderboardOptIns();
  const id = `lb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const next = [
    ...list.filter((e) => e.id !== id),
    {
      ...entry,
      id,
      optedInAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return id;
}

/** Average readiness score by college name (case-insensitive). */
export function averageScoreByCollege(college) {
  const q = college.trim().toLowerCase();
  if (!q) return null;
  const matches = getLeaderboardOptIns().filter((e) => e.college?.toLowerCase().includes(q));
  if (!matches.length) return null;
  const sum = matches.reduce((acc, e) => acc + e.readinessScore, 0);
  return Math.round(sum / matches.length);
}
