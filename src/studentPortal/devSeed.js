/**
 * ─────────────────────────────────────────────────────────────────
 *  TEMPORARY — DEV PREVIEW SEED.  Safe to delete.
 *
 *  To remove entirely:
 *    1. delete this file
 *    2. delete the `import.meta.env.DEV` block at the bottom of
 *       src/studentPortal/StudentPortalApp.jsx
 *  Nothing else references it.
 * ─────────────────────────────────────────────────────────────────
 *
 *  Fills the localStorage stores the demo session already reads from,
 *  so Home / Practice / Progress / Company Prep / Profile can all be
 *  reviewed with realistic content.
 *
 *  This writes DATA ONLY. No component has sample content baked into
 *  it — pull the seed and every page falls back to its real empty
 *  state, which is the point.
 *
 *  Usage (browser console, dev server only):
 *    mmSeed()          full — 8/8 baseline, 90-day plan, 12-day streak
 *    mmSeed('mid')     mid-baseline — 3/8 scored, no plan
 *    mmSeed('fresh')   brand-new student — nothing completed
 *    mmSeed('done')    baseline finished, plan not generated yet
 *    mmSeedClear()     wipe the seed and sign out
 *
 *  Or append ?seed=full | mid | fresh | done to any portal URL.
 */

import { ROADMAP_STORAGE_KEY, PLAN_STORAGE_KEY, WEEK1_STEPS } from './roadmap/week1Steps';
import { studentToolPath } from './paths';

const USER_KEY = 'demo_student';

const KEYS = {
  session: 'mm-student-session',
  token: 'mm-student-token',
  roadmap: ROADMAP_STORAGE_KEY,
  plan: PLAN_STORAGE_KEY,
  streak: `mm-student-streak-v1:${USER_KEY}`,
  practice: `mm-student-practice-daily-v1:${USER_KEY}`,
  companyPrep: `mm-student-company-prep-v1:${USER_KEY}`,
  topics: 'mm-student-progress-topics-v1',
  celebrated: `mm-student-baseline-celebrated:${USER_KEY}`,
};

/* ── Per-tool results ──────────────────────────────────────────── */

const RESULTS = {
  '5_sec': {
    score: 58,
    label: 'Needs polish',
    strengths: ['Clear contact block', 'One page, no clutter'],
    weaknesses: ['Resume formatting', 'Weak opening summary'],
    recommendations: ['Resume: lead with impact, not responsibilities'],
  },
  aptitude: {
    score: 54,
    strengths: ['Number series', 'Percentages'],
    weaknesses: ['Time and work', 'Data interpretation'],
    recommendations: ['Aptitude: 20 timed time-and-work sets this week'],
  },
  skill_readiness: {
    score: 71,
    strengths: ['Java fundamentals', 'OOP concepts', 'Collections'],
    weaknesses: ['SQL joins', 'Normalisation'],
    recommendations: ['SQL: practise multi-table joins daily'],
  },
  skill_mock: {
    score: 63,
    technical: 66,
    communication: 59,
    strengths: ['Correct approach on first attempt'],
    weaknesses: ['Thinks silently before answering'],
    recommendations: ['Narrate your approach before you code'],
  },
  project_mock: {
    score: 69,
    technical: 72,
    communication: 65,
    strengths: ['Knows own codebase well', 'Honest about trade-offs'],
    weaknesses: ['Vague on scale and testing'],
    recommendations: ['Prepare numbers for your project: users, data, latency'],
  },
  interview_readiness: {
    score: 49,
    strengths: ['Good role awareness'],
    weaknesses: ['STAR structure', 'Rambling answers'],
    recommendations: ['Interview: script 5 STAR answers and time them'],
  },
  interview_mock: {
    score: 61,
    technical: 64,
    communication: 57,
    strengths: ['Recovers well after a wrong answer'],
    weaknesses: ['Filler words under pressure'],
    recommendations: ['Record one answer daily and cut the filler'],
  },
  hr_mock: {
    score: 74,
    technical: null,
    communication: 74,
    strengths: ['Clear articulation', 'Genuine motivation'],
    weaknesses: ['Salary question handling'],
    recommendations: ['Prepare a calm answer on expected CTC'],
  },
};

/* ── Builders ──────────────────────────────────────────────────── */

function dayKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(11, 30, 0, 0);
  return d.toISOString();
}

