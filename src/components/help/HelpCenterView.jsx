import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LifeBuoy, MessageSquare, Paperclip, Send, X } from 'lucide-react';
import { attachmentSrc, filesToAttachments } from '../../lib/helpAttachments';
import './help-center.css';

const CATEGORIES = [
  { id: 'not_working', label: 'Platform not working' },
  { id: 'feature_broken', label: 'A feature is broken' },
  { id: 'feedback', label: 'Feedback / idea' },
  { id: 'other', label: 'Something else' },
];

const EMPTY_COMPOSE = {
  subject: '',
  category: 'not_working',
  body: '',
  attachments: [],
};

const EMPTY_REPLY = { body: '', attachments: [] };

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
  const [threadLoading, setThreadLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [compose, setCompose] = useState(EMPTY_COMPOSE);
  const [reply, setReply] = useState(EMPTY_REPLY);
  const openSeq = useRef(0);

  async function refreshList() {
    const data = await api.listTickets();
    setTickets(data?.items || []);
  }

  function clearTicketSelection() {
    openSeq.current += 1;
    setActiveId(null);
    setThread(null);
    setReply(EMPTY_REPLY);
    setThreadLoading(false);
  }

  async function openTicket(id) {
    if (id == null) {
      clearTicketSelection();
      return;
    }
    const seq = ++openSeq.current;
    // Selecting another ticket must never keep the previous reply draft / screenshots.
    setActiveId(id);
    setReply(EMPTY_REPLY);
    setError('');
    setThreadLoading(true);
    try {
      const data = await api.getTicket(id);
      if (seq !== openSeq.current) return;
      setThread(data);
    } catch (err) {
      if (seq !== openSeq.current) return;
      setThread(null);
      setActiveId(null);
      setError(err.message || 'Could not open this request.');
    } finally {
      if (seq === openSeq.current) setThreadLoading(false);
    }
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
      setCompose(EMPTY_COMPOSE);
      setReply(EMPTY_REPLY);
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
    if (!activeId || !thread || thread.status === 'CLOSED') return;
    if (thread.id !== activeId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await api.replyTicket(activeId, {
        body: reply.body.trim(),
        attachments: reply.attachments,
      });
      setReply(EMPTY_REPLY);
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
      setReply(EMPTY_REPLY);
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

  const canReply = Boolean(thread && thread.id === activeId && thread.status !== 'CLOSED');

  return (
    <div className="mm-help">
      <header className="mm-help__intro">
        <LifeBuoy size={22} />
        <div>
          <h2>Help Center</h2>
          <p>
            Report a platform issue or send product feedback. MentorMuni sees your{' '}
            <strong>{organizationName || 'organization'}</strong> and the{' '}
            <strong>{portalLabel(sourcePortal)}</strong> — not your name.
          </p>
        </div>
      </header>

      {error ? <p className="mm-help__error">{error}</p> : null}

      <div className="mm-help__grid">
        <section className="mm-help__panel">
          <div className="mm-help__panel-head">
            <h3>New request</h3>
            {activeId ? (
              <button type="button" className="mm-help__ghost" onClick={clearTicketSelection}>
                Writing new — hide ticket
              </button>
            ) : null}
          </div>
          <form
            onSubmit={submitTicket}
            className="mm-help__form"
            onFocusCapture={() => {
              // Keep compose screenshots separate from ticket replies.
              if (activeId) clearTicketSelection();
            }}
          >
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
          <p className="mm-help__hint">Open a ticket to view its conversation and reply there.</p>
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
                  onClick={() => {
                    if (t.id === activeId) {
                      clearTicketSelection();
                      return;
                    }
                    openTicket(t.id);
                  }}
                >
                  <strong>
                    #{t.id} · {t.subject}
                  </strong>
                  <span>
                    {statusLabel(t.status)} · {formatWhen(t.updated_at)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {!activeId && !threadLoading ? (
        <section className="mm-help__panel mm-help__thread mm-help__thread--empty" aria-live="polite">
          <MessageSquare size={22} aria-hidden />
          <div>
            <h3>No ticket selected</h3>
            <p className="mm-help__muted">
              Pick a request on the right to read its thread and leave a reply on that ticket only.
              Screenshots you add for a reply stay on that ticket — they are not shared with new
              requests.
            </p>
          </div>
        </section>
      ) : null}

      {threadLoading ? (
        <section className="mm-help__panel mm-help__thread">
          <p className="mm-help__muted">Opening ticket…</p>
        </section>
      ) : null}

      {thread && thread.id === activeId && !threadLoading ? (
        <section className="mm-help__panel mm-help__thread" key={thread.id}>
          <div className="mm-help__thread-head">
            <div>
              <p className="mm-help__kicker">
                Ticket #{thread.id} · {statusLabel(thread.status)} ·{' '}
                {portalLabel(thread.source_portal)}
              </p>
              <h3>{thread.subject}</h3>
            </div>
            <div className="mm-help__thread-actions">
              {thread.status !== 'CLOSED' ? (
                <button
                  type="button"
                  className="mm-help__btn mm-help__btn--danger"
                  onClick={closeMine}
                  disabled={saving}
                >
                  <CheckCircle2 size={15} strokeWidth={2.2} aria-hidden />
                  Mark resolved
                </button>
              ) : null}
              <button
                type="button"
                className="mm-help__btn mm-help__btn--quiet"
                onClick={clearTicketSelection}
                aria-label="Close panel"
                title="Close panel"
              >
                <X size={15} strokeWidth={2.2} aria-hidden />
                Close panel
              </button>
            </div>
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
                    <a
                      key={file.filename + file.data_base64.slice(0, 12)}
                      href={attachmentSrc(file)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={attachmentSrc(file)} alt={file.filename} />
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          {thread.status === 'CLOSED' ? (
            <p className="mm-help__muted">This request is closed. Open another ticket to continue.</p>
          ) : canReply ? (
            <form
              key={`reply-${thread.id}`}
              onSubmit={submitReply}
              className="mm-help__form mm-help__reply"
            >
              <p className="mm-help__reply-label">
                Reply on ticket #{thread.id}
              </p>
              <label>
                Your message
                <textarea
                  value={reply.body}
                  onChange={(e) => setReply((p) => ({ ...p, body: e.target.value }))}
                  rows={3}
                  required
                  placeholder={`Add detail for MentorMuni about “${thread.subject}”…`}
                />
              </label>
              <label className="mm-help__file">
                <Paperclip size={15} />
                Screenshots for this reply only (up to 3)
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
              <button type="submit" disabled={saving || !reply.body.trim()}>
                <Send size={15} />
                Send reply on #{thread.id}
              </button>
            </form>
          ) : null}
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
        <li key={`${file.filename}-${i}-${file.data_base64?.slice(0, 16) || i}`}>
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
