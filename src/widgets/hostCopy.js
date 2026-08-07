/**
 * Shared CTA / save-banner copy for tools hosted in portal or embed widgets.
 */

export function hostBackLabel(session) {
  if (!session) return null;
  if (session.fromPractice) return 'Back to Practice';
  if (session.fromCompanyPrep) return 'Back to Company Prep';
  if (session.fromJourney) return 'Back to your 90-day plan';
  if (session.fromRoadmap) return 'Back to Week 1 plan';
  if (session.source === 'embed') return 'Done';
  return null;
}

export function hostSaveStatusMessage(session, roadmapSave) {
  if (!session || !roadmapSave || roadmapSave.status === 'idle') return null;

  if (session.fromPractice) {
    return (
      roadmapSave.message ||
      'Counted for today. This practice unlocks again tomorrow.'
    );
  }

  if (session.fromRoadmap) {
    if (roadmapSave.status === 'saving') return 'Saving to your Week 1 baseline…';
    if (roadmapSave.status === 'saved') {
      return 'Saved to your baseline. The next step is unlocked on your roadmap.';
    }
    return roadmapSave.message || null;
  }

  if (session.fromCompanyPrep || session.fromJourney) {
    if (roadmapSave.status === 'saving') return 'Saving your result…';
    if (roadmapSave.status === 'saved') return roadmapSave.message || 'Result saved.';
    return roadmapSave.message || null;
  }

  if (session.source === 'embed') {
    if (roadmapSave.status === 'saving') return 'Saving result…';
    if (roadmapSave.status === 'saved') return roadmapSave.message || 'Result recorded.';
    return roadmapSave.message || null;
  }

  return roadmapSave.message || null;
}

export function showHostChrome(session) {
  return Boolean(session?.fromPortal || session?.source === 'embed');
}
