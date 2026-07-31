import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  History,
  Link2,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Replace,
  ShieldOff,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { canMutateCampus } from '../roles';
import {
  buildHodActivationUrl,
  deleteDepartment,
  fetchDepartments,
  inviteDepartmentHod,
  reinviteDepartmentHod,
  replaceDepartmentHod,
  revokeDepartmentHod,
  saveDepartment,
} from '../departmentsApi';
import { subscribeOrgDb, listDepartments as listLocalDepartments } from '../store';

const emptyDeptForm = { id: '', name: '', code: '' };
const emptyHodForm = { name: '', email: '', reason: '' };

function statusBadge(status) {
  if (status === 'active') return 'mm-org-badge--active';
  if (status === 'invited') return 'mm-org-badge--pending';
  if (status === 'revoked') return 'mm-org-badge--danger';
  return 'mm-org-badge--neutral';
}

export default function DepartmentsPage() {
  const session = getOrgSession();
  const canEdit = canMutateCampus(session?.role);

  const [departments, setDepartments] = useState(() => listLocalDepartments());
  const [source, setSource] = useState('local');
  const [loading, setLoading] = useState(false);
  const [deptForm, setDeptForm] = useState(emptyDeptForm);
  const [panel, setPanel] = useState(null); // invite | replace | history | null
  const [activeId, setActiveId] = useState('');
  const [hodForm, setHodForm] = useState(emptyHodForm);
  const [linkInfo, setLinkInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const result = await fetchDepartments();
    setDepartments(result.departments || []);
    setSource(result.source || 'local');
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    fetchDepartments().then((result) => {
      if (cancelled) return;
      setDepartments(result.departments || []);
      setSource(result.source || 'local');
    });
    const unsub = subscribeOrgDb(() => {
      fetchDepartments().then((result) => {
        if (cancelled) return;
        setDepartments(result.departments || []);
        setSource(result.source || 'local');
      });
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const activeDept = useMemo(
    () => departments.find((d) => d.id === activeId) || null,
    [departments, activeId]
  );

  const flash = (ok, text) => {
    setErr(ok ? '' : text);
    setMsg(ok ? text : '');
  };

  const closePanels = () => {
    setPanel(null);
    setActiveId('');
    setHodForm(emptyHodForm);
  };

  const onSaveDept = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setBusy(true);
    flash(true, '');
    const result = await saveDepartment(deptForm);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    setDeptForm(emptyDeptForm);
    flash(true, deptForm.id ? 'Department updated.' : 'Department created. Next: invite an HOD.');
    await refresh();
  };

  const openInvite = (dept) => {
    setActiveId(dept.id);
    setPanel('invite');
    setHodForm({
      name: dept.hodName || '',
      email: dept.hodEmail || '',
      reason: '',
    });
    setLinkInfo(null);
    setMsg('');
    setErr('');
  };

  const openReplace = (dept) => {
    setActiveId(dept.id);
    setPanel('replace');
    setHodForm({ name: '', email: '', reason: '' });
    setLinkInfo(null);
    setMsg('');
    setErr('');
  };

  const openHistory = (dept) => {
    setActiveId(dept.id);
    setPanel('history');
    setMsg('');
    setErr('');
  };

  const onInvite = async (e) => {
    e.preventDefault();
    if (!canEdit || !activeId) return;
    setBusy(true);
    const result = await inviteDepartmentHod(activeId, hodForm);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    const url = result.activationUrl || buildHodActivationUrl(result.activationToken);
    setLinkInfo({ url, token: result.activationToken, email: hodForm.email });
    flash(true, result.message || 'Invite ready.');
    await refresh();
  };

  const onReplace = async (e) => {
    e.preventDefault();
    if (!canEdit || !activeId) return;
    setBusy(true);
    const result = await replaceDepartmentHod(activeId, hodForm);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    const url = result.activationUrl || buildHodActivationUrl(result.activationToken);
    setLinkInfo({ url, token: result.activationToken, email: hodForm.email });
    flash(true, result.message || 'HOD replaced.');
    await refresh();
  };

  const onReinvite = async (dept) => {
    if (!canEdit) return;
    setBusy(true);
    const result = await reinviteDepartmentHod(dept.id);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    setActiveId(dept.id);
    setPanel('invite');
    setHodForm({ name: dept.hodName || '', email: dept.hodEmail || '', reason: '' });
    const url = result.activationUrl || buildHodActivationUrl(result.activationToken);
    setLinkInfo({ url, token: result.activationToken, email: dept.hodEmail });
    flash(true, result.message || 'Reinvite ready.');
    await refresh();
  };

  const onRevoke = async (dept) => {
    if (!canEdit) return;
    if (!window.confirm(`Revoke HOD access for ${dept.hodName || dept.hodEmail}? Students stay in ${dept.name}.`)) {
      return;
    }
    setBusy(true);
    const result = await revokeDepartmentHod(dept.id);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    closePanels();
    setLinkInfo(null);
    flash(true, result.message || 'HOD revoked.');
    await refresh();
  };

  const onDelete = async (dept) => {
    if (!canEdit) return;
    if (!window.confirm(`Delete ${dept.name}? Students will be unassigned from this branch.`)) return;
    setBusy(true);
    const result = await deleteDepartment(dept.id);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    if (activeId === dept.id) closePanels();
    flash(true, 'Department removed.');
    await refresh();
  };

  const copyLink = async () => {
    if (!linkInfo?.url) return;
    try {
      await navigator.clipboard.writeText(linkInfo.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      flash(false, 'Could not copy. Select the link manually.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="mm-org-toolbar">
        <div>
          <p className="m-0 text-sm mm-org-text-muted">
            Branches + HOD mentors. Invite → activate password → active.
            {source === 'local' ? ' (Local demo until departments API is live.)' : ' (Live API.)'}
          </p>
        </div>
        {!canEdit ? (
          <span className="mm-org-badge mm-org-badge--neutral">View only</span>
        ) : null}
      </div>

      {err ? <div className="mm-org-alert mm-org-alert--error">{err}</div> : null}
      {msg ? <div className="mm-org-alert mm-org-alert--success">{msg}</div> : null}

      {linkInfo?.url ? (
        <section className="mm-org-panel" style={{ borderColor: 'rgba(12, 110, 140, 0.35)' }}>
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">HOD activation link</h2>
              <p className="mm-org-panel__meta">
                Share with {linkInfo.email}. They open it, set a password, then log in as HOD.
                Email delivery attaches when the API is connected.
              </p>
            </div>
            <button type="button" className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm" onClick={() => setLinkInfo(null)}>
              <X size={14} /> Dismiss
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="mm-org-code mm-org-code--block" style={{ flex: 1 }}>
              {linkInfo.url}
            </code>
            <button type="button" className="mm-org-btn mm-org-btn--primary" onClick={copyLink}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <a className="mm-org-btn mm-org-btn--ghost" href={linkInfo.url} target="_blank" rel="noreferrer">
              <Link2 size={15} /> Open
            </a>
          </div>
        </section>
      ) : null}

      {panel === 'history' && activeDept ? (
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Mentor history · {activeDept.name}</h2>
              <p className="mm-org-panel__meta">Invite, activate, revoke, and replace events</p>
            </div>
            <button type="button" className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm" onClick={closePanels}>
              Close
            </button>
          </div>
          {(activeDept.mentorHistory || []).length ? (
            <ul className="m-0 max-h-72 list-none space-y-2 overflow-auto p-0">
              {activeDept.mentorHistory.map((h) => (
                <li
                  key={h.id}
                  className="rounded-xl border px-3 py-2 text-xs mm-org-text"
                  style={{ borderColor: 'var(--org-line)' }}
                >
                  <strong className="uppercase tracking-wide mm-org-text">{h.event}</strong>
                  <span className="mm-org-text-muted">
                    {' '}
                    · {new Date(h.at).toLocaleString()}
                  </span>
                  <div className="mt-1">
                    {h.name || '—'} · {h.email || '—'}
                    {h.reason ? ` · ${h.reason}` : ''}
                    {h.replacedByEmail ? ` → ${h.replacedByEmail}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mm-org-empty">No mentor events yet.</div>
          )}
        </section>
      ) : null}

      <div className="mm-org-split">
        {canEdit ? (
          <section className="mm-org-panel">
            <div className="mm-org-panel__head">
              <div>
                <h2 className="mm-org-panel__title">
                  {deptForm.id ? 'Edit department' : 'Create department'}
                </h2>
                <p className="mm-org-panel__meta">
                  Name and code only. Invite the HOD after the branch exists.
                </p>
              </div>
            </div>
            <form onSubmit={onSaveDept}>
              <div className="mm-org-form-grid">
                <div>
                  <label className="mm-org-label" htmlFor="dept-name">Name</label>
                  <input
                    id="dept-name"
                    className="mm-org-input"
                    placeholder="Computer Science"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mm-org-label" htmlFor="dept-code">Code</label>
                  <input
                    id="dept-code"
                    className="mm-org-input"
                    placeholder="CSE"
                    value={deptForm.code}
                    onChange={(e) => setDeptForm((f) => ({ ...f, code: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="mm-org-form-actions">
                <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy}>
                  <Plus size={15} /> {deptForm.id ? 'Save department' : 'Create department'}
                </button>
                {deptForm.id ? (
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--ghost"
                    onClick={() => setDeptForm(emptyDeptForm)}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            {panel === 'invite' && activeDept ? (
              <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--org-line)' }}>
                <h3 className="mm-org-panel__title">Invite HOD · {activeDept.name}</h3>
                <p className="mt-1 mb-3 text-xs mm-org-text-muted">
                  Same pattern as TPO: link → set password → login.
                </p>
                <form onSubmit={onInvite}>
                  <div className="mm-org-form-grid">
                    <div>
                      <label className="mm-org-label" htmlFor="hod-name">Name</label>
                      <input
                        id="hod-name"
                        className="mm-org-input"
                        value={hodForm.name}
                        onChange={(e) => setHodForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Dr. Priya Sharma"
                        required
                      />
                    </div>
                    <div>
                      <label className="mm-org-label" htmlFor="hod-email">Email</label>
                      <input
                        id="hod-email"
                        type="email"
                        className="mm-org-input"
                        value={hodForm.email}
                        onChange={(e) => setHodForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="hod.cse@college.edu"
                        required
                      />
                    </div>
                  </div>
                  <div className="mm-org-form-actions">
                    <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy}>
                      <Mail size={15} /> Generate invite
                    </button>
                    <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={closePanels}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {panel === 'replace' && activeDept ? (
              <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--org-line)' }}>
                <h3 className="mm-org-panel__title">Replace HOD · {activeDept.name}</h3>
                <p className="mt-1 mb-3 text-xs mm-org-text-muted">
                  Revokes {activeDept.hodEmail || 'current mentor'}, keeps students, invites the new HOD.
                </p>
                <form onSubmit={onReplace}>
                  <div className="mm-org-form-grid">
                    <div>
                      <label className="mm-org-label" htmlFor="rep-name">New HOD name</label>
                      <input
                        id="rep-name"
                        className="mm-org-input"
                        value={hodForm.name}
                        onChange={(e) => setHodForm((f) => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="mm-org-label" htmlFor="rep-email">New HOD email</label>
                      <input
                        id="rep-email"
                        type="email"
                        className="mm-org-input"
                        value={hodForm.email}
                        onChange={(e) => setHodForm((f) => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="mm-org-label" htmlFor="rep-reason">Reason (optional)</label>
                      <input
                        id="rep-reason"
                        className="mm-org-input"
                        value={hodForm.reason}
                        onChange={(e) => setHodForm((f) => ({ ...f, reason: e.target.value }))}
                        placeholder="Transfer / resignation / role change"
                      />
                    </div>
                  </div>
                  <div className="mm-org-form-actions">
                    <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy}>
                      <Replace size={15} /> Replace & invite
                    </button>
                    <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={closePanels}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="mm-org-panel">
            <h2 className="mm-org-panel__title">Departments</h2>
            <p className="mm-org-panel__meta">
              You have view-only access. Ask your TPO to change mentors or branches.
            </p>
          </section>
        )}

        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">All departments</h2>
              <p className="mm-org-panel__meta">
                {loading ? 'Loading…' : `${departments.length} branch(es)`}
              </p>
            </div>
          </div>
          {departments.length ? (
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>HOD / mentor</th>
                    <th>Students</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <p className="mm-org-table__title">{d.name}</p>
                        <p className="mm-org-table__meta">{d.code}</p>
                      </td>
                      <td>
                        <p className="mm-org-table__title">{d.hodName || 'Unassigned'}</p>
                        <p className="mm-org-table__meta">{d.hodEmail || 'No email'}</p>
                        <span className={`mm-org-badge ${statusBadge(d.hodStatus)}`}>
                          {d.hodStatus || 'unassigned'}
                        </span>
                      </td>
                      <td>{d.studentCount || 0}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {canEdit ? (
                            <>
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                onClick={() =>
                                  setDeptForm({ id: d.id, name: d.name, code: d.code })
                                }
                              >
                                <Pencil size={14} /> Edit
                              </button>
                              {d.hodStatus === 'unassigned' || !d.hodEmail ? (
                                <button
                                  type="button"
                                  className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                                  onClick={() => openInvite(d)}
                                >
                                  <UserPlus size={14} /> Invite HOD
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                    onClick={() => onReinvite(d)}
                                    disabled={busy}
                                  >
                                    <RefreshCw size={14} /> Reinvite
                                  </button>
                                  <button
                                    type="button"
                                    className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                    onClick={() => openReplace(d)}
                                  >
                                    <Replace size={14} /> Replace
                                  </button>
                                  <button
                                    type="button"
                                    className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                                    onClick={() => onRevoke(d)}
                                    disabled={busy}
                                  >
                                    <ShieldOff size={14} /> Revoke
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                onClick={() => openHistory(d)}
                              >
                                <History size={14} />
                              </button>
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                                onClick={() => onDelete(d)}
                                disabled={busy}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                              onClick={() => openHistory(d)}
                            >
                              <History size={14} /> History
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mm-org-empty">
              {canEdit
                ? 'Create your first department (e.g. CSE), then invite its HOD.'
                : 'No departments to show yet.'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
