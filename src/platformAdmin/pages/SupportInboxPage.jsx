import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Inbox, Paperclip, Send, X } from 'lucide-react';
import { attachmentSrc, filesToAttachments } from '../../lib/helpAttachments';
import { platformSupportApi } from '../supportApi';
import '../../components/help/help-center.css';

const EMPTY_REPLY = { body: '', attachments: [] };

function statusLabel(status) {
  if (status === 'CLOSED') return 'Closed';
  if (status === 'WAITING_REPORTER') return 'Waiting on campus';
  if (status === 'WAITING_PLATFORM') return 'Needs reply';
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

export default function SupportInboxPage() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('OPEN_QUEUE');
  const [thread, setThread] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reply, setReply] = useState(EMPTY_REPLY);
  const openSeq = useRef(0);

  async function loadList() {
    const params =
      filter === 'OPEN_QUEUE'
        ? {}
        : filter
          ? { status: filter }
          : {};
    const data = await platformSupportApi.listTickets(params);
    let items = data?.items || [];
    if (filter === 'OPEN_QUEUE') {
      items = items.filter((t) => t.status !== 'CLOSED');
    }
    setTickets(items);
  }

  function clearSelection() {
    openSeq.current += 1;
    setThread(null);
    setReply(EMPTY_REPLY);
    setThreadLoading(false);
  }

  async function openTicket(id) {
    if (thread?.id === id) {
      clearSelection();
      return;
    }
    const seq = ++openSeq.current;
    setReply(EMPTY_REPLY);
    setError('');
    setThreadLoading(true);
    try {
      const data = await platformSupportApi.getTicket(id);
      if (seq !== openSeq.current) return;
      setThread(data);
    } catch (err) {
      if (seq !== openSeq.current) return;
      setThread(null);
      setError(err.message || 'Could not open ticket.');
    } finally {
      if (seq === openSeq.current) setThreadLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    clearSelection();
    (async () => {
      try {
        setLoading(true);
        await loadList();
        if (!cancelled) setError('');
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load Support Inbox.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when filter changes
  }, [filter]);

  async function submitReply(event) {
    event.preventDefault();
    if (!thread || thread.status === 'CLOSED') return;
    setSaving(true);
    setError('');
    try {
      const updated = await platformSupportApi.replyTicket(thread.id, {
        body: reply.body.trim(),
        attachments: reply.attachments,
      });
      setReply(EMPTY_REPLY);
      setThread(updated);
      await loadList();
    } catch (err) {
      setError(err.message || 'Could not send resolution.');
    } finally {
      setSaving(false);
    }
  }

  async function closeTicket() {
    if (!thread) return;
    setSaving(true);
    setError('');
    try {
      const updated = await platformSupportApi.closeTicket(thread.id);
      setThread(updated);
      setReply(EMPTY_REPLY);
      await loadList();
    } catch (err) {
      setError(err.message || 'Could not close ticket.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mm-help mm-help--inbox">
      {error ? <p className="mm-help__error">{error}</p> : null}

      <div className="mm-help__grid mm-help__grid--inbox">
        <section className="mm-help__panel">
          <div className="mm-help__thread-head">
            <h3>Queue</h3>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="OPEN_QUEUE">Open queue</option>
              <option value="OPEN">Open</option>
              <option value="WAITING_PLATFORM">Needs MentorMuni</option>
              <option value="WAITING_REPORTER">Waiting on campus</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <p className="mm-help__hint">Select a ticket to open the thread and reply.</p>
          {loading ? <p className="mm-help__muted">Loading…</p> : null}
          {!loading && tickets.length === 0 ? (
            <p className="mm-help__muted">No tickets in this view.</p>
          ) : null}
          <ul className="mm-help__list">
            {tickets.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={thread?.id === t.id ? 'is-on' : ''}
                  onClick={() => openTicket(t.id)}
                >
                  <strong>
                    #{t.id} · {t.subject}
                  </strong>
                  <span>
                    {t.organization_name} · {portalLabel(t.source_portal)} · {t.reporter_role_label} ·{' '}
                    {statusLabel(t.status)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mm-help__panel mm-help__panel--thread">
          {threadLoading ? <p className="mm-help__muted">Opening ticket…</p> : null}

          {!thread && !threadLoading ? (
            <div className="mm-help__thread--empty">
              <Inbox size={22} aria-hidden />
              <div>
                <h3>No ticket selected</h3>
                <p className="mm-help__muted">
                  Pick a ticket from the queue to read the conversation and send a resolution.
                </p>
              </div>
            </div>
          ) : null}

          {thread && !threadLoading ? (
            <>
              <div className="mm-help__ticket-head">
                <div className="mm-help__ticket-toolbar">
                  <div className="mm-help__ticket-topline">
                    <span className="mm-help__ticket-id">Ticket #{thread.id}</span>
                    <span
                      className={`mm-help__status ${
                        thread.status === 'CLOSED' ? 'is-closed' : 'is-open'
                      }`}
                    >
                      {statusLabel(thread.status)}
                    </span>
                  </div>
                  <div className="mm-help__thread-actions">
                    {thread.status !== 'CLOSED' ? (
                      <button
                        type="button"
                        className="mm-help__btn mm-help__btn--danger"
                        onClick={closeTicket}
                        disabled={saving}
                      >
                        <CheckCircle2 size={15} strokeWidth={2.2} aria-hidden />
                        Close ticket
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="mm-help__btn mm-help__btn--quiet"
                      onClick={clearSelection}
                      aria-label="Close panel"
                      title="Close panel"
                    >
                      <X size={15} strokeWidth={2.2} aria-hidden />
                      Close panel
                    </button>
                  </div>
                </div>

                <h3 className="mm-help__ticket-subject">{thread.subject}</h3>

                <dl className="mm-help__ticket-facts">
                  <div>
                    <dt>College</dt>
                    <dd>
                      {thread.organization_name}
                      {thread.organization_code ? (
                        <span className="mm-help__ticket-code"> ({thread.organization_code})</span>
                      ) : null}
                    </dd>
                  </div>
                  <div>
                    <dt>Portal</dt>
                    <dd>{portalLabel(thread.source_portal)}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{thread.reporter_role_label}</dd>
                  </div>
                </dl>
              </div>

              <ol className="mm-help__replies">
                {(thread.replies || []).map((r) => (
                  <li key={r.id} className={r.author_kind === 'platform' ? 'is-staff' : ''}>
                    <header>
                      <strong>
                        {r.author_label === 'Reporter' ? thread.reporter_role_label : r.author_label}
                      </strong>
                      <span>{formatWhen(r.created_at)}</span>
                    </header>
                    <p>{r.body}</p>
                    <div className="mm-help__shots">
                      {(r.attachments || []).map((file) => (
                        <a
                          key={file.filename + String(file.data_base64).slice(0, 12)}
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
                <p className="mm-help__muted">Ticket closed. Select another from the queue.</p>
              ) : (
                <form
                  key={`reply-${thread.id}`}
                  className="mm-help__form mm-help__reply"
                  onSubmit={submitReply}
                >
                  <p className="mm-help__reply-label">Reply on ticket #{thread.id}</p>
                  <label>
                    Resolution / reply
                    <textarea
                      value={reply.body}
                      onChange={(e) => setReply((p) => ({ ...p, body: e.target.value }))}
                      rows={4}
                      required
                      placeholder={`Explain the fix for “${thread.subject}”…`}
                    />
                  </label>
                  <label className="mm-help__file">
                    <Paperclip size={15} />
                    Screenshots for this reply only (up to 3)
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={async (event) => {
                        try {
                          const extra = await filesToAttachments(event.target.files);
                          setReply((p) => ({
                            ...p,
                            attachments: [...(p.attachments || []), ...extra].slice(0, 3),
                          }));
                        } catch (err) {
                          setError(err.message);
                        } finally {
                          event.target.value = '';
                        }
                      }}
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
                    {saving ? 'Sending…' : `Reply on #${thread.id}`}
                  </button>
                </form>
              )}
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
