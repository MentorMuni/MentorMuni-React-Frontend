import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  NotebookPen,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  createWorkspaceItemApi,
  deleteWorkspaceItemApi,
  fetchWorkspaceItems,
  toggleWorkspaceItemApi,
  updateWorkspaceItemApi,
} from '../workspaceApi';
import { subscribeWorkspace } from '../workspaceStore';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';

const emptyForm = { text: '', dueDate: '' };

function formatDue(dueDate) {
  if (!dueDate) return '';
  try {
    return new Date(`${dueDate}T12:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dueDate;
  }
}

function isOverdue(item) {
  if (!item?.dueDate || item.done) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${item.dueDate}T12:00:00`);
  return due < today;
}

export default function MyWorkspacePage() {
  const session = getOrgSession();
  const demo = isDemoSession(session);

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('open'); // open | done | all
  const [editingId, setEditingId] = useState('');
  const [editForm, setEditForm] = useState(emptyForm);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const result = await fetchWorkspaceItems();
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

    if (!demo) {
      return () => {
        cancelled = true;
      };
    }

    const unsub = subscribeWorkspace(() => {
      fetchWorkspaceItems().then((result) => {
        if (cancelled) return;
        setItems(result.items || []);
      });
    });
    return () => {
      cancelled = true;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  const visible = useMemo(() => {
    if (filter === 'open') return items.filter((i) => !i.done);
    if (filter === 'done') return items.filter((i) => i.done);
    return items;
  }, [items, filter]);

  const counts = useMemo(
    () => ({
      open: items.filter((i) => !i.done).length,
      done: items.filter((i) => i.done).length,
      all: items.length,
    }),
    [items]
  );

  const flash = (ok, text) => {
    setErr(ok ? '' : text);
    setMsg(ok ? text : '');
  };

  const onAdd = async (e) => {
    e.preventDefault();
    setBusy(true);
    const result = await createWorkspaceItemApi({
      text: form.text,
      dueDate: form.dueDate,
      kind: form.dueDate ? 'reminder' : 'todo',
    });
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error || 'Unable to save.');
      return;
    }
    setForm(emptyForm);
    flash(true, 'Saved.');
    await refresh();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ text: item.text, dueDate: item.dueDate || '' });
    setErr('');
    setMsg('');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditForm(emptyForm);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const result = await updateWorkspaceItemApi(editingId, {
      text: editForm.text,
      dueDate: editForm.dueDate,
      kind: editForm.dueDate ? 'reminder' : 'todo',
    });
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error || 'Unable to update.');
      return;
    }
    cancelEdit();
    flash(true, 'Updated.');
    await refresh();
  };

  const onToggle = async (item) => {
    const result = await toggleWorkspaceItemApi(item.id, !item.done);
    if (!result.ok) {
      flash(false, result.error || 'Unable to update.');
      return;
    }
    flash(true, item.done ? 'Marked open.' : 'Marked done.');
    await refresh();
  };

  const onRemove = async (item) => {
    const result = await deleteWorkspaceItemApi(item.id);
    if (!result.ok) {
      flash(false, result.error || 'Unable to remove.');
      return;
    }
    if (editingId === item.id) cancelEdit();
    flash(true, 'Removed.');
    await refresh();
  };

  return (
    <div className="mm-org-workspace">
      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Quick capture</h2>
            <p className="mm-org-panel__meta">
              Private todos, reminders, and notes — only you can see them.
            </p>
          </div>
          <NotebookPen size={18} className="mm-org-icon-accent" />
        </div>

        {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
        {msg ? <div className="mm-org-alert mm-org-alert--success mb-3">{msg}</div> : null}

        <form onSubmit={onAdd} className="mm-org-workspace__composer">
          <textarea
            className="mm-org-textarea"
            rows={3}
            placeholder="What do you need to do or remember? e.g. Call Infosys HR · CSE mock deadline · Meet Dean Friday"
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            disabled={busy}
          />
          <div className="mm-org-workspace__composer-row">
            <label className="mm-org-workspace__date-field">
              <Calendar size={14} aria-hidden />
              <span>Date (optional)</span>
              <input
                type="date"
                className="mm-org-input"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                disabled={busy}
              />
            </label>
            <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy}>
              <Plus size={15} /> Add
            </button>
          </div>
        </form>
      </section>

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">Your list</h2>
            <p className="mm-org-panel__meta">
              {loading ? 'Loading…' : `${counts.open} open · ${counts.done} done`}
            </p>
          </div>
          <div className="mm-org-workspace__filters" role="tablist" aria-label="Filter items">
            {[
              { id: 'open', label: `Open (${counts.open})` },
              { id: 'done', label: `Done (${counts.done})` },
              { id: 'all', label: `All (${counts.all})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`mm-org-workspace__filter ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mm-org-empty">Loading workspace…</div>
        ) : visible.length ? (
          <ul className="mm-org-workspace__list">
            {visible.map((item) => {
              const editing = editingId === item.id;
              return (
                <li
                  key={item.id}
                  className={`mm-org-workspace__item ${item.done ? 'is-done' : ''} ${
                    isOverdue(item) ? 'is-overdue' : ''
                  }`}
                >
                  {editing ? (
                    <form onSubmit={saveEdit} className="mm-org-workspace__edit">
                      <textarea
                        className="mm-org-textarea"
                        rows={2}
                        value={editForm.text}
                        onChange={(e) => setEditForm((f) => ({ ...f, text: e.target.value }))}
                        autoFocus
                        disabled={busy}
                      />
                      <div className="mm-org-workspace__composer-row">
                        <input
                          type="date"
                          className="mm-org-input"
                          value={editForm.dueDate}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, dueDate: e.target.value }))
                          }
                          disabled={busy}
                        />
                        <div className="mm-org-workspace__edit-actions">
                          <button
                            type="submit"
                            className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                            disabled={busy}
                          >
                            <Check size={14} /> Save
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
                      </div>
                    </form>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`mm-org-workspace__check ${item.done ? 'is-on' : ''}`}
                        aria-label={item.done ? 'Mark as open' : 'Mark as done'}
                        onClick={() => onToggle(item)}
                      >
                        {item.done ? <Check size={14} /> : null}
                      </button>
                      <div className="mm-org-workspace__body min-w-0">
                        <p className="mm-org-workspace__text">{item.text}</p>
                        {item.dueDate ? (
                          <p className="mm-org-workspace__due">
                            <Calendar size={12} aria-hidden />
                            {formatDue(item.dueDate)}
                            {isOverdue(item) ? ' · Overdue' : ''}
                          </p>
                        ) : null}
                      </div>
                      <div className="mm-org-workspace__actions">
                        <button
                          type="button"
                          className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                          onClick={() => startEdit(item)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                          onClick={() => onRemove(item)}
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mm-org-empty">
            {filter === 'done'
              ? 'No completed items yet.'
              : filter === 'open'
                ? 'Nothing open — add a note or todo above.'
                : 'Your workspace is empty. Capture your first note above.'}
          </div>
        )}
      </section>
    </div>
  );
}
