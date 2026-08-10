import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, Trophy, AlertTriangle, Filter } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isHodRole } from '../roles';
import { resolveHodDepartment } from '../hodScope';
import { fetchDepartments } from '../departmentsApi';
import {
  AREA_OPTIONS,
  fetchBranchInsight,
  fetchCampusInsight,
  fetchPerformanceScorecards,
  fetchPerformanceSummary,
  mapInsight,
  readinessTone,
  formatPct,
  scorecardsToUiRows,
  summaryToUiMetrics,
  OrgApiError,
} from '../performanceApi';
import { ClarityBoard } from '../components/PerformanceCharts';
import {
  ActivityArea,
  ChartCard,
  DeptCompareChart,
  GapStrengthBars,
  PillarRadar,
  ReadinessPie,
  TestsFunnelChart,
  ToolCoverageStacked,
} from '../components/AnalyticsCharts';
import {
  buildLocalBranchInsight,
  buildLocalCampusInsight,
  getHodMetrics,
  getTpoMetrics,
  listStudents,
} from '../store';

const EASE = [0.22, 1, 0.36, 1];
const TOP_N_OPTIONS = [5, 10, 20, 50];

function exportScorecardsCsv(rows, filenamePrefix = 'mentormuni-scorecards') {
  const header = [
    'Name',
    'Email',
    'Department',
    'Readiness',
    'Shortlist',
    'Mock',
    'Best area',
    'Strength',
    'Prep gap',
    'Tests done',
    'Tests remaining',
    'Level',
    'Attempts',
    'Activity',
  ];
  const lines = [header.join(',')];
  rows.forEach((s) => {
    const cells = [
      s.name,
      s.email,
      s.departmentName || '',
      s.readiness,
      s.shortlistScore,
      s.mockScore,
      s.bestArea || '',
      s.strength,
      s.weakness,
      s.testsDone,
      s.testsRemaining,
      s.progressLevel,
      s.attempts,
      s.activityStatus,
    ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`);
    lines.push(cells.join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function RankList({ title, items, tone }) {
  if (!items?.length) {
    return <div className="mm-org-empty">No ranked students in this slice yet.</div>;
  }
  return (
    <div>
      <p className="mm-org-stat__label mb-2">{title}</p>
      <ul className="m-0 list-none space-y-2 p-0">
        {items.map((s) => (
          <li key={`${tone}-${s.id}`} className="mm-org-list-card text-sm">
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PerformancePage() {
  const session = getOrgSession();
  const hod = isHodRole(session?.role);
  const [hodDept, setHodDept] = useState(() => (hod ? resolveHodDepartment(session) : null));
  const [metrics, setMetrics] = useState(() =>
    hod && resolveHodDepartment(session)
      ? getHodMetrics(resolveHodDepartment(session).id)
      : getTpoMetrics()
  );
  const [students, setStudents] = useState(() => listStudents());
  const [insight, setInsight] = useState(() =>
    hod
      ? buildLocalBranchInsight(
          resolveHodDepartment(session)
            ? getHodMetrics(resolveHodDepartment(session).id)
            : getTpoMetrics()
        )
      : buildLocalCampusInsight(getTpoMetrics())
  );
  const [dataSource, setDataSource] = useState('local');
  const [aiBusy, setAiBusy] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState(() => (hod ? resolveHodDepartment(session)?.id || '' : ''));
  const [deptOptions, setDeptOptions] = useState([]);
  const [boardLimit, setBoardLimit] = useState(10);
  const [areaFocus, setAreaFocus] = useState('overall');
  const [reloadKey, setReloadKey] = useState(0);

  const loadLive = useCallback(
    async (deptId, limit) => {
      const opts = {
        ...(deptId ? { departmentId: deptId } : {}),
        boardLimit: limit || boardLimit,
      };
      const [summary, cards] = await Promise.all([
        fetchPerformanceSummary(opts),
        fetchPerformanceScorecards(deptId ? { departmentId: deptId } : {}),
      ]);
      const ui = summaryToUiMetrics(summary);
      setMetrics(ui);
      setStudents(scorecardsToUiRows(cards));
      setDataSource('api');
      setLoadError('');
      return ui;
    },
    [boardLimit]
  );

  const scopeFilterKey = hod ? 'hod' : String(deptFilter || '');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let deptId = null;
        if (hod) {
          const deptRes = await fetchDepartments();
          if (cancelled) return;
          const dept = resolveHodDepartment(getOrgSession(), deptRes.departments || []);
          setHodDept(dept);
          if (!dept?.id) return;
          deptId = dept.id;
          setDeptFilter((prev) => (String(prev) === String(dept.id) ? prev : dept.id));
          if (session?.demo) {
            const m = getHodMetrics(dept.id);
            setMetrics(m);
            setStudents(listStudents().filter((s) => String(s.departmentId) === String(dept.id)));
            setInsight(buildLocalBranchInsight(m));
            setDataSource('local');
            return;
          }
        } else {
          const deptRes = await fetchDepartments().catch(() => ({ departments: [] }));
          if (cancelled) return;
          setDeptOptions(
            (deptRes.departments || []).map((d) => ({ id: String(d.id), name: d.name, code: d.code }))
          );
          if (session?.demo) {
            const m = getTpoMetrics();
            setMetrics(m);
            setStudents(listStudents());
            setInsight(buildLocalCampusInsight(m));
            setDataSource('local');
            return;
          }
          deptId = deptFilter || null;
        }

        const ui = await loadLive(deptId, boardLimit);
        if (cancelled) return;

        try {
          setAiBusy(true);
          const res = hod
            ? await fetchBranchInsight({
                include_leaderboard: true,
                max_actions: 5,
                focus_area: areaFocus,
              })
            : await fetchCampusInsight({
                include_leaderboard: true,
                max_actions: 5,
                department_id: deptId ? Number(deptId) : undefined,
                focus_area: areaFocus,
              });
          if (!cancelled) setInsight(mapInsight(res));
        } catch {
          if (!cancelled) {
            setInsight(hod ? buildLocalBranchInsight(ui) : buildLocalCampusInsight(ui));
          }
        } finally {
          if (!cancelled) setAiBusy(false);
        }
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof OrgApiError ? err.message : 'Could not load live performance.');
        setDataSource('local');
      }
    })();
    return () => {
      cancelled = true;
    };
    // areaFocus only affects AI brief refresh via button / boardLimit+dept reload
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: area tab switches local board, not full reload
  }, [hod, session?.demo, session?.department_id, scopeFilterKey, boardLimit, reloadKey, loadLive]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          (s.email || '').toLowerCase().includes(q) ||
          (s.departmentName || '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (a.readiness == null && b.readiness != null) return 1;
        if (a.readiness != null && b.readiness == null) return -1;
        return (Number(b.readiness) || 0) - (Number(a.readiness) || 0);
      });
  }, [students, query]);

  const activeBoard = useMemo(() => {
    const boards = metrics.areaBoards || [];
    return boards.find((b) => b.area === areaFocus) || boards.find((b) => b.area === 'overall') || null;
  }, [metrics.areaBoards, areaFocus]);

  const resolvedDeptOptions = useMemo(() => {
    if (hod) return [];
    if (deptOptions.length) return deptOptions;
    return (metrics.byDept || []).map((d) => ({ id: String(d.id), name: d.name, code: d.code }));
  }, [deptOptions, metrics.byDept, hod]);

  async function refreshInsight() {
    setAiBusy(true);
    try {
      if (session?.demo) {
        setInsight(hod ? buildLocalBranchInsight(metrics) : buildLocalCampusInsight(metrics));
        return;
      }
      const res = hod
        ? await fetchBranchInsight({
            include_leaderboard: true,
            max_actions: 5,
            focus_area: areaFocus,
          })
        : await fetchCampusInsight({
            include_leaderboard: true,
            max_actions: 5,
            department_id: deptFilter ? Number(deptFilter) : undefined,
            focus_area: areaFocus,
          });
      setInsight(mapInsight(res));
    } catch {
      setInsight(hod ? buildLocalBranchInsight(metrics) : buildLocalCampusInsight(metrics));
    } finally {
      setAiBusy(false);
    }
  }

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

  const tests = metrics.tests || {};

  return (
    <div className="space-y-5 mm-org-perf">
      <div className="mm-org-toolbar">
        <div>
          <h1 className="m-0 text-xl font-bold mm-org-text">Deep performance analysis</h1>
          <p className="m-0 mt-1 text-sm mm-org-text-muted">
            {scopeLabel} · scores, strengths/gaps, test progress, rankings & shortlisting
            {dataSource === 'api' ? ' · Live' : ' · Demo / local'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {!hod ? (
            <label className="mm-org-filter">
              <Filter size={14} />
              <select
                className="mm-org-input"
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
          <label className="mm-org-filter">
            Top / less prepared N
            <select
              className="mm-org-input"
              value={boardLimit}
              onChange={(e) => setBoardLimit(Number(e.target.value))}
            >
              {TOP_N_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="mm-org-btn mm-org-btn--ghost" disabled={aiBusy} onClick={refreshInsight}>
            <Sparkles size={15} /> {aiBusy ? 'Analyzing…' : 'AI brief'}
          </button>
          <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={() => setReloadKey((k) => k + 1)}>
            Reload
          </button>
          <button
            type="button"
            className="mm-org-btn mm-org-btn--primary"
            disabled={!filtered.length}
            onClick={() =>
              exportScorecardsCsv(
                filtered,
                hod ? `mentormuni-${hodDept.code || 'branch'}-scorecards` : 'mentormuni-scorecards'
              )
            }
          >
            <Download size={15} /> CSV
          </button>
        </div>
      </div>

      {loadError ? (
        <div className="mm-org-alert mm-org-alert--error" role="alert">
          {loadError}
        </div>
      ) : null}

      <ClarityBoard clarity={metrics.clarity} insight={insight} />

      {insight?.summary ? (
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">
                <Sparkles size={16} className="inline mr-1" /> Executive + shortlist brief
              </h2>
              <p className="mm-org-panel__meta">
                {insight.source === 'openai' ? 'OpenAI' : 'Heuristic'} · focus: {areaFocus}
              </p>
            </div>
          </div>
          <p className="mm-org-ai-box__body m-0">{insight.summary}</p>
          {(insight.shortlistNotes || []).length ? (
            <ul className="mt-3 mb-0 list-disc space-y-1 pl-5 text-sm mm-org-text">
              {insight.shortlistNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <div className="mm-org-stat-grid mm-org-stat-grid--6">
        {[
          {
            label: 'Avg readiness',
            value: formatPct(metrics.avgReadiness),
            hint: metrics.studentsScored ? 'Among scored' : 'No scores yet',
          },
          {
            label: 'Score coverage',
            value: `${Math.round(metrics.coveragePct || 0)}%`,
            hint: `${metrics.studentsScored || 0}/${metrics.students || 0}`,
          },
          {
            label: 'Avg tests done',
            value: `${tests.avgTestsDone ?? 0}/${tests.toolsTotal || 8}`,
            hint: `${tests.studentsNoneDone || 0} none · ${tests.studentsAllDone || 0} all done`,
          },
          {
            label: 'Drive-ready',
            value: `${Math.round(metrics.driveReadyOfScoredPct || 0)}%`,
            hint: `${metrics.strong || 0} of scored ≥75%`,
          },
          { label: 'Less prepared', value: metrics.weak || 0, hint: 'Scored & <50%' },
          {
            label: 'Remaining tests',
            value: tests.totalRemaining ?? 0,
            hint: `Across ${metrics.students || 0} students`,
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

      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="Readiness mix" meta="Drive-ready · developing · less prepared · unscored">
          <ReadinessPie bands={metrics.bands || metrics} avgReadiness={metrics.avgReadiness} />
        </ChartCard>
        <ChartCard title="Pillar radar" meta="Aptitude · skills · interview · shortlist">
          <PillarRadar pillars={metrics.pillars || {}} />
        </ChartCard>
        <ChartCard title="Activity pulse" meta="Who is practicing vs stuck">
          <ActivityArea
            active={metrics.active7d || 0}
            idle={metrics.idleCount || 0}
            inactive={metrics.inactive14d || 0}
            never={metrics.neverStarted || 0}
          />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Test level funnel" meta="How far the cohort has progressed (L1→L8)" tall>
          <TestsFunnelChart funnel={metrics.levelFunnel || []} />
        </ChartCard>
        <ChartCard title="Tests given vs remaining" meta="Done · in progress · remaining by tool" tall>
          <ToolCoverageStacked tools={metrics.toolCoverage || []} />
        </ChartCard>
      </div>

      <ChartCard title="Strengths & preparation gaps" meta="% share among scored students">
        <GapStrengthBars gaps={metrics.topGaps || []} strengths={metrics.topStrengths || []} />
      </ChartCard>

      {!hod || (metrics.byDept || []).length > 1 ? (
        <ChartCard title="Department band mix" meta="Compare branches — least prepared first">
          <DeptCompareChart departments={metrics.byDept || []} />
        </ChartCard>
      ) : null}

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">
              <Trophy size={16} className="inline mr-1" /> Area rankings & shortlisting
            </h2>
            <p className="mm-org-panel__meta">
              Select area · top {boardLimit} and less prepared {boardLimit}
              {activeBoard?.avgScore != null
                ? ` · area avg ${Math.round(activeBoard.avgScore)}% (${activeBoard.studentsScored} scored)`
                : ''}
            </p>
          </div>
        </div>
        <div className="mm-org-area-tabs">
          {AREA_OPTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`mm-org-area-tab${areaFocus === a.id ? ' is-active' : ''}`}
              onClick={() => setAreaFocus(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
        {activeBoard?.description ? (
          <p className="mt-2 mb-3 text-sm mm-org-text-muted">{activeBoard.description}</p>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-2">
          <RankList title={`Top ${boardLimit} — shortlist candidates`} items={activeBoard?.top} tone="top" />
          <RankList
            title={`Less prepared ${boardLimit} — focus practice`}
            items={activeBoard?.lessPrepared}
            tone="prep"
          />
        </div>
      </section>

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Student scorecards</h2>
            <p className="mm-org-panel__meta">
              {filtered.length} shown · readiness, shortlist, tests done/remaining, level, gaps
            </p>
          </div>
        </div>
        <div className="mb-3">
          <input
            className="mm-org-input"
            style={{ minWidth: 240 }}
            placeholder="Search name, email, department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="mm-org-table-wrap">
          <table className="mm-org-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Dept</th>
                <th>Readiness</th>
                <th>Shortlist</th>
                <th>Best area</th>
                <th>Strength</th>
                <th>Prep gap</th>
                <th>Tests</th>
                <th>Level</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs mm-org-text-muted">{s.email}</div>
                    </td>
                    <td>{s.departmentName || '—'}</td>
                    <td>
                      {s.readiness == null ? (
                        <span className="mm-org-score-chip mm-org-score-chip--none">Not scored</span>
                      ) : (
                        <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(s.readiness)}`}>
                          {Math.round(s.readiness)}%
                        </span>
                      )}
                    </td>
                    <td>
                      {s.shortlistScore == null ? '—' : (
                        <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(s.shortlistScore)}`}>
                          {Math.round(s.shortlistScore)}%
                        </span>
                      )}
                    </td>
                    <td>{s.bestArea || '—'}</td>
                    <td>{s.strength || '—'}</td>
                    <td>{s.weakness || '—'}</td>
                    <td>
                      {s.testsDone ?? 0}/{((s.testsDone || 0) + (s.testsRemaining || 0) + (s.testsInProgress || 0)) || 8}
                      <div className="text-xs mm-org-text-muted">
                        {s.testsRemaining || 0} left
                        {s.testsInProgress ? ` · ${s.testsInProgress} current` : ''}
                      </div>
                    </td>
                    <td>L{s.progressLevel || 0}</td>
                    <td>
                      <span className={`mm-org-badge mm-org-badge--${s.activityStatus || 'never'}`}>
                        {s.activityStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="mm-org-text-muted">
                    No scorecards match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="m-0 text-xs mm-org-text-muted flex items-center gap-1">
        <AlertTriangle size={12} /> Pillar & area averages are among students who completed that area — not the full roster.
      </p>
    </div>
  );
}
