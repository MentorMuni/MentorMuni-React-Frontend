import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  Building2,
  ClipboardList,
  Eye,
  Sparkles,
  UserPlus,
  Users,
  BarChart3,
  AlertTriangle,
  Wand2,
  Plus,
} from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { canMutateCampus, isViewerRole, normalizeOrgRole, ORG_ROLES } from '../roles';
import { orgPaths } from '../paths';
import {
  buildBranchMetricsFromApi,
  getHodWorkspaceSnapshot,
} from '../hodScope';
import {
  buildLocalBranchInsight,
  buildLocalCampusInsight,
  getTpoMetrics,
  listPrograms,
  subscribeOrgDb,
} from '../store';
import { fetchDepartmentOptions } from '../departmentsApi';
import { computeRosterCounts } from '../enrollmentMetrics';
import { fetchStudentInvites, fetchStudents } from '../studentsApi';
import AssignToStudentModal from './AssignToStudentModal';
import {
  fetchBranchInsight,
  fetchCampusInsight,
  fetchPerformanceScorecards,
  fetchPerformanceSummary,
  mapInsight,
  scorecardsToUiRows,
  summaryToUiMetrics,
} from '../performanceApi';
import { ClarityBoard } from '../components/PerformanceCharts';
import {
  ActivityEngagementPie,
  DeptCompareChart,
  GapStrengthBars,
  PillarComparisonBars,
  ReadinessPie,
  ThemeFrequencyBars,
  ToolCoverageStacked,
} from '../components/AnalyticsCharts';
import PrepSnapshot from '../components/PrepSnapshot';
import DeptReadinessTable from '../components/DeptReadinessTable';
import BranchInsightsPanel from '../components/BranchInsightsPanel';
import AtRiskPanel from '../components/AtRiskPanel';
import ExecutiveHrBrief from '../components/ExecutiveHrBrief';

const EASE = [0.22, 1, 0.36, 1];

/** Merge live performance API fields into TPO dashboard metrics without clobbering dept count. */
function mergeTpoApiMetrics(prev, ui, { departmentCount, enrollment } = {}) {
  const next = ui ? { ...prev, ...ui } : { ...prev };
  if (departmentCount != null) next.departments = departmentCount;
  else if (ui?.byDept?.length) next.departments = ui.byDept.length;
  if (enrollment != null) next.enrollment = enrollment;
  if (ui) {
    next.activePrograms = prev.activePrograms;
    next.recentPrograms = prev.recentPrograms;
    next.recentDrives = prev.recentDrives;
    next.programCoverage = prev.programCoverage;
  }
  return next;
}

/** Layer performance summary onto HOD roster metrics (roster counts win for students/pending). */
function mergeHodApiMetrics(rosterMetrics, perfUi, { pendingInvites, programsCount } = {}) {
  const base = { ...(rosterMetrics || {}), ...(perfUi || {}) };
  return {
    ...base,
    students: rosterMetrics?.students ?? perfUi?.students ?? 0,
    pendingInvites: pendingInvites ?? rosterMetrics?.pendingInvites ?? perfUi?.pendingInvites ?? 0,
    activePrograms: programsCount ?? rosterMetrics?.activePrograms ?? perfUi?.activePrograms ?? 0,
    leaders: perfUi?.leaders?.length ? perfUi.leaders : rosterMetrics?.leaders || [],
    atRisk: perfUi?.atRisk?.length ? perfUi.atRisk : rosterMetrics?.atRisk || [],
    topGaps: perfUi?.topGaps?.length ? perfUi.topGaps : rosterMetrics?.topGaps || [],
    topStrengths: perfUi?.topStrengths?.length ? perfUi.topStrengths : rosterMetrics?.topStrengths || [],
  };
}

