/**
 * Build a tool session object consumed by Snap / Readiness / Voice / Resume.
 * Portal side-effects are opt-in via source / lockMode — embeds stay clean.
 *
 * Note: practice / roadmap helpers live under studentPortal; only portal
 * lockModes call them. Prefer widgets/adapters/portalHandlers from portal pages.
 */

import { completePlanAction } from '../studentPortal/knowMe/knowMeApi';
import {
  finishPracticeRun,
  goToPortalReturn,
  guardPracticeEntry,
  submitJourneyMissionResult,
  submitRoadmapResult,
} from '../studentPortal/roadmap/completeAndReturn';
import { getStudentSession } from '../studentPortal/auth';
import { markMissionTaskDone } from '../studentPortal/companyPrep';
import { recordStudentSession } from '../studentPortal/streak';

/**
 * @param {object} opts
 * @param {string} opts.toolCode
 * @param {string} [opts.mode]
 * @param {string} [opts.skill]
 * @param {'roadmap'|'practice'|'company-prep'|'journey'|'embed'|'standalone'|'coding'} [opts.source]
 * @param {'full'|'minimal'|'none'} [opts.chrome]
 * @param {'none'|'practice-daily'|'roadmap-sequential'} [opts.lockMode]
 * @param {string} [opts.returnTo]
 * @param {(payload: { toolCode: string, result: object }) => void|Promise<void>} [opts.onComplete]
 * @param {() => void} [opts.onCancel]
 * @param {(err: { message: string, status?: number }) => void} [opts.onError]
 * @param {(to: string) => void} [opts.navigate]
 */
