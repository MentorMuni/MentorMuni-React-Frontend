import { useEffect, useState } from 'react';
import { getHodAccess, subscribeOrgDb, updateHodAccess } from '../store';

const TOGGLES = [
  {
    key: 'canInviteStudents',
    title: 'Invite students to department',
    desc: 'Allow HOD to queue enrollment invites for their branch.',
  },
  {
    key: 'canViewAllScores',
    title: 'View department scorecards',
    desc: 'Readiness, mocks, strengths and gaps for department students.',
  },
  {
    key: 'canAssignPrograms',
    title: 'Assign programs / mocks',
    desc: 'Let HOD launch readiness tests or mocks within their department.',
  },
  {
    key: 'canNotifyDepartment',
    title: 'Notify department',
    desc: 'Send announcements to students in the HOD’s branch.',
  },
  {
    key: 'canRunMocks',
    title: 'Run AI / HR mocks',
    desc: 'Conduct mock interviews for selected students.',
  },
];

export default function AccessSettingsPage() {
  const [access, setAccess] = useState(() => getHodAccess());
  const [msg, setMsg] = useState('');

  useEffect(() => subscribeOrgDb(() => setAccess(getHodAccess())), []);

  const toggle = (key) => {
    updateHodAccess({ [key]: !access[key] });
    setMsg('HOD access updated for this organization.');
  };

  return (
    <div className="mm-org-panel" style={{ maxWidth: 720 }}>
      <div className="mm-org-panel__head">
        <div>
          <h2 className="mm-org-panel__title">What HODs can do</h2>
          <p className="mm-org-panel__meta">
            Legal / operational boundaries for department mentors. Applies org-wide for now;
            per-department overrides come with personalization.
          </p>
        </div>
      </div>
      {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}
      {TOGGLES.map((t) => (
        <div key={t.key} className="mm-org-switch-row">
          <div>
            <p>{t.title}</p>
            <span>{t.desc}</span>
          </div>
          <button
            type="button"
            className={`mm-org-toggle ${access[t.key] ? 'is-on' : ''}`}
            aria-pressed={!!access[t.key]}
            aria-label={t.title}
            onClick={() => toggle(t.key)}
          >
            <span className="mm-org-toggle__knob" />
          </button>
        </div>
      ))}
    </div>
  );
}
