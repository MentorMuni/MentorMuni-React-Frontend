import { useEffect, useState } from 'react';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';
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
  const session = getOrgSession();
  const demo = isDemoSession(session);
  const [access, setAccess] = useState(() => getHodAccess());
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!demo) return undefined;
    return subscribeOrgDb(() => setAccess(getHodAccess()));
  }, [demo]);

  const toggle = (key) => {
    if (!demo) return;
    updateHodAccess({ [key]: !access[key] });
    setMsg('HOD access updated for this organization (demo).');
  };

  return (
    <div className="mm-org-panel" style={{ maxWidth: 720 }}>
      <div className="mm-org-panel__head">
        <div>
          <h2 className="mm-org-panel__title">What HODs can do</h2>
          <p className="mm-org-panel__meta">
            Legal / operational boundaries for department mentors.
          </p>
        </div>
      </div>
      {!demo ? (
        <div className="mm-org-alert mm-org-alert--error mb-3" role="status">
          Live organizations use server permissions for HOD access. These toggles apply in demo
          mode only — contact engineering to change live HOD permissions.
        </div>
      ) : null}
      {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}
      {TOGGLES.map((t) => (
        <div key={t.key} className="mm-org-switch-row">
          <div>
            <p>{t.title}</p>
            <span>{t.desc}</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(access[t.key])}
            className={`mm-org-switch ${access[t.key] ? 'is-on' : ''}`}
            onClick={() => toggle(t.key)}
            disabled={!demo}
          >
            <span className="mm-org-switch__thumb" />
          </button>
        </div>
      ))}
    </div>
  );
}