export default function DashboardPage() {
  const session = getOrgSession();
  const location = useLocation();
  const navigate = useNavigate();
  const role = normalizeOrgRole(session?.role);
  const canEdit = canMutateCampus(session?.role);
  const viewer = isViewerRole(session?.role);
  const [metrics, setMetrics] = useState(() => getTpoMetrics());
  const [aiBusy, setAiBusy] = useState(false);
  const [insight, setInsight] = useState(() => buildLocalCampusInsight(getTpoMetrics()));
  const [hodSnap, setHodSnap] = useState(() => getHodWorkspaceSnapshot(session));
  const [hodStudents, setHodStudents] = useState(() => getHodWorkspaceSnapshot(session).students || []);
  const [hodScorecards, setHodScorecards] = useState([]);
  const [hodMetrics, setHodMetrics] = useState(() => getHodWorkspaceSnapshot(session).metrics);
  const [hodInsight, setHodInsight] = useState(() =>
    buildLocalBranchInsight(getHodWorkspaceSnapshot(session).metrics)
  );
  const [hodDataSource, setHodDataSource] = useState('local');
  const [assignStudent, setAssignStudent] = useState(null);
  const [assignFlash, setAssignFlash] = useState('');
  const [perfSource, setPerfSource] = useState('local');

  useEffect(() => {
    return subscribeOrgDb(() => {
      const next = getTpoMetrics();
      setMetrics(next);
      setInsight(buildLocalCampusInsight(next));
      if (normalizeOrgRole(getOrgSession()?.role) === ORG_ROLES.HOD && !getOrgSession()?.demo) {
        return;
      }
      const hs = getHodWorkspaceSnapshot(getOrgSession());
      setHodSnap(hs);
      setHodStudents(hs.students || []);
      setHodMetrics(hs.metrics);
      setHodInsight(buildLocalBranchInsight(hs.metrics));
      setHodDataSource('local');
    });
  }, []);

  // Live TPO / Viewer dashboard — performance + department count from API
  useEffect(() => {
    if (session?.demo) return undefined;
    const roleNow = normalizeOrgRole(session?.role);
    if (roleNow !== ORG_ROLES.TPO && !isViewerRole(session?.role)) return undefined;
    let cancelled = false;
    (async () => {
      const [summaryRes, deptRes, rosterRes, queueRes] = await Promise.allSettled([
        fetchPerformanceSummary(),
        fetchDepartmentOptions(),
        fetchStudents(),
        fetchStudentInvites({ status: 'pending' }),
      ]);
      if (cancelled) return;

      const summary = summaryRes.status === 'fulfilled' ? summaryRes.value : null;
      const deptList =
        deptRes.status === 'fulfilled' ? deptRes.value?.departments || [] : [];
      const students =
        rosterRes.status === 'fulfilled' ? rosterRes.value?.students || [] : [];
      const invites =
        queueRes.status === 'fulfilled' ? queueRes.value?.invitations || [] : [];

      const ui = summary ? summaryToUiMetrics(summary) : null;
      const departmentCount = deptList.length;
      const enrollment = computeRosterCounts(students, invites.length);
      setMetrics((prev) => mergeTpoApiMetrics(prev, ui, { departmentCount, enrollment }));
      if (ui) setPerfSource('api');
      else if (summaryRes.status === 'rejected') setPerfSource('roster');
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.role, session?.demo, location.key]);

  // Live HOD dashboard — roster, invites, and branch-scoped performance from API
  useEffect(() => {
    if (normalizeOrgRole(session?.role) !== ORG_ROLES.HOD) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const deptRes = await fetchDepartmentOptions();
        if (cancelled) return;
        const list = deptRes.departments || [];
        const snap = getHodWorkspaceSnapshot(getOrgSession(), list);
        setHodSnap(snap);
        const deptId = snap.departmentId;
        if (!deptId) {
          setHodStudents([]);
          return;
        }
        if (session?.demo) {
          setHodStudents(snap.students || []);
          setHodMetrics(snap.metrics);
          setHodInsight(buildLocalBranchInsight(snap.metrics));
          setHodDataSource('local');
          return;
        }

        const [rosterRes, queueRes, summaryRes, cardsRes] = await Promise.allSettled([
          fetchStudents({ departmentId: deptId }),
          fetchStudentInvites({ status: 'pending', departmentId: deptId }),
          fetchPerformanceSummary({ departmentId: deptId }),
          fetchPerformanceScorecards({ departmentId: deptId }),
        ]);
        if (cancelled) return;

        const roster = rosterRes.status === 'fulfilled' ? rosterRes.value : { students: [] };
        const queue =
          queueRes.status === 'fulfilled' ? queueRes.value : { invitations: [] };
        const summary = summaryRes.status === 'fulfilled' ? summaryRes.value : null;
        const cards =
          cardsRes.status === 'fulfilled' ? cardsRes.value : { items: [] };

        const students = roster.students || [];
        setHodStudents(students);
        setHodScorecards(scorecardsToUiRows(cards));
        const programsCount = listPrograms().filter(
          (p) =>
            p.audience === 'all' ||
            (p.audience === 'department' && String(p.departmentId) === String(deptId))
        ).length;
        const pendingInvites = (queue.invitations || []).length;
        const rosterMetrics = buildBranchMetricsFromApi({
          students,
          pendingCount: pendingInvites,
          programsCount,
        });
        const perfUi = summary ? summaryToUiMetrics(summary) : null;
        const merged = mergeHodApiMetrics(rosterMetrics, perfUi, {
          pendingInvites,
          programsCount,
        });
        setHodMetrics(merged);
        setHodInsight(buildLocalBranchInsight(merged));
        setHodDataSource(roster.source || 'api');
      } catch {
        /* keep local HOD snapshot */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.role, session?.demo, session?.department_id, location.key]);

  const runInsight = async () => {
    setAiBusy(true);
    try {
      if (!session?.demo) {
        const [res, summary, roster, queue] = await Promise.all([
          fetchCampusInsight({ include_leaderboard: true, max_actions: 5 }),
          fetchPerformanceSummary(),
          fetchStudents().catch(() => ({ students: [] })),
          fetchStudentInvites({ status: 'pending' }).catch(() => ({ invitations: [] })),
        ]);
        if (summary) {
          const deptRes = await fetchDepartmentOptions();
          const enrollment = computeRosterCounts(
            roster.students || [],
            (queue.invitations || []).length
          );
          setMetrics((prev) =>
            mergeTpoApiMetrics(prev, summaryToUiMetrics(summary), {
              departmentCount: (deptRes.departments || []).length,
              enrollment,
            })
          );
        }
        setInsight(mapInsight(res) || buildLocalCampusInsight(getTpoMetrics()));
        setPerfSource(res?.source === 'openai' ? 'api+ai' : 'api');
      } else {
        setInsight(buildLocalCampusInsight(getTpoMetrics()));
      }
    } catch {
      setInsight(buildLocalCampusInsight(metrics));
    } finally {
      setAiBusy(false);
    }
  };

  const runHodInsight = async () => {
    setAiBusy(true);
    try {
      if (!session?.demo) {
        const deptId = hodSnap.departmentId;
        const [res, summary] = await Promise.all([
          fetchBranchInsight({ include_leaderboard: true, max_actions: 5 }),
          fetchPerformanceSummary(deptId ? { departmentId: deptId } : {}),
        ]);
        setHodInsight(mapInsight(res) || buildLocalBranchInsight(hodMetrics));
        if (summary) {
          const perfUi = summaryToUiMetrics(summary);
          setHodMetrics((prev) =>
            mergeHodApiMetrics(prev, perfUi, {
              pendingInvites: prev?.pendingInvites,
              programsCount: prev?.activePrograms,
            })
          );
        }
      } else {
        setHodInsight(buildLocalBranchInsight(hodMetrics));
      }
    } catch {
      setHodInsight(buildLocalBranchInsight(hodMetrics));
    } finally {
      setAiBusy(false);
    }
  };

  const bandTotal = Math.max(1, metrics.students || 0);
  const bandPct = useMemo(
    () => ({
      strong: Math.round(((metrics.bands?.strong || 0) / bandTotal) * 100),
      mid: Math.round(((metrics.bands?.mid || 0) / bandTotal) * 100),
      weak: Math.round(((metrics.bands?.weak || 0) / bandTotal) * 100),
    }),
    [metrics.bands, bandTotal]
  );

  if (role === ORG_ROLES.TPO || viewer) {
    const enrollment = metrics.enrollment;
    const cards = [
      { label: 'Departments', value: metrics.departments, icon: Building2, hint: 'Branches' },
      {
        label: 'Students',
        value: enrollment ? enrollment.active : metrics.students,
        icon: Users,
        hint: enrollment
          ? `${enrollment.invited} awaiting password · ${enrollment.pending} pending`
          : 'Active in analytics',
      },
      {
        label: 'Enrolled students',
        value: enrollment ? enrollment.pipelineTotal : metrics.students + (metrics.pendingInvites || 0),
        icon: UserPlus,
        hint: enrollment
          ? `${enrollment.rosterTotal} enrolled · ${enrollment.pending} in queue`
          : 'Enrolled + queue',
      },
      { label: 'Active programs', value: metrics.activePrograms, icon: ClipboardList, hint: 'Assigned work' },
      { label: 'Upcoming notices', value: metrics.upcomingDrives, icon: Bell, hint: 'Events & workshops' },
    ];

    return (
      <div className="space-y-6">
        <div className="mm-org-hero">
          <motion.div
            className="mm-org-hero__card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="mm-org-pill">
              {viewer ? <Eye size={12} /> : <Building2 size={12} />}
              {viewer ? 'View only' : 'Placement office'}
            </span>
            <h2>
              Welcome{session?.name ? `, ${session.name.split(' ')[0]}` : ''}.
              <span className="block mm-org-hero__muted">
                {viewer ? 'Campus analytics at a glance.' : 'Run the campus from one desk.'}
              </span>
            </h2>
            <p>
              {session?.organization_name || 'Your college'} —{' '}
              {viewer
                ? 'read-only readiness, departments, and leaderboards for analysis.'
                : 'departments, HOD mentors, enrollment, programs, events, and deep readiness analytics.'}
            </p>
            <div className="mm-org-hero__actions">
              {canEdit ? (
                <>
                  <Link to={orgPaths.departments} className="mm-org-btn mm-org-btn--primary">
                    <Building2 size={15} /> Add department
                  </Link>
                  <Link to={orgPaths.programs} className="mm-org-btn mm-org-btn--ghost">
                    Assign program
                  </Link>
                </>
              ) : (
                <>
                  <Link to={orgPaths.performance} className="mm-org-btn mm-org-btn--primary">
                    <BarChart3 size={15} /> Open performance
                  </Link>
                  <Link to={orgPaths.departments} className="mm-org-btn mm-org-btn--ghost">
                    View departments
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            className="mm-org-panel flex flex-col justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
          >
            <div>
              <p className="mm-org-pulse-label">Campus pulse</p>
              <p className="mm-org-pulse-value">
                {metrics.avgReadiness == null ? '—' : Math.round(metrics.avgReadiness)}
                <span>avg readiness</span>
              </p>
              <p className="mt-2 text-sm mm-org-text-muted">
                {metrics.strong} drive-ready · {metrics.weak} less prepared
                {metrics.coveragePct != null ? ` · ${Math.round(metrics.coveragePct)}% scored` : ''}
              </p>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs mm-org-text-muted">
                <span>Score coverage</span>
                <span>
                  {metrics.coveragePct != null ? `${Math.round(metrics.coveragePct)}%` : '—'}
                </span>
              </div>
              <div className="mm-org-progress">
                <motion.div
                  className="mm-org-progress__bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.coveragePct ?? 0}%` }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </div>
              <Link to={orgPaths.performance} className="mm-org-link mt-4 inline-flex items-center gap-1 text-xs">
                Open performance <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mm-org-stat-grid">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                className="mm-org-stat"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35, ease: EASE }}
              >
                <div className="flex items-start justify-between">
                  <p className="mm-org-stat__label">{card.label}</p>
                  <Icon size={16} className="mm-org-icon-accent" />
                </div>
                <p className="mm-org-stat__value">{card.value}</p>
                <p className="mm-org-stat__hint">{card.hint}</p>
              </motion.div>
            );
          })}
        </div>

        <PrepSnapshot
          scope="campus"
          scopeLabel={session?.organization_name || 'Campus'}
          metrics={metrics}
        />

        <ExecutiveHrBrief
          metrics={metrics}
          scopeLabel={session?.organization_name || 'Campus'}
          showPerformanceLink
          compact
          onSelectDept={(d) => navigate(`${orgPaths.performance}?dept=${d.id}`)}
        />

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Deep analysis</h2>
              <p className="mm-org-panel__meta">
                Readiness bands, skill gaps, and where to intervene before the next drive
              </p>
            </div>
            <button
              type="button"
              className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
              onClick={runInsight}
              disabled={aiBusy}
            >
              <Wand2 size={14} /> {aiBusy ? 'Analyzing…' : 'Refresh insight'}
            </button>
          </div>

          <div className="mm-org-insight">
            <div className="mm-org-insight__card">
              <h4>Drive-ready (≥75%)</h4>
              <strong>{metrics.bands?.strong || metrics.strong || 0}</strong>
              <p>{bandPct.strong}% of enrolled cohort</p>
            </div>
            <div className="mm-org-insight__card">
              <h4>Developing (50–74%)</h4>
              <strong>{metrics.bands?.mid || metrics.mid || 0}</strong>
              <p>{bandPct.mid}% — assign targeted mocks</p>
            </div>
            <div className="mm-org-insight__card">
              <h4>Less prepared (&lt;50%)</h4>
              <strong>{metrics.bands?.weak || metrics.weak || 0}</strong>
              <p>{bandPct.weak}% — priority for focused practice</p>
            </div>
          </div>

          <div className="mt-4">
            <ClarityBoard clarity={metrics.clarity} insight={insight} />
          </div>

          <div className="mt-4 mm-org-dash-analytics">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="mm-org-panel mm-org-panel--nested">
              <p className="mm-org-stat__label mb-2">Readiness mix</p>
              <ReadinessPie
                bands={{
                  strong: metrics.bands?.strong || metrics.strong || 0,
                  mid: metrics.bands?.mid || metrics.mid || 0,
                  weak: metrics.bands?.weak || metrics.weak || 0,
                  unscored: metrics.unscored || 0,
                }}
                avgReadiness={metrics.avgReadiness}
              />
            </div>
            <div className="mm-org-panel mm-org-panel--nested">
              <p className="mm-org-stat__label mb-2">Pillar averages</p>
              <PillarComparisonBars pillars={metrics.pillars || {}} avgMock={metrics.avgMock} />
            </div>
            <div className="mm-org-panel mm-org-panel--nested">
              <p className="mm-org-stat__label mb-2">Activity pulse</p>
              <ActivityEngagementPie
                active={metrics.active7d || 0}
                idle={metrics.idleCount || 0}
                inactive={metrics.inactive14d || 0}
                never={metrics.neverStarted || 0}
              />
              <p className="mt-2 text-xs mm-org-text-muted">
                Coverage {Math.round(metrics.coveragePct || 0)}% scored
                {perfSource !== 'local' ? ` · ${perfSource}` : ''}
              </p>
            </div>
          </div>

          <div>
            <GapStrengthBars gaps={metrics.topGaps || []} strengths={metrics.topStrengths || []} />
          </div>

          {(metrics.byDept || []).length ? (
            <div>
              <p className="mm-org-stat__label mb-2">Departments — band mix</p>
              <DeptCompareChart departments={metrics.byDept || []} />
            </div>
          ) : null}

          {(metrics.toolCoverage || []).length ? (
            <div>
              <p className="mm-org-stat__label mb-2">Tool completion</p>
              <ToolCoverageStacked tools={metrics.toolCoverage || []} />
            </div>
          ) : null}
          </div>

          <div className="mm-org-ai-box">
            <p className="mm-org-ai-box__title">
              <Sparkles size={14} /> AI campus brief
            </p>
            <p className="mm-org-ai-box__body">{insight.summary}</p>
            <ul className="mt-2 mb-0 list-disc space-y-1 pl-5 text-sm mm-org-text">
              {(insight.actions || []).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p className="mm-org-ai-box__meta">
              {insight.source === 'heuristic'
                ? 'Heuristic brief from live aggregates. Deep OpenAI (gpt-4.1) when API key is configured.'
                : `Deep analysis · ${insight.model || 'gpt-4.1'}`}
            </p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-5">
          <section className="mm-org-panel lg:col-span-5">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Branch insights</h2>
                <p className="mm-org-panel__meta">
                  Aptitude, skills, and interview by branch — click a row to drill into students
                </p>
              </div>
              <Link to={orgPaths.performance} className="mm-org-link text-xs">
                Full analytics →
              </Link>
            </div>
            <BranchInsightsPanel
              rankings={metrics.branchPillarRankings || {}}
              byDept={metrics.byDept || []}
            />
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          <section className="mm-org-panel lg:col-span-5">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Branch comparison</h2>
                <p className="mm-org-panel__meta">
                  Readiness, coverage, bands, and mentor status — weakest branches first
                </p>
              </div>
              <Link to={orgPaths.departments} className="mm-org-link text-xs">
                {canEdit ? 'Manage departments →' : 'View departments →'}
              </Link>
            </div>
            <DeptReadinessTable
              departments={metrics.byDept || []}
              onSelectDept={(d) => navigate(`${orgPaths.performance}?dept=${d.id}`)}
            />
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <AtRiskPanel
            students={metrics.atRisk || []}
            scopeLabel="campus-wide"
          />
          <section className="mm-org-panel">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Leaderboard</h2>
                <p className="mm-org-panel__meta">Top readiness scores</p>
              </div>
              <BarChart3 size={16} className="mm-org-icon-accent" />
            </div>
            {metrics.leaders.length ? (
              <ul className="m-0 list-none space-y-3 p-0">
                {metrics.leaders.map((s, idx) => (
                  <li key={s.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="m-0 truncate text-sm font-bold mm-org-text">
                        {idx + 1}. {s.name}
                      </p>
                      <p className="m-0 truncate text-xs mm-org-text-muted">
                        {s.departmentName || 'Unassigned'}
                        {s.testsDone != null ? ` · ${s.testsDone} tests` : ''}
                      </p>
                    </div>
                    <span className="mm-org-badge mm-org-badge--active">{s.readiness}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mm-org-empty">Approve enrolled students to see rankings.</div>
            )}
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="mm-org-panel">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">{canEdit ? 'Quick actions' : 'Explore'}</h2>
                <p className="mm-org-panel__meta">
                  {canEdit ? 'Assign programs, notify events, manage enrollment' : 'Read-only analytics links'}
                </p>
              </div>
              <Sparkles size={16} className="mm-org-icon-warn" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(canEdit
                ? [
                    { to: orgPaths.programs, label: 'Assign program / mock', icon: ClipboardList },
                    { to: orgPaths.drives, label: 'Notify event / workshop', icon: Bell },
                    { to: orgPaths.enrollment, label: 'Enrollment queue', icon: UserPlus },
                    { to: orgPaths.departments, label: 'Departments & HODs', icon: Building2 },
                  ]
                : [
                    { to: orgPaths.performance, label: 'Scorecards & export', icon: BarChart3 },
                    { to: orgPaths.departments, label: 'Department roster', icon: Building2 },
                  ]
              ).map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.to} to={a.to} className="mm-org-btn mm-org-btn--ghost" style={{ justifyContent: 'flex-start' }}>
                    <Icon size={15} /> {a.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mm-org-panel">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Attention</h2>
                <p className="mm-org-panel__meta">Gaps that need a TPO decision</p>
              </div>
              <AlertTriangle size={16} className="mm-org-icon-warn" />
            </div>
            <ul className="m-0 list-none space-y-3 p-0 text-sm mm-org-text-muted">
              <li>
                {metrics.pendingInvites
                  ? `${metrics.pendingInvites} student invite(s) waiting for approval.`
                  : 'Enrollment queue is clear.'}
              </li>
              <li>
                {metrics.weak
                  ? `${metrics.weak} student(s) are less prepared (&lt;50%) — assign a readiness test or AI mock.`
                  : 'No students flagged as needing support yet.'}
              </li>
              <li>
                {metrics.hodGaps
                  ? `${metrics.hodGaps} department(s) still need an HOD / mentor invite.`
                  : 'Department mentors are assigned or invited.'}
              </li>
            </ul>
          </section>
        </div>
      </div>
    );
  }

  if (role === ORG_ROLES.HOD) {
    const hm = hodMetrics;
    const dept = hodSnap.department;
    const hTotal = Math.max(1, hm?.students || 0);
    const hBand = {
      strong: Math.round(((hm?.bands?.strong || hm?.strong || 0) / hTotal) * 100),
      mid: Math.round(((hm?.bands?.mid || hm?.mid || 0) / hTotal) * 100),
      weak: Math.round(((hm?.bands?.weak || hm?.weak || 0) / hTotal) * 100),
    };

    if (!dept) {
      return (
        <div className="mm-org-panel">
          <span className="mm-org-pill">
            <Users size={12} /> Department mentor
          </span>
          <h2 className="mm-org-section-title mt-3 mb-2">
            Welcome{session?.name ? `, ${session.name.split(' ')[0]}` : ''}.
          </h2>
          <p className="m-0 text-sm mm-org-text-muted">
            Your HOD account is active, but no department is linked yet. Ask your TPO to invite you
            on a branch (or re-activate with the invite link). Then you can mentor students, assign
            assessments, and notify your batch.
          </p>
        </div>
      );
    }

    const cards = [
      { label: 'Students', value: hm?.students ?? 0, icon: Users, hint: dept.name },
      {
        label: 'Scored',
        value: `${hm?.studentsScored ?? Math.max(0, (hm?.students ?? 0) - (hm?.unscored ?? 0))}/${hm?.students ?? 0}`,
        icon: BarChart3,
        hint: `${Math.round(hm?.coveragePct ?? 0)}% coverage`,
      },
      {
        label: 'Drive-ready',
        value: hm?.strong ?? hm?.bands?.strong ?? 0,
        icon: Sparkles,
        hint: '≥75% readiness',
      },
      { label: 'Less prepared', value: hm?.weak ?? hm?.bands?.weak ?? 0, icon: AlertTriangle, hint: '< 50%' },
      { label: 'Pending invites', value: hm?.pendingInvites ?? 0, icon: UserPlus, hint: 'Enrollment queue' },
    ];

    const branchRoster =
      hodScorecards.length > 0
        ? hodScorecards
        : hodStudents.map((s) => ({
            ...s,
            testsDone: s.testsDone ?? 0,
            testsRemaining: s.testsRemaining ?? 8,
            progressLevel: s.progressLevel ?? 0,
            activityStatus: s.activityStatus || 'never',
          }));

    return (
      <div className="space-y-6">
        <div className="mm-org-hero mm-org-hero--solo">
          <motion.div
            className="mm-org-hero__card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="mm-org-pill">
              <Users size={12} /> {dept.code || 'Branch'} · Mentor
              {hodDataSource === 'api' ? ' · Live' : hodDataSource === 'local' ? ' · Demo' : ''}
            </span>
            <h2 className="mm-org-hero__title">
              {dept.name}
              <span className="mm-org-hero__muted"> readiness</span>
            </h2>
            <p className="mm-org-hero__body">
              Mentor your batch like a branch head: spot less-prepared students, assign aptitude / skill /
              English / technical checks and mock interviews, and keep the department informed.
            </p>
            <div className="mm-org-hero__actions">
              <Link to={orgPaths.students} className="mm-org-btn mm-org-btn--primary">
                Students <ArrowRight size={15} />
              </Link>
              <Link to={orgPaths.programs} className="mm-org-btn mm-org-btn--ghost">
                Assign assessment
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mm-org-stat-grid">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.label}
                className="mm-org-stat"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35, ease: EASE }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="mm-org-stat__label">{c.label}</p>
                  <Icon size={16} className="mm-org-text-muted" style={{ opacity: 0.85 }} />
                </div>
                <p className="mm-org-stat__value">{c.value}</p>
                <p className="mm-org-stat__hint">{c.hint}</p>
              </motion.div>
            );
          })}
        </div>

        <PrepSnapshot
          scope="branch"
          scopeLabel={dept.name}
          metrics={hm}
        />

        <div className="grid gap-5 lg:grid-cols-5">
          <section className="mm-org-panel lg:col-span-2">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Readiness bands</h2>
                <p className="mm-org-panel__meta">Your branch only</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { key: 'strong', label: 'Drive-ready (≥75%)', pct: hBand.strong, count: hm?.strong },
                { key: 'mid', label: 'Developing (50–74%)', pct: hBand.mid, count: hm?.mid },
                { key: 'weak', label: 'Less prepared (<50%)', pct: hBand.weak, count: hm?.weak },
              ].map((b) => (
                <div key={b.key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="mm-org-band-label">{b.label}</span>
                    <span className="mm-org-text-muted">
                      {b.count ?? 0} · {b.pct}%
                    </span>
                  </div>
                  <div className="mm-org-progress">
                    <motion.div
                      className="mm-org-progress__bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mm-org-label">Top gaps</p>
                <ul className="m-0 list-none space-y-1.5 p-0">
                  {(hm?.topGaps || []).length ? (
                    hm.topGaps.map((g) => (
                      <li key={g.label} className="text-sm mm-org-text">
                        {g.label}{' '}
                        <span className="mm-org-text-muted">({g.count})</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm mm-org-text-muted">
                      Enroll students to see gaps.
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <p className="mm-org-label">Top strengths</p>
                <ul className="m-0 list-none space-y-1.5 p-0">
                  {(hm?.topStrengths || []).length ? (
                    hm.topStrengths.map((g) => (
                      <li key={g.label} className="text-sm mm-org-text">
                        {g.label}{' '}
                        <span className="mm-org-text-muted">({g.count})</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm mm-org-text-muted">
                      —
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section className="mm-org-panel lg:col-span-3">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Branch brief</h2>
                <p className="mm-org-panel__meta">
                  {hodInsight?.source === 'openai' ? 'OpenAI deep analysis' : 'Heuristic / live scores'}
                </p>
              </div>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                onClick={runHodInsight}
                disabled={aiBusy}
              >
                <Wand2 size={14} /> {aiBusy ? 'Updating…' : 'Refresh'}
              </button>
            </div>
            <div className="mm-org-ai-box">
              <p className="mm-org-ai-box__title">
                <Sparkles size={14} /> Mentor focus
              </p>
              <p className="mm-org-ai-box__body">{hodInsight?.summary}</p>
              <ul className="mt-3 mb-0 space-y-1.5 pl-4 text-sm mm-org-text">
                {(hodInsight?.actions || []).map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <ClarityBoard clarity={hm?.clarity} insight={hodInsight} />
            </div>

            <div className="mt-4 mm-org-dash-analytics">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mm-org-stat__label mb-2">Readiness mix</p>
                <ReadinessPie
                  bands={{
                    strong: hm?.bands?.strong || hm?.strong || 0,
                    mid: hm?.bands?.mid || hm?.mid || 0,
                    weak: hm?.bands?.weak || hm?.weak || 0,
                    unscored: hm?.unscored || 0,
                  }}
                  avgReadiness={hm?.avgReadiness}
                />
              </div>
              <div>
                <p className="mm-org-stat__label mb-2">Pillar averages</p>
                <PillarComparisonBars pillars={hm?.pillars || {}} avgMock={hm?.avgMock} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mm-org-stat__label mb-2">Activity pulse</p>
                <ActivityEngagementPie
                  active={hm?.active7d || 0}
                  idle={hm?.idleCount || 0}
                  inactive={hm?.inactive14d || 0}
                  never={hm?.neverStarted || 0}
                />
              </div>
              <div>
                <p className="mm-org-stat__label mb-2">Branch gaps</p>
                <ThemeFrequencyBars
                  items={hm?.topGaps || []}
                  tone="bad"
                  empty="Gaps appear after scored attempts."
                />
              </div>
            </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mm-org-label">Less-prepared students</p>
                {(hm?.atRisk || []).length ? (
                  <ul className="m-0 list-none space-y-2 p-0">
                    {hm.atRisk.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-semibold mm-org-text">
                          {s.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="mm-org-badge mm-org-badge--danger">{s.readiness}%</span>
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                            onClick={() => setAssignStudent(s)}
                          >
                            Assign
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-sm mm-org-text-muted">
                    No less-prepared students in this band — keep weekly checks going.
                  </p>
                )}
              </div>
              <div>
                <p className="mm-org-label">Branch leaders</p>
                {(hm?.leaders || []).length ? (
                  <ul className="m-0 list-none space-y-2 p-0">
                    {hm.leaders.slice(0, 5).map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-semibold mm-org-text">
                          {s.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="mm-org-badge mm-org-badge--active">{s.readiness}%</span>
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                            onClick={() => setAssignStudent(s)}
                          >
                            Assign
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-sm mm-org-text-muted">
                    Leaders appear after enrollment.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { to: orgPaths.programs, label: 'Programs & assessments', icon: ClipboardList },
                { to: orgPaths.notify, label: 'Notify branch', icon: Bell },
                { to: orgPaths.performance, label: 'Full scorecards', icon: BarChart3 },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.to} to={a.to} className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm">
                    <Icon size={14} /> {a.label}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {(hm?.toolCoverage || []).length ? (
          <section className="mm-org-panel">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Assessment week progress</h2>
                <p className="mm-org-panel__meta">
                  Baseline assessments completed across {dept.name}
                </p>
              </div>
            </div>
            <ToolCoverageStacked tools={hm.toolCoverage} />
          </section>
        ) : null}

        <AtRiskPanel
          students={hm?.atRisk || []}
          scopeLabel={dept.name}
          showAssign
          onAssign={(s) => {
            setAssignFlash('');
            setAssignStudent(s);
          }}
        />

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Student scorecards</h2>
              <p className="mm-org-panel__meta">
                Live readiness from student portal activity — assign mocks from here
              </p>
            </div>
            <Link to={orgPaths.performance} className="mm-org-link text-xs">
              Full analytics →
            </Link>
          </div>
          {assignFlash ? (
            <div className="mm-org-alert mm-org-alert--success mb-3">{assignFlash}</div>
          ) : null}
          {branchRoster?.length ? (
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Readiness</th>
                    <th>Mock</th>
                    <th>Tests</th>
                    <th>Level</th>
                    <th>Strength</th>
                    <th>Prep gap</th>
                    <th>Activity</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {[...branchRoster]
                    .sort((a, b) => (Number(b.readiness) || 0) - (Number(a.readiness) || 0))
                    .map((s) => (
                      <tr key={s.id}>
                        <td>
                          <p className="mm-org-table__title">{s.name}</p>
                          <p className="mm-org-table__meta">{s.email}</p>
                        </td>
                        <td>
                          <span
                            className={`mm-org-badge ${
                              (s.readiness ?? 0) >= 75
                                ? 'mm-org-badge--active'
                                : (s.readiness ?? 0) < 50
                                  ? 'mm-org-badge--danger'
                                  : 'mm-org-badge--pending'
                            }`}
                          >
                            {s.readiness == null ? '—' : `${Math.round(s.readiness)}%`}
                          </span>
                        </td>
                        <td>{s.mockScore == null ? '—' : `${Math.round(s.mockScore)}%`}</td>
                        <td className="mm-org-text-muted">
                          {s.testsDone ?? 0}/{((s.testsDone || 0) + (s.testsRemaining || 0)) || 8}
                        </td>
                        <td>L{s.progressLevel || 0}</td>
                        <td className="mm-org-text">{s.strength || '—'}</td>
                        <td className="mm-org-text">{s.weakness || '—'}</td>
                        <td className="mm-org-text-muted">{s.activityStatus || (s.activities ?? 0)}</td>
                        <td>
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                            onClick={() => {
                              setAssignFlash('');
                              setAssignStudent(s);
                            }}
                            disabled={!hodSnap.access?.canAssignPrograms}
                            title={
                              hodSnap.access?.canAssignPrograms
                                ? 'Assign assessment'
                                : 'Assignment disabled by TPO'
                            }
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mm-org-empty">
              No students in your branch yet. Invite them from Students.
            </div>
          )}
        </section>

        {assignStudent ? (
          <AssignToStudentModal
            student={assignStudent}
            departmentId={dept.id}
            onClose={() => setAssignStudent(null)}
            onAssigned={(title) => {
              setAssignFlash(`Assigned “${title}” to ${assignStudent.name}.`);
              window.setTimeout(() => setAssignFlash(''), 4000);
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="mm-org-panel">
      <h2 className="mm-org-section-title">Welcome.</h2>
      <p className="m-0 mt-2 text-sm mm-org-text-muted">
        Student workspace scaffolding continues after TPO and HOD portals.
      </p>
    </div>
  );
}
