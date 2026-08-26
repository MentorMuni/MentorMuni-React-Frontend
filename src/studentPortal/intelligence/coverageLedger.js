/**
 * Coverage Ledger: tracks which topics have been tested and in which pool (NEW, RETRY, VERIFY).
 *
 * Handshake rule: pool distribution changes with arc progress.
 * - Week 0 / Arc A (days 1-14): 70% NEW, 25% RETRY, 5% VERIFY
 * - Arc B (days 15-29):         40% NEW, 40% RETRY, 20% VERIFY
 * - Arc C (days 30-45):         20% NEW, 40% RETRY, 40% VERIFY
 *
 * The ledger prevents the LLM from drifting to its favorite topics by enforcing
 * that a fixed percentage of each day's slate must be fresh.
 */

export const POOL_DISTRIBUTION = {
  arcA: { NEW: 0.7, RETRY: 0.25, VERIFY: 0.05 }, // Days 1-14
  arcB: { NEW: 0.4, RETRY: 0.4, VERIFY: 0.2 }, // Days 15-29
  arcC: { NEW: 0.2, RETRY: 0.4, VERIFY: 0.4 }, // Days 30-45
};

/**
 * Initialize an empty coverage ledger.
 */
export function initCoverageLedger() {
  return {
    // topic_id → { pool: 'NEW' | 'RETRY' | 'VERIFY', firstTestedAt, lastTestedAt, attempts, correct }
    tested: {},
    // Tracks which topics have entered RETRY (below L3) to prevent re-testing NEW same day
    in_retry: new Set(),
    // Tracks which topics entered VERIFY (mastered) to prevent re-entry
    in_verify: new Set(),
  };
}

/**
 * Record that a topic was tested and moved to a pool.
 */
export function recordTopicTest(ledger, topicId, pool, date, correct) {
  if (!['NEW', 'RETRY', 'VERIFY'].includes(pool)) {
    throw new Error(`Invalid pool: ${pool}`);
  }

  if (!ledger.tested[topicId]) {
    ledger.tested[topicId] = {
      pool,
      firstTestedAt: date,
      lastTestedAt: date,
      attempts: 0,
      correct: 0,
    };
  }

  const entry = ledger.tested[topicId];
  entry.lastTestedAt = date;
  entry.attempts += 1;
  entry.pool = pool;
  if (correct) entry.correct += 1;

  // Track transitions
  if (pool === 'RETRY') ledger.in_retry.add(topicId);
  if (pool === 'VERIFY') {
    ledger.in_verify.add(topicId);
    ledger.in_retry.delete(topicId);
  }

  return ledger;
}

/**
 * Get the arc (A/B/C) for a given day in the plan (1-45).
 */
export function getArc(dayInPlan) {
  if (dayInPlan <= 14) return 'arcA';
  if (dayInPlan <= 29) return 'arcB';
  return 'arcC';
}

/**
 * Get the pool distribution for a given arc.
 */
export function getPoolDistribution(dayInPlan) {
  return POOL_DISTRIBUTION[getArc(dayInPlan)];
}

/**
 * Get all topics in a specific pool.
 */
export function getTopicsInPool(ledger, pool) {
  return Object.entries(ledger.tested)
    .filter(([, entry]) => entry.pool === pool)
    .map(([topicId]) => topicId);
}

/**
 * Prune a syllabus to only topics relevant for target companies.
 * @param {object} allTopics - from syllabus/map.js::getAllTopics()
 * @param {array} companies - ['tcs_ninja', 'infosys_dse', ...]
 * @returns {array} pruned topic ids
 */
export function pruneSyllabusForCompanies(allTopics, companies) {
  if (!companies || companies.length === 0) {
    // No company specified: return all topics
    return allTopics.map((t) => t.id);
  }

  const companySet = new Set(companies.map((c) => String(c).toLowerCase()));
  return allTopics
    .filter((topic) => topic.companies.some((c) => companySet.has(String(c).toLowerCase())))
    .map((t) => t.id);
}

/**
 * Calculate coverage: what fraction of the (pruned) syllabus has been tested?
 */
export function calculateCoverage(ledger, prunedTopics) {
  if (!prunedTopics || prunedTopics.length === 0) return 0;

  const tested = prunedTopics.filter((topicId) => ledger.tested[topicId]).length;
  return tested / prunedTopics.length;
}

/**
 * Calculate required daily NEW questions to cover the entire syllabus by deadline.
 * If too many needed, signal that syllabus should be pruned.
 *
 * @param {number} topicsRemaining - count of untested topics
 * @param {number} daysRemaining - days until deadline
 * @param {number} questionsPerDay - typical questions per day
 * @returns {object} { required, enough, needsPrune }
 */
export function calculateRequiredNewPerDay(topicsRemaining, daysRemaining, questionsPerDay = 1) {
  // Simple model: need at least 1 question per topic per remaining days
  const required = Math.ceil(topicsRemaining / daysRemaining);

  return {
    required,
    enough: required <= questionsPerDay,
    needsPrune: required > questionsPerDay,
  };
}

/**
 * Record in the ledger that a topic should never re-enter NEW (transitioned to RETRY or VERIFY).
 */
export function markTopicNeverNew(ledger, topicId) {
  if (ledger.tested[topicId]) {
    ledger.tested[topicId].neverReturnToNEW = true;
  }
}

/**
 * Check if a topic can be returned to (e.g., for RETRY after forgetting).
 */
export function canRetestTopic(ledger, topicId) {
  const entry = ledger.tested[topicId];
  if (!entry) return true; // Never tested, definitely can test

  // If mastered (VERIFY), only retest on schedule (handled by spaced repetition)
  if (entry.pool === 'VERIFY') return false;

  return true; // RETRY topics can always be retested
}
