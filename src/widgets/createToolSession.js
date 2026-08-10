/**
 * Build a tool session object consumed by Snap / Readiness / Voice / Resume.
 * Portal side-effects are opt-in via source / lockMode — embeds stay clean.
 *
 * Note: practice / roadmap helpers live under studentPortal; only portal
 * lockModes call them. Prefer widgets/adapters/portalHandlers from portal pages.
 */

import {
  finishPracticeRun,
  goToPortalReturn,
  guardPracticeEntry,
  submitRoadmapResult,
} from '../studentPortal/roadmap/completeAndReturn';

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
  const fromPortal = fromPractice || fromRoadmap || fromCompanyPrep || fromJourney || fromCoding;
  /** Embeds / widgets should skip marketing landings the same way portal deep-links do. */
  const fromHost = fromPortal || source === 'embed';

  const launchQuery = {
    fromRoadmap,
    fromPractice,
    fromCompanyPrep,
    fromJourney,
    fromCoding,
    fromPortal,
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

      // Always try to persist to roadmap when authenticated so HOD/TPO see scores
      // (practice daily lock is additive — not a substitute for org analytics).
      let roadmapOutcome = null;
      if (
        lockMode === 'roadmap-sequential' ||
        fromRoadmap ||
        fromJourney ||
        fromPractice ||
        fromCompanyPrep
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
