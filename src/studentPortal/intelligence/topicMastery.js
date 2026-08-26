/**
 * Topic Mastery Model: tracks a student's progress on each topic × modality combination.
 *
 * Three modalities (independent axes):
 * - Recognition: can pick the right answer (MCQ, aptitude, skill_readiness, interview_readiness)
 * - Application: can build/code with it (coding, pseudocode)
 * - Explanation: can defend it aloud (skill_mock, project_mock, interview_mock, hr_mock)
 *
 * Four levels (same for all modalities):
 * - L1 Seen: attempted, never graded
 * - L2 Passing: ≥60% accuracy
 * - L3 Solid: ≥75% accuracy within time
 * - L4 Drive-ready: ≥85% within time, 2 consecutive
 */

export const MODALITIES = ['recognition', 'application', 'explanation'];
export const LEVELS = [
  { level: 1, name: 'Seen', bar: 'attempted' },
  { level: 2, name: 'Passing', bar: '60%', minAccuracy: 0.6 },
  { level: 3, name: 'Solid', bar: '75% within time', minAccuracy: 0.75 },
  { level: 4, name: 'Drive-ready', bar: '85% 2x', minAccuracy: 0.85 },
];

/**
 * Initialize mastery state for a topic across all modalities.
 */
export function initTopicMastery(topicId) {
  return {
    topic_id: topicId,
    modalities: {
      recognition: { level: 0, lastAttemptAt: null, consecutivePasses: 0, attempts: 0 },
      application: { level: 0, lastAttemptAt: null, consecutivePasses: 0, attempts: 0 },
      explanation: { level: 0, lastAttemptAt: null, consecutivePasses: 0, attempts: 0 },
    },
    assessedAt: null,
    nextReviewAt: null, // Spaced repetition: when to ask again
  };
}

/**
 * Update mastery based on an attempt result.
 * @param {object} mastery - current mastery state
 * @param {string} modality - 'recognition' | 'application' | 'explanation'
 * @param {number} accuracy - 0..1
 * @param {boolean} withinTime - whether the attempt was completed within time limit
 * @param {string} attemptedAt - ISO date string
 * @returns {object} updated mastery state
 */
export function updateMastery(mastery, { modality, accuracy, withinTime, attemptedAt }) {
  if (!MODALITIES.includes(modality)) {
    throw new Error(`Invalid modality: ${modality}`);
  }

  const state = mastery.modalities[modality];
  const oldLevel = state.level;

  state.attempts += 1;
  state.lastAttemptAt = attemptedAt;

  const passed = accuracy >= 0.6;

  if (passed) {
    // Check level progression rules
    let newLevel = oldLevel;

    if (oldLevel === 0) {
      // First attempt: move to L2 if passes
      newLevel = 2;
      state.consecutivePasses = 1;
    } else if (oldLevel === 1) {
      // L1 → L2 requires a pass
      newLevel = 2;
      state.consecutivePasses = 1;
    } else if (oldLevel === 2) {
      // L2 → L3 requires L3-bar (75% within time)
      if (accuracy >= 0.75 && withinTime) {
        newLevel = 3;
        state.consecutivePasses = 1;
      } else {
        state.consecutivePasses += 1;
      }
    } else if (oldLevel === 3) {
      // L3 → L4 requires 2 consecutive L3+ (85% within time)
      if (accuracy >= 0.85 && withinTime) {
        state.consecutivePasses += 1;
        if (state.consecutivePasses >= 2) {
          newLevel = 4;
        }
      } else {
        state.consecutivePasses = 0;
      }
    } else if (oldLevel === 4) {
      // L4: stay L4 on success, drop to L3 on failure
      state.consecutivePasses += 1;
    }

    state.level = newLevel;
  } else {
    // Failure: drop level, reset consecutive passes
    if (oldLevel === 0) {
      state.level = 1; // Seen
    } else if (oldLevel === 1) {
      state.level = 1; // Stay
    } else if (oldLevel === 2) {
      state.level = 2; // Stay
    } else if (oldLevel >= 3) {
      // Drop L3+ back to L2 on failure
      state.level = Math.max(2, oldLevel - 1);
    }
    state.consecutivePasses = 0;
  }

  mastery.assessedAt = attemptedAt;
  return mastery;
}

