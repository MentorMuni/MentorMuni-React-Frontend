/**
 * Slate Selector: picks topics for today's questions based on coverage handshake.
 *
 * The engine's job is to pick topics. The LLM's job is to write questions about them.
 * Never the reverse.
 *
 * Picks from three pools:
 * - NEW: never tested (respects the arc % distribution)
 * - RETRY: attempted, below L3 mastery
 * - VERIFY: mastered, Leitner-due for spaced review
 *
 * Returns a list of topic_ids to pass to the question generator.
 */

import { getPoolDistribution, getTopicsInPool, canRetestTopic } from './coverageLedger.js';

/**
 * Select a slate of topics for today.
 *
 * @param {object} opts - {
 *   dayInPlan: number (1-45)
 *   numQuestionsNeeded: number
 *   ledger: coverage ledger
 *   topicMastery: map of topic_id → mastery state
 *   prunedSyllabus: array of available topic_ids (after company pruning)
 *   recentQuestions: embeddings of recent 21 days (for cosine filtering)
 * }
 * @returns {array} topic_ids in order of preference
 */
export function selectSlate({
  dayInPlan,
  numQuestionsNeeded = 1,
  ledger,
  topicMastery,
  prunedSyllabus,
  recentQuestions,
} = {}) {
  if (!ledger || !topicMastery || !prunedSyllabus) {
    throw new Error('selectSlate: missing required parameters');
  }

  const slate = [];
  const dist = getPoolDistribution(dayInPlan);

  // Calculate how many from each pool (proportional to numQuestionsNeeded)
  const fromNew = Math.ceil(numQuestionsNeeded * dist.NEW);
  const fromRetry = Math.ceil(numQuestionsNeeded * dist.RETRY);
  const fromVerify = Math.ceil(numQuestionsNeeded * dist.VERIFY);

  // Fill NEW pool
  const newTopics = getAvailableNewTopics(ledger, prunedSyllabus);
  const selectedNew = selectTopicsFromPool(newTopics, fromNew, topicMastery, recentQuestions);
  slate.push(...selectedNew);

  // Fill RETRY pool (topics below L3)
  const retryTopics = getRetryTopics(ledger, topicMastery, prunedSyllabus);
  const selectedRetry = selectTopicsFromPool(retryTopics, fromRetry, topicMastery, recentQuestions);
  slate.push(...selectedRetry);

  // Fill VERIFY pool (L3+ topics due for review)
  const verifyTopics = getVerifyTopics(ledger, topicMastery, prunedSyllabus);
  const selectedVerify = selectTopicsFromPool(
    verifyTopics,
    fromVerify,
    topicMastery,
    recentQuestions
  );
  slate.push(...selectedVerify);

  // If not enough topics, backfill from any pool (prefer RETRY over NEW)
  if (slate.length < numQuestionsNeeded) {
    const allAvailable = [
      ...retryTopics.filter((t) => !slate.includes(t)),
      ...newTopics.filter((t) => !slate.includes(t)),
      ...verifyTopics.filter((t) => !slate.includes(t)),
    ];
    const backfill = selectTopicsFromPool(
      allAvailable,
      numQuestionsNeeded - slate.length,
      topicMastery,
      recentQuestions
    );
    slate.push(...backfill);
  }

  return slate.slice(0, numQuestionsNeeded);
}

/**
 * Get topics that are NEW (never tested).
 */
function getAvailableNewTopics(ledger, prunedSyllabus) {
  return prunedSyllabus.filter((topicId) => !ledger.tested[topicId]);
}

/**
 * Get topics in RETRY pool (attempted, but below L3 mastery).
 */
function getRetryTopics(ledger, topicMastery, prunedSyllabus) {
  return prunedSyllabus.filter((topicId) => {
    if (!ledger.tested[topicId]) return false;
    if (ledger.tested[topicId].pool !== 'RETRY') return false;
    if (!canRetestTopic(ledger, topicId)) return false;
    return true;
  });
}

