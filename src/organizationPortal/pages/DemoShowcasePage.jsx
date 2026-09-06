import { useEffect, useMemo, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Presentation, RefreshCw } from 'lucide-react';
import { getOrgSession, refreshOrgSessionFromMe } from '../../orgPortal';
import { orgPaths } from '../paths';
import {
  fetchPerformanceSummary,
  summaryToUiMetrics,
  readinessTone,
  scorecardsToUiRows,
  OrgApiError,
} from '../performanceApi';
import StudentScorecardDrawer from '../components/StudentScorecardDrawer';

const TOOL_COLUMNS = [
  ['5_sec', '5-sec'],
  ['aptitude', 'Aptitude'],
  ['skill_readiness', 'Skill ready'],
  ['skill_mock', 'Skill mock'],
  ['project_mock', 'Project'],
  ['interview_readiness', 'Interview ready'],
  ['interview_mock', 'Interview mock'],
  ['hr_mock', 'HR mock'],
];

function formatScore(v) {
  if (v == null || Number.isNaN(Number(v))) return '—';
  return String(Math.round(Number(v)));
}

/**
 * Sales-oriented Demo Showcase for DEMO_TRIAL colleges (TPO/HOD).
 * Uses the same performance summary/scorecards as Performance (board_limit=50).
 */
export default function DemoShowcasePage() {
  const [sessionTick, setSessionTick] = useState(0);
  const session = getOrgSession();
  const isDemoTrial = Boolean(session?.is_demo_trial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshOrgSessionFromMe();
      if (!cancelled) setSessionTick((n) => n + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isDemoTrial) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const summary = await fetchPerformanceSummary({ boardLimit: 50 });
        if (cancelled) return;
        const mapped = summaryToUiMetrics(summary);
        setMetrics(mapped);
        const embedded = summary?.scorecards;
        if (Array.isArray(embedded) && embedded.length) {
          setStudents(scorecardsToUiRows({ items: embedded }));
        } else {
          setStudents([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof OrgApiError
              ? err.message
              : 'Could not load demo showcase data.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isDemoTrial, reloadKey, sessionTick]);

  const sorted = useMemo(
    () =>
      [...students].sort((a, b) => {
        const ra = a.readiness == null ? -1 : Number(a.readiness);
        const rb = b.readiness == null ? -1 : Number(b.readiness);
        return rb - ra;
      }),
    [students]
  );

  if (!isDemoTrial) {
    return <Navigate to={orgPaths.performance} replace />;
  }

  return (
    <div className="mm-org-page space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mm-org-kicker flex items-center gap-2">
            <Presentation size={16} /> Demo Showcase
          </p>
          <h1 className="mm-org-title">Demo batch readiness</h1>
          <p className="mm-org-sub">
            Walk the college through scores and readiness across all 8 assessment
            checks (up to 50 students). Activate the org from Platform Admin when
            they convert.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="mm-org-btn mm-org-btn--ghost"
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={loading}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <Link to={orgPaths.performance} className="mm-org-btn mm-org-btn--ghost">
            Full performance
          </Link>
        </div>
      </header>

      {error ? (
        <p className="mm-org-alert mm-org-alert--bad" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="mm-org-card p-4">
          <p className="text-xs opacity-70">Students shown</p>
          <p className="text-2xl font-semibold">{sorted.length}</p>
        </div>
        <div className="mm-org-card p-4">
          <p className="text-xs opacity-70">Avg readiness</p>
          <p className="text-2xl font-semibold">
            {metrics?.avgReadiness != null
              ? Math.round(Number(metrics.avgReadiness))
              : '—'}
          </p>
        </div>
        <div className="mm-org-card p-4">
          <p className="text-xs opacity-70">Students scored</p>
          <p className="text-2xl font-semibold">{metrics?.studentsScored ?? '—'}</p>
        </div>
        <div className="mm-org-card p-4">
          <p className="text-xs opacity-70">Active (7d)</p>
          <p className="text-2xl font-semibold">{metrics?.active7d ?? '—'}</p>
        </div>
      </div>

      <div className="mm-org-card overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm opacity-70">Loading demo scorecards…</p>
        ) : !sorted.length ? (
          <p className="p-6 text-sm opacity-70">
            No student scorecards yet. Enroll students and have them complete
            baseline checks — results appear here automatically.
          </p>
        ) : (
          <table className="mm-org-table w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-3">Student</th>
                <th className="text-left p-3">Dept</th>
                <th className="text-right p-3">Readiness</th>
                {TOOL_COLUMNS.map(([code, label]) => (
                  <th key={code} className="text-right p-3 whitespace-nowrap">
                    {label}
                  </th>
                ))}
                <th className="text-right p-3">Done</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => {
                const tone = readinessTone(s.readiness);
                return (
                  <tr
                    key={s.id}
                    className="cursor-pointer hover:bg-black/5"
                    onClick={() => setSelected(s)}
                  >
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 opacity-80">{s.departmentName || '—'}</td>
                    <td className={`p-3 text-right font-semibold mm-org-tone--${tone}`}>
                      {formatScore(s.readiness)}
                    </td>
                    {TOOL_COLUMNS.map(([code]) => (
                      <td key={code} className="p-3 text-right tabular-nums">
                        {formatScore(s.scoresByTool?.[code])}
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      {s.testsDone ?? 0}/8
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected ? (
        <StudentScorecardDrawer
          student={selected}
          onClose={() => setSelected(null)}
          demo
        />
      ) : null}
    </div>
  );
}
