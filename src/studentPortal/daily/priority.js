/**
 * Priority Engine: deterministic, deterministic decision of what to focus on today.
 *
 * Rules (in order):
 * 1. Confidence-first for Rebuild track: first visible win inside 4 days
 * 2. Binding constraint: the pillar holding back the next gate
 * 3. Unfinished slate: if yesterday's slate has open slots
 * 4. Coverage: next priority topic from slate selector
 *
 * Never returns: "you're bad at everything". Always returns: "here's one thing to do."
 */

/**
 * Determine today's priority topic (or pillar).
 *
 * @param {object} opts - {
 *   mode: 'rebuild' | 'build' | 'optimize',
 *   readiness: {overall, pillars{}, gates[]},
 *   topicMastery: {topic_id → mastery},
 *   ledger: coverage ledger,
 *   dayInPlan: day number (1-45),
 *   daysWithoutImprovement: count,
 *   recentFocus: topic_ids from last 7 days
 * }
 * @returns {object} {
 *   type: 'pillar' | 'topic' | 'gate',
 *   target: 'aptitude' | topic_id,
 *   reason: why this was chosen,
 *   urgency: 'critical' | 'high' | 'medium' | 'low'
 * }
 */
export function decidePriority({
  mode = 'build',
  readiness = {},
  topicMastery = {},
  ledger = {},
  dayInPlan = 1,
  daysWithoutImprovement = 0,
  recentFocus = [],
} = {}) {
  // Rule 1: Rebuild confidence-first (days 1-4, no red numbers)
  if (mode === 'rebuild' && dayInPlan <= 4) {
    const highestConfidenceWeak = findHighestConfidenceWeak(readiness, topicMastery);
    if (highestConfidenceWeak) {
      return {
        type: 'topic',
        target: highestConfidenceWeak.topic_id,
        reason: `Building confidence in ${highestConfidenceWeak.pillar}. You can improve this fast.`,
        urgency: 'high',
      };
    }
  }

  // Rule 2: Binding constraint (what's holding back the next gate?)
  const bindingConstraint = findBindingConstraint(readiness, topicMastery, ledger);
  if (bindingConstraint) {
    return {
      type: 'pillar',
      target: bindingConstraint.pillar,
      reason: `${bindingConstraint.pillar} is blocking your next company gate. Close this gap.`,
      urgency: bindingConstraint.urgency,
    };
  }

  // Rule 3: Unfinished business (yesterday's carryover)
  // This is handled by missionResolver, not here

  // Rule 4: Coverage (next topic from standard priority)
  const nextTopic = getNextCoverageTopic(topicMastery, ledger, recentFocus);
  if (nextTopic) {
    return {
      type: 'topic',
      target: nextTopic.id,
      reason: nextTopic.reason,
      urgency: 'medium',
    };
  }

  // Fallback (shouldn't happen)
  return {
    type: 'pillar',
    target: 'aptitude',
    reason: 'Start with fundamentals.',
    urgency: 'medium',
  };
}

/**
 * For Rebuild track: find the easiest pillar to make progress on.
 * Returns topic from a pillar where:
 * - Has at least one attempt (measured)
 * - Below L3 (room to improve)
 * - Shortest distance to next level
 */
function findHighestConfidenceWeak(readiness, topicMastery) {
  const measured = Object.entries(readiness.pillars || {})
    .filter(([, pillar]) => pillar.hasData)
    .map(([name, pillar]) => ({ name, score: pillar.score, attempts: pillar.attempts }));

  if (measured.length === 0) return null;

  // Sort by: lowest level first, then by confidence (attempts)
  measured.sort((a, b) => {
    // Prefer lower score (more room to improve)
    if (a.score !== b.score) return a.score - b.score;
    // Tie-break by more attempts (higher confidence)
    return b.attempts - a.attempts;
  });

  // Find a topic in the lowest-scoring pillar
  const weakestPillar = measured[0].name;
  const topicsInPillar = Object.entries(topicMastery)
    .filter(([, m]) => m && getTopicPillar(m.topic_id) === weakestPillar)
    .map(([id, m]) => ({
      topic_id: id,
      level: getMaxLevel(m),
      pillar: weakestPillar,
    }))
    .filter((t) => t.level < 3 && t.level > 0); // Measured but below L3

  if (topicsInPillar.length > 0) {
    topicsInPillar.sort((a, b) => a.level - b.level); // Weakest first
    return topicsInPillar[0];
  }

  return null;
}

