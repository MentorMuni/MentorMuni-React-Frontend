import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Check,
  Copy,
  Eye,
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
  inviteDepartmentCoordinator,
  inviteDepartmentHod,
  reinviteDepartmentCoordinator,
  reinviteDepartmentHod,
  replaceDepartmentCoordinator,
  replaceDepartmentHod,
  revokeDepartmentCoordinator,
  revokeDepartmentHod,
  saveDepartment,
} from '../departmentsApi';
import { subscribeOrgDb } from '../store';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';

const emptyDeptForm = { id: '', name: '', code: '' };
const emptyHodForm = { name: '', email: '', reason: '' };

function mentorLabel(slot) {
  return slot === 'coordinator' ? 'Placement Coordinator' : 'HOD';
}

function mentorFields(dept, slot) {
  if (slot === 'coordinator') {
    return {
      name: dept?.coordinatorName || '',
      email: dept?.coordinatorEmail || '',
      status: dept?.coordinatorStatus || 'unassigned',
    };
  }
  return {
    name: dept?.hodName || '',
    email: dept?.hodEmail || '',
    status: dept?.hodStatus || 'unassigned',
  };
}

function isMentorUnassigned(dept, slot) {
  const m = mentorFields(dept, slot);
  return m.status === 'unassigned' || !m.email;
}

