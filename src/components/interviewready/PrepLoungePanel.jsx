import React from 'react';
import PrepLoungeSlideFlow from './PrepLoungeSlideFlow';

const ASSESSMENT_FOCUS_APTITUDE = 'aptitude';
const ASSESSMENT_FOCUS_SKILL = 'skill';

export default function PrepLoungePanel({
  planLoading,
  evaluationPlan,
  error,
  profile,
  setProfile,
  validationErrors = {},
  setValidationErrors,
  onStartTest,
  onRetry,
  onBackEdit,
}) {
  const qCount = Array.isArray(evaluationPlan) ? evaluationPlan.length : 0;
  const ready = !planLoading && qCount > 0 && !error;
  const isPro = profile?.userCategory === 'professional';
  const mode = profile?.assessmentMode;
  const isSkillMode = mode === ASSESSMENT_FOCUS_SKILL;

  return (
    <PrepLoungeSlideFlow
      planLoading={planLoading}
      ready={ready}
      error={error}
      qCount={qCount}
      profile={profile}
      setProfile={setProfile}
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
      isPro={isPro}
      mode={mode}
      isSkillMode={isSkillMode}
      onStartTest={onStartTest}
      onRetry={onRetry}
      onBackEdit={onBackEdit}
    />
  );
}
