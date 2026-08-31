import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LifeBuoy, MessageSquare, Send, X } from 'lucide-react';
import { attachmentSrc, filesToAttachments, HELP_ATTACHMENT_HINT, sanitizeAttachments } from '../../lib/helpAttachments';
import './help-center.css';

const CATEGORIES = [
  { id: 'feature_broken', label: "Something I tried didn't work" },
  { id: 'not_working', label: "Can't sign in or open a page" },
  { id: 'feedback', label: 'I have a suggestion' },
  { id: 'other', label: 'General question' },
];

const EMPTY_COMPOSE = {
  subject: '',
  category: 'feature_broken',
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

function formatHelpError(err) {
  const raw = String(err?.message || err || '').trim();
  if (!raw) return 'Could not complete that action. Try again.';
  if (/field required/i.test(raw)) {
    return 'Fill in the subject and description before sending. Screenshots are optional.';
  }
  return raw;
}

function validateTicketCompose(compose) {
  const subject = String(compose.subject || '').trim();
  const body = String(compose.body || '').trim();
  if (subject.length < 4) {
    return 'Subject is required (at least 4 characters).';
  }
  if (body.length < 8) {
    return 'Description is required (at least 8 characters). Screenshots alone are not enough.';
  }
  return '';
}

function ScreenshotField({ id, attachments, onPick, onRemove, hint = HELP_ATTACHMENT_HINT }) {
  const count = attachments?.length || 0;
  return (
    <div className="mm-help__file-block">
      <label className="mm-help__file-label" htmlFor={id}>
        Screenshots <span className="mm-help__optional">(optional)</span>
      </label>
      <p className="mm-help__file-hint">{hint}</p>
      <input
        id={id}
        type="file"
        className="mm-help__file-input"
        accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp"
        multiple
        onChange={onPick}
      />
      {count > 0 ? (
        <p className="mm-help__file-status" role="status">
          {count} image{count === 1 ? '' : 's'} attached — preview below, sent with your message.
        </p>
      ) : (
        <p className="mm-help__file-status mm-help__file-status--empty">
          No images attached yet.
        </p>
      )}
      <AttachmentChips files={attachments} onRemove={onRemove} />
    </div>
  );
}

function formatWhen(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatShortWhen(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function HelpCenterView({
  sourcePortal,
  organizationName,
  api,
  disabledReason = '',
  hideTitle = false,
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

  function onPickFiles(setter, getExistingCount) {
    return async (event) => {
      setError('');
      try {
        const existingCount =
          typeof getExistingCount === 'function' ? getExistingCount() : 0;
        const extra = await filesToAttachments(event.target.files, { existingCount });
        setter((prev) => ({
          ...prev,
          attachments: sanitizeAttachments([...(prev.attachments || []), ...extra]),
        }));
      } catch (err) {
        setError(formatHelpError(err));
      } finally {
        event.target.value = '';
      }
    };
  }

  async function submitTicket(event) {
    event.preventDefault();
    if (disabledReason) return;
    const validationErr = validateTicketCompose(compose);
    if (validationErr) {
      setError(validationErr);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const attachments = sanitizeAttachments(compose.attachments);
      const created = await api.createTicket({
        subject: compose.subject.trim(),
        body: compose.body.trim(),
        category: compose.category,
        source_portal: sourcePortal,
        attachments,
      });
      setCompose(EMPTY_COMPOSE);
      setReply(EMPTY_REPLY);
      await refreshList();
      setActiveId(created.id);
      setThread(created);
    } catch (err) {
      setError(formatHelpError(err));
    } finally {
      setSaving(false);
    }
  }

  async function submitReply(event) {
    event.preventDefault();
    if (!activeId || !thread || thread.status === 'CLOSED') return;
    if (thread.id !== activeId) return;
    const body = reply.body.trim();
    if (!body) {
      setError('Type a message before sending your reply.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const updated = await api.replyTicket(activeId, {
        body,
        attachments: sanitizeAttachments(reply.attachments),
      });
      setReply(EMPTY_REPLY);
      setThread(updated);
      await refreshList();
    } catch (err) {
      setError(formatHelpError(err));
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
        {!hideTitle ? (
          <header className="mm-help__intro">
            <LifeBuoy size={22} />
            <div>
              <h2>Help Center</h2>
              <p>Message the MentorMuni team about platform issues or feedback.</p>
            </div>
          </header>
        ) : null}
        <p className="mm-help__note">{disabledReason}</p>
      </div>
    );
  }

  const canReply = Boolean(thread && thread.id === activeId && thread.status !== 'CLOSED');

  return (
    <div className="mm-help">
      {!hideTitle ? (
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
      ) : null}

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
            noValidate
            onFocusCapture={() => {
              // Keep compose screenshots separate from ticket replies.
              if (activeId) clearTicketSelection();
            }}
          >
            <label>
              What do you need help with?
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
              Subject <span className="mm-help__required">(required)</span>
              <input
                value={compose.subject}
                onChange={(e) => setCompose((p) => ({ ...p, subject: e.target.value }))}
                placeholder="e.g. Drive dates are not saving"
                minLength={4}
                maxLength={255}
              />
            </label>
            <label>
              Describe what happened <span className="mm-help__required">(required)</span>
              <textarea
                value={compose.body}
                onChange={(e) => setCompose((p) => ({ ...p, body: e.target.value }))}
                rows={5}
                placeholder="What did you try, what did you expect, and what went wrong?"
                minLength={8}
              />
            </label>
            <ScreenshotField
              id="help-compose-screenshots"
              attachments={compose.attachments}
              onPick={onPickFiles(setCompose, () => compose.attachments?.length || 0)}
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
          <p className="mm-help__hint">Select a request on the right to read messages and reply there.</p>
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
                  <strong>{t.subject}</strong>
                  <span>
                    {statusLabel(t.status)} · {formatShortWhen(t.updated_at)}
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
            <h3>No request selected</h3>
            <p className="mm-help__muted">
              Select a request on the right to read the conversation and reply. Screenshots you add
              for a reply stay on that request — they are not shared with new ones.
            </p>
          </div>
        </section>
      ) : null}

      {threadLoading ? (
        <section className="mm-help__panel mm-help__thread">
          <p className="mm-help__muted">Opening conversation…</p>
        </section>
      ) : null}

      {thread && thread.id === activeId && !threadLoading ? (
        <section className="mm-help__panel mm-help__thread" key={thread.id}>
          <div className="mm-help__thread-head">
            <div>
              <p className="mm-help__kicker">
                {statusLabel(thread.status)} · Updated {formatShortWhen(thread.updated_at)}
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
            <p className="mm-help__muted">This request is closed. Send a new request if you need more help.</p>
          ) : canReply ? (
            <form
              key={`reply-${thread.id}`}
              onSubmit={submitReply}
              className="mm-help__form mm-help__reply"
              noValidate
            >
              <p className="mm-help__reply-label">Add a reply to this request</p>
              <label>
                Your message <span className="mm-help__required">(required)</span>
                <textarea
                  value={reply.body}
                  onChange={(e) => setReply((p) => ({ ...p, body: e.target.value }))}
                  rows={3}
                  placeholder={`Add detail for MentorMuni about “${thread.subject}”…`}
                />
              </label>
              <ScreenshotField
                id={`help-reply-screenshots-${thread.id}`}
                attachments={reply.attachments}
                onPick={onPickFiles(setReply, () => reply.attachments?.length || 0)}
                onRemove={(i) =>
                  setReply((p) => ({
                    ...p,
                    attachments: p.attachments.filter((_, idx) => idx !== i),
                  }))
                }
              />
              <button type="submit" disabled={saving || !reply.body.trim()}>
                <Send size={15} />
                Send reply
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
    <ul className="mm-help__chips" aria-label="Attached screenshots">
      {files.map((file, i) => (
        <li key={`${file.filename}-${i}-${file.data_base64?.slice(0, 16) || i}`}>
          <img src={attachmentSrc(file)} alt={file.filename || `Screenshot ${i + 1}`} />
          <span>{file.filename || `Image ${i + 1}`}</span>
          <button type="button" onClick={() => onRemove(i)} aria-label="Remove image">
            <X size={12} />
          </button>
        </li>
      ))}
    </ul>
  );
}
