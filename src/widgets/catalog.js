/**
 * Canonical MentorMuni assessment / mock tools.
 * Hosts pick a tool id and render <MmToolWidget tool="…" /> — no portal coupling required.
 */

export const TOOL_IDS = Object.freeze({
  SNAP: '5_sec',
  APTITUDE: 'aptitude',
  SKILL_READINESS: 'skill_readiness',
  INTERVIEW_READINESS: 'interview_readiness',
  SKILL_MOCK: 'skill_mock',
  PROJECT_MOCK: 'project_mock',
  INTERVIEW_MOCK: 'interview_mock',
  HR_MOCK: 'hr_mock',
  RESUME_ATS: 'resume_ats',
});

/**
 * @type {Record<string, {
 *   id: string,
 *   title: string,
 *   family: 'snap' | 'readiness' | 'voice' | 'resume',
 *   minutes?: number,
 *   mode?: string,
 *   description?: string,
 * }>}
 */
export const TOOL_CATALOG = Object.freeze({
  [TOOL_IDS.SNAP]: {
    id: TOOL_IDS.SNAP,
    title: '5-sec snap test',
    family: 'snap',
    minutes: 5,
    description: 'Six-tap placement readiness radar',
  },
  [TOOL_IDS.APTITUDE]: {
    id: TOOL_IDS.APTITUDE,
    title: 'Aptitude readiness',
    family: 'readiness',
    mode: 'aptitude',
    minutes: 20,
    description: 'Quantitative, logical, and verbal screening prep',
  },
  [TOOL_IDS.SKILL_READINESS]: {
    id: TOOL_IDS.SKILL_READINESS,
    title: 'Skill readiness',
    family: 'readiness',
    mode: 'skill',
    minutes: 25,
    description: 'Deep prep quiz on one skill stack',
  },
  [TOOL_IDS.INTERVIEW_READINESS]: {
    id: TOOL_IDS.INTERVIEW_READINESS,
    title: 'Interview readiness',
    family: 'readiness',
    mode: 'placement',
    minutes: 25,
    description: 'Broad engineering interview readiness check',
  },
  [TOOL_IDS.SKILL_MOCK]: {
    id: TOOL_IDS.SKILL_MOCK,
    title: 'Skill AI mock interview',
    family: 'voice',
    mode: 'skill',
    minutes: 45,
    description: 'Live voice round focused on one skill',
  },
  [TOOL_IDS.PROJECT_MOCK]: {
    id: TOOL_IDS.PROJECT_MOCK,
    title: 'Project AI mock interview',
    family: 'voice',
    mode: 'projects',
    minutes: 45,
    description: 'Walk through projects, decisions, and trade-offs',
  },
  [TOOL_IDS.INTERVIEW_MOCK]: {
    id: TOOL_IDS.INTERVIEW_MOCK,
    title: 'Interview AI mock',
    family: 'voice',
    mode: 'live',
    minutes: 45,
    description: 'Full live technical + communication round',
  },
  [TOOL_IDS.HR_MOCK]: {
    id: TOOL_IDS.HR_MOCK,
    title: 'HR AI mock interview',
    family: 'voice',
    mode: 'hr',
    minutes: 30,
    description: 'Behavioral / STAR / culture-fit round',
  },
  [TOOL_IDS.RESUME_ATS]: {
    id: TOOL_IDS.RESUME_ATS,
    title: 'Resume ATS checker',
    family: 'resume',
    minutes: 5,
    description: 'ATS score and keyword gaps for a target role',
  },
});

export const TOOL_LIST = Object.freeze(Object.values(TOOL_CATALOG));

export function getToolMeta(toolId) {
  return TOOL_CATALOG[toolId] || null;
}

export function resolveToolMode(toolId, modeOverride) {
  if (modeOverride) return modeOverride;
  return TOOL_CATALOG[toolId]?.mode || '';
}
