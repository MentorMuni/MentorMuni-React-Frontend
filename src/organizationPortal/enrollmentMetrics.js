/**
 * Roster vs analytics counts — ACTIVE students feed performance; roster includes more.
 */

/** @param {object[]} students @param {number} pendingCount */
export function computeRosterCounts(students = [], pendingCount = 0) {
  let active = 0;
  let invited = 0;
  let blocked = 0;

  for (const s of students) {
    const auth = String(s.authStatus || '').toLowerCase();
    const status = String(s.status || '').toLowerCase();

    if (auth === 'blocked' || auth === 'disabled' || status === 'blocked') {
      blocked += 1;
    } else if (auth === 'needs_password' || status === 'invited') {
      invited += 1;
    } else if (auth === 'ready' || status === 'active') {
      active += 1;
    } else {
      active += 1;
    }
  }

  const rosterTotal = students.length;
  const pipelineTotal = rosterTotal + pendingCount;

  return {
    active,
    invited,
    blocked,
    pending: pendingCount,
    rosterTotal,
    pipelineTotal,
  };
}
