import { useEffect, useState } from 'react';
import { LifeBuoy, Paperclip, Send, X } from 'lucide-react';
import { attachmentSrc, filesToAttachments } from '../../lib/helpAttachments';
import './help-center.css';

const CATEGORIES = [
  { id: 'not_working', label: 'Platform not working' },
  { id: 'feature_broken', label: 'A feature is broken' },
  { id: 'feedback', label: 'Feedback / idea' },
  { id: 'other', label: 'Something else' },
];

function statusLabel(status) {
  if (status === 'CLOSED') return 'Resolved';
  if (status === 'WAITING_REPORTER') return 'MentorMuni replied';
  if (status === 'WAITING_PLATFORM') return 'Waiting on MentorMuni';
  return 'Open';
}

function portalLabel(portal) {
  return portal === 'organization' ? 'Organization Portal' : 'Student Portal';
}

function formatWhen(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function HelpCenterView({
  sourcePortal,
  organizationName,
  api,
  disabledReason = '',
}) {
  const [tickets, setTickets] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [compose, setCompose] = useState({
    subject: '',
    category: 'not_working',
    body: '',
    attachments: [],
  });
  const [reply, setReply] = useState({ body: '', attachments: [] });

  async function refreshList() {
    const data = await api.listTickets();
    setTickets(data?.items || []);
  }

  async function openTicket(id) {
    setActiveId(id);
    const data = await api.getTicket(id);
    setThread(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (disabledReason) {
        setLoading(false);
        return;
      }
      try {
        await refreshList();
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load Help Center.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [disabledReason]);

  function onPickFiles(setter) {
    return async (event) => {
      try {
        const extra = await filesToAttachments(event.target.files);
        setter((prev) => ({
          ...prev,
          attachments: [...(prev.attachments || []), ...extra].slice(0, 3),
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        event.target.value = '';
      }
    };
  }

  async function submitTicket(event) {
    event.preventDefault();
    if (disabledReason) return;
    setSaving(true);
    setError('');
    try {
      const created = await api.createTicket({
        subject: compose.subject.trim(),
        body: compose.body.trim(),
        category: compose.category,
        source_portal: sourcePortal,
        attachments: compose.attachments,
      });
      setCompose({ subject: '', category: 'not_working', body: '', attachments: [] });
      await refreshList();
      setActiveId(created.id);
      setThread(created);
    } catch (err) {
      setError(err.message || 'Could not send this to MentorMuni.');
    } finally {
      setSaving(false);
    }
  }

  async function submitReply(event) {
    event.preventDefault();
    if (!activeId || thread?.status === 'CLOSED') return;
    setSaving(true);
    setError('');
    try {
      const updated = await api.replyTicket(activeId, {
        body: reply.body.trim(),
        attachments: reply.attachments,
      });
      setReply({ body: '', attachments: [] });
      setThread(updated);
      await refreshList();
    } catch (err) {
      setError(err.message || 'Could not send reply.');
    } finally {
      setSaving(false);
    }
  }

  async function closeMine() {
    if (!activeId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await api.closeTicket(activeId);
      setThread(updated);
      await refreshList();
    } catch (err) {
      setError(err.message || 'Could not close this request.');
    } finally {
      setSaving(false);
    }
  }

  if (disabledReason) {
    return (
      <div className="mm-help">
        <header className="mm-help__intro">
          <LifeBuoy size={22} />
          <div>
            <h2>Help Center</h2>
            <p>Message the MentorMuni team about platform issues or feedback.</p>
          </div>
        </header>
        <p className="mm-help__note">{disabledReason}</p>
      </div>
    );
  }

  return (
    <div className="mm-help">
      <header className="mm-help__intro">
        <LifeBuoy size={22} />
        <div>
          <h2>Help Center</h2>
          <p>
            Tell MentorMuni if something is broken, or send product feedback. We see your{' '}
            <strong>{organizationName || 'organization'}</strong> and that this came from the{' '}
            <strong>{portalLabel(sourcePortal)}</strong> — not your name.
          </p>
        </div>
      </header>

      {error ? <p className="mm-help__error">{error}</p> : null}

      <div className="mm-help__grid">
        <section className="mm-help__panel">
          <h3>New request</h3>
          <form onSubmit={submitTicket} className="mm-help__form">
            <label>
              What is this about?
              <select
                value={compose.category}
                onChange={(e) => setCompose((p) => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Subject
              <input
                value={compose.subject}
                onChange={(e) => setCompose((p) => ({ ...p, subject: e.target.value }))}
                placeholder="e.g. Drive dates are not saving"
                required
                minLength={4}
                maxLength={255}
              />
            </label>
            <label>
              Describe what happened
              <textarea
                value={compose.body}
                onChange={(e) => setCompose((p) => ({ ...p, body: e.target.value }))}
                rows={5}
                placeholder="What did you try, what did you expect, and what went wrong?"
                required
                minLength={8}
              />
            </label>
            <label className="mm-help__file">
              <Paperclip size={15} />
              Optional screenshots (up to 3)
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={onPickFiles(setCompose)}
              />
            </label>
            <AttachmentChips
              files={compose.attachments}
              onRemove={(i) =>
                setCompose((p) => ({
                  ...p,
                  attachments: p.attachments.filter((_, idx) => idx !== i),
                }))
              }
            />
            <button type="submit" disabled={saving}>
              <Send size={15} />
              {saving ? 'Sending…' : 'Send to MentorMuni'}
            </button>
          </form>
        </section>

        <section className="mm-help__panel">
          <h3>Your requests</h3>
          {loading ? <p className="mm-help__muted">Loading…</p> : null}
          {!loading && tickets.length === 0 ? (
            <p className="mm-help__muted">Nothing sent yet. Use the form when something feels off.</p>
          ) : null}
          <ul className="mm-help__list">
            {tickets.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={t.id === activeId ? 'is-on' : ''}
                  onClick={() => openTicket(t.id).catch((err) => setError(err.message))}
                >
                  <strong>#{t.id} · {t.subject}</strong>
                  <span>
                    {statusLabel(t.status)} · {formatWhen(t.updated_at)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {thread ? (
        <section className="mm-help__panel mm-help__thread">
          <div className="mm-help__thread-head">
            <div>
              <p className="mm-help__kicker">
                #{thread.id} · {statusLabel(thread.status)} · {portalLabel(thread.source_portal)}
              </p>
              <h3>{thread.subject}</h3>
            </div>
            {thread.status !== 'CLOSED' ? (
              <button type="button" className="mm-help__ghost" onClick={closeMine} disabled={saving}>
                Mark resolved
              </button>
            ) : null}
          </div>

          <ol className="mm-help__replies">
            {(thread.replies || []).map((r) => (
              <li key={r.id} className={r.author_kind === 'platform' ? 'is-staff' : ''}>
                <header>
                  <strong>{r.author_label}</strong>
                  <span>{formatWhen(r.created_at)}</span>
                </header>
                <p>{r.body}</p>
                <div className="mm-help__shots">
                  {(r.attachments || []).map((file) => (
                    <a key={file.filename + file.data_base64.slice(0, 12)} href={attachmentSrc(file)} target="_blank" rel="noreferrer">
                      <img src={attachmentSrc(file)} alt={file.filename} />
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          {thread.status === 'CLOSED' ? (
            <p className="mm-help__muted">This request is closed.</p>
          ) : (
            <form onSubmit={submitReply} className="mm-help__form">
              <label>
                Reply
                <textarea
                  value={reply.body}
                  onChange={(e) => setReply((p) => ({ ...p, body: e.target.value }))}
                  rows={3}
                  required
                  placeholder="Add more detail for MentorMuni…"
                />
              </label>
              <label className="mm-help__file">
                <Paperclip size={15} />
                Add screenshots
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={onPickFiles(setReply)}
                />
              </label>
              <AttachmentChips
                files={reply.attachments}
                onRemove={(i) =>
                  setReply((p) => ({
                    ...p,
                    attachments: p.attachments.filter((_, idx) => idx !== i),
                  }))
                }
              />
              <button type="submit" disabled={saving}>
                <Send size={15} />
                Send reply
              </button>
            </form>
          )}
        </section>
      ) : null}
    </div>
  );
}

function AttachmentChips({ files, onRemove }) {
  if (!files?.length) return null;
  return (
    <ul className="mm-help__chips">
      {files.map((file, i) => (
        <li key={`${file.filename}-${i}`}>
          <img src={attachmentSrc(file)} alt="" />
          <span>{file.filename}</span>
          <button type="button" onClick={() => onRemove(i)} aria-label="Remove image">
            <X size={12} />
          </button>
        </li>
      ))}
    </ul>
  );
}
