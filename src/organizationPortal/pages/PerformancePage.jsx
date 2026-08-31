import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, Filter } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isHodRole } from '../roles';
import { resolveHodDepartment } from '../hodScope';
import { fetchDepartmentOptions } from '../departmentsApi';
import {
  fetchPerformanceScorecards,
  fetchPerformanceSummary,
  fetchPerformanceTrends,
  readinessTone,
  formatPct,
  scorecardsToUiRows,
  summaryToUiMetrics,
  trendsToUiSeries,
  OrgApiError,
} from '../performanceApi';
import { exportPerformanceCsv, exportPerformancePdf } from '../performanceExport';
import { filterStudentsByDrill } from '../hodPerformanceUtils';
import {
  ChartCard,
  ActivityEngagementPie,
  CoverageDonut,
  DeptCompareChart,
  DeptPillarCompareChart,
  DeptReadinessRankChart,
  DriveReadyByDeptChart,
  ExecutivePillarKpis,
  ExecutivePillarRadar,
  GapStrengthPieCharts,
  PillarComparisonBars,
  PillarRadialChart,
  PerformanceTrendChart,
  ReadinessDistributionChart,
  ReadinessPie,
  TestsCompletionChart,
  TestsFunnelChart,
  ToolCoverageStacked,
} from '../components/AnalyticsCharts';
import DrillableChartCard from '../components/DrillableChartCard';
import ChartDrilldownModal from '../components/ChartDrilldownModal';
import HodAiResearchPanel from '../components/HodAiResearchPanel';
import HodAreaBoardsPanel from '../components/HodAreaBoardsPanel';
import DeptReadinessTable from '../components/DeptReadinessTable';
import StudentScorecardDrawer from '../components/StudentScorecardDrawer';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';
import {
  getHodMetrics,
  getTpoMetrics,
  listStudents,
} from '../store';

const EASE = [0.22, 1, 0.36, 1];

function SectionHead({ title, meta }) {
  return (
    <div className="mm-org-perf-section__head">
      <h2 className="mm-org-perf-section__title">{title}</h2>
      {meta ? <p className="mm-org-perf-section__meta">{meta}</p> : null}
    </div>
  );
}