/**
 * Determine overall mastery on a topic (verdict across all three modalities).
 * Modalities must be measured independently; a topic is "known" only when all
 * modalities that are measured reach L3+.
 */
export function topicVerdict(mastery) {
  const { recognition, application, explanation } = mastery.modalities;

  // Count measured (L1+) and high (L3+) by modality
  const measured = {
    recognition: recognition.level >= 1,
    application: application.level >= 1,
    explanation: explanation.level >= 1,
  };

  const highLevel = {
    recognition: recognition.level >= 3,
    application: application.level >= 3,
    explanation: explanation.level >= 3,
  };

  // Verdict logic:
  // - If no modalities measured yet: "Not Started"
  // - If all measured are L3+: "Mastered"
  // - If any measured is L3+: "Partial" (some but not all at L3+)
  // - Otherwise: "Struggling" (measured but below L3)

  const isMeasured = Object.values(measured).some((m) => m);
  if (!isMeasured) return 'not_started';

  const allMeasuredHighLevel = Object.values(measured)
    .filter((m) => m)
    .every((m, i) => Object.values(highLevel)[i]);

  if (allMeasuredHighLevel) return 'mastered';

  const anyHighLevel = Object.values(highLevel).some((h) => h);
  if (anyHighLevel) return 'partial';

  return 'struggling';
}

/**
 * Get the binding constraint for a topic (which modality is holding it back).
 * Used to prioritize which modality to practice next.
 */
export function getBindingConstraint(mastery) {
  const { recognition, application, explanation } = mastery.modalities;

  // If any modality is measured and below L3, it's a constraint
  const constraints = [];
  if (recognition.level >= 1 && recognition.level < 3)
    constraints.push({ modality: 'recognition', level: recognition.level });
  if (application.level >= 1 && application.level < 3)
    constraints.push({ modality: 'application', level: application.level });
  if (explanation.level >= 1 && explanation.level < 3)
    constraints.push({ modality: 'explanation', level: explanation.level });

  // If no constraints, return null (topic is mastered or not yet started)
  if (constraints.length === 0) return null;

  // Return the weakest constraint (lowest level, or if tied, explanation > application > recognition)
  const weakest = constraints.reduce((min, c) => {
    if (c.level < min.level) return c;
    if (c.level === min.level) {
      const priority = { explanation: 3, application: 2, recognition: 1 };
      if (priority[c.modality] > priority[min.modality]) return c;
    }
    return min;
  });

  return weakest;
}

/**
 * Decide if a topic is due for a Spaced Repetition (Leitner) review.
 * Uses a simple box system: L3 reviewed every 7 days, L4 every 14 days.
 */
export function isDueForReview(mastery, today) {
  if (!mastery.nextReviewAt) {
    // First time through: schedule based on level
    const maxLevel = Math.max(
      mastery.modalities.recognition.level,
      mastery.modalities.application.level,
      mastery.modalities.explanation.level
    );
    if (maxLevel < 3) return false; // Only review L3+
    return true; // Due immediately for first review
  }

  return new Date(mastery.nextReviewAt) <= new Date(today);
}

/**
 * Schedule the next review date based on current mastery level.
 */
export function scheduleNextReview(mastery, today) {
  const maxLevel = Math.max(
    mastery.modalities.recognition.level,
    mastery.modalities.application.level,
    mastery.modalities.explanation.level
  );

  const dayOffset = maxLevel === 4 ? 14 : maxLevel === 3 ? 7 : 3;
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + dayOffset);

  mastery.nextReviewAt = nextDate.toISOString().split('T')[0];
  return mastery;
}
