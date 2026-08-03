import { useEffect, useState } from 'react';
import { Briefcase, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  createUpcomingDrive,
  deleteUpcomingDrive,
  fetchUpcomingDrives,
  updateUpcomingDrive,
} from '../upcomingDrivesApi';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';

const empty = {
  companyName: '',
  eligibilityCriteria: '',
  driveDate: '',
  remark: '',
};

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function UpcomingDrivesPage() {
  const session = getOrgSession();
  const demo = isDemoSession(session);

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(empty);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    const result = await fetchUpcomingDrives();
    setItems(result.items || []);
    if (!result.ok && result.error) {
      setErr(result.error);
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
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setBusy(true);
    const result = await createUpcomingDrive(form);
    setBusy(false);
    if (!result.ok) {
      setErr(result.error || 'Unable to add drive.');
      return;
    }
    setForm(empty);
    setMsg('Drive added.');
    await refresh();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      companyName: item.companyName || '',
      eligibilityCriteria: item.eligibilityCriteria || '',
      driveDate: item.driveDate || '',
      remark: item.remark || '',
    });
    setErr('');
    setMsg('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(empty);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (editingId == null) return;
    setErr('');
    setBusy(true);
    const result = await updateUpcomingDrive(editingId, editForm);
    setBusy(false);
    if (!result.ok) {
      setErr(result.error || 'Unable to update.');
      return;
    }
    cancelEdit();
    setMsg('Drive updated.');
    await refresh();
  };

  const onDelete = async (id) => {
    setErr('');
    setDeletingId(id);
    const result = await deleteUpcomingDrive(id);
    setDeletingId(null);
    if (!result.ok) {
      setErr(result.error || 'Unable to delete.');
      return;
    }
    if (editingId === id) cancelEdit();
    setMsg('Drive removed.');
    await refresh();
  };

  return (
    <div className="mm-org-split">
      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Add upcoming drive</h2>
            <p className="mm-org-panel__meta">
              Shared with TPO / Dean / Director in this college.
            </p>
          </div>
          <Briefcase size={18} className="mm-org-icon-accent" />
        </div>

        {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
        {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}

        <form onSubmit={onSubmit}>
          <div className="mm-org-form-grid">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="ud-company">Company name</label>
              <input
                id="ud-company"
                className="mm-org-input"
                placeholder="e.g. Infosys · TCS · Amazon"
                value={form.companyName}
                onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                disabled={busy}
                required
              />
            </div>
            <div>
              <label className="mm-org-label" htmlFor="ud-date">Drive date</label>
              <input
                id="ud-date"
                type="date"
                className="mm-org-input"
                value={form.driveDate}
                onChange={(e) => setForm((f) => ({ ...f, driveDate: e.target.value }))}
                disabled={busy}
                required
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="ud-elig">Eligibility criteria</label>
              <textarea
                id="ud-elig"
                className="mm-org-textarea"
                rows={3}
                placeholder="CGPA ≥ 7.0 · No active backlog · CSE / IT · 2026 batch…"
                value={form.eligibilityCriteria}
                onChange={(e) =>
                  setForm((f) => ({ ...f, eligibilityCriteria: e.target.value }))
                }
                disabled={busy}
                required
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mm-org-label" htmlFor="ud-remark">Remark</label>
              <textarea
                id="ud-remark"
                className="mm-org-textarea"
                rows={2}
                placeholder="Optional notes — venue, slots, contact…"
                value={form.remark}
                onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))}
                disabled={busy}
              />
            </div>
          </div>
          <div className="mm-org-form-actions">
            <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Plus size={15} /> Add drive
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Upcoming drives</h2>
            <p className="mm-org-panel__meta">
              {loading ? 'Loading…' : `${items.length} drive(s)`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mm-org-empty">Loading drives…</div>
        ) : items.length ? (
          <div className="mm-org-table-wrap">
            <table className="mm-org-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Eligibility</th>
                  <th>Remark</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const editing = editingId === item.id;
                  if (editing) {
                    return (
                      <tr key={item.id}>
                        <td colSpan={5}>
                          <form onSubmit={saveEdit} className="space-y-2 py-2">
                            <input
                              className="mm-org-input"
                              value={editForm.companyName}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, companyName: e.target.value }))
                              }
                              placeholder="Company"
                              disabled={busy}
                              required
                            />
                            <input
                              type="date"
                              className="mm-org-input"
                              value={editForm.driveDate}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, driveDate: e.target.value }))
                              }
                              disabled={busy}
                              required
                            />
                            <textarea
                              className="mm-org-textarea"
                              rows={2}
                              value={editForm.eligibilityCriteria}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  eligibilityCriteria: e.target.value,
                                }))
                              }
                              placeholder="Eligibility"
                              disabled={busy}
                              required
                            />
                            <textarea
                              className="mm-org-textarea"
                              rows={2}
                              value={editForm.remark}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, remark: e.target.value }))
                              }
                              placeholder="Remark"
                              disabled={busy}
                            />
                            <div className="mm-org-form-actions" style={{ marginTop: 0 }}>
                              <button
                                type="submit"
                                className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                                disabled={busy}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                onClick={cancelEdit}
                                disabled={busy}
                              >
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={item.id}>
                      <td>
                        <p className="mm-org-table__title">{item.companyName}</p>
                      </td>
                      <td>{formatDate(item.driveDate)}</td>
                      <td>
                        <span className="text-sm mm-org-text-muted whitespace-pre-wrap">
                          {item.eligibilityCriteria}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm mm-org-text-muted whitespace-pre-wrap">
                          {item.remark || '—'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1 justify-end">
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                            onClick={() => startEdit(item)}
                            disabled={busy || deletingId === item.id}
                            aria-label="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                            onClick={() => onDelete(item.id)}
                            disabled={deletingId === item.id}
                            aria-label="Delete"
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mm-org-empty">No upcoming drives yet. Add one on the left.</div>
        )}
      </section>
    </div>
  );
}