function RankList({ title, items, tone, onSelectStudent }) {
  if (!items?.length) {
    return (
      <section className="mm-org-panel mm-org-panel--rank">
        <h2 className="mm-org-panel__title">{title}</h2>
        <div className="mm-org-empty">No ranked students in this slice yet.</div>
      </section>
    );
  }
  return (
    <section className="mm-org-panel mm-org-panel--rank">
      <h2 className="mm-org-panel__title">{title}</h2>
      <ul className="m-0 list-none space-y-2 p-0">
        {items.map((s) => (
          <li key={`${tone}-${s.id}`}>
            <button
              type="button"
              className="mm-org-list-card text-sm mm-org-list-card--btn w-full text-left"
              onClick={() => onSelectStudent?.(s)}
            >
              <div className="min-w-0">
                <p className="m-0 truncate font-bold mm-org-text">
                  #{s.rank} {s.name}
                </p>
                <p className="m-0 truncate text-xs mm-org-text-muted">
                  {s.departmentName || '—'}
                  {s.testsDone != null ? ` · ${s.testsDone} tests` : ''}
                  {s.weakness && tone === 'prep' ? ` · gap: ${s.weakness}` : ''}
                  {s.strength && tone === 'top' ? ` · ${s.strength}` : ''}
                </p>
              </div>
              <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(s.score)}`}>
                {s.score == null ? '—' : `${Math.round(s.score)}%`}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PerformancePage() {
  const session = getOrgSession();
  const location = useLocation();
  const hod = isHodRole(session?.role);
  const [hodDept, setHodDept] = useState(() => (hod ? resolveHodDepartment(session) : null));
  const [metrics, setMetrics] = useState(() =>
    hod && resolveHodDepartment(session)
      ? getHodMetrics(resolveHodDepartment(session).id)
      : getTpoMetrics()
  );
  const [students, setStudents] = useState(() => (session?.demo ? listStudents() : []));
  const [dataSource, setDataSource] = useState('local');
  const [loadError, setLoadError] = useState('');
  const [deptFilter, setDeptFilter] = useState(() => (hod ? resolveHodDepartment(session)?.id || '' : ''));
  const [deptOptions, setDeptOptions] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(!session?.demo);
  const [trendPoints, setTrendPoints] = useState([]);
  const [drilldown, setDrilldown] = useState(null);

  const openDrill = useCallback((config) => {
    setDrilldown(config);
  }, []);

  const closeDrill = useCallback(() => setDrilldown(null), []);

  const drillStudents = useMemo(() => {
    if (!drilldown?.drill) return students;
    return filterStudentsByDrill(students, drilldown.drill);
  }, [students, drilldown]);

  const renderDrillChart = useCallback(
    (chartKey) => {
      switch (chartKey) {
        case 'readiness':
          return (
            <ReadinessPie
              bands={metrics.bands || metrics}
              avgReadiness={metrics.avgReadiness}
              onSliceClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Who is placement-ready?',
                        meta: 'Readiness band breakdown',
                        chartKey: 'readiness',
                        drill,
                      })
                  : undefined
              }
            />
          );
        case 'activity':
          return (
            <ActivityEngagementPie
              active={metrics.active7d}
              idle={metrics.idleCount}
              inactive={metrics.inactive14d}
              never={metrics.neverStarted}
              onSliceClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Who is actively preparing?',
                        meta: 'Activity in the last 2 weeks',
                        chartKey: 'activity',
                        drill,
                      })
                  : undefined
              }
            />
          );
        case 'distribution':
          return (
            <ReadinessDistributionChart
              students={students}
              onBarClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Score spread',
                        meta: 'Readiness distribution',
                        chartKey: 'distribution',
                        drill,
                      })
                  : undefined
              }
            />
          );
        case 'gaps':
          return (
            <GapStrengthPieCharts
              gaps={metrics.topGaps || []}
              strengths={metrics.topStrengths || []}
              onSliceClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Top strengths & gaps',
                        meta: drill?.type === 'gap' ? 'Preparation gap theme' : 'Strength theme',
                        chartKey: 'gaps',
                        drill,
                      })
                  : undefined
              }
            />
          );
        case 'trends':
          return <PerformanceTrendChart points={trendPoints} />;
        case 'toolCoverage':
          return <ToolCoverageStacked tools={metrics.toolCoverage || []} />;
        case 'funnel':
          return <TestsFunnelChart funnel={metrics.levelFunnel || []} />;
        default:
          return null;
      }
    },
    [hod, metrics, students, trendPoints, openDrill]
  );

  const ChartShell = useCallback(
    ({ title, meta, chartKey, drill, children, tall }) => {
      if (!hod) {
        return (
          <ChartCard title={title} meta={meta} tall={tall}>
            {children}
          </ChartCard>
        );
      }
      return (
        <DrillableChartCard
          title={title}
          meta={meta}
          tall={tall}
          onDrillDown={() =>
            openDrill({
              title,
              meta,
              chartKey,
              drill: drill || { type: 'all' },
            })
          }
        >
          {children}
        </DrillableChartCard>
      );
    },
    [hod, openDrill]
  );

  const openStudent = useCallback(
    (row) => {
      const full = students.find((s) => String(s.id) === String(row.id));
      setSelectedStudent(full || row);
    },
    [students]
  );

  const loadLive = useCallback(async (deptId, opts = {}) => {
    const boardLimit = opts.boardLimit ?? 10;
    const loadOpts = {
      ...(deptId ? { departmentId: deptId } : {}),
      boardLimit,
    };
    const summary = await fetchPerformanceSummary(loadOpts);
    const ui = summaryToUiMetrics(summary);
    if (!ui) {
      throw new OrgApiError('Performance summary returned empty data.', { status: 502 });
    }
    setMetrics(ui);
    let cardPayload = { items: summary?.scorecards || [] };
    if (!cardPayload.items.length) {
      cardPayload = await fetchPerformanceScorecards(deptId ? { departmentId: deptId } : {}).catch(() => ({
        items: [],
      }));
    }
    setStudents(scorecardsToUiRows(cardPayload));
    setDataSource('api');
    setLoadError('');
    return ui;
  }, []);

  const scopeFilterKey = hod ? 'hod' : String(deptFilter || '');

  const applyLocalFallback = useCallback(() => {
    const filterId = hod ? hodDept?.id || deptFilter : deptFilter || null;
    if (hod && filterId) {
      setMetrics(getHodMetrics(filterId));
      setStudents(
        listStudents().filter((s) => String(s.departmentId) === String(filterId))
      );
    } else {
      setMetrics(getTpoMetrics(filterId || null));
      const all = listStudents();
      setStudents(
        filterId
          ? all.filter((s) => String(s.departmentId) === String(filterId))
          : all
      );
    }
    setDataSource('local');
  }, [hod, hodDept?.id, deptFilter]);

  useEffect(() => {
    if (hod) return;
    const dept = new URLSearchParams(location.search).get('dept');
    if (dept) setDeptFilter(dept);
  }, [location.search, hod]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        let deptId = null;
        if (hod) {
          const deptRes = await fetchDepartmentOptions();
          if (cancelled) return;
          const dept = resolveHodDepartment(getOrgSession(), deptRes.departments || []);
          setHodDept(dept);
          if (!dept?.id) return;
          deptId = dept.id;
          setDeptFilter((prev) => (String(prev) === String(dept.id) ? prev : dept.id));
          if (session?.demo) {
            const filterId = hod ? deptId : deptFilter || null;
            const m = hod ? getHodMetrics(deptId) : getTpoMetrics(filterId || null);
            const all = listStudents();
            setMetrics(m);
            setStudents(
              filterId
                ? all.filter((s) => String(s.departmentId) === String(filterId))
                : all
            );
            setDataSource('local');
            return;
          }
        } else {
          const deptRes = await fetchDepartmentOptions().catch(() => ({ departments: [] }));
          if (cancelled) return;
          setDeptOptions(
            (deptRes.departments || []).map((d) => ({ id: String(d.id), name: d.name, code: d.code }))
          );
          if (session?.demo) {
            const filterId = deptFilter || null;
            setMetrics(getTpoMetrics(filterId || null));
            const all = listStudents();
            setStudents(
              filterId
                ? all.filter((s) => String(s.departmentId) === String(filterId))
                : all
            );
            setDataSource('local');
            return;
          }
          deptId = deptFilter || null;
        }

        await loadLive(deptId, { boardLimit: hod ? 25 : 10 });
        if (hod && deptId && !session?.demo) {
          try {
            const trends = await fetchPerformanceTrends({ departmentId: deptId, days: 30 });
            if (!cancelled) setTrendPoints(trendsToUiSeries(trends));
          } catch {
            if (!cancelled) setTrendPoints([]);
          }
        }
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof OrgApiError ? err.message : 'Could not load live performance.');
        applyLocalFallback();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hod, session?.demo, session?.department_id, scopeFilterKey, reloadKey, loadLive, location.key, applyLocalFallback]);

  const scorecardTable = useTableQuery(students, {
    searchKeys: ['name', 'email', 'departmentName'],
    initialSort: { key: 'readiness', direction: 'desc' },
    getSortValue: (row, key) => {
      if (key === 'name') return (row.name || row.email || '').toLowerCase();
      if (key === 'department') return row.departmentName || '';
      if (key === 'readiness') return row.readiness;
      if (key === 'shortlist') return row.shortlistScore;
      if (key === 'bestArea') return row.bestArea;
      if (key === 'strength') return row.strength;
      if (key === 'weakness') return row.weakness;
      if (key === 'tests') return row.testsDone;
      if (key === 'level') return row.progressLevel;
      if (key === 'activity') return row.activityStatus;
      return row[key];
    },
  });

  const resolvedDeptOptions = useMemo(() => {
    if (hod) return [];
    if (deptOptions.length) return deptOptions;
    return (metrics.byDept || []).map((d) => ({ id: String(d.id), name: d.name, code: d.code }));
  }, [deptOptions, metrics.byDept, hod]);

  if (hod && !hodDept) {
    return (
      <div className="mm-org-panel">
        <h2 className="mm-org-panel__title">Branch not linked</h2>
        <p className="m-0 text-sm mm-org-text-muted">
          Performance analytics appear once your HOD account is linked to a department.
        </p>
      </div>
    );
  }

  const scopeLabel = hod
    ? hodDept.name
    : deptFilter
      ? resolvedDeptOptions.find((d) => String(d.id) === String(deptFilter))?.name || 'Department'
      : session?.organization_name || 'Campus';

  const exportScopeSlug = hod ? hodDept.code || 'branch' : scopeLabel;

  return (
    <div className={`space-y-5 mm-org-perf mm-org-perf--exec${hod ? ' mm-org-perf--hod' : ''}`} id="mm-org-performance-report">
      <div className="mm-org-toolbar">
        <div>
          <h1 className="m-0 text-xl font-bold mm-org-text">
            {hod ? 'Branch deep analytics' : 'Performance dashboard'}
          </h1>
          <p className="m-0 mt-1 text-sm mm-org-text-muted">
            {scopeLabel} ·{' '}
            {hod
              ? 'Deep department analysis with drill-down & AI research'
              : 'Readiness for leadership, dean & HR partners'}
            {dataSource === 'api' ? ' · Live' : ' · Demo / local'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {!hod ? (
            <label className="mm-org-filter">
              <Filter size={14} />
              <select
                className="mm-org-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                aria-label="Filter by department"
              >
                <option value="">All departments</option>
                {resolvedDeptOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={() => setReloadKey((k) => k + 1)}>
            Reload
          </button>
          <button
            type="button"
            className="mm-org-btn mm-org-btn--ghost"
            disabled={!students.length}
            onClick={() =>
              exportPerformanceCsv(students, {
                filenamePrefix: 'mentormuni-readiness',
                scopeLabel: exportScopeSlug,
              })
            }
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            type="button"
            className="mm-org-btn mm-org-btn--primary"
            onClick={() =>
              exportPerformancePdf({
                metrics: metrics,
                scopeLabel,
                organizationName: session?.organization_name,
                generatedAt: metrics.generatedAt,
              })
            }
          >
            <FileText size={15} /> Export PDF
          </button>
        </div>
      </div>

      {loadError ? (
        <div className="mm-org-alert mm-org-alert--error" role="alert">
          {loadError}
        </div>
      ) : null}

      {loading ? (
        <div className="mm-org-panel mm-org-panel--loading" aria-busy="true">
          <p className="m-0 text-sm mm-org-text-muted">Loading readiness analytics…</p>
        </div>
      ) : null}

      <div className={loading ? 'mm-org-perf__content mm-org-perf__content--loading' : 'mm-org-perf__content'}>
      {hod ? (
        <HodAiResearchPanel
          metrics={metrics}
          demo={session?.demo || dataSource === 'local'}
          departmentId={hodDept?.id}
          scopeLabel={scopeLabel}
        />
      ) : null}

      {hod ? (
        <HodAreaBoardsPanel
          boards={metrics.areaBoards || []}
          onSelectStudent={openStudent}
          onDrillArea={(areaDrill) =>
            openDrill({
              title: areaDrill.title,
              meta: areaDrill.label,
              chartKey: null,
              drill: {
                type: 'area_board',
                tier: areaDrill.tier,
                studentIds: areaDrill.studentIds,
                title: areaDrill.title,
              },
            })
          }
        />
      ) : null}

      {hod ? (
        <section className="mm-org-perf-section" aria-label="Branch trends and coverage">
          <SectionHead
            title="Branch trends & tool coverage"
            meta="30-day readiness trend plus per-check completion across your department"
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartShell title="Readiness trend (30 days)" meta="Avg readiness, coverage, and drive-ready %" chartKey="trends">
              <PerformanceTrendChart points={trendPoints} />
            </ChartShell>
            <ChartShell
              title="Tool completion by check"
              meta="Done vs in-progress vs not started — per baseline tool"
              chartKey="toolCoverage"
              drill={{ type: 'all' }}
            >
              <ToolCoverageStacked tools={metrics.toolCoverage || []} />
            </ChartShell>
          </div>
          {(metrics.levelFunnel || []).length ? (
            <div className="mt-5">
              <ChartShell
                title="Roadmap level funnel"
                meta="How many students reached each roadmap level"
                chartKey="funnel"
                drill={{ type: 'all' }}
              >
                <TestsFunnelChart funnel={metrics.levelFunnel || []} />
              </ChartShell>
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mm-org-stat-grid mm-org-stat-grid--exec">
        {[
          {
            label: 'Overall readiness',
            value: formatPct(metrics.avgReadiness),
            hint: `${metrics.studentsScored || 0} students scored`,
          },
          {
            label: 'Drive-ready',
            value: `${Math.round(metrics.driveReadyOfScoredPct || 0)}%`,
            hint: `${metrics.strong || 0} at ≥75%`,
          },
          {
            label: 'Score coverage',
            value: `${Math.round(metrics.coveragePct || 0)}%`,
            hint: `${metrics.studentsScored || 0}/${metrics.students || 0} roster`,
          },
          {
            label: 'Voice AI mock',
            value: formatPct(metrics.avgMock),
            hint: 'Skill + interview mocks',
          },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            className="mm-org-stat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i, duration: 0.35, ease: EASE }}
          >
            <p className="mm-org-stat__label">{c.label}</p>
            <p className="mm-org-stat__value">{c.value}</p>
            <p className="mm-org-stat__hint">{c.hint}</p>
          </motion.div>
        ))}
      </div>

      <section className="mm-org-panel mm-org-panel--exec-pillars">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Readiness pillars</h2>
            <p className="mm-org-panel__meta">
              Aptitude · skills · interview · voice AI mock · communication (campus average)
            </p>
          </div>
        </div>
        <ExecutivePillarKpis pillars={metrics.pillars || {}} avgMock={metrics.avgMock} />
      </section>

      <section className="mm-org-perf-section" aria-label="Cohort visual analytics">
        <SectionHead
          title="Cohort snapshot"
          meta="Readiness mix, assessment coverage, and student activity at a glance"
        />
        <div className="mm-org-chart-grid mm-org-chart-grid--3">
          <ChartShell
            title="Who is placement-ready?"
            meta="Share of students in each readiness band — click a slice to drill down"
            chartKey="readiness"
            drill={{ type: 'all' }}
          >
            <ReadinessPie
              bands={metrics.bands || metrics}
              avgReadiness={metrics.avgReadiness}
              onSliceClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Who is placement-ready?',
                        meta: 'Readiness band',
                        chartKey: 'readiness',
                        drill,
                      })
                  : undefined
              }
            />
          </ChartShell>
          <ChartCard title="Who has been assessed?" meta="Students with at least one readiness score">
            <CoverageDonut
              studentsScored={metrics.studentsScored}
              students={metrics.students}
              coveragePct={metrics.coveragePct}
            />
          </ChartCard>
          <ChartShell
            title="Who is actively preparing?"
            meta="Login and practice activity — click a slice for student list"
            chartKey="activity"
            drill={{ type: 'all' }}
          >
            <ActivityEngagementPie
              active={metrics.active7d}
              idle={metrics.idleCount}
              inactive={metrics.inactive14d}
              never={metrics.neverStarted}
              onSliceClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Who is actively preparing?',
                        meta: 'Activity band',
                        chartKey: 'activity',
                        drill,
                      })
                  : undefined
              }
            />
          </ChartShell>
        </div>
      </section>

      <section className="mm-org-perf-section" aria-label="Pillar visual analytics">
        <SectionHead
          title="Pillar analysis"
          meta="Compare aptitude, skills, interview, voice mock, and communication"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="Skill balance" meta="Bigger shape = more even strengths across all five areas">
            <ExecutivePillarRadar pillars={metrics.pillars || {}} avgMock={metrics.avgMock} />
          </ChartCard>
          <ChartCard title="Which skills lead?" meta="Easiest chart — higher bar = stronger campus average">
            <PillarComparisonBars pillars={metrics.pillars || {}} avgMock={metrics.avgMock} />
          </ChartCard>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 mt-5">
          <ChartCard title="Pillar scores (ranked)" meta="Exact percentages — best for presentations">
            <PillarRadialChart pillars={metrics.pillars || {}} avgMock={metrics.avgMock} />
          </ChartCard>
          <ChartCard title="Baseline checks completed" meta="Average roadmap progress per student (8 checks total)">
            <TestsCompletionChart tests={metrics.tests} studentsScored={metrics.studentsScored} />
          </ChartCard>
        </div>
      </section>

      <section className="mm-org-perf-section" aria-label="Student distribution">
        <SectionHead title="Student insights" meta="Distribution and preparation themes" />
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartShell
            title="Score spread"
            meta="Click a bar to see students in that range"
            chartKey="distribution"
            drill={{ type: 'all' }}
          >
            <ReadinessDistributionChart
              students={students}
              onBarClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Score spread',
                        meta: 'Readiness range',
                        chartKey: 'distribution',
                        drill,
                      })
                  : undefined
              }
            />
          </ChartShell>
          <ChartShell
            title="Top strengths & gaps"
            meta="Click a slice to list students with that theme"
            chartKey="gaps"
            drill={{ type: 'all' }}
          >
            <GapStrengthPieCharts
              gaps={metrics.topGaps || []}
              strengths={metrics.topStrengths || []}
              onSliceClick={
                hod
                  ? (drill) =>
                      openDrill({
                        title: 'Top strengths & gaps',
                        meta: drill?.type === 'gap' ? 'Preparation gap' : 'Strength',
                        chartKey: 'gaps',
                        drill,
                      })
                  : undefined
              }
            />
          </ChartShell>
        </div>
      </section>

      {(metrics.byDept || []).length > 0 ? (
        <section className="mm-org-perf-section" aria-label="Department comparison">
          <SectionHead
            title="Department comparison"
            meta={hod ? 'Your branch vs campus pillars' : 'Branch-wise readiness for dean, director & HR'}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard
              title="Skills by branch"
              meta="Compare aptitude, interview, mocks & communication across departments"
            >
              <DeptPillarCompareChart departments={metrics.byDept || []} showExecutive />
            </ChartCard>
            <ChartCard title="Students per band" meta="Count of drive-ready, developing, and needs-support per branch">
              <DeptCompareChart departments={metrics.byDept || []} />
            </ChartCard>
          </div>
          {!hod || (metrics.byDept || []).length > 1 ? (
            <div className="grid gap-5 lg:grid-cols-2 mt-5">
              <ChartCard title="Branch leaderboard" meta="Highest average readiness at the top">
                <DeptReadinessRankChart departments={metrics.byDept || []} />
              </ChartCard>
              <ChartCard title="Placement-ready %" meta="% of assessed students at 75%+ in each branch">
                <DriveReadyByDeptChart departments={metrics.byDept || []} />
              </ChartCard>
            </div>
          ) : null}
        </section>
      ) : null}

      {!hod && (metrics.byDept || []).length > 0 ? (
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Department summary</h2>
              <p className="mm-org-panel__meta">Branch-wise readiness for dean, director & HR review</p>
            </div>
          </div>
          <DeptReadinessTable
            departments={metrics.byDept || []}
            onSelectDept={(d) => setDeptFilter(String(d.id))}
          />
        </section>
      ) : null}

      {(metrics.leaders?.length || metrics.atRisk?.length) ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <RankList
            title="Top performers"
            items={(metrics.leaders || []).map((s, i) => ({
              ...s,
              rank: i + 1,
              score: s.readiness,
            }))}
            tone="top"
            onSelectStudent={openStudent}
          />
          <RankList
            title="Needs support"
            items={(metrics.atRisk || []).map((s, i) => ({
              ...s,
              rank: i + 1,
              score: s.readiness,
            }))}
            tone="prep"
            onSelectStudent={openStudent}
          />
        </div>
      ) : null}

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Student scorecards</h2>
            <p className="mm-org-panel__meta">
              {scorecardTable.count} of {scorecardTable.total} · click a row for pillar breakdown
            </p>
          </div>
        </div>
        <TableToolbar
          query={scorecardTable.query}
          onQueryChange={scorecardTable.setQuery}
          placeholder="Search name, email, department…"
          count={scorecardTable.count}
          total={scorecardTable.total}
        />
        <div className="mm-org-table-wrap">
          <table className="mm-org-table">
            <thead>
              <tr>
                <SortableTh label="Student" sortKey="name" sort={scorecardTable.sort} onSort={scorecardTable.toggleSort} />
                {!hod ? (
                  <SortableTh label="Dept" sortKey="department" sort={scorecardTable.sort} onSort={scorecardTable.toggleSort} />
                ) : null}
                <SortableTh label="Readiness" sortKey="readiness" sort={scorecardTable.sort} onSort={scorecardTable.toggleSort} />
                <SortableTh label="Strength" sortKey="strength" sort={scorecardTable.sort} onSort={scorecardTable.toggleSort} />
                <SortableTh label="Prep gap" sortKey="weakness" sort={scorecardTable.sort} onSort={scorecardTable.toggleSort} />
                <SortableTh label="Tests" sortKey="tests" sort={scorecardTable.sort} onSort={scorecardTable.toggleSort} />
              </tr>
            </thead>
            <tbody>
              {scorecardTable.rows.length ? (
                scorecardTable.rows.map((s) => (
                  <tr
                    key={s.id}
                    className="mm-org-table-row--clickable"
                    onClick={() => openStudent(s)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openStudent(s);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <td>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs mm-org-text-muted">{s.email}</div>
                    </td>
                    {!hod ? <td>{s.departmentName || '—'}</td> : null}
                    <td>
                      {s.readiness == null ? (
                        <span className="mm-org-score-chip mm-org-score-chip--none">Not scored</span>
                      ) : (
                        <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(s.readiness)}`}>
                          {Math.round(s.readiness)}%
                        </span>
                      )}
                    </td>
                    <td>{s.strength || '—'}</td>
                    <td>{s.weakness || '—'}</td>
                    <td>
                      {s.testsDone ?? 0}/{((s.testsDone || 0) + (s.testsRemaining || 0) + (s.testsInProgress || 0)) || 8}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hod ? 5 : 6} className="mm-org-text-muted">
                    No scorecards match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="m-0 text-xs mm-org-text-muted">
        Pillar averages are among students who completed each assessment. Export PDF for dean, director, or HR meetings.
      </p>

      <StudentScorecardDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        enableAiInsight={hod}
        demo={session?.demo || dataSource === 'local'}
      />

      <ChartDrilldownModal
        open={Boolean(drilldown)}
        title={drilldown?.title || 'Chart detail'}
        meta={drilldown?.meta}
        drill={drilldown?.drill}
        students={drillStudents}
        chart={drilldown?.chartKey ? renderDrillChart(drilldown.chartKey) : null}
        onClose={closeDrill}
        onSelectStudent={(s) => {
          closeDrill();
          openStudent(s);
        }}
      />
      </div>
    </div>
  );
}
