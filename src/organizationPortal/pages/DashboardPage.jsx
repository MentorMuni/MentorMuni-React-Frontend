import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  Building2,
  ClipboardList,
  Eye,
  ShieldCheck,
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
import { getHodWorkspaceSnapshot } from '../hodScope';
import {
  buildLocalBranchInsight,
  buildLocalCampusInsight,
  getTpoMetrics,
  subscribeOrgDb,
} from '../store';
import AssignToStudentModal from './AssignToStudentModal';

const EASE = [0.22, 1, 0.36, 1];

export default function DashboardPage() {
  const session = getOrgSession();
  const role = normalizeOrgRole(session?.role);
  const canEdit = canMutateCampus(session?.role);
  const viewer = isViewerRole(session?.role);
  const [metrics, setMetrics] = useState(() => getTpoMetrics());
  const [aiBusy, setAiBusy] = useState(false);
  const [insight, setInsight] = useState(() => buildLocalCampusInsight(getTpoMetrics()));
  const [hodSnap, setHodSnap] = useState(() => getHodWorkspaceSnapshot(session));
  const [hodInsight, setHodInsight] = useState(() =>
    buildLocalBranchInsight(getHodWorkspaceSnapshot(session).metrics)
  );
  const [assignStudent, setAssignStudent] = useState(null);
  const [assignFlash, setAssignFlash] = useState('');

  useEffect(() => {
    return subscribeOrgDb(() => {
      const next = getTpoMetrics();
      setMetrics(next);
      setInsight(buildLocalCampusInsight(next));
      const hs = getHodWorkspaceSnapshot(getOrgSession());
      setHodSnap(hs);
      setHodInsight(buildLocalBranchInsight(hs.metrics));
    });
  }, []);

  const runInsight = () => {
    setAiBusy(true);
    window.setTimeout(() => {
      setInsight(buildLocalCampusInsight(getTpoMetrics()));
      setAiBusy(false);
    }, 450);
  };

  const runHodInsight = () => {
    setAiBusy(true);
    window.setTimeout(() => {
      const hs = getHodWorkspaceSnapshot(getOrgSession());
      setHodInsight(buildLocalBranchInsight(hs.metrics));
      setAiBusy(false);
    }, 450);
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
    const cards = [
      { label: 'Departments', value: metrics.departments, icon: Building2, hint: 'Branches' },
      { label: 'Students', value: metrics.students, icon: Users, hint: 'Enrolled' },
      { label: 'Pending invites', value: metrics.pendingInvites, icon: UserPlus, hint: 'Enrollment queue' },
      { label: 'Active programs', value: metrics.activePrograms, icon: ClipboardList, hint: 'Assigned work' },
      { label: 'Upcoming drives', value: metrics.upcomingDrives, icon: Bell, hint: 'Notifications' },
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
              {viewer ? <Eye size={12} /> : <ShieldCheck size={12} />}
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
                : 'departments, HOD mentors, enrollment, programs, drives, and deep readiness analytics.'}
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
                {metrics.avgReadiness}
                <span>avg readiness</span>
              </p>
              <p className="mt-2 text-sm mm-org-text-muted">
                {metrics.strong} strong · {metrics.weak} need support
              </p>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs mm-org-text-muted">
                <span>Readiness coverage</span>
                <span>{metrics.avgReadiness}%</span>
              </div>
              <div className="mm-org-progress">
                <motion.div
                  className="mm-org-progress__bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.avgReadiness}%` }}
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
              <strong>{metrics.bands?.strong || 0}</strong>
              <p>{bandPct.strong}% of enrolled cohort</p>
            </div>
            <div className="mm-org-insight__card">
              <h4>Developing (50–74%)</h4>
              <strong>{metrics.bands?.mid || 0}</strong>
              <p>{bandPct.mid}% — assign targeted mocks</p>
            </div>
            <div className="mm-org-insight__card">
              <h4>At risk (&lt;50%)</h4>
              <strong>{metrics.bands?.weak || 0}</strong>
              <p>{bandPct.weak}% — priority for readiness tests</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mm-org-stat__label mb-2">Top skill gaps</p>
              {(metrics.topGaps || []).length ? (
                <div className="space-y-3">
                  {metrics.topGaps.map((g, i) => (
                    <div key={g.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="mm-org-band-label">{g.label}</span>
                        <span className="mm-org-text-muted">{g.count} students</span>
                      </div>
                      <div className="mm-org-progress">
                        <motion.div
                          className="mm-org-progress__bar"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(100, Math.round((g.count / bandTotal) * 100))}%`,
                          }}
                          transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-sm mm-org-text-muted">
                  Enroll students to surface gap themes.
                </p>
              )}
            </div>
            <div>
              <p className="mm-org-stat__label mb-2">Campus strengths</p>
              {(metrics.topStrengths || []).length ? (
                <ul className="m-0 list-none space-y-2 p-0">
                  {metrics.topStrengths.map((s) => (
                    <li
                      key={s.label}
                      className="mm-org-list-card text-sm"
                    >
                      <span className="font-bold mm-org-text">{s.label}</span>
                      <span className="mm-org-badge mm-org-badge--active">{s.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 text-sm mm-org-text-muted">
                  Strength signals appear after scorecards load.
                </p>
              )}
            </div>
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
                ? 'Running on local heuristics today. Wire OpenAI via backend for narrative + personalized remediation plans.'
                : 'Generated with OpenAI'}
            </p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-5">
          <section className="mm-org-panel lg:col-span-3">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">Department readiness</h2>
                <p className="mm-org-panel__meta">Average score by branch</p>
              </div>
              <Link to={orgPaths.departments} className="mm-org-link text-xs">
                {canEdit ? 'Manage →' : 'View →'}
              </Link>
            </div>
            {metrics.byDept.length ? (
              <div className="space-y-4">
                {metrics.byDept.map((d, i) => (
                  <div key={d.id}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-bold mm-org-text">
                        {d.name} <span className="mm-org-text-muted">({d.code})</span>
                      </span>
                      <span className="mm-org-text-muted">
                        {d.students} students · {d.avgReadiness}%
                      </span>
                    </div>
                    <div className="mm-org-progress">
                      <motion.div
                        className="mm-org-progress__bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${d.avgReadiness}%` }}
                        transition={{ duration: 0.7, delay: 0.04 * i, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mm-org-empty">
                No departments yet. Create CSE, ECE, and more to start tracking.
              </div>
            )}
          </section>

          <section className="mm-org-panel lg:col-span-2">
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
                  {canEdit ? 'Assign programs, notify drives, manage access' : 'Read-only analytics links'}
                </p>
              </div>
              <Sparkles size={16} className="mm-org-icon-warn" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(canEdit
                ? [
                    { to: orgPaths.programs, label: 'Assign program / mock', icon: ClipboardList },
                    { to: orgPaths.drives, label: 'Notify upcoming drive', icon: Bell },
                    { to: orgPaths.enrollment, label: 'Enrollment queue', icon: UserPlus },
                    { to: orgPaths.access, label: 'HOD permissions', icon: ShieldCheck },
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
                  ? `${metrics.weak} student(s) below 50% readiness — assign a readiness test or AI mock.`
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
    const hm = hodSnap.metrics;
    const dept = hodSnap.department;
    const hTotal = Math.max(1, hm?.students || 0);
    const hBand = {
      strong: Math.round(((hm?.bands?.strong || 0) / hTotal) * 100),
      mid: Math.round(((hm?.bands?.mid || 0) / hTotal) * 100),
      weak: Math.round(((hm?.bands?.weak || 0) / hTotal) * 100),
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
      { label: 'Avg readiness', value: `${hm?.avgReadiness ?? 0}%`, icon: BarChart3, hint: 'Branch' },
      { label: 'At risk', value: hm?.weak ?? 0, icon: AlertTriangle, hint: '< 50%' },
      { label: 'Active programs', value: hm?.activePrograms ?? 0, icon: ClipboardList, hint: 'Assigned' },
      { label: 'Pending invites', value: hm?.pendingInvites ?? 0, icon: UserPlus, hint: 'Queue' },
    ];

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
            </span>
            <h2 className="mm-org-hero__title">
              {dept.name}
              <span className="mm-org-hero__muted"> readiness</span>
            </h2>
            <p className="mm-org-hero__body">
              Mentor your batch like a branch head: spot at-risk students, assign aptitude / skill /
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
                { key: 'weak', label: 'Needs support (<50%)', pct: hBand.weak, count: hm?.weak },
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
                <p className="mm-org-panel__meta">Local heuristic · OpenAI later</p>
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

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mm-org-label">At-risk students</p>
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
                    No students below 50% — keep weekly checks going.
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

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Deep analysis</h2>
              <p className="mm-org-panel__meta">Strengths, gaps, and AI mentor insight</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 mb-5">
            <div>
              <p className="mm-org-stat__label mb-2">Branch weaknesses (gaps)</p>
              {(hm?.topGaps || []).length ? (
                <div className="space-y-3">
                  {hm.topGaps.map((g, i) => (
                    <div key={g.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="mm-org-band-label">{g.label}</span>
                        <span className="mm-org-text-muted">{g.count} students</span>
                      </div>
                      <div className="mm-org-progress">
                        <motion.div
                          className="mm-org-progress__bar"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(100, Math.round((g.count / hTotal) * 100))}%`,
                          }}
                          transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-sm mm-org-text-muted">
                  Gap themes appear after students have scorecards.
                </p>
              )}
            </div>
            <div>
              <p className="mm-org-stat__label mb-2">Branch strengths</p>
              {(hm?.topStrengths || []).length ? (
                <ul className="m-0 list-none space-y-2 p-0">
                  {hm.topStrengths.map((s) => (
                    <li
                      key={s.label}
                      className="mm-org-list-card text-sm"
                    >
                      <span className="font-bold mm-org-text">{s.label}</span>
                      <span className="mm-org-badge mm-org-badge--active">{s.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 text-sm mm-org-text-muted">
                  Strength signals appear after scorecards load.
                </p>
              )}
            </div>
          </div>

          <div className="mm-org-ai-box">
            <p className="mm-org-ai-box__title">
              <Sparkles size={14} /> AI deep analysis
            </p>
            <p className="mm-org-ai-box__body">
              Coming next: OpenAI-backed branch analysis — who needs English vs technical drills,
              recommended mock interviews per student, and a weekly mentoring plan for {dept.name}.
            </p>
            <p className="mm-org-ai-box__meta">
              Placeholder only. Heuristic brief above works today; wire{' '}
              <code className="mm-org-code">POST /organizations/ai/branch-insight</code> when live
              scores exist.
            </p>
          </div>
        </section>

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Student details</h2>
              <p className="mm-org-panel__meta">
                Full roster — assign any assessment or program to a student from here
              </p>
            </div>
            <Link to={orgPaths.students} className="mm-org-link text-xs">
              Manage roster →
            </Link>
          </div>
          {assignFlash ? (
            <div className="mm-org-alert mm-org-alert--success mb-3">{assignFlash}</div>
          ) : null}
          {hodSnap.students?.length ? (
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Readiness</th>
                    <th>Mock</th>
                    <th>Strength</th>
                    <th>Weakness</th>
                    <th>Activity</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {[...hodSnap.students]
                    .sort((a, b) => (b.readiness || 0) - (a.readiness || 0))
                    .map((s) => (
                      <tr key={s.id}>
                        <td>
                          <p className="mm-org-table__title">{s.name}</p>
                          <p className="mm-org-table__meta">{s.email}</p>
                        </td>
                        <td>
                          <span
                            className={`mm-org-badge ${
                              s.readiness >= 75
                                ? 'mm-org-badge--active'
                                : s.readiness < 50
                                  ? 'mm-org-badge--danger'
                                  : 'mm-org-badge--pending'
                            }`}
                          >
                            {s.readiness}%
                          </span>
                        </td>
                        <td>{s.mockScore ?? '—'}</td>
                        <td className="mm-org-text">{s.strength || '—'}</td>
                        <td className="mm-org-text">{s.weakness || '—'}</td>
                        <td className="mm-org-text-muted">{s.activities ?? 0}</td>
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
                            <Plus size={14} /> Assign
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
