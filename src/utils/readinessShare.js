import { BRAND_MEME_LINE } from '../constants/brandCopy';
import { toAppAbsoluteUrl } from './appPaths';

/** Public link to start the same assessment (BrowserRouter + Vite base). */
export function getInterviewReadinessShareUrl() {
  return toAppAbsoluteUrl('/start-assessment');
}

export function buildWhatsAppChallengeMessage(pct, readinessLabel, modeLabel) {
  const url = getInterviewReadinessShareUrl();
  const product = modeLabel || 'Interview Readiness';
  return (
    `I scored ${pct}% on MentorMuni ${product} (${readinessLabel}).\n\n` +
    `Think you can beat me? Same free 5-minute quiz — no signup.\n\n` +
    `Challenge your batchmates:\n${url}\n\n` +
    BRAND_MEME_LINE
  );
}
