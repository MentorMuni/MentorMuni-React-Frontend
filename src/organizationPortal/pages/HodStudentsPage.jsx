import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Check,
  Copy,
  FileUp,
  Link2,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { getOrgSession } from '../../orgPortal';
import { isDemoSession } from '../demoAuth';
import { getHodWorkspaceSnapshot, resolveHodDepartment } from '../hodScope';
import { fetchDepartmentOptions } from '../departmentsApi';
import { subscribeOrgDb } from '../store';
import {
  addStudentManualApi,
  approveStudentInvite,
  decideAllInvites,
  deleteStudentApi,
  fetchStudentInvites,
  fetchStudents,
  getRegistrationLink,
  importStudentsApi,
  inviteStudentsApi,
  patchStudent,
  rejectStudentInvite,
  resendStudentSetupLink,
} from '../studentsApi';
import AssignToStudentModal from './AssignToStudentModal';
import { useTableQuery } from '../../hooks/useTableQuery';
import { TableToolbar } from '../../components/table/TableToolbar';
import { SortableTh } from '../../components/table/SortableTh';

const CSV_TEMPLATE = `email,name,college_id,batch_year
rahul.sharma@college.edu,Rahul Sharma,CSE2024A01,2025
priya.nair@college.edu,Priya Nair,CSE2024A02,2025
`;

function sourceLabel(source) {
  if (source === 'csv') return 'CSV';
  if (source === 'manual') return 'Manual';
  if (source === 'self_register') return 'Self-register';
  return 'Invite';
}

