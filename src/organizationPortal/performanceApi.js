/**
 * TPO/HOD performance analytics + AI insight APIs.
 */

import { orgApi, OrgApiError } from '../orgPortal/orgApi';

export { OrgApiError };

export async function fetchPerformanceSummary(params = {}) {
  const qs = new URLSearchParams();
  if (params.departmentId) qs.set('department_id', String(params.departmentId));
  if (params.boardLimit) qs.set('board_limit', String(params.boardLimit));
  const q = qs.toString();
  return orgApi.get(`/organizations/performance/summary${q ? `?${q}` : ''}`);
}

export async function fetchPerformanceScorecards(params = {}) {
  const qs = new URLSearchParams();
  if (params.departmentId) qs.set('department_id', String(params.departmentId));
  const q = qs.toString();
  return orgApi.get(`/organizations/performance/scorecards${q ? `?${q}` : ''}`);
}

export async function fetchCampusInsight(body = {}) {
  return orgApi.post('/organizations/ai/campus-insight', body);
}

export async function fetchBranchInsight(body = {}) {
  return orgApi.post('/organizations/ai/branch-insight', body);
}

export function mapInsight(res) {
  if (!res) return null;
  return {
    summary: res?.insight?.summary || '',
    goingWell: res?.insight?.going_well || [],
    concerns: res?.insight?.concerns || [],
    actions: res?.insight?.actions || [],
    shortlistNotes: res?.insight?.shortlist_notes || [],
    source: res?.source || 'openai',
    model: res?.model,
  };
}

function mapRanked(list) {
  return (list || []).map((s) => ({
    rank: s.rank,
    id: s.id,
    name: s.name,
    email: s.email,
    departmentId: s.department_id,
    departmentName: s.department_name,
    score: s.score,
    readiness: s.readiness,
    strength: s.strength,
    weakness: s.weakness,
    bestArea: s.best_area,
    testsDone: s.tests_done,
    testsRemaining: s.tests_remaining,
    progressLevel: s.progress_level,
    activityStatus: s.activity_status,
  }));
}

/** Map API summary into UI metrics. */
export function summaryToUiMetrics(summary) {
  if (!summary) return null;
  const bands = summary.bands || {};
  const clarity = summary.clarity || {};
  const tests = summary.tests || {};
  return {
    students: summary.students_total || 0,
    studentsScored: summary.students_scored || 0,
    coveragePct: summary.coverage_pct ?? 0,
    driveReadyPct: summary.drive_ready_pct ?? 0,
    driveReadyOfScoredPct: summary.drive_ready_of_scored_pct ?? 0,
    filteredDepartmentId: summary.filtered_department_id ?? summary.department_id ?? null,
    avgReadiness: summary.avg_readiness ?? null,
    avgMock: summary.avg_mock ?? null,
    strong: bands.strong || 0,
    mid: bands.mid || 0,
    weak: bands.weak || 0,
    unscored: bands.unscored || 0,
    bands: {
      strong: bands.strong || 0,
      mid: bands.mid || 0,
      weak: bands.weak || 0,
      unscored: bands.unscored || 0,
    },
    toolCoverage: (summary.tool_coverage || []).map((t) => ({
      tool: t.tool,
      label: t.label,
      completed: t.completed,
      inProgress: t.in_progress,
      remaining: t.remaining,
      total: t.total,
      pct: t.pct,
    })),
    levelFunnel: (summary.level_funnel || []).map((f) => ({
      level: f.level,
      label: f.label,
      tool: f.tool,
      reachedOrBeyond: f.reached_or_beyond,
      completed: f.completed,
      pctCompleted: f.pct_completed,
    })),
    tests: {
      toolsTotal: tests.tools_total ?? 8,
      avgTestsDone: tests.avg_tests_done ?? 0,
      avgTestsRemaining: tests.avg_tests_remaining ?? 0,
      studentsAllDone: tests.students_all_done ?? 0,
      studentsNoneDone: tests.students_none_done ?? 0,
      totalCompletions: tests.total_completions ?? 0,
      totalRemaining: tests.total_remaining ?? 0,
    },
    topGaps: (summary.top_gaps || []).map((g) => ({
      label: g.label,
      count: g.count,
      sharePct: g.share_pct ?? null,
    })),
    topStrengths: (summary.top_strengths || []).map((g) => ({
      label: g.label,
      count: g.count,
      sharePct: g.share_pct ?? null,
    })),
    byDept: (summary.by_department || []).map((d) => ({
      id: d.id,
      code: d.code,
      name: d.name,
      students: d.students,
      scoredStudents: d.scored_students,
      coveragePct: d.coverage_pct ?? 0,
      avgReadiness: d.avg_readiness ?? null,
      avgMock: d.avg_mock ?? null,
      strong: d.strong,
      mid: d.mid,
      weak: d.weak,
      active7d: d.active_7d,
      inactive14d: d.inactive_14d,
      neverStarted: d.never_started,
      avgTestsDone: d.avg_tests_done,
      topGap: d.top_gap,
      hodStatus: d.hod_status,
    })),
    leaders: (summary.leaders || []).map((s) => ({
      id: s.id,
      name: s.name,
      departmentName: s.department_name,
      readiness: s.readiness,
      mockScore: s.mock_score,
      strength: s.strength,
      weakness: s.weakness,
      bestArea: s.best_area,
      activities: s.activities,
      testsDone: s.tests_done,
      progressLevel: s.progress_level,
    })),
    atRisk: (summary.at_risk || []).map((s) => ({
      id: s.id,
      name: s.name,
      departmentName: s.department_name,
      readiness: s.readiness,
      weakness: s.weakness,
      testsDone: s.tests_done,
    })),
    areaLeaders: (summary.area_leaders || []).map((a) => ({
      area: a.area,
      label: a.label,
      studentId: a.student_id,
      studentName: a.student_name,
      departmentName: a.department_name,
      score: a.score,
    })),
    areaBoards: (summary.area_boards || []).map((b) => ({
      area: b.area,
      label: b.label,
      description: b.description,
      studentsScored: b.students_scored,
      avgScore: b.avg_score,
      top: mapRanked(b.top),
      lessPrepared: mapRanked(b.less_prepared),
    })),
    boardLimit: summary.board_limit || 10,
    pillars: summary.pillars || {},
    clarity: {
      goingWell: clarity.going_well || [],
      concerns: clarity.concerns || [],
      priorities: clarity.priorities || [],
      status: clarity.status || 'watch',
    },
    active7d: summary.active_7d || 0,
    idleCount: summary.idle_count || 0,
    inactive14d: summary.inactive_14d || 0,
    neverStarted: summary.never_started || 0,
    pendingInvites: summary.pending_invites || 0,
    upcomingDrives: summary.upcoming_drives || 0,
    hodGaps: summary.hod_gaps || 0,
    departmentName:
      summary.scope === 'department' || summary.filtered_department_id
        ? summary.by_department?.[0]?.name || 'Branch'
        : undefined,
    departmentId: summary.department_id,
    scope: summary.scope,
    generatedAt: summary.generated_at,
  };
}

