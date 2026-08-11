import { studentPaths, studentToolPath } from '../paths';

const CANONICAL_TOOL = {
  ai_hr_mock: 'hr_mock',
  hr_mock: 'hr_mock',
  communication_mock: 'hr_mock',
  voice_interview: 'hr_mock',
  interview_mock: 'interview_mock',
  mock_interview: 'interview_mock',
  ai_interview: 'interview_mock',
  skill_interview: 'skill_mock',
  project_mock: 'project_mock',
  skill_readiness: 'skill_readiness',
  skill_mock: 'skill_mock',
  aptitude: 'aptitude',
  coding: 'coding',
  coding_round: 'coding',
  dsa: 'coding',
};

const PORTAL_PAGE = {
  practice: studentPaths.practice,
  mentor: studentPaths.mentor,
  companies: studentPaths.companies,
  company_prep: studentPaths.companyPrep,
  home: studentPaths.home,
};

export function canonicalToolCode(code) {
  const key = String(code || '').toLowerCase().replace(/[\s-]+/g, '_');
  return CANONICAL_TOOL[key] || key;
}

export function isScoreableTool(code) {
  return Boolean(CANONICAL_TOOL[String(code || '').toLowerCase().replace(/[\s-]+/g, '_')]);
}

const TOOL_LABEL = {
  ai_hr_mock: 'AI HR mock',
  hr_mock: 'AI HR mock',
  communication_mock: 'Speaking practice',
  voice_interview: 'AI Mentor',
  interview_mock: 'Mock interview',
  mock_interview: 'Mock interview',
  ai_interview: 'AI interview',
  skill_interview: 'Skill interview',
  project_mock: 'Project mock',
  skill_readiness: 'Skill check',
  skill_mock: 'Skill mock',
  aptitude: 'Aptitude test',
  coding: 'Coding Round',
  coding_round: 'Coding Round',
  dsa: 'Coding Round',
  practice: 'Practice',
  mentor: 'AI Mentor',
  companies: 'Companies',
  company_prep: 'Company Prep',
  home: 'Home',
};

export function toolHref(code, { checkinId, fearId } = {}) {
  const key = String(code || '').toLowerCase().replace(/[\s-]+/g, '_');
  const canonical = CANONICAL_TOOL[key];
  if (canonical) {
    return studentToolPath(canonical, {
      from: 'fear-to-fearless',
      checkinId,
      fearId,
    });
  }
  const page = PORTAL_PAGE[key];
  if (!page) return null;
  if (!checkinId) return page;
  const params = new URLSearchParams({
    from: 'fear-to-fearless',
    checkin: String(checkinId),
  });
  if (fearId) params.set('fear', String(fearId));
  return `${page}?${params.toString()}`;
}

export function toolLabel(code) {
  const key = String(code || '').toLowerCase().replace(/[\s-]+/g, '_');
  return TOOL_LABEL[key] || '';
}

function fearKind(name) {
  const n = String(name || '').toLowerCase();
  if (/cod(e|ing)|dsa|leetcode|hackerrank/.test(n)) return 'coding';
  if (/project|explain|portfolio/.test(n)) return 'project';
  if (/english|speak|hr|introduc|communicat|filler/.test(n)) return 'speak';
  if (/solution|copy|cheat|own/.test(n)) return 'own';
  if (/aptitude|quant|lr/.test(n)) return 'aptitude';
  return 'general';
}

