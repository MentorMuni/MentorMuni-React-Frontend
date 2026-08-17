/** Week-1 baseline steps — mirrors backend WEEK1_STEPS. */

import { studentToolPath } from '../paths';

export const WEEK1_STEPS = [
  {
    tool_code: '5_sec',
    order: 1,
    title: '5-sec snap test',
    minutes: 5,
    href: studentToolPath('5_sec', { from: 'roadmap' }),
  },
  {
    tool_code: 'aptitude',
    order: 2,
    title: 'Aptitude readiness',
    minutes: 20,
    href: studentToolPath('aptitude', { from: 'roadmap' }),
  },
  {
    tool_code: 'skill_readiness',
    order: 3,
    title: 'Skill readiness',
    minutes: 25,
    href: studentToolPath('skill_readiness', { from: 'roadmap' }),
  },
  {
    tool_code: 'skill_mock',
    order: 4,
    title: 'Skill AI mock interview',
    minutes: 20,
    href: studentToolPath('skill_mock', { from: 'roadmap' }),
  },
  {
    tool_code: 'project_mock',
    order: 5,
    title: 'Project AI mock interview',
    minutes: 20,
    href: studentToolPath('project_mock', { from: 'roadmap' }),
  },
  {
    tool_code: 'interview_readiness',
    order: 6,
    title: 'Interview readiness',
    minutes: 25,
    href: studentToolPath('interview_readiness', { from: 'roadmap' }),
  },
  {
    tool_code: 'interview_mock',
    order: 7,
    title: 'Interview AI mock',
    minutes: 20,
    href: studentToolPath('interview_mock', { from: 'roadmap' }),
  },
  {
    tool_code: 'hr_mock',
    order: 8,
    title: 'HR AI mock interview',
    minutes: 20,
    href: studentToolPath('hr_mock', { from: 'roadmap' }),
  },
];

export const ROADMAP_STORAGE_KEY = 'mm-student-roadmap-v1';
export const PLAN_STORAGE_KEY = 'mm-student-plan-v1';
