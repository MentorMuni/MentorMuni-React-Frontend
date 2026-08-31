import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Loader2, Trash2 } from 'lucide-react';
import { fetchDepartmentOptions } from '../departmentsApi';
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
} from '../notificationsApi';
import { listDepartments, subscribeOrgDb } from '../store';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';

const empty = {
  kind: 'event',
  title: '',
  date: '',
  message: '',
  audience: 'all',
  departmentId: '',
};

function audienceLabel(item, departments) {
  if (item.audience === 'hods') return 'HODs only';
  if (item.audience === 'department') {
    const id = String(item.departmentId || '');
    return departments.find((x) => String(x.id) === id)?.name || 'One department';
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
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState(() => (demo ? listDepartments() : []));
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    const [notes, depts] = await Promise.all([
      fetchNotifications(),
      fetchDepartmentOptions().catch(() => ({ ok: false, departments: demo ? listDepartments() : [] })),
    ]);
    setItems(notes.notifications || []);
    if (depts?.departments?.length) setDepartments(depts.departments);
    else if (demo) setDepartments(listDepartments());
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
  }, [demo, location.key]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!form.title.trim()) {
      setErr('Title is required.');
      return;
    }
    if (!form.message.trim()) {
      setErr('Message is required.');
      return;
    }
    if (form.audience === 'department' && !form.departmentId) {
      setErr('Select a department.');
      return;
    }

    setBusy(true);
    const result = await createNotification(form);
    setBusy(false);

    if (!result.ok) {
      setErr(result.error || 'Unable to send notification.');
      return;
    }

    setForm(empty);
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

  return (
    <div className="mm-org-split">
      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Notify event / workshop</h2>
            <p className="mm-org-panel__meta">
              Send a campus notice from TPO — to all students, one department, or HODs only.
            </p>
          </div>
        </div>
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
                disabled={busy}
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
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                disabled={busy}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="evt-title">Title</label>
              <input
                id="evt-title"
                className="mm-org-input"
                placeholder="Resume workshop · Alumni AMA · Hackathon briefing"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                disabled={busy}
              />
            </div>
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
                    departmentId: e.target.value === 'department' ? f.departmentId : '',
                  }))
                }
                disabled={busy}
              >
                <option value="all">All students</option>
                <option value="department">One department (students)</option>
                <option value="hods">HODs only</option>
              </select>
            </div>
            {form.audience === 'department' ? (
              <div>
                <label className="mm-org-label" htmlFor="evt-dept">Department</label>
                <select
                  id="evt-dept"
                  className="mm-org-select"
                  value={form.departmentId}
                  onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
                  disabled={busy}
                >
                  <option value="">Select…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
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
                disabled={busy}
              />
            </div>
          </div>
          <div className="mm-org-form-actions">
            <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Queueing…
                </>
              ) : (
                <>
                  <Bell size={15} /> Send notification
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
              {loading ? 'Loading…' : `${items.length} item(s)`}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="mm-org-empty">Loading notifications…</div>
        ) : items.length ? (
          <div className="space-y-3">
            {items.map((d) => (
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
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                  disabled={deletingId === d.id}
                  onClick={() => onDelete(d.id)}
                >
                  {deletingId === d.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mm-org-empty">No events or workshops notified yet.</div>
        )}
      </section>
    </div>
  );
}