/**
 * Find which pillar is blocking the next company gate.
 * Returns: {pillar, gap, urgency}
 */
function findBindingConstraint(readiness, topicMastery, ledger) {
  if (!readiness.gates || readiness.gates.length === 0) return null;

  // Find the next unclearer gate
  const nextGate = readiness.gates.find((g) => !g.cleared);
  if (!nextGate) return null; // All gates cleared

  if (!nextGate.binding_constraint) return null;

  const { pillar, gap } = nextGate.binding_constraint;

  // Urgency based on gap size
  let urgency = 'medium';
  if (gap >= 10) urgency = 'high';
  if (gap >= 15) urgency = 'critical';

  return {
    pillar,
    gap,
    gate: nextGate.company,
    urgency,
  };
}

/**
 * Find the next topic to tackle based on coverage and mastery.
 * Prioritizes: RETRY (below L3) → NEW (never tested) → VERIFY (L3+ spaced review)
 */
function getNextCoverageTopic(topicMastery, ledger, recentFocus) {
  // Build candidate list: topics below L3 mastery, not recently focused
  const candidates = Object.entries(topicMastery)
    .filter(([id, m]) => {
      if (!m) return false;
      if (recentFocus.includes(id)) return false; // Skip recently focused
      const level = getMaxLevel(m);
      return level < 3; // RETRY: below L3
    })
    .map(([id, m]) => ({
      id,
      level: getMaxLevel(m),
      lastAttempt: getRecentAttempt(m),
    }))
    .sort((a, b) => {
      // Sort by: lowest level, then oldest attempt
      if (a.level !== b.level) return a.level - b.level;
      if (a.lastAttempt !== b.lastAttempt) return a.lastAttempt - b.lastAttempt;
      return 0;
    });

  if (candidates.length > 0) {
    const topic = candidates[0];
    return {
      id: topic.id,
      reason: `Back to ${topic.id} — let's get it to L3.`,
    };
  }

  // Fallback to NEW topics
  const newTopics = Object.keys(ledger.tested || {})
    .filter((id) => !ledger.tested[id] && !recentFocus.includes(id))
    .slice(0, 1);

  if (newTopics.length > 0) {
    return {
      id: newTopics[0],
      reason: `New topic: ${newTopics[0]}. Let's test it.`,
    };
  }

  return null;
}

/**
 * Get max level across all modalities for a topic.
 */
function getMaxLevel(mastery) {
  if (!mastery || !mastery.modalities) return 0;
  return Math.max(
    mastery.modalities.recognition?.level || 0,
    mastery.modalities.application?.level || 0,
    mastery.modalities.explanation?.level || 0
  );
}

/**
 * Get the most recent attempt date (as days ago).
 */
function getRecentAttempt(mastery) {
  if (!mastery || !mastery.modalities) return 999;
  const dates = [
    mastery.modalities.recognition?.lastAttemptAt,
    mastery.modalities.application?.lastAttemptAt,
    mastery.modalities.explanation?.lastAttemptAt,
  ].filter(Boolean);

  if (dates.length === 0) return 999;

  const latest = new Date(Math.max(...dates.map((d) => new Date(d).getTime())));
  const today = new Date();
  return Math.floor((today - latest) / (24 * 60 * 60 * 1000));
}

/**
 * Extract pillar from topic_id (rough heuristic).
 * E.g., "apt.quant.ratios" → "aptitude"
 */
function getTopicPillar(topicId) {
  const prefix = topicId?.split('.')[0] || '';
  const pillarMap = {
    apt: 'aptitude',
    code: 'coding',
    tech: 'technical',
    comm: 'communication',
    res: 'resume',
    hr: 'hr',
  };
  return pillarMap[prefix] || 'aptitude';
}

/**
 * Validate that priority decision is sensible.
 * Used for testing and debugging.
 */
export function validatePriority(priority, readiness, mode) {
  const errors = [];

  // Rebuild mode shouldn't recommend red numbers
  if (mode === 'rebuild' && readiness.pillars) {
    const targetPillar = readiness.pillars[priority.target];
    if (targetPillar && targetPillar.score < 40) {
      errors.push(`Rebuild mode should not recommend pillar below 40 (got ${targetPillar.score})`);
    }
  }

  // Binding constraint should be unmeasured or below target
  if (priority.type === 'pillar') {
    const targetPillar = readiness.pillars?.[priority.target];
    if (targetPillar && targetPillar.hasData && targetPillar.score > 75) {
      errors.push(
        `Binding constraint pillar should be weak (${priority.target} is ${targetPillar.score})`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
