/**
 * Placement profile — onboarding choices + band-aware copy.
 * Server target lives in student_target; local profile tracks onboarding UX state.
 */

import { readinessBand } from './profileApi';

const PROFILE_KEY = 'mm-student-placement-profile-v1';

export const TARGET_TIERS = [
  {
    id: 'mass_recruiter',
    label: 'Campus / mass recruiters',
    hint: 'TCS, Infosys, Wipro, Accenture',
  },
  {
    id: 'product',
    label: 'Product companies',
    hint: 'Microsoft, Amazon, startups',
  },
];

export const STARTING_LEVELS = [
  {
    id: 'beginner',
    label: 'Starting fresh',
    hint: 'No mocks yet — start with basics',
  },
  {
    id: 'some_experience',
    label: 'Some prep done',
    hint: 'A few tests or one campus drive',
  },
  {
    id: 'strong_coding',
    label: 'Strong in coding',
    hint: 'DSA is fine — focus on mocks & HR',
  },
];

export const COMPANY_OPTIONS = [
  'TCS',
  'Infosys',
  'Wipro',
  'Accenture',
  'Capgemini',
  'Persistent',
  'Microsoft',
  'Amazon',
  'Cognizant',
  'HCL',
];

const GAP_TOOL_PATTERNS = [
  [/aptitude|quant|reasoning|logical/i, 'aptitude'],
  [/coding|dsa|algorithm|leetcode/i, 'coding'],
  [/communication|english|verbal|spoken/i, 'hr_mock'],
  [/hr|behavio|tell me about yourself/i, 'hr_mock'],
  [/project|defend/i, 'project_mock'],
  [/interview(?! readiness)/i, 'interview_mock'],
  [/skill|technical|core/i, 'skill_mock'],
  [/resume|ats|cv/i, 'skill_readiness'],
];

function storeKey(userKey) {
  return `${PROFILE_KEY}:${userKey || 'anon'}`;
}

export function getPlacementProfile(userKey = 'anon') {
  try {
    const raw = localStorage.getItem(storeKey(userKey));
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

export function savePlacementProfile(userKey, patch = {}) {
  const prev = getPlacementProfile(userKey) || {};
  const next = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(storeKey(userKey), JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return next;
}

export function needsPlacementOnboarding(userKey = 'anon') {
  const profile = getPlacementProfile(userKey);
  return !profile?.completedAt;
}

/** Band-aware hero line — overrides generic copy when readiness exists. */
export function bandHomeCopy(bandKey, { baselineDone = false, weakest = null, planReady = false } = {}) {
  const gap = weakest ? String(weakest).toLowerCase() : null;

  switch (bandKey) {
    case 'ready':
      return planReady
        ? 'You’re drive-ready — today is about maintaining edge with company-style mocks.'
        : 'You’re placement-ready. Polish with targeted mocks before your next drive.';
    case 'approaching':
      return gap
        ? `Interview mode — close ${gap} today; mocks matter more than theory now.`
        : 'Interview mode — mocks and communication practice move the needle fastest now.';
    case 'building':
      return gap
        ? `You’re climbing — today’s mission targets ${gap}, your biggest gap.`
        : 'You’re building momentum — finish today’s mission to push readiness up.';
    case 'early':
      return baselineDone
        ? 'Foundation phase — small daily wins beat cramming before drives.'
        : 'Foundation week — one baseline check at a time maps your real strengths.';
    default:
      return null;
  }
}

export function resolveBand(readiness) {
  return readinessBand(readiness == null ? null : Number(readiness));
}

/** Map a weakness label from analysis → Week-1 / practice tool code. */
export function inferToolForGap(label) {
  const text = String(label || '').trim();
  if (!text) return 'aptitude';
  for (const [pattern, code] of GAP_TOOL_PATTERNS) {
    if (pattern.test(text)) return code;
  }
  return 'skill_mock';
}

/** Pillar code from readiness API → practice tool. */
export function pillarToToolCode(pillar) {
  const key = String(pillar || '').toLowerCase();
  const map = {
    aptitude: 'aptitude',
    coding: 'coding',
    technical: 'skill_readiness',
    communication: 'hr_mock',
    hr: 'hr_mock',
    skills: 'skill_mock',
    interview: 'interview_mock',
    snap: '5_sec',
    resume: 'resume_ats',
  };
  return map[key] || 'aptitude';
}
