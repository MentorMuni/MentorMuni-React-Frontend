import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Loader2, Trash2 } from 'lucide-react';
import { fetchDepartmentOptions } from '../departmentsApi';
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
} from '../notificationsApi';
import DepartmentMultiSelect from '../components/DepartmentMultiSelect';
import { listDepartments, subscribeOrgDb } from '../store';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';
import { todayISO } from '../upcomingDrivesApi';
import { isHodRole } from '../roles';
import { resolveHodDepartment, resolveHodAccess } from '../hodScope';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';

const empty = {
  kind: 'event',
  title: '',
  date: '',
  message: '',
  audience: 'all',
  departmentIds: [],
};

function departmentNames(ids = [], departments = []) {
  const names = ids
    .map((id) => departments.find((d) => String(d.id) === String(id))?.name)
    .filter(Boolean);
  if (!names.length) return 'Department';
  if (names.length === 1) return names[0];
  if (names.length <= 3) return names.join(', ');
  return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`;
}

function audienceLabel(item, departments) {
  if (item.audience === 'hods') return 'HODs only';
  if (item.audience === 'department') {
    const ids = item.departmentIds?.length
      ? item.departmentIds
      : item.departmentId
        ? [item.departmentId]
        : [];
    return departmentNames(ids, departments);
  }
  return 'All students';
}

function kindLabel(kind) {
  if (kind === 'workshop') return 'Workshop';
  if (kind === 'announcement') return 'Announcement';
  return 'Event';
}

function deliveryLabel(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'queued' || s === 'pending') return 'Queued';
  if (s === 'sent' || s === 'delivered') return 'Sent';
  if (s === 'failed') return 'Failed';
  if (s === 'scheduled') return 'Saved';
  return s ? s.replace(/_/g, ' ') : '';
}

export default function DrivesPage() {
  const session = getOrgSession();
  const demo = isDemoSession(session);
  const hod = isHodRole(session?.role);
  const location = useLocation();
  const [hodDept, setHodDept] = useState(() => (hod ? resolveHodDepartment(session) : null));
  const canNotify = !hod || resolveHodAccess(session).canNotifyDepartment;

  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState(() => (demo ? listDepartments() : []));
  const [form, setForm] = useState(() =>
    hod && hodDept
      ? { ...empty, audience: 'department', departmentIds: [String(hodDept.id)] }
      : empty
  );
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const selectableDepartments = useMemo(() => {
    if (hod && hodDept) {
      return departments.filter((d) => String(d.id) === String(hodDept.id));
    }
    return departments;
  }, [departments, hod, hodDept]);

  const visibleItems = useMemo(() => {
    if (!hod || !hodDept) return items;
    const deptId = String(hodDept.id);
    return items.filter((n) => {
      if (n.audience !== 'department') return false;
      const ids = n.departmentIds?.length
        ? n.departmentIds
        : n.departmentId
          ? [n.departmentId]
          : [];
      return ids.some((id) => String(id) === deptId);
    });
  }, [items, hod, hodDept]);

  const sentTable = useTableQuery(visibleItems, {
    searchFn: (row, q) => {
      const hay = [
        row.title,
        kindLabel(row.kind),
        audienceLabel(row, departments),
        deliveryLabel(row.deliveryStatus),
        row.message,
        row.date,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    },
    initialSort: { key: 'date', direction: 'desc' },
    getSortValue: (row, key) => {
      if (key === 'title') return (row.title || '').toLowerCase();
      if (key === 'kind') return kindLabel(row.kind);
      if (key === 'date') return row.date || '';
      if (key === 'audience') return audienceLabel(row, departments);
      return row[key];
    },
  });

  const refresh = async () => {
    setLoading(true);
    const [notes, depts] = await Promise.all([
      fetchNotifications(),
      fetchDepartmentOptions().catch(() => ({ ok: false, departments: demo ? listDepartments() : [] })),
    ]);
    setItems(notes.notifications || []);
    const deptList = depts?.departments?.length ? depts.departments : demo ? listDepartments() : [];
    if (deptList.length) setDepartments(deptList);
    if (hod) {
      const dept = resolveHodDepartment(getOrgSession(), deptList);
      setHodDept(dept);
      if (dept?.id) {
        setForm((f) => ({
          ...f,
          audience: 'department',
          departmentIds: f.departmentIds?.length ? f.departmentIds : [String(dept.id)],
        }));
      }
    }
    if (!notes.ok && notes.error) {
      setErr(notes.error);
      setMsg('');
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await refresh();
    })();

    if (!demo) return () => { cancelled = true; };

    const unsub = subscribeOrgDb(() => {
      fetchNotifications().then((notes) => {
        if (cancelled) return;
        setItems(notes.notifications || []);
      });
      setDepartments(listDepartments());
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
    if (hod && !canNotify) {
      setErr('TPO has not enabled department notifications for HODs.');
      return;
    }
    if (!form.title.trim()) {
      setErr('Title is required.');
      return;
    }
    if (!form.message.trim()) {
      setErr('Message is required.');
      return;
    }
    const audience = hod ? 'department' : form.audience;
    const departmentIds =
      audience === 'department'
        ? hod && hodDept
          ? form.departmentIds.length
            ? form.departmentIds
            : [String(hodDept.id)]
          : form.departmentIds
        : [];
    if (audience === 'department' && !departmentIds.length) {
      setErr('Select at least one department.');
      return;
    }

    setBusy(true);
    const result = await createNotification({ ...form, audience, departmentIds });
    setBusy(false);

    if (!result.ok) {
      setErr(result.error || 'Unable to send notification.');
      return;
    }

    setForm(
      hod && hodDept
        ? { ...empty, audience: 'department', departmentIds: [String(hodDept.id)] }
        : empty
    );
    const estimated =
      result.recipientsEstimated != null
        ? ` · ~${result.recipientsEstimated} recipient(s)`
        : '';
    setMsg(
      result.message
        ? `${result.message}${estimated}`
        : `Notification queued${estimated}.`
    );
    await refresh();
  };

  const onDelete = async (id) => {
    setErr('');
    setDeletingId(id);
    const result = await deleteNotification(id);
    setDeletingId(null);
    if (!result.ok) {
      setErr(result.error || 'Unable to delete notification.');
      return;
    }
    setMsg('Notification removed.');
    await refresh();
  };

  if (hod && !hodDept) {
    return (
      <div className="mm-org-panel">
        <h2 className="mm-org-panel__title">Branch not linked</h2>
        <p className="m-0 text-sm mm-org-text-muted">
          Link your HOD account to a department before notifying students.
        </p>
      </div>
    );
  }

  return (
    <div className="mm-org-split">
      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">
              {hod ? 'Notify branch' : 'Notify event / workshop'}
            </h2>
            <p className="mm-org-panel__meta">
              {hod
                ? `Send events, workshops, or reminders to ${hodDept?.name || 'your branch'} students.`
                : 'Send a campus notice — all students, selected departments, or HODs only.'}
            </p>
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
            <div>
              <label className="mm-org-label" htmlFor="evt-kind">Type</label>
              <select
                id="evt-kind"
                className="mm-org-select"
                value={form.kind}
                onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
                disabled={busy || !canNotify}
              >
                <option value="event">Event</option>
                <option value="workshop">Workshop</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="mm-org-label" htmlFor="evt-date">Date (optional)</label>
              <input
                id="evt-date"
                type="date"
                className="mm-org-input"
                value={form.date}
                min={todayISO()}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                disabled={busy || !canNotify}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="evt-title">Title</label>
              <input
                id="evt-title"
                className="mm-org-input"
                placeholder={hod ? 'Aptitude test this Friday' : 'Resume workshop · Alumni AMA · Hackathon briefing'}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                disabled={busy || !canNotify}
              />
            </div>
            {!hod ? (
              <div>
                <label className="mm-org-label" htmlFor="evt-aud">Send to</label>
                <select
                  id="evt-aud"
                  className="mm-org-select"
                  value={form.audience}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      audience: e.target.value,
                      departmentIds: e.target.value === 'department' ? f.departmentIds : [],
                    }))
                  }
                  disabled={busy || !canNotify}
                >
                  <option value="all">All students</option>
                  <option value="department">Selected department(s)</option>
                  <option value="hods">HODs only</option>
                </select>
              </div>
            ) : null}
            {(hod || form.audience === 'department') ? (
              <div style={{ gridColumn: hod ? '1 / -1' : undefined }}>
                <DepartmentMultiSelect
                  label={hod ? 'Department' : 'Department(s)'}
                  hint={
                    hod
                      ? 'Your branch is pre-selected.'
                      : 'Pick one or more departments — students in all selected branches receive this.'
                  }
                  departments={selectableDepartments}
                  value={form.departmentIds}
                  onChange={(departmentIds) => setForm((f) => ({ ...f, departmentIds }))}
                  disabled={busy || !canNotify}
                  min={1}
                />
              </div>
            ) : null}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="evt-msg">Message</label>
              <textarea
                id="evt-msg"
                className="mm-org-textarea"
                placeholder="What should people know? Venue, timing, who should attend…"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                disabled={busy || !canNotify}
              />
            </div>
          </div>
          <div className="mm-org-form-actions">
            <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy || !canNotify}>
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Queueing…
                </>
              ) : (
                <>
                  <Bell size={15} /> {hod ? 'Notify branch' : 'Send notification'}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Sent notifications</h2>
            <p className="mm-org-panel__meta">
              {loading ? 'Loading…' : `${visibleItems.length} item(s)`}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="mm-org-empty">Loading notifications…</div>
        ) : visibleItems.length ? (
          <>
          <TableToolbar
            query={sentTable.query}
            onQueryChange={sentTable.setQuery}
            placeholder="Search title, kind, audience…"
            count={sentTable.count}
            total={sentTable.total}
          />
          <div className="space-y-3">
            {sentTable.rows.length ? sentTable.rows.map((d) => (
              <div key={d.id} className="mm-org-list-card">
                <div className="min-w-0">
                  <p className="m-0 font-bold mm-org-text">
                    {d.title || 'Untitled'}
                  </p>
                  <p className="m-0 mt-1 text-sm mm-org-text-muted">
                    {kindLabel(d.kind)}
                    {d.date ? ` · ${d.date}` : ''}
                    {` · ${audienceLabel(d, departments)}`}
                    {d.deliveryStatus ? ` · ${deliveryLabel(d.deliveryStatus)}` : ''}
                    {d.recipientsEstimated != null
                      ? ` · ~${d.recipientsEstimated} recipients`
                      : ''}
                  </p>
                  {d.message ? (
                    <p className="m-0 mt-2 text-sm mm-org-text-muted">{d.message}</p>
                  ) : null}
                </div>
                {!hod ? (
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                    disabled={deletingId === d.id}
                    onClick={() => onDelete(d.id)}
                  >
                    {deletingId === d.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                ) : null}
              </div>
            )) : (
              <div className="mm-org-empty">No notifications match this search.</div>
            )}
          </div>
          </>
        ) : (
          <div className="mm-org-empty">
            {hod ? 'No branch notifications sent yet.' : 'No events or workshops notified yet.'}
          </div>
        )}
      </section>
    </div>
  );
}
