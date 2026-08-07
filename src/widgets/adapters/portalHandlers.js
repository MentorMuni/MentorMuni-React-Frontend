/**
 * Optional portal adapter — use when embedding a widget inside student portal pages
 * and you still want roadmap / practice side-effects without URL query params.
 */
import { createToolSession } from '../createToolSession';

export function createPortalToolSession({
  toolCode,
  mode,
  skill,
  source = 'roadmap',
  chrome = 'none',
  returnTo,
  navigate,
  onComplete,
  onCancel,
  onError,
}) {
  return createToolSession({
    toolCode,
    mode,
    skill,
    source,
    chrome,
    lockMode:
      source === 'practice'
        ? 'practice-daily'
        : source === 'roadmap'
          ? 'roadmap-sequential'
          : 'none', // company-prep | journey | embed
    returnTo,
    navigate,
    onComplete,
    onCancel,
    onError,
  });
}
