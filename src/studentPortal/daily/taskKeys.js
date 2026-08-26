/**
 * Stable identity for a task inside an LLM-generated plan.
 *
 * `plan.plan.phases[].weeks[].daily[]` is model output and carries no ids, so
 * client and server have to derive the same key from position. `text_hash`
 * guards the obvious failure: a regenerated plan reuses `d23.1` for entirely
 * different work, and yesterday's completion silently ticks off today's task.
 * A record whose hash no longer matches the plan text is treated as stale and
 * ignored rather than trusted.
 */

/** @returns {string} e.g. `d23.1` — plan day + index within that day */
export function taskKey(day, index) {
  return `d${Number(day)}.${Number(index)}`;
}

/** @returns {{day: number, index: number}|null} */
export function parseTaskKey(key) {
  const match = /^d(\d+)\.(\d+)$/.exec(String(key || ''));
  if (!match) return null;
  return { day: Number(match[1]), index: Number(match[2]) };
}

/**
 * djb2 → base36. Not a checksum — just enough to notice that the text at
 * this position changed. Whitespace and case are normalised so a cosmetic
 * reword of the same task doesn't invalidate a real completion.
 */
export function taskTextHash(text) {
  const normalized = String(text ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  let hash = 5381;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = ((hash << 5) + hash + normalized.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36).padStart(7, '0');
}

/** Ledger namespace — completions are scoped to the plan that produced them. */
export function ledgerScope(planId) {
  return planId == null ? 'baseline' : `plan:${planId}`;
}

/** A stored record is usable only if it still describes the same task. */
export function isRecordFresh(record, expectedHash) {
  if (!record) return false;
  if (!record.text_hash || !expectedHash) return true; // pre-hash records
  return record.text_hash === expectedHash;
}