export default function HodStudentsPage() {
  const session = getOrgSession();
  const demo = isDemoSession(session);
  const location = useLocation();
  const [snap, setSnap] = useState(() => getHodWorkspaceSnapshot(session));
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [dataSource, setDataSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [scopeReady, setScopeReady] = useState(Boolean(snap.departmentId));
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('roster');
  const [addMode, setAddMode] = useState('manual');
  const [assignStudent, setAssignStudent] = useState(null);
  const [lastSetupUrl, setLastSetupUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [actionBusy, setActionBusy] = useState('');
  const [actionDone, setActionDone] = useState('');
  const [manual, setManual] = useState({
    name: '',
    email: '',
    collegeId: '',
    batchYear: '',
  });
  const [emails, setEmails] = useState('');
  const [csvText, setCsvText] = useState('');
  const [editing, setEditing] = useState(null); // student being edited
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    collegeId: '',
    batchYear: '',
  });
  const [editBusy, setEditBusy] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [busyId, setBusyId] = useState('');

  const queueTable = useTableQuery(pending, {
    searchKeys: ['name', 'email', 'collegeId', 'phone'],
    getSortValue: (row, key) => {
      if (key === 'name') return (row.name || row.email || '').toLowerCase();
      if (key === 'source') return sourceLabel(row.source);
      if (key === 'queued') return row.createdAt || '';
      return row[key];
    },
  });

  const rosterTable = useTableQuery(students, {
    searchKeys: ['name', 'email', 'collegeId', 'phone'],
    initialSort: { key: 'readiness', direction: 'desc' },
    getSortValue: (row, key) => {
      if (key === 'name') return (row.name || row.email || '').toLowerCase();
      if (key === 'login') return row.authStatus;
      if (key === 'readiness') return row.readiness;
      if (key === 'mock') return row.mockScore ?? row.testsDone;
      return row[key];
    },
  });

  const canInvite = snap.access?.canInviteStudents !== false;
  const dept = snap.department;
  const deptId = dept?.id || snap.departmentId || '';

  const registerUrl = useMemo(
    () => (deptId ? getRegistrationLink(deptId) : ''),
    [deptId]
  );

  const reload = async () => {
    if (!deptId) {
      setStudents([]);
      setPending([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [roster, queue] = await Promise.all([
      fetchStudents({ departmentId: deptId }),
      fetchStudentInvites({ status: 'pending', departmentId: deptId }),
    ]);
    setStudents(roster.students || []);
    setPending(queue.invitations || []);
    setDataSource(roster.source || queue.source || '');
    if (!roster.ok && roster.error) setErr(roster.error);
    else if (!queue.ok && queue.error) setErr(queue.error);
    setLoading(false);
  };

  // Hydrate HOD scope from API departments + session.department_id
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetchDepartmentOptions();
      if (cancelled) return;
      const list = (res.departments || []).map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code || '',
        hodEmail: d.hod_email || d.hodEmail || '',
      }));
      const next = getHodWorkspaceSnapshot(getOrgSession(), list);
      setSnap(next);
      setScopeReady(true);
      if (!next.departmentId) {
        setErr(
          'No department linked to this HOD account. Ask your TPO to assign you, then sign in again.'
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.key]);

  useEffect(() => {
    if (!demo) return undefined;
    return subscribeOrgDb(() => {
      const s = getOrgSession();
      const deptFromSession = resolveHodDepartment(s);
      setSnap(getHodWorkspaceSnapshot(s, deptFromSession ? [deptFromSession] : undefined));
    });
  }, [demo]);

  useEffect(() => {
    let cancelled = false;
    if (!scopeReady || !deptId) return undefined;
    Promise.all([
      fetchStudents({ departmentId: deptId }),
      fetchStudentInvites({ status: 'pending', departmentId: deptId }),
    ]).then(([roster, queue]) => {
      if (cancelled) return;
      setStudents(roster.students || []);
      setPending(queue.invitations || []);
      setDataSource(roster.source || queue.source || '');
      if (!roster.ok && roster.error) setErr(roster.error);
      else if (!queue.ok && queue.error) setErr(queue.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [deptId, scopeReady, location.key]);

  const flash = (ok, text, setupUrl = '') => {
    setErr(ok ? '' : text);
    setMsg(ok ? text : '');
    if (setupUrl) setLastSetupUrl(setupUrl);
    else if (!ok) setLastSetupUrl('');
  };

  const clearFlash = () => {
    setErr('');
    setMsg('');
    setLastSetupUrl('');
    setCopiedKey('');
    setActionDone('');
  };

  const pulseDone = (key) => {
    setActionDone(key);
    window.setTimeout(() => {
      setActionDone((cur) => (cur === key ? '' : cur));
    }, 2200);
  };

  const copyText = async (text, key = 'link') => {
    const value = String(text || '').trim();
    if (!value) {
      flash(false, 'Nothing to copy.');
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setErr('');
      setMsg('Copied to clipboard.');
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((cur) => (cur === key ? '' : cur));
      }, 2000);
    } catch {
      setMsg('');
      setErr('Could not copy — select the link manually.');
      setCopiedKey('');
    }
  };

  const onManual = async (e) => {
    e.preventDefault();
    if (!canInvite || !dept?.id) return;
    setActionBusy('manual');
    const res = await addStudentManualApi({
      ...manual,
      departmentId: dept.id,
      autoEnroll: true,
    });
    setActionBusy('');
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    setManual({ name: '', email: '', collegeId: '', batchYear: '' });
    flash(
      true,
      res.message || 'Student added to roster.',
      res.setupUrl || ''
    );
    pulseDone('manual');
    setTab('roster');
    window.setTimeout(() => setAddOpen(false), 900);
    await reload();
  };

  const onCsv = async (e) => {
    e.preventDefault();
    if (!canInvite || !dept?.id) return;
    setActionBusy('csv');
    const res = await importStudentsApi({
      csvText,
      departmentId: dept.id,
      sendInviteEmail: true,
      autoEnroll: true,
    });
    setActionBusy('');
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    const errN = res.errors?.length || 0;
    flash(
      true,
      res.message ||
        `Imported ${res.added} student(s)${res.skipped ? `, skipped ${res.skipped}` : ''}${
          errN ? `, ${errN} row error(s)` : ''
        }.`
    );
    setCsvText('');
    pulseDone('csv');
    setTab('roster');
    window.setTimeout(() => setAddOpen(false), 900);
    await reload();
  };

  const onCsvFile = async (file) => {
    if (!file) return;
    setCsvText(await file.text());
  };

  const onEmails = async (e) => {
    e.preventDefault();
    if (!canInvite || !dept?.id) return;
    if (!emails.trim()) {
      flash(false, 'Add at least one student email.');
      return;
    }
    setActionBusy('invite');
    const res = await inviteStudentsApi({
      emails,
      departmentId: dept.id,
      autoEnroll: true,
    });
    setActionBusy('');
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    setEmails('');
    flash(
      true,
      res.message || `${res.added || 0} student(s) invited onto the roster.`,
      res.setupUrl || ''
    );
    pulseDone('invite');
    setTab('roster');
    window.setTimeout(() => setAddOpen(false), 900);
    await reload();
  };

  const onDecide = async (id, decision) => {
    setBusyId(`${decision}:${id}`);
    const res =
      decision === 'approve' ? await approveStudentInvite(id) : await rejectStudentInvite(id);
    setBusyId('');
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    if (decision === 'approve') {
      flash(true, res.message || 'Approved.', res.setupUrl || '');
      setTab('roster');
    } else {
      flash(true, res.message || 'Denied.');
    }
    await reload();
  };

  const onDecideAll = async (decision) => {
    const ids = pending.map((inv) => inv.id).filter(Boolean);
    if (!ids.length) {
      flash(false, 'No pending invites to process.');
      return;
    }
    if (
      !window.confirm(
        `${decision === 'approve' ? 'Approve' : 'Deny'} all ${ids.length} pending student(s)?`
      )
    ) {
      return;
    }
    setBusyId(`bulk:${decision}`);
    const res = await decideAllInvites(ids, decision);
    setBusyId('');
    if (res.failCount && !res.okCount) {
      flash(false, res.errors?.[0] || 'Could not process invites.');
      await reload();
      return;
    }
    flash(
      true,
      res.message ||
        (decision === 'approve'
          ? `Approved ${res.okCount} student(s).`
          : `Denied ${res.okCount} student(s).`),
      res.setupUrl || ''
    );
    if (decision === 'approve' && res.okCount) setTab('roster');
    await reload();
  };

  const onResendSetup = async (student) => {
    const res = await resendStudentSetupLink(student.id);
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    flash(
      true,
      res.message || `Set-password link ready for ${student.email}.`,
      res.setupUrl || ''
    );
  };

  const openEdit = (s) => {
    setEditing(s);
    setEditForm({
      name: s.name || '',
      email: s.email || '',
      phone: s.phone || '',
      collegeId: s.collegeId || '',
      batchYear: s.batchYear || '',
    });
  };

  const onSaveEdit = async (e) => {
    e.preventDefault();
    if (!editing?.id) return;
    if (!String(editForm.name || '').trim() || !String(editForm.email || '').trim()) {
      flash(false, 'Name and email are required.');
      return;
    }
    setEditBusy(true);
    const res = await patchStudent(editing.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      collegeId: editForm.collegeId,
      batchYear: editForm.batchYear,
    });
    setEditBusy(false);
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    pulseDone('edit');
    flash(true, 'Student details updated.');
    window.setTimeout(async () => {
      setEditing(null);
      await reload();
    }, 900);
  };

  const onDeleteStudent = async (s) => {
    const label = s.name || s.email || 'this student';
    if (
      !window.confirm(
        `Remove ${label} from the roster?\n\nThis deletes the enrollment record. They can re-enroll later if needed.`
      )
    ) {
      return;
    }
    const res = await deleteStudentApi(s.id);
    if (!res.ok) {
      flash(false, res.error);
      return;
    }
    if (editing && String(editing.id) === String(s.id)) setEditing(null);
    flash(true, res.message || 'Student removed.');
    await reload();
  };

  if (!scopeReady) {
    return (
      <div className="mm-org-panel">
        <p className="m-0 text-sm mm-org-text-muted">
          Loading branch scope…
        </p>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="mm-org-panel">
        <h2 className="mm-org-panel__title">Branch not linked</h2>
        <p className="m-0 text-sm mm-org-text-muted">
          Ask your TPO to create the department and invite you as HOD. Your account needs a
          department_id from login. After that, sign in again to see this roster.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="mm-org-toolbar">
        <p className="m-0 text-sm mm-org-text-muted">
          {dept.name} ({dept.code || '—'}) · {students.length} enrolled · {pending.length} pending
          {dataSource ? ` · ${dataSource}` : ''}
          {loading ? ' · loading…' : ''}
        </p>
        <div className="flex flex-wrap gap-2">
          {canInvite ? (
            <button
              type="button"
              className="mm-org-btn mm-org-btn--sm mm-org-btn--primary"
              onClick={() => {
                clearFlash();
                setAddOpen(true);
              }}
            >
              <UserPlus size={14} /> Add students
            </button>
          ) : null}
          {[
            ['queue', `Queue (${pending.length})`],
            ['roster', 'Enrolled students'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`mm-org-btn mm-org-btn--sm ${tab === id ? 'mm-org-btn--primary' : 'mm-org-btn--ghost'}`}
              onClick={() => {
                clearFlash();
                setTab(id);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {err ? <div className="mm-org-alert mm-org-alert--error">{err}</div> : null}
      {msg ? <div className="mm-org-alert mm-org-alert--success">{msg}</div> : null}
      {lastSetupUrl ? (
        <div className="mm-org-callout">
          <p className="mm-org-callout__title">Set-password link (share if email did not send)</p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="mm-org-code text-xs" style={{ flex: 1 }}>
              {lastSetupUrl}
            </code>
            <button
              type="button"
              className={`mm-org-btn mm-org-btn--sm ${
                copiedKey === 'setup' ? 'mm-org-btn--ok' : 'mm-org-btn--ghost'
              }`}
              onClick={() => copyText(lastSetupUrl, 'setup')}
            >
              {copiedKey === 'setup' ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {!canInvite ? (
        <div className="mm-org-alert mm-org-alert--error">
          Student invites are disabled for HODs. Ask TPO to enable “Invite students to department”.
        </div>
      ) : null}

      {addOpen && canInvite ? (
        <div
          className="mm-org-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hod-add-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false);
          }}
        >
          <div className="mm-org-modal mm-org-modal--wide">
            <div className="mm-org-panel__head" style={{ marginBottom: 12 }}>
              <div>
                <h2 id="hod-add-title" className="mm-org-panel__title">
                  Add students to {dept.name}
                </h2>
                <p className="mm-org-panel__meta">
                  Manual, CSV, and email invites go straight to the roster. Registration link needs
                  approve / deny in the queue.
                </p>
              </div>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                onClick={() => setAddOpen(false)}
              >
                <X size={14} /> Close
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {[
                ['manual', 'Manual'],
                ['csv', 'CSV upload'],
                ['emails', 'Email list'],
                ['link', 'Registration link'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`mm-org-btn mm-org-btn--sm ${
                    addMode === id ? 'mm-org-btn--primary' : 'mm-org-btn--ghost'
                  }`}
                  onClick={() => {
                    clearFlash();
                    setAddMode(id);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {addMode === 'manual' ? (
              <form onSubmit={onManual} className="mm-org-form-grid">
                <div>
                  <label className="mm-org-label" htmlFor="hod-stu-name">
                    Full name
                  </label>
                  <input
                    id="hod-stu-name"
                    className="mm-org-input"
                    value={manual.name}
                    onChange={(e) => setManual((m) => ({ ...m, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mm-org-label" htmlFor="hod-stu-email">
                    Email
                  </label>
                  <input
                    id="hod-stu-email"
                    type="email"
                    className="mm-org-input"
                    value={manual.email}
                    onChange={(e) => setManual((m) => ({ ...m, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mm-org-label" htmlFor="hod-stu-roll">
                    College ID / roll
                  </label>
                  <input
                    id="hod-stu-roll"
                    className="mm-org-input"
                    value={manual.collegeId}
                    onChange={(e) => setManual((m) => ({ ...m, collegeId: e.target.value }))}
                    placeholder="CSE2024A01"
                  />
                </div>
                <div>
                  <label className="mm-org-label" htmlFor="hod-stu-batch">
                    Batch year
                  </label>
                  <input
                    id="hod-stu-batch"
                    className="mm-org-input"
                    value={manual.batchYear}
                    onChange={(e) => setManual((m) => ({ ...m, batchYear: e.target.value }))}
                    placeholder="2025"
                  />
                </div>
                <div className="mm-org-form-actions" style={{ gridColumn: '1 / -1' }}>
                  <button
                    type="submit"
                    className={`mm-org-btn ${actionDone === 'manual' ? 'mm-org-btn--ok' : 'mm-org-btn--primary'}`}
                    disabled={Boolean(actionBusy)}
                  >
                    {actionBusy === 'manual' ? (
                      'Enrolling…'
                    ) : actionDone === 'manual' ? (
                      <>
                        <Check size={15} /> Enrolled
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} /> Add to roster
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : null}

            {addMode === 'csv' ? (
              <form onSubmit={onCsv}>
                <p className="mm-org-panel__meta mb-3">
                  Columns: <code className="mm-org-code">email,name,college_id,batch_year</code>
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <label className="mm-org-btn mm-org-btn--sm mm-org-btn--ghost" style={{ cursor: 'pointer' }}>
                    <FileUp size={14} /> Choose CSV
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      hidden
                      onChange={(e) => onCsvFile(e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    className="mm-org-btn mm-org-btn--sm mm-org-btn--ghost"
                    onClick={() => setCsvText(CSV_TEMPLATE)}
                  >
                    Load template
                  </button>
                </div>
                <textarea
                  className="mm-org-textarea"
                  rows={8}
                  placeholder={CSV_TEMPLATE}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                />
                <div className="mm-org-form-actions">
                  <button
                    type="submit"
                    className={`mm-org-btn ${actionDone === 'csv' ? 'mm-org-btn--ok' : 'mm-org-btn--primary'}`}
                    disabled={Boolean(actionBusy) || !csvText.trim()}
                  >
                    {actionBusy === 'csv' ? (
                      'Importing…'
                    ) : actionDone === 'csv' ? (
                      <>
                        <Check size={15} /> Enrolled
                      </>
                    ) : (
                      <>
                        <FileUp size={15} /> Import to roster
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : null}

            {addMode === 'emails' ? (
              <form onSubmit={onEmails}>
                <label className="mm-org-label" htmlFor="hod-stu-emails">
                  Student emails
                </label>
                <textarea
                  id="hod-stu-emails"
                  className="mm-org-textarea"
                  placeholder={'student1@college.edu\nstudent2@college.edu'}
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                />
                <div className="mm-org-form-actions">
                  <button
                    type="submit"
                    className={`mm-org-btn ${actionDone === 'invite' ? 'mm-org-btn--ok' : 'mm-org-btn--primary'}`}
                    disabled={Boolean(actionBusy)}
                  >
                    {actionBusy === 'invite' ? (
                      'Inviting…'
                    ) : actionDone === 'invite' ? (
                      <>
                        <Check size={15} /> Invited
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} /> Invite to roster
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : null}

            {addMode === 'link' ? (
              <div>
                <p className="mm-org-panel__meta mb-3">
                  Share this link with your branch. Students register; you approve or deny in the
                  queue.
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <code className="mm-org-code text-xs" style={{ flex: 1 }}>
                    {registerUrl}
                  </code>
                  <button
                    type="button"
                    className={`mm-org-btn mm-org-btn--sm ${
                      copiedKey === 'reg' ? 'mm-org-btn--ok' : 'mm-org-btn--primary'
                    }`}
                    onClick={() => copyText(registerUrl, 'reg')}
                  >
                    {copiedKey === 'reg' ? (
                      <>
                        <Check size={14} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy link
                      </>
                    )}
                  </button>
                  <a
                    className="mm-org-btn mm-org-btn--sm mm-org-btn--ghost"
                    href={registerUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Link2 size={14} /> Open
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === 'queue' ? (
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Pending approvals</h2>
              <p className="mm-org-panel__meta">
                Self-registration requests only. Approve → set-password email → student login. Deny →
                they cannot log in.
              </p>
            </div>
            {pending.length ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                  disabled={Boolean(busyId)}
                  onClick={() => onDecideAll('approve')}
                >
                  <Check size={14} />{' '}
                  {busyId === 'bulk:approve'
                    ? 'Approving all…'
                    : `Approve all (${pending.length})`}
                </button>
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                  disabled={Boolean(busyId)}
                  onClick={() => onDecideAll('reject')}
                >
                  <X size={14} />{' '}
                  {busyId === 'bulk:reject' ? 'Denying all…' : `Deny all (${pending.length})`}
                </button>
              </div>
            ) : null}
          </div>
          {pending.length ? (
            <>
            <TableToolbar
              query={queueTable.query}
              onQueryChange={queueTable.setQuery}
              placeholder="Search student, email…"
              count={queueTable.count}
              total={queueTable.total}
            />
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <SortableTh label="Student" sortKey="name" sort={queueTable.sort} onSort={queueTable.toggleSort} />
                    <SortableTh label="Source" sortKey="source" sort={queueTable.sort} onSort={queueTable.toggleSort} />
                    <SortableTh label="Queued" sortKey="queued" sort={queueTable.sort} onSort={queueTable.toggleSort} />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {queueTable.rows.length ? queueTable.rows.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <p className="mm-org-table__title">{inv.name || inv.email}</p>
                        <p className="mm-org-table__meta">
                          {inv.email}
                          {inv.collegeId ? ` · ${inv.collegeId}` : ''}
                          {inv.phone ? ` · ${inv.phone}` : ''}
                        </p>
                      </td>
                      <td>
                        <span className="mm-org-badge mm-org-badge--pending">
                          {sourceLabel(inv.source)}
                        </span>
                      </td>
                      <td className="mm-org-text-muted">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                            disabled={Boolean(busyId)}
                            onClick={() => onDecide(inv.id, 'approve')}
                          >
                            <Check size={14} />{' '}
                            {busyId === `approve:${inv.id}` ? 'Approving…' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                            disabled={Boolean(busyId)}
                            onClick={() => onDecide(inv.id, 'reject')}
                          >
                            <X size={14} />{' '}
                            {busyId === `reject:${inv.id}` ? 'Denying…' : 'Deny'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4}>
                        <div className="mm-org-empty">No pending invites match this search.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <div className="mm-org-empty">
              {loading ? 'Loading…' : 'No pending invites for your branch.'}
            </div>
          )}
        </section>
      ) : null}

      {tab === 'roster' ? (
        <section className="mm-org-panel">
          <div className="mm-org-panel__head">
            <div>
              <h2 className="mm-org-panel__title">Enrolled students</h2>
              <p className="mm-org-panel__meta">Live from API when available</p>
            </div>
          </div>
          {students.length ? (
            <>
            <TableToolbar
              query={rosterTable.query}
              onQueryChange={rosterTable.setQuery}
              placeholder="Search name, email…"
              count={rosterTable.count}
              total={rosterTable.total}
            />
            <div className="mm-org-table-wrap">
              <table className="mm-org-table">
                <thead>
                  <tr>
                    <SortableTh label="Student" sortKey="name" sort={rosterTable.sort} onSort={rosterTable.toggleSort} />
                    <SortableTh label="Login" sortKey="login" sort={rosterTable.sort} onSort={rosterTable.toggleSort} />
                    <SortableTh label="Readiness" sortKey="readiness" sort={rosterTable.sort} onSort={rosterTable.toggleSort} />
                    <SortableTh label="Mock" sortKey="mock" sort={rosterTable.sort} onSort={rosterTable.toggleSort} />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rosterTable.rows.length ? rosterTable.rows.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <p className="mm-org-table__title">{s.name}</p>
                          <p className="mm-org-table__meta">
                            {s.email}
                            {s.collegeId ? ` · ${s.collegeId}` : ''}
                          </p>
                        </td>
                        <td>
                          <span
                            className={`mm-org-badge ${
                              s.authStatus === 'needs_password' || s.authStatus === 'pending'
                                ? 'mm-org-badge--pending'
                                : s.authStatus === 'disabled' || s.authStatus === 'blocked'
                                  ? 'mm-org-badge--danger'
                                  : 'mm-org-badge--active'
                            }`}
                          >
                            {s.authStatus === 'needs_password'
                              ? 'Set password'
                              : s.authStatus === 'pending'
                                ? 'Pending'
                                : s.authStatus === 'blocked'
                                  ? 'Blocked'
                                  : s.authStatus === 'disabled'
                                    ? 'Disabled'
                                    : 'Ready'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`mm-org-badge ${
                              s.readiness >= 75
                                ? 'mm-org-badge--active'
                                : s.readiness < 50
                                  ? 'mm-org-badge--danger'
                                  : 'mm-org-badge--pending'
                            }`}
                          >
                            {s.readiness}%
                          </span>
                        </td>
                        <td>{s.mockScore}</td>
                        <td>
                          <div className="flex gap-2 justify-end flex-wrap">
                            <button
                              type="button"
                              className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                              onClick={() => openEdit(s)}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            {s.authStatus === 'needs_password' ||
                            s.authStatus === 'ready' ||
                            s.authStatus === 'blocked' ||
                            s.setupUrl ? (
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                                onClick={() => onResendSetup(s)}
                              >
                                <Link2 size={14} /> Resend link
                              </button>
                            ) : null}
                            {s.authStatus !== 'disabled' && s.authStatus !== 'blocked' ? (
                              <button
                                type="button"
                                className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                                onClick={async () => {
                                  const res = await patchStudent(s.id, { status: 'DISABLED' });
                                  if (!res.ok) flash(false, res.error);
                                  else {
                                    flash(true, 'Student disabled.');
                                    await reload();
                                  }
                                }}
                              >
                                Disable
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="mm-org-btn mm-org-btn--danger mm-org-btn--sm"
                              onClick={() => onDeleteStudent(s)}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                            <button
                              type="button"
                              className="mm-org-btn mm-org-btn--primary mm-org-btn--sm"
                              onClick={() => setAssignStudent(s)}
                              disabled={snap.access?.canAssignPrograms === false}
                            >
                              <Plus size={14} /> Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="mm-org-empty">No students match this search.</div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <div className="mm-org-empty">
              {loading
                ? 'Loading roster…'
                : dataSource === 'api'
                  ? 'No students in this department yet. Add via CSV / manual / email, or share the registration link.'
                  : 'No students enrolled yet. Add via CSV / manual / email, or share the registration link.'}
            </div>
          )}
        </section>
      ) : null}

      {editing ? (
        <div
          className="mm-org-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hod-edit-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <div className="mm-org-modal mm-org-modal--wide">
            <div className="mm-org-panel__head" style={{ marginBottom: 12 }}>
              <div>
                <h2 id="hod-edit-title" className="mm-org-panel__title">
                  Edit student
                </h2>
                <p className="mm-org-panel__meta">{editing.email}</p>
              </div>
              <button
                type="button"
                className="mm-org-btn mm-org-btn--ghost mm-org-btn--sm"
                onClick={() => setEditing(null)}
              >
                <X size={14} /> Close
              </button>
            </div>
            <form onSubmit={onSaveEdit} className="mm-org-form-grid">
              <div>
                <label className="mm-org-label" htmlFor="hod-edit-name">
                  Full name
                </label>
                <input
                  id="hod-edit-name"
                  className="mm-org-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="hod-edit-email">
                  College email
                </label>
                <input
                  id="hod-edit-email"
                  type="email"
                  className="mm-org-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="hod-edit-phone">
                  Phone
                </label>
                <input
                  id="hod-edit-phone"
                  className="mm-org-input"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="hod-edit-roll">
                  College ID / roll
                </label>
                <input
                  id="hod-edit-roll"
                  className="mm-org-input"
                  value={editForm.collegeId}
                  onChange={(e) => setEditForm((f) => ({ ...f, collegeId: e.target.value }))}
                />
              </div>
              <div>
                <label className="mm-org-label" htmlFor="hod-edit-batch">
                  Batch year
                </label>
                <input
                  id="hod-edit-batch"
                  className="mm-org-input"
                  value={editForm.batchYear}
                  onChange={(e) => setEditForm((f) => ({ ...f, batchYear: e.target.value }))}
                />
              </div>
              <div className="mm-org-form-actions" style={{ gridColumn: '1 / -1' }}>
                <button
                  type="submit"
                  className={`mm-org-btn ${actionDone === 'edit' ? 'mm-org-btn--ok' : 'mm-org-btn--primary'}`}
                  disabled={editBusy || actionDone === 'edit'}
                >
                  {editBusy ? (
                    'Saving…'
                  ) : actionDone === 'edit' ? (
                    <>
                      <Check size={15} /> Saved
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
                <button
                  type="button"
                  className="mm-org-btn mm-org-btn--ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {assignStudent ? (
        <AssignToStudentModal
          student={assignStudent}
          departmentId={dept.id}
          onClose={() => setAssignStudent(null)}
          onAssigned={(title) => setMsg(`Assigned “${title}” to ${assignStudent.name}.`)}
        />
      ) : null}
    </div>
  );
}
