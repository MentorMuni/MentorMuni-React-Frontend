import { useEffect, useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { getHodWorkspaceSnapshot } from '../hodScope';
import { createDrive, removeDrive, subscribeOrgDb } from '../store';

export default function HodNotifyPage() {
  const session = getOrgSession();
  const [snap, setSnap] = useState(() => getHodWorkspaceSnapshot(session));
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(
    () => subscribeOrgDb(() => setSnap(getHodWorkspaceSnapshot(getOrgSession()))),
    []
  );

  const canNotify = snap.access?.canNotifyDepartment;
  const dept = snap.department;

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!canNotify) {
      setErr('TPO has not enabled department notifications for HODs.');
      return;
    }
    if (!dept?.id) {
      setErr('Branch not linked.');
      return;
    }
    if (!title.trim()) {
      setErr('Add a short title for the announcement.');
      return;
    }
    createDrive({
      title: title.trim(),
      company: company.trim() || dept.name,
      message: message.trim(),
      audience: 'department',
      departmentId: dept.id,
    });
    setTitle('');
    setCompany('');
    setMessage('');
    setMsg('Announcement queued for your branch. Push delivery wires with notifications API.');
  };

  if (!dept) {
    return (
      <div className="mm-org-panel">
        <h2 className="mm-org-panel__title">Branch not linked</h2>
        <p className="m-0 text-sm" style={{ color: 'var(--org-muted)' }}>
          Link your HOD account to a department to notify students.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="mm-org-toolbar">
        <p className="m-0 text-sm" style={{ color: 'var(--org-muted)' }}>
          Reach only {dept.name} students — drives, mock deadlines, lab reminders.
        </p>
      </div>

      <div className="mm-org-split">
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Announce to branch</h2>
              <p className="mm-org-panel__meta">Department-scoped notice</p>
            </div>
          </div>
          {!canNotify ? (
            <div className="mm-org-alert mm-org-alert--error mb-3">
              Notifications disabled for HODs. Ask TPO to enable “Notify department”.
            </div>
          ) : null}
          {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
          {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}
          <form onSubmit={onSubmit}>
            <div className="mm-org-form-grid">
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mm-org-label" htmlFor="hod-n-title">Title</label>
                <input
                  id="hod-n-title"
                  className="mm-org-input"
                  placeholder="Aptitude test this Friday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!canNotify}
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="hod-n-co">Company / context</label>
                <input
                  id="hod-n-co"
                  className="mm-org-input"
                  placeholder="Optional"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={!canNotify}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mm-org-label" htmlFor="hod-n-msg">Message</label>
                <textarea
                  id="hod-n-msg"
                  className="mm-org-textarea"
                  placeholder="What students should do and by when…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!canNotify}
                />
              </div>
            </div>
            <div className="mm-org-form-actions">
              <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={!canNotify}>
                <Bell size={15} /> Notify branch
              </button>
            </div>
          </form>
        </section>

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Recent branch notices</h2>
              <p className="mm-org-panel__meta">{snap.drives.length} item(s)</p>
            </div>
          </div>
          {snap.drives.length ? (
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <th>Notice</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {snap.drives.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <p className="mm-org-table__title">{d.title || d.role || d.company}</p>
                        <p className="mm-org-table__meta">{d.company || dept.name}</p>
                      </td>
                      <td>
                        <span className="mm-org-badge mm-org-badge--pending">{d.status}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                          onClick={() => removeDrive(d.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mm-org-empty">No branch announcements yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}
