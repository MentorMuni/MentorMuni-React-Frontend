/** Wall-clock helpers for timed skill / live / project / HR voice mocks. */

export const DEFAULT_DURATION_MINUTES = 20;
export const MIN_DURATION_MINUTES = 8;
export const MAX_DURATION_MINUTES = 60;

const MODE_DURATION = {
  skill: 20,
  projects: 20,
  live: 20,
  hr: 20,
};

export function clampDurationMinutes(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_DURATION_MINUTES;
  return Math.max(MIN_DURATION_MINUTES, Math.min(MAX_DURATION_MINUTES, Math.round(n)));
}

/**
 * Resolve duration from query, catalog minutes, or mode default.
 * @param {{ minutes?: number|string, toolMinutes?: number, modeId?: string }} opts
 */
export function resolveDurationMinutes({ minutes, toolMinutes, modeId } = {}) {
  const fromQuery = Number(minutes);
  if (Number.isFinite(fromQuery) && fromQuery >= MIN_DURATION_MINUTES && fromQuery <= MAX_DURATION_MINUTES) {
    return Math.round(fromQuery);
  }
  if (Number.isFinite(Number(toolMinutes)) && Number(toolMinutes) > 0) {
    return clampDurationMinutes(toolMinutes);
  }
  return MODE_DURATION[modeId] || DEFAULT_DURATION_MINUTES;
}

export const DEFAULT_TIMEBOX = {
  wrap_up_remaining_seconds: 120,
  no_answer_nudge_seconds: 40,
  no_answer_close_seconds: 75,
  target_question_count: 6,
};

export function normalizeTimebox(raw, durationMinutes = DEFAULT_DURATION_MINUTES) {
  const d = clampDurationMinutes(durationMinutes);
  const fallback = {
    ...DEFAULT_TIMEBOX,
    wrap_up_remaining_seconds: d >= 20 ? 120 : 90,
    no_answer_nudge_seconds: d <= 12 ? 30 : d <= 25 ? 40 : 45,
    no_answer_close_seconds: d <= 12 ? 58 : d <= 25 ? 75 : 90,
  };
  if (!raw || typeof raw !== 'object') return fallback;
  return {
    wrap_up_remaining_seconds: Number(raw.wrap_up_remaining_seconds) || fallback.wrap_up_remaining_seconds,
    no_answer_nudge_seconds: Number(raw.no_answer_nudge_seconds) || fallback.no_answer_nudge_seconds,
    no_answer_close_seconds: Number(raw.no_answer_close_seconds) || fallback.no_answer_close_seconds,
    target_question_count: Number(raw.target_question_count) || fallback.target_question_count,
  };
}

function clockHead(elapsedSec, durationSec) {
  const totalMin = Math.round(durationSec / 60);
  const elapsedMin = Math.max(0, Math.round(elapsedSec / 60));
  const remainMin = Math.max(0, Math.round((durationSec - elapsedSec) / 60));
  return (
    `[INTERNAL CLOCK — do not read aloud] Elapsed ${elapsedMin} of ${totalMin} minutes. ` +
    `Remaining about ${remainMin} minutes.`
  );
}

/**
 * @param {'tick'|'wrap'|'close'|'nudge'|'no_answer_close'} kind
 * @param {{ elapsedSec?: number, durationSec?: number, roundKind?: 'hr'|'technical' }} [opts]
 */
export function clockCueText(kind, { elapsedSec, durationSec, roundKind } = {}) {
  const head = clockHead(elapsedSec || 0, durationSec || 20 * 60);
  const nextQ = roundKind === 'hr' ? 'HR question' : 'technical question';
  const stay = roundKind === 'hr' ? 'Stay on HR topics only. Do not ask anything technical.' : 'Stay in the current phase.';
  switch (kind) {
    case 'wrap':
      return `${head} BEGIN WRAP-UP. Finish the current topic. Invite at most one candidate question if time remains. Then deliver the professional close. Do not start a new ${nextQ}. Do not mention the clock.`;
    case 'close':
      return `${head} BEGIN CLOSING NOW. Time is up. Deliver the professional close immediately. Set INTERVIEW_STATUS = COMPLETED. Do not mention the clock.`;
    case 'nudge':
      return `${head} NO-ANSWER NUDGE. The candidate has been silent after your question. Say once: "Take a moment if you need it. Whenever you're ready, go ahead." Then STOP. Do not give hints. Do not ask a new question. Do not mention the clock.`;
    case 'no_answer_close':
      return `${head} NO-ANSWER CLOSE. The candidate is not answering. Close professionally: thank them, say you will stop here, wish them well. INTERVIEW_STATUS = COMPLETED. STOP. Do not mention the clock.`;
    default:
      return `${head} ${stay} Do not mention the clock.`;
  }
}