export function createToolSession(opts = {}) {
  const toolCode = opts.toolCode || '';
  const mode = opts.mode || '';
  const skill = opts.skill || '';
  const source = opts.source || 'embed';
  const chrome = opts.chrome || 'none';
  const lockMode =
    opts.lockMode ||
    (source === 'practice'
      ? 'practice-daily'
      : source === 'roadmap'
        ? 'roadmap-sequential'
        : 'none');
  const returnTo = opts.returnTo || '';
  const onComplete = opts.onComplete;
  const onCancel = opts.onCancel;
  const onError = opts.onError;
  const navigate = opts.navigate;

  const fromPractice = source === 'practice';
  const fromRoadmap = source === 'roadmap';
  const fromCompanyPrep = source === 'company-prep';
  const fromJourney = source === 'journey';
  const fromCoding = source === 'coding';
  const fromFearToFearless = source === 'fear-to-fearless';
  const fromPortal =
    fromPractice || fromRoadmap || fromCompanyPrep || fromJourney || fromCoding || fromFearToFearless;
  const url =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const checkinId = opts.checkinId || url.get('checkin') || url.get('checkinId') || '';
  const fearId = opts.fearId || url.get('fear') || url.get('fearId') || '';
  const missionTaskKey = opts.missionTaskKey || url.get('mission') || '';
  const planIdRaw = opts.planId ?? url.get('plan');
  const planId =
    planIdRaw != null && planIdRaw !== '' && !Number.isNaN(Number(planIdRaw))
      ? Number(planIdRaw)
      : null;
  const topicNodes = (
    opts.topicNodes ||
    url.get('topics') ||
    ''
  )
    .toString()
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const modality = opts.modality || url.get('modality') || null;
  const prepTask = opts.prepTask || url.get('prep_task') || '';
  const prepDriveId = opts.driveId || url.get('drive') || '';
  const prepDay = opts.prepDay || url.get('prep_day') || '';
  /** Embeds / widgets should skip marketing landings the same way portal deep-links do. */
  const fromHost = fromPortal || source === 'embed';

  const launchQuery = {
    fromRoadmap,
    fromPractice,
    fromCompanyPrep,
    fromJourney,
    fromCoding,
    fromFearToFearless,
    fromPortal,
    checkinId,
    fearId,
    missionTaskKey,
    toolCode,
    mode,
  };

  return {
    toolCode,
    mode,
    skill,
    source,
    chrome,
    embedded: chrome !== 'full',
    lockMode,
    returnTo,
    fromPortal,
    fromPractice,
    fromRoadmap,
    fromCompanyPrep,
    fromJourney,
    fromCoding,
    fromFearToFearless,
    fromHost,
    launchQuery,

    guardPractice(code) {
      if (lockMode !== 'practice-daily' && !fromPractice) {
        return { blocked: false };
      }
      return guardPracticeEntry(code || toolCode);
    },

    async persistResult({ toolCode: code, result } = {}) {
      const payload = {
        toolCode: code || toolCode,
        result: result || {},
      };

      if (typeof onComplete === 'function') {
        try {
          await onComplete(payload);
        } catch (err) {
          const message = err?.message || 'Host onComplete failed';
          onError?.({ message, status: err?.status });
          return { ok: false, status: 'error', message };
        }
      }

      if (fromFearToFearless && checkinId) {
        try {
          const ftf = await completePlanAction(checkinId, {
            fear_id: fearId,
            tool_code: payload.toolCode,
            source: 'tool',
          });
          try {
            sessionStorage.setItem(
              'mm-ftf-score-delta',
              JSON.stringify({
                before: ftf.severity_before,
                after: ftf.fear_factor ?? ftf.severity_after,
              })
            );
          } catch {
            /* ignore */
          }
          const dropped =
            ftf.severity_before != null &&
            ftf.fear_factor != null &&
            ftf.severity_before !== ftf.fear_factor;
          return {
            ok: true,
            status: 'saved',
            fearToFearless: ftf,
            message: ftf.already_recorded
              ? 'Already counted on this plan. Redo anytime — the score already moved.'
              : dropped
                ? `Fear factor ${ftf.severity_before} → ${ftf.fear_factor}. Back to your plan.`
                : 'Saved to your Fear → Fearless plan.',
          };
        } catch (err) {
          const message = err?.message || 'Could not update your fear factor.';
          onError?.({ message, status: err?.status });
          return { ok: false, status: 'error', message };
        }
      }

      // Journey missions: tick Today + log attempt — never overwrite Week-1 roadmap.
      if (fromJourney) {
        const session = getStudentSession();
        const userKey = session?.id || session?.email || 'anon';
        return submitJourneyMissionResult({
          toolCode: payload.toolCode,
          result: payload.result,
          missionTaskKey,
          userKey,
          planId,
          topicNodes,
          modality,
        });
      }

      // Company prep: mark local daily mission on finish — not on Start, and not Week-1 roadmap.
      if (fromCompanyPrep) {
        const session = getStudentSession();
        const userKey = session?.id || session?.email || 'anon';
        if (prepTask && prepDriveId) {
          try {
            markMissionTaskDone(
              userKey,
              prepDriveId,
              prepDay || 1,
              prepTask
            );
            recordStudentSession(userKey);
          } catch (err) {
            console.error('Company prep tick failed', err);
          }
        }
        return {
          ok: true,
          status: 'saved',
          message: 'Counted for today’s company prep mission.',
        };
      }

      // Always try to persist to roadmap when authenticated so HOD/TPO see scores
      // (practice daily lock is additive — not a substitute for org analytics).
      let roadmapOutcome = null;
      if (
        lockMode === 'roadmap-sequential' ||
        fromRoadmap ||
        fromPractice ||
        fromCoding
      ) {
        roadmapOutcome = await submitRoadmapResult(payload);
      }

      if (lockMode === 'practice-daily' || fromPractice) {
        finishPracticeRun(payload.toolCode);
        if (roadmapOutcome && !roadmapOutcome.ok) {
          return {
            ...roadmapOutcome,
            status: 'error',
            message:
              roadmapOutcome.message ||
              'Counted for today, but roadmap save failed — retry to update your branch dashboard.',
          };
        }
        return {
          ok: true,
          status: 'saved',
          message: 'Counted for today and saved to your readiness record.',
          roadmap: roadmapOutcome?.roadmap,
        };
      }

      if (roadmapOutcome) {
        return {
          ...roadmapOutcome,
          status: roadmapOutcome.ok ? 'saved' : 'error',
        };
      }

      return { ok: true, status: onComplete ? 'saved' : 'idle', message: '' };
    },

    returnHome() {
      // Prefer returnTo so complete navigation is not tied to onCancel.
      if (returnTo) {
        if (typeof navigate === 'function') navigate(returnTo);
        else if (typeof window !== 'undefined') window.location.assign(returnTo);
        return;
      }
      if (fromPortal) {
        goToPortalReturn(navigate, launchQuery);
        return;
      }
      if (typeof onCancel === 'function') {
        onCancel();
      }
    },
  };
}