/** Student-facing week when the API only stored a stub. */
export function fallbackWeek(fearName) {
  const kind = fearKind(fearName);
  const plans = {
    coding: {
      theme: 'Make coding feel smaller',
      introduction: 'One honest problem a day beats binge-watching solutions.',
      weekly_metric: 'You can explain one problem you solved yourself',
      days: [
        { action: 'Open Coding Round and try 1 easy problem without looking up the answer first.', tool: 'coding', metric: 'You attempted it yourself' },
        { action: 'Re-solve yesterday’s problem out loud, as if an interviewer is watching.', tool: 'coding', metric: 'You can say the approach in 60 seconds' },
        { action: 'Do a 15-minute Practice drill on the topic that blocked you.', tool: 'practice', metric: 'One concept feels less foggy' },
        { action: 'Write 4 lines: problem, approach, bug you hit, what you would do next.', tool: 'home', metric: 'A note you can reuse in interviews' },
        { action: 'Ask AI Mentor to grill you on that same problem — no new topic.', tool: 'mentor', metric: 'You survive follow-up questions' },
      ],
    },
    project: {
      theme: 'Own your project story',
      introduction: 'Interviewers don’t want a demo dump. They want you to own one decision.',
      weekly_metric: 'A 90-second project story you can say without notes',
      days: [
        { action: 'Write: problem → what you built → one hard decision → result.', tool: 'home', metric: 'Story fits on one page' },
        { action: 'Run a Project mock and tell only that story.', tool: 'project_mock', metric: 'You finish under 2 minutes' },
        { action: 'Ask AI Mentor “why this approach, not the other one?” and answer out loud.', tool: 'mentor', metric: 'You have a real “why”' },
        { action: 'Record yourself once. Note filler words. Do it again, 20% shorter.', tool: 'project_mock', metric: 'Second take is cleaner' },
        { action: 'Pick one company and map your story to their role.', tool: 'company_prep', metric: 'One sentence that fits that company' },
      ],
    },
    speak: {
      theme: 'Warm up your voice, not your resume',
      introduction: 'Speaking fear shrinks when the first 30 seconds feel familiar.',
      weekly_metric: 'A calm 30-second introduction',
      days: [
        { action: 'Write a 4-line intro: name, year, one strength, one thing you’re practising.', tool: 'home', metric: 'You can say it without reading' },
        { action: 'Do one AI HR mock — only the introduction.', tool: 'hr_mock', metric: 'You finish without freezing' },
        { action: 'Repeat the intro slower. Cut one filler word you noticed.', tool: 'hr_mock', metric: 'Second take has fewer ums' },
        { action: 'Ask AI Mentor one follow-up: “Tell me about yourself.” Answer again.', tool: 'mentor', metric: 'You recover if they interrupt' },
        { action: 'Say the intro to a friend or the mirror once. That’s the win.', tool: 'home', metric: 'You did it with a human in mind' },
      ],
    },
    own: {
      theme: 'Solve one thing yourself',
      introduction: 'Copying solutions feels safe. One self-solved problem rebuilds trust in you.',
      weekly_metric: 'One problem you can teach without opening notes',
      days: [
        { action: 'Pick one easy problem. Hide solutions. Spend 20 minutes stuck on purpose.', tool: 'coding', metric: 'You stayed with it' },
        { action: 'Write the approach in plain English before any code.', tool: 'home', metric: 'A 5-line plan exists' },
        { action: 'Code only from that plan. If you peek, note where — then close it again.', tool: 'coding', metric: 'You know what you needed help on' },
        { action: 'Explain the solution to AI Mentor as if they never saw the problem.', tool: 'mentor', metric: 'They can follow you' },
        { action: 'Re-solve it from scratch tomorrow morning. No notes for the first 5 minutes.', tool: 'coding', metric: 'You remember the shape' },
      ],
    },
    aptitude: {
      theme: 'Accuracy over speed',
      introduction: 'Fear of aptitude is usually “I rush and blank.” We slow week 1 down.',
      weekly_metric: 'One timed set you finish without panic-skipping',
      days: [
        { action: 'Take a short Aptitude set. Stop when you guess — mark it, don’t spiral.', tool: 'aptitude', metric: 'You know which type hurt' },
        { action: 'Redo only the wrong type, untimed.', tool: 'practice', metric: 'One pattern clicks' },
        { action: 'Do 10 questions with a timer, but allow yourself to skip 2.', tool: 'aptitude', metric: 'You chose skips on purpose' },
        { action: 'Teach AI Mentor one trick you learned.', tool: 'mentor', metric: 'You can explain it' },
        { action: 'One more short set. Compare calm vs day 1 — not the score.', tool: 'aptitude', metric: 'You feel less rushed' },
      ],
    },
    general: {
      theme: 'One small proof you can move',
      introduction: 'Fear shrinks when you finish one visible thing — not when you plan a perfect week.',
      weekly_metric: 'Three finished sessions you can point to',
      days: [
        { action: 'Open Home and do the next suggested 20-minute session. Stop when the timer ends.', tool: 'home', metric: 'You showed up' },
        { action: 'Tell AI Mentor what felt heavy yesterday. Ask for one drill only.', tool: 'mentor', metric: 'You named it' },
        { action: 'Do that one Practice drill. No second topic.', tool: 'practice', metric: 'You finished it' },
        { action: 'Write 3 lines: what you did, what was hard, what you’ll repeat.', tool: 'home', metric: 'A note exists' },
        { action: 'Repeat the same drill once more. Familiar is the point.', tool: 'practice', metric: 'It feels 10% less scary' },
      ],
    },
  };
  return plans[kind] || plans.general;
}

