/**
 * Helpers for tools launched from Week-1 roadmap or Practice tab.
 *
 * Roadmap: ?from=roadmap&tool=…
 * Practice: ?from=practice&tool=…  (once per calendar day)
 *
 * Saving is decoupled from navigation on purpose: the student must be able to
 * read their result on the tool page before going back.
 */

import { getStudentSession, isStudentAuthenticated } from '../auth';
import { studentPaths } from '../paths';
import { completeRoadmapStep } from './roadmapApi';
import { isPracticeLockedToday, markPracticeCompleted } from '../practiceDailyLock';
import { recordStudentSession } from '../streak';

export function getRoadmapQuery(search) {
  const params = new URLSearchParams(
    search || (typeof window !== 'undefined' ? window.location.search : '')
  );
  const from = params.get('from');
  const tool = params.get('tool');
  const fromRoadmap = from === 'roadmap' && Boolean(tool);
  const fromPractice = from === 'practice' && Boolean(tool);
  const fromCompanyPrep = from === 'company-prep' && Boolean(tool);
  const fromJourney = from === 'journey' && Boolean(tool);
  return {
    fromRoadmap,
    fromPractice,
    fromCompanyPrep,
    fromJourney,
    fromPortal: fromRoadmap || fromPractice || fromCompanyPrep || fromJourney,
    toolCode: tool || '',
    mode: params.get('mode') || '',
  };
}

export function practiceUserKey() {
  const session = getStudentSession();
  return session?.id || session?.email || 'anon';
}

export function roadmapHomePath() {
  return studentPaths.home || '/studentportal/home';
}

export function practiceHomePath() {
  return studentPaths.practice || '/studentportal/practice';
}

export function companyPrepHomePath() {
  return studentPaths.companyPrep || '/studentportal/company-prep';
}

export function goToRoadmapHome(navigate) {
  const home = roadmapHomePath();
  if (typeof navigate === 'function') navigate(home);
  else if (typeof window !== 'undefined') window.location.assign(home);
}

export function goToPracticeHome(navigate) {
  const home = practiceHomePath();
  if (typeof navigate === 'function') navigate(home);
  else if (typeof window !== 'undefined') window.location.assign(home);
}

export function goToCompanyPrepHome(navigate) {
  const home = companyPrepHomePath();
  if (typeof navigate === 'function') navigate(home);
  else if (typeof window !== 'undefined') window.location.assign(home);
}

export function goToPortalReturn(navigate, launchQuery) {
  if (launchQuery?.fromCompanyPrep) goToCompanyPrepHome(navigate);
  else if (launchQuery?.fromPractice) goToPracticeHome(navigate);
  else goToRoadmapHome(navigate); // roadmap + journey → home (90-day section)
}

/**
 * If this practice tool was already completed today, block the run.
 * @returns {{ blocked: boolean, message?: string }}
 */
export function guardPracticeEntry(toolCode) {
  const userKey = practiceUserKey();
  if (!toolCode || !isPracticeLockedToday(toolCode, userKey)) {
    return { blocked: false };
  }
  return {
    blocked: true,
    message: 'You already completed this practice today. It unlocks again tomorrow.',
  };
}

/**
 * Record a finished practice run (daily lock + streak).
 */
export function finishPracticeRun(toolCode) {
  if (!toolCode) return { ok: false };
  const userKey = practiceUserKey();
  markPracticeCompleted(toolCode, userKey);
  recordStudentSession(userKey);
  return { ok: true };
}

/**
 * Persist a tool result against its roadmap step.
 *
 * @param {object} opts
 * @param {string} opts.toolCode
 * @param {object} opts.result normalized result payload
 * @returns {Promise<{ok: boolean, roadmap?: object, reason?: string, message?: string}>}
 */
export async function submitRoadmapResult({ toolCode, result }) {
  if (!toolCode) {
    return { ok: false, reason: 'no_tool', message: 'Missing roadmap step.' };
  }
  if (!isStudentAuthenticated()) {
    return {
      ok: false,
      reason: 'no_session',
      message: 'Sign in to your student account to save this to your roadmap.',
    };
  }
  try {
    const roadmap = await completeRoadmapStep(toolCode, {
      score: result?.score ?? null,
      label: result?.label ?? null,
      technical_score: result?.technical_score ?? null,
      communication_score: result?.communication_score ?? null,
      strengths: result?.strengths || [],
      weaknesses: result?.weaknesses || [],
      recommendations: result?.recommendations || [],
      raw: result?.raw || result || {},
    });
    return { ok: true, roadmap };
  } catch (err) {
    const status = err?.status;
    let message = err?.message || 'Could not save to your roadmap.';
    if (status === 409) {
      message = 'This step is still locked. Finish the current step on your roadmap first.';
    } else if (!status) {
      message = 'Network issue — your result is shown below but was not saved. Retry to save it.';
    }
    return { ok: false, reason: 'api', error: err, message };
  }
}
