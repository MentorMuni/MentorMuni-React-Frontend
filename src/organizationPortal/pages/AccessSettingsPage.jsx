import { useCallback, useEffect, useState } from 'react';
import { getOrgSession, setOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';
import { fetchHodAccess, saveHodAccess } from '../hodAccessApi';
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
  const [access, setAccess] = useState(() => (demo ? getHodAccess() : {}));
  const [loading, setLoading] = useState(!demo);
  const [savingKey, setSavingKey] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const loadLive = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await fetchHodAccess();
      setAccess(next);
      const current = getOrgSession();
      if (current) {
        setOrgSession({ ...current, hodAccess: next, hod_access: next });
      }
    } catch (err) {
      setError(err?.message || 'Could not load HOD access settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (demo) {
      setAccess(getHodAccess());
      return subscribeOrgDb(() => setAccess(getHodAccess()));
    }
    loadLive();
    return undefined;
  }, [demo, loadLive]);

  const toggle = async (key) => {
    setMsg('');
    setError('');
    const nextValue = !access[key];

    if (demo) {
      updateHodAccess({ [key]: nextValue });
      setAccess((prev) => ({ ...prev, [key]: nextValue }));
      setMsg('HOD access updated for this organization (demo).');
      return;
    }

    setSavingKey(key);
    const previous = { ...access };
    setAccess((prev) => ({ ...prev, [key]: nextValue }));
    try {
      const saved = await saveHodAccess({ [key]: nextValue });
      setAccess(saved);
      const current = getOrgSession();
      if (current) {
        setOrgSession({ ...current, hodAccess: saved, hod_access: saved });
      }
      setMsg('HOD access saved. Active HOD sessions may need to sign in again to pick up changes.');
    } catch (err) {
      setAccess(previous);
      setError(err?.message || 'Failed to save HOD access.');
    } finally {
      setSavingKey('');
    }
  };

  return (
    <div className="mm-org-panel" style={{ maxWidth: 720 }}>
      <div className="mm-org-panel__head">
        <div>
          <h2 className="mm-org-panel__title">What HODs can do</h2>
          <p className="mm-org-panel__meta">
            Control what department mentors can do across your campus. Changes apply to all HODs
            and placement coordinators.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mm-org-panel__meta mb-3">Loading HOD access settings…</p>
      ) : null}
      {error ? (
        <div className="mm-org-alert mm-org-alert--error mb-3" role="alert">
          {error}
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
            aria-busy={savingKey === t.key}
            className={`mm-org-switch ${access[t.key] ? 'is-on' : ''}`}
            onClick={() => toggle(t.key)}
            disabled={loading || Boolean(savingKey)}
          >
            <span className="mm-org-switch__thumb" />
          </button>
        </div>
      ))}
    </div>
  );
}