function buildRoadmap(doneCount) {
  const steps = WEEK1_STEPS.map((meta, i) => {
    const done = i < doneCount;
    const r = RESULTS[meta.tool_code] || {};
    return {
      ...meta,
      status: done ? 'done' : i === doneCount ? 'current' : 'locked',
      score: done ? r.score ?? null : null,
      label: done ? r.label ?? null : null,
      technical_score: done ? r.technical ?? null : null,
      communication_score: done ? r.communication ?? null : null,
      strengths: done ? r.strengths || [] : [],
      weaknesses: done ? r.weaknesses || [] : [],
      recommendations: done ? r.recommendations || [] : [],
      // Spread completions backwards so the profile shows a real history
      // rather than eight assessments all dated today.
      completed_at: done ? isoDaysAgo((doneCount - i) * 2) : null,
    };
  });

  return {
    week_number: 1,
    week_status: doneCount >= WEEK1_STEPS.length ? 'done' : 'in_progress',
    completed_count: doneCount,
    total_count: WEEK1_STEPS.length,
    current_tool_code: doneCount < WEEK1_STEPS.length ? WEEK1_STEPS[doneCount].tool_code : null,
    plan_available: false,
    plan_status: null,
    steps,
  };
}

function buildPlan() {
  const prepWeek = (n, theme, weaknesses, daily) => ({
    prep_week: n,
    theme,
    based_on_weaknesses: weaknesses,
    daily,
  });

  return {
    id: 9001,
    status: 'ready',
    prompt_version: 'dev_seed_v1',
    model: 'sample',
    summary:
      'Aptitude speed and SQL joins are the two things holding your readiness back. Six weeks closing those, then mocks only.',
    error_message: null,
    created_at: isoDaysAgo(1),
    completed_at: isoDaysAgo(1),
    plan: {
      baseline_summary: 'Strong on core Java and HR communication; weakest on aptitude timing and SQL.',
      phases: [
        {
          phase_id: 'prep',
          weeks: [
            prepWeek(1, 'Aptitude speed', ['Time and work', 'Data interpretation'], [
              { day: 1, minutes: 45, tasks: ['20 timed time-and-work problems'], tool_href: studentToolPath('aptitude', { from: 'journey' }) },
              { day: 2, minutes: 40, tasks: ['Data interpretation: 3 sets, 12 min each'], tool_href: null },
              { day: 3, minutes: 35, tasks: ['Review every wrong answer, write the rule'], tool_href: null },
            ]),
            prepWeek(2, 'SQL joins and normalisation', ['SQL joins', 'Normalisation'], [
              { day: 8, minutes: 50, tasks: ['15 multi-table join queries'], tool_href: studentToolPath('skill_mock', { from: 'journey', skill: 'sql' }) },
              { day: 9, minutes: 45, tasks: ['Normalise a messy schema to 3NF'], tool_href: null },
            ]),
            prepWeek(3, 'Answer structure', ['STAR structure', 'Rambling answers'], [
              { day: 15, minutes: 45, tasks: ['Script 5 STAR answers', 'Time each to 90 seconds'], tool_href: studentToolPath('hr_mock', { from: 'journey' }) },
            ]),
          ],
        },
        {
          phase_id: 'mocks',
          weeks: [
            { mock_week: 1, theme: 'Technical mocks', based_on_weaknesses: ['Thinks silently before answering'],
              daily: [{ day: 43, minutes: 45, tasks: ['Two technical rounds, narrate throughout'], tool_href: studentToolPath('skill_mock', { from: 'journey' }) }] },
            { mock_week: 2, theme: 'HR and project defence', based_on_weaknesses: ['Vague on scale and testing'],
              daily: [{ day: 50, minutes: 40, tasks: ['Project deep-dive with numbers ready'], tool_href: studentToolPath('project_mock', { from: 'journey' }) }] },
          ],
        },
      ],
    },
  };
}

/** A believable attendance pattern: mostly-daily with one missed day. */
function buildStreak(consecutiveDays) {
  const sessionsByDay = {};
  if (consecutiveDays > 0) {
    for (let i = 0; i < consecutiveDays; i += 1) {
      sessionsByDay[dayKey(-i)] = i === 0 ? 2 : 1;
    }
    // A gap further back, so the week strip is not a solid block.
    sessionsByDay[dayKey(-(consecutiveDays + 1))] = 1;
  }
  return {
    consecutiveDays,
    lastActiveDay: consecutiveDays > 0 ? dayKey(0) : null,
    sessionsByDay,
  };
}

function buildTopics() {
  return {
    coach_summary:
      'Two blockers: aptitude timing and SQL joins. Everything else is within reach of the placement bar.',
    focus_order: ['aptitude', 'skills', 'interview'],
    learning_topics: {
      aptitude: [
        { topic: 'Time and work', why: 'Lowest sub-score and it appears in almost every drive.', nearby: 'Pipes and cisterns', priority: 1, suggested_minutes: 45 },
        { topic: 'Data interpretation speed', why: 'Accuracy is fine; you run out of time.', nearby: 'Percentages', priority: 2, suggested_minutes: 40 },
      ],
      skills: [
        { topic: 'SQL joins', why: 'Flagged in skill readiness and asked in every service-company round.', nearby: 'Group by / having', priority: 1, suggested_minutes: 60 },
        { topic: 'Database normalisation', why: 'Follows directly from joins.', nearby: 'Indexing basics', priority: 2, suggested_minutes: 45 },
      ],
      interview: [
        { topic: 'STAR-structured answers', why: 'Interview readiness scored 49% — structure, not content.', nearby: 'Project storytelling', priority: 1, suggested_minutes: 45 },
      ],
    },
    prompt_version: 'dev_seed_v1',
    model: 'sample',
    status: 'ready',
    error_message: null,
  };
}

