/**
 * Student roadmap API + localStorage fallback for demo/local fake JWTs.
 */

import { getStudentSession } from '../auth';
import { studentApi, StudentApiError } from '../studentApi';
import { PLAN_STORAGE_KEY, ROADMAP_STORAGE_KEY, WEEK1_STEPS } from './week1Steps';
import { studentToolPath, toPortalToolHref } from '../paths';

function portalizeRoadmap(roadmap) {
  if (!roadmap || !Array.isArray(roadmap.steps)) return roadmap;
  return {
    ...roadmap,
    steps: roadmap.steps.map((s) => ({
      ...s,
      href:
        studentToolPath(s.tool_code, { from: 'roadmap' }) ||
        toPortalToolHref(s.href || s.tool_href, 'roadmap') ||
        s.href,
    })),
  };
}

function portalizePlan(plan) {
  if (!plan?.plan) return plan;
  const walk = (node) => {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(walk);
    const next = { ...node };
    if (typeof next.tool_href === 'string') {
      next.tool_href = toPortalToolHref(next.tool_href, 'journey') || next.tool_href;
    }
    for (const [k, v] of Object.entries(next)) {
      if (v && typeof v === 'object') next[k] = walk(v);
    }
    return next;
  };
  return { ...plan, plan: walk(plan.plan) };
}


const PROGRESS_TOPICS_KEY = 'mm-student-progress-topics-v1';

function isLocalFallbackSession() {
  const session = getStudentSession();
  if (session?.demo || session?.localEnrollment) return true;
  return studentApi.isDemoOrLocalToken();
}

function seedLocalRoadmap() {
  return {
    week_number: 1,
    week_status: 'in_progress',
    completed_count: 0,
    total_count: WEEK1_STEPS.length,
    current_tool_code: WEEK1_STEPS[0].tool_code,
    plan_available: false,
    plan_status: null,
    steps: WEEK1_STEPS.map((s, i) => ({
      ...s,
      status: i === 0 ? 'current' : 'locked',
      score: null,
      label: null,
      technical_score: null,
      communication_score: null,
      strengths: [],
      weaknesses: [],
      recommendations: [],
      completed_at: null,
    })),
  };
}