function asDay(value, index, ctx = {}) {
  if (value == null) return null;
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) return null;
    return { day: index, action: text, tool: '', metric: '', href: null, toolName: '', scoreable: false };
  }
  if (typeof value === 'object') {
    const action = String(value.action || value.task || value.title || value.description || '').trim();
    if (!action) return null;
    const tool = value.tool || value.tool_code || value.widget || '';
    return {
      day: index,
      action,
      tool,
      metric: String(value.metric || value.target || value.done_when || '').trim(),
      href: toolHref(tool, ctx),
      toolName: toolLabel(tool),
      scoreable: isScoreableTool(tool),
    };
  }
  return null;
}

function weekBlob(solution, weekNumber) {
  const data = solution?.solution_data || {};
  const plan = data.action_plan_section || data;
  return plan[`week${weekNumber}`] || plan.week1 || null;
}

export function isStubWeek(week) {
  if (!week || typeof week !== 'object') return true;
  const d1 = week.day1;
  if (typeof d1 === 'string' && /start with basics/i.test(d1) && !week.day2) return true;
  if (typeof week === 'string') return true;
  return false;
}

export function normalizeWeek(solution, weekNumber = 1, ctx = {}) {
  const fearName = solution?.fear_name || 'this fear';
  const launch = {
    checkinId: ctx.checkinId || solution?.checkin_id,
    fearId: ctx.fearId || solution?.fear_id,
  };
  const data = solution?.solution_data || {};
  const empathy = data.empathy_section || {};
  const closing = data.closing || {};
  let raw = weekBlob(solution, weekNumber);
  let usedFallback = false;
  if (isStubWeek(raw)) {
    raw = fallbackWeek(fearName);
    usedFallback = true;
  }

  const days = [];
  if (Array.isArray(raw?.days)) {
    raw.days.forEach((d, i) => {
      const row = asDay(d, i + 1, launch);
      if (row) days.push(row);
    });
  } else {
    for (let i = 1; i <= 7; i += 1) {
      const row = asDay(raw?.[`day${i}`], i, launch);
      if (row) days.push(row);
    }
  }

  if (!days.length) {
    const fb = fallbackWeek(fearName);
    fb.days.forEach((d, i) => {
      const row = asDay(d, i + 1, launch);
      if (row) days.push(row);
    });
    raw = { ...fb, ...raw };
    usedFallback = true;
  }

  return {
    fearId: solution?.fear_id,
    fearName,
    theme: raw.theme || `Week ${weekNumber}`,
    introduction: raw.introduction || empathy.what_i_hear || '',
    hear: empathy.what_i_hear || '',
    reframe: empathy.reframe || '',
    reassure: empathy.reassurance || closing.encouragement || '',
    firstStep: closing.first_step || days[0]?.action || '',
    weeklyMetric: raw.weekly_metric || raw.target || '',
    days,
    usedFallback,
  };
}

export function fearWeightLabel(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return '';
  if (n >= 8) return 'This still feels heavy';
  if (n >= 5) return 'Manageable, but it’s there';
  if (n >= 3) return 'Lighter than before';
  if (n >= 1) return 'Mostly in the background';
  return 'This one feels handled';
}