/* ── Presets ───────────────────────────────────────────────────── */

const PRESETS = {
  fresh: { done: 0, plan: false, streak: 0, practice: false, prep: false, topics: false },
  mid: { done: 3, plan: false, streak: 4, practice: true, prep: false, topics: false },
  done: { done: 8, plan: false, streak: 9, practice: true, prep: true, topics: true },
  full: { done: 8, plan: true, streak: 12, practice: true, prep: true, topics: true },
};

function ensureSession() {
  if (localStorage.getItem(KEYS.session) && localStorage.getItem(KEYS.token)) return;
  localStorage.setItem(KEYS.token, `demo.student.${Date.now()}`);
  localStorage.setItem(
    KEYS.session,
    JSON.stringify({
      id: USER_KEY,
      name: 'Ananya Rao',
      email: 'ananya.rao@demo.edu',
      username: 'CSE2024A01',
      college_id: 'CSE2024A01',
      role: 'STUDENT',
      organization_id: 'DEMO',
      organization_name: 'Demo Institute of Technology',
      organization_code: 'DEMO',
      department_name: 'Computer Science',
      year: 3,
      mustChangePassword: false,
      demo: true,
      loggedInAt: new Date().toISOString(),
    })
  );
}

export function seedStudentDemo(presetName = 'full') {
  const preset = PRESETS[presetName];
  if (!preset) {
    console.warn(`[mmSeed] unknown preset "${presetName}". Use: ${Object.keys(PRESETS).join(', ')}`);
    return null;
  }

  ensureSession();

  localStorage.setItem(KEYS.roadmap, JSON.stringify(buildRoadmap(preset.done)));

  if (preset.plan) {
    const plan = buildPlan();
    localStorage.setItem(KEYS.plan, JSON.stringify(plan));
    const roadmap = JSON.parse(localStorage.getItem(KEYS.roadmap));
    roadmap.plan_available = true;
    roadmap.plan_status = 'ready';
    localStorage.setItem(KEYS.roadmap, JSON.stringify(roadmap));
  } else {
    localStorage.removeItem(KEYS.plan);
  }

  localStorage.setItem(KEYS.streak, JSON.stringify(buildStreak(preset.streak)));

  // Two practice tools already used today, so the daily lock is visible.
  localStorage.setItem(
    KEYS.practice,
    JSON.stringify(preset.practice ? { usedByDay: { aptitude: dayKey(0), hr_mock: dayKey(0) } } : { usedByDay: {} })
  );

  // Company prep: started 4 days ago, 3 of 5 tasks done today.
  localStorage.setItem(
    KEYS.companyPrep,
    JSON.stringify(
      preset.prep
        ? {
            drives: {
              'demo-accenture': {
                startedOn: dayKey(-3),
                lastActiveDay: dayKey(0),
                completedByDay: {
                  4: { aptitude_5: dayKey(0), sql_challenge: dayKey(0), hr_speak: dayKey(0) },
                },
              },
            },
          }
        : { drives: {} }
    )
  );

  if (preset.topics) localStorage.setItem(KEYS.topics, JSON.stringify(buildTopics()));
  else localStorage.removeItem(KEYS.topics);

  // Suppress the baseline confetti so it doesn't fire on every reload.
  localStorage.setItem(KEYS.celebrated, '1');

  console.info(
    `[mmSeed] "${presetName}" seeded — ${preset.done}/8 baseline, plan ${preset.plan ? 'ready' : 'none'}, ${preset.streak}-day streak. Reloading…`
  );
  setTimeout(() => window.location.reload(), 60);
  return preset;
}

export function clearStudentDemo() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  console.info('[mmSeed] cleared. Reloading…');
  setTimeout(() => window.location.reload(), 60);
}

/** Installs the console helpers and handles ?seed=… */
export function installDevSeed() {
  if (typeof window === 'undefined') return;

  window.mmSeed = seedStudentDemo;
  window.mmSeedClear = clearStudentDemo;

  const requested = new URLSearchParams(window.location.search).get('seed');
  if (requested) {
    // Strip the param first so the reload does not loop.
    const url = new URL(window.location.href);
    url.searchParams.delete('seed');
    window.history.replaceState({}, '', url);
    seedStudentDemo(requested === 'true' ? 'full' : requested);
    return;
  }

  console.info(
    '%c[mmSeed]%c dev preview data — mmSeed() · mmSeed("mid") · mmSeed("fresh") · mmSeed("done") · mmSeedClear()',
    'color:#17b6d4;font-weight:700',
    'color:inherit'
  );
}