/** Normalize for duplicate checks: trim + case-insensitive. Codes also uppercased. */
function normalizeDeptName(name) {
  return String(name || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeDeptCode(code) {
  return String(code || '')
    .trim()
    .toUpperCase();
}

/**
 * Exact duplicates only (same name or same code). Variants like CS-1 / CS-2 are allowed.
 * @returns {{ field: 'name'|'code', existing: object }|null}
 */
function findDuplicateDepartment(departments, { id, name, code } = {}) {
  const nameKey = normalizeDeptName(name);
  const codeKey = normalizeDeptCode(code);
  if (!nameKey && !codeKey) return null;

  for (const dept of departments || []) {
    if (id && String(dept.id) === String(id)) continue;
    const existingCode = normalizeDeptCode(dept.code);
    const existingName = normalizeDeptName(dept.name);
    if (codeKey && existingCode === codeKey) {
      return { field: 'code', existing: dept };
    }
    if (nameKey && existingName === nameKey) {
      return { field: 'name', existing: dept };
    }
  }
  return null;
}

function duplicateDepartmentMessage(dup) {
  if (!dup?.existing) return 'This department is already added.';
  if (dup.field === 'code') {
    return `Department code "${normalizeDeptCode(dup.existing.code)}" is already added. Use a different code (e.g. CS-1, CS-2).`;
  }
  return `Department "${dup.existing.name}" is already added. Rename it or use a distinct branch (e.g. CS-1, CS-2).`;
}

function statusBadge(status) {
  if (status === 'active') return 'mm-org-badge--active';
  if (status === 'invited') return 'mm-org-badge--pending';
  if (status === 'revoked') return 'mm-org-badge--danger';
  return 'mm-org-badge--neutral';
}

function applyInviteResult(result, email, setters, mentorSlot = 'hod') {
  const { setLinkInfo, flash } = setters;
  const url = result.activationUrl || buildHodActivationUrl(result.activationToken);
  const slot = mentorSlot === 'coordinator' ? 'coordinator' : 'hod';
  const base = {
    url: url || '',
    token: result.activationToken || '',
    email,
    emailed: Boolean(result.emailed),
    emailUnknown: Boolean(result.emailUnknown),
    emailSkipped: Boolean(result.emailSkipped),
    emailDetail: result.emailDetail || '',
    source: result.source || '',
    mentorSlot: slot,
  };
  if (url || result.emailed === false || result.emailUnknown || result.emailSkipped) {
    setLinkInfo(base);
  } else if (result.emailed) {
    setLinkInfo({ ...base, url: '', token: '' });
  }
  flash(true, result.message || 'Done.');
}

function ModalShell({ title, meta, onClose, wide, children, labelledBy }) {
  return (
    <div
      className="mm-org-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`mm-org-modal${wide ? ' mm-org-modal--wide' : ''}`}>
        <div className="mm-org-panel__head" style={{ marginBottom: 12 }}>
          <div>
            <h2 id={labelledBy} className="mm-org-panel__title">
              {title}
            </h2>
            {meta ? <p className="mm-org-panel__meta">{meta}</p> : null}
          </div>
          <button type="button" className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm" onClick={onClose}>
            <X size={14} /> Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  const session = getOrgSession();
  const location = useLocation();
  const canEdit = canMutateCampus(session?.role);

  const [departments, setDepartments] = useState([]);
  const [source, setSource] = useState('local');
  const [loading, setLoading] = useState(true);
  const [deptForm, setDeptForm] = useState(emptyDeptForm);
  /** dept | invite | replace | revoke | history | view | null */
  const [panel, setPanel] = useState(null);
  const [mentorSlot, setMentorSlot] = useState('hod');
  const [activeId, setActiveId] = useState('');
  const [hodForm, setHodForm] = useState(emptyHodForm);
  const [linkInfo, setLinkInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const loadSeq = useRef(0);

  const mergeDepartmentRow = (prev, next) => {
    if (!next?.id) return prev;
    const idx = prev.findIndex((d) => String(d.id) === String(next.id));
    if (idx === -1) return [...prev, next];
    const copy = [...prev];
    copy[idx] = { ...copy[idx], ...next };
    return copy;
  };

  const loadDepartments = useCallback(async ({ keepMessages = false } = {}) => {
    const seq = ++loadSeq.current;
    setLoading(true);
    const result = await fetchDepartments();
    if (seq !== loadSeq.current) return result;

    setDepartments((prev) => (result.ok ? result.departments || [] : prev));
    if (result.ok) {
      setSource(result.source || 'local');
      if (!keepMessages) setErr('');
    } else if (result.error) {
      setErr(result.error);
      if (!keepMessages) setMsg('');
    }
    setLoading(false);
    return result;
  }, []);

  const deptTable = useTableQuery(departments, {
    searchKeys: ['name', 'code', 'hodName', 'hodEmail', 'coordinatorName', 'coordinatorEmail'],
    getSortValue: (row, key) => {
      if (key === 'department') return (row.name || row.code || '').toLowerCase();
      if (key === 'hod') return (row.hodName || row.hodEmail || '').toLowerCase();
      if (key === 'coordinator') return (row.coordinatorName || row.coordinatorEmail || '').toLowerCase();
      if (key === 'students') return row.studentCount || 0;
      return row[key];
    },
  });

  useEffect(() => {
    loadDepartments();
    const unsub = subscribeOrgDb(() => {
      if (!session?.demo) return;
      loadDepartments({ keepMessages: true });
    });
    return () => {
      loadSeq.current += 1;
      unsub();
    };
  }, [session?.demo, location.key, loadDepartments]);

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
    setMentorSlot('hod');
    setActiveId('');
    setHodForm(emptyHodForm);
    setDeptForm(emptyDeptForm);
  };

  const openCreateDept = () => {
    setDeptForm(emptyDeptForm);
    setActiveId('');
    setPanel('dept');
    setMsg('');
    setErr('');
  };

  const openEditDept = (dept) => {
    setDeptForm({ id: dept.id, name: dept.name, code: dept.code });
    setActiveId(dept.id);
    setPanel('dept');
    setMsg('');
    setErr('');
  };

  const onSaveDept = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    const name = String(deptForm.name || '').trim();
    const code = normalizeDeptCode(deptForm.code);
    if (!name || !code) {
      flash(false, 'Name and code are required.');
      return;
    }

    const dup = findDuplicateDepartment(departments, {
      id: deptForm.id,
      name,
      code,
    });
    if (dup) {
      flash(false, duplicateDepartmentMessage(dup));
      return;
    }

    setBusy(true);
    flash(true, '');
    const result = await saveDepartment({ ...deptForm, name, code });
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    const wasEdit = Boolean(deptForm.id);
    if (result.department) {
      setDepartments((prev) => mergeDepartmentRow(prev, result.department));
      setSource(result.source || 'api');
      setErr('');
    }
    closePanels();
    flash(
      true,
      wasEdit
        ? 'Department updated.'
        : 'Department created. Next: invite an HOD (optional Placement Coordinator too).'
    );
    await loadDepartments({ keepMessages: true });
  };

  const openInvite = (dept, slot = 'hod') => {
    setActiveId(dept.id);
    setMentorSlot(slot);
    setPanel('invite');
    setDeptForm(emptyDeptForm);
    const m = mentorFields(dept, slot);
    setHodForm({ name: m.name, email: m.email, reason: '' });
    setLinkInfo(null);
    setMsg('');
    setErr('');
  };

  const openReplace = (dept, slot = 'hod') => {
    setActiveId(dept.id);
    setMentorSlot(slot);
    setPanel('replace');
    setDeptForm(emptyDeptForm);
    setHodForm({ name: '', email: '', reason: '' });
    setLinkInfo(null);
    setMsg('');
    setErr('');
  };

  const openRevoke = (dept, slot = 'hod') => {
    setActiveId(dept.id);
    setMentorSlot(slot);
    setPanel('revoke');
    setDeptForm(emptyDeptForm);
    const m = mentorFields(dept, slot);
    setHodForm({ name: m.name, email: m.email, reason: '' });
    setLinkInfo(null);
    setMsg('');
    setErr('');
  };

  const openHistory = (dept) => {
    setActiveId(dept.id);
    setPanel('history');
    setDeptForm(emptyDeptForm);
    setMsg('');
    setErr('');
  };

  const openView = (dept) => {
    setActiveId(dept.id);
    setPanel('view');
    setDeptForm(emptyDeptForm);
    setMsg('');
    setErr('');
  };

  const inviteSetters = {
    setLinkInfo,
    flash,
  };

  const onInvite = async (e) => {
    e.preventDefault();
    if (!canEdit || !activeId) return;
    setBusy(true);
    const result =
      mentorSlot === 'coordinator'
        ? await inviteDepartmentCoordinator(activeId, hodForm)
        : await inviteDepartmentHod(activeId, hodForm);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    applyInviteResult(result, hodForm.email, inviteSetters, mentorSlot);
    setPanel(null);
    if (result.department) {
      setDepartments((prev) => mergeDepartmentRow(prev, result.department));
      setErr('');
    }
    await loadDepartments({ keepMessages: true });
  };

  const onReplace = async (e) => {
    e.preventDefault();
    if (!canEdit || !activeId) return;
    setBusy(true);
    const result =
      mentorSlot === 'coordinator'
        ? await replaceDepartmentCoordinator(activeId, hodForm)
        : await replaceDepartmentHod(activeId, hodForm);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    applyInviteResult(result, hodForm.email, inviteSetters, mentorSlot);
    setPanel(null);
    if (result.department) {
      setDepartments((prev) => mergeDepartmentRow(prev, result.department));
      setErr('');
    }
    await loadDepartments({ keepMessages: true });
  };

  const onReinvite = async (dept, slot = 'hod') => {
    if (!canEdit) return;
    setBusy(true);
    const result =
      slot === 'coordinator'
        ? await reinviteDepartmentCoordinator(dept.id)
        : await reinviteDepartmentHod(dept.id);
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    setActiveId(dept.id);
    setMentorSlot(slot);
    const m = mentorFields(dept, slot);
    setHodForm({ name: m.name, email: m.email, reason: '' });
    applyInviteResult(result, m.email, inviteSetters, slot);
    if (result.department) {
      setDepartments((prev) => mergeDepartmentRow(prev, result.department));
      setErr('');
    }
    await loadDepartments({ keepMessages: true });
  };

  const onRevoke = async (e) => {
    e?.preventDefault?.();
    if (!canEdit || !activeId || !activeDept) return;
    setBusy(true);
    const result =
      mentorSlot === 'coordinator'
        ? await revokeDepartmentCoordinator(activeId, hodForm.reason || '')
        : await revokeDepartmentHod(activeId, hodForm.reason || '');
    setBusy(false);
    if (!result.ok) {
      flash(false, result.error);
      return;
    }
    closePanels();
    setLinkInfo(null);
    flash(true, result.message || `${mentorLabel(mentorSlot)} revoked.`);
    if (result.department) {
      setDepartments((prev) => mergeDepartmentRow(prev, result.department));
      setErr('');
    }
    await loadDepartments({ keepMessages: true });
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
    setDepartments((prev) => prev.filter((d) => String(d.id) !== String(dept.id)));
    setErr('');
    flash(true, 'Department removed.');
    await loadDepartments({ keepMessages: true });
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
            Flow: create department → invite HOD (optional Placement Coordinator) → they set password → login.
            {source === 'api'
              ? ' Live API.'
              : source === 'local'
                ? ' Demo mode (local only — not emailed).'
                : source === 'unavailable' || source === 'error'
                  ? ' Server unavailable.'
                  : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!canEdit ? (
            <span className="mm-org-badge mm-org-badge--neutral">View only</span>
          ) : (
            <button type="button" className="mm-org-btn mm-org-btn--primary" onClick={openCreateDept}>
              <Plus size={15} /> Add department
            </button>
          )}
        </div>
      </div>

      {err ? <div className="mm-org-alert mm-org-alert--error">{err}</div> : null}
      {msg ? <div className="mm-org-alert mm-org-alert--success">{msg}</div> : null}

      {linkInfo ? (
        <section className="mm-org-panel" style={{ borderColor: 'rgba(12, 110, 140, 0.35)' }}>
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">
                {mentorLabel(linkInfo.mentorSlot || 'hod')} activation
              </h2>
              <p className="mm-org-panel__meta">
                {linkInfo.emailed
                  ? `Email sent to ${linkInfo.email}. They open the link, set a password, then sign in as ${mentorLabel(linkInfo.mentorSlot || 'hod')}.`
                  : linkInfo.emailSkipped || linkInfo.emailed === false
                    ? `Email was not delivered to ${linkInfo.email}${
                        linkInfo.emailDetail ? ` (${linkInfo.emailDetail})` : ''
                      }. Copy the link below and share it manually.`
                    : `Share with ${linkInfo.email}. They open the link, set a password, then sign in as ${mentorLabel(linkInfo.mentorSlot || 'hod')}.`}
                {linkInfo.source === 'local' ? ' Demo invite — no real email is sent.' : null}
              </p>
              {linkInfo.emailed ? (
                <span className="mm-org-badge mm-org-badge--active mt-2">Email sent</span>
              ) : linkInfo.url ? (
                <span className="mm-org-badge mm-org-badge--pending mt-2">Share link manually</span>
              ) : null}
            </div>
            <button
              type="button"
              className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
              onClick={() => setLinkInfo(null)}
            >
              <X size={14} /> Dismiss
            </button>
          </div>
          {linkInfo.url ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="mm-org-code mm-org-code--block" style={{ flex: 1 }}>
                {linkInfo.url}
              </code>
              <button
                type="button"
                className={`mm-org-btn ${copied ? 'mm-org-btn--ok' : 'mm-org-btn--primary'}`}
                onClick={copyLink}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <a
                className="mm-org-btn mm-org-btn--ghost"
                href={linkInfo.url}
                target="_blank"
                rel="noreferrer"
              >
                <Link2 size={15} /> Open
              </a>
            </div>
          ) : linkInfo.emailed ? (
            <p className="m-0 text-sm mm-org-text-muted">
              No backup link was returned. If the HOD did not get the email, use Resend.
            </p>
          ) : (
            <p className="m-0 text-sm mm-org-text-muted">
              No activation link was returned. Ask support to check invite email delivery, or try Resend.
            </p>
          )}
        </section>
      ) : null}

      <section className="mm-org-panel">
        <div className="mm-org-panel__head">
          <div>
            <h2 className="mm-org-panel__title">All departments</h2>
            <p className="mm-org-panel__meta">
              {loading ? 'Loading…' : `${departments.length} branch(es)`}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="mm-org-empty">Loading departments…</div>
        ) : departments.length ? (
          <>
            <TableToolbar
              query={deptTable.query}
              onQueryChange={deptTable.setQuery}
              placeholder="Search department, HOD, coordinator…"
              count={deptTable.count}
              total={deptTable.total}
            />
          <div className="mm-org-table-wrap">
            <table className="mm-org-table">
              <thead>
                <tr>
                  <SortableTh label="Department" sortKey="department" sort={deptTable.sort} onSort={deptTable.toggleSort} />
                  <SortableTh label="HOD" sortKey="hod" sort={deptTable.sort} onSort={deptTable.toggleSort} />
                  <SortableTh label="Coordinator" sortKey="coordinator" sort={deptTable.sort} onSort={deptTable.toggleSort} />
                  <SortableTh label="Students" sortKey="students" sort={deptTable.sort} onSort={deptTable.toggleSort} />
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deptTable.rows.length ? deptTable.rows.map((d) => (
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
                    <td>
                      <p className="mm-org-table__title">{d.coordinatorName || 'Unassigned'}</p>
                      <p className="mm-org-table__meta">{d.coordinatorEmail || 'No email'}</p>
                      <span className={`mm-org-badge ${statusBadge(d.coordinatorStatus)}`}>
                        {d.coordinatorStatus || 'unassigned'}
                      </span>
                    </td>
                    <td>{d.studentCount || 0}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                          onClick={() => openView(d)}
                        >
                          <Eye size={14} /> View
                        </button>
                        {canEdit ? (
                          <>
                            <button
                              type="button"
                              className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                              onClick={() => openEditDept(d)}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            {isMentorUnassigned(d, 'hod') ? (
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                                onClick={() => openInvite(d, 'hod')}
                              >
                                <UserPlus size={14} /> Invite HOD
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                  onClick={() => onReinvite(d, 'hod')}
                                  disabled={busy}
                                >
                                  <RefreshCw size={14} /> Resend HOD
                                </button>
                                <button
                                  type="button"
                                  className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                  onClick={() => openReplace(d, 'hod')}
                                >
                                  <Replace size={14} /> Replace HOD
                                </button>
                                <button
                                  type="button"
                                  className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                                  onClick={() => openRevoke(d, 'hod')}
                                  disabled={busy}
                                >
                                  <ShieldOff size={14} /> Revoke HOD
                                </button>
                              </>
                            )}
                            {isMentorUnassigned(d, 'coordinator') ? (
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                onClick={() => openInvite(d, 'coordinator')}
                              >
                                <UserPlus size={14} /> Invite Coord.
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                  onClick={() => onReinvite(d, 'coordinator')}
                                  disabled={busy}
                                >
                                  <RefreshCw size={14} /> Resend Coord.
                                </button>
                                <button
                                  type="button"
                                  className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                  onClick={() => openReplace(d, 'coordinator')}
                                >
                                  <Replace size={14} /> Replace Coord.
                                </button>
                                <button
                                  type="button"
                                  className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                                  onClick={() => openRevoke(d, 'coordinator')}
                                  disabled={busy}
                                >
                                  <ShieldOff size={14} /> Revoke Coord.
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
                )) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="mm-org-empty">No departments match this search.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </>
        ) : (
          <div className="mm-org-empty">
            {canEdit
              ? 'No departments yet. Use Add department to create a branch (e.g. CSE), then invite its HOD.'
              : 'No departments to show yet.'}
          </div>
        )}
      </section>

      {panel === 'dept' && canEdit ? (
        <ModalShell
          labelledBy="dept-modal-title"
          title={deptForm.id ? 'Edit department' : 'Add department'}
          meta="Name and code only. Invite the HOD after the branch exists."
          onClose={closePanels}
        >
          <form onSubmit={onSaveDept} autoComplete="off">
            {err ? <div className="mm-org-alert mm-org-alert--error mb-3">{err}</div> : null}
            <div className="mm-org-form-grid">
              <div>
                <label className="mm-org-label" htmlFor="dept-name">
                  Name
                </label>
                <input
                  id="dept-name"
                  name="mm_dept_name"
                  className="mm-org-input"
                  placeholder="e.g. Computer Science"
                  value={deptForm.name}
                  onChange={(e) => {
                    setErr('');
                    setDeptForm((f) => ({ ...f, name: e.target.value }));
                  }}
                  required
                  autoFocus
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="dept-code">
                  Code
                </label>
                <input
                  id="dept-code"
                  name="mm_dept_code"
                  className="mm-org-input"
                  placeholder="e.g. CSE"
                  value={deptForm.code}
                  onChange={(e) => {
                    setErr('');
                    setDeptForm((f) => ({ ...f, code: e.target.value }));
                  }}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <p className="mm-org-panel__meta mt-2 mb-0">
              Exact name or code matches are blocked. Distinct branches like CS-1 and CS-2 are fine.
            </p>
            <div className="mm-org-form-actions">
              <button type="submit" className="mm-org-btn mm-org-btn--primary" disabled={busy}>
                <Plus size={15} /> {deptForm.id ? 'Save department' : 'Create department'}
              </button>
              <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={closePanels}>
                Cancel
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}

      {panel === 'invite' && activeDept && canEdit ? (
        <ModalShell
          labelledBy="invite-modal-title"
          wide
          title={`Invite ${mentorLabel(mentorSlot)} · ${activeDept.name}`}
          meta={
            mentorSlot === 'coordinator'
              ? 'Same pattern as TPO: link → set password → login. Placement Coordinator has the same access as HOD for this branch.'
              : 'Same pattern as TPO: link → set password → login. TPO never sets their password.'
          }
          onClose={closePanels}
        >
          <div className="mm-org-form-grid mb-4">
            <div>
              <p className="mm-org-label">Department</p>
              <p className="m-0 text-sm font-semibold mm-org-text">{activeDept.name}</p>
            </div>
            <div>
              <p className="mm-org-label">Code</p>
              <p className="m-0 text-sm font-semibold mm-org-text">{activeDept.code || '—'}</p>
            </div>
          </div>
          <form onSubmit={onInvite}>
            <div className="mm-org-form-grid">
              <div>
                <label className="mm-org-label" htmlFor="hod-name">
                  {mentorLabel(mentorSlot)} name
                </label>
                <input
                  id="hod-name"
                  className="mm-org-input"
                  value={hodForm.name}
                  onChange={(e) => setHodForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Dr. Priya Sharma"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="hod-email">
                  {mentorLabel(mentorSlot)} email
                </label>
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
                <Mail size={15} /> Send invite
              </button>
              <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={closePanels}>
                Cancel
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}

      {panel === 'replace' && activeDept && canEdit ? (
        <ModalShell
          labelledBy="replace-modal-title"
          wide
          title={`Replace ${mentorLabel(mentorSlot)} · ${activeDept.name}`}
          meta={`Revokes ${mentorFields(activeDept, mentorSlot).email || 'current mentor'}, keeps students, invites the new ${mentorLabel(mentorSlot)}.`}
          onClose={closePanels}
        >
          <form onSubmit={onReplace}>
            <div className="mm-org-form-grid">
              <div>
                <label className="mm-org-label" htmlFor="rep-name">
                  New {mentorLabel(mentorSlot)} name
                </label>
                <input
                  id="rep-name"
                  className="mm-org-input"
                  value={hodForm.name}
                  onChange={(e) => setHodForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="rep-email">
                  New {mentorLabel(mentorSlot)} email
                </label>
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
                <label className="mm-org-label" htmlFor="rep-reason">
                  Reason (optional)
                </label>
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
                Cancel
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}

      {panel === 'revoke' && activeDept && canEdit ? (
        <ModalShell
          labelledBy="revoke-modal-title"
          title={`Revoke ${mentorLabel(mentorSlot)} · ${activeDept.name}`}
          meta={`Removes access for ${
            mentorFields(activeDept, mentorSlot).name ||
            mentorFields(activeDept, mentorSlot).email ||
            'this mentor'
          }. Students stay in this department.`}
          onClose={closePanels}
        >
          <form onSubmit={onRevoke}>
            <div>
              <label className="mm-org-label" htmlFor="rev-reason">
                Reason (optional)
              </label>
              <input
                id="rev-reason"
                className="mm-org-input"
                value={hodForm.reason}
                onChange={(e) => setHodForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Left college / role change"
                autoFocus
              />
            </div>
            <div className="mm-org-form-actions">
              <button type="submit" className="mm-org-btn mm-org-btn--danger" disabled={busy}>
                <ShieldOff size={15} /> Confirm revoke
              </button>
              <button type="button" className="mm-org-btn mm-org-btn--ghost" onClick={closePanels}>
                Cancel
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}

      {panel === 'view' && activeDept ? (
        <ModalShell
          labelledBy="view-modal-title"
          wide
          title={activeDept.name}
          meta={`Code ${activeDept.code || '—'} · ${activeDept.studentCount || 0} student(s)`}
          onClose={closePanels}
        >
          <div className="mm-org-form-grid">
            <div>
              <p className="mm-org-label">HOD</p>
              <p className="m-0 mm-org-table__title">{activeDept.hodName || 'Unassigned'}</p>
              <p className="mm-org-table__meta">{activeDept.hodEmail || 'No email'}</p>
              <span className={`mm-org-badge ${statusBadge(activeDept.hodStatus)}`}>
                {activeDept.hodStatus || 'unassigned'}
              </span>
            </div>
            <div>
              <p className="mm-org-label">Placement Coordinator (optional)</p>
              <p className="m-0 mm-org-table__title">
                {activeDept.coordinatorName || 'Unassigned'}
              </p>
              <p className="mm-org-table__meta">{activeDept.coordinatorEmail || 'No email'}</p>
              <span className={`mm-org-badge ${statusBadge(activeDept.coordinatorStatus)}`}>
                {activeDept.coordinatorStatus || 'unassigned'}
              </span>
              <p className="mt-1 text-xs mm-org-text-muted">Same portal access as HOD for this branch.</p>
            </div>
            <div>
              <p className="mm-org-label">Mentor events</p>
              <p className="m-0 text-sm mm-org-text-muted">
                {(activeDept.mentorHistory || []).length} recorded
              </p>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm mt-2"
                onClick={() => openHistory(activeDept)}
              >
                <History size={14} /> View history
              </button>
            </div>
          </div>
          {canEdit ? (
            <div className="mm-org-form-actions mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                onClick={() => openEditDept(activeDept)}
              >
                <Pencil size={14} /> Edit department
              </button>
              {isMentorUnassigned(activeDept, 'hod') ? (
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                  onClick={() => openInvite(activeDept, 'hod')}
                >
                  <UserPlus size={14} /> Invite HOD
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                    onClick={() => onReinvite(activeDept, 'hod')}
                    disabled={busy}
                  >
                    <RefreshCw size={14} /> Resend HOD
                  </button>
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                    onClick={() => openReplace(activeDept, 'hod')}
                  >
                    <Replace size={14} /> Replace HOD
                  </button>
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                    onClick={() => openRevoke(activeDept, 'hod')}
                    disabled={busy}
                  >
                    <ShieldOff size={14} /> Revoke HOD
                  </button>
                </>
              )}
              {isMentorUnassigned(activeDept, 'coordinator') ? (
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                  onClick={() => openInvite(activeDept, 'coordinator')}
                >
                  <UserPlus size={14} /> Invite Coordinator
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                    onClick={() => onReinvite(activeDept, 'coordinator')}
                    disabled={busy}
                  >
                    <RefreshCw size={14} /> Resend Coordinator
                  </button>
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                    onClick={() => openReplace(activeDept, 'coordinator')}
                  >
                    <Replace size={14} /> Replace Coordinator
                  </button>
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                    onClick={() => openRevoke(activeDept, 'coordinator')}
                    disabled={busy}
                  >
                    <ShieldOff size={14} /> Revoke Coordinator
                  </button>
                </>
              )}
            </div>
          ) : null}
        </ModalShell>
      ) : null}

      {panel === 'history' && activeDept ? (
        <ModalShell
          labelledBy="history-modal-title"
          wide
          title={`Mentor history · ${activeDept.name}`}
          meta="Invite, activate, revoke, and replace events"
          onClose={closePanels}
        >
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
                    · {h.at ? new Date(h.at).toLocaleString() : '—'}
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
        </ModalShell>
      ) : null}
    </div>
  );
}