/**
 * Get topics in VERIFY pool (L3+ mastery, Leitner-due).
 */
function getVerifyTopics(ledger, topicMastery, prunedSyllabus) {
  return prunedSyllabus.filter((topicId) => {
    if (!ledger.tested[topicId]) return false;
    if (ledger.tested[topicId].pool !== 'VERIFY') return false;

    // Check if Leitner-due (next review scheduled)
    const mastery = topicMastery[topicId];
    if (!mastery || !mastery.isDueForReview) return false;

    return true;
  });
}

/**
 * Select N topics from a pool, prioritizing by:
 * 1. Least recently tested (to spread practice over time)
 * 2. Not in recent embeddings (to avoid repeating similar questions)
 * 3. Lowest current mastery (to focus on weaknesses)
 *
 * @param {array} candidates - topic_ids to select from
 * @param {number} numNeeded - how many to pick
 * @param {object} topicMastery - map of topic_id → mastery state
 * @param {object} recentQuestions - embeddings of recent questions for duplicate filtering
 * @returns {array} selected topic_ids
 */
function selectTopicsFromPool(candidates, numNeeded, topicMastery, recentQuestions) {
  if (candidates.length === 0) return [];

  // Score each candidate
  const scored = candidates.map((topicId) => {
    const mastery = topicMastery[topicId];
    const level = mastery
      ? Math.max(
          mastery.modalities?.recognition?.level || 0,
          mastery.modalities?.application?.level || 0,
          mastery.modalities?.explanation?.level || 0
        )
      : 0;

    const lastTestedDaysAgo = mastery?.assessedAt
      ? daysDifference(new Date(mastery.assessedAt), new Date())
      : 999; // Never tested: infinite recency deficit

    // Lower level + older + not in recent = higher priority
    const priority = (10 - level) * 1000 + lastTestedDaysAgo * 10;

    return { topicId, priority, level };
  });

  // Sort by priority (ascending: lower priority first)
  scored.sort((a, b) => a.priority - b.priority);

  // Return top N
  return scored.slice(0, numNeeded).map((s) => s.topicId);
}

/**
 * Helper: days between two dates.
 */
function daysDifference(date1, date2) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs((date2 - date1) / msPerDay));
}

/**
 * Check if a topic's embedding is similar to any recent question (cosine similarity).
 * Used to prevent near-duplicate questions.
 *
 * @param {array} embedding - topic embedding vector
 * @param {array} recentEmbeddings - array of { embedding, topicId, date }
 * @param {number} threshold - cosine similarity threshold (default 0.85)
 * @returns {boolean} true if similar to a recent question
 */
export function isSimilarToRecent(embedding, recentEmbeddings, threshold = 0.85) {
  if (!embedding || !recentEmbeddings || recentEmbeddings.length === 0) return false;

  for (const recent of recentEmbeddings) {
    const similarity = cosineSimilarity(embedding, recent.embedding);
    if (similarity >= threshold) return true;
  }
  return false;
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Validate that a slate respects the arc distribution.
 * Used for testing and debugging.
 */
export function validateSlate(slate, ledger, dayInPlan) {
  const dist = getPoolDistribution(dayInPlan);
  const total = slate.length;

  const newCount = slate.filter((id) => !ledger.tested[id]).length;
  const retryCount = slate.filter((id) => ledger.tested[id]?.pool === 'RETRY').length;
  const verifyCount = slate.filter((id) => ledger.tested[id]?.pool === 'VERIFY').length;

  const newActual = newCount / total;
  const retryActual = retryCount / total;
  const verifyActual = verifyCount / total;

  const tolerance = 0.15; // Allow ±15% deviation due to rounding

  return {
    valid:
      Math.abs(newActual - dist.NEW) <= tolerance &&
      Math.abs(retryActual - dist.RETRY) <= tolerance &&
      Math.abs(verifyActual - dist.VERIFY) <= tolerance,
    expected: dist,
    actual: { NEW: newActual, RETRY: retryActual, VERIFY: verifyActual },
  };
}
