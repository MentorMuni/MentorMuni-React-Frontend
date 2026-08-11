import { useEffect, useState } from 'react';
import { Inbox, Paperclip, Send } from 'lucide-react';
import { attachmentSrc, filesToAttachments } from '../../lib/helpAttachments';
import { platformSupportApi } from '../supportApi';
import '../../components/help/help-center.css';

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

export default function SupportInboxPage() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('OPEN_QUEUE');
  const [thread, setThread] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reply, setReply] = useState({ body: '', attachments: [] });

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

  async function openTicket(id) {
    const data = await platformSupportApi.getTicket(id);
    setThread(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await loadList();
        setError('');
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load Support Inbox.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
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
      setReply({ body: '', attachments: [] });
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
      await loadList();
    } catch (err) {
      setError(err.message || 'Could not close ticket.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mm-help">
      <header className="mm-help__intro">
        <Inbox size={22} />
        <div>
          <h2>Support Inbox</h2>
          <p>
            Campus issues and feedback. You see organization name and which portal it came from —
            never the student or HOD name.
          </p>
        </div>
      </header>

      {error ? <p className="mm-help__error">{error}</p> : null}

      <div className="mm-help__grid">
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
                  onClick={() => openTicket(t.id).catch((err) => setError(err.message))}
                >
                  <strong>#{t.id} · {t.subject}</strong>
                  <span>
                    {t.organization_name} · {portalLabel(t.source_portal)} · {t.reporter_role_label} ·{' '}
                    {statusLabel(t.status)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mm-help__panel">
          {!thread ? (
            <p className="mm-help__muted">Pick a ticket to reply with a resolution.</p>
          ) : (
            <>
              <div className="mm-help__thread-head">
                <div>
                  <p className="mm-help__kicker">
                    #{thread.id} · {thread.organization_name} ({thread.organization_code}) ·{' '}
                    {portalLabel(thread.source_portal)} · {thread.reporter_role_label}
                  </p>
                  <h3>{thread.subject}</h3>
                </div>
                {thread.status !== 'CLOSED' ? (
                  <button type="button" className="mm-help__ghost" onClick={closeTicket} disabled={saving}>
                    Close ticket
                  </button>
                ) : null}
              </div>

              <ol className="mm-help__replies">
                {(thread.replies || []).map((r) => (
                  <li key={r.id} className={r.author_kind === 'platform' ? 'is-staff' : ''}>
                    <header>
                      <strong>{r.author_label === 'Reporter' ? thread.reporter_role_label : r.author_label}</strong>
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
                <p className="mm-help__muted">Ticket closed.</p>
              ) : (
                <form className="mm-help__form" onSubmit={submitReply}>
                  <label>
                    Resolution / reply
                    <textarea
                      value={reply.body}
                      onChange={(e) => setReply((p) => ({ ...p, body: e.target.value }))}
                      rows={4}
                      required
                      placeholder="Explain the fix or ask for one more screenshot…"
                    />
                  </label>
                  <label className="mm-help__file">
                    <Paperclip size={15} />
                    Attach image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={async (event) => {
                        try {
                          const extra = await filesToAttachments(event.target.files);
                          setReply((p) => ({
                            ...p,
                            attachments: [...p.attachments, ...extra].slice(0, 3),
                          }));
                        } catch (err) {
                          setError(err.message);
                        } finally {
                          event.target.value = '';
                        }
                      }}
                    />
                  </label>
                  <button type="submit" disabled={saving}>
                    <Send size={15} />
                    {saving ? 'Sending…' : 'Reply as MentorMuni Support'}
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
