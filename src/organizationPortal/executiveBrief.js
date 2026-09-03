/**
 * Build executive / HR answers from campus performance metrics (TPO).
 * Answers the management questions without hunting across charts.
 */

const INTERVIEW_READY_THRESHOLD = 75;
const DRIVE_READY_THRESHOLD = 75;

function pct(n, d) {
  if (!d) return 0;
  return Math.round((Number(n) || 0) / d * 100);
}

function round1(n) {
  if (n == null || Number.isNaN(Number(n))) return null;
  return Math.round(Number(n) * 10) / 10;
}

/** Rank branches by a pillar key (aptitude|skills|interview|communication). */
export function rankBranchesByPillar(byDept = [], pillarKey) {
  return [...(byDept || [])]
    .filter((d) => d.pillars?.[pillarKey] != null)
    .map((d) => ({
      id: d.id,
      code: d.code,
      name: d.name,
      score: Number(d.pillars[pillarKey]),
      avgReadiness: d.avgReadiness ?? null,
      strong: d.strong ?? 0,
      scoredStudents: d.scoredStudents ?? 0,
      students: d.students ?? 0,
      avgTestsDone: d.avgTestsDone ?? null,
      topGap: d.topGap || null,
    }))
    .sort((a, b) => b.score - a.score)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

/**
 * Branches considered interview-ready: interview pillar ≥ 75%.
 * Falls back to drive-ready share when interview scores missing.
 */
export function interviewReadyBranches(byDept = []) {
  const withInterview = rankBranchesByPillar(byDept, 'interview');
  if (withInterview.length) {
    return {
      threshold: INTERVIEW_READY_THRESHOLD,
      mode: 'interview_pillar',
      ready: withInterview.filter((d) => d.score >= INTERVIEW_READY_THRESHOLD),
      developing: withInterview.filter(
        (d) => d.score >= 50 && d.score < INTERVIEW_READY_THRESHOLD
      ),
      notReady: withInterview.filter((d) => d.score < 50),
      ranked: withInterview,
    };
  }
  // Fallback: overall readiness as proxy
  const ranked = [...(byDept || [])]
    .filter((d) => d.avgReadiness != null)
    .map((d) => ({
      id: d.id,
      code: d.code,
      name: d.name,
      score: Number(d.avgReadiness),
      avgReadiness: d.avgReadiness,
      strong: d.strong ?? 0,
      scoredStudents: d.scoredStudents ?? 0,
      students: d.students ?? 0,
      topGap: d.topGap || null,
    }))
    .sort((a, b) => b.score - a.score)
    .map((row, i) => ({ ...row, rank: i + 1 }));
  return {
    threshold: DRIVE_READY_THRESHOLD,
    mode: 'overall_readiness',
    ready: ranked.filter((d) => d.score >= DRIVE_READY_THRESHOLD),
    developing: ranked.filter((d) => d.score >= 50 && d.score < DRIVE_READY_THRESHOLD),
    notReady: ranked.filter((d) => d.score < 50),
    ranked,
  };
}

export function campusPillarScores(metrics = {}) {
  const p = metrics.pillars || {};
  return {
    aptitude: p.aptitude ?? null,
    skills: p.skills ?? null,
    interview: p.interview ?? null,
    communication: p.communication ?? null,
    voiceMock: metrics.avgMock ?? null,
  };
}

export function branchPillarMatrix(byDept = []) {
  return [...(byDept || [])]
    .map((d) => ({
      id: d.id,
      code: d.code,
      name: d.name,
      avgReadiness: d.avgReadiness ?? null,
      aptitude: d.pillars?.aptitude ?? null,
      skills: d.pillars?.skills ?? null,
      interview: d.pillars?.interview ?? null,
      communication: d.pillars?.communication ?? null,
      voiceMock: d.avgMock ?? null,
      avgTestsDone: d.avgTestsDone ?? null,
      strong: d.strong ?? 0,
      weak: d.weak ?? 0,
      scoredStudents: d.scoredStudents ?? 0,
      students: d.students ?? 0,
      topGap: d.topGap || null,
    }))
    .sort((a, b) => (b.avgReadiness ?? -1) - (a.avgReadiness ?? -1));
}

export function testVolume(metrics = {}) {
  const tests = metrics.tests || {};
  const toolsTotal = tests.toolsTotal ?? 8;
  const students = metrics.students ?? 0;
  const scored = metrics.studentsScored ?? 0;
  const avgDone = tests.avgTestsDone ?? 0;
  // Prefer API absolute total; else estimate from avg × scored.
  const totalCompletions =
    tests.totalCompletions != null && tests.totalCompletions > 0
      ? tests.totalCompletions
      : Math.round(avgDone * scored);
  const totalPossible = students * toolsTotal;
  const totalRemaining =
    tests.totalRemaining != null
      ? tests.totalRemaining
      : Math.max(0, totalPossible - totalCompletions);

  return {
    toolsTotal,
    avgTestsDone: round1(avgDone) ?? 0,
    avgTestsRemaining: round1(tests.avgTestsRemaining) ?? Math.max(0, toolsTotal - avgDone),
    totalCompletions,
    totalRemaining,
    totalPossible,
    studentsAllDone: tests.studentsAllDone ?? 0,
    studentsNoneDone: tests.studentsNoneDone ?? 0,
    completionPct: pct(totalCompletions, totalPossible || 1),
  };
}

export function participation(metrics = {}) {
  const students = metrics.students ?? 0;
  const scored = metrics.studentsScored ?? 0;
  const active7d = metrics.active7d ?? 0;
  const neverStarted = metrics.neverStarted ?? 0;
  const strong = metrics.bands?.strong ?? metrics.strong ?? 0;
  const mid = metrics.bands?.mid ?? metrics.mid ?? 0;
  const weak = metrics.bands?.weak ?? metrics.weak ?? 0;
  const preparing = strong + mid; // scored and at least developing
  return {
    students,
    scored,
    coveragePct: metrics.coveragePct ?? pct(scored, students),
    active7d,
    neverStarted,
    idle: metrics.idleCount ?? 0,
    inactive14d: metrics.inactive14d ?? 0,
    driveReady: strong,
    developing: mid,
    lessPrepared: weak,
    preparingProperly: preparing,
    preparingPct: pct(preparing, scored || students || 1),
  };
}

/**
 * One object answering the TPO management / HR questions.
 */
export function buildExecutiveHrBrief(metrics = {}, { scopeLabel = 'Campus' } = {}) {
  const pillars = campusPillarScores(metrics);
  const branches = branchPillarMatrix(metrics.byDept || []);
  const interview = interviewReadyBranches(metrics.byDept || []);
  const tests = testVolume(metrics);
  const part = participation(metrics);
  const topGaps = (metrics.topGaps || []).slice(0, 5);
  const topStrengths = (metrics.topStrengths || []).slice(0, 5);
  const leadBranch = branches[0] || null;
  const lagBranch = [...branches].reverse().find((b) => b.avgReadiness != null) || null;
  const interviewLead = interview.ranked[0] || null;

  const answers = [
    {
      id: 'q1',
      question: 'Which branch is interview-ready? Overall & branch readiness?',
      headline:
        interview.ready.length > 0
          ? `${interview.ready.map((b) => b.code || b.name).join(', ')} interview-ready (≥${interview.threshold}% interview)`
          : interviewLead
            ? `No branch at ≥${interview.threshold}% interview yet — lead is ${interviewLead.code || interviewLead.name} (${Math.round(interviewLead.score)}%)`
            : 'Interview pillar scores appear after students complete interview checks.',
      detail: [
        `${scopeLabel} overall readiness: ${metrics.avgReadiness == null ? '—' : `${Math.round(metrics.avgReadiness)}%`}`,
        `Drive-ready (≥75%): ${part.driveReady} · Developing: ${part.developing} · Less prepared: ${part.lessPrepared}`,
        leadBranch
          ? `Strongest overall branch: ${leadBranch.name} (${leadBranch.avgReadiness == null ? '—' : `${Math.round(leadBranch.avgReadiness)}%`})`
          : null,
        lagBranch && lagBranch.id !== leadBranch?.id
          ? `Needs focus: ${lagBranch.name} (${lagBranch.avgReadiness == null ? '—' : `${Math.round(lagBranch.avgReadiness)}%`})`
          : null,
      ].filter(Boolean),
    },
    {
      id: 'q2',
      question: 'Aptitude, skills & communication — campus + per branch?',
      headline: [
        pillars.aptitude != null ? `Aptitude ${Math.round(pillars.aptitude)}%` : null,
        pillars.skills != null ? `Skills ${Math.round(pillars.skills)}%` : null,
        pillars.interview != null ? `Interview ${Math.round(pillars.interview)}%` : null,
        pillars.communication != null ? `Communication ${Math.round(pillars.communication)}%` : null,
      ]
        .filter(Boolean)
        .join(' · ') || 'Pillar averages appear after baseline scores land.',
      detail: branches.slice(0, 6).map((b) => {
        const bits = [
          b.aptitude != null ? `Apt ${Math.round(b.aptitude)}` : null,
          b.skills != null ? `Skill ${Math.round(b.skills)}` : null,
          b.interview != null ? `Int ${Math.round(b.interview)}` : null,
          b.communication != null ? `Comm ${Math.round(b.communication)}` : null,
        ].filter(Boolean);
        return `${b.code || b.name}: ${bits.join(' · ') || '—'}`;
      }),
    },
    {
      id: 'q3',
      question: 'Weakness (and strength) areas — campus & branches?',
      headline: topGaps[0]
        ? `Top campus gap: ${topGaps[0].label} (${topGaps[0].count} students)`
        : 'Gap themes appear after scored attempts.',
      detail: [
        ...topGaps.slice(0, 3).map((g) => `Gap: ${g.label} · ${g.count}`),
        ...topStrengths.slice(0, 3).map((s) => `Strength: ${s.label} · ${s.count}`),
        ...branches
          .filter((b) => b.topGap)
          .slice(0, 4)
          .map((b) => `${b.code || b.name} gap: ${b.topGap}`),
      ],
    },
    {
      id: 'q4',
      question: 'How many tests have students taken?',
      headline: `${tests.totalCompletions.toLocaleString()} baseline checks completed campus-wide (${tests.completionPct}% of ${tests.totalPossible.toLocaleString()} possible)`,
      detail: [
        `Avg per student: ${tests.avgTestsDone}/${tests.toolsTotal} · Remaining slots: ${tests.totalRemaining.toLocaleString()}`,
        `${tests.studentsAllDone} finished all ${tests.toolsTotal} checks · ${tests.studentsNoneDone} not started`,
        ...branches
          .filter((b) => b.avgTestsDone != null)
          .slice(0, 5)
          .map((b) => `${b.code || b.name}: avg ${round1(b.avgTestsDone)}/${tests.toolsTotal} tests`),
      ],
    },
    {
      id: 'q5',
      question: 'How many students are testing & preparing properly?',
      headline: `${part.scored} of ${part.students} scored (${part.coveragePct}%) · ${part.preparingProperly} preparing at developing+ (${part.preparingPct}% of scored)`,
      detail: [
        `Active last 7 days: ${part.active7d} · Never started: ${part.neverStarted}`,
        `Drive-ready: ${part.driveReady} · Developing: ${part.developing} · Less prepared: ${part.lessPrepared}`,
      ],
    },
  ];

  return {
    scopeLabel,
    avgReadiness: metrics.avgReadiness ?? null,
    pillars,
    branches,
    interview,
    tests,
    participation: part,
    topGaps,
    topStrengths,
    answers,
    prepFocus: {
      strengthen: topStrengths.slice(0, 2).map((s) => s.label),
      fix: topGaps.slice(0, 3).map((g) => g.label),
    },
  };
}
