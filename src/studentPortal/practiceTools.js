import { WEEK1_STEPS } from './roadmap/week1Steps';

/**
 * Practice catalog — same core MentorMuni tools as Week 1,
 * but all available (not sequential). Each may run once per day.
 */
export const PRACTICE_TOOLS = WEEK1_STEPS.map((step) => {
  const url = new URL(step.href, 'http://local');
  url.searchParams.set('from', 'practice');
  url.searchParams.set('tool', step.tool_code);
  return {
    tool_code: step.tool_code,
    order: step.order,
    title: step.title,
    minutes: step.minutes,
    blurb: practiceBlurb(step.tool_code),
    href: `${url.pathname}?${url.searchParams.toString()}`,
  };
});

function practiceBlurb(code) {
  switch (code) {
    case '5_sec':
      return 'Quick pulse check on placement readiness.';
    case 'aptitude':
      return 'Timed aptitude drill for campus drives.';
    case 'skill_readiness':
      return 'Score your core technical skills.';
    case 'skill_mock':
      return 'Voice mock focused on one skill area.';
    case 'project_mock':
      return 'Defend your projects in a live voice round.';
    case 'interview_readiness':
      return 'Full interview readiness assessment.';
    case 'interview_mock':
      return 'End-to-end technical interview simulation.';
    case 'hr_mock':
      return 'HR / behavioral voice interview practice.';
    default:
      return 'Practice once today, then come back tomorrow.';
  }
}