function readLocalRoadmap() {
  try {
    const raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  const seeded = seedLocalRoadmap();
  writeLocalRoadmap(seeded);
  return seeded;
}

function writeLocalRoadmap(data) {
  try {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function readLocalPlan() {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalPlan(plan) {
  try {
    if (plan) localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
    else localStorage.removeItem(PLAN_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function localComplete(toolCode, body) {
  const roadmap = readLocalRoadmap();
  const step = roadmap.steps.find((s) => s.tool_code === toolCode);
  if (!step) throw new StudentApiError('Unknown tool', { status: 404 });
  if (step.status === 'locked') {
    throw new StudentApiError('Step is locked. Complete the current step first.', { status: 409 });
  }

  const wasCurrent = step.status === 'current';
  step.status = 'done';
  step.score = body?.score ?? null;
  step.label = body?.label ?? null;
  step.technical_score = body?.technical_score ?? null;
  step.communication_score = body?.communication_score ?? null;
  step.strengths = body?.strengths || [];
  step.weaknesses = body?.weaknesses || [];
  step.recommendations = body?.recommendations || [];
  step.completed_at = new Date().toISOString();

  if (wasCurrent) {
    const next = roadmap.steps.find((s) => s.order === step.order + 1);
    if (next) next.status = 'current';
    else {
      roadmap.week_status = 'done';
    }
  }

  roadmap.completed_count = roadmap.steps.filter((s) => s.status === 'done').length;
  roadmap.current_tool_code =
    roadmap.steps.find((s) => s.status === 'current')?.tool_code || null;
  writeLocalRoadmap(roadmap);
  return roadmap;
}

function localAnalysis() {
  const roadmap = readLocalRoadmap();
  const done = roadmap.steps.filter((s) => s.status === 'done');
  const scores_by_tool = {};
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  let tech = [];
  let comm = [];

  for (const s of done) {
    if (s.score != null) scores_by_tool[s.tool_code] = s.score;
    strengths.push(...(s.strengths || []));
    weaknesses.push(...(s.weaknesses || []));
    recommendations.push(...(s.recommendations || []));
    if (s.technical_score != null) tech.push(s.technical_score);
    if (s.communication_score != null) comm.push(s.communication_score);
  }

  const scores = Object.values(scores_by_tool);
  return {
    week_number: 1,
    week_status: roadmap.week_status,
    overall_score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    scores_by_tool,
    top_strengths: [...new Set(strengths)].slice(0, 10),
    top_weaknesses: [...new Set(weaknesses)].slice(0, 10),
    recommendations: [...new Set(recommendations)].slice(0, 12),
    voice_avg:
      tech.length || comm.length
        ? {
            technical: tech.length ? Math.round(tech.reduce((a, b) => a + b, 0) / tech.length) : null,
            communication: comm.length
              ? Math.round(comm.reduce((a, b) => a + b, 0) / comm.length)
              : null,
          }
        : null,
  };
}

/** Demo stub — not a real OpenAI plan. */
function localGenerateStub() {
  const roadmap = readLocalRoadmap();
  if (roadmap.week_status !== 'done') {
    throw new StudentApiError('Complete all Week-1 baseline steps first.', { status: 409 });
  }
  const plan = {
    id: Date.now(),
    status: 'ready',
    prompt_version: 'local_stub_v1',
    model: null,
    summary:
      'Demo account: sign in with a campus student account to generate a real OpenAI 90-day plan from your baseline.',
    plan: {
      title: '90-day MNC placement roadmap (demo stub)',
      target_role: 'Software Engineer / Graduate hire',
      target_companies: ['TCS', 'Accenture', 'Persistent', 'Microsoft'],
      baseline_summary: 'Demo baseline complete. Connect a real student account for AI personalization.',
      confidence_goal: 'Use Prep weeks for gaps, then AI mocks only.',
      phases: [
        {
          phase_id: 'prep',
          label: 'Gap-driven prep',
          day_start: 1,
          day_end: 42,
          weeks: Array.from({ length: 6 }, (_, wi) => ({
            prep_week: wi + 1,
            theme: `Prep week ${wi + 1} — close baseline gaps`,
            based_on_weaknesses: localAnalysis().top_weaknesses.slice(0, 3),
            focus_tools: ['aptitude', 'skill_readiness'],
            daily: Array.from({ length: 7 }, (__, di) => {
              const day = wi * 7 + di + 1;
              return {
                day,
                tasks: [`Practice weak topic (demo day ${day})`, 'Review yesterday mistakes'],
                minutes: 90,
              };
            }),
          })),
        },
        {
          phase_id: 'mocks',
          label: 'AI mock interview only',
          day_start: 43,
          day_end: 90,
          weeks: [
            ...Array.from({ length: 6 }, (_, wi) => ({
              mock_week: wi + 1,
              theme: `Mock week ${wi + 1}`,
              focus_tools: ['skill_mock', 'project_mock', 'interview_mock', 'hr_mock'],
              daily: Array.from({ length: 7 }, (__, di) => {
                const day = 43 + wi * 7 + di;
                const modes = ['skill', 'projects', 'live', 'hr'];
                const mode = modes[di % 4];
                return {
                  day,
                  tasks: [`1x ${mode} AI mock`, 'Review transcript gaps'],
                  minutes: 60,
                  tool_href: studentToolPath(
                    { skill: 'skill_mock', projects: 'project_mock', live: 'interview_mock', hr: 'hr_mock' }[mode] || 'interview_mock',
                    { from: 'journey' },
                  ),
                };
              }),
            })),
            {
              mock_week: 7,
              theme: 'Final mock sprint',
              focus_tools: ['interview_mock', 'hr_mock'],
              daily: Array.from({ length: 6 }, (__, di) => {
                const day = 85 + di;
                const mode = di % 2 === 0 ? 'live' : 'hr';
                return {
                  day,
                  tasks: [`1x ${mode} AI mock`, 'Note top 2 fixes'],
                  minutes: 60,
                  tool_href: studentToolPath(
                    { skill: 'skill_mock', projects: 'project_mock', live: 'interview_mock', hr: 'hr_mock' }[mode] || 'interview_mock',
                    { from: 'journey' },
                  ),
                };
              }),
            },
          ],
        },
      ],
    },
    error_message: null,
    created_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  };
  writeLocalPlan(plan);
  const rm = readLocalRoadmap();
  rm.plan_available = true;
  rm.plan_status = 'ready';
  writeLocalRoadmap(rm);
  return plan;
}

export async function fetchRoadmap() {
  if (isLocalFallbackSession()) return portalizeRoadmap(readLocalRoadmap());
  const data = await studentApi.get('/student/roadmap');
  return portalizeRoadmap(data);
}

export async function completeRoadmapStep(toolCode, body) {
  if (isLocalFallbackSession()) return portalizeRoadmap(localComplete(toolCode, body));
  const data = await studentApi.post(
    `/student/roadmap/steps/${encodeURIComponent(toolCode)}/complete`,
    body
  );
  return portalizeRoadmap(data);
}

export async function fetchAnalysis() {
  if (isLocalFallbackSession()) return localAnalysis();
  return studentApi.get('/student/roadmap/analysis');
}

export async function generatePlan() {
  if (isLocalFallbackSession()) return portalizePlan(localGenerateStub());
  const data = await studentApi.post('/student/roadmap/generate', {});
  return portalizePlan(data);
}

export async function fetchPlan(opts = {}) {
  if (isLocalFallbackSession()) {
    const plan = readLocalPlan();
    if (!plan) {
      const err = new StudentApiError('No generated plan yet.', { status: 404 });
      throw err;
    }
    return portalizePlan(plan);
  }
  const data = await studentApi.get('/student/roadmap/plan', opts);
  return portalizePlan(data);
}

function readLocalTopics() {
  try {
    const raw = localStorage.getItem(PROGRESS_TOPICS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalTopics(topics) {
  try {
    if (topics) localStorage.setItem(PROGRESS_TOPICS_KEY, JSON.stringify(topics));
    else localStorage.removeItem(PROGRESS_TOPICS_KEY);
  } catch {
    // ignore
  }
}

function localProgress() {
  const roadmap = readLocalRoadmap();
  const analysis = localAnalysis();
  const done = roadmap.steps
    .filter((s) => s.status === 'done')
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      tool_code: s.tool_code,
      title: s.title,
      order: s.order,
      score: s.score,
      label: s.label,
      strengths: s.strengths || [],
      weaknesses: s.weaknesses || [],
      completed_at: s.completed_at,
    }));
  return {
    activity: {
      week_number: roadmap.week_number,
      week_status: roadmap.week_status,
      completed_count: roadmap.completed_count,
      total_count: roadmap.total_count,
      current_tool_code: roadmap.current_tool_code,
      completed_steps: done,
    },
    analysis,
    learning_topics: readLocalTopics(),
  };
}

function localLearningTopicsStub() {
  const analysis = localAnalysis();
  if (!(Object.keys(analysis.scores_by_tool || {}).length > 0)) {
    throw new StudentApiError(
      'Complete at least one assessment or mock before generating learning topics.',
      { status: 409 }
    );
  }
  const weak = analysis.top_weaknesses[0] || 'core fundamentals';
  const topics = {
    coach_summary:
      'Demo account: topics below are a stub. Sign in with a campus student account for a live OpenAI plan from your strengths and weaknesses.',
    focus_order: ['aptitude', 'skills', 'interview'],
    learning_topics: {
      aptitude: [
        {
          topic: `Close gap: ${weak}`,
          why: 'Pulled from your recorded weaknesses (demo).',
          nearby: 'Speed + accuracy drills',
          priority: 1,
          suggested_minutes: 45,
        },
        {
          topic: 'Quantitative speed sets',
          why: 'Nearby aptitude area that usually improves drive cutoffs.',
          nearby: 'Percentages & ratios',
          priority: 2,
          suggested_minutes: 45,
        },
      ],
      skills: [
        {
          topic: 'Core topic revision from skill readiness',
          why: 'Skills pillar needs deliberate practice after baseline.',
          nearby: 'Write & explain one concept aloud',
          priority: 1,
          suggested_minutes: 60,
        },
      ],
      interview: [
        {
          topic: 'STAR answers for weak communication points',
          why: 'Interview overall improves when weak points get spoken reps.',
          nearby: 'HR intro + project deep-dive',
          priority: 1,
          suggested_minutes: 45,
        },
      ],
    },
    prompt_version: 'local_stub_v1',
    model: null,
    status: 'ready',
    error_message: null,
  };
  writeLocalTopics(topics);
  return topics;
}

export async function fetchProgress() {
  if (isLocalFallbackSession()) return localProgress();
  return studentApi.get('/student/roadmap/progress');
}

export async function generateProgressLearningTopics() {
  if (isLocalFallbackSession()) return localLearningTopicsStub();
  return studentApi.post('/student/roadmap/progress/learning-topics', {});
}

export { isLocalFallbackSession, StudentApiError };