export function scorecardsToUiRows(payload) {
  const items = payload?.items || [];
  return items.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email || '',
    departmentId: s.department_id,
    departmentName: s.department_name || '',
    readiness: s.readiness == null ? null : Number(s.readiness),
    mockScore: s.mock_score == null ? null : Number(s.mock_score),
    technicalScore: s.technical_score,
    communicationScore: s.communication_score,
    shortlistScore: s.shortlist_score,
    scoresByTool: s.scores_by_tool || {},
    stepStatusByTool: s.step_status_by_tool || {},
    strength: s.strength || '—',
    weakness: s.weakness || '—',
    strengths: s.strengths || [],
    weaknesses: s.weaknesses || [],
    activities: s.activities || 0,
    attempts: s.attempts || 0,
    testsDone: s.tests_done || 0,
    testsInProgress: s.tests_in_progress || 0,
    testsRemaining: s.tests_remaining || 0,
    progressLevel: s.progress_level || 0,
    progressPct: s.progress_pct || 0,
    weekStatus: s.week_status,
    lastActiveAt: s.last_active_at,
    daysInactive: s.days_inactive,
    activityStatus: s.activity_status || 'never',
    bestArea: s.best_area,
  }));
}

export function readinessTone(score) {
  if (score == null || Number.isNaN(Number(score))) return 'none';
  const n = Number(score);
  if (n >= 75) return 'good';
  if (n >= 50) return 'mid';
  return 'bad';
}

export function formatPct(value, fallback = '—') {
  if (value == null || Number.isNaN(Number(value))) return fallback;
  return `${Math.round(Number(value))}%`;
}

export const AREA_OPTIONS = [
  { id: 'overall', label: 'Overall' },
  { id: 'shortlist', label: 'Shortlist' },
  { id: 'aptitude', label: 'Aptitude' },
  { id: 'skills', label: 'Skills' },
  { id: 'coding', label: 'Coding' },
  { id: 'interview', label: 'Interview' },
  { id: 'communication', label: 'Communication' },
  { id: 'technical', label: 'Technical' },
  { id: 'snap', label: 'Snap' },
];
