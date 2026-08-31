import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Loader2, Trash2 } from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';
import { getHodWorkspaceSnapshot } from '../hodScope';
import { fetchDepartmentOptions } from '../departmentsApi';
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
} from '../notificationsApi';
import { createDrive, removeDrive, subscribeOrgDb } from '../store';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';

export default function HodNotifyPage() {
  const session = getOrgSession();
  const demo = isDemoSession(session);
  const location = useLocation();
  const [snap, setSnap] = useState(() => getHodWorkspaceSnapshot(session));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canNotify = snap.access?.canNotifyDepartment;
  const dept = snap.department;
  const deptId = dept?.id || snap.departmentId || '';

  const branchNotices = useMemo(() => {
    if (demo) return snap.drives || [];
    return items.filter(
      (n) =>
        n.audience === 'department' &&
        deptId &&
        String(n.departmentId) === String(deptId)
    );
  }, [demo, snap.drives, items, deptId]);

  const noticesTable = useTableQuery(branchNotices, {
    searchKeys: ['title', 'company', 'deliveryStatus', 'status'],
    getSortValue: (row, key) => {
      if (key === 'notice') return (row.title || row.company || '').toLowerCase();
      if (key === 'status') return row.deliveryStatus || row.status || '';
      return row[key];
    },
  });

  const refresh = async () => {
    setLoading(true);
    const deptRes = await fetchDepartmentOptions();
    const list = deptRes.departments || [];
    const nextSnap = getHodWorkspaceSnapshot(getOrgSession(), list);
    setSnap(nextSnap);
    if (demo) {
      setLoading(false);
      return;
    }
    const notes = await fetchNotifications();
    setItems(notes.notifications || []);
    if (!notes.ok && notes.error) setErr(notes.error);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await refresh();
    })();
    if (!demo) {
      return () => {
        cancelled = true;
      };
    }
    const unsub = subscribeOrgDb(() => {
      setSnap(getHodWorkspaceSnapshot(getOrgSession()));
    });
    return () => {
      cancelled = true;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, location.key, session?.department_id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!canNotify) {
      setErr('TPO has not enabled department notifications for HODs.');
      return;
    }
    if (!deptId) {
      setErr('Branch not linked.');
      return;
    }
    if (!title.trim()) {
      setErr('Add a short title for the announcement.');
      return;
    }
    if (!message.trim()) {
      setErr('Add a message for your branch.');
      return;
    }

    setBusy(true);
    if (demo) {
      createDrive({
        title: title.trim(),
        company: company.trim() || dept?.name,
        message: message.trim(),
        audience: 'department',
        departmentId: deptId,
      });
      setTitle('');
      setCompany('');
      setMessage('');
      setMsg('Announcement queued for your branch (demo — saved locally).');
      setBusy(false);
      return;
    }

    const result = await createNotification({
      kind: 'announcement',
      title: title.trim(),
      message: message.trim(),
      audience: 'department',
      departmentId: deptId,
    });
    setBusy(false);
    if (!result.ok) {
      setErr(result.error || 'Unable to send notification.');
      return;
    }
    setTitle('');
    setCompany('');
    setMessage('');
    setMsg(result.message || 'Notification queued for your branch.');
    await refresh();
  };

  const onDelete = async (id) => {
    setErr('');
    setDeletingId(id);
    if (demo) {
      removeDrive(id);
      setDeletingId(null);
      return;
    }
    const result = await deleteNotification(id);
    setDeletingId(null);
    if (!result.ok) {
      setErr(result.error || 'Unable to delete notification.');
      return;
    }
    setMsg('Notification removed.');
    await refresh();
  };

  if (!dept) {
    return (
      <div className="mm-org-panel">
        <h2 className="mm-org-panel__title">Branch not linked</h2>
        <p className="m-0 text-sm mm-org-text-muted">
          Link your HOD account to a department to notify students.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {demo ? (
        <div className="mm-org-alert mm-org-alert--error" role="status">
          Demo mode — announcements save locally. Live sessions use the campus notifications API.
        </div>
      ) : null}
      <div className="mm-org-toolbar">
        <p className="m-0 text-sm mm-org-text-muted">
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
                <label className="mm-org-label" htmlFor="hod-n-title">
                  Title
                </label>
                <input
                  id="hod-n-title"
                  className="mm-org-input"
                  placeholder="Aptitude test this Friday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!canNotify || busy}
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="hod-n-co">
                  Company / context
                </label>
                <input
                  id="hod-n-co"
                  className="mm-org-input"
                  placeholder="Optional"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={!canNotify || busy}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mm-org-label" htmlFor="hod-n-msg">
                  Message
                </label>
                <textarea
                  id="hod-n-msg"
                  className="mm-org-textarea"
                  placeholder="What students should do and by when…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!canNotify || busy}
                />
              </div>
            </div>
            <div className="mm-org-form-actions">
              <button
                type="submit"
                className="mm-org-btn mm-org-btn--primary"
                disabled={!canNotify || busy}
              >
                <Bell size={15} /> {busy ? 'Sending…' : 'Notify branch'}
              </button>
            </div>
          </form>
        </section>

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Recent branch notices</h2>
              <p className="mm-org-panel__meta">
                {loading ? 'Loading…' : `${branchNotices.length} item(s)`}
              </p>
            </div>
          </div>
          {loading ? (
            <div className="mm-org-empty flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : branchNotices.length ? (
            <>
            <TableToolbar
              query={noticesTable.query}
              onQueryChange={noticesTable.setQuery}
              placeholder="Search notice, company, status…"
              count={noticesTable.count}
              total={noticesTable.total}
            />
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <SortableTh label="Notice" sortKey="notice" sort={noticesTable.sort} onSort={noticesTable.toggleSort} />
                    <SortableTh label="Status" sortKey="status" sort={noticesTable.sort} onSort={noticesTable.toggleSort} />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {noticesTable.rows.length ? noticesTable.rows.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <p className="mm-org-table__title">{d.title || d.company}</p>
                        <p className="mm-org-table__meta">{d.company || dept.name}</p>
                      </td>
                      <td>
                        <span className="mm-org-badge mm-org-badge--pending">
                          {d.deliveryStatus || d.status || 'scheduled'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                          onClick={() => onDelete(d.id)}
                          disabled={deletingId === d.id}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3}>
                        <div className="mm-org-empty">No notices match this search.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <div className="mm-org-empty">No branch announcements yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}
