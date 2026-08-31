import { X, Check, Lock, Clock } from 'lucide-react';
import { activityStatusLabel, readinessTone } from '../performanceApi';

const TOOL_META = [
  { code: '5_sec', label: 'Snap test', order: 1 },
  { code: 'aptitude', label: 'Aptitude readiness', order: 2 },
  { code: 'skill_readiness', label: 'Skill readiness', order: 3 },
  { code: 'skill_mock', label: 'Skill AI mock', order: 4 },
  { code: 'project_mock', label: 'Project AI mock', order: 5 },
  { code: 'interview_readiness', label: 'Interview readiness', order: 6 },
  { code: 'interview_mock', label: 'Interview AI mock', order: 7 },
  { code: 'hr_mock', label: 'HR AI mock', order: 8 },
];

const PILLAR_TOOLS = {
  aptitude: ['aptitude'],
  skills: ['skill_readiness', 'skill_mock', 'coding'],
  interview: ['interview_readiness', 'interview_mock', 'project_mock', 'hr_mock'],
};

function pillarAverage(scoresByTool, tools) {
  const vals = tools.map((t) => scoresByTool?.[t]).filter((n) => n != null && Number.isFinite(Number(n)));
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + Number(b), 0) / vals.length);
}

function statusIcon(status) {
  if (status === 'done') return <Check size={12} strokeWidth={3} aria-hidden />;
  if (status === 'current') return <Clock size={12} strokeWidth={2} aria-hidden />;
  return <Lock size={11} strokeWidth={2.5} aria-hidden />;
}

/**
 * Deep-dive drawer for a single student scorecard (TPO / HOD).
 */
export default function StudentScorecardDrawer({ student, onClose }) {
  if (!student) return null;

  const scores = student.scoresByTool || {};
  const statuses = student.stepStatusByTool || {};
  const pillars = {
    aptitude: pillarAverage(scores, PILLAR_TOOLS.aptitude),
    skills: pillarAverage(scores, PILLAR_TOOLS.skills),
    interview: pillarAverage(scores, PILLAR_TOOLS.interview),
  };

  return (
    <div className="mm-org-drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="mm-org-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mm-org-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mm-org-drawer__head">
          <div>
            <h2 id="mm-org-drawer-title" className="mm-org-drawer__title">
              {student.name}
            </h2>
            <p className="mm-org-drawer__sub">
              {student.departmentName || '—'} · {student.email || 'No email'}
            </p>
          </div>
          <button type="button" className="mm-org-drawer__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="mm-org-drawer__stats">
          <div className="mm-org-drawer-stat">
            <span>Overall readiness</span>
            <strong
              className={`mm-org-score-chip mm-org-score-chip--${readinessTone(student.readiness)}`}
            >
              {student.readiness == null ? 'Not scored' : `${Math.round(student.readiness)}%`}
            </strong>
          </div>
          <div className="mm-org-drawer-stat">
            <span>Shortlist score</span>
            <strong>
              {student.shortlistScore == null ? '—' : `${Math.round(student.shortlistScore)}%`}
            </strong>
          </div>
          <div className="mm-org-drawer-stat">
            <span>Tests done</span>
            <strong>
              {student.testsDone ?? 0}/{(student.testsDone ?? 0) + (student.testsRemaining ?? 8)}
            </strong>
          </div>
          <div className="mm-org-drawer-stat">
            <span>Activity</span>
            <strong>{activityStatusLabel(student.activityStatus)}</strong>
          </div>
        </div>

        <section className="mm-org-drawer__section">
          <h3>Pillar scores</h3>
          <div className="mm-org-drawer-pillars">
            {Object.entries(pillars).map(([key, val]) => (
              <div key={key} className="mm-org-drawer-pillar">
                <span className="capitalize">{key}</span>
                {val == null ? (
                  <em className="mm-org-text-muted">—</em>
                ) : (
                  <span className={`mm-org-score-chip mm-org-score-chip--${readinessTone(val)}`}>
                    {val}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mm-org-drawer__section">
          <h3>Assessment week — all 8 checks</h3>
          <ol className="mm-org-drawer-checks">
            {TOOL_META.map((tool) => {
              const status = statuses[tool.code] || 'locked';
              const score = scores[tool.code];
              return (
                <li key={tool.code} className={`mm-org-drawer-check is-${status}`}>
                  <span className="mm-org-drawer-check__icon">{statusIcon(status)}</span>
                  <div className="mm-org-drawer-check__body">
                    <p className="mm-org-drawer-check__title">
                      {tool.order}. {tool.label}
                    </p>
                    <p className="mm-org-drawer-check__meta capitalize">{status.replace('_', ' ')}</p>
                  </div>
                  <span className="mm-org-drawer-check__score">
                    {score == null ? '—' : `${Math.round(score)}%`}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mm-org-drawer__section mm-org-drawer__grid">
          <div>
            <h3>Strengths</h3>
            {(student.strengths || []).length ? (
              <ul className="mm-org-drawer-tags is-good">
                {(student.strengths || []).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="mm-org-text-muted text-sm">{student.strength || 'Not enough data yet.'}</p>
            )}
          </div>
          <div>
            <h3>Preparation gaps</h3>
            {(student.weaknesses || []).length ? (
              <ul className="mm-org-drawer-tags is-bad">
                {(student.weaknesses || []).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : (
              <p className="mm-org-text-muted text-sm">{student.weakness || 'Not enough data yet.'}</p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
